import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, itemRefs, render, root, unescapeHtml } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  for (const item of data.items) await checkItemDetail(item, lang, suffix)
  await checkInvalidItemTarget(lang)
  await checkLoadErrorRecovery(lang, suffix)
  await checkRigRouteProfiles(lang)
}

async function checkItemDetail(item, lang, suffix) {
  const returnRoute = `index${suffix}.html?category=${item.category}#catalogue`
  const result = await render(
    'item',
    lang,
    new URLSearchParams({ category: item.category, id: item.id, return: returnRoute }),
  )
  const html = result.html
  assert(
    /class="detail-hero(?:\s|")/.test(html) && !html.includes('class="empty-state"'),
    `Item render failed ${item.category}:${item.id}`,
  )
  assert(html.includes('class="evidence"'), `No collapsed evidence ${item.category}:${item.id}`)
  const visible = html.split('<details class="evidence"')[0]
  checkBaitLureAdvice(item, visible, lang)
  checkBreadcrumb(item, visible, result.url)
  checkShopActions(item, visible, result.url)
  checkSpecialItemActions(item, visible, lang)
  checkItemSources(item, visible, html, lang)
  assert(result.nodes['detail-back'].href.includes('#catalogue'))
}

function checkBaitLureAdvice(item, visible, lang) {
  if (!item.baitLureDecision) return
  const advice = item.baitLureDecision
  assert(visible.includes('data-bait-lure-decision'))
  for (const field of ['label', 'recommendation', 'reason']) {
    assert(
      advice[field]?.[lang] && unescapeHtml(visible).includes(advice[field][lang]),
      `Missing localized bait/lure ${field} ${item.category}:${item.id}`,
    )
  }
  for (const ref of advice.alternatives || []) {
    assert(
      visible.includes(`category=${ref.category}&amp;id=${ref.id}`) ||
        visible.includes(`category=${ref.category}&id=${ref.id}`),
    )
  }
}

function checkBreadcrumb(item, visible, base) {
  const breadcrumb = unescapeHtml(
    visible.match(/<nav class="detail-breadcrumb"[^>]*><a href="([^"]+)"/)?.[1] || '',
  )
  const browse = new URL(breadcrumb, base)
  const flyPart = ['fly', 'fly_wing', 'fly_tail'].includes(item.category)
  assert.equal(browse.searchParams.get('category'), flyPart ? 'flymaker' : item.category)
  if (flyPart) assert.equal(browse.searchParams.get('part'), item.category)
}

function checkShopActions(item, visible, base) {
  // Town gathering navigation is verified separately; it is not a shop offer.
  visible = visible.replace(/<aside[^>]*data-town-paste-bait[\s\S]*?<\/aside>/g, '')
  const routes = [...visible.matchAll(/href="([^"]*shops(?:\.th|\.ja)?\.html[^"]*)"/g)].map(
    (match) => new URL(unescapeHtml(match[1]), base),
  )
  const makerRoutes = routes.filter(isFlyMakerRoute)
  const stockRoutes = routes.filter((route) => !isFlyMakerRoute(route))
  const flyPart = ['fly', 'fly_wing', 'fly_tail'].includes(item.category)
  const offers = flyPart
    ? data.items
        .filter((body) => body.category === 'fly')
        .flatMap((body) =>
          (body.playerUse?.shops || []).filter(
            (shop) =>
              shop.bundle?.[
                item.category === 'fly' ? 'body' : item.category === 'fly_wing' ? 'wing' : 'tail'
              ] === item.id,
          ),
        )
    : item.playerUse?.shops || []
  const stages = new Set(offers.map((shop) => String(shop.stage)))
  if (!flyPart && offers.length && item.priceYen != null) {
    const stockLabel = {
      th: 'พบรายการขายในด่านที่แสดงด้านล่าง',
      en: 'Recorded stock in the areas listed below',
      ja: '下記エリアの在庫記録',
    }[base.pathname.includes('.th.') ? 'th' : base.pathname.includes('.ja.') ? 'ja' : 'en']
    assert(
      unescapeHtml(visible).includes(stockLabel),
      `Shop stock label does not refer to listed areas: ${item.category}:${item.id}`,
    )
  }
  assert.deepEqual(
    [...new Set(stockRoutes.map((route) => route.searchParams.get('stage')))].sort(),
    [...stages].sort(),
    `Missing seller navigation ${item.category}:${item.id}`,
  )
  for (const route of stockRoutes) checkStockRoute(route, item, base)
  for (const route of makerRoutes) checkFlyMakerRoute(route, item, base)
}

function isFlyMakerRoute(route) {
  return route.searchParams.get('maker') === '1' || route.hash === '#fly-maker-location'
}

function checkStockRoute(route, item, base) {
  assert.equal(route.searchParams.get('place'), 'town')
  assert.equal(route.searchParams.get('category'), item.category)
  assert.equal(route.searchParams.get('id'), item.id)
  const back = new URL(route.searchParams.get('return'), base)
  assert.equal(back.searchParams.get('category'), item.category)
  assert.equal(back.searchParams.get('id'), item.id)
}

function checkFlyMakerRoute(route, item, base) {
  assert(['fly', 'fly_wing', 'fly_tail'].includes(item.category))
  const choice = item.flyMakerMenuChoice
  assert(choice && choice.category === item.category && choice.id === item.id)
  assert.equal(route.searchParams.get('maker'), '1')
  assert.equal(route.hash, '#fly-maker-location')
  assert.equal(route.searchParams.get('place'), 'town')
  assert.equal(route.searchParams.get('category'), null)
  assert.equal(route.searchParams.get('id'), null)
  const requestedStage = Number(base.searchParams.get('stage') || 1)
  const access =
    choice.availableAccess?.find((entry) => entry.stage === requestedStage) || choice.access
  assert(access && [1, 2, 3].includes(access.stage))
  assert.equal(route.searchParams.get('stage'), String(access.stage))
  for (const key of ['fish', 'route'])
    assert.equal(route.searchParams.get(key), base.searchParams.get(key))
  const back = new URL(route.searchParams.get('return'), base)
  assert.equal(back.pathname, base.pathname)
  for (const key of ['category', 'id', 'stage', 'fish', 'route', 'return'])
    assert.equal(back.searchParams.get(key), base.searchParams.get(key))
}

function checkSpecialItemActions(item, visible, lang) {
  if (item.category === 'general_tool' && item.id === '01') {
    assert(visible.includes('data-tub-choice'))
    assert(!visible.includes('data-daikon-choice'))
  }
  if (item.category === 'food' && ['09', '0A'].includes(item.id))
    assert(visible.includes('data-mushroom-alternative'))
  if (item.category === 'general_tool' && item.id === '03') {
    const facts = readJson('data/general-tool-actions.json').items['03'].facts[lang]
    assert(unescapeHtml(visible).includes(facts.at(-1)))
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function checkItemSources(item, visible, html, lang) {
  if (item.category === 'food' && ['09', '0A'].includes(item.id)) {
    assert(item.playerUse.evidence.sources.includes('docs/magnifier-mushroom-research.md'))
    assert(unescapeHtml(visible).includes(item.playerUse.summary[lang]))
  }
  if (['hook', 'float_weight'].includes(item.category) && !item.gearDecision) {
    for (const fact of item.playerUse?.facts?.[lang] || [])
      assert(unescapeHtml(visible).includes(fact))
  }
  if (item.gearDecision) checkGearDecision(item, visible, html, lang)
  if (item.netGatherArea)
    assert(
      visible.includes('data-bait-gather-choice') &&
        unescapeHtml(visible).includes('category=general_tool&id=04'),
    )
  if (item.category === 'general_tool' && item.id === '04')
    checkNetLocationCopy(item, visible, lang)
  if (item.category === 'general_tool' && item.id === '0E') checkCompassActions(item, visible, lang)
  if (item.category === 'general_tool' && ['08', '09', '0A'].includes(item.id))
    checkKeepnetCopy(item, visible, lang)
  checkAcquisitionDetails(item, visible, lang)
}

function checkGearDecision(item, visible, html, lang) {
  const scopedWing = item.category === 'fly_wing' && ['25', '26', '66', '67'].includes(item.id)
  if (item.category === 'hook') assert(visible.includes('data-hook-price-guide'))
  for (const field of scopedWing ? [] : ['label', 'recommendation', 'reason']) {
    assert(
      unescapeHtml(visible).includes(item.gearDecision[field][lang]),
      `Gear advice hidden ${item.category}:${item.id}/${field}`,
    )
  }
  for (const id of item.gearDecision.targetFish || []) assert(visible.includes(`id=${id}`))
  if (scopedWing) {
    assert(visible.includes(`data-fly-wing-verdict="${item.id}"`))
    assert(visible.includes(`data-fly-wing-action="${item.id}"`))
  } else if (item.category.startsWith('fly') && item.category !== 'fly')
    assert(visible.includes('data-fly-next'))
  for (const fact of item.playerUse.facts?.[lang] || []) assert(unescapeHtml(html).includes(fact))
}

function checkNetLocationCopy(item, visible, lang) {
  assert(visible.includes('data-net-location-choice'))
  const source = readJson('data/gold-net-location.json')
  for (const location of source.items['general_tool:04'])
    assert(unescapeHtml(visible).includes(location.description[lang]))
  assert(item.playerUse.useLocations.length)
}

function checkCompassActions(item, visible, lang) {
  assert(visible.includes('data-compass-exit-choice'))
  const links = [...visible.matchAll(/data-compass-location href="([^"]+)"/g)]
  assert.equal(links.length, 5)
  links.forEach((match, index) => {
    const next = new URL(unescapeHtml(match[1]), 'https://example.test/catalogue/item.html')
    assert.equal(next.searchParams.get('stage'), String(index + 1))
    assert.equal(next.hash, `#compass-exit-${index + 1}`)
    assert(visible.includes(`id="compass-exit-${index + 1}"`))
  })
  const source = readJson('data/compass-locations.json')
  for (const location of itemRefs.resolveValue(item, 'playerUse', source.items['general_tool:0E']))
    assert(unescapeHtml(visible).includes(location.description[lang]))
  assert(item.playerUse.useLocations.length)
}

function checkKeepnetCopy(item, visible, lang) {
  const source = readJson('data/chum-basket-use.json')
  const facts = itemRefs.resolveValue(item, 'playerUse', source.items[item.id].facts)[lang]
  assert(
    facts.some((fact) =>
      fact.includes(
        lang === 'th'
          ? 'ไม่เสียจำนวนครั้ง'
          : lang === 'ja'
            ? '回数は減りません'
            : 'does not use a charge',
      ),
    ),
  )
  for (const fact of facts)
    assert(unescapeHtml(visible).includes(fact), `Chum action hidden ${item.id}/${lang}`)
  assert(
    visible.includes(
      lang === 'en' ? 'movement can be steered' : lang === 'th' ? 'ชี้ทิศ' : '進行方向',
    ),
  )
  if (item.keepnetCapacity) assert(visible.includes('data-keepnet-choice'))
}

function checkAcquisitionDetails(item, visible, lang) {
  if (item.acquisitionOptions?.length) {
    assert(visible.includes('data-acquisition-choice'))
    assert(visible.indexOf('data-acquisition-choice') < visible.indexOf('id="use-locations"'))
  }
  for (const location of item.playerUse.useLocations || []) {
    if (location.action) assert(unescapeHtml(visible).includes(location.action[lang]))
    if (location.image) assert(visible.includes(`src="${location.image}"`))
    if (location.context === 'town') assertTownLocation(item, visible, location, lang)
  }
  if (item.category === 'fly_wing' && ['25', '26', '66', '67'].includes(item.id))
    assert(visible.includes(`data-fly-wing-action="${item.id}"`))
  else if (item.category.startsWith('fly'))
    assert(visible.includes('data-fly-maker') && visible.includes('#fly-instructions'))
  if (item.category === 'rod') checkRodDetail(item, visible, lang)
}

function assertTownLocation(item, visible, location, lang) {
  assert.equal(location.mapId, location.stage + 6)
  assert.equal(location.fullImage, `maps/rom-town-${String(location.mapId).padStart(2, '0')}.png`)
  assert(Number.isInteger(location.townEntranceOrdinal))
  assert(visible.includes(lang === 'th' ? 'ในเมือง' : lang === 'ja' ? '町内' : 'In town'))
  if (
    location.rewardItem &&
    !(location.rewardItem.category === item.category && location.rewardItem.id === item.id)
  ) {
    assert(
      visible.includes(`category=${location.rewardItem.category}&amp;id=${location.rewardItem.id}`),
    )
  }
}

function checkRodDetail(item, visible, lang) {
  assert(visible.includes(`data-rod-decision="${item.id}"`))
  for (const field of ['label', 'recommendation', 'reason'])
    assert(unescapeHtml(visible).includes(item.rodDecision[field][lang]))
  assert(visible.includes(`data-rod-decision="${item.id}"`))
  assert(!visible.includes('fightResponseCode'))
}

async function checkInvalidItemTarget(lang) {
  const result = await render(
    'item',
    lang,
    new URLSearchParams({ category: 'lure', id: 'FF', fish: '06', stage: '4', route: 'lure' }),
  )
  const title = { en: 'Item not found', ja: '道具が見つかりません', th: 'ไม่พบไอเท็ม' }[lang]
  assert(result.html.includes('class="empty-state"') && result.html.includes(title))
  assert(!result.html.includes('data-item-retry'), `Unknown item became a load error/${lang}`)
}

async function checkLoadErrorRecovery(lang, suffix) {
  const returnRoute = `index${suffix}.html?category=rod&fish=06&stage=4&route=float#catalogue`
  const params = new URLSearchParams({
    category: 'rod',
    id: '04',
    fish: '06',
    stage: '4',
    route: 'float',
    return: returnRoute,
  })
  for (const mode of ['failure', 'malformed']) await checkLoadError(lang, params, mode, returnRoute)
}

async function checkLoadError(lang, params, mode, returnRoute) {
  let emptyCalls = 0
  let loadErrorCalls = 0
  let reloadCalls = 0
  const suffix = lang === 'en' ? '' : `.${lang}`
  const exactUrl = new URL(
    `https://example.test/kawa-no-nushi-tsuri-2-research/catalogue/item${suffix}.html?${params}`,
  ).href
  const result = await render('item', lang, params, undefined, mode, (runtime, { url }) => {
    url.reload = () => reloadCalls++
    const empty = runtime.emptyState
    const loadError = runtime.loadErrorState
    runtime.emptyState = (...args) => {
      emptyCalls++
      return empty(...args)
    }
    runtime.loadErrorState = (...args) => {
      loadErrorCalls++
      return loadError(...args)
    }
  })
  checkLoadErrorMarkup(result, lang)
  assert.equal(result.url.href, exactUrl, `${mode} changed the original item URL/${lang}`)
  assert.equal(emptyCalls, 0, `${mode} was reported as an unknown item/${lang}`)
  assert.equal(loadErrorCalls, 1, `${mode} did not use the retry state/${lang}`)
  assert.equal(
    new URL(result.nodes['detail-back'].href, result.url).href,
    new URL(returnRoute, result.url).href,
    `Load failure lost the source return/${lang}`,
  )
  const retry = result.nodes['item-retry']
  assert.equal(typeof retry.listeners.click, 'function', `Retry is not bound/${lang}`)
  retry.listeners.click()
  assert.equal(reloadCalls, 1, `Retry did not reload/${lang}`)
  assert.equal(result.url.href, exactUrl, `Retry changed the exact page URL/${lang}`)
}

function checkLoadErrorMarkup(result, lang) {
  const title = {
    en: 'Could not load item details',
    ja: '道具の詳細を読み込めませんでした',
    th: 'โหลดรายละเอียดไอเท็มไม่สำเร็จ',
  }[lang]
  assert(result.html.includes('role="alert"') && result.html.includes(title))
  assert(result.html.includes('data-item-retry'))
  const fallback = result.html.match(/data-item-catalogue-fallback href="([^"]+)"/)?.[1]
  assert(fallback, `Load failure has no catalogue fallback/${lang}`)
  const target = new URL(unescapeHtml(fallback), result.url)
  assert.equal(target.pathname.split('/').pop(), `index${lang === 'en' ? '' : `.${lang}`}.html`)
  assert.deepEqual(
    ['category', 'fish', 'stage', 'route'].map((key) => target.searchParams.get(key)),
    ['rod', '06', '4', 'float'],
  )
}

async function checkRigRouteProfiles(lang) {
  for (const route of ['float', 'sinker']) {
    const result = await render(
      'item',
      lang,
      new URLSearchParams({ category: 'bait', id: '01', fish: '06', route }),
    )
    assert(result.html.includes(`id="rig-${route}"`), `Missing rig route ${route}/${lang}`)
  }
}
