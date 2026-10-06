// Button policies a player can actually carry out: they read only what is visible on screen
// (the fish moving away, moving closer or standing still, and how fast) and the player's own
// recent presses. The one exception is the "reference" policy, which peeks at the hidden stamina
// on purpose, to show what the hidden value would be worth.

/** What the player sees in a fight view: closing in, running away, or standing still, and how fast. */
export function observe(view, before) {
  return {
    speed: before ? view.fishPos - before.fishPos : 0,
    closing: view.reeling,
    running: view.fishRunning,
    still: !view.reeling && !view.fishRunning,
    resting: view.phase === 'resting',
    stamina: view.stamina,
  }
}

/** Default frames the player waits for the fish to start coming closer before giving up on a press. */
const FIRST_PULL_FRAMES = 12
/** Frames after a tap during which the fish standing still is not read as a rest. */
const TAP_SETTLE = 3

const holdPolicy = () => () => true

function mashPolicy({ on, off }) {
  let tick = -1
  return () => {
    tick += 1
    return tick % (on + off) < on
  }
}

/** One-frame taps while the fish runs: they make the game roll a new run length. */
function tapper({ taps = 0, tapStart = 0, tapEvery = 16, tapSpeed = 0 }) {
  let runFor = 0
  let done = 0
  let since = 99
  return {
    since: () => since,
    /** True when this frame should be a tap. */
    due(now) {
      since += 1
      if (taps === 0) return false
      if (!now.running && since >= TAP_SETTLE) [runFor, done] = [0, 0]
      if (!now.running) return false
      runFor += 1
      const ready = done < taps && runFor > tapStart + done * tapEvery && now.speed >= tapSpeed
      if (ready) [since, done] = [0, done + 1]
      return ready
    },
  }
}

// Press when the fish has stood still for `wait` frames; release when it slows to a crawl
// (`slow` units per frame, 0 = ignore), has stopped coming closer for `stop` frames, or has been
// held `cap` frames (0 = no cap). A press the fish does not answer within `first` frames is
// dropped. Never presses while the fish runs, apart from the optional taps.
// The player knows what they just did, so cues older than their own last move are ignored.
function rhythmPolicy(spec, seen) {
  const { wait, stop, slow = 0, cap = 0, first = FIRST_PULL_FRAMES, lag = 0 } = spec
  const tap = tapper(spec)
  const s = { held: false, heldFor: 0, quietFor: 0, restFor: 0, pulled: false, moved: 99 }
  const flip = (held) =>
    Object.assign(s, { held, heldFor: 0, quietFor: 0, restFor: 0, pulled: false, moved: 0 })
  return () => {
    const now = seen()
    s.moved += 1
    const fresh = s.moved > lag
    if (tap.due(now) && !s.held) return true
    if (s.held) {
      s.heldFor += 1
      if (fresh && now.closing) s.pulled = true
      if (fresh) s.quietFor = now.closing ? 0 : s.quietFor + 1
      const limit = s.pulled ? stop : Math.max(stop, first)
      const crawling = s.pulled && slow > 0 && now.speed < 0 && -now.speed <= slow
      if ((fresh && (crawling || s.quietFor > limit)) || (cap > 0 && s.heldFor >= cap)) flip(false)
    } else if (fresh && tap.since() >= TAP_SETTLE) {
      s.restFor = now.still ? s.restFor + 1 : 0
      if (s.restFor > wait) flip(true)
    }
    return s.held
  }
}

// The documented "simple policy": press as soon as the fish rests, hold while stamina is left.
function referencePolicy(_spec, seen) {
  let held = false
  return () => {
    const now = seen()
    if (held && now.stamina === 0) held = false
    else if (!held && now.resting) held = true
    return held
  }
}

/** Drop the fixed and zero fields of a rhythm spec so stored policies stay small. */
export function packSpec(spec) {
  const fixed = new Set(['kind', 'lag'])
  return Object.fromEntries(
    Object.entries(spec).filter(([name, value]) => value && !fixed.has(name)),
  )
}

/** Inverse of packSpec; `lag` is the reaction time the policy was found for. */
export function unpackSpec(packed, lag) {
  return { kind: 'rhythm', wait: 0, stop: 0, slow: 0, cap: 0, ...packed, lag }
}

const KINDS = {
  hold: holdPolicy,
  mash: mashPolicy,
  rhythm: rhythmPolicy,
  reference: referencePolicy,
}

/**
 * Build a stateful policy from a plain spec ({ kind, ...numbers, lag }). `lag` delays what the
 * policy sees by that many frames, modelling the player's reaction time. Returns `next(view)`:
 * give it the latest fight view and it answers whether A is held for the coming frame.
 */
export function createPolicy(spec) {
  const make = KINDS[spec.kind]
  if (!make) throw new RangeError(`Unknown policy kind ${spec.kind}`)
  const lag = spec.lag ?? 0
  const history = []
  const seen = () => {
    const at = Math.max(0, history.length - 1 - lag)
    return observe(history[at], history[at - 1])
  }
  const decide = make(spec, seen)
  return {
    next(view) {
      history.push(view)
      return decide()
    },
  }
}
