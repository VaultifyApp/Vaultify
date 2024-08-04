/**
 * The Track interface stores track information
 */
interface Track {
    title: string,
    artist: string,
    spotifyID: string,
    url: string,
    popularity: number,
    image: {
        url: string,
        height: number,
        width: number,
    }
}

export default Track;