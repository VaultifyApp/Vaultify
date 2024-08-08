import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import Server from "../utils/Server";
import "./Login.css";

/**
 * handles OAuth callback from Spotify. Uses code to fetch profile from server
 */
const LoginCallback = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setCurrentUser } = useContext(AuthContext);
    useEffect(() => {
        const loginFromCode = async () => {
            const code = new URLSearchParams(window.location.search).get(
                "code"
            );
            try {
                const user = await Server.getUserByCode(code);
                localStorage.setItem("_id", user._id);
                setIsLoggedIn(true);
                setCurrentUser(user);
                navigate("/home");
            } catch (err) {
                console.log(err);
                navigate("/");
            }
        };
        loginFromCode();
    }, [setIsLoggedIn, setCurrentUser, navigate]);
    return (
        <div className="login-content">
            <h1>Logging in...</h1>
        </div>
    );
};

export default LoginCallback;
