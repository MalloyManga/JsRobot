// app/data/level7.ts
import { type LevelConfig, TileType } from '~/types/game'
const { Floor, Wall, Goal } = TileType

export const level7: LevelConfig = {
    id: 7,
    difficulty: 5,
    title: "Final Exam",
    initialCode: `/* 
 * MISSION: THE GAUNTLET
 * 
 * Objectives:
 * 1. Use a LOOP to climb the stairs.
 * 2. In the Chest Room, use IF to pick up the "Key" (String).
 *    (Ignore the fake items!)
 * 3. Pick up BOTH swords from the Armory (Left side).
 * 4. Defeat the Ghost (Weak to Number).
 * 5. Defeat the Boss (Weak to String -> Mutates to Number).
 * 
 * Good luck, Commander.
 */

// 1. Climb Stairs
for (let i = 0; i < 3; i++) {
    robot.moveRight(2);
    robot.moveDown(2);
}

// 2. Chest Room (Get the String Key)
robot.moveRight(); // Move into chest room
// robot.pickUp('string'); 

// 3. Go to Armory & Get Swords (Go Left & Down)
// ...

// 4. Fight Ghost
// const ghost = document.querySelector('#ghost');
// ...

// 5. Fight Boss
// ...
`,
    startPos: { x: 1, y: 1 },
    map: [
        // 12x10 Map
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Floor, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall], // Stairs 1 (Start 1,1)
        [Wall, Floor, Floor, Floor, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall],
        [Wall, Floor, Wall, Floor, Floor, Wall, Wall, Wall, Wall, Wall, Wall, Wall], // Stairs 2
        [Wall, Floor, Wall, Wall, Floor, Floor, Wall, Wall, Floor, Floor, Floor, Wall], // Stairs 3 -> Chest Room (8,4)
        [Wall, Floor, Wall, Wall, Wall, Floor, Floor, Floor, Floor, Floor, Floor, Wall], // Corridor
        [Wall, Floor, Floor, Floor, Wall, Wall, Wall, Wall, Wall, Floor, Wall, Wall], // Armory -> Door(9,6) -> Boss
        [Wall, Floor, Floor, Floor, Wall, Wall, Wall, Wall, Wall, Floor, Floor, Wall], // Armory
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Floor, Goal, Wall], // Boss Room
        [Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall, Wall]
    ],
    entities: [
        // === 宝箱房 (8, 4) ===
        { id: 'chest_visual', x: 8, y: 4, type: 'chest', visual: 'chest', value: "Loot" },
        { id: 'fake_key', x: 8, y: 4, type: 'key', visual: 'key', value: 10 },    // Fake Number
        { id: 'real_key', x: 8, y: 4, type: 'key', visual: 'key', value: "OPEN" },// Real String
        { id: 'trash', x: 8, y: 4, type: 'key', visual: 'key', value: true },     // Trash

        // === 拦路门 (9, 6) ===
        // 这里的门实体会覆盖在地图的 Floor 上
        { id: 'gate', x: 9, y: 6, type: 'door', visual: 'door', required: "OPEN" },

        // === 武器库 (左下角) ===
        { id: 'sword_str', x: 1, y: 7, type: 'weapon', visual: 'sword', value: "S-Blade" }, // For Boss P1
        { id: 'sword_num', x: 3, y: 7, type: 'weapon', visual: 'sword', value: 999 },       // For Ghost & Boss P2

        // === 拦路幽灵 (7, 5) ===
        { id: 'ghost', x: 7, y: 5, type: 'monster', visual: 'ghost', weakness: 'number', hp: 1 },

        // === Final Boss (10, 8) ===
        { id: 'boss', x: 10, y: 8, type: 'boss', visual: 'boss', weakness: 'string', hp: 1 }
    ]
}
