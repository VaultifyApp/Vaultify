import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vault.css';

const Vault = () => {
  const navigate = useNavigate();
  const [isWheelTurning, setIsWheelTurning] = useState(false);
  const [isDoorOpening, setIsDoorOpening] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const playlists = [
    { 
      timestamp: '3rd May 2020 7:00 PM', 
      title: 'Morning Chill', 
      description: 'Relaxing morning tunes', 
      link: 'https://open.spotify.com/playlist/3zteNmnoKFGtzwRTpNhC8u', 
      image: 'https://i.scdn.co/image/ab67616d0000b2731e0dfe6f10f5e3e5761f0d11' 
    },
    { 
      timestamp: '19th May 2020 3:00 PM', 
      title: 'Workout Mix', 
      description: 'Energetic workout music', 
      link: 'https://open.spotify.com/playlist/2', 
      image: 'https://i.scdn.co/image/ab67616d0000b2732c5e6f10f5e3e5761f0d22' 
    },
    { 
      timestamp: '17th June 2020 7:00 PM', 
      title: 'Evening Jazz', 
      description: 'Smooth jazz for the evening', 
      link: 'https://open.spotify.com/playlist/3', 
      image: 'https://i.scdn.co/image/ab67616d0000b2733c7e6f10f5e3e5761f0d33' 
    },
    // Add more playlists as needed
  ];

  const handleOpenVault = () => {
    setIsWheelTurning(true);
    setTimeout(() => {
      setIsWheelTurning(false);
      setIsDoorOpening(true);
      setTimeout(() => {
        setIsZoomedIn(true);
        setTimeout(() => {
          setIsContentVisible(true);
        }, 3000); // Timing for zoom-in effect
      }, 500); // Timing for door opening
    }, 700); // Timing to match handle animation duration
  };

  return (
    <div className={`vault-container ${isZoomedIn ? 'zoom-in' : ''} ${isContentVisible ? 'zoom-out' : ''}`}>
      {!isContentVisible ? (
        <div className="vault-door-outer" onClick={handleOpenVault}>
          <div className="vault-hinges">
            <div className="hinge"></div>
            <div className="hinge"></div>
          </div>
          <div className="vault-viewhole"></div>
          <div className={`vault-door-inner ${isWheelTurning ? 'turning' : ''} ${isDoorOpening ? 'opening' : ''}`}>
            <div className="vault-inner-hinges">
              <div className="hinge"></div>
              <div className="hinge"></div>
            </div>
            <div className="vault-door-lock-wrapper">
              <div className="vault-door-lock vault-door-circle"></div>
              <div className="vault-door-lock vault-door-pistons">
                <div className="piston piston1"></div>
                <div className="piston piston2"></div>
                <div className="piston piston3"></div>
                <div className="piston piston4"></div>
              </div>
            </div>
            <div className="vault-door-handle">
              <div className="handle-bar bar1"></div>
              <div className="handle-bar bar2"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="timeline-container">
          <div className="container">
            <div className="box">
              <div className="container-3">
                <span className="icon"><i className="fa fa-search"></i></span>
                <input type="search" id="search" placeholder="Search..." />
              </div>
            </div>

            <div className="leftbox">
              <nav>
                <a id="dashboard"><i className="fas fa-tachometer-alt"></i></a>
                <a id="profile"> <i className="fas fa-user"></i> </a>
                <a id="settings"> <i className="fas fa-cog"></i> </a>
                <a id="messages"> <i className="fas fa-comments"></i> </a>
                <a id="notification"> <i className="fas fa-bell"></i> </a>
              </nav>
            </div>
            <div className="rightbox">
              <div className="rb-container">
                <ul className="rb">
                  {playlists.map((playlist, index) => (
                    <li className="rb-item" key={index}>
                      <div className="timestamp">
                        {playlist.timestamp}
                      </div>
                      <div className="item-title">
                        <a href={playlist.link} target="_blank" rel="noopener noreferrer">
                          <img src={playlist.image} alt={playlist.title} className="playlist-cover" />
                          {playlist.title}
                        </a>
                        <p>{playlist.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
