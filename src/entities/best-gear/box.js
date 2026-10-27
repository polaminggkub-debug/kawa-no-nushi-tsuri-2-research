import { trustBadge } from '../../shared/lib/index.js'
import { bestGearCopy, easeByBand, escapeHtml, itemName, itemPic, kitSlots } from './view.js'

function rowHtml(data, locale, [slot, id, group], why) {
  const text = bestGearCopy(locale)
  const reason = text.why[group]?.[why[slot === 'rod' ? 'rod' : slot === 'hook' ? 'hook' : 'item']]
  return `<li><span class="bg-slot">${escapeHtml(text.slots[slot])}</span><span class="bg-item"><strong>${itemPic(data, locale, slot, id)}</strong>${reason ? `<span class="bg-reason">${escapeHtml(reason)}</span>` : ''}</span></li>`
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
  const names = kitSlots(method, kit).map(([slot, id]) => itemPic(data, locale, slot, id))
  return `<div class="bg-cheap"><h4>${escapeHtml(text.cheap)} ${trustBadge(locale, 'rom')} <span class="bg-total">${escapeHtml(text.total(text.yen(kit.yen)))}</span></h4><p class="bg-pics">${names.join(' ')}</p>${easeByBand(text, kit.starts)}</div>`
}

/** One way to catch the fish: the best kit with a reason per item, its ease, and the alternatives. */
export function methodHtml(data, locale, method, plan, open) {
  const text = bestGearCopy(locale)
  const [best, cheap] = plan.kits
  const rows = kitSlots(method, best).map((slot) => rowHtml(data, locale, slot, best.why))
  if (method === 'float') rows.push(floatRow(data, locale))
  const body = `<h4>${escapeHtml(text.best)} ${trustBadge(locale, 'rom')} <span class="bg-total">${escapeHtml(text.total(text.yen(best.yen)))}</span></h4>
<ul class="bg-kit">${rows.join('')}</ul>${easeByBand(text, best.starts)}${alsoHtml(data, locale, method, plan)}${cheap ? cheapHtml(data, locale, method, cheap) : ''}`
  return `<details class="bg-method"${open ? ' open' : ''}><summary>${escapeHtml(text.methods[method])}</summary><div class="bg-body">${body}</div></details>`
}
