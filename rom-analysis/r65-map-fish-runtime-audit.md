# r65 Maps and Fish runtime audit

Date: 2026-10-06. Checkout at start: `391170f` (r64). Independent Chrome session; local publication preview at http://localhost:8766. Read-only source/guard ownership; no production edits. No published-site claim from this audit.

## Environment correction

Port 8765 is an unrelated existing SSP scratchpad server (PID 27730), and the expected catalogue path returned HTTP 404. Left it untouched. Started publication preview at 8766 (exec session 13099) for the audit. Root informed. This is an environment mismatch, not a catalogue regression.

## Actual interaction coverage

| Requirement | Browser action and observed result |
| --- | --- |
| Thai mobile search | 390×844 Area 1: typed `06` in fish combobox; suggestion visibly gave Nijimasu, ID 06, Areas 1/2/3. Selected suggestion; map narrowed to 10 configured points in section s1-c1-r4. Areas 4/5/6 visibly disabled because selected target is absent. |
| Selected target area switch | Clicked Area 3; selected section s3-c1-r1, 16 target points, query stage=3. No horizontal page overflow. Clicked actual Details link into fish 06, Area 3 retained. |
| Exact manual checklist action | Clicked profile’s localized manual checklist link. Result maps stage=3, fish=06, `#notebook-species-06`; full route and first-occurrence Area 1 group expanded. Target card visible at top ~274px, below sticky header. Card explicitly says organized in Area 1 for deduplication, fishing location selected Area 3. Target profile/map/equipment actions retained Area 3. |
| Manual marking and restoration | Original all unchecked, counter 0/66. Checked fish 06 with UI; counter 1/66. Reload retained checked state and focused row. Checked remaining-only UI; target hidden, exact hash cleared to route-group hash. Unchecked remaining-only then unchecked fish 06; counter restored to 0/66. No game save operation or browser storage mutation via script. |
| Exact row language and area behavior | Separate fresh fish 06 handoff: clicked 日本語; stage=3 and exact species hash retained, target visibly scrolled ~274px, unchecked original state. Clicked Area 2; focus cleared to notebook-route-2, route group Area 2 expanded. |
| English desktop all six areas | 1200×900 actual area buttons visited 1/2/3/4/5/6. Area totals 7/13/16/23/28/16; notebook eligible-in-area totals 6/12/15/22/27/15, new route counts 6/10/11/17/11/11. Text distinguishes local availability from in-game page requirements. No horizontal overflow in inspected area states. |
| Native section and scope | Changed Area 2 Map section native selector; selected section updated. Explicit Area 3 selector changed to s3-c1-r1 and URL retained it. Current section scope narrowed list to five species and their section-local point counts, while Whole area restores full list. |
| Surface icon filtering | Clicked Bubbles in Area 2: zero matches, explanatory empty state and Clear mark filter action. Clicked Area 4 while filter active: six possible species displayed, 27 configured filtered points in chosen section. No percentage/catch guarantee claimed. Clear mark filter restored 23-species Area 4. |
| Zoom and shared pins | Actual Zoom in and Fit view clicks, no page overflow. Area 1 s1-c1-r6 shared pin `Iwana, Kawamasu · X 2, Y 134` opened distinct Details links. Clicked Kawamasu entry; profile ID09 Area1. Back returned area/section/scope. Narrow visual screenshot showed real terrain, portraits, and zoom controls; dense points require zoom as stated. |
| Japanese narrow mobile | 320×740 Area6 overview/list/notebook/symbols displayed without page overflow. Typed 3B, selected exact giant-eel suggestion, then clicked actual configured pin X41/Y8. Profile ID3B Area6, one-point retry explanation and postcard quest link visible. |
| Local-stock missing branch | Giant-eel Area6 profile starter recommends local Spinner¥20 for lure method. General 38-profile pair warns both pieces cannot be bought in selected area and directs to starter or sale areas. No local complete-pair claim. Natural new-game shop unlock remains unproved; this browser audit does not establish it. |
| Excluded species | Clicked actual Area3 `Zarigani (crayfish) — Details` link. ID46 says not one of 66 notebook species, still offers spots and compatible bait; no manual notebook action. |
| Unknown profile | Direct known profile ID43: says notebook status unconfirmed; advises do not buy setup, choose named fish with confirmed points, no bait/lure/fly body passes recorded check. No manual notebook action. |
| Partial starter completeness | Investigated ID46 Area3 sinker summary lacking complete-price total. Opened disclosure: rod¥250 and hook¥10 linked; sinker stock absent explicitly stated; use owned item or inspect sale areas, with direct alternate local float setup action. This resolves apparent ambiguity; not a verified UX defect. |
| Localized return | Area6 Japanese pin/profile switched to English, clicked Back to previous page; maps retained stage6, selected 3B, s6-c2-r1, nested return. |

## Visual evidence

Private screenshot: `(private, not published) r65-map-fish-manual-row.png` (TH390 exact species card showing collection grouping vs chosen fishing area).

## Findings / limits

No new significant reproducible UX blocker found in these tested Maps/Fish journeys. This is bounded runtime coverage, not proof of every fish, every section, or all page content. It does not prove catch probabilities, natural Area6 unlock, in-game notebook update paths, quest hand-in recipient/reward, or unknown profile43 availability. Existing claim qualification is useful because it changes concrete actions (skip excluded targets, retry actual configured spots, choose local starter, check game notebook before marking).

Representative EN/JA/TH and 1200/390/320 coverage is not an exhaustive viewport×language×73-profile cross product. Automated broad source/render guards belong to root’s combined audit. Temporary Chrome viewport override reset. Manual checkbox state restored to initial 0/66. Root IAB untouched.

## Latest user bait-default regression path

Actual EN selected-fish Maps06 Area2 “See this fish’s compatible tackle” click opened equipment URL with `fish=06`, `stage=2`, `category=bait`, `route=float`; native category selector explicitly showed `bait`. That equipment page’s “Open fish profile” link opened profile06; its All compatible tackle action is an in-page anchor to live bait/lure/fly groups, without a generic floats-first catalogue action. This supports the requested bait-first default on the tested map-to-equipment entry path; root separately owns public Aouo30 combobox regression evidence.
