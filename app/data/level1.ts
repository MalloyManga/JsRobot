// app/level1.ts
import { type LevelConfig, TileType } from '~/types/game.js'
const { Floor, Wall, Goal } = TileType

export const level1: LevelConfig = {
    id: 1,
    difficulty: 1,
    title: "System Boot",
    initialCode: `// MISSION: Initialize the Robot.
// 
// [1] "robot" is the Object you control.
// [2] ".moveRight()" is the Method (Action).
//
// --- CONTROLS GUIDE ---
// [Run Code]: Resets the robot and runs ALL code.
// [Continue]: Keeps the robot current position and runs NEW code only.
//
// TIP: Use Ctrl + / to toggle comment/uncomment.
// TIP: Use Shift + Alt + F to format your code.
//
// TASK: Uncomment the line below to reach the goal.

// robot.moveRight();
// robot.moveRight();
// robot.moveRight();
`,
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Floor, Goal, Wall], // 直线，距离3格
        [Wall, Wall, Wall, Wall, Wall, Wall]
    ]
}