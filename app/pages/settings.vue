<!-- pages/settings.vue -->
<script setup lang="ts">

</script>

<template>
    <div class="max-w-2xl mx-auto w-full space-y-6 animate-fade-in">

        <div class="bg-game-surface border-2 border-game-border p-6 rounded-lg space-y-6">
            <h2 class="text-game-secondary text-xl border-b border-game-border pb-2">
                Audio Settings
            </h2>
            <div class="flex justify-between items-center">
                <span>Master Volume</span>
                <div class="text-game-primary">100%</div>
            </div>
        </div>

        <!-- 这里的返回其实可以用 Layout 上的，但如果页面内也想要一个 -->
        <div class="flex justify-center mt-8">
            <NuxtLink to="/" class="text-game-text-muted hover:text-game-text underline">
                Return to Menu
            </NuxtLink>
        </div>

    </div>
</template>
