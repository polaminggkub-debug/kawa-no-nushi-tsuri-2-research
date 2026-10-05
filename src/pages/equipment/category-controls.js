import { categoryNavigationHref } from './category-navigation.js'

export function renderTargetCategories(ctx, fish) {
  const available = fish ? ctx.groups.filter((c) => ctx.fishCategories.includes(c)) : ctx.groups
  const select = document.getElementById('category-filter'),
    current = select.value
  select.innerHTML =
    `<option value="all">${ctx.esc(ctx.player.all)}</option>` +
    available.map((c) => `<option value="${c}">${ctx.esc(ctx.player.cat[c])}</option>`).join('')
  select.value = !fish || ctx.fishCategories.includes(current) ? current : 'all'
  document.getElementById('category-menu').innerHTML = available
    .map((c) => {
      const item = ctx.allItems.find((i) => ctx.groupOf(i) === c)
      const count = ctx.allItems.filter((i) =>
        fish && ['rod', 'hook'].includes(c)
          ? ctx.groupOf(i) === c
          : ctx.groupOf(i) === c &&
            (!fish ||
              ctx.fishIdsFor(i).includes(fish) ||
              (['fly_wing', 'fly_tail'].includes(i.category) && ctx.flyBundlePartFor(i, fish))),
      ).length
      return `<a class="category-button" href="${ctx.esc(categoryNavigationHref(ctx, c, fish))}" data-category="${c}"><img src="${ctx.esc(item?.image)}" alt=""><span><strong>${ctx.esc(ctx.player.cat[c])}</strong><small>${count}</small></span></a>`
    })
    .join('')
}

export function renderFilters(ctx) {
  document.getElementById('category-filter').innerHTML =
    `<option value="all">${ctx.esc(ctx.player.all)}</option>` +
    ctx.groups.map((c) => `<option value="${c}">${ctx.esc(ctx.player.cat[c])}</option>`).join('')
  document.getElementById('style-filter').innerHTML =
    `<option value="">${ctx.esc(ctx.player.all)}</option>` +
    Object.entries(
      ctx.lang === 'th'
        ? { 1: 'ทุ่น / อายุ', 2: 'ตีเหยื่อ', 4: 'ลัวร์', 8: 'ฟลาย' }
        : ctx.lang === 'ja'
          ? { 1: 'ウキ・アユ', 2: '投げ', 4: 'ルアー', 8: 'フライ' }
          : { 1: 'Float / Ayu', 2: 'Casting', 4: 'Lure', 8: 'Fly' },
    )
      .map(([k, v]) => `<option value="${k}">${ctx.esc(v)}</option>`)
      .join('')
  ctx.set('#style-filter-label', ctx.player.style)
  document.getElementById('sort-filter').innerHTML =
    `<option value="id">${ctx.esc(ctx.copy.sortId)}</option><option value="name">${ctx.esc(ctx.copy.sortName)}</option><option value="buy-price">${ctx.esc(ctx.copy.sortBuyPrice)}</option><option value="price">${ctx.esc(ctx.copy.sortPrice)}</option>`
  document.getElementById('category-menu').innerHTML = ctx.groups
    .map((c) => {
      const i = ctx.allItems.find((i) => ctx.groupOf(i) === c)
      return `<a class="category-button" href="${ctx.esc(categoryNavigationHref(ctx, c, document.getElementById('fish-filter').value))}" data-category="${c}"><img src="${ctx.esc(i?.image)}" alt=""><span><strong>${ctx.esc(ctx.player.cat[c])}</strong><small>${ctx.allItems.filter((i) => ctx.groupOf(i) === c).length}</small></span></a>`
    })
    .join('')
}
