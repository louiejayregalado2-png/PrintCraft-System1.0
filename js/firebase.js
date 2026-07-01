// Firebase Configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {

getFirestore,

collection,

doc,

addDoc,

setDoc,

getDocs,

getDoc,

updateDoc,

deleteDoc,

onSnapshot

}

from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyC-iMbf7wSvFYUjk38lJCvcgIW9zXx_Zn4",

authDomain: "printcraft-system-8d4cf.firebaseapp.com",

projectId: "printcraft-system-8d4cf",

storageBucket: "printcraft-system-8d4cf.firebasestorage.app",

messagingSenderId: "615909078263",

appId: "1:615909078263:web:0abc614d2519101e958ff2"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {

db,

collection,

doc,

addDoc,

setDoc,

getDocs,

getDoc,

updateDoc,

deleteDoc,

onSnapshot

};