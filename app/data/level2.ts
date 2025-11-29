// app/data/level2.ts
import { type LevelConfig, TileType } from '~/types/game.js'
const { Floor, Wall, Goal } = TileType

export const level2: LevelConfig = {
    id: 2,
    difficulty: 1,
    title: "The Arguments",
    // 教学：括号里的数字控制步数
    initialCode: `// Great! Now let's learn "Arguments".
// The number inside ( ) controls the steps.

// TASK: The bridge is too long for 1 step.
// Change (1) to (4) to cross it!

robot.moveRight(1);`,
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Floor, Floor, Goal, Wall], // 距离起点 4 格
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall]
    ]
}
