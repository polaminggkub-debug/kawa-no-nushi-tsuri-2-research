# Yamame fight: held input versus press/release schedules

## What a player can try

If a long A hold loses an Area 1 Yamame, pressing A with release intervals is an **experimental alternative**. This recommendation is limited to one natural encounter and its measured setup. It is not a universal rhythm, a catch-rate estimate, or a guarantee of landing.

## Setup and provenance

- User-supplied headerless Japanese ROM: 1,572,864 bytes, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`.
- Snes9x libretro core SHA-256: `8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6`.
- Same natural underwater Yamame ID `03` fight seed for every comparison; seed SHA-256 `bb78d1a31ff4e72f5a87d8e59fdd623e17a18a4a11afd7b8025341e10aca1366`.
- Float-bait mode `0`, rod `02` 渓流カーボン竿6m, float `04` 玉ウキ, hook `06` ハリ, HP `100`.
- Bait `07` カワムシ was selected before the natural cast. At the fight seed, the active bait selector was already `00`; its cached record still matched `07`. This does not establish why the selector cleared or that bait `07` remained equipped at replay start.
- Gear and HP stayed identical across the compared outputs. Controller input only; no RAM writes. Each endpoint save has the same extra neutral frame from the runner.
- Local states, WRAM and the emulator core are retained privately and are not distributed. The replay requires that exact starting state; the ROM alone is not a turnkey reproduction of the natural encounter.

The rod, float, hook and bait mapping is recorded in [the extracted item tables](../data/items-rom.json). Pre-cast selectors `$0874/$0880/$0882/$0884` held `02/04/06/07`; current HP `$0862` held `100`. The loader at `84:D2DC` copies these selectors into the loaded item fields. Rod multiplier `8 × 336` agrees with fight boundary `$1ED7=2688`; it was not used to infer the rod ID.

## Controlled comparison: equal elapsed time and A-held time

Every row requests **320 frames: 240 A-held frames and 80 neutral frames**. Only their schedule changes. Neutral means no controller buttons held.

| Schedule | Visible endpoint | Raw state / response counter / fish position |
| --- | --- | --- |
| A60 + neutral20, four times | Fish visible underwater | `1 / 0 / 192` |
| A120 + neutral40, twice | Fish visible underwater | `0 / 0 / 429` |
| A240 + neutral80, once | Yamame escaped | `2 / 63 / 404` |
| A3 + neutral1, 80 times | Fish visible underwater | `1 / 1 / 1184` |

No matched endpoint landed the fish; the notebook record was still empty. State `0` is a timed transition/reset path, not a loss label. The boundary was `2688` in every run. These results establish that the input schedule matters for this starting state. They do not establish the shortest presses as best or an optimum tempo.

A separate 320-frame comparison also escaped with continuous A320, while A60/neutral20 repeated four times left the fish visible. That comparison alone did not control total A-held time; the table above supplies that additional control.

## The catch occurred later

The A60/neutral20 branch then continued with A30 and neutral5 plus additional recorded surface inputs. Only that **separate continuation** reached the game's 23 cm catch message and notebook counter `1`, size `23`, area `1`. Do not credit the catch to the initial 320-frame rhythm alone.

- [Actual escape-message capture](../research/assets/fight-hold-escape.png), SHA-256 `9b82e413631ad0562e9392c01a3c68581377086119da438b6747b1ec90310839`.
- [Actual 23 cm result after the continuation](../research/assets/fight-release-catch.png), SHA-256 `8ac39b47e00686b747a9954a216118f0495188065f947c6d99c143d23c1db1b1`.

## Same-seed replay and surface-message progression

The retained encounter was replayed afresh using controller inputs only, with no RAM injection. This reproduces the same natural seed; it is **not a second naturally encountered fish**. The structured [surface progression evidence](../data/fight-surface-progression.json) records actual button events, durations, state fingerprints and notebook fields without distributing ROM, state, WRAM or core files. The ROM alone cannot reproduce this encounter without the private seed.

| Chained phase | Requested frames | Actual frames including neutral save | State SHA-256 |
| --- | ---: | ---: | --- |
| Press/release comparison continuation | 320 | 321 | `5842b4a324ebecb9cbab44e1d15df8c451ae78346ae1707f3149ded44910dbe7` |
| Additional A30 / neutral5 | 35 | 36 | `4c964b7cdd810c1bdcf98083ac66178fe2ba1e19ad1b108248de8040b31ef910` |
| Surface actions | 44 | 45 | `9be12c769f933c80ab8eafad31364913002e2f97c3c0d176184456e3cea351d2` |
| Surface text completion | 121 | 122 | `42bccf24c59d19eef94f613c744227e533bb777ed62d1125830129395bf9b962` |

Each fresh phase matched its previously indexed phase state byte for byte. A flattened replay explicitly retained three neutral boundary-save frames; its final save added the fourth. Its **524 actual frames** produced a byte-identical final state to the chained endpoint. Both ended with Yamame notebook callback counter `$0E50=1`, best size `$0DCC=23`, and area `$0C40=1`. The callback counter is a raw field, not a count of unique fish species. These timing numbers describe evidence, not a recommended button combo.

Four surface variants then started from the same additional-A30/neutral5 state and ran **167 actual frames each**. Only the selected button was retained; every other interval became neutral. Event frames below are 1-based from this surface seed, not from the initial fight seed. Every listed press lasts one frame.

| Variant | Retained button events | Visible endpoint | Callback counter / best size / area |
| --- | --- | --- | --- |
| Neutral only | None | Caught-Yamame name message, awaiting progression | `0 / 0 / 0` |
| A only | A at frames 12, 34, 106 | 23 cm size result | `1 / 23 / 1` |
| Up only | Up at frames 1, 34 | Caught-Yamame name message, awaiting progression | `0 / 0 / 0` |
| B only | B at frame 23 | Caught-Yamame name message, awaiting progression | `0 / 0 / 0` |

**Player action:** once the caught-name message appears, press A to advance to the size result, then open General Tools → Notebook `05` to check the record. The A-only variant worked without Up or B in this bounded setup. Neutral already displayed that the fish was caught: A is supported as message/result progression here, **not the cause of catching**. This experiment does not establish that all three A taps are necessary, that a single earlier tap works, that B causes escape, or that another variant could never advance with more time.

- [Fresh caught-name screen, neutral endpoint](../research/assets/fight-caught-name.png), SHA-256 `6d0b16fbcf245101071b8c86f1dc1aa83c2c0e4551aa25ebc3ab112b14d06db5`.
- [Fresh A-only 23 cm result](../research/assets/fight-a-surface-result.png), SHA-256 `8ac39b47e00686b747a9954a216118f0495188065f947c6d99c143d23c1db1b1` (identical pixels to the previously captured size result).

An initial ablation helper reused mutable steps and produced mislabeled neutral inputs. It was corrected to deep-copy each variant, and all four intended variants were rerun; the earlier mislabeled outputs are excluded. Visual review also corrected the initial B-only description: its endpoint does have the caught-name textbox. The distinct B state hash does not override what that screenshot shows.

## Original-ROM input trace

At `00:DDE7..DDF4`, the game stores held buttons in `$1348` and newly pressed edges in `$134A`. The callback wait at `01:9205` accepts a new A/B/Up edge (`$8880`); this gate alone does not name the subsequent action.

The separate state-1 update at `04:99F5..9A05` reads held `$1348 & $8080` (A/B) **only when `$1ED5 < $1ED7`**. Held A/B selects `04:9A07`; neither held selects `04:9A62`. At or above the boundary, it selects `9A07` regardless of held input. Original bytes at `04:99F5`: `AD D5 1E CD D7 1E 90 02 80 08 AD 48 13 29 80 80 F0 5B`.

The held path can advance `$1EC9` as `(2x+1)&0x3F` at `04:9C35`, on its update cadence. Reaching `63` sets a state transition; only the separate position-limit test sets `$1ECD` and event `$16AA=0x1A`. The neutral path decrements a different timer, and expiry at `04:9AD0` resets `$1EC9` and returns `$1EC1` to `0`. A fresh A/B edge or timer expiry can return state `0` to `1`.

Thus a hold and a press followed by release are mechanically distinct. The trace does **not** identify these paths as reeling, tension, or catch progress, and A/B sharing this branch does not establish that they are interchangeable throughout the whole game.

## Still unproven

Other species, rods, HP levels, encounter states, natural input variability, optimum timing, and increased catch probability remain unmeasured. This evidence does not justify ranking fight-response selectors `0/1/2` as rod strength or telling players that pauses always prevent escape.
