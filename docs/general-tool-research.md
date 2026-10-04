# General tools and quest items: original-ROM research

This page links the use of all 23 general-tool records to the supplied Japanese ROM. No external walkthrough is evidence for the effects below. English and Thai explanations are translations of the traced behavior and decoded game text.

ROM: 1,572,864 bytes, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`.

## Research groups

- [Travel, exploration, notebook and sound](general-tool-actions-research.md): IDs `01–05`, `0E`, `13–14`.
- [Groundbait and fish baskets](chum-basket-research.md): IDs `08–0D`.
- [Postcards, milk, lottery and event items](quest-tool-use-research.md): IDs `06–07`, `0F–12`, `15–17`.

The catalogue shows an action and its effects first. Addresses, flags and any narrower unresolved questions remain in the expandable evidence and these research notes. A description message alone does not establish a gameplay effect; separate NPC/event consumers are traced where applicable.

## Why separate consumers matter

- Selecting a key only displays its description; the town chest routine is what checks possession and opens locked chests.
- Selecting an empty milk bottle only displays its description; the area-3 cow interaction replaces it with milk. Drinking the milk restores maximum HP and returns the bottle. The canoe maker has a separate milk-for-canoe exchange.
- Selecting a lottery ticket only displays its description; the area-5 drawing counter consumes it and executes the prize logic. Jizo food offerings change the threshold used by that logic.
- Groundbait IDs `08`, `09`, `0A` are successive remaining-use states. Fish movement toward the chosen point is a different consumer from the item menu.

These examples explain why an item-table dump or its selected-use message alone was insufficient for a practical guide.

## Reproduce the source index and message images

```sh
python3 scripts/extract_general_tool_code.py --rom /path/to/game.sfc --output /tmp/general-tool-code-index.json
python3 scripts/render_rom_messages.py --rom /path/to/game.sfc --messages 168,16A,16E,170,172,322,324,326,328,32A --output /tmp/tool-messages.png
python3 scripts/build_tool_use_locations.py --rom /path/to/game.sfc
python3 scripts/build_item_use.py
node scripts/build_catalogue.cjs
```

The source-index extractor reads each tool record and the selected-use dispatcher at `03:BC4A..BD2E`. It is an evidence index, not a simulation of every consumer. Message IDs in the rendering command are hexadecimal byte offsets in the pointer table, not ordinal message numbers. The renderer decodes ROM font graphics; control substitutions are shown as labels and are not emulated. It requires Pillow. The ROM is read locally and is not distributed.

![Messages decoded directly from the original ROM font](../examples/general-tool-rom-messages.png)

This image is a direct rendering of text and font data from the original ROM, not an emulator screenshot. It includes milk, the empty bottle, lottery-ticket, candle and key descriptions, plus lottery prize messages. [Machine-readable selected-use index](../data/general-tool-code-index.json).

## Tool-use maps

Seven event locations across seven item cards use NPC coordinates read from the original ROM object pointer table at `00:BD76`, with traced consumers identifying the interaction. Crops come from the existing original-ROM field renders; item icons mark the interaction point. The fireworks rectangle is read from `03:C63A..C65E` (X 31–33, Y 42–43). NPC coordinates are their initial positions; the fox can move after its quest has finished. Interior chest coordinates are described separately and are not placed on outdoor terrain. [Location data](../data/tool-use-locations.json).

## Practical follow-up audit

The later [player-value audit](player-value-audit.md) adds [purchase areas for all six stocks](shop-stock-research.md), [30 example magnifying-glass context tiles](forage-location-research.md) with bait icons on ROM terrain, and the [tub/canoe movement difference](boat-movement-research.md). The [food consumer trace](food-practical-research.md) also corrects the basket advice: eating consumes the first stored fish, and Kusafugu sets HP to zero.
