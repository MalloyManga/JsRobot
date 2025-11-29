<!-- compos/QuickCommandBar.vue -->
<script setup lang="ts">
const emit = defineEmits<{
    insert: [snippet: string]
}>()

const commands = [
    { label: '↑ Up', code: 'robot.moveUp(1);' },
    { label: '↓ Down', code: 'robot.moveDown(1);' },
    { label: '← Left', code: 'robot.moveLeft(1);' },
    { label: '→ Right', code: 'robot.moveRight(1);' },
]
</script>

<template>
    <div class="flex gap-2 p-2 bg-game-bg/50 border-b border-game-border overflow-x-auto no-scrollbar">
        <button v-for="cmd in commands" :key="cmd.label" @click="emit('insert', cmd.code)"
            class="text-xs px-2 py-1 whitespace-nowrap bg-game-border text-game-text hover:bg-game-primary hover:text-game-bg rounded transition-colors font-mono cursor-pointer">
            {{ cmd.label }}
        </button>
    </div>
</template>
