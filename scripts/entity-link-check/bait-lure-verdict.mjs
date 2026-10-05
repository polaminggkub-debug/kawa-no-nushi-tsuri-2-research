import assert from 'node:assert/strict'
import { data, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

const items = data.items.filter((item) => ['bait', 'lure'].includes(item.category))
assert.equal(items.length, 104)
const commonScopeCopy = {
  en: 'Bait and lure choices: This compares compatible fish and recorded shop stock; it does not show which item gets more bites or is easier to land.',
  ja: 'エサ・ルアーの選び方：これは対応する魚と店頭在庫の比較です。食いつきや取り込みやすさは示しません。',
  th: 'การเลือกเหยื่อจริงและลัวร์: ข้อมูลนี้เทียบชนิดปลาที่ใช้ได้กับรายการของในร้าน ไม่ได้บอกว่าอันไหนทำให้ปลากินมากกว่าหรือตกขึ้นง่ายกว่า',
}

function occurrences(value, phrase) {
  return value.split(phrase).length - 1
}

function coverage(item, route) {
  return item.category === 'bait' ? item.playerUse.fishIdsByRoute[route] : item.playerUse.fishIds
}

function regularStock(item, stage) {
  return item.playerUse.shops.some((shop) => Number(shop.stage) === stage && !shop.condition)
}

function checkChoice(match, item, route, base) {
  const [, key, stageText, priceText, href] = match
  const target = data.items.find((entry) => `${entry.category}:${entry.id}` === key)
  assert(target, `Unknown purchase choice ${key}`)
  const stage = Number(stageText)
  assert(regularStock(target, stage), `Unrecorded/unconditional sale ${key}/${stage}`)
  assert.equal(Number(priceText), target.priceYen)
  const accepted = new Set(coverage(target, route))
  assert(
    coverage(item, route).every((id) => accepted.has(id)),
    `Coverage lost: ${item.id} → ${key}/${route}`,
  )
  const url = new URL(unescapeHtml(href), base)
  assert.equal(url.searchParams.get('category'), target.category)
  assert.equal(url.searchParams.get('id'), target.id)
  assert.equal(url.searchParams.get('stage'), stageText)
  assert.equal(url.searchParams.get('route'), route)
  assert(url.searchParams.get('return'), 'Purchase link lost browsing return')
  return { target, stage }
}

function checkLocalPriority(item, selectedStage, choices) {
  if (!selectedStage) return
  const local = item.baitLureDecision.cheaperByStage?.[selectedStage] || []
  const qualified = local.filter((ref) => {
    const target = data.items.find(
      (entry) => entry.category === ref.category && entry.id === ref.id,
    )
    return target && regularStock(target, selectedStage) && target.priceYen < item.priceYen
  })
  if (!qualified.length) return
  assert(choices.length, `Missing current-area lower-price offer: ${item.category}:${item.id}`)
  assert(
    choices.every((choice) => choice.stage === selectedStage),
    'Elsewhere displaced local offer',
  )
  assert.equal(
    Math.min(...choices.map((choice) => choice.target.priceYen)),
    Math.min(...qualified.map((ref) => ref.priceYen)),
  )
}

function checkOwnedAvailability(visible, item, stage, lang) {
  const stock = unescapeHtml(visible.match(/class="bait-lure-own-stock">([^<]*)<\/p>/)?.[1] || '')
  const rows = item.playerUse.shops
  if (!rows.length) {
    const noOffer = {
      en: 'No sale for this item is recorded',
      ja: '販売記録がありません',
      th: 'ไม่พบชิ้นนี้ในรายการร้านทั้ง 6 ด่าน',
    }
    assert(stock.includes(noOffer[lang]), 'ROM price presented as own-item stock')
    assert(!stock.includes('¥'))
  } else if (stage && regularStock(item, stage)) {
    assert(stock.includes(String(item.priceYen)), 'Own stocked price missing')
  } else if (stage && !rows.some((row) => Number(row.stage) === stage)) {
    const notHere = { en: `Area ${stage}`, ja: `エリア${stage}`, th: `ด่าน ${stage}` }
    assert(stock.includes(notHere[lang]))
    assert(!stock.includes(`¥${item.priceYen}`), 'Unrecorded current-area sale claimed')
  }
}

function checkEmptyRoute(visible, item, route, base, stage, lang) {
  if (item.category !== 'bait' || coverage(item, route).length) return
  const own = unescapeHtml(
    visible.match(/class="bait-lure-owned-action">([\s\S]*?)<\/p>/)?.[1] || '',
  )
  const negative = {
    en: /No (?:compatible )?fish are recorded/,
    ja: /記録されていません/,
    th: /ไม่พบปลาที่บันทึก/,
  }
  assert(
    negative[lang].test(own),
    `Empty method implies compatible fish: ${item.id}/${route}/${lang}`,
  )
  const other = route === 'float' ? 'sinker' : 'float'
  if (!coverage(item, other).length) return
  const match = own.match(/data-bait-lure-route-choice="([^"]+)" href="([^"]+)"/)
  assert(match, 'Empty rig must offer a supported rig')
  const next = new URL(match[2], base)
  assert.equal(next.searchParams.get('category'), 'bait')
  assert.equal(next.searchParams.get('id'), item.id)
  assert.equal(next.searchParams.get('route'), other)
  if (stage) assert.equal(next.searchParams.get('stage'), String(stage))
  assert(next.searchParams.get('return'))
}

function checkCard(runtime, base, item, stage, route, lang) {
  const html = runtime.renderItemCard(item)
  const visible = html.split('<details class="card-decision-disclosure"')[0]
  assert(visible.includes(`data-bait-lure-verdict="${item.category}:${item.id}"`))
  assert(visible.includes('bait-lure-owned-action'))
  assert(visible.includes('bait-lure-own-stock'))
  assert(
    !visible.includes('bait-lure-evidence-limit'),
    `Repeated scope caveat remains on ${item.category}:${item.id}`,
  )
  checkOwnedAvailability(visible, item, stage, lang)
  checkEmptyRoute(visible, item, route, base, stage, lang)
  const matches = [
    ...visible.matchAll(
      /data-bait-lure-choice="([^"]+)" data-offer-stage="([^"]+)" data-offer-price="([^"]+)" href="([^"]+)"/g,
    ),
  ]
  assert(matches.length <= 2, 'Visible buying list is not compact')
  const choices = matches.map((match) => checkChoice(match, item, route, base))
  if (visible.includes('bait-lure-buy-choices'))
    assert(
      choices.every((choice) => choice.target.priceYen < item.priceYen),
      'Buying-new choice is not cheaper',
    )
  checkLocalPriority(item, stage, choices)
  const equalOffers = item.baitLureDecision?.equalPriceByStage || {}
  const hasEqualOffer = stage
    ? Boolean(equalOffers[String(stage)]?.length)
    : Object.values(equalOffers).some((offers) => offers.length)
  assert(
    choices.length ||
      (hasEqualOffer && visible.includes('data-equal-price-choice')) ||
      visible.includes('data-bait-lure-fish-picker') ||
      visible.includes('data-bait-route-switch'),
  )
  if (item.category === 'bait' && item.id === '17') {
    const condition = {
      en: 'sell at least one Ayu',
      ja: 'アユを1匹以上売',
      th: 'ขายปลาอายุจากข้องอย่างน้อย 1 ตัว',
    }
    assert(unescapeHtml(visible).includes(condition[lang]))
  }
  validate(html, base)
}

async function checkSharedNoFishScope(lang, category) {
  const { nodes } = await renderCatalogue(lang, `?category=${category}&sort=id`)
  const status = unescapeHtml(nodes['fish-status'].textContent || nodes['fish-status'].innerHTML)
  const cards = unescapeHtml(nodes.cards.innerHTML)
  assert.equal(occurrences(status, commonScopeCopy[lang]), 1, `${lang}/${category} scope count`)
  assert.equal(occurrences(cards, commonScopeCopy[lang]), 0, `${lang}/${category} card scope`)
  assert.equal(occurrences(cards, 'bait-lure-evidence-limit'), 0, `${lang}/${category} card marker`)
  const expectedVerdicts = category === 'bait' ? 23 : category === 'lure' ? 81 : 104
  assert.equal(
    (cards.match(/data-bait-lure-verdict=/g) || []).length,
    expectedVerdicts,
    `${lang}/${category} lost bait/lure decisions`,
  )
}

async function checkUnrelatedCategoryHasNoSharedScope(lang, category) {
  const { nodes } = await renderCatalogue(lang, `?category=${category}&sort=id`)
  const status = unescapeHtml(nodes['fish-status'].textContent || nodes['fish-status'].innerHTML)
  assert.equal(occurrences(status, commonScopeCopy[lang]), 0, `${lang}/${category} unrelated scope`)
}

for (const lang of ['en', 'ja', 'th']) {
  for (const category of ['bait', 'lure', 'all']) await checkSharedNoFishScope(lang, category)
  for (const category of ['rod', 'food', 'general_tool', 'flymaker'])
    await checkUnrelatedCategoryHasNoSharedScope(lang, category)
  for (const route of ['float', 'sinker']) {
    for (const stage of [0, 1, 2, 3, 4, 5, 6]) {
      const { runtime, url, nodes } = await renderCatalogue(
        lang,
        `?category=lure&stage=${stage || ''}&route=${route}`,
      )
      for (const item of items) checkCard(runtime, url, item, stage, route, lang)
      const overview = nodes['category-decisions'].innerHTML
      assert(
        overview.includes('data-lure-coverage-pair'),
        'Lure coverage kit is hidden from category overview',
      )
      assert.equal(
        (overview.match(/data-lure-coverage-pair/g) || []).length,
        1,
        'Coverage kit duplicated in category overview',
      )
    }
  }
}
console.log(
  'PASS: 104 visible bait/lure decisions across six areas and both rigs in EN/JA/TH; choices preserve stock, price, coverage, context and local priority.',
)
