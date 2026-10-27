// The fight-start rule at the hook (04:8D2A..8EC1), as proven in docs/gear-fish-matrix.md.
// A notch is 0 (easiest) to 6 (hardest); every step floors at 0 and caps at 6.

export const BAND_SIZE = [15, 35, 36]
export const BAND_OF = (size) => (size <= 15 ? 0 : size <= 35 ? 1 : 2)

const easier = (n) => Math.max(0, n - 1)
const harder = (n) => Math.min(6, n + 1)
// Selector against the size band: -1 easier, 0 nothing, +1 harder.
const SELECTOR = { 0: [-1, 0, 1], 1: [0, -1, 0], 2: [1, 0, -1] }
// Rod size penalty in notches harder, by rod class and size band.
const PENALTY = { 0: [0, 1, 2], 1: [1, 0, 1], 2: [2, 1, 0] }
const CLASS_STEP = { 0: -1, 1: 0, 2: 1 }

const step = (n, delta) => (delta < 0 ? easier(n) : delta > 0 ? harder(n) : n)

/** The method step: `named` is true when the bait/hook (float) or lure is named for the fish. */
function methodStep(n, named, selector, band) {
  if (named) return easier(n)
  return step(n, (SELECTOR[selector] ?? [0, 0, 0])[band])
}

/**
 * Start notch of one hook. `kit` = { rod, named, selector }: the rod row, whether the item
 * that counts is named for the fish, and the selector of the hook, lure or fly body.
 */
export function startNotch(fish, band, kit) {
  let n = step(fish.baseNotch, CLASS_STEP[kit.rod.class])
  n = methodStep(n, kit.named, kit.selector, band)
  if (kit.rod.match !== fish.id)
    for (let i = 0; i < PENALTY[kit.rod.class][band]; i++) n = harder(n)
  return n
}
