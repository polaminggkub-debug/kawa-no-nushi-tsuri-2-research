# HP recovery decision-path audit

Read-only audit of ROM-derived food records, current source, and the generated Thai browser flow. No external game guide was used; no food or HP mechanics were changed.

## Confirmed useful path

- `data/shop-stock-rom.json` records area 2 stock as food IDs `02` and `03`; area 3 has `02` and `04`; area 5 and 6 have `03` and `06`. `catalogue/gallery-data.json` carries matching food seller stages and per-item summaries. Food `01`–`06` prices/recovery amounts are already stated in the player decision and item details.
- The category decision for `food_hp_choice` explains the HP 100 aim-window effect for Lure/Casting, the ¥1 per HP shop-food rule, which foods are stocked by area, and the wasted-over-max warning. Item detail pages expose seller links for the selected item.
- In the generated Thai page, fish `06` at area 3 with Lure selected now exposes a food action. Clicking it opens `index.th.html?category=food&stage=3#category-decisions`; its return link retains the fish profile, Lure route, selected area, nested map return, and `#starter-lure`. The relevant food decision is open at the destination.
- `scripts/entity-link-check/hp-recovery-action.mjs` now checks the catalogue tip and fish Lure/Sinker paths in EN/JA/TH, including the localized destination, selected stage, absence of fish/item/route filters at the food destination, and exact return context. Baseline was red before the visible action marker existed; the rebuilt focused guard passes.

## Next player-facing gap

The food recommendation is still shared across areas instead of foregrounding what the selected area stocks. On the generated Thai food page for area 2, it lists the standard foods under area 1 and area 2, but does not say up front that area 2 locally stocks IDs `02` and `03`. The records show `02` is sold in areas 1–4, while the copy mentions it only under area 1; orange `01` is not stocked in area 2. The category still shows all 10 food cards, and a player must open seller details to tell which ones are available in the current area.

This is a presentation/actionability gap, not a ROM stock mismatch or an HP-effect uncertainty. The next useful improvement is to show the selected area's available recovery choices and prices first, while keeping the all-area list for travel planning. Because the page cannot read current in-game HP, it should explain choosing or combining those local servings to cover the missing HP rather than pretend it knows the player's exact amount.

## Evidence and scope

- ROM shop stock: `data/shop-stock-rom.json` (`areas[*].items`); item recovery, prices, shop stages and guidance: `catalogue/gallery-data.json` (`items[*].playerUse`, `playerDecisions.sections[id=food_hp_choice]`).
- UI source: `src/pages/fish/shopping.js`, `src/pages/equipment/player-guidance.js`, and food item rendering/acquisition helpers under `src/pages/equipment/` and `src/pages/item/`.
- Browser evidence: local generated Thai pages at area 2 and area 3; area 3 fish-to-food click and nested return verified in Chrome. This does not establish acceptance in every live browser or prove anything beyond the cited ROM-derived records.
