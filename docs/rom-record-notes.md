# Kawa no Nushi Tsuri 2 item record notes

These files analyze the user's original Japanese SFC ROM without changing it. The ROM dump has SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`, physical size 1,572,864 bytes, and LoROM mapping. `scripts/extract_items.py` reads the original ROM and writes the item index to a caller-selected JSON path.

## Record tables

The game stores table-base pointers in bank `$05` and computes each row as `base + (itemID - 1) * stride`.

| Category | Pointer word | First record | Stride | Rows | Price offset |
| --- | --- | --- | ---: | ---: | ---: |
| Rod | `$05:800A` → `$05:A7F5` | file `0x02A7F5` | 12 | 21 | `+10` word |
| Lure | `$05:8008` → `$05:A1D8` | file `0x02A1D8` | 12 | 81 | `+8` word |
| Bait | `$05:8002` → `$05:9E67` | file `0x029E67` | 12 | 23 | `+8` word |
| Fly component | `$05:800C` → `$05:AA52` | file `0x02AA52` | 11 | 134 | `+9` word |
| Hook | `$05:8004` → `$05:A068` | file `0x02A068` | 9 | 13 | `+7` word |
| Float/sinker | `$05:8006` → `$05:A138` | file `0x02A138` | 9 | 10 | `+7` word |

The item index includes raw record bytes and decoded ROM prices for named entries. It also retains raw rows for fly-component IDs that are not yet matched to a name. A price stored in the ROM is not a gameplay-strength stat. Rod ID `03`'s table price is 350 yen and matches the actual shop display captured at runtime.

## Rod fields that have traced consumers

Rod rows are 12 bytes. `D11F` copies bytes `+0` through `+7`, then words `+8` and `+10` to temporary WRAM fields. The meanings below come from code that consumes those fields.

- `+0` selects the fishing style family: 1 float/Ayu, 2 casting, 4 lure, 8 fly.
- `+2` feeds the cast/aim hold-time cutoff. Style 1 uses it raw; style 8 uses it raw and sets a second cutoff to half. Styles 2 and 4 scale it by current HP (`$7E:0862`) divided by 100 when HP is below 100, with a floor of 10; at HP 100 or higher they use the raw value. The food-effects runtime record independently confirms `$7E:0862` is current HP in [food-effects-confirmed.json](../data/food-effects-confirmed.json). The aim/cast loop increments `$1F6F` and sets state-transition flag `$1F73` when it reaches `$1F71`; following the dispatcher does not establish a catch-failure meaning. The earlier failure-state description is withdrawn. The user-facing stat name and units are still unknown.
- `+3` is multiplied by `$0150` and stored as the internal range threshold `$1ED7`. Fishing routines compare fish position `$1ED5` against that threshold and move it toward the limit. The unit conversion to meters or time is unknown; the JSON reports the multiplier and computed internal value only.
- `+4` is compared directly with the active fish ID `$11E8`; the matching branch changes handling. It is stored as a fish-ID match code, not a general fish-size rating.
- `+5` contributes to selecting the rod graphic tile offset.
- `+7` selects different fight-response branches based on fish groups. Its user-facing stat name is unknown.
- `+1` and `+6` remain raw pending a confirmed meaning.
- `+8` is the display-name pointer. `+10` is the yen price.

## Lure fields and limits

Lure rows are 12 bytes and load into `$1226`–`$1236`.

- `+0` selects lure action branches.
- `+1` selects how the game updates `$11FE` using `$1EB1`: value 0 applies H for size <=15 and G for size >35; value 1 applies H only for 15<size<=35; value 2 applies G for size <=15 and H for size >35. H(x)=floor(x/2), G(x)=(2*x+1)&63. The exact trace and corrections are in `lure-response-research.md`; this is not a catch probability.
- `+2` is a special fish-ID comparison in one lure-response branch. The three nonzero entries point to black bass (`0B`), namazu (`26`), and akame (`37`). The matching branch changes behavior; this does not by itself prove the lure is exclusive to that fish or grants a bonus.
- `+3` is passed to graphics setup.
- `+4` and `+5` select render/animation setup.
- `+6/+7` is a 16-bit word ANDed with fish profile +0F word at `04:EBFD`. Nonzero passes the lure-hook mask gate; position, periodic selection and input conditions remain separate.
- `+8` is the yen price; `+10` points to the display name.

These call paths do not establish a depth-in-meters, lure weight, or catch-rate scale. The JSON therefore includes all raw bytes and labels only the uses demonstrated by code. ROM name data and runtime captures corrected lure IDs `11` (topwater) and `1D` (shallow runner); other broad family names retain the source notes in the JSON.

## Other categories

The inventory index uses the community item list for many names, then adds original-ROM record bytes, name pointers, and prices where a ROM table was found. The tool inventory was runtime-confirmed at WRAM `$7E:0B5A`; the community memory-map's `$7E:1BD5` is not the active tools inventory in this ROM. Fly records describe components; the complete body/wing/tail labels and combinations need to be matched to the runtime captures before assigning names to every raw row.

## Rebuild

```sh
python3 scripts/extract_items.py --rom /path/to/original.sfc --output local-run/records.json
```

The helper reads the ROM and writes JSON only; it does not patch or rewrite the ROM.

Rod +2 correction: target-coordinate movement, B-button release and the downstream tile-target resolver identify this timer as the **pre-hook aim/cast hold-time cutoff**, not fight endurance. See [the traced consumers](rod-response-research.md).

See the [three-language equipment guide](../research/index.html) for exact lure IDs and the per-profile mask matrix.
