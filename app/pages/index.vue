<!-- pages/index.vue -->
<script setup lang="ts">
definePageMeta({
    layout: 'home'
})
</script>

<template>
    <div class="flex flex-col items-center gap-12">

        <!-- LOGO 区域 -->
        <div class="flex flex-col items-center gap-4 animate-bounce">
            <div class="w-32 h-32 text-game-primary">
                <!-- 像素机器人 SVG -->
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="4" opacity="0.2" />
                    <path d="M4 8h16v12H4z" fill="none" stroke="currentColor" stroke-width="2" />
                    <rect x="7" y="12" width="2" height="2" />
                    <rect x="15" y="12" width="2" height="2" />
                    <path d="M8 17h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M12 2v3M5 5l2 2M19 5l-2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
            </div>
            <h1 class="text-5xl font-black tracking-tighter drop-shadow-md">
                JS ROBOT
            </h1>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex flex-col w-full gap-4">

            <!-- 开始游戏 (直接跳到 game 页面) -->
            <NuxtLink to="/game">
                <StartGameButton />
            </NuxtLink>

            <!-- 继续游戏 -->
            <NuxtLink to="/game">
                <ContinueGameButton />
            </NuxtLink>

            <!-- 设置 -->
            <NuxtLink to="/settings">
                <SettingsButton />
            </NuxtLink>

        </nav>

        <footer class="mt-8 text-game-text-muted text-xs">
            JsRobot Team BUILD v0.1
        </footer>
    </div>
</template>
