import { Buffer } from "buffer";
import axios, { AxiosResponse, isAxiosError } from "axios";
import querystring from "querystring";
import User from "../interfaces/User.js";
import Track from "../interfaces/Track.js";
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
            spotifyID: profileResponse.data.id,
            playlists: [],
            bio: "",
            settings: {
                notifs: false,
                numSongs: 50,
                newOnly: false,
                coverTheme: "",
            },
            numMonths: 0,
        };
        if (profileResponse.data.images[0])
            user.image = profileResponse.data.images[0];
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
        if (response.data.images[0]) user.image = response.data.images[0];
        user.spotifyID = response.data.id;
        return user;
    }

    /**
     *
     * @param user the user to generate a playlist for
     * @param numSongs the number of songs to add to the playlist
     * @param manualGeneration whether the playlist was manually generated
     * @param newOnly whether only new songs to the user should be used
     * @returns an updated user object with a new playlist
     */
    async generatePlaylist(
        user: User,
        manualGeneration: boolean
    ): Promise<User> {
        const numSongs = user.settings.numSongs;
        const newOnly = user.settings.newOnly;
        if (numSongs > 100) throw new Error("numSongs must be <= 100");
        // Get current month and year to name playlist
        const currentDate = new Date();
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
        const currYear = currentDate.getFullYear();
        let name: string;
        let month: string;
        if (manualGeneration) {
            month = monthNames[monthIndex];
            name = `${month} ${currYear} Mid Month Recap`;
        } else {
            month = monthNames[monthIndex - 1];
            name = `${month} ${currYear}`;
        }
        let description: string = `${user.username}'s top tracks for ${month} ${currYear}!`;
        // create playlist for user
        let createBody = {
            method: "post",
            url: `https://api.spotify.com/v1/users/${user.spotifyID}/playlists`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                name: name,
                description: description,
                public: true,
            },
        };
        const createResponse = await this.makeRequest(user, createBody);
        // fetch top tracks for users
        // if newOnly, fetch all tracks for user in dictionary
        let oldTracks: { [key: string]: boolean } = {};
        if (newOnly) {
            for (const playlist of user.playlists) {
                for (const track of playlist.tracks) {
                    oldTracks[track.spotifyID] = true;
                }
            }
        }
        let toBeAdded = [];
        let i: number = 0;
        while (toBeAdded.length < numSongs) {
            let getBody = {
                method: "get",
                url: "https://api.spotify.com/v1/me/top/tracks",
                params: {
                    limit: newOnly
                        ? 50
                        : Math.min(50, numSongs - toBeAdded.length),
                    offset: 50 * i,
                    time_range: "short_term",
                },
            };
            const getTracksResponse: AxiosResponse = await this.makeRequest(
                user,
                getBody
            );
            if (newOnly) {
                for (const item of getTracksResponse.data.items) {
                    if (!oldTracks[item.id]) {
                        toBeAdded.push(item);
                    }
                    if (toBeAdded.length == numSongs) break;
                }
            } else {
                toBeAdded.push(...getTracksResponse.data.items);
            }
            // if user has no more top items, break !!!
            if (getTracksResponse.data.items.length == 0) break;
            i = i + 1;
        }
        // init playlist info
        let averageMood: number = 0.5;
        let tracks: Track[] = [];
        // only analyze / add songs if user has songs
        if (toBeAdded.length > 0) {
            const ids = toBeAdded.map((item: { id: string }) => item.id);
            // analyze mood of tracks
            const analysisBody = {
                method: "get",
                url: "https://api.spotify.com/v1/audio-features",
                params: {
                    ids: ids.join(","),
                },
            };
            const analysisResponse: AxiosResponse = await this.makeRequest(
                user,
                analysisBody
            );
            const analysisData = analysisResponse.data.audio_features;
            // construct Track objects
            let moodTotal = 0;
            for (let i = 0; i < toBeAdded.length; i++) {
                tracks.push({
                    title: toBeAdded[i].name,
                    artists: toBeAdded[i].artists.map(
                        (artist: { name: string }) => artist.name
                    ),
                    spotifyID: toBeAdded[i].id,
                    url: toBeAdded[i].external_urls.spotify,
                    popularity: toBeAdded[i].popularity,
                    image: toBeAdded[i].album.images[0],
                });
                moodTotal += analysisData[i].valence;
            }
            averageMood = moodTotal / toBeAdded.length;
            // add tracks to playlist
            const uris = toBeAdded.map((item: { uri: string }) => item.uri);
            let addBody = {
                method: "post",
                url: `https://api.spotify.com/v1/playlists/${createResponse.data.id}/tracks`,
                data: {
                    uris: uris,
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
        let getImageBody = {
            method: "get",
            url: `https://api.spotify.com/v1/playlists/${createResponse.data.id}/images`,
        };
        const imageResponse: AxiosResponse = await this.makeRequest(
            user,
            getImageBody
        );
        if (!user.playlists) {
            user.playlists = [];
        }
        user.playlists.push({
            title: name,
            description: description,
            url: createResponse.data.external_urls.spotify,
            spotifyID: createResponse.data.id,
            image: imageResponse.data[0],
            mood: averageMood,
            tracks: tracks,
        });
        return user;
    }
}

export default SpotifyFacade;
