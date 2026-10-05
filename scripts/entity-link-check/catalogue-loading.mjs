import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { renderCatalogue, root } from './shared.mjs'

for (const locale of ['en', 'ja', 'th']) {
  checkRecoveryPlacement(locale)
  const pending = await renderCatalogue(locale, '?category=lure&fish=06', true)
  assert.equal(pending.nodes['category-menu'].hidden, true, 'Hide stale menu links while loading')
  assert(pending.nodes.cards.innerHTML.includes('role="status"'))
  assert(!pending.nodes.cards.innerHTML.includes('<article'))
  assert.equal(pending.nodes['category-decisions'].innerHTML, '')
  assert.equal(pending.nodes['rod-comparison'].innerHTML, '')
  const failed = await renderCatalogue(
    locale,
    '?category=lure&fish=06&stage=3&route=lure#catalogue',
    'failure',
  )
  assert.equal(failed.nodes['category-menu'].hidden, true)
  assert.equal(failed.nodes['catalogue-load-feedback'].hidden, false)
  assert(failed.nodes['catalogue-load-feedback'].innerHTML.includes('role="alert"'))
  assert(failed.nodes['catalogue-load-feedback'].innerHTML.includes('id="catalogue-retry"'))
  assert(failed.nodes['catalogue-load-feedback'].innerHTML.includes('route-button'))
  assert(!failed.nodes.cards.innerHTML.includes('<article'))
  assert.equal(typeof failed.nodes['catalogue-retry'].listeners.click, 'function')
  let reloadCalls = 0
  failed.url.reload = () => reloadCalls++
  const failedUrl = failed.url.href
  failed.nodes['catalogue-retry'].listeners.click()
  assert.equal(reloadCalls, 1, `${locale}: catalogue retry did not reload`)
  assert.equal(failed.url.href, failedUrl, `${locale}: catalogue retry changed filters or hash`)
  const loaded = await renderCatalogue(locale, '?category=lure&fish=06')
  assert.equal(
    loaded.nodes['category-menu'].hidden,
    false,
    'Show menu only after contextual links and events are ready',
  )
  assert(loaded.nodes.cards.innerHTML.includes('<article'))
  assert(!loaded.nodes.cards.innerHTML.includes('role="alert"'))
}

function checkRecoveryPlacement(locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const html = fs.readFileSync(
    path.join(root, `src/pages/equipment/ui/index${suffix}.html`),
    'utf8',
  )
  const feedback = html.indexOf('<div id="catalogue-load-feedback" hidden>')
  const filters = html.indexOf('<div class="filters" role="search">')
  assert(feedback >= 0 && feedback < filters, `${locale}: recovery must start above the filters`)
}
console.log(
  'PASS: selected catalogue loading and failed-data states show actionable status instead of stale rod cards in EN/JA/TH.',
)
