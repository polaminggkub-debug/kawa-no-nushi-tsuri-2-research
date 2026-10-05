function compatibleWith(item, fish, route) {
  const use = item.playerUse || {}
  const ids = route ? use.fishIdsByRoute?.[route] || use.fishIds || [] : use.fishIds || []
  return ids.includes(fish)
}

export function fishEquipmentDefault(ctx, fish) {
  const items = ctx.allItems || []
  const preferred = ctx.baitRoute === 'sinker' ? 'sinker' : 'float'
  for (const route of [preferred, preferred === 'float' ? 'sinker' : 'float']) {
    if (items.some((item) => item.category === 'bait' && compatibleWith(item, fish, route)))
      return { category: 'bait', route }
  }
  if (items.some((item) => item.category === 'lure' && compatibleWith(item, fish)))
    return { category: 'lure', route: preferred }
  if (items.some((item) => item.category === 'fly' && compatibleWith(item, fish)))
    return { category: 'flymaker', route: preferred }
  return { category: 'bait', route: preferred }
}

export function applyFishEquipmentDefault(ctx, fish) {
  const choice = fishEquipmentDefault(ctx, fish)
  document.getElementById('category-filter').value = choice.category
  ctx.baitRoute = choice.route
  ctx.flyPart = 'fly'
}
