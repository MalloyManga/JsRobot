// app/data/level6.ts
import { type LevelConfig, TileType } from '~/types/game'
const { Floor, Wall, Goal } = TileType

export const level6: LevelConfig = {
    id: 6,
    difficulty: 4,
    title: "Type Effectiveness",
    // 教学：DOM + 类型克制
    initialCode: `/* 
 * LESSON: DOM Interaction
 * 
 * 1. Select the enemy: document.querySelector('#ghost')
 * 2. Check its ".weakness".
 * 3. Pick up the weapon that MATCHES the weakness.
 *    (String Sword vs Number Sword)
 * 4. Attack!
 */

// 1. Inspect the enemy
const ghost = document.querySelector('#ghost');

// 2. Logic to choose weapon
if (ghost.weakness === 'string') {
    // Go UP to get String Sword
    robot.moveUp();
    robot.pickUp();
    robot.moveDown();
} else {
    // Go DOWN to get Number Sword
    
}

// 3. Attack
robot.moveRight(2);
robot.attack(ghost);
`,
    startPos: { x: 1, y: 2 },
    map: [
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Wall, Wall, Wall, Wall], // 上路武器位 (2, 1)
        [Wall, Floor, Floor, Floor, Goal, Wall, Wall], // 中路 (起点 -> 怪 -> 终点)
        [Wall, Floor, Floor, Wall, Wall, Wall, Wall], // 下路武器位 (2, 3)
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall]
    ],
    entities: [
        // 上路：String 武器
        { id: 'w_str', x: 2, y: 1, type: 'weapon', visual: 'sword', value: "Buster" },
        // 下路：Number 武器
        { id: 'w_num', x: 2, y: 3, type: 'weapon', visual: 'sword', value: 10 },

        // 幽灵 (弱点 String)
        {
            id: 'ghost', x: 3, y: 2,
            type: 'monster', visual: 'ghost',
            weakness: 'string', hp: 1
        }
    ]
}
