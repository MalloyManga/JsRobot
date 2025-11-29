import { findUser } from '../../db.js'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username } = body // 演示从简，甚至不校验密码，只要名字对就行

    // --- 真实数据库写法 (假装) ---
    // const user = await prisma.user.findUnique({ where: { username } })
    // if (!bcrypt.compareSync(password, user.passwordHash)) throw ...
    // ---------------------------

    const user = findUser(username)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'User not found'
        })
    }

    // 简单起见，不发 JWT 了，直接把用户信息扔回去
    // 前端存 localStorage 即可
    return {
        success: true,
        token: 'mock-token-' + Date.now(), // 假 Token
        user: user
    }
})