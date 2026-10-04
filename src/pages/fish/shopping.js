function compatibilityGroup(ctx, entries, category, stage) {
  const group = entries.filter((entry) => entry.item.category === category)
  if (!group.length) return ''
  const title = ctx.copy[category]
  const cards = group.map((entry) => ctx.itemLink(entry, stage)).join('')
  return `<details class="detail-section"><summary><span class="detail-section-title" role="heading" aria-level="2">${ctx.escapeHtml(title)}</span><span class="muted">${group.length}</span></summary><div class="detail-grid">${cards}</div></details>`
}

export function renderCompatibility(ctx, entries, stage) {
  const groups = ['bait', 'lure', 'fly']
    .map((category) => compatibilityGroup(ctx, entries, category, stage))
    .join('')
  return groups || `<p class="empty-state">${ctx.escapeHtml(ctx.copy.noCompatibility)}</p>`
}

function aimTip(ctx, method) {
  if (!['lure', 'sinker'].includes(method)) return ''
  const text =
    ctx.locale === 'th'
      ? 'ก่อนใช้คันลัวร์หรือคันหวด เติม HP ให้ถึง 100 เพื่อให้ได้เวลาเล็งเต็มของคันนั้น ไม่ใช่โบนัสโอกาสปลากิน'
      : ctx.locale === 'ja'
        ? 'ルアー竿・投げ竿を使う前にHPを100まで回復すると、竿本来の照準時間になります。食いつき率のボーナスではありません。'
        : 'Restore HP to 100 before lure or casting fishing to get the rod’s full aim window. This does not add a bite-rate bonus.'
  return `<p class="aim-tip">${ctx.escapeHtml(text)}</p>`
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
  const rod = ctx.renderRodForMethod(method, stage, allItems)
  const rig = ctx.renderRigForMethod(method, stage, allItems, offer.price)
  const aim = aimTip(ctx, method)
  const fly = offer.bundle ? `<p class="muted">${ctx.escapeHtml(text.fly)}</p>` : ''
  const link = starterLink(ctx, offer, stage)
  const total = rig.match(/data-rig-total="(\d+)"/)?.[1]
  const summary = starterSummary(ctx, offer, total)
  const open = ctx.requestedMethod === method ? ' open' : ''
  return `<details class="detail-section starter-offer" id="starter-${method}" data-method="${method}" data-item="${item.category}:${item.id}" data-price="${offer.price}"${open}><summary>${summary}</summary>${starterItem(ctx, offer, stage, text)}${rod}${rig}${aim}${fly}<a class="route-button" href="${ctx.escapeHtml(link)}">${ctx.escapeHtml(text.buy)} ↗</a></details>`
}

function starterSummary(ctx, offer, total) {
  const bait = ctx.localizedItemName(offer.entry.item)
  const fullCost = total ? starterTotalText(ctx, total) : ''
  return `<strong>${ctx.escapeHtml(offer.label)}:</strong> ${ctx.escapeHtml(bait)} · ¥${offer.price}${fullCost}`
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

export function renderShopping(ctx, entries, locations, stage, allItems, flyChoices) {
  if (!locations.length) return ''
  const text = ctx.shoppingCopy
  const offers = ctx.starterOffers(entries, stage)
  const cards = starterCards(ctx, offers, stage, allItems, text)
  const noOffer = offers.length ? '' : `<p>${ctx.escapeHtml(text.none)}</p>`
  const area = selectedArea(ctx, locations, stage, text)
  const kit = ctx.renderReusableKit(allItems, stage)
  const fallback = ctx.renderFlyFallback(allItems, stage, flyChoices)
  return `<section class="detail-section shopping-plan"><h2>${ctx.escapeHtml(text.title)}</h2>${area}<p>${ctx.escapeHtml(text.intro)}</p>${offers.length ? `<div class="detail-grid">${cards}</div>` : noOffer}<p class="muted">${ctx.escapeHtml(text.scope)}</p><a href="#all-compatible">${ctx.escapeHtml(text.all)} ↓</a>${kit}${fallback}</section>`
}
