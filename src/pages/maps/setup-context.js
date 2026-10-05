import { c_en } from './c_en.js'
import { c_th } from './c_th.js'
import { c_ja } from './c_ja.js'
export function setupContext(ctx) {
  ctx.lang = ['th', 'ja'].includes(document.documentElement.dataset.locale)
    ? document.documentElement.dataset.locale
    : 'en'
  ctx.c = { en: c_en, th: c_th, ja: c_ja }[ctx.lang]
  ctx.areaList = document.getElementById('area-list')
  ctx.fishList = document.getElementById('fish-list')
  ctx.stageSelect = document.getElementById('section-select')
  ctx.searchInput = document.getElementById('fish-search')
  ctx.suggestionList = document.getElementById('fish-suggestions')
  ctx.$ = (id) => document.getElementById(id)
  ctx.fishData = {}
  ctx.visuals = {}
  ctx.species = {}
  ctx.stages = {}
  ctx.selectedFish = ''
  ctx.selectedRoute = ''
  ctx.activeWaterMark = ''
  ctx.lastWaterMark = ''
  ctx.activeStage = 1
  ctx.activeSection = ''
  ctx.searchTerm = ''
  ctx.listScope = 'area'
  ctx.zoom = 1
  ctx.suggestionIds = []
  ctx.activeSuggestion = -1
  ctx.suggestionsDismissed = false
  ctx.suggestionLimit = 10
  ctx.esc = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
    )
  ctx.local = (obj) => obj?.[ctx.lang] || obj?.en || obj?.ja || obj?.th || ''
  ctx.idNorm = (id) => String(id).toUpperCase().replace(/^0X/, '').padStart(2, '0')
  ctx.fishName = (id) => ctx.species[id]?.name || ctx.c.fishName(id)
  ctx.detailLabel = ctx.lang === 'th' ? 'รายละเอียด' : ctx.lang === 'ja' ? '詳細' : 'Details'
  ctx.returnPath = ctx.safeReturn(new URLSearchParams(location.search).get('return') || '')
}
