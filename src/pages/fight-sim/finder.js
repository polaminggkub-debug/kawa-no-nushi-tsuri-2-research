import { currentKey, currentSetup, fishFacts } from './setup.js'
import {
  baselineCard,
  bestCard,
  ceilingCard,
  missingCard,
  notesLine,
  trickCard,
} from './results.js'
import { runInWorker } from './worker-client.js'

/** The stored or live-computed record for the current tackle, or undefined. */
export const currentRecord = (ctx) =>
  ctx.policies.combos[currentKey(ctx.state)] ?? ctx.live.get(currentKey(ctx.state))

export function renderFinder(ctx) {
  const record = currentRecord(ctx)
  ctx.$('fs-facts').textContent = fishFacts(ctx)
  ctx.$('fs-results').innerHTML = record
    ? bestCard(record, ctx.text) +
      baselineCard(record, ctx.text) +
      trickCard(record, ctx.text) +
      ceilingCard(record, ctx.text) +
      notesLine(ctx.text)
    : missingCard(ctx.text)
}

/** Work the finder out in a Web Worker for a tackle that was not precomputed. */
export function runLive(ctx) {
  const key = currentKey(ctx.state)
  const button = ctx.$('fs-results').querySelector('[data-fs-run]')
  if (button) {
    button.disabled = true
    button.textContent = ctx.text.finder.running
  }
  return runInWorker(ctx.tables, currentSetup(ctx.state))
    .then((record) => {
      ctx.live.set(key, record)
      if (key === currentKey(ctx.state)) ctx.onFinderChange()
    })
    .catch(() => {
      ctx.$('fs-results').innerHTML = `<p class="fs-note">${ctx.text.finder.liveFailed}</p>`
    })
}

/** Click on the "run the finder" button (the only button inside the results). */
export function bindFinder(ctx) {
  ctx.$('fs-results').addEventListener('click', (event) => {
    if (event.target.closest('[data-fs-run]')) runLive(ctx).catch(() => undefined)
  })
}
