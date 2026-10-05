export function hasSelectedArea(ctx) {
  const stage = Number(ctx.locationStage)
  return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0
}

export function localRodOffer(decision) {
  return (
    decision &&
    !['item-unstocked', 'style-unstocked', 'style-never-stocked'].includes(decision.status)
  )
}

export function withStage(href, stage) {
  const [pathAndQuery, hash = ''] = href.split('#')
  const [path, query = ''] = pathAndQuery.split('?')
  const params = new URLSearchParams(query)
  params.set('stage', String(stage))
  return `${path}?${params}${hash ? `#${hash}` : ''}`
}

export function areaLabel(ctx, stage) {
  if (ctx.lang === 'th') return `ด่าน ${stage}`
  if (ctx.lang === 'ja') return `エリア${stage}`
  return `Area ${stage}`
}

export function categoryDecisionCopy(ctx, category, count) {
  const area = hasSelectedArea(ctx)
  const isAreaRod = area && category === 'rod'
  return {
    label: categoryLabel(ctx, category, count, area, isAreaRod),
    note: categoryNote(ctx, area, isAreaRod || Boolean(area && category === 'all')),
  }
}

function categoryLabel(ctx, category, count, area, isAreaRod) {
  if (!isAreaRod) return ctx.cardUi.categoryAdvice(count)
  if (ctx.lang === 'th') return `คำแนะนำคันเบ็ดทั่วไป (ไม่คัดตามด่าน ${area}) · ${count}`
  if (ctx.lang === 'ja') return `一般的な竿のルート案内（エリア${area}に限定しない） · ${count}`
  return `General rod route advice (not scoped to Area ${area}) · ${count}`
}

function categoryNote(ctx, area, isAreaRod) {
  if (!isAreaRod) return ''
  if (ctx.lang === 'th')
    return `<p>คำแนะนำคันเบ็ดนี้เป็นเส้นทางทั่วไป ไม่ได้คัดสินค้าตามด่าน ${area} เปิดหน้าร้านเพื่อดูรายการขายในด่านที่เลือก</p>`
  if (ctx.lang === 'ja')
    return `<p>竿の一般ルート案内で、エリア${area}の店頭在庫に限定した案内ではありません。選択エリアの販売品はショップページで確認してください。</p>`
  return `<p>These rod recommendations are general routes, not stock choices for Area ${area}. Open Shops to see recorded offers in your selected area.</p>`
}
