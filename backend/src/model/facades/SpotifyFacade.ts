import { Buffer } from "buffer";
import axios, { AxiosResponse } from "axios";
import querystring from "querystring";

import User from "../User.js";

/**
 * The SpotifyFacade class is responsible for all interactions with the Spotify Web API, such as
 * retrieving user information or creating playlists.
 * This class decouples other code from the Spotify Web API
 */
class SpotifyFacade {
    constructor() {}

    /**
     * @param queryCode the code sent in the Spotify API request
     * @returns  Spotify access token from the API
     * @thows error if queryCode is invalid or API request fails
     */
    async createUser(queryCode: string): Promise<User> {
        // send post request to Spotify Web API
        const response: AxiosResponse = await axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            data: querystring.stringify({
                grant_type: "authorization_code",
                code: queryCode,
                redirect_uri: process.env.REDIRECT_URI,
            }),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")}`,
            },
        });
        if (
            !(
                response.data &&
                response.data.access_token &&
                response.data.refresh_token
            )
        ) {
            throw new Error("Failed to get access token");
        }
        let user: User = {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
        };
        return await this.updateProfile(user);
    }

    /**
     *
     * @param user the user to retrieve profile data for
     * @returns user with updated profile data
     */
    async updateProfile(user: User): Promise<User> {
        const response: AxiosResponse = await axios.get(
            "https://api.spotify.com/v1/me",
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
            }
        );
        // TODO : maybe we need more of these params? PROFILE PICTURE
        if (
            !(
                response.data.display_name &&
                response.data.email &&
                response.data.href &&
                response.data.uri
            )
        ) {
            throw new Error("Failed to retrieve profile information");
        }
        user.username = response.data.display_name;
        user.email = response.data.email;
        user.href = response.data.href;
        user.uri = response.data.uri;
        user.images = response.data.images;
        user.playlists = [];
        return user;
    }

    /**
     * @param user the user to be given a new access token
     * @returns updated user object with an active token
     */
    private async refreshToken(user: User) {
        return user;
    }

    getTopSongs(): void {}

    generatePlaylist(songs: string): void {}

    getPlaylist(link: string): void {}
}

export default SpotifyFacade;
