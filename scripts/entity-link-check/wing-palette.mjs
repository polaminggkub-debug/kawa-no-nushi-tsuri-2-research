import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { data, renderCatalogue, root, unescapeHtml, validate } from './shared.mjs'

const palette = JSON.parse(
  fs.readFileSync(path.join(root, 'data/fly-maker-wing-palette.json'), 'utf8'),
)
const columns = [
  ['09', '0A', '0B', '0C'],
  ['0D', '0E', '0F', '10'],
  ['11', '12', '1F', '20'],
  ['21', '22', '23', '24'],
]
assert.equal(palette.romSha256, 'e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49')
assert.deepEqual(data.flyMakerWingPalette, palette)
assert.equal(palette.positions.length, 16)
assert.equal(new Set(palette.positions.map((entry) => `${entry.column}:${entry.row}`)).size, 16)
for (const entry of palette.positions)
  assert.equal(entry.wingId, columns[entry.column - 1]?.[entry.row - 1])
const screenshot = fs.readFileSync(path.join(root, 'catalogue', palette.screenshot.path))
const hash = crypto.createHash('sha256').update(screenshot).digest('hex')
assert.equal(hash, '30859d8aaa694659ae2957cbbcc2dbfbbc36abc3a4ea2dc462368913ac8f4180')
assert.equal(hash, palette.screenshot.sha256)
assert.equal(screenshot.readUInt32BE(16), 256)
assert.equal(screenshot.readUInt32BE(20), 224)
for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)
console.log(
  'PASS: 16 verified Mayfly wing positions, native menu image and localized component links with context.',
)

async function checkLocale(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returned = `maps${suffix}.html?stage=1&fish=01#notebook-guide`
  const { nodes, url } = await renderCatalogue(
    lang,
    `?category=flymaker&fish=01&stage=1&return=${encodeURIComponent(returned)}#fly-instructions`,
  )
  const html = nodes['customizer-frames']?.innerHTML || ''
  validate(html, url)
  assert(html.includes(palette.screenshot.path))
  const links = [...html.matchAll(/href="([^"]+)"/g)]
    .map((match) => new URL(unescapeHtml(match[1]), url))
    .filter((target) => target.searchParams.get('category') === 'fly_wing')
  assert.equal(links.length, 16)
  assert.deepEqual(
    links.map((target) => target.searchParams.get('id')).sort(),
    palette.positions.map((entry) => entry.wingId).sort(),
  )
  for (const target of links) {
    assert(target.pathname.endsWith(`/item${suffix}.html`))
    assert.equal(target.searchParams.get('fish'), '01')
    assert.equal(target.searchParams.get('stage'), '1')
    const back = new URL(target.searchParams.get('return'), url)
    assert.equal(back.hash, '#wing-palette-title')
    assert.equal(back.searchParams.get('return'), returned)
  }
}
