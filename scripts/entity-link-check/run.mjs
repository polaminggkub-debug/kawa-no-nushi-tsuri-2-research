import { fishIds, stats } from './shared.mjs'

await import('./data-guards.mjs')
await import('./navigation.mjs')
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
