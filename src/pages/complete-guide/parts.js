// Small HTML pieces shared by the complete guide: names, badges, tables and the shop verdicts.
import { trustBadge } from '../../shared/lib/index.js'

export const esc = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  )

export const yen = (value) => `¥${value.toLocaleString('en-US')}`
export const hex = (id) => Number(id).toString(16).toUpperCase().padStart(2, '0')

export function makeNamer(names, lang) {
  return (kind, id) => names[kind]?.[id]?.[lang] ?? names[kind]?.[id]?.en ?? `${kind} ${id}`
}

export const badge = (lang, level) => trustBadge(lang, level)

export function table(head, rows, label) {
  const cells = (tag, row) => row.map((cell) => `<${tag}>${cell}</${tag}>`).join('')
  return `<div class="cg-scroll" tabindex="0" role="region" aria-label="${esc(label)}"><table class="cg-table"><thead><tr>${cells('th', head)}</tr></thead><tbody>${rows
    .map((row) => `<tr>${cells('td', row)}</tr>`)
    .join('')}</tbody></table></div>`
}

export const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`

const VERDICT_CLASS = { buy: 'cg-buy', skip: 'cg-skip', maybe: 'cg-maybe' }

export function verdictCell(copy, verdict) {
  return `<span class="cg-verdict ${VERDICT_CLASS[verdict]}">${copy.stage[verdict]}</span>`
}
