// src/components/AuthContext.jsx
import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

/**
 * AuthContext provides global variables for login status and
 * user to all components on the site
 * also provides server util functions
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
