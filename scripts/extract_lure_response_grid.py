#!/usr/bin/env python3
"""Reproduce 48 controlled original-ROM fight-setup branch executions.

This is not a complete fishing simulation or a landing-rate experiment.
"""
import argparse
import hashlib
import json
from pathlib import Path
from trace_lure_fight_setup import SHA1, lure_setup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--rom', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    rom = args.rom.read_bytes()
    if len(rom) != 1572864 or hashlib.sha1(rom).hexdigest() != SHA1:
        parser.error('Requires the matching headerless Japanese original supplied by you.')
    fish_id = 6
    base_mask = rom[0x28018 + (fish_id - 1) * 23 + 10]
    result = {
        'schema_version': 1, 'rom_sha1': SHA1,
        'scope': 'Restricted original-ROM branch executions with controlled inputs; not complete catches or strength rankings.',
        'fish_id_hex': '06', 'fish_name_ja': 'ニジマス', 'base_mask': base_mask,
        'sizes_note': 'Boundary probes 15/16/35/36 are controlled numerical inputs, not claims of natural encounter sizes.',
        'lure_response_rules': {'0': ['H', 'unchanged', 'G'],
                                '1': ['unchanged', 'H', 'unchanged'],
                                '2': ['G', 'unchanged', 'H']},
        'raw_size_bands': ['<=15', '16..35', '>35'],
        'operations': {'H': 'floor(x/2)', 'G': '(2*x+1)&63'},
        'executions': [lure_setup(rom, rod, lure, fish_id, size, base_mask)
                       for rod in range(0x0A, 0x0E)
                       for lure in [0x17, 0x23, 0x01]
                       for size in [15, 16, 35, 36]],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {len(result["executions"])} branch executions to {args.output}')


if __name__ == '__main__':
    main()
