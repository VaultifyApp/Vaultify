import React from 'react';
import { useNavigate } from 'react-router-dom';

const Vault = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Vault</h1>
      <p>Automatically track and preserve your monthly music journey.</p>
    </div>
  );
};

export default Vault;
