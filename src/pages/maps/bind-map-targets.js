export function bindMapTargets(ctx) {
  if (ctx.returnPath) {
    const back = document.createElement('a')
    back.className = 'back-link'
    back.href = ctx.returnPath
    back.textContent =
      ctx.lang === 'th'
        ? '← กลับหน้าที่เปิดแผนที่'
        : ctx.lang === 'ja'
          ? '← 前のページに戻る'
          : '← Back to the page that opened this map'
    document.querySelector('.hero-meta').prepend(back)
  }
  ctx.sourceReturn = () => location.pathname.split('/').pop() + location.search
  ctx.fishHref = (id) =>
    `fish${ctx.lang === 'en' ? '' : '.' + ctx.lang}.html?id=${id}&stage=${ctx.activeStage}&return=${encodeURIComponent(ctx.sourceReturn())}`
  ctx.areaList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-stage]')
    if (!button || button.disabled) return
    ctx.activeStage = Number(button.dataset.stage)
    ctx.activeSection = ctx.chooseSection(ctx.activeStage)
    ctx.render()
  })
  ctx.fishList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fish]')
    if (button) ctx.setFish(button.dataset.fish)
  })
  ctx.$('pin-details').addEventListener('click', (event) => {
    const button = event.target.closest('[data-fish]')
    if (button && button.dataset.fish !== ctx.selectedFish) ctx.setFish(button.dataset.fish)
  })
  ctx.$('map-view').addEventListener('click', (event) => {
    const pin = event.target.closest('[data-pin]')
    if (!pin) return
    const ids = pin.dataset.pin.split(',')
    if (ids.length === 1 && ids[0] !== ctx.selectedFish) ctx.setFish(ids[0])
    else ctx.showPinDetails(ids, pin.dataset.x, pin.dataset.y)
  })
}
