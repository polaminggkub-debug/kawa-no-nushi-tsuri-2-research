export function setupNavigation(ctx) {
  ctx.sourceReturn = () => {
    if (typeof location === 'undefined')
      return `index${ctx.lang === 'en' ? '' : '.' + ctx.lang}.html#catalogue`
    const query = new URLSearchParams(location.search)
    for (const [param, id] of [
      ['q', 'search'],
      ['sort', 'sort-filter'],
      ['style', 'style-filter'],
    ]) {
      const value = document.getElementById(id).value
      if (value) query.set(param, value)
      else query.delete(param)
    }
    if (ctx.locationStage) query.set('stage', ctx.locationStage)
    else query.delete('stage')
    query.set('route', ctx.baitRoute)
    query.set('map', String(ctx.locationMapIndex))
    return location.pathname.split('/').pop() + '?' + query + location.hash
  }
  ctx.fishingContext = (item) =>
    ['rod', 'bait', 'lure', 'hook', 'float_weight', 'fly', 'fly_wing', 'fly_tail'].includes(
      item.category,
    ) ||
    (item.category === 'general_tool' && ['03', '04', '08', '09', '0A', '0E'].includes(item.id))
  ctx.itemHref = (item) => {
    const q = new URLSearchParams({
      category: item.category,
      id: item.id,
      return: ctx.sourceReturn(),
    })
    const fish = document.getElementById('fish-filter').value
    if (ctx.fishingContext(item) && fish) q.set('fish', fish)
    if (item.category === 'bait' || (ctx.fishingContext(item) && fish))
      q.set('route', ctx.baitRoute)
    if (ctx.locationStage) q.set('stage', String(ctx.locationStage))
    return `${ctx.detailFile('item')}?${q}`
  }
  ctx.fishHref = (id) =>
    `${ctx.detailFile('fish')}?id=${encodeURIComponent(id)}${ctx.locationStage ? '&stage=' + ctx.locationStage : ''}&return=${encodeURIComponent(ctx.sourceReturn())}`
}
