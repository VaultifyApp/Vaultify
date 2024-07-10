import React from 'react';
import { useNavigate } from 'react-router-dom';

const Achievements = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Achievements</h1>
      <p>Automatically track and preserve your monthly music journey.</p>
    </div>
  );
};

export default Achievements;
