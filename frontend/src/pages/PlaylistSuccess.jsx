import React from 'react';
import { Link } from 'react-router-dom';
import './PlaylistSuccess.css';

const PlaylistSuccess = () => {
    return (
        <div className="success-container">
            <div className="success-content">
                <h1>Playlist successfully created.</h1>
                <div className="success-icon">✔</div>
                <Link to="/playlist-view" className="success-link">
                    Open playlist here
                </Link>
            </div>
        </div>
    );
};

export default PlaylistSuccess;
