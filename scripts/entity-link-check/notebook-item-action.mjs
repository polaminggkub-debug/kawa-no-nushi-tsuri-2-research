import assert from 'node:assert/strict'
import fs from 'node:fs'
import { notebookAction } from '../../src/pages/item/notebook.js'

for (const lang of ['en', 'ja', 'th']) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returned = `item${suffix}.html?category=general_tool&id=05&stage=3`
  const ctx = { lang, selectedStage: 3, currentLocalRoute: () => returned, esc: String }
  const html = notebookAction(ctx, { category: 'general_tool', id: '05' })
  const href = html.match(/href="([^"]+)"/)[1]
  const url = new URL(href, 'https://example.test/catalogue/')
  assert.equal(url.pathname, `/catalogue/maps${suffix}.html`)
  assert.equal(url.searchParams.get('stage'), '3')
  assert.equal(url.searchParams.get('return'), returned)
  assert.equal(url.hash, '#notebook-guide')
  assert.equal(notebookAction(ctx, { category: 'general_tool', id: '04' }), '')
  assert(
    fs
      .readFileSync(new URL(`../../src/pages/maps/ui/maps${suffix}.html`, import.meta.url), 'utf8')
      .includes('id="notebook-guide"'),
  )
}
console.log('Notebook item action PASS: localized area guide and exact return anchor')
