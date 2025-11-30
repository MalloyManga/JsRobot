<script setup lang="ts">
import { TileType, type GameEntity, type Point } from '~/types/game'

const props = defineProps<{
    map: TileType[][],
    entities: GameEntity[],
    player: Point,
    direction: string
}>()

// 获取当前格子的所有存活实体
const getEntitiesAt = (x: number, y: number) => {
    return props.entities.filter(e => e.x === x && e.y === y && !e.isCollected && !e.isDead)
}

// 辅助：判断是否有宝箱
const hasChest = (items: GameEntity[]) => items.some(e => e.type === 'chest')

// 辅助：获取值的颜色
const getValueColor = (val: any) => {
    const type = typeof val
    if (type === 'string') return 'text-green-400 border-green-400/50 bg-green-900/80'
    if (type === 'number') return 'text-blue-400 border-blue-400/50 bg-blue-900/80'
    if (type === 'boolean') return 'text-purple-400 border-purple-400/50 bg-purple-900/80'
    return 'text-white border-white/50 bg-gray-900/80'
}

// 辅助：格式化显示值
const formatValue = (val: any) => {
    if (typeof val === 'string') return `'${val}'`
    if (typeof val === 'object') return '{}'
    return String(val)
}
</script>

<template>
    <div
        class="flex-2 bg-black border-4 border-game-border rounded-lg relative overflow-hidden flex items-center justify-center p-8 min-h-[300px]">

        <div class="grid gap-1 bg-game-border p-1" :style="`grid-template-columns: repeat(${map[0]?.length}, 1fr);`">
            <template v-for="(row, y) in map" :key="y">
                <div v-for="(cell, x) in row" :key="`${x}-${y}`"
                    class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative bg-game-surface transition-colors duration-300"
                    :class="{
                        'bg-game-text-muted': cell === TileType.Wall,
                        'bg-red-900/30': cell === TileType.Trap,
                        'bg-game-accent/10': cell === TileType.Goal
                    }">

                    <!-- Layer 1: 地形 -->
                    <IconWall v-if="cell === TileType.Wall" class="size-full opacity-50" />
                    <IconTrap v-if="cell === TileType.Trap" class="size-6 text-red-500 animate-pulse" />

                    <!-- 终点 -->
                    <IconFinishFlag v-if="cell === TileType.Goal && !getEntitiesAt(x, y).some(e => e.type === 'door')"
                        class="size-6 text-game-accent animate-pulse" />

                    <!-- Layer 2: 实体堆叠 -->
                    <template v-if="getEntitiesAt(x, y).length > 0">
                        <!-- 宝箱逻辑 -->
                        <div v-if="hasChest(getEntitiesAt(x, y))"
                            class="absolute inset-0 flex items-center justify-center z-10">
                            <IconChest class="size-8 text-orange-400" />
                            <div class="absolute -top-4 flex flex-col items-center gap-0.5 z-20 pointer-events-none">
                                <div v-for="item in getEntitiesAt(x, y).filter(e => e.type !== 'chest')" :key="item.id"
                                    class="text-[8px] px-1 rounded border shadow-sm font-mono whitespace-nowrap backdrop-blur-sm scale-75 origin-bottom"
                                    :class="getValueColor(item.value)">
                                    {{ formatValue(item.value) }}
                                </div>
                            </div>
                        </div>

                        <!-- 普通实体逻辑 -->
                        <div v-else class="absolute inset-0 flex items-center justify-center z-10">
                            <template v-for="entity in [getEntitiesAt(x, y)[0]]" :key="entity!.id">

                                <template v-if="entity!.type === 'door'">
                                    <IconDoor class="size-full text-game-secondary" />
                                    <div
                                        class="absolute inset-0 flex items-center justify-center text-[8px] text-white font-mono leading-tight">
                                        REQ<br />{{ typeof entity!.required }}
                                    </div>
                                </template>

                                <template v-else-if="['key', 'weapon'].includes(entity!.type)">
                                    <IconKey v-if="entity!.type === 'key'"
                                        class="size-8 text-yellow-400 drop-shadow-md" />
                                    <IconSword v-else class="size-8 text-cyan-400 drop-shadow-md" />
                                    <span
                                        class="absolute -top-2 -right-2 text-[9px] font-bold px-1 rounded-sm border font-mono shadow-sm z-20 scale-90"
                                        :class="getValueColor(entity!.value)">
                                        {{ formatValue(entity!.value) }}
                                    </span>
                                </template>

                                <!-- [关键改动] 怪物/Boss -->
                                <template v-else-if="['monster', 'boss'].includes(entity!.type)">
                                    <IconBoss v-if="entity!.visual === 'boss'"
                                        class="size-10 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                                    <IconGhost v-else-if="entity!.visual === 'ghost'"
                                        class="size-8 text-purple-400 opacity-80" />
                                    <IconMonster v-else class="size-8 text-red-400" />

                                    <!-- [新增] ID 显示标签 (CSS Selector 风格) -->
                                    <div
                                        class="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[8px] px-1.5 py-0.5 rounded border border-red-500/50 font-mono whitespace-nowrap z-50 shadow-md">
                                        #{{ entity!.id }}
                                    </div>

                                    <!-- HP Bar -->
                                    <div v-if="entity!.hp" class="absolute -bottom-1 left-0 w-full h-1 bg-gray-800">
                                        <div class="h-full bg-red-500 transition-all duration-300"
                                            :style="`width: ${(entity!.hp || 1) * 50}%`"></div>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </template>

                    <!-- Layer 3: 玩家 -->
                    <div v-if="player.x === x && player.y === y"
                        class="absolute inset-0 z-20 transition-transform duration-300">
                        <IconRobotRight v-if="direction === 'right'" class="size-full text-game-primary" />
                        <IconRobotLeft v-else-if="direction === 'left'" class="size-full text-game-primary" />
                        <IconRobotBack v-else-if="direction === 'back'" class="size-full text-game-primary" />
                        <IconRobotFront v-else class="size-full text-game-primary" />
                    </div>

                </div>
            </template>
        </div>
    </div>
</template>
