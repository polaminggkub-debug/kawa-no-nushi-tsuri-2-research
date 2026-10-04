# Redesign quality checks

The redesign keeps the equipment catalogue, item pages, maps, fish pages, shops, and research evidence connected while keeping the public site static. Source checks and browser checks answer different questions; a passing source check does not establish layout quality or owner acceptance.

## Run the aggregate check

Run from `publication/` after installing the pinned dependencies:

```sh
npm ci
npm run check
```

The aggregate command checks formatting, active application and QA source rules, publication safety, exact generated-file equality, entity links, shop data, map controls, and research search. Source rules include the pinned formatter, a 500-line file limit, a 50-line function limit, import-layer/public-API checks, runtime-cycle checks, and typed checks for dropped Promises. These rules cover `src/`, the quality and entity-check modules, the frontend build tool, and the active QA wrappers listed in the package scripts; historical ROM-extraction utilities are not part of this frontend-source budget.

`check:generated` renders bundles and page templates in memory and compares them with the checked-in public files; it does not rewrite the files. The separate `npm run build:frontend` command writes those generated files when an intentional source change needs a rebuild. Run the aggregate check after that rebuild.

GitHub Actions runs the same aggregate command for pushes and pull requests. A push to `main` can publish only after that job passes: the workflow stages the allowlisted public site files, uploads the Pages artifact, then runs the dependent deploy job. Pull requests run checks without publishing. A pass covers the automated source and rendered-markup checks listed here. It does not establish visual layout quality, keyboard usability, mobile behavior, or acceptance by the site owner.

## Entity and navigation checks

Run from `publication/`:

```sh
node scripts/check_entity_links.cjs
```

This guard renders each item and fish detail in English, Thai, and Japanese, validates local links and IDs, and checks that the authored advice remains connected to its recorded data. Its forage cases use fish recorded for the selected bait and rig rather than reusing one arbitrary target. It specifically checks Worm `01` + Iwana `01`: the sinker setup is rejected, has no bait-specific forage action, and links to the float setup while keeping the bait, fish, area, and return destination.

Every magnifying-glass marker on an item page and in the catalogue must lead back to the localized magnifying-glass detail at the exact area/context anchor. The checker also verifies that a forage suggestion keeps the bait, selected fish, rig, area, and return context. Existing shop, fish, item, map, and language-switch checks remain in place.

The map combobox check runs the compiled map bundle with a small DOM harness. It exercises typing without changing the map, keyboard selection, jumping to a confirmed area, the empty-result and clear states, zoom retention, and localized nested returns. The 72 mapped fish profiles must remain searchable; the unconfirmed profile `43` must not be offered as a map target.

## Evidence and compact cards

Player advice may be concise in catalogue cards. The original ROM values, source links, byte records, and interpretation limits remain available in each item's named evidence disclosure or detail page. The quality checks must keep both layers: a useful visible decision and the corresponding full evidence. They must not move unsupported claims into the visible summary or discard the detailed source material to make a card shorter.

The shipped English, Thai, and Japanese catalogue pages prerender the default rod view; those 21 cards are checked in the saved HTML. Runtime card checks render all 315 items in each language, including the compact verdict and the full recommendation and reason inside its collapsed disclosure. Item details retain the full ROM evidence. These checks complement one another and do not replace checking the shipped HTML. Actual keyboard, mobile-layout, filtering, and click-through checks belong in the browser review and must be recorded separately.

## Limits

- Acceptance lists prove that the ROM's compatibility condition is met; they do not establish bite rates or landing success.
- Example forage tiles do not guarantee one specific bait when a tile has multiple outcomes.
- A source-render or link check does not prove every control is useful, readable, or reachable in ordinary gameplay.
- Do not treat generated output, a passing build, or a passing link checker as a substitute for visual browser review.

## Browser review — 2026-10-04

Reviewed the built local site in the Codex browser at 1280 × 900 and 390 × 844. The review exercised catalogue fish autocomplete with ArrowDown/Enter, category browsing, the rod comparison disclosure, original map previews, map search/zoom, fish-marker links, fish area changes, English/Japanese/Thai language switches, starter-rig disclosures, item compatibility disclosures, shops category/name filters, and research-table search.

The negative Worm `01` + Iwana `01` + sinker route displayed a rejection and a float-switch action; switching retained the item, fish and area, then exposed the forage action. Its magnifier link opened the exact area/context anchor. The mushroom alternative opened oranges without carrying an irrelevant fish/rig filter and retained the mushroom page in the return route.

The review found and repaired missing runtime helper exports, duplicate area-selector IDs, an empty fish-location box, long embedded target maps, duplicate comparison reasons, uncollapsed starter/compatibility lists, and a narrow research table that wrapped Japanese names one character at a time. The final layout keeps long alternatives and evidence in named disclosures. Original sprites, maps and the title screen remain in use.

This was a representative interaction and visual review, not a claim that every combination of every control was manually clicked. Automated entity/render checks cover the complete recorded catalogue and all three locales; the browser review establishes the listed user paths separately.

### Follow-up checks

The food guard additionally renders every six-shop-food/area/language combination (108 cases), requires exact local stock alternatives, and checks the advice against measured recovery and recorded prices. The tub guard preserves both acquisition and the bounded boarding example, its direct profile anchor, three-language steps/limits, and gameplay-screenshot fingerprint. The original-ROM boarding probe was independently rerun; its static byte verifier has a separate, narrower scope.

The publication gate also checks the new bounded Python ROM verifiers: at most 500 physical lines per file and 50 per function, with adversarial over-limit probes. Historical analysis utilities remain outside this frontend/research-tool source budget.

Actual local browser follow-up: float 01 with target fish 06 opens that fish's accepted-bait section with Area 1 retained; bait 17 shows the Area 3 Ayu-sale condition beside its price; the tub detail shows house-exit walking directions and a linked ROM-map crop. Mobile 390×844 retained readable cards and navigation; viewport reset after review.
