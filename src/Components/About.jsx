import './About.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../Assets/CarQuestLogo.png'

const About = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeHunters, setActiveHunters] = useState('10K+');
  const [carsCaptured, setCarsCaptured] = useState('500K+');
  const blockRefs = useRef([]);
  const contentRef = useRef(null);
  const mlVisualizationRef = useRef(null);

  let navigate = useNavigate();

  // Fetch leaderboard stats
  useEffect(() => {
    const fetchLeaderboardStats = async () => {
      try {
        const response = await fetch('https://api.carquest.io/leaderboard');
        const data = await response.json();
        
        if (data.leaderboard && data.total_users) {
          // Set active hunters
          const totalUsers = data.total_users;
          setActiveHunters(formatNumber(totalUsers));
          
          // Calculate total points and estimate cars captured
          const totalPoints = data.leaderboard.reduce((sum, user) => sum + user.points, 0);
          // Average car value: ~5000 points (estimated from your car database)
          const avgCarValue = 5000;
          const estimatedCars = Math.floor(totalPoints / avgCarValue);
          setCarsCaptured(formatNumber(estimatedCars));
        }
      } catch (error) {
        console.error('Error fetching leaderboard stats:', error);
        // Keep default values on error
      }
    };

    fetchLeaderboardStats();
  }, []);

  // Format numbers (1000 -> 1K, 1000000 -> 1M)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.?0+$/, '') + 'K';
    }
    return num.toString();
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    blockRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      blockRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        const scrollHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setScrollProgress(progress || 0);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Feature carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toHome = () => {
    let path = '/';
    navigate(path);
  };

  const features = [
    { icon: '📸', title: '1. Capture Image', color: '#ddeecc' },
    { icon: '🤖', title: '2. A.I. Verifies', color: '#328fda' },
    { icon: '🏆', title: '3. Collect Points', color: '#fbbf24' },
    { icon: '🎯', title: '4. Daily Quests', color: '#34fb22' }
  ];

  return (
    <div className="container_about">
      {/* Animated Background Elements */}
      <div className="bg-gradient-1_about"></div>
      <div className="bg-gradient-2_about"></div>
      <div className="particles_about">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle_about"></div>
        ))}
      </div>

      {/* Grid overlay for futuristic feel */}
      <div className="grid-overlay_about"></div>

      {/* Content Area */}
      <div className="content_about" ref={contentRef}>
        
        {/* ===== HERO SECTION ===== */}
        <div className="hero-section_about">
          {/* Animated Logo with Holographic Effect */}
          <div className="logo-container_about">
            <div className="logo-glow_about"></div>
            <div className="logo-rings_about">
              <div className="ring_about ring-1_about"></div>
              <div className="ring_about ring-2_about"></div>
              <div className="ring_about ring-3_about"></div>
            </div>
            <img src={Logo} alt="CarQuest Logo" onClick={toHome} className="logo-main_about"/>
          </div>

          {/* Main Title with Glitch Effect */}
          <div className="title_about">
            <h1 className="glitch_about" data-text="CARQUEST">CARQUEST</h1>
            <div className="subtitle-hero_about">THE FUTURE OF CAR SPOTTING</div>
          </div>

          {/* Epic 3D Process Circle */}
          <div className="process-circle_about">
            <div className="circle-track_about">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`process-node_about node-${index + 1}_about ${activeFeature === index ? 'active' : ''}`}
                  style={{ 
                    '--node-color': feature.color,
                    '--rotation': `${index * 90}deg`
                  }}
                >
                  <div className="node-glow_about"></div>
                  <div className="node-content_about">
                    <span className="node-icon_about">{feature.icon}</span>
                  </div>
                  <div className="node-label_about">{feature.title}</div>
                </div>
              ))}
              
              {/* Connecting Lines */}
              <svg className="connection-lines_about" viewBox="0 0 200 200">
                <circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  fill="none" 
                  stroke="url(#gradient1)" 
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="rotating-circle_about"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#a62efb', stopOpacity: 0.8}} />
                    <stop offset="50%" style={{stopColor: '#3b82f6', stopOpacity: 0.6}} />
                    <stop offset="100%" style={{stopColor: '#fbbf24', stopOpacity: 0.8}} />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center Pulse */}
              <div className="center-pulse_about">
                <div className="pulse-ring_about"></div>
                <div className="pulse-core_about">
                  <span className="core-icon_about">⚡</span>
                </div>
              </div>

              {/* Active Beam */}
              <div className="active-beam_about" style={{
                '--beam-rotation': `${activeFeature * 90}deg`
              }}></div>
            </div>
          </div>
        </div>

        {/* ===== ML VISUALIZATION SECTION ===== */}
        <div className="ml-section_about" ref={(el) => (blockRefs.current[0] = el)}>
          <h2 className="section-title_about">
            <span className="title-icon_about">🤖</span>
            HOW IT WORKS
            <span className="title-icon_about">⚡</span>
          </h2>

          <div className="ml-visualization_about" ref={mlVisualizationRef}>
            {/* Step 1: Capture */}
            <div className="ml-step_about step-1_about">
              <div className="step-number_about">01</div>
              <div className="step-content_about">
                <div className="phone-mockup_about">
                  <div className="phone-screen_about">
                    <div className="camera-viewfinder_about">
                      <div className="scan-line_about"></div>
                      <div className="corner-bracket_about tl_about"></div>
                      <div className="corner-bracket_about tr_about"></div>
                      <div className="corner-bracket_about bl_about"></div>
                      <div className="corner-bracket_about br_about"></div>
                      <div className="car-silhouette_about">🚗</div>
                    </div>
                  </div>
                  <div className="phone-button_about"></div>
                </div>
                <div className="step-label_about">
                  <div className="label-title_about">CAPTURE</div>
                  <div className="label-desc_about">Snap a photo of any car</div>
                </div>
              </div>
            </div>

            {/* Animated Arrow */}
            <div className="ml-arrow_about">
              <div className="arrow-line_about"></div>
              <div className="arrow-head_about">→</div>
              <div className="data-particles_about">
                <span>01</span>
                <span>10</span>
                <span>11</span>
              </div>
            </div>

            {/* Step 2: AI Processing */}
            <div className="ml-step_about step-2_about">
              <div className="step-number_about">02</div>
              <div className="step-content_about">
                <div className="ai-brain_about">
                  <div className="brain-core_about">
                    <div className="core-pulse_about"></div>
                    <span className="brain-icon_about">🧠</span>
                  </div>
                  <div className="neural-network_about">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="neural-line_about" style={{
                        '--delay': `${i * 0.1}s`,
                        '--rotation': `${i * 30}deg`
                      }}></div>
                    ))}
                  </div>
                  <div className="processing-text_about">
                    <span className="processing-dot_about">.</span>
                    <span className="processing-dot_about">.</span>
                    <span className="processing-dot_about">.</span>
                  </div>
                </div>
                <div className="step-label_about">
                  <div className="label-title_about">AI PROCESSING</div>
                  <div className="label-desc_about">Neural network analysis</div>
                </div>
              </div>
            </div>

            {/* Animated Arrow */}
            <div className="ml-arrow_about">
              <div className="arrow-line_about"></div>
              <div className="arrow-head_about">→</div>
              <div className="data-particles_about">
                <span>BMW</span>
                <span>M5</span>
                <span>✓</span>
              </div>
            </div>

            {/* Step 3: Result */}
            <div className="ml-step_about step-3_about">
              <div className="step-number_about">03</div>
              <div className="step-content_about">
                <div className="result-card_about">
                  <div className="card-shine_about"></div>
                  <div className="card-content_about">
                    <div className="car-emoji_about">🏎️</div>
                    <div className="car-name_about">BMW M5</div>
                    <div className="points-badge_about">
                      <span className="plus_about">+</span>
                      <span className="points_about">2,300</span>
                      <span className="pts_about">PTS</span>
                    </div>
                  </div>
                  <div className="card-sparkles_about">
                    <span>✨</span>
                    <span>✨</span>
                    <span>✨</span>
                  </div>
                </div>
                <div className="step-label_about">
                  <div className="label-title_about">COLLECTED!</div>
                  <div className="label-desc_about">Added to your garage</div>
                </div>
              </div>
            </div>
          </div>

          {/* ML Stats */}
          <div className="ml-stats_about">
            <div className="stat-item_about">
              <div className="stat-number_about">51.54%</div>
              <div className="stat-label_about">Model Accuracy</div>
            </div>
            <div className="stat-divider_about"></div>
            <div className="stat-item_about">
              <div className="stat-number_about">237</div>
              <div className="stat-label_about">Car Models</div>
            </div>
            <div className="stat-divider_about"></div>
            <div className="stat-item_about">
              <div className="stat-number_about">&lt;2s</div>
              <div className="stat-label_about">Recognition Time</div>
            </div>
          </div>
        </div>

        {/* ===== FEATURES GRID ===== */}
        <div className="features-grid_about" ref={(el) => (blockRefs.current[1] = el)}>
          
          {/* Feature 1: Capture */}
          <div className="feature-card_about">
            <div className="feature-icon-large_about">📸</div>
            <h3 className="feature-title_about">INSTANT CAPTURE</h3>
            <p className="feature-desc_about">
              See a rare car? Snap it instantly. Our AI identifies it in real-time with cutting-edge machine learning.
            </p>
            <div className="feature-tech_about">
              <span className="tech-badge_about">EfficientNet V2</span>
              <span className="tech-badge_about">Custom Dataset</span>
            </div>
          </div>

          {/* Feature 2: Collection */}
          <div className="feature-card_about">
            <div className="feature-icon-large_about">🏆</div>
            <h3 className="feature-title_about">BUILD YOUR GARAGE</h3>
            <p className="feature-desc_about">
              From common sedans to legendary hypercars. Collect all 237 models across 39 manufacturers.
            </p>
            <div className="rarity-showcase_about">
              <span className="rarity_about common_about">⭐ Common</span>
              <span className="rarity_about rare_about">⭐⭐ Rare/Epic</span>
              <span className="rarity_about legendary_about">⭐⭐⭐ Legendary</span>
            </div>
          </div>

          {/* Feature 3: Compete */}
          <div className="feature-card_about">
            <div className="feature-icon-large_about">🔥</div>
            <h3 className="feature-title_about">GLOBAL LEADERBOARD</h3>
            <p className="feature-desc_about">
              Compete with car spotters worldwide. Climb the ranks and prove you're the ultimate enthusiast.
            </p>
            <div className="leaderboard-preview_about">
              <div className="lb-row_about gold_about">
                <span className="lb-rank_about">1</span>
                <span className="lb-name_about">Bmw_is_for_me_123</span>
                <span className="lb-points_about">450K</span>
              </div>
              <div className="lb-row_about silver_about">
                <span className="lb-rank_about">2</span>
                <span className="lb-name_about">CarHunter</span>
                <span className="lb-points_about">387K</span>
              </div>
              <div className="lb-row_about bronze_about">
                <span className="lb-rank_about">3</span>
                <span className="lb-name_about">AutoSpot</span>
                <span className="lb-points_about">312K</span>
              </div>
            </div>
          </div>

          {/* Feature 4: Rewards */}
          <div className="feature-card_about">
            <div className="feature-icon-large_about">💎</div>
            <h3 className="feature-title_about">EPIC REWARDS</h3>
            <p className="feature-desc_about">
              Spot a Bugatti Chiron? That's 185,000 points. Find a McLaren F1? 180,000 points instantly.
            </p>
            <div className="points-examples_about">
              <div className="points-example_about">
                <span className="ex-car_about">Bugatti Chiron</span>
                <span className="ex-points_about">185K</span>
              </div>
              <div className="points-example_about">
                <span className="ex-car_about">McLaren F1</span>
                <span className="ex-points_about">180K</span>
              </div>
            </div>
          </div>

        </div>

        {/* ===== TECH STACK SHOWCASE ===== */}
        <div className="tech-section_about" ref={(el) => (blockRefs.current[2] = el)}>
          <h2 className="section-title_about">
            <span className="title-icon_about">⚙️</span>
            POWERED BY CUTTING-EDGE TECH
            <span className="title-icon_about">🚀</span>
          </h2>

          <div className="tech-grid_about">
            <div className="tech-item_about">
              <div className="tech-logo_about react-logo_about">⚛️</div>
              <div className="tech-name_about">React</div>
            </div>
            <div className="tech-item_about">
              <div className="tech-logo_about">🐍</div>
              <div className="tech-name_about">FastAPI</div>
            </div>
            <div className="tech-item_about">
              <div className="tech-logo_about">🔥</div>
              <div className="tech-name_about">PyTorch</div>
            </div>
            <div className="tech-item_about">
              <div className="tech-logo_about database-logo_about">🗄️</div>
              <div className="tech-name_about">MongoDB</div>
            </div>
            <div className="tech-item_about">
              <div className="tech-logo_about argon-logo_about">🔐</div>
              <div className="tech-name_about">Argon2</div>
            </div>
            <div className="tech-item_about">
              <div className="tech-logo_about ml-logo_about">⚡</div>
              <div className="tech-name_about">ML Model</div>
            </div>
          </div>
        </div>

        {/* ===== COMMUNITY CTA ===== */}
        <div className="cta-section_about" ref={(el) => (blockRefs.current[3] = el)}>
          <div className="cta-content_about">
            <div className="cta-badge_about">
              <span className="badge-pulse_about"></span>
              JOIN THE HUNT
            </div>
            <h2 className="cta-title_about">Ready to Start Your Journey?</h2>
            <p className="cta-desc_about">
              Transform every street into a showroom. Turn every drive into an adventure.
              The world's most incredible cars are waiting to be discovered.
            </p>
            <button className="cta-button_about" onClick={toHome}>
              <span className="button-shine_about"></span>
              <span className="button-text_about">START SPOTTING</span>
              <span className="button-arrow_about">→</span>
            </button>
            
            {/* Stats Counter */}
            <div className="cta-stats_about">
              <div className="cta-stat_about">
                <div className="cta-stat-number_about">{activeHunters}</div>
                <div className="cta-stat-label_about">Active Hunters</div>
              </div>
              <div className="cta-stat_about">
                <div className="cta-stat-number_about">{carsCaptured}</div>
                <div className="cta-stat-label_about">Cars Captured</div>
              </div>
              <div className="cta-stat_about">
                <div className="cta-stat-number_about">237</div>
                <div className="cta-stat-label_about">Models Available</div>
              </div>
            </div>
          </div>

          {/* Floating Cars Animation */}
          <div className="floating-cars_about">
            <div className="float-car_about" style={{'--delay': '0s'}}>🏎️</div>
            <div className="float-car_about" style={{'--delay': '0.5s'}}>🚗</div>
            <div className="float-car_about" style={{'--delay': '1s'}}>🚙</div>
            <div className="float-car_about" style={{'--delay': '1.5s'}}>🏁</div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div style={{ height: '20px' }}></div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="scroll-progress-container_about">
        <div 
          className="scroll-progress-bar_about" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default About;