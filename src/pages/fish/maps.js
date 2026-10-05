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
      return 'ด่านนี้มีจุดที่เกมกำหนดไว้เพียงจุดเดียว ถ้าไม่พบปลา ช่องเกิดนี้อาจไม่ทำงานในรอบนี้ หรือปลาอาจเคลื่อนที่ไปแล้ว ลองตรวจบริเวณใกล้จุดนี้'
    if (ctx.locale === 'ja')
      return 'このエリアでゲームに設定された地点は1か所だけです。魚がいなければ、この出現枠が無効な状態か、魚が移動した可能性があります。周辺を探してください。'
    return 'The game records only one spot for this area. If no fish appears there, its spawn slot may be inactive in this state or the fish may have moved; check the nearby water.'
  }
  if (ctx.locale === 'th')
    return 'ถ้าจุดหนึ่งไม่มีปลา ให้ลองจุดอื่นที่แสดงไว้ ปลาเคลื่อนที่ได้และจุดเกิดบางแห่งอาจไม่ทำงานในรอบนั้น'
  if (ctx.locale === 'ja')
    return '魚がいなければ別の表示地点も試してください。魚は移動し、出現枠が無効の場合もあります。'
  return 'If a point is empty, try another marked spot. Fish move, and some spawn slots may be inactive in that state.'
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
  return `<section class="detail-section fish-where-to-go" id="fish-area-map"><h2>${ctx.escapeHtml(ctx.copy.areas)}</h2><label class="area-select-label" for="shopping-area">${ctx.escapeHtml(ctx.shoppingCopy.area)}</label><select id="shopping-area" class="area-select">${locations.map((location) => `<option value="${ctx.escapeHtml(location.stage)}" ${String(location.stage) === stage ? 'selected' : ''}>${ctx.escapeHtml(ctx.copy.stage(location.stage))} · ${ctx.escapeHtml(location.stageName?.[ctx.locale] || location.stageName?.en || '')}</option>`).join('')}</select><article class="detail-section area-card current-area" data-active="true"><h3>${ctx.escapeHtml(ctx.copy.stage(stage))} · ${ctx.escapeHtml(name)}</h3><p class="area-point-count">${ctx.escapeHtml(ctx.copy.configuredPoints(ctx.pointCount(selected)))}</p><p class="section-lede">${ctx.escapeHtml(caution)}</p>${maps ? `<div class="detail-grid area-map-grid">${maps}</div>` : ''}<a class="route-button" href="${ctx.escapeHtml(ctx.fishMapLink(stage))}">${ctx.escapeHtml(ctx.copy.mapAction)} ↗</a></article></section>`
}
