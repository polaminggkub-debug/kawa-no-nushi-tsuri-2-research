# What hooks, floats, and sinkers do in the original ROM

This guide translates the traced item records into player-facing use. It describes behavior in the user-supplied original Japanese SFC ROM (SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`), not a modified ROM.

## The useful answer

> **Corrected 2026-10-07 — see [gear-effects.md](gear-effects.md).** The statement below that the hook match "does **not** prove a higher bite rate, an easier catch" is outdated for the fight: a matching hook halves the fight meter's start (one more mistake allowed), measured in the frame-exact engine, and the hook's size class moves the start by fish size (hooks 7, 8, 11 for fish up to 15 cm, hooks 2, 5, 6, 9, 12, 13 for 16..35 cm, hooks 1, 3, 4 above 35 cm). It is still not a bite-rate effect. The float and sinker statements stand and are now confirmed to have no fight effect.

- **Hooks:** nine records have a nonzero fish ID. When that ID matches the active fish during bait-route fight setup, the game takes a species-matched initialization branch. This makes those hooks sensible candidates for the named fish. It does **not** prove a higher bite rate, an easier catch, or exclusivity.
- **Floats and sinkers:** the game routes IDs 01–08 through the float-equipped bait path and IDs 09–0A through the sinker-equipped bait path. A separate record byte selects one of three state/drawing branches. No traced field establishes depth, sensitivity, weight, or a fish-specific bonus.
- **Fly marker:** fly setup automatically loads Marker ID 08. The marker is therefore also relevant when preparing fly gear.

If you want to choose what fish may bite, use the bait-acceptance findings first. The hook match is a fight-initialization choice; the float/sinker record mostly tells us which equipment and state/drawing path the game loads.

## Fish-matched hooks

| Hook ID | ROM name | Fish ID in hook record | ROM fish name | What the matched branch does |
| --- | --- | --- | --- | --- |
| 01 | シビ | `37` | アカメ | Applies `H(x)=floor(x/2)` to the initial response value and skips this hook's later +0 size-response transform. |
| 02 | ウナギバリ | `3B` | オオウナギ | Same matched-hook branch. |
| 03 | せいごバリ | `36` | スズキ | Same matched-hook branch. |
| 04 | コイバリ | `0D` | コイ | Same matched-hook branch. |
| 05 | ヘラスレ | `25` | ヘラブナ | Same matched-hook branch. |
| 0A | ハナカン | `38` | アユ | Same matched-hook branch. |
| 0B | タナゴバリ | `39` | タナゴ | Same matched-hook branch. |
| 0C | イワナバリ | `01` | イワナ | Same matched-hook branch. |
| 0D | ヤマメバリ | `03` | ヤマメ | Same matched-hook branch. |

So for a named target fish, the useful practical choice is the hook whose record names that fish ID. Treat it as the ROM's intended species-matched hook, not a measured “best hook.” The same setup also checks bait field `$1214` independently; if that field matches the active fish, it invokes the same half transform even without a hook-ID match. The four hooks with +1 = `00` (IDs 06–09) do not enter the hook-ID-matched branch; they use their ordinary +0 response selector unless another setup check, such as the bait field, triggers the shared branch.

### Where hooks are used

The equipment selector has two bait paths: IDs 01–08 select the float-equipped path (selector 0); sinker IDs 09–0A select the sinker-equipped path (selector 1). Both paths load the hook record. Lure and fly setup clear the hook fields, so these fish-matched hook records are not used by those two methods.

## Floats and sinkers

Two different selectors appear in the code; keep them separate:

1. **Equipment route:** selector 0 loads a float item (IDs 01–08); selector 1 loads a sinker item (IDs 09–0A).
2. **Record +0:** values 0, 1, or 2 choose one of the float/sinker state and drawing branches:

| Record +0 | Items in that branch | Safe interpretation |
| --- | --- | --- |
| `0` | 02 丸型シモリ, 03 流線シモリ | Bead-float (shimori) state/drawing path. |
| `1` | 01 ヘラウキ, 04 玉ウキ, 05 棒ウキ, 06 どんぐりウキ, 07 トウガラシウキ, 0A ナツメ型おもり | Float-model state/drawing path. Note that the jujube-shaped (natsume) sinker record shares this code. |
| `2` | 08 目印, 09 小判型おもり | Marker/oval-sinker state/drawing path. |

These byte groups tell us how the game selects its state/drawing routine. They are not a ranking. The ROM trace does not establish that a particular float catches more fish, works at a particular depth, or changes bite sensitivity. The table of fish-accepted baits is the evidence to consult for bait choice.

**ID 08 目印 (Marker) also has a concrete fly use:** fly setup writes `08` to the active float/sinker record slot and loads it automatically. This is a fixed marker setup in the fly path, not evidence that a player-selected float changes fly performance.

## Evidence trail

- ROM record tables: hook table at CPU `05:A068` / file `0x02A068` (13 rows, 9 bytes each); float/sinker table at `05:A138` / `0x02A138` (10 rows, 9 bytes each). The rows and displayed names/prices are also decoded in [`items-rom.json`](../data/items-rom.json).
- Hook record loading: `03:D1C3`; the two bait-route setup paths load the hook at `04:D2DC..D300` and `04:D38B..D3BB`.
- Fish-ID hook branch and ordinary hook response switch: `04:8D53..8D99` and `04:8DC0..8E32`; the half transform is `04:8F6F`.
- Float/sinker equipment selection: `83:B31C..B362`; record loader `03:D17D`; float state/bob response paths `04:E5C8..E724` and the related drawing path `82:DC31..DC84`.
- Automatic fly marker load: `04:D4D0` writes ID `08` before calling the record loader.
- Fish IDs/names come from the original-ROM fish-profile table summarized in [`fish-acceptance.json`](../data/fish-acceptance.json).

## Limits

> **Corrected 2026-10-07 — see [gear-effects.md](gear-effects.md).** "There is no end-to-end controlled catch experiment" and "do not read ... as proof of ... catch probability" no longer hold for hooks: the effect on landing is measured there (Yamame on rod 16: 100 % with a hook that starts the fight at 3, 6 % at 7). Floats and sinkers: checked against the fight code and in 28 interpreter fights, no effect.

This is static ROM evidence. It identifies branches, not a full emulator trial. The traced hook branch changes the initial fight response value; there is no end-to-end controlled catch experiment here. Float/sinker values such as +1, +2, or +3 are not given player-facing meanings unless a consumer was verified. In particular, do not read the item price or one of these byte codes as proof of strength, depth, sensitivity, or catch probability.
