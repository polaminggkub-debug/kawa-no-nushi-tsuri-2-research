import { spriteOf, withSprite } from '../../shared/lib/index.js'
import { copy_en } from './copy_en.js'
import { copy_ja } from './copy_ja.js'
import { copy_th } from './copy_th.js'

const COPY = { en: copy_en, th: copy_th, ja: copy_ja }
const SLOT_OF_METHOD = { float: 'bait', lure: 'lure', fly: 'fly' }

export const bestGearCopy = (locale) => COPY[locale] ?? copy_en

export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  )

export function itemPic(data, locale, slot, id, size = 'gear') {
  const name = itemName(data, locale, slot, id)
  return withSprite(
    spriteOf(data.names, slot, id),
    escapeHtml(name),
    name,
    slot === 'rod' ? 'rod' : size,
  )
}

export function itemName(data, locale, slot, id) {
  const entry = data.names[slot]?.[id]
  return entry?.[locale] ?? entry?.en ?? String(id)
}

/** The slots of a kit in the order a player buys them: [slot, id, reason-group]. */
export function kitSlots(method, kit) {
  const slots = [['rod', kit.rod, 'rod']]
  if (method === 'float') slots.push(['hook', kit.hook, 'hook'])
  const second = SLOT_OF_METHOD[method]
  slots.push([second, kit[second], second])
  return slots
}

/** Level 0..6 folded into five words: 0 very easy, 1 easy, 2 medium, 3 hard, 4+ very hard. */
const tierOf = (notch) => Math.min(notch, 4)

/** A coloured word pill; the word is always shown, so colour is never the only cue. */
export const easePill = (text, notch) =>
  `<span class="bg-pill bg-pill-${tierOf(notch)}">${escapeHtml(text.tier[tierOf(notch)])}</span>`

/** One line per size the fish really has: "Medium fish (16–35 cm) [Easy]". */
export function easeByBand(text, starts) {
  const items = starts
    .map((notch, band) =>
      notch == null
        ? ''
        : `<li><span class="bg-band">${escapeHtml(text.bands[band])}</span>${easePill(text, notch)}</li>`,
    )
    .join('')
  return `<div class="bg-ease-box"><p class="bg-ease-label">${escapeHtml(text.fightEase)}</p><ul class="bg-ease">${items}</ul></div>`
}

/** The one-line hint shown once per page section. */
export const easeHint = (text) => `<p class="bg-ease-hint">${escapeHtml(text.easeHint)}</p>`
