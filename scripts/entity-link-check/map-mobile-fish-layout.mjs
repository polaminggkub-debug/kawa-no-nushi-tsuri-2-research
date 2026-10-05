import assert from 'node:assert/strict'
import postcss from 'postcss'
import { renderFrontendOutputs } from '../build_frontend.mjs'

const outputs = await renderFrontendOutputs()
const css = outputs.get('catalogue/maps.css')
assert(css, 'Compiled map stylesheet is missing')
const stylesheet = postcss.parse(css)
for (const width of [320, 390, 620]) checkViewport(width)

function checkViewport(width) {
  expectRule(
    '.map-browser .fish-list',
    'grid-template-columns',
    'minmax(0, 1fr)',
    width,
    'Fish list must remain one column',
  )
  expectRule(
    '.map-browser .fish-choice-row',
    'grid-template-columns',
    '76px minmax(0, 1fr)',
    width,
    'Fish portrait and text need a flexible second column',
  )
  expectRule('.map-browser .fish-portrait-link img', 'width', '76px', width, 'Portrait width')
}

function expectRule(selector, property, expected, width, message) {
  const actual = lastValue(stylesheet, selector, property, width)
  assert.equal(actual, expected, `${width}px: ${message}; got ${actual || 'no applicable rule'}`)
}

function lastValue(root, selector, property, width) {
  let value = ''
  root.walkRules((rule) => {
    if (
      !rule.selector
        .split(',')
        .map((part) => part.trim())
        .includes(selector)
    )
      return
    if (!appliesAtWidth(rule, width)) return
    for (const declaration of rule.nodes || [])
      if (declaration.type === 'decl' && declaration.prop === property) value = declaration.value
  })
  return value.replace(/\s+/g, ' ').trim()
}

function appliesAtWidth(rule, width) {
  let parent = rule.parent
  while (parent && parent.type !== 'root') {
    if (parent.type === 'atrule' && parent.name === 'media' && !mediaApplies(parent.params, width))
      return false
    parent = parent.parent
  }
  return true
}

function mediaApplies(query, width) {
  const max = /max-width\s*:\s*(\d+(?:\.\d+)?)px/i.exec(query)?.[1]
  const min = /min-width\s*:\s*(\d+(?:\.\d+)?)px/i.exec(query)?.[1]
  return (!max || width <= Number(max)) && (!min || width >= Number(min))
}

console.log(
  'PASS: compiled map CSS keeps the fish list single-column and preserves a flexible portrait-plus-text row at 320, 390, and 620 px.',
)
