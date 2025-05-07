import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js"
import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'

export const bugService = {
    query,
    getById,
    save,
    remove,
}

const PAGE_SIZE = 3

//const bugs = readJsonFile('./data/bugs.json')

async function query(filterBy = {}) {
    try{
        const collection = await dbService.getCollection('bug')

        const criteria = {}
    
        if (filterBy.txt?.trim()) {
          criteria.title = { $regex: filterBy.txt, $options: 'i' }
        }
    
        if (filterBy.severity && +filterBy.severity > 0) {
          criteria.severity = { $lte: +filterBy.severity }
        }
    
        if (Array.isArray(filterBy.labels) && filterBy.labels.length > 0) {
          criteria.labels = { $in: filterBy.labels }
        }
    
        const sort = {}
        if (filterBy.sortBy?.trim()) {
        sort[filterBy.sortBy] = +filterBy.sortDir || 1
        }
        console.log('🔍 criteria:', criteria)
    console.log('📊 sort:', sort)

        const cursor = collection.find(criteria)
        if (filterBy.sortBy?.trim()) {
        cursor.sort(sort)
        }
    
        const bugs = await cursor.toArray()
        return bugs

    // Paging
    // const pageIdx = +filterBy.pageIdx || 0
    // const startIdx = pageIdx * PAGE_SIZE
    // bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    }
    catch(err){
        console.log(err)
        throw err
    }
}

  
async function getById(bugId) {
    try{
        const collection = await dbService.getCollection('bug')
        const bug = await collection.findOne({ _id: ObjectId.createFromHexString(bugId) })
        if (!bug) throw new Error('Cannot find bug')
        return bug
    }
    catch(err){
        console.log(err)
        throw err
    }
}

async function remove(bugId,loggedinUser ) {
    try{
        const collection = await dbService.getCollection('bug')
        const bug = await collection.findOne({ _id: ObjectId.createFromHexString(bugId) })

        if (!bug) throw new Error('Bug not found')
        if (!loggedinUser?.isAdmin && bug.creator._id !== loggedinUser._id) {
            throw new Error('Not your bug')
        }
        await collection.deleteOne({ _id: ObjectId.createFromHexString(bugId) })
    }
    catch(err){
        console.log(err)
        throw err
    }  
}

async function save(bugToSave,loggedinUser) {
    try{
        const collection = await dbService.getCollection('bug')
        if (!bugToSave.title || !bugToSave.severity || !bugToSave.description) {
            throw new Error('Missing required fields')
        }
        if (bugToSave._id) {
            // Update
            const id = ObjectId.createFromHexString(bugToSave._id)
            const existing = await collection.findOne({ _id: id })
            if (!existing) throw new Error('Bug not found')

            if (!loggedinUser?.isAdmin && existing.creator._id !== loggedinUser._id) {
                throw new Error('Not your bug')
            }
        delete bugToSave._id
        await collection.updateOne({ _id: id }, { $set: bugToSave })
        bugToSave._id = id
        }
        else{
            bugToSave.createdAt = Date.now()
            bugToSave.creator = {
                _id: loggedinUser._id,
                fullname: loggedinUser.fullname
            }
            const res = await collection.insertOne(bugToSave)
            bugToSave._id = res.insertedId
        }
    }
    catch(err){
        console.log( 'bugService.save() crashed:' , err)
        throw err
    }  
}

function saveBugsToFile(){
    return writeJsonFile('./data/bugs.json',bugs)
}