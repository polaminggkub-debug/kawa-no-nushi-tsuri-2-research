# Water-surface marks: what the player can infer

Source: owner-supplied original Japanese ROM, SHA-1 `c2103dd94e2a1a65a495fc02adc2e7d040f31212`. No guide-derived species or probability claims.

## Player decisions

| Original game mark | Meaning at fish-object creation | What to do |
| --- | --- | --- |
| Small fish shadow | Ordinary species, size below 50 cm | Choose this if looking for a smaller fish; the shadow alone does not identify the species. |
| Large fish shadow | Ordinary species, size at least 50 cm | Prefer this when looking for a larger fish. It does not prove a rare species or a landing advantage. |
| Bubble/ring | Certain species override the size test | Do not infer size. These species share the potato-bait compatibility bit; inspect bait 11 with the float route for the selected fish. Acceptance does not guarantee a bite. |

**The mark is cached when the object is created.** Growth changes the size row without refreshing the mark selector. Thus a small shadow is not a promise that the eventual caught fish remains below 50 cm. The separate caught-size path reads the current row value.

Bubble profiles: `0D` Koi, `0F` Oikawa, `15` Hakuren, `1C` Kinbuna, `25` Herabuna, `29` Wataka, `2F` Sogyo, `3D` Kurodai, `47` turtle. This lists game profiles, including the turtle entry. Float and sinker acceptance have separate method conditions; do not generalize float compatibility to every method.

The class decision does not read map identity. Different maps contain different species/rows and retained sizes; this changes the marks available, not the threshold rule. The website's portrait pins show species from configured spawn rows, not the in-game shadow art.

## Does the icon itself change gameplay?

The traced icon selector is used by rendering and direction animation. The actual fish size, rather than the graphic class, enters equipment-dependent opening fight calculations. For example, `04:8DAF..8E35` uses size bands ≤15, 16–35 and >35 for a lure response transform, copied to fight state `$1EC9` via `04:875D/879A/8804`. Fish-ID and equipment conditions can select other branches. This does **not** establish that a larger mark increases bite odds, or a universal harder/easier landing rule. The 50 cm graphical cutoff is not the same as those fight cutoffs.

## Why there is no percentage per cast

New size is `B + (R % B)`, where `B = floor(profile[0] / 2)`. `$00:DA96` calls the stateful generator `$00:EEFA`. Existing nonzero rows grow by one, remain through profile[1], and reset beyond it. Casting does not independently redraw a uniform size for each fish. Generator cycle counts, if reported in extracted data, are technical enumeration of generator states, **not** measured per-cast odds or a stationary gameplay probability. No fixed species percentage is asserted here.

## Code evidence

- Profiles: CPU `05:8018`, file `0x028018`, 23 bytes each; 73 profiles.
- Marker choice: `04:C369..C3D4`. Profile word at +15/+16 is loaded to `$1208`. Bit `0x0100` takes the special path first (`selector 001E`, class `007A`). Otherwise row `$7F:1E8A` is compared with `0x0032`: below uses selector `001E`, class `006A`; at least uses selector `021E`, class `006C`.
- Rendering: `00:D273..D2E4`; direction/animation `00:D2E5..D3B2`. Small and large variants use related class values `006B` and `006E`; special `007A` can become `007B`. These are visual direction/animation variants.
- Selector stores: spawn `04:C39D/C3B4/C3C4` and visual animation `00:D2FC..D3A4`. Growth routines update the size row, not these selectors. We do not promise a live size refresh.
- Initialization/growth: `03:83AA..83DF`, `04:EC56..EC8B`; caught growth also `01:9352..9373`.
- Catch: `04:8717..871B` copies current row size to `$1EB1`.
- Kept fish: `01:8AD5..8ADA` copies `$1EB1` to `$0BB6,X` without scaling. `02:AA5F..AA67` sends that number to the decimal formatter. Controlled keepnet displays of 15, 30, 35 and 36 showed the same values with the game's `cm` label. These display probes were fixtures, not naturally caught fish.
- Potato bait 11: CPU `05:9F27`, record +6 mask `0x0100`; this matches the special marker bit. Other method and equipment checks still apply.

## Image provenance and reproduction

[Image manifest](../data/water-icon-images.json) records SHA-256 hashes and native 24×24 crop coordinates. These are original rendered game pixels from controlled fish-object fixtures with injected selector/class and coordinates. They were not redrawn or recolored. The fixture establishes the appearance of each class; it does not establish natural spawn frequency. The river background is retained.

[Extracted profile/map data](../data/rom-water-icons.json) and [extractor](../scripts/derive_water_icons.py) preserve the per-profile possible classes and map placements. Run the extractor with an independently supplied matching ROM; no ROM or runtime state is distributed.

Unresolved: empirical frequency during ordinary play, and whether another object rebuilding event can change the cached mark before capture. No gameplay advantage is attributed to the visual class itself.

Original full-frame fixtures: [small](../catalogue/images/water-icons/water-small-frame.png), [large](../catalogue/images/water-icons/water-large-frame.png), [bubble](../catalogue/images/water-icons/water-bubble-frame.png). The mark is near the lower-left river edge; crop coordinates are in the manifest.
