function acceptedFor(item, fish, route) {
  const use = item.playerUse || {}
  const ids = item.category === 'bait' ? use.fishIdsByRoute?.[route] || [] : use.fishIds || []
  return ids.includes(fish)
}

function offerAt(item, stage) {
  const use = item.playerUse || {}
  const offer = use.shops?.find((entry) => Number(entry.stage) === stage)
  if (!offer) return null
  return {
    category: item.category,
    id: item.id,
    priceYen: Number(offer.priceYen ?? item.priceYen),
    available: true,
    conditional: Boolean(offer.condition),
    condition: offer.condition || '',
  }
}

function localOffers(ctx, item, fish, route, stage) {
  if (!stage) return []
  return ctx.allItems
    .filter(
      (candidate) => candidate.category === item.category && acceptedFor(candidate, fish, route),
    )
    .map((candidate) => offerAt(candidate, stage))
    .filter((offer) => offer && Number.isFinite(offer.priceYen))
    .sort((a, b) => a.priceYen - b.priceYen || a.id.localeCompare(b.id))
}

function cheapestTies(offers) {
  const eligible = offers.filter((offer) => !offer.conditional)
  if (!eligible.length) return []
  const minimum = eligible[0].priceYen
  return eligible.filter((offer) => offer.priceYen === minimum)
}

function conditionalTies(offers) {
  const eligible = offers.filter((offer) => offer.conditional)
  if (!eligible.length) return []
  const minimum = eligible[0].priceYen
  return eligible.filter((offer) => offer.priceYen === minimum)
}

function selectAlternatives(offers, current, currentStock) {
  const otherOffers = offers.filter((offer) => offer.id !== current.id)
  const candidates = currentStock
    ? otherOffers.filter((offer) => offer.priceYen < currentStock.priceYen)
    : otherOffers
  return [...cheapestTies(candidates), ...conditionalTies(candidates)].sort(
    (a, b) =>
      a.priceYen - b.priceYen ||
      Number(a.conditional) - Number(b.conditional) ||
      a.id.localeCompare(b.id),
  )
}

export function targetAdvice(ctx, item, fish) {
  if (!fish || !['bait', 'lure'].includes(item.category)) return null
  const route = item.category === 'bait' ? ctx.baitRoute || 'float' : 'lure'
  if (!acceptedFor(item, fish, route)) return null
  const parsedStage = Number(ctx.locationStage)
  const stage =
    Number.isInteger(parsedStage) && parsedStage >= 1 && parsedStage <= 6 ? parsedStage : null
  const currentOffer = stage ? offerAt(item, stage) : null
  const currentStock = stage ? currentOffer || { available: false } : null
  const localOptions = localOffers(ctx, item, fish, route, stage)
  const alternatives = stage
    ? selectAlternatives(localOptions, item, currentStock?.available ? currentStock : null)
    : []
  return {
    fish,
    route,
    stage,
    compatible: true,
    currentStock,
    localOptions,
    cheapestUnconditional: cheapestTies(localOptions),
    alternatives,
  }
}

function routeName(ctx, route) {
  if (route === 'lure')
    return ctx.lang === 'ja' ? 'ルアー' : ctx.lang === 'th' ? 'สายลัวร์' : 'lure'
  if (ctx.lang === 'th') return route === 'float' ? 'ชุดทุ่น' : 'ชุดตะกั่ว'
  if (ctx.lang === 'ja') return route === 'float' ? 'ウキ仕掛け' : 'オモリ仕掛け'
  return route === 'float' ? 'float rig' : 'sinker rig'
}

function compatibilityText(ctx, fish, route) {
  if (route === 'lure')
    return text(ctx, {
      th: `ผ่านเงื่อนไขลัวร์สำหรับ${fish}`,
      ja: `${fish}のルアー判定に適合`,
      en: `Passes the lure check for ${fish}`,
    })
  return text(ctx, {
    th: `ผ่านเงื่อนไขเหยื่อสำหรับ${fish} · ${routeName(ctx, route)}`,
    ja: `${fish}のエサ判定に適合 · ${routeName(ctx, route)}`,
    en: `Passes the bait check for ${fish} · ${routeName(ctx, route)}`,
  })
}

function text(ctx, values) {
  return values[ctx.lang] || values.en
}

function conditionText(ctx, condition) {
  if (!condition.includes('sell at least one Ayu')) return condition
  if (ctx.lang === 'th') return 'ต้องขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนซื้อ'
  if (ctx.lang === 'ja') return 'びくのアユを1匹以上売ってから購入'
  return 'requires selling at least one Ayu from your keepnet first'
}

function alternativeLink(ctx, offer) {
  const candidate = ctx.allItems.find(
    (entry) => entry.category === offer.category && entry.id === offer.id,
  )
  if (!candidate) return ''
  const condition = offer.conditional
    ? `<small>${ctx.esc(conditionText(ctx, offer.condition))}</small>`
    : ''
  return `<li data-target-alternative="${ctx.esc(offer.category + ':' + offer.id)}"><a href="${ctx.esc(ctx.itemHref(candidate))}">${ctx.esc(ctx.itemName(candidate))} (${ctx.esc(offer.id)}) · ¥${offer.priceYen}</a>${condition}</li>`
}

function alternativeList(ctx, advice) {
  if (!advice.alternatives.length) return ''
  const heading = advice.currentStock?.available
    ? text(ctx, {
        th: 'ตัวเลือกที่ถูกกว่าซึ่งผ่านเงื่อนไขปลาและมีขายในด่านนี้',
        ja: 'この魚の判定を通り、エリア内で買える安い候補',
        en: 'Cheaper local offers that pass this fish check',
      })
    : text(ctx, {
        th: 'ตัวเลือกที่มีขายในด่านนี้และผ่านเงื่อนไขปลา',
        ja: 'エリア内で販売され、この魚の判定を通る候補',
        en: 'Local offers that pass this fish check',
      })
  return `<p>${ctx.esc(heading)}</p><ul>${advice.alternatives.map((offer) => alternativeLink(ctx, offer)).join('')}</ul>`
}

function noAreaDecision(ctx) {
  return text(ctx, {
    th: 'มีของชิ้นนี้อยู่แล้วใช้ต่อได้ เลือกด่านจากแผนที่เพื่อดูว่ามีขายอะไรและราคาเท่าไร',
    ja: '所持していれば使用できます。地図でエリアを選ぶと、店頭在庫と価格を確認できます。',
    en: 'Use it if you already own it. Choose an area on the map to check local stock and prices.',
  })
}

function absentStockDecision(ctx, advice) {
  if (advice.alternatives.length)
    return text(ctx, {
      th: 'ถ้ามีชิ้นนี้อยู่แล้วใช้ต่อได้ ชิ้นนี้ไม่มีรายการขายในด่านนี้; ถ้าจะซื้อใหม่ ให้เลือกตัวเลือกด้านล่าง',
      ja: '所持していればそのまま使えます。この品はエリア内の在庫記録がありません。新しく買うなら下記の候補を選べます。',
      en: 'Keep using it if owned. This item has no recorded stock in this area; for a new purchase, choose a compatible offer below.',
    })
  return text(ctx, {
    th: 'ชิ้นนี้ไม่มีรายการขายในด่านนี้; ถ้ามีอยู่แล้วใช้ต่อได้ หรือดูร้านในด่านอื่น',
    ja: 'この品はエリア内の在庫記録がありません。所持品は使えます。別エリアの店を確認してください。',
    en: 'This item has no recorded stock in this area. Use it if owned, or check another area’s shops.',
  })
}

function conditionalStockDecision(ctx, stage, stock) {
  return text(ctx, {
    th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen} แต่${conditionText(ctx, stock.condition)}`,
    ja: `エリア${stage}で${stock.priceYen}円で販売。ただし${conditionText(ctx, stock.condition)}`,
    en: `Stocked in area ${stage} for ¥${stock.priceYen}, but ${conditionText(ctx, stock.condition)}.`,
  })
}

function cheapestStockDecision(ctx, stage, stock) {
  return text(ctx, {
    th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen}; ถ้าจะซื้อ ชิ้นนี้เป็นหนึ่งในตัวเลือกที่ถูกที่สุดซึ่งผ่านเงื่อนไขปลาในสต็อกที่ตรวจได้`,
    ja: `エリア${stage}で${stock.priceYen}円。このエリアで確認できた魚判定を通る在庫品の最安候補の一つです。`,
    en: `Stocked in area ${stage} for ¥${stock.priceYen}; it is one of the cheapest recorded local offers passing this fish check.`,
  })
}

function compareStockDecision(ctx, stage, stock) {
  return text(ctx, {
    th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen}; ถ้ามีอยู่แล้วใช้ต่อได้ ถ้าจะซื้อให้ดูตัวเลือกที่ถูกกว่าด้านล่าง`,
    ja: `エリア${stage}で${stock.priceYen}円。所持品はそのまま使えます。購入するなら下記の安い候補を確認してください。`,
    en: `Stocked in area ${stage} for ¥${stock.priceYen}. Keep using it if owned; compare the cheaper offers below before buying.`,
  })
}

function shopDecision(ctx, advice) {
  if (!advice.stage) return noAreaDecision(ctx)
  const stock = advice.currentStock
  if (!stock?.available) return absentStockDecision(ctx, advice)
  if (stock.conditional) return conditionalStockDecision(ctx, advice.stage, stock)
  const isCheapest = advice.cheapestUnconditional.some(
    (offer) => offer.id === advice.currentStock.id,
  )
  return isCheapest
    ? cheapestStockDecision(ctx, advice.stage, stock)
    : compareStockDecision(ctx, advice.stage, stock)
}

export function renderTargetAdvice(ctx, item, fish) {
  const advice = targetAdvice(ctx, item, fish)
  if (!advice) return ''
  const fishName = ctx.fishName(fish)
  const status = compatibilityText(ctx, fishName, advice.route)
  const limit = text(ctx, {
    th: 'ยืนยันเฉพาะว่าเข้าเงื่อนไขตรวจเหยื่อ ไม่ได้ยืนยันโอกาสกินเหยื่อหรือจับขึ้น',
    ja: 'エサの判定を通ることのみ確認。食いつき率・取り込みは示しません。',
    en: 'This confirms the bait check only; it does not establish bite odds or landing success.',
  })
  const markers = `data-target-advice data-target-fish="${ctx.esc(fish)}" data-target-route="${advice.route}" data-target-stage="${advice.stage || ''}"`
  return `<div class="target-advice" ${markers}><p class="target-compatibility"><strong>${ctx.esc(status)}</strong></p><p>${ctx.esc(shopDecision(ctx, advice))}</p>${alternativeList(ctx, advice)}<small>${ctx.esc(limit)}</small></div>`
}
