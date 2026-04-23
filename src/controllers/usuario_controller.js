import Usuario from '../models/Usuario.js'
import { sendMailToRegister } from '../helpers/sendMail.js'


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

export { registro }