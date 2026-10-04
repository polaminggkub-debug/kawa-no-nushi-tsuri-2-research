export function safeReturn(ctx, raw) {
  if (!raw || raw.startsWith('//') || raw.includes('\\') || /^[a-z][a-z0-9+.-]*:/i.test(raw))
    return ''
  try {
    const base = new URL('.', location.href),
      target = new URL(raw, base)
    const allowed = ['index', 'maps', 'fish', 'item', 'shops'].flatMap((name) =>
      ['', '.th', '.ja'].map((suffix) => {
        const route = `${name}${suffix}.html`
        return { route, pathname: new URL(route, base).pathname }
      }),
    )
    allowed.push(
      ...['index.html', 'index.th.html', 'index.ja.html'].map((file) => {
        const route = `../research/${file}`
        return { route, pathname: new URL(route, base).pathname }
      }),
    )
    const match = allowed.find((entry) => entry.pathname === target.pathname)
    return target.origin === base.origin && match ? match.route + target.search + target.hash : ''
  } catch {
    return ''
  }
}

export function localizeReturn(ctx, raw, toLang, depth = 0) {
  const safe = ctx.safeReturn(raw)
  if (!safe) return ''
  const base = new URL('.', location.href),
    url = new URL(safe, base)
  url.pathname = url.pathname.replace(
    /(index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/,
    `$1${toLang === 'en' ? '' : '.' + toLang}.html`,
  )
  if (url.searchParams.has('return')) {
    const nested =
      depth < 4 ? ctx.localizeReturn(url.searchParams.get('return'), toLang, depth + 1) : ''
    if (nested) url.searchParams.set('return', nested)
    else url.searchParams.delete('return')
  }
  return ctx.safeReturn(url.pathname + url.search + url.hash)
}

export function buildData(ctx, raw, gallery) {
  ctx.fishData = raw.fish || {}
  ctx.visuals = gallery.fishVisuals || {}
  ctx.species = {}
  for (const [rawId, record] of Object.entries(ctx.fishData)) {
    const id = ctx.idNorm(rawId),
      visual = ctx.visuals[id] || {}
    ctx.species[id] = ctx.speciesRecord(id, record, visual)
    for (const location of record.locations || []) ctx.addFishLocation(id, location)
    ctx.species[id].stages = [...new Set(ctx.species[id].stages)].sort((a, b) => a - b)
  }
  ctx.indexMapSections()
}
export function speciesRecord(ctx, id, record, visual) {
  const variants = [
    ...(visual.nameThVariants || []),
    ...(visual.nameLatinVariants || []),
    ...(visual.nameJapaneseVariants || []),
  ]
  const name =
    ctx.lang === 'ja'
      ? visual.nameJa || record.nameJa
      : ctx.lang === 'th'
        ? visual.nameTh || visual.nameThVariants?.join(' / ') || `${record.nameJa} · ID ${id}`
        : visual.nameLatin ||
          visual.nameLatinVariants?.slice().sort((a, b) => b.length - a.length)[0] ||
          visual.nameEn ||
          `${record.nameJa} · ID ${id}`
  const aliases = [
    id,
    record.nameJa,
    visual.nameJa,
    visual.nameEn,
    visual.nameLatin,
    visual.nameTh,
    ...variants,
  ].filter(Boolean)
  return {
    id,
    record,
    visual,
    name,
    aliases: [...new Set(aliases.map((v) => String(v).toLocaleLowerCase()))],
    stages: [],
  }
}
export function addFishLocation(ctx, id, location) {
  const stage = Number(location.stage)
  ctx.species[id].stages.push(stage)
  let data = ctx.stages[stage]
  if (!data) {
    const overview = location.overview || {}
    data = ctx.stages[stage] = {
      stage,
      name: ctx.local(location.stageName),
      fullImage:
        location.maps?.[0]?.fullImage || `maps/rom-field-${String(stage).padStart(2, '0')}.png`,
      width: Number(overview.rotated ? overview.height : overview.width),
      height: Number(overview.rotated ? overview.width : overview.height),
      overview,
      species: new Set(),
      pins: new Map(),
      sections: new Map(),
    }
  }
  data.species.add(id)
  for (const point of location.points || []) {
    const x = Number(point.x),
      y = Number(point.y),
      key = `${x},${y}`
    let pin = data.pins.get(key)
    if (!pin) data.pins.set(key, (pin = { x, y, fishIds: [] }))
    if (!pin.fishIds.includes(id)) pin.fishIds.push(id)
  }
}
export function indexMapSections(ctx) {
  for (const data of Object.values(ctx.stages))
    for (const pin of data.pins.values()) {
      const col = Math.floor((pin.x * 16 + 8) / 384),
        row = Math.floor((pin.y * 16 + 8) / 384),
        key = `s${data.stage}-c${col + 1}-r${row + 1}`
      let section = data.sections.get(key)
      if (!section) data.sections.set(key, (section = { key, col, row, pins: [] }))
      section.pins.push(pin)
    }
}

export function updateUrl(ctx) {
  const params = new URLSearchParams()
  const anchor = ctx.openNotebookGuide
    ? '#notebook-guide'
    : location.hash === '#map-view'
      ? '#map-view'
      : ''
  params.set('stage', String(ctx.activeStage))
  if (ctx.returnPath) params.set('return', ctx.returnPath)
  if (ctx.activeSection) params.set('section', ctx.activeSection)
  if (ctx.selectedFish) params.set('fish', ctx.selectedFish)
  if (ctx.listScope === 'section') params.set('scope', 'section')
  history.replaceState(null, '', `${location.pathname}?${params.toString()}${anchor}`)
  ctx.updateLanguageLinks(params)
}

export function updateLanguageLinks(ctx, params) {
  document.querySelectorAll('.language-links a').forEach((link) => {
    const paramsCopy = new URLSearchParams(params)
    const route = (link.dataset.route || link.getAttribute('href') || '').split('?')[0]
    link.dataset.route = route
    const toLang = link.getAttribute('hreflang')
    if (ctx.returnPath && ['en', 'th', 'ja'].includes(toLang))
      paramsCopy.set('return', ctx.localizeReturn(ctx.returnPath, toLang))
    link.href = `${route}?${paramsCopy.toString()}${location.hash === '#notebook-guide' || location.hash === '#map-view' ? location.hash : ''}`
  })
}

export function fishInStage(ctx, id, stage) {
  return (ctx.species[id]?.stages || []).includes(Number(stage))
}

export function areaCount(ctx, stage) {
  return ctx.stages[stage]?.species.size || 0
}

export function chooseSection(ctx, stage, preferredKey = '') {
  const data = ctx.stages[stage],
    sections = [...(data?.sections.values() || [])]
  if (!sections.length) return ''
  if (preferredKey && data.sections.has(preferredKey)) return preferredKey
  if (ctx.selectedFish) {
    const forFish = sections
      .map((s) => ({
        ...s,
        count: s.pins.filter((p) => p.fishIds.includes(ctx.selectedFish)).length,
      }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count || a.row - b.row || a.col - b.col)
    if (forFish.length) return forFish[0].key
  }
  return sections.sort((a, b) => b.pins.length - a.pins.length || a.row - b.row || a.col - b.col)[0]
    .key
}

export function renderAreas(ctx) {
  ctx.areaList.innerHTML = Object.values(ctx.stages)
    .sort((a, b) => a.stage - b.stage)
    .map((data) => {
      const targetHere = !ctx.selectedFish || data.species.has(ctx.selectedFish)
      const pressed = data.stage === ctx.activeStage
      const small = ctx.selectedFish
        ? targetHere
          ? ctx.c.targetAvailable
          : ctx.c.targetAbsent
        : ctx.c.allArea(data.species.size)
      return `<button class="area-button" type="button" data-stage="${data.stage}" aria-pressed="${pressed}" ${ctx.selectedFish && !targetHere ? 'disabled' : ''}><strong>${ctx.esc(ctx.c.area(data.stage))}</strong><small>${ctx.esc(data.name)} · ${ctx.esc(small)}</small></button>`
    })
    .join('')
}

export function searchable(ctx, id) {
  return ctx.species[id].aliases.join(' · ')
}

export function normalizedSearch(ctx, value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase()
}

export function matchingSuggestions(ctx, term) {
  const query = ctx.normalizedSearch(term)
  if (!query) return []
  return Object.keys(ctx.species)
    .filter(
      (id) =>
        ctx.species[id].stages.length && ctx.normalizedSearch(ctx.searchable(id)).includes(query),
    )
    .sort((a, b) => {
      const rank = (id) => {
        const record = ctx.species[id]
        if (
          ctx.normalizedSearch(id) === query ||
          record.aliases.some((alias) => ctx.normalizedSearch(alias) === query)
        )
          return 0
        if (record.aliases.some((alias) => ctx.normalizedSearch(alias).startsWith(query))) return 1
        return 2
      }
      return (
        rank(a) - rank(b) ||
        ctx.fishName(a).localeCompare(ctx.fishName(b), ctx.lang) ||
        a.localeCompare(b)
      )
    })
}

export function setSuggestionsExpanded(ctx, expanded) {
  ctx.searchInput.setAttribute('aria-expanded', String(Boolean(expanded)))
  if (!expanded) ctx.searchInput.removeAttribute('aria-activedescendant')
}

export function closeSuggestions(ctx, dismiss = true) {
  if (dismiss) ctx.suggestionsDismissed = true
  ctx.activeSuggestion = -1
  ctx.suggestionList.hidden = true
  ctx.fishList.hidden = false
  ctx.setSuggestionsExpanded(false)
}

export function renderSuggestions(ctx) {
  const matches = ctx.matchingSuggestions(ctx.searchInput.value)
  ctx.suggestionIds = matches.slice(0, ctx.suggestionLimit)
  ctx.activeSuggestion = -1
  const open =
    Boolean(ctx.searchInput.value.trim()) &&
    !ctx.suggestionsDismissed &&
    document.activeElement === ctx.searchInput &&
    ctx.suggestionIds.length > 0
  const areaLabel = ctx.lang === 'th' ? 'พื้นที่' : ctx.lang === 'ja' ? 'エリア' : 'Areas'
  ctx.suggestionList.innerHTML = ctx.suggestionIds
    .map((id, index) => {
      const item = ctx.species[id],
        image = item.visual.image || ''
      const areaBadges = item.stages
        .map((stage) => `<span class="suggestion-area-badge">${ctx.esc(ctx.c.area(stage))}</span>`)
        .join('')
      const secondary =
        ctx.lang === 'ja'
          ? item.visual.nameLatin || item.visual.nameTh || ''
          : item.visual.nameJa || ''
      const targetClass = ctx.selectedFish === id ? ' is-map-target' : ''
      return `<div id="fish-suggestion-${id}" class="fish-suggestion${targetClass}" role="option" aria-selected="false" aria-posinset="${index + 1}" aria-setsize="${matches.length}" data-suggestion="${id}">${image ? `<img src="${ctx.esc(image)}" alt="">` : '<span class="suggestion-no-image" aria-hidden="true"></span>'}<span class="suggestion-copy"><strong>${ctx.esc(item.name)}</strong>${secondary && secondary !== item.name ? `<small class="suggestion-alias">${ctx.esc(secondary)}</small>` : ''}<span class="suggestion-meta"><code>ID ${ctx.esc(id)}</code><span class="suggestion-area-label">${areaLabel}</span><span class="suggestion-areas">${areaBadges}</span></span></span></div>`
    })
    .join('')
  ctx.suggestionList.hidden = !open
  ctx.fishList.hidden = open
  ctx.setSuggestionsExpanded(open)
}

export function setActiveSuggestion(ctx, index) {
  if (!ctx.suggestionIds.length) return
  ctx.activeSuggestion = (index + ctx.suggestionIds.length) % ctx.suggestionIds.length
  const options = ctx.suggestionList.querySelectorAll('[role="option"]')
  options.forEach((option, optionIndex) =>
    option.setAttribute('aria-selected', String(optionIndex === ctx.activeSuggestion)),
  )
  const id = ctx.suggestionIds[ctx.activeSuggestion],
    option = document.getElementById(`fish-suggestion-${id}`)
  if (option) {
    ctx.searchInput.setAttribute('aria-activedescendant', option.id)
    option.scrollIntoView?.({ block: 'nearest' })
  }
}

export function chooseSuggestion(ctx, id) {
  if (!ctx.species[id]?.stages?.length) return
  const visual = ctx.species[id].visual
  const localeAliases =
    ctx.lang === 'th'
      ? [
          visual.nameTh,
          ...(visual.nameThVariants || []),
          visual.nameLatin,
          ...(visual.nameLatinVariants || []),
          visual.nameJa,
          id,
        ]
      : ctx.lang === 'ja'
        ? [
            visual.nameJa,
            visual.nameLatin,
            ...(visual.nameLatinVariants || []),
            visual.nameTh,
            ...(visual.nameThVariants || []),
            id,
          ]
        : [
            visual.nameEn,
            visual.nameLatin,
            ...(visual.nameLatinVariants || []),
            visual.nameJa,
            visual.nameTh,
            ...(visual.nameThVariants || []),
            id,
          ]
  ctx.searchInput.value =
    localeAliases.find(
      (alias) =>
        alias &&
        ctx.species[id].aliases.some(
          (value) => ctx.normalizedSearch(value) === ctx.normalizedSearch(alias),
        ),
    ) || id
  ctx.searchTerm = ctx.searchInput.value
  ctx.closeSuggestions(true)
  ctx.setFish(id, { toggle: false })
}

export function renderFishList(ctx) {
  const term = ctx.normalizedSearch(ctx.searchTerm)
  const sectionIds = new Set(
    ctx.stages[ctx.activeStage]?.sections
      .get(ctx.activeSection)
      ?.pins.flatMap((pin) => pin.fishIds) || [],
  )
  const ids = Object.keys(ctx.species)
    .filter((id) =>
      term
        ? ctx.normalizedSearch(ctx.searchable(id)).includes(term)
        : ctx.listScope === 'section'
          ? sectionIds.has(id)
          : ctx.fishInStage(id, ctx.activeStage),
    )
    .sort((a, b) => ctx.fishName(a).localeCompare(ctx.fishName(b), ctx.lang))
  ctx.renderFishListHeader(term, ids)
  ctx.fishList.innerHTML = ids.length
    ? ids.map((id) => ctx.fishChoice(id, term, sectionIds)).join('')
    : `<div class="empty-list">${ctx.esc(ctx.c.noFish)}</div>`
}

export function renderFishListHeader(ctx, term, ids) {
  const header = ctx.$('fish-title')
  header.textContent = term
    ? ctx.c.searchResults
    : ctx.listScope === 'section'
      ? ctx.lang === 'th'
        ? 'ปลาในส่วนแผนที่นี้'
        : ctx.lang === 'ja'
          ? 'この地図範囲の魚'
          : 'Fish in this map section'
      : ctx.c.fishIn
  ctx.$('fish-scope').innerHTML = [
    ['area', ctx.lang === 'th' ? 'ทั้งด่าน' : ctx.lang === 'ja' ? 'エリア全体' : 'Whole area'],
    [
      'section',
      ctx.lang === 'th' ? 'ส่วนที่กำลังดู' : ctx.lang === 'ja' ? '表示範囲' : 'Current section',
    ],
  ]
    .map(
      ([value, label]) =>
        `<button type="button" data-scope="${value}" aria-pressed="${ctx.listScope === value}">${label}</button>`,
    )
    .join('')
  ctx.$('area-summary').textContent = term
    ? `${ids.length} ${ctx.c.fish} · ${ctx.c.areas} ${ctx.lang === 'ja' ? 'で出現' : ctx.lang === 'th' ? 'ที่พบ' : 'with configured points'}`
    : `${ctx.c.area(ctx.activeStage)} · ${ids.length} ${ctx.c.fish}`
  ctx.$('search-count').textContent = `${ids.length} ${ctx.c.fish}`
  ctx.$('show-all').textContent = ctx.c.showAll
  ctx.fishList.hidden = false
  ctx.renderSuggestions()
}
export function fishChoice(ctx, id, term, sectionIds) {
  const item = ctx.species[id],
    img = item.visual.image || ''
  const availability = item.stages.join(', ')
  const pointCount = [...(ctx.stages[ctx.activeStage]?.pins.values() || [])].filter(
    (pin) =>
      pin.fishIds.includes(id) &&
      (ctx.listScope !== 'section' ||
        (sectionIds.has(id) &&
          ctx.stages[ctx.activeStage].sections.get(ctx.activeSection)?.pins.includes(pin))),
  ).length
  const sub = term
    ? `${ctx.c.areasPrefix} ${availability}`
    : `${ctx.c.point(pointCount)}${item.visual.nameJa && ctx.lang !== 'ja' ? ` · ${item.visual.nameJa}` : ''}`
  return `<div class="fish-choice-row ${ctx.selectedFish === id ? 'selected' : ''}"><a class="fish-portrait-link" href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(item.name)} — ${ctx.detailLabel}">${img ? `<img loading="lazy" src="${ctx.esc(img)}" alt="${ctx.esc(item.name)}">` : ''}</a><button class="fish-choice" type="button" data-fish="${id}" aria-pressed="${ctx.selectedFish === id}"><span>${ctx.esc(item.name)}<small>${ctx.esc(sub)}</small><small class="filter-action">${ctx.lang === 'th' ? 'เน้นบนแผนที่' : ctx.lang === 'ja' ? '地図で絞り込む' : 'Focus on map'}</small></span></button><a class="fish-details-link" href="${ctx.esc(ctx.fishHref(id))}">${ctx.detailLabel} ↗</a></div>`
}
