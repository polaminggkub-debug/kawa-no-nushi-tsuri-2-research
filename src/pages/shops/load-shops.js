import { showShopLoadFailure } from './load-state.js'

export function loadShops(ctx) {
  ctx.focusedEntrance = /^(?:0|[1-4])$/.test(ctx.params.get('entrance') || '')
    ? Number(ctx.params.get('entrance'))
    : null
  ctx.allowedReturn =
    /^\/(?:[^/]+\/)?(?:catalogue\/(?:index|maps|fish|item|shops)|research\/index)(?:\.th|\.ja)?\.html$/
  ctx.returnRoute = ctx.safeReturn(ctx.params.get('return'))
  ctx.searchValue = ctx.params.get('q') || ''
  ctx.init().catch((error) => {
    console.error('Shop page data/render error:', error)
    showShopLoadFailure(ctx)
  })
}
