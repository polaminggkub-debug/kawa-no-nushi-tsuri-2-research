# Where to make each verified fly component

## Player action

The fly-maker NPC is separate from the normal equipment seller. Choose the
family at the maker, select body/wing/tail pictures, leave a completed-fly slot
free and check the final quote. Components need not be owned beforehand.

| Family | First recorded maker | Outdoor entrance 2 | Arrival in town | Maker tile |
| --- | --- | --- | --- | --- |
| Mayfly / Caddis / Terrestrial | Area 1 town, map 7 | X12,Y182 | X7,Y29 | X5,Y20 |
| Diptera / Stonefly | Area 2 town, map 8 | X91,Y25 | X7,Y29 | X5,Y24 |

If the selected area already has a maker for this family, the page uses that
local maker. Area 3 town (map 9) offers Mayfly/Caddis/Terrestrial at X10,Y22;
entrance 2 is outdoor X20,Y86 → town X7,Y29. Terrestrial is also offered
by the Area 2 maker. When the selected area has no matching maker, the link
uses the first recorded area in the table.

The 130 component entries with verified palette positions now link to their
maker's location and the paired town entrance, preserving the original item,
fish and rig as the return context. The four wing records without verified
palette positions do not acquire a fabricated maker route.

## What the ROM establishes

Town interaction slot `10` dispatches to maker handler `03:9517` in town maps
7–9. The same slot in maps 10–12 dispatches to special-rod handler `03:86E1`,
so it must not be presented as a fly maker in those towns. In the maker,
`03:9581..95FF` maps the first two menu choices by `$085A & 1`: odd maps select
Mayfly/Caddis; even maps select Diptera/Stonefly. The third choice selects
Terrestrial. Area 2's town map 8 is the only even town with this maker handler.

The outdoor-to-town transition associates areas 1–6 with town maps 7–12.
Entrance ordinal `1` is the second entrance, not the first. The displayed
coordinate pairs come from the entrance and town-object records, not a route
in a community guide. The town terrain is ROM-extracted and contains no NPC
sprites; the marker identifies the recorded interaction tile.

[Structured instruction/coordinate evidence](../data/fly-maker-access-rom.json)
and [original-ROM verifier](../scripts/verify_fly_maker_access.py) retain the
ROM identity, exact bytes and decoded routes. The existing [shop location
research](shop-location-research.md) retains the broader entrance/interaction
inventory.

## Limits

This establishes where the game routes the maker interaction and which families
its code offers. It is not a controller-only walk from a new game, proof of
story progression to Area 2, or a claim that every movement path between the
arrival tile and maker is clear. The map identifies endpoints so the player
can navigate; no unverified sequence of directional inputs is prescribed.

The [Diptera/Stonefly palette survey](fly-maker-even-families-menu-research.md)
remains a controlled even-area menu fixture. Its 42 component positions and
cursor images retain that provenance. Adding a static location trace does not
turn those captures into natural Area 2 access evidence. The previously
verified Mayfly/Caddis/Terrestrial positions likewise retain their own replay
scope. No fly family, component price or maker location is ranked as a bite,
fight or landing advantage.
