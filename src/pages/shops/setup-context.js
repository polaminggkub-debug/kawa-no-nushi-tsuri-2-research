import { setMakerPageCopy } from './fly-maker-location.js'
import { text_en } from './text_en.js'
import { text_th } from './text_th.js'
import { text_ja } from './text_ja.js'
export function setupContext(ctx) {
  ctx.lang = ['th', 'ja'].includes(document.documentElement.dataset.locale)
    ? document.documentElement.dataset.locale
    : 'en'
  ctx.pages = {
    shops: { en: 'shops.html', th: 'shops.th.html', ja: 'shops.ja.html' },
    item: { en: 'item.html', th: 'item.th.html', ja: 'item.ja.html' },
    fish: { en: 'fish.html', th: 'fish.th.html', ja: 'fish.ja.html' },
    maps: { en: 'maps.html', th: 'maps.th.html', ja: 'maps.ja.html' },
    index: { en: 'index.html', th: 'index.th.html', ja: 'index.ja.html' },
  }
  ctx.text = { en: text_en, th: text_th, ja: text_ja }[ctx.lang]
  ctx.$ = (id) => document.getElementById(id)
  ctx.esc = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
    )
  ctx.params = new URLSearchParams(location.search)
  ctx.flyMakerIntent = ctx.params.get('maker') === '1' || location.hash === '#fly-maker-location'
  setMakerPageCopy(ctx)
  ctx.baseDir = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1)
  ctx.validCategory = (value) => (/^[a-z_]+$/.test(value || '') ? value : '')
  ctx.validId = (value) =>
    /^(?:0x)?[0-9a-f]{1,2}$/i.test(value || '')
      ? Number.parseInt(String(value).replace(/^0x/i, ''), 16)
          .toString(16)
          .toUpperCase()
          .padStart(2, '0')
      : ''
  ctx.startStage = /^[1-6]$/.test(ctx.params.get('stage') || '')
    ? Number(ctx.params.get('stage'))
    : 1
  ctx.startPlace = ['area', 'outdoor'].includes(ctx.params.get('place')) ? 'outdoor' : 'town'
  ctx.startCategory = ctx.validCategory(ctx.params.get('category'))
  ctx.startId = ctx.validId(ctx.params.get('id'))
  ctx.selectedFish = ctx.validId(ctx.params.get('fish'))
  ctx.selectedRig = ['float', 'sinker', 'lure', 'fly'].includes(ctx.params.get('route'))
    ? ctx.params.get('route')
    : ''
  ctx.targetCategory = ctx.startCategory
  ctx.targetId = ctx.startId
}
