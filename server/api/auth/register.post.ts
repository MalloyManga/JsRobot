import { findUser, createUser } from '../../db.js'

export default defineEventHandler(async (event) => {
    // 1. 获取前端传来的 JSON 数据
    // 等同于 Express 的 const body = req.body
    const body = await readBody(event)
    const { username } = body

    if (!username) {
        // 抛出错误，Nuxt 会自动处理成 400 状态码
        throw createError({
            statusCode: 400,
            statusMessage: 'Username is required'
        })
    }

    // 2. 检查用户是否存在
    if (findUser(username)) {
        throw createError({
            statusCode: 409,
            statusMessage: 'User already exists'
        })
    }

    // 3. 创建用户
    // --- 如果是真数据库，这里写 SQL: INSERT INTO users ... ---
    const newUser = createUser(username)

    // 4. 直接 Return 对象，前端收到的就是 JSON
    return {
        success: true,
        message: 'Hacker registered successfully',
        user: newUser
    }
})