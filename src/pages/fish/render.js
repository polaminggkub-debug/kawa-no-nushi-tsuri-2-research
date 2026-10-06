import { renderSectionIndex, bindSectionIndex } from './section-index.js'
import { distinctFishNames } from './fish-names.js'
import { renderFightControls } from './fight-controls.js'
import { renderNotebookStatus } from './notebook-status.js'
import { renderEelQuestContext } from './quest-context.js'

const profileAnchors = {
  '#fish-area-map': 'fish-area-map',
  '#water-icons': 'water-icons',
  '#all-compatible': 'all-compatible',
  '#fly-backup': 'fly-backup',
  '#fight-controls': 'fight-controls',
  '#fish-shopping': 'fish-shopping',
  '#fish-notebook': 'fish-notebook',
  '#fish-evidence': 'fish-evidence',
}

function profileAnchorId(hash) {
  return profileAnchors[hash] || ''
}

function renderMissingProfile(ctx, message) {
  ctx.page.innerHTML = `<h1>${ctx.escapeHtml(ctx.copy.pageTitle)}</h1><p class="empty-state">${ctx.escapeHtml(message)}</p><p><a class="route-button" href="${ctx.escapeHtml(ctx.cataloguePath())}">${ctx.escapeHtml(ctx.copy.catalogue)}</a></p>`
  ctx.setNavigation('')
}

function alternateFishNames(fish, name) {
  const names = [
    fish.nameJa,
    fish.nameEn,
    fish.nameLatin,
    ...(fish.nameLatinVariants || []),
    ...(fish.nameThVariants || []),
  ]
  return distinctFishNames(names, name)
}

function fishHeadline(ctx, fish, name) {
  const hasName = fish.nameJa || fish.nameEn || fish.nameLatin || (fish.nameThVariants || []).length
  return hasName ? name : ctx.copy.unknownFish(ctx.id)
}

function fishSprite(ctx, fish, name) {
  if (!fish.image)
    return `<div class="detail-portrait empty-state">${ctx.escapeHtml(ctx.copy.noSprite)}</div>`
  return `<figure class="detail-portrait"><img src="${ctx.escapeHtml(fish.image)}" alt="${ctx.escapeHtml(name)}"><figcaption>${ctx.escapeHtml(name)}</figcaption></figure>`
}

function profileState(ctx, fish, locationData, fishData) {
  const name = ctx.localizedFishName(fish, ctx.id)
  const locations = ctx.getLocations(locationData)
  const activeStage = locations.some((entry) => String(entry.stage) === ctx.requestedStage)
    ? ctx.requestedStage
    : String(locations[0]?.stage || '')
  const matches = ctx.matchingItems(fishData.items || [])
  return {
    name,
    locations,
    activeStage,
    matches,
    altNames: alternateFishNames(fish, name),
    sprite: fishSprite(ctx, fish, name),
    headline: fishHeadline(ctx, fish, name),
  }
}

function renderProfileHero(ctx, state) {
  const alternateNames = state.altNames.length
    ? `<p class="muted"><span>${ctx.escapeHtml(ctx.copy.legacyName)}:</span> ${state.altNames.map(ctx.escapeHtml).join(' · ')}</p>`
    : ''
  return `<nav class="detail-breadcrumb" aria-label="${ctx.escapeHtml(ctx.copy.catalogue)}"><a href="${ctx.escapeHtml(ctx.cataloguePath())}">${ctx.escapeHtml(ctx.copy.catalogue)}</a><span aria-hidden="true">/</span><span>${ctx.escapeHtml(ctx.copy.pageTitle)}</span></nav><div class="detail-hero fish-hero">${state.sprite}<div class="detail-identity"><p class="detail-kicker">${ctx.escapeHtml(ctx.copy.pageTitle)}</p><h1>${ctx.escapeHtml(state.headline)}</h1>${alternateNames}<div class="detail-badges"><span class="detail-badge id">ID ${ctx.escapeHtml(ctx.id)}</span></div></div></div>`
}

function renderFirstStep(ctx) {
  return `<section class="decision-panel fish-first-step"><h2>${ctx.escapeHtml(ctx.copy.firstStep)}</h2><p>${ctx.escapeHtml(ctx.copy.firstStepBody)}</p><a class="route-button" href="#fish-area-map">${ctx.escapeHtml(ctx.copy.chooseSpots)} ↓</a></section>`
}

function compatibilityIntro(ctx) {
  if (ctx.locale === 'th')
    return 'เลือกเพียงหนึ่งทางเลือกเพื่อเริ่มตก ไม่จำเป็นต้องซื้อทั้งหมด กดรายละเอียดเพื่อเทียบวิธีใช้และด่านที่ขาย'
  if (ctx.locale === 'ja')
    return '最初は候補を1つ選び、全部買う必要はありません。詳細で使い方と販売エリアを比較できます。'
  return 'Choose one alternative to start; you do not need every entry. Open details to compare use and purchase areas.'
}

function compatibleSection(ctx, state) {
  return `<section id="all-compatible" class="detail-section"><h2>${ctx.escapeHtml(ctx.copy.compatible)}</h2><p class="section-lede">${ctx.escapeHtml(ctx.copy.compatibilityNote)}</p><p>${ctx.escapeHtml(compatibilityIntro(ctx))}</p>${ctx.renderCompatibility(state.matches, state.activeStage)}</section>`
}

function profileContent(ctx, fishData, locationData, fish, state) {
  const notebook = fishData.notebookCompletion?.species?.[ctx.id]
  const firstStep = notebook?.notebookEligible === true ? '' : renderFirstStep(ctx)
  const content = `${renderEelQuestContext(ctx, locationData)}${firstStep}${ctx.renderAreas(state.locations, state.activeStage, fish)}${ctx.renderExchange(fishData.items || [], state.activeStage)}${ctx.renderShopping(state.matches, state.locations, state.activeStage, fishData.items || [], fishData.flyBackupChoices)}${renderFightControls(ctx, state.activeStage)}${renderNotebookStatus(ctx, fishData)}${compatibleSection(ctx, state)}${ctx.renderWaterIcons(fishData.waterIcons, state.activeStage)}${ctx.renderEvidence(fish, state.locations, state.matches)}`
  return `${renderProfileHero(ctx, state)}${renderSectionIndex(ctx, content)}${content}`
}

function unconfirmedProfileContent(ctx, fishData, locationData, fish, state) {
  const evidence = ctx
    .renderEvidence(fish, state.locations, state.matches)
    .replace(
      '</details>',
      '<p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fish-acceptance-research.md">Fish acceptance research · profile 43 ↗</a></p></details>',
    )
  const content = `${renderNotebookStatus(ctx, fishData)}${renderEelQuestContext(ctx, locationData)}${ctx.unconfirmedProfileAction()}${evidence}`
  return `<div class="detail-hero"><div><p class="muted">${ctx.escapeHtml(ctx.copy.pageTitle)} · ID 43</p><h1>${ctx.escapeHtml(state.headline)}</h1></div></div>${renderSectionIndex(ctx, content)}${content}`
}

function updateAreaChooser(ctx, fishData, locationData, locations) {
  if (!locations.length) return
  const chooser = document.getElementById('shopping-area')
  chooser.addEventListener('change', () => {
    ctx.requestedStage = ctx.validStage(chooser.value)
    if (typeof history !== 'undefined') {
      const anchor = profileAnchorId(location.hash)
      const suffix = anchor ? `#${anchor}` : ''
      history.replaceState(null, '', `${ctx.currentFishPath(ctx.requestedStage)}${suffix}`)
    }
    ctx.render(fishData, locationData)
  })
}

function reopenFlyBackup() {
  if (location.hash !== '#fly-backup') return
  document.getElementById('fly-backup')?.setAttribute('open', '')
}

function bindFlyBackupAction(ctx) {
  ctx.page.querySelector?.('[data-fly-backup-link]')?.addEventListener('click', () => {
    document.getElementById('fly-backup')?.setAttribute('open', '')
  })
}

function reopenRequestedStarter(ctx, shouldScroll = true) {
  const anchor = location.hash.match(/^#starter-(float|sinker|lure|fly)$/)?.[1]
  const method = ctx.requestedMethod || anchor
  if (!method) return
  const starter = document.getElementById(`starter-${method}`)
  if (!starter) return
  starter.setAttribute('open', '')
  if (shouldScroll) starter.scrollIntoView({ block: 'start' })
}

function restoreProfileAnchor(anchorId) {
  if (!anchorId) return
  document.getElementById(anchorId)?.scrollIntoView({ block: 'start' })
}

function setFishTitle(ctx, headline) {
  document.title = `${headline} — ${ctx.copy.pageTitle} | Kawa no Nushi Tsuri 2`
}

export function resolveProfileStage(ctx, activeStage) {
  if (activeStage === ctx.requestedStage) return
  ctx.requestedStage = activeStage
  if (typeof history !== 'undefined')
    history.replaceState(null, '', `${ctx.currentFishPath(activeStage)}${location.hash}`)
}

export function render(ctx, fishData, locationData) {
  if (!ctx.id) return renderMissingProfile(ctx, ctx.copy.missing)
  const fish = fishData.fishVisuals?.[ctx.id]
  if (!fish) return renderMissingProfile(ctx, ctx.copy.invalid)
  const state = profileState(ctx, fish, locationData, fishData)
  resolveProfileStage(ctx, state.activeStage)
  ctx.setNavigation(state.activeStage)
  ctx.page.innerHTML =
    ctx.id === '43'
      ? unconfirmedProfileContent(ctx, fishData, locationData, fish, state)
      : profileContent(ctx, fishData, locationData, fish, state)
  bindSectionIndex(ctx.page)
  if (location.hash === '#fish-evidence')
    document.getElementById('fish-evidence').closest('details').open = true
  const anchorId = profileAnchorId(location.hash)
  if (ctx.id === '43') {
    setFishTitle(ctx, state.headline)
    restoreProfileAnchor(anchorId)
    return
  }
  reopenRequestedStarter(ctx, !anchorId)
  reopenFlyBackup()
  bindFlyBackupAction(ctx)
  updateAreaChooser(ctx, fishData, locationData, state.locations)
  setFishTitle(ctx, state.headline)
  restoreProfileAnchor(anchorId)
}
