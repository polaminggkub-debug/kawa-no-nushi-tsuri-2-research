# Notebook repetition audit (read-only)

2026-10-06, current HEAD 391170f. Actual Chrome local TH Area4 `maps.th.html?stage=4&section=s4-c1-r1#notebook-guide`, default route open, helper/evidence closed. Opened helper deliberately to inspect supplemental text. No source edits or manual checkbox changes. Temporary 390×844 viewport reset.

## Current state vs old complaint

Current notebook page is already significantly consolidated compared with the old screenshot/message. It has one local summary, one manual checklist control block, one closed helper, one global route listing, earlier-area and excluded groups, and closed research evidence. Counting every occurrence of the word notebook across closed HTML would exaggerate current visible clutter. The important repeated concepts are below.

## Concrete consolidation candidates

| Place | Current redundancy | Recommended retained meaning |
| --- | --- | --- |
| `src/pages/maps/notebook-guide.js` localized newCount/repeatedCount and routeGroup; markup line310 | Area4 summary says17 new and5 earlier, then opened route group again says17 new. Necessary context but verbose separate sentences. | Compact single breakdown `22 available here = 17 first listed here + 5 also in earlier areas`; retain route group count beside its heading as navigation. Do not delete distinction between availability count and game page record total. |
| guide title + `notebook-progress.js` title + fullRoute heading | `เช็กลิสต์ปลา`, `รายการที่คุณเช็กเอง`, `เก็บให้ครบ66ชนิด·ไม่ซ้ำ` create three conceptual introductions before actionable species. Screenshot shows the whole390 viewport occupied with summary/manual/help/route-intro. | One primary Fish checklist heading; local area/count subheading,0/66 progress and remaining-only directly grouped; global route heading can become concise `By first area · no duplicates`. Preserve all66 denominator prominently. |
| guide.fullRouteNote, guide.spawnNote inside help, map bottom caveat | Inactive configured spawn points repeated three times: map bottom, open route introductory paragraph, and open help paragraph. User decision same: retry another point if empty. | Keep canonical availability caveat at map, with per-fish profile explanation as needed. Route intro should explain only grouping once by first configured area and that links open map/gear; remove extra availability caveat from route/help or refer to map, without deleting research. |
| `.notebook-help` summary and countNoteTitle | Summary `วิธีเช็กในเกม / ทำไมจำนวนไม่ตรงกัน` then heading `ทำไมเลขในสมุดเกมถึงไม่เท่ากับจำนวนในไกด์`. | Summary already introduces count mismatch; short subsection `Game page totals` if needed, retain complete largest-record movement explanation once. |
| manual note and helper verifyTitle | Manual note `Tick after checking in-game...` repeats verifyTitle `After fishing: check game journal before ticking...`. | Manual single-line reminder and browser-only-storage limitation; helper body gives actual land → finish messages → Tool05 → one of six pages steps and direct Tool05 link. Helper title can simply `How to check Tool05`. |

## Preserve explicitly

- Global66 species, unique first-occurrence route totals6/10/11/17/11/11.
- Available-in-area counts6/12/15/22/27/15 and no fixed required game-page total.
- Largest-size record moves area; smaller/equal does not; sum six pages.
- Manual web ticks do not read/write game saves; temporary-storage warning.
- Earlier species may still be missing, excluded species are not notebook targets.
- Exact species anchors, stage-preserving focused links and manual progress.
- Controller-only Yamame catch evidence and all ROM research links under closed evidence.

## Recommendation strength

This is a copy/hierarchy refinement, not an unresolved game mechanic or lost-data bug. The current default page is substantially better already. Highest-value narrow change is canonicalize spawn caveat and compress repeated introduction/breakdown; avoid adding yet another explanatory section. Root should choose concise wording across TH/EN/JA, protect counted-data semantics and direct Tool05 action with existing guards, then visually inspect the shorter notebook entry.

Private baseline screenshot:
`(private, not published) r65-notebook-copy-baseline.png`.
