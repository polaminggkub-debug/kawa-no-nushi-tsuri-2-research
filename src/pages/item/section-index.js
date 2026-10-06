const sections = [
  ['what-to-do', 'ควรใช้เมื่อไร', '使うとき', 'When to use'],
  ['item-shops', 'ซื้อที่ไหน', '購入場所', 'Where to buy'],
  ['fly-purchases', 'ชุดที่มีขาย', '販売セット', 'Shop bundles'],
  ['use-locations', 'จุดและวิธีใช้', '使用場所', 'Where to use'],
  ['item-compatible', 'ปลาที่ใช้ด้วยได้', '対応する魚', 'Compatible fish'],
  ['item-evidence', 'หลักฐาน', '根拠', 'Evidence'],
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
