// app/data/index.ts
export * from './level1.js'
export * from './level2.js'
export * from './level3.js'
export * from './level4.js'
export * from './level5.js'

import { level1 } from './level1.js'
import { level2 } from './level2.js'
import { level3 } from './level3.js'
import { level4 } from './level4.js'
import { level5 } from './level5.js'

export const levels = [level1, level2, level3, level4, level5]
