#!/usr/bin/env python3
"""Extract rod records and traced response rules from the supplied original ROM.

The helper is read-only: it validates the original Japanese dump and writes a
small derived JSON file. It never modifies or packages the ROM.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


EXPECTED_SIZE = 1_572_864
EXPECTED_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
ROD_TABLE_OFFSET = 0x02A7F5
ROD_STRIDE = 12
ROD_COUNT = 21
DEFAULT_FISH_INDEX = Path(__file__).resolve().parents[1] / "data" / "lure-coverage.json"
ROD_NAMES = [
    ("タナゴ竿10本継2m", "Bitterling rod, 10-piece, 2 m"),
    ("渓流カーボン竿6m", "Mountain stream carbon rod, 6 m"),
    ("ヤマベ竿6本継3.9m", "Yamabe rod, 6-piece, 3.9 m"),
    ("清流カーボン竿5.3m", "Clear stream carbon rod, 5.3 m"),
    ("ヤマメ竿8本継4.5m", "Yamame rod, 8-piece, 4.5 m"),
    ("マブナ竿9本継3.3m", "Mabuna rod, 9-piece, 3.3 m"),
    ("アユ竿6本継7m", "Ayu rod, 6-piece, 7 m"),
    ("コイ竿8本継5m", "Carp rod, 8-piece, 5 m"),
    ("ヘラ竿3本継3m", "Hera rod, 3-piece, 3 m"),
    ("ルアーロッド小", "Small lure rod"),
    ("ルアーロッド中", "Medium lure rod"),
    ("ルアーロッド大", "Large lure rod"),
    ("大物用ルアーロッド", "Heavy-fish lure rod"),
    ("投げ竿小", "Small casting rod"),
    ("投げ竿中", "Medium casting rod"),
    ("両手投げ竿", "Two-handed casting rod"),
    ("フライロッド小", "Small fly rod"),
    ("フライロッド中", "Medium fly rod"),
    ("フライロッド大", "Large fly rod"),
    ("アユ竿カーボン10m", "Ayu carbon rod, 10 m"),
    ("ヘラ竿カーボン6.5m", "Hera carbon rod, 6.5 m"),
]
STYLE_NAMES = {
    1: "float_or_ayu",
    2: "casting",
    4: "lure",
    8: "fly",
}


def load_fish_index(path: Path) -> dict[int, dict[str, object]]:
    """Load names decoded from the ROM profile table by the catalogue pass."""
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("rom_sha1") != EXPECTED_SHA1:
        raise ValueError(f"Fish index ROM SHA-1 does not match {EXPECTED_SHA1}")
    index: dict[int, dict[str, object]] = {}
    for profile in data.get("fish", []):
        fish_id = int(profile["id_hex"], 16)
        index[fish_id] = {
            "name_ja": profile["name_ja"],
            "name_has_unmapped_glyph": profile["name_has_unmapped_glyph"],
            "profile_file_offset": profile["profile_file_offset"],
        }
    return index


def record_for(rom: bytes, index: int, fish_index: dict[int, dict[str, object]]) -> dict[str, object]:
    offset = ROD_TABLE_OFFSET + index * ROD_STRIDE
    raw = rom[offset : offset + ROD_STRIDE]
    if len(raw) != ROD_STRIDE:
        raise ValueError(f"Truncated rod record {index + 1:02X}")
    fish_id = raw[4]
    match = None
    if fish_id:
        profile = fish_index.get(fish_id)
        if profile is None:
            raise ValueError(f"Rod record references fish ID {fish_id:02X}, absent from the ROM profile index")
        match = {
            "id_hex": f"0x{fish_id:02X}",
            **profile,
            "name_source": "publication/data/lure-coverage.json fish[] (decoded ROM profile)",
        }
    row = {
        "id_hex": f"{index + 1:02X}",
        "name_japanese": ROD_NAMES[index][0],
        "name_english": ROD_NAMES[index][1],
        "record_file_offset": f"0x{offset:06X}",
        "raw_bytes_hex": raw.hex(" "),
        "raw_fields": {f"+{i}": value for i, value in enumerate(raw)},
        "style_code": raw[0],
        "style": STYLE_NAMES.get(raw[0], "unknown"),
        "cast_aim_hold_cutoff_raw": raw[2],
        "range_multiplier_raw": raw[3],
        "range_threshold_internal_at_base_0x0150": raw[3] * 0x0150,
        "fish_id_match_code": f"0x{fish_id:02X}",
        "fish_id_match_label": match,
        "fight_response_code": raw[7],
    }
    if raw[0] in (2, 4):
        row["cast_aim_hold_cutoff_rule"] = "HP >= 100: raw; HP < 100: max(10, floor(raw * current_HP / 100))"
    elif raw[0] == 8:
        row["cast_aim_hold_cutoff_rule"] = "primary cutoff is raw; the fly handler also uses raw >> 1"
    else:
        row["cast_aim_hold_cutoff_rule"] = "raw cutoff"
    return row


def build(rom: bytes, fish_index: dict[int, dict[str, object]]) -> dict[str, object]:
    digest = hashlib.sha1(rom).hexdigest()
    if len(rom) != EXPECTED_SIZE or digest != EXPECTED_SHA1:
        raise ValueError(
            "Only the headerless original Japanese SFC dump is supported; "
            f"expected {EXPECTED_SIZE} bytes and SHA-1 {EXPECTED_SHA1}, "
            f"got {len(rom)} bytes and SHA-1 {digest}."
        )
    pointer = int.from_bytes(rom[5 * 0x8000 + 0x800A - 0x8000 : 5 * 0x8000 + 0x800C - 0x8000], "little")
    if pointer != 0xA7F5:
        raise ValueError(f"Unexpected rod table pointer: 0x{pointer:04X}")

    return {
        "schema_version": 1,
        "rom": {"size_bytes": len(rom), "sha1": digest},
        "scope": "Rod records plus static code-path analysis; not a claim of a measured universal best rod.",
        "source_evidence": {
            "rod_table": {
                "pointer_cpu_address": "05:800A",
                "record_cpu_address": "05:A7F5",
                "record_file_offset": "0x02A7F5",
                "record_stride_bytes": ROD_STRIDE,
                "record_count": ROD_COUNT,
            },
            "rod_record_loader": {"cpu_address": "83:D11F", "file_offset": "0x01D11F"},
            "cast_aim_hold_cutoff_setup": {"cpu_address": "84:D58C", "file_offset": "0x02558C"},
            "cast_aim_hold_counter": {
                "cpu_address": "84:D6EE",
                "file_offset": "0x0256EE",
                "notes": "in the D66B control loop, increments 1F6F while the action button remains held; when 1F6F >= 1F71, writes 1 to 1F73 to end this input/aim phase",
            },
            "aim_input_handler": {
                "cpu_address": "84:D66B",
                "file_offset": "0x02566B",
                "button_release": "84:D6E0 sets 1F73 when controller mask 1348 bit 8000 is clear",
                "target_tile_resolution": {"cpu_address": "84:D056", "file_offset": "0x025056"},
                "phase_dispatcher": {
                    "cpu_address": "84:BF61",
                    "file_offset": "0x023F61",
                    "notes": "after D056 resolves the current tile, a conditional branch sends 1322==0 to D17B (phase 1 setup, 1F6D=1) or 1322!=0 to C01D (phase 3 setup, 1F6D=3 and a mode-specific text code)",
                },
                "next_phase_setup": {"cpu_address": "84:D17B", "file_offset": "0x02517B"},
            },
            "range_setup": {"cpu_address": "84:8721", "file_offset": "0x020721"},
            "range_failure_branch": {
                "cpu_address": "84:9C35",
                "file_offset": "0x021C35",
                "notes": "when 1EC9 reaches 63 and fish-position 1ED5 >= rod threshold 1ED7, sets 1ECD=1 and 16AA=0x1A",
            },
            "rod_response_pre_adjustment": {"cpu_address": "84:8D2A", "file_offset": "0x020D2A"},
            "rod_match_and_size_response": {"cpu_address": "84:8E35", "file_offset": "0x020E35"},
            "response_rotate_left_helper": {"cpu_address": "84:8F77", "file_offset": "0x020F77"},
            "response_render_mapping": {"cpu_address": "84:8F83", "file_offset": "0x020F83"},
            "fish_id_labels_source": "ROM-decoded profile names and profile offsets from publication/data/lure-coverage.json fish[]. The rod record provides the numeric ID; 84:8E35 compares it to active fish ID 7E:11E8.",
        },
        "field_rules": {
            "cast_aim_hold_cutoff": {
                "rod_record_field": "+2",
                "wram_cutoff": "7E:1F71",
                "counter": "7E:1F6F",
                "style_1": "uses the field directly",
                "styles_2_and_4": "if HP at 7E:0862 is below 100, computes raw * HP / 100 and clamps the result to at least 10; at HP 100 or above it uses raw",
                "style_8": "uses raw and also stores raw >> 1 in 7E:1FA3",
                "branch_effect": "The D66B control loop increments 1F6F while the action button is held. Releasing it or reaching the cutoff sets 1F73. The BF61 dispatcher then resolves the current world target tile; it sends 1322==0 to D17B phase 1 setup or 1322!=0 to C01D phase 3 setup. Static call flow identifies this as a cast/aim hold-time cutoff, not a fish-fight strength rating. A larger threshold leaves more time before automatic advance; no catch or cast-distance advantage has been measured.",
                "phase_identification_confidence": "strong static identification from D66B button/release checks, directional target-coordinate updates, BF61 target-tile resolution, and D17B/C01D phase setup; D66B itself does not read 11E8; no controlled in-game visual capture in this subtask",
            },
            "reach": {
                "rod_record_field": "+3",
                "wram_threshold": "7E:1ED7",
                "formula": "range_multiplier * 0x0150 (336) internal position units",
                "position": "7E:1ED5",
                "branch_effect": "When the fight-response value 1EC9 reaches 63, the code sets 1ECF and changes fight state. Only when 1ED5 >= 1ED7 does it additionally set 1ECD and 16AA=0x1A. Downstream handling of 1ECD removes equipped lure/fly components and resets the active fish entry; this is consistent with a fish/tackle loss path, but the player-facing message was not captured. This is evidence that +3 participates in a reach limit; it does not reveal meters or prove a universal catch-rate effect.",
            },
            "fish_id_match": {
                "rod_record_field": "+4",
                "active_fish_id": "7E:11E8",
                "branch_effect": "At 84:8E35, equality jumps directly to 84:8EC1 and skips only the later +7/size-dependent transform. The earlier +7 pre-adjustment at 84:8D2A has already run. Do not describe this as fish exclusivity or a catch bonus.",
            "nonzero_ids": "Each row includes the ID and ROM-decoded name/profile offset from publication/data/lure-coverage.json fish[].",
            },
            "fight_response": {
                "rod_record_field": "+7",
                "wram_value": "7E:11FE",
                "pre_adjustment_at_84_8D2A": {
                    "0": "LSR: floor(x / 2)",
                    "1": "unchanged",
                    "2": "F(x) = (2*x + 1) & 0x3F",
                },
                "size_value": "7E:1EB1",
                "size_adjustment_at_84_8E40_when_fish_id_does_not_match": {
                    "size_0_to_15": {"0": 0, "1": 1, "2": 2},
                    "size_16_to_35": {"0": 1, "1": 0, "2": 1},
                    "size_36_or_more": {"0": 2, "1": 1, "2": 0},
                    "unit": "number of F applications, where F(x) = (2*x + 1) & 0x3F",
                },
                "matched_fish": "When +4 equals active fish ID, the size-adjustment table is skipped; the pre-adjustment still applies.",
                "downstream": "The transformed 11FE is copied into 1EC9 and evolves during the fight. When 1EC9 reaches 63, 1ECF marks a later fight-state transition; 1ECF alone is not shown to mean catch failure. A separate 8F83 lookup maps selected 11FE values to 1F65, which is used as a render offset. No universally better direction for response codes 0/1/2 has been established.",
            },
        },
        "entries": [record_for(rom, index, fish_index) for index in range(ROD_COUNT)],
        "static_field_leaders": [
            {"style": "float_or_ayu", "highest_cutoff": ["14"], "highest_reach": ["08", "15"], "note": "Different rods lead on the two traced dimensions; rod 14's fish-ID match is Ayu (0x38), while rod 15's is Herabuna (0x25)."},
            {"style": "casting", "highest_cutoff_and_reach": ["10"], "note": "This identifies the highest raw +2/+3 values within this style, not experimentally proven overall best performance."},
            {"style": "lure", "highest_cutoff_and_reach": ["0D"], "note": "This identifies the highest raw +2/+3 values within this style, not experimentally proven overall best performance."},
            {"style": "fly", "highest_cutoff_and_reach": ["13"], "note": "Style 8 also has a secondary raw-half threshold; response-code effects still lack a confirmed good/bad direction."},
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", type=Path, required=True, help="User-supplied original Japanese SFC ROM")
    parser.add_argument("--output", type=Path, required=True, help="Destination JSON path")
    parser.add_argument(
        "--fish-index",
        type=Path,
        default=DEFAULT_FISH_INDEX,
        help="ROM-decoded fish profile index JSON (default: publication/data/lure-coverage.json)",
    )
    args = parser.parse_args()
    try:
        result = build(args.rom.read_bytes(), load_fish_index(args.fish_index))
    except (OSError, ValueError) as error:
        parser.exit(1, f"{error}\n")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote 21 rod records and traced rules to {args.output}")


if __name__ == "__main__":
    main()
