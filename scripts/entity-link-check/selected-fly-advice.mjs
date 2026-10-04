import assert from 'node:assert/strict'
import { data, locations, render, unescapeHtml, validate } from './shared.mjs'

let cases = 0
for (const lang of ['en', 'ja', 'th']) {
  for (const category of ['fly', 'fly_wing', 'fly_tail']) {
    for (const fish of ['01', '06', '3B']) {
      const item = data.items.find((entry) => entry.category === category)
      const result = await render(
        'item',
        lang,
        `category=${category}&id=${item.id}&fish=${fish}&stage=1`,
      )
      const html = unescapeHtml(result.html)
      const panel = html.split('id="what-to-do"')[1].split('</section>')[0]
      assert(panel.includes(`data-fly-target-advice="${fish}"`))
      const link = panel.match(/data-fly-starter-link href="([^"]+)"/)
      assert(link, 'Missing selected-fish starter action')
      const url = new URL(link[1], result.url)
      assert.equal(url.searchParams.get('id'), fish)
      assert.equal(url.hash, '#starter-fly')
      const recorded = locations.fish[fish].locations
      const expected = recorded.find((entry) => Number(entry.stage) === 1) || recorded[0]
      if (expected) assert.equal(url.searchParams.get('stage'), String(expected.stage))
      const back = new URL(url.searchParams.get('return'), result.url)
      assert.equal(back.searchParams.get('category'), category)
      assert.equal(back.searchParams.get('id'), item.id)
      assert.equal(back.searchParams.get('fish'), fish)
      assert.equal(back.searchParams.get('stage'), '1')
      assert(!panel.includes('If you have not picked a target fish'))
      assert(!panel.includes('ถ้ายังไม่ได้เลือกปลา'))
      validate(panel, result.url)
      cases += 1
    }
    const item = data.items.find((entry) => entry.category === category)
    const result = await render('item', lang, `category=${category}&id=${item.id}`)
    assert(!result.html.includes('data-fly-target-advice'))
  }
}
console.log(
  `PASS: ${cases} selected-fish fly body/wing/tail profiles link to localized starter sets and retain the exact item return.`,
)
