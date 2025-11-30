// server/utils/db.ts
import fs from 'node:fs'
import path from 'node:path'

// 数据库文件路径：项目根目录/database.json
const DB_PATH = path.resolve(process.cwd(), 'database.json')

export interface User {
    username: string
    level: number
    password: string // [修正] 必填！
}

// 读取
export const readDb = (): User[] => {
    if (!fs.existsSync(DB_PATH)) return []
    const content = fs.readFileSync(DB_PATH, 'utf-8')
    return content ? JSON.parse(content) : []
}

// 写入
export const writeDb = (users: User[]) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8')
}

// 查找用户
export const findUser = (username: string) => {
    const users = readDb()
    return users.find(u => u.username === username)
}

// 创建用户 (严格逻辑)
export const createUser = (username: string, password: string) => {
    const users = readDb()

    if (users.find(u => u.username === username)) {
        throw new Error('User already exists')
    }

    const newUser: User = {
        username,
        password, // [修正] 必须存入密码
        level: 1
    }

    users.push(newUser)
    writeDb(users)
    return newUser
}

// 更新进度
export const updateUserLevel = (username: string, newLevel: number) => {
    const users = readDb()
    const userIndex = users.findIndex(u => u.username === username)

    if (userIndex !== -1) {
        if (newLevel > users[userIndex].level) {
            users[userIndex].level = newLevel
            writeDb(users)
        }
        return users[userIndex]
    }
    return null
}