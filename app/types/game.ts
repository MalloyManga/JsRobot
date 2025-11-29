// app/types/game.ts

// 1. 定义地图格子类型的枚举 (核心修改)
export enum TileType {
    Floor = 0, // 地板
    Wall = 1,  // 墙壁
    Goal = 2,  // 终点
    Trap = 3,  // [拓展] 陷阱
    Chest = 4  // [拓展] 宝箱
}

export interface Point {
    x: number
    y: number
}

export interface LevelConfig {
    id: number
    title: string
    description?: string
    // 2. 这里不再是 number[][]，而是明确的 TileType[][]
    map: TileType[][]
    startPos: Point
    // 拓展实体暂时保持原样
    initialCode: string // [新增] 每一关的初始代码
    entities?: any[]
}
