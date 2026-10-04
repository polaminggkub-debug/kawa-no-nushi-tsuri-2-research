import { setupSearch } from './setup-search.js'
import { loadFishAliases } from './load-fish-aliases.js'
import { setupTopicNavigation } from './topic-navigation.js'
export function initialize(ctx) {
  setupSearch(ctx)
  setupTopicNavigation()
  loadFishAliases(ctx)
}
