#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extract the named fish sprites directly from the supplied Japanese ROM.

The tool writes only the first native 128x64 sprite frame for each named fish
profile, and replaces the image provenance in catalogue/fish-visuals.json.
It does not distribute or modify the ROM.
"""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image


ROM_SIZE = 1_572_864
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
GRAPHICS_TABLE = 0x023B0C
GRAPHICS_STRIDE = 8
PROFILE_COUNT = 0x49
FRAME_BYTES = 0x1000
FRAME_WIDTH = 128
FRAME_HEIGHT = 64
FRAME_TILES_WIDE = FRAME_WIDTH // 8
FRAME_TILE_COUNT = FRAME_TILES_WIDE * (FRAME_HEIGHT // 8)
PALETTE_BASE = 0x03E200
PALETTE_STRIDE = 0x40
UNRESOLVED_PROFILE_ID = 0x43
PUBLICATION_ROOT = Path(__file__).resolve().parents[1]


def read_u16(data, offset):
    return int.from_bytes(data[offset:offset + 2], "little")


def lorom_file_offset(pointer):
    """Convert a 24-bit LoROM bank:address pointer to a headerless file offset."""
    bank = (pointer >> 16) & 0xFF
    address = pointer & 0xFFFF
    if address < 0x8000:
        raise ValueError(f"Not a ROM-space LoROM pointer: ${bank:02X}:{address:04X}")
    return (bank & 0x7F) * 0x8000 + (address & 0x7FFF)


def pointer_label(pointer):
    return f"{(pointer >> 16) & 0xFF:02X}:{pointer & 0xFFFF:04X}"


def decode_stream(block, profile_id):
    """Decode the ROM's length-prefixed, LSB-flagged literal/back-reference stream."""
    if len(block) < 3:
        raise ValueError(f"Profile {profile_id:02X}: compressed block is too short")
    expected_size = read_u16(block, 0)
    if expected_size < FRAME_BYTES or expected_size % FRAME_BYTES:
        raise ValueError(
            f"Profile {profile_id:02X}: unexpected decoded byte count 0x{expected_size:X}"
        )

    output = bytearray()
    cursor = 2

    def take_byte():
        nonlocal cursor
        if cursor >= len(block):
            raise ValueError(f"Profile {profile_id:02X}: truncated compressed stream")
        value = block[cursor]
        cursor += 1
        return value

    while len(output) < expected_size:
        flags = take_byte()
        for bit in range(8):
            if len(output) >= expected_size:
                break
            if flags & (1 << bit):
                output.append(take_byte())
                continue

            first = take_byte()
            second = take_byte()
            length = (second & 0x0F) + 3
            window_index = first + ((second >> 4) << 8)
            distance = (len(output) - window_index) & 0x0FFF
            if distance == 0:
                raise ValueError(
                    f"Profile {profile_id:02X}: zero-distance back-reference is unsupported"
                )
            if distance > len(output):
                raise ValueError(
                    f"Profile {profile_id:02X}: invalid back-reference at output 0x{len(output):X}"
                )
            for _ in range(min(length, expected_size - len(output))):
                output.append(output[-distance])

    return bytes(output), cursor


def read_palette(rom, profile_id):
    palette_offset = PALETTE_BASE + (profile_id - 1) * PALETTE_STRIDE
    colors = []
    for index in range(16):
        value = read_u16(rom, palette_offset + index * 2)
        red = value & 0x1F
        green = (value >> 5) & 0x1F
        blue = (value >> 10) & 0x1F
        scale = lambda component: (component << 3) | (component >> 2)
        alpha = 0 if index == 0 else 255
        colors.append((scale(red), scale(green), scale(blue), alpha))
    return palette_offset, colors


def render_frame(frame, palette, profile_id):
    if len(frame) != FRAME_BYTES:
        raise ValueError(f"Profile {profile_id:02X}: frame must be exactly 0x1000 bytes")

    rgba = bytearray(FRAME_WIDTH * FRAME_HEIGHT * 4)
    for tile_index in range(FRAME_TILE_COUNT):
        tile_x = tile_index % FRAME_TILES_WIDE
        tile_y = tile_index // FRAME_TILES_WIDE
        tile_offset = tile_index * 32
        for y in range(8):
            plane0 = frame[tile_offset + y * 2]
            plane1 = frame[tile_offset + y * 2 + 1]
            plane2 = frame[tile_offset + 16 + y * 2]
            plane3 = frame[tile_offset + 17 + y * 2]
            for x in range(8):
                bit = 7 - x
                color_index = (
                    ((plane0 >> bit) & 1)
                    | (((plane1 >> bit) & 1) << 1)
                    | (((plane2 >> bit) & 1) << 2)
                    | (((plane3 >> bit) & 1) << 3)
                )
                pixel = palette[color_index]
                px = tile_x * 8 + x
                py = tile_y * 8 + y
                index = (py * FRAME_WIDTH + px) * 4
                rgba[index:index + 4] = bytes(pixel)
    return Image.frombytes("RGBA", (FRAME_WIDTH, FRAME_HEIGHT), bytes(rgba))


def sprite_source(profile_id, row_offset, start_pointer, second_pointer,
                  start_offset, second_offset, consumed_bytes, palette_offset):
    palette_pointer = 0x07E200 + (profile_id - 1) * PALETTE_STRIDE
    return {
        "type": "rom_extracted_sprite",
        "romSha1": ROM_SHA1,
        "profileId": f"{profile_id:02X}",
        "graphicsTable": {
            "cpuAddress": "04:BB0C",
            "fileOffset": "0x023B0C",
            "rowFileOffset": f"0x{row_offset:06X}",
            "rowStrideBytes": GRAPHICS_STRIDE,
            "startPointer": pointer_label(start_pointer),
            "startFileOffset": f"0x{start_offset:06X}",
            "secondPointer": pointer_label(second_pointer),
            "secondPointerFileOffset": f"0x{second_offset:06X}",
            "firstStreamBoundary": {
                "fileOffset": f"0x{second_offset:06X}",
                "meaning": "second animation stream pointer; observed exclusive end of the first stream",
            },
            "firstStreamBytesConsumed": consumed_bytes,
            "firstStreamCompressedEndFileOffset": f"0x{start_offset + consumed_bytes:06X}",
        },
        "decodedFrame": {
            "frameIndex": 0,
            "frameSizePixels": [FRAME_WIDTH, FRAME_HEIGHT],
            "sourceFrameCount": 2,
            "format": "SNES 4bpp planar 8x8 tiles; 16 columns by 8 rows",
            "orientation": "native ROM sprite orientation; no horizontal flip",
            "transparentColorIndex": 0,
        },
        "palette": {
            "cpuAddress": pointer_label(palette_pointer),
            "fileOffset": f"0x{palette_offset:06X}",
            "bytesPerProfile": PALETTE_STRIDE,
            "format": "BGR555",
            "selectedColors": "first 16 colors (normal sprite path)",
            "transparentColorIndex": 0,
        },
        "description": (
            "First 128x64 sprite frame decoded from this fish profile's original-ROM "
            "graphics. This is a sprite extraction, not a screenshot or a reconstruction "
            "of the fish-record page."
        ),
    }


def extract(rom, manifest_path, output_dir):
    digest = hashlib.sha1(rom).hexdigest()
    if len(rom) != ROM_SIZE or digest != ROM_SHA1:
        raise ValueError(
            "Requires the matching headerless Japanese original ROM "
            f"({ROM_SIZE} bytes; SHA-1 {ROM_SHA1})."
        )

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    fish = manifest.get("fish")
    expected_ids = {f"{profile_id:02X}" for profile_id in range(1, PROFILE_COUNT + 1)}
    if not isinstance(fish, dict) or set(fish) != expected_ids:
        raise ValueError("The fish manifest must contain profile IDs 01 through 49.")

    output_dir.mkdir(parents=True, exist_ok=True)
    manifest["scope"] = (
        "The ROM contains 73 fish-profile IDs. Sprite assets are extracted directly "
        "from the original Japanese ROM for the 72 profiles with a decoded species name; "
        "profile 0x43 remains unassigned because its ROM name glyph is unresolved."
    )
    manifest["imageNote"] = (
        "Each image is the first native 128x64 sprite frame decoded from the original "
        "Japanese ROM's per-profile graphics, using its normal 16-color BGR555 palette. "
        "These are sprite extractions, not screenshots or exact reproductions of the "
        "fish-record page."
    )
    manifest["imageExtraction"] = {
        "rom": {"sizeBytes": len(rom), "sha1": digest},
        "graphicsTable": {
            "cpuAddress": "04:BB0C",
            "fileOffset": "0x023B0C",
            "rowStrideBytes": GRAPHICS_STRIDE,
            "profileCount": PROFILE_COUNT,
            "rowFormat": "24-bit first-animation pointer, padding byte, 24-bit second-animation pointer, padding byte",
            "pointerUse": "The second pointer starts a separate animation stream and exactly bounds the first stream in all 72 named profiles.",
        },
        "decompression": {
            "cpuAddress": "00:E5C2",
            "format": "16-bit little-endian decoded size, then LSB-first literal/back-reference flags",
            "backReference": "length=(second byte & 0x0F)+3; 12-bit rolling-window reference; overlapping copy",
            "zeroDistance": "not observed in the 72 named profiles; rejected by the extractor",
            "decodedBytesPerProfile": 8192,
        },
        "frame": {
            "selectedIndex": 0,
            "sizePixels": [FRAME_WIDTH, FRAME_HEIGHT],
            "bytes": FRAME_BYTES,
            "format": "4bpp planar SNES 8x8 tiles, arranged 16 by 8",
            "orientation": "native ROM sprite orientation; no horizontal flip",
            "transparentColorIndex": 0,
        },
        "normalPalette": {
            "cpuAddress": "07:E200",
            "fileOffset": "0x03E200",
            "strideBytes": PALETTE_STRIDE,
            "selectedBytesPerProfile": 32,
            "format": "16 BGR555 colors; color index 0 is transparent",
            "conditionalVariant": (
                "The ROM has a second 16-color half used only by a conditional branch. "
                "The exact selector semantics are unresolved; catalogue assets use the "
                "first 16-color normal palette."
            ),
        },
        "assetCount": 72,
        "unassignedProfileId": "43",
    }

    written = 0
    for profile_id in range(1, PROFILE_COUNT + 1):
        key = f"{profile_id:02X}"
        row_offset = GRAPHICS_TABLE + (profile_id - 1) * GRAPHICS_STRIDE
        row = rom[row_offset:row_offset + GRAPHICS_STRIDE]
        if len(row) != GRAPHICS_STRIDE:
            raise ValueError(f"Profile {key}: graphics table row is truncated")
        start_pointer = int.from_bytes(row[0:3], "little")
        second_pointer = int.from_bytes(row[4:7], "little")
        item = fish[key]
        if profile_id == UNRESOLVED_PROFILE_ID:
            item["image"] = None
            item["imageSource"] = None
            item["noImageReason"] = (
                "This profile has no sprite pointer, and its ROM species-name glyph is "
                "unresolved, so no image is assigned."
            )
            continue

        start_offset = lorom_file_offset(start_pointer)
        second_offset = lorom_file_offset(second_pointer)
        if not start_offset < second_offset <= len(rom):
            raise ValueError(f"Profile {key}: invalid compressed source bounds")

        if not item.get("nameJa"):
            raise ValueError(f"Profile {key}: refusing to assign art without a decoded ROM name")

        decoded, consumed_bytes = decode_stream(rom[start_offset:second_offset], profile_id)
        if start_offset + consumed_bytes != second_offset:
            raise ValueError(f"Profile {key}: first stream does not end at its second-animation pointer")
        if len(decoded) != 0x2000:
            raise ValueError(
                f"Profile {key}: expected two 0x1000-byte frames, got 0x{len(decoded):X}"
            )
        palette_offset, palette = read_palette(rom, profile_id)
        image = render_frame(decoded[:FRAME_BYTES], palette, profile_id)
        image_path = output_dir / f"rom-{key}.png"
        image.save(image_path, format="PNG", optimize=True)

        item["image"] = f"fish/rom-{key}.png"
        item["imageSource"] = sprite_source(
            profile_id, row_offset, start_pointer, second_pointer,
            start_offset, second_offset, consumed_bytes, palette_offset,
        )
        item["noImageReason"] = None
        written += 1

    temp_path = manifest_path.with_suffix(manifest_path.suffix + ".tmp")
    temp_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temp_path.replace(manifest_path)
    return written


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("rom", type=Path, help="Path to the supplied Japanese .sfc ROM")
    parser.add_argument(
        "--manifest", type=Path,
        default=PUBLICATION_ROOT / "catalogue/fish-visuals.json",
        help="Fish manifest to update (defaults to the publication catalogue)",
    )
    parser.add_argument(
        "--output-dir", type=Path,
        default=PUBLICATION_ROOT / "catalogue/fish",
        help="Directory for rom-NN.png assets (defaults to the publication catalogue)",
    )
    args = parser.parse_args()
    count = extract(args.rom.read_bytes(), args.manifest, args.output_dir)
    print(f"Wrote {count} ROM-derived fish sprites and updated {args.manifest}.")


if __name__ == "__main__":
    main()
