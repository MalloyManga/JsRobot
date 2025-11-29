<script setup lang="ts">
import { levels } from '~/data/index.js'
import { type LevelConfig, type Point, TileType } from '~/types/game.js'

// === 1. 基础状态定义 (State) ===
// 必须最先定义，否则后面的逻辑用不了

// 1.1 关卡索引
const currentLevelIndex = ref(0)

// 1.2 计算当前关卡 (防止 undefined 报错的兜底写法)
const currentLevel = computed<LevelConfig>(() => {
    const level = levels[currentLevelIndex.value]
    return (level || levels[0]) as LevelConfig
})

// 1.3 日志系统 (提到最前面，因为 watcher 要用)
const logs = ref<string[]>([])

// 1.4 玩家位置与方向
const player = ref<Point>({ ...currentLevel.value.startPos })
type Direction = 'front' | 'back' | 'left' | 'right'
const direction = ref<Direction>('front')

// 1.5 代码内容
const code = ref('// Level 1: Go to the flag\nrobot.moveRight(2);\nrobot.moveDown();')
const isRunning = ref(false)

// === 2. 监听器 (Watchers) ===
// 放到状态定义之后，这样 immediate 执行时 logs 已经存在了

watch(currentLevel, (newVal) => {
    // 重置玩家位置
    player.value = { ...newVal.startPos }
    direction.value = 'front'

    // 现在 logs 已经定义了，不会报错了
    logs.value.push(`> Loaded Level ${newVal.id}: ${newVal.title}`)
}, { immediate: true })


// === 3. 核心逻辑 (Logic) ===
const runCode = async () => {
    if (isRunning.value) return
    isRunning.value = true
    logs.value = ['> System Initialized...', '> Parsing Code...']

    // 重置位置
    player.value = { ...currentLevel.value.startPos }
    direction.value = 'front'

    const lines = code.value.split('\n')

    for (const line of lines) {
        const cmdStr = line.trim()
        if (!cmdStr || cmdStr.startsWith('//')) continue

        // 正则解析: robot.moveRight(2)
        const match = cmdStr.match(/robot\.(moveUp|moveDown|moveLeft|moveRight)\s*\(\s*(\d*)\s*\)/)

        if (match) {
            const action = match[1]
            const steps = match[2] ? parseInt(match[2], 10) : 1

            // 步进循环
            for (let i = 0; i < steps; i++) {
                await new Promise(r => setTimeout(r, 500))

                if (action === 'moveRight') move(1, 0, 'right')
                else if (action === 'moveLeft') move(-1, 0, 'left')
                else if (action === 'moveUp') move(0, -1, 'back')
                else if (action === 'moveDown') move(0, 1, 'front')
            }
        } else {
            if (cmdStr.startsWith('robot.')) {
                logs.value.push(`⚠ Syntax Error: "${cmdStr}"`)
            }
        }
    }

    logs.value.push('> Execution Finished.')
    isRunning.value = false
}

const move = (dx: number, dy: number, newDir: Direction) => {
    direction.value = newDir
    const newX = player.value.x + dx
    const newY = player.value.y + dy
    const map = currentLevel.value.map

    // 越界检查
    if (!map[newY] || typeof map[newY][newX] === 'undefined') {
        logs.value.push(`❌ Bump! Map edge at [${newX}, ${newY}]`)
        return
    }

    const cellType = map[newY][newX]

    // 墙壁检查 (使用枚举 TileType)
    if (cellType === TileType.Wall) {
        logs.value.push(`❌ Crash! Wall at [${newX}, ${newY}]`)
        return
    }

    // [拓展] 陷阱检查
    if (cellType === TileType.Trap) {
        logs.value.push(`💀 DIED! Step on trap at [${newX}, ${newY}]`)
        player.value = { ...currentLevel.value.startPos }
        return
    }

    // 移动
    player.value.x = newX
    player.value.y = newY
    logs.value.push(`✔ Moved ${newDir} to [${newX}, ${newY}]`)

    // 胜利检查
    if (cellType === TileType.Goal) {
        logs.value.push('🎉 TARGET REACHED!')
        setTimeout(() => {
            alert('Victory! Level Complete!')
            // 简单的切关逻辑
            if (currentLevelIndex.value < levels.length - 1) {
                currentLevelIndex.value++
                // 这里不需要手动重置 player，因为 watch(currentLevel) 会自动处理
            }
        }, 200)
    }
}
</script>

<template>
    <div class="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">

        <!-- 左侧编辑器 (保持不变，省略部分样式代码以节省篇幅) -->
        <div
            class="flex-1 flex flex-col bg-game-surface border-4 border-game-border rounded-lg overflow-hidden shadow-lg">
            <textarea v-model="code" spellcheck="false"
                class="flex-1 w-full bg-game-surface p-4 font-mono text-sm md:text-base text-game-primary resize-none outline-none focus:bg-game-bg/50 transition-colors placeholder-game-text-muted leading-relaxed"></textarea>

            <div class="p-4 border-t border-game-border flex justify-between items-center bg-game-bg/20">
                <div class="text-xs text-game-text-muted">
                    LEVEL {{ currentLevel.id }}: {{ currentLevel.title }}
                </div>
                <RunCodeButton @run-code-btn-click="runCode" :is-running="isRunning" />
            </div>
        </div>

        <!-- 右侧游戏区 -->
        <div class="flex-1 flex flex-col gap-4">

            <!-- Map Area -->
            <div
                class="flex-2 bg-black border-4 border-game-border rounded-lg relative overflow-hidden flex items-center justify-center p-8 min-h-[300px]">

                <!-- 动态网格: 使用 currentLevel.map -->
                <div class="grid gap-1 bg-game-border p-1"
                    :style="`grid-template-columns: repeat(${currentLevel.map[0]?.length}, 1fr);`">

                    <template v-for="(row, y) in currentLevel.map" :key="y">
                        <div v-for="(cell, x) in row" :key="`${x}-${y}`"
                            class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center relative transition-colors duration-300"
                            :class="{
                                'bg-game-surface': cell === 0,
                                'bg-game-text-muted': cell === 1,
                                'bg-game-accent/20': cell === 2
                            }">

                            <!-- 静态元素渲染 -->
                            <span v-if="cell === 1" class="text-game-bg text-opacity-80 text-xs">
                                <IconWall class="size-full" />
                            </span>
                            <span v-if="cell === 2" class="text-game-accent animate-pulse text-lg">
                                <IconFinishFlag class="size-6" />
                            </span>

                            <!-- 玩家渲染 (包含方向逻辑) -->
                            <div v-if="player.x === x && player.y === y"
                                class="absolute inset-0 z-10 transition-transform duration-300">
                                <!-- 背景光晕 -->
                                <div
                                    class="absolute inset-0 bg-game-primary/30 shadow-[0_0_15px_var(--color-game-primary)] rounded-full scale-75">
                                </div>

                                <!-- 根据 direction 状态切换图标 -->
                                <!-- 注意：这里使用了 v-else-if 确保只渲染一个 -->
                                <IconRobotRight v-if="direction === 'right'"
                                    class="size-full relative z-20 text-game-primary" />
                                <IconRobotLeft v-else-if="direction === 'left'"
                                    class="size-full relative z-20 text-game-primary" />
                                <IconRobotBack v-else-if="direction === 'back'"
                                    class="size-full relative z-20 text-game-primary" />
                                <IconRobotFront v-else class="size-full relative z-20 text-game-primary" />
                            </div>

                        </div>
                    </template>
                </div>
            </div>

            <!-- Log Console -->
            <div
                class="h-40 bg-game-bg border-t-4 border-game-border p-2 font-mono text-xs md:text-sm overflow-y-auto scroll-smooth">
                <div v-for="(log, i) in logs" :key="i" class="mb-1">
                    <span class="text-game-secondary">$</span>
                    <span
                        :class="log.includes('Error') || log.includes('Crash') || log.includes('Bump') ? 'text-red-400' : 'text-game-text'">
                        {{ log }}
                    </span>
                </div>
            </div>

        </div>
    </div>
</template>
