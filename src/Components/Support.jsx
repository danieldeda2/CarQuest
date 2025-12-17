import './Support.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SmallLogo from '../Assets/CarQuestLogo.png'
import ProfileIcon from '../Assets/Profile.png'
import emailjs from '@emailjs/browser'

const Support = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [showManualReviews, setShowManualReviews] = useState(false);
  const [manualReviews, setManualReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const formRef = useRef();

  let navigate = useNavigate();
  let location = useLocation();

  const BACKEND_API_URL = 'http://165.227.180.39:8002';

  // Car data for mapping car_id to make/model
  const carData = {
    "Acura": [{"id": 0, "model_name": "Integra"}, {"id": 1, "model_name": "NSX"}, {"id": 2, "model_name": "RSX"}],
    "Alfa-Romeo": [{"id": 3, "model_name": "8C"}, {"id": 4, "model_name": "Guilia"}, {"id": 5, "model_name": "4C"}],
    "Alpina": [{"id": 6, "model_name": "B7"}, {"id": 7, "model_name": "B8"}, {"id": 8, "model_name": "XB7"}],
    "Aston-Martin": [{"id": 9, "model_name": "DB9"}, {"id": 10, "model_name": "DBS"}, {"id": 11, "model_name": "DBX"}, {"id": 12, "model_name": "DB11"}, {"id": 13, "model_name": "Vantage"}, {"id": 14, "model_name": "Vanquish"}, {"id": 15, "model_name": "Valkyrie"}],
    "Audi": [{"id": 16, "model_name": "RS3"}, {"id": 17, "model_name": "RS4"}, {"id": 18, "model_name": "RS5"}, {"id": 19, "model_name": "RS6"}, {"id": 20, "model_name": "RS7"}, {"id": 21, "model_name": "R8"}, {"id": 22, "model_name": "TT-RS"}, {"id": 23, "model_name": "Q5"}, {"id": 24, "model_name": "Q7"}, {"id": 25, "model_name": "Q8"}],
    "BMW": [{"id": 26, "model_name": "F87 M2"}, {"id": 27, "model_name": "G87 M2"}, {"id": 28, "model_name": "E30 M3"}, {"id": 29, "model_name": "E36 M3"}, {"id": 30, "model_name": "E46 M3"}, {"id": 31, "model_name": "NFS E46 M3 GTR"}, {"id": 32, "model_name": "E9X M3"}, {"id": 33, "model_name": "F80 M3"}, {"id": 34, "model_name": "G80 M3"}, {"id": 35, "model_name": "F82 M4"}, {"id": 36, "model_name": "G82 M4"}, {"id": 37, "model_name": "E28 M5"}, {"id": 38, "model_name": "E34 M5"}, {"id": 39, "model_name": "E39 M5"}, {"id": 40, "model_name": "E60 M5"}, {"id": 41, "model_name": "F10 M5"}, {"id": 42, "model_name": "F90 M5"}, {"id": 43, "model_name": "G90 M5"}, {"id": 44, "model_name": "E63 M6"}, {"id": 45, "model_name": "F12 M6"}, {"id": 46, "model_name": "F92 M8"}, {"id": 47, "model_name": "F97 X3 M"}, {"id": 48, "model_name": "F98 X4 M"}, {"id": 49, "model_name": "E70 X5 M"}, {"id": 50, "model_name": "F85 X5 M"}, {"id": 51, "model_name": "F95 X5 M"}, {"id": 52, "model_name": "E71 X6 M"}, {"id": 53, "model_name": "F86 X6 M"}, {"id": 54, "model_name": "F96 X5 M"}],
    "Bugatti": [{"id": 55, "model_name": "EB 110"}, {"id": 56, "model_name": "Veyron"}, {"id": 57, "model_name": "Chiron"}, {"id": 58, "model_name": "Divo"}, {"id": 59, "model_name": "Centodieci"}, {"id": 60, "model_name": "Mistral"}, {"id": 61, "model_name": "Tourbillon"}],
    "Cadillac": [{"id": 62, "model_name": "ATS-V"}, {"id": 63, "model_name": "CTS-V"}, {"id": 64, "model_name": "Escalade ESV"}],
    "Chevrolet": [{"id": 65, "model_name": "Corvette (C2)"}, {"id": 66, "model_name": "Corvette (C3)"}, {"id": 67, "model_name": "Corvette (C4)"}, {"id": 68, "model_name": "Corvette (C5)"}, {"id": 69, "model_name": "Corvette (C6)"}, {"id": 70, "model_name": "Corvette (C7)"}, {"id": 71, "model_name": "Corvette (C8)"}, {"id": 72, "model_name": "Camaro"}, {"id": 73, "model_name": "Camaro ZL1"}],
    "Dodge": [{"id": 74, "model_name": "Challenger Scat Pack"}, {"id": 75, "model_name": "Challenger SRT Hellcat"}, {"id": 76, "model_name": "Challenger SRT Demon"}, {"id": 77, "model_name": "Charger Scat Pack"}, {"id": 78, "model_name": "Charger SRT Hellcat"}, {"id": 79, "model_name": "Viper (1st gen)"}, {"id": 80, "model_name": "Viper (2nd gen)"}],
    "Ferrari": [{"id": 81, "model_name": "F40"}, {"id": 82, "model_name": "F50"}, {"id": 83, "model_name": "LaFerrari"}, {"id": 84, "model_name": "F430"}, {"id": 85, "model_name": "458"}, {"id": 86, "model_name": "488"}, {"id": 87, "model_name": "F12"}, {"id": 88, "model_name": "California"}, {"id": 89, "model_name": "Roma"}, {"id": 90, "model_name": "812"}, {"id": 91, "model_name": "SF90"}, {"id": 92, "model_name": "Portofino"}, {"id": 93, "model_name": "GTC4Lusso"}, {"id": 94, "model_name": "F8"}, {"id": 95, "model_name": "296"}, {"id": 96, "model_name": "Purosangue"}],
    "Ford": [{"id": 97, "model_name": "Mustang"}, {"id": 98, "model_name": "GT (1st gen)"}, {"id": 99, "model_name": "GT (2nd gen)"}],
    "Honda": [{"id": 100, "model_name": "Civic Type-R"}, {"id": 101, "model_name": "Integra"}, {"id": 102, "model_name": "NSX"}, {"id": 103, "model_name": "S2000"}],
    "Hyundai": [{"id": 104, "model_name": "Elantra N"}, {"id": 105, "model_name": "Veloster N"}],
    "Infiniti": [{"id": 106, "model_name": "G35 Coupe"}, {"id": 107, "model_name": "G37 Coupe"}, {"id": 108, "model_name": "Q50"}, {"id": 109, "model_name": "Q60"}],
    "Jaguar": [{"id": 110, "model_name": "F-Type"}, {"id": 111, "model_name": "F-Pace"}],
    "Jeep": [{"id": 112, "model_name": "Grand Cherokee Trackhawk"}, {"id": 113, "model_name": "Wrangler"}],
    "Koenigsegg": [{"id": 114, "model_name": "CCXR"}, {"id": 115, "model_name": "CC850"}, {"id": 116, "model_name": "Agera"}, {"id": 117, "model_name": "One:1"}, {"id": 118, "model_name": "Regera"}, {"id": 119, "model_name": "Jesko"}, {"id": 120, "model_name": "Gemera"}],
    "Lamborghini": [{"id": 121, "model_name": "Miura"}, {"id": 122, "model_name": "Countach"}, {"id": 123, "model_name": "Diablo"}, {"id": 124, "model_name": "Gallardo"}, {"id": 125, "model_name": "Huracan"}, {"id": 126, "model_name": "Murcielago"}, {"id": 127, "model_name": "Aventador"}, {"id": 128, "model_name": "Urus"}, {"id": 129, "model_name": "Sesto Elemento"}, {"id": 130, "model_name": "Reventón"}, {"id": 131, "model_name": "Veneno"}, {"id": 132, "model_name": "Centenario"}, {"id": 133, "model_name": "Sian"}, {"id": 134, "model_name": "Revuelto"}],
    "Land-Rover": [{"id": 135, "model_name": "Defender"}, {"id": 136, "model_name": "Range Rover"}],
    "Lexus": [{"id": 137, "model_name": "ISF"}, {"id": 138, "model_name": "GSF"}, {"id": 139, "model_name": "RCF"}, {"id": 140, "model_name": "LFA"}],
    "Lotus": [{"id": 141, "model_name": "Elise"}, {"id": 142, "model_name": "Exige"}, {"id": 143, "model_name": "Evora"}, {"id": 144, "model_name": "Emira"}],
    "Maserati": [{"id": 145, "model_name": "GranTurismo"}, {"id": 146, "model_name": "MC20"}, {"id": 147, "model_name": "Quattroporte"}],
    "Mazda": [{"id": 148, "model_name": "Miata (NA)"}, {"id": 149, "model_name": "Miata (NB)"}, {"id": 150, "model_name": "Miata (NC)"}, {"id": 151, "model_name": "Miata (ND)"}, {"id": 152, "model_name": "RX-7 (FC)"}, {"id": 153, "model_name": "RX-7 (FD)"}, {"id": 154, "model_name": "RX-8"}],
    "McLaren": [{"id": 155, "model_name": "F1"}, {"id": 156, "model_name": "P1"}, {"id": 157, "model_name": "570S"}, {"id": 158, "model_name": "600LT"}, {"id": 159, "model_name": "650S"}, {"id": 160, "model_name": "675LT"}, {"id": 161, "model_name": "720S"}, {"id": 162, "model_name": "765LT"}, {"id": 163, "model_name": "GT"}, {"id": 164, "model_name": "Artura"}, {"id": 165, "model_name": "Senna"}, {"id": 166, "model_name": "Speedtail"}, {"id": 167, "model_name": "Elva"}],
    "Mercedes-Benz": [{"id": 168, "model_name": "190E Evolution"}, {"id": 169, "model_name": "C63 AMG (W204)"}, {"id": 170, "model_name": "C63 AMG (W205)"}, {"id": 171, "model_name": "E63 AMG (W212)"}, {"id": 172, "model_name": "E63 AMG (W213)"}, {"id": 173, "model_name": "CLS63 AMG"}, {"id": 174, "model_name": "S63 AMG"}, {"id": 175, "model_name": "SL63 AMG"}, {"id": 176, "model_name": "SLS AMG"}, {"id": 177, "model_name": "AMG GT"}, {"id": 178, "model_name": "AMG GT-R"}, {"id": 179, "model_name": "AMG One"}, {"id": 180, "model_name": "G63 AMG"}, {"id": 181, "model_name": "GLE63 AMG"}, {"id": 182, "model_name": "GLS63 AMG"}],
    "Mini": [{"id": 183, "model_name": "Cooper S"}, {"id": 184, "model_name": "JCW"}],
    "Mitsubishi": [{"id": 185, "model_name": "Lancer Evolution VIII"}, {"id": 186, "model_name": "Lancer Evolution IX"}, {"id": 187, "model_name": "Lancer Evolution X"}, {"id": 188, "model_name": "3000GT"}],
    "Nissan": [{"id": 189, "model_name": "Skyline GT-R (R32)"}, {"id": 190, "model_name": "Skyline GT-R (R33)"}, {"id": 191, "model_name": "Skyline GT-R (R34)"}, {"id": 192, "model_name": "GT-R (R35)"}, {"id": 193, "model_name": "370Z"}, {"id": 194, "model_name": "Z (RZ34)"}, {"id": 195, "model_name": "Silvia (S13)"}, {"id": 196, "model_name": "Silvia (S14)"}, {"id": 197, "model_name": "Silvia (S15)"}],
    "Pagani": [{"id": 198, "model_name": "Zonda"}, {"id": 199, "model_name": "Huayra"}, {"id": 200, "model_name": "Utopia"}],
    "Polestar": [{"id": 201, "model_name": "1"}, {"id": 202, "model_name": "2"}],
    "Porsche": [{"id": 203, "model_name": "911 (964)"}, {"id": 204, "model_name": "911 (993)"}, {"id": 205, "model_name": "911 (996)"}, {"id": 206, "model_name": "911 (997)"}, {"id": 207, "model_name": "911 (991)"}, {"id": 208, "model_name": "911 (992)"}, {"id": 209, "model_name": "911 GT3"}, {"id": 210, "model_name": "911 GT3 RS"}, {"id": 211, "model_name": "911 Turbo S"}, {"id": 212, "model_name": "Cayman GT4"}, {"id": 213, "model_name": "718 Spyder"}, {"id": 214, "model_name": "Taycan Turbo S"}, {"id": 215, "model_name": "Carrera GT"}],
    "Rolls-Royce": [{"id": 216, "model_name": "Phantom"}, {"id": 217, "model_name": "Spectre"}],
    "Saleen": [{"id": 218, "model_name": "S7"}],
    "Scion": [{"id": 219, "model_name": "FR-S"}, {"id": 220, "model_name": "xB"}],
    "Subaru": [{"id": 221, "model_name": "Impreza"}, {"id": 222, "model_name": "WRX"}],
    "Tesla": [{"id": 223, "model_name": "Model S"}, {"id": 224, "model_name": "Model 3"}, {"id": 225, "model_name": "Model X"}, {"id": 226, "model_name": "Model Y"}, {"id": 227, "model_name": "Cybertruck"}],
    "Toyota": [{"id": 228, "model_name": "Corolla GR"}, {"id": 229, "model_name": "Supra (Mk II)"}, {"id": 230, "model_name": "Supra (Mk III)"}, {"id": 231, "model_name": "Supra (Mk IV)"}, {"id": 232, "model_name": "Paul Walker's Supra"}, {"id": 233, "model_name": "Supra (Mk V)"}],
    "Volkswagen": [{"id": 234, "model_name": "Beetle"}, {"id": 235, "model_name": "Golf"}, {"id": 236, "model_name": "Phaeton"}]
  };

  // Flat array of all cars for easy lookup
  const allCars = Object.values(carData).flat();

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

    // Check if we should show manual reviews (navigated from Capture)
    if (location.state?.showManualReviews) {
      setShowManualReviews(true);
      fetchManualReviews();
    }
  }, [navigate, location]);

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

  const getProfilePicture = () => {
    if (userData?.profile_picture) {
      return userData.profile_picture;
    }
    return ProfileIcon;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setSendStatus('error');
      setIsSending(false);
      setTimeout(() => setSendStatus(null), 3000);
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    const templateParams = {
      from_name: userData?.username || 'Unknown User',
      from_email: userData?.email || 'no-email@example.com',
      user_points: userData?.points || 0,
      user_country: userData?.country || 'Unknown',
      message: message,
      timestamp: new Date().toLocaleString(),
    };

    const SERVICE_ID = 'service_s4f5fej';
    const TEMPLATE_ID = 'template_xuc2den';
    const PUBLIC_KEY = 'oeVJDIa1RWNGsjA2P';

    emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setSendStatus('success');
      setMessage('');
      setIsSending(false);
      
      setTimeout(() => {
        setSendStatus(null);
      }, 5000);
    })
    .catch((error) => {
      console.error('FAILED...', error);
      setSendStatus('error');
      setIsSending(false);
      
      setTimeout(() => {
        setSendStatus(null);
      }, 5000);
    });
  };

  const fetchManualReviews = async () => {
    setLoadingReviews(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_API_URL}/get_manual_reviews`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Manual reviews response:', data);
      
      if (response.ok) {
        // Handle the data properly - it might be an object with manual_reviews property
        let reviewsArray = [];
        
        if (data.manual_reviews) {
          // If it's an object with manual_reviews property
          if (Array.isArray(data.manual_reviews)) {
            reviewsArray = data.manual_reviews;
          } else if (typeof data.manual_reviews === 'object') {
            // If it's an object, convert to array of [carId, status] pairs
            reviewsArray = Object.entries(data.manual_reviews).map(([carId, status]) => [parseInt(carId), status]);
          }
        } else if (Array.isArray(data)) {
          // If data itself is an array
          reviewsArray = data;
        }
        
        console.log('Processed reviews array:', reviewsArray);
        setManualReviews(reviewsArray);
      } else {
        console.error('Failed to fetch manual reviews:', data);
        setManualReviews([]);
      }
    } catch (error) {
      console.error('Error fetching manual reviews:', error);
      setManualReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const showManualReviewsSection = () => {
    setShowManualReviews(true);
    fetchManualReviews();
  };

  const backToSupport = () => {
    setShowManualReviews(false);
  };

  const getCarInfo = (carId) => {
    const car = allCars.find(c => c.id === carId);
    if (car) {
      // Find the make
      for (const [make, models] of Object.entries(carData)) {
        if (models.some(m => m.id === carId)) {
          return { make, model: car.model_name };
        }
      }
    }
    return { make: 'Unknown', model: 'Unknown' };
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved':
        return {
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          icon: '✓',
          borderColor: '#10b981'
        };
      case 'Denied':
        return {
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          icon: '✗',
          borderColor: '#ef4444'
        };
      default: // In Progress
        return {
          color: '#9ca3af',
          bgColor: 'rgba(156, 163, 175, 0.1)',
          icon: '⏳',
          borderColor: '#9ca3af'
        };
    }
  };

  return (
    <div className="container_support">
      <div className="bg-gradient-1_support"></div>
      <div className="bg-gradient-2_support"></div>
      <div className="particles_support">
        <div className="particle_support"></div>
        <div className="particle_support"></div>
        <div className="particle_support"></div>
        <div className="particle_support"></div>
        <div className="particle_support"></div>
      </div>

      {/* Header Section */}
      <div className="header_support">
        <div className="logo_support">
          <img src={SmallLogo} alt="CarQuest Logo" onClick={toHome}/>
        </div>
        
        <div className="profile_support" onClick={toggleDropdown}>
          <img src={getProfilePicture()} alt="Profile"/>
          {dropdownOpen && (
            <div className="dropdown_support">
	      <a href="#!" onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}>Log Out</a>
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="title-section_support">
        <h1 className="support-title_support">
          {showManualReviews ? 'MANUAL REVIEWS' : 'CONTACT US'}
        </h1>
        <p className="support-subtitle_support">
          {showManualReviews 
            ? 'Track the status of your car review submissions' 
            : "We've got your info — just drop us a message!"}
        </p>
      </div>

      {/* Support Form OR Manual Reviews */}
      <div className="support-content_support">
        {!showManualReviews ? (
          <>
            <form ref={formRef} onSubmit={handleSubmit} className="support-form_support">
              <div className="form-section_support">
                <label className="form-label_support">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="message-textarea_support"
                  rows="8"
                  disabled={isSending}
                />
              </div>

              {sendStatus === 'success' && (
                <div className="status-message_support success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {sendStatus === 'error' && (
                <div className="status-message_support error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Oops! Please enter a message before sending.
                </div>
              )}

              <button 
                type="submit" 
                className="submit-button_support"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <svg className="spinner_support" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </form>

            <button 
              className="manual-reviews-button_support"
              onClick={showManualReviewsSection}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              View Manual Reviews
            </button>
          </>
        ) : (
          <div className="manual-reviews-container_support">
            {loadingReviews ? (
              <div className="loading-reviews_support">
                <svg className="spinner_support" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                <p>Loading your reviews...</p>
              </div>
            ) : manualReviews.length === 0 ? (
              <div className="no-reviews_support">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>No Manual Reviews Yet</h3>
                <p>You haven't submitted any cars for manual review.</p>
              </div>
            ) : (
              <>
                <div className="reviews-count_support">
                  <span className="count-badge_support">{manualReviews.length}</span>
                  <span className="count-text_support">
                    {manualReviews.length === 1 ? 'Review Submission' : 'Review Submissions'}
                  </span>
                </div>
                <div className="reviews-list-wrapper_support">
                  <div className="reviews-list_support">
                    {manualReviews.map((review, index) => {
                      // Safely extract carId and status regardless of format
                      let carId, status;
                      
                      if (Array.isArray(review)) {
                        // Format: [carId, status]
                        carId = review[0];
                        status = review[1];
                      } else if (typeof review === 'object' && review !== null) {
                        // Format: {car_id: X, status: Y} or {carId: X, status: Y}
                        carId = review.car_id || review.carId;
                        status = review.status;
                      } else {
                        console.warn('Unknown review format:', review);
                        return null;
                      }
                      
                      const carInfo = getCarInfo(carId);
                      const statusStyle = getStatusStyle(status);
                      
                      return (
                        <div key={index} className="review-card_support" style={{borderLeft: `4px solid ${statusStyle.borderColor}`}}>
                          <div className="review-car-info_support">
                            <div className="review-car-icon_support">🚗</div>
                            <div className="review-car-details_support">
                              <h3 className="review-car-make_support">{carInfo.make}</h3>
                              <p className="review-car-model_support">{carInfo.model}</p>
                            </div>
                          </div>
                          <div className="review-status_support" style={{
                            backgroundColor: statusStyle.bgColor,
                            color: statusStyle.color,
                            border: `2px solid ${statusStyle.borderColor}`
                          }}>
                            <span className="status-icon_support">{statusStyle.icon}</span>
                            <span className="status-text_support">{status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <button 
              className="back-to-support-button_support"
              onClick={backToSupport}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;