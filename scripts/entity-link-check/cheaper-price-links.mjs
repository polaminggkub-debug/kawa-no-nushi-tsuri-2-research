import assert from 'node:assert/strict'
import { data, render, renderCatalogue, unescapeHtml } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) {
  await checkItemDetailLinks(lang)
  await checkCatalogueLinks(lang)
}

async function checkItemDetailLinks(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returnRoute = `index${suffix}.html?category=bait&stage=1&fish=06&route=float#catalogue`
  const result = await render(
    'item',
    lang,
    new URLSearchParams({
      category: 'bait',
      id: '0B',
      stage: '1',
      fish: '06',
      route: 'float',
      return: returnRoute,
    }),
  )
  const section = unescapeHtml(
    result.html.match(
      /<aside class="detail-section" data-bait-lure-prices>[\s\S]*?<\/aside>/,
    )?.[0] || '',
  )
  assert(section, `Missing cheaper-by-area recommendations in item detail (${lang})`)
  const groups = [...section.matchAll(/<p><strong>(.*?)<\/strong> · ([\s\S]*?)<\/p>/g)]
  const areaTwo = groups.find(([, label]) => /(?:Area|エリア|ด่าน)\s*2/.test(label))
  assert(areaTwo, `Missing Area 2 alternative group (${lang})`)
  const link = areaTwo[2].match(/href="([^"]+)"/)
  assert(link, `Missing Area 2 alternative link (${lang})`)
  assertTargetContext(link[1], result.url, {
    category: 'bait',
    id: '03',
    stage: '2',
    fish: '06',
    route: 'float',
  })
  const areaOne = groups.find(([, label]) => /(?:Area|エリア|ด่าน)\s*1/.test(label))
  assert(areaOne, `Missing group containing the currently selected Area 1 (${lang})`)
  const areaOneLink = areaOne[2].match(/href="([^"]+)"/)
  assert(areaOneLink, `Missing Area 1 alternative link (${lang})`)
  assertTargetContext(areaOneLink[1], result.url, {
    category: 'bait',
    id: '02',
    stage: '1',
    fish: '06',
    route: 'float',
  })
}

async function checkCatalogueLinks(lang) {
  const { runtime, url } = await renderCatalogue(lang, '?category=bait&stage=1&fish=06&route=float')
  const item = data.items.find((entry) => entry.category === 'bait' && entry.id === '0B')
  assert(item, 'Missing bait:0B fixture')
  const html = unescapeHtml(runtime.baitLurePriceChoices(item))
  const areaTwo = html.match(/<p><strong>(?:Area|エリア|ด่าน)\s*2<\/strong> · ([\s\S]*?)<\/p>/)
  assert(areaTwo, `Missing catalogue Area 2 alternative group (${lang})`)
  const link = areaTwo[1].match(/href="([^"]+)"/)
  assert(link, `Missing catalogue Area 2 alternative link (${lang})`)
  assertTargetContext(link[1], url, {
    category: 'bait',
    id: '03',
    stage: '2',
    fish: '06',
    route: 'float',
  })
}

function assertTargetContext(href, base, expected) {
  const target = new URL(href, base)
  for (const [key, value] of Object.entries(expected))
    assert.equal(target.searchParams.get(key), value, `Incorrect ${key} in ${target}`)
  const returnRoute = target.searchParams.get('return')
  assert(returnRoute, `Missing return context in ${target}`)
  const returned = new URL(returnRoute, base)
  assert.equal(returned.searchParams.get('stage'), '1')
  assert.equal(returned.searchParams.get('fish'), '06')
  assert.equal(returned.searchParams.get('route'), 'float')
}

const stageTwoStock = data.items.find((item) => item.category === 'bait' && item.id === '03')
assert(stageTwoStock?.playerUse?.shops?.some((shop) => Number(shop.stage) === 2))
assert(!stageTwoStock.playerUse.shops.some((shop) => Number(shop.stage) === 1))
console.log(
  'PASS: cheaper-by-area bait links from catalogue and item detail open an area where the offer is recorded while preserving fish, rig, and return context (EN/JA/TH).',
)
