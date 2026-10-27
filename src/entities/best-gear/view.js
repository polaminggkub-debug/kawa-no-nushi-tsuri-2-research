import { spriteOf, withSprite } from '../../shared/lib/index.js'
import { copy_en } from './copy_en.js'
import { copy_ja } from './copy_ja.js'
import { copy_th } from './copy_th.js'

const COPY = { en: copy_en, th: copy_th, ja: copy_ja }
const SLOT_OF_METHOD = { float: 'bait', lure: 'lure', fly: 'fly' }
const PIPS = 6

export const bestGearCopy = (locale) => COPY[locale] ?? copy_en

export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  )

export function itemPic(data, locale, slot, id, size = 'gear') {
  const name = itemName(data, locale, slot, id)
  return withSprite(spriteOf(data.names, slot, id), escapeHtml(name), name, size)
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

/** Six pips: the more filled, the easier the fight starts. */
export function easePips(text, notch) {
  const filled = PIPS - notch
  const label = `${text.level[notch]} (${filled}/${PIPS})`
  const dots = Array.from({ length: PIPS }, (_, i) => `<i${i < filled ? ' class="on"' : ''}></i>`)
  return `<span class="bg-pips" role="img" aria-label="${escapeHtml(label)}">${dots.join('')}</span>`
}

/** The kit's start for each size band the fish really has, as "Small: [pips] Easy". */
export function easeByBand(text, starts) {
  const items = starts
    .map((notch, band) =>
      notch == null
        ? ''
        : `<li><span class="bg-band">${escapeHtml(text.bandShort[band])}</span>${easePips(text, notch)}<span>${escapeHtml(text.level[notch])}</span></li>`,
    )
    .join('')
  return `<ul class="bg-ease" aria-label="${escapeHtml(text.fightEase)}">${items}</ul>`
}
