import Track from "./Track.js";

/**
 * The Playlist interface is used to store information on Spotify playlists
 */
interface Playlist {
    title: string,
    description: string,
    url: string,
    spotifyID: string,
    image: {
        url: string,
        height: number,
        width: number,
    },
    mood: number,
    tracks: Track[],
}

export default Playlist;