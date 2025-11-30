<script setup lang="ts">
// 引入刚才抽离的 hooks
const {
    currentLevel,
    syncProgress,
    saveProgress,
    nextLevel
} = useLevelSystem()

const { showToast } = useToast()

// 引入游戏引擎，并传入胜利回调
const {
    player,
    direction,
    logs,
    code,
    isRunning,
    runCode,
    insertCode,
    canContinue
} = useGameEngine(currentLevel, () => {
    // 当游戏胜利时：
    saveProgress()
    setTimeout(() => {
        showToast('Level Complete!', 3000)
        nextLevel()
    }, 200)
})

// 生命周期
watch(currentLevel, (newVal) => {
    // 切关时重置代码
    code.value = newVal.initialCode || ''
}, { immediate: true })

onMounted(() => {
    syncProgress(logs) // 把 logs 传进去是为了记录 "Cloud Save Found"
})
</script>

<template>
    <div class="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">

        <!-- 左侧：编辑器区域 -->
        <div
            class="flex-1 flex flex-col bg-game-surface border-4 border-game-border rounded-lg overflow-hidden shadow-lg relative">
            <QuickCommandBar @insert="insertCode" />

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
                    <ContinueCodeButton @click="runCode(true)" :is-disabled="!canContinue" />
                    <RunCodeButton @run-code-btn-click="runCode(false)" :is-running="isRunning" />
                </div>
            </div>
        </div>

        <!-- 右侧：游戏区域 (组件化) -->
        <div class="flex-1 flex flex-col gap-4">
            <!-- 地图 -->
            <GameGrid :map-data="currentLevel.map" :player="player" :direction="direction" />
            <!-- 日志终端 -->
            <GameTerminal :logs="logs" />
        </div>

    </div>
</template>
