import { localName } from './format.js'

/** Fish whose catalogue name is not the one players know: shown with a plain-language gloss. */
const FISH_GLOSS = { 59: { en: 'Giant eel (Oo-unagi)' } }

export function fishLabel(ctx, id) {
  return FISH_GLOSS[id]?.[ctx.locale] ?? localName(ctx.policies.names.fish[id], ctx.locale)
}

export const rodLabel = (ctx, id) => localName(ctx.policies.names.rod[id], ctx.locale)
export const hookLabel = (ctx, id) => localName(ctx.policies.names.hook[id], ctx.locale)
export const baitLabel = (ctx, id) => (id ? localName(ctx.policies.names.bait[id], ctx.locale) : '')

/** "Yamame · Hera carbon rod · Yamame hook · Worm" for the current selection. */
export function setupSummary(ctx, state = ctx.state) {
  return ctx.text.setupLine(
    fishLabel(ctx, state.fishId),
    rodLabel(ctx, state.rodId),
    hookLabel(ctx, state.hookId),
    baitLabel(ctx, state.baitId),
  )
}
