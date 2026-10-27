<!-- Provenance: copied from poo repo ~/work/kawa, branch task/big-fish-meta (15425a3), docs/research/big-fish-method-proof.md; basis: poo local, Thai ROM. -->
# Big fish (> 35 cm): is live bait the meta?

Source: the Thai ROM `Taro2_Thai.sfc` (SHA-1 `453047280f53ab9faf93142b957967c1eec69afc`), read in Ghidra (65816) and
played headless on poo with the browser core (basis: poo local, no live service). Raw counts:
[big-fish-method-proof.json](big-fish-method-proof.json). Scripts: `tools/research/big-fish/` (`lab.ts` the harness,
`run.ts` the experiment, `lure-types.ts` the lure sub-study, `summarize.ts` the tables).

## The answer

**No method is the meta for big fish; the player's hands are.** On the ROM, with the best setup of each method,
the fight that decides a big fish is **the same code** for float bait, casting and lure (04:900C switches on the
method only for the lure's take; the meter, the pull ticks, the surge and the range line are shared). In 8,640 real
fights (6 fish, 2 sizes, 2 staminas, 4 input policies, 30 seeds each):

- A skilled player (the app's own hold-to-reel rule) lands **99 % with bait, 99 % with casting, 99–100 % with a
  sinking lure**; the few misses are fights longer than the 5.5-minute cap, not losses. Time to land: lure vs bait
  median ratio 0.99–1.02 (the lure is faster in 183 of 357 paired fights): **a tie**.
- A sloppy player (A held, a steady tap, or the skilled rule 25 frames late) lands **0 %** with every method.
  The start notch (0–1 apart between the methods at best) never changed that; it only changes when the fish breaks.
- Stamina changes **nothing in the fight**: bait at stamina 50 and 100 gave identical fights; for casting and lure
  rods it only shortens the cast (rod +2 scaled by stamina), which made no difference to landing.
- The lure has one extra gate before the fight: the fish must **take** it. With a sinking lure (types 0, 1, 5, 6, 8,
  9) every big fish took it (360 of 360, in about 100 frames); with a surface lure (topwater, shallow runner, deep
  diver, frog: types 2, 3, 4, 7) **none ever did** (0 of 240). Held A never takes a fish on a lure: the take needs a newly pressed A (04:95A7); 720 of 720 held-A lure fights let go.

So live bait is the **easy** choice (no take to earn, no lure type to get wrong, the same landing rate), not a
stronger one. **Lure/casting never beat bait on landing rate in a way that survives noise** (best case: Black bass
83 cm, lure 97 % vs bait 90 %, 29 vs 27 of 30, all misses timeouts of very long fights).

## What the rod's +2 and +3 really do

The question assumed +2 is a fight cutoff and `$0150` a work-RAM word. Neither holds.

| Field | Code | Effect for the player | Proof |
|---|---|---|---|
| Rod +2 (`$1278`) | 04:D251 zeroes the charge counter `$1F6F` and the throw flag `$1F73` when B goes down; 04:D58C..D5E7 sets the limit `$1F71`; every charging frame 04:D6EE counts `$1F6F` up and moves the landing spot one step out; `$1F6F` ≥ `$1F71` (or B up) throws (04:BF61) | **How far the rod can cast.** Float rods (style 1): +2 as is (10..70). Casting and lure rods (styles 2, 4): +2 × stamina `$0862` / 100 while stamina ≤ 100, never under 10 — a tired player casts a casting or lure rod shorter. Fly rods (8): +2, and half of it in `$1FA3` for the fly's own loop (04:D85C). Nothing in the fight reads `$1F6F`/`$1F71`. | `cast-charge-rom.test.ts` (rods 1, 2, 7, 12, 13, 15, 18 at stamina 100, 50, 5, 120; the held cast throws on the frame the counter reaches the limit; limits 10 < 60 < 70 throw farther; lure rod 12 at stamina 50 throws shorter than at 100) |
| Rod +3 (`$127A`) | 04:871E..872E at the hook: `$1ED7` = +3 × **the constant 0x150 = 336** (`LDA #$0150`, not a RAM word). While the fish runs, 04:B397 lets the line out `$1ED5` grow only below `$1ED7`. With the line at `$1ED7` the fight reels against the fish whether A is down or not (04:99F5..9A07), so the meter climbs; at 63 the fish is lost and, the line being at the range line, the tackle too (04:9C4B..9C56) | **How long a running fish can be left alone.** A short rod snaps fast; reach 24 (8064) lets the fish run about 17,000 frames (4.7 min) with no input before the same snap. It never makes a fish easier to land. | `rod-reach-rom.test.ts` (rods of reach 3, 8, 24: range = reach × 336, the line stops at it, the meter only climbs once the line is there, tackle lost; reach 24 holds the fish > 10× longer) |

Rod +2 values (rod table 05:A7F5): float 1:10, 2:60, 3:30, 4:50, 5:40, 6:20, 7:70, 8:40, 9:30, 20:80, 21:60; lure 10:70,
11:80, 12:100, 13:120; casting 14:70, 15:100, 16:120; fly 17:50, 18:60, 19:70.

## Bait and casting run the same fight

The per-frame fight (04:900C) switches on the method word `$0C14` only: float and sinker (0, 1) share 04:905D/90E7/9130;
the rod's style (`$1274`) is read in the fight only at 04:9AE3, to pick sound effects. So a casting rod with bait and a
float rod with bait differ only in (1) the start notch (rod class, gear-fish-matrix.md), (2) reach (+3), and (3) cast
length (+2, scaled by stamina for the casting rod). In the experiment, with equal start and reach, the casting rod at
stamina 50 (limit 60, the same as float rod 21) gave **the same fights frame for frame** as the float rod.

## Lure fights have a stage before the fight: the take

A lure hook (04:87B2) does not start the fight. It sets the fight phase `$1EC1` = 2 and runs a lure stage (04:9491,
state `$1EED`) on top of the lure's own retrieve routine (04:916D, by the lure's action type +0, `$1226`, 10 types):

- State 0: the fish swims at the lure (`$1EA1` from −128 upward). If it passes x 0xCD..0xD3 while its depth `$1EA3`
  is within ±4 of the lure's depth `$1EB9` (04:9726), it bites: state 4 with a window `$1EEF` drawn between the fish
  record's `$11F4` and `$11F2` frames.
- State 4 (04:959A): a **fresh** A press (`$134A`, newly pressed) inside the window takes the fish: the meter is set
  to the fish mask and phase 1 begins (04:95BB..95C7) — from here it is the same fight chain as bait. No fresh press:
  back to following.
- Otherwise the fish turns away (state 2) and comes again. Each A reels the lure in; when the line reaches 0 the lure
  is out of the water and the fish never took it (`letgo` below).
- The lure's depth is moved by the retrieve routine: sinking types (0, 1, 5, 6, 8, 9) sink when A is up; topwater (2),
  shallow runner (3), deep diver (4) and frog (7) stay near the surface. A big fish swims deep, so with a surface
  type the depths never meet.

So a lure only adds work before the same fight: the right lure type, depth control, and a fresh press in the bite
window. Nothing in the lure route makes the fight itself easier.

## The experiment

- **Fish and sizes** (`run.ts`): Iwana, Amemasu, Nijimasu, Brown trout, Black bass, Namazu, each at 40 cm and at
  its record maximum (55, 70, 70, 100, 83, 100 cm). All take bait and lures (gear-fish-matrix.json).
- **Setups** (the best start for > 35 cm, then the longest reach): **bait** float rod 21 (reach 24, +2 = 60) with
  hook 4 (selector 2), Iwana its own rod 2 + hook 12 (one notch easier, reach 8), Namazu the frog bait (named);
  **casting** rod 16 (reach 24, +2 = 120) with the same hook and bait; **lure** rod 13 (reach 24, +2 = 120) with lure
  15 (sinking vibration, type 5, selector 2). Start notch: equal for all three methods except Iwana's bait (1 vs 2).
- **Stamina** `$0862` = 100 and 50, set before the cast.
- **Each fight is real**: the setup is equipped by its work-RAM words, cast from the village bank with a full charge
  (B held until the rod throws at its limit), and the first strike is kept. Each trial puts the species and size
  on the line by writing the stock cell the hook reads (0C:C800 cell table, `7F:01CE`/`7F:1E8A`, rewritten every
  frame until the hook routine has run; the hooked species and size are checked), seeds the game's two random
  generators (`$16AE`, `$16B0`, `$16B2`) from the seed, and plays the policy until the fight ends or 20,000 frames
  (5.5 min) pass. 30 seeds per cell; outcomes do vary with the seed.
- **Policies** (identical for every setup; `lab.ts`):
  - `hold`: A down from the hook to the end.
  - `rhythm`: A for 4 frames in every 30.
  - `skilled`: the fight by the app's hold-to-reel rule (`reel-policy.ts`: a fresh press when the fish rests, A while
    the fight's stamina `$1ECB` is above 4); in a lure stage, a player who watches the fish: every 8 frames A down or up,
    whichever (tried on a copy of the game) brings the lure nearer the fish's depth, and a fresh press in the bite
    window.
  - `late`: `skilled` acting on what the game showed 25 frames earlier (at 20 frames every setup tried still lands,
    at 30 none does).
- **Outcomes**: `landed` (catch message, fish in the keepnet: every landing was checked in the keepnet); `broke`
  (the meter reached 63, `$1ECF`: the line snapped, tackle kept); `tackle` (the same with the line at the range line,
  `$1ECD`: fish and tackle gone); `letgo` (lure stage: the lure came in and the fish never took it); `timeout`.

## Results

Per fish and size (n = 30 per method and stamina). Notch 0 is easiest.

| Fish | cm | Start notch bait / casting / lure | skilled: landed % (median frames to land) bait / casting / lure, stamina 100 | same, stamina 50 | late: landed % (lost with tackle %) bait / casting / lure | hold, rhythm: landed % (all methods) |
|---|---|---|---|---|---|---|
| Iwana | 40 | 1 / 2 / 2 | 100 (1412) / 100 (1388) / 100 (1645) | 100 (1412) / 100 (1412) / 100 (1477) | 0 (73) / 0 (0) / 0 (0) | 0 |
| Iwana | 55 | 1 / 2 / 2 | 100 (2084) / 100 (2204) / 100 (2013) | 100 (2084) / 100 (2084) / 100 (2021) | 0 (90) / 0 (0) / 0 (0) | 0 |
| Amemasu | 40 | 3 / 3 / 3 | 100 (628) / 100 (716) / 100 (750) | 100 (628) / 100 (628) / 100 (726) | 0 (0) / 0 (0) / 0 (0) | 0 |
| Amemasu | 70 | 3 / 3 / 3 | 100 (916) / 100 (988) / 100 (926) | 100 (916) / 100 (916) / 100 (966) | 0 (0) / 0 (0) / 0 (0) | 0 |
| Nijimasu | 40 | 3 / 3 / 3 | 100 (1668) / 100 (1836) / 100 (1597) | 100 (1668) / 100 (1668) / 100 (1845) | 0 (73) / 0 (80) / 0 (47) | 0 |
| Nijimasu | 70 | 3 / 3 / 3 | 100 (2644) / 100 (4508) / 100 (3037) | 100 (2644) / 100 (2644) / 100 (3813) | 0 (100) / 0 (97) / 0 (100) | 0 |
| Brown trout | 40 | 2 / 2 / 2 | 100 (356) / 100 (668) / 100 (574) | 100 (356) / 100 (356) / 100 (422) | 0 (0) / 0 (0) / 0 (0) | 0 |
| Brown trout | 100 | 2 / 2 / 2 | 100 (692) / 100 (764) / 100 (574) | 100 (692) / 100 (692) / 100 (630) | 0 (0) / 0 (0) / 0 (0) | 0 |
| Black bass | 40 | 2 / 2 / 2 | 100 (4132) / 100 (5052) / 100 (4606) | 100 (4132) / 100 (4132) / 100 (4713) | 0 (0) / 0 (0) / 0 (0) | 0 |
| Black bass | 83 | 2 / 2 / 2 | 90 (9380) / 93 (9708) / 97 (8368) | 90 (9380) / 90 (9380) / 97 (9366) | 0 (0) / 0 (0) / 0 (0) | 0 |
| Namazu | 40 | 2 / 2 / 2 | 100 (4842) / 100 (5438) / 100 (4658) | 100 (4842) / 100 (4842) / 100 (4791) | 0 (90) / 0 (97) / 0 (93) | 0 |
| Namazu | 100 | 2 / 2 / 2 | 100 (10046) / 93 (10094) / 100 (9371) | 100 (10046) / 100 (10046) / 97 (9007) | 0 (100) / 0 (100) / 0 (97) | 0 |

Landed, all fish and sizes (n per method and stamina = 360):

| Policy | Stamina | Bait | Casting | Lure |
|---|---|---|---|---|
| hold | 100 / 50 | 0 % / 0 % | 0 % / 0 % | 0 % / 0 % |
| rhythm | 100 / 50 | 0 % / 0 % | 0 % / 0 % | 0 % / 0 % |
| skilled | 100 | 99 % | 99 % | 100 % |
| skilled | 50 | 99 % | 99 % | 99 % |
| late | 100 / 50 | 0 % / 0 % | 0 % / 0 % | 0 % / 0 % |

How the losses happen (median frames): `hold` breaks the line almost at once with bait or casting (32–36 frames)
and never gets a lure taken (1,365 frames, then the lure is out: `letgo` in 720 of 720); `rhythm` breaks it later
(424–601 frames; bait lost the tackle in 8 of 720 when the fish had run out the line); `late` breaks at ~2,000 frames,
and loses the tackle too when the fish has run out the line first (Iwana on its short rod 2: 73–90 %; Nijimasu and
Namazu even on reach 24).

Head to head, `skilled`, the same fish, size, stamina and seed, both landed:

| Pair | Stamina | Median ratio of frames to land | The second is faster in |
|---|---|---|---|
| casting / bait | 100 | 1.08 | 153 of 353 |
| casting / bait | 50 | 1.00 (identical fights) | 1 of 357 |
| lure / bait | 100 | 0.99 | 183 of 357 |
| lure / bait | 50 | 1.02 | 170 of 355 |

Casting at stamina 50 throws as far as float rod 21 (both limits 60), and its fights were identical to bait's in all
1,200 pairs with the same hook (two ended one frame apart). At stamina 100 the casting rod throws twice as far, the
fish starts with more line out, and the fight takes a little longer. Bait fights at stamina 50 and 100 were identical
in every pair.

<details><summary>Every cell (fish × size × policy × stamina × method)</summary>

Columns: Broke = the line snapped (meter full), Tackle = lost with the tackle, Let go = the lure never taken.

| Fish | cm | Policy | Stamina | Method (rod) | n | Notch | Landed % | Broke % | Tackle % | Let go % | Timeout % | Median frames to land |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Iwana | 40 | hold | 100 | bait (2) | 30 | 1 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | hold | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Iwana | 40 | hold | 50 | bait (2) | 30 | 1 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | hold | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Iwana | 40 | late | 100 | bait (2) | 30 | 1 | 0 | 27 | 73 | 0 | 0 | - |
| Iwana | 40 | late | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | late | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | late | 50 | bait (2) | 30 | 1 | 0 | 27 | 73 | 0 | 0 | - |
| Iwana | 40 | late | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | late | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | rhythm | 100 | bait (2) | 30 | 1 | 0 | 87 | 13 | 0 | 0 | - |
| Iwana | 40 | rhythm | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | rhythm | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | rhythm | 50 | bait (2) | 30 | 1 | 0 | 87 | 13 | 0 | 0 | - |
| Iwana | 40 | rhythm | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | rhythm | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 40 | skilled | 100 | bait (2) | 30 | 1 | 100 | 0 | 0 | 0 | 0 | 1412 |
| Iwana | 40 | skilled | 100 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 1388 |
| Iwana | 40 | skilled | 100 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 1645 |
| Iwana | 40 | skilled | 50 | bait (2) | 30 | 1 | 100 | 0 | 0 | 0 | 0 | 1412 |
| Iwana | 40 | skilled | 50 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 1412 |
| Iwana | 40 | skilled | 50 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 1477 |
| Iwana | 55 | hold | 100 | bait (2) | 30 | 1 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | hold | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Iwana | 55 | hold | 50 | bait (2) | 30 | 1 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | hold | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Iwana | 55 | late | 100 | bait (2) | 30 | 1 | 0 | 10 | 90 | 0 | 0 | - |
| Iwana | 55 | late | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | late | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | late | 50 | bait (2) | 30 | 1 | 0 | 10 | 90 | 0 | 0 | - |
| Iwana | 55 | late | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | late | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | rhythm | 100 | bait (2) | 30 | 1 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | rhythm | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | rhythm | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | rhythm | 50 | bait (2) | 30 | 1 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | rhythm | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | rhythm | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Iwana | 55 | skilled | 100 | bait (2) | 30 | 1 | 100 | 0 | 0 | 0 | 0 | 2084 |
| Iwana | 55 | skilled | 100 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 2204 |
| Iwana | 55 | skilled | 100 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 2013 |
| Iwana | 55 | skilled | 50 | bait (2) | 30 | 1 | 100 | 0 | 0 | 0 | 0 | 2084 |
| Iwana | 55 | skilled | 50 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 2084 |
| Iwana | 55 | skilled | 50 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 2021 |
| Amemasu | 40 | hold | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | hold | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Amemasu | 40 | hold | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | hold | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Amemasu | 40 | late | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | late | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | late | 100 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | late | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | late | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | late | 50 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | rhythm | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | rhythm | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | rhythm | 100 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | rhythm | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | rhythm | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | rhythm | 50 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 40 | skilled | 100 | bait (21) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 628 |
| Amemasu | 40 | skilled | 100 | casting (16) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 716 |
| Amemasu | 40 | skilled | 100 | lure (13) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 750 |
| Amemasu | 40 | skilled | 50 | bait (21) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 628 |
| Amemasu | 40 | skilled | 50 | casting (16) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 628 |
| Amemasu | 40 | skilled | 50 | lure (13) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 726 |
| Amemasu | 70 | hold | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | hold | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Amemasu | 70 | hold | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | hold | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Amemasu | 70 | late | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | late | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | late | 100 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | late | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | late | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | late | 50 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | rhythm | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | rhythm | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | rhythm | 100 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | rhythm | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | rhythm | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | rhythm | 50 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Amemasu | 70 | skilled | 100 | bait (21) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 916 |
| Amemasu | 70 | skilled | 100 | casting (16) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 988 |
| Amemasu | 70 | skilled | 100 | lure (13) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 926 |
| Amemasu | 70 | skilled | 50 | bait (21) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 916 |
| Amemasu | 70 | skilled | 50 | casting (16) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 916 |
| Amemasu | 70 | skilled | 50 | lure (13) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 966 |
| Nijimasu | 40 | hold | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | hold | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Nijimasu | 40 | hold | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | hold | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Nijimasu | 40 | late | 100 | bait (21) | 30 | 3 | 0 | 27 | 73 | 0 | 0 | - |
| Nijimasu | 40 | late | 100 | casting (16) | 30 | 3 | 0 | 20 | 80 | 0 | 0 | - |
| Nijimasu | 40 | late | 100 | lure (13) | 30 | 3 | 0 | 53 | 47 | 0 | 0 | - |
| Nijimasu | 40 | late | 50 | bait (21) | 30 | 3 | 0 | 27 | 73 | 0 | 0 | - |
| Nijimasu | 40 | late | 50 | casting (16) | 30 | 3 | 0 | 27 | 73 | 0 | 0 | - |
| Nijimasu | 40 | late | 50 | lure (13) | 30 | 3 | 0 | 60 | 40 | 0 | 0 | - |
| Nijimasu | 40 | rhythm | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | rhythm | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | rhythm | 100 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | rhythm | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | rhythm | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | rhythm | 50 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 40 | skilled | 100 | bait (21) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 1668 |
| Nijimasu | 40 | skilled | 100 | casting (16) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 1836 |
| Nijimasu | 40 | skilled | 100 | lure (13) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 1597 |
| Nijimasu | 40 | skilled | 50 | bait (21) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 1668 |
| Nijimasu | 40 | skilled | 50 | casting (16) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 1668 |
| Nijimasu | 40 | skilled | 50 | lure (13) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 1845 |
| Nijimasu | 70 | hold | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | hold | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Nijimasu | 70 | hold | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | hold | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Nijimasu | 70 | late | 100 | bait (21) | 30 | 3 | 0 | 0 | 100 | 0 | 0 | - |
| Nijimasu | 70 | late | 100 | casting (16) | 30 | 3 | 0 | 3 | 97 | 0 | 0 | - |
| Nijimasu | 70 | late | 100 | lure (13) | 30 | 3 | 0 | 0 | 100 | 0 | 0 | - |
| Nijimasu | 70 | late | 50 | bait (21) | 30 | 3 | 0 | 0 | 100 | 0 | 0 | - |
| Nijimasu | 70 | late | 50 | casting (16) | 30 | 3 | 0 | 0 | 100 | 0 | 0 | - |
| Nijimasu | 70 | late | 50 | lure (13) | 30 | 3 | 0 | 7 | 93 | 0 | 0 | - |
| Nijimasu | 70 | rhythm | 100 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | rhythm | 100 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | rhythm | 100 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | rhythm | 50 | bait (21) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | rhythm | 50 | casting (16) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | rhythm | 50 | lure (13) | 30 | 3 | 0 | 100 | 0 | 0 | 0 | - |
| Nijimasu | 70 | skilled | 100 | bait (21) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 2644 |
| Nijimasu | 70 | skilled | 100 | casting (16) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 4508 |
| Nijimasu | 70 | skilled | 100 | lure (13) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 3037 |
| Nijimasu | 70 | skilled | 50 | bait (21) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 2644 |
| Nijimasu | 70 | skilled | 50 | casting (16) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 2644 |
| Nijimasu | 70 | skilled | 50 | lure (13) | 30 | 3 | 100 | 0 | 0 | 0 | 0 | 3813 |
| Brown trout | 40 | hold | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | hold | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Brown trout | 40 | hold | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | hold | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Brown trout | 40 | late | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | late | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | late | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | late | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | late | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | late | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | rhythm | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | rhythm | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | rhythm | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | rhythm | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | rhythm | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | rhythm | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 40 | skilled | 100 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 356 |
| Brown trout | 40 | skilled | 100 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 668 |
| Brown trout | 40 | skilled | 100 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 574 |
| Brown trout | 40 | skilled | 50 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 356 |
| Brown trout | 40 | skilled | 50 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 356 |
| Brown trout | 40 | skilled | 50 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 422 |
| Brown trout | 100 | hold | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | hold | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Brown trout | 100 | hold | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | hold | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Brown trout | 100 | late | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | late | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | late | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | late | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | late | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | late | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | rhythm | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | rhythm | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | rhythm | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | rhythm | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | rhythm | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | rhythm | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Brown trout | 100 | skilled | 100 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 692 |
| Brown trout | 100 | skilled | 100 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 764 |
| Brown trout | 100 | skilled | 100 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 574 |
| Brown trout | 100 | skilled | 50 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 692 |
| Brown trout | 100 | skilled | 50 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 692 |
| Brown trout | 100 | skilled | 50 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 630 |
| Black bass | 40 | hold | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | hold | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Black bass | 40 | hold | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | hold | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Black bass | 40 | late | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | late | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | late | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | late | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | late | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | late | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | rhythm | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | rhythm | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | rhythm | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | rhythm | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | rhythm | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | rhythm | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 40 | skilled | 100 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4132 |
| Black bass | 40 | skilled | 100 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 5052 |
| Black bass | 40 | skilled | 100 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4606 |
| Black bass | 40 | skilled | 50 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4132 |
| Black bass | 40 | skilled | 50 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4132 |
| Black bass | 40 | skilled | 50 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4713 |
| Black bass | 83 | hold | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | hold | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Black bass | 83 | hold | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | hold | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Black bass | 83 | late | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | late | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | late | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | late | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | late | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | late | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | rhythm | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | rhythm | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | rhythm | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | rhythm | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | rhythm | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | rhythm | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Black bass | 83 | skilled | 100 | bait (21) | 30 | 2 | 90 | 0 | 0 | 0 | 10 | 9380 |
| Black bass | 83 | skilled | 100 | casting (16) | 30 | 2 | 93 | 0 | 0 | 0 | 7 | 9708 |
| Black bass | 83 | skilled | 100 | lure (13) | 30 | 2 | 97 | 0 | 0 | 0 | 3 | 8368 |
| Black bass | 83 | skilled | 50 | bait (21) | 30 | 2 | 90 | 0 | 0 | 0 | 10 | 9380 |
| Black bass | 83 | skilled | 50 | casting (16) | 30 | 2 | 90 | 0 | 0 | 0 | 10 | 9380 |
| Black bass | 83 | skilled | 50 | lure (13) | 30 | 2 | 97 | 0 | 0 | 0 | 3 | 9366 |
| Namazu | 40 | hold | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | hold | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Namazu | 40 | hold | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | hold | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Namazu | 40 | late | 100 | bait (21) | 30 | 2 | 0 | 10 | 90 | 0 | 0 | - |
| Namazu | 40 | late | 100 | casting (16) | 30 | 2 | 0 | 3 | 97 | 0 | 0 | - |
| Namazu | 40 | late | 100 | lure (13) | 30 | 2 | 0 | 7 | 93 | 0 | 0 | - |
| Namazu | 40 | late | 50 | bait (21) | 30 | 2 | 0 | 10 | 90 | 0 | 0 | - |
| Namazu | 40 | late | 50 | casting (16) | 30 | 2 | 0 | 10 | 90 | 0 | 0 | - |
| Namazu | 40 | late | 50 | lure (13) | 30 | 2 | 0 | 10 | 90 | 0 | 0 | - |
| Namazu | 40 | rhythm | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | rhythm | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | rhythm | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | rhythm | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | rhythm | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | rhythm | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 40 | skilled | 100 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4842 |
| Namazu | 40 | skilled | 100 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 5438 |
| Namazu | 40 | skilled | 100 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4658 |
| Namazu | 40 | skilled | 50 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4842 |
| Namazu | 40 | skilled | 50 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4842 |
| Namazu | 40 | skilled | 50 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 4791 |
| Namazu | 100 | hold | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | hold | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | hold | 100 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Namazu | 100 | hold | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | hold | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | hold | 50 | lure (13) | 30 |  | 0 | 0 | 0 | 100 | 0 | - |
| Namazu | 100 | late | 100 | bait (21) | 30 | 2 | 0 | 0 | 100 | 0 | 0 | - |
| Namazu | 100 | late | 100 | casting (16) | 30 | 2 | 0 | 0 | 100 | 0 | 0 | - |
| Namazu | 100 | late | 100 | lure (13) | 30 | 2 | 0 | 3 | 97 | 0 | 0 | - |
| Namazu | 100 | late | 50 | bait (21) | 30 | 2 | 0 | 0 | 100 | 0 | 0 | - |
| Namazu | 100 | late | 50 | casting (16) | 30 | 2 | 0 | 0 | 100 | 0 | 0 | - |
| Namazu | 100 | late | 50 | lure (13) | 30 | 2 | 0 | 0 | 100 | 0 | 0 | - |
| Namazu | 100 | rhythm | 100 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | rhythm | 100 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | rhythm | 100 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | rhythm | 50 | bait (21) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | rhythm | 50 | casting (16) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | rhythm | 50 | lure (13) | 30 | 2 | 0 | 100 | 0 | 0 | 0 | - |
| Namazu | 100 | skilled | 100 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 10046 |
| Namazu | 100 | skilled | 100 | casting (16) | 30 | 2 | 93 | 0 | 0 | 0 | 7 | 10094 |
| Namazu | 100 | skilled | 100 | lure (13) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 9371 |
| Namazu | 100 | skilled | 50 | bait (21) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 10046 |
| Namazu | 100 | skilled | 50 | casting (16) | 30 | 2 | 100 | 0 | 0 | 0 | 0 | 10046 |
| Namazu | 100 | skilled | 50 | lure (13) | 30 | 2 | 97 | 0 | 0 | 0 | 3 | 9007 |

</details>

## Lure types (which lures can catch a big fish at all)

`lure-types.ts`: each fish at its maximum size, lure rod 13, one lure of each action type (selector 2, except type 0
which has only selector-1 lures: 70), `skilled` policy, 10 seeds, fights cut at 8,000 frames.

| Type | Lure | Took / n | Landed within 8,000 frames |
|---|---|---|---|
| 0 Spinner | 70 | 60 / 60 | 41 |
| 1 Spoon | 58 | 60 / 60 | 41 |
| 2 Topwater | 1 | 0 / 60 | 0 |
| 3 Shallow runner | 14 | 0 / 60 | 0 |
| 4 Deep diver | 21 | 0 / 60 | 0 |
| 5 Sinking vibration | 15 | 60 / 60 | 41 |
| 6 Jig | 41 | 60 / 60 | 41 |
| 7 Soft frog | 32 | 0 / 60 | 0 |
| 8 Soft claw | 37 | 60 / 60 | 41 |
| 9 Spinnerbait | 18 | 60 / 60 | 41 |

Every fish that took a sinking lure was either landed or still on the line at the cap (Black bass 83 cm and Namazu
100 cm need ~9,000–10,000 frames); none was lost. The surface types never got a take from any of the six big fish:
the fish stays deep and the lure stays near the top.

## Verdict

- **Is live bait the meta for big fish? No — but it is the safe pick.** Bait, casting and a sinking lure land big fish
  equally well (99–100 %) and equally fast for a player who reels at the right moments, and all three lose every big
  fish for a player who does not. The fight is one shared routine; the method does not change it.
- **What bait really gives**: no take to earn. A lure adds a gate before the fight (the right lure type, the depth,
  a fresh press in the bite window); a surface lure (topwater, shallow runner, deep diver, frog) never hooks a big
  fish, and holding A never hooks one on any lure.
- **Stamina**: no effect on any fight; at low stamina casting and lure rods only cast shorter (rod +2 × stamina/100).
- **Lure/casting over bait?** Never by a margin beyond noise. Casting with bait is the bait fight with a longer cast
  (slightly slower at full stamina because more line is out). The lure was faster in about half of the paired fights.
- **Reach (+3)** only matters for a fish left to run: it decides when the line snaps with the tackle. A heavier rod
  never makes landing easier (gear-fish-matrix.md).

**ภาษาไทย:** เหยื่อสดไม่ใช่ "เมต้า" สำหรับปลาใหญ่ ทุกวิธี (เหยื่อสด/คาสติ้ง/เหยื่อปลอม) ใช้โค้ดสู้ปลาตัวเดียวกันในเกม
ผู้เล่นที่กดถูจังหวะได้ปลา 99–100 % ทุกวิธีและใช้เวลาเท่ากัน ผู้เล่นที่กดค้าง กดเป็นจังหวะตายตัว หรือกดช้าไป 25 เฟรม
เสียปลาทุกตัวทุกวิธี ข้อดีจริงของเหยื่อสดคือ "ง่าย" ไม่ต้องให้ปลางับเหยื่อปลอมก่อน: เหยื่อปลอมแบบจม (spinner, spoon,
sinking, jig, soft claw, spinnerbait) ปลาใหญ่งับทุกครั้ง แต่แบบผิวน้ำ (topwater, shallow runner, deep diver, frog) ไม่มีปลาใหญ่งับเลย
และกดค้างไม่เคยทำให้ปลางับ ค่าแรง (stamina) ไม่เปลี่ยนการสู้ปลาเลย แค่ทำให้คันคาสติ้ง/เหยื่อปลอมเหวี่ยงได้สั้นลง
ค่า +2 ของคันคือระยะเหวี่ยงสูงสุด ไม่ใช่เวลาสู้ปลา และ +3 × 336 คือเส้นระยะสายที่ปลาวิ่งได้ก่อนสายขาดพร้อมอุปกรณ์

## Limits

- **Policies are models, not people.** Four fixed policies; `skilled` and the lure-stage player read the game's
  words (a perfect reading of the fish's stamina and depth). Real players sit between `skilled` (all land) and
  `late`/`rhythm` (none land); where a given person falls is not measured. The landing rate jumps from 100 % to 0 %
  between 20 and 30 frames of lag on the one setup checked, the same for bait and lure.
- **The fish is put on the line, not found.** Every fight starts from a strike at the village bank; species and size
  are written into the stock cell the hook reads. The fight code does not read the map, but water, area and
  weather effects on the fight (if any) are not covered. Bites (which fish come to which bait or lure) are not part
  of this experiment: the matrix covers them.
- **One setup per method and fish**, chosen for the best start then the longest reach; one lure type (5) in the main
  run, all ten in the sub-study (one size, `skilled` only). Fly fishing is not included.
- **Cap**: fights longer than 20,000 frames (5.5 min; 8,000 in the lure-type sub-study) count as timeouts. All of
  them were fish still on the line in long fights (Black bass 83 cm, Namazu 100 cm), not losses.
- **Seeds** vary the game's two random generators at the strike; the cast and the strike itself are one per setup.
- **Not traced statically**: the lure retrieve routines per type beyond their effect on depth (04:91DF..9401); the
  bite window values per fish (`$11F2`/`$11F4`); the meter rests (04:95BE, 04:9676, 04:9AD6).

## Tests

Run with `KAWA_HYBRID_ROM=<rom> KAWA_BROWSER_CORE_DIR=<core> npx tsx --test <file>`:

| File | Proves |
|---|---|
| `apps/web/src/shared/native-macros/cast-charge-rom.test.ts` | Rod +2 is the cast's charge limit, scaled by stamina for casting/lure rods; the throw comes at the limit; higher limit = longer cast |
| `apps/web/src/shared/native-macros/rod-reach-rom.test.ts` | Rod +3 × 336 is the range line; the line stops there; at the line the meter climbs with A up and the tackle goes; reach 24 holds a running fish > 10× longer |
