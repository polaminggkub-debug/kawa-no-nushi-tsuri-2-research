# Daikon acquisition: Stage 3 Yamanokami exchange

This trace uses the supplied original Japanese SFC ROM (1,572,864 bytes; SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`). The guide claim about a rice-field exchange was treated only as a lead; the location and transaction below were found in the ROM's object table and event code.

## Player-facing result

In Stage 3, talk to the field NPC at tile **(21,82)** with a Yamanokami (`18`, `ヤマノカミ`) in the keepnet. The exchange consumes that fish and fills **all 16 food slots with Daikon (`07`, `大根`)**. Existing food is overwritten, including when every slot is already occupied. Use any existing food you want to benefit from before making this one-time exchange, or skip the trade if you want to keep it.

The exchange is one-time per save: once story flag `7E:0C1A` bit 6 is set, the handler takes its already-completed branch. Daikon's separate lottery use is traced in [quest and item-use research](quest-tool-use-research.md): offering it adds 40 to the lottery threshold value, capped at 255; that value is not itself a percentage.

## ROM trace

The Stage 3 object pointer is selected from the pointer table at `00:BD76`. It resolves to `00:BEB2`; object slot `22` has its coordinate record at `00:BEE6`, which decodes to tile `(21,82)`.

The Stage 3 handler at `00:C940..C980` checks that `7E:0C1A` bit 6 is clear, requests fish ID `18` through `7E:11E8`, and calls the fish-removal routine at `00:C641`. On success it sets bit 6, then writes food ID `07` to `7E:0B3A + Y` for `Y = 0,2,...,0x1E`: all 16 two-byte meal entries. This routine contains no free-slot search or capacity check.

The remover at `00:C641..C67E` scans the 30 fish-ID entries at `7E:0B7A..7E:0BB3`. When it finds the requested ID, it shifts later fish IDs and sizes down, clears the final entry, and returns success. If no matching fish is present, it returns failure and the exchange does not set the story flag or grant Daikon.

## Controlled runtime checks

The original ROM was run in the local Snes9x libretro capture harness. The positive probe used a private Stage 3 field state with fish ID `18` and size `0x20` inserted in the first keepnet slot, all 16 meal slots prefilled with distinct IDs `01` through `10`, and story bit 6 clear. After talking to the object at `(21,82)`, the fish entry was removed, the story byte became `0x40`, and every meal slot became `07`.

The negative control started at the same object with an empty keepnet, story bit 6 clear, and existing food IDs `01` and `02`. The handler left both the flag and meal slots unchanged. These runtime checks verify the exchange effects with supplied state; they do **not** prove a natural way to catch or acquire the Yamanokami.

Machine-readable coordinates, addresses, preconditions, and before/after results are in [daikon-acquisition.json](../data/daikon-acquisition.json). ROM and emulator states remain local; no ROM data is included in the publication.

## Reproduce the location artifact

Run `python3 scripts/build_daikon_location.py --rom /path/to/your/original.sfc` with Pillow available. It verifies the ROM SHA-1, NPC coordinate record, fish request/removal call and sixteen-slot reward loop, then verifies the existing terrain PNG against the map manifest before projecting the marker. It creates `data/daikon-location.json` and the authentic terrain crop; it does not run the controlled emulator probe.
