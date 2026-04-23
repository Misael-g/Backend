import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URI_PRODUCTION)
        console.log(`Base de datos conectada en ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(`Error al conectar la base de datos: ${error.message}`);
        process.exit(1)
    }
}

export default  connection


