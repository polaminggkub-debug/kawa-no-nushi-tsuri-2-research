import * as page from '../pages/navigation/index.js'
import { mountGlobalSearch } from '../features/global-search/index.js'
import { createPageRuntime } from '../shared/lib/index.js'

const runtimeContext = createPageRuntime(page)
page.initialize(runtimeContext)
mountGlobalSearch(document.querySelector('.compendium-nav'))
