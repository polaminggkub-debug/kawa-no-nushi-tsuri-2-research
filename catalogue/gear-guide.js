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

  // src/pages/gear-guide/copy_en.js
  var areaWord = (list) => list.length === 1 ? `Area ${list[0]}` : `Areas ${list.join(", ")}`;
  var copy_en_default = {
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
    roles: { buy: "Best kit you can buy", enough: "Cheaper, almost as good (within 3 points)" },
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
    neverSold: (names) => `The roomiest rod for this fish (${names}) is never sold. This is the best you can buy.`,
    flySwapped: (from, to) => `The cheapest fly for this fish (${from}) never bites on a fresh save, so this kit uses ${to}.`,
    simLink: "Try this kit in the fight simulator",
    fishLink: "Where to find this fish"
  };

  // src/pages/gear-guide/copy_th.js
  var areaWord2 = (list) => `ด่าน ${list.join(", ")}`;
  var copy_th_default = {
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
      buy: "ชุดที่ดีที่สุดที่ซื้อได้",
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
    neverSold: (names) => `คันที่เผื่อพลาดได้มากที่สุดสำหรับปลาตัวนี้ (${names}) ไม่มีขายเลย ชุดนี้คือชุดที่ดีที่สุดที่ซื้อได้`,
    flySwapped: (from, to) => `ฟลายที่ถูกที่สุดสำหรับปลาตัวนี้ (${from}) ไม่มีวันมีปลากินในเซฟใหม่ ชุดนี้จึงใช้ ${to} แทน`,
    simLink: "ลองชุดนี้ในจำลองการสู้ปลา",
    fishLink: "ดูว่าปลาตัวนี้อยู่ที่ไหน"
  };

  // src/pages/gear-guide/copy_ja.js
  var areaWord3 = (list) => `エリア${list.join("・")}`;
  var copy_ja_default = {
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
    neverSold: (names) => `この魚にいちばん余裕のある竿（${names}）は売っていません。これが買える中で最善です。`,
    flySwapped: (from, to) => `この魚に一番安い毛バリ（${from}）は新しいセーブでは食わないので、このセットは${to}にしています。`,
    simLink: "このセットをファイトシミュレーターで試す",
    fishLink: "この魚の居場所を見る"
  };

  // src/pages/gear-guide/copy.js
  var copy = { en: copy_en_default, th: copy_th_default, ja: copy_ja_default };

  // src/pages/gear-guide/format.js
  var escapeHtml = (value) => String(value).replace(
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
  var suffixes = { en: "", th: ".th", ja: ".ja" };
  var itemLabel = (ctx, slot, id) => localName(ctx.names[slot]?.[id], ctx.locale);
  function whereText(ctx, row) {
    const { where } = ctx.text;
    if (row.special.length) return where.special(row.special);
    const place = row.areas.length === 6 ? where.all : where.areas(row.areas);
    return row.slot === "fly" ? `${where.readyMade}, ${place}` : place;
  }
  function rowHtml(ctx, row) {
    return `<li><span class="gg-slot">${ctx.text.slots[row.slot]}</span><span class="gg-item"><strong>${escapeHtml(itemLabel(ctx, row.slot, row.id))}</strong><span class="gg-sub">${yen(row.yen)} · ${whereText(ctx, row)}</span></span></li>`;
  }
  function routeHtml(ctx, method) {
    const route = routeItem(ctx.effects, method);
    if (!route) return "";
    const name = itemLabel(ctx, "float_weight", route.id);
    return `<p class="gg-note">${ctx.text.extra(escapeHtml(name), yen(route.yen))}</p>`;
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
    const href = `fight-sim${suffixes[ctx.locale]}.html?${query}`;
    return `<a class="gg-link" href="${href}">${ctx.text.simLink}</a>`;
  }
  function kitHtml(ctx, fishId, plan, entry) {
    const total = ctx.text.total(yen(entry.kit.yen));
    return `<div class="gg-kit gg-kit-${entry.role}">
  <h4>${ctx.text.roles[entry.role]} <span class="gg-total">${total}</span></h4>
  <ul class="gg-items">${entry.rows.map((row) => rowHtml(ctx, row)).join("")}</ul>
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
      const priced = (id, price) => `${escapeHtml(itemLabel(ctx, "fly", id))} (${yen(price)})`;
      const fromPrice = Math.min(...ctx.effects.items.fly[plan.swappedFrom].bundles.map((b) => b[2]));
      const flyRow = plan.kits[0].rows.find((row) => row.slot === "fly");
      notes.push(text.flySwapped(priced(plan.swappedFrom, fromPrice), priced(flyRow.id, flyRow.yen)));
    }
    if (plan.neverSold.length) {
      const names = plan.neverSold.map((id) => escapeHtml(itemLabel(ctx, "rod", id)));
      notes.push(text.neverSold(names.join(", ")));
    }
    return notes.map((note) => `<p class="gg-note">${note}</p>`).join("");
  }
  function methodHtml(ctx, fishId, plan, open) {
    const cheapest2 = plan.kits.at(-1).kit.yen;
    return `<details class="gg-method"${open ? " open" : ""}>
  <summary><span>${ctx.text.methods[plan.method]}</span><span class="gg-from">${ctx.text.from(yen(cheapest2))}</span></summary>
  ${notesHtml(ctx, plan)}
  <div class="gg-kits">${plan.kits.map((entry) => kitHtml(ctx, fishId, plan, entry)).join("")}</div>
</details>`;
  }
  function renderPlans(ctx, fishId, plans) {
    return plans.map((plan, index) => methodHtml(ctx, fishId, plan, index === 0)).join("");
  }

  // src/pages/gear-guide/load.js
  function getJson(url) {
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`${url}: ${response.status}`);
      return response.json();
    });
  }
  function loadData() {
    return Promise.all([getJson("../data/gear-effects.json"), getJson("gear-guide-names.json")]).then(
      ([effects, names]) => ({ effects, names })
    );
  }

  // src/pages/gear-guide/index.js
  var suffixes2 = { en: "", th: ".th", ja: ".ja" };
  var DEFAULT_FISH = "3";
  function setupContext(ctx) {
    const locale = document.documentElement.dataset.locale;
    ctx.locale = ["th", "ja"].includes(locale) ? locale : "en";
    ctx.text = copy[ctx.locale];
    ctx.$ = (id) => document.getElementById(id);
  }
  var hexId = (id) => Number(id).toString(16).toUpperCase().padStart(2, "0");
  function fishFacts(ctx, fishId, plans) {
    const { size } = ctx.effects.fish[fishId];
    const { need } = plans[0];
    const link = `fish${suffixes2[ctx.locale]}.html?id=${hexId(fishId)}&return=gear-guide${suffixes2[ctx.locale]}.html`;
    return `${ctx.text.sizeLine(...size)} ${ctx.text.reachLine(need)} <a href="${escapeHtml(link)}">${ctx.text.fishLink}</a>`;
  }
  function show(ctx, fishId) {
    const plans = planFish(ctx.effects, fishId);
    ctx.$("gg-facts").innerHTML = fishFacts(ctx, fishId, plans);
    ctx.$("gg-results").innerHTML = renderPlans(ctx, fishId, plans);
    const query = new URLSearchParams({ fish: fishId });
    history.replaceState(null, "", `${location.pathname}?${query}${location.hash}`);
    for (const [locale, suffix] of Object.entries(suffixes2))
      ctx.$(`language-${locale}`).href = `gear-guide${suffix}.html?${query}`;
  }
  function fillFish(ctx, selected) {
    const collator = new Intl.Collator(ctx.locale);
    const fish = Object.keys(ctx.effects.fish).map((id) => ({ id, label: itemLabel(ctx, "fish", id) })).sort((a, b) => collator.compare(a.label, b.label));
    ctx.$("gg-fish").innerHTML = fish.map(
      ({ id, label }) => `<option value="${id}"${id === selected ? " selected" : ""}>${escapeHtml(label)}</option>`
    ).join("");
  }
  function ready(ctx) {
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

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/app/gear-guide.js
  var runtimeContext = createPageRuntime(gear_guide_exports);
  initialize(runtimeContext);
})();
