import { createFight } from '../../entities/fight/index.js'
import {
  FRAME_CAP,
  REACTION,
  createPolicy,
  fightOptions,
  sampleStarts,
  unpackEntry,
} from '../../features/fight-policy/index.js'
import { drawScene, meterSteps, readColors } from './draw.js'
import { FRAME_RATE, escapeHtml, seconds } from './format.js'
import { currentRecord } from './finder.js'
import { currentSetup, findRow } from './setup.js'
import { isHeld, releaseAll } from './input.js'

const STEP_MS = 1000 / FRAME_RATE
const MAX_CATCH_UP = 6
/** The rhythm the ghost plays when this tackle has no stored recommendation. */
const FALLBACK_GHOST = { kind: 'rhythm', wait: 0, stop: 3, slow: 0, cap: 0, first: 12 }

/** What the player can see right now: running, resting, reeling or stopped. */
export function visibleStatus(view, held, pulled) {
  if (view.phase === 'escaping') return 'escaping'
  if (view.phase === 'resting') return 'resting'
  if (view.reeling) return 'reeling'
  if (held) return pulled ? 'stalled' : view.fishRunning ? 'pressed' : 'reeling'
  return 'running'
}

function ghostSpec(ctx) {
  const stored = unpackEntry(currentRecord(ctx)?.plain)
  return stored?.spec ?? { ...FALLBACK_GHOST, lag: REACTION.human }
}

/** A fresh random start for the current tackle (same kind of start the finder is scored on). */
export function randomStart(ctx) {
  const fish = findRow(ctx, 'fish', ctx.state.fishId)
  const rod = findRow(ctx, 'rod', ctx.state.rodId)
  return sampleStarts(fish, rod, 1, 1 + Math.floor(Math.random() * 0xfffffffe))[0]
}

function newRun(ctx, start) {
  const options = fightOptions(currentSetup(ctx.state), start)
  const fight = createFight(options, ctx.tables)
  const ghost = createFight(options, ctx.tables)
  return {
    start,
    fight,
    ghost,
    policy: createPolicy(ghostSpec(ctx)),
    view: fight.view(),
    ghostView: ghost.view(),
    pulled: false,
  }
}

function stepGhost(run) {
  if (run.ghostView.outcome) return
  run.ghostView = run.ghost.step({ a: run.policy.next(run.ghostView) })
}

/** Advance both fights one video frame with the player's current button state. */
export function tick(run, held) {
  run.pulled = held && (run.pulled || run.view.reeling)
  run.view = run.fight.step({ a: held })
  stepGhost(run)
}

/** Let the ghost finish its fight (it was playing alongside; up to the frame cap). */
function finishGhost(run) {
  while (!run.ghostView.outcome && run.ghostView.frame < FRAME_CAP) stepGhost(run)
}

function ghostMessage(ctx, run) {
  const words = ctx.text.play.ghost
  const { outcome, frame } = run.ghostView
  if (outcome === 'caught') return words.caught(seconds(frame))
  if (outcome === 'escaped') return words.escaped
  if (outcome === 'lost-tackle') return words.lost
  return words.unfinished
}

function resultMessage(ctx, outcome, frames) {
  const words = ctx.text.play.result
  if (outcome === 'caught') return words.caught(seconds(frames))
  if (outcome === 'lost-tackle') return words.lost
  return outcome === 'escaped' ? words.escaped : words.gaveUp
}

function render(ctx) {
  const { run } = ctx.play
  const held = isHeld(ctx)
  const status = visibleStatus(run.view, held, run.pulled)
  drawScene(ctx.$('fight-canvas'), {
    view: run.view,
    ghostView: ctx.$('show-ghost').checked ? run.ghostView : null,
    held,
    status: ctx.text.play.short[status],
    text: ctx.text,
    colors: ctx.colors,
  })
  if (ctx.play.statusKey !== status) {
    ctx.play.statusKey = status
    ctx.$('fight-phase').textContent = ctx.text.play.status[status]
  }
  renderHidden(ctx, run.view)
}

function renderHidden(ctx, view) {
  const panel = ctx.$('hidden-values')
  panel.hidden = !ctx.$('show-hidden').checked
  if (panel.hidden) return
  const words = ctx.text.play.hidden
  const rows = [
    [words.stamina, view.stamina],
    [words.fightValue, `${view.fightValue} (${meterSteps(view.fightValue)}/6)`],
    [words.distance, view.fishPos],
    [words.boundary, view.boundary],
    [words.runTimer, view.restTimer],
    [words.restTimer, view.idleTimer],
    [words.frame, view.frame],
  ]
  panel.innerHTML = rows
    .map(([name, value]) => `<dt>${escapeHtml(name)}</dt><dd>${value}</dd>`)
    .join('')
}

function showResult(ctx, outcome) {
  const { run } = ctx.play
  finishGhost(run)
  const kind = outcome === 'caught' ? 'caught' : outcome === 'lost-tackle' ? 'lost' : 'escaped'
  const message = resultMessage(ctx, outcome, run.view.frame)
  const size = ctx.text.play.sizeLine(run.start.size)
  ctx.$('fight-result').innerHTML =
    `<p class="fs-result fs-result-${kind}">${escapeHtml(message)}</p>
<p class="fs-note">${escapeHtml(size)} ${escapeHtml(ghostMessage(ctx, run))}</p>`
}

function setRunning(ctx, running) {
  ctx.play.running = running
  ctx.$('fight-giveup').disabled = !running
  ctx.$('fight-start').textContent = running ? ctx.text.play.again : ctx.text.play.start
  ctx.$('fight-retry').hidden = running || !ctx.play.run
  if (!running) releaseAll(ctx)
}

function stop(ctx, outcome) {
  cancelAnimationFrame(ctx.play.frameId)
  setRunning(ctx, false)
  render(ctx)
  ctx.$('fight-phase').textContent = ''
  ctx.play.statusKey = ''
  showResult(ctx, outcome)
}

function frame(ctx, now) {
  const play = ctx.play
  if (!play.running) return
  play.accumulated += Math.min(now - play.last, STEP_MS * MAX_CATCH_UP)
  play.last = now
  while (play.accumulated >= STEP_MS && !play.run.view.outcome) {
    tick(play.run, isHeld(ctx))
    play.accumulated -= STEP_MS
  }
  render(ctx)
  if (play.run.view.outcome) stop(ctx, play.run.view.outcome)
  else play.frameId = requestAnimationFrame((time) => frame(ctx, time))
}

/** Begin a fight (a new random start, or the same start again). */
export function startFight(ctx, start = randomStart(ctx)) {
  cancelAnimationFrame(ctx.play.frameId)
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  Object.assign(ctx.play, { run: newRun(ctx, start), accumulated: 0, statusKey: '' })
  ctx.$('fight-result').replaceChildren()
  setRunning(ctx, true)
  render(ctx)
  ctx.play.last = performance.now()
  ctx.play.frameId = requestAnimationFrame((time) => frame(ctx, time))
}

export function giveUp(ctx) {
  if (!ctx.play.running) return
  ctx.play.run.view = { ...ctx.play.run.view, outcome: 'gave-up' }
  stop(ctx, 'gave-up')
}

/** Draw the waiting scene (before the first fight) with the current tackle. */
export function showIdle(ctx) {
  if (ctx.play.running) return
  const start = randomStart(ctx)
  ctx.play.run = newRun(ctx, start)
  ctx.play.statusKey = ''
  ctx.$('fight-phase').textContent = ctx.text.play.waiting
  ctx.$('fight-retry').hidden = true
  ctx.$('fight-result').replaceChildren()
  drawIdle(ctx)
}

function drawIdle(ctx) {
  const { run } = ctx.play
  drawScene(ctx.$('fight-canvas'), {
    view: run.view,
    ghostView: null,
    held: false,
    status: ctx.text.play.short.running,
    text: ctx.text,
    colors: ctx.colors,
  })
}

export function bindPlay(ctx) {
  ctx.colors = readColors()
  ctx.play = { running: false, run: null, frameId: 0, accumulated: 0, last: 0, statusKey: '' }
  ctx.$('fight-start').addEventListener('click', () => startFight(ctx))
  ctx.$('fight-retry').addEventListener('click', () => startFight(ctx, ctx.play.run.start))
  ctx.$('fight-giveup').addEventListener('click', () => giveUp(ctx))
  for (const id of ['show-hidden', 'show-ghost'])
    ctx.$(id).addEventListener('change', () => (ctx.play.running ? render(ctx) : drawIdle(ctx)))
  window.addEventListener('resize', () => (ctx.play.running ? render(ctx) : drawIdle(ctx)))
}
