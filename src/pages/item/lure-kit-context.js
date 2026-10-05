import { lureCoverageOptions } from '../../entities/item/index.js'

function requestedKit(ctx, item, allItems) {
  const raw = ctx.params.get('kit') || ''
  if (item.category !== 'lure' || !/^[0-9A-F]{2}\+[0-9A-F]{2}$/.test(raw)) return null
  const key = raw.split('+').sort().join('+')
  return (
    lureCoverageOptions(allItems).pairs.find(
      (pair) =>
        pair.items
          .map((entry) => entry.id)
          .sort()
          .join('+') === key && pair.items.some((entry) => entry.id === item.id),
    ) || null
  )
}

function kitCopy(ctx, pair) {
  if (ctx.lang === 'th')
    return {
      title: 'คุณกำลังเลือกของสำหรับชุดลัวร์หลายชนิด',
      action: `เก็บทั้งคู่ ${pair.key} เพื่อครอบคลุมเงื่อนไขลัวร์ ${pair.coverageCount} โปรไฟล์ รวม ¥${pair.totalYen} หากซื้อใหม่ ถ้ามีคู่ครบอยู่แล้ว ใช้ต่อได้ ไม่ต้องซื้อซ้ำ`,
      scope:
        'คำแนะนำราคาถูกกว่าด้านล่างเลือกเพื่อปลาที่ดูอยู่ตัวเดียว การเปลี่ยนชิ้นหนึ่งไม่ได้ยืนยันว่าครอบคลุมครบทั้งชุด ไม่ได้รับประกันปลากินหรือดึงขึ้นสำเร็จ',
      partner: 'ดูอีกชิ้นในชุดและแหล่งซื้อ',
    }
  if (ctx.lang === 'ja')
    return {
      title: '複数の魚に使うルアーセットを選択中',
      action: `${pair.key}の両方を持つと${pair.coverageCount}プロフィールのルアー判定をカバーできます。新規購入は合計${pair.totalYen}円。すでに一式を持っていれば買い直す必要はありません。`,
      scope:
        '下の安い候補は表示中の魚だけを狙う選択です。片方を替えてもセット全体のカバーは保証されません。食いつきや取り込みの保証ではありません。',
      partner: 'もう一方の道具と販売場所を見る',
    }
  return {
    title: 'Choosing an item for a multi-species lure kit',
    action: `Keep both ${pair.key} to cover ${pair.coverageCount} lure-compatible profiles, for ¥${pair.totalYen} when buying new. Keep using a complete pair you already own; you do not need to buy it again.`,
    scope:
      'Cheaper choices below target only the fish you are viewing. Replacing one member does not establish full-kit coverage. Coverage does not guarantee a bite or landing.',
    partner: 'See the other kit member and where to buy it',
  }
}

function partnerHref(ctx, partner, pair) {
  const [page, search = ''] = ctx.detailItemLink(partner).split('?')
  const query = new URLSearchParams(search)
  query.set('kit', pair.key)
  return `${page}?${query}`
}

export function lureKitContext(ctx, item, allItems) {
  const pair = requestedKit(ctx, item, allItems)
  if (!pair) return ''
  const partner = pair.items.find((entry) => entry.id !== item.id)
  const copy = kitCopy(ctx, pair)
  const link = partnerHref(ctx, partner, pair)
  return `<section class="detail-section" data-lure-kit-context="${ctx.esc(pair.key)}" data-kit-coverage="${pair.coverageCount}"><h2>${ctx.esc(copy.title)}</h2><p><strong>${ctx.esc(copy.action)}</strong></p><a class="entity-link" data-lure-kit-partner="${ctx.esc(partner.id)}" href="${ctx.esc(link)}"><img src="${ctx.esc(partner.image)}" alt=""><span>${ctx.esc(ctx.imageName(partner))}<small>${ctx.esc(copy.partner)} ↗</small></span></a><p class="muted">${ctx.esc(copy.scope)}</p></section>`
}
