import { renderTargetAdvice } from '../../shared/lib/index.js'
import { questNextActions } from './quest-next-actions.js'
import { hookTargetLinks } from './hook-target-links.js'
import { baitLureVerdict } from './bait-lure-verdict.js'
import { areaLabel, withStage } from './rod-area-page-helpers.js'
import {
  flyWingPlayerDecision,
  flyWingPlayerLinks,
  rodAreaDecision,
} from '../../entities/item/index.js'

function flyWingActionHrefs(ctx, item, decision, fish) {
  const bodyId = decision.bundle?.body || '01'
  const body = ctx.allItems.find(
    (candidate) => candidate.category === 'fly' && candidate.id === bodyId,
  )
  const verifiedWing = ctx.allItems
    .filter(
      (candidate) =>
        candidate.category === 'fly_wing' &&
        candidate.id !== item.id &&
        candidate.flyMakerMenuChoice,
    )
    .sort((a, b) => a.id.localeCompare(b.id))[0]
  const shopQuery = new URLSearchParams({
    stage: String(decision.bundle?.stage || 6),
    place: 'town',
    category: item.category,
    id: item.id,
    return: ctx.sourceReturn(),
  })
  if (fish) shopQuery.set('fish', fish)
  return {
    shop: `${ctx.detailFile('shops')}?${shopQuery}`,
    body: body ? ctx.itemHref(body) : '',
    fish: fish ? ctx.fishHref(fish) : '',
    starter: body && !decision.bundle ? ctx.itemHref(body) : '',
    alternative: verifiedWing ? `${ctx.itemHref(verifiedWing)}#fly-menu-position` : '',
  }
}

function itemAdvice(item) {
  return item.rodDecision || item.baitLureDecision || item.gearDecision
}

function areaRodView(ctx, item) {
  const decision = rodAreaDecision(ctx.lang, item, ctx.allItems, ctx.locationStage)
  if (!decision) return item
  return {
    ...item,
    rodDecision: { ...item.rodDecision, ...decision },
    generalRodDecision: item.rodDecision,
    areaRodDecision: decision,
  }
}

function isAreaRodOffer(item) {
  return (
    item.areaRodDecision &&
    !['item-unstocked', 'style-unstocked', 'style-never-stocked'].includes(
      item.areaRodDecision.status,
    )
  )
}

function cardActionTitle(ctx, item, advice) {
  if (item.rodDecision) return ctx.rodAdviceTitle
  if (!advice) return ctx.player.use
  return ctx.lang === 'th'
    ? 'ควรซื้อหรือใช้ชิ้นนี้เมื่อไร?'
    : ctx.lang === 'ja'
      ? 'この道具を買う・使うときは？'
      : 'When should I buy or use this?'
}

function cardDecisionAttribute(ctx, item, advice) {
  if (!advice) return ''
  const key = item.rodDecision
    ? 'data-rod-decision'
    : item.baitLureDecision
      ? 'data-bait-lure-decision'
      : 'data-gear-decision'
  return `${key}="${ctx.esc(item.id)}"`
}

function conditionalOfferNote(ctx, item, use) {
  if (item.category !== 'bait' || item.id !== '17') return ''
  const offer = use.shops?.find((shop) =>
    shop.condition?.includes('sell at least one Ayu before buying'),
  )
  const stage = Number(offer?.stage)
  if (!Number.isInteger(stage) || stage < 1 || stage > 6) return ''
  const note =
    ctx.lang === 'th'
      ? `ด่าน ${stage}: ต้องขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนซื้อ`
      : ctx.lang === 'ja'
        ? `エリア${stage}：びくのアユを1匹以上売ってから購入`
        : `Area ${stage}: sell at least one Ayu from your keepnet before buying`
  return `<p class="fish-scope conditional-offer-note" data-conditional-offer-note="bait:17" data-offer-stage="${stage}">${ctx.esc(note)}</p>`
}

function renderCardIdentity(ctx, item, use, detailHref) {
  const image = `<a href="${ctx.esc(detailHref)}" aria-label="${ctx.esc(ctx.itemName(item))} — ${ctx.detailLabel}"><img loading="lazy" src="${ctx.esc(item.image)}" alt="${ctx.esc(ctx.itemName(item))}"></a>`
  const price =
    item.priceYen > 0 && use.shops?.length && !item.category.startsWith('fly')
      ? `<span class="price-badge">${ctx.esc(ctx.formatYen(item))}</span>`
      : ''
  const japanese =
    ctx.itemName(item) !== item.nameJa
      ? `<p class="jp-name" lang="ja">${ctx.esc(item.nameJa)}</p>`
      : ''
  const offerNote = conditionalOfferNote(ctx, item, use)
  return `<div class="card-main"><figure class="sprite">${image}</figure><div class="card-text"><span class="category-tag">${ctx.esc(ctx.categoryNames[item.category])}</span><h3><a class="entity-title" href="${ctx.esc(detailHref)}">${ctx.esc(ctx.itemName(item))}</a></h3>${ctx.thaiLabel(item)}${japanese}<div class="price-row">${price}<span class="item-id">ID ${ctx.esc(item.id)}</span></div>${offerNote}<a class="card-detail-link" href="${ctx.esc(detailHref)}">${ctx.esc(ctx.cardUi.details)} ↗</a></div></div>`
}

function rodAreaAlternativeLinks(ctx, item) {
  const decision = item.areaRodDecision
  if (!decision?.alternatives?.length) return ''
  const nextStage = decision.status === 'style-unstocked' ? decision.nextStockStage : 0
  const label = nextStage
    ? ctx.lang === 'th'
      ? `คันรูปแบบเดียวกันที่มีรายการขายในด่าน ${nextStage}`
      : ctx.lang === 'ja'
        ? `同じ釣り方の販売記録（エリア${nextStage}）`
        : `Same-style recorded offers in Area ${nextStage}`
    : item.areaRodDecision.status === 'item-unstocked'
      ? ctx.lang === 'th'
        ? 'คันรูปแบบเดียวกันที่มีขายในด่านนี้'
        : ctx.lang === 'ja'
          ? 'このエリアで販売記録がある同じ釣り方の竿'
          : 'Same-style offers recorded in this area'
      : ctx.lang === 'th'
        ? 'คันอื่นที่มีขายในด่านนี้สำหรับเปรียบเทียบ'
        : ctx.lang === 'ja'
          ? 'このエリアで比較できる同じ釣り方の竿'
          : 'Other same-style offers recorded in this area'
  const links = decision.alternatives
    .map((ref) =>
      ctx.allItems.find(
        (candidate) => candidate.category === ref.category && candidate.id === ref.id,
      ),
    )
    .filter(Boolean)
    .map((candidate) => {
      const href = ctx.itemHref(candidate)
      const target = nextStage ? withStage(href, nextStage) : href
      const stageAttr = nextStage ? ` data-stage="${nextStage}"` : ''
      return `<a class="decision-item" data-rod-area-alternative="${ctx.esc(candidate.id)}"${stageAttr} href="${ctx.esc(target)}"><img src="${ctx.esc(candidate.image)}" alt=""><span>${ctx.esc(ctx.itemName(candidate))}<small>ID ${ctx.esc(candidate.id)}${nextStage ? ` · ${ctx.esc(areaLabel(ctx, nextStage))}` : ''}</small></span></a>`
    })
    .join('')
  if (!links) return ''
  const marker = nextStage
    ? `data-rod-area-next-stock="${nextStage}"`
    : 'data-rod-area-alternatives'
  return `<div class="rod-alternatives" ${marker}><p>${ctx.esc(label)}</p>${links}</div>`
}

function generalRodRouteAdvice(ctx, item) {
  const advice = item.generalRodDecision
  if (!advice?.recommendation) return ''
  const label =
    ctx.lang === 'th'
      ? 'คำแนะนำเส้นทางทั่วไปทุกด่าน'
      : ctx.lang === 'ja'
        ? 'エリア指定なしの一般ルート案内'
        : 'General route advice across areas'
  return `<details class="general-rod-route-advice"><summary>${label}</summary><p>${ctx.esc(ctx.local(advice.recommendation))}</p>${advice.reason ? `<p>${ctx.esc(ctx.local(advice.reason))}</p>` : ''}</details>`
}

function guideEvidenceNote(ctx, use) {
  if (use.evidence?.type !== 'player_guide_report') return ''
  return `<p class="fish-scope">${ctx.lang === 'th' ? 'คำอธิบายการใช้จากคู่มือผู้เล่น ยังไม่ได้ยืนยันจากโค้ดเกม' : ctx.lang === 'ja' ? '用途はプレイヤーガイドによる報告。ゲームコードでは未確認。' : 'Use reported by a player guide; not yet confirmed in game code.'}</p>`
}

function renderCardDisclosure(ctx, item, use, summary, facts, advice, wingDecision) {
  const factList = facts.length
    ? `<ul class="use-facts">${facts.map((fact) => `<li>${ctx.esc(fact)}</li>`).join('')}</ul>`
    : ''
  const recommendation = wingDecision
    ? `<h5>${ctx.esc(ctx.cardUi.fullRecommendation)}</h5><p class="card-full-recommendation">${ctx.esc(wingDecision.recommendation)}</p><p class="card-decision-reason">${ctx.esc(wingDecision.reason)}</p>`
    : advice
      ? `<h5>${ctx.esc(ctx.cardUi.fullRecommendation)}</h5><p class="card-full-recommendation">${ctx.esc(ctx.local(advice.recommendation) || summary)}</p>${advice.reason ? `<p class="card-decision-reason">${ctx.esc(ctx.local(advice.reason))}</p>` : ''}`
      : ''
  const details = [
    recommendation,
    factList,
    guideEvidenceNote(ctx, use),
    !wingDecision && item.areaRodDecision ? rodAreaAlternativeLinks(ctx, item) : '',
    !wingDecision && advice && !item.areaRodDecision ? ctx.rodAlternatives(item) : '',
    !wingDecision ? generalRodRouteAdvice(ctx, item) : '',
    !wingDecision && advice ? ctx.gearNextActions(item) : '',
    !wingDecision && advice && !item.flyMakerMenuChoice ? ctx.flyMakerLink(item) : '',
  ].join('')
  return ctx.cardDisclosure(
    advice || wingDecision ? ctx.cardUi.decisionDetails : ctx.cardUi.useDetails,
    details,
    advice || wingDecision ? 'card-decision-disclosure' : 'card-use-disclosure',
  )
}

function renderCardGuidance(ctx, item, use, summary, facts, advice) {
  const fish = document.getElementById('fish-filter')?.value || ''
  const wingDecision = flyWingPlayerDecision(
    ctx.lang,
    item,
    ctx.allItems,
    fish,
    fish ? ctx.fishName(fish) : '',
  )
  const targetAdvice = wingDecision
    ? ''
    : renderTargetAdvice(ctx, item, fish, { includeScope: false })
  const label = wingDecision?.label || (advice ? ctx.local(advice.label) : summary)
  const lureVerdict = !fish && !wingDecision ? baitLureVerdict(ctx, item) : ''
  const disclosure = renderCardDisclosure(ctx, item, use, summary, facts, advice, wingDecision)
  const wingLinks = wingDecision
    ? flyWingPlayerLinks(ctx, wingDecision, flyWingActionHrefs(ctx, item, wingDecision, fish))
    : ''
  const actionTitle = targetAdvice
    ? ctx.lang === 'th'
      ? 'คำแนะนำสำหรับปลาที่เลือก'
      : ctx.lang === 'ja'
        ? '選んだ魚への案内'
        : 'Advice for your selected fish'
    : cardActionTitle(ctx, item, advice)
  const dataDecision = wingDecision
    ? `data-fly-wing-decision="${ctx.esc(item.id)}"`
    : cardDecisionAttribute(ctx, item, advice)
  const summaryClass = advice ? 'card-verdict' : 'card-effect'
  const menuAction = wingDecision
    ? wingLinks
    : item.flyMakerMenuChoice
      ? ctx.flyMakerLink(item)
      : ''
  const hookTargets = hookTargetLinks(ctx, item)
  const visibleAdvice = item.areaRodDecision
    ? `<p class="use-summary card-verdict">${ctx.esc(label)}</p>`
    : targetAdvice || lureVerdict
      ? targetAdvice || lureVerdict
      : `<p class="use-summary ${summaryClass}">${ctx.esc(label)}</p>`
  const areaMarker = item.areaRodDecision
    ? ` data-rod-area-decision="${item.areaRodDecision.stage}" data-rod-area-status="${ctx.esc(item.areaRodDecision.status)}"`
    : ''
  return `<div class="use-block" ${dataDecision}${areaMarker}><h4>${ctx.esc(actionTitle)}</h4>${visibleAdvice}${hookTargets}${menuAction}<div class="card-more-content">${disclosure}</div></div>`
}

function renderCardAcquisition(ctx, item) {
  const actions = [
    ctx.baitLurePriceChoices(item),
    ctx.compassUseChoice(item),
    ctx.gatheredBaitChoices(item),
    ctx.baitGatherChoice(item),
    ctx.forageBaitChoice(item, ctx.allItems),
    ctx.mushroomAlternative(item),
    ctx.keepnetAlternatives(item, ctx.allItems),
    ctx.daikonFishChoice(item),
    ctx.acquisitionChoice(item),
  ].join('')
  const sellers = ctx.cardDisclosure(
    ctx.cardUi.buying,
    ctx.shopLocations(item),
    'card-shop-disclosure',
  )
  const choices = ctx.cardDisclosure(ctx.cardUi.moreActions, actions, 'card-actions-disclosure')
  const fish = ctx.cardDisclosure(
    `${ctx.fishHeading(item)} · ${ctx.fishIdsFor(item).length}`,
    ctx.fishList(item),
    'card-fish-disclosure',
  )
  return `${sellers}${choices}${fish}${ctx.toolUseLocations(item)}${ctx.detailedFields(item)}`
}

export function renderItemCard(ctx, item) {
  const view = areaRodView(ctx, item)
  const use = ctx.useOf(view)
  const areaUse = view.areaRodDecision
    ? {
        ...use,
        shops: (use.shops || []).filter(
          (shop) => Number(shop.stage) === view.areaRodDecision.stage,
        ),
      }
    : use
  const { summary, facts } = ctx.visibleUse(view)
  const advice = itemAdvice(view)
  const detailHref = ctx.itemHref(view)
  const identity = renderCardIdentity(ctx, view, areaUse, detailHref)
  const guidance = renderCardGuidance(ctx, view, use, summary, facts, advice)
  const details = renderCardAcquisition(ctx, view)
  const poison = view.category === 'food' && view.id === '0A' ? 'poison-food' : ''
  const offerMarker = isAreaRodOffer(view) ? ' data-selected-area-offer="true"' : ''
  return `<article class="item-card item-card-compact ${poison}" id="item-${view.category}-${view.id}"${offerMarker}>${identity}${guidance}${questNextActions(ctx, view)}${details}</article>`
}
