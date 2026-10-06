import assert from 'node:assert/strict'
import { data, locations, renderCatalogue, unescapeHtml } from './shared.mjs'
import {
  syncCatalogueStage,
  bindCatalogueStage,
} from '../../src/pages/equipment/catalogue-stage.js'

for (const lang of ['en', 'ja', 'th']) {
  for (const fish of ['', ...Object.keys(data.fishVisuals)]) checkStageOptions(lang, fish)
  checkStageChange(lang)
  await checkRenderedStageChange(lang)
  for (const anchor of ['catalogue', 'cards', 'fish-location-panel'])
    await checkInitialAnchor(lang, anchor)
}
console.log(
  'PASS: catalogue area control offers only recorded fish areas, preserves all-area browsing, changes the shared purchase/map context, and restores supported anchors after data loads.',
)

function setup(lang, fish) {
  const stages = (locations.fish[fish]?.locations || []).map((entry) => String(entry.stage))
  const select = {
    value: '',
    innerHTML: '',
    disabled: true,
    addEventListener(name, handler) {
      this[name] = handler
    },
  }
  const note = { textContent: '' }
  globalThis.document = { getElementById: (id) => (id === 'catalogue-stage' ? select : note) }
  const ctx = {
    lang,
    fishLocations: locations.fish,
    locationStage: stages[0] || '',
    locationMapIndex: 3,
    esc: (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;'),
    local: (value) => value?.[lang] || value?.en || '',
    renderCards() {
      this.renders = (this.renders || 0) + 1
    },
  }
  return { ctx, select, note, stages }
}

function checkStageOptions(lang, fish) {
  const { ctx, select, note, stages } = setup(lang, fish)
  syncCatalogueStage(ctx, fish)
  const options = [...select.innerHTML.matchAll(/<option value="([^"]*)">([^<]+)<\/option>/g)]
  const expected = fish ? [...new Set(stages)] : ['', '1', '2', '3', '4', '5', '6']
  assert.deepEqual(
    options.map((match) => match[1]),
    expected,
    `${lang}/${fish}: area choices`,
  )
  assert.equal(select.value, ctx.locationStage)
  assert.equal(select.disabled, false)
  for (const match of options) assert(unescapeHtml(match[2]).trim(), 'Area choice lost label')
  if (fish) assert(note.textContent.length > 0, 'Fish-only area scope unexplained')
  else assert.equal(note.textContent, '', 'No-fish view must not claim restricted fish areas')
}

function checkStageChange(lang) {
  const { ctx, select } = setup(lang, '0D')
  bindCatalogueStage(ctx)
  assert.equal(typeof select.change, 'function')
  select.change({ target: { value: '4' } })
  assert.equal(ctx.locationStage, '4')
  assert.equal(ctx.locationMapIndex, 0)
  assert.equal(ctx.renders, 1)
}

async function checkRenderedStageChange(lang) {
  const source =
    '?category=rod&stage=1&sort=buy-price&return=maps.html%3Fstage%3D1%23map-view#cards'
  const { nodes, runtime, url } = await renderCatalogue(lang, source, false, true)
  const control = nodes['catalogue-stage']
  assert.equal(
    typeof control.listeners.change,
    'function',
    'Area control not bound in generated runtime',
  )
  const before = nodes.cards.innerHTML
  control.value = '4'
  control.listeners.change({ target: control })
  assert.equal(runtime.locationStage, '4')
  assert.equal(control.value, '4')
  assert.equal(url.searchParams.get('stage'), '4')
  assert.equal(url.searchParams.get('sort'), 'buy-price')
  assert.equal(url.searchParams.get('category'), 'rod')
  assert.equal(url.searchParams.get('return'), 'maps.html?stage=1#map-view')
  assert.equal(url.hash, '#cards')
  assert.notEqual(nodes.cards.innerHTML, before, 'Area control did not refresh purchase cards')
}

async function checkInitialAnchor(lang, anchor) {
  const query = `?category=bait&fish=06&stage=1#${anchor}`
  const loaded = await renderCatalogue(lang, query)
  assert(loaded.nodes.cards.innerHTML.includes('<article'), `${lang}/${anchor}: cards not ready`)
  assert.equal(
    loaded.nodes[anchor]?.scrolled,
    true,
    `${lang}/${anchor}: post-render anchor not restored`,
  )
  const pending = await renderCatalogue(lang, query, true)
  assert.notEqual(
    pending.nodes[anchor]?.scrolled,
    true,
    `${lang}/${anchor}: must not restore before data loads`,
  )
}
