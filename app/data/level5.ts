// app/data/level5.ts
import { type LevelConfig, TileType } from '~/types/game'
const { Floor, Wall, Goal } = TileType

export const level5: LevelConfig = {
    id: 5,
    difficulty: 3,
    title: "The Filter",
    // 教学：If语句 + 提前预览 DOM 获取 (Scanner)
    initialCode: `/* 
 * LESSON: Conditional Logic (If/Else)
 * 
 * SCENARIO: The Chest contains 3 items mixed together!
 * The Door requires a NUMBER (10) to open.
 * 
 * We need to filter through the chest items.
 */

// 1. Move to the chest
robot.moveRight(2);

// --- SCANNER CODE (PREVIEW) ---
// We will learn 'document.querySelector' in Level 6.
// For now, use this code to see inside the chest:
const chest = document.querySelector('#chest_visual');
const contents = chest.contents; 
// contents is now: ['string', 'number', 'boolean']
// ------------------------------

// TASK: Use an IF statement to check if 'number' is in the list.
// If true, use robot.pickUp('number').

if (contents.includes('number')) {
    // Write code here to pick up the number:
    
} else {
    // Fallback code (Optional)
    
}

// 2. Go to the door
robot.moveRight(2);
`,
    startPos: { x: 1, y: 1 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Floor, Floor, Floor, Goal, Wall], // 起点(1,2) -> 宝箱(4,2) -> 门(6,2)
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall]
    ],
    entities: [
        // === 视觉层 ===
        // 宝箱外观
        {
            id: 'chest_visual', x: 3, y: 1,
            type: 'chest', visual: 'chest',
            value: "Mixed Items"
        },

        // === 数据层 (3个物品叠在一起) ===
        // 1. 干扰项 String
        { id: 'item_1', x: 3, y: 1, type: 'key', visual: 'key', value: "10" },
        // 2. 正确项 Number (Value: 10)
        { id: 'item_2', x: 3, y: 1, type: 'key', visual: 'key', value: 10 },
        // 3. 干扰项 Boolean
        { id: 'item_3', x: 3, y: 1, type: 'key', visual: 'key', value: true },

        // 门 (需要 Number 10)
        { id: 'door', x: 5, y: 1, type: 'door', visual: 'door', required: 10 }
    ]
}
