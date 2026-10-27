import { methodHtml } from './box.js'
import { maxHtml, shownHigh } from './max.js'
import { whyHtml } from './why.js'
import { bestGearCopy, escapeHtml } from './view.js'

export { loadBestGear } from './load.js'
export {
  bestGearCopy,
  buyOf,
  buyText,
  easeByBand,
  easeHint,
  easePill,
  escapeHtml,
  itemName,
  itemPic,
  kitSlots,
} from './view.js'
export { methodHtml } from './box.js'
export { maxHtml, shownHigh } from './max.js'

/** The "best gear" section of one fish page. `fishId` is the decimal ROM profile id. */
export function renderBestGear(data, locale, fishId) {
  const fish = data.best.fish[fishId]
  if (!fish) return ''
  const text = bestGearCopy(locale)
  const methods = Object.entries(fish.methods)
    .map(([method, plan], index) => methodHtml(data, locale, method, plan, index === 0))
    .join('')
  const low = fish.size[0]
  const high = shownHigh(fish)
  return `<section id="best-gear" class="detail-section best-gear"><h2>${escapeHtml(text.title)}</h2><p class="bg-size"><strong>${escapeHtml(text.size(low, high))}</strong> · ${maxHtml(text, fish)}</p>${methods}${whyHtml(locale, fish)}</section>`
}
