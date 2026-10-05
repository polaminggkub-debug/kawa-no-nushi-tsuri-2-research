import { notebookChecklistLink } from './notebook-checklist-link.js'

const copy = {
  th: {
    eligibleTitle: 'เป้าหมายสมุด · 1 ใน 66 ชนิด',
    eligibleBody:
      'ถ้ายังไม่มีชื่อในสมุด ให้ตกปลานี้ ผ่านข้อความจับปลา แล้วตรวจไอเท็ม 05 “สมุดบันทึกการตกปลา”',
    first: (stage) => `เส้นทางเก็บ 66 ชนิด · ด่าน 1 → 6 · พบครั้งแรกที่ด่าน ${stage}`,
    repeats: (stages) => `มีจุดของปลาชนิดนี้อีกในด่าน ${stages}`,
    noRepeats: 'ในข้อมูลจุดตกที่ยืนยันได้ ไม่มีด่านอื่นระบุปลาชนิดนี้',
    recorded:
      'มีชื่อแล้ว = ไม่ใช่เป้าหมายใหม่; ตัวที่ใหญ่กว่าอาจย้ายรายการไปหน้าด่านอื่น เว็บอ่านเซฟไม่ได้ ให้ตรวจในเกม',
    map: 'ดูแผนที่จุดตกที่เลือก',
    excludedTitle: 'ไม่ใช่เป้าหมายในสมุด 66 ชนิด',
    excludedBody: 'โปรไฟล์นี้แสดงจุดปลาในแผนที่ แต่ไม่ต้องตกชนิดนี้เพื่อเก็บสมุดให้ครบ',
    unknownTitle: 'สถานะในสมุดยังยืนยันไม่ได้',
    unknownBody: 'ข้อมูลที่ยืนยันได้ยังไม่ระบุว่าปลานี้มีช่องในสมุดหรือไม่ โปรดตรวจไอเท็ม 05 ในเกม',
  },
  ja: {
    eligibleTitle: '図鑑の目標 · 全66種の1種',
    eligibleBody:
      'まだ記録がなければ、魚を取り込み、取り込み後のメッセージを進めてから道具05「釣りノート」で確認してください。',
    first: (stage) => `全66種の収集ルート（エリア1→6） · 最初の出現設定：エリア${stage}`,
    repeats: (stages) => `同じ魚の出現設定：エリア${stages}`,
    noRepeats: '確認済みの出現設定はこのエリアだけです。',
    recorded:
      '記録済みなら新しい収集目標ではありません。より大きな記録で表示エリアが移る場合があります。サイトはセーブを読めないため、ゲーム内で確認してください。',
    map: '選択中の釣り場マップを見る',
    excludedTitle: '図鑑66種の対象外',
    excludedBody: 'この魚はマップに出ますが、図鑑を埋めるために釣る必要はありません。',
    unknownTitle: '図鑑の対象か未確認',
    unknownBody:
      '現在確認できるデータでは記録対象か判断できません。ゲーム内の道具05で確認してください。',
  },
  en: {
    eligibleTitle: 'Notebook goal · 1 of 66 species',
    eligibleBody:
      'If it is not listed, land it, finish the landing text, then check Tool 05 (Fishing Notebook).',
    first: (stage) => `66-species route (Areas 1 → 6) · First configured in Area ${stage}`,
    repeats: (stages) => `Also configured in areas ${stages}`,
    noRepeats: 'No other area is listed in the confirmed location data.',
    recorded:
      'Already listed means it is not a new target. A larger record may move its notebook area. This site cannot read your save; check in-game.',
    map: 'View the selected area map',
    excludedTitle: 'Not one of the 66 notebook species',
    excludedBody:
      'This profile has map locations, but you do not need this species to complete the notebook list.',
    unknownTitle: 'Notebook status unconfirmed',
    unknownBody:
      'Available evidence does not confirm whether this fish has a notebook slot. Check Tool 05 in the game.',
  },
}

function validStage(value) {
  return Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 6
}

function notebookState(fishData, id) {
  const entry = fishData.notebookCompletion?.species?.[id]
  if (entry?.notebookEligible === true) return { kind: 'eligible', entry }
  if (entry?.notebookEligible === false) return { kind: 'excluded', entry }
  return { kind: 'unconfirmed', entry: null }
}

function renderEligible(ctx, entry, text) {
  const stages = (entry.stages || [])
    .filter(validStage)
    .map(Number)
    .sort((a, b) => a - b)
  const first = Number(entry.firstOccurrenceStage)
  if (!validStage(first) || !stages.length) return renderUnconfirmed(ctx, text)
  const otherStages = stages.filter((stage) => stage !== first)
  const locations = otherStages.length ? text.repeats(otherStages.join(', ')) : text.noRepeats
  return `<section class="decision-panel fish-notebook-goal" data-fish-notebook-status="eligible" data-notebook-first-stage="${first}" data-notebook-stages="${stages.join(',')}"><h2>${ctx.escapeHtml(text.eligibleTitle)}</h2><p>${ctx.escapeHtml(text.eligibleBody)}</p><p><strong>${ctx.escapeHtml(text.first(first))}</strong> · ${ctx.escapeHtml(locations)}</p><p>${ctx.escapeHtml(text.recorded)}</p><a class="route-button" href="#fish-area-map">${ctx.escapeHtml(text.map)} ↓</a><p>${notebookChecklistLink(ctx, first)}</p></section>`
}

function renderExcluded(ctx, text) {
  return `<section class="decision-panel fish-notebook-goal" data-fish-notebook-status="excluded"><h2>${ctx.escapeHtml(text.excludedTitle)}</h2><p>${ctx.escapeHtml(text.excludedBody)}</p></section>`
}

function renderUnconfirmed(ctx, text) {
  return `<section class="decision-panel fish-notebook-goal" data-fish-notebook-status="unconfirmed"><h2>${ctx.escapeHtml(text.unknownTitle)}</h2><p>${ctx.escapeHtml(text.unknownBody)}</p></section>`
}

export function renderNotebookStatus(ctx, fishData) {
  const text = copy[ctx.locale] || copy.en
  const state = notebookState(fishData, ctx.id)
  if (state.kind === 'eligible') return renderEligible(ctx, state.entry, text)
  if (state.kind === 'excluded') return renderExcluded(ctx, text)
  return renderUnconfirmed(ctx, text)
}
