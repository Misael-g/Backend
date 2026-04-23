import Usuario from '../models/Usuario.js'
import { sendMailToRegister, sendMailToRecoveryPassword } from '../helpers/sendMail.js'
import { crearTokenJWT } from '../middlewares/JWT.js'
import mongoose from 'mongoose'


const registro = async (req, res) => {
    try {
        const { nombre, email, password, telefono, carrera } = req.body

        // Validar que los campos requeridos no estén vacíos
        if (!nombre || !email || !password || !telefono) {
            return res.status(400).json({ msg: 'Lo sentimos, debes llenar todos los campos obligatorios' })
        }

        // Verificar si el email ya está registrado
        const verificarEmailBDD = await Usuario.findOne({ email })
        if (verificarEmailBDD) {
            return res.status(400).json({ msg: 'Lo sentimos, el email ya se encuentra registrado' })
        }

        // Crear la instancia del nuevo usuario
        const nuevoUsuario = new Usuario({ nombre, email, password, telefono, carrera })

        // Cifrar el password
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)

        // Generar token de confirmacioon
        const token = nuevoUsuario.createToken()

        // Enviar correo de confirmacion
        await sendMailToRegister(email, token)

        // Guardar en la bdd
        await nuevoUsuario.save()

        res.status(200).json({ msg: 'Revisa tu correo electrónico para confirmar tu cuenta' })

    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}


const confirmarEmail = async (req, res) => {
    try {
        const { token } = req.params
 
        const usuarioBDD = await Usuario.findOne({ token })
        if (!usuarioBDD) {
            return res.status(404).json({ msg: 'Token inválido o cuenta ya confirmada' })
        }
 
        usuarioBDD.token = null
        usuarioBDD.confirmEmail = true
        await usuarioBDD.save()
 
        res.status(200).json({ msg: 'Cuenta confirmada, ya puedes iniciar sesión' })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}
 


const recuperarPassword = async (req, res) => {
    try {
        const { email } = req.body
 
        if (!email) {
            return res.status(400).json({ msg: 'Debes ingresar un correo electrónico' })
        }
 
        const usuarioBDD = await Usuario.findOne({ email })
        if (!usuarioBDD) {
            return res.status(404).json({ msg: 'El usuario no se encuentra registrado' })
        }
 
        const token = usuarioBDD.createToken()
        usuarioBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await usuarioBDD.save()
 
        res.status(200).json({ msg: 'Revisa tu correo electrónico para restablecer tu contraseña' })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}
 



const comprobarTokenPassword = async (req, res) => {
    try {
        const { token } = req.params
 
        const usuarioBDD = await Usuario.findOne({ token })
        if (!usuarioBDD) {
            return res.status(404).json({ msg: 'Lo sentimos, no se puede validar el token' })
        }
 
        res.status(200).json({ msg: 'Token confirmado, ya puedes crear tu nuevo password' })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}
 



const crearNuevoPassword = async (req, res) => {
    try {
        const { password, confirmpassword } = req.body
        const { token } = req.params
 
        if (!password || !confirmpassword) {
            return res.status(400).json({ msg: 'Debes llenar todos los campos' })
        }
 
        if (password !== confirmpassword) {
            return res.status(400).json({ msg: 'Los passwords no coinciden' })
        }
 
        const usuarioBDD = await Usuario.findOne({ token })
        if (!usuarioBDD) {
            return res.status(404).json({ msg: 'No se puede validar el token' })
        }
 
        usuarioBDD.token = null
        usuarioBDD.password = await usuarioBDD.encryptPassword(password)
        await usuarioBDD.save()
 
        res.status(200).json({ msg: 'Felicitaciones, ya puedes iniciar sesión con tu nuevo password' })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
 
        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ msg: 'Debes llenar todos los campos' })
        }
 
        // Buscar usuario en BDD (excluir campos sensibles/internos)
        const usuarioBDD = await Usuario.findOne({ email })
            .select("-__v -token -updatedAt -createdAt")
 
        // Verificar si el usuario existe
        if (!usuarioBDD) {
            return res.status(404).json({ msg: 'El usuario no se encuentra registrado' })
        }
 
        // Verificar si la cuenta está confirmada
        if (!usuarioBDD.confirmEmail) {
            return res.status(403).json({ msg: 'Debes verificar tu cuenta antes de iniciar sesión' })
        }
 
        // Verificar si la cuenta está activa
        if (!usuarioBDD.status) {
            return res.status(403).json({ msg: 'Tu cuenta ha sido desactivada, contacta al administrador' })
        }
 
        // Verificar el password
        const passwordValido = await usuarioBDD.matchPassword(password)
        if (!passwordValido) {
            return res.status(401).json({ msg: 'El password no es correcto' })
        }
 
        // Generar JWT
        const token = crearTokenJWT(usuarioBDD._id, usuarioBDD.rol)
 
        // Extraer campos a retornar
        const { nombre, email: correo, telefono, carrera, rol, _id } = usuarioBDD
 
        res.status(200).json({
            token,
            _id,
            nombre,
            email: correo,
            telefono,
            carrera,
            rol
        })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

const perfil = (req, res) => {
    // Excluir campos sensibles internos
    const { token, confirmEmail, createdAt, updatedAt, __v, ...datosPerfil } = req.usuarioHeader
    res.status(200).json(datosPerfil)
}


const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params
 
        // Validar que el ID sea un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID inválido: ${id}` })
        }
 
        // Buscar el usuario en la BDD
        const usuarioBDD = await Usuario.findById(id)
        if (!usuarioBDD) {
            return res.status(404).json({ msg: `No existe el usuario con ID ${id}` })
        }
 
        const { nombre, email, telefono, carrera } = req.body
 
        // Si viene un email distinto, verificar que no esté en uso
        if (email && usuarioBDD.email !== email) {
            const emailExistente = await Usuario.findOne({ email })
            if (emailExistente) {
                return res.status(400).json({ msg: 'El email ya se encuentra registrado por otro usuario' })
            }
        }
 
        // Actualizar solo los campos  
        usuarioBDD.nombre    = nombre   ?? usuarioBDD.nombre
        usuarioBDD.email     = email    ?? usuarioBDD.email
        usuarioBDD.telefono  = telefono ?? usuarioBDD.telefono
        usuarioBDD.carrera   = carrera  ?? usuarioBDD.carrera
 
        await usuarioBDD.save()
 
        // Responder sin datos sensibles
        const { password, token, confirmEmail, status, createdAt, updatedAt, __v, ...datosActualizados } = usuarioBDD.toObject()
        res.status(200).json(datosActualizados)
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

const actualizarPassword = async (req, res) => {
    try {
        const { passwordactual, passwordnuevo } = req.body
 
        if (!passwordactual || !passwordnuevo) {
            return res.status(400).json({ msg: 'Debes enviar el password actual y el nuevo' })
        }
 
        // Buscar usuario desde el token (req.usuarioHeader viene del middleware)
        const usuarioBDD = await Usuario.findById(req.usuarioHeader._id)
        if (!usuarioBDD) {
            return res.status(404).json({ msg: 'No existe el usuario' })
        }
 
        // Verificar que el password actual sea correcto
        const passwordValido = await usuarioBDD.matchPassword(passwordactual)
        if (!passwordValido) {
            return res.status(401).json({ msg: 'El password actual no es correcto' })
        }
 
        // Cifrar y guardar el nuevo password
        usuarioBDD.password = await usuarioBDD.encryptPassword(passwordnuevo)
        await usuarioBDD.save()
 
        res.status(200).json({ msg: 'Password actualizado correctamente' })
 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}





export { 
    registro,
    confirmarEmail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword
 }