import './Home.css'
import React, { useState, useEffect } from 'react'
import Logo from '../Assets/CarQuestLogo.png'
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }, []);

    const toLoginOrMain = () => { 
        if (isLoggedIn) {
          let path = '/mainPage';
          navigate(path);
        } else {
          let path = '/Login'; 
          navigate(path);
        }
    }

    const toLeaderboard = () => { 
        let path = '/leaderboard'; 
        navigate(path);
    }

    const toAbout = () => { 
        let path = '/about'; 
        navigate(path);
    }

  return (
    <div className="container_home">
      {/* Logo Section - 40% */}
      <div className="logo-section_home">
        <div className="logo-wrapper_home">
          <img src={Logo} alt="CarQuest Logo" className="logo-image_home"/>
          <div className="logo-glow_home"></div>
        </div>
        <h1 className="title_home">CARQUEST</h1>
        <p className="subtitle_home">The Ultimate Car Spotting Adventure</p>
      </div>

      {/* Button Section - 50% */}
      <div className="button-section_home">
        <button className="action-button_home primary" onClick={toLoginOrMain}>
          <div className="button-bg_home"></div>
          <div className="button-content_home">
            {isLoggedIn ? (
              <>
                <svg className="button-icon_home" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Home</span>
              </>
            ) : (
              <>
                <svg className="button-icon_home" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>Log In</span>
              </>
            )}
          </div>
        </button>

        <button className="action-button_home secondary" onClick={toAbout}>
          <div className="button-bg_home"></div>
          <div className="button-content_home">
            <svg className="button-icon_home" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>About</span>
          </div>
        </button>

        <button className="action-button_home secondary" onClick={toLeaderboard}>
          <div className="button-bg_home"></div>
          <div className="button-content_home">
            <svg className="button-icon_home" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 16v-3h5v7H3v-7h5v3"></path>
              <path d="M8 9h8v7H8z"></path>
              <path d="M12 2v7"></path>
            </svg>
            <span>Leaderboard</span>
          </div>
        </button>
      </div>

      {/* Footer Section - 10% */}
      <div className="footer-section_home">
        <div className="slogan_home">
          <span className="slogan-highlight_home">Discover</span>
          <span className="slogan-separator_home">•</span>
          <span className="slogan-highlight_home">Capture</span>
          <span className="slogan-separator_home">•</span>
          <span className="slogan-highlight_home">Collect</span>
        </div>
        <p className="slogan-subtitle_home">Cars in the Real World</p>
      </div>

      {/* Animated Background Elements */}
      <div className="bg-gradient-1_home"></div>
      <div className="bg-gradient-2_home"></div>
      <div className="particles_home">
        <div className="particle_home"></div>
        <div className="particle_home"></div>
        <div className="particle_home"></div>
        <div className="particle_home"></div>
        <div className="particle_home"></div>
      </div>
    </div>
  )
}

export default Home