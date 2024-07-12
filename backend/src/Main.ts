import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import Model from "./models/Model.js";
import WebController from "./controllers/WebController.js";
import DateController from "./controllers/DateController.js";

/**
 * The Main class is responible for starting the server and constructing objects
 * that the server needs to function, such as controllers and models.
 */
class Main {
    static main(): void {
        // intialize server environment
        const app: Express = express();
        const port: number = Number(process.env.PORT) || 3001;

        app.use(cors());
        app.use(express.json());

        let model: Model = new Model();
        let web: WebController = new WebController(app, model);
        let date: DateController = new DateController(app, model);

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    }
}

// Check if this script is the main module
if (import.meta.url === new URL(import.meta.url).href) {
    Main.main();
}
