// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import cloudinary from 'cloudinary'
import fileUpload from 'express-fileupload'


// Importar rutas
import routerUsuarios from './routers/usuario_routes.js'
import routerPublicaciones from './routers/publicacion_routes.js'

// Inicializaciones
const app = express()
dotenv.config()

// Configuraci0n Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// Middlewares 
app.use(express.json())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))


// Variables globales
app.set('port', process.env.PORT || 3000)


// Ruta principal
app.get('/',(req,res)=> res.send("Server on - UniBooks"))

// Rutas 
app.use('/api', routerUsuarios)
app.use('/api', routerPublicaciones)

// Manejo de rutas que no sean encontradas
app.use((req, res) => res.status(404).json({ msg: 'Endpoint no encontrado - 404' }))


// Exportar la instancia de express por medio del app
export default  app