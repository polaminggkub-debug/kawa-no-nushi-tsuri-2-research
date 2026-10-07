# Magnifying-glass mushroom outcome: source trace

> **Audit 2026-10-07:** the find message does not name the mushroom, but the two foods have different icons (`09` tan and flat heals 10 HP; `0A` red with yellow spots sets HP to 0), so the player can tell them apart before eating.

## Scope and ROM identity

This is a bounded static trace of the supplied Japanese SFC ROM. It follows selected-item dispatch, the magnifying-glass handler, the mushroom ID branch, and the shared random-byte helper. It does not establish a naturally reachable or guaranteed “safe mushroom” tile, and it does not alter the ROM or runtime state.

- File size: 1,572,864 bytes, headerless LoROM
- SHA-1: `c2103dd94e2a1a65a495fc02adc2e7d040f31212`
- SHA-256: `e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49`
- Verifier: [`verify_magnifier_mushrooms.py`](../scripts/verify_magnifier_mushrooms.py)

Run it with:

```sh
python3 scripts/verify_magnifier_mushrooms.py /path/to/Kawa-no-Nushi-Tsuri-2-Japan-.sfc
```

The script checks the whole-ROM hashes, LoROM byte fingerprints for each traced branch, and the random lookup table's size, content hash, uniqueness, and low-bit counts.

## What the player does

The selected-use dispatcher at `03:BC6F..BC79` routes item ID `03` to `03:BDBD`, the magnifying-glass handler. The handler requires field action state `$0834 == 2`, rejects movement state `$0858 == 1` and states `>= 3`, and records the current tile in `$1D49/$1D4B`. Reusing the magnifier on that same tile jumps to the “nothing found” path (`03:BF19`).

For map/area IDs above `12`, the handler does not consult the ordinary terrain context `$1E97` or select a coordinate-specific mushroom result. It takes a random branch:

1. At `03:BE92`, the game calls `$00:DA92` and tests bit 0.
   - Bit 0 is **1**: it selects bait ID `0A` and goes through the normal bait-grant path.
   - Bit 0 is **0**: it checks `$0B58`. If that food-slot sentinel is nonzero, it returns through the no-result path. If it is zero, the game makes a second random-byte call.
2. At `03:BEE2`, the second call is masked with `AND #$0001`.
   - Bit 0 is **1**: it selects food ID `09`.
   - Bit 0 is **0**: it selects food ID `0A`.
3. The chosen food ID is stored in the food inventory at `$0B3A..$0B58`. The game sets message ID `0148`, `きのこを見つけた`, for either ID. The message does not distinguish the two kinds.

The exact type-selection fingerprint at `03:BEE2` is:

```text
22 92 DA 00 29 01 00 F0 05 A9 09 00 80 03 A9 0A 00 8D 88 12
```

The area gate starts by comparing `$085A` with `06` at `03:BE02`. The `> 6` path compares the same area value with `0C` at `03:BE75`; values `13+` take the random branch. Areas `7–12` instead inspect `($085E & 00F0) == 0010` and can select bait `0D`; other values take the no-result branch. This trace therefore establishes an area-class condition, not a named safe tile.

## Why the mushroom is not tile-guaranteed

`$00:DA92` is a four-byte trampoline (`JSR $EDE9; RTL`). The helper at `$00:EDE9`:

1. increments WRAM word `$7E:16AE`;
2. masks it to the low byte;
3. indexes a 256-byte ROM table at `$00:EDFA`;
4. returns that table byte.

It does not read map ID, X/Y position, or terrain. The caller's position logic only enforces the one-search-per-tile rule before reaching the area branch. Thus the mushroom *type* is selected by the shared sequence state, not a coordinate-specific “safe” location. The fixed table contains each byte value once and has 128 even and 128 odd values, but the result at any visit also depends on how many other calls have advanced the shared counter. No fixed percentage or stable per-tile result is claimed.

The code also has a separate random draw in the shared bait grant at `03:BFDE`: `DA92 & 3`, then `+1`, gives a bait quantity of 1–4. This quantity roll is separate from the food ID draw. The mushroom branch directly stores one food item and does not use that bait-quantity calculation.

## Practical implication and evidence boundary

There is no ROM-backed coordinate to pin as a guaranteed safe mushroom spot. If a player uses the magnifier on an eligible tile in area ID `13+`, the game may award bait, report no mushroom when the food-slot sentinel is occupied, or add food ID `09` or `0A`. Both food IDs produce the same discovery message and display label in the existing controlled captures.

The project's separate controlled food-effect record reports food `09` restores 10 HP and food `0A` sets HP to zero. See [`food-effects-confirmed.json`](../data/food-effects-confirmed.json) and [`food-practical-research.md`](food-practical-research.md). That is a separate runtime finding; this trace proves only how the original ROM chooses the item ID. The practical advice is therefore: do not treat any one location as guaranteeing the harmless mushroom, and do not eat an unidentified mushroom when avoiding the lethal outcome matters.

Unresolved here: the natural walkable route to each eligible area-13+ tile, the counter value when a particular player reaches it, and any player-facing UI method that reveals food ID `09` versus `0A` before eating. No map pin or safe-spot claim is made.
