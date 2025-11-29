// app/data/level1.ts
import { type LevelConfig, TileType } from '~/types/game.js'

// 为了写起来方便，可以解构出来，或者直接写 TileType.Wall
const { Floor, Wall, Goal } = TileType

export const level1: LevelConfig = {
    id: 1,
    title: "Hello World",
    initialCode: `// Level 1: Try to reach the flag!\n// Tip: Use robot.moveRight()\nrobot.moveRight(2);\nrobot.moveDown();`,
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Floor, Wall],
        [Wall, Floor, Wall, Floor, Wall],
        [Wall, Floor, Floor, Goal, Wall],
        [Wall, Wall, Wall, Wall, Wall]
    ]
}
