import Transmitter from "./Transmitter.js"
import User from "./User.js"

/**
 * The Navigator class is responsible for navigating between the site's various webpages
 */
class Navigator {
    private transmitter: Transmitter
    private user: User

    constructor(transmitter: Transmitter) {
        this.transmitter = transmitter;
    }
}

export default Navigator;