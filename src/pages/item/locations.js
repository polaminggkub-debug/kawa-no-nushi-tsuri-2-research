function locationCopy(ctx) {
  return {
    th: {
      pin: 'รูปไอเท็มชี้ตำแหน่งที่ต้องไป',
      forage:
        'รูปเหยื่อชี้ช่องตัวอย่างที่ค้นหาได้ ถ้ามีสองรูปคือผลลัพธ์ทางเลือก ไม่ได้รับทั้งคู่ ขยับช่องก่อนค้นซ้ำ',
      open: 'เปิดภาพบริเวณนี้เต็ม',
      full: 'เปิดภาพฉากทั้งด่าน',
      window: 'ยืนใช้ไอเท็มในช่วง',
    },
    en: {
      pin: 'The item portrait marks where to go.',
      forage:
        'Bait portraits mark an example search tile. Two portraits mean alternative results, not both at once. Move to another tile before searching again.',
      open: 'Open this location image',
      full: 'Open full area terrain',
      window: 'Stand and use the item within',
    },
    ja: {
      pin: '道具画像が目的の場所を示す。',
      forage:
        'エサ画像は探索できるタイル例。2枚なら結果の候補で、両方同時ではない。再探索前に別タイルへ移動する。',
      open: 'この場所の画像を開く',
      full: 'エリア全体の地形を開く',
      window: 'この範囲で道具を使う',
    },
  }[ctx.lang]
}

function locationMarkerItems(loc, item, allItems) {
  const refs =
    loc.markerItems ||
    (loc.markerItem ? [loc.markerItem] : [{ category: item.category, id: item.id }])
  return refs
    .map((ref) =>
      allItems.find((candidate) => candidate.category === ref.category && candidate.id === ref.id),
    )
    .filter(Boolean)
}

function isCurrentItem(marker, item) {
  return marker.category === item.category && marker.id === item.id
}

function locationPinNote(ctx, loc, text) {
  if (loc.kind === 'runtime_net_use') {
    if (ctx.lang === 'th') return 'รูปแมลงน้ำชี้ช่องที่ทดลองใช้ตาข่ายสำเร็จ'
    if (ctx.lang === 'ja') return 'カワムシ画像はアミ使用に成功したタイルを示す。'
    return 'The aquatic insect portrait marks the successfully tested net tile.'
  }
  return loc.forage ? text.forage : text.pin
}

function locationMarkerLink(ctx, marker, item, loc, stage) {
  if (isCurrentItem(marker, item)) return loc.image
  const returnRoute = loc.forage ? ctx.foragePointReturn(stage, loc.context) : ''
  return ctx.areaItemLink(marker, stage, '', returnRoute)
}

function locationVisual(ctx, loc, item, markers, stage, text) {
  if (!loc.image || !loc.pin) return ''
  const markerLinks = markers
    .map((marker) => {
      const current = isCurrentItem(marker, item)
      const target = current ? ' target="_blank" rel="noopener"' : ''
      const label = current ? text.open : ctx.imageName(marker)
      return `<a href="${ctx.esc(locationMarkerLink(ctx, marker, item, loc, stage))}"${target} aria-label="${ctx.esc(label)}"><img src="${ctx.esc(marker.image)}" alt="${ctx.esc(ctx.imageName(marker))}"></a>`
    })
    .join('')
  const note = locationPinNote(ctx, loc, text)
  return `<div class="tool-use-map" style="aspect-ratio:${Number(loc.width) || 1}/${Number(loc.height) || 1}"><img class="tool-use-ground" src="${ctx.esc(loc.image)}" alt="${ctx.esc(ctx.local(loc.name))}"><span class="tool-use-pin" style="left:${Number(loc.pin.x) * 100}%;top:${Number(loc.pin.y) * 100}%">${markerLinks}</span></div><p class="muted">${ctx.esc(note)}</p>`
}

function entranceTitle(ctx) {
  if (ctx.lang === 'th') return 'เริ่มจากทางเข้าเมืองนี้บนแผนที่ด่าน'
  if (ctx.lang === 'ja') return '屋外ではこの町入口から入る'
  return 'Start at this town entrance on the outdoor map'
}

function entranceText(ctx) {
  if (ctx.lang === 'th') return 'เข้าประตูที่รูปไอเท็มชี้ แล้วไปหีบในห้องที่แสดงด้านบน'
  if (ctx.lang === 'ja') return '道具画像が示す入口に入り、上の部屋画像の宝箱へ進みます。'
  return 'Enter through the door marked by the item portrait, then find the chest in the room shown above.'
}

function renderEntranceGuide(ctx, item, loc, text) {
  const approach = loc.approach
  if (!approach) return ''
  const pin = `<span class="tool-use-pin" style="left:${approach.pin.x * 100}%;top:${approach.pin.y * 100}%"><a href="${ctx.esc(approach.image)}" target="_blank" rel="noopener"><img src="${ctx.esc(item.image)}" alt="${ctx.esc(ctx.imageName(item))}"></a></span>`
  const map = `<div class="tool-use-map" style="aspect-ratio:${approach.width}/${approach.height}"><img class="tool-use-ground" src="${ctx.esc(approach.image)}" alt="${ctx.esc(entranceTitle(ctx))}">${pin}</div>`
  const full = `<a href="${ctx.esc(approach.fullImage)}" target="_blank" rel="noopener">${ctx.esc(text.full)} ↗</a>`
  return `<details class="town-approach"><summary>${ctx.esc(entranceTitle(ctx))}</summary><p>${ctx.esc(entranceText(ctx))}</p>${map}<p>X ${approach.tileX}, Y ${approach.tileY}</p>${full}</details>`
}

function rewardItem(loc, allItems) {
  const ref = loc.rewardItem
  if (!ref) return null
  return (
    allItems.find((candidate) => candidate.category === ref.category && candidate.id === ref.id) ||
    null
  )
}

function requiredItem(loc, allItems) {
  const ref = loc.requiredItem
  if (!ref) return null
  return (
    allItems.find((candidate) => candidate.category === ref.category && candidate.id === ref.id) ||
    null
  )
}

function itemReference(ctx, target, current) {
  if (isCurrentItem(target, current)) return ctx.esc(ctx.imageName(target))
  return `<a href="${ctx.esc(ctx.detailItemLink(target))}">${ctx.esc(ctx.imageName(target))} ↗</a>`
}

function requirementLabel(ctx) {
  if (ctx.lang === 'th') return 'ต้องพก:'
  if (ctx.lang === 'ja') return '必要な道具：'
  return 'Bring:'
}

function rewardLabel(ctx, loc) {
  if (loc.context === 'town') {
    if (ctx.lang === 'th') return 'ของในหีบ:'
    if (ctx.lang === 'ja') return '宝箱の中身：'
    return 'Chest reward:'
  }
  if (ctx.lang === 'th') return 'ของที่ได้รับ:'
  if (ctx.lang === 'ja') return '受け取る道具：'
  return 'Reward:'
}

function renderRequirement(ctx, loc, item, allItems) {
  const required = requiredItem(loc, allItems)
  if (!required) return ''
  return `<p>${ctx.esc(requirementLabel(ctx))} ${itemReference(ctx, required, item)}</p>`
}

function renderReward(ctx, loc, item, allItems) {
  const reward = rewardItem(loc, allItems)
  if (!reward) return ''
  return `<p>${ctx.esc(rewardLabel(ctx, loc))} ${itemReference(ctx, reward, item)}</p>`
}

function townLabel(ctx, loc) {
  if (loc.context !== 'town') return ''
  if (ctx.lang === 'th') return ' · ในเมือง'
  if (ctx.lang === 'ja') return ' · 町内'
  return ' · In town'
}

function entranceLabel(ctx, loc) {
  if (!Number.isInteger(loc.townEntranceOrdinal)) return ''
  const ordinal = loc.townEntranceOrdinal + 1
  const label =
    ctx.lang === 'th'
      ? `ห้องของทางเข้าเมืองที่ ${ordinal}`
      : ctx.lang === 'ja'
        ? `町入口${ordinal}につながる部屋`
        : `Room reached from town entrance ${ordinal}`
  return `<p>${ctx.esc(label)}</p>`
}

function fullImageLabel(ctx, loc, text) {
  if (loc.context !== 'town') return text.full
  if (ctx.lang === 'th') return 'เปิดภาพในเมืองทั้งห้าห้อง'
  if (ctx.lang === 'ja') return '町内の5部屋の画像を開く'
  return 'Open all five town rooms'
}

function locationAnchor(loc, stage) {
  if (loc.kind === 'compass_exit') return `id="compass-exit-${stage}"`
  if (loc.forage) return `id="forage-stage-${stage}-context-${Number(loc.context)}"`
  return ''
}

function locationCoordinates(ctx, loc, text) {
  const tile = `<p>X ${ctx.esc(loc.tileX)}, Y ${ctx.esc(loc.tileY)}</p>`
  if (!loc.useWindow) return tile
  const { xMin, xMax, yMin, yMax } = loc.useWindow
  return `${tile}<p>${ctx.esc(text.window)} X ${xMin}–${xMax}, Y ${yMin}–${yMax}</p>`
}

function locationImageLinks(ctx, loc, text) {
  const image = loc.image
    ? `<a href="${ctx.esc(loc.image)}" target="_blank" rel="noopener">${ctx.esc(text.open)} ↗</a>`
    : ''
  const full = loc.fullImage
    ? ` · <a href="${ctx.esc(loc.fullImage)}" target="_blank" rel="noopener">${ctx.esc(fullImageLabel(ctx, loc, text))} ↗</a>`
    : ''
  return `${image}${full}`
}

function locationDescription(ctx, loc) {
  return ctx.esc(ctx.local(loc.description) || ctx.local(loc.name) || '')
}

function locationEntry(ctx, item, loc, fishLocations, allItems, text) {
  const stage = Number(loc.stage) || 0
  const markers = locationMarkerItems(loc, item, allItems)
  const visual = locationVisual(ctx, loc, item, markers, stage, text)
  const stageName = stage ? `${ctx.copy.area(stage)} · ${ctx.stageName(stage, fishLocations)}` : ''
  const action = loc.action
    ? `<p class="acquisition-action">${ctx.esc(ctx.local(loc.action))}</p>`
    : ''
  const content = [
    entranceLabel(ctx, loc),
    renderRequirement(ctx, loc, item, allItems),
    renderReward(ctx, loc, item, allItems),
    action,
    `<p>${locationDescription(ctx, loc)}</p>`,
    visual,
    locationCoordinates(ctx, loc, text),
    locationImageLinks(ctx, loc, text),
    renderEntranceGuide(ctx, item, loc, text),
  ].join('')
  return `<article class="detail-section" ${locationAnchor(loc, stage)}><h3>${ctx.esc(stageName + townLabel(ctx, loc))}</h3>${content}</article>`
}

export function useLocationSection(ctx, item, fishLocations, allItems) {
  const locations = item.playerUse?.useLocations || []
  if (!locations.length) return ''
  const text = locationCopy(ctx)
  const cards = locations
    .map((loc) => locationEntry(ctx, item, loc, fishLocations, allItems, text))
    .join('')
  const layout = locations.length === 1 ? 'single-location' : ''
  return `<section class="detail-section locations-section" id="use-locations"><h2>${ctx.esc(ctx.copy.useLocations)}</h2><div class="detail-grid tool-location-grid ${layout}">${cards}</div></section>`
}
