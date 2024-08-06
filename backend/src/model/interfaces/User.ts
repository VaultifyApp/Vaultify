import Playlist from "./Playlist.js";
import Image from "./Image.js";

/**
 * The User interface is used to store user data
 */
interface User {
    _id?: string;
    refreshToken: string;
    accessToken: string;
    username: string;
    email: string;
    bio: string;
    href: string;
    uri: string;
    playlists: Playlist[];
    image?: Image;
    spotifyID: string;
    numMonths: number;
    settings: {
        notifs: boolean;
        newOnly: boolean;
        numSongs: number;
    };
}

export default User;
