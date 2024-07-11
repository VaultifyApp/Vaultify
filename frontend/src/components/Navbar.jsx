import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import settingsIcon from "../assets/settings.png";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar-title">Vaultify</div>
            <div className="navbar-logo">
                <NavLink to="/home">
                    <img src={logo} alt="Logo" />
                </NavLink>
            </div>
            <ul>
                <li>
                    <NavLink
                        to="/home"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/playlist-generator"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Playlist Generator
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/vault"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Vault
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/about"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        About Us
                    </NavLink>
                </li>
            </ul>
            <div className="navbar-settings">
                <NavLink to="/settings">
                    <img src={settingsIcon} alt="Settings" />
                </NavLink>
            </div>
        </div>
    );
};

export default Navbar;
