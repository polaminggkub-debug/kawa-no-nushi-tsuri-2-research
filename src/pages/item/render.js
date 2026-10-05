import { foodAreaMarker, foodAreaAction } from '../../features/food-availability/index.js'
import { equalPriceChoice } from '../../entities/item/index.js'
import { magnetNextAction } from './magnet-next-action.js'
import { flyPriceChoice } from './fly-price-choice.js'
import { flyMenuPosition } from './fly-menu-position.js'
import { townPasteBaitAction } from './bait-acquisition.js'
import { notebookAction } from './notebook.js'
import { questChoiceLayout } from './quest-choice-layout.js'
import { questNextActions } from './quest-next-actions.js'
import { targetAdviceSection } from './target-advice.js'
import { lureKitContext, kitItemComparison } from './lure-kit-context.js'
import {
  flyWingPlayerDecision,
  flyWingPlayerLinks,
  rodAreaDecision,
} from '../../entities/item/index.js'
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
  if (!items.length) return ''
  if (!item.areaRodDecision)
    return `<div class="detail-grid rod-alternatives">${items.map((entry) => ctx.componentLink(entry)).join('')}</div>`
  const nextStage =
    item.areaRodDecision.status === 'style-unstocked' ? item.areaRodDecision.nextStockStage : 0
  const links = items
    .map((candidate) => {
      const href = ctx.detailItemLink(candidate)
      const target = nextStage ? withStage(href, nextStage) : href
      const stage = nextStage ? ` data-stage="${nextStage}"` : ''
      return `<a class="entity-link" data-rod-area-alternative="${ctx.esc(candidate.id)}"${stage} href="${ctx.esc(target)}"><img src="${ctx.esc(candidate.image)}" alt=""><span>${ctx.esc(ctx.imageName(candidate))}<small>ID ${ctx.esc(candidate.id)}${nextStage ? ` · ${ctx.esc(ctx.copy.area(nextStage))}` : ''}</small></span></a>`
    })
    .join('')
  return nextStage
    ? `<div class="detail-grid rod-alternatives" data-rod-area-next-stock="${nextStage}">${links}</div>`
    : `<div class="detail-grid rod-alternatives" data-rod-area-alternatives>${links}</div>`
}

function withStage(href, stage) {
  const [pathAndQuery, hash = ''] = href.split('#')
  const [path, query = ''] = pathAndQuery.split('?')
  const params = new URLSearchParams(query)
  params.set('stage', String(stage))
  return `${path}?${params}${hash ? `#${hash}` : ''}`
}

function generalRodRouteAdvice(ctx, item) {
  const advice = item.generalRodDecision
  if (!advice?.recommendation) return ''
  const title =
    ctx.lang === 'th'
      ? 'คำแนะนำเส้นทางทั่วไปทุกด่าน'
      : ctx.lang === 'ja'
        ? 'エリア指定なしの一般ルート案内'
        : 'General route advice across areas'
  return `<details class="general-rod-route-advice"><summary>${title}</summary><p>${ctx.esc(ctx.local(advice.recommendation))}</p>${advice.reason ? `<p>${ctx.esc(ctx.local(advice.reason))}</p>` : ''}</details>`
}

function flyWingDetailHrefs(ctx, item, decision, allItems, fishLocations) {
  const bodyId = decision.bundle?.body || '01'
  const body = allItems.find((candidate) => candidate.category === 'fly' && candidate.id === bodyId)
  const verifiedWing = allItems
    .filter(
      (candidate) =>
        candidate.category === 'fly_wing' &&
        candidate.id !== item.id &&
        candidate.flyMakerMenuChoice,
    )
    .sort((a, b) => a.id.localeCompare(b.id))[0]
  const query = new URLSearchParams({
    stage: String(decision.bundle?.stage || 6),
    place: 'town',
    category: item.category,
    id: item.id,
  })
  if (ctx.selectedFish) query.set('fish', ctx.selectedFish)
  if (ctx.selectedRoute) query.set('route', ctx.selectedRoute)
  const returned = ctx.safeLocalRoute(ctx.currentLocalRoute())
  if (returned) query.set('return', returned)
  return {
    shop: `${ctx.localePage[ctx.lang].replace('item', 'shops')}?${query}`,
    body: body ? ctx.detailItemLink(body) : '',
    fish: ctx.selectedFish ? ctx.fishProfileLink(ctx.selectedFish, fishLocations) : '',
    starter: body && !decision.bundle ? ctx.detailItemLink(body) : '',
    alternative: verifiedWing ? `${ctx.detailItemLink(verifiedWing)}#fly-menu-position` : '',
  }
}

function decisionSectionActions(ctx, item, wingDecision, allItems, fishVisuals, fishLocations) {
  if (!wingDecision)
    return ctx.gearNextActions(item, fishVisuals, fishLocations, allItems) + ctx.flyMakerLink(item)
  const hrefs = flyWingDetailHrefs(ctx, item, wingDecision, allItems, fishLocations)
  return flyWingPlayerLinks(ctx, wingDecision, hrefs)
}

function decisionSectionSupport(
  ctx,
  item,
  decision,
  wingDecision,
  targetAdvice,
  general,
  factList,
  allItems,
) {
  const isFly = ['fly', 'fly_wing', 'fly_tail'].includes(item.category)
  const reasons =
    (targetAdvice && !isFly ? general : '') +
    factList +
    (wingDecision ? '' : decisionFacts(ctx, item, allItems))
  const routeAdvice = generalRodRouteAdvice(ctx, item)
  if (!decision || !reasons) return routeAdvice + reasons
  return (
    routeAdvice +
    `<details class="decision-reasons"><summary>${ctx.esc(decisionReasonTitle(ctx, true))}</summary>${reasons}</details>`
  )
}

function decisionSectionCopy(ctx, item, decision, wingDecision, facts) {
  const factList = facts.length
    ? `<h3>${ctx.esc(decisionReasonTitle(ctx, Boolean(decision)))}</h3><ul>${facts.map((fact) => `<li>${ctx.esc(fact)}</li>`).join('')}</ul>`
    : ''
  const verdict = wingDecision
    ? `<p class="rod-verdict" data-fly-wing-verdict="${ctx.esc(item.id)}">${ctx.esc(wingDecision.label)}</p>`
    : decision
      ? `<p class="rod-verdict">${ctx.esc(ctx.local(decision.label))}</p>`
      : ''
  const key = item.rodDecision
    ? 'data-rod-decision'
    : item.baitLureDecision
      ? 'data-bait-lure-decision'
      : 'data-gear-decision'
  const marker = decision ? `${key}="${ctx.esc(item.id)}"` : ''
  const areaMarker = item.areaRodDecision
    ? ` data-rod-area-decision="${item.areaRodDecision.stage}" data-rod-area-status="${ctx.esc(item.areaRodDecision.status)}"${!['item-unstocked', 'style-unstocked', 'style-never-stocked'].includes(item.areaRodDecision.status) ? ' data-selected-area-offer="true"' : ''}`
    : ''
  return {
    factList,
    verdict,
    marker: `${marker}${areaMarker}`,
    heading: decision ? rodDecisionTitle(ctx, item) : ctx.copy.use,
  }
}

function renderDecisionSection(ctx, item, summary, facts, imageNote, data) {
  const { allItems, fishVisuals, fishLocations } = data
  const decision = item.rodDecision || item.gearDecision || item.baitLureDecision
  const fishId = ctx.selectedFish || ''
  const wingDecision = flyWingPlayerDecision(
    ctx.lang,
    item,
    allItems,
    fishId,
    fishId ? ctx.fishName(fishId, fishVisuals) : '',
  )
  const {
    factList,
    verdict,
    marker: dataAttribute,
    heading,
  } = decisionSectionCopy(ctx, item, decision, wingDecision, facts)
  const body = summary || ctx.copy.noFish
  const targetAdvice = wingDecision
    ? ''
    : targetAdviceSection(ctx, item, allItems, fishVisuals, fishLocations)
  const general = `${verdict}<p>${ctx.esc(body)}</p>`
  const actions = decisionSectionActions(
    ctx,
    item,
    wingDecision,
    allItems,
    fishVisuals,
    fishLocations,
  )
  const note = imageNote ? `<p class="muted">${ctx.esc(imageNote)}</p>` : ''
  const supporting = decisionSectionSupport(
    ctx,
    item,
    decision,
    wingDecision,
    targetAdvice,
    general,
    factList,
    allItems,
  )
  const primary = item.areaRodDecision ? general : targetAdvice || general
  const section = `<section id="what-to-do" class="decision-panel ${decision ? 'rod-decision' : ''}" ${dataAttribute}${foodAreaMarker(ctx.lang, item, ctx.selectedStage)}><h2>${ctx.esc(heading)}</h2>${primary}${foodAreaAction(ctx, item, ctx.selectedStage, ctx.currentLocalRoute())}${equalPriceChoice(ctx, item, allItems)}${supporting}${actions}${note}</section>`
  return kitItemComparison(ctx, item, allItems, section)
}

function renderQuickOptions(ctx, item, allItems, fishLocations) {
  const options = [
    notebookAction(ctx, item),
    townPasteBaitAction(ctx, item),
    questNextActions(ctx, item, fishLocations),
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
  const areaDecision = rodAreaDecision(ctx.lang, item, allItems, ctx.selectedStage)
  const viewItem = areaDecision
    ? {
        ...item,
        rodDecision: { ...item.rodDecision, ...areaDecision },
        generalRodDecision: item.rodDecision,
        areaRodDecision: areaDecision,
      }
    : item
  const usage = ctx.visibleUsage(viewItem, allItems, fishVisuals)
  const summary = usage.summary || ctx.local(viewItem.playerUse?.summary) || ''
  const facts = usage.facts || []
  const name = ctx.imageName(item)
  const categoryText = ctx.categoryLabel(item)
  const categoryHref = ctx.currentCategoryLink()
  const intro = `<nav class="detail-breadcrumb" aria-label="${ctx.esc(ctx.copy.category)}"><a href="${ctx.esc(categoryHref)}">${ctx.esc(ctx.copy.allItems)}</a><span aria-hidden="true">/</span><span>${ctx.esc(categoryText)}</span></nav>`
  const hero = renderItemHero(ctx, item, name, categoryText)
  const target = ctx.fishingContext(item) ? renderFishTarget(ctx, fishVisuals, fishLocations) : ''
  const baitTarget = renderBaitTarget(ctx, item, fishVisuals, fishLocations)
  const kit = lureKitContext(ctx, item, allItems)
  const note = item[`imageNote${ctx.lang === 'th' ? 'Th' : ctx.lang === 'ja' ? 'Ja' : 'En'}`] || ''
  const action =
    magnetNextAction(ctx, item, allItems) ||
    renderDecisionSection(ctx, viewItem, summary, facts, note, {
      allItems,
      fishVisuals,
      fishLocations,
    })
  const extras = renderQuickOptions(ctx, item, allItems, fishLocations)
  const choices = questChoiceLayout(ctx, item, action, extras)
  const rodAdvice = item.rodDecision || item.gearDecision || item.baitLureDecision
  const buying = rodAdvice ? '' : ctx.buyingDecision(item, allItems, decisions)
  const more = renderMoreOptions(ctx, item, allItems, fishLocations)
  const back = `<p class="detail-back-to-list"><a class="route-button" href="${ctx.esc(categoryHref)}">${ctx.esc(ctx.copy.allItems)} · ${ctx.esc(categoryText)} ↗</a></p>`
  return `${intro}${hero}${target}${baitTarget}${kit}${choices.action}${flyPriceChoice(ctx, item, allItems)}${flyMenuPosition(ctx, item)}${choices.extras}${buying}${ctx.shopSection(item, allItems, fishLocations)}${ctx.useLocationSection(item, fishLocations, allItems)}${ctx.fishSection(item, fishVisuals, fishLocations)}${more}${back}${ctx.technicalSection(item)}<p class="muted">${ctx.esc(ctx.copy.sourced)}</p>`
}

function scrollToItemAnchor() {
  const exact = [
    '#fly-menu-position',
    '#item-shops',
    '#what-to-do',
    '#fly-purchases',
    '#use-locations',
  ]
  const supported =
    exact.includes(location.hash) ||
    location.hash.startsWith('#compass-exit-') ||
    location.hash.startsWith('#forage-stage-')
  if (supported) document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
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

export function loadErrorState(ctx) {
  ctx.setNavigation()
  ctx.$('detail-root').innerHTML =
    `<section class="empty-state" role="alert"><h1>${ctx.esc(ctx.copy.loadErrorTitle)}</h1><p>${ctx.esc(ctx.copy.loadErrorBody)}</p><p><button class="route-button" type="button" id="item-retry" data-item-retry>${ctx.esc(ctx.copy.retryLoad)} ↻</button> <a class="route-button" data-item-catalogue-fallback href="${ctx.esc(ctx.fallbackBack())}">${ctx.esc(ctx.copy.backToCatalogue)} ↗</a></p></section>`
  ctx.$('item-retry')?.addEventListener('click', () => location.reload())
}
