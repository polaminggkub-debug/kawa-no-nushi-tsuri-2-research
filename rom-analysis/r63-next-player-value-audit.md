# R63 player-value audit: fish profile to notebook checklist

## Finding

The strongest remaining bounded gap I confirmed is a **context-dependent handoff from a fish profile to the site's manual 66-species checklist**. The profile explains how to verify the fish in the game, but it does not link to that species' checklist row. A player who arrived from the equipment catalogue or a map pin has to navigate back to Maps, open the notebook guide, open the correct first-area route group, and find the fish again before marking the site's checklist.

This is a navigation gap in the player's “catch, verify, record my progress” loop. It is not a ROM-data uncertainty, and the site must not mark a fish automatically or imply that it can read the game save.

## Evidence

- In `src/pages/fish/notebook-status.js:63-73`, an eligible profile says to land the fish and verify Tool 05, shows its first configured area and repeat areas, and offers only an in-profile jump to `#fish-area-map`. It has no route to the web checklist.
- The manual progress controls live in the Maps notebook guide: `src/pages/maps/notebook-guide.js:209-226` creates the six first-occurrence groups, while `src/pages/maps/notebook-progress.js:1,84-93,126-140` adds the species checkbox and stores it under `kawa-notebook-manual-v1`. The checklist already clearly says to tick only after checking in-game and that it does not read or change the save.
- Actual local browser check, Thai fish 06: the profile showed “1 of 66,” first configured in Area 1, other points in Areas 2 and 3, and the Tool 05 verification instruction. Its notebook panel offered the selected-area map button but no checklist action.
- The intended checklist-first route **does work**: opening fish 06 from `#notebook-route-1` and using the profile's Back link returned to the map with `#notebook-route-1` expanded and fish 06's manual checkbox in its row. This is not a universal return-path failure; the gap is for fish profiles opened from elsewhere.

## Smallest useful repair

Add a localized link in eligible fish profiles to that species' exact row in the existing 66-species checklist, using `firstOccurrenceStage` and the current profile as the safe return destination. Give the checklist article a stable species anchor if needed. Let the player mark it there only after verifying Tool 05 in-game; do not duplicate the tracker or auto-check it.

## Scope checked

I also checked one suspected bait-discovery issue and ruled it out: the Area 3 live-Ayu-decoy shop card visibly states “sell at least one Ayu first,” explains the nine-piece stock behavior, and links to the Ayu map/profile. The checklist-first profile return above likewise behaved as designed. This report does not re-open the area's food-selection follow-up, net/magnifier research, or known ROM-mechanics questions.
