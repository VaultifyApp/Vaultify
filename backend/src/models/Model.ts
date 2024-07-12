import express, { Response, Request } from "express";

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

    async loginSpotify(req: Request, res: Response): Promise<void> {
        this.spotify.login(req, res);
    }

    async getSpotifyAPIToken(req: Request, res: Response): Promise<void> {
        this.spotify.getToken(req, res);
    }
}

export default Model;
