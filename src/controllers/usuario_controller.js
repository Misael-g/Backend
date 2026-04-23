import Usuario from '../models/Usuario.js'
import { sendMailToRegister, sendMailToRecoveryPassword } from '../helpers/sendMail.js'


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


export { 
    registro,
    confirmarEmail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword
 }