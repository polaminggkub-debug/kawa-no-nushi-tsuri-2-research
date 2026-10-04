import { targetAdviceSection } from './target-advice.js'
function renderFishTarget(ctx, fishVisuals, fishLocations) {
  if (!ctx.selectedFish) return ''
  const fish = fishVisuals[ctx.selectedFish]
  const name = ctx.fishName(ctx.selectedFish, fishVisuals)
  const profile = ctx.fishProfileLink(ctx.selectedFish, fishLocations)
  const mapStage = fishLocations[ctx.selectedFish]?.locations?.some(
    (location) => Number(location.stage) === ctx.selectedStage,
  )
    ? ctx.selectedStage
    : fishLocations[ctx.selectedFish]?.locations?.[0]?.stage
  const image = fish?.image
    ? `<a href="${ctx.esc(profile)}" aria-label="${ctx.esc(ctx.copy.fishProfile)}"><img class="detail-target-fish" src="${ctx.esc(fish.image)}" alt="${ctx.esc(name)}"></a>`
    : ''
  const map = mapStage
    ? ` <a class="route-button" href="${ctx.esc(ctx.mapLink(mapStage, ctx.selectedFish))}">${ctx.esc(ctx.copy.mapFish)}</a>`
    : ''
  return `<aside class="detail-section play-target"><strong>${ctx.esc(ctx.copy.target)} · ${ctx.esc(name)} (${ctx.esc(ctx.selectedFish)})</strong>${image}<p><a class="route-button" href="${ctx.esc(profile)}">${ctx.esc(ctx.copy.fishProfile)}</a>${map}</p></aside>`
}

function selectedBaitRoute(ctx, item) {
  const routes = item.playerUse?.fishIdsByRoute || {}
  if (
    item.category !== 'bait' ||
    !ctx.selectedFish ||
    !ctx.selectedRoute ||
    !Object.hasOwn(routes, ctx.selectedRoute)
  )
    return null
  return ctx.selectedRoute
}

function renderBaitTarget(ctx, item, fishVisuals, fishLocations) {
  const routes = item.playerUse?.fishIdsByRoute || {}
  const route = selectedBaitRoute(ctx, item)
  if (!route) return ''
  const accepted = (routes[route] || []).includes(ctx.selectedFish)
  const alternate = route === 'float' ? 'sinker' : 'float'
  const switchRoute = !accepted && (routes[alternate] || []).includes(ctx.selectedFish)
  const query = new URLSearchParams(location.search)
  query.set('route', alternate)
  const routeCopy = route === 'float' ? ctx.copy.routeFloat : ctx.copy.routeSinker
  const name = ctx.fishName(ctx.selectedFish, fishVisuals)
  const status = accepted
    ? ctx.lang === 'th'
      ? 'เหยื่อนี้ผ่านเงื่อนไขของปลาที่เลือกด้วยชุดนี้ ถ้ามีอยู่แล้วใช้ต่อได้'
      : ctx.lang === 'ja'
        ? 'この仕掛けでは選択した魚のエサ判定を通る。持っているならそのまま使える。'
        : 'This bait passes the selected fish’s check with this rig. Keep using it if you have it.'
    : ctx.lang === 'th'
      ? 'เหยื่อนี้ไม่ผ่านเงื่อนไขของปลาที่เลือกด้วยชุดนี้ อย่าซื้อเพื่อใช้กับชุดนี้'
      : ctx.lang === 'ja'
        ? 'この仕掛けでは選択した魚のエサ判定を通らない。この目的で購入しない。'
        : 'This bait does not pass the selected fish’s check with this rig. Do not buy it for this setup.'
  const switchText =
    ctx.lang === 'th'
      ? `เหยื่อเดิมใช้กับปลานี้ได้เมื่อเปลี่ยนเป็น${alternate === 'float' ? 'ชุดทุ่น' : 'ชุดตะกั่ว'}`
      : ctx.lang === 'ja'
        ? `同じエサを使うなら${alternate === 'float' ? 'ウキ' : 'オモリ'}仕掛けへ`
        : `Use this bait by switching to the ${alternate === 'float' ? 'float' : 'sinker'} rig`
  const switchLink = switchRoute
    ? `<a class="route-button" data-switch-bait-route href="${ctx.esc(ctx.localePage[ctx.lang] + '?' + query)}">${ctx.esc(switchText)} ↗</a>`
    : ''
  const profileLink = !accepted
    ? ` <a class="route-button" href="${ctx.esc(ctx.fishProfileLink(ctx.selectedFish, fishLocations))}">${ctx.esc(ctx.copy.fishProfile)}</a>`
    : ''
  return `<section class="detail-section bait-target-action" data-bait-target-action="${accepted ? 'accepted' : 'rejected'}"><h2>${ctx.esc(routeCopy)} · ${ctx.esc(name)}</h2><p>${ctx.esc(status)}</p>${switchLink}${profileLink}</section>`
}

function renderItemHero(ctx, item, name, categoryText) {
  const image = `<a class="detail-portrait-link" href="${ctx.esc(item.frame || item.image)}" target="_blank" rel="noopener" aria-label="${ctx.esc(ctx.copy.openFrame)}"><img class="detail-portrait" src="${ctx.esc(item.image)}" alt="${ctx.esc(name)}" fetchpriority="high"></a>`
  const japanese =
    item.nameJa && ctx.lang !== 'ja' ? `<p class="muted" lang="ja">${ctx.esc(item.nameJa)}</p>` : ''
  const identity = `<div class="detail-identity"><p class="detail-kicker">${ctx.esc(categoryText)}</p><h1>${ctx.esc(name)}</h1>${japanese}<div class="detail-badges"><span class="detail-badge id">${ctx.esc(ctx.copy.itemId)} ${ctx.esc(item.id)}</span></div></div>`
  return `<section class="detail-hero item-hero">${image}${identity}</section>`
}

function rodDecisionTitle(ctx, item) {
  if (item.category === 'rod') {
    if (ctx.lang === 'th') return 'ควรเลือกคันนี้เมื่อไร?'
    if (ctx.lang === 'ja') return 'この竿を選ぶときは？'
    return 'When should I choose this rod?'
  }
  if (ctx.lang === 'th') return 'ควรซื้อหรือใช้ชิ้นนี้เมื่อไร?'
  if (ctx.lang === 'ja') return 'この道具を買う・使うときは？'
  return 'When should I buy or use this?'
}

function decisionReasonTitle(ctx, hasDecision) {
  if (!hasDecision) return ctx.copy.details
  if (ctx.lang === 'th') return 'เหตุผลที่เลือกหรือใช้ต่อ'
  if (ctx.lang === 'ja') return '選ぶ・使い続ける理由'
  return 'Why choose or keep it'
}

function decisionFacts(ctx, item, allItems) {
  const decision = item.rodDecision || item.gearDecision || item.baitLureDecision
  const alternatives = decision?.alternatives || []
  const items = alternatives
    .map((ref) => allItems.find((item) => item.category === ref.category && item.id === ref.id))
    .filter(Boolean)
  return items.length
    ? `<div class="detail-grid rod-alternatives">${items.map((item) => ctx.componentLink(item)).join('')}</div>`
    : ''
}

function renderDecisionSection(
  ctx,
  item,
  summary,
  facts,
  imageNote,
  allItems,
  fishVisuals,
  fishLocations,
) {
  const decision = item.rodDecision || item.gearDecision || item.baitLureDecision
  const isRod = item.category === 'rod'
  const factList = facts.length
    ? `<h3>${ctx.esc(decisionReasonTitle(ctx, Boolean(decision)))}</h3><ul>${facts.map((fact) => `<li>${ctx.esc(fact)}</li>`).join('')}</ul>`
    : ''
  const verdict = decision ? `<p class="rod-verdict">${ctx.esc(ctx.local(decision.label))}</p>` : ''
  const dataAttribute = decision
    ? `${isRod ? 'data-rod-decision' : item.baitLureDecision ? 'data-bait-lure-decision' : 'data-gear-decision'}="${ctx.esc(item.id)}"`
    : ''
  const heading = decision ? rodDecisionTitle(ctx, item) : ctx.copy.use
  const body = summary || ctx.copy.noFish
  const targetAdvice = targetAdviceSection(ctx, item, allItems, fishVisuals, fishLocations)
  const general = `${verdict}<p>${ctx.esc(body)}</p>`
  const next = ctx.gearNextActions(item, fishVisuals, fishLocations, allItems)
  const maker = ctx.flyMakerLink(item)
  const note = imageNote ? `<p class="muted">${ctx.esc(imageNote)}</p>` : ''
  const isFly = ['fly', 'fly_wing', 'fly_tail'].includes(item.category)
  const reasons =
    (targetAdvice && !isFly ? general : '') + factList + decisionFacts(ctx, item, allItems)
  const supporting =
    decision && reasons
      ? `<details class="decision-reasons"><summary>${ctx.esc(decisionReasonTitle(ctx, true))}</summary>${reasons}</details>`
      : reasons
  return `<section id="what-to-do" class="decision-panel ${decision ? 'rod-decision' : ''}" ${dataAttribute}><h2>${ctx.esc(heading)}</h2>${targetAdvice || general}${supporting}${next}${maker}${note}</section>`
}

function renderQuickOptions(ctx, item, allItems) {
  const options = [
    ctx.boatBoardingChoice(item),
    ctx.acquisitionChoice(item),
    ctx.baitGatherChoice(item),
    ctx.forageBaitChoice(item, allItems),
    ctx.mushroomAlternative(item),
  ].filter(Boolean)
  return options.length ? `<div class="decision-support-grid">${options.join('')}</div>` : ''
}

function renderMoreOptions(ctx, item, allItems, fishLocations) {
  return ctx.moreOptionsPanel([
    ctx.baitLurePriceChoices(item, allItems),
    ctx.compassUseChoice(item),
    ctx.gatheredBaitChoices(item, allItems),
    ctx.keepnetAlternatives(item, allItems),
    ctx.daikonFishChoice(item, fishLocations),
  ])
}

function renderItemSections(ctx, item, allItems, fishVisuals, fishLocations, decisions) {
  const usage = ctx.visibleUsage(item)
  const summary = usage.summary || ctx.local(item.playerUse?.summary) || ''
  const facts = usage.facts || []
  const name = ctx.imageName(item)
  const categoryText = ctx.categoryLabel(item)
  const categoryHref = ctx.currentCategoryLink()
  const intro = `<nav class="detail-breadcrumb" aria-label="${ctx.esc(ctx.copy.category)}"><a href="${ctx.esc(categoryHref)}">${ctx.esc(ctx.copy.allItems)}</a><span aria-hidden="true">/</span><span>${ctx.esc(categoryText)}</span></nav>`
  const hero = renderItemHero(ctx, item, name, categoryText)
  const target = renderFishTarget(ctx, fishVisuals, fishLocations)
  const baitTarget = renderBaitTarget(ctx, item, fishVisuals, fishLocations)
  const note = item[`imageNote${ctx.lang === 'th' ? 'Th' : ctx.lang === 'ja' ? 'Ja' : 'En'}`] || ''
  const action = renderDecisionSection(
    ctx,
    item,
    summary,
    facts,
    note,
    allItems,
    fishVisuals,
    fishLocations,
  )
  const extras = renderQuickOptions(ctx, item, allItems)
  const rodAdvice = item.rodDecision || item.gearDecision || item.baitLureDecision
  const buying = rodAdvice ? '' : ctx.buyingDecision(item, allItems, decisions)
  const more = renderMoreOptions(ctx, item, allItems, fishLocations)
  const back = `<p class="detail-back-to-list"><a class="route-button" href="${ctx.esc(categoryHref)}">${ctx.esc(ctx.copy.allItems)} · ${ctx.esc(categoryText)} ↗</a></p>`
  return `${intro}${hero}${target}${baitTarget}${action}${extras}${buying}${ctx.shopSection(item, allItems, fishLocations)}${ctx.useLocationSection(item, fishLocations, allItems)}${ctx.fishSection(item, fishVisuals, fishLocations)}${more}${back}${ctx.technicalSection(item)}<p class="muted">${ctx.esc(ctx.copy.sourced)}</p>`
}

function scrollToItemAnchor() {
  if (location.hash.startsWith('#compass-exit-'))
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
  if (location.hash.startsWith('#forage-stage-'))
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
  if (location.hash === '#use-locations')
    document.getElementById('use-locations')?.scrollIntoView({ block: 'start' })
}

export function render(ctx, item, allItems, fishVisuals, fishLocations, decisions) {
  ctx.setNavigation()
  ctx.$('detail-root').innerHTML = renderItemSections(
    ctx,
    item,
    allItems,
    fishVisuals,
    fishLocations,
    decisions,
  )
  scrollToItemAnchor()
  const name = ctx.imageName(item)
  const category = ctx.categoryLabel(item)
  const game =
    ctx.lang === 'th'
      ? 'ตกปลาทาโร่ 2'
      : ctx.lang === 'ja'
        ? '川のぬし釣り2'
        : 'Kawa no Nushi Tsuri 2'
  document.title = `${name} · ${category} · ${game}`
}

export function emptyState(ctx) {
  ctx.setNavigation()
  ctx.$('detail-root').innerHTML =
    `<section class="empty-state"><h1>${ctx.esc(ctx.copy.invalidTitle)}</h1><p>${ctx.esc(ctx.copy.invalidBody)}</p><a class="route-button" href="${ctx.esc(ctx.fallbackBack())}">${ctx.esc(ctx.copy.allItems)} ↗</a></section>`
}
