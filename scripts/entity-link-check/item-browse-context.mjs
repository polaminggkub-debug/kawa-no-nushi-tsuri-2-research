import assert from 'node:assert/strict'
import { data, render, unescapeHtml } from './shared.mjs'

const fishingCategories = [
  'rod',
  'hook',
  'bait',
  'lure',
  'fly',
  'fly_wing',
  'fly_tail',
  'float_weight',
]
const unrelatedCategories = ['food', 'general_tool']

for (const lang of ['en', 'th', 'ja'])
  for (const route of ['float', 'sinker']) {
    await checkFishingBrowseContext(lang, route)
    await checkUnrelatedBrowseContext(lang, route)
  }

async function checkFishingBrowseContext(lang, route) {
  for (const category of fishingCategories) {
    const item = data.items.find((entry) => entry.category === category)
    assert(item, `Missing representative item for ${category}`)
    const result = await render(
      'item',
      lang,
      new URLSearchParams({ category, id: item.id, fish: '0D', stage: '4', route }),
    )
    const browse = browseUrl(result.html, result.url)
    const fallback = new URL(result.nodes['detail-back'].href, result.url)
    const expectedCategory = category.startsWith('fly') ? 'flymaker' : category
    for (const url of [browse, fallback]) {
      assert.equal(url.searchParams.get('category'), expectedCategory, `${category}/${lang}`)
      assert.equal(url.searchParams.get('fish'), '0D', `${category}/${lang} lost fish context`)
      assert.equal(url.searchParams.get('stage'), '4', `${category}/${lang} lost stage`)
      assert.equal(url.searchParams.get('route'), route, `${category}/${lang} lost rig`)
      assert.equal(url.hash, '#catalogue')
      assert(!url.searchParams.has('return'), 'Browse recovery must not point back to item detail')
      assert(url.pathname.endsWith(`/index${lang === 'en' ? '' : `.${lang}`}.html`))
    }
    if (category.startsWith('fly'))
      for (const url of [browse, fallback]) assert.equal(url.searchParams.get('part'), category)
  }
}

async function checkUnrelatedBrowseContext(lang, route) {
  for (const category of unrelatedCategories) {
    const item = data.items.find((entry) => entry.category === category)
    assert(item, `Missing representative item for ${category}`)
    const result = await render(
      'item',
      lang,
      new URLSearchParams({ category, id: item.id, fish: '0D', stage: '4', route }),
    )
    const browse = browseUrl(result.html, result.url)
    const fallback = new URL(result.nodes['detail-back'].href, result.url)
    for (const url of [browse, fallback]) {
      assert.equal(url.searchParams.get('category'), category)
      assert(!url.searchParams.has('fish'), `${category} browse link carries an unrelated fish`)
      assert(!url.searchParams.has('route'), `${category} browse link carries an unrelated rig`)
    }
  }
}

function browseUrl(html, base) {
  const href = html.match(/<nav class="detail-breadcrumb"[^>]*><a href="([^"]+)"/)?.[1]
  assert(href, 'Item detail is missing its category browse breadcrumb')
  return new URL(unescapeHtml(href), base)
}

console.log(
  'PASS: item browse breadcrumbs and fallback navigation preserve fish, area, and rig for fishing gear; fly parts return to their matching maker tab; food/tools omit stale fish context (EN/JA/TH, float/sinker).',
)
