/** Item cards are written per language (cards_en/th/ja.js) and rendered into the page at build time. */

const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`

function renderCard(card, labels) {
  const verdict = labels.verdicts[card.verdict]
  return `<article class="gg-card" id="gear-${card.id}">
  <h3>${card.title} <span class="gg-badge gg-${card.verdict}">${labels.matters}: ${verdict}</span></h3>
  <p class="gg-does"><strong>${labels.does}</strong> ${card.does}</p>
  <p class="gg-matters"><strong>${labels.matter}</strong> ${card.matters}</p>
  <h4>${labels.choose}</h4>
  ${list(card.choose)}
  <h4>${labels.avoid}</h4>
  ${list(card.avoid)}
</article>`
}

function renderGroup(group, labels) {
  const intro = group.intro ? `<p class="gg-note">${group.intro}</p>` : ''
  return `<div class="gg-group" id="${group.id}">
  <h3 class="gg-group-title">${group.title}</h3>
  ${intro}
  ${group.cards.map((card) => renderCard(card, labels)).join('\n')}
</div>`
}

function renderChips(copy) {
  const chips = copy.groups.flatMap((group) => group.cards)
  return `<nav class="gg-chips" aria-label="${copy.labels.jump}">${chips
    .map((card) => `<a href="#gear-${card.id}">${card.chip ?? card.title}</a>`)
    .join('')}</nav>`
}

export function renderCards(copy) {
  return [renderChips(copy), ...copy.groups.map((group) => renderGroup(group, copy.labels))].join(
    '\n',
  )
}
