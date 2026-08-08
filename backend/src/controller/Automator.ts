import { Express } from "express";
import schedule from "node-schedule";

import Model from "../model/Model.js";

/**
 * The Automator class is responsible for automatically generating content for users on a monthly basic.
 */
class Automator {
    private model: Model;

    constructor(model: Model) {
        this.model = model;
        // Only trust an in-process schedule when the host keeps the process
        // alive. Otherwise the monthly run is driven by POST /run-monthly.
        if (process.env.ENABLE_INTERNAL_CRON === "true") {
            this.monthlyActions();
            console.log("Internal monthly scheduler enabled");
        }
    }

    private monthlyActions() {
        schedule.scheduleJob("00 12 01 * *", async () => {
            console.log("Generating Playlists...");
            try {
                await this.model.monthlyActions();
            } catch (err) {
                console.log(err);
            }
        });
    }
}

export default Automator;
