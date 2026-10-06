// Turns ids into the numeric inputs the original fight loop reads from work RAM.

/** Fishing method ($0C14): 0 float/bait, 1 casting, 2 lure, 3 fly. Chosen from the rod's style code. */
export const METHOD_BY_ROD_STYLE = { 1: 0, 2: 1, 4: 2, 8: 3 }

/** Defaults describe the natural Area 1 Yamame encounter used for validation. */
export const DEFAULT_ENVIRONMENT = {
  castDistance: 900, // $1F77, raw cast reach before bucketing
  sceneType: 5, // $0850, underwater scene variant (0..13)
  waterDepth: 1, // $1324, 1..3
  vehicle: 1, // $0858, values >= 3 widen the step mask
  lureAction: 0, // $1226, stale lure-record field read by the float rest path (lure style: the lure's own)
  lureDepth: 0, // $1F9D, how deep the lure was when the fish struck (lure style)
  moveMode: 0, // $1EBB left over from before the fight (lure style, first frame only)
}

function lookup(tables, kind, id) {
  const row = tables[kind]?.find((entry) => entry.id === id)
  if (!row) throw new RangeError(`Unknown ${kind} id ${id}`)
  return row
}

/** Resolve ids to the numeric records used by the fight loop. */
export function resolveRecords(tables, ids) {
  const rod = lookup(tables, 'rod', ids.rodId)
  const method = METHOD_BY_ROD_STYLE[rod.style]
  if (method === undefined) throw new RangeError(`Rod ${ids.rodId} has an unknown style code`)
  const fish = lookup(tables, 'fish', ids.fishId)
  if (method === 2) return { method, rod, fish, lure: lookup(tables, 'lure', ids.lureId) }
  if (method === 3) return { method, rod, fish, fly: lookup(tables, 'fly', ids.flyId) }
  return {
    method,
    rod,
    fish,
    hook: lookup(tables, 'hook', ids.hookId),
    bait: ids.baitId ? lookup(tables, 'bait', ids.baitId) : { fishMatch: 0 },
  }
}

export function resolveEnvironment(fish, options = {}) {
  const env = { ...DEFAULT_ENVIRONMENT, ...options.environment }
  const size = options.size ?? fish.sizeLow
  if (!Number.isInteger(size) || size < 1 || size > 255) throw new RangeError('size must be 1..255')
  const scene = env.sceneType
  if (!Number.isInteger(scene) || scene < 0 || scene > 13) throw new RangeError('sceneType 0..13')
  return { ...env, size }
}
