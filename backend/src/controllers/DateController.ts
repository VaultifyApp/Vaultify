import Model from "../models/Model.js"

/**
 * The DateController class is responsible for automatically generating content for users on a monthly basic.
 */
class DateController {

    private model: Model;

    constructor(model: Model) {
        this.model = model
    }
}

export default DateController
