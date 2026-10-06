// Per-frame fight logic for the float/bait (method 0) and casting (method 1) styles.
// Each function names the ROM routine (bank 04) it transcribes. `s` is the mutable fight state,
// `p` the constant per-fight parameters, `pad` the latched controller ({ held, edge }).

import { isNegative, raiseBase, speedStep, w16 } from './fight-core.js'
import { lureAction } from './fight-lure-actions.js'
import { biteMachine } from './fight-lure.js'
import { rollIdle, rollRest, restAdjust, startPull } from './fight-rolls.js'

const nudgeY = (s, d) => {
  s.curY = w16(s.curY + d)
  s.prevY = w16(s.prevY + d)
}

/** 04:9C2B - one beat: spend stamina, else raise the fight value. */
function beat(s) {
  if (s.stamina !== 0) {
    s.stamina = w16(s.stamina - 1)
    return
  }
  s.fightValue = raiseBase(s.fightValue)
  if (s.fightValue === 0x3f) {
    s.fvAt63 = 1
    if (s.fishPos >= s.boundary) s.lostTackle = 1
  }
  s.maskB = raiseBase(s.maskB)
  s.maskA = raiseBase(s.maskA)
  s.beatCount = w16(s.beatCount + 1)
  if (s.beatCount === 0x18) {
    s.beatCount = 0
    s.fightBase = raiseBase(s.fightBase)
  }
}

/** 04:9C8A - what the line does while A is held. */
function pullMotion(s, p, clock) {
  if (s.mode === 2) {
    s.moveMode = s.fightValue < 15 ? 2 : 0
  } else if ((clock & p.beatMask) === 0) {
    s.moveMode = s.stamina === 0 ? 0 : 1
  }
}

/** 04:9A07 - A (or B) held, or the fish is already past the rod boundary. */
function heldPath(s, p, rng, clock) {
  if (s.mode === 2) {
    s.stamina = 0
    rollRest(s, p, rng)
    if (s.firstRest !== 0) restAdjust(s, p, rng)
    s.bottomFlag = 0
  }
  s.holding = 1
  pullMotion(s, p, clock)
  const mask = s.fishPos === 0 ? s.maskA >> 1 : s.maskA
  if ((mask & clock) === 0) nudgeY(s, -1)
  if ((clock & s.maskB) === 0) {
    beat(s)
    if (s.fvAt63 !== 0) {
      s.phase = 2
      s.stamina = 1
    }
  }
}

/** 04:9AD0 - the fish stops running: back to the resting phase. */
function toRest(s, p, rng) {
  rollIdle(s, p, rng)
  s.fightValue = s.fightBase
  s.phase = 0
  s.holding = 0
}

function restMask(s, p) {
  if (s.firstRest === 0) return p.pullMask
  return p.lureAction === 2 || p.lureAction === 7 ? p.pullMask >> 2 : p.pullMask >> 1
}

/** 04:9A62 - A released while the fish is inside the boundary: the fish runs. */
function releasedPath(s, p, rng, clock) {
  s.holding = 0
  s.moveMode = 2
  s.mode = 2
  if ((restMask(s, p) & clock) === 0) {
    if (s.bottomFlag === 0) nudgeY(s, 1)
    else if ((p.pullMask & clock) === 0) {
      nudgeY(s, -1)
      if (w16(s.curY - s.distNow) < p.gate) s.bottomFlag = 0
    }
  }
  if ((clock & p.beatMask) === 0) {
    s.restTimer = w16(s.restTimer - 1)
    if (s.restTimer === 0) toRest(s, p, rng)
  }
}

/** 04:99E9 - phase 1, the main fight. */
function fightPhase(s, p, rng, pad, clock) {
  s.prevX = s.curX
  s.prevY = s.curY
  if (s.fishPos < s.boundary && !pad.held) releasedPath(s, p, rng, clock)
  else heldPath(s, p, rng, clock)
}

/** 04:9973 - phase 0, the fish rests; a fresh A/B press cuts the rest short. */
function restPhase(s, p, rng, pad) {
  s.prevX = s.curX
  s.prevY = s.curY
  s.firstRest = 0
  if (s.idleTimer !== 0) {
    s.idleTimer = w16(s.idleTimer - 1)
    if (pad.edge) {
      s.idleTimer = 0
      s.mode = 1
      startPull(s, p, rng)
      s.holding = 1
      s.phase = 1
    }
  } else {
    s.mode = 2
    startPull(s, p, rng)
    s.phase = 1
  }
  s.moveMode = 0
}

/** 04:90AD - phase 2 for a flagged fly: releasing A lets the fish drift up on odd frames. */
function flyEscape(s, pad, clock) {
  if (pad.held) {
    s.moveMode = 1
    s.curY = w16(s.curY - 2)
    s.holding = 1
    return
  }
  if ((clock & 1) !== 0) s.curY = w16(s.curY - 1)
  s.moveMode = 0
  s.holding = 0
}

/** 04:905D - phase 2 lift: A pulls the fish up fast, otherwise it sinks back slowly. */
export function escapeLift(s, pad) {
  if (pad.held) {
    s.moveMode = 1
    s.curY = w16(s.curY - 2)
    s.holding = 1
    return
  }
  s.curY = w16(s.curY + 1)
  const d = w16(s.curY - s.distBase)
  s.moveMode = isNegative(d) || d < 0xa0 ? 1 : 0
  s.holding = 0
}

/** 04:905D / 04:90AD + 04:90E7 - phase 2, the fight value is full; the fish is on its way out. */
function escapePhase(s, p, pad, clock) {
  if (p.method === 3 && p.flyFlag !== 0 && s.lostTackle === 0) flyEscape(s, pad, clock)
  else escapeLift(s, pad)
  const speed = s.size <= 0x14 ? 3 : s.size <= 0x28 ? 4 : 5
  if (!isNegative(s.prevX) || s.prevX > 0xff80) s.prevX = w16(s.prevX - speed)
}

/** 04:900C for lures: the lure action (or the plain lift once tackle is lost), then the bite machine. */
function lurePhase(s, p, rng, pad, clock) {
  if (s.lostTackle !== 0) escapeLift(s, pad)
  else lureAction(s, p, rng, pad, clock)
  biteMachine(s, p, rng, pad, clock)
}

/** 04:8FC7 - the per-frame state update. */
export function stateUpdate(s, p, rng, pad, clock) {
  if (s.phase === 0) restPhase(s, p, rng, pad)
  else if (s.phase === 1) fightPhase(s, p, rng, pad, clock)
  else if (s.phase === 2 && p.method === 2) lurePhase(s, p, rng, pad, clock)
  else if (s.phase === 2) escapePhase(s, p, pad, clock)
}

/** Scroll bookkeeping shared by the reel-in and run-out movers (04:B3A7 / 04:B3F6 loop bodies). */
function scrollStep(s, dir) {
  s.distNow = w16(s.distNow + dir)
  s.distBase = w16(s.distBase + dir)
  nudgeY(s, dir)
  s.yLimLo = w16(s.yLimLo + dir)
  s.yLimHi = w16(s.yLimHi + dir)
}

/** 04:B397 - the fish runs: distance grows by up to `speedStep(restTimer)` per frame. */
function runOut(s) {
  if (s.fishPos >= s.boundary) {
    s.reelSpeed = 0
    return
  }
  let n = speedStep(s.restTimer)
  s.reelSpeed = n
  for (; n > 0; n--) {
    s.fishPos = w16(s.fishPos + 1)
    const onStep = s.fishPos < s.stepLimit && (s.fishPos & s.stepMask) === 0
    if (onStep && s.distBase < 0x100) scrollStep(s, 1)
  }
}

/** 04:B3E2 - the line is reeled in: distance shrinks by up to `speedStep(stamina)` per frame. */
function reelIn(s) {
  if (s.fishPos === 0) {
    s.reelSpeed = 0
    return
  }
  let n = speedStep(s.stamina)
  s.reelSpeed = w16(-n)
  for (; n > 0; n--) {
    s.fishPos = w16(s.fishPos - 1)
    if (isNegative(s.fishPos)) {
      s.fishPos = 0
      continue
    }
    if (s.fishPos >= s.stepLimit || (s.fishPos & s.stepMask) !== 0) continue
    s.distNow = w16(s.distNow - 1)
    if (isNegative(s.distNow)) s.distNow = 0
    s.distBase = w16(s.distBase - 1)
    if (isNegative(s.distBase)) s.distBase = 0
    nudgeY(s, -1)
    s.yLimLo = w16(s.yLimLo - 1)
    s.yLimHi = w16(s.yLimHi - 1)
  }
}

/** 04:B48D - keep the fish and the scroll inside the water view. */
function clampView(s) {
  const floor = w16(s.distBase + 0xa0)
  if (s.distNow > s.distBase) s.distNow = s.distBase
  if (!isNegative(s.curY) && floor < s.curY) {
    s.curY = floor
    s.distNow = s.distBase
  }
  if (!isNegative(s.prevY) && floor < s.prevY) {
    s.prevY = floor
    s.bottomFlag = 1
  }
  const d = w16(s.curY - s.distNow)
  if (isNegative(d)) {
    s.distNow = isNegative(s.curY) ? 0 : s.curY
  } else if (d > 0xa0) {
    s.distNow = w16(s.curY - 0xa0)
  }
}

/**
 * 04:A8C1 -> 04:B0F8 / 04:B48D - the movement half of the frame, driven by `moveMode`.
 * Scene type 4 (04:AF44) runs the mover twice per frame; every other scene runs it once.
 */
export function moveFish(s, passes = 1) {
  for (let i = 0; i < passes; i++) {
    if (s.moveMode === 0) s.reelSpeed = 0
    else if (s.moveMode === 1) reelIn(s)
    else if (s.moveMode === 2) runOut(s)
  }
  clampView(s)
}

/** 04:863E - the loop ends when the fish reaches the top of a fully scrolled view. */
export const reachedSurface = (s) => s.distNow === 0 && isNegative(s.curY)
