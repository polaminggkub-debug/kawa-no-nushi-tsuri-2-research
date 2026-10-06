import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { assetVersion } from '../code-quality/asset-versions.mjs'
import { goatCounterScript } from '../code-quality/analytics.mjs'
import { createFight, setFightTables } from '../../src/entities/fight/index.js'
import {
  defaultSetup,
  fightOptions,
  fightableFish,
  playFight,
  sampleStarts,
  setupKey,
} from '../../src/features/fight-policy/index.js'
import { comparedCase, renderComparison, tipNumbers } from '../../src/pages/fight-sim/compare.js'
import { copy } from '../../src/pages/fight-sim/copy.js'
import { describePolicy } from '../../src/pages/fight-sim/describe.js'
import { tick, visibleStatus } from '../../src/pages/fight-sim/play.js'
import {
  baselineCard,
  bestCard,
  ceilingCard,
  trickCard,
} from '../../src/pages/fight-sim/results.js'
import { root } from './shared.mjs'

// The Fight simulator page: three localized renders, navigation entry on every page, the stored
// finder results, the claims in the tip box against those results, and a scripted fight on a fixed seed.
const read = (file) => readFileSync(resolve(root, file), 'utf8')
const tables = JSON.parse(read('data/fight-tables.json'))
const policies = JSON.parse(read('data/fight-policies.json'))
setFightTables(tables)
const suffixes = { en: '', th: '.th', ja: '.ja' }

checkNavigation()
for (const [locale, suffix] of Object.entries(suffixes)) checkPage(locale, suffix)
checkCoverage()
checkTipClaims()
checkText()
checkScriptedFight()
checkWorkerPin()

console.log(
  'Fight simulator PASS: EN/TH/JA pages render with navigation, visitor statistics and no placeholders; stored finder results cover every fish; tip claims match them; a scripted fixed-seed fight gives the expected outcomes.',
)

function checkNavigation() {
  const pages = ['index', 'maps', 'shops', 'quests', 'item', 'fish', 'fight-sim']
  for (const [, suffix] of Object.entries(suffixes)) {
    const files = [
      ...pages.map((name) => `catalogue/${name}${suffix}.html`),
      `research/index${suffix}.html`,
    ]
    for (const file of files) {
      const html = read(file)
      const links = html.match(/data-compendium-destination="5"[^>]*>/g) ?? []
      assert.equal(links.length, 1, `${file}: exactly one simulator link in the main navigation`)
      const prefix = file.startsWith('research/') ? '../catalogue/' : ''
      assert(
        links[0].includes(`href="${prefix}fight-sim${suffix}.html"`),
        `${file}: wrong simulator link ${links[0]}`,
      )
    }
  }
}

function checkPage(locale, suffix) {
  const file = `catalogue/fight-sim${suffix}.html`
  const html = read(file)
  assert(html.includes(`<html lang="${locale}" data-locale="${locale}">`), `${file}: locale`)
  assert.equal(html.split(goatCounterScript()).length, 2, `${file}: visitor statistics once`)
  for (const id of ['fs-compare', 'fs-fish', 'fs-rod', 'fs-hook', 'fs-bait', 'fs-results'])
    assert(html.includes(`id="${id}"`), `${file}: missing #${id}`)
  for (const id of ['fight-canvas', 'a-button', 'fight-start', 'show-hidden', 'show-ghost'])
    assert(html.includes(`id="${id}"`), `${file}: missing #${id}`)
  assert.equal((html.match(/data-fill="eel-/g) ?? []).length, 4, `${file}: tip numbers`)
  assert.equal((html.match(/<ol class="fs-rules">/g) ?? []).length, 1)
  assert.equal((html.match(/<li>/g) ?? []).length >= 5, true, `${file}: five tip rules`)
  assert(/<details id="how-we-know"/.test(html), `${file}: collapsed evidence note`)
  assert(!/<details id="how-we-know"[^>]* open/.test(html), `${file}: evidence must start closed`)
  assert(html.includes('blob/main/docs/fight-model.md'), `${file}: model link`)
  assert(/fight-sim\.js\?v=[0-9a-f]{16}/.test(html), `${file}: script version`)
  assert(!/undefined|NaN|\[object/.test(html), `${file}: placeholder text leaked`)
  for (const other of Object.entries(suffixes))
    assert(
      html
        .replace(/\s+/g, ' ')
        .includes(
          `hreflang="${other[0]}" href="https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/catalogue/fight-sim${other[1]}.html"`,
        ),
      `${file}: alternate ${other[0]}`,
    )
}

function checkCoverage() {
  assert.equal(policies.schema, 1)
  for (const fish of fightableFish(tables))
    for (const method of ['float', 'casting']) {
      const setup = defaultSetup(tables, fish, method)
      const record = policies.combos[setupKey(setup)]
      assert(record, `no stored finder result for fish ${fish.id} ${method}`)
      assert(record.plain.m.c >= 0 && record.plain.m.c <= 100)
      assert(
        record.ceiling.m.c >= record.plain.m.c,
        `fish ${fish.id}: ceiling below the plain rhythm`,
      )
      for (const kind of ['fish', 'rod', 'hook'])
        assert(policies.names[kind][setup[`${kind}Id`]]?.th, `missing ${kind} name`)
    }
  assert(policies.names.fish[59].en && policies.names.fish[59].th && policies.names.fish[59].ja)
}

// The words in the tip box must stay true for the stored numbers.
function checkTipClaims() {
  const yamame = comparedCase({ tables, policies }, 3).record
  const eel = comparedCase({ tables, policies }, 59).record
  for (const record of [yamame, eel]) {
    assert(record.base.hold.c <= 5, 'tip: holding A the whole time should lose almost every fish')
    assert(record.base.mash.c <= 5, 'tip: mashing A should lose almost every fish')
  }
  assert(yamame.plain.m.c >= 95, 'tip: the rhythm lands the Yamame')
  assert(eel.plain.m.c < 50 && eel.plain.m.s > 50, 'tip: the eel is a long fight')
  assert(eel.trick && eel.trick.m.c > eel.plain.m.c, 'tip: tapping helps the eel')
  assert(eel.ceiling.m.c > 90, 'tip: perfect timing reaches the eel')
  const numbers = tipNumbers({ tables, policies })
  assert.deepEqual(Object.keys(numbers).sort(), [
    'eel-ceiling',
    'eel-plain',
    'eel-trick',
    'eel-unfinished',
  ])
}

function checkText() {
  for (const locale of Object.keys(suffixes)) {
    const text = copy[locale]
    const nodes = {}
    const ctx = { tables, policies, locale, text, $: (id) => (nodes[id] ||= { innerHTML: '' }) }
    renderComparison(ctx)
    const table = nodes['fs-compare'].innerHTML
    assert(table.includes(policies.names.fish[3][locale]), `${locale}: Yamame name in the table`)
    assert(!/undefined|NaN/.test(table), `${locale}: table placeholders`)
    for (const [key, record] of Object.entries(policies.combos)) {
      const html = [
        bestCard(record, text),
        baselineCard(record, text),
        trickCard(record, text),
        ceilingCard(record, text),
      ].join('')
      assert(!/undefined|NaN|\[object/.test(html), `${locale} ${key}: placeholder text`)
      assert(describePolicy(record.plain.spec, text).length >= 4, `${locale} ${key}: steps`)
    }
  }
}

// Fixed seed: hold and mash lose the Area 1 Yamame, the rhythm lands it; the eel stays unfinished.
function checkScriptedFight() {
  const rhythm = { kind: 'rhythm', wait: 0, stop: 3, slow: 0, cap: 0, first: 12, lag: 8 }
  const expected = {
    3: { hold: ['escaped', 146], mash: ['escaped', 580], rhythm: ['caught', 193] },
    59: { hold: ['escaped', 85], mash: ['escaped', 328], rhythm: [null, 6000] },
  }
  for (const id of [3, 59]) {
    const fish = tables.fish.find((row) => row.id === id)
    const setup = defaultSetup(tables, fish, 'float')
    const rod = tables.rod.find((row) => row.id === setup.rodId)
    const [start] = sampleStarts(fish, rod, 1, 424242)
    const specs = { hold: { kind: 'hold' }, mash: { kind: 'mash', on: 3, off: 3 }, rhythm }
    for (const [name, spec] of Object.entries(specs)) {
      const { outcome, frames } = playFight(tables, setup, start, spec)
      assert.deepEqual([outcome, frames], expected[id][name], `fish ${id} ${name}`)
    }
  }
  checkVisibleControls()
}

// A player who only reads the visible status (press when it rests, let go when it stops) lands the Yamame.
function checkVisibleControls() {
  const fish = tables.fish.find((row) => row.id === 3)
  const setup = defaultSetup(tables, fish, 'float')
  const rod = tables.rod.find((row) => row.id === setup.rodId)
  const [start] = sampleStarts(fish, rod, 1, 424242)
  const run = { fight: createFight(fightOptions(setup, start), tables), pulled: false }
  run.view = run.fight.view()
  run.ghost = run.fight
  run.ghostView = { outcome: 'caught' }
  let held = false
  for (let frame = 0; frame < 2000 && !run.view.outcome; frame++) {
    const status = visibleStatus(run.view, held, run.pulled)
    if (status === 'resting') held = true
    if (status === 'stalled' || status === 'running') held = false
    tick(run, held)
  }
  assert.equal(run.view.outcome, 'caught', 'visible-status player lands the Yamame')
}

function checkWorkerPin() {
  const page = read('catalogue/fight-sim.js')
  assert(!page.includes('__FIGHT_WORKER_VERSION__'), 'worker version placeholder left in page')
  assert(
    page.includes(`fight-sim-worker.js?v=${assetVersion(read('catalogue/fight-sim-worker.js'))}`),
    'page does not point at the current worker build',
  )
  assert(existsSync(resolve(root, 'catalogue/fight-sim-worker.js')))
}
