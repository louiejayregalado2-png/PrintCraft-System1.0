// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyC-iMbf7wSvFYUjk38lJCvcgIW9zXx_Zn4",

    authDomain: "printcraft-system-8d4cf.firebaseapp.com",

    projectId: "printcraft-system-8d4cf",

    storageBucket: "printcraft-system-8d4cf.firebasestorage.app",

    messagingSenderId: "615909078263",

    appId: "1:615909078263:web:0abc614d2519101e958ff2"

};

// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ==========================================
// EXPORT
// ==========================================

export {

    db,

    collection,

    addDoc,

    getDocs,

    getDoc,

    updateDoc,

    deleteDoc,

    doc,

    onSnapshot,

    query,

    where,

    orderBy,

    limit

};

console.log("✅ Firebase Connected");