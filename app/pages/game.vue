<!-- pages/game.vue -->
<script setup lang="ts">
// 默认使用 layouts/default.vue，无需声明 definePageMeta

// === 1. 游戏状态定义 ===
// 0: 地板, 1: 墙, 2: 终点
const mapData = ref([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 2, 1],
    [1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
])

// 玩家初始位置 (x: 列, y: 行)
const playerStart = { x: 1, y: 1 }
const player = ref({ ...playerStart })

// 用户输入的代码
const code = ref('// 试着让机器人走到终点\nrobot.moveRight();\nrobot.moveRight();\nrobot.moveDown();')

// 控制台日志
const logs = ref<string[]>([])
const isRunning = ref(false)

// === 2. 核心逻辑：极其简单的代码解析器 (MVP Hack) ===
const runCode = async () => {
    if (isRunning.value) return
    isRunning.value = true
    logs.value = ['> System Initialized...', '> Parsing Code...']

    // 重置位置
    player.value = { ...playerStart }

    // 简单的解析逻辑：按换行符分割，查找关键字
    const lines = code.value.split('\n')

    for (const line of lines) {
        const command = line.trim()
        if (!command || command.startsWith('//')) continue

        // 模拟执行延迟，让人眼能看清动作
        await new Promise(r => setTimeout(r, 500))

        if (command.includes('moveRight()')) move(1, 0)
        else if (command.includes('moveLeft()')) move(-1, 0)
        else if (command.includes('moveUp()')) move(0, -1)
        else if (command.includes('moveDown()')) move(0, 1)
        else {
            logs.value.push(`⚠ Error: Unknown command "${command}"`)
        }
    }

    logs.value.push('> Execution Finished.')
    isRunning.value = false
}

// 移动逻辑 & 碰撞检测
const move = (dx: number, dy: number) => {
    const newX = player.value.x + dx
    const newY = player.value.y + dy

    // 检查是否撞墙 (mapData[y][x] === 1)
    if (mapData.value[newY]?.[newX] === 1) {
        logs.value.push(`❌ Crash! Hit wall at [${newX}, ${newY}]`)
        // 撞墙动画或者震动逻辑可以在这里加
        return
    }

    // 检查越界（如果目标格不存在则阻止移动）
    if (!mapData.value[newY] || typeof mapData.value[newY][newX] === 'undefined') {
        logs.value.push(`❌ Invalid move: out of bounds [${newX}, ${newY}]`)
        return
    }

    // 移动
    player.value.x = newX
    player.value.y = newY
    logs.value.push(`✔ Moved to [${newX}, ${newY}]`)

    // 检查胜利
    if (mapData.value[newY]?.[newX] === 2) {
        logs.value.push('🎉 VICTORY! Target Reached!')
        alert('🎉 VICTORY! You coded your way out!')
    }
}
</script>

<template>
    <div class="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">

        <!-- Left: Code Editor -->
        <div
            class="flex-1 flex flex-col bg-game-surface border-4 border-game-border rounded-lg overflow-hidden shadow-lg">
            <!-- Editor Header -->
            <div class="flex justify-between items-center px-4 py-2 bg-game-border/30 border-b border-game-border">
                <span class="text-game-secondary text-xs uppercase tracking-widest font-bold">script.js</span>
                <div class="flex gap-2">
                    <div class="w-2 h-2 rounded-full bg-red-500/50"></div>
                    <div class="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    <div class="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
            </div>

            <!-- Textarea simulating code editor -->
            <textarea v-model="code" spellcheck="false"
                class="flex-1 w-full bg-game-surface p-4 font-mono text-sm md:text-base text-game-primary resize-none outline-none focus:bg-game-bg/50 transition-colors placeholder-game-text-muted leading-relaxed"></textarea>

            <!-- Action Bar -->
            <div class="p-4 border-t border-game-border flex justify-between items-center bg-game-bg/20">
                <div class="text-xs text-game-text-muted">STATUS: {{ isRunning ? 'RUNNING...' : 'READY' }}</div>
                <RunCodeButton @run-code-btn-click="runCode" :is-running="isRunning" />
            </div>
        </div>

        <!-- Right: Game View + Console -->
        <div class="flex-1 flex flex-col gap-4">

            <!-- 1. The Map (Visual Grid) -->
            <div
                class="flex-2 bg-black border-4 border-game-border rounded-lg relative overflow-hidden flex items-center justify-center p-8 min-h-[300px]">

                <!-- Grid Container -->
                <div class="grid gap-1 bg-game-border p-1"
                    :style="`grid-template-columns: repeat(${mapData[0]?.length}, 1fr);`">
                    <!-- Double Loop for rendering cells -->
                    <template v-for="(row, y) in mapData" :key="y">
                        <div v-for="(cell, x) in row" :key="`${x}-${y}`"
                            class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center relative" :class="{
                                'bg-game-surface': cell === 0, // Floor
                                'bg-game-text-muted': cell === 1, // Wall (Grey)
                                'bg-game-accent/20': cell === 2  // Goal (Orange tint)
                            }">
                            <!-- <span v-if="cell === 0">
                                <IconGround class="size-full" />
                            </span> -->

                            <!-- Wall Visual -->
                            <span v-if="cell === 1" class="text-game-bg text-opacity-80 text-xs">
                                <IconWall class="size-full" />
                            </span>

                            <!-- Goal Visual -->
                            <span v-if="cell === 2" class="text-game-accent animate-pulse text-lg">
                                <IconFinishFlag class="size-6" />
                            </span>

                            <!-- Player Visual (Overlay) -->
                            <!-- 使用绝对定位 + 简单的 v-if 判断是否在此格子 -->
                            <div v-if="player.x === x && player.y === y"
                                class="absolute inset-0 bg-game-primary shadow-[0_0_15px_var(--color-game-primary)] z-10">
                                <!-- Robot Face SVG -->
                                <!-- <svg viewBox="0 0 24 24" class="w-full h-full text-game-bg p-1" fill="currentColor">
                                    <path d="M4 4h16v16H4z" />
                                    <path d="M7 8h2v2H7zm8 0h2v2h-2z" fill="white" />
                                    <path d="M7 14h10" stroke="white" stroke-width="2" />
                                </svg> -->
                                <!-- <IconRobotFront class="size-full" /> -->
                                <IconRobotBack class="size-full" />
                                <!-- <IconRobotRight class="size-full" /> -->
                                <!-- <IconRobotLeft class="size-full" /> -->
                            </div>
                        </div>
                    </template>
                </div>

            </div>

            <!-- 2. The Console (Logs) -->
            <div class="h-40 bg-game-bg border-t-4 border-game-border p-2 font-mono text-xs md:text-sm overflow-y-auto">
                <div v-for="(log, i) in logs" :key="i" class="mb-1">
                    <span class="text-game-secondary">$</span>
                    <span :class="log.includes('Error') || log.includes('Crash') ? 'text-red-400' : 'text-game-text'">
                        {{ log }}
                    </span>
                </div>
            </div>

        </div>

    </div>
</template>
