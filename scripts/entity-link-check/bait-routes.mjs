import assert from 'node:assert/strict'
import { data, galleryForage, render, unescapeHtml } from './shared.mjs'

for (const lang of ['en', 'th', 'ja']) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  for (const bait of data.items.filter((item) => item.category === 'bait')) {
    await checkBaitRoutes(bait, lang, suffix)
  }
  await checkWormIwana(lang, suffix)
}

async function checkBaitRoutes(bait, lang, suffix) {
  const routes = bait.playerUse.fishIdsByRoute || {}
  for (const route of ['float', 'sinker']) {
    const fish = (routes[route] || [])[0]
    if (!fish) continue
    const result = await acceptedBait(bait, fish, route, lang, suffix)
    checkAcceptedBait(result, bait, fish, route, lang)
    await checkRejectedRoute(bait, routes, fish, route, lang, suffix)
  }
}

function acceptedBait(bait, fish, route, lang, suffix) {
  const returnRoute = `index${suffix}.html?category=bait&fish=${fish}&route=${route}#catalogue`
  return render(
    'item',
    lang,
    new URLSearchParams({
      category: 'bait',
      id: bait.id,
      fish,
      stage: '3',
      route,
      return: returnRoute,
    }),
  )
}

function checkAcceptedBait(result, bait, fish, route, lang) {
  const status = unescapeHtml(
    result.html.match(/class="play-target"[^>]*>[\s\S]*?<br>([\s\S]*?)<\/p>/)?.[1] || '',
  )
  assert(status, `Missing route-specific bait status ${bait.id}/${route}`)
  assert(result.html.includes('data-bait-target-action="accepted"'))
  assert(!result.html.includes('data-switch-bait-route'))
  const compatible = {
    en: 'This fish is in the item’s recorded compatible list.',
    th: 'ปลานี้อยู่ในรายชื่อที่ไอเท็มชิ้นนี้ผ่านเงื่อนไข',
    ja: 'この魚は道具の適合リストに含まれています。',
  }[lang]
  assert(status.includes(compatible), `Accepted bait status missing ${bait.id}/${route}/${fish}`)
  const rigNames = {
    en: { float: 'Float rig:', sinker: 'Sinker rig:' },
    th: { float: 'ชุดทุ่น:', sinker: 'ชุดตะกั่ว:' },
    ja: { float: 'ウキ仕掛け:', sinker: 'オモリ仕掛け:' },
  }
  assert(status.startsWith(rigNames[lang][route]))
  checkBaitAlternatives(result, route)
}

function checkBaitAlternatives(result, route) {
  const compare =
    result.html.match(/class="detail-grid rod-alternatives">([\s\S]*?)<\/div>/)?.[1] || ''
  for (const match of compare.matchAll(/href="([^"]+)"/g)) {
    const next = new URL(unescapeHtml(match[1]), result.url)
    if (next.searchParams.get('category') === 'bait')
      assert.equal(next.searchParams.get('route'), route)
  }
}

async function checkRejectedRoute(bait, routes, fish, route, lang, suffix) {
  if (route !== 'sinker') return
  const floatOnly = (routes.float || []).find((id) => !(routes.sinker || []).includes(id))
  if (!floatOnly) return
  const returnRoute = `index${suffix}.html?category=bait&fish=${floatOnly}&route=sinker#catalogue`
  const result = await render(
    'item',
    lang,
    new URLSearchParams({
      category: 'bait',
      id: bait.id,
      fish: floatOnly,
      stage: '3',
      route,
      return: returnRoute,
    }),
  )
  assert(result.html.includes('data-bait-target-action="rejected"'))
  assert(result.html.includes('data-switch-bait-route'))
  const match = result.html.match(/data-switch-bait-route href="([^"]+)"/)
  assert(match, 'Missing rig switch link')
  const next = new URL(unescapeHtml(match[1]), result.url)
  for (const [key, value] of Object.entries({
    category: 'bait',
    id: bait.id,
    fish: floatOnly,
    stage: '3',
    route: 'float',
  })) {
    assert.equal(next.searchParams.get(key), value, `Rig switch lost ${key}`)
  }
  assert.equal(next.searchParams.get('return'), returnRoute)
}

async function checkWormIwana(lang, suffix) {
  const worm = data.items.find((item) => item.category === 'bait' && item.id === '01')
  assert(worm.playerUse.fishIdsByRoute.float.includes('01'))
  assert(!worm.playerUse.fishIdsByRoute.sinker.includes('01'))
  const returnRoute = `index${suffix}.html?category=bait&fish=01&route=sinker#catalogue`
  const rejected = await render(
    'item',
    lang,
    new URLSearchParams({
      category: 'bait',
      id: '01',
      fish: '01',
      stage: '3',
      route: 'sinker',
      return: returnRoute,
    }),
  )
  assert(rejected.html.includes('data-bait-target-action="rejected"'))
  assert(rejected.html.includes('data-switch-bait-route'))
  assert(!rejected.html.includes('data-forage-bait-choice'))
  checkWormRigSwitch(rejected, returnRoute)
  const accepted = await render(
    'item',
    lang,
    new URLSearchParams({
      category: 'bait',
      id: '01',
      fish: '01',
      stage: '3',
      route: 'float',
      return: returnRoute,
    }),
  )
  assert(accepted.html.includes('data-bait-target-action="accepted"'))
  assert(accepted.html.includes('data-forage-bait-choice'))
  await checkWormForage(accepted, worm, lang)
}

function checkWormRigSwitch(rejected, returnRoute) {
  const match = rejected.html.match(/data-switch-bait-route href="([^"]+)"/)
  assert(match)
  const switched = new URL(unescapeHtml(match[1]), rejected.url)
  for (const [key, value] of Object.entries({
    category: 'bait',
    id: '01',
    fish: '01',
    stage: '3',
    route: 'float',
  })) {
    assert.equal(switched.searchParams.get(key), value, `Worm/Iwana rig switch lost ${key}`)
  }
  assert.equal(switched.searchParams.get('return'), returnRoute)
}

async function checkWormForage(accepted, worm, lang) {
  const gallery = await galleryForage(lang)
  gallery.setState('3', '01', 'sinker')
  assert(!gallery.choice(worm, data.items).includes('data-forage-bait-choice'))
  gallery.setState('3', '01', 'float')
  const choice = gallery.choice(worm, data.items)
  const match = choice.match(/data-forage-bait href="([^"]+)"/)
  assert(match, 'Gallery should show forage for accepted Iwana/float')
  const next = new URL(unescapeHtml(match[1]), accepted.url)
  assert.equal(next.searchParams.get('category'), 'general_tool')
  assert.equal(next.searchParams.get('id'), '03')
  assert.equal(next.searchParams.get('fish'), '01')
  assert.equal(next.searchParams.get('route'), 'float')
  // The worm's only verified dry-land tile is in area 5, so area 3 falls back to it.
  assert.equal(next.hash, '#forage-stage-5-context-2')
}
