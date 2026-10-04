import { renderTargetAdvice } from '../../shared/lib/index.js'
import { flyTargetAdvice } from './fly-target-advice.js'

export function targetAdviceSection(ctx, item, allItems, fishVisuals, fishLocations) {
  const fly = flyTargetAdvice(ctx, item, fishVisuals, fishLocations)
  if (fly) return fly
  const adapter = {
    lang: ctx.lang,
    esc: ctx.esc,
    allItems,
    baitRoute: ctx.selectedRoute || 'float',
    locationStage: ctx.selectedStage,
    itemName: ctx.imageName,
    fishName: (id) => ctx.fishName(id, fishVisuals),
    itemHref: ctx.detailItemLink,
  }
  return renderTargetAdvice(adapter, item, ctx.selectedFish)
}
