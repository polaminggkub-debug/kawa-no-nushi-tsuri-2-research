(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/item/index.js
  var item_exports = {};
  __export(item_exports, {
    acquisitionChoice: () => acquisitionChoice,
    areaItemLink: () => areaItemLink,
    baitGatherChoice: () => baitGatherChoice,
    baitLurePriceChoices: () => baitLurePriceChoices,
    boatBoardingChoice: () => boatBoardingChoice,
    buyingDecision: () => buyingDecision,
    categoryLabel: () => categoryLabel,
    categoryName: () => categoryName,
    compassUseChoice: () => compassUseChoice,
    componentLink: () => componentLink,
    currentCategoryLink: () => currentCategoryLink,
    currentLocalRoute: () => currentLocalRoute,
    daikonFishChoice: () => daikonFishChoice,
    detailItemLink: () => detailItemLink,
    emptyState: () => emptyState,
    fallbackBack: () => fallbackBack,
    fishName: () => fishName,
    fishProfileLink: () => fishProfileLink,
    fishSection: () => fishSection,
    fishTile: () => fishTile,
    fishingContext: () => fishingContext,
    flyAssemblies: () => flyAssemblies,
    forageBaitChoice: () => forageBaitChoice,
    foragePointReturn: () => foragePointReturn,
    gatheredBaitChoices: () => gatheredBaitChoices,
    gearNextActions: () => gearNextActions,
    imageName: () => imageName,
    initialize: () => initialize,
    keepnetAlternatives: () => keepnetAlternatives,
    localizeReturn: () => localizeReturn,
    mapLink: () => mapLink,
    moreOptionsPanel: () => moreOptionsPanel,
    mushroomAlternative: () => mushroomAlternative,
    render: () => render,
    safeLocalRoute: () => safeLocalRoute,
    setNavigation: () => setNavigation,
    shopCondition: () => shopCondition,
    shopSection: () => shopSection,
    stageButton: () => stageButton,
    stageName: () => stageName,
    technicalSection: () => technicalSection,
    useLocationSection: () => useLocationSection,
    visibleUsage: () => visibleUsage
  });

  // src/pages/item/navigation.js
  function safeLocalRoute(ctx, raw) {
    if (!raw) return "";
    try {
      const url = new URL(raw, location.href);
      if (url.origin !== location.origin || !(ctx.routeFiles.catalogue.test(url.pathname) || ctx.routeFiles.research.test(url.pathname)))
        return "";
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return "";
    }
  }
  function retainsFishingTarget(ctx) {
    return ["rod", "hook", "bait", "lure", "fly", "fly_wing", "fly_tail", "float_weight"].includes(
      ctx.category
    );
  }
  function addFishingTarget(ctx, params) {
    if (!retainsFishingTarget(ctx)) return;
    if (ctx.selectedFish) params.set("fish", ctx.selectedFish);
    if (ctx.selectedRoute) params.set("route", ctx.selectedRoute);
  }
  function fallbackBack(ctx) {
    const p = new URLSearchParams();
    if (ctx.category)
      p.set(
        "category",
        ["fly", "fly_wing", "fly_tail"].includes(ctx.category) ? "flymaker" : ctx.category
      );
    if (["fly", "fly_wing", "fly_tail"].includes(ctx.category)) p.set("part", ctx.category);
    addFishingTarget(ctx, p);
    if (ctx.selectedStage) p.set("stage", String(ctx.selectedStage));
    return `${ctx.cataloguePage[ctx.lang]}${p.size ? `?${p}` : ""}#catalogue`;
  }
  function currentLocalRoute(_ctx) {
    return `${location.pathname}${location.search}${location.hash}`;
  }
  function localizeReturn(ctx, raw, toLang, depth = 0) {
    const route = ctx.safeLocalRoute(raw);
    if (!route) return "";
    const url = new URL(route, location.href);
    const basename = url.pathname.split("/").pop();
    const root = basename.replace(/(?:\.(?:th|ja))?\.html$/, "");
    if (["index", "maps", "fish", "item", "shops"].includes(root)) {
      const directory = url.pathname.slice(0, url.pathname.lastIndexOf("/") + 1);
      url.pathname = `${directory}${root}${toLang === "en" ? "" : `.${toLang}`}.html`;
    }
    if (url.searchParams.has("return")) {
      const nested = depth < 4 ? ctx.localizeReturn(url.searchParams.get("return"), toLang, depth + 1) : "";
      if (nested) url.searchParams.set("return", nested);
      else url.searchParams.delete("return");
    }
    return `${url.pathname}${url.search}${url.hash}`;
  }
  function setNavigation(ctx) {
    const rawReturn = ctx.params.get("return") || "";
    ctx.$("detail-back").href = ctx.safeLocalRoute(rawReturn) || ctx.fallbackBack();
    ctx.$("detail-back").textContent = ctx.copy.back;
    document.querySelectorAll(".language-links a").forEach((link) => {
      const targetLang = link.getAttribute("hreflang");
      if (!targetLang) return;
      const next = new URLSearchParams(location.search);
      const returned = ctx.localizeReturn(rawReturn, targetLang);
      if (returned) next.set("return", returned);
      link.href = `${ctx.localePage[targetLang]}${next.size ? `?${next}` : ""}${location.hash || ""}`;
      if (targetLang === ctx.lang) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }
  function currentCategoryLink(ctx) {
    const p = new URLSearchParams(), fly = ["fly", "fly_wing", "fly_tail"].includes(ctx.category);
    p.set("category", fly ? "flymaker" : ctx.category || "all");
    if (fly) p.set("part", ctx.category);
    addFishingTarget(ctx, p);
    if (ctx.selectedStage) p.set("stage", String(ctx.selectedStage));
    return `${ctx.cataloguePage[ctx.lang]}?${p}#catalogue`;
  }
  function mapLink(ctx, stage, fish = "") {
    const p = new URLSearchParams();
    p.set("stage", String(stage));
    if (fish) p.set("fish", fish);
    const returnRoute = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returnRoute) p.set("return", returnRoute);
    return `${ctx.mapsPage[ctx.lang]}?${p}`;
  }
  function fishProfileLink(ctx, id, fishLocations) {
    const locations = fishLocations[id]?.locations || [];
    const location2 = locations.find((loc) => Number(loc.stage) === ctx.selectedStage) || locations[0];
    const p = new URLSearchParams({ id });
    if (location2?.stage) p.set("stage", String(location2.stage));
    const returnRoute = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returnRoute) p.set("return", returnRoute);
    return `fish${ctx.lang === "en" ? "" : `.${ctx.lang}`}.html?${p}`;
  }

  // src/pages/item/names.js
  function imageName(ctx, item) {
    return ctx.lang === "th" ? item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id : ctx.lang === "ja" ? item.playerUse?.displayName?.ja || item.nameJa || item.nameEn || item.id : item.playerUse?.displayName?.en || item.nameEn || item.nameJa || item.id;
  }
  function fishName(ctx, id, fishVisuals) {
    const fish = fishVisuals[id] || {};
    if (ctx.lang === "th")
      return fish.nameTh || fish.nameThVariants?.join(" / ") || fish.nameLatin || fish.nameJa || `ปลา ${id}`;
    if (ctx.lang === "ja") return fish.nameJa || `魚 ${id}`;
    return fish.nameEn || fish.nameLatin || fish.nameLatinVariants?.slice().sort((a, b) => b.length - a.length)[0] || fish.nameJa || `Fish ${id}`;
  }
  function categoryLabel(ctx, item) {
    return ctx.lang === "th" ? item.categoryTh || item.categoryEn : ctx.lang === "ja" ? item.categoryJa || item.categoryEn : item.categoryEn || item.category;
  }
  function categoryName(ctx, c) {
    const maps = {
      th: {
        rod: "คันเบ็ด",
        lure: "ลัวร์",
        fly: "ฟลาย",
        fly_wing: "ปีกฟลาย",
        fly_tail: "หางฟลาย",
        hook: "เบ็ด",
        float_weight: "ทุ่นและตะกั่ว",
        bait: "เหยื่อจริง",
        food: "อาหาร",
        general_tool: "อุปกรณ์ทั่วไป"
      },
      ja: {
        rod: "竿",
        lure: "ルアー",
        fly: "毛バリ",
        fly_wing: "ウィング",
        fly_tail: "テール",
        hook: "ハリ",
        float_weight: "ウキ・オモリ",
        bait: "エサ",
        food: "食料",
        general_tool: "道具"
      },
      en: {
        rod: "Rod",
        lure: "Lure",
        fly: "Fly body",
        fly_wing: "Fly wing",
        fly_tail: "Fly tail",
        hook: "Hook",
        float_weight: "Float / sinker",
        bait: "Natural bait",
        food: "Food",
        general_tool: "General tool"
      }
    };
    return maps[ctx.lang][c] || c;
  }
  function stageName(ctx, stage, fishLocations) {
    for (const record of Object.values(fishLocations))
      for (const loc of record.locations || [])
        if (Number(loc.stage) === Number(stage))
          return ctx.local(loc.stageName) || ctx.copy.shopArea(stage);
    return ctx.copy.shopArea(stage);
  }

  // src/pages/item/links.js
  function fishingContext(ctx, item) {
    return ["rod", "bait", "lure", "hook", "float_weight", "fly", "fly_wing", "fly_tail"].includes(
      item.category
    ) || item.category === "general_tool" && ["03", "04", "08", "09", "0A", "0E"].includes(item.id);
  }
  function detailItemLink(ctx, item, returnRoute = ctx.currentLocalRoute()) {
    const p = new URLSearchParams();
    p.set("category", item.category);
    p.set("id", item.id);
    if (ctx.fishingContext(item) && ctx.selectedFish) p.set("fish", ctx.selectedFish);
    if (ctx.selectedStage) p.set("stage", String(ctx.selectedStage));
    if (ctx.fishingContext(item) && ctx.selectedRoute) p.set("route", ctx.selectedRoute);
    const safe = ctx.safeLocalRoute(returnRoute);
    if (safe) p.set("return", safe);
    return `item${ctx.lang === "en" ? "" : `.${ctx.lang}`}.html?${p}`;
  }
  function stageButton(ctx, stage, fishLocations, label = ctx.copy.shopMap) {
    const name = ctx.stageName(stage, fishLocations), p = new URLSearchParams({
      stage: String(stage),
      place: "town",
      category: ctx.category,
      id: ctx.requestedId
    });
    const context = ctx.fishingContext({ category: ctx.category, id: ctx.requestedId });
    if (context && ctx.selectedFish) p.set("fish", ctx.selectedFish);
    if (context && ctx.selectedRoute) p.set("route", ctx.selectedRoute);
    const returned = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returned) p.set("return", returned);
    const shops = `shops${ctx.lang === "en" ? "" : `.${ctx.lang}`}.html?${p}`;
    return `<a class="route-button" href="${ctx.esc(shops)}">${ctx.esc(label)} · ${ctx.esc(name)} ↗</a>`;
  }
  function componentLink(ctx, item, label = "") {
    if (!item) return "";
    if (item.category === ctx.category && item.id === ctx.requestedId)
      return `<div class="entity-link" aria-current="true"><img loading="lazy" src="${ctx.esc(item.image)}" alt=""><span>${ctx.esc(label || ctx.imageName(item))}<small>${ctx.lang === "th" ? "ชิ้นที่กำลังดู" : ctx.lang === "ja" ? "表示中の部品" : "Part currently shown"}</small></span></div>`;
    return `<a class="entity-link" href="${ctx.esc(ctx.detailItemLink(item))}"><img loading="lazy" src="${ctx.esc(item.image)}" alt=""><span>${ctx.esc(label || ctx.imageName(item))}<small>ID ${ctx.esc(item.id)} · ${ctx.esc(ctx.copy.component)}</small></span></a>`;
  }
  function fishTile(ctx, id, fishVisuals, fishLocations, stage) {
    const fish = fishVisuals[id] || {}, record = fishLocations[id];
    const locs = (record?.locations || []).filter((l) => !stage || Number(l.stage) === Number(stage));
    const actualStage = locs[0]?.stage || (record?.locations || [])[0]?.stage || 0;
    const src = fish.image || "";
    const main = `<a class="entity-link-name fish-profile-link" href="${ctx.esc(ctx.fishProfileLink(id, fishLocations))}">${src ? `<img loading="lazy" src="${ctx.esc(src)}" alt="">` : ""}<span><strong>${ctx.esc(ctx.fishName(id, fishVisuals))}</strong><small>ID ${ctx.esc(id)} · ${ctx.esc(ctx.copy.fishProfile)}</small></span></a>`;
    const map = actualStage ? `<a class="route-button" href="${ctx.esc(ctx.mapLink(actualStage, id))}">${ctx.esc(ctx.copy.mapFish)} · ${ctx.esc(ctx.copy.area(actualStage))}</a>` : "";
    return `<article class="entity-link">${main}${map}</article>`;
  }

  // src/pages/item/food-choice.js
  function foodCopy(ctx) {
    return {
      th: [
        "อาหารอื่นที่ซื้อได้ในด่านนี้",
        "เทียบอาหารร้านทั้งหมดและเหตุผลที่ควรเติม HP",
        "ถ้ามีอาหารจากร้านอยู่แล้ว ให้ใช้ก่อนซื้อเพิ่ม; อาหารร้านทั้ง 6 แบบราคา 1 เยนต่อ HP เลือกชิ้นที่ฟื้นใกล้ HP ที่ขาด เพราะส่วนที่เกิน HP สูงสุดจะถูกตัดทิ้ง"
      ],
      ja: [
        "このエリアで買える他の食料",
        "店の食料全体とHP補充の理由を比較",
        "店で買った食料を持っているなら、買い足す前に使ってください。店の食料6種はどれも1HPあたり1円。不足HPに近い回復量を選ぶと、最大HPを超えた分を無駄にしません。"
      ],
      en: [
        "Other foods sold in this area",
        "Compare all shop foods and why to restore HP",
        "Use shop food you already own before buying more. All six shop foods cost ¥1 per HP; choose an amount close to your missing HP to avoid recovery wasted above your maximum."
      ]
    }[ctx.lang];
  }
  function foodChoicePanel(ctx, item, allItems, sections) {
    const copy2 = foodCopy(ctx);
    const hpLabel = (hp) => ctx.lang === "th" ? `ฟื้น HP +${hp} หน่วย` : ctx.lang === "ja" ? `HP+${hp}回復` : `Restores +${hp} HP`;
    const foodOption = (other) => {
      const hp = other.playerUse?.hpRecovery?.hp;
      if (!Number.isSafeInteger(hp) || hp <= 0) return "";
      return `<article data-food-option="${ctx.esc(other.id)}" data-food-hp="${hp}">${ctx.componentLink(other)}<p class="food-option-hp">${ctx.esc(hpLabel(hp))}</p><p>${ctx.esc(ctx.copy.price(other.priceYen))}</p></article>`;
    };
    const alternatives = allItems.filter(
      (other) => other.category === "food" && other.id !== item.id && other.priceYen > 0 && other.playerUse?.shops?.some((shop) => Number(shop.stage) === ctx.selectedStage)
    );
    const nearby = ctx.selectedStage ? `<h3>${ctx.esc(copy2[0])} · ${ctx.selectedStage}</h3><div class="detail-grid" data-local-food-options>${alternatives.map(foodOption).join("")}</div>` : "";
    const catalogueOptions = allItems.filter((other) => other.category === "food" && other.priceYen > 0 && other.id !== item.id).map(foodOption).join("");
    const full = sections.map(
      (section) => `<h3>${ctx.esc(ctx.local(section.title))}</h3><p>${ctx.esc(ctx.local(section.recommendation))}</p><p class="muted">${ctx.esc(ctx.local(section.scope))}</p>`
    ).join("");
    return `<section class="detail-section buying-decision" data-food-choice><p>${ctx.esc(copy2[2])}</p>${nearby}<details><summary>${ctx.esc(copy2[1])}</summary>${full}<div class="detail-grid" data-all-food-options>${catalogueOptions}</div></details></section>`;
  }

  // src/pages/item/purchases.js
  function flyAssemblies(ctx, item, allItems) {
    const id = item.id, parts = [];
    for (const body of allItems.filter((i) => i.category === "fly"))
      for (const shop of body.playerUse?.shops || []) {
        const b = shop.bundle;
        if (!b) continue;
        const belongs = item.category === "fly" && b.body === id || item.category === "fly_wing" && b.wing === id || item.category === "fly_tail" && b.tail === id;
        if (!belongs) continue;
        const key = [shop.stage, b.body, b.wing, b.tail, b.shopPriceYen].join("|");
        if (parts.some((p) => p.key === key)) continue;
        parts.push({ key, stage: Number(shop.stage), bundle: b, body });
      }
    return parts.sort((a, b) => a.stage - b.stage || a.bundle.shopPriceYen - b.bundle.shopPriceYen);
  }
  function shopCondition(ctx, item, offer, fishLocations) {
    if (!offer?.condition) return "";
    const knownAyuCondition = item.category === "bait" && item.id === "17" && offer.condition.includes("sell at least one Ayu");
    const message = knownAyuCondition ? ctx.copy.ayuOffer : ctx.copy.unknownShopCondition;
    const action = knownAyuCondition ? `<a class="route-button" href="${ctx.esc(ctx.fishProfileLink("38", fishLocations))}">${ctx.esc(ctx.lang === "th" ? "ดูจุดตกและเหยื่อสำหรับปลาอายุ" : ctx.lang === "ja" ? "アユの釣り場と対応エサを見る" : "Find Ayu fishing spots and compatible bait")} ↗</a>` : "";
    return `<p class="shop-condition"><strong>${ctx.esc(ctx.copy.unlock)}</strong> ${ctx.esc(message)}</p>${action}`;
  }
  function shopSection(ctx, item, allItems, fishLocations) {
    const shops = item.playerUse?.shops || [];
    const isFly = ["fly", "fly_wing", "fly_tail"].includes(item.category);
    if (isFly) {
      const assemblies = ctx.flyAssemblies(item, allItems);
      if (!assemblies.length)
        return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2><p class="muted">${ctx.esc(ctx.copy.noShop)}</p></section>`;
      return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${item.category !== "fly" ? `<p>${ctx.esc(ctx.copy.usedIn)}</p>` : ""}<div class="detail-grid">${assemblies.map(({ stage, bundle }) => {
        const refs = [
          ["fly", bundle.body],
          ["fly_wing", bundle.wing],
          ["fly_tail", bundle.tail]
        ].filter(([, id]) => id && id !== "00").map(([c, id]) => allItems.find((i) => i.category === c && i.id === id)).filter(Boolean);
        return `<article class="detail-section"><h3>${ctx.esc(ctx.copy.bundleAt(stage))}</h3><p><strong>${ctx.esc(ctx.copy.completePrice)} · ${ctx.esc(ctx.copy.price(bundle.shopPriceYen))}</strong></p><div class="detail-grid">${refs.map((part) => ctx.componentLink(part)).join("")}</div>${ctx.stageButton(stage, fishLocations)}<p class="muted">${ctx.esc(ctx.copy.mapNote)}</p></article>`;
      }).join("")}</div></section>`;
    }
    if (!shops.length)
      return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2><p class="muted">${ctx.esc(ctx.copy.noShop)}</p></section>`;
    const stageRows = [
      ...new Set(shops.map((s) => Number(s.stage)).filter((n) => n >= 1 && n <= 6))
    ].sort((a, b) => a - b);
    return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${item.priceYen != null ? `<p><strong>${ctx.esc(ctx.copy.price(item.priceYen))}</strong> <span class="muted">· ${ctx.esc(ctx.copy.stockAt)} · ${ctx.esc(ctx.copy.priceFromRom)}</span></p>` : ""}<div class="detail-grid">${stageRows.map((stage) => {
      const offer = shops.find((s) => Number(s.stage) === stage);
      const seller = offer?.shop === "special_rod_shop" ? ctx.lang === "th" ? "ร้านคันเบ็ดพิเศษในเมือง" : ctx.lang === "ja" ? "町の専用竿店" : "Special rod shop" : ctx.lang === "th" ? "ร้านในด่านนี้" : ctx.lang === "ja" ? "エリア内の店" : "Store stock in this area";
      return `<article class="detail-section"><h3>${ctx.esc(ctx.stageName(stage, fishLocations))}</h3><p>${ctx.esc(seller)}${item.priceYen != null ? ` · ${ctx.esc(ctx.copy.price(item.priceYen))}` : ""}</p>${ctx.shopCondition(item, offer, fishLocations)}${ctx.stageButton(stage, fishLocations)}</article>`;
    }).join("")}</div><p class="muted">${ctx.esc(ctx.copy.mapNote)}</p></section>`;
  }
  function buyingDecision(ctx, item, allItems, decisions) {
    const rodPaths = {
      1: "float_rod_path",
      2: "casting_rod_path",
      4: "lure_rod_path",
      8: "fly_rod_path"
    };
    const path = item.category === "rod" ? rodPaths[item.decodedFields?.styleCode] : item.category === "hook" ? "hook_purchase_caution" : "";
    const sections = decisions.filter(
      (section) => path ? section.id === path : !ctx.selectedFish && section.category === item.category && ["lure", "food"].includes(item.category) && (section.items || []).some((ref) => ref.category === item.category && ref.id === item.id)
    );
    if (!sections.length) return "";
    if (item.category === "food") return foodChoicePanel(ctx, item, allItems, sections);
    return `<section class="detail-section buying-decision"><h2>${ctx.lang === "th" ? "ควรซื้อหรือเปลี่ยนมาใช้อันนี้ไหม?" : ctx.lang === "ja" ? "買う・替えるべき？" : "Should I buy or switch to this?"}</h2>${sections.map((section) => {
      const refs = (section.items || []).filter((ref) => ref.category === item.category && ref.id !== item.id).map((ref) => allItems.find((i) => i.category === ref.category && i.id === ref.id)).filter(Boolean);
      return `<h3>${ctx.esc(ctx.local(section.title))}</h3><p>${ctx.esc(ctx.local(section.recommendation))}</p>${refs.length ? `<div class="detail-grid">${refs.map((ref) => ctx.componentLink(ref)).join("")}</div>` : ""}<p class="muted">${ctx.esc(ctx.local(section.scope))}</p>`;
    }).join("")}</section>`;
  }

  // src/entities/item/fly-wing-decision.js
  var PATH_LIMITED_WINGS = /* @__PURE__ */ new Set(["25", "26", "66", "67"]);
  function hasUnverifiedFlyWingPath(item) {
    return item?.category === "fly_wing" && PATH_LIMITED_WINGS.has(item.id);
  }
  function recordedBundle(item) {
    return (item.playerUse?.shops || []).filter((shop) => shop.bundle?.wing === item.id).map((shop) => ({ stage: Number(shop.stage), ...shop.bundle })).sort((a, b) => a.stage - b.stage || a.shopPriceYen - b.shopPriceYen)[0];
  }
  function nameForBundleItem(items, category, id) {
    return (items || []).find((item) => item.category === category && item.id === id);
  }
  function noBundleCopy(lang, id, fish) {
    const copies = {
      th: {
        label: `ยังไม่มีตำแหน่งเมนูหรือชุดร้านที่บันทึกไว้สำหรับ ID ${id}`,
        recommendation: fish ? `เมนูที่ตรวจและรายการชุดสำเร็จรูปของร้านยังไม่มีเส้นทางยืนยันสำหรับปีก ID ${id} อย่าพึ่งว่าหา ID นี้ได้จากเมนูที่มีหลักฐาน ถ้าจะตก${fish} ให้เปิดหน้าปลาเพื่อดูชุดฟลายหรือวิธีอื่นที่มีบันทึก` : `เมนูที่ตรวจและรายการชุดสำเร็จรูปของร้านยังไม่มีเส้นทางยืนยันสำหรับปีก ID ${id} อย่าพึ่งว่าหา ID นี้ได้จากเมนูที่มีหลักฐาน ถ้าจะประกอบฟลายให้เลือกบอดี้ตามปลาเป้าหมาย แล้วใช้ชิ้นส่วนที่มีตำแหน่งเมนูยืนยัน หรือดูชุดเริ่มต้นบอดี้ 01 สำหรับปลาในรายชื่อของบอดี้นั้น`,
        reason: "นี่หมายถึงยังไม่มีเส้นทางในหลักฐานที่ตรวจ ไม่ได้พิสูจน์ว่าทุกเมนูหรือทุกพื้นที่เลือกชิ้นนี้ไม่ได้ และยังไม่มีหลักฐานโบนัสการกินหรือดึงปลาจากปีกนี้"
      },
      en: {
        label: `No recorded menu position or shop bundle for ID ${id}`,
        recommendation: fish ? `The captured menus and recorded ready-made offers do not establish a route for wing ID ${id}. Do not assume it can be selected from a documented menu. For ${fish}, open the fish profile to see recorded flies or other methods.` : `The captured menus and recorded ready-made offers do not establish a route for wing ID ${id}. Do not assume it can be selected from a documented menu. For a custom fly, match the body to your target first, then use a component with a recorded menu position; otherwise see the starter body 01 bundle for fish in its list.`,
        reason: "This means no route is present in the evidence checked; it does not prove the part is unavailable in every menu or area. No bite or landing bonus from this wing is established."
      },
      ja: {
        label: `ID ${id}のメニュー位置・店売りセットは未記録`,
        recommendation: fish ? `確認したメニューと完成品の店売り記録には、ウィングID ${id}の選択経路がありません。記録済みメニューで選べるとは限りません。${fish}の魚ページで、記録のあるフライや別の釣り方を確認してください。` : `確認したメニューと完成品の店売り記録には、ウィングID ${id}の選択経路がありません。記録済みメニューで選べるとは限りません。自作する場合は先に対象魚に合うボディを選び、選択位置が確認された部品を使ってください。対象魚が未定なら、ボディ01の対象魚リストにある魚向けの入門セットを確認できます。`,
        reason: "これは確認した証拠に経路がないという意味で、すべてのメニュー・エリアで入手不能という証明ではありません。このウィングの食いつき・取り込みボーナスも確認されていません。"
      }
    };
    return copies[lang] || copies.en;
  }
  function bundleCopy(lang, item, bundle, fish, supported) {
    const result = {
      th: {
        label: `ชุดสำเร็จรูปด่าน ${bundle.stage}: บอดี้ ${bundle.body} + ปีก ${bundle.wing} + หาง ${bundle.tail} · ¥${bundle.shopPriceYen} ทั้งชุด`,
        recommendation: fish ? supported ? `ปลาเป้าหมาย ${fish} อยู่ในรายชื่อของบอดี้ ${bundle.body}; ลองชุดสำเร็จรูปด่าน ${bundle.stage} (${bundle.body}/${bundle.wing}/${bundle.tail}) ได้ในราคา ¥${bundle.shopPriceYen} ทั้งชุด ไม่ใช่ราคาปีกอย่างเดียว` : `ปลาเป้าหมาย ${fish} ไม่อยู่ในรายชื่อที่บันทึกไว้ของบอดี้ ${bundle.body}; อย่าเลือกชุดนี้เป็นตัวเลือกที่รองรับเป้าหมายนี้ เปิดหน้าปลาเพื่อดูชุดและวิธีอื่นที่มีบันทึก` : `ถ้าจะใช้ปีก ${item.id} มีชุดสำเร็จรูปด่าน ${bundle.stage}: บอดี้ ${bundle.body} + ปีก ${bundle.wing} + หาง ${bundle.tail} ราคา ¥${bundle.shopPriceYen} ทั้งชุด ตรวจว่าปลาเป้าหมายอยู่ในรายชื่อบอดี้ ${bundle.body} ก่อนซื้อ`,
        reason: `นี่คือข้อเสนอชุดสำเร็จรูปในร้าน ไม่ใช่ตำแหน่งเลือกปีก ${item.id} ในเมนูประกอบ และ ¥${bundle.shopPriceYen} คือราคารวมทั้งชุด ยังไม่มีหลักฐานว่าปีกนี้เพิ่มโอกาสปลากินหรือช่วยให้ตกขึ้น`
      },
      en: {
        label: `Area ${bundle.stage} ready-made set: body ${bundle.body} + wing ${bundle.wing} + tail ${bundle.tail} · ¥${bundle.shopPriceYen} total`,
        recommendation: fish ? supported ? `The target ${fish} is listed for body ${bundle.body}. You can try the area ${bundle.stage} ready-made set (${bundle.body}/${bundle.wing}/${bundle.tail}) for ¥${bundle.shopPriceYen} total, not for the wing alone.` : `The target ${fish} is not in the recorded list for body ${bundle.body}; this set is not a listed profile match. Open the fish page for recorded flies and other methods.` : `If you want wing ${item.id}, the recorded ready-made set is area ${bundle.stage}: body ${bundle.body} + wing ${bundle.wing} + tail ${bundle.tail}, ¥${bundle.shopPriceYen} for the complete set. Check that your target is listed for body ${bundle.body} before buying.`,
        reason: `This is a ready-made shop offer, not a verified custom-menu position for wing ${item.id}. ¥${bundle.shopPriceYen} is the complete-set price. No bite or landing advantage from this wing is established.`
      },
      ja: {
        label: `エリア${bundle.stage}の完成品：ボディ${bundle.body}＋ウィング${bundle.wing}＋テール${bundle.tail} · セット価格¥${bundle.shopPriceYen}`,
        recommendation: fish ? supported ? `対象の${fish}はボディ${bundle.body}の記録済みリストにあります。エリア${bundle.stage}の完成品（${bundle.body}/${bundle.wing}/${bundle.tail}）をセット価格¥${bundle.shopPriceYen}で試せます。ウィング単体の価格ではありません。` : `対象の${fish}はボディ${bundle.body}の記録済みリストにありません。このセットは記録上の対象一致ではありません。魚ページで記録のあるフライや別の釣り方を確認してください。` : `ウィング${item.id}を使う店売り完成品は、エリア${bundle.stage}のボディ${bundle.body}＋ウィング${bundle.wing}＋テール${bundle.tail}、セット価格¥${bundle.shopPriceYen}です。購入前に対象魚がボディ${bundle.body}のリストにあるか確認してください。`,
        reason: `これは店売り完成品で、ウィング${item.id}の自作メニュー位置ではありません。¥${bundle.shopPriceYen}はセット全体の価格です。このウィングによる食いつき・取り込み向上は確認されていません。`
      }
    };
    return result[lang] || result.en;
  }
  function flyWingPlayerDecision(lang, item, allItems = [], fishId = "", fishName2 = "") {
    if (!hasUnverifiedFlyWingPath(item)) return null;
    const bundle = recordedBundle(item);
    if (!bundle) return { ...noBundleCopy(lang, item.id, fishName2), bundle: null, itemId: item.id };
    const body = nameForBundleItem(allItems, "fly", bundle.body);
    const supported = Boolean(fishId && (body?.playerUse?.fishIds || []).includes(fishId));
    const copy2 = bundleCopy(lang, item, bundle, fishName2, supported);
    return { ...copy2, bundle, supported, hasTarget: Boolean(fishId), itemId: item.id };
  }
  function actionLabel(lang, key, bundle) {
    const labels = {
      shop: {
        th: `เปิดร้านด่าน ${bundle.stage} และชุดฟลายนี้`,
        en: `Open area ${bundle.stage} shop and this fly set`,
        ja: `エリア${bundle.stage}の店とこの完成品を見る`
      },
      body: {
        th: `ตรวจรายชื่อปลาของบอดี้ ${bundle.body}`,
        en: `Check body ${bundle.body} fish list`,
        ja: `ボディ${bundle.body}の対象魚リストを確認`
      },
      fish: {
        th: "ดูชุดฟลายและวิธีตกของปลานี้",
        en: "See this fish’s recorded flies and methods",
        ja: "この魚のフライ候補と釣り方を見る"
      },
      starter: {
        th: "ดูชุดสำเร็จรูปและรายชื่อปลาของบอดี้ 01",
        en: "See body 01’s ready-made sets and fish list",
        ja: "ボディ01の完成品と対象魚リストを見る"
      },
      alternative: {
        th: "ดูปีกชิ้นอื่นที่มีตำแหน่งเมนูยืนยัน",
        en: "See a wing with a verified menu position",
        ja: "メニュー位置を確認した別のウィングを見る"
      }
    };
    return labels[key]?.[lang] || labels[key]?.en || "";
  }
  function flyWingPlayerLinks(ctx, decision, hrefs = {}) {
    if (!decision) return "";
    const links = decision.bundle ? [
      ...decision.supported === false && decision.hasTarget ? [] : [["shop", hrefs.shop]],
      ["body", hrefs.body],
      ...hrefs.fish ? [["fish", hrefs.fish]] : []
    ] : hrefs.fish ? [["fish", hrefs.fish]] : [
      ["starter", hrefs.starter],
      ["alternative", hrefs.alternative]
    ];
    const anchors = links.filter(([, href]) => href).map(
      ([key, href]) => `<a class="route-button" data-fly-wing-route="${key}" data-item-id="${ctx.esc(decision.itemId || "")}" href="${ctx.esc(href)}">${ctx.esc(actionLabel(ctx.lang, key, decision.bundle || {}))} ↗</a>`
    ).join("");
    return anchors ? `<div class="fly-wing-player-actions" data-fly-wing-action="${ctx.esc(decision.itemId || "")}">${anchors}</div>` : "";
  }

  // src/entities/item/price-guide-link.js
  var GUIDE_CATEGORIES = /* @__PURE__ */ new Set(["float_weight", "hook"]);
  function categoryGuideLink({ lang, category, fish, stage, route, returnPath } = {}) {
    if (!GUIDE_CATEGORIES.has(category)) return "";
    const locale = ["th", "ja"].includes(lang) ? lang : "en";
    const query = new URLSearchParams({ category });
    if (/^[\da-f]{2}$/i.test(String(fish || ""))) query.set("fish", fish.toUpperCase());
    if (/^[1-6]$/.test(String(stage || ""))) query.set("stage", String(stage));
    if (["float", "sinker"].includes(route)) query.set("route", route);
    if (typeof returnPath === "string" && returnPath) query.set("return", returnPath);
    return `index${locale === "en" ? "" : `.${locale}`}.html?${query}#category-decisions`;
  }

  // src/pages/item/usage.js
  function decisionUsage(ctx, decision) {
    return {
      summary: ctx.local(decision.recommendation),
      facts: [ctx.local(decision.reason)].filter(Boolean)
    };
  }
  function specialCategoryUsage(ctx, item, use) {
    if (item.category === "fly_wing") {
      const summary = ctx.lang === "th" ? "ประกอบเองให้เลือกจากรูปปีกที่ร้านเสนอ ไม่ต้องเตรียมชิ้นส่วนไปเอง ตรวจราคาสุทธิก่อนจ่าย ยังไม่มีหลักฐานว่าปีกแพงเพิ่มโอกาสจับปลา" : ctx.lang === "ja" ? "自作するなら店のウィング画像から選ぶ。部品の持参は不要。支払前に最終見積額を確認する。高価なウィングの釣果優位は未確認。" : "Choose from the maker’s wing pictures; you do not need to bring components. Check the final quote before paying. An expensive wing has no established catch advantage.";
      return { summary, facts: use.facts?.[ctx.lang] || [] };
    }
    if (item.category === "fly_tail") {
      const summary = ctx.lang === "th" ? "เลือกหางนี้ถ้าชอบรูปและยอมรับราคาเสนอ หรือเลือก “ไม่มี” ในเมนูประกอบที่มีตัวเลือกนั้น ยังไม่มีหลักฐานว่าหางนี้เพิ่มโอกาสจับปลา" : ctx.lang === "ja" ? "見た目と見積額で選ぶ。「無し」がある作成画面では省略できる。このテールの釣果ボーナスは確認していない。" : "Choose this tail for its appearance and quoted price, or choose “None” where the maker offers it. A catch advantage from this tail is not established.";
      return { summary, facts: [] };
    }
    if (item.category === "food" && item.id === "08") {
      const summary = ctx.lang === "th" ? "ตรวจชื่อปลาที่เมนูแสดงก่อนกิน เพราะเกมกินตัวแรกในข้อง ถ้าเป็นคุซะฟุกุอย่ากิน: HP จะเหลือ 0" : ctx.lang === "ja" ? "食べる前に表示された魚名を確認する。びくの先頭を食べる。クサフグなら食べない：HPが0になる。" : "Check the displayed fish name before eating: the game eats the first keepnet fish. Do not eat Kusafugu; it sets HP to zero.";
      return { summary, facts: use.facts?.[ctx.lang] || [] };
    }
    return null;
  }
  function visibleUsage(ctx, item, allItems = [], fishVisuals = {}) {
    const use = item.playerUse || {};
    if (item.category === "fly_wing") {
      const wingDecision = flyWingPlayerDecision(
        ctx.lang,
        item,
        allItems,
        ctx.selectedFish,
        ctx.selectedFish ? ctx.fishName(ctx.selectedFish, fishVisuals) : ""
      );
      if (wingDecision) return { summary: wingDecision.recommendation, facts: [wingDecision.reason] };
    }
    const decision = item.baitLureDecision || item.gearDecision || (item.category === "rod" ? item.rodDecision : null);
    if (decision) return decisionUsage(ctx, decision);
    if (item.category === "hook" || item.category === "float_weight")
      return { summary: ctx.local(use.summary), facts: use.facts?.[ctx.lang] || [] };
    const special = specialCategoryUsage(ctx, item, use);
    if (special) return special;
    const facts = use.specialResponseTarget ? [] : use.facts?.[ctx.lang] || use.facts?.en || [];
    return { summary: ctx.local(use.summary) || "", facts };
  }
  function steeringCopy(ctx) {
    return {
      th: {
        title: "ปลาและสัตว์ที่ชี้ทิศให้เข้าหาจุดโปรยได้",
        yes: "โปรไฟล์นี้อยู่ในรายชื่อที่หันทิศเข้าหาจุดโปรยได้",
        no: "โปรไฟล์นี้ไม่อยู่ในรายชื่อที่หันทิศเข้าหาจุดโปรยได้"
      },
      en: {
        title: "Creatures whose movement can be steered toward chum",
        yes: "This profile is in the movement-steering list.",
        no: "This profile is not in the movement-steering list."
      },
      ja: {
        title: "寄せエサの地点へ進行方向を向けられる魚・生き物",
        yes: "このプロフィールは進行方向の誘導リストに含まれる。",
        no: "このプロフィールは進行方向の誘導リストに含まれない。"
      }
    }[ctx.lang];
  }
  function normalizedFishIds(ids) {
    return [...new Set((ids || []).map((id) => String(id).toUpperCase().padStart(2, "0")))];
  }
  function compatibilityRoutes(routes) {
    return Object.keys(routes).filter((route) => Array.isArray(routes[route]) && routes[route].length);
  }
  function renderRouteGroup(ctx, route, ids, fishVisuals, fishLocations) {
    const fishIds = normalizedFishIds(ids);
    const routeName2 = route === "float" ? ctx.copy.routeFloat : ctx.copy.routeSinker;
    const cards = fishIds.map((id) => ctx.fishTile(id, fishVisuals, fishLocations, ctx.selectedStage)).join("");
    const active = ctx.selectedRoute === route ? 'data-active="true"' : "";
    return `<div id="rig-${ctx.esc(route)}" class="detail-section" ${active}><h3>${ctx.esc(routeName2)} · ${fishIds.length}</h3><div class="detail-grid">${cards}</div></div>`;
  }
  function renderCompatibilityGroups(ctx, routes, routeKeys, ids, fishVisuals, fishLocations) {
    if (!routeKeys.length) {
      const cards = ids.map((id) => ctx.fishTile(id, fishVisuals, fishLocations, ctx.selectedStage)).join("");
      return `<div class="detail-grid">${cards}</div>`;
    }
    return routeKeys.map((route) => renderRouteGroup(ctx, route, routes[route], fishVisuals, fishLocations)).join("");
  }
  function targetAccepted(ctx, routes, routeKeys, ids) {
    const activeRoute = ctx.selectedRoute && Object.hasOwn(routes, ctx.selectedRoute) ? ctx.selectedRoute : null;
    if (activeRoute) return normalizedFishIds(routes[activeRoute]).includes(ctx.selectedFish);
    return ids.includes(ctx.selectedFish) || routeKeys.some((route) => normalizedFishIds(routes[route]).includes(ctx.selectedFish));
  }
  function targetStatus(ctx, routes, accepted, steering, steeringText) {
    const activeRoute = ctx.selectedRoute && Object.hasOwn(routes, ctx.selectedRoute) ? ctx.selectedRoute : null;
    const routePrefix = activeRoute ? `${activeRoute === "float" ? ctx.copy.routeFloat : ctx.copy.routeSinker}: ` : "";
    const status = accepted ? steering ? steeringText.yes : ctx.copy.targetYes : steering ? steeringText.no : ctx.copy.targetNo;
    return routePrefix + status;
  }
  function steeringScope(ctx, steering) {
    if (!steering) return ctx.copy.fishScope;
    if (ctx.lang === "th")
      return "รายชื่อนี้บอกผลต่อทิศการเคลื่อนที่ ไม่ใช่เหยื่อที่กินหรือโบนัสโอกาสกัด";
    if (ctx.lang === "ja")
      return "進行方向の効果であり、食べられるエサや食いつき率のボーナスを示さない。";
    return "This list describes movement steering, not edible bait or a bite-rate bonus.";
  }
  function compatibilitySummary(ctx, count, steering, rigRoute) {
    if (rigRoute) return `${ctx.copy[`${rigRoute}FishSummary`]} · ${count}`;
    if (steering) {
      if (ctx.lang === "th") return `ดูรายชื่อปลาและสัตว์ · ${count}`;
      if (ctx.lang === "ja") return `魚・生き物の一覧を見る · ${count}`;
      return `See creature list · ${count}`;
    }
    if (ctx.lang === "th") return `ปลาที่ใช้ด้วยได้ · ${count}`;
    if (ctx.lang === "ja") return `対応する魚 · ${count}`;
    return `Compatible fish · ${count}`;
  }
  function floatSinkerRoute(item) {
    if (item.category !== "float_weight") return "";
    const id = Number.parseInt(item.id, 16);
    if (id >= 1 && id <= 8) return "float";
    if (id === 9 || id === 10) return "sinker";
    return "";
  }
  function routeTargetStatus(ctx, route, accepted) {
    const key = `${route}Target${accepted ? "Yes" : "No"}`;
    return ctx.copy[key];
  }
  function acceptedBaitLink(ctx, fishLocations, route) {
    if (!route || !ctx.selectedFish) return "";
    const profile = `${ctx.fishProfileLink(ctx.selectedFish, fishLocations)}#all-compatible`;
    return `<p class="compatibility-next-step"><a class="route-button" data-accepted-bait-link="${ctx.esc(route)}" href="${ctx.esc(profile)}">${ctx.esc(ctx.copy.acceptedBaits)} ↗</a></p>`;
  }
  function fishSection(ctx, item, fishVisuals, fishLocations) {
    const use = item.playerUse || {};
    const routes = use.fishIdsByRoute || {};
    const steering = item.category === "general_tool" && ["08", "09", "0A"].includes(item.id);
    const rigRoute = floatSinkerRoute(item);
    const routeKeys = compatibilityRoutes(routes);
    const ids = Array.isArray(use.fishIds) ? normalizedFishIds(use.fishIds) : [];
    const categories = ["lure", "fly", "bait", "float_weight", "general_tool"];
    if (!categories.includes(item.category) || !ids.length && !routeKeys.length) return "";
    const copy2 = steeringCopy(ctx);
    const heading = steering ? copy2.title : rigRoute ? ctx.copy[`${rigRoute}FishHeading`] : ctx.copy.fish;
    const groups = renderCompatibilityGroups(ctx, routes, routeKeys, ids, fishVisuals, fishLocations);
    const accepted = targetAccepted(ctx, routes, routeKeys, ids);
    const status = ctx.selectedFish ? rigRoute ? routeTargetStatus(ctx, rigRoute, accepted) : targetStatus(ctx, routes, accepted, steering, copy2) : "";
    const fishTarget = ctx.selectedFish ? `<p class="play-target"${rigRoute ? ` data-target-route="${rigRoute}"` : ""}><strong>${ctx.esc(ctx.copy.target)} · ${ctx.esc(ctx.fishName(ctx.selectedFish, fishVisuals))} (${ctx.esc(ctx.selectedFish)})</strong><br>${ctx.esc(status)}</p>${acceptedBaitLink(ctx, fishLocations, rigRoute)}` : "";
    const count = routeKeys.length ? new Set(Object.values(routes).flatMap(normalizedFishIds)).size : ids.length;
    const list = `<details class="compatibility-details"><summary>${ctx.esc(compatibilitySummary(ctx, count, steering, rigRoute))}</summary>${groups}</details>`;
    const scope = rigRoute ? ctx.copy[`${rigRoute}FishScope`] : ctx.local(use.fishScope) || ctx.copy.fishScope;
    const caveat = rigRoute ? "" : `<p class="muted">${ctx.esc(steeringScope(ctx, steering))}</p>`;
    return `<section class="detail-section compatibility-section"${rigRoute ? ` data-compatibility-route="${rigRoute}"` : ""}><h2>${ctx.esc(heading)} · ${count}</h2>${fishTarget}<p class="section-lede">${ctx.esc(scope)}</p>${list}${caveat}</section>`;
  }
  function technicalSection(ctx, item) {
    const use = item.playerUse || {}, sources = [
      .../* @__PURE__ */ new Set([
        ...use.evidence?.sources || [],
        ...item.rodDecision?.sources || [],
        ...item.gearDecision?.sources || [],
        ...item.baitLureDecision?.sources || []
      ])
    ];
    const decoded = item.decodedFields || {}, targets = use.targetMatches ? Array.isArray(use.targetMatches) ? use.targetMatches : [use.targetMatches] : [];
    const noteArray = use.evidenceNotes?.[ctx.lang] || use.evidenceNotes?.en || [];
    const sourceLinks = sources.map(
      (path) => `<li><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${encodeURI(path)}" target="_blank" rel="noopener">${ctx.esc(path)} ↗</a></li>`
    ).join("");
    const techTargets = targets.length ? `<h3>${ctx.esc(ctx.copy.targets)}</h3><ul>${targets.map((t) => `<li>${ctx.esc(t.nameTh && ctx.lang === "th" ? t.nameTh : t.nameJa || t.fishId)} · ID ${ctx.esc(t.fishId)} — ${ctx.esc(ctx.local(use.targetMatchScope))}</li>`).join("")}</ul>` : "";
    const renderedDecoded = Object.entries(decoded).map(
      ([key, value]) => `<dt>${ctx.esc(key)}</dt><dd><code>${ctx.esc(typeof value === "object" ? JSON.stringify(value) : value)}</code></dd>`
    ).join("");
    const rawFields = Object.entries(item.rawFields || {}).map(
      ([key, value]) => `<dt>${ctx.esc(key)}</dt><dd><code>${ctx.esc(typeof value === "object" ? JSON.stringify(value) : value)}</code></dd>`
    ).join("");
    const rodMechanics = item.category === "rod" || item.gearDecision ? `<h3>${ctx.lang === "th" ? "การทำงานที่แกะได้" : ctx.lang === "ja" ? "解読した動作" : "Decoded mechanics"}</h3><p>${ctx.esc(ctx.local(use.summary))}</p><ul>${(use.facts?.[ctx.lang] || []).map((fact) => `<li>${ctx.esc(fact)}</li>`).join("")}</ul>` : "";
    const notes = noteArray.map((note) => `<li>${ctx.esc(note)}</li>`).join("");
    return `<details class="evidence"><summary>${ctx.esc(ctx.copy.tech)}</summary><div class="detail-content"><p><strong>${ctx.esc(ctx.copy.itemPrice)}:</strong> ${item.priceYen == null ? "—" : `¥${ctx.esc(item.priceYen)}`}</p><p><strong>${ctx.esc(ctx.copy.offset)}:</strong> <code>${ctx.esc(item.fileOffset || "—")}</code></p><p><strong>${ctx.esc(ctx.copy.bytes)}:</strong> <code>${ctx.esc(item.recordBytesHex || "—")}</code></p>${techTargets}${rodMechanics}${renderedDecoded ? `<h3>${ctx.esc(ctx.copy.fields)}</h3><dl>${renderedDecoded}</dl>` : ""}${rawFields ? `<h3>${ctx.esc(ctx.copy.raw)}</h3><dl>${rawFields}</dl>` : ""}${notes ? `<h3>${ctx.esc(ctx.copy.evidenceNotes)}</h3><ul>${notes}</ul>` : ""}${sources.length ? `<h3>${ctx.esc(ctx.copy.source)}</h3><ul>${sourceLinks}</ul>` : ""}<a href="${ctx.esc(item.frame || item.image)}" target="_blank" rel="noopener">${ctx.esc(ctx.copy.openFrame)}</a></div></details>`;
  }

  // src/pages/item/locations.js
  function locationCopy(ctx) {
    return {
      th: {
        pin: "รูปไอเท็มชี้ตำแหน่งที่ต้องไป",
        forage: "รูปเหยื่อชี้ช่องตัวอย่างที่ค้นหาได้ ถ้ามีสองรูปคือผลลัพธ์ทางเลือก ไม่ได้รับทั้งคู่ ขยับช่องก่อนค้นซ้ำ",
        open: "เปิดภาพบริเวณนี้เต็ม",
        full: "เปิดภาพฉากทั้งด่าน",
        window: "ยืนใช้ไอเท็มในช่วง"
      },
      en: {
        pin: "The item portrait marks where to go.",
        forage: "Bait portraits mark an example search tile. Two portraits mean alternative results, not both at once. Move to another tile before searching again.",
        open: "Open this location image",
        full: "Open full area terrain",
        window: "Stand and use the item within"
      },
      ja: {
        pin: "道具画像が目的の場所を示す。",
        forage: "エサ画像は探索できるタイル例。2枚なら結果の候補で、両方同時ではない。再探索前に別タイルへ移動する。",
        open: "この場所の画像を開く",
        full: "エリア全体の地形を開く",
        window: "この範囲で道具を使う"
      }
    }[ctx.lang];
  }
  function locationMarkerItems(loc, item, allItems) {
    const refs = loc.markerItems || (loc.markerItem ? [loc.markerItem] : [{ category: item.category, id: item.id }]);
    return refs.map(
      (ref) => allItems.find((candidate) => candidate.category === ref.category && candidate.id === ref.id)
    ).filter(Boolean);
  }
  function isCurrentItem(marker, item) {
    return marker.category === item.category && marker.id === item.id;
  }
  function locationPinNote(ctx, loc, text3) {
    if (loc.kind === "runtime_net_use") {
      if (ctx.lang === "th") return "รูปแมลงน้ำชี้ช่องที่ทดลองใช้ตาข่ายสำเร็จ";
      if (ctx.lang === "ja") return "カワムシ画像はアミ使用に成功したタイルを示す。";
      return "The aquatic insect portrait marks the successfully tested net tile.";
    }
    return loc.forage ? text3.forage : text3.pin;
  }
  function locationMarkerLink(ctx, marker, item, loc, stage) {
    if (isCurrentItem(marker, item)) return loc.image;
    const returnRoute = loc.forage ? ctx.foragePointReturn(stage, loc.context) : "";
    return ctx.areaItemLink(marker, stage, "", returnRoute);
  }
  function locationVisual(ctx, loc, item, markers, stage, text3) {
    if (!loc.image || !loc.pin) return "";
    const markerLinks = markers.map((marker) => {
      const current = isCurrentItem(marker, item);
      const target = current ? ' target="_blank" rel="noopener"' : "";
      const label = current ? text3.open : ctx.imageName(marker);
      return `<a href="${ctx.esc(locationMarkerLink(ctx, marker, item, loc, stage))}"${target} aria-label="${ctx.esc(label)}"><img src="${ctx.esc(marker.image)}" alt="${ctx.esc(ctx.imageName(marker))}"></a>`;
    }).join("");
    const note = locationPinNote(ctx, loc, text3);
    return `<div class="tool-use-map" style="aspect-ratio:${Number(loc.width) || 1}/${Number(loc.height) || 1}"><img class="tool-use-ground" src="${ctx.esc(loc.image)}" alt="${ctx.esc(ctx.local(loc.name))}"><span class="tool-use-pin" style="left:${Number(loc.pin.x) * 100}%;top:${Number(loc.pin.y) * 100}%">${markerLinks}</span></div><p class="muted">${ctx.esc(note)}</p>`;
  }
  function entranceTitle(ctx) {
    if (ctx.lang === "th") return "เริ่มจากทางเข้าเมืองนี้บนแผนที่ด่าน";
    if (ctx.lang === "ja") return "屋外ではこの町入口から入る";
    return "Start at this town entrance on the outdoor map";
  }
  function entranceText(ctx) {
    if (ctx.lang === "th") return "เข้าประตูที่รูปไอเท็มชี้ แล้วไปหีบในห้องที่แสดงด้านบน";
    if (ctx.lang === "ja") return "道具画像が示す入口に入り、上の部屋画像の宝箱へ進みます。";
    return "Enter through the door marked by the item portrait, then find the chest in the room shown above.";
  }
  function renderEntranceGuide(ctx, item, loc, text3) {
    const approach = loc.approach;
    if (!approach) return "";
    const pin = `<span class="tool-use-pin" style="left:${approach.pin.x * 100}%;top:${approach.pin.y * 100}%"><a href="${ctx.esc(approach.image)}" target="_blank" rel="noopener"><img src="${ctx.esc(item.image)}" alt="${ctx.esc(ctx.imageName(item))}"></a></span>`;
    const map = `<div class="tool-use-map" style="aspect-ratio:${approach.width}/${approach.height}"><img class="tool-use-ground" src="${ctx.esc(approach.image)}" alt="${ctx.esc(entranceTitle(ctx))}">${pin}</div>`;
    const full = `<a href="${ctx.esc(approach.fullImage)}" target="_blank" rel="noopener">${ctx.esc(text3.full)} ↗</a>`;
    return `<details class="town-approach"><summary>${ctx.esc(entranceTitle(ctx))}</summary><p>${ctx.esc(entranceText(ctx))}</p>${map}<p>X ${approach.tileX}, Y ${approach.tileY}</p>${full}</details>`;
  }
  function rewardItem(loc, allItems) {
    const ref = loc.rewardItem;
    if (!ref) return null;
    return allItems.find((candidate) => candidate.category === ref.category && candidate.id === ref.id) || null;
  }
  function requiredItem(loc, allItems) {
    const ref = loc.requiredItem;
    if (!ref) return null;
    return allItems.find((candidate) => candidate.category === ref.category && candidate.id === ref.id) || null;
  }
  function itemReference(ctx, target, current) {
    if (isCurrentItem(target, current)) return ctx.esc(ctx.imageName(target));
    return `<a href="${ctx.esc(ctx.detailItemLink(target))}">${ctx.esc(ctx.imageName(target))} ↗</a>`;
  }
  function requirementLabel(ctx) {
    if (ctx.lang === "th") return "ต้องพก:";
    if (ctx.lang === "ja") return "必要な道具：";
    return "Bring:";
  }
  function rewardLabel(ctx, loc) {
    if (loc.context === "town") {
      if (ctx.lang === "th") return "ของในหีบ:";
      if (ctx.lang === "ja") return "宝箱の中身：";
      return "Chest reward:";
    }
    if (ctx.lang === "th") return "ของที่ได้รับ:";
    if (ctx.lang === "ja") return "受け取る道具：";
    return "Reward:";
  }
  function renderRequirement(ctx, loc, item, allItems) {
    const required = requiredItem(loc, allItems);
    if (!required) return "";
    return `<p>${ctx.esc(requirementLabel(ctx))} ${itemReference(ctx, required, item)}</p>`;
  }
  function renderReward(ctx, loc, item, allItems) {
    const reward = rewardItem(loc, allItems);
    if (!reward) return "";
    return `<p>${ctx.esc(rewardLabel(ctx, loc))} ${itemReference(ctx, reward, item)}</p>`;
  }
  function townLabel(ctx, loc) {
    if (loc.context !== "town") return "";
    if (ctx.lang === "th") return " · ในเมือง";
    if (ctx.lang === "ja") return " · 町内";
    return " · In town";
  }
  function entranceLabel(ctx, loc) {
    if (!Number.isInteger(loc.townEntranceOrdinal)) return "";
    const ordinal = loc.townEntranceOrdinal + 1;
    const label = ctx.lang === "th" ? `ห้องของทางเข้าเมืองที่ ${ordinal}` : ctx.lang === "ja" ? `町入口${ordinal}につながる部屋` : `Room reached from town entrance ${ordinal}`;
    return `<p>${ctx.esc(label)}</p>`;
  }
  function fullImageLabel(ctx, loc, text3) {
    if (loc.context !== "town") return text3.full;
    if (ctx.lang === "th") return "เปิดภาพในเมืองทั้งห้าห้อง";
    if (ctx.lang === "ja") return "町内の5部屋の画像を開く";
    return "Open all five town rooms";
  }
  function locationAnchor(loc, stage) {
    if (loc.kind === "runtime_tub_boarding") return `id="tub-boarding-${stage}"`;
    if (loc.kind === "runtime_canoe_boarding") return `id="canoe-boarding-${stage}"`;
    if (loc.kind === "compass_exit") return `id="compass-exit-${stage}"`;
    if (loc.forage) return `id="forage-stage-${stage}-context-${Number(loc.context)}"`;
    return "";
  }
  function locationCoordinates(ctx, loc, text3) {
    const tile = `<p>X ${ctx.esc(loc.tileX)}, Y ${ctx.esc(loc.tileY)}</p>`;
    if (!loc.useWindow) return tile;
    const { xMin, xMax, yMin, yMax } = loc.useWindow;
    return `${tile}<p>${ctx.esc(text3.window)} X ${xMin}–${xMax}, Y ${yMin}–${yMax}</p>`;
  }
  function locationImageLinks(ctx, loc, text3) {
    const image = loc.image ? `<a href="${ctx.esc(loc.image)}" target="_blank" rel="noopener">${ctx.esc(text3.open)} ↗</a>` : "";
    const full = loc.fullImage ? ` · <a href="${ctx.esc(loc.fullImage)}" target="_blank" rel="noopener">${ctx.esc(fullImageLabel(ctx, loc, text3))} ↗</a>` : "";
    const capture = loc.runtimeImage ? ` · <a href="${ctx.esc(loc.runtimeImage)}" target="_blank" rel="noopener">${ctx.esc(ctx.local(loc.runtimeCaption))} ↗</a>` : "";
    return `${image}${full}${capture}`;
  }
  function locationDescription(ctx, loc) {
    return ctx.esc(ctx.local(loc.description) || ctx.local(loc.name) || "");
  }
  function locationEntry(ctx, item, loc, fishLocations, allItems, text3) {
    const stage = Number(loc.stage) || 0;
    const markers = locationMarkerItems(loc, item, allItems);
    const visual = locationVisual(ctx, loc, item, markers, stage, text3);
    const stageName2 = stage ? `${ctx.copy.area(stage)} · ${ctx.stageName(stage, fishLocations)}` : "";
    const action = loc.action ? `<p class="acquisition-action">${ctx.esc(ctx.local(loc.action))}</p>` : "";
    const content = [
      entranceLabel(ctx, loc),
      renderRequirement(ctx, loc, item, allItems),
      renderReward(ctx, loc, item, allItems),
      action,
      `<p>${locationDescription(ctx, loc)}</p>`,
      visual,
      locationCoordinates(ctx, loc, text3),
      locationImageLinks(ctx, loc, text3),
      renderEntranceGuide(ctx, item, loc, text3)
    ].join("");
    return `<article class="detail-section" ${locationAnchor(loc, stage)}><h3>${ctx.esc(stageName2 + townLabel(ctx, loc))}</h3>${content}</article>`;
  }
  function useLocationSection(ctx, item, fishLocations, allItems) {
    const locations = item.playerUse?.useLocations || [];
    if (!locations.length) return "";
    const text3 = locationCopy(ctx);
    const cards = locations.map((loc) => locationEntry(ctx, item, loc, fishLocations, allItems, text3)).join("");
    const layout = locations.length === 1 ? "single-location" : "";
    return `<section class="detail-section locations-section" id="use-locations"><h2>${ctx.esc(ctx.copy.useLocations)}</h2><div class="detail-grid tool-location-grid ${layout}">${cards}</div></section>`;
  }

  // src/pages/item/actions.js
  function boatBoardingChoice(ctx, item) {
    if (item.category !== "general_tool" || !["01", "02"].includes(item.id)) return "";
    const canoe = item.id === "02";
    const kind = canoe ? "canoe" : "tub";
    const label = ctx.lang === "th" ? `มี${canoe ? "แคนู" : "กะละมัง"}แล้ว? ดูจุดวางและวิธีขึ้นที่ทดลองสำเร็จ` : ctx.lang === "ja" ? `${canoe ? "カヌー" : "タライ"}を持っている？確認した設置・乗船手順を見る` : `Already own a ${kind}? See a tested placement and boarding sequence`;
    return `<p><a class="route-button" data-${kind}-boarding-choice href="#${kind}-boarding-1">${ctx.esc(label)} ↓</a></p>`;
  }
  function gearNextActions(ctx, item, fishVisuals, fishLocations, allItems) {
    if (!item.gearDecision) return "";
    const guideLink = (category, marker) => {
      const href = categoryGuideLink({
        lang: ctx.lang,
        category,
        fish: ctx.selectedFish,
        stage: ctx.selectedStage,
        route: ctx.selectedRoute,
        returnPath: ctx.currentLocalRoute()
      });
      const label = category === "hook" ? ctx.lang === "th" ? "เบ็ดหายหรือยังไม่มี? ดูเบ็ดทั่วไปที่ถูกสุดทั้งหกด่าน" : ctx.lang === "ja" ? "針を失った・持っていない？6エリアの最安汎用針を見る" : "Lost your hook or have none? See the cheapest generic hook in each area" : ctx.lang === "th" ? "ดูทุ่นและตะกั่วราคาต่ำสุดแยกทั้งหกด่าน" : ctx.lang === "ja" ? "6エリアの最安ウキ・オモリを見る" : "See the cheapest float and sinker in each of six areas";
      return `<p><a class="route-button" data-${marker}-price-guide href="${ctx.esc(href)}">${label} ↗</a></p>`;
    };
    if (item.category === "float_weight") return guideLink("float_weight", "float");
    const ids = (item.gearDecision.targetFish || []).filter((id) => fishVisuals[id]);
    const hookBudget = item.category === "hook" ? guideLink("hook", "hook") : "";
    if (item.category === "hook" && !ids.length) return hookBudget;
    if (item.category === "hook" && ids.length)
      return hookBudget + `<p>${ctx.lang === "th" ? "ดูเหยื่อและจุดตกของปลาที่ชื่อเบ็ดอ้างถึง (ไม่ได้แนะนำให้ใช้เบ็ดนี้จับง่ายกว่า)" : ctx.lang === "ja" ? "ハリ名が参照する魚のエサ・場所を確認（このハリの優位性を示すものではありません）" : "See bait and locations for the fish named by this hook (not a claim this hook lands it more easily)"}</p>${ids.map((id) => `<a class="route-button" href="${ctx.esc(ctx.fishProfileLink(id, fishLocations))}">${ctx.esc(ctx.fishName(id, fishVisuals))} ↗</a>`).join("")}`;
    if (item.category.startsWith("fly")) {
      const target = ctx.selectedFish && fishVisuals[ctx.selectedFish] ? ctx.selectedFish : "";
      if (target) {
        const supported = allItems.some(
          (candidate) => candidate.category === "fly" && candidate.playerUse?.fishIds?.includes(target)
        );
        return `<p><a class="route-button" data-fly-next href="${ctx.esc(ctx.fishProfileLink(target, fishLocations))}${supported ? "#fly-backup" : ""}">${supported ? ctx.lang === "th" ? "ดูชุดฟลายเริ่มต้นและชุดสำรองสำหรับปลาที่เลือก" : ctx.lang === "ja" ? "選んだ魚の最初の毛バリと予備を見る" : "See starter and backup flies for the selected fish" : ctx.lang === "th" ? "ปลานี้ไม่ผ่านเงื่อนไขฟลาย: ดูเหยื่อและวิธีอื่น" : ctx.lang === "ja" ? "この魚はフライ判定に不適合：他のエサ・釣法を見る" : "This fish fails the fly profile check: see other bait and methods"} ↗</a></p>`;
      }
      if (item.category === "fly")
        return `<p>${ctx.lang === "th" ? "เลือกปลาในรายชื่อด้านล่าง เพื่อดูจุดตกและชุดฟลายเริ่มต้น/สำรองของปลานั้น" : ctx.lang === "ja" ? "下の魚一覧から選び、場所と最初の毛バリ・予備を確認してください。" : "Choose a fish in the list below to see its locations and starter/backup flies."}</p>`;
      return `<p><a class="route-button" data-fly-next href="item${ctx.lang === "en" ? "" : "." + ctx.lang}.html?category=fly&id=01&return=${encodeURIComponent(ctx.currentLocalRoute())}">${ctx.lang === "th" ? "เลือกปลาจากรายชื่อบอดี้ แล้วดูชุดฟลายในหน้าปลา" : ctx.lang === "ja" ? "ボディの魚一覧から選び、魚ページで毛バリ候補を見る" : "Choose a fish from the body list, then see flies on its profile"} ↗</a></p>`;
    }
    return "";
  }
  function areaItemLink(ctx, item, stage, hash = "", pointReturn = "") {
    const sameItem = item.category === ctx.category && item.id === ctx.requestedId;
    const returnRoute = ctx.safeLocalRoute(pointReturn) || (sameItem ? ctx.safeLocalRoute(ctx.params.get("return")) || ctx.fallbackBack() : ctx.currentLocalRoute());
    const [page, query] = ctx.detailItemLink(item, returnRoute).split("?");
    const linkParams = new URLSearchParams(query);
    linkParams.set("stage", String(stage));
    if (ctx.selectedRoute) linkParams.set("route", ctx.selectedRoute);
    return page + "?" + linkParams + hash;
  }
  function foragePointReturn(ctx, stage, context) {
    const query = new URLSearchParams(location.search);
    query.set("stage", String(stage));
    return `${location.pathname}?${query}#forage-stage-${stage}-context-${Number(context)}`;
  }
  function compassUseChoice(ctx, item) {
    if (item.category !== "general_tool" || item.id !== "0E") return "";
    const locations = item.playerUse?.useLocations || [];
    if (!locations.length) return "";
    const label = ctx.lang === "th" ? "หลงทาง? ดูจุดออกของด่านที่อยู่" : ctx.lang === "ja" ? "迷ったら現在エリアの出口地点を見る" : "Lost? See the exit point for your current area";
    return `<aside class="detail-section compass-exit-choice" data-compass-exit-choice><h3>${label}</h3><p>${ctx.lang === "th" ? "เลือกด่าน แล้วดูรูปแม่เหล็กที่ชี้จุดทางเชื่อม เข็มจะหยุดเมื่อถึงช่องเป้าหมาย แต่คำบอกทิศไม่ใช่เส้นทางหลบสิ่งกีดขวาง" : ctx.lang === "ja" ? "エリアを選び、磁石画像が示す連絡路の地点を確認します。目標タイルで針が止まりますが、方角表示は障害物を避ける経路案内ではありません。" : "Choose an area and find the connecting-route point marked by the magnet portrait. The needle stops at its target tile; the heading does not supply a route around obstacles."}</p>${locations.map((loc) => `<p><a data-compass-location href="${ctx.esc(ctx.areaItemLink(item, loc.stage, "#compass-exit-" + loc.stage))}">${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"} ${loc.stage} · ${ctx.lang === "th" ? "ดูจุดที่เข็มหยุด" : ctx.lang === "ja" ? "針が止まる地点を見る" : "See where the needle stops"} ↗</a></p>`).join("")}</aside>`;
  }
  function gatheredBaitChoices(ctx, item, allItems) {
    if (!item.gatheredBaitByArea) return "";
    const title = ctx.lang === "th" ? "เหยื่อที่ตาข่ายหาได้: เลือกดูว่าใช้ตกปลาอะไร" : ctx.lang === "ja" ? "金アミで採れるエサ：対応魚を見る" : "Baits gathered with the net: see which fish accept them";
    return `<section class="detail-section gathered-bait"><h3>${title}</h3>${item.playerUse?.useLocations?.some((l) => l.kind === "runtime_net_use") ? `<p class="net-location-choice" data-net-location-choice><a href="${ctx.esc(ctx.areaItemLink(item, 1, "#use-locations"))}">${ctx.lang === "th" ? "ด่าน 1: ดูภาพช่องน้ำตื้นที่ทดลองใช้ตาข่ายสำเร็จ" : ctx.lang === "ja" ? "エリア1：アミ使用に成功した浅瀬を見る" : "Area 1: see the shallow tile where net use succeeded"} ↗</a><br>${ctx.lang === "th" ? "ยังไม่ยืนยันเส้นทางเดินจากทางเข้า; หากไปถึงช่องนี้แล้วจึงใช้ตำแหน่งนี้ได้" : ctx.lang === "ja" ? "入口からの経路は未確認。このタイルに到達した場合の使用地点です。" : "The walking route from the entrance remains unconfirmed; use this location if you reach the tile."}</p>` : ""}${Object.entries(
      item.gatheredBaitByArea
    ).map(([stage, id]) => {
      const bait = allItems.find((i) => i.category === "bait" && i.id === id);
      return `<p>${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"} ${stage} · <a data-gathered-bait href="${ctx.esc(ctx.areaItemLink(bait, stage))}">${ctx.esc(ctx.imageName(bait))} (${id}) ↗</a></p>`;
    }).join("")}</section>`;
  }
  function baitGatherChoice(ctx, item) {
    if (!item.netGatherArea) return "";
    const note = ctx.lang === "th" ? `ถ้ามีตาข่ายสีทองอยู่แล้ว หาเหยื่อนี้ได้ในด่าน ${item.netGatherArea}: ยืนในน้ำตื้น ใช้ตาข่าย แล้วขยับช่องก่อนใช้ซ้ำ แทนการซื้อเหยื่อเพิ่ม` : ctx.lang === "ja" ? `金アミを持っているならエリア${item.netGatherArea}の浅瀬でこのエサを採れます。浅瀬に立って使い、次は別のタイルへ移動してください。追加購入の代わりになります。` : `If you already own the gold net, gather this bait in area ${item.netGatherArea} instead of buying more: stand in shallow water, use the net, then move to a new tile before using it again.`;
    const label = ctx.lang === "th" ? "ดูวิธีใช้ตาข่ายและจำนวนที่เก็บได้" : ctx.lang === "ja" ? "金アミの使い方と採れる個数を見る" : "See net use and gathering amounts";
    return `<aside class="detail-section bait-gather-choice" data-bait-gather-choice><p>${ctx.esc(note)}</p><a href="${ctx.esc(ctx.areaItemLink({ category: "general_tool", id: "04" }, item.netGatherArea, item.netGatherArea === 1 ? "#use-locations" : ""))}">${label} ↗</a></aside>`;
  }
  function forageBaitChoice(ctx, item, items) {
    if (item.category !== "bait") return "";
    const routeIds = item.playerUse?.fishIdsByRoute?.[ctx.selectedRoute];
    if (ctx.selectedFish && routeIds && !routeIds.includes(ctx.selectedFish)) return "";
    const glass = items.find((i) => i.category === "general_tool" && i.id === "03");
    const points = (glass?.playerUse?.useLocations || []).filter(
      (loc) => loc.forage && (loc.markerItems || []).some((ref) => ref.category === "bait" && ref.id === item.id)
    );
    const stages = [...new Set(points.map((loc) => Number(loc.stage)))];
    if (!stages.length) return "";
    const shown = ctx.selectedStage && stages.includes(ctx.selectedStage) ? [ctx.selectedStage] : stages;
    const note = ctx.lang === "th" ? "ถ้ามีแว่นขยายอยู่แล้ว ลองหาเหยื่อนี้แทนการซื้อเพิ่ม: ไปถึงช่องตัวอย่างแล้วใช้แว่นขยาย ขยับช่องก่อนค้นซ้ำ บางช่องมีผลลัพธ์ได้สองชนิด จึงไม่รับประกันว่าจะได้ชนิดนี้ทุกครั้ง" : ctx.lang === "ja" ? "虫メガネを持っているなら、追加購入の代わりに探索できます。地点例で使い、再探索前に移動してください。2種類の候補がある地点では毎回このエサが出るとは限りません。" : "If you already own the magnifying glass, try gathering instead of buying more: use it at an example tile and move before searching again. Some tiles have two possible results, so this bait is not guaranteed every time.";
    return `<aside class="detail-section forage-bait-choice" data-forage-bait-choice><p>${ctx.esc(note)}</p>${shown.map((stage) => {
      const loc = points.find((point) => Number(point.stage) === stage);
      return `<p><a data-forage-bait href="${ctx.esc(ctx.areaItemLink(glass, stage, "#forage-stage-" + stage + "-context-" + Number(loc.context)))}">${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"} ${stage} · ${ctx.lang === "th" ? "ดูภาพจุดตัวอย่างหาเหยื่อนี้" : ctx.lang === "ja" ? "このエサの探索地点例を見る" : "See an example search tile for this bait"} ↗</a></p>`;
    }).join("")}</aside>`;
  }
  function daikonFishChoice(ctx, item, fishLocations) {
    if (!item.exchangeFishId) return "";
    const fishLabel = item.exchangeFishId === "22" ? ctx.lang === "th" ? "ฮาริโยะ" : ctx.lang === "ja" ? "ハリヨ" : "Hariyo" : ctx.lang === "th" ? "ปลายามาโนะคามิ" : ctx.lang === "ja" ? "ヤマノカミ" : "Yamanokami";
    const label = ctx.lang === "th" ? "ดู" + fishLabel + ": จุดตกและเหยื่อ" : ctx.lang === "ja" ? fishLabel + "の場所・エサを確認" : "See " + fishLabel + " locations and bait";
    const href = ctx.fishProfileLink(item.exchangeFishId, fishLocations);
    return `<aside class="detail-section daikon-fish-choice" ${item.tubExchange ? "data-tub-choice" : "data-daikon-choice"}><a class="route-button" href="${ctx.esc(href)}">${ctx.esc(label)} ↗</a></aside>`;
  }
  function keepnetAlternatives(ctx, item, items) {
    if (!item.keepnetCapacity) return "";
    const quest = items.find((candidate) => candidate.category === "food" && candidate.id === "07");
    const questLabel = ctx.lang === "th" ? "จะเก็บยามาโนะคามิแลกหัวไชเท้า? อ่านผลต่ออาหารก่อน" : ctx.lang === "ja" ? "ヤマノカミを大根交換用に残す？ 食料への影響を先に確認" : "Keeping Yamanokami for Daikon? Read the food-inventory effect first";
    const questLink = quest ? `<p><a href="${ctx.esc(ctx.detailItemLink(quest))}">${ctx.esc(questLabel)} ↗</a></p>` : "";
    const title = ctx.lang === "th" ? "เทียบข้องขนาดอื่น" : ctx.lang === "ja" ? "他のびくと比較" : "Compare keepnet sizes";
    return `<aside class="detail-section keepnet-alternatives" data-keepnet-choice><h3>${ctx.esc(title)}</h3>${items.filter((candidate) => candidate.keepnetCapacity && candidate.id !== item.id).map(
      (candidate) => `<p><a href="${ctx.esc(ctx.detailItemLink(candidate))}">${ctx.esc(ctx.imageName(candidate))} · ${candidate.keepnetCapacity} ${ctx.lang === "th" ? "ตัว" : ctx.lang === "ja" ? "匹" : "fish"} · ¥${candidate.priceYen} ↗</a></p>`
    ).join("")}${questLink}</aside>`;
  }
  function priceChoiceGroups(rows) {
    const groups = /* @__PURE__ */ new Map();
    for (const [stage, refs] of rows) {
      const key = JSON.stringify(refs);
      if (!groups.has(key)) groups.set(key, { stages: [], refs });
      groups.get(key).stages.push(stage);
    }
    return [...groups.values()];
  }
  function priceChoiceTitle(ctx) {
    if (ctx.lang === "th") return "ถ้าซื้อใหม่: ตัวเลือกถูกกว่าแยกตามด่าน";
    if (ctx.lang === "ja") return "新規購入：エリア別の安い候補";
    return "Buying new: cheaper choices by area";
  }
  function priceChoiceGroup(ctx, group, items) {
    const area = ctx.copy.area(group.stages.join(" / "));
    const selectedStage = Number(ctx.selectedStage);
    const linkStage = group.stages.some((stage) => Number(stage) === selectedStage) ? selectedStage : Number(group.stages[0]);
    const refs = group.refs.map((ref) => priceChoiceItem(ctx, ref, items, linkStage)).join(" / ");
    return `<p><strong>${ctx.esc(area)}</strong> · ${refs}</p>`;
  }
  function priceChoiceItem(ctx, ref, items, stage) {
    const item = items.find(
      (candidate) => candidate.category === ref.category && candidate.id === ref.id
    );
    if (!item) return "";
    const [page, query] = ctx.detailItemLink(item).split("?");
    const params = new URLSearchParams(query);
    params.set("stage", String(stage));
    return `<a href="${ctx.esc(`${page}?${params}`)}">${ctx.esc(ctx.imageName(item))} (${ctx.esc(item.id)}) · ¥${ctx.esc(ref.priceYen)} ↗</a>`;
  }
  function baitLurePriceChoices(ctx, item, items) {
    const rows = Object.entries(item.baitLureDecision?.cheaperByStage || {});
    if (!rows.length) return "";
    const groups = priceChoiceGroups(rows);
    return `<aside class="detail-section" data-bait-lure-prices><h3>${priceChoiceTitle(ctx)}</h3>${groups.map((group) => priceChoiceGroup(ctx, group, items)).join("")}</aside>`;
  }
  function mushroomAlternativeLabel(ctx) {
    if (ctx.lang === "th") return "ดูส้ม: ฟื้น 5 HP ราคา ¥5 พร้อมร้านที่ขาย";
    if (ctx.lang === "ja") return "みかんを見る：5HP回復・5円、販売場所付き";
    return "See oranges: restore 5 HP for ¥5, with shops";
  }
  function mushroomAlternative(ctx, item) {
    if (item.category !== "food" || !["09", "0A"].includes(item.id)) return "";
    const query = new URLSearchParams({ category: "food", id: "01" });
    if (ctx.selectedStage) query.set("stage", String(ctx.selectedStage));
    query.set("return", ctx.currentLocalRoute());
    return `<p><a class="route-button" data-mushroom-alternative href="${ctx.localePage[ctx.lang]}?${query}">${ctx.esc(mushroomAlternativeLabel(ctx))} ↗</a></p>`;
  }
  function acquisitionChoiceTitle(ctx, item) {
    if (item.playerUse?.shops?.length) {
      if (ctx.lang === "th") return "รับจากหีบก่อนซื้อซ้ำ";
      if (ctx.lang === "ja") return "重複購入の前に宝箱から入手";
      return "Check the chest before buying another copy";
    }
    if (ctx.lang === "th") return "รับไอเท็มนี้จากหีบ";
    if (ctx.lang === "ja") return "この道具を宝箱から入手";
    return "Get this item from a chest";
  }
  function acquisitionChoiceEntry(ctx, loc) {
    const area = ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area";
    return `<p><strong>${area} ${ctx.esc(loc.stage)}</strong> · ${ctx.esc(ctx.local(loc.name))}</p><p>${ctx.esc(ctx.local(loc.action))}</p>`;
  }
  function acquisitionChoice(ctx, item) {
    const entries = item.acquisitionOptions || [];
    if (!entries.length) return "";
    const open = ctx.lang === "th" ? "ดูจุดรับของและทางเข้าเมือง" : ctx.lang === "ja" ? "入手地点と町の入口を見る" : "See the reward location and town entrance";
    return `<aside class="detail-section acquisition-choice" data-acquisition-choice><h2>${ctx.esc(acquisitionChoiceTitle(ctx, item))}</h2>${entries.map((loc) => acquisitionChoiceEntry(ctx, loc)).join("")}<a class="route-button" href="#use-locations">${open} ↓</a></aside>`;
  }
  function moreOptionsPanel(ctx, options) {
    const content = options.filter(Boolean).join("");
    if (!content) return "";
    const title = ctx.lang === "th" ? "ตัวเลือกเพิ่มเติมและรายละเอียดเฉพาะทาง" : ctx.lang === "ja" ? "追加の選択肢・個別情報" : "More options and item-specific details";
    return `<details class="more-options"><summary>${ctx.esc(title)}</summary><div class="detail-content">${content}</div></details>`;
  }

  // src/pages/item/fly-menu-position.js
  var mayfly = {
    en: {
      title: "Find this component in the game menu",
      scope: "Area 1 · choose Mayfly (メイフライ) at the fly maker",
      start: "Each part starts at the top-left cursor.",
      right: (n) => `Right ${n} time${n === 1 ? "" : "s"}`,
      down: (n) => `Down ${n} time${n === 1 ? "" : "s"}`,
      confirm: "A to select",
      position: (r, c) => `Row ${r}, column ${c}`,
      caption: "Original game frame: the cursor marks this choice. Tap to enlarge.",
      noneTail: "To omit the tail, start at top-left: Right 2 → Down 1 → A (無し).",
      evidence: "Evidence and limits",
      limit: "Verified in this Area 1 Mayfly menu only. Position identifies the component; it does not establish a bite or landing advantage. Check the final quote before paying.",
      notes: "Read the menu-position research"
    },
    ja: {
      title: "ゲームのメニューでこの部品を選ぶ",
      scope: "エリア1 · 毛バリ作成で「メイフライ」を選択",
      start: "各部品の初期カーソルは左上です。",
      right: (n) => `右${n}回`,
      down: (n) => `下${n}回`,
      confirm: "Aで決定",
      position: (r, c) => `${r}行目・${c}列目`,
      caption: "ゲームの元画像。カーソルがこの選択肢を示します。タップで拡大。",
      noneTail: "テールを付けない場合：左上から右に2回、下に1回移動し、「無し」でAを押します。",
      evidence: "根拠と確認範囲",
      limit: "エリア1のメイフライ画面で確認した位置です。部品の識別であり、食いつきや取り込み効果の証明ではありません。支払い前に見積額を確認してください。",
      notes: "メニュー位置の調査を読む"
    },
    th: {
      title: "เลือกชิ้นนี้ตรงไหนในเมนูเกม?",
      scope: "ร้านด่าน 1 · เลือกเมย์ฟลาย (メイフライ) ตอนประกอบฟลาย",
      start: "แต่ละเมนูเริ่มจากเคอร์เซอร์ซ้ายบน",
      right: (n) => `ขวา ${n} ครั้ง`,
      down: (n) => `ลง ${n} ครั้ง`,
      confirm: "กด A เลือก",
      position: (r, c) => `แถว ${r} · คอลัมน์ ${c}`,
      caption: "ภาพเกมจริง เคอร์เซอร์ชี้ตัวเลือกนี้ แตะรูปเพื่อขยาย",
      noneTail: "ถ้าไม่ใส่หาง ให้เริ่มจากซ้ายบน: กดขวา 2 ครั้ง → ลง 1 ครั้ง → A ที่ “ไม่มี” (無し)",
      evidence: "หลักฐานและขอบเขต",
      limit: "ยืนยันตำแหน่งเฉพาะเมนูเมย์ฟลายในร้านด่าน 1 ตำแหน่งบอกว่าชิ้นไหน ไม่ได้พิสูจน์ว่าปลากินหรือตกขึ้นง่ายกว่า ตรวจราคาสุทธิก่อนจ่าย",
      notes: "อ่านการวิจัยตำแหน่งเมนู"
    }
  };
  var otherFamilies = {
    en: {
      family: {
        カディス: "Caddis",
        テレストリアル: "Terrestrial",
        ディプテラ: "Diptera",
        ストーンフライ: "Stonefly"
      },
      scope: (area, family, familyJa) => `Area ${area} · choose ${family} (${familyJa}) at the fly maker`,
      none: (part, instructions) => `To choose None for the ${part}, start at top-left: ${instructions} (無し).`,
      directQuote: "After selecting this Terrestrial body, the game skips wing and tail selection and opens the quote.",
      limit: (area, family) => `Verified only in this Area ${area} ${family} menu. Position identifies the component; it does not establish a bite or landing advantage. Check the final quote before paying.`,
      controlledScope: (family, familyJa) => `When the maker offers ${family} (${familyJa}), choose that family first.`,
      controlledLimit: "These positions were independently replayed in a controlled even-area menu fixture. This verifies the palette, not the walking route or natural shop access. No bite or landing advantage is established; check the final quote before paying."
    },
    ja: {
      family: {
        カディス: "カディス",
        テレストリアル: "テレストリアル",
        ディプテラ: "ディプテラ",
        ストーンフライ: "ストーンフライ"
      },
      scope: (area, family) => `エリア${area} · 「${family}」のフライを作成`,
      none: (part, instructions) => `「${part}」で「無し」を選ぶ場合：左上から${instructions}`,
      directQuote: "このテレストリアル・ボディを選ぶと、ウィングとテールの選択画面を飛ばして見積額へ進みます。",
      limit: (area, family) => `確認したのはエリア${area}の${family}メニューだけです。位置は部品の識別であり、食いつきや取り込み効果を示しません。支払前に見積額を確認してください。`,
      controlledScope: (family) => `作成メニューに「${family}」がある場合、まずその系統を選びます。`,
      controlledLimit: "偶数エリアのメニューを再現した制御条件で、部品位置を独立に再確認しました。通常プレイでの店への経路や利用可能時期の証明ではありません。釣果の優位も未確認です。支払前に見積額を確認してください。"
    },
    th: {
      family: {
        カディス: "แคดดิส",
        テレストリアル: "เทอเรสเทรียล",
        ディプテラ: "ดิพเทรา",
        ストーンフライ: "สโตนฟลาย"
      },
      scope: (area, family, familyJa) => `ร้านด่าน ${area} · เลือก${family} (${familyJa}) ตอนประกอบฟลาย`,
      none: (part, instructions) => `ถ้าจะเลือก “ไม่มี” (無し) ในเมนู${part} ให้เริ่มจากซ้ายบน: ${instructions}`,
      directQuote: "หลังเลือกบอดี้เทอเรสเทรียลนี้ เกมข้ามเมนูปีกและหาง แล้วไปหน้าเสนอราคาเลย",
      limit: (area, family) => `ยืนยันตำแหน่งเฉพาะเมนู${family}ในร้านด่าน ${area} ตำแหน่งบอกว่าชิ้นไหน ไม่ได้พิสูจน์ว่าปลากินหรือตกขึ้นง่ายกว่า ตรวจราคาสุทธิก่อนจ่าย`,
      controlledScope: (family, familyJa) => `เมื่อร้านมีตัวเลือก${family} (${familyJa}) ให้เลือกตระกูลนี้ก่อน`,
      controlledLimit: "ตรวจตำแหน่งซ้ำอย่างอิสระจากเมนูด่านเลขคู่ที่จำลองในสภาวะควบคุม ยืนยันช่องเลือกชิ้นส่วน แต่ยังไม่ได้ยืนยันเส้นทางเดินหรือการเข้าร้านจากการเล่นปกติ ไม่ได้พิสูจน์ว่าปลากินหรือตกขึ้นง่ายกว่า ตรวจราคาสุทธิก่อนจ่าย"
    }
  };
  function instructionsFor(copy2, row, column) {
    return [column > 1 ? copy2.right(column - 1) : "", row > 1 ? copy2.down(row - 1) : "", copy2.confirm].filter(Boolean).join(" → ");
  }
  function otherFamilyCopy(lang, choice) {
    const copy2 = otherFamilies[lang] || otherFamilies.en;
    const family = copy2.family[choice.familyJa] || choice.familyJa;
    const area = choice.area || 1;
    return {
      ...mayfly[lang],
      scope: choice.controlledFixture ? copy2.controlledScope(family, choice.familyJa) : copy2.scope(area, family, choice.familyJa),
      limit: choice.controlledFixture ? copy2.controlledLimit : copy2.limit(area, family),
      none: copy2.none,
      directQuote: copy2.directQuote
    };
  }
  function nonePositionInstructions(copy2, choice, lang) {
    const row = choice.nonePosition?.row;
    const column = choice.nonePosition?.column;
    if (!row || !column) return "";
    const movement = [
      column > 1 ? copy2.right(column - 1) : "",
      row > 1 ? copy2.down(row - 1) : "",
      copy2.confirm
    ].filter(Boolean).join(" → ");
    const part = choice.part === "wing" ? { en: "wing", ja: "ウィング", th: "ปีก" } : { en: "tail", ja: "テール", th: "หาง" };
    return copy2.none(part[lang], movement);
  }
  function flyMenuPosition(ctx, item) {
    const choice = item.flyMakerMenuChoice;
    if (!choice) return "";
    const lang = ctx.lang in mayfly ? ctx.lang : "en";
    const isMayfly = !choice.familyJa || choice.familyJa === "メイフライ";
    const copy2 = isMayfly ? mayfly[lang] : otherFamilyCopy(lang, choice);
    const instructions = instructionsFor(copy2, choice.row, choice.column);
    const position = copy2.position(choice.row, choice.column);
    const noneInstructions = isMayfly && choice.part === "tail" ? `<p class="fly-menu-none-tail">${ctx.esc(copy2.noneTail)}</p>` : choice.nonePosition ? `<p class="fly-menu-none-tail">${ctx.esc(nonePositionInstructions(copy2, choice, lang))}</p>` : "";
    const nextStep = choice.nextStep === "quote" ? `<p class="fly-menu-next-step rod-verdict">${ctx.esc(copy2.directQuote)}</p>` : "";
    return `<section id="fly-menu-position" class="detail-section fly-menu-position" data-fly-menu-position="${ctx.esc(item.category)}:${ctx.esc(item.id)}"><h2>${ctx.esc(copy2.title)}</h2><p>${ctx.esc(copy2.scope)}</p><p><strong>${ctx.esc(position)}</strong> · ${ctx.esc(copy2.start)}</p><p class="rod-verdict">${ctx.esc(instructions)}</p>${noneInstructions}${nextStep}<figure><a href="${ctx.esc(choice.image)}" target="_blank" rel="noopener"><img src="${ctx.esc(choice.image)}" alt="${ctx.esc(position)}" width="256" height="224" loading="lazy"></a><figcaption>${ctx.esc(copy2.caption)}</figcaption></figure><details><summary>${ctx.esc(copy2.evidence)}</summary><p>${ctx.esc(copy2.limit)}</p><a href="${ctx.esc(choice.evidenceHref)}">${ctx.esc(copy2.notes)} ↗</a></details></section>`;
  }

  // src/pages/item/bait-acquisition.js
  var copy = {
    th: {
      title: "หาเหยื่อ 0D ในเมืองแทนการหาร้านขาย",
      body: "ถ้ามีแว่นขยาย 03: เข้าเมืองทางเข้าลำดับที่ 2 ซึ่งพามา X7,Y29 หยุดเดินแล้วใช้แว่นขยายบนช่องที่ต่างจากช่องที่ใช้แว่นขยายครั้งก่อน กองเหยื่อเดิมต้องยังไม่เต็ม 9 หรือมีช่องเหยื่อว่าง ได้ 1–4 ชิ้นตามพื้นที่ว่างในกอง สูงสุด 9 ชิ้น ขยับช่องก่อนค้นซ้ำ",
      limit: "เมืองด่าน 6 ทดลองใช้สำเร็จ อีกห้าเมืองอ้างจากเงื่อนไขตำแหน่งเดียวกันใน ROM ไม่ใช่เส้นทางที่เดินทดลองครบทุกเมือง",
      town: "ดูทางเข้าเมืองลำดับที่ 2",
      tool: "ดูไอเท็มแว่นขยาย 03"
    },
    en: {
      title: "Gather bait 0D in town instead of looking for a shop",
      body: "If you own magnifier 03, enter through the second recorded town entrance (arrival X7,Y29), stop and use it on a tile different from the last magnifier-use tile. Keep room in the existing stack or a free bait slot: the draw is 1–4 pieces, limited by remaining room in a stack capped at 9. Move to another tile before searching again.",
      limit: "Direct use succeeded in Area 6 town. The other five towns follow the same ROM position check; their walking routes were not all replayed.",
      town: "Show the second town entrance",
      tool: "View magnifier 03"
    },
    ja: {
      title: "エサ0Dは店を探す代わりに町で採る",
      body: "虫めがね03を持っているなら、町の2番目の入口（到着X7,Y29）から入り、前回虫めがねを使ったタイルとは別のタイルで立ち止まって使う。エサ欄に空きを残す。1–4個を得るが、所持上限9までの空き数で制限される。再探索の前に別のタイルへ移動する。",
      limit: "エリア6の町で使用成功を確認。他の5町は同じROM位置条件に基づく。全ての町の歩行経路を再現したわけではない。",
      town: "町の2番目の入口を見る",
      tool: "虫めがね03を見る"
    }
  };
  function townPasteBaitAction(ctx, item) {
    if (item.category !== "bait" || item.id !== "0D") return "";
    const text3 = copy[ctx.lang] || copy.en;
    const stage = String(ctx.selectedStage || 1);
    const suffix = ctx.lang === "en" ? "" : `.${ctx.lang}`;
    const query = new URLSearchParams({ stage, place: "town", entrance: "1" });
    if (ctx.selectedFish) query.set("fish", ctx.selectedFish);
    if (ctx.selectedRoute) query.set("route", ctx.selectedRoute);
    query.set("return", ctx.currentLocalRoute());
    const town = `shops${suffix}.html?${query}#town-arrival-1`;
    const tool = ctx.detailItemLink({ category: "general_tool", id: "03" });
    return `<aside class="detail-section" data-town-paste-bait><h2>${ctx.esc(text3.title)}</h2><p>${ctx.esc(text3.body)}</p><p class="muted">${ctx.esc(text3.limit)}</p><a class="route-button" data-paste-town href="${ctx.esc(town)}">${ctx.esc(text3.town)} ↗</a><a class="route-button" href="${ctx.esc(tool)}">${ctx.esc(text3.tool)} ↗</a></aside>`;
  }

  // src/pages/item/notebook.js
  var text = {
    th: [
      "เก็บสมุดให้ครบ 66 ชนิด",
      "ตกปลาขึ้นและผ่านข้อความผลให้จบ แล้วเปิดสมุดเช็กก่อนติ๊กบนเว็บ สมุดเก็บหนึ่งรายการต่อชนิดปลา ด่านในสมุดคือด่านที่ทำสถิติขนาดใหญ่ที่สุด ตกชนิดเดิมที่ขนาดเท่าเดิมหรือเล็กกว่าจะไม่เพิ่มรายการใหม่",
      "ดูรายชื่อที่ควรเก็บเพิ่มในแต่ละด่าน"
    ],
    en: [
      "Complete all 66 notebook species",
      "Land the fish and finish the result messages, then check the notebook before ticking the website checklist. The notebook keeps one entry per species. Its area is where the largest-size record was set; an equal or smaller duplicate does not add another entry.",
      "See new collection targets in each area"
    ],
    ja: [
      "釣りノート66種をそろえる",
      "魚を取り込み、結果メッセージを進めてからノートを確認し、ウェブのチェックを付けます。魚種ごとに1件だけ記録します。表示エリアは最大サイズの記録を作った場所です。同じサイズ以下の同種では別の項目は増えません。",
      "エリア別の未重複収集ルートを見る"
    ]
  };
  function notebookAction(ctx, item) {
    if (item.category !== "general_tool" || item.id !== "05") return "";
    const c = text[ctx.lang];
    const query = new URLSearchParams({
      stage: String(ctx.selectedStage || 1),
      return: ctx.currentLocalRoute()
    });
    const href = `maps${ctx.lang === "en" ? "" : `.${ctx.lang}`}.html?${query}#notebook-guide`;
    return `<aside class="detail-section" data-notebook-action><h2>${ctx.esc(c[0])}</h2><p>${ctx.esc(c[1])}</p><a class="route-button" href="${ctx.esc(href)}">${ctx.esc(c[2])} ↗</a></aside>`;
  }

  // src/pages/item/postcard-next-action.js
  var EEL_ID = "3B";
  function postcardCopy(lang) {
    return {
      th: {
        title: "เมื่ออ่านแล้วพบจดหมายจากหมอให้ตกปลาไหลใหญ่",
        body: "ถ้าพบข้อความนี้แล้ว ใช้แม่เหล็กในด่าน 6 ดูทิศทาง หรือเปิดจุดบนแผนที่ด้านล่าง เลือกเหยื่อและอุปกรณ์จากหน้าปลาไหลใหญ่ก่อนออกไปตก",
        limit: "จุดนี้มาจากตารางเกม บางรอบอาจไม่มีปลา ยังไม่ได้พิสูจน์ว่าตกได้แล้วต้องส่งให้ใครหรือรับรางวัลอย่างไร",
        fish: "ดูเหยื่อและอุปกรณ์สำหรับปลาไหลใหญ่",
        map: "ดูจุดด่าน 6 · X 41, Y 8"
      },
      ja: {
        title: "医者から大ウナギを釣る依頼が届いたら",
        body: "この依頼を見たら、エリア6で磁石のオオウナギ項目を使うか、下の地図で地点を確認。釣りに行く前に魚のページで対応エサと道具を選んでください。",
        limit: "地点はROMの出現表に基づき、生成状態によって魚がいない場合があります。釣った後の渡す相手や報酬は未検証です。",
        fish: "オオウナギの対応エサと道具を見る",
        map: "エリア6の地点 · X 41, Y 8"
      },
      en: {
        title: "After reading the doctor’s request for a giant eel",
        body: "Once this request appears, use its Area 6 Magnet heading or open the map point below. Choose compatible bait and equipment from the fish profile before fishing.",
        limit: "This is a configured ROM spawn point and can be inactive. Who to give the landed eel to, or what reward follows, is not yet verified.",
        fish: "See giant eel bait and equipment",
        map: "Area 6 point · X 41, Y 8"
      }
    }[lang];
  }
  function eelMapHref(ctx) {
    const query = new URLSearchParams({ stage: "6", fish: EEL_ID, section: "s6-c2-r1" });
    const returned = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returned) query.set("return", returned);
    return `${ctx.mapsPage[ctx.lang]}?${query}#map-view`;
  }
  function postcardNextAction(ctx, item, fishLocations) {
    if (item?.category !== "general_tool" || item.id !== "06") return "";
    const record = fishLocations[EEL_ID]?.locations?.find((entry) => Number(entry.stage) === 6);
    if (!record?.points?.some((point) => point.x === 41 && point.y === 8)) return "";
    const text3 = postcardCopy(ctx.lang);
    const profile = ctx.fishProfileLink(EEL_ID, fishLocations);
    return `<aside class="detail-section quest-next-action" data-quest-next-action="postcard-eel"><h3>${ctx.esc(text3.title)}</h3><p>${ctx.esc(text3.body)}</p><p><a class="route-button" data-quest-fish-profile href="${ctx.esc(profile)}">${ctx.esc(text3.fish)} ↗</a> <a class="route-button" data-quest-fish-map href="${ctx.esc(eelMapHref(ctx))}">${ctx.esc(text3.map)} ↗</a></p><p>${ctx.esc(text3.limit)}</p></aside>`;
  }

  // src/pages/item/quest-next-actions.js
  var AKAME_ID = "37";
  var FIREWORKS_ID = "16";
  function akameName(lang) {
    return { th: "อาคาเมะ", ja: "アカメ", en: "Akame" }[lang];
  }
  function isQuestItem(item, id) {
    return item?.category === "general_tool" && item.id === id;
  }
  function safeReturn(ctx) {
    return ctx.safeLocalRoute(ctx.currentLocalRoute());
  }
  function mapsHref(ctx, point) {
    const column = Math.floor((point.x * 16 + 8) / 384) + 1;
    const row = Math.floor((point.y * 16 + 8) / 384) + 1;
    const query = new URLSearchParams({
      stage: "6",
      fish: AKAME_ID,
      section: `s6-c${column}-r${row}`
    });
    const returned = safeReturn(ctx);
    if (returned) query.set("return", returned);
    return `${ctx.mapsPage[ctx.lang]}?${query}`;
  }
  function shopHref(ctx) {
    const query = new URLSearchParams({
      stage: "4",
      place: "town",
      category: "general_tool",
      id: FIREWORKS_ID
    });
    const returned = safeReturn(ctx);
    if (returned) query.set("return", returned);
    return `shops${ctx.lang === "en" ? "" : `.${ctx.lang}`}.html?${query}`;
  }
  function candleAction(ctx, item, fishLocations) {
    if (!isQuestItem(item, "12")) return "";
    const record = fishLocations[AKAME_ID]?.locations?.find((entry) => Number(entry.stage) === 6);
    const point = record?.points?.find((entry) => entry.x === 37 && entry.y === 29);
    if (!point) return "";
    const text3 = {
      th: {
        title: "ต่อจากเบาะแสหลังส่งเทียน · ตัวละครเซฟ 1",
        body: `บทพูดชี้ไปทางตะวันตกเฉียงเหนือ แต่ไม่ได้ระบุช่องตกปลาแน่นอน ตารางจุดเกิดปลาใน ROM แยกต่างหากระบุ${akameName(ctx.lang)}ไว้ที่ด่าน 6 พิกัด X ${point.x}, Y ${point.y} หนึ่งจุด; บางรอบจุดนี้อาจไม่ทำงาน`,
        profile: "ดูข้อมูลอาคาเมะ",
        map: "เปิดแผนที่ด่าน 6 ที่จุดนี้"
      },
      ja: {
        title: "ロウソクの後の手掛かり · セーブキャラクター1",
        body: `台詞は北西を示しますが、釣りタイルまでは示しません。別に解析したROMの出現表では${akameName(ctx.lang)}の地点がエリア6のX ${point.x}, Y ${point.y}に1か所あります。生成状態によってこの枠が無効な場合があります。`,
        profile: "アカメの情報を見る",
        map: "エリア6のこの地点を地図で見る"
      },
      en: {
        title: "Follow the candle clue · saved character 1",
        body: `The dialogue points northwest but does not name a fishing tile. The separately decoded ROM spawn table places ${akameName(ctx.lang)} at Area 6, X ${point.x}, Y ${point.y}; this one configured slot can be inactive in some generated states.`,
        profile: "Open the Akame profile",
        map: "Open this Area 6 map point"
      }
    }[ctx.lang];
    const profile = ctx.fishProfileLink(AKAME_ID, fishLocations);
    return `<aside class="detail-section quest-next-action" data-quest-next-action="candle-akame"><h3>${ctx.esc(text3.title)}</h3><p>${ctx.esc(text3.body)}</p><p><a class="route-button" data-quest-fish-profile href="${ctx.esc(profile)}">${ctx.esc(text3.profile)} ↗</a> <a class="route-button" data-quest-fish-map href="${ctx.esc(mapsHref(ctx, point))}">${ctx.esc(text3.map)} ↗</a></p></aside>`;
  }
  function fireworksAction(ctx, item) {
    if (!isQuestItem(item, FIREWORKS_ID)) return "";
    const text3 = {
      th: {
        title: "ใช้ดอกไม้ไฟผิดจุดแล้วต้องหาอีก?",
        body: "ตรวจเมนูร้านในเมืองด่าน 4: ตารางร้านใน ROM ระบุดอกไม้ไฟราคา ¥50 แต่ยังยืนยันไม่ได้ว่าซื้อซ้ำได้ไม่จำกัด",
        shop: "เปิดร้านด่าน 4 เพื่อตรวจรายการขาย"
      },
      ja: {
        title: "花火を別の場所で使い、もう1つ必要？",
        body: "エリア4の町の店を確認してください。ROMの店在庫表には花火が50円で記録されていますが、無制限に買い直せるかは未確認です。",
        shop: "エリア4の店の販売品を確認"
      },
      en: {
        title: "Used fireworks at the wrong spot and need another?",
        body: "Check the Area 4 town shop menu: the ROM stock table lists fireworks at ¥50, but unlimited repeat purchases are not verified.",
        shop: "Check the Area 4 shop listing"
      }
    }[ctx.lang];
    return `<aside class="detail-section quest-next-action" data-quest-next-action="fireworks-recovery"><h3>${ctx.esc(text3.title)}</h3><p>${ctx.esc(text3.body)}</p><p><a class="route-button" data-quest-fireworks-shop href="${ctx.esc(shopHref(ctx))}">${ctx.esc(text3.shop)} ↗</a></p></aside>`;
  }
  function questNextActions(ctx, item, fishLocations) {
    return [
      postcardNextAction(ctx, item, fishLocations),
      candleAction(ctx, item, fishLocations),
      fireworksAction(ctx, item)
    ].filter(Boolean).join("");
  }

  // src/shared/lib/target-advice.js
  function acceptedFor(item, fish, route) {
    const use = item.playerUse || {};
    const ids = item.category === "bait" ? use.fishIdsByRoute?.[route] || [] : use.fishIds || [];
    return ids.includes(fish);
  }
  function offerAt(item, stage) {
    const use = item.playerUse || {};
    const offer = use.shops?.find((entry) => Number(entry.stage) === stage);
    if (!offer) return null;
    return {
      category: item.category,
      id: item.id,
      priceYen: Number(offer.priceYen ?? item.priceYen),
      available: true,
      conditional: Boolean(offer.condition),
      condition: offer.condition || ""
    };
  }
  function localOffers(ctx, item, fish, route, stage) {
    if (!stage) return [];
    return ctx.allItems.filter(
      (candidate) => candidate.category === item.category && acceptedFor(candidate, fish, route)
    ).map((candidate) => offerAt(candidate, stage)).filter((offer) => offer && Number.isFinite(offer.priceYen)).sort((a, b) => a.priceYen - b.priceYen || a.id.localeCompare(b.id));
  }
  function cheapestTies(offers) {
    const eligible = offers.filter((offer) => !offer.conditional);
    if (!eligible.length) return [];
    const minimum = eligible[0].priceYen;
    return eligible.filter((offer) => offer.priceYen === minimum);
  }
  function conditionalTies(offers) {
    const eligible = offers.filter((offer) => offer.conditional);
    if (!eligible.length) return [];
    const minimum = eligible[0].priceYen;
    return eligible.filter((offer) => offer.priceYen === minimum);
  }
  function selectAlternatives(offers, current, currentStock) {
    const otherOffers = offers.filter((offer) => offer.id !== current.id);
    const candidates = currentStock ? otherOffers.filter((offer) => offer.priceYen < currentStock.priceYen) : otherOffers;
    return [...cheapestTies(candidates), ...conditionalTies(candidates)].sort(
      (a, b) => a.priceYen - b.priceYen || Number(a.conditional) - Number(b.conditional) || a.id.localeCompare(b.id)
    );
  }
  function targetAdvice(ctx, item, fish) {
    if (!fish || !["bait", "lure"].includes(item.category)) return null;
    const route = item.category === "bait" ? ctx.baitRoute || "float" : "lure";
    if (!acceptedFor(item, fish, route)) return null;
    const parsedStage = Number(ctx.locationStage);
    const stage = Number.isInteger(parsedStage) && parsedStage >= 1 && parsedStage <= 6 ? parsedStage : null;
    const currentOffer = stage ? offerAt(item, stage) : null;
    const currentStock = stage ? currentOffer || { available: false } : null;
    const localOptions = localOffers(ctx, item, fish, route, stage);
    const alternatives = stage ? selectAlternatives(localOptions, item, currentStock?.available ? currentStock : null) : [];
    return {
      fish,
      route,
      stage,
      compatible: true,
      currentStock,
      localOptions,
      cheapestUnconditional: cheapestTies(localOptions),
      alternatives
    };
  }
  function routeName(ctx, route) {
    if (route === "lure")
      return ctx.lang === "ja" ? "ルアー" : ctx.lang === "th" ? "สายลัวร์" : "lure";
    if (ctx.lang === "th") return route === "float" ? "ชุดทุ่น" : "ชุดตะกั่ว";
    if (ctx.lang === "ja") return route === "float" ? "ウキ仕掛け" : "オモリ仕掛け";
    return route === "float" ? "float rig" : "sinker rig";
  }
  function compatibilityText(ctx, fish, route) {
    if (route === "lure")
      return text2(ctx, {
        th: `ผ่านเงื่อนไขลัวร์สำหรับ${fish}`,
        ja: `${fish}のルアー判定に適合`,
        en: `Passes the lure check for ${fish}`
      });
    return text2(ctx, {
      th: `ผ่านเงื่อนไขเหยื่อสำหรับ${fish} · ${routeName(ctx, route)}`,
      ja: `${fish}のエサ判定に適合 · ${routeName(ctx, route)}`,
      en: `Passes the bait check for ${fish} · ${routeName(ctx, route)}`
    });
  }
  function text2(ctx, values) {
    return values[ctx.lang] || values.en;
  }
  function conditionText(ctx, condition) {
    if (!condition.includes("sell at least one Ayu")) return condition;
    if (ctx.lang === "th") return "ต้องขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนซื้อ";
    if (ctx.lang === "ja") return "びくのアユを1匹以上売ってから購入";
    return "requires selling at least one Ayu from your keepnet first";
  }
  function alternativeLink(ctx, offer) {
    const candidate = ctx.allItems.find(
      (entry) => entry.category === offer.category && entry.id === offer.id
    );
    if (!candidate) return "";
    const condition = offer.conditional ? `<small>${ctx.esc(conditionText(ctx, offer.condition))}</small>` : "";
    return `<li data-target-alternative="${ctx.esc(offer.category + ":" + offer.id)}"><a href="${ctx.esc(ctx.itemHref(candidate))}">${ctx.esc(ctx.itemName(candidate))} (${ctx.esc(offer.id)}) · ¥${offer.priceYen}</a>${condition}</li>`;
  }
  function alternativeList(ctx, advice) {
    if (!advice.alternatives.length) return "";
    const heading = advice.currentStock?.available ? text2(ctx, {
      th: "ตัวเลือกที่ถูกกว่าซึ่งผ่านเงื่อนไขปลาและมีขายในด่านนี้",
      ja: "この魚の判定を通り、エリア内で買える安い候補",
      en: "Cheaper local offers that pass this fish check"
    }) : text2(ctx, {
      th: "ตัวเลือกที่มีขายในด่านนี้และผ่านเงื่อนไขปลา",
      ja: "エリア内で販売され、この魚の判定を通る候補",
      en: "Local offers that pass this fish check"
    });
    return `<p>${ctx.esc(heading)}</p><ul>${advice.alternatives.map((offer) => alternativeLink(ctx, offer)).join("")}</ul>`;
  }
  function noAreaDecision(ctx) {
    return text2(ctx, {
      th: "มีของชิ้นนี้อยู่แล้วใช้ต่อได้ เลือกด่านจากแผนที่เพื่อดูว่ามีขายอะไรและราคาเท่าไร",
      ja: "所持していれば使用できます。地図でエリアを選ぶと、店頭在庫と価格を確認できます。",
      en: "Use it if you already own it. Choose an area on the map to check local stock and prices."
    });
  }
  function absentStockDecision(ctx, advice) {
    if (advice.alternatives.length)
      return text2(ctx, {
        th: "ถ้ามีชิ้นนี้อยู่แล้วใช้ต่อได้ ชิ้นนี้ไม่มีรายการขายในด่านนี้; ถ้าจะซื้อใหม่ ให้เลือกตัวเลือกด้านล่าง",
        ja: "所持していればそのまま使えます。この品はエリア内の在庫記録がありません。新しく買うなら下記の候補を選べます。",
        en: "Keep using it if owned. This item has no recorded stock in this area; for a new purchase, choose a compatible offer below."
      });
    return text2(ctx, {
      th: "ชิ้นนี้ไม่มีรายการขายในด่านนี้; ถ้ามีอยู่แล้วใช้ต่อได้ หรือดูร้านในด่านอื่น",
      ja: "この品はエリア内の在庫記録がありません。所持品は使えます。別エリアの店を確認してください。",
      en: "This item has no recorded stock in this area. Use it if owned, or check another area’s shops."
    });
  }
  function conditionalStockDecision(ctx, stage, stock) {
    return text2(ctx, {
      th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen} แต่${conditionText(ctx, stock.condition)}`,
      ja: `エリア${stage}で${stock.priceYen}円で販売。ただし${conditionText(ctx, stock.condition)}`,
      en: `Stocked in area ${stage} for ¥${stock.priceYen}, but ${conditionText(ctx, stock.condition)}.`
    });
  }
  function cheapestStockDecision(ctx, stage, stock) {
    return text2(ctx, {
      th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen}; ถ้าจะซื้อ ชิ้นนี้เป็นหนึ่งในตัวเลือกที่ถูกที่สุดซึ่งผ่านเงื่อนไขปลาในสต็อกที่ตรวจได้`,
      ja: `エリア${stage}で${stock.priceYen}円。このエリアで確認できた魚判定を通る在庫品の最安候補の一つです。`,
      en: `Stocked in area ${stage} for ¥${stock.priceYen}; it is one of the cheapest recorded local offers passing this fish check.`
    });
  }
  function compareStockDecision(ctx, stage, stock) {
    return text2(ctx, {
      th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen}; ถ้ามีอยู่แล้วใช้ต่อได้ ถ้าจะซื้อให้ดูตัวเลือกที่ถูกกว่าด้านล่าง`,
      ja: `エリア${stage}で${stock.priceYen}円。所持品はそのまま使えます。購入するなら下記の安い候補を確認してください。`,
      en: `Stocked in area ${stage} for ¥${stock.priceYen}. Keep using it if owned; compare the cheaper offers below before buying.`
    });
  }
  function shopDecision(ctx, advice) {
    if (!advice.stage) return noAreaDecision(ctx);
    const stock = advice.currentStock;
    if (!stock?.available) return absentStockDecision(ctx, advice);
    if (stock.conditional) return conditionalStockDecision(ctx, advice.stage, stock);
    const isCheapest = advice.cheapestUnconditional.some(
      (offer) => offer.id === advice.currentStock.id
    );
    return isCheapest ? cheapestStockDecision(ctx, advice.stage, stock) : compareStockDecision(ctx, advice.stage, stock);
  }
  function renderTargetAdvice(ctx, item, fish) {
    const advice = targetAdvice(ctx, item, fish);
    if (!advice) return "";
    const fishName2 = ctx.fishName(fish);
    const status = compatibilityText(ctx, fishName2, advice.route);
    const limit = text2(ctx, {
      th: "ยืนยันเฉพาะว่าเข้าเงื่อนไขตรวจเหยื่อ ไม่ได้ยืนยันโอกาสกินเหยื่อหรือจับขึ้น",
      ja: "エサの判定を通ることのみ確認。食いつき率・取り込みは示しません。",
      en: "This confirms the bait check only; it does not establish bite odds or landing success."
    });
    const markers = `data-target-advice data-target-fish="${ctx.esc(fish)}" data-target-route="${advice.route}" data-target-stage="${advice.stage || ""}"`;
    return `<div class="target-advice" ${markers}><p class="target-compatibility"><strong>${ctx.esc(status)}</strong></p><p>${ctx.esc(shopDecision(ctx, advice))}</p>${alternativeList(ctx, advice)}<small>${ctx.esc(limit)}</small></div>`;
  }

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/pages/item/fly-target-advice.js
  function local(ctx, values) {
    return values[ctx.lang] || values.en;
  }
  function bodyDecision(ctx, item, fish) {
    const accepted = (item.playerUse?.fishIds || []).includes(ctx.selectedFish);
    return local(ctx, {
      th: accepted ? `บอดี้นี้ผ่านเงื่อนไขโปรไฟล์ของ${fish} ใช้เป็นตัวเลือกประกอบฟลายได้ แต่ยังต้องให้ปลาเจอเหยื่อและดึงขึ้นสำเร็จ` : `บอดี้นี้ไม่ผ่านเงื่อนไขโปรไฟล์ของ${fish} เลือกบอดี้ที่ใช้กับปลานี้ได้จากชุดเริ่มต้นด้านล่าง`,
      ja: accepted ? `このボディは${fish}のプロフィール判定を通ります。自作候補にできますが、魚との接触と取り込みも必要です。` : `このボディは${fish}のプロフィール判定を通りません。下の開始用セットから適合するボディを選んでください。`,
      en: accepted ? `This body passes the profile check for ${fish}. It is a custom-fly candidate; contact with the fish and successful landing still matter.` : `This body does not pass the profile check for ${fish}. Choose a compatible body from the starter sets below.`
    });
  }
  function partDecision(ctx, fish) {
    return local(ctx, {
      th: `จะตก${fish} ให้เลือกบอดี้ตามปลาก่อน ปีกหรือหางชิ้นนี้อย่างเดียวไม่ได้ยืนยันว่าใช้ตกปลานี้ได้ ถ้าจะเริ่มตกทันที ให้ดูชุดฟลายสำเร็จรูปที่ผ่านเงื่อนไขบอดี้จากปุ่มด้านล่าง`,
      ja: `${fish}を狙うなら、先に魚に合うボディを選びます。このウィング・テール単体では適合を確認できません。すぐ始めるなら、下のボタンからボディ判定を通る完成セットを確認してください。`,
      en: `For ${fish}, choose the body first. This wing or tail alone does not establish fish compatibility. To start fishing, use the button below to find ready-made sets whose bodies pass the check.`
    });
  }
  function noFlyDecision(ctx, fish) {
    return local(ctx, {
      th: `ยังไม่มีบอดี้ฟลายที่ผ่านเงื่อนไขโปรไฟล์ของ${fish}ในข้อมูลที่ถอดได้ อย่าซื้อชุดฟลายเพื่อปลานี้จากคำแนะนำนี้ เปิดหน้าปลาเพื่อดูวิธีตกอื่นที่ยืนยันแล้ว`,
      ja: `${fish}の判定を通るフライボディは解析データにありません。この案内からフライを購入せず、魚ページで確認済みの別の釣法を見てください。`,
      en: `No decoded fly body passes the profile check for ${fish}. Do not buy a fly set for this target from this advice. Open the fish page for other verified methods.`
    });
  }
  function flyTargetAdvice(ctx, item, fishVisuals, fishLocations, allItems) {
    if (!ctx.selectedFish || !["fly", "fly_wing", "fly_tail"].includes(item.category)) return "";
    if (!fishVisuals[ctx.selectedFish]) return "";
    const fish = ctx.fishName(ctx.selectedFish, fishVisuals);
    const available = allItems.some(
      (entry) => entry.category === "fly" && (entry.playerUse?.fishIds || []).includes(ctx.selectedFish)
    );
    const decision = !available ? noFlyDecision(ctx, fish) : item.category === "fly" ? bodyDecision(ctx, item, fish) : partDecision(ctx, fish);
    const label = local(ctx, {
      th: `เลือกชุดฟลายเริ่มต้นสำหรับ${fish}`,
      ja: `${fish}の開始用フライセットを選ぶ`,
      en: `Choose a starter fly set for ${fish}`
    });
    const action = available ? label : local(ctx, {
      th: `ดูวิธีตกอื่นสำหรับ${fish}`,
      ja: `${fish}の別の釣法を見る`,
      en: `See other methods for ${fish}`
    });
    const href = ctx.fishProfileLink(ctx.selectedFish, fishLocations) + (available ? "#starter-fly" : "");
    return `<div data-fly-target-advice="${ctx.esc(ctx.selectedFish)}"><p>${ctx.esc(decision)}</p><a class="route-button" data-fly-starter-link href="${ctx.esc(href)}">${ctx.esc(action)} ↗</a></div>`;
  }

  // src/pages/item/target-advice.js
  function targetAdviceSection(ctx, item, allItems, fishVisuals, fishLocations) {
    const fly = flyTargetAdvice(ctx, item, fishVisuals, fishLocations, allItems);
    if (fly) return fly;
    const adapter = {
      lang: ctx.lang,
      esc: ctx.esc,
      allItems,
      baitRoute: ctx.selectedRoute || "float",
      locationStage: ctx.selectedStage,
      itemName: ctx.imageName,
      fishName: (id) => ctx.fishName(id, fishVisuals),
      itemHref: ctx.detailItemLink
    };
    return renderTargetAdvice(adapter, item, ctx.selectedFish);
  }

  // src/pages/item/render.js
  function renderFishTarget(ctx, fishVisuals, fishLocations) {
    if (!ctx.selectedFish) return "";
    const fish = fishVisuals[ctx.selectedFish];
    const name = ctx.fishName(ctx.selectedFish, fishVisuals);
    const profile = ctx.fishProfileLink(ctx.selectedFish, fishLocations);
    const mapStage = fishLocations[ctx.selectedFish]?.locations?.some(
      (location2) => Number(location2.stage) === ctx.selectedStage
    ) ? ctx.selectedStage : fishLocations[ctx.selectedFish]?.locations?.[0]?.stage;
    const image = fish?.image ? `<a href="${ctx.esc(profile)}" aria-label="${ctx.esc(ctx.copy.fishProfile)}"><img class="detail-target-fish" src="${ctx.esc(fish.image)}" alt="${ctx.esc(name)}"></a>` : "";
    const map = mapStage ? ` <a class="route-button" href="${ctx.esc(ctx.mapLink(mapStage, ctx.selectedFish))}">${ctx.esc(ctx.copy.mapFish)}</a>` : "";
    return `<aside class="detail-section play-target"><strong>${ctx.esc(ctx.copy.target)} · ${ctx.esc(name)} (${ctx.esc(ctx.selectedFish)})</strong>${image}<p><a class="route-button" href="${ctx.esc(profile)}">${ctx.esc(ctx.copy.fishProfile)}</a>${map}</p></aside>`;
  }
  function selectedBaitRoute(ctx, item) {
    const routes = item.playerUse?.fishIdsByRoute || {};
    if (item.category !== "bait" || !ctx.selectedFish || !ctx.selectedRoute || !Object.hasOwn(routes, ctx.selectedRoute))
      return null;
    return ctx.selectedRoute;
  }
  function renderBaitTarget(ctx, item, fishVisuals, fishLocations) {
    const routes = item.playerUse?.fishIdsByRoute || {};
    const route = selectedBaitRoute(ctx, item);
    if (!route) return "";
    const accepted = (routes[route] || []).includes(ctx.selectedFish);
    const alternate = route === "float" ? "sinker" : "float";
    const switchRoute = !accepted && (routes[alternate] || []).includes(ctx.selectedFish);
    const query = new URLSearchParams(location.search);
    query.set("route", alternate);
    const routeCopy = route === "float" ? ctx.copy.routeFloat : ctx.copy.routeSinker;
    const name = ctx.fishName(ctx.selectedFish, fishVisuals);
    const status = accepted ? ctx.lang === "th" ? "เหยื่อนี้ผ่านเงื่อนไขของปลาที่เลือกด้วยชุดนี้ ถ้ามีอยู่แล้วใช้ต่อได้" : ctx.lang === "ja" ? "この仕掛けでは選択した魚のエサ判定を通る。持っているならそのまま使える。" : "This bait passes the selected fish’s check with this rig. Keep using it if you have it." : ctx.lang === "th" ? "เหยื่อนี้ไม่ผ่านเงื่อนไขของปลาที่เลือกด้วยชุดนี้ อย่าซื้อเพื่อใช้กับชุดนี้" : ctx.lang === "ja" ? "この仕掛けでは選択した魚のエサ判定を通らない。この目的で購入しない。" : "This bait does not pass the selected fish’s check with this rig. Do not buy it for this setup.";
    const switchText = ctx.lang === "th" ? `เหยื่อเดิมใช้กับปลานี้ได้เมื่อเปลี่ยนเป็น${alternate === "float" ? "ชุดทุ่น" : "ชุดตะกั่ว"}` : ctx.lang === "ja" ? `同じエサを使うなら${alternate === "float" ? "ウキ" : "オモリ"}仕掛けへ` : `Use this bait by switching to the ${alternate === "float" ? "float" : "sinker"} rig`;
    const switchLink = switchRoute ? `<a class="route-button" data-switch-bait-route href="${ctx.esc(ctx.localePage[ctx.lang] + "?" + query)}">${ctx.esc(switchText)} ↗</a>` : "";
    const profileLink = !accepted ? ` <a class="route-button" href="${ctx.esc(ctx.fishProfileLink(ctx.selectedFish, fishLocations))}">${ctx.esc(ctx.copy.fishProfile)}</a>` : "";
    return `<section class="detail-section bait-target-action" data-bait-target-action="${accepted ? "accepted" : "rejected"}"><h2>${ctx.esc(routeCopy)} · ${ctx.esc(name)}</h2><p>${ctx.esc(status)}</p>${switchLink}${profileLink}</section>`;
  }
  function renderItemHero(ctx, item, name, categoryText) {
    const image = `<a class="detail-portrait-link" href="${ctx.esc(item.frame || item.image)}" target="_blank" rel="noopener" aria-label="${ctx.esc(ctx.copy.openFrame)}"><img class="detail-portrait" src="${ctx.esc(item.image)}" alt="${ctx.esc(name)}" fetchpriority="high"></a>`;
    const japanese = item.nameJa && ctx.lang !== "ja" ? `<p class="muted" lang="ja">${ctx.esc(item.nameJa)}</p>` : "";
    const identity = `<div class="detail-identity"><p class="detail-kicker">${ctx.esc(categoryText)}</p><h1>${ctx.esc(name)}</h1>${japanese}<div class="detail-badges"><span class="detail-badge id">${ctx.esc(ctx.copy.itemId)} ${ctx.esc(item.id)}</span></div></div>`;
    return `<section class="detail-hero item-hero">${image}${identity}</section>`;
  }
  function rodDecisionTitle(ctx, item) {
    if (item.category === "rod") {
      if (ctx.lang === "th") return "ควรเลือกคันนี้เมื่อไร?";
      if (ctx.lang === "ja") return "この竿を選ぶときは？";
      return "When should I choose this rod?";
    }
    if (ctx.lang === "th") return "ควรซื้อหรือใช้ชิ้นนี้เมื่อไร?";
    if (ctx.lang === "ja") return "この道具を買う・使うときは？";
    return "When should I buy or use this?";
  }
  function decisionReasonTitle(ctx, hasDecision) {
    if (!hasDecision) return ctx.copy.details;
    if (ctx.lang === "th") return "เหตุผลที่เลือกหรือใช้ต่อ";
    if (ctx.lang === "ja") return "選ぶ・使い続ける理由";
    return "Why choose or keep it";
  }
  function decisionFacts(ctx, item, allItems) {
    const decision = item.rodDecision || item.gearDecision || item.baitLureDecision;
    const alternatives = decision?.alternatives || [];
    const items = alternatives.map((ref) => allItems.find((item2) => item2.category === ref.category && item2.id === ref.id)).filter(Boolean);
    return items.length ? `<div class="detail-grid rod-alternatives">${items.map((item2) => ctx.componentLink(item2)).join("")}</div>` : "";
  }
  function flyWingDetailHrefs(ctx, item, decision, allItems, fishLocations) {
    const bodyId = decision.bundle?.body || "01";
    const body = allItems.find((candidate) => candidate.category === "fly" && candidate.id === bodyId);
    const verifiedWing = allItems.filter(
      (candidate) => candidate.category === "fly_wing" && candidate.id !== item.id && candidate.flyMakerMenuChoice
    ).sort((a, b) => a.id.localeCompare(b.id))[0];
    const query = new URLSearchParams({
      stage: String(decision.bundle?.stage || 6),
      place: "town",
      category: item.category,
      id: item.id
    });
    if (ctx.selectedFish) query.set("fish", ctx.selectedFish);
    if (ctx.selectedRoute) query.set("route", ctx.selectedRoute);
    const returned = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returned) query.set("return", returned);
    return {
      shop: `${ctx.localePage[ctx.lang].replace("item", "shops")}?${query}`,
      body: body ? ctx.detailItemLink(body) : "",
      fish: ctx.selectedFish ? ctx.fishProfileLink(ctx.selectedFish, fishLocations) : "",
      starter: body && !decision.bundle ? ctx.detailItemLink(body) : "",
      alternative: verifiedWing ? `${ctx.detailItemLink(verifiedWing)}#fly-menu-position` : ""
    };
  }
  function decisionSectionActions(ctx, item, wingDecision, allItems, fishVisuals, fishLocations) {
    if (!wingDecision)
      return ctx.gearNextActions(item, fishVisuals, fishLocations, allItems) + ctx.flyMakerLink(item);
    const hrefs = flyWingDetailHrefs(ctx, item, wingDecision, allItems, fishLocations);
    return flyWingPlayerLinks(ctx, wingDecision, hrefs);
  }
  function decisionSectionSupport(ctx, item, decision, wingDecision, targetAdvice2, general, factList, allItems) {
    const isFly = ["fly", "fly_wing", "fly_tail"].includes(item.category);
    const reasons = (targetAdvice2 && !isFly ? general : "") + factList + (wingDecision ? "" : decisionFacts(ctx, item, allItems));
    if (!decision || !reasons) return reasons;
    return `<details class="decision-reasons"><summary>${ctx.esc(decisionReasonTitle(ctx, true))}</summary>${reasons}</details>`;
  }
  function decisionSectionCopy(ctx, item, decision, wingDecision, facts) {
    const factList = facts.length ? `<h3>${ctx.esc(decisionReasonTitle(ctx, Boolean(decision)))}</h3><ul>${facts.map((fact) => `<li>${ctx.esc(fact)}</li>`).join("")}</ul>` : "";
    const verdict = wingDecision ? `<p class="rod-verdict" data-fly-wing-verdict="${ctx.esc(item.id)}">${ctx.esc(wingDecision.label)}</p>` : decision ? `<p class="rod-verdict">${ctx.esc(ctx.local(decision.label))}</p>` : "";
    const key = item.rodDecision ? "data-rod-decision" : item.baitLureDecision ? "data-bait-lure-decision" : "data-gear-decision";
    const marker = decision ? `${key}="${ctx.esc(item.id)}"` : "";
    return {
      factList,
      verdict,
      marker,
      heading: decision ? rodDecisionTitle(ctx, item) : ctx.copy.use
    };
  }
  function renderDecisionSection(ctx, item, summary, facts, imageNote, data) {
    const { allItems, fishVisuals, fishLocations } = data;
    const decision = item.rodDecision || item.gearDecision || item.baitLureDecision;
    const fishId = ctx.selectedFish || "";
    const wingDecision = flyWingPlayerDecision(
      ctx.lang,
      item,
      allItems,
      fishId,
      fishId ? ctx.fishName(fishId, fishVisuals) : ""
    );
    const {
      factList,
      verdict,
      marker: dataAttribute,
      heading
    } = decisionSectionCopy(ctx, item, decision, wingDecision, facts);
    const body = summary || ctx.copy.noFish;
    const targetAdvice2 = wingDecision ? "" : targetAdviceSection(ctx, item, allItems, fishVisuals, fishLocations);
    const general = `${verdict}<p>${ctx.esc(body)}</p>`;
    const actions = decisionSectionActions(
      ctx,
      item,
      wingDecision,
      allItems,
      fishVisuals,
      fishLocations
    );
    const note = imageNote ? `<p class="muted">${ctx.esc(imageNote)}</p>` : "";
    const supporting = decisionSectionSupport(
      ctx,
      item,
      decision,
      wingDecision,
      targetAdvice2,
      general,
      factList,
      allItems
    );
    return `<section id="what-to-do" class="decision-panel ${decision ? "rod-decision" : ""}" ${dataAttribute}><h2>${ctx.esc(heading)}</h2>${targetAdvice2 || general}${supporting}${actions}${note}</section>`;
  }
  function renderQuickOptions(ctx, item, allItems, fishLocations) {
    const options = [
      notebookAction(ctx, item),
      townPasteBaitAction(ctx, item),
      questNextActions(ctx, item, fishLocations),
      ctx.boatBoardingChoice(item),
      ctx.acquisitionChoice(item),
      ctx.baitGatherChoice(item),
      ctx.forageBaitChoice(item, allItems),
      ctx.mushroomAlternative(item)
    ].filter(Boolean);
    return options.length ? `<div class="decision-support-grid">${options.join("")}</div>` : "";
  }
  function renderMoreOptions(ctx, item, allItems, fishLocations) {
    return ctx.moreOptionsPanel([
      ctx.baitLurePriceChoices(item, allItems),
      ctx.compassUseChoice(item),
      ctx.gatheredBaitChoices(item, allItems),
      ctx.keepnetAlternatives(item, allItems),
      ctx.daikonFishChoice(item, fishLocations)
    ]);
  }
  function renderItemSections(ctx, item, allItems, fishVisuals, fishLocations, decisions) {
    const usage = ctx.visibleUsage(item, allItems, fishVisuals);
    const summary = usage.summary || ctx.local(item.playerUse?.summary) || "";
    const facts = usage.facts || [];
    const name = ctx.imageName(item);
    const categoryText = ctx.categoryLabel(item);
    const categoryHref = ctx.currentCategoryLink();
    const intro = `<nav class="detail-breadcrumb" aria-label="${ctx.esc(ctx.copy.category)}"><a href="${ctx.esc(categoryHref)}">${ctx.esc(ctx.copy.allItems)}</a><span aria-hidden="true">/</span><span>${ctx.esc(categoryText)}</span></nav>`;
    const hero = renderItemHero(ctx, item, name, categoryText);
    const target = renderFishTarget(ctx, fishVisuals, fishLocations);
    const baitTarget = renderBaitTarget(ctx, item, fishVisuals, fishLocations);
    const note = item[`imageNote${ctx.lang === "th" ? "Th" : ctx.lang === "ja" ? "Ja" : "En"}`] || "";
    const action = renderDecisionSection(ctx, item, summary, facts, note, {
      allItems,
      fishVisuals,
      fishLocations
    });
    const extras = renderQuickOptions(ctx, item, allItems, fishLocations);
    const rodAdvice = item.rodDecision || item.gearDecision || item.baitLureDecision;
    const buying = rodAdvice ? "" : ctx.buyingDecision(item, allItems, decisions);
    const more = renderMoreOptions(ctx, item, allItems, fishLocations);
    const back = `<p class="detail-back-to-list"><a class="route-button" href="${ctx.esc(categoryHref)}">${ctx.esc(ctx.copy.allItems)} · ${ctx.esc(categoryText)} ↗</a></p>`;
    return `${intro}${hero}${target}${baitTarget}${action}${flyMenuPosition(ctx, item)}${extras}${buying}${ctx.shopSection(item, allItems, fishLocations)}${ctx.useLocationSection(item, fishLocations, allItems)}${ctx.fishSection(item, fishVisuals, fishLocations)}${more}${back}${ctx.technicalSection(item)}<p class="muted">${ctx.esc(ctx.copy.sourced)}</p>`;
  }
  function scrollToItemAnchor() {
    if (location.hash === "#fly-menu-position")
      document.getElementById("fly-menu-position")?.scrollIntoView({ block: "start" });
    if (location.hash.startsWith("#compass-exit-"))
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
    if (location.hash.startsWith("#forage-stage-"))
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
    if (location.hash === "#use-locations")
      document.getElementById("use-locations")?.scrollIntoView({ block: "start" });
  }
  function render(ctx, item, allItems, fishVisuals, fishLocations, decisions) {
    ctx.setNavigation();
    ctx.$("detail-root").innerHTML = renderItemSections(
      ctx,
      item,
      allItems,
      fishVisuals,
      fishLocations,
      decisions
    );
    scrollToItemAnchor();
    const name = ctx.imageName(item);
    const category = ctx.categoryLabel(item);
    const game = ctx.lang === "th" ? "ตกปลาทาโร่ 2" : ctx.lang === "ja" ? "川のぬし釣り2" : "Kawa no Nushi Tsuri 2";
    document.title = `${name} · ${category} · ${game}`;
  }
  function emptyState(ctx) {
    ctx.setNavigation();
    ctx.$("detail-root").innerHTML = `<section class="empty-state"><h1>${ctx.esc(ctx.copy.invalidTitle)}</h1><p>${ctx.esc(ctx.copy.invalidBody)}</p><a class="route-button" href="${ctx.esc(ctx.fallbackBack())}">${ctx.esc(ctx.copy.allItems)} ↗</a></section>`;
  }

  // src/pages/item/load-catalogue.js
  function loadCatalogue(ctx) {
    ctx.flyMakerLink = (item) => item.category.startsWith("fly") ? `<p><a class="route-button" data-fly-maker href="${ctx.esc(ctx.currentCategoryLink().split("#")[0] + "#fly-instructions")}">${ctx.lang === "th" ? "ดูขั้นตอนประกอบฟลายเองและตรวจราคาในเกม" : ctx.lang === "ja" ? "自作フライの手順とゲーム内見積額を確認" : "See custom fly steps and check the in-game quote"} ↗</a></p>` : "";
    ctx.setNavigation();
    fetch("gallery-data.json?v=compendium-20261005-32").then((response) => {
      if (!response.ok) throw new Error("catalogue data unavailable");
      return response.json();
    }).then((data) => {
      if (ctx.selectedFish && !data.fishVisuals?.[ctx.selectedFish]) ctx.selectedFish = "";
      const item = (data.items || []).find(
        (candidate) => candidate.category === ctx.category && candidate.id === ctx.requestedId
      ) || null;
      if (!item) {
        ctx.emptyState();
        return;
      }
      ctx.render(
        item,
        data.items || [],
        data.fishVisuals || {},
        data.fishLocations || {},
        data.playerDecisions?.sections || []
      );
    }).catch((error) => {
      console.error("Item detail failed to load or render.", error);
      ctx.emptyState();
    });
  }

  // src/pages/item/copy_en.js
  var copy_en = {
    allItems: "Browse all items",
    back: "← Back to where you came from",
    invalidTitle: "Item not found",
    invalidBody: "This item link is incomplete or its ID is not in the catalogue.",
    category: "Category",
    itemId: "Item ID",
    use: "What it does",
    details: "Practical notes",
    shop: "Where to get it",
    shopArea: (n) => `Area ${n}`,
    price: (n) => `¥${n}`,
    priceFromRom: "ROM price field",
    stockAt: "Recorded stock in the areas listed below",
    bundleAt: (n) => `Ready-made fly sold in area ${n}`,
    noShop: "No shop stock for this item is recorded in the current ROM data.",
    shopMap: "Find this shop",
    mapNote: "Open the shop page to see the town entrance, seller location, and recorded stock. Outdoor and town maps are shown separately.",
    unlock: "How to unlock this offer:",
    ayuOffer: "Sell at least one Ayu from your keepnet to make decoy Ayu appear in the Area 3 shop. Buying it sets the stack to 9 and subtracts 9 from the sold-Ayu counter (down to 0). If it disappears, sell more Ayu before trying again.",
    unknownShopCondition: "This shop offer has an additional purchase condition that has not been explained yet.",
    noShopMap: "The ROM data does not record a stage for this item’s use or sale.",
    fish: "Fish that pass this item’s recorded check",
    fishScope: "Passing this item check does not guarantee a bite or a landed fish.",
    routeFloat: "Float rig",
    routeSinker: "Sinker rig",
    floatFishHeading: "Fish in the float-rig list",
    floatFishSummary: "See fish for the float rig",
    floatTargetYes: "This profile is in the float-rig list. Float models add no fish-specific check; choose a bait this fish accepts.",
    floatTargetNo: "This profile is not in the recorded float-rig list.",
    floatFishScope: "Float IDs 01–08 use the same rig check; the model adds no fish-specific bonus or restriction. The list does not guarantee a bite or landed fish.",
    sinkerFishHeading: "Fish that pass the extra sinker-rig profile check",
    sinkerFishSummary: "See fish for the sinker rig",
    sinkerTargetYes: "This profile is in the list that passes the sinker rig’s extra check. The selected bait must also pass for this fish.",
    sinkerTargetNo: "This profile is not in the recorded sinker-rig pass list.",
    sinkerFishScope: "Sinker IDs 09–0A share the same extra sinker-rig profile check. This list does not establish that a bait will be eaten or a fish landed.",
    acceptedBaits: "See bait this fish accepts and other methods",
    fishProfile: "Open fish profile ↗",
    mapFish: "Open this fish on the map ↗",
    noFish: "No fish-specific compatibility list is established for this item.",
    target: "Your selected fish",
    targetYes: "This fish is in the item’s recorded compatible list.",
    targetNo: "This fish is not in this item’s recorded compatible list.",
    targetUnknown: "This item has no recorded fish compatibility list.",
    assembly: "Shop bundle parts",
    completePrice: "Complete set",
    component: "Open item details ↗",
    usedIn: "Recorded ready-made sets that include this part",
    useLocations: "Where to obtain or use it",
    area: (n) => `Area ${n}`,
    noUse: "No separate use location is recorded for this item.",
    moreOptions: "More comparisons and ways to get it",
    showMatches: "See fish that pass this check",
    tech: "ROM and evidence details",
    source: "Research source",
    raw: "Raw record",
    offset: "File offset",
    bytes: "ROM record bytes",
    fields: "Decoded fields",
    itemPrice: "Price field in ROM",
    targets: "Special response conditions",
    evidenceNotes: "Technical notes",
    openFrame: "Open uncropped source image ↗",
    sourced: "Names and practical notes are based on the ROM research in this project.",
    routeReturn: "Back to the item page",
    stageWord: "area"
  };

  // src/pages/item/copy_th.js
  var copy_th = {
    allItems: "ดูรายการไอเท็มทั้งหมด",
    back: "← กลับหน้าที่เข้ามา",
    invalidTitle: "ไม่พบไอเท็ม",
    invalidBody: "ลิงก์นี้ไม่มีรหัสไอเท็มหรือรหัสไม่อยู่ในแค็ตตาล็อก",
    category: "หมวด",
    itemId: "รหัสไอเท็ม",
    use: "ไอเท็มนี้ใช้ทำอะไร",
    details: "วิธีใช้และข้อควรรู้",
    shop: "หาซื้อได้ที่ไหน",
    shopArea: (n) => `ด่าน ${n}`,
    price: (n) => `${n} เยน`,
    priceFromRom: "ช่องราคาใน ROM",
    stockAt: "พบรายการขายในด่านที่แสดงด้านล่าง",
    bundleAt: (n) => `ชุดฟลายสำเร็จรูปที่ร้านด่าน ${n}`,
    noShop: "ไม่พบข้อมูลว่ามีร้านขายไอเท็มชิ้นนี้ใน ROM ที่ตรวจ",
    shopMap: "ดูร้านที่ขายของนี้",
    mapNote: "เปิดหน้าร้านเพื่อดูทางเข้าเมือง ตำแหน่งคนขาย และรายการสินค้า โดยแยกแผนที่กลางแจ้งกับในเมือง",
    unlock: "วิธีปลดล็อกรายการนี้:",
    ayuOffer: "ขายปลาอายุจากข้องอย่างน้อย 1 ตัว เพื่อให้เหยื่อล่อปลาอายุปรากฏในร้านด่าน 3 เมื่อซื้อ จำนวนในช่องจะเต็มเป็น 9 ชิ้น และตัวนับปลาอายุที่ขายจะลดลง 9 (ต่ำสุด 0) ถ้าเหยื่อหายจากรายการ ให้ขายปลาอายุเพิ่มก่อนลองซื้ออีกครั้ง",
    unknownShopCondition: "รายการนี้มีเงื่อนไขซื้อเพิ่มเติมที่ยังถอดความหมายไม่ได้",
    noShopMap: "ข้อมูล ROM ยังไม่ระบุด่านที่ใช้หรือขายไอเท็มนี้",
    fish: "ปลาที่ผ่านเงื่อนไขของไอเท็มชิ้นนี้",
    fishScope: "การผ่านเงื่อนไขนี้ไม่ได้รับประกันว่าปลาจะกินเหยื่อหรือตกขึ้นมาได้",
    routeFloat: "ชุดทุ่น",
    routeSinker: "ชุดตะกั่ว",
    floatFishHeading: "รายชื่อปลาสำหรับชุดทุ่น",
    floatFishSummary: "ดูรายชื่อปลาสำหรับชุดทุ่น",
    floatTargetYes: "ปลานี้อยู่ในรายชื่อสำหรับชุดทุ่น แต่รุ่นทุ่นไม่ได้เพิ่มเงื่อนไขปลาเฉพาะ ต้องเลือกเหยื่อที่ปลารับได้ด้วย",
    floatTargetNo: "ปลานี้ไม่อยู่ในรายชื่อที่ตรวจพบสำหรับชุดทุ่น",
    floatFishScope: "ทุ่น ID 01–08 ไม่ได้ตรวจปลาแยกตามรุ่น และไม่มีหลักฐานว่าเพิ่มโบนัสหรือข้อจำกัดเฉพาะปลา รายชื่อนี้ไม่รับประกันว่าปลาจะกินเหยื่อหรือตกขึ้นได้",
    sinkerFishHeading: "ปลาในรายชื่อที่ผ่านเงื่อนไขเพิ่มของชุดตะกั่ว",
    sinkerFishSummary: "ดูรายชื่อปลาสำหรับชุดตะกั่ว",
    sinkerTargetYes: "ปลานี้อยู่ในรายชื่อที่ผ่านเงื่อนไขเพิ่มของชุดตะกั่ว เหยื่อที่เลือกยังต้องผ่านเงื่อนไขของปลานี้ด้วย",
    sinkerTargetNo: "ปลานี้ไม่ผ่านเงื่อนไขเพิ่มของชุดตะกั่วที่ตรวจพบ",
    sinkerFishScope: "ตะกั่ว ID 09–0A ใช้เงื่อนไขปลาเพิ่มเติมชุดเดียวกัน รายชื่อนี้ยังไม่ยืนยันว่าเหยื่อจะถูกกินหรือจะตกปลาขึ้นได้",
    acceptedBaits: "ดูเหยื่อที่ปลานี้รับและวิธีตกอื่น",
    fishProfile: "เปิดหน้าข้อมูลปลานี้ ↗",
    mapFish: "เปิดแผนที่พร้อมเลือกปลานี้ ↗",
    noFish: "ยังไม่มีรายชื่อความเข้ากันได้กับปลาเฉพาะสำหรับไอเท็มนี้",
    target: "ปลาที่คุณเลือก",
    targetYes: "ปลานี้อยู่ในรายชื่อที่ไอเท็มชิ้นนี้ผ่านเงื่อนไข",
    targetNo: "ปลานี้ไม่อยู่ในรายชื่อที่ไอเท็มชิ้นนี้ผ่านเงื่อนไข",
    targetUnknown: "ไอเท็มนี้ไม่มีรายชื่อความเข้ากันได้กับปลาที่บันทึกไว้",
    assembly: "ชิ้นส่วนในชุดที่ร้านขาย",
    completePrice: "ราคาทั้งชุด",
    component: "เปิดรายละเอียดไอเท็ม ↗",
    usedIn: "ชุดสำเร็จรูปที่มีชิ้นส่วนนี้",
    useLocations: "จุดรับและใช้งานไอเท็ม",
    area: (n) => `ด่าน ${n}`,
    noUse: "ไม่มีการบันทึกตำแหน่งใช้งานแยกสำหรับไอเท็มนี้",
    moreOptions: "ตัวเลือกและวิธีรับเพิ่มเติม",
    showMatches: "ดูรายชื่อปลาที่ผ่านเงื่อนไขนี้",
    tech: "รายละเอียด ROM และหลักฐาน",
    source: "เอกสารวิจัย",
    raw: "ข้อมูลดิบของรายการ",
    offset: "ตำแหน่งในไฟล์",
    bytes: "ไบต์ของรายการใน ROM",
    fields: "ฟิลด์ที่ถอดความหมายแล้ว",
    itemPrice: "ช่องราคาใน ROM",
    targets: "เงื่อนไขตอบสนองเฉพาะ",
    evidenceNotes: "บันทึกเชิงเทคนิค",
    openFrame: "เปิดภาพต้นฉบับเต็ม ↗",
    sourced: "ชื่อและวิธีใช้สรุปจากงานแกะ ROM ในโครงการนี้",
    routeReturn: "กลับหน้ารายละเอียดไอเท็ม",
    stageWord: "ด่าน"
  };

  // src/pages/item/copy_ja.js
  var copy_ja = {
    allItems: "道具一覧を見る",
    back: "← 前のページへ戻る",
    invalidTitle: "道具が見つかりません",
    invalidBody: "道具IDがないか、カタログに登録されていません。",
    category: "カテゴリ",
    itemId: "道具ID",
    use: "この道具の使い方",
    details: "使い方と注意点",
    shop: "入手場所",
    shopArea: (n) => `エリア${n}`,
    price: (n) => `${n}円`,
    priceFromRom: "ROM内の価格欄",
    stockAt: "下記エリアの在庫記録",
    bundleAt: (n) => `エリア${n}の店売り毛バリセット`,
    noShop: "現在のROMデータでは、この道具の店頭在庫を確認できません。",
    shopMap: "販売店を見る",
    mapNote: "店のページで町への入口、店員の位置、在庫を確認できます。屋外と町内のマップは別々に表示します。",
    unlock: "この品を買えるようにするには：",
    ayuOffer: "びくからアユを1匹以上売ると、おとりアユがエリア3の店に表示されます。購入すると所持数が9個になり、売却アユ数のカウンターが9減ります（0未満にはなりません）。表示から消えたら、追加でアユを売ってください。",
    unknownShopCondition: "この商品には追加の購入条件がありますが、内容はまだ確認できていません。",
    noShopMap: "ROMデータに使用・販売エリアの記録がありません。",
    fish: "この道具の判定を通る魚",
    fishScope: "この判定を通っても、食いつきや取り込みは保証されません。",
    routeFloat: "ウキ仕掛け",
    routeSinker: "オモリ仕掛け",
    floatFishHeading: "ウキ釣りの魚プロフィール一覧",
    floatFishSummary: "ウキ釣りの魚を見る",
    floatTargetYes: "この魚はウキ釣りの一覧に含まれる。ウキ型ごとの魚判定はないため、この魚が受け付けるエサを選ぶ。",
    floatTargetNo: "この魚は記録されたウキ釣りの一覧に含まれない。",
    floatFishScope: "ウキID 01–08は同じウキ釣り判定を使い、型ごとの魚ボーナスや制限はない。一覧は食いつきや釣り上げを保証しない。",
    sinkerFishHeading: "オモリ釣りの追加プロフィール判定を通る魚",
    sinkerFishSummary: "オモリ釣りの魚を見る",
    sinkerTargetYes: "この魚はオモリ釣りの追加判定を通る一覧に含まれる。選んだエサもこの魚の条件を通る必要がある。",
    sinkerTargetNo: "この魚は記録されたオモリ釣りの通過一覧に含まれない。",
    sinkerFishScope: "オモリID 09–0Aは同じ追加プロフィール判定を使う。この一覧は食いつきや釣り上げを保証しない。",
    acceptedBaits: "この魚が受け付けるエサと他の釣り方を見る",
    fishProfile: "魚の詳細を開く ↗",
    mapFish: "この魚をマップで見る ↗",
    noFish: "この道具の魚別適合リストは確認されていません。",
    target: "選択中の魚",
    targetYes: "この魚は道具の適合リストに含まれています。",
    targetNo: "この魚は道具の適合リストに含まれていません。",
    targetUnknown: "この道具には魚別の適合リストがありません。",
    assembly: "店売りセットの構成品",
    completePrice: "セット価格",
    component: "道具の詳細を開く ↗",
    usedIn: "この部品を含む店売りセット",
    useLocations: "入手・使用場所",
    area: (n) => `エリア${n}`,
    noUse: "この道具の個別の使用場所は記録されていません。",
    moreOptions: "比較と別の入手方法",
    showMatches: "この判定を通る魚を見る",
    tech: "ROMと根拠の詳細",
    source: "研究資料",
    raw: "ROMレコード",
    offset: "ファイル位置",
    bytes: "ROMレコードのバイト",
    fields: "解析済みフィールド",
    itemPrice: "ROM内の価格欄",
    targets: "魚別応答条件",
    evidenceNotes: "技術メモ",
    openFrame: "切り抜き前の画像を開く ↗",
    sourced: "名称と実用情報は、このプロジェクトで行ったROM解析に基づきます。",
    routeReturn: "道具の詳細に戻る",
    stageWord: "エリア"
  };

  // src/pages/item/setup-context.js
  function setupContext(ctx) {
    ctx.lang = ["th", "ja"].includes(document.documentElement.dataset.locale) ? document.documentElement.dataset.locale : "en";
    ctx.localePage = { en: "item.html", th: "item.th.html", ja: "item.ja.html" };
    ctx.cataloguePage = { en: "index.html", th: "index.th.html", ja: "index.ja.html" };
    ctx.mapsPage = { en: "maps.html", th: "maps.th.html", ja: "maps.ja.html" };
    ctx.copy = { en: copy_en, th: copy_th, ja: copy_ja }[ctx.lang];
    ctx.$ = (id) => document.getElementById(id);
    ctx.esc = (value) => String(value ?? "").replace(
      /[&<>"']/g,
      (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
    );
    ctx.local = (value) => typeof value === "string" ? value : value?.[ctx.lang] || value?.en || value?.ja || value?.th || "";
    ctx.params = new URLSearchParams(location.search);
    ctx.category = ctx.params.get("category") || "";
    ctx.normalizeId = (value) => {
      const raw = String(value || "").trim();
      if (!/^(?:0x)?[0-9a-f]{1,2}$/i.test(raw)) return "";
      return Number.parseInt(raw.replace(/^0x/i, ""), 16).toString(16).toUpperCase().padStart(2, "0");
    };
    ctx.requestedId = ctx.normalizeId(ctx.params.get("id"));
    ctx.selectedFish = ctx.normalizeId(ctx.params.get("fish"));
    ctx.selectedStage = /^[1-6]$/.test(ctx.params.get("stage") || "") ? Number(ctx.params.get("stage")) : 0;
    ctx.selectedRoute = ["float", "sinker"].includes(ctx.params.get("route")) ? ctx.params.get("route") : "";
    ctx.baseDir = location.pathname.slice(0, location.pathname.lastIndexOf("/") + 1);
    ctx.routeFiles = {
      catalogue: /^\/(?:[^/]+\/)?catalogue\/(?:index(?:\.th|\.ja)?|maps(?:\.th|\.ja)?|fish(?:\.th|\.ja)?|item(?:\.th|\.ja)?|shops(?:\.th|\.ja)?)\.html$/,
      research: /^\/(?:[^/]+\/)?research\/index(?:\.th|\.ja)?\.html$/
    };
  }

  // src/pages/item/index.js
  function initialize(ctx) {
    setupContext(ctx);
    loadCatalogue(ctx);
  }

  // src/app/item.js
  var runtimeContext = createPageRuntime(item_exports);
  initialize(runtimeContext);
})();
