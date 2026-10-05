import { foodChoicePanel } from './food-choice.js'
import { fishMealRecovery } from './fish-meal-recovery.js'

function selectedStage(ctx) {
  const stage = Number(ctx.selectedStage)
  return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0
}

function selectedAreaLabel(ctx) {
  return {
    th: 'ด่านที่เลือก',
    ja: '選択中のエリア',
    en: 'Selected area',
  }[ctx.lang]
}

function missingAreaNote(ctx, stage, isFly, hasOtherAreas) {
  const area = ctx.copy.shopArea(stage)
  const kind = isFly
    ? {
        th: 'ชุดฟลายสำเร็จรูป',
        ja: '店売り毛バリセット',
        en: 'ready-made fly sets',
      }[ctx.lang]
    : {
        th: 'รายการขายไอเท็มนี้',
        ja: 'この道具の店頭在庫',
        en: 'offers for this item',
      }[ctx.lang]
  const message = hasOtherAreas
    ? {
        th: `ไม่พบ${kind}ที่บันทึกไว้ใน${area}; แสดงด่านอื่นที่มีรายการไว้ด้านล่าง`,
        ja: `${area}に${kind}の記録はありません。記録のある他エリアを下に表示しています。`,
        en: `No ${kind} are recorded in ${area}; other areas with a recorded offer are listed below.`,
      }[ctx.lang]
    : {
        th: `ไม่พบ${kind}ที่บันทึกไว้ใน${area} หรือด่านอื่นจากข้อมูล ROM ที่ตรวจ`,
        ja: `確認したROMデータには${area}にも他エリアにも${kind}の記録がありません。`,
        en: `No ${kind} are recorded in ${area} or any other area in the checked ROM data.`,
      }[ctx.lang]
  return `<p class="muted selected-area-missing-note" data-selected-area-missing="true">${ctx.esc(message)}</p>`
}

function noRecordedStockNote(ctx, stage, isFly) {
  return stage
    ? missingAreaNote(ctx, stage, isFly, false)
    : `<p class="muted">${ctx.esc(ctx.copy.noShop)}</p>`
}

function selectedAreaBadge(ctx, stage) {
  return Number(stage) === selectedStage(ctx)
    ? ` <span class="detail-badge" data-selected-area-badge>${ctx.esc(selectedAreaLabel(ctx))}</span>`
    : ''
}

export function flyAssemblies(ctx, item, allItems) {
  const id = item.id,
    parts = []
  for (const body of allItems.filter((i) => i.category === 'fly'))
    for (const shop of body.playerUse?.shops || []) {
      const b = shop.bundle
      if (!b) continue
      const belongs =
        (item.category === 'fly' && b.body === id) ||
        (item.category === 'fly_wing' && b.wing === id) ||
        (item.category === 'fly_tail' && b.tail === id)
      if (!belongs) continue
      const key = [shop.stage, b.body, b.wing, b.tail, b.shopPriceYen].join('|')
      if (parts.some((p) => p.key === key)) continue
      parts.push({ key, stage: Number(shop.stage), bundle: b, body })
    }
  const selected = selectedStage(ctx)
  return parts.sort(
    (a, b) =>
      Number(b.stage === selected) - Number(a.stage === selected) ||
      a.stage - b.stage ||
      a.bundle.shopPriceYen - b.bundle.shopPriceYen,
  )
}

export function shopCondition(ctx, item, offer, fishLocations) {
  if (!offer?.condition) return ''
  const knownAyuCondition =
    item.category === 'bait' &&
    item.id === '17' &&
    offer.condition.includes('sell at least one Ayu')
  const message = knownAyuCondition ? ctx.copy.ayuOffer : ctx.copy.unknownShopCondition
  const action = knownAyuCondition
    ? `<a class="route-button" href="${ctx.esc(ctx.fishProfileLink('38', fishLocations))}">${ctx.esc(ctx.lang === 'th' ? 'ดูจุดตกและเหยื่อสำหรับปลาอายุ' : ctx.lang === 'ja' ? 'アユの釣り場と対応エサを見る' : 'Find Ayu fishing spots and compatible bait')} ↗</a>`
    : ''
  return `<p class="shop-condition"><strong>${ctx.esc(ctx.copy.unlock)}</strong> ${ctx.esc(message)}</p>${action}`
}

function flyPurchaseCard(ctx, bundle, stage, allItems, fishLocations, selected) {
  const refs = [
    ['fly', bundle.body],
    ['fly_wing', bundle.wing],
    ['fly_tail', bundle.tail],
  ]
    .filter(([, id]) => id && id !== '00')
    .map(([category, id]) => allItems.find((i) => i.category === category && i.id === id))
    .filter(Boolean)
  const isSelected = stage === selected
  return `<article class="detail-section" data-purchase-stage="${stage}"${isSelected ? ' data-selected-area-offer="true"' : ''}><h3>${ctx.esc(ctx.copy.bundleAt(stage))}${selectedAreaBadge(ctx, stage)}</h3><p><strong>${ctx.esc(ctx.copy.completePrice)} · ${ctx.esc(ctx.copy.price(bundle.shopPriceYen))}</strong></p><div class="detail-grid">${refs.map((part) => ctx.componentLink(part)).join('')}</div>${ctx.stageButton(stage, fishLocations)}<p class="muted">${ctx.esc(ctx.copy.mapNote)}</p></article>`
}

function flyPurchaseSection(ctx, item, allItems, fishLocations, selected) {
  const assemblies = ctx.flyAssemblies(item, allItems)
  if (!assemblies.length)
    return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${noRecordedStockNote(ctx, selected, true)}</section>`
  const hasSelectedAssembly = assemblies.some(({ stage }) => stage === selected)
  const note = selected && !hasSelectedAssembly ? missingAreaNote(ctx, selected, true, true) : ''
  const usedIn = item.category !== 'fly' ? `<p>${ctx.esc(ctx.copy.usedIn)}</p>` : ''
  const cards = assemblies
    .map(({ stage, bundle }) =>
      flyPurchaseCard(ctx, bundle, stage, allItems, fishLocations, selected),
    )
    .join('')
  return `<section id="fly-purchases" class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${usedIn}${note}<div class="detail-grid">${cards}</div></section>`
}

function shopSeller(ctx, offer) {
  if (offer?.shop === 'special_rod_shop')
    return ctx.lang === 'th'
      ? 'ร้านคันเบ็ดพิเศษในเมือง'
      : ctx.lang === 'ja'
        ? '町の専用竿店'
        : 'Special rod shop'
  return ctx.lang === 'th'
    ? 'ร้านในด่านนี้'
    : ctx.lang === 'ja'
      ? 'エリア内の店'
      : 'Store stock in this area'
}

function shopOfferCard(ctx, item, stage, offer, fishLocations, selected) {
  const isSelected = stage === selected
  const itemPrice = item.priceYen != null ? ` · ${ctx.esc(ctx.copy.price(item.priceYen))}` : ''
  return `<article class="detail-section" data-purchase-stage="${stage}"${isSelected ? ' data-selected-area-offer="true"' : ''}><h3>${ctx.esc(ctx.stageName(stage, fishLocations))}${selectedAreaBadge(ctx, stage)}</h3><p>${ctx.esc(shopSeller(ctx, offer))}${itemPrice}</p>${ctx.shopCondition(item, offer, fishLocations)}${ctx.stageButton(stage, fishLocations)}</article>`
}

function ordinaryPurchaseSection(ctx, item, fishLocations, selected) {
  const shops = item.playerUse?.shops || []
  if (!shops.length)
    return `<section id="item-shops" class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${noRecordedStockNote(ctx, selected, false)}</section>`
  const stages = [
    ...new Set(shops.map((shop) => Number(shop.stage)).filter((stage) => stage >= 1 && stage <= 6)),
  ].sort((a, b) => Number(b === selected) - Number(a === selected) || a - b)
  const hasSelectedOffer = stages.includes(selected)
  const note =
    selected && !hasSelectedOffer ? missingAreaNote(ctx, selected, false, stages.length > 0) : ''
  const price =
    item.priceYen != null
      ? `<p><strong>${ctx.esc(ctx.copy.price(item.priceYen))}</strong> <span class="muted">· ${ctx.esc(ctx.copy.stockAt)}</span></p>`
      : ''
  const cards = stages
    .map((stage) =>
      shopOfferCard(
        ctx,
        item,
        stage,
        shops.find((shop) => Number(shop.stage) === stage),
        fishLocations,
        selected,
      ),
    )
    .join('')
  return `<section id="item-shops" class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${price}${note}<div class="detail-grid">${cards}</div><p class="muted">${ctx.esc(ctx.copy.mapNote)}</p></section>`
}

export function shopSection(ctx, item, allItems, fishLocations) {
  if (
    item.category === 'general_tool' &&
    item.id === '05' &&
    item.playerUse?.startingEquipment?.type === 'starting_equipment' &&
    !item.playerUse?.shops?.length
  )
    return ''
  const selected = selectedStage(ctx)
  if (item.category === 'food' && item.id === '08') return fishMealRecovery(ctx, selected)
  if (['fly', 'fly_wing', 'fly_tail'].includes(item.category))
    return flyPurchaseSection(ctx, item, allItems, fishLocations, selected)
  return ordinaryPurchaseSection(ctx, item, fishLocations, selected)
}

export function buyingDecision(ctx, item, allItems, decisions) {
  const rodPaths = {
    1: 'float_rod_path',
    2: 'casting_rod_path',
    4: 'lure_rod_path',
    8: 'fly_rod_path',
  }
  const path =
    item.category === 'rod'
      ? rodPaths[item.decodedFields?.styleCode]
      : item.category === 'hook'
        ? 'hook_purchase_caution'
        : ''
  const sections = decisions.filter((section) =>
    path
      ? section.id === path
      : !ctx.selectedFish &&
        section.category === item.category &&
        ['lure', 'food'].includes(item.category) &&
        (section.items || []).some((ref) => ref.category === item.category && ref.id === item.id),
  )
  if (!sections.length) return ''
  if (item.category === 'food') return foodChoicePanel(ctx, item, allItems, sections)
  return `<section class="detail-section buying-decision"><h2>${ctx.lang === 'th' ? 'ควรซื้อหรือเปลี่ยนมาใช้อันนี้ไหม?' : ctx.lang === 'ja' ? '買う・替えるべき？' : 'Should I buy or switch to this?'}</h2>${sections
    .map((section) => {
      const refs = (section.items || [])
        .filter((ref) => ref.category === item.category && ref.id !== item.id)
        .map((ref) => allItems.find((i) => i.category === ref.category && i.id === ref.id))
        .filter(Boolean)
      return `<h3>${ctx.esc(ctx.local(section.title))}</h3><p>${ctx.esc(ctx.local(section.recommendation))}</p>${refs.length ? `<div class="detail-grid">${refs.map((ref) => ctx.componentLink(ref)).join('')}</div>` : ''}<p class="muted">${ctx.esc(ctx.local(section.scope))}</p>`
    })
    .join('')}</section>`
}
