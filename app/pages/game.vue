<!-- app/pages/game.vue -->
<script setup lang="ts">
import { levels } from '~/data/index.js'
import { type LevelConfig, type Point, TileType } from '~/types/game.js'

// ==========================================
// 1. 状态定义 (State)
// ==========================================

const route = useRoute()

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

// 1.3 编辑器与执行状态 (增加 || '' 防止 undefined)
const code = ref(currentLevel.value.initialCode || '')
const isRunning = ref(false)
const currentHighlightLine = ref<number>(-1)
const executionErrorLine = ref<number>(-1)
const lastExecutedIndex = ref(0)
const hasError = ref(false)

// 辅助等待函数
const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

// ==========================================
// 2. 核心函数 (Functions) - 顺序很重要！
// ==========================================

// 2.1 保存进度到服务器 (必须定义在 move 之前！！！)
const saveProgressToServer = async (levelId: number) => {
    const username = localStorage.getItem('hacker_name')
    if (!username) return

    try {
        await useFetch('/api/user/progress', {
            method: 'POST',
            body: {
                username,
                level: levelId + 1 // 解锁下一关
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
    executionErrorLine.value = -1
    hasError.value = false

    if (fullReset) {
        lastExecutedIndex.value = 0
        logs.value = []
    }
}

// 2.3 移动逻辑
const move = (dx: number, dy: number, newDir: Direction): boolean => {
    direction.value = newDir
    const newX = player.value.x + dx
    const newY = player.value.y + dy
    const map = currentLevel.value.map

    if (!map[newY] || typeof map[newY][newX] === 'undefined') {
        logs.value.push(`❌ Out of bounds!`)
        return false
    }

    const cellType = map[newY][newX]

    if (cellType === TileType.Wall) {
        logs.value.push(`❌ Hit a wall!`)
        return false
    }

    if (cellType === TileType.Trap) {
        logs.value.push(`💀 DIED! Step on trap!`)
        player.value = { ...currentLevel.value.startPos }
        return false
    }

    player.value.x = newX
    player.value.y = newY

    // 胜利判定
    if (cellType === TileType.Goal) {
        logs.value.push('🎉 GOAL REACHED!')

        // 1. 保存进度 (调用上面的函数)
        saveProgressToServer(currentLevel.value.id)

        // 2. 延时跳转
        setTimeout(() => {
            alert('Level Complete!')
            if (currentLevelIndex.value < levels.length - 1) {
                currentLevelIndex.value++
            }
        }, 200)
    }
    return true
}

// 2.4 代码运行逻辑
const runCode = async (isContinue = false) => {
    if (isRunning.value) return

    const lines = code.value.split('\n')
    if (isContinue && (hasError.value || lines.length < lastExecutedIndex.value)) {
        logs.value.push("⚠ Cannot continue. Restarting...")
        isContinue = false
    }

    isRunning.value = true
    hasError.value = false
    executionErrorLine.value = -1

    let startIndex = 0
    if (isContinue) {
        startIndex = lastExecutedIndex.value
        logs.value.push(`>> Continuing from line ${startIndex + 1}...`)
    } else {
        resetGame(true)
        logs.value.push('> Starting execution...')
    }

    for (let i = startIndex; i < lines.length; i++) {
        currentHighlightLine.value = i
        const line = lines[i]
        const cmdStr = line?.trim()

        if (!cmdStr || cmdStr.startsWith('//')) {
            await wait(100)
            continue
        }

        try {
            const match = cmdStr.match(/robot\.(moveUp|moveDown|moveLeft|moveRight)\s*\(\s*(\d*)\s*\)/)

            if (match) {
                const action = match[1]
                const steps = match[2] ? parseInt(match[2], 10) : 1

                for (let step = 0; step < steps; step++) {
                    await wait(500)
                    let success = true
                    if (action === 'moveRight') success = move(1, 0, 'right')
                    else if (action === 'moveLeft') success = move(-1, 0, 'left')
                    else if (action === 'moveUp') success = move(0, -1, 'back')
                    else if (action === 'moveDown') success = move(0, 1, 'front')

                    if (!success) throw new Error("Robot crashed")
                }
            } else {
                if (cmdStr.startsWith('robot.')) {
                    throw new Error(`Syntax Error: ${cmdStr}`)
                }
            }
            lastExecutedIndex.value = i + 1
        } catch (e: any) {
            executionErrorLine.value = i
            hasError.value = true
            logs.value.push(`❌ Error at line ${i + 1}: ${e.message}`)
            break
        }
    }

    currentHighlightLine.value = -1
    isRunning.value = false
    if (!hasError.value) {
        logs.value.push('> Execution paused/finished.')
    }
}

// 2.5 其他辅助函数
const insertCode = (snippet: string) => {
    code.value += (code.value.endsWith('\n') ? '' : '\n') + snippet
}

const handleRunAll = () => runCode(false)
const handleContinue = () => runCode(true)

const canContinue = computed(() => {
    return !isRunning.value &&
        !hasError.value &&
        lastExecutedIndex.value > 0 &&
        code.value.split('\n').length > lastExecutedIndex.value
})

const syncProgress = async () => {
    const username = localStorage.getItem('hacker_name')
    if (!username) return

    try {
        const { data } = await useFetch('/api/user/progress', {
            params: { username }
        })

        if (data.value && data.value.level) {
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
// 3. 监听器与生命周期 (放在最后)
// ==========================================

watch(currentLevel, (newVal) => {
    resetGame(true)
    code.value = newVal.initialCode || '' // 增加空字符串兜底
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

            <div class="flex-1 flex relative">
                <div
                    class="w-10 bg-game-bg border-r border-game-border flex flex-col pt-4 pb-4 font-mono text-sm leading-relaxed text-right select-none">
                    <div v-for="(_, index) in code.split('\n')" :key="index"
                        class="h-6 px-2 flex items-center justify-end gap-1 transition-colors" :class="{
                            'text-green-400 font-bold': currentHighlightLine === index,
                            'text-red-500 font-bold': executionErrorLine === index,
                            'text-game-text-muted': currentHighlightLine !== index && executionErrorLine !== index,
                            'bg-green-500/10': currentHighlightLine === index,
                            'bg-red-500/10': executionErrorLine === index
                        }">
                        <span v-if="currentHighlightLine === index" class="text-[10px]">▶</span>
                        <span v-else-if="executionErrorLine === index" class="text-[10px]">✖</span>
                        <span v-else-if="index < lastExecutedIndex" class="text-[10px] text-green-500/50">✔</span>
                        {{ index + 1 }}
                    </div>
                </div>

                <textarea v-model="code" spellcheck="false"
                    class="flex-1 bg-transparent p-4 pl-2 font-mono text-sm leading-relaxed text-game-primary resize-none outline-none z-10 whitespace-pre"
                    style="line-height: 1.5rem;"></textarea>
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
