// app/data/level4.ts
import { type LevelConfig, TileType } from '~/types/game.js'
const { Floor, Wall, Goal, Trap } = TileType

export const level4: LevelConfig = {
    id: 4,
    difficulty: 3,
    title: "The Trap",
    // 教学：躲避陷阱，修改错误代码
    initialCode: `// WARNING: Trap detected! 💀
// Do NOT walk straight into the red zone.

// TASK: The code below is dangerous.
// Change it to go AROUND the trap.
// (Down -> Right -> Up)

robot.moveRight(3); // <--- This will kill you!
`,
    startPos: { x: 1, y: 2 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Floor, Goal, Wall], // 上路：安全
        [Wall, Floor, Trap, Trap, Floor, Wall], // 中路：陷阱
        [Wall, Floor, Floor, Floor, Floor, Wall], // 下路：安全
        [Wall, Wall, Wall, Wall, Wall, Wall]
    ]
}