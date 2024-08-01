import React from "react";
import { useNavigate } from "react-router-dom";
import "./PlaylistSuccess.css";

/**
 * Indicated success to the user and allows them to navigate to their generated playlist
 */
const PlaylistSuccess = () => {
    // navigates user to the most recently generated playlist
    const handleOpenPlaylist = () => {
        const profile = JSON.parse(localStorage.getItem("profile"));

        if (profile && profile.playlists && profile.playlists.length > 0) {
            // Get the link of the most recent playlist
            const playlistLink =
                profile.playlists[profile.playlists.length - 1];

            // Navigate to the playlist link
            window.open(playlistLink);
        } else {
            alert("No playlists found in profile.");
        }
    };

    return (
        <div className="success-container">
            <div className="success-content">
                <h1>Playlist successfully created.</h1>
                <div className="success-icon">✔</div>
                <button onClick={handleOpenPlaylist} className="success-link">
                    Open playlist here
                </button>
            </div>
        </div>
    );
};

export default PlaylistSuccess;
