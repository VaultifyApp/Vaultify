import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import Transmitter from "./Transmitter.js"
import Navigator from "./Navigator.js"

/**
 * The Main class is responible for starting the application and constructing objects
 * that the application needs to function.
 */
class Main {
    static main(): void {

        let transmitter = new Transmitter();
        let nav = new Navigator(transmitter);
    }
}

// Check if this script is the main module
if (import.meta.url === new URL(import.meta.url).href) {
    Main.main();
}
