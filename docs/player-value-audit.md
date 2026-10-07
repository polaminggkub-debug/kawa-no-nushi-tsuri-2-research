# Player-value audit of the ROM equipment catalogue

Reviewed 2026-10-04 after the owner asked whether the decoded information actually helps someone play. Evidence comes from the owner-supplied original Japanese ROM, its code/text/data/graphics, and controlled execution of that ROM. No external guide supplies the gameplay claims below.

The follow-up [player decision layer](player-decisions.md) turns those findings into buying, carrying and preparation choices. Rod ordinals and fish-specific response labels are folded into technical evidence; unproven response species are no longer pictured as recommended targets. Fly suggestions use the cheapest stocked bundle with a qualifying body in the selected fishing area, with the hidden body/wing condition stated separately.

The catalogue has 315 records. The audit question is: **what decision or action can a player make from this card?** A price, selector, response formula or hexadecimal ID alone does not answer that question. Addresses and formulas belong in expandable evidence; the visible explanation must connect them to an action or an outcome.

## Questions and answers

| Player question | Answer now supported | Primary trace |
| --- | --- | --- |
| Where can I buy this item? | All six area stocks are decoded: 258 distinct item records, 400 purchase offers across area/shop slots including four special-rod offers. The data expands these into 473 item-record references because fly bundles contain multiple parts. Cards show purchase areas; fly-part locations identify parts in sold ready-made bundles rather than separate part purchases. | [Shop stocks](shop-stock-research.md) |
| What can I buy for lure coverage from area 1? | Spoon `2E` + Soft worm `23`, ¥55, covers the mask compatibility of all 38 lure-compatible profiles. Sinking `17` is ¥20 in areas 2–5; the ¥50 pair `17 + 23` can be bought together in area 4. This is not a landing-success ranking. | [Coverage](../data/lure-coverage.json), [shop stocks](shop-stock-research.md) |
| Why is live Ayu missing from the shop? | Sell at least one Ayu first. Each purchase fills the bait stack to nine and subtracts nine from the sold-Ayu counter, floored at zero; another sale may be needed. | [Shop stocks](shop-stock-research.md) |
| Which rod gives me more time to aim? | The larger aim cutoff gives longer to move the target tile before the cast checks it. Compare within a fishing style at the same HP. The rod page links the maximum aim-time choices rather than asking the player to infer a winner from raw bytes. | [Rod consumers](rod-response-research.md), [practical rod/lure trace](rod-lure-practical-research.md) |
| What does the rod's other “range” number change? | A higher fish-position boundary allows the fish farther out before the traced equipment-loss escape condition can trigger. This is not a cast distance in metres or a universal power rating. Other escape branches remain. | [Practical rod/lure trace](rod-lure-practical-research.md) |
| Is a hook named for my fish always better? | No: the matched-hook branch changes opening fight timing and can advance or delay the later equipment-loss check. It does not expand bait compatibility. Choose the bait/rig for the target first; the hook name or price is not a catch-rate ranking. | [Hook/float/sinker trace](hook-practical-research.md) |
| Does changing a fly part matter? | Wet bodies pass a broader fish-profile mask than dry/terrestrial bodies. The selected body and wing also face hidden conditions; casting again does not reroll those conditions, while overnight rest can update them. Ready-made shop flies are body/wing/tail bundles with a full bundle quote, separate from the custom maker. A tail is not established as a catch bonus. | [Fly parts](fly-practical-research.md), [shop bundles](shop-stock-research.md) |
| How do I choose bait or a lure for a specific fish? | Choose the fish filter, then use the matching rig route. The cards show fish profiles passing the named bait/lure check and link their configured spawn points on actual terrain. Float and sinker routes are distinct. | [Acceptance](fish-acceptance-research.md), [locations](fish-location-research.md) |
| Where exactly can I look for bait with the magnifying glass? | The card now shows five verified dry-land search tiles (areas 3, 5 and 6); stand on land, because the glass does not work in water. Bait pictures mark the tile; two pictures mean alternative outcomes. Move before searching the same tile again. | [Forage locations](forage-location-research.md) |
| What does the gold net collect? | In shallow water: area 1 river insects, 2 caddisfly larvae, 3 salmon roe, 4 shellfish meat, 5 bloodworms, 6 sea worms. Each eligible new tile yields 1–4 (not always 3), capped at nine of that bait; it works only while wading. | [Tool handlers](general-tool-actions-research.md) |
| How should I buy food? | Six shop foods all cost ¥1 per nominal HP. Buy an amount near missing HP to reduce recovery lost to the maximum-HP clamp. At full HP the food menu refuses to eat and retains the item. "Full HP" is the player's own maximum, which starts at 100 and grows to about 190 (corrected 2026-10-07). | [Food consumers](food-practical-research.md) |
| What happens if I eat a fish? | It eats the first keepnet fish, not any fish the player chooses. Ordinary fish recover from stored size; Kusafugu is an exception that sets HP to zero (a blackout: the player wakes at the saved position with 1 HP and keeps everything). The menu skips the first giant eel, so it cannot be eaten by accident (corrected 2026-10-07; an earlier version said it was unprotected). | [Food consumers](food-practical-research.md) |
| Is the canoe different from the tub? | In the traced branch with zero current contribution, the canoe schedules 14 position updates to the tub's 10 per cycle: 40% more movement. Current-sensitive branches differ, so it is not a global 40% trip-time claim. | [Boat movement](boat-movement-research.md) |
| What do tools and quest items actually do, and where? | All 23 tool records have traced actions, inventory/event outcomes and conditions. Event-item maps show NPC or activation positions with actual item images. Milk can refill at the area-3 cow and be traded for a canoe; each successful opening of a mapped locked chest uses up one key (corrected 2026-10-07; an earlier version said the key was retained). | [General tools](general-tool-research.md), [quests](quest-tool-use-research.md) |

## What a compatibility picture means

A pictured fish passes the particular check documented for that card. It is not a measured bite percentage, a claim that any location works, or a guarantee of landing the fish. The fish-location panel shows configured species/X/Y spawn slots; some slots can be inactive under further game conditions. The website preserves that scope rather than turning a mask into a catch-rate claim.

## Research still needed for a universal equipment recommendation

A “carry this and finish everything” claim requires the downstream fight outcomes, target-fish/size behavior, location/activity conditions and matched outcome comparisons together. The new purchase guide and effect descriptions answer narrower practical choices now. They do not justify inventing an overall catch-success ranking. Hidden fly-selection conditions and equipment-specific fight branches are documented separately instead of being presented as player-readable stats.

## Target-fish browsing

The fish picker accepts typed Thai, English/Latin, Japanese names and profile IDs, with sprite suggestions and keyboard selection. Selecting a target switches browsing to confirmed bait/lure/fly-body/float-sinker compatibility and that fish's map. Generic shopping, food/HP, hooks and quest items are excluded from the target view; clear the fish to return to general categories. Wings/tails appear only as parts of sold bundles with qualifying bodies, not as independently fish-compatible gear.

## Continued usefulness audit

The [active full-site usefulness audit](player-usefulness-audit.md) records completed area-specific fish shopping choices, tool-location maps, individual advice for all 21 rods, hook/float facts, and chum movement labels, together with the remaining audit. Its dated sections retain historical findings; the latest section states current coverage and unresolved full-goal requirements.
