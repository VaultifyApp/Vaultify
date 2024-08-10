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
        this.handleGeneratePlaylist();
        this.handleGetUser();
        this.handleUpdateBio();
        this.handleUpdateNote();
        this.handleUpdateSettings();
    }

    /**
     *
     * @param user
     * @returns user object with tokens removed for client use
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
     * @effects returns an updated user with a new playlist
     */
    private async handleGeneratePlaylist(): Promise<void> {
        this.app.get(
            "/generate-playlist",
            async (req: Request, res: Response) => {
                if (
                    typeof req.query._id !== "string" ||
                    typeof req.query.monthly != "string" ||
                    typeof req.query.newOnly != "string" ||
                    typeof req.query.numSongs != "string" ||
                    typeof req.query.coverTheme != "string"
                ) {
                    return res.status(400).json({ error: "Invalid params" });
                }
                try {
                    let user: User = await this.model.configGeneration(
                        req.query._id,
                        JSON.parse(req.query.monthly),
                        Number(req.query.numSongs),
                        JSON.parse(req.query.newOnly),
                        req.query.coverTheme
                    );
                    res.json(this.removeTokens(user));
                } catch (err) {
                    console.log(err);
                    return res.status(400).json({ error: err });
                }
            }
        );
    }

    /**
     * @effects updates the user's settings in the db
     */
    private async handleUpdateSettings(): Promise<void> {
        this.app.post(
            "/update-settings",
            async (req: Request, res: Response) => {
                if (!req.body) {
                    return res
                        .status(400)
                        .json({ error: "user param invalid" });
                }
                try {
                    this.model.updateSettings(
                        req.body._id,
                        JSON.parse(req.body.monthly),
                        Number(req.body.numSongs),
                        JSON.parse(req.body.newOnly),
                        req.body.coverTheme
                    );
                } catch (err) {
                    console.log(err);
                    return res.status(400).json({ error: err });
                }
            }
        );
    }

    /**
     * @effects updates the given user in the db
     */
    private async handleUpdateBio(): Promise<void> {
        this.app.post("/update-bio", async (req: Request, res: Response) => {
            try {
                this.model.updateBio(req.body._id, req.body.bio);
            } catch (err) {
                console.log(err);
                return res.status(400).json({ error: err });
            }
        });
    }

    /**
     * @effects updates the given track's note in the db
     */
    private async handleUpdateNote(): Promise<void> {
        this.app.post("/update-note", async (req: Request, res: Response) => {
            try {
                this.model.updateNote(
                    req.body._id,
                    req.body.note,
                    Number(req.body.playlistIndex),
                    Number(req.body.trackIndex)
                );
            } catch (err) {
                console.log(err);
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
                    console.log(err);
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
