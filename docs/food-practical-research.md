# Practical food consumers from the original ROM

ROM SHA-1: `c2103dd94e2a1a65a495fc02adc2e7d040f31212`. This supplements the [earlier controlled food observations](../data/food-effects-confirmed.json). No external guide is used.

## Food menu and consumption

`03:B94C..B96C` compares current HP `0862` to maximum HP `0864` before calling the eating routine. If equal, it displays message `012A` and does not consume the item. Ordinary eating at `03:B9E7` loads the selected food, compacts the food selector, and proceeds to its effect.

`03:BA93..BACC` adds the loaded recovery value to current HP, then clamps it to maximum HP. Thus missing HP determines how much is actually recovered; a 40-HP food with only 5 missing gives 5.

## Eating the first stored fish

The Fish menu preview at `03:B9D3..B9E2` reads species from `0B7A`, the first keepnet slot. `03:BA2D..BA55` reads that same first species and size `0BB6`. Two LSR instructions divide size by four, rounding down; if zero, the routine substitutes one. It removes the first fish and shifts the remaining species/size records left (`03:BA64..BA7D`), then uses the common HP recovery path.

The stored size is the centimetre value shown for the catch: `04:8717..871B` copies the current fish size unchanged into the catch state, `01:8AD5..8ADA` copies it unchanged into the keepnet record, and `02:AA5F..AA7A` formats that integer as centimetres. The later size-path trace and its ROM fingerprints are recorded in [fish-location research](fish-location-research.md#evidence-limits), [water-surface mark research](water-surface-icons.md), and [rom-water-icons.json](../data/rom-water-icons.json).

For an ordinary fish, the ROM therefore restores `floor(displayed size in cm / 4)`, with a minimum of 1 HP. Examples: 20 cm → 5 HP, 40 cm → 10 HP, and 100 cm → 25 HP. The common recovery path still caps the result at the amount of HP missing. This gives the player a direct estimate from the displayed fish size before deciding whether to eat the first catch or preserve it.

This is not a free-choice fish selector: check the displayed first-fish name before confirming. The controlled observations remain historical samples: six species at size 30 all restored 7 HP, and one species was sampled at sizes 4 through 200. Those samples agree with the traced ordinary-fish arithmetic but do not expand the recorded runtime sample set.

## Kusafugu exception

Before the size formula, `03:BA36..BA3E` compares the first species with `3F` (クサフグ / Kusafugu) and jumps to `03:BB16` on equality. That routine removes the fish, displays the meal text, sets current HP to zero at `03:BB27`, displays message `0130`, increments the event flag and sets action state `0B`. Thus the old generic statement that any fish restores HP omitted a concrete dangerous exception.

Poison mushroom `0A` separately branches to `03:BB4C`, also sets HP to zero and enters state `0B`. This matches the earlier original-ROM execution. Ordinary mushroom `09` recovers 10 HP from its food record.

## Buying food

The six shop foods recover 5/10/15/20/30/40 HP and their ROM prices are 5/10/15/20/30/40 yen respectively. Each costs 1 yen per nominal HP. The maximum-HP clamp means excess recovery is not credited; selecting an amount near the missing HP avoids that waste. See [shop stock](shop-stock-research.md) for the areas selling each food.

## Player decision for unidentified mushrooms

Controlled menu captures give both mushroom records the same Japanese display name, while one restores 10 HP and the other sets HP to zero. Therefore, when the player cannot identify their mushroom, the catalogue now recommends shop food for recovery and links to orange 01 (5 HP / 5 yen with recorded seller locations). This is a conservative recovery choice from the observed effects, not a new mushroom-identification mechanic.
