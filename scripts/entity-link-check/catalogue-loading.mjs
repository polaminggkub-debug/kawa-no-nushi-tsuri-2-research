import assert from 'node:assert/strict'
import { renderCatalogue } from './shared.mjs'

for (const locale of ['en', 'ja', 'th']) {
  const pending = await renderCatalogue(locale, '?category=lure&fish=06', true)
  assert.equal(pending.nodes['category-menu'].hidden, true, 'Hide stale menu links while loading')
  assert(pending.nodes.cards.innerHTML.includes('role="status"'))
  assert(!pending.nodes.cards.innerHTML.includes('<article'))
  assert.equal(pending.nodes['category-decisions'].innerHTML, '')
  assert.equal(pending.nodes['rod-comparison'].innerHTML, '')
  const failed = await renderCatalogue(locale, '?category=lure&fish=06', 'failure')
  assert.equal(failed.nodes['category-menu'].hidden, true)
  assert(failed.nodes.cards.innerHTML.includes('role="alert"'))
  assert(failed.nodes.cards.innerHTML.includes('route-button'))
  assert(!failed.nodes.cards.innerHTML.includes('<article'))
  const loaded = await renderCatalogue(locale, '?category=lure&fish=06')
  assert.equal(
    loaded.nodes['category-menu'].hidden,
    false,
    'Show menu only after contextual links and events are ready',
  )
  assert(loaded.nodes.cards.innerHTML.includes('<article'))
  assert(!loaded.nodes.cards.innerHTML.includes('role="alert"'))
}
console.log(
  'PASS: selected catalogue loading and failed-data states show actionable status instead of stale rod cards in EN/JA/TH.',
)
