# Bait and lure purchase choices

This page turns ROM-derived compatibility sets and the six decoded shop inventories into budget choices. A compatible fish profile passes one necessary item-mask check; that does **not** establish attraction, a bite, a catch, a fight advantage, or a successful landing.

For a specific fish, open its fish page first. Use a bait or lure you already own if that fish is listed for the route you are using. The item-page links below point to lower-priced options only when the ROM shows them in shop stock and their route-paired profile sets cover the same targets or a wider set. Buying another item with the same compatibility set does not add a proven target.

## Baits

The float column is the mode-0 mask check. The sinker column intersects the same mask with the route's extra fish-profile requirements; it is not a count of bites. Rows group items only when their float and sinker profile sets are exactly equal.

| Float / sinker profiles | Exact gate group and confirmed full-price offers (area numbers) |
| ---: | --- |
| 44 / 20 | `01` Worm ¥5 (1–6) |
| 22 / 8 | `02` Maggot ¥10 (1, 3, 5, 6); `03` Red maggot ¥25 (2); `0B` Grapevine larva ¥35 (1); `0C` Bee larva ¥35 (3) |
| 17 / 1 | `04` Insect ¥25 (1–3) |
| 24 / 13 | `05` Bloodworm ¥15 (3–5) |
| 16 / 9 | `06` Ragworm ¥30 (6) |
| 33 / 12 | `08` Caddis larva ¥20 (1–3); `07` Aquatic insect ¥25 (1–4) |
| 9 / 0 | `09` Salmon roe ¥40 (1, 2, 3, 6) |
| 25 / 7 | `0A` Large earthworm ¥40 (1, 2, 4–6) |
| 17 / 5 | `0E` Hera paste ¥25 (4); `0F` Carp paste ¥25 (5); `10` Rice porridge ¥30 (5). `0D` has a ROM record price of ¥30 but no offer in the six decoded shop lists. |
| 9 / 3 | `11` Potato bait ¥25 (4, 6) |
| 32 / 12 | `12` Small fish ¥20 (1–6) |
| 21 / 6 | `13` Loach ¥20 (3, 5, 6); `14` Frog ¥30 (2, 4–6) |
| 27 / 12 | `15` Shrimp ¥35 (2, 4–6) |
| 19 / 11 | `16` Shelled clam meat ¥40 (4–6) |
| 1 / 0 | `17` Decoy ayu ¥45 (3; only after selling at least one Ayu, and each purchase reduces the sold-Ayu counter by 9, floored at zero) |

Useful lower-price choices from these exact or broader route-paired gates:

- `09` Salmon roe's nine float-route profiles are all covered by Worm `01` for ¥5, which is stocked in every area. This is a broader profile set, not proof that the baits attract or land fish equally.
- `07` and `08` have the same route-paired profile set. Choose `08` for ¥20 when shopping in areas 1–3; in area 4, `08` is absent, so `07` is the recorded offer.
- `10` is ¥30 in area 5. `0F` is ¥25 in area 5 with the same route-paired profile set; `0E` is also ¥25 in area 4.
- `14` is ¥30 in areas 2, 4, 5, and 6. Loach `13` has the exact same route-paired profile set for ¥20 in areas 3, 5, and 6. Small fish `12` is ¥20 in all areas and covers a broader route-paired set.
- Decoy ayu `17` lists only Ayu profile `38`, and its area-3 offer is conditional on selling Ayu. If the goal is only to pass the fish-profile mask check for Ayu, Caddis larva `08` is a lower-priced area-1–3 option whose broader profile set includes `38`. No bite bonus is claimed.
- `0D` has no decoded shop offer. If it is already owned, it passes the same route-paired gate as `0E`, `0F`, and `10`; the linked stocked peers show the confirmed choices in areas 4 and 5. Its magnifier acquisition route is now verified: in town, stop on a tile different from the previous magnifier-use tile at Y16–31 and use tool `03`; the second entrance arrives at `(7,29)`. Leave bait inventory room, with stacks capped at 9. Area 6 is directly tested from a controlled fixture; the other towns follow the same ROM branch. See [paste bait acquisition evidence](town-paste-bait-research.md).

## Lures

The 81 lures fall into three exact mask groups. The group counts are profile rows passing the lure mask gate, not expected bites.

| Profile rows | Exact gate group | Lowest full-price offers by area |
| ---: | --- | --- |
| 21 | 73 lure IDs | Area 1: `48` ¥20; area 2: `42`/`43` ¥25; area 3: `2B`/`2C` ¥25; areas 4–5: `2C` ¥25; area 6: `46`/`47` ¥20 |
| 32 | `17`, `18`, `2E`, `2F`, `30`, `31` | Area 1: `2E`/`2F`/`30`/`31` ¥25; areas 2–5: `17` ¥20 |
| 25 | `23`, `24` | Areas 1 and 4: `23` ¥30; areas 2 and 3: `24` ¥35 |

The item-by-item JSON gives the exact members and each item's lower-priced full-set options by area. The cheapest lure mask-set choices do not rank bite rate or fight response. A lure's fish-specific response fields are excluded from purchase recommendations because their gameplay effect is not established as a player advantage.

For broad lure-mask coverage, the separately verified two-item sets are Sinking `17` + Soft worm `23` for ¥50 in area 4, or Spoon `2E` + Soft worm `23` for ¥55 in area 1. These cover the 38 ROM profiles that pass at least one lure mask; they do not guarantee a bite or catch.

## Data and evidence

[`data/bait-lure-player-choices.json`](../data/bait-lure-player-choices.json) contains all 23 bait and 81 lure entries, keyed by `category:id`. Each record includes its exact route-paired gate set, same-gate peers, confirmed shop stages, full shop price only when stocked, cheaper same-or-broader choices by area, bounded item links, and English/Japanese/Thai copy. Bait `17` retains its Ayu-sale condition; bait `0D` is explicitly not given a shop purchase quote.

Regenerate that file with `node scripts/build_bait_lure_choices.cjs`. The generator checks all gate arrays against the ROM-derived acceptance data, prices against the item table, and stages against the six-area stock manifest.

Evidence sources: [fish acceptance gates](fish-acceptance-research.md), [six-area shop stock and price consumers](shop-stock-research.md), [lure coverage set](../data/lure-coverage.json), [bait records and masks](../data/fish-acceptance.json), and [item table records](../data/item-table-records.json). No outside gameplay guide is used.

## Same-price broader-coverage choices

The catalogue now exposes `equalPriceByStage` separately from cheaper offers.
For each of the 104 bait/lure records, a candidate must be the same category,
have exactly the same ROM price, be unconditionally stocked alongside the
original item in that area, cover every accepted profile on every compared rig,
and add at least one accepted profile. Empty sets are preserved.

Seven items have qualifying alternatives: bait 04 and 13; lure 2B, 2C, 43,
49 and 4A. For example, Loach 13 and Small fish 12 both cost ¥20 in Areas 3,
5 and 6. Small fish covers all Loach profiles and more: float 32 versus 21,
sinker 12 versus 6. When buying for broader species coverage, choose Small
fish; an owned compatible Loach remains usable. This comparison does not
establish greater bite probability, fight advantage or landing success.

Both catalogue cards and item details show the choice, with links preserving
the purchase area, rig and return destination. An area without a qualifying
local pair does not receive another area's equal-price recommendation.
