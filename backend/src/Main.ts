import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
// repo root, resolved from the compiled location (backend/built)
const rootDir = path.resolve(currentDir, "../..");
dotenv.config({ path: path.join(rootDir, ".env") });

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
        const port: number = Number(process.env.PORT) || 3001;

        // The client is served from this same origin in production, so the
        // only cross-origin caller left is the Vite dev server.
        const allowedOrigins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
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
        let date: Automator = new Automator(model);

        // Serve the built client. Registered after the API routes so it never
        // shadows them.
        const clientDir = path.join(rootDir, "frontend", "dist");
        app.use(express.static(clientDir));
        // History fallback: any non-API path is handled by React Router.
        app.get("*", (req: Request, res: Response) => {
            res.sendFile(path.join(clientDir, "index.html"));
        });

        app.listen(port, "0.0.0.0", () => {
            console.log(`Server is running on port: ${port}`);
        });
    }
}

// Check if this script is the main module
if (import.meta.url === new URL(import.meta.url).href) {
    Main.main();
}
