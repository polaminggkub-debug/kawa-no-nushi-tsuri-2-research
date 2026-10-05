import { progressMarkup, bindNotebookProgress } from './notebook-progress.js'

const copy = {
  en: {
    title: 'Fish journal · route checklist',
    recordableLabel: (stage) => `map species with journal slots in Area ${stage}`,
    newCount: (count) => `New on the full route: ${count}`,
    repeatedCount: (count) => `Also occur earlier: ${count}`,
    progress: (stage, count, total) =>
      `Route plan through Area ${stage}: ${count}/${total} unique species · not your save`,
    areaCountsTitle:
      'Map species with journal slots available by area · some occur in multiple areas',
    areaCount: (stage, count) => `Area ${stage}: ${count} available here`,
    newTitle: (count) => `Show the ${count} new species to catch here`,
    repeated: (count) => `Also found in an earlier area · ${count}`,
    repeatedNote:
      'These species already have one journal slot. An equal or smaller size leaves the record unchanged; when the game records a larger size here, the existing entry moves to this area.',
    excluded: (count) => `On this map, not in the 66-species journal · ${count}`,
    excludedNote: 'These fish appear on the map but have no species entry in the journal.',
    details: 'Fish details',
    mapAction: 'Map points',
    equipmentAction: 'Compatible gear',
    actionsFor: (name) => `Next actions for ${name}`,
    id: 'ID',
    countNoteTitle: 'Why the count in your game journal can differ',
    countNote: () =>
      'The game counts species whose largest-size record is assigned to this area. There is no fixed target for each page. Add the six game-page counts to check progress out of 66. Check both fish lists and the other game pages before pursuing a missing species.',
    triggerLimit:
      'The ROM trace confirms the larger-size check, but does not prove which fishing outcomes trigger the journal update.',
    evidence: 'ROM evidence and method',
    evidenceLink: 'Read the notebook record research',
    spawnNote:
      'These are the game’s configured area candidates. If a point has no fish in your current run, open the map to check whether this species has other recorded points.',
    verifyTitle: 'After fishing: check the game journal before ticking this list',
    verifyBody:
      'Open Tool 05 (Fishing Notebook) and compare the fish’s name across all six pages. Page totals can move when a larger-size record moves to another area. Seeing a fish bite alone does not confirm that the journal recorded it.',
    verifyLink: 'View Tool 05 details · Fishing Notebook',
    empty: 'No new species are listed for this area in the route.',
  },
  ja: {
    title: '魚図鑑 · 全66種ルートチェック',
    recordableLabel: (stage) => `エリア${stage}に出現地点があり、図鑑に記録できる魚種`,
    newCount: (count) => `全エリアルートで初登場: ${count}種`,
    repeatedCount: (count) => `前のエリアにも出現: ${count}種`,
    progress: (stage, count, total) =>
      `エリア${stage}までのルート計画: ${count}/${total}種 · セーブデータの進行状況ではありません`,
    areaCountsTitle: 'エリア別・出現地点のある図鑑対象種 · 複数エリアに出現する魚もいます',
    areaCount: (stage, count) => `エリア${stage}: ${count}種が出現可能`,
    newTitle: (count) => `このエリアで釣る新しい魚 ${count}種を見る`,
    repeated: (count) => `前のエリアにも登場 · ${count}種`,
    repeatedNote:
      'この魚種の図鑑枠は1つです。同じか小さいサイズでは記録は変わらず、別エリアでより大きいサイズが記録されると、このエリアへ移ります。',
    excluded: (count) => `マップにはいるが図鑑66種には含まれない · ${count}種`,
    excludedNote: 'マップ上にはいますが、図鑑に魚種の記録枠はありません。',
    details: '魚の詳細',
    mapAction: '地図の釣り場',
    equipmentAction: '使える道具',
    actionsFor: (name) => `${name}の次の操作`,
    id: 'ID',
    countNoteTitle: 'ゲーム内図鑑の数と異なる理由',
    countNote: () =>
      'ゲーム内の数は、最大サイズの記録がこのエリアにある魚種数です。各ページに固定の目標数はありません。6ページの数を合計して全66種の進行を確認し、未記録の魚を探す前に下の両一覧と他のページを確認してください。',
    triggerLimit:
      'ROMコードではサイズ比較を確認しましたが、どの釣果で図鑑更新処理が呼ばれるかは確認できていません。',
    evidence: 'ROMの根拠と調査方法',
    evidenceLink: '魚図鑑の記録に関する調査を読む',
    spawnNote:
      'ゲームの設定上、このエリアに出現する魚です。現在のプレイで地点に魚がいないときは、地図を開いて同種の別地点があるか確認してください。',
    verifyTitle: '釣りのあと、ゲーム内の図鑑を確認してからチェック',
    verifyBody:
      '道具05「釣りノート」を開き、魚名を6ページすべて確認してください。最大サイズの記録が別エリアに移るとページ別の数も変わります。魚が食いついただけでは、図鑑への記録を確認できません。',
    verifyLink: '道具05の詳細 · 釣りノート',
    empty: 'このエリアにルート上の新しい魚種はありません。',
  },
  th: {
    title: 'สมุดปลา · เส้นทางเก็บครบ 66 ชนิด',
    recordableLabel: (stage) => `ชนิดที่มีจุดในแผนที่ด่าน ${stage} และมีช่องในสมุด`,
    newCount: (count) => `ปลาใหม่ในเส้นทางครบทุกด่าน: ${count} ชนิด`,
    repeatedCount: (count) => `พบได้ในด่านก่อนด้วย: ${count} ชนิด`,
    progress: (stage, count, total) =>
      `แผนเก็บปลาไม่ซ้ำถึงด่าน ${stage}: ${count}/${total} ชนิด · ไม่ใช่ความคืบหน้าในเซฟ`,
    areaCountsTitle: 'ชนิดปลาที่มีช่องในสมุดและมีจุดตก แยกตามด่าน · บางชนิดพบได้หลายด่าน',
    areaCount: (stage, count) => `ด่าน ${stage}: มีจุดตกที่บันทึกได้ ${count} ชนิด`,
    newTitle: (count) => `ดูรายชื่อปลาใหม่ ${count} ชนิดที่ควรเก็บในด่านนี้`,
    repeated: (count) => `พบในด่านก่อนหน้าด้วย · ${count} ชนิด`,
    repeatedNote:
      'ปลากลุ่มนี้ใช้ช่องสมุดเดิม ขนาดเท่าหรือเล็กกว่าสถิติเดิมจะไม่เปลี่ยนรายการ เมื่อเกมบันทึกขนาดที่ใหญ่กว่าในด่านนี้ ช่องเดิมจะย้ายมาด่านนี้',
    excluded: (count) => `มีบนแผนที่ แต่ไม่มีช่องในสมุด 66 ชนิด · ${count} ชนิด`,
    excludedNote: 'ปลากลุ่มนี้ปรากฏบนแผนที่ แต่ไม่มีรายการชนิดปลาในสมุด',
    details: 'ดูข้อมูลปลา',
    mapAction: 'ดูจุดตกบนแผนที่',
    equipmentAction: 'ดูอุปกรณ์ที่ใช้ได้',
    actionsFor: (name) => `เลือกทำต่อสำหรับ${name}`,
    id: 'ID',
    countNoteTitle: 'ทำไมเลขในสมุดเกมถึงไม่เท่ากับจำนวนในไกด์',
    countNote: () =>
      'เกมนับชนิดปลาที่สถิติขนาดใหญ่สุดอยู่ในด่านนี้ แต่ละหน้าจึงไม่มียอดเป้าหมายตายตัว บวกเลขทั้ง 6 หน้าในเกมเพื่อเช็กว่าครบ 66 หรือยัง ก่อนตามหาปลาเพิ่ม ให้เทียบชื่อจากทั้งสองรายการด้านล่างกับทุกหน้าในสมุด',
    triggerLimit:
      'โค้ด ROM ยืนยันว่าตรวจค่าขนาดที่มากกว่าสถิติเดิม แต่ยังระบุไม่ได้ว่าผลการตกแบบใดเรียกการอัปเดตสมุด',
    evidence: 'หลักฐาน ROM และวิธีตรวจสอบ',
    evidenceLink: 'อ่านบันทึกการแกะระบบสมุดปลา',
    spawnNote:
      'รายการนี้คือปลาที่เกมตั้งไว้ในด่าน บางจุดอาจไม่มีปลาในรอบที่เล่น ถ้าจุดที่ไปไม่มีปลา ให้เปิดแผนที่ตรวจว่าปลาชนิดนั้นมีจุดอื่นหรือไม่',
    verifyTitle: 'หลังตกปลา ให้เช็กสมุดเกมก่อนติ๊กเช็กลิสต์นี้',
    verifyBody:
      'เปิดไอเท็ม 05 “สมุดบันทึกการตกปลา” แล้วเทียบชื่อปลาทั้ง 6 หน้า จำนวนในแต่ละหน้าเปลี่ยนได้เมื่อสถิติขนาดใหญ่สุดย้ายไปอีกด่าน การเห็นปลากัดเบ็ดอย่างเดียวยังยืนยันไม่ได้ว่าสมุดบันทึกปลาแล้ว',
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

function notebookReturn(ctx) {
  return `${ctx.sourceReturn().split('#')[0]}#notebook-guide`
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

function fishActionLinks(ctx, id, returnPath) {
  const stage = String(ctx.activeStage)
  const fishQuery = new URLSearchParams({
    id,
    stage,
    return: returnPath,
  })
  const detailHref = `${localizedPage(ctx, 'fish')}?${fishQuery}`
  const mapQuery = new URLSearchParams({
    stage,
    fish: id,
    return: returnPath,
  })
  const mapHref = `${localizedPage(ctx, 'maps')}?${mapQuery}#map-view`
  const equipmentQuery = new URLSearchParams({
    category: 'all',
    fish: id,
    stage,
    return: returnPath,
  })
  const equipmentHref = `${localizedPage(ctx, 'index')}?${equipmentQuery}#fish-location-panel`
  return { detailHref, mapHref, equipmentHref }
}

function fishCard(ctx, copyText, id) {
  const fish = ctx.species[id]
  const image = fish.visual?.image
    ? `<img loading="lazy" src="${ctx.esc(fish.visual.image)}" alt="">`
    : ''
  const returnPath = notebookReturn(ctx)
  const { detailHref, mapHref, equipmentHref } = fishActionLinks(ctx, id, returnPath)
  const actionsLabel = copyText.actionsFor(fish.name)
  return `<article class="notebook-fish" data-notebook-card="${ctx.esc(id)}"><a class="notebook-fish-main" data-notebook-action="details" href="${ctx.esc(detailHref)}" aria-label="${ctx.esc(fish.name)} · ${ctx.esc(copyText.details)}">${image}<span><strong>${ctx.esc(fish.name)}</strong><small>${ctx.esc(copyText.id)} ${ctx.esc(id)} · ${ctx.esc(copyText.details)} ↗</small></span></a><nav class="notebook-fish-actions" aria-label="${ctx.esc(actionsLabel)}"><a data-notebook-action="map" href="${ctx.esc(mapHref)}">${ctx.esc(copyText.mapAction)} ↗</a><a data-notebook-action="equipment" href="${ctx.esc(equipmentHref)}">${ctx.esc(copyText.equipmentAction)} ↗</a></nav></article>`
}

function fishList(ctx, copyText, ids) {
  return ids.map((id) => fishCard(ctx, copyText, id)).join('')
}

function detailsList(ctx, kind, title, note, ids, copyText) {
  if (!ids.length) return ''
  return `<details class="notebook-${kind}"><summary>${ctx.esc(title(ids.length))}</summary><p>${ctx.esc(note)}</p><div class="notebook-fish-list">${fishList(ctx, copyText, ids)}</div></details>`
}

function routeProgress(ctx, guide, activeStage) {
  let total = 0
  for (const stage of guide.stages)
    if (stage.stage <= Number(activeStage))
      total += eligibleFish(ctx, stage.firstOccurrenceSpecies, guide.species).length
  return Math.min(total, guide.totals.notebookEligibleSpecies)
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

function evidenceLink(ctx, copyText, progressText) {
  const href =
    'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/notebook-completion-research.md'
  return `<details class="notebook-evidence"><summary>${ctx.esc(copyText.evidence)}</summary><p class="notebook-progress">${ctx.esc(progressText)}</p><p>${ctx.esc(copyText.triggerLimit)}</p><p><a href="${href}">${ctx.esc(copyText.evidenceLink)} ↗</a></p></details>`
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
  const newTitle = (count) => copyText.newTitle(count)
  const detailsOpen = ctx.openNotebookGuide ? ' open' : ''
  const newList = newIds.length
    ? `<details class="notebook-new"${detailsOpen}><summary>${ctx.esc(newTitle(newIds.length))}</summary><p class="notebook-target-note">${ctx.esc(copyText.spawnNote)}</p><div class="notebook-fish-list">${fishList(ctx, copyText, newIds)}</div></details>`
    : `<p class="notebook-empty">${ctx.esc(copyText.empty)}</p>`
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
  const progress = routeProgress(ctx, guide, ctx.activeStage)
  const total = guide.totals.notebookEligibleSpecies
  return `<div class="notebook-guide-panel" data-stage="${ctx.activeStage}" data-notebook-total="${recordableCount}" data-notebook-new="${newIds.length}" data-notebook-repeated="${repeatedIds.length}"><div class="notebook-guide-heading"><div><p class="notebook-eyebrow">${ctx.esc(copyText.title)}</p><h3>${ctx.esc(ctx.c.area(ctx.activeStage))}</h3></div></div><div class="notebook-count-summary"><p class="notebook-recordable"><strong>${recordableCount}</strong><span>${ctx.esc(copyText.recordableLabel(ctx.activeStage))}</span></p><div class="notebook-count-breakdown"><p>${ctx.esc(copyText.newCount(newIds.length))}</p><p>${ctx.esc(copyText.repeatedCount(repeatedIds.length))}</p></div></div><section class="notebook-count-explainer"><h4>${ctx.esc(copyText.countNoteTitle)}</h4><p>${ctx.esc(copyText.countNote(ctx.activeStage, recordableCount, newIds.length, repeatedIds.length))}</p></section>${areaCountLinks(ctx, guide, copyText)}${notebookVerificationMarkup(ctx, copyText)}${progressMarkup(ctx)}${newList}${repeated}${excluded}${evidenceLink(ctx, copyText, copyText.progress(ctx.activeStage, progress, total))}</div>`
}

export function renderNotebookGuide(ctx) {
  const mount = ctx.$('notebook-guide')
  if (!mount) return
  const markup = notebookGuideMarkup(ctx)
  mount.innerHTML = markup
  mount.hidden = !markup
  if (markup) bindNotebookProgress(ctx, mount)
}
