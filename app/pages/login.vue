<!-- pages/login.vue -->
<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

const router = useRouter()
const isRegister = ref(false) // 切换登录/注册模式
const loading = ref(false)
const errorMsg = ref('')

const form = reactive({
    username: '',
    password: '' // 虽然可能是模拟，但UI上留着比较真实
})

// 切换模式时清空错误
watch(isRegister, () => errorMsg.value = '')

const handleAuth = async () => {
    if (!form.username) return

    loading.value = true
    errorMsg.value = ''

    // 根据模式选择 API 端点 (假设你后端写好了)
    // 如果后端还没写好，可以用下面的 mock 逻辑替代
    const endpoint = isRegister.value ? '/api/auth/register' : '/api/auth/login'

    try {
        // === 真实后端调用 (如果你写了 server/api) ===
        const { data, error } = await useFetch(endpoint, {
            method: 'POST',
            body: { username: form.username } // 演示用，暂时只传用户名
        })

        if (error.value) {
            throw new Error(error.value.statusMessage || 'Connection Failed')
        }

        // === 登录成功逻辑 ===
        // 1. 存 Token/User (模拟)
        const userData = data.value as any
        localStorage.setItem('hacker_token', userData?.token || 'mock-token')
        localStorage.setItem('hacker_name', form.username)

        // 2. 跳转回首页
        router.push('/')

    } catch (e: any) {
        errorMsg.value = e.message || 'Access Denied'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-10 w-full px-4 animate-fade-in">

        <!-- 终端卡片风格 -->
        <div class="bg-game-surface border-2 border-game-border p-8 rounded-lg shadow-2xl relative overflow-hidden">

            <!-- 装饰线 -->
            <div class="absolute top-0 left-0 w-full h-1 bg-game-primary"></div>

            <h1 class="text-2xl font-black text-game-primary mb-2 tracking-tighter uppercase">
                {{ isRegister ? 'New Uplink' : 'System Access' }}
            </h1>
            <p class="text-xs text-game-text-muted mb-8 font-mono">
                SECURE TERMINAL // V.4.0.1
            </p>

            <!-- 表单 -->
            <form @submit.prevent="handleAuth" class="space-y-6">

                <!-- 用户名 -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-game-secondary uppercase tracking-widest">Codename</label>
                    <input v-model="form.username" type="text" placeholder="Enter username..."
                        class="w-full bg-game-bg border-2 border-game-border p-3 text-game-text focus:border-game-primary focus:outline-none transition-colors font-mono"
                        required />
                </div>

                <!-- 密码 (装饰用，或者为了以后扩展) -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-game-secondary uppercase tracking-widest">Passphrase</label>
                    <input v-model="form.password" type="password" placeholder="••••••"
                        class="w-full bg-game-bg border-2 border-game-border p-3 text-game-text focus:border-game-primary focus:outline-none transition-colors font-mono" />
                </div>

                <!-- 错误提示 -->
                <div v-if="errorMsg" class="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono">
                    ⚠ ERROR: {{ errorMsg }}
                </div>

                <!-- 提交按钮 -->
                <button type="submit" :disabled="loading"
                    class="w-full py-3 bg-game-primary text-game-bg font-bold uppercase tracking-widest hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {{ loading ? 'Connecting...' : (isRegister ? 'Initialize User' : 'Login') }}
                </button>
            </form>

            <!-- 切换模式 -->
            <div class="mt-6 text-center">
                <button @click="isRegister = !isRegister"
                    class="text-xs text-game-text-muted hover:text-game-text underline cursor-pointer">
                    {{ isRegister ? 'Already have an ID? Login' : 'Need an ID? Register' }}
                </button>
            </div>

        </div>
    </div>
</template>
