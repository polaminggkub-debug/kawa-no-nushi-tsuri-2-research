// Frame-exact port of Kawa no Nushi Tsuri 2's underwater fight loop (bank 04, 04:8000..04:B7FF).
// Pure and dependency-free: pass the numeric tables from data/fight-tables.json.

import { createGameRng } from './fight-core.js'
import { resolveEnvironment, resolveRecords } from './fight-params.js'
import { moveFish, reachedSurface, stateUpdate } from './fight-float.js'
import { fightConstants, initFloatFight, initLureFight, STATE_FIELDS } from './fight-setup.js'

export const SUPPORTED_METHODS = [0, 1, 2, 3]
const PHASES = ['resting', 'fighting', 'escaping']
const LURE_STAGES = ['approach', 'follow', 'leave', 'close', 'strike', 'dash', 'strike']
const DECOY_AYU_BAIT = 0x17

let defaultTables = null
/** Register the parsed data/fight-tables.json once so createFight(params) needs no second argument. */
export function setFightTables(tables) {
  defaultTables = tables
}

/** Expand a number into a full random-generator state (deterministic, for simulations). */
export function rngFromSeed(seed) {
  let x = seed >>> 0 || 1
  const next = () => {
    x ^= x << 13
    x >>>= 0
    x ^= x >>> 17
    x ^= x << 5
    x >>>= 0
    return x
  }
  return { index: next() & 0xffff, lfsrA: next() & 0xff, lfsrB: next() & 0xff }
}

function assertSupported(records, ids) {
  if (records.fish.restBase === 0 && records.fish.staminaBase === 0) {
    throw new RangeError(
      `Fish profile ${ids.fishId} is an empty placeholder: no fight is ever started.`,
    )
  }
  if (ids.baitId === DECOY_AYU_BAIT) {
    throw new RangeError('Decoy-ayu (ともづり) fights use a separate loop and are not supported.')
  }
}

function phaseName(fight) {
  const { s, p } = fight
  if (fight.outcome) return 'ended'
  return p.method === 2 && s.phase === 2 && s.fvAt63 === 0 ? 'chasing' : PHASES[s.phase]
}

function describe(fight) {
  const { s, p } = fight
  const lure =
    p.method === 2
      ? {
          stage: LURE_STAGES[s.lureSub],
          strikeOpen: s.phase === 2 && [4, 6].includes(s.lureSub) && s.lureTimer > 0,
        }
      : null
  return {
    frame: fight.frame,
    clock: fight.clock,
    phase: phaseName(fight),
    lure,
    outcome: fight.outcome,
    fishPos: s.fishPos,
    boundary: s.boundary,
    fightValue: s.fightValue,
    stamina: s.stamina,
    restTimer: s.restTimer,
    idleTimer: s.idleTimer,
    holding: s.holding === 1,
    reeling: s.moveMode === 1,
    fishRunning: s.moveMode === 2,
    surfaceDistance: s.distNow,
    fishHeight: s.curY,
    pastBoundary: s.fishPos >= s.boundary,
    lostTackleRisk: s.lostTackle === 1,
  }
}

/** Outcome when the fish reaches the surface (04:8689 hands over to 01:800C). */
function surfaceOutcome(s) {
  if (s.phase !== 2) return 'caught'
  return s.lostTackle === 1 ? 'lost-tackle' : 'escaped'
}

function advance(fight, input) {
  const { s, p, rng } = fight
  const a = Boolean(input.a)
  const b = Boolean(input.b)
  fight.clock = (fight.clock + 1) & 0xff
  const pad = { held: a || b, edge: (a && !fight.prevA) || (b && !fight.prevB) }
  fight.prevA = a
  fight.prevB = b
  moveFish(s, p.movePasses)
  if (reachedSurface(s)) fight.outcome = surfaceOutcome(s)
  else stateUpdate(s, p, rng, pad, fight.clock)
}

function handle(fight) {
  return {
    hp: fight.hp,
    /** Advance one video frame. Input: { a, b } (A and B act identically; d-pad is ignored). */
    step(input = {}) {
      if (fight.outcome) return describe(fight)
      fight.frame += 1
      advance(fight, input)
      return describe(fight)
    },
    view: () => describe(fight),
    /** Independent copy at the current frame (for look-ahead and schedule search). */
    clone() {
      return handle({
        ...fight,
        s: { ...fight.s },
        rng: createGameRng(fight.table, fight.rng.state),
      })
    },
    /** Raw game variables, keyed as in the ROM trace fixtures. */
    vars() {
      const { index, lfsrA, lfsrB } = fight.rng.state
      const { s, p } = fight
      return { ...s, gate: p.gate, clock: fight.clock, rngIndex: index, rngA: lfsrA, rngB: lfsrB }
    },
  }
}

function newFight(options, tables) {
  const ids = {
    rodId: options.rodId,
    fishId: options.fishId,
    hookId: options.hookId,
    baitId: options.baitId ?? 0,
    flyId: options.flyId,
    lureId: options.lureId,
  }
  const records = resolveRecords(tables, ids)
  assertSupported(records, ids)
  const env = resolveEnvironment(records.fish, options)
  const seed = typeof options.rng === 'number' ? rngFromSeed(options.rng) : options.rng
  const rng = createGameRng(tables.rng.table, seed)
  const clock = (options.clock ?? 0) & 0xff
  const base = { hp: options.hp ?? null, table: tables.rng.table, rng, clock, frame: 0 }
  const edge = { prevA: false, prevB: false, outcome: null }
  if (options.resume) {
    const s = Object.fromEntries(STATE_FIELDS.map((key) => [key, options.resume[key] ?? 0]))
    return { ...base, ...edge, s, p: fightConstants(records, env) }
  }
  const init = records.method === 2 ? initLureFight : initFloatFight
  const { s, p } = init(tables, records, ids.fishId, env, rng)
  stateUpdate(s, p, rng, { held: false, edge: false }, clock)
  return { ...base, ...edge, s, p }
}

/**
 * Start a fight at hook-set. Required: rodId, fishId, hookId. Optional: baitId (0 = none), size (cm),
 * hp (accepted, unused by the loop), clock (frame counter, only its low 6 bits matter), rng (state
 * object { index, lfsrA, lfsrB } or a number), environment { castDistance, sceneType, waterDepth,
 * vehicle, lureAction }, resume (raw variables from vars() to continue a recorded fight).
 */
export function createFight(options, tables = defaultTables) {
  if (!tables) throw new Error('Fight tables not loaded: call setFightTables(tables) first')
  return handle(newFight(options, tables))
}
