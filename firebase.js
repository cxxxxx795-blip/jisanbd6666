// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-gS6VRbVyn8njH8oLsQ6njayobuciC0",
  authDomain: "jisandbd6666.firebaseapp.com",
  projectId: "jisandbd6666",
  storageBucket: "jisandbd6666.firebasestorage.app",
  messagingSenderId: "171352567086",
  appId: "1:171352567086:web:459bcb1f68f458d92e9ebf"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);


// Export
export {
  app,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
};

console.log("Firebase connected successfully!");
