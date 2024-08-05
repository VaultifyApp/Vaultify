import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";
import "./Profile.css";
import green1 from "../assets/green1.jpg";
import green2 from "../assets/green2.jpg";
import green3 from "../assets/green3.jpg";
import defaultImage from "../assets/default.jpg";

/**
 * displays profile information to the user
 */
const Profile = () => {
    const { profile } = useContext(AuthContext);
    const storedBio =
        localStorage.getItem("bio") ||
        profile.bio ||
        "Hello world! I’m new to Vaultify.";
    const [bio, setBio] = useState(storedBio);
    const [editing, setEditing] = useState(false);
    const [newBio, setNewBio] = useState(storedBio);

    const truncate = (str, n) =>
        str.length > n ? str.substr(0, n - 1) + "..." : str;
    const greens = [green1, green2, green3];
    const favoritePlaylists = profile.playlists
        .slice(-3)
        .map((playlist, index) => ({
            title: truncate(playlist.title, 15),
            image: playlist.image || greens[index],
            url: playlist.url,
        }));

    const favoriteNotes = [
        "stooppp this song brings back so many memories!! it’s like i’m being transported back to late-night drives with friends ugh i love it",
        "my girlssss slayyyyyyyed",
    ];

    const achievements = [
        { name: "Leaping in!", description: "Make your first playlist." },
        {
            name: "Mixer Maxer",
            description: "Make a playlist with more than one genre.",
        },
        {
            name: "Meow-meow-meow",
            description: "Have 'What Was I Made For?' included in a playlist.",
        },
        {
            name: "Groovy Guru",
            description: "Create a playlist with 10 or more songs.",
        },
        {
            name: "Genre Jumper",
            description:
                "Create a playlist with songs from at least 3 different genres.",
        },
        {
            name: "Ultimate Collector",
            description: "Save 50 or more playlists.",
        },
        {
            name: "Social Butterfly",
            description: "Share a playlist with a friend.",
        },
        {
            name: "Trendsetter",
            description: "Have 5 or more followers on your playlists.",
        },
        {
            name: "Mood Maker",
            description: "Create a playlist for each day of the week.",
        },
        {
            name: "DJ in the Making",
            description: "Remix a song using the app’s tools.",
        },
        {
            name: "Playlist Pro",
            description: "Create a playlist with over 100 songs.",
        },
        {
            name: "Themed Maestro",
            description: "Create a playlist with a specific theme.",
        },
    ];

    const handleEditBio = () => {
        setEditing(true);
    };

    const handleSaveBio = async () => {
        const updatedBio = newBio.trim() || "Hello world!";
        setBio(updatedBio);
        localStorage.setItem("bio", updatedBio);
        setEditing(false);

        try {
            const response = await axios.put(
                "http://localhost:3001/api/profile/update-bio",
                {
                    userId: profile._id,
                    bio: updatedBio,
                }
            );

            if (response.status === 200) {
                localStorage.setItem(
                    "profile",
                    JSON.stringify({ ...profile, bio: updatedBio })
                );
            } else {
                console.error("Failed to update bio:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating bio:", error);
        }
    };

    useEffect(() => {
        console.log("Profile data:", profile);
    }, [profile]);

    return (
        <div className="profile-container">
            <div className="profile-content">
                <h1 className="profile-title">Profile</h1>
                <div className="profile-header">
                    <div className="profile-details-left">
                        {profile ? (
                            <div className="profile-info">
                                <div className="profile-pic">
                                    <img
                                        src={
                                            profile && profile.image
                                                ? profile.image.url
                                                : defaultImage
                                        }
                                        alt="Profile"
                                        width="150"
                                    />
                                </div>
                                <div className="profile-details">
                                    <div className="name-username">
                                        <h2 className="profile-name">
                                            {profile.username || "Unknown User"}
                                        </h2>
                                        <p className="profile-username">
                                            @{profile.username || "unknown"}
                                        </p>
                                    </div>
                                    <p className="profile-counters">
                                        {favoritePlaylists.length} Playlists |{" "}
                                        {favoriteNotes.length} Notes |{" "}
                                        {achievements.length} Achievements
                                    </p>
                                    <div className="bio-section">
                                        {editing ? (
                                            <div className="edit-bio-section">
                                                <textarea
                                                    className="bio-textarea"
                                                    value={newBio}
                                                    onChange={(e) =>
                                                        setNewBio(
                                                            e.target.value
                                                        )
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
                                            <p>{bio}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    {!editing && (
                        <div className="edit-bio-button">
                            <button onClick={handleEditBio}>Edit Bio</button>
                        </div>
                    )}
                </div>
                <div className="content-row">
                    <div className="favorite-playlists">
                        <h3>Favorite Playlists</h3>
                        <div className="playlists">
                            {favoritePlaylists.map((playlist, index) => (
                                <div key={index} className="playlist">
                                    <img
                                        src={playlist.image}
                                        alt={playlist.title}
                                        width="100"
                                    />
                                    <a
                                        className="playlist-link"
                                        href={playlist.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {playlist.title}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="favorite-notes">
                        <h3>Favorite Notes</h3>
                        <div className="notes">
                            {favoriteNotes.map((note, index) => (
                                <div key={index} className="note">
                                    <p>{note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="achievements">
                    <h3>Achievements</h3>
                    <div className="achievements-list">
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
