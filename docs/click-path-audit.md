# Catalogue navigation audit

Updated 2026-10-04. Gameplay statements retain their existing ROM evidence. This change connects the existing findings; it does not establish new fish catch rates or equipment bonuses.

## Where a click goes

| Visible element | Action / destination |
| --- | --- |
| Catalogue item portrait or name | Dedicated item profile, carrying target fish and area |
| Item in a recommendation or rod comparison | Dedicated item profile |
| Fish portrait in catalogue compatibility or location panel | Dedicated fish profile |
| Fish portrait or Details link in map species list | Dedicated fish profile |
| Map species name / “Focus on map” button | Filter map pins to that fish |
| Single-species map pin | Dedicated fish profile |
| Shared map pin | Species chooser with separate profile and map-focus actions |
| Fish profile area action | Area map filtered to that fish |
| Fish profile bait, lure or fly-body portrait/name | Dedicated item profile |
| Fish profile float/sinker route action | Item profile, focused on the corresponding rig section |
| Item profile compatible fish portrait/name | Dedicated fish profile |
| Item profile explicit fish-map action | Filtered map of a confirmed area |
| Item profile shop-area action | Dedicated shop page focused on that item and area, with separate outdoor entrances and town sellers |
| Shop stock portrait or name | Dedicated item profile, with shop state retained on Back |
| Three-fly backup purchase action | Corresponding area shop, with fish profile retained on Back |
| Town chest reward / required key | Corresponding item profile |
| Town chest entrance disclosure | Outdoor entrance crop; original full terrain opens from its image action |
| Shop map crop | Authentic full map image |
| Ready-made fly components | Individual body/wing/tail profiles |
| Research equipment portraits/names and fish table names | Item/fish profiles |
| Title screen, source frames and custom-maker captures | Original full image |
| Technical evidence summary | Expand evidence in place |
| Back action | Source route with catalogue search/filter or map section preserved |
| Language action | Same item/fish identity and navigation context in another language |

Terrain backgrounds and decorative category art are not given unrelated destinations. Category controls, map overview section controls and zoom controls keep their existing functions. Unknown fish profile 43 has no confirmed map-location action.

## Automated source checks

Run from the repository root:

```sh
node scripts/build_catalogue.cjs
python3 scripts/build_equipment_guide.py
node scripts/check_entity_links.cjs
```

Result: **PASS — 1,524 localized detail renders and 208,737 local link/asset checks**. These counts include repeated references, not distinct pages or manual clicks.

Coverage:

- All 315 items and 73 fish profiles in Thai, English and Japanese.
- All 315 catalogue portraits/names through the all-items renderer in each language.
- Local destination files, image assets, item category/ID pairs and fish profile IDs.
- Repository evidence paths referenced by GitHub links.
- Invalid/missing entity recovery and profile 43 without invented spawn points.
- Bait float/sinker route focus.
- Return routes under both a root deployment and the GitHub Pages project prefix.
- External/invalid return parameters rejected; research return retained.
- Raw evidence remains in closed disclosure sections.

This script renders source with a minimal document mock. It does **not** replace browser interaction or visual inspection.

## Browser checks

Actual local browser clicks passed:

- Catalogue lure portrait → item profile → Back: search `2E` retained and one matching item shown.
- Fish 06 → area map → Back: fish identity and area retained.
- Fish 06 → compatible Spoon 2E → target-fish map.
- Single fish map pin → fish profile → Back: same area, map section and target retained.
- Shared area-1 point (4,56) → chooser → Kawamasu 09 profile.
- Map species “Focus on map” → only that species displayed; zoom remains functional.
- Research Soft Worm 23 → item profile → Japanese → Back: Japanese research page.
- Fly body 01 → wing 09 → Back: original body profile.
- Desktop fish/item/map layouts inspected; item/fly layout at 390px inspected with no horizontal page overflow.

Catalogue search and filter controls stay disabled until their data and event handlers are ready, preventing early input from being overwritten during initialization.

Individual references were checked exhaustively by the source checker. Browser clicks exercise representative navigation paths; they do not claim a separate manual click of every repeated link.

## Additional shop, town and per-rod paths

Local browser checks: special rod 0D → area-4 seller → paired outdoor entrance #5 → town → matching special stock → rod profile → shop return; EN/JA switching retains stage/place/entrance; 390px shop crops fit the page. Fish 01's fly-backup purchase opens the matching bundle shop and returns to the fish profile. Bottle/key/candle chest cards show acquisition maps, entrance disclosures, reward profiles and key requirements.

Rod 01 → alternative 04 → return to 01 works. All 21 cards render their own decision in Thai; the comparison disclosure includes a recommendation column and suppresses purchase quotes for four rods without recorded stock. Mobile rod advice and alternative portrait links wrap at 390px without horizontal page overflow. Automated rendering additionally covers every rod in all three locales.

## Gear and acquisition follow-up

Added individual decisions for 157 gear records, fish starter/backup deep links, a linked six-area float/sinker price table, six chest acquisition routes, and map autocomplete. Current source render: 1,524 localized detail renders / 209,808 local references. Browser checks are separately recorded in `player-usefulness-audit.md`; this count does not assert all references were clicked by a human/browser.

## Acquisition and practical-choice follow-up

Current source render: 1,524 localized detail renders / 209,937 local references. Added six front-facing chest choices, net-to-bait and bait-to-net links, mushroom-to-orange alternatives, refillable-milk advice, and key/ticket overview links. Local browser clicks verified bait 09 -> gold net 04 with area 3 and return context retained; canoe 02 visibly offers the milk exchange route and no shop purchase. Source-render counts are not manual click counts.
