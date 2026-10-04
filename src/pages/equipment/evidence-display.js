import { wingPaletteMarkup } from './wing-palette.js'

export function renderSamples(ctx) {
  const tbody = document.getElementById('sample-rows')
  const selected = ctx.exampleIds
    .map((key) => ctx.allItems.find((item) => `${item.category}:${item.id}` === key))
    .filter(Boolean)
  tbody.innerHTML = selected
    .map((item) => {
      const summary = ctx.copy.quick[`${item.category}:${item.id}`] || ctx.itemNotes(item)[0]
      return `<tr><td><div class="sample-item"><img src="${ctx.esc(item.image)}" alt=""><div><span class="item-id">${ctx.esc(item.id)}</span><strong>${ctx.esc(ctx.itemName(item))}</strong><small>${ctx.esc(item.nameJa)}</small></div></div></td><td>${ctx.esc(summary)}</td><td><span class="price-badge">${ctx.esc(ctx.formatYen(item))}</span></td></tr>`
    })
    .join('')
}

export function renderFrames(ctx, data) {
  const box = document.getElementById('customizer-frames')
  box.innerHTML =
    data.customizerFrames
      .map(
        (frame, index) =>
          `<figure class="custom-frame"><a href="${ctx.esc(frame.src)}" target="_blank" rel="noopener"><img loading="lazy" src="${ctx.esc(frame.src)}" alt="${ctx.esc(ctx.lang === 'th' ? frame.captionTh : ctx.lang === 'ja' ? frame.captionJa : frame.captionEn)}"></a><figcaption><span>${String(index + 1).padStart(2, '0')}</span>${ctx.esc(ctx.lang === 'th' ? frame.captionTh : ctx.lang === 'ja' ? frame.captionJa : frame.captionEn)}</figcaption></figure>`,
      )
      .join('') + wingPaletteMarkup(ctx, data.flyMakerWingPalette)
}

export function renderNotes(ctx, data) {
  const list = data.researchNotes[ctx.lang] || data.researchNotes.en
  document.getElementById('research-notes').innerHTML = list
    .map((text) => `<p>${ctx.esc(text)}</p>`)
    .join('')
  document.getElementById('sources').innerHTML = data.sources
    .map(
      (src) =>
        `<p>${src.url ? `<a href="${ctx.esc(src.url)}" target="_blank" rel="noopener">${ctx.esc(ctx.lang === 'th' ? src.titleTh : ctx.lang === 'ja' ? src.titleJa : src.titleEn)} ↗</a>` : `<strong>${ctx.esc(ctx.lang === 'th' ? src.titleTh : ctx.lang === 'ja' ? src.titleJa : src.titleEn)}</strong>`}<br><span>${ctx.esc(ctx.lang === 'th' ? src.detailTh : ctx.lang === 'ja' ? src.detailJa : src.detailEn)}</span></p>`,
    )
    .join('')
}

export function cardDisclosure(ctx, summary, content, className) {
  if (!content?.trim()) return ''
  return `<details class="${className}"><summary>${ctx.esc(summary)}</summary><div class="${className}-content">${content}</div></details>`
}

export function detailedFields(ctx, item) {
  const originalEvidence = ctx.useOf(item).evidence || {}
  const evidence = {
    ...originalEvidence,
    sources: [
      ...new Set([
        ...(originalEvidence.sources || []),
        ...(item.rodDecision?.sources || []),
        ...(item.gearDecision?.sources || []),
        ...(item.baitLureDecision?.sources || []),
      ]),
    ],
  }
  const sourceInfo = evidence.type
    ? `<p>${ctx.esc(ctx.lang === 'th' ? 'ที่มาของคำอธิบาย' : ctx.lang === 'ja' ? '説明の根拠' : 'Explanation source')}: ${ctx.esc(evidence.type)}</p>${(evidence.sources || []).map((s) => `<p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${ctx.esc(s)}" target="_blank" rel="noopener"><code>${ctx.esc(s)}</code> ↗</a></p>`).join('')}`
    : ''
  const bytes = item.recordBytesHex
    ? `<p><b>${ctx.esc(ctx.copy.offset)}:</b> <code>${ctx.esc(item.fileOffset || '—')}</code></p><p><b>${ctx.esc(ctx.copy.bytes)}:</b> <code>${ctx.esc(item.recordBytesHex)}</code></p>`
    : `<p>${ctx.esc(ctx.copy.none)}</p>`
  const decoded = Object.entries(item.decodedFields || {})
    .filter(([key]) => !['nameJapanese', 'nameEnglish', 'condition'].includes(key))
    .map(
      ([key, value]) =>
        `<dt>${ctx.esc(ctx.copy.fieldNames[key] || key)}</dt><dd>${ctx.esc(typeof value === 'object' ? JSON.stringify(value) : value)}</dd>`,
    )
    .join('')
  const use = ctx.useOf(item),
    targets = use.targetMatches
      ? Array.isArray(use.targetMatches)
        ? use.targetMatches
        : [use.targetMatches]
      : []
  const response = targets.length
    ? `<p>${ctx.lang === 'th' ? 'มีการคำนวณตอบสนองเฉพาะปลา แต่ยังใช้จัดอันดับจับง่ายไม่ได้' : ctx.lang === 'ja' ? '魚別の応答計算。取り込みやすさの順位には未使用。' : 'Fish-specific response calculation; not a landing recommendation.'}: ${targets.map((t) => ctx.esc(ctx.fishName(t.fishId))).join(', ')}</p>`
    : ''
  const hookTrace =
    item.category === 'rod' ||
    ['hook', 'fly_wing', 'fly_tail', 'float_weight'].includes(item.category) ||
    (item.category === 'food' && item.id === '08') ||
    use.specialResponseTarget
      ? `<p>${ctx.esc(ctx.local(use.summary))}</p><ul>${(use.facts?.[ctx.lang] || []).map((f) => `<li>${ctx.esc(f)}</li>`).join('')}</ul>`
      : ''
  return `<details class="record-details"><summary>${ctx.esc(ctx.player.evidence)}</summary>${sourceInfo}${response}${hookTrace}${use.comparison ? `<p>${ctx.esc(ctx.local(use.comparison))}</p>` : ''}<p>${ctx.esc(ctx.copy.priceField)}: ${ctx.esc(ctx.formatYen(item))}</p><ul class="stat-list">${(ctx.useOf(item).evidenceNotes?.[ctx.lang] || []).map((n) => `<li>${ctx.esc(n)}</li>`).join('')}</ul>${ctx.lang === 'th' && !item.nameTh && ctx.useOf(item).displayName?.th ? '<p>ชื่อไทย: คำแปลชื่อภาษาญี่ปุ่นสำหรับคู่มือนี้</p>' : ''}${bytes}${decoded ? `<h4>${ctx.esc(ctx.copy.decoded)}</h4><dl>${decoded}</dl>` : ''}<a class="frame-link" href="${ctx.esc(item.frame)}" target="_blank" rel="noopener">${ctx.esc(ctx.copy.openFrame)}</a></details>`
}

export function thaiLabel(ctx, item) {
  return ctx.lang === 'th' && item.labelImageTh
    ? `<img class="thai-rom-label" loading="lazy" src="${ctx.esc(item.labelImageTh)}" alt="${ctx.esc(item.nameTh || 'ชื่อในเกมไทย')}">`
    : ''
}
