# Fish locations decoded from the original ROM

This file documents fish spawn positions taken directly from the user-supplied, headerless Japanese SFC ROM. It does not use the older third-party map-placement files in `data/fish-guides/`. The extracted data is [`rom-fish-locations.json`](../data/rom-fish-locations.json); regenerate it with [`extract_rom_fish_locations.py`](../scripts/extract_rom_fish_locations.py). The extractor checks the ROM's exact size and SHA-1 and writes no ROM bytes.

## What the ROM stores

The ROM contains six area sets, each with three parallel tables of 256 little-endian 16-bit entries: fish-profile ID, X coordinate, and Y coordinate.

| Map set | Fish ID table | X table | Y table |
| --- | --- | --- | --- |
| 01 | `$0C:C800` (`0x064800`) | `$0C:D400` (`0x065400`) | `$0C:E000` (`0x066000`) |
| 02 | `$0C:CA00` (`0x064A00`) | `$0C:D600` (`0x065600`) | `$0C:E200` (`0x066200`) |
| 03 | `$0C:CC00` (`0x064C00`) | `$0C:D800` (`0x065800`) | `$0C:E400` (`0x066400`) |
| 04 | `$0C:CE00` (`0x064E00`) | `$0C:DA00` (`0x065A00`) | `$0C:E600` (`0x066600`) |
| 05 | `$0C:D000` (`0x065000`) | `$0C:DC00` (`0x065C00`) | `$0C:E800` (`0x066800`) |
| 06 | `$0C:D200` (`0x065200`) | `$0C:DE00` (`0x065E00`) | `$0C:EA00` (`0x066A00`) |

The game indexes the fish ID, X, and Y fields together. At `$04:C334`, it selects a candidate row, skips it when the per-row population value in `$7F:1E8A` is zero, and reads the X/Y entries from `$7F:0306` and `$7F:0F06`. `$04:C369` reads the fish ID for that row from `$0C:C800`, loads the profile through `$03:8042`, and creates the fish object at the selected X/Y. A selector routine at `$01:873C..$01:8781` dispatches internal selectors `$07..$0C` to the six fish-ID table blocks in order. The selector routine at `$03:8393..$03:83EA` initializes or increments the corresponding per-row population values from the fish profile; a value of zero makes `$04:C334` skip that configured point.

The coordinates are 16-pixel map tiles. The fishing target path at `$04:E80C..$04:E824` (file `0x02680C..0x026824`) adds 8 to the player's pixel coordinates and shifts right four times before comparing them with fish-object coordinates. The field setup at `$00:9A82..$00:9A99` (file `0x001A82..0x001A99`) also converts the player's tile coordinates in `$085C/$085E` to world-pixel coordinates in `$0500/$0502` by shifting each value left four bits. The camera clamp at `$00:B65B..$00:B695` (file `0x00365B..0x003695`) subtracts a 120-pixel horizontal and 104-pixel vertical center offset, then clamps the result to area-specific scroll bounds. Field drawing uses world position minus this scroll offset, so tile `(x,y)` corresponds to world pixel `(16x,16y)` before the viewport offset is applied.

## Field-area layout and loader

The ROM has a separate gameplay field layout for each of the six table sets. In the area-1-through-6 path, `$00:844F` (file `0x00044F`) selects the area from `$085A`; `$00:8472` (file `0x000472`) loads the matching compressed area block when it differs from cached area `$04F4`, using the pointer table at `$00:874A` (file `0x00074A`). The block is decompressed to `$7E:2000`, and the loader sets three layer pointers beginning at `$7E:2300`, `$7E:3B02`, and `$7E:5304`. `$00:87D0` (file `0x0007D0`) reads the selected layout header through `$020A` and derives the wrapping masks and row stride used while drawing the field.

The main field dispatcher at `$00:8000` (file `0x000000`) uses `$0834` as its state. Its field-setup state (`$0834=1`) runs `$00:8072` (file `0x000072`), which calls `$00:844F`, `$00:9AA9` (file `0x001AA9`), `$00:9769` (file `0x001769`), `$03:D4CF` (file `0x01D4CF`), `$00:87D0`, and `$00:8A4E` (file `0x000A4E`), then sets `$0834=2`. This is why changing `$085A` alone can leave the previous area's cached layout on screen. Emulator captures of all six selected areas reached `$0834=2` and had `$04F4` matching `$085A`; the descriptor headers and runtime masks were:

The ROM also has a stage-specific graphics loader at `$00:8734` (file `0x000734`). It selects a stream through the pointer table at `$00:8746` using the area in `$085A` and uploads it to VRAM word `$2200` (byte offset `0x4400`). This graphics load is separate from `$00:8472` loading the area's field layout.

For valid captures, the area-cycle debug branch at `$00:80C4` (file `0x0000C4`) must run before field setup. It reaches `$00:8B0C` (file `0x000B0C`), which forces the display blank and disables NMI during the graphics transfer. The reproducible capture primes `$7E:1348=0x8A80` and `$7E:134A=0`, holds B+Up+Left+A for three frames, then holds B+Start+Up+Left+A until the field dispatcher reaches `$0834=1`. The capture writes the requested player tile, world-pixel position, and camera before allowing the ROM's field setup to finish at `$0834=2`. Repeating this ROM path advances through areas 1–6. The debug path is a research capture method, not a normal area-selection menu.

The stage-6 capture provides a direct authenticity check. A probe that wrote `$0834=1` with NMI active had the correct stage ID, descriptor `04 04`, full field-layout bytes, and BG map/character-base registers, but its VRAM graphics differed from the ROM area-cycle capture at byte ranges `0x4400–0x5FFF`, `0x6000–0x7FFF`, and `0x8000–0x9FFF`. Its core screenshot showed repeated blue glyph-like columns. The area-cycle capture loads the stage graphics and renders the clean stage-6 river scene. Therefore the earlier patterned captures were invalid graphics states, even though their stage IDs and map geometry looked correct.

| Map set | Header at `$7E:2300` | Tile dimensions | X wrap mask `$024C` | Y wrap mask `$024E` | Row stride `$0250` |
| --- | --- | ---: | ---: | ---: | ---: |
| 01 | `01 10` | 16 × 256 | `0x000F` | `0x00FF` | 16 |
| 02 | `08 02` | 128 × 32 | `0x007F` | `0x001F` | 128 |
| 03 | `02 08` | 32 × 128 | `0x001F` | `0x007F` | 32 |
| 04 | `04 04` | 64 × 64 | `0x003F` | `0x003F` | 64 |
| 05 | `08 02` | 128 × 32 | `0x007F` | `0x001F` | 128 |
| 06 | `04 04` | 64 × 64 | `0x003F` | `0x003F` | 64 |

Each map descriptor is read after the area-cycle branch has loaded that area's graphics and layout and the dispatcher reaches `$0834=2`. Two neutral frames are then allowed for the PPU viewport scroll to settle before capturing terrain. This is a ROM-backed research capture path; it is not a claim that ordinary gameplay exposes a direct area-select menu.

The field-map capture states are not live fishing scenes. Their active fish-object coordinate buffers retain the stage-1 runtime values, so the captures verify terrain and tile geometry only. Fish positions for all six sets come from the parallel ROM tables listed above, not from treating these buffers as six independent live-spawn captures. Each full map is stitched from multiple captures; animated water can appear at different scroll phases between capture windows and leave visible seams. Those phase changes are animation timing, not changes to the ROM tile coordinates.

As a direct runtime cross-check, all 256 X words and all 256 Y words in the stage-1 field capture matched ROM offsets `0x065400` and `0x066000` byte-for-byte. These are configured spawn tiles, not a promise that every row has an active fish at all times; per-row population values can be zero. They also describe the selected fish object's spawn location, not its later movement during the fight.

## Example: first map set

At row index 0, the first set pairs fish ID `01` (the ROM profile name `イワナ`) with tile `(3, 24)`. Row 1 pairs fish ID `44` (`イモリ`) with `(5, 42)`. Row 12 pairs fish ID `09` (`カワマス`) with `(4, 56)`. These IDs and Japanese names come from the ROM profile records; the X/Y values come from the parallel location tables.

Every row is retained in the JSON. Repeated coordinates are not silently deduplicated because several spawn slots can share a tile and that repetition may affect how frequently the game selects that point. The map number is the ROM table order. The in-game Fishing Notebook shows six overview pages in that same area order: `渓流`, `山上湖`, `清流`, `湖`, `下流`, and `河口`. The stage-1 runtime capture ties the first page (`渓流`) to map set 01: it displays `$085A=01` while the field's X/Y arrays match set 01. The dispatcher at `$01:873C..$01:8781` (file `0x00873C..0x008781`) selects the six spawn tables for internal selectors `$07..$0C`, and `$03:80C7..$03:80E3` (file `0x0180C7..0x0180E3`) normalizes selectors above 6 by subtracting 6 before indexing its six-area table.

The Notebook picture is not itself a coordinate grid with a verified fish-pin projection. In the captured first page, `$084E=03`; `$02:8004` (file `0x010004`) dispatches that renderer selection to `$02:854E` (file `0x01054E`), which parses screen/tile data starting at `$02:B354` (file `0x013354`) through `$02:CFE3` (file `0x014FE3`). This render path does not read the fish spawn coordinate tables. Therefore the authentic Notebook overview images are useful as area references, but pinning a fish tile onto one by scaling table bounds would be an unsupported guess. Pin placement needs a map built from the ROM's gameplay world layout, or another ROM-backed coordinate-to-image mapping.

## Evidence limits

This establishes the fish profile and map-tile coordinate that the game associates with each spawn-table row. It does not claim a metric/world-distance unit. Fish acceptance and successful landing remain separate mechanics. The Notebook's Japanese area labels are preserved as shown in the original-ROM runtime; English and Thai labels are translations. The Fishing Notebook artwork-to-spawn-coordinate transform remains unresolved. The published terrain maps instead use the verified gameplay tile projection: each spawn tile is placed at its center, world pixel `(16x + 8, 16y + 8)`.
