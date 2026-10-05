import assert from 'node:assert/strict'
import { fishEquipmentDefault } from '../../src/pages/equipment/fish-equipment-default.js'
import { data, fishIds, renderCatalogue } from './shared.mjs'

const selectableFish = [...fishIds].filter((id) => id !== '43').sort()
const sourceCategories = ['float_weight', 'rod', 'all', 'general_tool']
const targetFish = ['01', '06', '0D']

checkAllProfileChoices()
checkFallbackBranches()
for (const lang of ['en', 'ja', 'th']) {
  await checkRuntimeTransitions(lang)
  await checkInitialAndExplicitCategory(lang)
  await checkAllFishCatalogueOrdering(lang)
  await checkClearAndManualCategory(lang)
}
console.log(
  'Fish equipment defaults PASS: compatible bait and rig for all profiles; category intent, clear, return and locale links preserved.',
)

function matches(item, fish, route) {
  const use = item.playerUse || {}
  const ids = route ? use.fishIdsByRoute?.[route] || use.fishIds || [] : use.fishIds || []
  return ids.includes(fish)
}

function expectedChoice(fish, preferred, items = data.items) {
  const other = preferred === 'float' ? 'sinker' : 'float'
  for (const route of [preferred, other]) {
    if (items.some((item) => item.category === 'bait' && matches(item, fish, route)))
      return { category: 'bait', route }
  }
  if (items.some((item) => item.category === 'lure' && matches(item, fish)))
    return { category: 'lure', route: preferred }
  if (items.some((item) => item.category === 'fly' && matches(item, fish)))
    return { category: 'flymaker', route: preferred }
  return { category: 'bait', route: preferred }
}

function checkAllProfileChoices() {
  assert.equal(fishIds.size, 73, 'The canonical catalogue must keep all 73 fish profiles')
  assert.equal(selectableFish.length, 72, 'Fish 43 remains the single non-selectable profile')
  for (const fish of fishIds) {
    for (const route of ['float', 'sinker']) {
      const actual = fishEquipmentDefault({ allItems: data.items, baitRoute: route }, fish)
      assert.deepEqual(actual, expectedChoice(fish, route), `${fish} from ${route}`)
    }
  }
  for (const fish of selectableFish) {
    assert.equal(expectedChoice(fish, 'float').category, 'bait', `${fish} has recorded bait`)
    assert.equal(expectedChoice(fish, 'sinker').category, 'bait', `${fish} has recorded bait`)
  }
}

function checkFallbackBranches() {
  const lures = data.items.filter((item) => item.category === 'lure')
  const flies = data.items.filter((item) => item.category === 'fly')
  assert.deepEqual(fishEquipmentDefault({ allItems: lures, baitRoute: 'sinker' }, '01'), {
    category: 'lure',
    route: 'sinker',
  })
  assert.deepEqual(fishEquipmentDefault({ allItems: flies, baitRoute: 'sinker' }, '01'), {
    category: 'flymaker',
    route: 'sinker',
  })
  const unavailable = fishEquipmentDefault({ allItems: data.items, baitRoute: 'float' }, '43')
  assert.deepEqual(unavailable, { category: 'bait', route: 'float' })
}

async function checkRuntimeTransitions(lang) {
  for (const category of sourceCategories) {
    for (const currentRoute of ['float', 'sinker']) {
      for (const fish of targetFish) await checkOneTransition(lang, category, currentRoute, fish)
    }
  }
}

async function checkOneTransition(lang, category, currentRoute, fish) {
  const returnPath = `${mapPage(lang)}?stage=4&fish=0D#map-view`
  const query = new URLSearchParams({
    category,
    route: currentRoute,
    stage: '4',
    return: returnPath,
  })
  const result = await renderCatalogue(lang, `?${query}`, false, true)
  result.runtime.selectFish(fish)
  const expected = expectedChoice(fish, currentRoute)
  assert.equal(
    result.nodes['category-filter'].value,
    expected.category,
    `${lang} ${category} ${fish}`,
  )
  assert.equal(result.runtime.baitRoute, expected.route, `${lang} ${category} ${fish} rig`)
  assertBaitFirst(result.nodes.cards.innerHTML, lang, fish)
  checkReturnContext(result, lang, fish, expected.route)
}

function assertBaitFirst(html, lang, fish) {
  assert.match(html, /^<article\b[^>]*id="item-bait-/, `${lang} ${fish}: first card should be bait`)
  assert(!/^<article\b[^>]*id="item-float_weight-/.test(html))
}

function checkReturnContext(result, lang, fish, route) {
  const query = result.url.searchParams
  assert.equal(query.get('fish'), fish)
  assert.equal(query.get('category'), 'bait')
  assert.equal(query.get('route'), route)
  assert.equal(query.get('return'), `${mapPage(lang)}?stage=4&fish=0D#map-view`)
  for (const link of result.languages) {
    const target = new URL(link.href, result.url)
    assert.equal(target.searchParams.get('fish'), fish)
    assert.equal(target.searchParams.get('category'), 'bait')
    assert.equal(target.searchParams.get('route'), route)
    const returned = new URL(target.searchParams.get('return'), target)
    assert(returned.pathname.endsWith(`/${mapPage(link.getAttribute('hreflang'))}`))
    assert.equal(returned.searchParams.get('stage'), '4')
    assert.equal(returned.searchParams.get('fish'), '0D')
    assert.equal(returned.hash, '#map-view')
  }
}

function mapPage(lang) {
  return `maps${lang === 'en' ? '' : `.${lang}`}.html`
}

async function checkInitialAndExplicitCategory(lang) {
  const initial = await renderCatalogue(lang, '?fish=06&route=sinker&stage=4', false, true)
  assert.equal(initial.nodes['category-filter'].value, 'bait')
  assert.equal(initial.runtime.baitRoute, 'float')
  assertBaitFirst(initial.nodes.cards.innerHTML, lang, '06')

  await checkMethodRoundTrip(lang, 'lure', 'lure')
  await checkMethodRoundTrip(lang, 'fly', 'flymaker')

  const explicit = await renderCatalogue(
    lang,
    '?category=float_weight&fish=06&route=sinker&stage=4',
    false,
    true,
  )
  assert.equal(explicit.nodes['category-filter'].value, 'float_weight')
  assert.equal(explicit.url.searchParams.get('category'), 'float_weight')

  const methodDoesNotOverride = await renderCatalogue(
    lang,
    '?category=rod&fish=06&route=lure&stage=2',
    false,
    true,
  )
  assert.equal(methodDoesNotOverride.nodes['category-filter'].value, 'rod')
}

async function checkMethodRoundTrip(lang, route, category) {
  const mapReturn = `${mapPage(lang)}?stage=2&section=s2-c1-r6&fish=06#map-view`
  const result = await renderCatalogue(
    lang,
    `?fish=06&route=${route}&stage=2&return=${encodeURIComponent(mapReturn)}`,
    false,
    true,
  )
  assert.equal(result.nodes['category-filter'].value, category)
  assert.equal(result.url.searchParams.get('category'), category)
  assert.equal(result.url.searchParams.get('fish'), '06')
  assert.equal(result.url.searchParams.get('return'), mapReturn)
  const map = new URL(result.nodes['map-browser-link'].href, result.url)
  assert.equal(map.searchParams.get('route'), route)
  assert.equal(map.searchParams.get('fish'), '06')
  assert.equal(map.searchParams.get('stage'), '2')
  const returned = new URL(map.searchParams.get('return'), map)
  assert.equal(returned.searchParams.get('category'), category)
  assert.equal(returned.searchParams.get('fish'), '06')
  assert.equal(returned.searchParams.get('return'), mapReturn)
}

async function checkAllFishCatalogueOrdering(lang) {
  const byId = await renderCatalogue(lang, '?category=all&fish=10&sort=id', false, true)
  const ids = [...byId.nodes.cards.innerHTML.matchAll(/<article\b[^>]*id="([^"]+)"/g)].map(
    ([, id]) => id,
  )
  assert.equal(ids.length, 16, `${lang}: retain all 16 compatible profiles`)
  assert.match(ids[0], /^item-bait-/, `${lang}: show compatible bait before floats`)
  assert.equal(byId.nodes['category-filter'].value, 'all', `${lang}: do not override category`)
  const byName = await renderCatalogue(lang, '?category=all&fish=10&sort=name', false, true)
  const names = [...byName.nodes.cards.innerHTML.matchAll(/<article\b[^>]*id="([^"]+)"/g)].map(
    ([, id]) => id,
  )
  const candidates = byName.runtime.allItems.filter(
    (item) =>
      ['bait', 'lure', 'fly', 'float_weight'].includes(item.category) && matches(item, '10'),
  )
  const expectedNames = candidates.sort(
    (a, b) =>
      byName.runtime.itemName(a).localeCompare(byName.runtime.itemName(b), lang) ||
      a.id.localeCompare(b.id),
  )
  assert.deepEqual(new Set(names), new Set(ids), `${lang}: name sort retains the same profiles`)
  assert.deepEqual(
    names,
    expectedNames.map((item) => `item-${item.category}-${item.id}`),
  )
}

async function checkClearAndManualCategory(lang) {
  const result = await renderCatalogue(lang, '?category=rod&route=sinker&stage=4', false, true)
  result.runtime.selectFish('06')
  assert.equal(result.nodes['category-filter'].value, 'bait')
  const event = {
    target: { closest: () => ({ dataset: { category: 'general_tool' } }) },
    button: 0,
    preventDefault() {},
  }
  result.nodes['category-menu'].listeners.click(event)
  assert.equal(result.nodes['category-filter'].value, 'general_tool')
  assert.equal(result.url.searchParams.get('category'), 'general_tool')
  result.runtime.selectFish('')
  assert.equal(result.nodes['category-filter'].value, 'general_tool')
  assert.equal(result.url.searchParams.has('fish'), false)
  assert.equal(result.url.searchParams.get('category'), 'general_tool')
}
