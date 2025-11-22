import mongoose from 'mongoose'

const connectBD = async () =>{
    try {
        mongoose.connection.on('connected', () => console.log("Conectado a la BD!"))
        await mongoose.connect(`${process.env.MONGODB_URI}/Axtro`)
    } catch (error) {
        console.log(error.message)
    }
}

export default connectBD;