# Area 1 Caddis and Terrestrial maker positions

## What to do in the game

At the Area 1 fly maker, choose **Caddis (`カディス`)** or **Terrestrial (`テレストリアル`)**. Each part menu starts at the top-left cursor. The item detail page shows its original cursor frame and the exact Right/Down/A path. These positions identify components; they do not establish which assembly catches more fish.

- Caddis has **14 selectable bodies, 15 wings and 3 tails**. To omit the wing, start at top left and press **Right 3 → Down 3 → A**. To omit the tail, press **Down 3 → A**.
- Terrestrial has **16 selectable bodies**. Confirming the body goes directly to the quote: there is no wing or tail choice in this tested menu. Check the displayed price before paying.
- Two apparent empty Caddis body positions are not extra items: row 3/column 4 clamps to row 3/column 3 (`3F`), and row 4/column 4 clamps to row 4/column 3 (`40`).

This adds 48 real component positions plus two distinct None choices to the existing [40 Mayfly component positions](fly-maker-body-tail-palette-research.md). The positions of Diptera and Stonefly components have not been verified here. No unverified position is assigned to those entries.

## Controller replay and identity

Source ROM SHA-1: `c2103dd94e2a1a65a495fc02adc2e7d040f31212`; SHA-256: `e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49`.

The private Snes9x core SHA-256 was `8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6`. Both replays began from the existing controlled Area 1 family-menu state (SHA-256 `7615260c1bc7e18ec334aa5e7fc9be79db47a785c35b214cf07a1a07ba87b340`). That fixture is not a natural new-game progression proof.

From the family menu, Caddis uses Down once then A, and Terrestrial uses Down twice then A. Each directional input was held for one frame followed by two neutral frames; A was followed by 60 neutral frames. Later part seeds were created by ordinary A-confirmation of the default component. For each position, the cursor was moved right first, then down; the original full 256×224 frame was saved before A. The chosen body/wing/tail fields at WRAM `1D35`/`1D37`/`1D39` were then read. No memory writes were used in these 52 selection requests.

An independent agent rebuilt the part seeds and repeated all 52 controller requests. **All 52 selected IDs and all 52 cursor PNG SHA-256 values matched**, including the two clamp observations. Independent confirmation of Terrestrial body `77` displayed the direct ¥25 quote, with wing and tail fields remaining `00`. This is not proof of a purchase or a universal price.

The [sanitized dataset](../data/fly-maker-other-families-menu-positions.json) preserves all 50 distinct choices, image hashes, family names, coordinates, None paths, clamp observations and independent replay summary. Only original cursor PNGs and derived metadata are published; ROM, emulator core, state and memory dumps remain private.

## Exact selectable grids

IDs are hexadecimal. Rows run downward and columns run left to right.

### Caddis body

| Row | Column 1 | Column 2 | Column 3 | Column 4 |
|---:|---|---|---|---|
| 1 | 2B | 2F | 33 | 41 |
| 2 | 2C | 30 | 3E | 42 |
| 3 | 2D | 31 | 3F | clamps to 3F |
| 4 | 2E | 32 | 40 | clamps to 40 |

### Caddis wing

| Row | Column 1 | Column 2 | Column 3 | Column 4 |
|---:|---|---|---|---|
| 1 | 34 | 38 | 3C | 46 |
| 2 | 35 | 39 | 43 | 47 |
| 3 | 36 | 3A | 44 | 48 |
| 4 | 37 | 3B | 45 | None |

### Caddis tail

| Row | Column 1 |
|---:|---|
| 1 | 3D |
| 2 | 49 |
| 3 | 4A |
| 4 | None |

### Terrestrial body

| Row | Column 1 | Column 2 | Column 3 | Column 4 |
|---:|---|---|---|---|
| 1 | 77 | 7B | 7F | 83 |
| 2 | 78 | 7C | 80 | 84 |
| 3 | 79 | 7D | 81 | 85 |
| 4 | 7A | 7E | 82 | 86 |

## Code connection and limits

The [menu routine trace](fly-maker-menu-research.md) establishes that family key `01` is Caddis and `04` is Terrestrial; the list builder filters component family/part fields. In this replay, the Caddis wing buffer was identical after all tested bodies and the tail buffer was identical after all tested wings. The menu sentinel `87` is None and is not an item; confirming it leaves the part field `00` without adding a component price. Terrestrial's key `04` takes the direct-quote branch after body selection.

The evidence does not establish later-area menu availability, natural quest unlocks, a best assembly, or bite/landing advantages. Existing catch-acceptance evidence remains separate. The [attachment builder](../scripts/attach_fly_other_families.cjs) connects only confirmed non-None choices to existing catalogue items, and the independent publication guard checks the matrices, frame hashes, None instructions and localized rendered paths.
