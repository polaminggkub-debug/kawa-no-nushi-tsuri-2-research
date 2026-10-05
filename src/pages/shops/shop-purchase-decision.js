import { rodAreaDecision } from '../../entities/item/index.js'

const copy = {
  th: {
    details: 'เหตุผลและขอบเขตคำแนะนำ',
    rodScope: 'เทียบราคาซื้อใหม่ เวลาเล็ง และขอบเขตที่ตรวจแล้ว ไม่ใช่อันดับโอกาสตกสำเร็จ',
  },
  en: {
    details: 'Why choose it and what the comparison covers',
    rodScope: 'Compares new-purchase price, aim and the traced boundary, not catch success.',
  },
  ja: {
    details: '選ぶ理由と比較の範囲',
    rodScope: '新品価格・照準時間・確認した距離境界の比較で、釣果の順位ではありません。',
  },
}

function localValue(lang, value) {
  return typeof value === 'string' ? value : value?.[lang] || value?.en || ''
}

function decisionFor(ctx, item, stage, items) {
  if (item.category === 'rod')
    return items?.length ? rodAreaDecision(ctx.lang, item, items, stage) : null
  return ['hook', 'float_weight'].includes(item.category) ? item.gearDecision : null
}

export function shopPurchaseDecision(ctx, item, stage, items) {
  const decision = decisionFor(ctx, item, stage, items)
  const label = localValue(ctx.lang, decision?.label)
  if (!label) return ''
  const text = copy[ctx.lang] || copy.en
  const scope = decision.scope || (item.category === 'rod' ? text.rodScope : '')
  const paragraphs = [decision.recommendation, decision.reason, scope]
    .map((value) => localValue(ctx.lang, value))
    .filter(Boolean)
    .map((value) => `<p>${ctx.esc(value)}</p>`)
    .join('')
  const status = decision.status || 'gear'
  return `<div class="shop-purchase-decision" data-shop-purchase-decision="${ctx.esc(item.category)}:${ctx.esc(item.id)}" data-decision-stage="${Number(stage)}" data-decision-status="${ctx.esc(status)}"><p><strong>${ctx.esc(label)}</strong></p>${paragraphs ? `<details data-shop-decision-details><summary>${ctx.esc(text.details)}</summary>${paragraphs}</details>` : ''}</div>`
}
