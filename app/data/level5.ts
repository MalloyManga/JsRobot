// app/data/level5.ts
import { type LevelConfig, TileType } from '~/types/game.js'
const { Floor, Wall, Goal } = TileType

export const level5: LevelConfig = {
    id: 5,
    difficulty: 5,
    title: "The Algorithm",
    // 教学：没有任何提示，Final Exam
    initialCode: `// FINAL EXAM
// No hints this time.
// Guide the robot through the maze.

// Good luck, Hacker!
`,
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Floor, Wall, Goal, Wall], // 终点在右上
        [Wall, Wall, Wall, Floor, Wall, Floor, Wall],
        [Wall, Floor, Floor, Floor, Wall, Floor, Wall],
        [Wall, Floor, Wall, Wall, Wall, Floor, Wall],
        [Wall, Floor, Floor, Floor, Floor, Floor, Wall], // 起点在左上，要绕一大圈
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall]
    ]
}