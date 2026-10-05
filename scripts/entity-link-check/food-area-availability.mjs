import assert from 'node:assert/strict'
import { data, render, renderCatalogue, unescapeHtml } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const foods = data.items.filter((item) => item.category === 'food' && item.id <= '06')
const specials = data.items.filter((item) => item.category === 'food' && item.id > '06')
const copy = {
  en: {
    owned: /already own|already have|owned/,
    available: /Sold in Area/i,
    missing: /not in Area .*recorded stock/i,
  },
  ja: { owned: /手持ち|持って/, available: /購入でき/, missing: /販売記録にはありません/ },
  th: {
    owned: /มีอยู่|มี.*แล้ว|ของเดิม/,
    available: /มีขาย|ร้านขาย|ข้อมูล.*ขาย|ขาย.*ข้อมูล/,
    missing: /ไม่มีรายการขาย/,
  },
}
for (const lang of locales) {
  for (const stage of [1, 2, 3, 4, 5, 6]) await checkStage(lang, stage)
  for (const stage of ['', '0', '7', '99']) await checkFallback(lang, stage)
}
console.log(
  'PASS: fixed-food cards and details distinguish recorded local stock from owned use across six areas and three locales.',
)

async function checkStage(lang, stage) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const query = new URLSearchParams({
    category: 'food',
    stage: String(stage),
    return: `maps${suffix}.html?stage=${stage}#notebook-guide`,
    fish: '06',
    q: 'orange',
    route: 'lure',
  })
  const catalogue = await renderCatalogue(lang, `?${query}#catalogue`)
  for (const item of foods) {
    checkPanel(catalogue.runtime.renderItemCard(item), item, lang, stage, catalogue.url, 'card')
    const detail = await render(
      'item',
      lang,
      new URLSearchParams({ ...Object.fromEntries(query), id: item.id }),
    )
    checkPanel(detail.html, item, lang, stage, detail.url, 'detail')
  }
  for (const item of specials) {
    assert.doesNotMatch(catalogue.runtime.renderItemCard(item), /data-food-area-availability=/)
    const detail = await render(
      'item',
      lang,
      new URLSearchParams({ category: 'food', id: item.id, stage: String(stage) }),
    )
    assert.doesNotMatch(detail.html, /data-food-area-availability=/)
  }
}

function checkPanel(html, item, lang, stage, base, surface) {
  const marker = html.match(new RegExp(`<[^>]+data-food-area-availability="${stage}"[^>]*>`))?.[0]
  assert(marker, `${lang}/${stage}/${item.id}/${surface}: food availability missing`)
  const stocked = item.playerUse.shops.some(
    (offer) => Number(offer.stage) === stage && !offer.condition,
  )
  assert(
    marker.includes(`data-stock="${stocked ? 'available' : 'missing'}"`),
    `Wrong food stock ${item.id}/${stage}`,
  )
  const visible = html.split('<details class="evidence"')[0]
  const advice = visible
    .slice(visible.indexOf(marker))
    .split('<details')[0]
    .split('<div class="card-more-content"')[0]
  const text = unescapeHtml(advice.replace(/<[^>]*>/g, ' '))
  assert.match(text, copy[lang].owned, 'Owned-use advice lost')
  assert.match(text, copy[lang][stocked ? 'available' : 'missing'], 'Recorded local status missing')
  assert(text.includes(String(item.playerUse.hpRecovery.hp)), 'Measured recovery lost')
  if (!stocked) checkLocalAction(visible, lang, stage, base, surface)
}

function checkLocalAction(html, lang, stage, base, surface) {
  const links = [...html.matchAll(/<a\b[^>]*data-local-food-choice[^>]*href="([^"]+)"[^>]*>/g)]
  const target = links
    .map((match) => new URL(unescapeHtml(match[1]), base))
    .find(
      (url) =>
        url.pathname.endsWith(`/index${lang === 'en' ? '' : '.' + lang}.html`) &&
        url.searchParams.get('category') === 'food' &&
        url.searchParams.get('stage') === String(stage) &&
        url.searchParams.has('return'),
    )
  assert(target, `Missing local food action ${lang}/${stage}/${surface}`)
  for (const key of ['fish', 'q', 'route', 'id'])
    assert.equal(target.searchParams.has(key), false, `Food action retains unrelated ${key}`)
  const returned = new URL(target.searchParams.get('return'), base)
  assert.equal(returned.origin, base.origin)
  assert.equal(returned.pathname, base.pathname)
  if (surface === 'detail') assert.equal(returned.search, base.search)
  else {
    assert.equal(returned.searchParams.get('stage'), String(stage))
    assert.equal(returned.searchParams.get('return'), base.searchParams.get('return'))
  }
  assert.equal(returned.hash, base.hash)
}

async function checkFallback(lang, stage) {
  const query = new URLSearchParams({ category: 'food' })
  if (stage) query.set('stage', stage)
  const catalogue = await renderCatalogue(lang, `?${query}#catalogue`)
  for (const item of foods) {
    const card = catalogue.runtime.renderItemCard(item)
    assert.doesNotMatch(card, /data-food-area-availability=/)
    assert(
      unescapeHtml(card).includes(item.playerUse.summary[lang]),
      'Canonical card summary changed',
    )
    const detail = await render(
      'item',
      lang,
      new URLSearchParams({ ...Object.fromEntries(query), id: item.id }),
    )
    assert.doesNotMatch(detail.html, /data-food-area-availability=/)
    assert(
      unescapeHtml(detail.html).includes(item.playerUse.summary[lang]),
      'Canonical detail summary changed',
    )
  }
}
