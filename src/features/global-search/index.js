import { copy } from './copy.js'
import { search } from './match.js'
import { loadSearch, saveSearch } from './memory.js'
import { mountMarkup, renderList } from './view.js'

function pageContext(nav) {
  const lang = ['th', 'ja'].includes(document.documentElement.lang.slice(0, 2))
    ? document.documentElement.lang.slice(0, 2)
    : 'en'
  const brand = nav.querySelector('.compendium-brand')
  const base = new URL('.', new URL(brand?.getAttribute('href') || 'index.html', location.href))
  const inCatalogue = !location.pathname.includes('/research/')
  const returnTo = inCatalogue ? location.pathname.split('/').pop() + location.search : ''
  return { lang, base: base.pathname, indexUrl: new URL('search-index.json', base).href, returnTo }
}

export function mountGlobalSearch(nav) {
  if (!nav || nav.querySelector('#gsearch')) return
  const context = pageContext(nav)
  const state = loadSearch()
  nav.insertAdjacentHTML('beforeend', mountMarkup(context.lang, state))
  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'gsearch-toggle'
  toggle.setAttribute('aria-controls', 'gsearch')
  toggle.setAttribute('aria-expanded', 'false')
  toggle.setAttribute('aria-label', copy[context.lang].label)
  toggle.textContent = '⌕'
  nav.querySelector('.compendium-brand').after(toggle)
  const box = createBox(nav.querySelector('#gsearch'), context, state)
  bindToggle(nav, toggle, box)
  bindInput(box)
  bindControls(box, toggle)
  if (state.query) box.load().then(box.render)
}

function createBox(form, context, state) {
  const box = {
    form,
    context,
    state,
    entries: null,
    pending: null,
    active: -1,
    input: form.querySelector('#gsearch-input'),
    panel: form.querySelector('.gsearch-panel'),
    list: form.querySelector('#gsearch-list'),
    clear: form.querySelector('.gsearch-clear'),
  }
  box.options = () => [...box.list.querySelectorAll('.gsearch-option')]
  box.open = (visible) => {
    box.panel.hidden = !visible
    box.input.setAttribute('aria-expanded', String(visible))
  }
  box.setActive = (index) => setActive(box, index)
  box.render = () => render(box)
  box.load = () => load(box)
  return box
}

function setActive(box, index) {
  const rows = box.options()
  box.active = rows.length ? (index + rows.length) % rows.length : -1
  rows.forEach((row, at) => row.setAttribute('aria-selected', String(at === box.active)))
  if (box.active >= 0) {
    box.input.setAttribute('aria-activedescendant', rows[box.active].id)
    rows[box.active].scrollIntoView?.({ block: 'nearest' })
  } else box.input.removeAttribute('aria-activedescendant')
}

function render(box) {
  const { state, context } = box
  box.clear.hidden = !state.query
  saveSearch(state)
  if (!state.query.trim()) return box.open(false)
  if (!box.entries) return
  const result = search(box.entries, state.query, context.lang, state.type)
  box.list.innerHTML = renderList(result, context, [...result.hits, ...result.near])
  box.open(true)
  box.setActive(result.hits.length || result.near.length ? 0 : -1)
}

function load(box) {
  const text = copy[box.context.lang]
  box.pending ||= fetch(box.context.indexUrl)
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then((data) => {
      box.entries = data.entries
    })
    .catch(() => {
      box.pending = null
      box.list.innerHTML = `<p class="gsearch-empty">${text.failed} <button type="button" class="gsearch-retry">${text.retry}</button></p>`
      box.open(true)
    })
  return box.pending
}

function bindToggle(nav, toggle, box) {
  toggle.addEventListener('click', () => {
    const shown = nav.classList.toggle('gsearch-open')
    toggle.setAttribute('aria-expanded', String(shown))
    if (shown) box.input.focus()
  })
}

function bindInput(box) {
  const { input, list } = box
  input.addEventListener('focus', box.load)
  list.addEventListener('click', (event) => {
    if (event.target.closest('.gsearch-retry')) box.load().then(box.render)
  })
  input.addEventListener('input', () => {
    box.state.query = input.value
    if (box.entries) box.render()
    else box.load().then(box.render)
  })
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') box.setActive(box.active + 1)
    else if (event.key === 'ArrowUp') box.setActive(box.active - 1)
    else if (event.key === 'Escape') box.open(false)
    else if (event.key === 'Enter' && box.active >= 0)
      location.href = box.options()[box.active].href
    else return
    event.preventDefault()
  })
}

function bindControls(box, toggle) {
  const { form, state } = box
  box.clear.addEventListener('click', () => {
    box.input.value = state.query = ''
    box.render()
    box.input.focus()
  })
  form.addEventListener('submit', (event) => event.preventDefault())
  form.addEventListener('click', (event) => {
    const chip = event.target.closest('.gsearch-type')
    if (!chip) return
    state.type = chip.dataset.type
    form
      .querySelectorAll('.gsearch-type')
      .forEach((node) => node.setAttribute('aria-pressed', String(node === chip)))
    box.render()
  })
  document.addEventListener('click', (event) => {
    if (!form.contains(event.target) && event.target !== toggle) box.open(false)
  })
}
