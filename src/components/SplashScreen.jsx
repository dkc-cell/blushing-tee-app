import React from 'react';
import logo from '../assets/images/Blushing_Birdie_Logo.png';
import tagline from '../assets/images/Blushing_Birdie_Tagline.png';
import '../SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-container">
        {/* Logo and tagline shown together */}
        <div className="logo-screen">
          <img 
            src={logo} 
            alt="Blushing Birdie" 
            className="logo-image"
          />
        </div>

        {/* Tagline */}
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
