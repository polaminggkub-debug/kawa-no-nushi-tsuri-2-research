#!/usr/bin/env python3
"""Trace the hidden fly body/wing gate and verify a three-bundle workaround.

Read-only analysis of the user-supplied original ROM. The script reports
instruction bytes and a player-usable ready-made fly set; it does not emulate
the fishing outcome or modify the ROM.
"""
import argparse
import hashlib
import json
from pathlib import Path

from extract_shop_stock import extract as extract_shop_stock


ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
ROM_SIZE = 1_572_864


def file_offset(bank: int, address: int) -> int:
    if not 0x8000 <= address <= 0xFFFF:
        raise ValueError("Expected a LoROM CPU address in $8000-$FFFF")
    return bank * 0x8000 + address - 0x8000


def require_bytes(rom: bytes, bank: int, address: int, expected: bytes) -> None:
    start = file_offset(bank, address)
    actual = rom[start:start + len(expected)]
    if actual != expected:
        raise ValueError(
            f"Unexpected ROM bytes at {bank:02X}:{address:04X}: "
            f"{actual.hex(' ')} != {expected.hex(' ')}"
        )


def fish_mask_rows(rom: bytes, mask: int) -> list[str]:
    result = []
    base = 0x28018
    for index in range(0x49):
        profile = base + index * 23
        profile_mask = int.from_bytes(rom[profile + 15:profile + 17], "little")
        if profile_mask & mask:
            result.append(f"{index + 1:02X}")
    return result


def fly_record(rom: bytes, item_id: str) -> dict:
    numeric_id = int(item_id, 16)
    base = 0x2AA52 + (numeric_id - 1) * 11
    row = rom[base:base + 11]
    if len(row) != 11:
        raise ValueError(f"Fly record {item_id} is outside the ROM")
    if row[1] == 0 and row[0] <= 4:
        body_role = True
        if row[2] != 0:
            bait_id = 0x04
        elif row[0] == 1:
            bait_id = 0x08
        else:
            bait_id = 0x07
        bait_offset = 0x29E67 + (bait_id - 1) * 12
        mask = int.from_bytes(rom[bait_offset + 6:bait_offset + 8], "little")
    else:
        body_role = False
        bait_id = None
        mask = None
    return {
        "id": item_id,
        "file_offset": f"0x{base:06X}",
        "field_+0_hex": f"0x{row[0]:02X}",
        "field_+1_hex": f"0x{row[1]:02X}",
        "field_+2_hex": f"0x{row[2]:02X}",
        "ordinary_body": body_role,
        "selected_bait_id": None if bait_id is None else f"{bait_id:02X}",
        "selected_bait_mask_hex": None if mask is None else f"0x{mask:04X}",
        "fish_profiles_passing_mask": [] if mask is None else fish_mask_rows(rom, mask),
    }


def analyze(rom: bytes) -> dict:
    digest = hashlib.sha1(rom).hexdigest()
    if len(rom) != ROM_SIZE or digest != ROM_SHA1:
        raise ValueError("Requires the matching user-supplied original Japanese SFC ROM")

    # These are the only literal STA long stores to either hidden-state
    # address found in the ROM; the call paths are traced below.
    body_store = bytes.fromhex("8f 86 1e 7f")
    wing_store = bytes.fromhex("8f 88 1e 7f")
    body_writers = [i for i in range(len(rom)) if rom.startswith(body_store, i)]
    wing_writers = [i for i in range(len(rom)) if rom.startswith(wing_store, i)]
    expected_body_writers = [file_offset(3, 0x835B), file_offset(4, 0xEDA7)]
    expected_wing_writers = [file_offset(3, 0x836E), file_offset(4, 0xEDB2)]
    if body_writers != expected_body_writers or wing_writers != expected_wing_writers:
        raise ValueError("The hidden-state write-site inventory differs from the traced ROM")

    # Equipment loading recalculates 1FA7 from the existing body and wing IDs.
    require_bytes(rom, 4, 0xD4AC, bytes.fromhex(
        "a9 ff 00 8d a7 1f ad 38 12 29 03 00 cf 86 1e 7f d0 03 9c a7 1f "
        "ad 3a 12 29 03 00 cf 88 1e 7f d0 03 9c a7 1f"
    ))
    require_bytes(rom, 4, 0xE6C9, bytes.fromhex(
        "ad 1e 12 2d 08 12 2d a7 1f f0 11 a9 02 00 8d 7b 1f "
        "a9 14 00 8d a8 16 20 d2 ed"
    ))
    # The area-data builder invokes the routine that generates the shared
    # six-area fish data, which ends by writing the hidden pair.
    require_bytes(rom, 1, 0xA0B9, bytes.fromhex("20 05 b7"))
    require_bytes(rom, 1, 0xB5EC, bytes.fromhex("20 05 b7 60"))
    require_bytes(rom, 1, 0xB6E6, bytes.fromhex("20 05 b7 60"))
    require_bytes(rom, 1, 0xB72C, bytes.fromhex("20 c5 be"))
    require_bytes(rom, 1, 0xBEC5, bytes.fromhex("22 6b e7 03 22 56 ec 04"))
    require_bytes(rom, 1, 0xBECD, bytes.fromhex(
        "a9 01 00 20 3f dc a9 02 00 20 3f dc a9 03 00 20 3f dc "
        "a9 04 00 20 3f dc a9 05 00 20 3f dc a9 06 00 20 3f dc 60"
    ))
    require_bytes(rom, 4, 0xEDA0, bytes.fromhex(
        "22 92 da 00 29 03 00 8f 86 1e 7f 22 92 da 00 29 03 00 8f 88 1e 7f 6b"
    ))
    # The separate inn/rest writer samples each side only when its mask bits
    # are clear; otherwise the previous value is retained.
    require_bytes(rom, 3, 0x8074, bytes.fromhex("20 c7 80"))
    require_bytes(rom, 3, 0x833A, bytes.fromhex(
        "ee 12 05 ad 64 08 8d 62 08 a9 ff 00 8d 85 1f 8d 87 1f "
        "ad 64 13 29 22 00 d0 0b 22 92 da 00 29 03 00 8f 86 1e 7f "
        "ad 64 13 29 11 00 d0 0b 22 92 da 00 29 03 00 8f 88 1e 7f"
    ))
    # The fly shop builds a visible list from nonzero body slots, then uses
    # the selected list index to transfer the corresponding ready-made body,
    # wing, and tail into current/equipped fields.
    require_bytes(rom, 3, 0x90D7, bytes.fromhex(
        "a0 00 00 b7 0a f0 07 9d 29 1a e8 c8 80 f5"
    ))
    require_bytes(rom, 3, 0x9119, bytes.fromhex(
        "ad a3 1a 48 ad a1 1a 48 ae cf 1b bd d5 1b 8d 38 12 20 d9 d0 "
        "bd 4d 1c 8d 3a 12 bd bd 1c 8d 3c 12 ad cf 1b 8d 2f 1d "
        "a9 0d 00 8d 4e 08 22 04 80 02"
    ))
    require_bytes(rom, 3, 0x91A9, bytes.fromhex(
        "ad 38 12 99 5e 09 ad 3a 12 99 ce 09 ad 3c 12 99 3e 0a 80 06 a0 dc 01 20"
    ))

    stock = extract_shop_stock(rom)
    areas = {area["stage"]: area for area in stock["areas"]}
    requested = [(1, "01"), (1, "2B"), (2, "02")]
    bundles = []
    for stage, body_id in requested:
        match = next((entry for entry in areas[stage]["flyBundles"]
                      if entry["body"] == body_id), None)
        if match is None:
            raise ValueError(f"Ready-made body {body_id} missing from area {stage} stock")
        body = fly_record(rom, match["body"])
        wing = fly_record(rom, match["wing"])
        if not body["ordinary_body"] or body["selected_bait_mask_hex"] != "0x0020":
            raise ValueError(f"Bundle body {body_id} does not use the wet 0x0020 mask")
        if wing["ordinary_body"]:
            # Wing records are distinguished by the ROM's +1 field.
            raise ValueError(f"Bundle wing {match['wing']} unexpectedly decodes as an ordinary body")
        visible_body_slots = [entry["body"] for entry in areas[stage]["flyBundles"]]
        if len(visible_body_slots) != 8 or any(not item for item in visible_body_slots):
            raise ValueError(f"Area {stage} does not expose eight nonzero ready-made bundle slots")
        bundles.append({
            "stage": stage,
            "menu_order_one_based": match["slot"] + 1,
            "bundle_price_yen": match["shopPriceYen"],
            "body_id": match["body"],
            "wing_id": match["wing"],
            "tail_id": match["tail"],
            "body_low_two_bits": int(match["body"], 16) & 3,
            "wing_low_two_bits": int(match["wing"], 16) & 3,
            "body_fields_+0_+2_hex": [body["field_+0_hex"], body["field_+2_hex"]],
            "selected_bait_id": body["selected_bait_id"],
        })

    body_groups = [row["body_low_two_bits"] for row in bundles]
    wing_groups = [row["wing_low_two_bits"] for row in bundles]
    if len(set(body_groups)) != 3 or len(set(wing_groups)) != 3:
        raise ValueError("The three bundles must have distinct body and wing low-bit groups")
    passing = {}
    for hidden_body in range(4):
        for hidden_wing in range(4):
            passing[f"body={hidden_body},wing={hidden_wing}"] = [
                row["body_id"] for row in bundles
                if row["body_low_two_bits"] != hidden_body
                and row["wing_low_two_bits"] != hidden_wing
            ]
    minimum_pass = min(map(len, passing.values()))
    if minimum_pass != 1:
        raise ValueError("The three-bundle strategy does not guarantee a gate-passing set")
    accepted_profile_ids = fly_record(rom, bundles[0]["body_id"])["fish_profiles_passing_mask"]
    if any(
        fly_record(rom, bundle["body_id"])["fish_profiles_passing_mask"] != accepted_profile_ids
        for bundle in bundles
    ):
        raise ValueError("The proposed bundles do not share the same fish-profile mask coverage")

    # Tail is loaded by the equipment routine, but no tail load occurs in the
    # exact body/wing comparison block above.
    gate_bytes = rom[file_offset(4, 0xD4B2):file_offset(4, 0xD4D0)]
    tail_read_in_gate = bytes.fromhex("ad 3c 12") in gate_bytes

    return {
        "rom_sha1": digest,
        "scope": "Static primary-ROM control/data-flow trace; does not model bites or landing",
        "hidden_gate": {
            "comparison_cpu": "04:D4B2..D4CD",
            "body_expression": "(7E:1238 & 3) == 7F:1E86 clears 7E:1FA7",
            "wing_expression": "(7E:123A & 3) == 7F:1E88 clears 7E:1FA7",
            "consumer_cpu": "04:E6C9..E6D2 ANDs 7E:1FA7 after the fly bait and fish profile masks",
            "literal_body_store_sites_cpu": ["03:835B", "04:EDA7"],
            "literal_wing_store_sites_cpu": ["03:836E", "04:EDB2"],
            "area_setup_chain_cpu": {
                "cache_rebuild_callers": ["01:A0B9", "01:B5EC", "01:B6E6"],
                "rebuild": "01:B705 -> 01:BEC5 -> 04:EC56 -> 04:EDA0..EDB6",
                "six_area_refresh_calls": "01:BECD..BEF1 calls 01:DC3F once for each selector 1..6",
            },
            "rest_writer_condition": {
                "body": "03:834C..835B writes a new sample only if (7E:1364 & 0x22) == 0",
                "wing": "03:835F..836E writes a new sample only if (7E:1364 & 0x11) == 0",
            },
            "recast": "No writer is present in the fly re-evaluation or mode-3 cast/event gate; a cast alone does not reroll the pair.",
        },
        "ready_made_three_set": {
            "reason": "Body and wing low-two-bit groups are each distinct, so any fixed hidden pair blocks at most two of the three bundles.",
            "same_profile_mask_hex": "0x0020",
            "fish_profile_ids_passing_that_mask": accepted_profile_ids,
            "minimum_gate_passing_bundles_for_all_16_hidden_pairs": minimum_pass,
            "all_hidden_pair_results": [
                f"body={hidden_body},wing={hidden_wing}:" + ",".join(ids)
                for hidden_body in range(4) for hidden_wing in range(4)
                for ids in [passing[f"body={hidden_body},wing={hidden_wing}"]]
            ],
            "total_bundle_price_yen": sum(row["bundle_price_yen"] for row in bundles),
            "bundles": bundles,
        },
        "tail_scope": {
            "loaded_as_component": "04:D49D..D4A3 copies the selected tail component to 7E:123C and calls its record loader",
            "read_by_hidden_body_wing_gate": tail_read_in_gate,
            "conclusion": "No fish-specific benefit is established by the examined fish-profile or hidden body/wing gates.",
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", type=Path, required=True, help="Matching original Japanese SFC ROM")
    args = parser.parse_args()
    try:
        result = analyze(args.rom.read_bytes())
    except (OSError, ValueError) as error:
        parser.exit(1, f"{error}\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
