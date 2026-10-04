# Practical choices for all 21 rods

This note explains the player-facing decisions in [rod-item-decisions.json](../data/rod-item-decisions.json). The source is the supplied original Japanese SFC ROM, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`, plus local ROM-derived item and shop records. No outside fishing guide is used.

## What these decisions compare

The rod table is at `05:A7F5`: 21 records, 12 bytes each. The two values used for recommendations have traced effects:

- Record `+2` is the aim-hold cutoff. The held input increments a counter until it reaches that cutoff or the player releases the button; the game then resolves the current target tile. This is time to adjust the target, not a cast distance or catch score (`04:D58C`, `04:D66B..D6EE`, `04:D056`). Lure and casting styles shorten this cutoff below 100 HP; restoring HP to 100 restores their raw cutoff (`04:D58C..D5B0`). Float/Ayu uses the raw cutoff. Fly also stores half the raw value, but that second threshold's separate effect is unresolved.
- Record `+3` is multiplied by `0x0150` (336) to set an internal fish-position threshold (`04:8721`). In one traced escape path, when the fight counter reaches `0x63`, the game compares fish position against that threshold; reaching it sets the tackle-loss state (`04:9C35..9C5C`). A larger multiplier therefore creates more room before this particular tackle-loss branch. It is not meters and does not prevent other escapes.

These effects are described separately. The data does not establish bite rate, a universal catch-success ranking, or a species pairing based on rod name, artwork, fish-ID field, or response code. No controlled fishing comparison was run for this work.

Prices in the decisions are full new-purchase quotes read from the ROM item records and used by the shop code. A difference between two quotes compares the cost of buying each rod new; it is not an upgrade fee or a discount for owning another rod. The six area stock lists come from decompressed ROM field blocks, and the additional fixed rod offers are tracked as `special_rod_shop` entries. A rod price field alone does not prove it is sold.

## Per-rod decision audit

“Aim” is the raw `+2` cutoff; the +3 column is the multiplier for the internal threshold above. Stock areas are the ROM-extracted shop offers; `*` denotes the fixed special-rod merchant. `No offer` means none appears in these extracted shop lists, not proof that no other acquisition route exists. `—` means no price is shown because no shop offer was found; an item-record price field is not presented as a purchase price.

| ID | Recorded offer price | Recorded shop areas | Aim / +3 | Decision shown on the item |
| --- | ---: | --- | ---: | --- |
| `01` | ¥500 | 5* | 10 / ×3 | Buy 04 instead at area 5: same price, both traced values higher. |
| `02` | — | No offer | 60 / ×8 | Keep if owned; 04 is the nearby listed choice, slightly lower on both values. |
| `03` | ¥350 | 1, 2, 4, 6 | 30 / ×5 | Cheapest area-1 float start; 04 costs ¥150 more new and improves both values. |
| `04` | ¥500 | 1, 2, 3, 5, 6 | 50 / ×7 | Strong area-1 choice; beats 05 on both values for ¥250 less and improves on 03. |
| `05` | ¥750 | 1, 2 | 40 / ×6 | Skip for these effects: 04 is cheaper and higher on both in the same areas. |
| `06` | — | No offer | 20 / ×4 | Keep if sufficient; no shop offer appears in the extracted lists. |
| `07` | ¥1,500 | 3, 5 | 70 / ×9 | Area 3: choose 14 at the same quote; area 5: choose 07 for aim or 08 for threshold. |
| `08` | ¥1,500 | 5* | 40 / ×24 | Lower full quote for the float group's maximum threshold; 15 buys more aim at ¥2,000. |
| `09` | ¥200 | 4, 5 | 30 / ×12 | Budget option in areas 4–5: lower aim than 04, higher threshold; ¥300 lower new quote. |
| `0A` | ¥500 | 1, 2, 3, 5, 6 | 70 / ×15 | Budget lure start; in areas 1–3 and 6, 0C costs ¥100 more new and raises both values. |
| `0B` | — | No offer | 80 / ×18 | Keep if sufficient; no shop offer appears in the extracted lists. |
| `0C` | ¥600 | 1, 2, 3, 4, 6 | 100 / ×21 | Buy for a longer aim window than 0A; 0D is available only in area 4. |
| `0D` | ¥650 | 4* | 120 / ×24 | Lure style's highest values for the two traced effects. |
| `0E` | ¥250 | 1, 3, 4, 5, 6 | 70 / ×18 | Lowest-price casting start; 0F raises both values where both are stocked. |
| `0F` | ¥600 | 2, 4, 5, 6 | 100 / ×21 | Middle casting choice; 10 costs ¥900 more new for the maximum values. |
| `10` | ¥1,500 | 6* | 120 / ×24 | Casting style's highest values for the two traced effects. |
| `11` | — | No offer | 50 / ×15 | Keep if sufficient; shop-listed 12 and 13 have higher recorded values on both effects. |
| `12` | ¥400 | 1, 2, 3, 5 | 60 / ×18 | Fly middle choice; at area 5 it is the listed fly rod; 13 costs ¥50 more new for higher values. |
| `13` | ¥450 | 1, 2, 3, 4 | 70 / ×21 | Fly style's highest values for the two compared effects; area 5 lists 12 instead. |
| `14` | ¥1,500 | 3, 4, 6 | 80 / ×15 | Float/Ayu style's longest aim window; 15 trades aim for ×24 threshold. |
| `15` | ¥2,000 | 4, 5, 6 | 60 / ×24 | Float/Ayu style's highest threshold; compare against 14 for aim and 08 for price. |

## Why the choices are bounded this way

- Every card recommends a purchase only when an extracted shop offer exists for that rod. For `02`, `06`, `0B` and `11`, the recommendation is limited to keeping/using it if already owned and sufficient; the ROM's stored price field is not presented as a way to buy it.
- Within a style, the aim cutoff and +3 multiplier can trade off. Float/Ayu examples include `07` versus `08`, `14` versus `15`, and the low-cost `09`; the card tells the player which measured effect each option favors instead of combining unlike values into one score.
- Purchase comparisons name the area and use full quotes. Availability changes the choice: `14` is not listed in area 5; `12` is the fly rod listed there; `0A` appears in area 5 while `0C` does not. Fixed special rods `01`, `08`, `0D`, and `10` are identified as special-merchant stock.
- The recommendation for the 100-HP aim values of lure and casting rods remains conditional on HP. Fly cards use only the main aim cutoff and +3 comparison; the unexplained half-value threshold stays in the scope note, not as an item-level selling point.

## Local evidence

- [Rod record values and traced code paths](rod-response-research.md) and [the practical rod/lure effect trace](rod-lure-practical-research.md).
- [Rod data extracted from the ROM](../data/rod-response.json), [item names and full quote fields](../data/items-rom.json), and [six-area stock extraction](../data/shop-stock-rom.json).
- [Shop stock decoding and special rod merchant dispatch](shop-stock-research.md).
- The item-by-item localized wording and links to alternative rod cards are in [rod-item-decisions.json](../data/rod-item-decisions.json).
