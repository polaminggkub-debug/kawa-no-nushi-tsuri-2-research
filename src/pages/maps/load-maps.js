export function loadMaps(ctx) {
  Promise.all([
    fetch('fish-locations.json').then((r) => {
      if (!r.ok) throw Error('fish locations')
      return r.json()
    }),
    fetch('gallery-data.json?v=compendium-20261005-44').then((r) => {
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
      ctx.$('pin-help').textContent =
        ctx.lang === 'th'
          ? 'โหลดข้อมูลปลาไม่สำเร็จ กรุณาโหลดหน้าใหม่'
          : ctx.lang === 'ja'
            ? '魚データを読み込めません。ページを再読み込みしてください。'
            : 'Could not load fish map data. Please reload the page.'
    })
}
