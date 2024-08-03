import React, { useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./utils/AuthContext";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import LoginCallback from "./pages/LoginCallback";
import Layout from "./components/Layout";
import PlaylistGenerator from "./pages/PlaylistGenerator";
import PlaylistSuccess from "./pages/PlaylistSuccess";
import Vault from "./pages/Vault";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./utils/ProtectedRoute";
import "./App.css";

/**
 * initializes routes for the application
 */
const AppRoutes = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <Routes>
            <Route
                path="/"
                element={isLoggedIn ? <Navigate to="/home" /> : <Welcome />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/login-callback" element={<LoginCallback />} />
            <Route path="/" element={<Layout />}>
                <Route
                    path="home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="playlist-generator"
                    element={
                        <ProtectedRoute>
                            <PlaylistGenerator />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="playlist-success"
                    element={
                        <ProtectedRoute>
                            <PlaylistSuccess />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="vault"
                    element={
                        <ProtectedRoute>
                            <Vault />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="about"
                    element={
                        <ProtectedRoute>
                            <AboutUs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
                {/* Redirect to home if no other route matches */}
                <Route
                    path="*"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/home" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Route>
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;
