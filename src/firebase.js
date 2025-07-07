// firebase.js
// This file sets up your Firebase project.
// IMPORTANT: Replace with your actual Firebase project configuration.

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; // Removed signInWithCustomToken and signInAnonymously imports
import { getFirestore } from 'firebase/firestore';

// The __firebase_config and __app_id are provided by the Canvas environment.
// If running locally, you'll need to hardcode your Firebase config here.
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
        apiKey: "AIzaSyAXUluR3zaI5ha-bHBSB9ofqt6C6X3iLeg",
        authDomain: "webpage-86057.firebaseapp.com",
        projectId: "webpage-86057",
        storageBucket: "webpage-86057.firebasestorage.app",
        messagingSenderId: "847045982521",
        appId: "1:847045982521:web:2353e8d8002e9d1cd2d0e8"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

// Export auth and provider for use in other components
export { auth, provider, db };

// Removed the direct authentication calls from here.
// Initial authentication is now handled in App.js's useEffect.