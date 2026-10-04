# Find Mayfly components in the game menu

Use the **Area 1 fly maker**, select **メイフライ (Mayfly)**, and start each part at its default top-left cursor. Press Right `column − 1` times, Down `row − 1` times, then A. The item detail pages show each verified position and an original game frame with its cursor.

These positions identify components. They do not establish which catches fish better. Check the game's final quote before paying; components do not need to be owned separately.

## Body: 15 confirmed choices

| Row / column | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| 1 | `01` | `05` | `18` | `1C` |
| 2 | `02` | `06` | `19` | `1D` |
| 3 | `03` | `07` | `1A` | `1E` |
| 4 | `04` | `08` | `1B` | no additional choice |

The requested fourth-column/fourth-row path ends on `1B`, duplicating the preceding valid choice. It is not a sixteenth body.

## Tail: nine components and None

| Row / column | 1 | 2 | 3 |
| --- | --- | --- | --- |
| 1 | `13` | `17` | `2A` |
| 2 | `14` | `27` | None (`無し`) |
| 3 | `15` | `28` | no additional choice |
| 4 | `16` | `29` | no additional choice |

Confirming None stores tail `00`. It is a menu action, not a component record or an item to buy. The trailing empty-position probes repeat `28` and `29` respectively.

## Wings

The [independently verified wing crosswalk](fly-maker-wing-palette-research.md) has sixteen positions. Together these three menus provide **40 identified component choices plus None** in the tested context. This is not a count of all components in the ROM or all possible menus.

## Evidence and reproducibility

ROM SHA-1: `c2103dd94e2a1a65a495fc02adc2e7d040f31212`; SHA-256: `e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49`. Snes9x core SHA-256: `8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6`.

The first replay restored the existing body-menu state and the wing-09-confirmed tail-menu state. It issued only controller inputs, confirmed each requested position, and read selected body `$1D35` or tail `$1D39`. An independent replay used separate requests/output files: all **28 selected IDs and pre-confirm cursor-frame hashes matched**. No request writes to WRAM or the ROM.

[Structured positions and frame hashes](../data/fly-maker-menu-positions.json) retain the validated choices and separately label clamped empty-position observations. The images preserve the original 256×224 game frames. [ROM menu trace](fly-maker-menu-research.md) explains the component table and selection routine. Private requests/results/states remain in `rom-analysis/fly-maker-body-tail-r4` and `rom-analysis/fly-maker-body-tail-independent-r5`; ROM, core and save states are not published.

These controlled menu replays do not establish new-game progression, other families, other areas, or fishing outcomes. The old visual estimate of twenty wing choices is retained only as a superseded historical observation in [the capture log](../data/fly-customization.json).
