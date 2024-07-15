import { Express } from "express";

import Model from "../model/Model.js";

/**
 * The DateController class is responsible for automatically generating content for users on a monthly basic.
 */
class DateController {
    private app: Express;
    private model: Model;

    constructor(app: Express, model: Model) {
        this.app = app;
        this.model = model;
    }
}

export default DateController;
