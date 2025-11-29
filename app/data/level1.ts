// app/data/level1.ts
import { type LevelConfig, TileType } from '~/types/game.js'
const { Floor, Wall, Goal } = TileType

export const level1: LevelConfig = {
    id: 1,
    difficulty: 1,
    title: "Hello World",
    // 教学：解释 Robot 是对象，moveRight 是动作
    initialCode: `// Welcome, Cadet!
// In JavaScript, "robot" is the Object.
// "moveRight" is the Action.

// TASK: Uncomment the code below to move.
// (Delete the "//" at the start)

// robot.moveRight(2);
// robot.moveDown();`,
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Floor, Wall],
        [Wall, Floor, Wall, Floor, Wall],
        [Wall, Floor, Floor, Goal, Wall],
        [Wall, Wall, Wall, Wall, Wall]
    ]
}
