function findBackupOffers(ctx, items, choices) {
  const definitions = choices?.profiles?.[ctx.id]?.bundles || []
  if (definitions.length !== 3) return []
  const offers = definitions.map((def) => {
    const body = items.find((item) => item.category === 'fly' && item.id === def.body)
    const shop = body?.playerUse?.shops?.find(
      (entry) =>
        entry.stage === def.stage &&
        entry.bundle?.body === def.body &&
        entry.bundle?.wing === def.wing &&
        entry.bundle?.tail === def.tail,
    )
    return { def, body, bundle: shop?.bundle }
  })
  return offers.every((offer) => offer.body?.playerUse?.fishIds?.includes(ctx.id) && offer.bundle)
    ? offers
    : []
}

function backupTitle(ctx) {
  if (ctx.locale === 'th') return 'ปลาไม่กินฟลาย? ทางเลือกเพื่อผ่านเงื่อนไขซ่อนหนึ่งข้อ'
  if (ctx.locale === 'ja') return 'フライに反応しない？ 隠れた判定1つを避ける候補'
  return 'No bite on a fly? Alternatives for one hidden check'
}

function backupIntro(ctx, total) {
  if (ctx.locale === 'th')
    return `ถ้าจะเตรียมฟลายสำรอง ชุดด้านล่างมีราคารวมต่ำที่สุดในกลุ่มที่ซื้อชุดสำเร็จรูป 3 ชุดจากร้านทั้ง 6 ด่านแล้วผ่านเงื่อนไขนี้สำหรับปลาตัวนี้ ซื้อใหม่รวม ¥${total} และบอดี้ทั้งสามผ่านเงื่อนไขของปลาที่กำลังดู เก็บไว้เป็นชุดสำรอง ไม่จำเป็นต้องซื้อทั้งหมดเพื่อเริ่มตก`
  if (ctx.locale === 'ja')
    return `予備を用意するなら、この魚の条件を満たす店売り3セットのうち、全6エリアの在庫で合計価格が最安の候補です。新規購入は合計${total}円で、3つの本体すべてが表示中の魚の判定を通ります。最初から全部買う必要はありません。`
  return `For backup flies, these are the lowest-total-price three ready-made sets across all six recorded area stocks that satisfy this check for the current fish. They cost ¥${total} in total when buying new. All three bodies pass the current fish’s profile check. You do not need to buy all three to start fishing.`
}

function backupAction(ctx) {
  if (ctx.locale === 'th')
    return 'สลับลองสามชุดในฉากที่โหลดอยู่เดิม โดยไม่พักโรงแรมหรือออกไปโหลดฉากใหม่ ตามโค้ดอย่างน้อยหนึ่งชุดจะไม่ติดเงื่อนไขซ่อนที่บล็อกจากบอดี้หรือปีก เมื่อค่าซ่อนคงเดิม การตีชุดเดิมซ้ำไม่ได้สุ่มค่านี้ใหม่'
  if (ctx.locale === 'ja')
    return '宿泊やフィールド再生成を挟まず、同じ読み込み済みフィールドで3セットを切り替えます。隠れた値が一定なら、コード上は少なくとも1セットがボディ・ウィングの一致による遮断を避けます。同じセットの投げ直しはこの値を再抽選しません。'
  return 'Switch among the three sets in the same loaded field, without an inn stay or field reload. With the stored hidden values unchanged, the code guarantees at least one avoids the body/wing equality block. Recasting the same set does not reroll those values.'
}

function backupScope(ctx) {
  if (ctx.locale === 'th')
    return 'นี่ผ่านเงื่อนไขซ่อนเพียงหนึ่งข้อ ไม่รับประกันว่าปลาจะกินหรือตกขึ้นได้ ยังมีตำแหน่ง จังหวะ และเงื่อนไขอื่น เส้นทางสลับชุดนี้เป็นข้อสรุปจากโค้ด ยังไม่มีผลทดลองตกจริงยืนยันชุดนี้'
  if (ctx.locale === 'ja')
    return '回避するのは隠れた判定1つだけで、食いつき・取り込みの保証ではありません。位置・タイミング・別条件も残ります。この切替手順はコードに基づく結論で、実釣比較は未実施です。'
  return 'This avoids only one hidden check. Position, timing and other checks still apply; it does not guarantee a bite or landing. The switching strategy is derived from code and has not been confirmed by a controlled fishing trial.'
}

function backupLocation(ctx, def) {
  if (ctx.locale === 'th') return `ร้านด่าน ${def.stage} · รายการฟลายที่ ${def.slot + 1}`
  if (ctx.locale === 'ja') return `エリア${def.stage}の店・フライ一覧の${def.slot + 1}番目`
  return `Area ${def.stage} shop · fly entry ${def.slot + 1}`
}

function backupBuyLabel(ctx) {
  if (ctx.locale === 'th') return 'ดูร้านที่ขายชุดนี้'
  if (ctx.locale === 'ja') return 'このセットの販売店を見る'
  return 'Find the shop for this set'
}

function backupParts(items, def) {
  return [
    ['fly', def.body],
    ['fly_wing', def.wing],
    ['fly_tail', def.tail],
  ]
    .filter(([, id]) => id !== '00')
    .map(([category, id]) => items.find((item) => item.category === category && item.id === id))
    .filter(Boolean)
}

function backupPartsNote(ctx) {
  if (ctx.locale === 'th')
    return 'รูปด้านล่างคือชิ้นส่วนในชุดสำเร็จรูปนี้ ซื้อเป็นชุดตามรายการร้านด้านบน ไม่ใช่ซื้อแต่ละชิ้นแยกกัน'
  if (ctx.locale === 'ja')
    return '下の画像はこの完成セットの構成品です。上記の店頭項目でセットとして買い、部品を個別購入する意味ではありません。'
  return 'The images below are parts of this ready-made set. Buy the listed shop bundle, not these parts separately.'
}

function backupShopLink(ctx, def, stage) {
  const params = new URLSearchParams({
    stage: String(def.stage),
    place: 'town',
    category: 'fly',
    id: def.body,
    fish: ctx.id,
    return: ctx.currentFishPath(stage),
  })
  return `shops${ctx.locale === 'en' ? '' : `.${ctx.locale}`}.html?${params}`
}

function backupCard(ctx, offer, items, stage) {
  const { def, bundle } = offer
  const parts = backupParts(items, def)
    .map((item) => ctx.itemLink({ item, routes: [] }, stage))
    .join('')
  return `<article class="detail-section fly-backup" data-bundle="${def.body}/${def.wing}/${def.tail}" data-price="${bundle.shopPriceYen}"><h4>${ctx.escapeHtml(backupLocation(ctx, def))} · ¥${bundle.shopPriceYen}</h4><p>${ctx.escapeHtml(backupPartsNote(ctx))}</p>${parts}<a class="route-button" href="${ctx.escapeHtml(backupShopLink(ctx, def, stage))}">${ctx.escapeHtml(backupBuyLabel(ctx))} ↗</a></article>`
}

function backupCards(ctx, offers, items, stage) {
  return offers.map((offer) => backupCard(ctx, offer, items, stage)).join('')
}

function backupResearchLink(ctx) {
  const source =
    'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fly-selection-practical-research.md'
  return `<a href="${source}">${ctx.escapeHtml(ctx.copy.evidence)} ↗</a>`
}

export function renderFlyFallback(ctx, items, stage, choices) {
  const offers = findBackupOffers(ctx, items, choices)
  if (!offers.length) return ''
  const total = offers.reduce((sum, offer) => sum + offer.bundle.shopPriceYen, 0)
  const cards = backupCards(ctx, offers, items, stage)
  return `<details id="fly-backup" class="detail-section fly-fallback" data-total="${total}"><summary>${ctx.escapeHtml(backupTitle(ctx))}</summary><p>${ctx.escapeHtml(backupIntro(ctx, total))}</p><p><strong>${ctx.escapeHtml(backupAction(ctx))}</strong></p><div class="detail-grid">${cards}</div><p class="muted">${ctx.escapeHtml(backupScope(ctx))}</p>${backupResearchLink(ctx)}</details>`
}
