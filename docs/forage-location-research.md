# Magnifying-glass search locations from original-ROM terrain

ROM SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`. No external guide supplies these points.

## What the player can do

Open the magnifying-glass card, open a numbered area, walk to a bait icon on the actual field crop, and use the glass. A pair of icons means **one of the two outcomes**, not both. Move to another tile before searching again. These are 30 example tiles across all six areas, not an exhaustive list of searchable tiles.

## Coordinate and terrain trace

The original field loader decompresses each area into `7E:2000`. At `00:8865..8895`, the two descriptor bytes at `7E:2300` index the dimension table at `00:89E7`; width is stored at `0250`. `00:88A1..88AD` sets the gameplay terrain-byte pointer to `7E:2B02`. The descriptor at `7E:6B4D` supplies ten little-endian terrain thresholds copied into `0234..0246` by `00:89AB..89C2`.

`00:949E..94B9` computes `terrainBase + Y*width + X`. `00:8F7D..8FEB` classifies that byte by checking thresholds 9 down to 1. `00:B77D..B798` stores the result in `0842`. `03:D451..D49B` updates the search context `1E97` when the tile changes: terrain classes 1–5 select the corresponding context, 7 clears it, while class 0 retains the previous context. Thus it would be incorrect to claim that only marked tiles can yield bait: neutral tiles can retain the context from a tile crossed earlier.

The extractor finds example class 1–5 tiles directly in each decompressed terrain array and uses the same 16-pixel world projection and tile centers as the ROM fish maps. It verifies every source terrain image against the existing map manifest before cropping. Bait icons come from existing ROM item captures; no terrain name such as “grass” or “soil” is guessed.

The reward mapping is traced in [general-tool-actions-research.md](general-tool-actions-research.md). Context 2 gives potato bait in area 3 and worms elsewhere. Contexts 4/5 use the sign of the frame counter to select the two outcomes; that counter is not a day/night flag. The successful grant gives 1–4 bait, capped at nine of that bait.

## Reproduction

```sh
python3 scripts/build_forage_locations.py --rom /path/to/game.sfc
python3 scripts/build_item_use.py
node scripts/build_catalogue.cjs
```

[Point data and provenance](../data/forage-locations.json). Only coordinates, evidence metadata and image crops are published; ROM and decompressed terrain remain local.

## Controlled field observation

The existing area-3 field-loader state was copied to five temporary local states. Each copy was placed at one published tile, with cached search-context coordinates invalidated; the unmodified ROM ran for eight frames. The ROM itself recomputed terrain and context as follows (field state remained 2):

| Tile X/Y | Terrain computed by ROM | Search context computed by ROM |
| --- | ---: | ---: |
| 11/36 | 1 | 1 |
| 12/36 | 2 | 2 |
| 12/31 | 3 | 3 |
| 14/36 | 4 | 4 |
| 15/38 | 5 | 5 |

This observation confirms the coordinate/classification path for all five classes in area 3. The bait reward is established by the handler trace, rather than claiming these observation runs performed a complete collection interaction. All six map sets are extracted by the same traced terrain-byte classifier using their own thresholds.
