(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/quests/index.js
  var quests_exports = {};
  __export(quests_exports, {
    actionHref: () => actionHref,
    escapeHtml: () => escapeHtml,
    evidenceHref: () => evidenceHref,
    initialize: () => initialize,
    localizeReturn: () => localizeReturn,
    pageName: () => pageName,
    renderQuestCard: () => renderQuestCard,
    renderQuestEvidence: () => renderQuestEvidence,
    renderQuestGroups: () => renderQuestGroups,
    renderQuestView: () => renderQuestView,
    safeReturn: () => safeReturn,
    setupQuestContext: () => setupQuestContext,
    stateParams: () => stateParams,
    updateQuestNavigation: () => updateQuestNavigation
  });

  // src/entities/quest/transactions.js
  var source = (file, field) => ({ file: `data/${file}.json`, field });
  var item = (category, id, stage, hash = "use-locations") => ({
    label: `${category}:${id}`,
    type: "item",
    category,
    id,
    stage,
    hash
  });
  var fish = (id, stage) => ({ label: `fish:${id}`, type: "fish", id, stage });
  var map = (stage, params) => ({
    label: stage === 1 ? "eel-village" : "eel-target",
    type: "map",
    stage,
    hash: "map-view",
    params
  });
  var key = (stage) => item("general_tool", "17", stage, "item-shops");
  var transactions = [
    {
      id: "potato-chest",
      stage: 1,
      kind: "chest",
      links: [item("bait", "11", 1), key(1)],
      evidence: [
        source("town-item-acquisition", 'items["bait:11"][0]'),
        source("quest-tool-use", 'items["17"].rawTrace.chests[0]'),
        source("shop-stock-rom", 'items["general_tool:17"]'),
        source("quest-tool-use", 'items["17"].record')
      ]
    },
    {
      id: "hariyo-tub",
      stage: 2,
      kind: "exchange",
      links: [fish("22", 2), item("general_tool", "01", 2)],
      evidence: [
        source("tub-acquisition", "npc"),
        source("tub-acquisition", "exchange"),
        source("tub-acquisition", "runtimeChecks")
      ]
    },
    {
      id: "waxworm-chest",
      stage: 2,
      kind: "chest",
      links: [item("bait", "0B", 2), key(2)],
      evidence: [
        source("town-item-acquisition", 'items["bait:0B"][0]'),
        source("quest-tool-use", 'items["17"].rawTrace.chests[1]'),
        source("shop-stock-rom", 'items["general_tool:17"]'),
        source("quest-tool-use", 'items["17"].record')
      ]
    },
    {
      id: "milk-canoe",
      stage: 3,
      kind: "exchange",
      links: [
        item("general_tool", "0F", 3),
        item("general_tool", "10", 3),
        item("general_tool", "02", 3)
      ],
      evidence: [
        source("town-item-acquisition", 'items["general_tool:0F"][0]'),
        source("quest-tool-use", 'items["0F"].rawTrace.cowExchange'),
        source("quest-tool-use", 'items["10"].rawTrace.canoeExchange')
      ]
    },
    {
      id: "yamanokami-daikon",
      stage: 3,
      kind: "exchange",
      links: [fish("18", 3), item("food", "07", 3)],
      evidence: [
        source("daikon-acquisition", "npc"),
        source("daikon-acquisition", "exchange"),
        source("daikon-acquisition", "runtimeChecks")
      ]
    },
    {
      id: "small-lure-rod-chest",
      stage: 4,
      kind: "chest",
      links: [item("rod", "0A", 4), key(4)],
      evidence: [
        source("town-item-acquisition", 'items["rod:0A"][0]'),
        source("quest-tool-use", 'items["17"].rawTrace.chests[2]'),
        source("shop-stock-rom", 'items["general_tool:17"]'),
        source("quest-tool-use", 'items["17"].record')
      ]
    },
    {
      id: "fox-fireworks",
      stage: 4,
      kind: "story",
      links: [item("general_tool", "16", 4), item("general_tool", "15", 4)],
      evidence: [
        source("quest-tool-use", 'items["16"].rawTrace.fieldEvent'),
        source("quest-tool-use", 'items["16"].rawTrace.tofuNpcFoxEvent'),
        source("quest-tool-use", 'items["16"].rawTrace.hintNpc')
      ]
    },
    {
      id: "lottery",
      stage: 5,
      kind: "optional",
      links: [
        item("general_tool", "11", 5),
        item("food", "06", 5, "what-to-do"),
        item("food", "07", 5, "what-to-do")
      ],
      evidence: [
        source("town-item-acquisition", 'items["general_tool:11"][0]'),
        source("quest-tool-use", 'items["11"].rawTrace.foodOffering'),
        source("quest-tool-use", 'items["11"].rawTrace.ticketCheckAndDraw'),
        source("quest-tool-use", 'items["11"].rawTrace.lotteryXY')
      ]
    },
    {
      id: "candle-reunion",
      stage: 6,
      kind: "story",
      links: [item("general_tool", "12", 6), key(6)],
      evidence: [
        source("town-item-acquisition", 'items["general_tool:12"][0]'),
        source("quest-tool-use", 'items["12"].rawTrace.keyChest'),
        source("quest-tool-use", 'items["12"].rawTrace.eventConsumer'),
        source("shop-stock-rom", 'items["general_tool:17"]'),
        source("quest-tool-use", 'items["17"].record')
      ]
    }
  ];
  var eelLinks = [
    item("general_tool", "06", 6, "what-to-do"),
    fish("3B", 6),
    map(6, { section: "s6-c2-r1", fish: "3B" }),
    map(1, { section: "s1-c1-r8", action: "eel-return" })
  ];
  var eelEvidence = [
    source("quest-tool-use", 'items["06"].rawTrace.eelEndingEvidence'),
    source("magnet-story-gate", "area6MagnetTarget"),
    source("magnet-story-gate", "storyGate"),
    source("giant-eel-ending-route", "returnRoute"),
    source("giant-eel-ending-route", "limitations")
  ];
  var eelTransaction = (stage) => ({
    id: "giant-eel-return",
    stage,
    kind: "story",
    copyKey: stage === 1 ? "giant-eel-return" : "giant-eel-request",
    links: eelLinks,
    evidence: eelEvidence
  });

  // src/entities/quest/copy/en.js
  var en_exports = {};
  __export(en_exports, {
    actions: () => actions,
    labels: () => labels
  });
  var labels = {
    "bait:11": "Potato bait: town chest",
    "bait:0B": "Waxworm: town chest",
    "general_tool:17": "Key: shop and purchase locations",
    "fish:22": "Hariyo: bait and fishing locations",
    "general_tool:01": "Tub: exchange location",
    "general_tool:0F": "Bottle: chest and cow locations",
    "general_tool:10": "Milk: drink or exchange",
    "general_tool:02": "Canoe: exchange location",
    "fish:18": "Yamanokami: bait and fishing locations",
    "food:07": "Daikon: effects and exchange",
    "rod:0A": "Small lure rod: town chest",
    "general_tool:16": "Fireworks: event and hint locations",
    "general_tool:15": "Tofu: eat or offer",
    "general_tool:11": "Lottery ticket: chest and draw locations",
    "food:06": "Hinomaru bento: effects and sources",
    "general_tool:12": "Candle: chest and reunion location",
    "general_tool:06": "Received postcard: doctor request",
    "fish:3B": "Giant eel: compatible equipment",
    "eel-target": "Area 6: giant-eel target",
    "eel-village": "Area 1: marked village return"
  };
  var actions = {
    "potato-chest": {
      title: "Collect potato bait from the Area 1 village chest (needs a key)",
      steps: [
        "If you already hold a spare key, use it. If not, buy one (¥100) at the Area 1 shop. Either way, free a bait slot first. The chest uses the key up.",
        "Walk into the village through the field entrance at (12,189). The chest is inside the town at (5,68).",
        "Examine the chest to get the potato bait."
      ],
      warning: "If the chest says your bait pouch is full, the key is kept. Free a slot, leave the town, come back in and open it again.",
      limit: "The entrance pairing and the key stock and price come from the game data, not a walked route. Corrected 2026-10-07: the key is used up when the chest opens (earlier text said it stayed). Checked in the emulator on this chest."
    },
    "hariyo-tub": {
      title: "Trade a kept Hariyo for a tub, if you do not already own one",
      steps: [
        "Keep Hariyo 22 in the keepnet; do not sell or eat it. Check that you do not already own a tub and leave a general-tool slot free.",
        "Talk to the tub maker on the Area 2 field at (87,27).",
        "The one-time exchange consumes the fish and grants tub 01 when inventory has space."
      ],
      warning: "A full tool inventory can lose the fish without giving a tub. Already own a tub? Use it and skip this fish sacrifice.",
      limit: "Exchange behavior was checked with supplied inventory. This does not establish a natural Hariyo catch or catch rate."
    },
    "waxworm-chest": {
      title: "Collect waxworm bait from the Area 2 chest (needs a key)",
      steps: [
        "If you already hold a spare key, use it. If not, buy one (¥100) at the Area 2 shop. Either way, free a bait slot first. The chest uses the key up.",
        "Use the field entrance at (85,28). The chest is inside the town at (4,6).",
        "Examine the chest to get the waxworm."
      ],
      warning: "If the chest says your bait pouch is full, the key is kept. Free a slot, leave the town, come back in and open it again.",
      limit: "Town coordinates are separate from field coordinates. Entrance pairing and key stock and price come from the game data. Corrected 2026-10-07: the key is used up. The Area 1 chest was tested in the emulator; Areas 2, 4 and 6 use the same chest routine."
    },
    "milk-canoe": {
      title: "Get a bottle and fill it with milk: free healing, or trade it for a canoe",
      steps: [
        "Free a tool slot. Enter the town from field (26,39) and take the bottle from the chest at (6,4). No key is needed.",
        "Take the bottle to the cow in the Area 3 field at (6,103). The cow turns it into milk, and refills the bottle for free as often as you like.",
        "Drink milk any time for a full heal. Or, if you want a canoe and do not own one, give fresh milk to the canoe maker at field (28,39) first."
      ],
      warning: "The canoe trade uses the milk up, so refill the bottle first if you already drank it. The maker refuses if you already own a canoe.",
      limit: "Traced from the bottle, cow and canoe code, and checked in the emulator. What happens if your tool bag is full at the canoe trade has not been checked."
    },
    "yamanokami-daikon": {
      title: "Trade Yamanokami for a full food inventory only if you want daikon",
      steps: [
        "Keep Yamanokami 18 and use any existing food you want to preserve first.",
        "For the one-time exchange, talk to the Area 3 field NPC at (21,82).",
        "The fish is consumed and all 16 food slots become daikon 07. Skip this trade if you prefer your current food."
      ],
      warning: "This overwrites occupied food slots too; it does not just fill empty slots.",
      limit: "The exchange was traced and checked with supplied inventory; natural acquisition of the fish was not replayed."
    },
    "small-lure-rod-chest": {
      title: "Get the small lure rod from the Area 4 chest instead of buying it (needs a key)",
      steps: [
        "If you already hold a spare key, use it. If not, buy one (¥100) at the Area 4 shop. Either way, free a rod slot first. The chest uses the key up. A ¥100 key is cheaper than buying the rod; skip all this if you already own the rod.",
        "Enter the town from field (61,21). The chest is inside at (4,6).",
        "Examine the chest to get the small lure rod."
      ],
      warning: "If the chest says your rod slots are full, the key is kept. Free a slot, leave the town, come back in and open it again.",
      limit: "Town chest and outdoor entrance are distinct locations. Entrance pairing and key stock and price come from the game data. Corrected 2026-10-07: the key is used up when the chest opens."
    },
    "fox-fireworks": {
      title: "Trigger the fox scene with fireworks; tofu is an alternative",
      steps: [
        "Before the fox scene is completed, stay on foot and bring fireworks 16.",
        "Simplest route: use fireworks while standing at field X31–33, Y42–43. This consumes them and runs the fox scene without needing tofu.",
        "Alternative: offer tofu 15 to the field NPC at (32,42), then offer fireworks to that NPC. A different NPC at (62,32) consumes fireworks for a hint only."
      ],
      warning: "Fireworks are consumed; use elsewhere can spend them without the fox event. They cannot be used while riding a tub or canoe. Offering tofu spends food you could otherwise eat.",
      limit: "The hint transaction does not prove scene completion. These are event-consumer traces, not a complete campaign walkthrough."
    },
    lottery: {
      title: "Try the optional lottery: you must offer food to the Jizo first",
      steps: [
        "Free a tool slot. Enter the town from field (59,27) and take the free ticket from the chest at (4,6). No key is needed.",
        "Offer food to the Jizo in the field at (49,22) before you draw. Hinomaru bento and daikon add 40 each, orange adds 5. The more you offer, the better your chance, up to a cap of six or seven bento. With no offering, the ticket can never win.",
        "Hand the ticket in at the drawing counter in the field at (54,22). You can win ¥100, ¥1,000 or ¥5,000, or nothing."
      ],
      warning: "The food and the ticket are used up either way, and a prize is never guaranteed. A ¥1,000 or ¥5,000 win resets your offering to zero. Do not buy food or trade a fish just for this. A large offering also makes you lose hooks, lures and flies less often after you land a fish.",
      limit: "Corrected 2026-10-07: earlier text called the offering optional; without it the ticket cannot win. The cap and the prize branches come from the game code; there is no measured win percentage. The lottery is not needed to finish the game."
    },
    "candle-reunion": {
      title: "Take the candle to the Area 6 reunion NPC (optional scene)",
      steps: [
        "If you already hold a spare key, use it. If not, buy one (¥100) at the Area 6 shop. Either way, free a tool slot first. The chest uses the key up.",
        "Enter the town from field (9,41) and open the chest at (4,6) to get the candle.",
        "Give the candle to the NPC in the Area 6 field at (47,36). It is used up and the signal and reunion scene plays. Selecting the candle from the menu only shows a description."
      ],
      warning: "Keep the candle until you reach that NPC. If the chest says your tool bag is full, the key is kept: free a slot, leave the town, come back in and try again.",
      limit: "The later Akame dialogue for the top-left character (the brother, Taro) is a clue, not an exact fishing tile. Corrected 2026-10-07: the key is used up when the chest opens."
    },
    "giant-eel-return": {
      title: "The ending: walk into the Area 1 village door at (12,189)",
      steps: [
        "Do this last. Everything else must be done first: your character’s special fish, the village scene at field (8,183), 65 of the 66 fish kinds with the doctor’s note, and the giant eel caught.",
        "You do not need to keep the eel. The game recorded the catch the moment you landed it.",
        "Walk into the Area 1 village through the field door at (12,189). The ending scene plays: the doctor recovers and everyone eats together. Nothing is given, and you can keep playing afterwards."
      ],
      warning: "If nothing happens, an earlier step is still missing. The Area 6 card lists the whole route.",
      limit: "Corrected 2026-10-07: earlier text said to keep the eel for the ending; that is not needed. We drove the ending scene in the emulator with the story flags set directly, so the whole chain from a fresh save has not been played in one go. No item, HP or money change was seen. Thai-patch wording is not checked."
    },
    "giant-eel-request": {
      title: "The giant eel and the ending: the real route",
      steps: [
        "This ending is optional. It gives no item, HP or money, and play continues afterwards.",
        "First catch your own character’s special fish (brother Taro: Akame, sister Kyoko: Tanago, father Yuzo: Namazu, mother Noriko: Koi). Then walk into the Area 1 village at field (8,183) so its scene plays.",
        "Get 65 of the 66 fish kinds into your notebook, then read the received postcard. When the doctor’s giant-eel note appears, the Area 6 magnet points to the eel at (41,8).",
        "Catch the giant eel with compatible gear (see its fish page). You do not need to keep it.",
        "Walk into the Area 1 village through the field door at (12,189). The ending scene plays."
      ],
      warning: "Catching the eel alone is not enough; the earlier steps must be done first. The food and sale menus hide your first giant eel until the ending is done, so you cannot lose it by accident.",
      limit: "Corrected 2026-10-07: earlier text said to keep the eel and avoid eating it; the eel only has to be caught. We drove the ending scene in the emulator with the story flags set directly, so the whole chain from a fresh save has not been played in one go. The fish that counts as your character’s own comes from the game’s data tables. The postcard note needs 65 distinct species records, not 65 catches. Thai-patch wording is not checked."
    }
  };

  // src/entities/quest/copy/th.js
  var th_exports = {};
  __export(th_exports, {
    actions: () => actions2,
    labels: () => labels2
  });
  var labels2 = {
    "bait:11": "เหยื่อมันฝรั่ง: หีบในเมือง",
    "bait:0B": "หนอนองุ่น: หีบในเมือง",
    "general_tool:17": "กุญแจ: ร้านและจุดซื้อ",
    "fish:22": "ฮาริโยะ: เหยื่อและจุดตก",
    "general_tool:01": "กะละมัง: จุดแลกของ",
    "general_tool:0F": "ขวดเปล่า: หีบและจุดวัว",
    "general_tool:10": "นม: ดื่มหรือแลกของ",
    "general_tool:02": "แคนู: จุดแลกของ",
    "fish:18": "ยามาโนะคามิ: เหยื่อและจุดตก",
    "food:07": "หัวไชเท้า: ผลและจุดแลก",
    "rod:0A": "คันลัวร์เล็ก: หีบในเมือง",
    "general_tool:16": "ประทัด: จุดเหตุการณ์และคำใบ้",
    "general_tool:15": "เต้าหู้ทอด: กินหรือมอบ",
    "general_tool:11": "สลาก: หีบและจุดจับรางวัล",
    "food:06": "ข้าวกล่องบ๊วย: ผลและแหล่งซื้อ",
    "general_tool:12": "เทียน: หีบและจุดนัดพบ",
    "general_tool:06": "ไปรษณียบัตรที่ได้รับ: คำขอของหมอ",
    "fish:3B": "ปลาไหลยักษ์: อุปกรณ์ที่ใช้ได้",
    "eel-target": "ด่าน 6: จุดปลาไหลยักษ์",
    "eel-village": "ด่าน 1: จุดกลับหมู่บ้าน"
  };
  var actions2 = {
    "potato-chest": {
      title: "รับเหยื่อมันฝรั่งจากหีบในหมู่บ้านด่าน 1 (ต้องมีกุญแจ)",
      steps: [
        "ถ้ามีกุญแจสำรองอยู่แล้วให้ใช้ได้เลย ถ้ายังไม่มี ซื้อหนึ่งดอก (¥100) ที่ร้านด่าน 1 ไม่ว่าแบบไหนให้เว้นช่องเหยื่อให้ว่างก่อน เปิดหีบแล้วกุญแจจะหมดไป",
        "เดินเข้าหมู่บ้านทางสนาม (12,189) หีบอยู่ในเมืองที่ (5,68)",
        "กดตรวจหีบเพื่อรับเหยื่อมันฝรั่ง"
      ],
      warning: "ถ้าเกมบอกว่าช่องเหยื่อเต็ม กุญแจจะยังอยู่ ให้เว้นช่อง เดินออกจากเมืองแล้วเข้าใหม่ แล้วเปิดอีกครั้ง",
      limit: "การจับคู่ทางเข้า สต็อกและราคากุญแจมาจากข้อมูลเกม ไม่ใช่เส้นทางที่เดินจริง แก้ไข 2026-10-07: กุญแจหมดไปเมื่อเปิดหีบ (ข้อความเดิมเขียนว่ากุญแจยังอยู่) ทดสอบในอีมูเลเตอร์กับหีบใบนี้แล้ว"
    },
    "hariyo-tub": {
      title: "เก็บฮาริโยะไว้แลกกะละมัง ถ้ายังไม่มี",
      steps: [
        "เก็บฮาริโยะ 22 ในกระชัง อย่าขายหรือกิน ตรวจว่าตัวเองยังไม่มีกะละมัง และเว้นช่องอุปกรณ์ทั่วไปให้ว่าง",
        "คุยกับคนทำกะละมังในสนามด่าน 2 ที่ (87,27)",
        "แลกได้ครั้งเดียว ปลาถูกใช้ไป และจะได้รับกะละมัง 01 เมื่อมีที่ว่าง"
      ],
      warning: "ถ้าช่องอุปกรณ์เต็ม อาจเสียปลาโดยไม่ได้กะละมัง ถ้ามีแล้วให้ใช้ของเดิม ไม่ต้องสละปลาอีก",
      limit: "ตรวจการแลกด้วยการเตรียมไอเท็มในเซฟทดลอง ไม่ใช่หลักฐานว่าตกฮาริโยะจากการเล่นปกติได้แล้ว หรือพิสูจน์อัตราจับ"
    },
    "waxworm-chest": {
      title: "รับหนอนองุ่นจากหีบด่าน 2 (ต้องมีกุญแจ)",
      steps: [
        "ถ้ามีกุญแจสำรองอยู่แล้วให้ใช้ได้เลย ถ้ายังไม่มี ซื้อหนึ่งดอก (¥100) ที่ร้านด่าน 2 ไม่ว่าแบบไหนให้เว้นช่องเหยื่อให้ว่างก่อน เปิดหีบแล้วกุญแจจะหมดไป",
        "เข้าทางสนาม (85,28) หีบอยู่ในเมืองที่ (4,6)",
        "กดตรวจหีบเพื่อรับหนอนองุ่น"
      ],
      warning: "ถ้าเกมบอกว่าช่องเหยื่อเต็ม กุญแจจะยังอยู่ ให้เว้นช่อง เดินออกจากเมืองแล้วเข้าใหม่ แล้วเปิดอีกครั้ง",
      limit: "พิกัดในเมืองคนละชุดกับพิกัดสนาม การจับคู่ทางเข้า สต็อกและราคากุญแจมาจากข้อมูลเกม แก้ไข 2026-10-07: กุญแจหมดไปเมื่อเปิดหีบ ทดสอบในอีมูเลเตอร์กับหีบด่าน 1 ส่วนด่าน 2, 4 และ 6 ใช้โค้ดชุดเดียวกัน"
    },
    "milk-canoe": {
      title: "รับขวดแล้วเติมนม: ฟื้น HP ฟรี หรือเอาไปแลกแคนู",
      steps: [
        "เว้นช่องอุปกรณ์ทั่วไปให้ว่าง เข้าหมู่บ้านทางสนาม (26,39) แล้วรับขวดจากหีบในเมืองที่ (6,4) ไม่ต้องใช้กุญแจ",
        "นำขวดไปหาวัวในสนามด่าน 3 ที่ (6,103) วัวจะเปลี่ยนขวดเป็นนม และเติมขวดให้ฟรีกี่ครั้งก็ได้",
        "ดื่มนมได้ทุกเมื่อเพื่อฟื้น HP เต็ม หรือถ้าอยากได้แคนูและยังไม่มี ให้เอานมสดไปให้ช่างทำเรือที่สนาม (28,39) ก่อน"
      ],
      warning: "การแลกแคนูใช้นมหมดไป ถ้าดื่มไปแล้วให้เติมขวดที่วัวก่อนแลก ถ้ามีแคนูอยู่แล้ว ช่างจะไม่รับแลก",
      limit: "ตามโค้ดของขวด วัว และแคนู และตรวจในอีมูเลเตอร์แล้ว ยังไม่ได้ตรวจว่าเกิดอะไรขึ้นถ้าช่องอุปกรณ์เต็มตอนแลกแคนู"
    },
    "yamanokami-daikon": {
      title: "แลกยามาโนะคามิเมื่ออยากเปลี่ยนอาหารทั้งกระเป๋าเป็นหัวไชเท้า",
      steps: [
        "เก็บยามาโนะคามิ 18 ไว้ และกินอาหารเดิมที่อยากใช้ก่อน",
        "คุยกับ NPC ในสนามด่าน 3 ที่ (21,82) เพื่อแลกครั้งเดียว",
        "ปลาถูกใช้ไป อาหารทั้ง 16 ช่องจะกลายเป็นหัวไชเท้า 07 ถ้าชอบอาหารเดิมมากกว่าให้ข้ามการแลกนี้"
      ],
      warning: "อาหารที่อยู่ในช่องเดิมถูกเขียนทับด้วย ไม่ใช่แค่เติมช่องว่าง",
      limit: "แกะโค้ดและตรวจการแลกด้วยการเตรียมไอเท็ม ยังไม่ได้เล่นจากเซฟปกติจนได้ปลาตัวนี้"
    },
    "small-lure-rod-chest": {
      title: "รับคันลัวร์เล็กจากหีบด่าน 4 แทนการซื้อ (ต้องมีกุญแจ)",
      steps: [
        "ถ้ามีกุญแจสำรองอยู่แล้วให้ใช้ได้เลย ถ้ายังไม่มี ซื้อหนึ่งดอก (¥100) ที่ร้านด่าน 4 ไม่ว่าแบบไหนให้เว้นช่องคันเบ็ดให้ว่างก่อน เปิดหีบแล้วกุญแจจะหมดไป กุญแจ ¥100 ถูกกว่าซื้อคัน ถ้ามีคันนี้อยู่แล้วให้ข้ามทั้งหมด",
        "เข้าหมู่บ้านจากสนาม (61,21) หีบอยู่ในเมืองที่ (4,6)",
        "กดตรวจหีบเพื่อรับคันลัวร์เล็ก"
      ],
      warning: "ถ้าเกมบอกว่าช่องคันเบ็ดเต็ม กุญแจจะยังอยู่ ให้เว้นช่อง เดินออกจากเมืองแล้วเข้าใหม่ แล้วเปิดอีกครั้ง",
      limit: "หีบในเมืองกับทางเข้าสนามเป็นคนละตำแหน่ง การจับคู่ทางเข้า สต็อกและราคากุญแจมาจากข้อมูลเกม แก้ไข 2026-10-07: กุญแจหมดไปเมื่อเปิดหีบ"
    },
    "fox-fireworks": {
      title: "ใช้ประทัดเรียกฉากจิ้งจอกได้เลย เต้าหู้เป็นอีกทางเลือก",
      steps: [
        "ก่อนจบเหตุการณ์จิ้งจอก ให้เดินเท้าและพกประทัด 16",
        "ทางตรง: ใช้ประทัดขณะยืนในสนาม X31–33, Y42–43 ประทัดถูกใช้ไปและเริ่มฉากจิ้งจอก ไม่ต้องให้เต้าหู้ก่อน",
        "อีกทาง: ให้เต้าหู้ทอด 15 แก่ NPC ที่สนาม (32,42) แล้วให้ประทัดแก่คนเดิม ส่วน NPC ที่ (62,32) รับประทัดเพื่อให้คำใบ้เท่านั้น"
      ],
      warning: "ประทัดใช้แล้วหมด ใช้ที่อื่นอาจเสียไปโดยไม่เกิดฉาก และใช้ขณะนั่งกะละมังหรือเรือไม่ได้ เต้าหู้ที่มอบจะเหลือไว้กินไม่ได้",
      limit: "การได้คำใบ้ไม่ได้พิสูจน์ว่าจบฉากจิ้งจอก นี่เป็นโค้ดตัวรับเหตุการณ์ ไม่ใช่บทสรุปเส้นทางจบเกมทั้งหมด"
    },
    lottery: {
      title: "ลองจับสลากเสริม: ต้องถวายอาหารที่จิโซก่อน",
      steps: [
        "เว้นช่องอุปกรณ์ทั่วไปให้ว่าง เข้าหมู่บ้านจากสนาม (59,27) แล้วรับสลากฟรีจากหีบในเมืองที่ (4,6) ไม่ต้องใช้กุญแจ",
        "ก่อนจับ ให้ถวายอาหารแก่จิโซในสนามที่ (49,22) ข้าวกล่องบ๊วยและหัวไชเท้าเพิ่ม 40 ต่อชิ้น ส้มเพิ่ม 5 ยิ่งถวายมากยิ่งมีโอกาสถูก สูงสุดประมาณข้าวกล่อง 6-7 ชิ้น ถ้าไม่ถวาย สลากจะไม่มีวันถูก",
        "นำสลากไปส่งที่จุดจับรางวัลในสนาม (54,22) อาจได้ ¥100 / ¥1,000 / ¥5,000 หรือไม่ได้อะไร"
      ],
      warning: "อาหารที่ถวายและสลากถูกใช้หมดไปไม่ว่าจะถูกหรือไม่ และไม่รับประกันรางวัล ถ้าถูก ¥1,000 หรือ ¥5,000 ค่าถวายจะกลับเป็น 0 อย่าซื้ออาหารหรือแลกปลาเพื่อสลากอย่างเดียว ถวายมากยังช่วยให้เสียเบ็ด ลัวร์ และฟลายน้อยลงหลังตกปลาขึ้นมาได้",
      limit: "แก้ไข 2026-10-07: ข้อความเดิมบอกว่าการถวายเป็นของเสริม แต่ถ้าไม่ถวาย สลากจะไม่ถูก เพดานและแขนงรางวัลมาจากโค้ดเกม ไม่มีอัตราชนะที่วัดจริง การจับสลากไม่จำเป็นต่อการจบเกม"
    },
    "candle-reunion": {
      title: "นำเทียนไปให้ NPC ที่จุดนัดพบด่าน 6 (ฉากเสริม)",
      steps: [
        "ถ้ามีกุญแจสำรองอยู่แล้วให้ใช้ได้เลย ถ้ายังไม่มี ซื้อหนึ่งดอก (¥100) ที่ร้านด่าน 6 ไม่ว่าแบบไหนให้เว้นช่องอุปกรณ์ทั่วไปให้ว่างก่อน เปิดหีบแล้วกุญแจจะหมดไป",
        "เข้าหมู่บ้านจากสนาม (9,41) แล้วเปิดหีบในเมืองที่ (4,6) เพื่อรับเทียน",
        "นำเทียนไปให้ NPC ในสนามด่าน 6 ที่ (47,36) เทียนจะหมดไปและฉากส่งสัญญาณ/พบกันจะเดินต่อ กดเลือกเทียนจากเมนูเฉย ๆ จะขึ้นแค่คำอธิบาย"
      ],
      warning: "เก็บเทียนไว้จนถึง NPC คนนั้น ถ้าเกมบอกว่าช่องอุปกรณ์เต็ม กุญแจจะยังอยู่ ให้เว้นช่อง เดินออกจากเมืองแล้วเข้าใหม่ แล้วเปิดอีกครั้ง",
      limit: "บทพูดเรื่องอาคาเมะภายหลังของตัวละครซ้ายบน (พี่ชายทาโร่) เป็นคำใบ้ ไม่ใช่พิกัดตกที่แน่นอน แก้ไข 2026-10-07: กุญแจหมดไปเมื่อเปิดหีบ"
    },
    "giant-eel-return": {
      title: "ฉากจบ: เดินเข้าประตูหมู่บ้านด่าน 1 ที่ (12,189)",
      steps: [
        "ทำเป็นขั้นสุดท้าย ต้องทำอย่างอื่นให้ครบก่อน: ปลาประจำตัวละครของคุณ ฉากในหมู่บ้านที่สนาม (8,183) ปลาครบ 65 จาก 66 ชนิดพร้อมข้อความของหมอ และตกปลาไหลยักษ์ได้แล้ว",
        "ไม่ต้องเก็บปลาไหลไว้ เกมบันทึกว่าตกได้ตั้งแต่ตอนที่ตกขึ้นมา",
        "เดินเข้าหมู่บ้านด่าน 1 ทางประตูสนาม (12,189) ฉากจบจะเริ่ม: หมอหายป่วยและทุกคนกินปลาด้วยกัน ไม่ได้ของอะไร และเล่นต่อได้"
      ],
      warning: "ถ้าไม่มีอะไรเกิดขึ้น แสดงว่ายังขาดขั้นก่อนหน้า รายการทั้งหมดอยู่ในการ์ดของด่าน 6",
      limit: "แก้ไข 2026-10-07: ข้อความเดิมบอกให้เก็บปลาไหลไว้เพื่อฉากจบ ซึ่งไม่จำเป็น ทดสอบฉากจบในอีมูเลเตอร์โดยตั้งแฟล็กเนื้อเรื่องตรง ๆ จึงยังไม่ได้เล่นซ้ำทั้งสายตั้งแต่เซฟใหม่จนจบ ไม่พบการเปลี่ยนแปลงของไอเท็ม HP หรือเงิน ยังไม่ได้ตรวจถ้อยคำของแพตช์ไทย"
    },
    "giant-eel-request": {
      title: "ปลาไหลยักษ์กับฉากจบ: ขั้นตอนจริง",
      steps: [
        "ฉากจบนี้เป็นของเสริม ไม่ได้รับไอเท็ม HP หรือเงินเพิ่ม และเล่นต่อได้",
        "ก่อนอื่นตกปลาประจำตัวละครของคุณให้ได้ (พี่ชายทาโร่: อาคาเมะ น้องสาวเคียวโกะ: ทานาโกะ พ่อยูโซ: นามาซุ แม่โนริโกะ: โคอิ) แล้วเดินเข้าหมู่บ้านด่าน 1 ทางสนาม (8,183) เพื่อให้ฉากในหมู่บ้านเล่น",
        "ทำให้สมุดบันทึกปลาครบ 65 จาก 66 ชนิด แล้วเปิดอ่านไปรษณียบัตรที่ได้รับ เมื่อข้อความเรื่องปลาไหลยักษ์ของหมอปรากฏ แม่เหล็กในด่าน 6 จะชี้ไปที่ปลาไหลที่ (41,8)",
        "ตกปลาไหลยักษ์ด้วยอุปกรณ์ที่ใช้ได้ (ดูหน้าปลาของมัน) ไม่ต้องเก็บไว้",
        "เดินเข้าหมู่บ้านด่าน 1 ทางประตูสนาม (12,189) ฉากจบจะเริ่ม"
      ],
      warning: "ตกปลาไหลได้อย่างเดียวไม่พอ ต้องทำขั้นก่อนหน้าให้ครบก่อน เมนูอาหารและเมนูขายจะซ่อนปลาไหลยักษ์ตัวแรกของคุณไว้จนกว่าฉากจบจะเล่น จึงไม่เสียมันไปโดยไม่ตั้งใจ",
      limit: "แก้ไข 2026-10-07: ข้อความเดิมบอกให้เก็บปลาไหลและอย่ากิน แต่จริง ๆ แค่ตกให้ได้ก็พอ ทดสอบฉากจบในอีมูเลเตอร์โดยตั้งแฟล็กเนื้อเรื่องตรง ๆ จึงยังไม่ได้เล่นซ้ำทั้งสายตั้งแต่เซฟใหม่จนจบ ปลาที่นับเป็นของตัวละครอ่านจากตารางข้อมูลของเกม ข้อความของหมอต้องมีบันทึกปลา 65 ชนิดที่ต่างกัน ไม่ใช่ตก 65 ครั้ง ยังไม่ได้ตรวจถ้อยคำของแพตช์ไทย"
    }
  };

  // src/entities/quest/copy/ja.js
  var ja_exports = {};
  __export(ja_exports, {
    actions: () => actions3,
    labels: () => labels3
  });
  var labels3 = {
    "bait:11": "イモエサ：町の宝箱",
    "bait:0B": "ブドウムシ：町の宝箱",
    "general_tool:17": "カギ：販売店と購入場所",
    "fish:22": "ハリヨ：エサと釣り場",
    "general_tool:01": "タライ：交換場所",
    "general_tool:0F": "空きビン：宝箱と牛の場所",
    "general_tool:10": "牛乳：飲む・交換する",
    "general_tool:02": "カヌー：交換場所",
    "fish:18": "ヤマノカミ：エサと釣り場",
    "food:07": "大根：効果と交換",
    "rod:0A": "ルアーロッド小：町の宝箱",
    "general_tool:16": "花火：イベントとヒントの場所",
    "general_tool:15": "油揚げ：食べる・渡す",
    "general_tool:11": "富くじ：宝箱と抽選場所",
    "food:06": "日の丸弁当：効果と入手先",
    "general_tool:12": "ロウソク：宝箱と再会の場所",
    "general_tool:06": "受け取った手紙：医者の依頼",
    "fish:3B": "オオウナギ：使える道具",
    "eel-target": "エリア6：オオウナギの目標地点",
    "eel-village": "エリア1：村へ戻る入口"
  };
  var actions3 = {
    "potato-chest": {
      title: "エリア1の村の宝箱でイモエサを取る（カギが必要）",
      steps: [
        "カギを持っていればそれを使う。持っていなければエリア1の店で1個買う（100円）。どちらの場合も先にエサ欄を1つ空ける。宝箱を開けるとカギは消費される。",
        "フィールド（12,189）の入口から村へ入る。宝箱は町の（5,68）にある。",
        "宝箱を調べてイモエサを受け取る。"
      ],
      warning: "エサ欄がいっぱいと言われたら、カギは残っている。欄を空け、町を出て入り直し、もう一度開ける。",
      limit: "入口の対応とカギの在庫・価格はゲームデータに基づくもので、実際に歩いた経路ではない。2026-10-07訂正：宝箱を開けるとカギは消費される（以前は「残る」と書いていた）。この宝箱でエミュレーター確認済み。"
    },
    "hariyo-tub": {
      title: "タライをまだ持っていなければ、ハリヨを残して交換する",
      steps: [
        "ハリヨ22を魚かごに残し、売ったり食べたりしない。タライを持っていないことを確認し、道具欄を1つ空ける。",
        "エリア2のフィールド（87,27）でタライを作る人に話す。",
        "一度限りの交換で魚を消費し、空きがあればタライ01を受け取る。"
      ],
      warning: "道具欄が満杯だと魚だけ失う場合がある。タライを持っているなら、そのまま使い、余分な魚を渡さない。",
      limit: "交換は用意した所持品による検証。通常プレイでのハリヨの捕獲や捕獲率を示すものではない。"
    },
    "waxworm-chest": {
      title: "エリア2の宝箱でブドウムシを取る（カギが必要）",
      steps: [
        "カギを持っていればそれを使う。持っていなければエリア2の店で1個買う（100円）。どちらの場合も先にエサ欄を1つ空ける。宝箱を開けるとカギは消費される。",
        "フィールド（85,28）の入口から入る。宝箱は町の（4,6）にある。",
        "宝箱を調べてブドウムシを受け取る。"
      ],
      warning: "エサ欄がいっぱいと言われたら、カギは残っている。欄を空け、町を出て入り直し、もう一度開ける。",
      limit: "町の座標はフィールドの座標とは別。入口の対応とカギの在庫・価格はゲームデータに基づく。2026-10-07訂正：カギは消費される。エミュレーターで確認したのはエリア1の宝箱で、エリア2・4・6は同じ処理を使う。"
    },
    "milk-canoe": {
      title: "ビンを取って牛乳にする：無料の回復か、カヌーと交換",
      steps: [
        "道具欄を1つ空ける。フィールド（26,39）から町へ入り、（6,4）の宝箱からビンを取る。カギは不要。",
        "エリア3のフィールド（6,103）の牛にビンを持っていく。牛がビンを牛乳にし、何度でも無料で補充してくれる。",
        "牛乳はいつでも飲んで全回復できる。カヌーが欲しくてまだ持っていないなら、先に新しい牛乳をフィールド（28,39）の船大工に渡す。"
      ],
      warning: "カヌーの交換で牛乳は消費される。先に飲んでしまったら、牛でビンを補充してから渡す。すでにカヌーを持っていると船大工は断る。",
      limit: "ビン・牛・カヌーの処理を追跡し、エミュレーターで確認した。カヌー交換時に道具欄がいっぱいの場合の挙動は未確認。"
    },
    "yamanokami-daikon": {
      title: "食べ物をすべて大根にしたいときだけヤマノカミを交換する",
      steps: [
        "ヤマノカミ18を残す。使いたい手持ちの食べ物は先に食べる。",
        "エリア3のフィールド（21,82）の人物に話す。一度限りの交換。",
        "魚を消費し、食べ物16枠すべてが大根07になる。今の食べ物を残したいなら交換を見送る。"
      ],
      warning: "空き枠だけでなく、すでに入っている食べ物も上書きする。",
      limit: "コードと用意した所持品で交換を確認。通常プレイでの魚の入手は再現していない。"
    },
    "small-lure-rod-chest": {
      title: "買う前にエリア4の宝箱でルアーロッド小を取る（カギが必要）",
      steps: [
        "カギを持っていればそれを使う。持っていなければエリア4の店で1個買う（100円）。どちらの場合も先に竿欄を1つ空ける。宝箱を開けるとカギは消費される。竿を買うより100円のカギのほうが安い。すでに竿を持っているなら、ここは飛ばす。",
        "フィールド（61,21）から町に入る。宝箱は中の（4,6）にある。",
        "宝箱を調べてルアーロッド小を受け取る。"
      ],
      warning: "竿欄がいっぱいと言われたら、カギは残っている。欄を空け、町を出て入り直し、もう一度開ける。",
      limit: "町の宝箱とフィールドの入口は別の場所。入口の対応とカギの在庫・価格はゲームデータに基づく。2026-10-07訂正：宝箱を開けるとカギは消費される。"
    },
    "fox-fireworks": {
      title: "花火でキツネの場面を起こす。油揚げは別ルート",
      steps: [
        "キツネの場面が完了する前に、徒歩で花火16を持つ。",
        "直接の方法：フィールドX31–33、Y42–43で花火を使う。花火を消費して場面を開始し、油揚げは不要。",
        "別の方法：フィールド（32,42）の人物に油揚げ15を渡してから、同じ人物に花火を渡す。（62,32）の別の人物は花火を消費してヒントだけをくれる。"
      ],
      warning: "花火は消費される。他の場所では場面を起こさずに失う場合がある。タライ・カヌーに乗っている間は使用できない。渡した油揚げは食べられない。",
      limit: "ヒントをもらうことは場面完了の証拠ではない。イベント処理の確認であり、全ストーリーの攻略ではない。"
    },
    lottery: {
      title: "任意のくじ：先にお地蔵さまへ食べ物を供える",
      steps: [
        "道具欄を1つ空ける。フィールド（59,27）から町へ入り、（4,6）の宝箱から無料の券を取る。カギは不要。",
        "引く前に、フィールド（49,22）のお地蔵さまへ食べ物を供える。日の丸弁当と大根は1個で40、みかんは5。供えるほど当たりやすくなり、上限は弁当6〜7個分。供えなければ券は絶対に当たらない。",
        "フィールド（54,22）の抽選所で券を出す。100円・1,000円・5,000円のどれかが当たるか、はずれる。"
      ],
      warning: "供えた食べ物も券も、当たってもはずれても消費され、当選は保証されない。1,000円か5,000円が当たると供え物は0に戻る。このためだけに食べ物を買ったり魚を交換したりしない。多く供えると、魚を釣り上げた後にハリ・ルアー・毛バリを失いにくくもなる。",
      limit: "2026-10-07訂正：以前は供え物を任意としていたが、供えなければ券は当たらない。上限と賞品の分岐はゲームのコードに基づき、測定した当選率はない。くじはクリアに必須ではない。"
    },
    "candle-reunion": {
      title: "ロウソクをエリア6の再会の人物に届ける（任意の場面）",
      steps: [
        "カギを持っていればそれを使う。持っていなければエリア6の店で1個買う（100円）。どちらの場合も先に道具欄を1つ空ける。宝箱を開けるとカギは消費される。",
        "フィールド（9,41）から町へ入り、（4,6）の宝箱を開けてロウソクを取る。",
        "エリア6のフィールド（47,36）の人物にロウソクを渡す。ロウソクは消費され、合図と再会の場面が進む。メニューでロウソクを選んでも説明が出るだけ。"
      ],
      warning: "その人物に会うまでロウソクを残す。道具欄がいっぱいと言われたらカギは残っている。欄を空け、町を出て入り直してもう一度開ける。",
      limit: "左上のキャラクター（兄の太郎）で後に出るアカメの台詞は手掛かりで、釣りタイルを示すものではない。2026-10-07訂正：宝箱を開けるとカギは消費される。"
    },
    "giant-eel-return": {
      title: "エンディング：エリア1の村の入口（12,189）に入る",
      steps: [
        "最後に行う。先に全部済ませておく：自分のキャラクター専用の魚、フィールド（8,183）での村の場面、66種類中65種類と医者のハガキの文面、オオウナギの捕獲。",
        "オオウナギを残しておく必要はない。釣り上げた時点でゲームが記録している。",
        "フィールド（12,189）の入口からエリア1の村へ入る。エンディングの場面が流れる（医者が回復し、みんなで食べる）。何ももらえず、その後もプレイを続けられる。"
      ],
      warning: "何も起きないときは、前の手順がまだ足りない。全手順はエリア6のカードにある。",
      limit: "2026-10-07訂正：以前は「エンディングのためにウナギを残す」と書いていたが、その必要はない。エンディングの場面は、エミュレーターで物語フラグを直接設定して確認したもので、新規セーブからの全工程の通し再現ではない。アイテム・HP・お金の変化は確認されなかった。タイ語パッチの文面は未確認。"
    },
    "giant-eel-request": {
      title: "オオウナギとエンディング：本当の手順",
      steps: [
        "このエンディングは任意。アイテム・HP・お金はもらえず、その後もプレイを続けられる。",
        "まず自分のキャラクター専用の魚を釣る（兄の太郎：アカメ、妹の京子：タナゴ、父の雄三：ナマズ、母の紀子：コイ）。そのあとフィールド（8,183）からエリア1の村へ入り、村の場面を見る。",
        "図鑑に66種類中65種類を記録してから、受け取ったハガキを読む。医者のオオウナギの文面が出たら、エリア6の磁石が（41,8）のオオウナギを指す。",
        "対応する道具でオオウナギを釣る（魚のページを参照）。残しておく必要はない。",
        "フィールド（12,189）の入口からエリア1の村へ入る。エンディングの場面が流れる。"
      ],
      warning: "ウナギを釣るだけでは足りない。前の手順を先に済ませる。食料と売却のメニューは、エンディングまで最初のオオウナギを隠すので、うっかり失うことはない。",
      limit: "2026-10-07訂正：以前は「ウナギを残し、食べない」と書いていたが、釣るだけでよい。エンディングの場面は、エミュレーターで物語フラグを直接設定して確認したもので、新規セーブからの全工程の通し再現ではない。どの魚が自分のキャラクター専用かはゲームのデータ表に基づく。ハガキの文面には65種類の記録が必要で、65回釣るという意味ではない。タイ語パッチの文面は未確認。"
    }
  };

  // src/entities/quest/index.js
  var locales = { en: en_exports, th: th_exports, ja: ja_exports };
  function areaQuestStages() {
    return [1, 2, 3, 4, 5, 6];
  }
  function areaQuestActions(stage, locale = "en") {
    const area = Number(stage);
    if (!Number.isInteger(area) || !areaQuestStages().includes(area)) return [];
    const copy2 = locales[locale] || en_exports;
    const records = transactions.filter((record) => record.stage === area);
    if (area === 1 || area === 6) records.push(eelTransaction(area));
    return records.map((record) => projectAction(record, copy2));
  }
  function projectAction(record, copy2) {
    const wording = copy2.actions[record.copyKey || record.id];
    return {
      id: record.id,
      kind: record.kind,
      title: wording.title,
      steps: [...wording.steps],
      warning: wording.warning,
      links: record.links.map((link) => ({
        ...link,
        label: copy2.labels[link.label],
        ...link.params ? { params: { ...link.params } } : {}
      })),
      evidence: record.evidence.map((reference) => ({ ...reference })),
      limit: wording.limit
    };
  }

  // src/pages/quests/copy.js
  var copy = {
    th: {
      title: "เควสต์และการแลกของ",
      intro: "เลือกด่านเพื่อดูสิ่งที่ต้องทำ ของที่ต้องเก็บไว้ และทางไปต่อ จากข้อมูลที่ตรวจยืนยันแล้ว",
      scope: "หน้านี้รวมข้อค้นพบที่ยืนยันแล้ว ยังไม่ใช่รายการเควสต์ทั้งหมดของเกม",
      area: "ด่าน",
      story: "เนื้อเรื่องและทางไปต่อ",
      exchange: "แลกของ",
      optional: "ของเสริมและหีบ",
      evidence: "หลักฐานและข้อจำกัด",
      empty: "ยังไม่มีการกระทำที่ยืนยันสำหรับด่านนี้",
      ready: (area, count) => `ด่าน ${area} · ${count} รายการที่ยืนยัน`,
      loading: "กำลังโหลดข้อมูลที่ยืนยัน…",
      failed: "โหลดข้อมูลไม่สำเร็จ",
      retry: "ลองอีกครั้ง",
      back: "← กลับหน้าที่มา",
      catalogue: "← เลือกอุปกรณ์"
    },
    en: {
      title: "Quests and exchanges",
      intro: "Choose an area to find what to do, what to keep and where to go next, from verified findings.",
      scope: "Verified findings only; this is not a complete list of every quest in the game.",
      area: "Area",
      story: "Story and next steps",
      exchange: "Exchanges",
      optional: "Optional items and chests",
      evidence: "Evidence and limits",
      empty: "No verified actions are listed for this area yet.",
      ready: (area, count) => `Area ${area} · ${count} verified actions`,
      loading: "Loading verified findings…",
      failed: "Could not load the findings.",
      retry: "Try again",
      back: "← Back to source",
      catalogue: "← Choose equipment"
    },
    ja: {
      title: "クエストと交換",
      intro: "エリアを選び、何をするか、何を残すか、次にどこへ行くかを確認できます。確認済みの調査結果に基づきます。",
      scope: "確認済みの結果を掲載しています。ゲーム内の全クエスト一覧ではありません。",
      area: "エリア",
      story: "物語と次の行動",
      exchange: "交換",
      optional: "任意のアイテムと宝箱",
      evidence: "根拠と制限",
      empty: "このエリアには確認済みの行動がまだ掲載されていません。",
      ready: (area, count) => `エリア${area}・確認済み${count}件`,
      loading: "確認済みの結果を読み込み中…",
      failed: "読み込めませんでした。",
      retry: "再試行",
      back: "← 元のページへ",
      catalogue: "← 装備を選ぶ"
    }
  };

  // src/pages/quests/navigation.js
  var pages = {
    index: "index",
    quests: "quests",
    item: "item",
    fish: "fish",
    maps: "maps",
    shops: "shops"
  };
  function pageName(type, locale) {
    return `${pages[type] || "index"}${locale === "en" ? "" : `.${locale}`}.html`;
  }
  function safeReturn(raw, base) {
    if (!raw) return "";
    try {
      const url = new URL(raw, base);
      const current = new URL(base);
      const directory = current.pathname.slice(0, current.pathname.lastIndexOf("/") + 1);
      const research = directory.replace(/catalogue\/$/, "research/");
      const allowed = Object.values(pages).some(
        (name) => ["en", "th", "ja"].some((locale) => url.pathname === directory + pageName(name, locale))
      ) || ["index.html", "index.th.html", "index.ja.html"].includes(
        url.pathname.slice(research.length)
      ) && url.pathname.startsWith(research);
      return url.origin === current.origin && allowed ? `${url.pathname}${url.search}${url.hash}` : "";
    } catch {
      return "";
    }
  }
  function localizeReturn(raw, locale, base, depth = 0) {
    const safe = safeReturn(raw, base);
    if (!safe) return "";
    const url = new URL(safe, base);
    url.pathname = url.pathname.replace(
      /(index|quests|item|fish|maps|shops)(?:\.th|\.ja)?\.html$/,
      (_, name) => pageName(name, locale)
    );
    if (url.searchParams.has("return")) {
      const nested = depth < 4 ? localizeReturn(url.searchParams.get("return"), locale, base, depth + 1) : "";
      if (nested) url.searchParams.set("return", nested);
      else url.searchParams.delete("return");
    }
    return `${url.pathname}${url.search}${url.hash}`;
  }
  function stateParams(ctx, stage = ctx.stage) {
    const query = new URLSearchParams({ stage: String(stage) });
    for (const key2 of ["fish", "route"]) if (ctx[key2]) query.set(key2, ctx[key2]);
    if (ctx.returnRoute) query.set("return", ctx.returnRoute);
    return query;
  }
  function actionHref(ctx, link, actionId = "") {
    const type = link.type === "map" ? "maps" : link.type;
    if (!["maps", "item", "fish"].includes(type)) return "";
    const query = new URLSearchParams(link.params || {});
    query.set("stage", String(link.stage || ctx.stage));
    if (link.id) query.set("id", link.id);
    if (link.category) query.set("category", link.category);
    if (ctx.route && !query.has("route")) query.set("route", ctx.route);
    query.set(
      "return",
      `${ctx.pathname}?${stateParams(ctx)}${actionId ? `#${encodeURIComponent(actionId)}` : ctx.hash}`
    );
    const hash = String(link.hash || "").replace(/^#/, "");
    return `${pageName(type, ctx.locale)}?${query}${hash ? `#${encodeURIComponent(hash)}` : ""}`;
  }

  // src/shared/lib/evidence-link.js
  var repository = "https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/";
  function readableEvidenceHref(value) {
    if (typeof value !== "string") return value;
    if (!/^\.\.\/(?:docs\/[\w.-]+\.md|README\.md)(?:#[^\s]*)?$/.test(value)) return value;
    return repository + value.slice(3);
  }

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/pages/quests/render.js
  function escapeHtml(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
    );
  }
  function evidenceHref(file) {
    if (!/^(?:docs|data)\/[\w./-]+\.(?:md|json)$/.test(file || "") || file.includes("..")) return "";
    return readableEvidenceHref(`../${file}`);
  }
  function renderQuestEvidence(ctx, action) {
    const entries = (action.evidence || []).map(({ file, field }) => {
      const href = evidenceHref(file);
      return href ? `<li data-quest-evidence-file="${escapeHtml(file)}" data-quest-evidence-field="${escapeHtml(field)}"><a href="${escapeHtml(href)}">${escapeHtml(file)}</a>${field ? ` · <code>${escapeHtml(field)}</code>` : ""}</li>` : "";
    }).join("");
    if (!entries && !action.limit) return "";
    return `<details class="quest-evidence"><summary>${escapeHtml(ctx.text.evidence)}</summary>${action.limit ? `<p data-quest-limit>${escapeHtml(action.limit)}</p>` : ""}${entries ? `<ul>${entries}</ul>` : ""}</details>`;
  }
  function renderQuestCard(ctx, action) {
    const steps = (action.steps || []).map((step) => `<li data-quest-step>${escapeHtml(step)}</li>`).join("");
    const links = (action.links || []).map((link) => {
      const href = actionHref(ctx, link, action.id);
      return href ? `<a class="route-button" data-quest-link-type="${escapeHtml(link.type)}" href="${escapeHtml(href)}">${escapeHtml(link.label)} ↗</a>` : "";
    }).join("");
    return `<article class="quest-card" id="${escapeHtml(action.id)}" data-area-quest="${escapeHtml(action.id)}" data-quest-kind="${escapeHtml(action.kind)}"><h3>${escapeHtml(action.title)}</h3><ol>${steps}</ol>${action.warning ? `<p class="quest-warning" data-quest-warning>${escapeHtml(action.warning)}</p>` : ""}<nav class="quest-actions" aria-label="${escapeHtml(action.title)}">${links}</nav>${renderQuestEvidence(ctx, action)}</article>`;
  }
  function renderQuestGroups(ctx, actions4) {
    if (!actions4.length) return `<p class="empty-state">${escapeHtml(ctx.text.empty)}</p>`;
    const groups = [
      ["story", "story"],
      ["exchange", "exchange"],
      ["optional", "optional"]
    ];
    return groups.map(([kind, label]) => {
      const selected = actions4.filter(
        (action) => (["story", "exchange"].includes(action.kind) ? action.kind : "optional") === kind
      );
      return selected.length ? `<section class="quest-group" data-quest-group="${kind}"><h2>${escapeHtml(ctx.text[label])}</h2><div class="quest-grid">${selected.map((action) => renderQuestCard(ctx, action)).join("")}</div></section>` : "";
    }).join("");
  }

  // src/pages/quests/runtime.js
  function setupQuestContext(ctx) {
    ctx.locale = ["th", "ja"].includes(document.documentElement.dataset.locale) ? document.documentElement.dataset.locale : "en";
    ctx.text = copy[ctx.locale];
    ctx.$ = (id) => document.getElementById(id);
    ctx.pathname = location.pathname;
    ctx.hash = location.hash;
    ctx.params = new URLSearchParams(location.search);
    ctx.stage = /^[1-6]$/.test(ctx.params.get("stage") || "") ? Number(ctx.params.get("stage")) : 1;
    ctx.fish = /^[0-9a-f]{2}$/i.test(ctx.params.get("fish") || "") ? ctx.params.get("fish").toUpperCase() : "";
    ctx.route = ["float", "sinker", "lure", "fly"].includes(ctx.params.get("route")) ? ctx.params.get("route") : "";
    ctx.returnRoute = safeReturn(ctx.params.get("return"), location.href);
    ctx.$("quest-stage").value = String(ctx.stage);
  }
  function updateQuestNavigation(ctx) {
    for (const locale of ["en", "th", "ja"]) {
      const query = stateParams(ctx);
      if (ctx.returnRoute) query.set("return", localizeReturn(ctx.returnRoute, locale, location.href));
      const link = ctx.$(`language-${locale}`);
      link.href = `${pageName("quests", locale)}?${query}${ctx.hash}`;
      if (ctx.locale === locale) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    const back = ctx.$("back-link");
    back.href = ctx.returnRoute || pageName("index", ctx.locale);
    back.textContent = ctx.returnRoute ? ctx.text.back : ctx.text.catalogue;
  }
  function renderQuestView(ctx) {
    const status = ctx.$("page-status");
    status.textContent = ctx.text.loading;
    ctx.$("quest-stage").disabled = true;
    try {
      const actions4 = areaQuestActions(ctx.stage, ctx.locale);
      ctx.$("quest-results").innerHTML = renderQuestGroups(ctx, actions4);
      status.textContent = ctx.text.ready(ctx.stage, actions4.length);
      ctx.$("quest-stage").disabled = false;
      updateQuestNavigation(ctx);
      if (ctx.hash) document.getElementById(ctx.hash.slice(1))?.scrollIntoView({ block: "start" });
    } catch {
      status.innerHTML = `${escapeHtml(ctx.text.failed)} <button type="button" class="route-button" data-quest-retry>${escapeHtml(ctx.text.retry)}</button>`;
      status.querySelector("[data-quest-retry]")?.addEventListener("click", () => renderQuestView(ctx));
      ctx.$("quest-results").replaceChildren();
      ctx.$("quest-stage").disabled = false;
    }
  }
  function initialize(ctx) {
    setupQuestContext(ctx);
    const stages = areaQuestStages();
    ctx.$("quest-stage").innerHTML = stages.map((stage) => `<option value="${stage}">${escapeHtml(ctx.text.area)} ${stage}</option>`).join("");
    ctx.$("quest-stage").value = String(ctx.stage);
    updateQuestNavigation(ctx);
    ctx.$("quest-stage").addEventListener("change", () => {
      ctx.stage = Number(ctx.$("quest-stage").value);
      ctx.hash = "";
      history.replaceState(null, "", `${ctx.pathname}?${stateParams(ctx)}`);
      renderQuestView(ctx);
    });
    renderQuestView(ctx);
  }

  // src/app/quests.js
  initialize(createPageRuntime(quests_exports));
})();
