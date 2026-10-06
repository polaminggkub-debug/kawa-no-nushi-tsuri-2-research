import * as page from '../pages/fight-sim/index.js'
import { createPageRuntime } from '../shared/lib/index.js'

const runtimeContext = createPageRuntime(page)
page.initialize(runtimeContext)
