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
      /\/(?:catalogue|research)\/(index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/
    );
    if (!match) return "";
    url.pathname = url.pathname.replace(
      /(index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/,
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
      fish: ctx.selectedFish,
      route: ctx.selectedRig,
      q: ctx.$("item-search")?.value || "",
      return: ctx.returnRoute,
      ...overrides
    };
    const out = new URLSearchParams();
    for (const [key, value] of Object.entries(state))
      if (value && !(key === "category" && value === "all")) out.set(key, value);
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
    visuals.innerHTML = cards.join("") || `<p class="empty-state">${ctx.esc(view.excludedPoints ? ctx.text.noValidPoint : place === "outdoor" ? ctx.text.mapNoEntrances : ctx.text.noLocations)}</p>`;
    ctx.drawMapCanvases();
  }
  function locationModel(ctx, area, fieldMapSet, stage, place, summary) {
    const fieldMap = ctx.mapAsset(fieldMapSet?.fieldMap?.image || fieldMapSet?.fieldMap?.imageUrl);
    const townMap = ctx.mapAsset(area.townTerrain?.image);
    summary.textContent = place === "outdoor" ? `${ctx.text.area(stage)}. ${fieldMapSet?.name?.[ctx.lang] || ""}` : `${ctx.text.townSummary(stage)}.`;
    const allEntrances = Array.isArray(area.entrances) ? area.entrances : [];
    let entrances = allEntrances.filter(
      (entry) => ctx.pointWithin(entry.fieldTile, fieldMapSet?.fieldMap) && ctx.pointWithin(entry.townArrival, area.townTerrain) && (!entry.townArrival?.mapId || Number(entry.townArrival.mapId) === Number(area.townMapId))
    );
    if (ctx.focusedEntrance !== null)
      entrances = entrances.filter((entry) => Number(entry.ordinal) === ctx.focusedEntrance);
    const allInteractions = Array.isArray(area.interactions) ? area.interactions : [];
    const interactions = allInteractions.filter(
      (node) => ctx.pointWithin(node.townTile, area.townTerrain)
    );
    const excludedPoints = allEntrances.length - entrances.length + (allInteractions.length - interactions.length);
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
    return ctx.mapCard({
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
      extra: actions
    });
  }
  function sellerStockActions(ctx, node, targetItem, linkedEntrance, fieldHref) {
    const currentTargetIsBundle = targetItem && ["fly", "fly_wing", "fly_tail"].includes(targetItem.category);
    const stockAnchor = currentTargetIsBundle ? "bundle-stock" : node.kind === "special-rod-shop" ? "special-stock" : "regular-stock";
    const stockCategory = targetItem ? targetItem.category : node.kind === "special-rod-shop" ? "rod" : "all";
    const stockQuery = ctx.shopsUrl({
      place: "town",
      category: stockCategory,
      id: targetItem ? targetItem.id : "",
      q: ""
    });
    const actions = `${linkedEntrance ? `<a class="route-button" href="${ctx.esc(fieldHref)}">${ctx.esc(ctx.text.openEntrance)}</a>` : ""}<a class="stock-jump" href="${ctx.esc(stockQuery + "#" + stockAnchor)}">${ctx.esc(ctx.text.viewOffers)}</a>`;
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
    const price = item.priceYen != null ? ctx.text.price(item.priceYen) : ctx.text.noPrice;
    const extra = canHaveCondition ? `<p class="condition"><strong>${ctx.esc(ctx.text.conditionTitle)}:</strong> ${ctx.esc(ctx.text.ayu)} <a href="${ctx.esc(ctx.fishHref("38"))}">${ctx.esc(ctx.text.ayuFish)}</a></p>` : "";
    return `<article class="offer-card${target ? " is-target" : ""}" data-offer="${ctx.esc(item.category)}:${ctx.esc(item.id)}">
      ${target ? `<span class="target-badge">${ctx.esc(ctx.text.targetBadge)}</span>` : ""}${special ? `<span class="shop-kind">${ctx.esc(ctx.text.special)}</span>` : ""}
      <a class="offer-image-link" href="${ctx.esc(ctx.itemHref(item))}"><img loading="lazy" src="${ctx.esc(image)}" alt="${ctx.esc(name)}"></a>
      <p class="small-id">${ctx.esc(ctx.catName(item.category))} · ID ${ctx.esc(item.id)}</p>
      <h4><a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(name)}</a></h4>
      <p class="price">${ctx.esc(price)}</p>${canHaveCondition ? `<p class="condition-label">${ctx.esc(ctx.text.soldConditional)}</p>` : ""}${extra}
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
    const parts = components.map(
      (item) => `<a class="bundle-part" href="${ctx.esc(ctx.itemHref(item))}" title="${ctx.esc(ctx.itemName(item))}"><img loading="lazy" src="${ctx.esc(ctx.imagePath(item.image))}" alt="${ctx.esc(ctx.itemName(item))}"></a>`
    ).join('<span class="bundle-plus" aria-hidden="true">+</span>');
    const labels = components.map((item) => `<span>${ctx.itemTargetLink(item.category, item.id)}</span>`).join("");
    return `<article class="offer-card${target.id && selected ? " is-target" : ""}" data-offer="fly-bundle:${bundle.slot}">
      ${selected ? `<span class="target-badge">${ctx.esc(ctx.text.targetBadge)}</span>` : ""}
      <span class="shop-kind">${ctx.esc(ctx.text.bundle)}</span><p class="small-id">${ctx.esc(ctx.text.stageWord(stage))} · ${ctx.esc(ctx.text.parts)}</p>
      <div class="bundle-parts">${parts}</div><div class="bundle-labels">${labels}</div>
      <p class="price">${ctx.esc(ctx.text.complete)} · ${ctx.esc(ctx.text.price(bundle.shopPriceYen))}</p>
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
    box.innerHTML = `<strong>${ctx.esc(found ? ctx.text.targetFound : ctx.text.targetNotHere)}</strong>${conditional ? `<p>${ctx.esc(ctx.text.soldConditional)}</p>` : ""}${!found && links ? `<p>${ctx.esc(ctx.text.soldElsewhere)} ${links}</p>` : ""}`;
  }
  function shopsUrl(ctx, overrides = {}) {
    const q = ctx.stateParams(overrides);
    return `${ctx.pages.shops[ctx.lang]}?${q.toString()}${location.hash}`;
  }
  function renderOffers(ctx, items, stock, stage, category, query) {
    const area = stock.areas.find((a) => Number(a.stage) === stage);
    const list = ctx.$("shop-results");
    const target = { category: ctx.targetCategory, id: ctx.targetId };
    if (!area) {
      list.innerHTML = `<p class="empty-state">${ctx.esc(ctx.text.noCategory)}</p>`;
      return;
    }
    const stockItems = area.items.map((record) => ctx.findItem(items, record.category, record.id)).filter(Boolean);
    const bundledCategory = (item) => ["fly", "fly_wing", "fly_tail"].includes(item.category);
    const standard = stockItems.filter(
      (item) => !ctx.isSpecial(item, stage) && !bundledCategory(item)
    );
    const rods = stockItems.filter((item) => ctx.isSpecial(item, stage) && !bundledCategory(item));
    const bundles = area.flyBundles || [];
    const filtered = ctx.filterItems(standard, category, query);
    const filteredSpecial = ctx.filterItems(rods, category, query);
    const filteredBundles = bundles.filter(
      (bundle) => ctx.bundleMatches(items, bundle, category, query)
    );
    const offers = filtered.length + filteredSpecial.length + filteredBundles.length;
    ctx.$("offer-count").textContent = ctx.text.filtered(offers);
    ctx.renderTarget(items, stock, stage);
    const groups = [];
    if (filtered.length)
      groups.push(
        `<section class="seller-group" id="regular-stock"><h3>${ctx.esc(ctx.text.regular)}</h3><p class="seller-description">${ctx.esc(ctx.text.regularNote)}</p><div class="offer-grid">${filtered.map((item) => ctx.offerCard(item, { stage, target: target.category === item.category && target.id === item.id })).join("")}</div></section>`
      );
    if (filteredBundles.length)
      groups.push(
        `<section class="seller-group" id="bundle-stock"><h3>${ctx.esc(ctx.text.bundle)}</h3><p class="seller-description">${ctx.esc(ctx.text.evidenceBundles)}</p><div class="offer-grid">${filteredBundles.map((bundle) => ctx.bundleCard(bundle, stage, items, target)).join("")}</div></section>`
      );
    if (filteredSpecial.length)
      groups.push(
        `<section class="seller-group" id="special-stock"><h3>${ctx.esc(ctx.text.special)}</h3><p class="seller-description">${ctx.esc(ctx.text.specialNote)}</p><div class="offer-grid">${filteredSpecial.map((item) => ctx.offerCard(item, { stage, special: true, target: target.category === item.category && target.id === item.id })).join("")}</div></section>`
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

  // src/pages/shops/shop-page.js
  async function init(ctx) {
    const stageSelect = ctx.$("stage-select"), categorySelect = ctx.$("category-select"), search = ctx.$("item-search");
    stageSelect.value = String(ctx.startStage);
    categorySelect.value = ctx.startCategory || "all";
    search.value = ctx.searchValue;
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
      ctx.$("page-status").textContent = ctx.text.loadFailed;
      ctx.$("shop-results").innerHTML = `<p class="empty-state">${ctx.esc(ctx.text.loadFailed)}</p>`;
      return;
    }
    const items = galleryResult.value.items || [];
    window.__shopItems = items;
    const stock = stockResult.value;
    const mapManifest = mapResult.status === "fulfilled" ? mapResult.value : null;
    const locations = locationResult.status === "fulfilled" ? locationResult.value : null;
    ctx.$("page-status").textContent = locations ? ctx.text.stockLoaded : ctx.text.stockOnly;
    const view = { stageSelect, categorySelect, search, items, stock, mapManifest, locations };
    const render = () => ctx.renderShopView(view);
    ctx.bindShopFilters(view, render);
    render();
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

  // src/pages/shops/text_en.js
  var text_en = {
    stockLoaded: "Shop stock decoded from the original ROM is ready.",
    stockOnly: "The stock list is ready. Exact shop and entrance map positions are not available in this data yet.",
    loadFailed: "Shop stock could not be loaded. Reload the page or open the item catalogue.",
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
    loadFailed: "โหลดรายการร้านไม่ได้ ลองโหลดหน้าใหม่หรือเปิดคลังไอเท็ม",
    area: (n) => `พื้นที่ตกปลา ${n}`,
    outdoor: (n) => `พื้นที่ ${n} · ทางเข้าเมือง`,
    town: (n) => `พื้นที่ ${n} · ตำแหน่งร้าน`,
    townSummary: (n) => `พื้นที่ตกปลา ${n} · เมืองที่คู่กัน`,
    mapSetEvidence: (place, n) => `${place === "outdoor" ? "แผนที่พื้นที่กลางแจ้ง" : "แผนที่ภายในเมือง"} · ชุดแผนที่ ${n}`,
    fieldHeading: "ควรเข้าทางไหน?",
    townHeading: "ไปร้านไหน / เข้าทางไหน?",
    focusedEntrance: (n) => `กำลังเน้นทางเข้า ${n + 1} ซึ่งเชื่อมกับร้านที่เลือก`,
    mapUnavailable: "ไม่มีภาพภูมิประเทศที่สร้างจาก ROM สำหรับแผนที่ชุดนี้",
    invalidPoints: "พิกัดบางรายการอยู่นอกขอบเขตแผนที่ที่ใช้ได้ จึงซ่อนหมุดเหล่านั้นแทนการเดาตำแหน่ง",
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
    ayu: "ขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อน แล้วเหยื่อล่อปลาอายุจะปรากฏในร้านพื้นที่ 3 เมื่อซื้อ จำนวนในช่องจะเต็มเป็น 9 ชิ้น และตัวนับปลาอายุที่ขายจะลดลง 9 (ต่ำสุด 0) ถ้ารายการหายไปอีก ให้ขายปลาอายุเพิ่มก่อนลองซื้อ",
    ayuFish: "ดูจุดตกปลาอายุ ↗",
    noPrice: "ยังไม่มีราคาขายแยกที่ยืนยันได้",
    price: (n) => `${n} เยน`,
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
    loadFailed: "販売品を読み込めませんでした。再読み込みするか、アイテム一覧を開いてください。",
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
    ctx.baseDir = location.pathname.slice(0, location.pathname.lastIndexOf("/") + 1);
    ctx.validCategory = (value) => /^[a-z_]+$/.test(value || "") ? value : "";
    ctx.validId = (value) => /^(?:0x)?[0-9a-f]{1,2}$/i.test(value || "") ? Number.parseInt(String(value).replace(/^0x/i, ""), 16).toString(16).toUpperCase().padStart(2, "0") : "";
    ctx.startStage = /^[1-6]$/.test(ctx.params.get("stage") || "") ? Number(ctx.params.get("stage")) : 1;
    ctx.startPlace = ["area", "outdoor"].includes(ctx.params.get("place")) ? "outdoor" : "town";
    ctx.startCategory = ctx.validCategory(ctx.params.get("category"));
    ctx.startId = ctx.validId(ctx.params.get("id"));
    ctx.selectedFish = ctx.validId(ctx.params.get("fish"));
    ctx.selectedRig = ["float", "sinker"].includes(ctx.params.get("route")) ? ctx.params.get("route") : "";
    ctx.targetCategory = ctx.startCategory;
    ctx.targetId = ctx.startId;
  }

  // src/pages/shops/load-shops.js
  function loadShops(ctx) {
    ctx.focusedEntrance = /^(?:0|[1-4])$/.test(ctx.params.get("entrance") || "") ? Number(ctx.params.get("entrance")) : null;
    ctx.allowedReturn = /^\/(?:[^/]+\/)?(?:catalogue\/(?:index|maps|fish|item|shops)|research\/index)(?:\.th|\.ja)?\.html$/;
    ctx.returnRoute = ctx.safeReturn(ctx.params.get("return"));
    ctx.searchValue = ctx.params.get("q") || "";
    ctx.init().catch((error) => {
      console.error("Shop page data/render error:", error);
      ctx.$("page-status").textContent = ctx.text.loadFailed;
      ctx.$("shop-results").innerHTML = `<p class="empty-state">${ctx.esc(ctx.text.loadFailed)}</p>`;
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
