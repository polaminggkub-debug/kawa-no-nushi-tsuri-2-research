import assert from 'node:assert/strict'
import { questNextActions } from '../../src/pages/equipment/quest-next-actions.js'
for (const lang of ['en', 'ja', 'th']) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returned = `index${suffix}.html?category=general_tool&stage=3&return=${encodeURIComponent(`maps${suffix}.html?stage=3&fish=0C#notebook-guide`)}#catalogue`
  for (const stage of ['', '1', '3', '6']) {
    const ctx = {
      lang,
      locationStage: stage,
      sourceReturn: () => returned,
      detailFile: (page) => `${page}${suffix}.html`,
      esc: String,
    }
    const html = questNextActions(ctx, { category: 'general_tool', id: '05' })
    assert(html.includes('data-notebook-item-action'))
    const href = html.match(/href="([^"]+)"/)[1]
    const target = new URL(href, 'https://example.test/catalogue/')
    assert.equal(target.pathname, `/catalogue/maps${suffix}.html`)
    assert.equal(target.searchParams.get('stage'), stage || '1')
    assert.equal(target.searchParams.get('return'), returned)
    assert.equal(target.hash, '#notebook-guide')
    assert.equal(questNextActions(ctx, { category: 'general_tool', id: '04' }), '')
    assert.equal(questNextActions(ctx, { category: 'rod', id: '05' }), '')
  }
}
console.log(
  'PASS: notebook catalogue card opens the current area checklist in 3 languages with full nested return; no action on unrelated items.',
)
