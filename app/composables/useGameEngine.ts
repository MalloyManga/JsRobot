// app/composables/useGameEngine.ts
import { TileType, type LevelConfig, type Point } from '~/types/game'

type Direction = 'front' | 'back' | 'left' | 'right'

interface Command {
    action: 'move' | 'turn'
    dir?: Direction
}

export const useGameEngine = (
    currentLevel: Ref<LevelConfig>,
    onWin: () => void // 通关时的回调
) => {
    const { showToast } = useToast()

    // 状态
    const player = ref<Point>({ ...currentLevel.value.startPos })
    const direction = ref<Direction>('front')
    const logs = ref<string[]>([])
    const code = ref('')
    const isRunning = ref(false)
    const hasError = ref(false)
    const lastExecutedCommandCount = ref(0) // 用于 Continue

    // 辅助函数
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
    const insertCode = (snippet: string) => code.value += (code.value.endsWith('\n') ? '' : '\n') + snippet

    watch(currentLevel, (newVal) => {
        // 1. 重置玩家位置 (Bug 1 修复)
        player.value = { ...newVal.startPos }
        direction.value = 'front'

        // 2. 清空日志并添加欢迎语 (Bug 2 修复)
        logs.value = []
        logs.value.push(`> Loaded Level ${newVal.id}: ${newVal.title}`)

        // 3. 重置代码编辑器内容
        code.value = newVal.initialCode || ''

        // 4. 重置执行状态
        isRunning.value = false
        hasError.value = false
        lastExecutedCommandCount.value = 0
    }, { immediate: true })

    // === 物理层：移动逻辑 ===
    const move = (dx: number, dy: number, newDir: Direction): boolean => {
        direction.value = newDir
        const newX = player.value.x + dx
        const newY = player.value.y + dy
        const map = currentLevel.value.map

        // 边界检查
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

        // 移动
        player.value.x = newX
        player.value.y = newY

        // 胜利
        if (cellType === TileType.Goal) {
            logs.value.push('🎉 GOAL REACHED!')
            onWin() // 触发回调
        }
        return true
    }

    // === 逻辑层：执行引擎 ===
    const runCode = async (isContinue = false) => {
        if (isRunning.value) return

        // 重置
        if (!isContinue) {
            player.value = { ...currentLevel.value.startPos }
            direction.value = 'front'
            hasError.value = false
            lastExecutedCommandCount.value = 0
            logs.value = [] // 这里可以选择不清空，看需求
            logs.value.push('> System Initialized...')
        }

        isRunning.value = true
        hasError.value = false
        const commandQueue: Command[] = []

        // Mock API
        const robotApi = {
            moveUp: (n = 1) => { for (let i = 0; i < n; i++) commandQueue.push({ action: 'move', dir: 'back' }) },
            moveDown: (n = 1) => { for (let i = 0; i < n; i++) commandQueue.push({ action: 'move', dir: 'front' }) },
            moveLeft: (n = 1) => { for (let i = 0; i < n; i++) commandQueue.push({ action: 'move', dir: 'left' }) },
            moveRight: (n = 1) => { for (let i = 0; i < n; i++) commandQueue.push({ action: 'move', dir: 'right' }) }
        }

        // 编译
        try {
            const userFunc = new Function('robot', code.value)
            userFunc(robotApi)
        } catch (e: any) {
            hasError.value = true
            logs.value.push(`❌ Syntax Error: ${e.message}`)
            isRunning.value = false
            return
        }

        // 执行队列 (支持 Continue)
        let startIndex = 0
        if (isContinue) {
            if (commandQueue.length <= lastExecutedCommandCount.value) {
                logs.value.push('> No new commands.')
                isRunning.value = false
                return
            }
            startIndex = lastExecutedCommandCount.value
            logs.value.push(`>> Resuming from step ${startIndex}...`)
        }

        const commandsToRun = commandQueue.slice(startIndex)

        for (const cmd of commandsToRun) {
            if (hasError.value) break
            if (cmd.action === 'move' && cmd.dir) {
                await wait(500)
                let dx = 0, dy = 0
                if (cmd.dir === 'right') dx = 1
                if (cmd.dir === 'left') dx = -1
                if (cmd.dir === 'front') dy = 1
                if (cmd.dir === 'back') dy = -1

                if (!move(dx, dy, cmd.dir)) {
                    hasError.value = true
                    break
                }
            }
        }

        if (!hasError.value) {
            lastExecutedCommandCount.value = commandQueue.length
            logs.value.push('> Sequence Complete.')
        }
        isRunning.value = false
    }

    // Continue 检查
    const canContinue = computed(() => {
        return !isRunning.value && !hasError.value && lastExecutedCommandCount.value > 0
    })

    return {
        player,
        direction,
        logs,
        code,
        isRunning,
        runCode,
        insertCode,
        canContinue
    }
}
