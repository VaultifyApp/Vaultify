import mongoose, { Model, Connection } from "mongoose";

import User from "../User.js";

/**
 * The database facade is responsible for retrieving information from and updating the database.
 * This class decouples other code from the database implementation.
 */
class DatabaseFacade {
    private readonly UserModel;

    /**
     * @effects connects to database and creates user model
     * @throws Error if class fails to connect to the database
     */
    constructor() {
        // connects to database
        const uri: string = process.env.DATABASE_URI || "URI not found";
        try {
            mongoose.connect(uri);
        } catch (err) {
            throw err;
        }
        mongoose.connection.once("open", (_) => {
            console.log("MongoDB connection established successfully");
        });
        mongoose.connection.on("error", (err) => {
            throw err;
        });
        // creates database model for users.
        this.UserModel = mongoose.model<User>(
            "UserModel",
            new mongoose.Schema<User>({
                username: {
                    type: String,
                    required: true,
                },
                email: {
                    type: String,
                    required: true,
                    unique: true,
                },
                bio: {
                    type: String,
                    required: false,
                },
                accessToken: {
                    type: String,
                    required: true,
                },
                refreshToken: {
                    type: String,
                    required: true,
                },
                playlists: {
                    type: [String],
                    required: true,
                },
                href: {
                    type: String,
                    required: true,
                },
                uri: {
                    type: String,
                    required: true,
                },
                images: {
                    type: [
                        {
                            url: { type: String, required: true },
                            height: { type: Number, required: true },
                            width: { type: Number, required: true },
                        },
                    ],
                    required: false,
                },
            })
        );
    }

    /**
     *
     */
    async addUser(user: User): Promise<void> {
        await new this.UserModel(user).save();
    }

    /**
     * @param email the email to be searched for
     * @returns the user associated with email
     * @throws Error if user not found
     */
    async getUser(_id: string): Promise<User> {
        let user: User | null = await this.UserModel.findOne({
            _id: _id,
        }).lean();
        if (user === null) {
            throw new Error("User not found");
        }
        return user;
    }

    /**
     *
     */
    async updateUser(user: User): Promise<User | null> {
        throw new Error("Method not implemented");
    }
}

export default DatabaseFacade;
