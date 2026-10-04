# Practical choices for hooks, floats, and fly components

This guide turns the ROM findings into bounded player choices. It covers 13 hooks, 10 float/sinker records, 64 fly bodies, 47 wings, and 23 tails. All gameplay claims use the supplied original Japanese SFC ROM, its decoded six-area shop stock, or direct captures of the original game's fly maker. External guides are not used as evidence.

## Hook: keep the one you own; check the bait first

Keep the hook you already have. The ROM evidence does not show that buying a fish-named hook gives more bites or makes a fish easier to land. First check that the target accepts the bait. The nine fish-name links in the item data lead to fish pages for bait and spot information; a matching name is not a suitability or catch bonus.

Hooks are used for bait fishing; switching to lure or fly clears the hook fields. The hook-to-fish mapping and fight-branch traces remain in the technical sources linked below. They are not used here to rank hooks or recommend buying one.

## Float or sinker: choose the route by fish, then buy by price

Float IDs `01`–`08` select the float bait route. Sinker IDs `09`–`0A` select the sinker route, which adds a fish-profile check. The ROM-derived catalogue lists 72 profiles on the float route and 30 on the sinker route. The selected bait must also pass its own fish check.

If you already have a float and the target passes the float route, keep using it. The model IDs do not change the route's fish set or the bait-acceptance check. Among decoded shop stock, the cheapest float by area is:

| Area | Cheapest recorded float | Price |
| --- | --- | ---: |
| 1 | ID `05` | ¥30 |
| 2 | ID `02` | ¥10 |
| 3 | ID `06` | ¥50 |
| 4 | ID `02` | ¥10 |
| 5 | ID `02` | ¥10 |
| 6 | ID `05` | ¥30 |

Models `09` and `0A` share the same sinker-compatible set. Area 4 records `09` at ¥75; areas 5 and 6 record `0A` at ¥30. If the target is not on the sinker list, use the float route or another fishing method whose compatibility list includes it.

IDs `04` (Ball float) and `08` (Marker) have no recorded stock in the decoded six-area shops. Fly setup loads Marker `08` automatically, so buying or selecting it is unnecessary for fly fishing. Hera float `01` contains a field that resembles the Herabuna fish ID, but the traced bait path has no reader for that field; do not pay its ¥250 record price expecting a Herabuna bonus.

The model's record code selects an indicator/state drawing path. It is not evidence of depth, sensitivity, bite rate, or landing advantage. The price-based choices above are therefore purchase convenience, not an equipment-strength ranking.

## Fly body: use the fish list, then choose a complete target-compatible setup

A fish shown on a body card passes one required body-selected profile check. It still has to pass the separate body/wing hidden gate and the other fishing checks; the list is not a bite or catch-rate estimate.

- Wet bodies pass one profile check for 33 fish. Dry bodies pass it for 17 fish, all of which are also in the wet set.
- If the target is on a body list, start with one target-specific ready-made body/wing/tail bundle from its fly choices. Other listed bundles are optional backups if needed; there is no need to buy all of them up front. This gives a concrete first setup without calling any bundle a catch-rate winner.
- With no target selected, wet body `01` is the broad 33-profile reference. Area 1 sells the ready-made `01 + 09 + 13` bundle for ¥5; it is a low-cost starting setup, not a bite or landing guarantee.
- Dry bodies add no fish coverage beyond wet bodies. Choose a dry body for its look or because it is already owned, not because the ROM proves it catches better.
- Body records are components in the maker or members of ready-made bundles; the per-record price field is not a verified custom-fly quote. The maker's quote is the cost to review before confirming.

The original maker's visible sprite-to-ROM-ID mapping is not fully established. A ROM ID on this page should not be treated as an icon number in the maker. The target-specific backup choices use the decoded, ready-made shop bundles instead.

## Wing: no proved upgrade; do not repeat an unchanged cast to reroll

No wing has a proven fish-specific advantage, bite bonus, or landing bonus. Its ROM ID participates with the selected body's ID in a hidden equality check. Recasting the same fly does not reroll the values used by that check; an overnight stay can update them but can repeat the same values. A fish not biting does not prove this gate was the cause.

Choose the target-matching body first. For a custom fly, start with a wing you already own and check the game's final quote. Do not buy a more expensive wing expecting a catch improvement. For a concrete first setup, open the target page's ready-made fly choices and choose one starter bundle; other bundles are optional backups. Exact custom-maker sprite-to-ROM-ID mappings and same-field equipment-switch behavior have not been verified, so this research does not prescribe a particular DIY wing icon. The recast/hidden-check behavior remains in the technical evidence, not in the player-facing recommendation.

## Tail: choose by appearance and the quote

The traced fish-profile and hidden body/wing checks do not read the tail ID. This means no tail advantage is established in those checks; it does not rule out every other tail consumer. The observed first-stage Mayfly maker offers nine tail pictures and a separate `無し` (None) choice.

Choose a tail for its appearance if the final quote is acceptable, or choose None where offered. Do not pay more expecting a fishing bonus. Only one custom-fly quote (¥25 for one observed combination) has been captured, so the saving from omitting a tail is not established; read the quote shown by the game before confirming. Shop records are prebuilt complete bundles, not proof that wings or tails are sold separately.

## Evidence and limits

- Hook matches, bait-route scope, and hook/float/sinker consumers: [hook practical research](hook-practical-research.md) and [hook/float code notes](hook-float-use.md).
- Fish profile and body/wing gates, custom-maker observations, and limits on ID mapping: [fly practical research](fly-practical-research.md).
- Ready-made fly alternatives for a selected target: [fly selection research](fly-selection-practical-research.md).
- Purchase decisions are serialized by item ID, with English, Thai, and Japanese copy, in [`gear-item-decisions.json`](../data/gear-item-decisions.json).

The per-item coverage is 13 hooks + 10 float/sinker models + 64 bodies + 47 wings + 23 tails. No entry claims an overall best catch setup. The remaining gaps do not block the immediate choices here: keep an owned hook or float, choose a float by current-area price, start from one target-matched ready-made fly, and check the maker's quote. They do block stronger claims: we cannot rank hook branches, wings, or tails by catch success; the incomplete sprite-to-ID map prevents translating a ROM wing ID into an exact DIY maker picture; and the saving from omitting a custom tail must be read from the in-game quote.
