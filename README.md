# 🚗 CarQuest

A gamified car-spotting mobile application that transforms vehicle identification into an engaging collection experience. Spot cars in the real world, identify them with AI, and build your ultimate automotive collection.

## 🎯 Overview

CarQuest combines computer vision, machine learning, and game-inspired mechanics to create a unique car enthusiast platform. Users photograph vehicles they encounter, the app identifies them using advanced ML models, and successful captures trigger FIFA-style pack opening animations complete with rarity systems and collectible cards.

**Live Site:** [carquest.io](https://carquest.io)

## ✨ Key Features

### 🤖 AI-Powered Vehicle Recognition
- **Custom ML Model**: PyTorch-based convolutional neural network trained on automotive datasets with 50%+ validation accuracy
- **Intelligent Verification Flow**: AI suggestions with manual selection fallback when confidence is low
- **Real-time Processing**: Fast inference pipeline for immediate user feedback
- **250-Model Dataset**: Comprehensive training data covering diverse vehicle makes and models

### 🎮 Gamification & Animations
- **FIFA-Style Pack Opening**: Elaborate card reveal animations triggered after successful car captures
- **3D Card Flips**: Smooth WebGL-powered transitions with holographic effects
- **Rarity System**: Star-based ratings with dynamic particle effects and visual flourishes
- **Glitch Effects**: Cyberpunk-inspired UI elements and transitions
- **Responsive Animations**: 60fps performance across devices

### 📊 Social & Competition
- **Live Leaderboards**: Real-time rankings with API integration
- **Collection Tracking**: Personal garage with capture statistics
- **User Profiles**: Customizable profiles with achievement systems

### 🎨 Modern UI/UX
- **Clean, Modern Design**: Video game-inspired interface with polished aesthetics
- **Advanced React Components**: Modular, reusable component architecture
- **Responsive Layout**: Mobile-first design that scales beautifully
- **Interactive Elements**: Floating animations, 3D visualizations, and smooth transitions

## 🏗️ Tech Stack

### Frontend
- **React**: Component-based UI with hooks and modern patterns
- **CSS3 & Animations**: Custom keyframes, transforms, and particle systems
- **WebGL/3D Effects**: Hardware-accelerated graphics for pack openings

### Backend
- **FastAPI**: High-performance Python API framework
- **PyTorch**: Deep learning model inference
- **MongoDB**: NoSQL database for flexible data storage
- **Argon2**: Industry-leading password hashing algorithm

### Infrastructure
- **Cloudflare**: CDN, DDoS protection, and security layer
- **Cloud Hosting**: Scalable deployment architecture

## 🔒 Security Measures

CarQuest takes security seriously with enterprise-grade protection at every layer of the application.

### Authentication & Password Security
- **Argon2 Password Hashing**: Implementation of Argon2id, the winner of the Password Hashing Competition and recommended by OWASP
  - **Memory-hard algorithm**: Resistant to GPU-based cracking attempts
  - **Configurable parameters**: Tuned time cost, memory cost, and parallelism for optimal security
  - **Salt generation**: Cryptographically secure random salts for each password
  - **Future-proof**: Designed to resist both current and emerging attack vectors
- **No Plaintext Storage**: Passwords are never stored or logged in readable form
- **Secure Session Management**: Token-based authentication with expiration policies

### Application Security
- **Input Validation**: Comprehensive sanitization of all user inputs and file uploads
- **SQL/NoSQL Injection Prevention**: Parameterized queries and input validation
- **Rate Limiting**: API throttling to prevent brute force attacks and abuse
- **Image Processing Security**: Server-side validation and sanitization of uploaded photos
- **XSS Protection**: Content Security Policy headers and output encoding

### Infrastructure Security
- **Cloudflare Protection**: 
  - DDoS mitigation with automatic attack detection
  - WAF (Web Application Firewall) rules
  - Bot management and challenge pages
  - SSL/TLS encryption for all traffic
- **API Security**: 
  - CORS policies configured for legitimate origins only
  - JWT tokens for authenticated requests
  - Environment variable management for secrets
  - API key rotation policies
- **Database Security**: 
  - Encrypted connections (TLS/SSL)
  - Role-based access control
  - Regular automated backups
  - Network isolation

### Privacy & Data Protection
- **Data Minimization**: Only essential user data collected
- **Secure Credential Storage**: All sensitive information encrypted at rest
- **No PII in Logs**: Careful logging practices to protect user privacy
- **HTTPS Enforcement**: All connections encrypted in transit

**Why Argon2 Matters**: In an era where data breaches are common, password security is critical. Unlike older algorithms like bcrypt or MD5, Argon2 is specifically designed to be memory-intensive, making it exponentially more expensive for attackers to crack passwords even with specialized hardware. This investment in proper cryptography demonstrates a commitment to user security that goes beyond basic compliance.

## 🚀 Machine Learning Model

The custom PyTorch model uses a convolutional neural network architecture specifically tuned for vehicle classification:

- **Training Data**: Curated automotive image datasets covering 250+ vehicle models
- **Architecture**: Multi-layer CNN with dropout for regularization
- **Performance**: 50%+ validation accuracy across diverse vehicle types
- **Inference**: Optimized for mobile-friendly response times
- **Continuous Improvement**: Model versioning system for iterative enhancements

## 🎨 Notable Technical Achievements

### Pack Opening Animation System
One of CarQuest's standout features is the FIFA-inspired pack opening experience:
- Multi-stage reveal sequence with suspense-building delays
- Dynamic rarity calculation affecting visual presentation
- Particle systems synchronized with card reveals
- Holographic shader effects on high-rarity cards
- Smooth state transitions between capture → verification → reward

### About Page
A fully interactive showcase featuring:
- Live API integration pulling real leaderboard data
- Floating 3D tech stack visualization
- Holographic logo with glitch effects
- Responsive grid layout with animated components
- Complete product narrative and feature breakdown

## 📱 User Flow

1. **Spot**: User photographs a vehicle in the real world
2. **Upload**: Image sent to backend for processing
3. **Identify**: ML model analyzes image and suggests vehicle make/model
4. **Verify**: User confirms or selects correct identification
5. **Reveal**: Pack opening animation triggers with rarity-based effects
6. **Collect**: Vehicle added to personal garage and leaderboard updated

## 🌟 Future Roadmap

- Enhanced ML model with deeper vehicle variant recognition
- Social features: friend lists and shared collections
- Achievement system with unlockable rewards
- Augmented reality viewfinder for real-time identification
- Community challenges and limited-time events

## 👤 Author

Built by Daniel Deda - [GitHub](https://github.com/danieldeda2)

---

*CarQuest: Where every walk becomes an adventure.* 🏁
