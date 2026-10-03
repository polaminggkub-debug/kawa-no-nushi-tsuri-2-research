# Shop menu inventory: observed scope

## What this capture establishes

One shop menu was inspected in the original Japanese ROM. Its status window shows the region text `渓流`; this research does not map that text to a numbered stage. The `サオ` (rod) selector showed eight distinct entries in this order:

| Menu order | Rod ID | In-game Japanese name | ROM base price |
|---:|---:|---|---:|
| 1 | `03` | ヤマベ竿6本継3.9m | ¥350 |
| 2 | `05` | ヤマメ竿8本継4.5m | ¥750 |
| 3 | `04` | 清流カーボン竿5.3m | ¥500 |
| 4 | `0E` | 投げ竿小 | ¥250 |
| 5 | `0A` | ルアーロッド小 | ¥500 |
| 6 | `0C` | ルアーロッド大 | ¥600 |
| 7 | `12` | フライロッド中 | ¥400 |
| 8 | `13` | フライロッド大 | ¥450 |

The selector began on rod `03`. Repeated Right inputs advanced through the list; additional inputs remained on rod `13`. The captured save state had ¥100. Confirming rod `03` did not complete a purchase; the game reported `お金が足らないけれど。` (“You do not have enough money.”). Thus, this observation proves these rows were visible in that menu context, not that a purchase succeeded.

The existing [shop price capture](../examples/shop-rod-price.png) shows rod `03` selected at ¥350. Other per-step screenshots and the save state used for the local selector traversal are not included in the publication.

## How the ROM prices were checked

The original ROM has SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212` and size 1,572,864 bytes. The rod-table pointer word is at file offset `0x02800A` (CPU `05:800A`) and points to `05:A7F5`, file offset `0x02A7F5`. Rod records are 12 bytes; the base-price word is at record offset `+10`. The row formula is:

```text
record = 0x02A7F5 + (item ID - 1) * 12
price  = little-endian word at record + 10
```

The item table and price-field details are also recorded in [`rom-record-notes.md`](rom-record-notes.md) and [`items-rom.json`](../data/items-rom.json). ROM base prices alone do not establish shop availability.

## Lures relevant to the gear progression question

The ROM lure-table pointer word is at file offset `0x028008` (CPU `05:8008`) and points to `05:A1D8`, file offset `0x02A1D8`. Lure records are 12 bytes; the base-price word is at `+8`. Lure IDs `17`, `18`, `2E`–`31`, `23`, and `24` have records and prices in the ROM, but the lure category was not traversed in the observed shop. Their availability there is **unknown**. Their presence in the item table, their price, and their use in a useful gear set do not prove that the observed shop sells them.

The structured rows, record offsets, and prices are in [`shop-inventory.json`](../data/shop-inventory.json). Runtime captures use the original ROM and a local Snes9x Libretro core. The ROM and save states are not distributed.

## Limits

- This is one observed rod menu, not a complete shop inventory.
- No six-stage shop mapping was established. The on-screen word `渓流` is recorded verbatim, with no inferred stage number.
- Lure, bait, fly, hook, float/sinker, food, and general-tool menus were not verified in this observation.
- No additional shops, progression flags, timing conditions, or alternate stock sets were tested.
- This pass did not identify a ROM shop-stock table or a code offset that maps inventory to shops. Do not use a ROM price as a reason to recommend buying an item at a particular point in progression.
