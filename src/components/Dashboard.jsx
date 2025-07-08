import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
// import backgroundImage from './image_36d7c2.png'; // Removed the image import
/* global __app_id, __firebase_config, __initial_auth_token */

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // State to manage internal views: 'dashboard', 'refer-earn', 'withdraw', 'rewards'
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation to get current path

  useEffect(() => {
    // Initialize Firebase
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

    let app;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    const firestoreDb = getFirestore(app);
    const firebaseAuth = getAuth(app);

    setDb(firestoreDb);
    setAuth(firebaseAuth);

    // Sign in and listen for auth state changes
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const docRef = doc(firestoreDb, `artifacts/${appId}/users/${user.uid}/user_data`, 'profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No user data found! Creating default data.');
          // Create default user data if none exists
          const defaultData = {
            coins: 0,
            balance: 0,
            totalEarnings: 0,
            pendingRewards: 0,
            completedTasks: 0,
            weeklyGoal: 10,
            level: 1,
          };
          await setDoc(docRef, defaultData);
          setUserData(defaultData);
        }
        setLoading(false);
      } else {
        // Sign in anonymously if no user is logged in
        if (typeof __initial_auth_token !== 'undefined') {
          await signInWithCustomToken(firebaseAuth, __initial_auth_token);
        } else {
          await signInAnonymously(firebaseAuth);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading || !userData) {
    return <div className="loading">Loading Dashboard...</div>;
  }

  const {
    coins,
    balance,
    totalEarnings,
    pendingRewards,
    completedTasks,
    weeklyGoal,
    level,
  } = userData;

  const progress = Math.min((completedTasks / weeklyGoal) * 100, 100);

  // Function to handle sidebar navigation clicks
  const handleNavigationClick = (view) => {
    if (view === 'logout') {
      // Handle logout logic
      if (auth) {
        signOut(auth).then(() => {
          setUserData(null);
          setUserId(null);
          setLoading(true);
          console.log('User logged out');
          navigate('/'); // Navigate to landing page after logout
        }).catch((error) => {
          console.error("Error signing out: ", error);
        });
      }
    } else if (view === 'support') {
      navigate('/SupportPage'); // Navigate to the SupportPage route
    } else if (view === 'settings') {
      navigate('/profile'); // Navigate to the Profile page (assuming settings is profile)
    }
    else {
      setCurrentView(view); // For internal dashboard views
    }
  };

  // Render content based on currentView
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="topbar">
              <h1>Dashboard</h1>
              <div className="actions">
                {/* Buttons were here, now they are removed */}
              </div>
            </div>

            <div className="stats">
              <div className="stat-box">
                <strong>Coins</strong>
                <span>{coins}</span>
              </div>
              <div className="stat-box">
                <strong>Balance</strong>
                <span>₹{balance}</span>
              </div>
              <div className="stat-box">
                <strong>Total Earnings</strong>
                <span>₹{totalEarnings}</span>
              </div>
              <div className="stat-box">
                <strong>Pending Rewards</strong>
                <span>₹{pendingRewards}</span>
              </div>
              <div className="stat-box">
                <strong>Tasks Completed</strong>
                <span>{completedTasks}</span>
              </div>
              <div className="stat-box">
                <strong>Level</strong>
                <span>{level}</span>
              </div>
            </div>

            <div className="progress-section">
              <h2>Weekly Goal Progress</h2>
              <div className="progress-bar">
                <div style={{ width: `${progress}%` }}></div>
              </div>
              <p className="milestone">{completedTasks} of {weeklyGoal} tasks completed</p>
            </div>
          </>
        );
      case 'refer-earn':
        return (
          <div>
            <h1>Refer & Earn</h1>
            <p>Refer your friends and earn rewards!</p>
            {/* Add refer & earn specific content here */}
          </div>
        );
      case 'withdraw':
        return (
          <div>
            <h1>Withdrawal Details</h1>
            <p>Here you can manage your withdrawals.</p>
            <div className="stats" style={{ marginTop: '2rem' }}> {/* Reusing stats class for layout */}
              <div className="stat-box">
                <strong>Total Coins</strong>
                <span>{coins}</span>
              </div>
              <div className="stat-box">
                <strong>Current Balance</strong>
                <span>₹{balance}</span>
              </div>
            </div>
            {/* Add more withdrawal options/form here */}
          </div>
        );
      case 'rewards':
        return (
          <div>
            <h1>Your Rewards</h1>
            <p>Here are the rewards you've earned:</p>
            <ul className="rewards-list">
              <li className="reward-item">
                <strong>Reward 1:</strong> 100 Bonus Coins (Completed 5 tasks)
              </li>
              <li className="reward-item">
                <strong>Reward 2:</strong> ₹50 Cash Bonus (Reached Level 2)
              </li>
              <li className="reward-item">
                <strong>Reward 3:</strong> Exclusive Game Access (Referral Bonus)
              </li>
              {/* Add more rewards dynamically based on user data if available */}
              {userData.level >= 5 && (
                <li className="reward-item">
                  <strong>Level 5 Bonus:</strong> Special Avatar Unlock
                </li>
              )}
            </ul>
            {/* Content for rewards based on user progress/achievements */}
          </div>
        );
      default: // No default case for 'support', 'settings', 'logged-out' as they will navigate
        return null;
    }
  };

  return (
    <div className="dashboard-wrapper"> {/* Removed inline style for background image */}
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Game<span>Pro</span></div>
        <ul>
          <li className={currentView === 'dashboard' ? 'active' : ''} onClick={() => handleNavigationClick('dashboard')}>Dashboard</li>
          {/* Removed 'Games' from here */}
          <li className={currentView === 'refer-earn' ? 'active' : ''} onClick={() => handleNavigationClick('refer-earn')}>Refer & Earn</li>
          <li className={currentView === 'withdraw' ? 'active' : ''} onClick={() => handleNavigationClick('withdraw')}>Withdraw</li>
          <li className={currentView === 'rewards' ? 'active' : ''} onClick={() => handleNavigationClick('rewards')}>Rewards</li>
          {/* New Support button with active state based on route */}
          <li className={location.pathname === '/support' ? 'active' : ''} onClick={() => handleNavigationClick('support')}>
            Support
          </li>
        </ul>
        <div className="bottom-links">
          {/* Settings link with active state based on route */}
          <span className={location.pathname === '/profile' ? 'active' : ''} onClick={() => handleNavigationClick('settings')}>Settings</span>
          <span className={location.pathname === '/' && !userId ? 'active' : ''} onClick={() => handleNavigationClick('logout')}>Logout</span>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-main">
        {renderContent()}
        {userId && location.pathname !== '/' && <p style={{ textAlign: 'center', marginTop: '20px', color: '#777' }}>User ID: {userId}</p>}
      </main>
    </div>
  );
}
