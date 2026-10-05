import assert from 'node:assert/strict'
import { renderCatalogue, unescapeHtml } from './shared.mjs'

for (const locale of ['en', 'ja', 'th']) {
  const { runtime, url } = await renderCatalogue(locale, '?category=float_weight&stage=1&fish=0D')
  const html = unescapeHtml(runtime.floatPriceGuide())
  const rows = [...html.matchAll(/<tr><td>([1-6])<\/td>(.*?)<\/tr>/g)]
  assert.equal(rows.length, 6)
  for (const [, stage, row] of rows) {
    const links = [...row.matchAll(/href="([^"]+)"/g)]
    assert(links.length >= 2, 'Every row must offer float and sinker stock actions')
    for (const [, href] of links) {
      const link = new URL(href, url)
      assert.equal(link.searchParams.get('fish'), '0D')
      const expected = Number(stage) < 4 && link.searchParams.get('id') === '09' ? '4' : stage
      assert.equal(link.searchParams.get('stage'), expected)
    }
  }
}
console.log(
  'PASS: float/sinker price rows open their recorded area; early-area sinker gaps link to first stock in area4.',
)

for (const locale of ['en', 'ja', 'th']) {
  for (const fish of ['01', '06', '28', '38', '46']) {
    const { runtime, url } = await renderCatalogue(
      locale,
      `?category=float_weight&stage=1&fish=${fish}`,
    )
    const html = unescapeHtml(runtime.floatPriceGuide())
    assert.equal([...html.matchAll(/<tr><td>[1-6]<\/td>/g)].length, 6)
    const links = [...html.matchAll(/href="([^"]+)"/g)]
    for (const [, href] of links) {
      const link = new URL(href, url)
      if (link.searchParams.get('category') !== 'float_weight') continue
      const item = runtime.allItems.find(
        (entry) => entry.category === 'float_weight' && entry.id === link.searchParams.get('id'),
      )
      assert(
        item?.playerUse?.fishIds?.includes(fish),
        `Guide recommends incompatible gear ${item?.id} for ${fish}`,
      )
      assert.equal(link.searchParams.get('fish'), fish)
      assert(
        item.playerUse.shops.some(
          (offer) => String(offer.stage) === link.searchParams.get('stage'),
        ),
      )
    }
    if (fish === '01') {
      assert(links.length >= 6, 'Iwana must still have a usable float action in every area')
      assert.doesNotMatch(
        html,
        /id=0[9A](?:&|$)/,
        'Iwana must not be sent to an incompatible sinker',
      )
    }
  }
}
