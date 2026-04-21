import './Capture.css'
import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SmallLogo from '../Assets/CarQuestLogo.png'
import ProfileIcon from '../Assets/Profile.png'

// 🔥 PRACTICAL ANTI-CHEAT - Detects AI images and screen photos only
// Allows regular iPhone photos, blank photos, outdoor shots, etc.

const validateImageAuthenticity = async (base64Image) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Image;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      let suspicionScore = 0;
      const reasons = [];
      
      // 1️⃣ DETECT MOIRÉ PATTERNS (photos of screens show interference) - BALANCED
      const moireScore = detectMoirePattern(pixels, canvas.width, canvas.height);
      if (moireScore > 0.55) {
        suspicionScore += 42;
        reasons.push('Screen moiré pattern detected');
      } else if (moireScore > 0.4) {
        suspicionScore += 22;
        reasons.push('Possible screen photo');
      }
      
      // 2️⃣ AI ARTIFACTS (unnatural smoothness) - BALANCED
      const aiScore = detectAIArtifacts(pixels, canvas.width, canvas.height);
      if (aiScore > 0.68) {
        suspicionScore += 42;
        reasons.push('AI generation artifacts detected');
      } else if (aiScore > 0.52) {
        suspicionScore += 18;
        reasons.push('Unusual smoothness patterns');
      }
      
      // 3️⃣ SCREEN BEZELS (device borders) - BALANCED
      const bezelScore = detectScreenBezel(pixels, canvas.width, canvas.height);
      if (bezelScore > 0.65) {
        suspicionScore += 38;
        reasons.push('Screen bezel detected');
      } else if (bezelScore > 0.48) {
        suspicionScore += 18;
        reasons.push('Possible device border detected');
      }
      
      // 4️⃣ PIXEL GRID (screen subpixels) - BALANCED
      const pixelGridScore = detectPixelGrid(pixels, canvas.width, canvas.height);
      if (pixelGridScore > 0.6) {
        suspicionScore += 38;
        reasons.push('Digital display pixel grid detected');
      } else if (pixelGridScore > 0.45) {
        suspicionScore += 18;
        reasons.push('Possible screen pixel structure');
      }
      
      console.log('🔍 BALANCED VALIDATION RESULTS:');
      console.log('   Suspicion Score:', suspicionScore);
      console.log('   Failed Checks:', reasons.length);
      console.log('   Reasons:', reasons);
      
      // ✅ BALANCED THRESHOLD: Block if suspicion > 65
      const isAuthentic = suspicionScore < 65;
      
      resolve({
        isAuthentic,
        suspicionScore,
        reasons: reasons.length > 0 ? reasons : ['Image appears authentic']
      });
    };
    
    img.onerror = () => {
      // Fail open - allow image if validation errors
      resolve({
        isAuthentic: true,
        suspicionScore: 0,
        reasons: ['Validation check failed - allowing image']
      });
    };
  });
};

const detectMoirePattern = (pixels, width, height) => {
  let patternCount = 0;
  const sampleSize = Math.min(width, height, 200);
  const step = Math.floor(Math.max(width, height) / sampleSize);
  
  for (let y = 0; y < height - step; y += step) {
    for (let x = 0; x < width - step; x += step) {
      const idx = (y * width + x) * 4;
      const nextIdx = ((y + step) * width + (x + step)) * 4;
      
      if (nextIdx < pixels.length) {
        const rDiff = Math.abs(pixels[idx] - pixels[nextIdx]);
        const gDiff = Math.abs(pixels[idx + 1] - pixels[nextIdx + 1]);
        const bDiff = Math.abs(pixels[idx + 2] - pixels[nextIdx + 2]);
        
        if (rDiff > 20 && gDiff > 20 && bDiff > 20) {
          patternCount++;
        }
      }
    }
  }
  
  return patternCount / (sampleSize * sampleSize);
};

// Detect AI generation artifacts (unnatural smoothness)
const detectAIArtifacts = (pixels, width, height) => {
  let artifactScore = 0;
  const sampleSize = 100;
  
  for (let i = 0; i < sampleSize; i++) {
    const x = Math.floor(Math.random() * (width - 30));
    const y = Math.floor(Math.random() * (height - 30));
    
    const values = [];
    
    for (let dy = 0; dy < 30; dy += 3) {
      for (let dx = 0; dx < 30; dx += 3) {
        const idx = ((y + dy) * width + (x + dx)) * 4;
        const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
        values.push(brightness);
      }
    }
    
    // Calculate variance
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    // Very low variance = suspiciously smooth (AI)
    if (variance < 50) artifactScore += 0.5;
    
    // Check for unnatural color consistency
    let colorConsistency = 0;
    for (let j = 0; j < values.length - 1; j++) {
      if (Math.abs(values[j] - values[j + 1]) < 2) colorConsistency++;
    }
    if (colorConsistency / values.length > 0.7) artifactScore += 0.5;
  }
  
  return Math.min(artifactScore / sampleSize, 1);
};

// 🔟 Detect pixel grid patterns (screens have regular pixel structures)
const detectPixelGrid = (pixels, width, height) => {
  let gridPattern = 0;
  const samples = Math.min(100, width * height / 1000);
  
  for (let i = 0; i < samples; i++) {
    const x = Math.floor(Math.random() * (width - 3));
    const y = Math.floor(Math.random() * (height - 3));
    
    const idx1 = (y * width + x) * 4;
    const idx2 = (y * width + (x + 2)) * 4;
    
    // Check for repeating patterns every 2-3 pixels
    const rDiff = Math.abs(pixels[idx1] - pixels[idx2]);
    const gDiff = Math.abs(pixels[idx1 + 1] - pixels[idx2 + 1]);
    const bDiff = Math.abs(pixels[idx1 + 2] - pixels[idx2 + 2]);
    
    if (rDiff < 10 && gDiff < 10 && bDiff < 10) {
      gridPattern++;
    }
  }
  
  return gridPattern / samples;
};


// 1️⃣2️⃣ Detect bezel/frame edges (photos of screens show device borders)
const detectScreenBezel = (pixels, width, height) => {
  let bezelDetection = 0;
  const edgeThickness = 20;
  
  // Check all 4 edges for solid dark/light bands
  const edges = [
    { start: 0, end: edgeThickness, horizontal: true }, // Top
    { start: height - edgeThickness, end: height, horizontal: true }, // Bottom
    { start: 0, end: edgeThickness, horizontal: false }, // Left
    { start: width - edgeThickness, end: width, horizontal: false } // Right
  ];
  
  edges.forEach(edge => {
    let edgeBrightness = 0;
    let edgeUniformity = 0;
    let samples = 0;
    
    if (edge.horizontal) {
      for (let y = edge.start; y < edge.end; y++) {
        for (let x = 0; x < width; x += 10) {
          const idx = (y * width + x) * 4;
          const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
          edgeBrightness += brightness;
          
          if (x > 0) {
            const prevIdx = (y * width + (x - 10)) * 4;
            const prevBrightness = (pixels[prevIdx] + pixels[prevIdx + 1] + pixels[prevIdx + 2]) / 3;
            if (Math.abs(brightness - prevBrightness) < 5) {
              edgeUniformity++;
            }
          }
          samples++;
        }
      }
    } else {
      for (let x = edge.start; x < edge.end; x++) {
        for (let y = 0; y < height; y += 10) {
          const idx = (y * width + x) * 4;
          const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
          edgeBrightness += brightness;
          
          if (y > 0) {
            const prevIdx = ((y - 10) * width + x) * 4;
            const prevBrightness = (pixels[prevIdx] + pixels[prevIdx + 1] + pixels[prevIdx + 2]) / 3;
            if (Math.abs(brightness - prevBrightness) < 5) {
              edgeUniformity++;
            }
          }
          samples++;
        }
      }
    }
    
    edgeBrightness /= samples;
    const uniformityRatio = edgeUniformity / samples;
    
    // Bezels are uniform and either very dark or very light
    if (uniformityRatio > 0.8 && (edgeBrightness < 30 || edgeBrightness > 225)) {
      bezelDetection += 0.25;
    }
  });
  
  return bezelDetection;
};


const showRejectionAnimation = (reasons, suspicionScore) => {
  const overlay = document.createElement('div');
  overlay.className = 'rejection-overlay_capture';
  
  const card = document.createElement('div');
  card.className = 'rejection-card_capture';
  
  const glitch = document.createElement('div');
  glitch.className = 'rejection-glitch_capture';
  card.appendChild(glitch);
  
  // Determine if meter breaks (score > 100)
  const meterBreaks = suspicionScore > 100;
  const displayScore = Math.min(suspicionScore, 150); // Cap display at 150
  const meterPercent = Math.min((displayScore / 100) * 100, 150);
  
  card.innerHTML += `
    <div class="rejection-content_capture">
      <div class="rejection-icon_capture ${meterBreaks ? 'icon-explode' : ''}">
        ${meterBreaks ? '💥' : '🚫'}
      </div>
      
      <div class="rejection-title_capture ${meterBreaks ? 'title-shake' : ''}">
        ${meterBreaks ? 'CRITICAL VIOLATION' : 'IMAGE REJECTED'}
      </div>
      
      <div class="rejection-subtitle_capture">
        ${meterBreaks ? 'EXTREME FRAUD DETECTED!' : 'Invalid Image Detected'}
      </div>
      
      <!-- 🔥 EPIC METER 🔥 -->
      <div class="suspicion-meter-container_capture">
        <div class="meter-label_capture">FRAUD DETECTION METER</div>
        
        <div class="meter-track_capture">
          <div class="meter-segments_capture">
            <div class="segment_capture safe"></div>
            <div class="segment_capture warning"></div>
            <div class="segment_capture danger"></div>
            <div class="segment_capture critical"></div>
          </div>
          
          <div class="meter-fill_capture ${meterBreaks ? 'meter-break' : ''}" 
               style="width: ${meterPercent}%; animation-delay: 0.5s;">
            ${meterBreaks ? '<div class="meter-spark_capture"></div>' : ''}
          </div>
          
          ${meterBreaks ? `
            <div class="meter-explosion_capture">
              <div class="explosion-particle_capture" style="--angle: 0deg;"></div>
              <div class="explosion-particle_capture" style="--angle: 45deg;"></div>
              <div class="explosion-particle_capture" style="--angle: 90deg;"></div>
              <div class="explosion-particle_capture" style="--angle: 135deg;"></div>
              <div class="explosion-particle_capture" style="--angle: 180deg;"></div>
              <div class="explosion-particle_capture" style="--angle: 225deg;"></div>
              <div class="explosion-particle_capture" style="--angle: 270deg;"></div>
              <div class="explosion-particle_capture" style="--angle: 315deg;"></div>
            </div>
          ` : ''}
          
          <div class="meter-needle_capture" style="left: ${Math.min(meterPercent, 100)}%;"></div>
          
          <div class="meter-markers_capture">
            <span style="left: 0%;">0</span>
            <span style="left: 25%;">25</span>
            <span style="left: 50%;">50</span>
            <span style="left: 75%;">75</span>
            <span style="left: 100%;" class="redline">100</span>
          </div>
        </div>
        
        <div class="meter-reading_capture ${meterBreaks ? 'reading-critical' : ''}">
          <span class="reading-label_capture">SUSPICION SCORE:</span>
          <span class="reading-value_capture ${meterBreaks ? 'value-explode' : ''}">${suspicionScore}</span>
          <span class="reading-max_capture">/100</span>
          ${meterBreaks ? '<span class="over-limit_capture">⚠️ OVER LIMIT!</span>' : ''}
        </div>
      </div>
      
      <div class="rejection-report_capture">
        <div class="report-title_capture">
          ${meterBreaks ? '🚨 CRITICAL VIOLATIONS DETECTED' : 'DETECTION REPORT'}
        </div>
        
        <div class="report-reasons_capture">
          ${reasons.slice(0, 5).map((reason, index) => `
            <div class="report-reason_capture ${meterBreaks ? 'reason-critical' : ''}" 
                 style="animation-delay: ${1.2 + index * 0.1}s;">
              <span class="reason-icon_capture">⚠️</span>
              <span>${reason}</span>
            </div>
          `).join('')}
          ${reasons.length > 5 ? `
            <div class="report-reason_capture more-violations" style="animation-delay: ${1.2 + 5 * 0.1}s;">
              <span class="reason-icon_capture">⚠️</span>
              <span>+${reasons.length - 5} more violations detected</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="rejection-instruction_capture">
        <strong style="color: ${meterBreaks ? '#ef4444' : '#fbbf24'};">
          ${meterBreaks ? 'SEVERELY FAKE IMAGE!' : 'Please use your device camera'}
        </strong><br/>
        ${meterBreaks ? 'Use your REAL camera immediately!' : 'to take a real photo of the car.'}
      </div>
      
      <button id="rejectionCloseBtn" class="rejection-close-btn_capture ${meterBreaks ? 'btn-critical' : ''}">
        TRY AGAIN
      </button>
    </div>
  `;
  
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  
  // Animate meter fill
  setTimeout(() => {
    const meterFill = card.querySelector('.meter-fill_capture');
    if (meterFill) {
      meterFill.style.width = `${meterPercent}%`;
    }
  }, 100);
  
  // Close button handler
  document.getElementById('rejectionCloseBtn').onclick = () => {
    overlay.classList.add('rejection-closing_capture');
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 400);
  };
};

const Capture = () => {

  // All car data with points (same as original)
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
      {"id": 50, "model_name": "F85 X5M", "points": 950},
      {"id": 51, "model_name": "F95 X5 M", "points": 1400},
      {"id": 52, "model_name": "E71 X6 M", "points": 700},
      {"id": 53, "model_name": "F86 X6M", "points": 1100},
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
      {"id": 141, "model_name": "Elise", "points": 3200},
      {"id": 142, "model_name": "Exige", "points": 4500},
      {"id": 143, "model_name": "Evora", "points": 3800},
      {"id": 144, "model_name": "Emira", "points": 2100}
    ],
    "Maserati": [
      {"id": 145, "model_name": "GranTurismo", "points": 2800},
      {"id": 146, "model_name": "MC20", "points": 9500},
      {"id": 147, "model_name": "Quattroporte", "points": 950}
    ],
    "Mazda": [
      {"id": 148, "model_name": "Miata (NA)", "points": 350},
      {"id": 149, "model_name": "Miata (NB)", "points": 380},
      {"id": 150, "model_name": "Miata (NC)", "points": 420},
      {"id": 151, "model_name": "Miata (ND)", "points": 480},
      {"id": 152, "model_name": "RX-7 (FC)", "points": 2100},
      {"id": 153, "model_name": "RX-7 (FD)", "points": 8500},
      {"id": 154, "model_name": "RX-8", "points": 650}
    ],
    "McLaren": [
      {"id": 155, "model_name": "F1", "points": 180000},
      {"id": 156, "model_name": "P1", "points": 165000},
      {"id": 157, "model_name": "570S", "points": 5800},
      {"id": 158, "model_name": "600LT", "points": 8200},
      {"id": 159, "model_name": "650S", "points": 7500},
      {"id": 160, "model_name": "675LT", "points": 12000},
      {"id": 161, "model_name": "720S", "points": 11500},
      {"id": 162, "model_name": "765LT", "points": 18000},
      {"id": 163, "model_name": "GT", "points": 26000},
      {"id": 164, "model_name": "Artura", "points": 9200},
      {"id": 165, "model_name": "Senna", "points": 95000},
      {"id": 166, "model_name": "Speedtail", "points": 110000},
      {"id": 167, "model_name": "Elva", "points": 85000}
    ],
    "Mercedes-Benz": [
      {"id": 168, "model_name": "190E Evolution", "points": 12000},
      {"id": 169, "model_name": "C63 AMG (W204)", "points": 1800},
      {"id": 170, "model_name": "C63 AMG (W205)", "points": 2400},
      {"id": 171, "model_name": "E63 AMG (W212)", "points": 2100},
      {"id": 172, "model_name": "E63 AMG (W213)", "points": 2800},
      {"id": 173, "model_name": "CLS63 AMG", "points": 2600},
      {"id": 174, "model_name": "S63 AMG", "points": 3500},
      {"id": 175, "model_name": "SL63 AMG", "points": 3200},
      {"id": 176, "model_name": "SLS AMG", "points": 18500},
      {"id": 177, "model_name": "AMG GT", "points": 8200},
      {"id": 178, "model_name": "AMG GT-R", "points": 12500},
      {"id": 179, "model_name": "AMG One", "points": 210000},
      {"id": 180, "model_name": "G63 AMG", "points": 3800},
      {"id": 181, "model_name": "GLE63 AMG", "points": 2400},
      {"id": 182, "model_name": "GLS63 AMG", "points": 2600}
    ],
    "Mini": [
      {"id": 183, "model_name": "Cooper S", "points": 280},
      {"id": 184, "model_name": "JCW", "points": 420}
    ],
    "Mitsubishi": [
      {"id": 185, "model_name": "Lancer Evolution VIII", "points": 3500},
      {"id": 186, "model_name": "Lancer Evolution IX", "points": 4200},
      {"id": 187, "model_name": "Lancer Evolution X", "points": 2800},
      {"id": 188, "model_name": "3000GT", "points": 1400}
    ],
    "Nissan": [
      {"id": 189, "model_name": "Skyline GT-R (R32)", "points": 18500},
      {"id": 190, "model_name": "Skyline GT-R (R33)", "points": 12000},
      {"id": 191, "model_name": "Skyline GT-R (R34)", "points": 35000},
      {"id": 192, "model_name": "GT-R (R35)", "points": 4500},
      {"id": 193, "model_name": "370Z", "points": 950},
      {"id": 194, "model_name": "Z (RZ34)", "points": 1200},
      {"id": 195, "model_name": "Silvia (S13)", "points": 2400},
      {"id": 196, "model_name": "Silvia (S14)", "points": 2800},
      {"id": 197, "model_name": "Silvia (S15)", "points": 9500}
    ],
    "Pagani": [
      {"id": 198, "model_name": "Zonda", "points": 145000},
      {"id": 199, "model_name": "Huayra", "points": 175000},
      {"id": 200, "model_name": "Utopia", "points": 200000}
    ],
    "Polestar": [
      {"id": 201, "model_name": "1", "points": 2400},
      {"id": 202, "model_name": "2", "points": 650}
    ],
    "Porsche": [
      {"id": 203, "model_name": "911 (964)", "points": 5200},
      {"id": 204, "model_name": "911 (993)", "points": 8500},
      {"id": 205, "model_name": "911 (996)", "points": 2100},
      {"id": 206, "model_name": "911 (997)", "points": 4200},
      {"id": 207, "model_name": "911 (991)", "points": 5800},
      {"id": 208, "model_name": "911 (992)", "points": 7200},
      {"id": 209, "model_name": "911 GT3", "points": 12500},
      {"id": 210, "model_name": "911 GT3 RS", "points": 18500},
      {"id": 211, "model_name": "911 Turbo S", "points": 14000},
      {"id": 212, "model_name": "Cayman GT4", "points": 8200},
      {"id": 213, "model_name": "718 Spyder", "points": 6500},
      {"id": 214, "model_name": "Taycan Turbo S", "points": 4800},
      {"id": 215, "model_name": "Carrera GT", "points": 95000}
    ],
    "Rolls-Royce": [
      {"id": 216, "model_name": "Phantom", "points": 28000},
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

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isCheckingDevice, setIsCheckingDevice] = useState(true);

  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Recognition flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [showManualSelection, setShowManualSelection] = useState(false);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [makeDropdownOpen, setMakeDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [showPackOpening, setShowPackOpening] = useState(false);
  const [unboxedCar, setUnboxedCar] = useState(null);

  // 🔥 Multi-angle attempt tracking
  const [attemptNumber, setAttemptNumber] = useState(1); // 1=front, 2=side-front, 3=rear
  const [capturedImages, setCapturedImages] = useState([]); // Store all images
  const [lastImageHash, setLastImageHash] = useState(null); // Track last image to prevent duplicates

  // 🚀 PRODUCTION API Configuration
  const ML_API_URL = 'https://ml.carquest.io';
  const BACKEND_API_URL = 'https://api.carquest.io';

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

    checkIfMobileDevice();
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const toMainPage = () => { 
    let path = '/mainPage'; 
    navigate(path);
  }

  const handleCapture = () => {
    fileInputRef.current.click();
  };

  // 🔍 Simple hash function to detect duplicate images
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  const compressImageForML = async (base64Image, maxSizeKB = 200) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Image;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Reduce to 800px max (ML doesn't need huge images)
        let width = img.width;
        let height = img.height;
        
        const maxDimension = 800;
        if (width > height) {
          if (width > maxDimension) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress with quality
        let quality = 0.7;
        let compressed = canvas.toDataURL('image/jpeg', quality);
        let iterations = 0;
        
        while (compressed.length > maxSizeKB * 1024 && quality > 0.1 && iterations < 8) {
          quality -= 0.1;
          compressed = canvas.toDataURL('image/jpeg', quality);
          iterations++;
        }
        
        const finalSizeKB = (compressed.length / 1024).toFixed(2);
        console.log(`✅ ML Compression: ${finalSizeKB}KB (${width}x${height})`);
        
        resolve(compressed);
      };
      
      img.onerror = () => resolve(base64Image);
    });
  };


  const checkIfMobileDevice = () => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(navigator.userAgent);
    const isMobileWidth = window.innerWidth < 768;
    
    const isMobile = (hasTouch && isMobileUA) || (isMobileUA && isMobileWidth);
    
    console.log('Capture - Mobile Detection:', {
      hasTouch,
      isMobileUA,
      isMobileWidth,
      isMobile
    });
    
    setIsMobileDevice(isMobile);
    setIsCheckingDevice(false);
  };

  const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result;
      const imageHash = simpleHash(imageData);
      
      // Check for duplicate
      if (lastImageHash && imageHash === lastImageHash) {
        console.log('❌ Duplicate image detected!');
        showNotification(
          '❌',
          'DUPLICATE IMAGE',
          'Please take another picture from a different angle.',
          '#ef4444',
          4500
        );
        event.target.value = '';
        return;
      }
      
      console.log('🔍 Validating image authenticity...');
      const validation = await validateImageAuthenticity(imageData);
      
      if (!validation.isAuthentic) {
        console.log('❌ Image rejected:', validation.reasons);
        showRejectionAnimation(validation.reasons, validation.suspicionScore);
        event.target.value = '';
        return;
      }
      
      console.log('✅ Image validated - appears authentic!');
      
      // Store validated image
      setCapturedImage(imageData);
      setLastImageHash(imageHash);
      console.log(`🔥 Image captured for attempt ${attemptNumber}/3`);
    };
    reader.readAsDataURL(file);
  }
};

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    try {
      console.log('=== SUBMIT START ===');
      console.log('1. Image size:', (capturedImage.length / 1024).toFixed(0), 'KB');
      
      // Compress
      console.log('2. Compressing...');
      const imageToSend = await compressImageForML(capturedImage, 300);
      console.log('3. Compressed to:', (imageToSend.length / 1024).toFixed(0), 'KB');
      
      // Convert base64 to blob
      console.log('4. Converting to blob...');
      const response = await fetch(imageToSend);
      const blob = await response.blob();
      console.log('5. Blob created:', blob.size, 'bytes');
      
      // Create form data
      console.log('6. Creating form data...');
      const formData = new FormData();
      formData.append('file', blob, 'car.jpg');
      
      console.log('7. Calling ML API:', `${ML_API_URL}/identify`);
      console.log('8. Attempt:', attemptNumber, '/ 3');
      
      // Call ML API
      const apiResponse = await fetch(`${ML_API_URL}/identify`, {
        method: 'POST',
        body: formData
      });
      
      console.log('9. Response received!');
      console.log('10. Status:', apiResponse.status);
      console.log('11. OK:', apiResponse.ok);
      
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('12. ERROR TEXT:', errorText);
        throw new Error(`API returned ${apiResponse.status}: ${errorText}`);
      }
      
      const result = await apiResponse.json();
      console.log('13. RESULT:', result);
      
      if (result.success) {
        const carFullName = result.result;
        const confidence = result.confidence || 0; // Get confidence from API
        
        console.log(`🚗 Detected: ${carFullName} (Confidence: ${(confidence * 100).toFixed(1)}%)`);
        
        // 🔥 CHECK IF CONFIDENCE IS ABOVE 30%
        if (confidence < 0.30) {
          console.log(`⚠️ Low confidence (${(confidence * 100).toFixed(1)}%) - Skipping this attempt`);
          
          // Show notification
          showNotification(
            '⚠️',
            'LOW CONFIDENCE',
            `Only ${(confidence * 100).toFixed(0)}% sure. Try a different angle!`,
            '#fbbf24',
            3000
          );
          
          return; // Exit early - don't show recognition result
        }
        
        // IF CONFIDENCE IS ABOVE 30% - PROCEED AS NORMAL
        console.log(`✅ Acceptable confidence (${(confidence * 100).toFixed(1)}%) - Showing result`);
        
        const matchedCar = findCarInDatabase(carFullName);
        
        if (matchedCar) {
          setRecognitionResult({
            make: matchedCar.make,
            model: matchedCar.model,
            confidence: confidence,
            fullName: carFullName,
            carData: matchedCar
          });
          
          setCapturedImages([...capturedImages, capturedImage]);
          setIsProcessing(false);
          
        } else {
          console.warn('⚠️ Car not in database');
          setCapturedImages([...capturedImages, capturedImage]);
          setIsProcessing(false);
          setShowManualSelection(true);
        }
        
      } else {
        console.log(`❌ Attempt ${attemptNumber}/3 failed`);
        
        setCapturedImages([...capturedImages, capturedImage]);
        
        if (attemptNumber < 3) {
          setIsProcessing(false);
          setAttemptNumber(attemptNumber + 1);
          setCapturedImage(null);
          showAngleInstructions();
          
        } else {
          console.log('❌ All attempts failed');
          setIsProcessing(false);
          setShowManualSelection(true);
        }
      }
      
    } catch (error) {
      console.error('💥 FATAL ERROR:', error.message);
      setIsProcessing(false);
      
      // Show error notification
      const errorNotif = document.createElement('div');
      errorNotif.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 25px 35px;
        border-radius: 20px;
        font-size: 16px;
        font-weight: 900;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 15px 50px rgba(239, 68, 68, 0.7);
        border: 3px solid white;
        animation: notificationBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      errorNotif.innerHTML = `
        <div style="font-size: 40px; margin-bottom: 10px;">⚠️</div>
        <div style="font-size: 16px; letter-spacing: 1px;">CONNECTION ERROR</div>
        <div style="font-size: 13px; margin-top: 8px; opacity: 0.9;">${error.message}</div>
      `;
      
      document.body.appendChild(errorNotif);
      
      setTimeout(() => {
        errorNotif.style.animation = 'notificationFadeOut 0.3s ease-out';
        setTimeout(() => errorNotif.remove(), 300);
      }, 4000);
    }
  };

  // 🎯 Find car in your database (smart matching)
  const findCarInDatabase = (apiCarName) => {
    console.log(`🔍 Searching database for: "${apiCarName}"`);
    
    const cleanName = apiCarName.trim();
    
    // Try exact match first for each make
    for (const [make, models] of Object.entries(carData)) {
      if (cleanName.toLowerCase().includes(make.toLowerCase())) {
        console.log(`✓ Make matched: ${make}`);
        
        const modelPart = cleanName.replace(new RegExp(make, 'gi'), '').trim();
        console.log(`  Looking for model: "${modelPart}"`);
        
        // Try exact match
        for (const car of models) {
          if (car.model_name.toLowerCase() === modelPart.toLowerCase()) {
            console.log(`✅ EXACT MATCH: ${make} ${car.model_name}`);
            return { make: make, model: car.model_name, ...car };
          }
        }
        
        // Try partial match
        for (const car of models) {
          if (modelPart.toLowerCase().includes(car.model_name.toLowerCase()) ||
              car.model_name.toLowerCase().includes(modelPart.toLowerCase())) {
            console.log(`✅ PARTIAL MATCH: ${make} ${car.model_name}`);
            return { make: make, model: car.model_name, ...car };
          }
        }
        
        // Make matches but not model
        if (models.length > 0) {
          console.log(`⚠️ Make only match, using: ${make} ${models[0].model_name}`);
          return { make: make, model: models[0].model_name, ...models[0] };
        }
      }
    }
    
    console.log('❌ No match found in database');
    return null;
  };

  const showAngleInstructions = () => {
    const messages = {
      1: {
        title: '🔄 TRY DIFFERENT ANGLE',
        text: 'Not detected! Try capturing from a different angle.',
        emoji: '🔄',
        color: '#fbbf24'
      },
      2: {
        title: '🔄 TRY DIFFERENT FRONT ANGLE',
        text: 'Not detected! Capture the front from a slightly different angle.',
        emoji: '🔄',
        color: '#fbbf24'
      },
      3: {
        title: '🔙 TRY REAR ANGLE',
        text: 'Still not detected! Please capture from the BACK of the car.',
        emoji: '🔙',
        color: '#ef4444'
      }
    };
    
    const nextAttempt = attemptNumber + 1;
    const msg = messages[nextAttempt] || messages[3];
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, ${msg.color}, ${msg.color}dd);
      color: white;
      padding: 30px 40px;
      border-radius: 20px;
      font-size: 18px;
      font-weight: 900;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 15px 50px ${msg.color}99;
      border: 3px solid white;
      animation: notificationBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      max-width: 85vw;
    `;
    notification.innerHTML = `
      <div style="font-size: 50px; margin-bottom: 12px;">${msg.emoji}</div>
      <div style="font-size: 18px; letter-spacing: 2px; margin-bottom: 10px;">${msg.title}</div>
      <div style="font-size: 14px; opacity: 0.95; line-height: 1.4;">${msg.text}</div>
      <div style="font-size: 12px; margin-top: 12px; opacity: 0.8;">Attempt ${attemptNumber}/3</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'notificationFadeOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3500);
  };
  
const handleConfirmYes = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const carInfo = recognitionResult.carData;
    
    if (!carInfo) {
      console.error('Car info not found');
      return;
    }

    const isMandatoryReview = carInfo.points >= 5000;
    
    if (isMandatoryReview) {
      console.log(`🏆 HIGH-VALUE CAR DETECTED: ${carInfo.points} points - Mandatory review required!`);
      
      showNotification(
        '🏆',
        'RARE CAR DETECTED!',
        `${recognitionResult.make} ${recognitionResult.model} (${carInfo.points.toLocaleString()} pts) - Submitting for verification...`,
        '#fbbf24',
        3000
      );
      
      const firstImage = capturedImages[0] || capturedImage;
      console.log('📦 Compressing image for mandatory review...');
      const compressedImage = await compressImage(firstImage, 200);
      const sizeKB = (compressedImage.length / 1024).toFixed(2);
      console.log(`✅ Compressed to ${sizeKB}KB`);
      
      const response = await fetch(`${BACKEND_API_URL}/submit_manual_review_with_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: userData?.username,
          car_id: carInfo.id,
          image_data: compressedImage,
          attempts: attemptNumber,
          selected_make: recognitionResult.make,
          selected_model: recognitionResult.model,
          car_points: carInfo.points,
          auto_detected: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit mandatory review');
      }
      
      const result = await response.json();
      console.log('✅ Mandatory review submitted:', result);
      
      setRecognitionResult(null);
      setShowFinalMessage(true);
      
      showNotification(
        '🏆',
        'VERIFICATION REQUIRED',
        `${recognitionResult.make} ${recognitionResult.model} (${carInfo.points.toLocaleString()} pts) submitted! An admin will verify your capture shortly.`,
        '#fbbf24',
        6000
      );
      
      return;
    }

    console.log(`✅ Regular car (${carInfo.points} points) - Adding to collection`);

    const collectResponse = await fetch(`${BACKEND_API_URL}/collect_car`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        car_id: carInfo.id,
        username: userData.username
      })
    });

    const collectResult = await collectResponse.json();
    
    if (collectResult.status === 'success') {
      await fetch(`${BACKEND_API_URL}/update_points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: userData.username,
          points: carInfo.points
        })
      });

      const updatedUserData = {
        ...userData,
        collected_cars: [...userData.collected_cars, carInfo.id],
        points: userData.points + carInfo.points
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);

      setUnboxedCar({
        make: recognitionResult.make,
        model: recognitionResult.model,
        points: carInfo.points,
        confidence: recognitionResult.confidence,
        attemptNumber: attemptNumber
      });
      setRecognitionResult(null);
      setShowPackOpening(true);
      
    } else {
      if (collectResult.message === "Car already collected") {
        setUnboxedCar({
          make: recognitionResult.make,
          model: recognitionResult.model,
          points: 0,
          duplicate: true,
          confidence: recognitionResult.confidence,
          attemptNumber: attemptNumber
        });
        setRecognitionResult(null);
        setShowPackOpening(true);
      } else {
        alert(collectResult.message);
      }
    }
    
  } catch (error) {
    console.error('Error confirming car:', error);
    showNotification(
      '❌',
      'SUBMISSION FAILED',
      error.message || 'Please try again',
      '#ef4444',
      4000
    );
  }
};


  const handleConfirmNo = () => {
    setRecognitionResult(null);
    
    if (attemptNumber < 3) {
      const nextAttempt = attemptNumber + 1;
      setAttemptNumber(nextAttempt);
      setCapturedImage(null);
      showAngleInstructions();
    } else {
      setShowManualSelection(true);
    }
  };

  const handleMakeSelect = (make) => {
    setSelectedMake(make);
    setSelectedModel(null);
    setMakeDropdownOpen(false);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model.model_name);
    setModelDropdownOpen(false);
  };

  const toggleMakeDropdown = () => {
    if (!makeDropdownOpen) {
      setModelDropdownOpen(false);
    }
    setMakeDropdownOpen(!makeDropdownOpen);
  };

  const toggleModelDropdown = () => {
    if (!modelDropdownOpen) {
      setMakeDropdownOpen(false);
    }
    setModelDropdownOpen(!modelDropdownOpen);
  };

  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const compressImage = async (base64Image, maxSizeKB = 45) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Image;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        let width = img.width;
        let height = img.height;
        
        const maxDimension = 600;
        if (width > height) {
          if (width > maxDimension) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        let quality = 0.6;
        let compressed = canvas.toDataURL('image/jpeg', quality);
        let iterations = 0;
        const maxIterations = 10;
        
        while (compressed.length > maxSizeKB * 1024 && quality > 0.1 && iterations < maxIterations) {
          quality -= 0.05;
          compressed = canvas.toDataURL('image/jpeg', quality);
          iterations++;
          console.log(`Compression attempt ${iterations}: ${(compressed.length / 1024).toFixed(2)}KB at quality ${quality.toFixed(2)}`);
        }
        
        if (compressed.length > maxSizeKB * 1024) {
          console.log('Still too large, reducing dimensions further...');
          width = Math.floor(width * 0.7);
          height = Math.floor(height * 0.7);
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          compressed = canvas.toDataURL('image/jpeg', 0.5);
        }
        
        const finalSizeKB = (compressed.length / 1024).toFixed(2);
        const originalSizeKB = (base64Image.length / 1024).toFixed(2);
        console.log(`✅ Compressed: ${originalSizeKB}KB → ${finalSizeKB}KB (${width}x${height}, quality: ${quality.toFixed(2)})`);
        
        resolve(compressed);
      };
      
      img.onerror = () => {
        console.error('Error loading image for compression');
        resolve(base64Image);
      };
    });
  };

  const handleManualSubmit = async () => {
    if (!selectedMake || !selectedModel) {
      showNotification('⚠️', 'SELECTION REQUIRED', 'Please select both make and model', '#ef4444');
      return;
    }

    const selectedCarData = carData[selectedMake]?.find(car => car.model_name === selectedModel);
    
    if (!selectedCarData) {
      showNotification('❌', 'CAR NOT FOUND', `${selectedMake} ${selectedModel} not in database`, '#ef4444');
      return;
    }

    setIsSubmittingManual(true);

    try {
      const token = localStorage.getItem('token');
      const firstImage = capturedImages[0] || capturedImage;
      
      const isMandatoryReview = selectedCarData.points >= 5000;
      
      console.log('📤 Submitting manual review with image to database...');
      if (isMandatoryReview) {
        console.log(`🏆 RARE CAR DETECTED: ${selectedCarData.points} points - Mandatory review required!`);
      }
      
      console.log('📦 Compressing image...');
      const compressedImage = await compressImage(firstImage, 200);
      const sizeKB = (compressedImage.length / 1024).toFixed(2);
      console.log(`✅ Compressed to ${sizeKB}KB`);
      
      const response = await fetch(`${BACKEND_API_URL}/submit_manual_review_with_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: userData?.username,
          car_id: selectedCarData.id,
          image_data: compressedImage,
          attempts: attemptNumber,
          selected_make: selectedMake,
          selected_model: selectedModel,
          car_points: selectedCarData.points
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit manual review');
      }
      
      const result = await response.json();
      console.log('✅ Manual review submitted successfully:', result);
      
      setIsSubmittingManual(false);
      setShowFinalMessage(true);
      
      if (result.is_mandatory) {
        showNotification(
          '🏆', 
          'RARE CAR DETECTED!', 
          `${selectedMake} ${selectedModel} (${selectedCarData.points.toLocaleString()} pts) - Your submission requires manual verification. An admin will review shortly!`, 
          '#fbbf24', 
          6000
        );
      } else {
        showNotification(
          '✅', 
          'SUBMISSION RECEIVED', 
          'Admin will review your submission shortly!', 
          '#10b981', 
          4000
        );
      }
      
    } catch (error) {
      console.error('❌ Error in manual submission:', error);
      setIsSubmittingManual(false);
      showNotification('❌', 'SUBMISSION FAILED', error.message || 'Please try again', '#ef4444', 5000);
    }
  };

  // Universal notification system
  const showNotification = (emoji, title, text, color, duration = 3500) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, ${color}, ${color}dd);
      color: white;
      padding: 30px 40px;
      border-radius: 20px;
      font-size: 18px;
      font-weight: 900;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 15px 50px ${color}99;
      border: 3px solid white;
      animation: notificationBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      max-width: 85vw;
    `;
    notification.innerHTML = `
      <div style="font-size: 50px; margin-bottom: 12px;">${emoji}</div>
      <div style="font-size: 18px; letter-spacing: 2px; margin-bottom: 10px;">${title}</div>
      <div style="font-size: 14px; opacity: 0.95; line-height: 1.4;">${text}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'notificationFadeOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setIsProcessing(false);
    setRecognitionResult(null);
    setShowManualSelection(false);
    setSelectedMake(null);
    setSelectedModel(null);
    setShowFinalMessage(false);
    setShowPackOpening(false);
    setUnboxedCar(null);
    setAttemptNumber(1);
    setCapturedImages([]);
    setLastImageHash(null);
  };

  const handleRetake = () => {
    resetCapture();
  };

  const getAvailableModels = () => {
    if (!selectedMake) return [];
    return carData[selectedMake] || [];
  };

  const getProfilePicture = () => {
    if (userData?.profile_picture) {
      return userData.profile_picture;
    }
    return ProfileIcon;
  };

  const getCurrentAngleText = () => {
    const angles = {
      1: { emoji: '📸', text: 'FRONT VIEW', color: '#10b981' },
      2: { emoji: '🔄', text: 'DIFFERENT ANGLE', color: '#fbbf24' },
      3: { emoji: '🔙', text: 'REAR VIEW', color: '#ef4444' }
    };
    return angles[attemptNumber] || angles[1];
  };

  if (isCheckingDevice) {
    return (
      <div className="container_capture loading_capture">
        <div className="bg-gradient-1_capture"></div>
        <div className="bg-gradient-2_capture"></div>
        <div className="loader_capture"></div>
      </div>
    );
  }

  if (!isMobileDevice) {
    return (
      <div className="container_capture desktop-locked_capture">
        <div className="bg-gradient-1_capture"></div>
        <div className="bg-gradient-2_capture"></div>
        
        <div className="desktop-lock-overlay_capture">
          <div className="lock-card_capture">
            <div className="lock-icon-large_capture">📱</div>
            <h1 className="lock-title_capture">Capture is restricted on desktop.</h1>
            <p className="lock-message_capture">
              Please return to mobile to use capture mode.
            </p>
            <button className="back-button_capture" onClick={toMainPage}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Main Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container_capture">
      {/* Animated Background Gradients */}
      <div className="bg-gradient-1_capture"></div>
      <div className="bg-gradient-2_capture"></div>
      <div className="particles_capture">
        <div className="particle_capture"></div>
        <div className="particle_capture"></div>
        <div className="particle_capture"></div>
        <div className="particle_capture"></div>
        <div className="particle_capture"></div>
      </div>

      {/* Header Section */}
      <div className="header_capture">
        <div className="logo_capture">
          <img src={SmallLogo} alt="CarQuest Logo" onClick={toMainPage}/>
        </div>
        
        <div className="profile_capture" onClick={toggleDropdown}>
          <img src={getProfilePicture()} alt="Profile"/>
          {dropdownOpen && (
            <div className="dropdown_capture">
              <a href="#!" onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}>Log Out</a>
            </div>
          )}
        </div>
      </div>

      {/* Title Section with Angle Indicator */}
      <div className="title_capture">
        <h1>CAPTURE</h1>
        <p className="subtitle_capture">Spot a car and capture it!</p>
        {attemptNumber > 1 && !isProcessing && !recognitionResult && !showManualSelection && (
          <div className="angle-indicator_capture" style={{
            marginTop: '10px',
            padding: '8px 20px',
            background: `linear-gradient(135deg, ${getCurrentAngleText().color}, ${getCurrentAngleText().color}dd)`,
            borderRadius: '20px',
            color: 'white',
            fontWeight: '900',
            fontSize: '14px',
            letterSpacing: '2px',
            boxShadow: `0 4px 15px ${getCurrentAngleText().color}66`,
            animation: 'pulse_capture 2s ease-in-out infinite'
          }}>
            {getCurrentAngleText().emoji} {getCurrentAngleText().text} (Attempt {attemptNumber}/3)
          </div>
        )}
      </div>

      {/* Capture Area */}
      <div className="capture-area_capture">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        
        {/* Preview Container */}
        <div className="preview-container_capture">
          {capturedImage ? (
            <div className="image-preview_capture">
              <img src={capturedImage} alt="Captured" />
              <div className="preview-overlay_capture">
                <span className="preview-label_capture">✓ Photo Captured</span>
              </div>
            </div>
          ) : (
            <div className="placeholder_capture">
              <div className="camera-icon_capture">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <p className="placeholder-text_capture">
                {attemptNumber === 1 ? 'Capture from FRONT' : 
                 attemptNumber === 2 ? 'Capture from DIFFERENT ANGLE 🔄' : 
                 'Capture from REAR 🔙'}
              </p>
            </div>
          )}
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="recognition-card_capture processing">
            <div className="loader_capture"></div>
            <h2 className="recognition-title_capture">ANALYZING...</h2>
            <p className="recognition-subtitle_capture">🤖 AI is identifying your car (Attempt {attemptNumber}/3)</p>
          </div>
        )}

        {/* Recognition Result */}
        {recognitionResult && !showManualSelection && !isProcessing && (
          <div className="recognition-card_capture">
            <div style={{
              fontSize: '14px',
              color: recognitionResult.confidence > 0.6 ? '#10b981' : recognitionResult.confidence > 0.3 ? '#fbbf24' : '#ef4444',
              fontWeight: '700',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {Math.round(recognitionResult.confidence * 100)}% Confident
            </div>
            <h2 className="recognition-question_capture">Is this your car?</h2>
            <div className="recognition-result_capture">
              {recognitionResult.make} {recognitionResult.model}
            </div>
            <div className="confirmation-buttons_capture">
              <button className="confirm-button_capture yes" onClick={handleConfirmYes}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                YES
              </button>
              <button className="confirm-button_capture no" onClick={handleConfirmNo}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                {attemptNumber < 3 ? (
                  <span>NO (Try {attemptNumber === 1 ? 'Different' : 'Rear'})</span>
                ) : (
                  <span>NO (Manual Review)</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Manual Selection */}
        {showManualSelection && !showFinalMessage && (
          <div className="recognition-card_capture manual-selection">
            {isSubmittingManual ? (
              <div style={{ textAlign: 'center' }}>
                <div className="loader_capture" style={{ margin: '0 auto 20px' }}></div>
                <h2 className="recognition-title_capture">SUBMITTING...</h2>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  marginTop: '15px',
                  lineHeight: '1.6'
                }}>
                  <div style={{ marginBottom: '8px' }}>✅ Saving to database...</div>
                  <div style={{ marginBottom: '8px' }}>📦 Compressing images...</div>
                  <div>📧 Sending for review...</div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="recognition-title_capture">MANUAL SELECTION</h2>
                <p className="recognition-subtitle_capture">
                  AI couldn't identify after {attemptNumber} attempts. Select your car:
                </p>
                
                <div className="selection-buttons_capture">
                  <div className="dropdown-wrapper_capture">
                    <button 
                      className="selection-button_capture"
                      onClick={toggleMakeDropdown}
                    >
                      {selectedMake || 'SELECT MAKE'}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    {makeDropdownOpen && (
                      <div className="dropdown-menu_capture">
                        {Object.keys(carData).map(make => (
                          <div 
                            key={make}
                            className="dropdown-item_capture"
                            onClick={() => handleMakeSelect(make)}
                          >
                            {make}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="dropdown-wrapper_capture">
                    <button 
                      className="selection-button_capture"
                      onClick={toggleModelDropdown}
                      disabled={!selectedMake}
                    >
                      {selectedModel ? selectedModel : 'SELECT MODEL'}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    {modelDropdownOpen && selectedMake && (
                      <div className="dropdown-menu_capture">
                        {getAvailableModels().map(model => (
                          <div 
                            key={model.id}
                            className="dropdown-item_capture"
                            onClick={() => handleModelSelect(model)}
                          >
                            {model.model_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    className="selection-button_capture submit"
                    onClick={handleManualSubmit}
                    disabled={!selectedMake || !selectedModel}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    SUBMIT FOR REVIEW
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 🔥🔥🔥 EPIC FIFA-STYLE PACK OPENING! 🔥🔥🔥 */}
        {showPackOpening && unboxedCar && (
          <div className="pack-opening-overlay_capture">
            <div className="pack-opening-container_capture">
              <div className="pack-particles_capture">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="particle_capture" style={{
                    left: `${5 + i * 8}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: `${2 + Math.random()}s`
                  }}></div>
                ))}
              </div>

              <div className="reveal-card_capture">
                <div className="flare_capture flare-1_capture"></div>
                <div className="flare_capture flare-2_capture"></div>
                
                <div className="card-content_capture">
                  {unboxedCar.duplicate ? (
                    <>
                      <div className="duplicate-badge_capture">DUPLICATE</div>
                      <div className="car-rarity_capture duplicate">ALREADY COLLECTED</div>
                    </>
                  ) : (
                    <>
                      <div className="car-rarity_capture">
                        {unboxedCar.points >= 50000 ? '★★★★★ LEGENDARY' :
                         unboxedCar.points >= 20000 ? '★★★★ EPIC' :
                         unboxedCar.points >= 5000 ? '★★★ RARE' :
                         unboxedCar.points >= 1000 ? '★★ UNCOMMON' :
                         '★ COMMON'}
                      </div>
                      {unboxedCar.attemptNumber > 1 && (
                        <div style={{
                          fontSize: '12px',
                          color: '#fbbf24',
                          marginTop: '5px',
                          fontWeight: '700',
                          textShadow: '0 2px 10px rgba(251, 191, 36, 0.8)'
                        }}>
                          🎯 Detected on attempt {unboxedCar.attemptNumber}/3!
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="car-make_capture">{unboxedCar.make}</div>
                  <div className="car-model_capture">{unboxedCar.model}</div>
                  
                  {!unboxedCar.duplicate && (
                    <>
                      <div className="points-badge_capture">
                        <div className="points-glow_capture"></div>
                        <span className="points-plus_capture">+</span>
                        <span className="points-value_capture">{unboxedCar.points.toLocaleString()}</span>
                        <span className="points-label_capture">POINTS</span>
                      </div>
                      <div className="new-badge_capture">NEW!</div>
                    </>
                  )}
                </div>

                <div className="holographic-overlay_capture"></div>
              </div>

              <button className="continue-button_capture" onClick={resetCapture}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {unboxedCar.duplicate ? 'TRY AGAIN' : 'CONTINUE'}
              </button>
            </div>
          </div>
        )}

        {/* Final Message */}
        {showFinalMessage && (
          <div className="recognition-card_capture final-message">
            <div className="success-icon_capture">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="final-title_capture">SUBMISSION RECEIVED</h2>
            <p className="final-text_capture">
              Your capture has been submitted for manual review after {attemptNumber} attempts. 
              Check status in Settings.
            </p>
            <div className="final-buttons_capture">
              <button 
                className="final-button_capture settings"
                onClick={() => navigate('/support', { state: { showManualReviews: true } })}
              >
                VIEW MANUAL REVIEWS
              </button>
              <button 
                className="final-button_capture capture"
                onClick={resetCapture}
              >
                NEW CAPTURE
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isProcessing && !recognitionResult && !showManualSelection && !showFinalMessage && !showPackOpening && (
          <div className="button-group_capture">
            {!capturedImage ? (
              <button className="capture-button_capture" onClick={handleCapture}>
                <svg className="button-icon_capture" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span>
                  {attemptNumber === 1 ? 'Capture Front' : 
                   attemptNumber === 2 ? 'Capture Different Angle' : 
                   'Capture Rear'}
                </span>
              </button>
            ) : (
              <>
                <button className="retake-button_capture" onClick={handleRetake}>
                  <svg className="button-icon_capture" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  <span>Retake</span>
                </button>
                <button className="submit-button_capture" onClick={handleSubmit}>
                  <svg className="button-icon_capture" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Submit ({attemptNumber}/3)</span>
                </button>
              </>
            )}
          </div>
        )}


        <div style={{
          flexShrink: 0,
          marginTop: '15px',
          marginBottom: '30px',
          padding: '18px 20px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)',
          maxWidth: '500px',
          width: 'calc(100% - 40px)',
          position: 'relative',
          overflow: 'visible',
          boxSizing: 'border-box'
        }}>
          {/* Corner accents - Small and responsive */}
          <div style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            width: '22px',
            height: '22px',
            border: '2px solid rgba(139, 92, 246, 0.6)',
            borderRight: 'none',
            borderBottom: 'none',
            borderRadius: '3px 0 0 0'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '22px',
            height: '22px',
            border: '2px solid rgba(139, 92, 246, 0.6)',
            borderLeft: 'none',
            borderBottom: 'none',
            borderRadius: '0 3px 0 0'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: '6px',
            width: '22px',
            height: '22px',
            border: '2px solid rgba(139, 92, 246, 0.6)',
            borderRight: 'none',
            borderTop: 'none',
            borderRadius: '0 0 0 3px'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '6px',
            right: '6px',
            width: '22px',
            height: '22px',
            border: '2px solid rgba(139, 92, 246, 0.6)',
            borderLeft: 'none',
            borderTop: 'none',
            borderRadius: '0 0 3px 0'
          }}></div>
          
          {/* Content wrapper */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%'
          }}>
            {/* Title - Compact */}
            <div style={{
              fontSize: '14px',
              fontWeight: '900',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
              marginBottom: '10px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              lineHeight: '1.2',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                fontSize: '18px',
                filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))'
              }}>⚡</span>
              AI MODEL STATUS
              <span style={{ 
                fontSize: '18px',
                filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))'
              }}>⚡</span>
            </div>

            {/* Stats bar - Compact */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '7px',
                gap: '10px'
              }}>
                <span style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Accuracy</span>
                <span style={{
                  color: '#fbbf24',
                  fontSize: '17px',
                  fontWeight: '900',
                  textShadow: '0 0 10px rgba(251, 191, 36, 0.6)',
                  letterSpacing: '0.5px'
                }}>89%</span>
              </div>
              
              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '7px',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <div style={{
                  width: '90%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                  boxShadow: '0 0 15px rgba(251, 191, 36, 0.6)',
                  borderRadius: '4px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 2s linear infinite'
                  }}></div>
                </div>
              </div>
            </div>

            {/* Main message - Compact and clear */}
            <div style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '12px',
              lineHeight: '1.5',
              textAlign: 'center',
              fontWeight: '500',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ 
                marginBottom: '8px'
              }}>
                We ask for <strong style={{ 
                  color: '#8b5cf6'
                }}>3 different angles</strong> to maximize detection chances.
              </div>
              
              {/* Message box */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.15)',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                marginTop: '10px'
              }}>
                <div style={{
                  marginBottom: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ 
                    fontSize: '15px'
                  }}>🚀</span>
                  <strong>Your submissions help train our AI!</strong>
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  opacity: 0.85,
                  lineHeight: '1.4'
                }}>
                  Every capture fine-tunes the model towards 100% accuracy. <br/>Note: Model accuracy updated every month.
                   
                </div>
              </div>
            </div>

            {/* Version badge */}
            <div style={{
              marginTop: '10px',
              textAlign: 'center',
              fontSize: '9px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: '700',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              lineHeight: '1.3'
            }}>
              Model v1.1 • Training Active
            </div>
      </div>
    </div>

    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
    `}</style>
          </div>
    </div>
  )
}

export default Capture