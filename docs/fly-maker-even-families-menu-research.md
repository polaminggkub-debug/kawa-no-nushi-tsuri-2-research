# Diptera and Stonefly: select the component shown in the catalogue

## What the player can do

When the maker offers **Diptera (`ディプテラ`)** or **Stonefly (`ストーンフライ`)**, select that family, then use the catalogue’s original cursor image and Right/Down/A instructions to choose the body, wing, or tail. Each part begins at top-left. Check the final quote before paying; these positions do not rank catch performance.

There are **42 real components** in these two palettes: Diptera 9 bodies / 8 wings / 4 tails, and Stonefly 10 bodies / 4 wings / 7 tails. Four additional choices omit a wing or tail. With the separately verified Mayfly, Caddis and Terrestrial palettes, 130 real catalogue components now have exact observed menu positions. This does not claim that all 134 component records are selectable at a maker: Mayfly wings `25/26` and special records `66/67` remain outside the verified palettes.

## Selecting None

From top-left of the named part menu:

| Family / part | Controller input |
| --- | --- |
| Diptera wing | Right 2 → A |
| Diptera tail | Right 1 → A |
| Stonefly wing | Right 1 → A |
| Stonefly tail | Right 1 → Down 3 → A |

The selected part field becomes `00`; it is not an owned component. The maker routine treats the menu sentinel as None and adds no component price. No price or catch advantage should be inferred from the cursor image alone.

## Observed palettes

The tables below show visible slots only. A dash marks a blank cell, not another item. Extra movement into those cells stopped at the last visible choice in the controller survey.

### Diptera

| Row | Body col 1 | Body col 2 | Body col 3 |
| --- | --- | --- | --- |
| 1 | 4B | 4F | 59 |
| 2 | 4C | 56 | — |
| 3 | 4D | 57 | — |
| 4 | 4E | 58 | — |

| Row | Wing col 1 | Wing col 2 | Wing col 3 | Tail col 1 | Tail col 2 |
| --- | --- | --- | --- | --- | --- |
| 1 | 50 | 5B | None | 53 | None |
| 2 | 51 | 5C | — | 54 | — |
| 3 | 52 | 5D | — | 55 | — |
| 4 | 5A | 5E | — | 5F | — |

### Stonefly

| Row | Body col 1 | Body col 2 | Body col 3 | Wing col 1 | Wing col 2 | Tail col 1 | Tail col 2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 60 | 64 | 6E | 70 | None | 68 | 74 |
| 2 | 61 | 65 | 6F | 71 | — | 69 | 75 |
| 3 | 62 | 6C | — | 72 | — | 6A | 76 |
| 4 | 63 | 6D | — | 73 | — | 6B | None |

Stonefly’s four wing IDs are `70–73`. The original table scan finds exactly four records with family byte `03` and part byte `01`. A prior working expectation of six wings had no verified record list; it is superseded and does not establish two hidden items.

## Evidence and limits

ROM SHA-256: `e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49` (1,572,864 bytes). Private Snes9x core SHA-256: `8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6`.

Two independent replays rebuilt the six part-menu seeds from the same existing maker-dialogue state (SHA-256 `75f0c3dfd9272c91a5873c977acb9d78bddaf13f37f919dc438c8375898d031c`). Each made one controlled write `$085A = 02` before A opened the family chooser. The chooser then showed Diptera, Stonefly and Terrestrial. All subsequent part-menu transitions and all 96 positional requests used controller input only. Both replays selected the same IDs and produced byte-identical original cursor PNGs at every coordinate.

**This is a controlled even-area chooser fixture, not evidence of a natural route into an Area 2 shop.** The inherited background is from the earlier Area 1 seed. The player instructions are conditional on the family being offered; they do not claim when a shop becomes reachable. The 46 published PNGs are literal original 256×224 frames, not drawn replacements or terrain crops. Forty-six distinct choices comprise 42 real components and four None choices. The 50 repeated/clamped cells are retained as evidence, not shown as extra selectable parts.

The record filter is table offset `0x2AA52 + (ID − 1) × 11`, family byte `+0` (`02` Diptera, `03` Stonefly), and part byte `+1` (`00` body, `01` wing, `02` tail). The selected-ID fields are `$1D35/$1D37/$1D39`. Price is the row’s little-endian word `+9`, as traced in [the maker routine research](fly-maker-menu-research.md). This survey did not test fishing advantage or purchase every combination.

Structured positions, original-image hashes, clamped observations and replay fingerprints: [fly-maker-even-families-menu-positions.json](../data/fly-maker-even-families-menu-positions.json). Private requests, states, WRAM and ROM/core files remain outside publication. Existing [Caddis/Terrestrial](fly-maker-other-families-menu-research.md) and [Mayfly](fly-maker-body-tail-palette-research.md) evidence are preserved separately.

## 日本語要約

作成メニューにディプテラ／ストーンフライがある場合、その系統を選び、各部品の初期位置（左上）から一覧の右・下・A操作を使います。計42部品と「無し」4箇所を独立に再確認しました。支払前に見積額を確認してください。通常プレイでの店への経路や、釣果が有利になる組合せは確認していません。

## Recorded maker location added

A separate [original-ROM access trace](fly-maker-access-research.md) now identifies
the Area 2 town maker at X5,Y24 and entrance 2 at outdoor X91,Y25 → town X7,Y29.
Component pages link to these endpoints. The palette captures above still use
a controlled fixture; the location trace does not establish a natural walk or
story unlock.
