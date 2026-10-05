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
  checkRecordedPrices(item, lang, result.html)
  for (const match of links) assertShopContext(match[1], result.url, item, relevant)
}

function checkRecordedPrices(item, lang, html) {
  if (item.priceYen == null || ['fly', 'fly_wing', 'fly_tail'].includes(item.category)) return
  const sourceLabel = {
    en: 'Price field in ROM',
    ja: 'ROM内の価格欄',
    th: 'ช่องราคาใน ROM',
  }[lang]
  const text = unescapeHtml(html)
  assert(
    text.includes(`${sourceLabel}:</strong> ¥${item.priceYen}`),
    `Technical price evidence disappeared ${item.category}:${item.id}/${lang}`,
  )
  const expectedPrice =
    lang === 'ja'
      ? `${item.priceYen}円`
      : lang === 'th'
        ? `${item.priceYen} เยน`
        : `¥${item.priceYen}`
  for (const shop of item.playerUse.shops) {
    const stage = Number(shop.stage)
    const offer = text.match(
      new RegExp(
        `<article class="detail-section" data-purchase-stage="${stage}"[^>]*>[\\s\\S]*?<\\/article>`,
      ),
    )?.[0]
    assert(offer, `Missing visible stage offer ${item.category}:${item.id}/${stage}`)
    assert(
      offer.includes(expectedPrice),
      `Stage offer price changed ${item.category}:${item.id}/${stage}/${lang}`,
    )
  }
}

function assertShopContext(href, base, item, relevant) {
  const next = new URL(unescapeHtml(href), base)
  if (next.searchParams.get('maker') === '1' || next.hash === '#fly-maker-location') {
    assertFlyMakerContext(next, base, item, relevant)
    return
  }
  assert.equal(next.searchParams.get('fish'), relevant ? '06' : null)
  assert.equal(next.searchParams.get('route'), relevant ? 'sinker' : null)
  const back = new URL(next.searchParams.get('return'), base)
  assert.equal(back.searchParams.get('fish'), '06')
  assert.equal(back.searchParams.get('route'), 'sinker')
  assert.equal(back.searchParams.get('stage'), '3')
  assert.equal(next.searchParams.get('category'), item.category)
  assert.equal(next.searchParams.get('id'), item.id)
}

function assertFlyMakerContext(next, base, item, relevant) {
  assert(['fly', 'fly_wing', 'fly_tail'].includes(item.category))
  const choice = item.flyMakerMenuChoice
  assert(choice && choice.category === item.category && choice.id === item.id)
  assert.equal(next.searchParams.get('maker'), '1')
  assert.equal(next.hash, '#fly-maker-location')
  assert.equal(next.searchParams.get('place'), 'town')
  assert.equal(next.searchParams.get('category'), null)
  assert.equal(next.searchParams.get('id'), null)
  const requestedStage = Number(base.searchParams.get('stage'))
  const access =
    choice.availableAccess?.find((entry) => entry.stage === requestedStage) || choice.access
  assert(access && [1, 2, 3].includes(access.stage))
  assert.equal(next.searchParams.get('stage'), String(access.stage))
  assert.equal(next.searchParams.get('fish'), relevant ? '06' : null)
  assert.equal(next.searchParams.get('route'), relevant ? 'sinker' : null)
  const back = new URL(next.searchParams.get('return'), base)
  assert.equal(back.pathname, base.pathname)
  assert.equal(back.searchParams.get('category'), item.category)
  assert.equal(back.searchParams.get('id'), item.id)
  assert.equal(back.searchParams.get('stage'), base.searchParams.get('stage'))
  assert.equal(back.searchParams.get('fish'), '06')
  assert.equal(back.searchParams.get('route'), 'sinker')
}
