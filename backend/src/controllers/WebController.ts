import express, { Express, Request, Response } from "express";
import axios from "axios";

import Model from "../models/Model.js";

/**
 * The WebController class is responsible for responding to requests from the client.
 */
class WebController {
    private app: Express;
    private model: Model;

    constructor(app: Express, model: Model) {
        this.app = app;
        this.model = model;
        this.readClient();
    }

    private readClient(): void {
        this.app.get('/login', (req: Request, res: Response) => {
            this.model.loginSpotify(req, res);
        });
        this.app.get('/spotify-callback', (req: Request, res: Response) => {
            this.model.getSpotifyAPIToken(req, res);
        });
    }
}

export default WebController;
