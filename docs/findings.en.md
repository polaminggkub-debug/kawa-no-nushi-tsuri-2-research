# Findings: item records and confirmed effects

This note describes what the current research can support for the Japanese SFC release of *Kawa no Nushi Tsuri 2* (『川のぬし釣り2』). It separates values found in ROM tables, behavior traced through code, and effects measured in the running game. A raw byte is not automatically a useful player stat.

**Target dump:** 1,572,864 bytes; SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`; SHA-256 `e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49`. Findings below describe this Japanese SFC dump. Other regional or modified ROMs were not checked.

## Inventory scope

The working index contains 315 records: 21 rods, 81 lures, 134 fly parts, 13 hooks/Ayu nose rings, 10 floats/sinkers, 23 baits, 10 foods, and 23 general/quest/audio-setting entries. These are record counts, not counts of unique displayed names. Some lure IDs reuse a generic family label.

Names were seeded from published community item-ID lists and checked against ROM name pointers/strings where available. The lure display names for IDs `0x11` and `0x1D` were corrected after checking the Japanese ROM name data and in-game menus. Some item name-to-variant associations remain provisional. Yen prices below are stored ROM values; they do not establish shop stock or stage availability.

## What the rod records expose

Rod table rows are 12 bytes. Code copies their first eight bytes into working fields and uses them in fishing-style and fish-fight routines. This table shows three examples; values labeled “cutoff” and “range” are internal game quantities, not ratings shown in the manual.

| ID | Japanese name | English gloss | Style | Fight counter cutoff at 100+ HP | Range multiplier | Internal range threshold (`0x0150 × multiplier`) | Fish-ID compare byte | ROM price |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `01` | タナゴ竿10本継2m | Bitterling rod, 10-piece, 2 m | 1 | 10 | 3 | 1,008 | `0x39` | ¥500 |
| `07` | アユ竿6本継7m | Ayu rod, 6-piece, 7 m | 1 | 70 | 9 | 3,024 | `0x38` | ¥1,500 |
| `0D` | 大物用ルアーロッド | Large-fish lure rod | 4 | 120 | 24 | 8,064 | `0x26` | ¥650 |

**How to interpret these fields:**

- Rod byte `+0` selects a fishing-style family: `1` float/Ayu, `2` casting, `4` lure, `8` fly.
- Byte `+2` feeds a counter cutoff in the fish-fight routine. For style `1`, the value is used directly. Style `8` uses it directly and also derives a second cutoff at half that value. Styles `2` and `4` scale it by current HP when HP is below 100, with a floor of 10; at 100 HP or more the raw value is used. The player-facing name and unit for this parameter remain unknown.
- Byte `+3` is multiplied by `0x0150` and compared with an internal fish-position quantity. The unit conversion to distance, time, or meters is unknown; do not read the result as a cast distance in meters.
- Byte `+4` is compared with the active fish ID in a handling branch. It is a fish-ID comparison, not a general fish-size score.
- Byte `+5` affects rod graphic selection. Byte `+7` selects branches in fight-response logic; its player-facing meaning has not been named. Bytes `+1` and `+6` remain unresolved.
- The manual separately says longer telescopic rods cast farther, describes rod families, and advises matching lure-rod size to lure and fish size. Those are manual descriptions, not proof that the internal values above equal a particular real-world rod rating. See printed pages 12–13 and 24 of the [manual scan](https://gamemanual.midnightmeattrain.com/entry/%E5%B7%9D%E3%81%AE%E3%81%AC%E3%81%97%E9%87%A3%E3%82%8A2).

## What has and has not been decoded for lures

Lure records are also 12 bytes. The code paths inspected establish uses for some bytes, but not a familiar set of lure “power/depth/weight” ratings.

| ID | ROM/menu name | Byte `+0` action branch | Byte `+1` behavior selector | Byte `+2` fish comparison | ROM price |
| ---: | --- | ---: | ---: | --- | ---: |
| `11` | トップウォータ / Topwater | 2 | 1 | 0 | ¥30 |
| `1D` | シャローライナー / Shallow runner | 3 | 2 | 0 | ¥60 |
| `51` | シンキング / Sinking lure | 5 | 2 | `0x37` (Akame fish ID) | ¥500 |

The action byte selects branches. Byte `+1` affects how an internal value is adjusted during a lure interaction, but its player-facing effect is not established. For ID `0x51`, byte `+2` is compared to the active fish ID in a particular response path when a hook-record condition is met; that changes a behavior branch and does **not** establish exclusive compatibility or a catch bonus. Other lure bytes are used in graphics/animation setup or as a mask against a fish-record field. The inspected code does not establish a depth-in-meters, weight, durability, or catch-rate scale.

The manual describes lure families and actions, including spinners, spinnerbaits, spoons, plugs/topwater, shallow runners, deep runners, sinking lures, jigs, and soft lures (printed pages 20–23). It does not give a numeric stat table for each lure ID. A 2025 player report describes choosing and working lures but says individual lure actions did not seem configurable; this remains an observation, not proof that no customization exists in every area. [Player report](https://note.com/holy_heron2678/n/na12caa0f2974?hl=en)

## Fly-maker observations

The observed custom-fly interaction is a **fly** maker, not a lure-customization screen. At the one early-stage shop checked, the family menu showed Mayfly, Caddis, and Terrestrial. The visible palettes in that shop showed:

| Part | Directly observed choices | Limit |
| --- | ---: | --- |
| Mayfly body palette | 15 | One shop capture |
| Caddis body palette | 14 | One shop capture |
| Terrestrial body palette | 16 | One shop capture |
| Wing palette | 20 | Two special-looking final icons correspond to records `0x66`/`0x67` by component ordering; the UI did not expose those IDs |
| Tail palette | 9, plus `無し` (none) | One Mayfly sequence |

The ROM component index classifies 134 records as 64 body entries, 47 wing entries, and 23 tail entries. The palette counts are visible choices in one shop and do not map one-to-one to every ROM ID: the interface does not display internal IDs, and some of the last wing-ID correspondence is inferred from record ordering. The first shop's palette and the full ROM table are different evidence sets. This work does not assign a hidden gameplay bonus to a fly part merely because it has a higher price.

The Japanese manual groups flies into wet/dry Mayfly and Caddis families and terrestrial patterns, with descriptions and diagrams rather than numerical part stats (printed pages 22–23). [Manual](https://gamemanual.midnightmeattrain.com/entry/%E5%B7%9D%E3%81%AE%E3%81%AC%E3%81%97%E9%87%A3%E3%82%8A2) · [early-shop screenshot source](https://evaandmaicy.blogspot.com/2014/11/sfc-2_18.html)

## Food effects measured in the running game

Each test set current HP to 1, left maximum HP at 100, used one item, advanced the message, and read current HP at WRAM `7E:0862`. The listed “HP gained” is the measured difference in that setup; it is not a test of healing while already near maximum HP.

| ID | Japanese name | English | HP gained in the test | Result and limit |
| ---: | --- | --- | ---: | --- |
| `01` | ミカン | Mandarin orange | 5 | Current HP went from 1 to 6 |
| `02` | おむすび | Rice ball | 10 | 1 → 11 |
| `03` | だんご | Dango | 15 | 1 → 16 |
| `04` | バナナ | Banana | 20 | 1 → 21 |
| `05` | ブドウ | Grapes | 30 | 1 → 31 |
| `06` | 日の丸弁当 | Hinomaru bento | 40 | 1 → 41 |
| `07` | ダイコン | Daikon radish | 40 | 1 → 41 |
| `08` | 魚 | Fish | Variable | Tested values restored `floor(raw fish size / 4)` HP; one fish was consumed. This is limited to the tested sizes and records. |
| `09` | きのこ | Mushroom | 10 | Current HP went from 1 to 11 |
| `0A` | 毒きのこ | Poison mushroom | — | Current HP was set to 0 in the controlled test |

For fish food, a controlled basket record with raw size 30 produced 7 HP, and no fish record produced no HP gain and was not consumed. Additional tested sizes produced 1 HP at size 4, 2 at 10, 5 at 20, 7 at 30, 10 at 40, 15 at 60, 20 at 80, 25 at 100, 35 at 140, and 50 at 200. Do not extrapolate beyond those tests without another run.

## Evidence and limits

- Static records and code consumers were read from the target ROM. Item table rows include record bytes, name pointers, and price fields. Rod and lure field descriptions above are limited to traced consumers documented in the analysis notes.
- Food effects were measured in an isolated Snes9x Libretro run with controlled WRAM. The exact source save states are not redistributed; the test method and measured values are recorded in the JSON evidence.
- The item-ID community list is a lead, not authoritative design documentation. The original manual is the primary source for the manual-described fishing concepts. Player notes are cited as qualitative observations.
- The catalogue includes game imagery for identification. Copyright in game art and manual photography remains with its respective owner; the imagery is not relicensed by this research.

## Sources

- [Original SFC instruction manual scan](https://gamemanual.midnightmeattrain.com/entry/%E5%B7%9D%E3%81%AE%E3%81%AC%E3%81%97%E9%87%A3%E3%82%8A2), printed pages 12–29.
- [Community item-ID list](https://roadbikebeginners.com/sfc-kawanonushitsuri2-cheat/); used as a provisional index, then cross-checked where ROM/menu evidence was available.
- Player observations: [lure fishing](https://note.com/holy_heron2678/n/na12caa0f2974?hl=en), [lure breakage](https://note.com/holy_heron2678/n/n433005d8fe08?hl=en), and [stream fishing](https://note.com/holy_heron2678/n/nf6dccee118e2?hl=en).
- [Community item/location walkthrough](https://wazap.com/cheat/%E5%85%A8%E9%81%93%E5%85%B7%E7%B4%B9%E4%BB%8B%E3%81%A8%E5%85%A5%E6%89%8B%E5%A0%B4%E6%89%80/177794/).
- [Early-shop and fly-maker gameplay screenshots](https://evaandmaicy.blogspot.com/2014/11/sfc-2_18.html).

Research snapshot: 4 October 2026.
