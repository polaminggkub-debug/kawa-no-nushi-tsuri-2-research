# Practical food consumers from the original ROM

> **Corrected 2026-10-07** (independent ROM and emulator audit): the food menu hides the first giant eel while the ending is not done (a second eel is not protected), so the old "do not eat the first fish if it is the eel" warning is removed; the two mushrooms share a name but have different icons (tan flat = heals 10, red with yellow spots = poison); maximum HP starts at 100 and grows to about 190; and 0 HP is a mild penalty. Details are marked *Corrected 2026-10-07* below.

ROM SHA-1: `c2103dd94e2a1a65a495fc02adc2e7d040f31212`. This supplements the [earlier controlled food observations](../data/food-effects-confirmed.json). No external guide is used.

## Food menu and consumption

`03:B94C..B96C` compares current HP `0862` to maximum HP `0864` before calling the eating routine. If equal, it displays message `012A` and does not consume the item. Ordinary eating at `03:B9E7` loads the selected food, compacts the food selector, and proceeds to its effect.

`03:BA93..BACC` adds the loaded recovery value to current HP, then clamps it to maximum HP. Thus missing HP determines how much is actually recovered; a 40-HP food with only 5 missing gives 5.

## Eating the first stored fish

The Fish menu preview at `03:B9D3..B9E2` reads species from `0B7A`, the first keepnet slot. `03:BA2D..BA55` reads that same first species and size `0BB6`. Two LSR instructions divide size by four, rounding down; if zero, the routine substitutes one. It removes the first fish and shifts the remaining species/size records left (`03:BA64..BA7D`), then uses the common HP recovery path.

The stored size is the centimetre value shown for the catch: `04:8717..871B` copies the current fish size unchanged into the catch state, `01:8AD5..8ADA` copies it unchanged into the keepnet record, and `02:AA5F..AA7A` formats that integer as centimetres. The later size-path trace and its ROM fingerprints are recorded in [fish-location research](fish-location-research.md#evidence-limits), [water-surface mark research](water-surface-icons.md), and [rom-water-icons.json](../data/rom-water-icons.json).

For an ordinary fish, the ROM therefore restores `floor(displayed size in cm / 4)`, with a minimum of 1 HP. Examples: 20 cm → 5 HP, 40 cm → 10 HP, and 100 cm → 25 HP. The common recovery path still caps the result at the amount of HP missing. This gives the player a direct estimate from the displayed fish size before deciding whether to eat the first catch or preserve it.

This is not a free-choice fish selector: check the displayed first-fish name before confirming. The controlled observations remain historical samples: six species at size 30 all restored 7 HP, and one species was sampled at sizes 4 through 200. Those samples agree with the traced ordinary-fish arithmetic but do not expand the recorded runtime sample set.

### The first giant eel is hidden from the food menu

*Corrected 2026-10-07.* An earlier version of this page said the meal does not protect the giant eel and told players not to eat the first fish when it was the eel. That was wrong. The food menu calls the same hiding routine as the town sale path (`03:B871` calls `03:A2BA`). While story bit `0x10` at `$0C18` is clear, it temporarily removes **one** stored `3B`, saves its size in `$1D53`, and puts it back afterwards (`03:B8B3`; the sale path restores it through `03:A375`). So the meal eats the first fish *after* the hidden eel, and a player cannot lose the first giant eel by eating. A **second** stored giant eel is not hidden and would be eaten. The Fish entry is also absent from the food menu when all 16 food slots are full.

The eel does not have to be kept for the ending. Story bit `0x08` is set at the catch itself, so selling or keeping the eel afterwards makes no difference to the ending; see [giant-eel ending-route research](quest-tool-use-research.md#after-catching-the-requested-giant-eel-return-to-the-starting-village). The doctor's request is explicit in original-ROM message `01E0` (text file offset `02D260`): `大ウナギを 早く / やぶ医者に 食べさせて / あげてください。`

Reproducible LoROM fingerprints, checked against the SHA-1 above:

| Code location | Bytes | Meaning |
| --- | --- | --- |
| `03:BA2D` | `AD 7A 0B 8D E8 11 20 6D D2 AD E8 11 C9 3F 00` | Read first keepnet species, prepare its name, compare only with Kusafugu. |
| `03:BA3C` | `D0 03 4C 16 BB AD B6 0B 4A 4A` | Ordinary species reaches stored-size division; poisonous fish takes the exception. |
| `03:BA55` | `20 64 BA` | Call first-slot removal after ordinary meal text. |
| `03:BA64` | `A2 00 00 BD 7C 0B 9D 7A 0B BD B8 0B 9D B6 0B` | Shift subsequent species and sizes over the consumed first fish. |
| `03:A2BA` | `9C 51 1D 9C 53 1D AD 18 0C 29 10 00 D0 46` | Story-bit gate that hides the first giant eel (used by the sale path and, per the 2026-10-07 audit, by the food menu at `03:B871`). |
| `03:A2CB` | `B9 7A 0B C9 3B 00 D0 34 8D 51 1D B9 B6 0B 8D 53 1D` | Cache one giant eel and its size for sale protection. |
| `03:A159` | `20 75 A3` | Sale completion calls the eel restoration routine. |

These are static consumer traces. No new natural giant-eel meal or full quest replay is claimed.

## Kusafugu exception

Before the size formula, `03:BA36..BA3E` compares the first species with `3F` (クサフグ / Kusafugu) and jumps to `03:BB16` on equality. That routine removes the fish, displays the meal text, sets current HP to zero at `03:BB27`, displays message `0130`, increments the event flag and sets action state `0B`. Thus the old generic statement that any fish restores HP omitted a concrete exception. The 2026-10-07 audit also measured what 0 HP does: the player blacks out, wakes at the saved position with 1 HP, and keeps money, fish and tools. So eating a Kusafugu wastes the fish and costs a blackout, but it is not a game-ending penalty.

Poison mushroom `0A` separately branches to `03:BB4C`, also sets HP to zero and enters state `0B`. This matches the earlier original-ROM execution. Ordinary mushroom `09` recovers 10 HP from its food record.

## Buying food

The six shop foods recover 5/10/15/20/30/40 HP and their ROM prices are 5/10/15/20/30/40 yen respectively. Each costs 1 yen per nominal HP. The maximum-HP clamp means excess recovery is not credited; selecting an amount near the missing HP avoids that waste. See [shop stock](shop-stock-research.md) for the areas selling each food.

## Telling the two mushrooms apart

*Corrected 2026-10-07.* An earlier version said the two mushrooms could not be told apart. They share the menu name `きのこ`, but their **icons differ**: item `09` is a tan, flat mushroom that heals 10 HP; item `0A` is red with yellow spots and sets HP to 0. The player should look at the icon before eating. The catalogue still links to orange 01 (5 HP / 5 yen with recorded seller locations) as a safe shop alternative when in doubt.

## HP facts (2026-10-07 audit)

- **Maximum HP** starts at 100. Catching a newt, frog, crayfish, turtle, softshell turtle or crab gives experience (20/30/40/50/70/60) and maximum HP rises in steps of 1 (message `0200`), up to about 190 at 50,000 experience (`01:9229`, `03:D80F`, table `03:D827`). "Full HP" therefore means the player's own maximum, not always 100.
- **Drains:** swimming costs 1 HP per 32 frames; rowing the tub or canoe costs 1 HP per tile; walking is free. Losing tackle in a fight costs 1 to 4 HP.
- **Warning and 0 HP:** at 10 HP the game warns that the player will run out of strength. At 0 HP the player blacks out, wakes at the saved position with 1 HP and keeps money, fish and tools.
- **Fight:** HP is not read by the fight loop. The only effect on fishing is aim time, which scales linearly with HP below 100 for casting and lure rods only (cutoff 120 becomes 120/118/96/60/24/10 at HP 100/99/80/50/20/at most 8).
- **Foods** heal 5/10/15/20/30/40 (daikon 40, mushroom 10) and are capped at maximum HP. The fish meal heals `floor(cm / 4)`, minimum 1. At full HP the menu refuses to eat. Milk is a full heal, and the area-3 cow refills the bottle with no limit.
