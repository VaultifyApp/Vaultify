import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./PlaylistGenerator.css";

/**
 * the playlist generator page provides users with the parameters to customize their monthly playlist
 */
const PlaylistGenerator = () => {
    const [playlist, setPlaylist] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lengthType, setLengthType] = useState("songs"); // "songs" or "time"
    const [length, setLength] = useState(25);
    const [coverTheme, setCoverTheme] = useState("");
    const [newSongsOnly, setNewSongsOnly] = useState(true);
    const [monthly, setMonthly] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customLength, setCustomLength] = useState("");

    const navigate = useNavigate(); // Initialize useNavigate

    const maxSongs = 250;
    const maxTimeInHours = (maxSongs * 3) / 60; // Assuming 3 minutes per song

    // verifies validity of custom length inputs
    const handleCustomLengthSubmit = () => {
        const lengthValue = parseInt(customLength, 10);
        if (
            lengthType === "songs" &&
            !isNaN(lengthValue) &&
            lengthValue > 0 &&
            lengthValue <= maxSongs
        ) {
            setLength(lengthValue);
            setIsModalOpen(false);
            setCustomLength("");
        } else if (
            lengthType === "time" &&
            !isNaN(lengthValue) &&
            lengthValue > 0 &&
            lengthValue <= maxTimeInHours
        ) {
            setLength(lengthValue * 60); // Convert hours to minutes
            setIsModalOpen(false);
            setCustomLength("");
        } else {
            alert(
                `Please enter a valid number of ${lengthType === "songs" ? `songs (1-${maxSongs})` : `hours (1-${maxTimeInHours})`}.`
            );
        }
    };

    // calls the server to generate a playlist for the user
    const generatePlaylist = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(
                "http://localhost:3001/generate-playlist",
                {
                    params: {
                        _id: JSON.parse(localStorage.getItem("profile"))._id,
                        monthly: monthly,
                    },
                }
            );
            setPlaylist(
                response.data.playlists[response.data.playlists.length - 1]
            );
            localStorage.setItem("profile", JSON.stringify(response.data));
            navigate("/playlist-success");
        } catch (error) {
            setError("Error generating playlist");
            console.error(
                "Error fetching playlist data from Spotify API",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // handles switching between time and num songs
    const handleLengthTypeChange = (type) => {
        setLengthType(type);
        if (type === "time") {
            setLength(60); // Automatically set to 1 hour
        } else {
            setLength(25); // Default to 25 songs
        }
    };

    return (
        <div id="playlist-container">
            <div className="playlist-content">
                <h1 className="playlist-title">Playlist Generator</h1>
                <h2 className="playlist-subtitle">
                    Discover your next favorite songs.
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
                                onClick={() => setLength(25)}
                                className={length === 25 ? "selected" : ""}
                            >
                                25 songs
                            </button>
                            <button
                                onClick={() => setLength(50)}
                                className={length === 50 ? "selected" : ""}
                            >
                                50 songs
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className={
                                    typeof length === "number" && length > 50
                                        ? "selected"
                                        : ""
                                }
                            >
                                {typeof length === "number" && length > 50
                                    ? `Custom`
                                    : "Custom"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Length:</label>
                        <div className="length-options">
                            <button
                                onClick={() => setLength(60)}
                                className={length === 60 ? "selected" : ""}
                            >
                                1 hour
                            </button>
                            <button
                                onClick={() => setLength(180)}
                                className={length === 180 ? "selected" : ""}
                            >
                                3 hours
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className={
                                    typeof length === "number" && length > 180
                                        ? "selected"
                                        : ""
                                }
                            >
                                {typeof length === "number" && length > 180
                                    ? `Custom`
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
                            checked={newSongsOnly}
                            onChange={(e) => setNewSongsOnly(e.target.checked)}
                        />
                        New to me only
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={monthly}
                            onChange={(e) => setMonthly(e.target.checked)}
                        />
                        Monthly generation and notifications
                    </label>
                </div>

                <button
                    className="playlist-button"
                    onClick={generatePlaylist}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate"}
                </button>

                {error && <p className="error">{error}</p>}

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
                                placeholder={`Enter number of ${lengthType === "songs" ? "songs (1-250)" : `hours (1-${maxTimeInHours})`}`}
                                min="1"
                                max={lengthType === "songs" ? "250" : ""}
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
