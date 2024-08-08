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
            <div className="main-content">
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
