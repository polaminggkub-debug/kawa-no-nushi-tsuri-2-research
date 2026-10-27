# Which gear helps which fish, and by how much

Provenance: copied from the kawa repo, commit `ea99698` (branch task/gear-fish-matrix), `docs/research/gear-fish-matrix.md`; proven by the ROM tests `gear-start-rom.test.ts`, `fight-chain-rom.test.ts` and `fish-size-bite-rom.test.ts`.

Source: the Thai ROM `Taro2_Thai.sfc` (SHA-1 `453047280f53ab9faf93142b957967c1eec69afc`), read in Ghidra (65816) and
proven by ROM tests that run the game. The data is in [gear-fish-matrix.json](gear-fish-matrix.json): every fish against
every rod, hook, bait, float/sinker, lure and fly body. A test (`gear-start-rom.test.ts`) rebuilds every number in that
file from the ROM and fails if one differs. Basis: poo local, the browser core run headless; no live service.

## The answer in one paragraph

Gear does two things at the hook: it decides **whether a fish bites** (bait, lure or fly body against the fish's mask)
and **how hard the fight starts** (the start notch, 0 easiest to 6 hardest). Each notch lower is one more pull tick
before the fish surges and is lost. The start is set by four slots, in this order: the **rod's class**, then **one**
of: a bait or hook named for the fish, else the hook's (or lure's, or fly body's) **size selector**; then the **rod's
size penalty**, skipped if the rod is named for the fish. Floats, sinkers, wings, tails and ordinary baits do not touch
the fight. A heavier rod never gives an easier start; it only gives more range (big fish run past a short rod's range
line and take the tackle).

## The fight start (notches) and why one notch matters

The fight meter starts at the fish's mask `$11FE` = 2^n − 1 (0, 1, 3, 7, 15, 31, 63); *n* is the **notch**. The fish
record's byte +10 gives the base (03:D2C7); gear moves it at the hook (04:8C96, called from 04:8731). "Easier"
(04:8F6F) halves the mask (one notch down, floor 0); "harder" (04:8F77) doubles it plus one (one notch up, cap 6).

In the fight the meter `$1EC9` climbs one notch at each pull tick (04:9C35..9C3D). At 63 the fish surges (`$1ECF`,
04:9C48) and is lost; if it is also past the rod's range line `$1ED7` = rod +3 × `$150` (04:871E..872E) the tackle goes
too (`$1ECD`, 04:9C4B..9C56). Every 24 ticks the fish mask itself gets one notch harder (04:9C75..9C86).

**Proven in a running fight** (`fight-chain-rom.test.ts`): the same village bite, the same input, gear giving start
masks 7, 3 and 0. The ticks fall on the same frames whatever the start, so each notch lower is exactly one more tick:

| Input | Start 7 (notch 3) | Start 3 (notch 2) | Start 0 (notch 0) |
|---|---|---|---|
| A held (reel into a pulling fish) | lost at frame 12 | 28 | 92 |
| No input (fish runs past range 1344) | lost + tackle at 108 | 124 | 220 |

The percentage of fish landed per notch depends on the player's rhythm and is not proven here (the wiki's simulation
gives figures, e.g. Yamame start 3 lands 100 %, start 7 lands 6 %).

## Fish size: half the minimum up to the maximum (corrects the wiki)

The size bands of every rule below use the hooked fish's own size `$1EB1` (cm), copied at 04:8717 from its stock cell
(`7F:1E8A + cell × 2`). Stocking (03:83A6..83DF, same code for all six areas) gives a new fish
**floor(min/2) + random mod floor(min/2)** and adds 1 each time a later pass picks its cell; past the record's max the
cell is emptied. So a fish's sizes run from **floor(min/2) to max**, not min to max (`fish-size-bite-rom.test.ts`
checks every stocked village cell; the Yamame the tests hook is 23 cm, its record minimum is 30). The wiki's gear pages
use min..max; for **34 of the 72 fish** the real range reaches a smaller band (≤15 or 16–35) the wiki left out, e.g.
Yamame 15..35 (not 30..35), Koi 30..115 (not 60..115), Namazu 30..100 (not 60..100).

## The rule at the hook (04:8D2A..8EC1), step by step

All steps proven for every branch in the running ROM by `gear-start-rom.test.ts` (about 1,700 hooks: three species
with base masks 1, 3, 7; sizes 10, 15, 16, 35, 36, 60; rod class 0/1/2, named or not; every selector and name field).

1. **Rod class** (rod +7 → `$1282`, 04:8D2A..8D48): class 0 one notch easier, class 1 nothing, class 2 one harder.
2. **By method** (`$0C14`, set by the equipment: float ids 1..8 → 0, sinkers 9..10 → 1 at 03:B336..B35F; lure rod → 2
   at 03:B146; fly rod → 3 at 03:B1C9):
   - **Float or sinker (0, 1):** if the **bait** +1 (`$1214`) or the **hook** +1 (`$1266`) is the fish id: one easier,
     once (a named bait and a named hook do not stack). Otherwise the **hook selector** (+0, `$1264`).
     (04:8D4B..8D99)
   - **Lure (2):** if the lure +2 (`$122A`) is the fish id: one easier. Otherwise the **lure selector** (+1, `$1228`).
     Bait and hook names do nothing. (04:8D9C..8DB2)
   - **Fly (3):** the **fly body selector** (+6, `$1248`; `$1238` is the body id, 04:D491). No name field; wing and tail
     are not read. (04:8DB5..8DBD)
   - **Selector by size** (04:8DC0..8E32):

     | Selector | ≤15 | 16–35 | >35 |
     |---|---|---|---|
     | 0 | easier | – | harder |
     | 1 | – | easier | – |
     | 2 | harder | – | easier |
     | other (hook 10 = 3) | – | – | – |
3. **Rod size penalty**, skipped when rod +4 (`$127C`) is the fish id (04:8E35): class 0 pays 0/1/2 notches harder for
   ≤15 / 16–35 / >35, class 1 pays 1/0/1, class 2 pays 2/1/0 (04:8E40..8EBE).

**The rod's net effect** (step 1 + step 3, before clamping at 0 and 6):

| Rod class | Rods | ≤15 | 16–35 | >35 | Named for the fish |
|---|---|---|---|---|---|
| 0 (light) | 1, 6, 10, 11, 14, 17 | −1 | 0 | +1 | −1 everywhere |
| 1 (medium) | 2, 3, 4, 5, 7, 9, 12, 15, 18, 20, 21 | +1 | 0 | +1 | 0 |
| 2 (heavy) | 8, 13, 16, 19 | +3 | +2 | +1 | +1 |

So for the start alone a light rod is best for small fish, light and medium tie for 16–35, and all three tie over 35;
a heavy rod is only worth its range. A rod named for the fish removes the penalty: the Yamame rod 5 (class 1) gives 0
in both of Yamame's bands, where any other medium rod costs +1 on a 15 cm Yamame.

### Items named for a fish (the "match" fields)

| Slot | Item → fish |
|---|---|
| Rod +4 | 1 Bitterling rod → 57 Tanago; 2 Mountain stream carbon → 1 Iwana; 5 Yamame rod → 3 Yamame; 6 Mabuna rod → 29 Mabuna; 7 Ayu rod → 56 Ayu; 8 Carp rod → 13 Koi; 9 Hera rod → 37 Herabuna; 13 Heavy-fish lure rod → 38 Namazu; 16 Two-handed casting → 55 Akame; 20 Ayu carbon → 56 Ayu; 21 Hera carbon → 37 Herabuna |
| Hook +1 | 1 Shibi → 55 Akame; 2 Eel → 59 Giant eel; 3 Seigo → 54 Suzuki; 4 Carp → 13 Koi; 5 Hera → 37 Herabuna; 10 Ayu nose ring → 56 Ayu; 11 Bitterling → 57 Tanago; 12 Iwana → 1 Iwana; 13 Yamame → 3 Yamame |
| Bait +1 | 3 Red maggot → 7 Himemasu; 14 Hera paste → 37 Herabuna; 15 Carp paste → 13 Koi; 16 Rice porridge → 57 Tanago; 17 Potato → 13 Koi; 20 Frog → 38 Namazu; 23 Decoy ayu → 56 Ayu |
| Lure +2 | 18 Spinnerbait → 11 Black bass; 33 Soft red frog → 38 Namazu; 81 Sinking lure → 55 Akame |

Hook selectors: 0 = hooks 7, 8, 11; 1 = 2, 5, 6, 9, 12, 13; 2 = 1, 3, 4; 3 = 10. Lure selectors: 6 lures with 0, 37
with 1, 38 with 2. Fly bodies: 47 with selector 0, 17 with 1.

**Corrects the wiki:** the three named lures were said never to matter because their fish are all over 35 cm where
selector 2 is already easier. With the real sizes (half the minimum upward) Black bass (25..83), Namazu (30..100) and
Akame (60..150, band >35 only) — the first two can be 16–35, where the named lure is one notch easier than selector 2.

## Bites: what each fish accepts

A fish strikes only if the item's mask word (+6) shares a bit with the fish record's word +15 (`$1208`). Read in this
ROM: float 04:E573..E579, sinker 04:EB0B..EB11 (after fish record +13 bit 8 and a random check against record +3),
lure 04:EBFD..EC03 (after `$1348 & 8080`), fly 04:E6C9..E6CF (the body picks bait 4, 7 or 8 for its mask, and an extra
body/wing low-bit lock `$1FA7` can block a cast). `fish-size-bite-rom.test.ts` runs the float gate: with the bait word
cleared nothing strikes; with each single mask bit, only fish whose record has that bit strike. The wiki's emulator audit
covers all four routes on the Japanese ROM; this ROM's 72 fish rows (masks, thresholds) are identical to that data.
`fish[].accepts` in the JSON lists, per fish, the baits (float and sinker route), lures and fly bodies that pass.

Time, weather, rod, hook, HP and cast distance are not read by the bite code (wiki audit), so **only the bait / lure /
fly body decides who bites; only rod, hook, named bait, lure and fly body decide the start.**

## Per-fish best gear (start notch per size band ≤15 / 16–35 / >35, "-" = the fish is never that size)

"Best" lists the items that can reach the fish's best start in every band it has, with the other slots chosen freely
from items the fish accepts; where no single item wins every band, the best items are given per band. Bait-method
rods include float and casting rods. An empty bait-best cell is never the case: every fish takes some bait.
Range (rod +3) is not included: see Unknowns.

| Fish | Size (cm) | Base | Bait: best start | Best bait-method rods | Best hooks | Lure: best | Best lure rods | Fly: best | Best fly rods |
|---|---|---|---|---|---|---|---|---|---|
| 1 Iwana | 20..55 | 2 | -/1/1 | 2 | 12 | -/1/2 | 10, 11, 12 | -/1/3 | 17, 18 |
| 2 Amemasu | 30..70 | 3 | -/2/3 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/2/3 | 10, 11, 12 | -/2/4 | 17, 18 |
| 3 Yamame | 15..35 | 1 | 0/0/- | 5 | 2, 5, 6, 9, 12, 13 | 0/0/- | ≤15: 10, 11; 16–35: 12 | 0/0/- | ≤15: 17; 16–35: 18 |
| 4 Amago | 10..25 | 2 | 0/1/- | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1) | 0/1/- | 10, 11 | 0/1/- | 17 |
| 5 Kajika | 7..17 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | 0/0/- | ≤15: 10, 11; 16–35: 12 | 0/0/- | ≤15: 17; 16–35: 18 |
| 6 Nijimasu (rainbow trout) | 20..70 | 3 | -/2/3 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/2/3 | 10, 11, 12 | -/2/4 | 17, 18 |
| 7 Himemasu | 15..45 | 3 | 1/2/3 | 1, 6, 14 | 1, 2, 3, 4, 5, 6, 7, 8 (+5) | 1/2/3 | 10, 11 | no bite | no bite |
| 8 Brown trout | 25..100 | 2 | -/1/2 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/1/2 | 10, 11, 12 | -/1/3 | 17, 18 |
| 9 Kawamasu | 20..53 | 2 | -/1/2 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/1/2 | 10, 11, 12 | -/1/3 | 17, 18 |
| 10 Wakasagi | 7..15 | 0 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | no bite | no bite |
| 11 Black bass | 25..83 | 2 | -/1/2 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/1/2 | 10, 11, 12 | -/1/3 | 17, 18 |
| 12 Ugui | 15..45 | 1 | 0/0/1 | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4); >35: 2, 3, 4, 5, 7 (+6) | ≤15: 2, 5, 6, 9, 12 (+5); 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | 0/0/1 | ≤15: 10, 11; 16–35: 12; >35: 12, 13 | 0/0/2 | ≤15: 17; 16–35: 18; >35: 17, 18, 19 |
| 13 Koi | 30..115 | 3 | -/2/3 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 1, 2, 3, 4, 5, 6, 7, 8 (+5) | -/2/4 | 10, 11, 12 | no bite | no bite |
| 14 Donko | 12..25 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | 0/1/- | 10, 11 | 0/0/- | ≤15: 17; 16–35: 18 |
| 15 Oikawa | 7..18 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | 0/0/- | ≤15: 10, 11; 16–35: 12 | 0/0/- | ≤15: 17; 16–35: 18 |
| 16 Motsugo | 4..8 | 0 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | no bite | no bite |
| 17 Itomoroko | 4..8 | 0 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | 0/-/- | 17 |
| 18 Gigi | 15..30 | 2 | 0/1/- | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1) | 0/2/- | 10, 11 | 0/1/- | 17 |
| 19 Sakuramasu | 30..60 | 2 | -/1/2 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/1/2 | 10, 11, 12 | -/1/3 | 17, 18 |
| 20 Kokuren | 50..160 | 3 | -/-/3 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 3, 4 | -/-/5 | 10, 11, 12, 13 | no bite | no bite |
| 21 Hakuren | 50..100 | 3 | -/-/3 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 3, 4 | no bite | no bite | no bite | no bite |
| 22 Mugitsuku | 7..15 | 1 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | 0/-/- | 17 |
| 23 Honmoroko | 7..17 | 0 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | no bite | no bite |
| 24 Yamanokami | 8..17 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | 0/1/- | 10, 11 | 0/0/- | ≤15: 17; 16–35: 18 |
| 25 Dojou | 6..12 | 1 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | no bite | no bite |
| 26 Tamoroko | 7..14 | 0 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | no bite | no bite |
| 27 Kawamutsu | 7..20 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | no bite | no bite | 0/0/- | ≤15: 17; 16–35: 18 |
| 28 Kinbuna | 7..20 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | no bite | no bite | no bite | no bite |
| 29 Mabuna | 12..30 | 2 | 0/0/- | 6 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1) | no bite | no bite | no bite | no bite |
| 30 Akaza | 5..15 | 2 | 0/-/- | 1, 6, 14 | 7, 8, 11 | no bite | no bite | 0/-/- | 17 |
| 31 Medaka | 1..4 | 0 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | no bite | no bite |
| 32 Bluegill | 12..35 | 2 | 0/1/- | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1) | 0/1/- | 10, 11 | 0/1/- | 17 |
| 33 Oyanirami | 6..13 | 1 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | 0/-/- | 10, 11 | 0/-/- | 17 |
| 34 Hariyo | 2..7 | 0 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | 0/-/- | 17 |
| 35 Tomiyo | 2..5 | 0 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | no bite | no bite |
| 36 Raigyo | 30..121 | 2 | -/1/2 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/1/2 | 10, 11, 12 | no bite | no bite |
| 37 Herabuna | 17..45 | 2 | -/1/1 | 9, 21 | 1, 2, 3, 4, 5, 6, 7, 8 (+5) | no bite | no bite | no bite | no bite |
| 38 Namazu | 30..100 | 2 | -/1/2 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 1, 2, 3, 4, 5, 6, 7, 8 (+5) | -/1/2 | 10, 11, 12 | no bite | no bite |
| 39 Sayori | 10..30 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | no bite | no bite | no bite | no bite |
| 40 Hasu | 15..35 | 2 | 0/1/- | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1) | 0/1/- | 10, 11 | no bite | no bite |
| 41 Wataka | 15..30 | 2 | 0/1/- | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1) | no bite | no bite | no bite | no bite |
| 42 Kamatsuka | 10..20 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | no bite | no bite | 0/0/- | ≤15: 17; 16–35: 18 |
| 43 Tsuchifuki | 5..10 | 0 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | 0/-/- | 17 |
| 44 Shimadojou | 7..15 | 0 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | no bite | no bite | no bite | no bite |
| 45 Kamuruchi | 40..85 | 3 | -/-/3 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 3, 4 | -/-/3 | 10, 11, 12, 13 | no bite | no bite |
| 46 Higai | 10..22 | 2 | 0/1/- | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1) | no bite | no bite | 0/1/- | 17 |
| 47 Sougyo | 50..140 | 3 | -/-/3 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 3, 4 | no bite | no bite | no bite | no bite |
| 48 Aouo | 50..130 | 3 | -/-/3 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 3, 4 | no bite | no bite | -/-/4 | 17, 18, 19 |
| 49 Nigoi | 25..50 | 2 | -/1/2 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/1/2 | 10, 11, 12 | -/1/3 | 17, 18 |
| 50 Megochi | 12..25 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | no bite | no bite | no bite | no bite |
| 51 Maruta | 20..50 | 2 | -/1/2 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/1/2 | 10, 11, 12 | no bite | no bite |
| 52 Haze | 12..45 | 2 | 0/1/2 | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | 0/1/3 | 10, 11 | no bite | no bite |
| 53 Bora | 30..60 | 3 | -/2/3 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | no bite | no bite | no bite | no bite |
| 54 Suzuki | 40..100 | 3 | -/-/3 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 3, 4 | -/-/3 | 10, 11, 12, 13 | no bite | no bite |
| 55 Akame | 60..150 | 3 | -/-/3 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 3, 4 | -/-/3 | 10, 11, 12, 13 | no bite | no bite |
| 56 Ayu | 15..30 | 2 | 0/1/- | 1, 6, 14 | 1, 2, 3, 4, 5, 6, 7, 8 (+5) | no bite | no bite | 0/1/- | 17 |
| 57 Tanago | 5..10 | 0 | 0/-/- | 1, 6, 14 | 1, 2, 3, 4, 5, 6, 7, 8 (+5) | no bite | no bite | no bite | no bite |
| 58 Unagi | 50..130 | 3 | -/-/3 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 3, 4 | -/-/4 | 10, 11, 12, 13 | no bite | no bite |
| 59 Giant eel (Oo-unagi) | 110..220 | 3 | -/-/3 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 2, 3, 4 | -/-/3 | 10, 11, 12, 13 | no bite | no bite |
| 60 Aburahaya | 6..13 | 1 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | 0/-/- | 10, 11 | 0/-/- | 17 |
| 61 Kurodai | 30..60 | 3 | -/2/3 | 1, 2, 3, 4, 5, 6, 7, 9 (+4) | 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | -/2/4 | 10, 11, 12 | no bite | no bite |
| 62 Numagarei | 47..95 | 2 | -/-/2 | 1, 2, 3, 4, 5, 6, 7, 8 (+6) | 1, 3, 4 | no bite | no bite | no bite | no bite |
| 63 Kusafugu | 7..15 | 1 | 0/-/- | 1, 6, 14 | 2, 5, 6, 7, 8, 9, 10, 11 (+2) | 0/-/- | 10, 11 | no bite | no bite |
| 64 Tougyo | 3..7 | 2 | 0/-/- | 1, 6, 14 | 7, 8, 11 | no bite | no bite | 0/-/- | 17 |
| 65 Tenagaebi | 6..20 | 1 | 0/0/- | ≤15: 1, 6, 14; 16–35: 2, 3, 4, 5, 7 (+4) | 2, 5, 6, 9, 12, 13 | no bite | no bite | no bite | no bite |
| 66 Satsukimasu | 12..50 | 2 | 0/1/2 | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | 0/1/3 | 10, 11 | 0/1/3 | 17 |
| 68 Imori | 5..10 | 3 | 1/-/- | 1, 6, 14 | 7, 8, 11 | no bite | no bite | 1/-/- | 17 |
| 69 Kaeru | 5..10 | 3 | 1/-/- | 1, 6, 14 | 7, 8, 11 | 1/-/- | 10, 11 | 1/-/- | 17 |
| 70 Zarigani (crayfish) | 2..5 | 3 | 1/-/- | 1, 6, 14 | 7, 8, 11 | no bite | no bite | no bite | no bite |
| 71 Kame | 12..30 | 3 | 1/2/- | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1) | 2/2/- | 10, 11 | no bite | no bite |
| 72 Suppon | 15..40 | 3 | 1/2/3 | 1, 6, 14 | ≤15: 7, 8, 11; 16–35: 2, 5, 6, 9, 12 (+1); >35: 1, 3, 4 | 2/2/4 | 10, 11 | no bite | no bite |
| 73 Kani | 2..4 | 3 | 1/-/- | 1, 6, 14 | 7, 8, 11 | no bite | no bite | no bite | no bite |

Counts: every fish takes some bait on the float route; 30 also on the sinker route; 38 take a lure; 33 a fly.

## Tests

All under `apps/web/src/shared/native-macros/`, run with
`KAWA_HYBRID_ROM=<rom> KAWA_BROWSER_CORE_DIR=<core> npx tsx --test <file>`:

| File | Proves |
|---|---|
| `gear-start-rom.test.ts` | Every branch of 04:8D2A..8EC1 for float, sinker, lure and fly; floats/sinkers do not change the start; this JSON equals the ROM tables run through the rule |
| `rod-fish-match-rom.test.ts` (earlier) | The rod named for the fish skips the size penalty and changes nothing else in work RAM; real rod rows |
| `fight-chain-rom.test.ts` | One notch lower = one more pull tick before the surge and loss; tackle lost when past the range line |
| `fish-size-bite-rom.test.ts` | Stocked sizes run floor(min/2)..max; the float bite is only the bait-mask test |

Lure and fly were run by setting the method word at a float strike (the same routine runs; the float bite then has no
lure stage, so that fight ends at once). The wiki's interpreter captures cover real lure and fly hooks.

## Unknowns

- **Rod reach a fish needs.** The range line is rod +3 × `$150` (code), and the proven chain shows the tackle goes when
  the fish is past it at a full meter. How far each fish runs, and so which reach it needs, is only in the wiki's
  simulation (gear-effects.md), not proven here.
- **Landing percentages per notch.** Depend on the player's rhythm; not proven here.
- **Meter resets.** The meter is rewritten at 04:95BE, 04:9676 and 04:9AD6 (rests); not traced.
- **Decoy ayu** (bait 23, named for Ayu): its own fight is not traced; the start rule applies to it like any bait.
- **Names.** Fish ids align with the wiki's Japanese-ROM name table (all 72 rows equal); the Thai ROM's own name text
  was not decoded. English names are the wiki's.
- **Fly lock and lure condition.** `$1FA7` (body/wing low bits against random `7F:1E86/1E88`) and `$1348 & 8080` decide
  whether a cast can bite at all, not which fish; not modelled.
