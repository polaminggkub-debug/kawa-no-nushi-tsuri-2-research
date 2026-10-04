# Field guide redesign

## Decision

Use a practical compendium: browse and search first, concise decisions second, original maps and entity details one click away. Research is a distinct expandable layer. Keep the dependency-free static publishing workflow and all three languages.

### References inspected

- [Pokémon Database: complete Pokédex](https://pokemondb.net/pokedex/all): live page inspected visually; nearby search, sortable comparison and linked entities. Adopt nearby controls and comparison; do not borrow stats or content.
- [LivingDex](https://github.com/PimBARF/LivingDex): open-source, dependency-free catalogue reference; instant search, contextual information and responsive browsing. Adopt low-maintenance delivery, not its collection semantics.
- [The Pokédex Database](https://github.com/hoangsonww/The-Pokedex-Database): open-source reference for search, item explorer and card-to-detail structure. Do not introduce its framework or backend dependencies.
- [Stardew Valley Wiki: Fish](https://stardewvalleywiki.com/Fish): reference for connected locations, equipment and usage. Adopt entity relationships and the separation between an index and a strategy guide. No Kawa gameplay claims derive from these references.

## Content and data audit

The delivered catalogue contains 315 equipment/item/component entries, localized names, original sprite and screen captures, decision records, shop stock, fish acceptance, fish locations, tool/quest actions, and ROM record evidence. It merges source JSON through `build_item_use.py` and `build_catalogue.cjs`. Pages include equipment browsing, maps, shops, item details, fish details and the strategy/research document. Historical guide JSON and private runtime research stay in place; redesign is not permission to promote unvalidated historical claims.

## Information architecture

| Entry | Player task | Progressive detail |
| --- | --- | --- |
| Equipment | Search, choose a category or target fish | Verdict → item profile → related items, shops and evidence |
| Fish & maps | Pick an area or fish; locate configured spawn points | Map selection → fish profile → compatible rigs |
| Shops | Find stocked goods and seller/entrance position | Area/category/name filters → stocked bundle → item profile |
| Strategy & evidence | Choose starter equipment and understand limitations | Practical guide → full tables and trace documents |
| Item profile | Decide whether to buy, use, keep or replace | Decision → acquisition/usage → compatibility → technical evidence |
| Fish profile | Choose where to fish and what to carry | Location/rig → equipment → full acceptance and source evidence |

## Interaction rules

- Uniform navigation across all page families; preserve fish, area and rig context when switching tasks.
- Search before long recommendations. Global advice is a named disclosure, not a compulsory scroll.
- Cards expose an identifiable sprite/name, price when stocked, a practical verdict, and an explicit detail link. Detailed lists remain available through named disclosures or profiles.
- Targeted fishing does not mix unrelated food and quest items into compatible-tackle results.
- A closed research disclosure must retain every source, raw value and interpretation limitation.
- Native disclosures are keyboard operable; anchored destinations open enclosing disclosures.
- Mobile controls use readable text, visible focus and touch-sized actions. Tables and original terrain can scroll within their own container.
- No new game mechanics, success rates or recommended walking paths are inferred from presentation changes.

## Verification

Source checks and actual browser interactions are separate evidence. See `redesign-qa.md` for the final verified scope and remaining data limits. ROMs, emulator cores and save states remain private and are not included in publication.
