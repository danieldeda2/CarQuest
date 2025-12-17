import './CreateAccount.css'
import React, { useState } from 'react'
import Logo from '../Assets/CarQuestLogo.png'
import { useNavigate } from 'react-router-dom'

const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPackAnimation, setShowPackAnimation] = useState(false);

  let navigate = useNavigate();

  const toLogin = () => { 
    let path = '/Login'; 
    navigate(path);
  }

  const toHome = () => { 
    let path = '/'; 
    navigate(path);
  }

  const handleCreateAccount = async () => {
    setError('');
    
    // Validate all fields filled
    if (!username || !password || !verifyPassword || !email) {
      setError('Please fill in all fields');
      return;
    }

    // Password match validation
    if (password !== verifyPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://165.227.180.39:8002/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          country: "Not Specified"
        })
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS! Show FIFA pack opening animation
        setLoading(false);
        setShowPackAnimation(true);
        
        // Redirect to login after animation (4 seconds)
        setTimeout(() => {
          navigate('/Login');
        }, 4000);
      } else {
        setLoading(false);
        if (data.detail === 'Username already exists') {
          setError('This username is already taken. Please choose another.');
        } else if (data.detail === 'Email already exists') {
          setError('This email is already registered. Please use another email or log in.');
        } else {
          setError(data.detail || 'Signup failed. Please try again.');
        }
      }
    } catch (err) {
      setLoading(false);
      setError('Unable to connect to server. Please try again later.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="container_createAccount">
      <div className="bg-gradient-1_createAccount"></div>
      <div className="bg-gradient-2_createAccount"></div>
      <div className="particles_createAccount">
        <div className="particle_createAccount"></div>
        <div className="particle_createAccount"></div>
        <div className="particle_createAccount"></div>
        <div className="particle_createAccount"></div>
        <div className="particle_createAccount"></div>
      </div>

      {/* FIFA Pack Opening Animation */}
      {showPackAnimation && (
        <div className="pack-animation-overlay_createAccount">
          {/* Particle Explosion */}
          <div className="particle-explosion_createAccount">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="explosion-particle_createAccount"></div>
            ))}
          </div>

          {/* Sweeping Light Beams */}
          <div className="light-sweep_createAccount light-sweep-1_createAccount"></div>
          <div className="light-sweep_createAccount light-sweep-2_createAccount"></div>
          <div className="light-sweep_createAccount light-sweep-3_createAccount"></div>

          {/* Glowing Rings */}
          <div className="glow-ring_createAccount glow-ring-1_createAccount"></div>
          <div className="glow-ring_createAccount glow-ring-2_createAccount"></div>
          <div className="glow-ring_createAccount glow-ring-3_createAccount"></div>

          {/* Main Card */}
          <div className="pack-card_createAccount">
            {/* Holographic Effect */}
            <div className="holographic-overlay_createAccount"></div>
            
            {/* Shine Effect */}
            <div className="card-shine_createAccount"></div>

            {/* Logo */}
            <div className="pack-logo_createAccount">
              <img src={Logo} alt="CarQuest Logo" />
            </div>

            {/* Welcome Text */}
            <div className="pack-title_createAccount">WELCOME</div>
            <div className="pack-username_createAccount">{username}!</div>

            {/* Message */}
            <div className="pack-message_createAccount">
              Account Successfully Created
            </div>

            {/* Subtitle */}
            <div className="pack-subtitle_createAccount">
              Please login to start your adventure
            </div>

            {/* Decorative Elements */}
            <div className="pack-decoration_createAccount pack-decoration-top_createAccount"></div>
            <div className="pack-decoration_createAccount pack-decoration-bottom_createAccount"></div>

            {/* Sparkles */}
            <div className="sparkle_createAccount sparkle-1_createAccount">✨</div>
            <div className="sparkle_createAccount sparkle-2_createAccount">✨</div>
            <div className="sparkle_createAccount sparkle-3_createAccount">✨</div>
            <div className="sparkle_createAccount sparkle-4_createAccount">✨</div>
          </div>

          {/* Redirecting Indicator */}
          <div className="redirecting-text_createAccount">
            Redirecting to login...
          </div>
        </div>
      )}

      {/* Create Account Form */}
      <div className={`create-card_createAccount ${showPackAnimation ? 'hide-card_createAccount' : ''}`}>
        <div className="logo_createAccount">
          <img src={Logo} alt="CarQuest Logo" onClick={toHome}/>
        </div>
      
        <div className="input-group_createAccount">
          <label className="input-label_createAccount" htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            className="input-field_createAccount" 
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group_createAccount">
          <label className="input-label_createAccount" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            className="input-field_createAccount" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group_createAccount">
          <label className="input-label_createAccount" htmlFor="verifyPassword">Verify Password</label>
          <input 
            type="password" 
            id="verifyPassword" 
            className="input-field_createAccount" 
            placeholder="Re-enter your password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
        </div>

        <div className="input-group_createAccount">
          <label className="input-label_createAccount" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            className="input-field_createAccount" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && (
          <div className="error-message_createAccount">
            {error}
          </div>
        )}

        <button 
          className="create-button_createAccount"
          onClick={handleCreateAccount}
          disabled={loading}
        >
          <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
        </button>

        <div className="login-link_createAccount">
          Already have an account? <a href="#" onClick={toLogin}>Log In</a>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount