import assert from 'node:assert/strict'
import { data, render, unescapeHtml } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const fishIds = Object.keys(data.fishVisuals).sort((a, b) => parseInt(a, 16) - parseInt(b, 16))
const notebook = data.notebookCompletion.species
const rendered = []

assert.equal(fishIds.length, 73, 'The fish profile guard must cover all 73 entries')
assert.equal(Object.values(notebook).filter((entry) => entry.notebookEligible).length, 66)
assert.deepEqual(
  ['44', '45', '46', '47', '48', '49'].filter((id) => notebook[id]?.notebookEligible === false),
  ['44', '45', '46', '47', '48', '49'],
)
assert.equal(notebook['43'], undefined, 'Profile 43 has no confirmed notebook species record')

for (const locale of locales) {
  for (const id of fishIds) rendered.push(await renderFish(locale, id))
}

for (const page of rendered) checkNotebookStatus(page)
for (const locale of locales)
  checkGiantEelContext(rendered.find((page) => page.locale === locale && page.id === '3B'))
console.log(
  'Fish notebook profiles PASS: 73 profiles × EN/JA/TH show ROM-backed notebook status; the giant-eel request links safely to postcard 06 without inventing a hand-in or reward.',
)

async function renderFish(locale, id) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const record = notebook[id]
  const firstStage = record?.stages?.[0] || 1
  const sourceStage = id === '3B' ? 6 : firstStage
  const returnPath = `maps${suffix}.html?stage=${sourceStage}&fish=${id}#notebook-guide`
  const params = new URLSearchParams({
    id,
    stage: id === '3B' ? '1' : String(firstStage),
    return: returnPath,
  })
  const result = await render('fish', locale, params)
  return { ...result, id, locale, returnPath }
}

function checkNotebookStatus(page) {
  const entry = notebook[page.id]
  const status =
    entry?.notebookEligible === true
      ? 'eligible'
      : entry?.notebookEligible === false
        ? 'excluded'
        : 'unconfirmed'
  const block = markedBlock(page.html, 'data-fish-notebook-status', status)
  checkVisibleBlock(page.html, block, `${page.locale}/${page.id}: notebook status`)
  const text = visibleText(block.html)
  if (page.id !== '3B')
    assert(
      !page.html.includes('data-fish-quest-context'),
      `${page.locale}/${page.id}: eel request leaked to other profiles`,
    )

  if (status === 'eligible') checkEligibleStatus(page, entry, block.html, text)
  else if (status === 'excluded') checkExcludedStatus(page, entry, block.html, text)
  else checkUnconfirmedStatus(page, block.html, text)
}

function checkEligibleStatus(page, entry, html, text) {
  const stages = entry.stages.map(Number).sort((a, b) => a - b)
  assert.equal(attr(html, 'data-notebook-first-stage'), String(entry.firstOccurrenceStage))
  assert.equal(attr(html, 'data-notebook-stages'), stages.join(','))
  assert(text.includes('66'), `${page.locale}/${page.id}: status must identify the 66-species goal`)
  assertFirstArea(text, entry.firstOccurrenceStage, page.locale, page.id)
  assertManualSaveCheck(text, page.locale, page.id)
  assertRecordedFishAdvice(text, page.locale, page.id)
  if (stages.length > 1)
    assertRepeatCopy(
      text,
      stages.filter((stage) => stage !== entry.firstOccurrenceStage),
      page.locale,
      page.id,
    )
  else assertNoOtherAreaCopy(text, page.locale, page.id)
}

function checkExcludedStatus(page, entry, html, text) {
  assert(
    text.includes('66'),
    `${page.locale}/${page.id}: excluded status must name the 66-species goal`,
  )
  assertExcludedCopy(text, page.locale, page.id)
  assert(
    !/first occurrence|new species|初登場|魚種を記録|ปลาใหม่/i.test(text),
    `${page.locale}/${page.id}: excluded species must not read like a notebook route target`,
  )
}

function checkUnconfirmedStatus(page, html, text) {
  assert(
    !html.includes('data-notebook-first-stage'),
    'Profile 43 must not get a fabricated first area',
  )
  assert(
    !html.includes('data-notebook-stages'),
    'Profile 43 must not get fabricated notebook areas',
  )
  assert(
    /unconfirm|not confirmed|未確認|確認でき|ยังระบุชนิดไม่ได้|ยังไม่ยืนยัน|ยังไม่ระบุว่าปลานี้มีช่อง/i.test(
      text,
    ),
    `${page.locale}/43: explain the profile is unresolved rather than excluded`,
  )
  assert(
    !/excluded|対象外|ไม่มีช่องในสมุด/i.test(text),
    `${page.locale}/43: unknown eligibility must not be presented as confirmed exclusion`,
  )
}

function checkGiantEelContext(page) {
  assert(page, 'Missing giant eel profile render')
  const block = markedBlock(page.html, 'data-fish-quest-context', 'postcard-eel')
  checkVisibleBlock(page.html, block, `${page.locale}/3B: postcard context`)
  const text = visibleText(block.html)
  assertDoctorRequestCopy(text, page.locale)
  assertQuestCaveat(text, page.locale)
  checkPostcardLink(page, block.html)
  checkEelMapRoute(page)
}

function checkPostcardLink(page, html) {
  const href = markedHref(html, 'data-fish-postcard-link')
  const itemUrl = new URL(href, page.url)
  const suffix = page.locale === 'en' ? '' : `.${page.locale}`
  assert(itemUrl.pathname.endsWith(`/catalogue/item${suffix}.html`))
  assert.equal(itemUrl.searchParams.get('category'), 'general_tool')
  assert.equal(itemUrl.searchParams.get('id'), '06')
  assert.equal(itemUrl.searchParams.get('stage'), '6')
  const fishReturn = new URL(itemUrl.searchParams.get('return'), itemUrl)
  assert(fishReturn.pathname.endsWith(`/catalogue/fish${suffix}.html`))
  assert.equal(fishReturn.searchParams.get('id'), '3B')
  assert.equal(fishReturn.searchParams.get('stage'), '6')
  assert.equal(fishReturn.searchParams.get('return'), page.returnPath)
}

function checkEelMapRoute(page) {
  const map = page.html.match(
    /<a\b(?=[^>]*data-map-section="s6-c2-r1")(?=[^>]*href="([^"]+)")[^>]*>/,
  )
  assert(map, `${page.locale}/3B: the configured Area 6 point link must remain available`)
  const url = new URL(unescapeHtml(map[1]), page.url)
  assert.equal(url.searchParams.get('fish'), '3B')
  assert.equal(url.searchParams.get('stage'), '6')
  assert.equal(url.searchParams.get('section'), 's6-c2-r1')
}

function markedBlock(html, marker, value) {
  const pattern = new RegExp(`<([a-z]+)\\b(?=[^>]*${marker}="${value}")[^>]*>[\\s\\S]*?<\\/\\1>`)
  const match = html.match(pattern)
  assert(match, `Missing visible profile component ${marker}=${value}`)
  return { html: match[0], index: match.index }
}

function markedHref(html, marker) {
  const match = html.match(new RegExp(`<a\\b(?=[^>]*${marker}\\b)[^>]*href="([^"]+)"`))
  assert(match, `Missing route link ${marker}`)
  return unescapeHtml(match[1])
}

function checkVisibleBlock(pageHtml, block, label) {
  assert(!/\shidden(?:\s|=|>)/i.test(block.html), `${label}: component must be visible`)
  const open = pageHtml.lastIndexOf('<details', block.index)
  const close = pageHtml.lastIndexOf('</details>', block.index)
  assert(open <= close, `${label}: component must not be trapped in collapsed evidence`)
  const mapIndex = pageHtml.indexOf('id="fish-area-map"')
  if (mapIndex >= 0) assert(block.index < mapIndex, `${label}: show status before the map decision`)
}

function visibleText(html) {
  return unescapeHtml(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ')
}

function attr(html, name) {
  const match = html.match(new RegExp(`${name}="([^"]*)"`))
  assert(match, `Missing ${name} on notebook status`)
  return match[1]
}

function assertFirstArea(text, stage, locale, id) {
  const firstArea = {
    en: new RegExp(`first configured in area\\s+${stage}`, 'i'),
    ja: new RegExp(`最初の出現設定：エリア${stage}`),
    th: new RegExp(`พบครั้งแรกที่ด่าน\\s*${stage}`),
  }[locale]
  assert(
    firstArea.test(text),
    `${locale}/${id}: identify the first configured area in the 1-to-6 route`,
  )
}

function assertRepeatCopy(text, stages, locale, id) {
  const repeat = {
    en: /also configured in areas|also (?:appears|found|occurs)/i,
    ja: /同じ魚の出現設定|重複|前のエリア|複数/,
    th: /อีกในด่าน|ซ้ำ|พบในด่านก่อน|พบได้หลายด่าน/,
  }[locale]
  const repeatText = text.split(/[.!。！？;·]/).find((part) => repeat.test(part))
  assert(repeatText, `${locale}/${id}: distinguish first-area and repeat-area appearances`)
  for (const stage of stages)
    assert(repeatText.includes(String(stage)), `${locale}/${id}: list repeat area ${stage}`)
}

function assertNoOtherAreaCopy(text, locale, id) {
  const noOtherArea = {
    en: /no other area is listed/i,
    ja: /出現設定はこのエリアだけ/,
    th: /ไม่มีด่านอื่นระบุปลาชนิดนี้/,
  }[locale]
  assert(
    noOtherArea.test(text),
    `${locale}/${id}: explain that no repeat area is listed in the confirmed data`,
  )
}

function assertExcludedCopy(text, locale, id) {
  const excluded = {
    en: /not (?:one of|in|part of).{0,30}66|excluded/i,
    ja: /対象外|釣る必要はありません/,
    th: /ไม่มีช่อง|ไม่อยู่ใน|ไม่ใช่.*สมุด/,
  }[locale]
  assert(excluded.test(text), `${locale}/${id}: say this map profile is outside the notebook goal`)
  const skip = {
    en: /do not need (?:this species )?to (?:catch|land)|not one of the 66/i,
    ja: /釣る必要はありません|対象外/,
    th: /ไม่ต้องตกชนิดนี้|ไม่ต้อง.*ตก.*สมุด/,
  }[locale]
  assert(
    skip.test(text),
    `${locale}/${id}: tell the player they can skip this species for the 66 goal`,
  )
}

function assertDoctorRequestCopy(text, locale) {
  const request = {
    en: /doctor.{0,40}request|request.{0,40}doctor/i,
    ja: /医者.{0,30}依頼|依頼.{0,30}医者/,
    th: /หมอ.{0,40}(?:ปลาไหล|คำขอ)|(?:ปลาไหล|คำขอ).{0,40}หมอ/,
  }[locale]
  assert(request.test(text), `${locale}/3B: keep the conditional doctor's postcard request context`)
  const condition = {
    en: /if.{0,50}request|after reading|once (?:this|the) request/i,
    ja: /場合|届いたら|届いたとき|依頼があれば/,
    th: /ถ้า|หาก|เมื่ออ่านแล้วพบ/,
  }[locale]
  assert(condition.test(text), `${locale}/3B: make the request context conditional on seeing it`)
}

function assertManualSaveCheck(text, locale, id) {
  const check = {
    en: /(?:check|verify|confirm).{0,50}(?:in.game|tool 05|notebook)/i,
    ja: /(?:ゲーム内|道具05).{0,35}(?:図鑑|ノート)?.{0,25}確認|(?:図鑑|ノート).{0,35}確認/,
    th: /(?:เช็ก|ตรวจ|ยืนยัน).{0,45}(?:ในเกม|สมุด|ไอเท็ม 05)/,
  }[locale]
  assert(check.test(text), `${locale}/${id}: direct the player to confirm the entry in-game`)
}

function assertRecordedFishAdvice(text, locale, id) {
  const advice = {
    en: [/already (?:recorded|listed|in the notebook)/i, /new target/i, /larger/i, /move/i],
    ja: [
      /記録済み/,
      /新(?:しい|たに).{0,20}(?:対象|狙う|目標)|新規対象/,
      /大きい|大きな|最大サイズ/,
      /移動|移る/,
    ],
    th: [
      /บันทึกแล้ว|มีรายการแล้ว|มีชื่อแล้ว/,
      /เป้าหมายปลาใหม่|เป้าหมายใหม่|ไม่ต้อง.*ปลาใหม่/,
      /ตัวที่ใหญ่กว่า|ตัวใหญ่กว่า|ขนาดใหญ่กว่า/,
      /ย้าย/,
    ],
  }[locale]
  for (const [index, test] of advice.entries())
    assert(test.test(text), `${locale}/${id}: missing notebook record advice ${index + 1}`)
}

function assertQuestCaveat(text, locale) {
  const caveat = {
    en: [
      /keep it.*starting village/i,
      /story conditions are complete/i,
      /ending scene.*automatic/i,
    ],
    ja: [/ウナギを残して最初の村/, /物語の条件がそろうと/, /エンディングの自動シーン/],
    th: [/เก็บปลาไหลไว้และกลับหมู่บ้านเริ่มต้น/, /หากเงื่อนไขเนื้อเรื่องครบ/, /ฉากจบอัตโนมัติ/],
  }[locale]
  for (const [index, test] of caveat.entries())
    assert(
      test.test(text),
      `${locale}/3B: preserve conditional ending-return guidance ${index + 1}`,
    )
}
