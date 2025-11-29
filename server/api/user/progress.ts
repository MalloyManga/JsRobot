import { findUser } from '../../db.js'

export default defineEventHandler(async (event) => {
    const method = event.method

    // 模拟从 Header 拿 Token (其实我们这里直接传 username 更快)
    // 在真实场景中，这里应该解析 Bearer Token
    const query = getQuery(event)
    const username = query.username as string
    const user = findUser(username)

    if (!user) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    if (method === 'GET') {
        // 获取进度
        return { level: user.level }
    }

    if (method === 'POST') {
        // 更新进度
        const body = await readBody(event)
        // 只有当新关卡大于当前记录时才更新
        if (body.level > user.level) {
            user.level = body.level
            // --- 真实数据库: await prisma.user.update(...) ---
        }
        return { success: true, level: user.level }
    }
})