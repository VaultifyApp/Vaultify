import User from "./interfaces/User.js";
import Playlist from "./interfaces/Playlist.js";
import DatabaseFacade from "./facades/DatabaseFacade.js";
import SpotifyFacade from "./facades/SpotifyFacade.js";
import EmailFacade from "./facades/EmailFacade.js";
import CoverFacade from "./facades/CoverFacade.js";

/**
 * The Model class is responsible for modifying and fetching backend data
 */
class Model {
    private db: DatabaseFacade;
    private spotify: SpotifyFacade;
    private email: EmailFacade;
    private cover: CoverFacade;

    /**
     * @effects constructs facades
     */
    constructor() {
        this.db = new DatabaseFacade();
        this.spotify = new SpotifyFacade();
        this.email = new EmailFacade();
        this.cover = new CoverFacade();
    }

    /**
     * @param queryCode the code associated with the Spotify API query
     * @returns a new user object with user data associated to queryCode
     */
    async addUser(queryCode: string): Promise<User> {
        const user: User = await this.spotify.getProfile(queryCode);
        return await this.db.addUser(user);
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
    async configGeneration(
        _id: string,
        notifs: boolean,
        numSongs: number,
        newOnly: boolean,
        coverTheme: string
    ): Promise<User> {
        let user: User = await this.db.getUser(_id);
        user.settings.notifs = notifs;
        user.settings.numSongs = numSongs;
        user.settings.newOnly = newOnly;
        user.settings.coverTheme = coverTheme;
        user = await this.generatePlaylist(user, true);
        if (user.playlists.length == 1) this.email.sendWelcomeEmail(user);
        this.db.updateUser(user);
        return user;
    }

    /**
     * @param user the user to generate a playlist for
     * @param manual whether the playlist is manually or automatically generated
     * @returns an updated user with a newly generated playlist
     * @effects saves the updated user to the database
     */
    async generatePlaylist(user: User, manual: boolean): Promise<User> {
        user = await this.spotify.generatePlaylist(user, manual);

        if (user.settings.coverTheme && user.settings.coverTheme != "") {
            let newPlaylist: Playlist =
                user.playlists[user.playlists.length - 1];
            newPlaylist = await this.cover.generateCover(
                newPlaylist,
                user.settings.coverTheme
            );
            user.playlists[user.playlists.length - 1] = newPlaylist;
        }

        if (!manual) user.numMonths = user.numMonths + 1;
        this.db.updateUser(user);
        return user;
    }

    /**
     * @effects generates playlists and sends emails to all opted in users
     */
    async monthlyActions(): Promise<void> {
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
    async updateBio(_id: string, bio: string): Promise<void> {
        let user: User = await this.db.getUser(_id);
        user.bio = bio;
        this.db.updateUser(user);
    }

    /**
     * @effects updates user in db
     */
    async updateSettings(
        _id: string,
        notifs: boolean,
        numSongs: number,
        newOnly: boolean,
        coverTheme: string
    ): Promise<void> {
        let user: User = await this.db.getUser(_id);
        user.settings.notifs = notifs;
        user.settings.newOnly = newOnly;
        user.settings.numSongs = numSongs;
        user.settings.coverTheme = coverTheme;
        this.db.updateUser(user);
    }

    /**
     * @param user the user to be updated in the db
     * @effects updates user in db
     */
    async updateNote(
        _id: string,
        note: string,
        playlistIndex: number,
        trackIndex: number
    ) {
        let user: User = await this.db.getUser(_id);
        user.playlists[playlistIndex].tracks[trackIndex].note = note;
        this.db.updateUser(user);
    }

    /**
     * @param user the user to be updated in the db
     * @effects updates user in db
     */
    async updateUser(user: User): Promise<void> {
        this.db.updateUser(user);
    }
}

export default Model;
