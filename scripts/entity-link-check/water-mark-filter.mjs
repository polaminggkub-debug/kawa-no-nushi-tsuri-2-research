import assert from 'node:assert/strict'
import vm from 'node:vm'
import { renderFrontendOutputs } from '../build_frontend.mjs'
import { data, locations } from './shared.mjs'
import * as mapsApi from '../../src/pages/maps/index.js'

const locales = ['en', 'th', 'ja']
const marks = ['small', 'large', 'bubble']
const stages = [1, 2, 3, 4, 5, 6]

function checkCounterexample() {
  const smallFish = data.waterIcons.profiles['06']
  const bubbleFish = data.waterIcons.profiles['0F']
  assert(smallFish && bubbleFish, 'Missing bubble false-pass fixture profiles')
  assert(smallFish.possibleClasses.includes('small'))
  assert(!smallFish.possibleClasses.includes('bubble'))
  assert(bubbleFish.possibleClasses.includes('bubble'))
  assert(stageLocations('06').includes(3) && stageLocations('0F').includes(3))
  assert(expectedFish(3, 'bubble').includes('0F'))
  assert(!expectedFish(3, 'bubble').includes('06'))
}

function stageLocations(id) {
  return (locations.fish[id]?.locations || []).map((entry) => Number(entry.stage))
}

function expectedFish(stage, mark) {
  return Object.entries(locations.fish)
    .filter(
      ([id, fish]) =>
        Boolean(data.waterIcons.profiles[id]?.possibleClasses?.includes(mark)) &&
        (fish.locations || []).some((entry) => Number(entry.stage) === stage),
    )
    .map(([id]) => id)
    .sort()
}

function checkRuntimeBoot(runtime, locale) {
  assert(runtime?.stages, `${locale}: bundled map page did not boot`)
  assert.equal(
    runtime.activeWaterMark,
    'bubble',
    `${locale}: initial mark did not survive URL load`,
  )
  assert.equal(
    runtime.selectedFish,
    '06',
    `${locale}: initial fish target did not survive URL load`,
  )
  assert.equal(runtime.activeStage, 3)
  assert.equal(runtime.searchTerm, '0F', `${locale}: initial search did not survive URL load`)
  assert.equal(runtime.listScope, 'section')
  assert.equal(runtime.openNotebookGuide, true)
  assert.equal(
    runtime.returnPath,
    `index${locale === 'en' ? '' : `.${locale}`}.html?category=hook#catalogue`,
  )
  assert.equal(runtime.lang, locale)
  assert.equal(typeof runtime.waterMarkFishIds, 'function')
  assert.equal(typeof runtime.visibleMapFishIds, 'function')
  assert.equal(typeof runtime.initFromUrl, 'function')
}

function checkCandidateMatrix(runtime, locale) {
  for (const stage of stages) {
    for (const mark of marks) {
      const actual = [...runtime.waterMarkFishIds(stage, mark)].sort()
      assert.deepEqual(actual, expectedFish(stage, mark), `${locale}: ${mark}, area ${stage}`)
    }
  }
}

function checkListAndMapFiltering(runtime, locale) {
  for (const stage of stages) {
    for (const mark of marks) {
      checkRenderedFishList(runtime, locale, stage, mark)
      checkRenderedMapSection(runtime, locale, stage, mark)
    }
  }
  checkScopedList(runtime, locale)
  checkSearchCannotEscapeMark(runtime, locale)
}

function checkRenderedFishList(runtime, locale, stage, mark) {
  resetFilterState(runtime, stage, mark)
  runtime.renderFishList()
  const actual = [
    ...runtime.fishList.innerHTML.matchAll(/class="fish-choice"[^>]*data-fish="([^"]+)"/g),
  ]
    .map((match) => match[1])
    .sort()
  assert.deepEqual(
    actual,
    expectedFish(stage, mark),
    `${locale}: visible list ${mark}, area ${stage}`,
  )
}

function resetFilterState(runtime, stage, mark) {
  runtime.activeStage = stage
  runtime.activeWaterMark = mark
  runtime.selectedFish = ''
  runtime.searchTerm = ''
  runtime.searchInput.value = ''
  runtime.listScope = 'area'
  runtime.activeSection = runtime.chooseSection(stage)
}

function checkRenderedMapSection(runtime, locale, stage, mark) {
  resetFilterState(runtime, stage, mark)
  const section = runtime.stages[stage].sections.get(runtime.activeSection)
  const actual = captureRenderedPins(runtime)
  const expected = [...section.pins]
    .map((pin) => [...runtime.visibleMapFishIds(pin.fishIds)])
    .filter((ids) => ids.length)
  assert.deepEqual(actual, expected, `${locale}: map pins ${mark}, area ${stage}`)
  for (const ids of actual)
    for (const id of ids)
      assert(runtime.fishMatchesWaterMark(id), `${locale}: incompatible map pin ${id} for ${mark}`)
}

function captureRenderedPins(runtime) {
  const rendered = []
  const original = runtime.mapPinMarkup
  runtime.mapPinMarkup = (pin, ...args) => {
    rendered.push([...pin.fishIds])
    return original(pin, ...args)
  }
  try {
    runtime.renderMap()
  } finally {
    runtime.mapPinMarkup = original
  }
  return rendered
}

function checkScopedList(runtime, locale) {
  resetFilterState(runtime, 3, 'bubble')
  const sections = runtime.stages[3].sections
  const candidate = expectedFish(3, 'bubble')[0]
  const section = [...sections.values()].find((entry) =>
    entry.pins.some((pin) => pin.fishIds.includes(candidate)),
  )
  assert(section, `${locale}: bubble candidate has no map section`)
  runtime.activeSection = section.key
  runtime.listScope = 'section'
  runtime.renderFishList()
  const expected = [...new Set(section.pins.flatMap((pin) => pin.fishIds))]
    .filter((id) => runtime.fishMatchesWaterMark(id) && runtime.fishInStage(id, 3))
    .sort()
  const actual = listFishIds(runtime.fishList.innerHTML)
  assert.deepEqual(actual, expected, `${locale}: section scope must intersect the mark filter`)
}

function listFishIds(html) {
  return [...html.matchAll(/class="fish-choice"[^>]*data-fish="([^"]+)"/g)]
    .map((match) => match[1])
    .sort()
}

function checkSearchCannotEscapeMark(runtime, locale) {
  resetFilterState(runtime, 3, 'bubble')
  runtime.searchTerm = '06'
  runtime.searchInput.value = '06'
  runtime.renderFishList()
  assert.deepEqual(
    listFishIds(runtime.fishList.innerHTML),
    [],
    `${locale}: bubble search leaked fish 06`,
  )
  runtime.searchTerm = '0F'
  runtime.searchInput.value = '0F'
  runtime.renderFishList()
  assert.deepEqual(listFishIds(runtime.fishList.innerHTML), ['0F'])
}

function checkWaterMarkControls(page, locale) {
  const { runtime, nodes } = page
  resetFilterState(runtime, 3, 'bubble')
  runtime.selectedFish = '06'
  runtime.searchTerm = '0F'
  runtime.searchInput.value = '0F'
  runtime.listScope = 'section'
  runtime.render()
  checkWaterButtons(runtime, nodes, locale)
  assert(nodes.get('water-icon-key').innerHTML.includes('data-water-mark-conflict'))

  dispatchWaterAction(nodes.get('water-icon-key'), 'clear-water-mark')
  assertKeptTargetContext(runtime, page.location, locale)
  dispatchWaterMark(nodes.get('water-icon-key'), 'bubble')
  dispatchWaterMark(nodes.get('water-icon-key'), 'bubble')
  assertKeptTargetContext(runtime, page.location, locale)

  dispatchWaterMark(nodes.get('water-icon-key'), 'bubble')
  dispatchWaterAction(nodes.get('water-icon-key'), 'show-mark-candidates')
  assert.equal(runtime.activeWaterMark, 'bubble')
  assert.equal(runtime.selectedFish, '')
  assert.equal(runtime.searchTerm, '')
  assert.equal(runtime.searchInput.value, '')
  assert.equal(runtime.listScope, 'area')
  assert.equal(runtime.activeStage, 3)
  assert.equal(
    runtime.returnPath,
    `index${locale === 'en' ? '' : `.${locale}`}.html?category=hook#catalogue`,
  )
  assert.deepEqual(listFishIds(runtime.fishList.innerHTML), expectedFish(3, 'bubble'))
  runtime.selectedFish = '06'
  runtime.searchTerm = '0F'
  runtime.searchInput.value = '0F'
  runtime.listScope = 'section'
  runtime.render()
  nodes.get('show-all').dispatch('click')
  assert.equal(runtime.activeWaterMark, '')
  assert.equal(runtime.selectedFish, '')
  assert.equal(runtime.searchTerm, '')
  assert.equal(runtime.searchInput.value, '')
  assert.equal(new URL(page.history.lastUrl).searchParams.has('mark'), false)
}

function checkWaterButtons(runtime, nodes, locale) {
  runtime.renderWaterKey()
  const html = nodes.get('water-icon-key').innerHTML
  const buttons = [
    ...html.matchAll(/<button[^>]*data-water-mark="([^"]+)"[^>]*>[\s\S]*?<\/button>/g),
  ]
  assert.deepEqual(
    buttons.map((match) => match[1]),
    marks,
    `${locale}: all mark choices must remain visible`,
  )
  for (const match of buttons) {
    const mark = match[1]
    assert.equal(/aria-pressed="true"/.test(match[0]), mark === 'bubble')
    assert.equal(
      /<small>/.test(match[0]),
      data.waterIcons.profiles['06'].possibleClasses.includes(mark),
    )
  }
}

function dispatchWaterMark(panel, mark) {
  dispatchPanel(panel, { dataset: { waterMark: mark } }, '[data-water-mark]')
}

function dispatchWaterAction(panel, action) {
  dispatchPanel(panel, { dataset: { action } }, '[data-action]')
}

function dispatchPanel(panel, button, selector) {
  const event = { target: { closest: (candidate) => (candidate === selector ? button : null) } }
  for (const listener of panel.listeners.click || []) listener(event)
}

function assertKeptTargetContext(runtime, location, locale) {
  assert.equal(runtime.activeWaterMark, '')
  assert.equal(runtime.selectedFish, '06')
  assert.equal(runtime.searchTerm, '0F')
  assert.equal(runtime.searchInput.value, '0F')
  assert.equal(runtime.listScope, 'section')
  assert.equal(runtime.activeStage, 3)
  assert.equal(location.hash, '#notebook-guide', `${locale}: notebook anchor was lost`)
  const params = new URL(location.href).searchParams
  assert.equal(params.has('mark'), false)
  assert.equal(params.get('fish'), '06')
  assert.equal(params.get('q'), '0F')
  assert.equal(params.get('scope'), 'section')
}

function checkNavigationContext(page, locale) {
  const { runtime, links, location } = page
  runtime.selectedFish = '0F'
  runtime.activeWaterMark = 'bubble'
  runtime.activeStage = 3
  runtime.searchTerm = '0F'
  runtime.searchInput.value = '0F'
  runtime.activeSection = runtime.chooseSection(3)
  runtime.render()
  checkLocalizedLinks(links, location, locale)
  checkFishDetailReturn(runtime, location, locale)
}

function checkLocalizedLinks(links, location, locale) {
  for (const link of links) {
    const language = link.getAttribute('hreflang')
    const target = new URL(link.href, location.href)
    assert(target.pathname.endsWith(`/maps${language === 'en' ? '' : `.${language}`}.html`))
    assert.equal(target.searchParams.get('mark'), 'bubble', `${locale}: ${language} link lost mark`)
    assert.equal(target.searchParams.get('q'), '0F')
    assert.equal(target.searchParams.get('fish'), '0F')
    const returned = target.searchParams.get('return')
    assert(returned, `${locale}: ${language} link lost its return route`)
    const returnUrl = new URL(returned, location.href)
    assert(returnUrl.pathname.endsWith(`/index${language === 'en' ? '' : `.${language}`}.html`))
    assert.equal(returnUrl.searchParams.get('category'), 'hook')
    assert.equal(returnUrl.hash, '#catalogue')
  }
}

function checkFishDetailReturn(runtime, location, locale) {
  const detail = new URL(runtime.fishHref('0F'), location.href)
  assert(detail.pathname.endsWith(`/fish${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(detail.searchParams.get('id'), '0F')
  assert.equal(detail.searchParams.get('stage'), '3')
  const returned = new URL(detail.searchParams.get('return'), location.href)
  assert.equal(returned.searchParams.get('mark'), 'bubble')
  assert.equal(returned.searchParams.get('q'), '0F')
  assert.equal(returned.searchParams.get('section'), runtime.activeSection)
  assert.equal(returned.hash, '#notebook-guide')
}

async function checkInvalidMark(outputs) {
  const page = await runMapPage(outputs, 'th', 'stage=3&mark=%3Cscript%3Ealert(1)%3C%2Fscript%3E')
  assert.equal(page.runtime.activeWaterMark, '', 'Invalid query mark must be ignored')
  assert.equal(new URL(page.history.lastUrl).searchParams.has('mark'), false)
  assert.equal(page.nodes.get('water-icon-key').innerHTML.includes('<script>'), false)
}

function validQuery(locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const returnPath = `index${suffix}.html?category=hook#catalogue`
  return `stage=3&section=s3-c1-r1&fish=06&mark=bubble&q=0F&scope=section&return=${encodeURIComponent(returnPath)}#notebook-guide`
}

async function runMapPage(outputs, locale, query) {
  const links = makeLanguageLinks()
  const { document, nodes } = createDocument(locale, links)
  const location = makeLocation(locale, query)
  const history = makeHistory(location)
  const errors = []
  const context = {
    document,
    location,
    history,
    window: { innerWidth: 1280, addEventListener() {}, history },
    URL,
    URLSearchParams,
    console: { error: (...items) => errors.push(items) },
    setTimeout,
    clearTimeout,
    queueMicrotask,
    fetch: async (file) => ({
      ok: true,
      json: async () => (String(file).includes('fish-locations') ? locations : data),
    }),
  }
  vm.runInNewContext(exposeRuntime(outputs.get('catalogue/maps.js')), context)
  await new Promise((resolve) => setImmediate(resolve))
  assert.equal(errors.length, 0, `${locale}: map runtime reported a bootstrap error`)
  assert(context.__mapRuntime, `${locale}: map runtime was not exposed`)
  return { runtime: context.__mapRuntime, nodes, links, location, history }
}

function exposeRuntime(bundle) {
  const name = bundle.match(/\b(?:const|let|var)\s+([\w$]+)\s*=\s*createPageRuntime\(/)?.[1]
  assert(name, 'Bundled map app does not create its page runtime')
  assert(/\}\)\(\);\s*$/.test(bundle), 'Expected an IIFE map bundle')
  return bundle.replace(/\}\)\(\);\s*$/, `globalThis.__mapRuntime=${name};\n})();`)
}

function createDocument(locale, links) {
  const nodes = new Map()
  const document = {
    activeElement: null,
    documentElement: { dataset: { locale } },
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, new Element(id, document))
      return nodes.get(id)
    },
    querySelector(selector) {
      if (selector === '.hero-meta') return { prepend() {} }
      return selector.startsWith('#') ? document.getElementById(selector.slice(1)) : null
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
  return locales.map((locale) => {
    const link = { dataset: {}, href: `maps${locale === 'en' ? '' : `.${locale}`}.html` }
    link.getAttribute = (name) =>
      name === 'hreflang' ? locale : name === 'href' ? link.href : null
    return link
  })
}

function makeLocation(locale, query) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const url = new URL(`https://example.test/catalogue/maps${suffix}.html?${query}`)
  return { href: url.href, pathname: url.pathname, search: url.search, hash: url.hash }
}

function makeHistory(location) {
  return {
    lastUrl: '',
    replaceState(_state, _title, target) {
      const url = new URL(target, location.href)
      this.lastUrl = url.href
      Object.assign(location, {
        href: url.href,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
      })
    },
  }
}

class Element {
  constructor(id, owner) {
    this.id = id
    this.owner = owner
    this.listeners = {}
    this.attributes = {}
    this.dataset = {}
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
    for (const listener of this.listeners[type] || []) listener({ type, target: this, ...event })
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value)
    if (name === 'href') this.href = String(value)
  }

  removeAttribute(name) {
    delete this.attributes[name]
  }

  getAttribute(name) {
    return this.attributes[name] ?? (name === 'href' ? this.href : null)
  }

  focus() {
    this.owner.activeElement = this
  }

  querySelector() {
    return null
  }

  querySelectorAll(selector) {
    if (selector !== '[role="option"]') return []
    return [...this.innerHTML.matchAll(/<div id="(fish-suggestion-[^"]+)"[^>]*role="option"/g)].map(
      ([, id]) => this.owner.getElementById(id),
    )
  }

  scrollIntoView() {}
}

const outputs = await renderFrontendOutputs()
assert(
  Object.values(mapsApi).every((value) => typeof value === 'function'),
  'Map page API must export functions only because createPageRuntime binds every export',
)
checkCounterexample()
for (const locale of locales) {
  const page = await runMapPage(outputs, locale, validQuery(locale))
  checkRuntimeBoot(page.runtime, locale)
  checkCandidateMatrix(page.runtime, locale)
  checkListAndMapFiltering(page.runtime, locale)
  checkWaterMarkControls(page, locale)
  checkNavigationContext(page, locale)
}
await checkInvalidMark(outputs)
console.log(
  'PASS: bundled water-mark filters match ROM-derived fish candidates in all six areas and three locales; lists, map pins, conflict recovery, clear/toggle, URL, locale, and fish-detail returns retain their defined state.',
)
