import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Welcome.css'

const Welcome = () => {
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/login')
    }

    return (
        <div id="welcome-container" className="welcome-container">
            <div className="welcome-content">
                <img src={logo} alt="Vaultify Logo" className="welcome-logo" />
                <h1 className="welcome-title">Welcome to Vaultify.</h1>
                <p className="welcome-subtitle">Vault your music memories.</p>
                <button onClick={handleLogin} className="welcome-button">
                    Login with Spotify
                </button>
                <h2 className="welcome-section-title">What is Vaultify?</h2>
                <p className="welcome-text">
                    We here at Vaultify aim to transform your listening
                    experiences by generating highly customizable monthly
                    playlists for you containing all your favorite songs, which
                    you can export back onto your Spotify library with one
                    click. After generating your first playlist with us, you can
                    access your very own unique “Vault” page to visit all your
                    personal notes, playlists, and AI-generated playlist covers.
                    We aspire to snapshot your listening journey and portray the
                    personal story that your music history tells.
                </p>
            </div>
        </div>
    )
}

export default Welcome
