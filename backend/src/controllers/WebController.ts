import express, { Express, Request, Response } from "express";
import axios from "axios";

import Model from "../models/Model.js";

/**
 * The WebController class is responsible for responding to requests from the client.
 */
class WebController {
    private model: Model;
    private readonly app: Express = express();

    constructor(model: Model) {
        this.model = model;
        this.readClient();
    }

    private async readClient(): Promise<void> {
        this.app.get('/login', (req: Request, res: Response) => {
            this.model.loginSpotify(req, res);
        });
        this.app.get('/callback', (req: Request, res: Response) => {
            this.model.getSpotifyAPIToken(req, res);
        });
    }
}

export default WebController;
