// The auto-finder: tunes the player-observable policies one setting at a time on a fixed sample of
// random starts and keeps the best, then re-scores the winners on a second, independent sample.

import { FRAME_CAP, evaluatePolicy, sampleStarts } from './evaluate.js'
import { packSpec, unpackSpec } from './policy.js'

/** Reaction time in frames the finder assumes: about 0.13 s for a player, 0 for frame-perfect play. */
export const REACTION = { human: 8, sharp: 0 }
/** Sizes and seeds of the two start samples (search, then an independent re-score). */
export const SAMPLE = { search: 200, searchSeed: 20261007, final: 1000, finalSeed: 7102026 }
/** A new setting must beat the one before it by more than this many points to replace it. */
const MIN_GAIN = 0.4
/** A tap trick is only offered when it adds at least this many points over the plain rhythm. */
export const TRICK_GAIN = 5

export const BASELINES = {
  hold: { kind: 'hold' },
  mash: { kind: 'mash', on: 3, off: 3 },
  reference: { kind: 'reference' },
}

/** Settings of the plain rhythm and the values tried for each, simplest value first. */
export const PLAIN_CHOICES = {
  stop: [3, 0, 1, 5, 8],
  slow: [0, 1, 2, 3],
  cap: [0, 30, 60, 100, 150, 240],
  first: [12, 6, 4, 9],
  wait: [0, 10, 30],
}

/** Tap settings tried on top of the best plain rhythm: taps while the fish runs near full speed. */
export const TAP_CHOICES = [16, 8].flatMap((tapEvery) =>
  [6, 5].map((tapSpeed) => ({ taps: 99, tapStart: 0, tapEvery, tapSpeed })),
)

const START = { kind: 'rhythm', wait: 0, stop: 3, slow: 0, cap: 0, first: 12 }

function score(tables, setup, starts, spec) {
  return { spec, m: evaluatePolicy(tables, setup, spec, starts) }
}

/** Try each value of one setting and keep the best; the simplest value wins small differences. */
function tuneSetting(tables, setup, starts, best, name) {
  let top = best
  for (const value of PLAIN_CHOICES[name]) {
    if (value === best.spec[name]) continue
    const next = score(tables, setup, starts, { ...best.spec, [name]: value })
    if (next.m.c > top.m.c + MIN_GAIN) top = next
  }
  return top
}

/** Best plain rhythm for one reaction time (two passes of one-setting-at-a-time tuning). */
export function tunePlain(tables, setup, starts, lag) {
  let best = score(tables, setup, starts, { ...START, lag })
  for (let pass = 0; pass < 2; pass++)
    for (const name of Object.keys(PLAIN_CHOICES))
      best = tuneSetting(tables, setup, starts, best, name)
  return best
}

/** The best plain rhythm plus, when it helps, the best tap variant of it (search sample only). */
export function searchAtReaction(tables, setup, starts, lag) {
  const plain = tunePlain(tables, setup, starts, lag)
  let trick = null
  if (plain.m.c < 99) {
    for (const taps of TAP_CHOICES) {
      const next = score(tables, setup, starts, { ...plain.spec, ...taps })
      if (next.m.c > (trick ?? plain).m.c + MIN_GAIN) trick = next
    }
  }
  return { plain, trick }
}

const rescore = (tables, setup, entry, starts) =>
  entry && { spec: entry.spec, m: evaluatePolicy(tables, setup, entry.spec, starts, FRAME_CAP) }

/**
 * Best of the frame-perfect winners and the human winners, replayed with no reaction time and as
 * they are (a perfect player can always copy a slower one).
 */
function bestCeiling(tables, setup, starts, sharp, human) {
  const replay = (entry) => entry && { spec: { ...entry.spec, lag: REACTION.sharp } }
  const entries = [sharp.trick, sharp.plain, replay(human.trick), replay(human.plain)]
  entries.push(human.trick, human.plain)
  let top = null
  for (const entry of entries.filter(Boolean)) {
    const scored = rescore(tables, setup, entry, starts)
    if (!top || scored.m.c > top.m.c) top = scored
  }
  return top
}

/**
 * Full analysis of one tackle setup: baselines, the best plain rhythm and tap trick at a human
 * reaction time, and the best of both at frame-perfect reaction. Winners are chosen on the search
 * sample and every reported figure comes from the independent final sample.
 */
export function analyseSetup(tables, setup, fish, rod) {
  const search = sampleStarts(fish, rod, SAMPLE.search, SAMPLE.searchSeed)
  const final = sampleStarts(fish, rod, SAMPLE.final, SAMPLE.finalSeed)
  const human = searchAtReaction(tables, setup, search, REACTION.human)
  const sharp = searchAtReaction(tables, setup, search, REACTION.sharp)
  const report = (entry) => rescore(tables, setup, entry, final)
  const plain = report(human.plain)
  const trick = report(human.trick)
  return {
    plain,
    trick: trick && trick.m.c >= plain.m.c + TRICK_GAIN ? trick : null,
    ceiling: bestCeiling(tables, setup, final, sharp, human),
    base: Object.fromEntries(
      Object.entries(BASELINES).map(([name, spec]) => [
        name,
        evaluatePolicy(tables, setup, spec, final, FRAME_CAP),
      ]),
    ),
  }
}

const packEntry = (entry) =>
  entry && { spec: packSpec(entry.spec), lag: entry.spec.lag, m: entry.m }

/** The compact record stored per tackle setup (see data/fight-policies.json). */
export function packAnalysis(result) {
  return {
    plain: packEntry(result.plain),
    trick: packEntry(result.trick),
    ceiling: packEntry(result.ceiling),
    base: result.base,
  }
}

/** A stored entry back to a runnable policy spec with its figures: { spec, m }. */
export const unpackEntry = (entry) =>
  entry && { spec: unpackSpec(entry.spec, entry.lag), m: entry.m }
