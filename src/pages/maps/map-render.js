import { normalizeWaterMark } from './water-mark-filter.js'
import { notebookStatus } from './notebook-status.js'

export function renderSectionSelect(ctx) {
  const data = ctx.stages[ctx.activeStage]
  const allSections = [...(data?.sections.values() || [])]
  const matchedSections = allSections.filter((section) =>
    section.pins.some((pin) => ctx.visibleMapFishIds(pin.fishIds).length),
  )
  const sections = matchedSections.length ? matchedSections : allSections
  sections.sort((a, b) => a.row - b.row || a.col - b.col)
  if (!sections.some((s) => s.key === ctx.activeSection))
    ctx.activeSection = ctx.chooseSection(ctx.activeStage)
  ctx.stageSelect.innerHTML = sections
    .map((section) => {
      const visible = section.pins
        .map((pin) => ctx.visibleMapFishIds(pin.fishIds))
        .filter((fishIds) => fishIds.length)
      const speciesCount = new Set(visible.flat()).size
      const label = `${ctx.c.mapSection(section.col + 1, section.row + 1)} · ${ctx.c.point(visible.length)} · ${speciesCount} ${ctx.c.species}`
      return `<option value="${section.key}" ${section.key === ctx.activeSection ? 'selected' : ''}>${ctx.esc(label)}</option>`
    })
    .join('')
  ctx.stageSelect.disabled = !sections.length
  ctx.renderTargetSectionLinks(data, sections)
}

export function renderTargetSectionLinks(ctx, data, targetSections) {
  const summary = ctx.$('target-section-summary'),
    shortcuts = ctx.$('other-sections')
  if (
    !ctx.selectedFish ||
    !data ||
    (ctx.activeWaterMark && !ctx.fishMatchesWaterMark(ctx.selectedFish))
  ) {
    summary.hidden = true
    summary.textContent = ''
    shortcuts.hidden = true
    shortcuts.innerHTML = ''
    return
  }
  const total = [...data.pins.values()].filter(
    (pin) => ctx.visibleMapFishIds(pin.fishIds).length,
  ).length
  const sections = targetSections
    .map((section) => ({
      section,
      count: section.pins.filter((pin) => ctx.visibleMapFishIds(pin.fishIds).length).length,
    }))
    .filter((entry) => entry.count > 0)
  const current = sections.find((entry) => entry.section.key === ctx.activeSection)?.count || 0
  const elsewhere = Math.max(0, total - current)
  summary.hidden = false
  summary.textContent =
    ctx.lang === 'th'
      ? `ส่วนนี้ ${current} จาก ${total} จุด · อีก ${elsewhere} จุดอยู่ในส่วนอื่น`
      : ctx.lang === 'ja'
        ? `この範囲 ${current}/${total} 地点 · 他の範囲に ${elsewhere} 地点`
        : `This section: ${current} of ${total} points · ${elsewhere} elsewhere`
  const other = sections.filter((entry) => entry.section.key !== ctx.activeSection)
  shortcuts.hidden = !other.length
  shortcuts.innerHTML = other
    .map(
      ({ section, count }) =>
        `<button type="button" data-other-section="${section.key}">${ctx.esc(ctx.c.mapSection(section.col + 1, section.row + 1))} · ${ctx.esc(ctx.c.point(count))}</button>`,
    )
    .join('')
}

export function setFish(ctx, id, { toggle = true } = {}) {
  if (!ctx.species[id]?.stages?.length) return
  const next = toggle && ctx.selectedFish === id ? '' : id
  const previousSection = ctx.activeSection
  ctx.selectedFish = next
  if (ctx.selectedFish && !ctx.fishInStage(ctx.selectedFish, ctx.activeStage))
    ctx.activeStage = ctx.species[ctx.selectedFish].stages[0] || ctx.activeStage
  const targetInCurrentSection =
    ctx.selectedFish &&
    ctx.stages[ctx.activeStage]?.sections
      .get(previousSection)
      ?.pins.some((pin) => pin.fishIds.includes(ctx.selectedFish))
  ctx.activeSection = ctx.chooseSection(
    ctx.activeStage,
    ctx.selectedFish ? (targetInCurrentSection ? previousSection : '') : previousSection,
  )
  ctx.render()
}

export function showPinDetails(ctx, ids, x, y) {
  const box = ctx.$('pin-details')
  const unique = [...new Set(ids)]
  box.hidden = false
  box.innerHTML =
    `<span class="pin-details-label">X ${x}, Y ${y} · ${unique.length} ${ctx.c.species}</span>` +
    unique
      .map((id) => {
        const f = ctx.species[id],
          img = f.visual.image || ''
        return `<div class="pin-fish-row"><a class="pin-fish-details" href="${ctx.esc(ctx.fishHref(id))}">${img ? `<img src="${ctx.esc(img)}" alt="">` : ''}<span>${ctx.esc(f.name)} — ${ctx.detailLabel} ↗</span></a>${notebookStatus(ctx, id)}<button class="pin-fish-choice" type="button" data-fish="${id}">${ctx.lang === 'th' ? 'เน้นบนแผนที่' : ctx.lang === 'ja' ? '地図で絞り込む' : 'Focus on map'}</button></div>`
      })
      .join('')
}

export function renderMap(ctx) {
  const data = ctx.stages[ctx.activeStage],
    section = data?.sections.get(ctx.activeSection)
  const stageTitle = data ? `${ctx.c.area(data.stage)} · ${data.name}` : ctx.c.area(ctx.activeStage)
  ctx.$('map-title').textContent = stageTitle
  if (!data || !section) {
    ctx.$('map-summary').textContent = ''
    ctx.$('pin-help').textContent = ctx.selectedFish ? ctx.c.noArea : ctx.c.noPoint
    ctx.$('map-view').innerHTML = ''
    return
  }
  const filtered = section.pins
    .map((pin) => ({
      ...pin,
      fishIds: ctx.visibleMapFishIds(pin.fishIds),
    }))
    .filter((pin) => pin.fishIds.length)
  const geometry = ctx.mapGeometry(data, section, filtered)
  const {
    sourceW,
    sourceH,
    originX,
    originY,
    scale,
    viewW,
    viewH,
    terrainW,
    terrainH,
    gutterLeft,
    gutterTop,
  } = geometry
  ctx.renderMapSummary(section, filtered)
  const pins = filtered
    .map((pin) => ctx.mapPinMarkup(pin, originX, originY, scale, gutterLeft, gutterTop))
    .join('')
  ctx.$('map-view').style.width = `${viewW}px`
  ctx.$('map-view').style.height = `${viewH}px`
  ctx.$('map-view').innerHTML =
    `<div class="map-terrain-window" role="img" aria-label="${ctx.esc(`${stageTitle} · ${ctx.c.fullMap}`)}" style="width:${terrainW}px;height:${terrainH}px;left:${gutterLeft}px;top:${gutterTop}px"><img class="map-ground" src="${ctx.esc(data.fullImage)}" alt="" style="width:${Math.round(sourceW * scale)}px;height:${Math.round(sourceH * scale)}px;left:${Math.round(-originX * scale)}px;top:${Math.round(-originY * scale)}px"></div>${pins}`
  ctx.$('pin-details').hidden = true
  ctx.renderOverview(data, section)
  ctx.renderMapNavigation()
}

export function mapPinMarkup(ctx, pin, originX, originY, scale, gutterLeft = 0, gutterTop = 0) {
  const px = (pin.x * 16 + 8 - originX) * scale + gutterLeft,
    py = (pin.y * 16 + 8 - originY) * scale + gutterTop
  const names = pin.fishIds.map((id) => ctx.fishName(id)).join(', '),
    imgs = pin.fishIds.map((id) => ctx.species[id].visual.image).filter(Boolean)
  const tag = pin.fishIds.length === 1 ? 'a' : 'button'
  const action =
    tag === 'a'
      ? `href="${ctx.esc(ctx.fishHref(pin.fishIds[0]))}"`
      : `type="button" data-pin="${pin.fishIds.join(',')}"`
  return `<${tag} ${action} class="fish-pin ${ctx.selectedFish ? 'focused' : ''}" style="left:${px}px;top:${py}px" data-x="${pin.x}" data-y="${pin.y}" title="${ctx.esc(names)} · X ${pin.x}, Y ${pin.y}" aria-label="${ctx.esc(names)} · X ${pin.x}, Y ${pin.y}">${imgs
    .slice(0, 2)
    .map((src) => `<img loading="lazy" src="${ctx.esc(src)}" alt="">`)
    .join(
      '',
    )}${pin.fishIds.length > 1 ? `<span class="cluster-count">${pin.fishIds.length}</span>` : ''}</${tag}>`
}
function markerInsets(pins, selectedFish, originX, originY, cellW, cellH, scale) {
  const insets = { left: 0, right: 0, top: 0, bottom: 0 }
  for (const pin of pins) {
    const centerX = pin.x * 16 + 8 - originX
    const centerY = pin.y * 16 + 8 - originY
    const shared = pin.fishIds.length > 1
    const width = selectedFish ? 62 : shared ? 80 : 46
    const height = selectedFish ? 38 : 36
    insets.left = Math.max(insets.left, width / 2 + 3 - centerX * scale)
    insets.right = Math.max(
      insets.right,
      width / 2 + (shared ? 8 : 0) + 3 - (cellW - centerX) * scale,
    )
    insets.top = Math.max(insets.top, height / 2 + (shared ? 9 : 0) + 3 - centerY * scale)
    insets.bottom = Math.max(insets.bottom, height / 2 + 3 - (cellH - centerY) * scale)
  }
  return Object.fromEntries(
    Object.entries(insets).map(([side, value]) => [side, Math.max(0, Math.ceil(value))]),
  )
}

export function mapGeometry(ctx, data, section, pins = section?.pins || []) {
  const sourceW = data.width,
    sourceH = data.height,
    originX = section.col * 384,
    originY = section.row * 384
  const cellW = Math.max(1, Math.min(384, sourceW - originX)),
    cellH = Math.max(1, Math.min(384, sourceH - originY))
  const panelWidth = ctx.$('map-view').parentElement.clientWidth || window.innerWidth
  const fitScale = Math.min(2.2, (panelWidth - 4) / cellW, 620 / cellH)
  let scale = Math.max(0.3, fitScale)
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const gutter = markerInsets(pins, ctx.selectedFish, originX, originY, cellW, cellH, scale)
    const widthFit = (panelWidth - 4 - gutter.left - gutter.right) / cellW
    const heightFit = (620 - gutter.top - gutter.bottom) / cellH
    const nextScale = Math.max(0.3, Math.min(scale, widthFit, heightFit))
    if (Math.abs(nextScale - scale) < 0.001) break
    scale = nextScale
  }
  scale *= ctx.zoom
  const gutter = markerInsets(pins, ctx.selectedFish, originX, originY, cellW, cellH, scale)
  const terrainW = Math.round(cellW * scale),
    terrainH = Math.round(cellH * scale),
    viewW = terrainW + gutter.left + gutter.right,
    viewH = terrainH + gutter.top + gutter.bottom
  return {
    sourceW,
    sourceH,
    originX,
    originY,
    scale,
    viewW,
    viewH,
    terrainW,
    terrainH,
    gutterLeft: gutter.left,
    gutterTop: gutter.top,
  }
}
function mapZoomHelp(lang) {
  if (lang === 'th') return 'กด + เพื่อขยายจุดที่อยู่ชิดกัน'
  if (lang === 'ja') return '近い地点は＋で拡大できます。'
  return 'Use + to enlarge closely spaced points.'
}

export function renderMapSummary(ctx, section, filtered) {
  const counts = new Set(filtered.flatMap((pin) => pin.fishIds)).size
  ctx.$('map-summary').textContent =
    `${ctx.c.mapSection(section.col + 1, section.row + 1)} · ${ctx.c.point(filtered.length)} · ${counts} ${ctx.c.species}`
  ctx.$('pin-help').textContent = ctx.activeWaterMark
    ? ctx.waterMarkPinHelp(filtered.length > 0)
    : ctx.selectedFish
      ? `${ctx.c.selectedTarget} ${ctx.fishName(ctx.selectedFish)}. ${ctx.c.point(filtered.length)}. ${mapZoomHelp(ctx.lang)}`
      : `${ctx.c.noTarget} ${ctx.lang === 'th' ? 'กดรูปปลาเพื่อดูรายละเอียด หรือกดจุดซ้อนเพื่อเลือกชนิด' : ctx.lang === 'ja' ? '魚画像は詳細へ。重なった地点は魚種を選択。' : 'Fish portraits open details; shared points let you choose a species'}.`
}
export function renderMapNavigation(ctx) {
  ctx.$('zoom-fit').textContent =
    ctx.lang === 'th' ? 'พอดีจอ' : ctx.lang === 'ja' ? '全体表示' : 'Fit view'
  ctx
    .$('zoom-out')
    .setAttribute(
      'aria-label',
      ctx.lang === 'th' ? 'ย่อแผนที่' : ctx.lang === 'ja' ? '縮小' : 'Zoom out',
    )
  ctx
    .$('zoom-in')
    .setAttribute(
      'aria-label',
      ctx.lang === 'th' ? 'ขยายแผนที่' : ctx.lang === 'ja' ? '拡大' : 'Zoom in',
    )
  const shopNav = ctx.$('shop-browser-link')
  if (shopNav) {
    const q = new URLSearchParams({
      stage: String(ctx.activeStage),
      place: 'area',
      return: ctx.sourceReturn(),
    })
    if (ctx.selectedFish) q.set('fish', ctx.selectedFish)
    if (ctx.selectedRoute) q.set('route', ctx.selectedRoute)
    shopNav.href = `shops${ctx.lang === 'en' ? '' : '.' + ctx.lang}.html?${q}`
  }
  const catalogue = ctx.$('catalogue-fish-link')
  catalogue.textContent = ctx.selectedFish
    ? ctx.c.tackle
    : ctx.lang === 'th'
      ? 'กลับไปเลือกอุปกรณ์ตกปลา ↗'
      : ctx.lang === 'ja'
        ? '道具カタログへ ↗'
        : 'Browse the equipment catalogue ↗'
  const query = new URLSearchParams({ return: ctx.sourceReturn() })
  if (ctx.selectedFish) {
    query.set('fish', ctx.selectedFish)
    query.set('stage', String(ctx.activeStage))
  }
  if (ctx.selectedRoute) query.set('route', ctx.selectedRoute)
  const catalogueFile =
    ctx.lang === 'th' ? 'index.th.html' : ctx.lang === 'ja' ? 'index.ja.html' : 'index.html'
  catalogue.href = `${catalogueFile}?${query}${ctx.selectedFish ? '#fish-location-panel' : '#catalogue'}`
}

export function renderOverview(ctx, data, section) {
  const overview = data.overview,
    box = ctx.$('area-overview')
  if (!overview?.image) {
    box.innerHTML = ''
    return
  }
  const matchedSections = [...data.sections.values()].filter((section) =>
    section.pins.some((pin) => ctx.visibleMapFishIds(pin.fishIds).length),
  )
  const selectedSections = matchedSections.length ? matchedSections : [...data.sections.values()]
  function rect(s) {
    const x = s.col * 384,
      y = s.row * 384,
      w = Math.min(384, data.width - x),
      h = Math.min(384, data.height - y)
    return overview.rotated
      ? {
          x: y / data.height,
          y: (data.width - x - w) / data.width,
          w: h / data.height,
          h: w / data.width,
        }
      : { x: x / data.width, y: y / data.height, w: w / data.width, h: h / data.height }
  }
  box.innerHTML = `<p>${ctx.lang === 'th' ? 'ภาพรวมด่าน · กดกรอบเพื่อเปลี่ยนส่วนซูม' : ctx.lang === 'ja' ? 'エリア全体 · 枠をクリックして拡大範囲を変更' : 'Area overview · click a frame to change section'}${overview.rotated ? (ctx.lang === 'th' ? ' · ด้านบนของฉากอยู่ทางซ้าย' : ctx.lang === 'ja' ? ' · 元の上方向は左' : ' · original top is on the left') : ''}</p><div class="overview-canvas" style="aspect-ratio:${overview.width}/${overview.height};width:min(100%,${(170 * overview.width) / overview.height}px)"><img src="${ctx.esc(overview.image)}" alt="${ctx.esc(data.name)}">${selectedSections
    .map((s) => {
      const b = rect(s)
      return `<button type="button" data-section="${s.key}" aria-label="${ctx.esc(ctx.c.mapSection(s.col + 1, s.row + 1))}" aria-pressed="${s.key === section.key}" style="left:${b.x * 100}%;top:${b.y * 100}%;width:${b.w * 100}%;height:${b.h * 100}%"></button>`
    })
    .join('')}</div>`
}

export function render(ctx) {
  if (!ctx.stages[ctx.activeStage])
    ctx.activeStage = Math.min(...Object.keys(ctx.stages).map(Number))
  if (ctx.selectedFish && !ctx.fishInStage(ctx.selectedFish, ctx.activeStage))
    ctx.activeStage = ctx.species[ctx.selectedFish]?.stages[0] || ctx.activeStage
  if (!ctx.stages[ctx.activeStage]?.sections.has(ctx.activeSection))
    ctx.activeSection = ctx.chooseSection(ctx.activeStage)
  ctx.updateUrl()
  ctx.renderAreas()
  ctx.renderSectionSelect()
  ctx.renderFishList()
  ctx.renderMap()
  ctx.renderWaterKey()
  ctx.renderNotebookGuide()
}

export function enableControls(ctx) {
  ctx.$('fish-search').disabled = false
  ctx.$('clear-search').disabled = false
  ctx.$('show-all').disabled = false
}

export function initFromUrl(ctx) {
  ctx.notebookRouteStage = Number(location.hash.match(/^#notebook-route-([1-6])$/)?.[1]) || 0
  ctx.openNotebookGuide = location.hash === '#notebook-guide' || Boolean(ctx.notebookRouteStage)
  const p = new URLSearchParams(location.search)
  ctx.selectedRoute = ['float', 'sinker', 'lure', 'fly'].includes(p.get('route'))
    ? p.get('route')
    : ''
  ctx.activeWaterMark = normalizeWaterMark(p.get('mark'))
  ctx.lastWaterMark = ctx.activeWaterMark
  if (p.get('scope') === 'section') ctx.listScope = 'section'
  ctx.searchTerm = p.get('q') || ''
  ctx.searchInput.value = ctx.searchTerm
  const stage = Number(p.get('stage'))
  if (ctx.stages[stage]) ctx.activeStage = stage
  const target = ctx.idNorm(p.get('fish') || '')
  if (ctx.species[target]) ctx.selectedFish = target
  if (ctx.selectedFish && !ctx.fishInStage(ctx.selectedFish, ctx.activeStage))
    ctx.activeStage = ctx.species[ctx.selectedFish].stages[0] || ctx.activeStage
  const section = p.get('section')
  ctx.activeSection = ctx.chooseSection(ctx.activeStage, section || '')
  if (ctx.selectedFish && !section) ctx.activeSection = ctx.chooseSection(ctx.activeStage, '')
}
