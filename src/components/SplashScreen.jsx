import React from 'react';
import logo from '../assets/images/Blushing_Birdie_Logo.png';
import tagline from '../assets/images/Blushing_Birdie_Tagline.png';
import '../SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-container">
        {/* Logo - First Screen (2 seconds) */}
        <div className="logo-screen">
          <img 
            src={logo} 
            alt="Blushing Birdie" 
            className="logo-image"
          />
        </div>

        {/* Tagline - Second Screen (appears after 2 seconds) */}
        <div className="tagline-screen">
          <img 
            src={tagline} 
            alt="confidence, one swing at a time" 
            className="tagline-image"
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
