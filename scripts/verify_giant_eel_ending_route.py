#!/usr/bin/env python3
"""Verify giant-eel storage/ending-route code in a locally supplied original ROM."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

ROM_SIZE = 1_572_864
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
ROM_SHA256 = "e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49"
FINGERPRINTS = (
    (1, 0x85B9, "ad a3 1e c9 10 00 b0 05 a9 01 00 85 10"),
    (1, 0x85E4, "a5 10 f0 ca c9 01 00 d0 12 20 7a 91 20 7a 8a 20 fe 8d 20 bf 86 20 13 86"),
    (1, 0x8A7A, "ad e8 11 c9 42 00 f0 41 90 3f"),
    (1, 0x8AC3, "a2 00 00 bd 7a 0b f0 04 e8 e8 80 f7 ad e8 11 9d 7a 0b ad b1 1e 9d b6 0b"),
    (1, 0x8DFE, "af 8c 01 7f aa bf ce 01 7f aa a9 00 00 9f 8a 1e 7f af 8c 01 7f aa a9 ff ff 9f ce 01 7f"),
    (0, 0x9E62, "ad 18 0c c9 0f 00 d0 17 ad 5a 08 c9 07 00 d0 0f ad 5e 08 cf 5b a0 00 d0 06 a9 0d 00 8d 34 08"),
    (0, 0x9FB9, "08 00 b7 00 0c 00 b6 00 0d 00 b9 00 0b 00 b3 00 0c 00 bd 00"),
    (0, 0xA059, "07 00 4d 00"),
    (0, 0x825E, "22 94 df 02 60"),
    (2, 0xDF94, "20 10 ec 6b"),
    (2, 0xEC30, "20 43 ec ad 18 0c 09 02 00 8d 18 0c"),
    (2, 0xEC60, "a0 c8 03 20 b8 e5"),
    (2, 0xEC80, "a0 ca 03 20 cd eb"),
    (2, 0xEF8D, "a0 cc 03 20 c4 e5"),
    (2, 0xEFAE, "ad 18 0c 09 10 00 8d 18 0c 60"),
    (2, 0xE5B8, "20 cd eb 22 04 80 02 22 8e da 00 60"),
    (2, 0xE5C4, "20 cd eb 22 04 80 02 22 8a da 00 a9 26 00 8d 4e 08 22 08 80 02 60"),
    (1, 0x917A, "ad 18 0c f0 20 29 08 00 f0 01 60 af 8c 01 7f aa bf ce 01 7f aa e0 02 0a f0 01 60 ad 18 0c 09 08 00 8d 18 0c 60"),
    (5, 0xF00C, "e0 08 60 82 66 16 54 0c e0 47 2e 2a e0 a6 5a cc e2 58 e0 e8 36 0c e0 8b 49 26 31 11 1d 2a 0e cc 24 56 33 0c 24 1b 36 e0 80 e0 16 36 35 55 cc e0 71 2c e0 09 17 55 49 22 2a 0e 00"),
    (5, 0xF047, "0c 0c 88 a8 6e aa 5f cc e0 26 e0 3f 39 e0 34 16 54 0c 53 58 1e 3e 39 cc e0 c4 e0 b7 17 59 18 e0 09 17 55 49 22 2a 0e 00"),
    (5, 0xF06F, "e0 01 2e 31 18 2a 0c e0 08 60 82 66 5a cc e1 04 e0 ca 22 31 4a 5b 35 32 cc e0 02 44 49 22 2a 0e cc 0c cc 0c 0c 0c 0c 15 59 55 00"),
)
MESSAGES = (
    (0x03C8, 0x02F00C, "Eel medicine is given to the doctor; he recovers and stands."),
    (0x03CA, 0x02F047, "The villagers cheer."),
    (0x03CC, 0x02F06F, "The giant eel is cooked, everyone eats together, and the text ends with おわり."),
)


def lorom(bank: int, address: int) -> int:
    if not 0 <= bank <= 0x7F or not 0x8000 <= address <= 0xFFFF:
        raise ValueError("Invalid lower-bank LoROM address")
    return bank * 0x8000 + address - 0x8000


def verify_identity(rom: bytes) -> dict[str, object]:
    identity = {"sizeBytes": len(rom), "sha1": hashlib.sha1(rom).hexdigest(),
                "sha256": hashlib.sha256(rom).hexdigest(), "header": "none"}
    if (identity["sizeBytes"], identity["sha1"], identity["sha256"]) != (
        ROM_SIZE, ROM_SHA1, ROM_SHA256
    ):
        raise ValueError("Requires the supplied headerless original Japanese ROM")
    return identity


def verify_fingerprint(rom: bytes, entry: tuple) -> dict[str, str]:
    bank, address, expected_hex = entry
    expected = bytes.fromhex(expected_hex)
    offset = lorom(bank, address)
    if rom[offset:offset + len(expected)] != expected:
        raise ValueError(f"ROM mismatch at {bank:02X}:{address:04X}")
    return {"cpu": f"{bank:02X}:{address:04X}", "fileOffset": f"0x{offset:06X}",
            "bytes": expected.hex(" ")}


def message_evidence(rom: bytes) -> list[dict[str, str]]:
    word = lambda at: int.from_bytes(rom[at:at + 2], "little")
    table = 0x20000 + word(0x28016)
    result = []
    for message_id, expected_offset, meaning in MESSAGES:
        actual = 0x20000 + word(table + message_id)
        if actual != expected_offset:
            raise ValueError(f"Message {message_id:04X} pointer mismatch")
        result.append({"id": f"{message_id:04X}", "fileOffset": f"0x{actual:06X}",
                       "meaning": meaning, "reading": "Original-ROM glyph reading; not runtime replay"})
    return result


def route_evidence() -> dict[str, object]:
    return {
        "fishId": "3B",
        "storagePath": {"branch": "01:85E4..85FC", "storyBitProducer": "01:917A",
                        "basketStore": "01:8AC3..8AD8", "activeFishRemoval": "01:8DFE..8E1D"},
        "returnRoute": {"stage": 1, "point": {"x": 12, "y": 189},
                        "destinationMapId": 7, "destinationPoint": {"x": 7, "y": 77},
                        "gate": "00:9E62..9E7E requires $0C18 == 0x000F and matching village return",
                        "actionState": "0D", "scene": "00:825E -> 02:DF94 -> 02:EC10 -> 02:EC43",
                        "completionBitWriter": "02:EFAE..EFB4"},
        "limitations": [
            "Original Japanese ROM static control flow and dialogue, not a natural completion replay.",
            "Full ordinary-save progression and Thai-patch equivalence were not independently verified.",
            "No separate doctor NPC hand-in transaction or exact reward is established.",
            "Scene text does not establish eel consumption or every inventory/HP/money helper effect.",
            "A caught eel alone does not guarantee the return scene; story prerequisites remain required.",
        ],
    }


def build(rom: bytes) -> dict[str, object]:
    identity = verify_identity(rom)
    checks = [verify_fingerprint(rom, entry) for entry in FINGERPRINTS]
    return {"schemaVersion": 1, "rom": identity, "evidenceType": "rom_code_and_dialogue_trace",
            "sources": ["docs/quest-tool-use-research.md", "scripts/verify_giant_eel_ending_route.py"],
            **route_evidence(), "messages": message_evidence(rom), "checks": checks}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    rendered = json.dumps(build(args.rom.read_bytes()), ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")


if __name__ == "__main__":
    main()
