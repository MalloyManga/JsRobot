// app/data/level1.ts
import { type LevelConfig, TileType } from '~/types/game.js'

// 为了写起来方便，可以解构出来，或者直接写 TileType.Wall
const { Floor, Wall, Goal } = TileType

export const level1: LevelConfig = {
    id: 1,
    title: "Hello World",
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Floor, Wall], // 这里演示加了一个陷阱 Trap(3)
        [Wall, Floor, Wall, Floor, Wall],
        [Wall, Floor, Floor, Goal, Wall],
        [Wall, Wall, Wall, Wall, Wall]
    ]
}
