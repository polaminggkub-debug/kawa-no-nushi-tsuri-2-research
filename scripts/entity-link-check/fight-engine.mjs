import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createFight, setFightTables } from '../../src/entities/fight/index.js'

// Replays every recorded ROM trace through the JavaScript fight engine and requires every tracked
// variable to match on every frame, plus the exit frame and outcome. Traces: data/fight-traces/*.json.
const root = fileURLToPath(new URL('../..', import.meta.url))
const tables = JSON.parse(readFileSync(resolve(root, 'data/fight-tables.json'), 'utf8'))
const dir = process.argv[2] ?? resolve(root, 'data/fight-traces')
setFightTables(tables)

function expectEqual(label, frame, name, actual, expected) {
  assert.equal(
    actual,
    expected,
    `${label}: frame ${frame} ${name}: engine ${actual} vs ROM ${expected}`,
  )
}

function decodeColumn(column) {
  if (Array.isArray(column)) return column
  const values = []
  for (let i = 0; i < column.rle.length; i += 2) {
    for (let n = 0; n < column.rle[i + 1]; n++) values.push(column.rle[i])
  }
  return values
}

function compareFrame(trace, label, fight, frame) {
  const vars = fight.vars()
  for (const name of trace.vars)
    expectEqual(label, frame, name, vars[name], trace.series[name][frame])
  for (const [name, value] of Object.entries(trace.constants)) {
    expectEqual(label, frame, name, vars[name], value)
  }
  expectEqual(label, frame, 'clock', vars.clock, (trace.startClock + frame) & 0xff)
}

// What the real game did after the loop ended must agree with the engine's outcome.
function checkAftermath(exit, label) {
  if (exit.observed)
    assert.equal(exit.observed, exit.outcome, `${label}: emulator aftermath disagrees`)
  if (exit.outcome === 'caught')
    assert.equal(exit.notebookDelta, 1, `${label}: notebook not updated`)
  else assert.equal(exit.notebookDelta, 0, `${label}: notebook changed without a catch`)
  if (exit.outcome === 'lost-tackle') {
    assert(exit.hpDelta < 0 && exit.hookCleared, `${label}: tackle loss left HP and hook intact`)
  } else if (exit.outcome === 'escaped') {
    assert(exit.hpDelta === 0 && !exit.hookCleared, `${label}: plain escape cost HP or hook`)
  }
}

function replay(trace, label) {
  trace.series = Object.fromEntries(
    trace.vars.map((name) => [name, decodeColumn(trace.columns[name])]),
  )
  assert.equal(trace.series[trace.vars[0]].length, trace.frameCount, `${label}: frame count`)
  const fight = createFight(trace.resume ? { ...trace.params, resume: trace.resume } : trace.params)
  compareFrame(trace, label, fight, 0)
  const exitFrame = trace.exit ? trace.exit.frame : null
  const last = exitFrame ?? trace.frameCount - 1
  for (let frame = 1; frame <= last; frame++) {
    const code = Number(trace.schedule[frame - 1] ?? 0)
    const view = fight.step({ a: (code & 1) !== 0, b: (code & 2) !== 0 })
    const ended = view.outcome !== null
    assert.equal(ended, frame === exitFrame, `${label}: frame ${frame} outcome timing`)
    if (frame < trace.frameCount) compareFrame(trace, label, fight, frame)
  }
  if (trace.exit) {
    assert.equal(fight.view().outcome, trace.exit.outcome, `${label}: outcome`)
    if (trace.exit.observed) checkAftermath(trace.exit, label)
  }
  return last
}

const files = readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .sort()
assert(files.length > 0, `no fight traces in ${dir}`)
let frames = 0
for (const file of files) {
  const trace = JSON.parse(readFileSync(resolve(dir, file), 'utf8'))
  frames += replay(trace, file)
}
// Unsupported fights must be refused explicitly rather than simulated wrongly.
const base = { rodId: 2, fishId: 3, hookId: 6, baitId: 0 }
assert.throws(
  () => createFight({ ...base, rodId: 10 }, tables),
  /Unknown lure/,
  'lure needs a lureId',
)
assert.throws(
  () => createFight({ ...base, baitId: 23 }, tables),
  /Decoy-ayu/,
  'decoy ayu is refused',
)
assert.throws(
  () => createFight({ ...base, fishId: 67 }, tables),
  /placeholder/,
  'fish 67 is refused',
)
assert.throws(() => createFight({ ...base, rodId: 17 }, tables), /Unknown fly/, 'fly needs a flyId')

// HP and the d-pad are inert, B acts like A, and a clone evolves independently of its source.
{
  const start = { ...base, size: 23, rng: { index: 5, lfsrA: 7, lfsrB: 9 }, clock: 3 }
  const plain = createFight({ ...start, hp: 100 }, tables)
  const other = createFight({ ...start, hp: 1 }, tables)
  const copy = plain.clone()
  for (let frame = 0; frame < 200; frame++) {
    const press = frame % 80 < 60
    plain.step({ a: press })
    other.step({ b: press, left: true, up: frame % 3 === 0 })
    assert.deepEqual(other.vars(), plain.vars(), `inert inputs changed frame ${frame}`)
  }
  assert.notDeepEqual(copy.vars(), plain.vars(), 'clone must not share state with its source')
}

console.log(
  `PASS: fight engine matches ${files.length} ROM fight traces frame-exactly (${frames} frames, every tracked variable, exit frame and outcome).`,
)
