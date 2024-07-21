// src/components/Login.jsx
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Login = () => {
    const [profile, setProfileState] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { setIsLoggedIn, setProfile } = useContext(AuthContext);
    const code = new URLSearchParams(location.search).get("code");

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = localStorage.getItem("profile");
            if (profile == null) {
                window.location.href = "http://localhost:3001/login";
            } else {
                window.location.href = `http://localhost:3001/login?_id=${profile._id}`;
            }
        };
        const urlParams = new URLSearchParams(location.search);
        const profile = urlParams.get("user");
        urlParams.delete("user");
        if (profile == null) {
            fetchProfile();
        } else {
            let decoded = JSON.parse(profile);
            localStorage.setItem("profile", profile);
            setProfileState(decoded);
            setProfile(decoded);
            setIsLoggedIn(true);
            navigate("/home");
        }
    }, [code, setIsLoggedIn, setProfile, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("profile");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <div>
            <h1>Login to Spotify</h1>
            {profile ? (
                <div>
                    <h2>Logged in as {profile.display_name}</h2>
                    <p>User ID: {profile.id}</p>
                    <p>Email: {profile.email}</p>
                    {profile.external_urls && (
                        <p>
                            Spotify URI:{" "}
                            <a href={profile.external_urls.spotify}>
                                {profile.external_urls.spotify}
                            </a>
                        </p>
                    )}
                    <p>
                        Link: <a href={profile.href}>{profile.href}</a>
                    </p>
                    {profile.images && profile.images.length > 0 && (
                        <p>
                            Profile Image:{" "}
                            <img
                                src={profile.images[0].url}
                                alt="Profile"
                                width="200"
                            />
                        </p>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Login;
