import React from 'react';
import './components/LandingPage.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import DashboardPage from './components/Dashboard';
import Profile from './components/profile';
import SupportPage from './components/SupportPage'; // Import the Support component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/SupportPage" element={<SupportPage/>} /> {/* Add route for SupportPage */}
      </Routes>
    </Router>
  );
}

export default App;
