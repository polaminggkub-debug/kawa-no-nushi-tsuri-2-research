# Fish profile decision audit

Read-only audit of the current fish detail pages, their source data, and representative browser journeys. Findings are based on the ROM-derived publication data and the current UI; no external game guides were used. This audit does not change fish mechanics or claim that a configured compatibility check guarantees a bite or landing.

## Coverage

- 73 profile IDs are present in `catalogue/gallery-data.json` (`01`–`49` hex, with `43` an unresolved profile row).
- Ledger names follow the publication's current Latin/Japanese display-name fields; some Latin/Thai labels come from guide transcriptions and are not claimed as verified Thai-patch strings.
- 72 IDs have configured fishing locations: 66 notebook-eligible species plus six map-only species excluded from the 66 notebook slots. ID `43` has no confirmed location, species name, or matching bait/lure/fly candidate.
- Every configured profile location has map pins matching its point count; the static cross-check found no pin/point mismatches.
- Notebook route counts from the data are 6, 10, 11, 17, 11, 11 first-occurrence species by stage (66 total). Eligible species that also appear in each area are 6, 12, 15, 22, 27, 15; the additional counts are repeats, not fixed page targets. There is one excluded map-only species in each area.

## What currently helps a player act

The fish page puts “map first, gear second” at the top. It has an area selector, fish-marked map previews, exact configured point counts, and a linked map view. Empty-point guidance says to try another point or nearby water; single-point species get a stronger inactive-slot/movement caveat.

The equipment section lists bait/lure profile checks, explains that fly entries are body candidates only, and says the profile match does not guarantee a bite or landing. The starter panel selects a lowest-priced compatible offer stocked in the selected stage, shows the new-setup cost where calculable, tells players to keep suitable gear already owned, and offers another recorded sale area or item acquisition details when no local offer is recorded. It does not represent these choices as catch-rate winners.

Representative browser paths confirmed that fish 34 in Area 6 has no local lure stock but offers an owned-item action and a recorded Area 2 lure sale, and that following the sale then returning preserves the fish profile context. The Area 2 notebook guide identifies rainbow trout as a repeat there and offers fish/map/equipment actions. Its stage counts are correctly described as route/checklist counts rather than required per-page totals. The checklist is explicitly manual, shared in browser storage, and does not read or modify the game save.

## Confirmed player-facing gaps

### P1 — A fish profile does not say whether it advances the 66-species notebook goal

The map guide marks IDs `44`–`49` as present on the map but excluded from the 66 notebook species. The individual fish page does not show notebook eligibility, first-occurrence area, or repeat areas in its hero or first action panel. This distinction disappears when a player follows a detail link from the map to the fish page. The same gap affects eligible repeat profiles such as rainbow trout `06`: the map guide says it is repeated in Area 2, but the detail page does not carry that route context. A player trying to complete the notebook can therefore ask: **“If I catch this fish, will it count toward 66, and have I already covered this species?”**

The data already has the evidence needed to answer this at species level: `notebookCompletion.species[*].notebookEligible`, `firstOccurrenceStage`, and `stages`. The UI must not imply that the site can read a player's current save or that a repeat catch always moves a record. Keep the existing largest-size record rule and in-game verification direction; show only the species-level route status.

### P2 — The giant-eel profile drops the postcard objective context

Profile `3B` (giant eel / Oo-unagi) correctly shows its Area 6 point at `(41,8)`, a single configured point, compatible profile checks, and the possibility that the slot is inactive or the eel has moved. The received-postcard item data says its story messages include the doctor's giant-eel request. Once the player follows the card's fish link, the fish page reads like an ordinary target profile and does not remind them why they came here or point back to that request.

The player question is: **“I found the eel; what was I doing this for, and what do I do after catching it?”** The current evidence establishes the request and fishing target but does **not** establish whom to hand the eel to or what reward follows. Any profile cue should identify the request and make the unknown hand-in/reward explicit; it must not invent a delivery action.

## Correct limits and not-a-bug findings

- Per-area totals are not notebook page quotas. The ROM updater records one species slot and changes its area only when a larger raw-size record is stored. A later same-size or smaller catch does not establish a new notebook entry. The route list is therefore a way to cover all 66 eligible species once, while a player's six page counts can differ and move.
- The exact event trigger is not fully established for every result/species. The captured Yamame landing proves one landed-catch update path only. The map guide tells the player to land the fish, finish the result messages, and verify Tool 05 in-game before ticking its manual checklist.
- Profile `43` is handled appropriately: no speculative setup is recommended; it says the profile name/spawn is unresolved and provides no confirmed bait/lure/fly check.
- Fly compatibility is visibly scoped to a profile/body candidate, with hidden body/wing conditions and backup sets disclosed. Do not rewrite this as a guaranteed accepted fly rig.
- A compatibility candidate is not evidence of bite probability or landing success. Current copy says so in the compatibility section and sale/price rankings are framed as budget choices.

## Complete profile ledger

`F` = bait check for float fishing; `S` = bait check for sinker fishing; `L` = lure profile check; `Fly` = fly-body profile candidate only. “New N” is the first area on the full 1→6 checklist route, not a claim about the player's save. “Repeats” are other configured areas. Compatibility columns describe recorded profile checks, not guaranteed catches.

| ID | ROM/guide name | Configured areas | Notebook route status | Recorded method candidates |
|---|---|---:|---|---|
| 01 | Iwana | 1 | New 1 | F, L, Fly |
| 02 | Amemasu | 2 | New 2 | F, L, Fly |
| 03 | Yamame | 1 | New 1 | F, L, Fly |
| 04 | Amago | 1 | New 1 | F, L, Fly |
| 05 | Kajika | 3 | New 3 | F, S, L, Fly |
| 06 | Nijimasu | 1, 2, 3 | New 1; repeats 2, 3 | F, L, Fly |
| 07 | Himemasu | 2 | New 2 | F, L |
| 08 | Brown trout | 2, 3 | New 2; repeat 3 | F, L, Fly |
| 09 | Kawamasu | 1, 2 | New 1; repeat 2 | F, L, Fly |
| 0A | Wakasagi | 2, 4, 6 | New 2; repeats 4, 6 | F |
| 0B | Black bass | 2 | New 2 | F, L, Fly |
| 0C | Ugui | 3, 4, 5 | New 3; repeats 4, 5 | F, L, Fly |
| 0D | Koi | 4, 5, 6 | New 4; repeats 5, 6 | F, S, L |
| 0E | Donko | 2, 3 | New 2; repeat 3 | F, S, L, Fly |
| 0F | Oikawa | 3 | New 3 | F, L, Fly |
| 10 | Motsugo | 5 | New 5 | F, S |
| 11 | Itomoroko | 5 | New 5 | F, S, Fly |
| 12 | Gigi | 4 | New 4 | F, S, L, Fly |
| 13 | Sakuramasu | 2 | New 2 | F, L, Fly |
| 14 | Kokuren | 4 | New 4 | F, L |
| 15 | Hakuren | 4, 5 | New 4; repeat 5 | F |
| 16 | Mugitsuku | 5 | New 5 | F, Fly |
| 17 | Honmoroko | 4 | New 4 | F |
| 18 | Yamanokami | 3 | New 3 | F, S, L, Fly |
| 19 | Dojou | 5 | New 5 | F, S |
| 1A | Tamoroko | 4, 5 | New 4; repeat 5 | F |
| 1B | Kawamutsu | 3 | New 3 | F, Fly |
| 1C | Kinbuna | 5 | New 5 | F, S |
| 1D | Mabuna | 4, 5 | New 4; repeat 5 | F, S |
| 1E | Akaza | 1, 3 | New 1; repeat 3 | F, S, Fly |
| 1F | Medaka | 5 | New 5 | F |
| 20 | Bluegill | 2 | New 2 | F, L, Fly |
| 21 | Oyanirami | 5 | New 5 | F, L, Fly |
| 22 | Hariyo | 2 | New 2 | F, S, Fly |
| 23 | Tomiyo | 5 | New 5 | F, S |
| 24 | Raigyo | 4, 5 | New 4; repeat 5 | F, S, L |
| 25 | Herabuna | 4, 5 | New 4; repeat 5 | F, S |
| 26 | Namazu | 4, 5 | New 4; repeat 5 | F, S, L |
| 27 | Sayori | 6 | New 6 | F |
| 28 | Hasu | 3, 4 | New 3; repeat 4 | F, L |
| 29 | Wataka | 4, 5 | New 4; repeat 5 | F |
| 2A | Kamatsuka | 3, 4, 5 | New 3; repeats 4, 5 | F, S, Fly |
| 2B | Tsuchifuki | 5 | New 5 | F, S, Fly |
| 2C | Shimadojo | 3, 5 | New 3; repeat 5 | F, S |
| 2D | Kamuruchi | 4, 5 | New 4; repeat 5 | F, S, L |
| 2E | Higai | 4 | New 4 | F, S, Fly |
| 2F | Sougyo | 4 | New 4 | F |
| 30 | Aouo | 4 | New 4 | F, S, Fly |
| 31 | Nigoi | 3, 5, 6 | New 3; repeats 5, 6 | F, S, L, Fly |
| 32 | Megochi | 6 | New 6 | F |
| 33 | Maruta | 6 | New 6 | F, S, L |
| 34 | Haze | 6 | New 6 | F, S, L |
| 35 | Bora | 6 | New 6 | F |
| 36 | Suzuki | 6 | New 6 | F, L |
| 37 | Akame | 6 | New 6 | F, L |
| 38 | Ayu | 3, 4 | New 3; repeat 4 | F, Fly |
| 39 | Tanago | 4, 5 | New 4; repeat 5 | F |
| 3A | Unagi | 4, 5, 6 | New 4; repeats 5, 6 | F, S, L |
| 3B | Oo-unagi | 6 | New 6 | F, S, L |
| 3C | Aburahaya | 2 | New 2 | F, L, Fly |
| 3D | Kurodai | 6 | New 6 | F, L |
| 3E | Numagarei | 6 | New 6 | F, S |
| 3F | Kusafugu | 6 | New 6 | F, L |
| 40 | Tougyo | 5 | New 5 | F, Fly |
| 41 | Tenagaebi | 5 | New 5 | F, S |
| 42 | Satsukimasu | 3, 5 | New 3; repeat 5 | F, L, Fly |
| 43 | Unresolved ROM glyph `<0C>` | — | Unconfirmed profile; no confirmed location | — |
| 44 | Imori | 1 | Excluded from notebook | F, Fly |
| 45 | Kaeru | 2 | Excluded from notebook | F, L, Fly |
| 46 | Zarigani (crayfish) | 3 | Excluded from notebook | F, S |
| 47 | Kame | 4 | Excluded from notebook | F, L |
| 48 | Suppon | 5 | Excluded from notebook | F, L |
| 49 | Kani | 6 | Excluded from notebook | F |

## Source touchpoints

- Profile page structure and ordering: `src/pages/fish/render.js`; map points and single-point advice: `src/pages/fish/maps.js`.
- Profile-to-tackle checks: `src/pages/fish/tackle.js`; local starters and no-stock actions: `src/pages/fish/shopping.js` and `src/pages/fish/fishing-setup.js`.
- Notebook completion metadata: `catalogue/gallery-data.json`; map-level excluded marker: `src/pages/maps/notebook-status.js`; route, repeat and count explanations: `src/pages/maps/notebook-guide.js`; manual-only progress behavior: `src/pages/maps/notebook-progress.js`.
- Giant-eel request wording and claim limit: postcard entry in `catalogue/gallery-data.json`; current item-card next-action: `src/pages/equipment/quest-next-actions.js`.
- Notebook updater scope and capture limit: `docs/notebook-completion-research.md`.
