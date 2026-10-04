/** Page-local state and explicit injected functions; no state shared between pages. */
export function createPageRuntime(api) {
  const runtime = {}
  for (const [name, value] of Object.entries(api)) {
    if (name !== 'initialize') runtime[name] = value.bind(null, runtime)
  }
  return runtime
}

export { targetAdvice, renderTargetAdvice } from './target-advice.js'
