import { trustBadge } from '../../shared/lib/index.js'
import {
  bestGearCopy,
  buyOf,
  buyText,
  easeByBand,
  easeHint,
  escapeHtml,
  itemName,
  itemPic,
  kitSlots,
  lineNote,
} from './view.js'

function rowHtml(data, locale, [slot, id, group], kit) {
  const why = kit.why
  const text = bestGearCopy(locale)
  const reason = text.why[group]?.[why[slot === 'rod' ? 'rod' : slot === 'hook' ? 'hook' : 'item']]
  return `<li><span class="bg-slot">${escapeHtml(text.slots[slot])}</span><span class="bg-item"><strong>${itemPic(data, locale, slot, id)}</strong>${slot === 'rod' ? lineNote(text, kit) : ''}${reason ? `<span class="bg-reason">${escapeHtml(reason)}</span>` : ''}<span class="bg-buy">${escapeHtml(buyText(text, buyOf(kit, slot)))}</span></span></li>`
}

function floatRow(data, locale) {
  const text = bestGearCopy(locale)
  const name = itemName(data, locale, 'float_weight', data.best.route.id)
  const pic = itemPic(data, locale, 'float_weight', data.best.route.id)
  return `<li><span class="bg-slot">${escapeHtml(text.slots.float)}</span><span class="bg-item">${pic}<span class="bg-reason">${escapeHtml(text.anyFloat(name))}</span></span></li>`
}

function alsoHtml(data, locale, method, plan) {
  const text = bestGearCopy(locale)
  const names = (slot, ids) => ids.map((id) => itemPic(data, locale, slot, id))
  const second = method === 'float' ? 'bait' : method
  const lines = []
  for (const [key, slot] of [
    ['rod', 'rod'],
    ['hook', 'hook'],
    [second, second],
  ]) {
    const ids = plan.ties[key]
    if (ids?.length)
      lines.push(
        `<li><span class="bg-slot">${escapeHtml(text.slots[slot])}</span> ${names(slot, ids).join(' · ')}</li>`,
      )
  }
  return lines.length
    ? `<div class="bg-also"><h4>${escapeHtml(text.alsoOk)}</h4><ul>${lines.join('')}</ul></div>`
    : ''
}

function cheapHtml(data, locale, method, kit) {
  const text = bestGearCopy(locale)
  const names = kitSlots(method, kit).map(
    ([slot, id]) =>
      `${itemPic(data, locale, slot, id)}${slot === 'rod' ? lineNote(text, kit) : ''} <small class="bg-buy">(${escapeHtml(buyText(text, buyOf(kit, slot)))})</small>`,
  )
  return `<div class="bg-cheap"><h4>${escapeHtml(text.cheap)} ${trustBadge(locale, 'rom')} <span class="bg-total">${escapeHtml(text.total(text.yen(kit.yen)))}</span></h4><p class="bg-pics">${names.join(' · ')}</p>${easeByBand(text, kit.starts)}</div>`
}

function kitBlock(data, locale, method, head, kit, extra = '') {
  const text = bestGearCopy(locale)
  const rows = kitSlots(method, kit).map((slot) => rowHtml(data, locale, slot, kit))
  if (method === 'float') rows.push(floatRow(data, locale))
  return `<h4>${head} ${trustBadge(locale, 'rom')} <span class="bg-total">${escapeHtml(text.total(text.yen(kit.yen)))}</span></h4>
<ul class="bg-kit">${rows.join('')}</ul>${easeByBand(text, kit.starts)}${extra}`
}

function laterHtml(data, locale, method, later) {
  const text = bestGearCopy(locale)
  const head = escapeHtml(text.laterHead(later.stage))
  return `<div class="bg-cheap bg-later">${kitBlock(data, locale, method, head, later.kit)}</div>`
}

/** One stage of one method: the kit buyable there, its alternatives, and a later-stage upgrade. */
function stageHtml(data, locale, method, stage, plan) {
  const text = bestGearCopy(locale)
  const [best, cheap] = plan.kits
  const later = plan.later ? laterHtml(data, locale, method, plan.later) : ''
  const head = `<p class="bg-stage"><strong>${escapeHtml(text.stage(stage))}</strong></p>`
  if (!best) return `${head}<p class="bg-empty">${escapeHtml(text.nothingYet(stage))}</p>${later}`
  const extra = `${alsoHtml(data, locale, method, plan)}${cheap ? cheapHtml(data, locale, method, cheap) : ''}`
  return `${head}${kitBlock(data, locale, method, escapeHtml(text.best), best, extra)}${later}`
}

/** One way to catch the fish, per stage the fish lives in. */
export function methodHtml(data, locale, method, plan, open) {
  const text = bestGearCopy(locale)
  const stages = Object.entries(plan.stages)
    .map(([stage, entry]) => stageHtml(data, locale, method, +stage, entry))
    .join('')
  const body = `${stages}${easeHint(text)}`
  return `<details class="bg-method"${open ? ' open' : ''}><summary>${escapeHtml(text.methods[method])}</summary><div class="bg-body">${body}</div></details>`
}
