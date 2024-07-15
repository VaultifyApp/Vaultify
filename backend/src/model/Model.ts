import User from "./User.js";
import DatabaseFacade from "./facades/DatabaseFacade.js";
import SpotifyFacade from "./facades/SpotifyFacade.js";

/**
 * The Model class is responsible for
 */
class Model {
    private db: DatabaseFacade;
    private spotify: SpotifyFacade;

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
        this.db.addUser(user);
        return user;
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
}

export default Model;
