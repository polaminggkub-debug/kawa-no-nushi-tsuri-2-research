import {
  lureCoverageByArea,
  lureCoverageForArea,
  lureCoverageOptions,
} from '../../entities/item/index.js'
import { hasSelectedArea } from './rod-area-page-helpers.js'

function areaNames(ctx, stages) {
  if (ctx.lang === 'th') return `ด่าน ${stages.join(', ')}`
  if (ctx.lang === 'ja') return `エリア${stages.join('・')}`
  if (stages.length === 1) return `Area ${stages[0]}`
  return `Areas ${stages.slice(0, -1).join(', ')} and ${stages.at(-1)}`
}

function pairSummary(ctx, pair) {
  const price = ctx.lang === 'ja' ? `${pair.totalYen}円` : `¥${pair.totalYen}`
  return `${pair.key} · ${price}`
}

function groupedLureAreas(options) {
  const groups = new Map()
  for (const choice of lureCoverageByArea(options)) {
    const key = choice.isLocal ? choice.pair.key : 'none'
    const group = groups.get(key) || { pair: choice.isLocal ? choice.pair : null, stages: [] }
    group.stages.push(choice.stage)
    groups.set(key, group)
  }
  return [...groups.values()]
}

function groupSummary(ctx, group) {
  if (group.pair) return `${areaNames(ctx, group.stages)}: ${pairSummary(ctx, group.pair)}`
  const unavailable =
    ctx.lang === 'th'
      ? 'ไม่มีคู่ครบขายในด่าน; ใช้คู่ที่มีอยู่หรือซื้อ 17+23 ที่ด่าน 4'
      : ctx.lang === 'ja'
        ? '店頭で一式は揃いません。所持中のセットを使うか、エリア4で17+23を購入'
        : 'no complete local pair; keep a full pair you own or buy 17+23 in Area 4'
  return `${areaNames(ctx, group.stages)}: ${unavailable}`
}

function noStageRecommendation(ctx, options) {
  const areaChoices = groupedLureAreas(options).map((group) => groupSummary(ctx, group))
  if (ctx.lang === 'th') return `ชุดครบที่ซื้อได้ตามด่าน: ${areaChoices.join('; ')}`
  if (ctx.lang === 'ja') return `エリア別に店頭で揃うセット：${areaChoices.join('；')}`
  return `Complete pairs by area: ${areaChoices.join('; ')}`
}

function currentAreaRecommendation(ctx, options, stage, choice) {
  if (choice.isLocal) {
    if (ctx.lang === 'th')
      return `ด่าน ${stage} ซื้อคู่ ${pairSummary(ctx, choice.pair)} ได้ครบในด่านนี้`
    if (ctx.lang === 'ja')
      return `エリア${stage}では${pairSummary(ctx, choice.pair)}を店頭で揃えられます。`
    return `Area ${stage} stocks the complete pair ${pairSummary(ctx, choice.pair)}.`
  }
  const sellers = lureCoverageByArea(options)
    .filter((area) => area.isLocal && area.pair.key === choice.pair.key)
    .map((area) => area.stage)
  const sellerAreas = areaNames(ctx, sellers)
  if (ctx.lang === 'th')
    return `ด่าน ${stage} ไม่มีคู่ครบขายในด่าน; คู่ครบที่ราคาต่ำสุดคือ ${pairSummary(ctx, choice.pair)} ซื้อครบได้ที่ ${sellerAreas}. ถ้ามีคู่ครบอยู่แล้ว ใช้ต่อได้`
  if (ctx.lang === 'ja')
    return `エリア${stage}では一式が揃いません。最安の組み合わせ${pairSummary(ctx, choice.pair)}は${sellerAreas}で購入できます。すでに一式を持っていればそのまま使えます。`
  return `Area ${stage} has no complete local pair. The lowest-cost full pair is ${pairSummary(ctx, choice.pair)}, stocked in ${sellerAreas}. Keep a full pair you already own.`
}

export function contextualLureCoverageDecision(ctx, decision) {
  const options = lureCoverageOptions(ctx.allItems)
  const stage = hasSelectedArea(ctx)
  const choice = lureCoverageForArea(options, stage || 1)
  if (!choice.pair) return decision
  const recommendation = stage
    ? currentAreaRecommendation(ctx, options, stage, choice)
    : noStageRecommendation(ctx, options)
  const items = stage
    ? choice.pair.items
    : lureCoverageByArea(options)
        .filter((area) => area.isLocal)
        .flatMap((area) => area.pair.items)
        .filter(
          (item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index,
        )
  return {
    ...decision,
    recommendation: { ...decision.recommendation, [ctx.lang]: recommendation },
    items: items.map((item) => ({ category: item.category, id: item.id })),
  }
}
