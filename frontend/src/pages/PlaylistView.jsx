import React, { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import "./PlaylistView.css"; // Ensure your styles are correctly linked

const PlaylistView = () => {
    const { currentUser } = useContext(AuthContext);
    const playlist = currentUser.playlists[currentUser.playlists.length - 1];

    if (!playlist || !playlist.tracks) {
        return <div className="no-playlist">No playlist found</div>;
    }

    // Calculate mood score
    const moodScore = Math.round(playlist.mood * 10);

    return (
        <div className="playlist-container">
            <header className="playlist-header">
                <img
                    src={playlist.image.url}
                    alt="Playlist cover"
                    className="playlist-cover"
                    style={{ width: "250px", height: "250px" }} // Adjusted size
                />
                <div className="playlist-info">
                    {/* Wrap the title with a link to the Spotify playlist */}
                    <h1>
                        <a
                            href={playlist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {playlist.title}
                        </a>
                    </h1>
                    <p className="playlist-description">
                        {playlist.description}
                    </p>
                    <div className="playlist-tags">
                        <span className="tag">Mood: {moodScore}</span>
                    </div>
                </div>
            </header>
            <table className="playlist-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Artists</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {playlist.tracks.map((track, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <img
                                    src={track.image.url}
                                    alt="Track"
                                    className="track-image"
                                />
                                <a
                                    href={track.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {track.title}
                                </a>
                            </td>
                            <td>{track.artists.join(", ")}</td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Add a note..."
                                    className="note-input"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlaylistView;
