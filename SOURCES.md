# Sources and image provenance / 出典と画像の由来

## Original research / 独自の解析

The item catalogue sprites, menu frames, customization screenshots and food-use evidence were captured from the matching Japanese ROM through Snes9x Libretro. The images are game-rendered output, with crops and nearest-neighbor enlargement for readability, not AI illustrations. Temporary WRAM changes exposed inventory entries for inspection; these images do not prove ordinary availability or acquisition routes. The ROM was not modified.

アイテム画像・メニュー画面・フライ作成画面・食事の確認画像は、対象の日本語ROMをSnes9x Libretroで実行して取得しました。表示しやすく切り抜き・拡大した原作の描画であり、AIによる再描画ではありません。一部の所持品は一時的なWRAM変更で表示したため、通常の入手方法を示すものではありません。ROM自体は変更していません。

Static table evidence: [raw records](data/rom-records.json), [annotated item data](data/items-rom.json), and [code-consumer notes](docs/rom-record-notes.md). Runtime evidence: [food trials](data/food-effects-confirmed.json), [fly maker](data/fly-customization.json), and [label corrections](data/item-name-corrections.json).

## External sources / 外部資料

| Source | Role / 用途 |
| --- | --- |
| [Original SFC manual scan](https://gamemanual.midnightmeattrain.com/entry/%E5%B7%9D%E3%81%AE%E3%81%AC%E3%81%97%E9%87%A3%E3%82%8A2) | Original manual descriptions of equipment and fishing; pages are linked, not republished. 原作説明書の道具・釣法の説明。 |
| [Community item-ID list](https://roadbikebeginners.com/sfc-kawanonushitsuri2-cheat/) | Initial ID/name leads, subsequently corrected where ROM/menu evidence disagreed. ID・名称の初期資料。 |
| [Wazap item/location observations](https://wazap.com/cheat/%E5%85%A8%E9%81%93%E5%85%B7%E7%B4%B9%E4%BB%8B%E3%81%A8%E5%85%A5%E6%89%8B%E5%A0%B4%E6%89%80/177794/) | Community prices and acquisition observations, not authoritative engine stats. プレイヤーの価格・入手情報。 |
| [2014 early-shop walkthrough](https://evaandmaicy.blogspot.com/2014/11/sfc-2_18.html) | Lead for locating the fly maker and checking the interface. フライ作成NPCと画面の参考。 |
| [Lure fishing observations](https://note.com/holy_heron2678/n/na12caa0f2974) | Qualitative player observations. プレイヤーのルアー使用記録。 |
| [Lure breakage observations](https://note.com/holy_heron2678/n/n433005d8fe08) | Qualitative breakage reports. 破損のプレイ記録。 |
| [Stream fishing observations](https://note.com/holy_heron2678/n/nf6dccee118e2) | Qualitative fishing notes. 渓流釣りの記録。 |
| [Fish portrait video reference](https://www.youtube.com/watch?v=Y8JKlgIV91c) | Used during earlier fish-guide research; timestamps and source URLs remain in the legacy JSON. No video is distributed. 旧魚ガイドの画像確認資料。動画は配布しません。 |

Further stage/quest references and URLs are retained alongside the source-guided notes in [data/stages](data/stages) and [data/fish-guides](data/fish-guides). Those notes include working Thai descriptions and are not independently established ROM mechanics. External map images are not included.

各地域・クエストの追加出典は上記JSON内に記録しています。旧ガイドにはタイ語の作業メモがあり、ROM解析で確認済みの仕様とは区別してください。外部の地図画像は同梱していません。

## Tools / 使用ツール

- [Snes9x](https://github.com/snes9xgit/snes9x), through a separately obtained Libretro core. No emulator binary is included.
- [Libretro interfaces](https://github.com/libretro/libretro-common).
- Python standard library for record extraction; NumPy and Pillow for optional runtime screenshots.

See [NOTICE.md](NOTICE.md) for the rights and license scope. Credits describe evidence sources; they do not imply endorsement by their authors or by the game's rights holders.

## Title screen / タイトル画面

The hero image is the original Japanese title-screen screenshot supplied by the project owner. It is displayed without repainting; the game artwork retains its underlying rights.

ヘッダー画像はプロジェクト所有者が提供した原作日本版のタイトル画面です。描き直しは行っていません。原作画像の権利は権利者に帰属します。

## Thai labels / ชื่อไทย

Thai interface and research explanations are website translations. Thai item labels are attributed only when verified against the local Thai V1.2 patch (SHA-1 `453047280f53ab9faf93142b957967c1eec69afc`), credited by its supplied README to ช.ช้าง and Memory_Card_TH. Labels that are not yet verified retain the Japanese name. This repository distributes neither the patch nor the patched ROM. Core mechanic measurements refer to the original Japanese ROM; a Thai label does not establish that every patched gameplay behavior is unchanged.

Per-item label provenance and unavailable captures are recorded in `data/thai-rom-names.json` and `data/thai-other-captures.json` when present. Unicode transcriptions are stored separately from source crops. A verified transcription is reused only for byte-identical cropped label images; Japanese-name similarity is not evidence of the Thai spelling. Fish in the food menu displays the held fish species, and the two mushroom records display the same Thai name despite different original-ROM effects.

## Original-ROM equipment consumers — 2026-10-04

New compatibility findings are derived from the owner-supplied original ROM identified above, not from an external recommendation guide. Fish names are decoded from the ROM's custom katakana strings; profile ID43 is a zero-field placeholder. Reproduction scripts validate the exact dump identity. The lure-coverage extractor reads all 73 profile rows and 81 lures. The restricted fight-setup interpreter executes selected 16-bit instructions and documents its scope; it does not emulate a complete catch. Rod timer phase identification is a static trace, not a landing-rate trial. Shop observations cover only the displayed rod menu headed 渓流.

Primary traces: [acceptance](docs/fish-acceptance-research.md), [rod consumers](docs/rod-response-research.md), [lure setup](docs/lure-response-research.md), [shop observations](docs/shop-inventory-research.md).

## Fish portraits in the equipment guide

The active catalogue uses fish sprite frames decoded directly from the supplied original ROM. [fish-visuals.json](catalogue/fish-visuals.json) records the species ID, compressed-graphics pointer, normal palette pointer, frame selection and ROM identity. The graphics table at `$04:BB0C` maps fish IDs to compressed images; the normal BGR15 palette is at `$07:E200 + 0x40*(ID-1)`. Frame 0 retains native orientation and transparent color index 0. See [the sprite trace](docs/rom-fish-sprite-research.md) and [extractor](scripts/extract_rom_fish_portraits.py).

Earlier portraits were cropped from player videos; those are historical material and are not used in the active guide. Thai/Latin aliases remain editorial name translations or transcriptions, not verified Thai-patch fish labels and not evidence for fish mechanics.

## ROM-only player guide — 2026-10-04

The active catalogue's gameplay explanations and fish-location pins use the supplied ROM's records, code consumers, and controlled rendering only. Older guide-reported item purposes and inventory limits are excluded from the delivered catalogue payload. The external references above preserve the project's research history; they are not evidence for the new compatibility/location claims. Translations are editorial wording unless a Thai-patch label capture is explicitly identified.

Fish spawn IDs and X/Y coordinates come from the parallel original-ROM tables documented in [fish-location-research.md](docs/fish-location-research.md). Terrain maps are reconstructed through the original game's field loader, then decoded from its temporary VRAM/PPU state. Background layers, palette, main/subscreen composition and tile flips come from that state. Sprites are omitted to keep terrain visible. No outside map or drawn terrain is used. The separate Fishing Notebook overview screenshots have no proven coordinate projection and are not used to place fish pins.

Reproduction: [spawn extractor](scripts/extract_rom_fish_locations.py), [field renderer](scripts/render_field_snapshot.py), [field-map capture/reconstruction](scripts/extract_rom_field_maps.py), and [catalogue location builder](scripts/build_fish_locations.py). Emulator state and memory dumps stay outside this repository. The Snes9x [snapshot definitions](https://github.com/snes9xgit/snes9x/blob/master/snapshot.cpp), [PPU structure](https://github.com/snes9xgit/snes9x/blob/master/ppu.h), and [renderer](https://github.com/snes9xgit/snes9x/blob/master/gfx.cpp) are technical format references, not game guides.
