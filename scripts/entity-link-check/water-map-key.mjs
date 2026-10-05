import assert from 'node:assert/strict'
import { renderWaterKey } from '../../src/pages/maps/water-icons.js'
import { data } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) {
  const node = { innerHTML: '', hidden: true }
  const ctx = {
    lang,
    waterIcons: data.waterIcons,
    selectedFish: '0D',
    activeStage: 4,
    activeWaterMark: 'bubble',
    waterMarkFishIds: () => ['0D'],
    fishMatchesWaterMark: () => true,
    fishName: (id) => id,
    $: () => node,
    esc: (text) => String(text),
    fishHref: (id) => `fish${lang === 'en' ? '' : `.${lang}`}.html?id=${id}&stage=4`,
  }
  renderWaterKey(ctx)
  assert.equal(node.hidden, false)
  assert.equal(buttonMarks(node.innerHTML).join(','), 'small,large,bubble')
  assert(node.innerHTML.includes('water-small.png'))
  assert(node.innerHTML.includes('water-large.png'))
  assert(node.innerHTML.includes('water-bubble.png'))
  assert(node.innerHTML.includes('aria-pressed="true"'))
  assert(node.innerHTML.includes('stage=4#water-icons'))
  ctx.selectedFish = ''
  renderWaterKey(ctx)
  assert.equal(buttonMarks(node.innerHTML).join(','), 'small,large,bubble')
}

function buttonMarks(html) {
  return [...html.matchAll(/data-water-mark="([a-z]+)"/g)].map((match) => match[1])
}

console.log(
  'Water map key PASS: all three filter choices, active state, and fish detail continuation in three locales',
)
