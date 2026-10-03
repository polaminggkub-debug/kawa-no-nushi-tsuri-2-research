# Rod response and performance research

This note analyzes the original Japanese SFC dump (SHA-1 c2103dd94e2a1a65a495fc02adc2e7d040f31212, 1,572,864 bytes). It separates code-proven effects from claims that still need controlled fishing runs. The ROM is read only and is not included.

## What the rod numbers do

The 21 rod rows begin at file offset 0x02A7F5 (CPU 05:A7F5), with 12 bytes per row. The pointer is at 05:800A. Routine 83:D11F loads row fields into working memory. These values are internal parameters, not ratings printed on the rod menu.

| Row byte | Directly traced behavior | Direction established by code |
| --- | --- | --- |
| +2 | Supplies the hold-time cutoff 7E:1F71 for the fishing input/aim step; counter 7E:1F6F sets state flag 7E:1F73 when it reaches the cutoff. Releasing the action button also sets that flag. Style 1 uses raw. Styles 2 and 4 scale against current HP at 7E:0862 when HP < 100, with a floor of 10. Style 8 also stores a second threshold equal to raw >> 1. | A higher value allows the held-input/aim step to continue longer before automatic advance. This is not evidence of a stronger rod or improved catch outcome. |
| +3 | Multiplied by 0x0150 (336) and stored as 7E:1ED7; fish position is 7E:1ED5. When fight value 7E:1EC9 reaches 63 and fish position is at least the rod threshold, code sets 7E:1ECD=1 and 7E:16AA=0x1A. | A larger value raises the position boundary, so a fixed fish-position value does not meet this branch as soon. Units are unknown. |
| +4 | Compared for equality with active fish ID 7E:11E8. A match skips the later response-code/size transform. | A fish-ID branch value, not a general fish-size rating. The branch alone does not prove exclusivity or a catch bonus. |
| +7 | Selects transformations of 7E:11FE before and during fight setup. The transformed value is copied to 7E:1EC9, which evolves during the fight. | No consistent good/bad direction has been demonstrated for codes 0, 1, and 2. Treat them as behavior selectors, not a strength scale. |

### Hold-time cutoff (+2)

The threshold is initialized at 84:D58C (file 0x02558C). For styles 2 and 4, the routine reads current HP at 7E:0862. Below 100 HP, it multiplies the rod field by HP, divides by 100, then applies a floor of 10. At HP 100 or above, it uses the raw value. Thus a lure rod with raw cutoff 120 has an internal threshold of 60 at 50 HP and 10 at 1 HP; at 100 HP it is 120. Style 1 does not use this HP scaling. Style 8 uses the raw value and also stores half in 7E:1FA3.

The relevant control routine is 84:D66B (file 0x02566B). It processes directional input by changing target coordinates in 7E:0508/7E:050A. While controller mask 7E:1348 bit 0x8000 remains held, the routine increments 7E:1F6F and compares it with 7E:1F71 at 84:D6EE (file 0x0256EE). Releasing that button sets 7E:1F73 immediately at 84:D6E0; reaching the cutoff also sets it. The 84:BF61 dispatcher then calls 84:D056 to resolve the selected world tile. It checks the result at 7E:1322: zero sends control to 84:D17B, which resets input state and sets phase 7E:1F6D to 1; nonzero sends control to 84:C01D, which sets phase 7E:1F6D to 3 and a mode-specific text code. This call flow strongly identifies +2 as a cast/aim hold-time cutoff, not a fight-strength rating. A higher value leaves more time before automatic advance; this subtask did not capture the corresponding on-screen action or measure cast distance/catch rate, so +2 is not a performance ranking.

This interpretation comes from the button-release test, threshold check, coordinate edits, and subsequent tile-resolution/phase dispatch. D66B itself does not read active fish ID 7E:11E8; the fish-ID-specific +4 equality branch at 84:8E35 is separate from this input cutoff. The player's menu does not name this internal timer. This is a static phase identification; there was no controlled in-game visual capture here.

### Reach boundary (+3)

At 84:8721 (file 0x020721), the loaded multiplier is multiplied by 336 and stored as 7E:1ED7. When 7E:1EC9 reaches 63, the routine at 84:9C35 (file 0x021C35) compares fish position 7E:1ED5 with this threshold. If position is at or beyond it, the game sets 7E:1ECD and event value 7E:16AA=0x1A.

The 63 transition first sets 7E:1ECF, which changes later fight state; that flag alone is not shown to mean failure. Only the additional range comparison sets 7E:1ECD. Downstream consumers take a separate response path when 1ECD is set. In lure and fly modes, one later cleanup path removes the equipped lure or fly components from inventory and clears the active fish entry. That is consistent with losing fish or tackle, but this code trace has not captured the corresponding player-facing message. The robust conclusion is that higher +3 delays this exact threshold event for a fixed 1ED5; it is not a measured universal catch-rate increase.

### Fish match (+4) and fight-response selector (+7)

The comparison is at 84:8E35 (file 0x020E35): 7E:127C == 7E:11E8 jumps past the later +7-by-size block. An earlier +7 adjustment at 84:8D2A (file 0x020D2A) has already happened and is not skipped.

The earlier adjustment to 7E:11FE is:

| +7 code | Before size handling |
| ---: | --- |
| 0 | Logical shift right: floor(x / 2) |
| 1 | Leave x unchanged |
| 2 | F(x) = (2x + 1) & 0x3F |

If +4 does not match the active fish, another transform is selected by 7E:1EB1, the fish-size value used by this code. F means one call to routine 84:8F77 (ROL, then mask to six bits).

| 1EB1 bucket | Code 0 | Code 1 | Code 2 |
| --- | ---: | ---: | ---: |
| 0–15 | 0 calls to F | 1 | 2 |
| 16–35 | 1 | 0 | 1 |
| 36 or more | 2 | 1 | 0 |

If +4 matches, this table is skipped. The earlier adjustment still applies. The common path then runs 84:8F83, which maps selected 11FE values to 1F65; that result is used as a render offset in scene setup. Separately, the transformed 11FE seeds 1EC9, which evolves during the fight. These are real code effects, but the traces do not show that one selector is universally easier or more successful.

The nonzero +4 values and corresponding species labels are:

| Rod ID | Fish ID | Species label | Style |
| ---: | ---: | --- | --- |
| 01 | 39 | タナゴ | Float/Ayu |
| 02 | 01 | イワナ | Float/Ayu |
| 05 | 03 | ヤマメ | Float/Ayu |
| 06 | 1D | マブナ | Float/Ayu |
| 07, 14 | 38 | アユ | Float/Ayu |
| 08 | 0D | コイ | Float/Ayu |
| 09, 15 | 25 | ヘラブナ | Float/Ayu |
| 0D | 26 | ナマズ | Lure |
| 10 | 37 | アカメ | Casting |

The equality comparison and numeric IDs come from rod records and code in the ROM. Japanese labels and profile offsets come from the same ROM's decoded profile records in `publication/data/lure-coverage.json` (`fish[]`). For example, fish ID `1D` is `マブナ` at profile offset `0x02829C`; `キンブナ` is ID `1C`, not `1D`.

## Rods that lead on traced fields

These rods have the largest known +2 hold-time cutoff and/or +3 reach value inside a style. They are not a tested “best gear” ranking: a longer hold-time window is not proven to improve the cast or catch, response-code direction is unresolved, and two rod bytes remain unexplained.

| Style | Rods leading on listed internal fields | Highest raw +2 hold-time cutoff | Highest traced reach | Fish-match branch | Reading |
| --- | --- | ---: | ---: | --- | --- |
| Float/Ayu | Ayu carbon rod 14 | 80 | 15 × 336 = 5,040 | アユ (38) | Highest raw hold-time cutoff in this style; the aim step can stay active longer before automatic advance. |
| Float/Ayu | Carp rod 08 or Hera carbon rod 15 | 40 / 60 | 24 × 336 = 8,064 | コイ (0D) / ヘラブナ (25) | Both have the style's highest reach; they trade hold-time cutoff and target fish-ID branch. |
| Casting | Two-handed casting rod 10 | 120 | 24 × 336 = 8,064 | アカメ (37) | Highest raw +2 and +3 within casting. +2 means a longer hold-time window, not proven better performance. |
| Lure | Heavy-fish lure rod 0D | 120 | 24 × 336 = 8,064 | ナマズ (26) | Highest raw +2 and +3 within lure. Below 100 HP, its hold-time threshold scales down. |
| Fly | Large fly rod 13 | 70 (secondary threshold 35) | 21 × 336 = 7,056 | None (00) | Highest raw +2 and +3 within fly; this style has a separate half-threshold handler. |

For an Ayu target, rod 14 has a longer raw hold-time cutoff and higher +3 than rod 07; both match ID 38 and use response code 1. That means the aim step can stay active longer on rod 14, but no better cast or catch result has been established. For long reach in the same style, rods 08 and 15 lead, with different hold-time cutoff and fish-ID branches.

## Limits and evidence status

- Raw table bytes and offsets are reproducible with scripts/extract_rod_response.py and the exact original ROM hash above.
- The hold-time cutoff, range boundary, equality branch, and selector transformations are static deductions from original ROM code.
- This subtask did not run matched combat trials across rods. It does not claim that response code 2 is stronger than code 1, that the cutoff is literally “strength,” or that the largest cutoff alone wins.
- No unit conversion is known for the internal range values.
- Species names are ROM-decoded profile labels; the rod record's numeric IDs and equality compare are separate direct code evidence.

Rebuild the derived JSON with (the fish index defaults to the ROM-decoded `publication/data/lure-coverage.json`):

    python3 scripts/extract_rod_response.py --rom /path/to/original.sfc --output data/rod-response.json
