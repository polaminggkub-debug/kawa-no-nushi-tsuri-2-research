const source = (file, field) => ({ file: `data/${file}.json`, field })
const item = (category, id, stage, hash = 'use-locations') => ({
  label: `${category}:${id}`,
  type: 'item',
  category,
  id,
  stage,
  hash,
})
const fish = (id, stage) => ({ label: `fish:${id}`, type: 'fish', id, stage })
const map = (stage, params) => ({
  label: stage === 1 ? 'eel-village' : 'eel-target',
  type: 'map',
  stage,
  hash: 'map-view',
  params,
})
const key = (stage) => item('general_tool', '17', stage, 'item-shops')

export const transactions = [
  {
    id: 'potato-chest',
    stage: 1,
    kind: 'chest',
    links: [item('bait', '11', 1), key(1)],
    evidence: [
      source('town-item-acquisition', 'items["bait:11"][0]'),
      source('quest-tool-use', 'items["17"].rawTrace.chests[0]'),
      source('shop-stock-rom', 'items["general_tool:17"]'),
      source('quest-tool-use', 'items["17"].record'),
    ],
  },
  {
    id: 'hariyo-tub',
    stage: 2,
    kind: 'exchange',
    links: [fish('22', 2), item('general_tool', '01', 2)],
    evidence: [
      source('tub-acquisition', 'npc'),
      source('tub-acquisition', 'exchange'),
      source('tub-acquisition', 'runtimeChecks'),
    ],
  },
  {
    id: 'waxworm-chest',
    stage: 2,
    kind: 'chest',
    links: [item('bait', '0B', 2), key(2)],
    evidence: [
      source('town-item-acquisition', 'items["bait:0B"][0]'),
      source('quest-tool-use', 'items["17"].rawTrace.chests[1]'),
      source('shop-stock-rom', 'items["general_tool:17"]'),
      source('quest-tool-use', 'items["17"].record'),
    ],
  },
  {
    id: 'milk-canoe',
    stage: 3,
    kind: 'exchange',
    links: [
      item('general_tool', '0F', 3),
      item('general_tool', '10', 3),
      item('general_tool', '02', 3),
    ],
    evidence: [
      source('town-item-acquisition', 'items["general_tool:0F"][0]'),
      source('quest-tool-use', 'items["0F"].rawTrace.cowExchange'),
      source('quest-tool-use', 'items["10"].rawTrace.canoeExchange'),
    ],
  },
  {
    id: 'yamanokami-daikon',
    stage: 3,
    kind: 'exchange',
    links: [fish('18', 3), item('food', '07', 3)],
    evidence: [
      source('daikon-acquisition', 'npc'),
      source('daikon-acquisition', 'exchange'),
      source('daikon-acquisition', 'runtimeChecks'),
    ],
  },
  {
    id: 'small-lure-rod-chest',
    stage: 4,
    kind: 'chest',
    links: [item('rod', '0A', 4), key(4)],
    evidence: [
      source('town-item-acquisition', 'items["rod:0A"][0]'),
      source('quest-tool-use', 'items["17"].rawTrace.chests[2]'),
      source('shop-stock-rom', 'items["general_tool:17"]'),
      source('quest-tool-use', 'items["17"].record'),
    ],
  },
  {
    id: 'fox-fireworks',
    stage: 4,
    kind: 'story',
    links: [item('general_tool', '16', 4), item('general_tool', '15', 4)],
    evidence: [
      source('quest-tool-use', 'items["16"].rawTrace.fieldEvent'),
      source('quest-tool-use', 'items["16"].rawTrace.tofuNpcFoxEvent'),
      source('quest-tool-use', 'items["16"].rawTrace.hintNpc'),
    ],
  },
  {
    id: 'lottery',
    stage: 5,
    kind: 'optional',
    links: [
      item('general_tool', '11', 5),
      item('food', '06', 5, 'what-to-do'),
      item('food', '07', 5, 'what-to-do'),
    ],
    evidence: [
      source('town-item-acquisition', 'items["general_tool:11"][0]'),
      source('quest-tool-use', 'items["11"].rawTrace.foodOffering'),
      source('quest-tool-use', 'items["11"].rawTrace.ticketCheckAndDraw'),
      source('quest-tool-use', 'items["11"].rawTrace.lotteryXY'),
    ],
  },
  {
    id: 'candle-reunion',
    stage: 6,
    kind: 'story',
    links: [item('general_tool', '12', 6), key(6)],
    evidence: [
      source('town-item-acquisition', 'items["general_tool:12"][0]'),
      source('quest-tool-use', 'items["12"].rawTrace.keyChest'),
      source('quest-tool-use', 'items["12"].rawTrace.eventConsumer'),
      source('shop-stock-rom', 'items["general_tool:17"]'),
      source('quest-tool-use', 'items["17"].record'),
    ],
  },
]

const eelLinks = [
  item('general_tool', '06', 6, 'what-to-do'),
  fish('3B', 6),
  map(6, { section: 's6-c2-r1', fish: '3B' }),
  map(1, { section: 's1-c1-r8', action: 'eel-return' }),
]
const eelEvidence = [
  source('quest-tool-use', 'items["06"].rawTrace.eelEndingEvidence'),
  source('magnet-story-gate', 'area6MagnetTarget'),
  source('magnet-story-gate', 'storyGate'),
  source('giant-eel-ending-route', 'returnRoute'),
  source('giant-eel-ending-route', 'limitations'),
]

export const eelTransaction = (stage) => ({
  id: 'giant-eel-return',
  stage,
  kind: 'story',
  copyKey: stage === 1 ? 'giant-eel-return' : 'giant-eel-request',
  links: eelLinks,
  evidence: eelEvidence,
})
