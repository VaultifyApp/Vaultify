import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

/**
 * Home page component
 */
const Home = () => {
    const [results, setResults] = useState([]);

    const fetchTrendingTracks = async () => {
        try {
            const token =
                "BQDGlpUt3MR0SUj6pg-F7WlfVEVPFLtZlOKuBC6ubu6rglow5-TjVI2UtIK_0htvaXamN40mg1bLlOlP8B0IlXJMZs5HPxjxwGXRGiYKqtWwE2kwNpY"; // Replace with a valid token
            const response = await axios.get(
                "https://api.spotify.com/v1/browse/new-releases",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        limit: 12,
                    },
                }
            );

            setResults(response.data.albums.items);
        } catch (error) {
            console.error("Error fetching data from Spotify API", error);
        }
    };

    useEffect(() => {
        fetchTrendingTracks();
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
