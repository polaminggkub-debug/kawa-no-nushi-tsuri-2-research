import assert from 'node:assert/strict'
import { data, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

const items = data.items.filter((item) => ['bait', 'lure'].includes(item.category))
assert.equal(items.length, 104)
const baitScopeCopy = {
  en: 'Baits: A bait on the fish’s list bites once your float is on the fish’s tile: about 2 seconds, or about 10 seconds on a sinker rig (bottom fish only). Time, weather, rod, hook and HP change nothing: if a fish ignores you, move the cast, not the bait.',
  ja: 'エサ：リストにあるエサは、ウキが魚と同じマスにあれば食いつきます。約2秒（オモリは約10秒、底の魚のみ）。時間・天気・竿・ハリ・HPは関係ありません。反応しないときは、エサではなく投げる位置を変えます。',
  th: 'เหยื่อจริง: เหยื่อที่อยู่ในรายชื่อของปลาจะถูกกินเมื่อทุ่นอยู่ช่องเดียวกับปลา ราว 2 วินาที (ชุดตะกั่วราว 10 วินาที เฉพาะปลาหน้าดิน) เวลา อากาศ คัน เบ็ด และ HP ไม่มีผล ถ้าปลาไม่สนใจ ให้ขยับจุดปล่อย ไม่ใช่เปลี่ยนเหยื่อ',
}
const lureScopeCopy = {
  en: 'Lures: A lure on the fish’s list is chased once the lure is on the fish’s tile and you keep tapping A or B; press A once when the fish is level with the lure to hook it. Time, weather and rod change nothing.',
  ja: 'ルアー：リストにあるルアーは、魚と同じマスにあり、AかBを連打していれば追われます。魚が同じ高さに来たらAを1回押してかけます。時間・天気・竿は関係ありません。',
  th: 'เหยื่อปลอม: ลัวร์ที่อยู่ในรายชื่อของปลาจะมีปลาว่ายตามเมื่อปลาอยู่ช่องเดียวกับลัวร์และคุณกด A หรือ B ต่อเนื่อง พอปลาอยู่ระดับเดียวกับลัวร์ให้กด A หนึ่งครั้งเพื่อเกี่ยวปลา เวลา อากาศ และคันไม่มีผล',
}
const commonScopeCopy = {
  en: 'Bait and lure choices: A bait or lure on the fish’s list bites once your float or lure is on the fish’s tile (float about 2 s, sinker about 10 s, bottom fish only). Time, weather, rod, hook and HP change nothing: if a fish ignores you, move the cast.',
  ja: 'エサ・ルアーの選び方：魚のリストにあるエサ・ルアーは、ウキやルアーが魚と同じマスにあれば食いつきます（ウキ約2秒、オモリ約10秒・底の魚のみ）。時間・天気・竿・ハリ・HPは関係ありません。反応しないときは投げる位置を変えます。',
  th: 'การเลือกเหยื่อจริงและลัวร์: เหยื่อหรือลัวร์ที่อยู่ในรายชื่อของปลาจะถูกกินเมื่อทุ่นหรือลัวร์อยู่ช่องเดียวกับปลา (ทุ่นราว 2 วินาที ตะกั่วราว 10 วินาที เฉพาะปลาหน้าดิน) เวลา อากาศ คัน เบ็ด และ HP ไม่มีผล ถ้าปลาไม่สนใจ ให้ขยับจุดปล่อย',
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
  const expectedScope = { all: commonScopeCopy, bait: baitScopeCopy, lure: lureScopeCopy }[
    category
  ][lang]
  assert.equal(occurrences(status, expectedScope), 1, `${lang}/${category} scope count`)
  assert.equal(occurrences(cards, expectedScope), 0, `${lang}/${category} card scope`)
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
