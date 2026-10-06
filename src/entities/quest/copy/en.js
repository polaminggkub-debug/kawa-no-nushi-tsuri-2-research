export const labels = {
  'bait:11': 'Potato bait: town chest',
  'bait:0B': 'Waxworm: town chest',
  'general_tool:17': 'Key: shop and purchase locations',
  'fish:22': 'Hariyo: bait and fishing locations',
  'general_tool:01': 'Tub: exchange location',
  'general_tool:0F': 'Bottle: chest and cow locations',
  'general_tool:10': 'Milk: drink or exchange',
  'general_tool:02': 'Canoe: exchange location',
  'fish:18': 'Yamanokami: bait and fishing locations',
  'food:07': 'Daikon: effects and exchange',
  'rod:0A': 'Small lure rod: town chest',
  'general_tool:16': 'Fireworks: event and hint locations',
  'general_tool:15': 'Tofu: eat or offer',
  'general_tool:11': 'Lottery ticket: chest and draw locations',
  'food:06': 'Hinomaru bento: effects and sources',
  'general_tool:12': 'Candle: chest and reunion location',
  'general_tool:06': 'Received postcard: doctor request',
  'fish:3B': 'Giant eel: compatible equipment',
  'eel-target': 'Area 6: giant-eel target',
  'eel-village': 'Area 1: marked village return',
}

export const actions = {
  'potato-chest': {
    title: 'Have the key? Collect potato bait from the village chest',
    steps: [
      'Already have key 17? Keep it. Otherwise buy one for ¥100 at the Area 1 regular shop, then leave a free bait slot.',
      'Enter the village through the field entrance at (12,189). The chest is inside the town at (5,68), not on the fishing map.',
      'Open the locked chest to receive potato bait 11; the key remains.',
    ],
    warning: 'Make space before opening; the reward checks bait inventory capacity.',
    limit:
      'The entrance is paired from ROM data, not a walked route. Key availability and its shop quote are ROM-backed; no new key-purchase replay was run.',
  },
  'hariyo-tub': {
    title: 'Trade a kept Hariyo for a tub, if you do not already own one',
    steps: [
      'Keep Hariyo 22 in the keepnet; do not sell or eat it. Check that you do not already own a tub and leave a general-tool slot free.',
      'Talk to the tub maker on the Area 2 field at (87,27).',
      'The one-time exchange consumes the fish and grants tub 01 when inventory has space.',
    ],
    warning:
      'A full tool inventory can lose the fish without giving a tub. Already own a tub? Use it and skip this fish sacrifice.',
    limit:
      'Exchange behavior was checked with supplied inventory. This does not establish a natural Hariyo catch or catch rate.',
  },
  'waxworm-chest': {
    title: 'Use the key to collect grapevine larva bait',
    steps: [
      'Already have key 17? Keep it. Otherwise buy one for ¥100 at the Area 2 regular shop, then leave a free bait slot.',
      'Use the field entrance at (85,28); the chest is inside the town at (4,6).',
      'Open the locked chest for grapevine larva bait 0B; the key remains.',
    ],
    warning: 'Leave bait space before opening the chest.',
    limit:
      'Town coordinates are separate from outdoor coordinates. Entrance pairing and key stock/quote are ROM evidence, not a new natural travel or key-purchase replay.',
  },
  'milk-canoe': {
    title: 'Get a bottle, fill it with milk, then choose healing or a canoe',
    steps: [
      'Leave a general-tool slot free. Enter town from field (26,39) and take bottle 0F from the town chest at (6,4); no key is required.',
      'Bring that bottle to the cow on the Area 3 field at (6,103). It becomes milk 10.',
      'Want canoe 02 and do not own it? Reserve the milk and talk to the canoe maker at field (28,39). Otherwise drink the milk to restore current HP to maximum, then refill the returned empty bottle at the cow.',
    ],
    warning:
      'Drinking uses the milk needed for the canoe exchange; refill before trading. Leave space for the initial bottle.',
    limit:
      'This traces the bottle, cow and canoe consumers. It does not establish the canoe exchange’s full-inventory behavior or a naturally replayed travel route.',
  },
  'yamanokami-daikon': {
    title: 'Trade Yamanokami for a full food inventory only if you want daikon',
    steps: [
      'Keep Yamanokami 18 and use any existing food you want to preserve first.',
      'For the one-time exchange, talk to the Area 3 field NPC at (21,82).',
      'The fish is consumed and all 16 food slots become daikon 07. Skip this trade if you prefer your current food.',
    ],
    warning: 'This overwrites occupied food slots too; it does not just fill empty slots.',
    limit:
      'The exchange was traced and checked with supplied inventory; natural acquisition of the fish was not replayed.',
  },
  'small-lure-rod-chest': {
    title: 'Check the locked chest before buying the small lure rod',
    steps: [
      'Already have key 17? Keep it. Otherwise buy one for ¥100 at the Area 4 regular shop, then leave a rod slot free.',
      'Enter town from field (61,21); find the chest inside at (4,6).',
      'The unopened locked chest grants small lure rod 0A and keeps the key. If you already have the rod, you need not buy another just for this action.',
    ],
    warning: 'Make rod inventory space before opening.',
    limit:
      'Town chest and outdoor entrance are distinct locations. Entrance pairing and key stock/quote are ROM evidence, not a new natural travel or key-purchase replay.',
  },
  'fox-fireworks': {
    title: 'Trigger the fox scene with fireworks; tofu is an alternative',
    steps: [
      'Before the fox scene is completed, stay on foot and bring fireworks 16.',
      'Simplest route: use fireworks while standing at field X31–33, Y42–43. This consumes them and runs the fox scene without needing tofu.',
      'Alternative: offer tofu 15 to the field NPC at (32,42), then offer fireworks to that NPC. A different NPC at (62,32) consumes fireworks for a hint only.',
    ],
    warning:
      'Fireworks are consumed; use elsewhere can spend them without the fox event. They cannot be used while riding a tub or canoe. Offering tofu spends food you could otherwise eat.',
    limit:
      'The hint transaction does not prove scene completion. These are event-consumer traces, not a complete campaign walkthrough.',
  },
  lottery: {
    title: 'Try the optional lottery using a ticket and spare food',
    steps: [
      'Leave a general-tool slot free. Enter town from field (59,27) and collect ticket 11 from the town chest at (4,6); no key is needed.',
      'If you already have spare food, offer Hinomaru bento 06 or daikon 07 to the field Jizo at (49,22) before drawing. They can improve more losing draws than orange 01 before the cap; near the cap the effect can tie.',
      'Take the ticket to the field drawing counter at (54,22). The result can be ¥100, ¥1,000, ¥5,000 or a loss.',
    ],
    warning:
      'Offered food and the ticket are consumed. Do not buy food or trade a fish solely for this optional lottery; a prize is not guaranteed.',
    limit:
      'The threshold and prize branches are decoded, not a measured probability or guaranteed reward. This is not required progression.',
  },
  'candle-reunion': {
    title: 'Collect the candle and bring it to the reunion NPC',
    steps: [
      'Already have key 17? Keep it. Otherwise buy one for ¥100 at the Area 6 regular shop, then leave a general-tool slot free.',
      'Enter town from field (9,41); open its chest at town (4,6) for candle 12. The key remains.',
      'Bring the candle to the Area 6 field NPC at (47,36). It is consumed to run the signal/reunion event; selecting Use on its own only shows a description.',
    ],
    warning: 'Leave room before opening the chest. Keep the candle until you reach its event NPC.',
    limit:
      'The later Akame dialogue for character selector 1 is a clue, not an exact fishing tile or a proved mandatory catch gate for every character.',
  },
  'giant-eel-return': {
    title: 'After the doctor request: keep the giant eel and return here',
    steps: [
      'Only follow this return if the doctor-request story conditions are met and you have stored giant eel 3B in the keepnet.',
      'Keep the eel; do not sell it or eat the first kept fish if that fish is the eel.',
      'Enter the Area 1 village through field (12,189). The conditional arrival at town (7,77) runs the doctor recovery and ending scene; no separate doctor hand-in NPC is established.',
    ],
    warning:
      'An eel alone does not guarantee the ending. Check the received request and story state first.',
    limit:
      'Static original-ROM control flow and dialogue, not a natural full-campaign replay. Exact rewards, eel consumption and Thai-patch equivalence are not independently proved.',
  },
  'giant-eel-request': {
    title: 'Have the doctor’s request? Target the giant eel, keep it, then return',
    steps: [
      'Read received postcard 06 and check for the doctor’s request before following this route. If the request is absent, do not assume this objective is active.',
      'Use the Area 6 heading/target at (41,8) when active, and choose compatible equipment from giant eel 3B’s profile.',
      'Store and keep the eel, then follow the marked Area 1 village return at field (12,189); the conditional scene restores the doctor and reaches the ending.',
    ],
    warning:
      'The dynamic target may be inactive. Do not sell or eat the eel; catching it alone does not guarantee the ending.',
    limit:
      'The postcard reader enables the heading only with 65 distinct nonzero notebook species records and the required story state; this is not 65 catches, a per-area quota or automatic mail generation. The return branch is ROM-backed, but ordinary-save completion was not replayed. Exact rewards, eel consumption and Thai-patch equivalence remain unproved.',
  },
}
