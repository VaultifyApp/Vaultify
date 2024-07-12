import express, { Express, Request, Response } from "express";
import cors from "cors";
import querystring from "querystring";
import { Buffer } from 'buffer';
import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

/**
 * The SpotifyFacade class is responsible for all interactions with the Spotify Web API, such as
 * retrieving user information or creating playlists.
 * This class decouples other code from the Spotify Web API
 */
class SpotifyFacade {
    private readonly CLIENT_ID: string = process.env.CLIENT_ID || "Error";
    private readonly CLIENT_SECRET: string = process.env.CLIENT_SECRET || "Error";
    private readonly REDIRECT_URI: string = process.env.REDIRECT_URI || "Error";
    private app: Express = express();

    constructor() {}
    // generates a random string. Used to define the state for login() function
    private generateRandomString(length: number):string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    // redirect user to Spotify OAuth and establishes API credentials
    async login(req: Request, res: Response): Promise<void> {
        // sets query params for Spotify login
        const scope: string = 'user-read-private user-read-email';
        const state: string = this.generateRandomString(16);
        const stateKey: string = 'spotify_auth_state';
        res.cookie(stateKey, state);
        const queryParams: string = querystring.stringify({
          client_id: this.CLIENT_ID,
          response_type: 'code',
          redirect_uri: this.REDIRECT_URI,
          state: state,
          scope: scope,
        });
        // redirects user to Spotify login
        res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
    }

    async getToken(req: Request, res: Response): Promise<void> {
        // store query authorization code
        const code = req.query.code as string || null;
        // send post request to Spotify Web API
        axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: this.REDIRECT_URI
            }),
            headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString('base64')}`,
            },
        })
            .then(response => {
            if (response.status === 200) {
                res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
            } else {
                res.send(response);
            }
            })
            .catch(error => {
            res.send(error);
            });

    }

    getTopSongs(): void {

    }

    generatePlaylist(songs: string): void {

    }

    getPlaylist(link: string):void {

    }
}

export default SpotifyFacade;
