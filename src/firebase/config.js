import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE these placeholders with your actual Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyBpDg4vjTIy95ag8-kti2kSvl38q5PRhq4",
  authDomain: "babluresinarts-69d80.firebaseapp.com",
  projectId: "babluresinarts-69d80",
  storageBucket: "babluresinarts-69d80.firebasestorage.app",
  messagingSenderId: "333414279373",
  appId: "1:333414279373:web:4cd697f48297788cff6184",
  measurementId: "G-PWJHQV5QSY"
};

// Initialize Firebase only if config is provided to avoid crashing the app immediately
let app;
let auth;
let provider;
let db;

try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase initialization error", error);
}

export { auth, provider, db };
