import assert from 'node:assert/strict'
import { data, galleryForage, render, assertForagePointReturn, unescapeHtml } from './shared.mjs'

for (const lang of ['en', 'th', 'ja']) await checkForage(lang)

async function checkForage(lang) {
  const glass = data.items.find((item) => item.category === 'general_tool' && item.id === '03')
  const points = glass.playerUse.useLocations.filter((location) => location.forage)
  const anchored = await render(
    'item',
    lang,
    `category=general_tool&id=03&stage=3&fish=06&route=sinker#forage-stage-3-context-1`,
  )
  assert(anchored.nodes['forage-stage-3-context-1']?.scrolled)
  const result = await render(
    'item',
    lang,
    new URLSearchParams({
      category: 'general_tool',
      id: '03',
      stage: '1',
      fish: '06',
      route: 'sinker',
    }),
  )
  checkItemForageMarkers(result, points, lang)
  const baitIds = [
    ...new Set(
      points.flatMap((point) =>
        point.markerItems.filter((ref) => ref.category === 'bait').map((ref) => ref.id),
      ),
    ),
  ]
  const gallery = await galleryForage(lang)
  const mushroom = await render(
    'item',
    lang,
    new URLSearchParams({ category: 'food', id: '09', stage: '1', fish: '06', route: 'sinker' }),
  )
  checkForageRecovery(mushroom)
  checkGalleryForageMarkers(gallery, result, glass, points, lang)
  for (const id of baitIds) await checkBaitForageChoices(id, points, gallery, lang)
}

function checkItemForageMarkers(result, points, lang) {
  for (const point of points) {
    const anchor = `forage-stage-${point.stage}-context-${Number(point.context)}`
    const section = result.html.match(
      new RegExp(`<article class="detail-section" id="${anchor}">([\\s\\S]*?)</article>`),
    )?.[1]
    assert(section, `Missing precise forage landing point ${anchor}`)
    const markers = [...section.matchAll(/class="tool-use-pin"[\s\S]*?<\/span>/g)].flatMap(
      (match) => [...match[0].matchAll(/href="([^"]+)"/g)],
    )
    assert.equal(markers.length, point.markerItems.length)
    for (const [index, match] of markers.entries()) {
      const next = new URL(unescapeHtml(match[1]), result.url)
      assert.equal(next.searchParams.get('category'), point.markerItems[index].category)
      assert.equal(next.searchParams.get('id'), point.markerItems[index].id)
      assert.equal(next.searchParams.get('stage'), String(point.stage))
      assert.equal(next.searchParams.get('fish'), '06')
      assert.equal(next.searchParams.get('route'), 'sinker')
      assertForagePointReturn(
        match[1],
        result.url,
        lang,
        point.stage,
        point.context,
        '06',
        'sinker',
      )
    }
  }
}

function checkForageRecovery(result) {
  const recovery = result.html.match(/data-mushroom-alternative href="([^"]+)"/)
  assert(recovery)
  const food = new URL(unescapeHtml(recovery[1]), result.url)
  assert.equal(food.searchParams.get('category'), 'food')
  assert.equal(food.searchParams.get('id'), '01')
  assert.equal(food.searchParams.get('stage'), '1')
  assert(!food.searchParams.has('fish'))
  assert(!food.searchParams.has('route'))
  const returned = new URL(food.searchParams.get('return'), result.url)
  assert.equal(returned.searchParams.get('category'), 'food')
  assert.equal(returned.searchParams.get('id'), '09')
  assert.equal(returned.searchParams.get('stage'), '1')
  assert.equal(returned.searchParams.get('fish'), '06')
  assert.equal(returned.searchParams.get('route'), 'sinker')
}

function checkGalleryForageMarkers(gallery, result, glass, points, lang) {
  gallery.setState('1')
  const sections = [
    ...gallery.locations(glass).matchAll(/<section class="location-map">([\s\S]*?)<\/section>/g),
  ]
  assert.equal(sections.length, points.length)
  for (const [index, match] of sections.entries()) {
    const point = points[index]
    const pin = match[1].match(/<span class="map-pin"[\s\S]*?<\/span>/)?.[0] || ''
    const links = [...pin.matchAll(/href="([^"]+)"/g)]
    assert.equal(links.length, point.markerItems.length)
    for (const [markerIndex, link] of links.entries()) {
      const next = new URL(unescapeHtml(link[1]), result.url)
      assert.equal(next.searchParams.get('stage'), String(point.stage))
      assert.equal(next.searchParams.get('id'), point.markerItems[markerIndex].id)
      assert.equal(next.searchParams.get('fish'), '06')
      assert.equal(next.searchParams.get('route'), 'sinker')
      assertForagePointReturn(link[1], result.url, lang, point.stage, point.context, '06', 'sinker')
    }
  }
}

async function checkBaitForageChoices(id, points, gallery, lang) {
  const matches = points.filter((point) =>
    point.markerItems.some((ref) => ref.category === 'bait' && ref.id === id),
  )
  const item = data.items.find((entry) => entry.category === 'bait' && entry.id === id)
  for (const route of ['float', 'sinker']) {
    const fish = (item.playerUse.fishIdsByRoute?.[route] || [])[0]
    if (!fish) continue
    await checkBaitForageStages(id, item, matches, gallery, lang, route, fish)
  }
}

async function checkBaitForageStages(id, item, matches, gallery, lang, route, fish) {
  const stages = [...new Set(matches.map((point) => Number(point.stage)))]
  for (const stage of [1, 2, 3, 4, 5, 6]) {
    const expected = stages.includes(stage) ? [stage] : stages
    const bait = await render(
      'item',
      lang,
      new URLSearchParams({ category: 'bait', id, stage: String(stage), fish, route }),
    )
    gallery.setState(String(stage), fish, route)
    checkCatalogueBaitChoice(gallery.choice(item, data.items), expected, bait.url, fish, route)
    checkItemBaitChoice(bait, expected, matches, id, fish, route, stage)
  }
}

function checkCatalogueBaitChoice(html, expected, base, fish, route) {
  const links = [...html.matchAll(/data-forage-bait href="([^"]+)"/g)].map(
    (match) => new URL(unescapeHtml(match[1]), base),
  )
  assert.deepEqual(
    links.map((url) => Number(url.searchParams.get('stage'))),
    expected,
  )
  for (const next of links) {
    assert.equal(next.searchParams.get('fish'), fish)
    assert.equal(next.searchParams.get('route'), route)
    assert.equal(next.searchParams.get('id'), '03')
    assert(next.hash.startsWith('#forage-stage-'))
  }
}

function checkItemBaitChoice(bait, expected, matches, id, fish, route, stage) {
  const links = [...bait.html.matchAll(/data-forage-bait href="([^"]+)"/g)]
  assert.equal(
    links.length,
    expected.length,
    `Missing area-specific forage choice ${id}/${fish}/${route}/${stage}`,
  )
  for (const [index, match] of links.entries()) {
    const next = new URL(unescapeHtml(match[1]), bait.url)
    assert.equal(next.searchParams.get('category'), 'general_tool')
    assert.equal(next.searchParams.get('id'), '03')
    assert.equal(next.searchParams.get('stage'), String(expected[index]))
    assert.equal(next.searchParams.get('fish'), fish)
    assert.equal(next.searchParams.get('route'), route)
    const point = matches.find((location) => Number(location.stage) === expected[index])
    assert.equal(next.hash, `#forage-stage-${point.stage}-context-${Number(point.context)}`)
    const back = new URL(next.searchParams.get('return'), bait.url)
    assert.equal(back.searchParams.get('category'), 'bait')
    assert.equal(back.searchParams.get('id'), id)
    assert.equal(back.searchParams.get('fish'), fish)
    assert.equal(back.searchParams.get('route'), route)
    assert.equal(back.searchParams.get('stage'), String(stage))
  }
}
