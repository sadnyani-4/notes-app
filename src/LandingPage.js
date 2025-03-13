// src/LandingPage.js
import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="welcome-message">
        <h1>notes app</h1>
        <h2>Where your <span className='welcome-span'>thoughts</span> take flight and creativity blossoms! 🌸</h2>
        <p>Notes is the best place to jot down quick thoughts or to save longer notes filled with checklists, image, web links.</p>
      </div>
      <div className="buttons-container">
        <a href="/login" className="button login">Log In</a>
        <a href="/signup" className="button signup"><i class="fa-solid fa-user-plus"></i> Sign Up</a>
      </div>
    </div>
  );
};

export default LandingPage;