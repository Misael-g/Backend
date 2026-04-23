import { Router } from 'express'
import { registro } from '../controllers/usuario_controller.js'

const router = Router()

// POST /api/registro
router.post('/registro', registro)

export default router