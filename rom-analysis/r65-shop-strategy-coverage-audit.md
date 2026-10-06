# R65 Shops and strategy coverage audit

**Scope:** read-only inspection of authored shop and research/strategy sources at publication HEAD `391170f` on 2026-10-06. No browser inspection or production/test edits were made. The three locale templates and six-area source branches were reviewed. This is a source audit, not proof that every rendered interaction works.

## Ranked finding

### P2 — Fish-check warning remains visible for shop categories with no fish-check badges

`src/pages/shops/player-decision.js:14-38` renders the fish-context panel and its generic “check the marks before buying” explanation whenever a valid fish is selected. The text is localized in EN/JA/TH. But `shopCompatibility` returns no state for categories other than bait, lure, and fly (`player-decision.js:1-12`), so `shopCompatibilityBadge` emits nothing for rods, food, tools, hooks, and floats/sinkers (`player-decision.js:41-48`). `renderOffers` inserts the fish-context panel independently of the selected category (`shop-catalogue.js:373-378`).

Concrete route: open Shops with a fish selected, then choose **Food** (or Rods/Tools) in the category filter. The selected fish/profile panel remains, while its instruction tells the player to check marks that the result cards do not have. The filter handler keeps the fish context when changing category (`shop-page.js:114-121`). This is a copy/scope mismatch, not a missing ROM fact.

**Acceptance branch:** for each locale, render a valid selected fish with categories `bait`, `lure`, `fly`, `all`, then `food`, `rod`, `general_tool`, `hook`, and `float_weight`. Keep the fish profile/return action in all cases. Show the check-specific explanation only where relevant compatibility badges exist, or replace it for unrelated categories with a statement that those offers do not use the fish check. The current bait/sinker route note should remain limited to bait/all.

## Coverage that appears coherent in source

- **Shop discovery and search:** `src/pages/shops/ui/shops{,.th,.ja}.html` expose the same six areas, seller-vs-field view, ten item categories, name/hex-ID search, clear filters, stock results, and a folded evidence explanation. `shop-catalogue.js:302-326` searches normalized tokens across multilingual item names/IDs/aliases; `renderOffers` separates regular, special-rod, and complete-fly-bundle stock and provides a zero-result state.
- **Fish-to-shop actions:** when a fish is selected without an explicit category, `shop-page.js:54-66` defaults to bait for float/sinker, lures for lure, and fly for fly. Explicit category/search intent is preserved. Each offer opens item details; target-item actions distinguish local stock from recorded sale areas and link to seller/offer sections (`shop-catalogue.js:329-365`, `src/pages/shops/target-actions.js:25-54`). The special Ayu bait purchase condition is visible only on the Area 3 stock branch.
- **Seller acquisition path:** stock, item identity, area, and nested return are represented in the shop routes. Map positions are disclosed separately from sale records; coordinates outside valid bounds are hidden. Most seller copy explicitly separates entrance/arrival pairing from a verified in-town walk (`src/pages/shops/text_*.js`, `shop-catalogue.js:33-61,112-194`). The Area 6 regular-shop card includes a concrete route and links its evidence.
- **Strategy decisions:** all three strategy templates expose a lure kit, rod advice, and technical-evidence navigation. The localized `lure-kit-areas` rows cover Areas 1, 2–3, 4, and 5–6 with corresponding actions (`src/pages/strategy/ui/index{,.th,.ja}.tables.json`). They state 38-profile compatibility and deny a bite/catch guarantee. Area 5/6 correctly says no complete pair is stocked locally and points to carrying a full owned pair or buying 17+23 in Area 4. Six area-specific rod-advice links route to the catalogue, while raw fields and compatibility matrices remain under `#technical-evidence`.
- **Cross-locale checks to retain:** offer/card/search terms and the fish-context mismatch above should be checked in EN, JA, and TH. Keep the six stage values and the shared area-group rows stable across all locale tables; keep the 38-profile scope and no-catch-odds wording adjacent to the lure decision.

## Not a UX defect established by this audit

Area 6 is intentionally available as a selectable area and has a concrete shop walk. Its research file says the route was replayed from a debug fixture already loaded into Area 6; it does not prove the story unlock or new-game progression, and the replay did not buy stock (`docs/area6-shop-walking-research.md:17-21`). Preserve that limitation as research context. It does not invalidate the currently documented “once in Area 6, walk to the shop” instructions. Likewise, the map disclosure requiring an explicit click is not independently treated as a blocker here.

## Follow-up boundary

The P2 finding is the only concrete source-level player-facing contradiction found in this bounded Shops/Strategy review. Before calling the full UX goal complete, separately verify actual clicks and rendered behavior for the six-area stock/seller routes and all locale switches; this source-only review cannot certify those flows.
