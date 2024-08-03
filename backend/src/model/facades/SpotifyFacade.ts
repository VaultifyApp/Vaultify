import { Buffer } from "buffer";
import axios, { Axios, AxiosResponse, isAxiosError } from "axios";
import querystring from "querystring";

import User from "../User.js";
import { URLSearchParams } from "url";
import { response } from "express";

/**
 * The SpotifyFacade class is responsible for all interactions with the Spotify Web API, such as
 * retrieving user information or creating playlists.
 * This class decouples other code from the Spotify Web API
 */
class SpotifyFacade {
    private CLIENT_ID: string = process.env.CLIENT_ID || "";
    private CLIENT_SECRET: string = process.env.CLIENT_SECRET || "";
    private REDIRECT_URI: string = process.env.REDIRECT_URI || "";
    private AxiosInstance = axios.create();

    /**
     * @param user the user to make a request for
     * @param request the request body
     * @effects makes axios request with the given params.
     *          Retries request with refreshed token on failure.
     */
    private async makeRequest(
        user: User,
        request: any
    ): Promise<AxiosResponse> {
        if (!request.headers) request.headers = {};
        request.headers.Authorization = `Bearer ${user.accessToken}`;
        let response: AxiosResponse;
        try {
            response = await axios(request);
        } catch (error) {
            if (
                !isAxiosError(error) ||
                (error.response && error.response.status === 401)
            ) {
                // Token expired, refresh token
                user = await this.refreshToken(user);
                request.headers.Authorization = `Bearer ${user.accessToken}`;
                // Retry the request with the new token
                response = await axios(request);
            } else {
                throw error;
            }
        }
        return response;
    }

    /**
     * @param user the user to be given a new access token
     * @returns updated user object with an active token
     */
    private async refreshToken(user: User): Promise<User> {
        if (typeof user.refreshToken != "string")
            throw new Error("Must have refresh token to refresh access");
        const response: AxiosResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: user.refreshToken,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString("base64")}`,
                },
            }
        );
        user.accessToken = response.data.access_token;
        user.refreshToken = response.data.refresh_token;
        return user;
    }

    /**
     * @param queryCode the code sent in the Spotify API request
     * @returns  A new User profile with spotify profile information
     */
    async getProfile(queryCode: string): Promise<User> {
        // gets user tokens from spotify
        const tokenResponse: AxiosResponse = await axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            data: querystring.stringify({
                grant_type: "authorization_code",
                code: queryCode,
                redirect_uri: this.REDIRECT_URI,
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString("base64")}`,
            },
        });
        const body = {
            method: "get",
            url: "https://api.spotify.com/v1/me",
        };
        const profileResponse: AxiosResponse = await axios({
            method: "get",
            url: "https://api.spotify.com/v1/me",
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`,
            },
        });
        let user: User = {
            accessToken: tokenResponse.data.access_token,
            refreshToken: tokenResponse.data.refresh_token,
            username: profileResponse.data.display_name,
            email: profileResponse.data.email,
            href: profileResponse.data.href,
            uri: profileResponse.data.uri,
            images: profileResponse.data.images,
            spotifyID: profileResponse.data.id,
            playlists: [],
            bio: "",
        };
        return user;
    }

    /**
     *
     * @param user the user to retrieve profile data for
     * @returns user with updated profile data
     */
    async updateProfile(user: User): Promise<User> {
        const body = {
            method: "get",
            url: "https://api.spotify.com/v1/me",
        };
        let response: AxiosResponse = await this.makeRequest(user, body);
        user.username = response.data.display_name;
        user.email = response.data.email;
        user.href = response.data.href;
        user.uri = response.data.uri;
        user.images = response.data.images;
        user.spotifyID = response.data.id;
        return user;
    }

    /**
     * @param user the user to retrieve songs for
     * @param numSongs num top songs to retrieve
     * @returns an array of uri's of the user's top songs for the month
     */
    private async getTopSongs(user: User, numSongs: number): Promise<string[]> {
        let body = {
            method: "get",
            url: "https://api.spotify.com/v1/me/top/tracks",
            params: {
                limit: numSongs,
                time_range: "short_term",
            },
        };
        const response: AxiosResponse = await this.makeRequest(user, body);
        const items = response.data.items;
        let songs: string[] = items.map((item: { uri: string }) => item.uri);
        return songs;
    }

    /**
     *
     * @param user the user to generate a playlist for
     * @returns an updated user object with a new playlist
     */
    // TODO: make playlist name not hardcoded
    async generatePlaylist(user: User): Promise<User> {
        const currentDate = new Date();

        // TODO : : CONFIG TITLE FOR MID MONTH VS RECAP

        // Get current month and year to name playlist
        const monthIndex = currentDate.getMonth();
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const currMonth = monthNames[monthIndex];
        const currYear = currentDate.getFullYear();
        let songs: string[] = await this.getTopSongs(user, 50);
        let createBody = {
            method: "post",
            url: `https://api.spotify.com/v1/users/${user.spotifyID}/playlists`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                name: `${currMonth} ${currYear}`,
                description: `${user.username}'s top tracks for ${currMonth} ${currYear}!`,
                public: true,
            },
        };
        const createResponse: AxiosResponse = await this.makeRequest(
            user,
            createBody
        );
        // only add songs if user has top songs
        if (songs.length > 0) {
            let addBody = {
                method: "post",
                url: `https://api.spotify.com/v1/playlists/${createResponse.data.id}/tracks`,
                data: {
                    uris: songs,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            };
            await this.makeRequest(user, addBody);
        }
        // adds playlist to user's profile
        let addToProfileBody = {
            method: "put",
            url: `https://api.spotify.com/v1/playlists/${createResponse.data.id}/followers`,
            data: {
                public: true,
            },
        };
        await this.makeRequest(user, addToProfileBody);
        if (!user.playlists) {
            user.playlists = [];
        }
        user.playlists.push(createResponse.data.external_urls.spotify);
        return user;
    }
}

export default SpotifyFacade;
