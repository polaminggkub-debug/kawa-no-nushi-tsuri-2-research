const copy = {
  en: {
    title: 'Fish journal · route checklist',
    intro: () => 'New species to target on an Area 1 → 6 route for all 66 journal fish.',
    progress: (stage, count, total) => `Unique species through Area ${stage}: ${count}/${total}`,
    newTitle: (count) => `Show the ${count} new species to catch here`,
    repeated: (count) => `Also found in an earlier area · ${count}`,
    repeatedNote:
      'These species already have one journal slot. An equal or smaller fish leaves the recorded best size and area unchanged; a larger fish moves the entry to this area.',
    excluded: (count) => `On this map, not in the 66-species journal · ${count}`,
    excludedNote: 'These fish appear on the map but have no species entry in the journal.',
    recorded: 'Fish details',
    id: 'ID',
    routeNote:
      'The journal has one slot per species. It shows the area where your largest fish of that species was recorded. Catching a larger fish in another area moves the existing entry. This guide does not read your save.',
    triggerLimit:
      'The ROM trace confirms the larger-size check, but does not prove which fishing outcomes trigger the journal update.',
    evidence: 'ROM evidence and method',
    evidenceLink: 'Read the notebook record research',
    empty: 'No new species are listed for this area in the route.',
  },
  ja: {
    title: '魚図鑑 · 全66種ルートチェック',
    intro: () => '図鑑全66種を集めるエリア1→6ルートで、新しく狙う魚です。',
    progress: (stage, count, total) => `エリア${stage}までの対象魚種: ${count}/${total}`,
    newTitle: (count) => `このエリアで釣る新しい魚 ${count}種を見る`,
    repeated: (count) => `前のエリアにも登場 · ${count}種`,
    repeatedNote:
      'この魚種の図鑑枠は1つです。同じか小さい魚では記録サイズやエリアは変わらず、より大きい魚を釣ると記録がこのエリアに移ります。',
    excluded: (count) => `マップにはいるが図鑑66種には含まれない · ${count}種`,
    excludedNote: 'マップ上にはいますが、図鑑に魚種の記録枠はありません。',
    recorded: '魚の詳細',
    id: 'ID',
    routeNote:
      '図鑑は魚種ごとに1枠です。その魚の最大サイズを記録したエリアが表示されます。別のエリアでより大きい魚を釣ると、記録がそのエリアへ移ります。この一覧はセーブデータを読み取りません。',
    triggerLimit:
      'ROMコードではサイズ比較を確認しましたが、どの釣果で図鑑更新処理が呼ばれるかは確認できていません。',
    evidence: 'ROMの根拠と調査方法',
    evidenceLink: '魚図鑑の記録に関する調査を読む',
    empty: 'このエリアにルート上の新しい魚種はありません。',
  },
  th: {
    title: 'สมุดปลา · เส้นทางเก็บครบ 66 ชนิด',
    intro: () => 'ถ้าไล่เก็บสมุดด่าน 1 → 6 ให้ตกปลาชนิดใหม่ของด่านนี้ก่อน',
    progress: (stage, count, total) => `เป้าหมายปลาไม่ซ้ำถึงด่าน ${stage}: ${count}/${total} ชนิด`,
    newTitle: (count) => `ดูรายชื่อปลาใหม่ ${count} ชนิดที่ควรเก็บในด่านนี้`,
    repeated: (count) => `พบในด่านก่อนหน้าด้วย · ${count} ชนิด`,
    repeatedNote:
      'ปลากลุ่มนี้ใช้ช่องสมุดเดิม ตัวที่ขนาดเท่าหรือเล็กกว่าสถิติเดิมจะไม่เปลี่ยนขนาดสูงสุดหรือด่านที่บันทึกไว้ ถ้าตกได้ตัวใหญ่กว่า รายการจะย้ายมาเป็นด่านนี้',
    excluded: (count) => `มีบนแผนที่ แต่ไม่มีช่องในสมุด 66 ชนิด · ${count} ชนิด`,
    excludedNote: 'ปลากลุ่มนี้ปรากฏบนแผนที่ แต่ไม่มีรายการชนิดปลาในสมุด',
    recorded: 'ดูข้อมูลปลา',
    id: 'ID',
    routeNote:
      'สมุดมีหนึ่งช่องต่อปลาแต่ละชนิด และแสดงด่านที่ทำสถิติขนาดใหญ่ที่สุดไว้ ถ้าตกได้ตัวใหญ่กว่าในด่านอื่น ช่องเดิมจะย้ายไปด่านใหม่ คู่มือนี้ไม่ได้อ่านเซฟของคุณ',
    triggerLimit:
      'โค้ด ROM ยืนยันว่าตรวจค่าขนาดที่มากกว่าสถิติเดิม แต่ยังระบุไม่ได้ว่าผลการตกแบบใดเรียกการอัปเดตสมุด',
    evidence: 'หลักฐาน ROM และวิธีตรวจสอบ',
    evidenceLink: 'อ่านบันทึกการแกะระบบสมุดปลา',
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

function fishCard(ctx, copyText, id) {
  const fish = ctx.species[id]
  const image = fish.visual?.image
    ? `<img loading="lazy" src="${ctx.esc(fish.visual.image)}" alt="">`
    : ''
  return `<a class="notebook-fish" href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(fish.name)} · ${copyText.recorded}">${image}<span><strong>${ctx.esc(fish.name)}</strong><small>${ctx.esc(copyText.id)} ${ctx.esc(id)} · ${ctx.esc(copyText.recorded)} ↗</small></span></a>`
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
  const newTitle = (count) => copyText.newTitle(count)
  const detailsOpen = ctx.openNotebookGuide ? ' open' : ''
  const newList = newIds.length
    ? `<details class="notebook-new"${detailsOpen}><summary>${ctx.esc(newTitle(newIds.length))}</summary><div class="notebook-fish-list">${fishList(ctx, copyText, newIds)}</div></details>`
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
  return `<div class="notebook-guide-panel" data-stage="${ctx.activeStage}"><div class="notebook-guide-heading"><div><p class="notebook-eyebrow">${ctx.esc(copyText.title)}</p><h3>${ctx.esc(ctx.c.area(ctx.activeStage))}</h3></div><strong class="notebook-new-count">${newIds.length}</strong></div><p class="notebook-intro">${ctx.esc(copyText.intro(newIds.length))}</p><p class="notebook-progress">${ctx.esc(copyText.progress(ctx.activeStage, progress, total))}</p>${newList}${repeated}${excluded}<p class="notebook-route-note">${ctx.esc(copyText.routeNote)}</p>${evidenceLink(ctx, copyText)}</div>`
}

export function renderNotebookGuide(ctx) {
  const mount = ctx.$('notebook-guide')
  if (!mount) return
  const markup = notebookGuideMarkup(ctx)
  mount.innerHTML = markup
  mount.hidden = !markup
}
