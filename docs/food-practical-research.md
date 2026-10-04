# Practical food consumers from the original ROM

ROM SHA-1: `c2103dd94e2a1a65a495fc02adc2e7d040f31212`. This supplements the [earlier controlled food observations](../data/food-effects-confirmed.json). No external guide is used.

## Food menu and consumption

`03:B94C..B96C` compares current HP `0862` to maximum HP `0864` before calling the eating routine. If equal, it displays message `012A` and does not consume the item. Ordinary eating at `03:B9E7` loads the selected food, compacts the food selector, and proceeds to its effect.

`03:BA93..BACC` adds the loaded recovery value to current HP, then clamps it to maximum HP. Thus missing HP determines how much is actually recovered; a 40-HP food with only 5 missing gives 5.

## Eating the first stored fish

The Fish menu preview at `03:B9D3..B9E2` reads species from `0B7A`, the first keepnet slot. `03:BA2D..BA55` reads that same first species and size `0BB6`. Two LSR instructions divide size by four, rounding down; if zero, the routine substitutes one. It removes the first fish and shifts the remaining species/size records left (`03:BA64..BA7D`), then uses the common HP recovery path.

This is not a free-choice fish selector: check the displayed fish name before confirming. The integer size unit has not yet been mapped to its displayed catch unit, so the formula is identified as a stored-size formula, with numerical examples. The previously observed 30 → 7 and larger-size samples agree with this code.

## Kusafugu exception

Before the size formula, `03:BA36..BA3E` compares the first species with `3F` (クサフグ / Kusafugu) and jumps to `03:BB16` on equality. That routine removes the fish, displays the meal text, sets current HP to zero at `03:BB27`, displays message `0130`, increments the event flag and sets action state `0B`. Thus the old generic statement that any fish restores HP omitted a concrete dangerous exception.

Poison mushroom `0A` separately branches to `03:BB4C`, also sets HP to zero and enters state `0B`. This matches the earlier original-ROM execution. Ordinary mushroom `09` recovers 10 HP from its food record.

## Buying food

The six shop foods recover 5/10/15/20/30/40 HP and their ROM prices are 5/10/15/20/30/40 yen respectively. Each costs 1 yen per nominal HP. The maximum-HP clamp means excess recovery is not credited; selecting an amount near the missing HP avoids that waste. See [shop stock](shop-stock-research.md) for the areas selling each food.
