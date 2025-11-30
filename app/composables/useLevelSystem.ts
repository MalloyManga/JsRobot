// app/composables/useLevelSystem.ts
import { levels } from '~/data/index.js'
import type { LevelConfig } from '~/types/game.js'

export const useLevelSystem = () => {
    const route = useRoute()
    const { showToast } = useToast()

    // 1. 获取初始关卡索引
    const getInitialIndex = () => {
        const queryIdx = Number(route.query.levelIndex)
        if (!isNaN(queryIdx) && queryIdx >= 0 && queryIdx < levels.length) {
            return queryIdx
        }
        return 0
    }

    const currentLevelIndex = ref(getInitialIndex())

    // 2. 计算当前关卡配置
    const currentLevel = computed<LevelConfig>(() => {
        return levels[currentLevelIndex.value] || levels[0] as LevelConfig
    })

    // 3. 后端同步逻辑
    const syncProgress = async (logs: Ref<string[]>) => {
        const username = localStorage.getItem('hacker_name')
        if (!username) return
        // 如果 URL 指定了关卡，不进行同步
        if (route.query.levelIndex !== undefined && route.query.levelIndex !== null) return

        try {
            const { data } = await useFetch<{ level: number }>('/api/user/progress', {
                params: { username }
            })

            if (data.value && typeof data.value.level === 'number') {
                const serverLevelId = data.value.level
                const savedIndex = serverLevelId - 1
                if (currentLevelIndex.value === 0 && savedIndex > 0) {
                    currentLevelIndex.value = savedIndex
                    logs.value.push(`>> Cloud Save Found: Warping to Level ${serverLevelId}...`)
                }
            }
        } catch (e) {
            console.error('Sync failed', e)
        }
    }

    // 4. 保存进度
    const saveProgress = async () => {
        const username = localStorage.getItem('hacker_name')
        if (!username) return
        try {
            await useFetch('/api/user/progress', {
                method: 'POST',
                body: { username, level: currentLevel.value.id + 1 }
            })
            console.log('Progress saved!')
        } catch (e) { console.error(e) }
    }

    // 5. 下一关
    const nextLevel = () => {
        if (currentLevelIndex.value < levels.length - 1) {
            currentLevelIndex.value++
        } else {
            showToast('🎉 ALL LEVELS COMPLETED!', 5000)
        }
    }

    return {
        currentLevelIndex,
        currentLevel,
        syncProgress,
        saveProgress,
        nextLevel
    }
}
