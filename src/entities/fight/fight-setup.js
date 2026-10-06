// Fight set-up for the float/bait, casting and fly styles: bank 04 routines 8499, 8C96..8F83, 868E.

import { hwDivide, halveBase, multiply16x8, raiseBase, w16 } from './fight-core.js'
import { moveFish } from './fight-float.js'
import { resetFish } from './fight-lure.js'
import { drawStartClass, restAdjust, startPull } from './fight-rolls.js'

// 04:852C - raw cast reach ($1F77, a squared-distance figure) to the starting fish distance.
const DISTANCE_BUCKETS = [
  0x100, 0x400, 0x900, 0x1000, 0x1900, 0x2400, 0x3100, 0x4000, 0x5100, 0x6400, 0x7900, 0x9000,
  0xa900, 0xc400, 0xe100,
]

/** Raw `castDistance` that falls in distance bucket 1..16 (its midpoint). */
export const castDistanceForBucket = (bucket) => (16 * bucket - 8) ** 2

/** Starting distance ($1ED5) for a raw cast reach: 0x100 .. 0x1000 in 0x100 steps. */
export function distanceBucket(castDistance) {
  const index = DISTANCE_BUCKETS.findIndex((limit) => castDistance < limit)
  return (index < 0 ? DISTANCE_BUCKETS.length + 1 : index + 1) * 0x100
}

// 04:84E3 - being afloat ($0858 >= 3) doubles the step granularity of the scroll.
const WIDER_MASK = { 0x3f: 0x7f, 0x1f: 0x3f, 0x0f: 0x1f, 0x07: 0x0f }

/** 04:8C96 - stamina base from the fish's size relative to its profile's size range. */
function staminaBase(size, fish) {
  const quarter = fish.restBase >> 2
  if (size <= fish.sizeLow) {
    const ratio = hwDivide(size << 8, fish.sizeLow).quotient
    return w16(multiply16x8(ratio, quarter) >> 8)
  }
  if (fish.sizeLow === fish.sizeHigh) return fish.restBase >> 1
  const ratio = hwDivide(w16((size - fish.sizeLow) << 8), fish.sizeHigh - fish.sizeLow).quotient
  return w16((multiply16x8(ratio, quarter) >> 8) + quarter)
}

const sizeBand = (size) => (size <= 0x0f ? 0 : size <= 0x23 ? 1 : 2)

// 04:8DC0 - hook selector: how the fish size band changes the starting fight value.
const HOOK_STEPS = [
  [halveBase, (v) => v, raiseBase],
  [(v) => v, halveBase, (v) => v],
  [raiseBase, (v) => v, halveBase],
]
// 04:8E40 - rod selector: number of times the fight-value base is raised, by size band.
const ROD_RAISES = [
  [0, 1, 2],
  [1, 0, 1],
  [2, 1, 0],
]

/** 04:8D2A..8EC1 - the starting fight value after rod, hook, bait and size adjustments. */
export function startingFightValue(records, fishId, size) {
  const { rod, fish, hook, bait, fly, lure } = records
  let value = fish.fightStart
  if (rod.selector === 0) value = halveBase(value)
  else if (rod.selector === 2) value = raiseBase(value)
  if (lure) {
    // 04:8D9C - a lure's own match / selector replaces the hook and bait step.
    if (lure.fishMatch === fishId) value = halveBase(value)
    else if (lure.selector <= 2) value = HOOK_STEPS[lure.selector][sizeBand(size)](value)
  } else if (fly) {
    // 04:8DB5 - a fly's own selector replaces the hook/bait step; there is no fish match for flies.
    if (fly.selector <= 2) value = HOOK_STEPS[fly.selector][sizeBand(size)](value)
  } else if (bait.fishMatch === fishId || hook.fishMatch === fishId) value = halveBase(value)
  else if (hook.selector <= 2) value = HOOK_STEPS[hook.selector][sizeBand(size)](value)
  if (rod.fishMatch !== fishId && rod.selector <= 2) {
    for (let i = ROD_RAISES[rod.selector][sizeBand(size)]; i > 0; i--) value = raiseBase(value)
  }
  return value
}

/** 04:8BEC - starting scroll and fish height for a start-position class. */
function placeFish(s, startClass, rng) {
  const offset = (rng.lfsr() >> 1) + 0x20
  s.prevX = 0xb0
  const base = s.distBase
  const table = {
    1: [0, offset],
    2: [base >> 1, (base >> 1) + offset],
    3: [base, base + offset],
    4: [base, base + 0xa0],
  }
  ;[s.distNow, s.prevY] = table[startClass].map(w16)
}

// Variables the loop keeps between frames (RAM $1Exx/$1Fxx words), in the engine's own names.
export const STATE_FIELDS = [
  'phase',
  'mode',
  'restTimer',
  'maskA',
  'maskB',
  'fightValue',
  'stamina',
  'lostTackle',
  'fvAt63',
  'idleTimer',
  'firstRest',
  'fishPos',
  'boundary',
  'distBase',
  'distNow',
  'curX',
  'curY',
  'prevX',
  'prevY',
  'moveMode',
  'reelSpeed',
  'holding',
  'bottomFlag',
  'stepMask',
  'stepLimit',
  'stamBase',
  'beatCount',
  'fightBase',
  'size',
  'lureSub',
  'lureTimer',
  'yLimLo',
  'yLimHi',
  'lureCount',
]

function initialState(records, env, tables) {
  const mask0 = tables.sceneStepMask[env.sceneType]
  const fishPos = distanceBucket(env.castDistance)
  let distBase = hwDivide(fishPos, mask0 + 1).quotient
  if (env.waterDepth === 3 && distBase < 0xe0) distBase = 0x100
  if (env.waterDepth === 2 && distBase < 0x70) distBase = 0x70
  distBase = Math.min(distBase, 0x100)
  const stepMask = env.vehicle >= 3 ? (WIDER_MASK[mask0] ?? mask0) : mask0
  const s = Object.fromEntries(STATE_FIELDS.map((key) => [key, 0]))
  return Object.assign(s, {
    fishPos,
    distBase,
    stepMask,
    stepLimit: w16(stepMask << 8),
    boundary: w16(multiply16x8(0x150, records.rod.reach)),
    stamBase: staminaBase(env.size, records.fish),
    size: env.size,
  })
}

/** Constants of one fight: profile fields, the beat-gate threshold (04:8EC1) and scene quirks. */
export function fightConstants(records, env) {
  const { fish } = records
  return {
    method: records.method,
    flyFlag: records.fly ? records.fly.flag : 0,
    movePasses: env.sceneType === 4 ? 2 : 1,
    staminaBase: fish.staminaBase,
    restBase: fish.restBase,
    beatMask: fish.beatMask,
    idleSpread: fish.idleSpread,
    pullMask: fish.pullMask,
    flags: fish.flags,
    gate: fish.flags & 4 ? 0x20 : fish.flags & 2 ? 0x50 : 0x80,
    lureAction: records.lure ? records.lure.action : env.lureAction,
    approach: fish.approach,
    biteMax: fish.biteMax,
    biteMin: fish.biteMin,
  }
}

/** Start-position class: casting always 4 (04:877A), a flagged fly 1 (04:87E4), others draw (04:8EE5). */
function startClass(records, p, rng) {
  if (records.method === 1) return 4
  if (records.method === 3 && p.flyFlag !== 0) return 1
  return drawStartClass(p.flags, rng)
}

/** 04:8B83 - where the lure hangs when the fish strikes (`depth` is $1F9D). */
function placeLure(s, depth) {
  const base = s.distBase
  s.curX = 0xd0
  if (w16(base + 0xa0) < depth) {
    s.distNow = base
    s.curY = w16(base + 0xa0)
  } else if (w16(base + 0x70) < depth) {
    s.distNow = base
    s.curY = depth
  } else {
    s.distNow = depth > 0x70 ? depth - 0x70 : 0
    s.curY = depth === 0 ? 1 : depth
  }
}

/** 04:868E (lure branch) - the fight starts as the lure chase, in phase 2, with stamina 1. */
export function initLureFight(tables, records, fishId, env, rng) {
  const s = initialState(records, env, tables)
  s.fightBase = startingFightValue(records, fishId, env.size)
  const p = fightConstants(records, env)
  s.moveMode = env.moveMode
  placeLure(s, env.lureDepth)
  placeFish(s, drawStartClass(p.flags, rng), rng)
  resetFish(s, rng)
  startPull(s, p, rng)
  s.phase = 2
  s.stamina = 1
  moveFish(s)
  return { s, p }
}

/** 04:868E (float/casting/fly branch) - build the fight state and consume the same random draws. */
export function initFloatFight(tables, records, fishId, env, rng) {
  const s = initialState(records, env, tables)
  s.fightBase = startingFightValue(records, fishId, env.size)
  const p = fightConstants(records, env)
  placeFish(s, startClass(records, p, rng), rng)
  s.curX = s.prevX
  s.curY = s.prevY
  s.mode = 2
  s.moveMode = 2
  startPull(s, p, rng)
  s.fightValue = s.fightBase
  restAdjust(s, p, rng)
  s.phase = 1
  moveFish(s)
  return { s, p }
}
