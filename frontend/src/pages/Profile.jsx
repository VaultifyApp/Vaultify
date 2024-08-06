import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";
import "./Profile.css";
import green1 from "../assets/green1.jpg";
import green2 from "../assets/green2.jpg";
import green3 from "../assets/green3.jpg";
import Server from "../utils/Server";
import defaultImage from "../assets/default.jpg";

/**
 * Profile page component
 */
const Profile = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [newBio, setNewBio] = useState(
        currentUser.bio || "Hello world! I’m new to Vaultify."
    );
    // configs recent playlists
    const truncate = (str, n) =>
        str.length > n ? str.substr(0, n - 1) + "..." : str;
    const greens = [green1, green2, green3];
    const recentPlaylists = currentUser.playlists
        .slice(-5)
        .map((playlist, index) => ({
            title: truncate(playlist.title, 15),
            image: playlist.image
                ? playlist.image.url
                : greens[index % greens.length],
            url: playlist.url,
        }));

    // determine achievements
    const achievements = [];
    if (currentUser.playlists.length > 0) {
        achievements.push({
            name: "Leaping in!",
            description: "Generate your first playlist.",
        });
    }
    if (currentUser.numMonths > 0) {
        achievements.push({
            name: "Novice Vaulter",
            description: "One month of automatic playlist generation.",
        });
    }
    if (currentUser.numMonths > 2) {
        achievements.push({
            name: "Intermediate Vaulter",
            description: "Three months of automatic playlist generation.",
        });
    }
    if (currentUser.numMonths > 5) {
        achievements.push({
            name: "Expert Vaulter",
            description: "Six months of automatic playlist generation.",
        });
    }
    if (currentUser.numMonths > 11) {
        achievements.push({
            name: "Grand Wizard",
            description: "One year of automatic playlist generation. :0",
        });
    }

    const handleSaveBio = async () => {
        const updatedBio = newBio.trim() || "Hello world!";
        currentUser.bio = updatedBio;
        setCurrentUser(currentUser);
        setEditing(false);
        try {
            Server.updateUser(currentUser);
        } catch (error) {
            console.error("Error updating bio", error);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <h1 className="profile-title">Profile</h1>
                <div className="profile-header">
                    <div className="profile-details-left">
                        <div className="profile-info">
                            <div className="profile-pic">
                                <img
                                    src={
                                        currentUser.image
                                            ? currentUser.image.url
                                            : defaultImage
                                    }
                                    alt="Profile"
                                    width="150"
                                />
                            </div>
                            <div className="profile-details">
                                <div className="name-username">
                                    <h2 className="profile-name">
                                        {currentUser.username}
                                    </h2>
                                </div>
                                <p className="profile-counters">
                                    {currentUser.playlists.length}{" "}
                                    {currentUser.playlists.length == 1
                                        ? "Playlist"
                                        : "Playlists"}
                                    {" | "}
                                    {achievements.length}{" "}
                                    {achievements.length == 1
                                        ? "Achievement"
                                        : "Achievement"}
                                </p>
                                <div className="bio-section">
                                    {editing ? (
                                        <div className="edit-bio-section">
                                            <textarea
                                                className="bio-textarea"
                                                value={newBio}
                                                onChange={(e) =>
                                                    setNewBio(e.target.value)
                                                }
                                            />
                                            <button
                                                className="save-bio-button"
                                                onClick={handleSaveBio}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <p>{currentUser.bio}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {!editing && (
                        <div className="edit-bio-button">
                            <button onClick={setEditing}>Edit Bio</button>
                        </div>
                    )}
                </div>
                <div className="playlists-container">
                    <h3>Recent Playlists</h3>
                    <div className="playlists">
                        {recentPlaylists.length > 0 ? (
                            recentPlaylists.map((playlist, index) => (
                                <div key={index} className="playlist">
                                    <a
                                        className="playlist-link"
                                        href={playlist.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={playlist.image}
                                            alt={playlist.title}
                                            width="100"
                                        />
                                        {playlist.title}
                                    </a>
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
                <div className="achievements-container">
                    <h3>Achievements</h3>
                    <div className="achievements">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="achievement">
                                <div className="achievement-title">
                                    {achievement.name}
                                </div>
                                <div className="achievement-description">
                                    {achievement.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
