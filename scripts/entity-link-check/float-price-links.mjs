import assert from 'node:assert/strict'
import { renderCatalogue, unescapeHtml } from './shared.mjs'

for (const locale of ['en', 'ja', 'th']) {
  const { runtime, url } = await renderCatalogue(locale, '?category=float_weight&stage=1&fish=06')
  const html = unescapeHtml(runtime.floatPriceGuide())
  const rows = [...html.matchAll(/<tr><td>([1-6])<\/td>(.*?)<\/tr>/g)]
  assert.equal(rows.length, 6)
  for (const [, stage, row] of rows) {
    const links = [...row.matchAll(/href="([^"]+)"/g)]
    assert(links.length >= 2, 'Every row must offer float and sinker stock actions')
    for (const [, href] of links) {
      const link = new URL(href, url)
      assert.equal(link.searchParams.get('fish'), '06')
      const expected = Number(stage) < 4 && link.searchParams.get('id') === '09' ? '4' : stage
      assert.equal(link.searchParams.get('stage'), expected)
    }
  }
}
console.log(
  'PASS: float/sinker price rows open their recorded area; early-area sinker gaps link to first stock in area4.',
)
