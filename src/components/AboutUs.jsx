import React from 'react';
import './AboutUs.css';
import profile1 from '../assets/michelle.png';
import profile2 from '../assets/thomas.png';
import profile3 from '../assets/michael.png';
import profile4 from '../assets/dillon.png';
import profile5 from '../assets/matt.png';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Us</h1>
        <h2>The Band</h2>
        <h3>“Practice. Perform. Perfect.”</h3>
        <p>
          We are The Band, a group of passionate juniors from RPI dedicated to revolutionizing how music enthusiasts interact with their musical libraries. Michelle Li, dual majoring in Computer Science and Information Technology & Web Science, brings her rich musical background and technical expertise to the project, driven by her love for piano, violin, and singing. Thomas Orifici, a Computer Science major with a minor in music, plays guitar and bass, and shares a personal connection to Vaultify’s mission. Michael Lam, despite his initial lack of experience, has honed his skills at RPI and is eager to grow as a software engineer through this project. Dillon Li aims to enhance his programming and collaboration skills, incorporating his expertise from daily Spotify usage to develop unique features. Matthew Bui, an avid music listener and dancer, integrates his passion for music and desire to deepen his coding abilities into Vaultify. Together, we strive to create a product that resonates with all music lovers by blending our diverse skills, background, and our shared passion for music and technology.
        </p>
        <div className="profile-pictures">
          <img src={profile1} alt="Profile 1" />
          <img src={profile2} alt="Profile 2" />
          <img src={profile3} alt="Profile 3" />
          <img src={profile4} alt="Profile 4" />
          <img src={profile5} alt="Profile 5" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
