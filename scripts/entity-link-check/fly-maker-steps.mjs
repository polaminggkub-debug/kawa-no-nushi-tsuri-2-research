import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, renderCatalogue, root, validate } from './shared.mjs'

const steps = JSON.parse(
  fs.readFileSync(path.join(root, 'data/fly-maker-player-steps.json'), 'utf8'),
)
const evidence = JSON.parse(fs.readFileSync(path.join(root, steps.source), 'utf8'))
assert.equal(steps.romSha256, evidence.capture_provenance.rom_sha256)
const crosswalk = JSON.parse(fs.readFileSync(path.join(root, steps.crosswalkSource), 'utf8'))
assert.equal(crosswalk.romSha256, steps.romSha256)
assert.equal(crosswalk.menuCrosswalk.tail[1].stored_component_id_hex, '00')
for (const recipe of crosswalk.recipes) {
  if (recipe.purchase_confirmed) {
    assert.equal(recipe.funds_before_yen - recipe.funds_after_yen, recipe.displayed_quote_yen)
    assert.equal(recipe.completed_fly_arrays.body_at_095E, recipe.recipe_hex.body)
    assert.equal(recipe.completed_fly_arrays.wing_at_09CE, recipe.recipe_hex.wing)
    assert.equal(recipe.completed_fly_arrays.tail_at_0A3E, recipe.recipe_hex.tail)
  }
}
assert.equal(crosswalk.recipes[2].displayed_quote_yen, 17)
assert.deepEqual(data.customizerFrames, steps.frames)
assert.equal(steps.frames.length, 9)
assert.equal(steps.frames[0].src, 'custom/rear-npc-dialogue-5.png')

for (const frame of steps.frames) {
  const name = path.basename(frame.src)
  const published = fs.readFileSync(path.join(root, 'catalogue', frame.src))
  const original = fs.readFileSync(path.join(root, 'references/items-images/customization', name))
  assert(published.equals(original), `Creator frame differs from original capture: ${name}`)
  for (const key of ['captionEn', 'captionJa', 'captionTh'])
    assert(frame[key]?.trim(), `Missing player instruction ${key}: ${name}`)
}

for (const locale of ['en', 'ja', 'th']) {
  const { nodes, url } = await renderCatalogue(locale, '?category=flymaker#fly-instructions')
  const html = nodes['customizer-frames']?.innerHTML || ''
  assert.equal((html.match(/class="custom-frame"/g) || []).length, steps.frames.length)
  assert(html.includes('rear-npc-dialogue-5.png'), 'Maker entry step missing from guide')
  assert(html.includes('25'), 'Observed order quote missing')
  assert(html.includes('17'), 'No-tail recipe quote missing')
  assert(html.includes('B02-tail-none-cursor.png'), 'Original None cursor capture missing')
  validate(html, url)
}
console.log(
  'PASS: nine actionable maker steps in three languages; original game captures preserved.',
)
