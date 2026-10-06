# R64 shop-journey audit

## Finding

An item’s “see the shop that sells this” action lands on the correct filtered shop page, but does not open the seller map. From there the player must find and click a second “show seller and town entrance” action before the mapped location appears. This is a confirmed extra step in the equipment → shop → map journey, not missing stock or location data.

## Concrete example

Rod `04` (清流カーボン竿5.3m) has a ROM-backed ¥500 offer in Area 1. Its item purchase card calls `stageButton` with the label “ดูร้านที่ขายของนี้ · ด่าน 1”; `stageButton` preserves the item, area, and safe return context and opens `shops.th.html?stage=1&place=town&category=rod&id=04&return=…`, but the URL has no fragment. The shop page initially keeps `#shop-map-disclosure` closed. The filtered target panel does expose a separate seller action that links to `#location-section`; following that second link opens the map and filters it to the regular shop.

The underlying data supports the destination: `gallery-data.json` records rod `04` at ¥500 with shop offers in Areas 1, 2, 3, 5, and 6; `shop-stock-rom.json` includes `rod:04` in Area 1 stock; `shop-locations-rom.json` places Area 1’s regular shop at town tile `(7,24)`. The paired entrance record lists outdoor tile `(12,182)` and town arrival `(7,29)`.

## Smallest useful repair

Have the item-page seller button append `#location-section` to its existing filtered shop URL. The shop page already recognizes that fragment, opens the map disclosure, and renders only the relevant seller type for the selected item. Keep the existing seller action on the shop page for journeys that start there.

## Evidence and limits

- `src/pages/item/links.js:22–36` constructs the item-page shop link without a hash.
- `src/pages/item/purchases.js:136–139` renders that link on each recorded seller-area card.
- `src/pages/shops/ui/shops.th.html:127–135` places the location map inside a closed `<details>` panel.
- `src/pages/shops/shop-page.js:68–83, 94–98` opens and scrolls the panel only for `#location-section` (or another recognized map target).
- `src/pages/shops/target-actions.js:52–54` already creates the second seller link with `#location-section`.
- `docs/shop-location-research.md:11–20` documents the ROM-derived area/shop coordinate pairing and distinguishes the normal shop from the special-rod seller.

This is a source-and-data path audit, not a browser replay or a claim that the player can reach the shop under every story state. It excludes nets, magnifier routes, and the already-audited food and lure-kit decisions.
