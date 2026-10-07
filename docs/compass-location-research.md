# Compass exit targets from the original ROM

This page records the fixed outdoor exit targets for Compass `0E` in Areas 1–5. It uses the supplied headerless Japanese SFC ROM, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`, the compass trace in [`data/general-tool-actions.json`](../data/general-tool-actions.json), and the ROM-reconstructed field maps covered by [`catalogue/maps/rom-map-manifest.json`](../catalogue/maps/rom-map-manifest.json). No outside guide is used.

## What the player can do

If these maps provide the fixed exit coordinates a player needs, there is no need to buy Compass `0E` just to learn them. The compass costs ¥300 and appears in the shop stock for Areas 1, 2, 3 and 6. It is useful when the player wants an in-game heading from their current tile. Area links open the corresponding map section on the compass item page; its marker opens the crop at full size.

Use the compass outdoors, follow its indicated heading, and use it again after moving to refresh the bearing. The needle stops at the marked target. The transition code reads this same target coordinate and loads map 13, the connecting route. That relationship is inferred from the traced transition consumer; the compass's Japanese message only gives direction and current area/section, and does not name a destination.

| Area | Compass target tile (X,Y) |
| ---: | ---: |
| 1 | `(13,239)` |
| 2 | `(56,17)` |
| 3 | `(22,5)` |
| 4 | `(32,41)` |
| 5 | `(22,2)` |

These are target pins, not tested walking directions. No natural walking route, obstacle-avoiding route, or shortest route was tested. The maps show the target tile on the ROM-reconstructed field terrain; they do not establish that every intervening tile is traversable.

## Area 6 is not a static target

Area 6's table row contains the `0x00FF` sentinel instead of fixed coordinates; the compass reads dynamic words at `$0C:DE02` and `$0C:EA02`. A story-progress flag (`$0C18 & 4`) controls whether the heading appears. Before that condition is met, the compass reports the current area and section without a heading. A later [bounded story-gate trace](magnet-story-gate-research.md) connects the flag to the prerequisite return-scene state and 65 distinct nonzero record slots out of 66. The natural encounter/catch trigger remains unproven, so this note does not give a quest-completion instruction or draw a fixed Area 6 pin.

## Source trace and map projection

- The compass handler is `03:C313..C3E8`; it looks up the area target in the table at CPU address `00:A065` (file offset `0x002065`) and chooses a compass message. The stored target fields are the first two little-endian words in each 8-byte area row.
- The Area 1–5 table target bytes are `0D 00 EF 00`, `38 00 11 00`, `16 00 05 00`, `20 00 29 00`, and `16 00 02 00`. The Area 6 row begins with `FF 00 FF 00` and is dynamic.
- The transition consumer `00:9D94..9DD8` compares the player against the same target coordinates. On a matching target it changes to map 13 and loads that map's entry coordinates. This establishes the code relationship, not a tested full route from the area entrance.
- Each crop starts from the `fieldMap.image` in the ROM map manifest. The generator checks the source image SHA-256 and dimensions against the manifest, then projects each target to the tile center using that manifest's `worldToMapPixel` values (16 pixels per world tile, offset 8 pixels).
- Each crop is at most 384×384 pixels and shows a yellow/black locator centered on the target. The full field map remains linked from the card.

## Rebuild and validation

From the `publication` directory's repository root, run:

```sh
python3 scripts/build_compass_locations.py --rom /path/to/Kawa-no-Nushi-Tsuri-2-Japan-.sfc
```

The script verifies the ROM SHA-1, each Area 1–5 target byte row against both the ROM and the compass trace, the Area 6 dynamic sentinel, the compass's ¥300 record price and shop stages, and each source-map SHA-256/dimension against the manifest. It writes [`data/compass-locations.json`](../data/compass-locations.json) and `catalogue/maps/tool-compass-area1.png` through `tool-compass-area5.png`.

The site builder should attach `items["general_tool:0E"]` as Compass `0E`'s `playerUse.useLocations`, and use the localized `playerSummary` as its player-facing summary. Keep Area 6 omitted from these fixed-coordinate links.

## Evidence references

- [Compass handler and target table trace](general-tool-actions-research.md#magnet-id-0e)
- [Machine-readable ROM compass trace](../data/general-tool-actions.json)
- [ROM-derived shop stock and item records](../data/shop-stock-rom.json) and [`data/general-tool-code-index.json`](../data/general-tool-code-index.json)
- [ROM field-map manifest](../catalogue/maps/rom-map-manifest.json)
