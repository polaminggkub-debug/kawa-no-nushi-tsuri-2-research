const sections = [
  ['fish-area-map', 'จุดตกปลา', '釣り場', 'Fishing spots'],
  ['fish-shopping', 'ชุดเริ่มตก', '最初の仕掛け', 'Fishing setup'],
  ['fish-notebook', 'สมุดปลา', '釣りノート', 'Notebook'],
  ['all-compatible', 'เหยื่อทางเลือก', 'エサの候補', 'Bait alternatives'],
  ['fish-evidence', 'หลักฐาน', '根拠', 'Evidence'],
]

export function renderSectionIndex(ctx, markup) {
  const locale = ctx.locale || ctx.lang || 'en'
  const column = locale === 'th' ? 1 : locale === 'ja' ? 2 : 3
  const esc = ctx.escapeHtml || ctx.esc
  const label =
    locale === 'th' ? 'หัวข้อในหน้านี้' : locale === 'ja' ? 'このページの項目' : 'On this page'
  const links = sections
    .filter(([id]) => markup.includes(`id="${id}"`))
    .map(([id, ...names]) => `<a href="#${id}">${esc(names[column - 1])}</a>`)
    .join('')
  return links
    ? `<nav class="page-section-index" aria-label="${esc(label)}"><strong>${esc(label)}</strong>${links}</nav>`
    : ''
}

export function bindSectionIndex(root) {
  root.querySelector?.('.page-section-index')?.addEventListener('click', (event) => {
    const href = event.target.closest('a')?.getAttribute('href')
    if (!href?.startsWith('#')) return
    const target = document.getElementById(href.slice(1))
    const disclosure = target?.tagName === 'DETAILS' ? target : target?.closest('details')
    if (disclosure) disclosure.open = true
  })
}
