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
    // establishes hooks
    const { currentUser, setCurrentUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [lengthType, setLengthType] = useState("songs");
    const [numSongs, setNumSongs] = useState(currentUser.settings.numSongs);
    const [coverTheme, setCoverTheme] = useState(
        currentUser.settings.coverTheme
    );
    const [newOnly, setNewOnly] = useState(currentUser.settings.newOnly);
    const [monthly, setMonthly] = useState(currentUser.settings.notifs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customLength, setCustomLength] = useState(false);
    const [saved, setSaved] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate

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

    // saves generation settings to db
    const saveSettings = async () => {
        setSaved(true);
        currentUser.settings.numSongs = numSongs;
        currentUser.settings.newOnly = newOnly;
        currentUser.settings.notifs = monthly;
        currentUser.settings.coverTheme = coverTheme;
        setCurrentUser(currentUser);
        Server.updateSettings(currentUser);
    };

    // calls the server to generate a playlist for the user
    const generatePlaylist = async () => {
        setLoading(true);
        setError(false);
        try {
            const updated = await Server.generatePlaylist(
                currentUser,
                monthly,
                numSongs,
                newOnly,
                coverTheme
            );
            currentUser.playlists = updated.playlists;
            setCurrentUser(updated);
            /**
             * ::: TODO:::
             * fix setCurrentUser
             */

            navigate(`/playlist-view/${currentUser.playlists.length - 1}`);
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

    //html content
    return (
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
                            onClick={() => setNumSongs(60)}
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
            <label htmlFor="coverTheme">Cover Theme:&nbsp;</label>
            <input
                id="coverTheme"
                className="form-control"
                list="cover-theme-options"
                placeholder="Type or choose a theme…"
                value={coverTheme}
                onChange={(e) => setCoverTheme(e.target.value)}
                autoComplete="off"
            />
            <datalist id="cover-theme-options">
                <option value="" label="No Theme" />
                <option value="oil painting" label="Oil painting" />
                <option value="futuristic" label="Futuristic" />
                <option value="sky" label="Sky" />
            </datalist>
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
            <button className="playlist-button" onClick={saveSettings}>
                Save Settings
            </button>
            {saved && (
                <button
                    className="playlist-button"
                    onClick={generatePlaylist}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Playlist"}
                </button>
            )}

            {error && <p className="error">Error Generating Playlist</p>}
            <h3 className="playlist-text">
                Vaultify generates personalized playlists for you based on your
                listening habits. Click the button above to generate a new
                playlist with your top songs!
            </h3>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Custom Length</h3>
                        <input
                            type="number"
                            value={customLength}
                            onChange={(e) => setCustomLength(e.target.value)}
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
    );
};

export default PlaylistGenerator;
