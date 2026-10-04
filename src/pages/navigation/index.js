export { updateNavigation, openAnchor } from './context-links.js'
import { bindNavigation } from './bind-navigation.js'
export function initialize(ctx) {
  bindNavigation(ctx)
}
