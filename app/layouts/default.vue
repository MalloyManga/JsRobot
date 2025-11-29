<!-- layouts/default.vue -->
<script setup lang="ts">

</script>

<template>
    <div class="min-h-dvh w-full flex flex-col">
        <!-- 顶部导航栏 -->
        <header
            class="h-16 border-b-4 border-game-border bg-game-surface flex items-center justify-between px-4 sticky top-0 z-50">

            <!-- 返回按钮：使用 NuxtLink -->
            <NuxtLink to="/" aria-label="Back to Home">
                <BackButton />
            </NuxtLink>

            <!-- 标题 -->
            <h1 class="text-xl font-bold tracking-widest text-game-primary">
                JS ROBOT
            </h1>

            <!-- 右侧按钮 (比如暂停)，这里暂时没有具体路由，先放个按钮 -->
            <PauseButton />
        </header>

        <!-- 页面内容插槽：NuxtPage 的内容会渲染在这里 -->
        <main class="flex-1 p-4 flex flex-col overflow-hidden">
            <NuxtPage />
        </main>
    </div>
</template>
