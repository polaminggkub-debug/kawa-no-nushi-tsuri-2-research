import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  itemShopSortState,
  sortItemsByShopAvailability,
} from '../../src/entities/item/shop-availability-sort.js'
import { purchaseSortCopy, rawPriceSortCopy } from '../../src/pages/equipment/purchase-sort-copy.js'
import { data, renderCatalogue, root } from './shared.mjs'

checkFixtures()
for (const area of ['', '1', '2', '3', '4', '5', '6', '99', 'invalid']) checkCatalogue(area)
for (const locale of ['en', 'th', 'ja']) {
  checkTemplate(locale)
  for (const area of ['', '1', '3', '6', '99', 'invalid']) await checkRuntime(locale, area)
}
console.log(
  'Shop availability sort PASS: ordinary/conditional/unavailable order, safe area scope, separate raw-price mode and three-language UI.',
)

function fixture(id, priceYen, shops, category = 'bait') {
  return { id, category, priceYen, playerUse: { shops } }
}

function checkFixtures() {
  const items = [
    fixture('01', 0, []),
    fixture('02', 1, [{ stage: 2 }]),
    fixture('03', 1, [{ stage: 1, condition: 'quest required' }]),
    fixture('04', 30, [{ stage: 1 }]),
    fixture('05', 20, [{ stage: 1 }]),
    fixture('06', null, [{ stage: 1 }]),
    fixture('07', -1, [{ stage: 1 }]),
    fixture('08', 1, [{ stage: 1 }], 'fly'),
    fixture('09', 1, [{ stage: 1, shop: 'fly_bundle' }]),
    fixture('0A', 1, [{ stage: 1, bundle: {} }]),
    fixture('0B', 20, [{ stage: 1 }]),
  ]
  const before = JSON.stringify(items)
  assert.deepEqual(
    sortItemsByShopAvailability(items, 1).map((item) => item.id),
    ['05', '0B', '04', '03', '01', '02', '06', '07', '09', '0A', '08'],
  )
  assert.equal(JSON.stringify(items), before, 'Sorting must not mutate source or offer data')
  for (const invalid of ['', '99', 'invalid', '2.5', null]) {
    assert.deepEqual(itemShopSortState(items[1], invalid), { rank: 0, price: 1, stage: 0 })
  }
  for (const category of ['fly', 'fly_wing', 'fly_tail']) {
    assert.equal(itemShopSortState(fixture('01', 1, [{ stage: 1 }], category), 1).rank, 2)
  }
  assert.equal(itemShopSortState(fixture('01', 0, [{ stage: 1 }]), 1).price, 0)
  for (const price of [undefined, NaN, Infinity, '1']) {
    assert.equal(itemShopSortState(fixture('01', price, [{ stage: 1 }]), 1).rank, 2)
  }
}

function independentState(item, area) {
  const stage = /^[1-6]$/.test(String(area)) ? Number(area) : 0
  const offers = ['fly', 'fly_wing', 'fly_tail'].includes(item.category)
    ? []
    : (item.playerUse?.shops || []).filter(
        (offer) =>
          /^[1-6]$/.test(String(offer.stage)) &&
          (!stage || Number(offer.stage) === stage) &&
          offer.shop !== 'fly_bundle' &&
          !offer.bundle,
      )
  if (
    !offers.length ||
    typeof item.priceYen !== 'number' ||
    !Number.isFinite(item.priceYen) ||
    item.priceYen < 0
  )
    return { rank: 2, price: Infinity, stage }
  return { rank: offers.some((offer) => !offer.condition) ? 0 : 1, price: item.priceYen, stage }
}

function checkCatalogue(area) {
  for (const item of data.items)
    assert.deepEqual(
      itemShopSortState(item, area),
      independentState(item, area),
      `Wrong purchase scope ${area}/${item.category}:${item.id}`,
    )
  const sorted = sortItemsByShopAvailability(data.items, area)
  assert.equal(sorted.length, data.items.length, 'Never remove unavailable entries')
  assert.equal(new Set(sorted.map((item) => `${item.category}:${item.id}`)).size, data.items.length)
  for (let index = 1; index < sorted.length; index++) {
    const a = independentState(sorted[index - 1], area)
    const b = independentState(sorted[index], area)
    assert(a.rank <= b.rank)
    if (a.rank === b.rank && a.rank < 2) assert(a.price <= b.price)
  }
}

function checkTemplate(locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  for (const file of [
    `src/pages/equipment/ui/index${suffix}.html`,
    `catalogue/index${suffix}.html`,
  ]) {
    const html = fs.readFileSync(path.join(root, file), 'utf8')
    assert.equal((html.match(/id="purchase-sort-note"/g) || []).length, 1)
    assert(html.indexOf('id="purchase-sort-note"') < html.indexOf('id="result-count"'))
  }
}

async function checkRuntime(locale, area) {
  const query = new URLSearchParams({ category: 'bait', stage: area, sort: 'buy-price' })
  const result = await renderCatalogue(locale, `?${query}`)
  assert.equal(result.nodes['sort-filter'].value, 'buy-price', 'URL sort must remain selected')
  assert(result.nodes['sort-filter'].innerHTML.includes('value="buy-price"'))
  assert(result.nodes['sort-filter'].innerHTML.includes('value="price"'))
  assert.equal(result.nodes['purchase-sort-note'].hidden, false)
  assert.equal(
    result.nodes['purchase-sort-note'].textContent,
    purchaseSortCopy(locale, result.runtime.locationStage),
  )
  const raw = await renderCatalogue(locale, `?category=bait&sort=price&stage=${area}`)
  assert.equal(raw.nodes['sort-filter'].value, 'price')
  assert.equal(raw.nodes['purchase-sort-note'].textContent, rawPriceSortCopy(locale))
  const ordinary = await renderCatalogue(locale, '?category=bait&sort=id')
  assert.equal(ordinary.nodes['purchase-sort-note'].hidden, true)
}
