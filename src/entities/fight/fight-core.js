// Arithmetic and random-number helpers that mirror the SNES routines the fight loop calls.
// All game variables are unsigned 16-bit words, exactly as stored in work RAM.

export const w16 = (value) => value & 0xffff
export const isNegative = (value) => (value & 0x8000) !== 0

/** 00:E408 - hardware divide: 16-bit dividend by the low byte of the divisor. */
export function hwDivide(dividend, divisor) {
  const d = divisor & 0xff
  if (d === 0) return { quotient: 0xffff, remainder: w16(dividend) }
  return { quotient: Math.floor(w16(dividend) / d), remainder: w16(dividend) % d }
}

/** 00:E3B3 - 16-bit by 8-bit multiply; callers keep the low 24 bits (product bytes 46..48). */
export const multiply16x8 = (a, b) => (w16(a) * (b & 0xff)) & 0xffffff

/**
 * The game's two random sources (RAM $16AE/$16B0/$16B2).
 * - tableByte(): 00:EDE9, counter += 1 then table[counter & 255]. The counter advances only when drawn.
 * - lfsr(): 00:EEFA, a small shift register that only the fight setup draws from.
 */
export function createGameRng(table, seed = {}) {
  const state = {
    index: w16(seed.index ?? 0),
    lfsrA: (seed.lfsrA ?? 0x7b) & 0xff,
    lfsrB: (seed.lfsrB ?? 0x34) & 0xff,
  }
  return {
    state,
    tableByte() {
      state.index = w16(state.index + 1)
      return table[state.index & 0xff]
    },
    lfsr() {
      let a = (state.lfsrB & 0x10) << 3
      a = ((a ^ state.lfsrB) & 0xff) << 1
      state.lfsrB = ((a & 0xff) | (a >> 8)) & 0xff
      state.lfsrA = (state.lfsrB + state.lfsrA) & 0xff
      return state.lfsrA
    },
    snapshot: () => ({ ...state }),
  }
}

/** 04:B437 - reel/run speed in distance steps per frame from a stamina or rest-timer value. */
export function speedStep(value) {
  if (value === 0) return 0
  if (value <= 5) return 1
  if (value <= 15) return 2
  if (value <= 30) return 3
  if (value <= 50) return 4
  if (value <= 75) return 5
  return 6
}

/** 04:8F6F - halve the fight-value base. */
export const halveBase = (value) => value >> 1
/** 04:8F77 - shift a one into the fight-value base (six-bit register). */
export const raiseBase = (value) => ((value << 1) | 1) & 0x3f
