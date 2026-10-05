(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/strategy/index.js
  var strategy_exports = {};
  __export(strategy_exports, {
    initialize: () => initialize
  });

  // src/pages/strategy/search-return.js
  function restoreSearchQuery(filter) {
    if (typeof location === "undefined") return;
    filter.value = new URLSearchParams(location.search).get("q") || "";
  }
  function persistSearchQuery(query) {
    if (typeof location === "undefined" || typeof history === "undefined") return;
    const target = new URL(location.href);
    target.searchParams.delete("q");
    if (query) {
      target.searchParams.set("q", query);
      target.hash = "technical-evidence";
    }
    if (target.href !== location.href) history.replaceState(null, "", target.href);
  }
  function refreshFishReturns(rows, query) {
    if (typeof location === "undefined") return;
    const returned = new URL(location.href);
    returned.searchParams.delete("q");
    if (query) returned.searchParams.set("q", query);
    returned.hash = "technical-evidence";
    const file = returned.pathname.split("/").pop();
    const route = `../research/${file}${returned.search}${returned.hash}`;
    for (const row of rows) {
      const link = row.querySelector('a[href*="id="]');
      if (!link) continue;
      const target = new URL(link.href, location.href);
      target.searchParams.set("return", route);
      link.href = target.href;
    }
  }
  function preserveResearchLanguageState(event) {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const query = document.getElementById("filter")?.value || "";
    const target = new URL(link.href, location.href);
    target.searchParams.delete("q");
    if (query) target.searchParams.set("q", query);
    target.hash = location.hash || (query ? "#technical-evidence" : "");
    link.href = target.href;
  }

  // src/pages/strategy/setup-search.js
  function setupSearch(ctx) {
    ctx.filter = document.getElementById("filter");
    restoreSearchQuery(ctx.filter);
    ctx.resultCount = document.getElementById("filter-count");
    ctx.rows = Array.from(document.querySelectorAll("#fish-matrix tbody tr"));
    ctx.copy = {
      en: {
        count: (shown, total) => `Showing ${shown} of ${total} fish profiles.`,
        aliasFailure: "Lookup aliases could not be loaded. Search by the Japanese ROM name or profile ID instead."
      },
      ja: {
        count: (shown, total) => `魚プロフィール ${shown} / ${total} 件を表示。`,
        aliasFailure: "検索用のローマ字・タイ語名を読み込めませんでした。ROMの日本語名またはプロフィールIDで検索できます。"
      },
      th: {
        count: (shown, total) => `แสดง ${shown} จาก ${total} โปรไฟล์ปลา`,
        aliasFailure: "โหลดคำช่วยค้นหาไม่สำเร็จ ยังค้นด้วยชื่อญี่ปุ่นจาก ROM หรือ ID โปรไฟล์ได้"
      }
    }[document.documentElement.lang] || {
      count: (shown, total) => `${shown} / ${total}`,
      aliasFailure: "Lookup aliases could not be loaded. Search by the Japanese ROM name or profile ID instead."
    };
    ctx.aliasWarning = document.getElementById("alias-warning");
    ctx.normalize = (value) => value.normalize("NFKC").trim().toLocaleLowerCase();
    ctx.aliases = /* @__PURE__ */ new Map();
    ctx.applyFilter = () => {
      const query = ctx.normalize(ctx.filter.value);
      let shown = 0;
      for (const row of ctx.rows) {
        const id = row.querySelector('a[href*="id="]')?.href.match(/[?&]id=([^&]+)/)?.[1] || "";
        const searchable = ctx.normalize(`${row.textContent} ${ctx.aliases.get(id) || ""}`);
        const matches = !query || searchable.includes(query);
        row.hidden = !matches;
        if (matches) shown++;
      }
      ctx.resultCount.textContent = ctx.copy.count(shown, ctx.rows.length);
      persistSearchQuery(ctx.filter.value);
      refreshFishReturns(ctx.rows, ctx.filter.value);
    };
    ctx.filter.addEventListener("input", ctx.applyFilter);
  }

  // src/pages/strategy/load-fish-aliases.js
  function loadFishAliases(ctx) {
    ctx.applyFilter();
    fetch("../catalogue/fish-visuals.json").then((response) => {
      if (!response.ok) throw new Error("Fish names unavailable");
      return response.json();
    }).then((data) => {
      for (const [id, fish] of Object.entries(data.fish || {})) {
        ctx.aliases.set(
          id,
          [
            fish.nameEn,
            fish.nameLatin,
            ...fish.nameLatinVariants || [],
            fish.nameTh,
            ...fish.nameThVariants || [],
            fish.nameJa
          ].filter(Boolean).join(" ")
        );
      }
      ctx.applyFilter();
    }).catch(() => {
      ctx.aliasWarning.hidden = false;
      ctx.aliasWarning.textContent = ctx.copy.aliasFailure;
    });
  }

  // src/pages/strategy/topic-navigation.js
  function setupTopicNavigation() {
    if (typeof location !== "undefined" && (location.hash === "#technical-evidence" || new URLSearchParams(location.search).get("q")))
      document.getElementById("technical-evidence").open = true;
    document.getElementById("strategy-topics")?.addEventListener("click", (event) => {
      if (event.target.closest("a")?.getAttribute("href") === "#technical-evidence")
        document.getElementById("technical-evidence").open = true;
    });
    document.querySelector(".strategy-languages")?.addEventListener("click", preserveResearchLanguageState);
  }

  // src/pages/strategy/index.js
  function initialize(ctx) {
    setupSearch(ctx);
    setupTopicNavigation();
    loadFishAliases(ctx);
  }

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/app/strategy.js
  var runtimeContext = createPageRuntime(strategy_exports);
  initialize(runtimeContext);
})();
