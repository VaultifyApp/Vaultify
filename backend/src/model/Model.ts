import User from "./User.js";
import DatabaseFacade from "./facades/DatabaseFacade.js";
import SpotifyFacade from "./facades/SpotifyFacade.js";
import { MailerSend, EmailParams, Recipient, Sender } from "mailersend";

/**
 * The Model class is responsible for
 */
class Model {
    private db: DatabaseFacade;
    private spotify: SpotifyFacade;
    private readonly mailer = new MailerSend({
        apiKey: process.env.MAILER_KEY || "",
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
     * @effects saves the updated user to the database and sends welcome email
     */
    async configGeneration(_id: string, notifs: string): Promise<User> {
        let user: User = await this.db.getUser(_id);
        user = await this.generatePlaylist(user);
        if (notifs == "true") {
            user.notifs = true;
            this.sendWelcomeEmail(user);
            this.db.updateUser(user);
        }
        return user;
    }

    /**
     * @param _id the ID of the user to generate a playlist for
     * @returns an updated user with a newly generated playlist
     * @effects saves the updated user to the database
     */
    async generatePlaylist(user: User): Promise<User> {
        user = await this.spotify.generatePlaylist(user);
        this.db.updateUser(user);
        return user;
    }

    /**
     * @effects generates playlists and sends emails to all opted in users
     */
    async monthlyGenerate(): Promise<void> {
        let users: [User] = await this.db.getOptedInUsers();
        for (let i = 0; i < users.length; i++) {
            users[i] = await this.generatePlaylist(users[i]);
            this.sendNewPlaylistEmail(users[i]);
        }
    }

    /**
     * @param user the user to email
     * @effects sends a welcome email to the provided user's email.
     */
    async sendWelcomeEmail(user: User): Promise<void> {
        if (!user.email) throw new Error("User must have email");
        const sentFrom = new Sender(process.env.EMAIL || "", "Vaultify");
        const recipients = [new Recipient(user.email)];
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Welcome to Vaultify!")
            .setText(
                "Congratulations on creating your first playlist with Vaultify!\nWe'll be keeping touch every month with a brand new playlist for you to enjoy!\n\nSincerely,\nThe Vaultify Team :)"
            );

        this.mailer.email
            .send(emailParams)
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    }

    /**
     * @param user the user to email
     * @effects sends an email with a link to the user's new playlist
     */
    async sendNewPlaylistEmail(user: User): Promise<void> {
        if (!user.email || !user.playlists || user.playlists.length == 0) {
            throw new Error("User must have email and playlists");
        }
        const sentFrom = new Sender(process.env.EMAIL || "", "Vaultify");
        const recipients = [new Recipient(user.email)];
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Your Monthly Recap is Here!")
            .setText(
                `Here's the link to your monthly recap:\n${user.playlists[user.playlists.length - 1]}\n\nEnjoy!\n-The Vaultify Team :)`
            );

        this.mailer.email
            .send(emailParams)
            .catch((error) => console.log(error));
    }
}

export default Model;
