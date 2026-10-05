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
    note: categoryNote(ctx, area, isAreaRod),
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
    return '<p>ส่วนนี้เป็นคำแนะนำเส้นทางเดิม ตารางเทียบด้านล่างคัดรายการขายตามด่านที่เลือก</p>'
  if (ctx.lang === 'ja')
    return '<p>この欄は一般ルート案内です。下の比較表は選択エリアの販売記録で比較します。</p>'
  return '<p>These are general route recommendations. The comparison table below uses recorded offers for the selected area.</p>'
}
