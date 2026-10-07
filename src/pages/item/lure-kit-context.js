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
      action: `เก็บทั้งคู่ ${pair.key} จะครอบคลุมปลาลัวร์ทั้ง ${pair.coverageCount} ชนิด รวม ¥${pair.totalYen} หากซื้อใหม่ ถ้ามีคู่ครบอยู่แล้ว ใช้ต่อได้ ไม่ต้องซื้อซ้ำ`,
      scope:
        'ตัวเลือกที่ถูกกว่าด้านล่างเทียบทีละชิ้น ถ้าเลือกปลาไว้จะเทียบสำหรับปลานั้น ถ้าจะเปลี่ยนชิ้นหนึ่งในคู่ ให้ตรวจว่าทั้งคู่ยังครอบคลุมปลาครบ และลัวร์ที่ถูกกว่าอาจอยู่คนละกลุ่มขนาด จึงเริ่มสู้ได้ไม่เหมือนกัน',
      partner: 'ดูอีกชิ้นในชุดและแหล่งซื้อ',
    }
  if (ctx.lang === 'ja')
    return {
      title: '複数の魚に使うルアーセットを選択中',
      action: `${pair.key}の両方を持つとルアーの対象${pair.coverageCount}種すべてをカバーできます。新規購入は合計${pair.totalYen}円。すでに一式を持っていれば買い直す必要はありません。`,
      scope:
        '下の安い候補は道具単体の比較です。魚を選択している場合は、その魚について比較します。片方を替えるときはセット全体のカバーを確認してください。安いルアーはサイズ区分が違い、ファイトの開始値も変わることがあります。',
      partner: 'もう一方の道具と販売場所を見る',
    }
  return {
    title: 'Choosing an item for a multi-species lure kit',
    action: `Keep both ${pair.key} to cover all ${pair.coverageCount} lure fish, for ¥${pair.totalYen} when buying new. Keep using a complete pair you already own; you do not need to buy it again.`,
    scope:
      'Cheaper choices below compare individual items; with a selected fish, they compare choices for that fish. Check that the complete pair still covers every fish before replacing a member. A cheaper lure can sit in a different size class, which changes how the fight starts.',
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

export function kitItemComparison(ctx, item, allItems, section) {
  if (!requestedKit(ctx, item, allItems)) return section
  const comparison = {
    th: 'เปรียบเทียบไอเท็มชิ้นนี้แยกจากชุด',
    en: 'Compare this item separately from the kit',
    ja: 'セットとは別に、この道具単体を比較',
  }[ctx.lang]
  return `<details class="detail-section" data-kit-item-comparison><summary>${ctx.esc(comparison)}</summary>${section}</details>`
}
