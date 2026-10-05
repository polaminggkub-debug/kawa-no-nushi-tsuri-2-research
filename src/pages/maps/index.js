export { renderNotebookGuide } from './notebook-guide.js'
export { renderWaterKey } from './water-icons.js'
export {
  waterMarkAreaText,
  waterMarkFishHeading,
  waterMarkEmptyText,
  waterMarkPinHelp,
} from './water-icons.js'
export {
  fishMatchesWaterMark,
  waterMarkFishIds,
  visibleMapFishIds,
  bindWaterMarkFilter,
} from './water-mark-filter.js'
export {
  safeReturn,
  localizeReturn,
  buildData,
  speciesRecord,
  addFishLocation,
  indexMapSections,
  updateUrl,
  updateLanguageLinks,
  fishInStage,
  areaCount,
  chooseSection,
  renderAreas,
  searchable,
  normalizedSearch,
  matchingSuggestions,
  setSuggestionsExpanded,
  closeSuggestions,
  renderSuggestions,
  setActiveSuggestion,
  chooseSuggestion,
  renderFishList,
  renderFishListHeader,
  fishChoice,
} from './fish-search.js'
export {
  renderSectionSelect,
  renderTargetSectionLinks,
  setFish,
  showPinDetails,
  renderMap,
  mapPinMarkup,
  mapGeometry,
  renderMapSummary,
  renderMapNavigation,
  renderOverview,
  render,
  enableControls,
  initFromUrl,
} from './map-render.js'
import { setupContext } from './setup-context.js'
import { bindMapTargets } from './bind-map-targets.js'
import { bindMapControls } from './bind-map-controls.js'
import { bindFishSearch } from './bind-fish-search.js'
import { bindSearchActions } from './bind-search-actions.js'
import { loadMaps } from './load-maps.js'
import { bindWaterMarkFilter } from './water-mark-filter.js'
export function initialize(ctx) {
  setupContext(ctx)
  bindMapTargets(ctx)
  bindWaterMarkFilter(ctx)
  bindMapControls(ctx)
  bindFishSearch(ctx)
  bindSearchActions(ctx)
  loadMaps(ctx)
}
