import { shoppingCopy_en } from './shoppingCopy_en.js'
import { shoppingCopy_ja } from './shoppingCopy_ja.js'
import { shoppingCopy_th } from './shoppingCopy_th.js'

export function loadProfile(ctx) {
  ctx.page = document.getElementById('fish-detail')
  ctx.params = new URLSearchParams(window.location.search)
  ctx.originalReturn = ctx.params.get('return') || ''
  ctx.id = ctx.normalizeId(ctx.params.get('id'))
  ctx.requestedStage = ctx.validStage(ctx.params.get('stage'))
  ctx.requestedMethod = ['float', 'sinker', 'lure', 'fly'].includes(ctx.params.get('route'))
    ? ctx.params.get('route')
    : ''
  ctx.localReturn = ctx.safeLocalReturn(ctx.originalReturn)
  ctx.shoppingCopy = { en: shoppingCopy_en, ja: shoppingCopy_ja, th: shoppingCopy_th }[ctx.locale]
  ctx.setNavigation(ctx.requestedStage)
  fetchProfile(ctx)
}

function fetchProfile(ctx) {
  Promise.all([loadGallery(), loadLocations()])
    .then(([fishData, locationData]) => ctx.render(fishData, locationData))
    .catch((error) => {
      console.error('Fish profile failed to load or render.', error)
      showLoadError(ctx)
    })
}

function loadGallery() {
  return fetch('gallery-data.json?v=compendium-20261005-08').then((response) => {
    if (!response.ok) throw new Error('gallery data unavailable')
    return response.json()
  })
}

function loadLocations() {
  return fetch('fish-locations.json').then((response) => {
    if (!response.ok) throw new Error('location data unavailable')
    return response.json()
  })
}

function showLoadError(ctx) {
  ctx.page.innerHTML = `<h1>${ctx.escapeHtml(ctx.copy.pageTitle)}</h1><p class="empty-state">${ctx.escapeHtml(ctx.copy.recovery)}</p><p><a class="route-button" href="${ctx.escapeHtml(ctx.cataloguePath())}">${ctx.escapeHtml(ctx.copy.catalogue)}</a></p>`
}
