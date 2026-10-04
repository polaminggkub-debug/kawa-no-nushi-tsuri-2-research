import * as page from '../pages/strategy/index.js'
import { createPageRuntime } from '../shared/lib/index.js'

const runtimeContext = createPageRuntime(page)
page.initialize(runtimeContext)
