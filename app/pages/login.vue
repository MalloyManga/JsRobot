<!-- pages/login.vue -->
<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

const router = useRouter()
const isRegister = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const form = reactive({
    username: '',
    password: ''
})

// 切换模式时清空错误
watch(isRegister, () => errorMsg.value = '')

const handleAuth = async () => {
    // 1. 前端简单校验
    if (!form.username || !form.password) {
        errorMsg.value = "Username and Password are required"
        return
    }

    loading.value = true
    errorMsg.value = ''

    const endpoint = isRegister.value ? '/api/auth/register' : '/api/auth/login'

    try {
        // === [修复 1] 使用 $fetch 而不是 useFetch ===
        // useFetch 是页面加载时用的，按钮点击请求要用 $fetch
        const userData = await $fetch(endpoint, {
            method: 'POST',
            body: {
                username: form.username,
                password: form.password // === [修复 2] 必须把密码传给后端！！！ ===
            }
        })

        // === [修复 3] $fetch 直接返回数据，不需要 .value ===
        // 登录成功逻辑
        const token = (userData as any).token || 'mock-token'
        localStorage.setItem('hacker_token', token)
        localStorage.setItem('hacker_name', form.username)

        // 跳转回首页
        router.push('/')

    } catch (e: any) {
        // 捕获后端抛出的错误 (400, 401, 409 等)
        // Nuxt 的错误对象通常在 e.data.message 或 e.statusMessage 里
        errorMsg.value = e.data?.message || e.message || 'Access Denied'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-10 w-full px-4 animate-fade-in">

        <div class="bg-game-surface border-2 border-game-border p-8 rounded-lg shadow-2xl relative overflow-hidden">

            <div class="absolute top-0 left-0 w-full h-1 bg-game-primary"></div>

            <h1 class="text-2xl font-black text-game-primary mb-2 tracking-tighter uppercase">
                {{ isRegister ? 'New Uplink' : 'System Access' }}
            </h1>
            <p class="text-xs text-game-text-muted mb-8 font-mono">
                SECURE TERMINAL // V.4.0.1
            </p>

            <form @submit.prevent="handleAuth" class="space-y-6">

                <!-- 用户名 -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-game-secondary uppercase tracking-widest">Codename</label>
                    <!-- [修复 4] 添加 autocomplete 消除黄色警告 -->
                    <input v-model="form.username" type="text" placeholder="Enter username..." autocomplete="username"
                        class="w-full bg-game-bg border-2 border-game-border p-3 text-game-text focus:border-game-primary focus:outline-none transition-colors font-mono"
                        required />
                </div>

                <!-- 密码 -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-game-secondary uppercase tracking-widest">Passphrase</label>
                    <!-- [修复 4] 添加 autocomplete -->
                    <input v-model="form.password" type="password" placeholder="••••••"
                        :autocomplete="isRegister ? 'new-password' : 'current-password'"
                        class="w-full bg-game-bg border-2 border-game-border p-3 text-game-text focus:border-game-primary focus:outline-none transition-colors font-mono"
                        required />
                </div>

                <div v-if="errorMsg" class="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono">
                    ⚠ ERROR: {{ errorMsg }}
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full py-3 bg-game-primary text-game-bg font-bold uppercase tracking-widest hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {{ loading ? 'Connecting...' : (isRegister ? 'Initialize User' : 'Login') }}
                </button>
            </form>

            <div class="mt-6 text-center">
                <button @click="isRegister = !isRegister"
                    class="text-xs text-game-text-muted hover:text-game-text underline cursor-pointer">
                    {{ isRegister ? 'Already have an ID? Login' : 'Need an ID? Register' }}
                </button>
            </div>

        </div>
    </div>
</template>
