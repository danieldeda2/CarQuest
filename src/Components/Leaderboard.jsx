import './Leaderboard.css'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SmallLogo from '../Assets/CarQuestLogo.png'
import ProfileIcon from '../Assets/Profile.png'

const Leaderboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🚀 PRODUCTION API
  const BACKEND_API_URL = 'https://api.carquest.io';

  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(storedUserData));
    } else {
      setIsLoggedIn(false);
    }

    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/leaderboard?limit=100`);
      const data = await response.json();
      
      if (response.ok) {
        setLeaderboardData(data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/Login');
  };

  const toHome = () => {
    if (isLoggedIn) {
      navigate('/mainPage');
    } else {
      navigate('/');
    }
  };

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return 'rank-other';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '👑';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  // Get profile picture for navbar
  const getProfilePicture = () => {
    if (isLoggedIn && currentUser?.profile_picture) {
      return currentUser.profile_picture;
    }
    return ProfileIcon;
  };

  return (
    <div className="container_leaderboard">
      {/* Animated Background Gradients */}
      <div className="bg-gradient-1_leaderboard"></div>
      <div className="bg-gradient-2_leaderboard"></div>
      <div className="particles_leaderboard">
        <div className="particle_leaderboard"></div>
        <div className="particle_leaderboard"></div>
        <div className="particle_leaderboard"></div>
        <div className="particle_leaderboard"></div>
        <div className="particle_leaderboard"></div>
      </div>

      {/* Header Section */}
      <div className="header_leaderboard">
        <div className="logo_leaderboard">
          <img src={SmallLogo} alt="CarQuest Logo" onClick={toHome}/>
        </div>
        
        <div className="profile_leaderboard" onClick={toggleDropdown}>
          <img src={getProfilePicture()} alt="Profile"/>
          {dropdownOpen && (
            <div className="dropdown_leaderboard">
              {isLoggedIn ? (
                <a href="#!" onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}>Log Out</a>
              ) : (
                <a href="#!" onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}>Log In</a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="title_leaderboard">
        <h1>LEADERBOARD</h1>
        <div className="subtitle_leaderboard">Global Rankings</div>
      </div>

      {/* Leaderboard Content */}
      <div className="leaderboard-content_leaderboard">
        {loading ? (
          <div className="loading_leaderboard">
            <div className="loader-spinner_leaderboard"></div>
            <p>Loading rankings...</p>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="empty-state_leaderboard">
            <div className="empty-icon_leaderboard">🏆</div>
            <h3>No Rankings Yet</h3>
            <p>Be the first to capture cars and climb the leaderboard!</p>
          </div>
        ) : (
          <div className="leaderboard-list_leaderboard">
            {leaderboardData.map((player, index) => {
              const isCurrentUser = currentUser?.username === player.username;
              return (
                <div 
                  key={index} 
                  className={`leaderboard-item_leaderboard ${getRankClass(index)} ${isCurrentUser ? 'current-user' : ''}`}
                >
                  <div className="rank_leaderboard">
                    <span className="rank-number_leaderboard">{getRankIcon(index)}</span>
                  </div>
                  
                  <div className="player-info_leaderboard">
                    <span className="username_leaderboard">
                      {player.username}
                    </span>
                    {isCurrentUser && <span className="you-badge_leaderboard">YOU</span>}
                  </div>
                  
                  <div className="points_leaderboard">
                    <span className="points-value_leaderboard">
                      {player.points.toLocaleString()}
                    </span>
                    <span className="points-label_leaderboard">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;