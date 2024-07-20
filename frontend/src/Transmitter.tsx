import axios from "axios"

import User from "./User.js"

class Transmitter {
    private URI: string = process.env.SERVER_URI;
    /**
     * @returns user profile from the server
     */
    async login(): Promise<User> {
        const _id: string | null = localStorage.getItem("_id");
        if (_id === null) {
            const response = await axios.get(this.URI+"/login");
            let user: User = response.data;
            if (!user._id) {
                throw new Error("User must have an ID");
            }
            localStorage.setItem("_id", user._id);
            return user;
        }
        else {
            const params = {_id: _id};
            const response = await axios.get(this.URI+"/login", {params});
            let user: User = response.data;
            if (!user._id) {
                throw new Error("User must have an ID");
            }
            return user;
        }
    }

    /**
     * @returns updated user profile with the generated playlist
     */
    async generatePlaylist(user: User): Promise<User> {
        const params = {_id: user._id};
        const response = await axios.get(this.URI+"/generate-playlist", {params});
        let updatedUser: User = response.data;
        return updatedUser;
    }

    /**
     * @returns updated user profile with the new bio
     */
    async updateBio(user: User): Promise<User> {
        const params = {_id: user._id, bio: user.bio};
        const response = await axios.get(this.URI+"/update-bio", {params});
        let updatedUser: User = response.data;
        return updatedUser;
    }
}

export default Transmitter;