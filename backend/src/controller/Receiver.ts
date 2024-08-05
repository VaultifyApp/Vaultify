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
                    return res.status(400).json({ error: "Invalid _id param" });
                }
                if (typeof req.query.monthly != "string") {
                    return res
                        .status(400)
                        .json({ error: "Invalid monthly param" });
                }
                try {
                    let user: User = await this.model.configGeneration(
                        req.query._id,
                        req.query.monthly
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
        this.app.get("/update-user", async (req: Request, res: Response) => {
            if (
                !req.query.user ||
                typeof req.query.user !== "string" ||
                req.query.user == "undefined"
            ) {
                return res.status(400).json({ error: "user param invalid" });
            }
            try {
                const user: User = JSON.parse(req.query.user);
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
            "/get-user-from-_id",
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
            "/get-user-from-code",
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
                    return res.status(400).json({ error: err });
                }
            }
        );
    }
}

export default Receiver;
