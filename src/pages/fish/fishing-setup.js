function stockedInArea(item, stage) {
  return item.playerUse?.shops?.some(
    (shop) => String(shop.stage) === String(stage) && !shop.condition,
  )
}

function orderedForPurchase(items) {
  return items
    .filter((item) => Number.isFinite(item.priceYen) && item.playerUse?.shops?.length)
    .sort((a, b) => a.priceYen - b.priceYen || a.id.localeCompare(b.id))
}

function rigRoles(items, method) {
  const choose = (candidates) => ({ candidates: orderedForPurchase(candidates) })
  const hooks = items.filter((item) => item.category === 'hook' && item.rawFields?.['+1'] === 0)
  const floatWeights = items.filter((item) => {
    if (item.category !== 'float_weight') return false
    const id = Number.parseInt(item.id, 16)
    return method === 'float' ? id <= 8 : id >= 9
  })
  return [
    { role: 'hook', ...choose(hooks) },
    { role: method, ...choose(floatWeights) },
  ]
}

function rigTitle(ctx) {
  if (ctx.locale === 'th') return 'ตะขอและชุดทุ่น/ตะกั่วที่ต้องเตรียม'
  if (ctx.locale === 'ja') return '準備する針とウキ・オモリ'
  return 'Hook and float/sinker to prepare'
}

function rigOwnedNote(ctx) {
  if (ctx.locale === 'th')
    return 'ใช้ตะขอและทุ่น/ตะกั่วที่มีให้ตรงวิธีนี้ ซื้อเฉพาะของที่ขาด ตัวเลือกตะขอด้านล่างราคาต่ำสุดในรุ่นที่เกมไม่ได้ผูกกับปลาเฉพาะชนิด ไม่ใช่อันดับจับง่าย'
  if (ctx.locale === 'ja')
    return '手持ちの針と、この釣り方に合うウキ・オモリを使い、不足分だけ買います。針は特定の魚との一致条件がない型の最安候補で、取り込みやすさの順位ではありません。'
  return 'Use an owned hook and a float or sinker matching this method; buy only missing equipment. The hook is the cheapest stocked model without a species-specific match, not a landing-success winner.'
}

function rigRoleName(ctx, role) {
  if (role === 'hook') {
    if (ctx.locale === 'th') return 'ตะขอ'
    if (ctx.locale === 'ja') return '針'
    return 'Hook'
  }
  return role === 'float' ? ctx.copy.float : ctx.copy.sinker
}

function rigPurchaseAction(ctx, stocked, stage, item) {
  if (stocked) {
    if (ctx.locale === 'th') return `ซื้อใหม่ที่ด่าน ${stage} ราคาเต็ม ¥${item.priceYen}`
    if (ctx.locale === 'ja') return `エリア${stage}で新規購入、全額${item.priceYen}円。`
    return `Buy new in area ${stage} at the full ¥${item.priceYen}.`
  }
  if (ctx.locale === 'th')
    return 'ด่านนี้ไม่มีสินค้าประเภทนี้ในสต็อกที่ตรวจ ใช้ของที่มี หรือเปิดหน้าชิ้นนี้เพื่อดูด่านที่ขายก่อนเดินทาง'
  if (ctx.locale === 'ja')
    return 'このエリアに在庫の記録がありません。手持ちを使うか、この道具の販売エリアを確認してから移動します。'
  return 'No stock of this equipment type is recorded in this area. Use an owned item or open this choice to check sale areas before travelling.'
}

function rigChoiceLink(ctx, choice, method, stage) {
  const params = new URLSearchParams({
    category: choice.category,
    id: choice.id,
    fish: ctx.id,
    stage: String(stage),
    route: method,
    return: ctx.currentFishPath(stage) + '#starter-' + method,
  })
  return `${ctx.itemPath()}?${params}`
}

function rigChoiceCard(ctx, role, method, stage) {
  const stocked = role.candidates.filter((item) => stockedInArea(item, stage))
  const choice = stocked[0] || role.candidates[0]
  if (!choice) return ''
  const localStock = stocked.length > 0
  const action = rigPurchaseAction(ctx, localStock, stage, choice)
  return `<div class="method-rig-choice" data-rig-role="${role.role}" data-rig-item="${choice.id}" data-rig-local="${Boolean(localStock)}"><h5>${ctx.escapeHtml(rigRoleName(ctx, role.role))}</h5><a class="entity-link" href="${ctx.escapeHtml(rigChoiceLink(ctx, choice, method, stage))}"><img src="${ctx.escapeHtml(choice.image)}" alt=""><span><strong>${ctx.escapeHtml(ctx.localizedItemName(choice))}</strong><small>${ctx.escapeHtml(action)}</small></span></a></div>`
}

function rigNonBaitNote(ctx, method) {
  const note =
    method === 'lure'
      ? ctx.locale === 'th'
        ? 'ลัวร์ไม่ใช้ตะขอและทุ่นของชุดเหยื่อ จึงไม่ต้องซื้อสองหมวดนี้มาเพิ่มให้ชุดลัวร์'
        : ctx.locale === 'ja'
          ? 'ルアーの準備ではエサ釣りの針・ウキを使わないため、このセット用に追加購入しません。'
          : 'Lure setup does not use the bait-rig hook or float; do not buy those as additions to this lure set.'
      : ctx.locale === 'th'
        ? 'ฟลายไม่ใช้ตะขอของชุดเหยื่อ และเกมโหลดเครื่องหมายให้อัตโนมัติ ไม่ต้องซื้อเครื่องหมายเพื่อเพิ่มประสิทธิภาพชุดนี้'
        : ctx.locale === 'ja'
          ? 'フライではエサ釣りの針を使わず、目印は自動設定されます。性能向上のために目印を追加購入しません。'
          : 'Fly setup clears the bait hook and loads its marker automatically. Do not buy a marker expecting to improve this set.'
  return `<p class="method-equipment-note">${ctx.escapeHtml(note)}</p>`
}

function rigNewTotal(ctx, method, stage, items, roles, baitPrice) {
  const style = method === 'float' ? 1 : 2
  const rods = orderedForPurchase(
    items.filter((item) => item.category === 'rod' && item.decodedFields?.styleCode === style),
  )
  const localRod = rods.find((rod) => stockedInArea(rod, stage))
  const localParts = roles.map((role) => role.candidates.find((item) => stockedInArea(item, stage)))
  if (!localRod || !localParts.every(Boolean)) return null
  return localRod.priceYen + baitPrice + localParts.reduce((sum, item) => sum + item.priceYen, 0)
}

function rigTotalLine(ctx, total) {
  if (total === null) return ''
  const label =
    ctx.locale === 'th'
      ? `ซื้อคัน + เหยื่อ + ตะขอ + ทุ่น/ตะกั่วใหม่ทั้งหมด รวม ¥${total}`
      : ctx.locale === 'ja'
        ? `竿・エサ・針・ウキ／オモリをすべて新規購入：合計${total}円。`
        : `Buying the rod, bait, hook and float/sinker all new: ¥${total} total.`
  return `<p class="rig-total" data-rig-total="${total}"><strong>${ctx.escapeHtml(label)}</strong></p>`
}

function rigFloatFallback(ctx, method, stage, items, roles) {
  if (method !== 'sinker' || roles[1].candidates.some((item) => stockedInArea(item, stage)))
    return ''
  const hasFloat = ctx
    .starterOffers(ctx.matchingItems(items), stage)
    .some((offer) => offer.method === 'float')
  if (!hasFloat) return ''
  const label =
    ctx.locale === 'th'
      ? 'ยังไม่มีตะกั่ว? เลือกชุดทุ่นที่ปลาเป้าหมายรับได้ในด่านนี้'
      : ctx.locale === 'ja'
        ? 'オモリがない場合、このエリアの対象魚に適合するウキセットを選ぶ'
        : 'No sinker yet? Choose the target-compatible float setup in this area'
  return `<p><a class="route-button" data-rig-fallback="float" href="#starter-float">${ctx.escapeHtml(label)} ↓</a></p>`
}

function rigEvidenceLink(ctx) {
  const label =
    ctx.locale === 'th'
      ? 'หลักฐานการใช้ตะขอและทุ่น/ตะกั่ว'
      : ctx.locale === 'ja'
        ? '針・ウキ・オモリの根拠'
        : 'Hook and float/sinker evidence'
  return `<details><summary>${ctx.escapeHtml(ctx.copy.evidence)}</summary><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/hook-practical-research.md">${ctx.escapeHtml(label)} ↗</a></details>`
}

export function renderRodForMethod(ctx, method, stage, items) {
  const style = { float: 1, sinker: 2, lure: 4, fly: 8 }[method]
  const rods = items.filter(
    (item) => item.category === 'rod' && item.decodedFields?.styleCode === style,
  )
  const priced = orderedForPurchase(rods)
  const localRods = priced.filter((rod) => stockedInArea(rod, stage))
  const choice = localRods[0] || priced[0]
  if (!choice) return ''
  const title =
    ctx.locale === 'th'
      ? 'คันสำหรับวิธีนี้'
      : ctx.locale === 'ja'
        ? 'この釣り方の竿'
        : 'Rod for this method'
  const owned =
    ctx.locale === 'th'
      ? 'ถ้ามีคันของวิธีนี้อยู่แล้ว ใช้ต่อได้ ไม่ต้องซื้อซ้ำ'
      : ctx.locale === 'ja'
        ? 'この釣り方の竿を持っているなら、そのまま使い、買い直す必要はない。'
        : 'Keep a rod for this method if you already own one; there is no need to buy another.'
  const decision = rodPurchaseDecision(ctx, localRods, stage, choice)
  return `<section class="method-rod" data-method-rod="${method}" data-rod="${choice.id}" data-rod-local="${Boolean(localRods.length)}"><h4>${ctx.escapeHtml(title)}</h4><p>${ctx.escapeHtml(owned)}</p><p>${ctx.escapeHtml(decision)}</p>${ctx.itemLink({ item: choice, routes: [] }, stage)}</section>`
}

function rodPurchaseDecision(ctx, localRods, stage, choice) {
  if (!localRods.length) {
    if (ctx.locale === 'th')
      return 'ด่านนี้ไม่มีคันของวิธีนี้ในสต็อกที่ตรวจ ใช้คันที่มีอยู่ หรือเปิดรายการนี้เพื่อดูด่านที่ขายก่อนเดินทาง; ไม่ต้องซื้อคันต่างสายมาแทน'
    if (ctx.locale === 'ja')
      return 'このエリアにこの釣り方の竿の在庫は記録されていない。手持ちを使うか、移動前にこの竿の販売エリアを確認する。別の釣り方の竿で代用しない。'
    return 'No rod for this method is recorded in this area’s stock. Use one you own, or check this rod’s sale areas before travelling; do not buy a different rod style as a substitute.'
  }
  if (ctx.locale === 'th')
    return `ถ้าต้องซื้อใหม่แบบประหยัด คันนี้ถูกที่สุดในสต็อกของวิธีนี้ที่ด่าน ${stage} ราคาเต็ม ¥${choice.priceYen}`
  if (ctx.locale === 'ja')
    return `安く始めるなら、エリア${stage}のこの釣り方の竿で最安。新規購入は全額${choice.priceYen}円。`
  return `For a budget start, this is the cheapest recorded rod for this method stocked in area ${stage}, at a full ¥${choice.priceYen}.`
}

export function renderRigForMethod(ctx, method, stage, items, baitPrice) {
  if (!['float', 'sinker'].includes(method)) return rigNonBaitNote(ctx, method)
  const roles = rigRoles(items, method)
  const cards = roles.map((role) => rigChoiceCard(ctx, role, method, stage)).join('')
  const total = rigNewTotal(ctx, method, stage, items, roles, baitPrice)
  const totalLine = rigTotalLine(ctx, total)
  const fallback = rigFloatFallback(ctx, method, stage, items, roles)
  return `<section class="method-rig" data-method-rig="${method}"><h4>${ctx.escapeHtml(rigTitle(ctx))}</h4><p>${ctx.escapeHtml(rigOwnedNote(ctx))}</p>${cards}${totalLine}${fallback}${rigEvidenceLink(ctx)}</section>`
}
