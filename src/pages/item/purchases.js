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
  return parts.sort((a, b) => a.stage - b.stage || a.bundle.shopPriceYen - b.bundle.shopPriceYen)
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

export function shopSection(ctx, item, allItems, fishLocations) {
  const shops = item.playerUse?.shops || []
  const isFly = ['fly', 'fly_wing', 'fly_tail'].includes(item.category)
  if (isFly) {
    const assemblies = ctx.flyAssemblies(item, allItems)
    if (!assemblies.length)
      return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2><p class="muted">${ctx.esc(ctx.copy.noShop)}</p></section>`
    return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${item.category !== 'fly' ? `<p>${ctx.esc(ctx.copy.usedIn)}</p>` : ''}<div class="detail-grid">${assemblies
      .map(({ stage, bundle }) => {
        const refs = [
          ['fly', bundle.body],
          ['fly_wing', bundle.wing],
          ['fly_tail', bundle.tail],
        ]
          .filter(([, id]) => id && id !== '00')
          .map(([c, id]) => allItems.find((i) => i.category === c && i.id === id))
          .filter(Boolean)
        return `<article class="detail-section"><h3>${ctx.esc(ctx.copy.bundleAt(stage))}</h3><p><strong>${ctx.esc(ctx.copy.completePrice)} · ${ctx.esc(ctx.copy.price(bundle.shopPriceYen))}</strong></p><div class="detail-grid">${refs.map((part) => ctx.componentLink(part)).join('')}</div>${ctx.stageButton(stage, fishLocations)}<p class="muted">${ctx.esc(ctx.copy.mapNote)}</p></article>`
      })
      .join('')}</div></section>`
  }
  if (!shops.length)
    return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2><p class="muted">${ctx.esc(ctx.copy.noShop)}</p></section>`
  const stageRows = [
    ...new Set(shops.map((s) => Number(s.stage)).filter((n) => n >= 1 && n <= 6)),
  ].sort((a, b) => a - b)
  return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${item.priceYen != null ? `<p><strong>${ctx.esc(ctx.copy.price(item.priceYen))}</strong> <span class="muted">· ${ctx.esc(ctx.copy.stockAt)} · ${ctx.esc(ctx.copy.priceFromRom)}</span></p>` : ''}<div class="detail-grid">${stageRows
    .map((stage) => {
      const offer = shops.find((s) => Number(s.stage) === stage)
      const seller =
        offer?.shop === 'special_rod_shop'
          ? ctx.lang === 'th'
            ? 'ร้านคันเบ็ดพิเศษในเมือง'
            : ctx.lang === 'ja'
              ? '町の専用竿店'
              : 'Special rod shop'
          : ctx.lang === 'th'
            ? 'ร้านในด่านนี้'
            : ctx.lang === 'ja'
              ? 'エリア内の店'
              : 'Store stock in this area'
      return `<article class="detail-section"><h3>${ctx.esc(ctx.stageName(stage, fishLocations))}</h3><p>${ctx.esc(seller)}${item.priceYen != null ? ` · ${ctx.esc(ctx.copy.price(item.priceYen))}` : ''}</p>${ctx.shopCondition(item, offer, fishLocations)}${ctx.stageButton(stage, fishLocations)}</article>`
    })
    .join('')}</div><p class="muted">${ctx.esc(ctx.copy.mapNote)}</p></section>`
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
