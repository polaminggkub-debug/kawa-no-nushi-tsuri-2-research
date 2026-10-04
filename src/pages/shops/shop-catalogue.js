export function renderLocations(ctx, locations, mapManifest, stage, place, items) {
  const area = locations?.areas?.find((a) => Number(a.outdoorArea) === stage)
  const visuals = ctx.$('location-visuals')
  const mapId = ctx.$('location-map-id')
  const summary = ctx.$('location-summary')
  const mapSetId = place === 'outdoor' ? stage : stage + 6
  const fieldMapSet = mapManifest?.mapSets?.[`mapSet${String(stage).padStart(2, '0')}`]
  ctx.$('location-area').textContent =
    place === 'outdoor' ? ctx.text.outdoor(stage) : ctx.text.town(stage)
  mapId.textContent = ctx.text.mapSetEvidence(place, mapSetId)
  ctx.$('location-heading').textContent =
    place === 'outdoor' ? ctx.text.fieldHeading : ctx.text.townHeading
  visuals.innerHTML = ''
  if (!area) {
    summary.textContent = locations ? ctx.text.noLocations : ctx.text.warningLocations
    visuals.innerHTML = `<p class="empty-state">${ctx.esc(locations ? ctx.text.mapNoEntrances : ctx.text.warningLocations)}</p>`
    return
  }
  const view = ctx.locationModel(area, fieldMapSet, stage, place, summary)
  const cards =
    place === 'outdoor'
      ? view.entrances.map((entry) => ctx.fieldEntranceCard(view, entry))
      : ctx.townLocationCards(view, items)
  visuals.innerHTML =
    cards.join('') ||
    `<p class="empty-state">${ctx.esc(view.excludedPoints ? ctx.text.noValidPoint : place === 'outdoor' ? ctx.text.mapNoEntrances : ctx.text.noLocations)}</p>`
  ctx.drawMapCanvases()
}
export function locationModel(ctx, area, fieldMapSet, stage, place, summary) {
  const fieldMap = ctx.mapAsset(fieldMapSet?.fieldMap?.image || fieldMapSet?.fieldMap?.imageUrl)
  const townMap = ctx.mapAsset(area.townTerrain?.image)
  summary.textContent =
    place === 'outdoor'
      ? `${ctx.text.area(stage)}. ${fieldMapSet?.name?.[ctx.lang] || ''}`
      : `${ctx.text.townSummary(stage)}.`
  const allEntrances = Array.isArray(area.entrances) ? area.entrances : []
  let entrances = allEntrances.filter(
    (entry) =>
      ctx.pointWithin(entry.fieldTile, fieldMapSet?.fieldMap) &&
      ctx.pointWithin(entry.townArrival, area.townTerrain) &&
      (!entry.townArrival?.mapId || Number(entry.townArrival.mapId) === Number(area.townMapId)),
  )
  if (ctx.focusedEntrance !== null)
    entrances = entrances.filter((entry) => Number(entry.ordinal) === ctx.focusedEntrance)
  const allInteractions = Array.isArray(area.interactions) ? area.interactions : []
  const interactions = allInteractions.filter((node) =>
    ctx.pointWithin(node.townTile, area.townTerrain),
  )
  const excludedPoints =
    allEntrances.length - entrances.length + (allInteractions.length - interactions.length)
  if (excludedPoints) summary.textContent += ` ${ctx.text.invalidPoints}`
  if (place === 'outdoor' && ctx.focusedEntrance !== null)
    summary.textContent += ` ${ctx.text.focusedEntrance(ctx.focusedEntrance)}`

  return {
    area,
    fieldMapSet,
    stage,
    place,
    fieldMap,
    townMap,
    entrances,
    interactions,
    excludedPoints,
  }
}

export function fieldEntranceCard(ctx, view, entry) {
  const { fieldMap, fieldMapSet } = view
  const n = Number(entry.ordinal ?? 0)
  const arrival = entry.townArrival
  const pair = arrival
    ? `<p class="seller-description">${ctx.esc(ctx.text.arrival)} · ${ctx.esc(ctx.text.coord(arrival.x, arrival.y))}</p><a class="route-button" href="${ctx.esc(ctx.shopsUrl({ place: 'town', entrance: String(n) }))}">${ctx.esc(ctx.text.openTownArrival)}</a>`
    : ''
  return ctx.mapCard({
    heading: ctx.text.entrance(n),
    role: ctx.text.outside,
    note: ctx.text.pairNote,
    image: fieldMap,
    coord: entry.fieldTile,
    bounds: fieldMapSet?.fieldMap,
    source: entry.source ? Object.values(entry.source).join(' · ') : '',
    tech: { [ctx.text.entranceOrdinal]: n, [ctx.text.kind]: 'field-to-town transition' },
    extra: pair,
  })
}
export function townArrivalCard(ctx, view, entry) {
  const { area, townMap } = view
  const n = Number(entry.ordinal ?? 0)
  const fieldHref = ctx.shopsUrl({ place: 'area', entrance: String(n) })
  const action = `<a class="route-button" href="${ctx.esc(fieldHref)}">${ctx.esc(ctx.text.openEntrance)}</a>`
  return ctx.mapCard({
    heading: `${ctx.text.entrance(n)} · ${ctx.text.arrival}`,
    role: '',
    note: ctx.text.pairNote,
    image: townMap,
    coord: entry.townArrival,
    bounds: area.townTerrain,
    source: entry.source ? Object.values(entry.source).join(' · ') : '',
    tech: { [ctx.text.entranceOrdinal]: n, [ctx.text.kind]: 'paired field transition' },
    extra: action,
  })
}
export function townLocationCards(ctx, view, items) {
  const { area, stage, interactions, entrances } = view
  const targetItem =
    ctx.targetCategory && ctx.targetId
      ? ctx.findItem(items, ctx.targetCategory, ctx.targetId)
      : null
  const targetSpecial = targetItem && ctx.isSpecial(targetItem, stage)
  const relevantKind = targetItem ? (targetSpecial ? 'special-rod-shop' : 'regular-shop') : ''
  const relevantNodes = interactions.filter(
    (node) =>
      ['regular-shop', 'special-rod-shop'].includes(node.kind) &&
      (!relevantKind || node.kind === relevantKind),
  )
  const accessFor = (node) =>
    (area.verifiedAccess || []).find(
      (access) =>
        String(access.interactionSlotHex || '').toUpperCase() ===
        String(node.interactionSlotHex || node.slotHex || '').toUpperCase(),
    )
  const linkedOrdinals = new Set(
    relevantNodes
      .map((node) => accessFor(node)?.entranceOrdinal)
      .filter(
        (value) =>
          value !== undefined && value !== null && value !== '' && Number.isInteger(Number(value)),
      )
      .map(Number),
  )
  const visibleEntrances =
    targetItem && linkedOrdinals.size
      ? entrances.filter((entry) => linkedOrdinals.has(Number(entry.ordinal)))
      : entrances
  const entranceCards =
    targetItem && linkedOrdinals.size
      ? []
      : visibleEntrances.map((entry) => ctx.townArrivalCard(view, entry))
  const shopCards = relevantNodes.map((node) =>
    ctx.sellerLocationCard(view, node, accessFor(node), targetItem),
  )
  return [...shopCards, ...entranceCards]
}
export function sellerLocationCard(ctx, view, node, access, targetItem) {
  const { area, entrances, townMap } = view
  const role = node.kind === 'regular-shop' ? ctx.text.regular : ctx.text.special
  const detail = node.kind === 'regular-shop' ? ctx.text.regularNote : ctx.text.specialNote
  const hasOrdinal =
    access?.entranceOrdinal !== undefined &&
    access?.entranceOrdinal !== null &&
    Number.isInteger(Number(access.entranceOrdinal))
  const linkedEntrance = hasOrdinal
    ? entrances.find((e) => Number(e.ordinal) === Number(access.entranceOrdinal))
    : null
  const note = linkedEntrance
    ? ctx.text.linkedEntrance(Number(linkedEntrance.ordinal), linkedEntrance.townArrival)
    : ctx.text.endpointNote
  const heading = `${role} · ${ctx.text.shopPoint}`
  const fieldHref = linkedEntrance
    ? ctx.shopsUrl({ place: 'area', entrance: String(linkedEntrance.ordinal) })
    : ''
  const actions = ctx.sellerStockActions(node, targetItem, linkedEntrance, fieldHref)
  const tested = access?.probe?.controls?.length
    ? `${ctx.text.testedInputs}: ${access.probe.controls.join(' → ')}`
    : ''
  return ctx.mapCard({
    heading,
    role,
    note: `${detail} ${note}`,
    image: townMap,
    coord: node.townTile,
    bounds: area.townTerrain,
    source:
      node.source?.description ||
      `${node.source?.pointerFileOffset || ''} ${node.source?.pointerFileOffset ? '→ ' : ''}${node.source?.coordinateFileOffset || ''}`.trim(),
    tech: {
      [ctx.text.kind]: role,
      [ctx.text.entranceOrdinal]: access?.entranceOrdinal,
      [ctx.text.slot]: node.interactionSlotHex || node.slotHex,
      [ctx.text.mode]: node.mode,
      handler: node.handler,
      [ctx.text.testedInputs]: tested,
      result: access?.probe?.result,
    },
    extra: actions,
  })
}
export function sellerStockActions(ctx, node, targetItem, linkedEntrance, fieldHref) {
  const currentTargetIsBundle =
    targetItem && ['fly', 'fly_wing', 'fly_tail'].includes(targetItem.category)
  const stockAnchor = currentTargetIsBundle
    ? 'bundle-stock'
    : node.kind === 'special-rod-shop'
      ? 'special-stock'
      : 'regular-stock'
  const stockCategory = targetItem
    ? targetItem.category
    : node.kind === 'special-rod-shop'
      ? 'rod'
      : 'all'
  const stockQuery = ctx.shopsUrl({
    place: 'town',
    category: stockCategory,
    id: targetItem ? targetItem.id : '',
    q: '',
  })
  const actions = `${linkedEntrance ? `<a class="route-button" href="${ctx.esc(fieldHref)}">${ctx.esc(ctx.text.openEntrance)}</a>` : ''}<a class="stock-jump" href="${ctx.esc(stockQuery + '#' + stockAnchor)}">${ctx.esc(ctx.text.viewOffers)}</a>`
  return actions
}

export function findItem(ctx, items, category, id) {
  return items.find(
    (item) =>
      item.category === category && String(item.id).toUpperCase() === String(id).toUpperCase(),
  )
}

export function isSpecial(ctx, item, stage) {
  return (item.playerUse?.shops || []).some(
    (s) => Number(s.stage) === stage && s.shop === 'special_rod_shop',
  )
}

export function itemTargetLink(ctx, category, id) {
  const item = ctx.findItem(window.__shopItems || [], category, id)
  if (!item) return ''
  return `<a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(ctx.itemName(item))} · ID ${ctx.esc(item.id)} ↗</a>`
}

export function offerCard(ctx, item, options = {}) {
  const target = options.target === true
  const special = options.special === true
  const condition = item.category === 'bait' && item.id === '17' && Number(options.stage) === 3
  const shopOffer = (item.playerUse?.shops || []).find(
    (s) => Number(s.stage) === Number(options.stage),
  )
  const canHaveCondition = condition && shopOffer?.condition
  const image = ctx.imagePath(item.image)
  const name = ctx.itemName(item)
  const price = item.priceYen != null ? ctx.text.price(item.priceYen) : ctx.text.noPrice
  const extra = canHaveCondition
    ? `<p class="condition"><strong>${ctx.esc(ctx.text.conditionTitle)}:</strong> ${ctx.esc(ctx.text.ayu)} <a href="${ctx.esc(ctx.fishHref('38'))}">${ctx.esc(ctx.text.ayuFish)}</a></p>`
    : ''
  return `<article class="offer-card${target ? ' is-target' : ''}" data-offer="${ctx.esc(item.category)}:${ctx.esc(item.id)}">
      ${target ? `<span class="target-badge">${ctx.esc(ctx.text.targetBadge)}</span>` : ''}${special ? `<span class="shop-kind">${ctx.esc(ctx.text.special)}</span>` : ''}
      <a class="offer-image-link" href="${ctx.esc(ctx.itemHref(item))}"><img loading="lazy" src="${ctx.esc(image)}" alt="${ctx.esc(name)}"></a>
      <p class="small-id">${ctx.esc(ctx.catName(item.category))} · ID ${ctx.esc(item.id)}</p>
      <h4><a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(name)}</a></h4>
      <p class="price">${ctx.esc(price)}</p>${canHaveCondition ? `<p class="condition-label">${ctx.esc(ctx.text.soldConditional)}</p>` : ''}${extra}
    </article>`
}

export function bundleCard(ctx, bundle, stage, items, target) {
  const components = [
    ['fly', bundle.body],
    ['fly_wing', bundle.wing],
    ['fly_tail', bundle.tail],
  ]
    .filter(([, id]) => id && id !== '00')
    .map(([category, id]) => ctx.findItem(items, category, id))
    .filter(Boolean)
  const selected = components.some(
    (item) => target.category === item.category && target.id === item.id,
  )
  const parts = components
    .map(
      (item) =>
        `<a class="bundle-part" href="${ctx.esc(ctx.itemHref(item))}" title="${ctx.esc(ctx.itemName(item))}"><img loading="lazy" src="${ctx.esc(ctx.imagePath(item.image))}" alt="${ctx.esc(ctx.itemName(item))}"></a>`,
    )
    .join('<span class="bundle-plus" aria-hidden="true">+</span>')
  const labels = components
    .map((item) => `<span>${ctx.itemTargetLink(item.category, item.id)}</span>`)
    .join('')
  return `<article class="offer-card${target.id && selected ? ' is-target' : ''}" data-offer="fly-bundle:${bundle.slot}">
      ${selected ? `<span class="target-badge">${ctx.esc(ctx.text.targetBadge)}</span>` : ''}
      <span class="shop-kind">${ctx.esc(ctx.text.bundle)}</span><p class="small-id">${ctx.esc(ctx.text.stageWord(stage))} · ${ctx.esc(ctx.text.parts)}</p>
      <div class="bundle-parts">${parts}</div><div class="bundle-labels">${labels}</div>
      <p class="price">${ctx.esc(ctx.text.complete)} · ${ctx.esc(ctx.text.price(bundle.shopPriceYen))}</p>
    </article>`
}

export function filterItems(ctx, items, category, query) {
  const q = query.trim().normalize('NFKC').toLocaleLowerCase()
  const tokens = q
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.replace(/^0x(?=[0-9a-f]{1,2}$)/i, ''))
  return items.filter((item) => {
    if (category && category !== 'all' && item.category !== category) return false
    if (!tokens.length) return true
    const haystack = [
      item.id,
      item.nameEn,
      item.nameJa,
      item.nameTh,
      item.playerUse?.displayName?.en,
      item.playerUse?.displayName?.ja,
      item.playerUse?.displayName?.th,
      item.categoryEn,
      item.categoryJa,
      item.categoryTh,
      item.search,
    ]
      .filter(Boolean)
      .join(' ')
      .normalize('NFKC')
      .toLocaleLowerCase()
    return tokens.every((token) => haystack.includes(token))
  })
}

export function renderTarget(ctx, items, stock, stage) {
  const box = ctx.$('target-status')
  box.innerHTML = ''
  if (!ctx.targetCategory || !ctx.targetId) return
  const target = ctx.findItem(items, ctx.targetCategory, ctx.targetId)
  if (!target) {
    box.textContent = ctx.text.noTarget
    return
  }
  const isBundlePart = ['fly', 'fly_wing', 'fly_tail'].includes(target.category)
  let stocked =
    stock.areas
      .find((a) => Number(a.stage) === stage)
      ?.items.some((i) => i.category === target.category && i.id === target.id) || false
  let conditional = target.category === 'bait' && target.id === '17' && stage === 3
  const partKey = { fly: 'body', fly_wing: 'wing', fly_tail: 'tail' }[target.category]
  const inBundle = (b) => partKey && String(b[partKey] || '').toUpperCase() === target.id
  const currentArea = stock.areas.find((a) => Number(a.stage) === stage)
  const found = isBundlePart ? (currentArea?.flyBundles || []).some(inBundle) : stocked
  const recordedStages = new Set(
    isBundlePart
      ? []
      : stock.areas
          .filter((a) => a.items.some((i) => i.category === target.category && i.id === target.id))
          .map((a) => Number(a.stage)),
  )
  if (isBundlePart)
    for (const a of stock.areas)
      if ((a.flyBundles || []).some(inBundle)) recordedStages.add(Number(a.stage))
  const links = [...recordedStages]
    .sort((a, b) => a - b)
    .map(
      (n) =>
        `<a class="stage-link" href="${ctx.esc(ctx.shopsUrl({ stage: n, category: ctx.targetCategory, id: ctx.targetId }))}">${ctx.esc(ctx.text.browseArea(n))}</a>`,
    )
    .join(' ')
  box.innerHTML = `<strong>${ctx.esc(found ? ctx.text.targetFound : ctx.text.targetNotHere)}</strong>${conditional ? `<p>${ctx.esc(ctx.text.soldConditional)}</p>` : ''}${!found && links ? `<p>${ctx.esc(ctx.text.soldElsewhere)} ${links}</p>` : ''}`
}

export function shopsUrl(ctx, overrides = {}) {
  const q = ctx.stateParams(overrides)
  return `${ctx.pages.shops[ctx.lang]}?${q.toString()}${location.hash}`
}

export function renderOffers(ctx, items, stock, stage, category, query) {
  const area = stock.areas.find((a) => Number(a.stage) === stage)
  const list = ctx.$('shop-results')
  const target = { category: ctx.targetCategory, id: ctx.targetId }
  if (!area) {
    list.innerHTML = `<p class="empty-state">${ctx.esc(ctx.text.noCategory)}</p>`
    return
  }
  const stockItems = area.items
    .map((record) => ctx.findItem(items, record.category, record.id))
    .filter(Boolean)
  const bundledCategory = (item) => ['fly', 'fly_wing', 'fly_tail'].includes(item.category)
  const standard = stockItems.filter(
    (item) => !ctx.isSpecial(item, stage) && !bundledCategory(item),
  )
  const rods = stockItems.filter((item) => ctx.isSpecial(item, stage) && !bundledCategory(item))
  const bundles = area.flyBundles || []
  const filtered = ctx.filterItems(standard, category, query)
  const filteredSpecial = ctx.filterItems(rods, category, query)
  const filteredBundles = bundles.filter((bundle) =>
    ctx.bundleMatches(items, bundle, category, query),
  )
  const offers = filtered.length + filteredSpecial.length + filteredBundles.length
  ctx.$('offer-count').textContent = ctx.text.filtered(offers)
  ctx.renderTarget(items, stock, stage)
  const groups = []
  if (filtered.length)
    groups.push(
      `<section class="seller-group" id="regular-stock"><h3>${ctx.esc(ctx.text.regular)}</h3><p class="seller-description">${ctx.esc(ctx.text.regularNote)}</p><div class="offer-grid">${filtered.map((item) => ctx.offerCard(item, { stage, target: target.category === item.category && target.id === item.id })).join('')}</div></section>`,
    )
  if (filteredBundles.length)
    groups.push(
      `<section class="seller-group" id="bundle-stock"><h3>${ctx.esc(ctx.text.bundle)}</h3><p class="seller-description">${ctx.esc(ctx.text.evidenceBundles)}</p><div class="offer-grid">${filteredBundles.map((bundle) => ctx.bundleCard(bundle, stage, items, target)).join('')}</div></section>`,
    )
  if (filteredSpecial.length)
    groups.push(
      `<section class="seller-group" id="special-stock"><h3>${ctx.esc(ctx.text.special)}</h3><p class="seller-description">${ctx.esc(ctx.text.specialNote)}</p><div class="offer-grid">${filteredSpecial.map((item) => ctx.offerCard(item, { stage, special: true, target: target.category === item.category && target.id === item.id })).join('')}</div></section>`,
    )
  if (!offers)
    groups.push(
      `<div class="empty-state"><h3>${ctx.esc(ctx.text.none)}</h3><p>${ctx.esc(ctx.text.area(stage))}</p></div>`,
    )
  list.innerHTML = groups.join('')
}

export function bundleMatches(ctx, items, bundle, category, query) {
  const components = [
    ctx.findItem(items, 'fly', bundle.body),
    ctx.findItem(items, 'fly_wing', bundle.wing),
    ctx.findItem(items, 'fly_tail', bundle.tail),
  ].filter(Boolean)
  const matchesCategory =
    !category ||
    category === 'all' ||
    components.some((item) => item.category === category) ||
    category === 'fly'
  const q = query.trim().normalize('NFKC').toLocaleLowerCase()
  const matchesQuery =
    !q ||
    q
      .split(/\s+/)
      .every((token) =>
        components.some((item) =>
          [
            item.id,
            item.nameEn,
            item.nameJa,
            item.nameTh,
            item.playerUse?.displayName?.th,
            item.search,
          ]
            .filter(Boolean)
            .join(' ')
            .normalize('NFKC')
            .toLocaleLowerCase()
            .includes(token),
        ),
      )
  return matchesCategory && matchesQuery
}
