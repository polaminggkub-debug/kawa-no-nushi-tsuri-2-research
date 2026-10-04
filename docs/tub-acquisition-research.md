# Tub acquisition: Area 2 Hariyo exchange

This trace uses the supplied original Japanese SFC ROM (1,572,864 bytes; SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`). It identifies the tub maker and exchange from the ROM's object-coordinate table, event handler, item-grant routine, and Japanese dialogue. No outside walkthrough is used as evidence.

## What to do in the game

In Area 2, bring a Hariyo (`ハリヨ`, fish ID `22`) to the tub maker at field tile **(87,27)**. Before talking, leave at least one general-tool inventory slot empty. The exchange consumes the fish and grants the tub (`タライ`, general-tool ID `01`).

The fish profile lists bait IDs `07` and `08` as compatible, and the ROM-derived location table has 19 Hariyo spawn entries on map set 02. Those records identify game data; this research did not run a natural catch attempt or establish a catch rate. See [fish locations](../data/rom-fish-locations.json) and [fish acceptance](../data/fish-acceptance.json).

The free-slot warning matters because the handler removes the fish before it attempts to add the tub. A controlled full-inventory run consumed fish ID `22`, granted no tub, and left the exchange flag unset. Make room first.

## ROM trace

The Stage 2 object pointer-table entry is at file `0x003D78` (`00:BD78`) and resolves to `00:BE3E`. Object slot `22` has X value `87` at `00:BE72` / file `0x003E72`; the following slot `23` word supplies Y value `27` at `00:BE74` / file `0x003E74`.

The event handler at `00:C7B2..C7FF` compares the active object slot with `22`. If story flag `7E:0C1A` mask `0x10` is already set, it takes the already-complete message branch. Otherwise it requests fish ID `22` in `7E:11E8` and calls the remover at `00:C641..C67E`. A missing fish shows message `0x02A0`; on a match, the remover removes that fish and shifts later fish IDs and sizes down.

After the removal, the handler selects general-tool ID `01` in `7E:1294` and calls the grant routine at `00:D1D4..D207`. The routine scans 16 general-tool slots at `7E:0B5A..0B78` and stores the tub in the first empty slot. It checks the last slot `7E:0B78` first; when that slot is occupied, it shows full-inventory message `0x0196` and returns status `1`. The caller treats status `1` as failure, so it skips the story-flag write and success message. If the tool already exists, the grant routine returns duplicate status `2`; the caller treats that as a completed exchange but does not insert another copy.

For a successful new grant, the handler sets bit `0x10` in `7E:0C1A` and shows message `0x02A2`. The ROM dialogue `0x02A0` identifies the speaker as the old man who makes tubs and asks for a Hariyo fish print; `0x02A2` says to take the carefully made tub. Message `0x02A4` is the already-complete branch.

## Controlled runtime checks

The supplied Japanese ROM was run in the local Snes9x libretro harness. For the success probe, a private Area 2 state was positioned at slot `22`, tile `(87,27)`, then fish ID `22` and size `0x20` were inserted into keepnet slot 0. After the talk/action input, the fish slot cleared, tool slot `7E:0B5E` held ID `01`, and `7E:0C1A` became `0x10`.

The no-fish control showed the request dialogue and left the tool inventory and flag unchanged. The full-inventory control filled all 16 tool slots with IDs `02` through `11` (so no tub was already owned), then injected fish ID `22`. The game showed the full-inventory message, cleared the fish slot, granted no tub, and left the flag at zero. Emulator states and captures remain private and are not included in the publication.

These probes use injected fish inventory. They verify the exchange handler and the full-inventory outcome, not a natural fishing session or how to catch Hariyo.

The machine-readable trace is in [tub-acquisition.json](../data/tub-acquisition.json). The location image and projection data are generated from the verified ROM terrain crop by `scripts/build_tub_location.py`.
