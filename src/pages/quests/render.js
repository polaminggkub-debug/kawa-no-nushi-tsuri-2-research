import { actionHref } from './navigation.js'
import { readableEvidenceHref } from '../../shared/lib/index.js'
export function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  )
}
export function evidenceHref(file) {
  if (!/^(?:docs|data)\/[\w./-]+\.(?:md|json)$/.test(file || '') || file.includes('..')) return ''
  return readableEvidenceHref(`../${file}`)
}
export function renderQuestEvidence(ctx, action) {
  const entries = (action.evidence || [])
    .map(({ file, field }) => {
      const href = evidenceHref(file)
      return href
        ? `<li data-quest-evidence-file="${escapeHtml(file)}" data-quest-evidence-field="${escapeHtml(field)}"><a href="${escapeHtml(href)}">${escapeHtml(file)}</a>${field ? ` · <code>${escapeHtml(field)}</code>` : ''}</li>`
        : ''
    })
    .join('')
  if (!entries && !action.limit) return ''
  return `<details class="quest-evidence"><summary>${escapeHtml(ctx.text.evidence)}</summary>${action.limit ? `<p data-quest-limit>${escapeHtml(action.limit)}</p>` : ''}${entries ? `<ul>${entries}</ul>` : ''}</details>`
}
export function renderQuestCard(ctx, action) {
  const steps = (action.steps || [])
    .map((step) => `<li data-quest-step>${escapeHtml(step)}</li>`)
    .join('')
  const links = (action.links || [])
    .map((link) => {
      const href = actionHref(ctx, link, action.id)
      return href
        ? `<a class="route-button" data-quest-link-type="${escapeHtml(link.type)}" href="${escapeHtml(href)}">${escapeHtml(link.label)} ↗</a>`
        : ''
    })
    .join('')
  return `<article class="quest-card" id="${escapeHtml(action.id)}" data-area-quest="${escapeHtml(action.id)}" data-quest-kind="${escapeHtml(action.kind)}"><h3>${escapeHtml(action.title)}</h3><ol>${steps}</ol>${action.warning ? `<p class="quest-warning" data-quest-warning>${escapeHtml(action.warning)}</p>` : ''}<nav class="quest-actions" aria-label="${escapeHtml(action.title)}">${links}</nav>${renderQuestEvidence(ctx, action)}</article>`
}
export function renderQuestGroups(ctx, actions) {
  if (!actions.length) return `<p class="empty-state">${escapeHtml(ctx.text.empty)}</p>`
  const groups = [
    ['story', 'story'],
    ['exchange', 'exchange'],
    ['optional', 'optional'],
  ]
  return groups
    .map(([kind, label]) => {
      const selected = actions.filter(
        (action) =>
          (['story', 'exchange'].includes(action.kind) ? action.kind : 'optional') === kind,
      )
      return selected.length
        ? `<section class="quest-group" data-quest-group="${kind}"><h2>${escapeHtml(ctx.text[label])}</h2><div class="quest-grid">${selected.map((action) => renderQuestCard(ctx, action)).join('')}</div></section>`
        : ''
    })
    .join('')
}
