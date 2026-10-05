import assert from 'node:assert/strict'
import { targetAdvice } from '../../src/shared/lib/index.js'
import { data, render, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

const items = data.items.filter((item) => ['bait', 'lure'].includes(item.category))
const ids = Object.keys(data.fishVisuals)
const locales = ['en', 'ja', 'th']
let cases = 0
const targetScopeCopy = {
  en: 'This confirms the ROM compatibility check only; a bite or catch is not guaranteed.',
  ja: 'ROM条件を通ることのみ確認。食いつき・釣り上げは保証されません。',
  th: 'ยืนยันเฉพาะเงื่อนไขจาก ROM ไม่ได้ยืนยันโอกาสกินเหยื่อหรือจับขึ้น',
}
const noFishBaitLureScopeCopy = {
  en: 'Bait and lure choices: This compares compatible fish and recorded shop stock; it does not show which item gets more bites or is easier to land.',
  ja: 'エサ・ルアーの選び方：これは対応する魚と店頭在庫の比較です。食いつきや取り込みやすさは示しません。',
  th: 'การเลือกเหยื่อจริงและลัวร์: ข้อมูลนี้เทียบชนิดปลาที่ใช้ได้กับรายการของในร้าน ไม่ได้บอกว่าอันไหนทำให้ปลากินมากกว่าหรือตกขึ้นง่ายกว่า',
}
const previousBaitScopeCopy = {
  en: 'This confirms the bait check only; it does not establish bite odds or landing success.',
  ja: 'エサの判定を通ることのみ確認。食いつき率・取り込みは示しません。',
  th: 'ยืนยันเฉพาะว่าเข้าเงื่อนไขตรวจเหยื่อ ไม่ได้ยืนยันโอกาสกินเหยื่อหรือจับขึ้น',
}
const flyScopeCopy = {
  en: 'Showing fly bodies whose body-profile check passes for this fish; a bite or catch is not guaranteed.',
  ja: 'この魚のボディプロフィール判定を通るフライボディです。食いつき・釣り上げは保証されません。',
  th: 'แสดงบอดี้ฟลายที่ผ่านเงื่อนไขโปรไฟล์ของปลานี้ ไม่ได้รับประกันว่าปลากินหรือตกขึ้นได้',
}

function occurrences(value, phrase) {
  return value.split(phrase).length - 1
}

async function checkTargetCatalogueScope(locale, category, fish) {
  const query = `?category=${category}&fish=${fish}&stage=1&route=float`
  const { nodes, url } = await renderCatalogue(locale, query)
  const status = nodes['fish-status'].textContent
  const cards = unescapeHtml(nodes.cards.innerHTML)
  assert(nodes.cards.innerHTML.includes('<article'), `No ${category} results in ${locale}`)
  assert(
    status.includes(targetScopeCopy[locale]),
    `${locale}/${category} lacks the shared scope note`,
  )
  assert.equal(occurrences(status, targetScopeCopy[locale]), 1)
  assert.equal(occurrences(cards, targetScopeCopy[locale]), 0)
  assert.equal(occurrences(cards, previousBaitScopeCopy[locale]), 0)
  assert(
    !cards.includes('bait check only'),
    `${locale}/${category} labels a non-bait check as bait`,
  )
  validate(cards, url)
}

async function checkStandaloneTargetScope(locale, category, id, fish) {
  const query = new URLSearchParams({ category, id, fish, route: 'float', stage: '1' })
  const { html } = await render('item', locale, query)
  const markup = unescapeHtml(html)
  assert.equal(occurrences(markup, targetScopeCopy[locale]), 1)
  assert(!markup.includes('bait check only'), `${locale}/${category}:${id} has a bait-only caveat`)
}

async function checkNoTargetScope(locale, category) {
  const { nodes } = await renderCatalogue(locale, `?category=${category}&stage=1&route=float`)
  const status = unescapeHtml(nodes['fish-status'].textContent || nodes['fish-status'].innerHTML)
  const requiresBaitLureScope = ['bait', 'lure', 'all'].includes(category)
  assert.equal(
    occurrences(status, noFishBaitLureScopeCopy[locale]),
    requiresBaitLureScope ? 1 : 0,
    `${locale}/${category} no-fish scope count`,
  )
  assert.equal(occurrences(status, targetScopeCopy[locale]), 0)
  const cards = unescapeHtml(nodes.cards.innerHTML)
  assert.equal(occurrences(cards, noFishBaitLureScopeCopy[locale]), 0)
  assert.equal(occurrences(cards, targetScopeCopy[locale]), 0)
  assert.equal(occurrences(cards, previousBaitScopeCopy[locale]), 0)
}

async function checkFlyScope(locale) {
  const { nodes } = await renderCatalogue(locale, '?category=flymaker&part=fly&fish=06&stage=1')
  assert(nodes['fish-status'].textContent.includes(flyScopeCopy[locale]))
}

function accepted(item, fish, route) {
  const use = item.playerUse || {}
  const list = item.category === 'bait' ? use.fishIdsByRoute?.[route] || [] : use.fishIds || []
  return list.includes(fish)
}

function context(stage, route) {
  return {
    allItems: data.items,
    locationStage: String(stage),
    baitRoute: route,
    useOf: (item) => item.playerUse || {},
    fishIdsFor: (item) =>
      item.category === 'bait'
        ? item.playerUse?.fishIdsByRoute?.[route] || []
        : item.playerUse?.fishIds || [],
  }
}

function checkCheapest(item, fish, stage, route, current, result) {
  const eligible = items
    .filter(
      (other) =>
        other.id !== item.id &&
        other.category === item.category &&
        accepted(other, fish, route) &&
        other.playerUse.shops?.some((shop) => Number(shop.stage) === stage && !shop.condition) &&
        (!current || other.priceYen < item.priceYen),
    )
    .sort((a, b) => a.priceYen - b.priceYen || a.id.localeCompare(b.id))
  if (eligible.length)
    assert(
      result.alternatives.some((other) => !other.conditional && other.id === eligible[0].id),
      'Cheapest unconditional choice omitted',
    )
}

function checkMetadata(item, fish, stage, route) {
  const result = targetAdvice(context(stage, route), item, fish)
  cases += 1
  if (!accepted(item, fish, route)) {
    assert.equal(result, null)
    return
  }
  assert.equal(result.fish, fish)
  assert.equal(result.route, item.category === 'lure' ? 'lure' : route)
  assert.equal(result.stage, stage)
  assert.equal(result.compatible, true)
  const current = item.playerUse.shops?.find((shop) => Number(shop.stage) === stage)
  assert.equal(Boolean(result.currentStock?.available), Boolean(current))
  if (current) {
    assert.equal(Boolean(result.currentStock.conditional), Boolean(current.condition))
    assert.equal(result.currentStock.priceYen, item.priceYen)
  }
  checkCheapest(item, fish, stage, route, current, result)
  for (const option of result.alternatives) {
    const other = items.find(
      (entry) => entry.category === option.category && entry.id === option.id,
    )
    assert(other && other.category === item.category)
    assert(accepted(other, fish, route))
    const offer = other.playerUse.shops.find((shop) => Number(shop.stage) === stage)
    assert(offer, `Unstocked target alternative: ${other.category}:${other.id}/${stage}`)
    assert.equal(option.priceYen, other.priceYen)
    assert.equal(Boolean(option.conditional), Boolean(offer.condition))
    if (result.currentStock?.available) assert(option.priceYen < item.priceYen)
  }
}

for (const route of ['float', 'sinker'])
  for (const stage of [1, 2, 3, 4, 5, 6])
    for (const fish of ids) for (const item of items) checkMetadata(item, fish, stage, route)

const acceptedItem = items.find((item) => accepted(item, '06', 'float'))
assert.equal(targetAdvice(context(1, 'float'), acceptedItem, ''), null)
for (const stage of ['', '0', '7', 'invalid']) {
  const result = targetAdvice(context(stage, 'float'), acceptedItem, '06')
  assert.equal(result.stage, null)
  assert.equal(result.alternatives.length, 0)
}

for (const locale of locales) {
  const { runtime, nodes, url } = await renderCatalogue(locale, '?category=lure&fish=06&stage=1')
  runtime.allItems = data.items
  runtime.locationStage = '1'
  runtime.baitRoute = 'float'
  nodes['fish-filter'].value = '06'
  for (const item of items.filter((entry) => accepted(entry, '06', 'float'))) {
    const html = unescapeHtml(runtime.renderItemCard(item))
    assert(html.includes('data-target-advice'))
    if (item.category === 'lure' && item.id === '17') {
      const owned = {
        en: 'Keep using it if owned.',
        th: 'ถ้ามีชิ้นนี้อยู่แล้วใช้ต่อได้',
        ja: '所持していればそのまま使えます。',
      }
      assert(
        html
          .slice(0, html.indexOf('<details class="card-decision-disclosure"'))
          .includes(owned[locale]),
      )
    }
    assert(html.includes('class="card-decision-disclosure"'))
    assert(html.includes('class="record-details"'))
    validate(html, url)
    const alternatives = [
      ...html.matchAll(/<li data-target-alternative="([^"]+)"><a href="([^"]+)"/g),
    ]
    const expected = targetAdvice(context(1, 'float'), item, '06').alternatives
    if (expected.length) assert(alternatives.length, 'Missing actionable alternative link')
    for (const match of alternatives) {
      const next = new URL(match[2], url)
      const expectedRoute = item.category === 'lure' ? 'lure' : 'float'
      assert.equal(next.searchParams.get('fish'), '06')
      assert.equal(next.searchParams.get('stage'), '1')
      assert.equal(next.searchParams.get('route'), expectedRoute)
    }
  }
  nodes['fish-filter'].value = ''
  assert(!runtime.renderItemCard(items[0]).includes('data-target-advice'))
}

for (const locale of locales) {
  for (const [category, fish] of [
    ['bait', '03'],
    ['lure', '06'],
    ['all', '06'],
  ]) {
    await checkTargetCatalogueScope(locale, category, fish)
  }
  for (const category of ['bait', 'lure', 'all', 'rod', 'food', 'general_tool', 'flymaker'])
    await checkNoTargetScope(locale, category)
  await checkStandaloneTargetScope(locale, 'bait', '01', '03')
  await checkStandaloneTargetScope(locale, 'lure', '17', '06')
  await checkFlyScope(locale)
}

console.log(
  `PASS: ${cases} target/rig/area metadata cases; contextual cards and retained evidence in EN/JA/TH.`,
)

const profileCases = [
  ['lure', '17', '06', 'float', 1, true],
  ['lure', '48', '06', 'float', 1, true],
  ['bait', '01', '06', 'float', 1, true],
  ['bait', '01', '06', 'sinker', 1, false],
  ['bait', '17', '38', 'float', 3, true],
  ['bait', '17', '38', 'sinker', 3, false],
]
for (const locale of locales) {
  for (const [category, id, fish, route, stage, compatible] of profileCases) {
    const result = await render(
      'item',
      locale,
      new URLSearchParams({
        category,
        id,
        fish,
        route,
        stage: String(stage),
      }),
    )
    const html = unescapeHtml(result.html)
    assert.equal(html.includes('data-target-advice'), compatible)
    if (compatible) {
      assert(html.includes(`data-target-fish="${fish}"`))
      assert(html.includes(`data-target-stage="${stage}"`))
      const item = items.find((entry) => entry.category === category && entry.id === id)
      assert(html.includes(item.recordBytesHex))
      assert(html.includes('class="decision-reasons"'))
      assert(html.includes(item.baitLureDecision.recommendation[locale]))
    }
  }
}
