import assert from 'node:assert/strict'
import { targetAdvice } from '../../src/shared/lib/index.js'
import { data, render, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

const items = data.items.filter((item) => ['bait', 'lure'].includes(item.category))
const ids = Object.keys(data.fishVisuals)
const locales = ['en', 'ja', 'th']
let cases = 0

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
