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
    title: 'Collect potato bait from the Area 1 village chest (needs a key)',
    steps: [
      'If you already hold a spare key, use it. If not, buy one (¥100) at the Area 1 shop. Either way, free a bait slot first. The chest uses the key up.',
      'Walk into the village through the field entrance at (12,189). The chest is inside the town at (5,68).',
      'Examine the chest to get the potato bait.',
    ],
    warning:
      'If the chest says your bait pouch is full, the key is kept. Free a slot, leave the town, come back in and open it again.',
    limit:
      'The entrance pairing and the key stock and price come from the game data, not a walked route. Corrected 2026-10-07: the key is used up when the chest opens (earlier text said it stayed). Checked in the emulator on this chest.',
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
    title: 'Collect waxworm bait from the Area 2 chest (needs a key)',
    steps: [
      'If you already hold a spare key, use it. If not, buy one (¥100) at the Area 2 shop. Either way, free a bait slot first. The chest uses the key up.',
      'Use the field entrance at (85,28). The chest is inside the town at (4,6).',
      'Examine the chest to get the waxworm.',
    ],
    warning:
      'If the chest says your bait pouch is full, the key is kept. Free a slot, leave the town, come back in and open it again.',
    limit:
      'Town coordinates are separate from field coordinates. Entrance pairing and key stock and price come from the game data. Corrected 2026-10-07: the key is used up. The Area 1 chest was tested in the emulator; Areas 2, 4 and 6 use the same chest routine.',
  },
  'milk-canoe': {
    title: 'Get a bottle and fill it with milk: free healing, or trade it for a canoe',
    steps: [
      'Free a tool slot. Enter the town from field (26,39) and take the bottle from the chest at (6,4). No key is needed.',
      'Take the bottle to the cow in the Area 3 field at (6,103). The cow turns it into milk, and refills the bottle for free as often as you like.',
      'Drink milk any time for a full heal. Or, if you want a canoe and do not own one, give fresh milk to the canoe maker at field (28,39) first.',
    ],
    warning:
      'The canoe trade uses the milk up, so refill the bottle first if you already drank it. The maker refuses if you already own a canoe.',
    limit:
      'Traced from the bottle, cow and canoe code, and checked in the emulator. What happens if your tool bag is full at the canoe trade has not been checked.',
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
    title: 'Get the small lure rod from the Area 4 chest instead of buying it (needs a key)',
    steps: [
      'If you already hold a spare key, use it. If not, buy one (¥100) at the Area 4 shop. Either way, free a rod slot first. The chest uses the key up. A ¥100 key is cheaper than buying the rod; skip all this if you already own the rod.',
      'Enter the town from field (61,21). The chest is inside at (4,6).',
      'Examine the chest to get the small lure rod.',
    ],
    warning:
      'If the chest says your rod slots are full, the key is kept. Free a slot, leave the town, come back in and open it again.',
    limit:
      'Town chest and outdoor entrance are distinct locations. Entrance pairing and key stock and price come from the game data. Corrected 2026-10-07: the key is used up when the chest opens.',
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
    title: 'Try the optional lottery: you must offer food to the Jizo first',
    steps: [
      'Free a tool slot. Enter the town from field (59,27) and take the free ticket from the chest at (4,6). No key is needed.',
      'Offer food to the Jizo in the field at (49,22) before you draw. Hinomaru bento and daikon add 40 each, orange adds 5. The more you offer, the better your chance, up to a cap of six or seven bento. With no offering, the ticket can never win.',
      'Hand the ticket in at the drawing counter in the field at (54,22). You can win ¥100, ¥1,000 or ¥5,000, or nothing.',
    ],
    warning:
      'The food and the ticket are used up either way, and a prize is never guaranteed. A ¥1,000 or ¥5,000 win resets your offering to zero. Do not buy food or trade a fish just for this. A large offering also makes you lose hooks, lures and flies less often after you land a fish.',
    limit:
      'Corrected 2026-10-07: earlier text called the offering optional; without it the ticket cannot win. The cap and the prize branches come from the game code; there is no measured win percentage. The lottery is not needed to finish the game.',
  },
  'candle-reunion': {
    title: 'Take the candle to the Area 6 reunion NPC (optional scene)',
    steps: [
      'If you already hold a spare key, use it. If not, buy one (¥100) at the Area 6 shop. Either way, free a tool slot first. The chest uses the key up.',
      'Enter the town from field (9,41) and open the chest at (4,6) to get the candle.',
      'Give the candle to the NPC in the Area 6 field at (47,36). It is used up and the signal and reunion scene plays. Selecting the candle from the menu only shows a description.',
    ],
    warning:
      'Keep the candle until you reach that NPC. If the chest says your tool bag is full, the key is kept: free a slot, leave the town, come back in and try again.',
    limit:
      'The later Akame dialogue for the top-left character (the brother, Taro) is a clue, not an exact fishing tile. Corrected 2026-10-07: the key is used up when the chest opens.',
  },
  'giant-eel-return': {
    title: 'The ending: walk into the Area 1 village door at (12,189)',
    steps: [
      'Do this last. Everything else must be done first: your character’s special fish, the village scene at field (8,183), 65 of the 66 fish kinds with the doctor’s note, and the giant eel caught.',
      'You do not need to keep the eel. The game recorded the catch the moment you landed it.',
      'Walk into the Area 1 village through the field door at (12,189). The ending scene plays: the doctor recovers and everyone eats together. Nothing is given, and you can keep playing afterwards.',
    ],
    warning:
      'If nothing happens, an earlier step is still missing. The Area 6 card lists the whole route.',
    limit:
      'Corrected 2026-10-07: earlier text said to keep the eel for the ending; that is not needed. We drove the ending scene in the emulator with the story flags set directly, so the whole chain from a fresh save has not been played in one go. No item, HP or money change was seen. Thai-patch wording is not checked.',
  },
  'giant-eel-request': {
    title: 'The giant eel and the ending: the real route',
    steps: [
      'This ending is optional. It gives no item, HP or money, and play continues afterwards.',
      'First catch your own character’s special fish (brother Taro: Akame, sister Kyoko: Tanago, father Yuzo: Namazu, mother Noriko: Koi). Then walk into the Area 1 village at field (8,183) so its scene plays.',
      'Get 65 of the 66 fish kinds into your notebook, then read the received postcard. When the doctor’s giant-eel note appears, the Area 6 magnet points to the eel at (41,8).',
      'Catch the giant eel with compatible gear (see its fish page). You do not need to keep it.',
      'Walk into the Area 1 village through the field door at (12,189). The ending scene plays.',
    ],
    warning:
      'Catching the eel alone is not enough; the earlier steps must be done first. The food and sale menus hide your first giant eel until the ending is done, so you cannot lose it by accident.',
    limit:
      'Corrected 2026-10-07: earlier text said to keep the eel and avoid eating it; the eel only has to be caught. We drove the ending scene in the emulator with the story flags set directly, so the whole chain from a fresh save has not been played in one go. The fish that counts as your character’s own comes from the game’s data tables. The postcard note needs 65 distinct species records, not 65 catches. Thai-patch wording is not checked.',
  },
}
