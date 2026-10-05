# Practical choice follow-up: hooks, boats, keys and lottery tickets

This note records the player-facing choices added to the catalogue. Claims below use the supplied Japanese ROM and the project's traces; outside gameplay guides are not used as evidence.

## Fish-named hooks

The overview now tells players to use a hook they already own and choose bait from the target fish's recorded list. It does not present the unresolved fish-specific fight branch as a player benefit. The generic hook link is for comparison, not a claim that hook `06` is best. The branch remains in the hook research and technical evidence.

Sources: [hook practical research](hook-practical-research.md), [hook and float code notes](hook-float-use.md).

## Tub and canoe

- The canoe record has base price field ¥3,500 (`data/general-tool-code-index.json`, item `02`; item table record at file offset `0x02B25E`). This is not a shop offer: `data/shop-stock-rom.json` has no `general_tool:01` or `general_tool:02` in any of its six area stock lists. The player-facing recommendation therefore does not say to buy the canoe for ¥3,500.
- In the traced no-current branch, the canoe advances 14 position steps per schedule cycle versus the tub's 10. Current changes the selected movement schedule; this is not a universal travel-time or fishing advantage.
- The verified canoe route is the area-3 fresh-milk exchange at `(28,39)`. Drinking the milk changes it to an empty bottle; the bottle can be refilled at the area-3 cow `(6,103)`. Trading first avoids a return trip; drinking first delays the exchange but does not permanently remove it.
- The recommendation is conditional: continue with an owned tub if it works and the player wants to keep the milk; trade the milk for a canoe when the scoped movement advantage is worth that exchange.

Sources: [boat movement](boat-movement-research.md), [quest item routes](quest-tool-use-research.md), [six-area shop stock](shop-stock-research.md).

## Key and lottery ticket

- The key has a ¥100 base price field and recorded shop stock in areas 1, 2, 4 and 6 (`data/shop-stock-rom.json`). Area-1 stock makes one-key preparation possible from the start. The original-ROM chest handler retains the key while opening the four locked town chests in areas 1, 2, 4 and 6. Leave a free slot in the relevant inventory before opening each chest; the no-room persistence case is unverified.
- The area-5 town chest at `(4,6)` grants ticket `11` without a key. The area-5 outdoor counter at `(54,22)` consumes it and has both prize and loss branches; collect the chest ticket before buying another.
- Offer spare Hinomaru bento `06` or daikon `07` at the area-5 Jizo `(49,22)` before drawing at `(54,22)`, instead of orange `01`. Bento and daikon can turn more losing draws into prizes than orange; near the food-effect limit, all three may help equally. The food and ticket are consumed; a prize is never guaranteed. Do not buy food or trade a Yamanokami for daikon solely for the lottery. Exact ROM values and the limit remain in the item's technical evidence; they are not win percentages.

Sources: [quest item routes](quest-tool-use-research.md), [six-area shop stock](shop-stock-research.md).
