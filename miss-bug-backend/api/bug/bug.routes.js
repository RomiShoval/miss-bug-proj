import express from 'express'
import { getBug, getBugs, removeBug, updateBug, addBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireAdmin,requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/',log, getBugs)
router.get('/:bugId',log,requireAuth, getBug)
router.put('/:bugId',log,requireAuth, updateBug)
router.post('/',requireAuth, addBug)
router.delete('/:bugId',requireAuth, removeBug)

export const bugRoutes = router