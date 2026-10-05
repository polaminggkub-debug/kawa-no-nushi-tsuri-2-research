function selectedStage(value) {
  const stage = Number(value)
  return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0
}

function ordinaryOffers(item, stage) {
  if (['fly', 'fly_wing', 'fly_tail'].includes(item.category)) return []
  return (item.playerUse?.shops || []).filter((offer) => {
    const area = selectedStage(offer.stage)
    return area && (!stage || area === stage) && offer.shop !== 'fly_bundle' && !offer.bundle
  })
}

export function itemShopSortState(item, selectedArea) {
  const stage = selectedStage(selectedArea)
  const offers = ordinaryOffers(item, stage)
  const knownPrice = Number.isFinite(item.priceYen) && item.priceYen >= 0
  if (!knownPrice || !offers.length) return { rank: 2, price: Infinity, stage }
  const regular = offers.some((offer) => !offer.condition)
  return { rank: regular ? 0 : 1, price: item.priceYen, stage }
}

export function sortItemsByShopAvailability(items, selectedArea) {
  return [...items].sort((first, second) => {
    const a = itemShopSortState(first, selectedArea)
    const b = itemShopSortState(second, selectedArea)
    return (
      a.rank - b.rank ||
      (a.rank < 2 ? a.price - b.price : 0) ||
      first.category.localeCompare(second.category) ||
      first.id.localeCompare(second.id)
    )
  })
}
