import * as page from '../pages/gear-guide/index.js'
import { createPageRuntime } from '../shared/lib/index.js'

const runtimeContext = createPageRuntime(page)
page.initialize(runtimeContext)
