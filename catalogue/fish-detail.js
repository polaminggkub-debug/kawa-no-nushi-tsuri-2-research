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

  // src/entities/item/fly-lock.js
  var FRESH_SAVE_LOCK = Object.freeze({ body: 1, wing: 2 });
  function flyGroup(id) {
    return Number.parseInt(id, 16) % 4;
  }
  function flyLockedAt(bundle, lock = FRESH_SAVE_LOCK) {
    return flyGroup(bundle.body) === lock.body || flyGroup(bundle.wing || "00") === lock.wing;
  }
  function flyWorksOnFreshSave(bundle) {
    return !flyLockedAt(bundle);
  }
  function freshSaveOffers(offers, bundleOf = (offer) => offer) {
    const usable = offers.filter((offer) => flyWorksOnFreshSave(bundleOf(offer)));
    return usable.length ? usable : offers;
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
      const usable = method === "fly" ? freshSaveOffers(candidates, (offer) => offer.bundle) : candidates;
      return usable.length ? [usable[0]] : [];
    });
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
      return `สองชิ้นนี้ครอบคลุมปลาลัวร์ทั้ง ${count} ชนิด ราคารวม ¥${total} ถ้าซื้อใหม่ ไม่ต้องซื้อซ้ำถ้ามีคู่ที่ครอบคลุมครบอยู่แล้ว`;
    if (ctx.locale === "ja")
      return `この2つでルアーの対象${count}種すべてをカバーでき、新規購入は合計${total}円です。すでに全範囲をカバーする組を持っていれば買い直す必要はありません。`;
    return `This pair covers all ${count} lure fish for ¥${total} when buying new. Keep a full-coverage pair you already own.`;
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
      return "ปลาว่ายตามเมื่ออยู่ช่องเดียวกับลัวร์และคุณกด A หรือ B ต่อเนื่อง พอปลาอยู่ระดับเดียวกับลัวร์ให้กด A หนึ่งครั้ง ลัวร์สองชิ้นนี้เริ่มสู้ได้ไม่เท่ากันกับปลาแต่ละขนาด ดูกลุ่มขนาดบนการ์ดลัวร์";
    if (ctx.locale === "ja")
      return "魚がルアーと同じマスにいて、AかBを押し続けると追ってきます。同じ高さに来たらAを1回。この2つはファイトの開始値が魚のサイズで違うので、ルアーのカードでサイズ区分を確認してください。";
    return "A fish follows when it is on the lure’s tile and you keep tapping A or B; press A once when it is level with the lure. The two lures start the fight differently by fish size, so check the size class on each lure card.";
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
    if (ctx.locale === "th") return "ฟลายไม่ติด? พกชุดสามตัวกันล็อกเปลี่ยน";
    if (ctx.locale === "ja") return "フライに反応しない？ ロック変更に備える3本セット";
    return "No bite on a fly? A three-fly set against a lock change";
  }
  function backupIntro(ctx, total) {
    if (ctx.locale === "th")
      return `เซฟทุกอันมีล็อกลับที่อาจเปลี่ยนหลังนอนโรงแรม ชุดสามตัวนี้ถูกที่สุดที่ปลานี้กิน และมีบอดี้กับปีกอยู่คนละกลุ่มกันหมด จึงมีอย่างน้อยหนึ่งตัวที่ใช้ได้ไม่ว่าล็อกจะเป็นเลขไหน ซื้อใหม่รวม ¥${total} ไม่ต้องซื้อครบเพื่อเริ่มตก เซฟใหม่เริ่มจากตัวที่ติดป้าย “ใช้ได้บนเซฟใหม่” ก็พอ`;
    if (ctx.locale === "ja")
      return `どのセーブにも隠しロックがあり、宿泊で変わることがあります。この3本は、この魚が食べる最安の組み合わせで、ボディとウィングのグループがすべて違うため、ロックがどの数字でも少なくとも1本は使えます。新規購入は合計${total}円。始めるのに全部買う必要はありません。新規セーブでは「新規セーブで使える」の表示があるものから使えば十分です。`;
    return `Every save has a hidden lock that an inn rest can change. These three are the cheapest flies this fish takes, and their bodies and wings are all in different groups, so at least one works whatever the lock is. They cost ¥${total} in total when buying new, and you do not need all three to start. On a fresh save, begin with the one marked “Works on a fresh save”.`;
  }
  function backupAction(ctx) {
    if (ctx.locale === "th")
      return "ใส่ทีละตัวในฉากเดิมได้เลย ไม่ต้องนอนโรงแรมหรือเปลี่ยนฉาก ถ้าทุ่นอยู่ช่องของปลาแล้วไม่มีปลาตัวไหนสนใจฟลายเลย ให้สลับไปตัวถัดไป ถ้าปลาหันมาหาฟลายแสดงว่าตัวนั้นผ่านล็อกแล้ว ไม่ต้องเปลี่ยน";
    if (ctx.locale === "ja")
      return "同じフィールドのまま、宿泊や移動なしで1本ずつ切り替えます。ウキを魚のマスに置いても魚がまったく反応しないときは次の1本へ。魚がこちらを向いたら、そのフライはロックを通っているので替える必要はありません。";
    return "Swap them one at a time in the same field; no inn stay or travel needed. If your float is on the fish’s tile and nothing reacts to the fly, switch to the next one. If a fish turns toward the fly, it has passed the lock; change nothing.";
  }
  function backupScope(ctx) {
    if (ctx.locale === "th")
      return "การตีซ้ำด้วยฟลายตัวเดิมไม่เปลี่ยนล็อก มีแต่การนอนโรงแรมที่เปลี่ยนได้ (ราว 34% ที่เลขใดเลขหนึ่งเปลี่ยน) นอนแล้วให้ใส่ฟลายอีกครั้ง";
    if (ctx.locale === "ja")
      return "同じフライで投げ直してもロックは変わりません。変わるのは宿泊だけです（どちらかの数字が変わる確率は約34%）。泊まったら毛バリを装備し直してください。";
    return "Recasting the same fly never changes the lock; only an inn rest can (about a 34% chance that one of the two numbers changes). Re-equip your fly after resting.";
  }
  function lockBadge(ctx, bundle) {
    const works = flyWorksOnFreshSave(bundle);
    const text2 = works ? { th: "ใช้ได้บนเซฟใหม่", ja: "新規セーブで使える", en: "Works on a fresh save" } : {
      th: "ติดล็อกบนเซฟใหม่ (ใช้เมื่อล็อกเปลี่ยน)",
      ja: "新規セーブではロックされる（ロックが変わったら使う）",
      en: "Locked on a fresh save (use it once the lock changes)"
    };
    return `<p class="fly-backup-lock" data-fresh-save="${works ? "works" : "locked"}"><strong>${ctx.escapeHtml(text2[ctx.locale] || text2.en)}</strong></p>`;
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
    return `<article class="detail-section fly-backup" data-bundle="${def.body}/${def.wing}/${def.tail}" data-price="${bundle.shopPriceYen}"><h4>${ctx.escapeHtml(backupLocation(ctx, def))} · ¥${bundle.shopPriceYen}</h4>${lockBadge(ctx, def)}<p>${ctx.escapeHtml(backupPartsNote(ctx))}</p>${parts}<a class="route-button" href="${ctx.escapeHtml(backupShopLink(ctx, def, stage))}">${ctx.escapeHtml(backupBuyLabel(ctx))} ↗</a></article>`;
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

  // src/pages/fish/rod-fit.js
  var text = {
    th: {
      reach: "สายยาวพอสำหรับปลานี้",
      start: "เริ่มสู้ได้ดีกว่าสำหรับปลานี้",
      reachEffect: (reach, base) => `คันถูกสุดสาย ×${base} สั้นเกินสำหรับปลานี้ ถ้าปลาวิ่งไกลเกินสายจะขาดและเสียตะขอ คันนี้สาย ×${reach} ยาวพอ`,
      startEffect: () => "คันถูกสุดเริ่มสู้เสียเปรียบกับปลาชนิดนี้ (พลาดได้น้อยลง) คันนี้เริ่มสู้ได้ดีที่สุดกับปลาชนิดนี้",
      shortNote: "คันถูกสุดนี้สายสั้นเกินสำหรับปลาชนิดนี้ ถ้าปลาวิ่งไกลเกินสายจะขาดและเสียตะขอ",
      badNote: "คันถูกสุดนี้เริ่มสู้เสียเปรียบกับปลาชนิดนี้ พลาดได้น้อยลง"
    },
    ja: {
      reach: "この魚に糸の長さが足りる",
      start: "この魚で出だしが有利",
      reachEffect: (reach, base) => `最安竿の糸（×${base}）はこの魚には短く、遠くまで走られると糸が切れて針を失います。この竿は×${reach}で足ります。`,
      startEffect: () => "最安竿はこの魚で出だしが不利（許されるミスが減る）。この竿はこの魚で出だしが最良です。",
      shortNote: "最安竿の糸はこの魚には短く、遠くまで走られると糸が切れて針を失います。",
      badNote: "最安竿はこの魚で出だしが不利で、許されるミスが減ります。"
    },
    en: {
      reach: "The line is long enough for this fish",
      start: "A better fight start against this fish",
      reachEffect: (reach, base) => `The budget rod’s line (×${base}) is too short for this fish: if it runs farther the line breaks and the hook is lost. This rod’s ×${reach} holds it.`,
      startEffect: () => "The budget rod starts the fight worse against this fish (fewer mistakes allowed). This rod gives the best start against it.",
      shortNote: "The line of this budget rod is too short for this fish: if it runs farther the line breaks and the hook is lost.",
      badNote: "This budget rod starts the fight worse against this fish, so you can afford fewer mistakes."
    }
  };
  var copy = (ctx) => text[ctx.locale] || text.en;
  function rodFit(item, fish) {
    const fight = item.rodDecision?.fight;
    if (!fight || !Number.isInteger(fish)) return null;
    return {
      short: fight.short.includes(fish),
      bad: fight.bad.includes(fish),
      best: fight.best.includes(fish)
    };
  }
  function fitUpgrades(rods, budgetRod, fish) {
    const base = rodFit(budgetRod, fish);
    if (!base) return [];
    const pick = (test) => rods.find((rod) => {
      const fit = rod.id !== budgetRod.id && rodFit(rod, fish);
      return fit && test(fit);
    });
    const found = [
      ["reach", base.short ? pick((fit) => !fit.short) : null],
      ["start", base.bad ? pick((fit) => fit.best) : null]
    ];
    return found.filter(([, rod]) => rod);
  }
  function fitHeadline(ctx, dimension) {
    return copy(ctx)[dimension];
  }
  function fitEffect(ctx, dimension, item, budgetRod) {
    const reach = (rod) => rod.playerUse?.rodMetrics?.reachMultiplierRaw;
    return dimension === "reach" ? copy(ctx).reachEffect(reach(item), reach(budgetRod)) : copy(ctx).startEffect();
  }
  function fitNote(ctx, budgetRod, fish) {
    const fit = rodFit(budgetRod, fish);
    if (!fit || !(fit.short || fit.bad)) return "";
    const note = fit.short ? copy(ctx).shortNote : copy(ctx).badNote;
    return `<p class="method-rod-fit">${ctx.escapeHtml(note)}</p>`;
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
    const fit = fitNote(ctx, choice, Number.parseInt(ctx.id, 16));
    return `<section class="method-rod" data-method-rod="${method}" data-rod="${choice.id}" data-rod-local="${Boolean(localRods.length)}"><h4>${ctx.escapeHtml(title)}</h4><p>${ctx.escapeHtml(owned)}</p><p>${ctx.escapeHtml(decision)}</p>${fit}${ctx.itemLink({ item: choice, routes: [] }, stage)}${total}${upgrades}</section>`;
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
  function rodUpgradeLeaders(rods, budgetRod, fish) {
    if (!budgetRod || rods.length < 2) return [];
    const baselineAim = rodMetric(budgetRod, "aimCutoffAt100Hp");
    if (baselineAim === null) return [];
    const leaders = [
      ["aim", metricLeader(rods, "aimCutoffAt100Hp", "reachMultiplierRaw")],
      ...fitUpgrades(rods, budgetRod, fish)
    ];
    const choices = /* @__PURE__ */ new Map();
    for (const [dimension, item] of leaders) {
      if (!item) continue;
      if (dimension === "aim" && rodMetric(item, "aimCutoffAt100Hp") <= baselineAim) continue;
      const choice = choices.get(item.id) || { item, dimensions: [] };
      choice.dimensions.push(dimension);
      choices.set(item.id, choice);
    }
    return [...choices.values()];
  }
  function upgradeHeadline(ctx, dimensions) {
    const aim = ctx.locale === "th" ? "มีเวลาเล็งนานสุดในร้านด่านนี้" : ctx.locale === "ja" ? "このエリアの店頭で狙う時間が最長" : "Most time to aim in this area";
    const parts = dimensions.map(
      (dimension) => dimension === "aim" ? aim : fitHeadline(ctx, dimension)
    );
    return parts.join(" · ");
  }
  function upgradeEffect(ctx, dimension, item, budgetRod) {
    if (dimension !== "aim") return fitEffect(ctx, dimension, item, budgetRod);
    const aim = rodMetric(item, "aimCutoffAt100Hp");
    const baseAim = rodMetric(budgetRod, "aimCutoffAt100Hp");
    if ([2, 4].includes(item.decodedFields?.styleCode)) {
      if (ctx.locale === "th")
        return `ที่ HP 100 มีเวลาเล็ง ${aim} เทียบกับ ${baseAim} ของคันราคาต่ำสุด; ถ้า HP ต่ำกว่า 100 เวลาเล็งจะสั้นลง`;
      if (ctx.locale === "ja")
        return `HP100のときの狙う時間は${aim}、最安竿は${baseAim}。HPが100未満だと短くなります。`;
      return `At 100 HP, aim time ${aim} vs ${baseAim} for the cheapest rod; below 100 HP you get less time to aim.`;
    }
    if (ctx.locale === "th")
      return `เวลาเล็ง ${aim} เทียบกับ ${baseAim} ของคันราคาต่ำสุด จึงมีเวลาขยับเป้านานขึ้นก่อนเกมตัดสินว่าเหยื่อตกตรงไหน`;
    if (ctx.locale === "ja")
      return `狙う時間は${aim}、最安竿は${baseAim}。投げ先を動かす時間が長くなります。`;
    return `Aim time ${aim} vs ${baseAim} for the cheapest rod gives you longer to move the target before the game decides where the cast lands.`;
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
    return `<article class="method-rig-choice method-rod-upgrade" data-rod-upgrade="${item.id}" data-rod-upgrade-dimensions="${choice.dimensions.join(",")}"><h5>${ctx.escapeHtml(label)}</h5><a class="entity-link" href="${ctx.escapeHtml(link)}">${image}<span><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><small>${ctx.escapeHtml(upgradeCost(ctx, item, budgetRod))}</small></span></a>${benefit.map((text2) => `<p>${ctx.escapeHtml(text2)}</p>`).join("")}${total ? `<p><strong>${ctx.escapeHtml(total)}</strong></p>` : ""}</article>`;
  }
  function setupTotalNote(ctx, total) {
    if (ctx.locale === "th") return `ซื้อของทั้งชุดใหม่รวม ¥${total}`;
    if (ctx.locale === "ja") return `一式を新品で購入した合計${total}円`;
    return `Complete new setup total ¥${total}`;
  }
  function renderRodUpgradeChoices(ctx, method, stage, rods, budgetRod, baseTotal) {
    const choices = rodUpgradeLeaders(rods, budgetRod, Number.parseInt(ctx.id, 16));
    if (!choices.length) return "";
    const title = ctx.locale === "th" ? "ถ้าคันถูกสุดไม่เหมาะกับปลานี้ หรืออยากมีเวลาเล็งนานขึ้น" : ctx.locale === "ja" ? "最安竿がこの魚に合わない場合や、狙う時間を上げたい場合" : "If the budget rod does not suit this fish, or you want more time to aim";
    const scope = ctx.locale === "th" ? "สายยาวพอและจุดเริ่มสู้ที่ดีกว่าช่วยให้ปลาไม่หลุดและสายไม่ขาด (วัดจากการจำลองการสู้ปลา) ส่วนเวลาเล็งไม่ได้ทำให้ปลากินง่ายขึ้น; คันนี้ต้องซื้อใหม่ราคาเต็ม" : ctx.locale === "ja" ? "糸の長さが足りて出だしが有利なほど、魚を逃がしにくく糸も切れにくくなります（ファイトのシミュレーションによる）。狙う時間で食いつきは良くなりません。新品の全額が必要です。" : "A line that is long enough and a better fight start keep the fish from escaping and the line from breaking (measured in simulated fights). Time to aim does not make fish bite more. The rod costs its full new-purchase price.";
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
        return "ด่านนี้ปลาชนิดนี้มีหมุดเดียว ถ้าหมุดว่าง ให้ตกปลาในด่านนั้นแล้วนอนโรงแรมของด่านนั้น ทำซ้ำจนปลากลับมา ปลาว่ายห่างจากหมุดได้ ลองดูรอบ ๆ ด้วย";
      if (ctx.locale === "ja")
        return "このエリアでこの魚のピンは1か所だけです。空なら、そのエリアで釣りをして宿屋で寝る、を魚が戻るまで繰り返します。魚はピンから離れて泳ぐので、周りも探してください。";
      return "This fish has only one pin in this area. If it is empty, fish in the area and sleep at its inn, and repeat until the fish returns. Fish drift away from the pin, so check nearby water too.";
    }
    if (ctx.locale === "th")
      return "หมุดคือจุดที่ปลาอยู่ตอนโหลดเกม แล้วปลาจะว่ายไปมา ส่วนใหญ่ไม่เกิน 1–2 ช่องจากหมุด ถ้าหมุดว่าง ลองหมุดอื่น ปลาที่ตกขึ้นแล้วหรือหลุดไปจะหายจากหมุดจนกว่าจะนอนโรงแรมของด่านนั้น";
    if (ctx.locale === "ja")
      return "ピンはロード直後に魚がいる場所で、その後は泳ぎ回ります（ほとんどは1～2マス以内）。空なら別のピンも試してください。釣り上げた魚や逃げた魚は、そのエリアの宿屋で寝るまでピンに戻りません。";
    return "Pins show where fish start after loading, then they wander (most stay within 1–2 tiles). If a pin is empty, try another. A landed or escaped fish stays gone until you sleep at that area’s inn.";
  }
  function howItWorksLink(ctx) {
    const label = ctx.locale === "th" ? "ปลาบนแผนที่ทำงานอย่างไร" : ctx.locale === "ja" ? "マップ上の魚のしくみ" : "How fish on the map work";
    return `<p><a href="${ctx.escapeHtml(ctx.mapPath())}#how-fish-work">${ctx.escapeHtml(label)} ↗</a></p>`;
  }
  function renderAreas(ctx, locations, activeStage, fish) {
    if (!locations.length)
      return `<section class="detail-section fish-where-to-go"><h2>${ctx.escapeHtml(ctx.copy.areas)}</h2><p class="empty-state">${ctx.escapeHtml(ctx.copy.unknownArea)}</p></section>`;
    const selected = locations.find((location2) => String(location2.stage) === String(activeStage)) || locations[0];
    const stage = String(selected.stage), name = selected.stageName?.[ctx.locale] || selected.stageName?.en || ctx.copy.stage(stage);
    const maps = (selected.maps || []).map((map) => ctx.renderAreaMap(map, selected, fish)).join("");
    const caution = emptyPointAdvice(ctx, pointCount(ctx, selected));
    return `<section class="detail-section fish-where-to-go" id="fish-area-map"><h2>${ctx.escapeHtml(ctx.copy.areas)}</h2><label class="area-select-label" for="shopping-area">${ctx.escapeHtml(ctx.shoppingCopy.area)}</label><select id="shopping-area" class="area-select">${locations.map((location2) => `<option value="${ctx.escapeHtml(location2.stage)}" ${String(location2.stage) === stage ? "selected" : ""}>${ctx.escapeHtml(ctx.copy.stage(location2.stage))} · ${ctx.escapeHtml(location2.stageName?.[ctx.locale] || location2.stageName?.en || "")}</option>`).join("")}</select><article class="detail-section area-card current-area" data-active="true"><h3>${ctx.escapeHtml(ctx.copy.stage(stage))} · ${ctx.escapeHtml(name)}</h3><p class="area-point-count">${ctx.escapeHtml(ctx.copy.configuredPoints(ctx.pointCount(selected)))}</p><p class="section-lede">${ctx.escapeHtml(caution)}</p>${howItWorksLink(ctx)}${maps ? `<div class="detail-grid area-map-grid">${maps}</div>` : ""}<a class="route-button" href="${ctx.escapeHtml(ctx.fishMapLink(stage))}">${ctx.escapeHtml(ctx.copy.mapAction)} ↗</a></article></section>`;
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
    const text2 = ctx.locale === "th" ? "ถ้ายังไม่เคยแลกและต้องการหัวไชเท้า 16 ชิ้น เก็บปลายามาโนะคามิหนึ่งตัวในข้องไว้ให้ NPC ด่าน 3 (21,82) ก่อนกินหรือขาย แต่การแลกทับอาหารเดิมทุกช่อง: ใช้อาหารเดิมที่ต้องการก่อน หรือข้ามการแลกถ้าต้องการเก็บอาหารไว้" : ctx.locale === "ja" ? "まだ交換しておらず大根16個が欲しいなら、食べたり売ったりする前にヤマノカミ1匹をびくに残し、エリア3（21,82）の人物へ。ただし食料全枠を上書きする。必要な食料は先に使い、残したいなら交換を見送る。" : "If you have not traded yet and want 16 Daikon, keep one Yamanokami for the area-3 NPC at (21,82) before eating or selling it. The trade replaces every food slot: use wanted food first, or skip the trade to keep it.";
    return `<section class="detail-section" data-fish-exchange><h2>${ctx.escapeHtml(title)}</h2>${rewards.map((item) => `<p>${ctx.escapeHtml(item.exchangeFishAction?.[ctx.locale] || item.exchangeFishAction?.en || text2)}</p>${ctx.itemLink({ item, routes: [] }, stage)}`).join("")}</section>`;
  }
  function unconfirmedProfileAction(ctx) {
    const title = ctx.locale === "th" ? "ไม่ต้องจัดชุดตกสำหรับรายการ 43" : ctx.locale === "ja" ? "プロフィール43用の仕掛けを買う必要はありません" : "Do not buy a fishing setup for profile 43";
    const text2 = ctx.locale === "th" ? "เลือกปลาที่มีชื่อและจุดตกยืนยันแล้วแทน รายการนี้ไม่มีจุดที่ปลาปรากฏที่ยืนยันแล้ว และไม่มีเหยื่อจริง ลัวร์ หรือตัวฟลายที่ใช้ได้กับมัน การมีข้อมูลอยู่ในเกมไม่ได้แปลว่าเป็นปลาที่พบและตกได้ตามปกติ" : ctx.locale === "ja" ? "名前と確認済みの釣り場がある魚を選んでください。この項目には抽出した出現表の確認済み地点がなく、エサ・ルアー・フライ本体の判定を通る候補もありません。ROMに行があるだけでは、通常出現して釣れる魚とは確認できません。" : "Choose a named fish with confirmed fishing spots instead. This entry has no confirmed point in the extracted spawn table, and no bait, lure or fly body passes its recorded check. A row in the ROM does not establish that it normally appears and can be caught.";
    return `<section class="detail-section" data-unconfirmed-profile-action><h2>${ctx.escapeHtml(title)}</h2><p>${ctx.escapeHtml(text2)}</p><a class="route-button" href="${ctx.escapeHtml(ctx.cataloguePath())}?category=all#catalogue">${ctx.locale === "th" ? "เลือกปลาอื่นจากช่องค้นหา" : ctx.locale === "ja" ? "検索欄で別の魚を選ぶ" : "Choose another fish in the search field"} ↗</a></section>`;
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
    const text2 = ctx.locale === "th" ? "ก่อนใช้คันลัวร์หรือคันหวด เติม HP ให้ถึง 100 เพื่อให้ได้เวลาเล็งเต็มของคันนั้น ไม่ใช่โบนัสโอกาสปลากิน" : ctx.locale === "ja" ? "ルアー竿・投げ竿を使う前にHPを100まで回復すると、竿本来の狙う時間になります。食いつき率のボーナスではありません。" : "Restore HP to 100 before lure or casting fishing to get the rod’s full time to aim. This does not add a bite-rate bonus.";
    const action = hpRecoveryAction({
      locale: ctx.locale,
      cataloguePath: ctx.cataloguePath(),
      stage,
      returnPath: `${ctx.currentFishPath(stage)}#starter-${method}`,
      source: `fish-${method}`,
      escapeHtml: ctx.escapeHtml
    });
    return `<p class="aim-tip">${ctx.escapeHtml(text2)}</p><p>${action}</p>`;
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
  function starterItem(ctx, offer, stage, text2) {
    const item = offer.entry.item;
    const bundle = offer.bundle ? ` · ${ctx.escapeHtml(text2.bundle)}` : "";
    return `<a class="entity-link" href="${ctx.escapeHtml(starterLink(ctx, offer, stage))}"><img src="${ctx.escapeHtml(item.image)}" alt=""><span><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><small>${ctx.escapeHtml(text2.cost)} ¥${offer.price}${bundle}</small></span></a>`;
  }
  function starterCard(ctx, offer, stage, allItems, text2) {
    const method = offer.method;
    const item = offer.entry.item;
    const rig = ctx.renderRigForMethod(method, stage, allItems, offer.price);
    const aim = aimTip(ctx, method, stage);
    const fly = offer.bundle ? `<p class="muted">${ctx.escapeHtml(text2.fly)}</p>` : "";
    const link = starterLink(ctx, offer, stage);
    const total = rig.match(/data-rig-total="(\d+)"/)?.[1];
    const rod = ctx.renderRodForMethod(method, stage, allItems, offer.price, Number(total));
    const summaryTotal = total || rod.match(/data-method-setup-total="(\d+)"/)?.[1];
    const summary = starterSummary(ctx, offer, summaryTotal);
    const open = ctx.requestedMethod === method ? " open" : "";
    return `<details class="detail-section starter-offer" id="starter-${method}" data-method="${method}" data-item="${item.category}:${item.id}" data-price="${offer.price}"${open}><summary>${summary}</summary>${starterItem(ctx, offer, stage, text2)}${rod}${rig}${aim}${fly}<a class="route-button" href="${ctx.escapeHtml(link)}">${ctx.escapeHtml(text2.buy)} ↗</a></details>`;
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
  function starterCards(ctx, offers, stage, allItems, text2) {
    return offers.map((offer) => starterCard(ctx, offer, stage, allItems, text2)).join("");
  }
  function selectedArea(ctx, locations, stage, text2) {
    const selected = locations.find((location2) => String(location2.stage) === String(stage)) || locations[0];
    const name = selected.stageName?.[ctx.locale] || selected.stageName?.en || "";
    return `<p class="shopping-area-context"><strong>${ctx.escapeHtml(text2.area)}:</strong> ${ctx.escapeHtml(ctx.copy.stage(selected.stage))} · ${ctx.escapeHtml(name)}</p>`;
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
    const copy5 = missingMethodCopy(ctx, method, stage, entries.length);
    const actions = [];
    if (conditional) {
      const item = conditional.entry.item;
      const href = offerLink(ctx, method, conditional.entry, stage, stage);
      actions.push(
        `<a class="route-button" data-conditional-sale href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy5.conditional(ctx.localizedItemName(item)))}</a>`
      );
    }
    if (fallback) {
      const item = fallback.entry.item;
      const amount = salePrice(fallback);
      const price = Number.isFinite(amount) ? ` · ¥${amount}` : "";
      const href = offerLink(ctx, method, fallback.entry, stage, fallback.shop.stage);
      actions.push(
        `<a class="route-button" data-recorded-sale href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy5.sale(fallback.shop.stage, `${ctx.localizedItemName(item)} (ID ${item.id})`, price))} ↗</a>`
      );
    } else if (!conditional) {
      const entry = entries[0];
      const href = compatibleItemLink(ctx, method, entry, stage);
      actions.push(
        `<a class="route-button" data-acquisition-details href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy5.detail(`${ctx.localizedItemName(entry.item)} (ID ${entry.item.id})`))} ↗</a>`
      );
    }
    const noSales = !fallback && !conditional ? `<p class="muted">${ctx.escapeHtml(copy5.noSales)}</p>` : "";
    return `<article class="detail-section method-no-local-stock" data-method-no-local="${method}"><h3>${ctx.escapeHtml(copy5.title)}</h3><p>${ctx.escapeHtml(copy5.owned)}</p>${noSales}<div class="method-stock-actions">${actions.join("")}</div></article>`;
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
    const text2 = ctx.shoppingCopy;
    const offers = ctx.starterOffers(entries, stage);
    const cards = starterCards(ctx, offers, stage, allItems, text2);
    const noOffer = offers.length ? "" : `<p>${ctx.escapeHtml(text2.none)}</p>`;
    const missingMethods = missingMethodActions(ctx, entries, offers, stage);
    const area = selectedArea(ctx, locations, stage, text2);
    const kit = ctx.renderReusableKit(allItems, stage);
    const fallback = ctx.renderFlyFallback(allItems, stage, flyChoices);
    return `<section id="fish-shopping" class="detail-section shopping-plan"><h2>${ctx.escapeHtml(text2.title)}</h2>${area}<p>${ctx.escapeHtml(text2.intro)}</p>${offers.length ? `<div class="detail-grid">${cards}</div>` : noOffer}${missingMethods ? `<div class="detail-grid missing-method-grid">${missingMethods}</div>` : ""}<p class="muted">${ctx.escapeHtml(text2.scope)}</p><a href="#all-compatible">${ctx.escapeHtml(text2.all)} ↓</a>${kit}${fallback}</section>`;
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
  function iconFact(copy5, iconClass) {
    if (iconClass === "small") return copy5.smallFact;
    if (iconClass === "large") return copy5.largeFact;
    return copy5.bubbleFact;
  }
  function iconCard(ctx, copy5, waterIcons, profile, iconClass, stage) {
    const conditional = profile.growthOnlyClasses?.includes(iconClass) === true;
    const label = conditional ? copy5.growthLabel : copy5[iconClass];
    const image = ctx.escapeHtml(imageFor(waterIcons, iconClass) + "?v=native-20261005");
    const fact = ctx.escapeHtml(conditional ? copy5.growthFact : iconFact(copy5, iconClass));
    const bubbleAction = iconClass === "bubble" && profile.bubble === true ? `<a class="route-button" data-water-bait-link href="${ctx.escapeHtml(potatoBaitLink(ctx, stage))}">${ctx.escapeHtml(copy5.baitAction)} ↗</a>` : "";
    return `<article class="entity-link water-icon-card" data-water-icon="${iconClass}" data-water-class-evidence="${conditional ? "growth-only" : "initial"}"><img loading="lazy" src="${image}" alt="${ctx.escapeHtml(label)}"><span><strong>${ctx.escapeHtml(label)}</strong><small>${fact}</small></span>${bubbleAction}</article>`;
  }
  function evidenceDetails(ctx, copy5) {
    const href = "https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/water-surface-icons.md";
    return `<details class="water-icon-evidence"><summary>${ctx.escapeHtml(copy5.evidence)}</summary><p><a href="${href}">${ctx.escapeHtml(copy5.evidenceLink)} ↗</a></p></details>`;
  }
  function renderWaterIcons(ctx, waterIcons, stage) {
    const profile = waterIcons?.profiles?.[ctx.id];
    if (!waterIcons?.romSha1 || !profile) return "";
    const classes = visibleClasses(waterIcons, profile);
    if (!classes.length) return "";
    const copy5 = copyFor(ctx);
    const cards = classes.map((iconClass) => iconCard(ctx, copy5, waterIcons, profile, iconClass, stage)).join("");
    return `<section class="detail-section water-icon-guide" id="water-icons"><h2>${ctx.escapeHtml(copy5.title)}</h2><p class="section-lede">${ctx.escapeHtml(copy5.intro)}</p><div class="detail-grid water-icon-grid">${cards}</div>${evidenceDetails(ctx, copy5)}</section>`;
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
  var copy2 = {
    th: {
      title: "ยามาเมะด่าน 1: สู้ปลาและดูผล",
      action: "ลองกด A แล้วปล่อยคั่นเป็นช่วง ๆ สำหรับยามาเมะด่าน 1: เป็นข้อเสนอทดลองจากเหตุการณ์เดียวและชุดที่ระบุ ไม่ใช่สูตรรับประกัน",
      surface: "เมื่อขึ้นข้อความว่าตกยามาเมะได้แล้ว กด A เพื่อไปต่อจนเห็นขนาด จากนั้นเปิดสมุดบันทึกการตกปลาตรวจบันทึก — A ตรงนี้เลื่อนข้อความผล ไม่ได้พิสูจน์ว่าเป็นปุ่มที่ทำให้จับได้",
      notebook: "เปิดข้อมูลสมุดบันทึกการตกปลา (ไอเท็ม 05)",
      surfaceEvidence: "การเล่นซ้ำจากเซฟเหตุการณ์เดิมให้ผล 23 ซม. ตรงกันทั้งแบบต่อ 4 ช่วงและแบบรวม ในการเทียบช่วงผิวน้ำ 167 เฟรมเท่ากัน แบบกดเฉพาะ A ไปถึงผลและบันทึก 1/23/1 ส่วนไม่กดปุ่ม/กดเฉพาะขึ้น/กดเฉพาะ B ยังอยู่หน้าชื่อปลาที่จับได้และบันทึก 0/0/0 ไม่ใช่หลักฐานว่าปุ่มอื่นทำให้ปลาหนีหรือไม่มีวันไปต่อ",
      caughtName: "หน้าชื่อปลาที่จับได้ ก่อนเลื่อนไปผลขนาด",
      surfaceResult: "ผล 23 ซม. หลังใช้เฉพาะ A ในช่วงผิวน้ำ",
      result: "จากเหตุการณ์ธรรมชาติหนึ่งครั้ง เมื่อเวลาเล่นรวมและเวลาที่กด A รวมเท่ากัน แบบแบ่งกด/ปล่อยทำให้ปลายังอยู่ ส่วนแบบค้างยาวครั้งเดียวแล้วปล่อยจบด้วยปลาหนี ยังไม่ทราบจังหวะที่ดีที่สุดหรือสูตรที่รับประกันจับได้",
      evidence: "ดูชุดที่ทดลองและหลักฐาน",
      setup: "ชุดที่ทดลอง: คัน 02 (คันคาร์บอนลำธาร 6m) · ทุ่น 04 (ทุ่นลูกบอล) · เบ็ด 06 (เบ็ดทั่วไป) · เหยื่อ 07 (แมลงน้ำ) ก่อนโยน · HP 100 ตามที่เกมทำงาน การกด A/B ค้างกับการปล่อยให้ผลต่างกัน ตราบที่ปลายังไม่ถึงค่าสายขาดยากของคัน",
      continuation: "ผล 23 ซม. มาจากการเล่นต่อด้วยปุ่มเพิ่มเติมหลังการเปรียบเทียบ ไม่ใช่ผลจับได้ทันทีจากจังหวะข้างต้น และยังไม่ยืนยันว่าช่วยเพิ่มโอกาสจับในชุดอื่น",
      trace: "อ่านวิธีทดลอง ข้อจำกัด และโค้ดที่ตรวจ",
      escape: "ภาพผลปลาหนีจากการกดค้าง",
      catch: "ภาพ 23 ซม. หลังเล่นต่อแยกต่างหาก"
    },
    en: {
      title: "Area 1 Yamame: fight and result controls",
      action: "Try A presses with release intervals for Area 1 Yamame: an experimental option from one encounter and the listed setup, not a guaranteed rhythm.",
      surface: "Once the caught-Yamame message appears, press A to advance to the size result, then check the Fishing Notebook. Here A advances the result message; it is not proven to cause the catch.",
      notebook: "Open Fishing Notebook (Tool 05) details",
      surfaceEvidence: "A fresh replay of the retained encounter reproduced 23 cm with identical four-phase and flattened endpoints. At equal 167-frame surface time, A-only reached the result and record 1/23/1; neutral, Up-only and B-only remained at the caught-name message with record 0/0/0. This does not show other buttons cause escape or can never advance later.",
      caughtName: "Caught-name message before the size result",
      surfaceResult: "23 cm result after A-only surface inputs",
      result: "In one natural encounter, schedules with the same total time and A-held time left the fish in the fight when split into presses and releases; one long hold followed by release ended in escape. No best rhythm or guaranteed catch is established.",
      evidence: "Tested setup and evidence",
      setup: "Tested setup: rod 02 (Mountain stream carbon rod 6 m) · float 04 (Ball float) · hook 06 (Generic hook) · bait 07 (Aquatic insect) before casting · HP 100. In the game, holding A/B and releasing them give different results while the fish has not yet reached the rod’s line-strength limit.",
      continuation: "The 23 cm catch required a separate continuation with additional inputs after the comparison. It was not an immediate catch from the pattern above, and no catch advantage is established for other setups.",
      trace: "Read the experiment, limitations and code trace",
      escape: "Hold-input escape result",
      catch: "23 cm result after the separate continuation"
    },
    ja: {
      title: "エリア1のヤマメ：ファイトと釣果表示",
      action: "エリア1のヤマメではAを押して離す操作を試せます。同じ1回の遭遇と記載装備に限る実験的な提案で、確実に釣れるリズムではありません。",
      surface: "ヤマメを釣りあげたメッセージが出たら、Aで大きさの結果まで進め、釣りノートで記録を確認してください。ここでのAは結果表示を進める操作で、釣れた原因とは証明されていません。",
      notebook: "釣りノート（道具05）の詳細を開く",
      surfaceEvidence: "保存した同じ遭遇の再実行で、4段階と連結実行の終了状態は一致し23cmを再現しました。水面側の167フレーム比較ではAのみが結果と記録1/23/1に進み、無入力・上のみ・Bのみは釣れた魚の名前表示で記録0/0/0でした。他のボタンで逃げる、または後で進めないという証明ではありません。",
      caughtName: "大きさの結果前の釣れた魚の名前表示",
      surfaceResult: "水面側でAのみを使った後の23cm結果",
      result: "自然発生した1回のファイトで、経過時間とAを押した合計時間を同じにすると、押す・離すを分けた操作では魚が残り、長く1回押してから離す操作では逃げられました。最適なリズムや必ず釣れる操作は未確認です。",
      evidence: "実験した装備と根拠",
      setup: "実験装備：竿02（渓流カーボン竿6m）・ウキ04（玉ウキ）・ハリ06（ハリ）・投げる前のエサ07（カワムシ）・HP100。ゲームでは、魚が竿の切れにくさの限界に達するまでは、A/Bを押している状態と離した状態を別に処理します。",
      continuation: "23cmの釣果は比較後に別の追加操作を行った結果です。上のリズムだけで直ちに釣れた結果ではなく、他の装備で釣果が上がることも未確認です。",
      trace: "実験方法・制限・コードを読む",
      escape: "押し続けた操作の逃走結果",
      catch: "別の追加操作後の23cmの結果"
    }
  };
  function renderFightControls(ctx, stage) {
    if (ctx.id !== "03" || String(stage) !== "1") return "";
    const text2 = copy2[ctx.locale] || copy2.en;
    const esc = ctx.escapeHtml;
    const query = new URLSearchParams({
      category: "general_tool",
      id: "05",
      stage: "1",
      return: ctx.currentFishPath(stage)
    });
    const notebookHref = `${ctx.itemPath()}?${query}`;
    return `<section id="fight-controls" class="detail-section"><h2>${esc(text2.title)}</h2><p><strong>${esc(text2.action)}</strong></p><p data-fight-surface-progression>${esc(text2.surface)} <a data-fight-notebook-action href="${esc(notebookHref)}">${esc(text2.notebook)} ↗</a></p><details id="fight-controls-evidence"><summary>${esc(text2.evidence)}</summary><p>${esc(text2.result)}</p><p>${esc(text2.setup)}</p><p>${esc(text2.continuation)}</p><p>${esc(text2.surfaceEvidence)} <a href="../research/assets/fight-a-surface-result.png">${esc(text2.surfaceResult)} ↗</a></p><p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fight-input-research.md">${esc(text2.trace)} ↗</a></p><div class="fight-captures"><figure><a href="../research/assets/fight-hold-escape.png"><img src="../research/assets/fight-hold-escape.png" alt="${esc(text2.escape)}" loading="lazy"></a><figcaption>${esc(text2.escape)}</figcaption></figure><figure><a href="../research/assets/fight-release-catch.png"><img src="../research/assets/fight-release-catch.png" alt="${esc(text2.catch)}" loading="lazy"></a><figcaption>${esc(text2.catch)}</figcaption></figure><figure><a href="../research/assets/fight-caught-name.png"><img src="../research/assets/fight-caught-name.png" alt="${esc(text2.caughtName)}" loading="lazy"></a><figcaption>${esc(text2.caughtName)}</figcaption></figure></div></details></section>`;
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
  var copy3 = {
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
      unknownBody: "ข้อมูลที่ยืนยันได้ยังไม่ระบุว่าปลานี้มีช่องในสมุดหรือไม่ โปรดตรวจสมุดบันทึกการตกปลา (ไอเท็ม 05) ในเกม"
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
      unknownBody: "現在確認できるデータでは記録対象か判断できません。ゲーム内の釣りノート（道具05）で確認してください。"
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
      unknownBody: "Available evidence does not confirm whether this fish has a notebook slot. Check the Fishing Notebook (Tool 05) in the game."
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
  function renderEligible(ctx, entry, text2) {
    const stages = (entry.stages || []).filter(validStage2).map(Number).sort((a, b) => a - b);
    const first = Number(entry.firstOccurrenceStage);
    if (!validStage2(first) || !stages.length) return renderUnconfirmed(ctx, text2);
    const otherStages = stages.filter((stage) => stage !== first);
    const locations = otherStages.length ? text2.repeats(otherStages.join(", ")) : text2.noRepeats;
    return `<section id="fish-notebook" class="decision-panel fish-notebook-goal" data-fish-notebook-status="eligible" data-notebook-first-stage="${first}" data-notebook-stages="${stages.join(",")}"><h2>${ctx.escapeHtml(text2.eligibleTitle)}</h2><p>${ctx.escapeHtml(text2.eligibleBody)}</p><p><strong>${ctx.escapeHtml(text2.first(first))}</strong> · ${ctx.escapeHtml(locations)}</p><p>${ctx.escapeHtml(text2.recorded)}</p><a class="route-button" href="#fish-area-map">${ctx.escapeHtml(text2.map)} ↑</a><p>${notebookChecklistLink(ctx, first)}</p></section>`;
  }
  function renderExcluded(ctx, text2) {
    return `<section id="fish-notebook" class="decision-panel fish-notebook-goal" data-fish-notebook-status="excluded"><h2>${ctx.escapeHtml(text2.excludedTitle)}</h2><p>${ctx.escapeHtml(text2.excludedBody)}</p></section>`;
  }
  function renderUnconfirmed(ctx, text2) {
    return `<section id="fish-notebook" class="decision-panel fish-notebook-goal" data-fish-notebook-status="unconfirmed"><h2>${ctx.escapeHtml(text2.unknownTitle)}</h2><p>${ctx.escapeHtml(text2.unknownBody)}</p></section>`;
  }
  function renderNotebookStatus(ctx, fishData) {
    const text2 = copy3[ctx.locale] || copy3.en;
    const state = notebookState(fishData, ctx.id);
    if (state.kind === "eligible") return renderEligible(ctx, state.entry, text2);
    if (state.kind === "excluded") return renderExcluded(ctx, text2);
    return renderUnconfirmed(ctx, text2);
  }

  // src/pages/fish/quest-context.js
  var EEL_ID = "3B";
  var EEL_POINT = { stage: 6, x: 41, y: 8 };
  var copy4 = {
    th: {
      title: "ถ้าคำขอจากหมอปรากฏ",
      body: "ถ้าอ่านโปสต์การ์ดที่ได้รับแล้วเห็นคำขอให้ตกปลาไหลยักษ์ ให้เปิดข้อมูลโปสต์การ์ดเพื่อดูเบาะแสด่าน 6 ก่อนออกไปตก",
      link: "เปิดข้อมูลโปสต์การ์ดที่ได้รับ",
      afterCatch: "ตกปลาไหลได้แล้วไม่ต้องเก็บไว้ เดินเข้าหมู่บ้านด่าน 1 ทางประตูสนาม (12,189) ฉากจบจะเริ่มโดยอัตโนมัติ โดยต้องทำขั้นก่อนหน้าให้ครบก่อน (ปลาประจำตัวละครของคุณ แล้วฉากในหมู่บ้านที่สนาม (8,183))",
      returnMap: "ดูทางกลับหมู่บ้าน · ด่าน 1 (12,189)",
      limit: "จุด (41,8) ไม่ได้มีปลาไหลอยู่เสมอ"
    },
    ja: {
      title: "医者の依頼が表示された場合",
      body: "受け取ったはがきを読み、大ウナギを釣る依頼が表示されたら、釣りに行く前にエリア6の手掛かりをはがき情報で確認してください。",
      link: "受け取ったはがきの情報を見る",
      afterCatch: "オオウナギは釣れば十分で、残しておく必要はありません。フィールド（12,189）の入口からエリア1の村に入ると、エンディングが自動で流れます。ただし先の手順（自分のキャラクター専用の魚、次にフィールド（8,183）での村の場面）が済んでいることが条件です。",
      returnMap: "最初の村への入口 · エリア1 (12,189)",
      limit: "(41,8)にいつもオオウナギがいるとは限りません。"
    },
    en: {
      title: "If the doctor’s request appears",
      body: "If you read Received Postcard 06 and see the doctor’s giant-eel request, open the postcard guidance for the Area 6 clue before fishing.",
      link: "Open Received Postcard guidance",
      afterCatch: "You do not need to keep the eel once it is caught. Walk into the Area 1 village through the field door at (12,189) and the ending scene plays automatically, provided the earlier steps are done (your character’s own special fish, then the village scene at field (8,183)).",
      returnMap: "Starting-village entrance · Area 1 (12,189)",
      limit: "The eel is not always at (41,8)."
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
    const text2 = copy4[ctx.locale] || copy4.en;
    return `<aside class="detail-section fish-quest-context" data-fish-quest-context="postcard-eel"><h2>${ctx.escapeHtml(text2.title)}</h2><p>${ctx.escapeHtml(text2.body)}</p><p><a class="route-button" data-fish-postcard-link href="${ctx.escapeHtml(postcardHref(ctx))}">${ctx.escapeHtml(text2.link)} ↗</a></p><p data-eel-ending-action>${ctx.escapeHtml(text2.afterCatch)}</p><p><a class="route-button" data-eel-return-map href="${ctx.escapeHtml(returnVillageHref(ctx))}">${ctx.escapeHtml(text2.returnMap)} ↗</a></p><p>${ctx.escapeHtml(text2.limit)}</p></aside>`;
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
    flyCandidates: "Fly bodies this fish takes",
    flyProfileOnly: "This counts the bodies this fish takes (wet or dry). The whole fly must also get past the save’s lock: a fresh save locks body group 1 and wing group 2, and a fly matching the lock never bites. Start with the set recommended above.",
    flyBackupAction: "Show this fish’s three-fly set",
    firstStep: "Start with the map, then choose your gear",
    firstStepBody: "Choose an area to find fishing points, then choose a tackle setup below for your fishing method.",
    chooseSpots: "Choose a fishing area",
    compatible: "Choose bait or inspect fly candidates",
    compatibilityNote: "The baits and lures below are on this fish’s list: once your float or lure is on the fish’s tile it bites or chases within seconds. The fly bodies below are the bodies this fish takes, but the whole fly must also get past the save’s lock.",
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
    flyCandidates: "この魚が食べるフライボディ",
    flyProfileOnly: "この数は魚が食べるボディ（ウェットまたはドライ）の数です。毛バリ全体がセーブのロックも通る必要があります：新規セーブはボディのグループ1とウィングのグループ2をロックし、一致する毛バリは食いつきません。まず上のおすすめセットから。",
    flyBackupAction: "この魚の3本セットを見る",
    firstStep: "まずマップを見てから道具を選ぶ",
    firstStepBody: "エリアを選んで釣りポイントを確認し、下から自分の釣り方に合う道具セットを選んでください。",
    chooseSpots: "釣るエリアを選ぶ",
    compatible: "エサを選ぶ・フライ候補を調べる",
    compatibilityNote: "下のエサとルアーはこの魚のリストにあり、ウキやルアーが魚と同じマスにあれば数秒で食いつく・追ってくる。下のフライ本体はこの魚が食べるボディだが、毛バリ全体がセーブのロックも通る必要がある。",
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
    flyCandidates: "บอดี้ฟลายที่ปลานี้กิน",
    flyProfileOnly: "จำนวนนี้นับบอดี้ที่ปลานี้กิน (แบบเปียกหรือแบบแห้ง) ฟลายทั้งชุดยังต้องไม่ติดล็อกของเซฟ: เซฟใหม่บอดี้กลุ่ม 1 และปีกกลุ่ม 2 ไม่กินเลย เริ่มจากชุดที่แนะนำด้านบน",
    flyBackupAction: "ดูชุดฟลายสำรองสามตัวของปลานี้",
    firstStep: "เริ่มจากดูแผนที่ แล้วค่อยเลือกอุปกรณ์",
    firstStepBody: "เลือกด่านเพื่อดูจุดตก แล้วเลือกชุดอุปกรณ์ด้านล่างตามวิธีที่คุณเล่น",
    chooseSpots: "เลือกด่านที่จะไปตก",
    compatible: "เลือกเหยื่อหรือดูตัวเลือกฟลาย",
    compatibilityNote: "เหยื่อจริงและเหยื่อปลอมด้านล่างอยู่ในรายชื่อของปลานี้ พอทุ่นหรือลัวร์อยู่ช่องเดียวกับปลา ปลาก็กินหรือว่ายตามภายในไม่กี่วินาที บอดี้ฟลายด้านล่างคือบอดี้ที่ปลานี้กิน แต่ฟลายทั้งชุดยังต้องไม่ติดล็อกของเซฟ",
    mapAction: "เปิดแผนที่และจุดของปลา",
    configuredPoints: (n) => `${n} จุดที่เกมกำหนด`,
    spawnSlots: (n) => `${n} ช่องเกิดปลาในตาราง ROM`,
    stage: (n) => `ด่าน ${n}`,
    unknownArea: "ยังไม่พบตำแหน่งที่ปลาปรากฏที่ยืนยันได้ในข้อมูลของเกม",
    unknownFish: (id) => `โปรไฟล์ปลาที่ยังระบุชนิดไม่ได้ · ID ${id}`,
    unknownName: (id) => `โปรไฟล์ปลา ${id}`,
    noSprite: "ยังไม่มีรูปปลาของโปรไฟล์นี้",
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
    intro: "If buying new tackle, take the lowest-priced stocked option for each method below. Every one is on this fish’s list. Keep tackle you already own that works; there is no need to buy a duplicate.",
    scope: "Lowest price within each method. Every item on the fish’s list bites the same; they differ in the fight (baits named for a fish, lure and fly-body size classes). Offers requiring a shop unlock are excluded from these starter choices.",
    fly: "Fly: the cheapest ready-made set this fish takes that a fresh save can use (a fresh save locks body group 1 and wing group 2; a fly matching the lock never bites). An inn rest can change the lock, so re-equip the fly afterwards.",
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
    intro: "新しく買うなら、下の釣り方ごとに店頭在庫がある最安の候補を選べる。どれもこの魚のリストにある。使える道具を持っているなら、同じものを買い直す必要はない。",
    scope: "各釣り方の最安価格。魚のリストにある品はどれも同じように食いつく。違いはファイト（魚名つきのエサ、ルアーとフライボディのサイズ区分）。店の解放が必要な販売は最初の候補から除いている。",
    fly: "フライ：この魚が食べて、新規セーブで使える最安の完成品（新規セーブはボディのグループ1とウィングのグループ2をロックし、一致する毛バリは食いつかない）。宿に泊まるとロックが変わることがあるので、泊まったら装備し直す。",
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
    intro: "ถ้าต้องซื้อใหม่ ซื้อตัวที่ถูกที่สุดของแต่ละวิธีตกในด่านนี้ได้เลย ทุกตัวอยู่ในรายชื่อของปลานี้ ถ้ามีของที่ใช้ได้อยู่แล้วใช้ต่อ ไม่ต้องซื้อซ้ำ",
    scope: "ราคาถูกสุดในแต่ละวิธีตก ปลากินเท่ากันทุกตัวที่อยู่ในรายชื่อ ต่างกันที่ตอนสู้ (เหยื่อที่ระบุชื่อปลา กลุ่มขนาดของลัวร์และบอดี้ฟลาย) รายการที่ต้องปลดล็อกร้านก่อนยังไม่รวมในชุดเริ่มต้นนี้",
    fly: "ฟลาย: ชุดสำเร็จรูปที่ถูกที่สุดที่ปลานี้กินและใช้ได้บนเซฟใหม่ (เซฟใหม่ล็อกบอดี้กลุ่ม 1 กับปีกกลุ่ม 2 ฟลายที่ตรงล็อกไม่กินเลย) นอนโรงแรมแล้วล็อกอาจเปลี่ยน ให้ใส่ฟลายอีกครั้ง",
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
    return fetch("gallery-data.json?v=thai-plain-20261007-69").then((response) => {
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
