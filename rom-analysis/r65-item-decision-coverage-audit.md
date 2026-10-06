# R65 item decision-coverage audit

Read-only source/data review of the current 315-item catalogue. No browser, emulator, external guide, production, or guard changes were used. Detailed new net and magnifier research is outside this audit.

## Coverage by player-action class

| Item class | Records | Current actionable layer | Audit result |
| --- | ---: | --- | --- |
| Rods | 21 | Per-item rod decisions; selected-area comparisons use only same-style rods with recorded shop offers. | No contradiction found in the inspected stage/stock decision path. |
| Bait + lures | 104 | Per-item decisions; bait cards use the selected float/sinker route; target checks and cheaper-offer guidance use the selected fish and area. | One conditional offer, live Ayu bait `17` in Area 3, is explicitly labelled as requiring an Ayu sale. |
| Hooks + floats/sinkers | 23 | Per-item gear decisions; target-specific checks and a separate area/route price guide. | No contradiction found in the inspected selection and stock paths. |
| Fly bodies, wings, tails | 134 | Per-item gear decisions; body checks are scoped as candidates, purchases quote complete bundles, and selected-fish guidance links to alternatives. | Four path-limited wing IDs (`25`, `26`, `66`, `67`) are not presented as proven custom-menu choices; the UI labels the evidence limit and offers another route. |
| Food | 10 | Localized use summaries; HP advice; area-specific normal-food options in the category decision. | Confirmed mismatch between the area-specific decision and an individual card; see below. |
| General tools | 23 | Localized use summaries and item-specific quest, location, exchange, or toggle actions where recorded. | No broad contradiction found. ID `05` acquisition remains unconfirmed; see limits. |

All 315 item records have an English, Japanese, and Thai `playerUse.summary`. The explicit per-item decision fields cover 282 records: 21 `rodDecision`, 104 `baitLureDecision`, and 157 `gearDecision`. The remaining 33 food/tool records use direct-action summaries rather than equipment rankings. This count is coverage, not proof that every sentence is useful in every context.

Cross-checking every `playerUse.shops` offer against `data/shop-stock-rom.json` found no stage/item stock disagreements, including ready-made fly bundles. The only conditional offer is bait `17` in Area 3; its condition is shown in the catalogue and seller view. The website does not read the player's live inventory: advice to keep or use owned items is conditional wording, not ownership detection.

## Confirmed gaps

### Food cards can invite a purchase where the selected area has no stock

In Area 2, the shared food decision correctly offers only rice ball `02` (10 HP / ¥10) and dango `03` (15 HP / ¥15). Food `01` orange is recorded only in Area 1 (5 HP / ¥5). Yet each item card renders the static `playerUse.summary`; the Orange card still says “Missing about 5 HP and need to buy food?” and shows no Area 2 unavailability cue. Its seller areas are inside a collapsed acquisition disclosure. A player may read the visible “buy” advice as a local option even though the area-specific overview says otherwise.

The local recommendation is already data-driven and correct (`food-area-guidance.js` filters for unconditional sales in the selected area). The gap is the per-item card, which goes through `visibleUse()` / `renderCardGuidance()` without that area context. In a selected area where the food is absent, label it as usable only if already owned and point to the stocked local choices; do not change the HP or price findings.

### Item seller CTA adds an avoidable map step

The purchase-card button `ดูร้านที่ขายของนี้` retains item, stage, and return context, but `stageButton()` links to the filtered shop page without `#location-section`. The shop map is inside a closed disclosure. The page then offers a separate seller button that opens the map. Rod `04`, Area 1, is a concrete example: the ¥500 offer is recorded, the normal seller is mapped at town tile `(7,24)`, and the paired Area 1 entrance is mapped at field `(12,182)` → town arrival `(7,29)`. This is a navigation gap, not missing stock or coordinates; appending the existing `#location-section` destination would use the shop page's existing open-and-scroll behavior. See also the bounded source/data trace in `r64-shop-next-audit.md`.

## Important limits and unresolved routes

- General tool `05` (Fishing Notebook) has a confirmed use action but no shop offer, `useLocations`, or `acquisitionOptions` in the current item data. This audit did not establish whether it is part of starting inventory or is granted through story progression; do not infer an acquisition route from its ROM base price.
- Wing IDs `25`, `66`, and `67` have no recorded shop bundle or captured menu position in current data. Their item advice explicitly says this is an evidence gap, not proof of universal unavailability, and points to documented alternatives. No stronger claim is justified here.
- The audit did not manually render all 315 details at every locale/area or replay purchases in-game. Rod, bait/lure, hook/float, and fly conclusions above describe the source/data decision logic; they do not establish bite odds, catch outcomes, inventory ownership, or reachability in every story state.

## Current source touchpoints

- Catalogue cards and acquisition disclosures: `src/pages/equipment/item-card.js`, `src/pages/equipment/item-use.js`.
- Area-specific food recommendation: `src/pages/equipment/food-area-guidance.js`, `src/pages/equipment/player-guidance.js`.
- Bait/lure fish, route, area, and stock advice: `src/pages/equipment/bait-lure-verdict.js`.
- Rod area decisions: `src/entities/item/rod-area-decision.js`.
- Limited fly-wing routes and caveats: `src/entities/item/fly-wing-decision.js`.
- Item purchase cards: `src/pages/item/links.js`, `src/pages/item/purchases.js`.
- Shop map opening and seller selection: `src/pages/shops/shop-page.js`, `src/pages/shops/target-actions.js`.
- ROM-backed definitions: `catalogue/gallery-data.json`, `data/shop-stock-rom.json`, `data/shop-locations-rom.json`.
