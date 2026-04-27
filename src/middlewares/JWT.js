import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"

/**Middleware para crear el token JWT */

const crearTokenJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

/**
 * Middleware para verificar el token JWT 2 roles
 * Protege rutas que requieren autenticación
 */
const verificarTokenJWT = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ msg: 'Acceso denegado: token no proporcionado' })
    }
    try {
        const token = authorization.split(' ')[1]
        const { id, rol } = jwt.verify(token, process.env.JWT_SECRET)
 
        const usuarioBDD = await Usuario.findById(id).lean().select('-password')
        if (!usuarioBDD) return res.status(401).json({ msg: 'Usuario no encontrado' })
 
        req.usuarioHeader = usuarioBDD
        next()
 
    } catch (error) {
        console.error(error)
        return res.status(401).json({ msg: `Token inválido o expirado - ${error.message}` })
    }
}

/**
 * Middleware para verificar que el usuario sea administrador
 * Debe usarse después de verificarTokenJWT
 */
const verificarAdmin = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ msg: 'Acceso denegado: token no proporcionado' })
    }
    try {
        const token = authorization.split(' ')[1]
        const { id, rol } = jwt.verify(token, process.env.JWT_SECRET)
 
        if (rol !== 'admin') {
            return res.status(403).json({ msg: 'Acceso denegado: se requiere rol de administrador' })
        }
 
        const adminBDD = await Usuario.findById(id).lean().select('-password')
        if (!adminBDD) return res.status(401).json({ msg: 'Administrador no encontrado' })
 
        req.usuarioHeader = adminBDD
        next()
 
    } catch (error) {
        console.error(error)
        return res.status(401).json({ msg: `Token inválido o expirado - ${error.message}` })
    }
}

export {
    crearTokenJWT,
    verificarTokenJWT,
    verificarAdmin
}