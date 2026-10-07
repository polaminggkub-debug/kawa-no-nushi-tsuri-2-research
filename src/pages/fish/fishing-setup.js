import { fitEffect, fitHeadline, fitNote, fitUpgrades } from './rod-fit.js'

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

export function renderRodForMethod(ctx, method, stage, items, starterPrice, rigTotal = null) {
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
  const baseTotal = rodSetupTotal(method, starterPrice, localRods, choice, rigTotal)
  const upgrades = renderRodUpgradeChoices(ctx, method, stage, localRods, choice, baseTotal)
  const total = nonBaitSetupTotal(ctx, method, baseTotal)
  const fit = fitNote(ctx, choice, Number.parseInt(ctx.id, 16))
  return `<section class="method-rod" data-method-rod="${method}" data-rod="${choice.id}" data-rod-local="${Boolean(localRods.length)}"><h4>${ctx.escapeHtml(title)}</h4><p>${ctx.escapeHtml(owned)}</p><p>${ctx.escapeHtml(decision)}</p>${fit}${ctx.itemLink({ item: choice, routes: [] }, stage)}${total}${upgrades}</section>`
}

function nonBaitSetupTotal(ctx, method, total) {
  if (!['lure', 'fly'].includes(method) || !Number.isFinite(total)) return ''
  return `<p class="rig-total" data-method-setup-total="${total}"><strong>${ctx.escapeHtml(setupTotalNote(ctx, total))}</strong></p>`
}

function rodSetupTotal(method, starterPrice, localRods, budgetRod, rigTotal) {
  if (Number.isFinite(rigTotal)) return rigTotal
  if (!localRods.length || !Number.isFinite(starterPrice) || !['lure', 'fly'].includes(method))
    return null
  return budgetRod.priceYen + starterPrice
}

function rodMetric(item, key) {
  const metrics = item.playerUse?.rodMetrics
  return Number.isFinite(metrics?.[key]) ? metrics[key] : null
}

function decisionBackLink(ctx, method, stage) {
  const [page, ...queryParts] = ctx.currentFishPath(stage).split('?')
  const query = new URLSearchParams(queryParts.join('?'))
  if (ctx.id) query.set('id', ctx.id)
  query.set('stage', String(stage))
  query.set('route', method)
  return `${page}?${query.toString()}#starter-${method}`
}

function upgradeRodLink(ctx, item, method, stage) {
  const query = new URLSearchParams({
    category: 'rod',
    id: item.id,
    fish: ctx.id,
    stage: String(stage),
    route: method,
    return: decisionBackLink(ctx, method, stage),
  })
  return `${ctx.itemPath()}?${query.toString()}`
}

function metricLeader(rods, key, secondaryKey) {
  return rods
    .filter(
      (rod) =>
        rod.rodDecision?.recommendation &&
        rodMetric(rod, key) !== null &&
        rodMetric(rod, secondaryKey) !== null,
    )
    .sort(
      (a, b) =>
        rodMetric(b, key) - rodMetric(a, key) ||
        rodMetric(b, secondaryKey) - rodMetric(a, secondaryKey) ||
        a.priceYen - b.priceYen ||
        a.id.localeCompare(b.id),
    )[0]
}

function rodUpgradeLeaders(rods, budgetRod, fish) {
  if (!budgetRod || rods.length < 2) return []
  const baselineAim = rodMetric(budgetRod, 'aimCutoffAt100Hp')
  if (baselineAim === null) return []
  const leaders = [
    ['aim', metricLeader(rods, 'aimCutoffAt100Hp', 'reachMultiplierRaw')],
    ...fitUpgrades(rods, budgetRod, fish),
  ]
  const choices = new Map()
  for (const [dimension, item] of leaders) {
    if (!item) continue
    if (dimension === 'aim' && rodMetric(item, 'aimCutoffAt100Hp') <= baselineAim) continue
    const choice = choices.get(item.id) || { item, dimensions: [] }
    choice.dimensions.push(dimension)
    choices.set(item.id, choice)
  }
  return [...choices.values()]
}

function upgradeHeadline(ctx, dimensions) {
  const aim =
    ctx.locale === 'th'
      ? 'มีเวลาเล็งนานสุดในร้านด่านนี้'
      : ctx.locale === 'ja'
        ? 'このエリアの店頭で狙う時間が最長'
        : 'Most time to aim in this area'
  const parts = dimensions.map((dimension) =>
    dimension === 'aim' ? aim : fitHeadline(ctx, dimension),
  )
  return parts.join(' · ')
}

function upgradeEffect(ctx, dimension, item, budgetRod) {
  if (dimension !== 'aim') return fitEffect(ctx, dimension, item, budgetRod)
  const aim = rodMetric(item, 'aimCutoffAt100Hp')
  const baseAim = rodMetric(budgetRod, 'aimCutoffAt100Hp')
  if ([2, 4].includes(item.decodedFields?.styleCode)) {
    if (ctx.locale === 'th')
      return `ที่ HP 100 มีเวลาเล็ง ${aim} เทียบกับ ${baseAim} ของคันราคาต่ำสุด; ถ้า HP ต่ำกว่า 100 เวลาเล็งจะสั้นลง`
    if (ctx.locale === 'ja')
      return `HP100のときの狙う時間は${aim}、最安竿は${baseAim}。HPが100未満だと短くなります。`
    return `At 100 HP, aim time ${aim} vs ${baseAim} for the cheapest rod; below 100 HP you get less time to aim.`
  }
  if (ctx.locale === 'th')
    return `เวลาเล็ง ${aim} เทียบกับ ${baseAim} ของคันราคาต่ำสุด จึงมีเวลาขยับเป้านานขึ้นก่อนเกมตัดสินว่าเหยื่อตกตรงไหน`
  if (ctx.locale === 'ja')
    return `狙う時間は${aim}、最安竿は${baseAim}。投げ先を動かす時間が長くなります。`
  return `Aim time ${aim} vs ${baseAim} for the cheapest rod gives you longer to move the target before the game decides where the cast lands.`
}

function upgradeCost(ctx, item, budgetRod) {
  const difference = item.priceYen - budgetRod.priceYen
  if (ctx.locale === 'th')
    return `ราคาเต็มซื้อใหม่ ¥${item.priceYen}${difference ? ` · เพิ่มจากคันเริ่ม ¥${difference}` : ' · ราคาเท่าคันเริ่ม'}`
  if (ctx.locale === 'ja')
    return `新品価格${item.priceYen}円${difference ? ` · 最安竿より${difference}円高い` : ' · 最安竿と同額'}`
  return `Full new-purchase price ¥${item.priceYen}${difference ? ` · ¥${difference} more than the budget rod` : ' · same price as the budget rod'}`
}

function upgradeCard(ctx, method, stage, choice, budgetRod, baseTotal) {
  const item = choice.item
  const benefit = choice.dimensions.map((dimension) =>
    upgradeEffect(ctx, dimension, item, budgetRod),
  )
  const label = upgradeHeadline(ctx, choice.dimensions)
  const image = item.image ? `<img src="${ctx.escapeHtml(item.image)}" alt="">` : ''
  const link = upgradeRodLink(ctx, item, method, stage)
  const total = Number.isFinite(baseTotal)
    ? setupTotalNote(ctx, baseTotal + item.priceYen - budgetRod.priceYen)
    : ''
  return `<article class="method-rig-choice method-rod-upgrade" data-rod-upgrade="${item.id}" data-rod-upgrade-dimensions="${choice.dimensions.join(',')}"><h5>${ctx.escapeHtml(label)}</h5><a class="entity-link" href="${ctx.escapeHtml(link)}">${image}<span><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><small>${ctx.escapeHtml(upgradeCost(ctx, item, budgetRod))}</small></span></a>${benefit.map((text) => `<p>${ctx.escapeHtml(text)}</p>`).join('')}${total ? `<p><strong>${ctx.escapeHtml(total)}</strong></p>` : ''}</article>`
}

function setupTotalNote(ctx, total) {
  if (ctx.locale === 'th') return `ซื้อของทั้งชุดใหม่รวม ¥${total}`
  if (ctx.locale === 'ja') return `一式を新品で購入した合計${total}円`
  return `Complete new setup total ¥${total}`
}

function renderRodUpgradeChoices(ctx, method, stage, rods, budgetRod, baseTotal) {
  const choices = rodUpgradeLeaders(rods, budgetRod, Number.parseInt(ctx.id, 16))
  if (!choices.length) return ''
  const title =
    ctx.locale === 'th'
      ? 'ถ้าคันถูกสุดไม่เหมาะกับปลานี้ หรืออยากมีเวลาเล็งนานขึ้น'
      : ctx.locale === 'ja'
        ? '最安竿がこの魚に合わない場合や、狙う時間を上げたい場合'
        : 'If the budget rod does not suit this fish, or you want more time to aim'
  const scope =
    ctx.locale === 'th'
      ? 'สายยาวพอและจุดเริ่มสู้ที่ดีกว่าช่วยให้ปลาไม่หลุดและสายไม่ขาด (วัดจากการจำลองการสู้ปลา) ส่วนเวลาเล็งไม่ได้ทำให้ปลากินง่ายขึ้น; คันนี้ต้องซื้อใหม่ราคาเต็ม'
      : ctx.locale === 'ja'
        ? '糸の長さが足りて出だしが有利なほど、魚を逃がしにくく糸も切れにくくなります（ファイトのシミュレーションによる）。狙う時間で食いつきは良くなりません。新品の全額が必要です。'
        : 'A line that is long enough and a better fight start keep the fish from escaping and the line from breaking (measured in simulated fights). Time to aim does not make fish bite more. The rod costs its full new-purchase price.'
  return `<div class="method-rod-upgrades" data-rod-upgrades-for="${method}"><h5>${ctx.escapeHtml(title)}</h5><div class="detail-grid">${choices.map((choice) => upgradeCard(ctx, method, stage, choice, budgetRod, baseTotal)).join('')}</div><p class="muted">${ctx.escapeHtml(scope)}</p></div>`
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
