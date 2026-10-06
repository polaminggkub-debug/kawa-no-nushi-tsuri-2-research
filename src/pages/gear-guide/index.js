import { copy } from './copy.js'
import { escapeHtml } from './format.js'
import { itemLabel, renderPlans } from './kit-view.js'
import { planFish } from './kits.js'
import { loadData } from './load.js'

const suffixes = { en: '', th: '.th', ja: '.ja' }
const DEFAULT_FISH = '3'

function setupContext(ctx) {
  const locale = document.documentElement.dataset.locale
  ctx.locale = ['th', 'ja'].includes(locale) ? locale : 'en'
  ctx.text = copy[ctx.locale]
  ctx.$ = (id) => document.getElementById(id)
}

const hexId = (id) => Number(id).toString(16).toUpperCase().padStart(2, '0')

function fishFacts(ctx, fishId, plans) {
  const { size } = ctx.effects.fish[fishId]
  const { need } = plans[0]
  const link = `fish${suffixes[ctx.locale]}.html?id=${hexId(fishId)}&return=gear-guide${suffixes[ctx.locale]}.html`
  return `${ctx.text.sizeLine(...size)} ${ctx.text.reachLine(need)} <a href="${escapeHtml(link)}">${ctx.text.fishLink}</a>`
}

function show(ctx, fishId) {
  const plans = planFish(ctx.effects, fishId)
  ctx.$('gg-facts').innerHTML = fishFacts(ctx, fishId, plans)
  ctx.$('gg-results').innerHTML = renderPlans(ctx, fishId, plans)
  const query = new URLSearchParams({ fish: fishId })
  history.replaceState(null, '', `${location.pathname}?${query}${location.hash}`)
  for (const [locale, suffix] of Object.entries(suffixes))
    ctx.$(`language-${locale}`).href = `gear-guide${suffix}.html?${query}`
}

function fillFish(ctx, selected) {
  const collator = new Intl.Collator(ctx.locale)
  const fish = Object.keys(ctx.effects.fish)
    .map((id) => ({ id, label: itemLabel(ctx, 'fish', id) }))
    .sort((a, b) => collator.compare(a.label, b.label))
  ctx.$('gg-fish').innerHTML = fish
    .map(
      ({ id, label }) =>
        `<option value="${id}"${id === selected ? ' selected' : ''}>${escapeHtml(label)}</option>`,
    )
    .join('')
}

function ready(ctx) {
  const asked = new URLSearchParams(location.search).get('fish')
  const fishId = ctx.effects.fish[asked] ? asked : DEFAULT_FISH
  fillFish(ctx, fishId)
  ctx.$('gg-fish').addEventListener('change', (event) => show(ctx, event.target.value))
  show(ctx, fishId)
  ctx.$('gg-status').hidden = true
  document
    .querySelector('.compendium-links [aria-current="page"]')
    ?.scrollIntoView({ block: 'nearest', inline: 'center' })
}

function failed(ctx) {
  const status = ctx.$('gg-status')
  status.hidden = false
  status.textContent = `${ctx.text.failed} `
  const retry = document.createElement('button')
  retry.type = 'button'
  retry.className = 'route-button'
  retry.textContent = ctx.text.retry
  retry.addEventListener('click', () => start(ctx))
  status.append(retry)
}

function start(ctx) {
  const status = ctx.$('gg-status')
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
