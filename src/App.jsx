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
      .then((res) => {
        alert(`Welcome ${res.user.displayName}`);
      })
      .catch((err) => alert('Google Login Failed'));
  };

  const handleEmailLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert(`Logged in as ${userCredential.user.email}`);
      })
      .catch((err) => alert('Email Login Failed: ' + err.message));
  };

  const handleEmailSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert(`Account created for ${userCredential.user.email}`);
      })
      .catch((err) => alert('Signup Failed: ' + err.message));
  };

  return (
    <div className="app">
      <video autoPlay loop muted className="bgVideo">
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="content">
        <h1>Welcome to GameEarn</h1>
        <p>Pay and Play Games – Win Real Coins 💰</p>

        <div className="auth-box">
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
          <div className="button-row">
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
