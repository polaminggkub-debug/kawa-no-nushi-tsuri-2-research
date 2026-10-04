from .rom_helpers import EXPECTED_SHA1, FISH_ID_TABLE, FISH_X_TABLE, FISH_Y_TABLE, word


def angler_menu():
    return {
        "promptJa": "誰が釣りにでかけますか？",
        "promptEn": "Who will go fishing?",
        "sourceEvidence": "Original-ROM runtime capture at rom-analysis/gold-net-shallow-spots/natural-route/new-game-screen.png; capture manifest new-game.json identifies the supplied ROM. The image is not redistributed.",
        "choices": [
            {"slot": 1, "position": "top-left", "roleJa": "兄", "nameJa": "太郎", "nameEn": "Taro", "age": 10},
            {"slot": 2, "position": "top-right", "roleJa": "妹", "nameJa": "京子", "nameEn": "Kyoko", "age": 6},
            {"slot": 3, "position": "bottom-left", "roleJa": "父", "nameJa": "雄三", "nameEn": "Yuzo", "age": 38},
            {"slot": 4, "position": "bottom-right", "roleJa": "母", "nameJa": "紀子", "nameEn": "Noriko", "age": 35},
        ],
        "selectorCode": {"entry": "01:9DF7 calls the four-way selector at 01:9EBA", "cursor": "At 01:9EC7, controller mask $0C00 toggles $16BE bit 1; mask $0300 toggles bit 0", "commit": "01:9F17..9F30 stores $0860 = $16BE + 1", "initialPosition": "The new-game capture highlights the top-left choice. Starting at cursor index 0, horizontal/vertical toggles map values 1-4 to the 2x2 positions."},
        "limit": "Names and ages are transcribed from the ROM-derived menu capture; no menu image is included in the publication.",
    }


def story_text():
    return {
        "slot1": ["0364: [CD] tells a story about catching the River Master.", "0366: names Akame and describes red eyes, a silver body, and a large fish."],
        "slot2": ["0376: [CD] tells a story about catching the River Master.", "0378: names Tanago and describes a small, flat fish."],
        "slot3": ["039A: [CD] tells a story about catching the River Master.", "039C: names Namazu and describes a large, heavy, sticky fish."],
        "slot4": ["0388: [CD] says the character cooked and ate the River Master; this line does not name the fish."],
        "substitution": "[CD] is the dynamically saved character name placeholder.",
        "areaNamesJa": {"0072": "湖", "0074": "下流", "0076": "河口"},
        "source": "Messages rendered from the supplied ROM pointer table and font with publication/scripts/render_rom_messages.py.",
    }


def route_tables(rom):
    exits = []
    destinations = []
    for index in range(5):
        source = 0x9FB9 + index * 4
        dest = 0xA049 + index * 4
        exits.append({"x": word(rom, 0x00, source), "y": word(rom, 0x00, source + 2)})
        destinations.append({"mapId": 7, "x": word(rom, 0x00, dest), "y": word(rom, 0x00, dest + 2)})
    return exits, destinations


def prerequisite_routes(exits, destinations):
    return [
        {"state": "0x0C", "calls": ["00:8259", "02:DF8C", "02:E5F5..E652", "02:E643..E649"], "effect": "$0C18 |= 0x02", "condition": "$0C18 == 0x0001; destination map 7; destination Y 13", "matchingTransition": {"sourceArea": 1, "source": {"x": 8, "y": 183}, "destination": {"mapId": 7, "x": 7, "y": 13}}, "sourceExitRows": exits, "destinationRows": destinations, "limit": "The route and state condition are ROM-backed; this does not establish what natural action queues the prerequisite or whether a fish must be landed."},
        {"state": "0x0D", "calls": ["00:825E", "02:DF94", "02:EC10..EC42", "02:EC33..EC39"], "effect": "$0C18 |= 0x02", "condition": "$0C18 == 0x000F; destination map 7; destination Y 77", "matchingTransition": {"sourceArea": 1, "source": {"x": 12, "y": 189}, "destination": {"mapId": 7, "x": 7, "y": 77}}, "effectOnMagnetHeading": "No new unlock: 0x000F already contains mask 0x04 before this state runs.", "limit": "This is a later flag combination, not a proven named quest."},
    ]


def story_gate(rom, exits, destinations):
    return {
        "wram": "$7E:0C18",
        "headingMask": "0x04",
        "prerequisiteMask": "0x02",
        "headingSetter": {"cpu": "01:DEB6..DEBB", "operation": "LDA $0C18; ORA #$0004; STA $0C18", "condition": "prerequisite bit 0x02 set; heading bit 0x04 clear; at least 0x41 nonzero records"},
        "prerequisiteRoutes": prerequisite_routes(exits, destinations),
        "recordArray": {"start": "$7E:0DC8", "endInclusive": "$7E:0E4A", "entryCount": 66, "entrySizeBytes": 2, "thresholdNonzeroEntries": 65, "IDs": "0x01..0x42", "writer": "01:8B00..8C8F writes a new raw size only when it exceeds the previous per-ID record", "meaning": "65 distinct nonzero per-ID record slots, not 65 catches; the trace does not establish the natural action that fills a slot."},
        "magnetConsumer": {"cpu": "03:C3C8..C3CF", "condition": "$0C18 & 0x04"},
        "literalOneWriters": ["01:9123", "01:9137", "01:91B9", "01:91CC"],
        "writerContext": {"selectors1and2": "Ordinary update/fishing callback checks active fish ID <= 0x42, selector, and indexed active row offset.", "selectors3and4": "Result callback runs after the record updater and requires its $10 == 1 branch, then checks selector and indexed active row offset.", "selectorMapping": "Slot 1=Akame row; 2=Tanago row; 3=Namazu row; 4=Koi row, as listed in characterFishRows.", "limit": "No callback explicitly tests a landed-catch result. The evidence does not prove bite versus landing, a unique route, or a player action named as a quest."},
    }


def magnet_target(rom, fish_index):
    sentinel = [word(rom, 0x00, 0xA08D), word(rom, 0x00, 0xA08F)]
    fish_id = word(rom, 0x0C, FISH_ID_TABLE + 0x0A02)
    x = word(rom, 0x0C, FISH_X_TABLE + 0x0A02)
    y = word(rom, 0x0C, FISH_Y_TABLE + 0x0A02)
    if sentinel != [0x00FF, 0x00FF] or (fish_id, x, y) != (0x3B, 41, 8):
        raise ValueError("Area 6 dynamic target no longer matches expected fish row")
    fish = next(item for item in fish_index["fish"] if int(item["id_hex"], 16) == fish_id)
    return {"sentinelAt": ["00:A08D", "00:A08F"], "sentinel": ["0x00FF", "0x00FF"], "dynamicWords": ["$7E:DE02", "$7E:EA02"], "sourceFishTableRow": 1, "fishId": "0x3B", "fishNameJa": fish["name_ja"], "x": x, "y": y, "limit": "The dynamic target equals Area 6 fish-location row 1; this equality alone does not prove a named story objective or normal route."}


def player_fish_rows(rows):
    return {
        "source": "04:E85A loads fish ID from $0C:C800 plus the active $7F:01CE byte offset; callbacks compare that same offset.",
        "units": "Offsets are bytes; a fish-ID row is two bytes and each map set spans 0x200 bytes.",
        "anglerMenu": angler_menu(),
        "rows": rows,
        "relatedStoryMessages": story_text(),
        "actionabilityLimit": "These four fish rows are ROM-backed associations with selector branches. The static trace does not prove that catching one is a sufficient or necessary player action for the story flag.",
    }


def build_trace(rom, fish_index, fingerprints, rows):
    exits, destinations = route_tables(rom)
    return {
        "schemaVersion": 1,
        "rom": {"sizeBytes": len(rom), "sha1": EXPECTED_SHA1},
        "scope": "Bounded static trace against the supplied Japanese ROM plus a ROM-derived runtime menu capture. No external guide, ROM, emulator core, save state, or image is bundled.",
        "characterFishPrerequisites": player_fish_rows(rows),
        "storyGate": story_gate(rom, exits, destinations),
        "area6MagnetTarget": magnet_target(rom, fish_index),
        "sourceFingerprints": fingerprints,
    }
