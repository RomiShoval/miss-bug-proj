import { makeId, readJsonFile, writeJsonFile } from "./utils.js"

export const bugService = {
    query,
    getById,
    save,
    remove,
}

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
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity <= severity)
        }
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

async function remove(bugId) {
    try{
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx === -1) throw new Error('Bug not found')//bug doesnt exist
        bugs.splice(bugIdx, 1)//remove the bug
        await saveBugsToFile()
    }
    catch(err){
        console.log(err)
        throw err
    }  
}

async function save(bugToSave) {
    try{
        //bug already exist
        if (!bugToSave.title || !bugToSave.severity || !bugToSave.description) {
            throw new Error('Missing required fields')
        }
        if (bugToSave._id) {
            const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (bugIdx === -1) throw new Error('Bug not found')
            bugs[bugIdx] = bugToSave
        } else {
            bugToSave._id = makeId()
            bugToSave.createdAt = Date.now()
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