(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/gear-guide/index.js
  var gear_guide_exports = {};
  __export(gear_guide_exports, {
    initialize: () => initialize
  });

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/entities/best-gear/copy_en.js
  var copy_en = {
    title: "Gear for this fish",
    size: (low, high) => `Real size ${low === high ? low : `${low}–${high}`} cm`,
    maxSize: (high) => `MAX size ${high} cm`,
    maxSlow: "Takes long to raise",
    maxSlowNote: (picks, nights) => `MAX needs ${picks[0]}–${picks[1]} inn nights that pick its cell; at about 30 fights between nights that is roughly ${nights[0]}–${nights[1]} nights.`,
    maxAkame: "MAX size 150 cm only for character 1 before the quest fish is landed. Everyone else gets 60–119 cm.",
    maxEel: "MAX size 220 cm, one eel per game, in the eel story only. It does not grow and loses 2 cm after each lost fight.",
    methods: { float: "Float rod + bait", lure: "Lure rod + lure", fly: "Fly rod + fly" },
    slots: { rod: "Rod", hook: "Hook", bait: "Bait", lure: "Lure", fly: "Fly body", float: "Float" },
    anyFloat: (name) => `Any float works (cheapest: ${name})`,
    best: "Easiest-start kit",
    cheap: "Cheapest kit that still works well",
    total: (price) => `Total ${price}`,
    level: ["Easiest", "Easy", "Easy", "Medium", "Hard", "Very hard", "Very hard"],
    bands: ["Small fish (up to 15 cm)", "Medium fish (16–35 cm)", "Big fish (over 35 cm)"],
    bandShort: ["Small", "Medium", "Big"],
    fightEase: "How easy the fight starts",
    why: {
      rod: {
        named: "The rod named for this fish: it skips the fish-size penalty",
        light: "Light rod: easiest on small fish, and ties with a medium rod on medium fish",
        medium: "Medium rod: as easy as a light rod for fish this size",
        heavy: "Heavy rod: does not make the fight easier, but gives the long reach big fish need"
      },
      hook: {
        named: "The hook named for this fish: one step easier",
        any: "Any hook will do, because the bait is already named for this fish (take the cheapest)",
        small: "Small hook, right for fish up to 15 cm",
        medium: "Medium hook, right for fish 16–35 cm",
        large: "Big hook, right for fish over 35 cm",
        plain: "This hook does not change the fight"
      },
      bait: {
        named: "The bait named for this fish: one step easier",
        plain: "The fish takes this bait; take the cheapest one it takes"
      },
      lure: {
        named: "The lure named for this fish: one step easier",
        small: "This lure type helps small fish (up to 15 cm)",
        medium: "This lure type helps fish 16–35 cm",
        large: "This lure type helps fish over 35 cm",
        plain: "This lure does not change the fight"
      },
      fly: {
        small: "This fly body helps small fish (up to 15 cm)",
        medium: "This fly body helps fish 16–35 cm",
        large: "This fly body helps fish over 35 cm",
        plain: "This fly body does not change the fight; it only decides whether the fish bites"
      }
    },
    alsoOk: "Also fine (equally easy)",
    detailsTitle: "Why this kit (ROM evidence)",
    startsLine: (base) => `This fish starts at level ${base} before any gear (0 easiest to 6 hardest)`,
    startsWith: (band, n) => `${band}: level ${n} with this kit`,
    reach: (need) => `Rod reach needed: about ${need} or more. This is only an estimate from the wiki’s own simulation, not proven in the ROM`,
    evidence: "Every rule has a ROM address and a test that runs the real game. The full table and rules:",
    evidenceLink: "gear-fish-matrix.md",
    noBite: "This fish does not take this method",
    buyAt: "Buy at:",
    stage: (n) => `Stage ${n}`,
    shops: { shop: "shop", special: "special rod shop", fly: "ready-made fly shop" },
    laterHead: (n) => `Once you reach stage ${n}:`,
    nothingYet: (n) => `The shops of stage ${n} and earlier do not sell anything this fish takes with this method yet`,
    yen: (n) => `¥${n.toLocaleString("en-US")}`,
    loading: "Loading the gear…",
    failed: "Could not load the gear"
  };

  // src/entities/best-gear/copy_ja.js
  var copy_ja = {
    title: "この魚の仕掛け",
    size: (low, high) => `実際のサイズ ${low === high ? low : `${low}–${high}`} cm`,
    maxSize: (high) => `最大サイズ ${high} cm`,
    maxSlow: "育つまで長い",
    maxSlowNote: (picks, nights) => `MAXになるには、その魚のマスが宿の夜に${picks[0]}〜${picks[1]}回選ばれる必要があります。夜の間に約30回ファイトする場合、およそ${nights[0]}〜${nights[1]}泊です。`,
    maxAkame: "最大サイズ150cmはキャラクター1がクエストの魚を釣る前だけ。ほかの人は60〜119cmです。",
    maxEel: "最大サイズ220cm。1ゲームに1匹、ウナギの話の間だけ。育たず、ファイトで逃がすたびに2cm小さくなります。",
    methods: { float: "ウキ竿 + エサ", lure: "ルアー竿 + ルアー", fly: "フライ竿 + フライ" },
    slots: {
      rod: "竿",
      hook: "ハリ",
      bait: "エサ",
      lure: "ルアー",
      fly: "フライ（ボディ）",
      float: "ウキ"
    },
    anyFloat: (name) => `ウキはどれでもOK（いちばん安い：${name}）`,
    best: "最初の戦いがいちばん楽な組み合わせ",
    cheap: "十分使える中でいちばん安い組み合わせ",
    total: (price) => `合計 ${price}`,
    level: ["いちばん楽", "楽", "楽", "ふつう", "難しい", "とても難しい", "とても難しい"],
    bands: ["小さい魚（15 cm 以下）", "中くらいの魚（16–35 cm）", "大きい魚（35 cm 超）"],
    bandShort: ["小", "中", "大"],
    fightEase: "ファイトの始まりの楽さ",
    why: {
      rod: {
        named: "この魚の名前がついた竿。サイズによる不利がありません",
        light: "軽い竿。小さい魚にいちばん楽で、中くらいの魚では中の竿と同じです",
        medium: "中の竿。このサイズの魚では軽い竿と同じ楽さです",
        heavy: "重い竿。ファイトは楽になりませんが、大きい魚に必要な長い距離が出ます"
      },
      hook: {
        named: "この魚の名前がついたハリ。1段階楽になります",
        any: "エサがこの魚の名前つきなので、ハリは何でもOK（いちばん安いもの）",
        small: "小さいハリ。15 cm 以下の魚向き",
        medium: "中のハリ。16–35 cm の魚向き",
        large: "大きいハリ。35 cm 超の魚向き",
        plain: "このハリはファイトを変えません"
      },
      bait: {
        named: "この魚の名前がついたエサ。1段階楽になります",
        plain: "この魚が食べるエサ。食べるものの中でいちばん安いものを"
      },
      lure: {
        named: "この魚の名前がついたルアー。1段階楽になります",
        small: "このタイプのルアーは小さい魚（15 cm 以下）に有利",
        medium: "このタイプのルアーは 16–35 cm の魚に有利",
        large: "このタイプのルアーは 35 cm 超の魚に有利",
        plain: "このルアーはファイトを変えません"
      },
      fly: {
        small: "このフライボディは小さい魚（15 cm 以下）に有利",
        medium: "このフライボディは 16–35 cm の魚に有利",
        large: "このフライボディは 35 cm 超の魚に有利",
        plain: "このフライボディはファイトを変えず、食うかどうかだけを決めます"
      }
    },
    alsoOk: "代わりに使える（同じ楽さ）",
    detailsTitle: "なぜこの組み合わせか（ROMの根拠）",
    startsLine: (base) => `この魚は装備なしだとレベル ${base} から始まります（0 が最も楽、6 が最も難しい）`,
    startsWith: (band, n) => `${band}：この組み合わせでレベル ${n}`,
    reach: (need) => `必要な竿の距離：約 ${need} 以上。これはウィキ自身のシミュレーションによる推定で、ROMでは証明されていません`,
    evidence: "すべてのルールにROMのアドレスと、実際のゲームを動かすテストがあります。全表とルール：",
    evidenceLink: "gear-fish-matrix.md",
    noBite: "この魚はこの方法では食いません",
    buyAt: "購入先:",
    stage: (n) => `エリア${n}`,
    shops: { shop: "店", special: "特別な竿屋", fly: "完成品の毛バリ屋" },
    laterHead: (n) => `エリア${n}に着いたら:`,
    nothingYet: (n) => `エリア${n}までの店には、この魚がこの方法で食うものはまだ売っていません`,
    yen: (n) => `¥${n.toLocaleString("en-US")}`,
    loading: "装備を読み込み中…",
    failed: "装備を読み込めませんでした"
  };

  // src/entities/best-gear/copy_th.js
  var copy_th = {
    title: "ชุดเบ็ดสำหรับปลานี้",
    size: (low, high) => `ขนาดจริง ${low === high ? low : `${low}–${high}`} ซม.`,
    maxSize: (high) => `ไซส์ MAX ${high} ซม.`,
    maxSlow: "ต้องเลี้ยงนาน",
    maxSlowNote: (picks, nights) => `ไซส์ MAX ต้องรอให้คืนที่พักโรงแรมเลือกช่องของปลาตัวนี้ ${picks[0]}–${picks[1]} ครั้ง ถ้าสู้ปลาราว 30 ครั้งระหว่างคืน ก็ราว ${nights[0]}–${nights[1]} คืน`,
    maxAkame: "ไซส์ MAX 150 ซม. เฉพาะตัวละคร 1 ก่อนตกปลาเควสต์ได้ คนอื่นได้ 60–119 ซม.",
    maxEel: "ไซส์ MAX 220 ซม. มีตัวเดียวต่อเกม เฉพาะช่วงเรื่องปลาไหล ไม่โตขึ้น และเสีย 2 ซม. ทุกครั้งที่สู้หลุด",
    methods: { float: "คันทุ่น + เหยื่อ", lure: "คันลัวร์ + ลัวร์", fly: "คันฟลาย + ฟลาย" },
    slots: {
      rod: "คัน",
      hook: "เบ็ด",
      bait: "เหยื่อ",
      lure: "ลัวร์",
      fly: "ฟลาย (บอดี้)",
      float: "ทุ่น"
    },
    anyFloat: (name) => `ทุ่นอะไรก็ได้ (ถูกสุด: ${name})`,
    best: "ชุดที่สู้ง่ายที่สุดตอนเริ่ม",
    cheap: "ชุดที่ถูกที่สุดที่ยังใช้ได้ดี",
    total: (price) => `รวม ${price}`,
    level: ["ง่ายที่สุด", "ง่าย", "ง่าย", "ปานกลาง", "ยาก", "ยากมาก", "ยากมาก"],
    bands: ["ปลาเล็ก (ไม่เกิน 15 ซม.)", "ปลากลาง (16–35 ซม.)", "ปลาใหญ่ (เกิน 35 ซม.)"],
    bandShort: ["เล็ก", "กลาง", "ใหญ่"],
    fightEase: "การสู้เริ่มง่ายแค่ไหน",
    why: {
      rod: {
        named: "คันที่ตั้งชื่อตามปลานี้ ไม่โดนบวกความยากตามขนาดปลา",
        light: "คันเบา ง่ายที่สุดกับปลาเล็ก และเท่ากับคันกลางกับปลาขนาดกลาง",
        medium: "คันกลาง ง่ายพอ ๆ กับคันเบาสำหรับปลาขนาดนี้",
        heavy: "คันหนัก ไม่ได้ทำให้การสู้ง่ายขึ้น แต่ให้ระยะสายไกลสำหรับปลาตัวใหญ่"
      },
      hook: {
        named: "เบ็ดที่ตั้งชื่อตามปลานี้ ง่ายขึ้นหนึ่งขั้น",
        any: "ไม่ต้องเลือกเบ็ด เพราะเหยื่อนี้ชื่อตรงกับปลาแล้ว (ใช้อันถูกสุด)",
        small: "เบ็ดเล็ก เหมาะกับปลาไม่เกิน 15 ซม.",
        medium: "เบ็ดกลาง เหมาะกับปลา 16–35 ซม.",
        large: "เบ็ดใหญ่ เหมาะกับปลาเกิน 35 ซม.",
        plain: "เบ็ดนี้ไม่ทำให้การสู้ต่างไป"
      },
      bait: {
        named: "เหยื่อที่ตั้งชื่อตามปลานี้ ง่ายขึ้นหนึ่งขั้น",
        plain: "ปลากินเหยื่อนี้ เลือกอันถูกสุดที่ปลากิน"
      },
      lure: {
        named: "ลัวร์ที่ตั้งชื่อตามปลานี้ ง่ายขึ้นหนึ่งขั้น",
        small: "ลัวร์แบบนี้ช่วยปลาเล็ก (ไม่เกิน 15 ซม.)",
        medium: "ลัวร์แบบนี้ช่วยปลา 16–35 ซม.",
        large: "ลัวร์แบบนี้ช่วยปลาเกิน 35 ซม.",
        plain: "ลัวร์นี้ไม่ทำให้การสู้ต่างไป"
      },
      fly: {
        small: "บอดี้ฟลายแบบนี้ช่วยปลาเล็ก (ไม่เกิน 15 ซม.)",
        medium: "บอดี้ฟลายแบบนี้ช่วยปลา 16–35 ซม.",
        large: "บอดี้ฟลายแบบนี้ช่วยปลาเกิน 35 ซม.",
        plain: "บอดี้ฟลายนี้ไม่ทำให้การสู้ต่างไป มีผลแค่ว่าปลากินหรือไม่"
      }
    },
    alsoOk: "ใช้แทนกันได้ (ง่ายเท่ากัน)",
    detailsTitle: "ทำไมถึงเป็นชุดนี้ (หลักฐานจาก ROM)",
    startsLine: (base) => `ปลานี้เริ่มที่ระดับ ${base} ก่อนใส่อุปกรณ์ (0 ง่ายที่สุด ถึง 6 ยากที่สุด)`,
    startsWith: (band, n) => `${band}: ระดับ ${n} หลังใส่ชุดนี้`,
    reach: (need) => `ระยะสายที่ต้องใช้: ประมาณ ${need} ขึ้นไป เป็นค่าประมาณจากการจำลองของวิกิเท่านั้น ยังไม่ได้พิสูจน์จาก ROM`,
    evidence: "ทุกกฎมีที่อยู่โค้ดใน ROM และมีเทสต์ที่รันเกมจริงยืนยัน ดูตารางและกฎทั้งหมดที่",
    evidenceLink: "gear-fish-matrix.md",
    noBite: "ปลานี้ไม่กินวิธีนี้",
    buyAt: "ซื้อที่:",
    stage: (n) => `ด่าน ${n}`,
    shops: { shop: "ร้านค้า", special: "ร้านขายคันพิเศษ", fly: "ร้านฟลายสำเร็จรูป" },
    laterHead: (n) => `ถ้าไปถึงด่าน ${n} แล้ว:`,
    nothingYet: (n) => `ร้านในด่าน ${n} และด่านก่อนหน้ายังไม่มีของที่ปลาตัวนี้กินด้วยวิธีนี้ขาย`,
    yen: (n) => `¥${n.toLocaleString("en-US")}`,
    loading: "กำลังโหลดชุดอุปกรณ์…",
    failed: "โหลดชุดอุปกรณ์ไม่สำเร็จ"
  };

  // src/entities/best-gear/view.js
  var COPY = { en: copy_en, th: copy_th, ja: copy_ja };
  var SLOT_OF_METHOD = { float: "bait", lure: "lure", fly: "fly" };
  var PIPS = 6;
  var bestGearCopy = (locale) => COPY[locale] ?? copy_en;
  var escapeHtml = (value) => String(value).replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]
  );
  function itemName(data, locale, slot, id) {
    const entry = data.names[slot]?.[id];
    return entry?.[locale] ?? entry?.en ?? String(id);
  }
  function kitSlots(method, kit) {
    const slots = [["rod", kit.rod, "rod"]];
    if (method === "float") slots.push(["hook", kit.hook, "hook"]);
    const second = SLOT_OF_METHOD[method];
    slots.push([second, kit[second], second]);
    return slots;
  }
  function easePips(text, notch) {
    const filled = PIPS - notch;
    const label = `${text.level[notch]} (${filled}/${PIPS})`;
    const dots = Array.from({ length: PIPS }, (_, i) => `<i${i < filled ? ' class="on"' : ""}></i>`);
    return `<span class="bg-pips" role="img" aria-label="${escapeHtml(label)}">${dots.join("")}</span>`;
  }
  function easeByBand(text, starts) {
    const items = starts.map(
      (notch, band) => notch == null ? "" : `<li><span class="bg-band">${escapeHtml(text.bandShort[band])}</span>${easePips(text, notch)}<span>${escapeHtml(text.level[notch])}</span></li>`
    ).join("");
    return `<ul class="bg-ease" aria-label="${escapeHtml(text.fightEase)}">${items}</ul>`;
  }
  var buyText = (text, [stage, shop]) => `${text.buyAt} ${text.stage(stage)} ${text.shops[shop]}`;
  var buyOf = (kit, slot) => kit.buy[slot === "rod" || slot === "hook" ? slot : "item"];

  // src/entities/best-gear/max.js
  function maxHtml(text, fish) {
    const max = fish.max;
    if (max?.status === "quest-only") return escapeHtml(text.maxAkame);
    if (max?.status === "story-only") return escapeHtml(text.maxEel);
    const line = escapeHtml(text.maxSize(fish.size[1]));
    if (!max?.slow) return line;
    const note = escapeHtml(text.maxSlowNote(max.picks, max.nights));
    return `${line} <span class="bg-tag">${escapeHtml(text.maxSlow)}</span><small>${note}</small>`;
  }
  var shownHigh = (fish) => fish.max?.status === "quest-only" ? fish.max.reachable.otherwise : fish.size[1];

  // src/pages/gear-guide/best-table.js
  var suffixes = { en: "", th: ".th", ja: ".ja" };
  var SECOND = { float: "bait", lure: "lure", fly: "fly" };
  var LABELS = {
    en: ["Size", "Rod", "Hook", "Fight start", "Price"],
    th: ["ขนาด", "คัน", "เบ็ด", "การสู้เริ่ม", "ราคา"],
    ja: ["サイズ", "竿", "ハリ", "ファイト開始", "価格"]
  };
  function fishLink(locale, id) {
    const hex = Number(id).toString(16).toUpperCase().padStart(2, "0");
    return `fish${suffixes[locale]}.html?id=${hex}&return=gear-guide${suffixes[locale]}.html`;
  }
  function itemCell(data, locale, label, slot, id, group, kit) {
    const text = bestGearCopy(locale);
    const why = kit.why[group === "rod" || group === "hook" ? group : "item"];
    const buy = escapeHtml(buyText(text, buyOf(kit, slot)));
    const reason = why && why !== "plain" && why !== "any" ? text.why[group]?.[why] : "";
    const name = id == null ? "–" : escapeHtml(itemName(data, locale, slot, id));
    return `<td data-label="${escapeHtml(label)}"><span>${name}${reason ? `<small>${escapeHtml(reason)}</small>` : ""}<small>${buy}</small></span></td>`;
  }
  var colCount = (ctx) => ctx.method === "float" ? 6 : 5;
  function noteRow(ctx, html) {
    return `<tr class="bg-note-row"><td class="bg-later-cell" colspan="${colCount(ctx) + 1}">${html}</td></tr>`;
  }
  function laterRow(ctx, plan) {
    const { data, locale } = ctx;
    const text = bestGearCopy(locale);
    const { kit, stage } = plan.later;
    const names = kitSlots(ctx.method, kit).map(
      ([slot, id]) => `${escapeHtml(itemName(data, locale, slot, id))} <small>(${escapeHtml(buyText(text, buyOf(kit, slot)))})</small>`
    );
    return noteRow(
      ctx,
      `<strong>${escapeHtml(text.laterHead(stage))}</strong> ${names.join(" · ")}<div>${easeByBand(text, kit.starts)}</div>${escapeHtml(text.yen(kit.yen))}`
    );
  }
  function rowHtml(ctx, id, fish, stage, plan) {
    const { data, locale } = ctx;
    const text = bestGearCopy(locale);
    const [size, rod, hook, start2, price] = LABELS[locale];
    const kit = plan.kits[0];
    const second = SECOND[ctx.method];
    const name = escapeHtml(itemName(data, locale, "fish", id));
    const head = `<td><a href="${escapeHtml(fishLink(locale, id))}"><strong>${name}</strong></a> <span class="bg-tag">${escapeHtml(text.stage(stage))}</span></td>`;
    const later = plan.later ? laterRow(ctx, plan) : "";
    if (!kit)
      return `<tr>${head}<td colspan="${colCount(ctx)}">${escapeHtml(text.nothingYet(stage))}</td></tr>${later}`;
    const secondLabel = text.slots[second];
    return `<tr>${head}
<td data-label="${size}"><span>${escapeHtml(text.size(fish.size[0], shownHigh(fish)))}<small>${maxHtml(text, fish)}</small></span></td>
${itemCell(data, locale, rod, "rod", kit.rod, "rod", kit)}
${ctx.method === "float" ? itemCell(data, locale, hook, "hook", kit.hook, "hook", kit) : ""}
${itemCell(data, locale, secondLabel, second, kit[second], second, kit)}
<td data-label="${start2}"><div>${easeByBand(text, kit.starts)}</div></td>
<td data-label="${price}">${escapeHtml(text.yen(kit.yen))}</td></tr>${later}`;
  }
  function headHtml(ctx) {
    const text = bestGearCopy(ctx.locale);
    const [size, rod, hook, start2, price] = LABELS[ctx.locale];
    const cols = [
      ctx.fishLabel,
      size,
      rod,
      ...ctx.method === "float" ? [hook] : [],
      text.slots[SECOND[ctx.method]],
      start2,
      price
    ];
    return `<thead><tr>${cols.map((col) => `<th scope="col">${escapeHtml(col)}</th>`).join("")}</tr></thead>`;
  }
  function matches(ctx, id, query) {
    if (!query) return true;
    const names = Object.values(ctx.data.names.fish[id] ?? {}).join(" ").toLowerCase();
    return names.includes(query) || String(id) === query;
  }
  function visibleFish(ctx) {
    const query = ctx.query.trim().toLowerCase();
    const collator = new Intl.Collator(ctx.locale);
    return Object.entries(ctx.data.best.fish).filter(([id, fish]) => fish.methods[ctx.method] && matches(ctx, id, query)).sort(
      ([a], [b]) => collator.compare(
        itemName(ctx.data, ctx.locale, "fish", a),
        itemName(ctx.data, ctx.locale, "fish", b)
      )
    );
  }
  function stageRows(ctx, id, fish) {
    const plan = fish.methods[ctx.method];
    return Object.entries(plan.stages).map(([stage, entry]) => rowHtml(ctx, id, fish, +stage, entry)).join("");
  }
  function renderTable(ctx) {
    const rows = visibleFish(ctx);
    const text = bestGearCopy(ctx.locale);
    ctx.target.innerHTML = rows.length ? `<table class="bg-table">${headHtml(ctx)}<tbody>${rows.map(([id, fish]) => stageRows(ctx, id, fish)).join("")}</tbody></table>` : `<p class="bg-empty">${escapeHtml(text.noBite)}</p>`;
  }
  function bindTable(ctx, search, radios) {
    search.addEventListener("input", () => {
      ctx.query = search.value;
      renderTable(ctx);
    });
    for (const radio of radios)
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        ctx.method = radio.value;
        renderTable(ctx);
      });
  }

  // src/pages/gear-guide/copy_en.js
  var areaWord = (list) => list.length === 1 ? `Area ${list[0]}` : `Areas ${list.join(", ")}`;
  var copy_en_default = {
    fishLabel: "Fish",
    loading: "Loading the kit data…",
    failed: "Could not load the kit data.",
    retry: "Try again",
    sizeLine: (low, high) => low === high ? `Size ${low} cm.` : `Size ${low} to ${high} cm.`,
    reachLine: (need) => `Needs a rod with reach ${need} or more.`,
    methods: {
      float: "Float rod + bait",
      casting: "Casting rod + sinker",
      lure: "Lure rod + lure",
      fly: "Fly rod + fly"
    },
    hints: {
      casting: "Bottom fish only, and the bite takes about 10 seconds. The float kit catches this fish too.",
      lure: "Keep tapping A or B; press A once when the fish is level with the lure.",
      fly: "On a fresh save some flies never bite (see the fly card). This kit already avoids them."
    },
    slots: {
      rod: "Rod",
      hook: "Hook",
      bait: "Bait",
      lure: "Lure",
      fly: "Fly"
    },
    roles: {
      buy: "Easiest-start kit you can buy",
      enough: "Cheaper, almost as good (within 3 points)"
    },
    total: (price) => `Kit total ${price}`,
    from: (price) => `from ${price}`,
    extra: (name, price) => `Also needed, any will do: ${name} (${price})`,
    where: {
      all: "every area",
      areas: areaWord,
      special: (list) => `special rod merchant, ${areaWord(list)}`,
      readyMade: "ready-made fly"
    },
    mistakes: (low, high) => `Mistakes allowed: ${low === high ? low : `${low} to ${high}`} (of 6, more is easier)`,
    caught: (pct, n) => `Landed in ${pct} of ${n} simulated fights`,
    running: (pct) => `${pct} were still going after 100 seconds (slow, not lost)`,
    lost: (pct) => `${pct} lost the tackle`,
    notSimulated: "Landing odds are not simulated for lures and flies.",
    neverSold: (names) => `The roomiest rod for this fish (${names}) is never sold. This is the easiest start you can buy.`,
    flySwapped: (from, to) => `The cheapest fly for this fish (${from}) never bites on a fresh save, so this kit uses ${to}.`,
    simLink: "Try this kit in the fight simulator",
    fishLink: "Where to find this fish"
  };

  // src/pages/gear-guide/copy_th.js
  var areaWord2 = (list) => `ด่าน ${list.join(", ")}`;
  var copy_th_default = {
    fishLabel: "ปลา",
    loading: "กำลังโหลดข้อมูลชุดอุปกรณ์…",
    failed: "โหลดข้อมูลชุดอุปกรณ์ไม่สำเร็จ",
    retry: "ลองอีกครั้ง",
    sizeLine: (low, high) => low === high ? `ขนาด ${low} ซม.` : `ขนาด ${low}–${high} ซม.`,
    reachLine: (need) => `ต้องใช้คันที่ระยะสาย ${need} ขึ้นไป`,
    methods: {
      float: "คันทุ่น + เหยื่อ",
      casting: "คันหวด + ตะกั่ว",
      lure: "คันลัวร์ + ลัวร์",
      fly: "คันฟลาย + ฟลาย"
    },
    hints: {
      casting: "ตกได้เฉพาะปลาหน้าดิน และต้องรอกินนานราว 10 วินาที ชุดคันทุ่นก็ตกปลาตัวนี้ได้เหมือนกัน",
      lure: "กด A หรือ B รัว ๆ แล้วกด A ครั้งเดียวตอนปลาว่ายมาอยู่ระดับเดียวกับลัวร์",
      fly: "ในเซฟใหม่ ฟลายบางอันไม่มีวันมีปลากิน (ดูการ์ดฟลาย) ชุดนี้เลือกอันที่ใช้ได้ให้แล้ว"
    },
    slots: {
      rod: "คัน",
      hook: "เบ็ด",
      bait: "เหยื่อ",
      lure: "ลัวร์",
      fly: "ฟลาย"
    },
    roles: {
      buy: "ชุดที่เริ่มสู้ง่ายที่สุดที่ซื้อได้",
      enough: "ถูกกว่า แต่เกือบดีเท่ากัน (ห่างไม่เกิน 3 แต้ม)"
    },
    total: (price) => `รวมทั้งชุด ${price}`,
    from: (price) => `เริ่มที่ ${price}`,
    extra: (name, price) => `ต้องมีเพิ่ม ใช้อันไหนก็ได้: ${name} (${price})`,
    where: {
      all: "ทุกด่าน",
      areas: areaWord2,
      special: (list) => `ร้านขายคันพิเศษ ${areaWord2(list)}`,
      readyMade: "ฟลายสำเร็จรูป"
    },
    mistakes: (low, high) => `พลาดได้: ${low === high ? low : `${low}–${high}`} ครั้ง (เต็ม 6 ยิ่งมากยิ่งง่าย)`,
    caught: (pct, n) => `ตกได้ ${pct} จากการสู้ปลาจำลอง ${n} ครั้ง`,
    running: (pct) => `อีก ${pct} ยังสู้กันอยู่หลังผ่านไป 100 วินาที (ช้า ไม่ได้แปลว่าเสีย)`,
    lost: (pct) => `สายขาด ${pct}`,
    notSimulated: "ลัวร์และฟลายยังไม่ได้จำลองโอกาสตกได้",
    neverSold: (names) => `คันที่เผื่อพลาดได้มากที่สุดสำหรับปลาตัวนี้ (${names}) ไม่มีขายเลย ชุดนี้คือชุดที่เริ่มสู้ง่ายที่สุดที่ซื้อได้`,
    flySwapped: (from, to) => `ฟลายที่ถูกที่สุดสำหรับปลาตัวนี้ (${from}) ไม่มีวันมีปลากินในเซฟใหม่ ชุดนี้จึงใช้ ${to} แทน`,
    simLink: "ลองชุดนี้ในจำลองการสู้ปลา",
    fishLink: "ดูว่าปลาตัวนี้อยู่ที่ไหน"
  };

  // src/pages/gear-guide/copy_ja.js
  var areaWord3 = (list) => `エリア${list.join("・")}`;
  var copy_ja_default = {
    fishLabel: "魚",
    loading: "セットのデータを読み込み中…",
    failed: "セットのデータを読み込めませんでした。",
    retry: "再試行",
    sizeLine: (low, high) => low === high ? `大きさ ${low}cm。` : `大きさ ${low}〜${high}cm。`,
    reachLine: (need) => `リーチ${need}以上の竿が必要です。`,
    methods: {
      float: "ウキ竿＋エサ",
      casting: "投げ竿＋オモリ",
      lure: "ルアー竿＋ルアー",
      fly: "毛バリ竿＋毛バリ"
    },
    hints: {
      casting: "底の魚だけで、食うまで約10秒かかります。この魚はウキ竿のセットでも釣れます。",
      lure: "AかBを連打し、魚がルアーと同じ高さに来たらAを1回押します。",
      fly: "新しいセーブでは食わない毛バリがあります（毛バリのカード参照）。このセットはそれを避けています。"
    },
    slots: {
      rod: "竿",
      hook: "ハリ",
      bait: "エサ",
      lure: "ルアー",
      fly: "毛バリ"
    },
    roles: { buy: "買える中で一番よいセット", enough: "もっと安くて、ほぼ同じ（差3ポイント以内）" },
    total: (price) => `セット合計 ${price}`,
    from: (price) => `${price}から`,
    extra: (name, price) => `別途必要（どれでもOK）：${name}（${price}）`,
    where: {
      all: "全エリア",
      areas: areaWord3,
      special: (list) => `特別な竿屋・${areaWord3(list)}`,
      readyMade: "完成品の毛バリ"
    },
    mistakes: (low, high) => `ミスできる回数：${low === high ? low : `${low}〜${high}`}（最大6、多いほど楽）`,
    caught: (pct, n) => `シミュレーション${n}回のうち${pct}で釣り上げ`,
    running: (pct) => `${pct}は100秒たっても決着せず（遅いだけで失敗ではありません）`,
    lost: (pct) => `${pct}で仕掛けを失う`,
    notSimulated: "ルアーと毛バリの釣り上げ率はシミュレーションしていません。",
    neverSold: (names) => `この魚にいちばん余裕のある竿（${names}）は売っていません。これが買える中で出だしがいちばん楽です。`,
    flySwapped: (from, to) => `この魚に一番安い毛バリ（${from}）は新しいセーブでは食わないので、このセットは${to}にしています。`,
    simLink: "このセットをファイトシミュレーターで試す",
    fishLink: "この魚の居場所を見る"
  };

  // src/pages/gear-guide/copy.js
  var copy = { en: copy_en_default, th: copy_th_default, ja: copy_ja_default };

  // src/pages/gear-guide/format.js
  var escapeHtml2 = (value) => String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
  var yen = (value) => `¥${value.toLocaleString("en-US")}`;
  var percent = (value) => `${value > 0 && value < 1 ? 1 : Math.round(value)}%`;
  var localName = (record, locale) => record?.[locale] ?? record?.en ?? "";

  // src/pages/gear-guide/kits.js
  var SLOTS = ["rod", "hook", "bait", "lure", "fly"];
  var DEAD_BODY_CLASS = 1;
  var DEAD_WING_CLASS = 2;
  function liveBundles(effects, flyId) {
    if (flyId % 4 === DEAD_BODY_CLASS) return [];
    return effects.items.fly[flyId].bundles.filter((bundle) => bundle[3] % 4 !== DEAD_WING_CLASS);
  }
  var cheapest = (bundles) => Math.min(...bundles.map((bundle) => bundle[2]));
  function mainBand(fish) {
    return fish.n.indexOf(Math.max(...fish.n));
  }
  function mistakeRange(fish, kit) {
    const values = kit.m.filter((value, band) => value != null && fish.n[band] > 0);
    return [Math.min(...values), Math.max(...values)];
  }
  function catchStats(effects, fish, method, kit) {
    const sim = fish.methods[method].sim;
    if (!sim) return null;
    const m = kit.m[mainBand(fish)] ?? mistakeRange(fish, kit)[0];
    const row = sim.curve[String(effects.meta.startOf[m])];
    if (!row) return null;
    const total = effects.sample.starts;
    const [caught, escaped, lost, unfinished] = row.map((count) => count / total * 100);
    return { caught, escaped, lost, unfinished };
  }
  function workingFlyKit(effects, fish, kit) {
    if (liveBundles(effects, kit.fly).length) return { kit, swappedFrom: null };
    const rodYen = effects.items.rod[kit.rod].yen;
    for (const [m, ids] of fish.methods.fly.slots.fly) {
      const options = ids.filter((id) => liveBundles(effects, id).length).map((id) => ({ id, yen: cheapest(liveBundles(effects, id)) })).sort((a, b) => a.yen - b.yen || a.id - b.id);
      if (options.length)
        return {
          kit: { ...kit, fly: options[0].id, yen: rodYen + options[0].yen, m },
          swappedFrom: kit.fly
        };
    }
    return { kit, swappedFrom: kit.fly };
  }
  function placeOf(effects, slot, id, flyId = id) {
    const item = effects.items[slot][id];
    if (slot !== "fly") return { yen: item.yen, areas: item.areas, special: item.special ?? [] };
    const bundles = liveBundles(effects, flyId);
    const pool = bundles.length ? bundles : item.bundles;
    const yen2 = cheapest(pool);
    const areas = [...new Set(pool.filter((bundle) => bundle[2] === yen2).map((bundle) => bundle[0]))];
    return { yen: yen2, areas: areas.sort((a, b) => a - b), special: [] };
  }
  function kitRows(effects, kit) {
    return SLOTS.filter((slot) => kit[slot] != null).map((slot) => ({
      slot,
      id: kit[slot],
      ...placeOf(effects, slot, kit[slot])
    }));
  }
  function routeItem(effects, method) {
    const route = effects.routes[method];
    return route ? { slot: method === "float" ? "float_weight" : "sinker", ...route } : null;
  }
  function neverSoldRods(effects, fish, method) {
    const best = fish.methods[method].slots.rod[0]?.[1] ?? [];
    return best.every((id) => effects.items.rod[id].yen == null) ? best : [];
  }
  function planFish(effects, fishId) {
    const fish = effects.fish[fishId];
    return effects.meta.methods.filter((method) => fish.methods[method]).map((method) => {
      const data = fish.methods[method];
      let swappedFrom = null;
      let best = data.buy;
      if (method === "fly") ({ kit: best, swappedFrom } = workingFlyKit(effects, fish, best));
      const kits = [{ role: "buy", kit: best }];
      if (data.enough && data.enough.yen < best.yen) kits.push({ role: "enough", kit: data.enough });
      return {
        method,
        need: data.need,
        swappedFrom,
        neverSold: neverSoldRods(effects, fish, method),
        kits: kits.map(({ role, kit }) => ({
          role,
          kit,
          rows: kitRows(effects, kit),
          range: mistakeRange(fish, kit),
          stats: catchStats(effects, fish, method, kit)
        }))
      };
    });
  }

  // src/pages/gear-guide/kit-view.js
  var suffixes2 = { en: "", th: ".th", ja: ".ja" };
  var itemLabel = (ctx, slot, id) => localName(ctx.names[slot]?.[id], ctx.locale);
  function whereText(ctx, row) {
    const { where } = ctx.text;
    if (row.special.length) return where.special(row.special);
    const place = row.areas.length === 6 ? where.all : where.areas(row.areas);
    return row.slot === "fly" ? `${where.readyMade}, ${place}` : place;
  }
  function rowHtml2(ctx, row) {
    return `<li><span class="gg-slot">${ctx.text.slots[row.slot]}</span><span class="gg-item"><strong>${escapeHtml2(itemLabel(ctx, row.slot, row.id))}</strong><span class="gg-sub">${yen(row.yen)} · ${whereText(ctx, row)}</span></span></li>`;
  }
  function routeHtml(ctx, method) {
    const route = routeItem(ctx.effects, method);
    if (!route) return "";
    const name = itemLabel(ctx, "float_weight", route.id);
    return `<p class="gg-note">${ctx.text.extra(escapeHtml2(name), yen(route.yen))}</p>`;
  }
  function statsHtml(ctx, entry) {
    const { text } = ctx;
    const lines = [`<strong>${text.mistakes(...entry.range)}</strong>`];
    const { stats } = entry;
    if (stats) {
      const n = ctx.effects.sample.starts;
      lines.push(text.caught(`<strong>${percent(stats.caught)}</strong>`, n));
      if (stats.lost >= 10) lines.push(text.lost(percent(stats.lost)));
      if (stats.unfinished >= 10) lines.push(text.running(percent(stats.unfinished)));
    } else lines.push(text.notSimulated);
    return `<ul class="gg-stats">${lines.map((line) => `<li>${line}</li>`).join("")}</ul>`;
  }
  function simLink(ctx, fishId, method, kit) {
    if (method !== "float" && method !== "casting") return "";
    const query = new URLSearchParams({ fish: fishId, rod: kit.rod, hook: kit.hook, bait: kit.bait });
    const href = `fight-sim${suffixes2[ctx.locale]}.html?${query}`;
    return `<a class="gg-link" href="${href}">${ctx.text.simLink}</a>`;
  }
  function kitHtml(ctx, fishId, plan, entry) {
    const total = ctx.text.total(yen(entry.kit.yen));
    return `<div class="gg-kit gg-kit-${entry.role}">
  <h4>${ctx.text.roles[entry.role]} <span class="gg-total">${total}</span></h4>
  <ul class="gg-items">${entry.rows.map((row) => rowHtml2(ctx, row)).join("")}</ul>
  ${routeHtml(ctx, plan.method)}
  ${statsHtml(ctx, entry)}
  ${simLink(ctx, fishId, plan.method, entry.kit)}
</div>`;
  }
  function notesHtml(ctx, plan) {
    const { text } = ctx;
    const notes = [];
    if (text.hints[plan.method]) notes.push(text.hints[plan.method]);
    if (plan.swappedFrom) {
      const priced = (id, price) => `${escapeHtml2(itemLabel(ctx, "fly", id))} (${yen(price)})`;
      const fromPrice = Math.min(...ctx.effects.items.fly[plan.swappedFrom].bundles.map((b) => b[2]));
      const flyRow = plan.kits[0].rows.find((row) => row.slot === "fly");
      notes.push(text.flySwapped(priced(plan.swappedFrom, fromPrice), priced(flyRow.id, flyRow.yen)));
    }
    if (plan.neverSold.length) {
      const names = plan.neverSold.map((id) => escapeHtml2(itemLabel(ctx, "rod", id)));
      notes.push(text.neverSold(names.join(", ")));
    }
    return notes.map((note) => `<p class="gg-note">${note}</p>`).join("");
  }
  function methodHtml2(ctx, fishId, plan, open) {
    const cheapest2 = plan.kits.at(-1).kit.yen;
    return `<details class="gg-method"${open ? " open" : ""}>
  <summary><span>${ctx.text.methods[plan.method]}</span><span class="gg-from">${ctx.text.from(yen(cheapest2))}</span></summary>
  ${notesHtml(ctx, plan)}
  <div class="gg-kits">${plan.kits.map((entry) => kitHtml(ctx, fishId, plan, entry)).join("")}</div>
</details>`;
  }
  function renderPlans(ctx, fishId, plans) {
    return plans.map((plan, index) => methodHtml2(ctx, fishId, plan, index === 0)).join("");
  }

  // src/pages/gear-guide/load.js
  function getJson(url) {
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`${url}: ${response.status}`);
      return response.json();
    });
  }
  function loadData() {
    return Promise.all([
      getJson("../data/gear-effects.json"),
      getJson("gear-guide-names.json"),
      getJson("gear-best.json")
    ]).then(([effects, names, best]) => ({ effects, names, best }));
  }

  // src/pages/gear-guide/index.js
  var suffixes3 = { en: "", th: ".th", ja: ".ja" };
  var DEFAULT_FISH = "3";
  function setupContext(ctx) {
    const locale = document.documentElement.dataset.locale;
    ctx.locale = ["th", "ja"].includes(locale) ? locale : "en";
    ctx.text = copy[ctx.locale];
    ctx.$ = (id) => document.getElementById(id);
  }
  var hexId = (id) => Number(id).toString(16).toUpperCase().padStart(2, "0");
  function fishFacts(ctx, fishId, plans) {
    const { size } = ctx.best.fish[fishId];
    const { need } = plans[0];
    const link = `fish${suffixes3[ctx.locale]}.html?id=${hexId(fishId)}&return=gear-guide${suffixes3[ctx.locale]}.html`;
    return `${ctx.text.sizeLine(...size)} ${ctx.text.reachLine(need)} <a href="${escapeHtml2(link)}">${ctx.text.fishLink}</a>`;
  }
  function show(ctx, fishId) {
    const plans = planFish(ctx.effects, fishId);
    ctx.$("gg-facts").innerHTML = fishFacts(ctx, fishId, plans);
    ctx.$("gg-results").innerHTML = renderPlans(ctx, fishId, plans);
    const query = new URLSearchParams({ fish: fishId });
    history.replaceState(null, "", `${location.pathname}?${query}${location.hash}`);
    for (const [locale, suffix] of Object.entries(suffixes3))
      ctx.$(`language-${locale}`).href = `gear-guide${suffix}.html?${query}`;
  }
  function fillFish(ctx, selected) {
    const collator = new Intl.Collator(ctx.locale);
    const fish = Object.keys(ctx.effects.fish).map((id) => ({ id, label: itemLabel(ctx, "fish", id) })).sort((a, b) => collator.compare(a.label, b.label));
    ctx.$("gg-fish").innerHTML = fish.map(
      ({ id, label }) => `<option value="${id}"${id === selected ? " selected" : ""}>${escapeHtml2(label)}</option>`
    ).join("");
  }
  function startTable(ctx) {
    const table = {
      data: { best: ctx.best, names: ctx.names },
      locale: ctx.locale,
      method: "float",
      query: "",
      target: ctx.$("bg-table"),
      fishLabel: ctx.text.fishLabel
    };
    renderTable(table);
    bindTable(table, ctx.$("bg-search"), document.querySelectorAll('input[name="bg-method"]'));
  }
  function ready(ctx) {
    startTable(ctx);
    const asked = new URLSearchParams(location.search).get("fish");
    const fishId = ctx.effects.fish[asked] ? asked : DEFAULT_FISH;
    fillFish(ctx, fishId);
    ctx.$("gg-fish").addEventListener("change", (event) => show(ctx, event.target.value));
    show(ctx, fishId);
    ctx.$("gg-status").hidden = true;
    document.querySelector('.compendium-links [aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }
  function failed(ctx) {
    const status = ctx.$("gg-status");
    status.hidden = false;
    status.textContent = `${ctx.text.failed} `;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "route-button";
    retry.textContent = ctx.text.retry;
    retry.addEventListener("click", () => start(ctx));
    status.append(retry);
  }
  function start(ctx) {
    const status = ctx.$("gg-status");
    status.hidden = false;
    status.textContent = ctx.text.loading;
    loadData().then((data) => {
      Object.assign(ctx, data);
      ready(ctx);
    }).catch((error) => {
      console.error(error);
      failed(ctx);
    });
  }
  function initialize(ctx) {
    setupContext(ctx);
    start(ctx);
  }

  // src/app/gear-guide.js
  var runtimeContext = createPageRuntime(gear_guide_exports);
  initialize(runtimeContext);
})();
