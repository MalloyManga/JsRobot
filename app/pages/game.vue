<!-- app/pages/game.vue -->
<script setup lang="ts">
import { levels } from '~/data/index.js'
import { type LevelConfig, type Point, TileType } from '~/types/game.js'

// ==========================================
// 1. 状态定义 (State)
// ==========================================

const route = useRoute()
const { showToast } = useToast()

// 1.1 获取初始关卡
const getInitialLevelIndex = () => {
    const queryIdx = Number(route.query.levelIndex)
    if (!isNaN(queryIdx) && queryIdx >= 0 && queryIdx < levels.length) {
        return queryIdx
    }
    return 0
}

const currentLevelIndex = ref(getInitialLevelIndex())
const currentLevel = computed<LevelConfig>(() => {
    return levels[currentLevelIndex.value] || levels[0] as LevelConfig
})
const logs = ref<string[]>([])

// 1.2 玩家状态
const player = ref<Point>({ ...currentLevel.value.startPos })
type Direction = 'front' | 'back' | 'left' | 'right'
const direction = ref<Direction>('front')

// 1.3 编辑器与执行状态
const code = ref(currentLevel.value.initialCode || '')
const isRunning = ref(false)
const hasError = ref(false)
// 注意：高级引擎很难精确追踪“当前行”，所以高亮行功能弱化，重点在于能跑通逻辑
const currentHighlightLine = ref<number>(-1)

// 记录已执行的指令数量 (用于 Continue)
const lastExecutedCommandCount = ref(0)

// 辅助等待函数
const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

// 定义指令结构
interface Command {
    action: 'move' | 'turn'
    dir?: Direction
}

// ==========================================
// 2. 核心函数 (Functions)
// ==========================================

// 2.1 保存进度
const saveProgressToServer = async (levelId: number) => {
    const username = localStorage.getItem('hacker_name')
    if (!username) return

    try {
        await useFetch('/api/user/progress', {
            method: 'POST',
            body: {
                username,
                level: levelId + 1
            }
        })
        console.log('Progress saved to cloud!')
    } catch (e) {
        console.error('Failed to sync progress', e)
    }
}

// 2.2 重置游戏
const resetGame = (fullReset = false) => {
    player.value = { ...currentLevel.value.startPos }
    direction.value = 'front'
    currentHighlightLine.value = -1
    hasError.value = false

    if (fullReset) {
        lastExecutedCommandCount.value = 0
        logs.value = []
    }
}

// 2.3 移动逻辑 (物理层)
const move = (dx: number, dy: number, newDir: Direction): boolean => {
    direction.value = newDir
    const newX = player.value.x + dx
    const newY = player.value.y + dy
    const map = currentLevel.value.map

    // 越界
    if (!map[newY] || typeof map[newY][newX] === 'undefined') {
        logs.value.push(`❌ Out of bounds!`)
        return false
    }

    const cellType = map[newY][newX]

    // 撞墙
    if (cellType === TileType.Wall) {
        logs.value.push(`❌ Hit a wall!`)
        return false
    }

    // 陷阱
    if (cellType === TileType.Trap) {
        logs.value.push(`💀 DIED! Step on trap!`)
        player.value = { ...currentLevel.value.startPos }
        return false
    }

    // 移动成功
    player.value.x = newX
    player.value.y = newY

    // 胜利
    if (cellType === TileType.Goal) {
        logs.value.push('🎉 GOAL REACHED!')
        saveProgressToServer(currentLevel.value.id)
        setTimeout(() => {
            showToast('Level Complete!', 3000)
            if (currentLevelIndex.value < levels.length - 1) {
                currentLevelIndex.value++
            }
        }, 200)
    }
    return true
}

// 2.4 代码运行逻辑 (逻辑层 - 升级版引擎)
const runCode = async (isContinue = false) => {
    if (isRunning.value) return

    // 如果不是 Continue，先重置
    if (!isContinue) {
        resetGame(true)
        logs.value.push('> System Initialized...')
    }

    isRunning.value = true
    hasError.value = false

    // === 第一阶段：编译 (使用 new Function) ===
    const commandQueue: Command[] = []

    // 伪造 robot 对象
    const robotApi = {
        moveUp: (steps = 1) => {
            for (let i = 0; i < steps; i++) commandQueue.push({ action: 'move', dir: 'back' })
        },
        moveDown: (steps = 1) => {
            for (let i = 0; i < steps; i++) commandQueue.push({ action: 'move', dir: 'front' })
        },
        moveLeft: (steps = 1) => {
            for (let i = 0; i < steps; i++) commandQueue.push({ action: 'move', dir: 'left' })
        },
        moveRight: (steps = 1) => {
            for (let i = 0; i < steps; i++) commandQueue.push({ action: 'move', dir: 'right' })
        }
    }

    try {
        // 沙箱执行用户代码
        const userFunc = new Function('robot', code.value)
        userFunc(robotApi)
        logs.value.push(`> Logic Valid. Queue size: ${commandQueue.length}`)
    } catch (e: any) {
        hasError.value = true
        logs.value.push(`❌ Syntax/Runtime Error: ${e.message}`)
        isRunning.value = false
        return
    }

    // === 第二阶段：执行队列 ===
    // 决定从哪里开始执行 (Continue 逻辑)
    let startIndex = 0
    if (isContinue) {
        // 如果是 Continue，只执行新增的指令
        if (commandQueue.length <= lastExecutedCommandCount.value) {
            logs.value.push('> No new commands generated.')
            isRunning.value = false
            return
        }
        startIndex = lastExecutedCommandCount.value
        logs.value.push(`>> Resuming from command ${startIndex + 1}...`)
    }

    const commandsToRun = commandQueue.slice(startIndex)

    for (const cmd of commandsToRun) {
        if (hasError.value) break // 如果中途撞墙，停止

        if (cmd.action === 'move' && cmd.dir) {
            await wait(500) // 动画间隔

            // 计算 delta
            let dx = 0, dy = 0
            if (cmd.dir === 'right') dx = 1
            if (cmd.dir === 'left') dx = -1
            if (cmd.dir === 'front') dy = 1
            if (cmd.dir === 'back') dy = -1

            const success = move(dx, dy, cmd.dir)
            if (!success) {
                hasError.value = true
                break
            }
        }
    }

    if (!hasError.value) {
        lastExecutedCommandCount.value = commandQueue.length
        logs.value.push('> Execution paused/finished.')
    }

    isRunning.value = false
}

// 2.5 辅助函数
const insertCode = (snippet: string) => {
    code.value += (code.value.endsWith('\n') ? '' : '\n') + snippet
}

const handleRunAll = () => runCode(false)
const handleContinue = () => runCode(true)

// Continue 按钮可用状态：没在跑 && 没报错 && 队列变长了
const canContinue = computed(() => {
    // 这里简单判断：只要不报错且不为空就可以尝试 Continue
    // 真实的队列长度判断需要先跑一遍编译，为了性能这里简化处理
    return !isRunning.value && !hasError.value && lastExecutedCommandCount.value > 0
})

const syncProgress = async () => {
    const username = localStorage.getItem('hacker_name')
    if (!username) return

    if (route.query.levelIndex !== undefined && route.query.levelIndex !== null) {
        return
    }

    try {
        const { data } = await useFetch<{ level: number }>('/api/user/progress', {
            params: { username }
        })

        if (data.value && typeof data.value.level === 'number') {
            const serverLevelId = data.value.level
            const savedIndex = serverLevelId - 1

            if (currentLevelIndex.value === 0 && savedIndex > 0) {
                currentLevelIndex.value = savedIndex
                logs.value.push(`>> Cloud Save Found: Warping to Level ${serverLevelId}...`)
            }
        }
    } catch (e) {
        console.error('Sync failed', e)
    }
}

// ==========================================
// 3. 监听器与生命周期
// ==========================================

watch(currentLevel, (newVal) => {
    resetGame(true)
    code.value = newVal.initialCode || ''
    logs.value.push(`> Loaded Level ${newVal.id}: ${newVal.title}`)
}, { immediate: true })

onMounted(() => {
    syncProgress()
})
</script>

<template>
    <div class="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">

        <!-- 左侧：IDE 区域 -->
        <div
            class="flex-1 flex flex-col bg-game-surface border-4 border-game-border rounded-lg overflow-hidden shadow-lg relative">

            <QuickCommandBar @insert="insertCode" />

            <!-- 编辑器主体 -->
            <div class="flex-1 flex relative overflow-hidden bg-[#1e1e1e]">
                <ClientOnly fallback-tag="div" fallback="Loading Editor...">
                    <CodeEditor v-model="code" />
                </ClientOnly>
            </div>

            <div class="p-4 border-t border-game-border flex justify-between items-center bg-game-bg/20">
                <div class="text-xs text-game-text-muted font-bold tracking-wider uppercase">
                    LEVEL {{ currentLevel.id }}: {{ currentLevel.title }}
                </div>

                <div class="flex gap-2">
                    <!-- 修复：属性名应为 :disabled，而不是 :is-disabled -->
                    <ContinueCodeButton @click="handleContinue" :is-disabled="!canContinue" />

                    <RunCodeButton @run-code-btn-click="handleRunAll" :is-running="isRunning" />
                </div>
            </div>
        </div>

        <!-- 右侧：游戏区域 -->
        <div class="flex-1 flex flex-col gap-4">
            <div
                class="flex-2 bg-black border-4 border-game-border rounded-lg relative overflow-hidden flex items-center justify-center p-8 min-h-[300px]">
                <div class="grid gap-1 bg-game-border p-1"
                    :style="`grid-template-columns: repeat(${currentLevel.map[0]?.length}, 1fr);`">
                    <template v-for="(row, y) in currentLevel.map" :key="y">
                        <div v-for="(cell, x) in row" :key="`${x}-${y}`"
                            class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center relative" :class="{
                                'bg-game-surface': cell === TileType.Floor,
                                'bg-game-text-muted': cell === TileType.Wall,
                                'bg-game-accent/20': cell === TileType.Goal,
                                'bg-red-900/30': cell === TileType.Trap
                            }">
                            <span v-if="cell === TileType.Wall">
                                <IconWall class="size-full" />
                            </span>
                            <span v-if="cell === TileType.Goal" class="text-game-accent animate-pulse">
                                <IconFinishFlag class="size-6" />
                            </span>
                            <span v-if="cell === TileType.Trap" class="text-red-500 animate-pulse">
                                <IconTrap class="size-6 md:size-8" />
                            </span>

                            <div v-if="player.x === x && player.y === y"
                                class="absolute inset-0 z-10 transition-transform duration-300">
                                <IconRobotRight v-if="direction === 'right'" class="size-full text-game-primary" />
                                <IconRobotLeft v-else-if="direction === 'left'" class="size-full text-game-primary" />
                                <IconRobotBack v-else-if="direction === 'back'" class="size-full text-game-primary" />
                                <IconRobotFront v-else class="size-full text-game-primary" />
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div
                class="h-40 bg-game-bg border-t-4 border-game-border p-2 font-mono text-xs md:text-sm overflow-y-auto scroll-smooth">
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
