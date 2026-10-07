# Fish acceptance gates from the original ROM

> **Corrected 2026-10-07.** The audit (`rom-analysis/audit-2026-10-07/acceptance/report.md`) confirmed the mask comparisons below and tested them on an emulator: a fish that passes the mask bites every time its tile holds the float or lure (float 79/79, sinker 75/75, lure 245/245, fly wet 33/33 and dry 17/17), and no fish that fails it ever does. Read "does not establish a bite" below as: the mask is the only species gate, and the remaining requirements are the exact tile, the wait (float 128 frames, sinker 600, lure 48 with A/B pressed, fly 8) and, for flies, the hidden body/wing lock. Time, weather, rod, hook, HP and cast distance are never read.

This note separates the game's fish-profile mask checks from a successful bite or catch. All values below were extracted from the user-supplied, headerless Japanese SFC ROM (1,572,864 bytes; SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`). The reproducible extraction is [extract_fish_acceptance.py](../scripts/extract_fish_acceptance.py); its output is [fish-acceptance.json](../data/fish-acceptance.json). The output contains IDs, masks, decoded fish labels, pointers, and prices, but no ROM bytes.

## The mask comparison

The fish-profile table begins at `$05:8018` (file `0x028018`), has 23-byte rows, and contains 73 IDs (`01`–`49`, hexadecimal). The fish loader at `$03:D26D` copies profile bytes `+0..+14` into WRAM fields and the 16-bit word at `+15/+16` into `$7E:1208` (`0x01D2EC..0x01D2F1`). The bait table begins at `$05:9E67`, with 12-byte rows; its word at `+6/+7` is copied to `$7E:121E` by `$03:D030` (`0x01D068..0x01D071`). Lures use the same `+6/+7` mask layout at `$05:A1D8`, loaded to `$7E:1232`.

The profile-mask criterion is therefore:

```text
(bait or lure record word at +6 & fish profile word at +15) != 0
```

The 73-row block includes ID `43`, whose name byte is unmapped (`0C`) and whose mask is zero. It cannot pass a mask comparison; retaining the row is not evidence that the game normally spawns it. Counts below exclude that placeholder where a profile count is given: 72 ordinary rows remain.

## Mode 0: bait fishing with a float

The dispatcher calls `04:E524` at `04:C0E2` when mode 0 is in phase 3. Its candidate-selection route `04:E803..E8DC` compares fish coordinates with the current target and compares a random value against fish profile byte +3 (`11F0`). Unlike mode 1, it does not require profile +13 bit08. At the timed event, `04:E573..E579` reads `121E & 1208`; a nonzero result sets `1F7B=2`, `16A8=14` and calls `EDD2`. A zero result clears the candidate/event state.

All 72 ordinary profile rows have a nonzero +3 random threshold, so the bait mask sets below are also the profile sets that can pass this necessary mode-0 mask condition. This does not eliminate the position, random, timing or landing requirements. The smaller mode-1 sets must not be substituted for ordinary mode-0 bait compatibility.

## Mode 1: bait fishing with a sinker and its extra checks

The mode dispatcher at `$04:C0A5` sends mode 1 to `$04:E9AB` (`0x024106`). That route first requires a bait profile in `$7E:1210`, checks the in-water candidate's coordinates and loads its fish profile. It then applies two checks before the mask: fish profile byte `+13` must have bit `08` set (`$7E:1204 & 08`), and a random value must be below profile byte `+3` (`$7E:11F0`). Only after those checks does `$04:EB0B..EB11` test `$7E:121E & $7E:1208` and proceed on a nonzero result.

Across all bait masks, 72 profile rows pass the mask comparison for at least one bait. For mode 1, 30 rows also have the required `+13` bit and a nonzero `+3` threshold; the random comparison still runs, so this is not a bite-rate or success count. Do not apply these mode-1 prechecks to flies: mode 3 takes a separate route.

| Mask | Bait IDs | Rows passing mask | Mode 1 rows passing static prechecks |
| --- | --- | ---: | ---: |
| `0001` | `01` | 44 | 20 |
| `0002` | `02, 03, 0B, 0C` | 22 | 8 |
| `0004` | `04` | 17 | 1 |
| `0008` | `05` | 24 | 13 |
| `0010` | `06` | 16 | 9 |
| `0020` | `07, 08` | 33 | 12 |
| `0040` | `0A` | 25 | 7 |
| `0080` | `0D–10` | 17 | 5 |
| `0100` | `11` | 9 | 3 |
| `0200` | `12` | 32 | 12 |
| `0400` | `13, 14` | 21 | 6 |
| `0800` | `09` | 9 | 0 |
| `1000` | `15` | 27 | 12 |
| `4000` | `16` | 19 | 11 |
| `8000` | `17` | 1 | 0 |

The JSON has the per-fish and per-item IDs for each row; IDs here are hexadecimal table IDs.

## Fly bodies select a bait mask

Mode 3 is dispatched to `$04:E685` (`$04:C142`, file `0x024142`). The equipped fly's body record is loaded at `$04:D47C..D500`; its fields at `+0` and `+2` choose a bait record, which is then loaded through `$03:D030`:

| Body-record condition | Selected bait ID | Bait mask |
| --- | --- | --- |
| `+2 != 0` | `04` | `0004` |
| `+2 == 0`, `+0 == 1` | `08` | `0020` |
| `+2 == 0`, `+0 != 1` | `07` | `0020` |

The 64 ordinary body IDs are sparse: `01–08`, `18–1E`, `2B–33`, `3E–42`, `4B–4F`, `56–59`, `60–65`, `6C–6F`, and `77–86`. The 28 bodies selecting bait `07/08` use mask `0020` and match 33 profile rows. The 36 bodies selecting bait `04` use mask `0004` and match 17 rows; those 17 are a subset of the 33 for `0020`. Thus the *profile-mask-only* set cover is one body from the `0020` group. This is not a full fly recommendation.

The live fly path adds another filter. `$04:D4AF` initializes `$7E:1FA7` to `00FF`; if body ID `$7E:1238 & 3` equals `$7F:1E86`, or wing ID `$7E:123A & 3` equals `$7F:1E88`, it clears `$1FA7`. The mode-3 route at `$04:E6C9` ANDs `$1FA7` after the bait and fish masks; a zero result skips that event. The two `$7F:1E86/1E88` fields receive dynamic low-two-bit values from random calls (including `$03:835B/836E` and `$04:EDA7/EDB2`); their broader meaning is not established. Wings therefore participate in this additional filter, and the mask-only set cover cannot establish that one body works for every encounter. Tail effects are not resolved here.

## Limits

Mask compatibility is not proof of attraction, a bite, a hook-up, or landing the fish. Position, timing, random comparisons, style-specific state, rod/hook response, and other checks remain active. The full fish→lure mask matrix is included in the JSON and aligns with the separate lure analysis; the lure route also has its own `$7E:1348 & 8080` condition before its mask at `$04:EBFD..EC03`.

## Selecting float versus sinker

The equipment selector `03:B33E..B362` classifies float/sinker table IDs below 9 as the float-equipped route (slot `0880`, mode0), and IDs9/10 as the sinker-equipped route (slot `0886`, mode1). Both load the same float/sinker record table. Slot0886 must not be labeled an Ayu decoy merely from sharing a bait-style rod. This explains why a bait's mode0-compatible profile set can be larger than the mode1 set. See [the equipment consumers](hook-float-use.md).
