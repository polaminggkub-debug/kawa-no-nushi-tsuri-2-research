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

  // src/pages/strategy/setup-search.js
  function setupSearch(ctx) {
    ctx.filter = document.getElementById("filter");
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
    if (typeof location !== "undefined" && location.hash === "#technical-evidence")
      document.getElementById("technical-evidence").open = true;
    document.getElementById("strategy-topics")?.addEventListener("click", (event) => {
      if (event.target.closest("a")?.getAttribute("href") === "#technical-evidence")
        document.getElementById("technical-evidence").open = true;
    });
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
