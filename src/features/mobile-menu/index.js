const label = { th: 'เมนู', ja: 'メニュー', en: 'Menu' }

/** On a phone the seven page links fold behind one menu button, so the sticky bar stays small. */
export function mountMobileMenu(nav) {
  const links = nav?.querySelector('.compendium-links')
  if (!links || nav.querySelector('.menu-toggle')) return
  const lang = document.documentElement.lang.slice(0, 2)
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'menu-toggle'
  button.setAttribute('aria-expanded', 'false')
  button.setAttribute('aria-controls', 'compendium-links')
  button.textContent = `☰ ${label[lang] || label.en}`
  links.id ||= 'compendium-links'
  nav.querySelector('.compendium-brand').after(button)
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open')
    button.setAttribute('aria-expanded', String(open))
  })
  links.addEventListener('click', () => nav.classList.remove('menu-open'))
}
