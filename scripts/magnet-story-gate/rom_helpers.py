import hashlib

from .fingerprints import FINGERPRINTS

EXPECTED_SIZE = 1_572_864
EXPECTED_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
FISH_ID_TABLE = 0xC800
FISH_X_TABLE = 0xD400
FISH_Y_TABLE = 0xE000
FISH_MAP_STRIDE = 0x200


def rom_offset(bank, address):
    if not 0x8000 <= address <= 0xFFFF:
        raise ValueError(f"Not a LoROM address: {bank:02X}:{address:04X}")
    return bank * 0x8000 + address - 0x8000


def verify_fingerprint(rom, bank, address, expected_hex):
    expected = bytes.fromhex(expected_hex)
    offset = rom_offset(bank, address)
    actual = rom[offset:offset + len(expected)]
    if actual != expected:
        raise ValueError(f"ROM fingerprint mismatch at {bank:02X}:{address:04X}")
    return {"cpu": f"{bank:02X}:{address:04X}", "fileOffset": f"0x{offset:06X}", "bytes": actual.hex(" ")}


def word(rom, bank, address):
    offset = rom_offset(bank, address)
    return int.from_bytes(rom[offset:offset + 2], "little")


def verify_rom(rom):
    if len(rom) != EXPECTED_SIZE or hashlib.sha1(rom).hexdigest() != EXPECTED_SHA1:
        raise ValueError("Requires the supplied headerless Japanese original ROM")


def verify_fingerprints(rom):
    return [verify_fingerprint(rom, bank, address, data) for bank, address, data in FINGERPRINTS]


def fish_rows(rom, fish_index):
    contexts = [(1, 0x0A00, 0x37), (2, 0x0800, 0x39), (3, 0x0600, 0x26), (4, 0x0802, 0x0D)]
    rows = []
    for slot, table_offset, expected_id in contexts:
        map_index, within_map = divmod(table_offset, FISH_MAP_STRIDE)
        if within_map % 2:
            raise ValueError("Fishing context is not aligned to a fish-table row")
        row_index = within_map // 2
        fish_id = word(rom, 0x0C, FISH_ID_TABLE + table_offset)
        x = word(rom, 0x0C, FISH_X_TABLE + table_offset)
        y = word(rom, 0x0C, FISH_Y_TABLE + table_offset)
        if fish_id != expected_id:
            raise ValueError(f"Angler slot {slot} expected fish ID {expected_id:02X}, got {fish_id:02X}")
        fish = next(item for item in fish_index["fish"] if int(item["id_hex"], 16) == fish_id)
        rows.append({"characterSlot": slot, "activeFishTableOffset": f"0x{table_offset:04X}", "mapSet": map_index + 1, "mapNameJa": {4: "湖", 5: "下流", 6: "河口"}.get(map_index + 1), "row": row_index, "fishId": f"0x{fish_id:02X}", "fishNameJa": fish["name_ja"], "x": x, "y": y})
    return rows
