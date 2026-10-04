import assert from 'node:assert/strict'
import { updateUrl } from '../../src/pages/maps/fish-search.js'

const previous = { location: globalThis.location, history: globalThis.history }
try {
  for (const lang of ['en', 'ja', 'th']) {
    for (const hash of ['#map-view', '#notebook-guide']) checkAnchor(lang, hash)
  }
} finally {
  for (const [key, value] of Object.entries(previous)) {
    if (value === undefined) delete globalThis[key]
    else globalThis[key] = value
  }
}
console.log(
  'PASS: map and notebook destination anchors survive map-state URL updates in all locales.',
)

function checkAnchor(lang, hash) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returned = `maps${suffix}.html?stage=4#notebook-guide`
  globalThis.location = { pathname: `/catalogue/maps${suffix}.html`, hash }
  let result
  globalThis.history = {
    replaceState: (_state, _title, url) => {
      result = new URL(url, 'https://example.test')
    },
  }
  updateUrl({
    activeStage: 4,
    selectedFish: '15',
    activeSection: 's4-c2-r2',
    listScope: 'area',
    returnPath: returned,
    openNotebookGuide: hash === '#notebook-guide',
    updateLanguageLinks() {},
  })
  assert.equal(result.hash, hash)
  assert.equal(result.searchParams.get('stage'), '4')
  assert.equal(result.searchParams.get('fish'), '15')
  assert.equal(result.searchParams.get('section'), 's4-c2-r2')
  assert.equal(result.searchParams.get('return'), returned)
}
