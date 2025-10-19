import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, query, where, getDocs, serverTimestamp, deleteDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
const firebaseConfig = { 
    apiKey: "AIzaSyAGzPA5b5P1NofFZtbBvGpuYE3tVR-JaS0", 
    authDomain: "pfdsuaaug.firebaseapp.com", 
    projectId: "pfdsuaaug", 
    storageBucket: "pfdsuaaug.firebasestorage.app", 
    messagingSenderId: "701797222900", 
    appId: "1:701797222900:web:01836d45db1b35be2bd1a1" 
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { 
    db, 
    auth, 
    googleProvider, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    query, 
    where, 
    getDocs, 
    serverTimestamp, 
    deleteDoc, 
    updateDoc, 
    increment,
    signInWithPopup,
    signOut,
    onAuthStateChanged
};