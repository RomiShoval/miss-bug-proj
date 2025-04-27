import express from 'express'
import { getUser, getUsers, removeUser, updateUser, addUser } from './user.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireAdmin,requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', getUser)
router.put('/:userId', updateUser)
router.post('/', addUser)
router.delete('/:userId',requireAdmin, removeUser)

export const userRoutes = router