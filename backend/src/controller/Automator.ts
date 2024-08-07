import { Express } from "express";
import schedule from "node-schedule";

import Model from "../model/Model.js";

/**
 * The Automator class is responsible for automatically generating content for users on a monthly basic.
 */
class Automator {
    private app: Express;
    private model: Model;

    constructor(app: Express, model: Model) {
        this.app = app;
        this.model = model;
        this.monthlyGenerate();
    }

    private monthlyGenerate() {
        schedule.scheduleJob("00 12 01 * *", async () => {
            console.log("Generating Playlists...");
            try {
                await this.model.monthlyGenerate();
            } catch (err) {
                console.log(err);
            }
        });
    }
}

export default Automator;
