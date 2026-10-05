import { copy_en } from './copy_en.js'
import { copy_th } from './copy_th.js'
import { copy_ja } from './copy_ja.js'

export function setupContext(ctx) {
  ctx.lang = ['th', 'ja'].includes(document.documentElement.dataset.locale)
    ? document.documentElement.dataset.locale
    : 'en'
  ctx.localePage = { en: 'item.html', th: 'item.th.html', ja: 'item.ja.html' }
  ctx.cataloguePage = { en: 'index.html', th: 'index.th.html', ja: 'index.ja.html' }
  ctx.mapsPage = { en: 'maps.html', th: 'maps.th.html', ja: 'maps.ja.html' }
  ctx.copy = { en: copy_en, th: copy_th, ja: copy_ja }[ctx.lang]
  ctx.$ = (id) => document.getElementById(id)
  ctx.esc = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
    )
  ctx.local = (value) =>
    typeof value === 'string'
      ? value
      : value?.[ctx.lang] || value?.en || value?.ja || value?.th || ''
  ctx.params = new URLSearchParams(location.search)
  ctx.category = ctx.params.get('category') || ''
  ctx.normalizeId = (value) => {
    const raw = String(value || '').trim()
    if (!/^(?:0x)?[0-9a-f]{1,2}$/i.test(raw)) return ''
    return Number.parseInt(raw.replace(/^0x/i, ''), 16).toString(16).toUpperCase().padStart(2, '0')
  }
  ctx.requestedId = ctx.normalizeId(ctx.params.get('id'))
  ctx.selectedFish = ctx.normalizeId(ctx.params.get('fish'))
  ctx.selectedStage = /^[1-6]$/.test(ctx.params.get('stage') || '')
    ? Number(ctx.params.get('stage'))
    : 0
  ctx.selectedRoute = ['float', 'sinker', 'lure', 'fly'].includes(ctx.params.get('route'))
    ? ctx.params.get('route')
    : ''
  ctx.baseDir = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1)
  ctx.routeFiles = {
    catalogue:
      /^\/(?:[^/]+\/)?catalogue\/(?:index(?:\.th|\.ja)?|maps(?:\.th|\.ja)?|fish(?:\.th|\.ja)?|item(?:\.th|\.ja)?|shops(?:\.th|\.ja)?)\.html$/,
    research: /^\/(?:[^/]+\/)?research\/index(?:\.th|\.ja)?\.html$/,
  }
}
