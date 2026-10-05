import { mapReturnMarkup } from './return-action.js'
function itemLocationMarkers(ctx, item, location) {
  const refs =
    location.markerItems ||
    (location.markerItem ? [location.markerItem] : [{ category: item.category, id: item.id }])
  return refs.map(
    (ref) =>
      ctx.allItems.find((entry) => entry.category === ref.category && entry.id === ref.id) || item,
  )
}

function itemLocationNote(ctx, location) {
  if (location.forage)
    return ctx.lang === 'th'
      ? 'เดินไปยืนตรงรูปเหยื่อแล้วใช้แว่นขยาย สองรูปหมายถึงได้อย่างใดอย่างหนึ่ง ถ้าค้นซ้ำต้องขยับช่องก่อน'
      : ctx.lang === 'ja'
        ? 'エサ画像の地点へ歩き、虫メガネを使う。2画像はどちらか1種。再度探すときは移動する。'
        : 'Walk to the bait image and use the magnifying glass. Two images mean either result, not both. Move before searching again.'
  return ctx.lang === 'th'
    ? 'รูปไอเท็มชี้จุดคุยหรือจุดใช้บนภาพฉากจากเกม'
    : ctx.lang === 'ja'
      ? '道具画像はゲーム地形上の会話・使用地点を示します。'
      : 'The item image marks the interaction or use point on game terrain.'
}

function markerHref(ctx, item, location, marker) {
  if (marker.category === item.category && marker.id === item.id) return location.image
  const returnUrl = location.forage
    ? ctx.areaItemLink(
        item,
        location.stage,
        '#forage-stage-' + location.stage + '-context-' + Number(location.context),
      )
    : ''
  return ctx.areaItemLink(marker, location.stage, '', returnUrl)
}

function itemLocationMarker(ctx, item, location, marker) {
  const sameItem = marker.category === item.category && marker.id === item.id
  const label = sameItem
    ? ctx.lang === 'th'
      ? 'เปิดภาพจุดนี้'
      : ctx.lang === 'ja'
        ? 'この場所の画像を開く'
        : 'Open this location image'
    : ctx.detailLabel
  return `<a href="${ctx.esc(markerHref(ctx, item, location, marker))}" aria-label="${ctx.esc(ctx.itemName(marker))} — ${label}"><img src="${ctx.esc(marker.image)}" alt="${ctx.esc(ctx.itemName(marker))}"></a>`
}

function itemLocationSection(ctx, item, location, area, open) {
  const markers = itemLocationMarkers(ctx, item, location)
  const names = markers
    .map(ctx.itemName)
    .join(ctx.lang === 'th' ? ' หรือ ' : ctx.lang === 'ja' ? ' または ' : ' or ')
  const context =
    location.context === 'town'
      ? ctx.lang === 'th'
        ? 'ในเมือง'
        : ctx.lang === 'ja'
          ? '町内'
          : 'In town'
      : ctx.lang === 'th'
        ? 'กลางแจ้ง'
        : ctx.lang === 'ja'
          ? '屋外'
          : 'Outdoors'
  const fullLabel =
    location.context === 'town'
      ? ctx.lang === 'th'
        ? 'เปิดภาพในเมืองทั้งห้าห้อง'
        : ctx.lang === 'ja'
          ? '町の5室の地形を見る'
          : 'Open town terrain for all five rooms'
      : open
  const stepLabel =
    ctx.lang === 'th'
      ? 'เปิดขั้นตอนรับ/ใช้ของและทางเข้า'
      : ctx.lang === 'ja'
        ? '入手・使用手順と入口を見る'
        : 'Open acquisition/use steps and entrance'
  const pins = markers.map((marker) => itemLocationMarker(ctx, item, location, marker)).join('')
  return `<section class="location-map"><h4>${area} ${location.stage} · ${context} · ${ctx.esc(location.forage ? names : ctx.local(location.name))}</h4><div class="map-canvas" style="aspect-ratio:${location.width}/${location.height}"><img class="map-background" loading="lazy" src="${ctx.esc(location.image)}" alt="${ctx.esc(ctx.local(location.name))}"><span class="map-pin" style="left:${location.pin.x * 100}%;top:${location.pin.y * 100}%">${pins}</span></div><p class="fish-scope">${ctx.esc(itemLocationNote(ctx, location))} · X ${location.tileX}, Y ${location.tileY}</p>${location.action ? `<p class="acquisition-action">${ctx.esc(ctx.local(location.action))}</p>` : ''}${location.description ? `<p class="fish-scope">${ctx.esc(ctx.local(location.description))}</p>` : ''}${location.useWindow ? `<p>${ctx.lang === 'th' ? 'ใช้ดอกไม้ไฟขณะยืนในช่วง' : ctx.lang === 'ja' ? '花火の使用範囲' : 'Fireworks activation tiles'} X ${location.useWindow.xMin}–${location.useWindow.xMax}, Y ${location.useWindow.yMin}–${location.useWindow.yMax}</p>` : ''}<a href="${ctx.esc(location.fullImage)}" target="_blank" rel="noopener">${fullLabel} ↗</a>${location.context === 'town' ? ` · <a href="${ctx.esc(ctx.itemHref(item))}#use-locations">${ctx.esc(stepLabel)} ↗</a>` : ''}</section>`
}

function forageLocationGroups(ctx, item, locations, area, open) {
  const stages = [...new Set(locations.map((location) => location.stage))]
  return stages
    .map((stage) => {
      const sections = locations
        .filter((location) => location.stage === stage)
        .map((location) => itemLocationSection(ctx, item, location, area, open))
        .join('')
      return `<details class="forage-stage"><summary>${area} ${stage}</summary>${sections}</details>`
    })
    .join('')
}

export function toolUseLocations(ctx, item) {
  const locations = ctx.useOf(item).useLocations || []
  if (!locations.length) return ''
  const heading =
    ctx.lang === 'th'
      ? 'ดูจุดรับและใช้ไอเท็ม'
      : ctx.lang === 'ja'
        ? '入手・使用場所を地図で見る'
        : 'See where to obtain or use this item'
  const area = ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'
  const open =
    ctx.lang === 'th'
      ? 'ดูแผนที่ทั้งด่าน'
      : ctx.lang === 'ja'
        ? 'エリア全体の地図'
        : 'Full area map'
  const content = locations.some((location) => location.forage)
    ? forageLocationGroups(ctx, item, locations, area, open)
    : locations.map((location) => itemLocationSection(ctx, item, location, area, open)).join('')
  return `<details class="tool-use-map"><summary>${heading}</summary>${content}</details>`
}

function fishMapPage(ctx) {
  return ctx.lang === 'th' ? 'maps.th.html' : ctx.lang === 'ja' ? 'maps.ja.html' : 'maps.html'
}

function fishMapActionLabels(ctx) {
  return {
    pageLabel:
      ctx.lang === 'th'
        ? 'เปิดแผนที่ของปลานี้'
        : ctx.lang === 'ja'
          ? 'この魚の地図を開く'
          : 'Open this fish in the map browser',
    profileLabel:
      ctx.lang === 'th'
        ? 'เปิดข้อมูลปลานี้'
        : ctx.lang === 'ja'
          ? 'この魚の詳細を開く'
          : 'Open fish profile',
    areasLabel: ctx.lang === 'th' ? 'พบในด่าน' : ctx.lang === 'ja' ? '生息エリア' : 'Known areas',
    mapDetails:
      ctx.lang === 'th'
        ? 'ดูแผนที่และจุดตกของด่านนี้'
        : ctx.lang === 'ja'
          ? 'このエリアの地図と釣り場を見る'
          : 'View embedded map and fishing spots for this area',
  }
}

function fishMapGeneralLabels(ctx) {
  return {
    title:
      ctx.lang === 'th'
        ? 'ปลาตัวนี้อยู่ที่ไหน'
        : ctx.lang === 'ja'
          ? 'この魚はどこにいる？'
          : 'Where to find this fish',
    stage: ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area',
    openMap:
      ctx.lang === 'th'
        ? 'เปิดแผนที่ขนาดเต็ม'
        : ctx.lang === 'ja'
          ? '地図を原寸で開く'
          : 'Open full-size map',
    source:
      ctx.lang === 'th'
        ? 'แผนที่ต้นฉบับ / ที่มา'
        : ctx.lang === 'ja'
          ? '元の地図・出典'
          : 'Original map / source',
    unknown:
      ctx.lang === 'th'
        ? 'ยังไม่มีตำแหน่งที่ตรวจสอบได้สำหรับปลานี้ จะไม่เดาตำแหน่งจากรายชื่อเหยื่อ'
        : ctx.lang === 'ja'
          ? 'この魚の釣り場はまだ確認できていません。エサの適合表から場所は推測しません。'
          : 'No verified location is available yet. Bait compatibility does not establish a habitat.',
  }
}

function fishMapLabels(ctx) {
  return {
    page: fishMapPage(ctx),
    ...fishMapActionLabels(ctx),
    ...fishMapGeneralLabels(ctx),
  }
}

function renderEmptyFishLocation() {
  const box = document.getElementById('fish-location-panel')
  if (box.dataset) box.dataset.fishId = ''
  box.hidden = true
  box.innerHTML = ''
}

function selectFishStage(ctx, locations) {
  const selected = locations.some((location) => String(location.stage) === ctx.locationStage)
  if (!selected) ctx.locationStage = String(locations[0]?.stage || '')
  return locations.find((location) => String(location.stage) === ctx.locationStage)
}

function renderAreaOverview(ctx, chosen, viewBox) {
  const overview = chosen?.overview
  if (!overview || !viewBox) return ''
  const rotateNote = overview.rotated
    ? ctx.lang === 'th'
      ? ' · ด้านบนของฉากอยู่ทางซ้าย'
      : ctx.lang === 'ja'
        ? ' · 元の画面の上方向は左'
        : ' · Original top is on the left'
    : ''
  const caption =
    ctx.lang === 'th'
      ? 'ภาพรวมทั้งด่าน · กรอบแสดงส่วนที่เปิดอยู่'
      : ctx.lang === 'ja'
        ? 'エリア全体 · 枠は下の拡大範囲'
        : 'Full area · outline marks the view below'
  const width = Math.min(900, (overview.width / overview.height) * 400)
  return `<figure class="area-overview"><figcaption>${caption}${rotateNote}</figcaption><div style="aspect-ratio:${overview.width}/${overview.height};max-width:${width}px"><img src="${ctx.esc(overview.image)}" alt="${ctx.esc(ctx.local(chosen.stageName))}"><span style="left:${viewBox.x * 100}%;top:${viewBox.y * 100}%;width:${viewBox.width * 100}%;height:${viewBox.height * 100}%"></span></div></figure>`
}

function renderFishMapMenu(ctx, maps) {
  if (maps.length <= 1) return ''
  const label =
    ctx.lang === 'th'
      ? 'เลือกส่วนของแผนที่'
      : ctx.lang === 'ja'
        ? '地図の部分を選ぶ'
        : 'Map section'
  const options = maps
    .map(
      (map, index) =>
        `<option value="${index}" ${index === ctx.locationMapIndex ? 'selected' : ''}>${ctx.esc(ctx.local(map.name))} · ${map.pins?.length || 0} ${ctx.lang === 'th' ? 'จุด' : ctx.lang === 'ja' ? '地点' : 'points'}</option>`,
    )
    .join('')
  return `<label class="location-map-select">${label}<select id="location-map-select">${options}</select></label>`
}

function fishPinNote(ctx) {
  return ctx.lang === 'th'
    ? 'รูปปลาและหมายเลขชี้บริเวณที่ควรลองตก พิกัดจุดเกิดที่กำหนดใน ROM; บางจุดอาจไม่มีปลาในรอบที่เกมสร้างปลา'
    : ctx.lang === 'ja'
      ? '魚画像と番号は狙う目安です。ROMの地図データから抽出した座標です。魚の生成状態によって無効な地点があります。'
      : 'Fish portraits and numbers mark places to try. Coordinates are extracted from ROM map data; some configured points can be inactive in a generated game state.'
}

function fishPin(ctx, id, fish, pin, index) {
  const portrait = fish.image
    ? `<a href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(ctx.fishName(id))} — ${ctx.detailLabel}"><img src="${ctx.esc(fish.image)}" alt="${ctx.esc(ctx.fishName(id))}"></a>`
    : ''
  return `<span class="map-pin" style="left:${Number(pin.x) * 100}%;top:${Number(pin.y) * 100}%" title="${ctx.esc(ctx.fishName(id))} · X ${pin.tileX}, Y ${pin.tileY}">${portrait}<b>${index + 1}</b></span>`
}

function fishMapImage(ctx, id, fish, map, title, labels) {
  if (!map.image) return `<p>${ctx.esc(labels.unknown)}</p>`
  const pins = (map.pins || []).map((pin, index) => fishPin(ctx, id, fish, pin, index)).join('')
  const ratio = `${Number(map.width) || 1}/${Number(map.height) || 1}`
  return `<div class="map-scroll"><div class="map-canvas" style="aspect-ratio:${ratio}"><img class="map-background" loading="lazy" src="${ctx.esc(map.image)}?v=terrain-context-20261004" alt="${ctx.esc(title)}">${pins}</div></div><p class="fish-scope">${ctx.esc(fishPinNote(ctx))}</p><a href="${ctx.esc(map.image)}" target="_blank" rel="noopener">${labels.openMap} ↗</a>${map.fullImage ? ` · <a href="${ctx.esc(map.fullImage)}" target="_blank" rel="noopener">${ctx.lang === 'th' ? 'ดูแผนที่ทั้งด่าน' : ctx.lang === 'ja' ? '全体地図' : 'Full area map'} ↗</a>` : ''}`
}

function fishMapArticle(ctx, id, fish, map, index, labels) {
  const title =
    ctx.local(map.name) ||
    `${ctx.lang === 'th' ? 'แผนที่' : ctx.lang === 'ja' ? '地図' : 'Map'} ${index + 1}`
  const bounds = map.tileBounds
    ? `<p class="fish-scope">X ${map.tileBounds.xMin}–${map.tileBounds.xMax} · Y ${map.tileBounds.yMin}–${map.tileBounds.yMax}</p>`
    : ''
  const source = map.sourceUrl
    ? ` · <a href="${ctx.esc(map.sourceUrl)}" target="_blank" rel="noopener">${labels.source} ↗</a>`
    : ''
  const note = map.note ? `<p>${ctx.esc(ctx.local(map.note))}</p>` : ''
  return `<article class="location-map"><h4>${ctx.esc(title)}</h4>${bounds}${fishMapImage(ctx, id, fish, map, title, labels)}${source}${note}</article>`
}

function renderFishMaps(ctx, id, fish, maps, labels) {
  return maps
    .filter((map, index) => index === ctx.locationMapIndex)
    .map((map, index) => fishMapArticle(ctx, id, fish, map, index, labels))
    .join('')
}

function stageButtons(ctx, locations, stageWord) {
  return locations
    .map(
      (location) =>
        `<button type="button" data-location-stage="${location.stage}" aria-pressed="${String(location.stage) === ctx.locationStage}">${stageWord} ${location.stage} · ${ctx.esc(ctx.local(location.stageName))}</button>`,
    )
    .join('')
}

function fishMapHref(ctx, labels, id, location) {
  const query = new URLSearchParams({ fish: id, return: ctx.sourceReturn() })
  if (location) query.set('stage', String(location.stage))
  return `${labels.page}?${query}`
}

function renderFishAreaLinks(ctx, id, locations, labels) {
  if (!locations.length) return `<p>${ctx.esc(labels.unknown)}</p>`
  const unique = [
    ...new Map(locations.map((location) => [String(location.stage), location])).values(),
  ]
  const links = unique
    .map((location) => {
      const label = `${labels.stage} ${location.stage} · ${ctx.local(location.stageName)}`
      return `<a class="fish-area-link" href="${ctx.esc(fishMapHref(ctx, labels, id, location))}">${ctx.esc(label)} ↗</a>`
    })
    .join('')
  return `<nav class="fish-area-links" aria-label="${ctx.esc(labels.areasLabel)}"><strong>${ctx.esc(labels.areasLabel)}:</strong> ${links}</nav>`
}

function fishLocationHeader(ctx, id, fish, title, labels, chosen) {
  const portrait = fish.image
    ? `<a href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(ctx.fishName(id))} — ${ctx.detailLabel}"><img src="${ctx.esc(fish.image)}" alt=""></a>`
    : ''
  const intro =
    ctx.lang === 'th'
      ? 'ดูจุดตก แล้วเทียบตัวเลือกในหมวดที่เลือกด้านล่าง'
      : ctx.lang === 'ja'
        ? '釣り場を確認してから、下で選択中のカテゴリーを比較します。'
        : 'Find a fishing spot, then compare the selected equipment category below.'
  const profile = `<a class="fish-profile-link" href="${ctx.esc(ctx.fishHref(id))}">${labels.profileLabel} ↗</a>`
  const map = `<a class="map-browser-cta" href="${ctx.esc(fishMapHref(ctx, labels, id, chosen))}">${labels.pageLabel} ↗</a>`
  return `<div class="location-heading">${portrait}<div><h2>${ctx.esc(title)} — ${ctx.esc(ctx.fishName(id))}</h2><p>${intro}</p><nav class="fish-location-links">${profile}${map}</nav></div></div>`
}

function chosenStageContent(ctx, chosen, locations, labels, overviewHtml, mapMenu, maps) {
  if (!locations.length) return `<p>${ctx.esc(labels.unknown)}</p>`
  const access = chosen.accessNote
    ? `<p class="location-access">${ctx.esc(ctx.local(chosen.accessNote))}</p>`
    : ''
  const noMap = !maps
    ? `<p>${ctx.lang === 'th' ? 'พบพิกัดใน ROM แล้ว อยู่ระหว่างถอดภาพแผนที่' : ctx.lang === 'ja' ? 'ROM座標を抽出済み。地図画像を復号中。' : 'ROM coordinates extracted; map rendering is in progress.'}</p>`
    : ''
  const points = (chosen.points || []).map((point) => `(${point.x}, ${point.y})`).join(' · ')
  const pointLabel =
    ctx.lang === 'th'
      ? 'ดูพิกัดจุดเกิดจากเกม'
      : ctx.lang === 'ja'
        ? '出現座標'
        : 'Spawn coordinates'
  const provenance =
    ctx.lang === 'th'
      ? 'ตำแหน่งและชนิดปลาถอดจาก ROM; เปิดรายละเอียดเพื่อดูตารางและโค้ดที่ใช้ตรวจสอบ'
      : ctx.lang === 'ja'
        ? '場所と魚種はROMから抽出。根拠の表とコードは調査詳細を参照。'
        : 'Locations and species are extracted from ROM; research notes identify the source tables and code.'
  return `<nav class="part-menu location-stages" aria-label="${labels.stage}">${stageButtons(ctx, locations, labels.stage)}</nav><h3>${labels.stage} ${chosen.stage} · ${ctx.esc(ctx.local(chosen.stageName))}</h3><p>${ctx.esc(ctx.local(chosen.description))}</p>${access}${overviewHtml}${mapMenu}<div class="location-maps">${maps}</div>${noMap}<details class="spawn-coordinates"><summary>${pointLabel}</summary><p>${points}</p></details><p class="location-provenance">${provenance}</p>`
}

function renderFishLocationContent(ctx, id, fish, chosen, locations, labels) {
  const mapChoices = chosen?.maps || []
  if (ctx.locationMapIndex >= mapChoices.length) ctx.locationMapIndex = 0
  const viewBox = mapChoices[ctx.locationMapIndex]?.overviewBox
  const overview = renderAreaOverview(ctx, chosen, viewBox)
  const mapMenu = renderFishMapMenu(ctx, mapChoices)
  const maps = renderFishMaps(ctx, id, fish, mapChoices, labels)
  const mapContent = chosenStageContent(ctx, chosen, locations, labels, overview, mapMenu, maps)
  const mapLabel = chosen
    ? `${labels.mapDetails} · ${labels.stage} ${chosen.stage} · ${ctx.local(chosen.stageName)}`
    : labels.mapDetails
  const disclosure = locations.length
    ? ctx.cardDisclosure(mapLabel, mapContent, 'fish-location-details')
    : ''
  return `${fishLocationHeader(ctx, id, fish, labels.title, labels, chosen)}${renderFishAreaLinks(ctx, id, locations, labels)}${disclosure}`
}

export function renderFishLocation(ctx, id) {
  const labels = fishMapLabels(ctx)
  if (!id) return renderEmptyFishLocation()
  const fish = ctx.fishVisuals[id] || {}
  const locations = ctx.fishLocations[id]?.locations || []
  const chosen = selectFishStage(ctx, locations)
  const mapHref = fishMapHref(ctx, labels, id, chosen)
  document.getElementById('map-browser-link').href = mapHref
  const panel = document.getElementById('fish-location-panel')
  const keepMapOpen =
    panel.dataset?.fishId === String(id) &&
    panel.querySelector?.('details.fish-location-details')?.open
  panel.hidden = false
  panel.dataset && (panel.dataset.fishId = String(id))
  panel.innerHTML =
    mapReturnMarkup(ctx) + renderFishLocationContent(ctx, id, fish, chosen, locations, labels)
  const disclosure = panel.querySelector?.('details.fish-location-details')
  if (keepMapOpen && disclosure) disclosure.open = true
}
