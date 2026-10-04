import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, root, unescapeHtml } from './shared.mjs'
import { renderStrategyShops } from '../build_frontend.mjs'

for (const locale of ['en', 'ja', 'th']) checkLocale(locale)

function checkLocale(locale) {
  const suffix = locale === 'en' ? '' : '.' + locale
  const file = `index${suffix}.html`
  const html = fs.readFileSync(path.join(root, 'research', file), 'utf8')
  const base = new URL(`https://example.test/research/${file}`)
  const cards = [
    ...html.matchAll(/<div class="shop" data-shop-item="([a-z_]+):([0-9A-F]+)">([\s\S]*?)<\/div>/g),
  ]
  assert.equal(cards.length, 9, 'All nine recommendation stock labels must be actionable')
  for (const [, category, id, content] of cards) {
    const item = data.items.find((entry) => entry.category === category && entry.id === id)
    const links = [...content.matchAll(/href="([^"]+)"/g)]
    const stages = [...new Set(item.playerUse.shops.map((shop) => String(shop.stage)))].sort()
    assert.deepEqual(
      links.map(([, href]) => new URL(unescapeHtml(href), base).searchParams.get('stage')).sort(),
      stages,
    )
    for (const [, href] of links) {
      const target = new URL(unescapeHtml(href), base)
      assert.equal(target.pathname, `/catalogue/shops${suffix}.html`)
      assert.equal(target.searchParams.get('category'), category)
      assert.equal(target.searchParams.get('id'), id)
      assert.equal(target.searchParams.get('place'), 'town')
      assert.equal(new URL(target.searchParams.get('return'), target).href, base.href)
    }
  }
  for (const anchor of ['lure-kit', 'rod-choice', 'technical-evidence']) {
    assert(html.includes(`href="#${anchor}"`))
    assert(html.includes(`id="${anchor}"`))
  }
}

assert.throws(
  () =>
    renderStrategyShops(
      '<div class="shop" data-shop-item="lure:2E">Area 6</div>',
      'index.html',
      data,
    ),
  /Unrecorded strategy stock/,
)
console.log(
  'PASS: all strategy stock labels open recorded item sellers with exact localized returns; topic anchors exist in EN/JA/TH, and unrecorded stock is rejected.',
)
