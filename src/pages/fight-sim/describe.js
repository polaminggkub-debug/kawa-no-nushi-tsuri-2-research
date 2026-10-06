import { seconds } from './format.js'

/** A policy spec in plain words: the steps a player follows, as a list of sentences. */
export function describePolicy(spec, text) {
  const words = text.policy
  const frames = (value) => seconds(value)
  const lines = [words.rest(spec.wait ? frames(spec.wait) : 0), words.hold]
  lines.push(words.release(spec.stop ?? 0, spec.slow ?? 0, frames(spec.stop ?? 0)))
  if (spec.cap) lines.push(words.cap(frames(spec.cap)))
  if (spec.first && spec.first < 12) lines.push(words.first(frames(spec.first)))
  lines.push(spec.taps ? words.taps(frames(spec.tapEvery)) : words.run)
  return lines
}
