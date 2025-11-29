<!-- pages/index.vue -->
<script setup lang="ts">
definePageMeta({
    layout: 'home'
})
</script>

<template>
    <div class="flex flex-col items-center gap-12">

        <!-- LOGO 区域 -->
        <div class="flex flex-col items-center gap-4">
            <div class="w-32 h-32 text-game-primary">
                <!-- 像素机器人 SVG -->
                <IconBanner />
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
            <NuxtLink to="/levels">
                <LevelsButton />
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
