// Scores a policy over a fixed sample of random starts with the frame-exact fight engine.

import { castDistanceForBucket, createFight } from '../../entities/fight/index.js'
import { createPolicy } from './policy.js'

/** Frames after which an unfinished fight counts as unfinished (about 100 seconds of game time). */
export const FRAME_CAP = 6000

/** Rod range line in distance units (`reach x 336`, the same figure the engine uses). */
export const rodBoundary = (rod) => rod.reach * 336

/** Deterministic xorshift stream so the sample is identical on every machine. */
function stream(seed) {
  let x = seed >>> 0 || 1
  return (limit) => {
    x ^= x << 13
    x >>>= 0
    x ^= x >>> 17
    x ^= x << 5
    x >>>= 0
    return x % limit
  }
}

/** Highest starting-distance bucket (1..16, 256 units each) that lies inside the rod's range line. */
export function farthestBucket(rod) {
  return Math.max(1, Math.min(16, Math.ceil(rodBoundary(rod) / 256) - 1))
}

/**
 * The random starts a fight is scored on. Each start fixes what the player cannot see: the game's
 * random state (256 table rotations x 128 start heights), the frame counter, the cast distance
 * (a bucket of 256 units, 1..16, never beyond the rod's range line) and the fish size within its
 * species range. The same arguments always give the same list.
 */
export function sampleStarts(fish, rod, count, seed) {
  const draw = stream(seed)
  const buckets = farthestBucket(rod)
  const sizes = fish.sizeHigh - fish.sizeLow + 1
  return Array.from({ length: count }, () => ({
    rng: { index: draw(65536), lfsrA: draw(256), lfsrB: draw(256) },
    clock: draw(256),
    size: fish.sizeLow + draw(sizes),
    castDistance: castDistanceForBucket(1 + draw(buckets)),
  }))
}

/** Fight options for one start; `setup` names the tackle ({ rodId, fishId, hookId, baitId }). */
export function fightOptions(setup, start) {
  return {
    ...setup,
    rng: start.rng,
    clock: start.clock,
    size: start.size,
    environment: { castDistance: start.castDistance },
  }
}

/** Play one fight with a policy until it ends or the frame cap; returns { outcome, frames }. */
export function playFight(tables, setup, start, spec, cap = FRAME_CAP) {
  const fight = createFight(fightOptions(setup, start), tables)
  const policy = createPolicy(spec)
  let view = fight.view()
  while (!view.outcome && view.frame < cap) view = fight.step({ a: policy.next(view) })
  return { outcome: view.outcome, frames: view.frame }
}

const round1 = (value) => Math.round(value * 10) / 10

/**
 * Outcome shares for one policy over a list of starts: c caught %, e escaped %, l tackle lost %,
 * s unfinished % (still going at the frame cap) and f average frames of the caught fights.
 */
export function evaluatePolicy(tables, setup, spec, starts, cap = FRAME_CAP) {
  const count = { caught: 0, escaped: 0, 'lost-tackle': 0, unfinished: 0 }
  let caughtFrames = 0
  for (const start of starts) {
    const { outcome, frames } = playFight(tables, setup, start, spec, cap)
    count[outcome ?? 'unfinished'] += 1
    if (outcome === 'caught') caughtFrames += frames
  }
  const share = (n) => round1((100 * n) / starts.length)
  return {
    c: share(count.caught),
    e: share(count.escaped),
    l: share(count['lost-tackle']),
    s: share(count.unfinished),
    f: count.caught ? Math.round(caughtFrames / count.caught) : null,
  }
}
