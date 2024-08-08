import React, { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import "./PlaylistView.css"; // Ensure your styles are correctly linked
import share from "../assets/share.svg";
import Server from "../utils/Server";

const PlaylistView = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(AuthContext);

    const { index } = useParams();

    const playlist = currentUser.playlists[index] || null;

    if (!playlist || !playlist.tracks) {
        navigate("/home");
    }

    const moodScore = Math.round(playlist.mood * 100) / 10;

    const format = (str, max) => {
        if (str.length < max) {
            return str;
        }
        return str.slice(0, max - 3) + "...";
    };

    const handleCopyToClipboard = (url) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                alert("Playlist link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    return (
        <div className="playlist-content">
            <div className="playlist-header">
                <div className="playlist-cover">
                    <a
                        href={playlist.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={playlist.image.url} alt="Playlist cover" />
                    </a>
                </div>
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
                    <p>{playlist.description}</p>
                    <div className="playlist-tags">
                        <span className="tag">Mood: {moodScore} / 10</span>
                        <button
                            onClick={() => handleCopyToClipboard(playlist.url)}
                            className="share-button"
                        >
                            <img
                                src={share}
                                alt="Share"
                                className="share-icon"
                            />
                        </button>
                    </div>
                </div>
            </div>
            <table className="playlist-table">
                <thead>
                    <tr>
                        <th>
                            <div className="num-row">#&nbsp;</div>
                        </th>
                        <th>Title</th>
                        <th>Artists</th>
                        <th>
                            <div className="notes-row">Notes</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {playlist.tracks.map((track, trackIndex) => (
                        <tr key={trackIndex}>
                            <td>
                                <div className="num-row">{trackIndex + 1}.</div>
                            </td>
                            <td>
                                <a
                                    href={track.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={track.image.url}
                                        alt="Track"
                                        className="track-image"
                                    />
                                    {format(track.title, 30)}
                                </a>
                            </td>
                            <td>{format(track.artists.join(", "), 25)}</td>
                            <td>
                                <div className="notes-row">
                                    <input
                                        type="text"
                                        defaultValue={
                                            currentUser.playlists[index].tracks[
                                                trackIndex
                                            ].note
                                        }
                                        placeholder="Add a note..."
                                        className="note-input"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.target.blur();
                                                currentUser.playlists[
                                                    index
                                                ].tracks[trackIndex].note =
                                                    e.target.value;
                                                setCurrentUser(currentUser);
                                                Server.updateNote(
                                                    currentUser,
                                                    index,
                                                    trackIndex
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlaylistView;
