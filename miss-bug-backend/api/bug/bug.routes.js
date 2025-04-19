import express from 'express'
import { getBug, getBugs, removeBug, updateBug, addBug } from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.put('/:bugId', updateBug)
router.post('/', addBug)
router.delete('/:bugId', removeBug)

export const bugRoutes = router