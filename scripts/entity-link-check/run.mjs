import { fishIds, stats } from './shared.mjs'

await import('./data-guards.mjs')
await import('./target-advice.mjs')
await import('./fly-maker-steps.mjs')
await import('./selected-fish-labels.mjs')
await import('./food-decisions.mjs')
await import('./food-area-decision.mjs')
await import('./tub-boarding.mjs')
await import('./navigation.mjs')
await import('./navigation-flymaker-alias.mjs')
await import('./bait-routes.mjs')
await import('./forage.mjs')
await import('./item-shops.mjs')
await import('./item-details.mjs')
await import('./fish-navigation.mjs')
await import('./fish-guides.mjs')
await import('./catalogue.mjs')
await import('./catalogue-cards.mjs').then(({ runCatalogueCards }) => runCatalogueCards())

console.log(
  `PASS: ${stats.renders} localized detail renders; ${stats.links} local links/assets and IDs checked. All 315 items and ${fishIds.size} fish profiles covered. Browser click checks are separate.`,
)

await import('./selected-fly-advice.mjs')

await import('./map-catalogue-return.mjs')
await import('./map-equipment-route.mjs')

await import('./catalogue-loading.mjs')
await import('./float-price-links.mjs')

await import('./cheaper-price-links.mjs')
await import('./bait-lure-verdict.mjs')
await import('./equal-price-bait-choice.mjs')
await import('./bait-empty-route.mjs')

await import('./strategy-actions.mjs')

await import('./canoe-boarding.mjs')

await import('./fish-no-local-stock.mjs')

await import('./fish-map-sections.mjs')

await import('./water-icons.mjs')
await import('./water-map-key.mjs')
await import('./water-mark-filter.mjs')
await import('./notebook-guide.mjs')
await import('./notebook-item-action.mjs')
await import('./area6-walk.mjs')
await import('./quest-next-actions.mjs')

await import('./bottle-capacity.mjs')

await import('./water-sprite-assets.mjs')

await import('./notebook-actions.mjs')
await import('./notebook-full-route.mjs')

await import('./wing-palette.mjs')

await import('./fly-fallback-route.mjs')

await import('./map-anchor.mjs')

await import('./notebook-progress.mjs')

await import('./notebook-card-action.mjs')

await import('./map-marker-bounds.mjs')
await import('./map-fish-return.mjs')
await import('./fly-menu-position.mjs')
await import('./fly-other-menu-positions.mjs')
await import('./fly-even-menu-positions.mjs')
await import('./fly-maker-access.mjs')
await import('./fly-wing-acquisition.mjs')
await import('./area6-shop-actions.mjs')
await import('./hook-target-links.mjs')
await import('./map-focus-action.mjs')

await import('./shop-fish-decisions.mjs')
await import('./shop-food-recovery-labels.mjs')
await import('./canonical-category-decisions.mjs')
await import('./lure-coverage-guide.mjs')
await import('./map-notebook-exclusions.mjs')

await import('./gear-guide-context.mjs')
await import('./category-context.mjs')
await import('./fish-selection-context.mjs')
await import('./fish-equipment-default.mjs')

await import('./shop-target-actions.mjs')

await import('./town-paste-bait.mjs')
await import('./notebook-natural-evidence.mjs')
await import('./fish-rod-upgrades.mjs')
await import('./fish-stage-resolution.mjs')
await import('./fish-starter-totals.mjs')
await import('./item-browse-context.mjs')
await import('./strategy-target-action.mjs')
await import('./postcard-next-action.mjs')

await import('./fly-price-choice.mjs')
await import('./selected-shop-area.mjs')
await import('./selected-rod-area.mjs')
await import('./audio-mode-actions.mjs')
await import('./catalogue-map-navigation.mjs')
await import('./fish-picker-category-scope.mjs')

await import('./magnet-next-action.mjs')
await import('./fish-player-decision-copy.mjs')
await import('./fish-notebook-profile.mjs')
await import('./notebook-profile-handoff.mjs')
await import('./map-mobile-fish-layout.mjs')
await import('./food-lottery-decisions.mjs')
await import('./hp-recovery-action.mjs')
await import('./fight-controls.mjs')

await import('./food-area-availability.mjs')
await import('./shop-category-check-scope.mjs')

await import('./notebook-consolidation.mjs')

await import('./notebook-starting-inventory.mjs')

await import('./giant-eel-return-route.mjs')

await import('./fight-surface-progression.mjs')
await import('./fly-maker-recovery.mjs')

await import('./area-quests.mjs')

await import('./shared-layout-invariants.mjs')

await import('./strategy-lure-area-context.mjs')
await import('./shop-purchase-verdicts.mjs')

await import('./tofu-direct-fireworks.mjs')

await import('./milk-canoe-choice.mjs')

await import('./key-purchase-decision.mjs')
await import('./shop-availability-sort.mjs')
await import('./location-reference-area.mjs')
