export function setupTopicNavigation() {
  if (typeof location !== 'undefined' && location.hash === '#technical-evidence')
    document.getElementById('technical-evidence').open = true
  document.getElementById('strategy-topics')?.addEventListener('click', (event) => {
    if (event.target.closest('a')?.getAttribute('href') === '#technical-evidence')
      document.getElementById('technical-evidence').open = true
  })
}
