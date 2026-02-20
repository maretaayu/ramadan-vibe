import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBqaHnefPk7bwPXfmSUDMxS205CTGKxOuo",
    authDomain: "vibe-ramadan.firebaseapp.com",
    databaseURL: "https://vibe-ramadan-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vibe-ramadan",
    storageBucket: "vibe-ramadan.firebasestorage.app",
    messagingSenderId: "84542820244",
    appId: "1:84542820244:web:857bae90af6569c1e58981"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
