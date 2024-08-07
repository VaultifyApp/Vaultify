// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

/**
 * layout used by pages
 */
const Layout = () => {
    return (
        <div>
            <Navbar />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
