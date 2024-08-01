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
        this.handleLogin();
        this.handleGeneration();
    }

    /**
     *
     * @param user
     * @returns user object with tokens removed for client use
     */
    private removeTokens(user: User) {
        const {
            notifs,
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
     * @effects returns an updated user with a new playlist
     */
    private async handleGeneration(): Promise<void> {
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
                if (typeof req.query.monthly != "string") {
                    throw new Error("Query must have notifs param");
                }
                let user: User = await this.model.configGeneration(
                    req.query._id,
                    req.query.monthly
                );
                user = this.removeTokens(user);
                res.json(user);
            }
        );
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
