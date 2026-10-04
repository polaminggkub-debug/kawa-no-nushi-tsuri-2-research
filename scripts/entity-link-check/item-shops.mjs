import assert from 'node:assert/strict'
import { data, render, unescapeHtml } from './shared.mjs'

for (const lang of ['en', 'th', 'ja']) {
  for (const item of data.items.filter((entry) => entry.playerUse?.shops?.length)) {
    await checkItemShopLinks(item, lang)
  }
}

async function checkItemShopLinks(item, lang) {
  const result = await render(
    'item',
    lang,
    new URLSearchParams({
      category: item.category,
      id: item.id,
      stage: '3',
      fish: '06',
      route: 'sinker',
    }),
  )
  const relevant =
    ['rod', 'bait', 'lure', 'hook', 'float_weight', 'fly', 'fly_wing', 'fly_tail'].includes(
      item.category,
    ) ||
    (item.category === 'general_tool' && ['03', '04', '08', '09', '0A', '0E'].includes(item.id))
  const links = [...result.html.matchAll(/href="([^"]*shops(?:\.th|\.ja)?\.html[^"]*)"/g)]
  assert(links.length, `Recorded item has no seller action ${item.category}:${item.id}`)
  for (const match of links) assertShopContext(match[1], result.url, item, relevant)
}

function assertShopContext(href, base, item, relevant) {
  const next = new URL(unescapeHtml(href), base)
  assert.equal(next.searchParams.get('fish'), relevant ? '06' : null)
  assert.equal(next.searchParams.get('route'), relevant ? 'sinker' : null)
  const back = new URL(next.searchParams.get('return'), base)
  assert.equal(back.searchParams.get('fish'), '06')
  assert.equal(back.searchParams.get('route'), 'sinker')
  assert.equal(back.searchParams.get('stage'), '3')
  assert.equal(next.searchParams.get('category'), item.category)
  assert.equal(next.searchParams.get('id'), item.id)
}
