import assert from 'node:assert/strict'
import { data, unescapeHtml } from './shared.mjs'
import { shopCompatibility, shopFishContext } from '../../src/pages/shops/player-decision.js'
import { offerCard, bundleCard } from '../../src/pages/shops/shop-catalogue.js'

const stock = JSON.parse((await import('node:fs')).readFileSync('data/shop-stock-rom.json', 'utf8'))
for (const lang of ['en', 'th', 'ja']) {
  for (const route of ['float', 'sinker', 'lure', 'fly']) {
    const ctx = context(lang, route)
    for (const id of Object.keys(data.fishVisuals)) {
      ctx.selectedFish = id
      for (const item of data.items) {
        const expected = expectedState(item, id, route)
        assert.equal(
          shopCompatibility(ctx, item),
          expected,
          `${item.category}:${item.id}/${id}/${route}`,
        )
      }
    }
    ctx.selectedFish = '06'
    checkPanel(ctx)
    for (const item of data.items.filter((entry) => ['bait', 'lure'].includes(entry.category))) {
      const html = offerCard(ctx, item, { stage: 1 })
      assert.match(
        html,
        new RegExp(`data-shop-compatibility="${expectedState(item, '06', route)}"`),
      )
      assert.match(html, /data-offer=/)
    }
    for (const area of stock.areas)
      for (const bundle of area.flyBundles || []) {
        const body = data.items.find((item) => item.category === 'fly' && item.id === bundle.body)
        const html = bundleCard(ctx, bundle, area.stage, data.items, {})
        assert.match(
          html,
          new RegExp(`data-shop-compatibility="${expectedState(body, '06', route)}"`),
        )
      }
    ctx.selectedFish = 'FF'
    assert.equal(shopFishContext(ctx), '')
    assert.equal(
      shopCompatibility(
        ctx,
        data.items.find((item) => item.category === 'lure'),
      ),
      '',
    )
    ctx.selectedFish = ''
    assert.equal(shopFishContext(ctx), '')
    assert.equal(shopCompatibility(ctx, data.items[0]), '')
    assert.doesNotMatch(
      offerCard(
        ctx,
        data.items.find((item) => item.category === 'lure'),
      ),
      /data-shop-compatibility/,
    )
  }
}
console.log(
  'Shop fish decisions PASS: all item profiles, both bait routes, three locales, bundle-body checks and contextual actions.',
)

function expectedState(item, fish, route) {
  if (!item || !['bait', 'lure', 'fly'].includes(item.category)) return ''
  const ids =
    item.category === 'bait'
      ? item.playerUse?.fishIdsByRoute?.[route === 'sinker' ? 'sinker' : 'float'] || []
      : item.playerUse?.fishIds || []
  return ids.includes(fish) ? 'accepted' : 'rejected'
}

function checkPanel(ctx) {
  const html = shopFishContext(ctx)
  assert.match(html, /06/)
  const href = html.match(/href="([^"]*fish[^"]*)"/)?.[1]
  assert(href, 'Target has no fish profile action')
  const next = new URL(unescapeHtml(href), 'https://example.test/catalogue/shops.html')
  assert.equal(next.searchParams.get('id'), '06')
  assert.equal(next.searchParams.get('stage'), '1')
  assert.equal(next.searchParams.get('route'), ctx.selectedRig)
  assert.equal(next.searchParams.get('return'), ctx.targetReturn())
}

function context(lang, route) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  return {
    lang,
    selectedFish: '06',
    selectedRig: route,
    fishVisuals: data.fishVisuals,
    startStage: 1,
    $: () => ({ value: '1' }),
    targetReturn: () => `shops${suffix}.html?stage=1&fish=06&route=${route}#regular-stock`,
    stateParams: () => new URLSearchParams({ stage: '1' }),
    pages: { fish: { [lang]: `fish${suffix}.html` } },
    esc: (value) =>
      String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;'),
    imagePath: (value) => value,
    itemName: (item) => item.nameEn || item.nameJa,
    itemHref: (item) => `item${suffix}.html?category=${item.category}&id=${item.id}`,
    catName: (value) => value,
    findItem: (items, category, id) =>
      items.find((item) => item.category === category && item.id === id),
    itemTargetLink: (category, id) =>
      `<a href="item${suffix}.html?category=${category}&id=${id}">${id}</a>`,
    text: { price: (value) => `${value}`, noPrice: '', stageWord: (value) => `${value}` },
  }
}
