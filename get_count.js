const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'fake',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'ecommerce-c3501'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function count() {
  const snap = await getDocs(collection(db, 'products'));
  console.log("Products in Firestore:", snap.size);
}

count().catch(console.error);
