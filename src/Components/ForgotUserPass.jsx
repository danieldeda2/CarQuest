import './ForgotUserPass.css'
import React, { useState } from 'react'
import Logo from '../Assets/CarQuestLogo.png'
import { useNavigate } from "react-router-dom";

const ForgotUserPass = () => {
  const [email, setEmail] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  let navigate = useNavigate();
  
  const toLogin = () => { 
    let path = '/Login'; 
    navigate(path);
  }

  const toHome = () => { 
    let path = '/'; 
    navigate(path);
  }

  const handleButtonClick = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  return (
    <div className="container_forgot_userPass">
      <div className="bg-gradient-1_forgot"></div>
      <div className="bg-gradient-2_forgot"></div>
      <div className="particles_forgot">
        <div className="particle_forgot"></div>
        <div className="particle_forgot"></div>
        <div className="particle_forgot"></div>
        <div className="particle_forgot"></div>
        <div className="particle_forgot"></div>
      </div>

      {/* EPIC VIDEO GAME NOTIFICATION */}
      {showNotification && (
        <div className="game-notification-overlay_forgot">
          <div className="game-notification_forgot">
            <div className="notification-glow_forgot"></div>
            <div className="notification-icon_forgot">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div className="notification-title_forgot">FEATURE LOCKED</div>
            <div className="notification-message_forgot">
              This feature is currently in development!
              <br />
              Check back soon when we get it up and running.
            </div>
            <div className="notification-bar_forgot">
              <div className="notification-bar-fill_forgot"></div>
            </div>
          </div>
        </div>
      )}

      <div className="forgot-card_userPass">
        <div className="logo_forgot_userPass">
          <img src={Logo} alt="CarQuest Logo" onClick={toHome}/>
        </div>

        <h2 className="title_forgot_userPass">Forgot Your Login?</h2>
        <p className="subtitle_forgot_userPass">Enter your email to recover your account</p>
        
        <div className="input-group_forgot_userPass">
          <label className="input-label_forgot_userPass" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            className="input-field_forgot_userPass" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button 
          className="send-button_forgot_userPass primary"
          onClick={handleButtonClick}
        >
          <svg className="button-icon_forgot" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Send Username</span>
        </button>

        <button 
          className="send-button_forgot_userPass secondary"
          onClick={handleButtonClick}
        >
          <svg className="button-icon_forgot" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Send Password</span>
        </button>

        <div className="back-login-link_forgot_userPass">
          <a href="#" onClick={toLogin}>← Back to Login</a>
        </div>
      </div>
    </div>
  )
}

export default ForgotUserPass