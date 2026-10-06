import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { availableParallelism } from 'node:os'
import { join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { setFightTables } from '../src/entities/fight/index.js'
import {
  BASELINES,
  FRAME_CAP,
  REACTION,
  SAMPLE,
  TRICK_GAIN,
  analyseSetup,
  defaultSetup,
  evaluatePolicy,
  fightableFish,
  packAnalysis,
  sampleStarts,
  setupKey,
  unpackSpec,
} from '../src/features/fight-policy/index.js'
import { fishName, imageName } from '../src/pages/item/names.js'

// Precomputes the fight auto-finder results (data/fight-policies.json) so the page needs no heavy
// work on load. Usage: node scripts/build_fight_policies.mjs [--names]   (--names refreshes only the
// localized names and keeps the computed results; the full run takes a few minutes).
const root = fileURLToPath(new URL('../', import.meta.url))
export const OUTPUT = 'data/fight-policies.json'
const METHODS = ['float', 'casting']
const SCHEMA = 1

const readJson = (file) => JSON.parse(readFileSync(resolve(root, file), 'utf8'))
const hashOf = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16)

function sourceFiles(directory) {
  return readdirSync(resolve(root, directory))
    .filter((name) => name.endsWith('.js'))
    .sort()
    .map((name) => join(directory, name))
}

/** Hashes of everything the stored results depend on: the ROM tables, the engine and the finder. */
export function currentInputs() {
  const code = [...sourceFiles('src/entities/fight'), ...sourceFiles('src/features/fight-policy')]
  const text = code
    .map((file) => `${file}\0${readFileSync(resolve(root, file), 'utf8')}`)
    .join('\0')
  return {
    tables: hashOf(readFileSync(resolve(root, 'data/fight-tables.json'))),
    code: hashOf(text),
  }
}

const hexId = (id) => id.toString(16).toUpperCase().padStart(2, '0')

/** Localized names, taken from the same catalogue sources and rules the other pages use. */
export function buildNames(tables, gallery) {
  const names = { fish: {}, rod: {}, hook: {}, bait: {} }
  const label = (build) =>
    Object.fromEntries(['en', 'th', 'ja'].map((lang) => [lang, build({ lang })]))
  for (const fish of fightableFish(tables))
    names.fish[fish.id] = label((ctx) => fishName(ctx, hexId(fish.id), gallery.fishVisuals))
  for (const kind of ['rod', 'hook', 'bait']) {
    for (const row of tables[kind]) {
      const item = gallery.items.find(
        (entry) => entry.category === kind && entry.idDecimal === row.id,
      )
      if (item) names[kind][row.id] = label((ctx) => imageName(ctx, item))
    }
  }
  return names
}

/** Every fish with the best rod of each method and its best hook and bait. */
export function listJobs(tables) {
  const jobs = []
  for (const fish of fightableFish(tables))
    for (const method of METHODS) {
      const setup = defaultSetup(tables, fish, method)
      jobs.push({ key: setupKey(setup), setup, fishId: fish.id, method })
    }
  return jobs
}

const lookup = (tables, kind, id) => tables[kind].find((row) => row.id === id)

/** Run the finder for one job and return the compact stored record. */
export function analyseJob(tables, job) {
  const fish = lookup(tables, 'fish', job.setup.fishId)
  const rod = lookup(tables, 'rod', job.setup.rodId)
  const result = analyseSetup(tables, job.setup, fish, rod)
  return { key: job.key, record: { method: job.method, ...packAnalysis(result) } }
}

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
            console.error(`  ${finished}/${jobs.length} setups analysed`)
            done(results)
          })
          worker.on('error', fail)
        }),
    ),
  ).then((parts) => parts.flat())
}

const compare = (a, b) => a.key.localeCompare(b.key, 'en', { numeric: true })

function describeSample() {
  return {
    search: { starts: SAMPLE.search, seed: SAMPLE.searchSeed },
    final: { starts: SAMPLE.final, seed: SAMPLE.finalSeed },
    frameCap: FRAME_CAP,
    reactionFrames: REACTION,
    trickGain: TRICK_GAIN,
    note: 'Each start draws random state (index, lfsrA, lfsrB), frame counter, cast distance bucket inside the rod range and fish size within its species range. Winners are picked on the search sample; reported shares come from the independent final sample.',
  }
}

/** Layout: header fields on their own lines, one combination per line, so diffs stay readable. */
export function renderDocument(doc) {
  const names = Object.entries(doc.names).map(
    ([kind, table]) => `    ${JSON.stringify(kind)}: ${JSON.stringify(table)}`,
  )
  const combos = Object.entries(doc.combos).map(
    ([key, record]) => `    ${JSON.stringify(key)}: ${JSON.stringify(record)}`,
  )
  return [
    '{',
    `  "schema": ${doc.schema},`,
    `  "inputs": ${JSON.stringify(doc.inputs)},`,
    `  "sample": ${JSON.stringify(doc.sample)},`,
    `  "names": {\n${names.join(',\n')}\n  },`,
    `  "combos": {\n${combos.join(',\n')}\n  }`,
    '}',
    '',
  ].join('\n')
}

export function readStored() {
  return readJson(OUTPUT)
}

/** Recompute the stored figures of one combination on the final sample; returns mismatch messages. */
export function verifyCombo(tables, key, record) {
  const [fishId, rodId, hookId, baitId] = key.split('|').map(Number)
  const setup = { fishId, rodId, hookId, baitId }
  const starts = sampleStarts(
    lookup(tables, 'fish', fishId),
    lookup(tables, 'rod', rodId),
    SAMPLE.final,
    SAMPLE.finalSeed,
  )
  const errors = []
  const same = (label, spec, stored) => {
    const now = evaluatePolicy(tables, setup, spec, starts, FRAME_CAP)
    if (JSON.stringify(now) !== JSON.stringify(stored))
      errors.push(
        `${key} ${label}: stored ${JSON.stringify(stored)} but engine gives ${JSON.stringify(now)}`,
      )
  }
  const entries = { plain: record.plain, trick: record.trick, ceiling: record.ceiling }
  for (const [name, entry] of Object.entries(entries))
    if (entry) same(name, unpackSpec(entry.spec, entry.lag), entry.m)
  for (const [name, spec] of Object.entries(BASELINES)) same(name, spec, record.base[name])
  return errors
}

async function main() {
  const tables = readJson('data/fight-tables.json')
  setFightTables(tables)
  const gallery = readJson('catalogue/gallery-data.json')
  const names = buildNames(tables, gallery)
  if (process.argv.includes('--names')) {
    const stored = readStored()
    stored.names = names
    writeFileSync(resolve(root, OUTPUT), renderDocument(stored))
    console.log(`Refreshed names in ${OUTPUT}`)
    return
  }
  const started = Date.now()
  const results = (await runPool(listJobs(tables))).sort(compare)
  const combos = Object.fromEntries(results.map((entry) => [entry.key, entry.record]))
  const doc = { schema: SCHEMA, inputs: currentInputs(), sample: describeSample(), names, combos }
  writeFileSync(resolve(root, OUTPUT), renderDocument(doc))
  console.log(
    `Wrote ${OUTPUT}: ${results.length} setups in ${Math.round((Date.now() - started) / 1000)} s`,
  )
}

if (!isMainThread) {
  const tables = readJson('data/fight-tables.json')
  setFightTables(tables)
  parentPort.postMessage(workerData.jobs.map((job) => analyseJob(tables, job)))
} else if (
  process.argv[1] &&
  relative(root, resolve(process.argv[1])) === 'scripts/build_fight_policies.mjs'
) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
