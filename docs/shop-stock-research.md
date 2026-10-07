# Six-area shop stock decoded from the original ROM

The original Japanese ROM (SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`) supplies the six shop stock sets inside its compressed outdoor field blocks. This closes the older single-menu scope in [shop-inventory-research.md](shop-inventory-research.md). No outside guide is used.

## Source and extraction

`00:8472..8492` indexes the eight-byte pointer directory at `00:874A` with the current outdoor area × 8. It decompresses the corresponding block into `7E:2000` through `00:E5C2..E6E2`. The algorithm uses a two-byte output length, LSB-first eight-token flag bytes, literals, and 12-bit ring positions with lengths 3–18. Each area decompresses to 19,515 bytes.

| Area | Compressed file offset |
| --- | --- |
| 1 | `1137FB` |
| 2 | `11A2D8` |
| 3 | `1215A2` |
| 4 | `127E68` |
| 5 | `12E9B4` |
| 6 | `134F1D` |

All extracted stock bytes at `6B85..6C2E` match the corresponding original-ROM field-loader states from the prior map reconstruction. Towns retain their associated outdoor block; the stock is not read from an independent town-number array. `00:CED7..CF28` dispatches town NPC interactions to the shop modes.

| Stock at WRAM | Slots | Consumer / meaning |
| --- | ---: | --- |
| `6B85` | 8 | `03:879E` normal rods |
| `6B95` | 24 | `03:8924` lures |
| `6BC5` | 4 | first 8 bytes of `03:8B0F` hook stock |
| `6BCD` | 6 | remaining 12 bytes of that menu: floats/markers/sinkers |
| `6BD9` | 11 | `03:8DA1` bait; 18 bytes to normal slots plus 4 bytes to selector slots 18–19; intervening menu slots remain zero |
| `6BEF` / `6BFF` / `6C0F` | 8 each | `03:8FF5` parallel body/wing/tail IDs for ready-made fly bundles |
| `6C1F` | 8 | `03:91FC` mixed tools/food; high bit set means food, clear means tool |

The menu copies the listed bytes into its working selector. Zero entries are omitted. `03:D343..D432` selects the correct item record and its price; prices do not establish availability by themselves.

## Ready-made flies versus customization

The three parallel arrays at `6BEF`, `6BFF` and `6C0F` are **bundles**, not three independent component shops. `03:9119..9136` reads body, wing and tail at the same selected index, and `03:91A9..91B8` stores that combination in fly inventory. A zero wing/tail means no such part; a bundle may therefore contain a body alone. `03:90A8..90C7` reads the selected body record's `+9` price into `1A7B`; `03:916B..918A` compares and deducts that quote. The JSON records the eight bundle slots and quote prices per area as `flyBundles`.

Across all six areas there are 396 normal purchase offers and four fixed special-rod offers. Expanding each fly bundle into its component references gives 473 item-record references, spanning 258 distinct category/ID records. These reference counts are not counts of separately sold fly parts.

A part card's stock location therefore means **this part appears in a ready-made fly sold there**. It is not proof that the part can be bought separately, nor that other color variants are unavailable through the separate custom-fly maker. The customizer palettes are a different source of availability and must not be inferred from these eight bundle slots.

## Additional rod merchant

Town NPC slot `10` selects shop mode 7 in towns 10–12 (`00:CF05..CF1A`). `03:86E1..8733` supplies fixed rods: area 4 heavy-fish lure rod `0D`; area 5 carp rod `08` and Tanago rod `01`; area 6 two-handed casting rod `10`. These are recorded separately from the normal eight-rod stock. Towns 7–9 use a different interaction at that NPC.

## Live Ayu bait condition

Bait `17` is removed from the menu when `7F:1E84` is zero (`03:8DCE..8DF1`). Bulk fish sales call `03:A3C0` at `03:A27C` before clearing the basket: each stored fish with species ID `38` (Ayu) increments that counter. A purchase of live Ayu bait fills its stack to nine and subtracts nine from the counter, floored at zero (`03:8FD5..8FEE`). Thus selling at least one Ayu allows a stocked shop to offer this bait; buying it can hide it again until another Ayu is sold. This is a stock condition, not a catch-probability claim.

## In-game confirmation (2026-10-07 audit)

All six regular shops, the three special rod merchants and the Area 1 to 3 fly makers were opened in the running game and their menus read back off the screen. Findings used by the guide:

- The decoded stock matches the stock the game loads in all six shops, for all 315 items, and stays the same across about 2,000 save states. Every offer shows the ROM price and a purchase deducts exactly that price.
- **Bait and hooks are priced per stack of 9.** Buying with 8 of 9 held still costs the full price and tops the stack up to 9. The guide says so on shop cards, item pages and the shops page.
- **Never sold anywhere:** rods `02`, `06`, `0B`, `11`; fly parts `25`, `66`, `67`; both mushrooms `09`/`0A`; the wash tub and the canoe. Part `26` appears only in one Area 6 ready-made set (body `1E` + wing `26` + tail `2A`, ¥50).
- **Special rod merchants** (towns of Areas 4 to 6): Area 4 heavy-fish lure rod ¥650; Area 5 carp rod ¥1,500 and bitterling rod ¥500; Area 6 two-handed casting rod ¥1,500. Area 6 sells no fly rod.
- **Decoy Ayu** (bait `17`) shows up in the Area 3 shop only after an Ayu has been sold from the keepnet.
- **Fly makers** exist only in the towns of Areas 1 to 3 (map IDs 7 to 9). A custom fly costs body + wing + tail (default part price ¥25, cap ¥10,000); a ready-made bundle costs only its body price. 130 of the 134 fly parts can be picked in a maker; the other four are `25`, `26`, `66` and `67`. Areas 4 to 6 sell ready-made bundles only.
- The `渓流` menu of the early single-menu capture is Area 1.
- Records `66` and `67` are leech-family (code 5) body-type records. They are in no stock table, bundle or maker palette.

## Reproduction

```sh
python3 scripts/extract_shop_stock.py --rom /path/to/game.sfc
python3 scripts/build_item_use.py
node scripts/build_catalogue.cjs
```

[Full per-area and per-item stock data](../data/shop-stock-rom.json). The extractor reads the local ROM and distributes only the extracted item identifiers and provenance. It does not include the ROM, decompressed maps, or emulator states.
