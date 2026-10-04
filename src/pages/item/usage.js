function decisionUsage(ctx, decision) {
  return {
    summary: ctx.local(decision.recommendation),
    facts: [ctx.local(decision.reason)].filter(Boolean),
  }
}

function specialCategoryUsage(ctx, item, use) {
  if (item.category === 'fly_wing') {
    const summary =
      ctx.lang === 'th'
        ? 'ประกอบเองให้เริ่มจากปีกที่มีอยู่และตรวจราคาเสนอก่อนจ่าย ไม่ต้องซื้อปีกแพงเพื่อหวังโบนัสจับปลา เพราะยังไม่มีหลักฐานรองรับ'
        : ctx.lang === 'ja'
          ? '作成するなら手持ちのウィングから始め、確定前に見積額を確認する。釣果ボーナスを期待して高価なウィングを買う根拠はない。'
          : 'For a custom fly, start with a wing you have and check the quote before paying. There is no established catch bonus that justifies buying an expensive wing.'
    return { summary, facts: use.facts?.[ctx.lang] || [] }
  }
  if (item.category === 'fly_tail') {
    const summary =
      ctx.lang === 'th'
        ? 'เลือกหางนี้ถ้าชอบรูปและยอมรับราคาเสนอ หรือเลือก “ไม่มี” ในเมนูประกอบที่มีตัวเลือกนั้น ยังไม่มีหลักฐานว่าหางนี้เพิ่มโอกาสจับปลา'
        : ctx.lang === 'ja'
          ? '見た目と見積額で選ぶ。「無し」がある作成画面では省略できる。このテールの釣果ボーナスは確認していない。'
          : 'Choose this tail for its appearance and quoted price, or choose “None” where the maker offers it. A catch advantage from this tail is not established.'
    return { summary, facts: [] }
  }
  if (item.category === 'food' && item.id === '08') {
    const summary =
      ctx.lang === 'th'
        ? 'ตรวจชื่อปลาที่เมนูแสดงก่อนกิน เพราะเกมกินตัวแรกในข้อง ถ้าเป็นคุซะฟุกุอย่ากิน: HP จะเหลือ 0'
        : ctx.lang === 'ja'
          ? '食べる前に表示された魚名を確認する。びくの先頭を食べる。クサフグなら食べない：HPが0になる。'
          : 'Check the displayed fish name before eating: the game eats the first keepnet fish. Do not eat Kusafugu; it sets HP to zero.'
    return { summary, facts: use.facts?.[ctx.lang] || [] }
  }
  return null
}

export function visibleUsage(ctx, item) {
  const use = item.playerUse || {}
  const decision =
    item.baitLureDecision ||
    item.gearDecision ||
    (item.category === 'rod' ? item.rodDecision : null)
  if (decision) return decisionUsage(ctx, decision)
  if (item.category === 'hook' || item.category === 'float_weight')
    return { summary: ctx.local(use.summary), facts: use.facts?.[ctx.lang] || [] }
  const special = specialCategoryUsage(ctx, item, use)
  if (special) return special
  const facts = use.specialResponseTarget ? [] : use.facts?.[ctx.lang] || use.facts?.en || []
  return { summary: ctx.local(use.summary) || '', facts }
}

function steeringCopy(ctx) {
  return {
    th: {
      title: 'ปลาและสัตว์ที่ชี้ทิศให้เข้าหาจุดโปรยได้',
      yes: 'โปรไฟล์นี้อยู่ในรายชื่อที่หันทิศเข้าหาจุดโปรยได้',
      no: 'โปรไฟล์นี้ไม่อยู่ในรายชื่อที่หันทิศเข้าหาจุดโปรยได้',
    },
    en: {
      title: 'Creatures whose movement can be steered toward chum',
      yes: 'This profile is in the movement-steering list.',
      no: 'This profile is not in the movement-steering list.',
    },
    ja: {
      title: '寄せエサの地点へ進行方向を向けられる魚・生き物',
      yes: 'このプロフィールは進行方向の誘導リストに含まれる。',
      no: 'このプロフィールは進行方向の誘導リストに含まれない。',
    },
  }[ctx.lang]
}

function normalizedFishIds(ids) {
  return [...new Set((ids || []).map((id) => String(id).toUpperCase().padStart(2, '0')))]
}

function compatibilityRoutes(routes) {
  return Object.keys(routes).filter((route) => Array.isArray(routes[route]) && routes[route].length)
}

function renderRouteGroup(ctx, route, ids, fishVisuals, fishLocations) {
  const fishIds = normalizedFishIds(ids)
  const routeName = route === 'float' ? ctx.copy.routeFloat : ctx.copy.routeSinker
  const cards = fishIds
    .map((id) => ctx.fishTile(id, fishVisuals, fishLocations, ctx.selectedStage))
    .join('')
  const active = ctx.selectedRoute === route ? 'data-active="true"' : ''
  return `<div id="rig-${ctx.esc(route)}" class="detail-section" ${active}><h3>${ctx.esc(routeName)} · ${fishIds.length}</h3><div class="detail-grid">${cards}</div></div>`
}

function renderCompatibilityGroups(ctx, routes, routeKeys, ids, fishVisuals, fishLocations) {
  if (!routeKeys.length) {
    const cards = ids
      .map((id) => ctx.fishTile(id, fishVisuals, fishLocations, ctx.selectedStage))
      .join('')
    return `<div class="detail-grid">${cards}</div>`
  }
  return routeKeys
    .map((route) => renderRouteGroup(ctx, route, routes[route], fishVisuals, fishLocations))
    .join('')
}

function targetAccepted(ctx, routes, routeKeys, ids) {
  const activeRoute =
    ctx.selectedRoute && Object.hasOwn(routes, ctx.selectedRoute) ? ctx.selectedRoute : null
  if (activeRoute) return normalizedFishIds(routes[activeRoute]).includes(ctx.selectedFish)
  return (
    ids.includes(ctx.selectedFish) ||
    routeKeys.some((route) => normalizedFishIds(routes[route]).includes(ctx.selectedFish))
  )
}

function targetStatus(ctx, routes, accepted, steering, steeringText) {
  const activeRoute =
    ctx.selectedRoute && Object.hasOwn(routes, ctx.selectedRoute) ? ctx.selectedRoute : null
  const routePrefix = activeRoute
    ? `${activeRoute === 'float' ? ctx.copy.routeFloat : ctx.copy.routeSinker}: `
    : ''
  const status = accepted
    ? steering
      ? steeringText.yes
      : ctx.copy.targetYes
    : steering
      ? steeringText.no
      : ctx.copy.targetNo
  return routePrefix + status
}

function steeringScope(ctx, steering) {
  if (!steering) return ctx.copy.fishScope
  if (ctx.lang === 'th')
    return 'รายชื่อนี้บอกผลต่อทิศการเคลื่อนที่ ไม่ใช่เหยื่อที่กินหรือโบนัสโอกาสกัด'
  if (ctx.lang === 'ja')
    return '進行方向の効果であり、食べられるエサや食いつき率のボーナスを示さない。'
  return 'This list describes movement steering, not edible bait or a bite-rate bonus.'
}

function compatibilitySummary(ctx, count, steering) {
  if (steering) {
    if (ctx.lang === 'th') return `ดูรายชื่อปลาและสัตว์ · ${count}`
    if (ctx.lang === 'ja') return `魚・生き物の一覧を見る · ${count}`
    return `See creature list · ${count}`
  }
  if (ctx.lang === 'th') return `ปลาที่ใช้ด้วยได้ · ${count}`
  if (ctx.lang === 'ja') return `対応する魚 · ${count}`
  return `Compatible fish · ${count}`
}

export function fishSection(ctx, item, fishVisuals, fishLocations) {
  const use = item.playerUse || {}
  const routes = use.fishIdsByRoute || {}
  const steering = item.category === 'general_tool' && ['08', '09', '0A'].includes(item.id)
  const routeKeys = compatibilityRoutes(routes)
  const ids = Array.isArray(use.fishIds) ? normalizedFishIds(use.fishIds) : []
  const categories = ['lure', 'fly', 'bait', 'float_weight', 'general_tool']
  if (!categories.includes(item.category) || (!ids.length && !routeKeys.length)) return ''
  const copy = steeringCopy(ctx)
  const heading = steering ? copy.title : ctx.copy.fish
  const groups = renderCompatibilityGroups(ctx, routes, routeKeys, ids, fishVisuals, fishLocations)
  const accepted = targetAccepted(ctx, routes, routeKeys, ids)
  const status = ctx.selectedFish ? targetStatus(ctx, routes, accepted, steering, copy) : ''
  const fishTarget = ctx.selectedFish
    ? `<p class="play-target"><strong>${ctx.esc(ctx.copy.target)} · ${ctx.esc(ctx.fishName(ctx.selectedFish, fishVisuals))} (${ctx.esc(ctx.selectedFish)})</strong><br>${ctx.esc(status)}</p>`
    : ''
  const count = routeKeys.length
    ? new Set(Object.values(routes).flatMap(normalizedFishIds)).size
    : ids.length
  const list = `<details class="compatibility-details"><summary>${ctx.esc(compatibilitySummary(ctx, count, steering))}</summary>${groups}</details>`
  return `<section class="detail-section compatibility-section"><h2>${ctx.esc(heading)} · ${count}</h2>${fishTarget}<p class="section-lede">${ctx.esc(ctx.local(use.fishScope) || ctx.copy.fishScope)}</p>${list}<p class="muted">${ctx.esc(steeringScope(ctx, steering))}</p></section>`
}

export function technicalSection(ctx, item) {
  const use = item.playerUse || {},
    sources = [
      ...new Set([
        ...(use.evidence?.sources || []),
        ...(item.rodDecision?.sources || []),
        ...(item.gearDecision?.sources || []),
        ...(item.baitLureDecision?.sources || []),
      ]),
    ]
  const decoded = item.decodedFields || {},
    targets = use.targetMatches
      ? Array.isArray(use.targetMatches)
        ? use.targetMatches
        : [use.targetMatches]
      : []
  const noteArray = use.evidenceNotes?.[ctx.lang] || use.evidenceNotes?.en || []
  const sourceLinks = sources
    .map(
      (path) =>
        `<li><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${encodeURI(path)}" target="_blank" rel="noopener">${ctx.esc(path)} ↗</a></li>`,
    )
    .join('')
  const techTargets = targets.length
    ? `<h3>${ctx.esc(ctx.copy.targets)}</h3><ul>${targets.map((t) => `<li>${ctx.esc(t.nameTh && ctx.lang === 'th' ? t.nameTh : t.nameJa || t.fishId)} · ID ${ctx.esc(t.fishId)} — ${ctx.esc(ctx.local(use.targetMatchScope))}</li>`).join('')}</ul>`
    : ''
  const renderedDecoded = Object.entries(decoded)
    .map(
      ([key, value]) =>
        `<dt>${ctx.esc(key)}</dt><dd><code>${ctx.esc(typeof value === 'object' ? JSON.stringify(value) : value)}</code></dd>`,
    )
    .join('')
  const rawFields = Object.entries(item.rawFields || {})
    .map(
      ([key, value]) =>
        `<dt>${ctx.esc(key)}</dt><dd><code>${ctx.esc(typeof value === 'object' ? JSON.stringify(value) : value)}</code></dd>`,
    )
    .join('')
  const rodMechanics =
    item.category === 'rod' || item.gearDecision
      ? `<h3>${ctx.lang === 'th' ? 'การทำงานที่แกะได้' : ctx.lang === 'ja' ? '解読した動作' : 'Decoded mechanics'}</h3><p>${ctx.esc(ctx.local(use.summary))}</p><ul>${(use.facts?.[ctx.lang] || []).map((fact) => `<li>${ctx.esc(fact)}</li>`).join('')}</ul>`
      : ''
  const notes = noteArray.map((note) => `<li>${ctx.esc(note)}</li>`).join('')
  return `<details class="evidence"><summary>${ctx.esc(ctx.copy.tech)}</summary><div class="detail-content"><p><strong>${ctx.esc(ctx.copy.itemPrice)}:</strong> ${item.priceYen == null ? '—' : `¥${ctx.esc(item.priceYen)}`}</p><p><strong>${ctx.esc(ctx.copy.offset)}:</strong> <code>${ctx.esc(item.fileOffset || '—')}</code></p><p><strong>${ctx.esc(ctx.copy.bytes)}:</strong> <code>${ctx.esc(item.recordBytesHex || '—')}</code></p>${techTargets}${rodMechanics}${renderedDecoded ? `<h3>${ctx.esc(ctx.copy.fields)}</h3><dl>${renderedDecoded}</dl>` : ''}${rawFields ? `<h3>${ctx.esc(ctx.copy.raw)}</h3><dl>${rawFields}</dl>` : ''}${notes ? `<h3>${ctx.esc(ctx.copy.evidenceNotes)}</h3><ul>${notes}</ul>` : ''}${sources.length ? `<h3>${ctx.esc(ctx.copy.source)}</h3><ul>${sourceLinks}</ul>` : ''}<a href="${ctx.esc(item.frame || item.image)}" target="_blank" rel="noopener">${ctx.esc(ctx.copy.openFrame)}</a></div></details>`
}
