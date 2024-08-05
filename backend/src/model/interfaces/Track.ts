import Image from "./Image.js";

/**
 * The Track interface stores track information
 */
interface Track {
    title: string;
    artists: string[];
    spotifyID: string;
    url: string;
    popularity: number;
    image: Image;
    note?: string;
}

export default Track;
