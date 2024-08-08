import mongoose from "mongoose";
import User from "../interfaces/User.js";
import Playlist from "../interfaces/Playlist.js";
import Track from "../interfaces/Track.js";
import Image from "../interfaces/Image.js";

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
        // format for storing images in the db
        const ImageSchema = new mongoose.Schema<Image>({
            url: {
                type: String,
                required: true, // Makes this field optional
            },
            height: {
                type: Number,
                required: true, // Makes this field optional
            },
            width: {
                type: Number,
                required: true, // Makes this field optional
            },
        });
        // format for storing tracks in the db
        const TrackSchema = new mongoose.Schema<Track>({
            title: {
                type: String,
                required: true,
            },
            artists: {
                type: [String],
                required: true,
            },
            spotifyID: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            popularity: {
                type: Number,
                required: true,
            },
            image: {
                type: ImageSchema,
                required: true,
            },
            note: {
                type: String,
                required: false,
            },
        });
        // format for storing playlists in the db
        const PlaylistSchema = new mongoose.Schema<Playlist>({
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            spotifyID: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            mood: {
                type: Number,
                required: true,
            },
            image: {
                type: ImageSchema,
                required: false,
            },
            tracks: {
                type: [TrackSchema],
                required: true,
            },
        });
        // format for storing users in the db
        const UserSchema = new mongoose.Schema<User>({
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
            image: {
                type: ImageSchema,
                required: false,
            },
            playlists: {
                type: [PlaylistSchema],
                required: true,
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
            settings: {
                notifs: {
                    type: Boolean,
                    required: true,
                },
                numSongs: {
                    type: Number,
                    required: true,
                },
                newOnly: {
                    type: Boolean,
                    required: true,
                },
                coverTheme: {
                    type: String,
                    required: false,
                },
            },
        });
        // stores user model to interact with db
        this.UserModel = mongoose.model<User>("User", UserSchema);
    }

    /**
     * @param user user to be added to the database
     * @effects adds the given user to the database
     * @throws error if user doesn't have required database fields
     */
    async addUser(user: User): Promise<User> {
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
     * @param _id the _id to be searched for
     * @returns the user associated with _id
     * @throws Error if user not found
     */
    async getUser(_id: string): Promise<User> {
        let user: User | null = await this.UserModel.findOne({
            _id: _id,
        }).lean();
        if (!user) {
            console.log(_id);
            throw new Error("User not found in DB");
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
