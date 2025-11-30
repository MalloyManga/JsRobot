<script setup lang="ts">
// 引入刚才抽离的 hooks
const {
    currentLevel,
    syncProgress,
    saveProgress,
    nextLevel
} = useLevelSystem()

const { showToast } = useToast()

// 引入游戏引擎
const {
    player,
    direction,
    entities, // [新增] 需要传给 Grid
    backpack, // [新增] 用于展示背包 UI
    logs,
    code,
    isRunning,
    runCode,
    insertCode,
    canContinue
} = useGameEngine(currentLevel, () => {
    // 胜利回调
    saveProgress()
    // 稍微延迟一点，让玩家看到走到终点的动画
    setTimeout(() => {
        showToast('MISSION ACCOMPLISHED!', 3000)
        nextLevel()
    }, 500)
})

// 生命周期管理
watch(currentLevel, (newVal) => {
    code.value = newVal.initialCode || ''
}, { immediate: true })

onMounted(() => {
    // 传入 logs 是为了让 syncProgress 能往终端里打印 "Cloud Save Found"
    syncProgress(logs)
})

// 辅助：获取值的颜色 (用于背包显示)
const getValueColor = (val: any) => {
    const type = typeof val
    if (type === 'string') return 'text-green-400'
    if (type === 'number') return 'text-blue-400'
    if (type === 'boolean') return 'text-purple-400'
    return 'text-white'
}
</script>

<template>
    <div class="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">

        <!-- 左侧：编辑器区域 -->
        <div
            class="flex-1 flex flex-col bg-game-surface border-4 border-game-border rounded-lg overflow-hidden shadow-lg relative">
            <!-- 快捷指令 -->
            <QuickCommandBar @insert="insertCode" />

            <!-- Monaco Editor -->
            <div class="flex-1 flex relative overflow-hidden bg-[#1e1e1e]">
                <ClientOnly fallback-tag="div" fallback="Loading Editor...">
                    <CodeEditor v-model="code" />
                </ClientOnly>
            </div>

            <!-- 底部操作栏 -->
            <div class="p-4 border-t border-game-border flex justify-between items-center bg-game-bg/20">
                <div class="text-xs text-game-text-muted font-bold tracking-wider uppercase">
                    LEVEL {{ currentLevel.id }}: {{ currentLevel.title }}
                </div>
                <div class="flex gap-2">
                    <ContinueCodeButton @click="runCode(true)" :is-disabled="!canContinue" />
                    <RunCodeButton @run-code-btn-click="runCode(false)" :is-running="isRunning" />
                </div>
            </div>
        </div>

        <!-- 右侧：游戏区域 -->
        <div class="flex-1 flex flex-col gap-4">

            <!-- [新增] 背包系统 UI -->
            <div
                class="flex items-center gap-3 bg-game-surface border-2 border-game-border p-3 rounded shadow-md min-h-[60px]">
                <span class="text-xs font-bold text-game-text-muted uppercase tracking-widest">Inventory:</span>

                <div class="flex flex-wrap gap-2">
                    <div v-for="(item, i) in backpack" :key="i"
                        class="relative group bg-black/40 p-1.5 rounded border border-game-border hover:border-game-primary transition-colors cursor-help">
                        <!-- 图标 -->
                        <IconKey v-if="item.type === 'key'" class="size-5 text-yellow-400" />
                        <IconSword v-else class="size-5 text-cyan-400" />

                        <!-- 值标签 -->
                        <span
                            class="absolute -bottom-1 -right-1 text-[8px] font-bold bg-black px-1 rounded border border-white/10 font-mono"
                            :class="getValueColor(item.value)">
                            {{ typeof item.value === 'string' ? `'${item.value}'` : item.value }}
                        </span>

                        <!-- Hover Tooltip -->
                        <div
                            class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-game-surface border border-game-primary text-[10px] text-white px-2 py-1 rounded shadow-xl hidden group-hover:block z-50 whitespace-nowrap">
                            <span class="text-game-text-muted">Type:</span> <span :class="getValueColor(item.value)">{{
                                typeof item.value }}</span><br>
                            <span class="text-game-text-muted">Value:</span> {{ item.value }}
                        </div>
                    </div>

                    <!-- 空背包提示 -->
                    <div v-if="backpack.length === 0"
                        class="text-xs text-game-text-muted italic flex items-center h-full opacity-50">
                        [ Empty ]
                    </div>
                </div>
            </div>

            <!-- 地图 (传入 map, entities, player, direction) -->
            <GameGrid :map="currentLevel.map" :entities="entities" :player="player" :direction="direction" />

            <!-- 日志终端 -->
            <GameTerminal :logs="logs" />
        </div>

    </div>
</template>
