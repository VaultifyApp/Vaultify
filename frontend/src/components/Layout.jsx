// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import ProfileIcon from "./ProfileIcon";
import { Outlet } from "react-router-dom";

/**
 * layout used by pages
 */
const Layout = () => {
    return (
        <div>
            <Navbar />
            <ProfileIcon />
            <div className="main-content">
                <div id="root">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
