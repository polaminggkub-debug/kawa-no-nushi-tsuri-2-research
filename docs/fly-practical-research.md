# Fly maker: what the ROM lets a player do

## Useful answer first

Choose a fly body from the fish you are trying to catch. The wet-body group passes one required fish-profile check for 33 fish. The dry-body group passes it for 17 fish, and all 17 are also in the wet group. A fish shown on a body card has passed that one check; it does not mean the fish will bite, hook, or be landed.

There is no ROM-backed “best wing” or “best tail.” A wing participates in an extra hidden body-and-wing check, but the game does not show the values or explain the check. The body and wing are checked against values already stored by the game. Recasting alone does not roll those values again. The inn/rest routine can write new random values; staying overnight may change the check, but can also produce the same values. Other reasons for a fish not to bite remain possible.

The tail is optional in the observed maker: the first-stage Mayfly screen showed nine tail pictures and a separate `無し` choice. The traced fish-profile and hidden body/wing checks do not read the tail ID. Choose a tail by appearance or use `無し`; the examined code does not establish a fish-specific tail bonus.

## How to make one

The original-ROM runtime capture shows the following sequence at the rear NPC in the first-stage tackle shop:

1. Walk into the NPC to start custom-fly creation.
2. Choose a family. The captured menu showed Mayfly, Caddis, and Terrestrial. Only this shop was checked.
3. Choose a body. Use the fish list attached to the body card to see which targets pass its body-selected check.
4. Choose a wing, then a tail or `無し`.
5. Review the quoted price and confirm. One captured default Mayfly combination cost ¥25. That is one observed quote, not a price for every combination.

The captured first-stage palettes displayed 15 Mayfly bodies, 14 Caddis bodies, 16 Terrestrial bodies, 20 Mayfly wings, and 9 Mayfly tails plus `無し`. The game screen does not display internal component IDs, so those counts alone do not identify each menu sprite by its ROM ID.

Follow-up (2026-10-05): the maker's ROM scan filters family and part, and its Mayfly wing records total 18. The traced buffer/renderer limits also conflict with the old screenshot count of 20. The quoted counts above remain a historical visual observation, not confirmed selectable totals. See [maker menu research](fly-maker-menu-research.md). The maker supplies selected components; no separately owned component stock is consumed. Keep a free completed-fly slot and enough money for the displayed quote.

## Body choices from the supplied ROM

| Body group | Body IDs | Fish profiles passing the body-selected check | What that means in play |
| --- | --- | ---: | --- |
| Wet | `01–08`, `2B–33`, `4B–4F`, `60–65` | 33 | Broader target list of the two body groups |
| Dry | `18–1E`, `3E–42`, `56–59`, `6C–6F`, `77–86` | 17 | Every listed target also passes the wet group |

Use the fish pictures on the item cards to match a target without memorizing IDs. If a fish appears on both, the ROM evidence does not establish which body makes it bite more often. If a target is absent from both lists, this traced body-selected check provides no compatible ordinary body for it.

## Why changing a wing can help only conditionally

In mode 3, the ROM first prepares an extra pass/skip value. It clears that value if either the body’s low two ID bits match a hidden body value or the wing’s low two ID bits match a hidden wing value. The mode-3 fish-event path then ANDs this extra value with its other checks. Thus a matching wing can block that event even if the body’s fish list includes the target. A different wing ID can avoid the wing-side equality, but cannot overcome a body-side equality.

The values are generated as random values from 0 through 3 during field/object setup and by the inn/rest routine. The comparison routine reads them; it does not reroll them. The writer in bank `$03` is inside the inn/rest handler: it quotes and charges for lodging, restores the player, then stores random values. An overnight stay is a possible way to refresh the hidden check, not a guaranteed way to obtain different values. A no-bite result by itself does not tell the player that this gate was responsible.

For research only, body IDs `01` and `02` share the wet fish-profile group but have different low-two-bit values; wing IDs `09` and `0A` likewise have different low-two-bit values. If all four cross-combinations can be selected and equipped while the same hidden values remain fixed, at least one combination avoids both equality checks for any stored pair of values from 0 through 3. This proves only that one combination can pass this extra check. The DIY screen has no visible IDs, the exact mapping of those four IDs to its sprites has not been confirmed, and the same-field equipment-switch sequence has not been verified. Therefore this is not yet an exact player recipe.

## Shop prices and stock are a different thing

The regular shop’s three parallel eight-entry lists hold prebuilt body/wing/tail combinations. The shop copies the body, wing, and tail at the same list index and charges the price associated with the selected fly record. These lists do not prove that their components are offered for separate purchase. The custom-fly maker has a separate menu and quote path. Do not add component-table price fields to estimate every finished custom fly; use the quote shown by the game.

## What the remaining component fields establish

- Body `+0` and `+2` select the bait record used for the fish-profile check. Wet bodies select bait ID `07` or `08`; dry bodies select `04`. IDs `07` and `08` have the same profile mask in this ROM.
- Body `+2` also selects a distinct fight-initialization branch. Body `+6` feeds a separate initial fight-response transformation. The traced code does not prove that either branch is easier or lands more fish.
- Body `+4` and `+5` feed the graphics-loading path.
- The wing ID participates in the hidden equality check. No wing-specific fish list, bite probability, or universal preference has been established.
- The tail ID is loaded with the composed fly, but the traced mode-3 profile and body/wing checks do not read it. This does not rule out every possible tail use elsewhere.

## ROM evidence

All findings use the supplied headerless Japanese SFC ROM (1,572,864 bytes, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`). No guide claims are used as gameplay evidence.

| Question | ROM path |
| --- | --- |
| Body-selected bait and fish check | `04:D4DC..D4F9`, `04:E6C9..E6D2` |
| Hidden body/wing equality check | `04:D4AF..D4CD` |
| Field/object setup of hidden values | `04:EDA0..EDB2` |
| Inn/rest writer and random values | `03:80C7..838x`, including `03:8354..836E` |
| Body record load and fight consumers | `03:D0D9..D11E`, `04:87DA..87E7`, `04:8DBA..8E32`, `04:86E5..8706` |
| Prebuilt shop fly bundles and purchase | `03:8FF5..9050`, `03:90A8..9118`, `03:9119..91B8` |

Supporting project evidence: [`fish-acceptance.json`](../data/fish-acceptance.json), [`fly-customization.json`](../data/fly-customization.json), [`item-table-records.json`](../data/item-table-records.json), and [`shop-stock-rom.json`](../data/shop-stock-rom.json).
