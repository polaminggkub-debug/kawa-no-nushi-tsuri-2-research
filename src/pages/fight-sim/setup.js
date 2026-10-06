import {
  defaultSetup,
  fightableFish,
  methodOfRod,
  rodsOfMethod,
  setupKey,
  startingFightValue,
  usableBaits,
} from '../../features/fight-policy/index.js'
import { escapeHtml } from './format.js'
import { baitLabel, fishLabel, hookLabel, rodLabel } from './names.js'

const option = (value, label, selected) =>
  `<option value="${value}"${selected ? ' selected' : ''}>${escapeHtml(label)}</option>`

export const findRow = (ctx, kind, id) => ctx.tables[kind].find((row) => row.id === id)

/** The best tackle the engine finds for a fish with the best rod of a method. */
export function bestState(ctx, fishId, method) {
  const setup = defaultSetup(ctx.tables, findRow(ctx, 'fish', fishId), method)
  return { fishId, method, rodId: setup.rodId, hookId: setup.hookId, baitId: setup.baitId }
}

/** Selection from the page address, falling back to the best tackle for the Area 1 Yamame. */
export function stateFromAddress(ctx) {
  const number = (name) => Number(ctx.params.get(name))
  const fish = fightableFish(ctx.tables).find((row) => row.id === number('fish'))
  const rod = ctx.tables.rod.find((row) => row.id === number('rod'))
  const start = bestState(ctx, fish?.id ?? 3, rod ? methodOfRod(rod) : 'float')
  const hook = ctx.tables.hook.find((row) => row.id === number('hook'))
  const bait = usableBaits(ctx.tables).find((row) => row.id === number('bait'))
  if (rod && fish) start.rodId = rod.id
  if (hook && fish && rod) start.hookId = hook.id
  if (fish && rod && ctx.params.has('bait')) start.baitId = bait ? bait.id : 0
  return start
}

export const currentSetup = (state) => ({
  rodId: state.rodId,
  fishId: state.fishId,
  hookId: state.hookId,
  baitId: state.baitId,
})

export const currentKey = (state) => setupKey(currentSetup(state))

function fillFish(ctx) {
  const collator = new Intl.Collator(ctx.locale)
  const fish = fightableFish(ctx.tables)
    .map((row) => ({ id: row.id, label: fishLabel(ctx, row.id) }))
    .sort((a, b) => collator.compare(a.label, b.label))
  ctx.$('fs-fish').innerHTML = fish
    .map((row) => option(row.id, row.label, row.id === ctx.state.fishId))
    .join('')
}

function fillRods(ctx) {
  const rods = rodsOfMethod(ctx.tables, ctx.state.method)
  ctx.$('fs-rod').innerHTML = rods
    .map((rod) => option(rod.id, rodLabel(ctx, rod.id), rod.id === ctx.state.rodId))
    .join('')
}

/** Fill every selector from the current state (and the localized method labels). */
export function fillSetupControls(ctx) {
  fillFish(ctx)
  ctx.$('fs-method').innerHTML = Object.entries(ctx.text.methods)
    .map(([method, label]) => option(method, label, method === ctx.state.method))
    .join('')
  fillRods(ctx)
  ctx.$('fs-hook').innerHTML = ctx.tables.hook
    .map((hook) => option(hook.id, hookLabel(ctx, hook.id), hook.id === ctx.state.hookId))
    .join('')
  const none = option(0, ctx.text.noBait, ctx.state.baitId === 0)
  ctx.$('fs-bait').innerHTML =
    none +
    usableBaits(ctx.tables)
      .map((bait) => option(bait.id, baitLabel(ctx, bait.id), bait.id === ctx.state.baitId))
      .join('')
}

/** One-line facts about the chosen fish: size range and where the strain meter starts. */
export function fishFacts(ctx) {
  const fish = findRow(ctx, 'fish', ctx.state.fishId)
  const middle = (fish.sizeLow + fish.sizeHigh) >> 1
  const value = startingFightValue(ctx.tables, currentSetup(ctx.state), middle)
  const steps = value.toString(2).replace(/0/g, '').length
  return `${ctx.text.sizeLine(fish.sizeLow, fish.sizeHigh)} ${ctx.text.startMeter(steps)}`
}

/** Read the selectors back into the state; returns true when something changed. */
export function readControls(ctx, changed) {
  const state = { ...ctx.state }
  if (changed === 'fs-fish' || changed === 'fs-method') {
    const fishId = Number(ctx.$('fs-fish').value)
    const method = ctx.$('fs-method').value
    return Object.assign(state, bestState(ctx, fishId, method))
  }
  state.rodId = Number(ctx.$('fs-rod').value)
  state.hookId = Number(ctx.$('fs-hook').value)
  state.baitId = Number(ctx.$('fs-bait').value)
  return state
}
