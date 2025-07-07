import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXUluR3zaI5ha-bHBSB9ofqt6C6X3iLeg",
  authDomain: "webpage-86057.firebaseapp.com",
  projectId: "webpage-86057",
  storageBucket: "webpage-86057.firebasestorage.app",
  messagingSenderId: "847045982521",
  appId: "1:847045982521:web:2353e8d8002e9d1cd2d0e8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
