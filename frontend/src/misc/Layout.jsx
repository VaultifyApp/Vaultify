// src/components/Layout.jsx
import React from "react";
import Navbar from "../components/Navbar";
import ProfileIcon from "../components/ProfileIcon";
import { Outlet } from "react-router-dom";

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
