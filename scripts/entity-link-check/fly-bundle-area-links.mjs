import assert from 'node:assert/strict'
import { data, render, unescapeHtml } from './shared.mjs'

const parts = data.items.filter((item) => ['fly', 'fly_wing', 'fly_tail'].includes(item.category))
const expected = (item) => {
  const offers = new Map()
  for (const body of data.items.filter((entry) => entry.category === 'fly')) {
    for (const offer of body.playerUse?.shops || []) {
      const bundle = offer.bundle
      if (!bundle) continue
      const key = { fly: 'body', fly_wing: 'wing', fly_tail: 'tail' }[item.category]
      if (bundle[key] !== item.id) continue
      offers.set([offer.stage, bundle.body, bundle.wing, bundle.tail].join('|'), offer)
    }
  }
  return [...offers.values()]
}
let checked = 0
for (const locale of ['en', 'th', 'ja']) {
  for (const item of parts.filter((part) => expected(part).length)) {
    for (const stage of ['', '1', '2', '3', '4', '5', '6', '9', 'oops'])
      await checkPart(locale, item, stage)
  }
}
console.log(
  `Fly bundle component areas PASS: ${checked} links across all canonical bundles, 3 locales and absent/valid/invalid source areas.`,
)

async function checkPart(locale, item, stage) {
  const query = new URLSearchParams({
    category: item.category,
    id: item.id,
    fish: '06',
    route: 'fly',
    return: 'maps.th.html?stage=4#map-view',
  })
  if (stage) query.set('stage', stage)
  const result = await render('item', locale, query)
  const section = result.html.match(/<section id="fly-purchases"[\s\S]*?<\/section>/)?.[0]
  assert(section, `Missing bundle purchase section for ${item.category}:${item.id}`)
  const cards = [
    ...section.matchAll(/<article[^>]*data-purchase-stage="(\d+)"[^>]*>([\s\S]*?)<\/article>/g),
  ]
  assert.equal(cards.length, expected(item).length, 'Every canonical assembly is displayed')
  for (const [, offerArea, markup] of cards) checkCard(result, item, offerArea, markup)
}

function checkCard(result, item, offerArea, markup) {
  const offers = expected(item).filter((offer) => String(offer.stage) === offerArea)
  assert(offers.length, 'Bundle card area must be canonical')
  const links = [...markup.matchAll(/<a class="entity-link" href="([^"]+)"/g)]
  assert(
    offers.some(
      (offer) =>
        ['body', 'wing', 'tail'].filter((key) => {
          const category = { body: 'fly', wing: 'fly_wing', tail: 'fly_tail' }[key]
          return (
            offer.bundle[key] &&
            offer.bundle[key] !== '00' &&
            !(category === item.category && offer.bundle[key] === item.id)
          )
        }).length === links.length,
    ),
    'Assembly exposes each available non-current component',
  )
  for (const [, href] of links) {
    const target = new URL(unescapeHtml(href), result.url)
    const category = target.searchParams.get('category')
    const id = target.searchParams.get('id')
    const key = { fly: 'body', fly_wing: 'wing', fly_tail: 'tail' }[category]
    assert(
      offers.some((offer) => offer.bundle[key] === id),
      'Component belongs to a canonical bundle',
    )
    assert.equal(
      target.searchParams.get('stage'),
      offerArea,
      'Bundle component must use its offer area, not source browsing area',
    )
    assert.equal(
      new URL(target.searchParams.get('return'), target).href,
      result.url.href,
      'Bundle click retains exact source and nested return',
    )
    assert.equal(target.searchParams.get('fish'), '06')
    assert.equal(target.searchParams.get('route'), 'fly')
    checked += 1
  }
}
