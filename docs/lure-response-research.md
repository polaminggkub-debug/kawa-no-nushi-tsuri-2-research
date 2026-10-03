# Lure fight setup: new trace and correction

Source: the user-supplied original Japanese ROM, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`. Addresses below use the low LoROM bank aliases. This note concerns fight setup and state masks, not bite probability.

## What +1 actually does in the traced path

`03:D08C` loads the lure record, including the byte at +1 into `$1228`. In the lure-mode branch, `04:8D9C` checks `$0C14 == 2`; `04:8DA1` compares the lure's +2 field `$122A` to the fish ID `$11E8`. Equality calls `04:8F6F`, halving `$11FE`, and skips the lure's size-response switch. The rod's later size-response switch still runs.

On a nonmatch, `04:8DAF` loads `$1228` and dispatches through `04:8DC0..8E35`:

| Lure +1 | Raw size <= 15 | 15 < raw size <= 35 | Raw size > 35 |
| --- | --- | --- | --- |
| 0 | H | unchanged | G |
| 1 | unchanged | H | unchanged |
| 2 | G | unchanged | H |

Here **H(x) = floor(x / 2)** (`04:8F6F`), and **G(x) = (2*x + 1) & 63** (`04:8F77`). The latter is `SEC; ROL; AND #$003F`, not an ordinary left shift. The exact boundary values 15 and 35 belong to the left/middle columns respectively.

The raw size field `$1EB1` is copied from the selected world fish's `$7F:1E8A,X` entry at `04:8717..871B`. That entry is generated and grows in the fish population routines (`04:EC56..EC8B`, `03:83AA..83DF`). This trace does not establish a conversion into centimetres.

## Sequence matters

This is not an isolated multiplier on the lure. In `04:8C96..8EE4` the original routine:

1. Computes another size-dependent fight field `$1F61`.
2. Applies the rod +7 pre-transform at `04:8D2A..8D4B`.
3. Applies the mode-dependent hook/lure/fly transform.
4. Applies the rod +4/+7 size transform at `04:8E35..8EC1`.
5. Maps the resulting `$11FE` to `$1F65` at `04:8F83`.

Therefore assigning a lure an unconditional strength score from +1 is not justified. The same lure can produce a different starting mask with another rod or fish size.

## What consumes the result

`$11FE` is copied into `$1EC9` at `04:875D`, `04:879A`, `04:8804` and later fight transitions. The fight updates `$1EC9` with G at `04:9C35`; reaching 63 sets `$1ECF`, with an additional range condition setting `$1ECD`. `$1F65` is subtracted from a drawing coordinate at `04:A4CD..A4D3`. Periodic fight logic also uses `$1364`, incremented at `00:DE0D`, with several fish state masks (`04:9A34..9ABA`). These are concrete state/visual consumers. They do not establish a percent chance of biting or the overall best landing strategy.

## Reproducible branch execution

[trace_lure_fight_setup.py](../scripts/trace_lure_fight_setup.py) is a small, restricted instruction interpreter for the original ROM's 16-bit branch. It uses the supplied ROM's instructions, rejects unsupported opcodes/addresses, and stops at `04:8EC4` after the display-offset subroutine. It is **not** Snes9x and **does not simulate a complete catch**.

Example controlled inputs (fish ID06's profile +0A is 7):

```sh
python3 scripts/trace_lure_fight_setup.py --rom /path/to/your/original.sfc --rod-id 0D --lure-id 01 --fish-id 06 --size-raw 30 --base-mask 7
```

This produces starting mask 31: G at `04:8D45` changes 7 to 15, and G at `04:8EB5` changes 15 to 31. No lure size transform runs in the middle size band for response code 2.

## Corrections to the earlier publication

- The earlier +1 description incorrectly assigned the rod's double-transform pattern to lure response code 2. The table above is the actual lure branch.
- The earlier special-fish metadata said the hook's first field had to be 2. The branch actually checks **fishing mode `$0C14 == 2`**, meaning lure mode.
- “Shift left” alone omitted the inserted carry bit and the 63 mask.
- Lure acceptance is a **16-bit word at +6/+7**. The old catalogue displayed only the low byte, which hid masks such as `0x0400`. See [fish acceptance](fish-acceptance-research.md) and [coverage data](../data/lure-coverage.json).

To regenerate all 48 published boundary executions in [lure-response.json](../data/lure-response.json):

```sh
python3 scripts/extract_lure_response_grid.py --rom /path/to/your/original.sfc --output /tmp/lure-response.json
```

This fixes fish ID06 and its ROM starting mask, enumerates four lure rods, three lure IDs and the four numerical size boundaries. It does not reproduce a full fishing trial.
