import React, { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import "./Home.css";

const Home = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [accessToken, setAccessToken] = useState("YOUR_INITIAL_ACCESS_TOKEN");
    const [refreshToken, setRefreshToken] = useState("YOUR_REFRESH_TOKEN");

    const clientId = "18b9ce009b314b9eb359758d436b7b2b";
    const clientSecret = "fce85db5774a4140b97d2d939cbafa86";

    // Function to refresh the access token
    const refreshAccessToken = async () => {
        const tokenUrl = "https://accounts.spotify.com/api/token";
        const data = qs.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        });

        const headers = {
            Authorization:
                "Basic " +
                Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
        };

        try {
            const response = await axios.post(tokenUrl, data, { headers });
            setAccessToken(response.data.access_token); // Update the state with the new access token
            return response.data.access_token;
        } catch (error) {
            console.error("Error refreshing access token:", error);
            throw error;
        }
    };

    // Function to handle search
    const handleSearch = async () => {
        try {
            let token = accessToken;

            // Check if token is expired and refresh if necessary
            if (isTokenExpired(token)) {
                token = await refreshAccessToken();
            }

            const response = await axios.get(
                "https://api.spotify.com/v1/search",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        q: query,
                        type: "track",
                        limit: 12,
                    },
                }
            );

            setResults(response.data.tracks.items);
            setError("");
        } catch (error) {
            console.error("Error fetching data from Spotify API", error);
            if (error.response) {
                setError(
                    `Spotify API Error: ${error.response.data.error.message}`
                );
            } else if (error.request) {
                setError("No response received from Spotify API");
            } else {
                setError("Error setting up request to Spotify API");
            }
        }
    };

    // Function to check if token is expired
    const isTokenExpired = (token) => {
        // Implement a function to check if the token is expired
        // For simplicity, assume tokens are valid for 1 hour
        const decodedToken = parseJwt(token);
        const now = Date.now() / 1000;
        return decodedToken.exp < now;
    };

    // Function to parse JWT token
    const parseJwt = (token) => {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
        );

        return JSON.parse(jsonPayload);
    };

    return (
        <div className="container">
            <h1>Vaultify</h1>
            <h2>Vault your music memories.</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {error && <p className="error">{error}</p>}
            {results.length > 0 && (
                <div className="results">
                    <h3>Search Results:</h3>
                    <ul>
                        {results.map((track) => (
                            <li key={track.id}>
                                <img
                                    src={track.album.images[0].url}
                                    alt={track.name}
                                    width="50"
                                />
                                {track.name} by{" "}
                                {track.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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
        </div>
    );
};

export default Home;
