import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import qs from "qs";
import { Buffer } from "buffer";

// Spotify API credentials
const client_id = "18b9ce009b314b9eb359758d436b7b2b";
const client_secret = "fce85db5774a4140b97d2d939cbafa86";

// Token management
let accessToken = "";
let tokenExpiresAt = 0;

const getToken = async () => {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({ grant_type: "client_credentials" });
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
    };

    try {
        const response = await axios.post(tokenUrl, data, { headers });
        accessToken = response.data.access_token;
        tokenExpiresAt = Date.now() + response.data.expires_in * 1000; // Set token expiry time
        console.log("New Access Token:", accessToken);
        console.log("Token expires in:", response.data.expires_in, "seconds");
    } catch (error) {
        console.error("Error getting access token", error);
    }
};

const getValidToken = async () => {
    if (Date.now() >= tokenExpiresAt) {
        await getToken(); // Refresh token if expired
    }
    return accessToken;
};

const fetchTrendingTracks = async () => {
    const token = await getValidToken();
    const url = "https://api.spotify.com/v1/browse/new-releases?limit=12";
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data.albums.items;
    } catch (error) {
        console.error("Error fetching trending tracks", error);
        return [];
    }
};

// React component
const Home = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const trendingTracks = await fetchTrendingTracks();
            setResults(trendingTracks);
        };
        fetchData();
    }, []);

    return (
        <div className="container">
            <h1>Vaultify</h1>
            <h2>Vault your music memories.</h2>
            <h3>What is Vaultify?</h3>
            <p>
                We here at Vaultify aim to transform your listening experiences
                by generating highly customizable monthly playlists for you
                containing all your favorite songs, which you can export back
                onto your Spotify library with one click. After generating your
                first playlist with us, you can access your very own unique
                “Vault” page to visit all your personal notes, playlists, and
                AI-generated playlist covers. We aspire to snapshot your
                listening journey and portray the personal story that your music
                history tells.
                <br></br>
                <br></br>
                Get started now by accessing the “Playlist Generator” page to
                make your first playlist.
            </p>
            {results.length > 0 && (
                <div className="results">
                    <h3>Trending Now</h3>
                    <ul>
                        {results.map((album) => (
                            <li key={album.id}>
                                <img
                                    src={album.images[0].url}
                                    alt={album.name}
                                    width="50"
                                />
                                {album.name} by{" "}
                                {album.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;
