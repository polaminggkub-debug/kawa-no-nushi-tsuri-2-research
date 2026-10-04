import json
from pathlib import Path

from .rom_helpers import EXPECTED_SHA1, fish_rows, verify_fingerprints, verify_rom
from .trace_data import build_trace


def build(rom, fish_index_path):
    verify_rom(rom)
    fish_index = json.loads(Path(fish_index_path).read_text(encoding="utf-8"))
    if fish_index.get("rom_sha1") != EXPECTED_SHA1:
        raise ValueError("Fish-name index does not match the supplied ROM SHA-1")
    fingerprints = verify_fingerprints(rom)
    rows = fish_rows(rom, fish_index)
    return build_trace(rom, fish_index, fingerprints, rows)
