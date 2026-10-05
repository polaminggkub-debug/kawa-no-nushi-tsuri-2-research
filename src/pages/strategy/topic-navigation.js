import { preserveResearchLanguageState } from './search-return.js'

export function setupTopicNavigation() {
  if (
    typeof location !== 'undefined' &&
    (location.hash === '#technical-evidence' || new URLSearchParams(location.search).get('q'))
  )
    document.getElementById('technical-evidence').open = true
  document.getElementById('strategy-topics')?.addEventListener('click', (event) => {
    if (event.target.closest('a')?.getAttribute('href') === '#technical-evidence')
      document.getElementById('technical-evidence').open = true
  })
  document
    .querySelector('.strategy-languages')
    ?.addEventListener('click', preserveResearchLanguageState)
}
