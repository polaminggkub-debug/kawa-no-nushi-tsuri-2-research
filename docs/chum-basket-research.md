# Groundbait and keepnet: what these items do

> **Corrected 2026-10-07:** a new game starts with keepnet capacity 5 (`7E:0C12`); the three shop items upgrade it to 10, 20 or 30.

This note traces general-tool IDs `08–0D` in the user-supplied original Japanese SFC ROM. It does not use an outside walkthrough as evidence. The item descriptions, behavior and limits below come from ROM records/code; the one note about eating stored fish cites a controlled run with the same original ROM.

ROM: 1,572,864 bytes; SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`.

## Use this in the game

| IDs | Item | What to do / what happens |
| --- | --- | --- |
| `08 → 09 → 0A` | Same groundbait, with 3, 2, then 1 use left | Scatter it at the water's edge to mark the current target point. Eligible fish profiles are steered toward that point as you fish. A valid use consumes one charge. |
| `0B` | Keepnet, capacity 10; 300 yen | Buy it in the shop to set the active capacity to 10 fish. |
| `0C` | Keepnet, capacity 20; 400 yen | Shop upgrade to 20 fish. The game refuses the same or a smaller capacity. |
| `0D` | Keepnet, capacity 30; 500 yen | Shop upgrade to 30 fish. It changes the capacity field directly; it is not an item you equip or use from the tool menu. |

When a landed catch fills the keepnet exactly, the game stores the fish first and then says the keepnet has become full. On a later fishing-action capacity check, it displays “The basket is full; you cannot fish.” Fish already stored can be eaten with **Food-category ID `08` (魚)**; this is separate from **Tool-category ID `08` (寄せエサ)** and consumes one stored fish (the menu skips your first giant eel; a Kusafugu sets HP to 0, which is only a blackout with 1 HP on waking). Controlled original-ROM runs show that food ID `08` restores HP based on stored fish size; see [food-effects-confirmed.json](../data/food-effects-confirmed.json) for the tested values.

## Groundbait: the exact effect and its limits

IDs `08`, `09`, and `0A` all have the Japanese ROM name `寄せエサ` and all reach the same use handler at `03:C24A`. On successful placement, the game stores the selected coordinate pair in `7E:1D41/1D43` and sets active marker `7E:1D45` to `12`. A later successful placement advances the inventory ID `08→09→0A`; successful use of `0A` removes that entry from the tools list. Invalid placement or an already-active target returns before the inventory charge transition. So if the game says chum was scattered already, the attempt is rejected without spending a use; place a new point after the marker clears, after moving the old target outside the active coordinate window, or after changing area.

The decoded ROM messages make the basic action clear:

- `0104`: `寄せエサを まいた。` — chum was scattered.
- `0106`: `さっき まいたので まだ 必要ありません。` — it was just scattered, so more is not needed yet.
- `0108`: `水際で、寄せエサを まきましょう。` — scatter chum at the water's edge.

The active marker is **not a real-time timer**. `04:C020..C02B` decrements it once when the fishing state enters phase 3. That path is reached after the aim/input state is complete and the target resolver returns nonzero (`04:BF61..BF8F`, following `04:D056`). A zero target result uses the other phase and does not decrement the marker there. Starting at `12`, the code reaches zero after 12 qualifying phase-3 transitions. The exact number of casts during which the effect is visible on screen has not been measured, so this note does not translate that counter into seconds or promise exactly 12 successful catches.

Moving until the saved target leaves the current active coordinate window also clears the marker. The fish-update routine calls the `03:8056` helper, which checks the saved point against the inclusive current window X=`value($0200)..value($0200)+16` and Y=`value($0202)..value($0202)+14` through `03:C2DE..C30F`. These bounds use coordinate values read dynamically from `$0200` and `$0202`, not fixed world coordinates. Scene/area update paths at `00:9F37` and `00:9FB1` clear it as well. In player terms: to place at a new point, let the marker wear off through fishing progress, move until the old target leaves the tracked fishing area, or change area. The counter is not real time, and the visible number of casts was not measured.

Fish movement has a specific ROM condition. The game first tries an equipped-bait direction branch. If that branch does not take precedence, fish profiles whose `+15` word intersects mask `0x5180` enter the groundbait-direction branch when `7E:1D45` is nonzero. The direction code compares the fish's current coordinates with the saved chum coordinate and writes a direction toward it (`00:D5F0..D61A`, `00:D7D2..D81E`). This is evidence for **movement toward the marked point**. It is not evidence that chum raises the chance of a bite, makes a fish accept a particular lure/bait, or improves the odds of landing it.

The profile-mask branch covers these 47 ROM profile IDs. The list identifies movement-branch profiles, not a list of fish that will bite or can be caught; it also includes non-fish creatures. The earlier bait-direction branch may take precedence.

| IDs and Japanese ROM profile names |
| --- |
| `06` ニジマス, `07` ヒメマス, `08` ブラウントラウト, `09` カワマス, `0B` ブラックバス, `0C` ウグイ, `0D` コイ, `0E` ドンコ, `0F` オイカワ, `10` モツゴ, `11` イトモロコ, `12` ギギ |
| `14` コクレン, `15` ハクレン, `16` ムギツク, `17` ホンモロコ, `18` ヤマノカミ, `1A` タモロコ, `1B` カワムツ, `1C` キンブナ, `1D` マブナ, `20` ブルーギル, `23` トミヨ |
| `24` ライギョ, `25` ヘラブナ, `26` ナマズ, `28` ハス, `29` ワタカ, `2D` カムルチー, `2F` ソウギョ, `30` アオウオ, `32` メゴチ, `33` マルタ, `34` ハゼ |
| `36` スズキ, `37` アカメ, `39` タナゴ, `3A` ウナギ, `3B` オオウナギ, `3D` クロダイ, `3E` ヌマガレイ, `3F` クサフグ, `44` イモリ, `46` ザリガニ, `47` カメ, `48` スッポン, `49` カニ |

## Groundbait: the placement test (Thai ROM, 2026-10-10)

This trace was made on the Thai translation (`Taro2_Thai.sfc`, 2,097,152 bytes, SHA-256 `7ed0e869…de06`). It was read statically in Ghidra 11.4.3 with the `achan1989/ghidra-65816` processor module, and nothing was run. The groundbait code sits at the same addresses as in the Japanese ROM above, and this trace confirms the coordinate pair, the marker value `12`, the `08→09→0A` charges and the `0x5180` profile mask independently.

`03:C24A` first calls `00:9702`. That routine copies the facing word `$524` to `$522` and runs the tile classifier `00:B6C9`, which uses `00:8E74`:

- **Target tile:** the tile in front of the player. The player tile is `$85C/$85E`. The facing mask is `$522`: `0x400` = y+1, `0x800` = y−1, `0x100` = x+1, `0x200` = x−1. At the map edge (x against `$24C`, y against `$24E`) the step is 0. The target tile ends up in DP `$12/$14`, and these become the chum coordinates `$1D41/$1D43`.
- **Terrain class:** the layer-1 tile byte (`$216/$218`) is classed 0..9 against the thresholds `$236..$246` (`00:8F7D`). An edge tile gives 9.
- **Water class:** the layer-2 byte (`$21A/$21C`) is classed 0..13 against `7E:6B63..6B7B` (`00:8FEC`). It is forced to 0 when the terrain class is 8 or more.
- **Objects:** `00:B79C` scans the object table (`7F:0000/0042/0108,X`, type `0x48` skipped). An object standing on the target tile sets the terrain class to 9.
- **Results:** stored in `$842..$84C`. `$848` is the target's terrain class and `$84A` its water class.

**Refused when `$848 = 9` or `$84A = 0`** (`03:C24E..C259`). In other words, the tile the player faces must be water and must not be blocked by the map edge or an object. A refusal shows message `0108` with sound `$1E` in `$16A8` and spends nothing. The player's mode (`$834`) and movement state (`$858`/`$85A`) do not gate the use. Only the handling of terrain class 6 depends on `$858`, and that reading is likely, not sure.

A successful throw (`03:C273..C2CB`) runs the window check `03:C2DE` first, which clears `$1D45` when the old target is off screen. If `$1D45` is still nonzero, the game says message `0106` and returns. Otherwise it does the following:

1. Writes the target tile to `$1D41/$1D43` and `12` to `$1D45`.
2. Puts sound `$22` in `$16A8` and shows message `0104`.
3. Changes the item in the menu's copy of the tools list (`$1BD5`, copied back to `7E:0B5A`): `0A` is removed (the later entries move up and the last is zeroed), and any other id goes up by one.
4. Closes the menu (`INC $1D31`).

The units of `$1D41/$1D43` (tile or pixel) were not settled statically.

## Keepnet capacity: where it is read

The shop-selection handler writes `10`, `20`, or `30` to the active capacity field `7E:0C12` for IDs `0B`, `0C`, and `0D` (`03:9450..94D3`). The shop checks that value before a purchase: equal capacity displays message `0198`; a smaller selection displays `019A` (`03:941E..944F`). Those item IDs have no selected-use branch in the tool dispatcher, so the useful action is to buy an upgrade at a shop.

There are two relevant full-keepnet paths, and they describe different moments:

1. **When a landed catch reaches capacity:** `01:8AC3..8AFF` finds the first empty fish slot, stores the fish species at `7E:0B7A+X` and size at `7E:0BB6+X`, then compares the new count with `7E:0C12`. If equal, it shows message `00A2`, `びく が いっぱいに なってしまった。` (“The keepnet has become full”). This catch is already stored.
2. **On a later fishing action:** `04:D218..D254`, called from `04:BF32`, counts nonzero species IDs across the 30 two-byte slots. If the count is greater than or equal to capacity, it renders message `0092`, `びく が いっぱいで 釣りが できない。` (“The keepnet is full; you cannot fish”), then returns from this capacity handler.

So the ROM does not discard the fish that brings the count exactly to capacity. It signals that the net is full, then blocks a subsequent fishing-action path while the count remains at capacity.

## Evidence and reproduction

[chum-basket-use.json](../data/chum-basket-use.json) contains the addresses, selected raw instruction bytes, fish-profile IDs, localized card copy and source links for all six records. Its important source paths are:

- Item records: `05:B282..B2A5` (ROM table data; six-byte stride).
- Groundbait dispatch and use/charge behavior: `03:BC4A..BD2E`, `03:C24A..C2DD`.
- Placement area check: `03:C2DE..C30F`.
- Fish steering: `00:D5F0..D61A` and `00:D7D2..D81E`.
- Marker countdown: `04:C020..C02B`, reached from `04:BF61..BF8F` when the resolved target is nonzero.
- Capacity upgrade and comparison: `03:941E..944F`, `03:9450..94D3`.
- Pre-action full check: `04:D218..D254`, called at `04:BF32`.
- Catch insertion and “now full” notification: `01:8AC3..8AFF`.
- Eating a stored fish: controlled original-ROM observations in [food-effects-confirmed.json](../data/food-effects-confirmed.json).

The three groundbait messages and the two keepnet messages were decoded directly from the original ROM's message table and font with [render_rom_messages.py](../scripts/render_rom_messages.py). Message offsets are `0104`, `0106`, `0108`, `0198`, `019A`, `0092`, and `00A2`.

The marker remains while its saved target is within the inclusive current coordinate window X=`value($0200)..value($0200)+16`, Y=`value($0202)..value($0202)+14` in the fishing viewport. `00:A0E0..A12F` calls `00:D4C3`, then `03:8056` → `03:C2DE`, during fish updates; this is not only a repeated-use check. Moving the saved marker outside that dynamic window clears `1D45`.
