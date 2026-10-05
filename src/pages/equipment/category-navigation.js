const ROUTES = ['float', 'sinker']
const FLY_PARTS = ['fly', 'fly_wing', 'fly_tail']
const STAGES = ['1', '2', '3', '4', '5', '6']

export function categoryNavigationHref(ctx, category, fish) {
  const search = typeof location === 'undefined' ? '' : location.search
  const query = new URLSearchParams(search)
  query.set('category', category)
  if (fish) query.set('fish', fish)
  else query.delete('fish')
  query.delete('q')
  query.delete('style')

  if (STAGES.includes(String(ctx.locationStage || ''))) query.set('stage', ctx.locationStage)
  else query.delete('stage')
  if (ROUTES.includes(ctx.baitRoute)) query.set('route', ctx.baitRoute)
  else query.delete('route')
  if (category === 'flymaker' && FLY_PARTS.includes(ctx.flyPart)) query.set('part', ctx.flyPart)
  else query.delete('part')

  const map = Number(ctx.locationMapIndex)
  if (query.has('map') || (Number.isInteger(map) && map > 0)) {
    if (Number.isInteger(map) && map >= 0) query.set('map', String(map))
    else query.delete('map')
  }
  return `?${query.toString()}#catalogue`
}

export function refreshCategoryNavigationLinks(ctx, fish) {
  document.querySelectorAll('#category-menu [data-category]').forEach((link) => {
    link.setAttribute('href', categoryNavigationHref(ctx, link.dataset.category, fish))
  })
}
