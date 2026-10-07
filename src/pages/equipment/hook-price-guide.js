const hookSizeHeaders = {
  th: ['ปลาไม่เกิน 15 ซม.', 'ปลา 16–35 ซม.', 'ปลาเกิน 35 ซม.'],
  en: ['Fish up to 15 cm', 'Fish of 16–35 cm', 'Fish over 35 cm'],
  ja: ['15cm以下の魚', '16〜35cmの魚', '35cm超の魚'],
}

function hookSizeCell(ctx, stage, size) {
  const row = ctx.gearPriceGuide.hook[stage].bySize[size]
  if (!row) {
    return ctx.lang === 'th'
      ? 'ยังไม่มีขาย ใช้เบ็ดของปลา 16–35 ซม.'
      : ctx.lang === 'ja'
        ? '未販売。16〜35cm用で代用'
        : 'Not sold yet; use the 16–35 cm hook'
  }
  const item = ctx.allItems.find((i) => i.category === row.category && i.id === row.id)
  return `<a data-hook-budget-stage="${stage}" data-hook-size="${size}" href="${ctx.esc(ctx.areaItemLink(item, stage))}">${ctx.esc(ctx.itemName(item))} (${row.id}) · ¥${row.priceYen}</a>`
}

export function hookPriceGuide(ctx) {
  const title =
    ctx.lang === 'th'
      ? 'เบ็ดหายหรือยังไม่มี? ซื้อเบ็ดที่ถูกสุดตามขนาดปลา ในด่านนี้'
      : ctx.lang === 'ja'
        ? '針を失った・持っていない？魚の大きさ別の最安の針（現在エリア）'
        : 'Lost your hook or have none? Cheapest hook by fish size in your area'
  const note =
    ctx.lang === 'th'
      ? 'ถ้ามีเบ็ดอยู่แล้วใช้ต่อได้ เลือกเบ็ดให้ตรงขนาดปลาที่จะตก ตะขอตรงขนาดให้พลาดได้เพิ่ม 1 จังหวะ ผิดขนาดเสีย 1 จังหวะ ขายเป็นชุด 9 ตัว ไม่ต้องซื้อเบ็ดชุดเหยื่อสำหรับลัวร์หรือฟลาย'
      : ctx.lang === 'ja'
        ? '所持している針はそのまま使えます。魚の大きさに合う針を選びます。大きさに合う針は許されるミスが1回増え、合わない針は1回減ります。9個1組で売っています。ルアー・フライ用にエサ釣りの針を買う必要はありません。'
        : 'Keep the hook you own. Pick the hook for the size of the fish you want: a hook that fits allows 1 more mistake, one that does not costs 1. Hooks are sold in stacks of 9. Do not buy a bait-rig hook for lure or fly fishing.'
  const area = ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'
  const headers = (hookSizeHeaders[ctx.lang] || hookSizeHeaders.en)
    .map((label) => `<th>${label}</th>`)
    .join('')
  const rows = [1, 2, 3, 4, 5, 6]
    .map(
      (stage) =>
        `<tr><td>${stage}</td>${[0, 1, 2].map((size) => `<td>${hookSizeCell(ctx, stage, size)}</td>`).join('')}</tr>`,
    )
    .join('')
  return `<section class="decision-card" id="hook-price-guide"><h3>${title}</h3><p>${note}</p><div class="table-wrap"><table><thead><tr><th>${area}</th>${headers}</tr></thead><tbody>${rows}</tbody></table></div></section>`
}
