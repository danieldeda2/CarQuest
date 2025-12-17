import './Quests.css'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SmallLogo from '../Assets/CarQuestLogo.png'
import ProfileIcon from '../Assets/Profile.png'

const Quests = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');
    
    if (!token) {
      navigate('/Login');
      return;
    }

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const toHome = () => {
    let path = '/mainPage';
    navigate(path);
  };

  // Get profile picture for navbar
  const getProfilePicture = () => {
    if (userData?.profile_picture) {
      return userData.profile_picture;
    }
    return ProfileIcon;
  };

  return (
    <div className="container_quests">
      {/* Animated Background Gradients - SAME AS MAINPAGE */}
      <div className="bg-gradient-1_quests"></div>
      <div className="bg-gradient-2_quests"></div>
      <div className="particles_quests">
        <div className="particle_quests"></div>
        <div className="particle_quests"></div>
        <div className="particle_quests"></div>
        <div className="particle_quests"></div>
        <div className="particle_quests"></div>
      </div>

      {/* 🔒 LOCKED OVERLAY WITH COMING SOON BANNER */}
      <div className="locked-overlay_quests">
        <div className="locked-banner_quests">
          <div className="banner-glow_quests"></div>
          <div className="banner-content_quests">
            <div className="lock-icon-small_quests">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="banner-text_quests">
              <h2>QUESTS COMING SOON</h2>
              <p>Daily challenges are currently under development</p>
            </div>
            <button className="banner-back-button_quests" onClick={toHome}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Main Menu
            </button>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="header_quests">
        <div className="logo_quests">
          <img src={SmallLogo} alt="CarQuest Logo" onClick={toHome}/>
        </div>
        
        <div className="profile_quests" onClick={toggleDropdown}>
          <img src={getProfilePicture()} alt="Profile"/>
          {dropdownOpen && (
            <div className="dropdown_quests">
              <a href="#!" onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}>Log Out</a>
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="title-section_quests">
        <h1 className="quests-title_quests">DAILY QUESTS</h1>
        <div className="rewards-summary_quests">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          <span className="rewards-text_quests">
            0 Bonus Points Earned
          </span>
        </div>
      </div>

      {/* Info Footer */}
      <div className="info-footer_quests">
        <div className="info-card_quests">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p className="info-text_quests">
            Complete daily quests to earn <span className="highlight_quests">2x bonus points!</span> Quests reset every 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quests;