import mongoose from 'mongoose'

/**
 * The database facade is responsible for retrieving information from and updating the database.
 * This class decouples other code from the database implementation.
 */
class DatabaseFacade {
    constructor() {
        // establishes DB connection
        const uri = process.env.DATABASE_URI
        try {
            mongoose.connect(uri)
        } catch (err) {
            console.error(err.message)
            process.exit(1)
        }
        const dbConnection = mongoose.connection
        dbConnection.once('open', (_) => {
            console.log('MongoDB connection established successfully')
        })

        dbConnection.on('error', (err) => {
            console.error(`connection error: ${err}`)
        })
    }

    addUser() {}

    getUser() {}
}

export default DatabaseFacade
