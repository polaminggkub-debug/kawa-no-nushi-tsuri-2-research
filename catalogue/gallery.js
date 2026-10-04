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
    ).join("");
  }
  function renderNotes(ctx, data) {
    const list = data.researchNotes[ctx.lang] || data.researchNotes.en;
    document.getElementById("research-notes").innerHTML = list.map((text2) => `<p>${ctx.esc(text2)}</p>`).join("");
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
    const category = document.getElementById("category-filter").value;
    if (id && !ctx.fishCategories.includes(category))
      document.getElementById("category-filter").value = "all";
    ctx.locationStage = "";
    ctx.locationMapIndex = 0;
    ctx.renderCards();
    if (typeof history !== "undefined")
      history.replaceState(
        null,
        "",
        `?category=${document.getElementById("category-filter").value}${id ? "&fish=" + encodeURIComponent(id) : ""}#fish-location-panel`
      );
  }

  // src/pages/equipment/category-controls.js
  function renderTargetCategories(ctx, fish) {
    const available = fish ? ctx.groups.filter((c) => ctx.fishCategories.includes(c)) : ctx.groups;
    const select = document.getElementById("category-filter"), current = select.value;
    select.innerHTML = `<option value="all">${ctx.esc(ctx.player.all)}</option>` + available.map((c) => `<option value="${c}">${ctx.esc(ctx.player.cat[c])}</option>`).join("");
    select.value = !fish || ctx.fishCategories.includes(current) ? current : "all";
    document.getElementById("category-menu").innerHTML = available.map((c) => {
      const item = ctx.allItems.find((i) => ctx.groupOf(i) === c);
      return `<a class="category-button" href="?category=${c}${fish ? "&fish=" + fish : ""}#catalogue" data-category="${c}"><img src="${ctx.esc(item?.image)}" alt=""><span><strong>${ctx.esc(ctx.player.cat[c])}</strong><small>${ctx.allItems.filter((i) => ctx.groupOf(i) === c && (!fish || ctx.fishIdsFor(i).includes(fish) || ["fly_wing", "fly_tail"].includes(i.category) && ctx.flyBundlePartFor(i, fish))).length}</small></span></a>`;
    }).join("");
  }
  function renderFilters(ctx) {
    document.getElementById("category-filter").innerHTML = `<option value="all">${ctx.esc(ctx.player.all)}</option>` + ctx.groups.map((c) => `<option value="${c}">${ctx.esc(ctx.player.cat[c])}</option>`).join("");
    document.getElementById("style-filter").innerHTML = `<option value="">${ctx.esc(ctx.player.all)}</option>` + Object.entries(
      ctx.lang === "th" ? { 1: "ทุ่น / อายุ", 2: "ตีเหยื่อ", 4: "ลัวร์", 8: "ฟลาย" } : ctx.lang === "ja" ? { 1: "ウキ・アユ", 2: "投げ", 4: "ルアー", 8: "フライ" } : { 1: "Float / Ayu", 2: "Casting", 4: "Lure", 8: "Fly" }
    ).map(([k, v]) => `<option value="${k}">${ctx.esc(v)}</option>`).join("");
    ctx.set("#style-filter-label", ctx.player.style);
    document.getElementById("sort-filter").innerHTML = `<option value="id">${ctx.esc(ctx.copy.sortId)}</option><option value="name">${ctx.esc(ctx.copy.sortName)}</option>`;
    document.getElementById("category-menu").innerHTML = ctx.groups.map((c) => {
      const i = ctx.allItems.find((i2) => ctx.groupOf(i2) === c);
      return `<a class="category-button" href="?category=${c}#catalogue" data-category="${c}"><img src="${ctx.esc(i?.image)}" alt=""><span><strong>${ctx.esc(ctx.player.cat[c])}</strong><small>${ctx.allItems.filter((i2) => ctx.groupOf(i2) === c).length}</small></span></a>`;
    }).join("");
  }

  // src/pages/equipment/player-guidance.js
  function decisionCard(ctx, d) {
    return `<article class="decision-card"><h3>${ctx.esc(ctx.local(d.title))}</h3><p class="decision-action">${ctx.esc(ctx.local(d.recommendation))}</p>${d.reason ? `<p>${ctx.esc(ctx.local(d.reason))}</p>` : ""}<div class="decision-items">${(d.items || []).map(ctx.decisionLink).join("")}</div>${d.scope ? `<small>${ctx.esc(ctx.local(d.scope))}</small>` : ""}</article>`;
  }
  function renderPlayerDecisionOverview(ctx) {
    const title = ctx.lang === "th" ? "ซื้ออะไร พกอะไร ทำอะไรก่อนตก" : ctx.lang === "ja" ? "買う・持つ・釣る前にすること" : "What to buy, carry and do before fishing";
    const tip = ctx.lang === "th" ? "ใช้ลัวร์หรือตีเหยื่อ: เติม HP ให้ถึง 100 ก่อน ถ้าอยากได้เวลาเล็งเต็มของคัน" : ctx.lang === "ja" ? "ルアー・投げ釣り：照準時間を最大にするには、先にHPを100まで回復する。" : "Lure / casting: restore HP to 100 first to get your rod’s full aiming time.";
    const scope = ctx.lang === "th" ? "หลักฐานนี้ยืนยันผลเรื่องเวลาเล็ง ยังไม่ได้ยืนยันโบนัสโอกาสปลากินเหยื่อ" : ctx.lang === "ja" ? "照準時間への効果を確認。食いつき率ボーナスは未確認。" : "This restores aiming time; a bite-rate bonus is not established.";
    document.getElementById("player-decisions").hidden = !!document.getElementById("fish-filter").value;
    document.getElementById("player-decisions").innerHTML = `<h2>${title}</h2><aside class="play-tip"><strong>${tip}</strong><p>${scope}</p></aside><div class="decision-grid">${ctx.decisions.map(ctx.decisionCard).join("")}</div>`;
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
    const categoryChoices = ctx.decisions.filter(
      (d) => !selectedFish && d.category === category && (category !== "rod" || !style || decisionStyles[d.id] === style) && !(category === "flymaker" && selectedFish)
    );
    return categoryChoices;
  }
  function renderCategoryDecisionDisclosure(ctx, category, categoryChoices) {
    const box = document.getElementById("category-decisions");
    const previous = box.querySelector?.("#category-recommendations-disclosure");
    const keepOpen = Boolean(previous?.open);
    const flyAdvice = ctx.flyDecision(category);
    const priceAdvice = category === "float_weight" ? ctx.floatPriceGuide() : category === "hook" ? ctx.hookPriceGuide() : "";
    const sections = [
      ...category === "all" ? [] : categoryChoices.map(ctx.decisionCard),
      flyAdvice,
      priceAdvice
    ].filter(Boolean);
    const body = sections.join("");
    const count = sections.length;
    box.innerHTML = body ? `<details id="category-recommendations-disclosure" class="overview-disclosure category-recommendations"><summary>${ctx.esc(ctx.cardUi.categoryAdvice(count))}</summary><div class="category-recommendations-content">${body}</div></details>` : "";
    const disclosure = box.querySelector?.("#category-recommendations-disclosure");
    if (disclosure && (keepOpen || typeof location !== "undefined" && location.hash === "#category-decisions"))
      disclosure.open = true;
  }
  function renderDecisions(ctx, category) {
    renderPlayerDecisionOverview(ctx);
    const choices = selectCategoryDecisions(ctx, category);
    renderCategoryDecisionDisclosure(ctx, category, choices);
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
    const title = ctx.lang === "th" ? "ซื้อทุ่นหรือตะกั่วที่ไหนให้ถูกสุดในด่านนี้" : ctx.lang === "ja" ? "現在のエリアで最安のウキ・オモリを買う" : "Cheapest stocked float or sinker in your area";
    const note = ctx.lang === "th" ? "มีรุ่นเดิมอยู่แล้วใช้ต่อได้ ตารางนี้เลือกจากราคาของที่มีขาย ไม่ใช่อันดับจับปลา ทุ่นกับตะกั่วใช้คนละชุดปลา: เปิดรายละเอียดเพื่อตรวจปลาเป้าหมายก่อนซื้อ" : ctx.lang === "ja" ? "所持品はそのまま使えます。店頭価格による選択であり釣果順位ではありません。ウキとオモリの対応魚は違うため、購入前に詳細で魚を確認してください。" : "Keep the model you own. These choices use recorded shop prices, not catch rankings. Float and sinker routes accept different fish; check the item profile for your target before buying.";
    const none = ctx.lang === "th" ? "ไม่พบในสต็อกด่านนี้" : ctx.lang === "ja" ? "店頭記録なし" : "No recorded stock";
    const choice = (kind, stage) => {
      const row = ctx.gearPriceGuide[kind]?.[stage];
      if (!row) return none;
      const item = ctx.allItems.find((i) => i.category === row.category && i.id === row.id);
      return `<a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(ctx.itemName(item))} (${row.id}) · ¥${row.priceYen}</a>`;
    };
    return `<section class="decision-card" id="float-price-guide"><h3>${title}</h3><p>${note}</p><div class="table-wrap"><table><thead><tr><th>${ctx.lang === "th" ? "ด่าน" : ctx.lang === "ja" ? "エリア" : "Area"}</th><th>${ctx.lang === "th" ? "ทุ่น" : ctx.lang === "ja" ? "ウキ" : "Float"}</th><th>${ctx.lang === "th" ? "ตะกั่ว" : ctx.lang === "ja" ? "オモリ" : "Sinker"}</th></tr></thead><tbody>${[1, 2, 3, 4, 5, 6].map((stage) => `<tr><td>${stage}</td><td>${choice("float", stage)}</td><td>${choice("sinker", stage)}</td></tr>`).join("")}</tbody></table></div></section>`;
  }
  function findFlyOffer(ctx, fish, stage) {
    const offers = ctx.allItems.filter((i) => i.category === "fly" && (ctx.useOf(i).fishIds || []).includes(fish)).flatMap(
      (i) => (ctx.useOf(i).shops || []).filter((s) => s.bundle).map((s) => ({ body: i, ...s }))
    ).sort((a, b) => a.bundle.shopPriceYen - b.bundle.shopPriceYen || a.stage - b.stage);
    const sameArea = offers.filter((o) => o.stage === stage);
    return { offer: (sameArea.length ? sameArea : offers)[0], sameArea };
  }
  function noReadyFlyCard(ctx) {
    return `<article class="decision-card"><h3>${ctx.lang === "th" ? "ปลานี้ควรใช้อะไร" : ctx.lang === "ja" ? "この魚には何を使うか" : "What to use for this fish"}</h3><p>${ctx.lang === "th" ? "ยังไม่มีชุดฟลายสำเร็จรูปที่ผ่านเงื่อนไขบอดี้ให้แนะนำ ลองเลือกหมวดเหยื่อจริงหรือลัวร์สำหรับปลานี้" : ctx.lang === "ja" ? "ボディ判定に合う店売り毛バリは案内できない。この魚のエサ・ルアーを選ぶ。" : "No qualifying ready-made fly is listed. Switch to bait or lure for this target."}</p></article>`;
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
  function flyDecision(ctx, category) {
    const fish = document.getElementById("fish-filter").value;
    if (!["flymaker", "all"].includes(category) || !fish) return "";
    const stage = Number(ctx.locationStage || (ctx.fishLocations[fish]?.locations || [])[0]?.stage);
    const { offer, sameArea } = findFlyOffer(ctx, fish, stage);
    return offer ? ctx.decisionCard(flyDecisionCopy(ctx, fish, offer, sameArea)) : noReadyFlyCard(ctx);
  }
  function rodTableAdvice(ctx, item) {
    const linkLabel = ctx.lang === "th" ? "ดูเงื่อนไขซื้อและคันที่เทียบ" : ctx.lang === "ja" ? "購入条件・比較候補を見る" : "See purchase conditions and alternatives";
    return `<td class="rod-table-advice"><strong>${ctx.esc(ctx.local(item.rodDecision?.label))}</strong><a href="${ctx.esc(ctx.itemHref(item))}">${linkLabel} ↗</a></td>`;
  }
  function rodComparisonRow(ctx, item, styles) {
    const stockPrice = ctx.useOf(item).shops?.length ? ctx.formatYen(item) : ctx.lang === "th" ? "ไม่พบในร้าน" : ctx.lang === "ja" ? "店頭在庫なし" : "No recorded shop stock";
    return `<tr><td><a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(ctx.itemName(item))}</a></td><td>${ctx.esc(styles[item.decodedFields.styleCode])}</td><td>${item.decodedFields.castAimHoldCutoffInternal}</td><td>${item.decodedFields.rangeMultiplier}</td><td>${ctx.esc(stockPrice)}</td>${rodTableAdvice(ctx, item)}</tr>`;
  }
  function renderComparison(ctx, category) {
    const box = document.getElementById("rod-comparison");
    if (category !== "rod") {
      box.innerHTML = "";
      return;
    }
    const rods = ctx.allItems.filter((item) => item.category === "rod");
    const wasOpen = Boolean(box.querySelector?.(".comparison")?.open);
    const styles = ctx.lang === "th" ? { 1: "ทุ่น / อายุ", 2: "ตีเหยื่อ", 4: "ลัวร์", 8: "ฟลาย" } : ctx.lang === "ja" ? { 1: "ウキ・アユ", 2: "投げ", 4: "ルアー", 8: "フライ" } : { 1: "Float / Ayu", 2: "Casting", 4: "Lure", 8: "Fly" };
    box.innerHTML = `<details id="rod-comparison-details" class="overview-disclosure comparison"${wasOpen ? " open" : ""}><summary>${ctx.esc(ctx.player.compare)} · ${rods.length}</summary><p>${ctx.lang === "th" ? "เวลาเล็งสูง = ขยับจุดเป้าหมายได้นานขึ้น; ขอบเขตสูง = ปลาออกไปไกลกว่าเดิมก่อนเข้าเงื่อนไขหนีและเสียอุปกรณ์ที่แกะได้ ตัวเลขเป็นหน่วยเปรียบเทียบภายใน ไม่ใช่เมตรหรือคะแนนพลัง และปลาอาจหนีด้วยเงื่อนไขอื่น" : ctx.lang === "ja" ? "照準時間が大きいほど狙いを動かせる時間が長い。魚位置の境界が大きいほど、追跡した道具喪失分岐に入るまで魚が遠くに行ける。内部比較値であり、メートル・強さではない。別条件の逃げもある。" : "More aim time lets you move the target longer. A higher fish-position limit allows the fish farther out before the traced tackle-loss escape condition. Values are internal comparisons, not metres or power. Other escape conditions still apply."}</p><div class="table-wrap"><table><thead><tr><th>${ctx.esc(ctx.copy.item)}</th><th>${ctx.esc(ctx.player.style)}</th><th>${ctx.esc(ctx.player.aim)}</th><th>${ctx.esc(ctx.player.reach)}</th><th>${ctx.lang === "th" ? "ราคาซื้อ" : ctx.lang === "ja" ? "購入価格" : "Purchase price"}</th><th>${ctx.lang === "th" ? "คำแนะนำ" : ctx.lang === "ja" ? "選び方" : "Recommendation"}</th></tr></thead><tbody>${rods.slice().sort(
      (a, b) => a.decodedFields.styleCode - b.decodedFields.styleCode || b.decodedFields.rangeMultiplier - a.decodedFields.rangeMultiplier
    ).map((item) => rodComparisonRow(ctx, item, styles)).join("")}</tbody></table></div></details>`;
  }

  // src/pages/equipment/item-use.js
  function fishMealAdvice(ctx) {
    return {
      summary: ctx.lang === "th" ? "ตรวจชื่อปลาที่เมนูแสดงก่อนกิน เพราะเกมกินตัวแรกในข้อง ถ้าเป็นคุซะฟุกุอย่ากิน: HP จะเหลือ 0" : ctx.lang === "ja" ? "食べる前に表示された魚名を確認する。びくの先頭を食べる。クサフグなら食べない：HPが0になる。" : "Check the displayed fish name before eating: the game eats the first keepnet fish. Do not eat Kusafugu; it sets HP to zero.",
      facts: [
        ctx.lang === "th" ? "ถ้าต้องการฟื้น HP โดยไม่เสียปลาตัวแรก ให้ซื้ออาหารแทน ปลาปกติฟื้นตามขนาด แต่กินแล้วปลาตัวนั้นหายไป" : ctx.lang === "ja" ? "先頭の魚を残して回復したいなら食料を買う。普通の魚はサイズに応じて回復するが、食べると失う。" : "Buy food instead if you want to keep the first fish. Ordinary fish restore HP by size, but eating removes that fish."
      ]
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
    if (item.category === "food" && item.id === "08") return fishMealAdvice(ctx);
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
    const stages = [...new Set(shops.filter(predicate).map((shop) => shop.stage))];
    return stages.map((stage) => shopLink(ctx, item, stage, area)).join(" · ");
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
        return other ? `<a href="${ctx.esc(ctx.itemHref(other))}">${ctx.esc(ctx.itemName(other))} (${ctx.esc(other.id)}) · ¥${ctx.esc(ref.priceYen)} ↗</a>` : "";
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
    const stages = [...new Set(points.map((loc) => Number(loc.stage)))];
    if (!stages.length) return "";
    const shown = ctx.locationStage && stages.includes(Number(ctx.locationStage)) ? [Number(ctx.locationStage)] : stages;
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
    if (item.category === "float_weight")
      return `<p><a class="route-button" data-float-price-guide href="index${ctx.lang === "en" ? "" : "." + ctx.lang}.html?category=float_weight#category-decisions">${ctx.lang === "th" ? "ดูทุ่นและตะกั่วราคาต่ำสุดแยกทั้งหกด่าน" : ctx.lang === "ja" ? "6エリアの最安ウキ・オモリを見る" : "See the cheapest float and sinker in each of six areas"} ↗</a></p>`;
    const ids = (item.gearDecision.targetFish || []).filter((id) => ctx.fishVisuals[id]);
    const hookBudget = item.category === "hook" ? `<p><a class="route-button" data-hook-price-guide href="index${ctx.lang === "en" ? "" : "." + ctx.lang}.html?category=hook#category-decisions">${ctx.lang === "th" ? "เบ็ดหายหรือยังไม่มี? ดูเบ็ดทั่วไปที่ถูกสุดทั้งหกด่าน" : ctx.lang === "ja" ? "針を失った・持っていない？6エリアの最安汎用針を見る" : "Lost your hook or have none? See the cheapest generic hook in each area"} ↗</a></p>` : "";
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

  // src/pages/equipment/return-action.js
  var pageRoots = ["index", "maps", "fish", "item", "shops"];
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
    const root = target.pathname.split("/").pop().match(/^(index|maps|fish|item|shops)(?:\.(?:th|ja))?\.html$/)?.[1];
    if (root) {
      const directory = target.pathname.slice(0, target.pathname.lastIndexOf("/") + 1);
      target.pathname = `${directory}${root}${targetLocale === "en" ? "" : `.${targetLocale}`}.html`;
    }
    const nested = target.searchParams.get("return");
    if (nested) {
      const localized = depth < 4 ? localizeSafeReturn(nested, targetLocale, baseHref, depth + 1) : "";
      if (localized) target.searchParams.set("return", localized);
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
  function updateLanguageLinks(rawReturn, baseHref) {
    const current = new URL(baseHref);
    document.querySelectorAll(".language-links a").forEach((link) => {
      const locale = link.getAttribute("hreflang");
      if (!locales.includes(locale)) return;
      const route = link.dataset.route || link.getAttribute("href").split(/[?#]/)[0];
      link.dataset.route = route;
      const query = new URLSearchParams(current.search);
      query.set("return", localizeSafeReturn(rawReturn, locale, baseHref));
      link.href = `${route}?${query}${current.hash}`;
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
    const action = mapReturnAction(rawReturn, ctx.lang, window.location.href);
    if (!action) return;
    const nav = document.querySelector(".hero-meta");
    if (nav && !document.querySelector("[data-map-return]")) {
      const link = document.createElement("a");
      link.className = "back-link map-return-link";
      link.dataset.mapReturn = "true";
      link.href = action.href;
      link.textContent = action.label;
      nav.prepend(link);
    }
    updateLanguageLinks(action.href, window.location.href);
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
    const stages = [...new Set(locations.map((location2) => location2.stage))];
    return stages.map((stage) => {
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
  function fishMapImage(ctx, id, fish, map, title, labels) {
    if (!map.image) return `<p>${ctx.esc(labels.unknown)}</p>`;
    const pins = (map.pins || []).map((pin, index) => fishPin(ctx, id, fish, pin, index)).join("");
    const ratio = `${Number(map.width) || 1}/${Number(map.height) || 1}`;
    return `<div class="map-scroll"><div class="map-canvas" style="aspect-ratio:${ratio}"><img class="map-background" loading="lazy" src="${ctx.esc(map.image)}?v=terrain-context-20261004" alt="${ctx.esc(title)}">${pins}</div></div><p class="fish-scope">${ctx.esc(fishPinNote(ctx))}</p><a href="${ctx.esc(map.image)}" target="_blank" rel="noopener">${labels.openMap} ↗</a>${map.fullImage ? ` · <a href="${ctx.esc(map.fullImage)}" target="_blank" rel="noopener">${ctx.lang === "th" ? "ดูแผนที่ทั้งด่าน" : ctx.lang === "ja" ? "全体地図" : "Full area map"} ↗</a>` : ""}`;
  }
  function fishMapArticle(ctx, id, fish, map, index, labels) {
    const title = ctx.local(map.name) || `${ctx.lang === "th" ? "แผนที่" : ctx.lang === "ja" ? "地図" : "Map"} ${index + 1}`;
    const bounds = map.tileBounds ? `<p class="fish-scope">X ${map.tileBounds.xMin}–${map.tileBounds.xMax} · Y ${map.tileBounds.yMin}–${map.tileBounds.yMax}</p>` : "";
    const source = map.sourceUrl ? ` · <a href="${ctx.esc(map.sourceUrl)}" target="_blank" rel="noopener">${labels.source} ↗</a>` : "";
    const note = map.note ? `<p>${ctx.esc(ctx.local(map.note))}</p>` : "";
    return `<article class="location-map"><h4>${ctx.esc(title)}</h4>${bounds}${fishMapImage(ctx, id, fish, map, title, labels)}${source}${note}</article>`;
  }
  function renderFishMaps(ctx, id, fish, maps, labels) {
    return maps.filter((map, index) => index === ctx.locationMapIndex).map((map, index) => fishMapArticle(ctx, id, fish, map, index, labels)).join("");
  }
  function stageButtons(ctx, locations, stageWord) {
    return locations.map(
      (location2) => `<button type="button" data-location-stage="${location2.stage}" aria-pressed="${String(location2.stage) === ctx.locationStage}">${stageWord} ${location2.stage} · ${ctx.esc(ctx.local(location2.stageName))}</button>`
    ).join("");
  }
  function fishMapHref(ctx, labels, id, location2) {
    const query = new URLSearchParams({ fish: id, return: ctx.sourceReturn() });
    if (location2) query.set("stage", String(location2.stage));
    return `${labels.page}?${query}`;
  }
  function renderFishAreaLinks(ctx, id, locations, labels) {
    if (!locations.length) return `<p>${ctx.esc(labels.unknown)}</p>`;
    const unique = [
      ...new Map(locations.map((location2) => [String(location2.stage), location2])).values()
    ];
    const links = unique.map((location2) => {
      const label = `${labels.stage} ${location2.stage} · ${ctx.local(location2.stageName)}`;
      return `<a class="fish-area-link" href="${ctx.esc(fishMapHref(ctx, labels, id, location2))}">${ctx.esc(label)} ↗</a>`;
    }).join("");
    return `<nav class="fish-area-links" aria-label="${ctx.esc(labels.areasLabel)}"><strong>${ctx.esc(labels.areasLabel)}:</strong> ${links}</nav>`;
  }
  function fishLocationHeader(ctx, id, fish, title, labels, chosen) {
    const portrait = fish.image ? `<a href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(ctx.fishName(id))} — ${ctx.detailLabel}"><img src="${ctx.esc(fish.image)}" alt=""></a>` : "";
    const intro = ctx.lang === "th" ? "ดูจุดตก แล้วเลือกเหยื่อจากรายการด้านล่าง" : ctx.lang === "ja" ? "釣り場を確認してから、下の対応エサを選びます。" : "Find a fishing spot, then choose compatible tackle below.";
    const profile = `<a class="fish-profile-link" href="${ctx.esc(ctx.fishHref(id))}">${labels.profileLabel} ↗</a>`;
    const map = `<a class="map-browser-cta" href="${ctx.esc(fishMapHref(ctx, labels, id, chosen))}">${labels.pageLabel} ↗</a>`;
    return `<div class="location-heading">${portrait}<div><h2>${ctx.esc(title)} — ${ctx.esc(ctx.fishName(id))}</h2><p>${intro}</p><nav class="fish-location-links">${profile}${map}</nav></div></div>`;
  }
  function chosenStageContent(ctx, chosen, locations, labels, overviewHtml, mapMenu, maps) {
    if (!locations.length) return `<p>${ctx.esc(labels.unknown)}</p>`;
    const access = chosen.accessNote ? `<p class="location-access">${ctx.esc(ctx.local(chosen.accessNote))}</p>` : "";
    const noMap = !maps ? `<p>${ctx.lang === "th" ? "พบพิกัดใน ROM แล้ว อยู่ระหว่างถอดภาพแผนที่" : ctx.lang === "ja" ? "ROM座標を抽出済み。地図画像を復号中。" : "ROM coordinates extracted; map rendering is in progress."}</p>` : "";
    const points = (chosen.points || []).map((point) => `(${point.x}, ${point.y})`).join(" · ");
    const pointLabel = ctx.lang === "th" ? "ดูพิกัดจุดเกิดจากเกม" : ctx.lang === "ja" ? "出現座標" : "Spawn coordinates";
    const provenance = ctx.lang === "th" ? "ตำแหน่งและชนิดปลาถอดจาก ROM; เปิดรายละเอียดเพื่อดูตารางและโค้ดที่ใช้ตรวจสอบ" : ctx.lang === "ja" ? "場所と魚種はROMから抽出。根拠の表とコードは調査詳細を参照。" : "Locations and species are extracted from ROM; research notes identify the source tables and code.";
    return `<nav class="part-menu location-stages" aria-label="${labels.stage}">${stageButtons(ctx, locations, labels.stage)}</nav><h3>${labels.stage} ${chosen.stage} · ${ctx.esc(ctx.local(chosen.stageName))}</h3><p>${ctx.esc(ctx.local(chosen.description))}</p>${access}${overviewHtml}${mapMenu}<div class="location-maps">${maps}</div>${noMap}<details class="spawn-coordinates"><summary>${pointLabel}</summary><p>${points}</p></details><p class="location-provenance">${provenance}</p>`;
  }
  function renderFishLocationContent(ctx, id, fish, chosen, locations, labels) {
    const mapChoices = chosen?.maps || [];
    if (ctx.locationMapIndex >= mapChoices.length) ctx.locationMapIndex = 0;
    const viewBox = mapChoices[ctx.locationMapIndex]?.overviewBox;
    const overview = renderAreaOverview(ctx, chosen, viewBox);
    const mapMenu = renderFishMapMenu(ctx, mapChoices);
    const maps = renderFishMaps(ctx, id, fish, mapChoices, labels);
    const mapContent = chosenStageContent(ctx, chosen, locations, labels, overview, mapMenu, maps);
    const mapLabel = chosen ? `${labels.mapDetails} · ${labels.stage} ${chosen.stage} · ${ctx.local(chosen.stageName)}` : labels.mapDetails;
    const disclosure = locations.length ? ctx.cardDisclosure(mapLabel, mapContent, "fish-location-details") : "";
    return `${fishLocationHeader(ctx, id, fish, labels.title, labels, chosen)}${renderFishAreaLinks(ctx, id, locations, labels)}${disclosure}`;
  }
  function renderFishLocation(ctx, id) {
    const labels = fishMapLabels(ctx);
    if (!id) return renderEmptyFishLocation();
    const fish = ctx.fishVisuals[id] || {};
    const locations = ctx.fishLocations[id]?.locations || [];
    const chosen = selectFishStage(ctx, locations);
    const mapHref = fishMapHref(ctx, labels, id, chosen);
    document.getElementById("map-browser-link").href = mapHref;
    const panel = document.getElementById("fish-location-panel");
    const keepMapOpen = panel.dataset?.fishId === String(id) && panel.querySelector?.("details.fish-location-details")?.open;
    panel.hidden = false;
    panel.dataset && (panel.dataset.fishId = String(id));
    panel.innerHTML = mapReturnMarkup(ctx) + renderFishLocationContent(ctx, id, fish, chosen, locations, labels);
    const disclosure = panel.querySelector?.("details.fish-location-details");
    if (keepMapOpen && disclosure) disclosure.open = true;
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
  function renderTargetAdvice(ctx, item, fish) {
    const advice = targetAdvice(ctx, item, fish);
    if (!advice) return "";
    const fishName = ctx.fishName(fish);
    const status = compatibilityText(ctx, fishName, advice.route);
    const limit = text(ctx, {
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

  // src/pages/equipment/item-card.js
  function itemAdvice(item) {
    return item.rodDecision || item.baitLureDecision || item.gearDecision;
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
  function guideEvidenceNote(ctx, use) {
    if (use.evidence?.type !== "player_guide_report") return "";
    return `<p class="fish-scope">${ctx.lang === "th" ? "คำอธิบายการใช้จากคู่มือผู้เล่น ยังไม่ได้ยืนยันจากโค้ดเกม" : ctx.lang === "ja" ? "用途はプレイヤーガイドによる報告。ゲームコードでは未確認。" : "Use reported by a player guide; not yet confirmed in game code."}</p>`;
  }
  function renderCardGuidance(ctx, item, use, summary, facts, advice) {
    const fish = document.getElementById("fish-filter")?.value || "";
    const targetAdvice2 = renderTargetAdvice(ctx, item, fish);
    const label = advice ? ctx.local(advice.label) : summary;
    const factList = facts.length ? `<ul class="use-facts">${facts.map((fact) => `<li>${ctx.esc(fact)}</li>`).join("")}</ul>` : "";
    const recommendation = advice ? `<h5>${ctx.esc(ctx.cardUi.fullRecommendation)}</h5><p class="card-full-recommendation">${ctx.esc(ctx.local(advice.recommendation) || summary)}</p>${advice.reason ? `<p class="card-decision-reason">${ctx.esc(ctx.local(advice.reason))}</p>` : ""}` : "";
    const details = [
      recommendation,
      factList,
      guideEvidenceNote(ctx, use),
      advice ? ctx.rodAlternatives(item) : "",
      advice ? ctx.gearNextActions(item) : "",
      advice ? ctx.flyMakerLink(item) : ""
    ].join("");
    const disclosure = ctx.cardDisclosure(
      advice ? ctx.cardUi.decisionDetails : ctx.cardUi.useDetails,
      details,
      advice ? "card-decision-disclosure" : "card-use-disclosure"
    );
    const actionTitle = targetAdvice2 ? ctx.lang === "th" ? "คำแนะนำสำหรับปลาที่เลือก" : ctx.lang === "ja" ? "選んだ魚への案内" : "Advice for your selected fish" : cardActionTitle(ctx, item, advice);
    const dataDecision = cardDecisionAttribute(ctx, item, advice);
    const summaryClass = advice ? "card-verdict" : "card-effect";
    const visibleAdvice = targetAdvice2 ? targetAdvice2 : `<p class="use-summary ${summaryClass}">${ctx.esc(label)}</p>`;
    return `<div class="use-block" ${dataDecision}><h4>${ctx.esc(actionTitle)}</h4>${visibleAdvice}<div class="card-more-content">${disclosure}</div></div>`;
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
    const use = ctx.useOf(item);
    const { summary, facts } = ctx.visibleUse(item);
    const advice = itemAdvice(item);
    const detailHref = ctx.itemHref(item);
    const identity = renderCardIdentity(ctx, item, use, detailHref);
    const guidance = renderCardGuidance(ctx, item, use, summary, facts, advice);
    const details = renderCardAcquisition(ctx, item);
    const poison = item.category === "food" && item.id === "0A" ? "poison-food" : "";
    return `<article class="item-card item-card-compact ${poison}" id="item-${item.category}-${item.id}">${identity}${guidance}${details}</article>`;
  }

  // src/pages/equipment/catalogue-results.js
  function readFilters() {
    return {
      term: document.getElementById("search").value.trim().toLocaleLowerCase(),
      fish: document.getElementById("fish-filter").value,
      category: document.getElementById("category-filter").value,
      order: document.getElementById("sort-filter").value,
      style: document.getElementById("style-filter").value
    };
  }
  function updateCatalogueLink(ctx, fish) {
    const maps = ctx.lang === "th" ? "maps.th.html" : ctx.lang === "ja" ? "maps.ja.html" : "maps.html";
    document.getElementById("map-browser-link").href = `${maps}${fish ? "?fish=" + fish : ""}`;
    document.getElementById("generic-lure-kit").hidden = !!fish;
  }
  function updateCatalogueUrl(category, fish, flyPart) {
    if (typeof history === "undefined" || typeof URLSearchParams === "undefined" || typeof location === "undefined")
      return;
    const query = new URLSearchParams(location.search);
    query.set("category", category);
    if (fish) query.set("fish", fish);
    else query.delete("fish");
    if (category === "flymaker") query.set("part", flyPart);
    else query.delete("part");
    history.replaceState(null, "", `?${query.toString()}${location.hash || "#catalogue"}`);
  }
  function updatePageContext(ctx, filters) {
    ctx.renderTargetCategories(filters.fish);
    updateCatalogueLink(ctx, filters.fish);
    updateCatalogueUrl(filters.category, filters.fish, ctx.flyPart);
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
    renderBaitRouteControl(ctx, category);
    document.getElementById("style-label").hidden = category !== "rod";
    renderFlyPartControl(ctx, category);
  }
  function fishMatchesItem(ctx, item, filters) {
    if (!filters.fish) return true;
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
  function sortCatalogueItems(ctx, items, order) {
    if (order === "name")
      return items.sort(
        (a, b) => ctx.itemName(a).localeCompare(ctx.itemName(b), ctx.lang) || a.id.localeCompare(b.id)
      );
    if (order === "price")
      return items.sort(
        (a, b) => (a.priceYen ?? Infinity) - (b.priceYen ?? Infinity) || a.id.localeCompare(b.id)
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
    if (ctx.lang === "th") return "แสดงเฉพาะรายการที่ผ่านเงื่อนไขปลานี้จาก ROM";
    if (ctx.lang === "ja") return "この魚のROM適合判定を通るアイテムのみ表示。";
    return "Only items that pass this fish’s ROM compatibility checks are shown.";
  }
  function fishStatus(ctx, filters) {
    if (!filters.fish) return "";
    if (filters.category === "bait") return ctx.player.fishOnly;
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
      filters.fish ? `${ctx.fishName(filters.fish)} — ${fishStatus(ctx, filters)}` : ""
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
  function renderItemResults(ctx, items, fish) {
    const box = document.getElementById("cards");
    if (!items.length) {
      box.innerHTML = `<p class="empty-state">${ctx.esc(emptyCatalogueMessage(ctx, fish))}</p>`;
      return;
    }
    box.innerHTML = items.map(ctx.renderItemCard).join("");
  }
  function renderResults(ctx, items, filters) {
    ctx.set("#result-count", ctx.copy.results(items.length));
    updateCatalogueHeadings(ctx, filters);
    document.querySelectorAll("[data-category]").forEach(
      (node) => node.setAttribute(
        "aria-current",
        node.dataset.category === filters.category ? "true" : "false"
      )
    );
    ctx.renderFishLocation(filters.fish);
    ctx.renderComparison(filters.category);
    ctx.renderDecisions(filters.category);
    renderItemResults(ctx, items, filters.fish);
  }
  function renderCards(ctx) {
    const filters = readFilters();
    updatePageContext(ctx, filters);
    renderCategoryControls(ctx, filters.category);
    const items = sortCatalogueItems(ctx, filterCatalogueItems(ctx, filters), filters.order);
    renderResults(ctx, items, filters);
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
    catalogueCopy: "Search either language, an item ID, or a stat. Open any card for its raw ROM bytes and record offset.",
    search: "Search",
    searchPlaceholder: "Try “rod”, “トップウォータ”, or “0D”",
    category: "Category",
    sort: "Sort",
    all: "All categories",
    sortId: "Item ID",
    sortName: "Name",
    sortPrice: "Price field",
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
    catalogueCopy: "ค้นด้วยชื่อภาษาไทยที่ถอดจากภาพแล้ว ภาษาอังกฤษ ญี่ปุ่น หรือเลข ID ได้ เปิดการ์ดเพื่อดูไบต์ดิบและตำแหน่งระเบียนใน ROM",
    search: "ค้นหา",
    searchPlaceholder: "ลองพิมพ์ชื่อไอเท็ม หรือ ID เช่น 0D",
    category: "ประเภท",
    sort: "เรียงตาม",
    all: "ทุกประเภท",
    sortId: "ID ไอเท็ม",
    sortName: "ชื่อ",
    sortPrice: "ช่องราคา",
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
    catalogueCopy: "英語・日本語、アイテムID、数値で検索できます。各カードを開くとROM生データとファイル位置を確認できます。",
    search: "検索",
    searchPlaceholder: "例: 「rod」「トップウォータ」「0D」",
    category: "カテゴリ",
    sort: "並び順",
    all: "すべてのカテゴリ",
    sortId: "アイテムID",
    sortName: "名前",
    sortPrice: "価格欄",
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
    ctx.set = (selector, text2) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = text2;
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
    reach: "ขอบเขตก่อนเสียอุปกรณ์",
    style: "รูปแบบการตก",
    titleByCategory: "อุปกรณ์ในหมวดนี้",
    noFish: "หมวดนี้ไม่ได้เลือกตามชนิดปลา",
    fishOnly: "แสดงเหยื่อที่ผ่านเงื่อนไขของปลาที่เลือก",
    basePrice: "ราคาพื้นฐาน",
    kit: "ชุดเหยื่อที่ครอบคลุมชนิดปลา",
    kitText: "ด่าน 1 ซื้อสปูน 2E + ยางหนอน 23 รวม 55 เยน แล้วพกคู่นี้ต่อได้ ไม่ต้องซื้อจมน้ำเพิ่ม ถ้าเริ่มซื้อชุดใหม่ที่ด่าน 4 เลือกจมน้ำ 17 + ยางหนอน 23 รวม 50 เยนได้ ทั้งสองคู่ครอบคลุมเงื่อนไขลัวร์ 38 โปรไฟล์ ไม่ใช่การรับประกันจับสำเร็จ",
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
      rod: "เลือกวิธีตกก่อน แล้วเลือกคันที่ให้เวลาเล็งหรือขอบเขตก่อนเสียอุปกรณ์ตามที่ต้องการ",
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
    aim: "Aim window",
    reach: "Fish-position loss limit",
    style: "Fishing style",
    titleByCategory: "Equipment in this category",
    noFish: "This category is not filtered by fish species",
    fishOnly: "Showing baits that pass the selected fish’s conditions",
    basePrice: "Base price",
    kit: "A lure set covering the compatible species",
    kitText: "Buy Spoon 2E + Soft worm 23 for ¥55 in area 1 and keep the pair. If starting a new kit in area 4, Sinking 17 + Soft worm 23 costs ¥50. Both cover 38 compatible profiles; buying Sinking after you own Spoon does not save money. Compatibility is not guaranteed landing.",
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
      rod: "Choose a fishing style, then compare time to aim and the fish-position limit before the traced tackle-loss escape.",
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
    aim: "照準時間",
    reach: "道具を失う魚位置の境界",
    style: "釣り方",
    titleByCategory: "この種類の装備",
    noFish: "この種類は魚種では絞り込まない",
    fishOnly: "選んだ魚の条件に合うエサを表示",
    basePrice: "基本価格",
    kit: "対応魚を網羅するルアー構成",
    kitText: "エリア1でスプーン2E＋ソフト・ワーム23を55円で買い、そのまま持ち続ける。エリア4で新しく揃えるなら17＋23は50円。どちらも適合38プロフィールを網羅するが、取り込み保証ではない。スプーン所持後のシンキング追加購入は節約にならない。",
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
      rod: "釣り方を選び、照準時間と道具喪失の魚位置境界を比較。",
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
    ctx.fishCategories = ["all", "bait", "lure", "flymaker", "float_weight"];
    ctx.suggestionIds = [];
    ctx.activeSuggestion = -1;
    ctx.pickerCopy = {
      th: {
        placeholder: "ชื่อปลา / fish name / ID",
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
      return ctx.lang === "th" ? f.nameTh || (f.nameThVariants || []).join(" / ") || latin || f.nameJa || id : ctx.lang === "en" ? f.nameEn || latin || f.nameJa || id : f.nameJa || id;
    };
    ctx.fishIdsFor = (item) => item.category === "bait" ? ctx.useOf(item).fishIdsByRoute?.[ctx.baitRoute] || ctx.useOf(item).fishIds || [] : ctx.useOf(item).fishIds || [];
    ctx.detailFile = (type) => `${type}${ctx.lang === "en" ? "" : "." + ctx.lang}.html`;
  }

  // src/pages/equipment/setup-navigation.js
  function setupNavigation(ctx) {
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
        q.set("route", ctx.baitRoute);
      if (ctx.locationStage) q.set("stage", String(ctx.locationStage));
      return `${ctx.detailFile("item")}?${q}`;
    };
    ctx.fishHref = (id) => `${ctx.detailFile("fish")}?id=${encodeURIComponent(id)}${ctx.locationStage ? "&stage=" + ctx.locationStage : ""}&return=${encodeURIComponent(ctx.sourceReturn())}`;
    setupReturnAction(ctx);
  }

  // src/pages/equipment/setup-card-links.js
  function setupCardLinks(ctx) {
    ctx.detailLabel = ctx.lang === "th" ? "ดูรายละเอียด" : ctx.lang === "ja" ? "詳細を見る" : "View details";
    ctx.decisionLink = (ref) => {
      const item = ctx.allItems.find((i) => i.category === ref.category && i.id === ref.id);
      return item ? `<a class="decision-item" href="${ctx.esc(ctx.itemHref(item))}"><img src="${ctx.esc(item.image)}" alt=""><span>${ctx.esc(ctx.itemName(item))}</span></a>` : "";
    };
    ctx.matchCategory = (item, category) => category === "all" || (category === "flymaker" ? item.category.startsWith("fly") : item.category === category);
    ctx.rodAdviceTitle = ctx.lang === "th" ? "ควรเลือกคันนี้เมื่อไร?" : ctx.lang === "ja" ? "この竿を選ぶときは？" : "When should I choose this rod?";
    ctx.rodAlternatives = (item) => (item.rodDecision || item.gearDecision || item.baitLureDecision)?.alternatives?.some(
      (ref) => ref.category !== item.category || ref.id !== item.id
    ) ? `<div class="rod-alternatives"><p>${ctx.lang === "th" ? "ตัวเลือกที่นำมาเทียบ:" : ctx.lang === "ja" ? "比較する候補：" : "Compare with:"}</p>${(item.rodDecision || item.gearDecision || item.baitLureDecision).alternatives.filter((ref) => ref.category !== item.category || ref.id !== item.id).map(ctx.decisionLink).join("")}</div>` : "";
    ctx.flyMakerLink = (item) => item.category.startsWith("fly") ? `<p><a class="route-button" data-fly-maker href="${ctx.esc(ctx.sourceReturn().split("#")[0] + "#fly-instructions")}">${ctx.lang === "th" ? "ดูขั้นตอนประกอบฟลายเองและตรวจราคาในเกม" : ctx.lang === "ja" ? "自作フライの手順とゲーム内見積額を確認" : "See custom fly steps and check the in-game quote"} ↗</a></p>` : "";
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
    ctx.renderFrames(data);
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
    if (["id", "name", "price"].includes(query.get("sort")))
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
  }
  function syncFishSearchText(ctx) {
    const fish = document.getElementById("fish-filter").value;
    document.getElementById("fish-search").value = fish ? ctx.fishName(fish) : "";
  }
  function openFlyGuideFromHash() {
    if (typeof window === "undefined" || window.location.hash !== "#fly-instructions") return;
    const guide = document.getElementById("fly-instructions");
    if (!guide) return;
    guide.open = true;
    guide.scrollIntoView({ behavior: "instant", block: "start" });
  }
  function scrollCategoryAdviceFromHash() {
    if (typeof window === "undefined" || window.location.hash !== "#category-decisions") return;
    document.getElementById("category-decisions")?.scrollIntoView({ block: "start" });
  }
  function openInitialContext() {
    openFlyGuideFromHash();
    scrollCategoryAdviceFromHash();
  }
  function handleCategoryClick(ctx, event) {
    const link = event.target.closest("[data-category]");
    if (!link) return;
    event.preventDefault();
    document.getElementById("category-filter").value = link.dataset.category;
    document.getElementById("search").value = "";
    document.getElementById("style-filter").value = "";
    ctx.renderCards();
    if (typeof history !== "undefined")
      history.replaceState(
        null,
        "",
        `?category=${link.dataset.category}${document.getElementById("fish-filter").value ? "&fish=" + document.getElementById("fish-filter").value : ""}#catalogue`
      );
    document.getElementById("catalogue").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function handleBaitRouteClick(ctx, event) {
    const button = event.target.closest("[data-route]");
    if (!button) return;
    ctx.baitRoute = button.dataset.route;
    ctx.renderCards();
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
    ctx.renderFishLocation(document.getElementById("fish-filter").value);
    ctx.renderDecisions(document.getElementById("category-filter").value);
  }
  function handleLocationMapChange(ctx, event) {
    if (event.target.id !== "location-map-select") return;
    ctx.locationMapIndex = Number(event.target.value);
    ctx.renderFishLocation(document.getElementById("fish-filter").value);
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
    document.getElementById("fly-part-menu").addEventListener("click", (event) => handleFlyPartClick(ctx, event));
    const locationPanel = document.getElementById("fish-location-panel");
    locationPanel.addEventListener("click", (event) => handleLocationStageClick(ctx, event));
    locationPanel.addEventListener("change", (event) => handleLocationMapChange(ctx, event));
    bindFilterInputs(ctx);
  }
  function renderInitialCatalogue(ctx) {
    syncFishSearchText(ctx);
    ctx.setupFishPicker();
    ctx.renderCards();
    openInitialContext();
    bindCatalogueEvents(ctx);
  }
  function initializeLoadedCatalogue(ctx, data) {
    installCatalogueData(ctx, data);
    restoreInitialFilters(ctx);
    renderInitialCatalogue(ctx);
  }
  function loadCatalogue(ctx) {
    fetch("gallery-data.json?v=compendium-20261005-07").then((response) => {
      if (!response.ok) throw new Error("catalogue unavailable");
      return response.json();
    }).then((data) => initializeLoadedCatalogue(ctx, data)).catch((error) => console.error(error));
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
    loadCatalogue(ctx);
  }

  // src/app/equipment.js
  var runtimeContext = createPageRuntime(equipment_exports);
  initialize(runtimeContext);
})();
