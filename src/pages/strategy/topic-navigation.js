export function setupTopicNavigation() {
  if (typeof location !== 'undefined' && location.hash === '#technical-evidence')
    document.getElementById('technical-evidence').open = true
  document.getElementById('strategy-topics')?.addEventListener('click', (event) => {
    if (event.target.closest('a')?.getAttribute('href') === '#technical-evidence')
      document.getElementById('technical-evidence').open = true
  })
  document.querySelector('.strategy-languages')?.addEventListener('click', preserveLanguageTopic)
}

function preserveLanguageTopic(event) {
  const link = event.target.closest?.('a[href]')
  if (!link || !location.hash) return
  const target = new URL(link.href, location.href)
  target.hash = location.hash
  link.href = target.href
}
