export function bindNavigation(ctx) {
  ctx.updateNavigation()
  document.querySelector('.compendium-nav')?.addEventListener('pointerover', ctx.updateNavigation)
  document.querySelector('.compendium-nav')?.addEventListener('focusin', ctx.updateNavigation)
  document.querySelector('.compendium-nav')?.addEventListener('click', ctx.updateNavigation)
  ctx.openAnchor()
  window.addEventListener('hashchange', ctx.openAnchor)
}
