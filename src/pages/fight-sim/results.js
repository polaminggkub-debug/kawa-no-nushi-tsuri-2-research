import { REACTION, SAMPLE } from '../../features/fight-policy/index.js'
import { describePolicy } from './describe.js'
import { escapeHtml, percent, seconds } from './format.js'

const SEGMENTS = [
  ['c', 'caught', 'fs-caught'],
  ['e', 'escaped', 'fs-escaped'],
  ['l', 'lost', 'fs-lost'],
  ['s', 'unfinished', 'fs-unfinished'],
]

/** A stacked bar of the four outcomes (landed, got away, line broke, unfinished). */
export function outcomeBar(m, text) {
  const label = text.finder.column
  const parts = SEGMENTS.filter(([key]) => m[key] > 0).map(
    ([key, name, css]) =>
      `<span class="fs-seg ${css}" style="width:${m[key]}%" title="${escapeHtml(label[name])}: ${percent(m[key])}"></span>`,
  )
  const summary = SEGMENTS.map(([key, name]) => `${label[name]} ${percent(m[key])}`).join(', ')
  return `<div class="fs-bar" role="img" aria-label="${escapeHtml(summary)}">${parts.join('')}</div>`
}

const legend = (text) =>
  `<ul class="fs-legend">${SEGMENTS.map(
    ([, name, css]) =>
      `<li><span class="fs-swatch ${css}" aria-hidden="true"></span>${escapeHtml(text.finder.column[name])}</li>`,
  ).join('')}</ul>`

function headline(entry, text) {
  const { m } = entry
  const average = m.f === null ? '' : ` ${text.finder.average(seconds(m.f))}`
  return `<p class="fs-headline"><strong>${escapeHtml(text.finder.landed(percent(m.c), SAMPLE.final))}</strong>${escapeHtml(average)}</p>`
}

function steps(spec, text) {
  const items = describePolicy(spec, text).map((line) => `<li>${escapeHtml(line)}</li>`)
  return `<ol class="fs-steps">${items.join('')}</ol>`
}

/** The main card: the best plain rhythm, its steps and its outcome shares. */
export function bestCard(record, text) {
  const { plain } = record
  return `<article class="fs-card fs-best"><h3>${escapeHtml(text.finder.best)}</h3>
${headline(plain, text)}${steps(plain.spec, text)}${outcomeBar(plain.m, text)}${legend(text)}</article>`
}

function row(label, m, text, css = '') {
  const cells = SEGMENTS.map(([key]) => `<td>${percent(m[key])}</td>`).join('')
  return `<tr class="${css}"><th scope="row">${escapeHtml(label)}</th>${cells}</tr>`
}

/** The best rhythm next to the hidden-stamina reference. */
export function baselineCard(record, text) {
  const words = text.finder
  const head = SEGMENTS.map(([, name]) => `<th scope="col">${escapeHtml(words.column[name])}</th>`)
  const rows = [
    row(words.base.plain, record.plain.m, text, 'fs-rec'),
    row(words.base.reference, record.base.reference, text, 'fs-ref'),
  ]
  return `<article class="fs-card"><h3>${escapeHtml(words.baselines)}</h3>
<div class="fs-scroll"><table class="fs-table"><thead><tr><th></th>${head.join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>
<p class="fs-note">${escapeHtml(words.referenceNote)}</p></article>`
}

/** The tap trick, when it clearly beats the plain rhythm. */
export function trickCard(record, text) {
  if (!record.trick) return ''
  const words = text.finder
  return `<article class="fs-card"><h3>${escapeHtml(words.trick)}</h3>
<p class="fs-note">${escapeHtml(words.trickNote)}</p>${headline(record.trick, text)}${steps(record.trick.spec, text)}${outcomeBar(record.trick.m, text)}</article>`
}

/** What frame-perfect timing could reach, shown only when it is worth mentioning. */
export function ceilingCard(record, text) {
  const words = text.finder
  const gain = record.ceiling.m.c - Math.max(record.plain.m.c, record.trick?.m.c ?? 0)
  if (gain < 2) return `<p class="fs-note">${escapeHtml(words.noGain)}</p>`
  return `<article class="fs-card"><h3>${escapeHtml(words.ceiling)}</h3>
<p class="fs-note">${escapeHtml(words.ceilingNote)}</p>${headline(record.ceiling, text)}${steps(record.ceiling.spec, text)}${outcomeBar(record.ceiling.m, text)}</article>`
}

export function notesLine(text) {
  const frames = REACTION.human
  return `<p class="fs-note">${escapeHtml(text.finder.reaction(frames, seconds(frames)))} ${escapeHtml(text.finder.sample(SAMPLE.final))}</p>`
}

export function missingCard(text) {
  return `<article class="fs-card"><p>${escapeHtml(text.finder.notComputed)}</p>
<button type="button" class="route-button" data-fs-run>${escapeHtml(text.finder.run)}</button></article>`
}
