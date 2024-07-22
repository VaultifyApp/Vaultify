import User from "./User.js";
import DatabaseFacade from "./facades/DatabaseFacade.js";
import SpotifyFacade from "./facades/SpotifyFacade.js";
import nodemailer from "nodemailer";

/**
 * The Model class is responsible for
 */
class Model {
    private db: DatabaseFacade;
    private spotify: SpotifyFacade;
    private readonly emailer = nodemailer.createTransport({
        host: 'live.smtp.mailtrap.io',
        port: 587,
        secure: false, // use SSL
        auth: {
            user: '1a2b3c4d5e6f7g',
            pass: '1a2b3c4d5e6f7g',
        }
    });

    constructor() {
        this.db = new DatabaseFacade();
        this.spotify = new SpotifyFacade();
    }

    /**
     * @param queryCode the code associated with the Spotify API query
     * @returns a new user object with user data associated to queryCode
     */
    async addUser(queryCode: string): Promise<User> {
        const user: User = await this.spotify.createUser(queryCode);
        return this.db.addUser(user);
    }

    /**
     * @param email the email to be searched for in the database
     * @returns the user interface associated with that email.
     */
    async getUser(_id: string): Promise<User> {
        return await this.db.getUser(_id);
    }

    async updateUser() {
        // dont forget await blocks !!!
        //let user: User = this.database.getUser();
        //user = SpotifyFacade.updateProfile(user);
        // send updated info to client
        // store updated info to the database
    }

    /**
     * @param _id the ID of the user to generate a playlist for
     * @returns an updated user with a newly generated playlist
     * @effects saves the updated user to the database
     */
    async generatePlaylist(_id: string): Promise<User> {
        let user: User = await this.db.getUser(_id);
        user = await this.spotify.generatePlaylist(user);
        this.db.updateUser(user);
        return user;
    }

    /**
     * @param user the user to email
     * @effects sends a welcome email to the provided user's email.
     */
    async sendWelcomeEmail(user: User): Promise<void> {
        if (!user.email) throw new Error("User must have email");
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Welcome to Vaultify!",
            text: "Congratulations on creating your first playlist with Vaultify!\n\tWe'll be keeping touch every month with a brand new playlist for you to enjoy!\n\nSincerely,\nThe Vaultify Team :)",
        };
        // Send mail with defined transport object
        this.emailer.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
        });
    }
}

export default Model;
