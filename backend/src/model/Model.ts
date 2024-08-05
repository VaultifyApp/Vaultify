import User from "./User.js";
import DatabaseFacade from "./facades/DatabaseFacade.js";
import SpotifyFacade from "./facades/SpotifyFacade.js";
import EmailFacade from "./facades/EmailFacade.js";

/**
 * The Model class is responsible for modifying and fetching backend data
 */
class Model {
    private db: DatabaseFacade;
    private spotify: SpotifyFacade;
    private email: EmailFacade;

    /**
     * @effects constructs facades
     */
    constructor() {
        this.db = new DatabaseFacade();
        this.spotify = new SpotifyFacade();
        this.email = new EmailFacade();
    }

    /**
     * @param queryCode the code associated with the Spotify API query
     * @returns a new user object with user data associated to queryCode
     */
    async addUser(queryCode: string): Promise<User> {
        const user: User = await this.spotify.getProfile(queryCode);
        return this.db.addUser(user);
    }

    /**
     * @param _id the ID to be searched for in the database
     * @returns the user interface associated with that email.
     */
    async getUserByID(_id: string): Promise<User> {
        let user: User = await this.db.getUser(_id);
        user = await this.spotify.updateProfile(user);
        this.db.updateUser(user);
        return user;
    }

    /**
     * @param code the spotify code to get user info
     * @returns the user associated with that code
     */
    async getUserByCode(code: string): Promise<User> {
        let user: User = await this.spotify.getProfile(code);
        return await this.db.addUser(user);
        // TODO : UPDATE USER IF THEY ALREADY EXISTS
    }

    /**
     * @param _id the ID of the user to generate a playlist for
     * @returns an updated user with a newly generated playlist
     * @effects saves the updated user to the database and sends welcome email
     */
    async configGeneration(_id: string, notifs: string): Promise<User> {
        let user: User = await this.db.getUser(_id);
        user = await this.generatePlaylist(user, true);
        if (notifs == "true") {
            user.notifs = true;
            this.email.sendWelcomeEmail(user);
            this.db.updateUser(user);
        } else {
            user.notifs = false;
            this.db.updateUser(user);
        }

        return user;
    }

    /**
     * @param user the user to generate a playlist for
     * @param manual whether the playlist is manually or automatically generated
     * @returns an updated user with a newly generated playlist
     * @effects saves the updated user to the database
     */
    async generatePlaylist(user: User, manual: boolean): Promise<User> {
        user = await this.spotify.generatePlaylist(user, 50, manual);
        this.db.updateUser(user);
        return user;
    }

    /**
     * @effects generates playlists and sends emails to all opted in users
     */
    async monthlyGenerate(): Promise<void> {
        let users: [User] = await this.db.getOptedInUsers();
        for (let i = 0; i < users.length; i++) {
            users[i] = await this.generatePlaylist(users[i], false);
            this.email.sendNewPlaylistEmail(users[i]);
        }
    }

    /**
     * @param user the user to be updated in the db
     * @effects updates user in db
     */
    async updateUser(user: User, manual: boolean): Promise<void> {
        this.db.updateUser(user);
    }
}

export default Model;
