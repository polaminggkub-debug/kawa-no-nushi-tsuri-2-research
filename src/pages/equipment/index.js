export {
  renderSamples,
  renderFrames,
  renderNotes,
  cardDisclosure,
  detailedFields,
  thaiLabel,
} from './evidence-display.js'
export {
  closeFishSuggestions,
  showFishSuggestions,
  setupFishPicker,
  selectFish,
} from './fish-picker.js'
export { renderTargetCategories, renderFilters } from './category-controls.js'
export {
  decisionCard,
  renderDecisions,
  hookPriceGuide,
  floatPriceGuide,
  flyDecision,
  renderComparison,
} from './player-guidance.js'
export { visibleUse, fishHeading, fishList } from './item-use.js'
export { shopLocations } from './shop-locations.js'
export {
  baitLurePriceChoices,
  areaItemLink,
  compassUseChoice,
  gatheredBaitChoices,
  baitGatherChoice,
  forageBaitChoice,
  daikonFishChoice,
  keepnetAlternatives,
  mushroomAlternative,
  acquisitionChoice,
  flyBundlePartFor,
  gearNextActions,
} from './item-actions.js'
export { toolUseLocations, renderFishLocation } from './location-maps.js'
export { renderItemCard } from './item-card.js'
export { renderCards } from './catalogue-results.js'

import { setupLocale } from './setup-locale.js'
import { setupPageCopy } from './setup-page-copy.js'
import { setupPlayerState } from './setup-player-state.js'
import { setupPickerState } from './setup-picker-state.js'
import { setupDataAccess } from './setup-data-access.js'
import { setupNavigation } from './setup-navigation.js'
import { setupCardLinks } from './setup-card-links.js'
import { loadCatalogue } from './load-catalogue.js'
import { collapseRefineOnPhone } from './refine-disclosure.js'

export function initialize(ctx) {
  if (typeof document === 'undefined' || !document.getElementById('cards')) return
  setupLocale(ctx)
  setupPageCopy(ctx)
  setupPlayerState(ctx)
  setupPickerState(ctx)
  setupDataAccess(ctx)
  setupNavigation(ctx)
  setupCardLinks(ctx)
  collapseRefineOnPhone()
  loadCatalogue(ctx)
}
