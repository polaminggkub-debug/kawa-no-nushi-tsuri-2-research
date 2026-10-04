# Map and fish browser

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

These are configured spawn positions. Population state can leave a slot inactive, so a marker tells the player where to look rather than guaranteeing a live fish. The page does not rank bite rates or landing odds.

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
