# Area 1 Mayfly wing menu: verified position guide

This guide answers a practical question: **where is each tested wing ID in the Area 1 Mayfly maker menu?** It maps the visible menu by row and column and links each ID to its item record. It does not rank wings by fishing performance.

## Player instructions

When the wing menu opens, start at the top-left position. To select an entry, press Right `column − 1` times, Down `row − 1` times, then A. For example, ID `0A` is column 1, row 2: press Down once, then A. ID `24` is column 4, row 4: press Right three times, Down three times, then A.

| Row ↓ / column → | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| 1 | [`09`](../catalogue/item.th.html?category=fly_wing&id=09) | [`0D`](../catalogue/item.th.html?category=fly_wing&id=0D) | [`11`](../catalogue/item.th.html?category=fly_wing&id=11) | [`21`](../catalogue/item.th.html?category=fly_wing&id=21) |
| 2 | [`0A`](../catalogue/item.th.html?category=fly_wing&id=0A) | [`0E`](../catalogue/item.th.html?category=fly_wing&id=0E) | [`12`](../catalogue/item.th.html?category=fly_wing&id=12) | [`22`](../catalogue/item.th.html?category=fly_wing&id=22) |
| 3 | [`0B`](../catalogue/item.th.html?category=fly_wing&id=0B) | [`0F`](../catalogue/item.th.html?category=fly_wing&id=0F) | [`1F`](../catalogue/item.th.html?category=fly_wing&id=1F) | [`23`](../catalogue/item.th.html?category=fly_wing&id=23) |
| 4 | [`0C`](../catalogue/item.th.html?category=fly_wing&id=0C) | [`10`](../catalogue/item.th.html?category=fly_wing&id=10) | [`20`](../catalogue/item.th.html?category=fly_wing&id=20) | [`24`](../catalogue/item.th.html?category=fly_wing&id=24) |

The first two columns contain IDs `09–10`; column 3 contains `11`, `12`, `1F`, and `20`; column 4 contains `21–24`. Menu position follows the captured cursor grid, not a simple ascending list across each visual row.

## What the checks establish

The matching original Japanese ROM was loaded in the Snes9x Libretro core. The probe restored an existing Area 1 body-confirmed Mayfly state, navigated with controller input only, pressed A at each position, and read the selected wing ID at WRAM `$1D37`. A second independent replay matched the first probe’s selected IDs and cursor screenshot hashes for all 16 positions.

Four extra right-edge trials repeated the same four IDs in column 4; no fifth distinct choice appeared in this tested menu. The ROM table contains 18 Mayfly wing records (`09–12`, `1F–26`), but this bounded test did not reach `25` or `26`. It does **not** establish whether those records can be selected in another menu state or context. The older visual count of 20 choices has been superseded; it was not a verified selectable count.

The copied [top-left game screenshot](../catalogue/custom/mayfly-wing-palette-area1.png) is the original 256×224 Snes9x output. It was not redrawn or altered. The source screenshot SHA-256 is `30859d8aaa694659ae2957cbbcc2dbfbbc36abc3a4ea2dc462368913ac8f4180`.

## Provenance and boundaries

- ROM: supplied Japanese SFC dump, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`, SHA-256 `e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49`.
- Snes9x Libretro core SHA-256: `8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6`.
- Seed state SHA-256: `b60fb817fa033d77e3492e054115c24e17d9f6c679034d4a40e9492a470851b5`.
- The component selector writes the selected part to `$1D37`; menu navigation uses Right and Down, and A confirms. The probe’s Libretro joypad IDs were Right `7`, Down `5`, and A `8`.
- Structured positions and screenshot provenance: [`fly-maker-wing-palette.json`](../data/fly-maker-wing-palette.json). The static maker trace is in [`fly-maker-menu-research.md`](fly-maker-menu-research.md) and [`fly-maker-menu-trace.json`](../data/fly-maker-menu-trace.json).

These are controlled menu-state probes, not a new-game playthrough or proof of shop stock in every area. They do not map other fly families or establish a bite, landing, price, or quality advantage for any wing. ROM, core, save states, and WRAM are not distributed.

## 日本語

エリア1のメイフライ用ウィングメニューを16位置確認しました。左上から右へ列、下へ行を移動します。決定はAです。各位置のウィングIDは上の表から詳細ページへ開けます。4列目からさらに右を押しても、確認したメニューでは列4と同じIDが選択されました。ROMにあるID `25`・`26` が他の状態でも選べないという意味ではありません。食いつき・取り込みの優劣も確認されていません。

## ภาษาไทย

ตรวจเมนูเลือกปีกเมย์ฟลายในด่าน 1 ได้ 16 ตำแหน่ง เริ่มซ้ายบน กดขวาเพื่อเปลี่ยนคอลัมน์ กดลงเพื่อเปลี่ยนแถว แล้วกด A เพื่อเลือก เมื่อกดขวาต่อจากคอลัมน์ 4 รหัสในแถวเดิมของคอลัมน์ 4 ยังถูกเลือก ไม่มีคอลัมน์ที่ 5 เพิ่มขึ้นในการทดสอบนี้ แต่ยังสรุปไม่ได้ว่า ID `25` และ `26` เลือกไม่ได้ในเมนูหรือสถานการณ์อื่น และไม่มีหลักฐานว่าปีกใดช่วยให้ปลากินหรือตกขึ้นได้ดีกว่า
