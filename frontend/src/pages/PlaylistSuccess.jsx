import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import "./PlaylistSuccess.css";

/**
 * Playlist generation success page component
 */
const PlaylistSuccess = () => {
    const { currentUser } = useContext(AuthContext);
    // navigates user to the most recently generated playlist
    const handleOpenPlaylist = () => {
        if (currentUser.playlists.length > 0) {
            // Get the link of the most recent playlist
            const playlistLink =
                currentUser.playlists[currentUser.playlists.length - 1].url;
            // Navigate to the playlist link
            window.open(playlistLink);
        } else {
            alert("No playlists found in profile.");
        }
    };

    return (
            <div className="success-content">
                <h1>Playlist successfully created.</h1>
                <div className="success-icon">✔</div>
                <button onClick={handleOpenPlaylist} className="success-link">
                    Open playlist here
                </button>
            </div>
    );
};

export default PlaylistSuccess;
