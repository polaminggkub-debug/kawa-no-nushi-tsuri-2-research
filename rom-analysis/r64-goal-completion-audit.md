# R64 whole-site usefulness and completion audit

## Audit result

The current site has a substantial player-facing layer: it makes purchase,
setup, location, collection, and recovery decisions visible, while retaining
ROM evidence behind the relevant summaries. The strongest recent handoff gap
is fixed in the local draft: a fish profile can open that exact fish in the
manual notebook checklist, and the focused row says which route group it is
filed under and which fishing area remains selected.

I did not verify a high-impact unresolved UX defect in the bounded paths
rechecked here. That is **not** a whole-site completion finding. The existing
owner audit explicitly keeps the goal active, and the evidence below still
does not amount to a fresh, exhaustive interaction audit across every page,
locale, viewport, and navigation state. The R64 changes are present in the
local working tree; this audit does not establish publication of them.

## What “useful” requires

The user’s goal can be assessed against these outcomes:

1. A player can turn displayed information into a decision or next action:
   choose, keep, buy, find, equip, use, recover, check, or deliberately skip.
2. Decisions use the selected fish, fishing method, area, stock, and price when
   those facts affect the answer. Compatible, stocked, cheapest, and
   catch-effective are different claims and must not be conflated.
3. Links are real controls with a clear destination. Relevant filters, locale,
   and a safe return route survive navigation; a destination that needs a
   second control should make that next control obvious.
4. Main copy leads with the player answer. Bytes, offsets, selectors,
   methodology, and unresolved mechanics remain available as evidence without
   masquerading as player advice.
5. The ROM-derived record remains intact, including cases that cannot yet be
   turned into a confident gameplay recommendation. Unknowns must be stated at
   the point where they limit a decision.
6. The experience remains readable on small screens and in Thai, English, and
   Japanese. A renderer check is evidence of localized content, not proof that
   every live interaction was clicked.

## Coverage and strength of evidence

| Surface | What the current project provides | Evidence and limit |
| --- | --- | --- |
| Equipment catalogue and item detail | 315 item records; search, category/method filters, fish-target selection, comparisons, item decisions, stock/seller links, and technical evidence. Per-item decisions exist for the 21 rods and 157 hook/float/fly-part entries; equipment and bait/lure/fly pages have target-aware choices. | The owner audit records full-record, three-locale render/link assertions. Representative browser paths confirm the rendered choices. Those assertions do not constitute 315 manual clicks or proof of every real shop/story access path. |
| Fish profiles | 73 profiles, including 72 mapped profiles; selected-area methods and starter choices, local purchase choices, recovery context, map links, and notebook status. | Owner audit reports 103 confirmed fish/area pairs and localized render checks. Location entries do not guarantee an active fish or a naturally completed route. Profile 43 remains an explicitly unconfirmed case. |
| Maps and notebook | Area-filtered map points and symbol filters; 66 unique eligible notebook species in a first-occurrence checklist route, with excluded and unconfirmed records kept distinct. A manual mark is clearly separate from the game save. | Project data distinguishes route additions (6/10/11/17/11/11) from each area’s available journal pages, avoiding the false claim that area totals sum to the 66 unique slots. Browser checks cover selected filters, checklist persistence, and return behavior, not every coordinate or playthrough state. |
| Shops and acquisition | Area-specific seller and stock records, prices, target filters, seller/location actions, and paired outdoor/town evidence. | Local browser confirms item 04 opens Area 1’s filtered seller page with the selected stock and price; an explicit action opens the seller/entrance map. This verifies a reference route, not that the user’s live game can reach or buy there in every story state. Area 6 normal-shop traversal remains unverified in the owner audit. |
| Strategy and technical research | Player-facing recommendations and search alongside expandable source evidence. Raw values and unresolved branches can remain available without being the main decision. | Localized source/search and selected click flows have checks. Current fish-specific fight branches and many bite/landing outcomes remain honestly unresolved; that limits claims, not the usefulness of a clearly labeled evidence record. |
| Locale and screen size | EN/TH/JA page variants and localized action copy; recent release notes record desktop/mobile checks on representative flows. | These are spot checks and localized render checks. No evidence here proves every combination of page × locale × device size has been manually reviewed. |

The project’s `docs/player-usefulness-audit.md` has a useful release history,
concrete checks, and a visible “active, not completion-certified” boundary.
Its earlier open items still matter: review remaining page states for
contradictions/dead ends, verify the Area 6 seller traversal before describing
it as a reachable route, and continue ROM work only where it can change a
player decision. The existing notebook and shop reports also correctly
separate static coordinates from controlled movement through the game.

## Current browser checks

### Fish profile to checklist row

I repeated the local Thai flow for fish `06` with Area 3 selected, then opened
the matching row in the full notebook route. The map remained on Area 3 while
the unique checklist row appeared in the Area 1 first-occurrence group. The
current rendered row now visibly says “จัดไว้ในด่าน 1 เพื่อไม่นับซ้ำ · จุดตกที่
เลือก: ด่าน 3” directly above its profile/map actions and manual checkbox.
That resolves the earlier context loss when scrolling hid both area headings.
The checklist remains manual; its link does not mark a fish or read the game
save.

### Item to seller to location

For rod `04`, the item page presents Area 1 as a recorded offer at ¥500 and
links to the seller page with stage, item, and return context. The filtered
shop page shows the selected item and price, says it is stocked in the chosen
area, and offers separate controls for the exact seller/entrance map and the
filtered stock. The map disclosure is initially closed, so opening the map
takes one additional click. This is a small navigation cost, not a broken or
misleading path: the first destination answers “is it sold here?” and the
location action is explicit. It is not strong enough to hold up the usefulness
goal by itself.

## Important boundary: unknown mechanics

The site must not manufacture a “best bait,” catch-rate ranking, universal
rod, or guaranteed route from compatibility, price, internal reach values, or
fish-specific code branches alone. The owner audit already keeps unresolved
bite/landing comparisons, fight response selectors, inactive spawn timing,
natural quest prerequisites, and unwalked terrain/shop access separate from
confirmed decisions. Continue research when a controlled ROM experiment or
code trace can answer the player’s next question; otherwise keep the limitation
beside the claim and in evidence. The previously deferred net/magnifier
mechanics are out of scope for this completion audit and should not be marked
as newly researched here.

## What remains before calling the whole goal complete

- Complete a requirement-based visual and interaction pass over the remaining
  catalogue, item, fish, map, shop, and research states. Include the controls a
  player is likely to use, their destination, and the back/language/filter
  state after return; record coverage rather than inferring it from link counts.
- Repeat meaningful page-family flows in EN, TH, and JA on desktop and mobile.
  Prior spot checks and source localization checks should remain labeled as
  such.
- Keep the Area 6 normal-shop route and any other unverified game-world access
  path explicitly described as unverified until a controlled traversal proves
  it. Do not let a correct map coordinate imply a reachable shop or active fish.
- Check the published deployment after the current local draft is released.
  A local rebuild or passing source checks does not prove the public URL serves
  the same revision.
- Keep a short, prioritized list of research unknowns that actually change
  player choices. Do not add more raw fields merely to make the catalogue look
  more complete.

### Decision

The sampled player journeys are useful and honest, and the latest checklist
handoff now preserves the context a player needs to mark the right species.
No user clarification is needed for the remaining audit work. Keep the project
status **active** until the broader interaction/localization/deployment pass is
recorded; do not call this audit or the current local draft a whole-site signoff.
