# Town chest item acquisition locations

> **Corrected 2026-10-07:** each successful locked-chest opening uses up one key. The Area 3 and Area 5 chests need no key.

This page records where the original Japanese ROM places several useful item rewards. It is intended to answer **where to get the item, what to bring, and which inventory needs room**. It does not claim a walking route inside town.

## Acquisition list

| Item key (`category:id`) | Area / internal town map | Chest tile (X,Y) | What the ROM requires or gives |
| --- | --- | --- | --- |
| `general_tool:0F` — empty bottle | Area 3 / map 9 | `(6,4)` | Take the bottle; no key check is in the dedicated grant branch. |
| `general_tool:11` — lottery ticket | Area 5 / map 11 | `(4,6)` | Take one ticket; the ROM's map-11 branch grants ID `11` without a key. |
| `bait:11` — potato bait | Area 1 / map 7 | `(5,68)` | Use key `general_tool:17` (it is used up); leave room in the bait inventory. |
| `bait:0B` — waxworm bait | Area 2 / map 8 | `(4,6)` | Use key `general_tool:17` (it is used up); leave room in the bait inventory. |
| `rod:0A` — small lure rod | Area 4 / map 10 | `(4,6)` | Use key `general_tool:17` (it is used up); leave room in the rod inventory. |
| `general_tool:12` — candle | Area 6 / map 12 | `(4,6)` | Use key `general_tool:17` (it is used up); leave room in general tools. |

The locked chest handler checks key ID `17` and, after a successful grant, removes one key (`00:D1B7`). **Corrected 2026-10-07:** an earlier version said the key was not removed; the emulator took the Area 1 count from 2 to 1, and refused openings kept the key. So buy one key per locked chest. The bait and rod branches check their own inventory capacity; the candle branch uses the general-tool inventory. If a chest refuses because the bag is full, free a slot, leave the town and re-enter; the Area 1 chest then opened in the emulator.

## How the map locations are checked

`scripts/build_tool_use_locations.py` requires the supplied original ROM SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`. For each town chest it reads the town map's object-slot `0E` coordinate from the ROM map-pointer table and stops if the coordinate differs from `data/quest-tool-use.json`. It also checks the exact grant signatures for the keyless bottle and lottery-ticket handlers and the key-17 comparison branch for town maps 7, 8, 10, and 12.

The town crops are rendered from the matching ROM terrain images. The paired outdoor crop marks the entrance whose town-arrival row matches the chest's room row. This identifies which door arrives in that room; it does not verify a traversable route from that door to the chest.

The generated `data/town-item-acquisition.json` uses composite keys such as `bait:11` and `rod:0A`. This keeps the reward's real category attached to its ID. It is separate from `data/tool-use-locations.json`, whose top-level item keys refer to general-tool IDs and also include places where an item is used.

## Evidence sources

- `data/quest-tool-use.json`: acquisition coordinates and event traces for IDs `0F`, `11`, `12`, and key `17`.
- `data/shop-locations-rom.json`: town terrain provenance and paired town/outdoor entrance coordinates.
- Original Japanese SFC ROM: town object coordinates, item-grant branches, and key-required chest branches.
- Existing `docs/quest-tool-use-research.md`: chest inventory-capacity behavior and the limits around a no-room result.
