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

  const calculateTotalRewards = () => {
    return quests
      .filter(quest => quest.completed)
      .reduce((total, quest) => total + quest.reward, 0);
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
            {calculateTotalRewards().toLocaleString()} Bonus Points Earned
          </span>
        </div>
      </div>

      {/* Quests Content */}
      <div className="quests-content_quests">
        {quests.map((quest, index) => (
          <div 
            key={quest.id} 
            className={`quest-card_quests ${quest.completed ? 'completed' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="quest-checkbox_quests">
              {quest.completed && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>

            <div className="quest-content_quests">
              <div className="quest-header_quests">
                <h3 className="quest-title_quests">{quest.title}</h3>
                <div className="quest-reward_quests">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>+{quest.reward} pts</span>
                </div>
              </div>

              <p className="quest-description_quests">{quest.description}</p>

              <div className="quest-progress_quests">
                <div className="progress-bar_quests">
                  <div 
                    className="progress-fill_quests"
                    style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text_quests">
                  {quest.progress}/{quest.total}
                </span>
              </div>
            </div>
          </div>
        ))}
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