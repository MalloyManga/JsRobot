<!-- layouts/default.vue -->
<script setup lang="ts">
const router = useRouter()
// 使用 Nuxt 的 useCookie 或者 onMounted 读取 localStorage
const username = ref('')

onMounted(() => {
    username.value = localStorage.getItem('hacker_name') || ''
})

const handleLogout = () => {
    localStorage.removeItem('hacker_token')
    localStorage.removeItem('hacker_name')
    username.value = ''
    router.push('/')
}
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
            <!-- <PauseButton /> -->
            <div class="flex items-center gap-3">

                <template v-if="username">
                    <!-- 已登录状态 -->
                    <div class="hidden md:flex flex-col items-end mr-2">
                        <span class="text-[10px] text-game-text-muted uppercase">Operator</span>
                        <span class="text-xs font-bold text-game-secondary font-mono">{{ username }}</span>
                    </div>
                    <button @click="handleLogout"
                        class="text-xs bg-red-900/30 text-red-400 px-3 py-1 border border-red-900/50 hover:bg-red-900/50 transition-colors">
                        LOGOUT
                    </button>
                </template>

                <template v-else>
                    <!-- 未登录状态 -->
                    <NuxtLink to="/login"
                        class="text-xs bg-game-primary/10 text-game-primary px-3 py-1 border border-game-primary/50 hover:bg-game-primary hover:text-game-bg transition-colors font-bold uppercase">
                        LOGIN
                    </NuxtLink>
                </template>
            </div>
        </header>

        <!-- 页面内容插槽：NuxtPage 的内容会渲染在这里 -->
        <main class="flex-1 p-4 flex flex-col overflow-hidden">
            <NuxtPage />
        </main>
    </div>
</template>
