(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/equipment/index.js
  var equipment_exports = {};
  __export(equipment_exports, {
    acquisitionChoice: () => acquisitionChoice,
    areaItemLink: () => areaItemLink,
    baitGatherChoice: () => baitGatherChoice,
    baitLurePriceChoices: () => baitLurePriceChoices,
    cardDisclosure: () => cardDisclosure,
    closeFishSuggestions: () => closeFishSuggestions,
    compassUseChoice: () => compassUseChoice,
    daikonFishChoice: () => daikonFishChoice,
    decisionCard: () => decisionCard,
    detailedFields: () => detailedFields,
    fishHeading: () => fishHeading,
    fishList: () => fishList,
    floatPriceGuide: () => floatPriceGuide,
    flyBundlePartFor: () => flyBundlePartFor,
    flyDecision: () => flyDecision,
    forageBaitChoice: () => forageBaitChoice,
    gatheredBaitChoices: () => gatheredBaitChoices,
    gearNextActions: () => gearNextActions,
    hookPriceGuide: () => hookPriceGuide,
    initialize: () => initialize,
    keepnetAlternatives: () => keepnetAlternatives,
    mushroomAlternative: () => mushroomAlternative,
    renderCards: () => renderCards,
    renderComparison: () => renderComparison,
    renderDecisions: () => renderDecisions,
    renderFilters: () => renderFilters,
    renderFishLocation: () => renderFishLocation,
    renderFrames: () => renderFrames,
    renderItemCard: () => renderItemCard,
    renderNotes: () => renderNotes,
    renderSamples: () => renderSamples,
    renderTargetCategories: () => renderTargetCategories,
    selectFish: () => selectFish,
    setupFishPicker: () => setupFishPicker,
    shopLocations: () => shopLocations,
    showFishSuggestions: () => showFishSuggestions,
    thaiLabel: () => thaiLabel,
    toolUseLocations: () => toolUseLocations,
    visibleUse: () => visibleUse
  });

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
      return text(ctx, {
        th: `ผ่านเงื่อนไขลัวร์สำหรับ${fish}`,
        ja: `${fish}のルアー判定に適合`,
        en: `Passes the lure check for ${fish}`
      });
    return text(ctx, {
      th: `ผ่านเงื่อนไขเหยื่อสำหรับ${fish} · ${routeName(ctx, route)}`,
      ja: `${fish}のエサ判定に適合 · ${routeName(ctx, route)}`,
      en: `Passes the bait check for ${fish} · ${routeName(ctx, route)}`
    });
  }
  function text(ctx, values) {
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
    const heading = advice.currentStock?.available ? text(ctx, {
      th: "ตัวเลือกที่ถูกกว่าซึ่งผ่านเงื่อนไขปลาและมีขายในด่านนี้",
      ja: "この魚の判定を通り、エリア内で買える安い候補",
      en: "Cheaper local offers that pass this fish check"
    }) : text(ctx, {
      th: "ตัวเลือกที่มีขายในด่านนี้และผ่านเงื่อนไขปลา",
      ja: "エリア内で販売され、この魚の判定を通る候補",
      en: "Local offers that pass this fish check"
    });
    return `<p>${ctx.esc(heading)}</p><ul>${advice.alternatives.map((offer) => alternativeLink(ctx, offer)).join("")}</ul>`;
  }
  function noAreaDecision(ctx) {
    return text(ctx, {
      th: "มีของชิ้นนี้อยู่แล้วใช้ต่อได้ เลือกด่านจากแผนที่เพื่อดูว่ามีขายอะไรและราคาเท่าไร",
      ja: "所持していれば使用できます。地図でエリアを選ぶと、店頭在庫と価格を確認できます。",
      en: "Use it if you already own it. Choose an area on the map to check local stock and prices."
    });
  }
  function absentStockDecision(ctx, advice) {
    if (advice.alternatives.length)
      return text(ctx, {
        th: "ถ้ามีชิ้นนี้อยู่แล้วใช้ต่อได้ ชิ้นนี้ไม่มีรายการขายในด่านนี้; ถ้าจะซื้อใหม่ ให้เลือกตัวเลือกด้านล่าง",
        ja: "所持していればそのまま使えます。この品はエリア内の在庫記録がありません。新しく買うなら下記の候補を選べます。",
        en: "Keep using it if owned. This item has no recorded stock in this area; for a new purchase, choose a compatible offer below."
      });
    return text(ctx, {
      th: "ชิ้นนี้ไม่มีรายการขายในด่านนี้; ถ้ามีอยู่แล้วใช้ต่อได้ หรือดูร้านในด่านอื่น",
      ja: "この品はエリア内の在庫記録がありません。所持品は使えます。別エリアの店を確認してください。",
      en: "This item has no recorded stock in this area. Use it if owned, or check another area’s shops."
    });
  }
  function conditionalStockDecision(ctx, stage, stock) {
    return text(ctx, {
      th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen} แต่${conditionText(ctx, stock.condition)}`,
      ja: `エリア${stage}で${stock.priceYen}円で販売。ただし${conditionText(ctx, stock.condition)}`,
      en: `Stocked in area ${stage} for ¥${stock.priceYen}, but ${conditionText(ctx, stock.condition)}.`
    });
  }
  function cheapestStockDecision(ctx, stage, stock) {
    return text(ctx, {
      th: `มีขายในด่าน ${stage} ราคา ¥${stock.priceYen}; ถ้าจะซื้อ ชิ้นนี้เป็นหนึ่งในตัวเลือกที่ถูกที่สุดซึ่งผ่านเงื่อนไขปลาในสต็อกที่ตรวจได้`,
      ja: `エリア${stage}で${stock.priceYen}円。このエリアで確認できた魚判定を通る在庫品の最安候補の一つです。`,
      en: `Stocked in area ${stage} for ¥${stock.priceYen}; it is one of the cheapest recorded local offers passing this fish check.`
    });
  }
  function compareStockDecision(ctx, stage, stock) {
    return text(ctx, {
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
    return text(ctx, {
      th: "ยืนยันเฉพาะเงื่อนไขจาก ROM ไม่ได้ยืนยันโอกาสกินเหยื่อหรือจับขึ้น",
      ja: "ROM条件を通ることのみ確認。食いつき・釣り上げは保証されません。",
      en: "This confirms the ROM compatibility check only; a bite or catch is not guaranteed."
    });
  }
  function renderTargetAdvice(ctx, item, fish, { includeScope = true } = {}) {
    const advice = targetAdvice(ctx, item, fish);
    if (!advice) return "";
    const fishName = ctx.fishName(fish);
    const status = compatibilityText(ctx, fishName, advice.route);
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

  // src/shared/lib/hp-recovery-action.js
  var labels = {
    th: "เลือกอาหารฟื้น HP และดูแหล่งซื้อ",
    ja: "HP回復用の食料と販売場所を選ぶ",
    en: "Choose recovery food and see where to buy it"
  };
  function hpRecoveryAction(options) {
    const { locale, cataloguePath, stage, returnPath, source, escapeHtml } = options;
    const query = new URLSearchParams({ category: "food", return: returnPath });
    if (/^[1-6]$/.test(String(stage))) query.set("stage", String(stage));
    const href = `${cataloguePath}?${query}#category-decisions`;
    return `<a class="route-button" data-hp-food-action data-hp-source="${escapeHtml(source)}" href="${escapeHtml(href)}">${escapeHtml(labels[locale] || labels.en)} ↗</a>`;
  }

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/pages/equipment/wing-palette.js
  function itemDisplayName(ctx, item) {
    return item.playerUse?.displayName?.[ctx.lang] || ctx.itemName(item);
  }
  function findWingItem(ctx, wingId) {
    const item = ctx.allItems.find((entry) => entry.category === "fly_wing" && entry.id === wingId);
    if (!item) throw new Error(`Missing catalogue record for Mayfly wing ${wingId}`);
    return item;
  }
  function wingItemHref(ctx, item) {
    const target = new URL(ctx.itemHref(item), "https://example.invalid/catalogue/");
    const returned = target.searchParams.get("return");
    if (returned) target.searchParams.set("return", `${returned.split("#")[0]}#wing-palette-title`);
    return `${target.pathname.split("/").pop()}${target.search}${target.hash}`;
  }
  function renderColumnHeaders(ctx, palette, copy3) {
    const columns = Array.from({ length: palette.menu.columns }, (_, index) => index + 1);
    return columns.map((column) => `<th scope="col">${ctx.esc(copy3.column)} ${column}</th>`).join("");
  }
  function renderChoice(ctx, position, copy3) {
    const item = findWingItem(ctx, position.wingId);
    const name = itemDisplayName(ctx, item);
    const location2 = `${copy3.column} ${position.column}, ${copy3.row} ${position.row}`;
    const label = `${copy3.openItem}: ${name}, ID ${position.wingId}; ${location2}`;
    return `<td data-wing-cell="${position.wingId}"><a class="wing-palette__choice" data-wing-choice="${position.wingId}" data-wing-row="${position.row}" data-wing-column="${position.column}" href="${ctx.esc(wingItemHref(ctx, item))}" aria-label="${ctx.esc(label)}"><img loading="lazy" src="${ctx.esc(item.image)}" alt=""><span class="wing-palette__choice-id">${ctx.esc(position.wingId)}</span><span class="wing-palette__choice-name">${ctx.esc(name)}</span><span class="wing-palette__choice-open"><span class="wing-palette__choice-open-label">${ctx.esc(copy3.openItem)}</span> ↗</span></a></td>`;
  }
  function renderRow(ctx, palette, row, copy3) {
    const cells = Array.from({ length: palette.menu.columns }, (_, index) => {
      const column = index + 1;
      const position = palette.positions.find((entry) => entry.column === column && entry.row === row);
      if (!position) throw new Error(`Missing verified Mayfly wing at row ${row}, column ${column}`);
      return renderChoice(ctx, position, copy3);
    });
    return `<tr><th scope="row">${ctx.esc(copy3.row)} ${row}</th>${cells.join("")}</tr>`;
  }
  function renderGrid(ctx, palette, copy3) {
    const rows = Array.from({ length: palette.menu.rows }, (_, index) => index + 1);
    return `<div class="wing-palette__table-wrap"><table class="wing-palette__table"><caption>${ctx.esc(copy3.gridCaption)}</caption><thead><tr><th scope="col" class="wing-palette__corner"></th>${renderColumnHeaders(ctx, palette, copy3)}</tr></thead><tbody>${rows.map((row) => renderRow(ctx, palette, row, copy3)).join("")}</tbody></table></div>`;
  }
  function renderScreenshot(ctx, palette, copy3) {
    const shot = palette.screenshot;
    return `<figure class="wing-palette__screenshot"><a href="${ctx.esc(shot.path)}" target="_blank" rel="noopener"><img loading="lazy" src="${ctx.esc(shot.path)}" alt="${ctx.esc(copy3.screenshotTitle)}"></a><figcaption>${ctx.esc(shot.caption[ctx.lang] || shot.caption.en)}</figcaption></figure>`;
  }
  function renderTechnicalEvidence(ctx, palette, copy3) {
    const evidenceLink = `<p><a href="${ctx.esc(readableEvidenceHref(palette.evidenceHref))}" target="_blank" rel="noopener">${ctx.esc(copy3.evidenceLink)} ↗</a></p>`;
    return `<details class="wing-palette__technical"><summary>${ctx.esc(copy3.technicalTitle)}</summary><div><p>${ctx.esc(copy3.rightEdge)}</p><p>${ctx.esc(copy3.noRanking)}</p><p>${ctx.esc(copy3.evidence)}</p>${evidenceLink}</div></details>`;
  }
  function wingPaletteMarkup(ctx, palette) {
    if (!palette?.positions?.length || !ctx.allItems?.length || !ctx.itemHref) return "";
    const copy3 = palette.copy[ctx.lang] || palette.copy.en;
    const titleId = "wing-palette-title";
    return `<section class="wing-palette" data-wing-palette aria-labelledby="${titleId}"><header class="wing-palette__header"><p class="wing-palette__eyebrow">${ctx.esc(copy3.eyebrow)}</p><h3 id="${titleId}">${ctx.esc(copy3.title)}</h3><p class="wing-palette__intro">${ctx.esc(copy3.intro)}</p><p class="wing-palette__controls" id="wing-palette-controls">${ctx.esc(copy3.controls)}</p></header><div class="wing-palette__layout">${renderScreenshot(ctx, palette, copy3)}${renderGrid(ctx, palette, copy3)}</div>${renderTechnicalEvidence(ctx, palette, copy3)}</section>`;
  }

  // src/pages/equipment/evidence-display.js
  function renderSamples(ctx) {
    const tbody = document.getElementById("sample-rows");
    const selected = ctx.exampleIds.map((key) => ctx.allItems.find((item) => `${item.category}:${item.id}` === key)).filter(Boolean);
    tbody.innerHTML = selected.map((item) => {
      const summary = ctx.copy.quick[`${item.category}:${item.id}`] || ctx.itemNotes(item)[0];
      return `<tr><td><div class="sample-item"><img src="${ctx.esc(item.image)}" alt=""><div><span class="item-id">${ctx.esc(item.id)}</span><strong>${ctx.esc(ctx.itemName(item))}</strong><small>${ctx.esc(item.nameJa)}</small></div></div></td><td>${ctx.esc(summary)}</td><td><span class="price-badge">${ctx.esc(ctx.formatYen(item))}</span></td></tr>`;
    }).join("");
  }
  function renderFrames(ctx, data) {
    const box = document.getElementById("customizer-frames");
    box.innerHTML = data.customizerFrames.map(
      (frame, index) => `<figure class="custom-frame"><a href="${ctx.esc(frame.src)}" target="_blank" rel="noopener"><img loading="lazy" src="${ctx.esc(frame.src)}" alt="${ctx.esc(ctx.lang === "th" ? frame.captionTh : ctx.lang === "ja" ? frame.captionJa : frame.captionEn)}"></a><figcaption><span>${String(index + 1).padStart(2, "0")}</span>${ctx.esc(ctx.lang === "th" ? frame.captionTh : ctx.lang === "ja" ? frame.captionJa : frame.captionEn)}</figcaption></figure>`
    ).join("") + wingPaletteMarkup(ctx, data.flyMakerWingPalette);
  }
  function renderNotes(ctx, data) {
    const list = data.researchNotes[ctx.lang] || data.researchNotes.en;
    document.getElementById("research-notes").innerHTML = list.map((text4) => `<p>${ctx.esc(text4)}</p>`).join("");
    document.getElementById("sources").innerHTML = data.sources.map(
      (src) => `<p>${src.url ? `<a href="${ctx.esc(src.url)}" target="_blank" rel="noopener">${ctx.esc(ctx.lang === "th" ? src.titleTh : ctx.lang === "ja" ? src.titleJa : src.titleEn)} ↗</a>` : `<strong>${ctx.esc(ctx.lang === "th" ? src.titleTh : ctx.lang === "ja" ? src.titleJa : src.titleEn)}</strong>`}<br><span>${ctx.esc(ctx.lang === "th" ? src.detailTh : ctx.lang === "ja" ? src.detailJa : src.detailEn)}</span></p>`
    ).join("");
  }
  function cardDisclosure(ctx, summary, content, className) {
    if (!content?.trim()) return "";
    return `<details class="${className}"><summary>${ctx.esc(summary)}</summary><div class="${className}-content">${content}</div></details>`;
  }
  function detailedFields(ctx, item) {
    const originalEvidence = ctx.useOf(item).evidence || {};
    const evidence = {
      ...originalEvidence,
      sources: [
        .../* @__PURE__ */ new Set([
          ...originalEvidence.sources || [],
          ...item.rodDecision?.sources || [],
          ...item.gearDecision?.sources || [],
          ...item.baitLureDecision?.sources || []
        ])
      ]
    };
    const sourceInfo = evidence.type ? `<p>${ctx.esc(ctx.lang === "th" ? "ที่มาของคำอธิบาย" : ctx.lang === "ja" ? "説明の根拠" : "Explanation source")}: ${ctx.esc(evidence.type)}</p>${(evidence.sources || []).map((s) => `<p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${ctx.esc(s)}" target="_blank" rel="noopener"><code>${ctx.esc(s)}</code> ↗</a></p>`).join("")}` : "";
    const bytes = item.recordBytesHex ? `<p><b>${ctx.esc(ctx.copy.offset)}:</b> <code>${ctx.esc(item.fileOffset || "—")}</code></p><p><b>${ctx.esc(ctx.copy.bytes)}:</b> <code>${ctx.esc(item.recordBytesHex)}</code></p>` : `<p>${ctx.esc(ctx.copy.none)}</p>`;
    const decoded = Object.entries(item.decodedFields || {}).filter(([key]) => !["nameJapanese", "nameEnglish", "condition"].includes(key)).map(
      ([key, value]) => `<dt>${ctx.esc(ctx.copy.fieldNames[key] || key)}</dt><dd>${ctx.esc(typeof value === "object" ? JSON.stringify(value) : value)}</dd>`
    ).join("");
    const use = ctx.useOf(item), targets = use.targetMatches ? Array.isArray(use.targetMatches) ? use.targetMatches : [use.targetMatches] : [];
    const response = targets.length ? `<p>${ctx.lang === "th" ? "มีการคำนวณตอบสนองเฉพาะปลา แต่ยังใช้จัดอันดับจับง่ายไม่ได้" : ctx.lang === "ja" ? "魚別の応答計算。取り込みやすさの順位には未使用。" : "Fish-specific response calculation; not a landing recommendation."}: ${targets.map((t) => ctx.esc(ctx.fishName(t.fishId))).join(", ")}</p>` : "";
    const hookTrace = item.category === "rod" || ["hook", "fly_wing", "fly_tail", "float_weight"].includes(item.category) || item.category === "food" && item.id === "08" || use.specialResponseTarget ? `<p>${ctx.esc(ctx.local(use.summary))}</p><ul>${(use.facts?.[ctx.lang] || []).map((f) => `<li>${ctx.esc(f)}</li>`).join("")}</ul>` : "";
    return `<details class="record-details"><summary>${ctx.esc(ctx.player.evidence)}</summary>${sourceInfo}${response}${hookTrace}${use.comparison ? `<p>${ctx.esc(ctx.local(use.comparison))}</p>` : ""}<p>${ctx.esc(ctx.copy.priceField)}: ${ctx.esc(ctx.formatYen(item))}</p><ul class="stat-list">${(ctx.useOf(item).evidenceNotes?.[ctx.lang] || []).map((n) => `<li>${ctx.esc(n)}</li>`).join("")}</ul>${ctx.lang === "th" && !item.nameTh && ctx.useOf(item).displayName?.th ? "<p>ชื่อไทย: คำแปลชื่อภาษาญี่ปุ่นสำหรับคู่มือนี้</p>" : ""}${bytes}${decoded ? `<h4>${ctx.esc(ctx.copy.decoded)}</h4><dl>${decoded}</dl>` : ""}<a class="frame-link" href="${ctx.esc(item.frame)}" target="_blank" rel="noopener">${ctx.esc(ctx.copy.openFrame)}</a></details>`;
  }
  function thaiLabel(ctx, item) {
    return ctx.lang === "th" && item.labelImageTh ? `<img class="thai-rom-label" loading="lazy" src="${ctx.esc(item.labelImageTh)}" alt="${ctx.esc(item.nameTh || "ชื่อในเกมไทย")}">` : "";
  }

  // src/pages/equipment/fish-equipment-default.js
  function compatibleWith(item, fish, route) {
    const use = item.playerUse || {};
    const ids = route ? use.fishIdsByRoute?.[route] || use.fishIds || [] : use.fishIds || [];
    return ids.includes(fish);
  }
  function fishEquipmentDefault(ctx, fish) {
    const items = ctx.allItems || [];
    const preferred = ctx.baitRoute === "sinker" ? "sinker" : "float";
    for (const route of [preferred, preferred === "float" ? "sinker" : "float"]) {
      if (items.some((item) => item.category === "bait" && compatibleWith(item, fish, route)))
        return { category: "bait", route };
    }
    if (items.some((item) => item.category === "lure" && compatibleWith(item, fish)))
      return { category: "lure", route: preferred };
    if (items.some((item) => item.category === "fly" && compatibleWith(item, fish)))
      return { category: "flymaker", route: preferred };
    return { category: "bait", route: preferred };
  }
  function applyFishEquipmentDefault(ctx, fish) {
    const choice = fishEquipmentDefault(ctx, fish);
    document.getElementById("category-filter").value = choice.category;
    ctx.baitRoute = choice.route;
    ctx.flyPart = "fly";
  }

  // src/pages/equipment/fish-picker.js
  function closeFishSuggestions(ctx) {
    document.getElementById("fish-suggestions").hidden = true;
    document.getElementById("fish-search").setAttribute("aria-expanded", "false");
    document.getElementById("fish-search").removeAttribute("aria-activedescendant");
    ctx.activeSuggestion = -1;
  }
  function showFishSuggestions(ctx) {
    const input = document.getElementById("fish-search"), box = document.getElementById("fish-suggestions");
    const selected = document.getElementById("fish-filter").value;
    const term = selected && input.value === ctx.fishName(selected) ? "" : input.value.normalize("NFKC").trim().toLocaleLowerCase();
    ctx.suggestionIds = Object.keys(ctx.fishVisuals).filter((id) => id !== "43" && (!term || ctx.fishSearchText(id).includes(term))).sort((a, b) => ctx.fishName(a).localeCompare(ctx.fishName(b), ctx.lang));
    ctx.activeSuggestion = -1;
    box.innerHTML = ctx.suggestionIds.map(
      (id) => `<div id="fish-option-${id}" role="option" aria-selected="false" data-fish-choice="${id}"><img src="${ctx.esc(ctx.fishVisuals[id].image)}" alt=""><span><strong>${ctx.esc(ctx.fishName(id))}</strong><small>${ctx.esc(ctx.lang === "ja" ? ctx.fishVisuals[id].nameLatin || ctx.fishVisuals[id].nameLatinVariants?.[0] || "" : ctx.fishVisuals[id].nameJa || "")}</small></span></div>`
    ).join("") || `<p class="fish-no-match">${ctx.esc(ctx.pickerCopy.none)}</p>`;
    box.hidden = false;
    input.setAttribute("aria-expanded", "true");
    input.removeAttribute("aria-activedescendant");
    document.getElementById("fish-search-status").textContent = ctx.suggestionIds.length ? ctx.pickerCopy.count(ctx.suggestionIds.length) : ctx.pickerCopy.none;
  }
  function handleFishSearchInput(ctx, input) {
    if (!input.value.trim()) ctx.selectFish("");
    ctx.showFishSuggestions();
  }
  function restoreSelectedFish(ctx, input) {
    const selected = document.getElementById("fish-filter").value;
    input.value = selected ? ctx.fishName(selected) : "";
  }
  function handleFishSearchBlur(ctx, input) {
    restoreSelectedFish(ctx, input);
    ctx.closeFishSuggestions();
  }
  function handleFishSearchKeydown(ctx, input, box, event) {
    if (event.key === "Escape") {
      restoreSelectedFish(ctx, input);
      ctx.closeFishSuggestions();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (box.hidden) ctx.showFishSuggestions();
      if (!ctx.suggestionIds.length) return;
      ctx.activeSuggestion = event.key === "ArrowDown" ? (ctx.activeSuggestion + 1) % ctx.suggestionIds.length : ctx.activeSuggestion < 0 ? ctx.suggestionIds.length - 1 : (ctx.activeSuggestion - 1 + ctx.suggestionIds.length) % ctx.suggestionIds.length;
      box.querySelectorAll('[role="option"]').forEach(
        (option2, index) => option2.setAttribute("aria-selected", index === ctx.activeSuggestion ? "true" : "false")
      );
      const option = document.getElementById("fish-option-" + ctx.suggestionIds[ctx.activeSuggestion]);
      input.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && !box.hidden) {
      event.preventDefault();
      const id = ctx.suggestionIds[ctx.activeSuggestion] || (ctx.suggestionIds.length === 1 ? ctx.suggestionIds[0] : null);
      if (id) ctx.selectFish(id);
    } else if (event.key === "Tab") ctx.closeFishSuggestions();
  }
  function selectClickedFish(ctx, event) {
    const option = event.target.closest("[data-fish-choice]");
    if (option) ctx.selectFish(option.dataset.fishChoice);
  }
  function clearFishSearch(ctx, input) {
    ctx.selectFish("");
    input.focus();
    ctx.showFishSuggestions();
  }
  function closeSuggestionsOutside(ctx, event) {
    if (!event.target.closest(".fish-combobox")) ctx.closeFishSuggestions();
  }
  function setupFishPicker(ctx) {
    const input = document.getElementById("fish-search"), box = document.getElementById("fish-suggestions"), clearButton = document.getElementById("fish-clear");
    input.disabled = false;
    clearButton.disabled = false;
    input.placeholder = ctx.pickerCopy.placeholder;
    clearButton.setAttribute("aria-label", ctx.pickerCopy.clear);
    input.addEventListener("input", () => handleFishSearchInput(ctx, input));
    input.addEventListener("focus", ctx.showFishSuggestions);
    input.addEventListener("blur", () => handleFishSearchBlur(ctx, input));
    input.addEventListener("keydown", (event) => handleFishSearchKeydown(ctx, input, box, event));
    box.addEventListener("mousedown", (event) => event.preventDefault());
    box.addEventListener("click", (event) => selectClickedFish(ctx, event));
    clearButton.addEventListener("click", () => clearFishSearch(ctx, input));
    document.addEventListener("click", (event) => closeSuggestionsOutside(ctx, event));
  }
  function selectFish(ctx, id) {
    if (document.getElementById("fish-filter").value !== id) {
      document.getElementById("search").value = "";
      document.getElementById("style-filter").value = "";
      ctx.flyPart = "fly";
    }
    document.getElementById("fish-filter").value = id;
    document.getElementById("fish-search").value = id ? ctx.fishName(id) : "";
    document.getElementById("fish-search-status").textContent = "";
    ctx.closeFishSuggestions();
    if (id) applyFishEquipmentDefault(ctx, id);
    ctx.locationStage = "";
    ctx.locationMapIndex = 0;
    ctx.renderCards();
    if (typeof history !== "undefined")
      history.replaceState(null, "", `?${new URLSearchParams(location.search)}#fish-location-panel`);
    ctx.refreshLanguageLinks?.();
  }

  // src/pages/equipment/category-navigation.js
  var ROUTES = ["float", "sinker"];
  var FLY_PARTS = ["fly", "fly_wing", "fly_tail"];
  var STAGES = ["1", "2", "3", "4", "5", "6"];
  function categoryNavigationHref(ctx, category, fish) {
    const search = typeof location === "undefined" ? "" : location.search;
    const query = new URLSearchParams(search);
    query.set("category", category);
    if (fish) query.set("fish", fish);
    else query.delete("fish");
    query.delete("q");
    query.delete("style");
    if (STAGES.includes(String(ctx.locationStage || ""))) query.set("stage", ctx.locationStage);
    else query.delete("stage");
    if (ROUTES.includes(ctx.baitRoute)) query.set("route", ctx.baitRoute);
    else query.delete("route");
    if (category === "flymaker" && FLY_PARTS.includes(ctx.flyPart)) query.set("part", ctx.flyPart);
    else query.delete("part");
    const map = Number(ctx.locationMapIndex);
    if (query.has("map") || Number.isInteger(map) && map > 0) {
      if (Number.isInteger(map) && map >= 0) query.set("map", String(map));
      else query.delete("map");
    }
    return `?${query.toString()}#catalogue`;
  }
  function refreshCategoryNavigationLinks(ctx, fish) {
    document.querySelectorAll("#category-menu [data-category]").forEach((link) => {
      link.setAttribute("href", categoryNavigationHref(ctx, link.dataset.category, fish));
    });
  }

  // src/pages/equipment/category-controls.js
  function renderTargetCategories(ctx, fish) {
    const available = fish ? ctx.groups.filter((c) => ctx.fishCategories.includes(c)) : ctx.groups;
    const select = document.getElementById("category-filter"), current = select.value;
    select.innerHTML = `<option value="all">${ctx.esc(ctx.player.all)}</option>` + available.map((c) => `<option value="${c}">${ctx.esc(ctx.player.cat[c])}</option>`).join("");
    select.value = !fish || ctx.fishCategories.includes(current) ? current : "all";
    document.getElementById("category-menu").innerHTML = `<a class="category-button" href="${ctx.esc(categoryNavigationHref(ctx, "all", fish))}" data-category="all"><span><strong>${ctx.esc(ctx.player.all)}</strong></span></a>` + available.map((c) => {
      const item = ctx.allItems.find((i) => ctx.groupOf(i) === c);
      const count = ctx.allItems.filter(
        (i) => fish && ["rod", "hook"].includes(c) ? ctx.groupOf(i) === c : ctx.groupOf(i) === c && (!fish || ctx.fishIdsFor(i).includes(fish) || ["fly_wing", "fly_tail"].includes(i.category) && ctx.flyBundlePartFor(i, fish))
      ).length;
      return `<a class="category-button" href="${ctx.esc(categoryNavigationHref(ctx, c, fish))}" data-category="${c}"><img src="${ctx.esc(item?.image)}" alt=""><span><strong>${ctx.esc(ctx.player.cat[c])}</strong><small>${count}</small></span></a>`;
    }).join("");
  }
  function renderFilters(ctx) {
    document.getElementById("category-filter").innerHTML = `<option value="all">${ctx.esc(ctx.player.all)}</option>` + ctx.groups.map((c) => `<option value="${c}">${ctx.esc(ctx.player.cat[c])}</option>`).join("");
    document.getElementById("style-filter").innerHTML = `<option value="">${ctx.esc(ctx.player.all)}</option>` + Object.entries(
      ctx.lang === "th" ? { 1: "ทุ่น / อายุ", 2: "ตีเหยื่อ", 4: "ลัวร์", 8: "ฟลาย" } : ctx.lang === "ja" ? { 1: "ウキ・アユ", 2: "投げ", 4: "ルアー", 8: "フライ" } : { 1: "Float / Ayu", 2: "Casting", 4: "Lure", 8: "Fly" }
    ).map(([k, v]) => `<option value="${k}">${ctx.esc(v)}</option>`).join("");
    ctx.set("#style-filter-label", ctx.player.style);
    document.getElementById("sort-filter").innerHTML = `<option value="id">${ctx.esc(ctx.copy.sortId)}</option><option value="name">${ctx.esc(ctx.copy.sortName)}</option><option value="buy-price">${ctx.esc(ctx.copy.sortBuyPrice)}</option><option value="price">${ctx.esc(ctx.copy.sortPrice)}</option>`;
    document.getElementById("category-menu").innerHTML = ctx.groups.map((c) => {
      const i = ctx.allItems.find((i2) => ctx.groupOf(i2) === c);
      return `<a class="category-button" href="${ctx.esc(categoryNavigationHref(ctx, c, document.getElementById("fish-filter").value))}" data-category="${c}"><img src="${ctx.esc(i?.image)}" alt=""><span><strong>${ctx.esc(ctx.player.cat[c])}</strong><small>${ctx.allItems.filter((i2) => ctx.groupOf(i2) === c).length}</small></span></a>`;
    }).join("");
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
  function flyWingPlayerDecision(lang, item, allItems = [], fishId = "", fishName = "") {
    if (!hasUnverifiedFlyWingPath(item)) return null;
    const bundle = recordedBundle(item);
    if (!bundle) return { ...noBundleCopy(lang, item.id, fishName), bundle: null, itemId: item.id };
    const body = nameForBundleItem(allItems, "fly", bundle.body);
    const supported = Boolean(fishId && (body?.playerUse?.fishIds || []).includes(fishId));
    const copy3 = bundleCopy(lang, item, bundle, fishName, supported);
    return { ...copy3, bundle, supported, hasTarget: Boolean(fishId), itemId: item.id };
  }
  function actionLabel(lang, key, bundle) {
    const labels2 = {
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
    return labels2[key]?.[lang] || labels2[key]?.en || "";
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
  function capitalizeSentenceStarts(text4) {
    return text4.replace(/(^|[.!?]\s+)the (?=[a-z])/g, "$1The ");
  }
  function rodRefName(lang, id) {
    const item = rods.get(id);
    return item && rodName(lang, item) || id;
  }

  // src/entities/item/rod-area-copy.js
  var COPY = {
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
    const text4 = template.replace(/\{([a-zA-Z]+)\}/g, (_match, key) => {
      const value = values[key] ?? "";
      return String(ID_KEYS.has(key) && lang ? rodRefName(lang, value) : value);
    });
    return lang === "en" ? capitalizeSentenceStarts(text4) : text4;
  }
  function rodAreaCopy(lang, type, key, values = {}) {
    const locale = COPY[lang] || COPY.en;
    return interpolate(locale[type][key], values, lang);
  }
  function rodAreaScope(lang, styleCode2) {
    const locale = COPY[lang] || COPY.en;
    const hp = [2, 4].includes(styleCode2) ? locale.recommendation.hp : "";
    const fly = styleCode2 === 8 ? locale.recommendation.fly : "";
    return interpolate(locale.recommendation.scope, { hp, fly });
  }

  // src/entities/item/rod-area-label.js
  var AIM_STYLES = [2, 4];
  function text2(lang, type, key, values) {
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
      (copy3, [name, marker]) => copy3.replaceAll(marker, `{${name}}`),
      text2(lang, "comparison", key, placeholders)
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
      area: text2(lang, "recommendation", "area", { stage }),
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
        return text2(lang, "labels", "aimChoice", {
          ...values,
          comparison: tradeoffDescription(lang, candidate, budget)
        });
      }
    }
    if (status === "boundary") {
      const maximum = Math.max(...choices.map((choice) => choice.boundary));
      const peer = boundaryPeerContext(choices, maximum);
      if (peer?.cheapest.id === candidate.id && peer.aimLeader.id !== candidate.id) {
        return text2(lang, "labels", "boundaryPeerCheapest", values);
      }
      if (peer?.aimLeader.id === candidate.id && peer.cheapest.id !== candidate.id) {
        return text2(lang, "labels", "boundaryPeerAim", {
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
    return text2(lang, "labels", key, {
      ...values,
      lowerId: other.id,
      comparison: tradeoffDescription(lang, candidate, other)
    });
  }
  function areaRodLabel(lang, status, candidate, choices, stage, better) {
    const values = valuesFor(lang, candidate, stage, better);
    if (status === "dominated") {
      return text2(lang, "labels", status, {
        ...values,
        betterReason: dominatedReason(lang, candidate, better)
      });
    }
    const leaderLabel = areaLeaderLabel(lang, status, candidate, choices, values);
    if (leaderLabel) return leaderLabel;
    if (status !== "tradeoff") return text2(lang, "labels", status, values);
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
  function text3(lang, type, key, values) {
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
    return text3(lang, "recommendation", sentenceKey, {
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
      area: text3(lang, "recommendation", "area", { stage }),
      stage,
      id: candidate.id,
      style: text3(lang, "styles", String(styleCode(candidate.item)), {}),
      price: offerPrice2(lang, candidate.price),
      aim: candidate.aim,
      boundary: candidate.boundary,
      stats: offerStats(lang, candidate),
      hpNote: aimCondition2(lang, candidate.item)
    };
  }
  function simpleLocalRecommendation(lang, status, candidate, choices, best, values) {
    if (status === "only") return text3(lang, "recommendation", "only", values);
    if (status === "dominated")
      return text3(lang, "recommendation", "dominated", {
        ...values,
        otherId: best.id,
        otherStats: offerStats(lang, best),
        betterReason: dominatedReason(lang, candidate, best)
      });
    if (status === "dual") return text3(lang, "recommendation", "dual", values);
    if (status === "cheapest") return cheapestRecommendation(lang, candidate, choices, values);
    if (status === "aim") return aimRecommendation(lang, candidate, choices, values);
    if (status === "boundary") return boundaryRecommendation(lang, candidate, choices, values);
    return "";
  }
  function cheapestRecommendation(lang, candidate, choices, values) {
    return text3(lang, "recommendation", "cheapest", {
      ...values,
      aimLine: leaderSentence(lang, "aim", candidate, choices),
      boundaryLine: leaderSentence(lang, "boundary", candidate, choices)
    });
  }
  function aimRecommendation(lang, candidate, choices, values) {
    const budget = leader2(choices, "price");
    if (budget.id !== candidate.id) {
      return text3(lang, "recommendation", "aimChoice", {
        ...values,
        lowerId: budget.id,
        lowerPrice: offerPrice2(lang, budget.price),
        comparison: tradeoffDescription(lang, candidate, budget)
      });
    }
    return text3(lang, "recommendation", "aim", {
      ...values,
      budgetLine: leaderSentence(lang, "price", candidate, choices),
      boundaryLine: leaderSentence(lang, "boundary", candidate, choices)
    });
  }
  function boundaryRecommendation(lang, candidate, choices, values) {
    const maximum = Math.max(...choices.map((choice) => choice.boundary));
    const peer = boundaryPeerContext(choices, maximum);
    if (peer?.cheapest.id === candidate.id && peer.aimLeader.id !== candidate.id) {
      return text3(lang, "recommendation", "boundaryPeerCheapest", {
        ...values,
        otherId: peer.aimLeader.id,
        otherPrice: offerPrice2(lang, peer.aimLeader.price),
        otherAim: peer.aimLeader.aim,
        hpNote: aimCondition2(lang, peer.aimLeader.item)
      });
    }
    if (peer?.aimLeader.id === candidate.id && peer.cheapest.id !== candidate.id) {
      return text3(lang, "recommendation", "boundaryPeerAim", {
        ...values,
        otherId: peer.cheapest.id,
        otherPrice: offerPrice2(lang, peer.cheapest.price),
        hpNote: aimCondition2(lang, candidate.item)
      });
    }
    return text3(lang, "recommendation", "boundary", {
      ...values,
      budgetLine: leaderSentence(lang, "price", candidate, choices),
      aimLine: leaderSentence(lang, "aim", candidate, choices)
    });
  }
  function tradeoffRecommendation(lang, candidate, choices, values) {
    const { lower, higher } = tradeoffNeighbors2(candidate, choices);
    return text3(lang, "recommendation", "tradeoffChoice", {
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
    const stages2 = allItems.filter((item) => item.category === "rod" && styleCode(item) === style).flatMap((item) => (item.playerUse?.shops || []).map((offer) => Number(offer.stage))).filter((area) => Number.isInteger(area) && area >= 1 && area <= 6).sort((a, b) => a - b);
    const next = stages2.find((area) => area > stage);
    return next || stages2.filter((area) => area < stage).at(-1) || 0;
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
      reason: localized((lang) => text3(lang, "recommendation", "reason", {})),
      scope: localized((lang) => rodAreaScope(lang, style)),
      alternatives,
      nextStockStage
    };
  }
  function areaValues(lang, stage) {
    return {
      stage,
      area: text3(lang, "recommendation", "area", { stage })
    };
  }
  function unstockedItem(item, choices, stage, style) {
    const status = "item-unstocked";
    const area = localized((lang) => text3(lang, "recommendation", "area", { stage }));
    const budget = leader2(choices, "price");
    return decisionResult(
      status,
      stage,
      style,
      (lang) => text3(lang, "labels", "itemMissing", {
        stage,
        area: area[lang],
        id: item.id,
        budgetId: budget.id,
        budgetPrice: offerPrice2(lang, budget.price)
      }),
      (lang) => text3(lang, "recommendation", "itemMissing", {
        id: item.id,
        stage,
        area: area[lang],
        style: text3(lang, "styles", String(style), {}) || STYLES[style],
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
      (lang) => text3(lang, "labels", labelKey, {
        ...areaValues(lang, stage),
        nextStage,
        nextId: choices[0]?.id || "",
        direction: text3(lang, "recommendation", direction, {})
      }),
      (lang) => text3(lang, "recommendation", key, {
        id: item.id,
        ...areaValues(lang, stage),
        nextStage,
        nextId: choices[0]?.id || "",
        direction: text3(lang, "recommendation", direction, {}),
        style: text3(lang, "styles", String(style), {}) || STYLES[style],
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

  // src/entities/item/shop-availability-sort.js
  function selectedStage(value) {
    const stage = Number(value);
    return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0;
  }
  function ordinaryOffers(item, stage) {
    if (["fly", "fly_wing", "fly_tail"].includes(item.category)) return [];
    return (item.playerUse?.shops || []).filter((offer) => {
      const area = selectedStage(offer.stage);
      return area && (!stage || area === stage) && offer.shop !== "fly_bundle" && !offer.bundle;
    });
  }
  function itemShopSortState(item, selectedArea) {
    const stage = selectedStage(selectedArea);
    const offers = ordinaryOffers(item, stage);
    const knownPrice = Number.isFinite(item.priceYen) && item.priceYen >= 0;
    if (!knownPrice || !offers.length) return { rank: 2, price: Infinity, stage };
    const regular = offers.some((offer) => !offer.condition);
    return { rank: regular ? 0 : 1, price: item.priceYen, stage };
  }
  function sortItemsByShopAvailability(items, selectedArea) {
    return [...items].sort((first, second) => {
      const a = itemShopSortState(first, selectedArea);
      const b = itemShopSortState(second, selectedArea);
      return a.rank - b.rank || (a.rank < 2 ? a.price - b.price : 0) || first.category.localeCompare(second.category) || first.id.localeCompare(second.id);
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
  function lureCoverageByArea(options) {
    return [1, 2, 3, 4, 5, 6].map((stage) => lureCoverageForArea(options, stage));
  }

  // src/pages/equipment/hp-recovery-tip.js
  function catalogueHpRecoveryAction(ctx) {
    if (typeof ctx.sourceReturn !== "function") return "";
    return hpRecoveryAction({
      locale: ctx.lang,
      cataloguePath: `index${ctx.lang === "en" ? "" : "." + ctx.lang}.html`,
      stage: ctx.locationStage,
      returnPath: ctx.sourceReturn(),
      source: "catalogue",
      escapeHtml: ctx.esc
    });
  }

  // src/pages/equipment/rod-area-page-helpers.js
  function hasSelectedArea(ctx) {
    const stage = Number(ctx.locationStage);
    return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0;
  }
  function localRodOffer(decision) {
    return decision && !["item-unstocked", "style-unstocked", "style-never-stocked"].includes(decision.status);
  }
  function withStage(href, stage) {
    const [pathAndQuery, hash = ""] = href.split("#");
    const [path, query = ""] = pathAndQuery.split("?");
    const params = new URLSearchParams(query);
    params.set("stage", String(stage));
    return `${path}?${params}${hash ? `#${hash}` : ""}`;
  }
  function areaLabel(ctx, stage) {
    if (ctx.lang === "th") return `ด่าน ${stage}`;
    if (ctx.lang === "ja") return `エリア${stage}`;
    return `Area ${stage}`;
  }
  function categoryDecisionCopy(ctx, category, count) {
    const area = hasSelectedArea(ctx);
    const isAreaRod = area && category === "rod";
    return {
      label: categoryLabel(ctx, category, count, area, isAreaRod),
      note: categoryNote(ctx, area, isAreaRod || Boolean(area && category === "all"))
    };
  }
  function categoryLabel(ctx, category, count, area, isAreaRod) {
    if (!isAreaRod) return ctx.cardUi.categoryAdvice(count);
    if (ctx.lang === "th") return `คำแนะนำคันเบ็ดทั่วไป (ไม่คัดตามด่าน ${area}) · ${count}`;
    if (ctx.lang === "ja") return `一般的な竿のルート案内（エリア${area}に限定しない） · ${count}`;
    return `General rod route advice (not scoped to Area ${area}) · ${count}`;
  }
  function categoryNote(ctx, area, isAreaRod) {
    if (!isAreaRod) return "";
    if (ctx.lang === "th")
      return `<p>คำแนะนำคันเบ็ดนี้เป็นเส้นทางทั่วไป ไม่ได้คัดสินค้าตามด่าน ${area} เปิดหน้าร้านเพื่อดูรายการขายในด่านที่เลือก</p>`;
    if (ctx.lang === "ja")
      return `<p>竿の一般ルート案内で、エリア${area}の店頭在庫に限定した案内ではありません。選択エリアの販売品はショップページで確認してください。</p>`;
    return `<p>These rod recommendations are general routes, not stock choices for Area ${area}. Open Shops to see recorded offers in your selected area.</p>`;
  }

  // src/pages/equipment/lure-coverage-guidance.js
  function areaNames(ctx, stages2) {
    if (ctx.lang === "th") return `ด่าน ${stages2.join(", ")}`;
    if (ctx.lang === "ja") return `エリア${stages2.join("・")}`;
    if (stages2.length === 1) return `Area ${stages2[0]}`;
    return `Areas ${stages2.slice(0, -1).join(", ")} and ${stages2.at(-1)}`;
  }
  function pairSummary(ctx, pair) {
    const price = ctx.lang === "ja" ? `${pair.totalYen}円` : `¥${pair.totalYen}`;
    return `${pair.key} · ${price}`;
  }
  function groupedLureAreas(options) {
    const groups = /* @__PURE__ */ new Map();
    for (const choice of lureCoverageByArea(options)) {
      const key = choice.isLocal ? choice.pair.key : "none";
      const group = groups.get(key) || { pair: choice.isLocal ? choice.pair : null, stages: [] };
      group.stages.push(choice.stage);
      groups.set(key, group);
    }
    return [...groups.values()];
  }
  function groupSummary(ctx, group) {
    if (group.pair) return `${areaNames(ctx, group.stages)}: ${pairSummary(ctx, group.pair)}`;
    const unavailable = ctx.lang === "th" ? "ไม่มีคู่ครบขายในพื้นที่; ใช้คู่ที่มีอยู่หรือซื้อ 17+23 ที่ด่าน 4" : ctx.lang === "ja" ? "店頭で一式は揃いません。所持中のセットを使うか、エリア4で17+23を購入" : "no complete local pair; keep a full pair you own or buy 17+23 in Area 4";
    return `${areaNames(ctx, group.stages)}: ${unavailable}`;
  }
  function noStageRecommendation(ctx, options) {
    const areaChoices = groupedLureAreas(options).map((group) => groupSummary(ctx, group));
    if (ctx.lang === "th") return `ชุดครบที่ซื้อได้ตามด่าน: ${areaChoices.join("; ")}`;
    if (ctx.lang === "ja") return `エリア別に店頭で揃うセット：${areaChoices.join("；")}`;
    return `Complete pairs by area: ${areaChoices.join("; ")}`;
  }
  function currentAreaRecommendation(ctx, options, stage, choice) {
    if (choice.isLocal) {
      if (ctx.lang === "th")
        return `ด่าน ${stage} ซื้อคู่ ${pairSummary(ctx, choice.pair)} ได้ครบในพื้นที่นี้`;
      if (ctx.lang === "ja")
        return `エリア${stage}では${pairSummary(ctx, choice.pair)}を店頭で揃えられます。`;
      return `Area ${stage} stocks the complete pair ${pairSummary(ctx, choice.pair)}.`;
    }
    const sellers = lureCoverageByArea(options).filter((area) => area.isLocal && area.pair.key === choice.pair.key).map((area) => area.stage);
    const sellerAreas = areaNames(ctx, sellers);
    if (ctx.lang === "th")
      return `ด่าน ${stage} ไม่มีคู่ครบขายในพื้นที่; คู่ครบที่ราคาต่ำสุดคือ ${pairSummary(ctx, choice.pair)} ซื้อครบได้ที่ ${sellerAreas}. ถ้ามีคู่ครบอยู่แล้ว ใช้ต่อได้`;
    if (ctx.lang === "ja")
      return `エリア${stage}では一式が揃いません。最安の組み合わせ${pairSummary(ctx, choice.pair)}は${sellerAreas}で購入できます。すでに一式を持っていればそのまま使えます。`;
    return `Area ${stage} has no complete local pair. The lowest-cost full pair is ${pairSummary(ctx, choice.pair)}, stocked in ${sellerAreas}. Keep a full pair you already own.`;
  }
  function contextualLureCoverageDecision(ctx, decision) {
    const options = lureCoverageOptions(ctx.allItems);
    const stage = hasSelectedArea(ctx);
    const choice = lureCoverageForArea(options, stage || 1);
    if (!choice.pair) return decision;
    const recommendation2 = stage ? currentAreaRecommendation(ctx, options, stage, choice) : noStageRecommendation(ctx, options);
    const items = stage ? choice.pair.items : lureCoverageByArea(options).filter((area) => area.isLocal).flatMap((area) => area.pair.items).filter(
      (item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index
    );
    return {
      ...decision,
      recommendation: { ...decision.recommendation, [ctx.lang]: recommendation2 },
      items: items.map((item) => ({ category: item.category, id: item.id }))
    };
  }

  // src/pages/equipment/food-area-guidance.js
  function stageFoodItems(items, stage) {
    return items.filter((item) => {
      const hp = item.playerUse?.hpRecovery?.hp;
      const stocked = (item.playerUse?.shops || []).some(
        (shop) => Number(shop.stage) === stage && !shop.condition
      );
      return item.category === "food" && Number.isSafeInteger(hp) && hp > 0 && Number.isFinite(item.priceYen) && item.priceYen > 0 && stocked;
    }).sort(
      (first, second) => first.playerUse.hpRecovery.hp - second.playerUse.hpRecovery.hp || first.priceYen - second.priceYen || first.id.localeCompare(second.id)
    );
  }
  function foodItemNote(ctx, item) {
    const hp = item.playerUse.hpRecovery.hp;
    const note = ctx.lang === "ja" ? `${hp}HP回復 · ${item.priceYen}円` : ctx.lang === "th" ? `ฟื้น ${hp} HP · ¥${item.priceYen}` : `Restores ${hp} HP · ¥${item.priceYen}`;
    return { [ctx.lang]: note };
  }
  function foodValueNote(ctx, foods) {
    const samePricePerHp = foods.every((item) => item.priceYen === item.playerUse.hpRecovery.hp);
    if (!samePricePerHp) return "";
    if (ctx.lang === "th") return "ทุกชิ้นราคา ¥1 ต่อ HP";
    if (ctx.lang === "ja") return "すべて1HPあたり1円";
    return "All cost ¥1 per HP";
  }
  function areaFoodRecommendation(ctx, stage, foods) {
    const valueNote = foodValueNote(ctx, foods);
    if (ctx.lang === "th")
      return `อาหารที่มีขายปกติในด่าน ${stage}${valueNote ? ` ${valueNote}` : ""} ถ้ามีอาหารที่เหมาะอยู่แล้วให้ใช้ก่อน แล้วเลือกอาหารหรือรวมหลายชิ้นให้ฟื้นใกล้ HP ที่ขาดที่สุด เพราะส่วนที่ฟื้นเกินจะเสียเปล่า`;
    if (ctx.lang === "ja")
      return `エリア${stage}の通常販売食料${valueNote ? `：${valueNote}` : ""}。使える食料を持っていれば先に使い、不足HPに近い量を選ぶか組み合わせてください。超過分は無駄になります。`;
    return `Regular foods stocked in Area ${stage}${valueNote ? `: ${valueNote}` : ""}. Use suitable food you already own first, then choose or combine servings close to your missing HP; excess recovery is wasted.`;
  }
  function contextualFoodDecision(ctx, decision) {
    if (decision.id !== "food_hp_choice") return decision;
    const stage = Number(ctx.locationStage);
    if (!Number.isInteger(stage) || stage < 1 || stage > 6) return decision;
    const foods = stageFoodItems(ctx.allItems || [], stage);
    if (!foods.length) return decision;
    return {
      ...decision,
      foodAreaStage: stage,
      recommendation: {
        ...decision.recommendation,
        [ctx.lang]: areaFoodRecommendation(ctx, stage, foods)
      },
      items: foods.map((item) => ({ category: "food", id: item.id, note: foodItemNote(ctx, item) }))
    };
  }

  // src/pages/equipment/player-guidance.js
  function decisionCard(ctx, d) {
    d = d.id === "lure_coverage_pair" ? contextualLureCoverageDecision(ctx, d) : d;
    d = contextualFoodDecision(ctx, d);
    const marker = d.foodAreaStage ? ` data-food-area-choice="${d.foodAreaStage}"` : d.id === "lure_coverage_pair" ? " data-lure-coverage-pair" : "";
    const lureGuide = d.id === "lure_coverage_pair" ? lureCoverageGuide(ctx) : "";
    const nextAction = d.nextAction?.href ? `<p><a class="route-button" data-fly-backup-action href="${ctx.esc(d.nextAction.href)}">${ctx.esc(ctx.local(d.nextAction.label))} ↗</a></p>` : "";
    const choices = `<div class="decision-items">${(d.items || []).map(ctx.decisionLink).join("")}</div>`;
    return `<article class="decision-card"${marker}><h3>${ctx.esc(ctx.local(d.title))}</h3>${d.foodAreaStage ? choices : ""}<p class="decision-action">${ctx.esc(ctx.local(d.recommendation))}</p>${d.reason ? `<p>${ctx.esc(ctx.local(d.reason))}</p>` : ""}${d.foodAreaStage ? "" : choices}${d.scope ? `<small>${ctx.esc(ctx.local(d.scope))}</small>` : ""}${lureGuide}${nextAction}</article>`;
  }
  function lureCoverageGuide(ctx) {
    const link = document.getElementById("kit-link");
    const href = link?.getAttribute?.("href") || "";
    const label = ctx.player?.kitLink;
    if (!href || !label) return "";
    return `<p><a class="route-button" data-lure-coverage-guide href="${ctx.esc(href)}">${ctx.esc(label)} ↗</a></p>`;
  }
  function renderPlayerDecisionOverview(ctx) {
    const title = ctx.lang === "th" ? "ซื้ออะไร พกอะไร ทำอะไรก่อนตก" : ctx.lang === "ja" ? "買う・持つ・釣る前にすること" : "What to buy, carry and do before fishing";
    const tip = ctx.lang === "th" ? "ใช้ลัวร์หรือตีเหยื่อ: เติม HP ให้ถึง 100 ก่อน ถ้าอยากได้เวลาเล็งเต็มของคัน" : ctx.lang === "ja" ? "ルアー・投げ釣り：狙う時間を最大にするには、先にHPを100まで回復する。" : "Lure / casting: restore HP to 100 first to get your rod’s full time to aim.";
    const scope = ctx.lang === "th" ? "หลักฐานนี้ยืนยันผลเรื่องเวลาเล็ง ยังไม่ได้ยืนยันโบนัสโอกาสปลากินเหยื่อ" : ctx.lang === "ja" ? "狙う時間への効果は確認済み。食いつき率ボーナスは未確認。" : "This restores time to aim; a bite-rate bonus is not established.";
    const categoryLink = ctx.lang === "th" ? "ดูคำแนะนำของหมวดที่เลือกด้านบน" : ctx.lang === "ja" ? "選択中のカテゴリの案内を見る" : "See recommendations for the selected category above";
    const hasCategoryDisclosure = Boolean(
      document.getElementById("category-recommendations-disclosure")
    );
    document.getElementById("player-decisions").hidden = !!document.getElementById("fish-filter").value;
    document.getElementById("player-decisions").innerHTML = `<h2>${title}</h2><aside class="play-tip"><strong>${tip}</strong><p>${scope}</p><p>${catalogueHpRecoveryAction(ctx)}</p>${hasCategoryDisclosure ? `<p><a class="route-button" data-player-decisions-link href="#category-decisions">${categoryLink} ↗</a></p>` : ""}</aside>`;
    const link = document.querySelector?.("[data-player-decisions-link]");
    link?.addEventListener?.("click", () => {
      const disclosure = document.getElementById("category-recommendations-disclosure");
      if (disclosure) disclosure.open = true;
    });
  }
  function selectCategoryDecisions(ctx, category) {
    const style = document.getElementById("style-filter").value;
    const decisionStyles = {
      float_rod_path: "1",
      casting_rod_path: "2",
      lure_rod_path: "4",
      fly_rod_path: "8"
    };
    const selectedFish = document.getElementById("fish-filter").value;
    const showLureCoverage = category === "lure" && !selectedFish;
    const categoryChoices = ctx.decisions.filter((d) => {
      if (selectedFish) return false;
      const matchesCategory = category === "all" || d.category === category;
      const matchesStyle = category !== "rod" || !style || decisionStyles[d.id] === style;
      return matchesCategory && matchesStyle && !(showLureCoverage && d.id === "lure_coverage_pair");
    });
    return categoryChoices;
  }
  function renderCategoryDecisionDisclosure(ctx, category, categoryChoices) {
    const box = document.getElementById("category-decisions");
    const previous = box.querySelector?.("#category-recommendations-disclosure");
    const keepOpen = Boolean(previous?.open);
    const flyAdvice = ctx.flyDecision(category);
    const showLureCoverage = category === "lure" && !document.getElementById("fish-filter").value;
    const lureCoverage = showLureCoverage ? ctx.decisions.find((decision) => decision.id === "lure_coverage_pair") : null;
    const priceAdvice = category === "float_weight" ? ctx.floatPriceGuide() : category === "hook" ? ctx.hookPriceGuide() : "";
    const sections = [...categoryChoices.map(ctx.decisionCard), flyAdvice, priceAdvice].filter(
      Boolean
    );
    const body = sections.join("");
    const count = sections.length;
    const visibleLureCard = lureCoverage ? ctx.decisionCard(lureCoverage) : "";
    const copy3 = categoryDecisionCopy(ctx, category, count);
    box.innerHTML = visibleLureCard + (body ? `<details id="category-recommendations-disclosure" class="overview-disclosure category-recommendations"><summary>${ctx.esc(copy3.label)}</summary><div class="category-recommendations-content">${copy3.note}${body}</div></details>` : "");
    const disclosure = box.querySelector?.("#category-recommendations-disclosure");
    if (disclosure && (keepOpen || typeof location !== "undefined" && location.hash === "#category-decisions"))
      disclosure.open = true;
  }
  function renderDecisions(ctx, category) {
    const choices = selectCategoryDecisions(ctx, category);
    renderCategoryDecisionDisclosure(ctx, category, choices);
    renderPlayerDecisionOverview(ctx);
  }
  function hookPriceGuide(ctx) {
    const title = ctx.lang === "th" ? "เบ็ดหายหรือยังไม่มี? ซื้อเบ็ดทั่วไปที่ถูกสุดในด่านนี้" : ctx.lang === "ja" ? "針を失った・持っていない？現在エリアの最安の汎用針" : "Lost your hook or have none? Buy the cheapest stocked generic hook";
    const note = ctx.lang === "th" ? "ถ้ามีเบ็ดอยู่แล้วใช้ต่อได้ ซื้อเมื่อต้องเติมเบ็ดสำหรับชุดทุ่นหรือตะกั่ว ตารางนี้เทียบราคาเบ็ดที่ไม่ผูกกับปลาเฉพาะ ไม่ใช่อันดับดึงปลาสำเร็จ และไม่ต้องซื้อเบ็ดชุดเหยื่อสำหรับลัวร์หรือฟลาย" : ctx.lang === "ja" ? "所持している針はそのまま使えます。ウキ・オモリ仕掛けの針が必要な時だけ購入。魚ID一致分岐のない針の価格比較で、釣果順位ではありません。ルアー・フライ用にエサ釣りの針を買う必要はありません。" : "Keep the hook you own. Buy only when a float or sinker bait rig needs a hook. This compares prices of hooks without a species-match branch, not landing success. Do not buy a bait-rig hook for lure or fly fishing.";
    return `<section class="decision-card" id="hook-price-guide"><h3>${title}</h3><p>${note}</p><div class="table-wrap"><table><thead><tr><th>${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"}</th><th>${ctx.lang === "th" ? "ซื้อชิ้นนี้ถ้าต้องเติมเบ็ด" : ctx.lang === "ja" ? "針が必要なら購入" : "Buy if you need a hook"}</th></tr></thead><tbody>${[
      1,
      2,
      3,
      4,
      5,
      6
    ].map((stage) => {
      const row = ctx.gearPriceGuide.hook[stage], item = ctx.allItems.find((i) => i.category === row.category && i.id === row.id);
      return `<tr><td>${stage}</td><td><a data-hook-budget-stage="${stage}" href="${ctx.esc(ctx.areaItemLink(item, stage))}">${ctx.esc(ctx.itemName(item))} (${row.id}) · ¥${row.priceYen}</a></td></tr>`;
    }).join("")}</tbody></table></div></section>`;
  }
  function floatPriceGuide(ctx) {
    const fish = document.getElementById("fish-filter").value;
    const title = fish ? ctx.lang === "th" ? `ซื้อทุ่นหรือตะกั่วสำหรับ${ctx.fishName(fish)} ที่ไหน` : ctx.lang === "ja" ? `${ctx.fishName(fish)}に使えるウキ・オモリの販売エリア` : `Where to buy floats or sinkers for ${ctx.fishName(fish)}` : ctx.lang === "th" ? "ซื้อทุ่นหรือตะกั่วที่ไหนให้ถูกสุดในด่านนี้" : ctx.lang === "ja" ? "現在のエリアで最安のウキ・オモリを買う" : "Cheapest stocked float or sinker in your area";
    const note = fish ? ctx.lang === "th" ? `ถ้ามีของที่ใช้กับ${ctx.fishName(fish)} อยู่แล้วให้ใช้ต่อ ตารางแสดงเฉพาะของที่ผ่านเงื่อนไขปลานี้และมีบันทึกขายในแต่ละด่าน การผ่านเงื่อนไขไม่รับประกันว่าปลากินหรือจับขึ้นได้` : ctx.lang === "ja" ? `${ctx.fishName(fish)}に使える道具を持っていれば継続してください。表には魚の判定を通り、各エリアで販売記録がある品だけを表示します。適合は食いつきや釣果を保証しません。` : `Keep a model you already own for ${ctx.fishName(fish)}. The table lists only stocked items that pass this fish’s ROM profile check. Passing the check does not guarantee a bite or catch.` : ctx.lang === "th" ? "มีรุ่นเดิมอยู่แล้วใช้ต่อได้ ตารางนี้เลือกจากราคาของที่มีขาย ไม่ใช่อันดับจับปลา ทุ่นกับตะกั่วใช้คนละชุดปลา: เปิดรายละเอียดเพื่อตรวจปลาเป้าหมายก่อนซื้อ" : ctx.lang === "ja" ? "所持品はそのまま使えます。店頭価格による選択であり釣果順位ではありません。ウキとオモリの対応魚は違うため、購入前に詳細で魚を確認してください。" : "Keep the model you own. These choices use recorded shop prices, not catch rankings. Float and sinker routes accept different fish; check the item profile for your target before buying.";
    const none = ctx.lang === "th" ? "ไม่พบในสต็อกด่านนี้" : ctx.lang === "ja" ? "店頭記録なし" : "No recorded stock";
    const choice = (kind, stage) => {
      if (fish) return targetFloatChoice(ctx, kind, stage, fish);
      const row = ctx.gearPriceGuide[kind]?.[stage];
      if (!row) return `${none} · ${firstStockLink(ctx, kind)}`;
      const item = ctx.allItems.find((i) => i.category === row.category && i.id === row.id);
      return `<a href="${ctx.esc(ctx.areaItemLink(item, stage))}">${ctx.esc(ctx.itemName(item))} (${row.id}) · ¥${row.priceYen}</a>`;
    };
    return `<section class="decision-card" id="float-price-guide"><h3>${title}</h3><p>${note}</p><div class="table-wrap"><table><thead><tr><th>${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"}</th><th>${ctx.lang === "th" ? "ทุ่น" : ctx.lang === "ja" ? "ウキ" : "Float"}</th><th>${ctx.lang === "th" ? "ตะกั่ว" : ctx.lang === "ja" ? "オモリ" : "Sinker"}</th></tr></thead><tbody>${[1, 2, 3, 4, 5, 6].map((stage) => `<tr><td>${stage}</td><td>${choice("float", stage)}</td><td>${choice("sinker", stage)}</td></tr>`).join("")}</tbody></table></div></section>`;
  }
  function floatRigKind(item) {
    const id = Number.parseInt(item.id, 16);
    if (item.category !== "float_weight") return "";
    if (id >= 1 && id <= 8) return "float";
    if (id >= 9 && id <= 10) return "sinker";
    return "";
  }
  function stockedForArea(item, stage) {
    return (item.playerUse?.shops || []).some((shop) => Number(shop.stage) === stage);
  }
  function floatCandidatesForFish(ctx, kind, fish) {
    return ctx.allItems.filter(
      (item) => floatRigKind(item) === kind && (ctx.fishIdsFor(item) || []).includes(fish)
    );
  }
  function targetFloatOffer(ctx, kind, stage, candidates) {
    const stocked = candidates.filter((item2) => stockedForArea(item2, stage));
    const guide = ctx.gearPriceGuide[kind]?.[stage];
    const guideItem = stocked.find((item2) => item2.id === guide?.id);
    const item = guideItem || stocked.sort((a, b) => Number(a.priceYen) - Number(b.priceYen) || a.id.localeCompare(b.id))[0];
    if (!item) return null;
    return {
      item,
      priceYen: item.id === guideItem?.id ? Number(guide.priceYen) : Number(item.priceYen)
    };
  }
  function targetFloatChoice(ctx, kind, stage, fish) {
    const candidates = floatCandidatesForFish(ctx, kind, fish);
    if (!candidates.length) return incompatibleFloatText(ctx, kind, fish);
    const offer = targetFloatOffer(ctx, kind, stage, candidates);
    if (!offer) return noCompatibleFloatStockText(ctx, kind, stage, fish, candidates);
    return `<a data-target-float-offer="${kind}" data-target-fish="${ctx.esc(fish)}" href="${ctx.esc(ctx.areaItemLink(offer.item, stage))}">${ctx.esc(ctx.itemName(offer.item))} (${offer.item.id}) · ¥${offer.priceYen}</a>`;
  }
  function incompatibleFloatText(ctx, kind, fish) {
    const rig = kind === "float" ? ["ทุ่น", "ウキ", "float"] : ["ตะกั่ว", "オモリ", "sinker"];
    const fishName = ctx.fishName(fish);
    const text4 = ctx.lang === "th" ? `ไม่มี${rig[0]}ที่ผ่านเงื่อนไขปลา${fishName}ใน ROM` : ctx.lang === "ja" ? `この魚のROM判定を通る${rig[1]}はありません` : `No ${rig[2]} passes the ROM profile check for ${fishName}`;
    return `<span data-target-rig-incompatible="${kind}" data-target-fish="${ctx.esc(fish)}">${ctx.esc(text4)}</span>`;
  }
  function noCompatibleFloatStockText(ctx, kind, stage, fish, candidates) {
    const laterStages = [
      ...new Set(
        candidates.flatMap(
          (item) => (item.playerUse?.shops || []).map((shop) => Number(shop.stage)).filter((shopStage) => shopStage > stage)
        )
      )
    ].sort((a, b) => a - b);
    const nextStage = laterStages.find(
      (shopStage) => targetFloatOffer(ctx, kind, shopStage, candidates)
    );
    const nextOffer = nextStage ? targetFloatOffer(ctx, kind, nextStage, candidates) : null;
    if (!nextOffer) {
      return `<span data-no-compatible-float-stock data-target-fish="${ctx.esc(fish)}">${ctx.lang === "th" ? "ไม่มีของที่ผ่านเงื่อนไขปลาในสต็อกด่านนี้" : ctx.lang === "ja" ? "このエリアに魚の判定を通る在庫はありません" : "No stocked item in this area passes the fish check"}</span>`;
    }
    const message = ctx.lang === "th" ? `ด่าน ${stage} ไม่มีของที่ผ่านเงื่อนไขปลา; มีขายตั้งแต่ด่าน ${nextStage}` : ctx.lang === "ja" ? `エリア${stage}には適合品がありません。エリア${nextStage}から販売記録があります。` : `No matching stock in area ${stage}; recorded from area ${nextStage}.`;
    return `<span data-no-compatible-float-stock data-target-fish="${ctx.esc(fish)}">${ctx.esc(message)} <a data-target-float-next-stock="${kind}" data-target-fish="${ctx.esc(fish)}" href="${ctx.esc(ctx.areaItemLink(nextOffer.item, nextStage))}">${ctx.esc(ctx.itemName(nextOffer.item))} (${nextOffer.item.id}) · ¥${nextOffer.priceYen}</a></span>`;
  }
  function findFlyOffer(ctx, fish, stage) {
    const offers = ctx.allItems.filter((i) => i.category === "fly" && (ctx.useOf(i).fishIds || []).includes(fish)).flatMap(
      (i) => (ctx.useOf(i).shops || []).filter((s) => s.bundle).map((s) => ({ body: i, ...s }))
    ).sort((a, b) => a.bundle.shopPriceYen - b.bundle.shopPriceYen || a.stage - b.stage);
    const sameArea = offers.filter((o) => o.stage === stage);
    return { offer: (sameArea.length ? sameArea : offers)[0], sameArea };
  }
  function noReadyFlyCard(ctx, fish) {
    const title = ctx.lang === "th" ? "ปลานี้ควรใช้อะไร" : ctx.lang === "ja" ? "この魚には何を使うか" : "What to use for this fish";
    const note = ctx.lang === "th" ? "ยังไม่มีชุดฟลายสำเร็จรูปที่ผ่านเงื่อนไขให้แนะนำ เปิดหน้าปลาเพื่อเลือกวิธีตกและอุปกรณ์ที่รองรับ" : ctx.lang === "ja" ? "条件に合う店売り毛バリは案内できません。魚のページで対応する釣り方と道具を選んでください。" : "No qualifying ready-made fly is listed. Open this fish’s guide to choose a supported method and setup.";
    const action = ctx.lang === "th" ? "เลือกชุดตกสำหรับปลานี้" : ctx.lang === "ja" ? "対応する釣り方と道具を見る" : "Choose a setup for this fish";
    return `<article class="decision-card"><h3>${ctx.esc(title)}</h3><p>${ctx.esc(note)}</p><a class="route-button" data-fly-fallback="${ctx.esc(fish)}" href="${ctx.esc(ctx.fishHref(fish))}">${ctx.esc(action)} ↗</a></article>`;
  }
  function flyDecisionCopy(ctx, fish, offer, sameArea) {
    const b = offer.bundle, refs = [
      { category: "fly", id: b.body },
      { category: "fly_wing", id: b.wing },
      { category: "fly_tail", id: b.tail }
    ].filter((r) => r.id !== "00");
    const action = ctx.lang === "th" ? `สำหรับ${ctx.fishName(fish)} เริ่มลองชุดนี้ได้: ร้านฟลายด่าน ${offer.stage} ราคา ${b.shopPriceYen} เยนทั้งชุด` : ctx.lang === "ja" ? `${ctx.fishName(fish)}なら、この構成から試せる。エリア${offer.stage}の毛バリ店、完成品${b.shopPriceYen}円。` : `For ${ctx.fishName(fish)}, start with this ready-made fly: area ${offer.stage} fly shop, ¥${b.shopPriceYen} for the complete bundle.`;
    const reason = ctx.lang === "th" ? `เลือกชุดราคาต่ำสุดที่บอดี้ผ่านเงื่อนไขปลานี้${sameArea.length ? "ในด่านของแผนที่ที่เลือก" : ""} เพื่อลดเงินที่ต้องจ่าย ไม่ใช่เพราะพิสูจน์ว่าจับง่ายที่สุด` : ctx.lang === "ja" ? `ボディ判定に合う${sameArea.length ? "選択エリア内の" : ""}最安の店売り構成を選び、出費を抑える。釣果の最良構成ではない。` : `Lowest listed price among qualifying bodies${sameArea.length ? " in the selected fishing area" : ""}, to limit your spending; not a proven best-catching fly.`;
    const scope = ctx.lang === "th" ? "ยังมีเงื่อนไขซ่อนของบอดี้กับปีก ถ้าปลาไม่กิน การตีซ้ำไม่สุ่มค่านั้นใหม่ อย่าเหมาว่าราคาสูงกว่าจะดีกว่า" : ctx.lang === "ja" ? "隠しボディ・ウィング条件も残る。投げ直しでは再抽選されず、高価なほど良いとは限らない。" : "Hidden body/wing conditions still apply. Recasting does not reroll them; paying more is not an established advantage.";
    return {
      title: ctx.lang === "th" ? "ชุดฟลายสำหรับปลาที่เลือก" : ctx.lang === "ja" ? "選んだ魚の毛バリ候補" : "Fly to try for your selected fish",
      recommendation: action,
      reason,
      scope,
      items: refs
    };
  }
  function hasThreeBundleFlyBackup(ctx, fish) {
    const bundles = ctx.allItems.filter((item) => item.category === "fly" && (ctx.useOf(item).fishIds || []).includes(fish)).flatMap((item) => (ctx.useOf(item).shops || []).map((shop) => shop.bundle).filter(Boolean));
    const residue = (id) => Number.parseInt(id, 16) & 3;
    for (let first = 0; first < bundles.length; first += 1) {
      for (let second = first + 1; second < bundles.length; second += 1) {
        for (let third = second + 1; third < bundles.length; third += 1) {
          const choices = [bundles[first], bundles[second], bundles[third]];
          if (new Set(choices.map((bundle) => residue(bundle.body))).size === 3 && new Set(choices.map((bundle) => residue(bundle.wing))).size === 3)
            return true;
        }
      }
    }
    return false;
  }
  function flyBackupAction(ctx, fish) {
    const labels2 = {
      th: "ถ้าชุดเริ่มต้นติดเงื่อนไขซ่อน: ดูชุดสำรองของปลานี้ · ไม่รับประกันว่าปลากิน",
      en: "If the starter is blocked by the hidden check: see this fish’s backup sets · no bite guarantee",
      ja: "最初のセットが隠し判定でブロックされたら、この魚の予備セットを見る（食いつき保証ではありません）"
    };
    return hasThreeBundleFlyBackup(ctx, fish) ? { href: `${ctx.fishHref(fish)}#fly-backup`, label: labels2 } : null;
  }
  function flyDecision(ctx, category) {
    const fish = document.getElementById("fish-filter").value;
    if (!["flymaker", "all"].includes(category) || !fish) return "";
    const stage = Number(ctx.locationStage || (ctx.fishLocations[fish]?.locations || [])[0]?.stage);
    const { offer, sameArea } = findFlyOffer(ctx, fish, stage);
    if (!offer) return noReadyFlyCard(ctx, fish);
    const decision = flyDecisionCopy(ctx, fish, offer, sameArea);
    decision.nextAction = flyBackupAction(ctx, fish);
    return ctx.decisionCard(decision);
  }
  function rodAreaTableAlternatives(ctx, decision) {
    if (!decision?.alternatives?.length) return "";
    const fallbackStage = decision.status === "style-unstocked" ? decision.nextStockStage : 0;
    const links = decision.alternatives.map(
      (ref) => ctx.allItems.find(
        (candidate) => candidate.category === ref.category && candidate.id === ref.id
      )
    ).filter(Boolean).map((candidate) => {
      const href = fallbackStage ? withStage(ctx.itemHref(candidate), fallbackStage) : ctx.itemHref(candidate);
      const stage = fallbackStage ? ` data-stage="${fallbackStage}"` : "";
      return `<a data-rod-area-alternative="${ctx.esc(candidate.id)}"${stage} href="${ctx.esc(href)}">${ctx.esc(ctx.itemName(candidate))} (${ctx.esc(candidate.id)})${fallbackStage ? ` · ${ctx.esc(areaLabel(ctx, fallbackStage))}` : ""} ↗</a>`;
    }).join(" · ");
    if (!links) return "";
    return fallbackStage ? `<div data-rod-area-next-stock="${fallbackStage}">${links}</div>` : `<div data-rod-area-alternatives>${links}</div>`;
  }
  function rodTableAdvice(ctx, item, areaDecision) {
    const linkLabel = ctx.lang === "th" ? "ดูเงื่อนไขซื้อและคันที่เทียบ" : ctx.lang === "ja" ? "購入条件・比較候補を見る" : "See purchase conditions and alternatives";
    const advice = areaDecision || item.rodDecision;
    const marker = areaDecision ? ` data-rod-area-decision="${areaDecision.stage}" data-rod-area-status="${ctx.esc(areaDecision.status)}"` : "";
    const alternatives = rodAreaTableAlternatives(ctx, areaDecision);
    return `<td class="rod-table-advice"${marker}><strong>${ctx.esc(ctx.local(advice?.label))}</strong><a href="${ctx.esc(ctx.itemHref(item))}">${linkLabel} ↗</a>${alternatives}</td>`;
  }
  function rodComparisonRow(ctx, item, styles) {
    const selected = hasSelectedArea(ctx);
    const areaDecision = selected ? rodAreaDecision(ctx.lang, item, ctx.allItems, selected) : null;
    const stockPrice = areaDecision ? localRodOffer(areaDecision) ? ctx.formatYen(item) : ctx.lang === "th" ? `${areaLabel(ctx, selected)}: ไม่พบรายการขายที่บันทึกไว้` : ctx.lang === "ja" ? `${areaLabel(ctx, selected)}：販売記録なし` : `${areaLabel(ctx, selected)}: no offer recorded` : ctx.useOf(item).shops?.length ? ctx.formatYen(item) : ctx.lang === "th" ? "ไม่พบในร้าน" : ctx.lang === "ja" ? "店頭在庫なし" : "No recorded shop stock";
    const rowMarker = areaDecision ? ` data-rod-area-decision="${selected}" data-rod-area-status="${ctx.esc(areaDecision.status)}"${localRodOffer(areaDecision) ? ' data-selected-area-offer="true"' : ""}` : "";
    return `<tr${rowMarker}><td><a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(ctx.itemName(item))}</a></td><td>${ctx.esc(styles[item.decodedFields.styleCode])}</td><td>${item.decodedFields.castAimHoldCutoffInternal}</td><td>${item.decodedFields.rangeMultiplier}</td><td>${ctx.esc(stockPrice)}</td>${rodTableAdvice(ctx, item, areaDecision)}</tr>`;
  }
  function renderComparison(ctx, category) {
    const box = document.getElementById("rod-comparison");
    if (category !== "rod") {
      box.innerHTML = "";
      return;
    }
    const rods2 = ctx.allItems.filter((item) => item.category === "rod");
    const wasOpen = Boolean(box.querySelector?.(".comparison")?.open);
    const styles = ctx.lang === "th" ? { 1: "ทุ่น / อายุ", 2: "ตีเหยื่อ", 4: "ลัวร์", 8: "ฟลาย" } : ctx.lang === "ja" ? { 1: "ウキ・アユ", 2: "投げ", 4: "ルアー", 8: "フライ" } : { 1: "Float / Ayu", 2: "Casting", 4: "Lure", 8: "Fly" };
    box.innerHTML = `<details id="rod-comparison-details" class="overview-disclosure comparison"${wasOpen ? " open" : ""}><summary>${ctx.esc(ctx.player.compare)} · ${rods2.length}</summary><p>${ctx.lang === "th" ? "เวลาเล็งมาก = ขยับเป้าหมายได้นานขึ้น; สายขาดยากมาก = ปลาดึงหนีได้ไกลกว่าก่อนอุปกรณ์หลุด ตัวเลขใช้เทียบกันเท่านั้น ไม่ใช่เมตรหรือคะแนนพลัง และปลายังหนีด้วยวิธีอื่นได้" : ctx.lang === "ja" ? "狙う時間が大きいほど、狙いを動かせる時間が長い。糸の切れにくさが大きいほど、魚が遠くまで引いても道具を失いにくい。数値は比べるためのもので、メートルや強さではない。他の逃げ方もある。" : "More aim time lets you move the target longer. A higher line strength means the fish can pull farther before tackle is lost. The numbers are only for comparing rods, not metres or power. Fish can still escape other ways."}</p><div class="table-wrap"><table><thead><tr><th>${ctx.esc(ctx.copy.item)}</th><th>${ctx.esc(ctx.player.style)}</th><th>${ctx.esc(ctx.player.aim)}</th><th>${ctx.esc(ctx.player.reach)}</th><th>${ctx.lang === "th" ? "ราคาซื้อ" : ctx.lang === "ja" ? "購入価格" : "Purchase price"}</th><th>${ctx.lang === "th" ? "คำแนะนำ" : ctx.lang === "ja" ? "選び方" : "Recommendation"}</th></tr></thead><tbody>${rods2.slice().sort(
      (a, b) => a.decodedFields.styleCode - b.decodedFields.styleCode || b.decodedFields.rangeMultiplier - a.decodedFields.rangeMultiplier
    ).map((item) => rodComparisonRow(ctx, item, styles)).join("")}</tbody></table></div></details>`;
  }
  function firstStockLink(ctx, kind) {
    const first = Object.entries(ctx.gearPriceGuide[kind] || {}).filter(([, row2]) => row2).sort(([a], [b]) => Number(a) - Number(b))[0];
    if (!first) return "";
    const [stage, row] = first;
    const item = ctx.allItems.find((entry) => entry.category === row.category && entry.id === row.id);
    if (!item) return "";
    const label = ctx.lang === "th" ? `ดูสต็อกแรก: ด่าน ${stage}` : ctx.lang === "ja" ? `最初の在庫：エリア${stage}` : `First stock: area ${stage}`;
    return `<a data-first-stock="${kind}" href="${ctx.esc(ctx.areaItemLink(item, stage))}">${ctx.esc(label)} · ¥${row.priceYen}</a>`;
  }

  // src/pages/equipment/item-use.js
  function fishMealAdvice(ctx) {
    return {
      summary: fishMealSummary(ctx.lang),
      facts: fishMealFacts(ctx.lang)
    };
  }
  function decisionAdvice(ctx, decision) {
    return {
      summary: ctx.local(decision.recommendation),
      facts: []
    };
  }
  function flyWingAdvice(ctx) {
    const summary = ctx.lang === "th" ? "ประกอบเองให้เลือกจากรูปปีกที่ร้านเสนอ ไม่ต้องเตรียมชิ้นส่วนไปเอง ตรวจราคาสุทธิก่อนจ่าย ยังไม่มีหลักฐานว่าปีกแพงเพิ่มโอกาสจับปลา" : ctx.lang === "ja" ? "自作するなら店のウィング画像から選ぶ。部品の持参は不要。支払前に最終見積額を確認する。高価なウィングの釣果優位は未確認。" : "Choose from the maker’s wing pictures; you do not need to bring components. Check the final quote before paying. An expensive wing has no established catch advantage.";
    const fact = ctx.lang === "th" ? "เกมมีเงื่อนไขซ่อนที่ตรวจบอดี้กับปีก ถ้าปลาไม่กิน การตีชุดเดิมซ้ำไม่ได้สุ่มเงื่อนไขนี้ใหม่ รายละเอียดอยู่ในหลักฐาน" : ctx.lang === "ja" ? "隠しボディ・ウィング条件は同じ構成の投げ直しでは再抽選されない。詳細は根拠を参照。" : "Recasting the same setup does not reroll the hidden body/wing condition; details are in the evidence.";
    return { summary, facts: [fact] };
  }
  function flyTailAdvice(ctx) {
    return {
      summary: ctx.lang === "th" ? "เลือกหางนี้ถ้าชอบรูปและยอมรับราคาเสนอ หรือเลือก “ไม่มี” ในเมนูประกอบที่มีตัวเลือกนั้น ยังไม่มีหลักฐานว่าหางนี้เพิ่มโอกาสจับปลา" : ctx.lang === "ja" ? "見た目と見積額で選ぶ。「無し」がある作成画面では省略できる。このテールの釣果ボーナスは確認していない。" : "Choose this tail for its appearance and quoted price, or choose “None” where the maker offers it. A catch advantage from this tail is not established.",
      facts: []
    };
  }
  function genericUse(ctx, item, use) {
    return {
      summary: ctx.local(use.summary) || ctx.player.desc[ctx.groupOf(item)],
      facts: use.specialResponseTarget ? [] : use.facts?.[ctx.lang] || use.facts?.en || []
    };
  }
  function visibleUse(ctx, item) {
    const use = ctx.useOf(item);
    const foodDecision = foodAreaDecision(ctx.lang, item, ctx.locationStage);
    if (foodDecision) return { summary: foodDecision.summary, facts: use.facts?.[ctx.lang] || [] };
    if (item.category === "food" && item.id === "08") return fishMealAdvice(ctx);
    if (item.category === "fly_wing") {
      const fish = document.getElementById("fish-filter")?.value || "";
      const decision2 = flyWingPlayerDecision(
        ctx.lang,
        item,
        ctx.allItems,
        fish,
        fish ? ctx.fishName(fish) : ""
      );
      if (decision2) return { summary: decision2.recommendation, facts: [decision2.reason] };
    }
    const decision = item.baitLureDecision || item.gearDecision || item.rodDecision;
    if (decision) return decisionAdvice(ctx, decision);
    if (item.category === "hook" || item.category === "float_weight")
      return { summary: ctx.local(use.summary), facts: use.facts?.[ctx.lang] || [] };
    if (item.category === "fly_wing") return flyWingAdvice(ctx);
    if (item.category === "fly_tail") return flyTailAdvice(ctx);
    return genericUse(ctx, item, use);
  }
  function fishHeading(ctx, item) {
    return item.category === "general_tool" && ["08", "09", "0A"].includes(item.id) ? ctx.lang === "th" ? "ปลาและสัตว์ที่ชี้ทิศเข้าหาจุดโปรยได้" : ctx.lang === "ja" ? "寄せエサへ誘導できる魚・生き物" : "Creatures steered toward groundbait" : ctx.player.compatible;
  }
  function fishList(ctx, item) {
    if (item.category === "rod") return "";
    const use = ctx.useOf(item), ids = ctx.fishIdsFor(item);
    const targets = use.targetMatches ? Array.isArray(use.targetMatches) ? use.targetMatches : [use.targetMatches] : [];
    if (!ids.length && !targets.length) return "";
    const chip = (id) => {
      id = String(id).replace(/^0x/i, "").toUpperCase().padStart(2, "0");
      const f = ctx.fishVisuals[id] || {};
      return `<a class="fish-chip" data-entity="fish" href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(ctx.fishName(id))} — ${ctx.detailLabel}">${f.image ? `<img loading="lazy" src="${ctx.esc(f.image)}" alt="">` : ""}<span>${ctx.esc(ctx.fishName(id))}</span><small>${ctx.detailLabel} ↗</small></a>`;
    };
    if (!ids.length) return "";
    return `<div class="compatible-fish"><p class="fish-scope">${ctx.esc(item.category === "bait" ? ctx.lang === "th" ? `สำหรับ${ctx.baitRoute === "float" ? "ชุดทุ่น" : "ชุดตะกั่ว"} — ผ่านเงื่อนไขรับเหยื่อ ยังต้องวางเหยื่อให้เจอปลาและดึงขึ้นสำเร็จ` : ctx.lang === "ja" ? `${ctx.baitRoute === "float" ? "ウキ" : "オモリ"}仕掛けのエサ判定に適合。位置・タイミング・取り込みも必要。` : `${ctx.baitRoute === "float" ? "Float" : "Sinker"} rig: passes bait-acceptance conditions; position, timing and landing still matter.` : ctx.local(use.fishScope))}</p><div class="fish-chips">${ids.slice(0, 6).map(chip).join("")}</div>${ids.length > 6 ? `<details class="more-fish"><summary>${ctx.esc(ctx.player.more)} (${ids.length})</summary><div class="fish-chips">${ids.slice(6).map(chip).join("")}</div></details>` : ""}</div>`;
  }

  // src/pages/equipment/shop-locations.js
  function shopLink(ctx, item, stage, area) {
    const query = new URLSearchParams({
      stage: String(stage),
      place: "town",
      category: item.category,
      id: item.id,
      return: ctx.sourceReturn()
    });
    const fish = document.getElementById("fish-filter").value;
    if (ctx.fishingContext(item) && fish) {
      query.set("fish", fish);
      query.set("route", ctx.baitRoute);
    }
    const href = `${ctx.detailFile("shops")}?${query}`;
    return `<a href="${ctx.esc(href)}">${ctx.esc(area + " " + stage)} ↗</a>`;
  }
  function stageLinks(ctx, item, shops, predicate, area) {
    const stages2 = [...new Set(shops.filter(predicate).map((shop) => shop.stage))];
    return stages2.map((stage) => shopLink(ctx, item, stage, area)).join(" · ");
  }
  function shopCondition(ctx, shops) {
    if (!shops.some((shop) => shop.condition)) return "";
    return ctx.lang === "th" ? "ขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนเพื่อให้เหยื่อล่อปลาอายุปรากฏในร้านด่าน 3 เมื่อซื้อ จำนวนในช่องเต็มเป็น 9 ชิ้น และจำนวนปลาอายุที่ขายสะสมลดลง 9 (ต่ำสุด 0) ถ้าสินค้าหายจากเมนู ให้ขายปลาอายุเพิ่ม" : ctx.lang === "ja" ? "びくからアユを1匹以上売るとエリア3でオトリアユが販売される。購入で所持数は9個、売却数カウンターは9減る（最低0）。消えたらアユを追加で売る。" : "Sell at least one Ayu from your keepnet to enable decoy Ayu in area 3. Buying sets the stack to 9 and reduces the sold-Ayu counter by 9 (minimum 0). If the offer disappears, sell more Ayu.";
  }
  function bundleParts(ctx, bundle) {
    return [
      ["fly", bundle.body],
      ["fly_wing", bundle.wing],
      ["fly_tail", bundle.tail]
    ].filter(([, id]) => id !== "00").map(
      ([category, id]) => ctx.allItems.find((item) => item.category === category && item.id === id)
    ).filter(Boolean);
  }
  function flyBundleMarkup(ctx, parts, stage, price, area) {
    const images = parts.map(
      (part) => `<a href="${ctx.esc(ctx.itemHref(part))}"><img loading="lazy" src="${ctx.esc(part.image)}" alt="${ctx.esc(ctx.itemName(part))}" title="${ctx.esc(ctx.itemName(part))} ID ${part.id}"></a>`
    ).join("");
    const names = parts.map(
      (part) => `<a href="${ctx.esc(ctx.itemHref(part))}">${ctx.esc(ctx.itemName(part))} (${part.id})</a>`
    ).join(" + ");
    return `<div><strong>${area} ${stage} · ¥${price}</strong><p>${images}</p><small>${names}</small></div>`;
  }
  function flyBundles(ctx, item, shops, area) {
    if (!item.category.startsWith("fly")) return "";
    const title = ctx.lang === "th" ? "ดูชุดฟลายสำเร็จรูปและราคาทั้งชุด" : ctx.lang === "ja" ? "店売り毛バリの組み合わせと価格" : "Ready-made fly combinations and full prices";
    const bundles = shops.filter((shop) => shop.bundle).map((shop) => {
      const parts = bundleParts(ctx, shop.bundle);
      return flyBundleMarkup(ctx, parts, shop.stage, shop.bundle.shopPriceYen, area);
    }).join("");
    return `<details class="bundle-offers"><summary>${title}</summary>${bundles}</details>`;
  }
  function missingShopMessage(ctx) {
    return ctx.lang === "th" ? "ไม่พบรหัสนี้ในสต็อกร้านทั้ง 6 ด่านที่ถอดได้ จึงยังไม่มีจุดซื้อให้แนะนำสำหรับชิ้นนี้" : ctx.lang === "ja" ? "復号した全6エリアの店の在庫にはこのIDがなく、この部品の購入場所は案内できない。" : "This ID is absent from the decoded stocks of all six area shops, so no purchase location is listed for this record.";
  }
  function emptyShopLocations(ctx, item) {
    if (!Object.hasOwn(ctx.useOf(item), "shops") || !["rod", "float_weight"].includes(item.category))
      return "";
    return `<div class="shop-locations"><p>${missingShopMessage(ctx)}</p></div>`;
  }
  function shopLocations(ctx, item) {
    const shops = ctx.useOf(item).shops || [];
    if (!shops.length) return emptyShopLocations(ctx, item);
    const area = ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area";
    const regular = stageLinks(ctx, item, shops, (shop) => shop.shop !== "special_rod_shop", area);
    const special = stageLinks(ctx, item, shops, (shop) => shop.shop === "special_rod_shop", area);
    const regularLabel = item.category.startsWith("fly") ? ctx.lang === "th" ? "ชิ้นส่วนนี้อยู่ในชุดฟลายสำเร็จรูปที่ร้านขาย" : ctx.lang === "ja" ? "この部品を含む店売り毛バリ" : "Part included in a ready-made fly sold by the shop" : ctx.lang === "th" ? "ร้านค้าในเมือง" : ctx.lang === "ja" ? "町の店" : "Town shop";
    const specialLabel = ctx.lang === "th" ? "ร้านคันเบ็ดพิเศษในเมือง" : ctx.lang === "ja" ? "町の専用竿店" : "Special rod merchant in town";
    const condition = shopCondition(ctx, shops);
    const bundles = flyBundles(ctx, item, shops, area);
    return `<div class="shop-locations">${regular ? `<p>${regularLabel} · ${regular}</p>` : ""}${special ? `<p>${specialLabel} · ${special}</p>` : ""}${condition ? `<p>${condition}</p>` : ""}${bundles}</div>`;
  }

  // src/pages/equipment/item-actions.js
  function baitLurePriceChoices(ctx, item) {
    const rows = Object.entries(item.baitLureDecision?.cheaperByStage || {});
    if (!rows.length) return "";
    const groups = /* @__PURE__ */ new Map();
    for (const [stage, refs] of rows) {
      const key = JSON.stringify(refs);
      if (!groups.has(key)) groups.set(key, { stages: [], refs });
      groups.get(key).stages.push(stage);
    }
    const title = ctx.lang === "th" ? "ถ้าซื้อใหม่: ตัวเลือกถูกกว่าแยกตามด่าน" : ctx.lang === "ja" ? "新規購入：エリア別の安い候補" : "Buying new: cheaper choices by area";
    const area = ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area";
    return `<aside class="detail-section" data-bait-lure-prices><h4>${title}</h4>${[
      ...groups.values()
    ].map(
      (group) => `<p><strong>${area} ${group.stages.join(" / ")}</strong> · ${group.refs.map((ref) => {
        const other = ctx.allItems.find((i) => i.category === ref.category && i.id === ref.id);
        return other ? `<a href="${ctx.esc(ctx.areaItemLink(other, group.stages.includes(String(ctx.locationStage)) ? ctx.locationStage : group.stages[0]))}">${ctx.esc(ctx.itemName(other))} (${ctx.esc(other.id)}) · ¥${ctx.esc(ref.priceYen)} ↗</a>` : "";
      }).join(" / ")}</p>`
    ).join("")}</aside>`;
  }
  function areaItemLink(ctx, item, stage, hash = "", pointReturn = "") {
    const [page, query] = ctx.itemHref(item).split("?");
    const params = new URLSearchParams(query);
    params.set("stage", String(stage));
    params.set("route", ctx.baitRoute);
    if (pointReturn) params.set("return", pointReturn);
    return page + "?" + params + hash;
  }
  function compassUseChoice(ctx, item) {
    if (item.category !== "general_tool" || item.id !== "0E") return "";
    const locations = item.playerUse?.useLocations || [];
    if (!locations.length) return "";
    const label = ctx.lang === "th" ? "หลงทาง? ดูจุดออกของด่านที่อยู่" : ctx.lang === "ja" ? "迷ったら現在エリアの出口地点を見る" : "Lost? See the exit point for your current area";
    return `<aside class="detail-section compass-exit-choice" data-compass-exit-choice><h3>${label}</h3><p>${ctx.lang === "th" ? "เลือกด่าน แล้วดูรูปแม่เหล็กที่ชี้จุดทางเชื่อม เข็มจะหยุดเมื่อถึงช่องเป้าหมาย แต่คำบอกทิศไม่ใช่เส้นทางหลบสิ่งกีดขวาง" : ctx.lang === "ja" ? "エリアを選び、磁石画像が示す連絡路の地点を確認します。目標タイルで針が止まりますが、方角表示は障害物を避ける経路案内ではありません。" : "Choose an area and find the connecting-route point marked by the magnet portrait. The needle stops at its target tile; the heading does not supply a route around obstacles."}</p>${locations.map((loc) => `<p><a data-compass-location href="${ctx.esc(ctx.areaItemLink(item, loc.stage, "#compass-exit-" + loc.stage))}">${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"} ${loc.stage} · ${ctx.lang === "th" ? "ดูจุดที่เข็มหยุด" : ctx.lang === "ja" ? "針が止まる地点を見る" : "See where the needle stops"} ↗</a></p>`).join("")}</aside>`;
  }
  function gatheredBaitChoices(ctx, item) {
    if (!item.gatheredBaitByArea) return "";
    const title = ctx.lang === "th" ? "เหยื่อที่ตาข่ายหาได้: เลือกดูว่าใช้ตกปลาอะไร" : ctx.lang === "ja" ? "金アミで採れるエサ：対応魚を見る" : "Baits gathered with the net: see which fish accept them";
    return `<section class="detail-section gathered-bait"><h3>${title}</h3>${item.playerUse?.useLocations?.some((l) => l.kind === "runtime_net_use") ? `<p class="net-location-choice" data-net-location-choice><a href="${ctx.esc(ctx.areaItemLink(item, 1, "#use-locations"))}">${ctx.lang === "th" ? "ด่าน 1: ดูภาพช่องน้ำตื้นที่ทดลองใช้ตาข่ายสำเร็จ" : ctx.lang === "ja" ? "エリア1：アミ使用に成功した浅瀬を見る" : "Area 1: see the shallow tile where net use succeeded"} ↗</a><br>${ctx.lang === "th" ? "ยังไม่ยืนยันเส้นทางเดินจากทางเข้า; หากไปถึงช่องนี้แล้วจึงใช้ตำแหน่งนี้ได้" : ctx.lang === "ja" ? "入口からの経路は未確認。このタイルに到達した場合の使用地点です。" : "The walking route from the entrance remains unconfirmed; use this location if you reach the tile."}</p>` : ""}${Object.entries(
      item.gatheredBaitByArea
    ).map(([stage, id]) => {
      const bait = ctx.allItems.find((i) => i.category === "bait" && i.id === id);
      return `<p>${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"} ${stage} · <a data-gathered-bait href="${ctx.esc(ctx.areaItemLink(bait, stage))}">${ctx.esc(ctx.itemName(bait))} (${id}) ↗</a></p>`;
    }).join("")}</section>`;
  }
  function baitGatherChoice(ctx, item) {
    if (!item.netGatherArea) return "";
    const note = ctx.lang === "th" ? `ถ้ามีตาข่ายสีทองอยู่แล้ว หาเหยื่อนี้ได้ในด่าน ${item.netGatherArea}: ยืนในน้ำตื้น ใช้ตาข่าย แล้วขยับช่องก่อนใช้ซ้ำ แทนการซื้อเหยื่อเพิ่ม` : ctx.lang === "ja" ? `金アミを持っているならエリア${item.netGatherArea}の浅瀬でこのエサを採れます。浅瀬に立って使い、次は別のタイルへ移動してください。追加購入の代わりになります。` : `If you already own the gold net, gather this bait in area ${item.netGatherArea} instead of buying more: stand in shallow water, use the net, then move to a new tile before using it again.`;
    const label = ctx.lang === "th" ? "ดูวิธีใช้ตาข่ายและจำนวนที่เก็บได้" : ctx.lang === "ja" ? "金アミの使い方と採れる個数を見る" : "See net use and gathering amounts";
    return `<aside class="detail-section bait-gather-choice" data-bait-gather-choice><p>${ctx.esc(note)}</p><a href="${ctx.esc(
      ctx.areaItemLink(
        ctx.allItems.find((i) => i.category === "general_tool" && i.id === "04"),
        item.netGatherArea,
        item.netGatherArea === 1 ? "#use-locations" : ""
      )
    )}">${label} ↗</a></aside>`;
  }
  function forageBaitChoice(ctx, item, items) {
    if (item.category !== "bait") return "";
    const fish = document.getElementById("fish-filter").value, routeIds = item.playerUse?.fishIdsByRoute?.[ctx.baitRoute];
    if (fish && routeIds && !routeIds.includes(fish)) return "";
    const glass = items.find((i) => i.category === "general_tool" && i.id === "03");
    const points = (glass?.playerUse?.useLocations || []).filter(
      (loc) => loc.forage && (loc.markerItems || []).some((ref) => ref.category === "bait" && ref.id === item.id)
    );
    const stages2 = [...new Set(points.map((loc) => Number(loc.stage)))];
    if (!stages2.length) return "";
    const shown = ctx.locationStage && stages2.includes(Number(ctx.locationStage)) ? [Number(ctx.locationStage)] : stages2;
    const note = ctx.lang === "th" ? "ถ้ามีแว่นขยายอยู่แล้ว ลองหาเหยื่อนี้แทนการซื้อเพิ่ม: ไปถึงช่องตัวอย่างแล้วใช้แว่นขยาย ขยับช่องก่อนค้นซ้ำ บางช่องมีผลลัพธ์ได้สองชนิด จึงไม่รับประกันว่าจะได้ชนิดนี้ทุกครั้ง" : ctx.lang === "ja" ? "虫メガネを持っているなら、追加購入の代わりに探索できます。地点例で使い、再探索前に移動してください。2種類の候補がある地点では毎回このエサが出るとは限りません。" : "If you already own the magnifying glass, try gathering instead of buying more: use it at an example tile and move before searching again. Some tiles have two possible results, so this bait is not guaranteed every time.";
    return `<aside class="forage-bait-choice" data-forage-bait-choice><p>${ctx.esc(note)}</p>${shown.map((stage) => {
      const loc = points.find((point) => Number(point.stage) === stage);
      return `<p><a data-forage-bait href="${ctx.esc(ctx.areaItemLink(glass, stage, "#forage-stage-" + stage + "-context-" + Number(loc.context)))}">${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"} ${stage} · ${ctx.lang === "th" ? "ดูภาพจุดตัวอย่างหาเหยื่อนี้" : ctx.lang === "ja" ? "このエサの探索地点例を見る" : "See an example search tile for this bait"} ↗</a></p>`;
    }).join("")}</aside>`;
  }
  function daikonFishChoice(ctx, item) {
    if (!item.exchangeFishId) return "";
    const fishLabel = item.exchangeFishId === "22" ? ctx.lang === "th" ? "ฮาริโยะ" : ctx.lang === "ja" ? "ハリヨ" : "Hariyo" : ctx.lang === "th" ? "ปลายามาโนะคามิ" : ctx.lang === "ja" ? "ヤマノカミ" : "Yamanokami";
    const label = ctx.lang === "th" ? "ดู" + fishLabel + ": จุดตกและเหยื่อ" : ctx.lang === "ja" ? fishLabel + "の場所・エサを確認" : "See " + fishLabel + " locations and bait";
    const href = `${ctx.detailFile("fish")}?id=${item.exchangeFishId}&stage=${item.tubExchange ? 2 : 3}&return=${encodeURIComponent(ctx.sourceReturn())}`;
    return `<aside class="detail-section daikon-fish-choice" ${item.tubExchange ? "data-tub-choice" : "data-daikon-choice"}><a class="route-button" href="${ctx.esc(href)}">${ctx.esc(label)} ↗</a></aside>`;
  }
  function keepnetAlternatives(ctx, item, items) {
    if (!item.keepnetCapacity) return "";
    const quest = items.find((candidate) => candidate.category === "food" && candidate.id === "07");
    const questLabel = ctx.lang === "th" ? "จะเก็บยามาโนะคามิแลกหัวไชเท้า? อ่านผลต่ออาหารก่อน" : ctx.lang === "ja" ? "ヤマノカミを大根交換用に残す？ 食料への影響を先に確認" : "Keeping Yamanokami for Daikon? Read the food-inventory effect first";
    const questLink = quest ? `<p><a href="${ctx.esc(ctx.itemHref(quest))}">${ctx.esc(questLabel)} ↗</a></p>` : "";
    const title = ctx.lang === "th" ? "เทียบข้องขนาดอื่น" : ctx.lang === "ja" ? "他のびくと比較" : "Compare keepnet sizes";
    return `<aside class="detail-section keepnet-alternatives" data-keepnet-choice><h3>${ctx.esc(title)}</h3>${items.filter((candidate) => candidate.keepnetCapacity && candidate.id !== item.id).map(
      (candidate) => `<p><a href="${ctx.esc(ctx.itemHref(candidate))}">${ctx.esc(ctx.itemName(candidate))} · ${candidate.keepnetCapacity} ${ctx.lang === "th" ? "ตัว" : ctx.lang === "ja" ? "匹" : "fish"} · ¥${candidate.priceYen} ↗</a></p>`
    ).join("")}${questLink}</aside>`;
  }
  function mushroomAlternative(ctx, item) {
    if (!(item.category === "food" && ["09", "0A"].includes(item.id) || item.category === "general_tool" && item.id === "03"))
      return "";
    return `<p><a class="route-button" data-mushroom-alternative href="${ctx.esc(ctx.itemHref(ctx.allItems.find((i) => i.category === "food" && i.id === "01")))}">${ctx.lang === "th" ? "ดูส้ม: ฟื้น 5 HP ราคา ¥5 พร้อมร้านที่ขาย" : ctx.lang === "ja" ? "みかんを見る：5HP回復・5円、販売場所付き" : "See oranges: restore 5 HP for ¥5, with shops"} ↗</a></p>`;
  }
  function acquisitionChoice(ctx, item) {
    const entries = item.acquisitionOptions || [];
    if (!entries.length) return "";
    const title = item.playerUse?.shops?.length ? ctx.lang === "th" ? "รับจากหีบก่อนซื้อซ้ำ" : ctx.lang === "ja" ? "重複購入の前に宝箱から入手" : "Check the chest before buying another copy" : ctx.lang === "th" ? "รับไอเท็มนี้จากหีบ" : ctx.lang === "ja" ? "この道具を宝箱から入手" : "Get this item from a chest";
    const open = ctx.lang === "th" ? "ดูจุดรับของและทางเข้าเมือง" : ctx.lang === "ja" ? "入手地点と町の入口を見る" : "See the reward location and town entrance";
    return `<aside class="shop-locations acquisition-choice" data-acquisition-choice><h4>${title}</h4>${entries.map((loc) => `<p><strong>${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"} ${loc.stage}</strong> · ${ctx.esc(ctx.local(loc.name))}</p><p>${ctx.esc(ctx.local(loc.action))}</p>`).join("")}<a href="${ctx.esc(ctx.itemHref(item))}#use-locations">${open} ↗</a></aside>`;
  }
  function flyBundlePartFor(ctx, item, fish) {
    const part = item.category === "fly_wing" ? "wing" : "tail";
    return ctx.allItems.some(
      (body) => body.category === "fly" && (ctx.useOf(body).fishIds || []).includes(fish) && (ctx.useOf(body).shops || []).some((shop) => shop.bundle?.[part] === item.id)
    );
  }
  function gearNextActions(ctx, item) {
    if (!item.gearDecision) return "";
    const guideLink = (category, marker) => {
      const href = categoryGuideLink({
        lang: ctx.lang,
        category,
        fish: document.getElementById("fish-filter")?.value,
        stage: ctx.locationStage,
        route: ctx.baitRoute,
        returnPath: ctx.sourceReturn()
      });
      const label = category === "hook" ? ctx.lang === "th" ? "เบ็ดหายหรือยังไม่มี? ดูเบ็ดทั่วไปที่ถูกสุดทั้งหกด่าน" : ctx.lang === "ja" ? "針を失った・持っていない？6エリアの最安汎用針を見る" : "Lost your hook or have none? See the cheapest generic hook in each area" : ctx.lang === "th" ? "ดูทุ่นและตะกั่วราคาต่ำสุดแยกทั้งหกด่าน" : ctx.lang === "ja" ? "6エリアの最安ウキ・オモリを見る" : "See the cheapest float and sinker in each of six areas";
      return `<p><a class="route-button" data-${marker}-price-guide href="${ctx.esc(href)}">${label} ↗</a></p>`;
    };
    if (item.category === "float_weight") return guideLink("float_weight", "float");
    const ids = (item.gearDecision.targetFish || []).filter((id) => ctx.fishVisuals[id]);
    const hookBudget = item.category === "hook" ? guideLink("hook", "hook") : "";
    if (item.category === "hook" && !ids.length) return hookBudget;
    if (item.category === "hook" && ids.length)
      return hookBudget + `<p>${ctx.lang === "th" ? "ดูเหยื่อและจุดตกของปลาที่ชื่อเบ็ดอ้างถึง" : ctx.lang === "ja" ? "ハリ名の魚のエサ・場所を見る" : "Bait and locations for the fish named by this hook"}: ${ids.map((id) => `<a href="${ctx.esc(ctx.fishHref(id))}">${ctx.esc(ctx.fishName(id))} ↗</a>`).join(" · ")}</p>`;
    if (item.category.startsWith("fly")) {
      const id = document.getElementById("fish-filter").value;
      if (id && !ctx.allItems.some(
        (candidate) => candidate.category === "fly" && ctx.useOf(candidate).fishIds?.includes(id)
      ))
        return `<p><a data-fly-next href="${ctx.esc(ctx.fishHref(id))}">${ctx.lang === "th" ? "ปลานี้ไม่ผ่านเงื่อนไขฟลาย: ดูเหยื่อและวิธีอื่น" : ctx.lang === "ja" ? "この魚はフライ判定に不適合：他の釣法を見る" : "This fish fails the fly profile check: see other methods"} ↗</a></p>`;
      if (!id && item.category === "fly")
        return `<p>${ctx.lang === "th" ? "เลือกปลาในรายชื่อด้านล่าง แล้วดูจุดตกและชุดฟลายในหน้าปลา" : ctx.lang === "ja" ? "下の魚一覧から選び、魚ページで場所と毛バリ候補を見る。" : "Choose a fish below, then see locations and flies on its profile."}</p>`;
      return `<p><a data-fly-next href="${ctx.esc(id ? ctx.fishHref(id) + "#fly-backup" : ctx.detailFile("item") + "?category=fly&id=01&return=" + encodeURIComponent(ctx.sourceReturn()))}">${ctx.lang === "th" ? id ? "ดูชุดฟลายเริ่มต้นและชุดสำรองของปลานี้" : "เลือกปลาจากบอดี้ แล้วดูชุดฟลายในหน้าปลา" : ctx.lang === "ja" ? id ? "この魚の最初の毛バリ・予備を見る" : "ボディで魚を選び、魚ページで毛バリを見る" : id ? "See starter and backup flies for this fish" : "Choose a fish from a body, then see flies on its profile"} ↗</a></p>`;
    }
    return "";
  }

  // src/pages/equipment/navigation-route.js
  function navigationRoute(ctx, itemCategory = "") {
    const category = itemCategory || document.getElementById("category-filter").value;
    if (category === "lure") return "lure";
    if (["flymaker", "fly", "fly_wing", "fly_tail"].includes(category)) return "fly";
    return ctx.baitRoute;
  }

  // src/pages/equipment/return-action.js
  var pageRoots = ["index", "maps", "fish", "item", "shops", "quests"];
  var locales = ["en", "th", "ja"];
  function routeForTarget(target, base) {
    if (target.pathname.startsWith(base.pathname))
      return target.pathname.slice(base.pathname.length) + target.search + target.hash;
    return `../research/${target.pathname.split("/").pop()}${target.search}${target.hash}`;
  }
  function safeLocalReturn(raw, baseHref) {
    if (!raw || raw.startsWith("//") || raw.includes("\\") || /^[a-z][a-z0-9+.-]*:/i.test(raw))
      return "";
    try {
      const base = new URL(".", baseHref);
      const target = new URL(raw, base);
      if (target.origin !== base.origin) return "";
      const allowed = pageRoots.flatMap(
        (root) => locales.map(
          (locale) => new URL(`${root}${locale === "en" ? "" : `.${locale}`}.html`, base).pathname
        )
      );
      allowed.push(
        ...locales.map(
          (locale) => new URL(`../research/index${locale === "en" ? "" : `.${locale}`}.html`, base).pathname
        )
      );
      return allowed.includes(target.pathname) ? routeForTarget(target, base) : "";
    } catch {
      return "";
    }
  }
  function localizeSafeReturn(raw, targetLocale, baseHref, depth = 0) {
    if (!locales.includes(targetLocale)) return "";
    const safe = safeLocalReturn(raw, baseHref);
    if (!safe) return "";
    const base = new URL(".", baseHref);
    const target = new URL(safe, base);
    const root = target.pathname.split("/").pop().match(/^(index|maps|fish|item|shops|quests)(?:\.(?:th|ja))?\.html$/)?.[1];
    if (root) {
      const directory = target.pathname.slice(0, target.pathname.lastIndexOf("/") + 1);
      target.pathname = `${directory}${root}${targetLocale === "en" ? "" : `.${targetLocale}`}.html`;
    }
    const nested = target.searchParams.get("return");
    if (nested) {
      const localized2 = depth < 4 ? localizeSafeReturn(nested, targetLocale, baseHref, depth + 1) : "";
      if (localized2) target.searchParams.set("return", localized2);
      else target.searchParams.delete("return");
    }
    return safeLocalReturn(routeForTarget(target, base), baseHref);
  }
  function isMapRoute(raw, baseHref) {
    const safe = safeLocalReturn(raw, baseHref);
    if (!safe) return false;
    return /^maps(?:\.(?:th|ja))?\.html(?:[?#]|$)/.test(safe);
  }
  function backLabel(locale) {
    return locale === "th" ? "← กลับไปแผนที่ปลา" : locale === "ja" ? "← 魚マップに戻る" : "← Back to fish map";
  }
  function previousPageLabel(locale) {
    return locale === "th" ? "← กลับไปหน้าก่อนหน้า" : locale === "ja" ? "← 前のページに戻る" : "← Back to previous page";
  }
  function isCurrentPage(route, baseHref) {
    const current = new URL(baseHref);
    const target = new URL(route, new URL(".", baseHref));
    return target.pathname === current.pathname && target.search === current.search && target.hash === current.hash;
  }
  function previousPageAction(rawReturn, locale, baseHref) {
    const href = localizeSafeReturn(rawReturn, locale, baseHref);
    if (!href || isCurrentPage(href, baseHref)) return null;
    return { href, label: previousPageLabel(locale) };
  }
  function updateLanguageLinks(rawReturn, baseHref) {
    const current = new URL(baseHref);
    document.querySelectorAll(".language-links a").forEach((link) => {
      const locale = link.getAttribute("hreflang");
      if (!locales.includes(locale)) return;
      const route = link.dataset.route || link.getAttribute("href").split(/[?#]/)[0];
      link.dataset.route = route;
      const query = new URLSearchParams(current.search);
      const safeReturn = localizeSafeReturn(rawReturn, locale, baseHref);
      if (safeReturn) query.set("return", safeReturn);
      else query.delete("return");
      const params = query.toString();
      link.href = `${route}${params ? `?${params}` : ""}${current.hash}`;
    });
  }
  function mapReturnAction(rawReturn, locale, baseHref) {
    const safe = localizeSafeReturn(rawReturn, locale, baseHref);
    if (!safe || !isMapRoute(safe, baseHref)) return null;
    return { href: safe, label: backLabel(locale) };
  }
  function setupReturnAction(ctx) {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const rawReturn = new URLSearchParams(window.location.search).get("return") || "";
    const mapAction = mapReturnAction(rawReturn, ctx.lang, window.location.href);
    const action = mapAction || previousPageAction(rawReturn, ctx.lang, window.location.href);
    if (action) {
      const nav = document.querySelector(".hero-meta");
      if (nav && !document.querySelector("[data-previous-page-return]")) {
        const link = document.createElement("a");
        link.className = mapAction ? "back-link map-return-link" : "back-link previous-page-return-link";
        link.dataset.previousPageReturn = "true";
        if (mapAction) link.dataset.mapReturn = "true";
        link.href = action.href;
        link.textContent = action.label;
        nav.prepend(link);
      }
    }
    updateLanguageLinks(rawReturn, window.location.href);
  }
  function mapReturnMarkup(ctx) {
    if (typeof window === "undefined") return "";
    const raw = new URLSearchParams(window.location.search).get("return") || "";
    const action = mapReturnAction(raw, ctx.lang, window.location.href);
    return action ? `<p><a class="route-button" data-map-panel-return href="${ctx.esc(action.href)}">${ctx.esc(action.label)}</a></p>` : "";
  }

  // src/pages/equipment/location-maps.js
  function itemLocationMarkers(ctx, item, location2) {
    const refs = location2.markerItems || (location2.markerItem ? [location2.markerItem] : [{ category: item.category, id: item.id }]);
    return refs.map(
      (ref) => ctx.allItems.find((entry) => entry.category === ref.category && entry.id === ref.id) || item
    );
  }
  function itemLocationNote(ctx, location2) {
    if (location2.forage)
      return ctx.lang === "th" ? "เดินไปยืนตรงรูปเหยื่อแล้วใช้แว่นขยาย สองรูปหมายถึงได้อย่างใดอย่างหนึ่ง ถ้าค้นซ้ำต้องขยับช่องก่อน" : ctx.lang === "ja" ? "エサ画像の地点へ歩き、虫メガネを使う。2画像はどちらか1種。再度探すときは移動する。" : "Walk to the bait image and use the magnifying glass. Two images mean either result, not both. Move before searching again.";
    return ctx.lang === "th" ? "รูปไอเท็มชี้จุดคุยหรือจุดใช้บนภาพฉากจากเกม" : ctx.lang === "ja" ? "道具画像はゲーム地形上の会話・使用地点を示します。" : "The item image marks the interaction or use point on game terrain.";
  }
  function markerHref(ctx, item, location2, marker) {
    if (marker.category === item.category && marker.id === item.id) return location2.image;
    const returnUrl = location2.forage ? ctx.areaItemLink(
      item,
      location2.stage,
      "#forage-stage-" + location2.stage + "-context-" + Number(location2.context)
    ) : "";
    return ctx.areaItemLink(marker, location2.stage, "", returnUrl);
  }
  function itemLocationMarker(ctx, item, location2, marker) {
    const sameItem = marker.category === item.category && marker.id === item.id;
    const label = sameItem ? ctx.lang === "th" ? "เปิดภาพจุดนี้" : ctx.lang === "ja" ? "この場所の画像を開く" : "Open this location image" : ctx.detailLabel;
    return `<a href="${ctx.esc(markerHref(ctx, item, location2, marker))}" aria-label="${ctx.esc(ctx.itemName(marker))} — ${label}"><img src="${ctx.esc(marker.image)}" alt="${ctx.esc(ctx.itemName(marker))}"></a>`;
  }
  function itemLocationSection(ctx, item, location2, area, open) {
    const markers = itemLocationMarkers(ctx, item, location2);
    const names = markers.map(ctx.itemName).join(ctx.lang === "th" ? " หรือ " : ctx.lang === "ja" ? " または " : " or ");
    const context = location2.context === "town" ? ctx.lang === "th" ? "ในเมือง" : ctx.lang === "ja" ? "町内" : "In town" : ctx.lang === "th" ? "กลางแจ้ง" : ctx.lang === "ja" ? "屋外" : "Outdoors";
    const fullLabel = location2.context === "town" ? ctx.lang === "th" ? "เปิดภาพในเมืองทั้งห้าห้อง" : ctx.lang === "ja" ? "町の5室の地形を見る" : "Open town terrain for all five rooms" : open;
    const stepLabel = ctx.lang === "th" ? "เปิดขั้นตอนรับ/ใช้ของและทางเข้า" : ctx.lang === "ja" ? "入手・使用手順と入口を見る" : "Open acquisition/use steps and entrance";
    const pins = markers.map((marker) => itemLocationMarker(ctx, item, location2, marker)).join("");
    return `<section class="location-map"><h4>${area} ${location2.stage} · ${context} · ${ctx.esc(location2.forage ? names : ctx.local(location2.name))}</h4><div class="map-canvas" style="aspect-ratio:${location2.width}/${location2.height}"><img class="map-background" loading="lazy" src="${ctx.esc(location2.image)}" alt="${ctx.esc(ctx.local(location2.name))}"><span class="map-pin" style="left:${location2.pin.x * 100}%;top:${location2.pin.y * 100}%">${pins}</span></div><p class="fish-scope">${ctx.esc(itemLocationNote(ctx, location2))} · X ${location2.tileX}, Y ${location2.tileY}</p>${location2.action ? `<p class="acquisition-action">${ctx.esc(ctx.local(location2.action))}</p>` : ""}${location2.description ? `<p class="fish-scope">${ctx.esc(ctx.local(location2.description))}</p>` : ""}${location2.useWindow ? `<p>${ctx.lang === "th" ? "ใช้ดอกไม้ไฟขณะยืนในช่วง" : ctx.lang === "ja" ? "花火の使用範囲" : "Fireworks activation tiles"} X ${location2.useWindow.xMin}–${location2.useWindow.xMax}, Y ${location2.useWindow.yMin}–${location2.useWindow.yMax}</p>` : ""}<a href="${ctx.esc(location2.fullImage)}" target="_blank" rel="noopener">${fullLabel} ↗</a>${location2.context === "town" ? ` · <a href="${ctx.esc(ctx.itemHref(item))}#use-locations">${ctx.esc(stepLabel)} ↗</a>` : ""}</section>`;
  }
  function forageLocationGroups(ctx, item, locations, area, open) {
    const stages2 = [...new Set(locations.map((location2) => location2.stage))];
    return stages2.map((stage) => {
      const sections = locations.filter((location2) => location2.stage === stage).map((location2) => itemLocationSection(ctx, item, location2, area, open)).join("");
      return `<details class="forage-stage"><summary>${area} ${stage}</summary>${sections}</details>`;
    }).join("");
  }
  function toolUseLocations(ctx, item) {
    const locations = ctx.useOf(item).useLocations || [];
    if (!locations.length) return "";
    const heading = ctx.lang === "th" ? "ดูจุดรับและใช้ไอเท็ม" : ctx.lang === "ja" ? "入手・使用場所を地図で見る" : "See where to obtain or use this item";
    const area = ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area";
    const open = ctx.lang === "th" ? "ดูแผนที่ทั้งด่าน" : ctx.lang === "ja" ? "エリア全体の地図" : "Full area map";
    const content = locations.some((location2) => location2.forage) ? forageLocationGroups(ctx, item, locations, area, open) : locations.map((location2) => itemLocationSection(ctx, item, location2, area, open)).join("");
    return `<details class="tool-use-map"><summary>${heading}</summary>${content}</details>`;
  }
  function fishMapPage(ctx) {
    return ctx.lang === "th" ? "maps.th.html" : ctx.lang === "ja" ? "maps.ja.html" : "maps.html";
  }
  function fishMapActionLabels(ctx) {
    return {
      pageLabel: ctx.lang === "th" ? "เปิดแผนที่ของปลานี้" : ctx.lang === "ja" ? "この魚の地図を開く" : "Open this fish in the map browser",
      profileLabel: ctx.lang === "th" ? "เปิดข้อมูลปลานี้" : ctx.lang === "ja" ? "この魚の詳細を開く" : "Open fish profile",
      areasLabel: ctx.lang === "th" ? "พบในด่าน" : ctx.lang === "ja" ? "生息エリア" : "Known areas",
      mapDetails: ctx.lang === "th" ? "ดูแผนที่และจุดตกของด่านนี้" : ctx.lang === "ja" ? "このエリアの地図と釣り場を見る" : "View embedded map and fishing spots for this area"
    };
  }
  function fishMapGeneralLabels(ctx) {
    return {
      title: ctx.lang === "th" ? "ปลาตัวนี้อยู่ที่ไหน" : ctx.lang === "ja" ? "この魚はどこにいる？" : "Where to find this fish",
      stage: ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area",
      openMap: ctx.lang === "th" ? "เปิดแผนที่ขนาดเต็ม" : ctx.lang === "ja" ? "地図を原寸で開く" : "Open full-size map",
      source: ctx.lang === "th" ? "แผนที่ต้นฉบับ / ที่มา" : ctx.lang === "ja" ? "元の地図・出典" : "Original map / source",
      unknown: ctx.lang === "th" ? "ยังไม่มีตำแหน่งที่ตรวจสอบได้สำหรับปลานี้ จะไม่เดาตำแหน่งจากรายชื่อเหยื่อ" : ctx.lang === "ja" ? "この魚の釣り場はまだ確認できていません。エサの適合表から場所は推測しません。" : "No verified location is available yet. Bait compatibility does not establish a habitat."
    };
  }
  function fishMapLabels(ctx) {
    return {
      page: fishMapPage(ctx),
      ...fishMapActionLabels(ctx),
      ...fishMapGeneralLabels(ctx)
    };
  }
  function renderEmptyFishLocation() {
    const box = document.getElementById("fish-location-panel");
    if (box.dataset) box.dataset.fishId = "";
    box.hidden = true;
    box.innerHTML = "";
  }
  function selectFishStage(ctx, locations) {
    const selected = locations.some((location2) => String(location2.stage) === ctx.locationStage);
    if (!selected) ctx.locationStage = String(locations[0]?.stage || "");
    return locations.find((location2) => String(location2.stage) === ctx.locationStage);
  }
  function renderAreaOverview(ctx, chosen, viewBox) {
    const overview = chosen?.overview;
    if (!overview || !viewBox) return "";
    const rotateNote = overview.rotated ? ctx.lang === "th" ? " · ด้านบนของฉากอยู่ทางซ้าย" : ctx.lang === "ja" ? " · 元の画面の上方向は左" : " · Original top is on the left" : "";
    const caption = ctx.lang === "th" ? "ภาพรวมทั้งด่าน · กรอบแสดงส่วนที่เปิดอยู่" : ctx.lang === "ja" ? "エリア全体 · 枠は下の拡大範囲" : "Full area · outline marks the view below";
    const width = Math.min(900, overview.width / overview.height * 400);
    return `<figure class="area-overview"><figcaption>${caption}${rotateNote}</figcaption><div style="aspect-ratio:${overview.width}/${overview.height};max-width:${width}px"><img src="${ctx.esc(overview.image)}" alt="${ctx.esc(ctx.local(chosen.stageName))}"><span style="left:${viewBox.x * 100}%;top:${viewBox.y * 100}%;width:${viewBox.width * 100}%;height:${viewBox.height * 100}%"></span></div></figure>`;
  }
  function renderFishMapMenu(ctx, maps) {
    if (maps.length <= 1) return "";
    const label = ctx.lang === "th" ? "เลือกส่วนของแผนที่" : ctx.lang === "ja" ? "地図の部分を選ぶ" : "Map section";
    const options = maps.map(
      (map, index) => `<option value="${index}" ${index === ctx.locationMapIndex ? "selected" : ""}>${ctx.esc(ctx.local(map.name))} · ${map.pins?.length || 0} ${ctx.lang === "th" ? "จุด" : ctx.lang === "ja" ? "地点" : "points"}</option>`
    ).join("");
    return `<label class="location-map-select">${label}<select id="location-map-select">${options}</select></label>`;
  }
  function fishPinNote(ctx) {
    return ctx.lang === "th" ? "รูปปลาและหมายเลขชี้บริเวณที่ควรลองตก พิกัดจุดเกิดที่กำหนดใน ROM; บางจุดอาจไม่มีปลาในรอบที่เกมสร้างปลา" : ctx.lang === "ja" ? "魚画像と番号は狙う目安です。ROMの地図データから抽出した座標です。魚の生成状態によって無効な地点があります。" : "Fish portraits and numbers mark places to try. Coordinates are extracted from ROM map data; some configured points can be inactive in a generated game state.";
  }
  function fishPin(ctx, id, fish, pin, index) {
    const portrait = fish.image ? `<a href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(ctx.fishName(id))} — ${ctx.detailLabel}"><img src="${ctx.esc(fish.image)}" alt="${ctx.esc(ctx.fishName(id))}"></a>` : "";
    return `<span class="map-pin" style="left:${Number(pin.x) * 100}%;top:${Number(pin.y) * 100}%" title="${ctx.esc(ctx.fishName(id))} · X ${pin.tileX}, Y ${pin.tileY}">${portrait}<b>${index + 1}</b></span>`;
  }
  function fishMapImage(ctx, id, fish, map, title, labels2) {
    if (!map.image) return `<p>${ctx.esc(labels2.unknown)}</p>`;
    const pins = (map.pins || []).map((pin, index) => fishPin(ctx, id, fish, pin, index)).join("");
    const ratio = `${Number(map.width) || 1}/${Number(map.height) || 1}`;
    return `<div class="map-scroll"><div class="map-canvas" style="aspect-ratio:${ratio}"><img class="map-background" loading="lazy" src="${ctx.esc(map.image)}?v=terrain-context-20261004" alt="${ctx.esc(title)}">${pins}</div></div><p class="fish-scope">${ctx.esc(fishPinNote(ctx))}</p><a href="${ctx.esc(map.image)}" target="_blank" rel="noopener">${labels2.openMap} ↗</a>${map.fullImage ? ` · <a href="${ctx.esc(map.fullImage)}" target="_blank" rel="noopener">${ctx.lang === "th" ? "ดูแผนที่ทั้งด่าน" : ctx.lang === "ja" ? "全体地図" : "Full area map"} ↗</a>` : ""}`;
  }
  function fishMapArticle(ctx, id, fish, map, index, labels2) {
    const title = ctx.local(map.name) || `${ctx.lang === "th" ? "แผนที่" : ctx.lang === "ja" ? "地図" : "Map"} ${index + 1}`;
    const bounds = map.tileBounds ? `<p class="fish-scope">X ${map.tileBounds.xMin}–${map.tileBounds.xMax} · Y ${map.tileBounds.yMin}–${map.tileBounds.yMax}</p>` : "";
    const source = map.sourceUrl ? ` · <a href="${ctx.esc(map.sourceUrl)}" target="_blank" rel="noopener">${labels2.source} ↗</a>` : "";
    const note = map.note ? `<p>${ctx.esc(ctx.local(map.note))}</p>` : "";
    return `<article class="location-map"><h4>${ctx.esc(title)}</h4>${bounds}${fishMapImage(ctx, id, fish, map, title, labels2)}${source}${note}</article>`;
  }
  function renderFishMaps(ctx, id, fish, maps, labels2) {
    return maps.filter((map, index) => index === ctx.locationMapIndex).map((map, index) => fishMapArticle(ctx, id, fish, map, index, labels2)).join("");
  }
  function stageButtons(ctx, locations, stageWord) {
    return locations.map(
      (location2) => `<button type="button" data-location-stage="${location2.stage}" aria-pressed="${String(location2.stage) === ctx.locationStage}">${stageWord} ${location2.stage} · ${ctx.esc(ctx.local(location2.stageName))}</button>`
    ).join("");
  }
  function fishMapHref(ctx, labels2, id, location2) {
    const query = new URLSearchParams({
      fish: id,
      route: navigationRoute(ctx),
      return: ctx.sourceReturn()
    });
    if (location2) query.set("stage", String(location2.stage));
    return `${labels2.page}?${query}#map-view`;
  }
  function renderFishAreaLinks(ctx, id, locations, labels2) {
    if (!locations.length) return `<p>${ctx.esc(labels2.unknown)}</p>`;
    const unique = [
      ...new Map(locations.map((location2) => [String(location2.stage), location2])).values()
    ];
    const links = unique.map((location2) => {
      const label = `${labels2.stage} ${location2.stage} · ${ctx.local(location2.stageName)}`;
      return `<a class="fish-area-link" href="${ctx.esc(fishMapHref(ctx, labels2, id, location2))}">${ctx.esc(label)} ↗</a>`;
    }).join("");
    return `<nav class="fish-area-links" aria-label="${ctx.esc(labels2.areasLabel)}"><strong>${ctx.esc(labels2.areasLabel)}:</strong> ${links}</nav>`;
  }
  function fishLocationHeader(ctx, id, fish, title, labels2, chosen) {
    const portrait = fish.image ? `<a href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(ctx.fishName(id))} — ${ctx.detailLabel}"><img src="${ctx.esc(fish.image)}" alt=""></a>` : "";
    const intro = ctx.lang === "th" ? "ดูจุดตก แล้วเทียบตัวเลือกในหมวดที่เลือกด้านล่าง" : ctx.lang === "ja" ? "釣り場を確認してから、下で選択中のカテゴリーを比較します。" : "Find a fishing spot, then compare the selected equipment category below.";
    const profile = `<a class="fish-profile-link" href="${ctx.esc(ctx.fishHref(id))}">${labels2.profileLabel} ↗</a>`;
    const map = `<a class="map-browser-cta" href="${ctx.esc(fishMapHref(ctx, labels2, id, chosen))}">${labels2.pageLabel} ↗</a>`;
    return `<div class="location-heading">${portrait}<div><h2>${ctx.esc(title)} — ${ctx.esc(ctx.fishName(id))}</h2><p>${intro}</p><nav class="fish-location-links">${profile}${map}</nav></div></div>`;
  }
  function chosenStageContent(ctx, chosen, locations, labels2, overviewHtml, mapMenu, maps) {
    if (!locations.length) return `<p>${ctx.esc(labels2.unknown)}</p>`;
    const access = chosen.accessNote ? `<p class="location-access">${ctx.esc(ctx.local(chosen.accessNote))}</p>` : "";
    const noMap = !maps ? `<p>${ctx.lang === "th" ? "พบพิกัดใน ROM แล้ว อยู่ระหว่างถอดภาพแผนที่" : ctx.lang === "ja" ? "ROM座標を抽出済み。地図画像を復号中。" : "ROM coordinates extracted; map rendering is in progress."}</p>` : "";
    const points = (chosen.points || []).map((point) => `(${point.x}, ${point.y})`).join(" · ");
    const pointLabel = ctx.lang === "th" ? "ดูพิกัดจุดเกิดจากเกม" : ctx.lang === "ja" ? "出現座標" : "Spawn coordinates";
    const provenance = ctx.lang === "th" ? "ตำแหน่งและชนิดปลามาจากข้อมูลในเกม; ดูที่มาในรายละเอียดการค้นคว้า" : ctx.lang === "ja" ? "場所と魚種はゲームデータから取り出したものです。出典は調査詳細を参照。" : "Locations and species come from the game data; the research notes show the sources.";
    return `<nav class="part-menu location-stages" aria-label="${labels2.stage}">${stageButtons(ctx, locations, labels2.stage)}</nav><h3>${labels2.stage} ${chosen.stage} · ${ctx.esc(ctx.local(chosen.stageName))}</h3><p>${ctx.esc(ctx.local(chosen.description))}</p>${access}${overviewHtml}${mapMenu}<div class="location-maps">${maps}</div>${noMap}<details class="spawn-coordinates"><summary>${pointLabel}</summary><p>${points}</p></details><p class="location-provenance">${provenance}</p>`;
  }
  function renderFishLocationContent(ctx, id, fish, chosen, locations, labels2) {
    const mapChoices = chosen?.maps || [];
    if (ctx.locationMapIndex >= mapChoices.length) ctx.locationMapIndex = 0;
    const viewBox = mapChoices[ctx.locationMapIndex]?.overviewBox;
    const overview = renderAreaOverview(ctx, chosen, viewBox);
    const mapMenu = renderFishMapMenu(ctx, mapChoices);
    const maps = renderFishMaps(ctx, id, fish, mapChoices, labels2);
    const mapContent = chosenStageContent(ctx, chosen, locations, labels2, overview, mapMenu, maps);
    const mapLabel = chosen ? `${labels2.mapDetails} · ${labels2.stage} ${chosen.stage} · ${ctx.local(chosen.stageName)}` : labels2.mapDetails;
    const disclosure = locations.length ? ctx.cardDisclosure(
      mapLabel,
      renderFishAreaLinks(ctx, id, locations, labels2) + mapContent,
      "fish-location-details"
    ) : "";
    return `${fishLocationHeader(ctx, id, fish, labels2.title, labels2, chosen)}${disclosure}`;
  }
  function renderFishLocation(ctx, id) {
    const labels2 = fishMapLabels(ctx);
    if (!id) return renderEmptyFishLocation();
    const fish = ctx.fishVisuals[id] || {};
    const locations = ctx.fishLocations[id]?.locations || [];
    const chosen = selectFishStage(ctx, locations);
    const mapHref = fishMapHref(ctx, labels2, id, chosen);
    document.getElementById("map-browser-link").href = mapHref;
    const panel = document.getElementById("fish-location-panel");
    const keepMapOpen = panel.dataset?.fishId === String(id) && panel.querySelector?.("details.fish-location-details")?.open;
    panel.hidden = false;
    panel.dataset && (panel.dataset.fishId = String(id));
    panel.innerHTML = mapReturnMarkup(ctx) + renderFishLocationContent(ctx, id, fish, chosen, locations, labels2);
    const disclosure = panel.querySelector?.("details.fish-location-details");
    if (keepMapOpen && disclosure) disclosure.open = true;
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

  // src/pages/equipment/quest-next-actions.js
  var AKAME_ID = "37";
  var FIREWORKS_ID = "16";
  var EEL_ID = "3B";
  function itemMatches(item, id) {
    return item?.category === "general_tool" && item.id === id;
  }
  function localizedReturn(ctx) {
    return ctx.sourceReturn?.() || "";
  }
  function fishMapHref2(ctx, point) {
    const column = Math.floor((point.x * 16 + 8) / 384) + 1;
    const row = Math.floor((point.y * 16 + 8) / 384) + 1;
    const query = new URLSearchParams({
      stage: "6",
      fish: AKAME_ID,
      section: `s6-c${column}-r${row}`
    });
    const returned = localizedReturn(ctx);
    if (returned) query.set("return", returned);
    return `${ctx.detailFile("maps")}?${query}`;
  }
  function fireworksShopHref(ctx) {
    const query = new URLSearchParams({
      stage: "4",
      place: "town",
      category: "general_tool",
      id: FIREWORKS_ID
    });
    const returned = localizedReturn(ctx);
    if (returned) query.set("return", returned);
    return `${ctx.detailFile("shops")}?${query}`;
  }
  function returnVillageHref(ctx) {
    const query = new URLSearchParams({ stage: "1", section: "s1-c1-r8", action: "eel-return" });
    const returned = localizedReturn(ctx);
    if (returned) query.set("return", returned);
    return `${ctx.detailFile("maps")}?${query}#map-view`;
  }
  function eelMapHref(ctx) {
    const query = new URLSearchParams({
      stage: "6",
      fish: EEL_ID,
      section: "s6-c2-r1"
    });
    const returned = localizedReturn(ctx);
    if (returned) query.set("return", returned);
    return `${ctx.detailFile("maps")}?${query}#map-view`;
  }
  function eelProfileHref(ctx) {
    const [path, queryString = ""] = ctx.fishHref(EEL_ID).split("?");
    const query = new URLSearchParams(queryString);
    query.set("stage", "6");
    return `${path}?${query}`;
  }
  function candleCardAction(ctx, item) {
    if (!itemMatches(item, "12")) return "";
    const locations = ctx.fishLocations?.[AKAME_ID]?.locations || [];
    const point = locations.find((entry) => Number(entry.stage) === 6)?.points?.find((entry) => entry.x === 37 && entry.y === 29);
    if (!point) return "";
    const text4 = {
      th: {
        title: "เบาะแสหลังส่งเทียน · ตัวละครเซฟ 1",
        body: `บทพูดชี้ไปทางตะวันตกเฉียงเหนือแต่ไม่ระบุช่องตกปลา; ตารางจุดเกิดปลาใน ROM แยกต่างหากวางอาคาเมะไว้ที่ด่าน 6 X ${point.x}, Y ${point.y} หนึ่งจุด ซึ่งบางรอบอาจไม่ทำงาน`,
        profile: "ดูข้อมูลอาคาเมะ",
        map: "ดูจุดนี้บนแผนที่"
      },
      ja: {
        title: "ロウソクの後の手掛かり · セーブキャラクター1",
        body: `台詞は北西を示しますが釣りタイルは示しません。別に解析したROMの出現表ではアカメの地点はエリア6、X ${point.x}, Y ${point.y}の1か所です。生成状態によって無効な場合があります。`,
        profile: "アカメの情報を見る",
        map: "この地点を地図で見る"
      },
      en: {
        title: "Candle clue · saved character 1",
        body: `The dialogue points northwest but does not specify a fishing tile. The separate ROM spawn table places Akame at Area 6, X ${point.x}, Y ${point.y}; this one configured slot can be inactive in some generated states.`,
        profile: "Open the Akame profile",
        map: "See this map point"
      }
    }[ctx.lang];
    return `<div class="card-quest-next-action" data-quest-next-action="candle-akame"><strong>${ctx.esc(text4.title)}</strong><p>${ctx.esc(text4.body)}</p><p><a data-quest-fish-profile href="${ctx.esc(ctx.fishHref(AKAME_ID))}">${ctx.esc(text4.profile)} ↗</a> · <a data-quest-fish-map href="${ctx.esc(fishMapHref2(ctx, point))}">${ctx.esc(text4.map)} ↗</a></p></div>`;
  }
  function fireworksCardAction(ctx, item) {
    if (!itemMatches(item, FIREWORKS_ID)) return "";
    const text4 = {
      th: {
        title: "ใช้ผิดจุดแล้วต้องหาอีก?",
        body: "ร้านเมืองด่าน 4 มีรายการดอกไม้ไฟในตาราง ROM ราคา ¥50; ยังยืนยันไม่ได้ว่าซื้อซ้ำได้ไม่จำกัด",
        shop: "ตรวจรายการขายด่าน 4"
      },
      ja: {
        title: "別の場所で使い、もう1つ必要？",
        body: "ROMの店在庫表にはエリア4の町で花火が50円と記録されています。無制限に買い直せるかは未確認です。",
        shop: "エリア4の販売品を確認"
      },
      en: {
        title: "Used it at the wrong spot and need another?",
        body: "The ROM stock table lists fireworks in the Area 4 town shop for ¥50; unlimited repeat purchases are not verified.",
        shop: "Check Area 4 shop stock"
      }
    }[ctx.lang];
    return `<div class="card-quest-next-action" data-quest-next-action="fireworks-recovery"><strong>${ctx.esc(text4.title)}</strong><p>${ctx.esc(text4.body)}</p><p><a data-quest-fireworks-shop href="${ctx.esc(fireworksShopHref(ctx))}">${ctx.esc(text4.shop)} ↗</a></p></div>`;
  }
  function postcardCardAction(ctx, item) {
    if (!itemMatches(item, "06")) return "";
    const record = ctx.fishLocations?.[EEL_ID]?.locations?.find((entry) => Number(entry.stage) === 6);
    if (!record?.points?.some((point) => point.x === 41 && point.y === 8)) return "";
    const text4 = {
      th: {
        title: "เมื่ออ่านแล้วพบจดหมายจากหมอให้ตกปลาไหลใหญ่",
        body: "ถ้าพบข้อความนี้แล้ว ใช้แม่เหล็กในด่าน 6 ดูทิศทาง หรือเปิดจุดบนแผนที่ด้านล่าง เลือกเหยื่อและอุปกรณ์จากหน้าปลาไหลใหญ่ก่อนออกไปตก",
        afterCatch: "จับตามคำขอได้แล้ว ให้เก็บปลาไหลไว้และกลับหมู่บ้านเริ่มต้น หากเงื่อนไขเนื้อเรื่องครบ เกมจะเริ่มฉากช่วยหมอและฉากจบอัตโนมัติ",
        returnMap: "ดูทางกลับหมู่บ้าน · ด่าน 1 (12,189)",
        limit: "จุดตกที่กำหนดอาจไม่มีปลาในรอบนี้",
        fish: "ดูเหยื่อและอุปกรณ์ของปลาไหลใหญ่",
        map: "ดูจุดด่าน 6 · X 41, Y 8"
      },
      ja: {
        title: "医者から大ウナギを釣る依頼が届いたら",
        body: "この依頼を見たら、エリア6で磁石のオオウナギ項目を使うか、下の地図で地点を確認。釣りに行く前に魚のページで対応エサと道具を選んでください。",
        afterCatch: "依頼の魚を釣ったら、ウナギを残して最初の村へ戻ってください。物語の条件がそろうと、医者の回復とエンディングの自動シーンが始まります。",
        returnMap: "最初の村への入口 · エリア1 (12,189)",
        limit: "設定された釣り場に魚がいない場合もあります。",
        fish: "オオウナギのエサと道具を見る",
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
    }[ctx.lang];
    return `<aside class="card-quest-next-action" data-quest-next-action="postcard-eel"><strong>${ctx.esc(text4.title)}</strong><p>${ctx.esc(text4.body)}</p><p><a class="route-button" data-quest-fish-profile href="${ctx.esc(eelProfileHref(ctx))}">${ctx.esc(text4.fish)} ↗</a></p><p><a class="route-button" data-quest-fish-map href="${ctx.esc(eelMapHref(ctx))}">${ctx.esc(text4.map)} ↗</a></p><p data-eel-ending-action>${ctx.esc(text4.afterCatch)}</p><p><a class="route-button" data-eel-return-map href="${ctx.esc(returnVillageHref(ctx))}">${ctx.esc(text4.returnMap)} ↗</a></p><p>${ctx.esc(text4.limit)}</p></aside>`;
  }
  function notebookCardAction(ctx, item) {
    if (!itemMatches(item, "05")) return "";
    const text4 = {
      th: {
        title: "อยากเก็บปลาให้ครบสมุด?",
        body: "สมุดนับหนึ่งรายการต่อปลาหนึ่งชนิด ดูปลาใหม่กับปลาที่ซ้ำในแต่ละด่าน แล้วติ๊กตามที่เช็กได้ในเกม",
        link: "เปิดรายการเช็กสมุดแยกตามด่าน"
      },
      ja: {
        title: "釣りノートを全部埋めたい？",
        body: "ノートは魚種ごとに1件です。エリアごとの新規・重複対象を見て、ゲーム内で確認した魚にチェックできます。",
        link: "エリア別のノート一覧を開く"
      },
      en: {
        title: "Want to complete the fishing notebook?",
        body: "The notebook keeps one entry per species. See new and repeated fish in each area, then mark what you have checked in the game.",
        link: "Open the area-by-area notebook checklist"
      }
    }[ctx.lang];
    const query = new URLSearchParams({ stage: String(ctx.locationStage || 1) });
    const returnPath = ctx.sourceReturn?.();
    if (returnPath) query.set("return", returnPath);
    const href = `${ctx.detailFile("maps")}?${query}#notebook-guide`;
    return `<aside class="card-quest-next-action notebook-card-action" data-notebook-item-action><strong>${ctx.esc(text4.title)}</strong><p>${ctx.esc(text4.body)}</p><p><a class="notebook-guide-link" href="${ctx.esc(href)}">${ctx.esc(text4.link)} ↗</a></p></aside>`;
  }
  function questNextActions(ctx, item) {
    return [
      candleCardAction(ctx, item),
      fireworksCardAction(ctx, item),
      postcardCardAction(ctx, item),
      notebookCardAction(ctx, item)
    ].filter(Boolean).join("");
  }

  // src/pages/equipment/hook-target-links.js
  function targetRecords(item) {
    const targets = item.playerUse?.targetMatches;
    return (Array.isArray(targets) ? targets : targets ? [targets] : []).filter(
      (target) => /^[\da-f]{2}$/i.test(String(target.fishId || ""))
    );
  }
  function targetLabel(lang) {
    if (lang === "th") return "ดูเหยื่อและจุดตกของปลาเป้าหมายที่ระบุไว้";
    if (lang === "ja") return "記載された対象魚のエサ・場所を見る";
    return "View bait and locations for the listed target fish";
  }
  function hookTargetLinks(ctx, item) {
    if (item.category !== "hook") return "";
    const targets = targetRecords(item);
    if (!targets.length) return "";
    const links = targets.map((target) => {
      const id = String(target.fishId).toUpperCase();
      const name = ctx.fishName(id);
      return `<a class="route-button" data-hook-target-fish="${ctx.esc(id)}" href="${ctx.esc(ctx.fishHref(id))}">${ctx.esc(name)} ↗</a>`;
    }).join(" ");
    return `<div class="hook-target-links" data-hook-target-links><span>${ctx.esc(targetLabel(ctx.lang))}</span> ${links}</div>`;
  }

  // src/pages/equipment/bait-lure-verdict.js
  var COPY3 = {
    en: {
      ownBait: (route) => `If you already own it, keep using it for fish that pass its ${route} compatibility check.`,
      ownLure: "If you already own it, keep using it for fish that pass this lure’s compatibility check.",
      float: "float-rig",
      sinker: "sinker-rig",
      buy: "Buying new",
      cheaper: "lower-priced shop choices with the same or broader fish coverage",
      elsewhere: "Buying new elsewhere",
      noCheaper: "No lower-priced shop offer with the same or broader full fish coverage was found.",
      chooseFish: "Choose one target fish to compare its compatible baits and lures",
      notHere: (stage) => `This item has no recorded shop offer in Area ${stage}.`,
      notHereElsewhere: (stage, areas) => `No offer in Area ${stage}; this item is listed in ${areas}.`,
      notHereConditional: (stage, saleStage) => `No offer in Area ${stage}; its conditional offer is in Area ${saleStage}.`,
      soldHere: (stage, price) => `This item is listed in Area ${stage} for ¥${price}.`,
      soldElsewhere: (areas) => `This item is listed for sale in ${areas}.`,
      noOffer: "No sale for this item is recorded in the six area shop lists; the price stored in the game data does not show where to buy it.",
      conditional: (stage) => `Area ${stage} offer: sell at least one Ayu from your keepnet before buying.`,
      noRouteFish: (route) => `No fish are recorded as compatible with this bait on the ${route}.`,
      switchRoute: (route) => `See fish for the ${route}`,
      noBaitFish: "No compatible fish are recorded for this bait on either rig.",
      area: (stage) => `Area ${stage}`,
      coveragePeers: "For the same route-specific fish lists, confirmed shop alternatives are",
      limit: "This compares compatible fish and recorded shop stock; it does not show which item gets more bites or is easier to land."
    },
    ja: {
      ownBait: (route) => `すでに持っているなら、${route}仕掛けの適合条件を通る魚に使い続けられます。`,
      ownLure: "すでに持っているなら、このルアーの適合条件を通る魚に使い続けられます。",
      float: "ウキ",
      sinker: "オモリ",
      buy: "新しく買うなら",
      cheaper: "同じか広い魚リストに対応する、より安い店頭品",
      elsewhere: "他のエリアで買うなら",
      noCheaper: "同じか広い魚リスト全体に対応する、より安い店頭品は確認できていません。",
      chooseFish: "魚を1種類選び、使えるエサとルアーを比較する",
      notHere: (stage) => `エリア${stage}では、この品の店頭販売は確認されていません。`,
      notHereElsewhere: (stage, areas) => `エリア${stage}では販売されていません。販売エリア：${areas}。`,
      notHereConditional: (stage, saleStage) => `エリア${stage}では販売されていません。条件付き販売はエリア${saleStage}です。`,
      soldHere: (stage, price) => `エリア${stage}で${price}円で販売されています。`,
      soldElsewhere: (areas) => `${areas}で販売されています。`,
      noOffer: "6エリアの店頭リストに販売記録がありません。ゲームデータ内の価格だけでは、買える店とは言えません。",
      conditional: (stage) => `エリア${stage}の販売条件：購入前にびくのアユを1匹以上売ってください。`,
      noRouteFish: (route) => `このエサは${route}仕掛けで対応する魚が記録されていません。`,
      switchRoute: (route) => `${route}仕掛けの対応魚を見る`,
      noBaitFish: "このエサはどちらの仕掛けでも対応魚が記録されていません。",
      area: (stage) => `エリア${stage}`,
      coveragePeers: "同じ仕掛け別の魚リストに対応し、店頭販売が確認された候補：",
      limit: "これは対応する魚と店頭在庫の比較です。食いつきや取り込みやすさは示しません。"
    },
    th: {
      ownBait: (route) => `ถ้ามีอยู่แล้ว ใช้ต่อกับปลาที่ผ่านเงื่อนไขของ${route}ได้`,
      ownLure: "ถ้ามีอยู่แล้ว ใช้ต่อกับปลาที่ผ่านเงื่อนไขของลัวร์ชิ้นนี้ได้",
      float: "สายทุ่น",
      sinker: "สายตะกั่ว",
      buy: "ถ้าจะซื้อใหม่",
      cheaper: "ตัวเลือกในร้านที่ถูกกว่าและรองรับรายชื่อปลาเท่ากันหรือกว้างกว่า",
      elsewhere: "ถ้าจะซื้อจากด่านอื่น",
      noCheaper: "ไม่พบรายการขายที่ถูกกว่าและครอบคลุมรายชื่อปลาทั้งชุดเท่ากันหรือกว้างกว่า",
      chooseFish: "เลือกปลาเป้าหมายเพื่อเทียบเหยื่อที่ใช้ได้กับปลาตัวนั้น",
      notHere: (stage) => `ไม่พบรายการขายชิ้นนี้ในร้านด่าน ${stage}`,
      notHereElsewhere: (stage, areas) => `ด่าน ${stage} ไม่มีขาย; มีรายการขายที่${areas}`,
      notHereConditional: (stage, saleStage) => `ด่าน ${stage} ไม่มีขาย; รายการขายแบบมีเงื่อนไขอยู่ด่าน ${saleStage}`,
      soldHere: (stage, price) => `มีรายการขายชิ้นนี้ในด่าน ${stage} ราคา ¥${price}`,
      soldElsewhere: (areas) => `มีรายการขายชิ้นนี้ที่${areas}`,
      noOffer: "ไม่พบชิ้นนี้ในรายการร้านทั้ง 6 ด่าน; ราคาในข้อมูลเกมยังไม่ยืนยันว่าซื้อได้ที่ไหน",
      conditional: (stage) => `ด่าน ${stage} มีเงื่อนไขขาย: ต้องขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนซื้อ`,
      noRouteFish: (route) => `ไม่พบปลาที่บันทึกว่าใช้เหยื่อนี้ได้กับ${route}`,
      switchRoute: (route) => `ดูปลาที่ใช้ได้กับ${route}`,
      noBaitFish: "ไม่พบปลาที่บันทึกว่าใช้เหยื่อนี้ได้ทั้งสายทุ่นและสายตะกั่ว",
      area: (stage) => `ด่าน ${stage}`,
      coveragePeers: "ตัวเลือกที่ร้านมีขายและรองรับรายชื่อปลาเดียวกันตามสายตกนี้:",
      limit: "ข้อมูลนี้เทียบชนิดปลาที่ใช้ได้กับรายการของในร้าน ไม่ได้บอกว่าอันไหนทำให้ปลากินมากกว่าหรือตกขึ้นง่ายกว่า"
    }
  };
  function copy(ctx) {
    return COPY3[ctx.lang] || COPY3.en;
  }
  function stageNumber(value) {
    const stage = Number(value);
    return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0;
  }
  function recordedShopRows(item) {
    return (item.playerUse?.shops || []).filter((row) => stageNumber(row.stage));
  }
  function hasUnconditionalSale(item, stage) {
    return recordedShopRows(item).some((row) => stageNumber(row.stage) === stage && !row.condition);
  }
  function findItem(ctx, ref) {
    return ctx.allItems.find(
      (candidate) => candidate.category === ref.category && candidate.id === ref.id
    );
  }
  function collectCheaperOffers(ctx, item, selectedStage2 = 0) {
    const offers = /* @__PURE__ */ new Map();
    const itemPrice = Number(item.priceYen);
    if (!Number.isFinite(itemPrice) || itemPrice <= 0) return [];
    for (const [stageText, refs] of Object.entries(item.baitLureDecision?.cheaperByStage || {})) {
      const stage = stageNumber(stageText);
      if (!stage || selectedStage2 && stage !== selectedStage2) continue;
      for (const ref of refs) {
        const target = findItem(ctx, ref);
        const price = Number(ref.priceYen);
        if (!target || !Number.isFinite(price) || price < 0 || price >= itemPrice || !hasUnconditionalSale(target, stage))
          continue;
        const key = `${target.category}:${target.id}:${price}`;
        const offer = offers.get(key) || { item: target, price, stages: [] };
        if (!offer.stages.includes(stage)) offer.stages.push(stage);
        offers.set(key, offer);
      }
    }
    return [...offers.values()].sort(
      (a, b) => a.price - b.price || a.item.id.localeCompare(b.item.id)
    );
  }
  function cheaperOffers(ctx, item) {
    const stage = stageNumber(ctx.locationStage);
    const local2 = stage ? collectCheaperOffers(ctx, item, stage) : [];
    return local2.length ? local2 : collectCheaperOffers(ctx, item);
  }
  function stockedPeerOffers(ctx, item) {
    const offers = [];
    for (const ref of item.baitLureDecision?.alternatives || []) {
      const target = findItem(ctx, ref);
      if (!target) continue;
      for (const row of recordedShopRows(target)) {
        const stage2 = stageNumber(row.stage);
        if (row.condition) continue;
        offers.push({ item: target, price: Number(target.priceYen), stages: [stage2] });
      }
    }
    const sorted = offers.sort((a, b) => a.price - b.price || a.item.id.localeCompare(b.item.id));
    const stage = stageNumber(ctx.locationStage);
    const local2 = stage ? sorted.filter((offer) => offer.stages.includes(stage)) : [];
    return local2.length ? local2 : sorted;
  }
  function groupStages(offers) {
    const grouped = /* @__PURE__ */ new Map();
    for (const offer of offers) {
      const key = `${offer.item.category}:${offer.item.id}:${offer.price}`;
      const group = grouped.get(key) || { ...offer, stages: [] };
      for (const stage of offer.stages) {
        if (!group.stages.includes(stage)) group.stages.push(stage);
      }
      grouped.set(key, group);
    }
    return [...grouped.values()].map((offer) => ({
      ...offer,
      stages: offer.stages.sort((a, b) => a - b)
    }));
  }
  function offerLabel(ctx, offer) {
    const c = copy(ctx);
    const areas = offer.stages.map(c.area).join(", ");
    const stage = offer.stages[0];
    const href = ctx.areaItemLink(offer.item, stage);
    const key = `${offer.item.category}:${offer.item.id}`;
    return `<a data-bait-lure-choice="${ctx.esc(key)}" data-offer-stage="${stage}" data-offer-price="${offer.price}" href="${ctx.esc(href)}">${ctx.esc(ctx.itemName(offer.item))} (ID ${ctx.esc(offer.item.id)}) · ¥${ctx.esc(offer.price)} · ${ctx.esc(areas)} ↗</a>`;
  }
  function ownStockNote(ctx, item) {
    const c = copy(ctx);
    const rows = recordedShopRows(item);
    const selected = stageNumber(ctx.locationStage);
    if (!rows.length) return c.noOffer;
    if (selected) {
      const row = rows.find((entry) => stageNumber(entry.stage) === selected);
      if (!row) {
        const conditional = rows.find((entry) => entry.condition);
        if (conditional) return c.notHereConditional(selected, stageNumber(conditional.stage));
        const areas = rows.map((entry) => c.area(stageNumber(entry.stage))).join(", ");
        return c.notHereElsewhere(selected, areas);
      }
      return row.condition ? c.conditional(selected) : c.soldHere(selected, item.priceYen);
    }
    const regular = rows.filter((row) => !row.condition);
    if (regular.length) {
      const areas = regular.map((row) => c.area(stageNumber(row.stage))).join(", ");
      return c.soldElsewhere(areas);
    }
    return c.conditional(stageNumber(rows[0].stage));
  }
  function fishPickerLink(ctx, item) {
    const query = new URLSearchParams({ category: item.category });
    const stage = stageNumber(ctx.locationStage);
    if (stage) query.set("stage", String(stage));
    if (ctx.baitRoute) query.set("route", ctx.baitRoute);
    const href = `${ctx.detailFile("index")}?${query}#fish-filter-label`;
    return `<a data-bait-lure-fish-picker href="${ctx.esc(href)}">${ctx.esc(copy(ctx).chooseFish)} ↗</a>`;
  }
  function routeChoiceLink(ctx, item, route) {
    const stage = stageNumber(ctx.locationStage) || stageNumber(item.playerUse?.shops?.[0]?.stage) || 1;
    const [page, query = ""] = ctx.areaItemLink(item, stage).split("?");
    const params = new URLSearchParams(query);
    params.set("route", route);
    return page + "?" + params;
  }
  function ownUseMarkup(ctx, item) {
    const c = copy(ctx);
    if (item.category !== "bait") return `<p class="bait-lure-owned-action">${ctx.esc(c.ownLure)}</p>`;
    const fishByRoute = item.playerUse?.fishIdsByRoute;
    const routeKey = ctx.baitRoute === "sinker" ? "sinker" : "float";
    const routeName2 = routeKey === "sinker" ? c.sinker : c.float;
    if (!Array.isArray(fishByRoute?.[routeKey])) {
      return `<p class="bait-lure-owned-action">${ctx.esc(c.ownBait(routeName2))}</p>`;
    }
    if (fishByRoute[routeKey].length) {
      return `<p class="bait-lure-owned-action">${ctx.esc(c.ownBait(routeName2))}</p>`;
    }
    const otherRoute = routeKey === "sinker" ? "float" : "sinker";
    const otherName = otherRoute === "sinker" ? c.sinker : c.float;
    if (!fishByRoute[otherRoute]?.length) {
      return `<p class="bait-lure-owned-action">${ctx.esc(c.noBaitFish)}</p>`;
    }
    const link = routeChoiceLink(ctx, item, otherRoute);
    return `<p class="bait-lure-owned-action">${ctx.esc(c.noRouteFish(routeName2))} <a data-bait-lure-route-choice="${otherRoute}" href="${ctx.esc(link)}">${ctx.esc(c.switchRoute(otherName))} ↗</a></p>`;
  }
  function offerSentence(ctx, item, offers) {
    const c = copy(ctx);
    if (!offers.length) {
      const listedPeers = stockedPeerOffers(ctx, item);
      if (listedPeers.length) {
        const peers = groupStages(listedPeers).slice(0, 2);
        return `<p class="bait-lure-stocked-peers"><strong>${ctx.esc(c.coveragePeers)}</strong> ${peers.map((offer) => offerLabel(ctx, offer)).join(" · ")}</p>`;
      }
      return `<p class="bait-lure-no-cheaper">${ctx.esc(c.noCheaper)} ${fishPickerLink(ctx, item)}</p>`;
    }
    const shown = groupStages(offers).slice(0, 2);
    const stage = stageNumber(ctx.locationStage);
    const hasLocalOffer = stage && shown.some((offer) => offer.stages.includes(stage));
    const title = stage ? `${hasLocalOffer ? c.buy : c.elsewhere} · ${c.area(stage)}` : `${c.buy} · ${c.cheaper}`;
    return `<p class="bait-lure-buy-choices"><strong>${ctx.esc(title)}:</strong> ${shown.map((offer) => offerLabel(ctx, offer)).join(" · ")}</p>`;
  }
  function baitLureEvidenceScope(ctx) {
    const label = {
      en: "Bait and lure choices: ",
      ja: "エサ・ルアーの選び方：",
      th: "การเลือกเหยื่อจริงและลัวร์: "
    }[ctx.lang];
    return (label || "Bait and lure choices: ") + copy(ctx).limit;
  }
  function baitLureVerdict(ctx, item, { includeScope = true } = {}) {
    if (!item?.baitLureDecision || !["bait", "lure"].includes(item.category)) return "";
    const offers = cheaperOffers(ctx, item);
    const equal = equalPriceChoice(ctx, item, ctx.allItems, false);
    const buying = !offers.length && equal ? "" : offerSentence(ctx, item, offers);
    const ownUse = ownUseMarkup(ctx, item);
    const stock = ownStockNote(ctx, item);
    const scope = includeScope ? `<p class="bait-lure-evidence-limit">${ctx.esc(copy(ctx).limit)}</p>` : "";
    return `<div class="bait-lure-verdict" data-bait-lure-verdict="${ctx.esc(item.category + ":" + item.id)}">${ownUse}<p class="bait-lure-own-stock">${ctx.esc(stock)}</p>${buying}${equal}${scope}</div>`;
  }

  // src/pages/equipment/item-card.js
  function flyWingActionHrefs(ctx, item, decision, fish) {
    const bodyId = decision.bundle?.body || "01";
    const body = ctx.allItems.find(
      (candidate) => candidate.category === "fly" && candidate.id === bodyId
    );
    const verifiedWing = ctx.allItems.filter(
      (candidate) => candidate.category === "fly_wing" && candidate.id !== item.id && candidate.flyMakerMenuChoice
    ).sort((a, b) => a.id.localeCompare(b.id))[0];
    const shopQuery = new URLSearchParams({
      stage: String(decision.bundle?.stage || 6),
      place: "town",
      category: item.category,
      id: item.id,
      return: ctx.sourceReturn()
    });
    if (fish) shopQuery.set("fish", fish);
    return {
      shop: `${ctx.detailFile("shops")}?${shopQuery}`,
      body: body ? ctx.itemHref(body) : "",
      fish: fish ? ctx.fishHref(fish) : "",
      starter: body && !decision.bundle ? ctx.itemHref(body) : "",
      alternative: verifiedWing ? `${ctx.itemHref(verifiedWing)}#fly-menu-position` : ""
    };
  }
  function itemAdvice(item) {
    return item.rodDecision || item.baitLureDecision || item.gearDecision;
  }
  function areaRodView(ctx, item) {
    const decision = rodAreaDecision(ctx.lang, item, ctx.allItems, ctx.locationStage);
    if (!decision) return item;
    return {
      ...item,
      rodDecision: { ...item.rodDecision, ...decision },
      generalRodDecision: item.rodDecision,
      areaRodDecision: decision
    };
  }
  function isAreaRodOffer(item) {
    return item.areaRodDecision && !["item-unstocked", "style-unstocked", "style-never-stocked"].includes(
      item.areaRodDecision.status
    );
  }
  function cardActionTitle(ctx, item, advice) {
    if (item.rodDecision) return ctx.rodAdviceTitle;
    if (!advice) return ctx.player.use;
    return ctx.lang === "th" ? "ควรซื้อหรือใช้ชิ้นนี้เมื่อไร?" : ctx.lang === "ja" ? "この道具を買う・使うときは？" : "When should I buy or use this?";
  }
  function cardDecisionAttribute(ctx, item, advice) {
    if (!advice) return "";
    const key = item.rodDecision ? "data-rod-decision" : item.baitLureDecision ? "data-bait-lure-decision" : "data-gear-decision";
    return `${key}="${ctx.esc(item.id)}"`;
  }
  function conditionalOfferNote(ctx, item, use) {
    if (item.category !== "bait" || item.id !== "17") return "";
    const offer = use.shops?.find(
      (shop) => shop.condition?.includes("sell at least one Ayu before buying")
    );
    const stage = Number(offer?.stage);
    if (!Number.isInteger(stage) || stage < 1 || stage > 6) return "";
    const note = ctx.lang === "th" ? `ด่าน ${stage}: ต้องขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนซื้อ` : ctx.lang === "ja" ? `エリア${stage}：びくのアユを1匹以上売ってから購入` : `Area ${stage}: sell at least one Ayu from your keepnet before buying`;
    return `<p class="fish-scope conditional-offer-note" data-conditional-offer-note="bait:17" data-offer-stage="${stage}">${ctx.esc(note)}</p>`;
  }
  function renderCardIdentity(ctx, item, use, detailHref) {
    const image = `<a href="${ctx.esc(detailHref)}" aria-label="${ctx.esc(ctx.itemName(item))} — ${ctx.detailLabel}"><img loading="lazy" src="${ctx.esc(item.image)}" alt="${ctx.esc(ctx.itemName(item))}"></a>`;
    const price = item.priceYen > 0 && use.shops?.length && !item.category.startsWith("fly") ? `<span class="price-badge">${ctx.esc(ctx.formatYen(item))}</span>` : "";
    const japanese = ctx.itemName(item) !== item.nameJa ? `<p class="jp-name" lang="ja">${ctx.esc(item.nameJa)}</p>` : "";
    const offerNote = conditionalOfferNote(ctx, item, use);
    return `<div class="card-main"><figure class="sprite">${image}</figure><div class="card-text"><span class="category-tag">${ctx.esc(ctx.categoryNames[item.category])}</span><h3><a class="entity-title" href="${ctx.esc(detailHref)}">${ctx.esc(ctx.itemName(item))}</a></h3>${ctx.thaiLabel(item)}${japanese}<div class="price-row">${price}<span class="item-id">ID ${ctx.esc(item.id)}</span></div>${offerNote}<a class="card-detail-link" href="${ctx.esc(detailHref)}">${ctx.esc(ctx.cardUi.details)} ↗</a></div></div>`;
  }
  function rodAreaAlternativeLinks(ctx, item) {
    const decision = item.areaRodDecision;
    if (!decision?.alternatives?.length) return "";
    const nextStage = decision.status === "style-unstocked" ? decision.nextStockStage : 0;
    const label = nextStage ? ctx.lang === "th" ? `คันรูปแบบเดียวกันที่มีรายการขายในด่าน ${nextStage}` : ctx.lang === "ja" ? `同じ釣り方の販売記録（エリア${nextStage}）` : `Same-style recorded offers in Area ${nextStage}` : item.areaRodDecision.status === "item-unstocked" ? ctx.lang === "th" ? "คันรูปแบบเดียวกันที่มีขายในด่านนี้" : ctx.lang === "ja" ? "このエリアで販売記録がある同じ釣り方の竿" : "Same-style offers recorded in this area" : ctx.lang === "th" ? "คันอื่นที่มีขายในด่านนี้สำหรับเปรียบเทียบ" : ctx.lang === "ja" ? "このエリアで比較できる同じ釣り方の竿" : "Other same-style offers recorded in this area";
    const links = decision.alternatives.map(
      (ref) => ctx.allItems.find(
        (candidate) => candidate.category === ref.category && candidate.id === ref.id
      )
    ).filter(Boolean).map((candidate) => {
      const href = ctx.itemHref(candidate);
      const target = nextStage ? withStage(href, nextStage) : href;
      const stageAttr = nextStage ? ` data-stage="${nextStage}"` : "";
      return `<a class="decision-item" data-rod-area-alternative="${ctx.esc(candidate.id)}"${stageAttr} href="${ctx.esc(target)}"><img src="${ctx.esc(candidate.image)}" alt=""><span>${ctx.esc(ctx.itemName(candidate))}<small>ID ${ctx.esc(candidate.id)}${nextStage ? ` · ${ctx.esc(areaLabel(ctx, nextStage))}` : ""}</small></span></a>`;
    }).join("");
    if (!links) return "";
    const marker = nextStage ? `data-rod-area-next-stock="${nextStage}"` : "data-rod-area-alternatives";
    return `<div class="rod-alternatives" ${marker}><p>${ctx.esc(label)}</p>${links}</div>`;
  }
  function generalRodRouteAdvice(ctx, item) {
    const advice = item.generalRodDecision;
    if (!advice?.recommendation) return "";
    const label = ctx.lang === "th" ? "คำแนะนำเส้นทางทั่วไปทุกด่าน" : ctx.lang === "ja" ? "エリア指定なしの一般ルート案内" : "General route advice across areas";
    return `<details class="general-rod-route-advice"><summary>${label}</summary><p>${ctx.esc(ctx.local(advice.recommendation))}</p>${advice.reason ? `<p>${ctx.esc(ctx.local(advice.reason))}</p>` : ""}</details>`;
  }
  function guideEvidenceNote(ctx, use) {
    if (use.evidence?.type !== "player_guide_report") return "";
    return `<p class="fish-scope">${ctx.lang === "th" ? "คำอธิบายการใช้จากคู่มือผู้เล่น ยังไม่ได้ยืนยันจากโค้ดเกม" : ctx.lang === "ja" ? "用途はプレイヤーガイドによる報告。ゲームコードでは未確認。" : "Use reported by a player guide; not yet confirmed in game code."}</p>`;
  }
  function renderCardDisclosure(ctx, item, use, summary, facts2, advice, wingDecision) {
    const factList = facts2.length ? `<ul class="use-facts">${facts2.map((fact) => `<li>${ctx.esc(fact)}</li>`).join("")}</ul>` : "";
    const recommendation2 = wingDecision ? `<h5>${ctx.esc(ctx.cardUi.fullRecommendation)}</h5><p class="card-full-recommendation">${ctx.esc(wingDecision.recommendation)}</p><p class="card-decision-reason">${ctx.esc(wingDecision.reason)}</p>` : advice ? `<h5>${ctx.esc(ctx.cardUi.fullRecommendation)}</h5><p class="card-full-recommendation">${ctx.esc(ctx.local(advice.recommendation) || summary)}</p>${advice.reason ? `<p class="card-decision-reason">${ctx.esc(ctx.local(advice.reason))}</p>` : ""}` : "";
    const details = [
      recommendation2,
      factList,
      guideEvidenceNote(ctx, use),
      !wingDecision && item.areaRodDecision ? rodAreaAlternativeLinks(ctx, item) : "",
      !wingDecision && advice && !item.areaRodDecision ? ctx.rodAlternatives(item) : "",
      !wingDecision ? generalRodRouteAdvice(ctx, item) : "",
      !wingDecision && advice ? ctx.gearNextActions(item) : "",
      !wingDecision && advice && !item.flyMakerMenuChoice ? ctx.flyMakerLink(item) : ""
    ].join("");
    return ctx.cardDisclosure(
      advice || wingDecision ? ctx.cardUi.decisionDetails : ctx.cardUi.useDetails,
      details,
      advice || wingDecision ? "card-decision-disclosure" : "card-use-disclosure"
    );
  }
  function renderCardGuidance(ctx, item, use, summary, facts2, advice) {
    const fish = document.getElementById("fish-filter")?.value || "";
    const wingDecision = flyWingPlayerDecision(
      ctx.lang,
      item,
      ctx.allItems,
      fish,
      fish ? ctx.fishName(fish) : ""
    );
    const targetAdvice2 = wingDecision ? "" : renderTargetAdvice(ctx, item, fish, { includeScope: false });
    const label = wingDecision?.label || (advice ? ctx.local(advice.label) : summary);
    const lureVerdict = !fish && !wingDecision ? baitLureVerdict(ctx, item, { includeScope: false }) : "";
    const disclosure = renderCardDisclosure(ctx, item, use, summary, facts2, advice, wingDecision);
    const wingLinks = wingDecision ? flyWingPlayerLinks(ctx, wingDecision, flyWingActionHrefs(ctx, item, wingDecision, fish)) : "";
    const actionTitle = targetAdvice2 ? ctx.lang === "th" ? "คำแนะนำสำหรับปลาที่เลือก" : ctx.lang === "ja" ? "選んだ魚への案内" : "Advice for your selected fish" : cardActionTitle(ctx, item, advice);
    const dataDecision = wingDecision ? `data-fly-wing-decision="${ctx.esc(item.id)}"` : cardDecisionAttribute(ctx, item, advice);
    const summaryClass = advice ? "card-verdict" : "card-effect";
    const menuAction = wingDecision ? wingLinks : item.flyMakerMenuChoice ? ctx.flyMakerLink(item) : "";
    const hookTargets = hookTargetLinks(ctx, item);
    const visibleAdvice = item.areaRodDecision ? `<p class="use-summary card-verdict">${ctx.esc(label)}</p>` : targetAdvice2 || lureVerdict ? targetAdvice2 || lureVerdict : `<p class="use-summary ${summaryClass}">${ctx.esc(label)}</p>`;
    const areaMarker = item.areaRodDecision ? ` data-rod-area-decision="${item.areaRodDecision.stage}" data-rod-area-status="${ctx.esc(item.areaRodDecision.status)}"` : "";
    return `<div class="use-block" ${dataDecision}${areaMarker}${foodAreaMarker(ctx.lang, item, ctx.locationStage)}><h4>${ctx.esc(actionTitle)}</h4>${visibleAdvice}${foodAreaAction(ctx, item, ctx.locationStage, ctx.sourceReturn())}${hookTargets}${menuAction}<div class="card-more-content">${disclosure}</div></div>`;
  }
  function renderCardAcquisition(ctx, item) {
    const actions = [
      ctx.baitLurePriceChoices(item),
      ctx.compassUseChoice(item),
      ctx.gatheredBaitChoices(item),
      ctx.baitGatherChoice(item),
      ctx.forageBaitChoice(item, ctx.allItems),
      ctx.mushroomAlternative(item),
      ctx.keepnetAlternatives(item, ctx.allItems),
      ctx.daikonFishChoice(item),
      ctx.acquisitionChoice(item)
    ].join("");
    const sellers = ctx.cardDisclosure(
      ctx.cardUi.buying,
      ctx.shopLocations(item),
      "card-shop-disclosure"
    );
    const choices = ctx.cardDisclosure(ctx.cardUi.moreActions, actions, "card-actions-disclosure");
    const fish = ctx.cardDisclosure(
      `${ctx.fishHeading(item)} · ${ctx.fishIdsFor(item).length}`,
      ctx.fishList(item),
      "card-fish-disclosure"
    );
    return `${sellers}${choices}${fish}${ctx.toolUseLocations(item)}${ctx.detailedFields(item)}`;
  }
  function renderItemCard(ctx, item) {
    const view = areaRodView(ctx, item);
    const use = ctx.useOf(view);
    const areaUse = view.areaRodDecision ? {
      ...use,
      shops: (use.shops || []).filter(
        (shop) => Number(shop.stage) === view.areaRodDecision.stage
      )
    } : use;
    const { summary, facts: facts2 } = ctx.visibleUse(view);
    const advice = itemAdvice(view);
    const detailHref = ctx.itemHref(view);
    const identity = renderCardIdentity(ctx, view, areaUse, detailHref);
    const guidance = renderCardGuidance(ctx, view, use, summary, facts2, advice);
    const details = renderCardAcquisition(ctx, view);
    const poison = view.category === "food" && view.id === "0A" ? "poison-food" : "";
    const offerMarker = isAreaRodOffer(view) ? ' data-selected-area-offer="true"' : "";
    return `<article class="item-card item-card-compact ${poison}" id="item-${view.category}-${view.id}"${offerMarker}>${identity}${guidance}${questNextActions(ctx, view)}${details}</article>`;
  }

  // src/pages/equipment/catalogue-stage.js
  var stages = ["1", "2", "3", "4", "5", "6"];
  var copy2 = {
    th: {
      all: "ทุกด่าน",
      area: "ด่าน",
      note: "เลือกได้เฉพาะด่านที่พบปลานี้; ใช้ด่านเดียวกันในการดูร้านและราคา"
    },
    ja: {
      all: "全エリア",
      area: "エリア",
      note: "この魚がいるエリアを選択。購入場所と価格にも同じエリアを使います。"
    },
    en: {
      all: "All areas",
      area: "Area",
      note: "Choose an area where this fish occurs. Purchase advice and prices use the same area."
    }
  };
  function syncCatalogueStage(ctx, fish) {
    const select = document.getElementById("catalogue-stage");
    if (!select) return;
    const text4 = copy2[ctx.lang] || copy2.en;
    const locations = ctx.fishLocations?.[fish]?.locations || [];
    const available = fish ? locations.map((entry) => String(entry.stage)) : stages;
    const options = fish ? [] : [`<option value="">${ctx.esc(text4.all)}</option>`];
    for (const stage of [...new Set(available)]) {
      const name = locations.find((entry) => String(entry.stage) === stage)?.stageName;
      const label = `${text4.area} ${stage}${name ? " · " + ctx.local(name) : ""}`;
      options.push(`<option value="${stage}">${ctx.esc(label)}</option>`);
    }
    select.innerHTML = options.join("");
    select.value = String(ctx.locationStage || "");
    select.disabled = false;
    const note = document.getElementById("catalogue-stage-note");
    if (note) note.textContent = fish ? text4.note : "";
  }
  function bindCatalogueStage(ctx) {
    document.getElementById("catalogue-stage")?.addEventListener("change", (event) => {
      ctx.locationStage = event.target.value;
      ctx.locationMapIndex = 0;
      ctx.renderCards();
    });
  }

  // src/pages/equipment/purchase-sort-copy.js
  function purchaseSortCopy(lang, stage) {
    const area = /^[1-6]$/.test(String(stage || "")) ? Number(stage) : 0;
    if (lang === "th") {
      const scope2 = area ? `ด่าน ${area}` : "ทุกด่าน (ยังไม่ได้เลือกด่าน)";
      return `เรียงจากของที่มีรายการขายปกติใน${scope2} ราคาต่ำก่อน ตามด้วยของขายแบบมีเงื่อนไข แล้วจึงของที่ไม่มีรายการขายปกติให้เทียบราคา ฟลายต้องซื้อเป็นชุดหรือประกอบ จึงไม่ใช้ราคาชิ้นส่วนมาเทียบ ตรวจเงื่อนไขและราคาในหน้าร้านก่อนซื้อ`;
    }
    if (lang === "ja") {
      const scope2 = area ? `エリア${area}` : "全エリア（エリア未指定）";
      return `${scope2}の通常販売記録を安い順に表示し、条件付き販売、比較できる通常販売価格のないアイテムが続きます。フライはセット購入・作成が必要なため、部品価格で比較しません。購入前に店の条件と価格を確認してください。`;
    }
    const scope = area ? `Area ${area}` : "all areas (no area selected)";
    return `Regular shop offers in ${scope}, cheapest first; conditional offers follow, then entries without a comparable ordinary offer in this scope. Flies require a bundle or recipe, so component prices are not compared. Check the shop conditions and quote before buying.`;
  }
  function rawPriceSortCopy(lang) {
    if (lang === "th")
      return "เรียงตามราคาในข้อมูลเกม ใช้ตรวจสอบเท่านั้น ไม่ได้บอกว่าซื้อได้จริงหรือราคาเต็มของชุดฟลาย หากกำลังเลือกซื้อ ให้ใช้ “มีขายก่อน แล้วเรียงราคา”";
    if (lang === "ja")
      return "ゲームデータ内の価格順で、確認用です。実際に買えるかやフライセットの総額は示しません。購入する道具を選ぶには「販売記録→価格」を使ってください。";
    return "Sorted by the price stored in the game data, for checking only; it does not show what you can really buy or a complete fly price. To choose a purchase, use “Shop availability, then price”.";
  }

  // src/pages/equipment/catalogue-results.js
  var fishCompatibleCategoryOrder = { bait: 0, lure: 1, fly: 2, float_weight: 3 };
  function readFilters() {
    const category = document.getElementById("category-filter").value;
    if (["food", "general_tool"].includes(category)) {
      document.getElementById("fish-filter").value = "";
      document.getElementById("fish-search").value = "";
    }
    return {
      term: document.getElementById("search").value.trim().toLocaleLowerCase(),
      fish: document.getElementById("fish-filter").value,
      category,
      order: document.getElementById("sort-filter").value,
      style: document.getElementById("style-filter").value
    };
  }
  function updateCatalogueLink(ctx, category, fish) {
    const maps = ctx.lang === "th" ? "maps.th.html" : ctx.lang === "ja" ? "maps.ja.html" : "maps.html";
    const query = new URLSearchParams({ return: ctx.sourceReturn(), route: navigationRoute(ctx) });
    if (fish) query.set("fish", fish);
    if (ctx.locationStage) query.set("stage", String(ctx.locationStage));
    query.set("map", String(ctx.locationMapIndex));
    document.getElementById("map-browser-link").href = `${maps}?${query}${fish ? "#map-view" : ""}`;
    const hasCanonicalCoverage = (ctx.decisions || []).some(
      (decision) => decision.id === "lure_coverage_pair"
    );
    const coverageShownInCategory = ["all", "lure"].includes(category) && hasCanonicalCoverage;
    document.getElementById("generic-lure-kit").hidden = Boolean(fish || coverageShownInCategory);
  }
  function updateCatalogueUrl(ctx, category, fish, flyPart) {
    if (typeof history === "undefined" || typeof URLSearchParams === "undefined" || typeof location === "undefined")
      return;
    const query = new URLSearchParams(location.search);
    query.set("category", category);
    if (fish) query.set("fish", fish);
    else query.delete("fish");
    if (category === "flymaker") query.set("part", flyPart);
    else query.delete("part");
    const search = document.getElementById("search").value.trim();
    if (search) query.set("q", search);
    else query.delete("q");
    const style = document.getElementById("style-filter").value;
    if (style) query.set("style", style);
    else query.delete("style");
    query.set("sort", document.getElementById("sort-filter").value || "id");
    if (ctx.locationStage) query.set("stage", String(ctx.locationStage));
    else query.delete("stage");
    if (query.has("map") || ctx.locationMapIndex > 0) query.set("map", String(ctx.locationMapIndex));
    query.set("route", ctx.baitRoute);
    history.replaceState(null, "", `?${query.toString()}${location.hash || "#catalogue"}`);
  }
  function updatePageContext(ctx, filters) {
    ctx.renderTargetCategories(filters.fish);
    updateCatalogueUrl(ctx, filters.category, filters.fish, ctx.flyPart);
    updateCatalogueLink(ctx, filters.category, filters.fish);
    ctx.refreshLanguageLinks?.();
  }
  function routeLabels(ctx) {
    if (ctx.lang === "th") return { float: "ชุดทุ่น", sinker: "ชุดตะกั่ว / หน้าดิน" };
    if (ctx.lang === "ja") return { float: "ウキ仕掛け", sinker: "オモリ仕掛け" };
    return { float: "Float rig", sinker: "Sinker rig" };
  }
  function renderBaitRouteControl(ctx, category) {
    const options = Object.entries(routeLabels(ctx)).map(
      ([route, label]) => `<button type="button" data-route="${route}" aria-pressed="${ctx.baitRoute === route}">${label}</button>`
    ).join("");
    document.getElementById("bait-route-menu").innerHTML = ["bait", "all"].includes(category) ? options : "";
  }
  function flyPartLabels(ctx) {
    if (ctx.lang === "th") return { fly: "บอดี้", fly_wing: "ปีก", fly_tail: "หาง" };
    if (ctx.lang === "ja") return { fly: "ボディ", fly_wing: "ウイング", fly_tail: "テール" };
    return { fly: "Body", fly_wing: "Wing", fly_tail: "Tail" };
  }
  function renderFlyPartControl(ctx, category) {
    const choices = Object.entries(flyPartLabels(ctx)).map(
      ([part, label]) => `<button type="button" data-part="${part}" aria-pressed="${ctx.flyPart === part}">${label}</button>`
    ).join("");
    const guide = `<a href="#fly-instructions" data-guide>${ctx.lang === "th" ? "ดูขั้นตอนประกอบ" : ctx.lang === "ja" ? "作成手順" : "Assembly steps"} ↗</a>`;
    document.getElementById("fly-part-menu").innerHTML = category === "flymaker" ? choices + guide : "";
  }
  function renderCategoryControls(ctx, category) {
    const fishPickerHidden = ["food", "general_tool"].includes(category);
    document.getElementById("fish-picker").hidden = fishPickerHidden;
    if (fishPickerHidden) ctx.closeFishSuggestions?.();
    renderBaitRouteControl(ctx, category);
    document.getElementById("style-label").hidden = category !== "rod";
    renderFlyPartControl(ctx, category);
  }
  function fishMatchesItem(ctx, item, filters) {
    if (!filters.fish) return true;
    if (["rod", "hook"].includes(filters.category)) return true;
    if (["bait", "lure", "fly", "float_weight"].includes(item.category) && ctx.fishIdsFor(item).includes(filters.fish))
      return true;
    return filters.category === "flymaker" && ctx.flyPart !== "fly" && ctx.flyBundlePartFor(item, filters.fish);
  }
  function matchesSearch(ctx, item, term) {
    if (!term) return true;
    const values = [
      item.search,
      ctx.itemName(item),
      ctx.local(ctx.useOf(item).summary),
      ...ctx.fishIdsFor(item).map(ctx.fishName)
    ];
    return values.join(" ").toLocaleLowerCase().includes(term);
  }
  function matchesFilters(ctx, item, filters) {
    return ctx.matchCategory(item, filters.category) && (filters.category !== "bait" || ctx.baitRoute !== "sinker" || ctx.fishIdsFor(item).length > 0) && (filters.category !== "flymaker" || item.category === ctx.flyPart) && (filters.category !== "rod" || !filters.style || String(item.decodedFields.styleCode) === filters.style) && fishMatchesItem(ctx, item, filters) && matchesSearch(ctx, item, filters.term);
  }
  function filterCatalogueItems(ctx, filters) {
    return ctx.allItems.filter((item) => matchesFilters(ctx, item, filters));
  }
  function sortCatalogueItems(ctx, items, filters) {
    const { order, category, fish } = filters;
    if (order === "buy-price") return sortItemsByShopAvailability(items, ctx.locationStage);
    if (order === "name")
      return items.sort(
        (a, b) => ctx.itemName(a).localeCompare(ctx.itemName(b), ctx.lang) || a.id.localeCompare(b.id)
      );
    if (order === "price")
      return items.sort(
        (a, b) => (a.priceYen ?? Infinity) - (b.priceYen ?? Infinity) || a.id.localeCompare(b.id)
      );
    if (category === "all" && fish)
      return items.sort(
        (a, b) => (fishCompatibleCategoryOrder[a.category] ?? 4) - (fishCompatibleCategoryOrder[b.category] ?? 4) || a.id.localeCompare(b.id)
      );
    return items;
  }
  function categoryTitle(ctx, category, fish) {
    if (!fish || category !== "all") return ctx.player.cat[category] || ctx.player.all;
    if (ctx.lang === "th") return `รายการที่ผ่านเงื่อนไขของ${ctx.fishName(fish)}`;
    if (ctx.lang === "ja") return `${ctx.fishName(fish)}の条件に合うアイテム`;
    return `Items compatible with ${ctx.fishName(fish)}`;
  }
  function categoryDescription(ctx, category, fish) {
    if (!fish || category !== "all") return ctx.player.desc[category] || ctx.player.lead;
    if (ctx.lang === "th")
      return "แสดงเฉพาะรายการที่ผ่านเงื่อนไขจาก ROM ของปลานี้ โดยลำดับเริ่มต้นแบบ ID จะแสดงเหยื่อจริงก่อน ตามด้วยลัวร์/ฟลาย แล้วจึงทุ่นและตะกั่ว";
    if (ctx.lang === "ja")
      return "この魚のROM適合判定を通るアイテムのみ表示。初期設定のID順では、エサ、ルアー／フライ、ウキ・オモリの順に表示します。";
    return "Only items that pass this fish’s ROM compatibility checks are shown. By default, the ID order shows bait first, then lures and flies, followed by floats and sinkers.";
  }
  function fishStatus(ctx, filters) {
    if (!filters.fish)
      return ["bait", "lure", "all"].includes(filters.category) ? baitLureEvidenceScope(ctx) : "";
    if (["rod", "hook"].includes(filters.category)) {
      if (ctx.lang === "th")
        return "แสดงอุปกรณ์ทั้งหมวดสำหรับเลือกทั่วไป ไม่ได้จัดว่าเหมาะกับปลานี้หรือช่วยเพิ่มโอกาสตกได้";
      if (ctx.lang === "ja")
        return "一般的な装備一覧です。この魚への適合や釣果向上を示すものではありません。";
      return "Showing the full equipment category for general selection; this does not establish fish compatibility or a catch advantage.";
    }
    if (filters.category === "bait") return `${ctx.player.fishOnly} · ${targetAdviceScope(ctx)}`;
    if (["lure", "all"].includes(filters.category)) return targetAdviceScope(ctx);
    if (filters.category === "flymaker" && ctx.flyPart !== "fly") {
      if (ctx.lang === "th")
        return "แสดงชิ้นส่วนที่ร้านขายพร้อมบอดี้ซึ่งผ่านเงื่อนไขปลานี้ ไม่ได้ยืนยันว่าปีกหรือหางเพิ่มโอกาสกิน";
      if (ctx.lang === "ja")
        return "この魚の条件を通るボディと一緒に販売される部品です。ウイング・テールの食いつき向上は未確認。";
      return "Showing parts sold with a body that passes this fish’s compatibility check; a wing or tail bite bonus is not established.";
    }
    if (filters.category === "flymaker" && ctx.flyPart === "fly") {
      if (ctx.lang === "th")
        return "แสดงบอดี้ฟลายที่ผ่านเงื่อนไขโปรไฟล์ของปลานี้ ไม่ได้รับประกันว่าปลากินหรือตกขึ้นได้";
      if (ctx.lang === "ja")
        return "この魚のボディプロフィール判定を通るフライボディです。食いつき・釣り上げは保証されません。";
      return "Showing fly bodies whose body-profile check passes for this fish; a bite or catch is not guaranteed.";
    }
    if (ctx.lang === "th")
      return "แสดงรายการในหมวดนี้ที่ผ่านเงื่อนไขจาก ROM ของปลาที่เลือก แต่ไม่ได้ยืนยันว่าปลากินหรือตกขึ้นได้";
    if (ctx.lang === "ja")
      return "選択した魚のROM条件を通るカテゴリー内アイテムです。食いつき・釣り上げは保証されません。";
    return "Showing items in this category that pass the selected fish’s ROM compatibility check; a bite or catch is not guaranteed.";
  }
  function updateCatalogueHeadings(ctx, filters) {
    ctx.set("#category-title", categoryTitle(ctx, filters.category, filters.fish));
    ctx.set("#category-description", categoryDescription(ctx, filters.category, filters.fish));
    ctx.set(
      "#fish-status",
      filters.fish ? `${ctx.fishName(filters.fish)} — ${fishStatus(ctx, filters)}` : fishStatus(ctx, filters)
    );
  }
  function emptyCatalogueMessage(ctx, fish) {
    if (!fish) return ctx.copy.empty;
    if (ctx.lang === "th")
      return "ไม่มีรายการที่ยืนยันว่าใช้กับปลานี้ได้ในหมวดและคำค้นที่เลือก ลองหมวดอื่น หรือกด × เพื่อล้างปลาเป้าหมาย";
    if (ctx.lang === "ja")
      return "選択した種類・検索条件では、この魚に対応する確認済みアイテムがありません。別の種類、または×で魚の指定を解除。";
    return "No verified compatible item matches this category and search. Try another category, or clear the target with ×.";
  }
  function emptyBaitRouteCandidates(ctx, filters) {
    if (filters.category !== "bait" || !filters.term || filters.fish && !ctx.fishVisuals[filters.fish] || ctx.baitRoute !== "sinker")
      return [];
    return ctx.allItems.filter((item) => {
      const routes = item.category === "bait" ? item.playerUse?.fishIdsByRoute : null;
      if (!Array.isArray(routes?.sinker) || routes.sinker.length) return false;
      if (!Array.isArray(routes.float) || !routes.float.length) return false;
      if (filters.fish && !routes.float.includes(filters.fish)) return false;
      return matchesSearch(ctx, item, filters.term);
    });
  }
  function emptyBaitRouteHref(ctx, filters) {
    const query = new URLSearchParams(location.search);
    const search = document.getElementById("search").value.trim();
    query.set("category", "bait");
    query.set("route", "float");
    if (search) query.set("q", search);
    else query.delete("q");
    if (filters.fish) query.set("fish", filters.fish);
    else query.delete("fish");
    if (ctx.locationStage) query.set("stage", String(ctx.locationStage));
    return `${location.pathname.split("/").pop()}?${query}#catalogue`;
  }
  function emptyBaitRouteRecovery(ctx, filters) {
    const candidates = emptyBaitRouteCandidates(ctx, filters);
    if (!candidates.length) return "";
    const copy3 = {
      th: {
        text: (count, fish2) => fish2 ? `คำค้นตรงกับเหยื่อ ${count} รายการ แต่ข้อมูลที่ตรวจไม่มีรายการสายตะกั่วสำหรับปลาที่เลือก ${ctx.fishName(fish2)}; ปลานี้อยู่ในรายชื่อสายทุ่นของรายการที่ตรงคำค้น` : `คำค้นตรงกับเหยื่อ ${count} รายการ แต่ยังไม่มีปลาในรายการสายตะกั่วที่บันทึกไว้ จึงไม่แสดงเป็นตัวเลือกสำหรับชุดนี้`,
        action: "สลับไปดูชุดทุ่นที่ใช้ได้กับคำค้นนี้"
      },
      ja: {
        text: (count, fish2) => fish2 ? `検索結果のエサ${count}件には、選択した${ctx.fishName(fish2)}のオモリ仕掛け判定が記録されていません。この魚は検索結果のウキ仕掛けリストにあります。` : `検索に一致するエサは${count}件ですが、オモリ仕掛けで通る魚は記録されていないため、この仕掛けの候補には表示しません。`,
        action: "ウキ仕掛けでこの検索結果を見る"
      },
      en: {
        text: (count, fish2) => fish2 ? `${count} bait item(s) match this search, but no Sinker match is recorded for selected ${ctx.fishName(fish2)}. This fish is listed for the Float rig among the search matches.` : `${count} bait item(s) match this search, but no fish is recorded for the Sinker rig, so they are not shown as choices for this setup.`,
        action: "Switch to Float rig for this search"
      }
    }[ctx.lang] || {
      text: (count) => `${count} bait item(s) match, but no fish is recorded for the Sinker rig.`,
      action: "Switch to Float rig"
    };
    const fish = filters.fish || "";
    return `<section class="empty-state" data-empty-bait-route="sinker"><p>${ctx.esc(copy3.text(candidates.length, fish))}</p><a class="route-button" data-empty-bait-switch="float" href="${ctx.esc(emptyBaitRouteHref(ctx, filters))}">${ctx.esc(copy3.action)} ↗</a></section>`;
  }
  function renderItemResults(ctx, items, filters) {
    const box = document.getElementById("cards");
    if (!items.length) {
      box.innerHTML = emptyBaitRouteRecovery(ctx, filters) || `<p class="empty-state">${ctx.esc(emptyCatalogueMessage(ctx, filters.fish))}</p>`;
      return;
    }
    box.innerHTML = items.map(ctx.renderItemCard).join("");
  }
  function renderResults(ctx, items, filters) {
    ctx.set("#result-count", ctx.copy.results(items.length));
    const sortNote = document.getElementById("purchase-sort-note");
    if (sortNote) {
      sortNote.hidden = !["buy-price", "price"].includes(filters.order);
      sortNote.textContent = filters.order === "buy-price" ? purchaseSortCopy(ctx.lang, ctx.locationStage) : filters.order === "price" ? rawPriceSortCopy(ctx.lang) : "";
    }
    updateCatalogueHeadings(ctx, filters);
    document.querySelectorAll("[data-category]").forEach(
      (node) => node.setAttribute(
        "aria-current",
        node.dataset.category === filters.category ? "true" : "false"
      )
    );
    ctx.renderComparison(filters.category);
    ctx.renderDecisions(filters.category);
    renderItemResults(ctx, items, filters);
  }
  function renderCards(ctx) {
    const filters = readFilters();
    updatePageContext(ctx, filters);
    renderCategoryControls(ctx, filters.category);
    ctx.renderFishLocation(filters.fish);
    syncCatalogueStage(ctx, filters.fish);
    const items = sortCatalogueItems(ctx, filterCatalogueItems(ctx, filters), filters);
    renderResults(ctx, items, filters);
    updatePageContext(ctx, filters);
  }

  // src/pages/equipment/copy_en.js
  var copy_en = {
    title: "Kawa no Nushi Tsuri 2 — Item Catalogue & ROM Research",
    lead: "A searchable catalogue of the game’s rods, lures, fly parts, baits, hooks, floats, food and tools—with ROM fields we could verify and clear notes where a stat is still a mystery.",
    edition: "SFC / SNES · JAPAN VERSION",
    entries: (n) => `${n} listed entries`,
    sampleKicker: "A FEW DECODED EXAMPLES",
    sampleTitle: "The numbers finally have context",
    sampleCopy: "The ROM stores real numeric fields, but many are internal selectors rather than familiar “power” or “bite rate” stats. These examples show exact values and what the game code does with them.",
    item: "Item",
    rom: "ROM fields we can explain",
    price: "ROM price field",
    flyKicker: "THE CUSTOM FLY MAKER",
    flyTitle: "Body, wing, tail… and a real price quote",
    flyCopy: "Original Japanese game captures show the verified ¥25 default recipe and ¥17 no-tail example. Choose a body for your target fish first; these examples explain menu input and price, not which fly catches best.",
    flyFact: "Check the final quote before paying. The recorded first-body + first-wing + first-tail Mayfly order cost ¥25. Choosing “None” changes the recipe, so read its quote separately. Other recipes do not share a fixed ¥25 price.",
    catalogueKicker: "THE FULL INDEX",
    catalogueTitle: "Browse all 315 listed entries",
    catalogueCopy: "Search either language, an item ID, or a stat. Open any card for its details, including the raw game data for anyone who wants to check.",
    search: "Search",
    searchPlaceholder: "Try “rod”, “トップウォータ”, or “0D”",
    category: "Category",
    sort: "Sort",
    all: "All categories",
    sortId: "Item ID",
    sortName: "Name",
    sortPrice: "Price in game data",
    sortBuyPrice: "Shop availability, then price",
    results: (n) => `${n} entries shown`,
    empty: "No matching entries. Try another name or ID.",
    noPrice: "No price field",
    yen: "¥",
    imageNote: "Authentic game capture",
    openFrame: "Open full game-screen capture ↗",
    details: "ROM record and field notes",
    offset: "File offset",
    bytes: "Raw bytes",
    decoded: "Decoded fields",
    none: "No table record supplied for this entry.",
    confidence: "Evidence",
    japanese: "Japanese game label",
    priceField: "ROM price field",
    zeroPrice: "0 yen in the ROM table; not evidence that it is free or sold in a shop.",
    methodKicker: "HOW TO READ THIS",
    methodTitle: "Confirmed, translated, and still unknown",
    sourcesTitle: "Sources and method",
    footer: "Independent fan research. No ROM file is included.",
    readme: "Project notes",
    langLink: "日本語",
    customFrames: [
      "First-stage shop: fly-family choice.",
      "Mayfly body palette.",
      "After choosing a body: wing palette.",
      "After choosing a wing: tail sprites plus a separate “None” choice.",
      "One combination quoted at ¥25.",
      "After the order was accepted."
    ],
    quick: {
      "rod:0A": "Cast/aim hold-time cutoff 70; reach multiplier 15 × 336 = 5,040 internal units. Under 100 HP the cutoff scales with current HP (minimum 10).",
      "rod:0D": "Cast/aim hold-time cutoff 120; reach multiplier 24 × 336 = 8,064 internal units. Under 100 HP the cutoff scales with current HP (minimum 10).",
      "lure:12": "Action branch 9; conditional fish-ID comparison value 11 → Black bass. Changes a behavior path; does not prove an exclusive target or bonus.",
      "lure:21": "Action branch 7; conditional fish-ID comparison value 38 → Namazu. Changes a behavior path; does not prove an exclusive target or bonus.",
      "lure:51": "Action branch 5; conditional fish-ID comparison value 55 → Akame. Changes a behavior path; does not prove an exclusive target or bonus.",
      "food:01": "Runtime-measured recovery: 5 HP.",
      "food:0A": "Runtime-measured result: HP becomes 0."
    },
    fieldNames: {
      styleCode: "Rod style code",
      castAimHoldCutoffInternal: "Cast/aim hold-time cutoff",
      rangeMultiplier: "Reach multiplier",
      rangeInternalValueAtBase0x0150: "Reach threshold (internal units)",
      fishIdMatchCode: "Fish-ID comparison code",
      fightResponseCode: "Fight-response branch selector",
      specialFishComparisonID: "Fish-ID comparison value",
      fishHookGateMaskHex: "Lure-hook gate mask (16 bit)",
      flyBaitMaskHex: "Fly body acceptance mask"
    },
    noteNoJs: "Enable JavaScript to load the searchable catalogue."
  };

  // src/pages/equipment/copy_th.js
  var copy_th = {
    title: "ตกตัวไหน ใช้อะไร ไปที่ไหน",
    lead: "ค้นปลา เลือกอุปกรณ์ที่ใช้ได้ แล้วเปิดจุดตกบนแผนที่",
    edition: "SFC / SNES · ฉบับญี่ปุ่น",
    entries: "มีข้อมูล {n} รายการ",
    sampleKicker: "ตัวอย่างค่าที่ถอดความหมายได้",
    sampleTitle: "ดูค่าตัวเลขพร้อมความหมายที่ตรวจสอบแล้ว",
    sampleCopy: "ROM เก็บตัวเลขไว้หลายแบบ แต่หลายค่าเป็นตัวควบคุมภายใน ไม่ใช่ค่าสถานะอย่าง “พลัง” หรือ “โอกาสปลากินเหยื่อ” ตัวอย่างนี้แสดงค่าจริงและสิ่งที่โค้ดเกมทำกับมัน",
    item: "ไอเท็ม",
    rom: "ช่องข้อมูล ROM ที่อธิบายได้",
    price: "ช่องราคาใน ROM",
    flyKicker: "เมนูประกอบฟลาย",
    flyTitle: "เลือกบอดี้ ปีก หาง พร้อมตรวจราคาจริง",
    flyCopy: "ภาพเกมญี่ปุ่นจริง แสดงชุดเริ่มต้น ¥25 และตัวอย่างไม่มีหาง ¥17 เลือกบอดี้ตามปลาเป้าหมายก่อน ตัวอย่างนี้สอนปุ่มและราคา ไม่ใช่คำแนะนำว่าชุดไหนจับปลาดีที่สุด",
    flyFact: "ตรวจราคาสุทธิก่อนจ่าย ชุดเมย์ฟลายบอดี้แรก + ปีกแรก + หางแรกที่ทดลองคิด ¥25 ถ้าเลือก “ไม่มี” แทนหาง ชุดจะเปลี่ยน ให้ดูราคาของชุดนั้นแยกต่างหาก ไม่ใช่ว่าทุกชุดราคา ¥25",
    catalogueKicker: "รายการไอเท็มทั้งหมด",
    catalogueTitle: "ค้นหาข้อมูลทั้ง 315 รายการ",
    catalogueCopy: "ค้นด้วยชื่อภาษาไทยที่ถอดจากภาพแล้ว ภาษาอังกฤษ ญี่ปุ่น หรือเลข ID ได้ เปิดการ์ดเพื่อดูรายละเอียด และข้อมูลดิบจากเกมสำหรับผู้ที่อยากตรวจสอบ",
    search: "ค้นหา",
    searchPlaceholder: "ลองพิมพ์ชื่อไอเท็ม หรือ ID เช่น 0D",
    category: "ประเภท",
    sort: "เรียงตาม",
    all: "ทุกประเภท",
    sortId: "ID ไอเท็ม",
    sortName: "ชื่อ",
    sortPrice: "ราคาในข้อมูลเกม",
    sortBuyPrice: "มีขายก่อน แล้วเรียงราคา",
    results: "แสดง {n} รายการ",
    empty: "ไม่พบรายการที่ตรงกัน ลองค้นด้วยชื่อหรือ ID อื่น",
    noPrice: "ไม่มีช่องราคา",
    yen: "¥",
    imageNote: "ภาพจากเกมจริง",
    openFrame: "เปิดภาพหน้าจอเกมเต็ม ↗",
    details: "ระเบียน ROM และคำอธิบายฟิลด์",
    offset: "ตำแหน่งในไฟล์",
    bytes: "ไบต์ดิบ",
    decoded: "ฟิลด์ที่อธิบายความหมายได้",
    none: "ไม่มีระเบียนตารางสำหรับรายการนี้",
    confidence: "หลักฐาน",
    japanese: "ชื่อที่แสดงในเกมภาษาญี่ปุ่น",
    priceField: "ช่องราคาใน ROM",
    zeroPrice: "ค่าในตาราง ROM เป็น 0 เยน แต่ยังยืนยันไม่ได้ว่าไอเท็มนี้ฟรีหรือมีขายในร้าน",
    methodKicker: "วิธีอ่านข้อมูล",
    methodTitle: "แยกข้อมูลที่ยืนยัน คำแปล และค่าที่ยังไม่รู้",
    sourcesTitle: "แหล่งข้อมูลและวิธีค้นคว้า",
    footer: "งานค้นคว้าอิสระของแฟนเกม ไม่มีไฟล์ ROM รวมอยู่ด้วย",
    readme: "รายละเอียดโครงการ",
    langLink: "English / 日本語",
    customFrames: [
      "ร้านในด่านแรก: เลือกประเภทฟลาย",
      "หน้าจอเลือกบอดี้เมย์ฟลาย",
      "หลังเลือกบอดี้: หน้าจอเลือกปีก",
      "หลังเลือกปีก: ภาพหางและตัวเลือก “ไม่มี” แยกต่างหาก",
      "ตัวอย่างชุดที่ประเมินราคา 25 เยน",
      "หลังยืนยันการสั่งทำ"
    ],
    quick: {
      "rod:0A": "ตัวนับค้างเล็ง/ปล่อยเหยื่อ 70; เกณฑ์ระยะ 15 × 336 = 5,040 หน่วยภายใน หาก HP ต่ำกว่า 100 ตัวนับช่วงเล็งจะลดตาม HP (ขั้นต่ำ 10) ไม่ใช่พลังสู้ปลา",
      "rod:0D": "ตัวนับค้างเล็ง/ปล่อยเหยื่อ 120; เกณฑ์ระยะ 24 × 336 = 8,064 หน่วยภายใน หาก HP ต่ำกว่า 100 ตัวนับช่วงเล็งจะลดตาม HP (ขั้นต่ำ 10) ไม่ใช่พลังสู้ปลา",
      "lure:12": "รหัสแขนงการทำงาน 9; มีการเทียบ ID ปลาแบบมีเงื่อนไขกับค่า 11 → Black bass (ブラックバス) ทำให้เข้าเส้นทางการทำงานอีกแบบ ไม่ได้ยืนยันว่าใช้ได้เฉพาะปลานี้หรือมีโบนัส",
      "lure:21": "รหัสแขนงการทำงาน 7; มีการเทียบ ID ปลาแบบมีเงื่อนไขกับค่า 38 → Namazu (ナマズ) ทำให้เข้าเส้นทางการทำงานอีกแบบ ไม่ได้ยืนยันว่าใช้ได้เฉพาะปลานี้หรือมีโบนัส",
      "lure:51": "รหัสแขนงการทำงาน 5; มีการเทียบ ID ปลาแบบมีเงื่อนไขกับค่า 55 → Akame (アカメ) ทำให้เข้าเส้นทางการทำงานอีกแบบ ไม่ได้ยืนยันว่าใช้ได้เฉพาะปลานี้หรือมีโบนัส",
      "food:01": "ผลที่วัดในเกม: ฟื้น HP 5 หน่วย",
      "food:0A": "ผลที่วัดในเกม: HP กลายเป็น 0"
    },
    fieldNames: {
      styleCode: "รหัสรูปแบบการตกของคันเบ็ด",
      castAimHoldCutoffInternal: "เกณฑ์ตัวนับค้างเล็ง/ปล่อยเหยื่อ",
      rangeMultiplier: "ตัวคูณระยะ",
      rangeInternalValueAtBase0x0150: "เกณฑ์ระยะ (หน่วยภายในเกม)",
      fishIdMatchCode: "รหัสเทียบ ID ปลา",
      fightResponseCode: "รหัสแขนงการตอบสนองช่วงสู้ปลา",
      specialFishComparisonID: "ค่า ID ปลาที่ใช้เทียบ",
      fishHookGateMaskHex: "มาสก์เงื่อนไขรับลัวร์ (16 บิต)",
      flyBaitMaskHex: "mask รับเหยื่อจากบอดี้ฟลาย"
    },
    noteNoJs: "เปิด JavaScript เพื่อโหลดแค็ตตาล็อกแบบค้นหาได้",
    researchNotes: [
      "แค็ตตาล็อกนี้ลงรายการที่มีชื่อหรือภาพให้ตรวจสอบได้ครบ 315 รายการ: คันเบ็ด 21, เหยื่อปลอม 81, บอดี้ฟลาย 64, ปีก 47, หาง 23, เหยื่อ 23, ตะขอ 13, ทุ่น/ตะกั่ว 10, อาหาร 10 และอุปกรณ์/ไอเท็มเควสต์ 23 ชิ้นส่วนบอดี้ 64 + ปีก 47 + หาง 23 ครบระเบียนฟลายทั้ง 134 รายการในตาราง ROM",
      "แสดงระเบียนตารางฟลายทั้ง 134 รายการ แบ่งเป็นบอดี้ 64 ปีก 47 และหาง 23 โดยตัด ID 87 ซึ่งเป็นรหัสว่าไม่มีไอเท็มออก",
      "ช่องราคาใน ROM ไม่ได้ยืนยันว่าร้านใดมีไอเท็มขาย และช่องราคา 0 ก็ไม่ได้ยืนยันว่าได้มาฟรี ค่าราคาของชิ้นส่วนฟลายเป็นราคาของชิ้นส่วน ไม่ใช่ราคาขายปลีกของฟลายที่ประกอบเสร็จแล้ว",
      "คู่มือ SFC ภาษาญี่ปุ่นอธิบายประเภทคันเบ็ด ทุ่น เครื่องหมายบนสาย ตะกั่ว ตะขอ เหยื่อ และตระกูลฟลาย ชื่อภาษาอังกฤษในรายการเป็นคำแปล ส่วนชื่อญี่ปุ่นคงข้อความที่พบในเกม",
      "ตรวจเมนูช่างประกอบฟลายในร้านด่านแรกโดยตรง: เลือกประเภท บอดี้ ปีก หางหรือ “ไม่มี” แล้วจึงยืนยัน ชุดเริ่มต้นที่ตรวจราคา 25 เยน (5 + 5 + 15) ไม่ใช่ราคากลางของทุกชุด จำนวนภาพปีกที่เคยนับยังไม่ตรงกับรายการ ROM จึงไม่ใช้เป็นจำนวนตัวเลือกที่ยืนยันแล้ว",
      "ภาพจับจาก ROM ญี่ปุ่นที่ผู้ใช้ให้มา ซึ่งไม่ได้ดัดแปลง ในการจำลอง Snes9x แบบแยกสำหรับไอเท็มที่ซ่อนอยู่ เราเขียน ID ของไอเท็มที่ถูกต้องลง WRAM ชั่วคราวเพื่อให้ตัวเกมเป็นผู้วาดภาพ ไม่ได้ใช้ภาพที่สร้างด้วย AI",
      "ชื่อไทยที่มีภาพประกอบใต้ชื่อไอเท็ม จับจากแพตช์ไทย V1.2 โดยตรง หากยังอ่านตัวสะกดจากภาพไม่ชัด จะคงชื่อญี่ปุ่นไว้ให้เทียบกับภาพ ชื่อปลาที่ถือในเมนูอาหารเปลี่ยนตามปลาตัวนั้น ส่วนคำอธิบายค่าต่าง ๆ เป็นคำแปลสำหรับเว็บไซต์จากผลวิจัย ROM ญี่ปุ่นต้นฉบับ"
    ],
    customizerFrames: [
      "ร้านในด่านแรก: เลือกประเภทฟลาย",
      "หน้าจอเลือกบอดี้เมย์ฟลาย",
      "หลังเลือกบอดี้: หน้าจอเลือกปีก",
      "หลังเลือกปีก: ภาพหางและตัวเลือก “ไม่มี” แยกต่างหาก",
      "ตัวอย่างชุดที่ประเมินราคา 25 เยน",
      "หลังยืนยันการสั่งทำ"
    ],
    sources: [
      {
        title: "คู่มือ SFC ต้นฉบับ: 川のぬし釣り2",
        detail: "ภาพสแกนคู่มือ ใช้อ้างอิงหน้าที่ทั่วไปของอุปกรณ์และคำเรียกประเภทฟลาย"
      },
      {
        title: "รายการไอเท็มและการสำรวจหน่วยความจำโดยชุมชนผู้เล่น",
        detail: "ข้อมูลประกอบสำหรับ ID ชื่อไอเท็ม และจำนวนที่ถือได้ รายการนี้ตรวจทานกับระเบียน ROM และชื่อภาษาญี่ปุ่นในเกม"
      },
      {
        title: "ข้อมูลระบุ ROM ที่ใช้ในการค้นคว้า",
        detail: "ROM ญี่ปุ่นต้นฉบับที่ผู้ใช้แนบมา ขนาด 1,572,864 ไบต์; SHA-1 c2103dd94e2a1a65a495fc02adc2e7d040f31212"
      }
    ]
  };

  // src/pages/equipment/copy_ja.js
  var copy_ja = {
    title: "川のぬし釣り2 — アイテム一覧・ROM解析",
    lead: "竿、ルアー、毛バリ部品、餌、針、ウキ、食料、道具を検索できる一覧。ROMで確認できた数値と、まだ意味が分からない値を分けて掲載。",
    edition: "SFC · 日本版",
    entries: (n) => `掲載 ${n} 件`,
    sampleKicker: "解読できた数値の例",
    sampleTitle: "数字の意味をゲーム処理と照合",
    sampleCopy: "ROMには数値が保存されていますが、「強さ」や「ヒット率」のような単純な能力値とは限りません。実際の値と、ゲーム内コードでの使われ方を例示します。",
    item: "アイテム",
    rom: "意味を確認できたROM値",
    price: "ROM価格欄",
    flyKicker: "毛バリ作成NPC",
    flyTitle: "ボディ、ウィング、テール、そして見積もり",
    flyCopy: "日本版の実画面で25円の初期構成と17円のテール無し例を確認。先に対象魚に合うボディを選んでください。この例は操作と価格の説明で、最強フライの推薦ではありません。",
    flyFact: "支払前に最終見積額を確認する。記録したメイフライの最初のボディ・ウィング・テールは25円。「無し」にすると組み合わせが変わるため、その見積額を別に確認する。全組み合わせが25円ではない。",
    catalogueKicker: "全アイテム一覧",
    catalogueTitle: "掲載315件を検索",
    catalogueCopy: "英語・日本語、アイテムID、数値で検索できます。各カードを開くと詳細を確認できます。確認したい人向けにゲームの生データも載せています。",
    search: "検索",
    searchPlaceholder: "例: 「rod」「トップウォータ」「0D」",
    category: "カテゴリ",
    sort: "並び順",
    all: "すべてのカテゴリ",
    sortId: "アイテムID",
    sortName: "名前",
    sortPrice: "ゲームデータ内の価格",
    sortBuyPrice: "販売記録→価格",
    results: (n) => `${n}件を表示`,
    empty: "一致するアイテムはありません。名前かIDを変えてください。",
    noPrice: "価格欄なし",
    yen: "¥",
    imageNote: "ゲーム画面から取得",
    openFrame: "ゲーム画面全体を開く ↗",
    details: "ROMレコードとフィールド",
    offset: "ファイル位置",
    bytes: "生バイト列",
    decoded: "解読済みフィールド",
    none: "この項目のテーブルレコードはありません。",
    confidence: "根拠",
    japanese: "ゲーム内の日本語表記",
    priceField: "ROM価格欄",
    zeroPrice: "ROMの値は0円。無料・店頭販売を意味すると確認されたわけではありません。",
    methodKicker: "読み方",
    methodTitle: "確認済み、翻訳、未解読を区別",
    sourcesTitle: "出典と調査方法",
    footer: "ファンによる独立調査。ROMファイルは含みません。",
    readme: "プロジェクトノート",
    langLink: "English",
    customFrames: [
      "ステージ1の店: 毛バリの系統選択。",
      "メイフライのボディ選択。",
      "ボディ選択後: ウィング選択。",
      "ウィング選択後: テール画像と別枠の「無し」。",
      "ある組み合わせの見積もり: 25円。",
      "注文を確定した後。"
    ],
    quick: {
      "rod:0A": "投げ・照準の保持時間上限70。距離判定係数15 × 336 = 内部値5,040。HP100未満ではHPに応じて上限が縮小（最低10）。",
      "rod:0D": "投げ・照準の保持時間上限120。距離判定係数24 × 336 = 内部値8,064。HP100未満ではHPに応じて上限が縮小（最低10）。",
      "lure:12": "動作分岐9。魚ID比較値11 → ブラックバス。一致時は別処理に入る。対象魚専用やボーナスとは確認されていない。",
      "lure:21": "動作分岐7。魚ID比較値38 → ナマズ。一致時は別処理に入る。対象魚専用やボーナスとは確認されていない。",
      "lure:51": "動作分岐5。魚ID比較値55 → アカメ。一致時は別処理に入る。対象魚専用やボーナスとは確認されていない。",
      "food:01": "ゲーム内で測定した回復量: HP5。",
      "food:0A": "ゲーム内で確認した結果: HPが0になる。"
    },
    fieldNames: {
      styleCode: "竿の釣り方コード",
      castAimHoldCutoffInternal: "投げ・照準の保持時間上限",
      rangeMultiplier: "距離判定係数",
      rangeInternalValueAtBase0x0150: "距離判定値（内部単位）",
      fishIdMatchCode: "魚ID比較コード",
      fightResponseCode: "ファイト応答分岐",
      specialFishComparisonID: "魚ID比較値",
      fishHookGateMaskHex: "針掛かり判定マスク（16ビット）",
      flyBaitMaskHex: "フライボディ適合マスク"
    },
    noteNoJs: "検索カタログを表示するにはJavaScriptを有効にしてください。"
  };

  // src/pages/equipment/setup-locale.js
  function setupLocale(ctx) {
    ctx.lang = ["ja", "th"].includes(document.documentElement.dataset.locale) ? document.documentElement.dataset.locale : "en";
    ctx.copy = { en: copy_en, th: copy_th, ja: copy_ja }[ctx.lang];
    if (typeof ctx.copy.entries === "string") {
      const template = ctx.copy.entries;
      ctx.copy.entries = (n) => template.replace("{n}", n);
    }
    if (typeof ctx.copy.results === "string") {
      const template = ctx.copy.results;
      ctx.copy.results = (n) => template.replace("{n}", n);
    }
    ctx.itemName = (item) => item.category === "general_tool" && ["08", "09", "0A", "0B", "0C", "0D"].includes(item.id) && item.playerUse?.displayName?.[ctx.lang] ? item.playerUse.displayName[ctx.lang] : ctx.lang === "th" ? item.nameTh || item.playerUse?.displayName?.th || item.nameJa : ctx.lang === "ja" ? item.nameJa : item.nameEn;
    ctx.itemNotes = (item) => ctx.lang === "th" ? item.notesTh || item.notesEn : ctx.lang === "ja" ? item.notesJa : item.notesEn;
    ctx.esc = (value) => String(value ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );
    ctx.set = (selector, text4) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = text4;
    };
  }

  // src/pages/equipment/setup-page-copy.js
  function setupPageCopy(ctx) {
    document.title = ctx.lang === "th" ? "ตกปลาทาโร่ 2 — ไอเท็ม คันเบ็ด เหยื่อ และข้อมูล ROM | Kawa no Nushi Tsuri 2" : ctx.lang === "ja" ? "川のぬし釣り2（SFC）アイテム一覧・竿・ルアー・ROM解析" : "Kawa no Nushi Tsuri 2 (SNES/SFC) — Items, Rods, Lures & ROM Research";
    document.querySelectorAll("[data-t]").forEach((node) => {
      const key = {
        "th-item": "item",
        "th-rom": "rom",
        "th-price": "price",
        "search-label": "search",
        "category-label": "category",
        "sort-label": "sort",
        "readme-link": "readme"
      }[node.dataset.t] || node.dataset.t.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const value = ctx.copy[key];
      if (typeof value === "string") node.textContent = value;
    });
    document.querySelectorAll("[data-t-placeholder]").forEach((node) => {
      const value = ctx.copy[node.dataset.tPlaceholder] ?? ctx.copy[node.dataset.tPlaceholder.replace(/-([a-z])/g, (_, c) => c.toUpperCase())];
      if (value) node.placeholder = value;
    });
    ctx.itemLabel = document.querySelector("thead th");
    if (ctx.itemLabel) ctx.itemLabel.textContent = ctx.copy.item;
    ctx.headers = document.querySelectorAll("thead th");
    if (ctx.headers[1]) ctx.headers[1].textContent = ctx.copy.rom;
    if (ctx.headers[2]) ctx.headers[2].textContent = ctx.copy.price;
    ctx.imageText = (item) => ctx.lang === "th" ? item.imageNoteTh : ctx.lang === "ja" ? item.imageNoteJa : item.imageNoteEn;
    ctx.formatYen = (item) => item.priceYen === null || item.priceYen === void 0 ? ctx.copy.noPrice : `${ctx.copy.yen}${item.priceYen}`;
    ctx.exampleIds = ["rod:0A", "rod:0D", "lure:12", "lure:21", "lure:51", "food:01", "food:0A"];
    ctx.categoryNames = {};
  }

  // src/pages/equipment/player_th.js
  var player_th = {
    title: "คู่มือเลือกอุปกรณ์ตกปลา",
    lead: "เลือกหมวดอุปกรณ์ หรือเลือกปลาที่อยากตก เพื่อดูของที่ใช้ด้วยกันได้และผลที่รู้แล้วจากเกม",
    menu: "เลือกหมวดอุปกรณ์",
    all: "ทุกหมวด",
    fish: "อยากตกปลาอะไร",
    allFish: "ยังไม่ได้เลือกปลา",
    use: "ใช้ทำอะไร",
    compatible: "ปลาที่ใช้ด้วยได้",
    more: "ดูรายชื่อทั้งหมด",
    evidence: "หลักฐานทางเทคนิค",
    compare: "เทียบคันในรูปแบบเดียวกัน",
    aim: "เวลาเล็ง",
    reach: "สายขาดยาก",
    style: "รูปแบบการตก",
    titleByCategory: "อุปกรณ์ในหมวดนี้",
    noFish: "หมวดนี้ไม่ได้เลือกตามชนิดปลา",
    fishOnly: "แสดงเหยื่อที่ผ่านเงื่อนไขของปลาที่เลือก",
    basePrice: "ราคาพื้นฐาน",
    kit: "ชุดเหยื่อที่ครอบคลุมชนิดปลา",
    kitText: "เลือกตามด่าน: ด่าน 1 ใช้ สปูน 2E + ยางหนอน 23 ราคา ¥55, ด่าน 2–3 ใช้ จมน้ำ 17 + ยางหนอน 24 ราคา ¥55, ด่าน 4 ใช้ จมน้ำ 17 + ยางหนอน 23 ราคา ¥50 ด่าน 5–6 ไม่มีร้านขายครบคู่ ให้พกคู่ที่มีอยู่ หรือซื้อ จมน้ำ 17 + ยางหนอน 23 ที่ด่าน 4 ทุกคู่ใช้ได้กับปลาที่ตกด้วยลัวร์ได้ 38 โปรไฟล์ แต่ไม่ได้รับประกันว่าปลาจะกินหรือจับได้",
    kitLink: "ดูชุดพร้อมภาพและตารางปลา",
    guide: "วิธีประกอบฟลายในเกม",
    research: "รายละเอียดและที่มาของข้อมูล",
    cat: {
      rod: "คันเบ็ด",
      lure: "เหยื่อปลอม",
      flymaker: "ประกอบฟลาย",
      bait: "เหยื่อจริง",
      hook: "ตะขอ / ห่วงปลาอายุ",
      float_weight: "ทุ่น / เครื่องหมาย / ตะกั่ว",
      food: "อาหาร / ฟื้น HP",
      general_tool: "อุปกรณ์และของเควสต์"
    },
    desc: {
      rod: "เลือกวิธีตกก่อน แล้วเลือกคันที่มีเวลาเล็งนานหรือสายขาดยากตามที่ต้องการ",
      lure: "เลือกปลาที่อยากตก เพื่อกรองเหยื่อที่ผ่านเงื่อนไขรับลัวร์",
      flymaker: "ดูบอดี้ ปีก และหาง พร้อมเงื่อนไขที่มีผลต่อการติดเบ็ด",
      bait: "เลือกปลาเพื่อดูเหยื่อที่ผ่านเงื่อนไขของการตกด้วยเหยื่อจริง",
      hook: "ดูตะขอและห่วงที่ใช้กับรูปแบบการตกต่างกัน",
      float_weight: "ดูอุปกรณ์ทุ่น เครื่องหมายบนสาย และตะกั่ว",
      food: "ดูผลฟื้น HP และอาหารที่ทำให้ HP หมด",
      general_tool: "ดูวิธีใช้ ผลที่เกิดขึ้น และเงื่อนไขสถานที่หรือเควสต์จากโค้ดเกม"
    }
  };

  // src/pages/equipment/player_en.js
  var player_en = {
    title: "Choose your next catch.",
    lead: "Find a fish, choose compatible tackle, and see where to go.",
    menu: "Equipment categories",
    all: "All categories",
    fish: "Target fish",
    allFish: "Any fish",
    use: "What it does",
    compatible: "Compatible fish",
    more: "Show all fish",
    evidence: "Technical evidence",
    compare: "Compare rods within a fishing style",
    aim: "Time to aim",
    reach: "Line strength",
    style: "Fishing style",
    titleByCategory: "Equipment in this category",
    noFish: "This category is not filtered by fish species",
    fishOnly: "Showing baits that pass the selected fish’s conditions",
    basePrice: "Base price",
    kit: "A lure set covering the compatible species",
    kitText: "Choose by area: Spoon 2E + Soft worm 23 costs ¥55 in Area 1, Sinking lure 17 + Soft worm 24 costs ¥55 in Areas 2–3, and Sinking lure 17 + Soft worm 23 costs ¥50 in Area 4. Areas 5–6 sell no complete pair; carry one you own or buy Sinking lure 17 + Soft worm 23 in Area 4. Each pair covers the same 38 lure-compatible profiles, not a guaranteed bite or catch.",
    kitLink: "See the illustrated set and fish table",
    guide: "Make a fly in the game",
    research: "Research details and sources",
    cat: {
      rod: "Rods",
      lure: "Lures",
      flymaker: "Fly maker",
      bait: "Baits",
      hook: "Hooks / Ayu rings",
      float_weight: "Floats / markers / sinkers",
      food: "Food / HP recovery",
      general_tool: "Tools / quest items"
    },
    desc: {
      rod: "Choose a fishing style, then compare time to aim and line strength.",
      lure: "Choose a target fish to filter lures by the hook-acceptance condition.",
      flymaker: "Browse bodies, wings and tails, with conditions that affect hooking.",
      bait: "Choose a fish to see baits that pass the bait-mode conditions.",
      hook: "Hooks and rings used by different fishing styles.",
      float_weight: "Floats, line markers and sinkers.",
      food: "Measured recovery and food that drains HP.",
      general_tool: "How to use each tool, its effects, and location or quest conditions traced from game code."
    }
  };

  // src/pages/equipment/player_ja.js
  var player_ja = {
    title: "次に釣る魚を見つけよう。",
    lead: "魚を探し、対応する道具を選び、釣り場へ。",
    menu: "装備メニュー",
    all: "全種類",
    fish: "釣りたい魚",
    allFish: "指定なし",
    use: "用途",
    compatible: "対応する魚",
    more: "全魚名を見る",
    evidence: "技術的根拠",
    compare: "釣り方別に竿を比較",
    aim: "狙う時間",
    reach: "糸の切れにくさ",
    style: "釣り方",
    titleByCategory: "この種類の装備",
    noFish: "この種類は魚種では絞り込まない",
    fishOnly: "選んだ魚の条件に合うエサを表示",
    basePrice: "基本価格",
    kit: "対応魚を網羅するルアー構成",
    kitText: "エリア別に選択：エリア1はスプーン2E＋ソフト・ワーム23が55円、エリア2・3はシンキング17＋ソフト・ワーム24が55円、エリア4はシンキング17＋ソフト・ワーム23が50円。エリア5・6では一式揃わないため、所持中のセットを使うかエリア4でシンキング17＋ソフト・ワーム23を購入。いずれもルアー判定を通る38プロフィールをカバーしますが、食いつきや釣果の保証ではありません。",
    kitLink: "画像付き構成と魚別表",
    guide: "ゲーム内でフライを作る",
    research: "調査詳細と出典",
    cat: {
      rod: "竿",
      lure: "ルアー",
      flymaker: "フライ作成",
      bait: "エサ",
      hook: "ハリ / アユ鼻カン",
      float_weight: "ウキ / 目印 / オモリ",
      food: "食べ物 / HP回復",
      general_tool: "道具 / イベント品"
    },
    desc: {
      rod: "釣り方を選び、狙う時間と糸の切れにくさを比べる。",
      lure: "魚を選んでルアー針掛かり条件で絞り込む。",
      flymaker: "ボディ・ウイング・テールと針掛かり条件。",
      bait: "魚を選んでエサ釣り条件に合うエサを見る。",
      hook: "釣り方別のハリ・鼻カン。",
      float_weight: "ウキ・目印・オモリ。",
      food: "確認済みのHP回復とHPが0になる食べ物。",
      general_tool: "道具の使い方・効果・場所やイベント条件をゲームコードから確認。"
    }
  };

  // src/pages/equipment/setup-player-state.js
  function setupPlayerState(ctx) {
    ctx.allItems = [];
    ctx.player = { th: player_th, en: player_en, ja: player_ja }[ctx.lang];
    ctx.cardUi = ctx.lang === "th" ? {
      decisionDetails: "เหตุผลและตัวเลือกที่เปรียบเทียบ",
      useDetails: "รายละเอียดการใช้",
      moreActions: "ทางเลือกอื่นในการหาและใช้",
      buying: "แหล่งซื้อ",
      fish: (n) => `ปลาที่ผ่านเงื่อนไข · ${n}`,
      categoryAdvice: (n) => `คำแนะนำของหมวดนี้ · ${n} ส่วน`,
      fullRecommendation: "คำแนะนำฉบับเต็ม",
      details: "ดูรายละเอียดไอเท็ม",
      noDecision: "ข้อมูลการใช้งานเพิ่มเติม"
    } : ctx.lang === "ja" ? {
      decisionDetails: "判断理由と比較候補",
      useDetails: "使い方の詳細",
      moreActions: "入手・使用の追加情報",
      buying: "販売場所",
      fish: (n) => `判定を通る魚 · ${n}`,
      categoryAdvice: (n) => `この種類の選び方 · ${n}項目`,
      fullRecommendation: "詳しい選択案内",
      details: "道具の詳細を見る",
      noDecision: "追加の使い方"
    } : {
      decisionDetails: "Why and what to compare",
      useDetails: "More about using this item",
      moreActions: "Other ways to get or use it",
      buying: "Where to buy",
      fish: (n) => `Fish passing the check · ${n}`,
      categoryAdvice: (n) => `Choices for this category · ${n} sections`,
      fullRecommendation: "Full recommendation",
      details: "Open item details"
    };
    ctx.groups = ["rod", "lure", "flymaker", "bait", "hook", "float_weight", "food", "general_tool"];
    ctx.fishVisuals = {};
  }

  // src/pages/equipment/setup-picker-state.js
  function setupPickerState(ctx) {
    ctx.fishLocations = {};
    ctx.locationStage = "";
    ctx.locationMapIndex = 0;
    ctx.flyPart = "fly";
    ctx.baitRoute = "float";
    ctx.decisions = [];
    ctx.gearPriceGuide = {};
    ctx.fishCategories = ["all", "bait", "lure", "flymaker", "float_weight", "rod", "hook"];
    ctx.suggestionIds = [];
    ctx.activeSuggestion = -1;
    ctx.pickerCopy = {
      th: {
        placeholder: "ชื่อปลา หรือ ID",
        clear: "ล้างปลาเป้าหมาย",
        none: "ไม่พบปลา ลองชื่อไทย อังกฤษ ญี่ปุ่น หรือ ID",
        count: (n) => `พบ ${n} ชนิด ใช้ปุ่มลูกศรแล้วกด Enter หรือกดชื่อปลา`
      },
      en: {
        placeholder: "Fish name or ID",
        clear: "Clear target fish",
        none: "No fish found. Try a Thai, English, Japanese name or ID.",
        count: (n) => `${n} fish found. Use arrow keys and Enter, or click a fish.`
      },
      ja: {
        placeholder: "魚名・読み方・ID",
        clear: "魚の指定を解除",
        none: "見つかりません。日本語・英語・タイ語の名前やIDで検索。",
        count: (n) => `${n}件。矢印キーとEnter、または魚名をクリック。`
      }
    }[ctx.lang];
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

  // src/pages/equipment/setup-data-access.js
  function setupDataAccess(ctx) {
    ctx.fishSearchText = (id) => [
      id,
      ...Object.entries(ctx.fishVisuals[id] || {}).filter(([key]) => key.startsWith("name")).flatMap(([, value]) => Array.isArray(value) ? value : [value])
    ].filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase();
    ctx.groupOf = (item) => item.category.startsWith("fly") ? "flymaker" : item.category;
    ctx.local = (value) => typeof value === "string" ? value : value?.[ctx.lang] || value?.en || "";
    ctx.useOf = (item) => item.playerUse || {};
    ctx.fishName = (id) => {
      const f = ctx.fishVisuals[id] || {};
      const latin = f.nameLatin || (f.nameLatinVariants || []).slice().sort((a, b) => b.length - a.length)[0];
      return ctx.lang === "th" ? distinctFishNames(f.nameTh ? [f.nameTh] : f.nameThVariants || []).join(" / ") || latin || f.nameJa || id : ctx.lang === "en" ? f.nameEn || latin || f.nameJa || id : f.nameJa || id;
    };
    ctx.fishIdsFor = (item) => item.category === "bait" ? ctx.useOf(item).fishIdsByRoute?.[ctx.baitRoute] || ctx.useOf(item).fishIds || [] : ctx.useOf(item).fishIds || [];
    ctx.detailFile = (type) => `${type}${ctx.lang === "en" ? "" : "." + ctx.lang}.html`;
  }

  // src/pages/equipment/setup-navigation.js
  function setupNavigation(ctx) {
    ctx.refreshLanguageLinks = () => {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      const current = new URL(window.location.href);
      updateLanguageLinks(current.searchParams.get("return") || "", current.href);
    };
    ctx.sourceReturn = () => {
      if (typeof location === "undefined")
        return `index${ctx.lang === "en" ? "" : "." + ctx.lang}.html#catalogue`;
      const query = new URLSearchParams(location.search);
      for (const [param, id] of [
        ["q", "search"],
        ["sort", "sort-filter"],
        ["style", "style-filter"]
      ]) {
        const value = document.getElementById(id).value;
        if (value) query.set(param, value);
        else query.delete(param);
      }
      if (ctx.locationStage) query.set("stage", ctx.locationStage);
      else query.delete("stage");
      query.set("route", ctx.baitRoute);
      query.set("map", String(ctx.locationMapIndex));
      return location.pathname.split("/").pop() + "?" + query + location.hash;
    };
    ctx.fishingContext = (item) => ["rod", "bait", "lure", "hook", "float_weight", "fly", "fly_wing", "fly_tail"].includes(
      item.category
    ) || item.category === "general_tool" && ["03", "04", "08", "09", "0A", "0E"].includes(item.id);
    ctx.itemHref = (item) => {
      const q = new URLSearchParams({
        category: item.category,
        id: item.id,
        return: ctx.sourceReturn()
      });
      const fish = document.getElementById("fish-filter").value;
      if (ctx.fishingContext(item) && fish) q.set("fish", fish);
      if (item.category === "bait" || ctx.fishingContext(item) && fish)
        q.set("route", navigationRoute(ctx, item.category));
      if (ctx.locationStage) q.set("stage", String(ctx.locationStage));
      return `${ctx.detailFile("item")}?${q}`;
    };
    ctx.fishHref = (id) => `${ctx.detailFile("fish")}?id=${encodeURIComponent(id)}&route=${encodeURIComponent(navigationRoute(ctx))}${ctx.locationStage ? "&stage=" + ctx.locationStage : ""}&return=${encodeURIComponent(ctx.sourceReturn())}`;
    setupReturnAction(ctx);
  }

  // src/pages/equipment/setup-card-links.js
  function menuPositionLink(ctx, item) {
    const label = ctx.lang === "th" ? "ดูตำแหน่งชิ้นนี้ในเมนูเกม" : ctx.lang === "ja" ? "ゲームでこの部品を選ぶ位置を見る" : "Find this component in the game menu";
    return `<p><a class="route-button" data-fly-menu-choice href="${ctx.esc(ctx.itemHref(item) + "#fly-menu-position")}">${ctx.esc(label)} ↗</a></p>`;
  }
  function setupCardLinks(ctx) {
    ctx.detailLabel = ctx.lang === "th" ? "ดูรายละเอียด" : ctx.lang === "ja" ? "詳細を見る" : "View details";
    ctx.decisionLink = (ref) => {
      const item = ctx.allItems.find((i) => i.category === ref.category && i.id === ref.id);
      return item ? `<a class="decision-item" href="${ctx.esc(ctx.itemHref(item))}"><img src="${ctx.esc(item.image)}" alt=""><span>${ctx.esc(ctx.itemName(item))}${ref.note ? `<small>${ctx.esc(ctx.local(ref.note))}</small>` : ""}</span></a>` : "";
    };
    ctx.matchCategory = (item, category) => category === "all" || (category === "flymaker" ? item.category.startsWith("fly") : item.category === category);
    ctx.rodAdviceTitle = ctx.lang === "th" ? "ควรเลือกคันนี้เมื่อไร?" : ctx.lang === "ja" ? "この竿を選ぶときは？" : "When should I choose this rod?";
    ctx.rodAlternatives = (item) => (item.rodDecision || item.gearDecision || item.baitLureDecision)?.alternatives?.some(
      (ref) => ref.category !== item.category || ref.id !== item.id
    ) ? `<div class="rod-alternatives"><p>${ctx.lang === "th" ? "ตัวเลือกที่นำมาเทียบ:" : ctx.lang === "ja" ? "比較する候補：" : "Compare with:"}</p>${(item.rodDecision || item.gearDecision || item.baitLureDecision).alternatives.filter((ref) => ref.category !== item.category || ref.id !== item.id).map(ctx.decisionLink).join("")}</div>` : "";
    ctx.flyMakerLink = (item) => item.flyMakerMenuChoice ? menuPositionLink(ctx, item) : item.category.startsWith("fly") ? `<p><a class="route-button" data-fly-maker href="${ctx.esc(ctx.sourceReturn().split("#")[0] + "#fly-instructions")}">${ctx.lang === "th" ? "ดูขั้นตอนประกอบฟลายเองและตรวจราคาในเกม" : ctx.lang === "ja" ? "自作フライの手順とゲーム内見積額を確認" : "See custom fly steps and check the in-game quote"} ↗</a></p>` : "";
  }

  // src/pages/equipment/catalogue-load-state.js
  function local(ctx, values) {
    return values[ctx.lang] || values.en;
  }
  var SKELETON_COUNT = 4;
  var SKELETON_CARD = `<div class="item-card skeleton-card" aria-hidden="true">
  <div class="card-main">
    <div class="skeleton-block skeleton-image"></div>
    <div class="card-text">
      <div class="skeleton-block skeleton-line skeleton-tag"></div>
      <div class="skeleton-block skeleton-line skeleton-title"></div>
      <div class="skeleton-block skeleton-line skeleton-price"></div>
      <div class="skeleton-block skeleton-line skeleton-text"></div>
    </div>
  </div>
  <div class="card-actions"><div class="skeleton-block skeleton-button"></div></div>
</div>`;
  function showCatalogueLoading(ctx) {
    document.getElementById("category-menu").hidden = true;
    document.getElementById("catalogue-load-feedback").hidden = true;
    const message = local(ctx, {
      th: "กำลังโหลดรายการและคำแนะนำตามตัวเลือกของคุณ…",
      ja: "選択条件に合うアイテムと案内を読み込み中…",
      en: "Loading items and advice for your selection…"
    });
    for (const id of ["category-description", "category-decisions", "rod-comparison"])
      document.getElementById(id).innerHTML = "";
    document.getElementById("category-title").textContent = local(ctx, {
      th: "รายการตามตัวเลือกของคุณ",
      ja: "選択条件の一覧",
      en: "Your selected items"
    });
    document.getElementById("cards").innerHTML = `<p role="status" class="visually-hidden">${ctx.esc(message)}</p>` + SKELETON_CARD.repeat(SKELETON_COUNT);
    document.getElementById("result-count").textContent = "";
  }
  function showCatalogueError(ctx) {
    document.getElementById("category-menu").hidden = true;
    const message = local(ctx, {
      th: "โหลดรายการไม่สำเร็จ ยังแสดงคำแนะนำตามปลาหรือตัวเลือกของคุณไม่ได้ ลองโหลดหน้าใหม่ หรือเลือกหน้าอื่นจากเมนูด้านบน",
      ja: "一覧を読み込めず、選択した魚・条件の案内を表示できません。再読み込みするか、上のメニューから別のページを選んでください。",
      en: "The catalogue could not load, so advice for your fish or filters is unavailable. Reload this page, or choose another page from the navigation above."
    });
    const retry = local(ctx, { th: "โหลดหน้าใหม่", ja: "再読み込み", en: "Reload page" });
    const feedback = document.getElementById("catalogue-load-feedback");
    feedback.hidden = false;
    feedback.innerHTML = `<div role="alert" class="empty-state"><p>${ctx.esc(message)}</p><button type="button" class="route-button" id="catalogue-retry">${ctx.esc(retry)} ↻</button></div>`;
    document.getElementById("cards").innerHTML = "";
    document.getElementById("catalogue-retry")?.addEventListener("click", () => location.reload());
    document.getElementById("result-count").textContent = "";
  }

  // src/pages/equipment/load-catalogue.js
  function installCatalogueData(ctx, data) {
    ctx.allItems = data.items;
    ctx.decisions = data.playerDecisions?.sections || [];
    ctx.gearPriceGuide = data.gearPriceGuide || {};
    ctx.fishVisuals = data.fishVisuals || {};
    ctx.fishLocations = data.fishLocations || {};
    for (const item of ctx.allItems) {
      ctx.categoryNames[item.category] = ctx.lang === "th" ? item.categoryTh : ctx.lang === "ja" ? item.categoryJa : item.categoryEn;
    }
    ctx.set("#entry-count", ctx.copy.entries(ctx.allItems.length));
    ctx.set('[data-t="title"]', ctx.player.title);
    ctx.set('[data-t="lead"]', ctx.player.lead);
    ctx.set("#category-menu-title", ctx.player.menu);
    ctx.set("#fish-filter-label", ctx.player.fish);
    ctx.set("#kit-title", ctx.player.kit);
    ctx.set("#kit-copy", ctx.player.kitText);
    ctx.set("#kit-link", ctx.player.kitLink);
    ctx.renderSamples();
    ctx.renderNotes(data);
    ctx.renderFilters();
  }
  function readPageQuery() {
    if (typeof URLSearchParams === "undefined" || typeof location === "undefined") return null;
    return new URLSearchParams(location.search);
  }
  function restoreCategoryAndPart(ctx, query) {
    let category = "rod";
    const selectedCategory = query?.get("category");
    if (ctx.groups.includes(selectedCategory) || selectedCategory === "all")
      category = selectedCategory;
    document.getElementById("category-filter").value = category;
    const part = query?.get("part");
    if (["fly", "fly_wing", "fly_tail"].includes(part)) ctx.flyPart = part;
  }
  function restoreFishAndStage(ctx, query) {
    const fish = query?.get("fish");
    if (ctx.fishVisuals[fish]) document.getElementById("fish-filter").value = fish;
    const stage = query?.get("stage");
    if (["1", "2", "3", "4", "5", "6"].includes(stage)) ctx.locationStage = stage;
  }
  function restoreTextFilters(ctx, query) {
    if (!query) return;
    document.getElementById("search").value = query.get("q") || "";
    if (["id", "name", "price", "buy-price"].includes(query.get("sort")))
      document.getElementById("sort-filter").value = query.get("sort");
    if (["1", "2", "4", "8"].includes(query.get("style")))
      document.getElementById("style-filter").value = query.get("style");
    if (["float", "sinker"].includes(query.get("route"))) ctx.baitRoute = query.get("route");
    if (/^\d+$/.test(query.get("map") || "")) ctx.locationMapIndex = Number(query.get("map"));
  }
  function restoreInitialFilters(ctx) {
    const query = readPageQuery();
    restoreCategoryAndPart(ctx, query);
    restoreFishAndStage(ctx, query);
    restoreTextFilters(ctx, query);
    const fish = document.getElementById("fish-filter").value;
    if (fish && !query?.has("category")) {
      const methodCategory = { lure: "lure", fly: "flymaker" }[query?.get("route")];
      if (methodCategory) document.getElementById("category-filter").value = methodCategory;
      else applyFishEquipmentDefault(ctx, fish);
    }
  }
  function syncFishSearchText(ctx) {
    const fish = document.getElementById("fish-filter").value;
    document.getElementById("fish-search").value = fish ? ctx.fishName(fish) : "";
  }
  function openFlyGuideFromHash() {
    if (typeof window === "undefined" || !["#fly-instructions", "#wing-palette-title"].includes(window.location.hash))
      return;
    const guide = document.getElementById("fly-instructions");
    if (!guide) return;
    guide.open = true;
    const target = window.location.hash === "#wing-palette-title" ? document.getElementById("wing-palette-title") : guide;
    target?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  function scrollCategoryAdviceFromHash() {
    if (typeof window === "undefined" || window.location.hash !== "#category-decisions") return;
    document.getElementById("category-decisions")?.scrollIntoView({ block: "start" });
  }
  function openInitialContext() {
    openFlyGuideFromHash();
    scrollCategoryAdviceFromHash();
    if (typeof window === "undefined") return;
    const targets = ["#catalogue", "#cards", "#fish-location-panel"];
    if (targets.includes(window.location.hash))
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  function handleCategoryClick(ctx, event) {
    const link = event.target.closest("[data-category]");
    if (!link) return;
    if (event.button !== void 0 && event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    document.getElementById("category-filter").value = link.dataset.category;
    document.getElementById("search").value = "";
    document.getElementById("style-filter").value = "";
    ctx.renderCards();
    if (typeof history !== "undefined")
      history.replaceState(
        null,
        "",
        categoryNavigationHref(
          ctx,
          link.dataset.category,
          document.getElementById("fish-filter").value
        )
      );
    ctx.refreshLanguageLinks?.();
    document.getElementById("catalogue").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function handleBaitRouteClick(ctx, event) {
    const button = event.target.closest("[data-route]");
    if (!button) return;
    ctx.baitRoute = button.dataset.route;
    ctx.renderCards();
  }
  function handleEmptyBaitRouteSwitch(ctx, event) {
    const link = event.target.closest('[data-empty-bait-switch="float"]');
    if (!link) return;
    event.preventDefault();
    ctx.baitRoute = "float";
    ctx.renderCards();
    document.getElementById("catalogue").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function handleFlyPartClick(ctx, event) {
    if (event.target.closest("[data-guide]")) {
      event.preventDefault();
      const guide = document.getElementById("fly-instructions");
      guide.open = true;
      guide.scrollIntoView({ behavior: "instant", block: "start" });
      return;
    }
    const button = event.target.closest("[data-part]");
    if (!button) return;
    ctx.flyPart = button.dataset.part;
    ctx.renderCards();
  }
  function handleLocationStageClick(ctx, event) {
    const button = event.target.closest("[data-location-stage]");
    if (!button) return;
    ctx.locationStage = button.dataset.locationStage;
    ctx.locationMapIndex = 0;
    ctx.renderCards();
  }
  function handleLocationMapChange(ctx, event) {
    if (event.target.id !== "location-map-select") return;
    ctx.locationMapIndex = Number(event.target.value);
    ctx.renderFishLocation(document.getElementById("fish-filter").value);
    refreshCategoryNavigationLinks(ctx, document.getElementById("fish-filter").value);
  }
  function bindFilterInputs(ctx) {
    const inputIds = ["search", "category-filter", "sort-filter", "style-filter"];
    for (const id of inputIds) {
      const eventName = id === "search" ? "input" : "change";
      document.getElementById(id).addEventListener(eventName, ctx.renderCards);
      document.getElementById(id).disabled = false;
    }
  }
  function bindCatalogueEvents(ctx) {
    document.getElementById("category-menu").addEventListener("click", (event) => handleCategoryClick(ctx, event));
    document.getElementById("bait-route-menu").addEventListener("click", (event) => handleBaitRouteClick(ctx, event));
    document.getElementById("cards").addEventListener("click", (event) => handleEmptyBaitRouteSwitch(ctx, event));
    document.getElementById("fly-part-menu").addEventListener("click", (event) => handleFlyPartClick(ctx, event));
    const locationPanel = document.getElementById("fish-location-panel");
    locationPanel.addEventListener("click", (event) => handleLocationStageClick(ctx, event));
    locationPanel.addEventListener("change", (event) => handleLocationMapChange(ctx, event));
    bindFilterInputs(ctx);
    bindCatalogueStage(ctx);
  }
  function renderInitialCatalogue(ctx) {
    syncFishSearchText(ctx);
    ctx.setupFishPicker();
    ctx.renderCards();
    openInitialContext();
    bindCatalogueEvents(ctx);
    document.getElementById("category-menu").hidden = false;
  }
  function initializeLoadedCatalogue(ctx, data) {
    installCatalogueData(ctx, data);
    restoreInitialFilters(ctx);
    ctx.renderFrames(data);
    renderInitialCatalogue(ctx);
  }
  function loadCatalogue(ctx) {
    showCatalogueLoading(ctx);
    fetch("gallery-data.json?v=thai-plain-20261007-69").then((response) => {
      if (!response.ok) throw new Error("catalogue unavailable");
      return response.json();
    }).then((data) => initializeLoadedCatalogue(ctx, data)).catch((error) => {
      console.error(error);
      showCatalogueError(ctx);
    });
  }

  // src/pages/equipment/refine-disclosure.js
  var phoneWidth = "(max-width: 640px)";
  function urlNeedsRefine(query) {
    const sort = query.get("sort");
    return Boolean(query.get("q") || query.get("style") || sort && sort !== "id");
  }
  function collapseRefineOnPhone() {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    const refine = document.querySelector(".catalogue-refine");
    if (!refine || !window.matchMedia?.(phoneWidth).matches) return;
    if (urlNeedsRefine(new URLSearchParams(window.location.search))) return;
    refine.open = false;
  }

  // src/pages/equipment/index.js
  function initialize(ctx) {
    if (typeof document === "undefined" || !document.getElementById("cards")) return;
    setupLocale(ctx);
    setupPageCopy(ctx);
    setupPlayerState(ctx);
    setupPickerState(ctx);
    setupDataAccess(ctx);
    setupNavigation(ctx);
    setupCardLinks(ctx);
    collapseRefineOnPhone();
    loadCatalogue(ctx);
  }

  // src/app/equipment.js
  var runtimeContext = createPageRuntime(equipment_exports);
  initialize(runtimeContext);
})();
