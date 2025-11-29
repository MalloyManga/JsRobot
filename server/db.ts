// server/db.ts

// 这是一个存活在内存里的简易数据库
// 路演演示绝对够用了

interface User {
    username: string
    level: number // 记录通关到第几关
}

// 用一个 Map 或者 Array 来存
export const fakeUserDb: User[] = [
    // 预置一个管理员账号，方便演示
    { username: 'admin', level: 5 }
]

// 简单的查找助手
export const findUser = (username: string) => {
    return fakeUserDb.find(u => u.username === username)
}

export const createUser = (username: string) => {
    const newUser = { username, level: 1 }
    fakeUserDb.push(newUser)
    return newUser
}