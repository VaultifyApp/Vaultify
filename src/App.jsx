import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/AuthContext';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Layout from './components/Layout';
import PlaylistMaker from './components/PlaylistMaker';
import Vault from './components/Vault';
import AboutUs from './components/AboutUs';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const AppRoutes = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Welcome />} />
      <Route path="/login" element={<Login />} />
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
              <PlaylistMaker />
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
            isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
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
