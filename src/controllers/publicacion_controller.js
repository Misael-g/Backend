import mongoose from 'mongoose'
import Publicacion from '../models/Publicacion.js'
import { subirImagenCloudinary, eliminarImagenCloudinary } from '../helpers/uploadCloudinary.js'



//  Crear una nueva publicacion de libro

const crearPublicacion = async (req, res) => {
    try {
        const { titulo, descripcion, precio } = req.body

        // Validar losl campos obligatorios
        if (!titulo || !descripcion || !precio) {
            return res.status(400).json({ msg: 'Los campos título, descripción y precio son obligatorios' })
        }

        // crear la publicacion con el usuario del token
        const nuevaPublicacion = new Publicacion({
            titulo,
            descripcion,
            precio,
            usuario: req.usuarioHeader._id
        })

        // Subir imagen a Cloudinary si viene en la peticion
        if (req.files?.imagen) {
            const { secure_url, public_id } = await subirImagenCloudinary(req.files.imagen.tempFilePath)
            nuevaPublicacion.imagen = secure_url
            nuevaPublicacion.imagenID = public_id
        }

        await nuevaPublicacion.save()
        res.status(201).json({ msg: 'Publicación creada exitosamente', publicacion: nuevaPublicacion })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}


//    Listar todas las publicaciones disponibles en publico con filtros)

const listarPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find({ estado: 'disponible' })
            .select('-__v -imagenID')
            .populate('usuario', 'nombre email telefono')
            .sort({ createdAt: -1 })

        res.status(200).json(publicaciones)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

//     Ver detalle de una publicacion

const detallePublicacion = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `ID inválido: ${id}` })
        }

        const publicacion = await Publicacion.findById(id)
            .select('-__v -imagenID')
            .populate('usuario', 'nombre email telefono')

        if (!publicacion) {
            return res.status(404).json({ msg: 'Publicación no encontrada' })
        }

        res.status(200).json(publicacion)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: ` Error en el servidor - ${error}` })
    }
}




export {
    crearPublicacion,
    listarPublicaciones,
    detallePublicacion,

}