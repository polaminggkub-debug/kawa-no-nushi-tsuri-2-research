import { hpRecoveryAction } from '../../shared/lib/index.js'

function compatibilityGroup(ctx, entries, category, stage) {
  const group = entries.filter((entry) => entry.item.category === category)
  if (!group.length) return ''
  const title = category === 'fly' ? ctx.copy.flyCandidates : ctx.copy[category]
  const cards = group.map((entry) => ctx.itemLink(entry, stage)).join('')
  const condition = category === 'fly' ? flyGroupCondition(ctx) : ''
  return `<details class="detail-section" data-compatible-group="${category}"><summary><span class="detail-section-title" role="heading" aria-level="2">${ctx.escapeHtml(title)}</span><span class="muted">${group.length}</span></summary>${condition}<div class="detail-grid">${cards}</div></details>`
}

function flyGroupCondition(ctx) {
  return `<p data-fly-profile-only>${ctx.escapeHtml(ctx.copy.flyProfileOnly)}</p><a class="route-button" data-fly-backup-link href="#fly-backup">${ctx.escapeHtml(ctx.copy.flyBackupAction)} ↑</a>`
}

export function renderCompatibility(ctx, entries, stage) {
  const groups = ['bait', 'lure', 'fly']
    .map((category) => compatibilityGroup(ctx, entries, category, stage))
    .join('')
  return groups || `<p class="empty-state">${ctx.escapeHtml(ctx.copy.noCompatibility)}</p>`
}

function aimTip(ctx, method, stage) {
  if (!['lure', 'sinker'].includes(method)) return ''
  const text =
    ctx.locale === 'th'
      ? 'ก่อนใช้คันลัวร์หรือคันหวด เติม HP ให้ถึง 100 เพื่อให้ได้เวลาเล็งเต็มของคันนั้น ไม่ใช่โบนัสโอกาสปลากิน'
      : ctx.locale === 'ja'
        ? 'ルアー竿・投げ竿を使う前にHPを100まで回復すると、竿本来の照準時間になります。食いつき率のボーナスではありません。'
        : 'Restore HP to 100 before lure or casting fishing to get the rod’s full aim window. This does not add a bite-rate bonus.'
  const action = hpRecoveryAction({
    locale: ctx.locale,
    cataloguePath: ctx.cataloguePath(),
    stage,
    returnPath: `${ctx.currentFishPath(stage)}#starter-${method}`,
    source: `fish-${method}`,
    escapeHtml: ctx.escapeHtml,
  })
  return `<p class="aim-tip">${ctx.escapeHtml(text)}</p><p>${action}</p>`
}

function starterLink(ctx, offer, stage) {
  const item = offer.entry.item
  const query = new URLSearchParams({
    category: item.category,
    id: item.id,
    fish: ctx.id,
    stage,
    return: ctx.currentFishPath(stage) + '#starter-' + offer.method,
  })
  if (['float', 'sinker'].includes(offer.method)) query.set('route', offer.method)
  return `${ctx.itemPath()}?${query}`
}

function starterItem(ctx, offer, stage, text) {
  const item = offer.entry.item
  const bundle = offer.bundle ? ` · ${ctx.escapeHtml(text.bundle)}` : ''
  return `<a class="entity-link" href="${ctx.escapeHtml(starterLink(ctx, offer, stage))}"><img src="${ctx.escapeHtml(item.image)}" alt=""><span><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><small>${ctx.escapeHtml(text.cost)} ¥${offer.price}${bundle}</small></span></a>`
}

function starterCard(ctx, offer, stage, allItems, text) {
  const method = offer.method
  const item = offer.entry.item
  const rig = ctx.renderRigForMethod(method, stage, allItems, offer.price)
  const aim = aimTip(ctx, method, stage)
  const fly = offer.bundle ? `<p class="muted">${ctx.escapeHtml(text.fly)}</p>` : ''
  const link = starterLink(ctx, offer, stage)
  const total = rig.match(/data-rig-total="(\d+)"/)?.[1]
  const rod = ctx.renderRodForMethod(method, stage, allItems, offer.price, Number(total))
  const summaryTotal = total || rod.match(/data-method-setup-total="(\d+)"/)?.[1]
  const summary = starterSummary(ctx, offer, summaryTotal)
  const open = ctx.requestedMethod === method ? ' open' : ''
  return `<details class="detail-section starter-offer" id="starter-${method}" data-method="${method}" data-item="${item.category}:${item.id}" data-price="${offer.price}"${open}><summary>${summary}</summary>${starterItem(ctx, offer, stage, text)}${rod}${rig}${aim}${fly}<a class="route-button" href="${ctx.escapeHtml(link)}">${ctx.escapeHtml(text.buy)} ↗</a></details>`
}

function starterSummary(ctx, offer, total) {
  const bait = ctx.localizedItemName(offer.entry.item)
  const fullCost = total ? starterTotalText(ctx, total) : ''
  const bundle = offer.bundle ? starterBundleText(ctx) : ''
  return `<strong>${ctx.escapeHtml(offer.label)}:</strong> ${ctx.escapeHtml(bait)} · ${bundle}¥${offer.price}${fullCost}`
}

function starterBundleText(ctx) {
  if (ctx.locale === 'th') return 'ชุดฟลายสำเร็จรูป '
  if (ctx.locale === 'ja') return '完成フライセット '
  return 'Ready-made fly set '
}

function starterTotalText(ctx, total) {
  if (ctx.locale === 'th') return ` · ซื้อใหม่ครบชุด ¥${total}`
  if (ctx.locale === 'ja') return ` · 竿と仕掛け一式 ${total}円`
  return ` · Complete new setup ¥${total}`
}

function starterCards(ctx, offers, stage, allItems, text) {
  return offers.map((offer) => starterCard(ctx, offer, stage, allItems, text)).join('')
}

function selectedArea(ctx, locations, stage, text) {
  const selected =
    locations.find((location) => String(location.stage) === String(stage)) || locations[0]
  const name = selected.stageName?.[ctx.locale] || selected.stageName?.en || ''
  return `<p class="shopping-area-context"><strong>${ctx.escapeHtml(text.area)}:</strong> ${ctx.escapeHtml(ctx.copy.stage(selected.stage))} · ${ctx.escapeHtml(name)}</p>`
}

function methodEntries(entries, method) {
  return entries.filter((entry) =>
    ['float', 'sinker'].includes(method)
      ? entry.item.category === 'bait' && entry.routes.includes(method)
      : entry.item.category === method,
  )
}

function shopPage(ctx) {
  return ctx.locale === 'th'
    ? 'shops.th.html'
    : ctx.locale === 'ja'
      ? 'shops.ja.html'
      : 'shops.html'
}

function offerLink(ctx, method, entry, stage, saleStage, anchor = '#all-compatible') {
  const item = entry.item
  const currentFish = `${ctx.currentFishPath(stage)}${anchor}`
  const query = new URLSearchParams({
    stage: String(saleStage),
    category: item.category,
    id: item.id,
    fish: ctx.id,
    return: currentFish,
  })
  if (['float', 'sinker'].includes(method)) query.set('route', method)
  return `${shopPage(ctx)}?${query.toString()}`
}

function compatibleItemLink(ctx, method, entry, stage) {
  const item = entry.item
  const query = new URLSearchParams({
    category: item.category,
    id: item.id,
    fish: ctx.id,
    stage: String(stage),
    return: `${ctx.currentFishPath(stage)}#all-compatible`,
  })
  if (['float', 'sinker'].includes(method)) query.set('route', method)
  return `${ctx.itemPath()}?${query.toString()}`
}

function recordedSales(entries, method) {
  return entries
    .flatMap((entry) =>
      (entry.item.playerUse?.shops || [])
        .filter((shop) => !shop.condition)
        .map((shop) => ({ entry, shop, method })),
    )
    .sort(
      (a, b) =>
        (salePrice(a) ?? Number.MAX_SAFE_INTEGER) - (salePrice(b) ?? Number.MAX_SAFE_INTEGER) ||
        Number(a.shop.stage) - Number(b.shop.stage) ||
        a.entry.item.id.localeCompare(b.entry.item.id),
    )
}

function salePrice(offer) {
  return offer.entry.item.category === 'fly'
    ? offer.shop.bundle?.shopPriceYen
    : offer.entry.item.priceYen
}

function localConditionalSale(entries, stage) {
  return entries
    .flatMap((entry) =>
      (entry.item.playerUse?.shops || [])
        .filter((shop) => String(shop.stage) === String(stage) && shop.condition)
        .map((shop) => ({ entry, shop })),
    )
    .sort((a, b) => a.entry.item.id.localeCompare(b.entry.item.id))[0]
}

function missingMethodCopy(ctx, method, stage, count) {
  const label = ctx.copy[method]
  if (ctx.locale === 'th')
    return {
      title: `${label}: ไม่มีรายการขายปกติที่บันทึกใน${ctx.copy.stage(stage)}`,
      owned: `พบ ${count} ไอเท็มที่ผ่านเงื่อนไขชนิดเหยื่อของปลานี้ ถ้ามีอยู่แล้ว ใช้ต่อได้เลย`,
      sale: (area, item, price) => `ดูรายการขายที่บันทึกในด่าน ${area}: ${item}${price}`,
      conditional: (item) => `ตรวจรายการขายแบบมีเงื่อนไขในด่านนี้: ${item}`,
      detail: (item) => `เปิดรายละเอียดเพื่อดูข้อมูลการหา: ${item}`,
      noSales: 'ไม่พบรายการขายที่บันทึกไว้ในร้านของทุกด่าน',
    }
  if (ctx.locale === 'ja')
    return {
      title: `${label}：${ctx.copy.stage(stage)}の通常販売記録なし`,
      owned: `この魚の判定を通る道具が${count}種類あります。対応する道具を持っているなら、そのまま使えます。`,
      sale: (area, item, price) => `販売記録のあるエリア${area}を見る：${item}${price}`,
      conditional: (item) => `このエリアの条件付き販売を確認：${item}`,
      detail: (item) => `入手情報を見る：${item}`,
      noSales: '全エリアの店売り記録は見つかりません。',
    }
  return {
    title: `${label}: no regular sale recorded in ${ctx.copy.stage(stage)}`,
    owned: `${count} compatible item profiles pass this fish’s recorded check. Use one if you already own it.`,
    sale: (area, item, price) => `See the recorded sale in Area ${area}: ${item}${price}`,
    conditional: (item) => `Check this area’s conditional offer: ${item}`,
    detail: (item) => `Open item details for acquisition notes: ${item}`,
    noSales: 'No shop sale record was found in any area.',
  }
}

function missingMethodAction(ctx, method, entries, stage) {
  const conditional = localConditionalSale(entries, stage)
  const sales = recordedSales(entries, method)
  const fallback = sales[0]
  const copy = missingMethodCopy(ctx, method, stage, entries.length)
  const actions = []
  if (conditional) {
    const item = conditional.entry.item
    const href = offerLink(ctx, method, conditional.entry, stage, stage)
    actions.push(
      `<a class="route-button" data-conditional-sale href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy.conditional(ctx.localizedItemName(item)))}</a>`,
    )
  }
  if (fallback) {
    const item = fallback.entry.item
    const amount = salePrice(fallback)
    const price = Number.isFinite(amount) ? ` · ¥${amount}` : ''
    const href = offerLink(ctx, method, fallback.entry, stage, fallback.shop.stage)
    actions.push(
      `<a class="route-button" data-recorded-sale href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy.sale(fallback.shop.stage, `${ctx.localizedItemName(item)} (ID ${item.id})`, price))} ↗</a>`,
    )
  } else if (!conditional) {
    const entry = entries[0]
    const href = compatibleItemLink(ctx, method, entry, stage)
    actions.push(
      `<a class="route-button" data-acquisition-details href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy.detail(`${ctx.localizedItemName(entry.item)} (ID ${entry.item.id})`))} ↗</a>`,
    )
  }
  const noSales =
    !fallback && !conditional ? `<p class="muted">${ctx.escapeHtml(copy.noSales)}</p>` : ''
  return `<article class="detail-section method-no-local-stock" data-method-no-local="${method}"><h3>${ctx.escapeHtml(copy.title)}</h3><p>${ctx.escapeHtml(copy.owned)}</p>${noSales}<div class="method-stock-actions">${actions.join('')}</div></article>`
}

function missingMethodActions(ctx, entries, offers, stage) {
  const methods = ['float', 'sinker', 'lure', 'fly']
  const stocked = new Set(offers.map((offer) => offer.method))
  return methods
    .filter((method) => !stocked.has(method))
    .map((method) => {
      const supported = methodEntries(entries, method)
      return supported.length ? missingMethodAction(ctx, method, supported, stage) : ''
    })
    .join('')
}

export function renderShopping(ctx, entries, locations, stage, allItems, flyChoices) {
  if (!locations.length) return ''
  const text = ctx.shoppingCopy
  const offers = ctx.starterOffers(entries, stage)
  const cards = starterCards(ctx, offers, stage, allItems, text)
  const noOffer = offers.length ? '' : `<p>${ctx.escapeHtml(text.none)}</p>`
  const missingMethods = missingMethodActions(ctx, entries, offers, stage)
  const area = selectedArea(ctx, locations, stage, text)
  const kit = ctx.renderReusableKit(allItems, stage)
  const fallback = ctx.renderFlyFallback(allItems, stage, flyChoices)
  return `<section id="fish-shopping" class="detail-section shopping-plan"><h2>${ctx.escapeHtml(text.title)}</h2>${area}<p>${ctx.escapeHtml(text.intro)}</p>${offers.length ? `<div class="detail-grid">${cards}</div>` : noOffer}${missingMethods ? `<div class="detail-grid missing-method-grid">${missingMethods}</div>` : ''}<p class="muted">${ctx.escapeHtml(text.scope)}</p><a href="#all-compatible">${ctx.escapeHtml(text.all)} ↓</a>${kit}${fallback}</section>`
}
