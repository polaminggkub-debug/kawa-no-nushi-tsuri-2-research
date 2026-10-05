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
      title: "Have the key? Collect potato bait from the village chest",
      steps: [
        "Already have key 17? Keep it. Otherwise buy one for ¥100 at the Area 1 regular shop, then leave a free bait slot.",
        "Enter the village through the field entrance at (12,189). The chest is inside the town at (5,68), not on the fishing map.",
        "Open the locked chest to receive potato bait 11; the key remains."
      ],
      warning: "Make space before opening; the reward checks bait inventory capacity.",
      limit: "The entrance is paired from ROM data, not a walked route. Key availability and its shop quote are ROM-backed; no new key-purchase replay was run."
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
      title: "Use the key to collect waxworm bait",
      steps: [
        "Already have key 17? Keep it. Otherwise buy one for ¥100 at the Area 2 regular shop, then leave a free bait slot.",
        "Use the field entrance at (85,28); the chest is inside the town at (4,6).",
        "Open the locked chest for waxworm bait 0B; the key remains."
      ],
      warning: "Leave bait space before opening the chest.",
      limit: "Town coordinates are separate from outdoor coordinates. Entrance pairing and key stock/quote are ROM evidence, not a new natural travel or key-purchase replay."
    },
    "milk-canoe": {
      title: "Get a bottle, fill it with milk, then choose healing or a canoe",
      steps: [
        "Leave a general-tool slot free. Enter town from field (26,39) and take bottle 0F from the town chest at (6,4); no key is required.",
        "Bring that bottle to the cow on the Area 3 field at (6,103). It becomes milk 10.",
        "Want canoe 02 and do not own it? Reserve the milk and talk to the canoe maker at field (28,39). Otherwise drink the milk to restore current HP to maximum, then refill the returned empty bottle at the cow."
      ],
      warning: "Drinking uses the milk needed for the canoe exchange; refill before trading. Leave space for the initial bottle.",
      limit: "This traces the bottle, cow and canoe consumers. It does not establish the canoe exchange’s full-inventory behavior or a naturally replayed travel route."
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
      title: "Check the locked chest before buying the small lure rod",
      steps: [
        "Already have key 17? Keep it. Otherwise buy one for ¥100 at the Area 4 regular shop, then leave a rod slot free.",
        "Enter town from field (61,21); find the chest inside at (4,6).",
        "The unopened locked chest grants small lure rod 0A and keeps the key. If you already have the rod, you need not buy another just for this action."
      ],
      warning: "Make rod inventory space before opening.",
      limit: "Town chest and outdoor entrance are distinct locations. Entrance pairing and key stock/quote are ROM evidence, not a new natural travel or key-purchase replay."
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
      title: "Try the optional lottery using a ticket and spare food",
      steps: [
        "Leave a general-tool slot free. Enter town from field (59,27) and collect ticket 11 from the town chest at (4,6); no key is needed.",
        "If you already have spare food, offer Hinomaru bento 06 or daikon 07 to the field Jizo at (49,22) before drawing. They can improve more losing draws than orange 01 before the cap; near the cap the effect can tie.",
        "Take the ticket to the field drawing counter at (54,22). The result can be ¥100, ¥1,000, ¥5,000 or a loss."
      ],
      warning: "Offered food and the ticket are consumed. Do not buy food or trade a fish solely for this optional lottery; a prize is not guaranteed.",
      limit: "The threshold and prize branches are decoded, not a measured probability or guaranteed reward. This is not required progression."
    },
    "candle-reunion": {
      title: "Collect the candle and bring it to the reunion NPC",
      steps: [
        "Already have key 17? Keep it. Otherwise buy one for ¥100 at the Area 6 regular shop, then leave a general-tool slot free.",
        "Enter town from field (9,41); open its chest at town (4,6) for candle 12. The key remains.",
        "Bring the candle to the Area 6 field NPC at (47,36). It is consumed to run the signal/reunion event; selecting Use on its own only shows a description."
      ],
      warning: "Leave room before opening the chest. Keep the candle until you reach its event NPC.",
      limit: "The later Akame dialogue for character selector 1 is a clue, not an exact fishing tile or a proved mandatory catch gate for every character."
    },
    "giant-eel-return": {
      title: "After the doctor request: keep the giant eel and return here",
      steps: [
        "Only follow this return if the doctor-request story conditions are met and you have stored giant eel 3B in the keepnet.",
        "Keep the eel; do not sell it or eat the first kept fish if that fish is the eel.",
        "Enter the Area 1 village through field (12,189). The conditional arrival at town (7,77) runs the doctor recovery and ending scene; no separate doctor hand-in NPC is established."
      ],
      warning: "An eel alone does not guarantee the ending. Check the received request and story state first.",
      limit: "Static original-ROM control flow and dialogue, not a natural full-campaign replay. Exact rewards, eel consumption and Thai-patch equivalence are not independently proved."
    },
    "giant-eel-request": {
      title: "Have the doctor’s request? Target the giant eel, keep it, then return",
      steps: [
        "Read received postcard 06 and check for the doctor’s request before following this route. If the request is absent, do not assume this objective is active.",
        "Use the Area 6 heading/target at (41,8) when active, and choose compatible equipment from giant eel 3B’s profile.",
        "Store and keep the eel, then follow the marked Area 1 village return at field (12,189); the conditional scene restores the doctor and reaches the ending."
      ],
      warning: "The dynamic target may be inactive. Do not sell or eat the eel; catching it alone does not guarantee the ending.",
      limit: "The postcard reader enables the heading only with 65 distinct nonzero notebook species records and the required story state; this is not 65 catches, a per-area quota or automatic mail generation. The return branch is ROM-backed, but ordinary-save completion was not replayed. Exact rewards, eel consumption and Thai-patch equivalence remain unproved."
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
      title: "มีกุญแจแล้ว? รับเหยื่อมันฝรั่งจากหีบในหมู่บ้าน",
      steps: [
        "ถ้ามีกุญแจ 17 แล้วให้ใช้ของเดิม ถ้ายังไม่มี ซื้อหนึ่งดอกจากร้านอุปกรณ์ปกติด่าน 1 ราคา ¥100 แล้วเว้นช่องเหยื่อให้ว่างก่อนเปิดหีบ",
        "เข้าหมู่บ้านทางพิกัดสนาม (12,189) หีบอยู่ในเมืองที่ (5,68) ไม่ใช่จุดบนแผนที่ตกปลา",
        "เปิดหีบล็อกเพื่อรับเหยื่อมันฝรั่ง 11 กุญแจยังอยู่"
      ],
      warning: "ต้องมีช่องเหยื่อว่างก่อนเปิด เพราะเกมตรวจความจุช่องเหยื่อตอนให้ของ",
      limit: "จับคู่ทางเข้าและตรวจสต็อกกับราคาขายกุญแจจาก ROM ยังไม่ได้เดินเส้นทางนี้จากเซฟปกติหรือทดลองซื้อกุญแจใหม่ในรอบนี้"
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
      title: "ใช้กุญแจรับหนอนองุ่นจากหีบ",
      steps: [
        "ถ้ามีกุญแจ 17 แล้วให้ใช้ของเดิม ถ้ายังไม่มี ซื้อหนึ่งดอกจากร้านอุปกรณ์ปกติด่าน 2 ราคา ¥100 แล้วเว้นช่องเหยื่อให้ว่าง",
        "เข้าทางพิกัดสนาม (85,28) หีบอยู่ในเมืองที่ (4,6)",
        "เปิดหีบล็อกเพื่อรับหนอนองุ่น 0B กุญแจไม่หาย"
      ],
      warning: "เว้นช่องเหยื่อก่อนเปิดหีบ",
      limit: "พิกัดในเมืองคนละชุดกับพิกัดสนาม ทางเข้ากับสต็อกและราคาขายกุญแจมาจาก ROM ยังไม่ใช่การเดินหรือทดลองซื้อกุญแจจากเซฟปกติในรอบนี้"
    },
    "milk-canoe": {
      title: "รับขวด เติมนม แล้วเลือกดื่มหรือแลกแคนู",
      steps: [
        "เว้นช่องอุปกรณ์ทั่วไป เข้าหมู่บ้านทางสนาม (26,39) รับขวดเปล่า 0F จากหีบในเมืองที่ (6,4) ไม่ต้องใช้กุญแจ",
        "นำขวดนี้ไปหาวัวในสนามด่าน 3 ที่ (6,103) ขวดจะเปลี่ยนเป็นนม 10",
        "ถ้าอยากได้แคนู 02 และยังไม่มี ให้เก็บนมไว้คุยกับคนทำเรือที่สนาม (28,39) ถ้าจะฟื้น HP ให้ดื่มนมจน HP เต็ม แล้วนำขวดเปล่าที่ได้คืนไปเติมที่วัว"
      ],
      warning: "ดื่มแล้วจะไม่มีนมให้แลกแคนู ต้องเติมใหม่ก่อนแลก เว้นช่องไว้รับขวดครั้งแรกด้วย",
      limit: "ยืนยันตัวรับขวด วัว และการแลกแคนู แต่ยังไม่ยืนยันผลเมื่อช่องเต็มตอนแลกแคนู หรือการเดินเส้นทางทั้งหมดจากเซฟปกติ"
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
      title: "เช็กหีบล็อกก่อนซื้อคันลัวร์เล็ก",
      steps: [
        "ถ้ามีกุญแจ 17 แล้วให้ใช้ของเดิม ถ้ายังไม่มี ซื้อหนึ่งดอกจากร้านอุปกรณ์ปกติด่าน 4 ราคา ¥100 แล้วเว้นช่องคันเบ็ดว่าง",
        "เข้าหมู่บ้านจากสนาม (61,21) หีบอยู่ในเมืองที่ (4,6)",
        "หีบล็อกที่ยังไม่เปิดให้คันลัวร์เล็ก 0A และไม่ใช้กุญแจทิ้ง ถ้ามีคันนี้แล้วไม่จำเป็นต้องซื้อซ้ำเพื่อทำรายการนี้"
      ],
      warning: "เว้นช่องคันเบ็ดก่อนเปิดหีบ",
      limit: "หีบในเมืองกับทางเข้าสนามเป็นคนละตำแหน่ง ทางเข้ากับสต็อกและราคาขายกุญแจมาจาก ROM ยังไม่ใช่การเดินหรือทดลองซื้อกุญแจจากเซฟปกติในรอบนี้"
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
      title: "ลองจับสลากด้วยตั๋วและอาหารเหลือ เป็นกิจกรรมเสริม",
      steps: [
        "เว้นช่องอุปกรณ์ทั่วไป เข้าหมู่บ้านจากสนาม (59,27) รับสลาก 11 จากหีบในเมือง (4,6) ไม่ต้องใช้กุญแจ",
        "ถ้ามีอาหารเหลือ ให้ข้าวกล่องบ๊วย 06 หรือหัวไชเท้า 07 แก่จิโซในสนาม (49,22) ก่อนจับรางวัล สองชิ้นนี้ช่วยเปลี่ยนผลแพ้ได้มากกว่าส้ม 01 ก่อนถึงเพดาน แต่ใกล้เพดานอาจได้ผลเท่ากัน",
        "นำสลากไปจุดจับรางวัลในสนาม (54,22) อาจได้ ¥100 / ¥1,000 / ¥5,000 หรือไม่ได้รางวัล"
      ],
      warning: "อาหารที่ให้และสลากถูกใช้ไป ไม่ควรซื้ออาหารหรือแลกปลาเพื่อจับสลากอย่างเดียว เพราะไม่รับประกันรางวัล",
      limit: "ยืนยันแขนงเกณฑ์และเงินรางวัล แต่ยังไม่ใช่อัตราชนะที่วัดจากการเล่น และไม่ใช่ขั้นตอนบังคับของเนื้อเรื่อง"
    },
    "candle-reunion": {
      title: "รับเทียนแล้วนำไปให้คนที่จุดนัดพบ",
      steps: [
        "ถ้ามีกุญแจ 17 แล้วให้ใช้ของเดิม ถ้ายังไม่มี ซื้อหนึ่งดอกจากร้านอุปกรณ์ปกติด่าน 6 ราคา ¥100 แล้วเว้นช่องอุปกรณ์ทั่วไป",
        "เข้าหมู่บ้านจากสนาม (9,41) เปิดหีบในเมือง (4,6) รับเทียน 12 กุญแจยังอยู่",
        "นำเทียนไปหา NPC ในสนามด่าน 6 ที่ (47,36) เทียนถูกใช้ไปเพื่อเริ่มเหตุการณ์ส่งสัญญาณ/กลับมาพบกัน กดใช้เทียนเฉย ๆ จะแสดงแค่คำอธิบาย"
      ],
      warning: "เว้นช่องก่อนเปิดหีบ และเก็บเทียนจนถึง NPC ที่ใช้ในเหตุการณ์",
      limit: "บทพูดเรื่องอาคาเมะภายหลังของตัวละครหมายเลข 1 เป็นคำใบ้ ไม่ใช่พิกัดตกที่แน่นอนหรือข้อพิสูจน์ว่าทุกตัวละครต้องตกปลานี้เพื่อไปต่อ"
    },
    "giant-eel-return": {
      title: "หลังได้รับคำขอของหมอ: เก็บปลาไหลยักษ์แล้วกลับหมู่บ้านนี้",
      steps: [
        "ทำตามเส้นทางกลับนี้เมื่อเข้าเงื่อนไขเนื้อเรื่องคำขอของหมอ และเก็บปลาไหลยักษ์ 3B ในกระชังแล้วเท่านั้น",
        "อย่าขายปลาไหล และอย่ากินปลาตัวแรกในกระชังถ้าตัวแรกคือปลาไหล",
        "เข้าหมู่บ้านด่าน 1 ทางสนาม (12,189) เมื่อเข้าเงื่อนไข การมาถึงในเมืองที่ (7,77) จะเริ่มฉากหมอฟื้นและตอนจบ ยังไม่มีหลักฐานว่าต้องไปส่งกับ NPC หมอแยกต่างหาก"
      ],
      warning: "มีปลาไหลอย่างเดียวไม่ได้รับประกันตอนจบ ต้องเช็กคำขอที่ได้รับและเงื่อนไขเนื้อเรื่องด้วย",
      limit: "หลักฐานจากโค้ดและบทพูด ROM ญี่ปุ่น ยังไม่ได้เล่นจบจากเซฟปกติ ไม่ยืนยันรางวัลแน่นอน การใช้ปลาไหลทิ้ง หรือความตรงกันของแพตช์ไทย"
    },
    "giant-eel-request": {
      title: "ได้รับคำขอของหมอแล้ว? ตกปลาไหลยักษ์ เก็บไว้ แล้วกลับหมู่บ้าน",
      steps: [
        "เปิดไปรษณียบัตรที่ได้รับ 06 ตรวจว่ามีคำขอของหมอก่อนทำตามเส้นทางนี้ ถ้ายังไม่มีคำขอ อย่าเพิ่งถือว่าเป้าหมายนี้เปิดแล้ว",
        "ใช้ทิศทาง/จุดเป้าหมายด่าน 6 ที่ (41,8) เมื่อเปิดทำงานแล้ว และเลือกอุปกรณ์ที่ใช้ได้จากหน้าปลาไหลยักษ์ 3B",
        "เก็บปลาไหลในกระชัง แล้วกลับหมู่บ้านด่าน 1 ทางสนาม (12,189) ที่ทำเครื่องหมายไว้ เมื่อเข้าเงื่อนไขจะเกิดฉากหมอฟื้นและตอนจบ"
      ],
      warning: "จุดเป้าหมายแบบไดนามิกอาจยังไม่ทำงาน อย่าขายหรือกินปลาไหล การตกได้อย่างเดียวไม่รับประกันตอนจบ",
      limit: "โค้ดอ่านไปรษณียบัตรเปิดทิศทางเมื่อมีช่องสถิติสมุดที่ไม่เป็นศูนย์ 65 ชนิดและสถานะเนื้อเรื่องที่กำหนด ไม่ใช่ตก 65 ตัว โควตาของด่าน หรือเงื่อนไขที่สร้างจดหมายให้อัตโนมัติ แขนงกลับหมู่บ้านมาจาก ROM แต่ยังไม่ได้เล่นจบด้วยเซฟปกติ รางวัล การใช้ปลาไหลทิ้ง และความตรงกันของแพตช์ไทยยังไม่ยืนยัน"
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
      title: "カギがあれば、村の宝箱からイモエサを取る",
      steps: [
        "カギ17があればそのまま使う。なければエリア1の通常の道具店で1個100円で買い、エサ欄を1つ空ける。",
        "フィールド（12,189）から村へ入る。宝箱は町の（5,68）にあり、釣り場の座標ではない。",
        "施錠された宝箱からイモエサ11を受け取る。カギは残る。"
      ],
      warning: "開ける前にエサ欄を空ける。報酬を渡す処理はエサ欄の容量を確認する。",
      limit: "入口の対応とカギの店頭在庫・販売価格はROMから確認。通常セーブからの移動や今回の新しいカギ購入再現ではない。"
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
      title: "カギで宝箱を開け、ブドウムシを取る",
      steps: [
        "カギ17があればそのまま使う。なければエリア2の通常の道具店で1個100円で買い、エサ欄を1つ空ける。",
        "フィールド（85,28）の入口から町へ。宝箱は町の（4,6）にある。",
        "施錠された宝箱からブドウムシ0Bを受け取る。カギは消費しない。"
      ],
      warning: "宝箱を開ける前にエサ欄を空ける。",
      limit: "町とフィールドの座標は別。入口の対応とカギの在庫・販売価格はROMの証拠で、今回の通常移動やカギ購入の再現ではない。"
    },
    "milk-canoe": {
      title: "空きビンに牛乳を入れ、回復かカヌー交換を選ぶ",
      steps: [
        "道具欄を1つ空ける。フィールド（26,39）から町へ入り、町の宝箱（6,4）で空きビン0Fを取る。カギは不要。",
        "そのビンをエリア3のフィールド（6,103）の牛へ持っていく。牛乳10に変わる。",
        "カヌー02が欲しく、まだ持っていなければ、牛乳を飲まずにフィールド（28,39）の作り手へ。回復したい場合は牛乳を飲んで現在HPを最大まで戻し、返った空きビンを牛の所で再び満たす。"
      ],
      warning: "飲むと交換用の牛乳がなくなる。交換する前に再び満たす。最初のビンを受け取る空きも必要。",
      limit: "ビン・牛・カヌーの処理を確認。カヌー交換時の満杯挙動や通常セーブからの移動全体は未確認。"
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
      title: "ルアーロッド小を買う前に、施錠された宝箱を確認する",
      steps: [
        "カギ17があればそのまま使う。なければエリア4の通常の道具店で1個100円で買い、竿欄を1つ空ける。",
        "フィールド（61,21）から町に入り、町の（4,6）の宝箱を探す。",
        "未開封の宝箱からルアーロッド小0Aを受け取る。カギは残る。すでに持っているなら、このためにもう1本買う必要はない。"
      ],
      warning: "開ける前に竿欄の空きを作る。",
      limit: "町の宝箱とフィールドの入口は別。入口の対応とカギの在庫・販売価格はROMの証拠で、今回の通常移動やカギ購入の再現ではない。"
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
      title: "富くじと余った食べ物で、任意の抽選を試す",
      steps: [
        "道具欄を1つ空ける。フィールド（59,27）から町へ入り、町の宝箱（4,6）で富くじ11を取る。カギは不要。",
        "余り物があれば、抽選前にフィールド（49,22）の地蔵へ日の丸弁当06か大根07を供える。上限前ならミカン01より多くの外れを当たりに変えられるが、上限近くでは効果が同じ場合もある。",
        "フィールド（54,22）の抽選所へくじを持っていく。100円・1,000円・5,000円、または外れ。"
      ],
      warning: "供えた食べ物とくじは消費される。当選保証はないので、このためだけに食べ物を買ったり魚を交換したりしない。",
      limit: "閾値と賞金の分岐を確認したもので、実測の当選率ではない。必須の進行ではない。"
    },
    "candle-reunion": {
      title: "ロウソクを取って、再会イベントの人物へ届ける",
      steps: [
        "カギ17があればそのまま使う。なければエリア6の通常の道具店で1個100円で買い、道具欄を1つ空ける。",
        "フィールド（9,41）から町へ入り、町の宝箱（4,6）でロウソク12を取る。カギは残る。",
        "エリア6のフィールド（47,36）の人物へ届ける。ロウソクを消費して合図・再会の場面が始まる。単に使用を選ぶだけでは説明文が出る。"
      ],
      warning: "宝箱を開ける前に空きを作り、イベントの人物に会うまでロウソクを残す。",
      limit: "その後のキャラクター選択値1向けアカメの台詞はヒントであり、正確な釣り座標や全キャラクターの必須捕獲条件ではない。"
    },
    "giant-eel-return": {
      title: "医者の依頼の後：オオウナギを残してこの村へ戻る",
      steps: [
        "医者の依頼のストーリー条件を満たし、オオウナギ3Bを魚かごに保存した場合だけ、この帰路を使う。",
        "売らずに残す。かごの先頭がオオウナギなら、先頭の魚を食べない。",
        "エリア1のフィールド（12,189）から村へ入る。条件を満たした町（7,77）への到着で医者の回復とエンディングが始まる。別の医者NPCへの手渡し取引は確認されていない。"
      ],
      warning: "ウナギだけではエンディングを保証しない。受け取った依頼とストーリー条件を先に確認する。",
      limit: "日本語ROMの静的コードと台詞による証拠で、通常プレイの全行程再現ではない。正確な報酬、魚の消費、タイ語パッチとの一致は未確認。"
    },
    "giant-eel-request": {
      title: "医者の依頼があるなら、オオウナギを釣って残し、村へ戻る",
      steps: [
        "届いた絵はがき06を読み、医者の依頼があることを確認してからこのルートを使う。依頼がなければ、この目標が有効だとは考えない。",
        "有効になったエリア6の方角・目標（41,8）を使い、オオウナギ3Bのページで対応する道具を選ぶ。",
        "魚かごに保存して残し、印のあるエリア1の村入口、フィールド（12,189）へ戻る。条件を満たせば医者の回復とエンディングに進む。"
      ],
      warning: "動的な目標はまだ無効の場合がある。売ったり食べたりしない。釣っただけではエンディングを保証しない。",
      limit: "絵はがきの読取処理は、ゼロではない魚種記録65種類と所定のストーリー状態で方角を有効にする。65匹、エリア別ノルマ、自動的な手紙生成の条件ではない。帰村の分岐はROMから確認したが、通常セーブでの完走は再現していない。正確な報酬、魚の消費、タイ語パッチとの一致は未確認。"
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
