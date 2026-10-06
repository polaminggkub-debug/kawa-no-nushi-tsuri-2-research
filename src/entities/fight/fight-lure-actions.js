// The ten lure actions (bank 04: 916D dispatcher, 91DF..9467): how A moves the lure each frame.

import { w16 } from './fight-core.js'

/** 04:9467 - draw the lure up one step (never above the top unless the fish is at the bank). */
function lureUp(s) {
  if (s.fvAt63 !== 0 || s.fishPos === 0) s.curY = w16(s.curY - 1)
  else if (s.curY > 2) s.curY = w16(s.curY - 1)
  else s.curY = 2
}

const sink = (s) => {
  s.curY = w16(s.curY + 1)
}

/** Held branch common tail: reeling, A held. */
function pressed(s) {
  s.moveMode = 1
  s.holding = 1
}
function released(s) {
  s.moveMode = 0
  s.holding = 0
}

const ACTIONS = {
  // 04:91DF (actions 0 and 9): held lifts the lure on 4th frames while the fish is out; released sinks.
  0(s, p, rng, held, clock) {
    if (!held) return (sink(s), released(s))
    if (((s.fishPos ? 3 : 0) & clock) === 0) lureUp(s)
    pressed(s)
  },
  // 04:921D: as action 0 but released sinks only on even frames.
  1(s, p, rng, held, clock) {
    if (held) return ACTIONS[0](s, p, rng, held, clock)
    if ((clock & 1) === 0) sink(s)
    released(s)
  },
  // 04:9263 (actions 2 and 7): held jitters down on a one-in-eight draw; it rises on even frames either way.
  2(s, p, rng, held, clock) {
    if (held && (rng.tableByte() & 7) === 0) s.curY = w16(s.curY + (clock & 3))
    if ((clock & 1) === 0) lureUp(s)
    if (held) pressed(s)
    else released(s)
  },
  // 04:92B5: held sinks by depth band while the fish is out; released rises on even frames.
  3(s, p, rng, held, clock) {
    if (!held) return risingRelease(s, clock)
    if (s.fishPos === 0) s.curY = w16(s.curY - 1)
    else {
      const bands = [0x30, 0x40, 0x60, 0x80]
      const index = bands.findIndex((limit) => s.curY < limit)
      const mask = index < 0 ? 0x1f : [1, 3, 7, 15][index]
      if ((mask & clock) === 0) sink(s)
    }
    pressed(s)
  },
  // 04:932D: like action 3 with coarser depth bands.
  4(s, p, rng, held, clock) {
    if (!held) return risingRelease(s, clock)
    if (s.fishPos === 0) s.curY = w16(s.curY - 1)
    else {
      const mask = s.curY < 0x100 ? 1 : s.curY < 0x180 ? 3 : 7
      if ((mask & clock) === 0) sink(s)
    }
    pressed(s)
  },
  // 04:938F: held lifts every fourth frame; released sinks on even frames.
  5(s, p, rng, held, clock) {
    if (!held) {
      if ((clock & 1) === 0) sink(s)
      return released(s)
    }
    if (s.fishPos === 0) s.curY = w16(s.curY - 1)
    else if ((clock & 3) === 0) lureUp(s)
    pressed(s)
  },
  // 04:93D5: held lifts every frame; released sinks every frame.
  6(s, p, rng, held) {
    if (!held) return (sink(s), released(s))
    lureUp(s)
    pressed(s)
  },
  // 04:9401: held lifts (freely when the fish is at the bank); released sinks on even frames.
  8(s, p, rng, held, clock) {
    if (!held) {
      if ((clock & 1) === 0) sink(s)
      return released(s)
    }
    if (s.fishPos === 0) s.curY = w16(s.curY - 1)
    else lureUp(s)
    pressed(s)
  },
}
ACTIONS[7] = ACTIONS[2]
ACTIONS[9] = ACTIONS[0]

function risingRelease(s, clock) {
  if ((clock & 1) === 0) lureUp(s)
  released(s)
}

/** 04:916D - one frame of the lure action chosen by the lure record. */
export function lureAction(s, p, rng, pad, clock) {
  const act = ACTIONS[p.lureAction]
  if (act) act(s, p, rng, pad.held, clock)
}
