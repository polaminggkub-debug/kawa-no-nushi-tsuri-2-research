# Map and fish browser

> **Corrected 2026-10-07:** a pin is a fish's start position, not a spawn chance, and an "inactive slot" is simply an empty one (not yet filled, landed, or escaped until the inn). Repeated slots at one tile are stacked fish. See [fish-location-research.md](fish-location-research.md).

The [map page](../catalogue/maps.html) offers an area-first route alongside the existing equipment catalogue. Its inputs are the published `catalogue/fish-locations.json` and the ROM-extracted portraits and published translated name aliases in `catalogue/gallery-data.json`. It does not use third-party fish-guide map placements.

## Player workflow

1. Choose an area to see its real terrain and unique fish species.
2. Narrow by fish name or map view. Names can be searched using the available Thai, Japanese and Latin/English aliases.
3. Select a fish to see the configured positions and other areas where the same species occurs.
4. Follow the equipment link to the catalogue with that target fish preserved.

## Duplicate handling

A species is listed once in a filtered species list. A species at the same tile is one displayed point even when several ROM spawn slots share that tile. Distinct species at the same tile are not interchangeable; each remains represented. Original slot indices remain in the source data.

## Projection and evidence

Terrain is stitched from captures of the same original ROM. World tile centres are `(16x + 8, 16y + 8)`, as established in [fish-location-research.md](fish-location-research.md). Existing per-fish crops can have different origins even when their names mention the same column/row; their `tileBounds` fields describe their fish points, not crop boundaries. Any combined view must retain each image's actual coordinate projection.

These are fish start positions after loading. Fish wander (most stay within 1–2 tiles), and about 1 pin in 4 is empty on a new save. A landed fish leaves its pin empty and an escaped fish is gone until the area's inn or a restart, so a marker tells the player where to look rather than guaranteeing a live fish. The page carries a plain "How fish on the map work" explainer for this. The page does not rank bite rates or landing odds.

## Published coverage

The location catalogue contains 72 species and 103 species-area records. It retains all 1,536 configured spawn slots as 1,437 unique species/area/tile positions. Some different species share a tile; those remain distinct species, even if a visual cluster combines their marker.

| Area | Unique species |
| --- | ---: |
| 1 | 7 |
| 2 | 13 |
| 3 | 16 |
| 4 | 23 |
| 5 | 28 |
| 6 | 16 |

Species counts overlap between areas and should not be added to obtain the game's unique total. Portrait ID `43` has no published spawn-location record and is omitted from this browser's species set.
