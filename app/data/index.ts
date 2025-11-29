import { level1 } from './level1.js'
import { level2 } from './level2.js'

// 导出关卡列表
export const levels = [level1, level2]

// 方便按 ID 获取
export const getLevelById = (id: number) => levels.find(l => l.id === id)