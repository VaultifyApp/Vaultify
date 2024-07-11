import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vault.css'; // Make sure to create and link this CSS file

const Vault = () => {
  const navigate = useNavigate();
  const [isWheelTurning, setIsWheelTurning] = useState(false);
  const [isDoorOpening, setIsDoorOpening] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const handleOpenVault = () => {
    setIsWheelTurning(true);
    setTimeout(() => {
      setIsWheelTurning(false);
      setIsDoorOpening(true);
      setTimeout(() => {
        setIsContentVisible(true);
      }, 2000); // Adjust timing as needed
    }, 2000); // Adjust timing as needed
  };

  return (
    <div className="vault-container">
      {!isContentVisible ? (
        <div className={`vault-door ${isWheelTurning ? 'turning' : ''} ${isDoorOpening ? 'opening' : ''}`} onClick={handleOpenVault}>
          <div className="vault-handle">
            <div className={`spokes ${isWheelTurning ? 'turning' : ''}`}>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
              <div className="spoke"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="vault-contents">
          <h1>Vault</h1>
          <p>Automatically track and preserve your monthly music journey.</p>
        </div>
      )}
    </div>
  );
};

export default Vault;
