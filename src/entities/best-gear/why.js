import { trustBadge } from '../../shared/lib/index.js'
import { bestGearCopy, escapeHtml } from './view.js'

const EVIDENCE_URL =
  'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/gear-fish-matrix.md'

/** The collapsed "why" block: the fish's own numbers and the evidence link. */
export function whyHtml(locale, fish) {
  const text = bestGearCopy(locale)
  const best = Object.values(fish.methods.float?.stages ?? {}).find((entry) => entry.kits.length)
    ?.kits[0]
  const lines = [text.startsLine(fish.base)]
  best?.starts.forEach((notch, band) => {
    if (notch != null) lines.push(text.startsWith(text.bands[band], notch))
  })
  const need = fish.methods.float?.need
  const reachLine = need ? text.reach(need) : ''
  if (need) lines.push(reachLine)
  return `<details class="bg-why"><summary>${escapeHtml(text.detailsTitle)}</summary><ul>${lines.map((line) => `<li>${escapeHtml(line)}${line === reachLine ? ` ${trustBadge(locale, 'unconfirmed')}` : ''}</li>`).join('')}</ul><p>${escapeHtml(text.evidence)} <a href="${EVIDENCE_URL}">${escapeHtml(text.evidenceLink)}</a></p></details>`
}
