import axios from "axios";

class WebController {
    /**
     * @returns user profile from the server
     */
    async getProfile() {
        // TODO : if user ID is stored in the client, add it to the request
        const uri = process.env.SERVER_URI + "/login";
        const response = await fetch(url, {
            method: "POST", // Specify the HTTP method
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json(); // Parse the JSON response
        return result;
    }
}
