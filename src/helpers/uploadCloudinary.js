import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs-extra'


// Subir una imagen desde archivo  Cloudinary

const subirImagenCloudinary = async (filePath, folder = 'UniBooks') => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(filePath, { folder })
    await fs.unlink(filePath)   // Eliminar el archivo temporal local
    return { secure_url, public_id }
}

// Eliminar una imagen de Cloudinary con su public_id

const eliminarImagenCloudinary = async (public_id) => {
    if (!public_id) return
    await cloudinary.uploader.destroy(public_id)
}

export { subirImagenCloudinary, eliminarImagenCloudinary }
