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
    loadErrorState: () => loadErrorState,
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
    if (["index", "maps", "fish", "item", "shops", "quests"].includes(root)) {
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
    if (retainsFishingTarget(ctx) && ctx.selectedRoute) p.set("route", ctx.selectedRoute);
    const returnRoute = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returnRoute) p.set("return", returnRoute);
    return `${ctx.mapsPage[ctx.lang]}?${p}`;
  }
  function fishProfileLink(ctx, id, fishLocations) {
    const locations = fishLocations[id]?.locations || [];
    const location2 = locations.find((loc) => Number(loc.stage) === ctx.selectedStage) || locations[0];
    const p = new URLSearchParams({ id });
    if (retainsFishingTarget(ctx) && ctx.selectedRoute) p.set("route", ctx.selectedRoute);
    if (location2?.stage) p.set("stage", String(location2.stage));
    const returnRoute = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returnRoute) p.set("return", returnRoute);
    return `fish${ctx.lang === "en" ? "" : `.${ctx.lang}`}.html?${p}`;
  }

  // src/entities/fish/eel-ending-route.js
  var eelEndingEntrance = Object.freeze({ stage: 1, x: 12, y: 189 });

  // src/entities/fish/index.js
  function nameKey(value) {
    return String(value || "").normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
  }
  function distinctFishNames(names, headline = "") {
    const seen = new Set(headline.split("/").map(nameKey).filter(Boolean));
    seen.add(nameKey(headline));
    return names.flatMap(
      (name) => String(name || "").split("/").map((part) => part.trim())
    ).filter((name) => {
      const key = nameKey(name);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // src/pages/item/names.js
  function imageName(ctx, item) {
    return ctx.lang === "th" ? item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id : ctx.lang === "ja" ? item.playerUse?.displayName?.ja || item.nameJa || item.nameEn || item.id : item.playerUse?.displayName?.en || item.nameEn || item.nameJa || item.id;
  }
  function fishName(ctx, id, fishVisuals) {
    const fish = fishVisuals[id] || {};
    if (ctx.lang === "th")
      return distinctFishNames(fish.nameTh ? [fish.nameTh] : fish.nameThVariants || []).join(" / ") || fish.nameLatin || fish.nameJa || `ปลา ${id}`;
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
      th: ["อาหารอื่นที่ซื้อได้ในด่านนี้", "เทียบอาหารร้านทั้งหมดและเหตุผลที่ควรเติม HP"],
      ja: ["このエリアで買える他の食料", "店の食料全体とHP補充の理由を比較"],
      en: ["Other foods sold in this area", "Compare all shop foods and why to restore HP"]
    }[ctx.lang];
  }
  function foodChoicePanel(ctx, item, allItems, sections) {
    const copy5 = foodCopy(ctx);
    const hpLabel = (hp) => ctx.lang === "th" ? `ฟื้นได้สูงสุด ${hp} HP` : ctx.lang === "ja" ? `最大${hp} HP回復` : `Restores up to ${hp} HP`;
    const foodOption = (other) => {
      const hp = other.playerUse?.hpRecovery?.hp;
      if (!Number.isSafeInteger(hp) || hp <= 0) return "";
      return `<article data-food-option="${ctx.esc(other.id)}" data-food-hp="${hp}">${ctx.componentLink(other)}<p class="food-option-hp">${ctx.esc(hpLabel(hp))}</p><p>${ctx.esc(ctx.copy.price(other.priceYen))}</p></article>`;
    };
    const alternatives = allItems.filter(
      (other) => other.category === "food" && other.id !== item.id && other.priceYen > 0 && other.playerUse?.shops?.some((shop) => Number(shop.stage) === ctx.selectedStage)
    );
    const nearby = ctx.selectedStage ? `<h3>${ctx.esc(copy5[0])} · ${ctx.selectedStage}</h3><div class="detail-grid" data-local-food-options>${alternatives.map(foodOption).join("")}</div>` : "";
    const catalogueOptions = allItems.filter((other) => other.category === "food" && other.priceYen > 0 && other.id !== item.id).map(foodOption).join("");
    const full = sections.map(
      (section) => `<h3>${ctx.esc(ctx.local(section.title))}</h3><p>${ctx.esc(ctx.local(section.recommendation))}</p><p class="muted">${ctx.esc(ctx.local(section.scope))}</p>`
    ).join("");
    return `<section class="detail-section buying-decision" data-food-choice>${nearby}<details><summary>${ctx.esc(copy5[1])}</summary>${full}<div class="detail-grid" data-all-food-options>${catalogueOptions}</div></details></section>`;
  }

  // src/pages/item/fish-meal-recovery.js
  var copy = {
    th: [
      "อาหารฟื้น HP แทนการกินปลา",
      "เมนูนี้ใช้ปลาที่ตกได้และเก็บในข้อง ถ้าอยากเก็บปลาไว้ ให้ใช้อาหารที่มีอยู่ก่อน หรือดูอาหารอื่นตามด่านที่เลือก",
      "เลือกอาหารฟื้น HP"
    ],
    en: [
      "Restore HP while keeping your fish",
      "This menu uses a caught fish stored in your keepnet. To keep that fish, use food you already own or compare other food for the selected area.",
      "Choose food for HP recovery"
    ],
    ja: [
      "魚を残してHPを回復",
      "このメニューは釣ってびくに入れた魚を使う。魚を残すなら手持ちの食料を先に使うか、選択エリアの他の食料を比較する。",
      "HP回復用の食料を選ぶ"
    ]
  };
  function fishMealRecovery(ctx, stage) {
    const [title, description, action] = copy[ctx.lang] || copy.en;
    const query = new URLSearchParams({ category: "food" });
    if (stage) query.set("stage", String(stage));
    const returned = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returned) query.set("return", returned);
    const href = `${ctx.cataloguePage[ctx.lang]}?${query}#catalogue`;
    return `<section class="detail-section" data-fish-meal-recovery><h2>${ctx.esc(title)}</h2><p>${ctx.esc(description)}</p><a class="route-button" href="${ctx.esc(href)}">${ctx.esc(action)} ↗</a></section>`;
  }

  // src/pages/item/purchases.js
  function selectedStage(ctx) {
    const stage = Number(ctx.selectedStage);
    return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0;
  }
  function selectedAreaLabel(ctx) {
    return {
      th: "ด่านที่เลือก",
      ja: "選択中のエリア",
      en: "Selected area"
    }[ctx.lang];
  }
  function missingAreaNote(ctx, stage, isFly, hasOtherAreas) {
    const area = ctx.copy.shopArea(stage);
    const kind = isFly ? {
      th: "ชุดฟลายสำเร็จรูป",
      ja: "店売り毛バリセット",
      en: "ready-made fly sets"
    }[ctx.lang] : {
      th: "รายการขายไอเท็มนี้",
      ja: "この道具の店頭在庫",
      en: "offers for this item"
    }[ctx.lang];
    const message = hasOtherAreas ? {
      th: `ไม่พบ${kind}ที่บันทึกไว้ใน${area}; แสดงด่านอื่นที่มีรายการไว้ด้านล่าง`,
      ja: `${area}に${kind}の記録はありません。記録のある他エリアを下に表示しています。`,
      en: `No ${kind} are recorded in ${area}; other areas with a recorded offer are listed below.`
    }[ctx.lang] : {
      th: `ไม่พบ${kind}ที่บันทึกไว้ใน${area} หรือด่านอื่นจากข้อมูล ROM ที่ตรวจ`,
      ja: `確認したROMデータには${area}にも他エリアにも${kind}の記録がありません。`,
      en: `No ${kind} are recorded in ${area} or any other area in the checked ROM data.`
    }[ctx.lang];
    return `<p class="muted selected-area-missing-note" data-selected-area-missing="true">${ctx.esc(message)}</p>`;
  }
  function noRecordedStockNote(ctx, stage, isFly) {
    return stage ? missingAreaNote(ctx, stage, isFly, false) : `<p class="muted">${ctx.esc(ctx.copy.noShop)}</p>`;
  }
  function selectedAreaBadge(ctx, stage) {
    return Number(stage) === selectedStage(ctx) ? ` <span class="detail-badge" data-selected-area-badge>${ctx.esc(selectedAreaLabel(ctx))}</span>` : "";
  }
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
    const selected = selectedStage(ctx);
    return parts.sort(
      (a, b) => Number(b.stage === selected) - Number(a.stage === selected) || a.stage - b.stage || a.bundle.shopPriceYen - b.bundle.shopPriceYen
    );
  }
  function shopCondition(ctx, item, offer, fishLocations) {
    if (!offer?.condition) return "";
    const knownAyuCondition = item.category === "bait" && item.id === "17" && offer.condition.includes("sell at least one Ayu");
    const message = knownAyuCondition ? ctx.copy.ayuOffer : ctx.copy.unknownShopCondition;
    const action = knownAyuCondition ? `<a class="route-button" href="${ctx.esc(ctx.fishProfileLink("38", fishLocations))}">${ctx.esc(ctx.lang === "th" ? "ดูจุดตกและเหยื่อสำหรับปลาอายุ" : ctx.lang === "ja" ? "アユの釣り場と対応エサを見る" : "Find Ayu fishing spots and compatible bait")} ↗</a>` : "";
    return `<p class="shop-condition"><strong>${ctx.esc(ctx.copy.unlock)}</strong> ${ctx.esc(message)}</p>${action}`;
  }
  function flyPurchaseCard(ctx, bundle, stage, allItems, fishLocations, selected) {
    const refs = [
      ["fly", bundle.body],
      ["fly_wing", bundle.wing],
      ["fly_tail", bundle.tail]
    ].filter(([, id]) => id && id !== "00").map(([category, id]) => allItems.find((i) => i.category === category && i.id === id)).filter(Boolean);
    const isSelected = stage === selected;
    return `<article class="detail-section" data-purchase-stage="${stage}"${isSelected ? ' data-selected-area-offer="true"' : ""}><h3>${ctx.esc(ctx.copy.bundleAt(stage))}${selectedAreaBadge(ctx, stage)}</h3><p><strong>${ctx.esc(ctx.copy.completePrice)} · ${ctx.esc(ctx.copy.price(bundle.shopPriceYen))}</strong></p><div class="detail-grid">${refs.map((part) => ctx.componentLink(part)).join("")}</div>${ctx.stageButton(stage, fishLocations)}<p class="muted">${ctx.esc(ctx.copy.mapNote)}</p></article>`;
  }
  function flyPurchaseSection(ctx, item, allItems, fishLocations, selected) {
    const assemblies = ctx.flyAssemblies(item, allItems);
    if (!assemblies.length)
      return `<section class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${noRecordedStockNote(ctx, selected, true)}</section>`;
    const hasSelectedAssembly = assemblies.some(({ stage }) => stage === selected);
    const note = selected && !hasSelectedAssembly ? missingAreaNote(ctx, selected, true, true) : "";
    const usedIn = item.category !== "fly" ? `<p>${ctx.esc(ctx.copy.usedIn)}</p>` : "";
    const cards = assemblies.map(
      ({ stage, bundle }) => flyPurchaseCard(ctx, bundle, stage, allItems, fishLocations, selected)
    ).join("");
    return `<section id="fly-purchases" class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${usedIn}${note}<div class="detail-grid">${cards}</div></section>`;
  }
  function shopSeller(ctx, offer) {
    if (offer?.shop === "special_rod_shop")
      return ctx.lang === "th" ? "ร้านคันเบ็ดพิเศษในเมือง" : ctx.lang === "ja" ? "町の専用竿店" : "Special rod shop";
    return ctx.lang === "th" ? "ร้านในด่านนี้" : ctx.lang === "ja" ? "エリア内の店" : "Store stock in this area";
  }
  function shopOfferCard(ctx, item, stage, offer, fishLocations, selected) {
    const isSelected = stage === selected;
    const itemPrice = item.priceYen != null ? ` · ${ctx.esc(ctx.copy.price(item.priceYen))}` : "";
    return `<article class="detail-section" data-purchase-stage="${stage}"${isSelected ? ' data-selected-area-offer="true"' : ""}><h3>${ctx.esc(ctx.stageName(stage, fishLocations))}${selectedAreaBadge(ctx, stage)}</h3><p>${ctx.esc(shopSeller(ctx, offer))}${itemPrice}</p>${ctx.shopCondition(item, offer, fishLocations)}${ctx.stageButton(stage, fishLocations)}</article>`;
  }
  function ordinaryPurchaseSection(ctx, item, fishLocations, selected) {
    const shops = item.playerUse?.shops || [];
    if (!shops.length)
      return `<section id="item-shops" class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${noRecordedStockNote(ctx, selected, false)}</section>`;
    const stages = [
      ...new Set(shops.map((shop) => Number(shop.stage)).filter((stage) => stage >= 1 && stage <= 6))
    ].sort((a, b) => Number(b === selected) - Number(a === selected) || a - b);
    const hasSelectedOffer = stages.includes(selected);
    const note = selected && !hasSelectedOffer ? missingAreaNote(ctx, selected, false, stages.length > 0) : "";
    const price = item.priceYen != null ? `<p><strong>${ctx.esc(ctx.copy.price(item.priceYen))}</strong> <span class="muted">· ${ctx.esc(ctx.copy.stockAt)}</span></p>` : "";
    const cards = stages.map(
      (stage) => shopOfferCard(
        ctx,
        item,
        stage,
        shops.find((shop) => Number(shop.stage) === stage),
        fishLocations,
        selected
      )
    ).join("");
    return `<section id="item-shops" class="detail-section purchase-section"><h2>${ctx.esc(ctx.copy.shop)}</h2>${price}${note}<div class="detail-grid">${cards}</div><p class="muted">${ctx.esc(ctx.copy.mapNote)}</p></section>`;
  }
  function shopSection(ctx, item, allItems, fishLocations) {
    if (item.category === "general_tool" && item.id === "05" && item.playerUse?.startingEquipment?.type === "starting_equipment" && !item.playerUse?.shops?.length)
      return "";
    const selected = selectedStage(ctx);
    if (item.category === "food" && item.id === "08") return fishMealRecovery(ctx, selected);
    if (["fly", "fly_wing", "fly_tail"].includes(item.category))
      return flyPurchaseSection(ctx, item, allItems, fishLocations, selected);
    return ordinaryPurchaseSection(ctx, item, fishLocations, selected);
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
    const copy5 = bundleCopy(lang, item, bundle, fishName2, supported);
    return { ...copy5, bundle, supported, hasTarget: Boolean(fishId), itemId: item.id };
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

  // src/entities/item/fish-meal-copy.js
  var summaries = {
    th: "ปลาอื่นเอาขนาดที่แสดงเป็นเซนติเมตรหาร 4 แล้วปัดเศษลง (ขั้นต่ำ 1 HP ไม่เกิน HP ที่ขาด). เมนูกินปลาตัวแรกในข้องและเอาออก—ตรวจชื่อก่อนยืนยัน; คุซะฟุกุทำ HP เหลือ 0",
    en: "Other fish restore their displayed size in centimetres divided by four (round down, minimum 1 HP), capped at missing HP. The menu eats and removes the first fish in the keepnet; check its name because Kusafugu sets HP to zero.",
    ja: "通常の魚は表示サイズ(cm)を4で割って切り捨て（最低1HP、不足HPまで）回復する。びくの先頭を食べて取り除くため、名前を確認すること。クサフグはHPが0になる。"
  };
  function fishMealSummary(lang) {
    return summaries[lang] || summaries.en;
  }
  var facts = {
    th: [
      "ตัวอย่าง: 20 ซม. ฟื้น 5 HP, 40 ซม. ฟื้น 10 HP, 100 ซม. ฟื้น 25 HP.",
      "ถ้าจะเก็บโออูนางิ / ปลาไหลยักษ์ไว้ให้หมอ อย่าเลือกกินปลาเมื่อมันเป็นปลาตัวแรกในข้อง เมนูกินปลาไม่ได้กันปลาไหลยักษ์ไว้ให้; ใช้อาหารอื่นฟื้น HP แทน"
    ],
    en: [
      "Examples: 20 cm restores 5 HP, 40 cm restores 10 HP, and 100 cm restores 25 HP.",
      "To keep the giant eel for the doctor’s request, do not eat the first keepnet fish when it is the giant eel. The fish-meal menu does not protect the giant eel; use other food to restore HP."
    ],
    ja: [
      "例：20cmなら5HP、40cmなら10HP、100cmなら25HP。",
      "医者の依頼用にオオウナギを残すなら、びくの先頭がオオウナギのときは食べない。食べる処理はオオウナギを保護しないため、HP回復には別の食料を使う。"
    ]
  };
  function fishMealFacts(lang) {
    return facts[lang] || facts.en;
  }

  // src/entities/item/rod-area-copy.js
  var COPY = {
    en: {
      styles: { 1: "Float/Ayu", 2: "casting", 4: "lure", 8: "fly" },
      labels: {
        only: "{area}: only same-style rod listed",
        dominated: "{area}: buy {otherId} instead — {betterReason}{hpNote}",
        dual: "{area}: choose for lowest price, longest aim{hpNote} and farthest traced limit",
        cheapest: "{area}: lowest new-purchase price",
        aim: "{area}: longest aim window{hpNote}",
        aimChoice: "{area}: choose {id} when {comparison}{hpNote}",
        boundary: "{area}: choose for the longest limit before tackle-loss risk",
        boundaryPeerCheapest: "{area}: choose {id} for the farthest limit at the lowest price among those rods",
        boundaryPeerAim: "{area}: choose {id} for more aim time than {otherId} at the same farthest limit{hpNote}",
        tradeoff: "{area}: choose {id} when {comparison}{hpNote}",
        tradeoffFallback: "{area}: choose {id} when {comparison}{hpNote}",
        itemMissing: "{area}: no offer for {id}; lowest-price local option is {budgetId} ({budgetPrice})",
        styleMissing: "{area}: no same-style offer; {direction} numbered-area offer: ID {nextId} in Area {nextStage}",
        styleNever: "{area}: no same-style offer recorded in any numbered area"
      },
      comparison: {
        aimMore: "it gives you more time to adjust the target than the cheaper rod {id}",
        aimLess: "it gives you less time to adjust the target than the cheaper rod {id}",
        boundaryMore: "it lets the fish move farther than with the cheaper rod {id} before the traced tackle-loss branch",
        boundaryLess: "the fish reaches the traced tackle-loss branch closer than with the cheaper rod {id}",
        aimMoreAny: "it gives you more time to adjust the target than rod {id}",
        aimLessAny: "it gives you less time to adjust the target than rod {id}",
        boundaryMoreAny: "it lets the fish move farther than with rod {id} before the traced tackle-loss branch",
        boundaryLessAny: "the fish reaches the traced tackle-loss branch closer than with rod {id}",
        versus: "{benefits}",
        higherPrice: "Rod {id} costs more at {price}; {comparison}{hpNote}.",
        cheaper: "a lower full new-purchase price",
        samePrice: "the same full new-purchase price",
        and: " and ",
        but: ", but "
      },
      recommendation: {
        only: "This is the only {style} rod with a recorded offer in {area}: {stats}. Its aim cutoff gives more time to move the target; its ×{boundary} value is one traced fish-position limit before a tackle-loss escape. Choose it if you need this style here; keep it if already owned.",
        dominated: "For a new {style} rod in {area}, choose {otherId} ({otherStats}) over {id} ({stats}): {betterReason}. Keep {id} if you own it; fish-specific differences remain unresolved.",
        dual: "Choose {id} in {area} if you need a new {style} rod: it has the lowest full price ({price}), gives the longest time to adjust the target ({aim}){hpNote}, and lets the fish move farthest before one traced tackle-loss branch (×{boundary}). Keep an owned rod.",
        cheapest: "Choose {id} to pay the lowest recorded full price in {area} ({price}). {aimLine} {boundaryLine} These are full new-purchase quotes, not trade-in costs; keep a rod you already own.",
        aim: "Choose {id} in {area} when extra time to move the target matters: its aim cutoff ({aim}){hpNote} is the highest among local {style} offers. {budgetLine} {boundaryLine}",
        aimChoice: "Choose {id} at full new-purchase price {price} when {comparison}{hpNote}. The cheaper option is {lowerId} at {lowerPrice}; keep a rod you already own.",
        boundary: "Choose {id} in {area} when the largest recorded fish-position limit before one traced tackle-loss escape matters (×{boundary}). {budgetLine} {aimLine}",
        boundaryPeerCheapest: "Choose {id} for the farthest recorded fish-position limit at the lowest full price among rods tied on that limit ({price}). {otherId} costs {otherPrice} for more time to adjust the target{hpNote} at the same limit.",
        boundaryPeerAim: "Choose {id} when you want more time to adjust the target than {otherId}{hpNote} while keeping the same farthest recorded fish-position limit. Full new-purchase price: {price} versus {otherPrice}.",
        tradeoff: "{id} has a tradeoff among local {style} offers: {lowerLine} {higherLine} Choose based on the full new-purchase price and the aim and boundary values you need.",
        itemMissing: "{id} has no recorded offer in {area}. The same-style rods listed here are {options}. Keep {id} if owned. For a new purchase: {budgetLine} {aimLine} {boundaryLine} These are only price, aim and traced-boundary comparisons; they do not rank catch success.",
        styleMissing: "{area} has no recorded {style} rod offer. The {direction} numbered area with same-style shop records is Area {nextStage}: {options}. Keep {id} if owned; this is a shop-stock route, not a claim that the rod cannot be obtained another way.",
        aimLeader: "The longest local aim window is {id} ({stats}), giving more time to move the target.",
        aimOther: "{id} ({stats}) gives more time to move the target.",
        boundaryLeader: "The largest local limit is {id} ({stats}); it lets the fish move farther before one traced tackle-loss escape branch.",
        boundaryOther: "{id} ({stats}) has a larger limit before one traced tackle-loss escape branch.",
        budgetLeader: "The lowest full-price quote is {id} ({stats}).",
        budgetOther: "{id} ({stats}) has the lowest full-price quote.",
        step: "Compared with {otherId} ({otherStats}), {choiceId} has full price {price} (from {otherPrice}), aim cutoff {aim} (from {otherAim}), and loss limit ×{boundary} (from ×{otherBoundary}).",
        area: "Area {stage}",
        reason: "This choice is based on recorded same-style shop offers and the listed price and two decoded values only.",
        styleNever: "No {style} rod has a recorded shop offer in the six areas. Keep {id} if owned; no shop purchase location is established.",
        tradeoffChoice: "Choose {id} at the full new-purchase price {price} when {comparison}{hpNote}. {higherLine} Keep a rod you already own. Fish-specific advantage remains unresolved.",
        noHigher: "",
        scope: "Comparison scope: recorded same-style shop stock, full new-purchase price, aim cutoff and one traced fish-position threshold before a tackle-loss escape. This does not rank bites, landed fish or fish-specific advantage.{hp}{fly}",
        hp: " Aim values for lure/casting rods assume HP 100 and shorten below 100.",
        fly: " The fly rod’s separate half-value threshold is omitted because its effect is unresolved.",
        noHp: "",
        noFly: "",
        next: "next",
        previous: "previous",
        and: " and "
      }
    },
    th: {
      styles: { 1: "สายทุ่น/อายุ", 2: "ตีเหยื่อ", 4: "ลัวร์", 8: "ฟลาย" },
      labels: {
        only: "ด่าน {stage}: มีคันรูปแบบนี้ขายเพียงคันเดียว",
        dominated: "ด่าน {stage}: ซื้อคัน {otherId} แทน — {betterReason}{hpNote}",
        dual: "ด่าน {stage}: เลือกเมื่ออยากจ่ายถูกสุด ได้เวลาเล็งนานสุด{hpNote}และปลาออกได้ไกลสุด",
        cheapest: "ด่าน {stage}: ซื้อใหม่ราคาเต็มต่ำสุด",
        aim: "ด่าน {stage}: เวลาเล็งสูงสุด{hpNote}",
        aimChoice: "ด่าน {stage}: เลือกคัน {id} เมื่อ{comparison}{hpNote}",
        boundary: "ด่าน {stage}: เลือกเมื่ออยากให้ปลาออกไปได้ไกลก่อนเสี่ยงเสียอุปกรณ์",
        boundaryPeerCheapest: "ด่าน {stage}: เลือกคัน {id} เพื่อได้ขอบเขตไกลสุดในราคาต่ำสุดของกลุ่ม",
        boundaryPeerAim: "ด่าน {stage}: เลือกคัน {id} เพื่อเล็งได้นานกว่าคัน {otherId} โดยยังได้ขอบเขตไกลสุด{hpNote}",
        tradeoff: "ด่าน {stage}: เลือกคัน {id} เมื่อ{comparison}{hpNote}",
        tradeoffFallback: "ด่าน {stage}: เลือกคัน {id} เมื่อ{comparison}{hpNote}",
        itemMissing: "ด่าน {stage}: ไม่มีรายการขายคัน {id}; ตัวเลือกถูกสุดในด่านนี้คือ {budgetId} ({budgetPrice})",
        styleMissing: "ด่าน {stage}: ไม่มีรายการขายรูปแบบนี้; ด่าน{direction}ที่มีคือคัน {nextId} ในด่าน {nextStage}",
        styleNever: "ด่าน {stage}: ไม่พบรายการขายคันรูปแบบนี้ที่บันทึกไว้ทั้งหกด่าน"
      },
      comparison: {
        aimMore: "ให้เวลาขยับเป้าได้นานกว่าคันราคาต่ำกว่า {id}",
        aimLess: "ให้เวลาขยับเป้าได้น้อยกว่าคันราคาต่ำกว่า {id}",
        boundaryMore: "ปลาออกไปได้ไกลกว่าคันราคาต่ำกว่า {id} ก่อนเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์",
        boundaryLess: "ปลาเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์เมื่ออยู่ใกล้กว่าคันราคาต่ำกว่า {id}",
        aimMoreAny: "ให้เวลาขยับเป้าได้นานกว่าคัน {id}",
        aimLessAny: "ให้เวลาขยับเป้าได้น้อยกว่าคัน {id}",
        boundaryMoreAny: "ปลาออกไปได้ไกลกว่าคัน {id} ก่อนเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์",
        boundaryLessAny: "ปลาเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์เมื่ออยู่ใกล้กว่าคัน {id}",
        versus: "{benefits}",
        higherPrice: "คัน {id} ราคาเต็มสูงกว่า ({price}) และ{comparison}{hpNote}",
        cheaper: "ราคาเต็มซื้อใหม่ถูกกว่า",
        samePrice: "ราคาเต็มซื้อใหม่เท่ากัน",
        and: " และ",
        but: " แต่"
      },
      recommendation: {
        only: "นี่เป็นคัน{style}คันเดียวที่มีรายการขายใน{area}: {stats} เวลาเล็งที่สูงขึ้นเพิ่มเวลาขยับเป้าหมาย; ค่า ×{boundary} คือขอบเขตตำแหน่งปลาก่อนเข้าเส้นทางเสียอุปกรณ์หนึ่งแบบ เลือกเมื่อจำเป็นต้องใช้รูปแบบนี้ในด่านนี้; ถ้ามีอยู่แล้วใช้ต่อได้",
        dominated: "ถ้าจะซื้อคัน{style}ใหม่ใน{area} ให้เลือกคัน {otherId} ({otherStats}) แทนคัน {id} ({stats}): {betterReason} ถ้ามีคัน {id} อยู่แล้วใช้ต่อได้; ผลเฉพาะปลายังไม่ยืนยัน",
        dual: "ถ้าต้องซื้อคัน{style}ใหม่ใน{area} ให้เลือกคัน {id}: ราคาเต็มต่ำสุด ({price}), มีเวลาเล็งขยับเป้านานสุด ({aim}){hpNote} และให้ปลาออกไปได้ไกลสุดก่อนเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์ที่แกะได้หนึ่งแบบ (×{boundary}) ถ้ามีคันอยู่แล้วใช้ต่อได้",
        cheapest: "เลือกคัน {id} ถ้าต้องการจ่ายราคาเต็มต่ำสุดใน{area} ({price}) {aimLine} {boundaryLine} เป็นราคาเต็มซื้อใหม่ ไม่ใช่ค่าหักคันเก่า; ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้",
        aim: "เลือกคัน {id} ใน{area} ถ้าต้องการเวลาขยับเป้าหมายนานขึ้น: ค่าเวลาเล็ง ({aim}){hpNote} สูงสุดในกลุ่ม{style}ที่มีขายในด่านนี้ {budgetLine} {boundaryLine}",
        aimChoice: "เลือกคัน {id} ราคาเต็มซื้อใหม่ {price} เมื่อ{comparison}{hpNote} ตัวเลือกที่ถูกกว่าคือคัน {lowerId} ราคา {lowerPrice}; ถ้ามีคันอยู่แล้วใช้ต่อได้",
        boundary: "เลือกคัน {id} ใน{area} ถ้าต้องการขอบเขตตำแหน่งปลาสูงสุดก่อนเข้าเส้นทางเสียอุปกรณ์ที่ตรวจพบหนึ่งแบบ (×{boundary}) {budgetLine} {aimLine}",
        boundaryPeerCheapest: "เลือกคัน {id} ถ้าต้องการขอบเขตตำแหน่งปลาไกลสุดในราคาเต็มต่ำสุดของกลุ่มที่มีขอบเขตเท่ากัน ({price}) คัน {otherId} ราคา {otherPrice} ให้เวลาขยับเป้านานกว่า{hpNote} โดยยังได้ขอบเขตเท่ากัน",
        boundaryPeerAim: "เลือกคัน {id} ถ้าต้องการเวลาขยับเป้านานกว่าคัน {otherId}{hpNote} โดยยังได้ขอบเขตตำแหน่งปลาไกลสุดเท่ากัน ราคาเต็มซื้อใหม่ {price} เทียบกับ {otherPrice}",
        tradeoff: "คัน {id} มีข้อแลกเปลี่ยนเมื่อเทียบกับคัน{style}ที่มีขาย: {lowerLine} {higherLine} เลือกโดยดูราคาเต็มซื้อใหม่ เวลาเล็ง และขอบเขตที่ต้องการ",
        itemMissing: "ไม่มีรายการขายคัน {id} ใน{area}; คัน{style}ที่มีขายคือ {options} ถ้ามีคัน {id} อยู่แล้วใช้ต่อได้ ถ้าจะซื้อใหม่: {budgetLine} {aimLine} {boundaryLine} นี่เป็นการเทียบราคา เวลาเล็ง และขอบเขตที่ตรวจพบเท่านั้น ไม่ได้จัดอันดับโอกาสจับปลา",
        styleMissing: "{area} ไม่มีรายการขายคัน{style}ที่บันทึกไว้; ด่าน{direction}ที่มีรายการขายรูปแบบเดียวกันคือด่าน {nextStage}: {options} ถ้ามีคัน {id} อยู่แล้วใช้ต่อได้ ข้อมูลนี้บอกเฉพาะรายการขายในร้าน ไม่ได้ยืนยันว่าหาได้จากทางอื่นไม่ได้",
        aimLeader: "คันที่มีเวลาเล็งสูงสุดคือ {id} ({stats}) จึงขยับเป้าหมายได้นานกว่า",
        aimOther: "คัน {id} ({stats}) เพิ่มเวลาขยับเป้าหมาย",
        boundaryLeader: "ขอบเขตสูงสุดคือคัน {id} ({stats}); ปลาขยับออกไปได้ไกลกว่าก่อนเข้าเส้นทางเสียอุปกรณ์หนึ่งแบบ",
        boundaryOther: "คัน {id} ({stats}) มีขอบเขตก่อนเส้นทางเสียอุปกรณ์หนึ่งแบบสูงกว่า",
        budgetLeader: "ราคาเต็มต่ำสุดคือคัน {id} ({stats})",
        budgetOther: "คัน {id} ({stats}) มีราคาเต็มต่ำสุด",
        step: "เทียบคัน {otherId} ({otherStats}) กับคัน {choiceId}: ราคาเต็ม {price} (เดิม {otherPrice}), เวลาเล็ง {aim} (เดิม {otherAim}), ขอบเขต ×{boundary} (เดิม ×{otherBoundary})",
        area: "ด่าน {stage}",
        reason: "คำแนะนำนี้ใช้รายการขายคันรูปแบบเดียวกัน ราคา และค่าที่ถอดจากโค้ดสองค่าเท่านั้น",
        styleNever: "ไม่พบคัน{style}ในรายการขายทั้งหกด่าน ถ้ามีคัน {id} อยู่แล้วใช้ต่อได้; ยังไม่มีตำแหน่งร้านที่ยืนยันให้ซื้อคันรูปแบบนี้",
        tradeoffChoice: "เลือกคัน {id} ในราคาเต็มซื้อใหม่ {price} เมื่อ{comparison}{hpNote} {higherLine} ถ้ามีคันอยู่แล้วใช้ต่อได้ และยังไม่ยืนยันข้อได้เปรียบเฉพาะปลา",
        noHigher: "",
        scope: "ขอบเขตการเทียบ: สต็อกร้านรูปแบบเดียวกัน ราคาเต็มซื้อใหม่ เวลาเล็ง และเกณฑ์ตำแหน่งปลาก่อนเส้นทางเสียอุปกรณ์หนึ่งแบบ ไม่ได้จัดอันดับปลากิน จับขึ้น หรือข้อได้เปรียบเฉพาะปลา{hp}{fly}",
        hp: " ค่าเล็งคันลัวร์/ตีเหยื่ออิง HP 100 และลดลงเมื่อ HP ต่ำกว่า 100",
        fly: " ไม่รวมเกณฑ์ครึ่งหนึ่งอีกชุดของคันฟลาย เพราะยังไม่ทราบผลแยก",
        noHp: "",
        noFly: "",
        next: "ถัดไป",
        previous: "ก่อนหน้า",
        and: " และ"
      }
    },
    ja: {
      styles: { 1: "ウキ・アユ", 2: "投げ釣り", 4: "ルアー", 8: "フライ" },
      labels: {
        only: "エリア{stage}：同じ釣り方で唯一の店頭記録",
        dominated: "エリア{stage}：新品購入は{id}より{otherId} — {betterReason}{hpNote}",
        dual: "エリア{stage}：最安で照準時間{hpNote}・確認境界も最大",
        cheapest: "エリア{stage}：新品全額が最安",
        aim: "エリア{stage}：照準時間が最長{hpNote}",
        aimChoice: "エリア{stage}：{id}は{comparison}{hpNote}",
        boundary: "エリア{stage}：魚が道具喪失リスクに達する前に遠くへ動ける値で選ぶ",
        boundaryPeerCheapest: "エリア{stage}：最遠境界の竿では新品全額が最安の{id}を選ぶ",
        boundaryPeerAim: "エリア{stage}：{otherId}より照準時間が長い{id}を、同じ最遠境界で選ぶ{hpNote}",
        tradeoff: "エリア{stage}：{comparison}ので{id}を選ぶ{hpNote}",
        tradeoffFallback: "エリア{stage}：{comparison}ので{id}を選ぶ{hpNote}",
        itemMissing: "エリア{stage}：{id}の販売記録なし。同エリアの最安候補は{budgetId}（{budgetPrice}）",
        styleMissing: "エリア{stage}：同じ釣り方の記録なし。{direction}番号エリア{nextStage}に{nextId}の販売記録",
        styleNever: "エリア{stage}：同じ釣り方の販売記録は全6エリアにありません"
      },
      comparison: {
        aimMore: "安い竿{id}より照準時間が長い",
        aimLess: "安い竿{id}より照準時間が短い",
        boundaryMore: "安い竿{id}より魚が遠くまで移動してから確認済みの道具喪失分岐に入る",
        boundaryLess: "安い竿{id}より魚が近い位置で確認済みの道具喪失分岐に入る",
        aimMoreAny: "竿{id}より照準時間が長く、狙う位置を動かせる時間が延びる",
        aimLessAny: "竿{id}より照準時間が短く、狙う位置を動かせる時間が減る",
        boundaryMoreAny: "竿{id}より魚が遠くへ進んでから確認済みの道具喪失分岐に入る",
        boundaryLessAny: "竿{id}より魚が近い位置で確認済みの道具喪失分岐に入る",
        versus: "{benefits}",
        higherPrice: "高価な竿{id}（新品全額{price}）なら、{comparison}{hpNote}",
        cheaper: "新品全額が安い",
        samePrice: "新品全額が同じ",
        and: "、",
        but: "が、その一方で"
      },
      recommendation: {
        only: "エリア{stage}で販売記録がある{style}竿はこれだけです：{stats}。照準上限は狙うタイルを動かせる時間に関係します。×{boundary}は特定の道具喪失分岐までの魚位置しきい値です。この釣り方が必要なら選び、所持していれば継続できます。",
        dominated: "エリア{stage}で{style}竿を新しく買うなら{id}（{stats}）より{otherId}（{otherStats}）を選びます：{betterReason}。所持していれば{id}を使い続けられます。魚別の差は未解明です。",
        dual: "エリア{stage}で{style}竿を新しく買うなら{id}。新品全額が最安（{price}）で、狙う位置を動かせる時間（{aim}）{hpNote}と、確認した道具喪失分岐まで魚が進める距離（×{boundary}）も最大です。所持していれば使い続けられます。",
        cheapest: "エリア{stage}で新品全額を抑えるなら{id}（{price}）が最安です。{aimLine} {boundaryLine} 所持品の下取り価格ではなく、新品の全額です。すでに持っていれば継続できます。",
        aim: "照準時間を優先するなら、エリア{stage}の{id}（{aim}）{hpNote}を選びます。同じ釣り方の店頭在庫で最長です。{budgetLine} {boundaryLine}",
        aimChoice: "新品全額{price}の{id}を選びます。{comparison}{hpNote}。出費を抑えるなら{lowerId}（{lowerPrice}）です。所持している竿は継続できます。",
        boundary: "特定の道具喪失分岐までの魚位置しきい値を優先するなら、エリア{stage}の{id}（×{boundary}）を選びます。{budgetLine} {aimLine}",
        boundaryPeerCheapest: "同じ最遠境界の竿で新品全額が最安なのは{id}（{price}）です。{otherId}（{otherPrice}）なら境界を保ったまま狙う位置を動かせる時間が長くなります{hpNote}。",
        boundaryPeerAim: "同じ最遠境界を保ちながら{otherId}より狙う位置を動かせる時間を延ばすなら{id}を選びます{hpNote}。新品全額は{price}で、{otherId}は{otherPrice}です。",
        tradeoff: "{id}はエリア{stage}の{style}販売記録の中で、価格・照準・境界にトレードオフがあります。{lowerLine} {higherLine} 新品全額と必要な照準時間・境界で選びます。",
        itemMissing: "{id}の販売記録はエリア{stage}にありません。同じ釣り方でこのエリアに販売記録がある竿は{options}です。{id}を所持していれば継続できます。新しく買うなら：{budgetLine} {aimLine} {boundaryLine} 価格・照準・確認済み境界だけの比較で、釣果全体の優劣は判断できません。",
        styleMissing: "エリア{stage}に{style}竿の販売記録はありません。同じ釣り方で販売記録がある{direction}番号エリアはエリア{nextStage}です：{options}。所持している竿は継続できます。店頭記録から他の入手方法までは判断できません。",
        styleNever: "6エリアの販売記録に{style}竿はありません。{id}を所持していれば継続できます。店頭での購入場所は確認できません。",
        tradeoffChoice: "新品全額{price}の{id}を選びます。{comparison}{hpNote}。{higherLine}。所持している竿は継続でき、魚別の優位性は未解明です。",
        noHigher: "",
        aimLeader: "照準時間が最長なのは{id}（{stats}）。狙うタイルを動かせる時間が長くなります。",
        aimOther: "{id}（{stats}）の方が狙うタイルを動かせる時間が長いです。",
        boundaryLeader: "確認済み境界が最大なのは{id}（{stats}）。特定の道具喪失分岐まで魚が遠くへ移動できます。",
        boundaryOther: "{id}（{stats}）の方が特定の道具喪失分岐までの境界が大きいです。",
        budgetLeader: "新品全額の最安は{id}（{stats}）。",
        budgetOther: "新品全額は{id}（{stats}）が最安です。",
        step: "{otherId}（{otherStats}）と{choiceId}の比較：新品全額 {price}（{otherPrice}から）、照準上限 {aim}（{otherAim}から）、境界 ×{boundary}（×{otherBoundary}から）。",
        area: "エリア{stage}",
        reason: "同じ釣り方の店頭記録、価格、コードで確認した二つの値だけを使っています。",
        scope: "比較範囲：同じ釣り方の店頭在庫、新品全額、照準上限、特定の道具喪失分岐までの魚位置しきい値のみ。食いつき、取り込み、魚別の優位性は順位付けしません。{hp}{fly}",
        hp: " ルアー竿・投げ竿の照準値はHP100時で、HP100未満では短くなります。",
        fly: " フライ竿の半値しきい値は効果が未解明のため比較していません。",
        noHp: "",
        noFly: "",
        next: "次の",
        previous: "前の",
        and: "、"
      }
    }
  };
  function interpolate(template, values) {
    return template.replace(/\{([a-zA-Z]+)\}/g, (_match, key) => String(values[key] ?? ""));
  }
  function rodAreaCopy(lang, type, key, values = {}) {
    const locale = COPY[lang] || COPY.en;
    return interpolate(locale[type][key], values);
  }
  function rodAreaScope(lang, styleCode2) {
    const locale = COPY[lang] || COPY.en;
    const hp = [2, 4].includes(styleCode2) ? locale.recommendation.hp : "";
    const fly = styleCode2 === 8 ? locale.recommendation.fly : "";
    return interpolate(locale.recommendation.scope, { hp, fly });
  }

  // src/entities/item/rod-area-label.js
  var AIM_STYLES = [2, 4];
  function text(lang, type, key, values) {
    return rodAreaCopy(lang, type, key, values);
  }
  function offerPrice(lang, price) {
    return lang === "ja" ? `${price}円` : `¥${price}`;
  }
  function aimCondition(lang, item) {
    if (!AIM_STYLES.includes(Number(item.decodedFields?.styleCode))) return "";
    return lang === "th" ? " (HP 100 ใช้กับเวลาเล็งเท่านั้น)" : lang === "ja" ? "（HP100は照準値のみ）" : " (HP 100 applies to aim only)";
  }
  function leader(choices, field) {
    const values = choices.map((choice) => choice[field]);
    const value = field === "price" ? Math.min(...values) : Math.max(...values);
    return choices.find((choice) => choice[field] === value);
  }
  function tradeoffNeighbors(candidate, choices) {
    const lower = choices.filter((choice) => choice.price < candidate.price).sort((a, b) => b.price - a.price || a.id.localeCompare(b.id))[0];
    const higher = choices.filter((choice) => choice.price > candidate.price).sort((a, b) => a.price - b.price || a.id.localeCompare(b.id))[0];
    return { lower, higher };
  }
  function relationCopy(lang, key) {
    const names = ["id", "benefits", "price", "comparison", "hpNote"];
    const placeholders = Object.fromEntries(names.map((name) => [name, `%%${name}%%`]));
    return Object.entries(placeholders).reduce(
      (copy5, [name, marker]) => copy5.replaceAll(marker, `{${name}}`),
      text(lang, "comparison", key, placeholders)
    );
  }
  function tradeoffDescription(lang, subject, other) {
    const aimKey = subject.aim > other.aim ? "aimMore" : subject.aim < other.aim ? "aimLess" : "";
    const boundaryKey = subject.boundary > other.boundary ? "boundaryMore" : subject.boundary < other.boundary ? "boundaryLess" : "";
    const keys = [aimKey, boundaryKey].filter(Boolean);
    const phrases = keys.map((key) => relationCopy(lang, key).replace("{id}", other.id));
    const opposing = keys.length === 2 && subject.aim > other.aim !== subject.boundary > other.boundary;
    const joiner = opposing ? relationCopy(lang, "but") : relationCopy(lang, "and");
    return relationCopy(lang, "versus").replace("{benefits}", phrases.join(joiner));
  }
  function higherPriceDescription(lang, subject, other) {
    return relationCopy(lang, "higherPrice").replace("{id}", subject.id).replace("{price}", offerPrice(lang, subject.price)).replace("{comparison}", tradeoffDescription(lang, subject, other)).replace("{hpNote}", aimCondition(lang, subject.item));
  }
  function boundaryPeerContext(choices, maximum) {
    const peers = choices.filter((choice) => choice.boundary === maximum);
    if (peers.length < 2) return null;
    return { cheapest: leader(peers, "price"), aimLeader: leader(peers, "aim") };
  }
  function dominatedReason(lang, candidate, better) {
    const keys = [better.price < candidate.price ? "cheaper" : "samePrice"];
    if (better.aim > candidate.aim) keys.push("aimMoreAny");
    if (better.boundary > candidate.boundary) keys.push("boundaryMoreAny");
    return keys.map((key) => relationCopy(lang, key).replace("{id}", candidate.id)).join(relationCopy(lang, "and"));
  }
  function valuesFor(lang, candidate, stage, better) {
    return {
      stage,
      area: text(lang, "recommendation", "area", { stage }),
      id: candidate.id,
      otherId: better?.id || "",
      price: offerPrice(lang, candidate.price),
      aim: candidate.aim,
      hpNote: aimCondition(lang, candidate.item)
    };
  }
  function areaLeaderLabel(lang, status, candidate, choices, values) {
    if (status === "aim") {
      const budget = leader(choices, "price");
      if (budget.id !== candidate.id) {
        return text(lang, "labels", "aimChoice", {
          ...values,
          comparison: tradeoffDescription(lang, candidate, budget)
        });
      }
    }
    if (status === "boundary") {
      const maximum = Math.max(...choices.map((choice) => choice.boundary));
      const peer = boundaryPeerContext(choices, maximum);
      if (peer?.cheapest.id === candidate.id && peer.aimLeader.id !== candidate.id) {
        return text(lang, "labels", "boundaryPeerCheapest", values);
      }
      if (peer?.aimLeader.id === candidate.id && peer.cheapest.id !== candidate.id) {
        return text(lang, "labels", "boundaryPeerAim", {
          ...values,
          otherId: peer.cheapest.id
        });
      }
    }
    return "";
  }
  function tradeoffLabel(lang, candidate, choices, values) {
    const { lower, higher } = tradeoffNeighbors(candidate, choices);
    const other = lower || leader(choices, "price");
    const key = higher ? "tradeoff" : "tradeoffFallback";
    return text(lang, "labels", key, {
      ...values,
      lowerId: other.id,
      comparison: tradeoffDescription(lang, candidate, other)
    });
  }
  function areaRodLabel(lang, status, candidate, choices, stage, better) {
    const values = valuesFor(lang, candidate, stage, better);
    if (status === "dominated") {
      return text(lang, "labels", status, {
        ...values,
        betterReason: dominatedReason(lang, candidate, better)
      });
    }
    const leaderLabel = areaLeaderLabel(lang, status, candidate, choices, values);
    if (leaderLabel) return leaderLabel;
    if (status !== "tradeoff") return text(lang, "labels", status, values);
    return tradeoffLabel(lang, candidate, choices, values);
  }

  // src/entities/item/rod-area-decision.js
  var LOCALES = ["en", "th", "ja"];
  var STYLES = { 1: "Float/Ayu", 2: "Casting", 4: "Lure", 8: "Fly" };
  function validStage(value) {
    const stage = Number(value);
    return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0;
  }
  function styleCode(item) {
    const style = Number(item.decodedFields?.styleCode);
    return Object.hasOwn(STYLES, style) ? style : 0;
  }
  function rodMetrics(item) {
    const values = {
      price: Number(item.priceYen),
      aim: Number(item.decodedFields?.castAimHoldCutoffInternal),
      boundary: Number(item.decodedFields?.rangeMultiplier)
    };
    return Object.values(values).every(Number.isFinite) ? { ...values, id: item.id, item } : null;
  }
  function localStyleOffers(item, allItems, stage) {
    const style = styleCode(item);
    return allItems.filter(
      (candidate) => candidate.category === "rod" && styleCode(candidate) === style && candidate.playerUse?.shops?.some((offer) => Number(offer.stage) === stage)
    ).map(rodMetrics).filter(Boolean).sort((a, b) => a.id.localeCompare(b.id));
  }
  function dominates(first, second) {
    return first.id !== second.id && first.price <= second.price && first.aim >= second.aim && first.boundary >= second.boundary && (first.price < second.price || first.aim > second.aim || first.boundary > second.boundary);
  }
  function dominators(candidate, choices) {
    return choices.filter((choice) => dominates(choice, candidate)).sort(
      (a, b) => a.price - b.price || b.aim - a.aim || b.boundary - a.boundary || a.id.localeCompare(b.id)
    );
  }
  function extremes(choices) {
    return {
      cheapest: Math.min(...choices.map((choice) => choice.price)),
      aim: Math.max(...choices.map((choice) => choice.aim)),
      boundary: Math.max(...choices.map((choice) => choice.boundary))
    };
  }
  function offerPrice2(lang, price) {
    return lang === "ja" ? `${price}円` : `¥${price}`;
  }
  function offerStats(lang, choice) {
    const hpNote = aimCondition2(lang, choice.item);
    if (lang === "th")
      return `${offerPrice2(lang, choice.price)} · เวลาเล็ง ${choice.aim}${hpNote} · ขอบเขต ×${choice.boundary}`;
    if (lang === "ja")
      return `${offerPrice2(lang, choice.price)}・照準${choice.aim}${hpNote}・境界×${choice.boundary}`;
    return `${offerPrice2(lang, choice.price)} · aim ${choice.aim}${hpNote} · limit ×${choice.boundary}`;
  }
  function aimCondition2(lang, item) {
    if (![2, 4].includes(styleCode(item))) return "";
    return lang === "th" ? " (HP 100 ใช้กับเวลาเล็งเท่านั้น)" : lang === "ja" ? "（HP100は照準値のみ）" : " (HP 100 applies to aim only)";
  }
  function localized(valueForLocale) {
    return Object.fromEntries(LOCALES.map((lang) => [lang, valueForLocale(lang)]));
  }
  function text2(lang, type, key, values) {
    return rodAreaCopy(lang, type, key, values);
  }
  function leader2(choices, field) {
    const value = field === "price" ? Math.min(...choices.map((choice) => choice.price)) : Math.max(...choices.map((choice) => choice[field]));
    return choices.find((choice) => choice[field] === value);
  }
  function leaderSentence(lang, field, candidate, choices) {
    const best = leader2(choices, field);
    const key = field === "aim" ? "aim" : field === "boundary" ? "boundary" : "budget";
    const sentenceKey = best.id === candidate.id ? `${key}Leader` : `${key}Other`;
    return text2(lang, "recommendation", sentenceKey, {
      id: best.id,
      stats: offerStats(lang, best),
      hpNote: ""
    });
  }
  function tradeoffNeighbors2(candidate, choices) {
    const lower = choices.filter((choice) => choice.price < candidate.price).sort((a, b) => b.price - a.price || a.id.localeCompare(b.id))[0];
    const higher = choices.filter((choice) => choice.price > candidate.price).sort((a, b) => a.price - b.price || a.id.localeCompare(b.id))[0];
    return { lower, higher };
  }
  function localStatus(candidate, choices, best) {
    if (choices.length === 1) return "only";
    if (best) return "dominated";
    const tops = extremes(choices);
    if (candidate.price === tops.cheapest && candidate.aim === tops.aim && candidate.boundary === tops.boundary)
      return "dual";
    if (candidate.price === tops.cheapest) return "cheapest";
    if (candidate.aim === tops.aim) return "aim";
    if (candidate.boundary === tops.boundary) return "boundary";
    return "tradeoff";
  }
  function localRecommendation(lang, status, candidate, choices, stage, best) {
    const values = localRecommendationValues(lang, candidate, stage);
    const basic = simpleLocalRecommendation(lang, status, candidate, choices, best, values);
    return basic || tradeoffRecommendation(lang, candidate, choices, values);
  }
  function localRecommendationValues(lang, candidate, stage) {
    return {
      area: text2(lang, "recommendation", "area", { stage }),
      stage,
      id: candidate.id,
      style: text2(lang, "styles", String(styleCode(candidate.item)), {}),
      price: offerPrice2(lang, candidate.price),
      aim: candidate.aim,
      boundary: candidate.boundary,
      stats: offerStats(lang, candidate),
      hpNote: aimCondition2(lang, candidate.item)
    };
  }
  function simpleLocalRecommendation(lang, status, candidate, choices, best, values) {
    if (status === "only") return text2(lang, "recommendation", "only", values);
    if (status === "dominated")
      return text2(lang, "recommendation", "dominated", {
        ...values,
        otherId: best.id,
        otherStats: offerStats(lang, best),
        betterReason: dominatedReason(lang, candidate, best)
      });
    if (status === "dual") return text2(lang, "recommendation", "dual", values);
    if (status === "cheapest") return cheapestRecommendation(lang, candidate, choices, values);
    if (status === "aim") return aimRecommendation(lang, candidate, choices, values);
    if (status === "boundary") return boundaryRecommendation(lang, candidate, choices, values);
    return "";
  }
  function cheapestRecommendation(lang, candidate, choices, values) {
    return text2(lang, "recommendation", "cheapest", {
      ...values,
      aimLine: leaderSentence(lang, "aim", candidate, choices),
      boundaryLine: leaderSentence(lang, "boundary", candidate, choices)
    });
  }
  function aimRecommendation(lang, candidate, choices, values) {
    const budget = leader2(choices, "price");
    if (budget.id !== candidate.id) {
      return text2(lang, "recommendation", "aimChoice", {
        ...values,
        lowerId: budget.id,
        lowerPrice: offerPrice2(lang, budget.price),
        comparison: tradeoffDescription(lang, candidate, budget)
      });
    }
    return text2(lang, "recommendation", "aim", {
      ...values,
      budgetLine: leaderSentence(lang, "price", candidate, choices),
      boundaryLine: leaderSentence(lang, "boundary", candidate, choices)
    });
  }
  function boundaryRecommendation(lang, candidate, choices, values) {
    const maximum = Math.max(...choices.map((choice) => choice.boundary));
    const peer = boundaryPeerContext(choices, maximum);
    if (peer?.cheapest.id === candidate.id && peer.aimLeader.id !== candidate.id) {
      return text2(lang, "recommendation", "boundaryPeerCheapest", {
        ...values,
        otherId: peer.aimLeader.id,
        otherPrice: offerPrice2(lang, peer.aimLeader.price),
        otherAim: peer.aimLeader.aim,
        hpNote: aimCondition2(lang, peer.aimLeader.item)
      });
    }
    if (peer?.aimLeader.id === candidate.id && peer.cheapest.id !== candidate.id) {
      return text2(lang, "recommendation", "boundaryPeerAim", {
        ...values,
        otherId: peer.cheapest.id,
        otherPrice: offerPrice2(lang, peer.cheapest.price),
        hpNote: aimCondition2(lang, candidate.item)
      });
    }
    return text2(lang, "recommendation", "boundary", {
      ...values,
      budgetLine: leaderSentence(lang, "price", candidate, choices),
      aimLine: leaderSentence(lang, "aim", candidate, choices)
    });
  }
  function tradeoffRecommendation(lang, candidate, choices, values) {
    const { lower, higher } = tradeoffNeighbors2(candidate, choices);
    return text2(lang, "recommendation", "tradeoffChoice", {
      ...values,
      lowerId: lower?.id || leader2(choices, "price").id,
      comparison: tradeoffDescription(lang, candidate, lower || leader2(choices, "price")),
      higherLine: higher ? higherPriceDescription(lang, higher, candidate) : leaderSentence(lang, "aim", candidate, choices)
    });
  }
  function alternativesFor(candidate, choices, isStocked) {
    if (!isStocked) return choices.map((choice) => ({ category: "rod", id: choice.id }));
    const alternatives = [];
    const best = dominators(candidate, choices)[0];
    const add = (choice) => {
      if (choice && choice.id !== candidate.id && !alternatives.some((ref) => ref.id === choice.id))
        alternatives.push({ category: "rod", id: choice.id });
    };
    add(best);
    add(leader2(choices, "price"));
    add(leader2(choices, "aim"));
    add(leader2(choices, "boundary"));
    const { lower, higher } = tradeoffNeighbors2(candidate, choices);
    add(lower);
    add(higher);
    return alternatives;
  }
  function stockAtStage(allItems, style, stage) {
    const source = allItems.find((item) => item.category === "rod" && styleCode(item) === style);
    return source ? localStyleOffers(source, allItems, stage) : [];
  }
  function nextRecordedStage(allItems, style, stage) {
    const stages = allItems.filter((item) => item.category === "rod" && styleCode(item) === style).flatMap((item) => (item.playerUse?.shops || []).map((offer) => Number(offer.stage))).filter((area) => Number.isInteger(area) && area >= 1 && area <= 6).sort((a, b) => a - b);
    const next = stages.find((area) => area > stage);
    return next || stages.filter((area) => area < stage).at(-1) || 0;
  }
  function localeOptions(lang, choices) {
    return choices.map((choice) => `${choice.id} (${offerStats(lang, choice)})`).join(lang === "ja" ? "、" : "; ");
  }
  function decisionResult(status, stage, style, labelFor, recommendationFor, alternatives, nextStockStage = 0) {
    return {
      status,
      stage,
      label: localized(labelFor),
      recommendation: localized(recommendationFor),
      reason: localized((lang) => text2(lang, "recommendation", "reason", {})),
      scope: localized((lang) => rodAreaScope(lang, style)),
      alternatives,
      nextStockStage
    };
  }
  function areaValues(lang, stage) {
    return {
      stage,
      area: text2(lang, "recommendation", "area", { stage })
    };
  }
  function unstockedItem(item, choices, stage, style) {
    const status = "item-unstocked";
    const area = localized((lang) => text2(lang, "recommendation", "area", { stage }));
    const budget = leader2(choices, "price");
    return decisionResult(
      status,
      stage,
      style,
      (lang) => text2(lang, "labels", "itemMissing", {
        stage,
        area: area[lang],
        id: item.id,
        budgetId: budget.id,
        budgetPrice: offerPrice2(lang, budget.price)
      }),
      (lang) => text2(lang, "recommendation", "itemMissing", {
        id: item.id,
        stage,
        area: area[lang],
        style: text2(lang, "styles", String(style), {}) || STYLES[style],
        options: localeOptions(lang, choices),
        hpNote: aimCondition2(lang, item),
        budgetLine: leaderSentence(lang, "price", budget, choices),
        aimLine: leaderSentence(lang, "aim", leader2(choices, "aim"), choices),
        boundaryLine: leaderSentence(lang, "boundary", leader2(choices, "boundary"), choices)
      }),
      alternativesFor(null, choices, false)
    );
  }
  function noStyleStock(item, allItems, stage, style) {
    const nextStage = nextRecordedStage(allItems, style, stage);
    const choices = nextStage ? stockAtStage(allItems, style, nextStage) : [];
    const direction = nextStage > stage ? "next" : "previous";
    const status = choices.length ? "style-unstocked" : "style-never-stocked";
    const key = choices.length ? "styleMissing" : "styleNever";
    const labelKey = choices.length ? "styleMissing" : "styleNever";
    const result = decisionResult(
      status,
      stage,
      style,
      (lang) => text2(lang, "labels", labelKey, {
        ...areaValues(lang, stage),
        nextStage,
        nextId: choices[0]?.id || "",
        direction: text2(lang, "recommendation", direction, {})
      }),
      (lang) => text2(lang, "recommendation", key, {
        id: item.id,
        ...areaValues(lang, stage),
        nextStage,
        nextId: choices[0]?.id || "",
        direction: text2(lang, "recommendation", direction, {}),
        style: text2(lang, "styles", String(style), {}) || STYLES[style],
        options: localeOptions(lang, choices),
        hpNote: aimCondition2(lang, item)
      }),
      alternativesFor(null, choices, false),
      nextStage
    );
    return result;
  }
  function rodAreaDecision(_lang, item, allItems, selectedArea) {
    const stage = validStage(selectedArea);
    const style = styleCode(item);
    if (!stage || item.category !== "rod" || !style) return null;
    const choices = localStyleOffers(item, allItems, stage);
    if (!choices.length) return noStyleStock(item, allItems, stage, style);
    const candidate = choices.find((choice) => choice.id === item.id);
    if (!candidate) return unstockedItem(item, choices, stage, style);
    const better = dominators(candidate, choices)[0];
    const status = localStatus(candidate, choices, better);
    return decisionResult(
      status,
      stage,
      style,
      (lang) => areaRodLabel(lang, status, candidate, choices, stage, better),
      (lang) => localRecommendation(lang, status, candidate, choices, stage, better),
      alternativesFor(candidate, choices, true)
    );
  }

  // src/entities/item/equal-price-choice.js
  var COPY2 = {
    th: {
      title: "ซื้อใหม่เพื่อใช้กับปลาหลายชนิด: ราคาเท่ากัน แต่รองรับปลามากกว่า",
      advice: "เลือกตัวเลือกนี้ถ้าอยากพกชิ้นที่ใช้ได้กว้างขึ้น รองรับปลาเดิมครบทุกสายตกที่เปรียบเทียบ ถ้ามีชิ้นเดิมและใช้กับปลาเป้าหมายได้แล้ว ให้ใช้ต่อได้",
      limit: "ไม่ได้ยืนยันว่าปลากินบ่อยขึ้นหรือตกขึ้นง่ายกว่า",
      area: (stage) => `ด่าน ${stage}`
    },
    en: {
      title: "Buying for more species: same price, broader fish coverage",
      advice: "Choose this option to carry an item with broader compatibility. It covers every original fish on each compared rig. Keep using the current item if you own it and it works for your target.",
      limit: "This does not establish more bites or easier landings.",
      area: (stage) => `Area ${stage}`
    },
    ja: {
      title: "複数の魚を狙って買うなら：同じ価格で対応魚が多い候補",
      advice: "対応する魚を増やしたいなら、この候補を選べます。比較した各仕掛けで元の魚すべてに対応します。すでに持っていて対象魚に使える品は、そのまま使えます。",
      limit: "食いつきや取り込みやすさの優位を示すものではありません。",
      area: (stage) => `エリア${stage}`
    }
  };
  function groupedOffers(ctx, item) {
    const stage = Number(ctx.locationStage || ctx.selectedStage);
    const groups = /* @__PURE__ */ new Map();
    for (const [area, refs] of Object.entries(item.baitLureDecision?.equalPriceByStage || {})) {
      if (stage && Number(area) !== stage) continue;
      for (const ref of refs) {
        const key = `${ref.category}:${ref.id}`;
        const group = groups.get(key) || { ref, areas: [] };
        group.areas.push(Number(area));
        groups.set(key, group);
      }
    }
    return [...groups.values()];
  }
  function offerLinks(ctx, item, allItems) {
    const c = COPY2[ctx.lang] || COPY2.en;
    return groupedOffers(ctx, item).flatMap(({ ref, areas }) => {
      const target = allItems.find((entry) => entry.category === ref.category && entry.id === ref.id);
      if (!target || target.priceYen !== item.priceYen) return [];
      const names = { en: target.nameEn, ja: target.nameJa, th: target.nameTh };
      const name = target.playerUse?.displayName?.[ctx.lang] || names[ctx.lang] || target.nameJa;
      const href = ctx.areaItemLink(target, areas[0]);
      const label = `${name} (ID ${target.id}) · ¥${target.priceYen} · ${areas.map(c.area).join(", ")}`;
      return [
        `<a data-equal-price-item="${ctx.esc(ref.category + ":" + ref.id)}" data-offer-stage="${areas[0]}" href="${ctx.esc(href)}">${ctx.esc(label)} ↗</a>`
      ];
    });
  }
  function equalPriceChoice(ctx, item, allItems, includeLimit = true) {
    const links = offerLinks(ctx, item, allItems);
    if (!links.length) return "";
    const c = COPY2[ctx.lang] || COPY2.en;
    const limit = includeLimit ? `<p class="muted">${ctx.esc(c.limit)}</p>` : "";
    return `<aside data-equal-price-choice><h3>${ctx.esc(c.title)}</h3><p>${ctx.esc(c.advice)}</p><p>${links.join(" · ")}</p>${limit}</aside>`;
  }

  // src/entities/item/food-area-decision.js
  function recommendation(lang, stage, hp, price, stocked) {
    if (lang === "th")
      return stocked ? `ด่าน ${stage} มีขายชิ้นนี้ราคา ¥${price} ฟื้นได้สูงสุด ${hp} HP ถ้ามีอาหารที่เหมาะอยู่แล้วใช้ก่อนซื้อเพิ่ม เลือกปริมาณให้ใกล้ HP ที่ขาด เพราะส่วนที่เกินจะเสียเปล่า` : `ถ้ามีชิ้นนี้อยู่แล้ว ใช้ฟื้นได้สูงสุด ${hp} HP โดยไม่เกิน HP ที่ขาด ด่าน ${stage} ไม่มีรายการขายชิ้นนี้ ถ้าจะซื้อใหม่ ให้เลือกอาหารที่มีขายในด่านนี้แทน`;
    if (lang === "ja")
      return stocked ? `エリア${stage}では${price}円で購入でき、最大${hp}HP回復。使える食料を持っていれば先に使い、不足HPに近い量を選んで超過分を無駄にしないでください。` : `持っていれば不足HPを上限に最大${hp}HP回復できます。エリア${stage}の販売記録にはありません。買うならこのエリアで売られている食料を選んでください。`;
    return stocked ? `Sold in Area ${stage} for ¥${price}; restores up to ${hp} HP. Use suitable food you already own before buying more. Match recovery to missing HP because excess is wasted.` : `If you already own this, use it to restore up to ${hp} HP, capped at missing HP. It is not in Area ${stage}'s recorded stock. If buying food, choose a locally stocked option instead.`;
  }
  function foodAreaDecision(lang, item, selectedStage2) {
    const stage = Number(selectedStage2);
    const hp = item.playerUse?.hpRecovery?.hp;
    if (item.category !== "food" || !/^0[1-6]$/.test(item.id)) return null;
    if (!Number.isInteger(stage) || stage < 1 || stage > 6) return null;
    if (!Number.isSafeInteger(hp) || hp <= 0 || !(item.priceYen > 0)) return null;
    const stocked = (item.playerUse?.shops || []).some(
      (shop) => Number(shop.stage) === stage && !shop.condition
    );
    return { stage, stocked, summary: recommendation(lang, stage, hp, item.priceYen, stocked) };
  }

  // src/entities/item/lure-coverage-kit.js
  var PREFERRED_PAIR_ORDER = /* @__PURE__ */ new Map([
    ["2E+23", 0],
    ["17+24", 1],
    ["17+23", 2]
  ]);
  function luresWithFishProfiles(items) {
    return items.filter(
      (item) => item.category === "lure" && (item.playerUse?.fishIds || []).length > 0
    );
  }
  function expectedFishIds(lures) {
    return new Set(lures.flatMap((item) => item.playerUse.fishIds || []));
  }
  function pairItems(first, second) {
    return [first, second].sort((a, b) => {
      const maskA = Number.parseInt(a.decodedFields?.fishHookGateMaskHex || "0", 16);
      const maskB = Number.parseInt(b.decodedFields?.fishHookGateMaskHex || "0", 16);
      return maskB - maskA || a.id.localeCompare(b.id);
    });
  }
  function pairKey(items) {
    return items.map((item) => item.id).join("+");
  }
  function isFullCoverage(items, expected) {
    const covered = new Set(items.flatMap((item) => item.playerUse.fishIds || []));
    return covered.size === expected.size && [...expected].every((id) => covered.has(id));
  }
  function makePair(items, coverageCount) {
    const orderedItems = pairItems(...items);
    return {
      items: orderedItems,
      key: pairKey(orderedItems),
      totalYen: orderedItems.reduce((sum, item) => sum + Number(item.priceYen), 0),
      coverageCount
    };
  }
  function pairOrder(first, second) {
    const priceDifference = first.totalYen - second.totalYen;
    if (priceDifference) return priceDifference;
    const firstPreference = PREFERRED_PAIR_ORDER.get(first.key) ?? Infinity;
    const secondPreference = PREFERRED_PAIR_ORDER.get(second.key) ?? Infinity;
    return firstPreference - secondPreference || first.key.localeCompare(second.key);
  }
  function lureCoverageOptions(items) {
    const lures = luresWithFishProfiles(items);
    const expected = expectedFishIds(lures);
    const pairs = [];
    for (let first = 0; first < lures.length; first += 1) {
      for (let second = first + 1; second < lures.length; second += 1) {
        const pair = pairItems(lures[first], lures[second]);
        if (pair.every((item) => Number.isFinite(item.priceYen)) && isFullCoverage(pair, expected))
          pairs.push(makePair(pair, expected.size));
      }
    }
    return { coverageCount: expected.size, pairs: pairs.sort(pairOrder) };
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
      return { summary: fishMealSummary(ctx.lang), facts: fishMealFacts(ctx.lang) };
    }
    return null;
  }
  function visibleUsage(ctx, item, allItems = [], fishVisuals = {}) {
    const use = item.playerUse || {};
    const foodDecision = foodAreaDecision(ctx.lang, item, ctx.selectedStage);
    if (foodDecision) return { summary: foodDecision.summary, facts: use.facts?.[ctx.lang] || [] };
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
    const facts2 = use.specialResponseTarget ? [] : use.facts?.[ctx.lang] || use.facts?.en || [];
    return { summary: ctx.local(use.summary) || "", facts: facts2 };
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
    const categories2 = ["lure", "fly", "bait", "float_weight", "general_tool"];
    if (!categories2.includes(item.category) || !ids.length && !routeKeys.length) return "";
    const copy5 = steeringCopy(ctx);
    const heading = steering ? copy5.title : rigRoute ? ctx.copy[`${rigRoute}FishHeading`] : ctx.copy.fish;
    const groups = renderCompatibilityGroups(ctx, routes, routeKeys, ids, fishVisuals, fishLocations);
    const accepted = targetAccepted(ctx, routes, routeKeys, ids);
    const status = ctx.selectedFish ? rigRoute ? routeTargetStatus(ctx, rigRoute, accepted) : targetStatus(ctx, routes, accepted, steering, copy5) : "";
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
  function locationPinNote(ctx, loc, text5) {
    if (loc.kind === "runtime_net_use") {
      if (ctx.lang === "th") return "รูปแมลงน้ำชี้ช่องที่ทดลองใช้ตาข่ายสำเร็จ";
      if (ctx.lang === "ja") return "カワムシ画像はアミ使用に成功したタイルを示す。";
      return "The aquatic insect portrait marks the successfully tested net tile.";
    }
    return loc.forage ? text5.forage : text5.pin;
  }
  function locationMarkerLink(ctx, marker, item, loc, stage) {
    if (isCurrentItem(marker, item)) return loc.image;
    const returnRoute = loc.forage ? ctx.foragePointReturn(stage, loc.context) : "";
    return ctx.areaItemLink(marker, stage, "", returnRoute);
  }
  function locationVisual(ctx, loc, item, markers, stage, text5) {
    if (!loc.image || !loc.pin) return "";
    const markerLinks = markers.map((marker) => {
      const current = isCurrentItem(marker, item);
      const target = current ? ' target="_blank" rel="noopener"' : "";
      const label = current ? text5.open : ctx.imageName(marker);
      return `<a href="${ctx.esc(locationMarkerLink(ctx, marker, item, loc, stage))}"${target} aria-label="${ctx.esc(label)}"><img src="${ctx.esc(marker.image)}" alt="${ctx.esc(ctx.imageName(marker))}"></a>`;
    }).join("");
    const note = locationPinNote(ctx, loc, text5);
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
  function renderEntranceGuide(ctx, item, loc, text5) {
    const approach = loc.approach;
    if (!approach) return "";
    const pin = `<span class="tool-use-pin" style="left:${approach.pin.x * 100}%;top:${approach.pin.y * 100}%"><a href="${ctx.esc(approach.image)}" target="_blank" rel="noopener"><img src="${ctx.esc(item.image)}" alt="${ctx.esc(ctx.imageName(item))}"></a></span>`;
    const map = `<div class="tool-use-map" style="aspect-ratio:${approach.width}/${approach.height}"><img class="tool-use-ground" src="${ctx.esc(approach.image)}" alt="${ctx.esc(entranceTitle(ctx))}">${pin}</div>`;
    const full = `<a href="${ctx.esc(approach.fullImage)}" target="_blank" rel="noopener">${ctx.esc(text5.full)} ↗</a>`;
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
  function fullImageLabel(ctx, loc, text5) {
    if (loc.context !== "town") return text5.full;
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
  function locationCoordinates(ctx, loc, text5) {
    const tile = `<p>X ${ctx.esc(loc.tileX)}, Y ${ctx.esc(loc.tileY)}</p>`;
    if (!loc.useWindow) return tile;
    const { xMin, xMax, yMin, yMax } = loc.useWindow;
    return `${tile}<p>${ctx.esc(text5.window)} X ${xMin}–${xMax}, Y ${yMin}–${yMax}</p>`;
  }
  function locationImageLinks(ctx, loc, text5) {
    const image = loc.image ? `<a href="${ctx.esc(loc.image)}" target="_blank" rel="noopener">${ctx.esc(text5.open)} ↗</a>` : "";
    const full = loc.fullImage ? ` · <a href="${ctx.esc(loc.fullImage)}" target="_blank" rel="noopener">${ctx.esc(fullImageLabel(ctx, loc, text5))} ↗</a>` : "";
    const capture = loc.runtimeImage ? ` · <a href="${ctx.esc(loc.runtimeImage)}" target="_blank" rel="noopener">${ctx.esc(ctx.local(loc.runtimeCaption))} ↗</a>` : "";
    return `${image}${full}${capture}`;
  }
  function locationDescription(ctx, loc) {
    return ctx.esc(ctx.local(loc.description) || ctx.local(loc.name) || "");
  }
  function locationEntry(ctx, item, loc, fishLocations, allItems, text5) {
    const stage = Number(loc.stage) || 0;
    const markers = locationMarkerItems(loc, item, allItems);
    const visual = locationVisual(ctx, loc, item, markers, stage, text5);
    const stageName2 = stage ? `${ctx.copy.area(stage)} · ${ctx.stageName(stage, fishLocations)}` : "";
    const action = loc.action ? `<p class="acquisition-action">${ctx.esc(ctx.local(loc.action))}</p>` : "";
    const content = [
      entranceLabel(ctx, loc),
      renderRequirement(ctx, loc, item, allItems),
      renderReward(ctx, loc, item, allItems),
      action,
      `<p>${locationDescription(ctx, loc)}</p>`,
      visual,
      locationCoordinates(ctx, loc, text5),
      locationImageLinks(ctx, loc, text5),
      renderEntranceGuide(ctx, item, loc, text5)
    ].join("");
    return `<article class="detail-section" ${locationAnchor(loc, stage)}><h3>${ctx.esc(stageName2 + townLabel(ctx, loc))}</h3>${content}</article>`;
  }
  function locationCards(ctx, item, locations, fishLocations, allItems, text5) {
    if (!locations.length) return "";
    const cards = locations.map((loc) => locationEntry(ctx, item, loc, fishLocations, allItems, text5)).join("");
    const layout = locations.length === 1 ? "single-location" : "";
    return `<div class="detail-grid tool-location-grid ${layout}">${cards}</div>`;
  }
  function groupedMagnetLocations(ctx, item, locations, fishLocations, allItems, text5) {
    const current = locations.filter((loc) => Number(loc.stage) === Number(ctx.selectedStage));
    const others = locations.filter((loc) => Number(loc.stage) !== Number(ctx.selectedStage));
    const label = ctx.lang === "th" ? "ดูจุดออกในด่านอื่น" : ctx.lang === "ja" ? "他エリアの出口を見る" : "See exits in other areas";
    return locationCards(ctx, item, current, fishLocations, allItems, text5) + (others.length ? `<details class="magnet-other-exits"><summary>${ctx.esc(label)} · ${others.length}</summary>${locationCards(ctx, item, others, fishLocations, allItems, text5)}</details>` : "");
  }
  function useLocationSection(ctx, item, fishLocations, allItems) {
    const locations = item.playerUse?.useLocations || [];
    if (!locations.length) return "";
    const text5 = locationCopy(ctx);
    const grouped = item.category === "general_tool" && item.id === "0E" && Number(ctx.selectedStage) >= 1 && Number(ctx.selectedStage) <= 6;
    const cards = grouped ? groupedMagnetLocations(ctx, item, locations, fishLocations, allItems, text5) : locationCards(ctx, item, locations, fishLocations, allItems, text5);
    return `<section class="detail-section locations-section" id="use-locations"><h2>${ctx.esc(ctx.copy.useLocations)}</h2>${cards}</section>`;
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
    const selectedStage2 = Number(ctx.selectedStage);
    const linkStage = group.stages.some((stage) => Number(stage) === selectedStage2) ? selectedStage2 : Number(group.stages[0]);
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

  // src/features/food-availability/index.js
  function foodAreaMarker(lang, item, stage) {
    const decision = foodAreaDecision(lang, item, stage);
    return decision ? ` data-food-area-availability="${decision.stage}" data-stock="${decision.stocked ? "available" : "missing"}"` : "";
  }
  function foodAreaAction(ctx, item, stage, returnPath) {
    const decision = foodAreaDecision(ctx.lang, item, stage);
    if (!decision || decision.stocked) return "";
    const query = new URLSearchParams({ category: "food", stage: String(decision.stage) });
    if (returnPath) query.set("return", returnPath);
    const page = `index${ctx.lang === "en" ? "" : `.${ctx.lang}`}.html`;
    const label = ctx.lang === "th" ? `เลือกอาหารที่ซื้อได้ในด่าน ${decision.stage}` : ctx.lang === "ja" ? `エリア${decision.stage}で買える食料を選ぶ` : `Choose food sold in Area ${decision.stage}`;
    return `<p><a data-local-food-choice href="${ctx.esc(`${page}?${query}#category-decisions`)}">${ctx.esc(label)} ↗</a></p>`;
  }

  // src/pages/item/magnet-next-action.js
  var copy2 = {
    th: {
      title: "ด่าน 6 ใช้แม่เหล็กแล้วไม่บอกทิศ: ทำอะไรต่อ?",
      action: "ยังไม่ต้องซื้อแม่เหล็กเพิ่ม ใช้แผนที่เลือกปลาและจุดตกได้เลยระหว่างตรวจความคืบหน้าเรื่องราว",
      notebook: "รวมจำนวนจากสมุดเกมทั้ง 6 หน้า ต้องบันทึกอย่างน้อย 65 ชนิดที่ต่างกันจาก 66 ชนิด ไม่ใช่ตก 65 ครั้ง และยังมีเงื่อนไขเรื่องราวอีกด้วย ครบ 65 ชนิดอย่างเดียวจึงไม่รับประกันว่าจะบอกทิศ",
      checklist: "เทียบชื่อปลากับเช็กลิสต์สมุด",
      map: "เลือกจุดตกด่าน 6 บนแผนที่",
      postcard: "หลังเทียบสมุด ให้อ่านไปรษณียบัตรที่ได้รับ (06) ในเกม ถ้าข้อความหมอขอปลาไหลใหญ่ปรากฏ การอ่านครั้งนั้นจะเปิดทิศแม่เหล็กด่าน 6 ถ้ายังไม่ปรากฏ เงื่อนไขเรื่องราวอาจยังไม่ครบ",
      mail: "ดูคำแนะนำไปรษณียบัตรและจุดปลาไหลใหญ่",
      evidence: "เงื่อนไขที่ยืนยันและสิ่งที่ยังต้องค้นคว้า",
      limit: "ROM ยืนยันจำนวนช่องสมุดและเงื่อนไขเรื่องราว แต่ยังไม่มีลำดับการเล่นตามปกติที่ยืนยันครบเพื่อเปิดเงื่อนไขนั้น เช็กลิสต์เว็บไม่อ่านเซฟเกมและไม่ปลดล็อกเกม",
      source: "อ่านหลักฐานเงื่อนไขเรื่องราว",
      noticeSource: "หลักฐานการอ่านไปรษณียบัตร",
      general: "วิธีใช้แม่เหล็กทั่วไปและคำแนะนำซื้อ"
    },
    en: {
      title: "No Magnet heading in Area 6: what next?",
      action: "Do not buy another Magnet yet. Use the map to choose fish and fishing spots while checking story progress.",
      notebook: "Add the counts on all six in-game notebook pages. At least 65 distinct species records out of 66 are required, not 65 catches. A story prerequisite is also required, so 65 records alone do not guarantee a heading.",
      checklist: "Compare fish names with the notebook checklist",
      map: "Choose Area 6 fishing spots on the map",
      postcard: "After checking the notebook, read Received postcard 06 in the game. If the doctor’s giant-eel request appears, that read enables the Area 6 Magnet heading. If it does not appear, the story prerequisite may still be missing.",
      mail: "See postcard guidance and the giant-eel point",
      evidence: "Verified conditions and remaining research",
      limit: "ROM evidence establishes the notebook count and story gate, but a complete ordinary-play sequence to unlock the prerequisite is not yet verified. The web checklist does not read your save or unlock the game.",
      source: "Read the story-gate evidence",
      noticeSource: "Postcard reader evidence",
      general: "General Magnet use and buying advice"
    },
    ja: {
      title: "エリア6で磁石が方角を示さないときは？",
      action: "磁石をもう一つ買う必要はまだありません。物語の進行を確認する間も、地図で魚と釣り場を選べます。",
      notebook: "ゲーム内の図鑑6ページの数を合計してください。66種類のうち異なる65種類以上の記録が必要です。65回釣るという意味ではありません。物語の前提条件もあるため、65種類だけで方角が出るとは限りません。",
      checklist: "図鑑チェックリストと魚名を照合する",
      map: "地図でエリア6の釣り場を選ぶ",
      postcard: "図鑑を確認したら、ゲーム内で受け取ったハガキ06を読んでください。医者のオオウナギ依頼が出たとき、その読み取りでエリア6の磁石の方角表示が有効になります。出ない場合、物語の前提条件がまだ足りない可能性があります。",
      mail: "ハガキの案内とオオウナギの地点を見る",
      evidence: "確認した条件と未解決点",
      limit: "ROMで図鑑の数と物語の条件を確認していますが、前提条件を解除する通常プレイの全手順は未検証です。ウェブのチェックリストはセーブを読み取らず、ゲームの条件も解除しません。",
      source: "物語条件の根拠を読む",
      noticeSource: "ハガキ読み取りの根拠",
      general: "磁石の基本操作と購入の目安"
    }
  };
  function returnQuery(ctx) {
    const query = new URLSearchParams({ stage: "6" });
    const returned = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returned) query.set("return", returned);
    return query;
  }
  function generalUse(ctx, item, c) {
    const summary = ctx.local(item.playerUse?.summary) || "";
    const facts2 = item.playerUse?.facts?.[ctx.lang] || [];
    const note = item[`imageNote${ctx.lang === "th" ? "Th" : ctx.lang === "ja" ? "Ja" : "En"}`] || "";
    return `<details class="magnet-general-use"><summary>${ctx.esc(c.general)}</summary><p>${ctx.esc(summary)}</p><ul>${facts2.map((fact) => `<li>${ctx.esc(fact)}</li>`).join("")}</ul><p class="muted">${ctx.esc(note)}</p></details>`;
  }
  function magnetNextAction(ctx, item, allItems) {
    if (item.category !== "general_tool" || item.id !== "0E" || Number(ctx.selectedStage) !== 6)
      return "";
    const c = copy2[ctx.lang] || copy2.en;
    const query = returnQuery(ctx);
    const map = `${ctx.mapsPage[ctx.lang]}?${query}`;
    const postcard = allItems.find(
      (candidate) => candidate.category === "general_tool" && candidate.id === "06"
    );
    const mailQuery = returnQuery(ctx);
    mailQuery.set("category", "general_tool");
    mailQuery.set("id", "06");
    const mail = postcard ? `<p>${ctx.esc(c.postcard)}</p><a class="route-button" data-magnet-mail href="${ctx.esc(ctx.localePage[ctx.lang] + "?" + mailQuery)}">${ctx.esc(c.mail)} ↗</a>` : "";
    return `<section id="what-to-do" class="decision-panel magnet-next-action" data-magnet-next-action><h2>${ctx.esc(c.title)}</h2><p><strong>${ctx.esc(c.action)}</strong></p><p>${ctx.esc(c.notebook)}</p><p><a class="route-button" data-magnet-notebook href="${ctx.esc(map + "#notebook-guide")}">${ctx.esc(c.checklist)} ↗</a></p><p><a class="route-button" data-magnet-map href="${ctx.esc(map + "#map-view")}">${ctx.esc(c.map)} ↗</a></p>${mail}${generalUse(ctx, item, c)}<details class="magnet-story-evidence"><summary>${ctx.esc(c.evidence)}</summary><p>${ctx.esc(c.limit)}</p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/magnet-story-gate-research.md">${ctx.esc(c.source)} ↗</a><br><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/quest-tool-use-research.md">${ctx.esc(c.noticeSource)} ↗</a></details></section>`;
  }

  // src/pages/item/fly-price-choice.js
  var categories = ["fly", "fly_wing", "fly_tail"];
  var copy3 = {
    th: {
      title: "ซื้อสำเร็จรูปหรือประกอบเอง?",
      contribution: (price) => `ชิ้นนี้เพิ่ม ${price} เยนในราคาฟลายที่ประกอบเอง`,
      rule: "ร้านประกอบคิดราคาบอดี้ + ปีก + หาง ไม่ต้องซื้อชิ้นส่วนแยก เลือก “ไม่มี” คิด 0 เยน ตรวจราคาสุทธิก่อนจ่ายและเหลือช่องเก็บฟลายด้วย",
      composition: (ids) => `ชุด ${ids}`,
      ready: (stage, price) => `สำเร็จรูปด่าน ${stage}: ¥${price}`,
      custom: (area, price) => `ประกอบชุดนี้ในเมนูที่ตรวจแล้ว ด่าน ${area}: ¥${price}`,
      cheaper: (saving) => `ถ้าต้องการชิ้นส่วนชุดนี้ ซื้อสำเร็จรูปประหยัด ${saving} เยน ประกอบเองเมื่ออยากเปลี่ยนชิ้นส่วน`,
      equal: "ราคาเท่ากัน ถ้าต้องการชุดนี้เลือกสำเร็จรูปได้เลย ประกอบเองเมื่ออยากเปลี่ยนชิ้นส่วน",
      diy: (saving) => `ประกอบชุดนี้เองประหยัด ${saving} เยน หากเข้าถึงเมนูที่ระบุได้`,
      shop: "ดูร้านและชิ้นส่วนชุดสำเร็จรูป",
      menu: "ดูตำแหน่งชิ้นนี้ในเมนูประกอบ",
      evidence: "หลักฐานราคาและขอบเขตการเปรียบเทียบ",
      limit: "เทียบรหัสชิ้นส่วนชุดเดียวกันและราคา ไม่ใช่อันดับโอกาสกัดหรือจับสำเร็จ เมนูที่ตรวจอาจอยู่คนละด่านกับร้านสำเร็จรูป จึงไม่ได้หมายความว่าประกอบชุดนี้ได้ในทุกร้าน",
      sources: "อ่านวิธีคิดราคาจาก ROM"
    },
    en: {
      title: "Ready-made or custom fly?",
      contribution: (price) => `This component adds ¥${price} to a custom fly quote`,
      rule: "The maker charges body + wing + tail; you do not buy loose parts first. None adds ¥0. Check the final quote and keep a free fly slot.",
      composition: (ids) => `Composition ${ids}`,
      ready: (stage, price) => `Ready-made in Area ${stage}: ¥${price}`,
      custom: (area, price) => `Make these parts in the verified Area ${area} menu: ¥${price}`,
      cheaper: (saving) => `For these exact parts, buy ready-made to save ¥${saving}. Customize when you want different parts.`,
      equal: "The prices match. Buy ready-made for these parts; customize when you want different parts.",
      diy: (saving) => `Making these parts saves ¥${saving}, if you can reach the listed menu.`,
      shop: "See ready-made shops and components",
      menu: "Find this part in the maker menu",
      evidence: "Price evidence and comparison limits",
      limit: "This compares identical component IDs and prices, not bite or landing odds. The verified maker menu may be in a different area from the ready-made shop; this does not establish availability in every maker.",
      sources: "Read the ROM pricing research"
    },
    ja: {
      title: "既製フライと自作、どちらを選ぶ？",
      contribution: (price) => `この部品は自作フライの見積額に${price}円を加える`,
      rule: "自作の料金はボディ＋ウイング＋テールの合計。部品を先に購入する必要はない。「なし」は0円。支払う前に見積額とフライの空き枠を確認する。",
      composition: (ids) => `構成 ${ids}`,
      ready: (stage, price) => `エリア${stage}の既製品：${price}円`,
      custom: (area, price) => `確認済みのエリア${area}のメニューで自作：${price}円`,
      cheaper: (saving) => `同じ部品の組み合わせなら既製品で${saving}円節約。部品を変えたいときに自作する。`,
      equal: "料金は同じ。この組み合わせなら既製品を選べる。部品を変えたいときに自作する。",
      diy: (saving) => `記載のメニューに行けるなら、自作で${saving}円節約できる。`,
      shop: "既製品の店と部品を見る",
      menu: "自作メニューでこの部品を探す",
      evidence: "料金の根拠と比較の範囲",
      limit: "同じ部品IDと料金の比較であり、食いつきや取り込み成功率の順位ではない。確認した自作メニューと既製品の店は別エリアの場合がある。すべての店で作れることは示していない。",
      sources: "ROMの料金調査を読む"
    }
  };
  function verifiedMenu(item) {
    const choice = item?.flyMakerMenuChoice;
    if (!item || !choice) return false;
    return choice?.id === item.id && choice.category === item.category && Number.isInteger(choice.area) && choice.area >= 1 && choice.area <= 6 && typeof choice.familyJa === "string" && choice.familyJa.length > 0;
  }
  function verifiedQuote(bundle, allItems) {
    if (!bundle.body || bundle.body === "00") return null;
    const refs = [
      ["fly", bundle.body],
      ["fly_wing", bundle.wing],
      ["fly_tail", bundle.tail]
    ];
    const parts = refs.filter(([, id]) => id !== "00").map(([category, id]) => allItems.find((item) => item.category === category && item.id === id));
    if (!parts.length || parts.some(
      (part) => !verifiedMenu(part) || !Number.isFinite(part.priceYen) || part.priceYen < 0
    ))
      return null;
    const menu = parts[0].flyMakerMenuChoice;
    if (parts.some(
      (part) => part.flyMakerMenuChoice.area !== menu.area || part.flyMakerMenuChoice.familyJa !== menu.familyJa
    ))
      return null;
    if (menu.familyJa === "テレストリアル" && (bundle.wing !== "00" || bundle.tail !== "00"))
      return null;
    return {
      area: menu.area,
      price: Math.min(
        1e4,
        parts.reduce((sum, part) => sum + part.priceYen, 0)
      )
    };
  }
  function comparisonMarkup(ctx, assembly, allItems, c) {
    const quote = verifiedQuote(assembly.bundle, allItems);
    const ready = assembly.bundle.shopPriceYen;
    if (!quote || !Number.isFinite(ready) || ready < 0) return "";
    const saving = quote.price - ready;
    const decision = saving > 0 ? c.cheaper(saving) : saving === 0 ? c.equal : c.diy(-saving);
    const ids = [assembly.bundle.body, assembly.bundle.wing, assembly.bundle.tail].join(" / ");
    return `<article class="detail-section" data-fly-price-comparison="${ctx.esc(ids)}"><h3>${ctx.esc(c.composition(ids))}</h3><p><strong>${ctx.esc(c.ready(assembly.stage, ready))}</strong><br>${ctx.esc(c.custom(quote.area, quote.price))}</p><p class="rod-verdict">${ctx.esc(decision)}</p><a class="route-button" href="#fly-purchases">${ctx.esc(c.shop)} ↘</a></article>`;
  }
  function flyPriceChoice(ctx, item, allItems) {
    if (!categories.includes(item.category) || !verifiedMenu(item) || !Number.isFinite(item.priceYen) || item.priceYen < 0)
      return "";
    const c = copy3[ctx.lang] || copy3.en;
    const comparisons = flyAssemblies(ctx, item, allItems).map((assembly) => comparisonMarkup(ctx, assembly, allItems, c)).join("");
    return `<section id="fly-price-choice" class="detail-section fly-price-choice" data-fly-price-choice="${ctx.esc(item.category)}:${ctx.esc(item.id)}"><h2>${ctx.esc(c.title)}</h2><p><strong>${ctx.esc(c.contribution(item.priceYen))}</strong></p><p>${ctx.esc(c.rule)}</p>${comparisons ? `<div class="detail-grid">${comparisons}</div>` : ""}<a class="route-button" href="#fly-menu-position">${ctx.esc(c.menu)} ↘</a><details class="fly-price-evidence"><summary>${ctx.esc(c.evidence)}</summary><p>${ctx.esc(c.limit)}</p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fly-maker-menu-research.md">${ctx.esc(c.sources)} ↗</a></details></section>`;
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
      return text3(ctx, {
        th: `ผ่านเงื่อนไขลัวร์สำหรับ${fish}`,
        ja: `${fish}のルアー判定に適合`,
        en: `Passes the lure check for ${fish}`
      });
    return text3(ctx, {
      th: `ผ่านเงื่อนไขเหยื่อสำหรับ${fish} · ${routeName(ctx, route)}`,
      ja: `${fish}のエサ判定に適合 · ${routeName(ctx, route)}`,
      en: `Passes the bait check for ${fish} · ${routeName(ctx, route)}`
    });
  }
  function text3(ctx, values) {
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
    const heading = advice.currentStock?.available ? text3(ctx, {
      th: "ตัวเลือกที่ถูกกว่าซึ่งผ่านเงื่อนไขปลาและมีขายในด่านนี้",
      ja: "この魚の判定を通り、エリア内で買える安い候補",
      en: "Cheaper local offers that pass this fish check"
    }) : text3(ctx, {
      th: "ตัวเลือกที่มีขายในด่านนี้และผ่านเงื่อนไขปลา",
      ja: "エリア内で販売され、この魚の判定を通る候補",
      en: "Local offers that pass this fish check"
    });
    return `<p>${ctx.esc(heading)}</p><ul>${advice.alternatives.map((offer) => alternativeLink(ctx, offer)).join("")}</ul>`;
  }
  function noAreaDecision(ctx) {
    return text3(ctx, {
      th: "มีของชิ้นนี้อยู่แล้วใช้ต่อได้ เลือกด่านจากแผนที่เพื่อดูว่ามีขายอะไรและราคาเท่าไร",
      ja: "所持していれば使用できます。地図でエリアを選ぶと、店頭在庫と価格を確認できます。",
      en: "Use it if you already own it. Choose an area on the map to check local stock and prices."
    });
  }
  function absentStockDecision(ctx, advice) {
    if (advice.alternatives.length)
      return text3(ctx, {
        th: "ถ้ามีชิ้นนี้อยู่แล้วใช้ต่อได้ ชิ้นนี้ไม่มีรายการขายในด่านนี้; ถ้าจะซื้อใหม่ ให้เลือกตัวเลือกด้านล่าง",
        ja: "所持していればそのまま使えます。この品はエリア内の在庫記録がありません。新しく買うなら下記の候補を選べます。",
        en: "Keep using it if owned. This item has no recorded stock in this area; for a new purchase, choose a compatible offer below."
      });
    return text3(ctx, {
      th: "ชิ้นนี้ไม่มีรายการขายในด่านนี้; ถ้ามีอยู่แล้วใช้ต่อได้ หรือดูร้านในด่านอื่น",
      ja: "この品はエリア内の在庫記録がありません。所持品は使えます。別エリアの店を確認してください。",
      en: "This item has no recorded stock in this area. Use it if owned, or check another area’s shops."
    });
  }
  function conditionalStockDecision(ctx, stage, stock) {
    return text3(ctx, {
      th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen} แต่${conditionText(ctx, stock.condition)}`,
      ja: `エリア${stage}で${stock.priceYen}円で販売。ただし${conditionText(ctx, stock.condition)}`,
      en: `Stocked in area ${stage} for ¥${stock.priceYen}, but ${conditionText(ctx, stock.condition)}.`
    });
  }
  function cheapestStockDecision(ctx, stage, stock) {
    return text3(ctx, {
      th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen}; ถ้าจะซื้อ ชิ้นนี้เป็นหนึ่งในตัวเลือกที่ถูกที่สุดซึ่งผ่านเงื่อนไขปลาในสต็อกที่ตรวจได้`,
      ja: `エリア${stage}で${stock.priceYen}円。このエリアで確認できた魚判定を通る在庫品の最安候補の一つです。`,
      en: `Stocked in area ${stage} for ¥${stock.priceYen}; it is one of the cheapest recorded local offers passing this fish check.`
    });
  }
  function compareStockDecision(ctx, stage, stock) {
    return text3(ctx, {
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
  function targetAdviceScope(ctx) {
    return text3(ctx, {
      th: "ยืนยันเฉพาะเงื่อนไขจาก ROM ไม่ได้ยืนยันโอกาสกินเหยื่อหรือจับขึ้น",
      ja: "ROM条件を通ることのみ確認。食いつき・釣り上げは保証されません。",
      en: "This confirms the ROM compatibility check only; a bite or catch is not guaranteed."
    });
  }
  function renderTargetAdvice(ctx, item, fish, { includeScope = true } = {}) {
    const advice = targetAdvice(ctx, item, fish);
    if (!advice) return "";
    const fishName2 = ctx.fishName(fish);
    const status = compatibilityText(ctx, fishName2, advice.route);
    const scope = includeScope ? `<small>${ctx.esc(targetAdviceScope(ctx))}</small>` : "";
    const markers = `data-target-advice data-target-fish="${ctx.esc(fish)}" data-target-route="${advice.route}" data-target-stage="${advice.stage || ""}"`;
    return `<div class="target-advice" ${markers}><p class="target-compatibility"><strong>${ctx.esc(status)}</strong></p><p>${ctx.esc(shopDecision(ctx, advice))}</p>${alternativeList(ctx, advice)}${scope}</div>`;
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

  // src/pages/item/fly-maker-access.js
  var COPY3 = {
    th: {
      title: (stage) => `ไปประกอบที่เมืองด่าน ${stage}`,
      body: (a) => `เข้าเมืองจากทางเข้าลำดับที่ ${a.entrance.ordinal + 1} บนแผนที่ด่าน (X${a.entrance.fieldTile.x},Y${a.entrance.fieldTile.y}) จะมาถึง X${a.entrance.townArrival.x},Y${a.entrance.townArrival.y} ในเมือง จากนั้นหาคนทำฟลายที่ X${a.makerTile.x},Y${a.makerTile.y} เลือกตระกูลนี้แล้วเลือกชิ้นส่วนตามภาพด้านล่าง ไม่ต้องซื้อชิ้นส่วนไปก่อน เหลือช่องฟลายว่างและตรวจราคาสุทธิก่อนจ่าย`,
      link: "ดูทางเข้าเมืองและตำแหน่งคนทำฟลาย",
      limit: "ตำแหน่งและตระกูลเมนูมาจาก ROM ยังไม่ได้ทดลองเดินเส้นทางนี้หรือยืนยันขั้นตอนเนื้อเรื่องเพื่อเข้าด่านที่ระบุ"
    },
    en: {
      title: (stage) => `Make this at the Area ${stage} town fly maker`,
      body: (a) => `Use town entrance ${a.entrance.ordinal + 1} on the area map (X${a.entrance.fieldTile.x},Y${a.entrance.fieldTile.y}), arriving at town X${a.entrance.townArrival.x},Y${a.entrance.townArrival.y}. Find the fly maker at X${a.makerTile.x},Y${a.makerTile.y}, choose this family, then select parts using the pictures below. You do not need to buy loose components first. Keep a free fly slot and check the final quote before paying.`,
      link: "Show town entrance and fly-maker location",
      limit: "Location and menu families are established from ROM code. This walking route and story progression into the specified area have not been replayed."
    },
    ja: {
      title: (stage) => `エリア${stage}の町の毛バリ職人で作成する`,
      body: (a) => `屋外の町入口${a.entrance.ordinal + 1}（X${a.entrance.fieldTile.x},Y${a.entrance.fieldTile.y}）から入り、町のX${a.entrance.townArrival.x},Y${a.entrance.townArrival.y}に到着します。X${a.makerTile.x},Y${a.makerTile.y}の毛バリ職人に話し、この系統を選んで下の画像どおり部品を選択します。部品の事前購入は不要です。フライ欄に空きを残し、支払前に見積額を確認してください。`,
      link: "町入口と毛バリ職人の場所を見る",
      limit: "場所とメニュー系統はROMのコードで確認しています。この歩行経路と対象エリアに至るストーリー進行は再現していません。"
    }
  };
  function flyMakerAccess(ctx, item) {
    const choice = item.flyMakerMenuChoice;
    const access = choice?.availableAccess?.find((entry) => entry.stage === Number(ctx.selectedStage)) || choice?.access;
    if (!access || ![1, 2, 3].includes(access.stage)) return "";
    const text5 = COPY3[ctx.lang] || COPY3.en;
    const query = new URLSearchParams({
      stage: String(access.stage),
      place: "town",
      maker: "1",
      entrance: String(access.entrance.ordinal)
    });
    if (ctx.selectedFish) query.set("fish", ctx.selectedFish);
    const route = ctx.selectedRoute || ctx.params?.get("route");
    if (["float", "sinker", "lure", "fly"].includes(route)) query.set("route", route);
    query.set("return", ctx.currentLocalRoute());
    const suffix = ctx.lang === "en" ? "" : `.${ctx.lang}`;
    const href = `shops${suffix}.html?${query}#fly-maker-location`;
    return `<aside class="detail-section" data-fly-maker-access><h3>${ctx.esc(text5.title(access.stage))}</h3><p>${ctx.esc(text5.body(access))}</p><a class="route-button" data-fly-maker-location-link href="${ctx.esc(href)}">${ctx.esc(text5.link)} ↗</a><details><summary>${ctx.esc(ctx.lang === "th" ? "หลักฐานและขอบเขต" : ctx.lang === "ja" ? "根拠と確認範囲" : "Evidence and limits")}</summary><p>${ctx.esc(text5.limit)}</p><a href="${ctx.esc(readableEvidenceHref(access.evidenceHref))}">ROM ↗</a></details></aside>`;
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
  function instructionsFor(copy5, row, column) {
    return [column > 1 ? copy5.right(column - 1) : "", row > 1 ? copy5.down(row - 1) : "", copy5.confirm].filter(Boolean).join(" → ");
  }
  function otherFamilyCopy(lang, choice) {
    const copy5 = otherFamilies[lang] || otherFamilies.en;
    const family = copy5.family[choice.familyJa] || choice.familyJa;
    const area = choice.area || 1;
    return {
      ...mayfly[lang],
      scope: choice.controlledFixture && !choice.access ? copy5.controlledScope(family, choice.familyJa) : copy5.scope(area, family, choice.familyJa),
      limit: choice.controlledFixture ? copy5.controlledLimit : copy5.limit(area, family),
      none: copy5.none,
      directQuote: copy5.directQuote
    };
  }
  function nonePositionInstructions(copy5, choice, lang) {
    const row = choice.nonePosition?.row;
    const column = choice.nonePosition?.column;
    if (!row || !column) return "";
    const movement = [
      column > 1 ? copy5.right(column - 1) : "",
      row > 1 ? copy5.down(row - 1) : "",
      copy5.confirm
    ].filter(Boolean).join(" → ");
    const part = choice.part === "wing" ? { en: "wing", ja: "ウィング", th: "ปีก" } : { en: "tail", ja: "テール", th: "หาง" };
    return copy5.none(part[lang], movement);
  }
  function flyMenuPosition(ctx, item) {
    const choice = item.flyMakerMenuChoice;
    if (!choice) return "";
    const lang = ctx.lang in mayfly ? ctx.lang : "en";
    const isMayfly = !choice.familyJa || choice.familyJa === "メイフライ";
    const copy5 = isMayfly ? mayfly[lang] : otherFamilyCopy(lang, choice);
    const instructions = instructionsFor(copy5, choice.row, choice.column);
    const position = copy5.position(choice.row, choice.column);
    const scope = choice.access ? copy5.scope.replace(/^(?:Area \d+|ร้านด่าน \d+|エリア\d+) · /, "") : copy5.scope;
    const noneInstructions = isMayfly && choice.part === "tail" ? `<p class="fly-menu-none-tail">${ctx.esc(copy5.noneTail)}</p>` : choice.nonePosition ? `<p class="fly-menu-none-tail">${ctx.esc(nonePositionInstructions(copy5, choice, lang))}</p>` : "";
    const nextStep = choice.nextStep === "quote" ? `<p class="fly-menu-next-step rod-verdict">${ctx.esc(copy5.directQuote)}</p>` : "";
    return `<section id="fly-menu-position" class="detail-section fly-menu-position" data-fly-menu-position="${ctx.esc(item.category)}:${ctx.esc(item.id)}"><h2>${ctx.esc(copy5.title)}</h2><p>${ctx.esc(scope)}</p>${flyMakerAccess(ctx, item)}<p><strong>${ctx.esc(position)}</strong> · ${ctx.esc(copy5.start)}</p><p class="rod-verdict">${ctx.esc(instructions)}</p>${noneInstructions}${nextStep}<figure><a href="${ctx.esc(choice.image)}" target="_blank" rel="noopener"><img src="${ctx.esc(choice.image)}" alt="${ctx.esc(position)}" width="256" height="224" loading="lazy"></a><figcaption>${ctx.esc(copy5.caption)}</figcaption></figure><details><summary>${ctx.esc(copy5.evidence)}</summary><p>${ctx.esc(copy5.limit)}</p><a href="${ctx.esc(readableEvidenceHref(choice.evidenceHref))}">${ctx.esc(copy5.notes)} ↗</a></details></section>`;
  }

  // src/pages/item/bait-acquisition.js
  var copy4 = {
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
    const text5 = copy4[ctx.lang] || copy4.en;
    const stage = String(ctx.selectedStage || 1);
    const suffix = ctx.lang === "en" ? "" : `.${ctx.lang}`;
    const query = new URLSearchParams({ stage, place: "town", entrance: "1" });
    if (ctx.selectedFish) query.set("fish", ctx.selectedFish);
    if (ctx.selectedRoute) query.set("route", ctx.selectedRoute);
    query.set("return", ctx.currentLocalRoute());
    const town = `shops${suffix}.html?${query}#town-arrival-1`;
    const tool = ctx.detailItemLink({ category: "general_tool", id: "03" });
    return `<aside class="detail-section" data-town-paste-bait><h2>${ctx.esc(text5.title)}</h2><p>${ctx.esc(text5.body)}</p><p class="muted">${ctx.esc(text5.limit)}</p><a class="route-button" data-paste-town href="${ctx.esc(town)}">${ctx.esc(text5.town)} ↗</a><a class="route-button" href="${ctx.esc(tool)}">${ctx.esc(text5.tool)} ↗</a></aside>`;
  }

  // src/pages/item/notebook.js
  var text4 = {
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
    const c = text4[ctx.lang];
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
        afterCatch: "จับตามคำขอได้แล้ว ให้เก็บปลาไหลไว้และกลับหมู่บ้านเริ่มต้น หากเงื่อนไขเนื้อเรื่องครบ เกมจะเริ่มฉากช่วยหมอและฉากจบอัตโนมัติ",
        returnMap: "ดูทางกลับหมู่บ้าน · ด่าน 1 (12,189)",
        limit: "จุดตกที่กำหนดอาจไม่มีปลาในรอบนี้",
        fish: "ดูเหยื่อและอุปกรณ์สำหรับปลาไหลใหญ่",
        map: "ดูจุดด่าน 6 · X 41, Y 8"
      },
      ja: {
        title: "医者から大ウナギを釣る依頼が届いたら",
        body: "この依頼を見たら、エリア6で磁石のオオウナギ項目を使うか、下の地図で地点を確認。釣りに行く前に魚のページで対応エサと道具を選んでください。",
        afterCatch: "依頼の魚を釣ったら、ウナギを残して最初の村へ戻ってください。物語の条件がそろうと、医者の回復とエンディングの自動シーンが始まります。",
        returnMap: "最初の村への入口 · エリア1 (12,189)",
        limit: "設定された釣り場に魚がいない場合もあります。",
        fish: "オオウナギの対応エサと道具を見る",
        map: "エリア6の地点 · X 41, Y 8"
      },
      en: {
        title: "After reading the doctor’s request for a giant eel",
        body: "Once this request appears, use its Area 6 Magnet heading or open the map point below. Choose compatible bait and equipment from the fish profile before fishing.",
        afterCatch: "After catching the requested eel, keep it and return to the starting village. When the story conditions are complete, the doctor-recovery and ending scene starts automatically.",
        returnMap: "Starting-village entrance · Area 1 (12,189)",
        limit: "The configured fishing point may be inactive.",
        fish: "See giant eel bait and equipment",
        map: "Area 6 point · X 41, Y 8"
      }
    }[lang];
  }
  function returnVillageHref(ctx) {
    const query = new URLSearchParams({ stage: "1", section: "s1-c1-r8", action: "eel-return" });
    const returned = ctx.safeLocalRoute(ctx.currentLocalRoute());
    if (returned) query.set("return", returned);
    return `${ctx.mapsPage[ctx.lang]}?${query}#map-view`;
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
    const text5 = postcardCopy(ctx.lang);
    const profile = ctx.fishProfileLink(EEL_ID, fishLocations);
    return `<aside class="detail-section quest-next-action" data-quest-next-action="postcard-eel"><h3>${ctx.esc(text5.title)}</h3><p>${ctx.esc(text5.body)}</p><p><a class="route-button" data-quest-fish-profile href="${ctx.esc(profile)}">${ctx.esc(text5.fish)} ↗</a> <a class="route-button" data-quest-fish-map href="${ctx.esc(eelMapHref(ctx))}">${ctx.esc(text5.map)} ↗</a></p><p data-eel-ending-action>${ctx.esc(text5.afterCatch)}</p><p><a class="route-button" data-eel-return-map href="${ctx.esc(returnVillageHref(ctx))}">${ctx.esc(text5.returnMap)} ↗</a></p><p>${ctx.esc(text5.limit)}</p></aside>`;
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
    const text5 = {
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
    return `<aside class="detail-section quest-next-action" data-quest-next-action="candle-akame"><h3>${ctx.esc(text5.title)}</h3><p>${ctx.esc(text5.body)}</p><p><a class="route-button" data-quest-fish-profile href="${ctx.esc(profile)}">${ctx.esc(text5.profile)} ↗</a> <a class="route-button" data-quest-fish-map href="${ctx.esc(mapsHref(ctx, point))}">${ctx.esc(text5.map)} ↗</a></p></aside>`;
  }
  function fireworksAction(ctx, item) {
    if (!isQuestItem(item, FIREWORKS_ID)) return "";
    const text5 = {
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
    return `<aside class="detail-section quest-next-action" data-quest-next-action="fireworks-recovery"><h3>${ctx.esc(text5.title)}</h3><p>${ctx.esc(text5.body)}</p><p><a class="route-button" data-quest-fireworks-shop href="${ctx.esc(shopHref(ctx))}">${ctx.esc(text5.shop)} ↗</a></p></aside>`;
  }
  function questNextActions(ctx, item, fishLocations) {
    return [
      postcardNextAction(ctx, item, fishLocations),
      candleAction(ctx, item, fishLocations),
      fireworksAction(ctx, item)
    ].filter(Boolean).join("");
  }

  // src/pages/item/fly-target-advice.js
  function local(ctx, values) {
    return values[ctx.lang] || values.en;
  }
  function bodyDecision(ctx, item, fish) {
    const accepted = (item.playerUse?.fishIds || []).includes(ctx.selectedFish);
    return local(ctx, {
      th: accepted ? `บอดี้นี้ผ่านเงื่อนไขโปรไฟล์ของ${fish} ใช้เป็นตัวเลือกประกอบฟลายได้ แต่เป็นเพียงด่านตรวจแรก บอดี้กับปีกของชุดยังอาจติดเงื่อนไขซ่อน` : `บอดี้นี้ไม่ผ่านเงื่อนไขโปรไฟล์ของ${fish} เลือกบอดี้ที่ใช้กับปลานี้ได้จากชุดเริ่มต้นด้านล่าง`,
      ja: accepted ? `このボディは${fish}のプロフィール判定を通り、自作候補にできます。ただし最初の判定だけで、セットのボディとウィングは隠れた条件で遮断される場合があります。` : `このボディは${fish}のプロフィール判定を通りません。下の開始用セットから適合するボディを選んでください。`,
      en: accepted ? `This body passes the profile check for ${fish} and is a custom-fly candidate. That is only the first check; the set’s body and wing can still meet a hidden blocking condition.` : `This body does not pass the profile check for ${fish}. Choose a compatible body from the starter sets below.`
    });
  }
  function hiddenGateAction(ctx, item, available, profileHref) {
    if (!available || item.category === "fly" && !(item.playerUse?.fishIds || []).includes(ctx.selectedFish))
      return "";
    const note = local(ctx, {
      th: "ถ้าปลาไม่กิน อย่าตีชุดเดิมซ้ำเพื่อหวังสุ่มเงื่อนไขนี้ใหม่ การพักค้างคืนอาจเปลี่ยนค่าแต่ก็อาจได้ค่าเดิม ลองดูชุดสำรองที่เปลี่ยนทั้งบอดี้และปีก การไม่กินอาจมีสาเหตุอื่น และชุดสำรองไม่ได้รับประกันว่าตกได้",
      ja: "反応がなくても、同じセットの投げ直しではこの条件を再抽選しません。宿泊は値を更新する場合がありますが、同じ値にもなります。ボディとウィングを変える予備セットを確認してください。反応しない原因は他にもあり、釣果は保証しません。",
      en: "If there is no bite, recasting the same set does not reroll this check. An overnight stay may refresh the values but can repeat them. Check the backup sets that vary body and wing. No bite can have other causes; the backup sets do not guarantee a catch."
    });
    const label = local(ctx, {
      th: "ดูชุดฟลายสำรองสำหรับปลานี้",
      ja: "この魚の予備フライセットを見る",
      en: "See backup fly sets for this fish"
    });
    return `<aside data-fly-hidden-gate><p>${ctx.esc(note)}</p><a class="route-button" data-fly-backup-action href="${ctx.esc(profileHref + "#fly-backup")}">${ctx.esc(label)} ↗</a></aside>`;
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
    const profileHref = ctx.fishProfileLink(ctx.selectedFish, fishLocations);
    const href = profileHref + (available ? "#starter-fly" : "");
    return `<div data-fly-target-advice="${ctx.esc(ctx.selectedFish)}"><p>${ctx.esc(decision)}</p><a class="route-button" data-fly-starter-link href="${ctx.esc(href)}">${ctx.esc(action)} ↗</a>${hiddenGateAction(ctx, item, available, profileHref)}</div>`;
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

  // src/pages/item/lure-kit-context.js
  function requestedKit(ctx, item, allItems) {
    const raw = ctx.params.get("kit") || "";
    if (item.category !== "lure" || !/^[0-9A-F]{2}\+[0-9A-F]{2}$/.test(raw)) return null;
    const key = raw.split("+").sort().join("+");
    return lureCoverageOptions(allItems).pairs.find(
      (pair) => pair.items.map((entry) => entry.id).sort().join("+") === key && pair.items.some((entry) => entry.id === item.id)
    ) || null;
  }
  function kitCopy(ctx, pair) {
    if (ctx.lang === "th")
      return {
        title: "คุณกำลังเลือกของสำหรับชุดลัวร์หลายชนิด",
        action: `เก็บทั้งคู่ ${pair.key} เพื่อครอบคลุมเงื่อนไขลัวร์ ${pair.coverageCount} โปรไฟล์ รวม ¥${pair.totalYen} หากซื้อใหม่ ถ้ามีคู่ครบอยู่แล้ว ใช้ต่อได้ ไม่ต้องซื้อซ้ำ`,
        scope: "คำแนะนำราคาถูกกว่าด้านล่างเลือกเพื่อปลาที่ดูอยู่ตัวเดียว การเปลี่ยนชิ้นหนึ่งไม่ได้ยืนยันว่าครอบคลุมครบทั้งชุด ไม่ได้รับประกันปลากินหรือดึงขึ้นสำเร็จ",
        partner: "ดูอีกชิ้นในชุดและแหล่งซื้อ"
      };
    if (ctx.lang === "ja")
      return {
        title: "複数の魚に使うルアーセットを選択中",
        action: `${pair.key}の両方を持つと${pair.coverageCount}プロフィールのルアー判定をカバーできます。新規購入は合計${pair.totalYen}円。すでに一式を持っていれば買い直す必要はありません。`,
        scope: "下の安い候補は表示中の魚だけを狙う選択です。片方を替えてもセット全体のカバーは保証されません。食いつきや取り込みの保証ではありません。",
        partner: "もう一方の道具と販売場所を見る"
      };
    return {
      title: "Choosing an item for a multi-species lure kit",
      action: `Keep both ${pair.key} to cover ${pair.coverageCount} lure-compatible profiles, for ¥${pair.totalYen} when buying new. Keep using a complete pair you already own; you do not need to buy it again.`,
      scope: "Cheaper choices below target only the fish you are viewing. Replacing one member does not establish full-kit coverage. Coverage does not guarantee a bite or landing.",
      partner: "See the other kit member and where to buy it"
    };
  }
  function partnerHref(ctx, partner, pair) {
    const [page, search = ""] = ctx.detailItemLink(partner).split("?");
    const query = new URLSearchParams(search);
    query.set("kit", pair.key);
    return `${page}?${query}`;
  }
  function lureKitContext(ctx, item, allItems) {
    const pair = requestedKit(ctx, item, allItems);
    if (!pair) return "";
    const partner = pair.items.find((entry) => entry.id !== item.id);
    const copy5 = kitCopy(ctx, pair);
    const link = partnerHref(ctx, partner, pair);
    return `<section class="detail-section" data-lure-kit-context="${ctx.esc(pair.key)}" data-kit-coverage="${pair.coverageCount}"><h2>${ctx.esc(copy5.title)}</h2><p><strong>${ctx.esc(copy5.action)}</strong></p><a class="entity-link" data-lure-kit-partner="${ctx.esc(partner.id)}" href="${ctx.esc(link)}"><img src="${ctx.esc(partner.image)}" alt=""><span>${ctx.esc(ctx.imageName(partner))}<small>${ctx.esc(copy5.partner)} ↗</small></span></a><p class="muted">${ctx.esc(copy5.scope)}</p></section>`;
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
    if (!items.length) return "";
    if (!item.areaRodDecision)
      return `<div class="detail-grid rod-alternatives">${items.map((entry) => ctx.componentLink(entry)).join("")}</div>`;
    const nextStage = item.areaRodDecision.status === "style-unstocked" ? item.areaRodDecision.nextStockStage : 0;
    const links = items.map((candidate) => {
      const href = ctx.detailItemLink(candidate);
      const target = nextStage ? withStage(href, nextStage) : href;
      const stage = nextStage ? ` data-stage="${nextStage}"` : "";
      return `<a class="entity-link" data-rod-area-alternative="${ctx.esc(candidate.id)}"${stage} href="${ctx.esc(target)}"><img src="${ctx.esc(candidate.image)}" alt=""><span>${ctx.esc(ctx.imageName(candidate))}<small>ID ${ctx.esc(candidate.id)}${nextStage ? ` · ${ctx.esc(ctx.copy.area(nextStage))}` : ""}</small></span></a>`;
    }).join("");
    return nextStage ? `<div class="detail-grid rod-alternatives" data-rod-area-next-stock="${nextStage}">${links}</div>` : `<div class="detail-grid rod-alternatives" data-rod-area-alternatives>${links}</div>`;
  }
  function withStage(href, stage) {
    const [pathAndQuery, hash = ""] = href.split("#");
    const [path, query = ""] = pathAndQuery.split("?");
    const params = new URLSearchParams(query);
    params.set("stage", String(stage));
    return `${path}?${params}${hash ? `#${hash}` : ""}`;
  }
  function generalRodRouteAdvice(ctx, item) {
    const advice = item.generalRodDecision;
    if (!advice?.recommendation) return "";
    const title = ctx.lang === "th" ? "คำแนะนำเส้นทางทั่วไปทุกด่าน" : ctx.lang === "ja" ? "エリア指定なしの一般ルート案内" : "General route advice across areas";
    return `<details class="general-rod-route-advice"><summary>${title}</summary><p>${ctx.esc(ctx.local(advice.recommendation))}</p>${advice.reason ? `<p>${ctx.esc(ctx.local(advice.reason))}</p>` : ""}</details>`;
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
    const routeAdvice = generalRodRouteAdvice(ctx, item);
    if (!decision || !reasons) return routeAdvice + reasons;
    return routeAdvice + `<details class="decision-reasons"><summary>${ctx.esc(decisionReasonTitle(ctx, true))}</summary>${reasons}</details>`;
  }
  function decisionSectionCopy(ctx, item, decision, wingDecision, facts2) {
    const factList = facts2.length ? `<h3>${ctx.esc(decisionReasonTitle(ctx, Boolean(decision)))}</h3><ul>${facts2.map((fact) => `<li>${ctx.esc(fact)}</li>`).join("")}</ul>` : "";
    const verdict = wingDecision ? `<p class="rod-verdict" data-fly-wing-verdict="${ctx.esc(item.id)}">${ctx.esc(wingDecision.label)}</p>` : decision ? `<p class="rod-verdict">${ctx.esc(ctx.local(decision.label))}</p>` : "";
    const key = item.rodDecision ? "data-rod-decision" : item.baitLureDecision ? "data-bait-lure-decision" : "data-gear-decision";
    const marker = decision ? `${key}="${ctx.esc(item.id)}"` : "";
    const areaMarker = item.areaRodDecision ? ` data-rod-area-decision="${item.areaRodDecision.stage}" data-rod-area-status="${ctx.esc(item.areaRodDecision.status)}"${!["item-unstocked", "style-unstocked", "style-never-stocked"].includes(item.areaRodDecision.status) ? ' data-selected-area-offer="true"' : ""}` : "";
    return {
      factList,
      verdict,
      marker: `${marker}${areaMarker}`,
      heading: decision ? rodDecisionTitle(ctx, item) : ctx.copy.use
    };
  }
  function renderDecisionSection(ctx, item, summary, facts2, imageNote, data) {
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
    } = decisionSectionCopy(ctx, item, decision, wingDecision, facts2);
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
    const primary = item.areaRodDecision ? general : targetAdvice2 || general;
    return `<section id="what-to-do" class="decision-panel ${decision ? "rod-decision" : ""}" ${dataAttribute}${foodAreaMarker(ctx.lang, item, ctx.selectedStage)}><h2>${ctx.esc(heading)}</h2>${primary}${foodAreaAction(ctx, item, ctx.selectedStage, ctx.currentLocalRoute())}${equalPriceChoice(ctx, item, allItems)}${supporting}${actions}${note}</section>`;
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
    const areaDecision = rodAreaDecision(ctx.lang, item, allItems, ctx.selectedStage);
    const viewItem = areaDecision ? {
      ...item,
      rodDecision: { ...item.rodDecision, ...areaDecision },
      generalRodDecision: item.rodDecision,
      areaRodDecision: areaDecision
    } : item;
    const usage = ctx.visibleUsage(viewItem, allItems, fishVisuals);
    const summary = usage.summary || ctx.local(viewItem.playerUse?.summary) || "";
    const facts2 = usage.facts || [];
    const name = ctx.imageName(item);
    const categoryText = ctx.categoryLabel(item);
    const categoryHref = ctx.currentCategoryLink();
    const intro = `<nav class="detail-breadcrumb" aria-label="${ctx.esc(ctx.copy.category)}"><a href="${ctx.esc(categoryHref)}">${ctx.esc(ctx.copy.allItems)}</a><span aria-hidden="true">/</span><span>${ctx.esc(categoryText)}</span></nav>`;
    const hero = renderItemHero(ctx, item, name, categoryText);
    const target = renderFishTarget(ctx, fishVisuals, fishLocations);
    const baitTarget = renderBaitTarget(ctx, item, fishVisuals, fishLocations);
    const kit = lureKitContext(ctx, item, allItems);
    const note = item[`imageNote${ctx.lang === "th" ? "Th" : ctx.lang === "ja" ? "Ja" : "En"}`] || "";
    const action = magnetNextAction(ctx, item, allItems) || renderDecisionSection(ctx, viewItem, summary, facts2, note, {
      allItems,
      fishVisuals,
      fishLocations
    });
    const extras = renderQuickOptions(ctx, item, allItems, fishLocations);
    const rodAdvice = item.rodDecision || item.gearDecision || item.baitLureDecision;
    const buying = rodAdvice ? "" : ctx.buyingDecision(item, allItems, decisions);
    const more = renderMoreOptions(ctx, item, allItems, fishLocations);
    const back = `<p class="detail-back-to-list"><a class="route-button" href="${ctx.esc(categoryHref)}">${ctx.esc(ctx.copy.allItems)} · ${ctx.esc(categoryText)} ↗</a></p>`;
    return `${intro}${hero}${target}${baitTarget}${kit}${action}${flyPriceChoice(ctx, item, allItems)}${flyMenuPosition(ctx, item)}${extras}${buying}${ctx.shopSection(item, allItems, fishLocations)}${ctx.useLocationSection(item, fishLocations, allItems)}${ctx.fishSection(item, fishVisuals, fishLocations)}${more}${back}${ctx.technicalSection(item)}<p class="muted">${ctx.esc(ctx.copy.sourced)}</p>`;
  }
  function scrollToItemAnchor() {
    const exact = [
      "#fly-menu-position",
      "#item-shops",
      "#what-to-do",
      "#fly-purchases",
      "#use-locations"
    ];
    const supported = exact.includes(location.hash) || location.hash.startsWith("#compass-exit-") || location.hash.startsWith("#forage-stage-");
    if (supported) document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
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
  function loadErrorState(ctx) {
    ctx.setNavigation();
    ctx.$("detail-root").innerHTML = `<section class="empty-state" role="alert"><h1>${ctx.esc(ctx.copy.loadErrorTitle)}</h1><p>${ctx.esc(ctx.copy.loadErrorBody)}</p><p><button class="route-button" type="button" id="item-retry" data-item-retry>${ctx.esc(ctx.copy.retryLoad)} ↻</button> <a class="route-button" data-item-catalogue-fallback href="${ctx.esc(ctx.fallbackBack())}">${ctx.esc(ctx.copy.backToCatalogue)} ↗</a></p></section>`;
    ctx.$("item-retry")?.addEventListener("click", () => location.reload());
  }

  // src/pages/item/load-catalogue.js
  function loadCatalogue(ctx) {
    ctx.flyMakerLink = (item) => item.category.startsWith("fly") ? `<p><a class="route-button" data-fly-maker href="${ctx.esc(ctx.currentCategoryLink().split("#")[0] + "#fly-instructions")}">${ctx.lang === "th" ? "ดูขั้นตอนประกอบฟลายเองและตรวจราคาในเกม" : ctx.lang === "ja" ? "自作フライの手順とゲーム内見積額を確認" : "See custom fly steps and check the in-game quote"} ↗</a></p>` : "";
    ctx.setNavigation();
    fetch("gallery-data.json?v=eel-ending-20261006-68").then((response) => {
      if (!response.ok) throw new Error("catalogue data unavailable");
      return response.json();
    }).then((data) => {
      if (!data || !Array.isArray(data.items)) throw new Error("invalid catalogue data");
      if (ctx.selectedFish && !data.fishVisuals?.[ctx.selectedFish]) ctx.selectedFish = "";
      const item = data.items.find(
        (candidate) => candidate.category === ctx.category && candidate.id === ctx.requestedId
      ) || null;
      if (!item) {
        ctx.emptyState();
        return;
      }
      ctx.render(
        item,
        data.items,
        data.fishVisuals || {},
        data.fishLocations || {},
        data.playerDecisions?.sections || []
      );
    }).catch((error) => {
      console.error("Item detail failed to load or render.", error);
      ctx.loadErrorState();
    });
  }

  // src/pages/item/copy_en.js
  var copy_en = {
    allItems: "Browse all items",
    back: "← Back to where you came from",
    invalidTitle: "Item not found",
    invalidBody: "This item link is incomplete or its ID is not in the catalogue.",
    loadErrorTitle: "Could not load item details",
    loadErrorBody: "The item data could not be loaded or displayed. Retry this page, or return to the item list.",
    retryLoad: "Retry this page",
    backToCatalogue: "Back to item list",
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
    loadErrorTitle: "โหลดรายละเอียดไอเท็มไม่สำเร็จ",
    loadErrorBody: "โหลดหรือแสดงข้อมูลไอเท็มไม่ได้ ลองอีกครั้งหรือกลับไปยังรายการไอเท็ม",
    retryLoad: "ลองโหลดหน้านี้อีกครั้ง",
    backToCatalogue: "กลับไปหน้ารายการไอเท็ม",
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
    loadErrorTitle: "道具の詳細を読み込めませんでした",
    loadErrorBody: "道具データを読み込めないか、表示できません。もう一度試すか、道具一覧に戻ってください。",
    retryLoad: "このページを再読み込み",
    backToCatalogue: "道具一覧へ戻る",
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
    ctx.selectedRoute = ["float", "sinker", "lure", "fly"].includes(ctx.params.get("route")) ? ctx.params.get("route") : "";
    ctx.baseDir = location.pathname.slice(0, location.pathname.lastIndexOf("/") + 1);
    ctx.routeFiles = {
      catalogue: /^\/(?:[^/]+\/)?catalogue\/(?:index(?:\.th|\.ja)?|maps(?:\.th|\.ja)?|fish(?:\.th|\.ja)?|item(?:\.th|\.ja)?|shops(?:\.th|\.ja)?|quests(?:\.th|\.ja)?)\.html$/,
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
