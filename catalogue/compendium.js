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
      if (dest === 3 || dest === 5) return;
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
})();
