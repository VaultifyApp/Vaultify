import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

/**
 * handles OAuth callback from Spotify. Uses code to fetch profile from server
 */
const LoginCallback = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setProfile } = useContext(AuthContext);
    useEffect(() => {
        const loginFromCode = async () => {
            const code = new URLSearchParams(window.location.search).get(
                "code"
            );
            const params = new URLSearchParams({ code: code });
            try {
                const response = await axios.get(
                    `http://localhost:3001/get-user-from-code?${params.toString()}`
                );
                const profile = response.data;
                localStorage.setItem("_id", profile._id);
                setIsLoggedIn(true);
                setProfile(profile);
                navigate("/home");
            } catch (err) {
                navigate("/");
            }
        };
        loginFromCode();
    }, [setIsLoggedIn, setProfile, navigate]);
    return (
        <div>
            <h1>Logging in...</h1>
        </div>
    );
};

export default LoginCallback;
