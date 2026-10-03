#!/usr/bin/env python3
"""Derive the lure-hook gate matrix and minimum mask coverage from the original ROM.

This studies one code gate. It does not calculate bite rates or simulate catches.
Only the Python standard library is required; supply your own matching ROM.
"""
import argparse
import hashlib
import itertools
import json
from pathlib import Path

SHA1 = 'c2103dd94e2a1a65a495fc02adc2e7d040f31212'
KATAKANA = 'アイウエオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン'
GLYPHS = {0x5E + i: char for i, char in enumerate(KATAKANA)}
GLYPHS[0xAA] = 'ー'


def word(rom, offset):
    return int.from_bytes(rom[offset:offset + 2], 'little')


def extract(rom):
    if len(rom) != 1572864 or hashlib.sha1(rom).hexdigest() != SHA1:
        raise ValueError('Requires the matching headerless Japanese original supplied by you.')
    if word(rom, 0x28000) != 0x8018 or word(rom, 0x28008) != 0xA1D8:
        raise ValueError('Unexpected fish or lure table base pointer.')
    fish = []
    for index in range(73):
        pos = 0x28018 + index * 23
        name_pos = 0x20000 + word(rom, pos + 17)
        name_end = rom.index(0, name_pos, name_pos + 64)
        name = ''.join(GLYPHS.get(b, f'<{b:02X}>') for b in rom[name_pos:name_end])
        fish.append({'id_hex': f'{index + 1:02X}', 'name_ja': name,
                     'name_has_unmapped_glyph': '<' in name,
                     'profile_file_offset': f'0x{pos:06X}',
                     'acceptance_mask_hex': f'0x{word(rom, pos + 15):04X}',
                     'base_fight_mask': rom[pos + 10]})
    lures, groups = [], {}
    for index in range(81):
        pos = 0x2A1D8 + index * 12
        mask = word(rom, pos + 6)
        accepted = [f['id_hex'] for f in fish if int(f['acceptance_mask_hex'], 16) & mask]
        lure = {'id_hex': f'{index + 1:02X}', 'record_file_offset': f'0x{pos:06X}',
                'hook_gate_mask_hex': f'0x{mask:04X}', 'base_price_yen': word(rom, pos + 8),
                'action_code': rom[pos], 'size_response_code': rom[pos + 1],
                'special_fish_compare_id_hex': f'{rom[pos + 2]:02X}',
                'fish_ids_passing_gate': accepted}
        lures.append(lure)
        group = groups.setdefault(mask, {'mask_hex': f'0x{mask:04X}',
                                        'lure_ids': [], 'fish_ids_passing_gate': accepted})
        group['lure_ids'].append(lure['id_hex'])
    universe = set().union(*(set(g['fish_ids_passing_gate']) for g in groups.values()))
    minimum = []
    for n in range(1, len(groups) + 1):
        for combo in itertools.combinations(groups, n):
            if set().union(*(set(groups[m]['fish_ids_passing_gate']) for m in combo)) == universe:
                minimum.append(combo)
        if minimum: break
    pairs = []
    for combo in minimum:
        for ids in itertools.product(*(groups[m]['lure_ids'] for m in combo)):
            pairs.append({'lure_ids': list(ids),
                          'base_price_total_yen': sum(lures[int(i, 16) - 1]['base_price_yen'] for i in ids)})
    pairs.sort(key=lambda p: (p['base_price_total_yen'], p['lure_ids']))
    for f in fish:
        f['matching_lure_ids'] = [l['id_hex'] for l in lures if f['id_hex'] in l['fish_ids_passing_gate']]
    return {'schema_version': 1, 'rom_sha1': SHA1,
            'scope': 'Compatibility at the actual lure-hook trigger gate, not a probability or guaranteed catch.',
            'gate_rule': '(lure_record_word_at_6 & fish_profile_word_at_0F) != 0',
            'gate_cpu': '04:EBF1..EC3A',
            'other_gate_conditions': ['candidate fish at the lure position',
                                      'periodic candidate selection', 'input field 1348 & 8080 is nonzero'],
            'profile_count': 73,
            'profile_count_note': 'The profile block ends at 05:86A7; ID43 has an unmapped control glyph and zero gameplay fields. A profile row is not proof of normal spawn availability.',
            'name_decoding_note': 'Custom katakana glyph mapping, anchored to rendered/literal known names including Iwana, Nijimasu, Black bass, Namazu and Akame. Unknown glyphs remain escaped.',
            'lure_eligible_profile_count': len(universe),
            'minimum_lure_count_for_gate_coverage': len(minimum[0]),
            'minimum_mask_sets': [[f'0x{m:04X}' for m in combo] for combo in minimum],
            'minimum_item_sets_sorted_by_rom_base_price': pairs,
            'groups': list(groups.values()), 'fish': fish, 'lures': lures,
            'limitations': ['This does not establish a fish encounter or a landed catch.',
                            'Rod handling, lure action, fish size, player input and shop access are separate.',
                            'ROM base price does not prove a shop stocks the item.']}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--rom', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    args = p.parse_args()
    try: result = extract(args.rom.read_bytes())
    except ValueError as e: p.error(str(e))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({k: result[k] for k in ('lure_eligible_profile_count', 'minimum_lure_count_for_gate_coverage', 'minimum_mask_sets')}, ensure_ascii=False))


if __name__ == '__main__': main()
