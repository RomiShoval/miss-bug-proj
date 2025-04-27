import { loggerService } from "../../services/logger.service.js"
import { bugService } from "./bug.service.js"
import { authService } from "../auth/auth.service.js"

export async function getBugs(req,res) {
    const filterBy ={
        txt: req.query.txt,
		severity: +req.query.severity,
		sortBy: req.query.sortBy,
		sortDir: +req.query.sortDir || 1,
		pageIdx: +req.query.pageIdx || 0,
		labels: req.query.labels || []
    }   
    try {
		const bugs = await bugService.query(filterBy)
		res.send(bugs)
        console.log(bugs)
	} catch (err) {
		loggerService.error(`Couldn't get bugs`, err)
		res.status(400).send(`Couldn't get bugs`)
	} 
}

export async function getBug(req, res) {
	const { bugId } = req.params

    try {
        console.log('Incoming cookies:', req.headers.cookie)
        let visitedBugs = []
        if (req.cookies.visitedBugs) {
            try {
				console.log(req.cookies.visitedBugs)
                visitedBugs = JSON.parse(req.cookies.visitedBugs)
            } catch {
                console.warn('Corrupted visitedBugs cookie, resetting...')
                visitedBugs = []
            }
        }
        if (!visitedBugs.includes(bugId)) {
            visitedBugs.push(bugId)
        }
        if (visitedBugs.length > 3) {
            console.log('User blocked from visiting more bugs:', visitedBugs)
            return res.status(401).send('Wait for a bit')
        }(
		console.log('Setting cookie :' , JSON.stringify(visitedBugs)))
		console.log('Incoming cookies from client:', req.cookies)
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), {
            maxAge: 7000, // 7 seconds
            httpOnly: false,
			sameSite: 'Lax',
        })

        console.log('User visited bugs:', visitedBugs)

        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error(`Couldn't get bug ${bugId}`, err)
        res.status(400).send(`Couldn't get bug`)
    }
}

export async function updateBug(req, res) {
	const loginToken = req.cookies.loginToken
    if (!loginToken) return res.status(401).send('Not logged in')
    const miniUser = authService.validateToken(loginToken)
    if (!miniUser) return res.status(401).send('Invalid login token')

	try {
		const existingBug = await bugService.getById(req.body._id)
        if (!existingBug) return res.status(404).send('Bug not found')

        if (existingBug.creator._id !== miniUser._id) {
            return res.status(403).send('Not authorized to update this bug')
        }
		const bugToSave = {
			_id: req.body._id,
			title: req.body.title,
			description: req.body.description,
			severity: +req.body.severity,
			createdAt: +req.body.createdAt,
			labels: req.body.labels,
		}
		const savedBug = await bugService.save(bugToSave)
		res.send(savedBug)
	} catch (err) {
		loggerService.error(`Couldn't save bug`, err)
		res.status(400).send(`Couldn't save bug`)
	}
}

export async function addBug(req, res) {
	const bugToSave = {
		_id: req.body._id,
		title: req.body.title,
		description: req.body.description,
		severity: +req.body.severity,
		createdAt: req.body.createdAt || Date.now(),
		labels: req.body.labels || [],
	}
	
	try {
		const loginToken = req.cookies.loginToken
		if (!loginToken) return res.status(401).send('Not logged in')
		const loggedinUser  = authService.validateToken(loginToken)
		if (!loggedinUser ) return res.status(401).send('Invalid login token')
		bugToSave.creator=loggedinUser
		const savedBug = await bugService.save(bugToSave)
		res.send(savedBug)
	} catch (err) {
		loggerService.error(`Couldn't save bug`, err)
		res.status(400).send(`Couldn't save bug`)
	}
}

export async function removeBug(req, res) {
	const loginToken = req.cookies?.loginToken
    if (!loginToken) return res.status(401).send('Not logged in')
    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send('Invalid login token')
    const { bugId } = req.params
	try {
		const bug = await bugService.getById(bugId)
        if (!bug) return res.status(404).send('Bug not found')

        if (bug.creator._id !== loggedinUser._id) {
			loggerService.error(`Trying to delete a bug created by another user ${bugId}`, err)
            return res.status(403).send('You are not authorized to remove this bug')
        }
		await bugService.remove(bugId)
		res.send('OK')
	} catch (err) {
		loggerService.error(`Couldn't remove bug ${bugId}`, err)
		res.status(400).send(`Couldn't remove bug`)
	}
}