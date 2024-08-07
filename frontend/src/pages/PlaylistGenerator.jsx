import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../utils/AuthContext";
import Server from "../utils/Server";
import "./PlaylistGenerator.css";

/**
 * Playlist Generator page component
 */
const PlaylistGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [lengthType, setLengthType] = useState("songs");
    const [numSongs, setNumSongs] = useState(25);
    const [coverTheme, setCoverTheme] = useState("");
    const [newOnly, setNewOnly] = useState(false);
    const [monthly, setMonthly] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customLength, setCustomLength] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate

    const { currentUser, setCurrentUser } = useContext(AuthContext);

    const maxSongs = 100;
    const maxTimeInHours = (maxSongs * 3) / 60; // Assuming 3 minutes per song

    // verifies validity of custom length inputs
    const handleCustomLengthSubmit = () => {
        const lengthValue = Number(customLength);
        if (
            (lengthType === "songs" &&
                !isNaN(lengthValue) &&
                lengthValue > 0 &&
                lengthValue <= maxSongs) ||
            (lengthType === "time" &&
                !isNaN(lengthValue) &&
                lengthValue > 0 &&
                lengthValue <= maxTimeInHours)
        ) {
            if (lengthType === "time")
                setNumSongs(Math.round(lengthValue * 20.0));
            else setNumSongs(Math.round(lengthValue));
            setIsModalOpen(false);
            setCustomLength(true);
        } else {
            alert(
                `Please enter a valid number of ${lengthType === "songs" ? `songs (1-${maxSongs})` : `hours (1-${maxTimeInHours})`}.`
            );
        }
    };

    // calls the server to generate a playlist for the user
    const generatePlaylist = async () => {
        setLoading(true);
        setError(false);
        try {
            const playlistData = await Server.generatePlaylist(
                currentUser,
                monthly,
                numSongs,
                newOnly
            );
            localStorage.setItem('playlistData', JSON.stringify(playlistData)); // Store playlist data in localStorage
            setCurrentUser(playlistData);
            navigate("/playlist-success");
        } catch (error) {
            setError(true);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    // handles switching between time and num songs
    const handleLengthTypeChange = (type) => {
        setLengthType(type);
        if (type === "time") {
            setNumSongs(20); // Automatically set to 1 hour
        } else {
            setNumSongs(25); // Default to 25 songs
        }
    };

    return (
        <div id="playlist-container">
            <div className="playlist-content">
                <h1 className="playlist-title">Playlist Generator</h1>
                <h2 className="playlist-subtitle">
                    Vault your Listening through a Custom Playlist.
                </h2>

                <div className="form-group">
                    <label>Length Type:</label>
                    <div className="length-type-options">
                        <button
                            onClick={() => handleLengthTypeChange("songs")}
                            className={lengthType === "songs" ? "selected" : ""}
                        >
                            Songs
                        </button>
                        <button
                            onClick={() => handleLengthTypeChange("time")}
                            className={lengthType === "time" ? "selected" : ""}
                        >
                            Time
                        </button>
                    </div>
                </div>

                {lengthType === "songs" ? (
                    <div className="form-group">
                        <label>Length:</label>
                        <div className="length-options">
                            <button
                                onClick={() => setNumSongs(25)}
                                className={numSongs === 25 ? "selected" : ""}
                            >
                                25 songs
                            </button>
                            <button
                                onClick={() => setNumSongs(50)}
                                className={numSongs === 50 ? "selected" : ""}
                            >
                                50 songs
                            </button>
                            <button
                                onClick={() => setNumSongs(100)}
                                className={numSongs === 100 ? "selected" : ""}
                            >
                                100 songs
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className={
                                    !(
                                        numSongs === 25 ||
                                        numSongs === 50 ||
                                        numSongs === 100
                                    )
                                        ? "selected"
                                        : ""
                                }
                            >
                                {!(
                                    numSongs === 25 ||
                                    numSongs === 50 ||
                                    numSongs === 100
                                )
                                    ? `${numSongs} ${numSongs === 1 ? "song" : "songs"}`
                                    : "Custom"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Length:</label>
                        <div className="length-options">
                            <button
                                onClick={() => setNumSongs(20)}
                                className={numSongs === 20 ? "selected" : ""}
                            >
                                1 hour
                            </button>
                            <button
                                onClick={() => setLength(60)}
                                className={numSongs === 60 ? "selected" : ""}
                            >
                                3 hours
                            </button>
                            <button
                                onClick={() => setNumSongs(100)}
                                className={numSongs === 100 ? "selected" : ""}
                            >
                                5 hours
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className={
                                    !(
                                        numSongs === 20 ||
                                        numSongs === 60 ||
                                        numSongs === 100
                                    )
                                        ? "selected"
                                        : ""
                                }
                            >
                                {!(
                                    numSongs === 20 ||
                                    numSongs === 60 ||
                                    numSongs === 100
                                )
                                    ? `${(numSongs * 3) / 60} hours`
                                    : "Custom"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label>Cover Theme:&nbsp;</label>
                    <select
                        value={coverTheme}
                        onChange={(e) => setCoverTheme(e.target.value)}
                    >
                        <option value="">Select one</option>
                        <option value="theme1">Oil painting</option>
                        <option value="theme2">Futuristic</option>
                        <option value="theme3">Sky</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={newOnly}
                            onChange={(e) => setNewOnly(e.target.checked)}
                        />
                        {" New to me only"}
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={monthly}
                            onChange={(e) => setMonthly(e.target.checked)}
                        />
                        {" Monthly generation and notifications"}
                    </label>
                </div>

                <button
                    className="playlist-button"
                    onClick={generatePlaylist}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate"}
                </button>

                {error && <p className="error">Error Generating Playlist</p>}

                <p className="playlist-text">
                    Vaultify generates personalized playlists for you based on
                    your listening habits. Click the button above to generate a
                    new playlist with your top songs!
                </p>

                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Custom Length</h3>
                            <input
                                type="number"
                                value={customLength}
                                onChange={(e) =>
                                    setCustomLength(e.target.value)
                                }
                                placeholder={`Enter number of ${lengthType === "songs" ? `songs (1-${maxSongs})` : `hours (1-${maxTimeInHours})`}`}
                                min="1"
                                max={
                                    lengthType === "songs"
                                        ? maxSongs
                                        : maxTimeInHours
                                }
                            />
                            <button onClick={handleCustomLengthSubmit}>
                                Submit
                            </button>
                            <button onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistGenerator;
