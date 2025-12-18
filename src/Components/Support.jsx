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

  const BACKEND_API_URL = 'https://api.carquest.io';

  // All car data with points
  const carData = {
    "Acura": [
      {"id": 0, "model_name": "Integra", "points": 420},
      {"id": 1, "model_name": "NSX", "points": 18500},
      {"id": 2, "model_name": "RSX", "points": 310}
    ],
    "Alfa-Romeo": [
      {"id": 3, "model_name": "8C", "points": 27500},
      {"id": 4, "model_name": "Guilia", "points": 520},
      {"id": 5, "model_name": "4C", "points": 4800}
    ],
    "Alpina": [
      {"id": 6, "model_name": "B7", "points": 2600},
      {"id": 7, "model_name": "B8", "points": 3900},
      {"id": 8, "model_name": "XB7", "points": 1800}
    ],
    "Aston-Martin": [
      {"id": 9, "model_name": "DB9", "points": 7200},
      {"id": 10, "model_name": "DBS", "points": 14800},
      {"id": 11, "model_name": "DBX", "points": 950},
      {"id": 12, "model_name": "DB11", "points": 9600},
      {"id": 13, "model_name": "Vantage", "points": 8200},
      {"id": 14, "model_name": "Vanquish", "points": 16500},
      {"id": 15, "model_name": "Valkyrie", "points": 230000}
    ],
    "Audi": [
      {"id": 16, "model_name": "RS3", "points": 1400},
      {"id": 17, "model_name": "RS4", "points": 1800},
      {"id": 18, "model_name": "RS5", "points": 2400},
      {"id": 19, "model_name": "RS6", "points": 5000},
      {"id": 20, "model_name": "RS7", "points": 5200},
      {"id": 21, "model_name": "R8", "points": 14500},
      {"id": 22, "model_name": "TT-RS", "points": 2300},
      {"id": 23, "model_name": "Q5", "points": 120},
      {"id": 24, "model_name": "Q7", "points": 115},
      {"id": 25, "model_name": "Q8", "points": 210}
    ],
    "BMW": [
      {"id": 26, "model_name": "F87 M2", "points": 2400},
      {"id": 27, "model_name": "G87 M2", "points": 3100},
      {"id": 28, "model_name": "E30 M3", "points": 210},
      {"id": 29, "model_name": "E36 M3", "points": 420},
      {"id": 30, "model_name": "E46 M3", "points": 950},
      {"id": 31, "model_name": "NFS E46 M3 GTR", "points": 48000},
      {"id": 32, "model_name": "E9X M3", "points": 1100},
      {"id": 33, "model_name": "F80 M3", "points": 1800},
      {"id": 34, "model_name": "G80 M3", "points": 2600},
      {"id": 35, "model_name": "F82 M4", "points": 2200},
      {"id": 36, "model_name": "G82 M4", "points": 3000},
      {"id": 37, "model_name": "E28 M5", "points": 480},
      {"id": 38, "model_name": "E34 M5", "points": 650},
      {"id": 39, "model_name": "E39 M5", "points": 1300},
      {"id": 40, "model_name": "E60 M5", "points": 1700},
      {"id": 41, "model_name": "F10 M5", "points": 1500},
      {"id": 42, "model_name": "F90 M5", "points": 2300},
      {"id": 43, "model_name": "G90 M5", "points": 2600},
      {"id": 44, "model_name": "E63 M6", "points": 900},
      {"id": 45, "model_name": "F12 M6", "points": 1350},
      {"id": 46, "model_name": "F92 M8", "points": 3100},
      {"id": 47, "model_name": "F97 X3 M", "points": 900},
      {"id": 48, "model_name": "F98 X4 M", "points": 850},
      {"id": 49, "model_name": "E70 X5 M", "points": 650},
      {"id": 50, "model_name": "F85 X5 M", "points": 950},
      {"id": 51, "model_name": "F95 X5 M", "points": 1400},
      {"id": 52, "model_name": "E71 X6 M", "points": 700},
      {"id": 53, "model_name": "F86 X6 M", "points": 1100},
      {"id": 54, "model_name": "F96 X5 M", "points": 1500}
    ],
    "Bugatti": [
      {"id": 55, "model_name": "EB 110", "points": 52000},
      {"id": 56, "model_name": "Veyron", "points": 120000},
      {"id": 57, "model_name": "Chiron", "points": 185000},
      {"id": 58, "model_name": "Divo", "points": 210000},
      {"id": 59, "model_name": "Centodieci", "points": 220000},
      {"id": 60, "model_name": "Mistral", "points": 175000},
      {"id": 61, "model_name": "Tourbillon", "points": 230000}
    ],
    "Cadillac": [
      {"id": 62, "model_name": "ATS-V", "points": 1400},
      {"id": 63, "model_name": "CTS-V", "points": 1800},
      {"id": 64, "model_name": "Escalade ESV", "points": 250}
    ],
    "Chevrolet": [
      {"id": 65, "model_name": "Corvette (C2)", "points": 2600},
      {"id": 66, "model_name": "Corvette (C3)", "points": 1800},
      {"id": 67, "model_name": "Corvette (C4)", "points": 900},
      {"id": 68, "model_name": "Corvette (C5)", "points": 1100},
      {"id": 69, "model_name": "Corvette (C6)", "points": 1500},
      {"id": 70, "model_name": "Corvette (C7)", "points": 1800},
      {"id": 71, "model_name": "Corvette (C8)", "points": 3200},
      {"id": 72, "model_name": "Camaro", "points": 350},
      {"id": 73, "model_name": "Camaro ZL1", "points": 2000}
    ],
    "Dodge": [
      {"id": 74, "model_name": "Challenger Scat Pack", "points": 480},
      {"id": 75, "model_name": "Challenger SRT Hellcat", "points": 1600},
      {"id": 76, "model_name": "Challenger SRT Demon", "points": 9500},
      {"id": 77, "model_name": "Charger Scat Pack", "points": 450},
      {"id": 78, "model_name": "Charger SRT Hellcat", "points": 1500},
      {"id": 79, "model_name": "Viper (1st gen)", "points": 6500},
      {"id": 80, "model_name": "Viper (2nd gen)", "points": 7200}
    ],
    "Ferrari": [
      {"id": 81, "model_name": "F40", "points": 68000},
      {"id": 82, "model_name": "F50", "points": 76000},
      {"id": 83, "model_name": "LaFerrari", "points": 125000},
      {"id": 84, "model_name": "F430", "points": 5200},
      {"id": 85, "model_name": "458", "points": 8200},
      {"id": 86, "model_name": "488", "points": 9500},
      {"id": 87, "model_name": "F12", "points": 14000},
      {"id": 88, "model_name": "California", "points": 3800},
      {"id": 89, "model_name": "Roma", "points": 7000},
      {"id": 90, "model_name": "812", "points": 15000},
      {"id": 91, "model_name": "SF90", "points": 26000},
      {"id": 92, "model_name": "Portofino", "points": 4500},
      {"id": 93, "model_name": "GTC4Lusso", "points": 5200},
      {"id": 94, "model_name": "F8", "points": 11000},
      {"id": 95, "model_name": "296", "points": 12500},
      {"id": 96, "model_name": "Purosangue", "points": 6800}
    ],
    "Ford": [
      {"id": 97, "model_name": "Mustang", "points": 260},
      {"id": 98, "model_name": "GT (1st gen)", "points": 32000},
      {"id": 99, "model_name": "GT (2nd gen)", "points": 65000}
    ],
    "Honda": [
      {"id": 100, "model_name": "Civic Type-R", "points": 650},
      {"id": 101, "model_name": "Integra", "points": 420},
      {"id": 102, "model_name": "NSX", "points": 18500},
      {"id": 103, "model_name": "S2000", "points": 1800}
    ],
    "Hyundai": [
      {"id": 104, "model_name": "Elantra N", "points": 260},
      {"id": 105, "model_name": "Veloster N", "points": 320}
    ],
    "Infiniti": [
      {"id": 106, "model_name": "G35 Coupe", "points": 240},
      {"id": 107, "model_name": "G37 Coupe", "points": 260},
      {"id": 108, "model_name": "Q50", "points": 180},
      {"id": 109, "model_name": "Q60", "points": 260}
    ],
    "Jaguar": [
      {"id": 110, "model_name": "F-Type", "points": 2100},
      {"id": 111, "model_name": "F-Pace", "points": 140}
    ],
    "Jeep": [
      {"id": 112, "model_name": "Grand Cherokee Trackhawk", "points": 1800},
      {"id": 113, "model_name": "Wrangler", "points": 120}
    ],
    "Koenigsegg": [
      {"id": 114, "model_name": "CCXR", "points": 145000},
      {"id": 115, "model_name": "CC850", "points": 200000},
      {"id": 116, "model_name": "Agera", "points": 200000},
      {"id": 117, "model_name": "One:1", "points": 230000},
      {"id": 118, "model_name": "Regera", "points": 210000},
      {"id": 119, "model_name": "Jesko", "points": 230000},
      {"id": 120, "model_name": "Gemera", "points": 180000}
    ],
    "Lamborghini": [
      {"id": 121, "model_name": "Miura", "points": 52000},
      {"id": 122, "model_name": "Countach", "points": 35000},
      {"id": 123, "model_name": "Diablo", "points": 26000},
      {"id": 124, "model_name": "Gallardo", "points": 6500},
      {"id": 125, "model_name": "Huracan", "points": 9000},
      {"id": 126, "model_name": "Murcielago", "points": 18000},
      {"id": 127, "model_name": "Aventador", "points": 21000},
      {"id": 128, "model_name": "Urus", "points": 2800},
      {"id": 129, "model_name": "Sesto Elemento", "points": 90000},
      {"id": 130, "model_name": "Reventón", "points": 85000},
      {"id": 131, "model_name": "Veneno", "points": 125000},
      {"id": 132, "model_name": "Centenario", "points": 95000},
      {"id": 133, "model_name": "Sian", "points": 70000},
      {"id": 134, "model_name": "Revuelto", "points": 25000}
    ],
    "Land-Rover": [
      {"id": 135, "model_name": "Defender", "points": 140},
      {"id": 136, "model_name": "Range Rover", "points": 160}
    ],
    "Lexus": [
      {"id": 137, "model_name": "ISF", "points": 900},
      {"id": 138, "model_name": "GSF", "points": 1200},
      {"id": 139, "model_name": "RCF", "points": 1100},
      {"id": 140, "model_name": "LFA", "points": 75000}
    ],
    "Lotus": [
      {"id": 141, "model_name": "Elise", "points": 1200},
      {"id": 142, "model_name": "Evora", "points": 1500}
    ],
    "Maserati": [
      {"id": 143, "model_name": "Ghibli", "points": 1800},
      {"id": 144, "model_name": "MC12", "points": 125000},
      {"id": 145, "model_name": "Levante", "points": 350}
    ],
    "Maybach": [
      {"id": 146, "model_name": "S-Class", "points": 2200},
      {"id": 147, "model_name": "GLS-Class", "points": 900}
    ],
    "Mazda": [
      {"id": 148, "model_name": "Miata", "points": 280},
      {"id": 149, "model_name": "RX-7", "points": 3200},
      {"id": 150, "model_name": "RX-8", "points": 900}
    ],
    "McLaren": [
      {"id": 151, "model_name": "570S", "points": 14500},
      {"id": 152, "model_name": "650S", "points": 18500},
      {"id": 153, "model_name": "675LT", "points": 21000},
      {"id": 154, "model_name": "720S", "points": 25000},
      {"id": 155, "model_name": "765LT", "points": 29000},
      {"id": 156, "model_name": "Senna", "points": 130000},
      {"id": 157, "model_name": "Speedtail", "points": 180000},
      {"id": 158, "model_name": "F1", "points": 225000},
      {"id": 159, "model_name": "P1", "points": 145000}
    ],
    "Mercedes-Benz": [
      {"id": 160, "model_name": "A45 AMG", "points": 1800},
      {"id": 161, "model_name": "C63 AMG (W204)", "points": 2000},
      {"id": 162, "model_name": "C63 AMG (W205)", "points": 2200},
      {"id": 163, "model_name": "CL63 AMG", "points": 4200},
      {"id": 164, "model_name": "CLA45 AMG", "points": 1800},
      {"id": 165, "model_name": "CLK63 AMG", "points": 4600},
      {"id": 166, "model_name": "CLS63 AMG", "points": 4800},
      {"id": 167, "model_name": "E55 AMG", "points": 2100},
      {"id": 168, "model_name": "E63 AMG (W212)", "points": 2500},
      {"id": 169, "model_name": "E63 AMG (W213)", "points": 2900},
      {"id": 170, "model_name": "GT63 AMG", "points": 9500},
      {"id": 171, "model_name": "G63 AMG", "points": 21000},
      {"id": 172, "model_name": "GL63 AMG", "points": 1700},
      {"id": 173, "model_name": "GLE63 AMG", "points": 2600},
      {"id": 174, "model_name": "GLS63 AMG", "points": 2900},
      {"id": 175, "model_name": "ML63 AMG", "points": 1600},
      {"id": 176, "model_name": "S63 AMG (W221)", "points": 13500},
      {"id": 177, "model_name": "S63 AMG (W222)", "points": 15000},
      {"id": 178, "model_name": "S63 AMG (W223)", "points": 15500},
      {"id": 179, "model_name": "SL63 AMG", "points": 8000},
      {"id": 180, "model_name": "SLS AMG", "points": 60000},
      {"id": 181, "model_name": "SLR McLaren", "points": 95000},
      {"id": 182, "model_name": "AMG GT", "points": 11000}
    ],
    "Mitsubishi": [
      {"id": 183, "model_name": "3000GT", "points": 420},
      {"id": 184, "model_name": "Eclipse", "points": 210},
      {"id": 185, "model_name": "Evo 8", "points": 950},
      {"id": 186, "model_name": "Evo 9", "points": 1200},
      {"id": 187, "model_name": "Evo X", "points": 1500}
    ],
    "Nissan": [
      {"id": 188, "model_name": "240SX", "points": 140},
      {"id": 189, "model_name": "300ZX", "points": 650},
      {"id": 190, "model_name": "350Z", "points": 1200},
      {"id": 191, "model_name": "370Z", "points": 1500},
      {"id": 192, "model_name": "R32 GTR", "points": 9500},
      {"id": 193, "model_name": "R33 GTR", "points": 11000},
      {"id": 194, "model_name": "R34 GTR", "points": 12500},
      {"id": 195, "model_name": "Paul Walker's R34 GTR", "points": 14500},
      {"id": 196, "model_name": "R35 GTR", "points": 185000},
      {"id": 197, "model_name": "Z", "points": 3200}
    ],
    "Pagani": [
      {"id": 198, "model_name": "Zonda", "points": 185000},
      {"id": 199, "model_name": "Huayra", "points": 210000}
    ],
    "Polestar": [
      {"id": 200, "model_name": "Polestar 1", "points": 8500},
      {"id": 201, "model_name": "Polestar 2", "points": 2100},
      {"id": 202, "model_name": "Polestar 3", "points": 1600},
      {"id": 203, "model_name": "Polestar 4", "points": 1400},
      {"id": 204, "model_name": "Polestar 5", "points": 5200}
    ],
    "Porsche": [
      {"id": 205, "model_name": "718", "points": 3500},
      {"id": 206, "model_name": "911", "points": 12500},
      {"id": 207, "model_name": "911 RWB", "points": 14500},
      {"id": 208, "model_name": "918", "points": 150000},
      {"id": 209, "model_name": "Carrera GT", "points": 95000},
      {"id": 210, "model_name": "Panamera", "points": 1200},
      {"id": 211, "model_name": "Taycan", "points": 5500}
    ],
    "Rolls-Royce": [
      {"id": 212, "model_name": "Phantom", "points": 32000},
      {"id": 213, "model_name": "Ghost", "points": 28000},
      {"id": 214, "model_name": "Wraith", "points": 25000},
      {"id": 215, "model_name": "Dawn", "points": 22000},
      {"id": 216, "model_name": "Cullinan", "points": 26000},
      {"id": 217, "model_name": "Spectre", "points": 45000}
    ],
    "Saleen": [
      {"id": 218, "model_name": "S7", "points": 95000}
    ],
    "Scion": [
      {"id": 219, "model_name": "FR-S", "points": 280},
      {"id": 220, "model_name": "xB", "points": 120}
    ],
    "Subaru": [
      {"id": 221, "model_name": "Impreza", "points": 210},
      {"id": 222, "model_name": "WRX", "points": 350}
    ],
    "Tesla": [
      {"id": 223, "model_name": "Model S", "points": 1400},
      {"id": 224, "model_name": "Model 3", "points": 900},
      {"id": 225, "model_name": "Model X", "points": 1200},
      {"id": 226, "model_name": "Model Y", "points": 850},
      {"id": 227, "model_name": "Cybertruck", "points": 2100}
    ],
    "Toyota": [
      {"id": 228, "model_name": "Corolla GR", "points": 450},
      {"id": 229, "model_name": "Supra (Mk II)", "points": 1800},
      {"id": 230, "model_name": "Supra (Mk III)", "points": 950},
      {"id": 231, "model_name": "Supra (Mk IV)", "points": 12500},
      {"id": 232, "model_name": "Paul Walker's Supra", "points": 14500},
      {"id": 233, "model_name": "Supra (Mk V)", "points": 21000}
    ],
    "Volkswagen": [
      {"id": 234, "model_name": "Beetle", "points": 140},
      {"id": 235, "model_name": "Golf", "points": 180},
      {"id": 236, "model_name": "Phaeton", "points": 210}
    ]
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
      message: message,
    };

    const SERVICE_ID = 'service_s4f5fej';
    const TEMPLATE_ID = 'template_7iifdhb';
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