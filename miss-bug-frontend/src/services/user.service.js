import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = 'http://127.0.0.1:3030/api/user/'

export const userService = {
    query,
    getById,
    save,
    remove,
    getEmptyUser
}

async function query() {
    try {
        const { data: users } = await axios.get(BASE_URL)
        return users
    } catch (err) {
        console.log('userService: Cannot fetch users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const { data: user } = await axios.get(BASE_URL + userId)
        return user
    } catch (err) {
        console.log('userService: Cannot get user by ID', err)
        throw err
    }
}

function remove(userId) {
    try {
        return axios.delete(BASE_URL + userId)
    } catch (err) {
        console.log('userService: Cannot remove user', err)
        throw err
    }
}

async function save(user) {
    const method = user._id ? 'put' : 'post'
    try {
        const { data: savedUser } = await axios[method](BASE_URL + (user._id || ''), user)
        return savedUser
    } catch (err) {
        console.log('userService: Cannot save user', err)
        throw err
    }
}

function getEmptyUser() {
    return {
        fullname: '',
        username: '',
        password: '',
        score: 0
    }
}