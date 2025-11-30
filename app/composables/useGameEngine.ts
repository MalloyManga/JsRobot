// app/composables/useGameEngine.ts
import { TileType, type LevelConfig, type Point, type GameEntity } from '~/types/game.js'

type Direction = 'front' | 'back' | 'left' | 'right'

interface Command {
    action: 'move' | 'turn' | 'pickup' | 'attack'
    dir?: Direction
    targetId?: string
    param?: string
}

export const useGameEngine = (
    currentLevel: Ref<LevelConfig>,
    onWin: () => void
) => {
    const { showToast } = useToast()

    const player = ref<Point>({ x: 1, y: 1 })
    const direction = ref<Direction>('front')
    const entities = ref<GameEntity[]>([])
    const backpack = ref<GameEntity[]>([])
    const logs = ref<string[]>([])
    const code = ref('')
    const isRunning = ref(false)
    const hasError = ref(false)
    const lastExecutedCommandCount = ref(0)

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
    const insertCode = (snippet: string) => code.value += (code.value.endsWith('\n') ? '' : '\n') + snippet

    watch(currentLevel, (newVal) => {
        player.value = { ...newVal.startPos }
        direction.value = 'front'
        entities.value = JSON.parse(JSON.stringify(newVal.entities || []))
        backpack.value = []
        logs.value = []
        logs.value.push(`> System Loaded: ${newVal.title}`)
        code.value = newVal.initialCode || ''
        isRunning.value = false
        hasError.value = false
        lastExecutedCommandCount.value = 0
    }, { immediate: true })

    const getEntityAt = (x: number, y: number) => {
        return entities.value.find(e => e.x === x && e.y === y && !e.isCollected && !e.isDead)
    }

    const executeAction = async (cmd: Command) => {
        // === 1. Move ===
        if (cmd.action === 'move' && cmd.dir) {
            direction.value = cmd.dir
            let dx = 0, dy = 0
            if (cmd.dir === 'right') dx = 1
            if (cmd.dir === 'left') dx = -1
            if (cmd.dir === 'front') dy = 1
            if (cmd.dir === 'back') dy = -1

            const newX = player.value.x + dx
            const newY = player.value.y + dy
            const map = currentLevel.value.map

            // 越界/墙壁
            if (!map[newY] || typeof map[newY][newX] === 'undefined' || map[newY][newX] === TileType.Wall) {
                logs.value.push(`❌ Bonk! Wall ahead.`)
                return false
            }

            // 实体碰撞 (Door)
            const obstacle = getEntityAt(newX, newY)
            if (obstacle && obstacle.type === 'door') {
                const key = backpack.value.find(item => item.value === obstacle.required)
                if (key) {
                    logs.value.push(`🔓 Door Unlocked!`)
                    obstacle.isDead = true
                    await wait(300)
                } else {
                    logs.value.push(`🔒 Locked! Need ${typeof obstacle.required} ${obstacle.required}`)
                    showToast(`Locked! Need ${typeof obstacle.required}`, 2000)
                    return false
                }
            }

            // 怪物碰撞
            if (obstacle && (obstacle.type === 'monster' || obstacle.type === 'boss')) {
                logs.value.push(`💀 Enemy ahead! Attack it first!`)
                showToast('Enemy ahead! Attack!', 1000)
                return false
            }

            player.value.x = newX
            player.value.y = newY

            if (map[newY][newX] === TileType.Goal) {
                onWin()
            }
        }

        // === 2. PickUp (Safe Version) ===
        if (cmd.action === 'pickup') {
            const x = player.value.x
            const y = player.value.y

            // 获取脚下所有可捡物品 (Key/Weapon)
            const availableItems = entities.value.filter(e =>
                e.x === x && e.y === y && !e.isCollected && (e.type === 'key' || e.type === 'weapon')
            )

            if (availableItems.length === 0) {
                logs.value.push(`⚠ Nothing to pickup.`)
                return true
            }

            let targetItem: GameEntity | undefined

            if (cmd.param) {
                // 如果指定了类型，严格筛选
                targetItem = availableItems.find(item => typeof item.value === cmd.param)
                if (!targetItem) {
                    logs.value.push(`⚠ No item of type '${cmd.param}' found here.`)
                    return true
                }
            } else {
                // 没指定类型，默认捡第一个
                targetItem = availableItems[0]
            }

            // 执行捡起
            if (targetItem) {
                targetItem.isCollected = true
                backpack.value.push(targetItem)
                logs.value.push(`📦 Picked up: ${typeof targetItem.value} (${targetItem.value})`)
            }
        }

        // === 3. Attack ===
        if (cmd.action === 'attack' && cmd.targetId) {
            const enemy = entities.value.find(e => e.id === cmd.targetId)

            if (enemy && !enemy.isDead) {
                const dist = Math.abs(enemy.x - player.value.x) + Math.abs(enemy.y - player.value.y)
                if (dist > 1) {
                    logs.value.push(`⚠ Target too far!`)
                    return true
                }

                const weakness = enemy.weakness || 'string'
                const hasWeapon = backpack.value.some(item => typeof item.value === weakness)

                if (!hasWeapon) {
                    logs.value.push(`❌ Immune! Need ${weakness.toUpperCase()} weapon!`)
                    showToast(`Immune! Need ${weakness} weapon!`, 2000)
                    enemy.isHit = true
                    setTimeout(() => enemy.isHit = false, 300)
                    return true
                }

                enemy.isHit = true
                setTimeout(() => enemy.isHit = false, 300)
                await wait(200)

                if (enemy.hp && enemy.hp > 1) {
                    enemy.hp--
                    logs.value.push(`⚔ Hit! HP Left: ${enemy.hp}`)
                    enemy.id = enemy.id + "_phase2"
                    enemy.weakness = enemy.weakness === 'string' ? 'number' : 'string'
                    logs.value.push(`⚠ Boss Mutated! Weakness: ${enemy.weakness.toUpperCase()}`)
                } else {
                    enemy.isDead = true
                    logs.value.push(`💀 Enemy Destroyed!`)
                }
            } else {
                logs.value.push(`⚠ Invalid target.`)
            }
        }

        return true
    }

    const runCode = async (isContinue = false) => {
        if (isRunning.value) return
        if (!isContinue) {
            player.value = { ...currentLevel.value.startPos }
            entities.value = JSON.parse(JSON.stringify(currentLevel.value.entities || []))
            backpack.value = []
            direction.value = 'front'
            lastExecutedCommandCount.value = 0
            logs.value = ['> System Initialized...']
        }

        isRunning.value = true
        hasError.value = false
        const commandQueue: Command[] = []

        // [核心增强] Mock DOM
        const mockDocument = {
            querySelector: (selector: string) => {
                const id = selector.startsWith('#') ? selector.slice(1) : selector
                // 查找活着的/未被捡的实体
                const entity = entities.value.find(e => e.id === id && !e.isDead && !e.isCollected)

                if (!entity) return null

                // 返回模拟的 DOM 对象
                const domNode: any = {
                    id: entity.id,
                    type: entity.type,
                    weakness: entity.weakness, // 怪物属性
                    hp: entity.hp
                }

                // 如果是宝箱，注入 contents 属性，告诉用户里面有哪些类型
                if (entity.type === 'chest') {
                    // 找到和宝箱在同一个位置的所有物品
                    const itemsInside = entities.value.filter(e =>
                        e.x === entity.x && e.y === entity.y && e.type !== 'chest' && !e.isCollected
                    )
                    domNode.contents = itemsInside.map(i => typeof i.value) // ['string', 'number']
                }

                return domNode
            }
        }

        const robotApi = {
            moveUp: (n = 1) => { for (let i = 0; i < n; i++) commandQueue.push({ action: 'move', dir: 'back' }) },
            moveDown: (n = 1) => { for (let i = 0; i < n; i++) commandQueue.push({ action: 'move', dir: 'front' }) },
            moveLeft: (n = 1) => { for (let i = 0; i < n; i++) commandQueue.push({ action: 'move', dir: 'left' }) },
            moveRight: (n = 1) => { for (let i = 0; i < n; i++) commandQueue.push({ action: 'move', dir: 'right' }) },
            pickUp: (type?: string) => commandQueue.push({ action: 'pickup', param: type }),
            attack: (target: any) => {
                if (!target || !target.id) throw new Error("Invalid attack target")
                commandQueue.push({ action: 'attack', targetId: target.id })
            }
        }

        try {
            const userFunc = new Function('robot', 'document', code.value)
            userFunc(robotApi, mockDocument)
        } catch (e: any) {
            hasError.value = true
            logs.value.push(`❌ Runtime Error: ${e.message}`)
            isRunning.value = false
            return
        }

        let startIndex = isContinue ? lastExecutedCommandCount.value : 0
        const commandsToRun = commandQueue.slice(startIndex)

        for (const cmd of commandsToRun) {
            if (hasError.value) break
            await wait(400)
            await executeAction(cmd)
        }

        if (!hasError.value) lastExecutedCommandCount.value = commandQueue.length
        isRunning.value = false
    }

    return {
        player, direction, entities, backpack,
        logs, code, isRunning, runCode, insertCode,
        canContinue: computed(() => !isRunning.value && !hasError.value && lastExecutedCommandCount.value > 0)
    }
}
