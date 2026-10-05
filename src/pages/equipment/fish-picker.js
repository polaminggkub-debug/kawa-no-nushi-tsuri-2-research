import { applyFishEquipmentDefault } from './fish-equipment-default.js'

export function closeFishSuggestions(ctx) {
  document.getElementById('fish-suggestions').hidden = true
  document.getElementById('fish-search').setAttribute('aria-expanded', 'false')
  document.getElementById('fish-search').removeAttribute('aria-activedescendant')
  ctx.activeSuggestion = -1
}

export function showFishSuggestions(ctx) {
  const input = document.getElementById('fish-search'),
    box = document.getElementById('fish-suggestions')
  const selected = document.getElementById('fish-filter').value
  const term =
    selected && input.value === ctx.fishName(selected)
      ? ''
      : input.value.normalize('NFKC').trim().toLocaleLowerCase()
  ctx.suggestionIds = Object.keys(ctx.fishVisuals)
    .filter((id) => id !== '43' && (!term || ctx.fishSearchText(id).includes(term)))
    .sort((a, b) => ctx.fishName(a).localeCompare(ctx.fishName(b), ctx.lang))
  ctx.activeSuggestion = -1
  box.innerHTML =
    ctx.suggestionIds
      .map(
        (id) =>
          `<div id="fish-option-${id}" role="option" aria-selected="false" data-fish-choice="${id}"><img src="${ctx.esc(ctx.fishVisuals[id].image)}" alt=""><span><strong>${ctx.esc(ctx.fishName(id))}</strong><small>${ctx.esc(ctx.lang === 'ja' ? ctx.fishVisuals[id].nameLatin || ctx.fishVisuals[id].nameLatinVariants?.[0] || '' : ctx.fishVisuals[id].nameJa || '')}</small></span></div>`,
      )
      .join('') || `<p class="fish-no-match">${ctx.esc(ctx.pickerCopy.none)}</p>`
  box.hidden = false
  input.setAttribute('aria-expanded', 'true')
  input.removeAttribute('aria-activedescendant')
  document.getElementById('fish-search-status').textContent = ctx.suggestionIds.length
    ? ctx.pickerCopy.count(ctx.suggestionIds.length)
    : ctx.pickerCopy.none
}

function handleFishSearchInput(ctx, input) {
  if (!input.value.trim()) ctx.selectFish('')
  ctx.showFishSuggestions()
}

function restoreSelectedFish(ctx, input) {
  const selected = document.getElementById('fish-filter').value
  input.value = selected ? ctx.fishName(selected) : ''
}

function handleFishSearchBlur(ctx, input) {
  restoreSelectedFish(ctx, input)
  ctx.closeFishSuggestions()
}

function handleFishSearchKeydown(ctx, input, box, event) {
  if (event.key === 'Escape') {
    restoreSelectedFish(ctx, input)
    ctx.closeFishSuggestions()
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (box.hidden) ctx.showFishSuggestions()
    if (!ctx.suggestionIds.length) return
    ctx.activeSuggestion =
      event.key === 'ArrowDown'
        ? (ctx.activeSuggestion + 1) % ctx.suggestionIds.length
        : ctx.activeSuggestion < 0
          ? ctx.suggestionIds.length - 1
          : (ctx.activeSuggestion - 1 + ctx.suggestionIds.length) % ctx.suggestionIds.length
    box
      .querySelectorAll('[role="option"]')
      .forEach((option, index) =>
        option.setAttribute('aria-selected', index === ctx.activeSuggestion ? 'true' : 'false'),
      )
    const option = document.getElementById('fish-option-' + ctx.suggestionIds[ctx.activeSuggestion])
    input.setAttribute('aria-activedescendant', option.id)
    option.scrollIntoView({ block: 'nearest' })
  } else if (event.key === 'Enter' && !box.hidden) {
    event.preventDefault()
    const id =
      ctx.suggestionIds[ctx.activeSuggestion] ||
      (ctx.suggestionIds.length === 1 ? ctx.suggestionIds[0] : null)
    if (id) ctx.selectFish(id)
  } else if (event.key === 'Tab') ctx.closeFishSuggestions()
}

function selectClickedFish(ctx, event) {
  const option = event.target.closest('[data-fish-choice]')
  if (option) ctx.selectFish(option.dataset.fishChoice)
}

function clearFishSearch(ctx, input) {
  ctx.selectFish('')
  input.focus()
  ctx.showFishSuggestions()
}

function closeSuggestionsOutside(ctx, event) {
  if (!event.target.closest('.fish-combobox')) ctx.closeFishSuggestions()
}

export function setupFishPicker(ctx) {
  const input = document.getElementById('fish-search'),
    box = document.getElementById('fish-suggestions'),
    clearButton = document.getElementById('fish-clear')
  input.disabled = false
  clearButton.disabled = false
  input.placeholder = ctx.pickerCopy.placeholder
  clearButton.setAttribute('aria-label', ctx.pickerCopy.clear)
  input.addEventListener('input', () => handleFishSearchInput(ctx, input))
  input.addEventListener('focus', ctx.showFishSuggestions)
  input.addEventListener('blur', () => handleFishSearchBlur(ctx, input))
  input.addEventListener('keydown', (event) => handleFishSearchKeydown(ctx, input, box, event))
  box.addEventListener('mousedown', (event) => event.preventDefault())
  box.addEventListener('click', (event) => selectClickedFish(ctx, event))
  clearButton.addEventListener('click', () => clearFishSearch(ctx, input))
  document.addEventListener('click', (event) => closeSuggestionsOutside(ctx, event))
}

export function selectFish(ctx, id) {
  if (document.getElementById('fish-filter').value !== id) {
    document.getElementById('search').value = ''
    document.getElementById('style-filter').value = ''
    ctx.flyPart = 'fly'
  }
  document.getElementById('fish-filter').value = id
  document.getElementById('fish-search').value = id ? ctx.fishName(id) : ''
  document.getElementById('fish-search-status').textContent = ''
  ctx.closeFishSuggestions()
  if (id) applyFishEquipmentDefault(ctx, id)
  ctx.locationStage = ''
  ctx.locationMapIndex = 0
  ctx.renderCards()
  if (typeof history !== 'undefined')
    history.replaceState(null, '', `?${new URLSearchParams(location.search)}#fish-location-panel`)
  ctx.refreshLanguageLinks?.()
}
