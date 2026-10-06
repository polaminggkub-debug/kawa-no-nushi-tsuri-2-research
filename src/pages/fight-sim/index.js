import { copy } from './copy.js'
import { fillTipNumbers, renderComparison } from './compare.js'
import { bindFinder, renderFinder } from './finder.js'
import { loadData } from './load.js'
import { setupSummary } from './names.js'
import { bindInputs } from './input.js'
import { bindPlay, showIdle } from './play.js'
import {
  bestState,
  currentSetup,
  fillSetupControls,
  readControls,
  stateFromAddress,
} from './setup.js'

const suffixes = { en: '', th: '.th', ja: '.ja' }

function setupContext(ctx) {
  const locale = document.documentElement.dataset.locale
  ctx.locale = ['th', 'ja'].includes(locale) ? locale : 'en'
  ctx.text = copy[ctx.locale]
  ctx.$ = (id) => document.getElementById(id)
  ctx.params = new URLSearchParams(location.search)
  ctx.live = new Map()
}

/** Keep the chosen tackle in the address bar and in the language links. */
function syncAddress(ctx) {
  const { fishId, rodId, hookId, baitId } = currentSetup(ctx.state)
  const query = new URLSearchParams({ fish: fishId, rod: rodId, hook: hookId, bait: baitId })
  history.replaceState(null, '', `${location.pathname}?${query}${location.hash}`)
  for (const [locale, suffix] of Object.entries(suffixes))
    ctx.$(`language-${locale}`).href = `fight-sim${suffix}.html?${query}`
}

function refresh(ctx) {
  fillSetupControls(ctx)
  syncAddress(ctx)
  renderFinder(ctx)
  ctx.$('play-setup').textContent = setupSummary(ctx)
  showIdle(ctx)
}

function bindSetup(ctx) {
  ctx.$('fs-setup').addEventListener('change', (event) => {
    ctx.state = readControls(ctx, event.target.id)
    refresh(ctx)
  })
  ctx.$('fs-reset').addEventListener('click', () => {
    ctx.state = bestState(ctx, ctx.state.fishId, ctx.state.method)
    refresh(ctx)
  })
  ctx.onFinderChange = () => renderFinder(ctx)
}

function ready(ctx) {
  ctx.state = stateFromAddress(ctx)
  renderComparison(ctx)
  fillTipNumbers(ctx)
  bindSetup(ctx)
  bindFinder(ctx)
  bindInputs(ctx)
  bindPlay(ctx)
  refresh(ctx)
  ctx.$('page-status').hidden = true
  document
    .querySelector('.compendium-links [aria-current="page"]')
    ?.scrollIntoView({ block: 'nearest', inline: 'center' })
}

function failed(ctx) {
  const status = ctx.$('page-status')
  status.hidden = false
  status.innerHTML = ''
  status.append(ctx.text.failed, ' ')
  const retry = document.createElement('button')
  retry.type = 'button'
  retry.className = 'route-button'
  retry.textContent = ctx.text.retry
  retry.addEventListener('click', () => start(ctx))
  status.append(retry)
}

function start(ctx) {
  const status = ctx.$('page-status')
  status.hidden = false
  status.textContent = ctx.text.loading
  loadData()
    .then((data) => {
      Object.assign(ctx, data)
      ready(ctx)
    })
    .catch((error) => {
      console.error(error)
      failed(ctx)
    })
}

export function initialize(ctx) {
  setupContext(ctx)
  start(ctx)
}
