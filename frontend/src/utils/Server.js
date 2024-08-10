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
     * @effects updates the current user in the db
     */
    static async updateBio(user) {
        const body = {
            _id: user._id,
            bio: user.bio,
        };
        await axios.post(Server.serverURI + "/update-bio", body);
    }

    /**
     * @effects updates the current user in the db
     */
    static async updateNote(user, playlistIndex, trackIndex) {
        const body = {
            _id: user._id,
            note: user.playlists[playlistIndex].tracks[trackIndex].note,
            playlistIndex: playlistIndex,
            trackIndex: trackIndex,
        };
        await axios.post(Server.serverURI + "/update-note", body);
    }

    /**
     * @effects generates a playlist for the current user
     */
    static async generatePlaylist(user, monthly, numSongs, newOnly, theme) {
        const response = await axios.get(
            Server.serverURI + "/generate-playlist",
            {
                params: {
                    _id: user._id,
                    monthly: monthly,
                    numSongs: numSongs,
                    newOnly: newOnly,
                    coverTheme: theme,
                },
            }
        );
        return response.data;
    }

    /**
     * @effects generates a playlist for the current user
     */
    static async updateSettings(user) {
        const body = {
            _id: user._id,
            numSongs: user.settings.numSongs,
            newOnly: user.settings.newOnly,
            coverTheme: user.settings.coverTheme,
            monthly: user.settings.notifs,
        };
        const response = await axios.post(
            Server.serverURI + "/update-settings",
            body
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
