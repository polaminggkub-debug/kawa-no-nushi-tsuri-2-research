import assert from 'node:assert/strict'
import { renderWaterKey } from '../../src/pages/maps/water-icons.js'
import { data } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) {
  const node = { innerHTML: '', hidden: true }
  const ctx = {
    lang,
    waterIcons: data.waterIcons,
    selectedFish: '0D',
    $: () => node,
    esc: (text) => String(text),
    fishHref: (id) => `fish${lang === 'en' ? '' : `.${lang}`}.html?id=${id}&stage=4`,
  }
  renderWaterKey(ctx)
  assert.equal(node.hidden, false)
  assert(node.innerHTML.includes('water-bubble.png'))
  assert(!node.innerHTML.includes('water-small.png'))
  assert(node.innerHTML.includes('stage=4#water-icons'))
  ctx.selectedFish = ''
  renderWaterKey(ctx)
  for (const name of ['small', 'large', 'bubble'])
    assert(node.innerHTML.includes(`water-${name}.png`))
}
console.log('Water map key PASS: three locales, selected species classes, fish detail continuation')
