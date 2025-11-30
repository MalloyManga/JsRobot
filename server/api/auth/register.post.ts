// server/api/auth/register.post.ts
import { findUser, createUser } from '../../db.js'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username, password } = body

    // 1. 必填校验
    if (!username || !password) {
        throw createError({
            statusCode: 400,
            message: 'Username and Password are required'
        })
    }

    // 2. 查重
    const existingUser = findUser(username)
    if (existingUser) {
        throw createError({
            statusCode: 409,
            message: 'User already exists'
        })
    }

    // 3. 创建
    const newUser = createUser(username, password)

    return {
        success: true,
        user: { username: newUser.username, level: newUser.level }
    }
})
