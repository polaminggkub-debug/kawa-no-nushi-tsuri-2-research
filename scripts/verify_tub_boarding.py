#!/usr/bin/env python3
"""Verify the original-ROM tub-mode assignment and published screenshot fingerprint."""
import hashlib
import json
import sys
from pathlib import Path


def main():
    rom = Path(sys.argv[1]).read_bytes()
    if hashlib.sha1(rom).hexdigest() != 'c2103dd94e2a1a65a495fc02adc2e7d040f31212':
        raise ValueError('Unexpected original ROM')
    expected = bytes.fromhex('ad 0e 13 c9 01 00 d0 08 a9 03 00 8d 58 08')
    if rom[0x0379:0x0379 + len(expected)] != expected:
        raise ValueError('Tub movement-mode assignment differs')
    root = Path(__file__).resolve().parents[1]
    proof = json.loads((root / 'data/tub-boarding.json').read_text())
    shot = (root / 'catalogue' / proof['screenshot']).read_bytes()
    if hashlib.sha256(shot).hexdigest() != proof['screenshotSha256']:
        raise ValueError('Published screenshot fingerprint differs')
    print('PASS: original-ROM mode-3 assignment and published screenshot match. This does not replay boarding.')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python3 scripts/verify_tub_boarding.py <original Japan ROM>')
    main()
