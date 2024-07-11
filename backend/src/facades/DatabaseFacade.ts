import mongoose, { Schema, Document, Model, Connection } from "mongoose";

// Define the IUser interface for user properties
interface UserInterface extends Document {
    name: string;
    email: string;
    refreshToken: string;
    playlists: string[];
}

/**
 * The database facade is responsible for retrieving information from and updating the database.
 * This class decouples other code from the database implementation.
 */
class DatabaseFacade {
    // create user schema
    private user: Model<UserInterface> = mongoose.model<UserInterface>(
        "User",
        new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            refreshToken: {
                type: String,
                required: true,
            },
            playlists: [
                {
                    type: String,
                },
            ],
        })
    );

    // establishes database connection
    constructor() {
        this.connectToDatabase();
        const uri: string = process.env.DATABASE_URI || "URI not found";
        try {
            mongoose.connect(uri);
        } catch (err) {
            let message: string = "Unknown Error";
            if (err instanceof Error) message = err.message;
            console.error(message);
            process.exit(1);
        }
        const dbConnection: Connection = mongoose.connection;
        dbConnection.once("open", (_) => {
            console.log("MongoDB connection established successfully");
        });

        dbConnection.on("error", (err) => {
            console.error(`connection error: ${err}`);
        });
    }

    public addUser(): void {}

    public getUser(): void {}
}

export default DatabaseFacade;
