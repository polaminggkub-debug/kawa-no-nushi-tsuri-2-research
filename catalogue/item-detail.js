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
  function fallbackBack(ctx) {
    const p = new URLSearchParams();
    if (ctx.category)
      p.set(
        "category",
        ["fly", "fly_wing", "fly_tail"].includes(ctx.category) ? "flymaker" : ctx.category
      );
    if (["fly", "fly_wing", "fly_tail"].includes(ctx.category)) p.set("part", ctx.category);
    if (ctx.selectedFish && ["bait", "lure", "fly", "fly_wing", "fly_tail", "float_weight"].includes(ctx.category))
      p.set("fish", ctx.selectedFish);
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
    if (ctx.selectedFish && ["bait", "lure", "fly", "fly_wing", "fly_tail", "float_weight"].includes(ctx.category))
      p.set("fish", ctx.selectedFish);
    if (ctx.selectedStage) p.set("stage", String(ctx.selectedStage));
    if (ctx.selectedRoute && ctx.category === "bait") p.set("route", ctx.selectedRoute);
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
    return `<section class="detail-section buying-decision"><h2>${ctx.lang === "th" ? "ควรซื้อหรือเปลี่ยนมาใช้อันนี้ไหม?" : ctx.lang === "ja" ? "買う・替えるべき？" : "Should I buy or switch to this?"}</h2>${sections.map((section) => {
      const refs = (section.items || []).filter((ref) => ref.category === item.category && ref.id !== item.id).map((ref) => allItems.find((i) => i.category === ref.category && i.id === ref.id)).filter(Boolean);
      return `<h3>${ctx.esc(ctx.local(section.title))}</h3><p>${ctx.esc(ctx.local(section.recommendation))}</p>${refs.length ? `<div class="detail-grid">${refs.map((ref) => ctx.componentLink(ref)).join("")}</div>` : ""}<p class="muted">${ctx.esc(ctx.local(section.scope))}</p>`;
    }).join("")}</section>`;
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
      const summary = ctx.lang === "th" ? "ประกอบเองให้เริ่มจากปีกที่มีอยู่และตรวจราคาเสนอก่อนจ่าย ไม่ต้องซื้อปีกแพงเพื่อหวังโบนัสจับปลา เพราะยังไม่มีหลักฐานรองรับ" : ctx.lang === "ja" ? "作成するなら手持ちのウィングから始め、確定前に見積額を確認する。釣果ボーナスを期待して高価なウィングを買う根拠はない。" : "For a custom fly, start with a wing you have and check the quote before paying. There is no established catch bonus that justifies buying an expensive wing.";
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
  function visibleUsage(ctx, item) {
    const use = item.playerUse || {};
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
    const routeName = route === "float" ? ctx.copy.routeFloat : ctx.copy.routeSinker;
    const cards = fishIds.map((id) => ctx.fishTile(id, fishVisuals, fishLocations, ctx.selectedStage)).join("");
    const active = ctx.selectedRoute === route ? 'data-active="true"' : "";
    return `<div id="rig-${ctx.esc(route)}" class="detail-section" ${active}><h3>${ctx.esc(routeName)} · ${fishIds.length}</h3><div class="detail-grid">${cards}</div></div>`;
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
  function compatibilitySummary(ctx, count, steering) {
    if (steering) {
      if (ctx.lang === "th") return `ดูรายชื่อปลาและสัตว์ · ${count}`;
      if (ctx.lang === "ja") return `魚・生き物の一覧を見る · ${count}`;
      return `See creature list · ${count}`;
    }
    if (ctx.lang === "th") return `ปลาที่ใช้ด้วยได้ · ${count}`;
    if (ctx.lang === "ja") return `対応する魚 · ${count}`;
    return `Compatible fish · ${count}`;
  }
  function fishSection(ctx, item, fishVisuals, fishLocations) {
    const use = item.playerUse || {};
    const routes = use.fishIdsByRoute || {};
    const steering = item.category === "general_tool" && ["08", "09", "0A"].includes(item.id);
    const routeKeys = compatibilityRoutes(routes);
    const ids = Array.isArray(use.fishIds) ? normalizedFishIds(use.fishIds) : [];
    const categories = ["lure", "fly", "bait", "float_weight", "general_tool"];
    if (!categories.includes(item.category) || !ids.length && !routeKeys.length) return "";
    const copy = steeringCopy(ctx);
    const heading = steering ? copy.title : ctx.copy.fish;
    const groups = renderCompatibilityGroups(ctx, routes, routeKeys, ids, fishVisuals, fishLocations);
    const accepted = targetAccepted(ctx, routes, routeKeys, ids);
    const status = ctx.selectedFish ? targetStatus(ctx, routes, accepted, steering, copy) : "";
    const fishTarget = ctx.selectedFish ? `<p class="play-target"><strong>${ctx.esc(ctx.copy.target)} · ${ctx.esc(ctx.fishName(ctx.selectedFish, fishVisuals))} (${ctx.esc(ctx.selectedFish)})</strong><br>${ctx.esc(status)}</p>` : "";
    const count = routeKeys.length ? new Set(Object.values(routes).flatMap(normalizedFishIds)).size : ids.length;
    const list = `<details class="compatibility-details"><summary>${ctx.esc(compatibilitySummary(ctx, count, steering))}</summary>${groups}</details>`;
    return `<section class="detail-section compatibility-section"><h2>${ctx.esc(heading)} · ${count}</h2>${fishTarget}<p class="section-lede">${ctx.esc(ctx.local(use.fishScope) || ctx.copy.fishScope)}</p>${list}<p class="muted">${ctx.esc(steeringScope(ctx, steering))}</p></section>`;
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
  function locationPinNote(ctx, loc, text) {
    if (loc.kind === "runtime_net_use") {
      if (ctx.lang === "th") return "รูปแมลงน้ำชี้ช่องที่ทดลองใช้ตาข่ายสำเร็จ";
      if (ctx.lang === "ja") return "カワムシ画像はアミ使用に成功したタイルを示す。";
      return "The aquatic insect portrait marks the successfully tested net tile.";
    }
    return loc.forage ? text.forage : text.pin;
  }
  function locationMarkerLink(ctx, marker, item, loc, stage) {
    if (isCurrentItem(marker, item)) return loc.image;
    const returnRoute = loc.forage ? ctx.foragePointReturn(stage, loc.context) : "";
    return ctx.areaItemLink(marker, stage, "", returnRoute);
  }
  function locationVisual(ctx, loc, item, markers, stage, text) {
    if (!loc.image || !loc.pin) return "";
    const markerLinks = markers.map((marker) => {
      const current = isCurrentItem(marker, item);
      const target = current ? ' target="_blank" rel="noopener"' : "";
      const label = current ? text.open : ctx.imageName(marker);
      return `<a href="${ctx.esc(locationMarkerLink(ctx, marker, item, loc, stage))}"${target} aria-label="${ctx.esc(label)}"><img src="${ctx.esc(marker.image)}" alt="${ctx.esc(ctx.imageName(marker))}"></a>`;
    }).join("");
    const note = locationPinNote(ctx, loc, text);
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
  function renderEntranceGuide(ctx, item, loc, text) {
    const approach = loc.approach;
    if (!approach) return "";
    const pin = `<span class="tool-use-pin" style="left:${approach.pin.x * 100}%;top:${approach.pin.y * 100}%"><a href="${ctx.esc(approach.image)}" target="_blank" rel="noopener"><img src="${ctx.esc(item.image)}" alt="${ctx.esc(ctx.imageName(item))}"></a></span>`;
    const map = `<div class="tool-use-map" style="aspect-ratio:${approach.width}/${approach.height}"><img class="tool-use-ground" src="${ctx.esc(approach.image)}" alt="${ctx.esc(entranceTitle(ctx))}">${pin}</div>`;
    const full = `<a href="${ctx.esc(approach.fullImage)}" target="_blank" rel="noopener">${ctx.esc(text.full)} ↗</a>`;
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
  function fullImageLabel(ctx, loc, text) {
    if (loc.context !== "town") return text.full;
    if (ctx.lang === "th") return "เปิดภาพในเมืองทั้งห้าห้อง";
    if (ctx.lang === "ja") return "町内の5部屋の画像を開く";
    return "Open all five town rooms";
  }
  function locationAnchor(loc, stage) {
    if (loc.kind === "compass_exit") return `id="compass-exit-${stage}"`;
    if (loc.forage) return `id="forage-stage-${stage}-context-${Number(loc.context)}"`;
    return "";
  }
  function locationCoordinates(ctx, loc, text) {
    const tile = `<p>X ${ctx.esc(loc.tileX)}, Y ${ctx.esc(loc.tileY)}</p>`;
    if (!loc.useWindow) return tile;
    const { xMin, xMax, yMin, yMax } = loc.useWindow;
    return `${tile}<p>${ctx.esc(text.window)} X ${xMin}–${xMax}, Y ${yMin}–${yMax}</p>`;
  }
  function locationImageLinks(ctx, loc, text) {
    const image = loc.image ? `<a href="${ctx.esc(loc.image)}" target="_blank" rel="noopener">${ctx.esc(text.open)} ↗</a>` : "";
    const full = loc.fullImage ? ` · <a href="${ctx.esc(loc.fullImage)}" target="_blank" rel="noopener">${ctx.esc(fullImageLabel(ctx, loc, text))} ↗</a>` : "";
    return `${image}${full}`;
  }
  function locationDescription(ctx, loc) {
    return ctx.esc(ctx.local(loc.description) || ctx.local(loc.name) || "");
  }
  function locationEntry(ctx, item, loc, fishLocations, allItems, text) {
    const stage = Number(loc.stage) || 0;
    const markers = locationMarkerItems(loc, item, allItems);
    const visual = locationVisual(ctx, loc, item, markers, stage, text);
    const stageName2 = stage ? `${ctx.copy.area(stage)} · ${ctx.stageName(stage, fishLocations)}` : "";
    const action = loc.action ? `<p class="acquisition-action">${ctx.esc(ctx.local(loc.action))}</p>` : "";
    const content = [
      entranceLabel(ctx, loc),
      renderRequirement(ctx, loc, item, allItems),
      renderReward(ctx, loc, item, allItems),
      action,
      `<p>${locationDescription(ctx, loc)}</p>`,
      visual,
      locationCoordinates(ctx, loc, text),
      locationImageLinks(ctx, loc, text),
      renderEntranceGuide(ctx, item, loc, text)
    ].join("");
    return `<article class="detail-section" ${locationAnchor(loc, stage)}><h3>${ctx.esc(stageName2 + townLabel(ctx, loc))}</h3>${content}</article>`;
  }
  function useLocationSection(ctx, item, fishLocations, allItems) {
    const locations = item.playerUse?.useLocations || [];
    if (!locations.length) return "";
    const text = locationCopy(ctx);
    const cards = locations.map((loc) => locationEntry(ctx, item, loc, fishLocations, allItems, text)).join("");
    const layout = locations.length === 1 ? "single-location" : "";
    return `<section class="detail-section locations-section" id="use-locations"><h2>${ctx.esc(ctx.copy.useLocations)}</h2><div class="detail-grid tool-location-grid ${layout}">${cards}</div></section>`;
  }

  // src/pages/item/actions.js
  function gearNextActions(ctx, item, fishVisuals, fishLocations, allItems) {
    if (!item.gearDecision) return "";
    if (item.category === "float_weight")
      return `<p><a class="route-button" data-float-price-guide href="index${ctx.lang === "en" ? "" : "." + ctx.lang}.html?category=float_weight#category-decisions">${ctx.lang === "th" ? "ดูทุ่นและตะกั่วราคาต่ำสุดแยกทั้งหกด่าน" : ctx.lang === "ja" ? "6エリアの最安ウキ・オモリを見る" : "See the cheapest float and sinker in each of six areas"} ↗</a></p>`;
    const ids = (item.gearDecision.targetFish || []).filter((id) => fishVisuals[id]);
    const hookBudget = item.category === "hook" ? `<p><a class="route-button" data-hook-price-guide href="index${ctx.lang === "en" ? "" : "." + ctx.lang}.html?category=hook#category-decisions">${ctx.lang === "th" ? "เบ็ดหายหรือยังไม่มี? ดูเบ็ดทั่วไปที่ถูกสุดทั้งหกด่าน" : ctx.lang === "ja" ? "針を失った・持っていない？6エリアの最安汎用針を見る" : "Lost your hook or have none? See the cheapest generic hook in each area"} ↗</a></p>` : "";
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
    const refs = group.refs.map((ref) => priceChoiceItem(ctx, ref, items)).join(" / ");
    return `<p><strong>${ctx.esc(area)}</strong> · ${refs}</p>`;
  }
  function priceChoiceItem(ctx, ref, items) {
    const item = items.find(
      (candidate) => candidate.category === ref.category && candidate.id === ref.id
    );
    if (!item) return "";
    return `<a href="${ctx.esc(ctx.detailItemLink(item))}">${ctx.esc(ctx.imageName(item))} (${ctx.esc(item.id)}) · ¥${ctx.esc(ref.priceYen)} ↗</a>`;
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
  function renderDecisionSection(ctx, item, summary, facts, imageNote, allItems, fishVisuals, fishLocations) {
    const decision = item.rodDecision || item.gearDecision || item.baitLureDecision;
    const isRod = item.category === "rod";
    const factList = facts.length ? `<h3>${ctx.esc(decisionReasonTitle(ctx, Boolean(decision)))}</h3><ul>${facts.map((fact) => `<li>${ctx.esc(fact)}</li>`).join("")}</ul>` : "";
    const verdict = decision ? `<p class="rod-verdict">${ctx.esc(ctx.local(decision.label))}</p>` : "";
    const dataAttribute = decision ? `${isRod ? "data-rod-decision" : item.baitLureDecision ? "data-bait-lure-decision" : "data-gear-decision"}="${ctx.esc(item.id)}"` : "";
    const heading = decision ? rodDecisionTitle(ctx, item) : ctx.copy.use;
    const body = summary || ctx.copy.noFish;
    const next = ctx.gearNextActions(item, fishVisuals, fishLocations, allItems);
    const maker = ctx.flyMakerLink(item);
    const note = imageNote ? `<p class="muted">${ctx.esc(imageNote)}</p>` : "";
    const reasons = factList + decisionFacts(ctx, item, allItems);
    const supporting = decision && reasons ? `<details class="decision-reasons"><summary>${ctx.esc(decisionReasonTitle(ctx, true))}</summary>${reasons}</details>` : reasons;
    return `<section id="what-to-do" class="decision-panel ${decision ? "rod-decision" : ""}" ${dataAttribute}><h2>${ctx.esc(heading)}</h2>${verdict}<p>${ctx.esc(body)}</p>${supporting}${next}${maker}${note}</section>`;
  }
  function renderQuickOptions(ctx, item, allItems) {
    const options = [
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
    const usage = ctx.visibleUsage(item);
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
    const action = renderDecisionSection(
      ctx,
      item,
      summary,
      facts,
      note,
      allItems,
      fishVisuals,
      fishLocations
    );
    const extras = renderQuickOptions(ctx, item, allItems);
    const rodAdvice = item.rodDecision || item.gearDecision || item.baitLureDecision;
    const buying = rodAdvice ? "" : ctx.buyingDecision(item, allItems, decisions);
    const more = renderMoreOptions(ctx, item, allItems, fishLocations);
    const back = `<p class="detail-back-to-list"><a class="route-button" href="${ctx.esc(categoryHref)}">${ctx.esc(ctx.copy.allItems)} · ${ctx.esc(categoryText)} ↗</a></p>`;
    return `${intro}${hero}${target}${baitTarget}${action}${extras}${buying}${ctx.shopSection(item, allItems, fishLocations)}${ctx.useLocationSection(item, fishLocations, allItems)}${ctx.fishSection(item, fishVisuals, fishLocations)}${more}${back}${ctx.technicalSection(item)}<p class="muted">${ctx.esc(ctx.copy.sourced)}</p>`;
  }
  function scrollToItemAnchor() {
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
    fetch("gallery-data.json?v=compendium-20261004-22").then((response) => {
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
    stockAt: "Stock recorded in this area",
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
    stockAt: "มีข้อมูลร้านค้าในด่านนี้",
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
    stockAt: "このエリアの店頭記録",
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

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/app/item.js
  var runtimeContext = createPageRuntime(item_exports);
  initialize(runtimeContext);
})();
