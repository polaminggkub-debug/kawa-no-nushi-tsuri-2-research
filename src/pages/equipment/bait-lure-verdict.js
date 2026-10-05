const COPY = {
  en: {
    ownBait: (route) =>
      `If you already own it, keep using it for fish that pass its ${route} compatibility check.`,
    ownLure:
      'If you already own it, keep using it for fish that pass this lure’s compatibility check.',
    float: 'float-rig',
    sinker: 'sinker-rig',
    buy: 'Buying new',
    cheaper: 'lower-priced shop choices with the same or broader fish coverage',
    elsewhere: 'Buying new elsewhere',
    noCheaper: 'No lower-priced shop offer with the same or broader full fish coverage was found.',
    chooseFish: 'Choose one target fish to compare its compatible baits and lures',
    notHere: (stage) => `This item has no recorded shop offer in Area ${stage}.`,
    notHereElsewhere: (stage, areas) =>
      `No offer in Area ${stage}; this item is listed in ${areas}.`,
    notHereConditional: (stage, saleStage) =>
      `No offer in Area ${stage}; its conditional offer is in Area ${saleStage}.`,
    soldHere: (stage, price) => `This item is listed in Area ${stage} for ¥${price}.`,
    soldElsewhere: (areas) => `This item is listed for sale in ${areas}.`,
    noOffer:
      'No sale for this item is recorded in the six area shop lists; its ROM price field does not confirm a place to buy it.',
    conditional: (stage) =>
      `Area ${stage} offer: sell at least one Ayu from your keepnet before buying.`,
    noRouteFish: (route) => `No fish are recorded as compatible with this bait on the ${route}.`,
    switchRoute: (route) => `See fish for the ${route}`,
    noBaitFish: 'No compatible fish are recorded for this bait on either rig.',
    area: (stage) => `Area ${stage}`,
    coveragePeers: 'For the same route-specific fish lists, confirmed shop alternatives are',
    limit:
      'This compares compatible fish and recorded shop stock; it does not show which item gets more bites or is easier to land.',
  },
  ja: {
    ownBait: (route) =>
      `すでに持っているなら、${route}仕掛けの適合条件を通る魚に使い続けられます。`,
    ownLure: 'すでに持っているなら、このルアーの適合条件を通る魚に使い続けられます。',
    float: 'ウキ',
    sinker: 'オモリ',
    buy: '新しく買うなら',
    cheaper: '同じか広い魚リストに対応する、より安い店頭品',
    elsewhere: '他のエリアで買うなら',
    noCheaper: '同じか広い魚リスト全体に対応する、より安い店頭品は確認できていません。',
    chooseFish: '魚を1種類選び、使えるエサとルアーを比較する',
    notHere: (stage) => `エリア${stage}では、この品の店頭販売は確認されていません。`,
    notHereElsewhere: (stage, areas) =>
      `エリア${stage}では販売されていません。販売エリア：${areas}。`,
    notHereConditional: (stage, saleStage) =>
      `エリア${stage}では販売されていません。条件付き販売はエリア${saleStage}です。`,
    soldHere: (stage, price) => `エリア${stage}で${price}円で販売されています。`,
    soldElsewhere: (areas) => `${areas}で販売されています。`,
    noOffer:
      '6エリアの店頭リストに販売記録がありません。ROMの価格欄だけでは購入場所を確認できません。',
    conditional: (stage) => `エリア${stage}の販売条件：購入前にびくのアユを1匹以上売ってください。`,
    noRouteFish: (route) => `このエサは${route}仕掛けで対応する魚が記録されていません。`,
    switchRoute: (route) => `${route}仕掛けの対応魚を見る`,
    noBaitFish: 'このエサはどちらの仕掛けでも対応魚が記録されていません。',
    area: (stage) => `エリア${stage}`,
    coveragePeers: '同じ仕掛け別の魚リストに対応し、店頭販売が確認された候補：',
    limit: 'これは対応する魚と店頭在庫の比較です。食いつきや取り込みやすさは示しません。',
  },
  th: {
    ownBait: (route) => `ถ้ามีอยู่แล้ว ใช้ต่อกับปลาที่ผ่านเงื่อนไขของ${route}ได้`,
    ownLure: 'ถ้ามีอยู่แล้ว ใช้ต่อกับปลาที่ผ่านเงื่อนไขของลัวร์ชิ้นนี้ได้',
    float: 'สายทุ่น',
    sinker: 'สายตะกั่ว',
    buy: 'ถ้าจะซื้อใหม่',
    cheaper: 'ตัวเลือกในร้านที่ถูกกว่าและรองรับรายชื่อปลาเท่ากันหรือกว้างกว่า',
    elsewhere: 'ถ้าจะซื้อจากด่านอื่น',
    noCheaper: 'ไม่พบรายการขายที่ถูกกว่าและครอบคลุมรายชื่อปลาทั้งชุดเท่ากันหรือกว้างกว่า',
    chooseFish: 'เลือกปลาเป้าหมายเพื่อเทียบเหยื่อที่ใช้ได้กับปลาตัวนั้น',
    notHere: (stage) => `ไม่พบรายการขายชิ้นนี้ในร้านด่าน ${stage}`,
    notHereElsewhere: (stage, areas) => `ด่าน ${stage} ไม่มีขาย; มีรายการขายที่${areas}`,
    notHereConditional: (stage, saleStage) =>
      `ด่าน ${stage} ไม่มีขาย; รายการขายแบบมีเงื่อนไขอยู่ด่าน ${saleStage}`,
    soldHere: (stage, price) => `มีรายการขายชิ้นนี้ในด่าน ${stage} ราคา ¥${price}`,
    soldElsewhere: (areas) => `มีรายการขายชิ้นนี้ที่${areas}`,
    noOffer: 'ไม่พบชิ้นนี้ในรายการร้านทั้ง 6 ด่าน; ช่องราคาใน ROM ยังไม่ยืนยันว่าซื้อได้ที่ไหน',
    conditional: (stage) =>
      `ด่าน ${stage} มีเงื่อนไขขาย: ต้องขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนซื้อ`,
    noRouteFish: (route) => `ไม่พบปลาที่บันทึกว่าใช้เหยื่อนี้ได้กับ${route}`,
    switchRoute: (route) => `ดูปลาที่ใช้ได้กับ${route}`,
    noBaitFish: 'ไม่พบปลาที่บันทึกว่าใช้เหยื่อนี้ได้ทั้งสายทุ่นและสายตะกั่ว',
    area: (stage) => `ด่าน ${stage}`,
    coveragePeers: 'ตัวเลือกที่ร้านมีขายและรองรับรายชื่อปลาเดียวกันตามสายตกนี้:',
    limit:
      'ข้อมูลนี้เทียบชนิดปลาที่ใช้ได้กับรายการของในร้าน ไม่ได้บอกว่าอันไหนทำให้ปลากินมากกว่าหรือตกขึ้นง่ายกว่า',
  },
}

function copy(ctx) {
  return COPY[ctx.lang] || COPY.en
}

function stageNumber(value) {
  const stage = Number(value)
  return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0
}

function recordedShopRows(item) {
  return (item.playerUse?.shops || []).filter((row) => stageNumber(row.stage))
}

function hasUnconditionalSale(item, stage) {
  return recordedShopRows(item).some((row) => stageNumber(row.stage) === stage && !row.condition)
}

function findItem(ctx, ref) {
  return ctx.allItems.find(
    (candidate) => candidate.category === ref.category && candidate.id === ref.id,
  )
}

function collectCheaperOffers(ctx, item, selectedStage = 0) {
  const offers = new Map()
  const itemPrice = Number(item.priceYen)
  if (!Number.isFinite(itemPrice) || itemPrice <= 0) return []
  for (const [stageText, refs] of Object.entries(item.baitLureDecision?.cheaperByStage || {})) {
    const stage = stageNumber(stageText)
    if (!stage || (selectedStage && stage !== selectedStage)) continue
    for (const ref of refs) {
      const target = findItem(ctx, ref)
      const price = Number(ref.priceYen)
      if (
        !target ||
        !Number.isFinite(price) ||
        price < 0 ||
        price >= itemPrice ||
        !hasUnconditionalSale(target, stage)
      )
        continue
      const key = `${target.category}:${target.id}:${price}`
      const offer = offers.get(key) || { item: target, price, stages: [] }
      if (!offer.stages.includes(stage)) offer.stages.push(stage)
      offers.set(key, offer)
    }
  }
  return [...offers.values()].sort(
    (a, b) => a.price - b.price || a.item.id.localeCompare(b.item.id),
  )
}

function cheaperOffers(ctx, item) {
  const stage = stageNumber(ctx.locationStage)
  const local = stage ? collectCheaperOffers(ctx, item, stage) : []
  return local.length ? local : collectCheaperOffers(ctx, item)
}

function stockedPeerOffers(ctx, item) {
  const offers = []
  for (const ref of item.baitLureDecision?.alternatives || []) {
    const target = findItem(ctx, ref)
    if (!target) continue
    for (const row of recordedShopRows(target)) {
      const stage = stageNumber(row.stage)
      if (row.condition) continue
      offers.push({ item: target, price: Number(target.priceYen), stages: [stage] })
    }
  }
  const sorted = offers.sort((a, b) => a.price - b.price || a.item.id.localeCompare(b.item.id))
  const stage = stageNumber(ctx.locationStage)
  const local = stage ? sorted.filter((offer) => offer.stages.includes(stage)) : []
  return local.length ? local : sorted
}

function groupStages(offers) {
  const grouped = new Map()
  for (const offer of offers) {
    const key = `${offer.item.category}:${offer.item.id}:${offer.price}`
    const group = grouped.get(key) || { ...offer, stages: [] }
    for (const stage of offer.stages) {
      if (!group.stages.includes(stage)) group.stages.push(stage)
    }
    grouped.set(key, group)
  }
  return [...grouped.values()].map((offer) => ({
    ...offer,
    stages: offer.stages.sort((a, b) => a - b),
  }))
}

function offerLabel(ctx, offer) {
  const c = copy(ctx)
  const areas = offer.stages.map(c.area).join(', ')
  const stage = offer.stages[0]
  const href = ctx.areaItemLink(offer.item, stage)
  const key = `${offer.item.category}:${offer.item.id}`
  return `<a data-bait-lure-choice="${ctx.esc(key)}" data-offer-stage="${stage}" data-offer-price="${offer.price}" href="${ctx.esc(href)}">${ctx.esc(ctx.itemName(offer.item))} (ID ${ctx.esc(offer.item.id)}) · ¥${ctx.esc(offer.price)} · ${ctx.esc(areas)} ↗</a>`
}

function ownStockNote(ctx, item) {
  const c = copy(ctx)
  const rows = recordedShopRows(item)
  const selected = stageNumber(ctx.locationStage)
  if (!rows.length) return c.noOffer
  if (selected) {
    const row = rows.find((entry) => stageNumber(entry.stage) === selected)
    if (!row) {
      const conditional = rows.find((entry) => entry.condition)
      if (conditional) return c.notHereConditional(selected, stageNumber(conditional.stage))
      const areas = rows.map((entry) => c.area(stageNumber(entry.stage))).join(', ')
      return c.notHereElsewhere(selected, areas)
    }
    return row.condition ? c.conditional(selected) : c.soldHere(selected, item.priceYen)
  }
  const regular = rows.filter((row) => !row.condition)
  if (regular.length) {
    const areas = regular.map((row) => c.area(stageNumber(row.stage))).join(', ')
    return c.soldElsewhere(areas)
  }
  return c.conditional(stageNumber(rows[0].stage))
}

function fishPickerLink(ctx, item) {
  const query = new URLSearchParams({ category: item.category })
  const stage = stageNumber(ctx.locationStage)
  if (stage) query.set('stage', String(stage))
  if (ctx.baitRoute) query.set('route', ctx.baitRoute)
  const href = `${ctx.detailFile('index')}?${query}#fish-filter-label`
  return `<a data-bait-lure-fish-picker href="${ctx.esc(href)}">${ctx.esc(copy(ctx).chooseFish)} ↗</a>`
}

function routeChoiceLink(ctx, item, route) {
  const stage =
    stageNumber(ctx.locationStage) || stageNumber(item.playerUse?.shops?.[0]?.stage) || 1
  const [page, query = ''] = ctx.areaItemLink(item, stage).split('?')
  const params = new URLSearchParams(query)
  params.set('route', route)
  return page + '?' + params
}

function ownUseMarkup(ctx, item) {
  const c = copy(ctx)
  if (item.category !== 'bait') return `<p class="bait-lure-owned-action">${ctx.esc(c.ownLure)}</p>`
  const fishByRoute = item.playerUse?.fishIdsByRoute
  const routeKey = ctx.baitRoute === 'sinker' ? 'sinker' : 'float'
  const routeName = routeKey === 'sinker' ? c.sinker : c.float
  if (!Array.isArray(fishByRoute?.[routeKey])) {
    return `<p class="bait-lure-owned-action">${ctx.esc(c.ownBait(routeName))}</p>`
  }
  if (fishByRoute[routeKey].length) {
    return `<p class="bait-lure-owned-action">${ctx.esc(c.ownBait(routeName))}</p>`
  }
  const otherRoute = routeKey === 'sinker' ? 'float' : 'sinker'
  const otherName = otherRoute === 'sinker' ? c.sinker : c.float
  if (!fishByRoute[otherRoute]?.length) {
    return `<p class="bait-lure-owned-action">${ctx.esc(c.noBaitFish)}</p>`
  }
  const link = routeChoiceLink(ctx, item, otherRoute)
  return `<p class="bait-lure-owned-action">${ctx.esc(c.noRouteFish(routeName))} <a data-bait-lure-route-choice="${otherRoute}" href="${ctx.esc(link)}">${ctx.esc(c.switchRoute(otherName))} ↗</a></p>`
}

function offerSentence(ctx, item, offers) {
  const c = copy(ctx)
  if (!offers.length) {
    const listedPeers = stockedPeerOffers(ctx, item)
    if (listedPeers.length) {
      const peers = groupStages(listedPeers).slice(0, 2)
      return `<p class="bait-lure-stocked-peers"><strong>${ctx.esc(c.coveragePeers)}</strong> ${peers.map((offer) => offerLabel(ctx, offer)).join(' · ')}</p>`
    }
    return `<p class="bait-lure-no-cheaper">${ctx.esc(c.noCheaper)} ${fishPickerLink(ctx, item)}</p>`
  }
  const shown = groupStages(offers).slice(0, 2)
  const stage = stageNumber(ctx.locationStage)
  const hasLocalOffer = stage && shown.some((offer) => offer.stages.includes(stage))
  const title = stage
    ? `${hasLocalOffer ? c.buy : c.elsewhere} · ${c.area(stage)}`
    : `${c.buy} · ${c.cheaper}`
  return `<p class="bait-lure-buy-choices"><strong>${ctx.esc(title)}:</strong> ${shown.map((offer) => offerLabel(ctx, offer)).join(' · ')}</p>`
}

export function baitLureVerdict(ctx, item) {
  if (!item?.baitLureDecision || !['bait', 'lure'].includes(item.category)) return ''
  const offers = cheaperOffers(ctx, item)
  const ownUse = ownUseMarkup(ctx, item)
  const stock = ownStockNote(ctx, item)
  return `<div class="bait-lure-verdict" data-bait-lure-verdict="${ctx.esc(item.category + ':' + item.id)}">${ownUse}<p class="bait-lure-own-stock">${ctx.esc(stock)}</p>${offerSentence(ctx, item, offers)}<p class="bait-lure-evidence-limit">${ctx.esc(copy(ctx).limit)}</p></div>`
}
