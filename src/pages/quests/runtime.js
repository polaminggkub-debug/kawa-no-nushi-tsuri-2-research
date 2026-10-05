import { areaQuestActions, areaQuestStages } from '../../entities/quest/index.js'
import { copy } from './copy.js'
import { pageName, safeReturn, localizeReturn, stateParams } from './navigation.js'
import { escapeHtml, renderQuestGroups } from './render.js'
export function setupQuestContext(ctx) {
  ctx.locale = ['th', 'ja'].includes(document.documentElement.dataset.locale)
    ? document.documentElement.dataset.locale
    : 'en'
  ctx.text = copy[ctx.locale]
  ctx.$ = (id) => document.getElementById(id)
  ctx.pathname = location.pathname
  ctx.hash = location.hash
  ctx.params = new URLSearchParams(location.search)
  ctx.stage = /^[1-6]$/.test(ctx.params.get('stage') || '') ? Number(ctx.params.get('stage')) : 1
  ctx.fish = /^[0-9a-f]{2}$/i.test(ctx.params.get('fish') || '')
    ? ctx.params.get('fish').toUpperCase()
    : ''
  ctx.route = ['float', 'sinker', 'lure', 'fly'].includes(ctx.params.get('route'))
    ? ctx.params.get('route')
    : ''
  ctx.returnRoute = safeReturn(ctx.params.get('return'), location.href)
  ctx.$('quest-stage').value = String(ctx.stage)
}
export function updateQuestNavigation(ctx) {
  for (const locale of ['en', 'th', 'ja']) {
    const query = stateParams(ctx)
    if (ctx.returnRoute) query.set('return', localizeReturn(ctx.returnRoute, locale, location.href))
    const link = ctx.$(`language-${locale}`)
    link.href = `${pageName('quests', locale)}?${query}${ctx.hash}`
    if (ctx.locale === locale) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  }
  const back = ctx.$('back-link')
  back.href = ctx.returnRoute || pageName('index', ctx.locale)
  back.textContent = ctx.returnRoute ? ctx.text.back : ctx.text.catalogue
}
export function renderQuestView(ctx) {
  const status = ctx.$('page-status')
  status.textContent = ctx.text.loading
  ctx.$('quest-stage').disabled = true
  try {
    const actions = areaQuestActions(ctx.stage, ctx.locale)
    ctx.$('quest-results').innerHTML = renderQuestGroups(ctx, actions)
    status.textContent = ctx.text.ready(ctx.stage, actions.length)
    ctx.$('quest-stage').disabled = false
    updateQuestNavigation(ctx)
    if (ctx.hash) document.getElementById(ctx.hash.slice(1))?.scrollIntoView({ block: 'start' })
  } catch {
    status.innerHTML = `${escapeHtml(ctx.text.failed)} <button type="button" class="route-button" data-quest-retry>${escapeHtml(ctx.text.retry)}</button>`
    status
      .querySelector('[data-quest-retry]')
      ?.addEventListener('click', () => renderQuestView(ctx))
    ctx.$('quest-results').replaceChildren()
    ctx.$('quest-stage').disabled = false
  }
}
export function initialize(ctx) {
  setupQuestContext(ctx)
  const stages = areaQuestStages()
  ctx.$('quest-stage').innerHTML = stages
    .map((stage) => `<option value="${stage}">${escapeHtml(ctx.text.area)} ${stage}</option>`)
    .join('')
  ctx.$('quest-stage').value = String(ctx.stage)
  updateQuestNavigation(ctx)
  ctx.$('quest-stage').addEventListener('change', () => {
    ctx.stage = Number(ctx.$('quest-stage').value)
    ctx.hash = ''
    history.replaceState(null, '', `${ctx.pathname}?${stateParams(ctx)}`)
    renderQuestView(ctx)
  })
  renderQuestView(ctx)
}
