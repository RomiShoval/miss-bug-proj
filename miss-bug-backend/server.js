import express from 'express'
import { bugService } from './api/bug/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { bugRoutes } from './api/bug/bug.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())

const corsOptions = {
    origin : [
        'http://127.0.0.1:5173',
        'http://localhost:5173'
    ],
    credentials : true
}

app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

app.use('/api/bug', bugRoutes)



//* ------------ Bugs CRUD ------------
//*Read/List
// app.get('/api/bug', async (req, res) => {
//     const filterBy = {
//         txt : req.query.txt || '',
//         severity : req.query.severity || ''
//     }

//     try{
//         const bugs = await bugService.query(filterBy)
//         res.send(bugs)
//     }
//     catch(err){
//         loggerService.error(`couldnt get bugs`, err)
//         res.status(400).send('Couldnt get bugs')
//     }
// })

// //*Add/Update
// app.get('/api/bug/save', async (req, res) => {
//     const bugToSave ={
//         _id: req.query._id,
//         title : req.query.title,
//         severity : +req.query.severity,
//         createdAt : req.query.createdAt ? +req.query.createdAt : Date.now() ,
//         description : req.query.description
//     }
//     try{
//         const savedBug = await bugService.save(bugToSave)
//         res.send(savedBug)
//     }
//     catch(err){
//         console.log('💥 SAVE ERROR:', err.message)
//         loggerService.error(`couldnt save bugs`, err)
//         res.status(400).send('Couldnt save bugs')
//     }
// })
  
// //*Read
// app.get('/api/bug/:bugId', async (req, res) => {
//     const {bugId} = req.params
//     try{
//         const bug = await bugService.getById(bugId)
//         res.send(bug)
//     }
//     catch(err){
//         loggerService.error(`couldnt get bug ${bugId}`, err)
//         res.status(400).send('Couldnt get bug')
//     }
// })

const port = 3030
app.listen(port, () => {
    loggerService.info(`Example app listening on port http://127.0.0.1:${port}/`)
})