(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/maps/index.js
  var maps_exports = {};
  __export(maps_exports, {
    addFishLocation: () => addFishLocation,
    areaCount: () => areaCount,
    buildData: () => buildData,
    chooseSection: () => chooseSection,
    chooseSuggestion: () => chooseSuggestion,
    closeSuggestions: () => closeSuggestions,
    enableControls: () => enableControls,
    fishChoice: () => fishChoice,
    fishInStage: () => fishInStage,
    indexMapSections: () => indexMapSections,
    initFromUrl: () => initFromUrl,
    initialize: () => initialize,
    localizeReturn: () => localizeReturn,
    mapGeometry: () => mapGeometry,
    mapPinMarkup: () => mapPinMarkup,
    matchingSuggestions: () => matchingSuggestions,
    normalizedSearch: () => normalizedSearch,
    render: () => render,
    renderAreas: () => renderAreas,
    renderFishList: () => renderFishList,
    renderFishListHeader: () => renderFishListHeader,
    renderMap: () => renderMap,
    renderMapNavigation: () => renderMapNavigation,
    renderMapSummary: () => renderMapSummary,
    renderNotebookGuide: () => renderNotebookGuide,
    renderOverview: () => renderOverview,
    renderSectionSelect: () => renderSectionSelect,
    renderSuggestions: () => renderSuggestions,
    renderTargetSectionLinks: () => renderTargetSectionLinks,
    renderWaterKey: () => renderWaterKey,
    safeReturn: () => safeReturn,
    searchable: () => searchable,
    setActiveSuggestion: () => setActiveSuggestion,
    setFish: () => setFish,
    setSuggestionsExpanded: () => setSuggestionsExpanded,
    showPinDetails: () => showPinDetails,
    speciesRecord: () => speciesRecord,
    updateLanguageLinks: () => updateLanguageLinks,
    updateUrl: () => updateUrl
  });

  // src/pages/maps/notebook-guide.js
  var copy = {
    en: {
      title: "Fish journal · route checklist",
      intro: () => "New species to target on an Area 1 → 6 route for all 66 journal fish.",
      progress: (stage, count, total) => `Unique species through Area ${stage}: ${count}/${total}`,
      newTitle: (count) => `Show the ${count} new species to catch here`,
      repeated: (count) => `Also found in an earlier area · ${count}`,
      repeatedNote: "These species already have one journal slot. An equal or smaller fish leaves the recorded best size and area unchanged; a larger fish moves the entry to this area.",
      excluded: (count) => `On this map, not in the 66-species journal · ${count}`,
      excludedNote: "These fish appear on the map but have no species entry in the journal.",
      recorded: "Fish details",
      id: "ID",
      routeNote: "The journal has one slot per species. It shows the area where your largest fish of that species was recorded. Catching a larger fish in another area moves the existing entry. This guide does not read your save.",
      triggerLimit: "The ROM trace confirms the larger-size check, but does not prove which fishing outcomes trigger the journal update.",
      evidence: "ROM evidence and method",
      evidenceLink: "Read the notebook record research",
      empty: "No new species are listed for this area in the route."
    },
    ja: {
      title: "魚図鑑 · 全66種ルートチェック",
      intro: () => "図鑑全66種を集めるエリア1→6ルートで、新しく狙う魚です。",
      progress: (stage, count, total) => `エリア${stage}までの対象魚種: ${count}/${total}`,
      newTitle: (count) => `このエリアで釣る新しい魚 ${count}種を見る`,
      repeated: (count) => `前のエリアにも登場 · ${count}種`,
      repeatedNote: "この魚種の図鑑枠は1つです。同じか小さい魚では記録サイズやエリアは変わらず、より大きい魚を釣ると記録がこのエリアに移ります。",
      excluded: (count) => `マップにはいるが図鑑66種には含まれない · ${count}種`,
      excludedNote: "マップ上にはいますが、図鑑に魚種の記録枠はありません。",
      recorded: "魚の詳細",
      id: "ID",
      routeNote: "図鑑は魚種ごとに1枠です。その魚の最大サイズを記録したエリアが表示されます。別のエリアでより大きい魚を釣ると、記録がそのエリアへ移ります。この一覧はセーブデータを読み取りません。",
      triggerLimit: "ROMコードではサイズ比較を確認しましたが、どの釣果で図鑑更新処理が呼ばれるかは確認できていません。",
      evidence: "ROMの根拠と調査方法",
      evidenceLink: "魚図鑑の記録に関する調査を読む",
      empty: "このエリアにルート上の新しい魚種はありません。"
    },
    th: {
      title: "สมุดปลา · เส้นทางเก็บครบ 66 ชนิด",
      intro: () => "ถ้าไล่เก็บสมุดด่าน 1 → 6 ให้ตกปลาชนิดใหม่ของด่านนี้ก่อน",
      progress: (stage, count, total) => `เป้าหมายปลาไม่ซ้ำถึงด่าน ${stage}: ${count}/${total} ชนิด`,
      newTitle: (count) => `ดูรายชื่อปลาใหม่ ${count} ชนิดที่ควรเก็บในด่านนี้`,
      repeated: (count) => `พบในด่านก่อนหน้าด้วย · ${count} ชนิด`,
      repeatedNote: "ปลากลุ่มนี้ใช้ช่องสมุดเดิม ตัวที่ขนาดเท่าหรือเล็กกว่าสถิติเดิมจะไม่เปลี่ยนขนาดสูงสุดหรือด่านที่บันทึกไว้ ถ้าตกได้ตัวใหญ่กว่า รายการจะย้ายมาเป็นด่านนี้",
      excluded: (count) => `มีบนแผนที่ แต่ไม่มีช่องในสมุด 66 ชนิด · ${count} ชนิด`,
      excludedNote: "ปลากลุ่มนี้ปรากฏบนแผนที่ แต่ไม่มีรายการชนิดปลาในสมุด",
      recorded: "ดูข้อมูลปลา",
      id: "ID",
      routeNote: "สมุดมีหนึ่งช่องต่อปลาแต่ละชนิด และแสดงด่านที่ทำสถิติขนาดใหญ่ที่สุดไว้ ถ้าตกได้ตัวใหญ่กว่าในด่านอื่น ช่องเดิมจะย้ายไปด่านใหม่ คู่มือนี้ไม่ได้อ่านเซฟของคุณ",
      triggerLimit: "โค้ด ROM ยืนยันว่าตรวจค่าขนาดที่มากกว่าสถิติเดิม แต่ยังระบุไม่ได้ว่าผลการตกแบบใดเรียกการอัปเดตสมุด",
      evidence: "หลักฐาน ROM และวิธีตรวจสอบ",
      evidenceLink: "อ่านบันทึกการแกะระบบสมุดปลา",
      empty: "ไม่มีปลาใหม่ตามเส้นทางในด่านนี้"
    }
  };
  function localizedCopy(ctx) {
    return copy[ctx.lang] || copy.en;
  }
  function normalizedId(ctx, id) {
    return ctx.idNorm ? ctx.idNorm(id) : String(id).toUpperCase().padStart(2, "0");
  }
  function eligibleFish(ctx, ids, profiles) {
    return (Array.isArray(ids) ? ids : []).map((id) => normalizedId(ctx, id)).filter((id) => profiles[id]?.notebookEligible === true && ctx.species[id]);
  }
  function excludedFish(ctx, ids, profiles) {
    return (Array.isArray(ids) ? ids : []).map((id) => normalizedId(ctx, id)).filter((id) => profiles[id]?.notebookEligible === false && ctx.species[id]);
  }
  function fishCard(ctx, copyText, id) {
    const fish = ctx.species[id];
    const image = fish.visual?.image ? `<img loading="lazy" src="${ctx.esc(fish.visual.image)}" alt="">` : "";
    return `<a class="notebook-fish" href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(fish.name)} · ${copyText.recorded}">${image}<span><strong>${ctx.esc(fish.name)}</strong><small>${ctx.esc(copyText.id)} ${ctx.esc(id)} · ${ctx.esc(copyText.recorded)} ↗</small></span></a>`;
  }
  function fishList(ctx, copyText, ids) {
    return ids.map((id) => fishCard(ctx, copyText, id)).join("");
  }
  function detailsList(ctx, kind, title, note, ids, copyText) {
    if (!ids.length) return "";
    return `<details class="notebook-${kind}"><summary>${ctx.esc(title(ids.length))}</summary><p>${ctx.esc(note)}</p><div class="notebook-fish-list">${fishList(ctx, copyText, ids)}</div></details>`;
  }
  function routeProgress(ctx, guide, activeStage) {
    let total = 0;
    for (const stage of guide.stages)
      if (stage.stage <= Number(activeStage))
        total += eligibleFish(ctx, stage.firstOccurrenceSpecies, guide.species).length;
    return Math.min(total, guide.totals.notebookEligibleSpecies);
  }
  function evidenceLink(ctx, copyText) {
    const href = "https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/notebook-completion-research.md";
    return `<details class="notebook-evidence"><summary>${ctx.esc(copyText.evidence)}</summary><p>${ctx.esc(copyText.triggerLimit)}</p><p><a href="${href}">${ctx.esc(copyText.evidenceLink)} ↗</a></p></details>`;
  }
  function notebookGuideMarkup(ctx) {
    const guide = ctx.notebookCompletion;
    const stage = guide?.stages?.find((entry) => entry.stage === Number(ctx.activeStage));
    if (!guide?.species || !stage || typeof ctx.fishHref !== "function") return "";
    const copyText = localizedCopy(ctx);
    const newIds = eligibleFish(ctx, stage.firstOccurrenceSpecies, guide.species);
    const repeatedIds = eligibleFish(ctx, stage.repeatedFromEarlierStages, guide.species);
    const excludedIds = excludedFish(ctx, stage.excludedFromNotebook, guide.species);
    const newTitle = (count) => copyText.newTitle(count);
    const detailsOpen = ctx.openNotebookGuide ? " open" : "";
    const newList = newIds.length ? `<details class="notebook-new"${detailsOpen}><summary>${ctx.esc(newTitle(newIds.length))}</summary><div class="notebook-fish-list">${fishList(ctx, copyText, newIds)}</div></details>` : `<p class="notebook-empty">${ctx.esc(copyText.empty)}</p>`;
    const repeated = detailsList(
      ctx,
      "repeated",
      copyText.repeated,
      copyText.repeatedNote,
      repeatedIds,
      copyText
    );
    const excluded = detailsList(
      ctx,
      "excluded",
      copyText.excluded,
      copyText.excludedNote,
      excludedIds,
      copyText
    );
    const progress = routeProgress(ctx, guide, ctx.activeStage);
    const total = guide.totals.notebookEligibleSpecies;
    return `<div class="notebook-guide-panel" data-stage="${ctx.activeStage}"><div class="notebook-guide-heading"><div><p class="notebook-eyebrow">${ctx.esc(copyText.title)}</p><h3>${ctx.esc(ctx.c.area(ctx.activeStage))}</h3></div><strong class="notebook-new-count">${newIds.length}</strong></div><p class="notebook-intro">${ctx.esc(copyText.intro(newIds.length))}</p><p class="notebook-progress">${ctx.esc(copyText.progress(ctx.activeStage, progress, total))}</p>${newList}${repeated}${excluded}<p class="notebook-route-note">${ctx.esc(copyText.routeNote)}</p>${evidenceLink(ctx, copyText)}</div>`;
  }
  function renderNotebookGuide(ctx) {
    const mount = ctx.$("notebook-guide");
    if (!mount) return;
    const markup = notebookGuideMarkup(ctx);
    mount.innerHTML = markup;
    mount.hidden = !markup;
  }

  // src/pages/maps/water-icons.js
  var copy2 = {
    th: {
      title: "สัญลักษณ์บนผิวน้ำในเกม",
      small: "ปลาเล็ก: ต่ำกว่า 50 ซม.",
      large: "ปลาใหญ่: ตั้งแต่ 50 ซม.",
      bubble: "ฟอง: บางชนิดใช้ภาพนี้ทุกขนาด",
      note: "ภาพปลาใช้ขนาดตอนสร้างไอคอน ปลาโตต่อได้โดยภาพไม่เปลี่ยนทันที จึงไม่รับประกันขนาดตอนตกได้ ฟองไม่บอกขนาด และไอคอนอย่างเดียวบอกชนิดปลาไม่ได้ ภาพหมุดบนเว็บคือรูปชนิดปลา ไม่ใช่ไอคอนในเกม",
      detail: "ดูไอคอนที่ปลานี้แสดงได้"
    },
    en: {
      title: "Water marks in the game",
      small: "Small: under 50 cm",
      large: "Large: at least 50 cm",
      bubble: "Bubbles: certain species, any size",
      note: "Fish marks read size when created and do not immediately refresh as fish grow; they do not guarantee landed size. Bubbles do not reveal size; a mark alone cannot identify the species. Website pins show species portraits, not in-game marks.",
      detail: "See this fish’s possible marks"
    },
    ja: {
      title: "ゲーム内の水面マーク",
      small: "小魚影：50cm未満",
      large: "大魚影：50cm以上",
      bubble: "泡：特定の魚種、サイズ不問",
      note: "魚影は作成時のサイズを示し、成長しても直ちに更新されません。釣り上げ時のサイズは保証しません。泡ではサイズを判断できず、マークだけでは魚種も特定できません。地図のピンは魚種の画像で、ゲーム内のマークではありません。",
      detail: "この魚のマークを確認"
    }
  };
  function renderWaterKey(ctx) {
    const node = ctx.$("water-icon-key");
    const data = ctx.waterIcons;
    if (!node || !data?.classes) return;
    const c = copy2[ctx.lang];
    const profile = data.profiles?.[ctx.selectedFish];
    const classes = profile?.possibleClasses || ["small", "large", "bubble"];
    const cards = classes.filter((key) => data.classes[key]?.image).map(
      (key) => `<li><img src="${ctx.esc(data.classes[key].image)}" alt=""><span>${ctx.esc(c[key])}</span></li>`
    ).join("");
    const link = profile ? `<a href="${ctx.esc(ctx.fishHref(ctx.selectedFish))}#water-icons">${ctx.esc(c.detail)} ↗</a>` : "";
    node.innerHTML = `<h4>${ctx.esc(c.title)}</h4><ul>${cards}</ul><p>${ctx.esc(c.note)}</p>${link}`;
    node.hidden = !cards;
  }

  // src/pages/maps/fish-search.js
  function safeReturn(ctx, raw) {
    if (!raw || raw.startsWith("//") || raw.includes("\\") || /^[a-z][a-z0-9+.-]*:/i.test(raw))
      return "";
    try {
      const base = new URL(".", location.href), target = new URL(raw, base);
      const allowed = ["index", "maps", "fish", "item", "shops"].flatMap(
        (name) => ["", ".th", ".ja"].map((suffix) => {
          const route = `${name}${suffix}.html`;
          return { route, pathname: new URL(route, base).pathname };
        })
      );
      allowed.push(
        ...["index.html", "index.th.html", "index.ja.html"].map((file) => {
          const route = `../research/${file}`;
          return { route, pathname: new URL(route, base).pathname };
        })
      );
      const match = allowed.find((entry) => entry.pathname === target.pathname);
      return target.origin === base.origin && match ? match.route + target.search + target.hash : "";
    } catch {
      return "";
    }
  }
  function localizeReturn(ctx, raw, toLang, depth = 0) {
    const safe = ctx.safeReturn(raw);
    if (!safe) return "";
    const base = new URL(".", location.href), url = new URL(safe, base);
    url.pathname = url.pathname.replace(
      /(index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/,
      `$1${toLang === "en" ? "" : "." + toLang}.html`
    );
    if (url.searchParams.has("return")) {
      const nested = depth < 4 ? ctx.localizeReturn(url.searchParams.get("return"), toLang, depth + 1) : "";
      if (nested) url.searchParams.set("return", nested);
      else url.searchParams.delete("return");
    }
    return ctx.safeReturn(url.pathname + url.search + url.hash);
  }
  function buildData(ctx, raw, gallery) {
    ctx.fishData = raw.fish || {};
    ctx.visuals = gallery.fishVisuals || {};
    ctx.species = {};
    for (const [rawId, record] of Object.entries(ctx.fishData)) {
      const id = ctx.idNorm(rawId), visual = ctx.visuals[id] || {};
      ctx.species[id] = ctx.speciesRecord(id, record, visual);
      for (const location2 of record.locations || []) ctx.addFishLocation(id, location2);
      ctx.species[id].stages = [...new Set(ctx.species[id].stages)].sort((a, b) => a - b);
    }
    ctx.indexMapSections();
  }
  function speciesRecord(ctx, id, record, visual) {
    const variants = [
      ...visual.nameThVariants || [],
      ...visual.nameLatinVariants || [],
      ...visual.nameJapaneseVariants || []
    ];
    const name = ctx.lang === "ja" ? visual.nameJa || record.nameJa : ctx.lang === "th" ? visual.nameTh || visual.nameThVariants?.join(" / ") || `${record.nameJa} · ID ${id}` : visual.nameLatin || visual.nameLatinVariants?.slice().sort((a, b) => b.length - a.length)[0] || visual.nameEn || `${record.nameJa} · ID ${id}`;
    const aliases = [
      id,
      record.nameJa,
      visual.nameJa,
      visual.nameEn,
      visual.nameLatin,
      visual.nameTh,
      ...variants
    ].filter(Boolean);
    return {
      id,
      record,
      visual,
      name,
      aliases: [...new Set(aliases.map((v) => String(v).toLocaleLowerCase()))],
      stages: []
    };
  }
  function addFishLocation(ctx, id, location2) {
    const stage = Number(location2.stage);
    ctx.species[id].stages.push(stage);
    let data = ctx.stages[stage];
    if (!data) {
      const overview = location2.overview || {};
      data = ctx.stages[stage] = {
        stage,
        name: ctx.local(location2.stageName),
        fullImage: location2.maps?.[0]?.fullImage || `maps/rom-field-${String(stage).padStart(2, "0")}.png`,
        width: Number(overview.rotated ? overview.height : overview.width),
        height: Number(overview.rotated ? overview.width : overview.height),
        overview,
        species: /* @__PURE__ */ new Set(),
        pins: /* @__PURE__ */ new Map(),
        sections: /* @__PURE__ */ new Map()
      };
    }
    data.species.add(id);
    for (const point of location2.points || []) {
      const x = Number(point.x), y = Number(point.y), key = `${x},${y}`;
      let pin = data.pins.get(key);
      if (!pin) data.pins.set(key, pin = { x, y, fishIds: [] });
      if (!pin.fishIds.includes(id)) pin.fishIds.push(id);
    }
  }
  function indexMapSections(ctx) {
    for (const data of Object.values(ctx.stages))
      for (const pin of data.pins.values()) {
        const col = Math.floor((pin.x * 16 + 8) / 384), row = Math.floor((pin.y * 16 + 8) / 384), key = `s${data.stage}-c${col + 1}-r${row + 1}`;
        let section = data.sections.get(key);
        if (!section) data.sections.set(key, section = { key, col, row, pins: [] });
        section.pins.push(pin);
      }
  }
  function updateUrl(ctx) {
    const params = new URLSearchParams();
    params.set("stage", String(ctx.activeStage));
    if (ctx.returnPath) params.set("return", ctx.returnPath);
    if (ctx.activeSection) params.set("section", ctx.activeSection);
    if (ctx.selectedFish) params.set("fish", ctx.selectedFish);
    if (ctx.listScope === "section") params.set("scope", "section");
    history.replaceState(
      null,
      "",
      `${location.pathname}?${params.toString()}${ctx.openNotebookGuide ? "#notebook-guide" : ""}`
    );
    ctx.updateLanguageLinks(params);
  }
  function updateLanguageLinks(ctx, params) {
    document.querySelectorAll(".language-links a").forEach((link) => {
      const paramsCopy = new URLSearchParams(params);
      const route = (link.dataset.route || link.getAttribute("href") || "").split("?")[0];
      link.dataset.route = route;
      const toLang = link.getAttribute("hreflang");
      if (ctx.returnPath && ["en", "th", "ja"].includes(toLang))
        paramsCopy.set("return", ctx.localizeReturn(ctx.returnPath, toLang));
      link.href = `${route}?${paramsCopy.toString()}`;
    });
  }
  function fishInStage(ctx, id, stage) {
    return (ctx.species[id]?.stages || []).includes(Number(stage));
  }
  function areaCount(ctx, stage) {
    return ctx.stages[stage]?.species.size || 0;
  }
  function chooseSection(ctx, stage, preferredKey = "") {
    const data = ctx.stages[stage], sections = [...data?.sections.values() || []];
    if (!sections.length) return "";
    if (preferredKey && data.sections.has(preferredKey)) return preferredKey;
    if (ctx.selectedFish) {
      const forFish = sections.map((s) => ({
        ...s,
        count: s.pins.filter((p) => p.fishIds.includes(ctx.selectedFish)).length
      })).filter((s) => s.count > 0).sort((a, b) => b.count - a.count || a.row - b.row || a.col - b.col);
      if (forFish.length) return forFish[0].key;
    }
    return sections.sort((a, b) => b.pins.length - a.pins.length || a.row - b.row || a.col - b.col)[0].key;
  }
  function renderAreas(ctx) {
    ctx.areaList.innerHTML = Object.values(ctx.stages).sort((a, b) => a.stage - b.stage).map((data) => {
      const targetHere = !ctx.selectedFish || data.species.has(ctx.selectedFish);
      const pressed = data.stage === ctx.activeStage;
      const small = ctx.selectedFish ? targetHere ? ctx.c.targetAvailable : ctx.c.targetAbsent : ctx.c.allArea(data.species.size);
      return `<button class="area-button" type="button" data-stage="${data.stage}" aria-pressed="${pressed}" ${ctx.selectedFish && !targetHere ? "disabled" : ""}><strong>${ctx.esc(ctx.c.area(data.stage))}</strong><small>${ctx.esc(data.name)} · ${ctx.esc(small)}</small></button>`;
    }).join("");
  }
  function searchable(ctx, id) {
    return ctx.species[id].aliases.join(" · ");
  }
  function normalizedSearch(ctx, value) {
    return String(value ?? "").normalize("NFKC").trim().toLocaleLowerCase();
  }
  function matchingSuggestions(ctx, term) {
    const query = ctx.normalizedSearch(term);
    if (!query) return [];
    return Object.keys(ctx.species).filter(
      (id) => ctx.species[id].stages.length && ctx.normalizedSearch(ctx.searchable(id)).includes(query)
    ).sort((a, b) => {
      const rank = (id) => {
        const record = ctx.species[id];
        if (ctx.normalizedSearch(id) === query || record.aliases.some((alias) => ctx.normalizedSearch(alias) === query))
          return 0;
        if (record.aliases.some((alias) => ctx.normalizedSearch(alias).startsWith(query))) return 1;
        return 2;
      };
      return rank(a) - rank(b) || ctx.fishName(a).localeCompare(ctx.fishName(b), ctx.lang) || a.localeCompare(b);
    });
  }
  function setSuggestionsExpanded(ctx, expanded) {
    ctx.searchInput.setAttribute("aria-expanded", String(Boolean(expanded)));
    if (!expanded) ctx.searchInput.removeAttribute("aria-activedescendant");
  }
  function closeSuggestions(ctx, dismiss = true) {
    if (dismiss) ctx.suggestionsDismissed = true;
    ctx.activeSuggestion = -1;
    ctx.suggestionList.hidden = true;
    ctx.fishList.hidden = false;
    ctx.setSuggestionsExpanded(false);
  }
  function renderSuggestions(ctx) {
    const matches = ctx.matchingSuggestions(ctx.searchInput.value);
    ctx.suggestionIds = matches.slice(0, ctx.suggestionLimit);
    ctx.activeSuggestion = -1;
    const open = Boolean(ctx.searchInput.value.trim()) && !ctx.suggestionsDismissed && document.activeElement === ctx.searchInput && ctx.suggestionIds.length > 0;
    const areaLabel = ctx.lang === "th" ? "พื้นที่" : ctx.lang === "ja" ? "エリア" : "Areas";
    ctx.suggestionList.innerHTML = ctx.suggestionIds.map((id, index) => {
      const item = ctx.species[id], image = item.visual.image || "";
      const areaBadges = item.stages.map((stage) => `<span class="suggestion-area-badge">${ctx.esc(ctx.c.area(stage))}</span>`).join("");
      const secondary = ctx.lang === "ja" ? item.visual.nameLatin || item.visual.nameTh || "" : item.visual.nameJa || "";
      const targetClass = ctx.selectedFish === id ? " is-map-target" : "";
      return `<div id="fish-suggestion-${id}" class="fish-suggestion${targetClass}" role="option" aria-selected="false" aria-posinset="${index + 1}" aria-setsize="${matches.length}" data-suggestion="${id}">${image ? `<img src="${ctx.esc(image)}" alt="">` : '<span class="suggestion-no-image" aria-hidden="true"></span>'}<span class="suggestion-copy"><strong>${ctx.esc(item.name)}</strong>${secondary && secondary !== item.name ? `<small class="suggestion-alias">${ctx.esc(secondary)}</small>` : ""}<span class="suggestion-meta"><code>ID ${ctx.esc(id)}</code><span class="suggestion-area-label">${areaLabel}</span><span class="suggestion-areas">${areaBadges}</span></span></span></div>`;
    }).join("");
    ctx.suggestionList.hidden = !open;
    ctx.fishList.hidden = open;
    ctx.setSuggestionsExpanded(open);
  }
  function setActiveSuggestion(ctx, index) {
    if (!ctx.suggestionIds.length) return;
    ctx.activeSuggestion = (index + ctx.suggestionIds.length) % ctx.suggestionIds.length;
    const options = ctx.suggestionList.querySelectorAll('[role="option"]');
    options.forEach(
      (option2, optionIndex) => option2.setAttribute("aria-selected", String(optionIndex === ctx.activeSuggestion))
    );
    const id = ctx.suggestionIds[ctx.activeSuggestion], option = document.getElementById(`fish-suggestion-${id}`);
    if (option) {
      ctx.searchInput.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView?.({ block: "nearest" });
    }
  }
  function chooseSuggestion(ctx, id) {
    if (!ctx.species[id]?.stages?.length) return;
    const visual = ctx.species[id].visual;
    const localeAliases = ctx.lang === "th" ? [
      visual.nameTh,
      ...visual.nameThVariants || [],
      visual.nameLatin,
      ...visual.nameLatinVariants || [],
      visual.nameJa,
      id
    ] : ctx.lang === "ja" ? [
      visual.nameJa,
      visual.nameLatin,
      ...visual.nameLatinVariants || [],
      visual.nameTh,
      ...visual.nameThVariants || [],
      id
    ] : [
      visual.nameEn,
      visual.nameLatin,
      ...visual.nameLatinVariants || [],
      visual.nameJa,
      visual.nameTh,
      ...visual.nameThVariants || [],
      id
    ];
    ctx.searchInput.value = localeAliases.find(
      (alias) => alias && ctx.species[id].aliases.some(
        (value) => ctx.normalizedSearch(value) === ctx.normalizedSearch(alias)
      )
    ) || id;
    ctx.searchTerm = ctx.searchInput.value;
    ctx.closeSuggestions(true);
    ctx.setFish(id, { toggle: false });
  }
  function renderFishList(ctx) {
    const term = ctx.normalizedSearch(ctx.searchTerm);
    const sectionIds = new Set(
      ctx.stages[ctx.activeStage]?.sections.get(ctx.activeSection)?.pins.flatMap((pin) => pin.fishIds) || []
    );
    const ids = Object.keys(ctx.species).filter(
      (id) => term ? ctx.normalizedSearch(ctx.searchable(id)).includes(term) : ctx.listScope === "section" ? sectionIds.has(id) : ctx.fishInStage(id, ctx.activeStage)
    ).sort((a, b) => ctx.fishName(a).localeCompare(ctx.fishName(b), ctx.lang));
    ctx.renderFishListHeader(term, ids);
    ctx.fishList.innerHTML = ids.length ? ids.map((id) => ctx.fishChoice(id, term, sectionIds)).join("") : `<div class="empty-list">${ctx.esc(ctx.c.noFish)}</div>`;
  }
  function renderFishListHeader(ctx, term, ids) {
    const header = ctx.$("fish-title");
    header.textContent = term ? ctx.c.searchResults : ctx.listScope === "section" ? ctx.lang === "th" ? "ปลาในส่วนแผนที่นี้" : ctx.lang === "ja" ? "この地図範囲の魚" : "Fish in this map section" : ctx.c.fishIn;
    ctx.$("fish-scope").innerHTML = [
      ["area", ctx.lang === "th" ? "ทั้งด่าน" : ctx.lang === "ja" ? "エリア全体" : "Whole area"],
      [
        "section",
        ctx.lang === "th" ? "ส่วนที่กำลังดู" : ctx.lang === "ja" ? "表示範囲" : "Current section"
      ]
    ].map(
      ([value, label]) => `<button type="button" data-scope="${value}" aria-pressed="${ctx.listScope === value}">${label}</button>`
    ).join("");
    ctx.$("area-summary").textContent = term ? `${ids.length} ${ctx.c.fish} · ${ctx.c.areas} ${ctx.lang === "ja" ? "で出現" : ctx.lang === "th" ? "ที่พบ" : "with configured points"}` : `${ctx.c.area(ctx.activeStage)} · ${ids.length} ${ctx.c.fish}`;
    ctx.$("search-count").textContent = `${ids.length} ${ctx.c.fish}`;
    ctx.$("show-all").textContent = ctx.c.showAll;
    ctx.fishList.hidden = false;
    ctx.renderSuggestions();
  }
  function fishChoice(ctx, id, term, sectionIds) {
    const item = ctx.species[id], img = item.visual.image || "";
    const availability = item.stages.join(", ");
    const pointCount = [...ctx.stages[ctx.activeStage]?.pins.values() || []].filter(
      (pin) => pin.fishIds.includes(id) && (ctx.listScope !== "section" || sectionIds.has(id) && ctx.stages[ctx.activeStage].sections.get(ctx.activeSection)?.pins.includes(pin))
    ).length;
    const sub = term ? `${ctx.c.areasPrefix} ${availability}` : `${ctx.c.point(pointCount)}${item.visual.nameJa && ctx.lang !== "ja" ? ` · ${item.visual.nameJa}` : ""}`;
    return `<div class="fish-choice-row ${ctx.selectedFish === id ? "selected" : ""}"><a class="fish-portrait-link" href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(item.name)} — ${ctx.detailLabel}">${img ? `<img loading="lazy" src="${ctx.esc(img)}" alt="${ctx.esc(item.name)}">` : ""}</a><button class="fish-choice" type="button" data-fish="${id}" aria-pressed="${ctx.selectedFish === id}"><span>${ctx.esc(item.name)}<small>${ctx.esc(sub)}</small><small class="filter-action">${ctx.lang === "th" ? "เน้นบนแผนที่" : ctx.lang === "ja" ? "地図で絞り込む" : "Focus on map"}</small></span></button><a class="fish-details-link" href="${ctx.esc(ctx.fishHref(id))}">${ctx.detailLabel} ↗</a></div>`;
  }

  // src/pages/maps/map-render.js
  function renderSectionSelect(ctx) {
    const data = ctx.stages[ctx.activeStage];
    let sections = [...data?.sections.values() || []];
    if (ctx.selectedFish)
      sections = sections.filter(
        (section) => section.pins.some((pin) => pin.fishIds.includes(ctx.selectedFish))
      );
    sections.sort((a, b) => a.row - b.row || a.col - b.col);
    if (!sections.some((s) => s.key === ctx.activeSection))
      ctx.activeSection = ctx.chooseSection(ctx.activeStage);
    ctx.stageSelect.innerHTML = sections.map((section) => {
      const visible = section.pins.filter(
        (pin) => !ctx.selectedFish || pin.fishIds.includes(ctx.selectedFish)
      );
      const speciesCount = new Set(
        visible.flatMap((pin) => ctx.selectedFish ? [ctx.selectedFish] : pin.fishIds)
      ).size;
      const label = `${ctx.c.mapSection(section.col + 1, section.row + 1)} · ${ctx.c.point(visible.length)} · ${speciesCount} ${ctx.c.species}`;
      return `<option value="${section.key}" ${section.key === ctx.activeSection ? "selected" : ""}>${ctx.esc(label)}</option>`;
    }).join("");
    ctx.stageSelect.disabled = !sections.length;
    ctx.renderTargetSectionLinks(data, sections);
  }
  function renderTargetSectionLinks(ctx, data, targetSections) {
    const summary = ctx.$("target-section-summary"), shortcuts = ctx.$("other-sections");
    if (!ctx.selectedFish || !data) {
      summary.hidden = true;
      summary.textContent = "";
      shortcuts.hidden = true;
      shortcuts.innerHTML = "";
      return;
    }
    const total = [...data.pins.values()].filter(
      (pin) => pin.fishIds.includes(ctx.selectedFish)
    ).length;
    const sections = targetSections.map((section) => ({
      section,
      count: section.pins.filter((pin) => pin.fishIds.includes(ctx.selectedFish)).length
    })).filter((entry) => entry.count > 0);
    const current = sections.find((entry) => entry.section.key === ctx.activeSection)?.count || 0;
    const elsewhere = Math.max(0, total - current);
    summary.hidden = false;
    summary.textContent = ctx.lang === "th" ? `ส่วนนี้ ${current} จาก ${total} จุด · อีก ${elsewhere} จุดอยู่ในส่วนอื่น` : ctx.lang === "ja" ? `この範囲 ${current}/${total} 地点 · 他の範囲に ${elsewhere} 地点` : `This section: ${current} of ${total} points · ${elsewhere} elsewhere`;
    const other = sections.filter((entry) => entry.section.key !== ctx.activeSection);
    shortcuts.hidden = !other.length;
    shortcuts.innerHTML = other.map(
      ({ section, count }) => `<button type="button" data-other-section="${section.key}">${ctx.esc(ctx.c.mapSection(section.col + 1, section.row + 1))} · ${ctx.esc(ctx.c.point(count))}</button>`
    ).join("");
  }
  function setFish(ctx, id, { toggle = true } = {}) {
    if (!ctx.species[id]?.stages?.length) return;
    const next = toggle && ctx.selectedFish === id ? "" : id;
    const previousSection = ctx.activeSection;
    ctx.selectedFish = next;
    if (ctx.selectedFish && !ctx.fishInStage(ctx.selectedFish, ctx.activeStage))
      ctx.activeStage = ctx.species[ctx.selectedFish].stages[0] || ctx.activeStage;
    const targetInCurrentSection = ctx.selectedFish && ctx.stages[ctx.activeStage]?.sections.get(previousSection)?.pins.some((pin) => pin.fishIds.includes(ctx.selectedFish));
    ctx.activeSection = ctx.chooseSection(
      ctx.activeStage,
      ctx.selectedFish ? targetInCurrentSection ? previousSection : "" : previousSection
    );
    ctx.render();
  }
  function showPinDetails(ctx, ids, x, y) {
    const box = ctx.$("pin-details");
    const unique = [...new Set(ids)];
    box.hidden = false;
    box.innerHTML = `<span class="pin-details-label">X ${x}, Y ${y} · ${unique.length} ${ctx.c.species}</span>` + unique.map((id) => {
      const f = ctx.species[id], img = f.visual.image || "";
      return `<div class="pin-fish-row"><a class="pin-fish-details" href="${ctx.esc(ctx.fishHref(id))}">${img ? `<img src="${ctx.esc(img)}" alt="">` : ""}<span>${ctx.esc(f.name)} — ${ctx.detailLabel} ↗</span></a><button class="pin-fish-choice" type="button" data-fish="${id}">${ctx.lang === "th" ? "เน้นบนแผนที่" : ctx.lang === "ja" ? "地図で絞り込む" : "Focus on map"}</button></div>`;
    }).join("");
  }
  function renderMap(ctx) {
    const data = ctx.stages[ctx.activeStage], section = data?.sections.get(ctx.activeSection);
    const stageTitle = data ? `${ctx.c.area(data.stage)} · ${data.name}` : ctx.c.area(ctx.activeStage);
    ctx.$("map-title").textContent = stageTitle;
    if (!data || !section) {
      ctx.$("map-summary").textContent = "";
      ctx.$("pin-help").textContent = ctx.selectedFish ? ctx.c.noArea : ctx.c.noPoint;
      ctx.$("map-view").innerHTML = "";
      return;
    }
    const filtered = section.pins.map((pin) => ({
      ...pin,
      fishIds: ctx.selectedFish ? pin.fishIds.filter((id) => id === ctx.selectedFish) : pin.fishIds
    })).filter((pin) => pin.fishIds.length);
    const { sourceW, sourceH, originX, originY, scale, viewW, viewH } = ctx.mapGeometry(data, section);
    ctx.renderMapSummary(section, filtered);
    const pins = filtered.map((pin) => ctx.mapPinMarkup(pin, originX, originY, scale)).join("");
    ctx.$("map-view").style.width = `${viewW}px`;
    ctx.$("map-view").style.height = `${viewH}px`;
    ctx.$("map-view").innerHTML = `<img class="map-ground" src="${ctx.esc(data.fullImage)}" alt="${ctx.esc(`${stageTitle} · ${ctx.c.fullMap}`)}" style="width:${Math.round(sourceW * scale)}px;height:${Math.round(sourceH * scale)}px;left:${Math.round(-originX * scale)}px;top:${Math.round(-originY * scale)}px">${pins}`;
    ctx.$("pin-details").hidden = true;
    ctx.renderOverview(data, section);
    ctx.renderMapNavigation();
  }
  function mapPinMarkup(ctx, pin, originX, originY, scale) {
    const px = (pin.x * 16 + 8 - originX) * scale, py = (pin.y * 16 + 8 - originY) * scale;
    const names = pin.fishIds.map((id) => ctx.fishName(id)).join(", "), imgs = pin.fishIds.map((id) => ctx.species[id].visual.image).filter(Boolean);
    const tag = pin.fishIds.length === 1 ? "a" : "button";
    const action = tag === "a" ? `href="${ctx.esc(ctx.fishHref(pin.fishIds[0]))}"` : `type="button" data-pin="${pin.fishIds.join(",")}"`;
    return `<${tag} ${action} class="fish-pin ${ctx.selectedFish ? "focused" : ""}" style="left:${px}px;top:${py}px" data-x="${pin.x}" data-y="${pin.y}" title="${ctx.esc(names)} · X ${pin.x}, Y ${pin.y}" aria-label="${ctx.esc(names)} · X ${pin.x}, Y ${pin.y}">${imgs.slice(0, 2).map((src) => `<img loading="lazy" src="${ctx.esc(src)}" alt="">`).join(
      ""
    )}${pin.fishIds.length > 1 ? `<span class="cluster-count">${pin.fishIds.length}</span>` : ""}</${tag}>`;
  }
  function mapGeometry(ctx, data, section) {
    const sourceW = data.width, sourceH = data.height, originX = section.col * 384, originY = section.row * 384;
    const cellW = Math.max(1, Math.min(384, sourceW - originX)), cellH = Math.max(1, Math.min(384, sourceH - originY));
    const panelWidth = ctx.$("map-view").parentElement.clientWidth || window.innerWidth;
    const scale = Math.max(0.6, Math.min(2.2, (panelWidth - 4) / cellW, 620 / cellH)) * ctx.zoom;
    const viewW = Math.round(cellW * scale), viewH = Math.round(cellH * scale);
    return { sourceW, sourceH, originX, originY, scale, viewW, viewH };
  }
  function renderMapSummary(ctx, section, filtered) {
    const counts = new Set(filtered.flatMap((pin) => pin.fishIds)).size;
    ctx.$("map-summary").textContent = `${ctx.c.mapSection(section.col + 1, section.row + 1)} · ${ctx.c.point(filtered.length)} · ${counts} ${ctx.c.species}`;
    ctx.$("pin-help").textContent = ctx.selectedFish ? `${ctx.c.selectedTarget} ${ctx.fishName(ctx.selectedFish)}. ${ctx.c.point(filtered.length)}.` : `${ctx.c.noTarget} ${ctx.lang === "th" ? "กดรูปปลาเพื่อดูรายละเอียด หรือกดจุดซ้อนเพื่อเลือกชนิด" : ctx.lang === "ja" ? "魚画像は詳細へ。重なった地点は魚種を選択。" : "Fish portraits open details; shared points let you choose a species"}.`;
  }
  function renderMapNavigation(ctx) {
    ctx.$("zoom-fit").textContent = ctx.lang === "th" ? "พอดีจอ" : ctx.lang === "ja" ? "全体表示" : "Fit view";
    ctx.$("zoom-out").setAttribute(
      "aria-label",
      ctx.lang === "th" ? "ย่อแผนที่" : ctx.lang === "ja" ? "縮小" : "Zoom out"
    );
    ctx.$("zoom-in").setAttribute(
      "aria-label",
      ctx.lang === "th" ? "ขยายแผนที่" : ctx.lang === "ja" ? "拡大" : "Zoom in"
    );
    const shopNav = ctx.$("shop-browser-link");
    if (shopNav) {
      const q = new URLSearchParams({
        stage: String(ctx.activeStage),
        place: "area",
        return: ctx.sourceReturn()
      });
      if (ctx.selectedFish) q.set("fish", ctx.selectedFish);
      shopNav.href = `shops${ctx.lang === "en" ? "" : "." + ctx.lang}.html?${q}`;
    }
    const catalogue = ctx.$("catalogue-fish-link");
    catalogue.textContent = ctx.selectedFish ? ctx.c.tackle : ctx.lang === "th" ? "กลับไปเลือกอุปกรณ์ตกปลา ↗" : ctx.lang === "ja" ? "道具カタログへ ↗" : "Browse the equipment catalogue ↗";
    const query = new URLSearchParams({ return: ctx.sourceReturn() });
    if (ctx.selectedFish) {
      query.set("category", "all");
      query.set("fish", ctx.selectedFish);
      query.set("stage", String(ctx.activeStage));
    }
    const catalogueFile = ctx.lang === "th" ? "index.th.html" : ctx.lang === "ja" ? "index.ja.html" : "index.html";
    catalogue.href = `${catalogueFile}?${query}${ctx.selectedFish ? "#fish-location-panel" : "#catalogue"}`;
  }
  function renderOverview(ctx, data, section) {
    const overview = data.overview, box = ctx.$("area-overview");
    if (!overview?.image) {
      box.innerHTML = "";
      return;
    }
    const selectedSections = [...data.sections.values()].filter(
      (s) => !ctx.selectedFish || s.pins.some((p) => p.fishIds.includes(ctx.selectedFish))
    );
    function rect(s) {
      const x = s.col * 384, y = s.row * 384, w = Math.min(384, data.width - x), h = Math.min(384, data.height - y);
      return overview.rotated ? {
        x: y / data.height,
        y: (data.width - x - w) / data.width,
        w: h / data.height,
        h: w / data.width
      } : { x: x / data.width, y: y / data.height, w: w / data.width, h: h / data.height };
    }
    box.innerHTML = `<p>${ctx.lang === "th" ? "ภาพรวมด่าน · กดกรอบเพื่อเปลี่ยนส่วนซูม" : ctx.lang === "ja" ? "エリア全体 · 枠をクリックして拡大範囲を変更" : "Area overview · click a frame to change section"}${overview.rotated ? ctx.lang === "th" ? " · ด้านบนของฉากอยู่ทางซ้าย" : ctx.lang === "ja" ? " · 元の上方向は左" : " · original top is on the left" : ""}</p><div class="overview-canvas" style="aspect-ratio:${overview.width}/${overview.height};width:min(100%,${170 * overview.width / overview.height}px)"><img src="${ctx.esc(overview.image)}" alt="${ctx.esc(data.name)}">${selectedSections.map((s) => {
      const b = rect(s);
      return `<button type="button" data-section="${s.key}" aria-label="${ctx.esc(ctx.c.mapSection(s.col + 1, s.row + 1))}" aria-pressed="${s.key === section.key}" style="left:${b.x * 100}%;top:${b.y * 100}%;width:${b.w * 100}%;height:${b.h * 100}%"></button>`;
    }).join("")}</div>`;
  }
  function render(ctx) {
    if (!ctx.stages[ctx.activeStage])
      ctx.activeStage = Math.min(...Object.keys(ctx.stages).map(Number));
    if (ctx.selectedFish && !ctx.fishInStage(ctx.selectedFish, ctx.activeStage))
      ctx.activeStage = ctx.species[ctx.selectedFish]?.stages[0] || ctx.activeStage;
    if (!ctx.stages[ctx.activeStage]?.sections.has(ctx.activeSection))
      ctx.activeSection = ctx.chooseSection(ctx.activeStage);
    ctx.updateUrl();
    ctx.renderAreas();
    ctx.renderSectionSelect();
    ctx.renderFishList();
    ctx.renderMap();
    ctx.renderWaterKey();
    ctx.renderNotebookGuide();
  }
  function enableControls(ctx) {
    ctx.$("fish-search").disabled = false;
    ctx.$("clear-search").disabled = false;
    ctx.$("show-all").disabled = false;
  }
  function initFromUrl(ctx) {
    ctx.openNotebookGuide = location.hash === "#notebook-guide";
    const p = new URLSearchParams(location.search);
    if (p.get("scope") === "section") ctx.listScope = "section";
    const stage = Number(p.get("stage"));
    if (ctx.stages[stage]) ctx.activeStage = stage;
    const target = ctx.idNorm(p.get("fish") || "");
    if (ctx.species[target]) ctx.selectedFish = target;
    if (ctx.selectedFish && !ctx.fishInStage(ctx.selectedFish, ctx.activeStage))
      ctx.activeStage = ctx.species[ctx.selectedFish].stages[0] || ctx.activeStage;
    const section = p.get("section");
    ctx.activeSection = ctx.chooseSection(ctx.activeStage, section || "");
    if (ctx.selectedFish && !section) ctx.activeSection = ctx.chooseSection(ctx.activeStage, "");
  }

  // src/pages/maps/c_en.js
  var c_en = {
    area: (n) => `Area ${n}`,
    areas: "areas",
    areasPrefix: "Areas",
    fish: "fish",
    fishIn: "Fish in this area",
    searchResults: "Search results across all areas",
    showAll: "Show all fish",
    clearSearch: "Clear search",
    noFish: "No fish match this search.",
    noArea: "This fish has no configured point in this area. Choose one of its available areas.",
    noTarget: "No fish target selected. Map shows all species in this section.",
    selectedTarget: "Map shows only",
    section: "Section",
    spots: "configured points",
    species: "species",
    shared: "fish share this tile",
    targetAvailable: "target here",
    targetAbsent: "target absent",
    allArea: (n) => `${n} fish`,
    fullMap: "Area terrain from the ROM",
    tackle: "See this fish’s compatible tackle ↗",
    noPoint: "No configured points in this section.",
    mapSection: (col, row) => `Column ${col}, row ${row}`,
    fishName: (id) => `Fish ${id}`,
    point: (n) => `${n} unique point${n === 1 ? "" : "s"}`,
    notFound: "Not found in this area",
    romName: "ROM fish",
    back: "Equipment catalogue"
  };

  // src/pages/maps/c_th.js
  var c_th = {
    area: (n) => `ด่าน ${n}`,
    areas: "ด่าน",
    areasPrefix: "ด่าน",
    fish: "ชนิด",
    fishIn: "ปลาในด่านนี้",
    searchResults: "ผลค้นหาปลาจากทุกด่าน",
    showAll: "แสดงปลาทั้งหมด",
    clearSearch: "ล้างคำค้น",
    noFish: "ไม่พบปลาที่ตรงกับคำค้น",
    noArea: "ปลาเป้าหมายไม่มีจุดที่ตั้งไว้ในด่านนี้ เลือกด่านที่มีปลาได้",
    noTarget: "ยังไม่ได้เลือกปลา แผนที่แสดงปลาทุกชนิดในส่วนนี้",
    selectedTarget: "แผนที่แสดงเฉพาะ",
    section: "ส่วนแผนที่",
    spots: "จุดที่ตั้งไว้",
    species: "ชนิด",
    shared: "ปลาหลายชนิดใช้ช่องนี้ร่วมกัน",
    targetAvailable: "มีปลาเป้าหมาย",
    targetAbsent: "ไม่มีปลาเป้าหมาย",
    allArea: (n) => `ปลา ${n} ชนิด`,
    fullMap: "ภาพฉากจาก ROM",
    tackle: "ดูอุปกรณ์ที่ใช้กับปลานี้ ↗",
    noPoint: "ไม่มีจุดในส่วนแผนที่นี้",
    mapSection: (col, row) => `คอลัมน์ ${col} แถว ${row}`,
    fishName: (id) => `ปลา ${id}`,
    point: (n) => `${n} จุด`,
    notFound: "ไม่มีจุดในด่านนี้",
    romName: "ชื่อปลาใน ROM",
    back: "คู่มืออุปกรณ์"
  };

  // src/pages/maps/c_ja.js
  var c_ja = {
    area: (n) => `エリア${n}`,
    areas: "エリア",
    areasPrefix: "エリア",
    fish: "種",
    fishIn: "このエリアの魚",
    searchResults: "全エリアの検索結果",
    showAll: "魚をすべて表示",
    clearSearch: "検索をクリア",
    noFish: "一致する魚が見つかりません。",
    noArea: "この魚は選択中エリアに出現設定がありません。出現するエリアを選んでください。",
    noTarget: "魚を選択していません。この範囲の全魚種を表示します。",
    selectedTarget: "表示中:",
    section: "マップ範囲",
    spots: "設定地点",
    species: "魚種",
    shared: "魚が同じタイルを共有",
    targetAvailable: "対象あり",
    targetAbsent: "対象なし",
    allArea: (n) => `${n}種`,
    fullMap: "ROMから復元した地形",
    tackle: "この魚に使える道具を見る ↗",
    noPoint: "この範囲に設定地点はありません。",
    mapSection: (col, row) => `列${col}・行${row}`,
    fishName: (id) => `魚 ${id}`,
    point: (n) => `${n}地点`,
    notFound: "このエリアに地点なし",
    romName: "ROMの魚名",
    back: "道具カタログ"
  };

  // src/pages/maps/setup-context.js
  function setupContext(ctx) {
    ctx.lang = ["th", "ja"].includes(document.documentElement.dataset.locale) ? document.documentElement.dataset.locale : "en";
    ctx.c = { en: c_en, th: c_th, ja: c_ja }[ctx.lang];
    ctx.areaList = document.getElementById("area-list");
    ctx.fishList = document.getElementById("fish-list");
    ctx.stageSelect = document.getElementById("section-select");
    ctx.searchInput = document.getElementById("fish-search");
    ctx.suggestionList = document.getElementById("fish-suggestions");
    ctx.$ = (id) => document.getElementById(id);
    ctx.fishData = {};
    ctx.visuals = {};
    ctx.species = {};
    ctx.stages = {};
    ctx.selectedFish = "";
    ctx.activeStage = 1;
    ctx.activeSection = "";
    ctx.searchTerm = "";
    ctx.listScope = "area";
    ctx.zoom = 1;
    ctx.suggestionIds = [];
    ctx.activeSuggestion = -1;
    ctx.suggestionsDismissed = false;
    ctx.suggestionLimit = 10;
    ctx.esc = (value) => String(value ?? "").replace(
      /[&<>"']/g,
      (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
    );
    ctx.local = (obj) => obj?.[ctx.lang] || obj?.en || obj?.ja || obj?.th || "";
    ctx.idNorm = (id) => String(id).toUpperCase().replace(/^0X/, "").padStart(2, "0");
    ctx.fishName = (id) => ctx.species[id]?.name || ctx.c.fishName(id);
    ctx.detailLabel = ctx.lang === "th" ? "รายละเอียด" : ctx.lang === "ja" ? "詳細" : "Details";
    ctx.returnPath = ctx.safeReturn(new URLSearchParams(location.search).get("return") || "");
  }

  // src/pages/maps/bind-map-targets.js
  function bindMapTargets(ctx) {
    if (ctx.returnPath) {
      const back = document.createElement("a");
      back.className = "back-link";
      back.href = ctx.returnPath;
      back.textContent = ctx.lang === "th" ? "← กลับหน้าที่เปิดแผนที่" : ctx.lang === "ja" ? "← 前のページに戻る" : "← Back to the page that opened this map";
      document.querySelector(".hero-meta").prepend(back);
    }
    ctx.sourceReturn = () => location.pathname.split("/").pop() + location.search + (ctx.openNotebookGuide ? "#notebook-guide" : "");
    ctx.fishHref = (id) => `fish${ctx.lang === "en" ? "" : "." + ctx.lang}.html?id=${id}&stage=${ctx.activeStage}&return=${encodeURIComponent(ctx.sourceReturn())}`;
    ctx.areaList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-stage]");
      if (!button || button.disabled) return;
      ctx.activeStage = Number(button.dataset.stage);
      ctx.activeSection = ctx.chooseSection(ctx.activeStage);
      ctx.render();
    });
    ctx.fishList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-fish]");
      if (button) ctx.setFish(button.dataset.fish);
    });
    ctx.$("pin-details").addEventListener("click", (event) => {
      const button = event.target.closest("[data-fish]");
      if (button && button.dataset.fish !== ctx.selectedFish) ctx.setFish(button.dataset.fish);
    });
    ctx.$("map-view").addEventListener("click", (event) => {
      const pin = event.target.closest("[data-pin]");
      if (!pin) return;
      const ids = pin.dataset.pin.split(",");
      if (ids.length === 1 && ids[0] !== ctx.selectedFish) ctx.setFish(ids[0]);
      else ctx.showPinDetails(ids, pin.dataset.x, pin.dataset.y);
    });
  }

  // src/pages/maps/bind-map-controls.js
  function bindMapControls(ctx) {
    ctx.stageSelect.addEventListener("change", () => {
      ctx.activeSection = ctx.stageSelect.value;
      ctx.render();
    });
    ctx.$("other-sections").addEventListener("click", (event) => {
      const button = event.target.closest("[data-other-section]");
      if (button) {
        ctx.activeSection = button.dataset.otherSection;
        ctx.render();
      }
    });
    ctx.$("fish-scope").addEventListener("click", (event) => {
      const button = event.target.closest("[data-scope]");
      if (!button) return;
      ctx.listScope = button.dataset.scope;
      ctx.searchTerm = "";
      ctx.searchInput.value = "";
      ctx.render();
    });
    ctx.$("area-overview").addEventListener("click", (event) => {
      const button = event.target.closest("[data-section]");
      if (button) {
        ctx.activeSection = button.dataset.section;
        ctx.render();
      }
    });
    ctx.$("zoom-out").addEventListener("click", () => {
      ctx.zoom = Math.max(0.6, ctx.zoom / 1.3);
      ctx.renderMap();
    });
    ctx.$("zoom-in").addEventListener("click", () => {
      ctx.zoom = Math.min(3, ctx.zoom * 1.3);
      ctx.renderMap();
    });
    ctx.$("zoom-fit").addEventListener("click", () => {
      ctx.zoom = 1;
      ctx.renderMap();
    });
  }

  // src/pages/maps/bind-fish-search.js
  function bindFishSearch(ctx) {
    ctx.searchInput.addEventListener("input", () => {
      ctx.searchTerm = ctx.searchInput.value;
      ctx.suggestionsDismissed = false;
      ctx.renderFishList();
    });
    ctx.searchInput.addEventListener("focus", () => {
      ctx.suggestionsDismissed = false;
      ctx.renderSuggestions();
    });
    ctx.searchInput.addEventListener("blur", () => ctx.closeSuggestions(false));
    ctx.searchInput.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" && ctx.suggestionIds.length) {
        event.preventDefault();
        if (ctx.suggestionList.hidden) {
          ctx.suggestionsDismissed = false;
          ctx.renderSuggestions();
        }
        ctx.setActiveSuggestion(ctx.activeSuggestion < 0 ? 0 : ctx.activeSuggestion + 1);
      } else if (event.key === "ArrowUp" && ctx.suggestionIds.length) {
        event.preventDefault();
        if (ctx.suggestionList.hidden) {
          ctx.suggestionsDismissed = false;
          ctx.renderSuggestions();
        }
        ctx.setActiveSuggestion(
          ctx.activeSuggestion < 0 ? ctx.suggestionIds.length - 1 : ctx.activeSuggestion - 1
        );
      } else if (event.key === "Enter" && !ctx.suggestionList.hidden && ctx.suggestionIds.length) {
        event.preventDefault();
        ctx.chooseSuggestion(ctx.suggestionIds[ctx.activeSuggestion < 0 ? 0 : ctx.activeSuggestion]);
      } else if (event.key === "Escape" && !ctx.suggestionList.hidden) {
        event.preventDefault();
        ctx.closeSuggestions(true);
      }
    });
    ctx.suggestionList.addEventListener("pointerdown", (event) => {
      if (event.target.closest("[data-suggestion]")) event.preventDefault();
    });
  }

  // src/pages/maps/bind-search-actions.js
  function bindSearchActions(ctx) {
    ctx.suggestionList.addEventListener("click", (event) => {
      const option = event.target.closest("[data-suggestion]");
      if (option) ctx.chooseSuggestion(option.dataset.suggestion);
    });
    ctx.$("clear-search").addEventListener("click", () => {
      ctx.searchInput.value = "";
      ctx.searchTerm = "";
      ctx.selectedFish = "";
      ctx.closeSuggestions(true);
      ctx.render();
      ctx.searchInput.focus();
    });
    ctx.$("show-all").addEventListener("click", () => {
      ctx.selectedFish = "";
      ctx.searchInput.value = "";
      ctx.searchTerm = "";
      ctx.closeSuggestions(true);
      ctx.activeSection = ctx.chooseSection(ctx.activeStage);
      ctx.render();
    });
    window.addEventListener("resize", () => ctx.renderMap());
    ctx.loadingParams = new URLSearchParams(location.search);
    if (ctx.returnPath) ctx.loadingParams.set("return", ctx.returnPath);
    else ctx.loadingParams.delete("return");
    ctx.updateLanguageLinks(ctx.loadingParams);
    renderPendingNavigation(ctx);
  }
  function renderPendingNavigation(ctx) {
    const stage = Number(ctx.loadingParams.get("stage"));
    const rawFish = ctx.loadingParams.get("fish") || "";
    const selectedFish = /^(?:0x)?[0-9a-f]{1,2}$/i.test(rawFish) ? ctx.idNorm(rawFish) : "";
    renderMapNavigation({
      ...ctx,
      activeStage: Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 1,
      selectedFish
    });
  }

  // src/pages/maps/load-maps.js
  function loadMaps(ctx) {
    Promise.all([
      fetch("fish-locations.json").then((r) => {
        if (!r.ok) throw Error("fish locations");
        return r.json();
      }),
      fetch("gallery-data.json?v=compendium-20261005-15").then((r) => {
        if (!r.ok) throw Error("fish sprites");
        return r.json();
      })
    ]).then(([locations, gallery]) => {
      ctx.notebookCompletion = gallery.notebookCompletion;
      ctx.waterIcons = gallery.waterIcons;
      ctx.buildData(locations, gallery);
      ctx.initFromUrl();
      ctx.enableControls();
      ctx.render();
      if (ctx.openNotebookGuide) ctx.$("notebook-guide")?.scrollIntoView({ block: "start" });
    }).catch((error) => {
      console.error(error);
      ctx.$("pin-help").textContent = ctx.lang === "th" ? "โหลดข้อมูลปลาไม่สำเร็จ กรุณาโหลดหน้าใหม่" : ctx.lang === "ja" ? "魚データを読み込めません。ページを再読み込みしてください。" : "Could not load fish map data. Please reload the page.";
    });
  }

  // src/pages/maps/index.js
  function initialize(ctx) {
    setupContext(ctx);
    bindMapTargets(ctx);
    bindMapControls(ctx);
    bindFishSearch(ctx);
    bindSearchActions(ctx);
    loadMaps(ctx);
  }

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/app/maps.js
  var runtimeContext = createPageRuntime(maps_exports);
  initialize(runtimeContext);
})();
