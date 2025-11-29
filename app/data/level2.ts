// app/data/level2.ts
import { type LevelConfig, TileType } from '~/types/game.js'

const { Floor, Wall, Goal } = TileType

export const level2: LevelConfig = {
    id: 2,
    difficulty: 2,
    title: "The Corridor",
    initialCode: `// Level 2: The Corridor\n// Watch out for walls!\nrobot.moveRight(1);`,
    startPos: { x: 4, y: 3 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Goal, Floor, Floor, Floor, Wall],
        [Wall, Wall, Floor, Wall, Floor, Wall],
        [Wall, Floor, Floor, Wall, Floor, Wall],
        [Wall, Wall, Wall, Wall, Wall, Wall]
    ]
}
