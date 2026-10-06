import assert from 'node:assert/strict'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import { root, data, render, unescapeHtml } from './shared.mjs'
import { bindSectionIndex as bindFishIndex } from '../../src/pages/fish/section-index.js'
import { bindSectionIndex as bindItemIndex } from '../../src/pages/item/section-index.js'

const baseline = process.argv.includes('--baseline')
const locales = ['', '.ja', '.th']
const failures = []
for (const suffix of locales) {
  for (const [page, name, check] of [
    ['equipment', 'index', checkEquipment],
    ['maps', 'maps', checkMaps],
    ['shops', 'shops', checkShops],
  ]) {
    try {
      check(read(`src/pages/${page}/ui/${name}${suffix}.html`))
    } catch (error) {
      failures.push(`${page}${suffix}: ${error.message}`)
    }
  }
}
assert.equal(failures.length, 0, failures.join('\n'))
if (!baseline) {
  checkRejectionProbes()
  checkIndexControls()
  for (const lang of ['en', 'ja', 'th']) {
    for (const item of data.items) await checkItem(item, lang)
    for (const id of Object.keys(data.fishVisuals)) await checkFish(id, lang)
  }
}
console.log(
  'PASS: all locales keep primary actions before secondary help; 315 items and 73 fish have valid local section indexes. Browser geometry is checked separately.',
)

function read(file) {
  return baseline
    ? execFileSync('git', ['show', `HEAD:${file}`], { cwd: root, encoding: 'utf8' })
    : fs.readFileSync(`${root}/${file}`, 'utf8')
}

function before(html, first, second, label) {
  const a = html.indexOf(first)
  const b = html.indexOf(second)
  assert(a >= 0, `${label}: missing primary ${first}`)
  assert(b >= 0, `${label}: missing secondary ${second}`)
  assert(a < b, `${label}: primary ${first} must precede ${second}`)
}

function once(html, id) {
  assert.equal(
    [...html.matchAll(new RegExp(`id="${id}"`, 'g'))].length,
    1,
    `Duplicate/missing ${id}`,
  )
}

function checkEquipment(html) {
  for (const id of ['fish-picker', 'catalogue-stage', 'category-menu', 'cards', 'category-filter'])
    once(html, id)
  assert.match(html, /class="catalogue-workspace"/)
  assert.match(html, /class="catalogue-tools"/)
  assert.match(html, /class="catalogue-results"/)
  before(html, 'id="fish-picker"', 'id="catalogue-stage"', 'Equipment context')
  before(html, 'id="catalogue-stage"', 'id="category-menu"', 'Equipment context')
  before(html, 'id="category-menu"', 'id="cards"', 'Equipment results')
  const provenance = html.indexOf('class="translation-provenance"')
  const evidence = html.indexOf('research-details')
  if (provenance >= 0)
    assert(
      evidence >= 0 && provenance > evidence,
      'Translation provenance must stay in research details',
    )
}

function checkMaps(html) {
  for (const id of ['map-view', 'pin-details', 'water-icon-key', 'notebook-guide']) once(html, id)
  before(html, 'id="map-view"', 'id="pin-details"', 'Map')
  before(html, 'id="pin-details"', 'id="water-icon-key"', 'Map')
  before(html, 'id="water-icon-key"', 'id="notebook-guide"', 'Map')
  assert.match(html, /class="water-filter-jump" href="#water-icon-key"/)
}

function checkShops(html) {
  const global = html.match(/<section class="filters"[^>]*>([\s\S]*?)<\/section>/)?.[1]
  assert(global, 'Shop primary filters missing')
  assert.doesNotMatch(global, /name="place"/, 'Map presentation must not clutter stock filters')
  const map = html.match(/<section id="location-section"[^>]*>([\s\S]*?)<\/section>/)?.[1]
  assert(map, 'Shop local map missing')
  for (const value of ['outdoor', 'town'])
    assert.match(map, new RegExp(`name="place" value="${value}"`))
  assert.equal([...html.matchAll(/name="place"/g)].length, 2, 'Duplicate shop map controls')
}

function checkIndex(html, label) {
  const index = html.match(/<nav class="page-section-index"[^>]*>([\s\S]*?)<\/nav>/)?.[1]
  assert(index, `${label}: local section index missing`)
  const links = [...index.matchAll(/href="#([^"]+)"/g)].map((match) => unescapeHtml(match[1]))
  assert(links.length > 0, `${label}: empty index`)
  assert.equal(new Set(links).size, links.length, `${label}: duplicate index destinations`)
  for (const id of links) {
    once(html, id)
    before(html, 'class="page-section-index"', `id="${id}"`, label)
  }
  if (html.includes('class="evidence"')) {
    const opening = html.match(/<details\b[^>]*class="evidence"[^>]*>/)?.[0]
    assert(opening, `${label}: technical evidence disclosure missing`)
    assert.doesNotMatch(opening, /\sopen(?:\s|=|>)/, `${label}: evidence should start collapsed`)
    assert.match(
      index,
      /href="#(?:fish|item)-evidence"/,
      `${label}: evidence unreachable from index`,
    )
  }
}

async function checkItem(item, lang) {
  const result = await render(
    'item',
    lang,
    new URLSearchParams({ category: item.category, id: item.id }),
  )
  checkIndex(result.html, `${lang}/${item.category}/${item.id}`)
  before(result.html, 'class="page-section-index"', 'id="item-evidence"', 'Item')
  if (result.html.includes('id="what-to-do"'))
    before(result.html, 'id="what-to-do"', 'id="item-evidence"', 'Item action')
}

async function checkFish(id, lang) {
  const result = await render('fish', lang, new URLSearchParams({ id }))
  checkIndex(result.html, `${lang}/fish/${id}`)
  if (id !== '43') {
    before(result.html, 'id="fish-area-map"', 'id="fish-notebook"', 'Fish location')
    before(result.html, 'id="fish-shopping"', 'id="fish-notebook"', 'Fish setup')
  }
  before(result.html, 'id="fish-notebook"', 'id="fish-evidence"', 'Fish evidence')
}

function checkRejectionProbes() {
  const equipment = read('src/pages/equipment/ui/index.html')
  assert.throws(
    () => checkEquipment(equipment.replace('id="cards"', 'id="category-menu"')),
    /Duplicate/,
  )
  const maps = read('src/pages/maps/ui/maps.html')
  const moved = maps
    .replace(/<section id="water-icon-key"[^>]*><\/section>/, '')
    .replace('id="map-view"', 'id="water-icon-key"></div><div id="map-view"')
  assert.throws(() => checkMaps(moved), /must precede/)
  const dangling = '<nav class="page-section-index"><a href="#missing">Go</a></nav>'
  assert.throws(() => checkIndex(dangling, 'missing anchor probe'), /missing/)
  const shops = read('src/pages/shops/ui/shops.html')
  const misplaced = shops.replace(
    /(<section class="filters"[^>]*>)/,
    '$1<input name="place" value="town">',
  )
  assert.throws(() => checkShops(misplaced), /must not clutter/)
}

function checkIndexControls() {
  for (const bind of [bindFishIndex, bindItemIndex]) {
    let click
    const evidence = { tagName: 'DETAILS', open: false }
    globalThis.document = {
      getElementById: () => ({ tagName: 'SUMMARY', closest: () => evidence }),
    }
    const index = {
      addEventListener: (name, handler) => {
        if (name === 'click') click = handler
      },
    }
    bind({ querySelector: (selector) => (selector === '.page-section-index' ? index : null) })
    assert.equal(typeof click, 'function', 'Section index must open collapsed evidence')
    click({ target: { closest: () => ({ getAttribute: () => '#item-evidence' }) } })
    assert.equal(evidence.open, true)
    evidence.open = false
    click({ target: { closest: () => null } })
    assert.equal(evidence.open, false, 'Non-link clicks must not open evidence')
  }
}
