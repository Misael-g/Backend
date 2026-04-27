import mongoose, { Schema, model } from 'mongoose'

const publicacionSchema = new Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true
        },
        descripcion: {
            type: String,
            required: true,
            trim: true
        },
        precio: {
            type: Number,
            required: true,
            min: 0
        },
        imagen: {
            type: String,
            default: null
        },
        imagenID: {
            type: String,       // public_id de Cloudinary para poder eliminarla
            default: null
        },
        estado: {
            type: String,
            enum: ['disponible', 'vendido'],
            default: 'disponible'
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        }
    },
    {
        timestamps: true
    }
)

export default model('Publicacion', publicacionSchema)