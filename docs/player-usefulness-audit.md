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
| A rod page doesn't say whether to buy/replace it | Individual buy/keep/replace advice, recorded-area exceptions and linked comparisons | `data/rod-item-decisions.json`; all 21 rod cards and profiles in all locales require their own recommendation |
| Fly-part breadcrumb opens the wrong category; tool target context overrides tool browsing | Fly maker + correct part restored; general categories clear the fish-only filter | Breadcrumb assertions across all 315 items and locales |
| Map section counts can look like the whole area, and a research/item return path can be lost | Current/whole-area point totals, buttons to other sections, exact allowed return destinations | Browser: Iwana area 1, 24/81 points → section row 7, 13/81 points → return to Spinner item; same-origin absolute item path normalized |
| Clicking the current component/marker loops to the same item | Current component is labelled; current item's map marker opens the location image | Renderer inspection |

## Verified scope

The entity checker covers all 315 item records and 73 fish profiles across three languages, all 103 confirmed fish/area pairs, invalid identity/target recovery, source/asset paths, category navigation, stock/compatibility membership, prices, and visible hook/float facts. It renders source with a document mock; browser checks are separate.

Actual browser checks in this cycle include Rainbow trout area 1 → area 3 shopping choices, bottle → cow map crop, heavy-fish lure rod purchase advice, and the chum steering explanation. These support those paths, not a universal gameplay ranking.

## Follow-up: choices, shop restrictions and search

- Fish pages now separate the cheapest compatible item for one fish from the two-lure coverage kit. The kit has complete coverage of the 38 lure-compatible profiles, labels which member accepts the current target, totals actual stock prices, and states whether both items are sold in the selected area. If both recorded pairs are available, it picks the cheaper complete pair; if neither is locally complete, it shows purchase areas without claiming they can be bought there.
- Raw spawn-slot totals moved into the evidence disclosure. Area cards retain distinct point counts and an action: open the map, and check another recorded point when a point is empty because fish can move and slots can be inactive.
- The only additional decoded shop restriction is Decoy Ayu, bait 17, area 3. Its item page now says to sell at least one Ayu from the keepnet, explains purchase refilling the stack to 9 and subtracting 9 from the sold-Ayu count with floor 0, and links directly to Ayu’s profile for spots and bait. Source: docs/shop-stock-research.md and data/shop-stock-rom.json. The catalogue condition copy matches.
- A source reproducer checked the supplied ROM for a broad three-ready-made-fly fallback: area 1 entries 1/3 plus area 2 entry 1 cost ¥30. The three body/wing residue pairs ensure at least one avoids the hidden equality gate for all 16 fixed hidden states; each body accepts the same 33 profiles. A generated target-specific selector enumerates recorded stock triples, choosing a ¥17 backup for the 17 dry-compatible targets or ¥30 for the remaining 16 wet-compatible targets. A collapsed fish-page explanation shows actual component pictures, recorded shop entries and prices, and limits the result to that one check. It does not claim a bite or landing guarantee or a controlled fishing comparison.
- Research-table search now accepts existing romanized/Thai lookup aliases as well as Japanese ROM names and hex IDs, displays localized counts/zero results, and warns if alias loading fails. The page explicitly distinguishes aliases from ROM-decoded names. Browser checks: Thai-name search → Rainbow profile → research return; English full-width search and zero results; Japanese name search.
- Source checks independently validate full lure set coverage, per-pair total/stock claims, minimum locally complete pair prices, and the localized Ayu unlock path. Actual browser checks include Rainbow area 1/area3, fish profile 0D area 4 (Sinking is for other fish, Soft worm for the selected fish), and Decoy Ayu → Ayu profile.

## Follow-up: shop and town actions

- A dedicated multilingual shop page connects item profiles to recorded stock, authentic outdoor entrance crops and separate town seller crops. Normal-shop entrance associations are observed for areas 1–5; special-rod-seller associations are observed for areas 4–6. The area-6 regular seller is an endpoint only. Source: `data/shop-locations-rom.json`, `docs/shop-location-research.md`; no outside guide.
- The source extractor removes the out-of-bounds `(255,255)` entries in areas 2 and 3. An independent direct read of the supplied ROM validates the 28 included outdoor/arrival pairs, seller object coordinates and six town image hashes.
- Empty bottle, key and candle profiles now show town chest crops, labelled town rooms, reward/required-key links, and expandable outdoor entrance crops. Bottle/candle acquisition appears before their outdoor use point. Chest coordinates are directly rechecked against ROM town object slot `0E`; rendered town-image hashes and quest-trace identity are checked by `build_tool_use_locations.py`. Pairing a chest room with a recorded town arrival is static evidence, not a controlled walk to every chest.
- Direct purchase actions on the three-fly backup cards open the corresponding shop and preserve the fish-page return path. A lure starter card now explicitly says to restore HP to 100 for the rod's full aim window; this is not a bite-rate claim.

## Follow-up: each of the 21 rods answers a purchase decision

- Each rod has separate EN/TH/JA purchase/use advice, a reason based on the decoded aim and fish-position effects, and linked alternatives. The comparison table repeats a short decision instead of requiring the reader to infer one from ranks.
- Advice considers shop availability, including area-5 exceptions for rods 07, 0A and 12. Rods 02, 06, 0B and 11 have no recorded seller: their raw record prices are not presented as purchase offers.
- Buying a replacement costs its full quoted price. Differences between two new-purchase quotes are not presented as trade-in prices.
- Unresolved species-specific response, response selectors and generic record mechanics remain inside technical evidence. They do not produce front-facing fish suitability portraits or catch-rate recommendations.
- Source checks require all 21 records, all localized decision fields in cards and profiles, 21 comparison decisions per language, and four no-stock entries. Local browser checks: 01 → recommended 04 → return to 01; all 21 Thai catalogue decisions; expanded comparison table; 390px page width and wrapping of the item advice/alternative link. The unknown branch remains an evidence question, not a recommendation.

## Remaining full-goal work

- Review the remaining catalogue, map, item, fish and research screen states in all three languages for duplicated or unexplained data, dead-end actions and contradictory labels. Keep full record coverage; do not certify the entire site from representative screenshots.
- Finish the unverified area-6 regular-shop traversal before claiming its entrance-to-seller route. Its exact town object point and the town entrance records are known, but an indoor walk starting at that arrival has not yet opened the normal menu in a controlled probe. Other whole-area travel/access conditions remain separate work.
- Validate area entrance/traversal/access conditions before claiming a route to a point. Current terrain/spawn extraction is not a turn-by-turn route.
- Continue investigating unresolved downstream fight, active spawn and hidden fly conditions where they prevent the requested player decision. Do not turn a compatibility mask or price into a promised bite/catch ranking.

Run `node scripts/check_entity_links.cjs`, `node scripts/check_shop_conditions.cjs`, and `node scripts/check_research_search.cjs` for source regressions. Record actual browser results separately and keep this full-goal status active until a requirement-by-requirement completion audit proves it.

## Follow-up: actionable gear, chest acquisition and map autocomplete

- All 157 hook/float/fly-part cards and profiles now state a buy/use decision and its evidence-bound reason. Hook names do not imply catch superiority. Floats have a linked six-area minimum-stock-price table; sinker selection checks the target profile first. Wings/tails lead with body/target choice and appearance/actual quote, rather than unresolved selectors.
- Fly parts with a target link directly to that fish's starter/optional backup disclosure. Unsupported targets link to other bait/methods. A no-target wing/tail opens a wet-body fish list rather than looping to itself.
- Six town rewards now have acquisition instructions, town coordinates, authentic crops and paired outdoor entrance images: bottle, ticket, potato bait, waxworm bait, lure rod and candle. Key/space requirements are explicit. Room pairing is source evidence, not a controlled walk to every chest.
- Maps have localized keyboard/click autocomplete with unique fish sprites and confirmed areas. Typing stays on the current map; committing a fish changes area only if needed. A functional harness executes the real listeners with all 72 mapped profiles; live EN/TH/JA checks covered Area 6 → Rainbow trout in Area 1, Escape, clear and exact return context.
- Root browser checks additionally covered hook01 → Akame → hook return, float01 → six-area price table → float02, ticket acquisition/entrance disclosure, and wing09 → Rainbow optional backup automatically opened. Original evidence remains collapsed.
- Source-render coverage: 1,524 localized detail renders, 209,808 link/asset/entity references, all 315 items and 73 fish profiles. Repeated references are not a count of manual clicks. Full-goal status remains active; unresolved traversal/gameplay outcomes listed above remain research work.
