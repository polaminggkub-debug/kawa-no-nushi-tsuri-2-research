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
      "shops.ja.html"
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
    if (["index", "maps", "fish", "item", "shops"].includes(root)) {
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
    if (/^s[1-6]-c\d+-r\d+$/.test(section)) query.set("section", section);
    query.set("return", ctx.currentFishPath(stage));
    return `${ctx.mapPath()}?${query.toString()}`;
  }
  function setNavigation(ctx, stage) {
    const mapHref = ctx.fishMapLink(stage);
    const back = document.getElementById("fish-back");
    back.href = ctx.localReturn || (stage ? mapHref : ctx.cataloguePath());
    back.textContent = ctx.localReturn ? ctx.copy.back : stage ? ctx.copy.map : ctx.copy.catalogue;
    document.getElementById("fish-map-link").href = stage ? mapHref : ctx.cataloguePath();
    document.getElementById("fish-map-link").hidden = !stage;
    for (const lang of ["en", "th", "ja"]) {
      const href = lang === "th" ? "fish.th.html" : lang === "ja" ? "fish.ja.html" : "fish.html";
      const link = document.getElementById(`language-${lang}`);
      const query = new URLSearchParams();
      if (ctx.id) query.set("id", ctx.id);
      if (stage) query.set("stage", stage);
      const localizedReturn = ctx.localizeReturn(ctx.localReturn, lang);
      if (localizedReturn) query.set("return", localizedReturn);
      link.href = `${href}${query.size ? `?${query.toString()}` : ""}${location.hash || ""}`;
    }
  }

  // src/pages/fish/tackle.js
  function localizedFishName(ctx, fish, profileId) {
    const latin = fish.nameLatin || (fish.nameLatinVariants || []).slice().sort((a, b) => b.length - a.length)[0];
    if (ctx.locale === "th")
      return fish.nameTh || (fish.nameThVariants || []).join(" / ") || latin || fish.nameJa || ctx.copy.unknownName(profileId);
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

  // src/pages/fish/lure-kit.js
  function availableInArea(item, stage) {
    return (item.playerUse?.shops || []).some(
      (shop) => String(shop.stage) === stage && !shop.condition
    );
  }
  function coveringPairs(lures, profileCount) {
    const pairs = [
      ["2E", "23"],
      ["17", "23"]
    ].map((ids) => ids.map((id) => lures.find((item) => item.id === id))).filter(
      (pair) => pair.every(Boolean) && pair.every((item) => Number.isFinite(item.priceYen)) && new Set(pair.flatMap((item) => item.playerUse?.fishIds || [])).size === profileCount
    );
    return pairs;
  }
  function chooseLurePair(pairs, stage) {
    const stocked = (item) => availableInArea(item, stage);
    pairs.sort(
      (a, b) => Number(b.every(stocked)) - Number(a.every(stocked)) || a.reduce((sum, item) => sum + item.priceYen, 0) - b.reduce((sum, item) => sum + item.priceYen, 0)
    );
    const localPair = pairs.find((pair) => pair.every(stocked));
    return { pair: localPair || pairs[0], localPair };
  }
  function lureKitTitle(ctx) {
    if (ctx.locale === "th") return "ถ้าจะตกปลาอื่นด้วย: ชุดลัวร์สองชิ้น";
    if (ctx.locale === "ja") return "ほかの魚も狙うなら：ルアー2種類のセット";
    return "Fishing for other species too? A two-lure kit";
  }
  function lureKitIntro(ctx, count, total, hasLocalLureOffer) {
    if (ctx.locale === "th")
      return hasLocalLureOffer ? `ชุดราคาต่ำสุดด้านบนเลือกเพื่อปลาตัวนี้เท่านั้น ถ้าจะพกลัวร์สำหรับปลาหลายชนิด คู่ด้านล่างครอบคลุม ${count} โปรไฟล์ที่ผ่านเงื่อนไขลัวร์ รวมราคาซื้อใหม่ ¥${total}. ไม่ต้องซื้อทุกตัวเลือก: ถ้ามีคู่สปูนกับยางหนอนอยู่แล้ว ใช้ต่อได้` : `ถ้าจะพกลัวร์สำหรับปลาหลายชนิด คู่ด้านล่างครอบคลุม ${count} โปรไฟล์ที่ผ่านเงื่อนไขลัวร์ รวมราคาซื้อใหม่ ¥${total}. ไม่ต้องซื้อทุกตัวเลือก: ถ้ามีคู่สปูนกับยางหนอนอยู่แล้ว ใช้ต่อได้`;
    if (ctx.locale === "ja")
      return hasLocalLureOffer ? `上の最安候補はこの魚だけを狙う選択です。ほかの魚も狙うなら、下の組み合わせでルアー判定を通る${count}プロフィールをカバーでき、新規購入は合計${total}円です。全部買う必要はありません。スプーンとワームの組を持っているなら、そのまま使用できます。` : `複数の魚に使うルアーセットが必要なら、下の組み合わせでルアー判定を通る${count}プロフィールをカバーでき、新規購入は合計${total}円です。全部買う必要はありません。スプーンとワームの組を持っているなら、そのまま使用できます。`;
    return hasLocalLureOffer ? `The cheapest choice above is for this fish alone. For a kit to use across species, the pair below covers all ${count} profiles that pass the lure check, for ¥${total} when buying new. Do not buy every alternative: keep the Spoon-and-worm pair if you already own it.` : `For a multi-species lure kit, the pair below covers all ${count} profiles that pass the lure check, for ¥${total} when buying new. Do not buy every alternative: keep the Spoon-and-worm pair if you already own it.`;
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
  function lureKitCard(ctx, item, stage) {
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
    const profileCount = new Set(lures.flatMap((item) => item.playerUse?.fishIds || [])).size;
    if (!lures.some((item) => (item.playerUse?.fishIds || []).includes(ctx.id))) return "";
    const { pair, localPair } = chooseLurePair(coveringPairs(lures, profileCount), stage);
    if (!pair) return "";
    const hasLocalLureOffer = lures.some(
      (item) => (item.playerUse?.fishIds || []).includes(ctx.id) && availableInArea(item, String(stage))
    );
    const count = profileCount;
    const total = pair.reduce((sum, item) => sum + item.priceYen, 0);
    const cards = pair.map((item) => lureKitCard(ctx, item, stage)).join("");
    return `<section class="detail-section reusable-kit" data-kit="${pair.map((item) => item.id).join("+")}" data-coverage="${count}" data-total="${total}" data-local="${Boolean(localPair)}"><h3>${ctx.escapeHtml(lureKitTitle(ctx))}</h3><p>${ctx.escapeHtml(lureKitIntro(ctx, count, total, hasLocalLureOffer))}</p><p><strong>${ctx.escapeHtml(lureKitAvailability(ctx, Boolean(localPair), hasLocalLureOffer))}</strong></p><div class="detail-grid">${cards}</div><p class="muted">${ctx.escapeHtml(lureKitScope(ctx))}</p></section>`;
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
  function stockedInArea(item, stage) {
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
    const stocked = role.candidates.filter((item) => stockedInArea(item, stage));
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
    const localRod = rods.find((rod) => stockedInArea(rod, stage));
    const localParts = roles.map((role) => role.candidates.find((item) => stockedInArea(item, stage)));
    if (!localRod || !localParts.every(Boolean)) return null;
    return localRod.priceYen + baitPrice + localParts.reduce((sum, item) => sum + item.priceYen, 0);
  }
  function rigTotalLine(ctx, total) {
    if (total === null) return "";
    const label = ctx.locale === "th" ? `ซื้อคัน + เหยื่อ + ตะขอ + ทุ่น/ตะกั่วใหม่ทั้งหมด รวม ¥${total}` : ctx.locale === "ja" ? `竿・エサ・針・ウキ／オモリをすべて新規購入：合計${total}円。` : `Buying the rod, bait, hook and float/sinker all new: ¥${total} total.`;
    return `<p class="rig-total" data-rig-total="${total}"><strong>${ctx.escapeHtml(label)}</strong></p>`;
  }
  function rigFloatFallback(ctx, method, stage, items, roles) {
    if (method !== "sinker" || roles[1].candidates.some((item) => stockedInArea(item, stage)))
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
  function renderRodForMethod(ctx, method, stage, items) {
    const style = { float: 1, sinker: 2, lure: 4, fly: 8 }[method];
    const rods = items.filter(
      (item) => item.category === "rod" && item.decodedFields?.styleCode === style
    );
    const priced = orderedForPurchase(rods);
    const localRods = priced.filter((rod) => stockedInArea(rod, stage));
    const choice = localRods[0] || priced[0];
    if (!choice) return "";
    const title = ctx.locale === "th" ? "คันสำหรับวิธีนี้" : ctx.locale === "ja" ? "この釣り方の竿" : "Rod for this method";
    const owned = ctx.locale === "th" ? "ถ้ามีคันของวิธีนี้อยู่แล้ว ใช้ต่อได้ ไม่ต้องซื้อซ้ำ" : ctx.locale === "ja" ? "この釣り方の竿を持っているなら、そのまま使い、買い直す必要はない。" : "Keep a rod for this method if you already own one; there is no need to buy another.";
    const decision = rodPurchaseDecision(ctx, localRods, stage, choice);
    return `<section class="method-rod" data-method-rod="${method}" data-rod="${choice.id}" data-rod-local="${Boolean(localRods.length)}"><h4>${ctx.escapeHtml(title)}</h4><p>${ctx.escapeHtml(owned)}</p><p>${ctx.escapeHtml(decision)}</p>${ctx.itemLink({ item: choice, routes: [] }, stage)}</section>`;
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
  function renderAreas(ctx, locations, activeStage, fish) {
    if (!locations.length)
      return `<section class="detail-section fish-where-to-go"><h2>${ctx.escapeHtml(ctx.copy.areas)}</h2><p class="empty-state">${ctx.escapeHtml(ctx.copy.unknownArea)}</p></section>`;
    const selected = locations.find((location2) => String(location2.stage) === String(activeStage)) || locations[0];
    const stage = String(selected.stage), name = selected.stageName?.[ctx.locale] || selected.stageName?.en || ctx.copy.stage(stage);
    const maps = (selected.maps || []).map((map) => ctx.renderAreaMap(map, selected, fish)).join("");
    const caution = ctx.locale === "th" ? "ถ้าจุดหนึ่งไม่มีปลา ให้ลองจุดอื่นที่แสดงไว้ ปลาเคลื่อนที่ได้และจุดเกิดบางแห่งอาจไม่ทำงานในรอบนั้น" : ctx.locale === "ja" ? "魚がいなければ別の表示地点も試してください。魚は移動し、出現枠が無効の場合もあります。" : "If a point is empty, try another marked spot. Fish move, and some spawn slots may be inactive in that state.";
    return `<section class="detail-section fish-where-to-go" id="fish-area-map"><h2>${ctx.escapeHtml(ctx.copy.areas)}</h2><label class="area-select-label" for="shopping-area">${ctx.escapeHtml(ctx.shoppingCopy.area)}</label><select id="shopping-area" class="area-select">${locations.map((location2) => `<option value="${ctx.escapeHtml(location2.stage)}" ${String(location2.stage) === stage ? "selected" : ""}>${ctx.escapeHtml(ctx.copy.stage(location2.stage))} · ${ctx.escapeHtml(location2.stageName?.[ctx.locale] || location2.stageName?.en || "")}</option>`).join("")}</select><article class="detail-section area-card current-area" data-active="true"><h3>${ctx.escapeHtml(ctx.copy.stage(stage))} · ${ctx.escapeHtml(name)}</h3><p class="area-point-count">${ctx.escapeHtml(ctx.copy.configuredPoints(ctx.pointCount(selected)))}</p><p class="section-lede">${ctx.escapeHtml(caution)}</p>${maps ? `<div class="detail-grid area-map-grid">${maps}</div>` : ""}<a class="route-button" href="${ctx.escapeHtml(ctx.fishMapLink(stage))}">${ctx.escapeHtml(ctx.copy.mapAction)} ↗</a></article></section>`;
  }

  // src/pages/fish/evidence.js
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
    return `<details class="evidence"><summary>${ctx.escapeHtml(ctx.copy.evidence)}</summary><p>${ctx.escapeHtml(ctx.copy.evidenceIntro)}</p><dl><dt>${ctx.escapeHtml(ctx.copy.profile)}</dt><dd>${ctx.escapeHtml(ctx.id)}</dd>${profileOffset ? `<dt>${ctx.escapeHtml(ctx.copy.profileOffset)}</dt><dd>${ctx.escapeHtml(profileOffset)}</dd>` : ""}<dt>${ctx.escapeHtml(ctx.copy.source)}</dt><dd>data/rom-fish-locations.json</dd>${sourceSet.size ? `<dt>${ctx.escapeHtml(ctx.copy.reference)}</dt><dd>${[...sourceSet].map(ctx.escapeHtml).join(" · ")}</dd>` : ""}</dl>${locationDetails ? `<h3>${ctx.escapeHtml(ctx.copy.coords)}</h3><ul>${locationDetails}</ul>` : ""}</details>`;
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

  // src/pages/fish/shopping.js
  function compatibilityGroup(ctx, entries, category, stage) {
    const group = entries.filter((entry) => entry.item.category === category);
    if (!group.length) return "";
    const title = ctx.copy[category];
    const cards = group.map((entry) => ctx.itemLink(entry, stage)).join("");
    return `<details class="detail-section"><summary><span class="detail-section-title" role="heading" aria-level="2">${ctx.escapeHtml(title)}</span><span class="muted">${group.length}</span></summary><div class="detail-grid">${cards}</div></details>`;
  }
  function renderCompatibility(ctx, entries, stage) {
    const groups = ["bait", "lure", "fly"].map((category) => compatibilityGroup(ctx, entries, category, stage)).join("");
    return groups || `<p class="empty-state">${ctx.escapeHtml(ctx.copy.noCompatibility)}</p>`;
  }
  function aimTip(ctx, method) {
    if (!["lure", "sinker"].includes(method)) return "";
    const text = ctx.locale === "th" ? "ก่อนใช้คันลัวร์หรือคันหวด เติม HP ให้ถึง 100 เพื่อให้ได้เวลาเล็งเต็มของคันนั้น ไม่ใช่โบนัสโอกาสปลากิน" : ctx.locale === "ja" ? "ルアー竿・投げ竿を使う前にHPを100まで回復すると、竿本来の照準時間になります。食いつき率のボーナスではありません。" : "Restore HP to 100 before lure or casting fishing to get the rod’s full aim window. This does not add a bite-rate bonus.";
    return `<p class="aim-tip">${ctx.escapeHtml(text)}</p>`;
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
    const rod = ctx.renderRodForMethod(method, stage, allItems);
    const rig = ctx.renderRigForMethod(method, stage, allItems, offer.price);
    const aim = aimTip(ctx, method);
    const fly = offer.bundle ? `<p class="muted">${ctx.escapeHtml(text.fly)}</p>` : "";
    const link = starterLink(ctx, offer, stage);
    const total = rig.match(/data-rig-total="(\d+)"/)?.[1];
    const summary = starterSummary(ctx, offer, total);
    const open = ctx.requestedMethod === method ? " open" : "";
    return `<details class="detail-section starter-offer" id="starter-${method}" data-method="${method}" data-item="${item.category}:${item.id}" data-price="${offer.price}"${open}><summary>${summary}</summary>${starterItem(ctx, offer, stage, text)}${rod}${rig}${aim}${fly}<a class="route-button" href="${ctx.escapeHtml(link)}">${ctx.escapeHtml(text.buy)} ↗</a></details>`;
  }
  function starterSummary(ctx, offer, total) {
    const bait = ctx.localizedItemName(offer.entry.item);
    const fullCost = total ? starterTotalText(ctx, total) : "";
    return `<strong>${ctx.escapeHtml(offer.label)}:</strong> ${ctx.escapeHtml(bait)} · ¥${offer.price}${fullCost}`;
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
    const copy = missingMethodCopy(ctx, method, stage, entries.length);
    const actions = [];
    if (conditional) {
      const item = conditional.entry.item;
      const href = offerLink(ctx, method, conditional.entry, stage, stage);
      actions.push(
        `<a class="route-button" data-conditional-sale href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy.conditional(ctx.localizedItemName(item)))}</a>`
      );
    }
    if (fallback) {
      const item = fallback.entry.item;
      const amount = salePrice(fallback);
      const price = Number.isFinite(amount) ? ` · ¥${amount}` : "";
      const href = offerLink(ctx, method, fallback.entry, stage, fallback.shop.stage);
      actions.push(
        `<a class="route-button" data-recorded-sale href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy.sale(fallback.shop.stage, `${ctx.localizedItemName(item)} (ID ${item.id})`, price))} ↗</a>`
      );
    } else if (!conditional) {
      const entry = entries[0];
      const href = compatibleItemLink(ctx, method, entry, stage);
      actions.push(
        `<a class="route-button" data-acquisition-details href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(copy.detail(`${ctx.localizedItemName(entry.item)} (ID ${entry.item.id})`))} ↗</a>`
      );
    }
    const noSales = !fallback && !conditional ? `<p class="muted">${ctx.escapeHtml(copy.noSales)}</p>` : "";
    return `<article class="detail-section method-no-local-stock" data-method-no-local="${method}"><h3>${ctx.escapeHtml(copy.title)}</h3><p>${ctx.escapeHtml(copy.owned)}</p>${noSales}<div class="method-stock-actions">${actions.join("")}</div></article>`;
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
    return `<section class="detail-section shopping-plan"><h2>${ctx.escapeHtml(text.title)}</h2>${area}<p>${ctx.escapeHtml(text.intro)}</p>${offers.length ? `<div class="detail-grid">${cards}</div>` : noOffer}${missingMethods ? `<div class="detail-grid missing-method-grid">${missingMethods}</div>` : ""}<p class="muted">${ctx.escapeHtml(text.scope)}</p><a href="#all-compatible">${ctx.escapeHtml(text.all)} ↓</a>${kit}${fallback}</section>`;
  }

  // src/pages/fish/water-icons.js
  var classOrder = ["small", "large", "bubble"];
  var labels = {
    en: {
      title: "Read the water marks",
      intro: "These are the mark types recorded as possible for this fish profile. The size mark is chosen when a fish appears. It can grow afterward, so the icon may not match its size when caught. Size alone cannot identify the species.",
      small: "Small fish mark",
      large: "Large fish mark",
      bubble: "Bubble mark",
      smallFact: "For a normal mark, the fish is under 50 cm when the mark is created.",
      largeFact: "For a normal mark, the fish is at least 50 cm when the mark is created.",
      bubbleFact: "A bubble mark does not identify the fish or show its size. This profile passes potato bait 11’s float check, but that does not guarantee the mark is this fish or that it will bite.",
      baitAction: "Check potato bait 11 · float condition",
      evidence: "ROM evidence and method",
      evidenceLink: "Water-surface icon trace and thresholds"
    },
    ja: {
      title: "水面のマークの見分け方",
      intro: "この魚プロフィールで表示される可能性が確認されたマークです。サイズの魚影は魚が出現した時に選ばれます。その後に成長しても魚影は更新されないため、釣れた時のサイズとは異なる場合があります。サイズだけで魚種は特定できません。",
      small: "小さい魚影",
      large: "大きい魚影",
      bubble: "泡のマーク",
      smallFact: "通常のマーク作成時に、魚体サイズが50cm未満です。",
      largeFact: "通常のマーク作成時に、魚体サイズが50cm以上です。",
      bubbleFact: "泡のマークは魚種やサイズを示しません。このプロフィールはウキ仕掛けでイモエサ11の判定を通りますが、マークの魚がこの魚であることや食いつきを保証しません。",
      baitAction: "イモエサ11のウキ判定を確認",
      evidence: "ROM根拠と調査方法",
      evidenceLink: "水面マークのトレースとしきい値"
    },
    th: {
      title: "ดูเครื่องหมายบนผิวน้ำ",
      intro: "ปลาชนิดนี้แสดงเครื่องหมายด้านล่างได้ เกมเลือกเครื่องหมายขนาดตอนปลาเกิด ปลาขนาดเพิ่มได้ภายหลังแต่เครื่องหมายไม่อัปเดต จึงไม่รับประกันว่าขนาดตอนตกได้จะตรงกับเครื่องหมาย ใช้ขนาดอย่างเดียวระบุชนิดปลาไม่ได้",
      small: "เครื่องหมายปลาขนาดต่ำกว่า 50 ซม.",
      large: "เครื่องหมายปลาขนาดตั้งแต่ 50 ซม.",
      bubble: "เครื่องหมายฟองอากาศ",
      smallFact: "ถ้าเป็นเครื่องหมายปกติ ตอนเกมสร้างเครื่องหมายปลามีขนาดต่ำกว่า 50 ซม.",
      largeFact: "ถ้าเป็นเครื่องหมายปกติ ตอนเกมสร้างเครื่องหมายปลามีขนาดตั้งแต่ 50 ซม. ขึ้นไป",
      bubbleFact: "เครื่องหมายฟองไม่ได้บอกชนิดหรือขนาดปลา ปลาชนิดนี้ผ่านเงื่อนไขเหยื่อหัวมัน 11 เมื่อใช้ชุดทุ่น แต่ไม่ได้ยืนยันว่าปลาที่เห็นเป็นตัวนี้หรือจะกินเหยื่อ",
      baitAction: "ดูเงื่อนไขชุดทุ่นของเหยื่อหัวมัน 11",
      evidence: "หลักฐาน ROM และวิธีตรวจสอบ",
      evidenceLink: "เส้นทางตรวจเครื่องหมายและเกณฑ์ขนาด"
    }
  };
  function copyFor(ctx) {
    return labels[ctx.locale] || labels.en;
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
  function iconFact(copy, iconClass) {
    if (iconClass === "small") return copy.smallFact;
    if (iconClass === "large") return copy.largeFact;
    return copy.bubbleFact;
  }
  function iconCard(ctx, copy, waterIcons, profile, iconClass, stage) {
    const label = copy[iconClass];
    const image = ctx.escapeHtml(imageFor(waterIcons, iconClass) + "?v=native-20261005");
    const fact = ctx.escapeHtml(iconFact(copy, iconClass));
    const bubbleAction = iconClass === "bubble" && profile.bubble === true ? `<a class="route-button" data-water-bait-link href="${ctx.escapeHtml(potatoBaitLink(ctx, stage))}">${ctx.escapeHtml(copy.baitAction)} ↗</a>` : "";
    return `<article class="entity-link water-icon-card" data-water-icon="${iconClass}"><img loading="lazy" src="${image}" alt="${ctx.escapeHtml(label)}"><span><strong>${ctx.escapeHtml(label)}</strong><small>${fact}</small></span>${bubbleAction}</article>`;
  }
  function evidenceDetails(ctx, copy) {
    const href = "https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/water-surface-icons.md";
    return `<details class="water-icon-evidence"><summary>${ctx.escapeHtml(copy.evidence)}</summary><p><a href="${href}">${ctx.escapeHtml(copy.evidenceLink)} ↗</a></p></details>`;
  }
  function renderWaterIcons(ctx, waterIcons, stage) {
    const profile = waterIcons?.profiles?.[ctx.id];
    if (!waterIcons?.romSha1 || !profile) return "";
    const classes = visibleClasses(waterIcons, profile);
    if (!classes.length) return "";
    const copy = copyFor(ctx);
    const cards = classes.map((iconClass) => iconCard(ctx, copy, waterIcons, profile, iconClass, stage)).join("");
    return `<section class="detail-section water-icon-guide" id="water-icons"><h2>${ctx.escapeHtml(copy.title)}</h2><p class="section-lede">${ctx.escapeHtml(copy.intro)}</p><div class="detail-grid water-icon-grid">${cards}</div>${evidenceDetails(ctx, copy)}</section>`;
  }

  // src/pages/fish/render.js
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
    return [...new Set(names.filter(Boolean).filter((other) => other !== name))];
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
      return "รายการด้านล่างเป็นทางเลือก ไม่จำเป็นต้องซื้อทั้งหมด ทุกชิ้นผ่านเงื่อนไขของปลาที่กำลังดู กดรายละเอียดเพื่อเปรียบเทียบวิธีใช้และด่านที่ขาย";
    if (ctx.locale === "ja")
      return "以下は代替候補で、全部買う必要はない。各項目は表示中の魚の判定を通る。詳細で使い方と販売エリアを比較できる。";
    return "The lists below are alternatives; you do not need to buy every entry. Each passes the shown fish’s check. Open details to compare use and purchase areas.";
  }
  function compatibleSection(ctx, state) {
    return `<section id="all-compatible" class="detail-section"><h2>${ctx.escapeHtml(ctx.copy.compatible)}</h2><p class="section-lede">${ctx.escapeHtml(ctx.copy.compatibilityNote)}</p><p>${ctx.escapeHtml(compatibilityIntro(ctx))}</p>${ctx.renderCompatibility(state.matches, state.activeStage)}</section>`;
  }
  function profileContent(ctx, fishData, fish, state) {
    return `${renderProfileHero(ctx, state)}${renderFirstStep(ctx)}${ctx.renderWaterIcons(fishData.waterIcons, state.activeStage)}${ctx.renderExchange(fishData.items || [], state.activeStage)}${ctx.renderAreas(state.locations, state.activeStage, fish)}${ctx.renderShopping(state.matches, state.locations, state.activeStage, fishData.items || [], fishData.flyBackupChoices)}${compatibleSection(ctx, state)}${ctx.renderEvidence(fish, state.locations, state.matches)}`;
  }
  function unconfirmedProfileContent(ctx, fish, state) {
    const evidence = ctx.renderEvidence(fish, state.locations, state.matches).replace(
      "</details>",
      '<p><a href="../docs/fish-acceptance-research.md">Fish acceptance research · profile 43 ↗</a></p></details>'
    );
    return `<div class="detail-hero"><div><p class="muted">${ctx.escapeHtml(ctx.copy.pageTitle)} · ID 43</p><h1>${ctx.escapeHtml(state.headline)}</h1></div></div>${ctx.unconfirmedProfileAction()}${evidence}`;
  }
  function updateAreaChooser(ctx, fishData, locationData, locations) {
    if (!locations.length) return;
    const chooser = document.getElementById("shopping-area");
    chooser.addEventListener("change", () => {
      ctx.requestedStage = ctx.validStage(chooser.value);
      if (typeof history !== "undefined")
        history.replaceState(null, "", ctx.currentFishPath(ctx.requestedStage));
      ctx.render(fishData, locationData);
    });
  }
  function reopenFlyBackup() {
    if (location.hash !== "#fly-backup") return;
    const backup = document.getElementById("fly-backup");
    backup?.setAttribute("open", "");
    backup?.scrollIntoView({ block: "start" });
  }
  function reopenRequestedStarter(ctx) {
    const anchor = location.hash.match(/^#starter-(float|sinker|lure|fly)$/)?.[1];
    const method = ctx.requestedMethod || anchor;
    if (!method) return;
    const starter = document.getElementById(`starter-${method}`);
    if (!starter) return;
    starter.setAttribute("open", "");
    starter.scrollIntoView({ block: "start" });
  }
  function setFishTitle(ctx, headline) {
    document.title = `${headline} — ${ctx.copy.pageTitle} | Kawa no Nushi Tsuri 2`;
  }
  function render(ctx, fishData, locationData) {
    if (!ctx.id) return renderMissingProfile(ctx, ctx.copy.missing);
    const fish = fishData.fishVisuals?.[ctx.id];
    if (!fish) return renderMissingProfile(ctx, ctx.copy.invalid);
    const state = profileState(ctx, fish, locationData, fishData);
    ctx.setNavigation(state.activeStage);
    if (ctx.id === "43") {
      ctx.page.innerHTML = unconfirmedProfileContent(ctx, fish, state);
      setFishTitle(ctx, state.headline);
      return;
    }
    ctx.page.innerHTML = profileContent(ctx, fishData, fish, state);
    reopenRequestedStarter(ctx);
    reopenFlyBackup();
    updateAreaChooser(ctx, fishData, locationData, state.locations);
    setFishTitle(ctx, state.headline);
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
    firstStep: "Start with the map, then choose your gear",
    firstStepBody: "Select an area below to see this fish’s ROM-derived map points and the lowest-priced compatible shop option recorded for that area. Keep compatible gear you already own. Passing the recorded check does not guarantee a bite or a landed fish.",
    chooseSpots: "Choose a fishing area",
    compatible: "ROM-confirmed compatibility",
    compatibilityNote: "These entries pass the recorded bait, lure, or fly fish check for this profile. That does not guarantee a bite or a landed catch. Rod or hook bonuses for this individual fish are not established here.",
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
    recovery: "Catalogue data could not be loaded. Return to the catalogue and try again."
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
    firstStep: "まずマップを見てから道具を選ぶ",
    firstStepBody: "エリアを選ぶと、ROMから抽出したこの魚のポイントと、そのエリアで販売記録がある最安の対応候補を表示します。対応する道具を持っていれば使い続けてください。判定を通っても、食いつきや取り込みは保証されません。",
    chooseSpots: "釣るエリアを選ぶ",
    compatible: "ROMで確認した対応条件",
    compatibilityNote: "各項目は、このプロフィールに対するエサ・ルアー・フライの魚判定を通過します。食いつきや取り込みを保証しません。この魚だけに有効な竿やハリのボーナスも確認していません。",
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
    recovery: "カタログを読み込めません。カタログに戻って再度お試しください。"
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
    firstStep: "เริ่มจากดูแผนที่ แล้วค่อยเลือกอุปกรณ์",
    firstStepBody: "เลือกด่านด้านล่างเพื่อดูจุดเกิดปลาที่ถอดจาก ROM และตัวเลือกเหยื่อที่ผ่านเงื่อนไขซึ่งมีข้อมูลร้านในด่านนั้น ถ้ามีอุปกรณ์ที่ผ่านเงื่อนไขอยู่แล้วใช้ต่อได้ การผ่านเงื่อนไขไม่ได้รับประกันว่าปลาจะกินหรือดึงขึ้นได้",
    chooseSpots: "เลือกด่านที่จะไปตก",
    compatible: "เหยื่อที่ผ่านเงื่อนไขใน ROM",
    compatibilityNote: "รายการนี้ผ่านด่านตรวจเหยื่อจริง เหยื่อปลอม หรือตัวฟลายของโปรไฟล์ปลานี้ ไม่ได้รับประกันว่าปลาจะกินหรือดึงขึ้นมาได้ และยังไม่มีหลักฐานว่าคันหรือตะขอได้โบนัสเฉพาะปลาชนิดนี้",
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
    recovery: "โหลดข้อมูลไม่สำเร็จ กลับไปหน้าแคตตาล็อกแล้วลองอีกครั้ง"
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
    return fetch("gallery-data.json?v=compendium-20261005-19").then((response) => {
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
    ctx.page.innerHTML = `<h1>${ctx.escapeHtml(ctx.copy.pageTitle)}</h1><p class="empty-state">${ctx.escapeHtml(ctx.copy.recovery)}</p><p><a class="route-button" href="${ctx.escapeHtml(ctx.cataloguePath())}">${ctx.escapeHtml(ctx.copy.catalogue)}</a></p>`;
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

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/app/fish.js
  var runtimeContext = createPageRuntime(fish_exports);
  initialize(runtimeContext);
})();
