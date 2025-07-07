import React, { useState, useEffect } from 'react';
import './App.css';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, provider } from './firebase';

const videos = ['/bg.mp4', '/bg1.mp4','/bg2.mov']; // ✅ video list

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(0);

  // ✅ Cycle videos every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((res) => alert(`Welcome ${res.user.displayName}`))
      .catch(() => alert('Google Login Failed'));
  };

  const handleEmailLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => alert(`Logged in as ${user.user.email}`))
      .catch((err) => alert('Email Login Failed: ' + err.message));
  };

  const handleEmailSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => alert(`Account created for ${user.user.email}`))
      .catch((err) => alert('Signup Failed: ' + err.message));
  };

  return (
    <div className="container">
      {/* 🎥 Background Video */}
      <video key={videos[currentVideo]} autoPlay loop muted className="bg-video">
        <source src={videos[currentVideo]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔝 Top Bar */}
      <div className="top-bar">
        <div className="logo">GamePro</div>
        <div className="auth-buttons">
          <button onClick={() => { setShowModal(true); setIsSignup(true); }}>Sign Up</button>
          <button onClick={() => { setShowModal(true); setIsSignup(false); }}>Login</button>
        </div>
      </div>

      {/* 📣 Welcome Text */}
      <div className="center-text">
        <h1>Welcome to <span className="highlight">GameEarn</span></h1>
        <p>Play Games, Win Coins, and Level Up Your Earnings 🚀</p>
      </div>

      {/* 💬 Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="buttons">
              {isSignup ? (
                <button onClick={handleEmailSignup}>Create Account</button>
              ) : (
                <button onClick={handleEmailLogin}>Login</button>
              )}
              <button onClick={handleGoogleLogin}>Login with Google</button>
            </div>
            <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
          </div>
        </div>
      )}
    </div>
    
       
    

  );
}

export default App;
