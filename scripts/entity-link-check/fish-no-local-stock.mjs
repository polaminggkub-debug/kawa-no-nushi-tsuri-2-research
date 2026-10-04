import assert from 'node:assert/strict'
import { data, render, unescapeHtml } from './shared.mjs'

const fishId = '34'
const neighboringStockedFishId = '33'
const returnRoute = 'maps.th.html?stage=6&fish=34&section=s6-c2'

for (const locale of ['en', 'ja', 'th']) {
  await checkNoLocalLure(locale)
  await checkAdjacentLocalLure(locale)
}

async function checkNoLocalLure(locale) {
  const result = await render(
    'fish',
    locale,
    new URLSearchParams({ id: fishId, stage: '6', return: returnRoute }),
  )
  const html = unescapeHtml(result.html)
  const lureAction = assertNoLocalLureView(html, locale)
  assertRecordedLureSale(lureAction, result.url, locale)
}

function assertNoLocalLureView(html, locale) {
  const lureAction = html.match(
    /<article class="detail-section method-no-local-stock" data-method-no-local="lure">[\s\S]*?<\/article>/,
  )?.[0]
  assert(lureAction, `Missing no-local-lure action for fish ${fishId}, area 6 (${locale})`)
  const renderedMissing = [...html.matchAll(/data-method-no-local="(float|sinker|lure|fly)"/g)].map(
    ([, method]) => method,
  )
  assert.deepEqual(
    renderedMissing.sort(),
    expectedMissingMethods(fishId, '6').sort(),
    `Missing method action does not match decoded compatibility and stock (${locale})`,
  )
  assert(
    !html.includes('id="starter-lure"'),
    `A missing local lure starter was rendered (${locale})`,
  )
  assert(
    !html.includes('single-fish choice above') &&
      !html.includes('上の対象魚用候補') &&
      !html.includes('ตัวเลือกสำหรับปลาตัวนี้ด้านบน'),
    `The lure kit points to a nonexistent local starter (${locale})`,
  )
  const kit = html.match(/<section class="detail-section reusable-kit"[\s\S]*?<\/section>/)?.[0]
  assert(kit, `Missing reusable lure kit (${locale})`)
  assert(
    !kit.includes('The cheapest choice above') &&
      !kit.includes('上の最安候補') &&
      !kit.includes('ชุดราคาต่ำสุดด้านบน'),
    `The lure kit intro refers to a missing cheapest lure choice (${locale})`,
  )
  return lureAction
}

function assertRecordedLureSale(lureAction, base, locale) {
  const link = lureAction.match(/data-recorded-sale href="([^"]+)"/)
  assert(link, `Missing recorded-sale action for fish ${fishId}, area 6 (${locale})`)
  const target = new URL(link[1], base)
  assert(target.pathname.endsWith(`/shops${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(target.searchParams.get('category'), 'lure')
  assert.equal(target.searchParams.get('fish'), fishId)
  assert.notEqual(target.searchParams.get('stage'), '6')
  const item = data.items.find(
    (entry) => entry.category === 'lure' && entry.id === target.searchParams.get('id'),
  )
  assert(item?.playerUse?.fishIds?.includes(fishId), 'Sale target does not pass fish 34 lure check')
  assert(
    item.playerUse.shops.some(
      (shop) => String(shop.stage) === target.searchParams.get('stage') && !shop.condition,
    ),
    `Sale target is not recorded in area ${target.searchParams.get('stage')}`,
  )
  assertReturnContext(target, base, locale)
}

async function checkAdjacentLocalLure(locale) {
  const result = await render('fish', locale, `id=${neighboringStockedFishId}&stage=6`)
  const html = unescapeHtml(result.html)
  assert(
    html.includes('id="starter-lure"'),
    `Local lure starter missing for neighboring fish ${neighboringStockedFishId} in area 6 (${locale})`,
  )
  assert(
    !html.includes('data-method-no-local="lure"'),
    `No-local-lure action appeared despite recorded area 6 stock (${locale})`,
  )
}

function expectedMissingMethods(fishId, stage) {
  return ['float', 'sinker', 'lure', 'fly'].filter((method) => {
    const items = data.items.filter((item) =>
      method === 'float' || method === 'sinker'
        ? item.category === 'bait' &&
          (item.playerUse?.fishIdsByRoute?.[method] || []).includes(fishId)
        : item.category === method && (item.playerUse?.fishIds || []).includes(fishId),
    )
    const local = items.some((item) =>
      (item.playerUse?.shops || []).some((shop) => {
        const price = item.category === 'fly' ? shop.bundle?.shopPriceYen : item.priceYen
        return (
          String(shop.stage) === stage && !shop.condition && Number.isFinite(price) && price >= 0
        )
      }),
    )
    return items.length > 0 && !local
  })
}

function assertReturnContext(target, base, locale) {
  const returnPath = target.searchParams.get('return')
  assert(returnPath, 'Shop action dropped the fish return route')
  const back = new URL(returnPath, base)
  assert(back.pathname.endsWith(`/fish${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(back.searchParams.get('id'), fishId)
  assert.equal(back.searchParams.get('stage'), '6')
  assert.equal(back.hash, '#all-compatible')
  const outer = new URL(back.searchParams.get('return'), base)
  assert(outer.pathname.endsWith('/maps.th.html'))
  assert.equal(outer.searchParams.get('stage'), '6')
  assert.equal(outer.searchParams.get('fish'), fishId)
  assert.equal(outer.searchParams.get('section'), 's6-c2')
}

console.log(
  'PASS: fish 34 area 6 shows a localized lure sale-area route with full fish/map return context; neighboring fish 33 keeps its local area 6 starter (EN/JA/TH).',
)
