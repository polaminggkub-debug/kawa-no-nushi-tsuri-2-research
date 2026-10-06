const KEYS = new Set([' ', 'z', 'a'])

/** True while the A button is pressed by pointer or keyboard. */
export const isHeld = (ctx) => ctx.input.pointer || ctx.input.keys.size > 0

function sync(ctx) {
  const button = ctx.$('a-button')
  const held = isHeld(ctx)
  button.setAttribute('aria-pressed', String(held))
  button.classList.toggle('is-down', held)
}

function bindPointer(ctx) {
  const button = ctx.$('a-button')
  const release = () => {
    ctx.input.pointer = false
    sync(ctx)
  }
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault()
    button.setPointerCapture(event.pointerId)
    ctx.input.pointer = true
    sync(ctx)
  })
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    button.addEventListener(name, release)
  }
  // No long-press menu, text selection or scroll while the thumb stays on the button.
  for (const name of ['contextmenu', 'selectstart', 'dragstart'])
    button.addEventListener(name, (event) => event.preventDefault())
}

function bindKeyboard(ctx) {
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase()
    if (!KEYS.has(key) || event.ctrlKey || event.metaKey || event.altKey) return
    if (!ctx.play.running) return
    event.preventDefault()
    if (event.repeat) return
    ctx.input.keys.add(key)
    sync(ctx)
  })
  window.addEventListener('keyup', (event) => {
    ctx.input.keys.delete(event.key.toLowerCase())
    sync(ctx)
  })
  window.addEventListener('blur', () => releaseAll(ctx))
}

export function releaseAll(ctx) {
  ctx.input.pointer = false
  ctx.input.keys.clear()
  sync(ctx)
}

/** Pointer down = hold, pointer up = release; Space, Z and A work the same way. */
export function bindInputs(ctx) {
  ctx.input = { pointer: false, keys: new Set() }
  bindPointer(ctx)
  bindKeyboard(ctx)
}
