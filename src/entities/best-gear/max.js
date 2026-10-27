import { escapeHtml } from './view.js'

/** The MAX-size line of one fish: its MAX, a tag where MAX takes long to raise, and the two story fish's rules. */
export function maxHtml(text, fish) {
  const max = fish.max
  if (max?.status === 'quest-only') return escapeHtml(text.maxAkame)
  if (max?.status === 'story-only') return escapeHtml(text.maxEel)
  const line = escapeHtml(text.maxSize(fish.size[1]))
  if (!max?.slow) return line
  const note = escapeHtml(text.maxSlowNote(max.picks, max.nights))
  return `${line} <span class="bg-tag">${escapeHtml(text.maxSlow)}</span><small>${note}</small>`
}

/** The biggest size most players meet: Akame is 150 cm only for character 1 before its quest. */
export const shownHigh = (fish) =>
  fish.max?.status === 'quest-only' ? fish.max.reachable.otherwise : fish.size[1]
