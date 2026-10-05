import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, root, unescapeHtml } from './shared.mjs'
import { renderStrategyShops } from '../build_frontend.mjs'
import { setupTopicNavigation } from '../../src/pages/strategy/topic-navigation.js'

for (const locale of ['en', 'ja', 'th']) checkLocale(locale)
checkLanguageTopicClick()

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
    assert(item, `Missing shop data for ${category}:${id}`)
    const links = [...content.matchAll(/href="([^"]+)"/g)]
    const stages = [...new Set(item.playerUse.shops.map((shop) => String(shop.stage)))].sort()
    assert.deepEqual(
      links.map(([, href]) => new URL(unescapeHtml(href), base).searchParams.get('stage')).sort(),
      stages,
    )
    const topic = category === 'lure' ? 'lure-kit' : 'rod-choice'
    for (const [, href] of links) {
      const target = new URL(unescapeHtml(href), base)
      assert.equal(target.pathname, `/catalogue/shops${suffix}.html`)
      assert.equal(target.searchParams.get('category'), category)
      assert.equal(target.searchParams.get('id'), id)
      assert.equal(target.searchParams.get('place'), 'town')
      assertReturnTopic(target, base, topic)
    }
  }
  checkItemReturns(html, base, suffix, 'lure-kit', 'rod-choice')
  checkItemReturns(html, base, suffix, 'rod-choice', 'technical-evidence')
  for (const anchor of ['lure-kit', 'rod-choice', 'technical-evidence']) {
    assert(html.includes(`href="#${anchor}"`))
    assert(html.includes(`id="${anchor}"`))
  }
}

function sectionContent(html, id, nextId) {
  const start = html.indexOf(`<section id="${id}">`)
  const nextTag =
    nextId === 'technical-evidence'
      ? '<details id="technical-evidence"'
      : `<section id="${nextId}">`
  const end = html.indexOf(nextTag, start + 1)
  assert(start >= 0 && end > start, `Missing strategy section ${id}`)
  return html.slice(start, end)
}

function checkItemReturns(html, base, suffix, topic, nextTopic) {
  const section = sectionContent(html, topic, nextTopic)
  const links = [...section.matchAll(/href="([^"]*\/catalogue\/item(?:\.[a-z]+)?\.html\?[^"]+)"/g)]
  assert(links.length > 0, `No item detail links in #${topic}`)
  for (const [, href] of links) {
    const target = new URL(unescapeHtml(href), base)
    assert.equal(target.pathname, `/catalogue/item${suffix}.html`)
    assert.equal(target.searchParams.get('category'), topic === 'lure-kit' ? 'lure' : 'rod')
    assertReturnTopic(target, base, topic)
  }
}

function assertReturnTopic(target, base, topic) {
  const returnTo = target.searchParams.get('return')
  assert(returnTo, `${target.pathname} link has no return destination`)
  assert.equal(new URL(returnTo, target).href, `${base.href}#${topic}`)
}

function checkLanguageTopicClick() {
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')
  const previousLocation = Object.getOwnPropertyDescriptor(globalThis, 'location')
  try {
    for (const topic of ['#lure-kit', '#rod-choice', '#technical-evidence'])
      simulateLanguageClick(topic)
  } finally {
    restoreGlobal('document', previousDocument)
    restoreGlobal('location', previousLocation)
  }
}

function simulateLanguageClick(topic) {
  const anchor = { href: 'index.ja.html' }
  let onLanguageClick
  const languages = { addEventListener: (_type, handler) => (onLanguageClick = handler) }
  const topics = { addEventListener() {} }
  const evidence = { open: false }
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: new URL(`https://example.test/research/index.th.html${topic}`),
  })
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      getElementById: (id) => (id === 'strategy-topics' ? topics : evidence),
      querySelector: (selector) =>
        selector === '.strategy-languages'
          ? languages
          : selector === '#strategy-topics'
            ? topics
            : null,
    },
  })
  setupTopicNavigation()
  assert.equal(typeof onLanguageClick, 'function')
  onLanguageClick({ target: { closest: (selector) => (selector === 'a[href]' ? anchor : null) } })
  assert.equal(new URL(anchor.href).hash, topic)
  assert.equal(new URL(anchor.href).pathname, '/research/index.ja.html')
}

function restoreGlobal(name, descriptor) {
  if (descriptor) Object.defineProperty(globalThis, name, descriptor)
  else delete globalThis[name]
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
  'PASS: all nine strategy shop links and item details return to their localized topic; language links preserve the current hash; recorded stock is enforced.',
)
