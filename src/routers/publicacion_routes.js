import { Router } from 'express'
import {
    crearPublicacion,
    listarPublicaciones,
    detallePublicacion,
    editarPublicacion,
    cambiarEstado,
    eliminarPublicacion,
    misPublicaciones
} from '../controllers/publicacion_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

// Rutas publicas
router.get('/publicaciones', listarPublicaciones)
router.get('/publicacion/:id', detallePublicacion)

// Rutas privadas requieren token
router.post('/publicacion', verificarTokenJWT, crearPublicacion)
router.get('/mis-publicaciones', verificarTokenJWT, misPublicaciones)
router.put('/publicacion/:id', verificarTokenJWT, editarPublicacion)
router.patch('/publicacion/:id/estado', verificarTokenJWT, cambiarEstado)
router.delete('/publicacion/:id', verificarTokenJWT, eliminarPublicacion)

export default router