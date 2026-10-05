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
  const route = html.match(
    /<details class="notebook-full-route"[^>]*>[\s\S]*?<\/details><details class="notebook-new"/,
  )?.[0]
  assert(route, `${lang} Area ${activeStage}: missing full route before local checklist`)
  assert.match(route, /data-notebook-route-total="66"/)
  const groups = [
    ...route.matchAll(
      /<details id="notebook-route-(\d)" class="notebook-route-group" data-notebook-route-stage="\d" data-route-count="(\d+)"([^>]*)>([\s\S]*?)<\/details>/g,
    ),
  ]
  assert.equal(groups.length, 6, `${lang}: route must show six first-occurrence groups`)
  const found = []
  for (const [, stageText, count, attributes, body] of groups) {
    const stage = Number(stageText)
    const expected = guide.stages[stage - 1].firstOccurrenceSpecies
    const cards = [
      ...body.matchAll(
        /<article class="notebook-fish notebook-route-fish" data-notebook-card="([0-9A-F]{2})">([\s\S]*?)<\/article>/g,
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
  assert.deepEqual(
    found.sort(),
    expectedIds,
    `${lang}: route must contain every eligible ROM fish exactly once`,
  )
  validate(html, origin)
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
      assert.equal(target.searchParams.get('category'), 'all')
      assert.equal(target.hash, '#fish-location-panel')
    }
    validate(`<a href="${unescapeHtml(raw)}"></a>`, origin)
    linksChecked += 1
  }
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
}

function createProgressDom(ids) {
  const checks = []
  const cards = ids.map((id) => ({
    dataset: { notebookCard: id },
    classList: { toggle() {} },
    append(label) {
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
  return { mount, checks, document: createProgressDocument(cards) }
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
        setAttribute() {},
        matches(selector) {
          return selector === '[data-notebook-mark]' && this.type === 'checkbox'
        },
        closest: () => cards[0],
      }
    },
    createTextNode: () => ({ type: 'text' }),
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
