import mongoose from "mongoose";

import User from "../User.js";
import { stringify } from "querystring";

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
            "User",
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
                accessToken: {
                    type: String,
                    required: true,
                },
                refreshToken: {
                    type: String,
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
                    required: true,
                },
                playlists: {
                    type: [String],
                    required: false,
                    default: [],
                },
                bio: {
                    type: String,
                    required: false,
                    default: "",
                },
                spotifyID: {
                    type: String,
                    required: true,
                },
                notifs: {
                    type: Boolean,
                    default: false,
                },
            })
        );
    }

    /**
     * @param user user to be added to the database
     * @effects adds the given user to the database
     * @throws error if user doesn't have required database fields
     */
    async addUser(user: User): Promise<User> {
        if (
            !(
                user.refreshToken &&
                user.accessToken &&
                user.email &&
                user.spotifyID
            )
        ) {
            throw new Error(
                "User must have required fields to be added to the database."
            );
        }
        const existingUser = await this.UserModel.findOne({
            email: user.email,
        });
        if (!existingUser) {
            const added = await new this.UserModel(user).save();
            return added.toObject();
        } else {
            return existingUser.toObject();
        }
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
     * @effects updates the user in the database
     */
    async updateUser(user: User): Promise<User> {
        if (!user._id) {
            throw new Error("User must have an _id to be updated.");
        }
        // Update the user
        const updatedUser = await this.UserModel.findByIdAndUpdate(
            user._id,
            user,
            { new: true, runValidators: true } // Return the updated document and run schema validations
        ).lean();

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return updatedUser;
    }

    /**
     * @returns all users opted in for notifs
     */
    async getOptedInUsers(): Promise<[User]> {
        let users: [User] = await this.UserModel.find({ notifs: true }).lean();
        return users;
    }
}

export default DatabaseFacade;
