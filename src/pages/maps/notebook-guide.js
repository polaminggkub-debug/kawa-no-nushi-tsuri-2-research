import { progressMarkup, bindNotebookProgress } from './notebook-progress.js'

const copy = {
  en: {
    title: 'Fish checklist',
    help: 'How to check your journal / why the counts differ',
    fullRoute: (count) => `Collect all ${count} species · one entry per fish`,
    fullRouteNote:
      'Each species is listed once, in the first area with a configured point. A point may be inactive in your current run; choose a fish to check its map points or compatible gear.',
    routeGroup: (stage, count) => `Area ${stage} · ${count} new species`,
    recordableLabel: (stage) => `species available in Area ${stage} · not a required page total`,
    newCount: (count) => `New on the full route: ${count}`,
    repeatedCount: (count) => `Also occur earlier: ${count}`,
    areaCountsTitle:
      'Map species with journal slots available by area · some occur in multiple areas',
    areaCount: (stage, count) => `Area ${stage}: ${count} available here`,
    newTitle: (count) => `Show the ${count} new species to catch here`,
    repeated: (count) => `Also found in an earlier area · ${count}`,
    repeatedNote:
      'If any are still missing from your journal, you can catch them in this area too.',
    excluded: (count) => `On this map, not in the 66-species journal · ${count}`,
    excludedNote: '',
    details: 'Fish details',
    mapAction: 'Map points',
    equipmentAction: 'Compatible gear',
    actionsFor: (name) => `Next actions for ${name}`,
    id: 'ID',
    countNoteTitle: 'Why the count in your game journal can differ',
    countNote: () =>
      'The game assigns each species to the area of its largest-size record. A same-size or smaller catch leaves the record where it is; a larger catch moves it to the new area. There is no fixed target for each page. Add all six page counts to check progress toward 66.',
    triggerLimit:
      'Controller-only replay confirmed an Area 1 Yamame landing: after the landing message progressed, its notebook size/area changed from 0/0 to 23/1. This confirms one landed-catch path; it does not establish every failure or species outcome.',
    evidence: 'ROM evidence and method',
    evidenceLink: 'Read the notebook record research',
    spawnNote:
      'These are the game’s configured area candidates. If a point has no fish in your current run, open the map to check whether this species has other recorded points.',
    verifyTitle: 'After fishing: check the game journal before ticking this list',
    verifyBody:
      'Land the fish, finish the landing messages, then open Tool 05 (Fishing Notebook) and check that its name appears on one of the six pages.',
    verifyLink: 'View Tool 05 details · Fishing Notebook',
    empty: 'No new species are listed for this area in the route.',
  },
  ja: {
    title: '魚チェックリスト',
    help: '確認方法・ゲーム内の数と異なる理由',
    fullRoute: (count) => `全${count}種を集める · 魚ごとに1項目`,
    fullRouteNote:
      '各魚は設定上の出現地点がある最初のエリアに一度だけ掲載します。今のプレイでは地点が有効とは限りません。魚を選び、地図の地点や対応する道具を確認してください。',
    routeGroup: (stage, count) => `エリア${stage} · 初登場${count}種`,
    recordableLabel: (stage) => `エリア${stage}の図鑑対象種 · ページの必要数ではありません`,
    newCount: (count) => `全エリアルートで初登場: ${count}種`,
    repeatedCount: (count) => `前のエリアにも出現: ${count}種`,
    areaCountsTitle: 'エリア別・出現地点のある図鑑対象種 · 複数エリアに出現する魚もいます',
    areaCount: (stage, count) => `エリア${stage}: ${count}種が出現可能`,
    newTitle: (count) => `このエリアで釣る新しい魚 ${count}種を見る`,
    repeated: (count) => `前のエリアにも登場 · ${count}種`,
    repeatedNote: '図鑑にまだ記録されていない魚がいれば、このエリアでも釣れます。',
    excluded: (count) => `マップには出るが図鑑66種の対象外 · ${count}種`,
    excludedNote: '',
    details: '魚の詳細',
    mapAction: '地図の釣り場',
    equipmentAction: '使える道具',
    actionsFor: (name) => `${name}の次の操作`,
    id: 'ID',
    countNoteTitle: 'ゲーム内図鑑の数と異なる理由',
    countNote: () =>
      '魚種は最大サイズの記録があるエリアのページに記録されます。同じか小さい魚を釣っても記録は移らず、より大きい魚を釣ると新しいエリアのページに移ります。各ページに固定の目標数はありません。6ページの数を合計して全66種の進行を確認してください。',
    triggerLimit:
      '通常のコントローラー操作でエリア1のヤマメを取り込み、取り込みメッセージを進めた後に図鑑のサイズ・エリアが0/0から23/1へ変化しました。取り込みによる更新例であり、全魚種・失敗時の挙動を証明するものではありません。',
    evidence: 'ROMの根拠と調査方法',
    evidenceLink: '魚図鑑の記録に関する調査を読む',
    spawnNote:
      'ゲームの設定上、このエリアに出現する魚です。現在のプレイで地点に魚がいないときは、地図を開いて同種の別地点があるか確認してください。',
    verifyTitle: '釣りのあと、ゲーム内の図鑑を確認してからチェック',
    verifyBody:
      '魚を取り込み、取り込みメッセージを最後まで進めてから道具05「釣りノート」を開き、魚名が6ページのいずれかにあるか確認してください。',
    verifyLink: '道具05の詳細 · 釣りノート',
    empty: 'このエリアにルート上の新しい魚種はありません。',
  },
  th: {
    title: 'เช็กลิสต์ปลา',
    help: 'วิธีเช็กในเกม / ทำไมจำนวนไม่ตรงกัน',
    fullRoute: (count) => `เก็บให้ครบ ${count} ชนิด · ไม่ซ้ำ`,
    fullRouteNote:
      'จัดปลาแต่ละชนิดไว้ครั้งเดียวในด่านแรกที่มีจุดเกิดในข้อมูลเกม จุดนั้นอาจไม่มีปลาในรอบที่เล่น เลือกปลาเพื่อตรวจจุดบนแผนที่หรือเลือกอุปกรณ์ที่ใช้ได้',
    routeGroup: (stage, count) => `ด่าน ${stage} · ปลาใหม่ ${count} ชนิด`,
    recordableLabel: (stage) => `ชนิดที่ลงสมุดได้และพบในด่าน ${stage} · ไม่ใช่ยอดที่หน้าสมุดต้องมี`,
    newCount: (count) => `ปลาใหม่ในเส้นทางครบทุกด่าน: ${count} ชนิด`,
    repeatedCount: (count) => `พบได้ในด่านก่อนด้วย: ${count} ชนิด`,
    areaCountsTitle: 'ชนิดปลาที่มีช่องในสมุดและมีจุดตก แยกตามด่าน · บางชนิดพบได้หลายด่าน',
    areaCount: (stage, count) => `ด่าน ${stage}: มีจุดตกที่บันทึกได้ ${count} ชนิด`,
    newTitle: (count) => `ดูรายชื่อปลาใหม่ ${count} ชนิดที่ควรเก็บในด่านนี้`,
    repeated: (count) => `พบในด่านก่อนหน้าด้วย · ${count} ชนิด`,
    repeatedNote: 'ถ้าชนิดไหนยังไม่มีในสมุด คุณยังตกในด่านนี้ได้',
    excluded: (count) => `มีบนแผนที่ แต่ไม่มีช่องในสมุด 66 ชนิด · ${count} ชนิด`,
    excludedNote: '',
    details: 'ดูข้อมูลปลา',
    mapAction: 'ดูจุดตกบนแผนที่',
    equipmentAction: 'ดูอุปกรณ์ที่ใช้ได้',
    actionsFor: (name) => `เลือกทำต่อสำหรับ${name}`,
    id: 'ID',
    countNoteTitle: 'ทำไมเลขในสมุดเกมถึงไม่เท่ากับจำนวนในไกด์',
    countNote: () =>
      'เกมจะลงชนิดปลาไว้ในหน้าด่านที่มีสถิติปลาขนาดใหญ่สุด ปลาที่ขนาดเท่าหรือเล็กกว่าสถิติเดิมจะไม่ย้ายรายการ ถ้าตกได้ตัวใหญ่กว่า รายการจะย้ายไปหน้าด่านใหม่ แต่ละหน้าจึงไม่มียอดเป้าหมายตายตัว ให้บวกยอดทั้ง 6 หน้าเพื่อเช็กความคืบหน้าให้ครบ 66 ชนิด',
    triggerLimit:
      'เล่นด้วยปุ่มควบคุมตามปกติแล้วตกยามาเมะในด่าน 1 ขึ้นได้ หลังผ่านข้อความตกสำเร็จ ค่าขนาด/ด่านในสมุดเปลี่ยนจาก 0/0 เป็น 23/1 ยืนยันทางบันทึกจากการตกขึ้นหนึ่งกรณี ยังไม่ได้พิสูจน์ผลของทุกชนิดปลาหรือทุกกรณีที่ตกไม่สำเร็จ',
    evidence: 'หลักฐาน ROM และวิธีตรวจสอบ',
    evidenceLink: 'อ่านบันทึกการแกะระบบสมุดปลา',
    spawnNote:
      'รายการนี้คือปลาที่เกมตั้งไว้ในด่าน บางจุดอาจไม่มีปลาในรอบที่เล่น ถ้าจุดที่ไปไม่มีปลา ให้เปิดแผนที่ตรวจว่าปลาชนิดนั้นมีจุดอื่นหรือไม่',
    verifyTitle: 'หลังตกปลา ให้เช็กสมุดเกมก่อนติ๊กเช็กลิสต์นี้',
    verifyBody:
      'ตกปลาให้ขึ้นและผ่านข้อความผลการตกจนจบ จากนั้นเปิดไอเท็ม 05 “สมุดบันทึกการตกปลา” แล้วดูว่าชื่อปลาปรากฏอยู่ในหน้าด่านใดด่านหนึ่งหรือไม่',
    verifyLink: 'ดูรายละเอียดไอเท็ม 05 · สมุดบันทึกการตกปลา',
    empty: 'ไม่มีปลาใหม่ตามเส้นทางในด่านนี้',
  },
}

function localizedCopy(ctx) {
  return copy[ctx.lang] || copy.en
}

function normalizedId(ctx, id) {
  return ctx.idNorm ? ctx.idNorm(id) : String(id).toUpperCase().padStart(2, '0')
}

function eligibleFish(ctx, ids, profiles) {
  return (Array.isArray(ids) ? ids : [])
    .map((id) => normalizedId(ctx, id))
    .filter((id) => profiles[id]?.notebookEligible === true && ctx.species[id])
}

function excludedFish(ctx, ids, profiles) {
  return (Array.isArray(ids) ? ids : [])
    .map((id) => normalizedId(ctx, id))
    .filter((id) => profiles[id]?.notebookEligible === false && ctx.species[id])
}

function notebookReturn(ctx, id = '') {
  if (id && id === ctx.notebookSpecies)
    return `${ctx.sourceReturn().split('#')[0]}#notebook-species-${id}`
  const anchor = ctx.notebookFullRoute ? `notebook-route-${ctx.activeStage}` : 'notebook-guide'
  return `${ctx.sourceReturn().split('#')[0]}#${anchor}`
}

function localizedPage(ctx, page) {
  const suffix = ctx.lang === 'en' ? '' : `.${ctx.lang}`
  return `${page}${suffix}.html`
}

function notebookItemLink(ctx) {
  const query = new URLSearchParams({
    category: 'general_tool',
    id: '05',
    stage: String(ctx.activeStage),
    return: notebookReturn(ctx),
  })
  return `${localizedPage(ctx, 'item')}?${query}`
}

function notebookVerificationMarkup(ctx, copyText) {
  return `<section class="notebook-verification" data-notebook-verification><h4>${ctx.esc(copyText.verifyTitle)}</h4><p>${ctx.esc(copyText.verifyBody)}</p><a data-notebook-open href="${ctx.esc(notebookItemLink(ctx))}">${ctx.esc(copyText.verifyLink)} ↗</a></section>`
}

function notebookHelp(ctx, guide, copyText, recordableCount, newCount, repeatCount) {
  return `<details class="notebook-help" data-notebook-help><summary>${ctx.esc(copyText.help)}</summary><section class="notebook-count-explainer"><h4>${ctx.esc(copyText.countNoteTitle)}</h4><p>${ctx.esc(copyText.countNote(ctx.activeStage, recordableCount, newCount, repeatCount))}</p></section>${notebookVerificationMarkup(ctx, copyText)}<p class="notebook-target-note">${ctx.esc(copyText.spawnNote)}</p>${areaCountLinks(ctx, guide, copyText)}</details>`
}

function fishActionLinks(ctx, id, returnPath) {
  const stage = String(
    id === ctx.notebookSpecies ? ctx.notebookSelectedStage || ctx.activeStage : ctx.activeStage,
  )
  const fishQuery = new URLSearchParams({
    id,
    stage,
    return: returnPath,
  })
  if (ctx.selectedRoute) fishQuery.set('route', ctx.selectedRoute)
  const detailHref = `${localizedPage(ctx, 'fish')}?${fishQuery}`
  const mapQuery = new URLSearchParams({
    stage,
    fish: id,
    return: returnPath,
  })
  if (ctx.selectedRoute) mapQuery.set('route', ctx.selectedRoute)
  const mapHref = `${localizedPage(ctx, 'maps')}?${mapQuery}#map-view`
  const equipmentQuery = new URLSearchParams({
    fish: id,
    stage,
    return: returnPath,
  })
  if (ctx.selectedRoute) equipmentQuery.set('route', ctx.selectedRoute)
  const equipmentHref = `${localizedPage(ctx, 'index')}?${equipmentQuery}#fish-location-panel`
  return { detailHref, mapHref, equipmentHref }
}

function focusContext(ctx, id) {
  if (!ctx.notebookFullRoute || id !== ctx.notebookSpecies) return ''
  const first = ctx.activeStage
  const selected = ctx.notebookSelectedStage || first
  const label =
    ctx.lang === 'th'
      ? `จัดไว้ในด่าน ${first} เพื่อไม่นับซ้ำ · จุดตกที่เลือก: ด่าน ${selected}`
      : ctx.lang === 'ja'
        ? `重複しないようエリア${first}に掲載 · 選択中の釣り場：エリア${selected}`
        : `Filed under Area ${first} to avoid duplicates · Selected fishing area: ${selected}`
  return `<p class="notebook-focus-context">${ctx.esc(label)}</p>`
}

function fishCard(ctx, copyText, id) {
  const fish = ctx.species[id]
  const image = fish.visual?.image
    ? `<img loading="lazy" src="${ctx.esc(fish.visual.image)}" alt="">`
    : ''
  const returnPath = notebookReturn(ctx, id)
  const { detailHref, mapHref, equipmentHref } = fishActionLinks(ctx, id, returnPath)
  const actionsLabel = copyText.actionsFor(fish.name)
  const className = ctx.notebookFullRoute ? 'notebook-fish notebook-route-fish' : 'notebook-fish'
  const focused = id === ctx.notebookSpecies ? ' data-notebook-focused' : ''
  const anchor = ctx.notebookFullRoute ? ` id="notebook-species-${ctx.esc(id)}"${focused}` : ''
  return `<article class="${className}" data-notebook-card="${ctx.esc(id)}"${anchor}><a class="notebook-fish-main" data-notebook-action="details" href="${ctx.esc(detailHref)}" aria-label="${ctx.esc(fish.name)} · ${ctx.esc(copyText.details)}">${image}<span><strong>${ctx.esc(fish.name)}</strong><small>${ctx.esc(copyText.id)} ${ctx.esc(id)} · ${ctx.esc(copyText.details)} ↗</small></span></a>${focusContext(ctx, id)}<nav class="notebook-fish-actions" aria-label="${ctx.esc(actionsLabel)}"><a data-notebook-action="map" href="${ctx.esc(mapHref)}">${ctx.esc(copyText.mapAction)} ↗</a><a data-notebook-action="equipment" href="${ctx.esc(equipmentHref)}">${ctx.esc(copyText.equipmentAction)} ↗</a></nav></article>`
}

function fishList(ctx, copyText, ids) {
  return ids.map((id) => fishCard(ctx, copyText, id)).join('')
}

function fullRouteMarkup(ctx, guide, copyText) {
  const seen = new Set()
  const groups = guide.stages
    .map((entry) => {
      const ids = eligibleFish(ctx, entry.firstOccurrenceSpecies, guide.species).filter((id) => {
        if (seen.has(id)) return false
        seen.add(id)
        return true
      })
      const routeCtx = {
        ...ctx,
        activeStage: entry.stage,
        notebookFullRoute: true,
        notebookSelectedStage: ctx.activeStage,
      }
      const selected =
        Number(ctx.notebookRouteStage) || (ctx.openNotebookGuide ? Number(ctx.activeStage) : 0)
      const open = selected === entry.stage ? ' open' : ''
      return `<details id="notebook-route-${entry.stage}" class="notebook-route-group" data-notebook-route-stage="${entry.stage}" data-route-count="${ids.length}"${open}><summary>${ctx.esc(copyText.routeGroup(entry.stage, ids.length))}</summary><div class="notebook-fish-list">${fishList(routeCtx, copyText, ids)}</div></details>`
    })
    .join('')
  const open = ctx.notebookRouteStage || ctx.openNotebookGuide ? ' open' : ''
  return `<details class="notebook-full-route" data-notebook-route-total="${seen.size}"${open}><summary>${ctx.esc(copyText.fullRoute(seen.size))}</summary><p>${ctx.esc(copyText.fullRouteNote)}</p>${groups}</details>`
}

function detailsList(ctx, kind, title, note, ids, copyText) {
  if (!ids.length) return ''
  const noteMarkup = note ? `<p>${ctx.esc(note)}</p>` : ''
  return `<details class="notebook-${kind}"><summary>${ctx.esc(title(ids.length))}</summary>${noteMarkup}<div class="notebook-fish-list">${fishList(ctx, copyText, ids)}</div></details>`
}

function areaCountLinks(ctx, guide, copyText) {
  const links = guide.stages
    .map((entry) => {
      const stage = Number(entry.stage)
      const ids = entry.speciesIds || entry.species || []
      const count = eligibleFish(ctx, ids, guide.species).length
      const query = new URLSearchParams({ stage: String(stage) })
      if (ctx.returnPath) query.set('return', ctx.returnPath)
      const href = `${localizedPage(ctx, 'maps')}?${query}#notebook-guide`
      const current = stage === Number(ctx.activeStage) ? ' aria-current="page"' : ''
      return `<a class="notebook-area-count" data-notebook-area="${stage}" data-notebook-count="${count}" href="${ctx.esc(href)}" aria-label="${ctx.esc(copyText.areaCount(stage, count))}"${current}><span>${ctx.esc(ctx.c.area(stage))}</span><strong>${ctx.esc(count)}</strong></a>`
    })
    .join('')
  return `<div class="notebook-area-counts"><p>${ctx.esc(copyText.areaCountsTitle)}</p><nav aria-label="${ctx.esc(copyText.areaCountsTitle)}">${links}</nav></div>`
}

function evidenceLink(ctx, copyText) {
  const href =
    'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/notebook-completion-research.md'
  return `<details class="notebook-evidence"><summary>${ctx.esc(copyText.evidence)}</summary><p>${ctx.esc(copyText.triggerLimit)}</p><p><a href="${href}">${ctx.esc(copyText.evidenceLink)} ↗</a></p></details>`
}

export function notebookGuideMarkup(ctx) {
  const guide = ctx.notebookCompletion
  const stage = guide?.stages?.find((entry) => entry.stage === Number(ctx.activeStage))
  if (!guide?.species || !stage || typeof ctx.fishHref !== 'function') return ''
  const copyText = localizedCopy(ctx)
  const newIds = eligibleFish(ctx, stage.firstOccurrenceSpecies, guide.species)
  const repeatedIds = eligibleFish(ctx, stage.repeatedFromEarlierStages, guide.species)
  const excludedIds = excludedFish(ctx, stage.excludedFromNotebook, guide.species)
  const recordableCount = eligibleFish(
    ctx,
    stage.speciesIds || stage.species || [],
    guide.species,
  ).length
  const repeated = detailsList(
    ctx,
    'repeated',
    copyText.repeated,
    copyText.repeatedNote,
    repeatedIds,
    copyText,
  )
  const excluded = detailsList(
    ctx,
    'excluded',
    copyText.excluded,
    copyText.excludedNote,
    excludedIds,
    copyText,
  )
  return `<div class="notebook-guide-panel" data-stage="${ctx.activeStage}" data-notebook-total="${recordableCount}" data-notebook-new="${newIds.length}" data-notebook-repeated="${repeatedIds.length}"><div class="notebook-guide-heading"><div><p class="notebook-eyebrow">${ctx.esc(copyText.title)}</p><h3>${ctx.esc(ctx.c.area(ctx.activeStage))}</h3></div></div><div class="notebook-count-summary"><p class="notebook-recordable"><strong>${recordableCount}</strong><span>${ctx.esc(copyText.recordableLabel(ctx.activeStage))}</span></p><div class="notebook-count-breakdown"><p>${ctx.esc(copyText.newCount(newIds.length))}</p><p>${ctx.esc(copyText.repeatedCount(repeatedIds.length))}</p></div></div>${progressMarkup(ctx)}${notebookHelp(ctx, guide, copyText, recordableCount, newIds.length, repeatedIds.length)}${fullRouteMarkup(ctx, guide, copyText)}${repeated}${excluded}${evidenceLink(ctx, copyText)}</div>`
}

export function renderNotebookGuide(ctx) {
  const mount = ctx.$('notebook-guide')
  if (!mount) return
  const markup = notebookGuideMarkup(ctx)
  mount.innerHTML = markup
  mount.hidden = !markup
  if (markup) bindNotebookProgress(ctx, mount)
}
