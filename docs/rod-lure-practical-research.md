# What rods and lures change during play

This note translates the rod and lure records into player-facing effects using only the user-supplied original Japanese SFC ROM (1,572,864 bytes; SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`). It does not use external fishing guides. The localized card overlays are in [rod-lure-practical.json](../data/rod-lure-practical.json); the source traces remain in [rod-response-research.md](rod-response-research.md), [lure-response-research.md](lure-response-research.md), and [fish-acceptance-research.md](fish-acceptance-research.md).

## What a rod lets the player do

The aim loop at `04:D66B..D6EE` updates the selected target coordinates while the input is held. Releasing the cast input or reaching the rod's `+2` cutoff advances to the tile resolver at `04:D056`. This makes the cutoff useful as **time to move the target tile**, not a strength or catch-rate score. The records can be compared within each rod style; a longer window means more time to correct the target before the game checks the tile.

For casting and lure rod styles, setup at `04:D58C..D5B0` scales the `+2` cutoff by current HP below 100 and clamps it to a minimum of 10 internal counter units. At 100 HP or above it uses the full record value. This gives a direct player action: recovering to 100 HP restores the full aim window for these styles. Float/Ayu style uses its main cutoff directly; the fly path also creates a second half-value threshold whose separate practical effect has not been named.

The rod `+3` value becomes a fish-position threshold at `04:8721`. Its user-visible consequence is established by following the condition and the message dispatch:

1. At `04:9C35..9C5C`, the fight value at `$1EC9` advances and is checked against `63`.
2. Only when it reaches that value does the code compare fish position `$1ED5` with the selected rod threshold `$1ED7`.
3. If the fish is at or beyond the threshold, the game sets `$1ECD`; the fight cleanup at `01:82C0` takes that separate loss path.
4. The decoded original-ROM messages distinguish the visible result by fishing mode.

| Fishing mode | Loss-path text decoded from the ROM | Other escape text when this threshold path is not set |
| --- | --- | --- |
| 0/1 bait setups | With ordinary bait, the hook is stolen as the fish escapes (`00:0096`). Decoy Ayu uses its own escape text (`00:00B0`). | Ordinary bait can be stolen as the fish escapes (`00:009A`); Decoy Ayu uses `00:00A8`. |
| 2 lure | The lure is stolen as the fish escapes (`00:00A4`). | The fish escapes without the lure-theft line (`00:00A8`). |
| 3 fly | The fly is stolen as the fish escapes (`00:00A6`). | The fish escapes without the fly-theft line (`00:00A8`). |

Therefore a higher `+3` gives more fish-position room before **this particular tackle-loss branch**. It does not prevent every escape or prove a higher bite/catch rate. The ROM does not provide a meter conversion. This supports a practical comparison: among rods for the same style, prefer a higher threshold if avoiding this specific lost-hook/lure/fly result matters, and compare the `+2` aim window separately if target placement matters.

The strings above were decoded from message offsets `0096`, `009A`, `00A4`, `00A6`, `00A8`, and `00B0` with [render_rom_messages.py](../scripts/render_rom_messages.py). Dynamic fish-name and point-count glyphs remain ROM substitutions; the card does not guess their runtime values.

## What a lure can tell you before casting

For each exact lure ID, the existing fish portraits represent ROM fish profiles that pass that lure's fish-type mask check. This is a practical shortlist when the player already has a target fish: use a lure card that shows that fish. It is not an exclusive catch list. Position, periodic candidate selection, input, and fight/landing checks remain. The separate coverage trace is documented in [fish-acceptance-research.md](fish-acceptance-research.md).

Three lure IDs have a named-fish response branch in addition to their ordinary fish-type list:

| Lure ID | Named fish | Proven response setup |
| --- | --- | --- |
| `12` | Black bass (`0B`) | On an exact ID match in lure mode, halve the starting fight-response value and skip this lure's size-response branch. |
| `21` | Namazu (`26`) | Same branch. |
| `51` | Akame (`37`) | Same branch. |

The check is at `04:8D9C..8DB0`; the halving helper is `04:8F6F`. It skips only the lure's later size-based transform; the rod response still runs. The named-fish branch does not restrict the broader fish-mask list. Code alone does not establish that these matches improve bite rate, catch chance, or landing success, so the cards identify the branch without recommending it as a winning lure.

The lure action byte (`+0`, loaded at `03:D08C..D0D8` into `$1226`) is consumed during lure fishing at `04:916D`: it selects different input-response routines that inspect controller state and fish position and alter internal fight-state values. The same byte selects branches in fight animation/state handlers at `04:A62C` and `04:A7A6`, and selects lure graphics data at `00:996D`. This establishes that it changes how the lure fight is handled and drawn. The code trace does not yet identify these action patterns in player terms (such as twitch, sink, or retrieve), nor prove which one improves bites or landings. For now, the exact fish portraits and the named-fish setup branches are the card-level differences; no unsupported “dives deeper,” “moves faster,” or “attracts bigger fish” labels are assigned.

## Remaining limits

- The comparisons rank records within their ROM fishing style. They do not convert the aim timer to seconds or the fish-position threshold to meters.
- No matched, whole-fight experiments have established a universal best response code, rod, or lure.
- Lure action codes select input-response and drawing branches, but the routines have not yet been translated into named player techniques or verified advantages.
- A fish portrait on a lure card means the recorded fish-type check can pass; it does not promise that a bite, hook-up, or landing will happen.
- The named lure responses alter fight setup values, but their direction as a player advantage is not established.
- For those reasons the catalogue exposes the demonstrated use and risk, then leaves unsupported “best gear” conclusions out of the card.
