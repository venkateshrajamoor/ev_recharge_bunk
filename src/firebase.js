
// Initialize Firebase

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBrClUdzkkWq9Ri69ICvK0KRWqPGzWX5BM",
    authDomain: "electric-vehicle-recharg-3a634.firebaseapp.com",
    projectId: "electric-vehicle-recharg-3a634",
    storageBucket: "electric-vehicle-recharg-3a634.firebasestorage.app",
    messagingSenderId: "811040476794",
    appId: "1:811040476794:web:2064441f198b38b4f8f5c3",
    measurementId: "G-ZM354MSJ58"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
