# Water-icon creation, growth and rebuilding

Source: supplied original Japanese ROM, 1,572,864 bytes, SHA-1
`c2103dd94e2a1a65a495fc02adc2e7d040f31212`. Static code and controlled runtime
probes are separated below. No external guide or per-cast probability is used.

## What the player should do

Use a water mark to narrow the map candidates, not identify a species. For
ordinary fish the mark uses size **when the object is built**: below 50 cm is
small; 50 cm or more is large. Bubble profiles override that size test.

The map filter keeps all size-range candidates, but distinguishes those whose
initialized size can produce the mark from those that require growth and a
later rebuild. The latter are conditional candidates, not a promise that the
fish starts with that mark. Growth alone does not update the cached mark.

Eight profiles have an initialized maximum below 50 cm and a cap of at least
50 cm: `01`, `06`, `08`, `09`, `0B`, `31`, `33`, `42`. Their large-mark entries
require the later-growth/rebuild condition. A cap alone does not prove how
frequently an ordinary player sees that large mark.

## Valid entry and code paths

The valid rebuild entry is `04:C1F8`, which stores view coordinates and falls
through to the builder at `04:C204`. Earlier investigation labels `04:C200`
and `04:C260` were interior byte offsets, **not routine entries**: C200 is the
last operand byte of `LDA $0202` at C1FE; C260 is the operand of `STZ $0C` at
C25F. Searching only for calls to those interior bytes misses the caller.

The builder clears cached object arrays and scans configured rows. The
ordinary-row path at `04:C334` skips a zero-size row, checks coordinates, and
calls `04:C369`. That routine reads the current `$7F:1E8A,X` size and profile
bubble bit before storing the small, large or bubble selector in
`$7F:0226,X` and renderer class in `$7F:0242,X`.

| Path | Gate and consequence |
| --- | --- |
| Field setup: main state 3 → `00:8079` → `04:BDA0` → `04:BE20` → `04:C1A3` | View-distance guard may call C1F8. Map change resets saved origin fields so the guard can request a rebuild. |
| Active field: main state 4 → `00:827E` → `04:BEAF` → `04:BF2A` → `04:C1AC` | Requires `$1F6D == 1` and new primary-controller bit `$134A & $8000`; a view-origin difference of at least 6 horizontally or 5 vertically requests coordinate refresh and rebuilding. |

The primary-controller edge calculation at `00:DDE7..DE04` reads `$4218`
and stores `(new XOR previous) AND new` in `$134A`. This is an input edge,
not continuous holding. Static tracing does not assign a player-facing action
name such as “cast” to this branch or prove rebuilding on every input.

Growth routines write the row size without writing these cached mark fields.
The renderer and direction animation at `00:D273..D3B2` use the cached
selector/class, not a fresh size classification each frame. A later rebuild
reads the then-current size; that is different from a live update by growth.

## Controlled runtime probes

A private Snes9x probe used configured map-set 01 row 180, profile `03`, at
`(8,189)`. From an existing cast-message state, dismissing with A followed by
neutral frames populated the same object slot at neutral frame 13:

| Row size before fresh build | Cached selector / class |
| --- | --- |
| 25, unchanged control | `001E` / `006A`, small |
| 60, controlled WRAM write | `021E` / `006C`, large |

Changing the already-created size row to 60 and opening/toggling the tested B
water-view overlay left the cached mark small. Direction animation could
change the small class from 006A to 006B without changing its size family.

**Profile 03 has cap 35; 60 is an unreachable counterfactual.** These probes
verify the generic fresh-build threshold and persistence of one existing
cache, not natural profile-03 growth, normal refresh after growth, or odds.
Neither emulator states, the ROM nor the core are included in publication.

A corrected follow-up uses map-set 01 row 145, profile `01` Iwana, at
`(6,149)`. Its actual ROM cap is 55. Starting from the same controller-reached
walking state, the normal Fishing-command entry sequence builds the row in
slot 7 as small (`001E` / `006A`) at its existing size 21. A controlled
within-cap write to 50 followed by the identical input sequence builds that
same row as large (`021E` / `006C`). This establishes the threshold on a real
growth-capable row, but the size-50 branch remains a WRAM fixture: it does not
establish natural growth or its frequency.

Ordinary walking also moved the view origin by 20 vertically, beyond the
static refresh threshold. The tested inputs did not establish a controller-only
sequence that naturally grows a row across 50 and refreshes its cached mark.

## Reproduction and limits

[The ROM extractor](../scripts/derive_water_icons.py) records byte hashes for
C1A3..C288, BE20..BE32, BF2A..BF38 and DDE7..DE04, along with the existing
classification/growth fingerprints. Its `initialClasses` derive only from the
initialized size range; `growthOnlyClasses` preserve the remaining conditional
entries in `possibleClasses`. [Extracted data](../data/rom-water-icons.json)
retains all profile sizes, map placements and the full possibility union.

Still unproved: the frequency of ordinary-play large marks for those eight
profiles, a natural growth-and-rebuild transition in one persistent row, and
a universal rebuild on every cast. These remain research questions; the UI
does not present the conditional large entries as initial appearances.
