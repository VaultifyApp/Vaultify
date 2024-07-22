import { Buffer } from "buffer";
import axios, { Axios, AxiosResponse, isAxiosError } from "axios";
import querystring from "querystring";

import User from "../User.js";
import { URLSearchParams } from "url";

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
     * @effects configures axios to handle expired access tokens
     */
    constructor() {

    }

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
                redirect_uri: this.REDIRECT_URI,
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString("base64")}`,
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
        user = await this.updateProfile(user);
        user.playlists = [];
        user.bio = "";
        return user;
    }

    /**
     *
     * @param user the user to retrieve profile data for
     * @returns user with updated profile data
     */
    async updateProfile(user: User): Promise<User> {
        let response: AxiosResponse;
        try {
            response = await axios.get(
                "https://api.spotify.com/v1/me",
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                }
            );
        } catch (error) {
            if (!isAxiosError(error) || error.response && error.response.status === 401) {
                // Token expired, refresh token
                user = await this.refreshToken(user);
                // Retry the request with the new token
                response = await axios.get(
                    "https://api.spotify.com/v1/me",
                    {
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`,
                        },
                    }
                );
            } else {
                throw error;
            }
        }
        if (
            !(
                response.data.display_name &&
                response.data.email &&
                response.data.href &&
                response.data.uri &&
                response.data.images
            )
        ) {
            throw new Error("Failed to retrieve profile information");
        }
        user.username = response.data.display_name;
        user.email = response.data.email;
        user.href = response.data.href;
        user.uri = response.data.uri;
        user.images = response.data.images;
        user.spotifyID = response.data.id;
        return user;
    }

    /**
     * @param user the user to be given a new access token
     * @returns updated user object with an active token
     */
    private async refreshToken(user: User): Promise<User> {
        if (typeof user.refreshToken != "string") throw new Error("Must have refresh token to refresh access");
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
     * @param user the user to retrieve songs for
     * @param numSongs num top songs to retrieve
     * @returns an array of uri's of the user's top songs for the month
     */
    private async getTopSongs(user: User, numSongs: number): Promise<string[]> {
        let response: AxiosResponse;
        try {
            response = await axios.get(
                "https://api.spotify.com/v1/me/top/tracks",
                {
                    params: {
                        limit: numSongs,
                        time_range: "short_term",
                    },
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                }
            );
        } catch (error) {
            if (isAxiosError(error) && error.response && error.response.status == 401) {
                // Token expired, refresh token
                user = await this.refreshToken(user);
                // Retry the request with the new token
                response = await axios.get(
                    "https://api.spotify.com/v1/me/top/tracks",
                    {
                        params: {
                            limit: numSongs,
                            time_range: "short_term",
                        },
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`,
                        },
                    }
                );
            } else {
                throw error;
            }
        }
        const items = response.data.items;
        let songs: string[] = items.map((item: { uri: string; }) => item.uri);
        return songs;
    }

    /**
     * 
     * @param user the user to generate a playlist for
     * @returns an updated user object with a new playlist
     */
    // TODO: make playlist name not hardcoded
    async generatePlaylist(user: User): Promise<User> {
        if (!user.username) throw new Error("User must have username")
        let songs: string[] = await this.getTopSongs(user, 50);
        let createResponse: AxiosResponse;
        try {
            createResponse = await axios.post(
                `https://api.spotify.com/v1/users/${user.spotifyID}/playlists`,
                {
                    name: "July 2024",
                    description: `${user.username}'s top tracks for July!`,
                    public: false
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
        } catch (error) {
            if (!isAxiosError(error) || error.response && error.response.status === 401) {
                // Token expired, refresh token
                user = await this.refreshToken(user);
                // Retry the request with the new token
                createResponse = await axios.post(
                    `https://api.spotify.com/v1/users/${user.spotifyID}/playlists`,
                    {
                        name: "July 2024",
                        description: `${user.username}'s top tracks for July!`,
                        public: false
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );
            } else {
                throw error;
            }
        }
        if (songs) {
            let addResponse: AxiosResponse;
            try {
                addResponse = await axios.post(
                    `https://api.spotify.com/v1/playlists/${createResponse.data.id}/tracks`,
                    {
                        uris: songs,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } catch (error) {
                if (!isAxiosError(error) || error.response && error.response.status === 401) {
                    // Token expired, refresh token
                    user = await this.refreshToken(user);
                    // Retry the request with the new token
                    addResponse = await axios.post(
                        `https://api.spotify.com/v1/playlists/${createResponse.data.id}/tracks`,
                        {
                            uris: songs,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${user.accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                } else {
                    throw error;
                }
            }
        }
        if (!user.playlists) {
            user.playlists = []
        }
        user.playlists.push(createResponse.data.external_urls.spotify);
        return user;
    }
}

export default SpotifyFacade;
