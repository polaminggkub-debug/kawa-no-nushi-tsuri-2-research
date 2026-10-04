#!/usr/bin/env python3
"""Reproduce maker table filters and quote from the supplied original ROM.

This does not emulate menu navigation or prove every matching record selectable.
The inventory/selection control-flow interpretation is documented separately.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHA1 = 'c2103dd94e2a1a65a495fc02adc2e7d040f31212'
BASE = 0x2AA52
STRIDE = 11


def record(rom, numeric_id):
    start = BASE + (numeric_id - 1) * STRIDE
    return rom[start:start + STRIDE]


def filtered_ids(rom, family, part):
    return [f'{i:02X}' for i in range(1, 0x87)
            if record(rom, i)[:2] == bytes([family, part])]


def verify(rom, evidence):
    if len(rom) != 1572864 or hashlib.sha1(rom).hexdigest() != SHA1:
        raise ValueError('Expected the specified original headerless Japanese ROM')
    result = {'romSha1': SHA1, 'family00ROMRecords': {}}
    for part in range(3):
        ids = filtered_ids(rom, 0, part)
        expected = evidence['parts'][str(part)]
        if ids != expected['family00IDs'] or len(ids) != expected['count']:
            raise ValueError(f'Part {part} differs from recorded table evidence')
        result['family00ROMRecords'][str(part)] = ids
    prices = {}
    combination = evidence['defaultFirstMayflyCombination']
    for part, item_id in combination['ids'].items():
        prices[part] = int.from_bytes(record(rom, int(item_id, 16))[9:11], 'little')
    if prices != combination['componentYen']:
        raise ValueError('Component quote fields differ from recorded evidence')
    if sum(prices.values()) != combination['calculatedQuoteYen']:
        raise ValueError('Calculated example quote differs')
    result['exampleComponentYen'] = prices
    result['exampleQuoteYen'] = sum(prices.values())
    result['scope'] = 'ROM filter rows and price fields; no runtime sprite/navigation proof'
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--rom', type=Path, required=True)
    args = parser.parse_args()
    evidence = json.loads((ROOT / 'data/fly-maker-menu-trace.json').read_text())
    print(json.dumps(verify(args.rom.read_bytes(), evidence), indent=2))


if __name__ == '__main__':
    main()
