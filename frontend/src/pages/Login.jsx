// src/components/Login.jsx
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import Server from "../utils/Server";
import querystring from "querystring";
import axios from "axios";

/**
 * logs the user in to spotify either through OAuth or the server
 */
const Login = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setCurrentUser } = useContext(AuthContext);
    useEffect(() => {
        const redirectOAuth = async () => {
            // spotify OAuth will redirect to the login-callback route. see LoginCallback.jsx
            const params = new URLSearchParams({
                client_id: "79e0bbb20e714c1cb35b10742723ee7a",
                response_type: "code",
                redirect_uri: "http://localhost:3000/login-callback",
                scope: "user-read-private user-read-email playlist-modify-public playlist-modify-private user-top-read",
            });
            window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
        };
        const login = async () => {
            const _id = localStorage.getItem("_id");
            // if no current user, redirect to spotify Oauth
            if (!_id) {
                // spotify OAuth will redirect to the login-callback route. see LoginCallback.jsx
                redirectOAuth();
            }
            // else, call backend to update current user
            else {
                try {
                    const user = await Server.getUserByID(_id);
                    setIsLoggedIn(true);
                    setCurrentUser(user);
                    navigate("/home");
                } catch (err) {
                    localStorage.removeItem(_id);
                    redirectOAuth();
                }
            }
        };
        login();
    }, [setIsLoggedIn, setCurrentUser, navigate]);

    return (
        <div>
            <h1>Logging in...</h1>
        </div>
    );
};

export default Login;
