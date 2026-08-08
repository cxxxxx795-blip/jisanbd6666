import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyB-gS6vRbVyfMn8jH8oLsQ6njayobuCic0",
  authDomain: "jisanbd6666.firebaseapp.com",
  projectId: "jisanbd6666",
  storageBucket: "jisanbd6666.firebasestorage.app",
  messagingSenderId: "171352567086",
  appId: "1:171352567086:web:459bcb1f68f458d92e9ebf",
  measurementId: "G-81W9M2V8YZ"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export {
  auth,
  db,

  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,

  doc,
  setDoc,

  collection,
  addDoc,
  serverTimestamp
};
