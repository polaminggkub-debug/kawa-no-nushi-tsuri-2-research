import assert from 'node:assert/strict'
import { renderMapNavigation } from '../../src/pages/maps/map-render.js'
import {
  mapReturnAction,
  setupReturnAction,
  mapReturnMarkup,
  previousPageAction,
} from '../../src/pages/equipment/return-action.js'

const locales = ['en', 'th', 'ja']

function localizedFile(root, locale) {
  return `${root}${locale === 'en' ? '' : `.${locale}`}.html`
}

function sourceReturn(locale) {
  const catalogue = `${localizedFile('index', locale)}?category=all&fish=06&route=sinker#fish-location-panel`
  const fish = `${localizedFile('fish', locale)}?id=06&stage=2&route=sinker&return=${encodeURIComponent(catalogue)}`
  return `${localizedFile('maps', locale)}?stage=2&section=s2-c1-r6&fish=06&route=sinker&return=${encodeURIComponent(fish)}`
}

function fakeMapContext(locale, mapReturn) {
  const nodes = new Map()
  return {
    lang: locale,
    selectedFish: '06',
    selectedRoute: 'sinker',
    activeStage: 2,
    sourceReturn: () => mapReturn,
    c: { tackle: 'Browse tackle' },
    $: (id) => {
      if (!nodes.has(id)) nodes.set(id, { href: '', textContent: '', setAttribute() {} })
      return nodes.get(id)
    },
  }
}

function fakeLink(locale) {
  const link = { href: localizedFile('index', locale), dataset: {} }
  link.getAttribute = (name) => (name === 'hreflang' ? locale : link.href)
  return link
}

function fakeCatalogueDocument() {
  const nav = {
    children: [],
    prepend(link) {
      this.children.unshift(link)
    },
  }
  const links = locales.map(fakeLink)
  return {
    nav,
    links,
    document: {
      querySelector(selector) {
        return selector === '.hero-meta' ? nav : null
      },
      querySelectorAll(selector) {
        return selector === '.language-links a' ? links : []
      },
      createElement() {
        return { dataset: {}, href: '', textContent: '', className: '' }
      },
    },
  }
}

function withCatalogueGlobals(url, document, action) {
  const previousWindow = globalThis.window
  const previousDocument = globalThis.document
  globalThis.window = { location: url }
  globalThis.document = document
  try {
    return action()
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
    if (previousDocument === undefined) delete globalThis.document
    else globalThis.document = previousDocument
  }
}

function assertLocalizedContext(raw, locale, base) {
  const map = new URL(raw, base)
  assert(map.pathname.endsWith(`/maps${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(map.searchParams.get('stage'), '2')
  assert.equal(map.searchParams.get('section'), 's2-c1-r6')
  assert.equal(map.searchParams.get('fish'), '06')
  assert.equal(map.searchParams.get('route'), 'sinker')
  const fish = new URL(map.searchParams.get('return'), base)
  assert(fish.pathname.endsWith(`/fish${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(fish.searchParams.get('id'), '06')
  assert.equal(fish.searchParams.get('stage'), '2')
  assert.equal(fish.searchParams.get('route'), 'sinker')
  const catalogue = new URL(fish.searchParams.get('return'), base)
  assert(catalogue.pathname.endsWith(`/index${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(catalogue.searchParams.get('category'), 'all')
  assert.equal(catalogue.searchParams.get('fish'), '06')
  assert.equal(catalogue.searchParams.get('route'), 'sinker')
  assert.equal(catalogue.hash, '#fish-location-panel')
}

function testMapToCatalogue(locale) {
  const mapReturn = sourceReturn(locale)
  const mapContext = fakeMapContext(locale, mapReturn)
  renderMapNavigation(mapContext)
  const mapUrl = new URL(`https://example.test/catalogue/${localizedFile('maps', locale)}`)
  const catalogueUrl = new URL(mapContext.$('catalogue-fish-link').href, mapUrl)
  assert.equal(catalogueUrl.searchParams.get('return'), mapReturn)
  assert.equal(catalogueUrl.searchParams.get('fish'), '06')
  assert.equal(catalogueUrl.searchParams.get('stage'), '2')
  assert.equal(catalogueUrl.searchParams.get('route'), 'sinker')
  assert.equal(catalogueUrl.hash, '#fish-location-panel')
  const action = mapReturnAction(catalogueUrl.searchParams.get('return'), locale, catalogueUrl.href)
  assert(action, `${locale}: map return action should be available`)
  assertLocalizedContext(action.href, locale, catalogueUrl.href)
  return catalogueUrl
}

function testCatalogueReturnAndLanguages(locale, catalogueUrl) {
  const { document, nav, links } = fakeCatalogueDocument()
  withCatalogueGlobals(catalogueUrl, document, () => {
    setupReturnAction({ lang: locale })
    const markup = mapReturnMarkup({ lang: locale, esc: (value) => value })
    assert(markup.includes('data-map-panel-return'), 'Map panel lacks a visible return action')
    assert(markup.includes('s2-c1-r6'), 'Map panel return loses section')
  })
  assert.equal(nav.children.length, 1, `${locale}: visible map return action is missing`)
  assert(
    nav.children[0].dataset.mapReturn,
    `${locale}: return action is not marked as map navigation`,
  )
  assertLocalizedContext(
    new URL(nav.children[0].href, catalogueUrl).href,
    locale,
    catalogueUrl.href,
  )
  for (const link of links) {
    const targetLocale = link.getAttribute('hreflang')
    const target = new URL(link.href, catalogueUrl)
    assert(target.pathname.endsWith(`/${localizedFile('index', targetLocale)}`))
    assertLocalizedContext(target.searchParams.get('return'), targetLocale, catalogueUrl.href)
  }
}

function testUnsafeReturn(locale) {
  const base = `https://example.test/catalogue/index${locale === 'en' ? '' : `.${locale}`}.html`
  assert.equal(mapReturnAction('https://attacker.example/maps.html', locale, base), null)
  assert.equal(mapReturnAction('//attacker.example/maps.html', locale, base), null)
}

for (const locale of locales) {
  const catalogueUrl = testMapToCatalogue(locale)
  testCatalogueReturnAndLanguages(locale, catalogueUrl)
  testUnsafeReturn(locale)
  testItemReturn(locale)
}

function testItemReturn(locale) {
  const base = new URL(
    `https://example.test/catalogue/${localizedFile('index', locale)}?category=hook&stage=4`,
  )
  const raw = 'item.th.html?category=hook&id=01&fish=0D&stage=4&route=sinker#detail-root'
  const { document, nav, links } = fakeCatalogueDocument()
  base.searchParams.set('return', raw)
  withCatalogueGlobals(base, document, () => setupReturnAction({ lang: locale }))
  assert.equal(nav.children.length, 1, 'Item return must be visibly mounted')
  assert.equal(nav.children[0].dataset.previousPageReturn, 'true')
  const back = new URL(nav.children[0].href, base)
  assert(back.pathname.endsWith(`/${localizedFile('item', locale)}`))
  for (const [key, value] of Object.entries({
    category: 'hook',
    id: '01',
    fish: '0D',
    stage: '4',
    route: 'sinker',
  }))
    assert.equal(back.searchParams.get(key), value)
  assert.equal(back.hash, '#detail-root')
  for (const link of links) {
    const targetLocale = link.getAttribute('hreflang')
    const target = new URL(link.href, base)
    const targetBack = new URL(target.searchParams.get('return'), base)
    assert(targetBack.pathname.endsWith(`/${localizedFile('item', targetLocale)}`))
  }
  assert.equal(previousPageAction('https://attacker.example/item.html', locale, base.href), null)
  assert.equal(previousPageAction('//attacker.example/item.html', locale, base.href), null)
  assert.equal(previousPageAction('missing.html', locale, base.href), null)
  const self = new URL(
    `https://example.test/catalogue/${localizedFile('index', locale)}?category=hook&stage=4`,
  )
  assert.equal(previousPageAction(self.pathname + self.search, locale, self.href), null)
}

console.log(
  'PASS: map-to-catalogue-to-map returns preserve stage, section, fish, and nested outer return across EN/TH/JA; unsafe redirects are rejected.',
)
