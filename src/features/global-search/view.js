import { copy } from './copy.js'

const esc = (text) =>
  String(text ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  )

export function entryHref(entry, context) {
  const suffix = context.lang === 'en' ? '' : `.${context.lang}`
  const query = new URLSearchParams(
    entry.k === 'fish' ? { id: entry.id } : { category: entry.c, id: entry.id },
  )
  if (context.returnTo) query.set('return', context.returnTo)
  return `${context.base}${entry.k === 'fish' ? 'fish' : 'item'}${suffix}.html?${query}`
}

export function typeLabel(entry, lang) {
  const text = copy[lang]
  return entry.k === 'fish' ? text.fish : `${text.item} · ${entry.t?.[lang] || entry.c}`
}

function option(entry, index, context) {
  const image = entry.i
    ? `<img src="${esc(context.base + entry.i)}" alt="" width="40" height="40" loading="lazy">`
    : '<span class="gsearch-noimg" aria-hidden="true"></span>'
  return `<a class="gsearch-option" role="option" id="gsearch-opt-${index}" data-index="${index}" data-kind="${entry.k}" href="${esc(entryHref(entry, context))}">${image}<span class="gsearch-name">${esc(entry.n[context.lang])}<small>${esc(typeLabel(entry, context.lang))} · ID ${esc(entry.id)}</small></span></a>`
}

export function renderList(result, context, shown) {
  const text = copy[context.lang]
  if (!shown.length) return `<p class="gsearch-empty">${esc(text.empty)}</p>`
  const hits = result.hits.slice(0, 8)
  const head = result.hits.length
    ? `<p class="gsearch-head">${esc(text.count(result.hits.length))}</p>`
    : ''
  const rows = hits.map((entry, index) => option(entry, index, context)).join('')
  const near = result.near.length
    ? `<p class="gsearch-head">${esc(text.near)}</p>${result.near.map((entry, index) => option(entry, hits.length + index, context)).join('')}`
    : ''
  return head + rows + near
}

export function mountMarkup(lang, state) {
  const text = copy[lang]
  const chip = (type) =>
    `<button type="button" class="gsearch-type" data-type="${type}" aria-pressed="${state.type === type}">${esc(text[type])}</button>`
  return `<form class="gsearch" role="search" id="gsearch" autocomplete="off">
    <div class="gsearch-row"><input id="gsearch-input" type="search" enterkeyhint="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="gsearch-list" aria-label="${esc(text.label)}" placeholder="${esc(text.placeholder)}" value="${esc(state.query)}"><button type="button" class="gsearch-clear" aria-label="${esc(text.clear)}" ${state.query ? '' : 'hidden'}>×</button></div>
    <div class="gsearch-panel" hidden><div class="gsearch-types" role="group" aria-label="${esc(text.hint)}">${chip('all')}${chip('fish')}${chip('item')}</div><div id="gsearch-list" class="gsearch-list" role="listbox" aria-label="${esc(text.label)}"></div></div>
  </form>`
}
