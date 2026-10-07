import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { setFightTables } from '../../src/entities/fight/index.js'
import { assemble } from './assemble.mjs'
import { buildCatalog, readSources } from './catalog.mjs'
import { checkAgainstEngine } from './engine-check.mjs'
import { currentInputs } from './inputs.mjs'
import { attachSimulation, listJobs, simsOf, storedResults } from './jobs.mjs'
import { simulateJob } from './curves.mjs'

// `npm run check:generated` support. data/gear-effects.json takes about a minute to rebuild, so it
// is kept in sync by fingerprint: the ROM tables, engine, finder, shop and acceptance data, stored
// rhythms and these scripts must hash to what was stored; the whole non-simulated part is
// recomputed and compared exactly (it is cheap); two fish are re-simulated.
const PROBE_FISH = [3, 37]
const OUTPUT = 'data/gear-effects.json'

const text = (value) => JSON.stringify(value)

export function verifyGearEffects(root) {
  const regenerate = 'run node scripts/build_gear_effects.mjs'
  const stored = JSON.parse(readFileSync(resolve(root, OUTPUT), 'utf8'))
  const errors = []
  const inputs = currentInputs(root)
  for (const key of Object.keys(inputs))
    if (stored.inputs[key] !== inputs[key])
      errors.push(`${OUTPUT} is stale (${key} changed): ${regenerate}`)
  if (errors.length) return errors
  const sources = readSources(root)
  setFightTables(sources.tables)
  const catalog = buildCatalog(sources)
  checkAgainstEngine(catalog)
  const results = storedResults(stored)
  const fresh = assemble(catalog, simsOf(results))
  attachSimulation(fresh, results)
  for (const part of ['routes', 'fish', 'items'])
    if (text(fresh[part]) !== text(stored[part]))
      errors.push(`${OUTPUT} ${part} differ from the recomputed ones: ${regenerate}`)
  if (errors.length) return errors
  const policies = JSON.parse(readFileSync(resolve(root, 'data/fight-policies.json'), 'utf8'))
  for (const job of listJobs(catalog).filter((item) => PROBE_FISH.includes(item.fishId))) {
    const now = simulateJob(sources.tables, policies, job)
    const was = results.find((entry) => entry.key === job.key)
    if (text(now) !== text(was))
      errors.push(`${OUTPUT} simulation of ${job.key} no longer matches the engine: ${regenerate}`)
  }
  return errors
}
