<!-- compos/RunCodeButton.vue -->
<script setup lang="ts">
interface Props {
    isRunning: boolean
}

const { isRunning } = defineProps<Props>()

const emit = defineEmits<{
    runCodeBtnClick: []
}>()
</script>

<template>
    <button @click="emit('runCodeBtnClick')" :disabled="isRunning"
        class="bg-game-primary text-game-bg px-6 py-2 font-bold hover:brightness-110 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer">
        {{ isRunning ? 'EXECUTING...' : 'RUN CODE ▶' }}
    </button>
</template>
