import assert from 'node:assert/strict'
import { data, locations } from './shared.mjs'

export function checkGrowthBadges(page, locale, stages) {
  const { runtime, location } = page
  for (const stage of stages) checkStage(runtime, location, locale, stage)
}

function checkStage(runtime, location, locale, stage) {
  const candidates = expectedFish(stage)
  const initial = candidates.filter((id) =>
    data.waterIcons.profiles[id]?.initialClasses?.includes('large'),
  )
  const growth = candidates.filter((id) =>
    data.waterIcons.profiles[id]?.growthOnlyClasses?.includes('large'),
  )
  const unknown = candidates.length - initial.length - growth.length
  const target = growth[0] || candidates[0] || ''
  resetState(runtime, stage, 'large')
  runtime.selectedFish = target
  runtime.render()
  checkCounts(runtime, locale, stage, candidates.length, initial.length, growth.length, unknown)
  checkRows(runtime, location, locale, stage, candidates, growth, target)
  checkOtherMarks(runtime, stage)
}

function expectedFish(stage) {
  return Object.entries(locations.fish)
    .filter(
      ([id, fish]) =>
        data.waterIcons.profiles[id]?.possibleClasses?.includes('large') &&
        (fish.locations || []).some((entry) => Number(entry.stage) === stage),
    )
    .map(([id]) => id)
    .sort()
}

function checkCounts(runtime, locale, stage, total, initial, growth, unknown) {
  const html = runtime.$('water-icon-key').innerHTML
  const expected = countCopy(locale, stage, total, initial, growth, unknown)
  if (!total) {
    assert(!html.includes('water-mark-class-counts'), `${locale}/${stage}: empty class counts`)
    return
  }
  assert(html.includes(expected[0]), `${locale}/${stage}: total ${total} missing`)
  assert(html.includes('class="water-mark-class-counts"'), `${locale}: size counts missing`)
  assert(html.includes(expected[1]), `${locale}/${stage}: initial count ${initial} missing`)
  checkGrowthCount(html, locale, stage, expected[2], growth)
  checkUnknownCount(html, locale, stage, expected[3], unknown)
}

function countCopy(locale, stage, total, initial, growth, unknown) {
  return {
    en: [
      `Area ${stage}: ROM data lists ${total} species that may use the “Large fish: 50 cm or more” mark.`,
      `Can show this mark at initial size: ${initial} species.`,
      `${growth} more are conditional large-mark candidates after growth.`,
      `ROM size-phase data is unavailable for ${unknown} more species.`,
    ],
    th: [
      `ด่าน ${stage}: มีปลา ${total} ชนิดที่ข้อมูล ROM ระบุว่าอาจใช้สัญลักษณ์ “ปลาใหญ่: ตั้งแต่ 50 ซม.”`,
      `แสดงสัญลักษณ์นี้ได้ตั้งแต่ขนาดเริ่มต้น: ${initial} ชนิด`,
      `มีอีก ${growth} ชนิดที่เข้าเงื่อนไขปลาใหญ่หลังโต`,
      `ยังไม่มีข้อมูลแบ่งตามช่วงขนาดสำหรับปลาอีก ${unknown} ชนิด`,
    ],
    ja: [
      `エリア${stage}：ROM上で「大魚影：50cm以上」を使う可能性がある魚種は${total}種です。`,
      `初期サイズからこのマークを表示できる魚：${initial}種`,
      `成長後に大魚影となる条件付き候補：さらに${growth}種`,
      `サイズ段階の分類データがない魚：${unknown}種`,
    ],
  }[locale]
}

function checkGrowthCount(html, locale, stage, expected, growth) {
  if (!growth) {
    assert(!html.includes(expected), `${locale}/${stage}: unexpected growth count`)
    return
  }
  assert(html.includes(expected), `${locale}/${stage}: growth count missing`)
  assert(
    html.includes('icon build') ||
      html.includes('สร้างไอคอนใหม่') ||
      html.includes('アイコンが再生成'),
    `${locale}/${stage}: growth caveat missing`,
  )
}

function checkUnknownCount(html, locale, stage, expected, unknown) {
  assert.equal(
    html.includes(expected),
    Boolean(unknown),
    `${locale}/${stage}: unknown count ${unknown}`,
  )
}

function checkRows(runtime, location, locale, stage, candidates, growth, target) {
  const rows = [
    ...runtime.fishList.innerHTML.matchAll(/<div class="fish-choice-row[^>]*>([\s\S]*?)<\/div>/g),
  ]
  const byId = new Map(rows.map(([, row]) => [row.match(/data-fish="([0-9A-F]{2})"/)?.[1], row]))
  assert.deepEqual([...byId.keys()].sort(), candidates, `${locale}/${stage}: large-mark rows`)
  for (const id of candidates) checkRow(byId.get(id), location, locale, stage, id, growth, target)
}

function checkRow(row, location, locale, stage, id, growth, target) {
  const hasBadge = row.includes('class="water-mark-growth-badge"')
  assert.equal(hasBadge, growth.includes(id), `${locale}/${stage}/${id}: conditional badge`)
  if (hasBadge) {
    const labels = {
      en: 'Conditional: 50 cm + a new icon build',
      th: 'เงื่อนไข: โตถึง 50 ซม. แล้วสร้างไอคอนใหม่',
      ja: '条件：50cm以上＋アイコン再生成',
    }
    assert(row.includes(labels[locale]), `${locale}/${stage}/${id}: condition label`)
  }
  checkFishLink(row, location, locale, stage, id, target)
}

function checkFishLink(row, location, locale, stage, fishId, selectedFish) {
  const href = row.match(/<a class="fish-details-link" href="([^"]+)"/)?.[1]
  assert(href, `${locale}/${stage}/${fishId}: detail link missing`)
  const detail = new URL(href.replaceAll('&amp;', '&'), location.href)
  assert(detail.pathname.endsWith(`/fish${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(detail.searchParams.get('id'), fishId)
  assert.equal(detail.searchParams.get('stage'), String(stage))
  const returned = new URL(detail.searchParams.get('return'), location.href)
  assert(returned.pathname.endsWith(`/maps${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(returned.searchParams.get('stage'), String(stage))
  assert.equal(returned.searchParams.get('mark'), 'large')
  assert.equal(returned.searchParams.get('fish') || '', selectedFish)
  const outer = new URL(returned.searchParams.get('return'), location.href)
  assert.equal(outer.searchParams.get('category'), 'hook')
  assert.equal(outer.hash, '#catalogue')
}

function checkOtherMarks(runtime, stage) {
  for (const mark of ['small', 'bubble', '']) {
    resetState(runtime, stage, mark)
    runtime.renderFishList()
    assert(
      !runtime.fishList.innerHTML.includes('water-mark-growth-badge'),
      `${mark}: stale growth badge`,
    )
  }
}

function resetState(runtime, stage, mark) {
  runtime.activeStage = stage
  runtime.activeWaterMark = mark
  runtime.selectedFish = ''
  runtime.searchTerm = ''
  runtime.searchInput.value = ''
  runtime.listScope = 'area'
  runtime.activeSection = runtime.chooseSection(stage)
}
