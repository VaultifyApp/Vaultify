import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import Model from './models/Model.js';
import WebController from './controllers/WebController.js';
import DateController from './controllers/DateController.js';
class Main {
    static main() {
        const app = express();
        const port = Number(process.env.PORT) || 3001;
        app.use(cors());
        app.use(express.json());
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
        const model = new Model();
        const web = new WebController(model);
        const date = new DateController(model);
    }
}
// Check if this script is the main module
if (import.meta.url === new URL(import.meta.url).href) {
    Main.main();
}
