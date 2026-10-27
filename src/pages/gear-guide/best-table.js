import {
  bestGearCopy,
  easeByBand,
  escapeHtml,
  itemName,
  itemPic,
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
function itemCell(data, locale, label, slot, id, group, why) {
  const text = bestGearCopy(locale)
  const reason = why && why !== 'plain' && why !== 'any' ? text.why[group]?.[why] : ''
  const name = id == null ? '–' : itemPic(data, locale, slot, id)
  return `<td data-label="${escapeHtml(label)}"><span>${name}${reason ? `<small>${escapeHtml(reason)}</small>` : ''}</span></td>`
}

function rowHtml(ctx, id, fish, plan) {
  const { data, locale } = ctx
  const text = bestGearCopy(locale)
  const [size, rod, hook, start, price] = LABELS[locale]
  const kit = plan.kits[0]
  const second = SECOND[ctx.method]
  const name = itemPic(data, locale, 'fish', id, 'fishrow')
  const secondLabel = text.slots[second]
  return `<tr><td><a href="${escapeHtml(fishLink(locale, id))}"><strong>${name}</strong></a></td>
<td data-label="${size}"><span>${escapeHtml(text.size(fish.size[0], shownHigh(fish)))}<small>${maxHtml(text, fish)}</small></span></td>
${itemCell(data, locale, rod, 'rod', kit.rod, 'rod', kit.why.rod)}
${ctx.method === 'float' ? itemCell(data, locale, hook, 'hook', kit.hook, 'hook', kit.why.hook) : ''}
${itemCell(data, locale, secondLabel, second, kit[second], second, kit.why.item)}
<td data-label="${start}"><div>${easeByBand(text, kit.starts)}</div></td>
<td data-label="${price}">${escapeHtml(text.yen(kit.yen))}</td></tr>`
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

export function renderTable(ctx) {
  const rows = visibleFish(ctx)
  const text = bestGearCopy(ctx.locale)
  ctx.target.innerHTML = rows.length
    ? `<table class="bg-table">${headHtml(ctx)}<tbody>${rows.map(([id, fish]) => rowHtml(ctx, id, fish, fish.methods[ctx.method])).join('')}</tbody></table>`
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
