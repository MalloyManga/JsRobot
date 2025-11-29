<!-- compos/ContinueCodeButton.vue -->
<script setup lang="ts">
// 接收 props 来控制按钮状态
interface Props {
    isDisabled: boolean
}

const { isDisabled } = defineProps<Props>()

// 定义事件
const emit = defineEmits<{
    continueBtnClick: []
}>()
</script>

<template>
    <button @click="emit('continueBtnClick')" :disabled="isDisabled"
        class="px-4 py-2 border-2 border-game-border text-game-secondary font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-game-border hover:text-white active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Execute only new lines">
        Continue ↓
    </button>
</template>
