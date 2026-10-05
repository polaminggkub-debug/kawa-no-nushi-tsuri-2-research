import { fishIds, stats } from './shared.mjs'

await import('./data-guards.mjs')
await import('./target-advice.mjs')
await import('./fly-maker-steps.mjs')
await import('./selected-fish-labels.mjs')
await import('./food-decisions.mjs')
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

await import('./catalogue-loading.mjs')
await import('./float-price-links.mjs')

await import('./cheaper-price-links.mjs')
await import('./bait-lure-verdict.mjs')
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
await import('./fly-wing-acquisition.mjs')
await import('./area6-shop-actions.mjs')
await import('./hook-target-links.mjs')
await import('./map-focus-action.mjs')
