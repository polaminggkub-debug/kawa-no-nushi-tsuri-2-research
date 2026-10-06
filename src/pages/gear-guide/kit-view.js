import { escapeHtml, localName, percent, yen } from './format.js'
import { routeItem } from './kits.js'

const suffixes = { en: '', th: '.th', ja: '.ja' }

export const itemLabel = (ctx, slot, id) => localName(ctx.names[slot]?.[id], ctx.locale)

function whereText(ctx, row) {
  const { where } = ctx.text
  if (row.special.length) return where.special(row.special)
  const place = row.areas.length === 6 ? where.all : where.areas(row.areas)
  return row.slot === 'fly' ? `${where.readyMade}, ${place}` : place
}

function rowHtml(ctx, row) {
  return `<li><span class="gg-slot">${ctx.text.slots[row.slot]}</span><span class="gg-item"><strong>${escapeHtml(itemLabel(ctx, row.slot, row.id))}</strong><span class="gg-sub">${yen(row.yen)} · ${whereText(ctx, row)}</span></span></li>`
}

function routeHtml(ctx, method) {
  const route = routeItem(ctx.effects, method)
  if (!route) return ''
  const name = itemLabel(ctx, 'float_weight', route.id)
  return `<p class="gg-note">${ctx.text.extra(escapeHtml(name), yen(route.yen))}</p>`
}

function statsHtml(ctx, entry) {
  const { text } = ctx
  const lines = [`<strong>${text.mistakes(...entry.range)}</strong>`]
  const { stats } = entry
  if (stats) {
    const n = ctx.effects.sample.starts
    lines.push(text.caught(`<strong>${percent(stats.caught)}</strong>`, n))
    if (stats.lost >= 10) lines.push(text.lost(percent(stats.lost)))
    if (stats.unfinished >= 10) lines.push(text.running(percent(stats.unfinished)))
  } else lines.push(text.notSimulated)
  return `<ul class="gg-stats">${lines.map((line) => `<li>${line}</li>`).join('')}</ul>`
}

function simLink(ctx, fishId, method, kit) {
  if (method !== 'float' && method !== 'casting') return ''
  const query = new URLSearchParams({ fish: fishId, rod: kit.rod, hook: kit.hook, bait: kit.bait })
  const href = `fight-sim${suffixes[ctx.locale]}.html?${query}`
  return `<a class="gg-link" href="${href}">${ctx.text.simLink}</a>`
}

function kitHtml(ctx, fishId, plan, entry) {
  const total = ctx.text.total(yen(entry.kit.yen))
  return `<div class="gg-kit gg-kit-${entry.role}">
  <h4>${ctx.text.roles[entry.role]} <span class="gg-total">${total}</span></h4>
  <ul class="gg-items">${entry.rows.map((row) => rowHtml(ctx, row)).join('')}</ul>
  ${routeHtml(ctx, plan.method)}
  ${statsHtml(ctx, entry)}
  ${simLink(ctx, fishId, plan.method, entry.kit)}
</div>`
}

function notesHtml(ctx, plan) {
  const { text } = ctx
  const notes = []
  if (text.hints[plan.method]) notes.push(text.hints[plan.method])
  if (plan.swappedFrom) {
    const priced = (id, price) => `${escapeHtml(itemLabel(ctx, 'fly', id))} (${yen(price)})`
    const fromPrice = Math.min(...ctx.effects.items.fly[plan.swappedFrom].bundles.map((b) => b[2]))
    const flyRow = plan.kits[0].rows.find((row) => row.slot === 'fly')
    notes.push(text.flySwapped(priced(plan.swappedFrom, fromPrice), priced(flyRow.id, flyRow.yen)))
  }
  if (plan.neverSold.length) {
    const names = plan.neverSold.map((id) => escapeHtml(itemLabel(ctx, 'rod', id)))
    notes.push(text.neverSold(names.join(', ')))
  }
  return notes.map((note) => `<p class="gg-note">${note}</p>`).join('')
}

function methodHtml(ctx, fishId, plan, open) {
  const cheapest = plan.kits.at(-1).kit.yen
  return `<details class="gg-method"${open ? ' open' : ''}>
  <summary><span>${ctx.text.methods[plan.method]}</span><span class="gg-from">${ctx.text.from(yen(cheapest))}</span></summary>
  ${notesHtml(ctx, plan)}
  <div class="gg-kits">${plan.kits.map((entry) => kitHtml(ctx, fishId, plan, entry)).join('')}</div>
</details>`
}

export function renderPlans(ctx, fishId, plans) {
  return plans.map((plan, index) => methodHtml(ctx, fishId, plan, index === 0)).join('')
}
