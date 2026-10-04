# Player usefulness audit

## Requirement and completion boundary

The owner's active goal is to review **all information on the website** until each displayed fact helps the player understand a mechanic, make a decision, or take a next action. Gameplay claims must come from the supplied ROM and its controlled observations, not outside guides. Original game images, multilingual names, useful navigation, and expandable evidence remain part of the scope.

**Status: active, not completion-certified.** The previous cycle added and published entity navigation. This cycle addresses concrete defects found by reading current renderers/data and interacting with the pages. A green link check alone does not establish that every explanation is useful or that every gameplay outcome is decoded.

## Concrete fixes in this cycle

| Problem | Change | Evidence / verification |
| --- | --- | --- |
| A fish profile lists dozens of accepted items without helping choose one | Area chooser and lowest-price stocked starter choice per float/sinker/lure/fly method | Existing item acceptance lists and six-area stock records; independent minimum-price check for every 103 fish/area pair in all three languages |
| Starter fly price could sound like a body-only purchase | Explicitly a shop bundle quote; some sets omit wing or tail; item details show its actual parts | `docs/shop-stock-research.md`, `playerUse.shops[].bundle` |
| Large alternative lists resemble a shopping checklist | Lists collapsed, explicitly labelled as alternatives that do not all need buying | Browser/render inspection |
| Tools have coordinates but their detail pages send users to a generic fish map | Actual use-location crops, exact existing item/bait markers, use-window text and full-image actions restored | `playerUse.useLocations`; no new coordinate inference |
| Chum lists imply bait acceptance | Title/target status now describe movement steering of creature profiles | `data/chum-basket-use.json`, `catalogue/item-use.json` |
| Hook and float overrides drop useful findings | Confirmed per-item summaries/facts restored; no catch/bite upgrade claimed | `docs/hook-practical-research.md`, `catalogue/item-use.json`; visible-fact regression assertions |
| A rod page doesn't say whether to buy/replace it | Matching style's existing purchase recommendation and linked alternatives | `data/player-decisions.json`; all 21 rod pages in all locales assert a buying decision |
| Fly-part breadcrumb opens the wrong category; tool target context overrides tool browsing | Fly maker + correct part restored; general categories clear the fish-only filter | Breadcrumb assertions across all 315 items and locales |
| Map section counts can look like the whole area, and a research/item return path can be lost | Current/whole-area point totals, buttons to other sections, exact allowed return destinations | Browser: Iwana area 1, 24/81 points → section row 7, 13/81 points → return to Spinner item; same-origin absolute item path normalized |
| Clicking the current component/marker loops to the same item | Current component is labelled; current item's map marker opens the location image | Renderer inspection |

## Verified scope

The entity checker covers all 315 item records and 73 fish profiles across three languages, all 103 confirmed fish/area pairs, invalid identity/target recovery, source/asset paths, category navigation, stock/compatibility membership, prices, and visible hook/float facts. It renders source with a document mock; browser checks are separate.

Actual browser checks in this cycle include Rainbow trout area 1 → area 3 shopping choices, bottle → cow map crop, heavy-fish lure rod purchase advice, and the chum steering explanation. These support those paths, not a universal gameplay ranking.

## Remaining full-goal work

- Review the remaining catalogue, map, item, fish and research screen states in all three languages for duplicated or unexplained data, dead-end actions and contradictory labels. Keep full record coverage; do not certify the entire site from representative screenshots.
- Verify exact purchase conditions on item pages, particularly live Ayu's sale counter; a stock entry alone is insufficient when it has an unlock condition.
- Improve the distinction between a cheapest option for one target fish and a reusable multi-fish loadout using the existing lure-coverage and stock evidence.
- Validate area entrance/traversal/access conditions before claiming a route to a point. Current terrain/spawn extraction is not a turn-by-turn route.
- Continue investigating unresolved downstream fight, active spawn and hidden fly conditions where they prevent the requested player decision. Do not turn a compatibility mask or price into a promised bite/catch ranking.

Run `node scripts/check_entity_links.cjs` for source regressions. Record actual browser results separately and keep this full-goal status active until a requirement-by-requirement completion audit proves it.
