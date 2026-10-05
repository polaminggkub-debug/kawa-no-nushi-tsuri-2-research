import { lureCoverageForArea, lureCoverageOptions } from '../../entities/item/index.js'

function availableInArea(item, stage) {
  return (item.playerUse?.shops || []).some(
    (shop) => String(shop.stage) === stage && !shop.condition,
  )
}

function lureKitTitle(ctx) {
  if (ctx.locale === 'th') return 'ถ้าจะตกปลาอื่นด้วย: ชุดลัวร์สองชิ้น'
  if (ctx.locale === 'ja') return 'ほかの魚も狙うなら：ルアー2種類のセット'
  return 'Fishing for other species too? A two-lure kit'
}

function lureKitIntro(ctx, count, total) {
  if (ctx.locale === 'th')
    return `คู่นี้ครอบคลุม ${count} โปรไฟล์ที่ผ่านเงื่อนไขลัวร์ ราคา ¥${total} หากซื้อใหม่ครบคู่ ไม่ต้องซื้อซ้ำถ้ามีคู่ที่ครอบคลุมครบอยู่แล้ว`
  if (ctx.locale === 'ja')
    return `この組み合わせはルアー判定を通る${count}プロフィールをカバーし、新規購入は合計${total}円です。すでに全範囲をカバーする組を持っていれば買い直す必要はありません。`
  return `This pair covers all ${count} profiles that pass the lure check, for ¥${total} when buying new. Keep a full-coverage pair you already own.`
}

function lureKitAvailability(ctx, localPair, hasLocalLureOffer) {
  if (ctx.locale === 'th')
    return localPair
      ? 'ซื้อครบคู่นี้ได้ในด่านที่เลือก'
      : hasLocalLureOffer
        ? 'ด่านที่เลือกขายไม่ครบคู่นี้ ใช้ตัวเลือกสำหรับปลาตัวนี้ด้านบน หรือดูด่านที่ขายแต่ละชิ้นด้านล่าง'
        : 'ด่านที่เลือกไม่มีรายการขายปกติของลัวร์สำหรับปลานี้ ใช้ลัวร์ที่ผ่านเงื่อนไขซึ่งมีอยู่แล้ว หรือเปิดด่านขายจากการ์ดด้านบน'
  if (ctx.locale === 'ja')
    return localPair
      ? '選択中エリアで両方買えます。'
      : hasLocalLureOffer
        ? '選択中エリアでは両方は揃いません。上の対象魚用候補を使うか、下の販売エリアを確認してください。'
        : '選択中エリアではこの魚向けの通常ルアー販売記録がありません。対応ルアーを持っていれば使い、上の販売エリアへのリンクを確認してください。'
  return localPair
    ? 'Both items are stocked in your selected area.'
    : hasLocalLureOffer
      ? 'The selected area does not stock the full pair. Use the single-fish choice above or check each item’s sale areas below.'
      : 'No regular lure sale for this fish is recorded in the selected area. Use a compatible lure you already own or open a recorded sale area from the action above.'
}

function lureKitTarget(ctx, item) {
  const accepts = (item.playerUse?.fishIds || []).includes(ctx.id)
  if (ctx.locale === 'th')
    return accepts ? 'ใช้กับปลาที่กำลังดูได้' : 'ชิ้นนี้ไว้ครอบคลุมปลาอื่นในชุด'
  if (ctx.locale === 'ja') return accepts ? '表示中の魚に対応' : 'このセットでほかの魚を担当'
  return accepts ? 'Works for the fish you are viewing' : 'Covers other fish in this kit'
}

function lureKitCard(ctx, item, stage, pairKey) {
  const stages = [
    ...new Set(
      (item.playerUse?.shops || []).filter((shop) => !shop.condition).map((shop) => shop.stage),
    ),
  ].sort((a, b) => a - b)
  const query = new URLSearchParams({
    category: 'lure',
    id: item.id,
    fish: ctx.id,
    stage,
    route: 'lure',
    kit: pairKey,
    return: ctx.currentFishPath(stage),
  })
  const href = `${ctx.itemPath()}?${query}`
  const saleAreas = stages.map((area) => ctx.escapeHtml(ctx.copy.stage(area))).join(' / ')
  return `<article class="detail-section kit-item" data-item="lure:${item.id}"><a class="entity-link" href="${ctx.escapeHtml(href)}"><img src="${ctx.escapeHtml(item.image)}" alt=""><span><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><small>¥${item.priceYen} · ${saleAreas}</small><small>${ctx.escapeHtml(lureKitTarget(ctx, item))}</small></span></a></article>`
}

function lureKitScope(ctx) {
  if (ctx.locale === 'th')
    return 'ครอบคลุมเงื่อนไขชนิดเหยื่อ ไม่ได้รับประกันว่าปลาจะกินหรือดึงขึ้นสำเร็จ'
  if (ctx.locale === 'ja')
    return 'ルアー種類の判定をカバーするもので、食いつきや取り込みの保証ではありません。'
  return 'Coverage is lure-type compatibility, not a guarantee of a bite or landing.'
}

export function renderReusableKit(ctx, items, stage) {
  const lures = items.filter((item) => item.category === 'lure')
  const coverage = lureCoverageOptions(lures)
  if (!lures.some((item) => (item.playerUse?.fishIds || []).includes(ctx.id))) return ''
  const { pair, isLocal } = lureCoverageForArea(coverage, stage)
  if (!pair) return ''
  const hasLocalLureOffer = lures.some(
    (item) =>
      (item.playerUse?.fishIds || []).includes(ctx.id) && availableInArea(item, String(stage)),
  )
  const cards = pair.items.map((item) => lureKitCard(ctx, item, stage, pair.key)).join('')
  return `<section class="detail-section reusable-kit" data-kit="${pair.key}" data-coverage="${pair.coverageCount}" data-total="${pair.totalYen}" data-local="${isLocal}"><h3>${ctx.escapeHtml(lureKitTitle(ctx))}</h3><p>${ctx.escapeHtml(lureKitIntro(ctx, pair.coverageCount, pair.totalYen))}</p><p><strong>${ctx.escapeHtml(lureKitAvailability(ctx, isLocal, hasLocalLureOffer))}</strong></p><div class="detail-grid">${cards}</div><p class="muted">${ctx.escapeHtml(lureKitScope(ctx))}</p></section>`
}
