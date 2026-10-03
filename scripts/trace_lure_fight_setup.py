#!/usr/bin/env python3
"""Execute the original ROM's small lure/rod fight-setup branch.

This is a restricted 16-bit instruction interpreter, not an SNES emulator.
It stops after the mask-to-display-offset call, before movement setup.
Use the matching original ROM supplied by you. No ROM is modified.
"""
import argparse
import hashlib
import json
from pathlib import Path

SHA1 = 'c2103dd94e2a1a65a495fc02adc2e7d040f31212'
START = 0x8D2A
STOP = 0x8EC4


def execute_branch(rom, memory):
    """Run bank 04's verified branch and its three small subroutines."""
    pc, a, carry, zero = START, 0, False, False
    stack, events = [], []
    memory = dict(memory)

    def byte():
        nonlocal pc
        if not (START <= pc < STOP or 0x8F6F <= pc <= 0x8FC6):
            raise ValueError(f'Instruction outside the documented branch: 04:{pc:04X}')
        value = rom[4 * 0x8000 + pc - 0x8000]
        pc += 1
        return value

    def word():
        return byte() | byte() << 8

    for _ in range(1024):
        if pc == STOP:
            return {'final_mask': memory[0x11FE],
                    'display_offset_raw': memory[0x1F65], 'transforms': events}
        address, op = pc, byte()
        if op == 0xAD:  # LDA absolute
            a = memory.get(word(), 0); zero = a == 0
        elif op == 0xA9:  # LDA immediate, M=16
            a = word(); zero = a == 0
        elif op in (0xC9, 0xCD):
            value = word()
            other = value if op == 0xC9 else memory.get(value, 0)
            carry, zero = a >= other, a == other
        elif op in (0xD0, 0xF0, 0xB0):
            delta = byte(); delta = delta - 256 if delta >= 128 else delta
            if (op == 0xD0 and not zero) or (op == 0xF0 and zero) or (op == 0xB0 and carry):
                pc += delta
        elif op == 0x4C:
            pc = word()
        elif op == 0x20:
            target = word(); stack.append(pc); pc = target
            if target in (0x8F6F, 0x8F77):
                events.append({'call_cpu': f'04:{address:04X}',
                               'operation': 'halve' if target == 0x8F6F else 'double_add_one_mask_63',
                               'input_mask': memory[0x11FE]})
        elif op == 0x60:
            if not stack: raise ValueError('Unexpected outer return')
            pc = stack.pop()
        elif op == 0x8D:
            memory[word()] = a
        elif op == 0x4A:
            carry = bool(a & 1); a >>= 1; zero = a == 0
        elif op == 0x38:
            carry = True
        elif op == 0x2A:
            previous_carry = carry; carry = bool(a & 0x8000)
            a = ((a << 1) | int(previous_carry)) & 0xFFFF; zero = a == 0
        elif op == 0x29:
            a &= word(); zero = a == 0
        else:
            raise ValueError(f'Unsupported instruction {op:02X} at 04:{address:04X}')
    raise ValueError('Branch instruction budget exceeded')


def lure_setup(rom, rod_id, lure_id, fish_id, size_raw, base_mask):
    rod_pos = 0x2A7F5 + (rod_id - 1) * 12
    lure_pos = 0x2A1D8 + (lure_id - 1) * 12
    rod = rom[rod_pos:rod_pos + 12]
    lure = rom[lure_pos:lure_pos + 12]
    if rod[0] != 4:
        raise ValueError('Select a lure-style rod (IDs 0A..0D).')
    memory = {0x0C14: 2, 0x11E8: fish_id, 0x1EB1: size_raw,
              0x11FE: base_mask, 0x127C: rod[4], 0x1282: rod[7],
              0x1228: lure[1], 0x122A: lure[2]}
    return {'rom_sha1': hashlib.sha1(rom).hexdigest(),
            'scope': 'ROM instruction execution of fight setup only; not a catch-rate or whole-game simulation',
            'source_cpu': '04:8D2A..8EC3; 04:8F6F..8FC6',
            'rod_id_hex': f'{rod_id:02X}', 'lure_id_hex': f'{lure_id:02X}',
            'fish_id_hex': f'{fish_id:02X}', 'fish_size_raw': size_raw,
            'base_mask': base_mask, 'rod_response_code': rod[7],
            'lure_response_code': lure[1], 'rod_fish_id_match': rod[4] == fish_id,
            'lure_fish_id_match': lure[2] == fish_id,
            **execute_branch(rom, memory)}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--rom', type=Path, required=True)
    p.add_argument('--rod-id', type=lambda v: int(v, 16), required=True, help='Hexadecimal ID')
    p.add_argument('--lure-id', type=lambda v: int(v, 16), required=True, help='Hexadecimal ID')
    p.add_argument('--fish-id', type=lambda v: int(v, 16), required=True, help='Hexadecimal ID')
    p.add_argument('--size-raw', type=int, required=True)
    p.add_argument('--base-mask', type=int, help='Optional controlled override; otherwise read fish profile +0A')
    args = p.parse_args(); rom = args.rom.read_bytes()
    if len(rom) != 1572864 or hashlib.sha1(rom).hexdigest() != SHA1:
        p.error('Requires the matching headerless Japanese original supplied by you.')
    if args.base_mask is None:
        args.base_mask = rom[0x28018 + (args.fish_id - 1) * 23 + 10] if 1 <= args.fish_id <= 73 else -1
    if not (1 <= args.rod_id <= 21 and 1 <= args.lure_id <= 81 and
            1 <= args.fish_id <= 73 and args.fish_id != 0x43 and
            0 <= args.size_raw <= 65535 and 0 <= args.base_mask <= 65535):
        p.error('ID or raw field is outside its supported range.')
    print(json.dumps(lure_setup(rom, args.rod_id, args.lure_id, args.fish_id,
                                args.size_raw, args.base_mask), indent=2))


if __name__ == '__main__':
    main()
