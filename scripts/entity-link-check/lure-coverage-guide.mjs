import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { root, renderCatalogue, validate } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)

console.log(
  'PASS: lure kit illustration link remains available exactly once as categories and fish filters change in EN/JA/TH.',
)

async function checkLocale(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const staticPage = fs.readFileSync(path.join(root, `catalogue/index${suffix}.html`), 'utf8')
  const href = staticPage.match(/id="kit-link" href="([^"]+)"/)?.[1]
  assert.equal(href, `../research/index${suffix}.html`, `Wrong localized kit destination (${lang})`)
  const result = await renderCatalogue(lang, '?category=rod#catalogue')
  result.nodes['kit-link'].href = href

  const all = renderState(result, 'all')
  assertCanonicalLureLink(all, href, result.url)
  checkRejectionProbes(all, href, result.url)
  const lure = renderState(result, 'lure')
  assertCanonicalLureLink(lure, href, result.url)
  const other = renderState(result, 'rod')
  assert.equal(other.kitHidden, false, `Other category hid the generic kit (${lang})`)
  assert.equal(other.coverageCards, 0)
  assert.equal(other.genericHref, href)

  for (const category of ['all', 'lure']) {
    const targeted = renderState(result, category, '06')
    assert.equal(targeted.kitHidden, true, `Fish-targeted view should hide generic kit (${lang})`)
    assert.equal(targeted.coverageCards, 0)
    assert.equal(targeted.guideLinks, 0)
  }
}

function checkRejectionProbes(state, href, base) {
  const linkMarkup = state.html.match(
    /<p><a class="route-button" data-lure-coverage-guide[\s\S]*?<\/a><\/p>/,
  )?.[0]
  assert(linkMarkup, 'Lure guide test fixture did not contain a complete link')
  const rejectedLink = (error) =>
    error.code === 'ERR_ASSERTION' && error.message.includes('lost or duplicated')
  assert.throws(
    () =>
      assertCanonicalLureLink({ ...state, html: state.html.replace(linkMarkup, '') }, href, base),
    rejectedLink,
  )
  assert.throws(
    () => assertCanonicalLureLink({ ...state, html: `${state.html}${linkMarkup}` }, href, base),
    rejectedLink,
  )
  assert.throws(
    () => assertCanonicalLureLink({ ...state, kitHidden: false }, href, base),
    (error) => error.code === 'ERR_ASSERTION' && error.message.includes('should hide'),
  )
}

function renderState(result, category, fish = '') {
  result.nodes['category-filter'].value = category
  result.nodes['fish-filter'].value = fish
  result.runtime.renderCards()
  const html = result.nodes['category-decisions'].innerHTML
  return {
    html,
    kitHidden: result.nodes['generic-lure-kit'].hidden,
    genericHref: result.nodes['kit-link'].href,
    coverageCards: (html.match(/data-lure-coverage-pair/g) || []).length,
    guideLinks: (html.match(/data-lure-coverage-guide/g) || []).length,
  }
}

function assertCanonicalLureLink(state, href, base) {
  const coverageCards = (state.html.match(/data-lure-coverage-pair/g) || []).length
  const guideLinks = (state.html.match(/data-lure-coverage-guide/g) || []).length
  assert.equal(
    state.kitHidden,
    true,
    'Inline kit should hide when the canonical lure card is shown',
  )
  assert.equal(coverageCards, 1, 'Expected one canonical lure coverage card')
  assert.equal(guideLinks, 1, 'Canonical lure card lost or duplicated its illustrated-kit link')
  assert(
    state.html.indexOf('data-lure-coverage-pair') < state.html.indexOf('data-lure-coverage-guide'),
  )
  const match = state.html.match(/data-lure-coverage-guide href="([^"]+)"/)
  assert.equal(match?.[1], href)
  const target = new URL(match[1], base)
  assert(
    target.pathname.endsWith(
      `/research/index${base.pathname.includes('.th.html') ? '.th' : base.pathname.includes('.ja.html') ? '.ja' : ''}.html`,
    ),
  )
  validate(state.html, base)
}
