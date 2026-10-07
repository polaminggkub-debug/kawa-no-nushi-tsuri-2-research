import assert from 'node:assert/strict'
import { renderRodForMethod } from '../../src/pages/fish/fishing-setup.js'
import { data, unescapeHtml } from './shared.mjs'

const cases = [
  [1, 'float', ['04']],
  [4, 'float', ['14', '15']],
  [1, 'lure', ['0C']],
  [4, 'lure', ['0D']],
  [1, 'fly', ['13']],
  [5, 'fly', []],
  [1, 'sinker', []],
  [6, 'sinker', ['10']],
]
for (const locale of ['en', 'th', 'ja'])
  for (const [stage, method, expected] of cases) {
    const suffix = locale === 'en' ? '' : `.${locale}`
    const ctx = {
      locale,
      id: '06',
      escapeHtml: String,
      localizedItemName: (item) => item.nameEn,
      itemLink: () => '',
      itemPath: () => `item${suffix}.html`,
      currentFishPath: () =>
        `fish${suffix}.html?id=06&return=maps${suffix}.html%3Fstage%3D${stage}`,
    }
    const html = renderRodForMethod(
      ctx,
      method,
      stage,
      data.items,
      10,
      ['float', 'sinker'].includes(method) ? 1000 : null,
    )
    const cards = [
      ...html.matchAll(/<article[^>]*data-rod-upgrade="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g),
    ]
    assert.deepEqual(
      cards.map((match) => match[1]),
      expected,
    )
    const budgetId = html.match(/data-rod="([^"]+)"/)[1]
    const budget = data.items.find((item) => item.category === 'rod' && item.id === budgetId)
    for (const [full, id, body] of cards) {
      const rod = data.items.find((item) => item.category === 'rod' && item.id === id)
      assert(rod.playerUse.shops.some((shop) => Number(shop.stage) === stage && !shop.condition))
      const url = new URL(
        unescapeHtml(body.match(/href="([^"]+)"/)[1]),
        'https://example.test/catalogue/',
      )
      assert.equal(url.pathname, `/catalogue/item${suffix}.html`)
      for (const [key, value] of Object.entries({
        category: 'rod',
        id,
        fish: '06',
        stage: String(stage),
        route: method,
      }))
        assert.equal(url.searchParams.get(key), value)
      const back = new URL(url.searchParams.get('return'), url)
      assert.equal(back.pathname, `/catalogue/fish${suffix}.html`)
      assert.equal(back.searchParams.get('id'), '06')
      assert.equal(back.searchParams.get('stage'), String(stage))
      assert.equal(back.searchParams.get('route'), method)
      assert.equal(back.searchParams.get('return'), `maps${suffix}.html?stage=${stage}`)
      assert.equal(back.hash, `#starter-${method}`)
      const base = ['float', 'sinker'].includes(method) ? 1000 : budget.priceYen + 10
      assert(body.includes(String(base + rod.priceYen - budget.priceYen)))
      if (method === 'lure' || method === 'sinker')
        assert(
          body.includes(locale === 'ja' ? 'HP100' : locale === 'th' ? 'HP 100' : '100 HP') ||
            !full.includes('dimensions="aim'),
        )
    }
  }
// Nijimasu needs line strength 24: the area 4 budget rod (12) is too short, so the card for the
// 24 rod is offered for its reach and the page says why.
for (const locale of ['en', 'th', 'ja']) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const ctx = {
    locale,
    id: '06',
    escapeHtml: String,
    localizedItemName: (item) => item.nameEn,
    itemLink: () => '',
    itemPath: () => `item${suffix}.html`,
    currentFishPath: () => `fish${suffix}.html?id=06`,
  }
  const html = renderRodForMethod(ctx, 'float', 4, data.items, 10, 1000)
  assert(html.includes('class="method-rod-fit"'), `Budget rod fit note missing: ${locale}`)
  const card = html.match(/<article[^>]*data-rod-upgrade="15"[^>]*>/)?.[0] || ''
  assert(card.includes('reach'), `Reach upgrade missing: ${locale}`)
}
console.log(
  'Fish rod upgrades PASS: local metric leaders, tradeoffs, prices/setup totals, HP baseline and complete three-locale return context',
)
