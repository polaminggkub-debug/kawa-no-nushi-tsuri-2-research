export function loadMaps(ctx) {
  Promise.all([
    fetch('fish-locations.json').then((r) => {
      if (!r.ok) throw Error('fish locations')
      return r.json()
    }),
    fetch('gallery-data.json?v=compendium-20261005-51').then((r) => {
      if (!r.ok) throw Error('fish sprites')
      return r.json()
    }),
  ])
    .then(([locations, gallery]) => {
      ctx.notebookCompletion = gallery.notebookCompletion
      ctx.waterIcons = gallery.waterIcons
      ctx.buildData(locations, gallery)
      ctx.initFromUrl()
      ctx.enableControls()
      ctx.render()
      if (ctx.notebookRouteStage)
        ctx.$(`notebook-route-${ctx.notebookRouteStage}`)?.scrollIntoView({ block: 'start' })
      else if (ctx.openNotebookGuide) ctx.$('notebook-guide')?.scrollIntoView({ block: 'start' })
      else if (location.hash === '#map-view') ctx.$('map-view')?.scrollIntoView({ block: 'start' })
    })
    .catch((error) => {
      console.error(error)
      const message =
        ctx.lang === 'th'
          ? 'โหลดข้อมูลปลาไม่สำเร็จ กรุณาโหลดหน้าใหม่'
          : ctx.lang === 'ja'
            ? '魚データを読み込めません。ページを再読み込みしてください。'
            : 'Could not load fish map data. Please reload the page.'
      const retry = { th: 'ลองโหลดแผนที่อีกครั้ง', ja: '地図を再読み込み', en: 'Retry map loading' }
      ctx.$('pin-help').innerHTML =
        `<span>${ctx.esc(message)}</span> <button type="button" class="route-button" id="map-retry">${ctx.esc(retry[ctx.lang] || retry.en)} ↻</button>`
      ctx.$('map-retry')?.addEventListener('click', () => location.reload())
    })
}
