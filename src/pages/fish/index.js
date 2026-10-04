export * from './navigation.js'
export * from './tackle.js'
export * from './lure-kit.js'
export * from './fly-backup.js'
export * from './fishing-setup.js'
export * from './maps.js'
export * from './evidence.js'
export * from './shopping.js'
export * from './water-icons.js'
export * from './render.js'

import { loadCopy } from './load-copy.js'
import { loadProfile } from './load-profile.js'
import { setupLocale } from './setup-locale.js'

export function initialize(ctx) {
  setupLocale(ctx)
  loadCopy(ctx)
  loadProfile(ctx)
}
