import DatabaseFacade from "../facades/DatabaseFacade.js";
import SpotifyFacade from "../facades/SpotifyFacade.js";

/**
 * The Model class is responsible for
 */
class Model {
    private database: DatabaseFacade;
    private spotify: SpotifyFacade;

    constructor() {
        this.database = new DatabaseFacade();
        this.spotify = new SpotifyFacade();
    }

    async generatePlaylist(): Promise<any> {
        return "";
    }
}

export default Model;
