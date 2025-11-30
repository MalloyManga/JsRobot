// app/level2.ts
import { type LevelConfig, TileType } from '~/types/game.js'
const { Floor, Wall, Goal } = TileType

export const level2: LevelConfig = {
    id: 2,
    difficulty: 1,
    title: "The Staircase",
    initialCode: `// MISSION: Descend the stairs.
// 
// TIP: Instead of writing:
// robot.moveRight();
// robot.moveRight();
// 
// You can use Arguments (Parameters):
// robot.moveRight(2);  <-- Moves 2 steps instantly
//
// TASK: Navigate the stairs (Right 2 -> Down 2 -> Right 2)

robot.moveRight(2);
// What comes next?
`,
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Wall, Wall, Wall, Wall], // (1,1) -> (3,1)
        [Wall, Wall, Floor, Wall, Wall, Wall, Wall], // (3,2)
        [Wall, Wall, Floor, Floor, Wall, Wall, Wall], // (3,3) -> (5,3)
        [Wall, Wall, Wall, Floor, Wall, Wall, Wall],
        [Wall, Wall, Wall, Floor, Floor, Goal, Wall], // (5,5) -> (7,5)
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall]
    ]
}
