import { renderTargetAdvice } from '../../shared/lib/index.js'

export function targetAdviceSection(ctx, item, allItems, fishVisuals) {
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
