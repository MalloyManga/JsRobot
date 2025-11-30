<script setup lang="ts">
import { TileType, type LevelConfig, type Point } from '~/types/game.js'

// 定义 Props 接收数据
defineProps<{
    mapData: LevelConfig['map']
    player: Point
    direction: string
}>()
</script>

<template>
    <div
        class="flex-2 bg-black border-4 border-game-border rounded-lg relative overflow-hidden flex items-center justify-center p-8 min-h-[300px]">
        <div class="grid gap-1 bg-game-border p-1"
            :style="`grid-template-columns: repeat(${mapData[0]?.length}, 1fr);`">
            <template v-for="(row, y) in mapData" :key="y">
                <div v-for="(cell, x) in row" :key="`${x}-${y}`"
                    class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center relative transition-colors" :class="{
                        'bg-game-surface': cell === TileType.Floor,
                        'bg-game-text-muted': cell === TileType.Wall,
                        'bg-game-accent/20': cell === TileType.Goal,
                        'bg-red-900/30': cell === TileType.Trap
                    }">

                    <!-- 静态元素 -->
                    <span v-if="cell === TileType.Wall">
                        <IconWall class="size-full" />
                    </span>
                    <span v-if="cell === TileType.Goal" class="text-game-accent animate-pulse">
                        <IconFinishFlag class="size-6" />
                    </span>
                    <span v-if="cell === TileType.Trap" class="text-red-500 animate-pulse">
                        <IconTrap class="size-6 md:size-8" />
                    </span>

                    <!-- 玩家渲染 -->
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
</template>
