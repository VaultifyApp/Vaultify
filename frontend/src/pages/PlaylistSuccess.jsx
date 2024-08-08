import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import "./PlaylistSuccess.css";

/**
 * Playlist generation success page component
 */
const PlaylistSuccess = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize navigate
    const [countdown, setCountdown] = React.useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((currentCountdown) => {
                if (currentCountdown <= 1) {
                    navigate("/playlist-view"); // Redirect to the PlaylistView page
                    clearInterval(timer);
                    return 0;
                }
                return currentCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="success-container">
            <div className="success-content">
                <h1>Playlist successfully created.</h1>
                <div className="success-icon">✔</div>
                <p>Redirecting in {countdown}...</p>
            </div>
        </div>
    );
};

export default PlaylistSuccess;
