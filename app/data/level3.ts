// app/data/level3.ts
import { type LevelConfig, TileType } from '~/types/game.js'
const { Floor, Wall, Goal } = TileType

export const level3: LevelConfig = {
    id: 3,
    difficulty: 2,
    title: "Data Types",
    // 教学：深入浅出讲解数据类型
    initialCode: `/* 
 * LESSON: Data Types
 * 
 * In JavaScript, data comes in different "Types":
 * 
 * 1. Number: Used for math. 
 *    Example: 10, 42, 3.14 (No quotes)
 * 
 * 2. String: Used for text. 
 *    Example: "Hello", "10", 'Robot' (Wrapped in quotes)
 * 
 * 3. Boolean: True or False logic.
 *    Example: true, false
 * 
 * --- THE PUZZLE ---
 * The Security Door ahead requires a NUMBER key (10).
 * But there is a fake String key ("10") nearby too.
 * 
 * TASK:
 * 1. Identify which key is the Number.
 * 2. Use robot.pickUp() to get it.
 * 3. Open the door.
 */

// robot.moveRight(2);
// robot.pickUp();
`,
    startPos: { x: 1, y: 2 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Wall, Floor, Wall, Wall], // 上路: 陷阱/假钥匙
        [Wall, Floor, Floor, Floor, Floor, Goal, Wall], // 中路
        [Wall, Floor, Floor, Wall, Floor, Wall, Wall], // 下路: 真钥匙
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall]
    ],
    entities: [
        // 上路：字符串钥匙 "10" (假的)
        {
            id: 'key_str', x: 2, y: 1,
            type: 'key', visual: 'key',
            value: "10"
        },
        // 下路：数字钥匙 10 (真的)
        {
            id: 'key_num', x: 2, y: 3,
            type: 'key', visual: 'key',
            value: 10
        },
        // 门：需要数字 10
        {
            id: 'door_num', x: 4, y: 2,
            type: 'door', visual: 'door',
            required: 10
        }
    ]
}
