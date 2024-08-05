import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

const LoginCallback = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setProfile } = useContext(AuthContext);
    useEffect(() => {
        const loginFromCode = async () => {
            const code = new URLSearchParams(window.location.search).get(
                "code"
            );

            console.log(code);
            const params = new URLSearchParams({ code: code });
            const response = await axios.get(
                `http://localhost:3001/get-user-from-code?${params.toString()}`
            );
            const profile = response.data;
            localStorage.setItem("profile", JSON.stringify(profile));
            setIsLoggedIn(true);
            setProfile(profile);
            navigate("/home");
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
