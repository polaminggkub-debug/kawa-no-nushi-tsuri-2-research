import {
  SAMPLE,
  FRAME_CAP,
  defaultSetup,
  playFight,
  sampleStarts,
  setupKey,
  startingFightValue,
  unpackSpec,
} from '../../src/features/fight-policy/index.js'

// Catch share as a function of the starting fight value and of the rod's reach, by playing each
// fish's stored best plain rhythm (data/fight-policies.json) over a fixed sample of random starts.

export const STARTS = 400
/** The first 400 starts of the stored final sample, so figures line up with the simulator page. */
export const SEED = SAMPLE.finalSeed
/** Neutral hook record: selector 3 changes nothing, no fish match. */
const NEUTRAL_HOOK = { id: 99, selector: 3, fishMatch: 0 }
const OUTCOMES = ['caught', 'escaped', 'lost-tackle', 'unfinished']

/**
 * Copy of the tables where this fish starts every fight at exactly `start` with this rod: the rod
 * gets selector 1 and the fish as its match (no adjustment) and the hook adds nothing.
 */
export function forcedTables(tables, fishId, rodId, start) {
  return {
    ...tables,
    fish: tables.fish.map((f) => (f.id === fishId ? { ...f, fightStart: start } : f)),
    rod: tables.rod.map((r) => (r.id === rodId ? { ...r, selector: 1, fishMatch: fishId } : r)),
    hook: [...tables.hook, NEUTRAL_HOOK],
  }
}

/** The stored rhythm and best-reach rod for a fish and method. */
export function storedPolicy(tables, stored, fish, method) {
  const setup = defaultSetup(tables, fish, method)
  const rod = tables.rod.find((r) => r.id === setup.rodId)
  const plain = stored.combos[setupKey(setup)].plain
  return { rod, spec: unpackSpec(plain.spec, plain.lag), plain: plain.spec }
}

/** [caught, escaped, lost tackle, unfinished] out of STARTS fights at a forced start and rod. */
export function countsAt(tables, fish, rod, spec, start) {
  const forced = forcedTables(tables, fish.id, rod.id, start)
  const setup = { rodId: rod.id, fishId: fish.id, hookId: NEUTRAL_HOOK.id, baitId: 0 }
  if (startingFightValue(forced, setup, fish.sizeLow) !== start)
    throw new Error(`forced start ${start} not applied for fish ${fish.id}`)
  const counts = [0, 0, 0, 0]
  for (const begin of sampleStarts(fish, rod, STARTS, SEED)) {
    const { outcome } = playFight(forced, setup, begin, spec, FRAME_CAP)
    counts[OUTCOMES.indexOf(outcome ?? 'unfinished')] += 1
  }
  return counts
}

/** One job: the curve over reachable starts and the reach table at the reference start. */
export function simulateJob(tables, stored, job) {
  const fish = tables.fish.find((f) => f.id === job.fishId)
  const { rod, spec } = storedPolicy(tables, stored, fish, job.method)
  const curve = Object.fromEntries(
    job.starts.map((start) => [start, countsAt(tables, fish, rod, spec, start)]),
  )
  const reach = {}
  for (const rodId of job.rodIds) {
    const other = tables.rod.find((r) => r.id === rodId)
    reach[other.reach] = countsAt(tables, fish, other, spec, job.ref)
  }
  return { key: job.key, rod: rod.id, curve, reach }
}

/** Smallest reach whose lost-tackle share is within 5 points of the longest rod's. */
export function neededReach(reach) {
  const reaches = Object.keys(reach)
    .map(Number)
    .sort((a, b) => a - b)
  const lost = (r) => reach[r][2]
  const limit = lost(reaches.at(-1)) + 0.05 * STARTS
  return reaches.find((r) => lost(r) <= limit)
}
