export function navigationRoute(ctx) {
  const category = document.getElementById('category-filter').value
  if (category === 'lure') return 'lure'
  if (category === 'flymaker') return 'fly'
  return ctx.baitRoute
}
