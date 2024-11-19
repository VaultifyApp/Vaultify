import Track from "./Track.js";
import Image from "./Image.js";

/**
 * The Playlist interface is used to store information on Spotify playlists
 */
interface Playlist {
    title: string;
    description: string;
    url: string;
    spotifyID: string;
    image: Image;
    mood: number;
    tracks: Track[];
}

export default Playlist;
