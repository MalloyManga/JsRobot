// app/types/game.ts

export enum TileType {
    Floor = 0,
    Wall = 1,
    Goal = 2,
    Trap = 3
}

// 道具/实体的具体类型
export type EntityType = 'key' | 'door' | 'chest' | 'monster' | 'boss' | 'weapon'

// 视觉样式 (决定用哪个Icon)
export type VisualType = 'key' | 'door' | 'chest' | 'ghost' | 'monster' | 'boss' | 'sword'

export interface GameEntity {
    id: string          // 用于 document.querySelector('#id')
    x: number
    y: number
    type: EntityType
    visual: VisualType

    // 逻辑属性
    value?: any         // 钥匙的值: 10, "10", true, {}
    required?: any      // 门/宝箱需要的匹配值
    weakness?: string   // 怪物的弱点 (需要哪种类型的武器)
    hp?: number         // Boss 血量

    // 状态属性
    isCollected?: boolean // 是否被捡起
    isDead?: boolean      // 是否死亡
    isHit?: boolean       // [视觉] 是否正在受击 (变红)
}

export interface Point {
    x: number
    y: number
}

export interface LevelConfig {
    id: number
    title: string
    difficulty: number
    initialCode?: string
    map: TileType[][]
    startPos: Point
    entities?: GameEntity[] // [新增] 实体列表覆盖在地图上
}
