export function keyPurchaseChoice(ctx, item) {
  if (item?.category !== 'general_tool' || item.id !== '17') return ''
  const label = {
    th: 'ยังไม่มีกุญแจ? ดูร้านที่ขายและทางไป',
    en: 'Need a key? Find the sellers and how to reach them',
    ja: 'カギがない？ 販売店と行き方を確認',
  }[ctx.lang]
  return `<p class="key-purchase-choice"><a class="route-button" data-key-purchase-action href="#item-shops">${ctx.esc(label)} ↓</a></p>`
}
