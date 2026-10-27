<!-- Provenance: copied from poo repo ~/work/kawa, branch task/fish-max-size (5aae6fa), docs/research/fish-max-size.md; basis: poo local, Thai ROM. -->
# Fish max size: can the wiki's "ไซส์ MAX" be caught on every map?

Source: the Thai ROM `Taro2_Thai.sfc` (SHA-1 `453047280f53ab9faf93142b957967c1eec69afc`), read in Ghidra (65816) and
proven by ROM tests that run the game (`fish-max-size-rom.test.ts`, `fish-quest-size-rom.test.ts`). The data per fish
and map is in [fish-max-size.json](fish-max-size.json). Basis: poo local, the browser core run headless; no live service.
The wiki's MAX is the fish record's +1 (`size.high` in the gear matrix); the generator checked this for all 72 fish.

## The answer in one paragraph

**No map has its own size cap.** The only cap is the fish record's max, the same on every map and in every cell
(all 1536 cells checked). On **70 of the 72 fish** the wiki's MAX can be caught on every map where the fish lives.
**Two fish cannot be caught at their MAX in normal play:** the **Akame** (MAX 150: only character 1 before landing it
for the quest; everyone else, and character 1 afterwards, gets 60..119) and the **Giant eel** (MAX 220: one eel per
game, only in the eel part of the story, 2 cm smaller after each lost fight). For the others MAX is real but **slow
and short**: a new fish starts at half its record minimum, grows **1 cm per inn night that picks its cell**, and the
night after it reaches MAX it is removed. Six fish need 40+ picks of one cell (Raigyo, Kokuren, Koi, Brown trout,
Namazu, Sougyo); one pick of a given cell costs on average 256 fishing-activity points spent at that map's inn.

## The mechanism (addresses)

| Step | Where | What it does |
|---|---|---|
| Size of a hooked fish | 04:8717 | `$1EB1` ← the cell's size `7F:1E8A + cell × 2`. 1536 cells = 6 maps × 256; the cell's species is ROM `0C:C800 + cell × 2` (identical to the wiki's `fish-locations.json` slots, all 1536 checked). |
| Growth pass | 03:838B..85C5 | The inn night (yes to the innkeeper). `$085A` 7..12 picks the copy for maps 1..6, so **only the inn's own map grows**. It loops `$0C2E` times (at least once), then zeroes `$0C2E` (03:85C8). |
| Cell pick | 00:EDE9 | `$16AE`+1, byte of the 256-byte permutation at 00:EDFA: up to 255 different cells per night. |
| New fish | 03:83B0..83C5 | Empty cell → `floor(min/2) + random mod floor(min/2)`, i.e. `floor(min/2) .. 2·floor(min/2) − 1`. The new game (04:EC56) fills 1152 cells the same way: **no fish starts at or above its record minimum.** |
| Grow / cap | 03:83CB..83DF | Size + 1; if it is now > `$11EC` (record +1, loaded by 03:8042) the cell is emptied, else stored. **max − 1 → max; max → removed.** |
| Fishing activity `$0C2E` | 01:8019, 01:81F8, 01:927E, 03:A650 | +1 per fight, +2 more if the fish is lost, +3 more if it slips back at the landing, +4 per fish handed in; capped at 255 (01:8058). |
| Slip-back at the landing | 01:85FF → 01:9273 → 01:935C..9373 | A landed fish that slips back (Down at the landing) grows by `floor(min/16) + 1`, **held** at max (not removed). |
| Kept fish | 01:8E0B | Its cell is emptied. A lost fish is not changed (fish-stock-rom.test.ts). |
| Quest cells | 04:BE29 → 04:C289 | Every start of fishing: cells 1280 Akame, 1024 Tanago, 768 Namazu, 1025 Koi get a new small fish; the character's own quest cell gets `$0C1E` while `$0C18` bit 0 is clear; cell 1281 (giant eel) is emptied, or holds `$0C20` while `$0C18` bit 2 is set and bit 3 clear. |
| Quest sizes | 01:B097..B0E9, 01:8208..82BA | New game: `$0C1E` = record max of the character's quest fish (1 Akame 150, 2 Tanago 10, 3 Namazu 100, 4 Koi 115), `$0C20` = 220. A lost fight on that cell takes 2 cm off (Tanago 1), never below floor(min/2) of that fish. |
| Quest / eel flags | 01:91B6, 01:DEB3, 01:9198 | Bit 0: the quest fish was landed. Bit 2: set when bit 1 is set and 65+ of the 66 words at `$0DC8` are non-zero. Bit 3: the eel was landed. |

Nothing else writes the table: no clock, season, weather, sleep at home, map entry, or faint (fish-stock-rom.test.ts).

## How long MAX takes

A new fish of a fish with record `min..max` needs **max − (2·floor(min/2) − 1)** (best) to **max − floor(min/2)**
(worst) picks of its cell. At 255 activity points a night almost every cell of that map is picked each night, so
picks = nights; the test grew every map from the new game's own table night after night (255 points each) and counts
the night the first cell and every cell of the species held MAX. In real play a night spends the activity earned
since the last one (about one point per fight), so a given cell is picked on average **points ÷ 256** times per
night. Example: 30 fights between nights → one pick of a given cell about every 8.5 nights → a Koi needs 56–85 picks
≈ 480–720 nights. Six fish need 40 or more picks even in the best case:

| Fish | MAX | Picks (best–worst) | Maps |
|---|---|---|---|
| 36 Raigyo | 121 | 62–91 | 4, 5 |
| 20 Kokuren | 160 | 61–110 | 4 |
| 13 Koi | 115 | 56–85 | 4, 5, 6 |
| 8 Brown trout | 100 | 51–75 | 2, 3 |
| 38 Namazu | 100 | 41–70 | 4, 5 |
| 47 Sougyo | 140 | 41–90 | 4 |

A fish holds MAX only until its cell is picked again; at 255 points a night that is one night. In the test run at
most 3 cells of a big fish (40+ picks) held MAX on a map at once (small fish with many cells, e.g. Medaka, up to 15).
Slip-backs speed one fish up by floor(min/16)+1 per slip
(Koi +4, Kokuren +7).

## Mismatches with the wiki's MAX

| Fish | Wiki MAX | Real | Why |
|---|---|---|---|
| 55 Akame (map 6 only, one cell 1280) | 150 | 150 only for character 1 (`$0860` = 1) until it is landed, and 2 cm less after each lost fight (floor 60); everyone else and character 1 afterwards: **60..119** | 04:C289 re-rolls the cell to a new fish at every start of fishing; the inn's growth there never reaches the water. |
| 59 Giant eel (map 6 only, one cell 1281) | 220 | **220 once per game**, only while story flag bit 2 is set and before it is landed; 2 cm less after each lost fight (floor 110); never at any other time | 04:C2F8..C312 empties the cell at every start of fishing; `$0C20` is the only size it ever has. |

Not mismatches, but worth a line on the wiki: every MAX is the record max reached by growth, so **a player only
meets MAX fish after many inn nights**; in a new game every fish is below its record minimum. Cells 1024 (Tanago,
map 5), 768 (Namazu, map 4) and 1025 (Koi, map 5) are quest cells (small fish, or the quest fish at record max for
its own character); the other cells of those fish on those maps grow normally.

## Per fish × map

"Nights @255" = from the new game, at 255 activity points every night (`fish-max-size-rom.test.ts`).

| Fish | Map | Cells | Record | New fish | Passes to MAX (best–worst) | Nights @255 (first / every cell) | Reachable MAX |
|---|---|---|---|---|---|---|---|
| 1 Iwana | 1 Mountain Stream | 100 | 40..55 | 20..39 | 16–35 | 16 / 36 | 55 ✓ |
| 2 Amemasu | 2 Mountain Lake | 14 | 60..70 | 30..59 | 11–40 | 11 / 38 | 70 ✓ |
| 3 Yamame | 1 Mountain Stream | 42 | 30..35 | 15..29 | 6–20 | 7 / 20 | 35 ✓ |
| 4 Amago | 1 Mountain Stream | 48 | 20..25 | 10..19 | 6–15 | 6 / 17 | 25 ✓ |
| 5 Kajika | 3 Clear Stream | 13 | 15..17 | 7..13 | 4–10 | 4 / 10 | 17 ✓ |
| 6 Nijimasu (rainbow trout) | 1 Mountain Stream | 18 | 40..70 | 20..39 | 31–50 | 32 / 50 | 70 ✓ |
| 6 Nijimasu (rainbow trout) | 2 Mountain Lake | 24 | 40..70 | 20..39 | 31–50 | 31 / 51 | 70 ✓ |
| 6 Nijimasu (rainbow trout) | 3 Clear Stream | 17 | 40..70 | 20..39 | 31–50 | 32 / 51 | 70 ✓ |
| 7 Himemasu | 2 Mountain Lake | 15 | 30..45 | 15..29 | 16–30 | 16 / 31 | 45 ✓ |
| 8 Brown trout | 2 Mountain Lake | 9 | 50..100 | 25..49 | 51–75 | 66 / 72 | 100 ✓ |
| 8 Brown trout | 3 Clear Stream | 7 | 50..100 | 25..49 | 51–75 | 55 / 75 | 100 ✓ |
| 9 Kawamasu | 1 Mountain Stream | 30 | 40..53 | 20..39 | 14–33 | 14 / 34 | 53 ✓ |
| 9 Kawamasu | 2 Mountain Lake | 30 | 40..53 | 20..39 | 14–33 | 15 / 32 | 53 ✓ |
| 10 Wakasagi | 2 Mountain Lake | 28 | 14..15 | 7..13 | 2–8 | 2 / 8 | 15 ✓ |
| 10 Wakasagi | 4 Lake | 5 | 14..15 | 7..13 | 2–8 | 3 / 8 | 15 ✓ |
| 10 Wakasagi | 6 River Mouth | 17 | 14..15 | 7..13 | 2–8 | 2 / 8 | 15 ✓ |
| 11 Black bass | 2 Mountain Lake | 53 | 50..83 | 25..49 | 34–58 | 35 / 59 | 83 ✓ |
| 12 Ugui | 3 Clear Stream | 31 | 30..45 | 15..29 | 16–30 | 16 / 31 | 45 ✓ |
| 12 Ugui | 4 Lake | 5 | 30..45 | 15..29 | 16–30 | 17 / 26 | 45 ✓ |
| 12 Ugui | 5 Downstream | 8 | 30..45 | 15..29 | 16–30 | 18 / 30 | 45 ✓ |
| 13 Koi | 4 Lake | 22 | 60..115 | 30..59 | 56–85 | 57 / 85 | 115 ✓ |
| 13 Koi | 5 Downstream | 11 (quest cell) | 60..115 | 30..59 | 56–85 | 59 / 85 | 115 ✓ |
| 13 Koi | 6 River Mouth | 20 | 60..115 | 30..59 | 56–85 | 62 / 85 | 115 ✓ |
| 14 Donko | 2 Mountain Lake | 8 | 25..25 | 12..23 | 2–13 | 3 / 13 | 25 ✓ |
| 14 Donko | 3 Clear Stream | 8 | 25..25 | 12..23 | 2–13 | 2 / 14 | 25 ✓ |
| 15 Oikawa | 3 Clear Stream | 29 | 15..18 | 7..13 | 5–11 | 5 / 12 | 18 ✓ |
| 16 Motsugo | 5 Downstream | 8 | 8..8 | 4..7 | 1–4 | 2 / 4 | 8 ✓ |
| 17 Itomoroko | 5 Downstream | 10 | 8..8 | 4..7 | 1–4 | 1 / 5 | 8 ✓ |
| 18 Gigi | 4 Lake | 20 | 30..30 | 15..29 | 1–15 | 2 / 15 | 30 ✓ |
| 19 Sakuramasu | 2 Mountain Lake | 9 | 60..60 | 30..59 | 1–30 | 2 / 29 | 60 ✓ |
| 20 Kokuren | 4 Lake | 5 | 100..160 | 50..99 | 61–110 | 73 / 106 | 160 ✓ |
| 21 Hakuren | 4 Lake | 10 | 100..100 | 50..99 | 1–50 | 1 / 37 | 100 ✓ |
| 21 Hakuren | 5 Downstream | 3 | 100..100 | 50..99 | 1–50 | 11 / 21 | 100 ✓ |
| 22 Mugitsuku | 5 Downstream | 5 | 15..15 | 7..13 | 2–8 | 2 / 7 | 15 ✓ |
| 23 Honmoroko | 4 Lake | 11 | 14..17 | 7..13 | 4–10 | 4 / 10 | 17 ✓ |
| 24 Yamanokami | 3 Clear Stream | 8 | 16..17 | 8..15 | 2–9 | 3 / 10 | 17 ✓ |
| 25 Dojou | 5 Downstream | 26 | 12..12 | 6..11 | 1–6 | 1 / 7 | 12 ✓ |
| 26 Tamoroko | 4 Lake | 16 | 14..14 | 7..13 | 1–7 | 2 / 8 | 14 ✓ |
| 26 Tamoroko | 5 Downstream | 14 | 14..14 | 7..13 | 1–7 | 1 / 7 | 14 ✓ |
| 27 Kawamutsu | 3 Clear Stream | 24 | 15..20 | 7..13 | 7–13 | 7 / 13 | 20 ✓ |
| 28 Kinbuna | 5 Downstream | 12 | 15..20 | 7..13 | 7–13 | 7 / 14 | 20 ✓ |
| 29 Mabuna | 4 Lake | 13 | 25..30 | 12..23 | 7–18 | 7 / 19 | 30 ✓ |
| 29 Mabuna | 5 Downstream | 1 | 25..30 | 12..23 | 7–18 | 8 / 8 | 30 ✓ |
| 30 Akaza | 1 Mountain Stream | 7 | 10..15 | 5..9 | 6–10 | 6 / 11 | 15 ✓ |
| 30 Akaza | 3 Clear Stream | 8 | 10..15 | 5..9 | 6–10 | 6 / 10 | 15 ✓ |
| 31 Medaka | 5 Downstream | 20 | 2..4 | 1..1 | 3–3 | 3 / 4 | 4 ✓ |
| 32 Bluegill | 2 Mountain Lake | 18 | 25..35 | 12..23 | 12–23 | 12 / 23 | 35 ✓ |
| 33 Oyanirami | 5 Downstream | 7 | 13..13 | 6..11 | 2–7 | 2 / 7 | 13 ✓ |
| 34 Hariyo | 2 Mountain Lake | 19 | 5..7 | 2..3 | 4–5 | 4 / 6 | 7 ✓ |
| 35 Tomiyo | 5 Downstream | 11 | 5..5 | 2..3 | 2–3 | 2 / 4 | 5 ✓ |
| 36 Raigyo | 4 Lake | 4 | 60..121 | 30..59 | 62–91 | 67 / 87 | 121 ✓ |
| 36 Raigyo | 5 Downstream | 6 | 60..121 | 30..59 | 62–91 | 72 / 91 | 121 ✓ |
| 37 Herabuna | 4 Lake | 44 | 35..45 | 17..33 | 12–28 | 12 / 29 | 45 ✓ |
| 37 Herabuna | 5 Downstream | 2 | 35..45 | 17..33 | 12–28 | 13 / 24 | 45 ✓ |
| 38 Namazu | 4 Lake | 11 (quest cell) | 60..100 | 30..59 | 41–70 | 42 / 70 | 100 ✓ |
| 38 Namazu | 5 Downstream | 6 | 60..100 | 30..59 | 41–70 | 51 / 68 | 100 ✓ |
| 39 Sayori | 6 River Mouth | 18 | 20..30 | 10..19 | 11–20 | 11 / 20 | 30 ✓ |
| 40 Hasu | 3 Clear Stream | 2 | 30..35 | 15..29 | 6–20 | 14 / 14 | 35 ✓ |
| 40 Hasu | 4 Lake | 7 | 30..35 | 15..29 | 6–20 | 7 / 16 | 35 ✓ |
| 41 Wataka | 4 Lake | 4 | 30..30 | 15..29 | 1–15 | 2 / 12 | 30 ✓ |
| 41 Wataka | 5 Downstream | 4 | 30..30 | 15..29 | 1–15 | 7 / 15 | 30 ✓ |
| 42 Kamatsuka | 3 Clear Stream | 21 | 20..20 | 10..19 | 1–10 | 1 / 11 | 20 ✓ |
| 42 Kamatsuka | 4 Lake | 13 | 20..20 | 10..19 | 1–10 | 1 / 9 | 20 ✓ |
| 42 Kamatsuka | 5 Downstream | 7 | 20..20 | 10..19 | 1–10 | 4 / 10 | 20 ✓ |
| 43 Tsuchifuki | 5 Downstream | 26 | 10..10 | 5..9 | 1–5 | 1 / 6 | 10 ✓ |
| 44 Shimadojou | 3 Clear Stream | 12 | 14..15 | 7..13 | 2–8 | 2 / 8 | 15 ✓ |
| 44 Shimadojou | 5 Downstream | 9 | 14..15 | 7..13 | 2–8 | 2 / 7 | 15 ✓ |
| 45 Kamuruchi | 4 Lake | 6 | 80..85 | 40..79 | 6–45 | 8 / 45 | 85 ✓ |
| 45 Kamuruchi | 5 Downstream | 4 | 80..85 | 40..79 | 6–45 | 22 / 30 | 85 ✓ |
| 46 Higai | 4 Lake | 15 | 20..22 | 10..19 | 3–12 | 6 / 13 | 22 ✓ |
| 47 Sougyo | 4 Lake | 6 | 100..140 | 50..99 | 41–90 | 60 / 88 | 140 ✓ |
| 48 Aouo | 4 Lake | 6 | 100..130 | 50..99 | 31–80 | 35 / 77 | 130 ✓ |
| 49 Nigoi | 3 Clear Stream | 8 | 50..50 | 25..49 | 1–25 | 9 / 26 | 50 ✓ |
| 49 Nigoi | 5 Downstream | 4 | 50..50 | 25..49 | 1–25 | 12 / 22 | 50 ✓ |
| 49 Nigoi | 6 River Mouth | 6 | 50..50 | 25..49 | 1–25 | 2 / 23 | 50 ✓ |
| 50 Megochi | 6 River Mouth | 21 | 25..25 | 12..23 | 2–13 | 3 / 12 | 25 ✓ |
| 51 Maruta | 6 River Mouth | 15 | 40..50 | 20..39 | 11–30 | 13 / 29 | 50 ✓ |
| 52 Haze | 6 River Mouth | 30 | 25..45 | 12..23 | 22–33 | 22 / 33 | 45 ✓ |
| 53 Bora | 6 River Mouth | 15 | 60..60 | 30..59 | 1–30 | 2 / 31 | 60 ✓ |
| 54 Suzuki | 6 River Mouth | 25 | 80..100 | 40..79 | 21–60 | 22 / 66 | 100 ✓ |
| 55 Akame | 6 River Mouth | 1 | 120..150 | 60..119 | — | — (re-set at fishing) | 150 only character 1 before the quest; else 119 ✗ |
| 56 Ayu | 3 Clear Stream | 52 | 30..30 | 15..29 | 1–15 | 1 / 15 | 30 ✓ |
| 56 Ayu | 4 Lake | 4 | 30..30 | 15..29 | 1–15 | 1 / 12 | 30 ✓ |
| 57 Tanago | 4 Lake | 14 | 10..10 | 5..9 | 1–5 | 1 / 6 | 10 ✓ |
| 57 Tanago | 5 Downstream | 18 (quest cell) | 10..10 | 5..9 | 1–5 | 1 / 6 | 10 ✓ |
| 58 Unagi | 4 Lake | 5 | 100..130 | 50..99 | 31–80 | 46 / 77 | 130 ✓ |
| 58 Unagi | 5 Downstream | 1 | 100..130 | 50..99 | 31–80 | 65 / 65 | 130 ✓ |
| 58 Unagi | 6 River Mouth | 11 | 100..130 | 50..99 | 31–80 | 31 / 79 | 130 ✓ |
| 59 Giant eel (Oo-unagi) | 6 River Mouth | 1 | 220..220 | — | — | — (re-set at fishing) | 220 once, in the eel story; else none ✗ |
| 60 Aburahaya | 2 Mountain Lake | 20 | 13..13 | 6..11 | 2–7 | 3 / 8 | 13 ✓ |
| 61 Kurodai | 6 River Mouth | 13 | 60..60 | 30..59 | 1–30 | 3 / 28 | 60 ✓ |
| 62 Numagarei | 6 River Mouth | 29 | 95..95 | 47..93 | 2–48 | 2 / 49 | 95 ✓ |
| 63 Kusafugu | 6 River Mouth | 18 | 15..15 | 7..13 | 2–8 | 2 / 8 | 15 ✓ |
| 64 Tougyo | 5 Downstream | 5 | 7..7 | 3..5 | 2–4 | 2 / 5 | 7 ✓ |
| 65 Tenagaebi | 5 Downstream | 18 | 12..20 | 6..11 | 9–14 | 9 / 15 | 20 ✓ |
| 66 Satsukimasu | 3 Clear Stream | 5 | 25..50 | 12..23 | 27–38 | 28 / 40 | 50 ✓ |
| 66 Satsukimasu | 5 Downstream | 1 | 25..50 | 12..23 | 27–38 | 32 / 32 | 50 ✓ |
| 68 Imori | 1 Mountain Stream | 11 | 10..10 | 5..9 | 1–5 | 2 / 6 | 10 ✓ |
| 69 Kaeru | 2 Mountain Lake | 9 | 10..10 | 5..9 | 1–5 | 1 / 6 | 10 ✓ |
| 70 Zarigani (crayfish) | 3 Clear Stream | 11 | 5..5 | 2..3 | 2–3 | 2 / 4 | 5 ✓ |
| 71 Kame | 4 Lake | 10 | 25..30 | 12..23 | 7–18 | 8 / 18 | 30 ✓ |
| 72 Suppon | 5 Downstream | 9 | 30..40 | 15..29 | 11–25 | 12 / 25 | 40 ✓ |
| 73 Kani | 6 River Mouth | 16 | 4..4 | 2..3 | 1–2 | 1 / 2 | 4 ✓ |

## Tests

`fish-max-size-rom.test.ts` (5 tests, about 11 s): the pick table is a permutation; the new game's 1152 fish are all new
fish (below their record min); every cell of all six maps at
max − 1 grows to the record max and at max is removed (one night each, `$085A` set to the map's inn); empty cells get
floor(min/2)..2·floor(min/2)−1; every species of every map grown night by night from the new game reaches its max,
each pick being a new fish, +1, or a fish at max removed. `KAWA_FISH_MAX_OUT=<file>` writes the night counts used here.

`fish-quest-size-rom.test.ts` (7 tests, about 20 s): the quest cells and the eel's only cell; for each of the four
characters the new-game `$0C1E`/`$0C20`, the quest cell at record max and the other quest cells small after a start
of fishing (even when set to max before), small again once flag bit 0 is set, the eel at `$0C20` with bit 2 and gone
with bit 3; a lost fight on the Akame or eel cell takes 2 cm off, floor 60; a slip-back grows the fish by
floor(min/16)+1 (Yamame 23 → 25), adds 3 activity points, and at max − 1 stops at max.

```
KAWA_HYBRID_ROM=~/kawa-private/Taro2_Thai.sfc KAWA_BROWSER_CORE_DIR=~/kawa-private/original-core \
  npx tsx --test apps/web/src/shared/native-macros/fish-max-size-rom.test.ts \
  apps/web/src/shared/native-macros/fish-quest-size-rom.test.ts
```

## Unknowns

- The Tanago's 1 cm per lost fight (01:8262), the Namazu/Koi characters' shrink and the bit 1 / `$0DC8` condition of the
  eel are read in Ghidra only; the test proves the Akame and eel shrink and the flags' effect at the start of fishing.
- Whether a slipped-back fish can be hooked again before the next inn night: 01:9381 sets bit 8 of its `7F:0306`
  word (read by the candidate window 04:C345) and the inn rewrites those words (03:8379); not tested.
- How many activity points a real day earns depends on play; the night estimates above use 30 fights as an example.
- The nights @255 come from one run from character 1's new game (the picks' order is fixed by `$16AE`); other runs
  differ by a few nights.

## สรุปภาษาไทย

- **ไม่มีแผนที่ไหนจำกัดไซส์เอง** ขีดสูงสุดมาจากข้อมูลปลาตัวนั้น (record max) อย่างเดียว เหมือนกันทุกแผนที่ทุกช่อง (ตรวจครบ 1536 ช่อง)
- ปลาโตเฉพาะตอน **นอนโรงแรม** ของแผนที่นั้น: คืนหนึ่งสุ่มช่อง = แต้มกิจกรรมตกปลา (สู้ปลา 1 ครั้ง = 1 แต้ม, สูงสุด 255) ช่องที่ถูกเลือก +1 ซม.; ถึง MAX แล้วคืนถัดไปที่ถูกเลือกจะหายไป
- ปลาเกิดใหม่ (รวมตอนเริ่มเกม) มีขนาดแค่ครึ่งของ record min ถึงต่ำกว่า min นิดหน่อย จึงต้องนอนหลายคืนมากกว่าจะเจอ MAX (เช่น Koi ต้องถูกเลือก 56–85 ครั้ง)
- **ไม่ตรงกับวิกิ 2 ตัว:** อากาเมะ (MAX 150) เจอ 150 ได้เฉพาะตัวละคร 1 ก่อนจบเควส คนอื่นได้แค่ 60..119; ปลาไหลยักษ์ (MAX 220) มีตัวเดียวทั้งเกมตอนเนื้อเรื่องปลาไหล และเล็กลง 2 ซม. ทุกครั้งที่หลุด
- อีก 70 ตัว: MAX จับได้จริงทุกแผนที่ แต่ช้าและอยู่สั้น
