// app/data/level3.ts
import { type LevelConfig, TileType } from '~/types/game.js'
const { Floor, Wall, Goal } = TileType

export const level3: LevelConfig = {
    id: 3,
    difficulty: 2,
    title: "The Sequence",
    // 教学：代码执行顺序
    initialCode: `// Code runs from TOP to BOTTOM.
// Like a recipe!

// TASK: Reach the goal.
// 1. Move Right 2 steps
// 2. Move Down 2 steps
// 3. Move Left 2 steps

robot.moveRight(2);
// Write the rest below:
`,
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Wall, Wall], // 起点 (1,1) -> (3,1)
        [Wall, Wall, Floor, Wall, Wall], // (3,1) -> (3,3)
        [Wall, Goal, Floor, Wall, Wall], // (3,3) -> (1,3) 终点
        [Wall, Wall, Wall, Wall, Wall]
    ]
}