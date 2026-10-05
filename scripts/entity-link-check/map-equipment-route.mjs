import assert from 'node:assert/strict'
import { data, renderCatalogue, unescapeHtml } from './shared.mjs'
import { fishEquipmentDefault } from '../../src/pages/equipment/fish-equipment-default.js'
import { bindMapTargets } from '../../src/pages/maps/bind-map-targets.js'
import { initFromUrl, renderMapNavigation, setFish } from '../../src/pages/maps/map-render.js'
import { notebookGuideMarkup } from '../../src/pages/maps/notebook-guide.js'
import {
  localizeReturn,
  safeReturn,
  updateLanguageLinks,
  updateUrl,
} from '../../src/pages/maps/fish-search.js'

const locales = ['en', 'ja', 'th']
const routes = ['float', 'sinker', 'lure', 'fly']
const explicitCategories = ['rod', 'hook', 'float_weight']

for (const locale of locales) {
  for (const route of routes) await checkMapEquipmentLink(locale, route)
  for (const route of ['float', 'sinker']) await checkNotebookEquipmentLink(locale, route)
  for (const category of explicitCategories) await checkExplicitCategory(locale, category)
}

console.log(
  'PASS: map equipment links preserve fish, stage, section, return and route in EN/JA/TH; compatible bait defaults and explicit categories remain intact.',
)

async function checkMapEquipmentLink(locale, route) {
  const scenario = makeMapScenario(locale, route)
  setFish(scenario.ctx, '0D', { toggle: false })
  const base = scenario.state.url
  const target = new URL(scenario.nodes.get('catalogue-fish-link').href, base)
  assert(target.pathname.endsWith(`/index${suffix(locale)}.html`))
  assert.equal(target.searchParams.get('fish'), '0D')
  assert.equal(target.searchParams.get('stage'), '4')
  assert.equal(target.searchParams.get('route'), route)
  assert.equal(target.searchParams.has('category'), false)
  assert.equal(target.hash, '#fish-location-panel')
  assertReturnedMap(target.searchParams.get('return'), locale, route)
  checkLocalizedMapLinks(scenario.links, route)
  if (['float', 'sinker'].includes(route)) await checkBaitDefault(locale, route, target)
}

function makeMapScenario(locale, route) {
  const langSuffix = suffix(locale)
  const nestedReturn = `item${langSuffix}.html?category=hook&id=01&fish=0D&stage=2&route=${route}#detail-root`
  const state = {
    url: new URL(
      `https://example.test/catalogue/maps${langSuffix}.html?stage=4&section=s4-c2-r2&fish=15&route=${route}&q=river&return=${encodeURIComponent(nestedReturn)}#map-view`,
    ),
  }
  const links = languageLinks()
  const nodes = new Map()
  const ctx = {
    lang: locale,
    selectedFish: '',
    selectedRoute: '',
    activeStage: 1,
    activeSection: '',
    listScope: 'area',
    searchTerm: '',
    searchInput: { value: '' },
    stages: { 4: { sections: new Map([['s4-c2-r2', { pins: [{ fishIds: ['15', '0D'] }] }]]) } },
    species: { 15: { stages: [4] }, '0D': { stages: [4] } },
    areaList: node(nodes, 'area-list'),
    fishList: node(nodes, 'fish-list'),
    idNorm: (value) => String(value).toUpperCase().replace(/^0X/, '').padStart(2, '0'),
    fishInStage: (id, stage) => ctx.species[id]?.stages.includes(Number(stage)),
    chooseSection: (_stage, preferred = '') => preferred || 's4-c2-r2',
    c: { tackle: 'Compatible gear' },
    $: (id) => node(nodes, id),
    safeReturn: (raw) => safeReturn(ctx, raw),
    localizeReturn: (raw, toLocale) => localizeReturn(ctx, raw, toLocale),
    updateLanguageLinks: (params) => updateLanguageLinks(ctx, params),
    render() {
      updateUrl(ctx)
      renderMapNavigation(ctx)
    },
  }
  installMapGlobals(state, links)
  ctx.returnPath = safeReturn(ctx, state.url.searchParams.get('return'))
  initFromUrl(ctx)
  bindMapTargets(ctx)
  return { ctx, links, nodes, state }
}

function installMapGlobals(state, links) {
  const location = Object.defineProperties(
    {},
    {
      pathname: { get: () => state.url.pathname },
      search: { get: () => state.url.search },
      hash: { get: () => state.url.hash },
      href: { get: () => state.url.href },
    },
  )
  globalThis.location = location
  globalThis.history = {
    replaceState: (_state, _title, href) => {
      state.url = new URL(href, state.url)
    },
  }
  globalThis.document = {
    createElement: () => ({ dataset: {}, href: '', textContent: '', className: '' }),
    querySelector: (selector) => (selector === '.hero-meta' ? { prepend() {} } : null),
    querySelectorAll: (selector) => (selector === '.language-links a' ? links : []),
  }
}

function languageLinks() {
  return locales.map((locale) => ({
    href: `maps${suffix(locale)}.html`,
    dataset: {},
    getAttribute: (name) =>
      name === 'hreflang' ? locale : name === 'href' ? `maps${suffix(locale)}.html` : null,
  }))
}

function node(nodes, id) {
  if (!nodes.has(id))
    nodes.set(id, {
      href: '',
      textContent: '',
      dataset: {},
      setAttribute() {},
      addEventListener() {},
    })
  return nodes.get(id)
}

function assertReturnedMap(raw, locale, route) {
  const map = new URL(raw, 'https://example.test/catalogue/')
  assert(
    map.pathname.endsWith(`/maps${suffix(locale)}.html`),
    `${locale}: localized map return points at ${map.pathname}`,
  )
  assert.equal(map.searchParams.get('stage'), '4')
  assert.equal(map.searchParams.get('section'), 's4-c2-r2')
  assert.equal(map.searchParams.get('fish'), '0D')
  assert.equal(map.searchParams.get('route'), route)
  assert.equal(map.hash, '#map-view')
  assertNestedItem(map.searchParams.get('return'), locale, route, map)
}

function assertNestedItem(raw, locale, route, base = 'https://example.test/catalogue/') {
  const nested = new URL(raw, base)
  assert(nested.pathname.endsWith(`/item${suffix(locale)}.html`))
  assert.equal(nested.searchParams.get('category'), 'hook')
  assert.equal(nested.searchParams.get('route'), route)
  assert.equal(nested.hash, '#detail-root')
}

function checkLocalizedMapLinks(links, route) {
  for (const link of links) {
    const locale = link.getAttribute('hreflang')
    const target = new URL(link.href, 'https://example.test/catalogue/')
    assert(target.pathname.endsWith(`/maps${suffix(locale)}.html`))
    assert.equal(target.searchParams.get('stage'), '4')
    assert.equal(target.searchParams.get('section'), 's4-c2-r2')
    assert.equal(target.searchParams.get('fish'), '0D')
    assert.equal(target.searchParams.get('route'), route)
    assertNestedItem(target.searchParams.get('return'), locale, route)
  }
}

async function checkBaitDefault(locale, mapRoute, target) {
  const page = await renderCatalogue(locale, target.search, false, true)
  const fish = target.searchParams.get('fish')
  const choice = fishEquipmentDefault({ allItems: data.items, baitRoute: mapRoute }, fish)
  assert.equal(choice.category, 'bait')
  assert.equal(page.nodes['category-filter'].value, 'bait')
  assert.equal(page.runtime.baitRoute, choice.route)
  assert.equal(page.nodes['fish-filter'].value, fish)
  assert.equal(page.runtime.locationStage, '4', `${target.search} -> ${page.url.href}`)
}

async function checkNotebookEquipmentLink(locale, route) {
  const guide = data.notebookCompletion
  const stage = guide.stages[3]
  const fish = stage.firstOccurrenceSpecies[0]
  const langSuffix = suffix(locale)
  const nestedReturn = `item${langSuffix}.html?category=hook&id=01&stage=2&route=${route}`
  const source = `maps${langSuffix}.html?stage=4&section=s4-c2-r2&fish=06&route=${route}&return=${encodeURIComponent(nestedReturn)}#map-view`
  const html = notebookGuideMarkup(notebookContext(locale, route, source))
  const card = html.match(
    new RegExp(
      `<article\\b(?=[^>]*class="notebook-fish notebook-route-fish")(?=[^>]*data-notebook-card="${fish}")[^>]*>([\\s\\S]*?)<\\/article>`,
    ),
  )?.[1]
  assert(card, `${locale} ${route}: missing Area 4 notebook card ${fish}`)
  const raw = card.match(/data-notebook-action="equipment" href="([^"]+)"/)?.[1]
  assert(raw, `${locale} ${route}: notebook card lacks equipment action`)
  const target = new URL(unescapeHtml(raw), `https://example.test/catalogue/maps${langSuffix}.html`)
  assert(
    target.pathname.endsWith(`/index${langSuffix}.html`),
    `${locale}: notebook equipment target ${target.href}`,
  )
  assert.equal(target.searchParams.get('fish'), fish)
  assert.equal(target.searchParams.get('stage'), '4')
  assert.equal(target.searchParams.get('route'), route)
  assert.equal(target.searchParams.has('category'), false)
  assert.equal(target.hash, '#fish-location-panel')
  assertNotebookReturn(target.searchParams.get('return'), locale, route)
  await checkBaitDefault(locale, route, target)
}

function notebookContext(locale, route, source) {
  const nameKey = locale === 'en' ? 'nameLatin' : locale === 'ja' ? 'nameJa' : 'nameTh'
  return {
    lang: locale,
    activeStage: 4,
    notebookRouteStage: 4,
    openNotebookGuide: true,
    notebookCompletion: data.notebookCompletion,
    selectedRoute: route,
    returnPath: source,
    sourceReturn: () => source,
    fishHref: () => '',
    species: Object.fromEntries(
      Object.entries(data.fishVisuals).map(([id, visual]) => [
        id,
        { name: visual[nameKey] || id, visual },
      ]),
    ),
    idNorm: (id) => String(id).toUpperCase().padStart(2, '0'),
    c: { area: (area) => String(area) },
    esc: (value) =>
      String(value ?? '').replace(
        /[&<>"']/g,
        (char) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          })[char],
      ),
  }
}

function assertNotebookReturn(raw, locale, route) {
  const map = new URL(raw, 'https://example.test/catalogue/')
  assert(map.pathname.endsWith(`/maps${suffix(locale)}.html`))
  assert.equal(map.searchParams.get('stage'), '4')
  assert.equal(map.searchParams.get('section'), 's4-c2-r2')
  assert.equal(map.searchParams.get('fish'), '06')
  assert.equal(map.searchParams.get('route'), route)
  assert.equal(map.hash, '#notebook-route-4')
  const nested = new URL(map.searchParams.get('return'), map)
  assert(nested.pathname.endsWith(`/item${suffix(locale)}.html`))
  assert.equal(nested.searchParams.get('route'), route)
}

async function checkExplicitCategory(locale, category) {
  const langSuffix = suffix(locale)
  const returnPath = `maps${langSuffix}.html?stage=4&section=s4-c2-r2&fish=06&route=sinker#map-view`
  const query = new URLSearchParams({
    category,
    fish: '06',
    route: 'sinker',
    stage: '4',
    return: returnPath,
  })
  const page = await renderCatalogue(locale, `?${query}`, false, true)
  assert.equal(page.nodes['category-filter'].value, category)
  assert.equal(page.url.searchParams.get('category'), category)
  assert.equal(page.nodes['fish-filter'].value, '06')
}

function suffix(locale) {
  return locale === 'en' ? '' : `.${locale}`
}
