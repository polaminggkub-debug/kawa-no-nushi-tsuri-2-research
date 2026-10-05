import assert from 'node:assert/strict'
import { locations, renderCatalogue, unescapeHtml } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const nestedReturn = 'maps.th.html?stage=2&section=s2-c1-r6&fish=0D#map-view'

for (const locale of locales) {
  await checkNavigation(locale, {
    query: `?category=bait&stage=4&route=sinker&map=2&return=${encodeURIComponent(nestedReturn)}#catalogue`,
    expected: { stage: '4', route: 'sinker', map: '2' },
    fish: '',
    nestedReturn,
  })
  await checkNavigation(locale, {
    query: `?category=bait&fish=34&stage=4&route=sinker&map=3&return=${encodeURIComponent(nestedReturn)}#catalogue`,
    expected: { stage: '6', route: 'sinker', map: '3' },
    fish: '34',
    nestedReturn,
  })
  for (const route of ['float', 'sinker']) {
    await checkFishPanelNavigation(locale, '34', '4', '6', 'bait', route)
    await checkFishPanelNavigation(locale, '06', '2', '2', 'bait', route)
  }
  await checkFishPanelNavigation(locale, '06', '2', '2', 'lure', 'lure')
  await checkFishPanelNavigation(locale, '06', '2', '2', 'flymaker', 'fly')
}

console.log(
  'PASS: catalogue and embedded fish-map/profile/portrait links retain area, fish, rig, and exact return context in EN/JA/TH.',
)

async function checkNavigation(locale, scenario) {
  const result = await renderCatalogue(locale, scenario.query)
  const destination = new URL(result.nodes['map-browser-link'].href, result.url)
  const localeSuffix = locale === 'en' ? '' : `.${locale}`
  assert(destination.pathname.endsWith(`/maps${localeSuffix}.html`))
  assert.equal(destination.searchParams.get('fish') || '', scenario.fish)
  for (const [key, value] of Object.entries(scenario.expected))
    assert.equal(destination.searchParams.get(key), value, `${locale}: lost map ${key}`)

  const returned = new URL(destination.searchParams.get('return'), result.url)
  assert(returned.pathname.endsWith(`/index${localeSuffix}.html`))
  assert.equal(returned.searchParams.get('category'), 'bait')
  assert.equal(returned.searchParams.get('fish') || '', scenario.fish)
  assert.equal(returned.searchParams.get('stage'), scenario.expected.stage)
  assert.equal(returned.searchParams.get('route'), scenario.expected.route)
  assert.equal(returned.searchParams.get('map'), scenario.expected.map)
  assert.equal(returned.searchParams.get('return'), scenario.nestedReturn)
  assert.equal(returned.hash, '#catalogue')
}

async function checkFishPanelNavigation(
  locale,
  fish,
  requestedStage,
  resolvedStage,
  category,
  route,
) {
  const query = new URLSearchParams({
    category,
    fish,
    stage: requestedStage,
    route,
    map: '0',
    return: nestedReturn,
  })
  const result = await renderCatalogue(locale, `?${query}#fish-location-panel`)
  assert.equal(result.runtime.locationStage, resolvedStage, `${locale} ${fish}: stage resolution`)
  if (category === 'bait')
    assert.equal(result.runtime.baitRoute, route, `${locale} ${fish}: selected rig`)
  const exactReturn = expectedCatalogueReturn(result)
  const suffix = locale === 'en' ? '' : `.${locale}`
  const panel = unescapeHtml(result.nodes['fish-location-panel'].innerHTML)
  assert(panel, `${locale} ${fish}: embedded fish location panel did not render`)

  checkMapTarget(
    result.nodes['map-browser-link'].href,
    result.url,
    suffix,
    fish,
    resolvedStage,
    result.runtime.baitRoute,
    exactReturn,
  )
  const panelMap = panel.match(/class="map-browser-cta" href="([^"]+)"/)?.[1]
  assert(panelMap, `${locale} ${fish}: missing embedded map action`)
  checkMapTarget(panelMap, result.url, suffix, fish, resolvedStage, route, exactReturn)
  checkAreaLinks(panel, result.url, suffix, fish, route, exactReturn)
  checkFishProfileLinks(panel, result.url, suffix, fish, resolvedStage, route, exactReturn)
}

function expectedCatalogueReturn(result) {
  const query = new URLSearchParams(result.url.search)
  query.set('stage', String(result.runtime.locationStage))
  query.set('route', result.runtime.baitRoute)
  query.set('map', String(result.runtime.locationMapIndex))
  query.set('sort', 'id')
  return `${result.url.pathname.split('/').pop()}?${query}#fish-location-panel`
}

function checkMapTarget(href, base, suffix, fish, stage, route, exactReturn) {
  const target = new URL(unescapeHtml(href), base)
  assert(target.pathname.endsWith(`/maps${suffix}.html`))
  assert.equal(target.searchParams.get('fish'), fish)
  assert.equal(target.searchParams.get('stage'), stage)
  assert.equal(target.searchParams.get('route'), route)
  assert.equal(target.searchParams.get('return'), exactReturn)
}

function checkAreaLinks(panel, base, suffix, fish, route, exactReturn) {
  const links = [...panel.matchAll(/class="fish-area-link" href="([^"]+)"/g)]
  const expectedStages = [
    ...new Set(locations.fish[fish].locations.map((location) => String(location.stage))),
  ]
  assert.deepEqual(
    links.map(([, href]) => new URL(href, base).searchParams.get('stage')),
    expectedStages,
    `${fish}: one area link per recorded stage`,
  )
  for (const [, href] of links)
    checkMapTarget(
      href,
      base,
      suffix,
      fish,
      new URL(href, base).searchParams.get('stage'),
      route,
      exactReturn,
    )
}

function checkFishProfileLinks(panel, base, suffix, fish, stage, route, exactReturn) {
  const fishLinks = [...panel.matchAll(/<a\b[^>]*href="([^"]+)"/g)]
    .map(([, href]) => new URL(href, base))
    .filter((url) => url.pathname.endsWith(`/fish${suffix}.html`))
  assert(fishLinks.length >= 2, `${fish}: expected header and map portrait links to fish detail`)
  for (const target of fishLinks) {
    assert.equal(target.searchParams.get('id'), fish)
    assert.equal(target.searchParams.get('stage'), stage)
    assert.equal(target.searchParams.get('route'), route)
    assert.equal(target.searchParams.get('return'), exactReturn)
  }
}
