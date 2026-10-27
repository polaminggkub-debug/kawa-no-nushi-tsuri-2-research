const SELECTOR = 'main p, main li, main small'
const MIN_LENGTH = 40

function markRepeats(root) {
  const seen = new Set()
  for (const node of root.querySelectorAll(SELECTOR)) {
    if (node.children.length || node.closest('.cards')) continue
    const text = node.textContent.replace(/\s+/g, ' ').trim()
    if (text.length < MIN_LENGTH) continue
    if (seen.has(text)) node.dataset.repeat = 'true'
    else seen.add(text)
  }
}

/** The item grid is left alone: each card must stand on its own. A long technical sentence is shown once per page; later copies are hidden, not deleted. */
export function quietRepeats(main) {
  if (!main || typeof MutationObserver === 'undefined') return
  let timer = 0
  const run = () => {
    timer = 0
    markRepeats(main)
  }
  new MutationObserver(() => {
    if (!timer) timer = setTimeout(run, 150)
  }).observe(main, { childList: true, subtree: true })
  run()
}
