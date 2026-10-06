(() => {
  // src/entities/fight/fight-core.js
  var w16 = (value) => value & 65535;
  var isNegative = (value) => (value & 32768) !== 0;
  function hwDivide(dividend, divisor) {
    const d = divisor & 255;
    if (d === 0) return { quotient: 65535, remainder: w16(dividend) };
    return { quotient: Math.floor(w16(dividend) / d), remainder: w16(dividend) % d };
  }
  var multiply16x8 = (a, b) => w16(a) * (b & 255) & 16777215;
  function createGameRng(table, seed = {}) {
    const state = {
      index: w16(seed.index ?? 0),
      lfsrA: (seed.lfsrA ?? 123) & 255,
      lfsrB: (seed.lfsrB ?? 52) & 255
    };
    return {
      state,
      tableByte() {
        state.index = w16(state.index + 1);
        return table[state.index & 255];
      },
      lfsr() {
        let a = (state.lfsrB & 16) << 3;
        a = ((a ^ state.lfsrB) & 255) << 1;
        state.lfsrB = (a & 255 | a >> 8) & 255;
        state.lfsrA = state.lfsrB + state.lfsrA & 255;
        return state.lfsrA;
      },
      snapshot: () => ({ ...state })
    };
  }
  function speedStep(value) {
    if (value === 0) return 0;
    if (value <= 5) return 1;
    if (value <= 15) return 2;
    if (value <= 30) return 3;
    if (value <= 50) return 4;
    if (value <= 75) return 5;
    return 6;
  }
  var halveBase = (value) => value >> 1;
  var raiseBase = (value) => (value << 1 | 1) & 63;

  // src/entities/fight/fight-params.js
  var METHOD_BY_ROD_STYLE = { 1: 0, 2: 1, 4: 2, 8: 3 };
  var DEFAULT_ENVIRONMENT = {
    castDistance: 900,
    // $1F77, raw cast reach before bucketing
    sceneType: 5,
    // $0850, underwater scene variant (0..13)
    waterDepth: 1,
    // $1324, 1..3
    vehicle: 1,
    // $0858, values >= 3 widen the step mask
    lureAction: 0,
    // $1226, stale lure-record field read by the float rest path (lure style: the lure's own)
    lureDepth: 0,
    // $1F9D, how deep the lure was when the fish struck (lure style)
    moveMode: 0
    // $1EBB left over from before the fight (lure style, first frame only)
  };
  function lookup(tables, kind, id) {
    const row = tables[kind]?.find((entry) => entry.id === id);
    if (!row) throw new RangeError(`Unknown ${kind} id ${id}`);
    return row;
  }
  function resolveRecords(tables, ids) {
    const rod = lookup(tables, "rod", ids.rodId);
    const method = METHOD_BY_ROD_STYLE[rod.style];
    if (method === void 0) throw new RangeError(`Rod ${ids.rodId} has an unknown style code`);
    const fish = lookup(tables, "fish", ids.fishId);
    if (method === 2) return { method, rod, fish, lure: lookup(tables, "lure", ids.lureId) };
    if (method === 3) return { method, rod, fish, fly: lookup(tables, "fly", ids.flyId) };
    return {
      method,
      rod,
      fish,
      hook: lookup(tables, "hook", ids.hookId),
      bait: ids.baitId ? lookup(tables, "bait", ids.baitId) : { fishMatch: 0 }
    };
  }
  function resolveEnvironment(fish, options = {}) {
    const env = { ...DEFAULT_ENVIRONMENT, ...options.environment };
    const size = options.size ?? fish.sizeLow;
    if (!Number.isInteger(size) || size < 1 || size > 255) throw new RangeError("size must be 1..255");
    const scene = env.sceneType;
    if (!Number.isInteger(scene) || scene < 0 || scene > 13) throw new RangeError("sceneType 0..13");
    return { ...env, size };
  }

  // src/entities/fight/fight-lure-actions.js
  function lureUp(s) {
    if (s.fvAt63 !== 0 || s.fishPos === 0) s.curY = w16(s.curY - 1);
    else if (s.curY > 2) s.curY = w16(s.curY - 1);
    else s.curY = 2;
  }
  var sink = (s) => {
    s.curY = w16(s.curY + 1);
  };
  function pressed(s) {
    s.moveMode = 1;
    s.holding = 1;
  }
  function released(s) {
    s.moveMode = 0;
    s.holding = 0;
  }
  var ACTIONS = {
    // 04:91DF (actions 0 and 9): held lifts the lure on 4th frames while the fish is out; released sinks.
    0(s, p, rng, held, clock) {
      if (!held) return sink(s), released(s);
      if (((s.fishPos ? 3 : 0) & clock) === 0) lureUp(s);
      pressed(s);
    },
    // 04:921D: as action 0 but released sinks only on even frames.
    1(s, p, rng, held, clock) {
      if (held) return ACTIONS[0](s, p, rng, held, clock);
      if ((clock & 1) === 0) sink(s);
      released(s);
    },
    // 04:9263 (actions 2 and 7): held jitters down on a one-in-eight draw; it rises on even frames either way.
    2(s, p, rng, held, clock) {
      if (held && (rng.tableByte() & 7) === 0) s.curY = w16(s.curY + (clock & 3));
      if ((clock & 1) === 0) lureUp(s);
      if (held) pressed(s);
      else released(s);
    },
    // 04:92B5: held sinks by depth band while the fish is out; released rises on even frames.
    3(s, p, rng, held, clock) {
      if (!held) return risingRelease(s, clock);
      if (s.fishPos === 0) s.curY = w16(s.curY - 1);
      else {
        const bands = [48, 64, 96, 128];
        const index = bands.findIndex((limit) => s.curY < limit);
        const mask = index < 0 ? 31 : [1, 3, 7, 15][index];
        if ((mask & clock) === 0) sink(s);
      }
      pressed(s);
    },
    // 04:932D: like action 3 with coarser depth bands.
    4(s, p, rng, held, clock) {
      if (!held) return risingRelease(s, clock);
      if (s.fishPos === 0) s.curY = w16(s.curY - 1);
      else {
        const mask = s.curY < 256 ? 1 : s.curY < 384 ? 3 : 7;
        if ((mask & clock) === 0) sink(s);
      }
      pressed(s);
    },
    // 04:938F: held lifts every fourth frame; released sinks on even frames.
    5(s, p, rng, held, clock) {
      if (!held) {
        if ((clock & 1) === 0) sink(s);
        return released(s);
      }
      if (s.fishPos === 0) s.curY = w16(s.curY - 1);
      else if ((clock & 3) === 0) lureUp(s);
      pressed(s);
    },
    // 04:93D5: held lifts every frame; released sinks every frame.
    6(s, p, rng, held) {
      if (!held) return sink(s), released(s);
      lureUp(s);
      pressed(s);
    },
    // 04:9401: held lifts (freely when the fish is at the bank); released sinks on even frames.
    8(s, p, rng, held, clock) {
      if (!held) {
        if ((clock & 1) === 0) sink(s);
        return released(s);
      }
      if (s.fishPos === 0) s.curY = w16(s.curY - 1);
      else lureUp(s);
      pressed(s);
    }
  };
  ACTIONS[7] = ACTIONS[2];
  ACTIONS[9] = ACTIONS[0];
  function risingRelease(s, clock) {
    if ((clock & 1) === 0) lureUp(s);
    released(s);
  }
  function lureAction(s, p, rng, pad, clock) {
    const act = ACTIONS[p.lureAction];
    if (act) act(s, p, rng, pad.held, clock);
  }

  // src/entities/fight/fight-rolls.js
  function rollStamina(s, p, rng) {
    const half = p.staminaBase >> 1;
    s.stamina = w16(half + hwDivide(rng.tableByte(), half).remainder);
  }
  function rollRest(s, p, rng) {
    let divisor = w16(p.restBase - s.stamBase);
    if (divisor === 0) divisor = 1;
    const value = w16(hwDivide(rng.tableByte(), divisor).remainder + s.stamBase);
    s.restTimer = value < 2 ? 2 : value;
  }
  function rollIdle(s, p, rng) {
    s.idleTimer = w16(hwDivide(rng.tableByte(), p.idleSpread).remainder + 10);
  }
  function startPull(s, p, rng) {
    rollStamina(s, p, rng);
    rollRest(s, p, rng);
    s.maskA = p.pullMask;
    s.maskB = p.beatMask;
    s.bottomFlag = 0;
    if (s.stamBase !== 0) s.stamBase = w16(s.stamBase - 1);
  }
  function restAdjust(s, p, rng) {
    const before = s.restTimer;
    rollRest(s, p, rng);
    if (before > s.restTimer) s.restTimer = before;
    s.restTimer = w16(s.restTimer + (s.restTimer >> 3));
    s.firstRest = 1;
  }
  function drawStartClass(flags, rng) {
    const r = rng.tableByte();
    const f = (bit) => (flags & bit) !== 0;
    if (r & 1) {
      if (r & 2) return f(4) ? 1 : f(2) ? 2 : 3;
      return f(2) ? 2 : f(4) ? 1 : 3;
    }
    if (r & 2) return f(2) ? 2 : f(1) ? 3 : 1;
    return f(1) ? 3 : f(2) ? 2 : 1;
  }

  // src/entities/fight/fight-lure.js
  var swimSpeed = (size) => size <= 20 ? 2 : size <= 40 ? 3 : 4;
  function hookUp(s, p, rng) {
    s.mode = 2;
    s.moveMode = 2;
    startPull(s, p, rng);
    s.fightValue = s.fightBase;
    restAdjust(s, p, rng);
    s.phase = 1;
    s.curX = 176;
  }
  function startFollow(s, p, rng) {
    const half = p.approach >> 1;
    s.lureTimer = w16(hwDivide(rng.lfsr(), half).remainder + half);
    s.lureSub = 1;
    s.lureCount = 0;
  }
  function checkBite(s, p, rng) {
    if (!(s.prevX > 204 && s.prevX < 212)) return;
    let low = w16(s.curY - 4);
    if (isNegative(low)) low = 0;
    if (low >= s.prevY || w16(s.curY + 4) <= s.prevY) return;
    s.lureSub = s.lureSub === 5 ? 6 : 4;
    s.prevY = s.curY;
    s.prevX = s.curX;
    const span = w16(p.biteMax - p.biteMin);
    s.lureTimer = w16(hwDivide(rng.tableByte(), span).remainder + p.biteMin);
  }
  function followTimer(s, rng) {
    s.lureTimer = (rng.lfsr() >> 1) + 16;
    const d = w16(s.curX - s.prevX);
    if (isNegative(d)) {
      s.lureSub = 2;
      s.lureTimer = 8;
    } else if (d < s.lureTimer) s.lureTimer = d;
  }
  var retreat = (s) => {
    s.lureSub = 2;
    s.lureTimer = 8;
  };
  var inWindow = (s) => s.curY > s.yLimLo && s.curY < s.yLimHi;
  function interest(s, rng, pad) {
    if (s.lureTimer === 0) {
      if (!inWindow(s)) return retreat(s);
      s.lureSub = 3;
      return followTimer(s, rng);
    }
    s.lureTimer = w16(s.lureTimer - 1);
    if (!pad.edge) return;
    if (inWindow(s)) {
      s.lureSub = 3;
      followTimer(s, rng);
    } else if (s.prevX < 128) {
      s.lureSub = 0;
      followTimer(s, rng);
    } else retreat(s);
  }
  function tapTest(s, rng, pad) {
    if (s.lureTimer === 0) return retreat(s);
    s.lureTimer = w16(s.lureTimer - 1);
    if (s.lureTimer === 0 && s.lureCount !== 0) {
      s.lureSub = 5;
      followTimer(s, rng);
    }
    if (pad.edge) s.lureCount = w16(s.lureCount + 1);
  }
  function follow(s, p, rng, pad) {
    if (s.fishPos === 0 || s.prevX > 200) return retreat(s);
    if ((p.flags & 16) !== 0 && [2, 3, 7].includes(p.lureAction)) tapTest(s, rng, pad);
    else interest(s, rng, pad);
  }
  function stepToward(s) {
    if (s.curY === s.prevY) return;
    s.prevY = w16(s.prevY + (s.curY > s.prevY ? 1 : -1));
  }
  function swimIn(s, p, rng, clock) {
    const everyFrame = s.lureSub === 3;
    const speed = swimSpeed(s.size);
    if (s.lureTimer !== 0) {
      s.lureTimer = w16(s.lureTimer - speed);
      if (isNegative(s.lureTimer)) s.lureTimer = 0;
      s.prevX = w16(s.prevX + speed);
    } else startFollow(s, p, rng);
    if (everyFrame || (clock & 1) === 0) stepToward(s);
    checkBite(s, p, rng);
  }
  function approachVector(s) {
    const speed = swimSpeed(s.size);
    let reach = w16(s.curX - s.prevX);
    if (isNegative(reach)) reach = 0;
    const rise = w16(s.prevY - s.curY);
    if (isNegative(rise)) return { speed, dy: 1 };
    if (rise > reach) return { speed, dy: w16(65535 - speed) };
    if (rise >> 1 > reach) return { speed, dy: w16(-speed) };
    if (rise >> 2 > reach) return { speed, dy: w16(-(speed >> 1)) };
    return { speed, dy: 65535 };
  }
  function swimDiagonal(s, p, rng) {
    const { speed, dy } = approachVector(s);
    if (s.lureTimer !== 0) {
      s.lureTimer = w16(s.lureTimer - speed);
      if (isNegative(s.lureTimer)) s.lureTimer = 0;
      s.prevX = w16(s.prevX + speed);
      s.prevY = w16(s.prevY + dy);
    } else startFollow(s, p, rng);
    checkBite(s, p, rng);
  }
  function biteWindow(s, p, rng, pad) {
    if (s.lureTimer === 0) retreat(s);
    else {
      s.lureTimer = w16(s.lureTimer - 1);
      if (pad.edge) {
        hookUp(s, p, rng);
        s.lureSub = 2;
        s.lureTimer = 0;
      }
    }
    s.prevY = s.curY;
    s.prevX = s.curX;
  }
  function secondBite(s, p, rng, pad) {
    s.curX = 176;
    if (s.lureTimer === 0) {
      s.curX = 208;
      retreat(s);
    } else {
      s.lureTimer = w16(s.lureTimer - 1);
      if (pad.edge) {
        hookUp(s, p, rng);
        s.lureSub = 2;
        s.lureTimer = 0;
      }
    }
    s.moveMode = 2;
    s.restTimer = p.restBase;
    s.reelSpeed = speedStep(s.restTimer);
    s.curY = w16(s.curY + Math.max(1, s.reelSpeed >> 1));
    const d = w16(s.curY - s.distBase);
    if (!isNegative(d) && d >= 160) s.curY = w16(s.distBase + 160);
    s.prevY = s.curY;
    s.prevX = s.curX;
  }
  function repositionFish(s, startClass2, rng) {
    const t = (rng.lfsr() >> 1) + 32;
    const half = s.distBase >> 1;
    s.prevY = w16(startClass2 === 1 ? t : startClass2 === 2 ? half + t : s.distBase + t);
  }
  function resetFish(s, rng) {
    s.prevX = 65408;
    s.lureSub = 0;
    s.lureTimer = (rng.lfsr() >> 2) + 192;
    s.yLimLo = Math.max(0, s.prevY - 32) & 65535;
    s.yLimHi = w16(s.prevY + 32);
  }
  function swimOff(s, p, rng) {
    if (s.lureTimer !== 0) {
      s.lureTimer = w16(s.lureTimer - 1);
      return;
    }
    const speed = swimSpeed(s.size);
    if (!isNegative(s.prevX) || s.prevX > 65408) s.prevX = w16(s.prevX - speed);
    else if (s.fvAt63 === 0 && s.moveMode === 1 && s.fishPos !== 0) {
      repositionFish(s, drawStartClass(p.flags, rng), rng);
      resetFish(s, rng);
    }
  }
  function biteMachine(s, p, rng, pad, clock) {
    switch (s.lureSub) {
      case 0:
      case 3:
        return swimIn(s, p, rng, clock);
      case 1:
        return follow(s, p, rng, pad);
      case 2:
        return swimOff(s, p, rng);
      case 4:
        return biteWindow(s, p, rng, pad);
      case 5:
        return swimDiagonal(s, p, rng);
      case 6:
        return secondBite(s, p, rng, pad);
      default:
    }
  }

  // src/entities/fight/fight-float.js
  var nudgeY = (s, d) => {
    s.curY = w16(s.curY + d);
    s.prevY = w16(s.prevY + d);
  };
  function beat(s) {
    if (s.stamina !== 0) {
      s.stamina = w16(s.stamina - 1);
      return;
    }
    s.fightValue = raiseBase(s.fightValue);
    if (s.fightValue === 63) {
      s.fvAt63 = 1;
      if (s.fishPos >= s.boundary) s.lostTackle = 1;
    }
    s.maskB = raiseBase(s.maskB);
    s.maskA = raiseBase(s.maskA);
    s.beatCount = w16(s.beatCount + 1);
    if (s.beatCount === 24) {
      s.beatCount = 0;
      s.fightBase = raiseBase(s.fightBase);
    }
  }
  function pullMotion(s, p, clock) {
    if (s.mode === 2) {
      s.moveMode = s.fightValue < 15 ? 2 : 0;
    } else if ((clock & p.beatMask) === 0) {
      s.moveMode = s.stamina === 0 ? 0 : 1;
    }
  }
  function heldPath(s, p, rng, clock) {
    if (s.mode === 2) {
      s.stamina = 0;
      rollRest(s, p, rng);
      if (s.firstRest !== 0) restAdjust(s, p, rng);
      s.bottomFlag = 0;
    }
    s.holding = 1;
    pullMotion(s, p, clock);
    const mask = s.fishPos === 0 ? s.maskA >> 1 : s.maskA;
    if ((mask & clock) === 0) nudgeY(s, -1);
    if ((clock & s.maskB) === 0) {
      beat(s);
      if (s.fvAt63 !== 0) {
        s.phase = 2;
        s.stamina = 1;
      }
    }
  }
  function toRest(s, p, rng) {
    rollIdle(s, p, rng);
    s.fightValue = s.fightBase;
    s.phase = 0;
    s.holding = 0;
  }
  function restMask(s, p) {
    if (s.firstRest === 0) return p.pullMask;
    return p.lureAction === 2 || p.lureAction === 7 ? p.pullMask >> 2 : p.pullMask >> 1;
  }
  function releasedPath(s, p, rng, clock) {
    s.holding = 0;
    s.moveMode = 2;
    s.mode = 2;
    if ((restMask(s, p) & clock) === 0) {
      if (s.bottomFlag === 0) nudgeY(s, 1);
      else if ((p.pullMask & clock) === 0) {
        nudgeY(s, -1);
        if (w16(s.curY - s.distNow) < p.gate) s.bottomFlag = 0;
      }
    }
    if ((clock & p.beatMask) === 0) {
      s.restTimer = w16(s.restTimer - 1);
      if (s.restTimer === 0) toRest(s, p, rng);
    }
  }
  function fightPhase(s, p, rng, pad, clock) {
    s.prevX = s.curX;
    s.prevY = s.curY;
    if (s.fishPos < s.boundary && !pad.held) releasedPath(s, p, rng, clock);
    else heldPath(s, p, rng, clock);
  }
  function restPhase(s, p, rng, pad) {
    s.prevX = s.curX;
    s.prevY = s.curY;
    s.firstRest = 0;
    if (s.idleTimer !== 0) {
      s.idleTimer = w16(s.idleTimer - 1);
      if (pad.edge) {
        s.idleTimer = 0;
        s.mode = 1;
        startPull(s, p, rng);
        s.holding = 1;
        s.phase = 1;
      }
    } else {
      s.mode = 2;
      startPull(s, p, rng);
      s.phase = 1;
    }
    s.moveMode = 0;
  }
  function flyEscape(s, pad, clock) {
    if (pad.held) {
      s.moveMode = 1;
      s.curY = w16(s.curY - 2);
      s.holding = 1;
      return;
    }
    if ((clock & 1) !== 0) s.curY = w16(s.curY - 1);
    s.moveMode = 0;
    s.holding = 0;
  }
  function escapeLift(s, pad) {
    if (pad.held) {
      s.moveMode = 1;
      s.curY = w16(s.curY - 2);
      s.holding = 1;
      return;
    }
    s.curY = w16(s.curY + 1);
    const d = w16(s.curY - s.distBase);
    s.moveMode = isNegative(d) || d < 160 ? 1 : 0;
    s.holding = 0;
  }
  function escapePhase(s, p, pad, clock) {
    if (p.method === 3 && p.flyFlag !== 0 && s.lostTackle === 0) flyEscape(s, pad, clock);
    else escapeLift(s, pad);
    const speed = s.size <= 20 ? 3 : s.size <= 40 ? 4 : 5;
    if (!isNegative(s.prevX) || s.prevX > 65408) s.prevX = w16(s.prevX - speed);
  }
  function lurePhase(s, p, rng, pad, clock) {
    if (s.lostTackle !== 0) escapeLift(s, pad);
    else lureAction(s, p, rng, pad, clock);
    biteMachine(s, p, rng, pad, clock);
  }
  function stateUpdate(s, p, rng, pad, clock) {
    if (s.phase === 0) restPhase(s, p, rng, pad);
    else if (s.phase === 1) fightPhase(s, p, rng, pad, clock);
    else if (s.phase === 2 && p.method === 2) lurePhase(s, p, rng, pad, clock);
    else if (s.phase === 2) escapePhase(s, p, pad, clock);
  }
  function scrollStep(s, dir) {
    s.distNow = w16(s.distNow + dir);
    s.distBase = w16(s.distBase + dir);
    nudgeY(s, dir);
    s.yLimLo = w16(s.yLimLo + dir);
    s.yLimHi = w16(s.yLimHi + dir);
  }
  function runOut(s) {
    if (s.fishPos >= s.boundary) {
      s.reelSpeed = 0;
      return;
    }
    let n = speedStep(s.restTimer);
    s.reelSpeed = n;
    for (; n > 0; n--) {
      s.fishPos = w16(s.fishPos + 1);
      const onStep = s.fishPos < s.stepLimit && (s.fishPos & s.stepMask) === 0;
      if (onStep && s.distBase < 256) scrollStep(s, 1);
    }
  }
  function reelIn(s) {
    if (s.fishPos === 0) {
      s.reelSpeed = 0;
      return;
    }
    let n = speedStep(s.stamina);
    s.reelSpeed = w16(-n);
    for (; n > 0; n--) {
      s.fishPos = w16(s.fishPos - 1);
      if (isNegative(s.fishPos)) {
        s.fishPos = 0;
        continue;
      }
      if (s.fishPos >= s.stepLimit || (s.fishPos & s.stepMask) !== 0) continue;
      s.distNow = w16(s.distNow - 1);
      if (isNegative(s.distNow)) s.distNow = 0;
      s.distBase = w16(s.distBase - 1);
      if (isNegative(s.distBase)) s.distBase = 0;
      nudgeY(s, -1);
      s.yLimLo = w16(s.yLimLo - 1);
      s.yLimHi = w16(s.yLimHi - 1);
    }
  }
  function clampView(s) {
    const floor = w16(s.distBase + 160);
    if (s.distNow > s.distBase) s.distNow = s.distBase;
    if (!isNegative(s.curY) && floor < s.curY) {
      s.curY = floor;
      s.distNow = s.distBase;
    }
    if (!isNegative(s.prevY) && floor < s.prevY) {
      s.prevY = floor;
      s.bottomFlag = 1;
    }
    const d = w16(s.curY - s.distNow);
    if (isNegative(d)) {
      s.distNow = isNegative(s.curY) ? 0 : s.curY;
    } else if (d > 160) {
      s.distNow = w16(s.curY - 160);
    }
  }
  function moveFish(s, passes = 1) {
    for (let i = 0; i < passes; i++) {
      if (s.moveMode === 0) s.reelSpeed = 0;
      else if (s.moveMode === 1) reelIn(s);
      else if (s.moveMode === 2) runOut(s);
    }
    clampView(s);
  }
  var reachedSurface = (s) => s.distNow === 0 && isNegative(s.curY);

  // src/entities/fight/fight-setup.js
  var DISTANCE_BUCKETS = [
    256,
    1024,
    2304,
    4096,
    6400,
    9216,
    12544,
    16384,
    20736,
    25600,
    30976,
    36864,
    43264,
    50176,
    57600
  ];
  var castDistanceForBucket = (bucket) => (16 * bucket - 8) ** 2;
  function distanceBucket(castDistance) {
    const index = DISTANCE_BUCKETS.findIndex((limit) => castDistance < limit);
    return (index < 0 ? DISTANCE_BUCKETS.length + 1 : index + 1) * 256;
  }
  var WIDER_MASK = { 63: 127, 31: 63, 15: 31, 7: 15 };
  function staminaBase(size, fish) {
    const quarter = fish.restBase >> 2;
    if (size <= fish.sizeLow) {
      const ratio2 = hwDivide(size << 8, fish.sizeLow).quotient;
      return w16(multiply16x8(ratio2, quarter) >> 8);
    }
    if (fish.sizeLow === fish.sizeHigh) return fish.restBase >> 1;
    const ratio = hwDivide(w16(size - fish.sizeLow << 8), fish.sizeHigh - fish.sizeLow).quotient;
    return w16((multiply16x8(ratio, quarter) >> 8) + quarter);
  }
  var sizeBand = (size) => size <= 15 ? 0 : size <= 35 ? 1 : 2;
  var HOOK_STEPS = [
    [halveBase, (v) => v, raiseBase],
    [(v) => v, halveBase, (v) => v],
    [raiseBase, (v) => v, halveBase]
  ];
  var ROD_RAISES = [
    [0, 1, 2],
    [1, 0, 1],
    [2, 1, 0]
  ];
  function startingFightValue(records, fishId, size) {
    const { rod, fish, hook, bait, fly, lure } = records;
    let value = fish.fightStart;
    if (rod.selector === 0) value = halveBase(value);
    else if (rod.selector === 2) value = raiseBase(value);
    if (lure) {
      if (lure.fishMatch === fishId) value = halveBase(value);
      else if (lure.selector <= 2) value = HOOK_STEPS[lure.selector][sizeBand(size)](value);
    } else if (fly) {
      if (fly.selector <= 2) value = HOOK_STEPS[fly.selector][sizeBand(size)](value);
    } else if (bait.fishMatch === fishId || hook.fishMatch === fishId) value = halveBase(value);
    else if (hook.selector <= 2) value = HOOK_STEPS[hook.selector][sizeBand(size)](value);
    if (rod.fishMatch !== fishId && rod.selector <= 2) {
      for (let i = ROD_RAISES[rod.selector][sizeBand(size)]; i > 0; i--) value = raiseBase(value);
    }
    return value;
  }
  function placeFish(s, startClass2, rng) {
    const offset = (rng.lfsr() >> 1) + 32;
    s.prevX = 176;
    const base = s.distBase;
    const table = {
      1: [0, offset],
      2: [base >> 1, (base >> 1) + offset],
      3: [base, base + offset],
      4: [base, base + 160]
    };
    [s.distNow, s.prevY] = table[startClass2].map(w16);
  }
  var STATE_FIELDS = [
    "phase",
    "mode",
    "restTimer",
    "maskA",
    "maskB",
    "fightValue",
    "stamina",
    "lostTackle",
    "fvAt63",
    "idleTimer",
    "firstRest",
    "fishPos",
    "boundary",
    "distBase",
    "distNow",
    "curX",
    "curY",
    "prevX",
    "prevY",
    "moveMode",
    "reelSpeed",
    "holding",
    "bottomFlag",
    "stepMask",
    "stepLimit",
    "stamBase",
    "beatCount",
    "fightBase",
    "size",
    "lureSub",
    "lureTimer",
    "yLimLo",
    "yLimHi",
    "lureCount"
  ];
  function initialState(records, env, tables) {
    const mask0 = tables.sceneStepMask[env.sceneType];
    const fishPos = distanceBucket(env.castDistance);
    let distBase = hwDivide(fishPos, mask0 + 1).quotient;
    if (env.waterDepth === 3 && distBase < 224) distBase = 256;
    if (env.waterDepth === 2 && distBase < 112) distBase = 112;
    distBase = Math.min(distBase, 256);
    const stepMask = env.vehicle >= 3 ? WIDER_MASK[mask0] ?? mask0 : mask0;
    const s = Object.fromEntries(STATE_FIELDS.map((key) => [key, 0]));
    return Object.assign(s, {
      fishPos,
      distBase,
      stepMask,
      stepLimit: w16(stepMask << 8),
      boundary: w16(multiply16x8(336, records.rod.reach)),
      stamBase: staminaBase(env.size, records.fish),
      size: env.size
    });
  }
  function fightConstants(records, env) {
    const { fish } = records;
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
      gate: fish.flags & 4 ? 32 : fish.flags & 2 ? 80 : 128,
      lureAction: records.lure ? records.lure.action : env.lureAction,
      approach: fish.approach,
      biteMax: fish.biteMax,
      biteMin: fish.biteMin
    };
  }
  function startClass(records, p, rng) {
    if (records.method === 1) return 4;
    if (records.method === 3 && p.flyFlag !== 0) return 1;
    return drawStartClass(p.flags, rng);
  }
  function placeLure(s, depth) {
    const base = s.distBase;
    s.curX = 208;
    if (w16(base + 160) < depth) {
      s.distNow = base;
      s.curY = w16(base + 160);
    } else if (w16(base + 112) < depth) {
      s.distNow = base;
      s.curY = depth;
    } else {
      s.distNow = depth > 112 ? depth - 112 : 0;
      s.curY = depth === 0 ? 1 : depth;
    }
  }
  function initLureFight(tables, records, fishId, env, rng) {
    const s = initialState(records, env, tables);
    s.fightBase = startingFightValue(records, fishId, env.size);
    const p = fightConstants(records, env);
    s.moveMode = env.moveMode;
    placeLure(s, env.lureDepth);
    placeFish(s, drawStartClass(p.flags, rng), rng);
    resetFish(s, rng);
    startPull(s, p, rng);
    s.phase = 2;
    s.stamina = 1;
    moveFish(s);
    return { s, p };
  }
  function initFloatFight(tables, records, fishId, env, rng) {
    const s = initialState(records, env, tables);
    s.fightBase = startingFightValue(records, fishId, env.size);
    const p = fightConstants(records, env);
    placeFish(s, startClass(records, p, rng), rng);
    s.curX = s.prevX;
    s.curY = s.prevY;
    s.mode = 2;
    s.moveMode = 2;
    startPull(s, p, rng);
    s.fightValue = s.fightBase;
    restAdjust(s, p, rng);
    s.phase = 1;
    moveFish(s);
    return { s, p };
  }

  // src/entities/fight/fight-engine.js
  var PHASES = ["resting", "fighting", "escaping"];
  var LURE_STAGES = ["approach", "follow", "leave", "close", "strike", "dash", "strike"];
  var DECOY_AYU_BAIT = 23;
  var defaultTables = null;
  function setFightTables(tables) {
    defaultTables = tables;
  }
  function rngFromSeed(seed) {
    let x = seed >>> 0 || 1;
    const next = () => {
      x ^= x << 13;
      x >>>= 0;
      x ^= x >>> 17;
      x ^= x << 5;
      x >>>= 0;
      return x;
    };
    return { index: next() & 65535, lfsrA: next() & 255, lfsrB: next() & 255 };
  }
  function assertSupported(records, ids) {
    if (records.fish.restBase === 0 && records.fish.staminaBase === 0) {
      throw new RangeError(
        `Fish profile ${ids.fishId} is an empty placeholder: no fight is ever started.`
      );
    }
    if (ids.baitId === DECOY_AYU_BAIT) {
      throw new RangeError("Decoy-ayu (ともづり) fights use a separate loop and are not supported.");
    }
  }
  function phaseName(fight) {
    const { s, p } = fight;
    if (fight.outcome) return "ended";
    return p.method === 2 && s.phase === 2 && s.fvAt63 === 0 ? "chasing" : PHASES[s.phase];
  }
  function describe(fight) {
    const { s, p } = fight;
    const lure = p.method === 2 ? {
      stage: LURE_STAGES[s.lureSub],
      strikeOpen: s.phase === 2 && [4, 6].includes(s.lureSub) && s.lureTimer > 0
    } : null;
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
      lostTackleRisk: s.lostTackle === 1
    };
  }
  function surfaceOutcome(s) {
    if (s.phase !== 2) return "caught";
    return s.lostTackle === 1 ? "lost-tackle" : "escaped";
  }
  function advance(fight, input) {
    const { s, p, rng } = fight;
    const a = Boolean(input.a);
    const b = Boolean(input.b);
    fight.clock = fight.clock + 1 & 255;
    const pad = { held: a || b, edge: a && !fight.prevA || b && !fight.prevB };
    fight.prevA = a;
    fight.prevB = b;
    moveFish(s, p.movePasses);
    if (reachedSurface(s)) fight.outcome = surfaceOutcome(s);
    else stateUpdate(s, p, rng, pad, fight.clock);
  }
  function handle(fight) {
    return {
      hp: fight.hp,
      /** Advance one video frame. Input: { a, b } (A and B act identically; d-pad is ignored). */
      step(input = {}) {
        if (fight.outcome) return describe(fight);
        fight.frame += 1;
        advance(fight, input);
        return describe(fight);
      },
      view: () => describe(fight),
      /** Independent copy at the current frame (for look-ahead and schedule search). */
      clone() {
        return handle({
          ...fight,
          s: { ...fight.s },
          rng: createGameRng(fight.table, fight.rng.state)
        });
      },
      /** Raw game variables, keyed as in the ROM trace fixtures. */
      vars() {
        const { index, lfsrA, lfsrB } = fight.rng.state;
        const { s, p } = fight;
        return { ...s, gate: p.gate, clock: fight.clock, rngIndex: index, rngA: lfsrA, rngB: lfsrB };
      }
    };
  }
  function newFight(options, tables) {
    const ids = {
      rodId: options.rodId,
      fishId: options.fishId,
      hookId: options.hookId,
      baitId: options.baitId ?? 0,
      flyId: options.flyId,
      lureId: options.lureId
    };
    const records = resolveRecords(tables, ids);
    assertSupported(records, ids);
    const env = resolveEnvironment(records.fish, options);
    const seed = typeof options.rng === "number" ? rngFromSeed(options.rng) : options.rng;
    const rng = createGameRng(tables.rng.table, seed);
    const clock = (options.clock ?? 0) & 255;
    const base = { hp: options.hp ?? null, table: tables.rng.table, rng, clock, frame: 0 };
    const edge = { prevA: false, prevB: false, outcome: null };
    if (options.resume) {
      const s2 = Object.fromEntries(STATE_FIELDS.map((key) => [key, options.resume[key] ?? 0]));
      return { ...base, ...edge, s: s2, p: fightConstants(records, env) };
    }
    const init = records.method === 2 ? initLureFight : initFloatFight;
    const { s, p } = init(tables, records, ids.fishId, env, rng);
    stateUpdate(s, p, rng, { held: false, edge: false }, clock);
    return { ...base, ...edge, s, p };
  }
  function createFight(options, tables = defaultTables) {
    if (!tables) throw new Error("Fight tables not loaded: call setFightTables(tables) first");
    return handle(newFight(options, tables));
  }

  // src/features/fight-policy/policy.js
  function observe(view, before) {
    return {
      speed: before ? view.fishPos - before.fishPos : 0,
      closing: view.reeling,
      running: view.fishRunning,
      still: !view.reeling && !view.fishRunning,
      resting: view.phase === "resting",
      stamina: view.stamina
    };
  }
  var FIRST_PULL_FRAMES = 12;
  var TAP_SETTLE = 3;
  var holdPolicy = () => () => true;
  function mashPolicy({ on, off }) {
    let tick = -1;
    return () => {
      tick += 1;
      return tick % (on + off) < on;
    };
  }
  function tapper({ taps = 0, tapStart = 0, tapEvery = 16, tapSpeed = 0 }) {
    let runFor = 0;
    let done = 0;
    let since = 99;
    return {
      since: () => since,
      /** True when this frame should be a tap. */
      due(now) {
        since += 1;
        if (taps === 0) return false;
        if (!now.running && since >= TAP_SETTLE) [runFor, done] = [0, 0];
        if (!now.running) return false;
        runFor += 1;
        const ready = done < taps && runFor > tapStart + done * tapEvery && now.speed >= tapSpeed;
        if (ready) [since, done] = [0, done + 1];
        return ready;
      }
    };
  }
  function rhythmPolicy(spec, seen) {
    const { wait, stop, slow = 0, cap = 0, first = FIRST_PULL_FRAMES, lag = 0 } = spec;
    const tap = tapper(spec);
    const s = { held: false, heldFor: 0, quietFor: 0, restFor: 0, pulled: false, moved: 99 };
    const flip = (held) => Object.assign(s, { held, heldFor: 0, quietFor: 0, restFor: 0, pulled: false, moved: 0 });
    return () => {
      const now = seen();
      s.moved += 1;
      const fresh = s.moved > lag;
      if (tap.due(now) && !s.held) return true;
      if (s.held) {
        s.heldFor += 1;
        if (fresh && now.closing) s.pulled = true;
        if (fresh) s.quietFor = now.closing ? 0 : s.quietFor + 1;
        const limit = s.pulled ? stop : Math.max(stop, first);
        const crawling = s.pulled && slow > 0 && now.speed < 0 && -now.speed <= slow;
        if (fresh && (crawling || s.quietFor > limit) || cap > 0 && s.heldFor >= cap) flip(false);
      } else if (fresh && tap.since() >= TAP_SETTLE) {
        s.restFor = now.still ? s.restFor + 1 : 0;
        if (s.restFor > wait) flip(true);
      }
      return s.held;
    };
  }
  function referencePolicy(_spec, seen) {
    let held = false;
    return () => {
      const now = seen();
      if (held && now.stamina === 0) held = false;
      else if (!held && now.resting) held = true;
      return held;
    };
  }
  function packSpec(spec) {
    const fixed = /* @__PURE__ */ new Set(["kind", "lag"]);
    return Object.fromEntries(
      Object.entries(spec).filter(([name, value]) => value && !fixed.has(name))
    );
  }
  var KINDS = {
    hold: holdPolicy,
    mash: mashPolicy,
    rhythm: rhythmPolicy,
    reference: referencePolicy
  };
  function createPolicy(spec) {
    const make = KINDS[spec.kind];
    if (!make) throw new RangeError(`Unknown policy kind ${spec.kind}`);
    const lag = spec.lag ?? 0;
    const history = [];
    const seen = () => {
      const at = Math.max(0, history.length - 1 - lag);
      return observe(history[at], history[at - 1]);
    };
    const decide = make(spec, seen);
    return {
      next(view) {
        history.push(view);
        return decide();
      }
    };
  }

  // src/features/fight-policy/evaluate.js
  var FRAME_CAP = 6e3;
  var rodBoundary = (rod) => rod.reach * 336;
  function stream(seed) {
    let x = seed >>> 0 || 1;
    return (limit) => {
      x ^= x << 13;
      x >>>= 0;
      x ^= x >>> 17;
      x ^= x << 5;
      x >>>= 0;
      return x % limit;
    };
  }
  function farthestBucket(rod) {
    return Math.max(1, Math.min(16, Math.ceil(rodBoundary(rod) / 256) - 1));
  }
  function sampleStarts(fish, rod, count, seed) {
    const draw = stream(seed);
    const buckets = farthestBucket(rod);
    const sizes = fish.sizeHigh - fish.sizeLow + 1;
    return Array.from({ length: count }, () => ({
      rng: { index: draw(65536), lfsrA: draw(256), lfsrB: draw(256) },
      clock: draw(256),
      size: fish.sizeLow + draw(sizes),
      castDistance: castDistanceForBucket(1 + draw(buckets))
    }));
  }
  function fightOptions(setup, start) {
    return {
      ...setup,
      rng: start.rng,
      clock: start.clock,
      size: start.size,
      environment: { castDistance: start.castDistance }
    };
  }
  function playFight(tables, setup, start, spec, cap = FRAME_CAP) {
    const fight = createFight(fightOptions(setup, start), tables);
    const policy = createPolicy(spec);
    let view = fight.view();
    while (!view.outcome && view.frame < cap) view = fight.step({ a: policy.next(view) });
    return { outcome: view.outcome, frames: view.frame };
  }
  var round1 = (value) => Math.round(value * 10) / 10;
  function evaluatePolicy(tables, setup, spec, starts, cap = FRAME_CAP) {
    const count = { caught: 0, escaped: 0, "lost-tackle": 0, unfinished: 0 };
    let caughtFrames = 0;
    for (const start of starts) {
      const { outcome, frames } = playFight(tables, setup, start, spec, cap);
      count[outcome ?? "unfinished"] += 1;
      if (outcome === "caught") caughtFrames += frames;
    }
    const share = (n) => round1(100 * n / starts.length);
    return {
      c: share(count.caught),
      e: share(count.escaped),
      l: share(count["lost-tackle"]),
      s: share(count.unfinished),
      f: count.caught ? Math.round(caughtFrames / count.caught) : null
    };
  }

  // src/features/fight-policy/search.js
  var REACTION = { human: 8, sharp: 0 };
  var SAMPLE = { search: 200, searchSeed: 20261007, final: 1e3, finalSeed: 7102026 };
  var MIN_GAIN = 0.4;
  var TRICK_GAIN = 5;
  var BASELINES = {
    hold: { kind: "hold" },
    mash: { kind: "mash", on: 3, off: 3 },
    reference: { kind: "reference" }
  };
  var PLAIN_CHOICES = {
    stop: [3, 0, 1, 5, 8],
    slow: [0, 1, 2, 3],
    cap: [0, 30, 60, 100, 150, 240],
    first: [12, 6, 4, 9],
    wait: [0, 10, 30]
  };
  var TAP_CHOICES = [16, 8].flatMap(
    (tapEvery) => [6, 5].map((tapSpeed) => ({ taps: 99, tapStart: 0, tapEvery, tapSpeed }))
  );
  var START = { kind: "rhythm", wait: 0, stop: 3, slow: 0, cap: 0, first: 12 };
  function score(tables, setup, starts, spec) {
    return { spec, m: evaluatePolicy(tables, setup, spec, starts) };
  }
  function tuneSetting(tables, setup, starts, best, name) {
    let top = best;
    for (const value of PLAIN_CHOICES[name]) {
      if (value === best.spec[name]) continue;
      const next = score(tables, setup, starts, { ...best.spec, [name]: value });
      if (next.m.c > top.m.c + MIN_GAIN) top = next;
    }
    return top;
  }
  function tunePlain(tables, setup, starts, lag) {
    let best = score(tables, setup, starts, { ...START, lag });
    for (let pass = 0; pass < 2; pass++)
      for (const name of Object.keys(PLAIN_CHOICES))
        best = tuneSetting(tables, setup, starts, best, name);
    return best;
  }
  function searchAtReaction(tables, setup, starts, lag) {
    const plain = tunePlain(tables, setup, starts, lag);
    let trick = null;
    if (plain.m.c < 99) {
      for (const taps of TAP_CHOICES) {
        const next = score(tables, setup, starts, { ...plain.spec, ...taps });
        if (next.m.c > (trick ?? plain).m.c + MIN_GAIN) trick = next;
      }
    }
    return { plain, trick };
  }
  var rescore = (tables, setup, entry, starts) => entry && { spec: entry.spec, m: evaluatePolicy(tables, setup, entry.spec, starts, FRAME_CAP) };
  function bestCeiling(tables, setup, starts, sharp, human) {
    const replay = (entry) => entry && { spec: { ...entry.spec, lag: REACTION.sharp } };
    const entries = [sharp.trick, sharp.plain, replay(human.trick), replay(human.plain)];
    entries.push(human.trick, human.plain);
    let top = null;
    for (const entry of entries.filter(Boolean)) {
      const scored = rescore(tables, setup, entry, starts);
      if (!top || scored.m.c > top.m.c) top = scored;
    }
    return top;
  }
  function analyseSetup(tables, setup, fish, rod) {
    const search = sampleStarts(fish, rod, SAMPLE.search, SAMPLE.searchSeed);
    const final = sampleStarts(fish, rod, SAMPLE.final, SAMPLE.finalSeed);
    const human = searchAtReaction(tables, setup, search, REACTION.human);
    const sharp = searchAtReaction(tables, setup, search, REACTION.sharp);
    const report = (entry) => rescore(tables, setup, entry, final);
    const plain = report(human.plain);
    const trick = report(human.trick);
    return {
      plain,
      trick: trick && trick.m.c >= plain.m.c + TRICK_GAIN ? trick : null,
      ceiling: bestCeiling(tables, setup, final, sharp, human),
      base: Object.fromEntries(
        Object.entries(BASELINES).map(([name, spec]) => [
          name,
          evaluatePolicy(tables, setup, spec, final, FRAME_CAP)
        ])
      )
    };
  }
  var packEntry = (entry) => entry && { spec: packSpec(entry.spec), lag: entry.spec.lag, m: entry.m };
  function packAnalysis(result) {
    return {
      plain: packEntry(result.plain),
      trick: packEntry(result.trick),
      ceiling: packEntry(result.ceiling),
      base: result.base
    };
  }

  // src/app/fight-sim-worker.js
  self.onmessage = (event) => {
    const { tables, setup } = event.data;
    setFightTables(tables);
    const fish = tables.fish.find((row) => row.id === setup.fishId);
    const rod = tables.rod.find((row) => row.id === setup.rodId);
    self.postMessage(packAnalysis(analyseSetup(tables, setup, fish, rod)));
  };
})();
