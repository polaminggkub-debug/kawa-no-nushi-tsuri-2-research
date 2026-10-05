# General tool use effects from the original ROM

This research traces the selected-item dispatcher and the code paths each tool activates in the supplied Japanese SFC ROM. It does not use third-party gameplay guides. The structured findings are in [`general-tool-actions.json`](../data/general-tool-actions.json). The ROM is headerless, 1,572,864 bytes, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212` and SHA-256 `e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49`.

## What these tools do

| ID | ROM label | Player-facing result proved by the ROM |
| --- | --- | --- |
| `01` | タライ | Launches the tub at a usable waterside tile and enters movement mode 3. The ROM rejects swimming and unusable locations. |
| `02` | カヌー | Launches the canoe at a usable waterside tile and enters movement mode 4. Its movement route differs from the tub's. |
| `03` | 虫めがね | Searches the current field tile. Results depend on the area's location context; the connecting route and special areas can return bait or mushroom food. |
| `04` | 金アミ | Searches a new shallow-water tile and returns an area-specific bait. |
| `05` | 釣りノート | Opens the Fishing Notebook, whose record-building routine groups fish entries into six area lists. |
| `0E` | 磁石 | Points toward the area's exit/connecting route and reports the current area/section. Reaching the corresponding targets triggers a transition into area 13. |
| `13` | ステレオ | Toggles the music to monaural and replaces the selected item with ID `14`. |
| `14` | モノラル | Toggles the music to stereo and replaces the selected item with ID `13`. |

The selected-use dispatcher is `$03:BC4A..BD2E` (file `0x01BC4A..0x01BD2E`). It reads the selected item ID from `$7E:1BD5` at index `$7E:1BCF`, then routes IDs `01`, `02`, `03`, `04`, `05`, `0E`, `13`, and `14` to their handlers. The dispatch bytes and handler bytes are also retained in the JSON file.

## Tub and canoe: IDs 01 and 02

The handlers `$03:BD2F` and `$03:BD76` set `$0834=5` and put `1` or `2` in `$130E`. Main state 5 at `$00:8283` checks whether the player can board. It allows the on-foot/shallow-water movement states, rejects swimming with message `0156` (`泳ぎながら乗ることはできない。`), and reports message `0152` (`[D6]はここでは使えない。`) when the current tile fails the ROM's launch check. At a valid location it places the vehicle according to the player's facing, shows `013A` (`[D0]が水に浮かんでいる。`), and returns to field state 2.

`$00:836E` turns `$130E=1` into movement state `$0858=3` and `$130E=2` into state `$0858=4`. The movement code branches to `$00:A5F2` for the tub and `$00:A7BB` for the canoe. These are distinct movement routines. The later [movement trace](boat-movement-research.md) follows those routines and establishes a scoped 40% canoe movement advantage where the current contribution is zero.

The ROM also blocks direct switching while already in either vehicle mode. Selecting the same vehicle reports `013C` (`[D6]は今使っている。`); trying to switch to the other reports `0154` (`[D6]に乗りかえるのは危険だ。`). The movement path clears `$0858` when its tile probe sees `$084A==0`; the numeric tile class has not been assigned a plain-language terrain label here.

## Magnifying glass: ID 03

Handler `$03:BDBD..BF29` requires field state `$0834=2`. It refuses `$0858==1` and `$0858>=3`; these are tested as raw movement states. It stores the searched tile in `$1D49/$1D4B`; a second search at that same tile displays `0142` (nothing found).

For areas 1–6, the movement system records a location context in `$1E97` at `$03:D451..D4CE` from `$0842`. The code then selects bait IDs from this table. Context 2 in area 3 gives potato bait (`11`), while the same context in other areas gives worm (`01`). Contexts 4 and 5 each have two results selected by `$1364`; `$1364` is a game frame/NMI counter, so its sign must not be translated into “day” or “night.”

| Location context `$1E97` | Result in areas 1, 2, 4, 5, 6 | Result in area 3 |
| ---: | --- | --- |
| 1 | Bait `01` ミミズ | Bait `01` ミミズ |
| 2 | Bait `01` ミミズ | Bait `11` イモ |
| 3 | Bait `02` サシ | Bait `02` サシ |
| 4 | If `$1364` is negative: bait `0B` ブドウムシ; otherwise bait `0A` ドバミミズ | Same branch |
| 5 | If `$1364` is negative: bait `04` 昆虫; otherwise bait `0C` ハチの子 | Same branch |

These are code conditions, not labelled terrain names. The numeric context-to-place mapping is not decoded in this document.

For area IDs 7–12, `$085E & 0x00F0 == 0x0010` selects bait `0D` ネリエ. On the connecting route and maps with area ID 13 or higher, the handler has a separate result path: one `$00:DA92` low-bit branch selects bait `0A` ドバミミズ. The other branch requires an empty food slot (`$0B58==0`), then selects food ID `09` or `0A` and stores it in `$0B3A`. Food ID `0A` is the poisonous mushroom in the ROM food-effects research; the message `0148` only says `きのこを見つけた` and does not distinguish the poisonous kind. This branch is not a quest-item award.

Bait inventory item IDs are stored at `$088C..$08AE`, with counts at `$08B8..$08D4`. The grant routine `$03:BFBC..C03C` adds `(DA92 & 3) + 1` items and caps a bait stack at 9. If the pouch has no capacity, message `0158` is shown. Mushroom food goes into the separate food slots and needs an empty slot. RNG branches are documented by their branch conditions; no fixed drop percentage is claimed.

## Gold net: ID 04

Handler `$03:BF2A..BF93` requires field state 2 and exactly `$0858==1`. The ROM message `015A` says `金アミは、浅瀬で虫取りに使います。` (the gold net is used to catch bugs in shallow water). The previous searched tile is `$1D49/$1D4B`; using the net twice without moving returns message `0142`.

For a new eligible tile, `$03:BF94..BFBB` reads a 16-bit area table at `$03:C04C` using index `$085A * 2`. Word zero is a sentinel; words 1 through 6 select these baits:

| ROM area ID | Bait ID | Japanese bait name |
| ---: | ---: | --- |
| 1 | `07` | カワムシ |
| 2 | `08` | トビケラ |
| 3 | `09` | イクラ |
| 4 | `16` | 貝のむきみ |
| 5 | `05` | アカムシ |
| 6 | `06` | ゴカイ |

The source bytes at file `0x01C04C` are `02 60 07 00 08 00 09 00 16 00 05 00 06 00 01 00`. The first little-endian word (`0x6002`) is the unused zero-area entry; the next six words are the outputs above. Successful searches use the same bait grant/capacity routine as the magnifying glass.

## Fishing Notebook: ID 05

### Starting equipment: no initial purchase or quest

All four characters receive the Fishing Notebook in their initial inventory. **Open the general-tools list and select ID `05` to inspect your records.** This acquisition conclusion comes from the original Japanese ROM’s initialization code, not its item price or an inferred shop sale.

The save initializer at `01:B705` calls character initializer `01:B775` with `$12=1,2,3,4` at `01:B734`, `01:B73C`, `01:B744`, and `01:B74C`. After clearing the character data and restoring 16-bit accumulator width, `01:B84F..B854` unconditionally executes `LDA #$0005; STA $0B5A` (`A9 05 00 8D 5A 0B`, file offset `0x00B84F`). `$7E:0B5A` is the first general-tool inventory slot. Character-specific setup follows this common grant.

The initializer joins `01:B9DD`, which calls save routine `01:BD17`. That routine selects the appropriate character record at SRAM `70:0010`, `70:04E0`, `70:09B0`, or `70:0E80`. Its compact copy at `01:BD8F..BD99` saves the low byte of each character word; the notebook ID fits this byte. Thus the initial tool is persisted for every character record.

The [starting-inventory evidence](../data/notebook-starting-inventory.json) contains the exact code fingerprints, original-ROM hashes, four-character control flow, and limitations. Reproduce it with a locally supplied ROM:

```sh
python3 scripts/verify_notebook_starting_inventory.py \
  --rom /path/to/headerless-japanese-original.sfc \
  --output data/notebook-starting-inventory.json
```

The verifier rejects any ROM other than the 1,572,864-byte headerless Japanese original, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`, SHA-256 `e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49`, and checks the instruction bytes before producing the evidence. This is a static code verification; it does not claim a new controller replay, an independent comparison with the Thai patch, replacement acquisition, or every possible removal/sale path. No NPC gift, shop sale, or price is inferred.

### Viewing the six-area records

Handler `$03:C05C..C071` saves the current state in `$0836`, switches `$0834` to `8`, and increments the shared item-use counter. State 8 dispatches to `$00:83A4`, which calls `$01:9738`; that routine calls `$01:BF30`.

`$01:BF30..C00B` scans the 66 word entries in `$0C3C`. It gathers entries whose area value is 1–6 into six lists in `$7F:2AFA` and records cumulative list byte boundaries at `$7F:2A8E..2A98`. `$01:C258..C2EA` sorts each list using corresponding values in `$0CC0` and `$0D44`. This is the notebook's fish-record organization. The ROM-backed notebook renderer also has six overview pages in the same order as field areas 1–6. Its overview artwork does not itself read the fish-spawn coordinate tables; see [`fish-location-research.md`](fish-location-research.md).

## Magnet: ID 0E

Handler `$03:C313..C3E8` compares the player's current tile with an area target, chooses a direction message, and reports the current area and section. Messages are `0144` (`磁石の針が [D7]を指した。現在地は[DA]の[D4]だ。`), `014A` (current location only), and `0146` (`針が動かなくなった。`). The direction words come from message substitutions `015C..0162`.

For area IDs 1–6, the routine indexes 8-byte rows from `$00:A065`; row words 0 and 1 are the target X/Y. The sixth row uses sentinel `0x00FF`, which makes area 6 use dynamic target coordinates `$0C:DE02/$0C:EA02`. If story flag `$0C18 & 4` is clear, area 6 shows only the current position; when set it also shows a heading. The first five target tiles are:

| Area ID | Exit target tile (X,Y) |
| ---: | ---: |
| 1 | `(13, 239)` |
| 2 | `(56, 17)` |
| 3 | `(22, 5)` |
| 4 | `(32, 41)` |
| 5 | `(22, 2)` |

The target table is file `0x002065`, starting bytes `0d 00 ef 00 4d 00 1b 00 38 00 11 00 01 00 46 00 16 00 05 00 30 00 01 00 20 00 29 00 35 00 13 00 16 00 02 00 3e 00 02 00 ff 00 ff 00 00 00 00 00`.

This target has a practical navigation purpose: `$00:9D94..9DD8` consumes the same `$00:A065/$00:A067` coordinates. When the player reaches the relevant target, the field transition sets area 13 and loads the connecting-route coordinates from `$00:A099/$00:A09B`. The compass message does not name that destination. Internal areas 7–12 take a separate fixed-direction route and should not be read as a universal compass.

## Stereo and monaural: IDs 13 and 14

The two tools toggle the music mode and then swap the selected inventory slot to the other ID:

| Selected ID | New `$7F:1E28` value | New selected ID | ROM confirmation |
| ---: | ---: | ---: | --- |
| `13` ステレオ | `1` | `14` モノラル | `0166` 音楽をモノラルにしました。 |
| `14` モノラル | `0` | `13` ステレオ | `0164` 音楽をステレオにしました。 |

The tool label reflects the current mode. Using it toggles to the opposite mode; the returned item and the literal confirmation message identify the new setting. The item handlers are `$03:C548..C583` and `$03:C584..C5BF`.

## Evidence boundary

All action claims above come from the supplied original ROM's selected-use dispatch, state handlers, message strings, data tables, and the consumers named at each section. Bait display names are matched by item ID to the Japanese names in the ROM-derived item catalogue. This research does not use fan guides to fill gaps. Remaining limits are explicit: the numeric magnifier context values are not yet mapped to named terrain; the two vehicle routes are demonstrably distinct but their full player-visible gameplay differences are not assigned; the magnet's message reports a heading and current region, not a destination name.

The [notebook completion guide](notebook-completion-research.md) traces the 66 global species records and explains why a new larger record can move an entry between area pages.
