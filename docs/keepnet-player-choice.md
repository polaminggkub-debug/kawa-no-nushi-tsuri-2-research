# Keepnet purchase choices

Choose a keepnet by how many fish you want to keep before clearing it. The full purchase prices and areas below are checked against the ROM item records and the six decoded shop inventories.

| Item | Capacity | Full purchase price | Sold in | Buy or wait |
| --- | ---: | ---: | --- | --- |
| `0B` | 10 fish | ¥300 | Areas 1 and 2 | Buy if your current capacity is below 10 and ten slots are enough. If you expect to keep more, wait for `0C` or `0D`. |
| `0C` | 20 fish | ¥400 | Areas 3 and 4 | Buy if your current capacity is below 20 and twenty slots are enough. If you expect to keep more, wait for `0D`. |
| `0D` | 30 fish | ¥500 | Areas 5 and 6 | Buy if your current capacity is below 30 and you want thirty slots. If twenty slots are enough, keep that capacity. |

The shop accepts only a larger capacity: equal and smaller choices are refused. You can skip an intermediate size and buy a larger one directly. Each amount above is the full purchase price, not a trade-in value or an upgrade-price difference.

When a catch reaches capacity, the ROM stores that fish and then reports that the basket is full. A later fishing action is blocked until the player makes room. Selling a fish frees a slot. Eating a fish also frees a slot, but the game eats the first basket fish; check its name because eating Kusafugu sets HP to zero.

If you have Yamanokami (`18`), read the Daikon exchange details before trading. The one-time Area 3 exchange at `(21,82)` consumes the fish and overwrites all 16 food slots with Daikon. Keep the fish until you decide, and use any food you want to keep before the trade. This does not establish a natural way to catch or obtain Yamanokami.

## Evidence

- [Six-area shop stock](../data/shop-stock-rom.json) establishes where each keepnet is actually sold.
- [Gallery item records](../catalogue/gallery-data.json) give the general-tool prices and capacities.
- [Keepnet code trace](chum-basket-research.md#keepnet-capacity-where-it-is-read) documents the capacity gate and what happens when the basket fills.
- [Daikon exchange research](daikon-acquisition-research.md) documents the one-time fish exchange and overwritten food slots.
