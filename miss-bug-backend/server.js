import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// import { bugService } from './api/bug/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'


const app = express()
const corsOptions = {
    origin : [
        // 'http://127.0.0.1:5173',
        'http://localhost:5174'
    ],
    credentials : true
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


const port = 3030
app.listen(port, () => {
    loggerService.info(`Example app listening on port http://127.0.0.1:${port}/`)
})