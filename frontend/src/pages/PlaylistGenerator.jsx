import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlaylistGenerator.css";

const PlaylistGeneration = () => {
    const [playlist, setPlaylist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [date, setDate] = useState("");
    const [lengthType, setLengthType] = useState("songs"); // "songs" or "time"
    const [length, setLength] = useState(25);
    const [coverTheme, setCoverTheme] = useState("");
    const [newSongsOnly, setNewSongsOnly] = useState(true);
    const [monthly, setMonthly] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customLength, setCustomLength] = useState("");

    useEffect(() => {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        setDate(`${year}-${month}`);
    }, []);

    const handleCustomLengthSubmit = () => {
        const lengthValue = parseInt(customLength, 10);
        if (lengthType === "songs" && (!isNaN(lengthValue) && lengthValue > 0 && lengthValue <= 250)) {
            setLength(lengthValue);
            setIsModalOpen(false);
            setCustomLength("");
        } else if (lengthType === "time" && (!isNaN(lengthValue) && lengthValue > 0)) {
            setLength(lengthValue * 60); // Convert hours to minutes
            setIsModalOpen(false);
            setCustomLength("");
        } else {
            alert("Please enter a valid number.");
        }
    };

    const generatePlaylist = async () => {
        setLoading(true);
        setError("");
        try {
            const token = "BQBcSaFkjvxu8-cAJ7x3b2kbDK8OOuwJ71X1QotvRD3-9xUE1fLFc_mvoLBPsxi4Zp2jmiFgbO3LBi1tDr0dU2I9dpoBol4ZYUIz79nY1eNQhpPU_eo";
            const response = await axios.get(
                "https://api.spotify.com/v1/playlists/{playlist_id}/tracks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        limit: lengthType === "songs" ? length : Math.ceil(length / 3), // Approximate 3 minutes per song
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

    const handleGenerate = () => {
        onGenerate();
        navigate('/playlist-success');
    };

    return (
        <div id="playlist-container">
            <div className="playlist-content">
                <h1 className="playlist-title">Vaultify Playlist Generator</h1>
                <h2 className="playlist-subtitle">Discover Your Next Favorite Songs</h2>
                
                <div className="form-group">
                    <label>Date:</label>
                    <input type="month" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Length Type:</label>
                    <div className="length-type-options">
                        <button onClick={() => setLengthType("songs")} className={lengthType === "songs" ? "selected" : ""}>
                            Songs
                        </button>
                        <button onClick={() => setLengthType("time")} className={lengthType === "time" ? "selected" : ""}>
                            Time
                        </button>
                    </div>
                </div>
                
                {lengthType === "songs" ? (
                    <div className="form-group">
                        <label>Length:</label>
                        <div className="length-options">
                            <button onClick={() => setLength(25)} className={length === 25 ? "selected" : ""}>25 songs</button>
                            <button onClick={() => setLength(50)} className={length === 50 ? "selected" : ""}>50 songs</button>
                            <button onClick={() => setIsModalOpen(true)} className={length > 50 ? "selected" : ""}>
                                {length > 50 ? `${length} songs` : "Custom"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Length:</label>
                        <div className="length-options">
                            <button onClick={() => setLength(60)} className={length === 60 ? "selected" : ""}>1 hour</button>
                            <button onClick={() => setLength(180)} className={length === 180 ? "selected" : ""}>3 hours</button>
                            <button onClick={() => setIsModalOpen(true)} className={length > 180 ? "selected" : ""}>
                                {length > 180 ? `${length / 60} hours` : "Custom"}
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="form-group">
                    <label>Cover Theme:</label>
                    <select value={coverTheme} onChange={(e) => setCoverTheme(e.target.value)}>
                        <option value="">Select one</option>
                        <option value="theme1">Theme 1</option>
                        <option value="theme2">Theme 2</option>
                        <option value="theme3">Theme 3</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>
                        <input type="checkbox" checked={newSongsOnly} onChange={(e) => setNewSongsOnly(e.target.checked)} />
                        New songs only
                    </label>
                </div>
                
                <div className="form-group">
                    <label>
                        <input type="checkbox" checked={monthly} onChange={(e) => setMonthly(e.target.checked)} />
                        Generate playlist monthly
                    </label>
                </div>
                
                <div className="form-group">
                    <label>
                        <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
                        Turn on email notifications
                    </label>
                </div>
                
                <button className="playlist-button" onClick={generatePlaylist} disabled={loading}>
                    {loading ? "Generating..." : "Generate"}
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
                                    {track.track.artists.map((artist) => artist.name).join(", ")}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <p className="playlist-text">
                    Vaultify generates personalized playlists for you based on your listening habits. 
                    Click the button above to generate a new playlist and enjoy a fresh musical journey!
                </p>

                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Custom Length</h3>
                            <input
                                type="number"
                                value={customLength}
                                onChange={(e) => setCustomLength(e.target.value)}
                                placeholder={`Enter number of ${lengthType === "songs" ? "songs (1-250)" : "hours"}`}
                                min="1"
                                max={lengthType === "songs" ? "250" : ""}
                            />
                            <button onClick={handleCustomLengthSubmit}>Submit</button>
                            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistGeneration;
