
import { utilService } from './util.service.js'

import Axios from 'axios'
const axios = Axios.create({
    withCredentials: true,
})

const STORAGE_KEY = 'bugDB'
const BASE_URL = 'http://127.0.0.1:3030/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyBug,
    getRandomBug,
    getDefaultFilter
}

async function query(filterBy = {}) {
    try{
        const {data : bugs} = await axios.get(BASE_URL , {params : filterBy})
        return bugs
    }
    catch(err){
        console.log(err)
        throw err
    }
}

  
async function getById(bugId) {
    try{
        const {data : bug} = await axios.get(BASE_URL + bugId)
       return bug
    }
    catch(err){
        console.log(err)
        throw err
    }
}

function remove(bugId) {
    try{
        return axios.get(`${BASE_URL}/${bugId}/remove`)
    }
    catch(err){
        console.log(err)
        throw err
    }
}

async function save(bug) {
    try{
        const {data : savedBug} = await axios.get(`${BASE_URL}/save` , {params : bug})
        return savedBug
    }
    catch(err){
        console.log(err)
        throw err
    }
}

function getEmptyBug() {
    return {
        title: '',
        severity: '',
    }
}

function getRandomBug() {
    return {
        title: 'bug number-' + (Date.now() % 1000),
        severity: utilService.getRandomIntInclusive(2, 10),
    }
}

function getDefaultFilter() {
    return { txt: '', severity: ''}
}