// The random rolls that start each phase of a fight (bank 04: 9D86, 9D5C, 9D9F, 99C8, 8B2D).
// `s` is the mutable fight state, `p` the per-fight constants, `rng` the game random generator.

import { hwDivide, w16 } from './fight-core.js'

/** 04:9D86 - stamina for a new reeling spell. */
export function rollStamina(s, p, rng) {
  const half = p.staminaBase >> 1
  s.stamina = w16(half + hwDivide(rng.tableByte(), half).remainder)
}

/** 04:9D5C - how long the fish keeps running after A is released. */
export function rollRest(s, p, rng) {
  let divisor = w16(p.restBase - s.stamBase)
  if (divisor === 0) divisor = 1
  const value = w16(hwDivide(rng.tableByte(), divisor).remainder + s.stamBase)
  s.restTimer = value < 2 ? 2 : value
}

/** 04:9D9F - how many frames the fish rests before the next pull. */
export function rollIdle(s, p, rng) {
  s.idleTimer = w16(hwDivide(rng.tableByte(), p.idleSpread).remainder + 10)
}

/** 04:99C8 - start of a pull: new stamina and rest timer, reset the beat masks. */
export function startPull(s, p, rng) {
  rollStamina(s, p, rng)
  rollRest(s, p, rng)
  s.maskA = p.pullMask
  s.maskB = p.beatMask
  s.bottomFlag = 0
  if (s.stamBase !== 0) s.stamBase = w16(s.stamBase - 1)
}

/** 04:8B2D - first rest timer is the longer of two rolls, plus an eighth. */
export function restAdjust(s, p, rng) {
  const before = s.restTimer
  rollRest(s, p, rng)
  if (before > s.restTimer) s.restTimer = before
  s.restTimer = w16(s.restTimer + (s.restTimer >> 3))
  s.firstRest = 1
}

/** 04:8EE5 - which start-position class (1..3) the fish takes, from one table draw. */
export function drawStartClass(flags, rng) {
  const r = rng.tableByte()
  const f = (bit) => (flags & bit) !== 0
  if (r & 1) {
    if (r & 2) return f(4) ? 1 : f(2) ? 2 : 3
    return f(2) ? 2 : f(4) ? 1 : 3
  }
  if (r & 2) return f(2) ? 2 : f(1) ? 3 : 1
  return f(1) ? 3 : f(2) ? 2 : 1
}
