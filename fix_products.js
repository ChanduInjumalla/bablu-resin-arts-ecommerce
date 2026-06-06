import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, writeBatch, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyB...",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "ecommerce-c3501",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123...",
};

// we need to get the real config from src/firebase/config.js
