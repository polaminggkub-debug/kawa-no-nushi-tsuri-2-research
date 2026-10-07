"""Facts behind the rod, hook and float advice, read from the measured gear-effects data."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
LANGS = ("th", "en", "ja")
FLOAT_IDS = range(1, 9)
SINKER_IDS = (9, 10)
METHOD_OF_STYLE = {1: "float", 2: "casting", 4: "lure", 8: "fly"}


def load(relative):
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def hexid(number):
    return f"{number:02X}"


def band_of(fish):
    """The size band (0: up to 15 cm, 1: 16-35 cm, 2: over 35 cm) most of the fish's sizes fall in."""
    counts = fish["n"]
    return max(range(3), key=lambda band: (counts[band], band))


class Facts:
    def __init__(self):
        self.effects = load("data/gear-effects.json")
        self.fish = {int(fid): row for fid, row in self.effects["fish"].items()}
        names = load("data/fight-policies.json")["names"]["fish"]
        self.names = {int(fid): row for fid, row in names.items()}
        gallery = load("catalogue/gallery-data.json")
        self.items = {(item["category"], item["id"]): item for item in gallery["items"]}
        stock = load("data/shop-stock-rom.json")["items"]
        self.stock = {key: sorted({int(shop["stage"]) for shop in shops}) for key, shops in stock.items()}
        self.rods = self._rods()
        self.hooks = self._kind("hook", "hook")
        self.floats = self._floats()

    def fish_name(self, lang, fid):
        name = self.names[fid][lang]
        return name.split(" / ")[0] if lang == "th" else name

    def fish_names(self, lang, fids, limit):
        return [self.fish_name(lang, fid) for fid in list(fids)[:limit]]

    def band_fish(self, band, method="float"):
        """Fish that can be fished with the method and whose sizes lie in one band."""
        return [
            fid
            for fid, row in sorted(self.fish.items())
            if method in row["methods"] and band_of(row) == band
        ]

    def _kind(self, kind, label):
        rows = {}
        for number, row in self.effects["items"][kind].items():
            number = int(number)
            item = self.items[(label, hexid(number))]
            rows[number] = {**row, "id": number, "hex": hexid(number), "item": item}
        return rows

    def _rods(self):
        rods = self._kind("rod", "rod")
        for number, rod in rods.items():
            fields = rod["item"]["decodedFields"]
            rod["aim"] = fields["castAimHoldCutoffInternal"]
            rod["style"] = fields["styleCode"]
            rod["method"] = METHOD_OF_STYLE[rod["style"]]
            rod["sold"] = bool(rod["areas"])
        return rods

    def _floats(self):
        floats = {}
        for number in [*FLOAT_IDS, *SINKER_IDS]:
            key = hexid(number)
            item = self.items[("float_weight", key)]
            areas = self.stock.get(f"float_weight:{key}", [])
            floats[number] = {"id": number, "hex": key, "yen": item["priceYen"], "areas": areas, "item": item}
        return floats

    def fish_with_method(self, method):
        return [fid for fid, row in sorted(self.fish.items()) if method in row["methods"]]
