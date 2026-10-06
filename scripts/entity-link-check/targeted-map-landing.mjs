import assert from 'node:assert/strict'
import { mapLink } from '../../src/pages/item/navigation.js'
import { locations, render, renderCatalogue, unescapeHtml } from './shared.mjs'

let checked = 0
for (const locale of ['en', 'th', 'ja']) {
  for (const [id, fish] of Object.entries(locations.fish)) {
    for (const area of fish.locations || []) {
      await checkFish(locale, id, area)
      await checkEquipment(locale, id, area)
    }
  }
  await checkItemAndQuestActions(locale)
  const generic = await renderCatalogue(locale, '?category=rod&stage=4')
  assert.equal(
    new URL(generic.nodes['map-browser-link'].href, generic.url).hash,
    '',
    'Generic map navigation keeps map overview',
  )
}
console.log(
  `Targeted map landing PASS: ${checked} fish/equipment links across all canonical fish areas/maps and 3 locales land at #map-view; generic map navigation keeps overview.`,
)

async function checkFish(locale, id, area) {
  const result = await render(
    'fish',
    locale,
    new URLSearchParams({
      id,
      stage: String(area.stage),
      route: 'float',
      return: 'index.th.html?category=bait#cards',
    }),
  )
  const markup = unescapeHtml(result.html)
  const previews = [
    ...markup.matchAll(/<a class="area-map-preview" data-map-section="([^"]+)" href="([^"]+)"/g),
  ]
  assert.equal(previews.length, (area.maps || []).length)
  for (const [index, [, section, href]] of previews.entries()) {
    const target = checkTarget(href, result.url, id, area.stage)
    assert.equal(target.searchParams.get('section'), section)
    checkCanonicalSection(area, index, section)
    assert(/^s[1-6]-c\d+-r\d+$/.test(section))
    const back = new URL(target.searchParams.get('return'), target)
    assert.equal(
      back.href,
      `${result.url.href}#fish-area-map`,
      'Exact fish source context retained',
    )
    assert.equal(back.hash, '#fish-area-map')
    assert.equal(back.searchParams.get('id'), id)
    assert.equal(back.searchParams.get('stage'), String(area.stage))
    assert.equal(back.searchParams.get('return'), 'index.th.html?category=bait#cards')
  }
  const actions = [...markup.matchAll(/<a class="route-button" href="([^"]+)"/g)]
    .map(([, href]) => new URL(href, result.url))
    .filter((url) => /\/maps(?:\.th|\.ja)?\.html$/.test(url.pathname))
  for (const target of actions) checkTarget(target.href, result.url, id, area.stage)
}

async function checkEquipment(locale, id, area) {
  const query = new URLSearchParams({
    category: 'bait',
    fish: id,
    stage: String(area.stage),
    route: 'float',
    sort: 'id',
    map: '0',
    return: 'maps.th.html?stage=4#notebook-guide',
  })
  const result = await renderCatalogue(locale, `?${query}#fish-location-panel`)
  checkTarget(result.nodes['map-browser-link'].href, result.url, id, area.stage)
  const markup = unescapeHtml(result.nodes['fish-location-panel'].innerHTML)
  const links = [...markup.matchAll(/class="(?:map-browser-cta|fish-area-link)" href="([^"]+)"/g)]
  assert(links.length, `${id}/${area.stage}: target map actions exist`)
  for (const [, href] of links) {
    const target = new URL(href, result.url)
    checkTarget(href, result.url, id, target.searchParams.get('stage'))
    const back = new URL(target.searchParams.get('return'), target)
    assert.equal(back.href, result.url.href, 'Exact equipment source context retained')
    assert.equal(back.pathname, result.url.pathname)
    assert.equal(back.hash, '#fish-location-panel')
    assert.equal(back.searchParams.get('fish'), id)
    assert.equal(back.searchParams.get('return'), query.get('return'))
  }
}

function checkTarget(href, base, id, stage) {
  const target = new URL(href, base)
  assert.equal(
    target.hash,
    '#map-view',
    'Targeted fish map action must land at the selected map, not page overview',
  )
  assert.equal(
    target.pathname.split('/').pop(),
    base.pathname
      .split('/')
      .pop()
      .replace(/^(?:fish|index|item)/, 'maps'),
  )
  assert.equal(target.searchParams.get('fish'), id)
  assert.equal(target.searchParams.get('stage'), String(stage))
  assert.equal(target.searchParams.get('route'), 'float')
  checked += 1
  return target
}

async function checkItemAndQuestActions(locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  for (const source of ['', '1', '2', '3', '4', '5', '6', '9', 'oops']) {
    const query = new URLSearchParams({
      category: 'general_tool',
      id: '12',
      return: 'maps.th.html?stage=4#map-view',
    })
    if (source) query.set('stage', source)
    const result = await render('item', locale, query)
    const href = result.html.match(/data-quest-fish-map href="([^"]+)"/)?.[1]
    assert(href, 'Candle clue has a targeted fish-map action')
    const target = new URL(unescapeHtml(href), result.url)
    assert.equal(target.hash, '#map-view')
    assert.equal(target.searchParams.get('fish'), '37')
    assert.equal(target.searchParams.get('stage'), '6')
    assert.equal(target.searchParams.get('section'), 's6-c2-r2')
    assert.equal(new URL(target.searchParams.get('return'), target).href, result.url.href)
    for (const area of ['1', '2', '3', '4', '5', '6']) {
      const ctx = {
        lang: locale,
        category: 'bait',
        mapsPage: { [locale]: `maps${suffix}.html` },
        selectedRoute: 'float',
        safeLocalRoute: (route) => route,
        currentLocalRoute: () => result.url.href,
      }
      const map = checkTarget(mapLink(ctx, area, '06'), result.url, '06', area)
      assert.equal(map.searchParams.get('return'), result.url.href)
      assert.equal(new URL(mapLink(ctx, area), result.url).hash, '')
    }
  }
}

function checkCanonicalSection(area, index, section) {
  const expected = new Set(
    (area.maps[index].pins || []).map(
      (pin) =>
        `s${area.stage}-c${Math.floor((pin.tileX * 16 + 8) / 384) + 1}-r${Math.floor((pin.tileY * 16 + 8) / 384) + 1}`,
    ),
  )
  assert.deepEqual([...expected], [section], 'Preview section matches canonical ROM pins')
}
