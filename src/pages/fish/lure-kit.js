function availableInArea(item, stage) {
  return (item.playerUse?.shops || []).some(
    (shop) => String(shop.stage) === stage && !shop.condition,
  )
}

function coveringPairs(lures, profileCount) {
  const pairs = [
    ['2E', '23'],
    ['17', '23'],
  ]
    .map((ids) => ids.map((id) => lures.find((item) => item.id === id)))
    .filter(
      (pair) =>
        pair.every(Boolean) &&
        pair.every((item) => Number.isFinite(item.priceYen)) &&
        new Set(pair.flatMap((item) => item.playerUse?.fishIds || [])).size === profileCount,
    )
  return pairs
}

function chooseLurePair(pairs, stage) {
  const stocked = (item) => availableInArea(item, stage)
  pairs.sort(
    (a, b) =>
      Number(b.every(stocked)) - Number(a.every(stocked)) ||
      a.reduce((sum, item) => sum + item.priceYen, 0) -
        b.reduce((sum, item) => sum + item.priceYen, 0),
  )
  const localPair = pairs.find((pair) => pair.every(stocked))
  return { pair: localPair || pairs[0], localPair }
}

function lureKitTitle(ctx) {
  if (ctx.locale === 'th') return 'ถ้าจะตกปลาอื่นด้วย: ชุดลัวร์สองชิ้น'
  if (ctx.locale === 'ja') return 'ほかの魚も狙うなら：ルアー2種類のセット'
  return 'Fishing for other species too? A two-lure kit'
}

function lureKitIntro(ctx, count, total) {
  if (ctx.locale === 'th')
    return `ชุดราคาต่ำสุดด้านบนเลือกเพื่อปลาตัวนี้เท่านั้น ถ้าจะพกลัวร์สำหรับปลาหลายชนิด คู่ด้านล่างครอบคลุม ${count} โปรไฟล์ที่ผ่านเงื่อนไขลัวร์ รวมราคาซื้อใหม่ ¥${total}. ไม่ต้องซื้อทุกตัวเลือก: ถ้ามีคู่สปูนกับยางหนอนอยู่แล้ว ใช้ต่อได้`
  if (ctx.locale === 'ja')
    return `上の最安候補はこの魚だけを狙う選択です。ほかの魚も狙うなら、下の組み合わせでルアー判定を通る${count}プロフィールをカバーでき、新規購入は合計${total}円です。全部買う必要はありません。スプーンとワームの組を持っているなら、そのまま使用できます。`
  return `The cheapest choice above is for this fish alone. For a kit to use across species, the pair below covers all ${count} profiles that pass the lure check, for ¥${total} when buying new. Do not buy every alternative: keep the Spoon-and-worm pair if you already own it.`
}

function lureKitAvailability(ctx, localPair) {
  if (ctx.locale === 'th')
    return localPair
      ? 'ซื้อครบคู่นี้ได้ในด่านที่เลือก'
      : 'ด่านที่เลือกขายไม่ครบคู่นี้ ใช้ตัวเลือกสำหรับปลาตัวนี้ด้านบน หรือดูด่านที่ขายแต่ละชิ้นด้านล่าง'
  if (ctx.locale === 'ja')
    return localPair
      ? '選択中エリアで両方買えます。'
      : '選択中エリアでは両方は揃いません。上の対象魚用候補を使うか、下の販売エリアを確認してください。'
  return localPair
    ? 'Both items are stocked in your selected area.'
    : 'The selected area does not stock the full pair. Use the single-fish choice above or check each item’s sale areas below.'
}

function lureKitTarget(ctx, item) {
  const accepts = (item.playerUse?.fishIds || []).includes(ctx.id)
  if (ctx.locale === 'th')
    return accepts ? 'ใช้กับปลาที่กำลังดูได้' : 'ชิ้นนี้ไว้ครอบคลุมปลาอื่นในชุด'
  if (ctx.locale === 'ja') return accepts ? '表示中の魚に対応' : 'このセットでほかの魚を担当'
  return accepts ? 'Works for the fish you are viewing' : 'Covers other fish in this kit'
}

function lureKitCard(ctx, item, stage) {
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
  const profileCount = new Set(lures.flatMap((item) => item.playerUse?.fishIds || [])).size
  if (!lures.some((item) => (item.playerUse?.fishIds || []).includes(ctx.id))) return ''
  const { pair, localPair } = chooseLurePair(coveringPairs(lures, profileCount), stage)
  if (!pair) return ''
  const count = profileCount
  const total = pair.reduce((sum, item) => sum + item.priceYen, 0)
  const cards = pair.map((item) => lureKitCard(ctx, item, stage)).join('')
  return `<section class="detail-section reusable-kit" data-kit="${pair.map((item) => item.id).join('+')}" data-coverage="${count}" data-total="${total}" data-local="${Boolean(localPair)}"><h3>${ctx.escapeHtml(lureKitTitle(ctx))}</h3><p>${ctx.escapeHtml(lureKitIntro(ctx, count, total))}</p><p><strong>${ctx.escapeHtml(lureKitAvailability(ctx, Boolean(localPair)))}</strong></p><div class="detail-grid">${cards}</div><p class="muted">${ctx.escapeHtml(lureKitScope(ctx))}</p></section>`
}
