import './About.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../Assets/CarQuestLogo.png'

const About = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const blockRefs = useRef([]);
  const contentRef = useRef(null);

  let navigate = useNavigate();

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
      // Initial calculation
      handleScroll();
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const toHome = () => {
    let path = '/';
    navigate(path);
  };

  return (
    <div className="container_about">
      {/* Animated Background Elements */}
      <div className="bg-gradient-1_about"></div>
      <div className="bg-gradient-2_about"></div>
      <div className="particles_about">
        <div className="particle_about"></div>
        <div className="particle_about"></div>
        <div className="particle_about"></div>
        <div className="particle_about"></div>
        <div className="particle_about"></div>
      </div>

      {/* Content Area */}
      <div className="content_about" ref={contentRef}>
        {/* Large Logo */}
        <div className="logo-large_about">
          <img src={Logo} alt="CarQuest Logo" onClick={toHome}/>
        </div>

        {/* Title */}
        <div className="title_about">
          <h1>ABOUT CARQUEST</h1>
        </div>

        {/* Description */}
        <div className="description_about">
          <div className="desc-block_about" ref={(el) => (blockRefs.current[0] = el)}>
            <h2 className="section-title_about">🚗 The Ultimate Car Spotting Adventure</h2>
            <p>
              Welcome to <span className="highlight_about">CarQuest</span>, where every drive becomes an epic treasure hunt! 
              Transform your daily commute into an exciting adventure as you spot, capture, and collect the world's most incredible automobiles.
            </p>
          </div>

          <div className="desc-block_about" ref={(el) => (blockRefs.current[1] = el)}>
            <h2 className="section-title_about">📸 Capture & Collect</h2>
            <p>
              See a rare supercar? A classic beauty? A legendary beast? Snap a photo and add it to your personal garage! 
              Every car you capture earns you valuable points. The rarer the vehicle, the bigger the reward.
            </p>
            <p className="sub-text_about">
              From everyday commuters to million-dollar hypercars — build your ultimate collection spanning 39 manufacturers 
              and over 230 iconic models.
            </p>
          </div>

          <div className="desc-block_about" ref={(el) => (blockRefs.current[2] = el)}>
            <h2 className="section-title_about">⭐ Legendary Rarities</h2>
            <p>
              Not all cars are created equal. Common models might earn you a few hundred points, but spot a 
              <span className="legendary_about"> McLaren F1</span>, 
              <span className="legendary_about"> Bugatti Chiron</span>, or 
              <span className="legendary_about"> Koenigsegg Jesko</span>? 
              You're looking at <span className="points_about">200,000+ points</span> instantly added to your profile!
            </p>
          </div>

          <div className="desc-block_about" ref={(el) => (blockRefs.current[3] = el)}>
            <h2 className="section-title_about">🎯 Daily Quests</h2>
            <p>
              Take on exciting daily challenges that put your spotting skills to the test! Complete quests to unlock 
              <span className="multiplier_about"> 2x point multipliers</span> and accelerate your climb to the top.
            </p>
            <p className="sub-text_about">
              Will you chase German luxury? Hunt for Italian exotics? Or track down legendary JDM classics? 
              Every day brings new missions and new opportunities.
            </p>
          </div>

          <div className="desc-block_about" ref={(el) => (blockRefs.current[4] = el)}>
            <h2 className="section-title_about">🏆 Rise to the Top</h2>
            <p>
              Compete with spotters from around the world on our global leaderboard. Showcase your impressive garage, 
              share your legendary catches, and prove you're the ultimate car enthusiast.
            </p>
            <p className="sub-text_about">
              Your profile displays your total points, collected cars, and all the amazing photos you've captured on your journey.
            </p>
          </div>

          <div className="desc-block_about" ref={(el) => (blockRefs.current[5] = el)}>
            <h2 className="section-title_about">🌟 Join the Community</h2>
            <p>
              Whether you're a casual car lover or a hardcore gearhead, CarQuest turns every street into a showroom 
              and every sighting into an achievement. The hunt never stops, and the collection never ends.
            </p>
            <p className="cta_about">
              Ready to start your journey? The road is waiting.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar - Bottom */}
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