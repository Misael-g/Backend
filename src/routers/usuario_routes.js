import { Router } from 'express'
import { 
    registro,
    confirmarEmail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword
} from '../controllers/usuario_controller.js'

const router = Router()

// POST /api/registro
router.post('/registro', registro)

// Confirmacion de cuenta
router.get('/confirmar/:token', confirmarEmail)


// Recuperacion de contraseña
router.post('/recuperarpassword', recuperarPassword)
router.get('/recuperarpassword/:token', comprobarTokenPassword)
router.post('/nuevopassword/:token', crearNuevoPassword)

export default router