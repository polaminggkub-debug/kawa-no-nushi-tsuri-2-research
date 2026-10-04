# Kawa no Nushi Tsuri 2 (SFC/SNES) research

![川のぬし釣り2 / Kawa no Nushi Tsuri 2 title screen](catalogue/assets/kawa-no-nushi-tsuri-2-title-screen.png)

An independent, source-linked study of the Japanese Super Famicom release of **Kawa no Nushi Tsuri 2** (『川のぬし釣り2』). The project documents item records, the parts used to make flies, and a small set of effects confirmed by running the game. It does not distribute the game.

**Languages:** [ไทย — item catalogue](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/catalogue/index.th.html) · [日本語](README.ja.md) · [Findings (English)](docs/findings.en.md) · [調査結果（日本語）](docs/findings.ja.md) · [English item catalogue](catalogue/index.html) · [日本語アイテムカタログ](catalogue/index.ja.html)

**Open the equipment guide:** [ไทย](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/catalogue/index.th.html) · [English](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/catalogue/) · [日本語](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/catalogue/index.ja.html)

The guide starts with equipment categories, then explains each item's use. Bait/lure/fly entries show the fish profiles that pass the documented condition, with fish sprites extracted directly from the original ROM. Fish filters, fly-part tabs and rod-style comparisons support equipment selection; raw fields remain inside expandable evidence. Compatibility is not a measured landing rate. Fish locations now use the original ROM’s parallel species/X/Y tables; guide-reported item uses are excluded from the current equipment cards. Historical community material remains credited separately and is not evidence for the ROM location index.

![Sample research catalogue](examples/catalogue-en.png)

## Practical questions answered from the ROM

[Player decisions: what to buy, carry and do](docs/player-decisions.md). The guide leads with purchase recommendations and their reasons. A selected fish also produces a low-cost ready-made fly suggestion from that area's decoded stock when one is listed; this is a spending choice based on body compatibility, not a landing-rate ranking. Raw fields, ordinal rod rankings and unproven fish-specific advantages are kept inside technical evidence.

[Player-value audit: questions, answers and remaining limits](docs/player-value-audit.md).

- [Rod and lure choices](docs/rod-lure-practical-research.md): aiming control, HP scaling, and the equipment-loss condition.
- [Hooks, floats and sinkers](docs/hook-practical-research.md): rig selection and why a named hook is not automatically a catch bonus.
- [Fly parts](docs/fly-practical-research.md): body coverage, hidden body/wing conditions, overnight changes, and the distinction between a ready-made bundle and custom parts.
- [Shop stock across all six areas](docs/shop-stock-research.md): exact purchase areas, special rod merchants, and the sold-Ayu condition for live bait.
- [Bait-search locations](docs/forage-location-research.md): example magnifying-glass tiles on real ROM terrain, with bait images marking the results.
- [Food decisions](docs/food-practical-research.md): HP recovery, consumption, the first fish in the basket, and the deadly Kusafugu exception.
- [Tub versus canoe movement](docs/boat-movement-research.md): the canoe makes 40% more movement steps in the traced no-current branch.

## New equipment research — 2026-10-04

**[Visual guide: English](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/research/) · [日本語](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/research/index.ja.html) · [ไทย](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/research/index.th.html)**

- Two lure IDs cover the **mask compatibility** of all 38 lure-eligible fish/creature profiles: one of `17/18/2E/2F/30/31` plus `23/24` (hex). The cheapest ROM base-price pair is `17 + 23`, ¥50. Area 1 sells the Spoon `2E` + Soft worm `23` alternative for ¥55; the ¥50 pair is sold together in area 4.
- Rod byte `+2` was previously mislabeled as a fight counter. Target movement, B release and the next state identify it as a **pre-hook aim/cast hold-time cutoff**. It is not fight strength.
- Fly body normalization and bait/lure mask checks now have a [reproducible matrix](docs/fish-acceptance-research.md). These are compatibility checks, not measured bite or landing rates.
- [Rod consumers](docs/rod-response-research.md), [lure setup transforms](docs/lure-response-research.md), and [six-area shop stock](docs/shop-stock-research.md) document exact limits.

Reproduce with your own original ROM:

```sh
python3 scripts/extract_lure_coverage.py --rom /path/to/game.sfc --output /tmp/lure-coverage.json
python3 scripts/extract_fish_acceptance.py --rom /path/to/game.sfc --output /tmp/fish-acceptance.json
python3 scripts/extract_rod_response.py --rom /path/to/game.sfc --output /tmp/rod-response.json
python3 scripts/extract_lure_response_grid.py --rom /path/to/game.sfc --output /tmp/lure-response.json
```

## Fish locations from the original ROM

Choose a fish in the catalogue to see its areas, configured spawn tiles on actual terrain, and compatible equipment. All six field maps and all 1,536 spawn-table rows come from the supplied original ROM. The location index covers 72 named fish/creature profiles and 103 fish/area pairs. Some configured slots can be inactive; compatibility and successful landing are separate mechanics.

- [Table locations, loader trace and limits](docs/fish-location-research.md)
- [Extracted spawn data](data/rom-fish-locations.json)
- [Map identity and coordinate transforms](catalogue/maps/rom-map-manifest.json)
- [Fish sprite graphics and normal palettes](docs/rom-fish-sprite-research.md)

To reproduce the maps, supply your own matching ROM, Snes9x libretro core, and outdoor area-1 state:

```sh
python3 scripts/extract_rom_fish_locations.py /path/to/game.sfc --output /tmp/rom-fish-locations.json
python3 scripts/extract_rom_field_maps.py --rom /path/to/game.sfc --core /path/to/core --field-state /path/to/outdoor-area-1.state --local-dir /tmp/kawa-field-captures --output-dir catalogue/maps
python3 scripts/build_fish_locations.py
node scripts/build_catalogue.cjs
```

Field rendering needs NumPy/Pillow. Temporary emulator states and dumps stay outside the repository. The script uses the original ROM's area-cycle branch to initialize graphics, rather than changing the ROM. Full maps can show seams from animated water captured at different times. Cropped map sections keep terrain context around the selected fish points, and the overview outlines the displayed section.

## What is covered

The current research index has 315 entries. A lure or fly-part ID is a distinct game record, even when the game reuses a displayed name.

| Group | Entries | What the count means |
| --- | ---: | --- |
| Rods | 21 | Rod records |
| Lures | 81 | Lure records; repeated names can have different records |
| Fly parts | 134 | 64 body entries, 47 wing entries, and 23 tail entries |
| Hooks and Ayu nose rings | 13 | Hook/ring records |
| Floats and sinkers | 10 | Float, marker, and sinker records |
| Baits | 23 | Bait records |
| Food | 10 | Food and healing items |
| General/quest items and sound choices | 23 | Includes stereo/mono menu choices, not just carried items |
| **Total** | **315** | Research-index entries |

For the directly observed fly-maker options and the limits of the ID mapping, see [the findings](docs/findings.en.md#fly-maker-observations). A record count is not a claim that every gameplay effect has been decoded.

## Reproduce the ROM table extraction

Use your own dump of the Japanese SFC game. The published ROM-specific findings refer to a 1,572,864-byte dump with SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212` and SHA-256 `e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49`.

```sh
python3 scripts/extract_items.py --rom /path/to/your/Kawa-no-Nushi-Tsuri-2.sfc --output /tmp/items.json
```

The extractor uses Python's standard library. It reads the ROM and writes the requested output file; it does not patch the ROM. If your dump differs, treat the result as a separate build and verify it before comparing records.

An optional runtime-capture helper is available as `scripts/capture.py`; see the [capture instructions](docs/runtime-capture.en.md). It requires a Snes9x-compatible Libretro core supplied by the user, plus Python `numpy` and `Pillow`. The controlled gameplay observations in this repository were made in an isolated emulator run. The original emulator save states used to reach those exact test setups are not included, so recreating the tests requires rebuilding the setup in-game or supplying your own state.

## How to read the findings

- ROM table fields are labeled by the code path that consumes them. A raw value is not presented as a player-facing stat unless its meaning and units are supported.
- Yen values are prices stored in item records. They do not prove that an item is stocked in every shop or available in every stage.
- Food effects below are measured in controlled runs that started at 1 HP. The fish-food rule is limited to the sizes tested; the documentation does not establish every edge case.
- Item names and broad lure/fly families were initially cross-referenced with community lists. The two corrected lure labels, `0x11` and `0x1D`, were checked against the ROM name data and the game menu.
- The fly-maker counts describe one observed early-stage shop. They do not prove later shops have no additional options.
- Images in the catalogue are captures from the game. They are included to identify the items and show the observed interface; their underlying rights remain with the respective rights holders. The repository's software/data license does not grant rights to that material.

## Included and excluded material

The research repository contains curated item data, scripts, bilingual findings, and a compact item gallery. It does **not** contain a ROM, patch, emulator/core binary, save state, full manual scans, or gameplay video. External references are linked in the findings so readers can consult their original context.

The legacy notes under `data/stages` and `data/fish-guides` are historical source-guided research. The active fish-location guide instead uses `data/rom-fish-locations.json` and ROM-rendered field maps; no legacy placements or quest claims are imported.

## Historical references

- Original SFC instruction manual scan and page references: [『川のぬし釣り2』 manual](https://gamemanual.midnightmeattrain.com/entry/%E5%B7%9D%E3%81%AE%E3%81%AC%E3%81%97%E9%87%A3%E3%82%8A2), especially printed pages 12–29 for equipment and fishing actions.
- Community item-ID lead, treated as provisional until cross-checked: [SFC 川のぬし釣り2 改造コード](https://roadbikebeginners.com/sfc-kawanonushitsuri2-cheat/).
- First-person gameplay notes about lure use and observed behavior: [Lure fishing](https://note.com/holy_heron2678/n/na12caa0f2974?hl=en), [lures breaking during play](https://note.com/holy_heron2678/n/n433005d8fe08?hl=en), and [stream fishing notes](https://note.com/holy_heron2678/n/nf6dccee118e2?hl=en).
- Community item and location observations: [全道具紹介と入手場所](https://wazap.com/cheat/%E5%85%A8%E9%81%93%E5%85%B7%E7%B4%B9%E4%BB%8B%E3%81%A8%E5%85%A5%E6%89%8B%E5%A0%B4%E6%89%80/177794/).
- Early-shop screenshots and custom-fly interface reference: [SFC 釣魚太郎2 walkthrough](https://evaandmaicy.blogspot.com/2014/11/sfc-2_18.html).

Research snapshot: **4 October 2026**. Corrections and better-supported interpretations are welcome; please include the game version, ROM hash, and evidence for proposed changes.

## General tools and quest items

The [23-tool research index](docs/general-tool-research.md) traces travel and exploration actions, groundbait, basket capacity, postcards and event items. Catalogue cards explain actions and conditions; evidence links show the code consumers and decoded original-ROM text.

## Map and fish browser

Browse the six areas, real ROM terrain sections, and a unique species list in the [Map and fish browser](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/catalogue/maps.html) ([ไทย](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/catalogue/maps.th.html), [日本語](https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/catalogue/maps.ja.html)). Fish portraits mark configured spawn tiles; repeated spawn slots at the same species/coordinate are combined for display. The source data retains all slots, and a displayed point is not a guarantee that an active fish is present.

## Follow fish and equipment links

Fish portraits open a fish profile with confirmed areas and compatible bait, lure and fly bodies. Equipment portraits and names open an item profile with its use, confirmed shop areas, related fly components and compatible fish. Map species buttons say “Focus on map”; portrait links say “Details”. Shared map pins open a species chooser. Return links retain the source page’s filters and map section. All routes are available in Thai, English and Japanese.

See [click-path audit](docs/click-path-audit.md) for the checked routes and reproduction command.

## Frontend development and publishing gate

The public site is generated from the authored modules, CSS and templates under `src/`. Edit those source files, rather than the generated files under `catalogue/` or `research/`. Install the pinned tools with `npm ci`, rebuild intentionally with `npm run build:frontend`, then run `npm run check`.

The aggregate check must pass before committing a release or publishing. It checks the FSD import boundaries and public APIs, import cycles, formatting, physical file/function limits, lint, publication contents, reproducible generated output, and existing navigation/data regressions. Application source is limited to 500 physical lines per file and 50 per function, including callbacks. Generated bundles and preserved research data are inspected separately rather than shortened to fit source limits.

An automated pass must also be followed by a desktop and mobile browser review of the affected workflows. See [the redesign checks and browser evidence](docs/redesign-qa.md) for the exact scope and unresolved research limits.
