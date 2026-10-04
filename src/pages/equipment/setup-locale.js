import { copy_en } from './copy_en.js'
import { copy_th } from './copy_th.js'
import { copy_ja } from './copy_ja.js'
export function setupLocale(ctx) {
  ctx.lang = ['ja', 'th'].includes(document.documentElement.dataset.locale)
    ? document.documentElement.dataset.locale
    : 'en'
  ctx.copy = { en: copy_en, th: copy_th, ja: copy_ja }[ctx.lang]
  if (typeof ctx.copy.entries === 'string') {
    const template = ctx.copy.entries
    ctx.copy.entries = (n) => template.replace('{n}', n)
  }
  if (typeof ctx.copy.results === 'string') {
    const template = ctx.copy.results
    ctx.copy.results = (n) => template.replace('{n}', n)
  }
  ctx.itemName = (item) =>
    item.category === 'general_tool' &&
    ['08', '09', '0A', '0B', '0C', '0D'].includes(item.id) &&
    item.playerUse?.displayName?.[ctx.lang]
      ? item.playerUse.displayName[ctx.lang]
      : ctx.lang === 'th'
        ? item.nameTh || item.playerUse?.displayName?.th || item.nameJa
        : ctx.lang === 'ja'
          ? item.nameJa
          : item.nameEn
  ctx.itemNotes = (item) =>
    ctx.lang === 'th'
      ? item.notesTh || item.notesEn
      : ctx.lang === 'ja'
        ? item.notesJa
        : item.notesEn
  ctx.esc = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    )
  ctx.set = (selector, text) => {
    const node = document.querySelector(selector)
    if (node) node.textContent = text
  }
}
