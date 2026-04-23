import { Router } from 'express'
import { 
    registro,
    confirmarEmail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

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

// rutas privadas (requieren autenticacion)

//Ver perfil
router.get('/perfil', verificarTokenJWT, perfil) 

//actualizarperfil
router.put('/actualizarperfil/:id', verificarTokenJWT, actualizarPerfil)

//actualizarpassword
router.put('/actualizarpassword', verificarTokenJWT, actualizarPassword)


export default router