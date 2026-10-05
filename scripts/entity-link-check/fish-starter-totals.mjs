import assert from 'node:assert/strict'
import { data, render, unescapeHtml } from './shared.mjs'

const cases = [
  { fish: '06', stage: 1, methods: ['lure', 'fly'] },
  { fish: '06', stage: 2, methods: ['lure', 'fly'] },
  { fish: '06', stage: 3, methods: ['lure', 'fly'] },
  { fish: '0D', stage: 4, methods: ['lure'] },
  { fish: '31', stage: 6, methods: ['fly'], noLocalRod: true },
]

for (const locale of ['en', 'th', 'ja'])
  for (const scenario of cases) await checkScenario(locale, scenario)

async function checkScenario(locale, scenario) {
  const result = await render('fish', locale, `id=${scenario.fish}&stage=${scenario.stage}`)
  const html = unescapeHtml(result.html)
  for (const method of scenario.methods) checkMethod(html, locale, scenario, method)
}

function checkMethod(html, locale, scenario, method) {
  const offer = cheapestLocalOffer(scenario.fish, scenario.stage, method)
  assert(offer, `Missing expected local ${method} offer: ${scenario.fish} area ${scenario.stage}`)
  const style = method === 'lure' ? 4 : 8
  const localRod = cheapestLocalRod(style, scenario.stage)
  const card = detailsById(html, `starter-${method}`)
  const opener = card.match(/^<details\b([^>]*)>/)?.[1] || ''
  assert.equal(attribute(opener, 'data-item'), `${method}:${offer.item.id}`)
  assert.equal(Number(attribute(opener, 'data-price')), offer.price)

  const summary = card.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || ''
  const summaryPrices = visiblePrices(summary)
  const rodSection = card.match(/<section class="method-rod"[^>]*>[\s\S]*?<\/section>/)?.[0] || ''
  if (scenario.noLocalRod) {
    assert.equal(localRod, null, 'No-local-rod fixture unexpectedly gained local stock')
    assert(rodSection.includes('data-rod-local="false"'))
    assert(!card.includes('data-method-setup-total='))
    assert.deepEqual(summaryPrices, [offer.price])
    return
  }

  assert(localRod, `No local ${method} rod for ${scenario.fish} area ${scenario.stage}`)
  const total = localRod.priceYen + offer.price
  assert(rodSection.includes('data-rod-local="true"'))
  assert(rodSection.includes(`data-method-setup-total="${total}"`))
  assert.deepEqual(summaryPrices, [offer.price, total])
  if (method === 'fly') checkReadyMadeFlyLabel(summary, locale, offer)
}

function cheapestLocalOffer(fishId, stage, method) {
  const offers = data.items.flatMap((item) => {
    if (item.category !== method || !item.playerUse?.fishIds?.includes(fishId)) return []
    return (item.playerUse.shops || [])
      .filter((shop) => String(shop.stage) === String(stage) && !shop.condition)
      .map((shop) => ({
        item,
        shop,
        price: method === 'fly' ? shop.bundle?.shopPriceYen : item.priceYen,
      }))
      .filter((offer) => Number.isFinite(offer.price) && offer.price >= 0)
  })
  return offers.sort((a, b) => a.price - b.price || a.item.id.localeCompare(b.item.id))[0] || null
}

function cheapestLocalRod(style, stage) {
  const rods = data.items
    .filter(
      (item) =>
        item.category === 'rod' &&
        item.decodedFields?.styleCode === style &&
        Number.isFinite(item.priceYen) &&
        item.playerUse?.shops?.length,
    )
    .filter((item) =>
      item.playerUse.shops.some((shop) => String(shop.stage) === String(stage) && !shop.condition),
    )
  return rods.sort((a, b) => a.priceYen - b.priceYen || a.id.localeCompare(b.id))[0] || null
}

function detailsById(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const start = html.search(new RegExp(`<details\\b(?=[^>]*\\bid="${escaped}")[^>]*>`))
  assert(start >= 0, `Missing rendered starter card ${id}`)
  const tags = /<\/?details\b[^>]*>/g
  tags.lastIndex = start
  let depth = 0
  for (let match = tags.exec(html); match; match = tags.exec(html)) {
    depth += match[0].startsWith('</') ? -1 : 1
    if (depth === 0) return html.slice(start, tags.lastIndex)
  }
  assert.fail(`Unclosed rendered starter card ${id}`)
}

function attribute(openingTag, name) {
  return openingTag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null
}

function visiblePrices(text) {
  const pattern = /¥\s*(\d+)|(\d+)\s*円/g
  return [...text.matchAll(pattern)].map((match) => Number(match[1] || match[2]))
}

function checkReadyMadeFlyLabel(summary, locale, offer) {
  assert(offer.shop.bundle, 'Fly offer is not sold as a recorded ready-made set')
  const labels = {
    en: 'Ready-made fly set',
    th: 'ชุดฟลายสำเร็จรูป',
    ja: '完成フライセット',
  }
  assert(summary.includes(labels[locale]), `Fly starter is not labelled ready-made (${locale})`)
}

console.log(
  'PASS: lure/fly summaries show independently computed local complete-setup prices in EN/TH/JA; fly totals identify ready-made sets; missing local rod suppresses the total.',
)
