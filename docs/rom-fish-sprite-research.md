# Fish sprite extraction from the original ROM

This note documents the 72 named fish images in `catalogue/fish/rom-NN.png` and the extraction script that creates them. The images are decoded sprite frames from the supplied Japanese ROM. They are not crops from gameplay videos, screenshots, or reconstructions of the fish-record page.

## ROM identity

The extractor accepts only the headerless Japanese original used for this research:

| Property | Value |
| --- | --- |
| Size | 1,572,864 bytes |
| SHA-1 | `c2103dd94e2a1a65a495fc02adc2e7d040f31212` |

The ROM itself is not part of the publication.

## Species ID to sprite data

The fish graphics pointer table begins at CPU address `$04:BB0C`, file offset `0x023B0C`. It has 73 rows with an 8-byte stride. Each row contains a 24-bit first-animation pointer, one padding byte, a 24-bit second-animation pointer, then another padding byte. Profile ID 1 uses row 1; the renderer at `$01:93E6` uses the active profile ID from WRAM `$11E8`, indexes `(ID - 1) * 8`, and loads that row's graphics.

For profile ID `0x01`, the row is `9F 9F 14 00 5D A9 14 00`: first-animation pointer `$14:9F9F` at file offset `0x0A1F9F`, second-animation pointer `$14:A95D` at `0x0A295D`. The second pointer starts a separate animation stream and exactly bounds the first stream in all 72 named profiles. For ID `0x01`, the decompressor consumes 2,494 bytes from `0x0A1F9F` through the exclusive boundary `0x0A295D`. The renderer decompresses the source to `$7F:C000` and places the result as 16-by-16-pixel tiles. The low-level decompressor is at `$00:E5C2` (file offset `0x0065C2`).

Table row 67, profile ID `0x43`, has zero pointers. Its name is also unresolved in the ROM text decode, so the extractor leaves it without an assigned image. It creates assets for the other 72 named profiles.

## Decompression and frame layout

Each named profile's compressed stream begins with a 16-bit little-endian decoded-size field. The output is 8,192 bytes: two 4,096-byte frames. The remaining stream uses LSB-first flag bits: a set bit copies one literal byte; a clear bit reads a two-byte back-reference. The back-reference length is `(second byte & 0x0F) + 3`; its address is a 12-bit rolling-window reference and copies may overlap. The extractor rejects a zero-distance reference. None appears in the 72 named profile streams.

Each frame is decoded as SNES 4bpp planar 8-by-8 tiles arranged in 16 columns and 8 rows, producing a 128-by-64-pixel image. The catalogue uses frame 0 in the ROM's native orientation; the fish face right. Palette color index 0 is transparent.

## Palette selection

The palette loader at `$04:B76F`–`$04:B7AF` (file offsets `0x02376F`–`0x0237AF`) calculates a per-profile palette pointer from `$07:E200` (file offset `0x03E200`) with a `0x40`-byte stride. Each profile has 32 BGR555 colors. The ordinary 16-color sprite path transfers the first 32 bytes; the extractor converts these first 16 colors to RGBA and marks index 0 transparent. The ordinary portrait caller is `$01:D397`; the transfer setup at `$01:D45D` and `$01:D476` selects 16 colors.

The ROM has a conditional path that selects the second 16-color half. It checks `$0C18` bit 0 and specific pairs of the `$0860` selector and fish ID: `(1, 0x37)`, `(2, 0x39)`, `(3, 0x26)`, `(4, 0x0D)`. The selector's meaning is unresolved. Those conditional colors are not used for the catalogue's normal sprite images.

## Recreate the assets

Run from the project directory with Python 3 and Pillow installed:

```sh
python3 publication/scripts/extract_rom_fish_portraits.py /path/to/Kawa-no-Nushi-Tsuri-2-Japan.sfc
```

The extractor verifies ROM size and SHA-1, writes 72 `catalogue/fish/rom-NN.png` files, and updates `catalogue/fish-visuals.json` with each image's profile ID, source-table row, compressed pointers, palette location, frame layout, and transparency rule. To choose other destinations, pass `--manifest PATH` and `--output-dir PATH`.
