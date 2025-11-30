<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
    logs: string[]
}>()

const containerRef = ref<HTMLElement | null>(null)

// 自动滚动到底部
watch(() => props.logs.length, async () => {
    await nextTick()
    if (containerRef.value) {
        containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
})
</script>

<template>
    <div ref="containerRef"
        class="h-40 bg-game-bg border-t-4 border-game-border p-2 font-mono text-xs md:text-sm overflow-y-auto scroll-smooth">
        <div v-for="(log, i) in logs" :key="i" class="mb-1">
            <span class="text-game-secondary">$</span>
            <span
                :class="log.includes('Error') || log.includes('Crash') || log.includes('DIED') ? 'text-red-400' : 'text-game-text'">
                {{ log }}
            </span>
        </div>
    </div>
</template>
