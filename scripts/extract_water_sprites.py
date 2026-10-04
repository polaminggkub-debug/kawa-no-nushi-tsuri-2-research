#!/usr/bin/env python3
"""Extract original water-mark tile pixels from a local matching-ROM SNES state."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

ROM_SHA1 = 'c2103dd94e2a1a65a495fc02adc2e7d040f31212'
SPECS = [('small', 0x6B, 8), ('large', 0x6E, 16), ('bubble', 0x7B, 8)]


def chunks(data):
    if not data.startswith(b'#!s9xsnp:0014\n'):
        raise ValueError('Expected Snes9x version-14 uncompressed state')
    offset = data.index(b'\n') + 1
    result = {}
    while offset < len(data):
        size = int(data[offset + 4:offset + 10])
        result[data[offset:offset + 3].decode()] = data[offset + 11:offset + 11 + size]
        offset += 11 + size
    return result


def colors(ppu):
    result = []
    for index in range(256):
        value = int.from_bytes(ppu[64 + 2 * index:66 + 2 * index], 'big')
        green = (value >> 5) & 31
        result.append(((value & 31) * 255 // 31,
                       ((green << 1) | (green >> 4)) * 255 // 63,
                       ((value >> 10) & 31) * 255 // 31, 255))
    return result


def sprite(vram, palette, tile_id, size):
    output = Image.new('RGBA', (24, 24))
    margin = (24 - size) // 2
    for y in range(size):
        for x in range(size):
            tile = (tile_id + x // 8 + 16 * (y // 8)) & 255
            data = vram[0xC000 + tile * 32:0xC000 + (tile + 1) * 32]
            index = sum(((data[2 * (y % 8) + (plane & 1) + (plane // 2) * 16]
                          >> (7 - x % 8)) & 1) << plane for plane in range(4))
            if index:
                output.putpixel((margin + x, margin + y), palette[240 + index])
    return output


def extract(state, destination):
    raw = state.read_bytes()
    saved = chunks(raw)
    if saved['FIL'][0x2101] != 3:
        raise ValueError('Expected OBJ graphics base 0xC000')
    palette = colors(saved['PPU'])
    destination.mkdir(parents=True, exist_ok=True)
    results = []
    for name, tile_id, size in SPECS:
        image = sprite(saved['VRA'], palette, tile_id, size)
        file = destination / f'water-{name}.png'
        image.save(file)
        results.append({'class': name, 'image': f'images/water-icons/{file.name}',
                        'sha256': hashlib.sha256(file.read_bytes()).hexdigest(),
                        'tileHex': f'{tile_id:02X}', 'nativeSpriteSize': [size, size],
                        'canvasSize': [24, 24], 'opaquePixels': sum(pixel[3] > 0 for pixel in image.getdata())})
    return {'romSha1': ROM_SHA1, 'sourceStateSha256': hashlib.sha256(raw).hexdigest(),
            'sourceVramSha256': hashlib.sha256(saved['VRA']).hexdigest(),
            'method': 'Decode loaded original-ROM 4bpp OBJ tiles at VRAM 0xC000, palette 7; color index 0 transparent. Native pixels centered on a transparent 24px canvas. No redraw or recoloring.',
            'images': results}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--rom', type=Path, required=True)
    parser.add_argument('--state', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    if hashlib.sha1(args.rom.read_bytes()).hexdigest() != ROM_SHA1:
        raise ValueError('ROM does not match the researched Japanese release')
    print(json.dumps(extract(args.state, args.out), indent=2))


if __name__ == '__main__':
    main()
