# Fight model: how a hooked fish is won or lost

Source: the supplied headerless Japanese ROM (1,572,864 bytes, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`). Every statement below comes from the original code or from a frame-exact comparison with the real game running in the Snes9x libretro core. Addresses are CPU addresses as `bank:address` (bank `04` and `84` are the same ROM bank); `$xxxx` is work RAM. The ROM and savestates are not published.

## Player summary

**What decides catch versus escape.** A hooked fish is *landed* when it is lifted up to the water surface before its **fight value** (a six-step meter, 0..63) fills. It *escapes* if it reaches the surface after the meter filled, and the line breaks (*tackle lost*, the hook is stolen and you lose 1 to 4 HP) if the meter fills while the fish is beyond the rod's range line. Landing, escape and tackle loss are decided by those two facts only.

**What A (or B) does.** A and B are identical; no other button matters (the d-pad, X, Y, L, R and Start were tested and change nothing, Select only pauses). The fight is a cycle of four timers:

1. **Rest (phase `resting`).** The fish pauses for 10 to about 10+*idleSpread* frames. A **fresh press** of A during this pause starts a *reeling spell*. Holding A from before the pause does nothing (a press needs a release first), so a held button cannot start a spell.
2. **Reeling spell (`fighting`, mode 1).** While A is held the line is reeled in, quickly at first, slower as the fish's **stamina** (a hidden reel budget, rolled when the spell starts) drains by one every few frames. Reeling lifts the fish. The fight value does not move while stamina is left.
3. **Stamina gone.** If A is still held, every beat now raises the fight value (1, 3, 7, 15, 31, 63). At 63 the fish is lost for good (it still gets hauled to the surface, but that counts as an escape). So **let go of A when stamina runs out**.
4. **Fish runs (`fighting`, mode 2).** With A released the fish swims away, adding distance every frame (faster when its run timer is long) and sinking a little. The run timer counts down once per beat; at zero the fish rests again (back to step 1). Pressing A while the fish runs does *not* reel: it zeroes stamina, re-rolls the run timer and lets the fight value climb. At the start of every fight the fish is already running.

If the fish is dragged to the rod's range line (`fishPos >= boundary`) the game acts as if A were held, so a fish that runs to the boundary fills the meter by itself.

**Lures.** A lure fight has an extra first stage, *chasing*: the lure hangs at the depth where the fish struck and A works it according to the lure's *action* byte (ten actions: hold lifts or retrieves it, release lets it sink at an action-specific pace). A fish swims in from the left, follows the lure's height and, when it is level with the lure, opens a **strike window** of `biteMin..biteMax` frames (profile bytes 5 and 4). A **fresh press of A inside that window hooks it** and the usual fight above begins. If the window is missed the fish swims off (and comes back while you keep retrieving); if the lure reaches the top of the view unhooked, the fish escapes. Fish with the profile bit `0x10` taking lures of action 2, 3 or 7 want repeated taps instead of one well-timed press.

**Does HP matter in the fight?** No. HP is never read by the fight loop (tested by randomising it across 1..100 in 200+ fights). It matters only afterwards: losing tackle costs 1 to 4 HP.

**Which fish values matter** (ROM profile bytes, see below): *staminaBase* (reel budget), *restBase* (how long a run lasts and therefore how far the fish drags you), *beatMask* (the beat period: slow fish tick every 8 frames, quick ones every 2), *idleSpread* (rest length), *fightStart* (the fight value you start at; the higher it is, the fewer beats you may waste), *pullMask* (how fast the fish sinks / is lifted), *flags*, and the fish's size relative to its species range. Rod, hook, bait and size only change the starting fight value (rod/hook/bait by their selector bytes, and "matching" tackle halves it), and the rod's range multiplier sets the boundary (`reach × 336`).

**Why the giant eel (オオウナギ, fish 3B) is hard.** Its profile is the extreme of every number: restBase 100 (a run lasts 50 to 100 beats of 8 frames, i.e. 400 to 800 frames at up to 6 distance units per frame, fading as the timer drops), idleSpread 250, beat period 8, fightStart 7 (only three beats away from 63) and stamina 40 to 79 beats. A single reeling spell recovers about 2,400 distance units at best (stamina 79), and the fish runs about as far every time it is released. Holding A while it runs does not help: it only fills the meter. A catch needs a fresh press exactly in a rest phase, a long reeling spell, and a short enough drag, which depends on the random rolls. A simple policy "let it run, press when it rests, hold while stamina is left" lands the eel in 11 to 16 % of random starts within 4000 frames (depending on the rod; the others stall); the same policy lands the Area 1 Yamame in every fight. The matching **Eel hook (id 2)** halves the starting fight value but does not change the stall dynamics. Validated example: a real-emulator trace lands a giant eel in 806 frames (`eel-r2-h2-catch`).

## Scope

| Method (`$0C14`) | Rods (style byte) | Status |
| --- | --- | --- |
| 0 float / bait | 1 (rods 1..9, 20, 21) | ported, validated |
| 1 casting | 2 (rods 14..16) | ported, validated (mode forced in RAM, see Validation) |
| 3 fly | 8 (rods 17..19) | ported, validated (mode forced in RAM) |
| 2 lure | 4 (rods 10..13) | ported, validated (mode forced in RAM; includes the lure-chase and bite-strike sub-game) |
| decoy ayu (bait 17, ともづり) | any | **not ported**: `createFight` throws (bank 01 has its own loop) |
| fish profile 67 | | placeholder profile with all zeros, no fight starts: `createFight` throws |

## Lure chase (method 2)

`phase` stays 2 until the strike; `fvAt63` is 0. Each frame (`04:900C -> 04:916D`, `04:9491`): the lure action moves `curY`, then the bite machine (`lureSub`, RAM `$1EED`; `lureTimer` `$1EEF`; `yLimLo/yLimHi` `$1EF1/$1EF3` are the fish's height window, `lureCount` `$1EF5`) moves the fish (`prevX`, `prevY`):

| `lureSub` | Name | Behaviour |
| --- | --- | --- |
| 0 | approach | the fish swims right by `swim(size)` (2/3/4 for size <= 20/40/larger) per frame while `lureTimer` (from `04:8B53`: `(lfsr >> 2) + 0xC0`) counts down by the same amount; on even frames its height follows the lure by one; at 0 it starts following (`04:9704`: `lureTimer = lfsr % (b3>>1) + (b3>>1)`) |
| 1 | follow | retreat if `fishPos == 0` or `prevX > 0xC8`. Else a fresh press while the lure is inside `(yLimLo, yLimHi)` keeps it interested (sub 3); a press outside the window with `prevX < 0x80` restarts it (sub 0), otherwise it leaves. With profile flag `0x10` and lure action 2, 3, 7 each press only increments `lureCount` and the fish decides when `lureTimer` runs out (sub 5 if `lureCount != 0`) |
| 2 | leave | `lureTimer` spent, then it swims left; at the left edge, if you are retrieving (`moveMode == 1`), the fish is respawned (new start class, `04:8C58` height, `04:8B53` reset) |
| 3 | close | like 0 but its height follows the lure every frame |
| 5 | dash | like 3 with a diagonal approach (`04:98F0`) |
| 4, 6 | strike | The strike window is `rand % (b4 - b5) + b5` frames (a table draw by `04:9726`, made when the fish gets level with the lure: `prevX` in `0xCD..0xD3` and `prevY` within 3 of `curY`); `lureTimer` counts it down. A fresh press hooks (`04:95B2`: `mode = 2`, `startPull`, `fightValue = fightBase`, `restAdjust`, `phase = 1`, `curX = 0xB0`). Sub 6 additionally sinks the lure and resets the run timer to `restBase` |

Lure actions (`04:91DF..9401`, byte 0 of the lure record): 0 and 9 held lifts on frames where `((fishPos ? 3 : 0) & clock) == 0`, released sinks every frame; 1 as 0, released sinks on even frames; 2 and 7 rise on even frames whether held or not and, held, sometimes jitter down by `clock & 3` on a one-in-eight random draw; 3 and 4 held sink on a depth-dependent schedule (masks 1/3/7/15/31 by depth band) and rise on even frames when released; 5 held lifts every fourth frame, released sinks on even frames; 6 lifts when held, sinks when released, every frame; 8 lifts when held, sinks on even frames when released. While held, `moveMode = 1` reels the line in with stamina 1 (one distance unit per frame). The lure never rises above height 2 while the fish is out.

After the hook-up the fight is the float/casting fight described above, with two differences: the lure record's selector and `fishMatch` replace the hook/bait step of the starting fight value, and the lure's `action` (not an unrelated stale byte) is what the first-rest release path tests.

## Frame order of the original loop

The fight is `04:8000 -> 04:8638`, a loop of `04:8FC7`. One video frame is (the main thread blocks in the frame wait `00:E35B` between steps):

1. NMI: `$1364` (8-bit frame counter) is incremented and the pad is latched: `$1348` held, `$134A` = newly pressed edges (`00:DDE7`).
2. `04:A8C1` scene routine: **mover** (`04:B3E2` reel in / `04:B397` run out, chosen by `$1EBB`) and **clamp** (`04:B48D`); the rest is drawing.
3. Exit test (`04:863E`): leave the loop if `$1EDB == 0` and `$1EB9` is negative.
4. `04:8FC7` **state update** by `$1EC1` (`04:9973` rest, `04:99E9` fight, `04:900C` escape).

The mover therefore acts on the decision of the *previous* frame's update, and the state update uses this frame's pad. At hook-set the set-up (`04:8499`, `04:868E`) runs once, followed by one state update with no button pressed; that is frame 0 of the engine.

## Variables

| RAM | Engine name | Meaning |
| --- | --- | --- |
| `$1EC1` | `phase` | 0 resting, 1 fighting, 2 escaping (fight value full); lures: 2 is also the chase before the strike |
| `$1EA7` | `mode` | 1 reeling spell, 2 fish running |
| `$1EC9` | `fightValue` | the meter; `v = (2v+1) & 63` per beat when stamina is zero |
| `$1ECB` | `stamina` | reel budget, spent one per beat |
| `$1EC3` | `restTimer` | run length, spent one per beat while A is released; also sets run speed |
| `$1ED1` | `idleTimer` | rest length in frames |
| `$1EC5` / `$1EC7` | `maskA` / `maskB` | lift gate / beat gate; start as `pullMask` / `beatMask`, shift in a 1 each beat |
| `$1ECF` / `$1ECD` | `fvAt63` / `lostTackle` | meter reached 63 / ... while `fishPos >= boundary` |
| `$1ED3` | `firstRest` | 1 until the first rest phase |
| `$1ED5` | `fishPos` | fish distance (starts at 0x100..0x1000) |
| `$1ED7` | `boundary` | `rod.reach * 336` |
| `$1ED9` / `$1EDB` | `distBase` / `distNow` | scroll limit and scroll |
| `$1EB9` / `$1EA3` | `curY` / `prevY` | fish height on screen; fish lifts as it decreases |
| `$1EB7` / `$1EA1` | `curX` / `prevX` | fish x (cosmetic, but tracked) |
| `$1EBB` | `moveMode` | 0 still, 1 reeling in, 2 running out |
| `$1EDF` | `reelSpeed` | last mover speed (signed) |
| `$1EE9` / `$1EA9` | `holding` / `bottomFlag` | A held last update / fish touched the bottom |
| `$1EE3` / `$1EE5` | `stepMask` / `stepLimit` | scroll granularity (`mask << 8`) |
| `$1F61` / `$1F63` | `stamBase` / `beatCount` | stamina offset; beats since the last raise of `fightBase` |
| `$11FE` | `fightBase` | profile `fightStart` after rod/hook/bait/size adjustments |
| `$1364` | `clock` | frame counter, 8-bit; only its low 6 bits ever matter |
| `$16AE` / `$16B0` / `$16B2` | `rngIndex` / `rngA` / `rngB` | random state |

`$1EE7`, `$1EA5`, `$1EAD`, `$1EB5`, `$1F3x..$1F6x` and the `$1EF7` block are drawing state that never feeds back and is not modelled.

## ROM tables

Extracted by `scripts/extract_fight_tables.py` into `data/fight-tables.json` (numbers only).

**Fish profile** (`05:8018`, 23 bytes, loader `03:D26D`, id 1..73), the fields the loop reads:

| Byte | RAM | JSON name | Use |
| --- | --- | --- | --- |
| 0 | `$11EA` | `sizeLow` | size range for `stamBase` (`04:8C96`) |
| 1 | `$11EC` | `sizeHigh` | same |
| 3 | `$11F0` | `approach` | lure: scale of the fish's approach/follow timer (`04:9704`) |
| 4 | `$11F2` | `biteMax` | lure: longest strike window (`04:9726`) |
| 5 | `$11F4` | `biteMin` | lure: shortest strike window |
| 6 | `$11F6` | `restBase` | rest/run timer scale (`04:9D5C`), `stamBase`; lure strike-2 run timer |
| 7 | `$11F8` | `staminaBase` | stamina = `half + rand % half`, `half = staminaBase >> 1` (`04:9D86`) |
| 8 | `$11FA` | `beatMask` | beat gate; also the reel/lift gate in `04:9C8A` |
| 9 | `$11FC` | `idleSpread` | rest length `10 + rand % idleSpread` (`04:9D9F`) |
| 10 | `$11FE` | `fightStart` | starting meter (before adjustments) |
| 11 | `$1200` | `pullMask` | lift/sink gate |
| 13 | `$1204` | `flags` | bit 4 / bit 2 select the gate (`$1EAB` = 0x20 / 0x50 / 0x80) and the start-position class (`04:8EE5`); bit 0x10 makes lure actions 2, 3, 7 tap-counting (`04:97C1`) |

Bytes 2, 12 and 14 are not read by the fight loop and are not extracted.

**Rod** (`05:A7F5`, 12 bytes, loader `03:D11F`): `style` (byte 0: 1 float, 2 casting, 4 lure, 8 fly), `reach` (byte 3, boundary = `reach * 336`), `fishMatch` (byte 4), `selector` (byte 7).
**Hook** (`05:A068`, 9 bytes): `selector` (byte 0), `fishMatch` (byte 1). **Bait** (`05:9E67`, 12 bytes): `fishMatch` (byte 1). **Lure** (`05:A1D8`, 12 bytes): `action` (byte 0), `selector` (byte 1), `fishMatch` (byte 2). **Fly** (`05:AA52`, 11 bytes): `flag` (byte 2), `selector` (byte 6).

**Starting fight value** (`04:8D2A..8EC1`), in this order, `halve` = `v >> 1`, `raise` = `((v << 1) | 1) & 63`, size band 0 for size <= 15, 1 for <= 35, 2 above:

1. rod selector 0 halve, 2 raise.
2. float/casting: bait or hook `fishMatch` equal to the fish id halves; otherwise hook selector 0 `[halve, -, raise]`, 1 `[-, halve, -]`, 2 `[raise, -, halve]` by size band. Lure: the lure's `fishMatch` halves, otherwise its selector does the same. Fly: the fly selector does the same, no match test.
3. unless rod `fishMatch` equals the fish id: rod selector 0 raises `[0,1,2]` times, 1 `[1,0,1]`, 2 `[2,1,0]` by size band.

## Random numbers

* `00:EDE9` (`$00DA92`): `index = index + 1 (16-bit); return table[index & 255]`, table at `00:EDFA` (stored in the JSON). Drawn by the stamina, rest and idle rolls and by the start-class draw. Nothing outside the fight loop advances it during a fight (verified frame by frame).
* `00:EEFA` (`$00DA96`): `t = ((rngB & 0x10) << 3) ^ rngB; rngB = rotl8(t); rngA = (rngA + rngB) & 0xFF; return rngA`. Drawn once, at set-up, for the starting height.
* The state at hook-set depends on everything the game did before. The engine takes it as `rng: { index, lfsrA, lfsrB }` or a number.
* Modulo is the SNES hardware divide: dividend 16-bit, divisor the low byte; a zero divisor gives remainder = dividend.

## Set-up (`04:8499`, `04:868E`)

```
stepMask0 = sceneStepMask[sceneType]                      ; 04:B89E  [63,63,63,7,7,31,31,7,7,7,7,7,7,7]
fishPos   = 0x100 * (floor(sqrt(castDistance)/16) + 1), max 0x1000   ; 04:852C, castDistance = dx^2 + dy^2 (px)
distBase  = fishPos / (stepMask0 + 1); waterDepth 3: at least 0x100 if < 0xE0; 2: at least 0x70; at most 0x100
stepMask  = vehicle >= 3 ? widen(stepMask0) : stepMask0   ; 3F->7F 1F->3F 0F->1F 07->0F
stepLimit = stepMask << 8 ; boundary = (336 * rod.reach) & 0xFFFF       ; 04:8721
stamBase  = size <= sizeLow  ? ((size<<8)/sizeLow * (restBase>>2)) >> 8
          : sizeLow == sizeHigh ? restBase >> 1
          : (((size-sizeLow)<<8)/(sizeHigh-sizeLow) * (restBase>>2) >> 8) + (restBase>>2)   ; 04:8C96
fightBase = starting fight value (above)
class     = casting 4 ; fly with flag 1 ; else drawStartClass(flags) (one table draw)    ; 04:8EE5
offset    = (lfsr() >> 1) + 0x20 ; prevX = 0xB0                                        ; 04:8BEC
class 1: distNow=0, prevY=offset | 2: distNow=distBase>>1, prevY=(distBase>>1)+offset
class 3: distNow=distBase, prevY=distBase+offset | 4: distNow=distBase, prevY=distBase+0xA0
curX=prevX, curY=prevY, mode=2, moveMode=2
startPull()  ; fightValue = fightBase ; restAdjust() ; phase = 1
moveFish(1 pass)                                          ; 04:8AB7 -> B2B3 mover, B48D clamp
then one state update with no button
```

## Per-frame pseudocode

```
startPull():  stamina = half + rand%half ; restTimer = max(2, rand%max(1,restBase-stamBase) + stamBase)
              maskA = pullMask ; maskB = beatMask ; bottomFlag = 0 ; if stamBase: stamBase--        ; 04:99C8
restAdjust(): r = restTimer ; restTimer = max(r, new roll) ; restTimer += restTimer >> 3 ; firstRest = 1   ; 04:8B2D
beat():       if stamina: stamina-- ; return                                                         ; 04:9C2B
              fightValue = raise(fightValue); if fightValue == 63: fvAt63 = 1; if fishPos >= boundary: lostTackle = 1
              maskB = raise(maskB); maskA = raise(maskA)
              if ++beatCount == 24: beatCount = 0; fightBase = raise(fightBase)

restPhase()  [04:9973]:  prev = cur ; firstRest = 0
   if idleTimer: idleTimer-- ; if freshPress: idleTimer = 0 ; mode = 1 ; startPull() ; holding = 1 ; phase = 1
   else: mode = 2 ; startPull() ; phase = 1
   moveMode = 0

fightPhase() [04:99E9]:  prev = cur
   if fishPos < boundary and not held: releasedPath() else heldPath()

heldPath() [04:9A07]:
   if mode == 2: stamina = 0 ; rollRest() ; if firstRest: restAdjust() ; bottomFlag = 0
   holding = 1
   pullMotion [04:9C8A]: mode 2 -> moveMode = fightValue < 15 ? 2 : 0
                         mode 1 -> if (clock & beatMask) == 0: moveMode = stamina ? 1 : 0
   if ((fishPos == 0 ? maskA >> 1 : maskA) & clock) == 0: curY--, prevY--
   if (clock & maskB) == 0: beat() ; if fvAt63: phase = 2 ; stamina = 1

releasedPath() [04:9A62]:
   holding = 0 ; moveMode = 2 ; mode = 2
   m = firstRest ? (lureAction in {2,7} ? pullMask>>2 : pullMask>>1) : pullMask
   if (m & clock) == 0:
        if bottomFlag == 0: curY++, prevY++
        elif (pullMask & clock) == 0: curY--, prevY-- ; if (curY - distNow) < gate: bottomFlag = 0
   if (clock & beatMask) == 0: restTimer-- ; if restTimer == 0: idleTimer = 10 + rand%idleSpread ; fightValue = fightBase ; phase = 0 ; holding = 0

escapePhase() [04:900C -> 905D, 90E7]   (fly with flag and no lostTackle: 04:90AD)
   held: moveMode = 1 ; curY -= 2 ; holding = 1          not held: curY++ ; moveMode = (curY-distBase < 0xA0 or negative) ? 1 : 0
   fly flag, not held: moveMode = 0, curY-- on odd clock
   prevX -= (size <= 20 ? 3 : size <= 40 ? 4 : 5)  while prevX is positive or above 0xFF80

moveFish():  (04:B397 / 04:B3E2 / 04:B48D)   scene type 4 runs the dispatch twice (04:AF44 contains it twice)
   moveMode 1 reelIn: n = speed(stamina) ; reelSpeed = -n ; repeat n: fishPos-- (floor 0)
        if fishPos < stepLimit and (fishPos & stepMask) == 0: distNow--, distBase-- (floor 0), curY--, prevY--
   moveMode 2 runOut: if fishPos >= boundary: reelSpeed = 0 else n = speed(restTimer), repeat n: fishPos++
        if fishPos < stepLimit and (fishPos & stepMask) == 0 and distBase < 0x100: distNow++, distBase++, curY++, prevY++
   speed(v): 0->0, <=5 ->1, <=15 ->2, <=30 ->3, <=50 ->4, <=75 ->5, else 6                           ; 04:B437
   clamp: distNow = min(distNow, distBase); curY, prevY capped at distBase+0xA0 (prevY sets bottomFlag)
          d = curY - distNow: d < 0 -> distNow = max(curY, 0) ; d > 0xA0 -> distNow = curY - 0xA0
```

## Landing, escape, tackle loss

The loop exits (`04:8689`, `JSL $018008`) in the frame in which, after the mover and clamp, `distNow == 0` and `curY` is negative. Because the clamp pulls `distNow` to 0 as soon as the fish is above the top of the screen, the fish does not need to be at distance 0: it needs to be lifted out of the view.

* `phase != 2` at exit: **caught** (`01:800C` runs the landing animation; the notebook is updated after the message boxes).
* `phase == 2`, `lostTackle == 0`: **escaped** (`01:81F8`, message `009A`/`00A8`).
* `phase == 2`, `lostTackle == 1`: **tackle lost** (message `0096`; `01:8374..840C`: damage = 1 + (random byte & 3) HP, hook removed; HP 0 starts the blackout flow).

The recorded real-game aftermath agrees with the classification in every trace (notebook counter +1 only when caught, HP drop and cleared hook only for tackle loss).

If the player never lifts the fish out of the view in phase 2 the loop never exits; the engine then returns `outcome: null` for as long as the caller steps it. Callers should impose a frame limit.

## Environment inputs that are not item or fish data

The loop also reads values chosen by the world around the angler. They default to the natural Area 1 Yamame encounter and are exposed as `environment`:

| Option | RAM | Meaning |
| --- | --- | --- |
| `castDistance` | `$1F77` | squared pixel distance between angler and float or lure (dx² + dy²; starting distance bucket). For lures the game recomputes it every frame from the positions |
| `sceneType` | `$0850` | underwater scene variant 0..13 (chosen by stage and map cell, `04:B98C`); sets the scroll step mask; type 4 moves the fish twice per frame |
| `waterDepth` | `$1324` | 1..3, raises the minimum scroll |
| `vehicle` | `$0858` | values >= 3 (a boat or tub) widen the step mask |
| `lureAction` | `$1226` | float/casting/fly only: a stale lure-record byte read in the first release path; 0 unless a lure was loaded. Lure fights use the lure's own action |
| `lureDepth` | `$1F9D` | lure style: height of the lure when the fish struck |
| `moveMode` | `$1EBB` | lure style: mover state left over from before the fight, used for the first frame only |
| `size` | `$1EB1` | cm size of this individual fish (the profile only gives the species range) |

## Engine API

Module `src/entities/fight/` (pure ES modules, no dependencies, `index.js` is the public entry).

```js
import { createFight, setFightTables } from '@/entities/fight'
setFightTables(tables)                        // parsed data/fight-tables.json
const fight = createFight({
  rodId, fishId, hookId, baitId,              // float and casting; flies use flyId, lures use lureId instead
  hp,                                         // accepted, unused by the loop
  size, clock, rng,                           // rng: { index, lfsrA, lfsrB } or a number seed
  environment: { castDistance, sceneType, waterDepth, vehicle, lureAction, lureDepth, moveMode },
})
fight.step({ a: true })   // -> { frame, clock, phase, outcome, fishPos, boundary, fightValue, stamina, restTimer,
                          //      idleTimer, holding, reeling, fishRunning, surfaceDistance, fishHeight,
                          //      pastBoundary, lostTackleRisk, lure }
fight.clone()             // independent copy at the current frame, for search
fight.vars()              // every tracked game variable by its trace name
```

`phase` is `resting`, `fighting`, `escaping`, `chasing` (lure, before the strike) or `ended`; for lures `lure` is `{ stage, strikeOpen }` (`strikeOpen` is true while a fresh A press would hook the fish); `outcome` is `null`, `'caught'`, `'escaped'` or `'lost-tackle'`. `b` behaves exactly like `a`; `left`, `right`, `up` and `down` are ignored because the game ignores them. The style follows the rod: rods 1..9, 20, 21 float, 14..16 casting, 17..19 fly (give `flyId`), 10..13 lure (give `lureId`).

## Planning notes

The player cannot see the hidden inputs, but they span a small space. After set-up every table draw reads `table[index & 255]` with the index counting up one per draw, so the whole random future of a float, casting or fly fight is one of **256 rotations** of the stored table (the 16-bit index only matters through its low byte). The shift register is drawn once at set-up and only `(lfsr >> 1)` reaches the fight (the starting height offset, 128 values); lure fights draw it several times, so there the full 16-bit register matters. The frame counter matters through its low 6 bits (64 values). A schedule can therefore be scored over all `256 x 64 x 128` hidden states (or a sample) instead of guessing one: pass `rng: { index, lfsrA, lfsrB }` and `clock` to `createFight`, use `clone()` to branch, and compare outcome rates. `castDistanceForBucket(1..16)` gives a raw `castDistance` for each starting-distance bucket.

## Validation

**Real-emulator traces.** `data/fight-traces/*.json` holds 96 traces (69,260 frames) captured from the Snes9x libretro core (SHA-256 `8ed333ac...76f6`) running the original ROM, one per fight, from hook-set until the loop exits. 34 variables are tracked on every frame (`vars`, `constants`, the clock and the three random-state words; lure fights add five more). `scripts/entity-link-check/fight-engine.mjs`, part of `npm run check`, replays every trace through the engine and requires **every variable to match on every frame, the exit frame, and the outcome**. It also requires the game's own aftermath to agree with the outcome: notebook counter +1 only for a catch; HP loss and a cleared hook only for tackle loss.

| Style | Traces | Outcomes in the real game (caught / escaped / tackle lost / still running at the end of the schedule) |
| --- | ---: | --- |
| float / bait | 53 | 9 / 17 / 5 / 22 |
| casting | 6 | 0 / 1 / 2 / 3 |
| fly | 6 | 3 / 3 / 0 / 0 |
| lure | 31 | 14 / 6 / 0 / 11 |

* **Schedules.** On the natural Area 1 Yamame (rod 02, hook 06, 23 cm), 21 hook-set schedules: continuous A, B only, A+B mixed, 60/20, 120/40, 3/1, 10/10, 30/30, 20/5, 1/1, 5/15, no input, three random densities, two burst patterns, and engine-planned policies (`reel`, `careful`, two noisy variants); plus 7 continuations of the retained natural fight state from `fight-input-research.md` (A320, 60x4, 120x2, 3x80, 10/10, random). Elsewhere: engine-planned policies, random and burst schedules.
* **Species** (ROM profile ids): 1 イワナ, 3 ヤマメ, 13 コイ, 26 タモロコ, 37 ヘラブナ, 38 ナマズ, 55 アカメ, 56 アユ, 57 タナゴ and **59 オオウナギ** (11 traces, including a real landed giant eel, `eel-r2-h2-catch`, and three tackle losses). Names are the ROM profile labels (decimal id here, hex in the ROM: 3B is 59). **Rods:** all 21 rods (float 1..9, 20, 21; casting 14..16; lure 10..13; fly 17..19), with hooks, baits, all ten lure actions and one fly for each flag/selector pair, scene types 0..13, water depth 1..3, afloat and on foot, cast distances from 17 to 224 px, sizes 8..230 cm.
* **How the cases were set up.** The 28 natural traces (21 Yamame hook-sets, 7 continuations) changed nothing in the game. The other 68 are **RAM-modified** (labelled in each trace): the species is chosen by overwriting the one fish-id table word in the emulator's copy of the ROM (the game then loads the profile and size itself); rod, hook, bait, lure and fly loader fields, scene, depth, vehicle, cast position, preset random state and frame counter are written to work RAM before the hook-set press; casting, lure and fly set `$0C14`. No natural casting, lure or fly fight was captured. The engine's starting random state, frame counter, lure depth, scene and depth are read back from the real run.

**Interpreter fuzz (private).** A restricted 65816 interpreter (`rom-analysis/fight-sim-validation/cpu65816.py`) executes the real ROM main thread from a savestate with the NMI and frame wait modelled. It reproduces the emulator byte for byte on the fight variables over entire natural fights, and was used as a faster oracle to compare the engine with about 650 further randomised fights (random species 1..73 except 67, rod, hook, bait, lure, fly, size, scene, depth, vehicle, cast distance, random state, frame counter and random or engine-planned schedules; HP was randomised in all of them), 133 of them lure fights that reached the hook-up, and a scan of all 72 usable species across float, casting and fly. Every comparison was frame-exact. Findings from this process that are in the model: scene type 4 runs the mover twice per frame; profile 67 is an empty placeholder; the frame counter is 8-bit.

Limits: decoy-ayu fights are not ported. The tackle-loss branch while a lure fight is back in phase 2 shares the float code but no lure trace ended that way. Natural variation of the starting state (random draws before hook-set, frame counter, cast distance, scene) is an input, not a model. The scene type is derived by the game from the angler's map cell; the table is in `04:B98C` but is not exported. Some frame-counter values written to RAM before hook-set stop the game from starting the fight at all (an artefact of the test set-up, e.g. 224); they were not investigated.

## Trace fixture format

Each `data/fight-traces/*.json` file holds: `params` (exactly what `createFight` takes, including the random state and frame counter read from the emulator), `schedule` (one digit per frame: 1 = A, 2 = B, 3 = both, 0 = neither), `vars` and `columns` (per-frame values of each tracked variable, run-length encoded as `{"rle": [value, count, ...]}` when shorter), `constants` (values that never change in a fight), `startClock`, `frameCount`, `exit` (`frame` of the step that left the loop, the `outcome`, and what the game did afterwards: `observed`, `notebookDelta`, `hpDelta`, `hookCleared`), `ramModified` (what was written to RAM before hook-set, or `none`) and, for continuations of the retained natural fight, `resume`. The row for the exit frame itself is not stored: the game is already running the result scene by the end of that frame.

## Reproduction

Private tooling (not published): a libretro runner and a restricted 65816 interpreter under `rom-analysis/fight-sim-validation/`. The public part is `scripts/extract_fight_tables.py` (tables) and the committed traces.
