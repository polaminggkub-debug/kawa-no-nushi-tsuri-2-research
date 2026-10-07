import { equalPriceChoice } from '../../entities/item/index.js'

const COPY = {
  en: {
    ownBait: (route, count, wait) =>
      `${count} fish take this bait on the ${route}. Put your float on the tile the fish is on; it bites in about ${wait} seconds. If it ignores you, move the cast, not the bait.`,
    ownLure: (count) =>
      `${count} fish chase this lure. Keep tapping A or B while it is in the water, then press A once when the fish is level with the lure to hook it.`,
    fightBait: (fish) =>
      `Named for ${fish}: against that fish the fight starts with half the mistakes counted, like a named hook (the two do not stack). A cheaper bait does not give you this.`,
    fightLure: [
      'Size class: helps in the fight against fish up to 15 cm, hurts against fish over 35 cm.',
      'Size class: helps in the fight against fish of 16 to 35 cm.',
      'Size class: helps in the fight against fish over 35 cm, hurts against fish up to 15 cm.',
    ],
    float: 'float rig',
    sinker: 'sinker rig',
    buy: 'Buying new',
    cheaper: 'lower-priced shop choices with the same or broader fish coverage',
    elsewhere: 'Buying new elsewhere',
    noCheaper: 'No cheaper shop item covers the same fish, so this one is a fine buy.',
    chooseFish: 'Choose one target fish to compare its compatible baits and lures',
    notHere: (stage) => `This item has no recorded shop offer in Area ${stage}.`,
    notHereElsewhere: (stage, areas) =>
      `No offer in Area ${stage}; this item is listed in ${areas}.`,
    notHereConditional: (stage, saleStage) =>
      `No offer in Area ${stage}; its conditional offer is in Area ${saleStage}.`,
    soldHere: (stage, price) => `This item is listed in Area ${stage} for ¥${price}.`,
    soldElsewhere: (areas) => `This item is listed for sale in ${areas}.`,
    noOffer:
      'No sale for this item is recorded in the six area shop lists; the price stored in the game data does not show where to buy it.',
    conditional: (stage) =>
      `Area ${stage} offer: sell at least one Ayu from your keepnet before buying.`,
    noRouteFish: (route) => `No fish are recorded as compatible with this bait on the ${route}.`,
    switchRoute: (route) => `See fish for the ${route}`,
    noBaitFish: 'No compatible fish are recorded for this bait on either rig.',
    area: (stage) => `Area ${stage}`,
    coveragePeers: 'For the same route-specific fish lists, confirmed shop alternatives are',
    limit:
      'A bait or lure on the fish’s list bites once your float or lure is on the fish’s tile (float about 2 s, sinker about 10 s, bottom fish only). Time, weather, rod, hook and HP change nothing: if a fish ignores you, move the cast.',
    limitBait:
      'A bait on the fish’s list bites once your float is on the fish’s tile: about 2 seconds, or about 10 seconds on a sinker rig (bottom fish only). Time, weather, rod, hook and HP change nothing: if a fish ignores you, move the cast, not the bait.',
    limitLure:
      'A lure on the fish’s list is chased once the lure is on the fish’s tile and you keep tapping A or B; press A once when the fish is level with the lure to hook it. Time, weather and rod change nothing.',
  },
  ja: {
    ownBait: (route, count, wait) =>
      `${route}で${count}種がこのエサを食べます。ウキを魚と同じマスに置けば約${wait}秒で食いつきます。反応しないときはエサではなく投げる位置を変えます。`,
    ownLure: (count) =>
      `${count}種がこのルアーを追います。水中にある間はAかBを連打し、魚がルアーと同じ高さに来たらAを1回押してかけます。`,
    fightBait: (fish) =>
      `${fish}の名前を持つエサ：この魚とのファイトは開始値が半分になります（魚名つきのハリと同じ効果で、重なりません）。安いエサにはこの効果がありません。`,
    fightLure: [
      'サイズ区分：ファイトで15cm以下の魚に有利、35cm超の魚には不利。',
      'サイズ区分：ファイトで16〜35cmの魚に有利。',
      'サイズ区分：ファイトで35cm超の魚に有利、15cm以下の魚には不利。',
    ],
    float: 'ウキ',
    sinker: 'オモリ',
    buy: '新しく買うなら',
    cheaper: '同じか広い魚リストに対応する、より安い店頭品',
    elsewhere: '他のエリアで買うなら',
    noCheaper: '同じ魚をカバーする安い店売り品はないので、これを買ってよい。',
    chooseFish: '魚を1種類選び、使えるエサとルアーを比較する',
    notHere: (stage) => `エリア${stage}では、この品の店頭販売は確認されていません。`,
    notHereElsewhere: (stage, areas) =>
      `エリア${stage}では販売されていません。販売エリア：${areas}。`,
    notHereConditional: (stage, saleStage) =>
      `エリア${stage}では販売されていません。条件付き販売はエリア${saleStage}です。`,
    soldHere: (stage, price) => `エリア${stage}で${price}円で販売されています。`,
    soldElsewhere: (areas) => `${areas}で販売されています。`,
    noOffer:
      '6エリアの店頭リストに販売記録がありません。ゲームデータ内の価格だけでは、買える店とは言えません。',
    conditional: (stage) => `エリア${stage}の販売条件：購入前にびくのアユを1匹以上売ってください。`,
    noRouteFish: (route) => `このエサは${route}仕掛けで対応する魚が記録されていません。`,
    switchRoute: (route) => `${route}仕掛けの対応魚を見る`,
    noBaitFish: 'このエサはどちらの仕掛けでも対応魚が記録されていません。',
    area: (stage) => `エリア${stage}`,
    coveragePeers: '同じ仕掛け別の魚リストに対応し、店頭販売が確認された候補：',
    limit:
      '魚のリストにあるエサ・ルアーは、ウキやルアーが魚と同じマスにあれば食いつきます（ウキ約2秒、オモリ約10秒・底の魚のみ）。時間・天気・竿・ハリ・HPは関係ありません。反応しないときは投げる位置を変えます。',
    limitBait:
      'リストにあるエサは、ウキが魚と同じマスにあれば食いつきます。約2秒（オモリは約10秒、底の魚のみ）。時間・天気・竿・ハリ・HPは関係ありません。反応しないときは、エサではなく投げる位置を変えます。',
    limitLure:
      'リストにあるルアーは、魚と同じマスにあり、AかBを連打していれば追われます。魚が同じ高さに来たらAを1回押してかけます。時間・天気・竿は関係ありません。',
  },
  th: {
    ownBait: (route, count, wait) =>
      `ปลา ${count} ชนิดกินเหยื่อนี้ใน${route} วางทุ่นให้ตรงช่องที่ปลาอยู่ ปลากินภายในราว ${wait} วินาที ถ้าปลาไม่สนใจ ให้ขยับจุดปล่อย ไม่ต้องเปลี่ยนเหยื่อ`,
    ownLure: (count) =>
      `ปลา ${count} ชนิดว่ายตามลัวร์นี้ กด A หรือ B ต่อเนื่องตอนลัวร์อยู่ในน้ำ แล้วกด A หนึ่งครั้งเมื่อปลาอยู่ระดับเดียวกับลัวร์เพื่อเกี่ยวปลา`,
    fightBait: (fish) =>
      `เหยื่อระบุชื่อ${fish}: ตอนสู้กับปลานี้ค่าเริ่มสู้ลดลงครึ่งหนึ่ง เหมือนตะขอที่ระบุชื่อปลา (ไม่ซ้อนกัน) เหยื่อที่ถูกกว่าไม่ได้ข้อนี้`,
    fightLure: [
      'กลุ่มขนาด: ช่วยตอนสู้กับปลาไม่เกิน 15 ซม. เสียเปรียบกับปลาใหญ่กว่า 35 ซม.',
      'กลุ่มขนาด: ช่วยตอนสู้กับปลา 16–35 ซม.',
      'กลุ่มขนาด: ช่วยตอนสู้กับปลาใหญ่กว่า 35 ซม. เสียเปรียบกับปลาไม่เกิน 15 ซม.',
    ],
    float: 'สายทุ่น',
    sinker: 'สายตะกั่ว',
    buy: 'ถ้าจะซื้อใหม่',
    cheaper: 'ตัวเลือกในร้านที่ถูกกว่าและรองรับรายชื่อปลาเท่ากันหรือกว้างกว่า',
    elsewhere: 'ถ้าจะซื้อจากด่านอื่น',
    noCheaper: 'ไม่มีชิ้นไหนในร้านที่ถูกกว่าและกินปลาเท่ากัน ซื้อชิ้นนี้ได้เลย',
    chooseFish: 'เลือกปลาเป้าหมายเพื่อเทียบเหยื่อที่ใช้ได้กับปลาตัวนั้น',
    notHere: (stage) => `ไม่พบรายการขายชิ้นนี้ในร้านด่าน ${stage}`,
    notHereElsewhere: (stage, areas) => `ด่าน ${stage} ไม่มีขาย; มีรายการขายที่${areas}`,
    notHereConditional: (stage, saleStage) =>
      `ด่าน ${stage} ไม่มีขาย; รายการขายแบบมีเงื่อนไขอยู่ด่าน ${saleStage}`,
    soldHere: (stage, price) => `มีรายการขายชิ้นนี้ในด่าน ${stage} ราคา ¥${price}`,
    soldElsewhere: (areas) => `มีรายการขายชิ้นนี้ที่${areas}`,
    noOffer: 'ไม่พบชิ้นนี้ในรายการร้านทั้ง 6 ด่าน; ราคาในข้อมูลเกมยังไม่ยืนยันว่าซื้อได้ที่ไหน',
    conditional: (stage) =>
      `ด่าน ${stage} มีเงื่อนไขขาย: ต้องขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนซื้อ`,
    noRouteFish: (route) => `ไม่พบปลาที่บันทึกว่าใช้เหยื่อนี้ได้กับ${route}`,
    switchRoute: (route) => `ดูปลาที่ใช้ได้กับ${route}`,
    noBaitFish: 'ไม่พบปลาที่บันทึกว่าใช้เหยื่อนี้ได้ทั้งสายทุ่นและสายตะกั่ว',
    area: (stage) => `ด่าน ${stage}`,
    coveragePeers: 'ตัวเลือกที่ร้านมีขายและรองรับรายชื่อปลาเดียวกันตามสายตกนี้:',
    limit:
      'เหยื่อหรือลัวร์ที่อยู่ในรายชื่อของปลาจะถูกกินเมื่อทุ่นหรือลัวร์อยู่ช่องเดียวกับปลา (ทุ่นราว 2 วินาที ตะกั่วราว 10 วินาที เฉพาะปลาหน้าดิน) เวลา อากาศ คัน เบ็ด และ HP ไม่มีผล ถ้าปลาไม่สนใจ ให้ขยับจุดปล่อย',
    limitBait:
      'เหยื่อที่อยู่ในรายชื่อของปลาจะถูกกินเมื่อทุ่นอยู่ช่องเดียวกับปลา ราว 2 วินาที (ชุดตะกั่วราว 10 วินาที เฉพาะปลาหน้าดิน) เวลา อากาศ คัน เบ็ด และ HP ไม่มีผล ถ้าปลาไม่สนใจ ให้ขยับจุดปล่อย ไม่ใช่เปลี่ยนเหยื่อ',
    limitLure:
      'ลัวร์ที่อยู่ในรายชื่อของปลาจะมีปลาว่ายตามเมื่อปลาอยู่ช่องเดียวกับลัวร์และคุณกด A หรือ B ต่อเนื่อง พอปลาอยู่ระดับเดียวกับลัวร์ให้กด A หนึ่งครั้งเพื่อเกี่ยวปลา เวลา อากาศ และคันไม่มีผล',
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

function fightNoteMarkup(ctx, item) {
  const c = copy(ctx)
  const decision = item.baitLureDecision || {}
  const note =
    item.category === 'bait'
      ? decision.matchedFish && c.fightBait(ctx.fishName(decision.matchedFish))
      : Number.isInteger(decision.fightClass) && c.fightLure[decision.fightClass]
  return note ? `<p class="bait-lure-fight-note">${ctx.esc(note)}</p>` : ''
}

function ownUseMarkup(ctx, item) {
  const c = copy(ctx)
  const fight = fightNoteMarkup(ctx, item)
  if (item.category !== 'bait') {
    const count = (item.playerUse?.fishIds || []).length
    return `<p class="bait-lure-owned-action">${ctx.esc(c.ownLure(count))}</p>${fight}`
  }
  const fishByRoute = item.playerUse?.fishIdsByRoute
  const routeKey = ctx.baitRoute === 'sinker' ? 'sinker' : 'float'
  const routeName = routeKey === 'sinker' ? c.sinker : c.float
  const wait = routeKey === 'sinker' ? 10 : 2
  if (!Array.isArray(fishByRoute?.[routeKey]) || fishByRoute[routeKey].length) {
    const count = (fishByRoute?.[routeKey] || item.playerUse?.fishIds || []).length
    return `<p class="bait-lure-owned-action">${ctx.esc(c.ownBait(routeName, count, wait))}</p>${fight}`
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

export function baitLureEvidenceScope(ctx, category = 'all') {
  const labels = {
    all: {
      en: 'Bait and lure choices: ',
      ja: 'エサ・ルアーの選び方：',
      th: 'การเลือกเหยื่อจริงและลัวร์: ',
    },
    bait: { en: 'Baits: ', ja: 'エサ：', th: 'เหยื่อจริง: ' },
    lure: { en: 'Lures: ', ja: 'ルアー：', th: 'เหยื่อปลอม: ' },
  }
  const c = copy(ctx)
  const body = { all: c.limit, bait: c.limitBait, lure: c.limitLure }[category] || c.limit
  return ((labels[category] || labels.all)[ctx.lang] || 'Bait and lure choices: ') + body
}

export function baitLureVerdict(ctx, item, { includeScope = true } = {}) {
  if (!item?.baitLureDecision || !['bait', 'lure'].includes(item.category)) return ''
  const offers = cheaperOffers(ctx, item)
  const equal = equalPriceChoice(ctx, item, ctx.allItems, false)
  const buying = !offers.length && equal ? '' : offerSentence(ctx, item, offers)
  const ownUse = ownUseMarkup(ctx, item)
  const stock = ownStockNote(ctx, item)
  const scope = includeScope
    ? `<p class="bait-lure-evidence-limit">${ctx.esc(copy(ctx).limit)}</p>`
    : ''
  return `<div class="bait-lure-verdict" data-bait-lure-verdict="${ctx.esc(item.category + ':' + item.id)}">${ownUse}<p class="bait-lure-own-stock">${ctx.esc(stock)}</p>${buying}${equal}${scope}</div>`
}
