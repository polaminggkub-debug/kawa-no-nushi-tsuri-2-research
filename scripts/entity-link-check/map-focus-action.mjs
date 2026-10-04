import assert from 'node:assert/strict'
import { bindMapTargets } from '../../src/pages/maps/bind-map-targets.js'
import { bindSearchActions } from '../../src/pages/maps/bind-search-actions.js'

const previousLocation = Object.getOwnPropertyDescriptor(globalThis, 'location')
const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')

try {
  const scenario = makeScenario()
  globalThis.location = scenario.location
  globalThis.window = { addEventListener() {} }
  bindMapTargets(scenario.ctx)
  bindSearchActions(scenario.ctx)
  clickFishFocusTwice(scenario)
  checkFocusIsIdempotent(scenario)
  clickShowAll(scenario)
  checkShowAllClearsTarget(scenario)
} finally {
  restoreGlobal('location', previousLocation)
  restoreGlobal('window', previousWindow)
}

console.log('PASS: repeated fish focus keeps its target; Show all clears the target and search.')

function makeScenario() {
  const listeners = new Map()
  const nodes = new Map()
  const fishList = makeNode('fish-list', listeners, nodes)
  const scenario = {
    listeners,
    location: {
      pathname: '/publication/catalogue/maps.th.html',
      search: '?stage=2&fish=15',
      hash: '',
    },
    focusCalls: [],
    renderCalls: 0,
    ctx: {
      lang: 'th',
      activeStage: 2,
      activeSection: 's2-c1-r1',
      selectedFish: '15',
      returnPath: '',
      areaList: makeNode('area-list', listeners, nodes),
      fishList,
      suggestionList: makeNode('suggestion-list', listeners, nodes),
      searchInput: { value: 'อิวานะ' },
      searchTerm: 'อิวานะ',
      c: { tackle: 'ดูอุปกรณ์' },
      $: (name) => makeNode(name, listeners, nodes),
      sourceReturn: () => 'maps.th.html?stage=2#map-view',
      idNorm: (value) => value,
      updateLanguageLinks() {},
      closeSuggestions() {},
      chooseSection: () => 's2-c1-r1',
      setFish(...args) {
        scenario.focusCalls.push(args)
      },
      render() {
        scenario.renderCalls += 1
      },
      showPinDetails() {},
    },
  }
  return scenario
}

function makeNode(name, listeners, nodes) {
  if (!nodes.has(name)) {
    nodes.set(name, {
      addEventListener: (event, callback) => listeners.set(`${name}:${event}`, callback),
      setAttribute() {},
    })
  }
  return nodes.get(name)
}

function clickFishFocusTwice({ listeners }) {
  const handler = listeners.get('fish-list:click')
  assert.equal(typeof handler, 'function', 'fish-list click handler was not registered')
  const button = { dataset: { fish: '15' } }
  const event = { target: { closest: (selector) => (selector === '[data-fish]' ? button : null) } }
  handler(event)
  handler(event)
}

function checkFocusIsIdempotent({ focusCalls }) {
  assert.deepEqual(
    focusCalls,
    [
      ['15', { toggle: false }],
      ['15', { toggle: false }],
    ],
    'repeating the Focus on map action must keep the same fish selected',
  )
}

function clickShowAll({ listeners }) {
  const handler = listeners.get('show-all:click')
  assert.equal(typeof handler, 'function', 'Show all click handler was not registered')
  handler()
}

function checkShowAllClearsTarget({ ctx, renderCalls }) {
  assert.equal(ctx.selectedFish, '')
  assert.equal(ctx.searchInput.value, '')
  assert.equal(ctx.searchTerm, '')
  assert.equal(renderCalls, 1, 'Show all should rerender the unfiltered map')
}

function restoreGlobal(name, descriptor) {
  if (descriptor) Object.defineProperty(globalThis, name, descriptor)
  else delete globalThis[name]
}
