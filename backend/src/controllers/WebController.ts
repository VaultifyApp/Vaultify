import Model from "../models/Model.js"

/**
 * The WebController class is responsible for responding to requests from the client.
 */
class WebController {

    private model: Model;

    constructor(model: Model) {
        this.model = model
    }
}

export default WebController
