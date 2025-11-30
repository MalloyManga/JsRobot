<!-- app/components/GlobalToast.vue -->
<script setup lang="ts">
const { toastState } = useToast()
</script>

<template>
    <div class="fixed top-0 left-0 w-full z-100 flex justify-center pt-10 pointer-events-none">
        <Transition name="toast-anim">
            <div v-if="toastState.visible"
                class="bg-game-surface/95 border-2 border-game-primary text-game-primary px-6 py-3 rounded shadow-2xl font-mono text-sm md:text-base font-bold tracking-wide backdrop-blur-sm">
                {{ toastState.message }}
            </div>
        </Transition>

    </div>
</template>

<style scoped>
.toast-anim-enter-active,
.toast-anim-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-anim-enter-from,
.toast-anim-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
