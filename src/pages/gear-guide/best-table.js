import {
  bestGearCopy,
  buyOf,
  buyText,
  easeByBand,
  escapeHtml,
  itemName,
  kitSlots,
  maxHtml,
  shownHigh,
} from '../../entities/best-gear/index.js'

const suffixes = { en: '', th: '.th', ja: '.ja' }
const SECOND = { float: 'bait', lure: 'lure', fly: 'fly' }
const LABELS = {
  en: ['Size', 'Rod', 'Hook', 'Fight start', 'Price'],
  th: ['ขนาด', 'คัน', 'เบ็ด', 'การสู้เริ่ม', 'ราคา'],
  ja: ['サイズ', '竿', 'ハリ', 'ファイト開始', '価格'],
}

function fishLink(locale, id) {
  const hex = Number(id).toString(16).toUpperCase().padStart(2, '0')
  return `fish${suffixes[locale]}.html?id=${hex}&return=gear-guide${suffixes[locale]}.html`
}

/** One item cell: the name, and the one-line reason when it says something. */
function itemCell(data, locale, label, slot, id, group, kit) {
  const text = bestGearCopy(locale)
  const why = kit.why[group === 'rod' || group === 'hook' ? group : 'item']
  const buy = escapeHtml(buyText(text, buyOf(kit, slot)))
  const reason = why && why !== 'plain' && why !== 'any' ? text.why[group]?.[why] : ''
  const name = id == null ? '–' : escapeHtml(itemName(data, locale, slot, id))
  return `<td data-label="${escapeHtml(label)}"><span>${name}${reason ? `<small>${escapeHtml(reason)}</small>` : ''}<small>${buy}</small></span></td>`
}

const colCount = (ctx) => (ctx.method === 'float' ? 6 : 5)

/** A full-width row under a fish row: the later-stage kit, or nothing to say. */
function noteRow(ctx, html) {
  return `<tr class="bg-note-row"><td class="bg-later-cell" colspan="${colCount(ctx) + 1}">${html}</td></tr>`
}

function laterRow(ctx, plan) {
  const { data, locale } = ctx
  const text = bestGearCopy(locale)
  const { kit, stage } = plan.later
  const names = kitSlots(ctx.method, kit).map(
    ([slot, id]) =>
      `${escapeHtml(itemName(data, locale, slot, id))} <small>(${escapeHtml(buyText(text, buyOf(kit, slot)))})</small>`,
  )
  return noteRow(
    ctx,
    `<strong>${escapeHtml(text.laterHead(stage))}</strong> ${names.join(' · ')}<div>${easeByBand(text, kit.starts)}</div>${escapeHtml(text.yen(kit.yen))}`,
  )
}

function rowHtml(ctx, id, fish, stage, plan) {
  const { data, locale } = ctx
  const text = bestGearCopy(locale)
  const [size, rod, hook, start, price] = LABELS[locale]
  const kit = plan.kits[0]
  const second = SECOND[ctx.method]
  const name = escapeHtml(itemName(data, locale, 'fish', id))
  const head = `<td><a href="${escapeHtml(fishLink(locale, id))}"><strong>${name}</strong></a> <span class="bg-tag">${escapeHtml(text.stage(stage))}</span></td>`
  const later = plan.later ? laterRow(ctx, plan) : ''
  if (!kit)
    return `<tr>${head}<td colspan="${colCount(ctx)}">${escapeHtml(text.nothingYet(stage))}</td></tr>${later}`
  const secondLabel = text.slots[second]
  return `<tr>${head}
<td data-label="${size}"><span>${escapeHtml(text.size(fish.size[0], shownHigh(fish)))}<small>${maxHtml(text, fish)}</small></span></td>
${itemCell(data, locale, rod, 'rod', kit.rod, 'rod', kit)}
${ctx.method === 'float' ? itemCell(data, locale, hook, 'hook', kit.hook, 'hook', kit) : ''}
${itemCell(data, locale, secondLabel, second, kit[second], second, kit)}
<td data-label="${start}"><div>${easeByBand(text, kit.starts)}</div></td>
<td data-label="${price}">${escapeHtml(text.yen(kit.yen))}</td></tr>${later}`
}

function headHtml(ctx) {
  const text = bestGearCopy(ctx.locale)
  const [size, rod, hook, start, price] = LABELS[ctx.locale]
  const cols = [
    ctx.fishLabel,
    size,
    rod,
    ...(ctx.method === 'float' ? [hook] : []),
    text.slots[SECOND[ctx.method]],
    start,
    price,
  ]
  return `<thead><tr>${cols.map((col) => `<th scope="col">${escapeHtml(col)}</th>`).join('')}</tr></thead>`
}

function matches(ctx, id, query) {
  if (!query) return true
  const names = Object.values(ctx.data.names.fish[id] ?? {})
    .join(' ')
    .toLowerCase()
  return names.includes(query) || String(id) === query
}

/** Fish with a plan for the method that match the search, in the language's name order. */
function visibleFish(ctx) {
  const query = ctx.query.trim().toLowerCase()
  const collator = new Intl.Collator(ctx.locale)
  return Object.entries(ctx.data.best.fish)
    .filter(([id, fish]) => fish.methods[ctx.method] && matches(ctx, id, query))
    .sort(([a], [b]) =>
      collator.compare(
        itemName(ctx.data, ctx.locale, 'fish', a),
        itemName(ctx.data, ctx.locale, 'fish', b),
      ),
    )
}

function stageRows(ctx, id, fish) {
  const plan = fish.methods[ctx.method]
  return Object.entries(plan.stages)
    .map(([stage, entry]) => rowHtml(ctx, id, fish, +stage, entry))
    .join('')
}

export function renderTable(ctx) {
  const rows = visibleFish(ctx)
  const text = bestGearCopy(ctx.locale)
  ctx.target.innerHTML = rows.length
    ? `<table class="bg-table">${headHtml(ctx)}<tbody>${rows.map(([id, fish]) => stageRows(ctx, id, fish)).join('')}</tbody></table>`
    : `<p class="bg-empty">${escapeHtml(text.noBite)}</p>`
}

export function bindTable(ctx, search, radios) {
  search.addEventListener('input', () => {
    ctx.query = search.value
    renderTable(ctx)
  })
  for (const radio of radios)
    radio.addEventListener('change', () => {
      if (!radio.checked) return
      ctx.method = radio.value
      renderTable(ctx)
    })
}
