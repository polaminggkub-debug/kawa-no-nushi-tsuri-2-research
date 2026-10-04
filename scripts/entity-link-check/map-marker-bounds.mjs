import fs from 'node:fs'
import assert from 'node:assert/strict'
import {
  buildData,
  speciesRecord,
  addFishLocation,
  indexMapSections,
} from '../../src/pages/maps/fish-search.js'
import { mapGeometry, mapPinMarkup } from '../../src/pages/maps/map-render.js'
import { data, locations } from './shared.mjs'

const ctx = {
  lang: 'en',
  stages: {},
  zoom: 1,
  selectedFish: '',
  idNorm: (id) => String(id).toUpperCase().padStart(2, '0'),
  local: (entry) => entry?.en || '',
  esc: String,
  fishName: (id) => id,
  fishHref: (id) => `fish.html?id=${id}`,
}
ctx.speciesRecord = (...args) => speciesRecord(ctx, ...args)
ctx.addFishLocation = (...args) => addFishLocation(ctx, ...args)
ctx.indexMapSections = () => indexMapSections(ctx)
buildData(ctx, locations, data)
for (const lang of ['en', 'ja', 'th']) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const template = fs.readFileSync(
    new URL(`../../src/pages/maps/ui/maps${suffix}.html`, import.meta.url),
    'utf8',
  )
  const helper = template.indexOf('id="pin-help"')
  assert(helper > template.indexOf('class="map-zoom"'))
  assert(
    helper < template.indexOf('class="map-scroll"'),
    'Selected fish context is separated from the actual map',
  )
}
let checked = 0
for (const width of [252, 720]) {
  ctx.$ = () => ({ parentElement: { clientWidth: width } })
  for (const stage of Object.values(ctx.stages)) {
    for (const section of stage.sections.values()) {
      checkSection(stage, section, section.pins, '', width)
      for (const id of new Set(section.pins.flatMap((pin) => pin.fishIds))) {
        const pins = section.pins
          .filter((pin) => pin.fishIds.includes(id))
          .map((pin) => ({ ...pin, fishIds: [id] }))
        checkSection(stage, section, pins, id, width)
      }
    }
  }
}
console.log(
  `PASS: ${checked} map markers fit full thumbnail bounds on mobile/desktop without changing ROM coordinates or target links.`,
)

function checkSection(stage, section, pins, selected, width) {
  ctx.selectedFish = selected
  const geometry = mapGeometry(ctx, stage, section, pins)
  assert(geometry.viewW <= width + 0.5, `${section.key} exceeds fit width ${width}`)
  assert(geometry.viewH <= 621, `${section.key} exceeds fit height`)
  for (const pin of pins) {
    const html = mapPinMarkup(
      ctx,
      pin,
      geometry.originX,
      geometry.originY,
      geometry.scale,
      geometry.gutterLeft,
      geometry.gutterTop,
    )
    const match = html.match(/style="left:([\d.-]+)px;top:([\d.-]+)px"/)
    assert(match)
    const x = Number(match[1]),
      y = Number(match[2])
    assert(
      Math.abs(x - geometry.gutterLeft - (pin.x * 16 + 8 - geometry.originX) * geometry.scale) <
        1e-8,
    )
    assert(
      Math.abs(y - geometry.gutterTop - (pin.y * 16 + 8 - geometry.originY) * geometry.scale) <
        1e-8,
    )
    assert(html.includes(`data-x="${pin.x}" data-y="${pin.y}"`))
    const shared = pin.fishIds.length > 1
    const halfW = (selected ? 62 : shared ? 80 : 46) / 2
    const halfH = (selected ? 38 : 30) / 2
    assert(
      x - halfW >= -0.5 && x + halfW + (shared ? 8 : 0) <= geometry.viewW + 0.5,
      `${section.key} X clipping`,
    )
    assert(
      y - halfH - (shared ? 9 : 0) >= -0.5 && y + halfH <= geometry.viewH + 0.5,
      `${section.key} Y clipping`,
    )
    if (!shared) assert(html.includes(`href="fish.html?id=${pin.fishIds[0]}"`))
    else assert(html.includes(`data-pin="${pin.fishIds.join(',')}"`))
    checked += 1
  }
}
