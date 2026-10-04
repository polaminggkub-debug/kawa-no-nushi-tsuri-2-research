export function setupLocale(ctx) {
  ctx.locale = document.documentElement.dataset.locale || 'en'
}
