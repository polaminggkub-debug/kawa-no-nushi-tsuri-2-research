# Shop and town locations decoded from the original ROM

This research identifies the outdoor points that enter each town, the town coordinates where the normal equipment shop and special-rod seller are registered, and the exact map used for each coordinate. It uses only the supplied Japanese ROM (SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`) and original-ROM Snes9x captures. No outside guide is used.

The machine-readable source is [`shop-locations-rom.json`](../data/shop-locations-rom.json). The six town backgrounds are [`rom-town-07.png`](../catalogue/maps/rom-town-07.png) through [`rom-town-12.png`](../catalogue/maps/rom-town-12.png); each image covers 16 columns by 80 rows at 16 pixels per tile. The loader descriptor reports 16×128 tiles, but rows 80–127 are not included in the published crop or used for these locations. Sprites are omitted from the rendered background; markers must be drawn from the JSON coordinates.

## Player-facing locations

Internal town map IDs are outdoor-area IDs plus six. A town coordinate is not an outdoor fishing-map coordinate. First use the `fieldTile` point on the numbered outdoor map, then use the corresponding `townArrival` coordinate on the separate town image.

| Outdoor area | Town map | Outdoor entrance #2 | Town arrival | Equipment shop, slot `08` | Special-rod seller, slot `10` |
|---:|---:|---:|---:|---:|---:|
| 1 | 7 | `(12,182)` | `(7,29)` | `(7,24)` | — |
| 2 | 8 | `(91,25)` | `(7,29)` | `(7,23)` | — |
| 3 | 9 | `(20,86)` | `(7,29)` | `(7,24)` | — |
| 4 | 10 | `(51,27)` | `(7,29)` | `(7,23)` | `(8,74)`, via entrance #5 |
| 5 | 11 | `(52,26)` | `(7,29)` | `(7,24)` | `(7,74)`, via entrance #5 |
| 6 | 12 | `(2,49)` | `(7,29)` | `(8,23)` | `(7,74)`, via entrance #5 |

The shop positions come from town object slot `08` and the separate fixed-rod slot `10`. Slot `08` dispatches to the normal shop menu (`03:8634`). The town stock table is associated with the matching outdoor area; actual sale availability is still determined by [the decoded area stock](shop-stock-research.md). Slot `10` dispatches to the special rod menu (`03:86E1..8733`) only in town maps 10–12. Its confirmed offers are area 4 rod `0D`, area 5 rods `08` and `01`, and area 6 rod `10`. Slot `10` in town maps 7–9 runs a different interaction and is not labelled as a rod shop here.

The seller’s position is an exact ROM object coordinate. The entrance association is shown as verified only when a local emulator probe started at the ROM-selected town arrival and opened the expected shop slot. The area-6 regular-shop interaction is positioned exactly, but its walk from entrance #2 has not been verified; the map page should show those endpoints separately.

## Outdoor entrance coordinates

The ROM keeps five possible entry records per outdoor area. A coordinate is retained only if it is inside that area's ROM-rendered field dimensions; areas 2 and 3 have an out-of-bounds `(255,255)` record in ordinal 4, which is a sentinel and is excluded.

| Area | Entrance #1 | Entrance #2 | Entrance #3 | Entrance #4 | Entrance #5 |
|---:|---:|---:|---:|---:|---:|
| 1 | `(8,183)` | `(12,182)` | `(13,185)` | `(11,179)` | `(12,189)` |
| 2 | `(85,28)` | `(91,25)` | `(86,24)` | `(81,26)` | — |
| 3 | `(26,39)` | `(20,86)` | `(28,91)` | `(27,81)` | — |
| 4 | `(61,21)` | `(51,27)` | `(41,22)` | `(60,29)` | `(12,62)` |
| 5 | `(59,27)` | `(52,26)` | `(64,22)` | `(59,21)` | `(2,3)` |
| 6 | `(9,41)` | `(2,49)` | `(20,42)` | `(15,42)` | `(58,31)` |

All valid outdoor records enter the town map for that same area. Their shared town-arrival coordinates, in entrance order, are `(7,13)`, `(7,29)`, `(7,45)`, `(7,61)`, and `(7,77)`. These are tile coordinates, not screen pixels. The JSON uses zero-based `ordinal` values; entrance #2 has `ordinal: 1`.

## Verified shop access probes

The access probes used the local original ROM in Snes9x with the player placed at a town-arrival tile from the ROM transition table. The resulting WRAM interaction selector and shop mode were checked after pressing the action button. The emulator states are private and are not distributed.

- **Normal shop, areas 1–5:** entrance ordinal 1 arrives at `(7,29)`; the original-ROM interaction probe opened slot `08`, mode `2`, in the associated town map. Area 4 used a route around the room divider; the directional frame sequence is retained in `verifiedAccess` for reproducibility.
- **Special-rod seller, areas 4–6:** entrance ordinal 4 arrives at `(7,77)`; the probe opened slot `10`, mode `7`, in each town map 10–12. Area 4's vendor is one tile east of the `(7,74)` approach; areas 5 and 6 place the vendor at `(7,74)`.
- **Normal shop, area 6:** object slot `08` at `(8,23)` is confirmed by the town object table and mode dispatcher. Its specific walk from the recorded arrival was not confirmed, so no entrance link is claimed.

This establishes an entrance-to-town spawn and a shop interaction within the same town coordinate system. It does not claim a universal route, travel time, or that every possible entry point is accessible at every progression state. The outdoor entry routine also checks the game's current event/action state before transitioning.

## Town chests use town maps too

The same object pointer table places chest slot `0E` on interior maps, which is why these coordinates must not be pinned to the outdoor fishing maps:

| Town map | Chest tile | ROM result |
|---:|---:|---|
| 7 | `(5,68)` | Potato bait `11` (key required) |
| 8 | `(4,6)` | Waxworm bait `0B` (key required) |
| 9 | `(6,4)` | Empty milk bottle `0F` (no key) |
| 10 | `(4,6)` | Small lure rod `0A` (key required) |
| 11 | `(4,6)` | Lottery ticket `11` (no key) |
| 12 | `(4,6)` | Candle `12` (key required) |

Rewards and key conditions are traced in [quest/tool-use research](quest-tool-use-research.md). The `townChests` rows in the JSON preserve their town map ID and ROM object slot so later location pages can show them on the correct background.

## ROM evidence

- `$00:9CC0..9E09` tests the outdoor entrance records. `$00:9FB9` (file offset `0x001FB9`) holds the interleaved X/Y words, grouped by outdoor area with a 24-byte stride. The transition at `$00:9E09` adds six to the outdoor map ID and selects an arrival coordinate by the matched entrance ordinal.
- `$00:A049` (file offset `0x002049`) stores the five town arrival coordinates in order: `(7,13)`, `(7,29)`, `(7,45)`, `(7,61)`, `(7,77)`.
- `$00:BD76` (file offset `0x003D76`) points to each map's object-coordinate records. Town maps 7–12 use pointers beginning at `$00:C082`; slot `08` is the normal shop interaction, slot `0E` is the chest handler, and slot `10` selects mode 3 in towns 7–9 or mode 7 in towns 10–12.
- `$00:CED7..CF28` dispatches those interactions. Mode 2 reaches `$03:8634`; mode 7 reaches `$03:86E1..8733`, which selects the fixed special rods based on town map ID.
- The field-map manifest supplies the six outdoor tile bounds used to reject off-map sentinels. Town PPU backgrounds were captured after the original-ROM area setup and reconstructed without sprites by `render_field_snapshot.py`.

## Reproduce

Use your own matching Japanese ROM, compatible Snes9x libretro core, and a local save state in outdoor area 1. Emulator files stay outside the publication directory.

```sh
python3 scripts/extract_shop_locations.py \
  --rom /path/to/Kawa-no-Nushi-Tsuri-2-Japan-.sfc \
  --core /path/to/snes9x_libretro.dylib \
  --field-state /path/to/local-area-1.state \
  --local-dir /tmp/kawa-town-captures
```

The script writes `data/shop-locations-rom.json` and `catalogue/maps/rom-town-07.png` through `rom-town-12.png`. It validates the ROM SHA-1, ROM-rendered field bounds, town descriptor, map ID, capture state, image dimensions, and output coverage. It does not distribute or copy the ROM, core, save states, or WRAM dumps.
