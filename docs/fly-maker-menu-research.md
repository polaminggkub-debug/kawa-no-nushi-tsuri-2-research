# Custom-fly maker: static ROM trace

This is a code-only trace of the custom-fly maker in the supplied original Japanese ROM. No ROM, emulator core or save state is distributed. Controller-driven menu crosswalk probes are separate evidence; this static trace alone does not prove every picture is selectable.

## Player-facing findings supported by code

- The maker creates a completed fly from the selected body, wing, and tail. The code does not require those components to be owned first. It builds each menu from the component table, sums the selected records' prices, charges the quoted total, and stores the three IDs together in a free fly slot.
- For the first-stage Mayfly family, the first records in ROM order are body `01`, wing `09`, and tail `13`. Their component price fields are ¥5, ¥5, and ¥15, so this one combination produces the observed ¥25 quote. The maker displays the calculated quote before confirmation; it is not safe to assume ¥25 for other combinations.
- `無し` is represented by sentinel ID `87`, which is not one of the 134 component records. Selecting it leaves that part ID at zero and adds no price.
- The maker checks that the completed-fly inventory has an empty slot and that the player has enough money. If either check fails, creation does not proceed.

## Family and part selection

Area selection is made using `$085A & 1`. For Area 1, this bit is set. The family menu cursor `$1D33` maps as follows in `$03:9581..95FF`:

| Family menu choice | Resolved family key `$1D3B` | Captured Area 1 label |
| ---: | ---: | --- |
| 0 | `00` | Mayfly (`メイフライ`) |
| 1 | `01` | Caddis (`カディス`) |
| 2 | `04` | Terrestrial (`テレストリアル`) |

The Japanese labels come from the Area 1 runtime capture; the key mapping comes from the original-ROM branch code. The selected key and part number are passed to the list builder at `$03:97D8`. It scans record IDs `01..86` in ascending order and includes a record only when byte `+0` equals the family key and byte `+1` equals the part selector (`0=body`, `1=wing`, `2=tail`).

For family key `00`, the full matching ROM records are:

| Part selector | Matching record IDs, ascending | Full table count |
| ---: | --- | ---: |
| 0 body | `01–08`, `18–1E` | 15 |
| 1 wing | `09–12`, `1F–26` | 18 |
| 2 tail | `13–17`, `27–2A` | 9 |

For every non-body list, the builder appends sentinel `87` when its buffer has room. The selector recognizes `87` and skips both the component-ID write and its price addition. The body selection is required by the control flow; Terrestrial key `04` jumps directly to the quote after its body, with wing and tail left at zero.

## Price, confirmation, and inventory writes

The component table is at `$05:AA52`, stride 11 bytes; its pointer is `$05:800C`. `$03:D3D9` resolves a selected component ID to its row. `$03:974D..97D7` reads row word `+9` and adds it to the running amount `$1D3F`. `$03:9609` zeros that total before selection. Once the selection path reaches `$03:9681`, the game caps the total at `0x2710` and writes the amount to `$1A7B` for the quote/confirmation flow.

After confirmation, `$03:96A0..96C9` first checks `$09CC`, the last body slot in the completed-fly inventory. A nonzero value means there is no empty slot and creation stops. It then compares quote `$1A7B` with money `$0866`; if affordable, it subtracts the amount. `$03:96E5..9700` scans the body-ID slots starting at `$095E` for the first zero slot and writes:

| Component | Selected-ID field | Completed-fly inventory array |
| --- | --- | --- |
| Body | `$1D35` | `$095E` |
| Wing | `$1D37` | `$09CE` |
| Tail | `$1D39` | `$0A3E` |

These parallel arrays store one finished combination per slot. The write path does not consume or decrement a separate stock of owned body, wing, or tail parts. Thus the user-facing instruction should be to choose the maker pictures and check the displayed quote, rather than to bring a wing already owned.

## Unresolved menu-count / sprite crosswalk

The records establish the family/part filter and ROM order, but they do **not** yet establish a complete sprite-to-ID crosswalk. There is also a concrete count mismatch to resolve before publishing exact total palette choices:

1. Family `00` has 18 wing rows in the ROM (`09–12`, `1F–26`).
2. `$03:97D8..9843` has a 32-byte indexed ID-list buffer and can write at most 17 matching word IDs; because it has room for 17, an 18th match is omitted. With this ascending data, the buffer can contain only through ID `25`.
3. The Area 1 component display/selection setup is screen IDs `13..15` through the `$02:9FC8` renderer. That routine's loops at `$02:9FDF..9FEC` and `$02:A03B..A05F` process at most 16 word entries. Its first 16 populated entries are copied from `$1BD5` to selectable IDs `$1B6D`; for the full Mayfly wing filter this reaches only through `24`.
4. The existing runtime evidence reports 20 Mayfly wing pictures, which conflicts with this static list/render bound. The exact screen-to-record sprite sequence, any page/scroll behavior, and whether those pictures include non-selectable decorations remain unresolved. Do not claim IDs `25` or `26` (or the 20-picture count) are selectable until runtime input and WRAM capture resolves this.

The first records `01`/`09`/`13` match the default menu choices in the controller replay below. This resolves those positions only; other positions still require individual verification.

## ROM evidence index

ROM identity: supplied 1,572,864-byte Japanese SFC dump, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`.

| Address | Evidence |
| --- | --- |
| `$03:9517..957C` | Enters the Area 1 maker interaction, draws the family chooser, and reads the selected family cursor. |
| `$03:9581..95FF` | Maps family choice and Area parity to family key `$1D3B`; the `$95DD` entry sets key `00`, `$95E2` key `01`, and `$95FA` key `04`. |
| `$03:9600..9680` | Initializes body/wing/tail/quote fields; calls the list builder and selector for each part; Terrestrial skips wing and tail. |
| `$03:974D..97D7` | Reads selected ID from `$1B6D`, treats `87` as none, resolves the component row, adds word `+9` to `$1D3F`. |
| `$03:97D8..9843` | Ascending `01..86` table scan; family/category filtering; builds `$1BD5` list and appends `87` where space remains. |
| `$02:8050..8150` | Screen dispatch; IDs `13`, `14`, and `15` reach renderer `$02:9FC8`. |
| `$02:9FC8..A067` | Copies/render setup from `$1BD5`; fills the selectable-ID array `$1B6D` up to 16 entries. |
| `$03:D3D9..D3F6` | Resolves fly component ID to `$05:AA52` row with 11-byte stride. |
| `$03:9681..9700` | Caps/display quote, confirms funds and free slot, deducts currency, and stores the selected component IDs in parallel arrays. |

Structured evidence: [`fly-maker-menu-trace.json`](../data/fly-maker-menu-trace.json). The existing maker captures are documented in [`fly-customization.json`](../data/fly-customization.json).

Reproduce the matching ROM rows and example price fields with `python3 scripts/trace_fly_maker_menu.py --rom PATH_TO_ORIGINAL_ROM`. This script checks ROM identity, the three family-00 record lists and the ¥25 sum. It does not emulate the UI, verify inventory control flow or establish the number of selectable pictures.

## 日本語要約

毛バリ作成では、部品を先に持参する必要はありません。ROMの部品表から候補を作り、選んだボディ・ウィング・テールの価格を合計して、最終見積額を表示します。完成フライの空き枠と十分な所持金が必要です。最初のメイフライ候補01・09・13の価格合計は25円です。「無し」は部品IDと価格を追加しません。

ROM内の候補順だけでは画面上の位置を断定できません。特に、旧画像から数えたウィング20個と、メイフライの部品表18件・選択処理の上限には不一致があります。位置・選択可能数は通常入力の画面と保存IDで別に検証し、未確認の数をプレイヤー向けの確定情報として扱いません。

## Independent controller replay (2026-10-05)

The coordinator independently replayed the default Mayfly order from the verified maker-body menu state: A selects body `01`, A selects wing `09`, and A selects tail `13`. The game displays a 25-yen quote. Advancing the prompt and accepting Yes reduces money from 100 to 75 and stores `01 / 09 / 13` in the first completed-fly slot. The replay used controller input only, with no memory writes. It starts from an existing menu state and does not establish acquisition or new-game progression. ROM and core fingerprints match the identities above.

Private request, result, screenshots and final state are retained under the workspace analysis directory; ROM, core, save states and WRAM are excluded from publication. This narrow replay establishes the first recipe, not every picture's identity or the full number of selectable parts.

## Verified Mayfly menu actions

The [bounded runtime crosswalk](../data/fly-maker-ui-crosswalk.json) records the successfully selected positions. Each part starts with its default cursor: body Down+A selects02, Right+A selects05; wing Down+A selects0A, Right+A selects0D; tail Down, Right, Right, A selects visible「無し」and stores00. These actions do not establish a complete palette count.

The coordinator independently reran body02 + wing0A + no-tail from the verified body02 menu branch, using controller input only: the quote is17 yen, money100→83, stored composition02/0A/00. The01/0A/no-tail branch was a12-yen quote preview only. These are reproducible recipe examples, not evidence that either catches fish better. Original cursor and17-yen prompt screenshots are included in the player guide.
