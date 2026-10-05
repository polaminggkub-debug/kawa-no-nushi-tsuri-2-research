const copy = {
  th: [
    'อาหารฟื้น HP แทนการกินปลา',
    'เมนูนี้ใช้ปลาที่ตกได้และเก็บในข้อง ถ้าอยากเก็บปลาไว้ ให้ใช้อาหารที่มีอยู่ก่อน หรือดูอาหารอื่นตามด่านที่เลือก',
    'เลือกอาหารฟื้น HP',
  ],
  en: [
    'Restore HP while keeping your fish',
    'This menu uses a caught fish stored in your keepnet. To keep that fish, use food you already own or compare other food for the selected area.',
    'Choose food for HP recovery',
  ],
  ja: [
    '魚を残してHPを回復',
    'このメニューは釣ってびくに入れた魚を使う。魚を残すなら手持ちの食料を先に使うか、選択エリアの他の食料を比較する。',
    'HP回復用の食料を選ぶ',
  ],
}

export function fishMealRecovery(ctx, stage) {
  const [title, description, action] = copy[ctx.lang] || copy.en
  const query = new URLSearchParams({ category: 'food' })
  if (stage) query.set('stage', String(stage))
  const returned = ctx.safeLocalRoute(ctx.currentLocalRoute())
  if (returned) query.set('return', returned)
  const href = `${ctx.cataloguePage[ctx.lang]}?${query}#catalogue`
  return `<section class="detail-section" data-fish-meal-recovery><h2>${ctx.esc(title)}</h2><p>${ctx.esc(description)}</p><a class="route-button" href="${ctx.esc(href)}">${ctx.esc(action)} ↗</a></section>`
}
