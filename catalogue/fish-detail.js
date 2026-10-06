(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/fish/index.js
  var fish_exports = {};
  __export(fish_exports, {
    cataloguePath: () => cataloguePath,
    currentFishPath: () => currentFishPath,
    escapeHtml: () => escapeHtml,
    fishMapLink: () => fishMapLink,
    getLocations: () => getLocations,
    initialize: () => initialize,
    itemLink: () => itemLink,
    itemPath: () => itemPath,
    localizeReturn: () => localizeReturn,
    localizedFishName: () => localizedFishName,
    localizedItemName: () => localizedItemName,
    mapPath: () => mapPath,
    matchingItems: () => matchingItems,
    normalizeId: () => normalizeId,
    pointCount: () => pointCount,
    render: () => render,
    renderAreaMap: () => renderAreaMap,
    renderAreas: () => renderAreas,
    renderCompatibility: () => renderCompatibility,
    renderEvidence: () => renderEvidence,
    renderExchange: () => renderExchange,
    renderFlyFallback: () => renderFlyFallback,
    renderReusableKit: () => renderReusableKit,
    renderRigForMethod: () => renderRigForMethod,
    renderRodForMethod: () => renderRodForMethod,
    renderShopping: () => renderShopping,
    renderWaterIcons: () => renderWaterIcons,
    resolveProfileStage: () => resolveProfileStage,
    safeLocalReturn: () => safeLocalReturn,
    setNavigation: () => setNavigation,
    slotCount: () => slotCount,
    starterOffers: () => starterOffers,
    unconfirmedProfileAction: () => unconfirmedProfileAction,
    validStage: () => validStage
  });

  // src/pages/fish/navigation.js
  function normalizeId(ctx, value) {
    if (!value || !/^(?:0x)?[0-9a-f]{1,2}$/i.test(value.trim())) return "";
    return Number.parseInt(value.trim().replace(/^0x/i, ""), 16).toString(16).toUpperCase().padStart(2, "0");
  }
  function validStage(ctx, value) {
    return /^[1-6]$/.test(value || "") ? value : "";
  }
  function safeLocalReturn(ctx, value) {
    if (!value || value.startsWith("//") || value.includes("\\") || /^[a-z][a-z0-9+.-]*:/i.test(value))
      return "";
    let target;
    const catalogueDirectory = new URL(".", window.location.href);
    try {
      target = new URL(value, catalogueDirectory);
    } catch {
      return "";
    }
    if (target.origin !== window.location.origin) return "";
    const catalogueNames = [
      "index.html",
      "index.th.html",
      "index.ja.html",
      "maps.html",
      "maps.th.html",
      "maps.ja.html",
      "fish.html",
      "fish.th.html",
      "fish.ja.html",
      "item.html",
      "item.th.html",
      "item.ja.html",
      "shops.html",
      "shops.th.html",
      "shops.ja.html",
      "quests.html",
      "quests.th.html",
      "quests.ja.html"
    ];
    const researchNames = ["index.html", "index.th.html", "index.ja.html"];
    const allowed = /* @__PURE__ */ new Set([
      ...catalogueNames.map((name) => new URL(name, catalogueDirectory).pathname),
      ...researchNames.map((name) => new URL(`../research/${name}`, catalogueDirectory).pathname)
    ]);
    if (!allowed.has(target.pathname)) return "";
    const relativePath = target.pathname.startsWith(catalogueDirectory.pathname) ? target.pathname.slice(catalogueDirectory.pathname.length) : `../research/${target.pathname.split("/").pop()}`;
    return `${relativePath}${target.search}${target.hash}`;
  }
  function localizeReturn(ctx, value, targetLocale, depth = 0) {
    const route = ctx.safeLocalReturn(value);
    if (!route) return "";
    const catalogueDirectory = new URL(".", window.location.href);
    let target;
    try {
      target = new URL(route, catalogueDirectory);
    } catch {
      return "";
    }
    const basename = target.pathname.split("/").pop();
    const root = basename.replace(/(?:\.(?:th|ja))?\.html$/, "");
    if (["index", "maps", "fish", "item", "shops", "quests"].includes(root)) {
      const directory = target.pathname.slice(0, target.pathname.lastIndexOf("/") + 1);
      target.pathname = `${directory}${root}${targetLocale === "en" ? "" : `.${targetLocale}`}.html`;
    }
    const nestedReturn = target.searchParams.get("return");
    if (nestedReturn) {
      if (depth >= 4) {
        target.searchParams.delete("return");
      } else {
        const localizedNested = ctx.localizeReturn(nestedReturn, targetLocale, depth + 1);
        if (localizedNested) target.searchParams.set("return", localizedNested);
        else target.searchParams.delete("return");
      }
    }
    const relativePath = target.pathname.startsWith(catalogueDirectory.pathname) ? target.pathname.slice(catalogueDirectory.pathname.length) : `../research/${target.pathname.split("/").pop()}`;
    return `${relativePath}${target.search}${target.hash}`;
  }
  function escapeHtml(ctx, value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
    );
  }
  function currentFishPath(ctx, stage = ctx.requestedStage) {
    const query = new URLSearchParams();
    if (ctx.id) query.set("id", ctx.id);
    if (stage) query.set("stage", stage);
    if (ctx.requestedMethod) query.set("route", ctx.requestedMethod);
    if (ctx.localReturn) query.set("return", ctx.localReturn);
    return `${window.location.pathname.split("/").pop()}?${query.toString()}`;
  }
  function mapPath(ctx) {
    return ctx.locale === "th" ? "maps.th.html" : ctx.locale === "ja" ? "maps.ja.html" : "maps.html";
  }
  function cataloguePath(ctx) {
    return ctx.locale === "th" ? "index.th.html" : ctx.locale === "ja" ? "index.ja.html" : "index.html";
  }
  function itemPath(ctx) {
    return ctx.locale === "th" ? "item.th.html" : ctx.locale === "ja" ? "item.ja.html" : "item.html";
  }
  function fishMapLink(ctx, stage, section = "") {
    const query = new URLSearchParams({ fish: ctx.id });
    if (stage) query.set("stage", String(stage));
    if (ctx.requestedMethod) query.set("route", ctx.requestedMethod);
    if (/^s[1-6]-c\d+-r\d+$/.test(section)) query.set("section", section);
    query.set("return", `${ctx.currentFishPath(stage)}#fish-area-map`);
    return `${ctx.mapPath()}?${query.toString()}#map-view`;
  }
  function setNavigation(ctx, stage) {
    const mapHref = ctx.fishMapLink(stage);
    const back = document.getElementById("fish-back");
    back.href = ctx.localReturn || (stage ? mapHref : ctx.cataloguePath());
    back.textContent = ctx.localReturn ? ctx.copy.back : stage ? ctx.copy.map : ctx.copy.catalogue;
    document.getElementById("fish-map-link").href = stage ? mapHref : ctx.cataloguePath();
    document.getElementById("fish-map-link").hidden = !stage || !ctx.localReturn;
    for (const lang of ["en", "th", "ja"]) {
      const href = lang === "th" ? "fish.th.html" : lang === "ja" ? "fish.ja.html" : "fish.html";
      const link = document.getElementById(`language-${lang}`);
      const query = new URLSearchParams();
      if (ctx.id) query.set("id", ctx.id);
      if (stage) query.set("stage", stage);
      if (ctx.requestedMethod) query.set("route", ctx.requestedMethod);
      const localizedReturn = ctx.localizeReturn(ctx.localReturn, lang);
      if (localizedReturn) query.set("return", localizedReturn);
      link.href = `${href}${query.size ? `?${query.toString()}` : ""}${location.hash || ""}`;
    }
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

  // src/pages/fish/tackle.js
  function localizedFishName(ctx, fish, profileId) {
    const latin = fish.nameLatin || (fish.nameLatinVariants || []).slice().sort((a, b) => b.length - a.length)[0];
    if (ctx.locale === "th")
      return fish.nameTh || distinctFishNames(fish.nameThVariants || []).join(" / ") || latin || fish.nameJa || ctx.copy.unknownName(profileId);
    if (ctx.locale === "ja") return fish.nameJa || ctx.copy.unknownFish(profileId);
    return fish.nameEn || latin || fish.nameJa || ctx.copy.unknownFish(profileId);
  }
  function localizedItemName(ctx, item) {
    if (ctx.locale === "th")
      return item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id;
    if (ctx.locale === "ja") return item.nameJa || item.nameEn || item.id;
    return item.nameEn || item.nameJa || item.id;
  }
  function getLocations(ctx, locationData) {
    const table = locationData?.fish || locationData || {};
    return table[ctx.id]?.locations || [];
  }
  function matchingItems(ctx, items) {
    const found = /* @__PURE__ */ new Map();
    for (const item of items) {
      const use = item.playerUse || {};
      if (!["bait", "lure", "fly"].includes(item.category)) continue;
      if (item.category === "bait") {
        const routes = use.fishIdsByRoute || {};
        const allowedRoutes = ["float", "sinker"].filter(
          (route) => (routes[route] || []).includes(ctx.id)
        );
        if (allowedRoutes.length)
          found.set(`${item.category}:${item.id}`, { item, routes: allowedRoutes });
      } else if ((use.fishIds || []).includes(ctx.id)) {
        found.set(`${item.category}:${item.id}`, { item, routes: [] });
      }
    }
    return [...found.values()].sort(
      (a, b) => ctx.localizedItemName(a.item).localeCompare(ctx.localizedItemName(b.item), ctx.locale) || a.item.id.localeCompare(b.item.id)
    );
  }
  function itemLink(ctx, entry, stage) {
    const item = entry.item;
    const query = new URLSearchParams({ category: item.category, id: item.id });
    if (!["food", "general_tool"].includes(item.category)) query.set("fish", ctx.id);
    if (stage) query.set("stage", stage);
    query.set("return", ctx.currentFishPath(stage));
    const itemHref = `${ctx.itemPath()}?${query.toString()}`;
    const image = item.image ? `<a class="entity-link-image" href="${ctx.escapeHtml(itemHref)}" aria-label="${ctx.escapeHtml(ctx.copy.viewItem)}: ${ctx.escapeHtml(ctx.localizedItemName(item))}"><img loading="lazy" src="${ctx.escapeHtml(item.image)}" alt=""></a>` : "";
    const routeLinks = entry.routes.length ? `<span class="item-routes">${entry.routes.map((route) => {
      const routeQuery = new URLSearchParams(query);
      routeQuery.set("route", route);
      return `<a href="${ctx.escapeHtml(ctx.itemPath())}?${routeQuery.toString()}" class="route-button item-route">${ctx.escapeHtml(route === "float" ? ctx.copy.float : ctx.copy.sinker)}</a>`;
    }).join("")}</span>` : "";
    return `<article class="entity-link">${image}<a class="entity-link-name" href="${ctx.escapeHtml(itemHref)}"><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><span class="muted">ID ${ctx.escapeHtml(item.id)}</span></a>${routeLinks}</article>`;
  }
  function starterOffers(ctx, entries, stage) {
    const methods = [
      ["float", ctx.copy.float],
      ["sinker", ctx.copy.sinker],
      ["lure", ctx.copy.lure],
      ["fly", ctx.copy.fly]
    ];
    return methods.flatMap(([method, label]) => {
      const candidates = [];
      for (const entry of entries) {
        const item = entry.item;
        if (method === "float" || method === "sinker") {
          if (item.category !== "bait" || !entry.routes.includes(method)) continue;
        } else if (item.category !== method) continue;
        for (const shop of item.playerUse?.shops || []) {
          if (String(shop.stage) !== stage || shop.condition) continue;
          const price = method === "fly" ? shop.bundle?.shopPriceYen : item.priceYen;
          if (!Number.isFinite(price) || price < 0) continue;
          candidates.push({ entry, method, label, price, bundle: shop.bundle || null });
        }
      }
      candidates.sort((a, b) => a.price - b.price || a.entry.item.id.localeCompare(b.entry.item.id));
      return candidates.length ? [candidates[0]] : [];
    });
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
  function stockedInArea(item, stage) {
    return (item.playerUse?.shops || []).some(
      (shop) => Number(shop.stage) === stage && !shop.condition
    );
  }
  function lureCoverageForArea(options, stage) {
    const area = Number(stage);
    const localPairs = Number.isInteger(area) && area >= 1 && area <= 6 ? options.pairs.filter((pair) => pair.items.every((item) => stockedInArea(item, area))) : [];
    return {
      stage: area,
      coverageCount: options.coverageCount,
      localPairs,
      pair: localPairs[0] || options.pairs[0] || null,
      isLocal: localPairs.length > 0
    };
  }

  // src/pages/fish/lure-kit.js
  function availableInArea(item, stage) {
    return (item.playerUse?.shops || []).some(
      (shop) => String(shop.stage) === stage && !shop.condition
    );
  }
  function lureKitTitle(ctx) {
    if (ctx.locale === "th") return "ถ้าจะตกปลาอื่นด้วย: ชุดลัวร์สองชิ้น";
    if (ctx.locale === "ja") return "ほかの魚も狙うなら：ルアー2種類のセット";
    return "Fishing for other species too? A two-lure kit";
  }
  function lureKitIntro(ctx, count, total) {
    if (ctx.locale === "th")
      return `คู่นี้ครอบคลุม ${count} โปรไฟล์ที่ผ่านเงื่อนไขลัวร์ ราคา ¥${total} หากซื้อใหม่ครบคู่ ไม่ต้องซื้อซ้ำถ้ามีคู่ที่ครอบคลุมครบอยู่แล้ว`;
    if (ctx.locale === "ja")
      return `この組み合わせはルアー判定を通る${count}プロフィールをカバーし、新規購入は合計${total}円です。すでに全範囲をカバーする組を持っていれば買い直す必要はありません。`;
    return `This pair covers all ${count} profiles that pass the lure check, for ¥${total} when buying new. Keep a full-coverage pair you already own.`;
  }
  function lureKitAvailability(ctx, localPair, hasLocalLureOffer) {
    if (ctx.locale === "th")
      return localPair ? "ซื้อครบคู่นี้ได้ในด่านที่เลือก" : hasLocalLureOffer ? "ด่านที่เลือกขายไม่ครบคู่นี้ ใช้ตัวเลือกสำหรับปลาตัวนี้ด้านบน หรือดูด่านที่ขายแต่ละชิ้นด้านล่าง" : "ด่านที่เลือกไม่มีรายการขายปกติของลัวร์สำหรับปลานี้ ใช้ลัวร์ที่ผ่านเงื่อนไขซึ่งมีอยู่แล้ว หรือเปิดด่านขายจากการ์ดด้านบน";
    if (ctx.locale === "ja")
      return localPair ? "選択中エリアで両方買えます。" : hasLocalLureOffer ? "選択中エリアでは両方は揃いません。上の対象魚用候補を使うか、下の販売エリアを確認してください。" : "選択中エリアではこの魚向けの通常ルアー販売記録がありません。対応ルアーを持っていれば使い、上の販売エリアへのリンクを確認してください。";
    return localPair ? "Both items are stocked in your selected area." : hasLocalLureOffer ? "The selected area does not stock the full pair. Use the single-fish choice above or check each item’s sale areas below." : "No regular lure sale for this fish is recorded in the selected area. Use a compatible lure you already own or open a recorded sale area from the action above.";
  }
  function lureKitTarget(ctx, item) {
    const accepts = (item.playerUse?.fishIds || []).includes(ctx.id);
    if (ctx.locale === "th")
      return accepts ? "ใช้กับปลาที่กำลังดูได้" : "ชิ้นนี้ไว้ครอบคลุมปลาอื่นในชุด";
    if (ctx.locale === "ja") return accepts ? "表示中の魚に対応" : "このセットでほかの魚を担当";
    return accepts ? "Works for the fish you are viewing" : "Covers other fish in this kit";
  }
  function lureKitCard(ctx, item, stage, pairKey2) {
    const stages = [
      ...new Set(
        (item.playerUse?.shops || []).filter((shop) => !shop.condition).map((shop) => shop.stage)
      )
    ].sort((a, b) => a - b);
    const query = new URLSearchParams({
      category: "lure",
      id: item.id,
      fish: ctx.id,
      stage,
      route: "lure",
      kit: pairKey2,
      return: ctx.currentFishPath(stage)
    });
    const href = `${ctx.itemPath()}?${query}`;
    const saleAreas = stages.map((area) => ctx.escapeHtml(ctx.copy.stage(area))).join(" / ");
    return `<article class="detail-section kit-item" data-item="lure:${item.id}"><a class="entity-link" href="${ctx.escapeHtml(href)}"><img src="${ctx.escapeHtml(item.image)}" alt=""><span><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><small>¥${item.priceYen} · ${saleAreas}</small><small>${ctx.escapeHtml(lureKitTarget(ctx, item))}</small></span></a></article>`;
  }
  function lureKitScope(ctx) {
    if (ctx.locale === "th")
      return "ครอบคลุมเงื่อนไขชนิดเหยื่อ ไม่ได้รับประกันว่าปลาจะกินหรือดึงขึ้นสำเร็จ";
    if (ctx.locale === "ja")
      return "ルアー種類の判定をカバーするもので、食いつきや取り込みの保証ではありません。";
    return "Coverage is lure-type compatibility, not a guarantee of a bite or landing.";
  }
  function renderReusableKit(ctx, items, stage) {
    const lures = items.filter((item) => item.category === "lure");
    const coverage = lureCoverageOptions(lures);
    if (!lures.some((item) => (item.playerUse?.fishIds || []).includes(ctx.id))) return "";
    const { pair, isLocal } = lureCoverageForArea(coverage, stage);
    if (!pair) return "";
    const hasLocalLureOffer = lures.some(
      (item) => (item.playerUse?.fishIds || []).includes(ctx.id) && availableInArea(item, String(stage))
    );
    const cards = pair.items.map((item) => lureKitCard(ctx, item, stage, pair.key)).join("");
    return `<section class="detail-section reusable-kit" data-kit="${pair.key}" data-coverage="${pair.coverageCount}" data-total="${pair.totalYen}" data-local="${isLocal}"><h3>${ctx.escapeHtml(lureKitTitle(ctx))}</h3><p>${ctx.escapeHtml(lureKitIntro(ctx, pair.coverageCount, pair.totalYen))}</p><p><strong>${ctx.escapeHtml(lureKitAvailability(ctx, isLocal, hasLocalLureOffer))}</strong></p><div class="detail-grid">${cards}</div><p class="muted">${ctx.escapeHtml(lureKitScope(ctx))}</p></section>`;
  }

  // src/pages/fish/fly-backup.js
  function findBackupOffers(ctx, items, choices) {
    const definitions = choices?.profiles?.[ctx.id]?.bundles || [];
    if (definitions.length !== 3) return [];
    const offers = definitions.map((def) => {
      const body = items.find((item) => item.category === "fly" && item.id === def.body);
      const shop = body?.playerUse?.shops?.find(
        (entry) => entry.stage === def.stage && entry.bundle?.body === def.body && entry.bundle?.wing === def.wing && entry.bundle?.tail === def.tail
      );
      return { def, body, bundle: shop?.bundle };
    });
    return offers.every((offer) => offer.body?.playerUse?.fishIds?.includes(ctx.id) && offer.bundle) ? offers : [];
  }
  function backupTitle(ctx) {
    if (ctx.locale === "th") return "ปลาไม่กินฟลาย? ทางเลือกเพื่อผ่านเงื่อนไขซ่อนหนึ่งข้อ";
    if (ctx.locale === "ja") return "フライに反応しない？ 隠れた判定1つを避ける候補";
    return "No bite on a fly? Alternatives for one hidden check";
  }
  function backupIntro(ctx, total) {
    if (ctx.locale === "th")
      return `ถ้าจะเตรียมฟลายสำรอง ชุดด้านล่างมีราคารวมต่ำที่สุดในกลุ่มที่ซื้อชุดสำเร็จรูป 3 ชุดจากร้านทั้ง 6 ด่านแล้วผ่านเงื่อนไขนี้สำหรับปลาตัวนี้ ซื้อใหม่รวม ¥${total} และบอดี้ทั้งสามผ่านเงื่อนไขของปลาที่กำลังดู เก็บไว้เป็นชุดสำรอง ไม่จำเป็นต้องซื้อทั้งหมดเพื่อเริ่มตก`;
    if (ctx.locale === "ja")
      return `予備を用意するなら、この魚の条件を満たす店売り3セットのうち、全6エリアの在庫で合計価格が最安の候補です。新規購入は合計${total}円で、3つの本体すべてが表示中の魚の判定を通ります。最初から全部買う必要はありません。`;
    return `For backup flies, these are the lowest-total-price three ready-made sets across all six recorded area stocks that satisfy this check for the current fish. They cost ¥${total} in total when buying new. All three bodies pass the current fish’s profile check. You do not need to buy all three to start fishing.`;
  }
  function backupAction(ctx) {
    if (ctx.locale === "th")
      return "สลับลองสามชุดในฉากที่โหลดอยู่เดิม โดยไม่พักโรงแรมหรือออกไปโหลดฉากใหม่ ตามโค้ดอย่างน้อยหนึ่งชุดจะไม่ติดเงื่อนไขซ่อนที่บล็อกจากบอดี้หรือปีก เมื่อค่าซ่อนคงเดิม การตีชุดเดิมซ้ำไม่ได้สุ่มค่านี้ใหม่";
    if (ctx.locale === "ja")
      return "宿泊やフィールド再生成を挟まず、同じ読み込み済みフィールドで3セットを切り替えます。隠れた値が一定なら、コード上は少なくとも1セットがボディ・ウィングの一致による遮断を避けます。同じセットの投げ直しはこの値を再抽選しません。";
    return "Switch among the three sets in the same loaded field, without an inn stay or field reload. With the stored hidden values unchanged, the code guarantees at least one avoids the body/wing equality block. Recasting the same set does not reroll those values.";
  }
  function backupScope(ctx) {
    if (ctx.locale === "th")
      return "นี่ผ่านเงื่อนไขซ่อนเพียงหนึ่งข้อ ไม่รับประกันว่าปลาจะกินหรือตกขึ้นได้ ยังมีตำแหน่ง จังหวะ และเงื่อนไขอื่น เส้นทางสลับชุดนี้เป็นข้อสรุปจากโค้ด ยังไม่มีผลทดลองตกจริงยืนยันชุดนี้";
    if (ctx.locale === "ja")
      return "回避するのは隠れた判定1つだけで、食いつき・取り込みの保証ではありません。位置・タイミング・別条件も残ります。この切替手順はコードに基づく結論で、実釣比較は未実施です。";
    return "This avoids only one hidden check. Position, timing and other checks still apply; it does not guarantee a bite or landing. The switching strategy is derived from code and has not been confirmed by a controlled fishing trial.";
  }
  function backupLocation(ctx, def) {
    if (ctx.locale === "th") return `ร้านด่าน ${def.stage} · รายการฟลายที่ ${def.slot + 1}`;
    if (ctx.locale === "ja") return `エリア${def.stage}の店・フライ一覧の${def.slot + 1}番目`;
    return `Area ${def.stage} shop · fly entry ${def.slot + 1}`;
  }
  function backupBuyLabel(ctx) {
    if (ctx.locale === "th") return "ดูร้านที่ขายชุดนี้";
    if (ctx.locale === "ja") return "このセットの販売店を見る";
    return "Find the shop for this set";
  }
  function backupParts(items, def) {
    return [
      ["fly", def.body],
      ["fly_wing", def.wing],
      ["fly_tail", def.tail]
    ].filter(([, id]) => id !== "00").map(([category, id]) => items.find((item) => item.category === category && item.id === id)).filter(Boolean);
  }
  function backupPartsNote(ctx) {
    if (ctx.locale === "th")
      return "รูปด้านล่างคือชิ้นส่วนในชุดสำเร็จรูปนี้ ซื้อเป็นชุดตามรายการร้านด้านบน ไม่ใช่ซื้อแต่ละชิ้นแยกกัน";
    if (ctx.locale === "ja")
      return "下の画像はこの完成セットの構成品です。上記の店頭項目でセットとして買い、部品を個別購入する意味ではありません。";
    return "The images below are parts of this ready-made set. Buy the listed shop bundle, not these parts separately.";
  }
  function backupShopLink(ctx, def, stage) {
    const params = new URLSearchParams({
      stage: String(def.stage),
      place: "town",
      category: "fly",
      id: def.body,
      fish: ctx.id,
      return: ctx.currentFishPath(stage)
    });
    return `shops${ctx.locale === "en" ? "" : `.${ctx.locale}`}.html?${params}`;
  }
  function backupCard(ctx, offer, items, stage) {
    const { def, bundle } = offer;
    const parts = backupParts(items, def).map((item) => ctx.itemLink({ item, routes: [] }, stage)).join("");
    return `<article class="detail-section fly-backup" data-bundle="${def.body}/${def.wing}/${def.tail}" data-price="${bundle.shopPriceYen}"><h4>${ctx.escapeHtml(backupLocation(ctx, def))} · ¥${bundle.shopPriceYen}</h4><p>${ctx.escapeHtml(backupPartsNote(ctx))}</p>${parts}<a class="route-button" href="${ctx.escapeHtml(backupShopLink(ctx, def, stage))}">${ctx.escapeHtml(backupBuyLabel(ctx))} ↗</a></article>`;
  }
  function backupCards(ctx, offers, items, stage) {
    return offers.map((offer) => backupCard(ctx, offer, items, stage)).join("");
  }
  function backupResearchLink(ctx) {
    const source = "https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fly-selection-practical-research.md";
    return `<a href="${source}">${ctx.escapeHtml(ctx.copy.evidence)} ↗</a>`;
  }
  function renderFlyFallback(ctx, items, stage, choices) {
    const offers = findBackupOffers(ctx, items, choices);
    if (!offers.length) return "";
    const total = offers.reduce((sum, offer) => sum + offer.bundle.shopPriceYen, 0);
    const cards = backupCards(ctx, offers, items, stage);
    return `<details id="fly-backup" class="detail-section fly-fallback" data-total="${total}"><summary>${ctx.escapeHtml(backupTitle(ctx))}</summary><p>${ctx.escapeHtml(backupIntro(ctx, total))}</p><p><strong>${ctx.escapeHtml(backupAction(ctx))}</strong></p><div class="detail-grid">${cards}</div><p class="muted">${ctx.escapeHtml(backupScope(ctx))}</p>${backupResearchLink(ctx)}</details>`;
  }

  // src/pages/fish/fishing-setup.js
  function stockedInArea2(item, stage) {
    return item.playerUse?.shops?.some(
      (shop) => String(shop.stage) === String(stage) && !shop.condition
    );
  }
  function orderedForPurchase(items) {
    return items.filter((item) => Number.isFinite(item.priceYen) && item.playerUse?.shops?.length).sort((a, b) => a.priceYen - b.priceYen || a.id.localeCompare(b.id));
  }
  function rigRoles(items, method) {
    const choose = (candidates) => ({ candidates: orderedForPurchase(candidates) });
    const hooks = items.filter((item) => item.category === "hook" && item.rawFields?.["+1"] === 0);
    const floatWeights = items.filter((item) => {
      if (item.category !== "float_weight") return false;
      const id = Number.parseInt(item.id, 16);
      return method === "float" ? id <= 8 : id >= 9;
    });
    return [
      { role: "hook", ...choose(hooks) },
      { role: method, ...choose(floatWeights) }
    ];
  }
  function rigTitle(ctx) {
    if (ctx.locale === "th") return "ตะขอและชุดทุ่น/ตะกั่วที่ต้องเตรียม";
    if (ctx.locale === "ja") return "準備する針とウキ・オモリ";
    return "Hook and float/sinker to prepare";
  }
  function rigOwnedNote(ctx) {
    if (ctx.locale === "th")
      return "ใช้ตะขอและทุ่น/ตะกั่วที่มีให้ตรงวิธีนี้ ซื้อเฉพาะของที่ขาด ตัวเลือกตะขอด้านล่างราคาต่ำสุดในรุ่นที่เกมไม่ได้ผูกกับปลาเฉพาะชนิด ไม่ใช่อันดับจับง่าย";
    if (ctx.locale === "ja")
      return "手持ちの針と、この釣り方に合うウキ・オモリを使い、不足分だけ買います。針は特定の魚との一致条件がない型の最安候補で、取り込みやすさの順位ではありません。";
    return "Use an owned hook and a float or sinker matching this method; buy only missing equipment. The hook is the cheapest stocked model without a species-specific match, not a landing-success winner.";
  }
  function rigRoleName(ctx, role) {
    if (role === "hook") {
      if (ctx.locale === "th") return "ตะขอ";
      if (ctx.locale === "ja") return "針";
      return "Hook";
    }
    return role === "float" ? ctx.copy.float : ctx.copy.sinker;
  }
  function rigPurchaseAction(ctx, stocked, stage, item) {
    if (stocked) {
      if (ctx.locale === "th") return `ซื้อใหม่ที่ด่าน ${stage} ราคาเต็ม ¥${item.priceYen}`;
      if (ctx.locale === "ja") return `エリア${stage}で新規購入、全額${item.priceYen}円。`;
      return `Buy new in area ${stage} at the full ¥${item.priceYen}.`;
    }
    if (ctx.locale === "th")
      return "ด่านนี้ไม่มีสินค้าประเภทนี้ในสต็อกที่ตรวจ ใช้ของที่มี หรือเปิดหน้าชิ้นนี้เพื่อดูด่านที่ขายก่อนเดินทาง";
    if (ctx.locale === "ja")
      return "このエリアに在庫の記録がありません。手持ちを使うか、この道具の販売エリアを確認してから移動します。";
    return "No stock of this equipment type is recorded in this area. Use an owned item or open this choice to check sale areas before travelling.";
  }
  function rigChoiceLink(ctx, choice, method, stage) {
    const params = new URLSearchParams({
      category: choice.category,
      id: choice.id,
      fish: ctx.id,
      stage: String(stage),
      route: method,
      return: ctx.currentFishPath(stage) + "#starter-" + method
    });
    return `${ctx.itemPath()}?${params}`;
  }
  function rigChoiceCard(ctx, role, method, stage) {
    const stocked = role.candidates.filter((item) => stockedInArea2(item, stage));
    const choice = stocked[0] || role.candidates[0];
    if (!choice) return "";
    const localStock = stocked.length > 0;
    const action = rigPurchaseAction(ctx, localStock, stage, choice);
    return `<div class="method-rig-choice" data-rig-role="${role.role}" data-rig-item="${choice.id}" data-rig-local="${Boolean(localStock)}"><h5>${ctx.escapeHtml(rigRoleName(ctx, role.role))}</h5><a class="entity-link" href="${ctx.escapeHtml(rigChoiceLink(ctx, choice, method, stage))}"><img src="${ctx.escapeHtml(choice.image)}" alt=""><span><strong>${ctx.escapeHtml(ctx.localizedItemName(choice))}</strong><small>${ctx.escapeHtml(action)}</small></span></a></div>`;
  }
  function rigNonBaitNote(ctx, method) {
    const note = method === "lure" ? ctx.locale === "th" ? "ลัวร์ไม่ใช้ตะขอและทุ่นของชุดเหยื่อ จึงไม่ต้องซื้อสองหมวดนี้มาเพิ่มให้ชุดลัวร์" : ctx.locale === "ja" ? "ルアーの準備ではエサ釣りの針・ウキを使わないため、このセット用に追加購入しません。" : "Lure setup does not use the bait-rig hook or float; do not buy those as additions to this lure set." : ctx.locale === "th" ? "ฟลายไม่ใช้ตะขอของชุดเหยื่อ และเกมโหลดเครื่องหมายให้อัตโนมัติ ไม่ต้องซื้อเครื่องหมายเพื่อเพิ่มประสิทธิภาพชุดนี้" : ctx.locale === "ja" ? "フライではエサ釣りの針を使わず、目印は自動設定されます。性能向上のために目印を追加購入しません。" : "Fly setup clears the bait hook and loads its marker automatically. Do not buy a marker expecting to improve this set.";
    return `<p class="method-equipment-note">${ctx.escapeHtml(note)}</p>`;
  }
  function rigNewTotal(ctx, method, stage, items, roles, baitPrice) {
    const style = method === "float" ? 1 : 2;
    const rods = orderedForPurchase(
      items.filter((item) => item.category === "rod" && item.decodedFields?.styleCode === style)
    );
    const localRod = rods.find((rod) => stockedInArea2(rod, stage));
    const localParts = roles.map((role) => role.candidates.find((item) => stockedInArea2(item, stage)));
    if (!localRod || !localParts.every(Boolean)) return null;
    return localRod.priceYen + baitPrice + localParts.reduce((sum, item) => sum + item.priceYen, 0);
  }
  function rigTotalLine(ctx, total) {
    if (total === null) return "";
    const label = ctx.locale === "th" ? `ซื้อคัน + เหยื่อ + ตะขอ + ทุ่น/ตะกั่วใหม่ทั้งหมด รวม ¥${total}` : ctx.locale === "ja" ? `竿・エサ・針・ウキ／オモリをすべて新規購入：合計${total}円。` : `Buying the rod, bait, hook and float/sinker all new: ¥${total} total.`;
    return `<p class="rig-total" data-rig-total="${total}"><strong>${ctx.escapeHtml(label)}</strong></p>`;
  }
  function rigFloatFallback(ctx, method, stage, items, roles) {
    if (method !== "sinker" || roles[1].candidates.some((item) => stockedInArea2(item, stage)))
      return "";
    const hasFloat = ctx.starterOffers(ctx.matchingItems(items), stage).some((offer) => offer.method === "float");
    if (!hasFloat) return "";
    const label = ctx.locale === "th" ? "ยังไม่มีตะกั่ว? เลือกชุดทุ่นที่ปลาเป้าหมายรับได้ในด่านนี้" : ctx.locale === "ja" ? "オモリがない場合、このエリアの対象魚に適合するウキセットを選ぶ" : "No sinker yet? Choose the target-compatible float setup in this area";
    return `<p><a class="route-button" data-rig-fallback="float" href="#starter-float">${ctx.escapeHtml(label)} ↓</a></p>`;
  }
  function rigEvidenceLink(ctx) {
    const label = ctx.locale === "th" ? "หลักฐานการใช้ตะขอและทุ่น/ตะกั่ว" : ctx.locale === "ja" ? "針・ウキ・オモリの根拠" : "Hook and float/sinker evidence";
    return `<details><summary>${ctx.escapeHtml(ctx.copy.evidence)}</summary><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/hook-practical-research.md">${ctx.escapeHtml(label)} ↗</a></details>`;
  }
  function renderRodForMethod(ctx, method, stage, items, starterPrice, rigTotal = null) {
    const style = { float: 1, sinker: 2, lure: 4, fly: 8 }[method];
    const rods = items.filter(
      (item) => item.category === "rod" && item.decodedFields?.styleCode === style
    );
    const priced = orderedForPurchase(rods);
    const localRods = priced.filter((rod) => stockedInArea2(rod, stage));
    const choice = localRods[0] || priced[0];
    if (!choice) return "";
    const title = ctx.locale === "th" ? "คันสำหรับวิธีนี้" : ctx.locale === "ja" ? "この釣り方の竿" : "Rod for this method";
    const owned = ctx.locale === "th" ? "ถ้ามีคันของวิธีนี้อยู่แล้ว ใช้ต่อได้ ไม่ต้องซื้อซ้ำ" : ctx.locale === "ja" ? "この釣り方の竿を持っているなら、そのまま使い、買い直す必要はない。" : "Keep a rod for this method if you already own one; there is no need to buy another.";
    const decision = rodPurchaseDecision(ctx, localRods, stage, choice);
    const baseTotal = rodSetupTotal(method, starterPrice, localRods, choice, rigTotal);
    const upgrades = renderRodUpgradeChoices(ctx, method, stage, localRods, choice, baseTotal);
    const total = nonBaitSetupTotal(ctx, method, baseTotal);
    return `<section class="method-rod" data-method-rod="${method}" data-rod="${choice.id}" data-rod-local="${Boolean(localRods.length)}"><h4>${ctx.escapeHtml(title)}</h4><p>${ctx.escapeHtml(owned)}</p><p>${ctx.escapeHtml(decision)}</p>${ctx.itemLink({ item: choice, routes: [] }, stage)}${total}${upgrades}</section>`;
  }
  function nonBaitSetupTotal(ctx, method, total) {
    if (!["lure", "fly"].includes(method) || !Number.isFinite(total)) return "";
    return `<p class="rig-total" data-method-setup-total="${total}"><strong>${ctx.escapeHtml(setupTotalNote(ctx, total))}</strong></p>`;
  }
  function rodSetupTotal(method, starterPrice, localRods, budgetRod, rigTotal) {
    if (Number.isFinite(rigTotal)) return rigTotal;
    if (!localRods.length || !Number.isFinite(starterPrice) || !["lure", "fly"].includes(method))
      return null;
    return budgetRod.priceYen + starterPrice;
  }
  function rodMetric(item, key) {
    const metrics = item.playerUse?.rodMetrics;
    return Number.isFinite(metrics?.[key]) ? metrics[key] : null;
  }
  function decisionBackLink(ctx, method, stage) {
    const [page, ...queryParts] = ctx.currentFishPath(stage).split("?");
    const query = new URLSearchParams(queryParts.join("?"));
    if (ctx.id) query.set("id", ctx.id);
    query.set("stage", String(stage));
    query.set("route", method);
    return `${page}?${query.toString()}#starter-${method}`;
  }
  function upgradeRodLink(ctx, item, method, stage) {
    const query = new URLSearchParams({
      category: "rod",
      id: item.id,
      fish: ctx.id,
      stage: String(stage),
      route: method,
      return: decisionBackLink(ctx, method, stage)
    });
    return `${ctx.itemPath()}?${query.toString()}`;
  }
  function metricLeader(rods, key, secondaryKey) {
    return rods.filter(
      (rod) => rod.rodDecision?.recommendation && rodMetric(rod, key) !== null && rodMetric(rod, secondaryKey) !== null
    ).sort(
      (a, b) => rodMetric(b, key) - rodMetric(a, key) || rodMetric(b, secondaryKey) - rodMetric(a, secondaryKey) || a.priceYen - b.priceYen || a.id.localeCompare(b.id)
    )[0];
  }
  function rodUpgradeLeaders(rods, budgetRod) {
    if (!budgetRod || rods.length < 2) return [];
    const baselineAim = rodMetric(budgetRod, "aimCutoffAt100Hp");
    const baselineReach = rodMetric(budgetRod, "reachMultiplierRaw");
    if (baselineAim === null || baselineReach === null) return [];
    const leaders = [
      ["aim", metricLeader(rods, "aimCutoffAt100Hp", "reachMultiplierRaw")],
      ["reach", metricLeader(rods, "reachMultiplierRaw", "aimCutoffAt100Hp")]
    ];
    const choices = /* @__PURE__ */ new Map();
    for (const [dimension, item] of leaders) {
      if (!item) continue;
      const metricKey = dimension === "aim" ? "aimCutoffAt100Hp" : "reachMultiplierRaw";
      if (rodMetric(item, metricKey) <= rodMetric(budgetRod, metricKey)) continue;
      const choice = choices.get(item.id) || { item, dimensions: [] };
      choice.dimensions.push(dimension);
      choices.set(item.id, choice);
    }
    return [...choices.values()];
  }
  function upgradeHeadline(ctx, dimensions) {
    if (ctx.locale === "th") {
      if (dimensions.length === 2) return "ช่วงเล็งและขอบเขตตำแหน่งปลาสูงสุดในร้านด่านนี้";
      return dimensions[0] === "aim" ? "ช่วงเล็งยาวที่สุดในร้านด่านนี้" : "ขอบเขตตำแหน่งปลาสูงที่สุดในร้านด่านนี้";
    }
    if (ctx.locale === "ja") {
      if (dimensions.length === 2) return "このエリアの店頭で照準時間と魚位置境界が最大";
      return dimensions[0] === "aim" ? "このエリアの店頭で照準時間が最長" : "このエリアの店頭で魚位置境界が最大";
    }
    if (dimensions.length === 2)
      return "Longest aim window and highest fish-position boundary in this area";
    return dimensions[0] === "aim" ? "Longest aim window in this area" : "Highest fish-position boundary in this area";
  }
  function upgradeEffect(ctx, dimension, item, budgetRod) {
    const aim = rodMetric(item, "aimCutoffAt100Hp");
    const baseAim = rodMetric(budgetRod, "aimCutoffAt100Hp");
    const reach = rodMetric(item, "reachMultiplierRaw");
    const baseReach = rodMetric(budgetRod, "reachMultiplierRaw");
    const style = item.decodedFields?.styleCode;
    if (dimension === "aim" && [2, 4].includes(style)) {
      if (ctx.locale === "th")
        return `ที่ HP 100 ช่วงเล็ง ${aim} เทียบกับ ${baseAim}; HP ต่ำกว่า 100 ทำให้ช่วงเล็งสั้นลง`;
      if (ctx.locale === "ja")
        return `HP100時の照準時間は${aim}、最安竿は${baseAim}。HP100未満では短くなります。`;
      return `At 100 HP, aim cutoff ${aim} vs ${baseAim}; HP below 100 shortens the aim window.`;
    }
    if (dimension === "aim") {
      if (ctx.locale === "th")
        return `ช่วงเล็ง ${aim} เทียบกับคันราคาต่ำสุด ${baseAim} ให้เวลาขยับเป้าก่อนเกมตรวจจุดตกมากขึ้น`;
      if (ctx.locale === "ja")
        return `照準上限は${aim}、最安竿は${baseAim}。投げ先を動かす時間が長くなります。`;
      return `Aim cutoff ${aim} vs ${baseAim} gives you longer to adjust the target before the game checks the spot.`;
    }
    if (ctx.locale === "th")
      return `ตัวคูณขอบเขตปลา ×${reach} เทียบกับ ×${baseReach}; ปลาไปได้ไกลขึ้นก่อนเข้าเส้นทางหนีที่ทำให้อุปกรณ์หายหนึ่งแบบ`;
    if (ctx.locale === "ja")
      return `魚位置境界の倍率は×${reach}、最安竿は×${baseReach}。この特定の道具喪失逃走分岐まで魚に余裕があります。`;
    return `Fish-position boundary ×${reach} vs ×${baseReach} gives more room before one traced tackle-loss escape branch.`;
  }
  function upgradeCost(ctx, item, budgetRod) {
    const difference = item.priceYen - budgetRod.priceYen;
    if (ctx.locale === "th")
      return `ราคาเต็มซื้อใหม่ ¥${item.priceYen}${difference ? ` · เพิ่มจากคันเริ่ม ¥${difference}` : " · ราคาเท่าคันเริ่ม"}`;
    if (ctx.locale === "ja")
      return `新品価格${item.priceYen}円${difference ? ` · 最安竿より${difference}円高い` : " · 最安竿と同額"}`;
    return `Full new-purchase price ¥${item.priceYen}${difference ? ` · ¥${difference} more than the budget rod` : " · same price as the budget rod"}`;
  }
  function upgradeCard(ctx, method, stage, choice, budgetRod, baseTotal) {
    const item = choice.item;
    const benefit = choice.dimensions.map(
      (dimension) => upgradeEffect(ctx, dimension, item, budgetRod)
    );
    const label = upgradeHeadline(ctx, choice.dimensions);
    const image = item.image ? `<img src="${ctx.escapeHtml(item.image)}" alt="">` : "";
    const link = upgradeRodLink(ctx, item, method, stage);
    const total = Number.isFinite(baseTotal) ? setupTotalNote(ctx, baseTotal + item.priceYen - budgetRod.priceYen) : "";
    return `<article class="method-rig-choice method-rod-upgrade" data-rod-upgrade="${item.id}" data-rod-upgrade-dimensions="${choice.dimensions.join(",")}"><h5>${ctx.escapeHtml(label)}</h5><a class="entity-link" href="${ctx.escapeHtml(link)}">${image}<span><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><small>${ctx.escapeHtml(upgradeCost(ctx, item, budgetRod))}</small></span></a>${benefit.map((text) => `<p>${ctx.escapeHtml(text)}</p>`).join("")}${total ? `<p><strong>${ctx.escapeHtml(total)}</strong></p>` : ""}</article>`;
  }
  function setupTotalNote(ctx, total) {
    if (ctx.locale === "th") return `ซื้อของทั้งชุดใหม่รวม ¥${total}`;
    if (ctx.locale === "ja") return `一式を新品で購入した合計${total}円`;
    return `Complete new setup total ¥${total}`;
  }
  function renderRodUpgradeChoices(ctx, method, stage, rods, budgetRod, baseTotal) {
    const choices = rodUpgradeLeaders(rods, budgetRod);
    if (!choices.length) return "";
    const title = ctx.locale === "th" ? "ถ้าต้องการช่วงเล็งหรือขอบเขตที่มากขึ้น" : ctx.locale === "ja" ? "照準時間や魚位置境界を増やしたい場合" : "If you want more aim time or fish-position room";
    const scope = ctx.locale === "th" ? "ตัวคูณขอบเขตนี้เกี่ยวกับเส้นทางหนีที่ทำให้อุปกรณ์หายหนึ่งแบบเท่านั้น ไม่ได้พิสูจน์ว่าปลากินหรือจับง่ายขึ้น; คันนี้ต้องซื้อใหม่ราคาเต็ม" : ctx.locale === "ja" ? "この境界は特定の道具喪失を伴う逃走分岐だけに関係します。食いつきや釣り上げやすさは証明されておらず、新品価格が必要です。" : "This boundary applies to one tackle-loss escape branch only. It does not prove easier bites or catches; the rod costs its full new-purchase price.";
    return `<div class="method-rod-upgrades" data-rod-upgrades-for="${method}"><h5>${ctx.escapeHtml(title)}</h5><div class="detail-grid">${choices.map((choice) => upgradeCard(ctx, method, stage, choice, budgetRod, baseTotal)).join("")}</div><p class="muted">${ctx.escapeHtml(scope)}</p></div>`;
  }
  function rodPurchaseDecision(ctx, localRods, stage, choice) {
    if (!localRods.length) {
      if (ctx.locale === "th")
        return "ด่านนี้ไม่มีคันของวิธีนี้ในสต็อกที่ตรวจ ใช้คันที่มีอยู่ หรือเปิดรายการนี้เพื่อดูด่านที่ขายก่อนเดินทาง; ไม่ต้องซื้อคันต่างสายมาแทน";
      if (ctx.locale === "ja")
        return "このエリアにこの釣り方の竿の在庫は記録されていない。手持ちを使うか、移動前にこの竿の販売エリアを確認する。別の釣り方の竿で代用しない。";
      return "No rod for this method is recorded in this area’s stock. Use one you own, or check this rod’s sale areas before travelling; do not buy a different rod style as a substitute.";
    }
    if (ctx.locale === "th")
      return `ถ้าต้องซื้อใหม่แบบประหยัด คันนี้ถูกที่สุดในสต็อกของวิธีนี้ที่ด่าน ${stage} ราคาเต็ม ¥${choice.priceYen}`;
    if (ctx.locale === "ja")
      return `安く始めるなら、エリア${stage}のこの釣り方の竿で最安。新規購入は全額${choice.priceYen}円。`;
    return `For a budget start, this is the cheapest recorded rod for this method stocked in area ${stage}, at a full ¥${choice.priceYen}.`;
  }
  function renderRigForMethod(ctx, method, stage, items, baitPrice) {
    if (!["float", "sinker"].includes(method)) return rigNonBaitNote(ctx, method);
    const roles = rigRoles(items, method);
    const cards = roles.map((role) => rigChoiceCard(ctx, role, method, stage)).join("");
    const total = rigNewTotal(ctx, method, stage, items, roles, baitPrice);
    const totalLine = rigTotalLine(ctx, total);
    const fallback = rigFloatFallback(ctx, method, stage, items, roles);
    return `<section class="method-rig" data-method-rig="${method}"><h4>${ctx.escapeHtml(rigTitle(ctx))}</h4><p>${ctx.escapeHtml(rigOwnedNote(ctx))}</p>${cards}${totalLine}${fallback}${rigEvidenceLink(ctx)}</section>`;
  }

  // src/pages/fish/maps.js
  function pointCount(ctx, location2) {
    return (location2.points || []).length;
  }
  function slotCount(ctx, location2) {
    return (location2.points || []).reduce((sum, point) => sum + (point.slotIndices?.length || 1), 0);
  }
  function mapSectionKey(stage, map) {
    const keys = (map.pins || []).map((pin) => {
      const x = Number(pin.tileX), y = Number(pin.tileY);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return "";
      const column = Math.floor((x * 16 + 8) / 384) + 1;
      const row = Math.floor((y * 16 + 8) / 384) + 1;
      return `s${stage}-c${column}-r${row}`;
    });
    return keys.length && keys[0] && keys.every((key) => key === keys[0]) ? keys[0] : "";
  }
  function renderAreaMap(ctx, map, location2, fish) {
    if (!map?.image) return "";
    const stage = String(location2.stage), section = mapSectionKey(stage, map), pins = (map.pins || []).filter(
      (pin) => Number.isFinite(Number(pin.x)) && Number.isFinite(Number(pin.y))
    );
    const markers = pins.map(
      (pin) => `<span class="area-map-pin" style="left:${Math.max(0, Math.min(100, Number(pin.x) * 100))}%;top:${Math.max(0, Math.min(100, Number(pin.y) * 100))}%"><img src="${ctx.escapeHtml(fish.image || "")}" alt=""></span>`
    ).join("");
    const mapName = map.name?.[ctx.locale] || map.name?.en || `${ctx.copy.stage(stage)}`;
    const label = `${ctx.copy.stage(stage)} · ${mapName} · ${ctx.copy.configuredPoints(pins.length)}`;
    const href = ctx.fishMapLink(stage, section);
    return `<a class="area-map-preview" data-map-section="${ctx.escapeHtml(section)}" href="${ctx.escapeHtml(href)}" aria-label="${ctx.escapeHtml(label)}"><span class="area-map-canvas"><img class="area-map-ground" loading="lazy" src="${ctx.escapeHtml(map.image)}" alt=""><span aria-hidden="true">${markers}</span></span><span class="area-map-caption"><strong>${ctx.escapeHtml(mapName)}</strong><small>${ctx.escapeHtml(ctx.copy.configuredPoints(pins.length))}</small></span></a>`;
  }
  function emptyPointAdvice(ctx, count) {
    if (count === 1) {
      if (ctx.locale === "th")
        return "ด่านนี้มีจุดที่เกมกำหนดไว้เพียงจุดเดียว ถ้าไม่พบปลา ช่องเกิดนี้อาจไม่ทำงานในรอบนี้ หรือปลาอาจเคลื่อนที่ไปแล้ว ลองตรวจบริเวณใกล้จุดนี้";
      if (ctx.locale === "ja")
        return "このエリアでゲームに設定された地点は1か所だけです。魚がいなければ、この出現枠が無効な状態か、魚が移動した可能性があります。周辺を探してください。";
      return "The game records only one spot for this area. If no fish appears there, its spawn slot may be inactive in this state or the fish may have moved; check the nearby water.";
    }
    if (ctx.locale === "th")
      return "ถ้าจุดหนึ่งไม่มีปลา ให้ลองจุดอื่นที่แสดงไว้ ปลาเคลื่อนที่ได้และจุดเกิดบางแห่งอาจไม่ทำงานในรอบนั้น";
    if (ctx.locale === "ja")
      return "魚がいなければ別の表示地点も試してください。魚は移動し、出現枠が無効の場合もあります。";
    return "If a point is empty, try another marked spot. Fish move, and some spawn slots may be inactive in that state.";
  }
  function renderAreas(ctx, locations, activeStage, fish) {
    if (!locations.length)
      return `<section class="detail-section fish-where-to-go"><h2>${ctx.escapeHtml(ctx.copy.areas)}</h2><p class="empty-state">${ctx.escapeHtml(ctx.copy.unknownArea)}</p></section>`;
    const selected = locations.find((location2) => String(location2.stage) === String(activeStage)) || locations[0];
    const stage = String(selected.stage), name = selected.stageName?.[ctx.locale] || selected.stageName?.en || ctx.copy.stage(stage);
    const maps = (selected.maps || []).map((map) => ctx.renderAreaMap(map, selected, fish)).join("");
    const caution = emptyPointAdvice(ctx, pointCount(ctx, selected));
    return `<section class="detail-section fish-where-to-go" id="fish-area-map"><h2>${ctx.escapeHtml(ctx.copy.areas)}</h2><label class="area-select-label" for="shopping-area">${ctx.escapeHtml(ctx.shoppingCopy.area)}</label><select id="shopping-area" class="area-select">${locations.map((location2) => `<option value="${ctx.escapeHtml(location2.stage)}" ${String(location2.stage) === stage ? "selected" : ""}>${ctx.escapeHtml(ctx.copy.stage(location2.stage))} · ${ctx.escapeHtml(location2.stageName?.[ctx.locale] || location2.stageName?.en || "")}</option>`).join("")}</select><article class="detail-section area-card current-area" data-active="true"><h3>${ctx.escapeHtml(ctx.copy.stage(stage))} · ${ctx.escapeHtml(name)}</h3><p class="area-point-count">${ctx.escapeHtml(ctx.copy.configuredPoints(ctx.pointCount(selected)))}</p><p class="section-lede">${ctx.escapeHtml(caution)}</p>${maps ? `<div class="detail-grid area-map-grid">${maps}</div>` : ""}<a class="route-button" href="${ctx.escapeHtml(ctx.fishMapLink(stage))}">${ctx.escapeHtml(ctx.copy.mapAction)} ↗</a></article></section>`;
  }

  // src/pages/fish/evidence.js
  function evidenceFileLink(ctx, source) {
    const path = ctx.escapeHtml(source);
    return `<a class="evidence-source-link" href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${path}"><code>${path}</code> ↗</a>`;
  }
  function renderEvidence(ctx, fish, locations, compatibleEntries) {
    const sourceSet = /* @__PURE__ */ new Set();
    for (const entry of compatibleEntries) {
      for (const source of entry.item.playerUse?.evidence?.sources || []) sourceSet.add(source);
    }
    const profileOffset = fish.nameSource?.romProfileFileOffset || "";
    const locationDetails = locations.map((location2) => {
      const stage = String(location2.stage);
      const coords = (location2.points || []).map((point) => `(${point.x}, ${point.y})`).join(" · ");
      return `<li><strong>${ctx.escapeHtml(ctx.copy.stage(stage))}:</strong> ${ctx.escapeHtml(ctx.copy.configuredPoints(ctx.pointCount(location2)))} · ${ctx.escapeHtml(ctx.copy.spawnSlots(ctx.slotCount(location2)))}<br>${ctx.escapeHtml(coords || "—")}</li>`;
    }).join("");
    return `<details class="evidence"><summary id="fish-evidence">${ctx.escapeHtml(ctx.copy.evidence)}</summary><p>${ctx.escapeHtml(ctx.copy.evidenceIntro)}</p><dl><dt>${ctx.escapeHtml(ctx.copy.profile)}</dt><dd>${ctx.escapeHtml(ctx.id)}</dd>${profileOffset ? `<dt>${ctx.escapeHtml(ctx.copy.profileOffset)}</dt><dd>${ctx.escapeHtml(profileOffset)}</dd>` : ""}<dt>${ctx.escapeHtml(ctx.copy.source)}</dt><dd>${evidenceFileLink(ctx, "data/rom-fish-locations.json")}</dd>${sourceSet.size ? `<dt>${ctx.escapeHtml(ctx.copy.reference)}</dt><dd><ul class="evidence-sources">${[...sourceSet].map((source) => `<li>${evidenceFileLink(ctx, source)}</li>`).join("")}</ul></dd>` : ""}</dl>${locationDetails ? `<h3>${ctx.escapeHtml(ctx.copy.coords)}</h3><ul>${locationDetails}</ul>` : ""}</details>`;
  }
  function renderExchange(ctx, items, stage) {
    const rewards = items.filter((item) => item.exchangeFishId === ctx.id);
    if (!rewards.length) return "";
    const title = ctx.locale === "th" ? "เก็บปลานี้ไว้แลกของไหม?" : ctx.locale === "ja" ? "この魚を交換用に残す？" : "Keep this fish for an exchange?";
    const text = ctx.locale === "th" ? "ถ้ายังไม่เคยแลกและต้องการหัวไชเท้า 16 ชิ้น เก็บปลายามาโนะคามิหนึ่งตัวในข้องไว้ให้ NPC ด่าน 3 (21,82) ก่อนกินหรือขาย แต่การแลกทับอาหารเดิมทุกช่อง: ใช้อาหารเดิมที่ต้องการก่อน หรือข้ามการแลกถ้าต้องการเก็บอาหารไว้" : ctx.locale === "ja" ? "まだ交換しておらず大根16個が欲しいなら、食べたり売ったりする前にヤマノカミ1匹をびくに残し、エリア3（21,82）の人物へ。ただし食料全枠を上書きする。必要な食料は先に使い、残したいなら交換を見送る。" : "If you have not traded yet and want 16 Daikon, keep one Yamanokami for the area-3 NPC at (21,82) before eating or selling it. The trade replaces every food slot: use wanted food first, or skip the trade to keep it.";
    return `<section class="detail-section" data-fish-exchange><h2>${ctx.escapeHtml(title)}</h2>${rewards.map((item) => `<p>${ctx.escapeHtml(item.exchangeFishAction?.[ctx.locale] || item.exchangeFishAction?.en || text)}</p>${ctx.itemLink({ item, routes: [] }, stage)}`).join("")}</section>`;
  }
  function unconfirmedProfileAction(ctx) {
    const title = ctx.locale === "th" ? "ไม่ต้องจัดชุดตกสำหรับรายการ 43" : ctx.locale === "ja" ? "プロフィール43用の仕掛けを買う必要はありません" : "Do not buy a fishing setup for profile 43";
    const text = ctx.locale === "th" ? "เลือกปลาที่มีชื่อและจุดตกยืนยันแล้วแทน รายการนี้ไม่มีจุดเกิดที่ยืนยันในตารางที่ถอด และไม่มีเหยื่อจริง ลัวร์ หรือตัวฟลายผ่านเงื่อนไขของมัน การมีระเบียนใน ROM ไม่ได้ยืนยันว่าเป็นปลาที่พบและตกได้ตามปกติ" : ctx.locale === "ja" ? "名前と確認済みの釣り場がある魚を選んでください。この項目には抽出した出現表の確認済み地点がなく、エサ・ルアー・フライ本体の判定を通る候補もありません。ROMに行があるだけでは、通常出現して釣れる魚とは確認できません。" : "Choose a named fish with confirmed fishing spots instead. This entry has no confirmed point in the extracted spawn table, and no bait, lure or fly body passes its recorded check. A row in the ROM does not establish that it normally appears and can be caught.";
    return `<section class="detail-section" data-unconfirmed-profile-action><h2>${ctx.escapeHtml(title)}</h2><p>${ctx.escapeHtml(text)}</p><a class="route-button" href="${ctx.escapeHtml(ctx.cataloguePath())}?category=all#catalogue">${ctx.locale === "th" ? "เลือกปลาอื่นจากช่องค้นหา" : ctx.locale === "ja" ? "検索欄で別の魚を選ぶ" : "Choose another fish in the search field"} ↗</a></section>`;
  }

  // src/shared/lib/hp-recovery-action.js
  var labels = {
    th: "เลือกอาหารฟื้น HP และดูแหล่งซื้อ",
    ja: "HP回復用の食料と販売場所を選ぶ",
    en: "Choose recovery food and see where to buy it"
  };
  function hpRecoveryAction(options) {
    const { locale, cataloguePath: cataloguePath2, stage, returnPath, source, escapeHtml: escapeHtml2 } = options;
    const query = new URLSearchParams({ category: "food", return: returnPath });
    if (/^[1-6]$/.test(String(stage))) query.set("stage", String(stage));
    const href = `${cataloguePath2}?${query}#category-decisions`;
    return `<a class="route-button" data-hp-food-action data-hp-source="${escapeHtml2(source)}" href="${escapeHtml2(href)}">${escapeHtml2(labels[locale] || labels.en)} ↗</a>`;
  }

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/pages/fish/shopping.js
  function compatibilityGroup(ctx, entries, category, stage) {
    const group = entries.filter((entry) => entry.item.category === category);
    if (!group.length) return "";
    const title = category === "fly" ? ctx.copy.flyCandidates : ctx.copy[category];
    const cards = group.map((entry) => ctx.itemLink(entry, stage)).join("");
    const condition = category === "fly" ? flyGroupCondition(ctx) : "";
    return `<details class="detail-section" data-compatible-group="${category}"><summary><span class="detail-section-title" role="heading" aria-level="2">${ctx.escapeHtml(title)}</span><span class="muted">${group.length}</span></summary>${condition}<div class="detail-grid">${cards}</div></details>`;
  }
  function flyGroupCondition(ctx) {
    return `<p data-fly-profile-only>${ctx.escapeHtml(ctx.copy.flyProfileOnly)}</p><a class="route-button" data-fly-backup-link href="#fly-backup">${ctx.escapeHtml(ctx.copy.flyBackupAction)} ↑</a>`;
  }
  function renderCompatibility(ctx, entries, stage) {
    const groups = ["bait", "lure", "fly"].map((category) => compatibilityGroup(ctx, entries, category, stage)).join("");
    return groups || `<p class="empty-state">${ctx.escapeHtml(ctx.copy.noCompatibility)}</p>`;
  }
  function aimTip(ctx, method, stage) {
    if (!["lure", "sinker"].includes(method)) return "";
    const text = ctx.locale === "th" ? "ก่อนใช้คันลัวร์หรือคันหวด เติม HP ให้ถึง 100 เพื่อให้ได้เวลาเล็งเต็มของคันนั้น ไม่ใช่โบนัสโอกาสปลากิน" : ctx.locale === "ja" ? "ルアー竿・投げ竿を使う前にHPを100まで回復すると、竿本来の照準時間になります。食いつき率のボーナスではありません。" : "Restore HP to 100 before lure or casting fishing to get the rod’s full aim window. This does not add a bite-rate bonus.";
    const action = hpRecoveryAction({
      locale: ctx.locale,
      cataloguePath: ctx.cataloguePath(),
      stage,
      returnPath: `${ctx.currentFishPath(stage)}#starter-${method}`,
      source: `fish-${method}`,
      escapeHtml: ctx.escapeHtml
    });
    return `<p class="aim-tip">${ctx.escapeHtml(text)}</p><p>${action}</p>`;
  }
  function starterLink(ctx, offer, stage) {
    const item = offer.entry.item;
    const query = new URLSearchParams({
      category: item.category,
      id: item.id,
      fish: ctx.id,
      stage,
      return: ctx.currentFishPath(stage) + "#starter-" + offer.method
    });
    if (["float", "sinker"].includes(offer.method)) query.set("route", offer.method);
    return `${ctx.itemPath()}?${query}`;
  }
  function starterItem(ctx, offer, stage, text) {
    const item = offer.entry.item;
    const bundle = offer.bundle ? ` · ${ctx.escapeHtml(text.bundle)}` : "";
    return `<a class="entity-link" href="${ctx.escapeHtml(starterLink(ctx, offer, stage))}"><img src="${ctx.escapeHtml(item.image)}" alt=""><span><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><small>${ctx.escapeHtml(text.cost)} ¥${offer.price}${bundle}</small></span></a>`;
  }
  function starterCard(ctx, offer, stage, allItems, text) {
    const method = offer.method;
    const item = offer.entry.item;
    const rig = ctx.renderRigForMethod(method, stage, allItems, offer.price);
    const aim = aimTip(ctx, method, stage);
    const fly = offer.bundle ? `<p class="muted">${ctx.escapeHtml(text.fly)}</p>` : "";
    const link = starterLink(ctx, offer, stage);
    const total = rig.match(/data-rig-total="(\d+)"/)?.[1];
    const rod = ctx.renderRodForMethod(method, stage, allItems, offer.price, Number(total));
    const summaryTotal = total || rod.match(/data-method-setup-total="(\d+)"/)?.[1];
    const summary = starterSummary(ctx, offer, summaryTotal);
    const open = ctx.requestedMethod === method ? " open" : "";
    return `<details class="detail-section starter-offer" id="starter-${method}" data-method="${method}" data-item="${item.category}:${item.id}" data-price="${offer.price}"${open}><summary>${summary}</summary>${starterItem(ctx, offer, stage, text)}${rod}${rig}${aim}${fly}<a class="route-button" href="${ctx.escapeHtml(link)}">${ctx.escapeHtml(text.buy)} ↗</a></details>`;
  }
  function starterSummary(ctx, offer, total) {
    const bait = ctx.localizedItemName(offer.entry.item);
    const fullCost = total ? starterTotalText(ctx, total) : "";
    const bundle = offer.bundle ? starterBundleText(ctx) : "";
    return `<strong>${ctx.escapeHtml(offer.label)}:</strong> ${ctx.escapeHtml(bait)} · ${bundle}¥${offer.price}${fullCost}`;
  }
  function starterBundleText(ctx) {
    if (ctx.locale === "th") return "ชุดฟลายสำเร็จรูป ";
    if (ctx.locale === "ja") return "完成フライセット ";
    return "Ready-made fly set ";
  }
  function starterTotalText(ctx, total) {
    if (ctx.locale === "th") return ` · ซื้อใหม่ครบชุด ¥${total}`;
    if (ctx.locale === "ja") return ` · 竿と仕掛け一式 ${total}円`;
    return ` · Complete new setup ¥${total}`;
  }
  function starterCards(ctx, offers, stage, allItems, text) {
    return offers.map((offer) => starterCard(ctx, offer, stage, allItems, text)).join("");
  }
  function selectedArea(ctx, locations, stage, text) {
    const selected = locations.find((location2) => String(location2.stage) === String(stage)) || locations[0];
    const name = selected.stageName?.[ctx.locale] || selected.stageName?.en || "";
    return `<p class="shopping-area-context"><strong>${ctx.escapeHtml(text.area)}:</strong> ${ctx.escapeHtml(ctx.copy.stage(selected.stage))} · ${ctx.escapeHtml(name)}</p>`;
  }
  function methodEntries(entries, method) {
    return entries.filter(
      (entry) => ["float", "sinker"].includes(method) ? entry.item.category === "bait" && entry.routes.includes(method) : entry.item.category === method
    );
  }
  function shopPage(ctx) {
    return ctx.locale === "th" ? "shops.th.html" : ctx.locale === "ja" ? "shops.ja.html" : "shops.html";
  }
  function offerLink(ctx, method, entry, stage, saleStage, anchor = "#all-compatible") {
    const item = entry.item;
    const currentFish = `${ctx.currentFishPath(stage)}${anchor}`;
    const query = new URLSearchParams({
      stage: String(saleStage),
      category: item.category,
      id: item.id,
      fish: ctx.id,
      return: currentFish
    });
    if (["float", "sinker"].includes(method)) query.set("route", method);
    return `${shopPage(ctx)}?${query.toString()}`;
  }
  function compatibleItemLink(ctx, method, entry, stage) {
    const item = entry.item;
    const query = new URLSearchParams({
      category: item.category,
      id: item.id,
      fish: ctx.id,
      stage: String(stage),
      return: `${ctx.currentFishPath(stage)}#all-compatible`
    });
    if (["float", "sinker"].includes(method)) query.set("route", method);
    return `${ctx.itemPath()}?${query.toString()}`;
  }
  function recordedSales(entries, method) {
    return entries.flatMap(
      (entry) => (entry.item.playerUse?.shops || []).filter((shop) => !shop.condition).map((shop) => ({ entry, shop, method }))
    ).sort(
      (a, b) => (salePrice(a) ?? Number.MAX_SAFE_INTEGER) - (salePrice(b) ?? Number.MAX_SAFE_INTEGER) || Number(a.shop.stage) - Number(b.shop.stage) || a.entry.item.id.localeCompare(b.entry.item.id)
    );
  }
  function salePrice(offer) {
    return offer.entry.item.category === "fly" ? offer.shop.bundle?.shopPriceYen : offer.entry.item.priceYen;
  }
  function localConditionalSale(entries, stage) {
    return entries.flatMap(
      (entry) => (entry.item.playerUse?.shops || []).filter((shop) => String(shop.stage) === String(stage) && shop.condition).map((shop) => ({ entry, shop }))
    ).sort((a, b) => a.entry.item.id.localeCompare(b.entry.item.id))[0];
  }
  function missingMethodCopy(ctx, method, stage, count) {
    const label = ctx.copy[method];
    if (ctx.locale === "th")
      return {
        title: `${label}: ไม่มีรายการขายปกติที่บันทึกใน${ctx.copy.stage(stage)}`,
        owned: `พบ ${count} ไอเท็มที่ผ่านเงื่อนไขชนิดเหยื่อของปลานี้ ถ้ามีอยู่แล้ว ใช้ต่อได้เลย`,
        sale: (area, item, price) => `ดูรายการขายที่บันทึกในด่าน ${area}: ${item}${price}`,
        conditional: (item) => `ตรวจรายการขายแบบมีเงื่อนไขในด่านนี้: ${item}`,
        detail: (item) => `เปิดรายละเอียดเพื่อดูข้อมูลการหา: ${item}`,
        noSales: "ไม่พบรายการขายที่บันทึกไว้ในร้านของทุกด่าน"
      };
    if (ctx.locale === "ja")
      return {
        title: `${label}：${ctx.copy.stage(stage)}の通常販売記録なし`,
        owned: `この魚の判定を通る道具が${count}種類あります。対応する道具を持っているなら、そのまま使えます。`,
        sale: (area, item, price) => `販売記録のあるエリア${area}を見る：${item}${price}`,
        conditional: (item) => `このエリアの条件付き販売を確認：${item}`,
        detail: (item) => `入手情報を見る：${item}`,
        noSales: "全エリアの店売り記録は見つかりません。"
      };
    return {
      title: `${label}: no regular sale recorded in ${ctx.copy.stage(stage)}`,
      owned: `${count} compatible item profiles pass this fish’s recorded check. Use one if you already own it.`,
      sale: (area, item, price) => `See the recorded sale in Area ${area}: ${item}${price}`,
      conditional: (item) => `Check this area’s conditional offer: ${item}`,
      detail: (item) => `Open item details for acquisition notes: ${item}`,
      noSales: "No shop sale record was found in any area."
    };
  }
  function missingMethodAction(ctx, method, entries, stage) {
    const conditional = localConditionalSale(entries, stage);
    const sales = recordedSales(entries, method);
    const fallback = sales[0];
    const copy4 = missingMethodCopy(ctx, method, stage, entries.length);
    const actions = [];
    if (conditional) {
      const item = conditional.entry.item;
      const href = offerLink(ctx, method, conditional.entry, stage, stage);
      actions.push(
        `<a class="route-button" data-conditional-sale href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy4.conditional(ctx.localizedItemName(item)))}</a>`
      );
    }
    if (fallback) {
      const item = fallback.entry.item;
      const amount = salePrice(fallback);
      const price = Number.isFinite(amount) ? ` · ¥${amount}` : "";
      const href = offerLink(ctx, method, fallback.entry, stage, fallback.shop.stage);
      actions.push(
        `<a class="route-button" data-recorded-sale href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy4.sale(fallback.shop.stage, `${ctx.localizedItemName(item)} (ID ${item.id})`, price))} ↗</a>`
      );
    } else if (!conditional) {
      const entry = entries[0];
      const href = compatibleItemLink(ctx, method, entry, stage);
      actions.push(
        `<a class="route-button" data-acquisition-details href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy4.detail(`${ctx.localizedItemName(entry.item)} (ID ${entry.item.id})`))} ↗</a>`
      );
    }
    const noSales = !fallback && !conditional ? `<p class="muted">${ctx.escapeHtml(copy4.noSales)}</p>` : "";
    return `<article class="detail-section method-no-local-stock" data-method-no-local="${method}"><h3>${ctx.escapeHtml(copy4.title)}</h3><p>${ctx.escapeHtml(copy4.owned)}</p>${noSales}<div class="method-stock-actions">${actions.join("")}</div></article>`;
  }
  function missingMethodActions(ctx, entries, offers, stage) {
    const methods = ["float", "sinker", "lure", "fly"];
    const stocked = new Set(offers.map((offer) => offer.method));
    return methods.filter((method) => !stocked.has(method)).map((method) => {
      const supported = methodEntries(entries, method);
      return supported.length ? missingMethodAction(ctx, method, supported, stage) : "";
    }).join("");
  }
  function renderShopping(ctx, entries, locations, stage, allItems, flyChoices) {
    if (!locations.length) return "";
    const text = ctx.shoppingCopy;
    const offers = ctx.starterOffers(entries, stage);
    const cards = starterCards(ctx, offers, stage, allItems, text);
    const noOffer = offers.length ? "" : `<p>${ctx.escapeHtml(text.none)}</p>`;
    const missingMethods = missingMethodActions(ctx, entries, offers, stage);
    const area = selectedArea(ctx, locations, stage, text);
    const kit = ctx.renderReusableKit(allItems, stage);
    const fallback = ctx.renderFlyFallback(allItems, stage, flyChoices);
    return `<section id="fish-shopping" class="detail-section shopping-plan"><h2>${ctx.escapeHtml(text.title)}</h2>${area}<p>${ctx.escapeHtml(text.intro)}</p>${offers.length ? `<div class="detail-grid">${cards}</div>` : noOffer}${missingMethods ? `<div class="detail-grid missing-method-grid">${missingMethods}</div>` : ""}<p class="muted">${ctx.escapeHtml(text.scope)}</p><a href="#all-compatible">${ctx.escapeHtml(text.all)} ↓</a>${kit}${fallback}</section>`;
  }

  // src/pages/fish/water-icons.js
  var classOrder = ["small", "large", "bubble"];
  var labels2 = {
    en: {
      title: "Read the water marks",
      intro: "Use these marks to narrow down candidates on the map. A mark records size when the object is built; later growth does not directly update it. The caught size may differ, and a mark alone cannot identify the species.",
      small: "Small fish mark",
      large: "Large fish mark",
      bubble: "Bubble mark",
      smallFact: "For a normal mark, the fish is under 50 cm when the mark is created.",
      largeFact: "For a normal mark, the fish is at least 50 cm when the mark is created.",
      growthLabel: "Large mark · only after growth and rebuilding",
      growthFact: "This fish starts below 50 cm. A large mark requires growth to at least 50 cm and a later object rebuild. Do not expect a large mark from its initial size; ordinary-play frequency is not confirmed.",
      bubbleFact: "A bubble mark does not identify the fish or show its size. This profile passes potato bait 11’s float check, but that does not guarantee the mark is this fish or that it will bite.",
      baitAction: "Check potato bait 11 · float condition",
      evidence: "ROM evidence and method",
      evidenceLink: "Water-surface icon trace and thresholds"
    },
    ja: {
      title: "水面のマークの見分け方",
      intro: "マークを使って地図の候補を絞り込めます。魚影はオブジェクト作成時のサイズで決まり、その後の成長だけでは直接更新されません。釣れた時のサイズとは異なる場合があり、マークだけでは魚種を特定できません。",
      small: "小さい魚影",
      large: "大きい魚影",
      bubble: "泡のマーク",
      smallFact: "通常のマーク作成時に、魚体サイズが50cm未満です。",
      largeFact: "通常のマーク作成時に、魚体サイズが50cm以上です。",
      growthLabel: "大魚影・成長後の再作成が必要",
      growthFact: "この魚の初期サイズは50cm未満です。大魚影には50cm以上への成長と、その後のオブジェクト再作成が必要です。初期サイズから大魚影を期待しないでください。通常プレイでの頻度は未確認です。",
      bubbleFact: "泡のマークは魚種やサイズを示しません。このプロフィールはウキ仕掛けでイモエサ11の判定を通りますが、マークの魚がこの魚であることや食いつきを保証しません。",
      baitAction: "イモエサ11のウキ判定を確認",
      evidence: "ROM根拠と調査方法",
      evidenceLink: "水面マークのトレースとしきい値"
    },
    th: {
      title: "ดูเครื่องหมายบนผิวน้ำ",
      intro: "ใช้เครื่องหมายช่วยกรองชนิดปลาในแผนที่ เกมเลือกเครื่องหมายจากขนาดตอนสร้างวัตถุปลา การโตภายหลังไม่ได้เปลี่ยนเครื่องหมายเดิมโดยตรง ขนาดตอนตกได้จึงอาจต่างออกไป และเครื่องหมายอย่างเดียวระบุชนิดปลาไม่ได้",
      small: "เครื่องหมายปลาขนาดต่ำกว่า 50 ซม.",
      large: "เครื่องหมายปลาขนาดตั้งแต่ 50 ซม.",
      bubble: "เครื่องหมายฟองอากาศ",
      smallFact: "ถ้าเป็นเครื่องหมายปกติ ตอนเกมสร้างเครื่องหมายปลามีขนาดต่ำกว่า 50 ซม.",
      largeFact: "ถ้าเป็นเครื่องหมายปกติ ตอนเกมสร้างเครื่องหมายปลามีขนาดตั้งแต่ 50 ซม. ขึ้นไป",
      growthLabel: "เครื่องหมายใหญ่ · ต้องโตและสร้างเครื่องหมายใหม่",
      growthFact: "ปลานี้เริ่มต้นต่ำกว่า 50 ซม. เครื่องหมายใหญ่ต้องให้ปลาโตถึง 50 ซม. แล้วเกมสร้างวัตถุปลาใหม่ จึงอย่าคาดว่าจะเห็นภาพใหญ่จากขนาดเริ่มต้น ยังไม่ได้ยืนยันความถี่ในการเล่นปกติ",
      bubbleFact: "เครื่องหมายฟองไม่ได้บอกชนิดหรือขนาดปลา ปลาชนิดนี้ผ่านเงื่อนไขเหยื่อหัวมัน 11 เมื่อใช้ชุดทุ่น แต่ไม่ได้ยืนยันว่าปลาที่เห็นเป็นตัวนี้หรือจะกินเหยื่อ",
      baitAction: "ดูเงื่อนไขชุดทุ่นของเหยื่อหัวมัน 11",
      evidence: "หลักฐาน ROM และวิธีตรวจสอบ",
      evidenceLink: "เส้นทางตรวจเครื่องหมายและเกณฑ์ขนาด"
    }
  };
  function copyFor(ctx) {
    return labels2[ctx.locale] || labels2.en;
  }
  function imageFor(waterIcons, iconClass) {
    const image = waterIcons?.classes?.[iconClass]?.image;
    return typeof image === "string" && image ? image : "";
  }
  function visibleClasses(waterIcons, profile) {
    if (!Array.isArray(profile?.possibleClasses)) return [];
    return classOrder.filter(
      (iconClass) => profile.possibleClasses.includes(iconClass) && (iconClass !== "bubble" || profile.bubble === true) && imageFor(waterIcons, iconClass)
    );
  }
  function potatoBaitLink(ctx, stage) {
    const query = new URLSearchParams({
      category: "bait",
      id: "11",
      fish: ctx.id,
      route: "float",
      return: `${ctx.currentFishPath(stage)}#water-icons`
    });
    if (stage) query.set("stage", String(stage));
    return `${ctx.itemPath()}?${query.toString()}`;
  }
  function iconFact(copy4, iconClass) {
    if (iconClass === "small") return copy4.smallFact;
    if (iconClass === "large") return copy4.largeFact;
    return copy4.bubbleFact;
  }
  function iconCard(ctx, copy4, waterIcons, profile, iconClass, stage) {
    const conditional = profile.growthOnlyClasses?.includes(iconClass) === true;
    const label = conditional ? copy4.growthLabel : copy4[iconClass];
    const image = ctx.escapeHtml(imageFor(waterIcons, iconClass) + "?v=native-20261005");
    const fact = ctx.escapeHtml(conditional ? copy4.growthFact : iconFact(copy4, iconClass));
    const bubbleAction = iconClass === "bubble" && profile.bubble === true ? `<a class="route-button" data-water-bait-link href="${ctx.escapeHtml(potatoBaitLink(ctx, stage))}">${ctx.escapeHtml(copy4.baitAction)} ↗</a>` : "";
    return `<article class="entity-link water-icon-card" data-water-icon="${iconClass}" data-water-class-evidence="${conditional ? "growth-only" : "initial"}"><img loading="lazy" src="${image}" alt="${ctx.escapeHtml(label)}"><span><strong>${ctx.escapeHtml(label)}</strong><small>${fact}</small></span>${bubbleAction}</article>`;
  }
  function evidenceDetails(ctx, copy4) {
    const href = "https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/water-surface-icons.md";
    return `<details class="water-icon-evidence"><summary>${ctx.escapeHtml(copy4.evidence)}</summary><p><a href="${href}">${ctx.escapeHtml(copy4.evidenceLink)} ↗</a></p></details>`;
  }
  function renderWaterIcons(ctx, waterIcons, stage) {
    const profile = waterIcons?.profiles?.[ctx.id];
    if (!waterIcons?.romSha1 || !profile) return "";
    const classes = visibleClasses(waterIcons, profile);
    if (!classes.length) return "";
    const copy4 = copyFor(ctx);
    const cards = classes.map((iconClass) => iconCard(ctx, copy4, waterIcons, profile, iconClass, stage)).join("");
    return `<section class="detail-section water-icon-guide" id="water-icons"><h2>${ctx.escapeHtml(copy4.title)}</h2><p class="section-lede">${ctx.escapeHtml(copy4.intro)}</p><div class="detail-grid water-icon-grid">${cards}</div>${evidenceDetails(ctx, copy4)}</section>`;
  }

  // src/pages/fish/section-index.js
  var sections = [
    ["fish-area-map", "จุดตกปลา", "釣り場", "Fishing spots"],
    ["fish-shopping", "ชุดเริ่มตก", "最初の仕掛け", "Fishing setup"],
    ["fish-notebook", "สมุดปลา", "釣りノート", "Notebook"],
    ["all-compatible", "เหยื่อทางเลือก", "エサの候補", "Bait alternatives"],
    ["fish-evidence", "หลักฐาน", "根拠", "Evidence"]
  ];
  function renderSectionIndex(ctx, markup) {
    const locale = ctx.locale || ctx.lang || "en";
    const column = locale === "th" ? 1 : locale === "ja" ? 2 : 3;
    const esc = ctx.escapeHtml || ctx.esc;
    const label = locale === "th" ? "หัวข้อในหน้านี้" : locale === "ja" ? "このページの項目" : "On this page";
    const links = sections.filter(([id]) => markup.includes(`id="${id}"`)).map(([id, ...names]) => `<a href="#${id}">${esc(names[column - 1])}</a>`).join("");
    return links ? `<nav class="page-section-index" aria-label="${esc(label)}"><strong>${esc(label)}</strong>${links}</nav>` : "";
  }
  function bindSectionIndex(root) {
    root.querySelector?.(".page-section-index")?.addEventListener("click", (event) => {
      const href = event.target.closest("a")?.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = document.getElementById(href.slice(1));
      const disclosure = target?.tagName === "DETAILS" ? target : target?.closest("details");
      if (disclosure) disclosure.open = true;
    });
  }

  // src/pages/fish/fight-controls.js
  var copy = {
    th: {
      title: "ยามาเมะด่าน 1: สู้ปลาและดูผล",
      action: "ลองกด A แล้วปล่อยคั่นเป็นช่วง ๆ สำหรับยามาเมะด่าน 1: เป็นข้อเสนอทดลองจากเหตุการณ์เดียวและชุดที่ระบุ ไม่ใช่สูตรรับประกัน",
      surface: "เมื่อขึ้นข้อความว่าตกยามาเมะได้แล้ว กด A เพื่อไปต่อจนเห็นขนาด จากนั้นเปิดสมุด 05 ตรวจบันทึก — A ตรงนี้เลื่อนข้อความผล ไม่ได้พิสูจน์ว่าเป็นปุ่มที่ทำให้จับได้",
      notebook: "เปิดข้อมูลสมุด 05",
      surfaceEvidence: "การเล่นซ้ำจากเซฟเหตุการณ์เดิมให้ผล 23 ซม. ตรงกันทั้งแบบต่อ 4 ช่วงและแบบรวม ในการเทียบช่วงผิวน้ำ 167 เฟรมเท่ากัน แบบกดเฉพาะ A ไปถึงผลและบันทึก 1/23/1 ส่วนไม่กดปุ่ม/กดเฉพาะขึ้น/กดเฉพาะ B ยังอยู่หน้าชื่อปลาที่จับได้และบันทึก 0/0/0 ไม่ใช่หลักฐานว่าปุ่มอื่นทำให้ปลาหนีหรือไม่มีวันไปต่อ",
      caughtName: "หน้าชื่อปลาที่จับได้ ก่อนเลื่อนไปผลขนาด",
      surfaceResult: "ผล 23 ซม. หลังใช้เฉพาะ A ในช่วงผิวน้ำ",
      result: "จากเหตุการณ์ธรรมชาติหนึ่งครั้ง เมื่อเวลาเล่นรวมและเวลาที่กด A รวมเท่ากัน แบบแบ่งกด/ปล่อยทำให้ปลายังอยู่ ส่วนแบบค้างยาวครั้งเดียวแล้วปล่อยจบด้วยปลาหนี ยังไม่ทราบจังหวะที่ดีที่สุดหรือสูตรที่รับประกันจับได้",
      evidence: "ดูชุดที่ทดลองและหลักฐาน",
      setup: "ชุดที่ทดลอง: คัน 02 · ทุ่น 04 · ตะขอ 06 · เหยื่อ 07 ก่อนโยน · HP 100 เกมอ่านการกด A/B ค้างกับการปล่อยต่างกันในแขนงที่ตรวจ ขณะปลายังไม่ถึงขอบเขตของคัน",
      continuation: "ผล 23 ซม. มาจากการเล่นต่อด้วยปุ่มเพิ่มเติมหลังการเปรียบเทียบ ไม่ใช่ผลจับได้ทันทีจากจังหวะข้างต้น และยังไม่ยืนยันว่าช่วยเพิ่มโอกาสจับในชุดอื่น",
      trace: "อ่านวิธีทดลอง ข้อจำกัด และโค้ดที่ตรวจ",
      escape: "ภาพผลปลาหนีจากการกดค้าง",
      catch: "ภาพ 23 ซม. หลังเล่นต่อแยกต่างหาก"
    },
    en: {
      title: "Area 1 Yamame: fight and result controls",
      action: "Try A presses with release intervals for Area 1 Yamame: an experimental option from one encounter and the listed setup, not a guaranteed rhythm.",
      surface: "Once the caught-Yamame message appears, press A to advance to the size result, then check Notebook 05. Here A advances the result message; it is not proven to cause the catch.",
      notebook: "Open Notebook 05 details",
      surfaceEvidence: "A fresh replay of the retained encounter reproduced 23 cm with identical four-phase and flattened endpoints. At equal 167-frame surface time, A-only reached the result and record 1/23/1; neutral, Up-only and B-only remained at the caught-name message with record 0/0/0. This does not show other buttons cause escape or can never advance later.",
      caughtName: "Caught-name message before the size result",
      surfaceResult: "23 cm result after A-only surface inputs",
      result: "In one natural encounter, schedules with the same total time and A-held time left the fish in the fight when split into presses and releases; one long hold followed by release ended in escape. No best rhythm or guaranteed catch is established.",
      evidence: "Tested setup and evidence",
      setup: "Tested setup: rod 02 · float 04 · hook 06 · bait 07 before casting · HP 100. The traced game branch treats held A/B and released input differently while the fish remains below the rod boundary.",
      continuation: "The 23 cm catch required a separate continuation with additional inputs after the comparison. It was not an immediate catch from the pattern above, and no catch advantage is established for other setups.",
      trace: "Read the experiment, limitations and code trace",
      escape: "Hold-input escape result",
      catch: "23 cm result after the separate continuation"
    },
    ja: {
      title: "エリア1のヤマメ：ファイトと釣果表示",
      action: "エリア1のヤマメではAを押して離す操作を試せます。同じ1回の遭遇と記載装備に限る実験的な提案で、確実に釣れるリズムではありません。",
      surface: "ヤマメを釣りあげたメッセージが出たら、Aで大きさの結果まで進め、手帳05で記録を確認してください。ここでのAは結果表示を進める操作で、釣れた原因とは証明されていません。",
      notebook: "手帳05の詳細を開く",
      surfaceEvidence: "保存した同じ遭遇の再実行で、4段階と連結実行の終了状態は一致し23cmを再現しました。水面側の167フレーム比較ではAのみが結果と記録1/23/1に進み、無入力・上のみ・Bのみは釣れた魚の名前表示で記録0/0/0でした。他のボタンで逃げる、または後で進めないという証明ではありません。",
      caughtName: "大きさの結果前の釣れた魚の名前表示",
      surfaceResult: "水面側でAのみを使った後の23cm結果",
      result: "自然発生した1回のファイトで、経過時間とAを押した合計時間を同じにすると、押す・離すを分けた操作では魚が残り、長く1回押してから離す操作では逃げられました。最適なリズムや必ず釣れる操作は未確認です。",
      evidence: "実験した装備と根拠",
      setup: "実験装備：竿02・ウキ04・ハリ06・投げる前のエサ07・HP100。調べたゲーム分岐では、魚が竿の境界に達するまではA/Bを押している状態と離した状態を別に処理します。",
      continuation: "23cmの釣果は比較後に別の追加操作を行った結果です。上のリズムだけで直ちに釣れた結果ではなく、他の装備で釣果が上がることも未確認です。",
      trace: "実験方法・制限・コードを読む",
      escape: "押し続けた操作の逃走結果",
      catch: "別の追加操作後の23cmの結果"
    }
  };
  function renderFightControls(ctx, stage) {
    if (ctx.id !== "03" || String(stage) !== "1") return "";
    const text = copy[ctx.locale] || copy.en;
    const esc = ctx.escapeHtml;
    const query = new URLSearchParams({
      category: "general_tool",
      id: "05",
      stage: "1",
      return: ctx.currentFishPath(stage)
    });
    const notebookHref = `${ctx.itemPath()}?${query}`;
    return `<section id="fight-controls" class="detail-section"><h2>${esc(text.title)}</h2><p><strong>${esc(text.action)}</strong></p><p data-fight-surface-progression>${esc(text.surface)} <a data-fight-notebook-action href="${esc(notebookHref)}">${esc(text.notebook)} ↗</a></p><details id="fight-controls-evidence"><summary>${esc(text.evidence)}</summary><p>${esc(text.result)}</p><p>${esc(text.setup)}</p><p>${esc(text.continuation)}</p><p>${esc(text.surfaceEvidence)} <a href="../research/assets/fight-a-surface-result.png">${esc(text.surfaceResult)} ↗</a></p><p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fight-input-research.md">${esc(text.trace)} ↗</a></p><div class="fight-captures"><figure><a href="../research/assets/fight-hold-escape.png"><img src="../research/assets/fight-hold-escape.png" alt="${esc(text.escape)}" loading="lazy"></a><figcaption>${esc(text.escape)}</figcaption></figure><figure><a href="../research/assets/fight-release-catch.png"><img src="../research/assets/fight-release-catch.png" alt="${esc(text.catch)}" loading="lazy"></a><figcaption>${esc(text.catch)}</figcaption></figure><figure><a href="../research/assets/fight-caught-name.png"><img src="../research/assets/fight-caught-name.png" alt="${esc(text.caughtName)}" loading="lazy"></a><figcaption>${esc(text.caughtName)}</figcaption></figure></div></details></section>`;
  }

  // src/pages/fish/notebook-checklist-link.js
  function checklistStage(ctx, firstStage) {
    const selected = Number(ctx.requestedStage);
    return Number.isInteger(selected) && selected >= 1 && selected <= 6 ? selected : firstStage;
  }
  function checklistCopy(ctx) {
    if (ctx.locale === "th") return "เปิดเช็กลิสต์บนเว็บของปลาชนิดนี้ (จดเอง แยกจากสมุดในเกม)";
    if (ctx.locale === "ja") return "この魚の手動チェックリストを開く（ゲーム内ノートとは別）";
    return "Open this species’ manual web checklist (separate from the in-game notebook)";
  }
  function notebookChecklistLink(ctx, firstStage) {
    const stage = checklistStage(ctx, firstStage);
    const query = new URLSearchParams({ stage: String(stage), fish: ctx.id });
    if (ctx.requestedMethod) query.set("route", ctx.requestedMethod);
    query.set("return", ctx.currentFishPath(stage));
    const href = `${ctx.mapPath()}?${query}#notebook-species-${ctx.id}`;
    return `<a class="route-button" data-fish-notebook-checklist href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(checklistCopy(ctx))} ↗</a>`;
  }

  // src/pages/fish/notebook-status.js
  var copy2 = {
    th: {
      eligibleTitle: "เป้าหมายสมุด · 1 ใน 66 ชนิด",
      eligibleBody: "ถ้ายังไม่มีชื่อในสมุด ให้ตกปลานี้ ผ่านข้อความจับปลา แล้วตรวจไอเท็ม 05 “สมุดบันทึกการตกปลา”",
      first: (stage) => `เส้นทางเก็บ 66 ชนิด · ด่าน 1 → 6 · พบครั้งแรกที่ด่าน ${stage}`,
      repeats: (stages) => `มีจุดของปลาชนิดนี้อีกในด่าน ${stages}`,
      noRepeats: "ในข้อมูลจุดตกที่ยืนยันได้ ไม่มีด่านอื่นระบุปลาชนิดนี้",
      recorded: "มีชื่อแล้ว = ไม่ใช่เป้าหมายใหม่; ตัวที่ใหญ่กว่าอาจย้ายรายการไปหน้าด่านอื่น เว็บอ่านเซฟไม่ได้ ให้ตรวจในเกม",
      map: "ดูแผนที่จุดตกที่เลือก",
      excludedTitle: "ไม่ใช่เป้าหมายในสมุด 66 ชนิด",
      excludedBody: "โปรไฟล์นี้แสดงจุดปลาในแผนที่ แต่ไม่ต้องตกชนิดนี้เพื่อเก็บสมุดให้ครบ",
      unknownTitle: "สถานะในสมุดยังยืนยันไม่ได้",
      unknownBody: "ข้อมูลที่ยืนยันได้ยังไม่ระบุว่าปลานี้มีช่องในสมุดหรือไม่ โปรดตรวจไอเท็ม 05 ในเกม"
    },
    ja: {
      eligibleTitle: "図鑑の目標 · 全66種の1種",
      eligibleBody: "まだ記録がなければ、魚を取り込み、取り込み後のメッセージを進めてから道具05「釣りノート」で確認してください。",
      first: (stage) => `全66種の収集ルート（エリア1→6） · 最初の出現設定：エリア${stage}`,
      repeats: (stages) => `同じ魚の出現設定：エリア${stages}`,
      noRepeats: "確認済みの出現設定はこのエリアだけです。",
      recorded: "記録済みなら新しい収集目標ではありません。より大きな記録で表示エリアが移る場合があります。サイトはセーブを読めないため、ゲーム内で確認してください。",
      map: "選択中の釣り場マップを見る",
      excludedTitle: "図鑑66種の対象外",
      excludedBody: "この魚はマップに出ますが、図鑑を埋めるために釣る必要はありません。",
      unknownTitle: "図鑑の対象か未確認",
      unknownBody: "現在確認できるデータでは記録対象か判断できません。ゲーム内の道具05で確認してください。"
    },
    en: {
      eligibleTitle: "Notebook goal · 1 of 66 species",
      eligibleBody: "If it is not listed, land it, finish the landing text, then check Tool 05 (Fishing Notebook).",
      first: (stage) => `66-species route (Areas 1 → 6) · First configured in Area ${stage}`,
      repeats: (stages) => `Also configured in areas ${stages}`,
      noRepeats: "No other area is listed in the confirmed location data.",
      recorded: "Already listed means it is not a new target. A larger record may move its notebook area. This site cannot read your save; check in-game.",
      map: "View the selected area map",
      excludedTitle: "Not one of the 66 notebook species",
      excludedBody: "This profile has map locations, but you do not need this species to complete the notebook list.",
      unknownTitle: "Notebook status unconfirmed",
      unknownBody: "Available evidence does not confirm whether this fish has a notebook slot. Check Tool 05 in the game."
    }
  };
  function validStage2(value) {
    return Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 6;
  }
  function notebookState(fishData, id) {
    const entry = fishData.notebookCompletion?.species?.[id];
    if (entry?.notebookEligible === true) return { kind: "eligible", entry };
    if (entry?.notebookEligible === false) return { kind: "excluded", entry };
    return { kind: "unconfirmed", entry: null };
  }
  function renderEligible(ctx, entry, text) {
    const stages = (entry.stages || []).filter(validStage2).map(Number).sort((a, b) => a - b);
    const first = Number(entry.firstOccurrenceStage);
    if (!validStage2(first) || !stages.length) return renderUnconfirmed(ctx, text);
    const otherStages = stages.filter((stage) => stage !== first);
    const locations = otherStages.length ? text.repeats(otherStages.join(", ")) : text.noRepeats;
    return `<section id="fish-notebook" class="decision-panel fish-notebook-goal" data-fish-notebook-status="eligible" data-notebook-first-stage="${first}" data-notebook-stages="${stages.join(",")}"><h2>${ctx.escapeHtml(text.eligibleTitle)}</h2><p>${ctx.escapeHtml(text.eligibleBody)}</p><p><strong>${ctx.escapeHtml(text.first(first))}</strong> · ${ctx.escapeHtml(locations)}</p><p>${ctx.escapeHtml(text.recorded)}</p><a class="route-button" href="#fish-area-map">${ctx.escapeHtml(text.map)} ↑</a><p>${notebookChecklistLink(ctx, first)}</p></section>`;
  }
  function renderExcluded(ctx, text) {
    return `<section id="fish-notebook" class="decision-panel fish-notebook-goal" data-fish-notebook-status="excluded"><h2>${ctx.escapeHtml(text.excludedTitle)}</h2><p>${ctx.escapeHtml(text.excludedBody)}</p></section>`;
  }
  function renderUnconfirmed(ctx, text) {
    return `<section id="fish-notebook" class="decision-panel fish-notebook-goal" data-fish-notebook-status="unconfirmed"><h2>${ctx.escapeHtml(text.unknownTitle)}</h2><p>${ctx.escapeHtml(text.unknownBody)}</p></section>`;
  }
  function renderNotebookStatus(ctx, fishData) {
    const text = copy2[ctx.locale] || copy2.en;
    const state = notebookState(fishData, ctx.id);
    if (state.kind === "eligible") return renderEligible(ctx, state.entry, text);
    if (state.kind === "excluded") return renderExcluded(ctx, text);
    return renderUnconfirmed(ctx, text);
  }

  // src/pages/fish/quest-context.js
  var EEL_ID = "3B";
  var EEL_POINT = { stage: 6, x: 41, y: 8 };
  var copy3 = {
    th: {
      title: "ถ้าคำขอจากหมอปรากฏ",
      body: "ถ้าอ่านโปสต์การ์ดที่ได้รับแล้วเห็นคำขอให้ตกปลาไหลใหญ่ ให้เปิดข้อมูลโปสต์การ์ดเพื่อดูเบาะแสด่าน 6 ก่อนออกไปตก",
      link: "เปิดข้อมูลโปสต์การ์ดที่ได้รับ",
      afterCatch: "จับตามคำขอได้แล้ว ให้เก็บปลาไหลไว้และกลับหมู่บ้านเริ่มต้น หากเงื่อนไขเนื้อเรื่องครบ เกมจะเริ่มฉากช่วยหมอและฉากจบอัตโนมัติ",
      returnMap: "ดูทางกลับหมู่บ้าน · ด่าน 1 (12,189)",
      limit: "จุดตกที่กำหนดอาจไม่มีปลาในรอบนี้"
    },
    ja: {
      title: "医者の依頼が表示された場合",
      body: "受け取ったはがきを読み、大ウナギを釣る依頼が表示されたら、釣りに行く前にエリア6の手掛かりをはがき情報で確認してください。",
      link: "受け取ったはがきの情報を見る",
      afterCatch: "依頼の魚を釣ったら、ウナギを残して最初の村へ戻ってください。物語の条件がそろうと、医者の回復とエンディングの自動シーンが始まります。",
      returnMap: "最初の村への入口 · エリア1 (12,189)",
      limit: "設定された釣り場に魚がいない場合もあります。"
    },
    en: {
      title: "If the doctor’s request appears",
      body: "If you read Received Postcard 06 and see the doctor’s giant-eel request, open the postcard guidance for the Area 6 clue before fishing.",
      link: "Open Received Postcard guidance",
      afterCatch: "After catching the requested eel, keep it and return to the starting village. When the story conditions are complete, the doctor-recovery and ending scene starts automatically.",
      returnMap: "Starting-village entrance · Area 1 (12,189)",
      limit: "The configured fishing point may be inactive."
    }
  };
  function eelPointConfigured(locationData) {
    const fish = locationData?.fish || locationData || {};
    const locations = fish[EEL_ID]?.locations || [];
    return locations.some(
      (location2) => Number(location2.stage) === EEL_POINT.stage && (location2.points || []).some(
        (point) => Number(point.x) === EEL_POINT.x && Number(point.y) === EEL_POINT.y
      )
    );
  }
  function postcardHref(ctx) {
    const query = new URLSearchParams({ category: "general_tool", id: "06", stage: "6" });
    query.set("return", ctx.currentFishPath("6"));
    return `${ctx.itemPath()}?${query.toString()}`;
  }
  function returnVillageHref(ctx) {
    const query = new URLSearchParams({ stage: "1", section: "s1-c1-r8", action: "eel-return" });
    query.set("return", ctx.currentFishPath("6"));
    return `${ctx.mapPath()}?${query}#map-view`;
  }
  function renderEelQuestContext(ctx, locationData) {
    if (ctx.id !== EEL_ID || !eelPointConfigured(locationData)) return "";
    const text = copy3[ctx.locale] || copy3.en;
    return `<aside class="detail-section fish-quest-context" data-fish-quest-context="postcard-eel"><h2>${ctx.escapeHtml(text.title)}</h2><p>${ctx.escapeHtml(text.body)}</p><p><a class="route-button" data-fish-postcard-link href="${ctx.escapeHtml(postcardHref(ctx))}">${ctx.escapeHtml(text.link)} ↗</a></p><p data-eel-ending-action>${ctx.escapeHtml(text.afterCatch)}</p><p><a class="route-button" data-eel-return-map href="${ctx.escapeHtml(returnVillageHref(ctx))}">${ctx.escapeHtml(text.returnMap)} ↗</a></p><p>${ctx.escapeHtml(text.limit)}</p></aside>`;
  }

  // src/pages/fish/render.js
  var profileAnchors = {
    "#fish-area-map": "fish-area-map",
    "#water-icons": "water-icons",
    "#all-compatible": "all-compatible",
    "#fly-backup": "fly-backup",
    "#fight-controls": "fight-controls",
    "#fish-shopping": "fish-shopping",
    "#fish-notebook": "fish-notebook",
    "#fish-evidence": "fish-evidence"
  };
  function profileAnchorId(hash) {
    return profileAnchors[hash] || "";
  }
  function renderMissingProfile(ctx, message) {
    ctx.page.innerHTML = `<h1>${ctx.escapeHtml(ctx.copy.pageTitle)}</h1><p class="empty-state">${ctx.escapeHtml(message)}</p><p><a class="route-button" href="${ctx.escapeHtml(ctx.cataloguePath())}">${ctx.escapeHtml(ctx.copy.catalogue)}</a></p>`;
    ctx.setNavigation("");
  }
  function alternateFishNames(fish, name) {
    const names = [
      fish.nameJa,
      fish.nameEn,
      fish.nameLatin,
      ...fish.nameLatinVariants || [],
      ...fish.nameThVariants || []
    ];
    return distinctFishNames(names, name);
  }
  function fishHeadline(ctx, fish, name) {
    const hasName = fish.nameJa || fish.nameEn || fish.nameLatin || (fish.nameThVariants || []).length;
    return hasName ? name : ctx.copy.unknownFish(ctx.id);
  }
  function fishSprite(ctx, fish, name) {
    if (!fish.image)
      return `<div class="detail-portrait empty-state">${ctx.escapeHtml(ctx.copy.noSprite)}</div>`;
    return `<figure class="detail-portrait"><img src="${ctx.escapeHtml(fish.image)}" alt="${ctx.escapeHtml(name)}"><figcaption>${ctx.escapeHtml(name)}</figcaption></figure>`;
  }
  function profileState(ctx, fish, locationData, fishData) {
    const name = ctx.localizedFishName(fish, ctx.id);
    const locations = ctx.getLocations(locationData);
    const activeStage = locations.some((entry) => String(entry.stage) === ctx.requestedStage) ? ctx.requestedStage : String(locations[0]?.stage || "");
    const matches = ctx.matchingItems(fishData.items || []);
    return {
      name,
      locations,
      activeStage,
      matches,
      altNames: alternateFishNames(fish, name),
      sprite: fishSprite(ctx, fish, name),
      headline: fishHeadline(ctx, fish, name)
    };
  }
  function renderProfileHero(ctx, state) {
    const alternateNames = state.altNames.length ? `<p class="muted"><span>${ctx.escapeHtml(ctx.copy.legacyName)}:</span> ${state.altNames.map(ctx.escapeHtml).join(" · ")}</p>` : "";
    return `<nav class="detail-breadcrumb" aria-label="${ctx.escapeHtml(ctx.copy.catalogue)}"><a href="${ctx.escapeHtml(ctx.cataloguePath())}">${ctx.escapeHtml(ctx.copy.catalogue)}</a><span aria-hidden="true">/</span><span>${ctx.escapeHtml(ctx.copy.pageTitle)}</span></nav><div class="detail-hero fish-hero">${state.sprite}<div class="detail-identity"><p class="detail-kicker">${ctx.escapeHtml(ctx.copy.pageTitle)}</p><h1>${ctx.escapeHtml(state.headline)}</h1>${alternateNames}<div class="detail-badges"><span class="detail-badge id">ID ${ctx.escapeHtml(ctx.id)}</span></div></div></div>`;
  }
  function renderFirstStep(ctx) {
    return `<section class="decision-panel fish-first-step"><h2>${ctx.escapeHtml(ctx.copy.firstStep)}</h2><p>${ctx.escapeHtml(ctx.copy.firstStepBody)}</p><a class="route-button" href="#fish-area-map">${ctx.escapeHtml(ctx.copy.chooseSpots)} ↓</a></section>`;
  }
  function compatibilityIntro(ctx) {
    if (ctx.locale === "th")
      return "เลือกเพียงหนึ่งทางเลือกเพื่อเริ่มตก ไม่จำเป็นต้องซื้อทั้งหมด กดรายละเอียดเพื่อเทียบวิธีใช้และด่านที่ขาย";
    if (ctx.locale === "ja")
      return "最初は候補を1つ選び、全部買う必要はありません。詳細で使い方と販売エリアを比較できます。";
    return "Choose one alternative to start; you do not need every entry. Open details to compare use and purchase areas.";
  }
  function compatibleSection(ctx, state) {
    return `<section id="all-compatible" class="detail-section"><h2>${ctx.escapeHtml(ctx.copy.compatible)}</h2><p class="section-lede">${ctx.escapeHtml(ctx.copy.compatibilityNote)}</p><p>${ctx.escapeHtml(compatibilityIntro(ctx))}</p>${ctx.renderCompatibility(state.matches, state.activeStage)}</section>`;
  }
  function profileContent(ctx, fishData, locationData, fish, state) {
    const notebook = fishData.notebookCompletion?.species?.[ctx.id];
    const firstStep = notebook?.notebookEligible === true ? "" : renderFirstStep(ctx);
    const content = `${renderEelQuestContext(ctx, locationData)}${firstStep}${ctx.renderAreas(state.locations, state.activeStage, fish)}${ctx.renderExchange(fishData.items || [], state.activeStage)}${ctx.renderShopping(state.matches, state.locations, state.activeStage, fishData.items || [], fishData.flyBackupChoices)}${renderFightControls(ctx, state.activeStage)}${renderNotebookStatus(ctx, fishData)}${compatibleSection(ctx, state)}${ctx.renderWaterIcons(fishData.waterIcons, state.activeStage)}${ctx.renderEvidence(fish, state.locations, state.matches)}`;
    return `${renderProfileHero(ctx, state)}${renderSectionIndex(ctx, content)}${content}`;
  }
  function unconfirmedProfileContent(ctx, fishData, locationData, fish, state) {
    const evidence = ctx.renderEvidence(fish, state.locations, state.matches).replace(
      "</details>",
      '<p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fish-acceptance-research.md">Fish acceptance research · profile 43 ↗</a></p></details>'
    );
    const content = `${renderNotebookStatus(ctx, fishData)}${renderEelQuestContext(ctx, locationData)}${ctx.unconfirmedProfileAction()}${evidence}`;
    return `<div class="detail-hero"><div><p class="muted">${ctx.escapeHtml(ctx.copy.pageTitle)} · ID 43</p><h1>${ctx.escapeHtml(state.headline)}</h1></div></div>${renderSectionIndex(ctx, content)}${content}`;
  }
  function updateAreaChooser(ctx, fishData, locationData, locations) {
    if (!locations.length) return;
    const chooser = document.getElementById("shopping-area");
    chooser.addEventListener("change", () => {
      ctx.requestedStage = ctx.validStage(chooser.value);
      if (typeof history !== "undefined") {
        const anchor = profileAnchorId(location.hash);
        const suffix = anchor ? `#${anchor}` : "";
        history.replaceState(null, "", `${ctx.currentFishPath(ctx.requestedStage)}${suffix}`);
      }
      ctx.render(fishData, locationData);
    });
  }
  function reopenFlyBackup() {
    if (location.hash !== "#fly-backup") return;
    document.getElementById("fly-backup")?.setAttribute("open", "");
  }
  function bindFlyBackupAction(ctx) {
    ctx.page.querySelector?.("[data-fly-backup-link]")?.addEventListener("click", () => {
      document.getElementById("fly-backup")?.setAttribute("open", "");
    });
  }
  function reopenRequestedStarter(ctx, shouldScroll = true) {
    const anchor = location.hash.match(/^#starter-(float|sinker|lure|fly)$/)?.[1];
    const method = ctx.requestedMethod || anchor;
    if (!method) return;
    const starter = document.getElementById(`starter-${method}`);
    if (!starter) return;
    starter.setAttribute("open", "");
    if (shouldScroll) starter.scrollIntoView({ block: "start" });
  }
  function restoreProfileAnchor(anchorId) {
    if (!anchorId) return;
    document.getElementById(anchorId)?.scrollIntoView({ block: "start" });
  }
  function setFishTitle(ctx, headline) {
    document.title = `${headline} — ${ctx.copy.pageTitle} | Kawa no Nushi Tsuri 2`;
  }
  function resolveProfileStage(ctx, activeStage) {
    if (activeStage === ctx.requestedStage) return;
    ctx.requestedStage = activeStage;
    if (typeof history !== "undefined")
      history.replaceState(null, "", `${ctx.currentFishPath(activeStage)}${location.hash}`);
  }
  function render(ctx, fishData, locationData) {
    if (!ctx.id) return renderMissingProfile(ctx, ctx.copy.missing);
    const fish = fishData.fishVisuals?.[ctx.id];
    if (!fish) return renderMissingProfile(ctx, ctx.copy.invalid);
    const state = profileState(ctx, fish, locationData, fishData);
    resolveProfileStage(ctx, state.activeStage);
    ctx.setNavigation(state.activeStage);
    ctx.page.innerHTML = ctx.id === "43" ? unconfirmedProfileContent(ctx, fishData, locationData, fish, state) : profileContent(ctx, fishData, locationData, fish, state);
    bindSectionIndex(ctx.page);
    if (location.hash === "#fish-evidence")
      document.getElementById("fish-evidence").closest("details").open = true;
    const anchorId = profileAnchorId(location.hash);
    if (ctx.id === "43") {
      setFishTitle(ctx, state.headline);
      restoreProfileAnchor(anchorId);
      return;
    }
    reopenRequestedStarter(ctx, !anchorId);
    reopenFlyBackup();
    bindFlyBackupAction(ctx);
    updateAreaChooser(ctx, fishData, locationData, state.locations);
    setFishTitle(ctx, state.headline);
    restoreProfileAnchor(anchorId);
  }

  // src/pages/fish/copy_en.js
  var copy_en = {
    pageTitle: "Fish profile",
    missing: "Choose a fish from the catalogue or map.",
    invalid: "This fish profile is not in the extracted catalogue.",
    catalogue: "Browse fish and equipment",
    back: "Back to previous page",
    map: "Open this fish on the map",
    areas: "Confirmed areas and fishing spots",
    bait: "Live bait",
    lure: "Lures",
    fly: "Fly bodies",
    flyCandidates: "Fly bodies · profile matches only",
    flyProfileOnly: "This count lists bodies that match the fish profile, not fully accepted fly sets. The body and wing can still fail a hidden condition. Start with a recorded shop set; if it does not get a bite, inspect the three backup sets instead of buying every body.",
    flyBackupAction: "Show this fish’s three backup sets",
    firstStep: "Start with the map, then choose your gear",
    firstStepBody: "Choose an area to find fishing points, then choose a tackle setup below for your fishing method.",
    chooseSpots: "Choose a fishing area",
    compatible: "Choose bait or inspect fly candidates",
    compatibilityNote: "Bait and lures pass this fish’s recorded mask checks. Fly bodies below only match the fish profile; the assembled body/wing set must pass another live condition. None of these checks guarantees a bite or landing.",
    mapAction: "Open map and fish points",
    configuredPoints: (n) => `${n} configured point${n === 1 ? "" : "s"}`,
    spawnSlots: (n) => `${n} spawn slots in the ROM table`,
    stage: (n) => `Area ${n}`,
    unknownArea: "No confirmed spawn locations were found for this profile in the extracted ROM location table.",
    unknownFish: (id) => `Unknown fish profile · ID ${id}`,
    unknownName: (id) => `Fish profile ${id}`,
    noSprite: "No extracted fish portrait is available for this profile.",
    chooseArea: "Select an area to see its map",
    float: "Float rig",
    sinker: "Sinker rig",
    viewItem: "View item",
    noCompatibility: "No compatible bait, lure, or fly body is recorded for this profile.",
    evidence: "ROM evidence and coordinates",
    evidenceIntro: "The counts and locations below come from the extracted fish spawn table for the supplied Japanese ROM.",
    profile: "Fish profile ID",
    profileOffset: "Fish profile record offset",
    source: "Source table",
    coords: "Configured coordinates",
    reference: "Compatibility sources",
    legacyName: "Other catalogue names",
    recovery: "Fish data could not be loaded. Retry this page or return to the catalogue.",
    retryLoad: "Retry this fish page"
  };

  // src/pages/fish/copy_ja.js
  var copy_ja = {
    pageTitle: "魚の情報",
    missing: "マップまたはカタログから魚を選んでください。",
    invalid: "抽出済みカタログにこの魚プロフィールはありません。",
    catalogue: "魚と道具の一覧",
    back: "前のページに戻る",
    map: "この魚のマップを開く",
    areas: "確認済みエリアと釣りポイント",
    bait: "エサ",
    lure: "ルアー",
    fly: "フライ本体",
    flyCandidates: "フライ本体・プロフィール一致のみ",
    flyProfileOnly: "この数は魚プロフィールと一致する本体数で、判定をすべて通る完成フライ数ではありません。本体・ウィングは隠れた条件で遮断される場合があります。まず店売りセットを選び、反応しない場合は本体を全部買うのではなく予備3セットを確認してください。",
    flyBackupAction: "この魚の予備3セットを見る",
    firstStep: "まずマップを見てから道具を選ぶ",
    firstStepBody: "エリアを選んで釣りポイントを確認し、下から自分の釣り方に合う道具セットを選んでください。",
    chooseSpots: "釣るエリアを選ぶ",
    compatible: "エサを選ぶ・フライ候補を調べる",
    compatibilityNote: "エサとルアーはこの魚の記録済みマスク判定を通ります。下のフライ本体は魚プロフィールとの一致のみで、完成セットの本体・ウィングには別の動的条件があります。食いつきや取り込みの保証ではありません。",
    mapAction: "マップと魚の位置を開く",
    configuredPoints: (n) => `設定されたポイント ${n}か所`,
    spawnSlots: (n) => `ROMテーブルの出現枠 ${n}`,
    stage: (n) => `エリア${n}`,
    unknownArea: "抽出したROM出現テーブルに確認済みの場所はありません。",
    unknownFish: (id) => `種類未特定の魚プロフィール · ID ${id}`,
    unknownName: (id) => `魚プロフィール ${id}`,
    noSprite: "このプロフィールの魚画像は未抽出です。",
    chooseArea: "エリアを選んでマップを表示",
    float: "ウキ仕掛け",
    sinker: "オモリ仕掛け",
    viewItem: "アイテムを見る",
    noCompatibility: "このプロフィールに対応する確認済みのエサ・ルアー・フライ本体はありません。",
    evidence: "ROM根拠と座標",
    evidenceIntro: "以下の場所と数は、調査に使用した日本版ROMから抽出した魚の出現テーブルによります。",
    profile: "魚プロフィールID",
    profileOffset: "魚プロフィールのROM位置",
    source: "出現テーブル",
    coords: "ゲーム内の設定座標",
    reference: "対応条件の資料",
    legacyName: "カタログの別名",
    recovery: "魚データを読み込めません。このページを再読み込みするか、カタログに戻ってください。",
    retryLoad: "この魚ページを再読み込み"
  };

  // src/pages/fish/copy_th.js
  var copy_th = {
    pageTitle: "ข้อมูลปลา",
    missing: "เลือกปลาจากหน้าแผนที่หรือแคตตาล็อกก่อนครับ",
    invalid: "ไม่พบโปรไฟล์ปลานี้ในรายการที่ถอดข้อมูลไว้",
    catalogue: "ดูรายชื่อปลาและอุปกรณ์",
    back: "กลับหน้าก่อนหน้า",
    map: "เปิดแผนที่ของปลานี้",
    areas: "ด่านและจุดตกที่ยืนยันจากเกม",
    bait: "เหยื่อจริง",
    lure: "เหยื่อปลอม",
    fly: "ตัวฟลาย",
    flyCandidates: "บอดี้ฟลาย · ตรงกับโปรไฟล์ปลาเท่านั้น",
    flyProfileOnly: "จำนวนนี้นับบอดี้ที่ตรงกับโปรไฟล์ปลา ไม่ใช่จำนวนชุดฟลายที่ผ่านทุกเงื่อนไข บอดี้กับปีกยังอาจถูกบล็อกจากเงื่อนไขซ่อน เริ่มด้วยชุดที่มีขายในร้าน ถ้าไม่กิน ให้ดูชุดสำรองสามชุดแทนการซื้อบอดี้ทุกชิ้น",
    flyBackupAction: "ดูชุดฟลายสำรองสามชุดของปลานี้",
    firstStep: "เริ่มจากดูแผนที่ แล้วค่อยเลือกอุปกรณ์",
    firstStepBody: "เลือกด่านเพื่อดูจุดตก แล้วเลือกชุดอุปกรณ์ด้านล่างตามวิธีที่คุณเล่น",
    chooseSpots: "เลือกด่านที่จะไปตก",
    compatible: "เลือกเหยื่อหรือดูตัวเลือกฟลาย",
    compatibilityNote: "เหยื่อจริงและเหยื่อปลอมผ่านเงื่อนไขความเข้ากันได้ที่บันทึกไว้ของปลานี้ ส่วนบอดี้ฟลายด้านล่างตรงกับโปรไฟล์ปลาเท่านั้น ชุดบอดี้/ปีกยังมีเงื่อนไขซ่อนเพิ่มเติม ไม่รับประกันว่าปลาจะกินหรือตกขึ้นได้",
    mapAction: "เปิดแผนที่และจุดของปลา",
    configuredPoints: (n) => `${n} จุดที่เกมกำหนด`,
    spawnSlots: (n) => `${n} ช่องเกิดปลาในตาราง ROM`,
    stage: (n) => `ด่าน ${n}`,
    unknownArea: "ยังไม่พบตำแหน่งเกิดปลาที่ยืนยันได้ในตารางตำแหน่งที่ถอดจาก ROM",
    unknownFish: (id) => `โปรไฟล์ปลาที่ยังระบุชนิดไม่ได้ · ID ${id}`,
    unknownName: (id) => `โปรไฟล์ปลา ${id}`,
    noSprite: "ยังไม่มีรูปปลาที่ถอดจากโปรไฟล์นี้",
    chooseArea: "เลือกด่านเพื่อเปิดแผนที่",
    float: "ชุดทุ่น",
    sinker: "ชุดตะกั่ว",
    viewItem: "ดูข้อมูลไอเท็ม",
    noCompatibility: "ยังไม่มีเหยื่อจริง เหยื่อปลอม หรือตัวฟลายที่ยืนยันว่าผ่านเงื่อนไขของโปรไฟล์นี้",
    evidence: "หลักฐาน ROM และพิกัด",
    evidenceIntro: "จำนวนและตำแหน่งด้านล่างมาจากตารางจุดเกิดปลาที่ถอดจาก ROM ญี่ปุ่นต้นฉบับซึ่งใช้ในงานนี้",
    profile: "ID โปรไฟล์ปลา",
    profileOffset: "ตำแหน่งข้อมูลโปรไฟล์ปลา",
    source: "ตารางต้นทาง",
    coords: "พิกัดที่เกมกำหนด",
    reference: "แหล่งข้อมูลเงื่อนไขเหยื่อ",
    legacyName: "ชื่ออื่นในแคตตาล็อก",
    recovery: "โหลดข้อมูลปลาไม่สำเร็จ ลองโหลดหน้านี้อีกครั้ง หรือกลับไปหน้าแคตตาล็อก",
    retryLoad: "ลองโหลดข้อมูลปลานี้อีกครั้ง"
  };

  // src/pages/fish/load-copy.js
  function loadCopy(ctx) {
    ctx.copy = { en: copy_en, ja: copy_ja, th: copy_th }[ctx.locale] || null;
  }

  // src/pages/fish/shoppingCopy_en.js
  var shoppingCopy_en = {
    title: "What should I buy for this fish?",
    area: "Choose your fishing area",
    intro: "If buying new tackle, start with the lowest-priced stocked option for each method below. Each passes this fish’s recorded check. Keep compatible tackle you already own; there is no need to buy a duplicate.",
    scope: "Lowest price within each method, not a bite or landing-success ranking. Offers requiring a shop unlock are excluded from these starter choices.",
    fly: "Fly: this price is for the ready-made set and its recorded parts; some sets omit a wing or tail. Hidden body/wing conditions may still prevent a bite.",
    none: "No compatible offer without an unlock is recorded here. Choose from all compatible tackle below, then open its details for purchase areas or acquisition instructions.",
    cost: "Price",
    bundle: "Ready-made fly set",
    all: "All compatible tackle",
    buy: "Open use and shop details"
  };

  // src/pages/fish/shoppingCopy_ja.js
  var shoppingCopy_ja = {
    title: "この魚には何を買う？",
    area: "釣るエリアを選ぶ",
    intro: "新しく買うなら、下の釣り方ごとに店頭在庫がある最安の候補から選べる。各候補はこの魚の判定を通る。対応する道具を持っているなら、同じものを買い直す必要はない。",
    scope: "各釣り方の最安価格であり、食いつき・取り込み成功率の順位ではない。店の解放が必要な販売は最初の候補から除いている。",
    fly: "フライの表示額は詳細にある店売りセット全体。ウィングやテールを含まないセットもある。隠れた本体・ウィング条件で食いつかない場合もある。",
    none: "このエリアでは、解放不要で販売される対応道具を確認できない。下の対応道具一覧から選び、詳細で販売エリアや入手方法を確認する。",
    cost: "価格",
    bundle: "店売りフライセット",
    all: "対応道具の全一覧",
    buy: "使い方と店の詳細を見る"
  };

  // src/pages/fish/shoppingCopy_th.js
  var shoppingCopy_th = {
    title: "เริ่มซื้ออะไรสำหรับปลานี้?",
    area: "เลือกด่านที่จะตก",
    intro: "ถ้าต้องซื้อใหม่ เลือกตัวเลือกที่ราคาต่ำสุดและมีขายในด่านนี้ โดยผ่านเงื่อนไขของปลานี้แล้ว ถ้ามีเหยื่อที่ผ่านเงื่อนไขอยู่แล้ว ใช้ต่อได้ ไม่ต้องซื้อซ้ำ",
    scope: "ราคาถูกสุดในแต่ละวิธีตก ไม่ใช่อันดับโอกาสกัดหรือดึงขึ้นสำเร็จ รายการที่ต้องปลดล็อกร้านก่อนยังไม่รวมในชุดเริ่มต้นนี้",
    fly: "ฟลาย: ราคานี้เป็นชุดสำเร็จรูปตามส่วนประกอบในรายละเอียด บางชุดไม่มีปีกหรือหาง ยังมีเงื่อนไขบอดี้/ปีกที่ซ่อนอยู่ซึ่งอาจทำให้ไม่กินเหยื่อ",
    none: "ไม่มีของที่ผ่านเงื่อนไขและมีขายแบบไม่ต้องปลดล็อกในด่านนี้ เลือกจากรายการเหยื่อทั้งหมดด้านล่าง แล้วเปิดรายละเอียดเพื่อดูด่านที่ขายหรือวิธีหา",
    cost: "ราคา",
    bundle: "ชุดฟลายสำเร็จรูป",
    all: "เหยื่อทั้งหมดที่ใช้ด้วยได้",
    buy: "เปิดวิธีใช้และร้าน"
  };

  // src/pages/fish/load-profile.js
  function loadProfile(ctx) {
    ctx.page = document.getElementById("fish-detail");
    ctx.params = new URLSearchParams(window.location.search);
    ctx.originalReturn = ctx.params.get("return") || "";
    ctx.id = ctx.normalizeId(ctx.params.get("id"));
    ctx.requestedStage = ctx.validStage(ctx.params.get("stage"));
    ctx.requestedMethod = ["float", "sinker", "lure", "fly"].includes(ctx.params.get("route")) ? ctx.params.get("route") : "";
    ctx.localReturn = ctx.safeLocalReturn(ctx.originalReturn);
    ctx.shoppingCopy = { en: shoppingCopy_en, ja: shoppingCopy_ja, th: shoppingCopy_th }[ctx.locale];
    ctx.setNavigation(ctx.requestedStage);
    fetchProfile(ctx);
  }
  function fetchProfile(ctx) {
    Promise.all([loadGallery(), loadLocations()]).then(([fishData, locationData]) => ctx.render(fishData, locationData)).catch((error) => {
      console.error("Fish profile failed to load or render.", error);
      showLoadError(ctx);
    });
  }
  function loadGallery() {
    return fetch("gallery-data.json?v=eel-ending-20261006-68").then((response) => {
      if (!response.ok) throw new Error("gallery data unavailable");
      return response.json();
    });
  }
  function loadLocations() {
    return fetch("fish-locations.json").then((response) => {
      if (!response.ok) throw new Error("location data unavailable");
      return response.json();
    });
  }
  function showLoadError(ctx) {
    ctx.page.innerHTML = `<section role="alert"><h1>${ctx.escapeHtml(ctx.copy.pageTitle)}</h1><p class="empty-state">${ctx.escapeHtml(ctx.copy.recovery)}</p><p><button type="button" class="route-button" id="fish-retry">${ctx.escapeHtml(ctx.copy.retryLoad)} ↻</button> <a class="route-button" href="${ctx.escapeHtml(ctx.cataloguePath())}">${ctx.escapeHtml(ctx.copy.catalogue)}</a></p></section>`;
    document.getElementById("fish-retry")?.addEventListener("click", () => location.reload());
  }

  // src/pages/fish/setup-locale.js
  function setupLocale(ctx) {
    ctx.locale = document.documentElement.dataset.locale || "en";
  }

  // src/pages/fish/index.js
  function initialize(ctx) {
    setupLocale(ctx);
    loadCopy(ctx);
    loadProfile(ctx);
  }

  // src/app/fish.js
  var runtimeContext = createPageRuntime(fish_exports);
  initialize(runtimeContext);
})();
