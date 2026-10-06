const stages = ['1', '2', '3', '4', '5', '6']
const copy = {
  th: {
    all: 'ทุกด่าน',
    area: 'ด่าน',
    note: 'เลือกได้เฉพาะด่านที่พบปลานี้; ใช้ด่านเดียวกันในการดูร้านและราคา',
  },
  ja: {
    all: '全エリア',
    area: 'エリア',
    note: 'この魚がいるエリアを選択。購入場所と価格にも同じエリアを使います。',
  },
  en: {
    all: 'All areas',
    area: 'Area',
    note: 'Choose an area where this fish occurs. Purchase advice and prices use the same area.',
  },
}

export function syncCatalogueStage(ctx, fish) {
  const select = document.getElementById('catalogue-stage')
  if (!select) return
  const text = copy[ctx.lang] || copy.en
  const locations = ctx.fishLocations?.[fish]?.locations || []
  const available = fish ? locations.map((entry) => String(entry.stage)) : stages
  const options = fish ? [] : [`<option value="">${ctx.esc(text.all)}</option>`]
  for (const stage of [...new Set(available)]) {
    const name = locations.find((entry) => String(entry.stage) === stage)?.stageName
    const label = `${text.area} ${stage}${name ? ' · ' + ctx.local(name) : ''}`
    options.push(`<option value="${stage}">${ctx.esc(label)}</option>`)
  }
  select.innerHTML = options.join('')
  select.value = String(ctx.locationStage || '')
  select.disabled = false
  const note = document.getElementById('catalogue-stage-note')
  if (note) note.textContent = fish ? text.note : ''
}

export function bindCatalogueStage(ctx) {
  document.getElementById('catalogue-stage')?.addEventListener('change', (event) => {
    ctx.locationStage = event.target.value
    ctx.locationMapIndex = 0
    ctx.renderCards()
  })
}
