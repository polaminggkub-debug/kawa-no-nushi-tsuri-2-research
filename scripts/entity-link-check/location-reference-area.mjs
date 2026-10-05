import assert from 'node:assert/strict'
import { data, render, unescapeHtml } from './shared.mjs'

const items = data.items.filter((item) =>
  item.playerUse?.useLocations?.some((loc) => loc.rewardItem || loc.requiredItem),
)
for (const locale of ['en', 'th', 'ja']) {
  for (const item of items) {
    for (const area of ['1', '3', '6']) await checkReferences(item, locale, area)
  }
}
console.log(
  'Location references PASS: required/reward item links use the actual location area and retain the exact source page.',
)

async function checkReferences(item, locale, area) {
  const query = new URLSearchParams({
    category: item.category,
    id: item.id,
    stage: area,
    fish: '03',
    route: 'float',
    return: 'maps.html?stage=3#notebook-guide',
  })
  const result = await render('item', locale, query)
  const section =
    result.html.match(/<section\b[^>]*id="use-locations"[\s\S]*?<\/section>/)?.[0] || ''
  const cards = [...section.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(
    (match) => match[0],
  )
  const locations = item.playerUse.useLocations
  assert.equal(cards.length, locations.length)
  for (const [index, loc] of locations.entries()) {
    for (const ref of [loc.requiredItem, loc.rewardItem].filter(Boolean)) {
      if (ref.category === item.category && ref.id === item.id) continue
      const candidates = [...cards[index].matchAll(/<p>[^<]*<a href="([^"]+)"/g)]
        .map((match) => new URL(unescapeHtml(match[1]), result.url))
        .filter(
          (target) =>
            target.searchParams.get('category') === ref.category &&
            target.searchParams.get('id') === ref.id,
        )
      assert(
        candidates.length,
        `${item.category}:${item.id} missing required/reward ${ref.category}:${ref.id}`,
      )
      for (const target of candidates) {
        assert.equal(
          target.searchParams.get('stage'),
          String(loc.stage),
          'Location reference must not inherit unrelated browsing area',
        )
        const back = new URL(target.searchParams.get('return'), target)
        assert.equal(
          back.href,
          result.url.href,
          'Source area and nested return survive a location item click',
        )
      }
    }
  }
}
