#!/usr/bin/env python3
"""Extract the 315 item/component records from a user-supplied original ROM.

Only Python's standard library is required. No ROM is downloaded or modified.
The meanings assigned to fields are intentionally limited to traced consumers.
"""
import argparse
import hashlib
import json
from pathlib import Path

EXPECTED_SHA1 = 'c2103dd94e2a1a65a495fc02adc2e7d040f31212'
EXPECTED_SIZE = 1572864
# category: pointer-directory address, expected table address, stride, count,
# price offset, name pointer offset. All addresses refer to CPU bank $05.
TABLES = {
    'rod': (0x800A, 0xA7F5, 12, 21, 10, 8),
    'lure': (0x8008, 0xA1D8, 12, 81, 8, 10),
    'fly_component': (0x800C, 0xAA52, 11, 134, 9, 7),
    'hook': (0x8004, 0xA068, 9, 13, 7, 5),
    'float_sinker': (0x8006, 0xA138, 9, 10, 7, 5),
    'bait': (0x8002, 0x9E67, 12, 23, 8, 10),
    'food': (0x8010, 0xB1DF, 7, 10, 5, 3),
    'tool': (0x8012, 0xB258, 6, 23, 4, 2),
}

def offset(address):
    return 5 * 0x8000 + address - 0x8000

def word(data, position):
    return int.from_bytes(data[position:position + 2], 'little')

def extract(rom):
    digest = hashlib.sha1(rom).hexdigest()
    if len(rom) != EXPECTED_SIZE or digest != EXPECTED_SHA1:
        raise ValueError('This extractor supports only the headerless original Japanese dump. '
                         f'Expected {EXPECTED_SIZE} bytes, SHA-1 {EXPECTED_SHA1}; '
                         f'received {len(rom)} bytes, SHA-1 {digest}.')
    result = {'schema_version': 1, 'rom': {'size_bytes': len(rom), 'sha1': digest,
              'sha256': hashlib.sha256(rom).hexdigest()},
              'scope': 'ROM table records and base prices, not complete gameplay-stat decoding.',
              'categories': {}}
    for category, (directory, base, stride, count, price, name) in TABLES.items():
        actual_base = word(rom, offset(directory))
        if actual_base != base:
            raise ValueError(f'Unexpected table pointer for {category}: {actual_base:04X}')
        records = []
        for index in range(count):
            pos = offset(base) + index * stride
            record = rom[pos:pos + stride]
            entry = {'id_hex': f'{index + 1:02X}', 'file_offset_hex': f'0x{pos:06X}',
                     'raw_bytes': list(record), 'base_price_yen': word(record, price),
                     'name_pointer_hex': f'05:{word(record, name):04X}'}
            if category == 'rod':
                entry.update(style_code=record[0], fight_cutoff_raw=record[2],
                             reach_factor_raw=record[3], reach_threshold_internal=record[3] * 336,
                             special_fish_compare_id=record[4])
            elif category == 'lure':
                entry.update(action_code=record[0], response_parameter_raw=record[1],
                             special_fish_compare_id=record[2], fish_record_mask_hex=f'0x{word(record, 6):04X}')
            elif category == 'fly_component':
                entry.update(family_code=record[0], component_code=record[1], wet_dry_code=record[2])
                # 66/67 have an exceptional family code: do not infer normal BODY use.
                if record[0] == 5:
                    entry['classification_note'] = 'Special wing graphics; exact maker UI-to-ID mapping remains unconfirmed.'
            elif category == 'food':
                entry['effect_field_raw'] = record[0]
                entry['effect_note'] = ('Carried fish size affects runtime recovery; this raw byte is not a universal flat recovery.'
                                       if index == 7 else 'Poison sets current HP to zero in the runtime trial.'
                                       if index == 9 else 'Runtime recovery measurements are documented separately.')
            records.append(entry)
        result['categories'][category] = {'table_file_offset_hex': f'0x{offset(base):06X}',
                                         'stride_bytes': stride, 'records': records}
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--rom', type=Path, required=True, help='Original headerless Japanese SFC ROM supplied by you')
    parser.add_argument('--output', type=Path, required=True, help='JSON output path')
    args = parser.parse_args()
    try:
        result = extract(args.rom.read_bytes())
    except (OSError, ValueError) as error:
        parser.exit(1, f'{error}\n')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Extracted 315 item/component records to {args.output}')

if __name__ == '__main__':
    main()
