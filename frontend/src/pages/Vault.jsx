import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Vault.css";
import green1 from "../assets/green1.jpg";
import green2 from "../assets/green2.jpg";
import green3 from "../assets/green3.jpg";
import axios from "axios";

/**
 * Home page component
 */
const Vault = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [timelineView, setTimelineView] = useState(false);
    const [images, setImages] = useState([]);

    const greens = [green1, green2, green3];

    const format = (str, max) => {
        if (str.length < max) {
            return str;
        }
        return str.slice(0, max - 3) + "...";
    };

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(
                    "https://api.unsplash.com/search/photos",
                    {
                        params: {
                            query: "colorful",
                            per_page: currentUser.playlists.length,
                        },
                        headers: {
                            Authorization: `Client-ID l1-Il-e6HmCC1wWoocR78p9Sssyz77o_-KKTgUcK8xk`,
                        },
                    }
                );
                setImages(response.data.results);
            } catch (error) {
                console.error("Error fetching images from Unsplash:", error);
            }
        };

        fetchImages();
    }, [currentUser.playlists.length]);

    return (
        <div className="vault-content">
            <div className="header">
                <h1>Vault - {timelineView ? "Timeline View" : "List View"}</h1>
                <div className="view-button">
                    <button
                        onClick={() =>
                            timelineView
                                ? setTimelineView(false)
                                : setTimelineView(true)
                        }
                    >
                        {timelineView ? "List View" : "Timeline View"}
                    </button>
                </div>
            </div>
            {!timelineView ? (
                <div className="list-container">
                    <h3 className="heading">Recent Playlists</h3>
                    <div className="playlists-list">
                        {currentUser.playlists.length > 0 ? (
                            [...currentUser.playlists]
                                .reverse()
                                .map((playlist, index) => (
                                    <div key={index} className="playlist">
                                        <div
                                            className="playlist-link"
                                            onClick={() =>
                                                navigate(
                                                    `/playlist-view/${currentUser.playlists.length - 1 - index}`
                                                )
                                            }
                                        >
                                            <img
                                                src={
                                                    playlist.image
                                                        ? playlist.image.url
                                                        : greens[
                                                              index %
                                                                  greens.length
                                                          ]
                                                }
                                                alt={playlist.title}
                                                width="100"
                                            />
                                            {playlist.title.length > 15
                                                ? playlist.title.substr(0, 14) +
                                                  "..."
                                                : playlist.title}
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="playlist">
                                <p>
                                    No Playlists available... Get started with
                                    our Playlist Generator!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="timeline-container">
                    {currentUser.playlists.length > 0 ? (
                        [...currentUser.playlists]
                            .reverse()
                            .map((playlist, index) => (
                                <div className="timeline-item">
                                    <div className="timeline-title">
                                        <a
                                            href={playlist.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {playlist.title}
                                        </a>
                                    </div>
                                    <div className="items">
                                        <div
                                            key={index}
                                            className="timeline-cover"
                                        >
                                            <div
                                                className="playlist-link"
                                                onClick={() =>
                                                    navigate(
                                                        `/playlist-view/${currentUser.playlists.length - 1 - index}`
                                                    )
                                                }
                                            >
                                                <img
                                                    src={
                                                        playlist.image
                                                            ? playlist.image.url
                                                            : greens[
                                                                  index %
                                                                      greens.length
                                                              ]
                                                    }
                                                    alt={playlist.title}
                                                    width="100"
                                                />
                                            </div>
                                        </div>
                                        <div className="tag">
                                            <p>
                                                Mood:{" "}
                                                {Math.round(
                                                    playlist.mood * 100
                                                ) / 10}{" "}
                                                / 10
                                            </p>
                                        </div>
                                        <div className="top-songs">
                                            {playlist.tracks
                                                .slice(0, 5)
                                                .map((track, index) => (
                                                    <div className="track">
                                                        <a
                                                            href={track.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {index + 1}
                                                            {index + 1 == 1
                                                                ? " "
                                                                : ""}
                                                            <img
                                                                src={
                                                                    track.image
                                                                        .url
                                                                }
                                                                alt="Track"
                                                                className="track-image"
                                                            />
                                                            {format(
                                                                track.title,
                                                                30
                                                            )}
                                                        </a>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="playlist">
                            <p>
                                No Playlists available... Get started with our
                                Playlist Generator!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Vault;
