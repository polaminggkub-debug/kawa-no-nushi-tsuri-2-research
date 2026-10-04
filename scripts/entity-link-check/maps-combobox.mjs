import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { renderFrontendOutputs } from '../build_frontend.mjs'
import { data, fishIds, locations } from './shared.mjs'

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
const profileIds = Object.keys(locations.fish || {}).map((id) => id.toUpperCase().padStart(2, '0'))

function assertMapMarkup(locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const html = fs.readFileSync(path.join(root, `catalogue/maps${suffix}.html`), 'utf8')
  assert.match(html, /id="fish-search"[^>]*role="combobox"/, `${locale}: search is not a combobox`)
  assert.match(html, /aria-autocomplete="list"/, `${locale}: list autocomplete is missing`)
  assert.match(html, /aria-controls="fish-suggestions"/, `${locale}: listbox is not associated`)
  assert.match(html, /id="fish-suggestions"[^>]*role="listbox"/, `${locale}: listbox is missing`)
  assert.match(html, /id="fish-search-help"/, `${locale}: search instructions are missing`)
  assert.match(html, /maps\.js\?v=[\w-]+/)
  assert.match(html, /maps\.css\?v=[\w-]+/)
}

class Element {
  constructor(id, owner) {
    this.id = id
    this.owner = owner
    this.listeners = {}
    this.attributes = {}
    this.dataset = {}
    this.children = []
    this.innerHTML = ''
    this.textContent = ''
    this.value = ''
    this.hidden = false
    this.disabled = false
    this.style = {}
    this.parentElement = { clientWidth: 720 }
  }

  addEventListener(type, listener) {
    ;(this.listeners[type] ||= []).push(listener)
  }

  dispatch(type, event = {}) {
    const dispatched = {
      type,
      target: this,
      key: '',
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true
      },
      ...event,
    }
    for (const listener of this.listeners[type] || []) listener(dispatched)
    return dispatched
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value)
    if (name === 'href') this.href = String(value)
  }

  removeAttribute(name) {
    delete this.attributes[name]
    if (name === 'href') this.href = ''
  }

  getAttribute(name) {
    return this.attributes[name] ?? (name === 'href' ? this.href : null)
  }

  focus() {
    this.owner.activeElement = this
    this.dispatch('focus')
  }

  querySelectorAll(selector) {
    if (selector !== '[role="option"]') return []
    return [...this.innerHTML.matchAll(/<div id="(fish-suggestion-[^"]+)"[^>]*role="option"/g)].map(
      ([, id]) => this.owner.getElementById(id),
    )
  }

  scrollIntoView() {}
}

function createHarnessDocument(locale, links) {
  const nodes = new Map()
  const document = {
    activeElement: null,
    documentElement: { dataset: { locale } },
    title: '',
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, new Element(id, document))
      return nodes.get(id)
    },
    querySelector(selector) {
      if (selector === '.hero-meta') return { prepend() {} }
      if (selector.startsWith('#')) return document.getElementById(selector.slice(1))
      return null
    },
    querySelectorAll(selector) {
      return selector === '.language-links a' ? links : []
    },
    createElement(tag) {
      return new Element(tag, document)
    },
  }
  return { document, nodes }
}

function makeLanguageLinks() {
  return ['en', 'th', 'ja'].map((locale) => {
    const link = { dataset: {}, href: `maps${locale === 'en' ? '' : `.${locale}`}.html` }
    link.getAttribute = (name) =>
      name === 'hreflang' ? locale : name === 'href' ? link.href : null
    return link
  })
}

function makeLocation(query = '') {
  const url = new URL(
    'https://example.test/catalogue/maps.html?' +
      (query || 'stage=6&return=index.th.html%3Fcategory%3Dlure%26fish%3D06%23catalogue'),
  )
  return { href: url.href, pathname: url.pathname, search: url.search }
}

function makeHistory(location) {
  return {
    lastUrl: '',
    replaceState(_state, _title, target) {
      const url = new URL(target, location.href)
      this.lastUrl = url.href
      Object.assign(location, { href: url.href, pathname: url.pathname, search: url.search })
    },
  }
}

function exposeRuntime(bundle) {
  const contextName = bundle.match(/\b(?:const|let|var)\s+([\w$]+)\s*=\s*createPageRuntime\(/)?.[1]
  assert(contextName, 'Bundled map page did not create its page runtime')
  assert(/\}\)\(\);\s*$/.test(bundle), 'Expected deterministic IIFE map bundle')
  return bundle.replace(/\}\)\(\);\s*$/, `globalThis.__mapRuntime=${contextName};\n})();`)
}

async function runMapPage(outputs, locale, pending = false, query = '') {
  const links = makeLanguageLinks()
  const { document, nodes } = createHarnessDocument(locale, links)
  const location = makeLocation(query)
  const history = makeHistory(location)
  const errors = []
  const context = {
    document,
    location,
    history,
    window: { addEventListener() {}, history },
    URL,
    URLSearchParams,
    console: { error: (...items) => errors.push(items) },
    setTimeout,
    clearTimeout,
    queueMicrotask,
    fetch: async (file) => {
      if (pending) return new Promise(() => {})
      return {
        ok: true,
        json: async () => (String(file).includes('fish-locations') ? locations : data),
      }
    },
  }
  vm.runInNewContext(exposeRuntime(outputs.get('catalogue/maps.js')), context)
  await new Promise((resolve) => setImmediate(resolve))
  assert.equal(errors.length, 0, `Map page logged load errors in ${locale}`)
  assert(context.__mapRuntime, 'Bundled map page did not expose its runtime for behavior checks')
  return { runtime: context.__mapRuntime, nodes, links, location, history }
}

function checkProfiles(runtime) {
  assert(profileIds.length > 0, 'ROM map contains no fish profiles')
  assert.equal(new Set(profileIds).size, profileIds.length, 'Map profile IDs must be unique')
  const unlocated = [...fishIds].filter((id) => !profileIds.includes(id))
  assert.deepEqual(unlocated, ['43'], 'Only the explicitly unconfirmed fish may lack map points')
  assert(
    !runtime.matchingSuggestions('43').includes('43'),
    'Unconfirmed fish must not appear as map targets',
  )
  for (const [rawId, profile] of Object.entries(locations.fish || {})) {
    const id = rawId.toUpperCase().padStart(2, '0')
    assert((profile.locations || []).some((entry) => (entry.points || []).length))
    assert(data.fishVisuals[id], `No fish sprite/profile for map ID ${id}`)
    assert(runtime.matchingSuggestions(id).includes(id), `Fish ID ${id} is not searchable`)
  }
}

function checkLocaleReturns(runtime, links, location) {
  const nested =
    'item.th.html?category=bait&id=01&stage=3&fish=06&route=sinker&return=' +
    encodeURIComponent('shops.th.html?stage=3&return=../research/index.th.html')
  for (const locale of ['en', 'th', 'ja']) {
    let route = runtime.localizeReturn(nested, locale)
    for (const basename of ['item', 'shops', 'index']) {
      const url = new URL(route, location.href)
      assert(url.pathname.endsWith(`/${basename}${locale === 'en' ? '' : `.${locale}`}.html`))
      route = url.searchParams.get('return')
    }
    assert.equal(runtime.safeReturn('https://invalid.example/'), '')
  }
  runtime.updateUrl()
  for (const link of links) {
    const locale = link.getAttribute('hreflang')
    const target = new URL(link.href, location.href)
    assert.equal(
      target.searchParams.get('return'),
      `index${locale === 'en' ? '' : `.${locale}`}.html?category=lure&fish=06#catalogue`,
      `Map language link lost localized return in ${locale}`,
    )
  }
}

function checkSearchAndKeyboard(runtime, nodes, history) {
  const search = runtime.searchInput
  runtime.zoom = 1.7
  runtime.renderMap()
  search.focus()
  search.value = 'rainbow'
  search.dispatch('input')
  assert.deepEqual([...runtime.suggestionIds], ['06'])
  assert.equal(runtime.activeStage, 6, 'Typing must not navigate to a map area')
  assert.equal(runtime.selectedFish, '', 'Typing must not select the map target')
  assert.equal(runtime.suggestionList.hidden, false, 'Matching input should open suggestions')
  assert.equal(runtime.fishList.hidden, true, 'Suggestions should replace duplicate fish rows')
  assert.match(runtime.suggestionList.innerHTML, /Rainbow trout|Nijimasu|นิจิมาสุ|ニジマス/i)

  const escape = search.dispatch('keydown', { key: 'Escape' })
  assert(escape.defaultPrevented, 'Escape should close the open suggestions')
  assert.equal(runtime.suggestionList.hidden, true)
  assert.equal(runtime.fishList.hidden, false)
  assert.equal(search.value, 'rainbow')

  search.focus()
  search.dispatch('input')
  const down = search.dispatch('keydown', { key: 'ArrowDown' })
  assert(down.defaultPrevented, 'ArrowDown should move inside the suggestion list')
  assert.equal(search.getAttribute('aria-activedescendant'), 'fish-suggestion-06')
  const enter = search.dispatch('keydown', { key: 'Enter' })
  assert(enter.defaultPrevented, 'Enter should select the active suggestion')
  assert.equal(runtime.selectedFish, '06')
  assert.equal(runtime.activeStage, runtime.species['06'].stages[0])
  assert.equal(runtime.zoom, 1.7, 'Searching must not reset the map zoom')
  assert(
    nodes.get('map-view').innerHTML.includes('id=06'),
    'Selected fish should be linked from its map points',
  )
  const url = new URL(history.lastUrl)
  assert.equal(url.searchParams.get('fish'), '06')
  assert.equal(url.searchParams.get('stage'), String(runtime.activeStage))
}

function checkEmptySearch(runtime, nodes, history) {
  const search = runtime.searchInput
  search.focus()
  search.value = 'no-such-fish'
  search.dispatch('input')
  assert.equal(runtime.suggestionIds.length, 0)
  assert.equal(runtime.suggestionList.hidden, true)
  assert(
    runtime.fishList.innerHTML.includes(runtime.c.noFish),
    'No-results state must be localized',
  )
  nodes.get('clear-search').dispatch('click')
  assert.equal(search.value, '')
  assert.equal(runtime.selectedFish, '')
  assert.equal(runtime.suggestionList.hidden, true)
  assert.equal(runtime.activeStage, runtime.species['06'].stages[0])
  assert.equal(new URL(history.lastUrl).searchParams.has('fish'), false)
}

async function main() {
  for (const locale of ['en', 'th', 'ja']) assertMapMarkup(locale)
  const outputs = await renderFrontendOutputs()
  for (const locale of ['en', 'th', 'ja']) {
    const { runtime, nodes, links, location, history } = await runMapPage(outputs, locale)
    await checkPendingNavigation(outputs, locale)
    checkProfiles(runtime)
    checkLocaleReturns(runtime, links, location)
    checkSearchAndKeyboard(runtime, nodes, history)
    checkEmptySearch(runtime, nodes, history)
  }
  console.log(
    `PASS: accessible fish combobox; ${profileIds.length} ROM-mapped fish profiles; bundled typing, keyboard selection, map targeting, clear, and localized return behavior checked in three locales.`,
  )
}

await main()

async function checkPendingNavigation(outputs, locale) {
  const query = 'stage=2&section=s2-c1-r6&fish=06&return=fish.th.html%3Fid%3D06%26stage%3D2'
  const { runtime, nodes, location } = await runMapPage(outputs, locale, true, query)
  assert.equal(Object.keys(runtime.species).length, 0, 'Pending test accidentally loaded map data')
  const equipment = new URL(nodes.get('catalogue-fish-link').href, location.href)
  assert.equal(equipment.searchParams.get('fish'), '06')
  assert.equal(equipment.searchParams.get('stage'), '2')
  const returned = new URL(equipment.searchParams.get('return'), location.href)
  assert.equal(returned.searchParams.get('section'), 's2-c1-r6')
  assert.equal(returned.searchParams.get('return'), 'fish.th.html?id=06&stage=2')
  const shop = new URL(nodes.get('shop-browser-link').href, location.href)
  assert.equal(shop.searchParams.get('stage'), '2')
  assert.equal(shop.searchParams.get('fish'), '06')
  assert.equal(shop.searchParams.get('return'), equipment.searchParams.get('return'))
}
