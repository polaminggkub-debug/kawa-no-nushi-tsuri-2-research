# Tub and canoe movement compared in the original ROM

ROM SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`. This follows the movement consumers beyond the selected-use routines documented in [general-tool-actions-research.md](general-tool-actions-research.md).

`00:A5F2` (tub) and `00:A7BB` (canoe) both call `00:925A` with the current field terrain value `0844`. For value `0D`, that routine sets current contribution `3E=0` and direction `4C=0`. In that branch the tub sets movement state `0516=0F`; the canoe sets `0516=10`. Thus this comparison specifically concerns the no-current branch, not every terrain class.

`00:A94B..A962` routes movement states `0E..12` to `00:A98E`. That routine indexes a 16-byte repeating schedule at `00:AA74`: states `0E,0F,10,11,12` select offsets `20,30,40,50,60`. Zero makes no position update, one calls `00:B696` once, and two calls it twice. `00:B696` increments/decrements the actor's pixel coordinate by one toward its tile destination. The five schedules total **8, 10, 14, 20, 28** position updates per 16 schedule entries.

In the no-current branch this is **canoe 14 versus tub 10**, a 40% increase in position updates per equal schedule cycle, while the actor is still travelling toward its destination. This is a movement result, not a fishing bonus or a claim about overall trip times including turns, obstacles or shore actions.

The current-sensitive selectors differ: the canoe uses state `10` in both alignment branches for current result 1, whereas the tub chooses `10` or `0E`; other results select further states. Therefore no global “40% faster everywhere” statement is justified. Tub eligibility additionally checks terrain field `084C >= 1` in `00:A6C5..A6DC`; the canoe's corresponding `00:A7A0..A7AF` path has no such comparison. This field is not assigned a depth name without further mapping.

The old statement that boat speed had not been traced is superseded by this specific comparison. Both boat cards now state the actionable no-current advantage and preserve the scope.

> **Audit 2026-10-07:** rowing the tub or canoe costs 1 HP per tile and swimming costs 1 HP per 32 frames; walking is free. The canoe 14-step versus tub 10-step schedule was confirmed. The canoe maker refuses the milk trade when you already own a canoe.

## Tested owned-canoe placement and boarding (2026-10-05)

The bounded controller replay in [canoe-boarding.json](../data/canoe-boarding.json) starts from a fresh-game walking route: leave the Area 1 house at `(8,183)` and hold Left for 64 frames to reach `(4,183)`. That approach has no coordinate, terrain, inventory or story writes. For the use experiment only, one initial write puts Canoe `02 00` in the empty general-tool slot `7E:0B5E`. This isolates **already-owned canoe use**, and does not establish ordinary-play acquisition.

Ordinary tools-menu inputs select Canoe and display `カヌーを水に浮かべた。`. Dismiss the message with A, then tap Left. After 120 neutral frames, the watched fields are Area 1, position `(3,187)`, canoe travel mode `7E:0858=4`, and Canoe `02` still present in `7E:0B5E`. No writes follow the initial owned-item setup. A separate coordinating-agent replay reproduced the message, travel mode and retained item.

The player instruction is conditional: **if you already own a canoe**, use this tested launch tile and Left-to-board sequence. Other shore tiles and ordinary acquisition are outside this replay. The milk exchange described in [quest-tool-use-research.md](quest-tool-use-research.md) has separate code evidence.

The [original-game capture after boarding](../catalogue/frames/canoe-board-area1.png) is byte-copied from the independent replay. The public JSON records the original ROM/core identities, setup boundary, controller sequence, map position, screenshot fingerprint and result-state fingerprint. Private ROMs, emulator binaries and save states are excluded from publication.
