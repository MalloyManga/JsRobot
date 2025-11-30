// server/api/auth/login.post.ts
import { findUser } from '../../db.js'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username, password } = body

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            message: 'Missing credentials'
        })
    }

    // 1. 找用户
    const user = findUser(username)

    // 2. 用户不存在 -> 报错
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'User not found'
        })
    }

    // 3. [核心修正] 严格比对密码
    if (user.password !== password) {
        throw createError({
            statusCode: 401,
            message: 'Invalid password'
        })
    }

    // 4. 成功
    return {
        success: true,
        token: 'mock-session-' + Date.now(),
        user: { username: user.username, level: user.level }
    }
})
