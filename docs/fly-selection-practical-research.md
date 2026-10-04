# A practical way around the fly body/wing check

## Player answer

For a fish shown on the wet-fly profile list, keep these three **ready-made** flies and try them in the same loaded fishing area if one is blocked by the hidden body/wing check:

| Area | Shop order | Body / wing / tail IDs (hex) | Body / wing residues | ROM shop quote |
| --- | ---: | --- | --- | ---: |
| 1 | first | `01 / 09 / 13` | `1 / 1` | ¥5 |
| 1 | third | `2B / 34 / 00` | `3 / 0` | ¥15 |
| 2 | first | `02 / 0A / 14` | `2 / 2` | ¥10 |

The set costs **¥30 total** at the recorded shop quotes. It is a way to get at least one of the three past this particular hidden check for any fixed hidden value pair. That is a bounded source-backed recommendation: all three bodies pass the same `0x0020` fish-profile mask, and their body IDs and wing IDs each occupy three distinct low-two-bit groups. There are 16 possible hidden body/wing value pairs (`0..3` each); any one pair can match at most one body group and at most one wing group, so it can block at most two of these three combinations.

The 33 fish profiles that pass this body-selected mask are listed in [fish-acceptance.json](../data/fish-acceptance.json). Passing these checks only keeps the fly eligible for this event path. It does not make a fish bite, hook, or land: position, timing, other random tests, and fight response still apply.

The entries are ready-made shop bundles, not three components to assemble. Buy the first and third listed fly bundles in area 1, then the first listed bundle in area 2. In the ROM's decompressed shop stock each of those areas has eight nonzero body entries, so those zero-based stock slots remain the first, third, and first displayed choices. The setup at `03:8FF5` copies the parallel body/wing/tail stock lists; the visible-list loop at `03:90D7` preserves the order of the eight nonzero body slots. Selecting a bundle at `03:9119` transfers all three parts into the current fly fields, and the purchase path at `03:91A9` stores the combination in inventory.

If the current fly fails this extra check, changing only one component is conditional:

- Changing the wing avoids the wing comparison only when the unchanged body already avoids its comparison. If the body matches its hidden value, the event stays blocked.
- Changing the body avoids the body comparison only when the unchanged wing already avoids its comparison. If the wing matches its hidden value, the event stays blocked.
- With the hidden values unknown, use a bundle from the three-set above. One fresh wing or body by itself is not a guaranteed fix.

The check is refreshed from the currently equipped body and wing by the fly setup at `04:D47C..D4CD`. The traced equipment and cast paths contain no writes to either hidden-value field, so a same-field switch that avoids an inn/rest action or field-data rebuild recalculates against the stored pair. A cast by itself does not roll a new pair. This is a static call-path result; I did not independently reproduce an in-game equipment switch with emulator controls.

## When the hidden values change

The ROM compares the equipped body's low two ID bits (`7E:1238 & 3`) with `7F:1E86`, then the equipped wing's low two ID bits (`7E:123A & 3`) with `7F:1E88`. Equality on either side clears `7E:1FA7` at `04:D4B2..D4CD`. Mode 3 ANDs that pass/skip value after the body-selected bait mask and fish-profile mask at `04:E6C9..E6D2`.

The field/spawn-data rebuild path is `01:A0B9 -> 01:B705 -> 01:BEC5`. Its `04:EC56` call samples and stores one body/wing pair at `04:EDA0..EDB6`; after that returns, `01:BECD..BEF1` calls the area refresh once for each selector `1..6`. The pair is therefore generated at the shared-data rebuild boundary, not per selector, fish encounter, or cast. Rebuilding that data can produce a new pair. The builder is reached by field-data refresh paths including `01:A0B9`, `01:B5EC`, and `01:B6E6`.

There is also a separate service/rest writer: `03:8074` calls the routine at `03:80C7`; it writes body and wing samples at `03:835B` and `03:836E` only when the corresponding tests on `7E:1364` are clear (`& 0x22 == 0` for body, `& 0x11 == 0` for wing). Each sample is a random value masked to `0..3`, so resting is not a guaranteed change and the flags can preserve an existing side. A ROM scan finds these and the area-data stores as the literal `STA long` write sites; it is not a proof that unrelated indirect memory-copy code can never affect the addresses.

These are static source conclusions. The exact values are not shown to the player, the inn flags' wider meaning is not established here, and a field transition may rebuild the shared area data. The practical recipe assumes all three bundles are in inventory and the player changes equipment before such a rebuild or rest.

## What the tail establishes

The equipment routine copies the bundle's tail ID to `7E:123C` at `04:D49D..D4A3`. The body-selected profile-mask branch reads body record fields at `04:D4DC..D4F9`; the additional hidden comparison reads only `7E:1238` and `7E:123A` at `04:D4B2..D4CD`. Neither check reads the tail ID. The examined fish-profile and hidden body/wing checks therefore establish **no fish-specific tail advantage**. Choose a tail by appearance, or use the no-tail option when a ready-made bundle supplies `00`; this is not a claim that the tail has no use anywhere in the game.

## Reproduction

Run [trace_fly_hidden_state.py](../scripts/trace_fly_hidden_state.py) with the matching user-supplied Japanese ROM. It checks the identified writer sites and gate instructions, re-extracts the six areas' shop bundles from the local ROM, verifies the selected component records and mask coverage, and enumerates all 16 hidden pairs. The script reports evidence only; it does not simulate a bite or catch. The ROM itself is neither copied into the repository nor written by the script.

## Cheapest backup sets for the selected fish

The fish pages use a narrower target-specific choice rather than always recommending the broad ¥30 set. [extract_fly_backup_choices.cjs](../scripts/extract_fly_backup_choices.cjs) reads the existing ROM-extracted [shop-stock-rom.json](../data/shop-stock-rom.json) and [fish-acceptance.json](../data/fish-acceptance.json). It enumerates all three-bundle combinations from the 48 recorded ready-made offers whose bodies each pass the selected target's profile mask. A qualifying triple must have three different body residues and three different wing residues; this is necessary and sufficient for a three-bundle set to avoid a union of one blocked body group and one blocked wing group. The generator checks all 16 hidden pairs for each retained candidate, then selects the lowest total recorded quote.

For the 17 dry-mask-compatible profiles, the cheapest combination costs **¥17**:

| Area | Shop fly order | Body / wing / tail IDs | Full bundle quote |
| --- | ---: | --- | ---: |
| 1 | first | `01 / 09 / 13` | ¥5 |
| 1 | fourth | `3E / 43 / 49` | ¥5 |
| 2 | fourth | `3F / 44 / 4A` | ¥7 |

The first body uses the wet mask; the other two use the dry mask. Each of the 17 targets passes all three body checks. Their body/wing residues are `1/1`, `2/3`, and `3/0`. For the other 16 profiles in the broader 33-profile wet set, the minimum qualifying triple is the ¥30 combination above. The complete generated per-target choices are in [fly-backup-choices.json](../data/fly-backup-choices.json).

Two bundles cannot cover every fixed hidden pair: choose the hidden body group to match the first bundle and the hidden wing group to match the second; both then fail the OR block. This minimum is only among the recorded three ready-made shop bundles, across all six areas. It is not a custom-fly price minimum, a single-shop availability claim, or a success-rate ranking. The same fixed-state and unverified live switching boundaries above apply.
