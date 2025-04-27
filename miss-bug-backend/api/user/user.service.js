import { makeId, readJsonFile ,writeJsonFile } from "../../services/utils.js"

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername
}

const USERS_FILE = './data/users.json'
let users = readJsonFile(USERS_FILE)

async function query() {
    try{
        return users
    }
    catch(err){
        console.log(err)
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        if (!user) throw new Error('User not found')
        return user
    } catch (err) {
        console.log('userService.getById() crashed:', err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        // if (!user) throw `User not found by username : ${username}`
        return user
    } catch (err) {
        loggerService.error('userService[getByUsername] : ', err)
        throw err
    }
}

async function remove(userId) {
    try {
        const idx = users.findIndex(user => user._id === userId)
        if (idx === -1) throw new Error('User not found')
        users.splice(idx, 1)
        await saveUsersToFile()
    } catch (err) {
        console.log('userService.remove() crashed:', err)
        throw err
    }
}

async function save(userToSave) {
    try {
        if (!userToSave.fullname || !userToSave.username || !userToSave.password) {
            throw new Error('Missing required fields')
        }
        if (userToSave._id) {
            const idx = users.findIndex(user => user._id === userToSave._id)
            if (idx === -1) throw new Error('User not found')
            users[idx] = userToSave
        } else {
            userToSave._id = makeId()
            userToSave.score = userToSave.score || 0
            users.unshift(userToSave)
        }
        await saveUsersToFile()
        return userToSave
    } catch (err) {
        console.log('userService.save() crashed:', err)
        throw err
    }
}

function saveUsersToFile(){
    return writeJsonFile('./data/users.json',users)
}
