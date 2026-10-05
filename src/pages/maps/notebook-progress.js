const storageKey = 'kawa-notebook-manual-v1'
const text = {
  en: {
    count: (n, total) => `Marked by you: ${n}/${total} species`,
    note: 'Marks are saved here across areas; this does not read or change your game save.',
    mark: 'Checked in my game journal',
    markShort: 'Recorded',
    temporary: 'Browser storage is unavailable. Ticks last only while this page stays open.',
    remaining: 'Show only unmarked fish',
    empty: 'You have marked every fish in this list. Uncheck the filter to review them.',
  },
  ja: {
    count: (n, total) => `自分で確認済み: ${n}/${total}種`,
    note: 'チェックは全エリア共通でこのブラウザに保存し、ゲームのセーブは読み書きしません。',
    mark: 'ゲーム内図鑑で確認済み',
    markShort: '記録済み',
    temporary: 'ブラウザに保存できません。このページを閉じるとチェックは失われます。',
    remaining: '未チェックの魚だけ表示',
    empty: 'このリストはすべてチェック済みです。フィルターを外すと再確認できます。',
  },
  th: {
    count: (n, total) => `คุณติ๊กแล้ว ${n}/${total} ชนิด`,
    note: 'เก็บเครื่องหมายร่วมทุกด่านในเบราว์เซอร์นี้ ไม่อ่านหรือแก้เซฟเกม',
    mark: 'เช็กแล้วว่ามีในสมุดเกม',
    markShort: 'บันทึกแล้ว',
    temporary: 'เบราว์เซอร์ไม่อนุญาตให้บันทึก เครื่องหมายจะอยู่แค่ขณะที่เปิดหน้านี้',
    remaining: 'แสดงเฉพาะปลาที่ยังไม่ได้ติ๊ก',
    empty: 'ติ๊กครบทุกปลาในรายการนี้แล้ว เอาตัวกรองออกเพื่อดูรายการอีกครั้ง',
  },
}
let memory = []
let onlyRemaining = false

export function normalizeMarks(value, eligible) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((id) => typeof id === 'string' && eligible.has(id)))]
}

export function eligibleNotebookIds(guide) {
  return new Set(
    Object.entries(guide.species)
      .filter(([, entry]) => entry.notebookEligible === true)
      .map(([id]) => id),
  )
}

export function readNotebookMarks(storage, eligible) {
  try {
    const parsed = JSON.parse(storage.getItem(storageKey) || '[]')
    memory = normalizeMarks(parsed, eligible)
    return { ids: memory, persistent: true }
  } catch {
    memory = normalizeMarks(memory, eligible)
    return { ids: memory, persistent: false }
  }
}

export function writeNotebookMarks(storage, ids, eligible) {
  memory = normalizeMarks(ids, eligible)
  try {
    storage.setItem(storageKey, JSON.stringify(memory))
    return true
  } catch {
    return false
  }
}

export function progressMarkup(ctx) {
  const c = text[ctx.lang] || text.en
  return `<section class="notebook-manual"><p class="notebook-manual-count" role="status" aria-live="polite"></p><p data-notebook-browser-note>${ctx.esc(c.note)}</p><label class="notebook-remaining"><input type="checkbox" data-notebook-remaining> ${ctx.esc(c.remaining)}</label></section>`
}

function storageAccess() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function addCheckbox(ctx, card, id, c) {
  const label = document.createElement('label')
  label.className = 'notebook-mark'
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.dataset.notebookMark = id
  input.setAttribute('aria-label', `${c.mark}: ${ctx.species[id].name}`)
  label.append(input, document.createTextNode(` ${c.markShort}`))
  card.append(label)
}

function updateProgress(mount, eligible, ids, c, persistent) {
  mount.querySelector('.notebook-manual-count').textContent = c.count(ids.length, eligible.size)
  mount.querySelectorAll('[data-notebook-mark]').forEach((input) => {
    input.checked = ids.includes(input.dataset.notebookMark)
    const card = input.closest('[data-notebook-card]')
    card.classList.toggle('notebook-marked', input.checked)
    card.hidden = onlyRemaining && input.checked
  })
  mount.querySelector('[data-notebook-remaining]').checked = onlyRemaining
  mount.querySelector('.notebook-excluded')?.toggleAttribute('hidden', onlyRemaining)
  mount.querySelector('.notebook-manual-warning').textContent = persistent ? '' : c.temporary
  mount.querySelectorAll('.notebook-fish-list').forEach((list) => {
    const eligibleCards = [...list.querySelectorAll('[data-notebook-mark]')]
    const empty = list.nextElementSibling
    if (empty?.classList.contains('notebook-list-complete'))
      empty.hidden =
        !eligibleCards.length || eligibleCards.some((input) => !input.checked) || !onlyRemaining
  })
}

function addListMessages(mount, c) {
  mount.querySelectorAll('.notebook-fish-list').forEach((list) => {
    if (!list.querySelector('[data-notebook-mark]')) return
    const message = document.createElement('p')
    message.className = 'notebook-list-complete'
    message.textContent = c.empty
    message.hidden = true
    list.after(message)
  })
}

export function bindNotebookProgress(ctx, mount) {
  if (!ctx.notebookCompletion?.species || !mount.querySelector('.notebook-manual')) return
  if (ctx.notebookFocusNeedsReveal) {
    onlyRemaining = false
    ctx.notebookFocusNeedsReveal = false
  }
  const c = text[ctx.lang] || text.en
  const eligible = eligibleNotebookIds(ctx.notebookCompletion)
  const storage = storageAccess()
  const state = readNotebookMarks(storage, eligible)
  mount.querySelectorAll('[data-notebook-card]').forEach((card) => {
    const id = card.dataset.notebookCard
    if (eligible.has(id)) addCheckbox(ctx, card, id, c)
  })
  const warning = document.createElement('p')
  warning.className = 'notebook-manual-warning'
  mount.querySelector('.notebook-manual').append(warning)
  addListMessages(mount, c)
  updateProgress(mount, eligible, state.ids, c, state.persistent)
  mount.onchange = (event) => {
    const input = event.target
    if (input.matches('[data-notebook-remaining]')) {
      ctx.notebookSpecies = ''
      mount.querySelector('[data-notebook-focused]')?.removeAttribute('data-notebook-focused')
      onlyRemaining = input.checked
      ctx.updateUrl?.()
    } else if (input.matches('[data-notebook-mark]')) {
      const id = input.dataset.notebookMark
      state.ids = readNotebookMarks(storage, eligible).ids
      state.ids = input.checked
        ? [...new Set([...state.ids, id])]
        : state.ids.filter((entry) => entry !== id)
      state.persistent = writeNotebookMarks(storage, state.ids, eligible)
    } else return
    updateProgress(mount, eligible, state.ids, c, state.persistent)
  }
}
