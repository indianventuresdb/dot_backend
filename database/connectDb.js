import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const conection = await mongoose.connect(process.env.MONGO_URI, { dbName: "dot_backend" })
        console.log(`Database connected on ${conection.connection.host}`)
    } catch (error) {
        console.error("Database connection failed..........")
    }
}

export default connectDb
