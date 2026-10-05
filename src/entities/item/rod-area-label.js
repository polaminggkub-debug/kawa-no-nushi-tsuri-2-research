import { rodAreaCopy } from './rod-area-copy.js'

const AIM_STYLES = [2, 4]

function text(lang, type, key, values) {
  return rodAreaCopy(lang, type, key, values)
}

function offerPrice(lang, price) {
  return lang === 'ja' ? `${price}円` : `¥${price}`
}

function aimCondition(lang, item) {
  if (!AIM_STYLES.includes(Number(item.decodedFields?.styleCode))) return ''
  return lang === 'th'
    ? ' (HP 100 ใช้กับเวลาเล็งเท่านั้น)'
    : lang === 'ja'
      ? '（HP100は照準値のみ）'
      : ' (HP 100 applies to aim only)'
}

function leader(choices, field) {
  const values = choices.map((choice) => choice[field])
  const value = field === 'price' ? Math.min(...values) : Math.max(...values)
  return choices.find((choice) => choice[field] === value)
}

function tradeoffNeighbors(candidate, choices) {
  const lower = choices
    .filter((choice) => choice.price < candidate.price)
    .sort((a, b) => b.price - a.price || a.id.localeCompare(b.id))[0]
  const higher = choices
    .filter((choice) => choice.price > candidate.price)
    .sort((a, b) => a.price - b.price || a.id.localeCompare(b.id))[0]
  return { lower, higher }
}

function relationCopy(lang, key) {
  const names = ['id', 'benefits', 'price', 'comparison', 'hpNote']
  const placeholders = Object.fromEntries(names.map((name) => [name, `%%${name}%%`]))
  return Object.entries(placeholders).reduce(
    (copy, [name, marker]) => copy.replaceAll(marker, `{${name}}`),
    text(lang, 'comparison', key, placeholders),
  )
}

export function tradeoffDescription(lang, subject, other) {
  const aimKey = subject.aim > other.aim ? 'aimMore' : subject.aim < other.aim ? 'aimLess' : ''
  const boundaryKey =
    subject.boundary > other.boundary
      ? 'boundaryMore'
      : subject.boundary < other.boundary
        ? 'boundaryLess'
        : ''
  const keys = [aimKey, boundaryKey].filter(Boolean)
  const phrases = keys.map((key) => relationCopy(lang, key).replace('{id}', other.id))
  const opposing =
    keys.length === 2 && subject.aim > other.aim !== subject.boundary > other.boundary
  const joiner = opposing ? relationCopy(lang, 'but') : relationCopy(lang, 'and')
  return relationCopy(lang, 'versus').replace('{benefits}', phrases.join(joiner))
}

export function higherPriceDescription(lang, subject, other) {
  return relationCopy(lang, 'higherPrice')
    .replace('{id}', subject.id)
    .replace('{price}', offerPrice(lang, subject.price))
    .replace('{comparison}', tradeoffDescription(lang, subject, other))
    .replace('{hpNote}', aimCondition(lang, subject.item))
}

export function boundaryPeerContext(choices, maximum) {
  const peers = choices.filter((choice) => choice.boundary === maximum)
  if (peers.length < 2) return null
  return { cheapest: leader(peers, 'price'), aimLeader: leader(peers, 'aim') }
}

export function dominatedReason(lang, candidate, better) {
  const keys = [better.price < candidate.price ? 'cheaper' : 'samePrice']
  if (better.aim > candidate.aim) keys.push('aimMoreAny')
  if (better.boundary > candidate.boundary) keys.push('boundaryMoreAny')
  return keys
    .map((key) => relationCopy(lang, key).replace('{id}', candidate.id))
    .join(relationCopy(lang, 'and'))
}

function valuesFor(lang, candidate, stage, better) {
  return {
    stage,
    area: text(lang, 'recommendation', 'area', { stage }),
    id: candidate.id,
    otherId: better?.id || '',
    price: offerPrice(lang, candidate.price),
    aim: candidate.aim,
    hpNote: aimCondition(lang, candidate.item),
  }
}

function areaLeaderLabel(lang, status, candidate, choices, values) {
  if (status === 'aim') {
    const budget = leader(choices, 'price')
    if (budget.id !== candidate.id) {
      return text(lang, 'labels', 'aimChoice', {
        ...values,
        comparison: tradeoffDescription(lang, candidate, budget),
      })
    }
  }
  if (status === 'boundary') {
    const maximum = Math.max(...choices.map((choice) => choice.boundary))
    const peer = boundaryPeerContext(choices, maximum)
    if (peer?.cheapest.id === candidate.id && peer.aimLeader.id !== candidate.id) {
      return text(lang, 'labels', 'boundaryPeerCheapest', values)
    }
    if (peer?.aimLeader.id === candidate.id && peer.cheapest.id !== candidate.id) {
      return text(lang, 'labels', 'boundaryPeerAim', {
        ...values,
        otherId: peer.cheapest.id,
      })
    }
  }
  return ''
}

function tradeoffLabel(lang, candidate, choices, values) {
  const { lower, higher } = tradeoffNeighbors(candidate, choices)
  const other = lower || leader(choices, 'price')
  const key = higher ? 'tradeoff' : 'tradeoffFallback'
  return text(lang, 'labels', key, {
    ...values,
    lowerId: other.id,
    comparison: tradeoffDescription(lang, candidate, other),
  })
}

export function areaRodLabel(lang, status, candidate, choices, stage, better) {
  const values = valuesFor(lang, candidate, stage, better)
  if (status === 'dominated') {
    return text(lang, 'labels', status, {
      ...values,
      betterReason: dominatedReason(lang, candidate, better),
    })
  }
  const leaderLabel = areaLeaderLabel(lang, status, candidate, choices, values)
  if (leaderLabel) return leaderLabel
  if (status !== 'tradeoff') return text(lang, 'labels', status, values)
  return tradeoffLabel(lang, candidate, choices, values)
}
