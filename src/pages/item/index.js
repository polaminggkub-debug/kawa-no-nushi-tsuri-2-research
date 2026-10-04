export * from './navigation.js'
export * from './names.js'
export * from './links.js'
export * from './purchases.js'
export * from './usage.js'
export * from './locations.js'
export * from './actions.js'
export * from './render.js'

import { loadCatalogue } from './load-catalogue.js'
import { setupContext } from './setup-context.js'

export function initialize(ctx) {
  setupContext(ctx)
  loadCatalogue(ctx)
}
