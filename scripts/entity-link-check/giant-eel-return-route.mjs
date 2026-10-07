import assert from 'node:assert/strict'
import fs from 'node:fs'
import { safeReturn, updateUrl, updateLanguageLinks } from '../../src/pages/maps/fish-search.js'
import { renderEelReturnMarker } from '../../src/pages/maps/eel-return-marker.js'
import { eelEndingEntrance } from '../../src/entities/fish/eel-ending-route.js'
import { data, render, renderCatalogue, unescapeHtml } from './shared.mjs'

const postcard = data.items.find((item) => item.category === 'general_tool' && item.id === '06')
const advice = {
  en: [
    /do not need to keep the eel/i,
    /Area 1 village|village door/i,
    /earlier steps are done|Once the earlier steps/i,
    /ending scene plays automatically/i,
  ],
  ja: [
    /(?:残しておく|残す)必要はありません/,
    /エリア1の村|村の入口/,
    /先の手順/,
    /エンディングが自動で流れます/,
  ],
  th: [
    /ไม่ต้องเก็บ.*ไว้/,
    /หมู่บ้านด่าน 1|ประตูหมู่บ้าน/,
    /ขั้นก่อนหน้า/,
    /ฉากจบจะเริ่มโดยอัตโนมัติ/,
  ],
}
checkProvenance()
await checkEntranceMarker()
checkReturnUrlPersistence()
for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)
console.log(
  'PASS: giant-eel postcatch routes are conditional, linked to the starting-village entrance, and preserve postcard clues without invented recipients or rewards.',
)

async function checkLocale(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const back = `maps${suffix}.html?stage=6&section=s6-c2-r1#map-view`
  const fish = await render(
    'fish',
    lang,
    new URLSearchParams({ id: '3B', stage: '6', route: 'sinker', return: back }),
  )
  const detail = await render(
    'item',
    lang,
    new URLSearchParams({ category: 'general_tool', id: '06', stage: '6', return: back }),
  )
  const catalogue = await renderCatalogue(
    lang,
    `?category=general_tool&stage=6&return=${encodeURIComponent(back)}#catalogue`,
  )
  const card = catalogue.runtime.renderItemCard(postcard)
  for (const [surface, html, base] of [
    ['fish', fish.html, fish.url],
    ['detail', detail.html, detail.url],
    ['card', card, catalogue.url],
  ])
    checkRoute(html, lang, surface, base)
}

function checkRoute(html, lang, surface, base) {
  const marked = html.match(/<p\b[^>]*data-eel-ending-action[^>]*>([\s\S]*?)<\/p>/)
  assert(marked, `${lang}/${surface}: giant eel has no postcatch return action`)
  const text = unescapeHtml(marked[1].replace(/<[^>]+>/g, ' '))
  for (const rule of advice[lang])
    assert.match(text, rule, `${lang}/${surface}: actionable condition missing`)
  const link = html.match(/<a\b[^>]*data-eel-return-map[^>]*href="([^"]+)"/)
  assert(link, 'No starting-village map action')
  assert.match(unescapeHtml(html), /12,\s*189/, 'Entrance coordinates lost')
  const target = new URL(unescapeHtml(link[1]), base)
  assert(target.pathname.endsWith(`/maps${lang === 'en' ? '' : '.' + lang}.html`))
  assert.equal(target.searchParams.get('stage'), '1')
  assert.equal(target.searchParams.get('action'), 'eel-return')
  assert.equal(target.searchParams.get('section'), 's1-c1-r8')
  assert.equal(target.hash, '#map-view')
  for (const key of ['fish', 'id', 'q']) assert.equal(target.searchParams.has(key), false)
  const returned = new URL(target.searchParams.get('return'), base)
  assert.equal(returned.pathname, base.pathname)
  assert.equal(returned.searchParams.get('return'), base.searchParams.get('return'))
  if (surface !== 'card') assert.equal(returned.search, base.search)
  const oldUnknown = {
    en: /Who to give the landed eel to|Who receives the eel after landing/i,
    ja: /釣った後.*(?:誰へ渡す|渡す相手)/,
    th: /หลังตกได้.*ส่งให้ใคร/,
  }[lang]
  assert.doesNotMatch(
    unescapeHtml(html),
    oldUnknown,
    'Obsolete recipient unknown blocks verified next action',
  )
}

function checkProvenance() {
  const proof = JSON.parse(fs.readFileSync('data/giant-eel-ending-route.json', 'utf8'))
  assert.equal(proof.evidenceType, 'rom_code_and_dialogue_trace')
  assert.equal(proof.rom.sha1, 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
  assert.equal(proof.fishId, '3B')
  assert.equal(proof.returnRoute.stage, 1)
  assert.deepEqual(eelEndingEntrance, {
    stage: proof.returnRoute.stage,
    ...proof.returnRoute.point,
  })
  assert.deepEqual(proof.returnRoute.point, { x: 12, y: 189 })
  assert.equal(proof.returnRoute.destinationMapId, 7)
  assert.deepEqual(proof.returnRoute.destinationPoint, { x: 7, y: 77 })
  assert.match(proof.returnRoute.gate, /0x000F/)
  assert.equal(proof.storagePath.storyBitProducer, '01:917A')
  assert.equal(proof.storagePath.basketStore, '01:8AC3..8AD8')
  for (const cpu of ['01:85E4', '01:8AC3', '00:9E62', '02:EC60', '02:EF8D', '02:EFAE'])
    assert(proof.checks.some((entry) => entry.cpu === cpu))
  for (const id of ['03C8', '03CA', '03CC']) assert(proof.messages.some((entry) => entry.id === id))
  assert(proof.messages.find((entry) => entry.id === '03CC').meaning.includes('おわり'))
  for (const phrase of [
    'not a natural completion replay',
    'Thai-patch',
    'exact reward',
    'does not establish eel consumption',
    'does not guarantee',
  ])
    assert(proof.limitations.some((line) => line.includes(phrase)))
  assert(postcard.playerUse.evidence.sources.includes('data/giant-eel-ending-route.json'))
}

async function checkEntranceMarker() {
  const previous = globalThis.location
  globalThis.location = new URL('https://example.test/catalogue/maps.html')
  try {
    for (const lang of ['en', 'ja', 'th']) checkMarkerLocale(renderEelReturnMarker, lang)
  } finally {
    if (previous === undefined) delete globalThis.location
    else globalThis.location = previous
  }
}
function checkMarkerLocale(renderMarker, lang) {
  const suffix = lang === 'en' ? '' : '.' + lang
  const help = { textContent: '' }
  const origin = new URL('https://example.test/catalogue/maps' + suffix + '.html')
  const geometry = { originX: 0, originY: 2688, scale: 1, gutterLeft: 24, gutterTop: 12 }
  const back =
    'fish' + suffix + '.html?id=3B&stage=6&return=maps' + suffix + '.html%3Fstage%3D6%23map-view'
  const ctx = {
    lang,
    eelReturnRequested: true,
    activeStage: 1,
    activeSection: 's1-c1-r8',
    returnPath: safeReturn({}, back),
    esc: (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;'),
    $: () => help,
  }
  const html = renderMarker(ctx, geometry)
  assert.match(html, /data-eel-return-marker data-x="12" data-y="189"/)
  assert.match(html, /left:224px;top:356px/)
  assert.match(help.textContent, advice[lang].at(-1))
  const target = new URL(unescapeHtml(html.match(/href="([^"]+)"/)?.[1] || ''), origin)
  assert.equal(target.searchParams.get('id'), '3B')
  assert.equal(target.searchParams.get('return'), new URL(back, origin).searchParams.get('return'))
  for (const stage of [2, 3, 4, 5, 6])
    assert.equal(renderMarker({ ...ctx, activeStage: stage }, geometry), '')
  for (const activeSection of ['s1-c1-r1', 's1-c2-r8', ''])
    assert.equal(renderMarker({ ...ctx, activeSection }, geometry), '')
  assert.equal(renderMarker({ ...ctx, eelReturnRequested: false }, geometry), '')
  for (const unsafe of ['https://evil.example/', '//evil.example/', 'javascript:alert(1)']) {
    const fallback = renderMarker({ ...ctx, returnPath: safeReturn({}, unsafe) }, geometry)
    assert(!fallback.includes('evil.example') && !fallback.includes('javascript:'))
    const route = new URL(unescapeHtml(fallback.match(/href="([^"]+)"/)[1]), origin)
    assert(route.pathname.endsWith('/item' + suffix + '.html'))
    assert.equal(route.searchParams.get('id'), '06')
  }
}

function checkReturnUrlPersistence() {
  const keys = ['location', 'history', 'document']
  const previous = Object.fromEntries(keys.map((key) => [key, globalThis[key]]))
  const links = ['en', 'th', 'ja'].map((lang) => ({
    dataset: {},
    getAttribute: (key) =>
      key === 'hreflang' ? lang : 'maps' + (lang === 'en' ? '' : '.' + lang) + '.html',
  }))
  let written
  globalThis.location = new URL(
    'https://example.test/catalogue/maps.th.html?action=eel-return#map-view',
  )
  globalThis.history = {
    replaceState: (_, __, value) => {
      written = value
    },
  }
  globalThis.document = { querySelectorAll: () => links }
  const ctx = {
    activeStage: 1,
    activeSection: 's1-c1-r8',
    eelReturnRequested: true,
    returnPath: 'item.th.html?category=general_tool&id=06&return=maps.th.html%3Fstage%3D6',
    localizeReturn: (raw) => raw,
  }
  ctx.updateLanguageLinks = (params) => updateLanguageLinks(ctx, params)
  try {
    updateUrl(ctx)
    assert.equal(new URL(written, location).searchParams.get('action'), 'eel-return')
    for (const link of links) {
      const url = new URL(link.href, location)
      assert.equal(url.searchParams.get('action'), 'eel-return')
      assert.equal(url.searchParams.get('section'), 's1-c1-r8')
      assert.equal(url.searchParams.get('return'), ctx.returnPath)
      assert.equal(url.searchParams.has('fish'), false)
      assert.equal(url.hash, '#map-view')
    }
    ctx.eelReturnRequested = false
    updateUrl(ctx)
    assert.equal(new URL(written, location).searchParams.has('action'), false)
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete globalThis[key]
      else globalThis[key] = previous[key]
    }
  }
}
