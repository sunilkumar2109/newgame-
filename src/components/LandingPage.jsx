import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const videoList = ["/bg.mp4", "/bg1.mp4", "/bg2.mov", "/bg4.mp4"];

function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoList.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const createUserDataInFirestore = async (uid, email) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email,
        totalEarnings: 0,
        pendingRewards: 0,
        tasksCompleted: 0,
      });
    }
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        await createUserDataInFirestore(res.user.uid, res.user.email);
        alert(`Welcome ${res.user.displayName}`);
        navigate('/dashboard');
      })
      .catch(() => alert('Google Login Failed'));
  };

  const handleEmailLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        alert(`Logged in as ${user.user.email}`);
        navigate('/dashboard');
      })
      .catch((err) => alert('Email Login Failed: ' + err.message));
  };

  const handleEmailSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        await createUserDataInFirestore(user.user.uid, user.user.email);
        alert(`Account created for ${user.user.email}`);
        navigate('/dashboard');
      })
      .catch((err) => alert('Signup Failed: ' + err.message));
  };

  return (
    <div className="container">
      <video key={videoList[currentVideoIndex]} autoPlay loop muted className="bg-video">
        <source src={videoList[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="top-bar">
        <div className="logo">GamePro</div>
        <div className="auth-buttons">
          <button onClick={() => { setShowModal(true); setIsSignup(true); }}>Sign Up</button>
          <button onClick={() => { setShowModal(true); setIsSignup(false); }}>Login</button>
        </div>
      </div>

      <div className="center-text">
        <h1>Welcome to <span className="highlight">GameEarn</span></h1>
        <p>Play Games, Win Coins, and Level Up Your Earnings 🚀</p>
      </div>

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

export default LandingPage;
