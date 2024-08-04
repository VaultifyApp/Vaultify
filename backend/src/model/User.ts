import Playlist from "./Playlist.js";

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
    image?: {
        url: string;
        height: number;
        width: number;
    },
    spotifyID: string;
    notifs: boolean;
}

export default User;
