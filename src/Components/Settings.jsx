import './Settings.css'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SmallLogo from '../Assets/CarQuestLogo.png'
import ProfileIcon from '../Assets/Profile.png'

const Settings = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // 🚀 PRODUCTION API
  const BACKEND_API_URL = 'http://165.227.180.39:8002';

  let navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');
    
    if (!token) {
      navigate('/Login');
      return;
    }

    if (storedUserData) {
      const data = JSON.parse(storedUserData);
      setUserData(data);
      setUsername(data.username || '');
      setEmail(data.email || '');
      if (data.profile_picture) {
        setPreviewImage(data.profile_picture);
      }
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image too large. Maximum size is 5MB', 'error');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Invalid file type. Only JPEG, PNG, GIF, and WebP allowed', 'error');
        return;
      }

      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      await uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    setUploadingImage(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_API_URL}/upload_profile_picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const updatedUserData = {
            ...JSON.parse(storedUserData),
            profile_picture: data.profile_picture
          };
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
          setUserData(updatedUserData);
        }

        showToast('Profile picture updated successfully!', 'success');
      } else {
        showToast(data.detail || 'Failed to upload profile picture', 'error');
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const data = JSON.parse(storedUserData);
          setPreviewImage(data.profile_picture || null);
        }
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      showToast('Error uploading profile picture. Please try again', 'error');
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const data = JSON.parse(storedUserData);
        setPreviewImage(data.profile_picture || null);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUsernameChange = async () => {
    if (!username || username.trim().length === 0) {
      showToast('Username cannot be empty', 'error');
      return;
    }

    if (username === userData.username) {
      showToast('This is already your username', 'error');
      setIsEditingUsername(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_API_URL}/change_username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          current_username: userData.username,
          new_username: username 
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.new_token) {
          localStorage.setItem('token', data.new_token);
        }

        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const updatedUserData = {
            ...JSON.parse(storedUserData),
            username: username
          };
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
          setUserData(updatedUserData);
        }

        showToast('Username updated successfully!', 'success');
        setIsEditingUsername(false);
      } else {
        showToast(data.detail || 'Failed to update username', 'error');
        setUsername(userData.username);
      }
    } catch (error) {
      console.error('Error changing username:', error);
      showToast('Error updating username. Please try again', 'error');
      setUsername(userData.username);
    }
  };

  const handleEmailChange = async () => {
    if (!email || email.trim().length === 0) {
      showToast('Email cannot be empty', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (email === userData.email) {
      showToast('This is already your email', 'error');
      setIsEditingEmail(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_API_URL}/change_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          username: userData.username,
          new_email: email 
        })
      });

      const data = await response.json();

      if (response.ok) {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const updatedUserData = {
            ...JSON.parse(storedUserData),
            email: email
          };
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
          setUserData(updatedUserData);
        }

        showToast('Email updated successfully!', 'success');
        setIsEditingEmail(false);
      } else {
        showToast(data.detail || 'Failed to update email', 'error');
        setEmail(userData.email);
      }
    } catch (error) {
      console.error('Error changing email:', error);
      showToast('Error updating email. Please try again', 'error');
      setEmail(userData.email);
    }
  };

  const handleSaveSettings = () => {
    console.log('Saving settings...', { username, email, profileImage });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
    }
  };

  const getProfilePicture = () => {
    if (userData?.profile_picture) {
      return userData.profile_picture;
    }
    return ProfileIcon;
  };

  return (
    <div className="container_settings">
      <div className="bg-gradient-1_settings"></div>
      <div className="bg-gradient-2_settings"></div>
      <div className="particles_settings">
        <div className="particle_settings"></div>
        <div className="particle_settings"></div>
        <div className="particle_settings"></div>
        <div className="particle_settings"></div>
        <div className="particle_settings"></div>
      </div>

      {/* Header Section */}
      <div className="header_settings">
        <div className="logo_settings">
          <img src={SmallLogo} alt="CarQuest Logo" onClick={toHome}/>
        </div>
        
        <div className="profile_settings" onClick={toggleDropdown}>
          <img src={getProfilePicture()} alt="Profile"/>
          {dropdownOpen && (
            <div className="dropdown_settings">
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}>Log Out</a>
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="title-section_settings">
        <h1 className="settings-title_settings">SETTINGS</h1>
      </div>

      {/* Settings Content */}
      <div className="settings-content_settings">
        {/* Profile Picture Section */}
        <div className="settings-section_settings">
          <h2 className="section-title_settings">Profile Picture</h2>
          <div className="profile-upload_settings">
            <div className="profile-preview_settings">
              {uploadingImage && (
                <div className="uploading-overlay_settings">
                  <div className="spinner_settings"></div>
                </div>
              )}
              <img 
                src={previewImage || ProfileIcon} 
                alt="Profile Preview"
                className="preview-image_settings"
              />
              <div className="upload-overlay_settings">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
            </div>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input_settings"
              disabled={uploadingImage}
            />
            <label 
              htmlFor="profile-upload" 
              className={`upload-button_settings ${uploadingImage ? 'disabled' : ''}`}
            >
              {uploadingImage ? 'Uploading...' : 'Choose Image'}
            </label>
            <p className="upload-hint_settings">PNG, JPG, GIF, WebP up to 5MB</p>
          </div>
        </div>

        {/* Username Section */}
        <div className="settings-section_settings">
          <h2 className="section-title_settings">Username</h2>
          <div className="input-group_settings">
            {!isEditingUsername ? (
              <div 
                className="display-field_settings"
                onClick={() => setIsEditingUsername(true)}
              >
                <span className="display-value_settings">{username}</span>
                <svg className="edit-icon_settings" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
            ) : (
              <div className="edit-container_settings">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field_settings"
                  placeholder="Enter username"
                  autoFocus
                />
                <div className="button-row_settings">
                  <button className="change-button_settings" onClick={handleUsernameChange}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Change
                  </button>
                  <button className="cancel-button_settings" onClick={() => setIsEditingUsername(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Section */}
        <div className="settings-section_settings">
          <h2 className="section-title_settings">Email</h2>
          <div className="input-group_settings">
            {!isEditingEmail ? (
              <div 
                className="display-field_settings"
                onClick={() => setIsEditingEmail(true)}
              >
                <span className="display-value_settings">{email}</span>
                <svg className="edit-icon_settings" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
            ) : (
              <div className="edit-container_settings">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field_settings"
                  placeholder="Enter email"
                  autoFocus
                />
                <div className="button-row_settings">
                  <button className="change-button_settings" onClick={handleEmailChange}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Change
                  </button>
                  <button className="cancel-button_settings" onClick={() => setIsEditingEmail(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-section_settings">
          <h2 className="section-title_settings">Notifications</h2>
          <div className="toggle-group_settings">
            <label className="toggle-item_settings">
              <span className="toggle-label_settings">Quest Reminders</span>
              <input type="checkbox" className="toggle-input_settings" defaultChecked />
              <span className="toggle-slider_settings"></span>
            </label>
            <label className="toggle-item_settings">
              <span className="toggle-label_settings">New Achievements</span>
              <input type="checkbox" className="toggle-input_settings" defaultChecked />
              <span className="toggle-slider_settings"></span>
            </label>
            <label className="toggle-item_settings">
              <span className="toggle-label_settings">Leaderboard Updates</span>
              <input type="checkbox" className="toggle-input_settings" />
              <span className="toggle-slider_settings"></span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons_settings">
          <button className="save-button_settings" onClick={handleSaveSettings}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Save Changes
          </button>
          <button className="delete-button_settings" onClick={handleDeleteAccount}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete Account
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification_settings ${toast.type}`}>
          <div className="toast-icon_settings">
            {toast.type === 'success' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
          </div>
          <span className="toast-message_settings">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;