// One method inside one stage: the easiest kit, and what the shops sell with a buy or skip verdict.
import { badge, esc, list, table, verdictCell, yen } from './parts.js'

const KIT_SLOTS = { float: 'bait', sinker: 'bait', casting: 'bait', lure: 'lure', fly: 'fly' }
const STYLE_OF = { float: 'float', sinker: 'sinker', casting: 'casting', lure: 'lure', fly: 'fly' }

function cheapest(weights) {
  return weights.length ? Math.min(...weights.map((w) => w.yen)) : 0
}

function kitList(ctx, method, plan, kit) {
  const { copy, name } = ctx
  const parts = copy.stage.kitParts
  const rows = [[parts.rod, name('rod', kit.rod), yen(ctx.matrix.items.rod[kit.rod].price)]]
  if (kit.hook != null)
    rows.push([parts.hook, name('hook', kit.hook), yen(ctx.matrix.items.hook[kit.hook].price)])
  const slot = KIT_SLOTS[method]
  const itemYen = plan.parts.items.find((i) => i.id === kit.item).yen
  rows.push([parts[slot], name(slot, kit.item), yen(itemYen)])
  const weight = cheapest(plan.parts.weights)
  if (plan.parts.weights.length) rows.push([parts.weight, copy.stage.weightNote, yen(weight)])
  return { rows, total: kit.yen + weight }
}

function kitBlock(ctx, method, plan, kit, head) {
  const { copy, lang } = ctx
  const { rows, total } = kitList(ctx, method, plan, kit)
  const body = rows.map(
    ([part, label, price]) =>
      `<li><strong>${part}</strong> ${esc(label)} <span class="cg-yen">${price}</span></li>`,
  )
  return `<div class="cg-kit"><h4>${head} ${badge(lang, 'rom')}</h4><ul class="cg-kit-list">${body.join('')}</ul><p><strong>${copy.stage.total(total)}</strong></p></div>`
}

function fishNamed(ctx, stageFish, matchId) {
  return stageFish.some((f) => f.id === matchId) ? ctx.fishName(matchId) : null
}

function rodRow(ctx, stage, plan, rod, inKit) {
  const { copy, name } = ctx
  const named = fishNamed(ctx, stage.fish, rod.match)
  let verdict = 'maybe'
  let reason = [
    copy.stage.reasons.rodLight,
    copy.stage.reasons.rodMedium,
    copy.stage.reasons.rodHeavy,
  ][rod.cls]
  if (rod.cls === 2) verdict = 'skip'
  if (named) {
    verdict = 'buy'
    reason = copy.stage.reasons.rodNamed(named)
  }
  if (inKit) {
    verdict = 'buy'
    reason = `${copy.stage.reasons.kit}; ${reason}`
  }
  return [
    name('rod', rod.id),
    copy.classes[rod.cls],
    yen(rod.yen),
    verdictCell(copy, verdict),
    `${esc(reason)} ${badge(ctx.lang, 'rom')}`,
  ]
}

function hookRow(ctx, stage, hook, inKit) {
  const { copy, name } = ctx
  const named = fishNamed(ctx, stage.fish, hook.match)
  let verdict = 'maybe'
  let reason = copy.stage.reasons.hookSize[hook.sel] ?? ''
  if (named) {
    verdict = 'buy'
    reason = copy.stage.reasons.hookNamed(named)
  }
  if (inKit) {
    verdict = 'buy'
    reason = `${copy.stage.reasons.kit}; ${reason}`
  }
  return [
    name('hook', hook.id),
    yen(hook.yen),
    verdictCell(copy, verdict),
    `${esc(reason)} ${badge(ctx.lang, 'rom')}`,
  ]
}

const LURE_REASON = { sinking: 'lureSinking', surface: 'lureSurface', untested: 'lureUntested' }
const LURE_TRUST = { sinking: 'tested', surface: 'tested', untested: 'unconfirmed' }

function itemRow(ctx, stage, method, plan, item, inKit) {
  const { copy, name } = ctx
  const slot = KIT_SLOTS[method]
  const accepted = stage.fish.filter((f) =>
    ctx.matrix.fishById
      .get(f.id)
      .accepts[
        method === 'lure'
          ? 'lure'
          : method === 'fly'
            ? 'fly'
            : method === 'float'
              ? 'bait'
              : 'baitSinker'
      ].includes(item.id),
  )
  let verdict = accepted.length ? 'maybe' : 'skip'
  let trust = 'rom'
  let reason = copy.stage.reasons.baitCovers(accepted.length, stage.fish.length)
  if (method === 'lure') {
    reason = copy.stage.reasons[LURE_REASON[item.kind]]
    trust = LURE_TRUST[item.kind]
  }
  if (method === 'fly') reason = copy.stage.reasons.flyBody
  const matchId = ctx.matrix.items[slot === 'bait' ? 'bait' : slot][item.id]?.match
  const named = matchId ? fishNamed(ctx, stage.fish, matchId) : null
  if (named) {
    verdict = 'buy'
    reason = copy.stage.reasons[method === 'lure' ? 'lureNamed' : 'baitNamed'](named)
  }
  if (inKit) {
    verdict = 'buy'
    reason = `${copy.stage.reasons.kit}; ${reason}`
  }
  return [
    name(slot, item.id),
    yen(item.yen),
    verdictCell(copy, verdict),
    `${esc(reason)} ${badge(ctx.lang, trust)}`,
  ]
}

function weightRows(ctx, plan) {
  const { copy, name } = ctx
  const low = cheapest(plan.parts.weights)
  return plan.parts.weights.map((w) => [
    name('float_weight', w.id),
    yen(w.yen),
    verdictCell(copy, w.yen === low ? 'buy' : 'skip'),
    `${esc(copy.stage.reasons.weight)} ${badge(ctx.lang, 'rom')}`,
  ])
}

function fishKitTable(ctx, stage, method, plan) {
  const { copy, name, lang } = ctx
  const slot = KIT_SLOTS[method]
  const parts = copy.stage.kitParts
  const rows = stage.fish
    .filter((f) => plan.perFish[f.id])
    .map((f) => {
      const k = plan.perFish[f.id]
      const rod = `${name('rod', k.rod)} (${copy.classes[ctx.matrix.items.rod[k.rod].class]})`
      return [
        `<a href="${esc(ctx.fishHref(f.id))}">${esc(ctx.fishName(f.id))}</a>`,
        `${f.size[0]}–${f.size[1]}`,
        esc(rod),
        k.hook == null ? copy.stage.none : esc(name('hook', k.hook)),
        esc(name(slot, k.item)),
        k.score.toFixed(1),
      ]
    })
  const head = [
    copy.stage.colFish,
    copy.stage.colSize,
    parts.rod,
    parts.hook,
    parts[slot],
    copy.stage.colStart,
  ]
  return `<h4>${esc(copy.stage.perFishHead)} ${badge(lang, 'rom')}</h4>${table(head.map(esc), rows, copy.stage.perFishHead)}`
}

function shopTables(ctx, stage, method, plan) {
  const { copy, lang } = ctx
  const kits = [plan.kit, plan.kit.budget].filter(Boolean)
  const used = (key, id) => kits.some((k) => k[key] === id)
  const slot = KIT_SLOTS[method]
  const names = copy.stage.kitParts
  const c = copy.stage.cols
  const parts = [
    [
      names.rod,
      [names.rod, c.cls, c.price, c.verdict, c.why],
      plan.parts.rods.map((r) => rodRow(ctx, stage, plan, r, used('rod', r.id))),
    ],
  ]
  if (plan.parts.hooks.length)
    parts.push([
      names.hook,
      [names.hook, c.price, c.verdict, c.why],
      plan.parts.hooks.map((h) => hookRow(ctx, stage, h, used('hook', h.id))),
    ])
  parts.push([
    names[slot],
    [names[slot], c.price, c.verdict, c.why],
    plan.parts.items.map((i) => itemRow(ctx, stage, method, plan, i, used('item', i.id))),
  ])
  if (plan.parts.weights.length)
    parts.push([names.weight, [names.weight, c.price, c.verdict, c.why], weightRows(ctx, plan)])
  return parts
    .map(
      ([label, head, rows]) =>
        `<h5>${esc(label)}</h5>${table(head.map(esc), rows, `${label} · ${lang}`)}`,
    )
    .join('')
}

export function renderMethod(ctx, stage, method, firstStage) {
  const { copy } = ctx
  const plan = stage.methods[method]
  const label = copy.methodNames[method]
  if (!plan.available) {
    const first = firstStage[method]
    const text = copy.stage.unavailable[plan.missing](
      label,
      first && first !== stage.stage ? first : null,
    )
    return `<details class="cg-method" id="stage-${stage.stage}-${method}"><summary>${esc(label)}<span class="cg-sum">${esc(text)}</span></summary><p>${esc(text)}</p></details>`
  }
  const total = stage.fish.length
  const kit = plan.kit
  const sub = `${kit.covered}/${total} · ${yen(kit.yen + cheapest(plan.parts.weights))}`
  const head = kitBlock(ctx, method, plan, kit, copy.stage.kitHead)
  const budget = kit.budget ? kitBlock(ctx, method, plan, kit.budget, copy.stage.budgetHead) : ''
  const criterion = `<p class="cg-note">${esc(copy.stage.kitCriterion(kit.covered, total, kit.mean))}</p>`
  const matters = `<div class="cg-matter"><h4>${copy.stage.upgradesHead}</h4><div class="cg-two"><div><h5>${copy.stage.matter}</h5>${list(copy.stage.matters[STYLE_OF[method]].map(esc))}</div><div><h5>${copy.stage.dontMatter}</h5>${list(copy.stage.dont[STYLE_OF[method]].map(esc))}</div></div></div>`
  return `<details class="cg-method" id="stage-${stage.stage}-${method}"><summary>${esc(label)}<span class="cg-sum">${esc(sub)}</span></summary>${head}${budget}${criterion}${fishKitTable(ctx, stage, method, plan)}<h4>${copy.stage.shopsHead}</h4>${shopTables(ctx, stage, method, plan)}${matters}</details>`
}
