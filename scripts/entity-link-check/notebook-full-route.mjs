import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { notebookGuideMarkup } from '../../src/pages/maps/notebook-guide.js'
import { bindNotebookProgress } from '../../src/pages/maps/notebook-progress.js'
import { data, locations, unescapeHtml, validate } from './shared.mjs'

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
const guide = data.notebookCompletion
const expectedGroups = [6, 10, 11, 17, 11, 11]
const expectedIds = Array.from({ length: 66 }, (_, i) =>
  (i + 1).toString(16).toUpperCase().padStart(2, '0'),
)
let linksChecked = 0

assert.equal(guide.totals.notebookEligibleSpecies, 66)
for (const lang of ['en', 'ja', 'th']) {
  for (let activeStage = 1; activeStage <= 6; activeStage += 1) checkRoute(lang, activeStage)
}
checkSharedProgress()
checkRouteAnchors()
console.log(
  `PASS: full notebook route covers 66 fish once, six first-area groups, three locales, direct actions, return context, and shared ticks (${linksChecked} links).`,
)

function checkRoute(lang, activeStage) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const nested = `item${suffix}.html?category=general_tool&id=05&stage=2`
  const source = `maps${suffix}.html?stage=${activeStage}&section=s${activeStage}-c2-r3&fish=06&mark=large&q=river&scope=all&return=${encodeURIComponent(nested)}#map-view`
  const origin = new URL(`https://example.test/catalogue/maps${suffix}.html`)
  const html = notebookGuideMarkup(makeContext(lang, activeStage, source))
  const route = detailsBlock(html, 'notebook-full-route')
  assert(
    !html.includes('class="notebook-new"'),
    `${lang} Area ${activeStage}: duplicated new-fish list`,
  )
  assert(
    detailsOpens(route),
    `${lang} Area ${activeStage}: explicit route link must open the master list`,
  )
  assert.match(route, /data-notebook-route-total="66"/)
  const groups = [
    ...route.matchAll(
      /<details id="notebook-route-(\d)" class="notebook-route-group" data-notebook-route-stage="\d" data-route-count="(\d+)"([^>]*)>([\s\S]*?)<\/details>/g,
    ),
  ]
  assert.equal(groups.length, 6, `${lang}: route must show six first-occurrence groups`)
  const found = checkRouteGroups(groups, lang, activeStage, source, origin, suffix)
  assert.deepEqual(
    found.sort(),
    expectedIds,
    `${lang}: route must contain every eligible ROM fish exactly once`,
  )
  validate(html, origin)
}

function checkRouteGroups(groups, lang, activeStage, source, origin, suffix) {
  const found = []
  for (const [, stageText, count, attributes, body] of groups) {
    const stage = Number(stageText)
    const expected = guide.stages[stage - 1].firstOccurrenceSpecies
    const cards = [
      ...body.matchAll(
        /<article\b(?=[^>]*class="notebook-fish notebook-route-fish")(?=[^>]*data-notebook-card="([0-9A-F]{2})")[^>]*>([\s\S]*?)<\/article>/g,
      ),
    ]
    const ids = cards.map(([, id]) => id)
    assert.equal(Number(count), expectedGroups[stage - 1])
    assert.deepEqual(
      ids,
      expected,
      `${lang} Area ${stage}: route fish order/set differs from ROM-backed first occurrences`,
    )
    assert.equal(
      attributes.includes(' open'),
      stage === activeStage,
      `${lang}: wrong open route group for selected hash`,
    )
    for (const [, id, card] of cards) checkFishActions(card, id, stage, source, origin, suffix)
    found.push(...ids)
  }
  return found
}

function checkFishActions(card, id, stage, source, origin, suffix) {
  const links = [
    ...card.matchAll(/<a[^>]*data-notebook-action="(details|map|equipment)"[^>]*href="([^"]+)"/g),
  ]
  assert.equal(links.length, 3, `${id}: expected detail, map, and equipment actions`)
  const returnPath = `${source.split('#')[0]}#notebook-route-${stage}`
  const where = locations.fish[id]?.locations.find((entry) => entry.stage === stage)
  assert(where?.points?.length, `${id}: missing first-area ROM location for Area ${stage}`)
  for (const [, action, raw] of links) {
    const target = new URL(unescapeHtml(raw), origin)
    const page = action === 'details' ? 'fish' : action === 'map' ? 'maps' : 'index'
    assert(target.pathname.endsWith(`/${page}${suffix}.html`), `${id}: wrong ${action} page`)
    assert.equal(target.searchParams.get(action === 'details' ? 'id' : 'fish'), id)
    assert.equal(target.searchParams.get('stage'), String(stage))
    assert.equal(
      target.searchParams.get('return'),
      returnPath,
      `${id}: ${action} loses original map context`,
    )
    if (action === 'map') assert.equal(target.hash, '#map-view')
    if (action === 'equipment') {
      assert.equal(target.searchParams.has('category'), false)
      assert.equal(target.hash, '#fish-location-panel')
    }
    validate(`<a href="${unescapeHtml(raw)}"></a>`, origin)
    linksChecked += 1
  }
}

function detailsBlock(html, className) {
  const start = html.indexOf(`<details class="${className}"`)
  assert(start >= 0, `Missing ${className} details`)
  let depth = 0
  for (const match of html.slice(start).matchAll(/<\/?details\b[^>]*>/g)) {
    depth += match[0].startsWith('</') ? -1 : 1
    if (depth === 0) return html.slice(start, start + match.index + match[0].length)
  }
  throw new Error(`Unclosed ${className} details`)
}

function detailsOpens(html) {
  return /^<details\b[^>]*\sopen(?:\s|>)/.test(html)
}

function makeContext(lang, activeStage, source) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const nameField = lang === 'en' ? 'nameLatin' : lang === 'ja' ? 'nameJa' : 'nameTh'
  return {
    lang,
    activeStage,
    notebookRouteStage: activeStage,
    notebookCompletion: guide,
    species: Object.fromEntries(
      Object.entries(data.fishVisuals).map(([id, visual]) => [
        id,
        { name: visual[nameField] || id, visual },
      ]),
    ),
    sourceReturn: () => source,
    returnPath: source,
    fishHref: () => '',
    c: { area: (stage) => `${stage}` },
    esc: (value) =>
      String(value ?? '').replace(
        /[&<>"']/g,
        (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
      ),
    suffix,
  }
}

function checkSharedProgress() {
  const storage = new Map([['kawa-notebook-manual-v1', JSON.stringify(['01'])]])
  const controls = createProgressDom(['01', '01', '02'])
  globalThis.document = controls.document
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
    },
  }
  const ctx = {
    lang: 'en',
    species: { '01': { name: 'Fish 1' }, '02': { name: 'Fish 2' } },
    notebookCompletion: guide,
    esc: String,
  }
  bindNotebookProgress(ctx, controls.mount)
  assert.deepEqual(
    controls.checks.map((input) => input.checked),
    [true, true, false],
  )
  controls.checks[0].checked = false
  controls.mount.onchange({ target: controls.checks[0] })
  assert.deepEqual(
    controls.checks.map((input) => input.checked),
    [false, false, false],
  )
  controls.checks[2].checked = true
  controls.mount.onchange({ target: controls.checks[2] })
  assert.deepEqual(
    controls.checks.map((input) => input.checked),
    [false, false, true],
  )
  assert.equal(storage.get('kawa-notebook-manual-v1'), '["02"]')
  delete globalThis.document
  delete globalThis.window
  checkLocalizedMarkLabels()
}

function checkLocalizedMarkLabels() {
  const copy = [
    ['en', 'Recorded', 'Checked in my game journal'],
    ['ja', '記録済み', 'ゲーム内図鑑で確認済み'],
    ['th', 'บันทึกแล้ว', 'เช็กแล้วว่ามีในสมุดเกม'],
  ]
  for (const [lang, visible, accessible] of copy) checkMarkLabel(lang, visible, accessible)
}

function checkMarkLabel(lang, visible, accessible) {
  const controls = createProgressDom(['01'])
  globalThis.document = controls.document
  globalThis.window = { localStorage: { getItem: () => null, setItem() {} } }
  bindNotebookProgress(
    { lang, species: { '01': { name: 'Fish 1' } }, notebookCompletion: guide, esc: String },
    controls.mount,
  )
  assert.equal(controls.labels[0].children[1].textContent.trim(), visible)
  assert.equal(controls.checks[0].attributes['aria-label'], `${accessible}: Fish 1`)
  delete globalThis.document
  delete globalThis.window
}

function createProgressDom(ids) {
  const checks = []
  const labels = []
  const cards = ids.map((id) => ({
    dataset: { notebookCard: id },
    classList: { toggle() {} },
    append(label) {
      labels.push(label)
      checks.push(label.children.find((node) => node.type === 'checkbox'))
    },
  }))
  const lists = [{ querySelector: () => checks[0], querySelectorAll: () => checks, after() {} }]
  const manual = { append() {} }
  const count = { textContent: '' }
  const warning = { textContent: '' }
  const remaining = { checked: false }
  const mount = {
    querySelector: (selector) =>
      ({
        '.notebook-manual': manual,
        '.notebook-manual-count': count,
        '[data-notebook-remaining]': remaining,
        '.notebook-manual-warning': warning,
      })[selector] || null,
    querySelectorAll: (selector) =>
      selector === '[data-notebook-card]'
        ? cards
        : selector === '[data-notebook-mark]'
          ? checks
          : selector === '.notebook-fish-list'
            ? lists
            : [],
  }
  return { mount, checks, labels, document: createProgressDocument(cards) }
}

function createProgressDocument(cards) {
  return {
    createElement(tag) {
      return {
        tag,
        dataset: {},
        children: [],
        classList: { contains: () => false },
        append(...children) {
          this.children.push(...children)
        },
        attributes: {},
        setAttribute(key, value) {
          this.attributes[key] = value
        },
        matches(selector) {
          return selector === '[data-notebook-mark]' && this.type === 'checkbox'
        },
        closest: () => cards[0],
      }
    },
    createTextNode: (textContent) => ({ type: 'text', textContent }),
  }
}

function checkRouteAnchors() {
  const mapSource = fs.readFileSync(path.join(root, 'src/pages/maps/map-render.js'), 'utf8')
  const loadSource = fs.readFileSync(path.join(root, 'src/pages/maps/load-maps.js'), 'utf8')
  const searchSource = fs.readFileSync(path.join(root, 'src/pages/maps/fish-search.js'), 'utf8')
  assert.match(mapSource, /location\.hash\.match\(\/\^#notebook-route-\(\[1-6\]\)\$\//)
  assert.match(
    mapSource,
    /ctx\.openNotebookGuide = location\.hash === '#notebook-guide' \|\| Boolean\(ctx\.notebookRouteStage\)/,
  )
  assert.match(
    loadSource,
    /ctx\.\$\(`notebook-route-\$\{ctx\.notebookRouteStage\}`\)\?\.scrollIntoView/,
  )
  assert.match(searchSource, /#notebook-route-\[1-6\]/)
  assert.match(searchSource, /notebookRouteStage\s*\?/)
}
