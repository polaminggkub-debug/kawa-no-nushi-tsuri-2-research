#!/usr/bin/env python3
"""Extract primary-ROM fish, bait, lure and fly-body compatibility gates.

The result describes bit-mask eligibility at the traced runtime gates. It does
not estimate bite odds or model a complete catch. The supplied ROM is read
only; no ROM bytes are copied into the output.
"""
import argparse
import hashlib
import itertools
import json
from pathlib import Path

ROM_SHA1 = 'c2103dd94e2a1a65a495fc02adc2e7d040f31212'
ROM_SIZE = 1572864
FISH_BASE = 0x28018
FISH_COUNT = 0x49
BAIT_BASE = 0x29E67
BAIT_COUNT = 23
LURE_BASE = 0x2A1D8
LURE_COUNT = 81
FLY_BASE = 0x2AA52
FLY_COUNT = 0x86
FLY_STRIDE = 11

KATAKANA = 'アイウエオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン'
FISH_GLYPHS = {0x5E + index: char for index, char in enumerate(KATAKANA)}
FISH_GLYPHS[0xAA] = 'ー'


def word(data, offset):
    return int.from_bytes(data[offset:offset + 2], 'little')


def extract(rom):
    digest = hashlib.sha1(rom).hexdigest()
    if len(rom) != ROM_SIZE or digest != ROM_SHA1:
        raise ValueError('Requires the matching headerless Japanese original supplied by you.')
    expected_pointers = {0x28000: 0x8018, 0x28002: 0x9E67,
                         0x28008: 0xA1D8, 0x2800C: 0xAA52}
    for offset, expected in expected_pointers.items():
        if word(rom, offset) != expected:
            raise ValueError(f'Unexpected table pointer at file offset 0x{offset:06X}.')

    fish = []
    for index in range(FISH_COUNT):
        pos = FISH_BASE + index * 23
        name_pointer = word(rom, pos + 17)
        name_offset = 0x20000 + name_pointer
        name_end = rom.index(0, name_offset, min(name_offset + 64, len(rom)))
        name = ''.join(FISH_GLYPHS.get(value, f'<{value:02X}>')
                       for value in rom[name_offset:name_end])
        mask = word(rom, pos + 15)
        fish.append({
            'id_hex': f'{index + 1:02X}',
            'name_ja_from_rom': name,
            'name_has_unmapped_glyph': '<' in name,
            'profile_file_offset': f'0x{pos:06X}',
            'acceptance_mask_hex': f'0x{mask:04X}',
            'mode1_prefilter_byte_+13_hex': f'0x{rom[pos + 13]:02X}',
            'random_threshold_byte_+3_hex': f'0x{rom[pos + 3]:02X}',
        })

    baits = []
    for index in range(BAIT_COUNT):
        pos = BAIT_BASE + index * 12
        mask = word(rom, pos + 6)
        accepted = [item['id_hex'] for item in fish
                    if int(item['acceptance_mask_hex'], 16) & mask]
        baits.append({
            'id_hex': f'{index + 1:02X}',
            'record_file_offset': f'0x{pos:06X}',
            'acceptance_mask_hex': f'0x{mask:04X}',
            'name_pointer_cpu': f'05:{word(rom, pos + 10):04X}',
            'base_price_yen': word(rom, pos + 8),
            'fish_ids_passing_mask_gate': accepted,
            'mode1_fish_ids_passing_profile_byte_+13_gate': [
                item['id_hex'] for item in fish
                if item['id_hex'] in accepted
                and int(item['mode1_prefilter_byte_+13_hex'], 16) & 0x08],
            'mode1_fish_ids_with_nonzero_random_threshold_+3': [
                item['id_hex'] for item in fish
                if item['id_hex'] in accepted
                and int(item['mode1_prefilter_byte_+13_hex'], 16) & 0x08
                and int(item['random_threshold_byte_+3_hex'], 16) > 0],
        })

    lures = []
    for index in range(LURE_COUNT):
        pos = LURE_BASE + index * 12
        mask = word(rom, pos + 6)
        accepted = [item['id_hex'] for item in fish
                    if int(item['acceptance_mask_hex'], 16) & mask]
        lures.append({
            'id_hex': f'{index + 1:02X}',
            'record_file_offset': f'0x{pos:06X}',
            'acceptance_mask_hex': f'0x{mask:04X}',
            'fish_ids_passing_mask_gate': accepted,
        })

    # The equipped-body selector is the component-table lookup used by the
    # game's custom fly body IDs. Ordinary body rows have +1 == 0 and family
    # selector +0 in 0..4; two family-5 special records are excluded.
    body_ids = []
    for index in range(FLY_COUNT):
        pos = FLY_BASE + index * FLY_STRIDE
        if rom[pos + 1] == 0 and rom[pos] <= 4:
            body_ids.append(index + 1)
    if len(body_ids) != 64:
        raise ValueError(f'Unexpected ordinary fly-body row count: {len(body_ids)}.')

    fly_bodies = []
    for item_id in body_ids:
        pos = FLY_BASE + (item_id - 1) * FLY_STRIDE
        family_field = rom[pos]
        component_field = rom[pos + 1]
        wet_dry_field = rom[pos + 2]
        # Exact selector branch at 04:D4DC..D4F9.
        if wet_dry_field != 0:
            bait_id = 0x04
            selector = 'body_record_+2_nonzero'
        elif family_field == 1:
            bait_id = 0x08
            selector = 'body_record_+2_zero_and_+0_equals_1'
        else:
            bait_id = 0x07
            selector = 'body_record_+2_zero_and_+0_not_1'
        bait = baits[bait_id - 1]
        fly_bodies.append({
            'id_hex': f'{item_id:02X}',
            'record_file_offset': f'0x{pos:06X}',
            'field_+0_hex': f'0x{family_field:02X}',
            'field_+1_hex': f'0x{component_field:02X}',
            'field_+2_hex': f'0x{wet_dry_field:02X}',
            'selector_branch': selector,
            'selected_bait_id_hex': f'{bait_id:02X}',
            'mask_used_at_fish_gate_hex': bait['acceptance_mask_hex'],
            'fish_ids_passing_mask_gate': bait['fish_ids_passing_mask_gate'],
        })

    for profile in fish:
        fish_id = profile['id_hex']
        profile['matching_bait_ids'] = [
            bait['id_hex'] for bait in baits if fish_id in bait['fish_ids_passing_mask_gate']]
        profile['matching_lure_ids'] = [
            lure['id_hex'] for lure in lures if fish_id in lure['fish_ids_passing_mask_gate']]
        profile['matching_fly_body_ids'] = [
            body['id_hex'] for body in fly_bodies
            if fish_id in body['fish_ids_passing_mask_gate']]

    fly_groups = {}
    for body in fly_bodies:
        key = body['mask_used_at_fish_gate_hex']
        group = fly_groups.setdefault(key, {
            'mask_hex': key,
            'selected_bait_ids': [],
            'fly_body_ids': [],
            'fish_ids_passing_mask_gate': body['fish_ids_passing_mask_gate'],
        })
        if body['selected_bait_id_hex'] not in group['selected_bait_ids']:
            group['selected_bait_ids'].append(body['selected_bait_id_hex'])
        group['fly_body_ids'].append(body['id_hex'])

    mask_eligible_fly_fish = set().union(*(set(group['fish_ids_passing_mask_gate'])
                                           for group in fly_groups.values()))
    minimum_mask_sets = []
    mask_keys = list(fly_groups)
    for size in range(1, len(mask_keys) + 1):
        for combo in itertools.combinations(mask_keys, size):
            covered = set().union(*(set(fly_groups[key]['fish_ids_passing_mask_gate'])
                                    for key in combo))
            if covered == mask_eligible_fly_fish:
                minimum_mask_sets.append(list(combo))
        if minimum_mask_sets:
            break

    minimum_body_examples = []
    if len(minimum_mask_sets) == 1 and len(minimum_mask_sets[0]) > 1:
        combo = minimum_mask_sets[0]
        body_options = [fly_groups[mask]['fly_body_ids'] for mask in combo]
        minimum_body_examples = [
            {'fly_body_ids': [ids[0] for ids in body_options],
             'mask_hexes': combo,
             'fish_ids_covered_by_profile_mask_only': sorted(mask_eligible_fly_fish)}
        ]
    elif len(minimum_mask_sets) == 1:
        only_mask = minimum_mask_sets[0][0]
        minimum_body_examples = [
            {'fly_body_ids': [fly_groups[only_mask]['fly_body_ids'][0]],
             'mask_hexes': [only_mask],
             'fish_ids_covered_by_profile_mask_only': sorted(mask_eligible_fly_fish)}
        ]

    for group in fly_groups.values():
        group['fish_count'] = len(group['fish_ids_passing_mask_gate'])

    bait_mask_groups = {}
    for bait in baits:
        key = bait['acceptance_mask_hex']
        group = bait_mask_groups.setdefault(key, {
            'mask_hex': key, 'bait_ids': [],
            'fish_ids_passing_mask_gate': bait['fish_ids_passing_mask_gate'],
        })
        group['bait_ids'].append(bait['id_hex'])
    for group in bait_mask_groups.values():
        group['fish_count'] = len(group['fish_ids_passing_mask_gate'])

    mode1_prefix_candidates = set().union(*(
        set(item['mode1_fish_ids_with_nonzero_random_threshold_+3'])
        for item in baits))

    return {
        'schema_version': 1,
        'rom': {'size_bytes': ROM_SIZE, 'sha1': ROM_SHA1,
                'identity': 'user-supplied headerless original Japanese SFC dump'},
        'scope': 'Primary-ROM acceptance-mask compatibility at the live fish-event gates; no catch-rate or landed-catch estimate.',
        'gate_rule': '(item_record_word_at_+6 & fish_profile_word_at_+15) != 0',
        'source_tables': {
            'fish_profile': {'cpu_base': '05:8018', 'file_base': '0x028018',
                             'stride_bytes': 23, 'rows': FISH_COUNT,
                             'mask_field': '+15 word, loaded to WRAM 7E:1208'},
            'bait': {'cpu_base': '05:9E67', 'file_base': '0x029E67',
                     'stride_bytes': 12, 'rows': BAIT_COUNT,
                     'mask_field': '+6 word, loaded to WRAM 7E:121E'},
            'lure': {'cpu_base': '05:A1D8', 'file_base': '0x02A1D8',
                     'stride_bytes': 12, 'rows': LURE_COUNT,
                     'mask_field': '+6 word, loaded to WRAM 7E:1232'},
            'fly_component': {'cpu_base': '05:AA52', 'file_base': '0x02AA52',
                              'stride_bytes': FLY_STRIDE, 'rows': FLY_COUNT,
                              'ordinary_body_rows': 64},
        },
        'runtime_code_evidence': {
            'mode_dispatcher_cpu': '04:C0A5..C145',
            'mode1_caller_cpu': '04:C106 calls 04:E9AB',
            'mode3_caller_cpu': '04:C142 calls 04:E685',
            'mode1_bait_gate_cpu': '04:EA02..EB11',
            'mode1_bait_gate_file': '0x026A02..0x026B11',
            'mode1_bait_gate_other_conditions': [
                'The current in-water candidate must match the player item coordinates.',
                'The candidate fish ID is loaded from the active-fish list and its profile is loaded.',
                'Fish profile byte +13 must pass the separate bit-0x08 gate (loaded at WRAM 7E:1204).',
                'The routine compares a random value against fish profile byte +3 (loaded at WRAM 7E:11F0) before checking the mask.',
            ],
            'mode3_fly_profile_mask_gate_cpu': '04:E6C9..E6D2',
            'mode3_fly_profile_mask_gate_file': '0x0266C9..0x0266D2',
            'mode3_fly_additional_mask': {
                'initialization_cpu': '04:D4AF sets WRAM 7E:1FA7 to 0x00FF',
                'body_compare_cpu': '04:D4B2..D4BE compares (7E:1238 & 3) with 7F:1E86; equality clears 7E:1FA7',
                'wing_compare_cpu': '04:D4C1..D4CD compares (7E:123A & 3) with 7F:1E88; equality clears 7E:1FA7',
                'consumer_cpu': '04:E6C9 ANDs 7E:1FA7 after fish/item masks; zero skips this event path',
                'producer_notes': '7F:1E86 and 7F:1E88 receive low-two-bit random values in code at 03:835B/836E under 7E:1364 bit tests; additional random assignments occur at 04:EDA7/EDB2. These are dynamic residues, not proven species-preference fields.',
                'limit': 'A body can pass the fish-profile mask yet fail this dynamic body/wing residue condition. Therefore the one-body result below is mask-only and is not a complete fly recommendation.',
            },
            'fly_body_selection_cpu': '04:D47C..D500',
            'fly_body_selection_file': '0x02547C..0x025500',
            'fly_record_loader_cpu': '03:D0D9..D11E',
            'fly_record_loader_file': '0x01D0D9..0x01D11E',
            'bait_record_loader_cpu': '03:D030..D07F',
            'bait_record_loader_file': '0x01D030..0x01D07F',
            'lure_gate_cpu': '04:EBFD..EC03',
            'lure_gate_file': '0x026BFD..0x026C03',
        },
        'fly_body_rule': {
            'operational_body_row_rule': 'fly record +1 == 0 and +0 in 0..4; this yields 64 ordinary body IDs and excludes the two +0 == 5 special records.',
            'selector': [
                {'when': 'body_record_+2 != 0', 'selected_bait_id_hex': '04'},
                {'when': 'body_record_+2 == 0 and body_record_+0 == 1', 'selected_bait_id_hex': '08'},
                {'when': 'body_record_+2 == 0 and body_record_+0 != 1', 'selected_bait_id_hex': '07'},
            ],
            'wing_tail_limit': 'This mask-selection branch reads body fields +0 and +2. It does not read the selected wing/tail IDs to choose the mask. Other parts of the fly are used in separate code paths, so this does not mean they have no gameplay effects.',
            'minimum_body_count_for_profile_mask_coverage_only': len(minimum_mask_sets[0]) if minimum_mask_sets else 0,
            'minimum_mask_sets': minimum_mask_sets,
            'minimum_body_examples': minimum_body_examples,
            'profile_mask_eligible_count': len(mask_eligible_fly_fish),
            'mask_only_limit': 'This set cover uses only body-selected bait masks ANDed with fish profile masks. Mode 3 also ANDs 7E:1FA7 at 04:E6C9, so one-body mask coverage is not a full fly-mode recommendation.',
            'mask_groups': [fly_groups[key] for key in sorted(fly_groups, key=lambda value: int(value, 16))],
        },
        'bait_mask_groups': [bait_mask_groups[key] for key in sorted(bait_mask_groups, key=lambda value: int(value, 16))],
        'bait_eligible_profile_count': len(set().union(*(
            set(bait['fish_ids_passing_mask_gate']) for bait in baits))),
        'mode1_bait_profiles_passing_byte13_and_nonzero_threshold': len(mode1_prefix_candidates),
        'lure_eligible_profile_count': len(set().union(*(
            set(lure['fish_ids_passing_mask_gate']) for lure in lures))),
        'valid_profile_count_excluding_placeholder_id_43': sum(
            profile['id_hex'] != '43' for profile in fish),
        'fish_profiles': fish,
        'baits': baits,
        'lures': lures,
        'fly_bodies': fly_bodies,
        'limitations': [
            'A nonzero mask proves passage at the mask comparison only, not a bite, hook-up, or landed fish.',
            'Mode 1 has earlier fish-profile flag and random-threshold gates. Mode 3 fly handling has the separate 7E:1FA7 AND at 04:E6C9.',
            'Other fish eligibility, random, position, rod, hook, lure-response and fight-state checks remain separate.',
            'Fish profile ID 43 has a zero mask and an unmapped name byte; retaining its table row does not prove it is normally spawnable.',
            'Fly bait IDs 07 and 08 have the same +6 mask in this ROM; equal mask compatibility does not establish equal behavior in later code.',
            'The JSON contains extracted IDs, masks, decoded fish labels, pointers and prices only; it does not contain ROM bytes or binary data.',
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--rom', type=Path, required=True,
                        help='Path to the exact original Japanese SFC ROM supplied by you')
    parser.add_argument('--output', type=Path, required=True,
                        help='Destination JSON file')
    args = parser.parse_args()
    try:
        result = extract(args.rom.read_bytes())
    except (OSError, ValueError) as error:
        parser.exit(1, f'{error}\n')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    fly = result['fly_body_rule']
    print(json.dumps({
        'fish_profiles': len(result['fish_profiles']),
        'bait_items': len(result['baits']),
        'lure_items': len(result['lures']),
        'fly_body_items': len(result['fly_bodies']),
        'fly_profile_mask_eligible_count': fly['profile_mask_eligible_count'],
        'minimum_body_count_for_profile_mask_coverage_only': fly['minimum_body_count_for_profile_mask_coverage_only'],
        'minimum_mask_sets': fly['minimum_mask_sets'],
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
