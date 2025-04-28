import { loggerService } from "../../services/logger.service.js"
import { userService } from "./user.service.js"
import { bugService } from "../bug/bug.service.js"

export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        loggerService.error(`Couldn't get users`, err)
        res.status(400).send(`Couldn't get users`)
    }
}

export async function getUser(req, res) {
    const { userId } = req.params
    try {
        const user = await userService.getById(userId)
        res.send(user)
    } catch (err) {
        loggerService.error(`Couldn't get user ${userId}`, err)
        res.status(400).send(`Couldn't get user`)
    }
}

export async function updateUser(req, res) {
    const userToSave = {
        _id: req.body._id,
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        score: +req.body.score,
    }

    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        loggerService.error(`Couldn't save user`, err)
        res.status(400).send(`Couldn't save user`)
    }
}

export async function addUser(req, res) {
    const userToSave = {
        _id: req.body._id,
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        score: +req.body.score || 0,
    }

    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        loggerService.error(`Couldn't save user`, err)
        res.status(400).send(`Couldn't save user`)
    }
}

export async function removeUser(req, res) {
    const { userId } = req.params
    try {
        const bugs = await bugService.query()
        console.log('All bugs:', bugs)
        const userBugs = bugs.some(bug => bug.creator && bug.creator._id === userId)
        console.log('User bugs:', userBugs)
        if (userBugs.length > 0) {
            console.log('User owns bugs, cannot delete')
            return res.status(400).send('Cannot delete user who has bugs')
        }
        await userService.remove(userId)
        res.send('OK')
    } catch (err) {
        loggerService.error(`Couldn't remove user ${userId}`, err)
        res.status(400).send(`Couldn't remove user`)
    }
}