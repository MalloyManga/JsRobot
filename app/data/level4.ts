// app/data/level4.ts
import { type LevelConfig, TileType } from '~/types/game.js'
const { Floor, Wall, Goal } = TileType

export const level4: LevelConfig = {
    id: 4,
    difficulty: 3,
    title: "The Loop",
    // 教学：利用循环处理重复的阶梯模式
    initialCode: `/* 
 * LESSON: Loops
 * 
 * Programmers hate repeating themselves.
 * Look at the map: it's a "Staircase" pattern.
 * 
 * Pattern: Move Right 2 steps, then Move Down 2 steps.
 * This repeats 3 times.
 * 
 * Instead of writing 6 lines of code, use a "for loop":
 * 
 * for (let i = 0; i < 3; i++) {
 *     // Code here runs 3 times
 * }
 */

// TASK: Use a loop to climb the stairs efficiently.

`,
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Wall, Wall, Wall, Wall, Wall, Wall], // Level 1 (Right 2)
        [Wall, Wall, Floor, Floor, Floor, Wall, Wall, Wall, Wall], // Level 2 (Down 2, Right 2)
        [Wall, Wall, Wall, Wall, Floor, Floor, Floor, Wall, Wall], // Level 3
        [Wall, Wall, Wall, Wall, Wall, Wall, Floor, Floor, Goal], // Level 4
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall]
    ],
    entities: [] // 纯逻辑关卡，无道具
}
