import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import "./ProfileIcon.css";
import defaultImage from "../assets/default.jpg";

/**
 * loads and displays the user's profile picture
 */
const ProfileIcon = () => {
    const { profile } = useContext(AuthContext);
    const navigate = useNavigate();

    const profileImage =
        profile && profile.images && profile.images.length > 0
            ? profile.images[0].url
            : defaultImage;

    return (
        <div className="profile-icon" onClick={() => navigate("/profile")}>
            <img src={profileImage} alt="Profile" />
        </div>
    );
};

export default ProfileIcon;
