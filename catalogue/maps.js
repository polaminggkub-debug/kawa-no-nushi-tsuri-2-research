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
    bindWaterMarkFilter: () => bindWaterMarkFilter,
    buildData: () => buildData,
    chooseSection: () => chooseSection,
    chooseSuggestion: () => chooseSuggestion,
    closeSuggestions: () => closeSuggestions,
    enableControls: () => enableControls,
    fishChoice: () => fishChoice,
    fishInStage: () => fishInStage,
    fishMatchesWaterMark: () => fishMatchesWaterMark,
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
    updateUrl: () => updateUrl,
    visibleMapFishIds: () => visibleMapFishIds,
    waterMarkAreaText: () => waterMarkAreaText,
    waterMarkEmptyText: () => waterMarkEmptyText,
    waterMarkFishHeading: () => waterMarkFishHeading,
    waterMarkFishIds: () => waterMarkFishIds,
    waterMarkPinHelp: () => waterMarkPinHelp
  });

  // src/pages/maps/notebook-progress.js
  var storageKey = "kawa-notebook-manual-v1";
  var text = {
    en: {
      title: "Your checklist",
      count: (n, total) => `Marked by you: ${n}/${total} species`,
      note: "Tick only after checking the fish in your game journal. Saved in this browser; this does not read or change your game save. The same fish shares one tick across all areas.",
      mark: "Checked in my game journal",
      temporary: "Browser storage is unavailable. Ticks last only while this page stays open.",
      remaining: "Show only unmarked fish",
      empty: "You have marked every fish in this list. Uncheck the filter to review them."
    },
    ja: {
      title: "自分のチェックリスト",
      count: (n, total) => `自分で確認済み: ${n}/${total}種`,
      note: "ゲーム内図鑑を確認してからチェックしてください。このブラウザに保存され、ゲームのセーブは読み書きしません。同じ魚のチェックは全エリアで共通です。",
      mark: "ゲーム内図鑑で確認済み",
      temporary: "ブラウザに保存できません。このページを閉じるとチェックは失われます。",
      remaining: "未チェックの魚だけ表示",
      empty: "このリストはすべてチェック済みです。フィルターを外すと再確認できます。"
    },
    th: {
      title: "รายการที่คุณเช็กเอง",
      count: (n, total) => `คุณติ๊กแล้ว ${n}/${total} ชนิด`,
      note: "ติ๊กหลังเช็กว่าปลาอยู่ในสมุดเกมแล้ว จำไว้เฉพาะเบราว์เซอร์นี้ ไม่ได้อ่านหรือแก้เซฟเกม ปลาชนิดเดียวกันใช้เครื่องหมายเดียวกันทุกด่าน",
      mark: "เช็กแล้วว่ามีในสมุดเกม",
      temporary: "เบราว์เซอร์ไม่อนุญาตให้บันทึก เครื่องหมายจะอยู่แค่ขณะที่เปิดหน้านี้",
      remaining: "แสดงเฉพาะปลาที่ยังไม่ได้ติ๊ก",
      empty: "ติ๊กครบทุกปลาในรายการนี้แล้ว เอาตัวกรองออกเพื่อดูรายการอีกครั้ง"
    }
  };
  var memory = [];
  var onlyRemaining = false;
  function normalizeMarks(value, eligible) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((id) => typeof id === "string" && eligible.has(id)))];
  }
  function eligibleNotebookIds(guide) {
    return new Set(
      Object.entries(guide.species).filter(([, entry]) => entry.notebookEligible === true).map(([id]) => id)
    );
  }
  function readNotebookMarks(storage, eligible) {
    try {
      const parsed = JSON.parse(storage.getItem(storageKey) || "[]");
      memory = normalizeMarks(parsed, eligible);
      return { ids: memory, persistent: true };
    } catch {
      memory = normalizeMarks(memory, eligible);
      return { ids: memory, persistent: false };
    }
  }
  function writeNotebookMarks(storage, ids, eligible) {
    memory = normalizeMarks(ids, eligible);
    try {
      storage.setItem(storageKey, JSON.stringify(memory));
      return true;
    } catch {
      return false;
    }
  }
  function progressMarkup(ctx) {
    const c = text[ctx.lang] || text.en;
    return `<section class="notebook-manual"><h4>${ctx.esc(c.title)}</h4><p class="notebook-manual-count" role="status" aria-live="polite"></p><p>${ctx.esc(c.note)}</p><label class="notebook-remaining"><input type="checkbox" data-notebook-remaining> ${ctx.esc(c.remaining)}</label></section>`;
  }
  function storageAccess() {
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }
  function addCheckbox(ctx, card, id, c) {
    const label = document.createElement("label");
    label.className = "notebook-mark";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.dataset.notebookMark = id;
    input.setAttribute("aria-label", `${c.mark}: ${ctx.species[id].name}`);
    label.append(input, document.createTextNode(` ${c.mark}`));
    card.append(label);
  }
  function updateProgress(mount, eligible, ids, c, persistent) {
    mount.querySelector(".notebook-manual-count").textContent = c.count(ids.length, eligible.size);
    mount.querySelectorAll("[data-notebook-mark]").forEach((input) => {
      input.checked = ids.includes(input.dataset.notebookMark);
      const card = input.closest("[data-notebook-card]");
      card.classList.toggle("notebook-marked", input.checked);
      card.hidden = onlyRemaining && input.checked;
    });
    mount.querySelector("[data-notebook-remaining]").checked = onlyRemaining;
    mount.querySelector(".notebook-excluded")?.toggleAttribute("hidden", onlyRemaining);
    mount.querySelector(".notebook-manual-warning").textContent = persistent ? "" : c.temporary;
    mount.querySelectorAll(".notebook-fish-list").forEach((list) => {
      const eligibleCards = [...list.querySelectorAll("[data-notebook-mark]")];
      const empty = list.nextElementSibling;
      if (empty?.classList.contains("notebook-list-complete"))
        empty.hidden = !eligibleCards.length || eligibleCards.some((input) => !input.checked) || !onlyRemaining;
    });
  }
  function addListMessages(mount, c) {
    mount.querySelectorAll(".notebook-fish-list").forEach((list) => {
      if (!list.querySelector("[data-notebook-mark]")) return;
      const message = document.createElement("p");
      message.className = "notebook-list-complete";
      message.textContent = c.empty;
      message.hidden = true;
      list.after(message);
    });
  }
  function bindNotebookProgress(ctx, mount) {
    if (!ctx.notebookCompletion?.species || !mount.querySelector(".notebook-manual")) return;
    const c = text[ctx.lang] || text.en;
    const eligible = eligibleNotebookIds(ctx.notebookCompletion);
    const storage = storageAccess();
    const state = readNotebookMarks(storage, eligible);
    mount.querySelectorAll("[data-notebook-card]").forEach((card) => {
      const id = card.dataset.notebookCard;
      if (eligible.has(id)) addCheckbox(ctx, card, id, c);
    });
    const warning = document.createElement("p");
    warning.className = "notebook-manual-warning";
    mount.querySelector(".notebook-manual").append(warning);
    addListMessages(mount, c);
    updateProgress(mount, eligible, state.ids, c, state.persistent);
    mount.onchange = (event) => {
      const input = event.target;
      if (input.matches("[data-notebook-remaining]")) onlyRemaining = input.checked;
      else if (input.matches("[data-notebook-mark]")) {
        const id = input.dataset.notebookMark;
        state.ids = readNotebookMarks(storage, eligible).ids;
        state.ids = input.checked ? [.../* @__PURE__ */ new Set([...state.ids, id])] : state.ids.filter((entry) => entry !== id);
        state.persistent = writeNotebookMarks(storage, state.ids, eligible);
      } else return;
      updateProgress(mount, eligible, state.ids, c, state.persistent);
    };
  }

  // src/pages/maps/notebook-guide.js
  var copy = {
    en: {
      title: "Fish journal · route checklist",
      fullRoute: (count) => `Collect all ${count} species · one entry per fish`,
      fullRouteNote: "Use this route when collecting the whole journal. Each species appears once, in its first numbered area. Open a group, choose a fish, and follow its map or compatible gear. This is a suggested route, not a required count for each game page. Your ticks are shared with the area lists.",
      routeGroup: (stage, count) => `Area ${stage} · ${count} new species`,
      recordableLabel: (stage) => `species available in Area ${stage} · not a required page total`,
      newCount: (count) => `New on the full route: ${count}`,
      repeatedCount: (count) => `Also occur earlier: ${count}`,
      progress: (stage, count, total) => `Route plan through Area ${stage}: ${count}/${total} unique species · not your save`,
      areaCountsTitle: "Map species with journal slots available by area · some occur in multiple areas",
      areaCount: (stage, count) => `Area ${stage}: ${count} available here`,
      newTitle: (count) => `Show the ${count} new species to catch here`,
      repeated: (count) => `Also found in an earlier area · ${count}`,
      repeatedNote: "These species already have one journal slot. An equal or smaller size leaves the record unchanged; when the game records a larger size here, the existing entry moves to this area.",
      excluded: (count) => `On this map, not in the 66-species journal · ${count}`,
      excludedNote: "These fish appear on the map but have no species entry in the journal.",
      details: "Fish details",
      mapAction: "Map points",
      equipmentAction: "Compatible gear",
      actionsFor: (name) => `Next actions for ${name}`,
      id: "ID",
      countNoteTitle: "Why the count in your game journal can differ",
      countNote: (stage, total, added, repeated) => `Available here: ${total} = ${added} first on the route + ${repeated} also found earlier. The game counts species whose largest-size record is assigned to this area. There is no fixed target for each page. Add the six game-page counts to check progress out of 66. Check both fish lists and the other game pages before pursuing a missing species.`,
      triggerLimit: "Controller-only replay confirmed an Area 1 Yamame landing: after the landing message progressed, its notebook size/area changed from 0/0 to 23/1. This confirms one landed-catch path; it does not establish every failure or species outcome.",
      evidence: "ROM evidence and method",
      evidenceLink: "Read the notebook record research",
      spawnNote: "These are the game’s configured area candidates. If a point has no fish in your current run, open the map to check whether this species has other recorded points.",
      verifyTitle: "After fishing: check the game journal before ticking this list",
      verifyBody: "Land the fish and finish the landing messages, then open Tool 05 (Fishing Notebook) and compare the fish’s name across all six pages. Page totals can move when a larger-size record moves to another area. Seeing a fish bite alone does not confirm that the journal recorded it.",
      verifyLink: "View Tool 05 details · Fishing Notebook",
      empty: "No new species are listed for this area in the route."
    },
    ja: {
      title: "魚図鑑 · 全66種ルートチェック",
      fullRoute: (count) => `全${count}種を集める · 魚ごとに1項目`,
      fullRouteNote: "図鑑全体を埋めるためのルートです。各魚は最初の番号エリアに一度だけ掲載します。エリアを開き、魚を選んで釣り場や対応する道具へ進めます。各ページに必要な数ではありません。チェックはエリア別一覧と共通です。",
      routeGroup: (stage, count) => `エリア${stage} · 初登場${count}種`,
      recordableLabel: (stage) => `エリア${stage}の図鑑対象種 · ページの必要数ではありません`,
      newCount: (count) => `全エリアルートで初登場: ${count}種`,
      repeatedCount: (count) => `前のエリアにも出現: ${count}種`,
      progress: (stage, count, total) => `エリア${stage}までのルート計画: ${count}/${total}種 · セーブデータの進行状況ではありません`,
      areaCountsTitle: "エリア別・出現地点のある図鑑対象種 · 複数エリアに出現する魚もいます",
      areaCount: (stage, count) => `エリア${stage}: ${count}種が出現可能`,
      newTitle: (count) => `このエリアで釣る新しい魚 ${count}種を見る`,
      repeated: (count) => `前のエリアにも登場 · ${count}種`,
      repeatedNote: "この魚種の図鑑枠は1つです。同じか小さいサイズでは記録は変わらず、別エリアでより大きいサイズが記録されると、このエリアへ移ります。",
      excluded: (count) => `マップにはいるが図鑑66種には含まれない · ${count}種`,
      excludedNote: "マップ上にはいますが、図鑑に魚種の記録枠はありません。",
      details: "魚の詳細",
      mapAction: "地図の釣り場",
      equipmentAction: "使える道具",
      actionsFor: (name) => `${name}の次の操作`,
      id: "ID",
      countNoteTitle: "ゲーム内図鑑の数と異なる理由",
      countNote: (stage, total, added, repeated) => `このエリアの対象種: ${total} = ルート初登場${added} + 前エリアにも出現${repeated}。ゲーム内の数は、最大サイズの記録がこのエリアにある魚種数です。各ページに固定の目標数はありません。6ページの数を合計して全66種の進行を確認し、未記録の魚を探す前に下の両一覧と他のページを確認してください。`,
      triggerLimit: "通常のコントローラー操作でエリア1のヤマメを取り込み、取り込みメッセージを進めた後に図鑑のサイズ・エリアが0/0から23/1へ変化しました。取り込みによる更新例であり、全魚種・失敗時の挙動を証明するものではありません。",
      evidence: "ROMの根拠と調査方法",
      evidenceLink: "魚図鑑の記録に関する調査を読む",
      spawnNote: "ゲームの設定上、このエリアに出現する魚です。現在のプレイで地点に魚がいないときは、地図を開いて同種の別地点があるか確認してください。",
      verifyTitle: "釣りのあと、ゲーム内の図鑑を確認してからチェック",
      verifyBody: "魚を取り込み、取り込みメッセージを進めてから道具05「釣りノート」を開き、魚名を6ページすべて確認してください。最大サイズの記録が別エリアに移るとページ別の数も変わります。魚が食いついただけでは、図鑑への記録を確認できません。",
      verifyLink: "道具05の詳細 · 釣りノート",
      empty: "このエリアにルート上の新しい魚種はありません。"
    },
    th: {
      title: "สมุดปลา · เส้นทางเก็บครบ 66 ชนิด",
      fullRoute: (count) => `เก็บให้ครบ ${count} ชนิด · ไม่ซ้ำ`,
      fullRouteNote: "ใช้รายการนี้เมื่ออยากเก็บสมุดทั้งหมด ปลาแต่ละชนิดอยู่ในด่านแรกที่พบเพียงครั้งเดียว เปิดกลุ่มด่าน เลือกปลา แล้วกดดูจุดตกหรืออุปกรณ์ที่ใช้ได้ นี่เป็นเส้นทางแนะนำ ไม่ใช่ยอดที่หน้าสมุดเกมต้องมี เครื่องหมายที่ติ๊กใช้ร่วมกับรายการรายด่าน",
      routeGroup: (stage, count) => `ด่าน ${stage} · ปลาใหม่ ${count} ชนิด`,
      recordableLabel: (stage) => `ชนิดที่ลงสมุดได้และพบในด่าน ${stage} · ไม่ใช่ยอดที่หน้าสมุดต้องมี`,
      newCount: (count) => `ปลาใหม่ในเส้นทางครบทุกด่าน: ${count} ชนิด`,
      repeatedCount: (count) => `พบได้ในด่านก่อนด้วย: ${count} ชนิด`,
      progress: (stage, count, total) => `แผนเก็บปลาไม่ซ้ำถึงด่าน ${stage}: ${count}/${total} ชนิด · ไม่ใช่ความคืบหน้าในเซฟ`,
      areaCountsTitle: "ชนิดปลาที่มีช่องในสมุดและมีจุดตก แยกตามด่าน · บางชนิดพบได้หลายด่าน",
      areaCount: (stage, count) => `ด่าน ${stage}: มีจุดตกที่บันทึกได้ ${count} ชนิด`,
      newTitle: (count) => `ดูรายชื่อปลาใหม่ ${count} ชนิดที่ควรเก็บในด่านนี้`,
      repeated: (count) => `พบในด่านก่อนหน้าด้วย · ${count} ชนิด`,
      repeatedNote: "ปลากลุ่มนี้ใช้ช่องสมุดเดิม ขนาดเท่าหรือเล็กกว่าสถิติเดิมจะไม่เปลี่ยนรายการ เมื่อเกมบันทึกขนาดที่ใหญ่กว่าในด่านนี้ ช่องเดิมจะย้ายมาด่านนี้",
      excluded: (count) => `มีบนแผนที่ แต่ไม่มีช่องในสมุด 66 ชนิด · ${count} ชนิด`,
      excludedNote: "ปลากลุ่มนี้ปรากฏบนแผนที่ แต่ไม่มีรายการชนิดปลาในสมุด",
      details: "ดูข้อมูลปลา",
      mapAction: "ดูจุดตกบนแผนที่",
      equipmentAction: "ดูอุปกรณ์ที่ใช้ได้",
      actionsFor: (name) => `เลือกทำต่อสำหรับ${name}`,
      id: "ID",
      countNoteTitle: "ทำไมเลขในสมุดเกมถึงไม่เท่ากับจำนวนในไกด์",
      countNote: (stage, total, added, repeated) => `ด่านนี้มี ${total} ชนิด = ปลาใหม่ตามเส้นทาง ${added} + พบในด่านก่อนด้วย ${repeated} เกมนับชนิดปลาที่สถิติขนาดใหญ่สุดอยู่ในด่านนี้ แต่ละหน้าจึงไม่มียอดเป้าหมายตายตัว บวกเลขทั้ง 6 หน้าในเกมเพื่อเช็กว่าครบ 66 หรือยัง ก่อนตามหาปลาเพิ่ม ให้เทียบชื่อจากทั้งสองรายการด้านล่างกับทุกหน้าในสมุด`,
      triggerLimit: "เล่นด้วยปุ่มควบคุมตามปกติแล้วตกยามาเมะในด่าน 1 ขึ้นได้ หลังผ่านข้อความตกสำเร็จ ค่าขนาด/ด่านในสมุดเปลี่ยนจาก 0/0 เป็น 23/1 ยืนยันทางบันทึกจากการตกขึ้นหนึ่งกรณี ยังไม่ได้พิสูจน์ผลของทุกชนิดปลาหรือทุกกรณีที่ตกไม่สำเร็จ",
      evidence: "หลักฐาน ROM และวิธีตรวจสอบ",
      evidenceLink: "อ่านบันทึกการแกะระบบสมุดปลา",
      spawnNote: "รายการนี้คือปลาที่เกมตั้งไว้ในด่าน บางจุดอาจไม่มีปลาในรอบที่เล่น ถ้าจุดที่ไปไม่มีปลา ให้เปิดแผนที่ตรวจว่าปลาชนิดนั้นมีจุดอื่นหรือไม่",
      verifyTitle: "หลังตกปลา ให้เช็กสมุดเกมก่อนติ๊กเช็กลิสต์นี้",
      verifyBody: "ตกปลาขึ้นและผ่านข้อความตกสำเร็จให้จบ แล้วเปิดไอเท็ม 05 “สมุดบันทึกการตกปลา” เทียบชื่อปลาทั้ง 6 หน้า จำนวนในแต่ละหน้าเปลี่ยนได้เมื่อสถิติขนาดใหญ่สุดย้ายไปอีกด่าน การเห็นปลากัดเบ็ดอย่างเดียวยังยืนยันไม่ได้ว่าสมุดบันทึกปลาแล้ว",
      verifyLink: "ดูรายละเอียดไอเท็ม 05 · สมุดบันทึกการตกปลา",
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
  function notebookReturn(ctx) {
    const anchor = ctx.notebookFullRoute ? `notebook-route-${ctx.activeStage}` : "notebook-guide";
    return `${ctx.sourceReturn().split("#")[0]}#${anchor}`;
  }
  function localizedPage(ctx, page) {
    const suffix = ctx.lang === "en" ? "" : `.${ctx.lang}`;
    return `${page}${suffix}.html`;
  }
  function notebookItemLink(ctx) {
    const query = new URLSearchParams({
      category: "general_tool",
      id: "05",
      stage: String(ctx.activeStage),
      return: notebookReturn(ctx)
    });
    return `${localizedPage(ctx, "item")}?${query}`;
  }
  function notebookVerificationMarkup(ctx, copyText) {
    return `<section class="notebook-verification" data-notebook-verification><h4>${ctx.esc(copyText.verifyTitle)}</h4><p>${ctx.esc(copyText.verifyBody)}</p><a data-notebook-open href="${ctx.esc(notebookItemLink(ctx))}">${ctx.esc(copyText.verifyLink)} ↗</a></section>`;
  }
  function fishActionLinks(ctx, id, returnPath) {
    const stage = String(ctx.activeStage);
    const fishQuery = new URLSearchParams({
      id,
      stage,
      return: returnPath
    });
    const detailHref = `${localizedPage(ctx, "fish")}?${fishQuery}`;
    const mapQuery = new URLSearchParams({
      stage,
      fish: id,
      return: returnPath
    });
    const mapHref = `${localizedPage(ctx, "maps")}?${mapQuery}#map-view`;
    const equipmentQuery = new URLSearchParams({
      category: "all",
      fish: id,
      stage,
      return: returnPath
    });
    const equipmentHref = `${localizedPage(ctx, "index")}?${equipmentQuery}#fish-location-panel`;
    return { detailHref, mapHref, equipmentHref };
  }
  function fishCard(ctx, copyText, id) {
    const fish = ctx.species[id];
    const image = fish.visual?.image ? `<img loading="lazy" src="${ctx.esc(fish.visual.image)}" alt="">` : "";
    const returnPath = notebookReturn(ctx);
    const { detailHref, mapHref, equipmentHref } = fishActionLinks(ctx, id, returnPath);
    const actionsLabel = copyText.actionsFor(fish.name);
    const className = ctx.notebookFullRoute ? "notebook-fish notebook-route-fish" : "notebook-fish";
    return `<article class="${className}" data-notebook-card="${ctx.esc(id)}"><a class="notebook-fish-main" data-notebook-action="details" href="${ctx.esc(detailHref)}" aria-label="${ctx.esc(fish.name)} · ${ctx.esc(copyText.details)}">${image}<span><strong>${ctx.esc(fish.name)}</strong><small>${ctx.esc(copyText.id)} ${ctx.esc(id)} · ${ctx.esc(copyText.details)} ↗</small></span></a><nav class="notebook-fish-actions" aria-label="${ctx.esc(actionsLabel)}"><a data-notebook-action="map" href="${ctx.esc(mapHref)}">${ctx.esc(copyText.mapAction)} ↗</a><a data-notebook-action="equipment" href="${ctx.esc(equipmentHref)}">${ctx.esc(copyText.equipmentAction)} ↗</a></nav></article>`;
  }
  function fishList(ctx, copyText, ids) {
    return ids.map((id) => fishCard(ctx, copyText, id)).join("");
  }
  function fullRouteMarkup(ctx, guide, copyText) {
    const seen = /* @__PURE__ */ new Set();
    const groups = guide.stages.map((entry) => {
      const ids = eligibleFish(ctx, entry.firstOccurrenceSpecies, guide.species).filter((id) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      const routeCtx = { ...ctx, activeStage: entry.stage, notebookFullRoute: true };
      const open2 = Number(ctx.notebookRouteStage) === entry.stage ? " open" : "";
      return `<details id="notebook-route-${entry.stage}" class="notebook-route-group" data-notebook-route-stage="${entry.stage}" data-route-count="${ids.length}"${open2}><summary>${ctx.esc(copyText.routeGroup(entry.stage, ids.length))}</summary><div class="notebook-fish-list">${fishList(routeCtx, copyText, ids)}</div></details>`;
    }).join("");
    const open = ctx.notebookRouteStage ? " open" : "";
    return `<details class="notebook-full-route" data-notebook-route-total="${seen.size}"${open}><summary>${ctx.esc(copyText.fullRoute(seen.size))}</summary><p>${ctx.esc(copyText.fullRouteNote)}</p>${groups}</details>`;
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
  function areaCountLinks(ctx, guide, copyText) {
    const links = guide.stages.map((entry) => {
      const stage = Number(entry.stage);
      const ids = entry.speciesIds || entry.species || [];
      const count = eligibleFish(ctx, ids, guide.species).length;
      const query = new URLSearchParams({ stage: String(stage) });
      if (ctx.returnPath) query.set("return", ctx.returnPath);
      const href = `${localizedPage(ctx, "maps")}?${query}#notebook-guide`;
      const current = stage === Number(ctx.activeStage) ? ' aria-current="page"' : "";
      return `<a class="notebook-area-count" data-notebook-area="${stage}" data-notebook-count="${count}" href="${ctx.esc(href)}" aria-label="${ctx.esc(copyText.areaCount(stage, count))}"${current}><span>${ctx.esc(ctx.c.area(stage))}</span><strong>${ctx.esc(count)}</strong></a>`;
    }).join("");
    return `<div class="notebook-area-counts"><p>${ctx.esc(copyText.areaCountsTitle)}</p><nav aria-label="${ctx.esc(copyText.areaCountsTitle)}">${links}</nav></div>`;
  }
  function evidenceLink(ctx, copyText, progressText) {
    const href = "https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/notebook-completion-research.md";
    return `<details class="notebook-evidence"><summary>${ctx.esc(copyText.evidence)}</summary><p class="notebook-progress">${ctx.esc(progressText)}</p><p>${ctx.esc(copyText.triggerLimit)}</p><p><a href="${href}">${ctx.esc(copyText.evidenceLink)} ↗</a></p></details>`;
  }
  function notebookGuideMarkup(ctx) {
    const guide = ctx.notebookCompletion;
    const stage = guide?.stages?.find((entry) => entry.stage === Number(ctx.activeStage));
    if (!guide?.species || !stage || typeof ctx.fishHref !== "function") return "";
    const copyText = localizedCopy(ctx);
    const newIds = eligibleFish(ctx, stage.firstOccurrenceSpecies, guide.species);
    const repeatedIds = eligibleFish(ctx, stage.repeatedFromEarlierStages, guide.species);
    const excludedIds = excludedFish(ctx, stage.excludedFromNotebook, guide.species);
    const recordableCount = eligibleFish(
      ctx,
      stage.speciesIds || stage.species || [],
      guide.species
    ).length;
    const newTitle = (count) => copyText.newTitle(count);
    const detailsOpen = ctx.openNotebookGuide ? " open" : "";
    const newList = newIds.length ? `<details class="notebook-new"${detailsOpen}><summary>${ctx.esc(newTitle(newIds.length))}</summary><p class="notebook-target-note">${ctx.esc(copyText.spawnNote)}</p><div class="notebook-fish-list">${fishList(ctx, copyText, newIds)}</div></details>` : `<p class="notebook-empty">${ctx.esc(copyText.empty)}</p>`;
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
    return `<div class="notebook-guide-panel" data-stage="${ctx.activeStage}" data-notebook-total="${recordableCount}" data-notebook-new="${newIds.length}" data-notebook-repeated="${repeatedIds.length}"><div class="notebook-guide-heading"><div><p class="notebook-eyebrow">${ctx.esc(copyText.title)}</p><h3>${ctx.esc(ctx.c.area(ctx.activeStage))}</h3></div></div><div class="notebook-count-summary"><p class="notebook-recordable"><strong>${recordableCount}</strong><span>${ctx.esc(copyText.recordableLabel(ctx.activeStage))}</span></p><div class="notebook-count-breakdown"><p>${ctx.esc(copyText.newCount(newIds.length))}</p><p>${ctx.esc(copyText.repeatedCount(repeatedIds.length))}</p></div></div><section class="notebook-count-explainer"><h4>${ctx.esc(copyText.countNoteTitle)}</h4><p>${ctx.esc(copyText.countNote(ctx.activeStage, recordableCount, newIds.length, repeatedIds.length))}</p></section>${areaCountLinks(ctx, guide, copyText)}${notebookVerificationMarkup(ctx, copyText)}${progressMarkup(ctx)}${fullRouteMarkup(ctx, guide, copyText)}${newList}${repeated}${excluded}${evidenceLink(ctx, copyText, copyText.progress(ctx.activeStage, progress, total))}</div>`;
  }
  function renderNotebookGuide(ctx) {
    const mount = ctx.$("notebook-guide");
    if (!mount) return;
    const markup = notebookGuideMarkup(ctx);
    mount.innerHTML = markup;
    mount.hidden = !markup;
    if (markup) bindNotebookProgress(ctx, mount);
  }

  // src/pages/maps/water-icons.js
  var copy2 = {
    th: {
      title: "สัญลักษณ์บนผิวน้ำในเกม",
      imageNote: "ภาพขยายจากกราฟิกต้นฉบับในเกม; ในเกมมีหลายทิศและหลายเฟรม",
      small: "ปลาเล็ก: ต่ำกว่า 50 ซม.",
      large: "ปลาใหญ่: ตั้งแต่ 50 ซม.",
      bubble: "ฟอง: ปลาบางชนิดใช้ทุกขนาด",
      filterTitle: "กรองปลาตามสัญลักษณ์ที่อาจเห็น",
      idle: "เลือกสัญลักษณ์เพื่อดูชนิดปลาที่มีโอกาสแสดงภาพแบบนั้นในด่านนี้",
      count: (n, area, mark) => `ด่าน ${area}: มีปลา ${n} ชนิดที่ข้อมูล ROM ระบุว่าอาจใช้สัญลักษณ์ “${mark}”`,
      none: (area) => `ไม่พบชนิดปลาที่ใช้สัญลักษณ์นี้ในข้อมูลของด่าน ${area} ลองเลือกด่านอื่นหรือล้างตัวกรอง`,
      resultLimit: "รายการนี้แสดงความเป็นไปได้จากข้อมูล ROM ไม่ใช่โอกาสหรือเปอร์เซ็นต์ที่จะเจอปลา",
      sameRule: "กติกาสัญลักษณ์เหมือนกันทุกด่าน แต่แต่ละด่านมีชนิดปลาไม่เหมือนกัน",
      effect: "ยังไม่พบหลักฐานว่าสัญลักษณ์เองเพิ่มโอกาสกินเหยื่อหรือตกได้ ขนาดจริงของปลาใช้ในการคำนวณการสู้ปลาบางจุด",
      conflict: (name, mark) => `ปลาที่เลือก “${name}” ไม่มีสัญลักษณ์ “${mark}” ในข้อมูล ROM จึงไม่มีหมุดตรงกับตัวกรองนี้`,
      clearTarget: "ดูปลาที่เข้ากับสัญลักษณ์นี้",
      listLink: "ไปยังรายชื่อปลาที่เข้ากัน",
      clearFilter: "ล้างตัวกรองสัญลักษณ์",
      evidence: "อ่านความหมายของสัญลักษณ์",
      detail: "ดูสัญลักษณ์ที่ปลานี้อาจแสดง",
      note: "ปลาเล็ก/ใหญ่คำนวณจากขนาดตอนสร้างไอคอน ซึ่งอาจไม่อัปเดตทันทีเมื่อปลาโต ปลาบางชนิดใช้ภาพฟองทุกขนาด สัญลักษณ์อย่างเดียวระบุชนิดปลาไม่ได้ หมุดบนเว็บเป็นรูปชนิดปลา ไม่ใช่สัญลักษณ์ในเกม",
      listHeading: "ปลาที่อาจแสดงสัญลักษณ์นี้ในด่านนี้",
      listSearchHeading: "ค้นหาในปลาที่อาจแสดงสัญลักษณ์นี้",
      listEmpty: "ไม่มีปลาที่เข้ากับสัญลักษณ์นี้ในขอบเขตรายการที่เลือก",
      listSearchEmpty: "ไม่พบคำค้นในรายชื่อปลาที่อาจแสดงสัญลักษณ์นี้",
      sectionEmpty: "ส่วนแผนที่นี้ไม่มีจุดที่ตรงกับตัวกรอง ลองเลือกส่วนอื่น"
    },
    en: {
      title: "Water marks in the game",
      imageNote: "Original game pixels enlarged; directions and animation frames vary in play.",
      small: "Small fish: under 50 cm",
      large: "Large fish: 50 cm or more",
      bubble: "Bubbles: some fish, at any size",
      filterTitle: "Filter fish by a possible water mark",
      idle: "Choose a mark to see which species can show it in this area.",
      count: (n, area, mark) => `Area ${area}: ROM data lists ${n} species that may use the “${mark}” mark.`,
      none: (area) => `No species with this mark are listed for Area ${area}. Try another area or clear the filter.`,
      resultLimit: "This is a ROM-based possibility list, not a chance or percentage of finding a fish.",
      sameRule: "The same mark rule applies in every area, but the fish available differ by area.",
      effect: "No evidence shows that the mark itself improves bites or catches. Actual fish size is used in some fight calculations.",
      conflict: (name, mark) => `The selected fish, “${name},” cannot have the “${mark}” mark in the ROM data, so no pins match both filters.`,
      clearTarget: "Show fish that can have this mark",
      listLink: "Jump to compatible fish",
      clearFilter: "Clear mark filter",
      evidence: "How to read these marks",
      detail: "See this fish’s possible marks",
      note: "Small/large is based on size when the icon is created and may not update immediately as a fish grows. Some fish show bubbles at any size. A mark alone cannot identify the species. Website pins are species portraits, not in-game marks.",
      listHeading: "Fish that may show this mark in this area",
      listSearchHeading: "Search among fish that may show this mark",
      listEmpty: "No fish match this mark in the selected list scope.",
      listSearchEmpty: "No search matches among fish that may show this mark.",
      sectionEmpty: "No matching points in this map section. Try another section."
    },
    ja: {
      title: "ゲーム内の水面マーク",
      imageNote: "原作の画像を拡大しています。ゲーム中は方向やアニメーションで形が変わります。",
      small: "小魚影：50cm未満",
      large: "大魚影：50cm以上",
      bubble: "泡：一部の魚、サイズ不問",
      filterTitle: "水面マークから魚種を絞り込む",
      idle: "マークを選ぶと、このエリアで表示される可能性がある魚種を確認できます。",
      count: (n, area, mark) => `エリア${area}：ROM上で「${mark}」を使う可能性がある魚種は${n}種です。`,
      none: (area) => `エリア${area}にはこのマークに該当する魚種がありません。別のエリアを選ぶか、絞り込みを解除してください。`,
      resultLimit: "ROMから確認できる可能性の一覧で、遭遇確率や割合ではありません。",
      sameRule: "マークの判定規則は全エリア共通ですが、エリアごとに魚種が異なります。",
      effect: "マーク自体が食いつきや釣果を高める証拠はありません。実際の魚のサイズは一部のファイト計算に使われます。",
      conflict: (name, mark) => `選択中の「${name}」はROMデータ上「${mark}」にならないため、両方に一致する地点はありません。`,
      clearTarget: "このマークに該当する魚を見る",
      listLink: "該当する魚の一覧へ",
      clearFilter: "マーク絞り込みを解除",
      evidence: "マークの見方",
      detail: "この魚に表示されるマーク",
      note: "小魚影・大魚影はアイコン生成時のサイズで決まり、成長後すぐ更新されない場合があります。一部の魚はサイズに関係なく泡のマークを使います。マークだけでは魚種を特定できません。地図のピンは魚種画像で、ゲーム内マークではありません。",
      listHeading: "このエリアで表示される可能性がある魚",
      listSearchHeading: "このマークに該当する魚を検索",
      listEmpty: "選択中の一覧範囲に、このマークに該当する魚はいません。",
      listSearchEmpty: "このマークに該当する魚の中に一致する検索結果はありません。",
      sectionEmpty: "この範囲に該当する地点はありません。別の範囲を選んでください。"
    }
  };
  function renderWaterKey(ctx) {
    const node = ctx.$("water-icon-key"), data = ctx.waterIcons;
    if (!node || !data?.classes) return;
    const labels = copy2[ctx.lang], profile = data.profiles?.[ctx.selectedFish], classes = ["small", "large", "bubble"];
    const buttons = classes.filter((key) => data.classes[key]?.image).map((key) => markButton(ctx, labels, data, key, profile)).join("");
    node.innerHTML = `${renderHeader(labels)}<div class="water-mark-buttons" role="group" aria-label="${ctx.esc(labels.filterTitle)}">${buttons}</div>${renderMarkResults(ctx, labels)}<div class="water-mark-notes"><p>${ctx.esc(labels.sameRule)}</p><p>${ctx.esc(labels.effect)}</p><details class="water-mark-evidence"><summary>${ctx.esc(labels.evidence)}</summary><p class="water-icon-image-note">${ctx.esc(labels.imageNote)}</p><p>${ctx.esc(labels.note)}</p></details></div>${renderFishDetailLink(ctx, labels)}`;
    node.hidden = !buttons;
  }
  function renderHeader(labels) {
    return `<h4>${labels.title}</h4><p class="water-mark-heading">${labels.filterTitle}</p>`;
  }
  function markButton(ctx, labels, data, key, profile) {
    const active = ctx.activeWaterMark === key, possible = profile?.possibleClasses?.includes(key), image = `${data.classes[key].image}?v=native-20261005`;
    return `<button type="button" id="water-mark-${key}" class="water-mark-button${active ? " is-active" : ""}" data-water-mark="${key}" aria-pressed="${active}" aria-controls="fish-list map-view" aria-label="${ctx.esc(labels[key])}"><img src="${ctx.esc(image)}" alt=""><span>${ctx.esc(labels[key])}${possible ? `<small>${ctx.lang === "th" ? "เป็นไปได้กับปลาที่เลือก" : ctx.lang === "ja" ? "選択中の魚に該当" : "Possible for selected fish"}</small>` : ""}</span></button>`;
  }
  function renderMarkResults(ctx, labels) {
    const mark = ctx.activeWaterMark;
    if (!mark)
      return `<div class="water-mark-results" id="water-mark-results"><p>${ctx.esc(labels.idle)}</p></div>`;
    const ids = ctx.waterMarkFishIds(ctx.activeStage, mark), label = labels[mark], count = ids.length, status = count ? labels.count(count, ctx.activeStage, label) : labels.none(ctx.activeStage), conflict = ctx.selectedFish && !ctx.fishMatchesWaterMark(ctx.selectedFish, mark);
    return `<div class="water-mark-results" id="water-mark-results"><p class="water-mark-count" aria-live="polite">${ctx.esc(status)}</p><p>${ctx.esc(labels.resultLimit)}</p>${conflict ? `<p class="water-mark-conflict" data-water-mark-conflict role="status">${ctx.esc(labels.conflict(ctx.fishName(ctx.selectedFish), label))}</p>` : ""}<div class="water-mark-actions"><a href="#fish-list">${ctx.esc(labels.listLink)} ↘</a>${ctx.selectedFish ? `<button type="button" data-action="show-mark-candidates">${ctx.esc(labels.clearTarget)}</button>` : ""}<button type="button" data-action="clear-water-mark">${ctx.esc(labels.clearFilter)}</button></div></div>`;
  }
  function waterMarkAreaText(ctx, stage) {
    if (!ctx.activeWaterMark) return "";
    const count = ctx.waterMarkFishIds(stage).length, mark = copy2[ctx.lang][ctx.activeWaterMark];
    if (ctx.lang === "th") return `${count} ชนิดอาจแสดง · ${mark}`;
    if (ctx.lang === "ja") return `${count}種が表示される可能性 · ${mark}`;
    return `${count} possible · ${mark}`;
  }
  function waterMarkFishHeading(ctx, hasSearch) {
    const labels = copy2[ctx.lang];
    return hasSearch ? labels.listSearchHeading : labels.listHeading;
  }
  function waterMarkEmptyText(ctx, hasSearch) {
    if (!ctx.activeWaterMark) return ctx.c.noFish;
    const labels = copy2[ctx.lang];
    return hasSearch ? labels.listSearchEmpty : labels.listEmpty;
  }
  function waterMarkPinHelp(ctx, hasPoints) {
    const labels = copy2[ctx.lang];
    if (!ctx.activeWaterMark) return "";
    const mark = labels[ctx.activeWaterMark];
    if (ctx.selectedFish && !ctx.fishMatchesWaterMark(ctx.selectedFish))
      return labels.conflict(ctx.fishName(ctx.selectedFish), mark);
    if (!hasPoints && !ctx.waterMarkFishIds(ctx.activeStage).length)
      return labels.none(ctx.activeStage);
    if (!hasPoints) return labels.sectionEmpty;
    if (ctx.lang === "th")
      return `กรองจุดตามปลาที่อาจแสดง “${mark}” สัญลักษณ์ไม่ได้ระบุชนิดปลาที่กำลังอยู่ตรงนั้น`;
    if (ctx.lang === "ja")
      return `「${mark}」を表示する可能性がある魚の地点に絞り込みました。マークだけでは今いる魚種は分かりません。`;
    return `Filtered to points for fish that may show “${mark}”. The mark does not identify which fish is there now.`;
  }
  function renderFishDetailLink(ctx, labels) {
    return ctx.selectedFish ? `<a class="water-mark-fish-detail" href="${ctx.esc(ctx.fishHref(ctx.selectedFish))}#water-icons">${ctx.esc(labels.detail)} ↗</a>` : "";
  }

  // src/pages/maps/water-mark-filter.js
  var WATER_MARKS = ["small", "large", "bubble"];
  function normalizeWaterMark(mark) {
    return WATER_MARKS.includes(mark) ? mark : "";
  }
  function fishMatchesWaterMark(ctx, id, mark = ctx.activeWaterMark) {
    if (!mark) return true;
    return (ctx.waterIcons?.profiles?.[id]?.possibleClasses || []).includes(mark);
  }
  function waterMarkFishIds(ctx, stage, mark = ctx.activeWaterMark) {
    const ids = ctx.stages[stage]?.species || [];
    return [...ids].filter((id) => fishMatchesWaterMark(ctx, id, mark));
  }
  function visibleMapFishIds(ctx, ids) {
    return ids.filter(
      (id) => (!ctx.selectedFish || id === ctx.selectedFish) && fishMatchesWaterMark(ctx, id)
    );
  }
  function bindWaterMarkFilter(ctx) {
    const panel = ctx.$("water-icon-key");
    panel.addEventListener("click", (event) => {
      const markButton2 = event.target.closest("[data-water-mark]");
      if (markButton2) return selectWaterMark(ctx, markButton2.dataset.waterMark);
      const actionButton = event.target.closest("[data-action]"), action = actionButton?.dataset.action;
      if (action === "clear-water-mark") clearWaterMark(ctx);
      if (action === "show-mark-candidates") showMarkCandidates(ctx);
    });
  }
  function selectWaterMark(ctx, mark) {
    if (!WATER_MARKS.includes(mark)) return;
    ctx.lastWaterMark = mark;
    ctx.activeWaterMark = ctx.activeWaterMark === mark ? "" : mark;
    ctx.activeSection = ctx.chooseSection(ctx.activeStage);
    ctx.render();
    ctx.$(`water-mark-${mark}`)?.focus?.();
  }
  function clearWaterMark(ctx) {
    ctx.lastWaterMark = ctx.activeWaterMark || ctx.lastWaterMark || "small";
    ctx.activeWaterMark = "";
    ctx.activeSection = ctx.chooseSection(ctx.activeStage);
    ctx.render();
    ctx.$(`water-mark-${ctx.lastWaterMark}`)?.focus?.();
  }
  function showMarkCandidates(ctx) {
    ctx.selectedFish = "";
    ctx.searchInput.value = "";
    ctx.searchTerm = "";
    ctx.listScope = "area";
    ctx.closeSuggestions(true);
    ctx.activeSection = ctx.chooseSection(ctx.activeStage);
    ctx.render();
    ctx.$("fish-list").scrollIntoView?.({ block: "start" });
    ctx.$("fish-title")?.focus?.();
  }

  // src/pages/maps/notebook-status.js
  var copy3 = {
    en: {
      badge: "No journal entry",
      reason: "This species has no fish-journal entry. See the journal guide."
    },
    ja: {
      badge: "図鑑の記録枠なし",
      reason: "この魚種は図鑑の記録対象ではありません。図鑑ガイドを見る。"
    },
    th: {
      badge: "ไม่มีช่องในสมุดปลา",
      reason: "ปลาชนิดนี้ไม่มีช่องบันทึกในสมุดปลา ดูคำแนะนำสมุดปลา"
    }
  };
  function notebookStatus(ctx, id, linked = true) {
    if (ctx.notebookCompletion?.species?.[id]?.notebookEligible !== false) return "";
    const text2 = copy3[ctx.lang] || copy3.en;
    const marker = `class="notebook-excluded-badge" data-notebook-excluded="${ctx.esc(id)}"`;
    if (!linked)
      return `<span ${marker} title="${ctx.esc(text2.reason)}">${ctx.esc(text2.badge)}</span>`;
    return `<a class="notebook-excluded-badge" data-notebook-excluded="${ctx.esc(id)}" href="#notebook-guide" aria-label="${ctx.esc(text2.reason)}">${ctx.esc(text2.badge)}</a>`;
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
    const anchor = ctx.notebookRouteStage ? `#notebook-route-${ctx.notebookRouteStage}` : ctx.openNotebookGuide ? "#notebook-guide" : location.hash === "#map-view" ? "#map-view" : "";
    params.set("stage", String(ctx.activeStage));
    if (ctx.returnPath) params.set("return", ctx.returnPath);
    if (ctx.activeSection) params.set("section", ctx.activeSection);
    if (ctx.selectedFish) params.set("fish", ctx.selectedFish);
    if (ctx.activeWaterMark) params.set("mark", ctx.activeWaterMark);
    if (ctx.listScope === "section") params.set("scope", "section");
    if (ctx.searchTerm) params.set("q", ctx.searchTerm);
    history.replaceState(null, "", `${location.pathname}?${params.toString()}${anchor}`);
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
      const keepAnchor = ["#notebook-guide", "#map-view"].includes(location.hash) || /^#notebook-route-[1-6]$/.test(location.hash);
      link.href = `${route}?${paramsCopy.toString()}${keepAnchor ? location.hash : ""}`;
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
    const filtered = sections.map((section) => ({
      ...section,
      count: section.pins.filter((pin) => ctx.visibleMapFishIds(pin.fishIds).length).length
    })).filter((section) => section.count > 0).sort((a, b) => b.count - a.count || a.row - b.row || a.col - b.col);
    if (filtered.length) return filtered[0].key;
    return sections.sort((a, b) => b.pins.length - a.pins.length || a.row - b.row || a.col - b.col)[0].key;
  }
  function renderAreas(ctx) {
    ctx.areaList.innerHTML = Object.values(ctx.stages).sort((a, b) => a.stage - b.stage).map((data) => {
      const targetHere = !ctx.selectedFish || data.species.has(ctx.selectedFish);
      const pressed = data.stage === ctx.activeStage;
      const small = ctx.activeWaterMark ? ctx.waterMarkAreaText(data.stage) : ctx.selectedFish ? targetHere ? ctx.c.targetAvailable : ctx.c.targetAbsent : ctx.c.allArea(data.species.size);
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
    const pool = ctx.activeWaterMark ? ctx.waterMarkFishIds(ctx.activeStage) : Object.keys(ctx.species);
    return pool.filter(
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
      const areaBadges = item.stages.filter((stage) => !ctx.activeWaterMark || stage === ctx.activeStage).map((stage) => `<span class="suggestion-area-badge">${ctx.esc(ctx.c.area(stage))}</span>`).join("");
      const secondary = ctx.lang === "ja" ? item.visual.nameLatin || item.visual.nameTh || "" : item.visual.nameJa || "";
      const targetClass = ctx.selectedFish === id ? " is-map-target" : "";
      return `<div id="fish-suggestion-${id}" class="fish-suggestion${targetClass}" role="option" aria-selected="false" aria-posinset="${index + 1}" aria-setsize="${matches.length}" data-suggestion="${id}">${image ? `<img src="${ctx.esc(image)}" alt="">` : '<span class="suggestion-no-image" aria-hidden="true"></span>'}<span class="suggestion-copy"><strong>${ctx.esc(item.name)}</strong>${secondary && secondary !== item.name ? `<small class="suggestion-alias">${ctx.esc(secondary)}</small>` : ""}<span class="suggestion-meta"><code>ID ${ctx.esc(id)}</code><span class="suggestion-area-label">${areaLabel}</span><span class="suggestion-areas">${areaBadges}</span></span>${notebookStatus(ctx, id, false)}</span></div>`;
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
    const pool = ctx.activeWaterMark ? ctx.waterMarkFishIds(ctx.activeStage) : Object.keys(ctx.species);
    const ids = pool.filter(
      (id) => term ? ctx.normalizedSearch(ctx.searchable(id)).includes(term) : ctx.activeWaterMark ? ctx.listScope === "section" ? sectionIds.has(id) : true : ctx.listScope === "section" ? sectionIds.has(id) : ctx.fishInStage(id, ctx.activeStage)
    ).sort((a, b) => ctx.fishName(a).localeCompare(ctx.fishName(b), ctx.lang));
    ctx.renderFishListHeader(term, ids);
    ctx.fishList.innerHTML = ids.length ? ids.map((id) => ctx.fishChoice(id, term, sectionIds)).join("") : `<div class="empty-list">${ctx.esc(ctx.activeWaterMark ? ctx.waterMarkEmptyText(Boolean(term)) : ctx.c.noFish)}</div>`;
  }
  function renderFishListHeader(ctx, term, ids) {
    const header = ctx.$("fish-title");
    header.tabIndex = -1;
    header.textContent = ctx.activeWaterMark ? ctx.waterMarkFishHeading(Boolean(term)) : term ? ctx.c.searchResults : ctx.listScope === "section" ? ctx.lang === "th" ? "ปลาในส่วนแผนที่นี้" : ctx.lang === "ja" ? "この地図範囲の魚" : "Fish in this map section" : ctx.c.fishIn;
    ctx.$("fish-scope").innerHTML = [
      ["area", ctx.lang === "th" ? "ทั้งด่าน" : ctx.lang === "ja" ? "エリア全体" : "Whole area"],
      [
        "section",
        ctx.lang === "th" ? "ส่วนที่กำลังดู" : ctx.lang === "ja" ? "表示範囲" : "Current section"
      ]
    ].map(
      ([value, label]) => `<button type="button" data-scope="${value}" aria-pressed="${ctx.listScope === value}">${label}</button>`
    ).join("");
    ctx.$("area-summary").textContent = ctx.activeWaterMark && !term ? ctx.waterMarkAreaText(ctx.activeStage) : term && ctx.activeWaterMark ? `${ctx.c.area(ctx.activeStage)} · ${ids.length} ${ctx.c.fish}` : term ? `${ids.length} ${ctx.c.fish} · ${ctx.c.areas} ${ctx.lang === "ja" ? "で出現" : ctx.lang === "th" ? "ที่พบ" : "with configured points"}` : `${ctx.c.area(ctx.activeStage)} · ${ids.length} ${ctx.c.fish}`;
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
    return `<div class="fish-choice-row ${ctx.selectedFish === id ? "selected" : ""}"><a class="fish-portrait-link" href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(item.name)} — ${ctx.detailLabel}">${img ? `<img loading="lazy" src="${ctx.esc(img)}" alt="${ctx.esc(item.name)}">` : ""}</a><button class="fish-choice" type="button" data-fish="${id}" aria-pressed="${ctx.selectedFish === id}"><span>${ctx.esc(item.name)}<small>${ctx.esc(sub)}</small><small class="filter-action">${ctx.lang === "th" ? "เน้นบนแผนที่" : ctx.lang === "ja" ? "地図で絞り込む" : "Focus on map"}</small></span></button><a class="fish-details-link" href="${ctx.esc(ctx.fishHref(id))}">${ctx.detailLabel} ↗</a>${notebookStatus(ctx, id)}</div>`;
  }

  // src/pages/maps/map-render.js
  function renderSectionSelect(ctx) {
    const data = ctx.stages[ctx.activeStage];
    const allSections = [...data?.sections.values() || []];
    const matchedSections = allSections.filter(
      (section) => section.pins.some((pin) => ctx.visibleMapFishIds(pin.fishIds).length)
    );
    const sections = matchedSections.length ? matchedSections : allSections;
    sections.sort((a, b) => a.row - b.row || a.col - b.col);
    if (!sections.some((s) => s.key === ctx.activeSection))
      ctx.activeSection = ctx.chooseSection(ctx.activeStage);
    ctx.stageSelect.innerHTML = sections.map((section) => {
      const visible = section.pins.map((pin) => ctx.visibleMapFishIds(pin.fishIds)).filter((fishIds) => fishIds.length);
      const speciesCount = new Set(visible.flat()).size;
      const label = `${ctx.c.mapSection(section.col + 1, section.row + 1)} · ${ctx.c.point(visible.length)} · ${speciesCount} ${ctx.c.species}`;
      return `<option value="${section.key}" ${section.key === ctx.activeSection ? "selected" : ""}>${ctx.esc(label)}</option>`;
    }).join("");
    ctx.stageSelect.disabled = !sections.length;
    ctx.renderTargetSectionLinks(data, sections);
  }
  function renderTargetSectionLinks(ctx, data, targetSections) {
    const summary = ctx.$("target-section-summary"), shortcuts = ctx.$("other-sections");
    if (!ctx.selectedFish || !data || ctx.activeWaterMark && !ctx.fishMatchesWaterMark(ctx.selectedFish)) {
      summary.hidden = true;
      summary.textContent = "";
      shortcuts.hidden = true;
      shortcuts.innerHTML = "";
      return;
    }
    const total = [...data.pins.values()].filter(
      (pin) => ctx.visibleMapFishIds(pin.fishIds).length
    ).length;
    const sections = targetSections.map((section) => ({
      section,
      count: section.pins.filter((pin) => ctx.visibleMapFishIds(pin.fishIds).length).length
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
      return `<div class="pin-fish-row"><a class="pin-fish-details" href="${ctx.esc(ctx.fishHref(id))}">${img ? `<img src="${ctx.esc(img)}" alt="">` : ""}<span>${ctx.esc(f.name)} — ${ctx.detailLabel} ↗</span></a>${notebookStatus(ctx, id)}<button class="pin-fish-choice" type="button" data-fish="${id}">${ctx.lang === "th" ? "เน้นบนแผนที่" : ctx.lang === "ja" ? "地図で絞り込む" : "Focus on map"}</button></div>`;
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
      fishIds: ctx.visibleMapFishIds(pin.fishIds)
    })).filter((pin) => pin.fishIds.length);
    const geometry = ctx.mapGeometry(data, section, filtered);
    const {
      sourceW,
      sourceH,
      originX,
      originY,
      scale,
      viewW,
      viewH,
      terrainW,
      terrainH,
      gutterLeft,
      gutterTop
    } = geometry;
    ctx.renderMapSummary(section, filtered);
    const pins = filtered.map((pin) => ctx.mapPinMarkup(pin, originX, originY, scale, gutterLeft, gutterTop)).join("");
    ctx.$("map-view").style.width = `${viewW}px`;
    ctx.$("map-view").style.height = `${viewH}px`;
    ctx.$("map-view").innerHTML = `<div class="map-terrain-window" role="img" aria-label="${ctx.esc(`${stageTitle} · ${ctx.c.fullMap}`)}" style="width:${terrainW}px;height:${terrainH}px;left:${gutterLeft}px;top:${gutterTop}px"><img class="map-ground" src="${ctx.esc(data.fullImage)}" alt="" style="width:${Math.round(sourceW * scale)}px;height:${Math.round(sourceH * scale)}px;left:${Math.round(-originX * scale)}px;top:${Math.round(-originY * scale)}px"></div>${pins}`;
    ctx.$("pin-details").hidden = true;
    ctx.renderOverview(data, section);
    ctx.renderMapNavigation();
  }
  function mapPinMarkup(ctx, pin, originX, originY, scale, gutterLeft = 0, gutterTop = 0) {
    const px = (pin.x * 16 + 8 - originX) * scale + gutterLeft, py = (pin.y * 16 + 8 - originY) * scale + gutterTop;
    const names = pin.fishIds.map((id) => ctx.fishName(id)).join(", "), imgs = pin.fishIds.map((id) => ctx.species[id].visual.image).filter(Boolean);
    const tag = pin.fishIds.length === 1 ? "a" : "button";
    const action = tag === "a" ? `href="${ctx.esc(ctx.fishHref(pin.fishIds[0]))}"` : `type="button" data-pin="${pin.fishIds.join(",")}"`;
    return `<${tag} ${action} class="fish-pin ${ctx.selectedFish ? "focused" : ""}" style="left:${px}px;top:${py}px" data-x="${pin.x}" data-y="${pin.y}" title="${ctx.esc(names)} · X ${pin.x}, Y ${pin.y}" aria-label="${ctx.esc(names)} · X ${pin.x}, Y ${pin.y}">${imgs.slice(0, 2).map((src) => `<img loading="lazy" src="${ctx.esc(src)}" alt="">`).join(
      ""
    )}${pin.fishIds.length > 1 ? `<span class="cluster-count">${pin.fishIds.length}</span>` : ""}</${tag}>`;
  }
  function markerInsets(pins, selectedFish, originX, originY, cellW, cellH, scale) {
    const insets = { left: 0, right: 0, top: 0, bottom: 0 };
    for (const pin of pins) {
      const centerX = pin.x * 16 + 8 - originX;
      const centerY = pin.y * 16 + 8 - originY;
      const shared = pin.fishIds.length > 1;
      const width = selectedFish ? 62 : shared ? 80 : 46;
      const height = selectedFish ? 38 : 36;
      insets.left = Math.max(insets.left, width / 2 + 3 - centerX * scale);
      insets.right = Math.max(
        insets.right,
        width / 2 + (shared ? 8 : 0) + 3 - (cellW - centerX) * scale
      );
      insets.top = Math.max(insets.top, height / 2 + (shared ? 9 : 0) + 3 - centerY * scale);
      insets.bottom = Math.max(insets.bottom, height / 2 + 3 - (cellH - centerY) * scale);
    }
    return Object.fromEntries(
      Object.entries(insets).map(([side, value]) => [side, Math.max(0, Math.ceil(value))])
    );
  }
  function mapGeometry(ctx, data, section, pins = section?.pins || []) {
    const sourceW = data.width, sourceH = data.height, originX = section.col * 384, originY = section.row * 384;
    const cellW = Math.max(1, Math.min(384, sourceW - originX)), cellH = Math.max(1, Math.min(384, sourceH - originY));
    const panelWidth = ctx.$("map-view").parentElement.clientWidth || window.innerWidth;
    const fitScale = Math.min(2.2, (panelWidth - 4) / cellW, 620 / cellH);
    let scale = Math.max(0.3, fitScale);
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const gutter2 = markerInsets(pins, ctx.selectedFish, originX, originY, cellW, cellH, scale);
      const widthFit = (panelWidth - 4 - gutter2.left - gutter2.right) / cellW;
      const heightFit = (620 - gutter2.top - gutter2.bottom) / cellH;
      const nextScale = Math.max(0.3, Math.min(scale, widthFit, heightFit));
      if (Math.abs(nextScale - scale) < 1e-3) break;
      scale = nextScale;
    }
    scale *= ctx.zoom;
    const gutter = markerInsets(pins, ctx.selectedFish, originX, originY, cellW, cellH, scale);
    const terrainW = Math.round(cellW * scale), terrainH = Math.round(cellH * scale), viewW = terrainW + gutter.left + gutter.right, viewH = terrainH + gutter.top + gutter.bottom;
    return {
      sourceW,
      sourceH,
      originX,
      originY,
      scale,
      viewW,
      viewH,
      terrainW,
      terrainH,
      gutterLeft: gutter.left,
      gutterTop: gutter.top
    };
  }
  function mapZoomHelp(lang) {
    if (lang === "th") return "กด + เพื่อขยายจุดที่อยู่ชิดกัน";
    if (lang === "ja") return "近い地点は＋で拡大できます。";
    return "Use + to enlarge closely spaced points.";
  }
  function renderMapSummary(ctx, section, filtered) {
    const counts = new Set(filtered.flatMap((pin) => pin.fishIds)).size;
    ctx.$("map-summary").textContent = `${ctx.c.mapSection(section.col + 1, section.row + 1)} · ${ctx.c.point(filtered.length)} · ${counts} ${ctx.c.species}`;
    ctx.$("pin-help").textContent = ctx.activeWaterMark ? ctx.waterMarkPinHelp(filtered.length > 0) : ctx.selectedFish ? `${ctx.c.selectedTarget} ${ctx.fishName(ctx.selectedFish)}. ${ctx.c.point(filtered.length)}. ${mapZoomHelp(ctx.lang)}` : `${ctx.c.noTarget} ${ctx.lang === "th" ? "กดรูปปลาเพื่อดูรายละเอียด หรือกดจุดซ้อนเพื่อเลือกชนิด" : ctx.lang === "ja" ? "魚画像は詳細へ。重なった地点は魚種を選択。" : "Fish portraits open details; shared points let you choose a species"}.`;
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
    const matchedSections = [...data.sections.values()].filter(
      (section2) => section2.pins.some((pin) => ctx.visibleMapFishIds(pin.fishIds).length)
    );
    const selectedSections = matchedSections.length ? matchedSections : [...data.sections.values()];
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
    ctx.notebookRouteStage = Number(location.hash.match(/^#notebook-route-([1-6])$/)?.[1]) || 0;
    ctx.openNotebookGuide = location.hash === "#notebook-guide" || Boolean(ctx.notebookRouteStage);
    const p = new URLSearchParams(location.search);
    ctx.activeWaterMark = normalizeWaterMark(p.get("mark"));
    ctx.lastWaterMark = ctx.activeWaterMark;
    if (p.get("scope") === "section") ctx.listScope = "section";
    ctx.searchTerm = p.get("q") || "";
    ctx.searchInput.value = ctx.searchTerm;
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
    ctx.activeWaterMark = "";
    ctx.lastWaterMark = "";
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
      back.id = "map-source-back";
      back.href = ctx.returnPath;
      back.textContent = ctx.lang === "th" ? "← กลับหน้าที่เปิดแผนที่" : ctx.lang === "ja" ? "← 前のページに戻る" : "← Back to the page that opened this map";
      document.querySelector(".hero-meta").prepend(back);
    }
    ctx.sourceReturn = () => location.pathname.split("/").pop() + location.search + (ctx.openNotebookGuide ? "#notebook-guide" : location.hash === "#map-view" ? "#map-view" : "");
    ctx.fishHref = (id) => {
      const source = ctx.sourceReturn();
      const returnPath = source.endsWith("#notebook-guide") ? source : `${source.split("#")[0]}#map-view`;
      const page = `fish${ctx.lang === "en" ? "" : "." + ctx.lang}.html`;
      const query = `id=${id}&stage=${ctx.activeStage}&return=${encodeURIComponent(returnPath)}`;
      return `${page}?${query}`;
    };
    ctx.areaList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-stage]");
      if (!button || button.disabled) return;
      ctx.activeStage = Number(button.dataset.stage);
      ctx.activeSection = ctx.chooseSection(ctx.activeStage);
      ctx.render();
    });
    ctx.fishList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-fish]");
      if (button) ctx.setFish(button.dataset.fish, { toggle: false });
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
      ctx.lastWaterMark = ctx.activeWaterMark || ctx.lastWaterMark;
      ctx.activeWaterMark = "";
      ctx.listScope = "area";
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
      fetch("gallery-data.json?v=compendium-20261005-32").then((r) => {
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
      if (ctx.notebookRouteStage)
        ctx.$(`notebook-route-${ctx.notebookRouteStage}`)?.scrollIntoView({ block: "start" });
      else if (ctx.openNotebookGuide) ctx.$("notebook-guide")?.scrollIntoView({ block: "start" });
      else if (location.hash === "#map-view") ctx.$("map-view")?.scrollIntoView({ block: "start" });
    }).catch((error) => {
      console.error(error);
      ctx.$("pin-help").textContent = ctx.lang === "th" ? "โหลดข้อมูลปลาไม่สำเร็จ กรุณาโหลดหน้าใหม่" : ctx.lang === "ja" ? "魚データを読み込めません。ページを再読み込みしてください。" : "Could not load fish map data. Please reload the page.";
    });
  }

  // src/pages/maps/index.js
  function initialize(ctx) {
    setupContext(ctx);
    bindMapTargets(ctx);
    bindWaterMarkFilter(ctx);
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
