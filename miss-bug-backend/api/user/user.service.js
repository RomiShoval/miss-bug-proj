import { makeId, readJsonFile ,writeJsonFile } from "../../services/utils.js"
import { ObjectId } from 'mongodb'
import { loggerService } from "../../services/logger.service.js"

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername
}

// const USERS_FILE = './data/users.json'
// let users = readJsonFile(USERS_FILE)

async function query() {
    try{
        const collection = await dbService.getCollection('user')
        const users = await collection.find().toArray()
        return users
    }
    catch(err){
        loggerService.error('userService.query() failed', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: new ObjectId(userId) })
        return user
    } catch (err) {
        loggerService.error('userService.getById() failed', err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        loggerService.error('userService.getByUsername() failed', err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) })
    } catch (err) {
        loggerService.error('userService.remove() failed', err)
        throw err
    }
}

async function save(userToSave) {
    try {
        const collection = await dbService.getCollection('user')
        if (!userToSave.fullname || !userToSave.username || !userToSave.password) {
            throw new Error('Missing required fields')
        }
        if (userToSave._id) {
            const id = ObjectId.createFromHexString(userToSave._id)
            delete userToSave._id
            await collection.updateOne({ _id: id }, { $set: userToSave })
            userToSave._id = id
        } else {
            userToSave.score = userToSave.score || 0
            const res = await collection.insertOne(userToSave)
            userToSave._id = res.insertedId
        }
        return userToSave
    } catch (err) {
        loggerService.error('userService.save() failed', err)
        throw err
    }
}

function saveUsersToFile(){
    return writeJsonFile('./data/users.json',users)
}
