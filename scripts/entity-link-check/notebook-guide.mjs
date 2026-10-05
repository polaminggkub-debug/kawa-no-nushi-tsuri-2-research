import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bindMapTargets } from '../../src/pages/maps/bind-map-targets.js'
import { renderNotebookGuide } from '../../src/pages/maps/notebook-guide.js'
import { data, unescapeHtml, validate } from './shared.mjs'

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
const guide = JSON.parse(fs.readFileSync(path.join(root, 'data/notebook-completion.json'), 'utf8'))
const availableCounts = [6, 12, 15, 22, 27, 15]
const newCounts = [6, 10, 11, 17, 11, 11]

checkDataset()
checkHeroShortcutTemplates()
for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)
console.log(
  'Notebook route guide PASS: master 66-fish route, collapsed help/evidence, areas, repeats and TH/EN/JA states.',
)

function checkDataset() {
  assert.equal(guide.rom.sha1, 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
  assert.equal(guide.recordRule.notebookSlots, 66)
  assert.equal(guide.totals.notebookEligibleSpecies, 66)
  assert.deepEqual(
    guide.stages.map((stage) => stage.recordableSpeciesCount),
    availableCounts,
  )
  assert.deepEqual(
    guide.stages.map((stage) => stage.firstOccurrenceCount),
    newCounts,
  )
  for (const stage of guide.stages) {
    assert.equal(stage.firstOccurrenceCount, stage.firstOccurrenceSpecies.length)
    assert.equal(
      stage.recordableSpeciesCount,
      stage.firstOccurrenceCount + stage.repeatedFromEarlierStages.length,
      `Area ${stage.stage}: available count must equal first catches plus repeats`,
    )
    assert.equal(
      stage.speciesIds.length,
      stage.recordableSpeciesCount + stage.excludedFromNotebook.length,
      `Area ${stage.stage}: map list must retain journal exclusions`,
    )
  }
  const seen = new Set()
  for (const stage of guide.stages) {
    for (const id of stage.firstOccurrenceSpecies) {
      assert(!seen.has(id), `Fish ${id} is listed as new more than once`)
      assert.equal(guide.species[id]?.notebookEligible, true)
      seen.add(id)
    }
    for (const id of stage.repeatedFromEarlierStages)
      assert(seen.has(id), `Repeated fish ${id} has no earlier route entry`)
    for (const id of stage.excludedFromNotebook)
      assert.equal(guide.species[id]?.notebookEligible, false)
  }
  assert.equal(seen.size, 66)
}

function checkHeroShortcutTemplates() {
  const labels = {
    en: 'Complete the 66-species journal',
    ja: '魚手帳を全66種埋める',
    th: 'เก็บสมุดให้ครบ 66 ชนิด',
  }
  for (const lang of ['en', 'ja', 'th']) {
    const suffix = lang === 'en' ? '' : `.${lang}`
    for (const base of ['src/pages/maps/ui', 'catalogue']) {
      const file = path.join(root, base, `maps${suffix}.html`)
      const source = fs.readFileSync(file, 'utf8')
      const shortcut = new RegExp(
        `<a class="quick-guide-link notebook-guide-shortcut" href="#notebook-guide"\\s*>\\s*${labels[lang]}\\s*</a\\s*>`,
        'g',
      )
      assert.equal([...source.matchAll(shortcut)].length, 1, `${file}: missing journal shortcut`)
      assert(source.includes(`id="shop-browser-link" href="shops${suffix}.html"`))
      assert(source.includes(`id="notebook-guide"`))
      assert(
        source.includes(
          `data-compendium-destination="1" aria-current="page" href="maps${suffix}.html"`,
        ),
      )
    }
  }
}

async function checkLocale(lang) {
  await checkHeroShortcutClick(lang)
  for (const stage of guide.stages) {
    checkState(lang, stage, { openGuide: false, routeStage: 0 }, 0)
    checkState(lang, stage, { openGuide: true, routeStage: 0 }, stage.stage)
    checkState(lang, stage, { openGuide: true, routeStage: stage.stage }, stage.stage)
  }
}

async function checkHeroShortcutClick(lang) {
  const ctx = makeContext(lang, 4, { openGuide: false, routeStage: 0 })
  const { click, previous, getWritten } = registerShortcutTest(ctx)
  try {
    checkShortcutClickResult(ctx, click, getWritten)
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key]
      else globalThis[key] = value
    }
  }
}

function registerShortcutTest(ctx) {
  ctx.returnPath = ''
  ctx.selectedFish = '0D'
  ctx.searchTerm = 'carp'
  ctx.activeWaterMark = 'large'
  ctx.manualMarks = ['06', '0D']
  ctx.areaList = { addEventListener() {} }
  ctx.fishList = { addEventListener() {} }
  const mapNode = { addEventListener() {} }
  ctx.$ = (id) => (id === 'notebook-guide' ? ctx.mount : mapNode)
  ctx.renderNotebookGuide = () => renderNotebookGuide(ctx)
  ctx.mount.querySelector = (selector) => {
    if (selector === '.notebook-manual') return { append() {} }
    if (selector === '.notebook-excluded') return null
    return { textContent: '', checked: false }
  }
  ctx.mount.querySelectorAll = () => []
  let click
  let written = false
  const previous = {
    document: globalThis.document,
    window: globalThis.window,
    location: globalThis.location,
  }
  globalThis.window = {
    localStorage: {
      getItem: () => JSON.stringify(['06']),
      setItem: () => {
        written = true
      },
    },
  }
  globalThis.location = {
    pathname: `/catalogue/maps${ctx.suffix}.html`,
    search: '?stage=4',
    hash: '',
  }
  globalThis.document = shortcutDocument((callback) => (click = callback))
  bindMapTargets(ctx)
  return { click, previous, getWritten: () => written }
}

function shortcutDocument(registerClick) {
  return {
    querySelector: (selector) =>
      selector === '.notebook-guide-shortcut'
        ? { addEventListener: (_type, callback) => registerClick(callback) }
        : null,
    createElement: () => ({ className: '', textContent: '' }),
  }
}

function checkShortcutClickResult(ctx, click, getWritten) {
  let defaultPrevented = false
  click({ preventDefault: () => (defaultPrevented = true) })
  assert.equal(defaultPrevented, false)
  assert.equal(ctx.openNotebookGuide, true)
  assert.equal(ctx.notebookRouteStage, 4)
  assert.equal(ctx.mount.hidden, false)
  assert.match(ctx.mount.innerHTML, /data-notebook-route-total="66"/)
  assert.match(ctx.mount.innerHTML, /<details id="notebook-route-4"[^>]*\sopen/)
  assert.equal(ctx.selectedFish, '0D')
  assert.equal(ctx.searchTerm, 'carp')
  assert.equal(ctx.activeWaterMark, 'large')
  assert.deepEqual(ctx.manualMarks, ['06', '0D'])
  assert.equal(getWritten(), false)
}

function checkState(lang, stage, state, openGroup) {
  const ctx = makeContext(lang, stage.stage, state)
  renderNotebookGuide(ctx)
  const html = ctx.mount.innerHTML
  assert.equal(ctx.mount.hidden, false)
  assert.match(html, new RegExp(`data-stage="${stage.stage}"`))
  assert.match(html, new RegExp(`data-notebook-total="${availableCounts[stage.stage - 1]}"`))
  assert.match(html, new RegExp(`data-notebook-new="${newCounts[stage.stage - 1]}"`))
  assert.match(
    html,
    new RegExp(`data-notebook-repeated="${stage.repeatedFromEarlierStages.length}"`),
  )
  checkRoute(html, lang, stage, state, openGroup)
  checkHelp(html, lang, stage)
  checkStageLists(html, stage)
  checkSingleRecordRule(html, lang)
  checkManualAndEvidence(html, lang)
  validate(html, new URL(`https://example.test/catalogue/maps${ctx.suffix}.html`))
}

function checkRoute(html, lang, activeStage, state, openGroup) {
  assert(
    !html.includes('class="notebook-new"'),
    `${lang} Area ${activeStage.stage}: duplicate local new-fish list`,
  )
  const route = detailsBlock(html, 'notebook-full-route')
  const routeOpen = Boolean(state.openGuide || state.routeStage)
  assert.equal(detailsOpens(route), routeOpen, `${lang}: wrong master-route open state`)
  assert.match(route, /data-notebook-route-total="66"/)
  const groups = [
    ...route.matchAll(/<details id="notebook-route-(\d)"[^>]*>([\s\S]*?)<\/details>/g),
  ]
  assert.equal(groups.length, 6, `${lang}: master route must retain all six groups`)
  const found = []
  for (const [, stageText, body] of groups) {
    const stage = Number(stageText)
    const expected = guide.stages[stage - 1].firstOccurrenceSpecies
    const cards = [...body.matchAll(/data-notebook-card="([0-9A-F]{2})"/g)].map((match) => match[1])
    assert.deepEqual(
      cards,
      expected,
      `${lang} Area ${stage}: route IDs differ from the ROM checklist`,
    )
    assert.equal(
      hasOpenAttribute(groups.find(([, id]) => id === stageText)?.[0] || ''),
      stage === openGroup,
    )
    found.push(...cards)
  }
  assert.deepEqual(
    found,
    guide.stages.flatMap((entry) => entry.firstOccurrenceSpecies),
  )
  assert.equal(new Set(found).size, 66, `${lang}: master route repeats a new-fish card`)
}

function checkHelp(html, lang, stage) {
  const help = detailsBlock(html, 'notebook-help')
  assert(!hasOpenAttribute(help), `${lang}: count/verification help must start collapsed`)
  assert(help.includes('class="notebook-count-explainer"'))
  assert(help.includes('data-notebook-verification'))
  assert(help.includes('class="notebook-target-note"'))
  checkHelpCopy(help, lang)
  checkVerificationInstruction(help, lang)
  const counts = [...help.matchAll(/data-notebook-area="(\d)" data-notebook-count="(\d+)"/g)]
  assert.deepEqual(
    counts.map(([, id, count]) => [Number(id), Number(count)]),
    availableCounts.map((count, index) => [index + 1, count]),
  )
  assert.equal(Number(counts[stage.stage - 1][2]), availableCounts[stage.stage - 1])
  assert(html.indexOf('class="notebook-count-explainer"') > html.indexOf('class="notebook-help"'))
  assert(!html.slice(0, html.indexOf('class="notebook-help"')).includes('notebook-count-explainer'))
}

function checkStageLists(html, stage) {
  const repeated = stage.repeatedFromEarlierStages.length
    ? detailsBlock(html, 'notebook-repeated')
    : ''
  assert.deepEqual(cardIds(repeated), stage.repeatedFromEarlierStages)
  const excluded = detailsBlock(html, 'notebook-excluded')
  assert.deepEqual(cardIds(excluded), stage.excludedFromNotebook)
  assert(!hasOpenAttribute(repeated), 'Repeated-fish details must stay collapsed')
  assert(!hasOpenAttribute(excluded), 'Excluded profiles must stay collapsed')
  if (excluded) assert(!/<p\b/.test(excluded), 'Excluded species need no repeated explanation')
}

function checkSingleRecordRule(html, lang) {
  const help = detailsBlock(html, 'notebook-help')
  const rule = {
    en: [/largest-size record/i, /same-size or smaller catch/i, /larger catch moves/i],
    ja: [/最大サイズの記録/, /同じか小さい魚/, /より大きい魚/],
    th: [/สถิติปลาขนาดใหญ่สุด/, /ขนาดเท่าหรือเล็กกว่า/, /ใหญ่กว่า.*รายการจะย้าย/],
  }[lang]
  for (const pattern of rule) {
    const pageMatches = html.match(new RegExp(pattern.source, 'gi')) || []
    const helpMatches = help.match(new RegExp(pattern.source, 'gi')) || []
    assert.equal(
      pageMatches.length,
      1,
      `${lang}: record-move rule is repeated or missing: ${pattern}`,
    )
    assert.equal(helpMatches.length, 1, `${lang}: record-move rule belongs in collapsed help`)
  }
  const oldExcludedNotes = {
    en: 'These fish appear on the map but have no species entry in the journal.',
    ja: 'マップ上にはいますが、図鑑に魚種の記録枠はありません。',
    th: 'ปลากลุ่มนี้ปรากฏบนแผนที่ แต่ไม่มีรายการชนิดปลาในสมุด',
  }
  assert(!html.includes(oldExcludedNotes[lang]), `${lang}: excluded fish explanation is redundant`)
}

function checkVerificationInstruction(help, lang) {
  const section = help.match(/<section class="notebook-verification"[\s\S]*?<\/section>/)?.[0]
  assert(section, `${lang}: notebook verification instruction is missing`)
  const body = unescapeHtml(section)
  const instruction = {
    en: /Land the fish, finish the landing messages, then open Tool 05 .*check that its name appears on one of the six pages\./,
    ja: /魚を取り込み、取り込みメッセージを最後まで進めてから道具05.*魚名が6ページのいずれかにあるか確認してください。/,
    th: /ตกปลาให้ขึ้นและผ่านข้อความผลการตกจนจบ.*เปิดไอเท็ม 05.*ชื่อปลาปรากฏอยู่ในหน้าด่านใดด่านหนึ่งหรือไม่/,
  }[lang]
  assert(instruction.test(body), `${lang}: journal-check instruction should remain actionable`)
}

function checkManualAndEvidence(html, lang) {
  assert(html.includes('class="notebook-manual"'))
  assert(html.includes('data-notebook-remaining'))
  assert(html.includes('class="notebook-evidence"'))
  const evidence = detailsBlock(html, 'notebook-evidence')
  assert(
    !hasOpenAttribute(evidence),
    `${lang}: natural-catch proof must stay in collapsed evidence`,
  )
  assert(evidence.includes('notebook-completion-research.md'))
  assert(evidence.includes('notebook-progress'))
  const naturalProof = { en: '0/0 to 23/1', ja: '0/0から23/1', th: 'จาก 0/0 เป็น 23/1' }
  assert(evidence.includes(naturalProof[lang]), `${lang}: natural-catch evidence is missing`)
}

function checkHelpCopy(help, lang) {
  const noFixedTarget = {
    en: 'There is no fixed target for each page.',
    ja: '各ページに固定の目標数はありません。',
    th: 'แต่ละหน้าจึงไม่มียอดเป้าหมายตายตัว',
  }
  assert(
    help.includes(noFixedTarget[lang]),
    `${lang}: collapsed help lost the save-count explanation`,
  )
  const link = help.match(/data-notebook-open href="([^"]+)"/)
  assert(link, `${lang}: collapsed help lost the in-game notebook link`)
  const target = new URL(
    unescapeHtml(link[1]),
    `https://example.test/catalogue/maps${lang === 'en' ? '' : `.${lang}`}.html`,
  )
  assert(target.pathname.endsWith(`/item${lang === 'en' ? '' : `.${lang}`}.html`))
  assert.equal(target.searchParams.get('category'), 'general_tool')
  assert.equal(target.searchParams.get('id'), '05')
}

function makeContext(lang, stage, state) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const species = Object.fromEntries(
    Object.entries(data.fishVisuals).map(([id, visual]) => [
      id,
      {
        name: visual[`name${lang === 'en' ? 'Latin' : lang === 'ja' ? 'Ja' : 'Th'}`] || id,
        visual,
      },
    ]),
  )
  const source = `maps${suffix}.html?stage=${stage}`
  const mount = { innerHTML: '', hidden: true, querySelector: () => null }
  return {
    lang,
    suffix,
    activeStage: stage,
    openNotebookGuide: state.openGuide,
    notebookRouteStage: state.routeStage,
    notebookCompletion: guide,
    species,
    mount,
    returnPath: source,
    c: {
      area: (number) => `${lang === 'th' ? 'ด่าน' : lang === 'ja' ? 'エリア' : 'Area'} ${number}`,
    },
    idNorm: (id) => String(id).toUpperCase().padStart(2, '0'),
    sourceReturn: () => source,
    fishHref: () => '',
    $: (id) => (id === 'notebook-guide' ? mount : null),
    esc: (value) =>
      String(value ?? '').replace(
        /[&<>"']/g,
        (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
      ),
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

function cardIds(html) {
  return [...html.matchAll(/data-notebook-card="([0-9A-F]{2})"/g)].map((match) => match[1])
}

function hasOpenAttribute(html) {
  return /<details\b[^>]*\sopen(?:\s|>)/.test(html)
}

function detailsOpens(html) {
  return /^<details\b[^>]*\sopen(?:\s|>)/.test(html)
}
