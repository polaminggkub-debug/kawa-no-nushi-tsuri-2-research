// Every save carries a hidden pair of numbers, one for the fly body and one for the fly wing.
// A fly whose body id (or wing id) leaves the same remainder when divided by 4 never bites.
// A save that has never rested at an inn holds the pair (1, 2); the inn can re-roll it.
export const FRESH_SAVE_LOCK = Object.freeze({ body: 1, wing: 2 })

export function flyGroup(id) {
  return Number.parseInt(id, 16) % 4
}

export function flyLockedAt(bundle, lock = FRESH_SAVE_LOCK) {
  return flyGroup(bundle.body) === lock.body || flyGroup(bundle.wing || '00') === lock.wing
}

export function flyWorksOnFreshSave(bundle) {
  return !flyLockedAt(bundle)
}

// The cheapest ready-made offers that a fresh save can use; falls back to every offer when none can.
export function freshSaveOffers(offers, bundleOf = (offer) => offer) {
  const usable = offers.filter((offer) => flyWorksOnFreshSave(bundleOf(offer)))
  return usable.length ? usable : offers
}

// The widest-list body with the cheapest ready-made set a fresh save can use (the generic starting point).
export function freshStarterBody(items) {
  const bodies = items.filter((item) => item.category === 'fly')
  const widest = Math.max(0, ...bodies.map((item) => item.playerUse?.fishIds?.length || 0))
  const offers = bodies
    .filter((item) => (item.playerUse?.fishIds?.length || 0) === widest)
    .flatMap((item) =>
      (item.playerUse?.shops || []).filter((shop) => shop.bundle).map((shop) => ({ item, shop })),
    )
    .filter((offer) => flyWorksOnFreshSave(offer.shop.bundle))
    .sort((a, b) => a.shop.bundle.shopPriceYen - b.shop.bundle.shopPriceYen)
  return offers[0]?.item || null
}
