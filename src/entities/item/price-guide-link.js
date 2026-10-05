const GUIDE_CATEGORIES = new Set(['float_weight', 'hook'])

export function categoryGuideLink({ lang, category, fish, stage, route, returnPath } = {}) {
  if (!GUIDE_CATEGORIES.has(category)) return ''
  const locale = ['th', 'ja'].includes(lang) ? lang : 'en'
  const query = new URLSearchParams({ category })
  if (/^[\da-f]{2}$/i.test(String(fish || ''))) query.set('fish', fish.toUpperCase())
  if (/^[1-6]$/.test(String(stage || ''))) query.set('stage', String(stage))
  if (['float', 'sinker'].includes(route)) query.set('route', route)
  if (typeof returnPath === 'string' && returnPath) query.set('return', returnPath)
  return `index${locale === 'en' ? '' : `.${locale}`}.html?${query}#category-decisions`
}
