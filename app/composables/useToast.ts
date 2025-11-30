// app/composables/useToast.ts
interface ToastState {
    visible: boolean
    message: string
}

export const useToast = () => {
    const toastState = useState<ToastState>('toast_state', () => ({
        visible: false,
        message: ''
    }))

    const timer = useState<NodeJS.Timeout | null>('toast_timer', () => null)

    /**
     * 显示 Toast
     * @param message 显示的内容
     * @param duration 显示时间 (毫秒)，默认 2000ms
     */
    const showToast = (message: string, duration: number = 2000) => {
        // 1. 如果当前有定时器，先清除，防止旧的定时器提前关闭新的消息
        if (timer.value) {
            clearTimeout(timer.value)
            timer.value = null
        }

        // 2. 更新内容并显示
        toastState.value.message = message
        toastState.value.visible = true

        // 3. 设置定时器自动关闭
        timer.value = setTimeout(() => {
            toastState.value.visible = false
            timer.value = null
        }, duration)
    }

    // 仅仅暴露状态供组件读取，暴露方法供外部调用
    return {
        toastState,
        showToast
    }
}
