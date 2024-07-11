import mongoose from 'mongoose';
/**
 * The database facade is responsible for retrieving information from and updating the database.
 * This class decouples other code from the database implementation.
 */
class DatabaseFacade {
    constructor() {
        this.connectToDatabase();
        this.defineSchema();
    }
    // establishes DB connection
    connectToDatabase() {
        const uri = process.env.DATABASE_URI || "N/a";
        try {
            mongoose.connect(uri);
        }
        catch (err) {
            let message = "Unknown Error";
            if (err instanceof Error)
                message = err.message;
            console.error(message);
            process.exit(1);
        }
        const dbConnection = mongoose.connection;
        dbConnection.once('open', (_) => {
            console.log('MongoDB connection established successfully');
        });
        dbConnection.on('error', (err) => {
            console.error(`connection error: ${err}`);
        });
    }
    // defines the user schema that stores user information
    defineSchema() {
        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
            refreshToken: String,
            playlists: [String]
        });
        mongoose.model('User', userSchema);
    }
    addUser() { }
    getUser() { }
}
export default DatabaseFacade;
