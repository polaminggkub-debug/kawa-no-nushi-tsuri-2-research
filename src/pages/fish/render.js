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
  return [...new Set(names.filter(Boolean).filter((other) => other !== name))]
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
    return 'รายการด้านล่างเป็นทางเลือก ไม่จำเป็นต้องซื้อทั้งหมด ทุกชิ้นผ่านเงื่อนไขของปลาที่กำลังดู กดรายละเอียดเพื่อเปรียบเทียบวิธีใช้และด่านที่ขาย'
  if (ctx.locale === 'ja')
    return '以下は代替候補で、全部買う必要はない。各項目は表示中の魚の判定を通る。詳細で使い方と販売エリアを比較できる。'
  return 'The lists below are alternatives; you do not need to buy every entry. Each passes the shown fish’s check. Open details to compare use and purchase areas.'
}

function compatibleSection(ctx, state) {
  return `<section id="all-compatible" class="detail-section"><h2>${ctx.escapeHtml(ctx.copy.compatible)}</h2><p class="section-lede">${ctx.escapeHtml(ctx.copy.compatibilityNote)}</p><p>${ctx.escapeHtml(compatibilityIntro(ctx))}</p>${ctx.renderCompatibility(state.matches, state.activeStage)}</section>`
}

function profileContent(ctx, fishData, fish, state) {
  return `${renderProfileHero(ctx, state)}${renderFirstStep(ctx)}${ctx.renderWaterIcons(fishData.waterIcons, state.activeStage)}${ctx.renderExchange(fishData.items || [], state.activeStage)}${ctx.renderAreas(state.locations, state.activeStage, fish)}${ctx.renderShopping(state.matches, state.locations, state.activeStage, fishData.items || [], fishData.flyBackupChoices)}${compatibleSection(ctx, state)}${ctx.renderEvidence(fish, state.locations, state.matches)}`
}

function unconfirmedProfileContent(ctx, fish, state) {
  const evidence = ctx
    .renderEvidence(fish, state.locations, state.matches)
    .replace(
      '</details>',
      '<p><a href="../docs/fish-acceptance-research.md">Fish acceptance research · profile 43 ↗</a></p></details>',
    )
  return `<div class="detail-hero"><div><p class="muted">${ctx.escapeHtml(ctx.copy.pageTitle)} · ID 43</p><h1>${ctx.escapeHtml(state.headline)}</h1></div></div>${ctx.unconfirmedProfileAction()}${evidence}`
}

function updateAreaChooser(ctx, fishData, locationData, locations) {
  if (!locations.length) return
  const chooser = document.getElementById('shopping-area')
  chooser.addEventListener('change', () => {
    ctx.requestedStage = ctx.validStage(chooser.value)
    if (typeof history !== 'undefined')
      history.replaceState(null, '', ctx.currentFishPath(ctx.requestedStage))
    ctx.render(fishData, locationData)
  })
}

function reopenFlyBackup() {
  if (location.hash !== '#fly-backup') return
  const backup = document.getElementById('fly-backup')
  backup?.setAttribute('open', '')
  backup?.scrollIntoView({ block: 'start' })
}

function reopenRequestedStarter(ctx) {
  const anchor = location.hash.match(/^#starter-(float|sinker|lure|fly)$/)?.[1]
  const method = ctx.requestedMethod || anchor
  if (!method) return
  const starter = document.getElementById(`starter-${method}`)
  if (!starter) return
  starter.setAttribute('open', '')
  starter.scrollIntoView({ block: 'start' })
}

function setFishTitle(ctx, headline) {
  document.title = `${headline} — ${ctx.copy.pageTitle} | Kawa no Nushi Tsuri 2`
}

export function render(ctx, fishData, locationData) {
  if (!ctx.id) return renderMissingProfile(ctx, ctx.copy.missing)
  const fish = fishData.fishVisuals?.[ctx.id]
  if (!fish) return renderMissingProfile(ctx, ctx.copy.invalid)
  const state = profileState(ctx, fish, locationData, fishData)
  ctx.setNavigation(state.activeStage)
  if (ctx.id === '43') {
    ctx.page.innerHTML = unconfirmedProfileContent(ctx, fish, state)
    setFishTitle(ctx, state.headline)
    return
  }
  ctx.page.innerHTML = profileContent(ctx, fishData, fish, state)
  reopenRequestedStarter(ctx)
  reopenFlyBackup()
  updateAreaChooser(ctx, fishData, locationData, state.locations)
  setFishTitle(ctx, state.headline)
}
