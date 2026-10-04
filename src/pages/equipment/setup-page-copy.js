export function setupPageCopy(ctx) {
  document.title =
    ctx.lang === 'th'
      ? 'ตกปลาทาโร่ 2 — ไอเท็ม คันเบ็ด เหยื่อ และข้อมูล ROM | Kawa no Nushi Tsuri 2'
      : ctx.lang === 'ja'
        ? '川のぬし釣り2（SFC）アイテム一覧・竿・ルアー・ROM解析'
        : 'Kawa no Nushi Tsuri 2 (SNES/SFC) — Items, Rods, Lures & ROM Research'
  document.querySelectorAll('[data-t]').forEach((node) => {
    const key =
      {
        'th-item': 'item',
        'th-rom': 'rom',
        'th-price': 'price',
        'search-label': 'search',
        'category-label': 'category',
        'sort-label': 'sort',
        'readme-link': 'readme',
      }[node.dataset.t] || node.dataset.t.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const value = ctx.copy[key]
    if (typeof value === 'string') node.textContent = value
  })
  document.querySelectorAll('[data-t-placeholder]').forEach((node) => {
    const value =
      ctx.copy[node.dataset.tPlaceholder] ??
      ctx.copy[node.dataset.tPlaceholder.replace(/-([a-z])/g, (_, c) => c.toUpperCase())]
    if (value) node.placeholder = value
  })
  ctx.itemLabel = document.querySelector('thead th')
  if (ctx.itemLabel) ctx.itemLabel.textContent = ctx.copy.item
  ctx.headers = document.querySelectorAll('thead th')
  if (ctx.headers[1]) ctx.headers[1].textContent = ctx.copy.rom
  if (ctx.headers[2]) ctx.headers[2].textContent = ctx.copy.price
  ctx.imageText = (item) =>
    ctx.lang === 'th' ? item.imageNoteTh : ctx.lang === 'ja' ? item.imageNoteJa : item.imageNoteEn
  ctx.formatYen = (item) =>
    item.priceYen === null || item.priceYen === undefined
      ? ctx.copy.noPrice
      : `${ctx.copy.yen}${item.priceYen}`
  ctx.exampleIds = ['rod:0A', 'rod:0D', 'lure:12', 'lure:21', 'lure:51', 'food:01', 'food:0A']
  ctx.categoryNames = {}
}
