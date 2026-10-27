// Where each part is on sale, from data/shop-stock-rom.json (decoded from the ROM). A part counts as
// buyable in stage N when a shop of stage N or an earlier stage stocks it. `at` is [stage, shop]:
// the nearest stage that sells it (the player's own stage first), shop = 'shop' | 'special' | 'fly'.

const CATEGORY = { rod: 'rod', hook: 'hook', bait: 'bait', lure: 'lure' }
const hex = (id) => id.toString(16).toUpperCase().padStart(2, '0')
const SHOP = { special_rod_shop: 'special', fly_bundle: 'fly' }

/** The row to point the player at: latest stage first, a regular shop before a special one. */
function nearest(rows) {
  return [...rows].sort((a, b) => b.stage - a.stage || (a.shop ? 1 : 0) - (b.shop ? 1 : 0))[0]
}

/** A fresh save's hidden fly lock: bodies with id % 4 == 1 and wings with id % 4 == 2 never bite. */
const isDeadFly = (body, bundle) => body % 4 === 1 || parseInt(bundle.wing, 16) % 4 === 2

const at = (row) => [row.stage, SHOP[row.shop] ?? 'shop']

/** price(slot, id) -> { yen, at } or null, for the shops of `stage` and earlier. */
export function priceIn(stock, effects, stage) {
  return (slot, id) => {
    if (slot === 'fly') {
      const rows = (stock.items[`fly:${hex(id)}`] ?? []).filter(
        (row) => row.stage <= stage && !isDeadFly(id, row.bundle),
      )
      if (!rows.length) return null
      const yen = Math.min(...rows.map((row) => row.bundle.shopPriceYen))
      return { yen, at: at(nearest(rows.filter((row) => row.bundle.shopPriceYen === yen))) }
    }
    const rows = (stock.items[`${CATEGORY[slot]}:${hex(id)}`] ?? []).filter(
      (row) => row.stage <= stage,
    )
    const yen = effects.items[slot][id]?.yen ?? null
    return rows.length && yen != null ? { yen, at: at(nearest(rows)) } : null
  }
}
