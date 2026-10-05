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

### Preserve a giant eel intended for the doctor

If keeping an オオウナギ / giant eel (`3B`) for the doctor's request, do not select the fish meal when that eel is the first fish shown. Use other food for HP recovery. The meal consumer does not protect the giant eel: it checks only the poisonous species `3F`, then calculates ordinary recovery and calls the first-slot removal routine. This advice preserves a fish the player intends to keep; it does not establish a delivery location, a reward, or the exact event needed to finish the request. For the conditional automatic village-return scene after the request, see [giant-eel ending-route research](quest-tool-use-research.md#after-catching-the-requested-giant-eel-return-to-the-starting-village).

The doctor's request is explicit in original-ROM message `01E0` (text file offset `02D260`): `大ウナギを 早く / やぶ医者に 食べさせて / あげてください。` The separate town-sale path calls `03:A2BA` from `03:A11C`. While story bit `0x10` at `$0C18` is clear, it temporarily removes **one** stored `3B`, saves its size in `$1D53`, and restores it through `03:A375` after the sale. That bounded sale protection must not be generalized to voluntary eating, multiple eels, or later story states.

Reproducible LoROM fingerprints, checked against the SHA-1 above:

| Code location | Bytes | Meaning |
| --- | --- | --- |
| `03:BA2D` | `AD 7A 0B 8D E8 11 20 6D D2 AD E8 11 C9 3F 00` | Read first keepnet species, prepare its name, compare only with Kusafugu. |
| `03:BA3C` | `D0 03 4C 16 BB AD B6 0B 4A 4A` | Ordinary species reaches stored-size division; poisonous fish takes the exception. |
| `03:BA55` | `20 64 BA` | Call first-slot removal after ordinary meal text. |
| `03:BA64` | `A2 00 00 BD 7C 0B 9D 7A 0B BD B8 0B 9D B6 0B` | Shift subsequent species and sizes over the consumed first fish. |
| `03:A2BA` | `9C 51 1D 9C 53 1D AD 18 0C 29 10 00 D0 46` | Sale filter's separate story-bit gate. |
| `03:A2CB` | `B9 7A 0B C9 3B 00 D0 34 8D 51 1D B9 B6 0B 8D 53 1D` | Cache one giant eel and its size for sale protection. |
| `03:A159` | `20 75 A3` | Sale completion calls the eel restoration routine. |

These are static consumer traces. No new natural giant-eel meal or full quest replay is claimed.

## Kusafugu exception

Before the size formula, `03:BA36..BA3E` compares the first species with `3F` (クサフグ / Kusafugu) and jumps to `03:BB16` on equality. That routine removes the fish, displays the meal text, sets current HP to zero at `03:BB27`, displays message `0130`, increments the event flag and sets action state `0B`. Thus the old generic statement that any fish restores HP omitted a concrete dangerous exception.

Poison mushroom `0A` separately branches to `03:BB4C`, also sets HP to zero and enters state `0B`. This matches the earlier original-ROM execution. Ordinary mushroom `09` recovers 10 HP from its food record.

## Buying food

The six shop foods recover 5/10/15/20/30/40 HP and their ROM prices are 5/10/15/20/30/40 yen respectively. Each costs 1 yen per nominal HP. The maximum-HP clamp means excess recovery is not credited; selecting an amount near the missing HP avoids that waste. See [shop stock](shop-stock-research.md) for the areas selling each food.

## Player decision for unidentified mushrooms

Controlled menu captures give both mushroom records the same Japanese display name, while one restores 10 HP and the other sets HP to zero. Therefore, when the player cannot identify their mushroom, the catalogue now recommends shop food for recovery and links to orange 01 (5 HP / 5 yen with recorded seller locations). This is a conservative recovery choice from the observed effects, not a new mushroom-identification mechanic.
