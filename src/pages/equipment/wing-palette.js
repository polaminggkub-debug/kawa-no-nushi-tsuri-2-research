function itemDisplayName(ctx, item) {
  return item.playerUse?.displayName?.[ctx.lang] || ctx.itemName(item)
}

function findWingItem(ctx, wingId) {
  const item = ctx.allItems.find((entry) => entry.category === 'fly_wing' && entry.id === wingId)
  if (!item) throw new Error(`Missing catalogue record for Mayfly wing ${wingId}`)
  return item
}

function wingItemHref(ctx, item) {
  const target = new URL(ctx.itemHref(item), 'https://example.invalid/catalogue/')
  const returned = target.searchParams.get('return')
  if (returned) target.searchParams.set('return', `${returned.split('#')[0]}#wing-palette-title`)
  return `${target.pathname.split('/').pop()}${target.search}${target.hash}`
}

function renderColumnHeaders(ctx, palette, copy) {
  const columns = Array.from({ length: palette.menu.columns }, (_, index) => index + 1)
  return columns.map((column) => `<th scope="col">${ctx.esc(copy.column)} ${column}</th>`).join('')
}

function renderChoice(ctx, position, copy) {
  const item = findWingItem(ctx, position.wingId)
  const name = itemDisplayName(ctx, item)
  const location = `${copy.column} ${position.column}, ${copy.row} ${position.row}`
  const label = `${copy.openItem}: ${name}, ID ${position.wingId}; ${location}`
  return `<td data-wing-cell="${position.wingId}"><a class="wing-palette__choice" data-wing-choice="${position.wingId}" data-wing-row="${position.row}" data-wing-column="${position.column}" href="${ctx.esc(wingItemHref(ctx, item))}" aria-label="${ctx.esc(label)}"><img loading="lazy" src="${ctx.esc(item.image)}" alt=""><span class="wing-palette__choice-id">${ctx.esc(position.wingId)}</span><span class="wing-palette__choice-name">${ctx.esc(name)}</span><span class="wing-palette__choice-open"><span class="wing-palette__choice-open-label">${ctx.esc(copy.openItem)}</span> ↗</span></a></td>`
}

function renderRow(ctx, palette, row, copy) {
  const cells = Array.from({ length: palette.menu.columns }, (_, index) => {
    const column = index + 1
    const position = palette.positions.find((entry) => entry.column === column && entry.row === row)
    if (!position) throw new Error(`Missing verified Mayfly wing at row ${row}, column ${column}`)
    return renderChoice(ctx, position, copy)
  })
  return `<tr><th scope="row">${ctx.esc(copy.row)} ${row}</th>${cells.join('')}</tr>`
}

function renderGrid(ctx, palette, copy) {
  const rows = Array.from({ length: palette.menu.rows }, (_, index) => index + 1)
  return `<div class="wing-palette__table-wrap"><table class="wing-palette__table"><caption>${ctx.esc(copy.gridCaption)}</caption><thead><tr><th scope="col" class="wing-palette__corner"></th>${renderColumnHeaders(ctx, palette, copy)}</tr></thead><tbody>${rows.map((row) => renderRow(ctx, palette, row, copy)).join('')}</tbody></table></div>`
}

function renderScreenshot(ctx, palette, copy) {
  const shot = palette.screenshot
  return `<figure class="wing-palette__screenshot"><a href="${ctx.esc(shot.path)}" target="_blank" rel="noopener"><img loading="lazy" src="${ctx.esc(shot.path)}" alt="${ctx.esc(copy.screenshotTitle)}"></a><figcaption>${ctx.esc(shot.caption[ctx.lang] || shot.caption.en)}</figcaption></figure>`
}

function renderTechnicalEvidence(ctx, palette, copy) {
  const evidenceLink = `<p><a href="${ctx.esc(palette.evidenceHref)}" target="_blank" rel="noopener">${ctx.esc(copy.evidenceLink)} ↗</a></p>`
  return `<details class="wing-palette__technical"><summary>${ctx.esc(copy.technicalTitle)}</summary><div><p>${ctx.esc(copy.rightEdge)}</p><p>${ctx.esc(copy.noRanking)}</p><p>${ctx.esc(copy.evidence)}</p>${evidenceLink}</div></details>`
}

export function wingPaletteMarkup(ctx, palette) {
  if (!palette?.positions?.length || !ctx.allItems?.length || !ctx.itemHref) return ''
  const copy = palette.copy[ctx.lang] || palette.copy.en
  const titleId = 'wing-palette-title'
  return `<section class="wing-palette" data-wing-palette aria-labelledby="${titleId}"><header class="wing-palette__header"><p class="wing-palette__eyebrow">${ctx.esc(copy.eyebrow)}</p><h3 id="${titleId}">${ctx.esc(copy.title)}</h3><p class="wing-palette__intro">${ctx.esc(copy.intro)}</p><p class="wing-palette__controls" id="wing-palette-controls">${ctx.esc(copy.controls)}</p></header><div class="wing-palette__layout">${renderScreenshot(ctx, palette, copy)}${renderGrid(ctx, palette, copy)}</div>${renderTechnicalEvidence(ctx, palette, copy)}</section>`
}
