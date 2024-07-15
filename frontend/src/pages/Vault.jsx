import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vault.css';

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
    }, 700); // Adjust timing to match handle animation duration
  };

  return (
    <div className="vault-container">
      {!isContentVisible ? (
        <div className="vault-door-outer">
          <div className="vault-hinges">
            <div className="hinge"></div>
            <div className="hinge"></div>
          </div>
          <div className="vault-viewhole"></div>
          <div className={`vault-door-inner ${isWheelTurning ? 'turning' : ''} ${isDoorOpening ? 'opening' : ''}`} onClick={handleOpenVault}>
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
        <div className="vault-contents">
          <h1>Vault</h1>
          <p>Automatically track and preserve your monthly music journey.</p>
        </div>
      )}
    </div>
  );
};

export default Vault;
