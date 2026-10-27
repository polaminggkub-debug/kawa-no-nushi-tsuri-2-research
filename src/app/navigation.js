import * as page from '../pages/navigation/index.js'
import { mountGlobalSearch } from '../features/global-search/index.js'
import { mountMobileMenu } from '../features/mobile-menu/index.js'
import { quietRepeats } from '../features/quiet-repeats/index.js'
import { createPageRuntime } from '../shared/lib/index.js'

const runtimeContext = createPageRuntime(page)
page.initialize(runtimeContext)
const nav = document.querySelector('.compendium-nav')
mountMobileMenu(nav)
mountGlobalSearch(nav)
quietRepeats(document.querySelector('main'))
