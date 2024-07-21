import React from "react";
import { useNavigate } from "react-router-dom";
import "./PlaylistSuccess.css";

const PlaylistSuccess = () => {
    const navigate = useNavigate();

    const handleOpenPlaylist = () => {
        // Retrieve the profile data from localStorage
        const profile = JSON.parse(localStorage.getItem("profile"));

        // Check if the profile and playlists exist
        if (profile && profile.playlists && profile.playlists.length > 0) {
            // Get the first playlist link from the array
            const playlistLink = profile.playlists[0]; // Assuming you want the first link

            // Navigate to the playlist link
            navigate(playlistLink);
        } else {
            alert("No playlist link found in the profile.");
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
