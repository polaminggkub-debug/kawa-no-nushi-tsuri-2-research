import assert from 'node:assert/strict'
import { renderCatalogue, unescapeHtml, validate } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) {
  for (const fish of ['15', '1A']) await checkFallback(lang, fish)
}
console.log(
  'PASS: fish without compatible lure/fly offers have a supported-setup action, not a lure dead end.',
)

async function checkFallback(lang, fish) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returned = `maps${suffix}.html?stage=4#notebook-guide`
  const { runtime, url } = await renderCatalogue(
    lang,
    `?category=all&fish=${fish}&stage=4&return=${encodeURIComponent(returned)}`,
  )
  const html = runtime.flyDecision('all')
  validate(html, url)
  assert(html.includes(`data-fly-fallback="${fish}"`))
  assert(!/bait or lure|เหยื่อจริงหรือลัวร์|エサ・ルアー/.test(html))
  const raw = html.match(/data-fly-fallback="[^"]+" href="([^"]+)"/)?.[1]
  assert(raw)
  const target = new URL(unescapeHtml(raw), url)
  assert(target.pathname.endsWith(`/fish${suffix}.html`))
  assert.equal(target.searchParams.get('id'), fish)
  assert.equal(target.searchParams.get('stage'), '4')
  const back = new URL(target.searchParams.get('return'), url)
  assert.equal(back.searchParams.get('return'), returned)
}
