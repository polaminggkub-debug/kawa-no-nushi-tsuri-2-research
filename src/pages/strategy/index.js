import { setupSearch } from './setup-search.js'
import { loadFishAliases } from './load-fish-aliases.js'
export function initialize(ctx) {
  setupSearch(ctx)
  loadFishAliases(ctx)
}
