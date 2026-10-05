import assert from 'node:assert/strict'
import fs from 'node:fs'
import { data, unescapeHtml } from './shared.mjs'
import { bindShopAnchors } from '../../src/pages/shops/shop-page.js'
import { targetActions } from '../../src/pages/shops/target-actions.js'
import { isSpecial } from '../../src/pages/shops/shop-catalogue.js'
import { itemName } from '../../src/pages/shops/map-navigation.js'

const stock = JSON.parse(fs.readFileSync('data/shop-stock-rom.json', 'utf8'))
for (const lang of ['en', 'th', 'ja']) {
  const ctx = context(lang)
  for (const area of stock.areas) for (const item of data.items) checkActions(ctx, area, item)
  const template = fs.readFileSync(
    `src/pages/shops/ui/shops${lang === 'en' ? '' : `.${lang}`}.html`,
    'utf8',
  )
  assert(template.indexOf('id="target-status"') < template.indexOf('class="filters"'))
  assert.equal((template.match(/id="target-status"/g) || []).length, 1)
}
console.log(
  'PASS: 315 selected shop items across six areas and three languages show only recorded prices/actions; no-stock and complete-fly cases remain distinct; context and top placement retained.',
)

function checkActions(ctx, area, item) {
  const key = { fly: 'body', fly_wing: 'wing', fly_tail: 'tail' }[item.category]
  const bundles = key ? (area.flyBundles || []).filter((bundle) => bundle[key] === item.id) : []
  const found = key
    ? bundles.length > 0
    : area.items.some((entry) => entry.category === item.category && entry.id === item.id)
  const html = targetActions(ctx, item, area.stage, found, bundles)
  assert(html.includes(ctx.itemName(item)))
  assert.equal(html.includes('data-target-seller'), found)
  assert.equal(html.includes('data-target-offer'), found)
  if (!found) {
    assert(!html.includes('PRICE:'))
    return
  }
  const price = bundles.length
    ? Math.min(...bundles.map((bundle) => bundle.shopPriceYen))
    : item.priceYen
  if (price != null) assert(html.includes(`PRICE:${price}`))
  for (const match of html.matchAll(/data-target-(seller|offer) href="([^"]+)"/g)) {
    const url = new URL(unescapeHtml(match[2]), 'https://example.test/catalogue/shops.html')
    assert.equal(url.searchParams.get('stage'), String(area.stage))
    assert.equal(url.searchParams.get('category'), item.category)
    assert.equal(url.searchParams.get('id'), item.id)
    assert.equal(url.searchParams.get('fish'), '06')
    assert.equal(url.searchParams.get('route'), 'sinker')
    assert.equal(url.searchParams.get('return'), 'maps.html?stage=3&fish=06#map-view')
    assert.equal(url.searchParams.get('q'), '')
    assert.equal(url.searchParams.get('entrance'), '')
    assert.equal(url.searchParams.get('place'), 'town')
    assert.equal(
      url.hash,
      match[1] === 'seller'
        ? '#location-section'
        : bundles.length
          ? '#bundle-stock'
          : ctx.isSpecial(item, area.stage)
            ? '#special-stock'
            : '#regular-stock',
    )
  }
}

function context(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const ctx = {
    lang,
    esc: (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;'),
    text: { price: (value) => `PRICE:${value}` },
    imagePath: (value) => value,
    itemHref: (item) => `item${suffix}.html?category=${item.category}&id=${item.id}`,
    shopsUrl: (values) =>
      `shops${suffix}.html?${new URLSearchParams({
        fish: '06',
        route: 'sinker',
        return: 'maps.html?stage=3&fish=06#map-view',
        q: 'old',
        entrance: '1',
        ...values,
      })}#old`,
  }
  ctx.itemName = (item) => itemName(ctx, item)
  ctx.isSpecial = (item, stage) => isSpecial(ctx, item, stage)
  return ctx
}

let onHashChange
let updated = 0
let scrolled = ''
const disclosure = { open: false }
globalThis.window = {
  addEventListener: (event, callback) => {
    assert.equal(event, 'hashchange')
    onHashChange = callback
  },
}
globalThis.location = { hash: '#location-section' }
bindShopAnchors({
  updateLanguageLinks: () => {
    updated += 1
  },
  $: (id) =>
    id === 'shop-map-disclosure'
      ? disclosure
      : {
          scrollIntoView: () => {
            scrolled = id
          },
        },
})
onHashChange()
assert.equal(updated, 1)
assert.equal(disclosure.open, true)
assert.equal(scrolled, 'location-section')
globalThis.location.hash = '#bundle-stock'
onHashChange()
assert.equal(updated, 2)
assert.equal(scrolled, 'bundle-stock')
disclosure.open = false
globalThis.location.hash = '#town-arrival-1'
onHashChange()
assert.equal(updated, 3)
assert.equal(disclosure.open, true)
assert.equal(scrolled, 'town-arrival-1')
delete globalThis.window
delete globalThis.location
