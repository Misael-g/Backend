// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';


// Importar rutas
import routerUsuarios from './routers/usuario_routes.js'

// Inicializaciones
const app = express()
dotenv.config()


// Middlewares 
app.use(express.json())
app.use(cors())


// Variables globales
app.set('port', process.env.PORT || 3000)


// Ruta principal
app.get('/',(req,res)=> res.send("Server on - UniBooks"))

// Rutas para usuarios
app.use('/api', routerUsuarios)

// Manejo de rutas que no sean encontradas
app.use((req, res) => res.status(404).json({ msg: 'Endpoint no encontrado - 404' }))


// Exportar la instancia de express por medio del app
export default  app