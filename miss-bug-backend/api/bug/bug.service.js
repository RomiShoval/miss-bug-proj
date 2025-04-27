import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js"

export const bugService = {
    query,
    getById,
    save,
    remove,
}

const PAGE_SIZE = 3

const bugs = readJsonFile('./data/bugs.json')

async function query(filterBy) {
    let bugsToDisplay = bugs
    try{
        if(filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
        }
        if(filterBy.severity) {
            const severity = +filterBy.severity
            if(!isNaN(severity) && severity > 0){
                bugsToDisplay = bugsToDisplay.filter(bug => bug.severity <= severity)
            }
        }
        if (filterBy.labels.length) {
            const labels = Array.isArray(filterBy.labels) ? filterBy.labels : [filterBy.labels]
            bugsToDisplay = bugsToDisplay.filter(bug =>
                bug.labels && bug.labels.some(label => labels.includes(label))
            )
        }

    // Sorting
    if (filterBy.sortBy) {
        const sortKey = filterBy.sortBy
        const sortDir = +filterBy.sortDir || 1
        bugsToDisplay.sort((a, b) => {
            if (typeof a[sortKey] === 'string') {
                return a[sortKey].localeCompare(b[sortKey]) * sortDir
            } else {
                return (a[sortKey] - b[sortKey]) * sortDir
            }
        })
    }

    // Paging
    // const pageIdx = +filterBy.pageIdx || 0
    // const startIdx = pageIdx * PAGE_SIZE
    // bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    return bugsToDisplay
    }
    catch(err){
        console.log(err)
        throw err
    }
}

  
async function getById(bugId) {
    try{
        const bug = bugs.find( bug => bug._id == bugId)
        if(!bug) throw new Error('Cannot find bug')
        return bug
    }
    catch(err){
        console.log(err)
        throw err
    }
}

async function remove(bugId,loggedinUser ) {
    try{
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx === -1) throw new Error('Bug not found')//bug doesnt exist
        const bug = bugs[bugIdx]
        if (!loggedinUser?.isAdmin &&
            bug.creator._id !== loggedinUser._id) {
            throw 'Not your car'
        }
        bugs.splice(bugIdx, 1)//remove the bug
        await saveBugsToFile()
    }
    catch(err){
        console.log(err)
        throw err
    }  
}

async function save(bugToSave,loggedinUser) {
    try{
        //bug already exist
        if (!bugToSave.title || !bugToSave.severity || !bugToSave.description) {
            throw new Error('Missing required fields')
        }
        if (bugToSave._id) {
            const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (bugIdx === -1) throw new Error('Bug not found')
                const bug = bugs[bugIdx]
            if (!loggedinUser?.isAdmin &&
                bug.creator._id !== loggedinUser._id) {
                throw 'Not your car'
            }
            bugs[bugIdx] = bugToSave
        } else {
            bugToSave._id = makeId()
            bugToSave.createdAt = Date.now()
            bugToSave.creator = {
                _id: loggedinUser._id,
                fullname: loggedinUser.fullname
            }
            bugs.unshift(bugToSave)
        }
        await saveBugsToFile()
        return bugToSave
    }
    catch(err){
        console.log( 'bugService.save() crashed:' , err)
        throw err
    }  
}

function saveBugsToFile(){
    return writeJsonFile('./data/bugs.json',bugs)
}