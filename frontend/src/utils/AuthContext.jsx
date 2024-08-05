// src/components/AuthContext.jsx
import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

/**
 * AuthContext provided global variables for login status and
 * profile to all components on the site
 */

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState(null);

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, setIsLoggedIn, profile, setProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
