export function navigationRoute(ctx, itemCategory = '') {
  const category = itemCategory || document.getElementById('category-filter').value
  if (category === 'lure') return 'lure'
  if (['flymaker', 'fly', 'fly_wing', 'fly_tail'].includes(category)) return 'fly'
  return ctx.baitRoute
}
