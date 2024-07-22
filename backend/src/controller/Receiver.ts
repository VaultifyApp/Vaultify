import { Express, Request, Response } from "express";
import querystring from "querystring";

import Model from "../model/Model.js";
import User from "../model/User.js";

/**
 * The Receiver class is responsible for responding to requests from the client.
 */
class Receiver {
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
        this.app.get(
            "/generate-playlist",
            async (req: Request, res: Response) => {
                if (
                    !req.query._id ||
                    typeof req.query._id !== "string" ||
                    req.query._id == "undefined"
                ) {
                    throw new Error("Must have ID to generate playlist");
                }
                let user: User = await this.model.generatePlaylist(
                    req.query._id
                );
                if (
                    req.query.notifs &&
                    typeof req.query.notifs !== "boolean" &&
                    req.query.notifs == "true"
                ) {
                    this.model.sendWelcomeEmail(user);
                }
                user = this.removeTokens(user);
                res.json(user);
            }
        );
    }

    /**
     *
     * @param user
     * @returns user with tokens removed for client use
     */
    private removeTokens(user: User) {
        const {
            spotifyID,
            href,
            uri,
            accessToken,
            refreshToken,
            ...userWithoutTokens
        } = user;
        return userWithoutTokens;
    }

    /**
     * @effects returns user profile information
     */
    private async handleLogin(): Promise<void> {
        this.app.get("/login", async (req: Request, res: Response) => {
            // if new user / no id given, send to Spotify OAuth
            if (
                !req.query._id ||
                typeof req.query._id !== "string" ||
                req.query._id == "undefined"
            ) {
                // sets query params for Spotify login
                const queryParams: string = querystring.stringify({
                    client_id: process.env.CLIENT_ID,
                    response_type: "code",
                    redirect_uri: process.env.REDIRECT_URI,
                    scope: "user-read-private user-read-email playlist-modify-public playlist-modify-private user-top-read",
                });
                // redirects to OAuth
                res.redirect(
                    `https://accounts.spotify.com/authorize?${queryParams}`
                );
                // handles spotify callback after redirect
                this.app.get(
                    "/spotify-callback",
                    async (req: Request, res: Response) => {
                        if (
                            !req.query.code ||
                            typeof req.query.code !== "string"
                        ) {
                            throw new Error(
                                "Invalid query code: can't retrieve token"
                            );
                        } else {
                            let user: User = await this.model.addUser(
                                req.query.code
                            );
                            user = this.removeTokens(user);
                            res.redirect(
                                `http://localhost:3000/login?user=${JSON.stringify(user)}`
                            );
                        }
                    }
                );
            } else {
                // else retrieve user from database
                let user: User = await this.model.getUser(req.query._id);
                user = this.removeTokens(user);
                res.redirect(
                    `http://localhost:3000/login?user=${JSON.stringify(user)}`
                );
            }
        });
    }
}

export default Receiver;
