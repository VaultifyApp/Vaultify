import { Express, Request, Response } from "express";
import querystring from "querystring";

import Model from "../model/Model.js";
import User from "../model/interfaces/User.js";

/**
 * The Receiver class is responsible for responding to requests from the client.
 */
class Receiver {
    private app: Express;
    private model: Model;

    constructor(app: Express, model: Model) {
        this.app = app;
        this.model = model;
        this.handleGeneration();
        this.handleGetUser();
        this.handleUpdateUser();
    }

    /**
     *
     * @param user
     * @returns user object with tokens removed for client use
     */
    private removeTokens(user: User) {
        const {
            settings,
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
                    typeof req.query._id !== "string" ||
                    typeof req.query.monthly != "string" ||
                    typeof req.query.newOnly != "string" ||
                    typeof req.query.numSongs != "string"
                ) {
                    return res.status(400).json({ error: "Invalid params" });
                }
                try {
                    let user: User = await this.model.configGeneration(
                        req.query._id,
                        JSON.parse(req.query.monthly),
                        Number(req.query.numSongs),
                        JSON.parse(req.query.newOnly)
                    );
                    res.json(this.removeTokens(user));
                } catch (err) {
                    return res.status(400).json({ error: err });
                }
            }
        );
    }

    /**
     * @effects updates the given user in the db
     */
    private async handleUpdateUser(): Promise<void> {
        this.app.post("/update-user", async (req: Request, res: Response) => {
            if (!req.body) {
                return res.status(400).json({ error: "user param invalid" });
            }
            try {
                const user: User = req.body;
                this.model.updateUser(user);
            } catch (err) {
                return res.status(400).json({ error: err });
            }
        });
    }

    /**
     * @effects returns the user associated with given param
     */
    private async handleGetUser(): Promise<void> {
        this.app.get(
            "/get-user-by-_id",
            async (req: Request, res: Response) => {
                if (
                    !req.query._id ||
                    typeof req.query._id !== "string" ||
                    req.query._id == "undefined"
                ) {
                    return res.status(400).json({ error: "Invalid _id param" });
                }
                try {
                    let user: User = await this.model.getUserByID(
                        req.query._id
                    );
                    res.json(this.removeTokens(user));
                } catch (err) {
                    return res.status(400).json({ error: err });
                }
            }
        );
        this.app.get(
            "/get-user-by-code",
            async (req: Request, res: Response) => {
                if (
                    !req.query.code ||
                    typeof req.query.code !== "string" ||
                    req.query.code == "undefined"
                ) {
                    return res
                        .status(400)
                        .json({ error: "Invalid code param" });
                }
                try {
                    let user: User = await this.model.getUserByCode(
                        req.query.code
                    );
                    res.json(this.removeTokens(user));
                } catch (err) {
                    console.log(err);
                    return res.status(400).json({ error: err });
                }
            }
        );
    }
}

export default Receiver;
