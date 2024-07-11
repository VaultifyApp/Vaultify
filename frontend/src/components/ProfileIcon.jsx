// src/components/ProfileIcon.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../misc/AuthContext";
import "./ProfileIcon.css";

const ProfileIcon = () => {
    const { profile } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!profile || !profile.images || profile.images.length == 0) return null;

    return (
        <div className="profile-icon" onClick={() => navigate("/profile")}>
            <img src={profile.images[0].url} alt="Profile" />
        </div>
    );
};

export default ProfileIcon;
