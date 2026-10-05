const PREFERRED_PAIR_ORDER = new Map([
  ['2E+23', 0],
  ['17+24', 1],
  ['17+23', 2],
])

function luresWithFishProfiles(items) {
  return items.filter(
    (item) => item.category === 'lure' && (item.playerUse?.fishIds || []).length > 0,
  )
}

function expectedFishIds(lures) {
  return new Set(lures.flatMap((item) => item.playerUse.fishIds || []))
}

function pairItems(first, second) {
  return [first, second].sort((a, b) => {
    const maskA = Number.parseInt(a.decodedFields?.fishHookGateMaskHex || '0', 16)
    const maskB = Number.parseInt(b.decodedFields?.fishHookGateMaskHex || '0', 16)
    return maskB - maskA || a.id.localeCompare(b.id)
  })
}

function pairKey(items) {
  return items.map((item) => item.id).join('+')
}

function isFullCoverage(items, expected) {
  const covered = new Set(items.flatMap((item) => item.playerUse.fishIds || []))
  return covered.size === expected.size && [...expected].every((id) => covered.has(id))
}

function makePair(items, coverageCount) {
  const orderedItems = pairItems(...items)
  return {
    items: orderedItems,
    key: pairKey(orderedItems),
    totalYen: orderedItems.reduce((sum, item) => sum + Number(item.priceYen), 0),
    coverageCount,
  }
}

function pairOrder(first, second) {
  const priceDifference = first.totalYen - second.totalYen
  if (priceDifference) return priceDifference
  const firstPreference = PREFERRED_PAIR_ORDER.get(first.key) ?? Infinity
  const secondPreference = PREFERRED_PAIR_ORDER.get(second.key) ?? Infinity
  return firstPreference - secondPreference || first.key.localeCompare(second.key)
}

export function lureCoverageOptions(items) {
  const lures = luresWithFishProfiles(items)
  const expected = expectedFishIds(lures)
  const pairs = []
  for (let first = 0; first < lures.length; first += 1) {
    for (let second = first + 1; second < lures.length; second += 1) {
      const pair = pairItems(lures[first], lures[second])
      if (pair.every((item) => Number.isFinite(item.priceYen)) && isFullCoverage(pair, expected))
        pairs.push(makePair(pair, expected.size))
    }
  }
  return { coverageCount: expected.size, pairs: pairs.sort(pairOrder) }
}

function stockedInArea(item, stage) {
  return (item.playerUse?.shops || []).some(
    (shop) => Number(shop.stage) === stage && !shop.condition,
  )
}

export function lureCoverageForArea(options, stage) {
  const area = Number(stage)
  const localPairs =
    Number.isInteger(area) && area >= 1 && area <= 6
      ? options.pairs.filter((pair) => pair.items.every((item) => stockedInArea(item, area)))
      : []
  return {
    stage: area,
    coverageCount: options.coverageCount,
    localPairs,
    pair: localPairs[0] || options.pairs[0] || null,
    isLocal: localPairs.length > 0,
  }
}

export function lureCoverageByArea(options) {
  return [1, 2, 3, 4, 5, 6].map((stage) => lureCoverageForArea(options, stage))
}
