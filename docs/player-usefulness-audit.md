# Player usefulness audit

## 2026-10-06: fish-led shopping and a clearer notebook route

- Following Shops with a valid selected fish and no explicit item/category/search/maker intent now opens bait for float/sinker, lures for lure fishing, or ready-made fly bundles for fly fishing. This resolves an actual public path that retained the fish but foregrounded food and unrelated tools. Explicit categories and ordinary shopping remain available.
- Choosing all categories or clearing filters while a fish is selected now retains `category=all` in the URL, return context and language links. A mobile walkthrough exposed the previous omission: reload silently reapplied the new bait default. Explicit intent now survives reload.
- The target-fish shop panel explains bait rigs only when bait or all categories are visible. Lure/fly shopping retains the compatibility caveat and offer badges without unrelated bait instructions.
- The 66-species notebook route states that grouping uses the first area with a configured point; a point can be inactive in the current run. Fish actions still lead to maps and equipment. The duplicate fixed route-plan subtotal was removed from the technical disclosure; manual checklist progress, all six area counts, the observed landing case and ROM evidence remain.

These are browsing and presentation changes; no game records or catch-rate claims changed. The full-site usefulness goal and unresolved controlled-catch/natural-prerequisite research remain active.

## 2026-10-06: usable recovery and concise contextual advice

- Equipment, maps, fish, item details and shops now offer real reload buttons after required data fails. A same-URL link with a fragment did not reload during an actual browser reproduction; button handlers now reload the current URL, retaining selected fish, area, method and source context.
- Shop filters begin disabled and become usable only after required data, handlers and rendering are ready. Required failures show recovery above the filters; optional map failures do not hide usable stock.
- Item details distinguish unavailable data from a genuinely unknown item ID. Recovery offers retry plus the existing category/source route.
- Catalogue recovery moved above the filters after a 390 × 844 browser check found the old retry below the viewport. Map retry uses a touch-sized control. Controlled first-request failures followed by successful button retries were exercised locally for all five page types; this is recovery evidence, not a claim that the public server failed.
- Thai shop fish labels reuse display-only alias deduplication. Strategy pages state the 38 fish/aquatic-profile compatibility limit once beside the purchase action; original aliases and technical research remain intact.

The full-site player-usefulness goal remains active. Compatibility does not establish bite, hook-up or landing advantages; those comparisons remain a research task. Net and magnifier research remain deferred.

## 2026-10-05: bait-first fish browsing, local rod choices and safe navigation

- A selected fish in the all-category catalogue now starts with compatible bait, followed by lures and fly bodies, rather than universal floats appearing first in source order. The public Mosugo profile (10) reproduced the reported 16-result float-first view. Dedicated categories and deliberate name/price sorting remain available; no compatibility records are removed.
- The strategy rod section starts with area-specific advice actions for all six areas. They open per-rod local purchase decisions; the global comparisons remain visible as upgrade candidates, with their recorded sellers preserved.
- Lottery advice identifies the spare foods that can improve more draw outcomes than orange: Hinomaru bento 06 and daikon 07. The food is consumed; the cap can make their effects equal near the limit. No guaranteed prize, ticket odds or expected payout is claimed, and the one-time daikon acquisition is not recommended solely for a draw. The original threshold trace remains under evidence.
- Map navigation before data has loaded now retains the requested fishing method alongside fish, area and return context. The existing loading link can be used safely, including after a fetch failure; the search stays disabled until the data is ready.

These changes were selected from actual player paths and original-ROM evidence. The full-site semantic acceptance goal remains active; these bounded outcomes do not certify every guide or game mechanic.

## 2026-10-05: consistent fishing decisions across navigation

The equipment global map action now follows the lure/fly category even when a previous float/sinker rig remains in the return context. Clicking the shared navigation previously overwrote the correct embedded action. Map equipment actions with an explicit lure/fly method reopen that equipment category; an ordinary fish selection still starts with compatible bait. Lure and fly item cards carry their own method; item details accept all four methods and preserve them when opening fish profiles or maps. Bait rigs and unrelated food/tool contexts retain their existing behavior. The Thai rod table also uses the existing Mabuna rod display label instead of the missing-value text “None”. These changes preserve the method of the advice, not a new claim about bite or landing odds. The strategy audit still found a global rod recommendation without early-area alternatives and a lottery food comparison to translate into player-facing advice; these remain open rather than being treated as complete.

## 2026-10-05: route continuity and truthful location advice

A fresh semantic review covered the 72 located fish profiles, the map/shop/notebook renderers in all six areas, and bait/lure/food/tool decisions. Source and rendered checks remain separate from ordinary gameplay observations. Net and magnifier research remain deferred.

- Equipment-page fish portraits, profile links, embedded map actions and area links retain the selected float/sinker rig, or the lure/fly method of the current equipment category. Previously only the global navigation retained it, so another route could change the next advice.
- A fish with one configured point directs the player to check the nearby water; it no longer tells them to try another marked point that does not exist. This does not claim a spawn or quest trigger is solved.
- Thai fish-name display deduplication is shared by the fish, map, equipment and item pages. Original name variants and search aliases remain intact.

The review did not justify a new bait/lure catch-success ranking. Compatibility, prices and shop availability answer different questions from bite or landing odds. Likewise, configured giant-eel coordinates do not prove the ordinary story prerequisite. These limits remain in the relevant research evidence; the full-site goal is not completion-certified by this bounded release.

## 2026-10-05: visible buying decisions and verified fly selections

The full-site goal remains active. This continuation addresses the equipment and fish-map paths found in the current rendered site; it does not certify every gameplay mechanic.

- Bait/lure cards now state when to keep an owned item, where recorded stock exists, and which lower-price compatible offers to inspect before buying. Recommendations distinguish a whole compatibility list from a recommendation for one selected fish. The existing complete comparisons and ROM evidence remain available in disclosures.
- The two-lure coverage kit appears above lure results without requiring the player to open the general guide. Coverage means passing the recorded compatibility checks, not a bite or landing guarantee.
- Four wings without captured maker positions no longer receive a generic maker-selection instruction. Wing 26 has a recorded Area 6 ready-made bundle (body 1E, wing 26, tail 2A, total ¥50). Wings 25/66/67 link to documented alternatives; absence from the inspected menus is not proof of global unavailability.
- Independent controller replays establish 42 additional real component selections and four None positions for Diptera/Stonefly. The original 256×224 game images and input directions are linked from item details. The even-area family setup is explicitly a controlled fixture; a natural shop progression into these menus is still unverified. See [the bounded menu research](fly-maker-even-families-menu-research.md).
- Fish → map → return preserves the map section anchor and fishing method. Equipment navigation from individual fly components selects the correct maker part instead of silently opening rods.
- A matching bait search excluded by the sinker method explains the incompatibility and offers a float-method recovery only when its recorded list supports the selected fish. The action retains the query/area/return, persists through reload, and has a continuous touch-sized hit area when its text wraps. Unknown searches and fish incompatible with both methods retain the ordinary empty state.

Verification separates original-ROM fingerprint checks and independent replay comparisons, generated-data/render guards, and actual browser paths. File/function/FSD limits continue to apply. Remaining research includes the natural even-area maker trigger, the exact fishing outcomes that invoke journal updates, and outcome comparisons needed for a universal catch-success ranking. Net/magnifier work remains deferred at the owner's request.

## Requirement and completion boundary

The owner's active goal is to review **all information on the website** until each displayed fact helps the player understand a mechanic, make a decision, or take a next action. Gameplay claims must come from the supplied ROM and its controlled observations, not outside guides. Original game images, multilingual names, useful navigation, and expandable evidence remain part of the scope.

**Status: active, not completion-certified.** The previous cycle added and published entity navigation. This cycle addresses concrete defects found by reading current renderers/data and interacting with the pages. A green link check alone does not establish that every explanation is useful or that every gameplay outcome is decoded.

## Concrete fixes in this cycle

| Problem                                                                                      | Change                                                                                                       | Evidence / verification                                                                                                                        |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| A fish profile lists dozens of accepted items without helping choose one                     | Area chooser and lowest-price stocked starter choice per float/sinker/lure/fly method                        | Existing item acceptance lists and six-area stock records; independent minimum-price check for every 103 fish/area pair in all three languages |
| Starter fly price could sound like a body-only purchase                                      | Explicitly a shop bundle quote; some sets omit wing or tail; item details show its actual parts              | `docs/shop-stock-research.md`, `playerUse.shops[].bundle`                                                                                      |
| Large alternative lists resemble a shopping checklist                                        | Lists collapsed, explicitly labelled as alternatives that do not all need buying                             | Browser/render inspection                                                                                                                      |
| Tools have coordinates but their detail pages send users to a generic fish map               | Actual use-location crops, exact existing item/bait markers, use-window text and full-image actions restored | `playerUse.useLocations`; no new coordinate inference                                                                                          |
| Chum lists imply bait acceptance                                                             | Title/target status now describe movement steering of creature profiles                                      | `data/chum-basket-use.json`, `catalogue/item-use.json`                                                                                         |
| Hook and float overrides drop useful findings                                                | Confirmed per-item summaries/facts restored; no catch/bite upgrade claimed                                   | `docs/hook-practical-research.md`, `catalogue/item-use.json`; visible-fact regression assertions                                               |
| A rod page doesn't say whether to buy/replace it                                             | Individual buy/keep/replace advice, recorded-area exceptions and linked comparisons                          | `data/rod-item-decisions.json`; all 21 rod cards and profiles in all locales require their own recommendation                                  |
| Fly-part breadcrumb opens the wrong category; tool target context overrides tool browsing    | Fly maker + correct part restored; general categories clear the fish-only filter                             | Breadcrumb assertions across all 315 items and locales                                                                                         |
| Map section counts can look like the whole area, and a research/item return path can be lost | Current/whole-area point totals, buttons to other sections, exact allowed return destinations                | Browser: Iwana area 1, 24/81 points → section row 7, 13/81 points → return to Spinner item; same-origin absolute item path normalized          |
| Clicking the current component/marker loops to the same item                                 | Current component is labelled; current item's map marker opens the location image                            | Renderer inspection                                                                                                                            |

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

## Follow-up: acquisition before spending and safe recovery choices

- Six chest rewards now have a visible acquisition callout before purchase listings, with a direct location/entrance action. Rod 0A's decision considers its area-4 key chest and tells owners to keep the existing rod when aiming time is sufficient.
- An unidentified mushroom now leads to a concrete alternative: use recorded shop food rather than relying on the menu name, which is shared by +10-HP and HP-zero records in the controlled observation. The orange profile is linked with a retained return path.
- Gold net output IDs come directly from `general-tool-actions.json`'s traced area table. Both directions are linked: net → bait profile and bait → net collection instructions. No exact shallow-water coordinate is claimed by these links.
- Catalogue comparison alternatives omit the currently displayed item, preventing a comparison link from looping to the same profile.
- Local browser checks: rod 0A's chest action scrolls to the authentic town crop; mushroom09 → orange01 retains the mushroom return; net04 → salmon roe09 retains area3 and the net return. The all-record renderer requires acquisition/gathering/food-alternative actions.
- The area-6 normal-shop walk and daikon acquisition remain research work. The whole-site goal is still active.

## Daikon exchange decision

The formerly unlocated food 07 now gives a concrete choice: bring kept fish 18 to the area-3 NPC at (21,82) for sixteen 40-HP foods once per save, or skip if the existing food must be kept. Static event code and a controlled WRAM-precondition probe independently establish the complete sixteen-slot overwrite. This probe does not establish a natural catch; the linked fish profile retains the existing ROM spawn/acceptance evidence.

The food page/card links to fish 18, and fish 18 has a reciprocal keep-before-eating/selling action. The original-ROM terrain crop is reproduced by `scripts/build_daikon_location.py` from the hashed map manifest. Quest reward links omit bait-target context so food does not acquire a meaningless fish-compatibility section. Local browser: food07 -> fish18 -> reward07, return path and stage3 preserved. Source render coverage: 1,527 localized detail renders, 210,522 local references (not manual click counts). Exact net shallow-water spots and area-6 seller traversal remain research work.

Fish language switches now localize nested return routes while retaining entity IDs, area and safe local routing. Dedicated assertions exercise all 73 fish profiles plus nested item07 -> map3 returns in each language. Browser clicks are recorded separately.

## Fish-method rods and keepnet purchase choices

Each stocked fish-method starter offer now identifies the matching rod style and links the lowest-price recorded rod in the selected area. The choice is explicitly for a budget start; an owned rod of that style can be kept. If that area stocks no matching rod, the page directs the player to an existing rod or the linked rod's sale areas. No catch-success rank is inferred. Source checks enumerate every recorded fish/area/method to verify rod style, local stock availability and the minimum price. This is a rod-and-bait selection step, not proof of a fully assembled rig or a walking route.

Keepnet 0B/0C/0D cards and details compare capacity, shop areas and full purchase costs, link the other sizes, and link the Daikon exchange effect for a kept quest fish. The same/smaller purchase rejection and ability to buy a larger size directly are traced in the existing shop handler. The all-record renderer checks capacity against the traced source and front-facing comparison links. Local browser: fish18/area3 -> float rod04 -> matching fish18/area3 return.

Full-goal work remains: confirm field access/traversal and actual shallow-water net positions; audit the remaining lure/bait decisions; verify wider rendered flows rather than treating source coverage as site acceptance.

## Bait/lure decisions, rig-specific actions, and the tub exchange

All 23 bait and 81 lure cards/profiles now have purchase/use copy and bounded comparison links. Lower-price choices preserve the full compatibility set (both float and sinker routes for baits), use actual decoded stock, and compare full purchase prices. They are not rankings of bite rate or fight/landing success. The per-area links retain target fish, stage, bait rig, and return route. Same-gate peers and price alternatives are reproducible with `scripts/build_bait_lure_choices.cjs`; source guards independently check every peer, every available area alternative, prices, and rendered localized advice.

Fixed a concrete false-positive: bait compatibility previously accepted a target if either rig passed, even when a sinker URL was selected. The status now uses the selected rig. A rejected rig gets a front-facing do-not-buy instruction and, when the same bait passes the other rig, a direct switch link. The page starts at that action rather than scrolling below it to the long fish list. Local browser checks: Worm01/Iwana01/sinker rejects -> switch float accepts; Aquatic insect07/Hariyo22/area2/float -> lower-price08 retains fish, area, rig and return -> Hariyo profile displays the tub quest.

The tub's original-ROM NPC trade is now linked from tool01 and fish22. Bring Hariyo to area2 (87,27), leave a general-tool slot free, and skip the trade if a tub is already owned. Controlled original-ROM probes used injected fish: success removed Hariyo and granted tub01; an empty keepnet did nothing; a full tool inventory removed the fish without granting the tub and left the event flag clear. This verifies transaction ordering, not natural catching or entrance-to-NPC traversal. The crop is original terrain, checked against the hashed map manifest and exact ROM coordinate records. Launch-use facts remain visible as well as acquisition guidance.

Full-goal work remains: actual shallow-water net use positions, area6 seller access, field access/traversal, downstream fight/hidden conditions where they prevent a player decision, and broader browser state coverage. Source render checks and representative clicks do not establish whole-site acceptance.

## Rod-card decision wording follow-up

All 21 rod verdicts now lead with an action and a comparison or use condition in EN/TH/JA. The same verdict is used on the catalogue card, item profile and comparison table. Rod 02 explicitly says to retain an owned rod rather than buy 04 as an upgrade, because both decoded effects would fall; its next two-effect improvement is linked to stocked rod 14 in area 3. The verdicts distinguish owned-item use from a full-price new purchase and retain stage-specific exceptions. Unresolved species response and branch selectors remain inside collapsed evidence.

Verification: all five existing source checks passed; actual Thai browser inspection showed all 21 card decisions and the expanded recommendation column. The 02 comparison link opened 14 with a working catalogue return. This establishes this rod-card change, not acceptance of every screen or an overall landing-success ranking.

## Missing bait-rig equipment and usable local alternatives

Fish starter offers now include a budget non-species-matched hook and the appropriate float/sinker with authentic sprites, local full prices, and item links retaining target, stage, method and return. Owned equipment is retained. Four-item new-purchase totals appear only if all four records are stocked locally. When a sinker is absent, a compatible locally stocked float offer is linked if available. Lure/fly offers explicitly exclude unnecessary bait-hook/float purchases; the sinker/casting offer now also displays the HP100 aim reminder.

Source checks enumerate every displayed method for each recorded fish/area in EN/TH/JA, verifying role, minimum eligible price, local stock, all four cost terms, context-preserving links and conditional float fallback. Local Thai browser: Donko0E/area2 sinker absence -> float action; equipment link -> sinker0A profile retained fish0E/stage2/route and return. No catch-success rank or natural route traversal is asserted.

All 47 wing decisions now expose the persistent hidden body/wing check and the collective three-bundle action. Recasting the same setup does not reroll it; changing only a wing may leave the other block active. At least one of the three complete target-specific bundles avoids this one gate while stored values remain fixed; no bite is guaranteed. This restores an actionable finding that an early gear-decision return had hidden. All 134 fly-component cards/profiles also link directly to the authentic maker steps; the catalogue opens that disclosure when entered by its fragment. Local browser: wing09/Rainbow06 -> open target backup disclosure -> back -> maker disclosure opens and retains fish context.

## Net gathering point and clearer rod comparisons

The net now links one original-ROM terrain point in area 1 at (9,105), with an aquatic-insect portrait linking to bait07. Its action explains menu use, moving before reuse and the nine-piece cap. The player-facing location explicitly does not establish an entrance-to-point walking route. The two controlled executions, injected tool inventory, pre-existing bait stack, and observed zero-to-three change are recorded in the linked technical report/data rather than used as a fixed yield or natural acquisition claim. Other areas are not given guessed coordinates.

Net-to-bait links now use the row's gathering area and preserve the selected fish and bait rig. A checked Thai browser path from net04/target06/sinker to the area1 map and its bait07 portrait correctly warned that sinker does not pass this target's bait check and offered a float switch. The source checks additionally render that cross-area context in all three languages. This verifies the link/context change, not a natural route to the net point.

Rod comparison rows now expose the existing decision reason and a direct detail action for all 21 rods. Rod06 and rod11 choices resolve the budget and shop-area tie instead of saying merely to choose one of two alternatives. Live rod02 and the 21-row Thai comparison were inspected after publication. Full-site acceptance remains unproven.

## Compass exits and crawler-visible rod decisions

Magnet0E now resolves a navigation choice: maps show the five fixed outdoor exit targets, and the player can skip buying it solely to learn those coordinates. The ¥300 purchase is for in-game bearings from the current position. Area-specific links open the matching section at its original-ROM terrain crop. The main copy explains using the magnet again after movement and the needle stopping at the target; internal map13 and instruction addresses remain in the linked source report. These points are not tested walking routes. Area6 remains excluded because its target is dynamic and its heading is story-gated.

The generator independently validates the original ROM hash, table row bytes, five exact targets, Area6 sentinel and five source-map hashes. Source guards require the five stage links and matching fragment anchors, localized action/route limits and exclusion of a static Area6 point. Local browser: Thai area2 link -> correct (56,17) section -> Japanese retained stage/fragment -> area5 -> English retained its (22,2) section.

A fresh direct HTTP read of each public EN/TH/JA catalogue HTML response, before JavaScript, showed all 21 per-rod decisions including Tanago01's do-not-buy recommendation. The source checker now requires each published HTML card's verdict, recommendation and reason to match the current data above technical evidence. This protects the crawler-visible content as well as the interactive renderer; it does not guarantee when an external search index refreshes its stored copy.

## Same-item area navigation

The published compass area-2 action opened the correct (56,17) section with both original map and item portrait loaded. This live check exposed another usability defect: each same-item area switch wrapped the current item URL in a new return URL, sending the back action through unnecessary intermediate views. Same-item area links now preserve the original entry page, or the initial category fallback when no entry was supplied. Links to a different item still return to the source item.

Source checks switch through areas 2, 5, 1 and 4 with and without an entry route in all three languages, requiring a stable back destination and retained fish/rig context. Actual local Thai clicks from an area-2 map return through compass areas 5 then 1 preserved the original map/fish return. All five existing source checks passed; these are scoped navigation checks, not whole-site acceptance or evidence of a natural walking route.

## Missing-hook purchase, rejected chum placement and profile43

The hook category now gives a six-area replacement table for a lost or missing bait-rig hook, and every hook card/profile links to it. It keeps owned hooks and excludes unnecessary bait-hook purchases for lure/fly. The table chooses the minimum unconditional recorded price among hooks whose fish-ID field is zero; it does not rank their different fight responses. The builder derives the choices from the actual records/stock, and independent source assertions check each minimum and stage-specific link. Actual local Thai click: area3 budget hook09 opened its profile with stage3 and a corresponding seller link.

All three remaining-charge versions of chum now explain that an already-active-marker rejection spends no charge and how to place a new point: continue fishing until it clears, move until the old target leaves the active window, or change area. No elapsed time or number of casts is promised. The active-target and current-window instruction fingerprints were independently compared with the original ROM; the window is based on current X/Y values, not a fixed world address range. Source guards require the recovery action before technical evidence in all locales.

Profile43 no longer presents empty location/compatibility sections as a fishing guide. It tells the player to choose a named fish with confirmed spots and links to a target-free fish search, while retaining its technical record and research source. A fresh hash-checked extraction from the supplied original ROM confirmed its zero mask and empty bait/lure/fly candidate lists against the stored evidence; the spawn extract has no confirmed point. This does not label it a normally obtainable fish or claim that a table row is absent from the game. Local Thai click reached the catalogue's fish combobox without retaining target43.

The scoped food/chum/hook source review found no additional material food-action gap. This does not replace the remaining whole-site browser/state audit, natural-route research, Area6 shop traversal or unresolved code-dependent decisions.

## Follow-up: keep fishing decisions through seller navigation (2026-10-04)

- Item → seller and seller → item now retain the shop area, selected fish and float/sinker rig for fishing equipment, bait-gathering tools, groundbait and map navigation with the magnet. Food and unrelated tools retain area and a contextual return link, without presenting that fish as their own target. Magnifier is tool 03; notebook 05 is not a fishing-target tool.
- Catalogue seller and comparison links follow the same relevance rule. Going from a fishing setup to food does not attach a misleading fish-compatibility context; returning restores the earlier selection.
- Changing language from an item or shop localizes the nested return chain through supported item/shop/fish/map/research pages, up to four nested returns. External nested destinations are discarded.
- Local browser evidence: Thai bait 01 / Iwana / sinker → seller → bait 01 preserves the rejection and offered float-rig switch; switch to English → back to shop → back to initial bait profile preserves language and selection. Shop food filter → orange01 presents no fish target while its return still retains Iwana/sinker.
- Renderer assertions additionally cover every recorded stock item in all six areas and three languages, and seller links on every stocked item profile in three languages. These are source-render checks; the actual click observations above are specific paths, not a claim that every possible website interaction has been manually completed.
- Research remains active: ordinary net traversal reached Area 1 (8,121), not candidate (9,105); connector mushroom selection and practical boat boarding points are being traced separately. The Area 6 magnet story prerequisite is not yet a named player quest. No new gameplay outcome is inferred from those partial records.

- Published shop navigation release `6f40f33` was confirmed built by GitHub Pages and checked through Thai bait → shop → bait, then English switch → shop back → initial item back, with Iwana/sinker intact.
- The same audit found map language switches kept the return page in its original language. Map language links now localize the supported nested return chain, retain item/fish/stage/rig filters, and discard external nested destinations. The map harness covers all three target languages, an item → shop → research chain, and the external-return rejection. Local actual clicks: Thai bait → fish map → English → back reaches English bait01 with Iwana/sinker rejection intact.

- Early navigation regression: before the map data promise resolves, language links now carry the incoming area/fish/section and localized return route. The functional harness asserts this before calling map initialization; users need not wait for fish data to retain their selection when switching language. Published post-load map language/back clicks also preserved the bait01/Iwana/sinker choice.

## Follow-up: profile navigation during pending data (2026-10-04)

- Item and fish profiles now establish their language and back links synchronously, before their catalogue/location requests resolve. The loaded render still validates identities and refreshes navigation normally.
- The entity harness holds both requests pending and checks all six locale/profile combinations before any profile body can render: selected item/fish, stage, bait rig, and recursively localized return are retained. The shop harness independently holds data pending and verifies all three locale variants keep area6, target, rig and localized item return; shop initialization already established those links before its requests.
- Local browser: Thai bait01/Iwana/sinker → Japanese retains target and rig; its fish-profile action → Thai retains the nested item and map return. Iwana's fish profile selects its recorded area1 rather than inventing an area3 spawn.
- This addresses the observed early-language-navigation defect; it does not certify all gameplay findings or every website state. The full player-usefulness goal remains active.

## Follow-up: gathered bait choices and mushroom outcomes (2026-10-04)

- Seven bait profiles/cards now offer a magnifier gathering alternative derived from the existing 30 original-terrain forage examples: IDs 01,02,04,0A,0B,0C have examples in all six outdoor areas; potato11 has examples in area3. The selected area is offered first when a matching example exists; otherwise the recorded areas are shown. These examples are not exclusive locations, guaranteed yields, or verified walking routes.
- Each choice lands at its exact area/context example after data loads. Clicking a bait portrait in a tool map carries that map's area, selected fish and rig to the bait profile, and back returns to the precise example. This fixes the prior forage-marker link that retained the earlier item area even when another area's picture was clicked.
- Source checks cover every forage point/marker and all seven bait profiles across six selected areas and three languages, plus catalogue-renderer forage choices. Local actual Thai clicks: bait01/area3/Rainbow/float → magnifier area3/context1 → bait portrait → bait01 retains area3/target/rig → back lands at the same original terrain example.
- The new source report and verifier follow both magnifier draws, the food-slot gate, identical discovery message and the shared counter-driven byte source. Main independently ran the verifier against the supplied ROM hashes and exact fingerprints. A mushroom type is not assigned by the coordinate in this branch; balanced table parity is not turned into a visit probability.
- Magnifier03 and both mushroom records now explain that no fixed safe mushroom tile is established and offer recorded shop food for HP recovery when the mushroom cannot be identified. Original runtime evidence remains responsible for food09 +10 HP / food0A HP-zero; this new trace establishes selection, not an extra healing experiment.
- Full goal remains active: ordinary boat boarding points, Area6 seller traversal and the exact magnet event/menu action still need stronger evidence; the natural net route has not yet reached the candidate.

## Follow-up: make every shop-food choice actionable (2026-10-04)

The six ordinary shop foods now state when to use/buy the item in terms of missing HP, its verified recovery and price, using owned food first, and avoiding excess recovery above maximum HP. These are decisions derived from the existing original-ROM traces and isolated recovery measurements; no new bite or catch bonus is inferred.

Food profiles show alternative foods recorded for the selected area first. The full cross-area HP/food guide and its item links remain in a closed disclosure instead of repeating a long global recommendation and unavailable-area alternatives in the main view. The guard checks all six foods against runtime-confirmed recovery and the one-yen-per-HP prices, then renders 108 food/area/language combinations and requires exactly the locally stocked alternatives with retained area links. The full aggregate passes. Actual browser clicks: area5 lunch06 → Dango03 retains area5; the 390px layout remains readable.

The whole-site goal remains active while natural boat boarding/access and the named Area6 magnet prerequisite are being researched. Passing these food checks does not resolve those gameplay evidence gaps.

## Follow-up: turn tub placement into a boarding instruction (2026-10-04)

A continuous original-ROM probe from a naturally reached Area1 `(4,183)` position used the normal General Tools menu, placed a tub, dismissed the message, then tapped Left. It entered tub mode 3 and finished at `(3,187)`. The coordinator reran the probe with the same result. Inventory setup adds only the tub: no coordinate, terrain or story injection. This proves the bounded boarding sequence when a tub is owned, not acquisition or the route from a new-game start, and does not establish canoe boarding.

The tub profile now has an owned-tub action leading directly to an original-terrain crop at the example tile and the tested menu/directional steps. The existing Hariyo exchange location remains present. All three languages preserve the example limitation and evidence links; the guard checks the profile action, anchor, location and clean runtime screenshot fingerprint. Source evidence is in `docs/tub-boarding-research.md` and `data/tub-boarding.json`; private ROM/core/save-state files remain unpublished.

Follow-up: an independent input-only walk from the verified Area 1 house exit (8,183), four tiles left to (4,183), succeeded without memory writes. Walking and boarding were separate recorded probes; this does not claim a single continuous acquisition-to-boarding replay.

## Completion audit follow-up (2026-10-05)

The full player-usefulness goal is still unproven. A fresh review of the current evidence identifies these remaining action gaps, beyond the selected-fish catalogue verdict change:

- **Gold Net:** Area 1 has a controlled-use point, but an input-only route from the house/entrance has not been established. Areas 2–6 have decoded rewards without confirmed reachable use points. Next evidence: ordinary walking route, shallow-water position, normal menu use, and bait inventory delta, keeping any owned-tool setup explicit.
- **Area 6 shop:** a known seller coordinate does not prove a route from the entrance. Next evidence: walk from a naturally reached entrance and open the shop normally.
- **DIY flies:** ready-made bundles are actionable; maker pictures still need a verified picture-to-record mapping before players can reliably apply body/wing choices to that menu. Next evidence: selection index, original picture and component record, with the actual quoted combination price.
- **Area 6 magnet:** the bounded static trace establishes record-slot and prerequisite flags. The natural encounter/result trigger remains unverified; no catch recipe is inferred from it.

These are research tasks with direct player outcomes, not reasons to expand raw-number summaries. Passing source guards does not establish their completion.

## Parallel completion queue (2026-10-05)

The owner redirected work away from the net and magnifying glass. Both are deferred; their existing evidence is retained. The current batch has three independent workers plus the coordinator:

| Stream                | Owned work                                       | Required outcome/evidence                                                                                                                                     |
| --------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fly ROM trace         | Private maker-code notes only                    | Confirm menu cursor/list to component IDs, quoted price and inventory requirements from the original ROM.                                                     |
| Fly runtime crosswalk | Private controller-input probes only             | Match authentic menu pictures and cursor selections to stored body/wing/tail IDs, with money/inventory deltas. Setup injections must be disclosed separately. |
| Catalogue clarity     | Selected-fish status and decision-fact rendering | Correct all/body/bait result labels in EN/JA/TH and remove repeated decision reasons without removing evidence.                                               |
| Coordinator           | Integration, maker guide, release checks         | Turn confirmed findings into selectable player instructions; inspect desktop/mobile and run the full publication gate.                                        |

When workers finish, dispatch the next independent batch: Area 6 ordinary shop access, the Area 6 magnet's natural prerequisite/use path, and fish/map navigation review. A decoded coordinate alone does not close either access task. Map review must follow selecting a fish through its actual fishing location and accepted equipment, including return links and filters. Workers must own separate files/directories; generated artifacts, integration and publication remain coordinator-owned.

Final audit still covers every catalogue category, fish/maps, shops, item/fish details and research navigation in all three languages. Every visible gameplay claim needs a concrete next action or decision supported by original-ROM evidence; unresolved selectors belong in technical evidence. Automated checks cover the recorded data and link invariants, while actual browser interaction and visual review cover usability. This queue records known gaps, not a claim that every other requirement is complete.

The first maker UI change replaces descriptive screen captions with seven player steps, including starting the rear-NPC interaction and checking the observed ¥25 quote. Original screenshots remain byte-identical. The picture-to-record crosswalk is a separate pending requirement, so this change does not complete DIY fly advice.

### Active follow-up queue

The static maker worker and catalogue-label worker completed their first bounded tasks and moved to Area 6 ordinary shop access and fish/map navigation respectively. The controller worker is finishing verified Mayfly selections and None pricing. The coordinator independently confirmed the default 01/09/13 recipe, 25-yen quote, 100-to-75 money change and completed-fly inventory write.

This batch also corrects all 47 wing decisions: the maker supplies parts, so players do not need to bring an owned wing. Selected-fish result labels now distinguish body-profile acceptance from component sale compatibility. Card decision reasons render once. Historical picture counts remain in research with an explicit unresolved mismatch, rather than becoming confirmed menu counts.

Next dispatch when the controller slot is free: Area 6 magnet prerequisite/use research. After the access/navigation reports, implement only evidence-supported route instructions and navigation repairs, then conduct the final category/profile/shop/map audit. The net and magnifying glass remain deferred by owner direction.

## Selected-fish fly profile action (2026-10-05)

Body, wing and tail profiles now replace the generic no-target purchase paragraph with advice for the selected fish. Bodies state whether their decoded profile check passes; wings/tails direct players to a compatible body and complete starter sets without claiming standalone compatibility. The starter action keeps the localized target, chooses an actually recorded fish area, and returns to the exact item profile. Existing decision reasons, component stock and technical evidence remain available.

The new guard renders 27 locale/category/target cases, checks localized starter anchors and exact item return, and verifies no-target profiles retain their existing advice. Actual local Thai wing09/Rainbow/area1 click opens the expanded 5-yen starter fly set; its return preserves wing09, fish06 and area1. The full local gate passes. This does not establish all maker palette positions or finish the map-return/access tasks.

## Maker crosswalk and exact map return (2026-10-05)

The maker guide now includes nine authentic frames: tested directional selections for body01/02/05, wing09/0A/0D, first tail13 and visible None→stored00, plus the independently replayed 17-yen no-tail order. The12-yen branch is explicitly quote-only; full palette mapping remains unfinished. Original captures and technical evidence are retained, and no recipe is promoted as a best-catch choice.

Map equipment actions now carry the current fish, area, map section and nested return. The catalogue shows an exact map return both in its header and at the selected-fish landing panel. Language switches recursively localize supported returns and reject external destinations. Actual local Thai map area1/section s1-c1-r6/Iwana→equipment→nearby return reached the same map; switching to English before returning reached maps.html with the same area, section and fish.

The full local gate passes. Runtime recipe probes establish bounded menu operations; automated link checks and these browser paths do not finish Area6 shop access, magnet triggers or the whole-site usefulness audit.

## Full inventory and map audit, 2026-10-05

Independent source/data audits at `1a7e22b` reconciled all **315 item records**: 21 rods, 81 lures, 23 baits, 13 hooks, 10 floats/sinkers, 64 fly bodies, 47 wings, 23 tails, 10 foods and 23 general tools. Each rod/lure/bait/hook/float/fly entry has a decision; food and tools have localized player-use summaries and appropriate stock, acquisition or use actions. The net and magnifier remain deferred by owner direction. This inventory audit is not a new gameplay-performance or browser-proof claim.

The map audit reconciled **72 located profiles**, 103 fish/area memberships, all 1,536 source spawn rows and 1,437 distinct species/area/tile positions. Unresolved profile `43` is retained in research without an invented name, sprite or location; it is omitted from map search. The notebook covers all 66 accepted IDs, with available/new/repeated counts `6=6+0`, `12=10+2`, `15=11+4`, `22=17+5`, `27=11+16`, `15=11+4`. IDs `44..49` have map points but no notebook slots.

### Actionable gaps being addressed

- **Component selection:** [Caddis and Terrestrial positions](fly-maker-other-families-menu-research.md) add 48 verified real components and two None choices. Fifty-two controller observations, including two clamp cells, were independently repeated; selected IDs and original cursor-image hashes all matched. Terrestrial bodies go directly to the quote rather than requiring wing/tail choices. These are Area 1 menu facts, not catch bonuses or natural progression proof.
- **Area 6 regular shop:** the old location dataset still omitted a verified entrance association even though a [33-step independent walk](area6-shop-walking-research.md) had been published. The extractor now checks the entrance, arrival, counter and original screenshot hash before linking entrance 2 to slot `08`. Its debug fixture scope remains explicit.
- **False coordinate warning:** focusing a valid shop entrance previously counted other deliberately hidden entrances as invalid coordinates. Actual browser interaction exposed this; the location model now counts invalid endpoints before applying the focus filter. Genuine out-of-bounds coordinates must still be rejected.
- **Water-mark lookup:** seeing a small mark, large mark or bubbles should lead to stage-local candidate fish, not require opening profiles one at a time. The ROM-derived class data supports a possible-candidate filter; it does not support species identification or per-cast percentages.

The full goal remains active. Exact Diptera/Stonefly maker positions, the visible natural notebook-update trigger and other disclosed research limits are not established by this batch. Automated source/render checks and bounded browser paths must be recorded separately from natural gameplay observations.

### Follow-up: game journal 13 versus guide route 11

Rechecked the original ROM journal parser and all 19 routine fingerprints on 2026-10-05. Area 3 offers 15 journal-eligible species: 11 first seen on the area-1-to-6 route plus four repeats. The game screenshot’s 13 is the current save’s area-page count; it is not a fixed species target or the guide’s route addition. All six page counts use the same saved best-size area assignment. The guide presents available journal species as 6 / 12 / 15 / 22 / 27 / 15, separately from route additions 6 / 10 / 11 / 17 / 11 / 11, in English, Thai, and Japanese. Their overlap means the available counts must not be summed as a completion target. The global target remains 66 unique journal slots. The screenshot alone does not identify which species are missing.

Local browser review covered 320/390 px mobile and 1280 px desktop, the three original water glyphs, area-3 bubble candidates, area-1 empty results, incompatible selected fish recovery, Show all, reload, locale change, and a fish-detail round trip. The journal remains a separate full-area list when a mark filter is active. Caddis and Terrestrial menu choices were inspected using the original 256×224 captures; Area 6’s focused valid entrance no longer produces a false invalid-coordinate warning.

Release gate: `npm run check` passed for cache `compendium-20261005-21`, including formatting, FSD and size limits, research-source and publication safety, 31 reproducible frontend outputs, item/fish/link guards, the bundled water-mark filter matrix, all six shop areas, map comboboxes, and multilingual research search. `git diff --check` passed. Automated coverage and browser inspection are separate evidence; this closes the current corrections, not all remaining gameplay research.

## Follow-up: Area 6 Magnet without a heading (2026-10-05)

The Magnet detail in Area 6 previously described a story gate but offered only the five other areas' exit pictures. Its recovery panel now gives three usable paths: compare names against the notebook checklist, choose Area 6 fishing spots directly, or read received postcard 06 in the game after checking the records. If the doctor's request appears, that read sets the heading flag; the linked postcard guide explains the conditional target action. It distinguishes the required 65 distinct game-record slots from repeated catches and from the separate story prerequisite; 65 alone is not an unlock instruction. The web checklist cannot read or alter a game save.

The current area's fixed exit picture stays visible in Areas 1–5, while the other areas' pictures remain available in a closed disclosure. No location data, anchors, research sources, or original captures are removed. The complete natural sequence that first sets the story prerequisite remains a research task, not a claimed player route. See [the ROM gate trace](magnet-story-gate-research.md).

Mobile return verification also exposed a moving click target during animated map scrolling. The map return link now has the existing sticky-header scroll margin, and map anchor scrolling is immediate, so the return target settles before it is clicked.

## Selected-area purchase guidance (2026-10-05)

A player opening an item from Area 6 previously saw Area 1 stock before recorded Area 6 stock. Item purchases now put the selected area's recorded seller or ready-made fly bundle first, with an explicit localized marker. The other recorded areas remain visible. When there is no recorded offer in the selected area, a short notice says so before showing recorded alternatives; this is not a claim that the item is impossible to obtain there by other means. Conditional stock, bundle components, prices and return routes are preserved.

The same ordering applies to exact ready-made fly price comparisons through the shared assembly list. This changes presentation of existing ROM-derived shop records, without adding stock, access, price or fishing-effect claims. Separate automated checks cover available, missing and invalid area selections; actual mobile/desktop journeys remain the visual acceptance check.

A separate current-page review confirmed the next context gap: rod 03 still leads with an Area 1 budget recommendation when opened from Area 6, although recorded stock there includes 03/04/14/15. Purchase ordering does not fix this advice. The next step is selected-area rod tradeoffs derived from existing stock, price, aim and reach evidence, with no inferred catch-power claim.

## Rod advice follows the selected area (2026-10-05)

The rod context layer compares only recorded shop candidates for the same ROM fishing style in the selected area. The catalogue card, comparison row and item detail share this decision. Full new-purchase price, aim-window cutoff and the traced fish-position loss boundary support budget and handling choices; they do not establish catch probability, a universal best rod or fish-specific advantages. Casting/lure aim comparisons assume HP100.

A rod without a local offer must be distinguished from an area without any recorded rod of that style. In the first case, the guide compares recorded local candidates; in the second, it gives explicitly other-area purchase options and a keep-owned path. General route advice is retained with its scope labeled, and original records and research sources remain accessible.

Fresh original-ROM extraction on this pass reproduced `data/rod-response.json` and `data/shop-stock-rom.json` exactly (21 rod records and all six area stocks). This validates the inputs to the advice, separately from whether its sentences and links are useful or correct.

## One checklist for all 66 journal species (2026-10-05)

The journal guide now offers a complete route with one entry per eligible species, grouped by its first numbered area: 6/10/11/17/11/11. Every entry retains an original-game portrait and direct actions for its fish profile, filtered map and compatible equipment. This full-route count is separate from each area's available-species count and from the current game's movable journal page totals. Profiles without journal slots stay in the area catalogue, outside the 66-entry route.

Full-route and area checkboxes share the existing species-keyed browser storage. Checking the same species in both views counts once, and the unmarked filter applies to both. A return from a route entry opens its original group, including when the destination belongs to another area; language changes preserve that group. The checklist does not read the game save.

The data audit covers all IDs 01–42 and their 97 fish/area memberships. Every species has mapped points and a complete compatible local float setup in its first route area. Availability in a generated game state, bite/landing success, quest completion and a natural 66-species playthrough are not established by these checks. The full-site usefulness goal remains active beyond this bounded route and rod release.

## Fish meals and map links (2026-10-05)

The food audit found an obsolete uncertainty: the earlier food experiment did not identify the stored-size unit, while the later water/keepnet trace copies the current size directly into the keepnet and displays it as centimetres. The first-fish meal now explains the usable conversion: divide its displayed centimetres by four, round down, restore at least one HP, and clamp to missing HP. The first fish is removed. Kusafugu is an exception that sets HP to zero. Historical controlled observations remain distinct from the later code trace; neither proves a natural all-species meal trial.

Catalogue map links previously held only a fish ID until navigation pointer/focus/click handlers refreshed them. Ordinary clicks worked, but the initial link itself omitted the resolved area, rig, map and return context. The catalogue now creates the complete link after updating its filters, so copying or opening it directly retains the same context. Independent guards check initial links separately from rendered click/return journeys.

## Filters follow the player's task (2026-10-05)

Food and general-tool browsing now shows item search, category and sorting without the global target-fish picker. Choosing a fish belongs to tackle browsing, and those controls return when entering a fishing category. Tools still retain their own species links. An incoming food/tool URL with a stale target fish now displays its requested category and items instead of mixing an `all` category control with empty results; the nested source return remains intact.

Shop search now enters browsing mode when the player types a new query, clearing the previous item target and focused entrance. Previously a Spoon target message and seller actions could remain while the list showed only Soft Worm. Existing bookmarked URLs combining a query with an item target follow the same rule. The category, area, town/outdoor view, target fish, rig and original return are preserved; clearing the text does not resurrect the old item target. This corrects presentation state and adds no stock or acquisition claim.

## Equal-price bait/lure purchase choices (2026-10-05)

A bounded audit of all 81 lures and 23 baits found that strictly cheaper
comparisons omitted useful same-price broader-coverage purchases. The 104
records now preserve area-specific equal-price alternatives independently of
cheaper offers. Seven items qualify; all other records retain empty maps.

Cards and item detail decisions expose the choices as area/rig/return-aware
links. The catalogue omits its redundant “no cheaper” fallback when a same-price
choice exists. Owned compatible items remain usable; compatibility coverage is
not described as bite, fight or landing superiority. Technical gates and the
original cheaper comparisons remain intact. See bait-lure-player-choices.md.

## Independent 66-species coverage recheck

An independent 66-species recheck regenerated the notebook completion data
directly from the original ROM and matched the published dataset exactly.
All 198 first-area fish details (66 species in three languages) contained
valid map and compatible-equipment actions: 576 map previews and 10,854
compatible item links. The six-area checklist retained all 66 unique IDs,
with 97 area memberships and 31 repeats. This verifies guide coverage,
not a natural 66-species landing playthrough.

The maps page now uses that route as the single new-species checklist instead
of rendering the selected area's new fish twice. Opening the journal guide
opens the matching route group. Count explanations, the in-game verification
procedure and cross-area availability totals share one closed help disclosure.
The main panel retains the area summary, manual progress and fish actions;
checkbox text is shorter while accessible labels still state in-game checking.
Repeat species, exclusions, all 66 route entries and ROM evidence remain.

## Fly-maker location decisions

The 134 fly component summaries and supporting actions were audited separately.
130 have observed menu choices; four unverified wing records retain limited-path
advice. A real next-action gap remained: even-family instructions named the
palette condition but did not say where its maker was. An original-ROM trace
now distinguishes maker slot 10 in towns 7–9 from the special-rod NPC in towns
10–12, and links the 130 verified choices to matching local maker/entrance
endpoints in areas 1–3, falling back to the first recorded maker where needed.
The renderer preserves controller-replay limits and does not imply story access,
a clear walk, or fishing superiority. See fly-maker-access-research.md.

## 2026-10-05: shop recovery choices and one recommendation location

A rendered Area 1 shop showed only orange/rice-ball names and prices. Shop food
cards now expose their ROM-backed numeric recovery, qualified as an upper limit
because recovery cannot exceed missing HP. No recovery is inferred from an item
price, and quest/conditional-sale information is retained.

Equipment purchase recommendations now have one canonical category disclosure.
The general quick guide keeps the pre-fishing HP tip and links to that disclosure
instead of repeating its cards. All-category browsing retains all recommendations;
category/style filtering retains matching advice. A link opens the disclosure and
is omitted where no disclosure exists.

Fish detail pages now put area maps and equipment choices before the water-mark
explanation. Their opening instruction is shorter; compatibility limits, all icon
classes, exchange actions, and technical evidence remain available.

Local browser review exercised food card to detail and return, the quick-guide
link opening four rod recommendations, and fish 06's map-before-shopping flow.
Mobile shop rendering was also inspected at 390px. This is a bounded improvement;
the full-site usefulness goal remains active, and these checks are not a natural
playthrough or proof that every research uncertainty has been resolved.

## 2026-10-05: preserve decisions while reducing repeated guidance

Food details 01–06 now lead their comparison panel with the local alternatives,
without repeating the owned-food, equal-cost and missing-HP rules already in the
visible item advice. Recovery labels state an upper limit. The closed full
comparison still includes the HP-100 aiming advice and area-by-area food choices.
Other foods and milk retain their distinct effects, hazards and quest actions.

All/Lure catalogue views keep one canonical coverage recommendation and its
localized link to the illustrated kit/species table. The generic quick-guide kit
is hidden in those views, retained on other categories, and remains hidden for
targeted-fish browsing as before. The general rod-route scope is stated once per
category block when an area is selected. Ordinary purchase captions no longer
expose the ROM field label; prices, recorded sellers and raw technical evidence
remain available.

Actual local browser review covered the food detail comparison at 390px, opening
its full comparison, the canonical Thai lure-kit link to research, Japanese
Rod→Lure filter changes with the quick guide open, and All with Area 4 selected.
These checks support this release's flows and do not certify the entire site's
usefulness or a natural gameplay run. The full-site goal remains active.

## Giant-eel preservation and fish-meal clarity (2026-10-06)

The first-fish meal now gives a specific preservation choice: when keeping a giant eel for the doctor's request, use other food instead of eating it as the first keepnet fish. The original-ROM meal consumer removes that first fish and has no giant-eel protection. This is distinct from the separate town-sale path that temporarily protects one eel before story bit `0x10`. The canonical food research records the consumer addresses and byte fingerprints; no delivery coordinate, reward, or full quest replay is inferred.

The catalogue and detail share two practical notes: displayed-size recovery examples and the eel-preservation action. The generic empty-stock purchase section was replaced with a caught-fish explanation and a link to food choices that retains the selected area and detail return path. Four repetitive detail bullets were replaced by those notes; original data and technical evidence remain. An independent guard first failed on the absent preservation text, then passed with exactly one warning on both surfaces in all three languages, existing food effects and examples retained, and no invented coordinates.

Three separate bounded journeys—low-HP food to a listed shop, an unstocked rod to a local alternative, and a target fly's ready-made versus DIY price—had no decision-changing defect. Actual public fish selection was also rechecked: selecting a target from a float category opens compatible bait. These observations are not full-site completion evidence. Natural giant-eel quest timing, broader fight controls, and remaining collection/acquisition journeys still require research or rendered checks.

## Item-by-item decision review (2026-10-06)

Two independent source and rendering-path reviews covered all 315 item records,
split into 141 rods, bodies, hooks, floats, foods and tools, and 174 baits, lures,
wings and tails. The review checked the actual advice precedence, comparison and
acquisition routes rather than treating the presence of a summary as acceptance.
This is a semantic source review, not a claim that every item was clicked in every
language and device size.

The bait/lure catalogue now states its comparison limit once above the results,
instead of repeating it on each of 104 cards when no fish is selected. Owned-item
advice, local stock, cheaper alternatives and equal-price choices remain on each
card. Mixed-category browsing labels the note as bait/lure guidance. Unrelated
categories clear it; standalone details retain their own limit.

The postcard card now exposes the next action already available in its detail:
after seeing the doctor's giant-eel request, open the fish's bait/equipment page
or its configured Area 6 map point. The point must exist in the decoded data;
inactive-spawn and unverified recipient/reward limits remain explicit. This adds
navigation, not a newly proven quest outcome.

Three Mayfly wing records (25, 66 and 67) still lack a verified maker position or
ready-made shop route. Their research remains available without an invented
acquisition instruction. Rod response branches and relative bite/landing odds
remain evidence questions. Dry-body recommendations already explain appearance
or using an owned body in their comparison disclosure, so that initial suspected
gap did not require a change. Broader map, seller and collection journeys remain
in the completion audit; this release does not finish the full-site goal.

Actual local review covered Thai bait (23 cards), lure (81), and mixed-category
(315) browsing with no repeated card scope note, and clearing the note when
switching to food. The Thai postcard map and profile buttons were clicked at
390px: both open Area 6 for the eel, and map return restores the source Area 4,
search and card anchor. Separate buttons use the existing 44px minimum hit area.
English was inspected at 1200px and Japanese at 320px; the affected card does not
overflow horizontally, and the English profile link opens the correct fish.

## Seller map-to-stock handoff (2026-10-06)

A separate shop journey review covered all six areas and found one reproducible
navigation defect: after opening seller locations and changing area, the seller's
stock link appended a second fragment to the existing `#location-section`. It
therefore missed the intended stock section. The link now replaces the fragment
while retaining the selected area, town, target item and return context. Regular,
special-rod and ready-made fly stock retain their distinct destinations.

Actual local Thai review changed Area 4 rod 0D to Areas 2 and 6 using the visible
selector and clicked the seller's stock link. Both reached exactly
`#regular-stock`; the Area 2 stock heading was visible, and the Area 6 path worked
at 390px without horizontal overflow. The independent guard reproduces the
original malformed fragment before the fix. This supports the repaired handoff,
not the completion of every shop interaction or natural in-game purchase.

## Research search round trips (2026-10-06)

The strategy page still puts carry/buy choices first and keeps its raw tables
inside the technical disclosure. A real search-to-fish-to-return journey exposed
a navigation gap: returning discarded the typed filter and closed that
disclosure, requiring the player to find the same row again.

Matrix fish links now retain the localized research page, typed `q` and evidence
anchor. The returned page restores the input before loading aliases and opens
the disclosure. Language changes preserve the current query and topic. Typing
or clearing a query also updates the address without reloading, so a later
reload does not restore a stale filter. Existing Japanese-name/ID fallback and
alias-load warnings remain.

An independent regression first failed on the lost restored query. Actual local
Thai review searched Yamame, opened its fish page, used the explicit return link,
and confirmed the same one-row result and open disclosure. Switching to English
and Japanese retained that query. At 390px, changing the query and reloading
retained the new result; clearing and reloading showed all 72 ordinary profiles,
without horizontal page overflow. The zero-mask placeholder is retained in ROM
research rather than counted as an ordinary profile.

## Notebook route area changes (2026-10-06)

Changing the selected map area while viewing a bookmarked notebook route now
updates its fragment and open route group together. Previously Area 4 could show
the Area 3 route after changing area, and reloading preserved that mismatch.
Other map and notebook-summary fragments retain their own purpose.

The independent regression failed against the committed pre-fix map bundle.
Actual local review at 390px opened the Area 3 route, selected Area 4, and
reloaded: the address and open group both remained Area 4, all six groups and
the 66-species total remained present, and the page did not overflow. Existing
manual progress was retained; no game save is read or changed.

## Fish-profile notebook decisions and request context (2026-10-06)

A full 73-profile semantic audit found that following a map fish link lost the
distinction between the 66 notebook targets and six map-only profiles. Individual
profiles now say whether to collect this species for the notebook or skip it for
that goal. The first-area label describes the 1→6 route grouping, while the map
action keeps the currently selected area. Already-recorded species are not new
targets; a larger record can still move the notebook area. Profile 43 remains
unconfirmed, and the website does not infer progress from a game save.

Eligible profiles use this decision panel instead of a second generic map-first
panel. Excluded profiles retain the ordinary fishing action for people who still
want to catch them. The giant-eel profile carries the conditional doctor's
request and links to Received Postcard 06, keeping Area 6 and the original return
context. The recipient and reward after landing remain unverified.

Actual local review at 390px clicked rainbow trout's map action while Area 3 was
selected: it stayed in Area 3. The crayfish profile clearly said to skip it for
the 66-species goal. The eel-to-postcard-to-return journey kept the eel, Area 6,
and the nested map return. English at 1200px and Japanese at 320px retained the
excluded-species decision without horizontal overflow. These browser journeys
do not establish natural quest completion or a new notebook-update trigger.

## Public return paths and manual checklist review (2026-10-06)

The r60 public Thai research page was checked at 390px: searching rainbow trout,
opening fish 06 and using the explicit return restored the same query, open
technical disclosure and one of 72 ordinary profile rows. The loaded map and
research assets matched r60; the later fish-profile release was still queued.

Actual local Thai checklist review started with one existing marked species,
marked Koi 0D in Area 4, enabled the remaining-only filter, changed to Area 5 and
reloaded. The global count rose from one to two exactly once, marked cards were
hidden by the filter, and the repeated Koi cards in Area 5 remained checked after
reload. The filter resets on reload; the species marks persist. The test mark
was removed through the visible control, restoring the original one-species
state. This checks a real repeat-species journey, not every possible manual
progress state or reading a game save.

## Locally complete lure kits and HP recovery actions (2026-10-06)

The kit selector now enumerates two-lure unions from the recorded compatibility
profiles and compares complete pairs with regular area stock. Area 1 retains
2E+23 for ¥55; Areas 2 and 3 offer 17+24 for ¥55; Area 4 offers 17+23 for ¥50.
Areas 5 and 6 disclose that no complete pair is stocked locally. Already-owned
complete pairs remain useful; buying another pair is not required. These are
38 lure-compatible profiles, not 66 notebook targets or demonstrated catch odds.
The same decisions appear on fish profiles, the equipment recommendation and
the localized strategy guide, with item and seller destinations retained.

A separate rendered journey review found that the HP100 advice had no direct
food action. Catalogue quick-start and lure/casting starter tips now link to
food choices in the selected area and retain an explicit return to the original
page or starter card. The food destination drops the fish/equipment filters:
food selection depends on missing HP and stock, rather than fish compatibility.
The independent guard first failed on the missing action before wiring it.

Verification: the regenerated frontend passes the full `npm run check` gate.
Independent guards cover six areas in three languages, the 38-profile pair
matrix, all-area member links, research rows, ten seller actions, and fish-kit
item/partner return journeys. Item detail preserves the complete-kit intent
before its single-fish recommendation; invalid or unrelated kits show no panel.
Actual Thai mobile clicks verified fish-to-food/back and kit-to-partner/seller/
back, with no horizontal overflow. The final Area 3 fish view shows the locally
stocked 17+24 pair and HP recovery action. The live bait-default round trip was
also reviewed: selecting Aouo from floats opens four compatible bait cards,
then item detail and its explicit return retain bait, fish and area.
Publication remains separate from passing local checks. The selected-area food
advice still needs to foreground local stock; it is recorded as follow-up work.

### Food choices in the selected area

A mobile review of the Area 2 food page found its advice led with Area 5 bento
and linked rods and foods from every area. The selected-area advice now starts
with actionable local food choices, each showing its measured HP recovery and
price. Area 1 offers 01/02; Area 2 offers 02/03; Area 3 offers 02/04; Area 4
offers 02/05; Areas 5 and 6 offer 03/06. Choices derive from regular shop stock
and confirmed item effects. Advice says to use suitable owned food first and
match servings to missing HP to avoid wasted recovery. No universal winner is
claimed. The canonical unselected-area advice, food records and technical
proof remain available, including the milk-for-canoe caution.

The first mobile draft still buried choices below a paragraph; a second visual
pass moved food images, names, HP and prices directly below the title and
removed their duplicate paragraph listing. Independent verification captured
a missing-choice baseline before wiring, then checked all six areas in three
languages, detail links, return context and canonical invalid/no-area fallback.
Actual TH 390px clicks followed Area 2 Dango to its detail and recorded seller,
then back twice to the same local choices. EN 1200px and JA 390px views retain
the selected area and show no horizontal overflow.

The previous area-lure release (1837a83) passed GitHub quality and deployment.
A current public TH Area 2 fish-to-lure-24 click verified pair 17+24 / ¥55 and
its 38-profile kit context on item detail. New food publication remains a
separate release step; this work does not establish whole-site completion.

## Fish profile to the exact manual checklist row (r64)

An eligible fish profile now links directly to that species in the existing
66-species web checklist. Players arriving from equipment or a map pin no
longer have to reopen a route group and find the fish again. The selected
fishing area stays in the URL; the first-occurrence area only chooses which
collection group opens. The focused row has a visible outline, and its map,
equipment and profile actions keep the current selected area.

These remain manual website marks, separate from the game's notebook. Opening
a link never marks a species or reads a game save. A focused, already-marked
species is revealed on entry; choosing the unmarked-only filter afterward
hides it normally. All 66 unique rows remain, while excluded or unknown
profiles have no completion action. Research and notebook evidence are intact.

Actual local TH 390px clicks verified profile 06 in Area 3 to its exact row in
the Area 1 route group, checking and reloading, language changes to EN/JA,
filtering marked fish, returning to the original profile, and explicitly
changing area to Area 2. EN 1200px and JA mobile views have no horizontal
overflow. The temporary mark was removed through the UI, restoring 1/66.
The first visual check found CSS :target did not identify dynamically rendered
rows; an explicit focus marker fixed the missing outline. A separate desktop
review found that scrolling hid both area headings. The focused card now
states its deduplication group and the selected fishing area directly, avoiding
confusion when a fish from Area 3 is filed once under Area 1.

The prior food release ef3c537 passed quality and deployment (run 37375367564).
A public Area 2 food view now shows onigiri 10 HP / ¥10 and dango 15 HP / ¥15
before explanatory prose. This bounded handoff is not whole-site completion.

Verification: the full `npm run check` passes after independent guard fixes
for new article attributes and the newly required localized map-path mock.
The handoff guard checks 66 eligible profiles in EN/JA/TH, excluded/unknown
profiles, exact unique cards, selected-area actions, nested returns and manual
progress behavior. No gate was bypassed to publish this repair.

## Individual food availability and shop advice (r65)

Regular food cards and details now distinguish owning an item from buying it
in the selected area. The recorded six-area stock matrix drives the advice:
food that is not sold locally keeps its measured recovery and links to local
food choices, with the original item route preserved for returning. Available
food shows local price and recovery before disclosures. Special foods, quests,
poison warnings and canonical no-area advice remain unchanged.

Shop target-fish guidance now follows the chosen category. Compatibility
instructions apply to bait, lure and fly bodies; rods explain comparison,
food explains missing HP, and tools explain actions and quest uses. Wing/tail
results remain complete fly bundles whose bodies can have compatibility badges.

The full npm run check passed. Independent guards cover six regular foods
across six areas and three languages, clean local-choice destinations, exact
returns and special-food fallbacks. Actual TH390 orange Area2 detail -> local
choices -> onigiri detail -> return succeeded; JA390 and EN1200 food views
show correct availability with no horizontal overflow. Actual shop food ->
bait -> rod -> Japanese kept fish06/Area2 and showed category-specific advice.

A wider browser audit exercised maps/fish routes in all six areas with
representative three-language desktop/mobile journeys, manual marks/reload/
filter/restoration and profile-to-bait navigation. Another 48 equipment
category/detail/return journeys passed. These are representative runtime
checks, not every possible click or every one of the 315 items.

Research data and evidence were preserved. Whole-site usefulness remains
unproven; the next confirmed issue is repeated notebook explanation and
stacked headings before its actions.

## Notebook explanation consolidation (r66)

The notebook entry has one checklist heading and one manual count/filter.
Current-area new/repeated species share a compact line; the available total
still explicitly differs from a required game-page total. The route opens
directly into its area groups. The explanation of first-area filing moved
into existing folded help alongside largest-record movement rules, Tool05
verification steps, the tool link and area totals. Research remains folded
and all 66 unique species/action rows remain unchanged.

Actual TH390 Area4 checks verified 22 available =17 route additions+5 earlier,
manual0->1, reload1, remaining filter hides Koi0D, then restored0. Tool05
detail/return and language change retained Area4. JA320 and EN1200 have no
horizontal overflow. Independent guards reject duplicate manual headings,
reintroduced route-intro paragraphs and split count wrappers while retaining
existing species, state, focus and navigation checks. Full npm run check passes.

The previous r65 release f3eb1e1 passed quality and deploy (37380425257).
Actual public TH food01Area2 and target-fish shop food guidance were verified.
This copy refinement is not a whole-site completion claim. Acquisition of
Tool05 is still an evidence gap; no purchase path is inferred from its price.
