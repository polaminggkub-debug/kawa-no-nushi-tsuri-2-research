# Practical hook, float, and sinker choices

This page answers what the hook/float/sinker records actually change in the user-supplied Japanese SFC ROM (1,572,864 bytes; SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`). All item effects below come from ROM tables and code paths. No external fishing guides were used.

## What to equip

1. **First choose the bait-fishing route.** Float IDs 01–08 use the float route (mode 0). Sinker IDs 09–0A use the sinker route (mode 1). These routes do not accept exactly the same fish profiles: the sinker route adds a fish-profile bit check before it tests bait compatibility. For broad bait-profile coverage, use the float route unless your target passes the sinker-route check. Passing either check is still not a guaranteed bite; position, timing, random thresholds and the later fight remain active. See [fish acceptance](fish-acceptance-research.md).
2. **Treat a fish-matched hook as a behavior choice, not an automatic upgrade.** Nine hooks contain a fish ID. Matching it changes the opening fight calculation and can make a later equipment-loss check happen sooner or later. The name does not establish better bait acceptance or easier landing. The target table identifies which branch changes; it does not rank winning hooks.
3. **For the other four hooks, there is no species-ID match.** They use their +0 response selector and the fish's internal size band. The raw size value is not exposed as a player-facing hook stat, so the ROM trace cannot recommend one general hook as universally better.

The hook changes fight setup after a fish is selected; it does not make an incompatible bait acceptable. Also, a bait record whose own fish ID matches the active fish can trigger the same branch. The fish-matched behavior is therefore not exclusive to carrying that hook.

## Hook ID to target fish

| Hook ID | ROM label | Fish ID match | Practical choice |
| --- | --- | --- | --- |
| 01 | シビ | 37 アカメ | Akame |
| 02 | ウナギバリ | 3B オオウナギ | Giant eel |
| 03 | せいごバリ | 36 スズキ | Suzuki / Japanese sea bass |
| 04 | コイバリ | 0D コイ | Koi / carp |
| 05 | ヘラスレ | 25 ヘラブナ | Herabuna |
| 0A | ハナカン | 38 アユ | Ayu |
| 0B | タナゴバリ | 39 タナゴ | Tanago / bitterling |
| 0C | イワナバリ | 01 イワナ | Iwana |
| 0D | ヤマメバリ | 03 ヤマメ | Yamame |

Hooks 06 (`ハリ`), 07 (`袖ヒガイ`), 08 (`ハヤ・ヤマベ`) and 09 (`マスバリ`) have a zero fish-ID field, so they do not enter the hook-specific fish match. Their names do not prove a special effect on fish with similar names.

## What the hook calculation means

During fight setup, the game first transforms the response value from the rod. In bait modes 0 and 1, it checks the selected bait's fish field and then the hook's fish field against the active fish ID. A match applies `H(x) = floor(x/2)` and skips the hook's ordinary +0 size-response branch. It does not test whether the fish can eat the bait.

When neither bait nor hook matches, the hook's +0 selector chooses an internal transform by fish-size value `$1EB1`:

| Hook +0 | Internal size ≤ 15 | 16–35 | ≥ 36 |
| ---: | --- | --- | --- |
| 0 | `H` | unchanged | `G` |
| 1 | unchanged | `H` | unchanged |
| 2 | `G` | unchanged | `H` |
| 3 | no ordinary size transform in this switch | — | — |

`G(x) = (2x + 1) & 63`. The size field is a ROM/runtime value, not a length in centimeters. The transformed value becomes part of the opening fight state and the fish's displayed offset; the fight code continues updating it afterward. It also changes the timing of a later escape check. When that check occurs, the game tests fish position against a rod boundary. If the fish has crossed it, the ordinary-bait message says the hook is stolen, the fish escapes and points are damaged (`00:0096`). A different ordinary-bait escape path says the fish escapes and the bait is stolen (`00:009A`).

A half-sized value does **not** reliably delay this check. Comparing the hook branch's `H(x)` with leaving the same 6-bit input unchanged, then applying the game's repeated `G`, the check reaches 63 one update later for 31 possible starting values, at the same time for 17, and earlier by as many as 5 updates for 16. Later rod transforms can change the result again. This is why the species-matched hook is a target-specific behavior choice, not a proven safety or catch-rate upgrade. The ROM does not provide enough information to rank every complete rod/bait/hook setup as easier or harder to land.

See [rod response research](rod-response-research.md) for the other rod values that affect the same calculation and its reach boundary.

## What float and sinker models change

The route is the practical equipment choice: IDs 01–08 choose float bait fishing, while IDs 09–0A choose sinker bait fishing. The route selector is separate from each item's model code. A particular float/sinker model does not appear in the bait-vs-fish acceptance-mask comparison; the model's +0 code selects one of the game's float/equipment indicator-state paths, and related code draws that state. Thus the visible bob/indicator behavior varies by model class, but the traced code does not show that one model attracts more fish, hooks them more often, fishes at a particular depth, or improves landing.

| +0 state/display code | Items |
| ---: | --- |
| 0 | 02 Round shimori, 03 Streamlined shimori |
| 1 | 01 Hera float, 04 Ball float, 05 Stick float, 06 Acorn float, 07 Chili float, 0A Natsume sinker |
| 2 | 08 Marker, 09 Oval sinker |

Two cautions:

- The Hera float record has `+1 = 0x25`, the Herabuna fish ID, but its loaded field has no traced reader in the fishing path. Treating it as a Herabuna bonus would go beyond the ROM evidence.
- Fly setup writes Marker ID 08 into the active equipment slot automatically. This proves a fixed marker in the fly setup path, not a benefit from buying or selecting a marker for fly fishing.

## ROM evidence

- Hook records: table `$05:A068`, 13 rows × 9 bytes. Float/sinker records: `$05:A138`, 10 rows × 9 bytes. Names, raw fields and prices are in [`items-rom.json`](../data/items-rom.json).
- Hook load: `$03:D1C3`; bait-route hook loading: `$04:D2DC..D300` and `$04:D38B..D3BB`.
- Bait/hook fish-ID checks, hook size switch and `H/G`: `$04:8D53..8E32`, `$04:8F6F..8F82`.
- Fight-state consumer: `$04:875D..8804`, `$04:9C35..9C86`; fish display offset: `$04:8F83..8FC6` and `$04:A4CD..A4D3`.
- Float/sinker route selection: `$83:B31C..B362`; record load: `$03:D17D..D1BF`.
- Float indicator update and drawing: `$04:E5C8..E724`, `$00:A142..A1E1`, `$02:DC31..DCB7`.
- Automatic fly marker: `$04:D4D0`.
- The sinker route's additional fish filter is documented in [`fish-acceptance-research.md`](fish-acceptance-research.md).

The accompanying [`hook-practical-research.json`](../data/hook-practical-research.json) contains English, Japanese, and Thai card-copy overrides for all 23 hook/float/sinker items.
