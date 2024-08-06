import axios from "axios";

/**
 * The Server class is responsible for communications with the server.
 */
class Server {
    static serverURI = "http://localhost:3001";

    /**
     * @effects updates the current user in the db
     */
    static async updateUser(user) {
        await axios.post(Server.serverURI + "/update-user", user);
    }

    /**
     * @effects generates a playlist for the current user
     */
    static async generatePlaylist(user, monthly, numSongs, newOnly) {
        const body = {
            monthly: monthly,
        };
        const response = await axios.get(
            Server.serverURI + "/generate-playlist",
            {
                params: {
                    _id: user._id,
                    monthly: monthly,
                    numSongs: numSongs,
                    newOnly: newOnly,
                },
            }
        );
        return response.data;
    }

    /**
     * @param _id db ID of current user
     * @effects fetches user from db
     */
    static async getUserByID(_id) {
        const response = await axios.get(
            Server.serverURI + `/get-user-by-_id?_id=${_id}`
        );
        return response.data;
    }

    /**
     *
     * @param code spotify oauth code
     */
    static async getUserByCode(code) {
        const response = await axios.get(
            Server.serverURI + `/get-user-by-code?code=${code}`
        );
        return response.data;
    }
}

export default Server;
