import axios from "axios"

import User from "./User.js"

class Transmitter {
    /**
     * @returns user profile from the server
     */
    static async login() {
        const _id = localStorage.getItem("_id");
        if (_id == null) {
            const response = await axios.get(Transmitter.URI+"/login");
            let user = response.data;
            if (!user._id) {
                throw new Error("User must have an ID");
            }
            localStorage.setItem("_id", user._id);
            return user;
        }
        else {
            const params = {_id: _id};
            const response = await axios.get("http://localhost3001"+"/login", {params});
            let user = response.data;
            if (!user._id) {
                throw new Error("User must have an ID");
            }
            return user;
        }
    }

    /**
     * @returns updated user profile with the generated playlist
     */
    static async generatePlaylist(user) {
        const params = {_id: user._id};
        const response = await axios.get("http://localhost3001"+"/generate-playlist", {params});
        let updatedUser = response.data;
        return updatedUser;
    }

    /**
     * @returns updated user profile with the new bio
     */
    static async updateBio(user) {
        const params = {_id: user._id, bio: user.bio};
        const response = await axios.get("http://localhost3001"+"/update-bio", {params});
        let updatedUser = response.data;
        return updatedUser;
    }
}

export default Transmitter;