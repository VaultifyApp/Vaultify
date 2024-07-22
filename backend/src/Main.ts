import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import Model from "./model/Model.js";
import Receiver from "./controller/Receiver.js";
import Automator from "./controller/Automator.js";

/**
 * The Main class is responible for starting the server and constructing objects
 * that the server needs to function, such as controllers and models.
 */
class Main {
    static main(): void {
        // intialize server environment
        const app: Express = express();
        const port: number = Number(process.env.SERVER_PORT) || 3001;

        const allowedOrigins = [
            "https://accounts.spotify.com",
            "http://localhost:3000",
            "http://localhost:3001",
        ];

        app.use(
            cors({
                origin: allowedOrigins,
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                allowedHeaders: ["Content-Type", "Authorization"],
                credentials: true,
            })
        );

        app.use(express.json());

        let model: Model = new Model();
        let web: Receiver = new Receiver(app, model);
        let date: Automator = new Automator(app, model);

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    }
}

// Check if this script is the main module
if (import.meta.url === new URL(import.meta.url).href) {
    Main.main();
}
