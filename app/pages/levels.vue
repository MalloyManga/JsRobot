<!-- pages/levels.vue -->
<script setup lang="ts">
import { levels } from '~/data/index.js'

definePageMeta({
    layout: 'default'
})
</script>

<template>
    <div class="max-w-4xl mx-auto w-full animate-fade-in space-y-6">

        <!-- 标题区 -->
        <div class="text-center space-y-2 mb-8">
            <h2 class="text-3xl text-game-primary font-black tracking-tighter uppercase">
                Mission Select
            </h2>
            <p class="text-game-text-muted text-sm">Select a simulation protocol</p>
        </div>

        <!-- 关卡列表：双列布局 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <NuxtLink v-for="(level, index) in levels" :key="level.id" :to="`/game?levelIndex=${index}`"
                class="group relative block">
                <!-- 卡片主体 -->
                <div
                    class="h-full p-4 border-2 border-game-border bg-game-surface hover:border-game-primary hover:bg-game-bg/80 transition-all duration-200 cursor-pointer flex flex-col gap-2">
                    <!-- 头部：ID 和 标题 -->
                    <div class="flex justify-between items-start">
                        <span
                            class="text-game-secondary font-mono text-xs font-bold bg-game-bg px-2 py-1 rounded border border-game-border">
                            LVL {{ level.id.toString().padStart(2, '0') }}
                        </span>
                        <!-- 难度星级 (装饰用) -->
                        <div class="flex gap-0.5">
                            <span v-for="n in (level.difficulty || 1)" :key="n"
                                class="text-yellow-500 text-xs shadow-glow">
                                ★
                            </span>
                            <span v-for="n in (5 - (level.difficulty || 1))" :key="`empty-${n}`"
                                class="text-game-border text-xs">
                                ★
                            </span>
                        </div>
                    </div>

                    <!-- 关卡名称 -->
                    <h3 class="text-xl font-bold text-game-text group-hover:text-game-primary truncate">
                        {{ level.title }}
                    </h3>

                    <!-- 描述 (如果有) -->
                    <p class="text-xs text-game-text-muted line-clamp-2">
                        {{ level.description || 'No description available for this sector.' }}
                    </p>

                    <!-- 装饰：右下角箭头 -->
                    <div
                        class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-game-primary">
                        PROCEED &rarr;
                    </div>
                </div>
            </NuxtLink>

        </div>
    </div>
</template>
