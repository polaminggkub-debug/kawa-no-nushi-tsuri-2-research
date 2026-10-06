import { readFileSync, writeFileSync } from 'node:fs'
import { availableParallelism } from 'node:os'
import { resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { setFightTables } from '../src/entities/fight/index.js'
import { SAMPLE, FRAME_CAP } from '../src/features/fight-policy/index.js'
import { assemble } from './gear-effects/assemble.mjs'
import { METHODS, buildCatalog, readSources } from './gear-effects/catalog.mjs'
import { attachSimulation, listJobs, simsOf } from './gear-effects/jobs.mjs'
import { SEED, STARTS, simulateJob } from './gear-effects/curves.mjs'
import { START_OF } from './gear-effects/enumerate.mjs'
import { currentInputs } from './gear-effects/inputs.mjs'
import { checkAgainstEngine } from './gear-effects/engine-check.mjs'
import { renderDocument } from './gear-effects/render.mjs'

// Builds data/gear-effects.json: what every rod, hook, bait, lure and fly body does to the fight
// meter's starting value (mistakes allowed per size band), the best and cheapest kit per fish and
// method, and, from the frame-exact engine, catch share by starting value and by rod reach.
// Usage: node scripts/build_gear_effects.mjs   (a few minutes; `npm run check:generated` keeps it fresh)
const root = fileURLToPath(new URL('../', import.meta.url))
export const OUTPUT = 'data/gear-effects.json'
const SCHEMA = 1

const readJson = (file) => JSON.parse(readFileSync(resolve(root, file), 'utf8'))

function runPool(jobs) {
  const count = Math.max(1, Math.min(availableParallelism(), jobs.length))
  const slices = Array.from({ length: count }, (_, i) => jobs.filter((_job, n) => n % count === i))
  let finished = 0
  return Promise.all(
    slices.map(
      (slice) =>
        new Promise((done, fail) => {
          const worker = new Worker(fileURLToPath(import.meta.url), { workerData: { jobs: slice } })
          worker.on('message', (results) => {
            finished += results.length
            console.error(`  ${finished}/${jobs.length} fish and methods simulated`)
            done(results)
          })
          worker.on('error', fail)
        }),
    ),
  ).then((parts) => parts.flat())
}

function describeSample() {
  return {
    starts: STARTS,
    seed: SEED,
    frameCap: FRAME_CAP,
    note: `Counts out of ${STARTS} fights: [caught, escaped, tackle lost, still running at the frame cap]. The starts are the first ${STARTS} of the fight simulator's independent final sample (seed ${SAMPLE.finalSeed}): random state, frame counter, cast distance inside the rod's range line, fish size in its species range. Each fish plays its stored best plain rhythm for the method (data/fight-policies.json).`,
  }
}

const META = {
  mistakes:
    'm = wasted beats that fill the meter from the start value: 6 for start 0, 5 for 1, 4 for 3, 3 for 7, 2 for 15, 1 for 31, 0 for 63 (startOf[m] gives the start value). The m-th wasted beat of one reeling spell loses the fish, so m - 1 can be survived.',
  startOf: START_OF,
  bands: ['<= 15 cm', '16..35 cm', '> 35 cm'],
  methods: METHODS,
  ids: 'All ids are decimal (rod 1..21, hook 1..13, bait 1..23, lure 1..81, fly = body id 1..134, fish = ROM profile id). Bait 23 (decoy ayu) is left out: its fight is not ported. Wings and tails do not enter the fight.',
  fields: {
    routes:
      'cheapest float (float rods) and sinker (casting rods) on sale: { id, yen, areas }; they do not enter the fight',
    fish: 'fish[id] = { size: [low, high], n: sizes per band, base: profile start, methods }',
    methods:
      'methods[method] = { max, min, starts, slots, buy, buyAny, enough, cheap, need, needFrom, sim }. max / min: best and worst m any legal kit gives, per band (null = the fish has no size in that band). starts: start values any kit can give. slots[slot] = [[m per band, ids]] best group first: the best m each item can still reach with the other slots chosen freely. buy: cheapest purchasable kit with the highest size-weighted m among rods of reach >= need; buyAny: the same with any rod (only when different); enough: cheapest purchasable kit with such a rod whose simulated catch share is within 3 points of the best; cheap: cheapest purchasable kit. A kit is { rod, hook, bait | lure | fly, yen, reach, m }. need: rod reach the fish needs (simulated for float and casting; borrowed from there for lure and fly, see needFrom). sim (float, casting only): { rod, curve, reach }.',
    sim: "curve[start] and reach[rodReach] are [caught, escaped, tackle lost, unfinished] out of sample.starts fights. curve: best-reach rod with the start forced to that value. reach: one rod per rod reach at the reference start (the fish's best m in its middle size band), each rod on its own cast range.",
    items:
      'items[kind][id] = { yen (null = not sold), areas, rod: special (fixed-rod merchant areas), reach, sel, match, flag, bundles: [[area, slot, yen, wing, tail]], use[method] = { n fish it can be used on, loss: mean mistakes lost against the best kit, best: fish where it is part of a best kit, bad: fish where it costs at least 1 mistake, short: fish whose needed reach it does not have } }',
  },
}

async function main() {
  const sources = readSources(root)
  setFightTables(sources.tables)
  const catalog = buildCatalog(sources)
  checkAgainstEngine(catalog)
  const started = Date.now()
  const results = await runPool(listJobs(catalog))
  const doc = {
    schema: SCHEMA,
    inputs: currentInputs(root),
    sample: describeSample(),
    meta: META,
    ...assemble(catalog, simsOf(results)),
  }
  attachSimulation(doc, results)
  writeFileSync(resolve(root, OUTPUT), renderDocument(doc))
  console.log(`Wrote ${OUTPUT} in ${Math.round((Date.now() - started) / 1000)} s`)
}

if (!isMainThread) {
  const sources = readSources(root)
  setFightTables(sources.tables)
  const stored = readJson('data/fight-policies.json')
  parentPort.postMessage(workerData.jobs.map((job) => simulateJob(sources.tables, stored, job)))
} else if (
  process.argv[1] &&
  relative(root, resolve(process.argv[1])) === 'scripts/build_gear_effects.mjs'
) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
