import './MainPage.css'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SmallLogo from '../Assets/CarQuestLogo.png'
import ProfileIcon from '../Assets/Profile.png'
import CaptureIcon from '../Assets/Capture.png'
import GarageIcon from '../Assets/Garage.png'
import QuestsIcon from '../Assets/Quests.png'
import LeaderboardIcon from '../Assets/Leaderboard.png'
import SettingsIcon from '../Assets/Settings.png'
import SupportIcon from '../Assets/Support.png'

const MainPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const token = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');
    
    if (!token) {
      navigate('/Login');
      return;
    }

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Detect if device is mobile with camera capabilities
    checkIfMobileDevice();
  }, [navigate]);

  const checkIfMobileDevice = () => {
    // Check if device has touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check if device is mobile based on user agent
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(navigator.userAgent);
    
    // Check screen width (mobile typically < 768px)
    const isMobileWidth = window.innerWidth < 768;
    
    // Device is mobile if it has:
    // 1. Touch capability AND mobile user agent
    // OR
    // 2. Mobile user agent AND mobile screen width
    const isMobile = (hasTouch && isMobileUA) || (isMobileUA && isMobileWidth);
    
    console.log('Mobile Detection:', {
      hasTouch,
      isMobileUA,
      isMobileWidth,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      isMobile
    });
    
    setIsMobileDevice(isMobile);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const toHome = () => {
    let path = '/';
    navigate(path);
  };

  const toCapture = () => {
    // Only allow navigation if on mobile device
    if (isMobileDevice) {
      let path = '/capture';
      navigate(path);
    }
  };

  const toGarage = () => {
    let path = '/myGarage';
    navigate(path);
  };

  const toLeaderboard = () => {
    let path = '/leaderboard';
    navigate(path);
  };

  const toSettings = () => {
    let path = '/settings';
    navigate(path);
  };

  const toQuests = () => {
    let path = '/quests';
    navigate(path);
  };

  const toSupport = () => {
    let path = '/support';
    navigate(path);
  };

  const getProfilePicture = () => {
    if (userData?.profile_picture) {
      return userData.profile_picture;
    }
    return ProfileIcon;
  };

  return (
    <div className="container_mainPage">
      <div className="bg-gradient-1_mainPage"></div>
      <div className="bg-gradient-2_mainPage"></div>
      <div className="particles_mainPage">
        <div className="particle_mainPage"></div>
        <div className="particle_mainPage"></div>
        <div className="particle_mainPage"></div>
        <div className="particle_mainPage"></div>
        <div className="particle_mainPage"></div>
      </div>

      {/* Header Section - NO POINTS! */}
      <div className="header_mainPage">
        <div className="logo_mainPage">
          <img src={SmallLogo} alt="CarQuest Logo" onClick={toHome}/>
        </div>
        
        <div className="profile_mainPage" onClick={toggleDropdown}>
          <img src={getProfilePicture()} alt="Profile"/>
          {dropdownOpen && (
            <div className="dropdown_mainPage">
              <a href="#!" onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}>Log Out</a>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Section - MOVED UP 30px */}
      {userData && (
        <div className="welcome-section_mainPage">
          <h2 className="welcome-text_mainPage">Welcome back, {userData.username}!</h2>
        </div>
      )}

      {/* 🔥 POINTS SECTION - NEW! Between Welcome and Grid 🔥 */}
      {userData && (
        <div className="points-section_mainPage">
          <div className="points-display_mainPage">
            {userData.points.toLocaleString()} pts
          </div>
        </div>
      )}

      {/* Grid Section */}
      <div className="grid-section_mainPage">
        {/* Capture - Locked on Desktop */}
        <div 
          className={`grid-item_mainPage ${!isMobileDevice ? 'locked_mainPage' : ''}`}
          onClick={toCapture}
        >
          {!isMobileDevice && (
            <div className="lock-overlay_mainPage">
              <div className="lock-icon_mainPage">🔒</div>
              <div className="lock-text_mainPage">Mobile Only</div>
            </div>
          )}
          <div className="grid-icon_mainPage">
            <img src={CaptureIcon} alt="Capture"/>
          </div>
          <p className="grid-label_mainPage">Capture</p>
        </div>

        <div className="grid-item_mainPage" onClick={toGarage}>
          <div className="grid-icon_mainPage">
            <img src={GarageIcon} alt="Garage"/>
          </div>
          <p className="grid-label_mainPage">Garage</p>
        </div>

        <div className="grid-item_mainPage" onClick={toQuests}>
          <div className="grid-icon_mainPage">
            <img src={QuestsIcon} alt="Quests"/>
          </div>
          <p className="grid-label_mainPage">Quests</p>
        </div>

        <div className="grid-item_mainPage" onClick={toLeaderboard}>
          <div className="grid-icon_mainPage">
            <img src={LeaderboardIcon} alt="Leaderboard"/>
          </div>
          <p className="grid-label_mainPage">Leaderboard</p>
        </div>

        <div className="grid-item_mainPage" onClick={toSettings}>
          <div className="grid-icon_mainPage">
            <img src={SettingsIcon} alt="Settings"/>
          </div>
          <p className="grid-label_mainPage">Settings</p>
        </div>

        <div className="grid-item_mainPage" onClick={toSupport}>
          <div className="grid-icon_mainPage">
            <img src={SupportIcon} alt="Support"/>
          </div>
          <p className="grid-label_mainPage">Support</p>
        </div>
      </div>
    </div>
  )
}

export default MainPage