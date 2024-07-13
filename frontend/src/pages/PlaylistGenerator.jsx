import React, { useState } from "react";
import axios from "axios";
import "./PlaylistGenerator.css";

const PlaylistGeneration = () => {
    const [playlist, setPlaylist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generatePlaylist = async () => {
        setLoading(true);
        setError("");
        try {
            const token =
                "BQBcSaFkjvxu8-cAJ7x3b2kbDK8OOuwJ71X1QotvRD3-9xUE1fLFc_mvoLBPsxi4Zp2jmiFgbO3LBi1tDr0dU2I9dpoBol4ZYUIz79nY1eNQhpPU_eo";
            const response = await axios.get(
                "https://api.spotify.com/v1/playlists/{playlist_id}/tracks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        limit: 12,
                    },
                }
            );

            setPlaylist(response.data.items);
        } catch (error) {
            setError("Error generating playlist");
            console.error("Error fetching playlist data from Spotify API", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="playlist-container">
            <div className="playlist-content">
                <h1 className="playlist-title">Playlist Maker</h1>
                <h2 className="playlist-subtitle">Discover Your Next Favorite Songs</h2>
                <button className="playlist-button" onClick={generatePlaylist} disabled={loading}>
                    {loading ? "Generating..." : "Generate Playlist"}
                </button>
                {error && <p className="error">{error}</p>}
                {playlist.length > 0 && (
                    <div className="playlist">
                        <h3 className="playlist-section-title">Your Custom Playlist:</h3>
                        <ul>
                            {playlist.map((track) => (
                                <li key={track.track.id}>
                                    <img
                                        src={track.track.album.images[0].url}
                                        alt={track.track.name}
                                        width="50"
                                    />
                                    {track.track.name} by{" "}
                                    {track.track.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <p className="playlist-text">
                    Automatically track and preserve your monthly music journey.. 
                    Click the button above to generate a new playlist and enjoy a fresh musical journey!
                </p>
            </div>
        </div>
    );
};

export default PlaylistGeneration;
