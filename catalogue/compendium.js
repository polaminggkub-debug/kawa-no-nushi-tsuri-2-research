(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/navigation/index.js
  var navigation_exports = {};
  __export(navigation_exports, {
    initialize: () => initialize,
    openAnchor: () => openAnchor,
    updateNavigation: () => updateNavigation
  });

  // src/pages/navigation/context-links.js
  function fishingRoute(current) {
    const category = current.searchParams.get("category");
    if (category === "lure") return "lure";
    if (["flymaker", "fly", "fly_wing", "fly_tail"].includes(category)) return "fly";
    return current.searchParams.get("route");
  }
  function equipmentCategory(url, current) {
    const category = current.searchParams.get("category");
    if (!category) return;
    if (["fly", "fly_wing", "fly_tail"].includes(category)) {
      url.searchParams.set("category", "flymaker");
      url.searchParams.set("part", category);
    } else {
      url.searchParams.set("category", category);
      if (category === "flymaker" && current.searchParams.has("part"))
        url.searchParams.set("part", current.searchParams.get("part"));
    }
  }
  function updateNavigation(_ctx) {
    const current = new URL(location.href), isFish = /\/fish(?:\.[a-z]+)?\.html$/.test(current.pathname);
    const activeRoute = document.querySelector('[data-route][aria-pressed="true"]');
    if (activeRoute) current.searchParams.set("route", activeRoute.dataset.route);
    const activeArea = document.querySelector('[data-location-stage][aria-pressed="true"]');
    if (activeArea) current.searchParams.set("stage", activeArea.dataset.locationStage);
    const fish = current.searchParams.get("fish") || (isFish ? current.searchParams.get("id") : "");
    const returnTo = current.pathname.split("/").pop() + current.search + current.hash;
    document.querySelectorAll("[data-compendium-destination]").forEach((link) => {
      link.dataset.baseHref = link.dataset.baseHref || link.getAttribute("href");
      const dest = Number(link.dataset.compendiumDestination), url = new URL(link.dataset.baseHref, location.href);
      if ([3, 5, 6, 7].includes(dest)) return;
      if (current.searchParams.has("stage"))
        url.searchParams.set("stage", current.searchParams.get("stage"));
      const route = fishingRoute(current);
      if (route) url.searchParams.set("route", route);
      if (fish) url.searchParams.set("fish", fish);
      if (dest === 0) equipmentCategory(url, current);
      if (dest === 1 && current.searchParams.has("map"))
        url.searchParams.set("map", current.searchParams.get("map"));
      if (!current.pathname.includes("/research/")) url.searchParams.set("return", returnTo);
      else if (dest === 4) url.searchParams.set("return", `../research/${returnTo}`);
      link.href = url.pathname + url.search + url.hash;
    });
  }
  function openAnchor(_ctx) {
    if (!location.hash) return;
    let target;
    try {
      target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch {
      return;
    }
    if (!target) return;
    for (let node = target; node; node = node.parentElement)
      if (node.tagName === "DETAILS") node.open = true;
  }

  // src/pages/navigation/bind-navigation.js
  function bindNavigation(ctx) {
    ctx.updateNavigation();
    document.querySelector(".compendium-nav")?.addEventListener("pointerover", ctx.updateNavigation);
    document.querySelector(".compendium-nav")?.addEventListener("focusin", ctx.updateNavigation);
    document.querySelector(".compendium-nav")?.addEventListener("click", ctx.updateNavigation);
    ctx.openAnchor();
    window.addEventListener("hashchange", ctx.openAnchor);
  }

  // src/pages/navigation/index.js
  function initialize(ctx) {
    bindNavigation(ctx);
  }

  // src/features/global-search/copy.js
  var copy = {
    th: {
      label: "ค้นหา",
      placeholder: "ค้นหาปลา ไอเท็ม หรือ ID เช่น 0B",
      clear: "ล้างคำค้น",
      all: "ทั้งหมด",
      fish: "ปลา",
      item: "ไอเท็ม",
      empty: "ไม่พบ ลองพิมพ์ชื่อให้สั้นลง หรือพิมพ์ ID สองหลัก เช่น 0B",
      near: "ใกล้เคียง · คุณหมายถึงอันนี้ไหม",
      count: (n) => `พบ ${n} รายการ`,
      failed: "โหลดรายการค้นหาไม่สำเร็จ",
      retry: "ลองอีกครั้ง",
      hint: "ชื่อไทย ญี่ปุ่น อังกฤษ หรือ ID"
    },
    en: {
      label: "Search",
      placeholder: "Search fish, items or ID, e.g. 0B",
      clear: "Clear search",
      all: "All",
      fish: "Fish",
      item: "Items",
      empty: "Nothing found. Try a shorter name, or a two-digit ID such as 0B.",
      near: "Close matches · did you mean",
      count: (n) => `${n} found`,
      failed: "Could not load the search list.",
      retry: "Try again",
      hint: "Thai, Japanese or English name, or ID"
    },
    ja: {
      label: "検索",
      placeholder: "魚・アイテム・IDを検索（例 0B）",
      clear: "検索をクリア",
      all: "すべて",
      fish: "魚",
      item: "アイテム",
      empty: "見つかりません。名前を短くするか、0Bのような2桁のIDを入力してください。",
      near: "近い候補 · もしかして",
      count: (n) => `${n}件`,
      failed: "検索リストを読み込めませんでした。",
      retry: "もう一度",
      hint: "日本語・タイ語・英語の名前、またはID"
    }
  };

  // src/features/global-search/match.js
  function fold(text) {
    return String(text ?? "").normalize("NFKC").toLowerCase().replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 96)).replace(/[\s\-_.,·・/()（）]+/g, "");
  }
  function distance(a, b, limit) {
    if (Math.abs(a.length - b.length) > limit) return limit + 1;
    let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let row = 1; row <= a.length; row += 1) {
      const current = [row];
      for (let col = 1; col <= b.length; col += 1)
        current[col] = Math.min(
          previous[col] + 1,
          current[col - 1] + 1,
          previous[col - 1] + (a[row - 1] === b[col - 1] ? 0 : 1)
        );
      previous = current;
    }
    return previous[b.length];
  }
  function score(entry, query, lang) {
    const id = fold(entry.id);
    if (id === query) return 100;
    const names = [entry.n[lang], entry.n.en, entry.n.ja, entry.n.th].map(fold);
    if (names.includes(query)) return 90;
    if (names.some((name) => name.startsWith(query))) return 70;
    if (fold(entry.a).includes(query)) return 50;
    return 0;
  }
  function nearMiss(entries, query, lang, taken) {
    if (query.length < 3) return [];
    const limit = query.length >= 6 ? 2 : 1;
    const found = [];
    for (const entry of entries) {
      if (taken.has(entry)) continue;
      const names = [entry.n[lang], entry.n.en, entry.n.ja, entry.n.th, ...entry.a.split(" ")];
      let best = limit + 1;
      for (const name of names) {
        const word = fold(name);
        if (!word) continue;
        const head = word.slice(0, query.length + limit);
        best = Math.min(best, distance(query, word, limit), distance(query, head, limit));
      }
      if (best <= limit) found.push({ entry, best });
    }
    return found.sort((a, b) => a.best - b.best).map((match) => match.entry);
  }
  function search(entries, rawQuery, lang, type) {
    const query = fold(rawQuery);
    if (!query) return { hits: [], near: [] };
    const pool = type === "all" ? entries : entries.filter((entry) => entry.k === type);
    const hits = pool.map((entry) => ({ entry, points: score(entry, query, lang) })).filter((match) => match.points).sort((a, b) => b.points - a.points || (a.entry.k === "fish" ? -1 : 1)).map((match) => match.entry);
    const near = hits.length < 4 ? nearMiss(pool, query, lang, new Set(hits)).slice(0, 4) : [];
    return { hits, near };
  }

  // src/features/global-search/memory.js
  var key = "kawa-search";
  function loadSearch() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(key) || "{}");
      return {
        query: typeof saved.query === "string" ? saved.query : "",
        type: ["fish", "item"].includes(saved.type) ? saved.type : "all"
      };
    } catch {
      return { query: "", type: "all" };
    }
  }
  function saveSearch(state) {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
    }
  }

  // src/features/global-search/view.js
  var esc = (text) => String(text ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
  function entryHref(entry, context) {
    const suffix = context.lang === "en" ? "" : `.${context.lang}`;
    const query = new URLSearchParams(
      entry.k === "fish" ? { id: entry.id } : { category: entry.c, id: entry.id }
    );
    if (context.returnTo) query.set("return", context.returnTo);
    return `${context.base}${entry.k === "fish" ? "fish" : "item"}${suffix}.html?${query}`;
  }
  function typeLabel(entry, lang) {
    const text = copy[lang];
    return entry.k === "fish" ? text.fish : `${text.item} · ${entry.t?.[lang] || entry.c}`;
  }
  function option(entry, index, context) {
    const image = entry.i ? `<img src="${esc(context.base + entry.i)}" alt="" width="40" height="40" loading="lazy">` : '<span class="gsearch-noimg" aria-hidden="true"></span>';
    return `<a class="gsearch-option" role="option" id="gsearch-opt-${index}" data-index="${index}" data-kind="${entry.k}" href="${esc(entryHref(entry, context))}">${image}<span class="gsearch-name">${esc(entry.n[context.lang])}<small>${esc(typeLabel(entry, context.lang))} · ID ${esc(entry.id)}</small></span></a>`;
  }
  function renderList(result, context, shown) {
    const text = copy[context.lang];
    if (!shown.length) return `<p class="gsearch-empty">${esc(text.empty)}</p>`;
    const hits = result.hits.slice(0, 8);
    const head = result.hits.length ? `<p class="gsearch-head">${esc(text.count(result.hits.length))}</p>` : "";
    const rows = hits.map((entry, index) => option(entry, index, context)).join("");
    const near = result.near.length ? `<p class="gsearch-head">${esc(text.near)}</p>${result.near.map((entry, index) => option(entry, hits.length + index, context)).join("")}` : "";
    return head + rows + near;
  }
  function mountMarkup(lang, state) {
    const text = copy[lang];
    const chip = (type) => `<button type="button" class="gsearch-type" data-type="${type}" aria-pressed="${state.type === type}">${esc(text[type])}</button>`;
    return `<form class="gsearch" role="search" id="gsearch" autocomplete="off">
    <div class="gsearch-row"><input id="gsearch-input" type="search" enterkeyhint="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="gsearch-list" aria-label="${esc(text.label)}" placeholder="${esc(text.placeholder)}" value="${esc(state.query)}"><button type="button" class="gsearch-clear" aria-label="${esc(text.clear)}" ${state.query ? "" : "hidden"}>×</button></div>
    <div class="gsearch-panel" hidden><div class="gsearch-types" role="group" aria-label="${esc(text.hint)}">${chip("all")}${chip("fish")}${chip("item")}</div><div id="gsearch-list" class="gsearch-list" role="listbox" aria-label="${esc(text.label)}"></div></div>
  </form>`;
  }

  // src/features/global-search/index.js
  function pageContext(nav2) {
    const lang = ["th", "ja"].includes(document.documentElement.lang.slice(0, 2)) ? document.documentElement.lang.slice(0, 2) : "en";
    const brand = nav2.querySelector(".compendium-brand");
    const base = new URL(".", new URL(brand?.getAttribute("href") || "index.html", location.href));
    const inCatalogue = !location.pathname.includes("/research/");
    const returnTo = inCatalogue ? location.pathname.split("/").pop() + location.search : "";
    return { lang, base: base.pathname, indexUrl: new URL("search-index.json", base).href, returnTo };
  }
  function mountGlobalSearch(nav2) {
    if (!nav2 || nav2.querySelector("#gsearch")) return;
    const context = pageContext(nav2);
    const state = loadSearch();
    nav2.insertAdjacentHTML("beforeend", mountMarkup(context.lang, state));
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "gsearch-toggle";
    toggle.setAttribute("aria-controls", "gsearch");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", copy[context.lang].label);
    toggle.textContent = "⌕";
    nav2.querySelector(".compendium-brand").after(toggle);
    const box = createBox(nav2.querySelector("#gsearch"), context, state);
    bindToggle(nav2, toggle, box);
    bindInput(box);
    bindControls(box, toggle);
    if (state.query) box.load().then(box.render);
  }
  function createBox(form, context, state) {
    const box = {
      form,
      context,
      state,
      entries: null,
      pending: null,
      active: -1,
      input: form.querySelector("#gsearch-input"),
      panel: form.querySelector(".gsearch-panel"),
      list: form.querySelector("#gsearch-list"),
      clear: form.querySelector(".gsearch-clear")
    };
    box.options = () => [...box.list.querySelectorAll(".gsearch-option")];
    box.open = (visible) => {
      box.panel.hidden = !visible;
      box.input.setAttribute("aria-expanded", String(visible));
    };
    box.setActive = (index) => setActive(box, index);
    box.render = () => render(box);
    box.load = () => load(box);
    return box;
  }
  function setActive(box, index) {
    const rows = box.options();
    box.active = rows.length ? (index + rows.length) % rows.length : -1;
    rows.forEach((row, at) => row.setAttribute("aria-selected", String(at === box.active)));
    if (box.active >= 0) {
      box.input.setAttribute("aria-activedescendant", rows[box.active].id);
      rows[box.active].scrollIntoView?.({ block: "nearest" });
    } else box.input.removeAttribute("aria-activedescendant");
  }
  function render(box) {
    const { state, context } = box;
    box.clear.hidden = !state.query;
    saveSearch(state);
    if (!state.query.trim()) return box.open(false);
    if (!box.entries) return;
    const result = search(box.entries, state.query, context.lang, state.type);
    box.list.innerHTML = renderList(result, context, [...result.hits, ...result.near]);
    box.open(true);
    box.setActive(result.hits.length || result.near.length ? 0 : -1);
  }
  function load(box) {
    const text = copy[box.context.lang];
    box.pending ||= fetch(box.context.indexUrl).then((response) => response.ok ? response.json() : Promise.reject(response.status)).then((data) => {
      box.entries = data.entries;
    }).catch(() => {
      box.pending = null;
      box.list.innerHTML = `<p class="gsearch-empty">${text.failed} <button type="button" class="gsearch-retry">${text.retry}</button></p>`;
      box.open(true);
    });
    return box.pending;
  }
  function bindToggle(nav2, toggle, box) {
    toggle.addEventListener("click", () => {
      const shown = nav2.classList.toggle("gsearch-open");
      toggle.setAttribute("aria-expanded", String(shown));
      if (shown) box.input.focus();
    });
  }
  function bindInput(box) {
    const { input, list } = box;
    input.addEventListener("focus", box.load);
    list.addEventListener("click", (event) => {
      if (event.target.closest(".gsearch-retry")) box.load().then(box.render);
    });
    input.addEventListener("input", () => {
      box.state.query = input.value;
      if (box.entries) box.render();
      else box.load().then(box.render);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") box.setActive(box.active + 1);
      else if (event.key === "ArrowUp") box.setActive(box.active - 1);
      else if (event.key === "Escape") box.open(false);
      else if (event.key === "Enter" && box.active >= 0)
        location.href = box.options()[box.active].href;
      else return;
      event.preventDefault();
    });
  }
  function bindControls(box, toggle) {
    const { form, state } = box;
    box.clear.addEventListener("click", () => {
      box.input.value = state.query = "";
      box.render();
      box.input.focus();
    });
    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("click", (event) => {
      const chip = event.target.closest(".gsearch-type");
      if (!chip) return;
      state.type = chip.dataset.type;
      form.querySelectorAll(".gsearch-type").forEach((node) => node.setAttribute("aria-pressed", String(node === chip)));
      box.render();
    });
    document.addEventListener("click", (event) => {
      if (!form.contains(event.target) && event.target !== toggle) box.open(false);
    });
  }

  // src/features/mobile-menu/index.js
  var label = { th: "เมนู", ja: "メニュー", en: "Menu" };
  function mountMobileMenu(nav2) {
    const links = nav2?.querySelector(".compendium-links");
    if (!links || nav2.querySelector(".menu-toggle")) return;
    const lang = document.documentElement.lang.slice(0, 2);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "menu-toggle";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "compendium-links");
    button.textContent = `☰ ${label[lang] || label.en}`;
    links.id ||= "compendium-links";
    nav2.querySelector(".compendium-brand").after(button);
    button.addEventListener("click", () => {
      const open = nav2.classList.toggle("menu-open");
      button.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", () => nav2.classList.remove("menu-open"));
  }

  // src/features/quiet-repeats/index.js
  var SELECTOR = "main p, main li, main small";
  var MIN_LENGTH = 40;
  function markRepeats(root) {
    const seen = /* @__PURE__ */ new Set();
    for (const node of root.querySelectorAll(SELECTOR)) {
      if (node.children.length || node.closest(".cards")) continue;
      const text = node.textContent.replace(/\s+/g, " ").trim();
      if (text.length < MIN_LENGTH) continue;
      if (seen.has(text)) node.dataset.repeat = "true";
      else seen.add(text);
    }
  }
  function quietRepeats(main) {
    if (!main || typeof MutationObserver === "undefined") return;
    let timer = 0;
    const run = () => {
      timer = 0;
      markRepeats(main);
    };
    new MutationObserver(() => {
      if (!timer) timer = setTimeout(run, 150);
    }).observe(main, { childList: true, subtree: true });
    run();
  }

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/app/navigation.js
  var runtimeContext = createPageRuntime(navigation_exports);
  initialize(runtimeContext);
  var nav = document.querySelector(".compendium-nav");
  mountMobileMenu(nav);
  mountGlobalSearch(nav);
  quietRepeats(document.querySelector("main"));
})();
