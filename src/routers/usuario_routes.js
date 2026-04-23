import { Router } from 'express'
import { 
    registro,
    confirmarEmail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login
} from '../controllers/usuario_controller.js'

const router = Router()

// Rutas publicas


// POST /api/registro
router.post('/registro', registro)

// Confirmacion de cuenta
router.get('/confirmar/:token', confirmarEmail)

// Recuperacion de contraseña
router.post('/recuperarpassword', recuperarPassword)
router.get('/recuperarpassword/:token', comprobarTokenPassword)
router.post('/nuevopassword/:token', crearNuevoPassword)

//login
router.post('/login', login)




export default router