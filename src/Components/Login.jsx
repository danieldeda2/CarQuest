import './Login.css'
import React, { useState, useEffect } from 'react'
import Logo from '../Assets/CarQuestLogo.png'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/mainPage');
    }
  }, [navigate]);

  const toForgotUserPass = () => { 
    let path = '/retrieveLogin'; 
    navigate(path);
  }

  const toHome = () => { 
    let path = '/'; 
    navigate(path);
  }

  const toCreateAccount = () => { 
    let path = '/createAccount'; 
    navigate(path);
  }

  const handleLogin = async () => {
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://165.227.180.39:8002/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userData', JSON.stringify({
          username: data.username,
          email: data.email,
          points: data.points,
          collected_cars: data.collected_cars,
          profile_picture: data.profile_picture
        }));
        navigate('/mainPage');
      } else {
        setError(data.detail || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container_login">
      <div className="bg-gradient-1_login"></div>
      <div className="bg-gradient-2_login"></div>
      <div className="particles_login">
        <div className="particle_login"></div>
        <div className="particle_login"></div>
        <div className="particle_login"></div>
        <div className="particle_login"></div>
        <div className="particle_login"></div>
      </div>

      <div className="login-card_login">
        <div className="logo_login">
          <img src={Logo} alt="CarQuest Logo" onClick={toHome}/>
        </div>
      
        <div className="input-group_login">
          <label className="input-label_login" htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            className="input-field_login" 
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="input-group_login">
          <label className="input-label_login" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            className="input-field_login" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && (
          <div className="error-message_login">
            {error}
          </div>
        )}

        <a href="#!" className="forgot-link_login" onClick={toForgotUserPass}>
          Forgot Username or Password?
        </a>

        <button 
          className="login-button_login" 
          onClick={handleLogin}
          disabled={loading}
        >
          <span>{loading ? 'Logging in...' : 'Log In'}</span>
        </button>

        <div className="create-account-link_login">
          Don't have an account? <a href="#!" onClick={toCreateAccount}>Create Account</a>
        </div>
      </div>
    </div>
  )
}

export default Login