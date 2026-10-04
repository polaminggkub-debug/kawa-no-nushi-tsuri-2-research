import assert from 'node:assert/strict'
import { bindMapTargets } from '../../src/pages/maps/bind-map-targets.js'

const locales = ['en', 'th', 'ja']
const returnModes = [
  { name: 'empty hash', hash: '', openNotebookGuide: false, expectedHash: '#map-view' },
  {
    name: 'map hash',
    hash: '#map-view',
    openNotebookGuide: false,
    expectedHash: '#map-view',
  },
  {
    name: 'notebook guide',
    hash: '',
    openNotebookGuide: true,
    expectedHash: '#notebook-guide',
  },
]

const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')
const previousLocation = Object.getOwnPropertyDescriptor(globalThis, 'location')

try {
  for (const locale of locales) for (const mode of returnModes) checkFishReturn(locale, mode)
} finally {
  restoreGlobal('document', previousDocument)
  restoreGlobal('location', previousLocation)
}

console.log(
  'PASS: map fish-detail returns preserve stage, section, fish and nested return in EN/TH/JA; map and notebook anchors remain distinct.',
)

function checkFishReturn(locale, mode) {
  const scenario = makeScenario(locale, mode)
  checkSourceReturn(scenario)
  checkFishDetailReturn(scenario, mode)
}

function makeScenario(locale, mode) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const mapPage = `maps${suffix}.html`
  const nestedReturn =
    `fish${suffix}.html?id=06&stage=2&return=` +
    encodeURIComponent(`maps${suffix}.html?stage=2&section=s2-c1-r1&fish=06#map-view`)
  const search = `?stage=4&section=s4-c2-r2&fish=15&return=${encodeURIComponent(nestedReturn)}`
  const currentLocation = {
    pathname: `/project/catalogue/${mapPage}`,
    search,
    hash: mode.hash,
  }
  const nodes = new Map()
  const heroMeta = {
    prepended: [],
    prepend(node) {
      this.prepended.push(node)
    },
  }
  const document = {
    createElement(tag) {
      return { tagName: tag.toUpperCase(), className: '', href: '', textContent: '' }
    },
    querySelector(selector) {
      return selector === '.hero-meta' ? heroMeta : null
    },
  }
  const node = (name) => {
    if (!nodes.has(name)) nodes.set(name, { addEventListener() {} })
    return nodes.get(name)
  }
  const ctx = {
    lang: locale,
    activeStage: 4,
    openNotebookGuide: mode.openNotebookGuide,
    returnPath: nestedReturn,
    selectedFish: '15',
    areaList: node('area-list'),
    fishList: node('fish-list'),
    $: (name) => node(name),
    chooseSection() {},
    render() {},
    setFish() {},
    showPinDetails() {},
  }
  globalThis.document = document
  globalThis.location = currentLocation
  bindMapTargets(ctx)
  return { ctx, locale, mode, mapPage, nestedReturn, search, heroMeta }
}

function checkSourceReturn({ ctx, locale, mode, mapPage, nestedReturn, search, heroMeta }) {
  const expectedSourceReturn =
    `${mapPage}${search}` +
    (mode.openNotebookGuide ? '#notebook-guide' : mode.hash === '#map-view' ? '#map-view' : '')
  assert.equal(
    ctx.sourceReturn(),
    expectedSourceReturn,
    `${locale}: sourceReturn changed for ${mode.name}`,
  )
  assert.equal(heroMeta.prepended[0]?.href, nestedReturn, `${locale}: incoming back link changed`)
}

function checkFishDetailReturn({ ctx, locale, mode, mapPage, search, nestedReturn }) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const fishUrl = new URL(ctx.fishHref('15'), 'https://example.test/project/catalogue/')
  assert.equal(fishUrl.pathname, `/project/catalogue/fish${suffix}.html`)
  assert.equal(fishUrl.searchParams.get('id'), '15')
  assert.equal(fishUrl.searchParams.get('stage'), '4')

  const returnPath = fishUrl.searchParams.get('return')
  const expectedReturn = `${mapPage}${search}${mode.expectedHash}`
  assert.equal(returnPath, expectedReturn, `${locale}: wrong return anchor for ${mode.name}`)
  assertReturnedMapState(returnPath, locale, mapPage, mode.expectedHash, nestedReturn)
}

function assertReturnedMapState(returnPath, locale, mapPage, expectedHash, nestedReturn) {
  const mapUrl = new URL(returnPath, 'https://example.test/project/catalogue/')
  assert.equal(mapUrl.pathname, `/project/catalogue/${mapPage}`)
  assert.equal(mapUrl.hash, expectedHash)
  assert.equal(mapUrl.searchParams.get('stage'), '4')
  assert.equal(mapUrl.searchParams.get('section'), 's4-c2-r2')
  assert.equal(mapUrl.searchParams.get('fish'), '15')
  assert.equal(mapUrl.searchParams.get('return'), nestedReturn, `${locale}: nested return changed`)
}

function restoreGlobal(name, descriptor) {
  if (descriptor) Object.defineProperty(globalThis, name, descriptor)
  else delete globalThis[name]
}
