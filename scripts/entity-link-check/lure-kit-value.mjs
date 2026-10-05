import assert from 'node:assert/strict'
import { data, locations, render, unescapeHtml } from './shared.mjs'

const lures = data.items.filter((item) => item.category === 'lure')
const profiles = new Set(lures.flatMap((item) => item.playerUse?.fishIds || []))
const fullPairs = findFullCoveragePairs()

assert.equal(profiles.size, 38, 'Lure compatibility profile count changed')
checkAreaStockMatrix()

export function checkLureKit(result, lang, fishId, stage) {
  const kit = result.html.match(
    /class="detail-section reusable-kit" data-kit="([^"]+)" data-coverage="(\d+)" data-total="(\d+)" data-local="(true|false)"/,
  )
  assert.equal(Boolean(kit), profiles.has(fishId))
  if (!kit) return

  const pair = kit[1].split('+').map((id) => lures.find((item) => item.id === id))
  assert(pair.every(Boolean), 'Kit has unknown item')
  assert.deepEqual(coveredProfiles(pair), [...profiles].sort())
  assert.equal(Number(kit[2]), profiles.size)
  assert.equal(Number(kit[3]), pairPrice(pair))

  const localPairs = fullPairs.filter((candidate) =>
    candidate.every((item) => stocked(item, stage)),
  )
  const expectedPairs = localPairs.length ? localPairs : fullPairs
  const cheapest = Math.min(...expectedPairs.map(pairPrice))
  assert(
    expectedPairs.some(
      (candidate) => samePair(candidate, pair) && pairPrice(candidate) === cheapest,
    ),
    `Area ${stage} does not show a cheapest complete coverage pair`,
  )
  assert.equal(kit[4], String(Boolean(localPairs.length)))
  checkKitCopy(result.html, lang, Boolean(localPairs.length), stage)
}

function findFullCoveragePairs() {
  const pairs = []
  for (let left = 0; left < lures.length; left++) {
    for (let right = left + 1; right < lures.length; right++) {
      const pair = [lures[left], lures[right]]
      if (pair.every((item) => Number.isFinite(item.priceYen))) {
        if (JSON.stringify(coveredProfiles(pair)) === JSON.stringify([...profiles].sort()))
          pairs.push(pair)
      }
    }
  }
  return pairs
}

function coveredProfiles(pair) {
  return [...new Set(pair.flatMap((item) => item.playerUse?.fishIds || []))].sort()
}

function checkAreaStockMatrix() {
  const expectedPrices = [55, 55, 55, 50, null, null]
  for (const [index, expected] of expectedPrices.entries()) {
    const stage = String(index + 1)
    const localPairs = fullPairs.filter((pair) => pair.every((item) => stocked(item, stage)))
    const actual = localPairs.length ? Math.min(...localPairs.map(pairPrice)) : null
    assert.equal(actual, expected, `ROM-derived full-kit stock changed in area ${stage}`)
  }
}

function stocked(item, stage) {
  return item.playerUse.shops.some(
    (shop) => String(shop.stage) === String(stage) && !shop.condition,
  )
}

function pairPrice(pair) {
  return pair.reduce((sum, item) => sum + item.priceYen, 0)
}

function samePair(left, right) {
  return (
    left
      .map((item) => item.id)
      .sort()
      .join('+') ===
    right
      .map((item) => item.id)
      .sort()
      .join('+')
  )
}

function checkKitCopy(html, lang, hasLocalPair, stage) {
  const section = html.match(/<section class="detail-section reusable-kit"[\s\S]*?<\/section>/)?.[0]
  const scope = {
    en: 'Coverage is lure-type compatibility, not a guarantee of a bite or landing.',
    ja: 'ルアー種類の判定をカバーするもので、食いつきや取り込みの保証ではありません。',
    th: 'ครอบคลุมเงื่อนไขชนิดเหยื่อ ไม่ได้รับประกันว่าปลาจะกินหรือดึงขึ้นสำเร็จ',
  }
  assert(section?.includes(scope[lang]), `Area ${stage} lost its lure-compatibility limit`)
  assert(
    !/notebook|สมุด|ノート|66/.test(section),
    `Area ${stage} confuses kit profiles with notebook count`,
  )
  if (hasLocalPair) {
    const local = {
      en: 'Both items are stocked in your selected area.',
      ja: '選択中エリアで両方買えます。',
      th: 'ซื้อครบคู่นี้ได้ในด่านที่เลือก',
    }
    assert(section.includes(local[lang]), `Area ${stage} hides local complete-pair availability`)
    return
  }
  const noLocal = {
    en: [
      'The selected area does not stock the full pair.',
      'No regular lure sale for this fish is recorded',
    ],
    ja: ['選択中エリアでは両方は揃いません。', 'この魚向けの通常ルアー販売記録がありません。'],
    th: ['ด่านที่เลือกขายไม่ครบคู่นี้', 'ด่านที่เลือกไม่มีรายการขายปกติของลัวร์สำหรับปลานี้'],
  }[lang]
  assert(
    noLocal.some((claim) => section.includes(claim)),
    `Area ${stage} hides missing local kit stock`,
  )
}

export async function checkLureKitNavigation(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  for (let stage = 1; stage <= 6; stage++) {
    const fishId = Object.entries(locations.fish).find(
      ([id, fish]) =>
        profiles.has(id) &&
        (fish.locations || []).some((area) => String(area.stage) === String(stage)),
    )?.[0]
    assert(fishId, `${lang}/${stage}: no lure-compatible fish fixture`)
    const returnRoute = `maps${suffix}.html?stage=${stage}&fish=${fishId}&route=lure&section=s${stage}-c1-r6#map-view`
    const params = new URLSearchParams({
      id: fishId,
      stage: String(stage),
      route: 'lure',
      return: returnRoute,
    })
    const result = await render('fish', lang, params)
    await checkKitItemRoutes(result, lang, fishId, stage, returnRoute)
    if (stage === 2) await checkRejectedKitContext(lang, fishId, returnRoute)
  }
}

async function checkKitItemRoutes(result, lang, fishId, stage, returnRoute) {
  const kit = result.html.match(
    /<section class="detail-section reusable-kit"[\s\S]*?<\/section>/,
  )?.[0]
  assert(kit, `${lang}/${stage}: representative lure kit missing`)
  const kitKey = kit.match(/data-kit="([^"]+)"/)?.[1]
  assert(kitKey, `${lang}/${stage}: full-kit key missing`)
  const links = [...kit.matchAll(/<a class="entity-link" href="([^"]+)"/g)]
  assert.equal(links.length, 2, `${lang}/${stage}: kit should link both lure items`)
  for (const link of links)
    await checkKitItemRoute(link[1], result.url, kit, kitKey, lang, fishId, stage, returnRoute)
}

async function checkKitItemRoute(href, base, kit, kitKey, lang, fishId, stage, returnRoute) {
  const target = new URL(unescapeHtml(href), base)
  assert.equal(target.pathname.split('/').pop(), `item${lang === 'en' ? '' : `.${lang}`}.html`)
  assert.equal(target.searchParams.get('category'), 'lure')
  const itemId = target.searchParams.get('id')
  assert(kit.includes(`data-item="lure:${itemId}"`))
  assert.equal(target.searchParams.get('fish'), fishId)
  assert.equal(target.searchParams.get('stage'), String(stage))
  assert.equal(target.searchParams.get('route'), 'lure')
  assert.equal(target.searchParams.get('kit'), kitKey)
  const fishReturn = new URL(target.searchParams.get('return'), base)
  assert.equal(fishReturn.pathname.split('/').pop(), `fish${lang === 'en' ? '' : `.${lang}`}.html`)
  assert.equal(fishReturn.searchParams.get('id'), fishId)
  assert.equal(fishReturn.searchParams.get('stage'), String(stage))
  assert.equal(fishReturn.searchParams.get('route'), 'lure')
  assert.equal(fishReturn.searchParams.get('return'), returnRoute)
  const detail = await render('item', lang, target.searchParams)
  checkKitContextPanel(detail, lang, itemId, kitKey)
  checkPartnerReturn(detail, lang, itemId, fishId, stage, kitKey, target.searchParams.get('return'))
}

function checkKitContextPanel(result, lang, itemId, kitKey) {
  const panels = [
    ...result.html.matchAll(
      /<section\b[^>]*data-lure-kit-context="([^"]+)"[^>]*>[\s\S]*?<\/section>/g,
    ),
  ]
  assert.equal(
    panels.length,
    1,
    `${lang}/${itemId}: valid pair context panel missing or duplicated`,
  )
  const panel = panels[0][0]
  const tag = panel.match(/<section\b[^>]*>/)?.[0] || ''
  assert.equal(panels[0][1], kitKey)
  assert.equal(tag.match(/data-kit-coverage="(\d+)"/)?.[1], '38')
  const pair = fullPairs.find((candidate) =>
    samePair(
      candidate,
      kitKey.split('+').map((id) => ({ id })),
    ),
  )
  assert(pair, `${lang}/${itemId}: context names a non-covering pair`)
  assert(
    pair.some((item) => item.id === itemId),
    `${lang}/${itemId}: item is outside its stated pair`,
  )
  const partnerId = pair.find((item) => item.id !== itemId).id
  const partner = panel.match(/<a\b[^>]*data-lure-kit-partner="([^"]+)"[^>]*>/)
  assert(partner, `${lang}/${itemId}: partner item action missing`)
  assert.equal(partner[1], partnerId)
  checkKitContextCopy(panel, lang)
}

function checkKitContextCopy(panel, lang) {
  const copy = {
    en: [
      '38 lure-compatible profiles',
      'compare individual items',
      'with a selected fish, they compare choices for that fish',
      'Check the coverage of the complete pair before replacing a member',
      'Coverage does not guarantee a bite or landing',
      'you do not need to buy it again',
    ],
    ja: [
      '38プロフィール',
      '道具単体の比較',
      '魚を選択している場合は、その魚について比較',
      '片方を替えるときはセット全体のカバーも確認',
      '食いつきや取り込みの保証ではありません',
      '買い直す必要はありません',
    ],
    th: [
      '38 โปรไฟล์',
      'เปรียบเทียบไอเท็มแต่ละชิ้น',
      'ถ้าเลือกปลาไว้จะเทียบสำหรับปลานั้น',
      'การเปลี่ยนชิ้นหนึ่งต้องตรวจความครอบคลุมของทั้งคู่',
      'ไม่ได้รับประกันปลากินหรือดึงขึ้นสำเร็จ',
      'ไม่ต้องซื้อซ้ำ',
    ],
  }[lang]
  for (const phrase of copy)
    assert(panel.includes(phrase), `${lang}: kit-context limitation/action missing`)
  assert(!/notebook|สมุด|ノート|66/.test(panel), `${lang}: kit panel makes a notebook-count claim`)
}

function checkPartnerReturn(result, lang, itemId, fishId, stage, kitKey, fishReturn) {
  const panel = result.html.match(
    /<section\b[^>]*data-lure-kit-context="[^"]+"[^>]*>[\s\S]*?<\/section>/,
  )?.[0]
  const href = panel.match(/<a\b[^>]*data-lure-kit-partner="[^"]+"[^>]*href="([^"]+)"/)?.[1]
  const partner = new URL(unescapeHtml(href), result.url)
  assert.equal(partner.searchParams.get('kit'), kitKey)
  assert.equal(partner.searchParams.get('fish'), fishId)
  assert.equal(partner.searchParams.get('stage'), String(stage))
  assert.equal(partner.searchParams.get('route'), 'lure')
  const back = new URL(partner.searchParams.get('return'), result.url)
  assert.equal(back.pathname.split('/').pop(), `item${lang === 'en' ? '' : `.${lang}`}.html`)
  assert.equal(back.searchParams.get('category'), 'lure')
  assert.equal(back.searchParams.get('id'), itemId)
  assert.equal(back.searchParams.get('fish'), fishId)
  assert.equal(back.searchParams.get('stage'), String(stage))
  assert.equal(back.searchParams.get('route'), 'lure')
  assert.equal(back.searchParams.get('kit'), kitKey)
  assert.equal(back.searchParams.get('return'), fishReturn)
}

async function checkRejectedKitContext(lang, fishId, returnRoute) {
  for (const kitKey of ['17+17', '2E+23']) {
    const params = new URLSearchParams({
      category: 'lure',
      id: '17',
      fish: fishId,
      stage: '2',
      route: 'lure',
      return: `fish${lang === 'en' ? '' : `.${lang}`}.html?id=${fishId}&stage=2&route=lure&return=${encodeURIComponent(returnRoute)}`,
      kit: kitKey,
    })
    const result = await render('item', lang, params)
    assert(
      !result.html.includes('data-lure-kit-context'),
      `${lang}: invalid or unrelated kit showed context`,
    )
  }
}
