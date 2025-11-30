// server/api/user/progress.ts
import { findUser, updateUserLevel } from '../../db.js'

export default defineEventHandler(async (event) => {
    const method = event.method

    // GET: 获取进度
    if (method === 'GET') {
        const query = getQuery(event)
        const username = query.username as string

        // 每次都从文件重新读取，保证最新
        const user = findUser(username)
        return { level: user ? user.level : 1 }
    }

    // POST: 更新进度
    if (method === 'POST') {
        const body = await readBody(event)
        const { username, level } = body

        const updatedUser = updateUserLevel(username, level)

        if (updatedUser) {
            return { success: true, level: updatedUser.level }
        } else {
            return { success: false, message: 'User not found' }
        }
    }
})
