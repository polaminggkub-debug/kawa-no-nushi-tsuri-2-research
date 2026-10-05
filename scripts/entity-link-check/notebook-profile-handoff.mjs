import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  initializeNotebookFocus,
  scrollToNotebookSpecies,
} from '../../src/pages/maps/notebook-focus.js'
import { notebookGuideMarkup } from '../../src/pages/maps/notebook-guide.js'
import { bindNotebookProgress } from '../../src/pages/maps/notebook-progress.js'
import { data, render, root, unescapeHtml } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const guide = data.notebookCompletion
const eligible = Object.entries(guide.species)
  .filter(([, entry]) => entry.notebookEligible === true)
  .sort(([a], [b]) => Number.parseInt(a, 16) - Number.parseInt(b, 16))
const excluded = ['44', '45', '46', '47', '48', '49', '43']

assert.equal(eligible.length, 66)
await checkProfileLink('en', ...eligible[0])
for (const locale of locales) {
  for (const [id, entry] of eligible) await checkProfileLink(locale, id, entry)
  for (const id of excluded) await checkNoProfileLink(locale, id)
}
await checkInvalidProfileStage()
checkInvalidFocusHashes()
checkCheckboxAwareScroll()
console.log(
  'PASS: all 66 eligible fish profiles link to their unique first-occurrence checklist card in EN/JA/TH; excluded and unknown profiles have no checklist action.',
)

async function checkProfileLink(locale, id, entry) {
  const stages = (entry.stages || []).map(Number).filter((stage) => stage >= 1 && stage <= 6)
  const currentStage = stages.at(-1) || Number(entry.firstOccurrenceStage)
  const nested = `maps${suffix(locale)}.html?stage=${currentStage}&section=s${currentStage}-c1-r1&fish=${id}&route=lure#map-view`
  const query = new URLSearchParams({
    id,
    stage: String(currentStage),
    route: 'lure',
    return: nested,
  })
  const page = await render('fish', locale, query)
  const href = page.html.match(
    /<a\b(?=[^>]*data-fish-notebook-checklist\b)[^>]*href="([^"]+)"/,
  )?.[1]
  assert(href, `${locale}/${id}: eligible profile needs a direct checklist action`)
  const target = new URL(unescapeHtml(href), page.url)
  assert(target.pathname.endsWith(`/maps${suffix(locale)}.html`))
  assert.equal(target.searchParams.get('stage'), String(currentStage))
  assert.equal(target.searchParams.get('fish'), id)
  assert.equal(target.searchParams.get('route'), 'lure')
  assert.equal(target.hash, `#notebook-species-${id}`)
  checkProfileReturn(target, page, id, currentStage, nested)
  checkMapFocus(locale, id, currentStage, entry)
}

function checkProfileReturn(target, page, id, stage, nested) {
  const returned = new URL(target.searchParams.get('return'), page.url)
  assert.equal(
    returned.pathname,
    page.url.pathname,
    `${id}: return must reopen this localized fish profile`,
  )
  assert.equal(returned.searchParams.get('id'), id)
  assert.equal(returned.searchParams.get('stage'), String(stage))
  assert.equal(returned.searchParams.get('route'), 'lure')
  assert.equal(returned.searchParams.get('return'), nested, `${id}: nested map return was lost`)
}

function checkMapFocus(locale, id, activeStage, entry) {
  const firstStage = Number(entry.firstOccurrenceStage)
  const ctx = guideContext(locale, activeStage, id)
  initializeNotebookFocus(ctx, `#notebook-species-${id}`)
  assert.equal(ctx.notebookSpecies, id)
  assert.equal(ctx.notebookRouteStage, firstStage)
  assert.equal(ctx.openNotebookGuide, true)
  assert.equal(ctx.activeStage, activeStage, `${id}: focus changed the selected map area`)
  const html = notebookGuideMarkup(ctx)
  const card = checkFocusedRouteCard(html, locale, id, firstStage, activeStage)
  const mapHref = card.match(/<a data-notebook-action="map" href="([^"]+)"/)?.[1]
  assert(mapHref, `${locale}/${id}: focused species map action missing`)
  const map = new URL(
    unescapeHtml(mapHref),
    `https://example.test/catalogue/maps${suffix(locale)}.html`,
  )
  assert.equal(
    map.searchParams.get('stage'),
    String(activeStage),
    `${id}: map action lost current area`,
  )
  assert.equal(map.searchParams.get('fish'), id)
  assert.equal(map.searchParams.get('route'), 'lure')
  const returned = new URL(map.searchParams.get('return'), map)
  assert.equal(returned.searchParams.get('stage'), String(activeStage))
  assert.equal(returned.searchParams.get('fish'), id)
  assert.equal(returned.searchParams.get('route'), 'lure')
  assert.equal(returned.hash, `#notebook-species-${id}`)
}

function checkFocusedRouteCard(html, locale, id, firstStage, activeStage) {
  const card = new RegExp(
    `<article\\b(?=[^>]*id="notebook-species-${id}")[^>]*>[\\s\\S]*?<\\/article>`,
  ).exec(html)?.[0]
  assert(card, `${locale}/${id}: expected one unique full-route card anchor`)
  assert(
    card.includes('data-notebook-focused'),
    `${locale}/${id}: focused card needs a visible marker`,
  )
  const locationContext = {
    en: `Filed under Area ${firstStage} to avoid duplicates · Selected fishing area: ${activeStage}`,
    ja: `重複しないようエリア${firstStage}に掲載 · 選択中の釣り場：エリア${activeStage}`,
    th: `จัดไว้ในด่าน ${firstStage} เพื่อไม่นับซ้ำ · จุดตกที่เลือก: ด่าน ${activeStage}`,
  }[locale]
  assert(
    card.includes(locationContext),
    `${locale}/${id}: distinguish filing area from selected area`,
  )
  assert.equal(
    (html.match(new RegExp(`id="notebook-species-${id}"`, 'g')) || []).length,
    1,
    `${locale}/${id}: checklist anchor must be unique`,
  )
  const group = html.match(
    new RegExp(`<details id="notebook-route-${firstStage}"[^>]* open[^>]*>[\\s\\S]*?</details>`),
  )?.[0]
  assert(
    group?.includes(`id="notebook-species-${id}"`),
    `${locale}/${id}: first-occurrence route group must open around the target`,
  )
  return card
}

async function checkNoProfileLink(locale, id) {
  const page = await render('fish', locale, new URLSearchParams({ id, stage: '2', route: 'lure' }))
  assert.doesNotMatch(page.html, /data-fish-notebook-checklist/)
  assert.doesNotMatch(page.html, new RegExp(`#notebook-species-${id}`))
}

async function checkInvalidProfileStage() {
  const [id, entry] = eligible[0]
  for (const locale of locales) {
    const page = await render(
      'fish',
      locale,
      new URLSearchParams({ id, stage: '99', route: 'lure', return: 'maps.html?stage=2#map-view' }),
    )
    const href = page.html.match(
      /<a\b(?=[^>]*data-fish-notebook-checklist\b)[^>]*href="([^"]+)"/,
    )?.[1]
    assert(href, `${locale}/${id}: missing fallback checklist action`)
    const target = new URL(unescapeHtml(href), page.url)
    assert.equal(target.searchParams.get('stage'), String(entry.firstOccurrenceStage))
    assert.equal(target.searchParams.get('fish'), id)
    assert.equal(target.searchParams.get('route'), 'lure')
  }
}

function checkInvalidFocusHashes() {
  for (const id of ['43', '44', 'FF']) {
    const ctx = guideContext('en', 3)
    initializeNotebookFocus(ctx, `#notebook-species-${id}`)
    assert.equal(ctx.notebookSpecies, '')
    assert.equal(ctx.notebookRouteStage, 0)
    assert.equal(ctx.openNotebookGuide, false)
  }
  const malformed = guideContext('en', 3)
  initializeNotebookFocus(malformed, '#notebook-species-nope')
  assert.equal(malformed.notebookSpecies, '')
}

function checkCheckboxAwareScroll() {
  const id = eligible[0][0]
  const storage = new Map([['kawa-notebook-manual-v1', JSON.stringify([id])]])
  const first = progressHarness()
  withProgressGlobals(storage, () => bindNotebookProgress(progressContext(), first.mount))
  const focus = guideContext('en', 3, id)
  initializeNotebookFocus(focus, `#notebook-species-${id}`)
  const second = progressHarness(true)
  checkFocusedHandoff(storage, id, focus, second)
  checkManualFilter(storage, id, focus, first, second)
  checkScrollOrder()
}

function checkFocusedHandoff(storage, id, focus, second) {
  withProgressGlobals(storage, () => bindNotebookProgress(focus, second.mount))
  assert.equal(
    second.remaining.checked,
    false,
    'Explicit handoff should reveal a marked target once',
  )
  assert.equal(second.cards[0].input.checked, true, 'Handoff must preserve the manual mark')
  assert.equal(second.cards[0].hidden, false, 'A marked target must be visible after handoff')
  assert.equal(second.count.textContent, 'Marked by you: 1/66 species')
  assert.equal(storage.get('kawa-notebook-manual-v1'), JSON.stringify([id]))
  assert.equal(
    focus.notebookFocusNeedsReveal,
    false,
    'Checklist binder should consume one-time reveal',
  )
  let scrolled = ''
  focus.$ = (key) =>
    key === `notebook-species-${id}` ? { scrollIntoView: () => (scrolled = key) } : null
  assert.equal(scrollToNotebookSpecies(focus), true)
  assert.equal(
    scrolled,
    `notebook-species-${id}`,
    'Scroll must target the exact card after checkbox binding',
  )
}

function checkManualFilter(storage, id, focus, first, second) {
  first.remaining.checked = true
  first.mount.onchange({ target: first.remaining })
  assert.equal(first.cards[0].hidden, true, 'User filter should hide an already-marked fish')
  second.remaining.checked = true
  second.mount.onchange({ target: second.remaining })
  assert.equal(focus.notebookSpecies, '', 'Manual filter change should clear transient focus')
  assert.equal(
    second.focusMarker.present,
    false,
    'Manual filter should clear the focused card marker',
  )
  assert.equal(
    second.cards[0].hidden,
    true,
    'Later remaining-only filter should hide marked target normally',
  )
  assert.equal(
    storage.get('kawa-notebook-manual-v1'),
    JSON.stringify([id]),
    'Focus must not change marks',
  )
}

function checkScrollOrder() {
  const source = fs.readFileSync(path.join(root, 'src/pages/maps/load-maps.js'), 'utf8')
  assert(
    source.indexOf('ctx.render()') < source.indexOf('scrollToNotebookSpecies(ctx)'),
    'Scroll must follow rendering and checkbox binding',
  )
}

function progressContext() {
  return {
    lang: 'en',
    species: Object.fromEntries(eligible.map(([id]) => [id, { name: `Fish ${id}` }])),
    notebookCompletion: guide,
    esc: String,
  }
}

function progressHarness(focused = false) {
  const cards = eligible.map(([id]) => ({
    dataset: { notebookCard: id },
    hidden: false,
    classList: { toggle() {} },
    append(label) {
      this.input = label.children[0]
      this.input.card = this
    },
  }))
  const checks = () => cards.map((card) => card.input)
  const count = { textContent: '' },
    warning = { textContent: '' },
    remaining = { checked: false, matches: (selector) => selector === '[data-notebook-remaining]' }
  const manual = { append() {} }
  const focusMarker = {
    present: focused,
    removeAttribute(name) {
      if (name === 'data-notebook-focused') this.present = false
    },
  }
  const mount = {
    querySelector: (selector) =>
      ({
        '.notebook-manual': manual,
        '.notebook-manual-count': count,
        '.notebook-manual-warning': warning,
        '[data-notebook-remaining]': remaining,
        '[data-notebook-focused]': focusMarker.present ? focusMarker : null,
      })[selector],
    querySelectorAll: (selector) =>
      selector === '[data-notebook-card]'
        ? cards
        : selector === '[data-notebook-mark]'
          ? checks()
          : [],
  }
  return { mount, cards, count, remaining, focusMarker }
}

function withProgressGlobals(storage, run) {
  const previous = { document: globalThis.document, window: globalThis.window }
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
    },
  }
  globalThis.document = {
    createElement: (tag) => ({
      type: tag === 'input' ? 'checkbox' : '',
      dataset: {},
      children: [],
      append(...nodes) {
        this.children.push(...nodes)
      },
      setAttribute() {},
      matches(selector) {
        return selector === '[data-notebook-mark]' && Boolean(this.dataset.notebookMark)
      },
      closest() {
        return this.card
      },
    }),
    createTextNode: (text) => ({ textContent: text }),
  }
  try {
    run()
  } finally {
    if (previous.window === undefined) delete globalThis.window
    else globalThis.window = previous.window
    if (previous.document === undefined) delete globalThis.document
    else globalThis.document = previous.document
  }
}

function guideContext(locale, activeStage, targetId = '') {
  const nameField = locale === 'en' ? 'nameLatin' : locale === 'ja' ? 'nameJa' : 'nameTh'
  return {
    lang: locale,
    activeStage,
    notebookRouteStage: 0,
    openNotebookGuide: false,
    notebookSpecies: targetId,
    notebookSelectedStage: activeStage,
    notebookCompletion: guide,
    species: Object.fromEntries(
      Object.entries(data.fishVisuals).map(([id, visual]) => [
        id,
        { name: visual[nameField] || id, visual },
      ]),
    ),
    sourceReturn: () =>
      `maps${suffix(locale)}.html?stage=${activeStage}&section=s${activeStage}-c1-r1&fish=${targetId}&route=lure&return=${encodeURIComponent(`item${suffix(locale)}.html?category=rod&id=01#detail-root`)}#map-view`,
    returnPath: `maps${suffix(locale)}.html?stage=${activeStage}&section=s${activeStage}-c1-r1&fish=${targetId}&route=lure&return=${encodeURIComponent(`item${suffix(locale)}.html?category=rod&id=01#detail-root`)}#map-view`,
    selectedRoute: 'lure',
    fishHref: () => '',
    c: { area: (stage) => `Area ${stage}` },
    esc: (value) =>
      String(value ?? '').replace(
        /[&<>"']/g,
        (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
      ),
  }
}

function suffix(locale) {
  return locale === 'en' ? '' : `.${locale}`
}
