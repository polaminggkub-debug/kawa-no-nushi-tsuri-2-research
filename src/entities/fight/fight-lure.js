// Lure style (method 2): the lure-chase game that precedes the real fight (bank 04).
// While the fight phase is 2 the lure is worked with A (ten lure actions, 04:916D) and a fish
// approaches, circles and bites (04:9491). A fresh A press in the bite window hooks the fish and
// hands over to the shared fight (phase 1).

import { hwDivide, isNegative, speedStep, w16 } from './fight-core.js'
import { drawStartClass, restAdjust, startPull } from './fight-rolls.js'

/** 04:98CA - fish swim speed from its size. */
const swimSpeed = (size) => (size <= 0x14 ? 2 : size <= 0x28 ? 3 : 4)

/** 04:9D06 + 04:99C8 + 04:8B2D: the fish is hooked, the shared fight takes over. */
function hookUp(s, p, rng) {
  s.mode = 2
  s.moveMode = 2
  startPull(s, p, rng)
  s.fightValue = s.fightBase
  restAdjust(s, p, rng)
  s.phase = 1
  s.curX = 0xb0
}

/** 04:9704 - the approach is over: the fish starts to follow the lure. */
function startFollow(s, p, rng) {
  const half = p.approach >> 1
  s.lureTimer = w16(hwDivide(rng.lfsr(), half).remainder + half)
  s.lureSub = 1
  s.lureCount = 0
}

/** 04:9726 - the fish is level with the lure inside the bite box: open a bite window. */
function checkBite(s, p, rng) {
  if (!(s.prevX > 0xcc && s.prevX < 0xd4)) return
  let low = w16(s.curY - 4)
  if (isNegative(low)) low = 0
  if (low >= s.prevY || w16(s.curY + 4) <= s.prevY) return
  s.lureSub = s.lureSub === 5 ? 6 : 4
  s.prevY = s.curY
  s.prevX = s.curX
  const span = w16(p.biteMax - p.biteMin)
  s.lureTimer = w16(hwDivide(rng.tableByte(), span).remainder + p.biteMin)
}

/** 04:986C - how long the fish follows before its next move. */
function followTimer(s, rng) {
  s.lureTimer = (rng.lfsr() >> 1) + 0x10
  const d = w16(s.curX - s.prevX)
  if (isNegative(d)) {
    s.lureSub = 2
    s.lureTimer = 8
  } else if (d < s.lureTimer) s.lureTimer = d
}

const retreat = (s) => {
  s.lureSub = 2
  s.lureTimer = 8
}
const inWindow = (s) => s.curY > s.yLimLo && s.curY < s.yLimHi

/** 04:97FD - fish is wary: a press while the lure is inside its height window keeps it interested. */
function interest(s, rng, pad) {
  if (s.lureTimer === 0) {
    if (!inWindow(s)) return retreat(s)
    s.lureSub = 3
    return followTimer(s, rng)
  }
  s.lureTimer = w16(s.lureTimer - 1)
  if (!pad.edge) return
  if (inWindow(s)) {
    s.lureSub = 3
    followTimer(s, rng)
  } else if (s.prevX < 0x80) {
    s.lureSub = 0
    followTimer(s, rng)
  } else retreat(s)
}

/** 04:9898 - fish that need repeated presses (flag 0x10 with lure actions 2, 3, 7). */
function tapTest(s, rng, pad) {
  if (s.lureTimer === 0) return retreat(s)
  s.lureTimer = w16(s.lureTimer - 1)
  if (s.lureTimer === 0 && s.lureCount !== 0) {
    s.lureSub = 5
    followTimer(s, rng)
  }
  if (pad.edge) s.lureCount = w16(s.lureCount + 1)
}

/** 04:9796 - sub-state 1: the fish follows the lure and decides whether to take it. */
function follow(s, p, rng, pad) {
  if (s.fishPos === 0 || s.prevX > 0xc8) return retreat(s)
  if ((p.flags & 0x10) !== 0 && [2, 3, 7].includes(p.lureAction)) tapTest(s, rng, pad)
  else interest(s, rng, pad)
}

function stepToward(s) {
  if (s.curY === s.prevY) return
  s.prevY = w16(s.prevY + (s.curY > s.prevY ? 1 : -1))
}

/** Sub-states 0 and 3 (04:9491 / 04:954E): the fish swims in; 3 follows the lure's height every frame. */
function swimIn(s, p, rng, clock) {
  const everyFrame = s.lureSub === 3
  const speed = swimSpeed(s.size)
  if (s.lureTimer !== 0) {
    s.lureTimer = w16(s.lureTimer - speed)
    if (isNegative(s.lureTimer)) s.lureTimer = 0
    s.prevX = w16(s.prevX + speed)
  } else startFollow(s, p, rng)
  if (everyFrame || (clock & 1) === 0) stepToward(s)
  checkBite(s, p, rng)
}

/** 04:98F0 - fish speed and vertical step towards the lure for sub-state 5. */
function approachVector(s) {
  const speed = swimSpeed(s.size)
  let reach = w16(s.curX - s.prevX)
  if (isNegative(reach)) reach = 0
  const rise = w16(s.prevY - s.curY)
  if (isNegative(rise)) return { speed, dy: 1 }
  if (rise > reach) return { speed, dy: w16(0xffff - speed) }
  if (rise >> 1 > reach) return { speed, dy: w16(-speed) }
  if (rise >> 2 > reach) return { speed, dy: w16(-(speed >> 1)) }
  return { speed, dy: 0xffff }
}

/** 04:9602 - sub-state 5: the fish closes in diagonally. */
function swimDiagonal(s, p, rng) {
  const { speed, dy } = approachVector(s)
  if (s.lureTimer !== 0) {
    s.lureTimer = w16(s.lureTimer - speed)
    if (isNegative(s.lureTimer)) s.lureTimer = 0
    s.prevX = w16(s.prevX + speed)
    s.prevY = w16(s.prevY + dy)
  } else startFollow(s, p, rng)
  checkBite(s, p, rng)
}

/** 04:959A - bite window: a fresh press hooks the fish. */
function biteWindow(s, p, rng, pad) {
  if (s.lureTimer === 0) retreat(s)
  else {
    s.lureTimer = w16(s.lureTimer - 1)
    if (pad.edge) {
      hookUp(s, p, rng)
      s.lureSub = 2
      s.lureTimer = 0
    }
  }
  s.prevY = s.curY
  s.prevX = s.curX
}

/** 04:9651 - second bite window: the same hook-up, then the lure drops with the fish. */
function secondBite(s, p, rng, pad) {
  s.curX = 0xb0
  if (s.lureTimer === 0) {
    s.curX = 0xd0
    retreat(s)
  } else {
    s.lureTimer = w16(s.lureTimer - 1)
    if (pad.edge) {
      hookUp(s, p, rng)
      s.lureSub = 2
      s.lureTimer = 0
    }
  }
  s.moveMode = 2
  s.restTimer = p.restBase
  s.reelSpeed = speedStep(s.restTimer)
  s.curY = w16(s.curY + Math.max(1, s.reelSpeed >> 1))
  const d = w16(s.curY - s.distBase)
  if (!isNegative(d) && d >= 0xa0) s.curY = w16(s.distBase + 0xa0)
  s.prevY = s.curY
  s.prevX = s.curX
}

/** 04:8C58 - new fish height for a start-position class (the scroll is left alone). */
function repositionFish(s, startClass, rng) {
  const t = (rng.lfsr() >> 1) + 0x20
  const half = s.distBase >> 1
  s.prevY = w16(startClass === 1 ? t : startClass === 2 ? half + t : s.distBase + t)
}

/** 04:8B53 - the fish starts over from the left edge. */
export function resetFish(s, rng) {
  s.prevX = 0xff80
  s.lureSub = 0
  s.lureTimer = (rng.lfsr() >> 2) + 0xc0
  s.yLimLo = Math.max(0, s.prevY - 0x20) & 0xffff
  s.yLimHi = w16(s.prevY + 0x20)
}

/** 04:94EB - sub-state 2: the fish swims off to the left and, once away, may start over. */
function swimOff(s, p, rng) {
  if (s.lureTimer !== 0) {
    s.lureTimer = w16(s.lureTimer - 1)
    return
  }
  const speed = swimSpeed(s.size)
  if (!isNegative(s.prevX) || s.prevX > 0xff80) s.prevX = w16(s.prevX - speed)
  else if (s.fvAt63 === 0 && s.moveMode === 1 && s.fishPos !== 0) {
    repositionFish(s, drawStartClass(p.flags, rng), rng)
    resetFish(s, rng)
  }
}

/** 04:9491 - the bite machine, run every frame of phase 2 after the lure action. */
export function biteMachine(s, p, rng, pad, clock) {
  switch (s.lureSub) {
    case 0:
    case 3:
      return swimIn(s, p, rng, clock)
    case 1:
      return follow(s, p, rng, pad)
    case 2:
      return swimOff(s, p, rng)
    case 4:
      return biteWindow(s, p, rng, pad)
    case 5:
      return swimDiagonal(s, p, rng)
    case 6:
      return secondBite(s, p, rng, pad)
    default:
  }
}
