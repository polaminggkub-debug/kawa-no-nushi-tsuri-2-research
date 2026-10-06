(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/shops/index.js
  var shops_exports = {};
  __export(shops_exports, {
    bindShopFilters: () => bindShopFilters,
    bundleCard: () => bundleCard,
    bundleContainsTarget: () => bundleContainsTarget,
    bundleMatches: () => bundleMatches,
    catName: () => catName,
    cropCanvas: () => cropCanvas,
    drawMapCanvases: () => drawMapCanvases,
    fieldEntranceCard: () => fieldEntranceCard,
    filterItems: () => filterItems,
    findItem: () => findItem,
    fishHref: () => fishHref,
    imagePath: () => imagePath,
    init: () => init,
    initialize: () => initialize,
    isSpecial: () => isSpecial,
    itemHref: () => itemHref,
    itemName: () => itemName,
    itemTargetLink: () => itemTargetLink,
    localizeRoute: () => localizeRoute,
    locationModel: () => locationModel,
    mapAsset: () => mapAsset,
    mapCard: () => mapCard,
    offerCard: () => offerCard,
    pointWithin: () => pointWithin,
    refreshUrl: () => refreshUrl,
    renderLocations: () => renderLocations,
    renderOffers: () => renderOffers,
    renderShopView: () => renderShopView,
    renderTarget: () => renderTarget,
    safeReturn: () => safeReturn,
    sellerLocationCard: () => sellerLocationCard,
    sellerStockActions: () => sellerStockActions,
    setQueryValue: () => setQueryValue,
    shopCompatibility: () => shopCompatibility,
    shopFishContext: () => shopFishContext,
    shopsUrl: () => shopsUrl,
    stateParams: () => stateParams,
    targetReturn: () => targetReturn,
    townArrivalCard: () => townArrivalCard,
    townLocationCards: () => townLocationCards,
    updateLanguageLinks: () => updateLanguageLinks
  });

  // src/pages/shops/map-navigation.js
  function safeReturn(ctx, raw) {
    if (!raw) return "";
    try {
      const url = new URL(raw, location.href);
      return url.origin === location.origin && ctx.allowedReturn.test(url.pathname) ? `${url.pathname}${url.search}${url.hash}` : "";
    } catch {
      return "";
    }
  }
  function localizeRoute(ctx, raw, locale, depth = 0) {
    const safe = ctx.safeReturn(raw);
    if (!safe) return "";
    const url = new URL(safe, location.origin);
    const match = url.pathname.match(
      /\/(?:catalogue|research)\/(index|maps|fish|item|shops|quests)(?:\.th|\.ja)?\.html$/
    );
    if (!match) return "";
    url.pathname = url.pathname.replace(
      /(index|maps|fish|item|shops|quests)(?:\.th|\.ja)?\.html$/,
      ctx.pages[match[1]][locale]
    );
    if (url.searchParams.has("return")) {
      const nested = depth < 4 ? ctx.localizeRoute(url.searchParams.get("return"), locale, depth + 1) : "";
      if (nested) url.searchParams.set("return", nested);
      else url.searchParams.delete("return");
    }
    return `${url.pathname}${url.search}${url.hash}`;
  }
  function stateParams(ctx, overrides = {}) {
    const state = {
      stage: String(Number(ctx.$("stage-select")?.value || ctx.startStage)),
      place: (document.querySelector('input[name="place"]:checked')?.value || ctx.startPlace) === "outdoor" ? "area" : "town",
      category: ctx.$("category-select")?.value || ctx.startCategory || "all",
      id: ctx.targetCategory && ctx.targetId ? ctx.targetId : "",
      entrance: ctx.focusedEntrance === null ? "" : String(ctx.focusedEntrance),
      maker: ctx.flyMakerIntent ? "1" : "",
      fish: ctx.selectedFish,
      route: ctx.selectedRig,
      q: ctx.$("item-search")?.value || "",
      return: ctx.returnRoute,
      ...overrides
    };
    const out = new URLSearchParams();
    for (const [key, value] of Object.entries(state))
      if (value && !(key === "category" && value === "all" && !ctx.selectedFish)) out.set(key, value);
    return out;
  }
  function refreshUrl(ctx) {
    history.replaceState(
      null,
      "",
      `${location.pathname}?${ctx.stateParams().toString()}${location.hash}`
    );
  }
  function targetReturn(ctx) {
    return `${location.pathname}?${ctx.stateParams().toString()}${location.hash}`;
  }
  function itemHref(ctx, item) {
    const query = new URLSearchParams({
      category: item.category,
      id: item.id,
      return: ctx.targetReturn()
    });
    query.set("stage", ctx.stateParams().get("stage"));
    const fishRelevant = ["rod", "bait", "lure", "hook", "float_weight", "fly", "fly_wing", "fly_tail"].includes(
      item.category
    ) || item.category === "general_tool" && ["03", "04", "08", "09", "0A", "0E"].includes(item.id);
    if (fishRelevant && ctx.selectedFish) query.set("fish", ctx.selectedFish);
    if (fishRelevant && ctx.selectedRig) query.set("route", ctx.selectedRig);
    return `${ctx.pages.item[ctx.lang]}?${query}`;
  }
  function fishHref(ctx, id) {
    const query = new URLSearchParams({ id, stage: "3", return: ctx.targetReturn() });
    return `${ctx.pages.fish[ctx.lang]}?${query}`;
  }
  function itemName(ctx, item) {
    if (ctx.lang === "th")
      return item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id;
    if (ctx.lang === "ja")
      return item.playerUse?.displayName?.ja || item.nameJa || item.nameEn || item.id;
    return item.playerUse?.displayName?.en || item.nameEn || item.nameJa || item.id;
  }
  function imagePath(ctx, name) {
    if (!name) return "";
    return String(name).startsWith("catalogue/") ? `../${name}` : name;
  }
  function catName(ctx, category) {
    return ctx.text.types[category] || category;
  }
  function mapAsset(ctx, path) {
    if (!path) return "";
    const value = String(path);
    if (value.startsWith("catalogue/")) return `../${value}`;
    if (value.startsWith("maps/")) return value;
    return `maps/${value}`;
  }
  function cropCanvas(ctx, canvas, imagePathValue, point, imageBounds) {
    const image = new Image();
    image.onload = () => {
      const tilePx = 16;
      const spanTiles = 16;
      const span = spanTiles * tilePx;
      canvas.width = span;
      canvas.height = span;
      const cx = point.x * tilePx + 8, cy = point.y * tilePx + 8;
      const maxX = Number(imageBounds?.width || image.width), maxY = Number(imageBounds?.height || image.height);
      let sx = Math.max(0, Math.min(maxX - span, Math.round(cx - span / 2)));
      let sy = Math.max(0, Math.min(maxY - span, Math.round(cy - span / 2)));
      const ctx2 = canvas.getContext("2d");
      ctx2.imageSmoothingEnabled = false;
      ctx2.drawImage(
        image,
        sx,
        sy,
        Math.min(span, maxX - sx),
        Math.min(span, maxY - sy),
        0,
        0,
        span,
        span
      );
      paintCanvasPin(ctx2, pxPosition(cx, sx, span), pxPosition(cy, sy, span));
      canvas.dataset.ready = "true";
    };
    image.onerror = () => {
      canvas.hidden = true;
      const note = canvas.nextElementSibling;
      if (note) note.textContent = ctx.text.mapUnavailable;
    };
    image.src = imagePathValue;
  }
  function pxPosition(center, origin, span) {
    return Math.max(0, Math.min(span, center - origin));
  }
  function paintCanvasPin(ctx, px, py) {
    ctx.save();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#d52610";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#d52610";
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  function mapCard(ctx, { heading, role = "", note = "", image, coord, bounds, source, tech = {}, extra = "" }) {
    if (!coord) return "";
    const coordinate = ctx.text.coord(coord.x, coord.y);
    const evidence = source ? `<details class="technical-point"><summary>${ctx.esc(ctx.text.technical)}</summary><dl>${Object.entries(
      tech
    ).filter(([, v]) => v !== void 0 && v !== null && v !== "").map(
      ([label, value]) => `<dt>${ctx.esc(label)}</dt><dd><code>${ctx.esc(value)}</code></dd>`
    ).join(
      ""
    )}${source ? `<dt>${ctx.esc(ctx.text.source)}</dt><dd>${ctx.esc(source)}</dd>` : ""}</dl></details>` : "";
    return `<article class="location-card">
      <h3>${ctx.esc(heading)}</h3>${role ? `<span class="shop-kind">${ctx.esc(role)}</span>` : ""}
      <p class="coordinate">${ctx.esc(coordinate)}</p>
      ${image ? `<a class="map-open" href="${ctx.esc(image)}" target="_blank" rel="noopener"><canvas class="map-crop" data-image="${ctx.esc(image)}" data-x="${Number(coord.x)}" data-y="${Number(coord.y)}" data-width="${Number(bounds?.width || bounds?.widthPx || 0)}" data-height="${Number(bounds?.height || bounds?.heightPx || 0)}" aria-label="${ctx.esc(heading)} at ${ctx.esc(coordinate)}"></canvas><span>${ctx.esc(ctx.text.fullMap)}</span></a>` : `<p class="empty-state">${ctx.esc(ctx.text.mapUnavailable)}</p>`}
      ${note ? `<p class="seller-description">${ctx.esc(note)}</p>` : ""}${extra}${evidence}
    </article>`;
  }
  function pointWithin(ctx, coord, bounds) {
    if (!coord || !Number.isFinite(Number(coord.x)) || !Number.isFinite(Number(coord.y))) return false;
    const x = Number(coord.x), y = Number(coord.y);
    const tileBounds = bounds?.displayBoundsTiles || bounds?.validTileBounds;
    const xs = Array.isArray(tileBounds?.x) ? tileBounds.x : null;
    const ys = Array.isArray(tileBounds?.y) ? tileBounds.y : null;
    const widthTiles = Number(
      bounds?.tileWidth || bounds?.descriptorTiles?.width || (bounds?.widthPx ? bounds.widthPx / 16 : 0)
    );
    const heightTiles = Number(
      bounds?.tileHeight || bounds?.descriptorTiles?.height || (bounds?.heightPx ? bounds.heightPx / 16 : 0)
    );
    const minX = xs ? Number(xs[0]) : 0, maxX = xs ? Number(xs[1]) : widthTiles - 1;
    const minY = ys ? Number(ys[0]) : 0, maxY = ys ? Number(ys[1]) : heightTiles - 1;
    return widthTiles > 0 && heightTiles > 0 && x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
  function drawMapCanvases(ctx) {
    document.querySelectorAll("canvas.map-crop[data-image]").forEach((canvas) => {
      const width = Number(canvas.dataset.width), height = Number(canvas.dataset.height);
      ctx.cropCanvas(
        canvas,
        canvas.dataset.image,
        { x: Number(canvas.dataset.x), y: Number(canvas.dataset.y) },
        { width, height }
      );
    });
  }
  function updateLanguageLinks(ctx) {
    for (const locale of ["en", "th", "ja"]) {
      const link = ctx.$(`language-${locale}`);
      if (!link) continue;
      const query = ctx.stateParams();
      if (query.has("return"))
        query.set("return", ctx.localizeRoute(query.get("return"), locale) || query.get("return"));
      link.href = `${ctx.pages.shops[locale]}?${query.toString()}${location.hash}`;
      if (locale === ctx.lang) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    const back = ctx.$("back-link");
    if (back) {
      back.href = ctx.returnRoute || ctx.pages.index[ctx.lang];
      back.textContent = ctx.returnRoute ? ctx.text.returnItem : ctx.text.returnCatalogue;
    }
  }
  function setQueryValue(ctx, key, value) {
    const next = ctx.stateParams();
    if (!value || key === "category" && value === "all") next.delete(key);
    else next.set(key, value);
    history.replaceState(null, "", `${location.pathname}?${next.toString()}${location.hash}`);
  }

  // src/pages/shops/fly-maker-location.js
  var COPY = {
    th: {
      title: (stage) => `คนทำฟลาย · เมืองด่าน ${stage}`,
      note: (family, point) => `คนนี้ประกอบ${family} เข้ามาทางเข้าลำดับที่ 2 จะเริ่มที่ X7,Y29 แล้วหาจุด X${point.x},Y${point.y} ตามรูป ตรวจช่องฟลายว่างและราคาก่อนยืนยัน ตำแหน่งมาจาก ROM ยังไม่ได้ทดลองเดินเส้นทางนี้`,
      field: "ดูทางเข้าเมืองบนแผนที่ด่าน",
      unavailable: "ยังไม่มีตำแหน่งคนทำฟลายที่ยืนยันในด่านนี้ เลือกเมืองตามตระกูลฟลายที่ต้องการประกอบ",
      recovery: [
        "ด่าน 1 · เมย์ฟลาย / แคดดิส / เทอเรสเทรียล",
        "ด่าน 2 · ดิพเทรา / สโตนฟลาย / เทอเรสเทรียล"
      ]
    },
    en: {
      title: (stage) => `Fly maker · Area ${stage} town`,
      note: (family, point) => `This maker assembles ${family}. Entrance 2 arrives at X7,Y29; find X${point.x},Y${point.y} using the picture. Check a free fly slot and the quote before confirming. The location is ROM-derived; this walk has not been replayed.`,
      field: "Show the town entrance on the area map",
      unavailable: "No maker location is verified here. Choose a recorded town for the fly family you want to make.",
      recovery: [
        "Area 1 · Mayfly / Caddis / Terrestrial",
        "Area 2 · Diptera / Stonefly / Terrestrial"
      ]
    },
    ja: {
      title: (stage) => `毛バリ職人 · エリア${stage}の町`,
      note: (family, point) => `${family}を作成する職人です。入口2からX7,Y29に到着し、画像のX${point.x},Y${point.y}を目指します。フライ欄の空きと見積額を確認してから決定してください。場所はROMに基づき、この歩行経路は再現していません。`,
      field: "屋外地図で町入口を見る",
      unavailable: "このエリアの職人の場所は未確認です。作りたい系統に対応する確認済みの町を選んでください。",
      recovery: [
        "エリア1 · メイフライ / カディス / テレストリアル",
        "エリア2 · ディプテラ / ストーンフライ / テレストリアル"
      ]
    }
  };
  function familyName(lang, stage) {
    const names = stage % 2 ? {
      th: "เมย์ฟลาย คัดดิส และเทเรสเทรียล",
      en: "Mayfly, Caddis and Terrestrial flies",
      ja: "メイフライ・カディス・テレストリアル"
    } : {
      th: "ดิพเทรา สโตนฟลาย และเทเรสเทรียล",
      en: "Diptera, Stonefly and Terrestrial flies",
      ja: "ディプテラ・ストーンフライ・テレストリアル"
    };
    return names[lang] || names.en;
  }
  function makerRecovery(ctx, text3) {
    const links = [1, 2].map((stage, index) => {
      const href = ctx.shopsUrl({ stage, place: "town", entrance: "1", maker: "1" }).split("#")[0] + "#fly-maker-location";
      return `<a class="route-button" data-maker-recovery-stage="${stage}" href="${ctx.esc(href)}">${ctx.esc(text3.recovery[index])} ↗</a>`;
    });
    return `<aside id="fly-maker-location" data-maker-recovery><p>${ctx.esc(text3.unavailable)}</p>${links.join(" ")}</aside>`;
  }
  function flyMakerLocation(ctx, view) {
    if (!ctx.flyMakerIntent && location.hash !== "#fly-maker-location") return "";
    const text3 = COPY[ctx.lang] || COPY.en;
    const node = view.interactions.find((entry) => entry.handler === "03:9517");
    if (![1, 2, 3].includes(view.stage) || !node) {
      return makerRecovery(ctx, text3);
    }
    const href = ctx.shopsUrl({ stage: view.stage, place: "area", entrance: "1" }).split("#")[0] + "#location-section";
    const card = ctx.mapCard({
      heading: text3.title(view.stage),
      note: text3.note(familyName(ctx.lang, view.stage), node.townTile),
      image: view.townMap,
      coord: node.townTile,
      bounds: view.area.townTerrain,
      source: node.handler,
      extra: `<a class="route-button" data-maker-field-entrance href="${ctx.esc(href)}">${ctx.esc(text3.field)} ↗</a>`
    });
    return `<div id="fly-maker-location" data-fly-maker-location>${card}</div>`;
  }
  function setMakerPageCopy(ctx) {
    if (!ctx.flyMakerIntent) return;
    const copy4 = {
      th: [
        "ประกอบฟลายที่ไหน / เข้าทางไหน?",
        "แผนที่ชี้คนทำฟลายและทางเข้าเมือง ไม่ต้องซื้อชิ้นส่วนไปก่อน เลือกภาพชิ้นส่วนที่คนทำฟลายและตรวจราคาเสนอ ส่วนรายการสินค้าด้านล่างเป็นของร้านขายทั่วไปในด่าน"
      ],
      en: [
        "Where can I make a fly / enter town?",
        "Find the maker and town entrance on the map. You do not need to buy loose components first: choose the maker pictures and check the quote. Stock listed below belongs to the regular area shop."
      ],
      ja: [
        "毛バリ職人と町入口はどこ？",
        "地図で毛バリ職人と町入口を確認します。部品の事前購入は不要。職人の画像から選び、見積額を確認してください。下の商品一覧は通常の店の在庫です。"
      ]
    }[ctx.lang];
    const title = ctx.$("shop-page-title");
    const intro = ctx.$("shop-page-intro");
    if (title) title.textContent = copy4[0];
    if (intro) intro.textContent = copy4[1];
  }

  // src/pages/shops/target-actions.js
  var copy = {
    th: {
      title: "ของที่คุณกำลังหาซื้อ",
      seller: "ดูตำแหน่งคนขายและทางเข้าเมือง",
      offer: "ดูสินค้าชิ้นนี้และเงื่อนไขซื้อ",
      bundle: "ขายรวมในชุดฟลาย ไม่ได้ขายชิ้นนี้แยก",
      cheapestBundle: "ชุดที่มีชิ้นนี้ ราคาต่ำสุด",
      price: "ราคาซื้อใหม่"
    },
    en: {
      title: "The item you came to buy",
      seller: "Show seller and town entrance",
      offer: "Show this offer and purchase conditions",
      bundle: "Included in complete flies; not sold separately here",
      cheapestBundle: "Lowest price for a bundle containing this part",
      price: "New purchase price"
    },
    ja: {
      title: "探している購入品",
      seller: "販売場所と町への入口を見る",
      offer: "この商品と購入条件を見る",
      bundle: "完成フライに含まれる部品で、ここでは単品販売ではありません",
      cheapestBundle: "この部品を含む完成フライの最安価格",
      price: "新規購入価格"
    }
  };
  function actionHref(ctx, target, stage, place, hash) {
    return `${ctx.shopsUrl({ stage, place, category: target.category, id: target.id, q: "", entrance: "" }).split("#")[0]}${hash}`;
  }
  function targetActions(ctx, target, stage, found, bundles) {
    const text3 = copy[ctx.lang] || copy.en;
    const name = ctx.esc(ctx.itemName(target));
    const title = `<h2>${ctx.esc(text3.title)}</h2><a class="shop-target-item" href="${ctx.esc(ctx.itemHref(target))}"><img src="${ctx.esc(ctx.imagePath(target.image))}" alt=""><strong>${name}</strong><small>ID ${ctx.esc(target.id)}</small></a>`;
    if (!found) return title;
    const bundlePrice = bundles.length ? Math.min(...bundles.map((bundle) => bundle.shopPriceYen)) : null;
    const price = bundlePrice ?? target.priceYen;
    const label = bundlePrice === null ? text3.price : text3.cheapestBundle;
    const priceLine = price != null ? `<p>${ctx.esc(label)}: <strong>${ctx.esc(ctx.text.price(price))}</strong></p>` : "";
    const bundleNote = bundles.length ? `<p>${ctx.esc(text3.bundle)}</p>` : "";
    const group = bundles.length ? "bundle-stock" : ctx.isSpecial(target, stage) ? "special-stock" : "regular-stock";
    const sellerHref = actionHref(ctx, target, stage, "town", "#location-section");
    const offerHref = actionHref(ctx, target, stage, "town", `#${group}`);
    return `${title}${priceLine}${bundleNote}<nav class="shop-target-actions" aria-label="${ctx.esc(text3.title)}"><a class="route-button" data-target-seller href="${ctx.esc(sellerHref)}">${ctx.esc(text3.seller)} ↗</a><a class="route-button" data-target-offer href="${ctx.esc(offerHref)}">${ctx.esc(text3.offer)} ↓</a></nav>`;
  }

  // src/pages/shops/area6-walk.js
  var copy2 = {
    th: {
      title: "เดินไปถึงร้านปกติด่าน 6",
      steps: [
        "ใช้ทางเข้าเมืองหมายเลข 2 ที่แผนที่ด่าน 6: X 2, Y 49 จะถึงห้องเมืองที่ X 7, Y 29",
        "จากจุดถึงเมือง เดินขึ้น 3 ช่อง → ขวา 2 → ขึ้น 3 → ลง 1 → ซ้าย 1 จะยืนที่ X 8, Y 24 หน้าเคาน์เตอร์",
        "หันขึ้น กด A คุยกับร้าน แล้วกดผ่านคำทักทายเพื่อเปิดหมวดสินค้า"
      ],
      image: "ภาพร้านจริงเมื่อเดินถึง",
      evidence: "หลักฐานเส้นทางและข้อจำกัดของการทดสอบ"
    },
    en: {
      title: "Walk to the Area 6 regular shop",
      steps: [
        "Use town entrance 2 at field X 2, Y 49; arrival is town X 7, Y 29.",
        "From arrival, walk up 3 tiles → right 2 → up 3 → down 1 → left 1, reaching X 8, Y 24 in front of the counter.",
        "Face up, press A to talk, then advance the greeting to open the shop categories."
      ],
      image: "Original shop screen after walking there",
      evidence: "Route evidence and test scope"
    },
    ja: {
      title: "エリア6の通常店への歩き方",
      steps: [
        "フィールドX2、Y49の町入口2から入り、町のX7、Y29へ到着します。",
        "到着点から上3マス→右2→上3→下1→左1。カウンター前のX8、Y24に立ちます。",
        "上を向いてAで話しかけ、挨拶を進めると商品カテゴリが開きます。"
      ],
      image: "歩いて到着した原作の店画面",
      evidence: "経路の根拠と検証範囲"
    }
  };
  function area6Walk(ctx, view, node) {
    if (Number(view.stage) !== 6 || node.kind !== "regular-shop") return "";
    const c = copy2[ctx.lang];
    return `<aside class="shop-walk" data-area6-walk><h4>${ctx.esc(c.title)}</h4><ol>${c.steps.map((step) => `<li>${ctx.esc(step)}</li>`).join("")}</ol><details><summary>${ctx.esc(c.image)}</summary><a href="images/shop-routes/area6-regular-shop.png"><img loading="lazy" src="images/shop-routes/area6-regular-shop.png" alt="${ctx.esc(c.image)}"></a><p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/area6-shop-walking-research.md">${ctx.esc(c.evidence)} ↗</a></p></details></aside>`;
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

  // src/pages/shops/shop-category-guidance.js
  var categoryAdvice = {
    th: {
      all: "ป้ายเงื่อนไขปลามีเฉพาะเหยื่อจริง ลัวร์ และบอดี้ฟลาย: ดูป้ายก่อนซื้อ การผ่านเงื่อนไขไม่รับประกันว่าปลากินหรือตกขึ้นได้ ของหมวดอื่นให้ดูคำแนะนำการใช้ในรายละเอียด",
      rod: "เลือกวิธีตกก่อน แล้วดูคำแนะนำซื้อใต้คันแต่ละรุ่นของด่านนี้ เทียบราคา เวลาเล็ง และสายขาดยาก ไม่ใช่อันดับโอกาสตกสำเร็จ",
      hook: "เลือกเบ็ดให้ตรงกับชุดที่ใช้ แล้วดูคำแนะนำและราคาในรายละเอียดไอเท็มก่อนซื้อ",
      float_weight: "เลือกทุ่นหรือตะกั่วตามชุดที่ใช้ แล้วเปรียบเทียบราคาและคำแนะนำในรายละเอียดไอเท็ม",
      food: "เลือกอาหารตาม HP ที่ต้องเติมและราคา เปิดรายละเอียดเพื่อดู HP ที่ฟื้นและเงื่อนไขเควสต์ก่อนกิน",
      general_tool: "ซื้อเมื่อจำเป็นต้องใช้ทำสิ่งนั้นหรือทำเควสต์ เปิดรายละเอียดเพื่อดูว่าใช้ที่ไหนและต้องเก็บไว้ทำอะไร",
      fly_wing: "รายการนี้เป็นส่วนประกอบของฟลายสำเร็จรูปที่ร้านขาย เปิดรายละเอียดเพื่อดูทั้งชุดก่อนซื้อ",
      fly_tail: "รายการนี้เป็นส่วนประกอบของฟลายสำเร็จรูปที่ร้านขาย เปิดรายละเอียดเพื่อดูทั้งชุดก่อนซื้อ",
      fallback: "เปิดรายละเอียดไอเท็มเพื่อดูวิธีใช้และเหตุผลที่ควรซื้อ"
    },
    en: {
      all: "Fish-check badges apply to bait, lures and fly bodies. Check them before buying; passing does not guarantee a bite or landing. For other categories, read the use advice in item details.",
      rod: "Choose your fishing method, then read each rod’s buying advice for this area. The comparison covers price, time to aim and line strength, not catch success.",
      hook: "Choose a hook for your setup, then check its use advice and price in item details before buying.",
      float_weight: "Choose a float or sinker for your setup, then compare prices and use advice in item details.",
      food: "Choose food by the HP you need to restore and its price. Open details for measured HP recovery and quest conditions before eating.",
      general_tool: "Buy a tool when you need its action or quest use. Open details to see where to use it and what to keep it for.",
      fly_wing: "These components belong to ready-made fly bundles sold here. Open details to inspect the whole bundle before buying.",
      fly_tail: "These components belong to ready-made fly bundles sold here. Open details to inspect the whole bundle before buying.",
      fallback: "Open item details for its use and buying advice."
    },
    ja: {
      all: "魚の判定表示はエサ・ルアー・毛バリのボディに付きます。購入前に確認してください。判定を通っても食いつきや取り込みは保証されません。他の種類は詳細ページの使い方で選んでください。",
      rod: "釣り方を選び、このエリアの各竿の購入アドバイスを確認してください。比べるのは価格・狙う時間・糸の切れにくさで、釣果の順位ではありません。",
      hook: "仕掛けに合う針を選び、詳細ページで使い方と価格を確認してから購入してください。",
      float_weight: "仕掛けに合うウキやオモリを選び、詳細ページで価格と使い方を比較してください。",
      food: "回復したいHPと価格で食べ物を選んでください。食べる前に詳細ページで確認済みの回復量とイベント用途を確認してください。",
      general_tool: "必要な操作やイベント用途がある時に購入してください。詳細ページで使う場所と取っておく用途を確認できます。",
      fly_wing: "ここでは店で販売する完成毛バリの構成部品を表示します。購入前に詳細ページでセット全体を確認してください。",
      fly_tail: "ここでは店で販売する完成毛バリの構成部品を表示します。購入前に詳細ページでセット全体を確認してください。",
      fallback: "詳細ページで使い方と購入の判断材料を確認してください。"
    }
  };
  function shopCategoryGuidance(lang, category, compatibilityAdvice) {
    const copy4 = categoryAdvice[lang] || categoryAdvice.en;
    const hasFishChecks = ["all", "bait", "lure", "fly"].includes(category);
    const text3 = ["bait", "lure", "fly"].includes(category) ? compatibilityAdvice : copy4[category] || copy4.fallback;
    return { text: text3, state: hasFishChecks ? "shown" : "not-applicable" };
  }

  // src/pages/shops/player-decision.js
  function shopCompatibility(ctx, item) {
    if (!ctx.selectedFish || !ctx.fishVisuals?.[ctx.selectedFish]) return "";
    const use = item.playerUse || {};
    let fishIds;
    if (item.category === "lure" || item.category === "fly") fishIds = use.fishIds;
    else if (item.category === "bait") fishIds = use.fishIdsByRoute?.[baitRoute(ctx)];
    else return "";
    if (!Array.isArray(fishIds)) return "";
    return fishIds.includes(ctx.selectedFish) ? "accepted" : "rejected";
  }
  function shopFishContext(ctx) {
    const fish = ctx.fishVisuals?.[ctx.selectedFish];
    if (!fish) return "";
    const stage = Number(ctx.$("stage-select")?.value || ctx.startStage);
    const method = selectedMethod(ctx);
    const returnTo = ctx.targetReturn();
    const query = new URLSearchParams({
      id: ctx.selectedFish,
      stage: String(stage),
      route: method,
      return: returnTo
    });
    const href = `${ctx.pages.fish[ctx.lang]}?${query.toString()}`;
    const name = fishName(ctx, fish, ctx.selectedFish);
    const methodText = contextCopy(ctx.lang).methods[method];
    const baitNote = ctx.lang === "th" ? "ป้ายเหยื่อจริงใช้เส้นทางตะกั่วเมื่อเลือกตะกั่ว; วิธีอื่นหรือยังไม่เลือกจะใช้ทุ่น" : ctx.lang === "ja" ? "エサの判定はオモリ仕掛けを選んだ場合はオモリ、それ以外はウキで表示します。" : "Bait labels use the sinker route when selected; otherwise they use float.";
    const copy4 = contextCopy(ctx.lang);
    const category = ctx.$("category-select")?.value || ctx.startCategory || "all";
    const guidance = shopCategoryGuidance(ctx.lang, category, copy4.explains);
    const baitRouteNote = ["all", "bait"].includes(category) ? ` ${baitNote}` : "";
    return `<aside class="shop-fish-context" data-shop-fish-context data-shop-context-category="${ctx.esc(category)}" data-fish-check-guidance="${guidance.state}" data-fish="${ctx.esc(ctx.selectedFish)}" data-stage="${stage}" data-method="${method}"><img src="${ctx.esc(ctx.imagePath(fish.image))}" alt=""><div><p class="shop-fish-context-label">${ctx.esc(copy4.target)}</p><a class="shop-fish-profile-link" href="${ctx.esc(href)}"><strong>${ctx.esc(name)}</strong><span>${ctx.esc(copy4.profile)} · ID ${ctx.esc(ctx.selectedFish)} · ${ctx.esc(ctx.text.stageWord(stage))} · ${ctx.esc(methodText)} ↗</span></a><p>${ctx.esc(guidance.text)}${ctx.esc(baitRouteNote)}</p></div></aside>`;
  }
  function shopCompatibilityBadge(ctx, item, state) {
    if (!state) return "";
    const method = item.category === "bait" ? baitRoute(ctx) : item.category === "lure" ? "lure" : "fly";
    const copy4 = contextCopy(ctx.lang);
    const text3 = item.category === "bait" ? copy4.status.bait[method][state] : copy4.status[item.category][state];
    return `<p class="shop-compatibility ${state}" data-shop-compatibility="${state}" data-compatibility-method="${method}"><strong>${ctx.esc(text3)}</strong></p>`;
  }
  function baitRoute(ctx) {
    return ctx.selectedRig === "sinker" ? "sinker" : "float";
  }
  function selectedMethod(ctx) {
    return ["float", "sinker", "lure", "fly"].includes(ctx.selectedRig) ? ctx.selectedRig : "float";
  }
  function fishName(ctx, fish, id) {
    if (ctx.lang === "th") {
      const thaiNames = distinctFishNames(fish.nameTh ? [fish.nameTh] : fish.nameThVariants || []);
      return thaiNames.join(" / ") || fish.nameLatin || fish.nameJa || `ปลา ${id}`;
    }
    if (ctx.lang === "ja") return fish.nameJa || `魚 ${id}`;
    return fish.nameEn || fish.nameLatin || fish.nameLatinVariants?.[0] || fish.nameJa || `Fish ${id}`;
  }
  var localizedCopy = {
    th: {
      target: "ปลาที่เลือกไว้",
      profile: "เปิดหน้าข้อมูลปลา",
      explains: "ดูป้ายก่อนซื้อ: ของที่แสดงไม่ได้ผ่านเงื่อนไขปลานี้ทุกชิ้น และการผ่านเงื่อนไขไม่รับประกันว่าปลากินหรือตกขึ้นได้",
      methods: { float: "สายทุ่น", sinker: "สายตะกั่ว", lure: "สายลัวร์", fly: "สายฟลาย" },
      status: {
        lure: {
          accepted: "ผ่านเงื่อนไขชนิดปลาของลัวร์",
          rejected: "ไม่ผ่านเงื่อนไขชนิดปลาของลัวร์"
        },
        bait: {
          float: {
            accepted: "ผ่านเงื่อนไขเหยื่อสายทุ่น",
            rejected: "ไม่ผ่านเงื่อนไขเหยื่อสายทุ่น"
          },
          sinker: {
            accepted: "ผ่านเงื่อนไขเหยื่อสายตะกั่ว",
            rejected: "ไม่ผ่านเงื่อนไขเหยื่อสายตะกั่ว"
          }
        },
        fly: {
          accepted: "บอดี้ฟลายผ่านเงื่อนไขปลา 1 ข้อ",
          rejected: "บอดี้ฟลายไม่ผ่านเงื่อนไขปลา 1 ข้อ"
        }
      }
    },
    ja: {
      target: "選択中の魚",
      profile: "魚プロフィールを見る",
      explains: "購入前に印を確認してください。表示品がすべてこの魚の判定を通るわけではなく、判定を通っても食いつきや取り込みは保証されません。",
      methods: { float: "ウキ仕掛け", sinker: "オモリ仕掛け", lure: "ルアー", fly: "毛バリ" },
      status: {
        lure: { accepted: "ルアーの魚種判定を通る", rejected: "ルアーの魚種判定を通らない" },
        bait: {
          float: { accepted: "ウキのエサ判定を通る", rejected: "ウキのエサ判定を通らない" },
          sinker: { accepted: "オモリのエサ判定を通る", rejected: "オモリのエサ判定を通らない" }
        },
        fly: {
          accepted: "ボディの魚プロフィール判定の1つを通る",
          rejected: "ボディの魚プロフィール判定の1つを通らない"
        }
      }
    },
    en: {
      target: "Selected fish",
      profile: "Open fish profile",
      explains: "Check the marks before buying: not every listed item passes this fish check. Passing does not guarantee a bite or landing.",
      methods: { float: "Float route", sinker: "Sinker route", lure: "Lure route", fly: "Fly route" },
      status: {
        lure: {
          accepted: "Passes the lure fish-type check",
          rejected: "Does not pass the lure fish-type check"
        },
        bait: {
          float: {
            accepted: "Passes the float bait check",
            rejected: "Does not pass the float bait check"
          },
          sinker: {
            accepted: "Passes the sinker bait check",
            rejected: "Does not pass the sinker bait check"
          }
        },
        fly: {
          accepted: "Body passes one fish-profile check",
          rejected: "Body does not pass one fish-profile check"
        }
      }
    }
  };
  function contextCopy(lang) {
    return localizedCopy[lang] || localizedCopy.en;
  }

  // src/entities/item/rod-ref-name.js
  var rods = /* @__PURE__ */ new Map();
  var GENERIC_ROD_NAME = /^(?:Small|Medium|Large|Heavy-fish|Two-handed) /;
  function rememberRod(item) {
    rods.set(item.id, item);
  }
  function rodName(lang, item) {
    const shown = item.playerUse?.displayName?.[lang];
    if (lang === "th") return item.nameTh || shown || item.nameJa || item.nameEn;
    if (lang === "ja") return shown || item.nameJa || item.nameEn;
    const short = (shown || item.nameEn || item.nameJa).replace(/, \d+-piece/, "").replace(/ rod, /, " rod ");
    return GENERIC_ROD_NAME.test(short) ? `the ${short[0].toLowerCase()}${short.slice(1)}` : short;
  }
  function capitalizeSentenceStarts(text3) {
    return text3.replace(/(^|[.!?]\s+)the (?=[a-z])/g, "$1The ");
  }
  function rodRefName(lang, id) {
    const item = rods.get(id);
    return item && rodName(lang, item) || id;
  }

  // src/entities/item/rod-area-copy.js
  var COPY2 = {
    en: {
      styles: { 1: "Float/Ayu", 2: "casting", 4: "lure", 8: "fly" },
      labels: {
        only: "{area}: only same-style rod listed",
        dominated: "{area}: buy {otherId} instead — {betterReason}{hpNote}",
        dual: "{area}: lowest price, most time to aim{hpNote} and the line that breaks least easily",
        cheapest: "{area}: lowest new-purchase price",
        aim: "{area}: most time to aim{hpNote}",
        aimChoice: "{area}: choose {id} when {comparison}{hpNote}",
        boundary: "{area}: choose for the line that breaks least easily",
        boundaryPeerCheapest: "{area}: choose {id} for the hardest-to-break line at the lowest price among those rods",
        boundaryPeerAim: "{area}: choose {id} for more time to aim than {otherId}, with the same hardest-to-break line{hpNote}",
        tradeoff: "{area}: choose {id} when {comparison}{hpNote}",
        tradeoffFallback: "{area}: choose {id} when {comparison}{hpNote}",
        itemMissing: "{area}: {id} is not sold here; the cheapest local option is {budgetId} ({budgetPrice})",
        styleMissing: "{area}: no same-style rod sold here; the {direction} area that sells one is Area {nextStage}: {nextId}",
        styleNever: "{area}: no same-style rod is sold in any of the six areas"
      },
      comparison: {
        aimMore: "you get more time to aim than with the cheaper {id}",
        aimLess: "you get less time to aim than with the cheaper {id}",
        boundaryMore: "the line breaks less easily than with the cheaper {id}",
        boundaryLess: "the line breaks more easily than with the cheaper {id}",
        aimMoreAny: "you get more time to aim than with {id}",
        aimLessAny: "you get less time to aim than with {id}",
        boundaryMoreAny: "the line breaks less easily than with {id}",
        boundaryLessAny: "the line breaks more easily than with {id}",
        versus: "{benefits}",
        higherPrice: "{id} costs more at {price}; {comparison}{hpNote}.",
        cheaper: "a lower full new-purchase price",
        samePrice: "the same full new-purchase price",
        and: " and ",
        but: ", but "
      },
      recommendation: {
        only: "This is the only {style} rod sold in {area}: {stats}. Choose it if you need this style here; if you already own it, keep using it.",
        dominated: "For a new {style} rod in {area}, choose {otherId} ({otherStats}) over {id} ({stats}): {betterReason}. If you already own {id}, keep using it; effects on specific fish are unconfirmed.",
        dual: "Choose {id} in {area} if you need a new {style} rod: it has the lowest full price ({price}), the most time to aim ({aim}){hpNote}, and the line that breaks least easily (×{boundary}). If you already own a rod, keep using it.",
        cheapest: "Choose {id} to pay the lowest full price in {area} ({price}). {aimLine} {boundaryLine} These are full new-purchase prices, not trade-in costs; if you already own a rod, keep using it.",
        aim: "Choose {id} in {area} when you want more time to aim: its aim time ({aim}){hpNote} is the highest among the {style} rods sold here. {budgetLine} {boundaryLine}",
        aimChoice: "Choose {id} at the full new-purchase price {price} when {comparison}{hpNote}. The cheaper option is {lowerId} at {lowerPrice}; if you already own a rod, keep using it.",
        boundary: "Choose {id} in {area} when you want the line that breaks least easily (×{boundary}). {budgetLine} {aimLine}",
        boundaryPeerCheapest: "Choose {id} for the hardest-to-break line at the lowest full price among rods tied on that ({price}). {otherId} costs {otherPrice} and gives more time to aim{hpNote} with the same line strength.",
        boundaryPeerAim: "Choose {id} when you want more time to aim than with {otherId}{hpNote} and the same hardest-to-break line. Full new-purchase price: {price} versus {otherPrice}.",
        tradeoff: "{id} is a trade-off among the {style} rods sold here: {lowerLine} {higherLine} Decide by the full new-purchase price, the time to aim and how hard the line is to break.",
        itemMissing: "{id} is not sold in {area}. The same-style rods sold here are {options}. If you already own {id}, keep using it. If you are buying new: {budgetLine} {aimLine} {boundaryLine} This only compares price, time to aim and line strength; it does not rank catch success.",
        styleMissing: "{area} does not sell a {style} rod. The {direction} area that does is Area {nextStage}: {options}. If you already own {id}, keep using it. This only covers shop stock; the rod may be available some other way.",
        aimLeader: "The most time to aim: {id} ({stats}).",
        aimOther: "{id} ({stats}) gives more time to aim than this rod.",
        boundaryLeader: "The line that breaks least easily: {id} ({stats}).",
        boundaryOther: "{id} ({stats}) breaks less easily than this rod.",
        budgetLeader: "The lowest full price: {id} ({stats}).",
        budgetOther: "{id} ({stats}) has the lowest full price.",
        step: "Compared with {otherId} ({otherStats}), {choiceId} has full price {price} (from {otherPrice}), aim time {aim} (from {otherAim}), and line strength ×{boundary} (from ×{otherBoundary}).",
        area: "Area {stage}",
        reason: "This advice uses only the same-style rods the shops sell, their full prices, and two measured values: time to aim and line strength.",
        styleNever: "No {style} rod is sold in any of the six areas. If you already own {id}, keep using it; no shop that sells one has been found.",
        tradeoffChoice: "Choose {id} at the full new-purchase price {price} when {comparison}{hpNote}. {higherLine} If you already own a rod, keep using it. Effects on specific fish are unconfirmed.",
        noHigher: "",
        scope: "What is compared: rods of the same style that shops sell, full new-purchase price, time to aim, and how hard the line is to break (the fish can pull farther before tackle is lost). Bite rate, catch rate and fish-specific advantages are not ranked.{hp}{fly}",
        hp: " Aim time for lure/casting rods is measured at HP 100 and gets shorter when HP is lower.",
        fly: " The fly rod’s second hidden value is left out because its effect is unknown.",
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
        only: "ด่าน {stage}: ร้านขายคันแบบนี้คันเดียว",
        dominated: "ด่าน {stage}: ซื้อ {otherId} แทน — {betterReason}{hpNote}",
        dual: "ด่าน {stage}: ถูกสุด มีเวลาเล็งนานสุด{hpNote} และสายขาดยากสุด",
        cheapest: "ด่าน {stage}: ราคาซื้อใหม่ถูกสุด",
        aim: "ด่าน {stage}: มีเวลาเล็งนานสุด{hpNote}",
        aimChoice: "ด่าน {stage}: เลือก {id} เพราะ{comparison}{hpNote}",
        boundary: "ด่าน {stage}: เลือกถ้าอยากให้สายขาดยากสุด",
        boundaryPeerCheapest: "ด่าน {stage}: เลือก {id} ถ้าอยากได้สายขาดยากสุดในราคาถูกสุดของกลุ่ม",
        boundaryPeerAim: "ด่าน {stage}: เลือก {id} ถ้าอยากมีเวลาเล็งนานกว่า {otherId} โดยยังได้สายขาดยากสุดเท่ากัน{hpNote}",
        tradeoff: "ด่าน {stage}: เลือก {id} เพราะ{comparison}{hpNote}",
        tradeoffFallback: "ด่าน {stage}: เลือก {id} เพราะ{comparison}{hpNote}",
        itemMissing: "ด่าน {stage}: ร้านไม่ขาย {id}; ตัวเลือกที่ถูกสุดในด่านนี้คือ {budgetId} ({budgetPrice})",
        styleMissing: "ด่าน {stage}: ร้านไม่ขายคันแบบนี้; ด่าน{direction}ที่มีขายคือด่าน {nextStage}: {nextId}",
        styleNever: "ด่าน {stage}: ไม่มีร้านไหนขายคันแบบนี้ทั้ง 6 ด่าน"
      },
      comparison: {
        aimMore: "มีเวลาเล็งนานกว่า {id} ที่ถูกกว่า",
        aimLess: "มีเวลาเล็งน้อยกว่า {id} ที่ถูกกว่า",
        boundaryMore: "สายขาดยากกว่า {id} ที่ถูกกว่า",
        boundaryLess: "สายขาดง่ายกว่า {id} ที่ถูกกว่า",
        aimMoreAny: "มีเวลาเล็งนานกว่า {id}",
        aimLessAny: "มีเวลาเล็งน้อยกว่า {id}",
        boundaryMoreAny: "สายขาดยากกว่า {id}",
        boundaryLessAny: "สายขาดง่ายกว่า {id}",
        versus: "{benefits}",
        higherPrice: "{id} ราคาเต็มสูงกว่า ({price}) และ{comparison}{hpNote}",
        cheaper: "ราคาซื้อใหม่ถูกกว่า",
        samePrice: "ราคาซื้อใหม่เท่ากัน",
        and: " และ",
        but: " แต่"
      },
      recommendation: {
        only: "{area} มีคัน{style}ขายแค่คันนี้: {stats} ถ้าต้องใช้คันแบบนี้ก็ซื้อได้ ถ้ามีอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่",
        dominated: "ถ้าจะซื้อคัน{style}ใหม่ใน{area} ให้เลือก {otherId} ({otherStats}) แทน {id} ({stats}): {betterReason} ถ้ามี {id} อยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่ ส่วนผลกับปลาแต่ละชนิดยังไม่ยืนยัน",
        dual: "ถ้าต้องซื้อคัน{style}ใหม่ใน{area} ให้เลือก {id}: ราคาเต็มถูกสุด ({price}) มีเวลาเล็งนานสุด ({aim}){hpNote} และสายขาดยากสุด (×{boundary}) ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่",
        cheapest: "เลือก {id} ถ้าอยากจ่ายถูกสุดใน{area} ({price}) {aimLine} {boundaryLine} ราคานี้คือราคาเต็มซื้อใหม่ ไม่ใช่ราคาหลังหักคันเก่า ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่",
        aim: "เลือก {id} ใน{area} ถ้าอยากมีเวลาเล็งนานขึ้น: เวลาเล็ง ({aim}){hpNote} มากสุดในกลุ่มคัน{style}ที่ขายในด่านนี้ {budgetLine} {boundaryLine}",
        aimChoice: "เลือก {id} ราคาเต็มซื้อใหม่ {price} เพราะ{comparison}{hpNote} ตัวเลือกที่ถูกกว่าคือ {lowerId} ราคา {lowerPrice} ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่",
        boundary: "เลือก {id} ใน{area} ถ้าอยากให้สายขาดยากสุด (×{boundary}) {budgetLine} {aimLine}",
        boundaryPeerCheapest: "เลือก {id} ถ้าอยากได้สายขาดยากสุดในราคาเต็มถูกสุดของกลุ่มที่เท่ากัน ({price}) ส่วน {otherId} ราคา {otherPrice} มีเวลาเล็งนานกว่า{hpNote} และสายขาดยากเท่ากัน",
        boundaryPeerAim: "เลือก {id} ถ้าอยากมีเวลาเล็งนานกว่า {otherId}{hpNote} โดยยังได้สายขาดยากสุดเท่ากัน ราคาเต็มซื้อใหม่ {price} เทียบกับ {otherPrice}",
        tradeoff: "{id} มีข้อแลกเปลี่ยนเมื่อเทียบกับคัน{style}ที่ขายในด่านนี้: {lowerLine} {higherLine} ให้เลือกโดยดูราคาเต็มซื้อใหม่ เวลาเล็ง และความยากที่สายจะขาด",
        itemMissing: "ร้านใน{area} ไม่ขาย {id}; คัน{style}ที่ขายคือ {options} ถ้ามี {id} อยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่ ถ้าจะซื้อใหม่: {budgetLine} {aimLine} {boundaryLine} นี่เทียบแค่ราคา เวลาเล็ง และความยากที่สายจะขาด ไม่ได้จัดอันดับโอกาสจับปลา",
        styleMissing: "{area} ไม่มีร้านขายคัน{style}; ด่าน{direction}ที่มีขายคือด่าน {nextStage}: {options} ถ้ามี {id} อยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่ ข้อมูลนี้บอกแค่ของที่วางขายในร้าน ไม่ได้บอกว่าหาทางอื่นไม่ได้",
        aimLeader: "มีเวลาเล็งนานสุด: {id} ({stats})",
        aimOther: "{id} ({stats}) มีเวลาเล็งนานกว่าคันนี้",
        boundaryLeader: "สายขาดยากสุด: {id} ({stats})",
        boundaryOther: "{id} ({stats}) สายขาดยากกว่าคันนี้",
        budgetLeader: "ราคาเต็มถูกสุด: {id} ({stats})",
        budgetOther: "{id} ({stats}) ราคาเต็มถูกสุด",
        step: "เทียบ {otherId} ({otherStats}) กับ {choiceId}: ราคาเต็ม {price} (เดิม {otherPrice}), เวลาเล็ง {aim} (เดิม {otherAim}), สายขาดยาก ×{boundary} (เดิม ×{otherBoundary})",
        area: "ด่าน {stage}",
        reason: "คำแนะนำนี้ดูจากคันแบบเดียวกันที่ร้านขาย ราคาเต็ม และตัวเลขที่วัดได้สองค่า คือเวลาเล็งกับความยากที่สายจะขาด",
        styleNever: "ไม่มีร้านไหนขายคัน{style}ทั้ง 6 ด่าน ถ้ามี {id} อยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่; ยังไม่พบร้านที่ขายคันแบบนี้",
        tradeoffChoice: "เลือก {id} ในราคาเต็มซื้อใหม่ {price} เพราะ{comparison}{hpNote} {higherLine} ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่ ส่วนผลกับปลาแต่ละชนิดยังไม่ยืนยัน",
        noHigher: "",
        scope: "สิ่งที่เทียบ: คันแบบเดียวกันที่ร้านขาย ราคาเต็มซื้อใหม่ เวลาเล็ง และความยากที่สายจะขาด (ปลาดึงหนีได้ไกลกว่าก่อนอุปกรณ์หลุด) ไม่ได้จัดอันดับโอกาสที่ปลากินเหยื่อหรือจับขึ้น{hp}{fly}",
        hp: " เวลาเล็งของคันลัวร์/ตีเหยื่อวัดที่ HP 100 และสั้นลงเมื่อ HP ต่ำกว่า 100",
        fly: " ไม่รวมค่าที่สองของคันฟลาย เพราะยังไม่รู้ว่ามีผลอะไร",
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
        only: "エリア{stage}：同じ釣り方で売っているのはこの竿だけ",
        dominated: "エリア{stage}：{id}より{otherId}を買う — {betterReason}{hpNote}",
        dual: "エリア{stage}：最安で、狙う時間も最長{hpNote}、糸も最も切れにくい",
        cheapest: "エリア{stage}：新品の全額が最安",
        aim: "エリア{stage}：狙う時間が最長{hpNote}",
        aimChoice: "エリア{stage}：{id}は{comparison}{hpNote}",
        boundary: "エリア{stage}：糸が最も切れにくい竿を選ぶ",
        boundaryPeerCheapest: "エリア{stage}：糸が最も切れにくい竿の中で最安の{id}を選ぶ",
        boundaryPeerAim: "エリア{stage}：{otherId}より狙う時間が長く、糸の切れにくさは最高で同じ{id}を選ぶ{hpNote}",
        tradeoff: "エリア{stage}：{comparison}ので{id}を選ぶ{hpNote}",
        tradeoffFallback: "エリア{stage}：{comparison}ので{id}を選ぶ{hpNote}",
        itemMissing: "エリア{stage}：{id}は売っていません。同エリアの最安候補は{budgetId}（{budgetPrice}）",
        styleMissing: "エリア{stage}：同じ釣り方の竿は売っていません。{direction}エリアで売っているのは、エリア{nextStage}の{nextId}",
        styleNever: "エリア{stage}：同じ釣り方の竿は全6エリアのどの店にもありません"
      },
      comparison: {
        aimMore: "安い{id}より狙う時間が長い",
        aimLess: "安い{id}より狙う時間が短い",
        boundaryMore: "安い{id}より糸が切れにくい",
        boundaryLess: "安い{id}より糸が切れやすい",
        aimMoreAny: "{id}より狙う時間が長い",
        aimLessAny: "{id}より狙う時間が短い",
        boundaryMoreAny: "{id}より糸が切れにくい",
        boundaryLessAny: "{id}より糸が切れやすい",
        versus: "{benefits}",
        higherPrice: "高い{id}（新品の全額{price}）なら、{comparison}{hpNote}",
        cheaper: "新品の全額が安い",
        samePrice: "新品の全額が同じ",
        and: "、",
        but: "が、その一方で"
      },
      recommendation: {
        only: "エリア{stage}で売っている{style}竿はこれだけです：{stats}。この釣り方が必要なら買ってください。すでに持っていれば、そのまま使えます。",
        dominated: "エリア{stage}で{style}竿を新しく買うなら、{id}（{stats}）より{otherId}（{otherStats}）がおすすめです：{betterReason}。{id}をすでに持っていれば、そのまま使えます。魚ごとの差はまだ分かっていません。",
        dual: "エリア{stage}で{style}竿を新しく買うなら{id}。新品の全額が最安（{price}）で、狙う時間（{aim}）{hpNote}も最長、糸も最も切れにくい（×{boundary}）竿です。すでに持っていれば、そのまま使えます。",
        cheapest: "エリア{stage}で新品の全額を抑えるなら{id}（{price}）が最安です。{aimLine} {boundaryLine} 下取りを引いた値段ではなく、新品の全額です。すでに持っていれば、そのまま使えます。",
        aim: "狙う時間を長くしたいなら、エリア{stage}の{id}（{aim}）{hpNote}です。ここで売っている{style}竿で最長です。{budgetLine} {boundaryLine}",
        aimChoice: "新品の全額{price}の{id}を選びます。{comparison}{hpNote}。出費を抑えるなら{lowerId}（{lowerPrice}）です。持っている竿はそのまま使えます。",
        boundary: "糸が最も切れにくい竿がよければ、エリア{stage}の{id}（×{boundary}）を選びます。{budgetLine} {aimLine}",
        boundaryPeerCheapest: "糸が最も切れにくい竿の中で、新品の全額が最安なのは{id}（{price}）です。{otherId}（{otherPrice}）なら糸の切れにくさは同じまま、狙う時間がもっと長くなります{hpNote}。",
        boundaryPeerAim: "糸が最も切れにくいまま、{otherId}より狙う時間を長くしたいなら{id}を選びます{hpNote}。新品の全額は{price}で、{otherId}は{otherPrice}です。",
        tradeoff: "{id}は、エリア{stage}で売っている{style}竿の中で、値段・狙う時間・糸の切れにくさに一長一短があります。{lowerLine} {higherLine} 新品の全額と、必要な狙う時間・糸の切れにくさで選んでください。",
        itemMissing: "{id}はエリア{stage}で売っていません。同じ釣り方でこのエリアで売っている竿は{options}です。{id}を持っていれば、そのまま使えます。新しく買うなら：{budgetLine} {aimLine} {boundaryLine} 比べているのは値段・狙う時間・糸の切れにくさだけで、釣れやすさの順位ではありません。",
        styleMissing: "エリア{stage}に{style}竿は売っていません。同じ釣り方の竿を売っている{direction}エリアは、エリア{nextStage}です：{options}。{id}を持っていれば、そのまま使えます。分かるのは店の品ぞろえだけで、他の入手方法がないとは言えません。",
        styleNever: "6エリアのどの店にも{style}竿はありません。{id}を持っていれば、そのまま使えます。買える店は見つかっていません。",
        tradeoffChoice: "新品の全額{price}の{id}を選びます。{comparison}{hpNote}。{higherLine}。持っている竿はそのまま使えます。魚ごとの差はまだ分かっていません。",
        noHigher: "",
        aimLeader: "狙う時間が最長なのは{id}（{stats}）。",
        aimOther: "{id}（{stats}）の方が狙う時間が長いです。",
        boundaryLeader: "糸が最も切れにくいのは{id}（{stats}）。",
        boundaryOther: "{id}（{stats}）の方が糸が切れにくいです。",
        budgetLeader: "新品の全額が最安なのは{id}（{stats}）。",
        budgetOther: "新品の全額が最安なのは{id}（{stats}）です。",
        step: "{otherId}（{otherStats}）と{choiceId}の比較：新品の全額 {price}（{otherPrice}から）、狙う時間 {aim}（{otherAim}から）、切れにくさ ×{boundary}（×{otherBoundary}から）。",
        area: "エリア{stage}",
        reason: "同じ釣り方の店の品ぞろえ、新品の全額、測定できた2つの値（狙う時間・切れにくさ）だけで比べています。",
        scope: "比べているもの：同じ釣り方で店が売っている竿、新品の全額、狙う時間、糸の切れにくさ（魚が遠くまで引いても道具を失いにくい）。食いつきや釣れやすさ、魚ごとの相性は順位付けしていません。{hp}{fly}",
        hp: " ルアー竿・投げ竿の狙う時間はHP100のときの値で、HPが減ると短くなります。",
        fly: " フライ竿のもう1つの隠れた値は、効果が分からないため比べていません。",
        noHp: "",
        noFly: "",
        next: "次の",
        previous: "前の",
        and: "、"
      }
    }
  };
  var ID_KEYS = /* @__PURE__ */ new Set(["id", "otherId", "lowerId", "budgetId", "nextId", "choiceId"]);
  function interpolate(template, values, lang) {
    const text3 = template.replace(/\{([a-zA-Z]+)\}/g, (_match, key) => {
      const value = values[key] ?? "";
      return String(ID_KEYS.has(key) && lang ? rodRefName(lang, value) : value);
    });
    return lang === "en" ? capitalizeSentenceStarts(text3) : text3;
  }
  function rodAreaCopy(lang, type, key, values = {}) {
    const locale = COPY2[lang] || COPY2.en;
    return interpolate(locale[type][key], values, lang);
  }
  function rodAreaScope(lang, styleCode2) {
    const locale = COPY2[lang] || COPY2.en;
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
    return lang === "th" ? " (ที่ HP 100)" : lang === "ja" ? "（HP100のとき）" : " (at HP 100)";
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
      (copy4, [name, marker]) => copy4.replaceAll(marker, `{${name}}`),
      text(lang, "comparison", key, placeholders)
    );
  }
  function tradeoffDescription(lang, subject, other) {
    const aimKey = subject.aim > other.aim ? "aimMore" : subject.aim < other.aim ? "aimLess" : "";
    const boundaryKey = subject.boundary > other.boundary ? "boundaryMore" : subject.boundary < other.boundary ? "boundaryLess" : "";
    const keys = [aimKey, boundaryKey].filter(Boolean);
    const phrases = keys.map(
      (key) => relationCopy(lang, key).replace("{id}", rodRefName(lang, other.id))
    );
    const opposing = keys.length === 2 && subject.aim > other.aim !== subject.boundary > other.boundary;
    const joiner = opposing ? relationCopy(lang, "but") : relationCopy(lang, "and");
    return relationCopy(lang, "versus").replace("{benefits}", phrases.join(joiner));
  }
  function higherPriceDescription(lang, subject, other) {
    return relationCopy(lang, "higherPrice").replace("{id}", rodRefName(lang, subject.id)).replace("{price}", offerPrice(lang, subject.price)).replace("{comparison}", tradeoffDescription(lang, subject, other)).replace("{hpNote}", aimCondition(lang, subject.item));
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
    return keys.map((key) => relationCopy(lang, key).replace("{id}", rodRefName(lang, candidate.id))).join(relationCopy(lang, "and"));
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
    if (!Object.values(values).every(Number.isFinite)) return null;
    rememberRod(item);
    return { ...values, id: item.id, item };
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
      return `${offerPrice2(lang, choice.price)} · เวลาเล็ง ${choice.aim}${hpNote} · สายขาดยาก ×${choice.boundary}`;
    if (lang === "ja")
      return `${offerPrice2(lang, choice.price)}・狙う時間${choice.aim}${hpNote}・切れにくさ×${choice.boundary}`;
    return `${offerPrice2(lang, choice.price)} · aim ${choice.aim}${hpNote} · line strength ×${choice.boundary}`;
  }
  function aimCondition2(lang, item) {
    if (![2, 4].includes(styleCode(item))) return "";
    return lang === "th" ? " (ที่ HP 100)" : lang === "ja" ? "（HP100のとき）" : " (at HP 100)";
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
    return choices.map((choice) => `${rodRefName(lang, choice.id)} (${offerStats(lang, choice)})`).join(lang === "ja" ? "、" : "; ");
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
    rememberRod(item);
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

  // src/pages/shops/shop-purchase-decision.js
  var copy3 = {
    th: {
      details: "เหตุผลและสิ่งที่คำแนะนำนี้เทียบ",
      rodScope: "เทียบราคาซื้อใหม่ เวลาเล็ง และสายขาดยาก ไม่ใช่อันดับโอกาสตกสำเร็จ"
    },
    en: {
      details: "Why choose it and what the comparison covers",
      rodScope: "Compares new-purchase price, time to aim and line strength, not catch success."
    },
    ja: {
      details: "選ぶ理由と比較の範囲",
      rodScope: "新品価格・狙う時間・糸の切れにくさの比較で、釣果の順位ではありません。"
    }
  };
  function localValue(lang, value) {
    return typeof value === "string" ? value : value?.[lang] || value?.en || "";
  }
  function decisionFor(ctx, item, stage, items) {
    if (item.category === "rod")
      return items?.length ? rodAreaDecision(ctx.lang, item, items, stage) : null;
    return ["hook", "float_weight"].includes(item.category) ? item.gearDecision : null;
  }
  function shopPurchaseDecision(ctx, item, stage, items) {
    const decision = decisionFor(ctx, item, stage, items);
    const label = localValue(ctx.lang, decision?.label);
    if (!label) return "";
    const text3 = copy3[ctx.lang] || copy3.en;
    const scope = decision.scope || (item.category === "rod" ? text3.rodScope : "");
    const paragraphs = [decision.recommendation, decision.reason, scope].map((value) => localValue(ctx.lang, value)).filter(Boolean).map((value) => `<p>${ctx.esc(value)}</p>`).join("");
    const status = decision.status || "gear";
    return `<div class="shop-purchase-decision" data-shop-purchase-decision="${ctx.esc(item.category)}:${ctx.esc(item.id)}" data-decision-stage="${Number(stage)}" data-decision-status="${ctx.esc(status)}"><p><strong>${ctx.esc(label)}</strong></p>${paragraphs ? `<details data-shop-decision-details><summary>${ctx.esc(text3.details)}</summary>${paragraphs}</details>` : ""}</div>`;
  }

  // src/pages/shops/shop-catalogue.js
  function renderLocations(ctx, locations, mapManifest, stage, place, items) {
    const area = locations?.areas?.find((a) => Number(a.outdoorArea) === stage);
    const visuals = ctx.$("location-visuals");
    const mapId = ctx.$("location-map-id");
    const summary = ctx.$("location-summary");
    const mapSetId = place === "outdoor" ? stage : stage + 6;
    const fieldMapSet = mapManifest?.mapSets?.[`mapSet${String(stage).padStart(2, "0")}`];
    ctx.$("location-area").textContent = place === "outdoor" ? ctx.text.outdoor(stage) : ctx.text.town(stage);
    mapId.textContent = ctx.text.mapSetEvidence(place, mapSetId);
    ctx.$("location-heading").textContent = place === "outdoor" ? ctx.text.fieldHeading : ctx.text.townHeading;
    visuals.innerHTML = "";
    if (!area) {
      summary.textContent = locations ? ctx.text.noLocations : ctx.text.warningLocations;
      visuals.innerHTML = `<p class="empty-state">${ctx.esc(locations ? ctx.text.mapNoEntrances : ctx.text.warningLocations)}</p>`;
      return;
    }
    const view = ctx.locationModel(area, fieldMapSet, stage, place, summary);
    const cards = place === "outdoor" ? view.entrances.map((entry) => ctx.fieldEntranceCard(view, entry)) : ctx.townLocationCards(view, items);
    visuals.innerHTML = (place === "town" ? flyMakerLocation(ctx, view) : "") + cards.join("") || `<p class="empty-state">${ctx.esc(view.excludedPoints ? ctx.text.noValidPoint : place === "outdoor" ? ctx.text.mapNoEntrances : ctx.text.noLocations)}</p>`;
    ctx.drawMapCanvases();
  }
  function locationModel(ctx, area, fieldMapSet, stage, place, summary) {
    const fieldMap = ctx.mapAsset(fieldMapSet?.fieldMap?.image || fieldMapSet?.fieldMap?.imageUrl);
    const townMap = ctx.mapAsset(area.townTerrain?.image);
    summary.textContent = place === "outdoor" ? `${ctx.text.area(stage)}. ${fieldMapSet?.name?.[ctx.lang] || ""}` : `${ctx.text.townSummary(stage)}.`;
    const allEntrances = Array.isArray(area.entrances) ? area.entrances : [];
    const validEntrances = allEntrances.filter(
      (entry) => ctx.pointWithin(entry.fieldTile, fieldMapSet?.fieldMap) && ctx.pointWithin(entry.townArrival, area.townTerrain) && (!entry.townArrival?.mapId || Number(entry.townArrival.mapId) === Number(area.townMapId))
    );
    const entrances = ctx.focusedEntrance === null ? validEntrances : validEntrances.filter((entry) => Number(entry.ordinal) === ctx.focusedEntrance);
    const allInteractions = Array.isArray(area.interactions) ? area.interactions : [];
    const interactions = allInteractions.filter(
      (node) => ctx.pointWithin(node.townTile, area.townTerrain)
    );
    const excludedPoints = allEntrances.length - validEntrances.length + (allInteractions.length - interactions.length);
    if (excludedPoints) summary.textContent += ` ${ctx.text.invalidPoints}`;
    if (place === "outdoor" && ctx.focusedEntrance !== null)
      summary.textContent += ` ${ctx.text.focusedEntrance(ctx.focusedEntrance)}`;
    return {
      area,
      fieldMapSet,
      stage,
      place,
      fieldMap,
      townMap,
      entrances,
      interactions,
      excludedPoints
    };
  }
  function fieldEntranceCard(ctx, view, entry) {
    const { fieldMap, fieldMapSet } = view;
    const n = Number(entry.ordinal ?? 0);
    const arrival = entry.townArrival;
    const pair = arrival ? `<p class="seller-description">${ctx.esc(ctx.text.arrival)} · ${ctx.esc(ctx.text.coord(arrival.x, arrival.y))}</p><a class="route-button" href="${ctx.esc(ctx.shopsUrl({ place: "town", entrance: String(n) }))}">${ctx.esc(ctx.text.openTownArrival)}</a>` : "";
    return ctx.mapCard({
      heading: ctx.text.entrance(n),
      role: ctx.text.outside,
      note: ctx.text.pairNote,
      image: fieldMap,
      coord: entry.fieldTile,
      bounds: fieldMapSet?.fieldMap,
      source: entry.source ? Object.values(entry.source).join(" · ") : "",
      tech: { [ctx.text.entranceOrdinal]: n, [ctx.text.kind]: "field-to-town transition" },
      extra: pair
    });
  }
  function townArrivalCard(ctx, view, entry) {
    const { area, townMap } = view;
    const n = Number(entry.ordinal ?? 0);
    const fieldHref = ctx.shopsUrl({ place: "area", entrance: String(n) });
    const action = `<a class="route-button" href="${ctx.esc(fieldHref)}">${ctx.esc(ctx.text.openEntrance)}</a>`;
    const card = ctx.mapCard({
      heading: `${ctx.text.entrance(n)} · ${ctx.text.arrival}`,
      role: "",
      note: ctx.text.pairNote,
      image: townMap,
      coord: entry.townArrival,
      bounds: area.townTerrain,
      source: entry.source ? Object.values(entry.source).join(" · ") : "",
      tech: { [ctx.text.entranceOrdinal]: n, [ctx.text.kind]: "paired field transition" },
      extra: action
    });
    return `<div id="town-arrival-${n}">${card}</div>`;
  }
  function townLocationCards(ctx, view, items) {
    const { area, stage, interactions, entrances } = view;
    const targetItem = ctx.targetCategory && ctx.targetId ? ctx.findItem(items, ctx.targetCategory, ctx.targetId) : null;
    const targetSpecial = targetItem && ctx.isSpecial(targetItem, stage);
    const relevantKind = targetItem ? targetSpecial ? "special-rod-shop" : "regular-shop" : "";
    const relevantNodes = interactions.filter(
      (node) => ["regular-shop", "special-rod-shop"].includes(node.kind) && (!relevantKind || node.kind === relevantKind)
    );
    const accessFor = (node) => (area.verifiedAccess || []).find(
      (access) => String(access.interactionSlotHex || "").toUpperCase() === String(node.interactionSlotHex || node.slotHex || "").toUpperCase()
    );
    const linkedOrdinals = new Set(
      relevantNodes.map((node) => accessFor(node)?.entranceOrdinal).filter(
        (value) => value !== void 0 && value !== null && value !== "" && Number.isInteger(Number(value))
      ).map(Number)
    );
    const visibleEntrances = targetItem && linkedOrdinals.size ? entrances.filter((entry) => linkedOrdinals.has(Number(entry.ordinal))) : entrances;
    const entranceCards = targetItem && linkedOrdinals.size ? [] : visibleEntrances.map((entry) => ctx.townArrivalCard(view, entry));
    const shopCards = relevantNodes.map(
      (node) => ctx.sellerLocationCard(view, node, accessFor(node), targetItem)
    );
    return [...shopCards, ...entranceCards];
  }
  function sellerLocationCard(ctx, view, node, access, targetItem) {
    const { area, entrances, townMap } = view;
    const role = node.kind === "regular-shop" ? ctx.text.regular : ctx.text.special;
    const detail = node.kind === "regular-shop" ? ctx.text.regularNote : ctx.text.specialNote;
    const hasOrdinal = access?.entranceOrdinal !== void 0 && access?.entranceOrdinal !== null && Number.isInteger(Number(access.entranceOrdinal));
    const linkedEntrance = hasOrdinal ? entrances.find((e) => Number(e.ordinal) === Number(access.entranceOrdinal)) : null;
    const note = linkedEntrance ? ctx.text.linkedEntrance(Number(linkedEntrance.ordinal), linkedEntrance.townArrival) : ctx.text.endpointNote;
    const heading = `${role} · ${ctx.text.shopPoint}`;
    const fieldHref = linkedEntrance ? ctx.shopsUrl({ place: "area", entrance: String(linkedEntrance.ordinal) }) : "";
    const actions = ctx.sellerStockActions(node, targetItem, linkedEntrance, fieldHref);
    const tested = access?.probe?.controls?.length ? `${ctx.text.testedInputs}: ${access.probe.controls.join(" → ")}` : "";
    return ctx.mapCard({
      heading,
      role,
      note: `${detail} ${note}`,
      image: townMap,
      coord: node.townTile,
      bounds: area.townTerrain,
      source: node.source?.description || `${node.source?.pointerFileOffset || ""} ${node.source?.pointerFileOffset ? "→ " : ""}${node.source?.coordinateFileOffset || ""}`.trim(),
      tech: {
        [ctx.text.kind]: role,
        [ctx.text.entranceOrdinal]: access?.entranceOrdinal,
        [ctx.text.slot]: node.interactionSlotHex || node.slotHex,
        [ctx.text.mode]: node.mode,
        handler: node.handler,
        [ctx.text.testedInputs]: tested,
        result: access?.probe?.result
      },
      extra: actions + area6Walk(ctx, view, node)
    });
  }
  function sellerStockActions(ctx, node, targetItem, linkedEntrance, fieldHref) {
    const currentTargetIsBundle = targetItem && ["fly", "fly_wing", "fly_tail"].includes(targetItem.category);
    const stockAnchor = currentTargetIsBundle ? "bundle-stock" : node.kind === "special-rod-shop" ? "special-stock" : "regular-stock";
    const stockCategory = targetItem ? targetItem.category : node.kind === "special-rod-shop" ? "rod" : "all";
    const stockUrl = ctx.shopsUrl({
      place: "town",
      category: stockCategory,
      id: targetItem ? targetItem.id : "",
      q: ""
    });
    const stockHref = `${stockUrl.split("#")[0]}#${stockAnchor}`;
    const actions = `${linkedEntrance ? `<a class="route-button" href="${ctx.esc(fieldHref)}">${ctx.esc(ctx.text.openEntrance)}</a>` : ""}<a class="stock-jump" href="${ctx.esc(stockHref)}">${ctx.esc(ctx.text.viewOffers)}</a>`;
    return actions;
  }
  function findItem(ctx, items, category, id) {
    return items.find(
      (item) => item.category === category && String(item.id).toUpperCase() === String(id).toUpperCase()
    );
  }
  function isSpecial(ctx, item, stage) {
    return (item.playerUse?.shops || []).some(
      (s) => Number(s.stage) === stage && s.shop === "special_rod_shop"
    );
  }
  function itemTargetLink(ctx, category, id) {
    const item = ctx.findItem(window.__shopItems || [], category, id);
    if (!item) return "";
    return `<a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(ctx.itemName(item))} · ID ${ctx.esc(item.id)} ↗</a>`;
  }
  function offerCard(ctx, item, options = {}) {
    const target = options.target === true;
    const special = options.special === true;
    const condition = item.category === "bait" && item.id === "17" && Number(options.stage) === 3;
    const shopOffer = (item.playerUse?.shops || []).find(
      (s) => Number(s.stage) === Number(options.stage)
    );
    const canHaveCondition = condition && shopOffer?.condition;
    const image = ctx.imagePath(item.image);
    const name = ctx.itemName(item);
    const compatibility = shopCompatibility(ctx, item);
    const price = item.priceYen != null ? ctx.text.price(item.priceYen) : ctx.text.noPrice;
    const recoveryHp = item.category === "food" ? item.playerUse?.hpRecovery?.hp : null;
    const recovery = Number.isSafeInteger(recoveryHp) && recoveryHp > 0 ? `<p class="food-recovery">${ctx.esc(ctx.text.foodRecovery(recoveryHp))}</p>` : "";
    const extra = canHaveCondition ? `<p class="condition"><strong>${ctx.esc(ctx.text.conditionTitle)}:</strong> ${ctx.esc(ctx.text.ayu)} <a href="${ctx.esc(ctx.fishHref("38"))}">${ctx.esc(ctx.text.ayuFish)}</a></p>` : "";
    return `<article class="offer-card${target ? " is-target" : ""}" data-offer="${ctx.esc(item.category)}:${ctx.esc(item.id)}">
      ${target ? `<span class="target-badge">${ctx.esc(ctx.text.targetBadge)}</span>` : ""}${special ? `<span class="shop-kind">${ctx.esc(ctx.text.special)}</span>` : ""}
      <a class="offer-image-link" href="${ctx.esc(ctx.itemHref(item))}"><img loading="lazy" src="${ctx.esc(image)}" alt="${ctx.esc(name)}"></a>
      <p class="small-id">${ctx.esc(ctx.catName(item.category))} · ID ${ctx.esc(item.id)}</p>
      <h4><a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(name)}</a></h4>
      <p class="price">${ctx.esc(price)}</p>${recovery}${shopCompatibilityBadge(ctx, item, compatibility)}${shopPurchaseDecision(ctx, item, options.stage, options.items || [])}${canHaveCondition ? `<p class="condition-label">${ctx.esc(ctx.text.soldConditional)}</p>` : ""}${extra}
    </article>`;
  }
  function bundleCard(ctx, bundle, stage, items, target) {
    const components = [
      ["fly", bundle.body],
      ["fly_wing", bundle.wing],
      ["fly_tail", bundle.tail]
    ].filter(([, id]) => id && id !== "00").map(([category, id]) => ctx.findItem(items, category, id)).filter(Boolean);
    const selected = components.some(
      (item) => target.category === item.category && target.id === item.id
    );
    const body = components.find((item) => item.category === "fly");
    const compatibility = body ? shopCompatibility(ctx, body) : "";
    const parts = components.map(
      (item) => `<a class="bundle-part" href="${ctx.esc(ctx.itemHref(item))}" title="${ctx.esc(ctx.itemName(item))}"><img loading="lazy" src="${ctx.esc(ctx.imagePath(item.image))}" alt="${ctx.esc(ctx.itemName(item))}"></a>`
    ).join('<span class="bundle-plus" aria-hidden="true">+</span>');
    const labels = components.map((item) => `<span>${ctx.itemTargetLink(item.category, item.id)}</span>`).join("");
    return `<article class="offer-card${target.id && selected ? " is-target" : ""}" data-offer="fly-bundle:${bundle.slot}">
      ${selected ? `<span class="target-badge">${ctx.esc(ctx.text.targetBadge)}</span>` : ""}
      <span class="shop-kind">${ctx.esc(ctx.text.bundle)}</span><p class="small-id">${ctx.esc(ctx.text.stageWord(stage))} · ${ctx.esc(ctx.text.parts)}</p>
      <div class="bundle-parts">${parts}</div><div class="bundle-labels">${labels}</div>
      <p class="price">${ctx.esc(ctx.text.complete)} · ${ctx.esc(ctx.text.price(bundle.shopPriceYen))}</p>${body ? shopCompatibilityBadge(ctx, body, compatibility) : ""}
    </article>`;
  }
  function filterItems(ctx, items, category, query) {
    const q = query.trim().normalize("NFKC").toLocaleLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean).map((token) => token.replace(/^0x(?=[0-9a-f]{1,2}$)/i, ""));
    return items.filter((item) => {
      if (category && category !== "all" && item.category !== category) return false;
      if (!tokens.length) return true;
      const haystack = [
        item.id,
        item.nameEn,
        item.nameJa,
        item.nameTh,
        item.playerUse?.displayName?.en,
        item.playerUse?.displayName?.ja,
        item.playerUse?.displayName?.th,
        item.categoryEn,
        item.categoryJa,
        item.categoryTh,
        item.search
      ].filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }
  function renderTarget(ctx, items, stock, stage) {
    const box = ctx.$("target-status");
    box.innerHTML = "";
    if (!ctx.targetCategory || !ctx.targetId) return;
    const target = ctx.findItem(items, ctx.targetCategory, ctx.targetId);
    if (!target) {
      box.textContent = ctx.text.noTarget;
      return;
    }
    const isBundlePart = ["fly", "fly_wing", "fly_tail"].includes(target.category);
    let stocked = stock.areas.find((a) => Number(a.stage) === stage)?.items.some((i) => i.category === target.category && i.id === target.id) || false;
    let conditional = target.category === "bait" && target.id === "17" && stage === 3;
    const partKey = { fly: "body", fly_wing: "wing", fly_tail: "tail" }[target.category];
    const inBundle = (b) => partKey && String(b[partKey] || "").toUpperCase() === target.id;
    const currentArea = stock.areas.find((a) => Number(a.stage) === stage);
    const found = isBundlePart ? (currentArea?.flyBundles || []).some(inBundle) : stocked;
    const recordedStages = new Set(
      isBundlePart ? [] : stock.areas.filter((a) => a.items.some((i) => i.category === target.category && i.id === target.id)).map((a) => Number(a.stage))
    );
    if (isBundlePart) {
      for (const a of stock.areas)
        if ((a.flyBundles || []).some(inBundle)) recordedStages.add(Number(a.stage));
    }
    const links = [...recordedStages].sort((a, b) => a - b).map(
      (n) => `<a class="stage-link" href="${ctx.esc(ctx.shopsUrl({ stage: n, category: ctx.targetCategory, id: ctx.targetId }))}">${ctx.esc(ctx.text.browseArea(n))}</a>`
    ).join(" ");
    box.innerHTML = `${targetActions(ctx, target, stage, found, isBundlePart ? (currentArea?.flyBundles || []).filter(inBundle) : [])}<strong>${ctx.esc(found ? ctx.text.targetFound : ctx.text.targetNotHere)}</strong>${conditional ? `<p>${ctx.esc(ctx.text.soldConditional)}</p>` : ""}${!found && links ? `<p>${ctx.esc(ctx.text.soldElsewhere)} ${links}</p>` : ""}`;
  }
  function shopsUrl(ctx, overrides = {}) {
    const q = ctx.stateParams(overrides);
    return `${ctx.pages.shops[ctx.lang]}?${q.toString()}${location.hash}`;
  }
  function renderOffers(ctx, items, stock, stage, category, query) {
    const area = stock.areas.find((a) => Number(a.stage) === stage);
    const list = ctx.$("shop-results");
    const target = { category: ctx.targetCategory, id: ctx.targetId };
    const fishContext = ctx.$("shop-fish-context");
    if (fishContext) fishContext.innerHTML = shopFishContext(ctx);
    if (!area) {
      list.innerHTML = `<p class="empty-state">${ctx.esc(ctx.text.noCategory)}</p>`;
      return;
    }
    const stockItems = area.items.map((record) => ctx.findItem(items, record.category, record.id)).filter(Boolean);
    const bundledCategory = (item) => ["fly", "fly_wing", "fly_tail"].includes(item.category);
    const standard = stockItems.filter(
      (item) => !ctx.isSpecial(item, stage) && !bundledCategory(item)
    );
    const rods2 = stockItems.filter((item) => ctx.isSpecial(item, stage) && !bundledCategory(item));
    const bundles = area.flyBundles || [];
    const selectedFirst = selectedOfferSort(target);
    const filtered = ctx.filterItems(standard, category, query).sort(selectedFirst);
    const filteredSpecial = ctx.filterItems(rods2, category, query).sort(selectedFirst);
    const filteredBundles = bundles.filter(
      (bundle) => ctx.bundleMatches(items, bundle, category, query)
    );
    filteredBundles.sort(selectedBundleSort(ctx, target));
    const offers = filtered.length + filteredSpecial.length + filteredBundles.length;
    ctx.$("offer-count").textContent = ctx.text.filtered(offers);
    ctx.renderTarget(items, stock, stage);
    const groups = [];
    if (filtered.length)
      groups.push(
        `<section class="seller-group" id="regular-stock"><h3>${ctx.esc(ctx.text.regular)}</h3><p class="seller-description">${ctx.esc(ctx.text.regularNote)}</p><div class="offer-grid">${filtered.map((item) => ctx.offerCard(item, { stage, items, target: target.category === item.category && target.id === item.id })).join("")}</div></section>`
      );
    if (filteredBundles.length)
      groups.push(
        `<section class="seller-group" id="bundle-stock"><h3>${ctx.esc(ctx.text.bundle)}</h3><p class="seller-description">${ctx.esc(ctx.text.evidenceBundles)}</p><div class="offer-grid">${filteredBundles.map((bundle) => ctx.bundleCard(bundle, stage, items, target)).join("")}</div></section>`
      );
    if (filteredSpecial.length)
      groups.push(
        `<section class="seller-group" id="special-stock"><h3>${ctx.esc(ctx.text.special)}</h3><p class="seller-description">${ctx.esc(ctx.text.specialNote)}</p><div class="offer-grid">${filteredSpecial.map((item) => ctx.offerCard(item, { stage, items, special: true, target: target.category === item.category && target.id === item.id })).join("")}</div></section>`
      );
    if (!offers)
      groups.push(
        `<div class="empty-state"><h3>${ctx.esc(ctx.text.none)}</h3><p>${ctx.esc(ctx.text.area(stage))}</p></div>`
      );
    list.innerHTML = groups.join("");
  }
  function bundleMatches(ctx, items, bundle, category, query) {
    const components = [
      ctx.findItem(items, "fly", bundle.body),
      ctx.findItem(items, "fly_wing", bundle.wing),
      ctx.findItem(items, "fly_tail", bundle.tail)
    ].filter(Boolean);
    const matchesCategory = !category || category === "all" || components.some((item) => item.category === category) || category === "fly";
    const q = query.trim().normalize("NFKC").toLocaleLowerCase();
    const matchesQuery = !q || q.split(/\s+/).every(
      (token) => components.some(
        (item) => [
          item.id,
          item.nameEn,
          item.nameJa,
          item.nameTh,
          item.playerUse?.displayName?.th,
          item.search
        ].filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase().includes(token)
      )
    );
    return matchesCategory && matchesQuery;
  }
  function bundleContainsTarget(_ctx, bundle, target) {
    const key = { fly: "body", fly_wing: "wing", fly_tail: "tail" }[target.category];
    return Boolean(key && String(bundle[key] || "").toUpperCase() === target.id);
  }
  function selectedOfferSort(target) {
    return (a, b) => Number(b.category === target.category && b.id === target.id) - Number(a.category === target.category && a.id === target.id);
  }
  function selectedBundleSort(ctx, target) {
    return (a, b) => Number(ctx.bundleContainsTarget(b, target)) - Number(ctx.bundleContainsTarget(a, target)) || a.shopPriceYen - b.shopPriceYen;
  }

  // src/pages/shops/load-state.js
  var FILTER_IDS = ["stage-select", "category-select", "item-search", "clear-filters"];
  function enableShopControls(ctx) {
    FILTER_IDS.forEach((id) => {
      ctx.$(id).disabled = false;
    });
    document.querySelectorAll('input[name="place"]').forEach((input) => {
      input.disabled = false;
    });
  }
  function showShopLoadFailure(ctx) {
    const returnHref = ctx.returnRoute || ctx.pages.index[ctx.lang];
    const returnLabel = ctx.returnRoute ? ctx.text.backToSource : ctx.text.openCatalogue;
    const status = ctx.$("page-status");
    status.innerHTML = `
    <span>${ctx.esc(ctx.text.loadFailed)}</span>
    <nav aria-label="${ctx.esc(ctx.text.recoveryActions)}">
      <button class="route-button" type="button" data-shop-retry>${ctx.esc(ctx.text.retryLoad)} ↻</button>
      <a class="route-button" href="${ctx.esc(returnHref)}">${ctx.esc(returnLabel)} ↗</a>
    </nav>
  `;
    status.querySelector("[data-shop-retry]")?.addEventListener("click", () => location.reload());
    ctx.$("shop-results").replaceChildren();
  }

  // src/pages/shops/shop-page.js
  async function init(ctx) {
    const stageSelect = ctx.$("stage-select"), categorySelect = ctx.$("category-select"), search = ctx.$("item-search");
    stageSelect.value = String(ctx.startStage);
    categorySelect.value = ctx.startCategory || "all";
    search.value = ctx.searchValue;
    if (search.value.trim()) clearTargetContext(ctx);
    document.querySelectorAll('input[name="place"]').forEach((input) => input.checked = input.value === ctx.startPlace);
    ctx.updateLanguageLinks();
    const loc = await Promise.allSettled([
      fetch("gallery-data.json").then((r) => {
        if (!r.ok) throw new Error("gallery");
        return r.json();
      }),
      fetch("../data/shop-stock-rom.json").then((r) => {
        if (!r.ok) throw new Error("stock");
        return r.json();
      }),
      fetch("maps/rom-map-manifest.json").then((r) => {
        if (!r.ok) throw new Error("maps");
        return r.json();
      }),
      fetch("../data/shop-locations-rom.json").then((r) => {
        if (!r.ok) throw new Error("locations");
        return r.json();
      })
    ]);
    const [galleryResult, stockResult, mapResult, locationResult] = loc;
    if (galleryResult.status !== "fulfilled" || stockResult.status !== "fulfilled") {
      showShopLoadFailure(ctx);
      return;
    }
    const items = galleryResult.value.items || [];
    ctx.fishVisuals = galleryResult.value.fishVisuals || {};
    applyFishRouteCategoryDefault(ctx, categorySelect);
    window.__shopItems = items;
    const stock = stockResult.value;
    const mapManifest = mapResult.status === "fulfilled" ? mapResult.value : null;
    const locations = locationResult.status === "fulfilled" ? locationResult.value : null;
    ctx.$("page-status").textContent = locations ? ctx.text.stockLoaded : ctx.text.stockOnly;
    const view = { stageSelect, categorySelect, search, items, stock, mapManifest, locations };
    const render = () => ctx.renderShopView(view);
    ctx.bindShopFilters(view, render);
    render();
    scrollRequestedSection(ctx);
    enableShopControls(ctx);
  }
  function applyFishRouteCategoryDefault(ctx, categorySelect) {
    if (ctx.params.has("category") || ctx.startId || ctx.searchValue.trim() || ctx.flyMakerIntent || !ctx.selectedFish || !ctx.fishVisuals[ctx.selectedFish])
      return;
    categorySelect.value = ctx.selectedRig === "lure" ? "lure" : ctx.selectedRig === "fly" ? "fly" : "bait";
  }
  function scrollRequestedSection(ctx) {
    const arrivalTarget = /^#town-arrival-[0-4]$/.test(location.hash);
    if (["#location-section", "#fly-maker-location"].includes(location.hash) || arrivalTarget) {
      const panel = ctx.$("shop-map-disclosure");
      if (panel) panel.open = true;
    }
    const allowed = [
      "fly-maker-location",
      "shop-fish-context",
      "location-section",
      "regular-stock",
      "special-stock",
      "bundle-stock"
    ];
    const id = location.hash.slice(1);
    if (allowed.includes(id) || arrivalTarget) ctx.$(id)?.scrollIntoView?.({ block: "start" });
  }
  function renderShopView(ctx, view) {
    const { stageSelect, categorySelect, search, items, stock, mapManifest, locations } = view;
    const stage = Number(stageSelect.value), place = document.querySelector('input[name="place"]:checked')?.value || "outdoor";
    const category = categorySelect.value, query = search.value;
    ctx.refreshUrl();
    ctx.updateLanguageLinks();
    const mapPanel = ctx.$("shop-map-disclosure");
    if (mapPanel && (ctx.focusedEntrance !== null || location.hash === "#location-section"))
      mapPanel.open = true;
    ctx.renderLocations(locations, mapManifest, stage, place, items);
    ctx.renderOffers(items, stock, stage, category, query);
  }
  function bindShopFilters(ctx, view, render) {
    bindShopAnchors(ctx);
    const { stageSelect, categorySelect, search } = view;
    stageSelect.addEventListener("change", () => {
      ctx.focusedEntrance = null;
      render();
    });
    document.querySelectorAll('input[name="place"]').forEach(
      (input) => input.addEventListener("change", () => {
        const mapPanel = ctx.$("shop-map-disclosure");
        if (mapPanel) mapPanel.open = true;
        render();
      })
    );
    categorySelect.addEventListener("change", () => {
      if (categorySelect.value !== ctx.targetCategory) {
        ctx.targetCategory = "";
        ctx.targetId = "";
        ctx.focusedEntrance = null;
      }
      ctx.setQueryValue("category", categorySelect.value);
      render();
    });
    search.addEventListener("input", () => {
      clearTargetContext(ctx);
      ctx.setQueryValue("q", search.value);
      render();
    });
    ctx.$("clear-filters").addEventListener("click", () => {
      categorySelect.value = "all";
      search.value = "";
      ctx.targetCategory = "";
      ctx.targetId = "";
      ctx.focusedEntrance = null;
      ctx.params.delete("category");
      ctx.params.delete("id");
      ctx.params.delete("q");
      history.replaceState(
        null,
        "",
        `${location.pathname}?${ctx.stateParams({ category: "all", id: "", q: "" }).toString()}${location.hash}`
      );
      render();
    });
  }
  function clearTargetContext(ctx) {
    ctx.targetCategory = "";
    ctx.targetId = "";
    ctx.focusedEntrance = null;
  }
  function bindShopAnchors(ctx) {
    window.addEventListener?.("hashchange", () => {
      ctx.updateLanguageLinks();
      scrollRequestedSection(ctx);
    });
  }

  // src/pages/shops/text_en.js
  var text_en = {
    stockLoaded: "Shop stock decoded from the original ROM is ready.",
    stockOnly: "The stock list is ready. Exact shop and entrance map positions are not available in this data yet.",
    loadFailed: "Shop stock could not be loaded.",
    retryLoad: "Retry this shop search",
    backToSource: "Return to the previous page",
    openCatalogue: "Open the item catalogue",
    recoveryActions: "Recovery actions",
    area: (n) => `Fishing area ${n}`,
    outdoor: (n) => `Area ${n} · town entrances`,
    town: (n) => `Area ${n} · seller positions`,
    townSummary: (n) => `Fishing area ${n} · paired town interior`,
    mapSetEvidence: (place, n) => `${place === "outdoor" ? "Outdoor field" : "Town interior"} · map set ${n}`,
    fieldHeading: "Which town entrance?",
    townHeading: "Which shop / entrance?",
    focusedEntrance: (n) => `Showing only entrance ${n + 1}, linked to this shop.`,
    mapUnavailable: "No ROM-rendered terrain image is available for this map set.",
    invalidPoints: "Some decoded positions fall outside the valid map bounds. Those markers are hidden instead of guessed.",
    noValidPoint: "No valid map position is available for this area. No location is guessed.",
    fullMap: "Open the full terrain image ↗",
    noLocations: "Stock is confirmed for this area, but the exact shop position and entrances are not present in the available location data.",
    mapNoEntrances: "No field-to-town entrances are recorded for this area in the available location data.",
    entrance: (n) => `Entrance ${n + 1}`,
    outside: "Field entrance",
    arrival: "Town arrival",
    regular: "Regular equipment shop",
    special: "Special rod seller",
    unclassified: "Other interaction (not identified as a shop)",
    shopPoint: "Seller location",
    coord: (x, y) => `Tile X ${x}, Y ${y}`,
    pairNote: "The two points are a verified field entrance and its paired town arrival. No walking route inside the town is implied.",
    endpointNote: "The ROM identifies this shop interaction point. The walking route from an entrance has not been verified.",
    linkedEntrance: (n, arrival) => `Enter through entrance ${n + 1} (arrival at ${arrival.x}, ${arrival.y}). An original-ROM probe opened this seller from that arrival point; the route from other outdoor positions is not verified.`,
    openEntrance: "Show this entrance on the field map ↗",
    viewOffers: "See what this shop sells ↓",
    testedInputs: "Tested controller inputs",
    openTownArrival: "Show paired town arrival ↗",
    regularNote: "This interaction opens the regular item category and purchase menu.",
    specialNote: "This interaction opens a fixed selection of special rods.",
    filtered: (n) => `${n} matching offer${n === 1 ? "" : "s"}`,
    targetFound: "This item is sold in the selected area.",
    targetNotHere: "This item is not listed for sale in the selected area.",
    soldElsewhere: "Recorded sale areas:",
    soldConditional: "This offer is conditional. Follow the unlock steps on the card before looking for it in the shop.",
    none: "No offers match these filters.",
    noCategory: "No matching items are listed for this area and item type.",
    noTarget: "This ID is not in the item catalogue.",
    browseArea: (n) => `Show Area ${n}`,
    categoryAll: "All item types",
    types: {
      rod: "Fishing rods",
      lure: "Lures",
      hook: "Hooks",
      float_weight: "Floats and sinkers",
      bait: "Bait",
      fly: "Ready-made flies",
      fly_wing: "Fly wings in ready-made bundles",
      fly_tail: "Fly tails in ready-made bundles",
      food: "Food",
      general_tool: "Tools and quest items"
    },
    targetBadge: "Selected item",
    component: "Open item details",
    bundle: "Ready-made fly bundle",
    complete: "Complete bundle price",
    parts: "Parts in this set",
    included: "Included in this ready-made bundle",
    conditionTitle: "How to unlock this offer",
    ayu: "Sell at least one Ayu from your keepnet first. The decoy-Ayu offer then appears in the Area 3 shop. Buying it fills the stack to 9 and subtracts 9 from the sold-Ayu counter (down to 0). If it disappears again, sell more Ayu before trying again.",
    ayuFish: "Find Ayu fishing spots ↗",
    noPrice: "No separate price confirmed",
    price: (n) => `¥${n}`,
    foodRecovery: (hp) => `Restores up to ${hp} HP`,
    returnItem: "← Back to the page that opened this shop",
    returnCatalogue: "← Item catalogue",
    technical: "ROM evidence",
    evidenceStock: "The offers below come from the decoded six-area ROM stock arrays. A basic item price alone is not treated as proof that a shop sells it.",
    evidenceBundles: "Fly body, wing and tail entries are decoded as a single ready-made bundle. The listed price is the total bundle quote; parts are not separate offers here.",
    evidenceLocations: "Map pins mark decoded field-to-town transitions and shop interaction points. An interaction point does not establish a walking route.",
    source: "Source record",
    entranceOrdinal: "Entrance index",
    kind: "Verified role",
    mode: "Raw interaction mode",
    slot: "ROM slot",
    stageWord: (n) => `Area ${n}`,
    warningLocations: "Shop stock is available, but map positions could not be loaded. The page does not guess where to walk.",
    language: "Language"
  };

  // src/pages/shops/text_th.js
  var text_th = {
    stockLoaded: "โหลดรายการขายที่แกะจาก ROM ต้นฉบับแล้ว",
    stockOnly: "โหลดรายการขายแล้ว แต่ข้อมูลที่มีตอนนี้ยังไม่มีตำแหน่งร้านและทางเข้าแบบยืนยันจากแผนที่",
    loadFailed: "โหลดข้อมูลรายการร้านไม่สำเร็จ",
    retryLoad: "ลองโหลดร้านด้วยตัวเลือกเดิมอีกครั้ง",
    backToSource: "กลับหน้าที่เปิดร้านนี้",
    openCatalogue: "เปิดคลังไอเท็ม",
    recoveryActions: "ทางเลือกเมื่อโหลดข้อมูลไม่สำเร็จ",
    area: (n) => `พื้นที่ตกปลา ${n}`,
    outdoor: (n) => `พื้นที่ ${n} · ทางเข้าเมือง`,
    town: (n) => `พื้นที่ ${n} · ตำแหน่งร้าน`,
    townSummary: (n) => `พื้นที่ตกปลา ${n} · เมืองที่คู่กัน`,
    mapSetEvidence: (place, n) => `${place === "outdoor" ? "แผนที่พื้นที่กลางแจ้ง" : "แผนที่ภายในเมือง"} · ชุดแผนที่ ${n}`,
    fieldHeading: "ควรเข้าทางไหน?",
    townHeading: "ไปร้านไหน / เข้าทางไหน?",
    focusedEntrance: (n) => `กำลังเน้นทางเข้า ${n + 1} ซึ่งเชื่อมกับร้านที่เลือก`,
    mapUnavailable: "ไม่มีภาพภูมิประเทศที่สร้างจาก ROM สำหรับแผนที่ชุดนี้",
    invalidPoints: "พิกัดบางรายการอยู่นอกแผนที่ที่ใช้ได้ จึงซ่อนหมุดเหล่านั้นแทนการเดาตำแหน่ง",
    noValidPoint: "พื้นที่นี้ไม่มีพิกัดบนแผนที่ที่ใช้ได้ หน้านี้จะไม่เดาตำแหน่ง",
    fullMap: "เปิดภาพภูมิประเทศทั้งแผนที่ ↗",
    noLocations: "ยืนยันรายการขายของพื้นที่นี้ได้ แต่ข้อมูลตำแหน่งที่มีอยู่ยังไม่ระบุจุดร้านและทางเข้าแบบเจาะจง",
    mapNoEntrances: "ข้อมูลตำแหน่งที่มีอยู่ยังไม่บันทึกทางเข้าจากพื้นที่ไปเมืองนี้",
    entrance: (n) => `ทางเข้า ${n + 1}`,
    outside: "ทางเข้าจากพื้นที่กลางแจ้ง",
    arrival: "จุดมาถึงในเมือง",
    regular: "ร้านอุปกรณ์ตกปลาทั่วไป",
    special: "ร้านขายคันเบ็ดพิเศษ",
    unclassified: "จุดโต้ตอบอื่น (ยังยืนยันว่าเป็นร้านไม่ได้)",
    shopPoint: "ตำแหน่งร้าน/คนขาย",
    coord: (x, y) => `ช่อง X ${x}, Y ${y}`,
    pairNote: "สองตำแหน่งนี้คือทางเข้ากลางแจ้งกับจุดมาถึงในเมืองที่ ROM ระบุว่าเป็นคู่กัน ไม่ได้แปลว่าตรวจเส้นทางเดินภายในเมืองแล้ว",
    endpointNote: "ROM ยืนยันจุดโต้ตอบของร้านนี้ แต่ยังไม่ได้ยืนยันเส้นทางเดินจากทางเข้า",
    linkedEntrance: (n, arrival) => `เข้าเมืองทางเข้า ${n + 1} (จุดมาถึงช่อง ${arrival.x}, ${arrival.y}) แล้วตามหมุดร้าน; การทดสอบบน ROM เปิดเมนูจากจุดมาถึงนี้ได้ แต่ยังไม่ยืนยันวิธีเดินมาถึงประตูจากทุกตำแหน่งกลางแจ้ง`,
    openEntrance: "ดูทางเข้านี้บนแผนที่ด่าน ↗",
    viewOffers: "ดูของที่ร้านนี้ขาย ↓",
    testedInputs: "ปุ่มที่ใช้ทดสอบ",
    openTownArrival: "ดูจุดมาถึงในเมืองที่คู่กัน ↗",
    regularNote: "จุดนี้เปิดเมนูเลือกหมวดและซื้อไอเท็มทั่วไป",
    specialNote: "จุดนี้เปิดรายการคันเบ็ดพิเศษที่กำหนดไว้",
    filtered: (n) => `ตรงตัวกรอง ${n} รายการ`,
    targetFound: "มีรายการนี้ขายในพื้นที่ที่เลือก",
    targetNotHere: "ไม่มีรายการนี้ในสต็อกของพื้นที่ที่เลือก",
    soldElsewhere: "พื้นที่ที่มีข้อมูลว่าขาย:",
    soldConditional: "รายการนี้มีเงื่อนไขซื้อ ให้อ่านวิธีปลดล็อกบนการ์ดก่อนตามหาในร้าน",
    none: "ไม่พบรายการที่ตรงกับตัวกรองนี้",
    noCategory: "พื้นที่นี้ไม่มีไอเท็มประเภทที่ตรงกับตัวกรอง",
    noTarget: "ไม่พบ ID นี้ในคลังไอเท็ม",
    browseArea: (n) => `ดูพื้นที่ ${n}`,
    categoryAll: "ทุกประเภท",
    types: {
      rod: "คันเบ็ด",
      lure: "ลัวร์",
      hook: "เบ็ด",
      float_weight: "ทุ่นและตะกั่ว",
      bait: "เหยื่อ",
      fly: "ฟลายสำเร็จรูป",
      fly_wing: "ปีกฟลายในชุดสำเร็จรูป",
      fly_tail: "หางฟลายในชุดสำเร็จรูป",
      food: "อาหาร",
      general_tool: "อุปกรณ์และไอเท็มเควสต์"
    },
    targetBadge: "ไอเท็มที่เลือก",
    component: "เปิดรายละเอียดไอเท็ม",
    bundle: "ชุดฟลายสำเร็จรูป",
    complete: "ราคาทั้งชุด",
    parts: "ชิ้นส่วนในชุดนี้",
    included: "ขายรวมอยู่ในชุดสำเร็จรูปนี้",
    conditionTitle: "วิธีปลดล็อกรายการนี้",
    ayu: "ขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อน แล้วเหยื่อล่อปลาอายุจะปรากฏในร้านพื้นที่ 3 เมื่อซื้อ จำนวนในช่องจะเต็มเป็น 9 ชิ้น และจำนวนปลาอายุที่ขายไปจะลดลง 9 (ต่ำสุด 0) ถ้ารายการหายไปอีก ให้ขายปลาอายุเพิ่มก่อนลองซื้อ",
    ayuFish: "ดูจุดตกปลาอายุ ↗",
    noPrice: "ยังไม่มีราคาขายแยกที่ยืนยันได้",
    price: (n) => `${n} เยน`,
    foodRecovery: (hp) => `ฟื้นได้สูงสุด ${hp} HP`,
    returnItem: "← กลับหน้าที่เปิดร้านนี้",
    returnCatalogue: "← คลังไอเท็ม",
    technical: "หลักฐานจาก ROM",
    evidenceStock: "รายการด้านล่างมาจากอาร์เรย์สต็อกหกพื้นที่ที่แกะจาก ROM ช่องราคาพื้นฐานของไอเท็มเพียงอย่างเดียวไม่ถือเป็นหลักฐานว่าร้านขาย",
    evidenceBundles: "ข้อมูลบอดี้ ปีก และหางฟลายถูกแกะเป็นชุดสำเร็จรูปเดียว ราคาที่แสดงคือราคารวมทั้งชุด ไม่ได้แยกชิ้นส่วนเป็นรายการขาย",
    evidenceLocations: "หมุดแสดงจุดเปลี่ยนพื้นที่และจุดโต้ตอบร้านที่แกะจาก ROM ได้ จุดโต้ตอบร้านไม่ได้ยืนยันเส้นทางเดิน",
    source: "ระเบียนหลักฐาน",
    entranceOrdinal: "หมายเลขทางเข้า",
    kind: "ประเภทร้านที่ยืนยันได้",
    mode: "โหมดโต้ตอบดิบ",
    slot: "ช่องใน ROM",
    stageWord: (n) => `พื้นที่ ${n}`,
    warningLocations: "โหลดรายการขายได้ แต่โหลดข้อมูลตำแหน่งบนแผนที่ไม่ได้ หน้านี้จะไม่เดาเส้นทางให้",
    language: "ภาษา"
  };

  // src/pages/shops/text_ja.js
  var text_ja = {
    stockLoaded: "オリジナルROMから解析した販売品を読み込みました。",
    stockOnly: "販売品は読み込めました。店や入口の正確な位置は、現在のデータでは確認できません。",
    loadFailed: "販売品データを読み込めませんでした。",
    retryLoad: "同じ条件でもう一度読み込む",
    backToSource: "開く前のページに戻る",
    openCatalogue: "アイテム一覧を開く",
    recoveryActions: "読み込み失敗時の操作",
    area: (n) => `釣りエリア${n}`,
    outdoor: (n) => `エリア${n} · 町の入口`,
    town: (n) => `エリア${n} · 店の位置`,
    townSummary: (n) => `釣りエリア${n} · 対応する町の中`,
    mapSetEvidence: (place, n) => `${place === "outdoor" ? "屋外フィールド" : "町の中"} · マップセット${n}`,
    fieldHeading: "どの入口から町へ？",
    townHeading: "どの店・入口へ？",
    focusedEntrance: (n) => `この店に対応する入口${n + 1}を表示しています。`,
    mapUnavailable: "このマップセットのROM地形画像はありません。",
    invalidPoints: "解析された座標の一部が有効なマップ範囲外のため、位置を推測せずマーカーを非表示にしました。",
    noValidPoint: "このエリアに有効なマップ座標がありません。位置は推測しません。",
    fullMap: "地形全体の画像を開く ↗",
    noLocations: "このエリアの販売品は確認できましたが、現在の位置データに店や入口の正確な位置はありません。",
    mapNoEntrances: "現在の位置データに、このエリアから町への入口は記録されていません。",
    entrance: (n) => `入口${n + 1}`,
    outside: "屋外の入口",
    arrival: "町側の到着地点",
    regular: "通常の釣り道具店",
    special: "特別な竿の販売所",
    unclassified: "その他の操作地点（店とは未確認）",
    shopPoint: "店の場所",
    coord: (x, y) => `タイル X ${x}, Y ${y}`,
    pairNote: "この2地点はROMで対応関係を確認した屋外入口と町側の到着地点です。町の中の徒歩ルートを示すものではありません。",
    endpointNote: "ROMで店の操作地点を確認しました。入口からの徒歩ルートは未確認です。",
    linkedEntrance: (n, arrival) => `入口${n + 1}から町に入り（到着タイル ${arrival.x}, ${arrival.y}）、店のマーカーへ進みます。オリジナルROMのテストで、この到着地点から店のメニューが開くことを確認しました。屋外の他の場所から入口までの道順は確認していません。`,
    openEntrance: "この入口をフィールドマップで見る ↗",
    viewOffers: "この店の販売品を見る ↓",
    testedInputs: "テスト時のボタン入力",
    openTownArrival: "対応する町の到着地点を見る ↗",
    regularNote: "通常のアイテムカテゴリと購入メニューを開く地点です。",
    specialNote: "固定された特別な竿の一覧を開く地点です。",
    filtered: (n) => `該当する販売品：${n}件`,
    targetFound: "選択したエリアで販売されています。",
    targetNotHere: "選択したエリアの販売品には含まれていません。",
    soldElsewhere: "販売記録のあるエリア：",
    soldConditional: "この品には購入条件があります。店を探す前にカードの解放手順を確認してください。",
    none: "条件に一致する販売品はありません。",
    noCategory: "このエリアに一致する種類のアイテムはありません。",
    noTarget: "このIDはアイテム一覧にありません。",
    browseArea: (n) => `エリア${n}を見る`,
    categoryAll: "すべての種類",
    types: {
      rod: "釣り竿",
      lure: "ルアー",
      hook: "針",
      float_weight: "ウキ・オモリ",
      bait: "エサ",
      fly: "完成品の毛バリ",
      fly_wing: "完成品セットのウィング",
      fly_tail: "完成品セットのテール",
      food: "食料",
      general_tool: "道具・クエストアイテム"
    },
    targetBadge: "選択したアイテム",
    component: "アイテム詳細を開く",
    bundle: "完成品の毛バリセット",
    complete: "セット価格",
    parts: "セットの構成品",
    included: "この完成品セットに含まれます",
    conditionTitle: "購入条件を満たす方法",
    ayu: "まずびくからアユを1匹以上売ってください。おとりアユがエリア3の店に表示されます。購入すると所持数が9個になり、売却アユ数カウンターが9減ります（0未満にはなりません）。再び消えたら、追加でアユを売ってください。",
    ayuFish: "アユの釣り場を見る ↗",
    noPrice: "個別の販売価格は未確認",
    price: (n) => `${n}円`,
    foodRecovery: (hp) => `最大${hp} HP回復`,
    returnItem: "← 店を開いたページに戻る",
    returnCatalogue: "← アイテム一覧",
    technical: "ROMの根拠",
    evidenceStock: "以下の品は、ROMから解析した6エリア分の販売在庫に基づきます。アイテムの基本価格欄だけでは店頭販売を確認したことにはなりません。",
    evidenceBundles: "毛バリのボディ・ウィング・テールは一つの完成品セットとして解析しています。表示価格はセット全体の見積額で、各部品を別商品として表示していません。",
    evidenceLocations: "マーカーはROMから解析したエリア間の移動地点と店の操作地点を示します。操作地点から徒歩ルートまでは分かりません。",
    source: "根拠レコード",
    entranceOrdinal: "入口番号",
    kind: "確認済みの店の役割",
    mode: "ROM操作モード",
    slot: "ROMスロット",
    stageWord: (n) => `エリア${n}`,
    warningLocations: "販売品は読み込めましたが、地図上の位置を読み込めません。徒歩ルートは推測しません。",
    language: "言語"
  };

  // src/pages/shops/setup-context.js
  function setupContext(ctx) {
    ctx.lang = ["th", "ja"].includes(document.documentElement.dataset.locale) ? document.documentElement.dataset.locale : "en";
    ctx.pages = {
      quests: { en: "quests.html", th: "quests.th.html", ja: "quests.ja.html" },
      shops: { en: "shops.html", th: "shops.th.html", ja: "shops.ja.html" },
      item: { en: "item.html", th: "item.th.html", ja: "item.ja.html" },
      fish: { en: "fish.html", th: "fish.th.html", ja: "fish.ja.html" },
      maps: { en: "maps.html", th: "maps.th.html", ja: "maps.ja.html" },
      index: { en: "index.html", th: "index.th.html", ja: "index.ja.html" }
    };
    ctx.text = { en: text_en, th: text_th, ja: text_ja }[ctx.lang];
    ctx.$ = (id) => document.getElementById(id);
    ctx.esc = (value) => String(value ?? "").replace(
      /[&<>"']/g,
      (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
    );
    ctx.params = new URLSearchParams(location.search);
    ctx.flyMakerIntent = ctx.params.get("maker") === "1" || location.hash === "#fly-maker-location";
    setMakerPageCopy(ctx);
    ctx.baseDir = location.pathname.slice(0, location.pathname.lastIndexOf("/") + 1);
    ctx.validCategory = (value) => /^[a-z_]+$/.test(value || "") ? value : "";
    ctx.validId = (value) => /^(?:0x)?[0-9a-f]{1,2}$/i.test(value || "") ? Number.parseInt(String(value).replace(/^0x/i, ""), 16).toString(16).toUpperCase().padStart(2, "0") : "";
    ctx.startStage = /^[1-6]$/.test(ctx.params.get("stage") || "") ? Number(ctx.params.get("stage")) : 1;
    ctx.startPlace = ["area", "outdoor"].includes(ctx.params.get("place")) ? "outdoor" : "town";
    ctx.startCategory = ctx.validCategory(ctx.params.get("category"));
    ctx.startId = ctx.validId(ctx.params.get("id"));
    ctx.selectedFish = ctx.validId(ctx.params.get("fish"));
    ctx.selectedRig = ["float", "sinker", "lure", "fly"].includes(ctx.params.get("route")) ? ctx.params.get("route") : "";
    ctx.targetCategory = ctx.startCategory;
    ctx.targetId = ctx.startId;
  }

  // src/pages/shops/load-shops.js
  function loadShops(ctx) {
    ctx.focusedEntrance = /^(?:0|[1-4])$/.test(ctx.params.get("entrance") || "") ? Number(ctx.params.get("entrance")) : null;
    ctx.allowedReturn = /^\/(?:[^/]+\/)?(?:catalogue\/(?:index|maps|fish|item|shops|quests)|research\/index)(?:\.th|\.ja)?\.html$/;
    ctx.returnRoute = ctx.safeReturn(ctx.params.get("return"));
    ctx.searchValue = ctx.params.get("q") || "";
    ctx.init().catch((error) => {
      console.error("Shop page data/render error:", error);
      showShopLoadFailure(ctx);
    });
  }

  // src/pages/shops/index.js
  function initialize(ctx) {
    setupContext(ctx);
    loadShops(ctx);
  }

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/app/shops.js
  var runtimeContext = createPageRuntime(shops_exports);
  initialize(runtimeContext);
})();
