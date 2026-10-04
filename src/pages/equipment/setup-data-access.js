export function setupDataAccess(ctx) {
  ctx.fishSearchText = (id) =>
    [
      id,
      ...Object.entries(ctx.fishVisuals[id] || {})
        .filter(([key]) => key.startsWith('name'))
        .flatMap(([, value]) => (Array.isArray(value) ? value : [value])),
    ]
      .filter(Boolean)
      .join(' ')
      .normalize('NFKC')
      .toLocaleLowerCase()
  ctx.groupOf = (item) => (item.category.startsWith('fly') ? 'flymaker' : item.category)
  ctx.local = (value) => (typeof value === 'string' ? value : value?.[ctx.lang] || value?.en || '')
  ctx.useOf = (item) => item.playerUse || {}
  ctx.fishName = (id) => {
    const f = ctx.fishVisuals[id] || {}
    const latin =
      f.nameLatin || (f.nameLatinVariants || []).slice().sort((a, b) => b.length - a.length)[0]
    return ctx.lang === 'th'
      ? f.nameTh || (f.nameThVariants || []).join(' / ') || latin || f.nameJa || id
      : ctx.lang === 'en'
        ? f.nameEn || latin || f.nameJa || id
        : f.nameJa || id
  }
  ctx.fishIdsFor = (item) =>
    item.category === 'bait'
      ? ctx.useOf(item).fishIdsByRoute?.[ctx.baitRoute] || ctx.useOf(item).fishIds || []
      : ctx.useOf(item).fishIds || []
  ctx.detailFile = (type) => `${type}${ctx.lang === 'en' ? '' : '.' + ctx.lang}.html`
}
