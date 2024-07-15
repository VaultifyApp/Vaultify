import { Express, Request, Response } from "express";
import querystring from "querystring";

import Model from "../model/Model.js";
import User from "../model/User.js";

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

    // handles HTTP requests
    private async readClient(): Promise<void> {
        this.handleLogin();
    }

    /**
     * 
     * @param user
     * @returns user with tokens removed for client use
     */
    private removeTokens(user: User) {
        const { href, uri, accessToken, refreshToken, ...userWithoutTokens } = user;
        return userWithoutTokens;
    }

    /**
     * handles login request by email.
     *  if user doesnt exist, redirects to Spotify OAuth.
     *   else, respons with user information
     */
    private async handleLogin(): Promise<void> {
        this.app.get("/login", async (req: Request, res: Response) => {
            // if new user, send to Spotify OAuth
            if (!req.query._id || typeof req.query._id !== "string") {
                // generate random string for API code
                let state: string = "";
                const possible =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (let i = 0; i < 16; i++) {
                    state += possible.charAt(
                        Math.floor(Math.random() * possible.length)
                    );
                }
                // sets query params for Spotify login
                const scope: string = "user-read-private user-read-email";
                const stateKey: string = "spotify_auth_state";
                const queryParams: string = querystring.stringify({
                    client_id: process.env.CLIENT_ID,
                    response_type: "code",
                    redirect_uri: process.env.REDIRECT_URI,
                    state: state,
                    scope: scope,
                });
                // redirects to OAuth
                res.cookie(stateKey, state);
                res.redirect(
                    `https://accounts.spotify.com/authorize?${queryParams}`
                );
                // handles spotify callback
                this.app.get("/spotify-callback", async (req: Request, res: Response) => {
                        if (!req.query.code || typeof req.query.code !== "string") {
                            throw new Error("Invalid query code: can't retrieve token");
                        }
                        else {
                            const user: User = await this.model.addUser(
                                req.query.code
                            );
                            res.json(this.removeTokens(user));
                        }
                    }
                );
            } else {
                // else retrieve user from database
                let user: User = await this.model.getUser(req.query._id);
                res.json(this.removeTokens(user));
            }
        });
    }
}

export default WebController;
