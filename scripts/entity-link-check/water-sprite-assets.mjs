import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import zlib from 'node:zlib'

const root = new URL('../../', import.meta.url)
const manifest = JSON.parse(fs.readFileSync(new URL('data/water-icon-images.json', root)))
const expectedCounts = { small: 12, large: 33, bubble: 14 }
for (const entry of manifest.images) {
  const bytes = fs.readFileSync(new URL(`catalogue/${entry.image}`, root))
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), entry.sha256)
  const pixels = rgbaPixels(bytes)
  const opaque = pixels.filter((pixel) => pixel[3] === 255)
  assert.equal(opaque.length, expectedCounts[entry.class])
  assert.equal(opaque.length, entry.opaquePixels)
  assert(pixels.filter((pixel) => pixel[3] === 0).length > 500)
  const colors = new Set(opaque.map((pixel) => pixel.slice(0, 3).join(',')))
  assert.deepEqual([...colors], [entry.class === 'bubble' ? '246,246,246' : '156,157,139'])
}
assert(manifest.supersededEvidence.reason.includes('terrain'))
console.log(
  'Water sprite assets PASS: exact native glyph hashes, transparent backgrounds, distinct sizes and original palette colors',
)

function paeth(a, b, c) {
  const p = a + b - c
  const distances = [Math.abs(p - a), Math.abs(p - b), Math.abs(p - c)]
  return distances[0] <= distances[1] && distances[0] <= distances[2]
    ? a
    : distances[1] <= distances[2]
      ? b
      : c
}

function rgbaPixels(bytes) {
  assert.equal(bytes.readUInt32BE(16), 24)
  assert.equal(bytes.readUInt32BE(20), 24)
  assert.equal(bytes[24], 8)
  assert.equal(bytes[25], 6, 'Player icons must be RGBA, not terrain screenshots')
  let offset = 8
  const chunks = []
  while (offset < bytes.length) {
    const size = bytes.readUInt32BE(offset)
    if (bytes.toString('ascii', offset + 4, offset + 8) === 'IDAT')
      chunks.push(bytes.subarray(offset + 8, offset + 8 + size))
    offset += size + 12
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks))
  const result = Buffer.alloc(24 * 24 * 4)
  for (let y = 0; y < 24; y++) {
    const filter = raw[y * 97]
    assert(filter <= 4)
    for (let x = 0; x < 96; x++) {
      const index = y * 96 + x
      const a = x >= 4 ? result[index - 4] : 0
      const b = y ? result[index - 96] : 0
      const c = y && x >= 4 ? result[index - 100] : 0
      const predictor = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter]
      result[index] = (raw[y * 97 + x + 1] + predictor) & 255
    }
  }
  return Array.from({ length: 576 }, (_, index) => [...result.subarray(index * 4, index * 4 + 4)])
}
