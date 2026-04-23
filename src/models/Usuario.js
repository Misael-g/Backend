import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        telefono: {
            type: String,
            required: true,
            trim: true
        },
        carrera: {
            type: String,
            trim: true,
            default: null
        },
        rol: {
            type: String,
            enum: ['usuario', 'admin'],
            default: 'usuario'
        },
        status: {
            type: Boolean,
            default: true
        },
        confirmEmail: {
            type: Boolean,
            default: false
        },
        token: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
)

// Método para cifrar el password
usuarioSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypt = await bcrypt.hash(password, salt)
    return passwordEncrypt
}

// Método para verificar si el password coincide con el de la BDD
usuarioSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password)
    return response
}

// Método para crear un token aleatorio
usuarioSchema.methods.createToken = function () {
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

export default model('Usuario', usuarioSchema)