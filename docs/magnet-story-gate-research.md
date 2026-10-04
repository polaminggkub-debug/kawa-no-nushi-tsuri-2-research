# Area 6 magnet-story gate: bounded ROM trace

This report records a bounded reverse-engineering trace for the Japanese SFC release of *Kawa no Nushi Tsuri 2* (『川のぬし釣り2』). It does not claim to have reproduced the complete natural quest sequence. No ROM, emulator core, save state, or game screenshot is distributed here.

**Verified input:** headerless ROM, 1,572,864 bytes, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`. The script rejects other files. Its generated evidence is [magnet-story-gate.json](../data/magnet-story-gate.json). The original-ROM verifier is [verify_magnet_story_gate.py](../scripts/verify_magnet_story_gate.py).

## What the trace establishes

The Area 6 magnet-heading handler at `03:C3C8..C3CF` reads flag `$7E:0C18` and accepts its `0x04` bit. The flag-setting routine at `01:DE89..DEBB` sets that bit only when prerequisite bit `0x02` is already set, the heading bit is clear, and at least `0x41` (65) entries in `$7E:0DC8..$7E:0E4A` are nonzero.

There are 66 two-byte entries. The record updater maps accepted fish IDs `0x01..0x42` to those entries and writes a new size only when it exceeds that ID's previous record. Therefore the gate counts **65 distinct nonzero per-ID record slots out of 66**. It does not count 65 catches. The static trace cannot say exactly what ordinary play must do to populate a slot.

## The four selected anglers and their fish-table rows

The original-ROM runtime capture of the new-game menu displays 「誰が釣りにでかけますか？」 (“Who will go fishing?”) and four named family choices. The capture is retained only as private research evidence and is not bundled. ROM code at `01:9DF7`, `01:9EC7..9F05`, and `01:9F17..9F30` enters a four-way, input-controlled selector and stores `$0860 = $16BE + 1`. At `01:9EC7`, controller mask `0x0C00` toggles cursor bit 1 and `0x0300` toggles bit 0. The menu's initial highlighted top-left choice is slot 1; the two cursor bits encode the other positions.

| Selector `$0860` | Menu position | Family relation / name | Age | Map set and page | Fish-table row | Fish and configured tile |
| ---: | --- | --- | ---: | --- | ---: | --- |
| 1 | Top left | Older brother, 太郎 (Taro) | 10 | 6, 河口 | 0 | アカメ (Akame), (37,29) |
| 2 | Top right | Younger sister, 京子 (Kyoko) | 6 | 5, 下流 | 0 | タナゴ (Tanago), (17,16) |
| 3 | Bottom left | Father, 雄三 (Yuzo) | 38 | 4, 湖 | 0 | ナマズ (Namazu), (25,34) |
| 4 | Bottom right | Mother, 紀子 (Noriko) | 35 | 5, 下流 | 1 | コイ (Koi), (22,15) |

The selector-to-row association is confirmed by the callback comparisons, the active fish-ID load at `04:E85A..E85E`, and the ROM's parallel fish-ID/X/Y tables. The configured coordinates identify table entries; by themselves they do not prove that an encounter there completes a quest.

The fish-table offsets tested by the four branches are `0x0A00`, `0x0800`, `0x0600`, and `0x0802`. The callback paths at `01:90A4` and `01:917A` write literal `1` to `$0C18` for the matching selector/offset pairs. Slots 1 and 2 are in the regular fishing/update path, which also checks active fish ID `<= 0x42`. Slots 3 and 4 are in a result callback after the record updater and require its `$10 == 1` branch. This difference is preserved in the generated JSON.

ROM story messages provide partial narrative corroboration: messages `0364/0366` name Akame, `0376/0378` name Tanago, and `039A/039C` name Namazu in scenes using the dynamic player name placeholder `[CD]`. Message `0388` says the named character cooked and ate the River Master but does not identify that fish. This trace does not assign one fixed species to the fourth line beyond the fish-table/callback pairing above.

## Area 1 return route and the later Area 6 target

The ROM transition table pairs Area 1 tile `(8,183)` with map 7 tile `(7,13)`. When `$0C18 == 0x0001`, the route setup queues scene state `0x0C`; that scene later ORs prerequisite bit `0x02` into `$0C18`. This transition is established by static code and table data. It does not prove which natural event first sets `$0C18` to `1`.

A separate later transition pairs Area 1 `(12,189)` with map 7 `(7,77)` and queues state `0x0D` when `$0C18 == 0x000F`. Since `0x000F` already includes heading bit `0x04`, this later state is not the event that first unlocks the Area 6 heading.

The Area 6 compass-target table contains a `0x00FF` sentinel. Its dynamic words resolve to fish-location row 1: ID `0x3B`, オオウナギ (giant eel), at `(41,8)`. This target is distinct from the four selector-linked rows in the table above. The equality is ROM-backed; it does not by itself prove the eel is a quest objective or identify how to make it appear.

## What remains unproven

- The callback checks a valid active fish/table-row context, but no inspected branch tests an explicit landed-catch result. The trace does not establish whether a bite, active encounter, fight result, or landed fish is required.
- The four selector/row comparisons are not a named quest script. They do not prove this is the only ordinary route to the prerequisite flag.
- A fish's configured spawn-table coordinate is not proof that the player can reach or trigger it through ordinary movement from a particular point.
- The 65-slot gate does not establish that 65 repeated catches work, or which routine writes each first nonzero record during ordinary play.

For those reasons, this report is research evidence, not an instruction to catch a particular fish to solve the story. A natural-playthrough trace is needed before publishing that as a player tip.

## Reproduce the static check

From the project root, run:

```sh
python3 publication/scripts/verify_magnet_story_gate.py \
  --rom "/path/to/your/headerless-japanese-original.sfc"
```

The verifier uses only Python's standard library, checks the ROM SHA-1 and exact instruction fingerprints, validates the four fish IDs and coordinates against `lure-coverage.json`, and writes `publication/data/magnet-story-gate.json` by default. Pass `--output` to choose another JSON path. The fish-name index must also identify the same ROM SHA-1. This static check is not an emulator or a natural-playthrough test.

## 日本語要約

この調査は、日本版SFC ROMの静的コードとデータを限定範囲で照合したものです。ROMファイル、エミュレーターコア、セーブステート、ゲーム画像は公開物に含めていません。

羅針盤の「ぬしの見出し」フラグは、前提フラグ `0x02` が立っていて、対象フラグ `0x04` が未設定で、魚ID `0x01～0x42` に対応する66個の記録欄のうち65個が非ゼロの場合に設定されます。これは「65回釣る」という意味ではなく、**66種類の魚記録欄のうち65欄が非ゼロ**という条件です。

新規開始時の釣り手選択画面には「誰が釣りにでかけますか？」と表示され、選択肢は兄の太郎（10歳）、妹の京子（6歳）、父の雄三（38歳）、母の紀子（35歳）です。セレクター `$0860` の値は画面上の4人の選択位置に対応します。ROMの魚テーブルとコールバック比較から、各選択値に結び付く魚と設定位置は次の通りです。

| `$0860` | 選択人物 | マップ | 魚テーブル行 | 魚と設定座標 |
| ---: | --- | --- | ---: | --- |
| 1 | 兄・太郎 | 河口 | 0 | アカメ (37,29) |
| 2 | 妹・京子 | 下流 | 0 | タナゴ (17,16) |
| 3 | 父・雄三 | 湖 | 0 | ナマズ (25,34) |
| 4 | 母・紀子 | 下流 | 1 | コイ (22,15) |

Area 6 の動的な羅針盤位置は別の魚テーブル行で、オオウナギ `(41,8)` に一致します。この一致だけでは、オオウナギがストーリー目標であることや、通常プレイで出現させる方法までは証明できません。

未解決点は、対象の魚を釣り上げる必要があるのか、食いつきや戦闘開始だけで条件を満たすのか、別の通常ルートがあるのかです。したがって、この調査結果だけを根拠に「この魚を釣ればクエスト達成」と案内することはできません。プレイヤー向けの手順にするには、自然なプレイ経路での確認が必要です。
