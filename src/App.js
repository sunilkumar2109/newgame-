import React, { useState } from 'react';
import './App.css';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, provider } from './firebase';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((res) => alert(`Welcome ${res.user.displayName}`))
      .catch((err) => alert('Google Login Failed'));
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
      <video autoPlay muted loop className="bg-video">
        <source src="bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay">
        <h1>Welcome to <span className="brand">GameEarn</span></h1>
        <p>Pay and Play Games – Win Real Coins 💰</p>

        <div className="login-box">
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
            <button onClick={handleEmailSignup}>Sign Up</button>
            <button onClick={handleEmailLogin}>Login</button>
          </div>
          <p>OR</p>
          <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
      </div>
    </div>

  );
}

export default App;
