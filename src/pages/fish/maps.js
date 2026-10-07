export function pointCount(ctx, location) {
  return (location.points || []).length
}

export function slotCount(ctx, location) {
  return (location.points || []).reduce((sum, point) => sum + (point.slotIndices?.length || 1), 0)
}

function mapSectionKey(stage, map) {
  const keys = (map.pins || []).map((pin) => {
    const x = Number(pin.tileX),
      y = Number(pin.tileY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) return ''
    const column = Math.floor((x * 16 + 8) / 384) + 1
    const row = Math.floor((y * 16 + 8) / 384) + 1
    return `s${stage}-c${column}-r${row}`
  })
  return keys.length && keys[0] && keys.every((key) => key === keys[0]) ? keys[0] : ''
}

export function renderAreaMap(ctx, map, location, fish) {
  if (!map?.image) return ''
  const stage = String(location.stage),
    section = mapSectionKey(stage, map),
    pins = (map.pins || []).filter(
      (pin) => Number.isFinite(Number(pin.x)) && Number.isFinite(Number(pin.y)),
    )
  const markers = pins
    .map(
      (pin) =>
        `<span class="area-map-pin" style="left:${Math.max(0, Math.min(100, Number(pin.x) * 100))}%;top:${Math.max(0, Math.min(100, Number(pin.y) * 100))}%"><img src="${ctx.escapeHtml(fish.image || '')}" alt=""></span>`,
    )
    .join('')
  const mapName = map.name?.[ctx.locale] || map.name?.en || `${ctx.copy.stage(stage)}`
  const label = `${ctx.copy.stage(stage)} · ${mapName} · ${ctx.copy.configuredPoints(pins.length)}`
  const href = ctx.fishMapLink(stage, section)
  return `<a class="area-map-preview" data-map-section="${ctx.escapeHtml(section)}" href="${ctx.escapeHtml(href)}" aria-label="${ctx.escapeHtml(label)}"><span class="area-map-canvas"><img class="area-map-ground" loading="lazy" src="${ctx.escapeHtml(map.image)}" alt=""><span aria-hidden="true">${markers}</span></span><span class="area-map-caption"><strong>${ctx.escapeHtml(mapName)}</strong><small>${ctx.escapeHtml(ctx.copy.configuredPoints(pins.length))}</small></span></a>`
}

function emptyPointAdvice(ctx, count) {
  if (count === 1) {
    if (ctx.locale === 'th')
      return 'ด่านนี้ปลาชนิดนี้มีหมุดเดียว ถ้าหมุดว่าง ให้ตกปลาในด่านนั้นแล้วนอนโรงแรมของด่านนั้น ทำซ้ำจนปลากลับมา ปลาว่ายห่างจากหมุดได้ ลองดูรอบ ๆ ด้วย'
    if (ctx.locale === 'ja')
      return 'このエリアでこの魚のピンは1か所だけです。空なら、そのエリアで釣りをして宿屋で寝る、を魚が戻るまで繰り返します。魚はピンから離れて泳ぐので、周りも探してください。'
    return 'This fish has only one pin in this area. If it is empty, fish in the area and sleep at its inn, and repeat until the fish returns. Fish drift away from the pin, so check nearby water too.'
  }
  if (ctx.locale === 'th')
    return 'หมุดคือจุดที่ปลาอยู่ตอนโหลดเกม แล้วปลาจะว่ายไปมา ส่วนใหญ่ไม่เกิน 1–2 ช่องจากหมุด ถ้าหมุดว่าง ลองหมุดอื่น ปลาที่ตกขึ้นแล้วหรือหลุดไปจะหายจากหมุดจนกว่าจะนอนโรงแรมของด่านนั้น'
  if (ctx.locale === 'ja')
    return 'ピンはロード直後に魚がいる場所で、その後は泳ぎ回ります（ほとんどは1～2マス以内）。空なら別のピンも試してください。釣り上げた魚や逃げた魚は、そのエリアの宿屋で寝るまでピンに戻りません。'
  return 'Pins show where fish start after loading, then they wander (most stay within 1–2 tiles). If a pin is empty, try another. A landed or escaped fish stays gone until you sleep at that area’s inn.'
}

function howItWorksLink(ctx) {
  const label =
    ctx.locale === 'th'
      ? 'ปลาบนแผนที่ทำงานอย่างไร'
      : ctx.locale === 'ja'
        ? 'マップ上の魚のしくみ'
        : 'How fish on the map work'
  return `<p><a href="${ctx.escapeHtml(ctx.mapPath())}#how-fish-work">${ctx.escapeHtml(label)} ↗</a></p>`
}

export function renderAreas(ctx, locations, activeStage, fish) {
  if (!locations.length)
    return `<section class="detail-section fish-where-to-go"><h2>${ctx.escapeHtml(ctx.copy.areas)}</h2><p class="empty-state">${ctx.escapeHtml(ctx.copy.unknownArea)}</p></section>`
  const selected =
    locations.find((location) => String(location.stage) === String(activeStage)) || locations[0]
  const stage = String(selected.stage),
    name = selected.stageName?.[ctx.locale] || selected.stageName?.en || ctx.copy.stage(stage)
  const maps = (selected.maps || []).map((map) => ctx.renderAreaMap(map, selected, fish)).join('')
  const caution = emptyPointAdvice(ctx, pointCount(ctx, selected))
  return `<section class="detail-section fish-where-to-go" id="fish-area-map"><h2>${ctx.escapeHtml(ctx.copy.areas)}</h2><label class="area-select-label" for="shopping-area">${ctx.escapeHtml(ctx.shoppingCopy.area)}</label><select id="shopping-area" class="area-select">${locations.map((location) => `<option value="${ctx.escapeHtml(location.stage)}" ${String(location.stage) === stage ? 'selected' : ''}>${ctx.escapeHtml(ctx.copy.stage(location.stage))} · ${ctx.escapeHtml(location.stageName?.[ctx.locale] || location.stageName?.en || '')}</option>`).join('')}</select><article class="detail-section area-card current-area" data-active="true"><h3>${ctx.escapeHtml(ctx.copy.stage(stage))} · ${ctx.escapeHtml(name)}</h3><p class="area-point-count">${ctx.escapeHtml(ctx.copy.configuredPoints(ctx.pointCount(selected)))}</p><p class="section-lede">${ctx.escapeHtml(caution)}</p>${howItWorksLink(ctx)}${maps ? `<div class="detail-grid area-map-grid">${maps}</div>` : ''}<a class="route-button" href="${ctx.escapeHtml(ctx.fishMapLink(stage))}">${ctx.escapeHtml(ctx.copy.mapAction)} ↗</a></article></section>`
}
